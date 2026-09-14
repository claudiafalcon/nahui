-- Stage 7 Backend Integration, Phase 0 — round-2 reviewer-caught fixes.
--
-- Follow-up to 20260913010000_identity_persistence_layer_fixes.sql, applied
-- as a new migration rather than editing an already-applied one.
--
-- Closes two `reviewer` findings on that migration's own accept_invitation()
-- rewrite (2026-09-13, second pass):
--
-- 1. Fix 3's pre-check-then-insert shape reintroduced a race condition the
--    original code specifically guarded against: two concurrent
--    accept_invitation() calls for the same (user_id, business_id) — e.g.
--    two different, both-still-pending Invitations to the same Business —
--    could both pass the "no existing row" SELECT before either INSERT
--    commits, so the second INSERT then hits an unhandled unique-violation
--    (23505) instead of a graceful named exception. Fixed by restoring the
--    original INSERT ... ON CONFLICT (user_id, business_id) DO NOTHING
--    shape — the conflict-or-not outcome of that single atomic statement is
--    what decides the branch, not a separate, racy SELECT beforehand.
-- 2. Fix 3's comment claimed a pre-existing membership row found here "must"
--    be revoked, reasoning that an active row would already violate the
--    (user_id, business_id) unique constraint. That's false: the
--    constraint only guarantees at most one row ever exists for the pair —
--    it says nothing about that row's status. Since Invitations are never
--    matched against identity at creation (target_hint is advisory only),
--    an already-ACTIVE member (the Business's own OWNER, or a previously-
--    accepted SELLER) can genuinely open a still-pending Invitation link
--    for a Business she already belongs to — e.g. an OWNER generates a
--    second link for the wrong person, or clicks her own invite out of
--    curiosity. Reaching Fix 3's branch with an ACTIVE row and raising
--    'membership_revoked' mislabels this case — not a security hole (still
--    fails safe, never grants a false success), but a real correctness/UX
--    bug. Fixed by branching on the existing row's actual status instead of
--    assuming it, with a new, distinct 'already_member' outcome for the
--    active case.

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
  -- token_hash algorithm — sha256, hex-encoded. See the column's own
  -- comment (public.invitations.token_hash) for the full note; unchanged
  -- by this migration.
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
    -- Best-effort cache write only — does not survive this transaction's
    -- own abort below. See 20260913010000's header comment for the full
    -- PL/pgSQL transaction-semantics note; unchanged by this migration.
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_available')
    where id = p_idempotency_key;
    raise exception 'invitation_not_available' using errcode = 'P0001';
  end if;

  -- Fix 1 (this migration) — atomic INSERT ... ON CONFLICT replaces the
  -- prior pre-check-then-INSERT shape, closing the race window between two
  -- concurrent accept_invitation() calls for the same (user_id,
  -- business_id) pair.
  insert into public.business_memberships (user_id, business_id, role, status)
  values (v_uid, v_invitation.business_id, 'SELLER', 'active')
  on conflict (user_id, business_id) do nothing
  returning id into v_membership_id;

  if v_membership_id is null then
    -- Fix 2 (this migration) — a row already existed for this (user_id,
    -- business_id) pair (that's what triggered the conflict); branch on
    -- its actual current status rather than assuming which one it must be.
    select * into v_existing_membership
    from public.business_memberships
    where user_id = v_uid and business_id = v_invitation.business_id;

    if v_existing_membership.status = 'active' then
      -- She already holds active access to this Business (its OWNER, or a
      -- previously-accepted SELLER) — this Invitation's link was reachable
      -- but redundant, not a revoked-access case. The Invitation itself
      -- still gets consumed above (status already flipped to 'accepted'),
      -- same as every other outcome of opening a valid, pending link.
      update public.idempotency_keys
      set result = jsonb_build_object('error', 'already_member')
      where id = p_idempotency_key;
      raise exception 'already_member' using errcode = 'P0001';
    else
      -- status = 'revoked' — D55's "no reactivation path designed" case,
      -- reported honestly rather than as a false success.
      update public.idempotency_keys
      set result = jsonb_build_object('error', 'membership_revoked')
      where id = p_idempotency_key;
      raise exception 'membership_revoked' using errcode = 'P0001';
    end if;
  end if;

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
  'Invitation-acceptance invariant (D56, reworked RFC 0013/D64). Three named '
  'failure modes distinct from a generic platform error: '
  '''invitation_not_available'' (already accepted/revoked/expired, or a '
  'losing actor in a same-token race, RFC 0013 Section 2 step 6), '
  '''already_member'' (this person already holds active access to this '
  'Business — reviewer finding, 2026-09-13 round 2, corrects an earlier '
  'draft that mislabeled this case ''membership_revoked''), and '
  '''membership_revoked'' (this person already held, and lost, access to '
  'this Business — D55''s no-reactivation rule, surfaced honestly rather '
  'than silently reported as success). All three exceptions'' idempotency-'
  'key cache write is best-effort only — retry-safety never depends on it, '
  'since the membership INSERT ... ON CONFLICT itself is what makes this '
  'function safe under concurrent callers, not the cache.';

-- ---------------------------------------------------------------------------
-- Suggestion (reviewer, 2026-09-13) — revoke_membership's own comment cited
-- Q24/Q25's permission table by inference ("invite/manage staff") rather
-- than the actual OWNER-only-revoke rule's real, more precise source.
-- ---------------------------------------------------------------------------
comment on function public.revoke_membership(uuid, uuid) is
  'OWNER-only — decision-log.md D55, product/02-ux/settings.md Section 2.7/'
  '3.13''s OWNER-only "Quitar" action. Replaces business_memberships'' '
  'original direct-UPDATE RLS policy (reviewer finding, 2026-09-13) — that '
  'policy let an OWNER change role/user_id/business_id on an existing row, '
  'not just status/revoked_at, an undesigned path around the Owner-'
  'creation/Invitation-acceptance "exactly one path creates a Membership" '
  'guarantee. This function''s own fixed UPDATE shape makes that path '
  'structurally unreachable.';
