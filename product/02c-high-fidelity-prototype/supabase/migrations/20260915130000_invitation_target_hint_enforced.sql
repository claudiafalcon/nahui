-- Stage 7 Backend Integration — `product/99-rfc/0014-invitation-target-hint-
-- enforced.md` (Accepted), `decision-log.md` D70, `product-decisions.md`
-- Q30: `Invitation.targetHint` becomes required at creation, and acceptance
-- authenticates specifically through it.
--
-- Four changes, in dependency order:
--   1. `create_invitation()` — reject a null `p_target_hint` going forward.
--      Signature unchanged (`p_target_hint jsonb default null` stays the
--      declared signature so `create or replace` doesn't need a drop-and-
--      recreate; the default is now dead for any *new* caller, since
--      `settings.md` §3.12's own corrected UI never omits the argument, but
--      keeping the parameter's own shape untouched is the smaller, safer
--      diff).
--   2. `accept_invitation()` — a new defensive precondition,
--      `invitation_identity_mismatch`, checked before the status CAS
--      (never after — a mismatched attempt must never consume the token).
--      Restructured from a single CAS `UPDATE` into a read-then-check-then-
--      CAS shape, since the mismatch check needs the row's own
--      `target_hint` value before deciding whether to touch it at all.
--      Same pass also fixes a real, pre-existing bug in the idempotency-
--      replay branch: it unconditionally replayed `invitation_not_
--      available` for *any* cached error, silently mislabeling a replayed
--      `already_member`/`membership_revoked`/(now) `invitation_identity_
--      mismatch` outcome — found while extending this exact branch for the
--      new error, not a separate, later-discovered defect.
--   3. `update_invitation_target_hint()` — new RPC, `settings.md` §3.12e
--      "Editar correo"/"Agregar correo." An ordinary UPDATE on the
--      still-`pending` row (no token/expiry touch), OWNER-scoped, wrapped
--      as a SECURITY DEFINER RPC only to match this codebase's own uniform
--      "every write is an RPC call" convention — RFC 0014 itself confirms
--      the existing `invitations_update` RLS policy already permits this
--      OWNER-scoped UPDATE with no new grant needed.
--   4. `peek_invitation()` — now also returns `target_hint`, so
--      `authentication.md` §3.2g can show the locked, pre-filled address
--      before any authentication runs. Not a new disclosure — §3.2g already
--      shows this exact value, unlocked, to anyone who opens the link and
--      taps "Aceptar," before typing anything.

-- ---------------------------------------------------------------------------
-- 1. create_invitation — target_hint now required.
-- ---------------------------------------------------------------------------
create or replace function public.create_invitation(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_target_hint jsonb default null
)
returns table (invitation_id uuid, token text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_tier text;
  v_generated record;
  v_invitation_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- RFC 0014/D70 — the one new precondition this function gains. Checked
  -- before the idempotency-key insert, matching `update_business_identity`'s
  -- own `name_required` check's own placement (a validation failure never
  -- consumes an idempotency-key slot for an attempt that was never going to
  -- succeed).
  if p_target_hint is null or coalesce(btrim(p_target_hint ->> 'value'), '') = '' then
    raise exception 'target_hint_required' using errcode = '23514';
  end if;

  select subscription_tier into v_tier
  from public.businesses
  where id = p_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;

  if v_tier <> 'paid' then
    raise exception 'paid_tier_required' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'create_invitation')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    return query
      select
        (v_existing_result ->> 'invitation_id')::uuid,
        v_existing_result ->> 'token',
        (v_existing_result ->> 'expires_at')::timestamptz;
    return;
  end if;

  select * into v_generated from public._generate_invitation_token();

  insert into public.invitations (business_id, token_hash, expires_at, target_hint)
  values (p_business_id, v_generated.token_hash, v_generated.expires_at, p_target_hint)
  returning id into v_invitation_id;

  update public.idempotency_keys
  set business_id = p_business_id,
      result = jsonb_build_object(
        'invitation_id', v_invitation_id,
        'token', v_generated.token,
        'expires_at', v_generated.expires_at
      )
  where id = p_idempotency_key;

  return query select v_invitation_id, v_generated.token, v_generated.expires_at;
end;
$$;

