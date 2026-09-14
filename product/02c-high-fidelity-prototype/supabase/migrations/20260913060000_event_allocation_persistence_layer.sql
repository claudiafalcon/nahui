-- Stage 7 Backend Integration, Phase 2b — EventAllocation/AllocationMovement
-- persistence layer.
--
-- Implements `product/00-foundation/domain-model.md`'s `EventAllocation`
-- (RFC 0009/D57, corrected RFC 0010/D59) — reserving part of a Product's
-- Business-wide stock for a specific Event, with replenish/reallocate/
-- reconcile, and the server-side half of `home.md`'s "lost the race"
-- concurrent-selling mechanism. Design authority:
-- `context/stage-7-backend-integration.md`'s "Phase 2b design summary"
-- (`architect`, 2026-09-13) — three tables, two private SQL helpers, five
-- public RPCs. Not restated here in full.
--
-- **Companion migration, `20260913061000_event_allocation_selling_integration.sql`,
-- extends four already-shipped Phase 2 functions** (`add_item_to_sale`,
-- `add_item_to_sale_by_tag`, `remove_sale_item`, `cancel_sale`) to make
-- allocated stock actually sellable/releasable — without it, allocated
-- inventory would be committed but unsellable. Kept as a separate migration
-- since those four are `CREATE OR REPLACE` redefinitions of existing
-- functions, not new objects, matching this repo's own "one migration per
-- logical unit" discipline (Phase 2's own `..._fixes.sql` precedent).
--
-- `EventAllocation.status` lifecycle (RFC 0009's ubiquitous-language entry):
-- stays `open` through an Event's entire `closed` transition (D59 §8 — no
-- silent auto-release on Event close, for either commitment mode); flips to
-- `reconciled` only as a consequence of an explicit reconciliation-typed
-- write leaving zero `reserved`-and-unclaimed units of either `unit_source`
-- remaining. This migration's own `_release_from_allocation` (below) applies
-- that flip specifically on a `return_to_general`-typed release, per the
-- Phase 2b design summary's own wording — `reallocate_out` is not treated as
-- a second reconciling trigger here, a narrower reading than RFC 0009's own
-- ubiquitous-language text ("`return_to_general` or `reallocate_out`"),
-- flagged as an open item for `architect`/`reviewer` to confirm rather than
-- silently resolved either way.

-- ---------------------------------------------------------------------------
-- event_allocations — `domain-model.md`'s `EventAllocation` root (RFC 0009,
-- corrected RFC 0010/D59). **`quantityRemaining` is deliberately NOT a
-- stored column** — derived at read time (client selectors, and this
-- migration's own SQL) as the count of this allocation's committed units
-- that are still `reserved` and not yet claimed by any `sale_items` row, per
-- D59's own "no independently-writable, driftable number" discipline.
-- `quantity_allocated` is a monotonic, hard-committed lifetime total for
-- `unit_source='fifo_assignment'` commitments only (RFC 0009's own
-- ubiquitous-language: "manual mode — the running total ever allocated"),
-- never decremented by a release. `quantity_planned` (RFC 0010 §2) is soft
-- intent only — freely settable, zero effect on the shared pool, not yet
-- surfaced in any built UI (Slice B, deferred).
--
-- **Unique on `(event_id, product_id)`, unconditionally — not partial on
-- `status`.** RFC 0009's own text: "at most one open EventAllocation per
-- Event/Product pair; a second allocation write for the same pair updates
-- the existing row rather than creating a sibling" — read together with
-- `status` being a plain mutable scalar with no version history, this means
-- exactly one row ever exists per pair, for the pair's entire lifetime,
-- flipping between `open`/`reconciled` as commitments come and go. Every
-- mint-or-find in this file searches by `(event_id, product_id)` alone,
-- never additionally filtering on `status='open'`.
-- ---------------------------------------------------------------------------
create table if not exists public.event_allocations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  event_id uuid not null references public.events (id),
  product_id uuid not null references public.products (id),
  quantity_planned integer not null default 0 check (quantity_planned >= 0),
  quantity_allocated integer not null default 0 check (quantity_allocated >= 0),
  status text not null default 'open' check (status in ('open', 'reconciled')),
  created_at timestamptz not null default now(),
  unique (event_id, product_id)
);

