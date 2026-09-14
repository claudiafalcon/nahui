-- Stage 7 Backend Integration, Phase 2b — extends four already-shipped
-- Phase 2 Selling functions to make `EventAllocation`-committed stock
-- actually sellable/releasable. A real, necessary finding beyond what was
-- originally asked (`context/stage-7-backend-integration.md`'s Phase 2b
-- design summary): once a unit is committed to an `EventAllocation` its
-- status flips to `reserved`, making it invisible to Phase 2's own
-- `add_item_to_sale`/`add_item_to_sale_by_tag` (both filtered on
-- `status='available'` only) — without this migration, allocated stock
-- would be committed but permanently unsellable, and the server-side half of
-- `home.md`'s "lost the race" mechanism would never actually fire. All four
-- functions are `CREATE OR REPLACE` redefinitions of already-live functions
-- (`20260913040000_selling_persistence_layer.sql`/
-- `20260913041000_selling_persistence_layer_fixes.sql`) — a separate
-- migration file since these aren't new objects, matching this repo's own
-- "never edit an applied migration, add a new one" discipline.
--
-- **When no open `EventAllocation` exists for `(this Session's event_id,
-- product_id)`, behavior is completely unchanged from what Phase 2 already
-- shipped** — every branch below that touches allocation-aware logic is
-- reached only once that precondition holds; the plain Business-wide FIFO/
-- tag-lookup path is untouched.

