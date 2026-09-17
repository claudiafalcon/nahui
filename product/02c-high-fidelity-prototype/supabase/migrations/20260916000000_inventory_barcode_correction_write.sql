-- Stage 7 Backend Integration, Phase 1 follow-up — inventory.md §3.4c-§3.4g
-- "Editar código de barras" (`decision-log.md` D65, 2026-09-16/17 amendment,
-- expedited pass closing a real, live production defect: a barcode misread
-- once at registration had no write path to correct it, permanently
-- blocking every later, correctly-read scan of that same physical item from
-- matching).
--
-- update_product_barcode — same shape as update_product_price/
-- update_product_photo immediately above it in
-- 20260913030000_inventory_persistence_layer.sql: OWNER-only,
-- idempotency-keyed (architecture-principles.md #7), single-column UPDATE,
-- no cached-result replay branch (retrying re-applies the identical UPDATE,
-- no duplicate-creation side effect to guard against).
--
-- One deliberate difference from those two siblings: `p_new_barcode` is
-- `not null` here — inventory.md §3.4c's own sheet has no "Quitar" affordance
-- ("no Quitar (remove) action designed here... removing an existing one
-- wasn't the reported problem and isn't designed in this pass") and
-- "Guardar código de barras" is disabled client-side until a fresh scan has
-- actually been staged, so this function is never called with a null/empty
-- value by the approved UI — enforced here too, defensively, rather than
-- trusting the client alone.
--
-- The one real edge case inventory.md §3.4e resolves explicitly — a
-- freshly-scanned code already belonging to a *different* Product — is
-- caught client-side before this function is ever called (CatalogView.tsx's
-- own `matchProductByBarcode` check against already-loaded state, mirroring
-- commit_lot's own D65 precedent). A late collision surviving that check
-- (the same residual, accepted two-device race commit_lot's own
-- 20260913032000 migration already names for the creation path) is caught
-- here and re-raised as the identical named exception
-- (`barcode_already_registered`) for a legible server-side error log — no
-- dedicated merchant-facing UI branches on it, per §3.4c's own text
-- ("surfaces through the shared save-error state"); it resolves as an
-- ordinary failed save, the sheet staying open with the staged value intact
-- (store.tsx's own `setProductBarcode` doc comment).

create or replace function public.update_product_barcode(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid,
  p_new_barcode text
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

  if p_new_barcode is null or btrim(p_new_barcode) = '' then
    raise exception 'barcode_required' using errcode = '22023';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'update_product_barcode')
  on conflict (id) do nothing;

  begin
    update public.products
    set barcode = btrim(p_new_barcode)
    where id = p_product_id and business_id = p_business_id;
  exception
    when unique_violation then
      raise exception 'barcode_already_registered' using errcode = 'P0001';
  end;

  if not found then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.update_product_barcode(uuid, uuid, uuid, text) from public;
grant execute on function public.update_product_barcode(uuid, uuid, uuid, text) to authenticated;