comment on table public.event_allocations is
  'Selling context aggregate root (domain-model.md, RFC 0009/D57, corrected '
  'RFC 0010/D59). No direct INSERT/UPDATE/DELETE policy for anon/'
  'authenticated — every write goes through this file''s public RPCs. '
  'quantityRemaining is never a stored column here — always derived, via '
  'event_allocation_units joined to inventory_units/sale_items.';

create index if not exists event_allocations_business_id_idx
  on public.event_allocations (business_id);
create index if not exists event_allocations_product_id_idx
  on public.event_allocations (product_id);

-- ---------------------------------------------------------------------------
-- event_allocation_units — new, the D59-mandated real row-level replacement
-- for the prototype's client-local `allocatedUnitIds[]` array. Needed
-- because the release/compare-and-swap logic requires an indexed, lockable
-- `SELECT ... FOR UPDATE` over "which units are committed to which
-- allocation," which an array column can't support. **Append-only, never
-- pruned** (RFC 0010 §11's own "the array remains the cumulative record of
-- every unit ever committed" rule, carried over to this table) — a release
-- only ever changes the referenced `inventory_units.status`, never deletes
-- or updates a row here. `unique (event_allocation_id, unit_id)` is the
-- DB-level form of the client mock's own defensive dedupe (a unit released
-- from one allocation and later re-committed to the *same* allocation must
-- never produce two rows for that pair).
-- ---------------------------------------------------------------------------
create table if not exists public.event_allocation_units (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  event_allocation_id uuid not null references public.event_allocations (id),
  unit_id uuid not null references public.inventory_units (id),
  unit_source text not null check (unit_source in ('scan', 'fifo_assignment')),
  committed_at timestamptz not null default now(),
  unique (event_allocation_id, unit_id)
);

comment on table public.event_allocation_units is
  'Internal-only entity owned by EventAllocation (RFC 0010/D59''s real, '
  'row-level replacement for the client-local allocatedUnitIds[] array). '
  'Append-only — only ever inserted by this file''s private helpers, never '
  'updated or deleted. "Still outstanding" is a read-time join against '
  'inventory_units.status=''reserved'' and the absence of a sale_items row, '
  'never a stored flag on this table itself.';

create index if not exists event_allocation_units_business_id_idx
  on public.event_allocation_units (business_id);
create index if not exists event_allocation_units_unit_id_idx
  on public.event_allocation_units (unit_id);
-- Serves both directions this file's helpers need: oldest-first (extended
-- `add_item_to_sale`'s own FIFO consumption of an allocation's committed
-- pool, ascending) and most-recently-committed-first (`_release_from_
-- allocation`'s own release ordering, descending) — one btree index scanned
-- in either direction.
create index if not exists event_allocation_units_alloc_committed_idx
  on public.event_allocation_units (event_allocation_id, committed_at);

-- ---------------------------------------------------------------------------
-- allocation_movements — `domain-model.md`'s `AllocationMovement`, an
-- internal-only, append-only audit ledger owned by EventAllocation (RFC
-- 0009 §2, corrected RFC 0010/D59's `unit_source`/`quantity_expected`
-- additions). Never surfaced to Ana directly — OWNER-only reads (the
-- reconciliation screen's own "Ya revisaste esto" existence check, and
-- general OWNER-side bookkeeping/audit).
-- ---------------------------------------------------------------------------
create table if not exists public.allocation_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  event_allocation_id uuid not null references public.event_allocations (id),
  type text not null check (
    type in ('initial_allocation', 'replenish', 'reallocate_in', 'reallocate_out', 'return_to_general', 'adjustment')
  ),
  unit_ids uuid[] not null default '{}',
  quantity_delta integer not null,
  unit_source text not null check (unit_source in ('scan', 'fifo_assignment')),
  -- RFC 0010 §6/§8 — populated only on a manual-mode reconciliation write
  -- (`type='return_to_general' AND unit_source='fifo_assignment'`); null on
  -- every other row, including NFC's own `return_to_general` rows.
  quantity_expected integer,
  -- RFC 0009 §2's correction — set only on reallocate_in/reallocate_out
  -- pairs, referencing the EventAllocation on the other side of the same
  -- reallocation write.
  counterpart_event_allocation_id uuid references public.event_allocations (id),
  created_at timestamptz not null default now()
);

