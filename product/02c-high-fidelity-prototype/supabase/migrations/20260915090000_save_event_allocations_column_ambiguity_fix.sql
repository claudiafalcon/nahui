-- Live-found (2026-09-15), same execution-before-done discipline as the
-- other fixes tonight — found by static reading of the whole body (this
-- function's `RETURNS TABLE` has 8 columns, several with common names),
-- confirmed the two real instances live below. Same class as every other
-- fix tonight: `RETURNS TABLE (product_id, event_allocation_id,
-- quantity_allocated, status, movement_id, movement_type,
-- movement_unit_ids, movement_quantity_delta)` implicitly declares each of
-- those as a PL/pgSQL variable, so a bare `event_allocations.status`/
-- `event_allocations.product_id` reference collides.
--
-- Two real instances, both around the same lookup/create step: a bare
-- `product_id` in the initial allocation lookup's WHERE clause, and a bare
-- `status` in both that lookup's SELECT list and the fallback INSERT's
-- RETURNING clause (the branch that runs the first time a Product is
-- allocated for a given Event — every earlier real call in this project
-- happened to hit the "existing allocation" branch instead, which never
-- executes either of these two statements).
create or replace function public.save_event_allocations(
  p_business_id uuid,
  p_event_id uuid,
  p_idempotency_key uuid,
  p_changes jsonb
)
returns table (
  product_id uuid,
  event_allocation_id uuid,
  quantity_allocated int,
  status text,
  movement_id uuid,
  movement_type text,
  movement_unit_ids uuid[],
  movement_quantity_delta int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_cached_row jsonb;
  v_change jsonb;
  v_product_id uuid;
  v_quantity int;
  v_alloc_id uuid;
  v_alloc_status text;
  v_remaining int;
  v_delta int;
  v_commit record;
  v_release record;
  v_movement_id uuid;
  v_movement_type text;
  v_movement_unit_ids uuid[];
  v_movement_delta int;
  v_result_rows jsonb := '[]'::jsonb;
  i int;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if not exists (select 1 from public.events where id = p_event_id and business_id = p_business_id) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'save_event_allocations')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    for v_cached_row in select * from jsonb_array_elements(v_existing_result -> 'rows') loop
      product_id := (v_cached_row ->> 'product_id')::uuid;
      event_allocation_id := (v_cached_row ->> 'event_allocation_id')::uuid;
      quantity_allocated := (v_cached_row ->> 'quantity_allocated')::int;
      status := v_cached_row ->> 'status';
      movement_id := nullif(v_cached_row ->> 'movement_id', '')::uuid;
      movement_type := v_cached_row ->> 'movement_type';
      select array_agg(elem::uuid) into movement_unit_ids
      from jsonb_array_elements_text(coalesce(v_cached_row -> 'movement_unit_ids', '[]'::jsonb)) as elem;
      movement_quantity_delta := nullif(v_cached_row ->> 'movement_quantity_delta', '')::int;
      return next;
    end loop;
    return;
  end if;

  for i in 0 .. jsonb_array_length(p_changes) - 1 loop
    v_change := p_changes -> i;
    v_product_id := (v_change ->> 'product_id')::uuid;
    v_quantity := (v_change ->> 'quantity')::int;

    if not exists (select 1 from public.products where id = v_product_id and business_id = p_business_id) then
      raise exception 'product_not_found' using errcode = 'P0002';
    end if;

    select event_allocations.id, event_allocations.status into v_alloc_id, v_alloc_status
    from public.event_allocations
    where event_id = p_event_id and event_allocations.product_id = v_product_id;

    if v_alloc_id is null then
      if v_quantity <= 0 then
        continue; -- nothing to create for a still-zero row
      end if;
      insert into public.event_allocations (business_id, event_id, product_id)
      values (p_business_id, p_event_id, v_product_id)
      returning event_allocations.id, event_allocations.status into v_alloc_id, v_alloc_status;
      v_remaining := 0;
    else
      select count(*) into v_remaining
      from public.event_allocation_units eau
      join public.inventory_units iu on iu.id = eau.unit_id
      where eau.event_allocation_id = v_alloc_id
        and eau.unit_source = 'fifo_assignment'
        and iu.status = 'reserved'
        and not exists (select 1 from public.sale_items si where si.unit_id = iu.id)
        and not exists (
          select 1 from public.event_allocation_units eau2
          where eau2.unit_id = eau.unit_id and eau2.committed_at > eau.committed_at
        );
    end if;

    v_delta := v_quantity - v_remaining;
    v_movement_id := null;
    v_movement_type := null;
    v_movement_unit_ids := null;
    v_movement_delta := null;

    if v_delta > 0 then
      select * into v_commit
      from public._fifo_commit_to_allocation(p_business_id, v_alloc_id, v_product_id, 'fifo_assignment', v_delta, null, null, null);
      v_movement_id := v_commit.movement_id;
      v_movement_type := v_commit.movement_type;
      v_movement_unit_ids := v_commit.committed_unit_ids;
      if v_movement_id is not null then v_movement_delta := array_length(v_movement_unit_ids, 1); end if;
    elsif v_delta < 0 then
      select * into v_release
      from public._release_from_allocation(p_business_id, v_alloc_id, 'fifo_assignment', -v_delta, null, 'adjustment', null, null);
      v_movement_id := v_release.movement_id;
      v_movement_type := 'adjustment';
      v_movement_unit_ids := v_release.released_unit_ids;
      v_movement_delta := -coalesce(array_length(v_movement_unit_ids, 1), 0);
    end if;

    select ea.quantity_allocated, ea.status into quantity_allocated, status
    from public.event_allocations ea where ea.id = v_alloc_id;

    product_id := v_product_id;
    event_allocation_id := v_alloc_id;
    movement_id := v_movement_id;
    movement_type := v_movement_type;
    movement_unit_ids := v_movement_unit_ids;
    movement_quantity_delta := v_movement_delta;

    v_result_rows := v_result_rows || jsonb_build_object(
      'product_id', product_id,
      'event_allocation_id', event_allocation_id,
      'quantity_allocated', quantity_allocated,
      'status', status,
      'movement_id', movement_id,
      'movement_type', movement_type,
      'movement_unit_ids', to_jsonb(coalesce(movement_unit_ids, '{}'::uuid[])),
      'movement_quantity_delta', movement_quantity_delta
    );

    return next;
  end loop;

  update public.idempotency_keys
  set result = jsonb_build_object('rows', v_result_rows)
  where id = p_idempotency_key;

  return;
end;
$$;
