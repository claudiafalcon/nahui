-- =========================================================================
-- VERIFICATION SCRIPT A — run AFTER applying
--   20260921020000_assign_tag_prior_holder_allowlist.sql
--
-- Self-asserting: every check RAISEs on failure. Success prints
-- "D83/I-2 SCRIPT A: ALL ASSERTIONS PASSED". Wrapped in BEGIN/ROLLBACK, so
-- every fixture row it writes is discarded. No DDL, no lock beyond ordinary
-- row locks on its own fixture rows.
--
-- Run as the postgres/service role (it inserts fixtures that no RLS policy
-- allows `authenticated` to write). `auth.uid()` is supplied by setting
-- request.jwt.claims transaction-locally, so the RPC's own authorization
-- path (`is_active_owner_of`) is genuinely exercised rather than bypassed.
-- =========================================================================

begin;

do $verify$
declare
  v_user  constant uuid := 'd83012a0-0000-4000-8000-0000000000aa';
  v_biz   constant uuid := 'd83012a0-0000-4000-8000-0000000000bb';
  v_lot   constant uuid := 'd83012a0-0000-4000-8000-0000000000cc';

  v_p1 constant uuid := 'd83012a0-0000-4000-8000-000000000101';  -- prior holder SOLD
  v_p2 constant uuid := 'd83012a0-0000-4000-8000-000000000102';  -- prior holder REMOVED
  v_p3 constant uuid := 'd83012a0-0000-4000-8000-000000000103';  -- prior holder AVAILABLE
  v_p4 constant uuid := 'd83012a0-0000-4000-8000-000000000104';  -- prior holder RESERVED

  v_u1a constant uuid := 'd83012a0-0000-4000-8000-00000000011a';  -- sold, holds T1
  v_u1b constant uuid := 'd83012a0-0000-4000-8000-00000000011b';  -- free target
  v_u2a constant uuid := 'd83012a0-0000-4000-8000-00000000012a';  -- removed, holds T2
  v_u2b constant uuid := 'd83012a0-0000-4000-8000-00000000012b';  -- free target
  v_u3a constant uuid := 'd83012a0-0000-4000-8000-00000000013a';  -- available, holds T3
  v_u3b constant uuid := 'd83012a0-0000-4000-8000-00000000013b';  -- free target (decoy)
  v_u4a constant uuid := 'd83012a0-0000-4000-8000-00000000014a';  -- reserved, holds T4
  v_u4b constant uuid := 'd83012a0-0000-4000-8000-00000000014b';  -- free target (decoy)

  v_t1 constant text := 'D83I2-T1';
  v_t2 constant text := 'D83I2-T2';
  v_t3 constant text := 'D83I2-T3';
  v_t4 constant text := 'D83I2-T4';

  v_src text;
  v_got uuid;
  v_ok  boolean;
  v_msg text;
  v_n   int;
