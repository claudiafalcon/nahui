-- `decision-log.md` D79 (`product/99-rfc/0017-nfc-composable-selling-
-- capability.md`, Accepted 2026-09-18) — NFC becomes a live, composable
-- selling capability. `Session.operatingMode` is removed from the domain
-- model entirely, no replacement field; NFC Readiness's threshold/tri-state
-- resolution is retired outright. Every Session now shows one unconditional
-- composable selling surface (buttons + barcode overlay + "Leer con NFC"
-- overlay), with both overlay gates re-evaluated live on every render —
-- never resolved once at Session-open.
--
-- Concrete failure this closes (Product Owner's own live-testing finding):
-- a Session opened before any unit was tagged never offered NFC scanning
-- for that unit, even after tagging it mid-Session, because
-- `add_item_to_sale_by_tag` server-side rejected every scan with
-- `no_match` whenever `sessions.operating_mode <> 'nfc'` — the exact
-- session-start-time coordination logic D79 corrects. Symmetrically,
-- `add_item_to_sale` rejected every plain button/barcode add with
-- `wrong_operating_mode` whenever `operating_mode <> 'buttons'`. Both
-- checks only ever existed to arbitrate an exclusive Session mode that no
-- longer exists in the corrected product model — removed outright, not
-- re-thresholded.
--
-- `sessions.operating_mode` (D25's non-deletion discipline — never
-- dropped) stays in the schema as inert historical data. It gains a
-- database-level default so `start_session` no longer has to supply a
-- value explicitly — this is the "stop writing it" half of D79's
-- instruction, expressed at the schema level rather than by every future
-- INSERT having to remember to hardcode a sentinel. `businesses.
-- default_selling_mode` is left completely untouched by this migration —
-- D79 retires it at the client-code level only (no client reader/writer
-- remains as of this same-day pass); its own schema default already
-- existed before this migration and needs no change.

alter table public.sessions alter column operating_mode set default 'buttons';

comment on column public.sessions.operating_mode is
  'Retired at the domain-model level, decision-log.md D79 — Session.operatingMode no longer exists on the client type and no code path reads or writes a meaningful value here going forward. Kept as inert historical data on any existing row (never deleted, D25); new rows get the column''s own database default (''buttons'') purely to satisfy the not-null constraint, never as a live selling-mode decision.';

comment on column public.businesses.default_selling_mode is
  'Retired at the domain-model level, decision-log.md D79 — Business.defaultSellingMode no longer exists on the client type and no code path reads or writes it going forward (its one remaining live reader, D73''s own "Honest status" note, is itself retired by this same decision). Kept as inert historical data on any existing row (never deleted, D25).';

-- ---------------------------------------------------------------------------
-- start_session — drops the old 3-argument signature (`p_operating_mode`
-- removed entirely, not defaulted client-side) rather than leaving it as a
-- second overload, matching this project's own established precedent
-- (`20260918000000_assign_tag_product_scope.sql`'s identical treatment of
-- `assign_tag_to_next_pending_unit`) — leaving the old signature callable
-- would keep a client that still sends `p_operating_mode` able to invoke a
-- function this decision retires the concept behind.
-- ---------------------------------------------------------------------------
drop function if exists public.start_session(uuid, uuid, text);

create function public.start_session(
  p_business_id uuid,
  p_event_id uuid default null
)
returns table (session_id uuid, event_id uuid, opened_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
  v_session_id uuid;
  v_session_event_id uuid;
  v_session_opened_at timestamptz;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_event_id is not null and not exists (
    select 1 from public.events where id = p_event_id and business_id = p_business_id
  ) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;

  -- `operating_mode` is left to its own column default (`'buttons'`, set
  -- above) — no longer a value this function resolves or receives from the
  -- client (`decision-log.md` D79).
  insert into public.sessions (business_id, event_id, opened_by_membership_id)
  values (p_business_id, p_event_id, v_membership_id)
  on conflict (opened_by_membership_id) where status = 'active' do nothing
  returning sessions.id, sessions.event_id, sessions.opened_at
  into v_session_id, v_session_event_id, v_session_opened_at;

  if v_session_id is null then
    select sessions.id, sessions.event_id, sessions.opened_at
    into v_session_id, v_session_event_id, v_session_opened_at
    from public.sessions
    where opened_by_membership_id = v_membership_id and status = 'active';
  end if;

  return query select v_session_id, v_session_event_id, v_session_opened_at;
end;
$$;

revoke execute on function public.start_session(uuid, uuid) from public;
grant execute on function public.start_session(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- add_item_to_sale — extends the currently-live version
-- (`20260913063000_sale_item_event_allocation_id.sql`, same signature/
-- return shape, so a plain `create or replace` applies). Only change: the
-- `operating_mode` read and its `wrong_operating_mode` rejection are
-- removed entirely — a plain button/barcode add is no longer conditional
-- on any Session-level mode (`decision-log.md` D79).
-- ---------------------------------------------------------------------------
create or replace function public.add_item_to_sale(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid
)
returns table (sale_id uuid, sale_item_id uuid, unit_id uuid, price_paid numeric, event_allocation_id uuid)
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
  v_alloc_id uuid;
  v_unit_id uuid;
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
  values (p_idempotency_key, p_business_id, 'add_item_to_sale')
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
        (v_existing_result ->> 'price_paid')::numeric,
        (v_existing_result ->> 'event_allocation_id')::uuid;
    return;
  end if;

  select id, event_id into v_session_id, v_event_id
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    raise exception 'no_active_session' using errcode = 'P0001';
  end if;

  if v_event_id is not null then
    select id into v_alloc_id
    from public.event_allocations
    where event_id = v_event_id and product_id = p_product_id and status = 'open';
  end if;

  if v_alloc_id is not null then
    -- Current-custody filter (`062000`'s own fix) — a unit whose custody
    -- has since moved to a different allocation (via reallocation) must
    -- never be selected here.
    select eau.unit_id into v_unit_id
    from public.event_allocation_units eau
    join public.inventory_units iu on iu.id = eau.unit_id
    where eau.event_allocation_id = v_alloc_id
      and iu.status = 'reserved'
      and not exists (select 1 from public.sale_items si where si.unit_id = iu.id)
      and not exists (
        select 1 from public.event_allocation_units eau2
        where eau2.unit_id = eau.unit_id and eau2.committed_at > eau.committed_at
      )
    order by eau.committed_at asc
    for update of iu skip locked
    limit 1;

    if v_unit_id is null then
      raise exception 'event_allocation_exhausted' using errcode = 'P0001';
    end if;
  else
    select iu.id into v_unit_id
    from public.inventory_units iu
    where iu.business_id = p_business_id and iu.product_id = p_product_id and iu.status = 'available'
    order by iu.received_at asc
    for update of iu skip locked
    limit 1;

    if v_unit_id is null then
      raise exception 'out_of_stock' using errcode = 'P0001';
    end if;

    update public.inventory_units set status = 'reserved' where id = v_unit_id;
  end if;

  select default_price into v_default_price from public.products where id = p_product_id;
  if v_event_id is not null then
    select override_price into v_override_price
    from public.price_overrides
    where event_id = v_event_id and product_id = p_product_id;
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
  values (p_business_id, v_sale_id, p_product_id, v_unit_id, v_price_paid, v_alloc_id)
  returning id into v_sale_item_id;

  update public.idempotency_keys
  set result = jsonb_build_object(
    'sale_id', v_sale_id, 'sale_item_id', v_sale_item_id,
    'unit_id', v_unit_id, 'price_paid', v_price_paid, 'event_allocation_id', v_alloc_id
  )
  where id = p_idempotency_key;

  return query select v_sale_id, v_sale_item_id, v_unit_id, v_price_paid, v_alloc_id;
end;
$$;

revoke execute on function public.add_item_to_sale(uuid, uuid, uuid) from public;
grant execute on function public.add_item_to_sale(uuid, uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- add_item_to_sale_by_tag — extends the currently-live version
-- (`20260915080000_add_item_to_sale_by_tag_column_ambiguity_fix.sql`, same
-- signature/return shape, so a plain `create or replace` applies). Only
-- change: the `operating_mode` read and its `no_match` rejection
-- (previously fired whenever `operating_mode <> 'nfc'`) are removed
-- entirely — an NFC scan is no longer conditional on any Session-level
-- mode, only on the tag itself resolving to a sellable unit
-- (`decision-log.md` D79). This is the exact fix the Product Owner's own
-- live-testing finding required: a Session opened before any unit was
-- tagged, then tagged mid-Session, now resolves a scan of that unit
-- immediately — nothing about this function ever depended on when the
-- Session opened relative to when the tag was assigned.
-- ---------------------------------------------------------------------------
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

  select id, event_id into v_session_id, v_event_id
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    raise exception 'no_active_session' using errcode = 'P0001';
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