-- ---------------------------------------------------------------------------
-- add_item_to_sale — extends Phase 2's plain-FIFO-only version. Before the
-- plain FIFO block, checks whether an `open` `EventAllocation` exists for
-- `(this Session's event_id, product_id)`. If one does, consumes
-- *exclusively* from that allocation's own committed-and-unclaimed pool
-- (`event_allocation_units` joined to `inventory_units` where
-- `status='reserved'` and not yet claimed by any `sale_items` row, ordered
-- oldest-committed-first, `FOR UPDATE SKIP LOCKED`) — **never falls back to
-- the plain pool**, even if the allocation's own pool is exhausted. That
-- exhaustion raises a distinct, terminal `event_allocation_exhausted`
-- error — the actual "lost the race" signal `home.md` §3.8a's ⊗ pattern
-- consumes (never `out_of_stock`, which stays reserved for the genuine
-- plain-pool exhaustion case an Event-less/unallocated Product still hits).
-- If no open allocation exists for this Event/Product, behavior is
-- unchanged — the plain FIFO block below runs exactly as Phase 2 shipped it.
-- ---------------------------------------------------------------------------
create or replace function public.add_item_to_sale(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid
)
returns table (sale_id uuid, sale_item_id uuid, unit_id uuid, price_paid numeric)
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

  -- Idempotency (architecture-principles.md #7/D30) — one key per logical
  -- tap, reused unchanged across a retry of that same tap. A conflict
  -- replays the cached result rather than re-running the write.
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
        (v_existing_result ->> 'price_paid')::numeric;
    return;
  end if;

  -- home.md §2 step 1 — this device's own acting Membership's active
  -- Session, resolved server-side (`sessions_one_active_per_membership_idx`
  -- guarantees at most one), never trusted from the client.
  select id, event_id, operating_mode into v_session_id, v_event_id, v_operating_mode
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    raise exception 'no_active_session' using errcode = 'P0001';
  end if;

  if v_operating_mode <> 'buttons' then
    raise exception 'wrong_operating_mode' using errcode = 'P0001';
  end if;

  -- Phase 2b extension — an open EventAllocation for this Session's own
  -- Event/Product pair gates consumption exclusively to its own committed
  -- pool, never falling back to the plain pool below.
  if v_event_id is not null then
    select id into v_alloc_id
    from public.event_allocations
    where event_id = v_event_id and product_id = p_product_id and status = 'open';
  end if;

  if v_alloc_id is not null then
    select eau.unit_id into v_unit_id
    from public.event_allocation_units eau
    join public.inventory_units iu on iu.id = eau.unit_id
    where eau.event_allocation_id = v_alloc_id
      and iu.status = 'reserved'
      and not exists (select 1 from public.sale_items si where si.unit_id = iu.id)
    order by eau.committed_at asc
    for update of iu skip locked
    limit 1;

    if v_unit_id is null then
      -- Terminal, not retriable — the actual server-side compare-and-swap
      -- failure `home.md` §3.8a's ⊗ pattern depends on. Never falls back to
      -- the plain Business-wide pool below, even if it has stock.
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

  -- Price resolution (decision-log.md D33) — this Session's own Event Price
  -- Override for this Product, if any, else the Product's own default_price.
  select default_price into v_default_price from public.products where id = p_product_id;
  if v_event_id is not null then
    select override_price into v_override_price
    from public.price_overrides
    where event_id = v_event_id and product_id = p_product_id;
  end if;
  v_price_paid := coalesce(v_override_price, v_default_price);

  -- Find-or-create this Session's own open Sale (`sales_one_open_per_
  -- session_idx` mint-or-find, same ON CONFLICT shape `start_session` above
  -- already uses).
  insert into public.sales (business_id, session_id, status, performed_by_membership_id)
  values (p_business_id, v_session_id, 'open', v_membership_id)
  on conflict (session_id) where status = 'open' do nothing
  returning id into v_sale_id;

  if v_sale_id is null then
    select id into v_sale_id from public.sales where session_id = v_session_id and status = 'open';
  end if;

  insert into public.sale_items (business_id, sale_id, product_id, unit_id, price_paid)
  values (p_business_id, v_sale_id, p_product_id, v_unit_id, v_price_paid)
  returning id into v_sale_item_id;

  update public.idempotency_keys
  set result = jsonb_build_object(
    'sale_id', v_sale_id, 'sale_item_id', v_sale_item_id,
    'unit_id', v_unit_id, 'price_paid', v_price_paid
  )
  where id = p_idempotency_key;

  return query select v_sale_id, v_sale_item_id, v_unit_id, v_price_paid;
end;
$$;

revoke execute on function public.add_item_to_sale(uuid, uuid, uuid) from public;
grant execute on function public.add_item_to_sale(uuid, uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- add_item_to_sale_by_tag — the identical extension for NFC mode. A scanned
-- tag's unit may already be `status='reserved'` via an open `EventAllocation`
-- for this same Session's own Event — matched on `status='available'` OR
-- (`status='reserved'` AND committed via an `event_allocation_units` row
-- whose allocation's `event_id` equals this Session's own `event_id`, AND
-- not yet claimed by any `sale_items` row). A tag resolving to a unit
-- reserved for a *different* Event's allocation fails with the existing
-- generic `no_match` error — no dedicated copy exists for this sub-case per
-- the Phase 2b design summary's own open item 2, reused rather than
-- inventing new client-facing copy.
-- ---------------------------------------------------------------------------
create or replace function public.add_item_to_sale_by_tag(
  p_business_id uuid,
  p_tag_identifier text,
  p_idempotency_key uuid
)
returns table (sale_id uuid, sale_item_id uuid, unit_id uuid, product_id uuid, price_paid numeric)
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
        (v_existing_result ->> 'price_paid')::numeric;
    return;
  end if;

  select id, event_id, operating_mode into v_session_id, v_event_id, v_operating_mode
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    raise exception 'no_active_session' using errcode = 'P0001';
  end if;

  -- No dedicated reason code for "wrong mode" — 'no_match' already reads
  -- correctly client-side here (`store.tsx`'s own `addItemToSaleByTag`
  -- comment: "this scan can't resolve to a sellable item right now"), so
  -- it's reused rather than adding a branch nothing in the UI would ever
  -- treat differently.
  if v_operating_mode <> 'nfc' then
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  -- Phase 2b extension — `status='available'` (the plain pool, unchanged) OR
  -- `status='reserved'` via an open EventAllocation for *this Session's own*
  -- Event, not yet claimed by any Sale. A unit reserved for a different
  -- Event's allocation (or mid-Sale elsewhere, or already sold) matches
  -- neither branch and falls through to the existing `no_match` error below.
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
        )
      )
    )
  for update of iu skip locked;

  if v_unit_id is null then
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  -- Only the plain-pool branch needs the conditional flip — an allocation-
  -- committed unit is already `reserved` (it was flipped at allocation-commit
  -- time); re-issuing the identical UPDATE is harmless but unnecessary. The
  -- WHERE clause keeps this a no-op for that case either way.
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

  insert into public.sale_items (business_id, sale_id, product_id, unit_id, price_paid)
  values (p_business_id, v_sale_id, v_product_id, v_unit_id, v_price_paid)
  returning id into v_sale_item_id;

  update public.idempotency_keys
  set result = jsonb_build_object(
    'sale_id', v_sale_id, 'sale_item_id', v_sale_item_id,
    'unit_id', v_unit_id, 'product_id', v_product_id, 'price_paid', v_price_paid
  )
  where id = p_idempotency_key;

  return query select v_sale_id, v_sale_item_id, v_unit_id, v_product_id, v_price_paid;
end;
$$;

revoke execute on function public.add_item_to_sale_by_tag(uuid, text, uuid) from public;
grant execute on function public.add_item_to_sale_by_tag(uuid, text, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- remove_sale_item — previously an unconditional `reserved -> available`
-- revert. Extended: a unit with a row in `event_allocation_units` (i.e. it
-- was consumed from an open EventAllocation's own committed pool, Phase 2b's
-- extended `add_item_to_sale`/`add_item_to_sale_by_tag` above) reverts to
-- `reserved` instead — it stays committed to its allocation, only unclaimed
-- from this specific Sale. A unit with no such row (the plain-pool case,
-- unchanged) still reverts to `available`.
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
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select unit_id, sale_id into v_unit_id, v_sale_id
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

  -- Phase 2b extension — see this migration's own header comment.
  update public.inventory_units
  set status = case when exists (
    select 1 from public.event_allocation_units where unit_id = inventory_units.id
  ) then 'reserved' else 'available' end
  where id = v_unit_id;
end;
$$;

revoke execute on function public.remove_sale_item(uuid, uuid) from public;
grant execute on function public.remove_sale_item(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- cancel_sale — same extension as `remove_sale_item` above, applied to every
-- unit in the cancelled Sale at once.
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

  -- Phase 2b extension — see this migration's own header comment.
  update public.inventory_units
  set status = case when exists (
    select 1 from public.event_allocation_units where unit_id = inventory_units.id
  ) then 'reserved' else 'available' end
  where id in (select unit_id from public.sale_items where sale_id = v_sale_id);

  delete from public.sales where id = v_sale_id; -- cascades to sale_items
end;
$$;

revoke execute on function public.cancel_sale(uuid, uuid) from public;
grant execute on function public.cancel_sale(uuid, uuid) to authenticated;
