-- Stage 7 Backend Integration, Phase 2b — self-caught correctness fix,
-- applied before any review round (found while writing the client-side
-- mirroring logic that has to reproduce the same derivation).
--
-- `event_allocation_units` is deliberately append-only — a unit reallocated
-- from Event A to Event B keeps its *original* `(event_allocation_id=A,
-- unit_id=X)` row untouched, and gains a *new* `(event_allocation_id=B,
-- unit_id=X)` row from the destination-side commit. Every "is this unit
-- still genuinely outstanding for allocation A" query written in
-- `20260913060000`/`20260913061000` (the `_release_from_allocation`
-- candidate selection, `save_event_allocations`'/`reconcile_manual_
-- allocation`'s own "remaining" counts, and the extended `add_item_to_sale`/
-- `add_item_to_sale_by_tag`'s own candidate pools) filtered only on
-- `status='reserved' AND not claimed by any sale_items` — which the stale
-- row at A still satisfies even after the unit moves to B (its status stays
-- `reserved` throughout the single-transaction reallocation, only the owning
-- allocation changes). Left unfixed, A's own "remaining" count would
-- double-count a unit it no longer actually owns, and A's own release/
-- consumption candidate pools could wrongly re-release or re-sell a unit
-- that now genuinely belongs to B.
--
-- The fix: a `event_allocation_units` row is only the *current custody*
-- record for its `unit_id` if no *later*-committed row exists for that same
-- `unit_id` (under any `event_allocation_id`) — reallocation is the only
-- write that ever produces a second row for the same unit, and it always
-- does so strictly after the original commit, so "no later row exists" is
-- an exact, cheap "am I still the genuine owner" test. Added as one
-- additional `and not exists (...)` clause everywhere the affected queries
-- already select from `event_allocation_units`.

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
    select coalesce(array_agg(iu.id), '{}') into v_candidate_ids
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
    for update of iu skip locked;
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

    select id, status into v_alloc_id, v_alloc_status
    from public.event_allocations
    where event_id = p_event_id and product_id = v_product_id;

    if v_alloc_id is null then
      if v_quantity <= 0 then
        continue; -- nothing to create for a still-zero row
      end if;
      insert into public.event_allocations (business_id, event_id, product_id)
      values (p_business_id, p_event_id, v_product_id)
      returning id, status into v_alloc_id, v_alloc_status;
      v_remaining := 0;
    else
      -- Fix (this migration) — the current-custody filter: excludes a unit
      -- whose most recent committed_at across ANY allocation belongs to a
      -- later row than this one (i.e. it's since been reallocated away).
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

create or replace function public.reconcile_manual_allocation(
  p_business_id uuid,
  p_event_allocation_id uuid,
  p_idempotency_key uuid,
  p_quantity int
)
returns table (released_unit_ids uuid[], movement_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_expected int;
  v_clamped_quantity int;
  v_release record;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_quantity is null or p_quantity < 0 then
    raise exception 'invalid_quantity' using errcode = 'P0002';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'reconcile_manual_allocation')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    return query
      select
        (select array_agg(elem::uuid) from jsonb_array_elements_text(v_existing_result -> 'released_unit_ids') as elem),
        (v_existing_result ->> 'movement_id')::uuid;
    return;
  end if;

  if not exists (
    select 1 from public.event_allocations where id = p_event_allocation_id and business_id = p_business_id
  ) then
    raise exception 'event_allocation_not_found' using errcode = 'P0002';
  end if;

  -- Fix (this migration) — same current-custody filter as above.
  select count(*) into v_expected
  from public.event_allocation_units eau
  join public.inventory_units iu on iu.id = eau.unit_id
  where eau.event_allocation_id = p_event_allocation_id
    and eau.unit_source = 'fifo_assignment'
    and iu.status = 'reserved'
    and not exists (select 1 from public.sale_items si where si.unit_id = iu.id)
    and not exists (
      select 1 from public.event_allocation_units eau2
      where eau2.unit_id = eau.unit_id and eau2.committed_at > eau.committed_at
    );

  v_clamped_quantity := least(p_quantity, v_expected);

  select * into v_release
  from public._release_from_allocation(
    p_business_id, p_event_allocation_id, 'fifo_assignment', v_clamped_quantity, null,
    'return_to_general', v_expected, null
  );

  update public.idempotency_keys
  set result = jsonb_build_object('released_unit_ids', to_jsonb(v_release.released_unit_ids), 'movement_id', v_release.movement_id)
  where id = p_idempotency_key;

  return query select v_release.released_unit_ids, v_release.movement_id;
end;
$$;

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
    -- Fix (this migration) — same current-custody filter as above: a unit
    -- whose custody has since moved to a different allocation (via
    -- reallocation) must never be selected here.
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

  if v_operating_mode <> 'nfc' then
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  -- Fix (this migration) — same current-custody filter added to the
  -- allocation-aware branch.
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
