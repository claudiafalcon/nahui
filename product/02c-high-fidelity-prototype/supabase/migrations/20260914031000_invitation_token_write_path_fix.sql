-- Stage 7 Backend Integration — `reviewer` fix round 1 on
-- `20260914030000_invitation_token_write_path.sql`.
--
-- Important — `create_invitation` re-checks `businesses.subscription_tier =
-- 'paid'` server-side before minting an Invitation (Team Invitations/"Tu
-- equipo" is structurally Paid-tier-only per `settings.md` §2.7/§3.3a, the
-- same "structurally absent on Free tier, not a demoted sub-note" discipline
-- D40 already established elsewhere). Its sibling `regenerate_invitation`
-- never performed this check — only OWNER-ship was re-verified. A Business
-- that downgrades to Free while holding an old, expired pending Invitation
-- row could still mint a fresh, working invite link via
-- `regenerate_invitation`, even though the "Generar otra" UI surface no
-- longer exists for her on Free tier — the exact "never trust the client,
-- re-check server-side" gap this pattern exists to close.
--
-- Fix: the identical tier lookup/check block `create_invitation` already
-- has, added to `regenerate_invitation` right after its existing
-- `is_active_owner_of` authorization check and before the idempotency-key
-- insert (matching `create_invitation`'s own ordering: authorize → check
-- business state → idempotency → do the write). Keyed off
-- `v_invitation.business_id` — the row already looked up by
-- `p_invitation_id` — not a client-supplied business id, since this
-- function's signature never takes one. Raises the identical
-- `paid_tier_required` exception (errcode `42501`) `create_invitation`
-- already raises.
-- ---------------------------------------------------------------------------
create or replace function public.regenerate_invitation(
  p_invitation_id uuid,
  p_idempotency_key uuid
)
returns table (token text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_invitation record;
  v_tier text;
  v_generated record;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
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

  -- Fix — same Paid-tier re-check `create_invitation` already performs,
  -- keyed off the Invitation's own `business_id` rather than a client-
  -- supplied one.
  select subscription_tier into v_tier
  from public.businesses
  where id = v_invitation.business_id;

  if v_tier <> 'paid' then
    raise exception 'paid_tier_required' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, v_invitation.business_id, 'regenerate_invitation')
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
      raise exception 'invitation_not_expired' using errcode = 'P0001';
    end if;

    return query
      select
        v_existing_result ->> 'token',
        (v_existing_result ->> 'expires_at')::timestamptz;
    return;
  end if;

  -- Re-read the current row (not the pre-idempotency-insert snapshot above)
  -- — the precondition must hold at write time, same principle as the CAS
  -- in accept_invitation.
  select * into v_invitation
  from public.invitations
  where id = p_invitation_id;

  if v_invitation.status <> 'pending' or now() < v_invitation.expires_at then
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_expired')
    where id = p_idempotency_key;
    raise exception 'invitation_not_expired' using errcode = 'P0001';
  end if;

  select * into v_generated from public._generate_invitation_token();

  update public.invitations
  set token_hash = v_generated.token_hash,
      expires_at = v_generated.expires_at
  where id = p_invitation_id;

  update public.idempotency_keys
  set result = jsonb_build_object('token', v_generated.token, 'expires_at', v_generated.expires_at)
  where id = p_idempotency_key;

  return query select v_generated.token, v_generated.expires_at;
end;
$$;

revoke execute on function public.regenerate_invitation(uuid, uuid) from public;
grant execute on function public.regenerate_invitation(uuid, uuid) to authenticated;
