-- Stage 7 Backend Integration — events.md §3.22a "Escaneando — cola de
-- escaneo (mixta, multi-Producto)" (decision-log.md D71, product-decisions.md
-- Q31). scan_unit_into_event_allocation requires and validates a pre-known
-- p_product_id (raises tag_wrong_product otherwise) — a precondition §3.22a
-- structurally cannot satisfy, since no Product is pre-selected on that
-- screen. This variant resolves the scanned tag's own product_id directly
-- instead of taking it as a parameter, then mint-or-finds that Product's own
-- EventAllocation row exactly as the existing function does. Same OWNER-only/
-- idempotency-keyed/FIFO-commit shape — copied, not reinvented, per D71's own
-- "reuses EventAllocation's existing (event_id, product_id) uniqueness,
-- no new field or aggregate" ruling.
create or replace function public.scan_unit_into_event_allocation_any_product(
  p_business_id uuid,
  p_event_id uuid,
  p_tag_identifier text,
  p_idempotency_key uuid
)
returns table (event_allocation_id uuid, unit_id uuid, product_id uuid, movement_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_resolved_unit_id uuid;
  v_resolved_product_id uuid;
  v_alloc_id uuid;
  v_commit record;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'scan_unit_into_event_allocation_any_product')
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
        (v_existing_result ->> 'event_allocation_id')::uuid,
        (v_existing_result ->> 'unit_id')::uuid,
        (v_existing_result ->> 'product_id')::uuid,
        (v_existing_result ->> 'movement_id')::uuid;
    return;
  end if;

  if not exists (select 1 from public.events where id = p_event_id and business_id = p_business_id) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;

  select nt.unit_id into v_resolved_unit_id
  from public.nfc_tags nt
  where nt.business_id = p_business_id and nt.tag_identifier = p_tag_identifier;

  if v_resolved_unit_id is null then
    raise exception 'tag_not_found' using errcode = 'P0001';
  end if;

  select iu.product_id into v_resolved_product_id
  from public.inventory_units iu
  where iu.id = v_resolved_unit_id;

  if v_resolved_product_id is null then
    raise exception 'tag_not_found' using errcode = 'P0001';
  end if;

  select ea.id into v_alloc_id
  from public.event_allocations ea
  where ea.event_id = p_event_id and ea.product_id = v_resolved_product_id;

  if v_alloc_id is null then
    insert into public.event_allocations (business_id, event_id, product_id)
    values (p_business_id, p_event_id, v_resolved_product_id)
    returning id into v_alloc_id;
  end if;

  select * into v_commit
  from public._fifo_commit_to_allocation(
    p_business_id, v_alloc_id, v_resolved_product_id, 'scan', null, array[v_resolved_unit_id], null, null
  );

  if v_commit.movement_id is null then
    raise exception 'unit_already_committed' using errcode = 'P0001';
  end if;

  update public.idempotency_keys
  set result = jsonb_build_object(
    'event_allocation_id', v_alloc_id,
    'unit_id', v_resolved_unit_id,
    'product_id', v_resolved_product_id,
    'movement_id', v_commit.movement_id
  )
  where id = p_idempotency_key;

  return query select v_alloc_id, v_resolved_unit_id, v_resolved_product_id, v_commit.movement_id;
end;
$$;

revoke execute on function public.scan_unit_into_event_allocation_any_product(uuid, uuid, text, uuid) from public;
grant execute on function public.scan_unit_into_event_allocation_any_product(uuid, uuid, text, uuid) to authenticated;
