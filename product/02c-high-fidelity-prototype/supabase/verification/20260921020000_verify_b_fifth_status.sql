-- =========================================================================
-- VERIFICATION SCRIPT B — the regression proof for I-2 itself.
--
-- Scripts A's assertions all pass against BOTH the old denylist and the new
-- allowlist, because today the two denote the identical set. This script is
-- the one that can tell them apart: it simulates the future D80 warns about
-- — a FIFTH `inventory_units.status` value added without a tag-release path
-- — and shows the guard now DENIES where the denylist would have PERMITTED.
--
-- Run it AFTER Script A, and only if you want that proof; it is not needed
-- to establish that today's behaviour is unchanged.
--
-- CAVEAT, read before running. Unlike Script A, this does DDL: it widens
-- `inventory_units_status_check` to admit a throwaway fifth value. That is
-- transactional and fully undone by the ROLLBACK, but it takes an ACCESS
-- EXCLUSIVE lock on `inventory_units` for the life of the transaction, so
-- concurrent reads/writes of that table block until it ends. The constraint
-- is added NOT VALID so no full table scan happens. At pilot scale this is
-- a sub-second transaction; do not run it during a live bazaar session.
-- =========================================================================

begin;

do $verify_b$
declare
  v_user constant uuid := 'd83012b0-0000-4000-8000-0000000000aa';
  v_biz  constant uuid := 'd83012b0-0000-4000-8000-0000000000bb';
  v_lot  constant uuid := 'd83012b0-0000-4000-8000-0000000000cc';
  v_prod constant uuid := 'd83012b0-0000-4000-8000-000000000101';
  v_hold constant uuid := 'd83012b0-0000-4000-8000-00000000011a';  -- prior holder
  v_free constant uuid := 'd83012b0-0000-4000-8000-00000000011b';  -- free target
  v_tag  constant text := 'D83I2-FIFTH';

  v_ok  boolean;
  v_msg text;
begin
  -- The simulated fifth status. `quarantined` is invented for this test
  -- only; nothing in the product proposes it. What matters is only that it
  -- is neither `available`/`reserved` nor `sold`/`removed` — i.e. a status
  -- whose tag-release semantics nobody has decided yet, which is precisely
  -- the case D80's allowlist rule exists to make fail safe.
  alter table public.inventory_units
    drop constraint if exists inventory_units_status_check;
  alter table public.inventory_units
    add constraint inventory_units_status_check
    check (status in ('available', 'reserved', 'sold', 'removed', 'quarantined'))
    not valid;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  ) values (
    '00000000-0000-0000-0000-000000000000', v_user, 'authenticated', 'authenticated',
    'd83-i2-fifth@nahui.invalid', '', now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb
  );

  insert into public.businesses (id, name, nfc_per_product_enabled)
  values (v_biz, 'D83/I-2 fifth-status proof', true);

  insert into public.business_memberships (user_id, business_id, role, status)
  values (v_user, v_biz, 'OWNER', 'active');

  insert into public.products (id, business_id, name, default_price, nfc_tagging_enabled)
  values (v_prod, v_biz, 'Fifth-status holder', 100, true);

  insert into public.lots (id, business_id, received_at) values (v_lot, v_biz, now());

  insert into public.inventory_units (id, business_id, product_id, lot_id, status, received_at)
  values (v_hold, v_biz, v_prod, v_lot, 'quarantined', now() - interval '2 day'),
         (v_free, v_biz, v_prod, v_lot, 'available',   now() - interval '1 day');

  insert into public.nfc_tags (business_id, unit_id, tag_identifier)
  values (v_biz, v_hold, v_tag);

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_user::text, 'role', 'authenticated')::text, true);

  -- =====================================================================
  -- B1 — a fifth status is DENIED, not silently permitted.
  --
  -- Under the shipped denylist (`in ('available','reserved')` -> raise),
  -- `quarantined` falls through, the live attachment is closed, and the
  -- call SUCCEEDS returning the free unit — while D83's own text, and the
  -- `nfc_tags.detached_at` comment, both still say closing is permitted
  -- "only when the prior open attachment's unit is sold or removed."
  --
  -- Under the allowlist it raises `tag_already_assigned`: the safe default
  -- for a status whose tag-release semantics nobody has decided yet. The
  -- merchant sees §3.15's existing "ya está en uso" — an honest refusal,
  -- not a silent loss of the physical-tag invariant.
  --
  -- A free unit is deliberately present, so a wrongly-permitted close
  -- SUCCEEDS loudly rather than producing an ambiguous `tag_queue_empty`.
  -- =====================================================================
  v_ok := false;
  v_msg := 'the call SUCCEEDED — the denylist is still deployed; a fifth status silently closed a live attachment';
  begin
    perform * from public.assign_tag_to_next_pending_unit(v_biz, v_tag, gen_random_uuid(), v_prod);
  exception when sqlstate 'P0001' then
    v_msg := sqlerrm;
    v_ok := (sqlerrm = 'tag_already_assigned');
  end;

  if not v_ok then
    raise exception 'FAIL B1 (fifth status `quarantined`): %', v_msg;
  end if;

  if exists (select 1 from public.nfc_tags
             where unit_id = v_hold and tag_identifier = v_tag and detached_at is not null) then
    raise exception 'FAIL B1: the live attachment on the quarantined unit was closed anyway';
  end if;

  raise notice 'PASS B1 — an unrecognised fifth status is refused (tag_already_assigned), live window intact';
  raise notice '===== D83/I-2 SCRIPT B: ALL ASSERTIONS PASSED =====';
end;
$verify_b$;

rollback;

-- Confirm the CHECK constraint came back with the real four-value set.
-- Run this AFTER the rollback above, as a separate statement.
select pg_get_constraintdef(oid) as inventory_units_status_check
from pg_constraint
where conrelid = 'public.inventory_units'::regclass
  and conname = 'inventory_units_status_check';
