-- Live production bug, Product Owner-found and confirmed via direct query
-- 2026-09-18: assign_tag_to_next_pending_unit predates the per-product NFC
-- opt-in (D71/D73) and was never updated when that feature was built on top
-- of it. It picks the oldest untagged, available unit across the *entire*
-- business, with no product scoping and no NFC-tagging-eligibility check at
-- all — inventory.md §3.14's "Product-scoped" Asignar Tags queue has only
-- ever been a client-side display filter; this write path silently ignored
-- it. Live evidence: opening the screen for Camisas assigned a tag to a
-- Plumas unit instead (Plumas was simply older in her inventory), even
-- though Plumas has never had nfc_tagging_enabled = true.
--
-- Fix: add an optional p_product_id (null preserves today's whole-Lot,
-- multi-product-eligible behavior, inventory.md §3.14 entry point 1, where
-- a single mixed Lot may legitimately contain several different eligible
-- Products worked through in one queue) and a real server-side
-- eligibility check matching decision-log.md D73's composed test exactly
-- (nfc_per_product_enabled AND the specific unit's own Product.nfc_tagging_enabled
-- — no defaultSellingMode disjunct, D73 dropped it). This makes it
-- structurally impossible for this function to ever tag a non-eligible or
-- wrongly-scoped unit, regardless of what the client sends.
-- Postgres treats a different parameter list as a distinct, overloaded
-- function, not a replacement — `create or replace` alone would leave the
-- old 3-argument, unscoped/unchecked version still callable (and, worse,
-- still the exact-match candidate for any caller that hasn't been updated
-- to pass p_product_id yet). Drop it explicitly so exactly one version of
-- this function exists.
drop function if exists public.assign_tag_to_next_pending_unit(uuid, text, uuid);

create or replace function public.assign_tag_to_next_pending_unit(
  p_business_id uuid,
  p_tag_identifier text,
  p_idempotency_key uuid,
  p_product_id uuid default null
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

  if exists (
    select 1 from public.nfc_tags
    where business_id = p_business_id and tag_identifier = p_tag_identifier
  ) then
    raise exception 'tag_already_assigned' using errcode = 'P0001';
  end if;

  -- FIFO (D5), now correctly scoped: (a) p_product_id, when given, limits
  -- the pick to that one Product only (inventory.md §3.14 entry point 3,
  -- the per-Product toggle-ON auto-open / "[ N sin etiquetar ]" resume
  -- indicator); (b) the eligibility join, unconditional, is the same
  -- composed test decision-log.md D73 already established client-side —
  -- a unit whose own Product isn't nfc_tagging_enabled on an
  -- nfc_per_product_enabled business can never be picked here, full stop,
  -- even for the whole-Lot, unscoped (p_product_id null) case.
  select iu.id, iu.product_id into v_unit_id, v_product_id
  from public.inventory_units iu
  join public.products p on p.id = iu.product_id
  join public.businesses b on b.id = iu.business_id
  where iu.business_id = p_business_id
    and iu.status = 'available'
    and not exists (select 1 from public.nfc_tags nt where nt.unit_id = iu.id)
    and (p_product_id is null or iu.product_id = p_product_id)
    and b.nfc_per_product_enabled = true
    and p.nfc_tagging_enabled = true
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

revoke execute on function public.assign_tag_to_next_pending_unit(uuid, text, uuid, uuid) from public;
grant execute on function public.assign_tag_to_next_pending_unit(uuid, text, uuid, uuid) to authenticated;
