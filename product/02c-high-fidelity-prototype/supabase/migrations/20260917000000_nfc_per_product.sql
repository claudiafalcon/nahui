-- Stage 7 Backend Integration — decision-log.md D71, product-decisions.md
-- Q31: NFC becomes a per-product opt-in composing with buttons/barcode.
-- Two new additive fields (architect-ruled, no RFC): Business.nfcPerProductEnabled
-- (master toggle, settings.md §2.8) and Product.nfcTaggingEnabled (per-product
-- opt-in, inventory.md §3.4's new fifth tap zone). Both gate Inventory's
-- Asignar Tags eligibility only — never unit-level sellability, which stays a
-- pure InventoryUnit.tag_id read.

alter table public.businesses
  add column if not exists nfc_per_product_enabled boolean not null default false;

alter table public.products
  add column if not exists nfc_tagging_enabled boolean not null default false;

-- change_nfc_per_product_enabled — same shape as change_default_selling_mode
-- immediately above it in 20260914000000_business_settings_writes.sql:
-- OWNER-only, idempotency-keyed, single-column UPDATE. Turning it off never
-- touches Product.nfc_tagging_enabled or any InventoryUnit.tag_id — settings.md
-- §2.8's own explicit "never untag/orphan" invariant, enforced simply by this
-- function never writing to either of those tables at all.
create or replace function public.change_nfc_per_product_enabled(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_enabled boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_tier text;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select subscription_tier into v_tier from public.businesses where id = p_business_id;
  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;

  if p_enabled and v_tier <> 'paid' then
    raise exception 'nfc_not_available' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'change_nfc_per_product_enabled')
  on conflict (id) do nothing;

  update public.businesses
  set nfc_per_product_enabled = p_enabled
  where id = p_business_id;
end;
$$;

revoke execute on function public.change_nfc_per_product_enabled(uuid, uuid, boolean) from public;
grant execute on function public.change_nfc_per_product_enabled(uuid, uuid, boolean) to authenticated;

-- set_product_nfc_tagging_enabled — inventory.md §3.4's new fifth tap zone.
-- Same OWNER-only/idempotency-keyed shape as update_product_barcode
-- (20260916000000_inventory_barcode_correction_write.sql). Enforces D71's
-- "never both" mutual-exclusivity rule defensively, server-side, not just via
-- the client's own gating: rejects enabling on a Product that already has a
-- barcode. Turning it off never touches any InventoryUnit — same
-- never-untag/orphan invariant as the Business-level toggle.
create or replace function public.set_product_nfc_tagging_enabled(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid,
  p_enabled boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_per_product_enabled boolean;
  v_barcode text;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select nfc_per_product_enabled into v_per_product_enabled
  from public.businesses where id = p_business_id;
  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;

  if p_enabled and not v_per_product_enabled then
    raise exception 'nfc_per_product_not_enabled' using errcode = '42501';
  end if;

  select barcode into v_barcode
  from public.products where id = p_product_id and business_id = p_business_id;
  if not found then
    raise exception 'product_not_found' using errcode = 'P0002';
  end if;

  if p_enabled and v_barcode is not null then
    raise exception 'product_has_barcode' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'set_product_nfc_tagging_enabled')
  on conflict (id) do nothing;

  update public.products
  set nfc_tagging_enabled = p_enabled
  where id = p_product_id and business_id = p_business_id;
end;
$$;

revoke execute on function public.set_product_nfc_tagging_enabled(uuid, uuid, uuid, boolean) from public;
grant execute on function public.set_product_nfc_tagging_enabled(uuid, uuid, uuid, boolean) to authenticated;

-- inventory.md §3.4c's own new bullet (D71): saving a fresh barcode also
-- clears a conflicting nfc_tagging_enabled, in the same write, enforcing the
-- "never both" rule from the other direction. update_product_barcode itself
-- (20260916000000_inventory_barcode_correction_write.sql) is corrected here
-- via create or replace, same function signature, only the body changes.
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
    set barcode = btrim(p_new_barcode),
        nfc_tagging_enabled = false
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
