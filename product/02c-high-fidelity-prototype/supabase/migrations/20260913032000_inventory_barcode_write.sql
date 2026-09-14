-- Stage 7 Backend Integration, Phase 1 follow-up — closes commit_lot's own
-- open item 4 ("Barcode collision/confirm-on-scan UX (D65) — ui-designer's
-- call, in progress, doesn't block this schema" —
-- 20260913030000_inventory_persistence_layer.sql's own header note).
--
-- `ui-designer`'s build of `inventory.md` §3.8b-§3.8e/`home.md`
-- §3.9-§3.9c found, on inspection, that neither 20260913030000 nor its own
-- follow-up 20260913031000 actually writes `products.barcode` on a `new`
-- line — the column and its partial unique index
-- (`products_barcode_unique_idx`) were added, but `commit_lot`'s own
-- `insert into public.products (...)` never named the column, so a scanned
-- barcode was silently discarded on write regardless of what the client
-- sent. This migration is that missing piece, not a redesign of anything
-- already decided: `p_lines`' `new`-line shape gains one more optional key
-- (`barcode`, already documented as accepted-but-unused in 20260913030000's
-- own header comment); the insert now writes it (`nullif(..., '')`, same
-- null-vs-empty-string normalization the client's own `?? null` already
-- performs one layer up); and a collision against the existing unique
-- index — a real, if rare, possibility now that this column is actually
-- written — is caught and re-raised as a named exception
-- (`barcode_already_registered`) rather than surfacing as a bare Postgres
-- `unique_violation` with no domain-legible message. No dedicated
-- merchant-facing UI branches on this specific message today —
-- `inventory.md` never designs one; a collision this late (after §3.8c's
-- own confirm-on-scan step already resolved the identity question once)
-- surfaces as an ordinary `commit_lot` failure, §3.11's existing "No se
-- pudo guardar... intenta de nuevo" retry (see `store.tsx`'s own
-- `commitLot` doc comment for the fuller reasoning) — the named exception
-- exists for a legible server-side error log and any future UI that wants
-- to branch on it specifically, not because today's build needs to.
--
-- `DROP FUNCTION` is not needed — the return shape
-- (`table (product_id uuid, lot_id uuid, unit_ids uuid[])`) is unchanged
-- from 20260913031000's own redefinition, only the body's `new`-line insert
-- branch changes.

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
      -- D65 — `barcode` is optional and, when present, must be unique per
      -- Business (`products_barcode_unique_idx`, a partial index so
      -- multiple NULLs never collide with each other). A genuine collision
      -- here is rare in practice — `inventory.md` §3.8c's own confirm-on-
      -- scan step already resolves an *existing* match before this insert
      -- is ever reached; this can only fire on a real two-actor race (two
      -- devices independently scanning the same never-before-seen barcode
      -- within the same window) — caught and re-raised with a legible,
      -- domain-named exception rather than a bare unique_violation.
      begin
        insert into public.products (business_id, name, default_price, photo, barcode)
        values (
          p_business_id,
          trim(v_line ->> 'name'),
          (v_line ->> 'default_price')::numeric,
          v_line ->> 'photo',
          nullif(v_line ->> 'barcode', '')
        )
        returning id into product_id;
      exception
        when unique_violation then
          raise exception 'barcode_already_registered' using errcode = 'P0001';
      end;
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
