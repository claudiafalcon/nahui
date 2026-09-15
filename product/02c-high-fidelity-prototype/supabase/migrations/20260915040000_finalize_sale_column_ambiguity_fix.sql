-- Real Blocker, found via the Product Owner's own live production testing
-- (2026-09-15, `merchant-user-tester` walkthrough): `finalize_sale`
-- ("Finalizar Venta" — the single most consequential action in the whole
-- app) has failed on every real call since it was first deployed, with
-- zero client-visible error (the client's own `finalizeSale` collapses
-- any RPC failure to a silent `console.error` + `return null` — a
-- separate, already-named gap, not fixed in this migration). Confirmed
-- directly via a live call from the Product Owner's own authenticated
-- session:
--   {"code":"42702","message":"column reference \"sale_id\" is ambiguous"}
--
-- Same root cause class as `start_session`'s own fix
-- (`20260915030000_start_session_column_ambiguity_fix.sql`), but a wider
-- instance of it: `RETURNS TABLE (sale_id uuid, finalized_at timestamptz)`
-- implicitly declares `sale_id` as a PL/pgSQL variable in this function's
-- own scope — but unlike `start_session`, the ambiguity here isn't in a
-- `RETURNING`/`SELECT INTO` clause, it's in two ordinary `WHERE` clauses
-- that reference `public.sale_items.sale_id` bare (`where sale_id =
-- v_sale_id`), which collides with the same implicit OUT-parameter name.
-- This confirms the bug class is broader than "RETURNING/SELECT INTO
-- only" — any bare reference to a column sharing a name with a
-- `RETURNS TABLE` output column is at risk, anywhere in the function
-- body, not only in an INTO-target list.
--
-- Fix: qualify both ambiguous `sale_id` references with the table name.
-- No other logic in this function changes.
create or replace function public.finalize_sale(
  p_business_id uuid,
  p_idempotency_key uuid
)
returns table (sale_id uuid, finalized_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_membership_id uuid;
  v_session_id uuid;
  v_sale_id uuid;
  v_finalized_at timestamptz := now();
  v_item_count int;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'finalize_sale')
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
      raise exception using message = v_existing_result ->> 'error', errcode = 'P0001';
    end if;

    return query
      select
        (v_existing_result ->> 'sale_id')::uuid,
        (v_existing_result ->> 'finalized_at')::timestamptz;
    return;
  end if;

  select id into v_session_id
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is not null then
    select id into v_sale_id from public.sales where session_id = v_session_id and status = 'open';
  end if;

  if v_sale_id is not null then
    select count(*) into v_item_count from public.sale_items where sale_items.sale_id = v_sale_id;
  end if;

  if v_sale_id is null or v_item_count = 0 then
    raise exception 'no_open_sale' using errcode = 'P0001';
  end if;

  update public.inventory_units
  set status = 'sold'
  where id in (select unit_id from public.sale_items where sale_items.sale_id = v_sale_id);

  update public.sales
  set status = 'finalized', finalized_at = v_finalized_at
  where id = v_sale_id;

  update public.idempotency_keys
  set result = jsonb_build_object('sale_id', v_sale_id, 'finalized_at', v_finalized_at)
  where id = p_idempotency_key;

  return query select v_sale_id, v_finalized_at;
end;
$$;

revoke execute on function public.finalize_sale(uuid, uuid) from public;
grant execute on function public.finalize_sale(uuid, uuid) to authenticated;
