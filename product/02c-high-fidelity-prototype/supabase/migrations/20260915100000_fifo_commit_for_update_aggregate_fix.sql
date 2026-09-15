-- Live-found (2026-09-15) via the execution-before-done discipline —
-- unlike every other fix tonight, this is NOT the RETURNS TABLE
-- column-collision class. `_fifo_commit_to_allocation`'s `p_specific_unit_ids`
-- branch (the one `scan_unit_into_event_allocation` calls on every real NFC
-- scan) combined `for update of iu skip locked` with `array_agg(iu.id)` in
-- the same SELECT — Postgres unconditionally rejects `FOR UPDATE` alongside
-- an aggregate function (`0A000: FOR UPDATE is not allowed with aggregate
-- functions`), a hard syntax rule, not data-dependent. Confirmed live: a
-- synthetic scan through this exact branch failed every single time, not
-- intermittently — meaning every real "scan a tag into an Event allocation"
-- action in this project has always failed, since the day this function was
-- deployed.
--
-- The function's own `p_quantity` branch (a few lines below) already gets
-- this right — the row-locking subquery and the aggregate are structurally
-- separate (`FOR UPDATE` inside an inner subquery, `array_agg` only in the
-- outer query). This fix applies the exact same restructuring to the
-- `p_specific_unit_ids` branch, nothing else changed.
create or replace function public._fifo_commit_to_allocation(
  p_business_id uuid,
  p_event_allocation_id uuid,
  p_product_id uuid,
  p_unit_source text,
  p_quantity int,
  p_specific_unit_ids uuid[],
  p_movement_type text,
  p_counterpart_event_allocation_id uuid
)
returns table (committed_unit_ids uuid[], movement_id uuid, movement_type text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidate_ids uuid[];
  v_was_empty boolean;
  v_resolved_type text;
  v_movement_id uuid;
begin
  if p_specific_unit_ids is not null and array_length(p_specific_unit_ids, 1) > 0 then
    select coalesce(array_agg(pick.id), '{}') into v_candidate_ids
    from (
      select iu.id
      from public.inventory_units iu
      where iu.id = any(p_specific_unit_ids)
        and iu.business_id = p_business_id
        and iu.status = 'available'
      for update of iu skip locked
    ) pick;
  elsif p_quantity is not null and p_quantity > 0 then
    select coalesce(array_agg(pick.id), '{}') into v_candidate_ids
    from (
      select iu.id
      from public.inventory_units iu
      where iu.business_id = p_business_id
        and iu.product_id = p_product_id
        and iu.status = 'available'
        and not exists (select 1 from public.nfc_tags nt where nt.unit_id = iu.id)
      order by iu.received_at asc
      for update of iu skip locked
      limit p_quantity
    ) pick;
  else
    v_candidate_ids := '{}';
  end if;

  if coalesce(array_length(v_candidate_ids, 1), 0) = 0 then
    return query select '{}'::uuid[], null::uuid, null::text;
    return;
  end if;

  select not exists (
    select 1 from public.event_allocation_units
    where event_allocation_id = p_event_allocation_id and unit_source = p_unit_source
  ) into v_was_empty;

  update public.inventory_units set status = 'reserved' where id = any(v_candidate_ids);

  insert into public.event_allocation_units (business_id, event_allocation_id, unit_id, unit_source)
  select p_business_id, p_event_allocation_id, u, p_unit_source
  from unnest(v_candidate_ids) as u
  on conflict (event_allocation_id, unit_id) do nothing;

  if p_unit_source = 'fifo_assignment' then
    update public.event_allocations
    set quantity_allocated = quantity_allocated + array_length(v_candidate_ids, 1)
    where id = p_event_allocation_id;
  end if;

  update public.event_allocations
  set status = 'open'
  where id = p_event_allocation_id and status = 'reconciled';

  v_resolved_type := coalesce(p_movement_type, case when v_was_empty then 'initial_allocation' else 'replenish' end);

  insert into public.allocation_movements (
    business_id, event_allocation_id, type, unit_ids, quantity_delta, unit_source,
    quantity_expected, counterpart_event_allocation_id
  )
  values (
    p_business_id, p_event_allocation_id, v_resolved_type, v_candidate_ids, array_length(v_candidate_ids, 1),
    p_unit_source, null, p_counterpart_event_allocation_id
  )
  returning id into v_movement_id;

  return query select v_candidate_ids, v_movement_id, v_resolved_type;
end;
$$;
