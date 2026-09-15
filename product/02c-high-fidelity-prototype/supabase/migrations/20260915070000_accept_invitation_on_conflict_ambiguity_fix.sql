-- Second instance of the same `RETURNS TABLE` collision, found live by
-- actually executing `accept_invitation` through its "already a member"
-- branch inside a rolled-back diagnostic transaction (real synthetic data,
-- never committed) right after `20260915060000` deployed — the fix above
-- corrected the WHERE clause, but `INSERT ... ON CONFLICT (user_id,
-- business_id)`'s own conflict target list has the identical hazard, and a
-- table-qualified name (`business_memberships.business_id`) isn't valid
-- syntax inside an ON CONFLICT column list, so the WHERE-clause fix's own
-- technique doesn't apply here. Naming the actual unique constraint instead
-- of the column list sidesteps the ambiguity entirely — no column
-- identifiers appear in the ON CONFLICT clause at all.
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
  on conflict on constraint business_memberships_user_id_business_id_key do nothing
  returning id into v_membership_id;

  if v_membership_id is null then
    select status into v_membership_status
    from public.business_memberships
    where user_id = v_uid and business_memberships.business_id = v_invitation.business_id;

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
