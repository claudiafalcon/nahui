-- Stage 7 Backend Integration, Phase 1 — commit_lot() return-shape fix.
--
-- Follow-up to 20260913030000_inventory_persistence_layer.sql, applied as a
-- new migration rather than editing the already-live one (that migration is
-- applied to the real hosted project; never edit an applied migration —
-- same discipline the Phase 0 fix migrations already established).
--
-- The base migration's `commit_lot` returned only `product_id`, mirroring
-- the prototype's old client-side `commitLot(): ID[]` contract literally.
-- That's insufficient for the real client wiring: `store.tsx`'s local
-- `AppState` mirror still holds Lot/InventoryEntry/InventoryUnit rows for
-- read purposes (this pass doesn't move every screen onto a live Supabase
-- query — see this pass's own build report), and those mirrored
-- InventoryUnit rows must carry the *real*, server-assigned ids, not
-- client-fabricated ones — `assign_tag_to_next_pending_unit` (unchanged by
-- this migration) resolves and returns a real InventoryUnit id, FIFO-first,
-- entirely server-side; the client can only recognize that id back inside
-- its own mirrored `units` array if that array was built from the same real
-- ids to begin with. Without this fix, a real tag assignment would succeed
-- on the server but silently fail to update the local mirror (no row in
-- `state.units` would ever match the returned id), leaving "Faltan N de M"
-- stuck showing a unit as still-pending forever.
--
-- Fixed by redefining `commit_lot` to return one row per input line (same
-- order) carrying `product_id`, the shared `lot_id` this commit wrote to,
-- and `unit_ids` (every newly-created InventoryUnit for that line, in
-- insertion order). `DROP FUNCTION` first — Postgres doesn't allow
-- `CREATE OR REPLACE FUNCTION` to change an existing function's return type.

drop function if exists public.commit_lot(uuid, uuid, jsonb);

create or replace function public.commit_lot(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_lines jsonb
)
returns table (product_id uuid, lot_id uuid, unit_ids uuid[])
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_cached_row jsonb;
  v_lot_id uuid;
  v_received_at timestamptz := now();
  v_line jsonb;
  v_quantity int;
  v_unit_ids uuid[];
  v_result_rows jsonb := '[]'::jsonb;
  i int;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Q24/Q25's permission table: "OWNER: ... Lot receiving/tagging."
  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- Idempotency (architecture-principles.md #7/D30) — one key per logical
  -- "Guardar mercancía" attempt, replayed on retry rather than re-run (which
  -- would otherwise mint duplicate Products/units on a retried network call).
  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'commit_lot')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    -- Order-preserving: JSONB array element order matches document order,
    -- so the replayed rows come back in the exact same order this attempt
    -- originally resolved them, mirroring commitLot()'s own "same order as
    -- input" contract.
    for v_cached_row in select * from jsonb_array_elements(v_existing_result -> 'rows') loop
      product_id := (v_cached_row ->> 'product_id')::uuid;
      lot_id := (v_cached_row ->> 'lot_id')::uuid;
      select array_agg(elem::uuid) into unit_ids
      from jsonb_array_elements_text(v_cached_row -> 'unit_ids') as elem;
      return next;
    end loop;
    return;
  end if;

  insert into public.lots (business_id, received_at)
  values (p_business_id, v_received_at)
  returning id into v_lot_id;

  for i in 0 .. jsonb_array_length(p_lines) - 1 loop
    v_line := p_lines -> i;
    v_quantity := (v_line ->> 'quantity')::int;

    if (v_line ->> 'kind') = 'existing' then
      product_id := (v_line ->> 'product_id')::uuid;
      -- Defensive, same posture the client's own `mintProduct`/resolution
      -- guards already hold: an `existing` line must actually name a
      -- Product belonging to this Business.
      if not exists (
        select 1 from public.products
        where id = product_id and business_id = p_business_id
      ) then
        raise exception 'product_not_found' using errcode = 'P0002';
      end if;
    else
      insert into public.products (business_id, name, default_price, photo)
      values (
        p_business_id,
        trim(v_line ->> 'name'),
        (v_line ->> 'default_price')::numeric,
        v_line ->> 'photo'
      )
      returning id into product_id;
    end if;

    insert into public.inventory_entries (business_id, lot_id, product_id, quantity)
    values (p_business_id, v_lot_id, product_id, v_quantity);

    with inserted as (
      insert into public.inventory_units (business_id, product_id, lot_id, status, received_at)
      select p_business_id, product_id, v_lot_id, 'available', v_received_at
      from generate_series(1, v_quantity)
      returning id
    )
    select array_agg(id) into v_unit_ids from inserted;

    lot_id := v_lot_id;
    unit_ids := v_unit_ids;

    v_result_rows := v_result_rows || jsonb_build_object(
      'product_id', product_id, 'lot_id', lot_id, 'unit_ids', to_jsonb(unit_ids)
    );

    return next;
  end loop;

  update public.idempotency_keys
  set result = jsonb_build_object('rows', v_result_rows)
  where id = p_idempotency_key;

  return;
end;
$$;

revoke execute on function public.commit_lot(uuid, uuid, jsonb) from public;
grant execute on function public.commit_lot(uuid, uuid, jsonb) to authenticated;