begin
  -- =====================================================================
  -- A1 — the DEPLOYED function source now carries the allowlist.
  -- Proves: the migration actually replaced the body in this database
  -- rather than no-op'ing (the exact failure mode that editing an
  -- already-applied migration in place would have produced).
  -- =====================================================================
  v_src := pg_get_functiondef(
    'public.assign_tag_to_next_pending_unit(uuid,text,uuid,uuid)'::regprocedure);

  if position('v_prior_unit_status not in (''sold'', ''removed'')' in v_src) = 0 then
    raise exception 'FAIL A1: deployed body does not carry the sold/removed allowlist guard';
  end if;
  if position('v_prior_unit_status in (''available'', ''reserved'')' in v_src) > 0 then
    raise exception 'FAIL A1: deployed body still carries the available/reserved denylist guard';
  end if;
  raise notice 'PASS A1 — deployed body carries the allowlist, not the denylist';

  -- =====================================================================
  -- A1b — the rest of the body survived `create or replace`.
  -- Proves: the patch substituted one predicate and carried everything
  -- else across verbatim. Five load-bearing landmarks spread across the
  -- whole body (idempotency replay, authz, the D83 close write, D76's
  -- product scope, D73's composed eligibility join).
  -- =====================================================================
  if position('idempotent_operation_in_progress' in v_src) = 0
     or position('is_active_owner_of' in v_src) = 0
     or position('set detached_at = now()' in v_src) = 0
     or position('p_product_id is null or iu.product_id = p_product_id' in v_src) = 0
     or position('b.nfc_per_product_enabled = true' in v_src) = 0
     or position('tag_queue_empty' in v_src) = 0 then
    raise exception 'FAIL A1b: deployed body lost part of 20260921000000''s definition';
  end if;
  raise notice 'PASS A1b — full prior body carried across (6/6 landmarks present)';

  -- =====================================================================
  -- A1c — the EXECUTE grant survived.
  -- Proves: `create or replace` preserved the ACL; the function is still
  -- callable by a real merchant session and still not callable by PUBLIC.
  -- =====================================================================
  if not has_function_privilege('authenticated',
       'public.assign_tag_to_next_pending_unit(uuid,text,uuid,uuid)', 'EXECUTE') then
    raise exception 'FAIL A1c: authenticated lost EXECUTE';
  end if;
  if has_function_privilege('public',
       'public.assign_tag_to_next_pending_unit(uuid,text,uuid,uuid)', 'EXECUTE') then
    raise exception 'FAIL A1c: PUBLIC regained EXECUTE';
  end if;
  raise notice 'PASS A1c — EXECUTE granted to authenticated, revoked from PUBLIC';

  -- =====================================================================
  -- FIXTURES (all discarded by the ROLLBACK at the end)
  -- =====================================================================
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  ) values (
    '00000000-0000-0000-0000-000000000000', v_user, 'authenticated', 'authenticated',
    'd83-i2-verify@nahui.invalid', '', now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb
  );

  insert into public.businesses (id, name, nfc_per_product_enabled)
  values (v_biz, 'D83/I-2 verification', true);

  insert into public.business_memberships (user_id, business_id, role, status)
  values (v_user, v_biz, 'OWNER', 'active');

  insert into public.products (id, business_id, name, default_price, nfc_tagging_enabled)
  values (v_p1, v_biz, 'P1 sold-holder',      100, true),
         (v_p2, v_biz, 'P2 removed-holder',   100, true),
         (v_p3, v_biz, 'P3 available-holder', 100, true),
         (v_p4, v_biz, 'P4 reserved-holder',  100, true);

  insert into public.lots (id, business_id, received_at)
  values (v_lot, v_biz, now());

  -- Each scenario gets its own Product AND its own single free unit, so the
  -- FIFO pick is deterministic under the p_product_id scope (D76).
  --
  -- The two CONFLICT scenarios deliberately get a free unit too. Without
  -- one, a guard that wrongly PERMITTED the close would fall through to
  -- FIFO and raise `tag_queue_empty` — an error, which a careless reading
  -- could mistake for the conflict firing. With one, a wrongly-permitted
  -- close SUCCEEDS, which is unmistakable.
  insert into public.inventory_units (id, business_id, product_id, lot_id, status, received_at)
  values (v_u1a, v_biz, v_p1, v_lot, 'sold',      now() - interval '2 day'),
         (v_u1b, v_biz, v_p1, v_lot, 'available', now() - interval '1 day'),
         (v_u2a, v_biz, v_p2, v_lot, 'removed',   now() - interval '2 day'),
         (v_u2b, v_biz, v_p2, v_lot, 'available', now() - interval '1 day'),
         (v_u3a, v_biz, v_p3, v_lot, 'available', now() - interval '2 day'),
         (v_u3b, v_biz, v_p3, v_lot, 'available', now() - interval '1 day'),
         (v_u4a, v_biz, v_p4, v_lot, 'reserved',  now() - interval '2 day'),
         (v_u4b, v_biz, v_p4, v_lot, 'available', now() - interval '1 day');

  insert into public.nfc_tags (business_id, unit_id, tag_identifier)
  values (v_biz, v_u1a, v_t1),
         (v_biz, v_u2a, v_t2),
         (v_biz, v_u3a, v_t3),
         (v_biz, v_u4a, v_t4);

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_user::text, 'role', 'authenticated')::text, true);

  if auth.uid() is distinct from v_user then
    raise exception 'FAIL setup: auth.uid() did not resolve to the fixture user (got %)', auth.uid();
  end if;

  -- =====================================================================
  -- A2 — REUSE PATH, prior holder `sold`.
  -- Proves: inverting the guard did not invert the OUTCOME. The single
  -- case D83 exists to make possible — a returned tag re-attached to a new
  -- garment — still closes the prior window and opens a new one in one
  -- transaction.
  -- =====================================================================
  select t.unit_id into v_got
  from public.assign_tag_to_next_pending_unit(v_biz, v_t1, gen_random_uuid(), v_p1) t;

  if v_got is distinct from v_u1b then
    raise exception 'FAIL A2: expected the free unit %, got %', v_u1b, v_got;
  end if;
  if not exists (select 1 from public.nfc_tags
                 where unit_id = v_u1a and tag_identifier = v_t1 and detached_at is not null) then
    raise exception 'FAIL A2: prior attachment on the sold unit was not closed';
  end if;
  if not exists (select 1 from public.nfc_tags
                 where unit_id = v_u1b and tag_identifier = v_t1 and detached_at is null) then
    raise exception 'FAIL A2: no new open attachment on the target unit';
  end if;
  select count(*) into v_n from public.nfc_tags
  where business_id = v_biz and tag_identifier = v_t1 and detached_at is null;
  if v_n <> 1 then
    raise exception 'FAIL A2: expected exactly 1 open attachment for %, found %', v_t1, v_n;
  end if;
  raise notice 'PASS A2 — sold prior holder: close-then-open succeeded, exactly one open window';

  -- =====================================================================
  -- A2b — REUSE PATH, prior holder `removed`.
  -- Proves: the SECOND allowlisted value is genuinely in the allowlist.
  -- A typo that wrote only ('sold') would pass A2 and fail here.
  -- =====================================================================
  select t.unit_id into v_got
  from public.assign_tag_to_next_pending_unit(v_biz, v_t2, gen_random_uuid(), v_p2) t;

  if v_got is distinct from v_u2b then
    raise exception 'FAIL A2b: expected the free unit %, got %', v_u2b, v_got;
  end if;
  if not exists (select 1 from public.nfc_tags
                 where unit_id = v_u2a and tag_identifier = v_t2 and detached_at is not null) then
    raise exception 'FAIL A2b: prior attachment on the removed unit was not closed';
  end if;
  raise notice 'PASS A2b — removed prior holder: close-then-open succeeded';

  -- =====================================================================
  -- A3 — CONFLICT PATH, prior holder `available`.
  -- Proves: the denylist -> allowlist change opened no hole for a tag that
  -- is genuinely still on a garment she has on hand. `inventory.md` §3.15's
  -- "ya está en uso" copy depends on this exact error string.
  -- =====================================================================
  v_ok := false; v_msg := 'the call returned successfully — the guard did NOT fire';
  begin
    perform * from public.assign_tag_to_next_pending_unit(v_biz, v_t3, gen_random_uuid(), v_p3);
  exception when sqlstate 'P0001' then
    v_msg := sqlerrm;
    v_ok := (sqlerrm = 'tag_already_assigned');
  end;
  if not v_ok then
    raise exception 'FAIL A3 (available prior holder): %', v_msg;
  end if;
  if exists (select 1 from public.nfc_tags
             where unit_id = v_u3a and tag_identifier = v_t3 and detached_at is not null) then
    raise exception 'FAIL A3: the live attachment was closed anyway';
  end if;
  raise notice 'PASS A3 — available prior holder: tag_already_assigned, live window untouched';

  -- =====================================================================
  -- A3b — CONFLICT PATH, prior holder `reserved`.
  -- Proves: the other live status is still a conflict. A `reserved` unit is
  -- committed to an EventAllocation (D59) — on hand, tag physically on it.
  -- =====================================================================
  v_ok := false; v_msg := 'the call returned successfully — the guard did NOT fire';
  begin
    perform * from public.assign_tag_to_next_pending_unit(v_biz, v_t4, gen_random_uuid(), v_p4);
  exception when sqlstate 'P0001' then
    v_msg := sqlerrm;
    v_ok := (sqlerrm = 'tag_already_assigned');
  end;
  if not v_ok then
    raise exception 'FAIL A3b (reserved prior holder): %', v_msg;
  end if;
  raise notice 'PASS A3b — reserved prior holder: tag_already_assigned';

  -- =====================================================================
  -- A4 — the PARTIAL UNIQUE INDEXES still refuse a second OPEN attachment.
  -- Proves: the invariant is enforced by the schema, not merely by the
  -- function's guard — so no other write path (present or future) can
  -- produce two live claims on one physical tag, or two live tags on one
  -- garment. This is the check that would catch a partial index having been
  -- dropped or mis-predicated.
  -- =====================================================================
  v_ok := false;
  begin
    insert into public.nfc_tags (business_id, unit_id, tag_identifier)
    values (v_biz, v_u3b, v_t3);                        -- T3 is already open on u3a
  exception when unique_violation then
    v_ok := true; v_msg := sqlerrm;
  end;
  if not v_ok then
    raise exception 'FAIL A4a: a second OPEN attachment for (business, %) was accepted', v_t3;
  end if;
  raise notice 'PASS A4a — second open attachment per (business_id, tag_identifier) refused';

  v_ok := false;
  begin
    insert into public.nfc_tags (business_id, unit_id, tag_identifier)
    values (v_biz, v_u3a, 'D83I2-T3-SECOND');           -- u3a already has an open row
  exception when unique_violation then
    v_ok := true; v_msg := sqlerrm;
  end;
  if not v_ok then
    raise exception 'FAIL A4b: a second OPEN attachment for one unit was accepted';
  end if;
  raise notice 'PASS A4b — second open attachment per unit_id refused';

  -- Positive control: the indexes are genuinely PARTIAL. A closed row must
  -- collide with nothing — if this fails, the old global uniqueness is back
  -- and D83's whole reuse story is unreachable.
  insert into public.nfc_tags (business_id, unit_id, tag_identifier, detached_at)
  values (v_biz, v_u1a, v_t3, now());                   -- closed row, duplicate identifier AND unit
  raise notice 'PASS A4c — a CLOSED attachment collides with nothing (indexes are partial)';

  -- =====================================================================
  -- A5 — the two scan RPCs still carry the `detached_at is null` qualifier.
  -- Not this migration's change; asserted because A2/A2b just created the
  -- first reused identifiers, and these two use `select ... into` with no
  -- LIMIT. Without the qualifier they would throw "more than one row
  -- returned" the first time a tag is reused. Left untouched deliberately;
  -- this pins it.
  -- =====================================================================
  if position('nt.detached_at is null' in pg_get_functiondef(
       'public.scan_unit_into_event_allocation(uuid,uuid,uuid,text,uuid)'::regprocedure)) = 0
     or position('nt.detached_at is null' in pg_get_functiondef(
       'public.scan_unit_into_event_allocation_any_product(uuid,uuid,text,uuid)'::regprocedure)) = 0 then
    raise exception 'FAIL A5: a scan RPC lost its open-attachment qualifier';
  end if;
  raise notice 'PASS A5 — both scan RPCs still qualified (single-row guarantee intact)';

  raise notice '===== D83/I-2 SCRIPT A: ALL ASSERTIONS PASSED =====';
end;
$verify$;

rollback;