revoke execute on function public.create_invitation(uuid, uuid, jsonb) from public;
grant execute on function public.create_invitation(uuid, uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. accept_invitation — invitation_identity_mismatch precondition, plus
--    the idempotency-replay bug fix (both described in this file's own
--    header comment above).
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
  v_token_hash text;
  v_invitation record;
  v_membership_id uuid;
  v_membership_status text;
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

    -- Bug fix (this file's own header comment, item 2) — replay whichever
    -- error was actually cached, never unconditionally
    -- `invitation_not_available`. `raise exception '%'` interpolates the
    -- cached message text as the exception's own message, which is exactly
    -- what `store.tsx`'s `error?.message === '...'` string-match reads.
    if v_existing_result ? 'error' then
      raise exception using message = (v_existing_result ->> 'error'), errcode = 'P0001';
    end if;

    return query
      select
        (v_existing_result ->> 'business_id')::uuid,
        (v_existing_result ->> 'membership_id')::uuid;
    return;
  end if;

  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');

  -- Read-then-check-then-CAS (RFC 0014/D70) — was a single CAS `UPDATE`;
  -- restructured because the mismatch check below needs the row's own
  -- `target_hint` *before* deciding whether the acceptance may proceed at
  -- all, and a mismatched attempt must never touch `status` (D70's own
  -- "checked before the status CAS itself" requirement).
  select * into v_invitation
  from public.invitations
  where token_hash = v_token_hash
    and status = 'pending'
    and now() < expires_at;

  if v_invitation is null then
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_available')
    where id = p_idempotency_key;
    raise exception 'invitation_not_available' using errcode = 'P0001';
  end if;

  -- RFC 0014/D70's own precondition — a legacy, hint-less `pending` row
  -- (`target_hint is null`) is exempt by construction (the RFC's own
  -- backward-compatibility rule): there's nothing to check a verified
  -- email against, so every legacy row behaves exactly as before this
  -- migration.
  if v_invitation.target_hint is not null then
    if not exists (
      select 1
      from public.auth_identities ai
      where ai.user_id = v_uid
        and ai.type = 'email'
        and lower(btrim(ai.identifier)) = lower(btrim(v_invitation.target_hint ->> 'value'))
    ) then
      update public.idempotency_keys
      set result = jsonb_build_object('error', 'invitation_identity_mismatch')
      where id = p_idempotency_key;
      raise exception 'invitation_identity_mismatch' using errcode = 'P0001';
    end if;
  end if;

  -- The CAS itself, now a second, narrower statement — re-tests `status`/
  -- `expires_at` at write time (never trusts the read above, which could
  -- already be stale by the time execution reaches here: RFC 0013's own
  -- same-token-race concern, unchanged by this migration).
  update public.invitations
  set status = 'accepted', accepted_by_user_id = v_uid
  where id = v_invitation.id
    and status = 'pending'
    and now() < expires_at
  returning * into v_invitation;

  if v_invitation is null then
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_available')
    where id = p_idempotency_key;
    raise exception 'invitation_not_available' using errcode = 'P0001';
  end if;

  insert into public.business_memberships (user_id, business_id, role, status)
  values (v_uid, v_invitation.business_id, 'SELLER', 'active')
  on conflict on constraint business_memberships_user_id_business_id_key do nothing
  returning id into v_membership_id;

  if v_membership_id is null then
    select status into v_membership_status
    from public.business_memberships
    where user_id = v_uid and business_memberships.business_id = v_invitation.business_id;

    if v_membership_status = 'revoked' then
      update public.idempotency_keys
      set result = jsonb_build_object('error', 'membership_revoked')
      where id = p_idempotency_key;
      raise exception 'membership_revoked' using errcode = 'P0001';
    else
      update public.idempotency_keys
      set result = jsonb_build_object('error', 'already_member')
      where id = p_idempotency_key;
      raise exception 'already_member' using errcode = 'P0001';
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

-- ---------------------------------------------------------------------------
-- 3. update_invitation_target_hint — settings.md §3.12e "Editar correo"/
--    "Agregar correo." OWNER-only, idempotency-keyed (matching this
--    codebase's own uniform convention — see this file's own header comment,
--    item 3, for why an RPC wrapper at all when the underlying operation is
--    naturally idempotent). Requires a non-empty value — this sheet never
--    offers a way to clear a hint back to null (`settings.md` §3.12e's own
--    text: "this sheet never offers a way to *remove* a hint that's set").
-- ---------------------------------------------------------------------------
create or replace function public.update_invitation_target_hint(
  p_invitation_id uuid,
  p_idempotency_key uuid,
  p_target_hint jsonb
)
returns table (invitation_id uuid)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_invitation record;
  v_updated_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if p_target_hint is null or coalesce(btrim(p_target_hint ->> 'value'), '') = '' then
    raise exception 'target_hint_required' using errcode = '23514';
  end if;

  select * into v_invitation
  from public.invitations
  where id = p_invitation_id;

  if not found then
    raise exception 'invitation_not_found' using errcode = 'P0002';
  end if;

  if not public.is_active_owner_of(v_invitation.business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, v_invitation.business_id, 'update_invitation_target_hint')
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
      raise exception using message = (v_existing_result ->> 'error'), errcode = 'P0001';
    end if;

    return query select (v_existing_result ->> 'invitation_id')::uuid;
    return;
  end if;

  -- Re-checks `status = 'pending'` at write time — same "not a stale client
  -- read" discipline as every other CAS-adjacent write in this codebase.
  -- Deliberately `status = 'pending'` only (expiry-independent), matching
  -- `cancel_invitation`'s own precedent: §3.12e itself is unreachable from
  -- an expired/revoked/cancelled row's own UI (no "Editar correo" action
  -- renders there), so this mirrors that restriction server-side rather
  -- than silently allowing a write the UI never offers.
  update public.invitations
  set target_hint = p_target_hint
  where id = p_invitation_id
    and status = 'pending'
  returning id into v_updated_id;

  if v_updated_id is null then
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_pending')
    where id = p_idempotency_key;
    raise exception 'invitation_not_pending' using errcode = 'P0001';
  end if;

  update public.idempotency_keys
  set result = jsonb_build_object('invitation_id', v_updated_id)
  where id = p_idempotency_key;

  return query select v_updated_id;
end;
$$;

revoke execute on function public.update_invitation_target_hint(uuid, uuid, jsonb) from public;
grant execute on function public.update_invitation_target_hint(uuid, uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. peek_invitation — now also returns target_hint (authentication.md
--    §3.2g needs it pre-auth). Signature is unchanged (still `p_token
--    text`), only the returned table's shape gains a column — `create or
--    replace` on a function whose `returns table` shape changes requires a
--    drop first in Postgres, so this is a `drop` + fresh `create`, not a
--    bare `create or replace` (which would otherwise error:
--    "cannot change return type of existing function").
-- ---------------------------------------------------------------------------
drop function if exists public.peek_invitation(text);

create or replace function public.peek_invitation(p_token text)
returns table (business_name text, status text, expires_at timestamptz, target_hint jsonb)
language plpgsql
security definer
stable
set search_path = public, extensions
as $$
declare
  v_token_hash text;
begin
  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');

  return query
    select
      b.name,
      case
        when i.status = 'pending' and now() > i.expires_at then 'expired'
        else i.status
      end,
      i.expires_at,
      i.target_hint
    from public.invitations i
    join public.businesses b on b.id = i.business_id
    where i.token_hash = v_token_hash;
end;
$$;

-- Deliberately never grants anon/authenticated EXECUTE here (unlike this
-- function's own original migration) — `drop function` above discarded
-- every prior grant on the old function object, and `peek_invitation` was
-- already corrected, later, to service_role-only
-- (`20260914060000_peek_invitation_rate_limit.sql` revokes anon/
-- authenticated and fronts every real call with the rate-limiting
-- `peek-invitation` Edge Function; `20260915010000_peek_invitation_
-- service_role_execute.sql` closes a second, separate service_role-EXECUTE
-- gap that migration itself left open). Re-granting anon/authenticated
-- here, even transiently, would silently reopen the token-enumeration
-- surface those two migrations closed. Applying their combined, final
-- grant state directly, in one step, rather than re-deriving it via an
-- intermediate grant-then-revoke.
revoke execute on function public.peek_invitation(text) from public;
grant execute on function public.peek_invitation(text) to service_role;
