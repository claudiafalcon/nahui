-- Stage 7 Backend Integration, Phase 1 — Inventory persistence layer.
--
-- Implements `product/00-foundation/domain-model.md`'s Inventory context —
-- Product, Lot, InventoryEntry, InventoryUnit, NFCTag assignment — plus the
-- structurally-present-but-invisible Supplier (D9). Design authority:
-- `context/stage-7-backend-integration.md`'s "Phase 1 design summary"
-- (`architect`, 2026-09-13) — six tables, all Business-scoped with
-- `business_id` denormalized directly onto every row (same pattern Phase 0's
-- `EventAllocation`/`EventAssignment` design already established, so every
-- RLS policy here can call `is_active_member_of`/`is_active_owner_of`
-- (20260913000000_identity_persistence_layer.sql) with no join.
--
-- Four open items architect named, not resolved by this migration:
-- 1. `Product.active` (Q21) — not added; never promoted into the Foundation,
--    needs its own completion pass first. Not this migration's call to make.
-- 2. `Product.photo` storage mechanism — `photo text` stays
--    storage-mechanism-agnostic (a data URL today, a Storage path/URL once a
--    later pass wires real Supabase Storage). Real file storage is
--    explicitly out of scope for this migration.
-- 3. `nfc_tags` as its own table (not an inlined `InventoryUnit.tagId`
--    scalar) — a deliberate structural refinement over the prototype's own
--    mock shape, giving `assignedAt` (D59) a real column.
-- 4. Barcode collision/confirm-on-scan UX (D65) — `ux-designer`'s call, in
--    progress, doesn't block this schema; the uniqueness constraint below is
--    enforced regardless of what flow eventually surfaces it.
--
-- Explicitly NOT this migration's scope: Selling/Session/Sale/EventAllocation
-- (Phase 2/2b/2c), Results (Phase 3). `inventory_units` deliberately gets no
-- UPDATE policy at all here — status transitions (`available -> reserved ->
-- sold`) belong to Selling-context RPCs, not this phase.

-- ---------------------------------------------------------------------------
-- suppliers — D9's sanctioned exception: structurally present, zero UI, zero
-- write RPC. Nothing in this build ever writes a row here; kept so a future
-- margin/Open Finance pass doesn't need a schema migration to introduce it.
-- ---------------------------------------------------------------------------
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  name text,
  created_at timestamptz not null default now()
);

comment on table public.suppliers is
  'Inventory context, D9''s sanctioned exception — structurally present, no '
  'menu entry, no screen, no write RPC. Exists only so InventoryEntry''s own '
  'supplier_id/cost columns have somewhere to eventually point.';

create index if not exists suppliers_business_id_idx
  on public.suppliers (business_id);

-- ---------------------------------------------------------------------------
-- products — `domain-model.md`'s `Product` root. Independent identity,
-- referenced by id from InventoryUnit/NFCTag/(future) SaleItem, never
-- embedded in a Lot — a sold-out Product stays in the Catalog.
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  name text not null,
  default_price numeric not null check (default_price >= 0),
  -- D54/Q23 — optional, plain mutable current scalar, no version history.
  -- Storage-mechanism-agnostic per this migration's own header note (open
  -- item 2) — a client-local data URL today, unchanged until a later pass
  -- wires real Supabase Storage.
  photo text,
  -- D65 — optional manufacturer/packaging barcode, Business-scoped unique
  -- (see the partial index below, not a column constraint, so multiple
  -- NULLs coexist). Schema-ready; no built UI writes this yet (open item 4).
  barcode text,
  created_at timestamptz not null default now()
);

comment on table public.products is
  'Inventory context aggregate (domain-model.md). No direct INSERT policy '
  'for anon/authenticated — a new Product is only ever minted inside '
  'commit_lot()''s own atomic transaction. UPDATE is narrowly scoped to '
  'update_product_price()/update_product_photo() (OWNER-only, single-column '
  'each) — no direct client UPDATE grant on this table at all.';

create index if not exists products_business_id_idx
  on public.products (business_id);

