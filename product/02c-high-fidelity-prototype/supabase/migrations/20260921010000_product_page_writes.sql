-- Stage 7 Backend Integration, Phase 1 follow-up — the two writes
-- `inventory.md`'s 2026-09-19 Catalog-card → Product-Page amendment adds
-- (Approved spec; `ux-critic` twice, `reviewer` once, all findings closed):
--
--   1. update_product_name  — §3.19a "Editar nombre." Product rename is
--      newly supported. `Product.name` is a plain mutable scalar referenced
--      everywhere by ID (D2), so a rename is retroactive to every past Sale,
--      report, receipt and allocation *by construction* — no historical row
--      is altered, and no name history is kept (the same posture D33 fixed
--      for `defaultPrice`, D54 for `photo`, D65 for `barcode`).
--
--   2. clear_product_barcode — §3.19c "Quitar código de barras"
--      (`decision-log.md` D80, Paid tier only), the merchant-facing way to
--      return `Product.barcode` to its already-legal empty state.
--
-- Both follow the exact shape update_product_price/update_product_photo/
-- update_product_barcode already established: OWNER-only, idempotency-keyed
-- (architecture-principles.md #7), single-column UPDATE, no cached-result
-- replay branch (retrying re-applies the identical UPDATE; a plain
-- single-column write has no duplicate-creation side effect to guard
-- against).

-- ---------------------------------------------------------------------------
-- 1. update_product_name — inventory.md §3.19a
--
-- Matching rule is §3.8's, reused verbatim, never re-derived: compare the
-- typed text against **every other Product's name in this Business's
-- Catalog** after lowercasing both sides and trimming leading/trailing
-- whitespace — the one automatic normalization, and deliberately no fuzzy or
-- typo-tolerant matching ("Bolsa" and "Bolsas" stay two distinct Products).
--
-- The uniqueness check is against every *other* Product only, never this one
-- (§3.19a's explicit carve-out): a pure casing/spacing change (" camisas " →
-- "Camisas") saves normally, because the stored literal genuinely changes
-- and the Catalog marker's own derived initial letter may change with it.
--
-- There is deliberately **no database unique index on (business_id, name)**,
-- and none is added here. `products` has never carried one — name uniqueness
-- is a §3.8 *matching* rule enforced at the two write paths that can create
-- or change a name, not a storage invariant, and adding an index now would
-- retroactively invalidate any legacy row pair that predates the rule. What
-- this function does instead is re-run the identical client-side check
-- server-side, so a **concurrent rename on another device** is caught and
-- surfaces through §3.19a's ordinary save-error path (§3.10/§3.11), never
-- through a separate branch and never as a silent duplicate — exactly what
-- §3.19a specifies ("A concurrent rename on another device surfaces through
-- the same save-error path, not through a separate branch").
--
-- What is stored: her typed text with leading/trailing whitespace trimmed.
-- Internal casing and internal spacing are preserved exactly as typed — no
-- title-casing, no collapsing of double spaces, no other normalization
-- (§3.19a's "one automatic normalization, no more," applied to the write
-- side).
--
-- No merge, ever (§3.19a/D2): renaming a Product onto another Product's name
-- is refused, never resolved by combining the two.
-- ---------------------------------------------------------------------------
create or replace function public.update_product_name(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid,
  p_new_name text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_trimmed text;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  v_trimmed := btrim(coalesce(p_new_name, ''));

  -- §3.19a: "[ Guardar nombre ] stays disabled while the field is empty or
  -- whitespace-only." Enforced here too, defensively, rather than trusting
  -- the client alone — the same posture update_product_barcode's own
  -- `barcode_required` guard already takes.
  if v_trimmed = '' then
    raise exception 'name_required' using errcode = '22023';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'update_product_name')
  on conflict (id) do nothing;

  if exists (
    select 1
    from public.products p
    where p.business_id = p_business_id
      and p.id <> p_product_id
      and lower(btrim(p.name)) = lower(v_trimmed)
  ) then
    raise exception 'product_name_already_registered' using errcode = 'P0001';
  end if;

  update public.products
  set name = v_trimmed
  where id = p_product_id and business_id = p_business_id;

  if not found then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.update_product_name(uuid, uuid, uuid, text) from public;
grant execute on function public.update_product_name(uuid, uuid, uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. clear_product_barcode — inventory.md §3.19c, `decision-log.md` D80
--
-- D80's four binding constraints, each enforced or preserved here:
--
--   (1) Clearing is its **own deliberate action**, never an implicit
--       consequence of saving a blank value. `update_product_barcode`'s
--       existing `barcode_required` guard stays exactly as it is and is not
--       weakened — this is a separate function with a separate name, reached
--       only from a separate, labelled merchant action.
--   (2) `nfc_tagging_enabled` is **not touched, in either direction.** It
--       stays `false` — which it already was, whichever path produced the
--       barcode (either update_product_barcode's D71 clear-on-save cleared
--       it, or the Product was created barcode-identified and never opted
--       in). `set_product_nfc_tagging_enabled`'s existing server-side
--       `product_has_barcode` guard is never bypassed; it simply stops
--       applying once the barcode is genuinely gone.
--   (3) Clearing a barcode and enabling NFC stay **two separate merchant
--       actions with two separate writes.** No combined "cambiar este
--       producto a NFC" function exists, and none may be added.
--   (4) **Zero `inventory_units` rows and zero `nfc_tags` rows are touched.**
--       No tag cleanup, no detachment, no cascade of any kind: any "clean up
--       tags when identification changes" behaviour would be a second
--       non-sale tag-detachment case and needs its own RFC (§11). It is not
--       designed, not implied, and must not be added.
--
-- No guard conditions, stated affirmatively rather than left silent (D80
-- found none to impose): removal is permitted regardless of this Product's
-- `available` count, regardless of `reserved` units in an in-flight Sale,
-- regardless of units committed to an open EventAllocation, and regardless of
-- how many of its units carry tags. Recorded explicitly so a future reader
-- does not mistake the absence of a guard for an oversight.
--
-- Null is not a new state: the column is already nullable, and
-- `products_barcode_unique_idx` is already **partial**
-- (`where barcode is not null`), so any number of Products with no barcode
-- coexist without colliding. Nothing downstream learns a new case.
--
-- Idempotent in effect as well as by key: a second call simply sets an
-- already-null column to null.
-- ---------------------------------------------------------------------------
create or replace function public.clear_product_barcode(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid
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
  values (p_idempotency_key, p_business_id, 'clear_product_barcode')
  on conflict (id) do nothing;

  -- Single-column write. `nfc_tagging_enabled` is deliberately absent from
  -- this SET list (D80 constraint 2), as are every inventory_units and
  -- nfc_tags row (constraint 4).
  update public.products
  set barcode = null
  where id = p_product_id and business_id = p_business_id;

  if not found then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.clear_product_barcode(uuid, uuid, uuid) from public;
grant execute on function public.clear_product_barcode(uuid, uuid, uuid) to authenticated;
