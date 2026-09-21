-- decision-log.md D83, product/99-rfc/0018-nfc-tag-attachment-lifecycle.md.
--
-- `NFCTag` stops being a 1:1 attribute of `InventoryUnit` and becomes an
-- attachment record carrying an explicit validity window. It gains
-- `detached_at`, the closing bookend to the `assigned_at` D59 already
-- established. The uniqueness invariant is restated on the right object:
-- at most one OPEN attachment per (business_id, tag_identifier), and at most
-- one OPEN attachment per unit_id. Closed attachments are history and
-- collide with nothing.
--
-- WHY. The nfc_tags row was doing two structurally different jobs at once:
-- (1) the active physical attachment, read by sale-time scan resolution,
-- allocation scan, tagged-unit counts (D80/D81), the untagged-pool selector
-- (D82) and Asignar Tags eligibility; and (2) the historical attachment
-- record, read by exactly one thing -- D10's claim-side resolution. Job 2 is
-- why the row must survive finalize_sale; job 1 is why the identifier must
-- become free again. Because one row carried both and uniqueness was stated
-- as "one row per identifier," job 2 permanently foreclosed job 1 -- a
-- merchant re-attaching her own returned tag hit "ya está en uso" forever.
--
-- THIS IS NOT A LOOSENED CHECK. "One row per identifier" was never the
-- business rule. The rule is "a physical tag can be on at most one garment
-- at a time"; the old schema conflated the two only because it had no way to
-- express "was on." The sold-holder case below does not bypass the invariant
-- -- it SATISFIES it, by closing the prior window before opening a new one.
-- There is no exception branch anywhere.
--
-- NO AUTOMATIC DETACHMENT AT finalize_sale, deliberately. The moment a
-- customer physically peels a tag off is unobservable to Nahui, and whether
-- she ever returns it is unknowable; stamping a detached_at at sale time
-- would assert a physical fact the system cannot verify -- the posture D59
-- was corrected to avoid. The window on a sold unit stays OPEN until
-- superseded. "Open" means "not superseded," never "in the merchant's
-- possession" -- possession is inventory_units.status, and keeping the two
-- facts separate is exactly what lets D10's claim path and Inventory's
-- counting paths read the same row and correctly disagree about it.
--
-- PURELY ADDITIVE AT THE DATA LEVEL. Every existing row backfills to
-- detached_at = null (all currently open), which is correct under the new
-- model. No destructive statement, no manual Dashboard cleanup, nothing like
-- D74's or D76's data corrections.

alter table public.nfc_tags
  add column if not exists detached_at timestamptz null;

comment on column public.nfc_tags.detached_at is
  'D83/RFC 0018 — attachment-window end. NULL = open (this tag is on this '
  'unit now). Non-NULL = closed/superseded history, which collides with '
  'nothing and is never read by scan resolution. Set by exactly two events: '
  're-attachment of the same identifier to a new unit (permitted only when '
  'the prior open attachment''s unit is sold or removed), and available -> '
  'removed (D77/D78). Never set by finalize_sale — see this migration''s '
  'own header for why that is load-bearing rather than an omission.';

comment on table public.nfc_tags is
  'Inventory context, NFCTag. D83/RFC 0018 — an attachment record with an '
  'explicit validity window (assigned_at -> detached_at), no longer "a 1:1 '
  'attribute of InventoryUnit." At most one OPEN attachment per unit and per '
  '(business_id, tag_identifier), enforced by the partial unique indexes '
  'below; closed rows are history. Still not an aggregate root: no tag-stock '
  'modeling, no independent state machine, ownership unchanged. Only ever '
  'written inside a SECURITY DEFINER transaction — no direct client '
  'INSERT/UPDATE/DELETE grant.';

-- unit_id's blanket UNIQUE ("one tag per unit, ever") becomes
-- one-OPEN-attachment-per-unit. A unit may now legitimately carry closed
-- history plus at most one open row.
alter table public.nfc_tags
  drop constraint if exists nfc_tags_unit_id_key;