comment on table public.allocation_movements is
  'Internal-only entity owned by EventAllocation (domain-model.md, RFC '
  '0009 §2/RFC 0010 §6). Write-once, never updated/deleted. OWNER-only '
  'reads — never surfaced to Ana directly (events.md §3.21''s own "she only '
  'ever sees a number change" rule); no client-writable INSERT/UPDATE/'
  'DELETE at all — only this file''s private helpers write here.';

create index if not exists allocation_movements_business_id_idx
  on public.allocation_movements (business_id);
create index if not exists allocation_movements_event_allocation_id_idx
  on public.allocation_movements (event_allocation_id);

-- ---------------------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------------------
alter table public.event_allocations enable row level security;
alter table public.event_allocation_units enable row level security;
alter table public.allocation_movements enable row level security;

-- event_allocations/event_allocation_units — any active member reads (OWNER
-- + SELLER) — needed for home.md §3.9's Event-scoped remaining-stock tile
-- read during selling, a Business-Event fact shown identically to both
-- roles ("not a role-gated one," home.md §3.9's own annotation), even
-- though the allocation-*management* screens themselves (events.md
-- §3.21-§3.25) stay OWNER-only at the RPC layer, below.
create policy event_allocations_select on public.event_allocations
  for select
  using (public.is_active_member_of(business_id));

create policy event_allocation_units_select on public.event_allocation_units
  for select
  using (public.is_active_member_of(business_id));

grant select on public.event_allocations to authenticated;
grant select on public.event_allocation_units to authenticated;

-- allocation_movements — OWNER-only (an audit ledger Ana never sees; only
-- the OWNER-only allocation screens' own "Ya revisaste esto" check reads it).
create policy allocation_movements_select on public.allocation_movements
  for select
  using (public.is_active_owner_of(business_id));

grant select on public.allocation_movements to authenticated;

-- ---------------------------------------------------------------------------
-- _fifo_commit_to_allocation — private helper, NOT granted to `authenticated`.
-- Generalizes NFC allocation-time exclusivity's own conditional
-- `available -> reserved` write (RFC 0009 §3(a)) to manual/FIFO mode (RFC
-- 0010 §2's `commitAllocation()`), one shared mechanism for both:
--
--   - `p_specific_unit_ids` supplied (non-empty) — commit exactly those unit
--     ids (NFC's own single scanned unit; a reallocation's destination side,
--     re-committing the exact set just released from the source, within the
--     same transaction). Each candidate must currently be `status='available'`
--     — a conditional write, zero-rows-affected for an id already spoken for
--     elsewhere (sold, mid-Sale, or committed to a different allocation).
--   - `p_specific_unit_ids` null/empty, `p_quantity` > 0 — FIFO-pick
--     `p_quantity` `available AND untagged` units for `p_product_id`, oldest
--     `received_at` first (D5), `FOR UPDATE SKIP LOCKED` (the identical
--     concurrency-safety mechanism `assign_tag_to_next_pending_unit`/
--     `add_item_to_sale` already establish). The `untagged` filter keeps
--     manual/FIFO commitment out of the pool NFC allocation earmarks for
--     scan-based consumption specifically (RFC 0010 §2).
--
-- Partial-fulfillment tolerant — fewer candidates than requested is not an
-- error, the same tolerance ordinary FIFO consumption already has; zero
-- candidates returns an empty `committed_unit_ids` array, never raises.
--
-- On a non-empty commit: inserts the corresponding `event_allocation_units`
-- rows (`on conflict do nothing`, the DB-level form of the client mock's own
-- defensive dedupe), increments `event_allocations.quantity_allocated` by
-- the actual count committed **only when `p_unit_source='fifo_assignment'`**
-- (RFC 0009's own ubiquitous-language: this counter is manual-mode-only),
-- reactivates a `reconciled` allocation back to `open` (a fresh commitment
-- is the natural, correct reason to un-reconcile a row that was previously
-- fully resolved), and writes one `allocation_movements` row —
-- `p_movement_type` when the caller supplies one explicitly (reallocation's
-- own `'reallocate_in'`), else auto-inferred as `'initial_allocation'` (this
-- specific `(event_allocation_id, unit_source)` pair had zero committed
-- units before this call) or `'replenish'` (it already had some) — resolved
-- from live state, never a separately tracked flag, matching events.md
-- §3.21's own "she only ever sees a number change... never picks or is told
-- which underlying movement type wrote" rule.
-- ---------------------------------------------------------------------------
create or replace function public._fifo_commit_to_allocation(
  p_business_id uuid,
  p_event_allocation_id uuid,
  p_product_id uuid,
  p_unit_source text,
  p_quantity int,
  p_specific_unit_ids uuid[],
  p_movement_type text,
  p_counterpart_event_allocation_id uuid
)
returns table (committed_unit_ids uuid[], movement_id uuid, movement_type text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_candidate_ids uuid[];
  v_was_empty boolean;
  v_resolved_type text;
  v_movement_id uuid;
begin
  if p_specific_unit_ids is not null and array_length(p_specific_unit_ids, 1) > 0 then
    select coalesce(array_agg(iu.id), '{}') into v_candidate_ids
    from public.inventory_units iu
    where iu.id = any(p_specific_unit_ids)
      and iu.business_id = p_business_id
      and iu.status = 'available'
    for update of iu skip locked;
  elsif p_quantity is not null and p_quantity > 0 then
    select coalesce(array_agg(pick.id), '{}') into v_candidate_ids
    from (
      select iu.id
      from public.inventory_units iu
      where iu.business_id = p_business_id
        and iu.product_id = p_product_id
        and iu.status = 'available'
        and not exists (select 1 from public.nfc_tags nt where nt.unit_id = iu.id)
      order by iu.received_at asc
      for update of iu skip locked
      limit p_quantity
    ) pick;
  else
    v_candidate_ids := '{}';
  end if;

  if coalesce(array_length(v_candidate_ids, 1), 0) = 0 then
    return query select '{}'::uuid[], null::uuid, null::text;
    return;
  end if;

  -- Resolved before the insert below, against this exact (allocation,
  -- source) pair's own prior state — never a separately tracked flag.
  select not exists (
    select 1 from public.event_allocation_units
    where event_allocation_id = p_event_allocation_id and unit_source = p_unit_source
  ) into v_was_empty;

  update public.inventory_units set status = 'reserved' where id = any(v_candidate_ids);

  insert into public.event_allocation_units (business_id, event_allocation_id, unit_id, unit_source)
  select p_business_id, p_event_allocation_id, u, p_unit_source
  from unnest(v_candidate_ids) as u
  on conflict (event_allocation_id, unit_id) do nothing;

  if p_unit_source = 'fifo_assignment' then
    update public.event_allocations
    set quantity_allocated = quantity_allocated + array_length(v_candidate_ids, 1)
    where id = p_event_allocation_id;
  end if;

  -- A fresh commitment is the correct, natural reason to un-reconcile a row
  -- that had previously fully resolved (RFC 0009's `status` lifecycle —
  -- "at most one row per pair, ever," reused rather than superseded by a
  -- sibling row).
  update public.event_allocations
  set status = 'open'
  where id = p_event_allocation_id and status = 'reconciled';

  v_resolved_type := coalesce(p_movement_type, case when v_was_empty then 'initial_allocation' else 'replenish' end);

  insert into public.allocation_movements (
    business_id, event_allocation_id, type, unit_ids, quantity_delta, unit_source,
    quantity_expected, counterpart_event_allocation_id
  )
  values (
    p_business_id, p_event_allocation_id, v_resolved_type, v_candidate_ids, array_length(v_candidate_ids, 1),
    p_unit_source, null, p_counterpart_event_allocation_id
  )
  returning id into v_movement_id;

  return query select v_candidate_ids, v_movement_id, v_resolved_type;
end;
$$;

revoke execute on function public._fifo_commit_to_allocation(uuid, uuid, uuid, text, int, uuid[], text, uuid) from public;
revoke execute on function public._fifo_commit_to_allocation(uuid, uuid, uuid, text, int, uuid[], text, uuid) from authenticated;

-- ---------------------------------------------------------------------------
-- _release_from_allocation — private helper, NOT granted to `authenticated`.
-- RFC 0010 §11's `releaseAllocation()` — the symmetric decrease/
-- reconciliation operation, generalized to also serve reallocation's own
-- source-side release (RFC 0009 §4):
--
--   - `p_specific_unit_ids` supplied (non-empty) — release exactly those
--     unit ids (a reallocation's own known-tag scan-sourced move). Each
--     candidate must currently belong to this `(event_allocation_id,
--     p_unit_source)` pair, be `status='reserved'`, and not yet claimed by
--     any `sale_items` row.
--   - `p_specific_unit_ids` null/empty — most-recently-committed-first
--     (`committed_at desc`, RFC 0010 §11 — a different question from
--     commit's own oldest-first order, answering "which of *this
--     allocation's own* committed units should re-enter the shared pool,"
--     not "which unit is fairest to claim from everyone else's pool"),
--     `FOR UPDATE SKIP LOCKED`, limited to `p_quantity`. **`p_quantity=0` is
--     a legitimate, real call** — RFC 0010 §8's "No regresó" (N=1) and a
--     stepper confirmed at 0 both mean it, and still need their own
--     zero-delta ledger row (for the ambient "Confirmaste que 0 de N..."
--     copy, and so a later visit's "Ya revisaste esto" check can find this
--     attempt) — this returns an empty set and still writes the movement row
--     below, never a no-op skip.
--
-- **Scan-sourced units are never candidates for the "most-recently-
-- committed-first" branch** — only reachable via `p_specific_unit_ids`
-- (RFC 0010 §11: "a manual quantity-decrease via the stepper must never
-- touch an NFC-tagged commitment"). Callers pass `p_unit_source` explicitly
-- either way; this function never mixes sources within one call.
--
-- On release: flips each candidate's `inventory_units.status` back to
-- `available` (`allocatedUnitIds`/`event_allocation_units` itself is never
-- pruned, RFC 0010 §11's own append-only rule), writes one
-- `allocation_movements` row (`p_movement_type`, the actual released
-- `unit_ids`, negative `quantity_delta`, `p_quantity_expected` when given),
-- and — **only when `p_movement_type='return_to_general'`** (the Phase 2b
-- design summary's own scoping, narrower than RFC 0009's ubiquitous-language
-- text which also names `reallocate_out` as a reconciling trigger; flagged
-- as an open item for architect/reviewer to confirm, not silently resolved
-- either way here) — flips `event_allocations.status` to `'reconciled'` once
-- zero `reserved`-and-unclaimed units of *either* `unit_source` remain for
-- this allocation.
-- ---------------------------------------------------------------------------
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
      and not exists (select 1 from public.sale_items si where si.unit_id = iu.id);

    if v_remaining_after = 0 then
      update public.event_allocations set status = 'reconciled' where id = p_event_allocation_id;
    end if;
  end if;

  return query select coalesce(v_candidate_ids, '{}'), v_movement_id;
end;
$$;

revoke execute on function public._release_from_allocation(uuid, uuid, text, int, uuid[], text, int, uuid) from public;
revoke execute on function public._release_from_allocation(uuid, uuid, text, int, uuid[], text, int, uuid) from authenticated;

-- ---------------------------------------------------------------------------
-- save_event_allocations — events.md §3.21/§3.23 "Guardar cambios," the bulk
-- manual-allocation commit: one write, every row's staged manual quantity at
-- once. OWNER-only. Full idempotency treatment (cache-and-replay, matching
-- `commit_lot`'s own shape) — a client-initiated retry on a write with real
-- merchant-facing consequence (`events.md` §3.23's own convention).
--
-- `p_changes` shape (JSONB array): `[{ "product_id": "<uuid>", "quantity":
-- <int> }, ...]`.
--
-- For each change: mint-or-find this Event's own `event_allocations` row for
-- that Product (never creating one for a still-zero quantity against a
-- not-yet-existing pair — "nothing to create for a still-zero row," matching
-- the client mock's own precedent); compute the signed delta between the
-- requested quantity and that allocation's current live-remaining
-- `fifo_assignment`-sourced count (never `quantity_allocated`, the monotonic
-- lifetime total); dispatch to `_fifo_commit_to_allocation` (delta > 0) or
-- `_release_from_allocation` (delta < 0, `type='adjustment'`) to do the
-- actual FIFO/ledger work. A delta of 0 is a true no-op (no movement row) —
-- distinct from `reconcile_manual_allocation`'s own `quantity=0`, which is a
-- real confirmed-zero reconciliation event, not this function's territory.
-- ---------------------------------------------------------------------------
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
      select count(*) into v_remaining
      from public.event_allocation_units eau
      join public.inventory_units iu on iu.id = eau.unit_id
      where eau.event_allocation_id = v_alloc_id
        and eau.unit_source = 'fifo_assignment'
        and iu.status = 'reserved'
        and not exists (select 1 from public.sale_items si where si.unit_id = iu.id);
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

revoke execute on function public.save_event_allocations(uuid, uuid, uuid, jsonb) from public;
grant execute on function public.save_event_allocations(uuid, uuid, uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- scan_unit_into_event_allocation — events.md §3.22 "Escaneando: [Producto],"
-- NFC-mode's live, immediate per-scan allocation write. OWNER-only. A fresh
-- idempotency key per scan (client generates a new one per physical scan,
-- never reused across separate scans — matching
-- `assign_tag_to_next_pending_unit`'s own precedent) — still supports
-- replaying a lost-response retry of that *same* scan attempt.
--
-- Resolves the physical tag to its already-tagged `InventoryUnit` (a unit
-- must already carry an `nfc_tags` row — Asignar Tags, `inventory.md`
-- §3.14-§3.17 — before it can ever be scanned into an allocation; scanning
-- here never mints a new tag assignment). `tag_not_found` when no `nfc_tags`
-- row matches this Business — a defensive case with no dedicated copy in
-- the Approved UX (which only names the "already in another event"/"could
-- not read" cases), left as a distinct error code for the client to map.
-- Mint-or-finds this Event's own `event_allocations` row for the tag's
-- Product, then delegates to `_fifo_commit_to_allocation` with the specific
-- resolved unit id — an empty `committed_unit_ids` result means the unit
-- wasn't `available` (already sold, mid-Sale, or committed to a *different*
-- open allocation), surfaced as `unit_already_committed` — the server-side
-- source of §3.22's "Esta prenda ya está en otro evento. Usa otra."
-- ---------------------------------------------------------------------------
create or replace function public.scan_unit_into_event_allocation(
  p_business_id uuid,
  p_event_id uuid,
  p_product_id uuid,
  p_tag_identifier text,
  p_idempotency_key uuid
)
returns table (event_allocation_id uuid, unit_id uuid, movement_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_resolved_unit_id uuid;
  v_alloc_id uuid;
  v_commit record;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'scan_unit_into_event_allocation')
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
        (v_existing_result ->> 'event_allocation_id')::uuid,
        (v_existing_result ->> 'unit_id')::uuid,
        (v_existing_result ->> 'movement_id')::uuid;
    return;
  end if;

  if not exists (select 1 from public.events where id = p_event_id and business_id = p_business_id) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;

  if not exists (select 1 from public.products where id = p_product_id and business_id = p_business_id) then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;

  select nt.unit_id into v_resolved_unit_id
  from public.nfc_tags nt
  where nt.business_id = p_business_id and nt.tag_identifier = p_tag_identifier;

  if v_resolved_unit_id is null then
    raise exception 'tag_not_found' using errcode = 'P0001';
  end if;

  if not exists (
    select 1 from public.inventory_units iu
    where iu.id = v_resolved_unit_id and iu.product_id = p_product_id
  ) then
    raise exception 'tag_wrong_product' using errcode = 'P0001';
  end if;

  select id into v_alloc_id
  from public.event_allocations
  where event_id = p_event_id and product_id = p_product_id;

  if v_alloc_id is null then
    insert into public.event_allocations (business_id, event_id, product_id)
    values (p_business_id, p_event_id, p_product_id)
    returning id into v_alloc_id;
  end if;

  select * into v_commit
  from public._fifo_commit_to_allocation(
    p_business_id, v_alloc_id, p_product_id, 'scan', null, array[v_resolved_unit_id], null, null
  );

  if v_commit.movement_id is null then
    raise exception 'unit_already_committed' using errcode = 'P0001';
  end if;

  update public.idempotency_keys
  set result = jsonb_build_object(
    'event_allocation_id', v_alloc_id, 'unit_id', v_resolved_unit_id, 'movement_id', v_commit.movement_id
  )
  where id = p_idempotency_key;

  return query select v_alloc_id, v_resolved_unit_id, v_commit.movement_id;
end;
$$;

revoke execute on function public.scan_unit_into_event_allocation(uuid, uuid, uuid, text, uuid) from public;
grant execute on function public.scan_unit_into_event_allocation(uuid, uuid, uuid, text, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- reallocate_event_allocation — events.md §3.24 "Mover a otro evento," D57's
-- single-transaction move of allocated stock between two simultaneously-open
-- Events. OWNER-only. Full idempotency treatment (cache-and-replay) — a
-- client-initiated retry on a write with real merchant-facing consequence
-- (§3.24's own "the underlying two-write mechanism is entirely invisible to
-- Ana... one save state, one confirmation").
--
-- `p_unit_source` selects exactly one pool to move per call, matching the
-- Approved UX (a mixed row's two "Mover a otro evento" buttons each carry
-- their own mode qualifier and act independently, §3.16 — this build never
-- produces a single mixed-source move):
--   - `'fifo_assignment'` — `p_quantity` required (> 0); releases up to that
--     many of the source allocation's own most-recently-committed
--     `fifo_assignment` units, then re-commits exactly that released set at
--     the destination.
--   - `'scan'` — `p_unit_ids` required (non-empty); releases exactly those
--     specific known-tagged units from the source, then re-commits them at
--     the destination.
--
-- Both source-release and destination-commit happen inside this one
-- function's own transaction — the row locks `_release_from_allocation`
-- takes on the released units are held continuously through the following
-- `_fifo_commit_to_allocation` call, so no other transaction can touch them
-- in between (`architecture-principles.md` #2's boundary-sizing reading,
-- RFC 0009 §4). Source writes `type='reallocate_out'`, destination writes
-- `type='reallocate_in'`, each carrying the other's `event_allocation_id`
-- as `counterpart_event_allocation_id` (RFC 0009 §2's correction).
-- ---------------------------------------------------------------------------
create or replace function public.reallocate_event_allocation(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_source_event_id uuid,
  p_dest_event_id uuid,
  p_product_id uuid,
  p_unit_source text,
  p_quantity int,
  p_unit_ids uuid[]
)
returns table (
  source_event_allocation_id uuid,
  dest_event_allocation_id uuid,
  moved_unit_ids uuid[],
  source_movement_id uuid,
  dest_movement_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_source_alloc_id uuid;
  v_dest_alloc_id uuid;
  v_release record;
  v_commit record;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_unit_source not in ('scan', 'fifo_assignment') then
    raise exception 'invalid_unit_source' using errcode = 'P0002';
  end if;

  if p_source_event_id = p_dest_event_id then
    raise exception 'same_event' using errcode = 'P0002';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'reallocate_event_allocation')
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
        (v_existing_result ->> 'source_event_allocation_id')::uuid,
        (v_existing_result ->> 'dest_event_allocation_id')::uuid,
        (select array_agg(elem::uuid) from jsonb_array_elements_text(v_existing_result -> 'moved_unit_ids') as elem),
        (v_existing_result ->> 'source_movement_id')::uuid,
        (v_existing_result ->> 'dest_movement_id')::uuid;
    return;
  end if;

  if not exists (select 1 from public.events where id = p_source_event_id and business_id = p_business_id) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.events where id = p_dest_event_id and business_id = p_business_id) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.products where id = p_product_id and business_id = p_business_id) then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;

  select id into v_source_alloc_id
  from public.event_allocations
  where event_id = p_source_event_id and product_id = p_product_id;

  if v_source_alloc_id is null then
    raise exception 'event_allocation_not_found' using errcode = 'P0002';
  end if;

  select id into v_dest_alloc_id
  from public.event_allocations
  where event_id = p_dest_event_id and product_id = p_product_id;

  if v_dest_alloc_id is null then
    insert into public.event_allocations (business_id, event_id, product_id)
    values (p_business_id, p_dest_event_id, p_product_id)
    returning id into v_dest_alloc_id;
  end if;

  if p_unit_source = 'fifo_assignment' then
    if p_quantity is null or p_quantity <= 0 then
      raise exception 'quantity_required' using errcode = 'P0002';
    end if;
    select * into v_release
    from public._release_from_allocation(
      p_business_id, v_source_alloc_id, 'fifo_assignment', p_quantity, null, 'reallocate_out', null, v_dest_alloc_id
    );
  else
    if p_unit_ids is null or array_length(p_unit_ids, 1) is null or array_length(p_unit_ids, 1) = 0 then
      raise exception 'unit_ids_required' using errcode = 'P0002';
    end if;
    select * into v_release
    from public._release_from_allocation(
      p_business_id, v_source_alloc_id, 'scan', null, p_unit_ids, 'reallocate_out', null, v_dest_alloc_id
    );
  end if;

  if coalesce(array_length(v_release.released_unit_ids, 1), 0) = 0 then
    raise exception 'nothing_to_move' using errcode = 'P0001';
  end if;

  select * into v_commit
  from public._fifo_commit_to_allocation(
    p_business_id, v_dest_alloc_id, p_product_id, p_unit_source, null, v_release.released_unit_ids,
    'reallocate_in', v_source_alloc_id
  );

  update public.idempotency_keys
  set result = jsonb_build_object(
    'source_event_allocation_id', v_source_alloc_id,
    'dest_event_allocation_id', v_dest_alloc_id,
    'moved_unit_ids', to_jsonb(v_commit.committed_unit_ids),
    'source_movement_id', v_release.movement_id,
    'dest_movement_id', v_commit.movement_id
  )
  where id = p_idempotency_key;

  return query select v_source_alloc_id, v_dest_alloc_id, v_commit.committed_unit_ids, v_release.movement_id, v_commit.movement_id;
end;
$$;

revoke execute on function public.reallocate_event_allocation(uuid, uuid, uuid, uuid, uuid, text, int, uuid[]) from public;
grant execute on function public.reallocate_event_allocation(uuid, uuid, uuid, uuid, uuid, text, int, uuid[]) to authenticated;

-- ---------------------------------------------------------------------------
-- return_scanned_units_to_general — events.md §3.16/§3.25 "Regresar a
-- inventario general," NFC-tagged rows' own full-known-set reconciliation.
-- OWNER-only. Full idempotency treatment. No quantity argument — by design
-- (RFC 0010 §8: "the exact set of unsold tagged units is already fully and
-- unambiguously known... reconciliation is a bookkeeping update to an
-- already-true record, not a new claim"), this always releases every
-- currently `reserved`-and-unclaimed `scan`-sourced unit for the given
-- allocation, in one call.
-- ---------------------------------------------------------------------------
create or replace function public.return_scanned_units_to_general(
  p_business_id uuid,
  p_event_allocation_id uuid,
  p_idempotency_key uuid
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
  v_release record;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'return_scanned_units_to_general')
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

  -- No stepper exists for this path — "release everything currently
  -- outstanding" is expressed as an unbounded ceiling, letting
  -- `_release_from_allocation`'s own candidate pool naturally cap the count.
  select * into v_release
  from public._release_from_allocation(
    p_business_id, p_event_allocation_id, 'scan', 2147483647, null, 'return_to_general', null, null
  );

  update public.idempotency_keys
  set result = jsonb_build_object('released_unit_ids', to_jsonb(v_release.released_unit_ids), 'movement_id', v_release.movement_id)
  where id = p_idempotency_key;

  return query select v_release.released_unit_ids, v_release.movement_id;
end;
$$;

revoke execute on function public.return_scanned_units_to_general(uuid, uuid, uuid) from public;
grant execute on function public.return_scanned_units_to_general(uuid, uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- reconcile_manual_allocation — events.md §3.16 closed-Event reconciliation
-- for manual/untagged rows ("Sí, regresaron las N" / "No regresó" / Ajustar
-- cantidad's "Confirmar"), RFC 0010 §8's own quantity-based reconciliation
-- action. OWNER-only. Full idempotency treatment.
--
-- `p_quantity` is the merchant-confirmed count (0..expected — see below).
-- **`quantity_expected` is derived server-side, authoritatively, immediately
-- before the release** — never trusted from the client — since it's the
-- exact live count RFC 0010 §8 already defines as "computed fresh on every
-- render," and a client-supplied value could be stale by the time this
-- write actually executes (e.g. a concurrent reconciliation from another
-- device already resolved part of it). `p_quantity` above `expected` is
-- clamped down to it, never rejected — the same tolerant posture this file's
-- other partial-fulfillment paths already hold.
-- ---------------------------------------------------------------------------
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

  select count(*) into v_expected
  from public.event_allocation_units eau
  join public.inventory_units iu on iu.id = eau.unit_id
  where eau.event_allocation_id = p_event_allocation_id
    and eau.unit_source = 'fifo_assignment'
    and iu.status = 'reserved'
    and not exists (select 1 from public.sale_items si where si.unit_id = iu.id);

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

revoke execute on function public.reconcile_manual_allocation(uuid, uuid, uuid, int) from public;
grant execute on function public.reconcile_manual_allocation(uuid, uuid, uuid, int) to authenticated;
