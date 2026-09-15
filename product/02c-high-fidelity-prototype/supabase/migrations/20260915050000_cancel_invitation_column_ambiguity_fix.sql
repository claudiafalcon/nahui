-- Third instance of the same real Blocker found via live production
-- testing (2026-09-15, `merchant-user-tester` walkthrough): `cancel_invitation`
-- ("Cancelar invitación" in Configuración → Tu equipo) failed with
-- {"code":"42702","message":"column reference \"status\" is ambiguous"}
-- on every real call. Same root cause as `start_session`
-- (`20260915030000_...`) and `finalize_sale` (`20260915040000_...`):
-- `RETURNS TABLE (invitation_id uuid, status text)` implicitly declares
-- `status` as a PL/pgSQL variable, colliding with `public.invitations`'
-- own `status` column, referenced bare in the `UPDATE ... SET status =
-- ... WHERE ... status = ...` statement. This is now the third distinct
-- function found this way, live, confirming this is a systemic pattern
-- risk across this project's SQL, not an isolated defect — see
-- `supabase/README.md`'s own updated process note on mandatory execution
-- verification going forward.
--
-- Fix: qualify both ambiguous `status` references with the table name.
-- No other logic changes.
create or replace function public.cancel_invitation(
  p_invitation_id uuid,
  p_idempotency_key uuid
)
returns table (invitation_id uuid, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_invitation record;
  v_cancelled_id uuid;
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

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, v_invitation.business_id, 'cancel_invitation')
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
      raise exception 'invitation_not_pending' using errcode = 'P0001';
    end if;

    return query
      select
        (v_existing_result ->> 'invitation_id')::uuid,
        v_existing_result ->> 'status';
    return;
  end if;

  update public.invitations
  set status = 'revoked'
  where id = p_invitation_id
    and invitations.status = 'pending'
  returning id into v_cancelled_id;

  if v_cancelled_id is null then
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_pending')
    where id = p_idempotency_key;
    raise exception 'invitation_not_pending' using errcode = 'P0001';
  end if;

  update public.idempotency_keys
  set result = jsonb_build_object('invitation_id', v_cancelled_id, 'status', 'revoked')
  where id = p_idempotency_key;

  return query select v_cancelled_id, 'revoked'::text;
end;
$$;

revoke execute on function public.cancel_invitation(uuid, uuid) from public;
grant execute on function public.cancel_invitation(uuid, uuid) to authenticated;
