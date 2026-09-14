-- Stage 7 Backend Integration, Phase 0 — reviewer-caught fixes.
--
-- Follow-up to 20260913000000_identity_persistence_layer.sql, applied as a
-- new migration rather than editing the already-live one (that migration
-- is applied to the real hosted project; never edit an applied migration).
--
-- Closes three `reviewer` findings, all confirmed real but none a live,
-- currently-exploitable cross-tenant leak (see the review's own summary):
--
-- 1. business_memberships' direct client UPDATE policy let an OWNER change
--    role/user_id/business_id on an existing row — an undocumented,
--    undesigned path around the Owner-creation and Invitation-acceptance
--    invariants' "exactly one path creates a Membership" guarantee, applied
--    to *modification* instead of *creation*. Fixed by replacing the direct
--    UPDATE policy/grant with a dedicated revoke_membership() RPC, matching
--    the same SECURITY DEFINER pattern create_business_with_owner()/
--    accept_invitation() already establish — writes go through narrow,
--    purpose-built functions, never generic table grants.
-- 2. accept_invitation()'s "cache the failure so a retry replays it" write
--    doesn't actually survive its own subsequent RAISE EXCEPTION, due to
--    ordinary PL/pgSQL transaction-abort semantics (an uncaught exception
--    rolls back everything in the current transaction, including an
--    already-executed UPDATE earlier in the same function body — there is
--    no way to both keep that write and still raise to the caller within
--    one transaction). Not a live bug — a retry safely re-derives the
--    identical negative outcome by re-running the CAS itself, which stays
--    correct either way. Fixed by correcting the function's own comment to
--    state this plainly, rather than attempting a fragile workaround for a
--    cache-miss that costs nothing beyond one redundant CAS re-check.
-- 3. accept_invitation()'s revoked-membership conflict silently resolved to
--    "success" (the Invitation consumed, a membership_id returned) while
--    the person's actual access stayed revoked (D55's "no reactivation path
--    designed" correctly honored, but reported dishonestly). Fixed by
--    detecting this specific conflict and raising a distinct,
--    honestly-named exception instead.
--
-- token_hash's algorithm (sha256/hex) is now also documented directly on
-- the column, closing the third reviewer finding (nowhere else in the repo
-- stated this before now) — see the comment below.

-- ---------------------------------------------------------------------------
-- Fix 1 — business_memberships: revoke_membership() RPC replaces the direct
-- client UPDATE policy/grant.
-- ---------------------------------------------------------------------------

drop policy if exists business_memberships_update on public.business_memberships;
revoke update on public.business_memberships from authenticated;

create or replace function public.revoke_membership(
  p_business_id uuid,
  p_membership_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- SECURITY DEFINER bypasses RLS by default — re-implementing the
  -- authorization check here, as the first real statement, is not optional.
  -- Q24/Q25's permission table (product-decisions.md) names revoking a
  -- BusinessMembership as OWNER-only.
  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- Column-scoped by construction: this function only ever sets status/
  -- revoked_at, never role/user_id/business_id — closing the gap the direct
  -- UPDATE policy left open (an OWNER reassigning a Membership's business_id
  -- or promoting a SELLER to OWNER via a raw UPDATE call, unreachable
  -- through this RPC's own fixed shape).
  update public.business_memberships
  set status = 'revoked', revoked_at = now()
  where id = p_membership_id
    and business_id = p_business_id
    and status = 'active';

  if not found then
    -- Not an error — the same "already resolved, nothing left to do"
    -- shape D55 already establishes for a revoke landing on an already-
    -- revoked or nonexistent-for-this-Business row. The client's own
    -- optimistic-update/reconcile layer treats this as a no-op success,
    -- not a failure to surface.
    return;
  end if;
end;
$$;

revoke execute on function public.revoke_membership(uuid, uuid) from public;
grant execute on function public.revoke_membership(uuid, uuid) to authenticated;

comment on function public.revoke_membership(uuid, uuid) is
  'OWNER-only. Replaces business_memberships'' original direct-UPDATE RLS '
  'policy (reviewer finding, 2026-09-13) — that policy let an OWNER change '
  'role/user_id/business_id on an existing row, not just status/revoked_at, '
  'an undesigned path around the Owner-creation/Invitation-acceptance '
  '"exactly one path creates a Membership" guarantee. This function''s own '
  'fixed UPDATE shape makes that path structurally unreachable.';

-- ---------------------------------------------------------------------------
-- Fix 2 (accept_invitation) and Fix 3 (accept_invitation) — replace the
-- whole function body rather than patch two spots separately; both fixes
-- touch overlapping lines.
-- ---------------------------------------------------------------------------

create or replace function public.accept_invitation(
  p_token text,
  p_idempotency_key uuid
)
returns table (business_id uuid, membership_id uuid)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  -- token_hash algorithm, stated explicitly here per reviewer finding 3
  -- (2026-09-13) — sha256, hex-encoded. This is the one and only place this
  -- decision currently lives; whoever wires createInvitation() (the RFC
  -- 0013 UI Migration-Workflow pass, not yet started — see
  -- context/stage-7-backend-integration.md) MUST hash the client-generated
  -- raw token with the identical algorithm/encoding before insert, or every
  -- acceptance will silently fail to match. Also documented in
  -- supabase/README.md's own Judgment calls section.
  v_token_hash text;
  v_invitation record;
  v_membership_id uuid;
  v_existing_membership record;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  insert into public.idempotency_keys (id, operation)
  values (p_idempotency_key, 'accept_invitation')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    if v_existing_result ? 'error' then
      raise exception using
        message = v_existing_result ->> 'error',
        errcode = 'P0001';
    end if;

    return query
      select
        (v_existing_result ->> 'business_id')::uuid,
        (v_existing_result ->> 'membership_id')::uuid;
    return;
  end if;

  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');

  update public.invitations
  set status = 'accepted', accepted_by_user_id = v_uid
  where token_hash = v_token_hash
    and status = 'pending'
    and now() < expires_at
  returning * into v_invitation;

  if v_invitation is null then
    -- Fix 2: this UPDATE is best-effort, not guaranteed to survive — the
    -- RAISE EXCEPTION below aborts the entire enclosing transaction under
    -- ordinary PL/pgSQL semantics, which unavoidably rolls this write back
    -- too (there is no way to keep a write from earlier in this same
    -- function body while still raising to the caller, short of a genuine
    -- autonomous-transaction mechanism this project has no need for).
    -- Confirmed not a live bug (reviewer, 2026-09-13): a retry with the
    -- same idempotency key simply re-runs this exact CAS and re-derives the
    -- identical, correct "not available" outcome — the cache is purely a
    -- best-effort optimization to skip that redundant re-check, never a
    -- correctness requirement. The original comment here overstated this
    -- as reliable persistence; corrected.
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_available')
    where id = p_idempotency_key;
    raise exception 'invitation_not_available' using errcode = 'P0001';
  end if;

  -- Fix 3: check for a pre-existing (necessarily revoked, since 'active'
  -- would already violate the (user_id, business_id) unique constraint the
  -- Invitation couldn't have been pending against) Membership BEFORE
  -- attempting the insert, so a revoked member accepting a fresh Invitation
  -- gets an honest, distinct failure — not a false "success" that leaves
  -- her Invitation consumed and her access still revoked. D55's "no
  -- reactivation path designed" stays exactly as true as before; only the
  -- reported outcome changes, from a misleading success to an honest
  -- refusal.
  select * into v_existing_membership
  from public.business_memberships
  where user_id = v_uid and business_id = v_invitation.business_id;

  if v_existing_membership.id is not null then
    -- Same best-effort caching caveat as the branch above.
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'membership_revoked')
    where id = p_idempotency_key;
    raise exception 'membership_revoked' using errcode = 'P0001';
  end if;

  insert into public.business_memberships (user_id, business_id, role, status)
  values (v_uid, v_invitation.business_id, 'SELLER', 'active')
  returning id into v_membership_id;

  update public.idempotency_keys
  set business_id = v_invitation.business_id,
      result = jsonb_build_object('business_id', v_invitation.business_id, 'membership_id', v_membership_id)
  where id = p_idempotency_key;

  return query select v_invitation.business_id, v_membership_id;
end;
$$;

revoke execute on function public.accept_invitation(text, uuid) from public;
grant execute on function public.accept_invitation(text, uuid) to authenticated;

comment on function public.accept_invitation(text, uuid) is
  'Invitation-acceptance invariant (D56, reworked RFC 0013/D64). Two named '
  'failure modes distinct from a generic platform error: '
  '''invitation_not_available'' (already accepted/revoked/expired, or a '
  'losing actor in a same-token race, RFC 0013 Section 2 step 6) and '
  '''membership_revoked'' (this person already held, and lost, access to '
  'this Business — D55''s no-reactivation rule, surfaced honestly rather '
  'than silently reported as success — reviewer finding, 2026-09-13). Both '
  'exceptions'' idempotency-key cache write is best-effort only (see the '
  'function body''s own comment) — retry-safety never depends on it.';

-- ---------------------------------------------------------------------------
-- Fix 3 (documentation half) — token_hash algorithm on the column itself,
-- so a future createInvitation() implementer finds it without having to
-- read this function's source.
-- ---------------------------------------------------------------------------
comment on column public.invitations.token_hash is
  'sha256(raw_token), hex-encoded — encode(digest(token, ''sha256''), '
  '''hex''). Must match accept_invitation()''s own hashing exactly. The raw '
  'token itself is never stored (RFC 0013 Section 4) — generate it '
  'client-side or in the Edge Function that will eventually implement '
  'createInvitation() (RFC 0013''s UI Migration-Workflow pass, not yet '
  'started), hash it with this exact algorithm before insert, and give the '
  'raw value to the OWNER once, at generation time, per '
  '''product/02-ux/settings.md'' Section 3.12c''s one-time-display screen.';