create unique index if not exists nfc_tags_unit_open_unique_idx
  on public.nfc_tags (unit_id)
  where detached_at is null;

-- The identifier claim becomes a claim on the OPEN interval only. This is the
-- single line that makes legitimate reuse expressible.
drop index if exists public.nfc_tags_identifier_unique_idx;

create unique index if not exists nfc_tags_identifier_open_unique_idx
  on public.nfc_tags (business_id, tag_identifier)
  where detached_at is null;

-- Closed-history lookups (D59's "was this physically verified" question)
-- never go through the partial indexes above.
create index if not exists nfc_tags_unit_id_idx
  on public.nfc_tags (unit_id);

-- ---------------------------------------------------------------------------
-- Exhaustive caller sweep.
--
-- Every live function that reads nfc_tags must now read only OPEN
-- attachments. This matters for correctness AND for join cardinality: every
-- `join public.nfc_tags nt on nt.unit_id = iu.id` assumed one row per unit,
-- which stops being true the moment a unit carries closed history.
--
-- Done as one pass rather than discovered over three rounds
-- (company/CLAUDE.md's own sanctioned move for ending a defect class).
-- Patched via pg_get_functiondef + replace so the long bodies are not
-- hand-copied, with a hard guard that RAISES if any expected substitution
-- does not match -- so a silently-missed call site fails this migration
-- rather than shipping.
-- ---------------------------------------------------------------------------
do $sweep$
declare
  r record;
  v_src text;
  v_new text;
  v_hits int;
  v_total int := 0;
  -- (function signature, search, replace, expected minimum substitutions)
  v_targets text[][] := array[
    -- tag -> unit resolution: resolve to THE ONE OPEN attachment.
    ['public.add_item_to_sale_by_tag(uuid,text,uuid)',
     'join public.nfc_tags nt on nt.unit_id = iu.id',
     'join public.nfc_tags nt on nt.unit_id = iu.id and nt.detached_at is null'],
    ['public.scan_unit_into_event_allocation(uuid,uuid,uuid,text,uuid)',
     'where nt.business_id = p_business_id and nt.tag_identifier = p_tag_identifier',
     'where nt.business_id = p_business_id and nt.tag_identifier = p_tag_identifier and nt.detached_at is null'],
    ['public.scan_unit_into_event_allocation_any_product(uuid,uuid,text,uuid)',
     'where nt.business_id = p_business_id and nt.tag_identifier = p_tag_identifier',
     'where nt.business_id = p_business_id and nt.tag_identifier = p_tag_identifier and nt.detached_at is null'],
    -- untagged candidate pool: a unit whose only attachment is CLOSED is
    -- genuinely untagged and genuinely manually-committable. Without this,
    -- _fifo_commit_to_allocation would silently exclude it and under-commit
    -- -- and D82's ceiling (which mirrors this predicate client-side) would
    -- disagree with the server again, the exact class D82 exists to close.
    ['public._fifo_commit_to_allocation(uuid,uuid,uuid,text,integer,uuid[],text,uuid)',
     'and not exists (select 1 from public.nfc_tags nt where nt.unit_id = iu.id)',
     'and not exists (select 1 from public.nfc_tags nt where nt.unit_id = iu.id and nt.detached_at is null)']
  ];
  i int;
begin
  for i in 1 .. array_length(v_targets, 1) loop
    begin
      v_src := pg_get_functiondef(v_targets[i][1]::regprocedure);
    exception when undefined_function then
      raise exception 'D83 sweep: function % not found — signature drifted, fix this migration rather than skipping it', v_targets[i][1];
    end;

    v_new := replace(v_src, v_targets[i][2], v_targets[i][3]);

    if v_new = v_src then
      raise exception 'D83 sweep: no substitution in % — expected pattern % not present. A missed call site must fail loudly, never ship silently.',
        v_targets[i][1], v_targets[i][2];
    end if;

    -- Idempotency: if the qualifier is already there, replace() above would
    -- have produced a double qualifier. Guard against re-running.
    if position('and nt.detached_at is null and nt.detached_at is null' in v_new) > 0 then
      raise exception 'D83 sweep: % already qualified — this migration is not re-runnable in place', v_targets[i][1];
    end if;

    execute v_new;
    v_total := v_total + 1;
  end loop;

  raise notice 'D83 sweep: % function(s) re-created with the open-attachment qualifier', v_total;
end;
$sweep$;

-- ---------------------------------------------------------------------------
-- assign_tag_to_next_pending_unit — rewritten in full, not swept.
--
-- This is the one function whose LOGIC changes rather than just its
-- predicates: it gains the close-then-open transition that makes reuse work.
-- ---------------------------------------------------------------------------
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
  v_prior_tag_id uuid;
  v_prior_unit_status text;
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

  -- D83/RFC 0018 — the conflict check narrows to the ONE OPEN attachment,
  -- and its outcome now depends on whether the prior holder is still on hand.
  --
  -- Prior holder available/reserved -> still a hard conflict (two garments
  --   claiming one physical tag). inventory.md §3.15, copy unchanged.
  -- Prior holder sold/removed -> the tag legitimately came back. Close the
  --   prior window and open a new one, in this same transaction. She is told
  --   nothing and asked nothing: to re-attach a tag she must be HOLDING it,
  --   and holding it is the proof it came back. A tag still on a customer's
  --   garment cannot be scanned by the merchant, so there is no
  --   false-positive case -- the same exclusive-physical-possession property
  --   D74 relied on when choosing the factory UID over written content.
  select nt.id, iu.status
    into v_prior_tag_id, v_prior_unit_status
  from public.nfc_tags nt
  join public.inventory_units iu on iu.id = nt.unit_id
  where nt.business_id = p_business_id
    and nt.tag_identifier = p_tag_identifier
    and nt.detached_at is null
  for update of nt;

  if v_prior_tag_id is not null then
    if v_prior_unit_status in ('available', 'reserved') then
      raise exception 'tag_already_assigned' using errcode = 'P0001';
    end if;

    update public.nfc_tags
    set detached_at = now()
    where id = v_prior_tag_id;
  end if;

  -- FIFO (D5), scoped per D76: (a) p_product_id, when given, limits the pick
  -- to that one Product; (b) the eligibility join is the composed test D73
  -- established. The untagged predicate now reads OPEN attachments only, so a
  -- unit whose only attachment is closed history is correctly eligible again.
  select iu.id, iu.product_id into v_unit_id, v_product_id
  from public.inventory_units iu
  join public.products p on p.id = iu.product_id
  join public.businesses b on b.id = iu.business_id
  where iu.business_id = p_business_id
    and iu.status = 'available'
    and not exists (
      select 1 from public.nfc_tags nt
      where nt.unit_id = iu.id and nt.detached_at is null
    )
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

-- ---------------------------------------------------------------------------
-- D77/D78's tag release becomes detachment, not deletion (RFC 0018's
-- "Recommended"). Otherwise the model carries two different meanings of "tag
-- released" -- one preserving the window, one destroying it -- and a removed
-- unit loses the attachment history D59's invariant relies on.
-- Already-deleted rows are gone and need no backfill.
-- ---------------------------------------------------------------------------
do $detach$
declare
  v_src text;
  v_new text;
begin
  v_src := pg_get_functiondef('public.correct_product_available_count(uuid,uuid,integer,uuid)'::regprocedure);
  v_new := replace(
    v_src,
    'delete from public.nfc_tags',
    'update public.nfc_tags set detached_at = now()'
  );
  v_new := replace(
    v_new,
    'where unit_id in (select id from candidates)',
    'where unit_id in (select id from candidates) and detached_at is null'
  );
  if v_new = v_src then
    raise exception 'D83: correct_product_available_count tag-release pattern not found — fix rather than skip';
  end if;
  execute v_new;
end;
$detach$;
