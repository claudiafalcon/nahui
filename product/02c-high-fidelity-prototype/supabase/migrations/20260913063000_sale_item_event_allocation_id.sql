-- Stage 7 Backend Integration, Phase 2b — reviewer-confirmed Blocker fix,
-- architect-designed (`product/00-foundation/decision-log.md` D67).
--
-- `remove_sale_item`/`cancel_sale` (`20260913061000_event_allocation_
-- selling_integration.sql`) decide whether a released unit reverts to
-- `status='reserved'` (still genuinely committed to its EventAllocation) or
-- `status='available'` (the plain-pool case) by checking `exists (select 1
-- from event_allocation_units where unit_id = inventory_units.id)` — but
-- `event_allocation_units` is append-only (a release only ever flips
-- `inventory_units.status`, never deletes or marks its own commit row), so
-- that check returns `true` forever for any unit ever committed to any
-- allocation, long after that specific commitment was reconciled back to
-- general stock. A unit allocated to Event A, later reconciled back to
-- general via the normal manual-reconciliation flow, then sold through an
-- unrelated Quick Session's plain FIFO pool — cancelling *that* Sale would
-- incorrectly re-reserve the unit, stranding it in a status the domain
-- model's own lifecycle doesn't describe once neither an open Sale nor a
-- live allocation actually holds it.
--
-- The fix: `SaleItem` gains `event_allocation_id` (nullable), captured once,
-- at `add_item_to_sale`/`add_item_to_sale_by_tag`'s own allocation-aware
-- branch — the one moment this fact is actually and unambiguously known —
-- and read back unchanged by `remove_sale_item`/`cancel_sale` rather than
-- re-derived from data that structurally can't support the derivation.
-- Same "row-level truth, captured once, never re-derived from a blind-spot-
-- prone query" discipline D59/D33 already established for
-- `SaleItem.pricePaid`.
--
-- `add_item_to_sale`/`add_item_to_sale_by_tag` are the CURRENTLY-LIVE
-- `20260913062000_event_allocation_persistence_layer_fixes.sql` versions
-- (the self-caught "current custody" fix), not the original `061000`
-- versions — extended here. `remove_sale_item`/`cancel_sale` were untouched
-- by `062000` and remain exactly as `061000` defined them — extended
-- directly from that definition.

alter table public.sale_items
  add column event_allocation_id uuid references public.event_allocations(id);

comment on column public.sale_items.event_allocation_id is
  'D67 — captured once, at write time (add_item_to_sale/add_item_to_sale_by_tag''s own allocation-aware branch), never re-derived from event_allocation_units (append-only, so a plain existence check there returns true forever even long after that commitment was reconciled back to general stock). Read back unchanged by remove_sale_item/cancel_sale to correctly decide whether a released unit reverts to reserved (still allocation-committed) or available (plain pool).';

-- ---------------------------------------------------------------------------
-- add_item_to_sale — extends the currently-live `062000` version. Return
-- shape gains `event_allocation_id` (the RPC's actual, authoritative
-- allocation decision, threaded to the client so its local mirror never has
-- to re-derive it) — a return-type change, so the old signature is dropped
-- rather than `create or replace`d in place.
-- ---------------------------------------------------------------------------
drop function if exists public.add_item_to_sale(uuid, uuid, uuid);

