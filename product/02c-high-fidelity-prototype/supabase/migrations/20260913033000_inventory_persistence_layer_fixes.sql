-- Stage 7 Backend Integration, Phase 1 — `reviewer` fix round 1 (Important
-- findings 1 and 2 — the Blocker finding was a client-only fix, see
-- `src/domain/store.tsx`'s `commitLot` and `RegisterMerchandise.tsx`).
--
-- Follow-up to 20260913030000_inventory_persistence_layer.sql/
-- 20260913031000_inventory_persistence_layer_fixes.sql, applied as a new
-- migration rather than editing either already-applied file — same "never
-- edit an already-applied migration" discipline the Phase 0 fix migrations
-- already established.
--
-- ---------------------------------------------------------------------------
-- Important finding 1 — the FIFO index doesn't match
-- assign_tag_to_next_pending_unit's actual query shape.
--
-- `inventory_units_fifo_idx (product_id, status, received_at)`, defined in
-- 20260913030000, does not serve `assign_tag_to_next_pending_unit`'s real
-- query: that RPC filters on `business_id` + `status = 'available'` + a NOT
-- EXISTS against `nfc_tags` — deliberately no `product_id` predicate at all
-- (inventory.md §2's whole-Catalog tag-queue semantics — a global FIFO
-- queue across every Product, not a bug in the query itself) — ordered by
-- `received_at`. The existing index can't serve this query's WHERE (no
-- `business_id` leading column) or its ORDER BY (buried behind `product_id`
-- with no equality predicate on it).
--
-- `inventory_units_fifo_idx` is NOT dropped — it stays genuinely useful for
-- a real, different future query: Phase 2's buttons-mode Sale consumption
-- (`addItemToSale`'s FIFO pick, `store.tsx`), which IS naturally scoped to
-- one specific Product (`WHERE product_id = X AND status = 'available'
-- ORDER BY received_at`) — exactly this index's own shape. Its 030000
-- header comment overstated its coverage (implied it served every FIFO
-- read, including this migration's own `assign_tag_to_next_pending_unit`,
-- which it never could) — corrected below via `COMMENT ON INDEX` rather
-- than editing that already-applied migration's file directly.
-- ---------------------------------------------------------------------------
create index if not exists inventory_units_pending_tag_queue_idx
  on public.inventory_units (business_id, status, received_at)
  where status = 'available';

comment on index public.inventory_units_pending_tag_queue_idx is
  'Matches assign_tag_to_next_pending_unit()''s actual query shape: filters '
  'business_id + status=''available'' (deliberately no product_id predicate '
  '— inventory.md §2''s whole-Catalog tag-queue semantics), orders by '
  'received_at. Partial on status=''available'' since that''s the only '
  'status this query ever reads.';

comment on index public.inventory_units_fifo_idx is
  'Corrected 20260913033000 (reviewer finding) — this index does NOT serve '
  'assign_tag_to_next_pending_unit(): that RPC has no product_id predicate '
  'at all (inventory.md §2''s whole-Catalog tag-queue semantics); it is '
  'served by inventory_units_pending_tag_queue_idx instead. Kept for its '
  'own real, different future use — Phase 2''s buttons-mode Sale '
  'consumption, which genuinely does filter FIFO by product_id (WHERE '
  'product_id = X AND status = ''available'' ORDER BY received_at), exactly '
  'this index''s shape. The 20260913030000 migration''s own header comment '
  'overstated this index''s coverage; this comment is the corrected record '
  '(that migration file itself is left unedited, per this repo''s "never '
  'edit an already-applied migration" discipline).';

-- ---------------------------------------------------------------------------
-- Important finding 2 — Product.photo storage mechanism was presented as a
-- settled, disclosed-and-done deferral rather than routed back through
-- Decision Ownership.
--
-- `architect`'s Phase 1 design summary (`context/stage-7-backend-
-- integration.md`, open item 2) explicitly recommended real Supabase
-- Storage (a bucket + this column holding a path/URL) over inheriting the
-- prototype mock's inline base64-data-URL shape, citing real costs given
-- `Product.photo`/D54 is already live and merchant-facing for 2 real pilot
-- merchants: row bloat, no CDN, Postgres text-column limits under load.
-- 20260913030000's build kept the data-URL shape instead and described that
-- choice in its own header/table comment as if already settled — a real
-- implementation deviation from architect's own explicit recommendation,
-- made unilaterally rather than routed back for reconfirmation.
--
-- This is a documentation/process correction only, not a schema change —
-- `photo text` itself stays correct and storage-mechanism-agnostic either
-- way, and building real Supabase Storage wiring (bucket creation, upload
-- flow, URL generation) is separate, unscoped work, not done here. The
-- column comment below replaces 20260913030000's settled-sounding language
-- with the honest status: provisionally deferred, pending architect
-- reconfirmation. See `context/stage-7-backend-integration.md`'s "Open
-- items, not resolved" list for the tracked open item itself.
-- ---------------------------------------------------------------------------
comment on column public.products.photo is
  'D54/Q23 — optional. Currently a client-local base64 data URL, unchanged '
  'from the prototype mock''s own shape. PROVISIONALLY DEFERRED, PENDING '
  'ARCHITECT RECONFIRMATION (reviewer finding, 2026-09-13) — architect''s '
  'Phase 1 design summary recommended real Supabase Storage (a bucket + '
  'this column holding a path/URL) instead, citing row bloat/no CDN/'
  'text-column limits under load; this column stays storage-mechanism-'
  'agnostic either way, but the data-URL choice is NOT a closed decision '
  'until that reconfirmation happens. See '
  'context/stage-7-backend-integration.md''s open items list.';
