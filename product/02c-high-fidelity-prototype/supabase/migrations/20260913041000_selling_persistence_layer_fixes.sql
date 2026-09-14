-- Stage 7 Backend Integration, Phase 2 — `reviewer` fix round 1.
-- Closes Important findings 1-3 on `20260913040000_selling_persistence_layer.sql`
-- (the Blocker and its client-side half live in `Selling.tsx`/`ProductTile.tsx`,
-- not here). All three functions this migration touches are `create or
-- replace` in place, except `cancel_sale`/`close_session`, whose signatures
-- change (a new explicit target-id parameter) and are dropped/recreated —
-- same "never edit an applied migration, add a new one" discipline this
-- file family has held since Phase 0's own two fix rounds.

-- ---------------------------------------------------------------------------
-- Important 1 — `start_session`'s `p_event_id` was never checked to belong
-- to `p_business_id` before being written, unlike `create_event`'s own
-- `p_venue_id` check (same migration family). Not a cross-tenant read leak
-- (RLS still gates reads correctly) but it let a Session row carry a
-- cross-tenant `event_id` the rest of the schema assumes never happens.
-- ---------------------------------------------------------------------------
create or replace function public.start_session(
  p_business_id uuid,
  p_event_id uuid,
  p_operating_mode text
)
returns table (session_id uuid, event_id uuid, operating_mode text, opened_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
  v_resolved_mode text := p_operating_mode;
  v_session_id uuid;
  v_session_event_id uuid;
  v_session_mode text;
  v_session_opened_at timestamptz;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if v_resolved_mode not in ('buttons', 'nfc') then
    raise exception 'invalid_operating_mode' using errcode = 'P0002';
  end if;

  -- Important 1 fix — `p_event_id` is optional (null for a Quick Session)
  -- but, when supplied, must belong to this Business, matching
  -- `create_event`'s own `p_venue_id` check and Phase 1's `commit_lot`
  -- `existing`-kind `product_id` check in the same migration family.
  if p_event_id is not null and not exists (
    select 1 from public.events where id = p_event_id and business_id = p_business_id
  ) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;

  if v_resolved_mode = 'nfc' and not exists (
    select 1 from public.businesses where id = p_business_id and subscription_tier = 'paid'
  ) then
    v_resolved_mode := 'buttons';
  end if;

  -- "Never ask twice" — a concurrent double-submission (two rapid taps, a
  -- retried request) resolves to the already-open Session rather than
  -- racing to open a second one.
  insert into public.sessions (business_id, event_id, operating_mode, opened_by_membership_id)
  values (p_business_id, p_event_id, v_resolved_mode, v_membership_id)
  on conflict (opened_by_membership_id) where status = 'active' do nothing
  returning id, event_id, operating_mode, opened_at
  into v_session_id, v_session_event_id, v_session_mode, v_session_opened_at;

  if v_session_id is null then
    select id, event_id, operating_mode, opened_at
    into v_session_id, v_session_event_id, v_session_mode, v_session_opened_at
    from public.sessions
    where opened_by_membership_id = v_membership_id and status = 'active';
  end if;

  return query select v_session_id, v_session_event_id, v_session_mode, v_session_opened_at;
end;
$$;

revoke execute on function public.start_session(uuid, uuid, text) from public;
grant execute on function public.start_session(uuid, uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Important 1 (continued) — `set_price_override`'s `p_product_id` was never
-- checked to belong to `p_business_id` either. Same fix shape.
-- ---------------------------------------------------------------------------
create or replace function public.set_price_override(
  p_business_id uuid,
  p_event_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid,
  p_override_price numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- Important 1 fix — matches `create_event`'s own `p_venue_id` check.
  if not exists (
    select 1 from public.products where id = p_product_id and business_id = p_business_id
  ) then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'set_price_override')
  on conflict (id) do nothing;

  if not exists (
    select 1 from public.events
    where id = p_event_id
      and business_id = p_business_id
      and cancelled_at is null
      and current_date < start_date
  ) then
    return;
  end if;

  insert into public.price_overrides (business_id, event_id, product_id, override_price)
  values (p_business_id, p_event_id, p_product_id, p_override_price)
  on conflict (event_id, product_id)
  do update set override_price = excluded.override_price;
end;
$$;

revoke execute on function public.set_price_override(uuid, uuid, uuid, uuid, numeric) from public;
grant execute on function public.set_price_override(uuid, uuid, uuid, uuid, numeric) to authenticated;

-- ---------------------------------------------------------------------------
-- Important 2 — seven dead idempotency-cache writes reintroduced a pattern
-- Phase 1 deliberately eliminated one migration earlier, the same day.
-- `update idempotency_keys set result = ... where id = ...` written
-- immediately before `raise exception` never survives — the whole
-- transaction rolls back, including that write (Phase 0's own fix-round-1
-- lesson, `20260913010000_identity_persistence_layer_fixes.sql`).
-- `assign_tag_to_next_pending_unit` (Phase 1) already removed the pattern
-- entirely with its own explanatory comment; these three functions restore
-- that same removal — a retry simply re-derives the identical outcome by
-- re-running the same checks, exactly as it already did before this
-- statement ever ran.
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
    -- Important 2 fix — no idempotency-cache write here: it never survives
    -- this transaction's own abort below (matches `assign_tag_to_next_
    -- pending_unit`'s own precedent, Phase 1). The exception itself is
    -- enough for a retry to correctly re-derive this same outcome.
    raise exception 'no_active_session' using errcode = 'P0001';
  end if;

  if v_operating_mode <> 'buttons' then
    raise exception 'wrong_operating_mode' using errcode = 'P0001';
  end if;

  select iu.id into v_unit_id
  from public.inventory_units iu
  where iu.business_id = p_business_id and iu.product_id = p_product_id and iu.status = 'available'
  order by iu.received_at asc
  for update of iu skip locked
  limit 1;

  if v_unit_id is null then
    raise exception 'out_of_stock' using errcode = 'P0001';
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

  update public.inventory_units set status = 'reserved' where id = v_unit_id;

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
    -- Important 2 fix — same removal as `add_item_to_sale` above.
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

  select iu.id, iu.product_id into v_unit_id, v_product_id
  from public.inventory_units iu
  join public.nfc_tags nt on nt.unit_id = iu.id
  where nt.business_id = p_business_id and nt.tag_identifier = p_tag_identifier and iu.status = 'available'
  for update of iu skip locked;

  if v_unit_id is null then
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  select default_price into v_default_price from public.products where id = v_product_id;
  if v_event_id is not null then
    select override_price into v_override_price
    from public.price_overrides
    where event_id = v_event_id and product_id = v_product_id;
  end if;
  v_price_paid := coalesce(v_override_price, v_default_price);

  update public.inventory_units set status = 'reserved' where id = v_unit_id;

  -- NFC-mode allocation (`EventAllocation.allocatedUnitIds`) is out of this
  -- slice's scope (Phase 2b), same as `add_item_to_sale` above — no
  -- compare-and-swap performed here.
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
    select count(*) into v_item_count from public.sale_items where sale_id = v_sale_id;
  end if;

  if v_sale_id is null or v_item_count = 0 then
    -- Important 2 fix — same removal as `add_item_to_sale` above.
    raise exception 'no_open_sale' using errcode = 'P0001';
  end if;

  update public.inventory_units
  set status = 'sold'
  where id in (select unit_id from public.sale_items where sale_id = v_sale_id);

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

-- ---------------------------------------------------------------------------
-- Important 3 — `cancel_sale`/`close_session` resolved their target
-- implicitly ("whatever is currently open/active" for the caller's own
-- Membership) instead of against a client-captured id, unlike this
-- codebase's own established precedent for naturally-idempotent status-flip
-- RPCs (`cancel_event`, Phase 0's `revoke_membership` — both take an
-- explicit target id). A stale retry of a "Cancelar"/"Cerrar jornada de
-- venta" tap the client believed failed, retried after the merchant had
-- already moved on to a new Sale/Session, could silently act on whatever is
-- open *at the time it actually executes*, not what she intended — narrow
-- (requires a user-initiated retry; this codebase has no auto-retry; only
-- affects the acting Membership's own data) but avoidable. Both signatures
-- change (a new explicit target-id parameter), so the old one-arg versions
-- are dropped rather than `create or replace`d in place.
-- ---------------------------------------------------------------------------
drop function if exists public.cancel_sale(uuid);

create function public.cancel_sale(
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

  -- Important 3 fix — scoped to the client-captured `p_sale_id`, re-
  -- verifying ownership (the Sale's own Session was opened by this caller)
  -- as the first check, matching `remove_sale_item`'s own defensive-scope
  -- join. A stale/duplicate retry that no longer matches (already
  -- cancelled/finalized, or genuinely not this caller's) is a no-op, same
  -- as before.
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

  update public.inventory_units
  set status = 'available'
  where id in (select unit_id from public.sale_items where sale_id = v_sale_id);

  delete from public.sales where id = v_sale_id; -- cascades to sale_items
end;
$$;

revoke execute on function public.cancel_sale(uuid, uuid) from public;
grant execute on function public.cancel_sale(uuid, uuid) to authenticated;

drop function if exists public.close_session(uuid);

create function public.close_session(
  p_business_id uuid,
  p_session_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- Important 3 fix — scoped to the client-captured `p_session_id`,
  -- re-verifying ownership as part of the same `where`, matching
  -- `cancel_sale`'s own fix above.
  update public.sessions
  set status = 'closed', closed_at = now()
  where id = p_session_id
    and business_id = p_business_id
    and opened_by_membership_id = v_membership_id
    and status = 'active';
end;
$$;

revoke execute on function public.close_session(uuid, uuid) from public;
grant execute on function public.close_session(uuid, uuid) to authenticated;
