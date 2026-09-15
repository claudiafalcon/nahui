-- Live-found (2026-09-15) via the standing execution-before-done discipline
-- (`context/stage-7-backend-integration.md`'s 2026-09-15 entry) — while
-- closing the execution-verification gap this function was already named
-- under ("still execution-unverified, needs NFC test data"), synthesized
-- real test data (a product, a lot, an available unit, an nfc_tag, an
-- Event, a price_override for that Event+product, an nfc-mode Session) all
-- inside a rolled-back transaction and actually called the function through
-- its event-linked price-override branch.
--
-- Same `RETURNS TABLE (sale_id, sale_item_id, unit_id, product_id,
-- price_paid, event_allocation_id)` collision as every other fix today — a
-- bare `product_id` in the price_overrides lookup's WHERE clause, only
-- reached when a Session's Event has an active price override for the
-- scanned unit's Product (never exercised by a plain buttons-mode sale,
-- which is why this specific instance survived every prior real call).
create or replace function public.add_item_to_sale_by_tag(
  p_business_id uuid,
  p_tag_identifier text,
  p_idempotency_key uuid
)
returns table (sale_id uuid, sale_item_id uuid, unit_id uuid, product_id uuid, price_paid numeric, event_allocation_id uuid)
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
  v_event_id uuid;
  v_operating_mode text;
  v_unit_id uuid;
  v_alloc_id uuid;
  v_product_id uuid;
  v_default_price numeric;
  v_override_price numeric;
  v_price_paid numeric;
  v_sale_id uuid;
  v_sale_item_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'add_item_to_sale_by_tag')
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
        (v_existing_result ->> 'sale_item_id')::uuid,
        (v_existing_result ->> 'unit_id')::uuid,
        (v_existing_result ->> 'product_id')::uuid,
        (v_existing_result ->> 'price_paid')::numeric,
        (v_existing_result ->> 'event_allocation_id')::uuid;
    return;
  end if;

  select id, event_id, operating_mode into v_session_id, v_event_id, v_operating_mode
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    raise exception 'no_active_session' using errcode = 'P0001';
  end if;

  if v_operating_mode <> 'nfc' then
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  select
    iu.id,
    iu.product_id,
    case when iu.status = 'reserved' then alloc.event_allocation_id else null end
  into v_unit_id, v_product_id, v_alloc_id
  from public.inventory_units iu
  join public.nfc_tags nt on nt.unit_id = iu.id
  left join lateral (
    select ea.id as event_allocation_id
    from public.event_allocation_units eau
    join public.event_allocations ea on ea.id = eau.event_allocation_id
    where eau.unit_id = iu.id
      and ea.event_id = v_event_id
      and ea.status = 'open'
      and not exists (select 1 from public.sale_items si where si.unit_id = iu.id)
      and not exists (
        select 1 from public.event_allocation_units eau2
        where eau2.unit_id = eau.unit_id and eau2.committed_at > eau.committed_at
      )
    limit 1
  ) alloc on true
  where nt.business_id = p_business_id
    and nt.tag_identifier = p_tag_identifier
    and (
      iu.status = 'available'
      or (
        iu.status = 'reserved'
        and alloc.event_allocation_id is not null
      )
    )
  for update of iu skip locked;

  if v_unit_id is null then
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  update public.inventory_units set status = 'reserved' where id = v_unit_id and status = 'available';

  select default_price into v_default_price from public.products where id = v_product_id;
  if v_event_id is not null then
    select override_price into v_override_price
    from public.price_overrides
    where event_id = v_event_id and price_overrides.product_id = v_product_id;
  end if;
  v_price_paid := coalesce(v_override_price, v_default_price);

  insert into public.sales (business_id, session_id, status, performed_by_membership_id)
  values (p_business_id, v_session_id, 'open', v_membership_id)
  on conflict (session_id) where status = 'open' do nothing
  returning id into v_sale_id;

  if v_sale_id is null then
    select id into v_sale_id from public.sales where session_id = v_session_id and status = 'open';
  end if;

  insert into public.sale_items (business_id, sale_id, product_id, unit_id, price_paid, event_allocation_id)
  values (p_business_id, v_sale_id, v_product_id, v_unit_id, v_price_paid, v_alloc_id)
  returning id into v_sale_item_id;

  update public.idempotency_keys
  set result = jsonb_build_object(
    'sale_id', v_sale_id, 'sale_item_id', v_sale_item_id,
    'unit_id', v_unit_id, 'product_id', v_product_id, 'price_paid', v_price_paid,
    'event_allocation_id', v_alloc_id
  )
  where id = p_idempotency_key;

  return query select v_sale_id, v_sale_item_id, v_unit_id, v_product_id, v_price_paid, v_alloc_id;
end;
$$;

revoke execute on function public.add_item_to_sale_by_tag(uuid, text, uuid) from public;
grant execute on function public.add_item_to_sale_by_tag(uuid, text, uuid) to authenticated;
