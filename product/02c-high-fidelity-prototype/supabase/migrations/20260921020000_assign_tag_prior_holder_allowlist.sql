-- decision-log.md D83 (close-then-open), stated on D80's allowlist discipline.
-- Closes `reviewer` finding I-2, Foundation-consistency pass, 2026-09-21.
--
-- WHAT CHANGES. One predicate inside
-- `assign_tag_to_next_pending_unit`, and nothing else:
--
--   before:  if v_prior_unit_status in ('available', 'reserved') then
--   after:   if v_prior_unit_status not in ('sold', 'removed') then
--
-- Behaviourally identical today. `inventory_units.status` carries a CHECK
-- constraint over a closed four-value set, so "not available/reserved" and
-- "sold or removed" denote the identical set right now, and every existing
-- caller, error string and UI state is untouched.
--
-- WHY IT IS WORTH A MIGRATION ANYWAY. D83's own wording is that closing a
-- prior attachment is permitted "**only** when the prior open attachment's
-- unit is `sold` or `removed`." The shipped code expressed that as a
-- denylist -- it permitted the close whenever the status was *not*
-- `available`/`reserved`. D80's entry rules against exactly this form, in
-- its own words: "the scope is stated as an allowlist so that a future
-- status added without a tag-release path cannot silently enter the count,"
-- and D81/D82/D83 all inherit that reasoning.
--
-- This is the one write in the entire schema that can CREATE a closed
-- attachment, which makes it the single place D83's composition invariant --
-- *a closed `NFCTag` attachment never belongs to a unit whose status is in
-- the sale-time allowlist* -- is established rather than merely relied on. A
-- fifth `inventory_units.status` value added later would, under the
-- denylist, silently gain permission to close a LIVE attachment here, while
-- every reader of D83 would believe the rule reads `sold`/`removed` only,
-- because that is what D83 says. D77 already added a status to this enum
-- once (`removed`), so the fifth status is not a hypothetical.
--
-- WHY A NEW MIGRATION RATHER THAN AN EDIT TO `20260921000000`. That
-- migration is already applied to the hosted project. Editing an applied
-- migration and re-pushing is a silent no-op: the CLI skips it by version,
-- the deployed function keeps the denylist, and the repository then claims a
-- correction that production does not have. Follow-up migration, same
-- discipline as `20260913061000` (`CREATE OR REPLACE` redefinitions of
-- already-shipped functions get their own file).
--
-- WHY PATCHED IN PLACE RATHER THAN HAND-COPIED. `create or replace`
-- replaces the *entire* body, so a hand-copied version silently reverts any
-- part of the deployed body this file transcribes imperfectly. The body is
-- ~100 lines (idempotency replay, authorization, the D83 close-then-open
-- transition, D76's product-scoped FIFO, D73's composed eligibility join).
-- So this reuses `20260921000000`'s own sweep technique: read the DEPLOYED
-- definition with `pg_get_functiondef`, substitute exactly one predicate,
-- and RAISE if the substitution does not match exactly once. A drifted body
-- or a missed substitution fails this migration loudly instead of shipping a
-- quietly-reverted function.
--
-- NO DATA IS TOUCHED. No DDL on any table, no row written or deleted.

do $allowlist$
declare
  v_sig     constant text := 'public.assign_tag_to_next_pending_unit(uuid,text,uuid,uuid)';
  v_search  constant text := 'v_prior_unit_status in (''available'', ''reserved'')';
  v_replace constant text := 'v_prior_unit_status not in (''sold'', ''removed'')';
  v_src text;
  v_new text;
  v_hits int;
begin
  begin
    v_src := pg_get_functiondef(v_sig::regprocedure);
  exception when undefined_function then
    raise exception
      'D83/I-2: % not found — signature drifted. Fix this migration rather than skipping it.', v_sig;
  end;

  -- Already corrected? Fail loudly and diagnosably rather than falling
  -- through into the generic "pattern not present" message below.
  if position(v_replace in v_src) > 0 then
    raise exception
      'D83/I-2: % already carries the allowlist guard — this migration is not re-runnable in place.', v_sig;
  end if;

  -- Exactly one occurrence. Zero means the deployed body is not what this
  -- migration was written against; more than one means the predicate is
  -- load-bearing somewhere this correction has not reasoned about.
  v_hits := (length(v_src) - length(replace(v_src, v_search, ''))) / length(v_search);

  if v_hits <> 1 then
    raise exception
      'D83/I-2: expected exactly 1 occurrence of the prior-holder guard in %, found %. A drifted body must fail loudly, never ship silently.',
      v_sig, v_hits;
  end if;

  v_new := replace(v_src, v_search, v_replace);
  execute v_new;

  raise notice
    'D83/I-2: prior-holder guard in % inverted to the sold/removed allowlist (1 substitution; rest of the deployed body carried across verbatim)', v_sig;
end;
$allowlist$;

-- `create or replace` preserves the existing ACL, so these are re-stated for
-- explicitness rather than because anything was dropped. Re-issuing them is
-- idempotent, and it keeps the grant posture readable in the one file that
-- last rewrote this function.
revoke execute on function public.assign_tag_to_next_pending_unit(uuid, text, uuid, uuid) from public;
grant execute on function public.assign_tag_to_next_pending_unit(uuid, text, uuid, uuid) to authenticated;

-- The column comment is D83's own prose statement of this rule and already
-- reads as an allowlist ("permitted only when the prior open attachment's
-- unit is sold or removed"). Restated verbatim here so the comment and the
-- predicate are now written down in the same place, in the same form, by the
-- same migration -- the divergence between the two is what I-2 found.
comment on column public.nfc_tags.detached_at is
  'D83/RFC 0018 — attachment-window end. NULL = open (this tag is on this '
  'unit now). Non-NULL = closed/superseded history, which collides with '
  'nothing and is never read by scan resolution. Set by exactly two events: '
  're-attachment of the same identifier to a new unit (permitted only when '
  'the prior open attachment''s unit is sold or removed — stated and now '
  'also ENFORCED as an allowlist over inventory_units.status, per D80''s '
  'own rule, so a future fifth status cannot silently gain permission to '
  'close a live attachment), and available -> removed (D77/D78). Never set '
  'by finalize_sale — see 20260921000000''s own header for why that is '
  'load-bearing rather than an omission.';