-- D65 — unique per (business_id, barcode), partial so multiple products
-- with no barcode (NULL) never collide with each other.
create unique index if not exists products_barcode_unique_idx
  on public.products (business_id, barcode)
  where barcode is not null;

-- ---------------------------------------------------------------------------
-- lots — `domain-model.md`'s `Lot` root ("a receiving event"). Owns
-- InventoryEntry/InventoryUnit as internal-only entities (no identity or
-- lookup outside their parent Lot) — modeled here as ordinary FK-scoped
-- tables, since Postgres has no native "internal entity" construct; the
-- invariant is enforced by RLS/RPC access shape, not by the schema alone.
-- ---------------------------------------------------------------------------
create table if not exists public.lots (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  received_at timestamptz not null default now()
);

comment on table public.lots is
  'Inventory context aggregate (domain-model.md). No direct INSERT/UPDATE '
  'policy for anon/authenticated — a Lot is only ever minted inside '
  'commit_lot()''s own atomic transaction, immutable afterward.';

create index if not exists lots_business_id_idx
  on public.lots (business_id);

-- ---------------------------------------------------------------------------
-- inventory_entries — internal-only entity owned by Lot ("what the merchant
-- typed: Product + qty + cost"). `supplier_id`/`cost` exist per D9, present
-- but deliberately unwritten by any built RPC (always NULL in practice).
-- ---------------------------------------------------------------------------
create table if not exists public.inventory_entries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  lot_id uuid not null references public.lots (id),
  product_id uuid not null references public.products (id),
  quantity integer not null check (quantity > 0),
  supplier_id uuid references public.suppliers (id),
  cost numeric,
  created_at timestamptz not null default now()
);

comment on table public.inventory_entries is
  'Internal-only entity owned by Lot (domain-model.md, same class as Price '
  'Override under Event). Only ever written inside commit_lot()''s own '
  'atomic transaction. supplier_id/cost are D9''s sanctioned '
  'present-but-unused columns — no built RPC ever sets them.';

create index if not exists inventory_entries_business_id_idx
  on public.inventory_entries (business_id);
create index if not exists inventory_entries_lot_id_idx
  on public.inventory_entries (lot_id);

-- ---------------------------------------------------------------------------
-- inventory_units — internal-only entity owned by Lot, one row per physical
-- item. `status` drives the `available -> reserved -> sold` lifecycle
-- (Selling-context writes, Phase 2 — deliberately not this migration).
-- ---------------------------------------------------------------------------
create table if not exists public.inventory_units (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  product_id uuid not null references public.products (id),
  lot_id uuid not null references public.lots (id),
  status text not null default 'available' check (status in ('available', 'reserved', 'sold')),
  -- Inherited from Lot.received_at at mint time (commit_lot()) — drives FIFO
  -- ordering (D5). Denormalized rather than joined through lot_id on every
  -- FIFO read, matching this migration's own business_id-denormalization
  -- convention.
  received_at timestamptz not null,
  created_at timestamptz not null default now()
);

comment on table public.inventory_units is
  'Internal-only entity owned by Lot (domain-model.md). Only ever minted '
  'inside commit_lot()''s own atomic transaction, always status=''available'' '
  'at mint time. No UPDATE policy/grant exists here at all in this phase — '
  'the available/reserved/sold state machine belongs to Selling-context RPCs '
  '(Phase 2), deliberately not built yet.';

create index if not exists inventory_units_business_id_idx
  on public.inventory_units (business_id);
create index if not exists inventory_units_lot_id_idx
  on public.inventory_units (lot_id);
-- The FIFO index (D5's "consume the oldest available InventoryUnit for that
-- Product") — every FIFO read (buttons-mode sale consumption, Phase 2;
-- assign_tag_to_next_pending_unit below, this phase) filters/orders on
-- exactly this column triple.
create index if not exists inventory_units_fifo_idx
  on public.inventory_units (product_id, status, received_at);