create function public.add_item_to_sale(
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
  v_operating_mode text;
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

  select id, event_id, operating_mode into v_session_id, v_event_id, v_operating_mode
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    raise exception 'no_active_session' using errcode = 'P0001';
  end if;

  if v_operating_mode <> 'buttons' then
    raise exception 'wrong_operating_mode' using errcode = 'P0001';
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

  -- D67 — `v_alloc_id` (already resolved above, non-null only in the
  -- allocation branch) is captured onto the SaleItem row itself, the one
  -- moment this fact is actually and unambiguously known.
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
-- add_item_to_sale_by_tag — extends the currently-live `062000` version.
-- Unlike `add_item_to_sale`, this function never captured *which* specific
-- allocation matched — its allocation-aware branch only tested membership
-- via an `exists(...)` sub-clause. Return shape gains `event_allocation_id`,
-- same return-type change as `add_item_to_sale` above.
--
-- NOTE: this function's own body below was found to still mis-attribute
-- `v_alloc_id` (a stale, decoupled second query that never checked
-- `inventory_units.status`, so it could disagree with the disjunct that
-- actually matched the unit) and was corrected by
-- `20260913064000_add_item_to_sale_by_tag_fix.sql`, which merges the
-- unit-match and allocation-id capture into a single `left join lateral`
-- query so the two can never disagree. See that file for the full defect
-- trace and current, correct body — the version below is superseded.
-- ---------------------------------------------------------------------------
drop function if exists public.add_item_to_sale_by_tag(uuid, text, uuid);

create function public.add_item_to_sale_by_tag(
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

  select iu.id, iu.product_id into v_unit_id, v_product_id
  from public.inventory_units iu
  join public.nfc_tags nt on nt.unit_id = iu.id
  where nt.business_id = p_business_id
    and nt.tag_identifier = p_tag_identifier
    and (
      iu.status = 'available'
      or (
        iu.status = 'reserved'
        and exists (
          select 1
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
        )
      )
    )
  for update of iu skip locked;

  if v_unit_id is null then
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  -- D67 — which specific allocation matched, captured once. Reuses the
  -- exact current-custody filter the `exists(...)` clause above already
  -- applied to gate `v_unit_id`'s own selection, so this can never disagree
  -- with it. Stays null if the plain `status='available'` pool branch
  -- matched instead.
  select ea.id into v_alloc_id
  from public.event_allocation_units eau
  join public.event_allocations ea on ea.id = eau.event_allocation_id
  where eau.unit_id = v_unit_id
    and ea.event_id = v_event_id
    and ea.status = 'open'
    and not exists (select 1 from public.sale_items si where si.unit_id = v_unit_id)
    and not exists (
      select 1 from public.event_allocation_units eau2
      where eau2.unit_id = eau.unit_id and eau2.committed_at > eau.committed_at
    );

  update public.inventory_units set status = 'reserved' where id = v_unit_id and status = 'available';

  select default_price into v_default_price from public.products where id = v_product_id;
  if v_event_id is not null then
    select override_price into v_override_price
    from public.price_overrides
    where event_id = v_event_id and product_id = v_product_id;
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

-- ---------------------------------------------------------------------------
-- remove_sale_item — reads `SaleItem.event_allocation_id` back unchanged
-- instead of re-deriving allocation-commitment from the append-only
-- `event_allocation_units` table (D67's fix). Argument list and return type
-- (`void`) are unchanged, so this stays a plain `create or replace`.
-- ---------------------------------------------------------------------------
create or replace function public.remove_sale_item(
  p_business_id uuid,
  p_sale_item_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
  v_unit_id uuid;
  v_sale_id uuid;
  v_event_allocation_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select unit_id, sale_id, event_allocation_id into v_unit_id, v_sale_id, v_event_allocation_id
  from public.sale_items
  where id = p_sale_item_id and business_id = p_business_id;

  if v_unit_id is null then
    return; -- already removed, or never existed — no-op
  end if;

  -- Defensive scope check — "Quitar de la venta" is only ever offered from
  -- within one's own in-progress (open) Sale on one's own active Session.
  if not exists (
    select 1
    from public.sales s
    join public.sessions se on se.id = s.session_id
    where s.id = v_sale_id
      and s.status = 'open'
      and se.opened_by_membership_id = v_membership_id
  ) then
    return; -- defensive no-op, matching store.tsx's existing guard style
  end if;

  delete from public.sale_items where id = p_sale_item_id;

  -- D67 fix — the released unit's own `SaleItem.event_allocation_id`,
  -- captured once at write time, decides the revert target directly. No
  -- longer re-derived from `event_allocation_units`'s append-only existence,
  -- which can't distinguish a still-live commitment from a long-reconciled
  -- one.
  update public.inventory_units
  set status = case when v_event_allocation_id is not null then 'reserved' else 'available' end
  where id = v_unit_id;
end;
$$;

revoke execute on function public.remove_sale_item(uuid, uuid) from public;
grant execute on function public.remove_sale_item(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- cancel_sale — same D67 fix as `remove_sale_item` above, applied to every
-- unit in the cancelled Sale at once. The prior bulk `update ... where id in
-- (select unit_id from sale_items ...)` couldn't carry a per-row revert
-- target; replaced with an `update ... from` joined against `sale_items`,
-- run *before* the `delete from sales` that cascades away the `sale_items`
-- rows it reads. Argument list and return type unchanged — plain `create or
-- replace`.
-- ---------------------------------------------------------------------------
create or replace function public.cancel_sale(
  p_business_id uuid,
  p_sale_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
  v_sale_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- Scoped to the client-captured `p_sale_id`, re-verifying ownership (the
  -- Sale's own Session was opened by this caller) as the first check,
  -- matching `remove_sale_item`'s own defensive-scope join.
  select s.id into v_sale_id
  from public.sales s
  join public.sessions se on se.id = s.session_id
  where s.id = p_sale_id
    and s.business_id = p_business_id
    and s.status = 'open'
    and se.opened_by_membership_id = v_membership_id;

  if v_sale_id is null then
    return;
  end if;

  -- D67 fix — per-row revert target, read from each SaleItem's own
  -- `event_allocation_id`. Must run before the `delete from sales` below,
  -- which cascades away the very `sale_items` rows this update reads.
  update public.inventory_units iu
  set status = case when si.event_allocation_id is not null then 'reserved' else 'available' end
  from public.sale_items si
  where si.sale_id = v_sale_id
    and iu.id = si.unit_id;

  delete from public.sales where id = v_sale_id; -- cascades to sale_items
end;
$$;

revoke execute on function public.cancel_sale(uuid, uuid) from public;
grant execute on function public.cancel_sale(uuid, uuid) to authenticated;
