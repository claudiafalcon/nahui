-- Live-found (2026-09-15), same class as `20260915100000`'s fix to
-- `_fifo_commit_to_allocation` — the identical `FOR UPDATE` + `array_agg`
-- anti-pattern (Postgres error 0A000, unconditional, not data-dependent) in
-- this function's own `p_specific_unit_ids` branch. Reached by
-- `reallocate_event_allocation`'s "move these specific scanned units"
-- path (`p_unit_source <> 'fifo_assignment'`) and by any future caller of
-- `return_scanned_units_to_general`/`reconcile_manual_allocation` that
-- passes specific unit ids — confirmed live via the public
-- `reallocate_event_allocation` RPC, which failed every time, not
-- intermittently. Fixed the same way as the sibling function: `FOR UPDATE`
-- moves into an inner subquery, the aggregate stays in the outer query —
-- this function's own `p_quantity`-driven branch below already does this
-- correctly and is the pattern this fix matches.
create or replace function public._release_from_allocation(
  p_business_id uuid,
  p_event_allocation_id uuid,
  p_unit_source text,
  p_quantity int,
  p_specific_unit_ids uuid[],
  p_movement_type text,
  p_quantity_expected int,
  p_counterpart_event_allocation_id uuid
)
returns table (released_unit_ids uuid[], movement_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidate_ids uuid[];
  v_movement_id uuid;
  v_remaining_after int;
begin
  if p_specific_unit_ids is not null and array_length(p_specific_unit_ids, 1) > 0 then
    select coalesce(array_agg(pick.id), '{}') into v_candidate_ids
    from (
      select iu.id
      from public.inventory_units iu
      join public.event_allocation_units eau
        on eau.unit_id = iu.id
        and eau.event_allocation_id = p_event_allocation_id
        and eau.unit_source = p_unit_source
      where iu.id = any(p_specific_unit_ids)
        and iu.business_id = p_business_id
        and iu.status = 'reserved'
        and not exists (select 1 from public.sale_items si where si.unit_id = iu.id)
        and not exists (
          select 1 from public.event_allocation_units eau2
          where eau2.unit_id = eau.unit_id and eau2.committed_at > eau.committed_at
        )
      for update of iu skip locked
    ) pick;
  else
    select coalesce(array_agg(pick.unit_id), '{}') into v_candidate_ids
    from (
      select eau.unit_id
      from public.event_allocation_units eau
      join public.inventory_units iu on iu.id = eau.unit_id
      where eau.event_allocation_id = p_event_allocation_id
        and eau.unit_source = p_unit_source
        and iu.status = 'reserved'
        and not exists (select 1 from public.sale_items si where si.unit_id = iu.id)
        and not exists (
          select 1 from public.event_allocation_units eau2
          where eau2.unit_id = eau.unit_id and eau2.committed_at > eau.committed_at
        )
      order by eau.committed_at desc
      for update of iu skip locked
      limit p_quantity
    ) pick;
  end if;

  if coalesce(array_length(v_candidate_ids, 1), 0) > 0 then
    update public.inventory_units set status = 'available' where id = any(v_candidate_ids);
  end if;

  insert into public.allocation_movements (
    business_id, event_allocation_id, type, unit_ids, quantity_delta, unit_source,
    quantity_expected, counterpart_event_allocation_id
  )
  values (
    p_business_id, p_event_allocation_id, p_movement_type, coalesce(v_candidate_ids, '{}'),
    -coalesce(array_length(v_candidate_ids, 1), 0), p_unit_source, p_quantity_expected, p_counterpart_event_allocation_id
  )
  returning id into v_movement_id;

  if p_movement_type = 'return_to_general' then
    select count(*) into v_remaining_after
    from public.event_allocation_units eau
    join public.inventory_units iu on iu.id = eau.unit_id
    where eau.event_allocation_id = p_event_allocation_id
      and iu.status = 'reserved'
      and not exists (select 1 from public.sale_items si where si.unit_id = iu.id)
      and not exists (
        select 1 from public.event_allocation_units eau2
        where eau2.unit_id = eau.unit_id and eau2.committed_at > eau.committed_at
      );

    if v_remaining_after = 0 then
      update public.event_allocations set status = 'reconciled' where id = p_event_allocation_id;
    end if;
  end if;

  return query select coalesce(v_candidate_ids, '{}'), v_movement_id;
end;
$$;