-- ---------------------------------------------------------------------------
-- nfc_tags — `domain-model.md`'s NFCTag, a 1:1 attribute of InventoryUnit.
-- Its own table here (open item 3) rather than the prototype's inlined
-- `InventoryUnit.tagId` scalar — gives `assignedAt` (D59) a real column and
-- makes "is this physical tag already spoken for" a real uniqueness
-- constraint instead of a client-side scan.
-- ---------------------------------------------------------------------------
create table if not exists public.nfc_tags (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  unit_id uuid not null unique references public.inventory_units (id),
  -- The physical tag's own read value (`inventory.md` §3.14's scan payload)
  -- — never a Nahui-generated id. Unique per Business, not globally, since
  -- two different Businesses' own tag stock is never meant to collide.
  tag_identifier text not null,
  assigned_at timestamptz not null default now()
);

comment on table public.nfc_tags is
  'Inventory context, NFCTag (domain-model.md: "not an aggregate root... a '
  '1:1 attribute of InventoryUnit"). Only ever written inside '
  'assign_tag_to_next_pending_unit()''s own atomic transaction — no direct '
  'client INSERT/UPDATE/DELETE grant. unit_id is unique (one tag per unit, '
  'ever — this build never reassigns/detaches a tag), tag_identifier is '
  'unique per business (the "already spoken for" check, inventory.md §3.15).';

create index if not exists nfc_tags_business_id_idx
  on public.nfc_tags (business_id);
create unique index if not exists nfc_tags_identifier_unique_idx
  on public.nfc_tags (business_id, tag_identifier);

-- ---------------------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------------------
alter table public.suppliers enable row level security;
alter table public.products enable row level security;
alter table public.lots enable row level security;
alter table public.inventory_entries enable row level security;
alter table public.inventory_units enable row level security;
alter table public.nfc_tags enable row level security;

