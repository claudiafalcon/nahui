-- decision-log.md D77, product/99-rfc/0015-inventory-unit-removal.md,
-- inventory.md §3.6/§3.7 (Cantidad actual). Live production gap, Product
-- Owner-directed, expedited: a merchant needs to correct a Product's
-- sellable count for a reason other than a Sale (mistyped registration,
-- defective units returned to supplier). InventoryUnit's lifecycle was a
-- closed set (available -> reserved -> sold) with no other exit.
--
-- `removed` is a new terminal status, parallel to `sold`. Never reachable
-- from `reserved` (Selling's own in-flight write) -- only `available`
-- units are eligible, the same discipline `assign_tag_to_next_pending_unit`
-- and `commitAllocation()` already apply elsewhere in this schema.

alter table public.inventory_units
  drop constraint if exists inventory_units_status_check;

alter table public.inventory_units
  add constraint inventory_units_status_check
  check (status in ('available', 'reserved', 'sold', 'removed'));

-- Target-based, not delta-based: the client sends the absolute count she
-- wants (`Cantidad actual`'s own value at Guardar), not "remove N." This is
-- what makes the write converge toward what she actually asked for even if
-- the real available count moved underneath her (a concurrent Sale on
-- another device) -- the same "conditional write, zero-rows-affected =
-- already moved on" shape as `commitAllocation()`/`assign_tag_to_next_pending_unit`,
-- generalized here to "remove only what's still there to remove."
--
-- FIFO-selected among this Product's currently `available` units (D5's
-- existing consumption default, reused). A removed unit's own NFCTag, if
-- any, is deleted -- NFCTag has no independent lifecycle (domain-model.md),
-- so releasing it is simply removing the row; the physical tag itself is
-- untouched and remains scannable/reusable outside Nahui, same posture D74
-- already established for a blank factory tag.
create or replace function public.correct_product_available_count(
  p_business_id uuid,
  p_product_id uuid,
  p_target_available_count integer,
  p_idempotency_key uuid
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_current_count integer;
  v_to_remove integer;
  v_removed_count integer;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_target_available_count < 0 then
    raise exception 'invalid_target_count' using errcode = '22023';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'correct_product_available_count')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    return (v_existing_result ->> 'removed_count')::integer;
  end if;

  select count(*) into v_current_count
  from public.inventory_units
  where business_id = p_business_id
    and product_id = p_product_id
    and status = 'available';

  v_to_remove := greatest(0, v_current_count - p_target_available_count);

  if v_to_remove = 0 then
    update public.idempotency_keys
    set result = jsonb_build_object('removed_count', 0)
    where id = p_idempotency_key;
    return 0;
  end if;

  with candidates as (
    select id
    from public.inventory_units
    where business_id = p_business_id
      and product_id = p_product_id
      and status = 'available'
    order by received_at asc
    limit v_to_remove
    for update skip locked
  ),
  tag_release as (
    delete from public.nfc_tags
    where unit_id in (select id from candidates)
  ),
  removed as (
    update public.inventory_units
    set status = 'removed'
    where id in (select id from candidates)
    returning id
  )
  select count(*) into v_removed_count from removed;

  update public.idempotency_keys
  set result = jsonb_build_object('removed_count', v_removed_count)
  where id = p_idempotency_key;

  return v_removed_count;
end;
$$;

revoke execute on function public.correct_product_available_count(uuid, uuid, integer, uuid) from public;
grant execute on function public.correct_product_available_count(uuid, uuid, integer, uuid) to authenticated;
