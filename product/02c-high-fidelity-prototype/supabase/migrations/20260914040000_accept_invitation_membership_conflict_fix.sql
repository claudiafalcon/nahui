-- Stage 7 Backend Integration — `architect` Blocker fix on
-- `20260913000000_identity_persistence_layer.sql`'s `accept_invitation`.
--
-- `already_member`/`membership_revoked` (RFC 0013/D64, authentication.md
-- §2.2a, store.tsx's acceptInvitation) were never actually raised: a
-- pre-existing BusinessMembership row (active OR revoked) for
-- (user_id, business_id) made the membership insert no-op via
-- `on conflict do nothing`, and the fallback select then returned that
-- row's id as if this were a fresh success.
--
-- Fix: on conflict, look up the pre-existing row's own status and raise
-- the exact exception name `store.tsx` already hard-codes a string match
-- against, instead of silently returning success.
--
-- Invitation-status disposition (deliberately not special-cased): both new
-- branches raise an uncaught exception, which aborts this entire
-- transaction and rolls back every write this invocation performed,
-- including the CAS's own `status = 'accepted'` update a few lines above
-- — the Invitation stays exactly `pending`, as if this call never touched
-- it. Same mechanism `invitation_not_available`'s branch, unchanged below,
-- already relies on in this same function.
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

    if v_existing_result ? 'error' then
      raise exception 'invitation_not_available' using errcode = 'P0001';
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
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_available')
    where id = p_idempotency_key;
    raise exception 'invitation_not_available' using errcode = 'P0001';
  end if;

  insert into public.business_memberships (user_id, business_id, role, status)
  values (v_uid, v_invitation.business_id, 'SELLER', 'active')
  on conflict (user_id, business_id) do nothing
  returning id into v_membership_id;

  if v_membership_id is null then
    select status into v_membership_status
    from public.business_memberships
    where user_id = v_uid and business_id = v_invitation.business_id;

    if v_membership_status = 'revoked' then
      raise exception 'membership_revoked' using errcode = 'P0001';
    else
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