-- suppliers/lots/inventory_entries — OWNER-only reads (receiving-workflow
-- bookkeeping a SELLER never needs, per the confirmed Q24/Q25 permission
-- table's "OWNER: Lot receiving/tagging"). No INSERT/UPDATE/DELETE policy
-- for any role — suppliers has no write RPC at all (D9); lots/
-- inventory_entries are written exclusively inside commit_lot().
create policy suppliers_select on public.suppliers
  for select
  using (public.is_active_owner_of(business_id));

create policy lots_select on public.lots
  for select
  using (public.is_active_owner_of(business_id));

create policy inventory_entries_select on public.inventory_entries
  for select
  using (public.is_active_owner_of(business_id));

grant select on public.suppliers to authenticated;
grant select on public.lots to authenticated;
grant select on public.inventory_entries to authenticated;

-- products/inventory_units/nfc_tags — any active member reads (OWNER +
-- SELLER), matching the confirmed permission table's "SELLER: read sellable
-- Products/prices, ungated" (products/inventory_units) and Selling's own
-- read-only dependency on Inventory for tag->unit resolution during a sale
-- (nfc_tags). No INSERT/UPDATE/DELETE policy for any role on any of the
-- three — every write goes through the SECURITY DEFINER RPCs below.
create policy products_select on public.products
  for select
  using (public.is_active_member_of(business_id));

create policy inventory_units_select on public.inventory_units
  for select
  using (public.is_active_member_of(business_id));

create policy nfc_tags_select on public.nfc_tags
  for select
  using (public.is_active_member_of(business_id));

grant select on public.products to authenticated;
grant select on public.inventory_units to authenticated;
grant select on public.nfc_tags to authenticated;

-- ---------------------------------------------------------------------------
-- commit_lot — inventory.md §3.8a/§3.9 "Guardar mercancía," and
-- onboarding.md §2.2a/§3.5b-§3.5e "Define lo que vendes" (product-decisions.md
-- Q20) — the one atomic write that mints any genuinely-new Product identities
-- and their shared Lot/InventoryEntry/InventoryUnit set together. Replaces
-- `store.tsx`'s own client-side-only `commitLot()`.
--
-- `p_lines` shape (JSONB array), one element per CommitLotLine
-- (`src/domain/store.tsx`):
--   { "kind": "existing", "product_id": "<uuid>", "quantity": <int> }
--   { "kind": "new", "name": "<text>", "default_price": <numeric>,
--     "photo": "<text|null>", "quantity": <int> }
--
-- **Superseded by 20260913031000's own redefinition** (returns `lot_id`/
-- `unit_ids` alongside `product_id` — the client's local `AppState` mirror
-- needs the real server-assigned InventoryUnit ids, not just Product ids, so
-- a later `assign_tag_to_next_pending_unit` result can be recognized back
-- against it) — left as originally written here per this repo's own "never
-- edit an applied migration" discipline; see that follow-up file's own
-- header for the full reasoning.
-- ---------------------------------------------------------------------------
create or replace function public.commit_lot(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_lines jsonb
)
returns table (product_id uuid)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_lot_id uuid;
  v_received_at timestamptz := now();
  v_line jsonb;
  v_product_id uuid;
  v_quantity int;
  v_resolved_ids uuid[] := '{}';
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
    -- so the replayed ids come back in the exact same order this attempt
    -- originally resolved them, mirroring commitLot()'s own "same order as
    -- input" contract.
    return query
      select (elem)::uuid
      from jsonb_array_elements_text(v_existing_result -> 'product_ids') as elem;
    return;
  end if;

  insert into public.lots (business_id, received_at)
  values (p_business_id, v_received_at)
  returning id into v_lot_id;

  for i in 0 .. jsonb_array_length(p_lines) - 1 loop
    v_line := p_lines -> i;
    v_quantity := (v_line ->> 'quantity')::int;

    if (v_line ->> 'kind') = 'existing' then
      v_product_id := (v_line ->> 'product_id')::uuid;
      -- Defensive, same posture the client's own `mintProduct`/resolution
      -- guards already hold: an `existing` line must actually name a
      -- Product belonging to this Business.
      if not exists (
        select 1 from public.products
        where id = v_product_id and business_id = p_business_id
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
      returning id into v_product_id;
    end if;

    v_resolved_ids := v_resolved_ids || v_product_id;

    insert into public.inventory_entries (business_id, lot_id, product_id, quantity)
    values (p_business_id, v_lot_id, v_product_id, v_quantity);

    insert into public.inventory_units (business_id, product_id, lot_id, status, received_at)
    select p_business_id, v_product_id, v_lot_id, 'available', v_received_at
    from generate_series(1, v_quantity);
  end loop;

  update public.idempotency_keys
  set result = jsonb_build_object('product_ids', to_jsonb(v_resolved_ids))
  where id = p_idempotency_key;

  return query select unnest(v_resolved_ids);
end;
$$;

revoke execute on function public.commit_lot(uuid, uuid, jsonb) from public;
grant execute on function public.commit_lot(uuid, uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- update_product_price — inventory.md §3.4a "Editar precio." OWNER-only,
-- single-column UPDATE on Product.default_price.
--
-- Idempotency-keyed per architecture-principles.md #7, but — unlike
-- commit_lot/accept_invitation above — with no cached-result replay branch:
-- setting the same price twice has no duplicate-creation side effect to
-- guard against (unlike minting a Product), so a retry simply re-applies the
-- identical UPDATE rather than needing a stored result to replay. The
-- idempotency_keys row is still written, for the same audit-trail
-- consistency every other write in this file keeps.
-- ---------------------------------------------------------------------------
create or replace function public.update_product_price(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid,
  p_new_price numeric
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

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'update_product_price')
  on conflict (id) do nothing;

  update public.products
  set default_price = p_new_price
  where id = p_product_id and business_id = p_business_id;

  if not found then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.update_product_price(uuid, uuid, uuid, numeric) from public;
grant execute on function public.update_product_price(uuid, uuid, uuid, numeric) to authenticated;

-- ---------------------------------------------------------------------------
-- update_product_photo — inventory.md §3.4b "Guardar foto" (product-decisions.md
-- Q23). Same shape as update_product_price above, one column
-- (Product.photo), `null` writes a removal ("Quitar" staged, then
-- committed) — the exact contract `store.tsx`'s own `setProductPhoto`
-- already documents.
-- ---------------------------------------------------------------------------
create or replace function public.update_product_photo(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid,
  p_photo text
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

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'update_product_photo')
  on conflict (id) do nothing;

  update public.products
  set photo = p_photo
  where id = p_product_id and business_id = p_business_id;

  if not found then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.update_product_photo(uuid, uuid, uuid, text) from public;
grant execute on function public.update_product_photo(uuid, uuid, uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- assign_tag_to_next_pending_unit — inventory.md §3.14 "one scan, one
-- write." OWNER-only, `FOR UPDATE SKIP LOCKED`, FIFO-ordered
-- (`inventory_units_fifo_idx` above) tag assignment.
--
-- Two named failure modes, raised as exceptions rather than a discriminated
-- return row (matching accept_invitation's own established convention,
-- 20260913000000/010000/020000) — the client matches on `error.message`:
-- 'tag_already_assigned' (§3.15 — this exact physical tag already stuck to a
-- different unit) and 'tag_queue_empty' (defensively unreachable through the
-- real UI today, since the client only ever calls this while its own live
-- queue is non-empty). Neither failure branch attempts an idempotency-key
-- cache write before raising — Phase 0's own fix round 1
-- (20260913010000_identity_persistence_layer_fixes.sql) already established
-- that such a write never survives the RAISE EXCEPTION that follows it in
-- the same transaction; a retry safely re-derives the identical outcome by
-- re-running the same checks, which is why neither branch bothers.
-- ---------------------------------------------------------------------------
create or replace function public.assign_tag_to_next_pending_unit(
  p_business_id uuid,
  p_tag_identifier text,
  p_idempotency_key uuid
)
returns table (unit_id uuid, product_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_unit_id uuid;
  v_product_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- Each scan is its own logical attempt — the client generates a fresh key
  -- per call, never reusing one across two different scans (unlike
  -- commit_lot's single reused key across retries of the *same* "Guardar
  -- mercancía" attempt).
  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'assign_tag_to_next_pending_unit')
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
        (v_existing_result ->> 'unit_id')::uuid,
        (v_existing_result ->> 'product_id')::uuid;
    return;
  end if;

  -- §3.15 — checked before the FIFO pick, same ordering `AssignTags.tsx`'s
  -- own `assignTagToNextPendingUnit` client mock already established
  -- ("already-assigned checked before queue-empty").
  if exists (
    select 1 from public.nfc_tags
    where business_id = p_business_id and tag_identifier = p_tag_identifier
  ) then
    raise exception 'tag_already_assigned' using errcode = 'P0001';
  end if;

  -- FIFO (D5) — oldest-received, still-untagged, available unit first
  -- (inventory.md §3.14's "in the order she entered them"). `FOR UPDATE
  -- SKIP LOCKED` is the concurrency-safety mechanism: two simultaneous
  -- scans (two devices tagging the same business-wide queue at once) each
  -- lock a *different* row instead of racing for the same one, so neither
  -- ever tags the same physical unit twice.
  select iu.id, iu.product_id into v_unit_id, v_product_id
  from public.inventory_units iu
  where iu.business_id = p_business_id
    and iu.status = 'available'
    and not exists (select 1 from public.nfc_tags nt where nt.unit_id = iu.id)
  order by iu.received_at asc
  for update of iu skip locked
  limit 1;

  if v_unit_id is null then
    raise exception 'tag_queue_empty' using errcode = 'P0001';
  end if;

  insert into public.nfc_tags (business_id, unit_id, tag_identifier)
  values (p_business_id, v_unit_id, p_tag_identifier);

  update public.idempotency_keys
  set result = jsonb_build_object('unit_id', v_unit_id, 'product_id', v_product_id)
  where id = p_idempotency_key;

  return query select v_unit_id, v_product_id;
end;
$$;

revoke execute on function public.assign_tag_to_next_pending_unit(uuid, text, uuid) from public;
grant execute on function public.assign_tag_to_next_pending_unit(uuid, text, uuid) to authenticated;
