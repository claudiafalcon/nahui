# Supabase — real WhatsApp OTP delivery + Identity/Inventory persistence layers

Stage 7 Backend Integration. Three passes so far:
- **Phone/OTP authentication** (see `company/business-decisions.md` Q14/Q15,
  `product/00-foundation/decision-log.md` D44) — replaces the client-side
  "any 6-digit code works" mock previously in `src/domain/store.tsx`'s
  `verifyOtp`.
- **Identity persistence layer, Phase 0** (`decision-log.md` D44/D55/D56/D62/
  D63/D64, `product/99-rfc/0012-auth-identity-multi-method.md`,
  `product/99-rfc/0013-invitation-token-based.md`) — real `businesses`/
  `business_memberships`/`auth_identities`/`invitations` tables + RLS + the
  `create_business_with_owner`/`accept_invitation` SECURITY DEFINER RPCs.
  The `business_id`/`auth.uid()` scoping every later phase (Inventory,
  Selling, Events, Results — Phase 1-3) depends on. `store.tsx`'s
  `completeOnboarding` now calls `create_business_with_owner` for real;
  `createInvitation`/`acceptInvitation`/`declineInvitation` are **not** wired
  yet — see that migration's own header comment and this pass's build report
  for why (the prototype's current Invitation UI/domain type is still
  phone-keyed, RFC 0013's own token-keyed redesign hasn't had its UI
  Migration-Workflow pass yet).
- **Inventory persistence layer, Phase 1** (`context/stage-7-backend-
  integration.md`'s "Phase 1 design summary," `architect`, 2026-09-13) —
  real `suppliers`/`products`/`lots`/`inventory_entries`/`inventory_units`/
  `nfc_tags` tables + RLS + the `commit_lot`/`update_product_price`/
  `update_product_photo`/`assign_tag_to_next_pending_unit` SECURITY DEFINER
  RPCs. `store.tsx`'s `commitLot`/`editPrice`/`setProductPhoto`/
  `assignTagToNextPendingUnit` now call these for real, closing the
  idempotency-key gap `BACKLOG.md` §F previously named for all four.
  Selling/Session/Sale/EventAllocation (Phase 2/2b/2c) are untouched —
  `inventory_units` deliberately gets no UPDATE policy at all in this phase.
- **Inventory persistence layer, Phase 1 follow-up — barcode write**
  (`decision-log.md` D65, `ui-designer`, 2026-09-13) — closes Phase 1's own
  open item 4. `20260913030000`/`20260913031000` added the `barcode` column
  and its partial unique index but never actually wrote it on `commit_lot`'s
  `new`-line insert; `20260913032000_inventory_barcode_write.sql` fixes
  that (writes `barcode` when present, catches a genuine collision and
  re-raises it as `barcode_already_registered`). Found and fixed while
  building `inventory.md` §3.8b-§3.8e / `home.md` §3.9-§3.9c's UI —
  disclosed here rather than silently assumed working, per this project's
  own "check directly, don't assume" discipline. **Pushed to the real
  hosted project** — see the checklist's item 12 below (discovered already
  applied during the Phase 2 session, correcting this file's own earlier
  "not yet pushed" claim, which was accurate only for the specific
  credential-less session that first wrote it).
- **Selling persistence layer, Phase 2** (`context/stage-7-backend-
  integration.md`'s "Phase 2 design summary," `architect`, 2026-09-13,
  `decision-log.md` D66) — real `venues`/`events`/`price_overrides`/
  `sessions`/`sales`/`sale_items` tables + RLS + the new `caller_membership_id`
  RLS helper + ten SECURITY DEFINER RPCs: `create_event`/`cancel_event`/
  `set_price_override`/`start_session`/`add_item_to_sale`/
  `add_item_to_sale_by_tag`/`remove_sale_item`/`cancel_sale`/`finalize_sale`/
  `close_session`. `store.tsx`'s `createEvent`/`cancelEvent`/
  `setPriceOverride`/`startSession`/`addItemToSale`/`addItemToSaleByTag`/
  `removeSaleItem`/`cancelSale`/`finalizeSale`/`closeSession` now call these
  for real, replacing the previous client-side-only writes. `add_item_to_sale`
  is the `<3s`-critical write (`company/backlog.md` #1) — plain Business-wide
  FIFO only (`FOR UPDATE SKIP LOCKED`, reusing `inventory_units_fifo_idx`),
  with `EventAllocation`-aware selection deliberately not consulted here
  (Phase 2b, confirmed out of scope three independent ways). `EventAllocation`/
  `AllocationMovement`/`EventAssignment` code is untouched.
- **EventAssignment persistence layer, Phase 2c** (`context/stage-7-backend-
  integration.md`'s "Phase 2c design summary," `architect`, 2026-09-13,
  `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60) — real
  `event_assignments` table + RLS + the `assign_to_event`/
  `unassign_from_event` SECURITY DEFINER RPCs. `store.tsx`'s
  `createEventAssignment`/`removeEventAssignment` now call these for real,
  replacing the previous client-side-only writes — staff-to-Event
  scheduling, letting an OWNER assign/unassign a SELLER to a specific
  Event. The scheduling-conflict warning (`hasSchedulingConflict`,
  `selectors.ts`) needed no new RPC at all — a pure client-side computation
  over data the RLS design already grants. Does not touch
  `EventAllocation`/`AllocationMovement` (Phase 2b, below).
- **EventAllocation/AllocationMovement persistence layer, Phase 2b**
  (`context/stage-7-backend-integration.md`'s "Phase 2b design summary,"
  `architect`, 2026-09-13, RFC 0009/D57 + RFC 0010/D59) — real
  `event_allocations`/`event_allocation_units`/`allocation_movements`
  tables + RLS + two private SQL helpers
  (`_fifo_commit_to_allocation`/`_release_from_allocation`, not granted to
  `authenticated`) + five public SECURITY DEFINER RPCs:
  `save_event_allocations`/`scan_unit_into_event_allocation`/
  `reallocate_event_allocation`/`return_scanned_units_to_general`/
  `reconcile_manual_allocation`. `store.tsx`'s `saveEventAllocations` now
  calls `save_event_allocations` for real (replacing the previous
  client-side-only `commitAllocation`/`releaseAllocation` local mock,
  retired); four new functions — `scanUnitIntoEventAllocation`/
  `reallocateEventAllocation`/`returnScannedUnitsToGeneral`/
  `reconcileManualAllocation` — are real and ready, though only the last is
  called by a built screen (`EventDetail.tsx`'s manual-reconciliation
  section) as of this pass; the other three have no built UI caller yet
  (`events.md` §3.22/§3.24, NFC-scan allocation and the reallocation screen,
  aren't built in this slice) but are real, callable, reviewable functions
  per the design summary's own explicit ask. **Also extends four
  already-shipped Phase 2 functions** — `add_item_to_sale`/
  `add_item_to_sale_by_tag`/`remove_sale_item`/`cancel_sale` — in a separate
  migration (`20260913061000`, since these are `CREATE OR REPLACE`
  redefinitions of existing functions, not new objects): an open
  `EventAllocation` now gates Sale-time consumption exclusively to its own
  committed pool (never falling back to the plain pool), its exhaustion
  raising a distinct, terminal `event_allocation_exhausted` error — the
  actual server-side "lost the race" signal `home.md` §3.8a's ⊗ pattern
  depends on; `remove_sale_item`/`cancel_sale` now revert an
  allocation-committed unit to `reserved` (not `available`) so removing it
  from a Sale never silently releases it from its Event's own allocation
  too. **Self-caught correctness fix, found while writing the client-side
  mirror** (`20260913062000`): every "is this unit still genuinely
  outstanding for this allocation" query gained a "current custody" filter
  — `event_allocation_units` is append-only, and reallocation is the one
  write that produces a *second* row for the same unit (the destination's
  own commit); without the filter, the *source* allocation's now-stale row
  would still count that unit, double-counting stock that's actually moved
  elsewhere. Client mirror: `EventAllocation.allocatedUnitIds` (the old
  local-mock array) is retired — replaced by a real, row-level mirrored
  table, `AppState.eventAllocationUnits` (`EventAllocationUnit[]`), matching
  the server's own `event_allocation_units` 1:1. `quantityRemaining`/
  `quantityRemainingBySource`/`disponibleEnGeneral`/`eventScopedRemaining`
  (`selectors.ts`) all now derive from that real mirrored data (never a
  stored column, matching D59's own rule) instead of the retired array
  field — including the same current-custody filter and the new
  "not yet claimed by an open Sale" exclusion Phase 2b's own selling
  integration requires.
- **`SaleItem.eventAllocationId` (`decision-log.md` D67)** — `reviewer`-
  confirmed Blocker fix, `architect`-designed, `20260913063000_sale_item_
  event_allocation_id.sql`. `remove_sale_item`'s/`cancel_sale`'s revert-
  target check (`exists (select 1 from event_allocation_units where
  unit_id = ...)`, `20260913061000`) returns `true` forever for any unit
  ever committed to any allocation — `event_allocation_units` is append-
  only, so it can't distinguish a still-live commitment from one long since
  reconciled back to general stock, stranding a unit in the wrong status
  under a routine allocate→reconcile→(later, unrelated sale)→cancel
  sequence. Fixed by capturing `event_allocation_id` once, at write time, on
  `sale_items` itself (`add_item_to_sale`/`add_item_to_sale_by_tag` — the
  currently-live `20260913062000` versions, extended here — already resolve
  or can resolve this value in their own allocation-aware branch), and
  reading it back unchanged rather than re-deriving it. `add_item_to_sale`/
  `add_item_to_sale_by_tag` both gained a new `event_allocation_id` output
  column (a return-type change, so both are `drop function`+`create`, not
  `create or replace`, in this migration) so the client mirror never has to
  re-derive it either. Client: `types.ts`'s `SaleItem` gains
  `eventAllocationId?: ID`; `store.tsx`'s `mirrorAddedSaleItem` threads it
  through; `selectors.ts`'s `unitHasEventAllocationCommitment` (the same
  re-derivation-from-append-only-data bug pattern, client-side) is retired,
  replaced by `saleItemHasEventAllocationCommitment(item)` — a direct read
  of the already-mirrored `SaleItem`'s own field, no longer a query over
  `eventAllocationUnits`.
- **`add_item_to_sale_by_tag`'s own `v_alloc_id` mis-attribution
  (`decision-log.md` D67, `architect`-designed fix)** —
  `20260913064000_add_item_to_sale_by_tag_fix.sql`. Found already deployed
  in `20260913063000` above: that migration's `add_item_to_sale_by_tag`
  resolved `v_unit_id` via one query (matching on `iu.status = 'available'
  or (iu.status = 'reserved' and exists(...))`), then resolved `v_alloc_id`
  via a second, decoupled query that never checked `inventory_units.status`
  at all — so it could find a stale "current custody" `event_allocation_units`
  row and set a non-null `v_alloc_id` even when the unit actually matched
  through the plain `available` disjunct, mis-attributing a plain-pool sale
  to a stale allocation (a later cancellation would then incorrectly
  re-reserve the unit). Fixed by merging both queries into one, via
  `left join lateral`, so the disjunct-match and the allocation-id capture
  are structurally the same expression and can never disagree. Signature/
  return shape unchanged, so this is a plain `create or replace` — no
  drop/re-grant needed. No client-side change required.

**Status as of 2026-09-13:** phone/OTP path — real Supabase project
created, linked, migration pushed, and both Edge Functions deployed and
ACTIVE (see checklist below). Not yet live-tested end to end — still
blocked on Twilio/WhatsApp sender setup (steps 2-3); WhatsApp production
verification is separately non-blocking for the pilot as a whole now
(`company/business-decisions.md` Q19), since Google/Email cover the working
sign-up paths in the meantime. Google and Email sign-in — **live and
confirmed working in production** on `nahui.app` (Vercel env vars set,
Resend SMTP configured, Google OAuth Client configured). Identity
persistence layer (Phase 0) — migration SQL applied to the real hosted
project via `supabase db push` (checklist items 8-10), `reviewer`-verified
across two rounds of fixes. Inventory persistence layer (Phase 1) —
migration SQL applied to the real hosted project via `supabase db push`
(checklist item 10), client wiring complete (`store.tsx`), `tsc -b`/
`vite build` both clean; `reviewer`-verified (checklist item 11) — 1 Blocker
closed client-side, 2 Important findings closed by
`20260913033000_inventory_persistence_layer_fixes.sql`, **pushed**
(checklist item 13, discovered already applied during the Phase 2 session).
Inventory persistence layer, Phase 1 barcode-write follow-up —
migration SQL written (`20260913032000_inventory_barcode_write.sql`),
client wiring complete, `tsc -b`/`vite build` both clean; **pushed** to the
real hosted project (checklist item 12, discovered already applied during
the Phase 2 session) — not independently `reviewer`-verified.
Selling persistence layer (Phase 2) — migration SQL applied to the real
hosted project via `supabase db push` (checklist item 14), client wiring
complete (`store.tsx`, ten call sites across `Selling.tsx`/`NuevoEvento.tsx`/
`AdjustPrices.tsx`/`EventDetail.tsx`/`HomeScreen.tsx`), `tsc -b` clean;
**`reviewer`-verified** (checklist item 15) — 1 Blocker + 3 Important
findings, all closed by `20260913041000_selling_persistence_layer_fixes.sql`
(SQL) and `Selling.tsx`/`store.tsx` (client). `tsc -b`/`npm run build` both
clean after the fix round; migration pushed (checklist item 16).
EventAssignment persistence layer (Phase 2c) — migration SQL applied to the
real hosted project via `supabase db push` (checklist item 17), client
wiring complete (`store.tsx`, one call site,
`PersonalParaEsteEvento.tsx`), `tsc -b`/`npm run build` both clean. Not yet
`reviewer`-verified.
EventAllocation/AllocationMovement persistence layer (Phase 2b) — all three
migrations (`20260913060000` new tables/RLS/helpers/five RPCs,
`20260913061000` the four-function selling-integration extension,
`20260913062000` the self-caught current-custody fix) applied to the real
hosted project via `supabase db push` (checklist items 19-21), client
wiring complete (`store.tsx`: `saveEventAllocations` rewritten,
`scanUnitIntoEventAllocation`/`reallocateEventAllocation`/
`returnScannedUnitsToGeneral`/`reconcileManualAllocation` added;
`selectors.ts`: `quantityRemaining`/`quantityRemainingBySource` rewritten
against the new `eventAllocationUnits` mirror,
`unitHasEventAllocationCommitment` added, `mostRecentAllocationMovementForUnit`/
`saleCancelRevertStatus` retired; `types.ts`: `EventAllocationUnit` added,
`EventAllocation.allocatedUnitIds` retired; two call sites updated,
`MercanciaParaEsteEvento.tsx`/`EventDetail.tsx`), `tsc -b`/`npm run build`
both clean. `reviewer`-verified — 1 Blocker (`remove_sale_item`/`cancel_sale`'s
revert-status check permanently stuck once `event_allocation_units`' append-
only nature is accounted for), closed by `decision-log.md` D67 +
`20260913063000_sale_item_event_allocation_id.sql`: `SaleItem.event_allocation_id`
(nullable) added, captured once at write time by `add_item_to_sale`/
`add_item_to_sale_by_tag` (the currently-live `20260913062000` versions,
extended — both gained a new `event_allocation_id` output column, a
return-type change requiring `drop function`+`create`), read back unchanged
by `remove_sale_item`/`cancel_sale` (plain `create or replace`, return type
unchanged). Client: `types.ts`'s `SaleItem.eventAllocationId` added;
`store.tsx`'s `mirrorAddedSaleItem` threads it through both RPC call sites;
`selectors.ts`'s `unitHasEventAllocationCommitment` retired, replaced by
`saleItemHasEventAllocationCommitment(item)`. Migration applied to the real
hosted project via `supabase db push` (checklist item 23). `tsc -b`/
`npm run build` both clean after the fix.
**Follow-up fix, found already deployed:** `add_item_to_sale_by_tag`'s own
body (as deployed by `20260913063000` above) still mis-attributed
`v_alloc_id` via a decoupled second query that never checked
`inventory_units.status`, so it could disagree with the disjunct that
actually matched the unit — closed by
`20260913064000_add_item_to_sale_by_tag_fix.sql` (`left join lateral`
merges the two into one expression that can never disagree). `tsc -b`/
`npm run build` both clean (SQL-only fix, no client change needed);
migration pushed to the real hosted project via `supabase db push`
(checklist item 24).
**Read-side data hydration (`context/stage-7-backend-integration.md`'s "Read-
side data hydration design", `architect`, 2026-09-14)** — closes the
cross-cutting gap found the same day: all 22 write RPCs above were wired,
but nothing ever re-fetched real backend data on load — every screen only
ever showed locally-mirrored write results plus `localStorage`, so a second
device or a cleared browser saw none of the real, correctly-persisted data.
Pure client-side change, **no new migration** — reuses every table's
existing RLS (SELECT already granted to any active member per each Phase's
own design summary) and every `AppState` shape already established.
`store.tsx` gained: `writeGenerationRef`/`applyWriteMirror` (the shared
race-safety mechanism, substituted into all 22 existing write-mirror
`setState` calls, no logic change); `hydrateFromBackend(businessId)` (one
`.select('*')` per domain table — `businesses`, `business_memberships`,
`products`, `lots`, `inventory_entries`, `inventory_units`, `nfc_tags`,
`venues`, `events`, `price_overrides`, `sessions`, `sales`, `sale_items`,
`event_allocations`, `event_allocation_units`, `allocation_movements`,
`event_assignments` — never `customers`/`claims`, the hard guardrail);
`resolveActiveBusinessFromAuth()` (resolves this device's real Supabase Auth
session, Email/Google only, to its `business_memberships` row); a new
`src/domain/hydrationMapping.ts` (pure snake_case-row → camelCase-entity
mappers, one per table, kept separate from `store.tsx`'s own orchestration);
a new transient `hydrationStatus` (`'idle'|'loading'|'ready'|'error'`, never
persisted). Three triggers: once on mount/session-resolve
(`state.currentUserId` transition), again on `visibilitychange` → visible,
again on Resultados' own screen-mount. New UI: `AuthResolving.tsx`
(`AppRouter.tsx`'s own pre-shell gate for the second-device/cleared-browser
case — the actual bug this pass exists to fix) and the shared
`ResolvingState.tsx` (the §3.1/§3.2 near-instant-skeleton/slow-"Un
momento…" convention every tab's Approved spec already specifies
identically), wired into `ResultadosScreen.tsx` alongside the
previously-built-but-unwired `ResultadosLoadError.tsx`. `tsc -b`/
`npm run build` both clean. Not yet `reviewer`-verified.
**Business settings persistence layer (`20260914000000_business_settings_writes.sql`,
`architect`-designed)** — closes the Blocker `reviewer` flagged against the
read-side hydration pass immediately above: `hydrateFromBackend` wholesale-
replaces `state.business` from the real `businesses` row on every hydration
cycle, but seven client-side write functions (`setBusinessIdentity`,
`acknowledgeOnboarding`, `activatePaidPlan`, `requestDowngradeToFree`,
`cancelPendingSubscriptionTierChange`, `changeDefaultSellingMode`,
`markNfcAvailabilityNudgeShown`) still only ever mutated the local mirror,
so every hydration cycle silently reverted these fields back to their
`create_business_with_owner`-time defaults. Seven new OWNER-only,
idempotency-keyed RPCs, same shape as `update_product_price`/
`update_product_photo`. Client: all seven `store.tsx` functions now return
`Promise<boolean>` and call the real RPC, applying `applyWriteMirror` only on
success (`editPrice`/`setProductPhoto`'s own "server-confirmed, then local
mirror" shape); `requestDowngradeToFree` gained an `effectiveDate: string`
param, now computed by the caller (`SettingsScreen.tsx`'s `runWrite`) instead
of inside the store. Call sites updated: `OnboardingFlow.tsx` (demo-path
`setBusinessIdentity` now awaited and failure-logged;
`TodoListo`'s `onEnter` was fire-and-forget at this point — corrected in the
next fix round below); `BusinessIdentity.tsx`
(`onSaved` now `Promise<boolean>`, a `false` result routes to the already-
built `saveState('error')` retry branch — genuinely reachable now, not just
disclosed-but-unwired); `SettingsScreen.tsx` (`runWrite` now async, a `false`
result routes to the existing `'saving-error'` `SubView` instead of
unconditionally returning to `'main'`); `useNfcSessionStart.ts`
(`markNfcAvailabilityNudgeShown` now fire-and-forget, no dedicated retry
surface for this one-time nudge). `acceptInvitation`/`createInvitation`
deliberately untouched — a separate, larger gap (no real `create_invitation`
RPC exists at all) that needs RFC 0013's own token design, out of scope
here. `tsc -b`/`npm run build` both clean. Not yet `reviewer`-verified.
**Fix round (`20260914010000_land_pending_subscription_tier.sql`,
`architect`-designed) — two more issues found in the same hydration-layer
review:** (1) Blocker — `reconcilePendingSubscriptionTier` (`store.tsx`), the
mechanism that lands a deferred `subscriptionTier` change once its effective
date arrives, was still two plain `setState` calls with no RPC at all, so a
merchant's downgrade never actually took effect in the real database; every
hydration cycle re-asserted the stale, un-landed row. A new eighth
OWNER-only, idempotency-keyed RPC, `land_pending_subscription_tier`,
re-checks the landing condition server-side (never trusted from the client)
and, if met, atomically flips `subscription_tier` and clears the pending
triple in one `update` — a harmless no-op otherwise. Client:
`reconcilePendingSubscriptionTier` keeps its synchronous `justLanded` return
contract (so the caller can still render §2.4's acknowledgment line on the
same mount) but now fires the real RPC in the background and
`applyWriteMirror`s the full flip on success; a failure is logged and left
for the next natural trigger (the next Configuración mount, or hydration) to
retry, matching the rest of this hydration layer's own posture. (2)
Important — `TodoListo`'s "Entrar" tap fired the real
`acknowledgeOnboarding` RPC with no error/retry state (it had no way to fail
when this was a synchronous local mock); now gets the same `saving`/error-
with-retry shape `BusinessIdentity.tsx`'s §3.10a treatment already
establishes, applied to both trigger paths (the auto-continue timer and the
manual tap) through one shared `handleEnter`. `tsc -b`/`npm run build` both
clean. Not yet `reviewer`-verified.
**Phase 3, Results/Resultados (2026-09-14, `architect`-designed, `context/stage-7-backend-integration.md`'s "Phase 3 design summary")** — verification-only, no new migration and no client code change. Confirmed directly: every Resultados screen/sub-screen already reads exclusively from `useStore()`'s real, now-hydrated `AppState` through the existing `src/domain/selectors.ts` pure functions — mock and hydrated data were always the same `AppState` shape, so nothing needed rewiring. Every $ figure traced to `SaleItem.pricePaid` only, never a re-read of `price_overrides`/`products.default_price`. `TusClientes.tsx` confirmed to query neither `customers` nor `claims` (tables don't exist; screen renders its unconditional zero-Claims empty state). Resultados' OWNER-only tab gating confirmed already correct in `App.tsx`/`NavBar` — the missing piece is `reports.md`'s own text never stating this scope, a documentation gap routed to `ux-designer`, not a code fix. `tsc -b`/`npm run build` both clean. Not yet `reviewer`-verified.

**Team Invitations real write path (`20260914030000_invitation_token_write_path.sql`, RFC 0013/D64, `architect`-designed, `builder`-implemented — see `context/team-invitations-real-wiring.md`)** — closes the gap named in that RFC's own promotion: `createInvitation`/`acceptInvitation` were still 100% local-mock. Four new/wired functions: `_generate_invitation_token` (private helper — 256-bit `extensions.gen_random_bytes`, base64url-encoded, sha256/hex hash, 24h expiry), `create_invitation` (OWNER-only, Paid-tier-gated, idempotency-keyed — replays the raw token on a retry, since it's never persisted anywhere but that retry cache), `regenerate_invitation` (OWNER-only, in-place token/expiry mutation, server re-confirms the row is genuinely expired; a same-day fix round, `20260914031000_invitation_token_write_path_fix.sql`, added the same Paid-tier re-check `create_invitation` already had — the original version only re-verified OWNER-ship, not tier), `peek_invitation` (read-only, `stable`, granted to `anon`+`authenticated` — the pre-auth token-resolution RFC 0013 Section 2 needs; `status` computed at read time, `expired` never stored). `accept_invitation` itself untouched (already correct). Client: `types.ts`'s `Invitation` loses `phone`, gains `expiresAt`/`targetHint`/`acceptedByUserId`, `status` narrows to `pending | accepted | revoked`; `selectors.ts` gains `invitationDisplayStatus` (the `expired` read-time derivation), replacing the now-structurally-retired `pendingInvitationsForPhone`; `store.tsx`'s `createInvitation`/`acceptInvitation` rewritten as real async RPC calls, `regenerateInvitation`/`peekInvitation` added. `AppRouter.tsx` gains minimal path-based routing (`window.location.pathname` match on `/invite/<token>`, captured once at mount into a small piece of state, not yet consumed by any screen) and loses the phone-match auto-offer mechanism the RFC itself retires (no `phone` field left to match against — RFC 0013 Section 2: "the new mechanism never auto-surfaces anything"). `tsc -b`/`npm run build` clean except `TeamScreen.tsx`/`InvitationFlow.tsx` (expected — those two screens' own rebuild against the reworked `settings.md`/`authentication.md` is a separate, parallel `ui-designer` dispatch). Not yet `reviewer`-verified.

**Superseded in part by `20260914032000_invitation_token_no_raw_cache.sql`** — this migration's own "replays the raw token on a retry, since it's never persisted anywhere but that retry cache" design, described above as a deliberate exception, was an `architect`-found Blocker against D64's real threat model (a DB dump, not an RLS bypass). See checklist item 29 below for the fix: `idempotency_keys.result` no longer carries the raw token at all, `regenerate_invitation`'s precondition loosened to any still-`pending` row (not only expired), and `store.tsx`'s two return types now honestly reflect `token: string | null`.

**`accept_invitation` membership-conflict fix (`20260914040000_accept_invitation_membership_conflict_fix.sql`, `architect`-designed, `builder`-implemented)** — a second, separate `architect`-found Blocker on `accept_invitation` itself (untouched by every prior pass above): `already_member`/`membership_revoked` were never actually raised, since a pre-existing `BusinessMembership` row for `(user_id, business_id)` made the membership insert's `on conflict do nothing` silently no-op, with the fallback `select` then returning that row's id as an ordinary success. Fixed by looking up the pre-existing row's own `status` on conflict and raising the exact exception name `store.tsx`'s `acceptInvitation` already string-matches against, instead of silently succeeding. No client-side change needed — see checklist item 30 and `context/team-invitations-real-wiring.md` for full detail, including a separate, named-not-fixed open item (the `idempotency_keys` cached-error-replay branch is structurally unreachable for a rollback reason, in this function and `regenerate_invitation`).

**`revokeMembership` real wiring (2026-09-14, `builder`, pure client-side — no new migration)** — closes the same defect class the Team Invitations pass above closed for `createInvitation`/`acceptInvitation`/`cancelInvitation`. The `revoke_membership` RPC has existed and been deployed since Phase 0's own `reviewer` fix round (`20260913010000_identity_persistence_layer_fixes.sql`, OWNER-only, naturally idempotent, no client-supplied key), but `store.tsx`'s `revokeMembership` was never actually updated to call it — 100% local-mock (`setState`, never `applyWriteMirror`, never touched Supabase) until now. Rewritten as a real `async` function matching `cancelEvent`'s own established shape (single-target RPC call, no idempotency key, `applyWriteMirror` mirror on success, `false`-returning on a genuine RPC error). `TeamScreen.tsx`'s `handleConfirmRemove` updated to `await` it and route a real failure into the screen's own already-built `remove-error` state (previously unreachable — the mock write couldn't fail) instead of the artificial `window.setTimeout` delay the mock used. `cancelInvitation`/`cancel-error` were the one still-open instance of this defect class at the time — closed by the `cancel_invitation` pass immediately below. `tsc -b`/`npm run build` clean. Not yet `reviewer`-verified.

**`cancel_invitation` real wiring (`20260914050000_cancel_invitation.sql`, `architect`-designed, `builder`-implemented)** — closes the last still-open instance of the defect class the two passes above closed for `createInvitation`/`acceptInvitation`/`revokeMembership`: `settings.md` §3.12d "Cancelar invitación" was already fully built in `TeamScreen.tsx`'s cancel-confirm sheet, calling a local-mock `cancelInvitation` that couldn't fail. New RPC `cancel_invitation` (OWNER-only, idempotency-keyed, flips `Invitation.status: pending → revoked` via a `status = 'pending'` CAS — deliberately expiry-independent, matching `regenerate_invitation`'s own final "any still-pending row" precondition, since `settings.md` §3.11 hides the button on an expired row for UX reasons only, not a domain rule; deliberately **no** Paid-tier gate, unlike `create_invitation`/`regenerate_invitation`, since closing an existing exposure should never strand a downgraded OWNER). Client: `store.tsx`'s `cancelInvitation` rewritten as a real `async` RPC call matching `acceptInvitation`'s own conventions (checks `error?.message === 'invitation_not_pending'`, mirrors success via `applyWriteMirror`, returns `{ invitationId, status: 'revoked' } | { error: 'invitation_not_pending' } | null`). `TeamScreen.tsx`'s `handleConfirmCancel` updated to `await` it (a persisted `cancelKeyRef`, same reused-across-retries convention as `createKeyRef` — required here, unlike `regenerateInvitation`'s per-call fresh key, because this CAS consumes the `pending` status on success) and route both a platform failure and a lost CAS into the screen's own already-built `cancel-error` state (previously unreachable — the mock write couldn't fail), same real-wiring pattern `remove-error` got above. `tsc -b`/`npm run build` clean. Not yet `reviewer`-verified.

**`peek_invitation` rate-limit mitigation (`20260914060000_peek_invitation_rate_limit.sql`, RFC 0013/D64, `architect`-designed, `builder`-implemented — independent of the `cancel_invitation` pass above, no shared files touched)** — closes the token-enumeration surface RFC 0013 §4/§7 named but never actually closed: `peek_invitation` is anon-callable and resolves an Invitation by token alone, before authentication runs at all, with nothing stopping a caller from hammering it with guessed tokens directly via PostgREST. New table `invitation_peek_attempts` (same deny-by-default RLS posture as `otp_attempts` — zero policies, service-role-only), and `peek_invitation(text)`'s `EXECUTE` grant to `anon`/`authenticated` revoked outright, closing the direct-PostgREST bypass. A new Edge Function, `peek-invitation` (structured identically to `send-otp`), fronts the RPC: reads the caller's IP from `x-forwarded-for` (Supabase's edge network populates it before the handler runs, distinct from `inet_client_addr()`'s problem inside Postgres, which would only ever see Supabase's own internal pooler IP — bucketed under `'unknown'` when the header is absent, failing closed rather than skipping the check), counts `invitation_peek_attempts` rows for that IP in the last 10 minutes, returns `429 rate-limited` at ≥20 without touching `peek_invitation` at all, otherwise logs the attempt and calls the RPC via its own service-role connection (which bypasses the new revoke by design, same shape `send-otp`/`verify-otp` already use). Client: new `src/domain/invitationClient.ts` (mirrors `otpClient.ts`'s `callOtpFunction` shape, kept separate since it isn't an OTP call), `store.tsx`'s `peekInvitation` switched from a direct `supabase.rpc('peek_invitation', …)` call to this Edge Function; a rate-limited response collapses into the same `null` → §3.9b "no se pudo abrir el enlace" retry state every other `peekInvitation` failure already produces — no new UI state, matching how `sendOtp`'s own `rate-limited` reason already collapses into `PhoneStep.tsx`'s one generic `sendState === 'error'` branch (a plumbing-level protection, not a distinguishable user-facing state). Migration pushed via `supabase db push`, function deployed via `supabase functions deploy peek-invitation` (no `--no-verify-jwt` — confirmed `verify_jwt: true` via `supabase functions list`, matching `send-otp`/`verify-otp`'s own config; the anon key sent as `Authorization: Bearer` already satisfies default JWT verification, same convention `otpClient.ts` already established). Both confirmed live: `supabase migration list` shows `20260914060000` local/remote-matched, `supabase functions list` shows `peek-invitation` `ACTIVE`. **NOT LIVE-TESTED end to end** — this environment can't actually invoke the deployed function to verify the `x-forwarded-for` behavior live; asserted from Supabase's own documented platform behavior only, same disclosure `send-otp`/`verify-otp` already carry for their own real-infrastructure gaps. `tsc -b`/`npm run build` both clean. Not yet `reviewer`-verified.

**Platform-wide 500 fix — new API key system migration (2026-09-14, found via direct browser testing, `builder`-implemented)** — a real, previously-undiscovered infrastructure defect affecting every deployed Edge Function in the project, not scoped to Team Invitations: `send-otp`, `verify-otp`, and `peek-invitation` all failed on every call with a 500, because their internal admin Postgres client got a `403 Forbidden` on database calls that should bypass RLS entirely (`otp_attempts`/`invitation_peek_attempts` inserts, the `peek_invitation` RPC call). Root cause: this Supabase project has since migrated to Supabase's new API key system (confirmed via the Management API — an active `sb_secret_...` key exists, named `default`, `secret_jwt_template: {"role":"service_role"}`), but all three functions' own code still read the deprecated `SUPABASE_SERVICE_ROLE_KEY` environment variable as a plain string — no longer the mechanism the platform auto-injects a working service-role credential through. Fixed in all three (`send-otp`/`verify-otp`/`peek-invitation`'s `index.ts`) per Supabase's own current migration guide (`https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys`, verified to match verbatim): read the new `SUPABASE_SECRET_KEYS` JSON object instead (`JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')!)['default']`), kept under the same `SUPABASE_SERVICE_ROLE_KEY` variable name downstream since every call site already references it that way — only the source changed, `createClient()` itself needed no change. `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`SUPABASE_PUBLISHABLE_KEYS` and the client-side `apikey`/`Authorization` headers used to invoke these functions were unaffected and untouched — already correctly using the new publishable key per a live browser network trace. All three redeployed (`supabase functions deploy <name>`) and confirmed `ACTIVE` at version 2 with a changed `ezbr_sha256` via `supabase functions list`. **`send-otp` still has a second, independent, already-known reason it will fail past its own rate-limit check** — `supabase secrets list` confirms no `TWILIO_*` secrets exist in this project at all (matches the manual checklist's own "NOT YET STARTED" on steps 2-4 below); that gap is unrelated to this fix and isn't closed by it. **Not live-invoked by this pass** — deploy and code correctness were confirmed via the CLI/Management API only, per explicit instruction to leave live re-verification to the Product Owner. The legacy `SUPABASE_SERVICE_ROLE_KEY`/`SUPABASE_URL`/etc. custom secrets visible in `supabase secrets list` are left in place deliberately (cleanup deferred to a future pass, after live verification).

**Follow-up, same day — the API key fix above was necessary but not sufficient; two real, separate permission gaps were still live-blocking every call, found by actually invoking the deployed functions from a real browser (Main, direct).** The 403s persisted after the key-system fix. A raw-REST diagnostic (temporarily added to `peek-invitation`, removed after use) isolated the actual cause precisely: **`42501 permission denied for table invitation_peek_attempts`**, with Postgres's own hint naming exactly what was missing — `GRANT SELECT ON public.invitation_peek_attempts TO service_role`. `service_role`'s `bypassrls` attribute bypasses RLS *policies*; it has never bypassed ordinary Postgres `GRANT`-based table/function privileges — a genuine misconception that both `otp_attempts`'s original migration (`20260910000000`) and `invitation_peek_attempts`'s (`20260914060000`) stated verbatim in their own header comments ("service_role bypasses RLS/grants entirely"). Every other table in this project is reached exclusively through `SECURITY DEFINER` RPCs, which execute with the function *owner's* privileges regardless of the caller's role — these two tables are the only ones any Edge Function queries directly via PostgREST `.from(...)`, the one access pattern this gap could reach, which is exactly why nothing else in the project was affected.

Fixed in two small, additive migrations: `20260915000000_edge_function_table_grants.sql` (`GRANT SELECT, INSERT, UPDATE ON otp_attempts TO service_role`; `GRANT SELECT, INSERT ON invitation_peek_attempts TO service_role` — scoped exactly to what each function's own code actually does, confirmed by reading it, not assumed) and, after re-testing surfaced a second, separate gap the same way (`42501 permission denied for function peek_invitation` — this project also has PostgreSQL's normal "PUBLIC gets EXECUTE on new functions by default" revoked at the schema level, a deliberate security posture, not a bug in itself), `20260915010000_peek_invitation_service_role_execute.sql` (`GRANT EXECUTE ON FUNCTION peek_invitation(text) TO service_role`). Both pushed via `supabase db push`; `NOTIFY pgrst, 'reload schema'` issued after each to force PostgREST's schema-cache to pick up the new grants immediately rather than waiting for its own periodic auto-reload — without this, the grants were correct in the database but invisible to PostgREST for a real, observed window.

**Genuinely live-verified this time**, not just deploy-confirmed: opened `/invite/<fake-token>` in a real running dev server against the real hosted project. First pass after the grant fixes returned a real `200 {"ok":false,"reason":"not-found"}` from `peek-invitation` — correct, since the token doesn't exist — but the UI still showed the generic §3.9b "no se pudo abrir el enlace" retry state instead of §3.13a's "ya no está disponible." That surfaced a third, genuinely separate bug, this time client-side, not infrastructure: `store.tsx`'s `peekInvitation` collapsed `reason: 'not-found'` into the same bare `null` as `rate-limited`/`platform-error`, discarding the distinction `authentication.md` §2.0 step 2 requires between "the read itself fails outright" (§3.9b, retry-appropriate) and "resolves cleanly to anything else — not found... or a determinate status that isn't pending" (§3.13a, a dead end, nothing to retry). The prior doc comment on `peekInvitation` had asserted this collapse was intentional and spec-compliant — it wasn't; it conflated two genuinely different outcomes the spec itself separates. Fixed: `peekInvitation` now returns a distinct `'not-found'` sentinel, and `InvitationFlow.tsx`'s `resolveToken` checks for it explicitly alongside its existing `status !== 'pending'` check. Re-tested live after the fix: the fake-token link now correctly renders "Esta invitación ya no está disponible" (§3.13a), screenshot-confirmed.

**What's now genuinely confirmed working end to end, live, against the real hosted backend:** the pre-auth `peek-invitation` path for a dead/nonexistent token, exactly matching spec. **What was not yet verified live at the time this entry was first written** (no real Business existed anywhere in the real database — zero rows — so nothing had ever completed real Onboarding against this backend): the "happy path" of a genuinely `pending` Invitation resolving to the real offer screen; the full accept flow; `send-otp`/`verify-otp` end to end (still additionally blocked on missing Twilio credentials for the former). **Superseded the same day — see the Onboarding entry immediately below.** `tsc -b`/`npm run build` clean throughout.

**Real Onboarding blocker found and fixed, same day, via the Product Owner's own live walkthrough (2026-09-15).** Attempting to actually create a Business for the first time — the very first genuinely live end-to-end test of `onboarding.md`'s core write path against the real hosted backend — failed on every attempt with "No pudimos crear tu negocio," both on `free` and `paid` paths. A temporary on-screen diagnostic (a `window.alert` surfacing the raw RPC error, added and removed within the same pass — the Product Owner was testing on mobile, with no practical console access) revealed the real cause immediately: `create_business_with_owner('not_verified', errcode 28000)` — the RPC's own "acting user must hold at least one verified `AuthIdentity`" precondition (D44/RFC 0012 §4) was failing for a real, successfully-authenticated Google session.

Root cause, confirmed by direct query, not assumed: `20260913000000_identity_persistence_layer.sql`'s `on_auth_identity_created` trigger (which mirrors `auth.identities` into `public.auth_identities`) is correctly designed and fires reliably on every *new* identity link going forward — but it only fires on INSERT, and the Product Owner's own Google and Email identities were both linked during earlier live-testing sessions the same day, *before* this migration (and its trigger) had ever been deployed. A direct query confirmed exactly this: both rows existed in Supabase's own `auth.identities`, both were missing from `public.auth_identities`. A structural backfill gap, not a trigger malfunction or a permissions issue — the trigger itself needed nothing changed.

**Fix**: `20260915020000_backfill_auth_identities.sql` — a one-time backfill, reusing the trigger function's own exact provider-mapping logic (never duplicated ad hoc) and the same `on conflict (type, identifier) do nothing` idempotency the trigger itself already uses, so it's safe to re-run. Pushed via `supabase db push`; confirmed live afterward via direct query that both previously-missing rows now exist in `public.auth_identities`. The diagnostic `window.alert` was removed from `store.tsx` in the same pass, once it had served its purpose. **Not yet re-tested end to end by the Product Owner after this fix** — the next step is for her to retry Onboarding on the live site and confirm a real Business is actually created.

## What's here

```
supabase/
  config.toml                        — Supabase CLI project config (placeholder project_id)
  migrations/
    20260910000000_create_otp_attempts.sql              — the otp_attempts table
    20260913000000_identity_persistence_layer.sql       — businesses/business_memberships/
                                                            auth_identities/invitations + RLS +
                                                            create_business_with_owner/accept_invitation
    20260913010000_identity_persistence_layer_fixes.sql — reviewer round-1 fixes (Phase 0)
    20260913020000_identity_persistence_layer_fixes2.sql — reviewer round-2 fixes (Phase 0)
    20260913030000_inventory_persistence_layer.sql      — suppliers/products/lots/inventory_entries/
                                                            inventory_units/nfc_tags + RLS +
                                                            commit_lot/update_product_price/
                                                            update_product_photo/
                                                            assign_tag_to_next_pending_unit
    20260913031000_inventory_persistence_layer_fixes.sql — commit_lot return-shape fix (Phase 1,
                                                             own-pass correction, not a reviewer
                                                             finding — see its own header)
    20260913032000_inventory_barcode_write.sql            — commit_lot now actually writes
                                                             products.barcode + collision
                                                             handling (D65, ui-designer,
                                                             own-pass correction — see its
                                                             own header). PUSHED (discovered
                                                             already applied, item 12).
    20260913033000_inventory_persistence_layer_fixes.sql — reviewer fix round 1 (Phase 1):
                                                             Important findings 1-2 — a
                                                             partial index matching
                                                             assign_tag_to_next_pending_unit's
                                                             actual query shape (business_id +
                                                             status='available' + received_at),
                                                             and correcting the products.photo
                                                             column comment to "provisionally
                                                             deferred, pending architect
                                                             reconfirmation" (the accompanying
                                                             Blocker finding — commitLot()'s
                                                             client wiring never preserving a
                                                             stable idempotency key across a
                                                             retry — was a client-only fix, see
                                                             store.tsx/RegisterMerchandise.tsx/
                                                             OnboardingFlow.tsx). PUSHED
                                                             (discovered already applied,
                                                             item 13).
    20260913040000_selling_persistence_layer.sql          — venues/events/price_overrides/
                                                             sessions/sales/sale_items + RLS +
                                                             caller_membership_id +
                                                             create_event/cancel_event/
                                                             set_price_override/start_session/
                                                             add_item_to_sale/
                                                             add_item_to_sale_by_tag/
                                                             remove_sale_item/cancel_sale/
                                                             finalize_sale/close_session.
                                                             PUSHED 2026-09-13.
    20260913041000_selling_persistence_layer_fixes.sql     — reviewer fix round 1 (Phase 2):
                                                             Important findings 1-3 —
                                                             start_session/set_price_override
                                                             now check p_event_id/p_product_id
                                                             belong to p_business_id; seven
                                                             dead idempotency-cache writes
                                                             (add_item_to_sale x3,
                                                             add_item_to_sale_by_tag x3,
                                                             finalize_sale x1) removed, matching
                                                             assign_tag_to_next_pending_unit's
                                                             precedent; cancel_sale/close_session
                                                             now take an explicit p_sale_id/
                                                             p_session_id target instead of
                                                             resolving "whatever is open/active"
                                                             implicitly (the accompanying Blocker
                                                             finding — Selling.tsx's per-Product
                                                             idempotency key silently conflating
                                                             a retry with a genuine second tap
                                                             still in flight — was a client-only
                                                             fix, see Selling.tsx's
                                                             addItemPendingRef). PUSHED
                                                             2026-09-13.
    20260913050000_event_assignment_persistence_layer.sql  — event_assignments + RLS +
                                                             assign_to_event/
                                                             unassign_from_event.
                                                             PUSHED 2026-09-13.
    20260913060000_event_allocation_persistence_layer.sql  — event_allocations/
                                                             event_allocation_units/
                                                             allocation_movements + RLS +
                                                             _fifo_commit_to_allocation/
                                                             _release_from_allocation
                                                             (private) +
                                                             save_event_allocations/
                                                             scan_unit_into_event_allocation/
                                                             reallocate_event_allocation/
                                                             return_scanned_units_to_general/
                                                             reconcile_manual_allocation.
                                                             PUSHED 2026-09-13.
    20260913061000_event_allocation_selling_integration.sql — extends
                                                             add_item_to_sale/
                                                             add_item_to_sale_by_tag/
                                                             remove_sale_item/cancel_sale
                                                             (Phase 2) to consume from/
                                                             release back to an open
                                                             EventAllocation's own pool —
                                                             the server-side "lost the
                                                             race" mechanism
                                                             (event_allocation_exhausted).
                                                             PUSHED 2026-09-13.
    20260913062000_event_allocation_persistence_layer_fixes.sql — self-caught
                                                             correctness fix (own-pass
                                                             correction, not a reviewer
                                                             finding — see its own
                                                             header): adds a "current
                                                             custody" filter to every
                                                             "is this unit still
                                                             outstanding for this
                                                             allocation" query, closing a
                                                             double-counting gap
                                                             reallocation would otherwise
                                                             leave at the source
                                                             allocation's own stale row.
                                                             PUSHED 2026-09-13.
    20260913063000_sale_item_event_allocation_id.sql        — reviewer-found
                                                             Blocker fix
                                                             (D67):
                                                             sale_items.event_allocation_id
                                                             (nullable),
                                                             captured once at
                                                             write time by
                                                             add_item_to_sale/
                                                             add_item_to_sale_by_tag,
                                                             read back
                                                             unchanged by
                                                             remove_sale_item/
                                                             cancel_sale
                                                             instead of
                                                             re-derived from
                                                             the append-only
                                                             event_allocation_units
                                                             table. PUSHED
                                                             2026-09-14.
    20260913064000_add_item_to_sale_by_tag_fix.sql           — follow-up
                                                             Blocker fix
                                                             (D67, found
                                                             already
                                                             deployed in
                                                             `063000`
                                                             above):
                                                             add_item_to_sale_by_tag's
                                                             own v_alloc_id
                                                             was still
                                                             resolved by a
                                                             decoupled
                                                             second query
                                                             that never
                                                             checked
                                                             inventory_units.status,
                                                             so it could
                                                             mis-attribute
                                                             a plain-pool
                                                             sale to a
                                                             stale
                                                             allocation.
                                                             Merges the
                                                             unit-match and
                                                             allocation-id
                                                             capture into
                                                             one `left join
                                                             lateral` query
                                                             so they can
                                                             never
                                                             disagree.
                                                             `create or
                                                             replace`
                                                             (signature/
                                                             return shape
                                                             unchanged).
                                                             PUSHED
                                                             2026-09-14.
    20260914000000_business_settings_writes.sql              — seven new
                                                             OWNER-only RPCs
                                                             closing the
                                                             read-side
                                                             hydration
                                                             wholesale-
                                                             replace gap
                                                             (`reviewer`
                                                             Blocker):
                                                             update_business_identity/
                                                             acknowledge_onboarding/
                                                             activate_paid_plan/
                                                             request_downgrade_to_free/
                                                             cancel_pending_subscription_tier_change/
                                                             change_default_selling_mode/
                                                             acknowledge_nfc_availability_nudge.
                                                             PUSHED
                                                             2026-09-14.
    20260914010000_land_pending_subscription_tier.sql         — eighth OWNER-only
                                                             RPC, same fix
                                                             round: lands a
                                                             deferred
                                                             subscriptionTier
                                                             change once its
                                                             effective date
                                                             arrives
                                                             (server-checked,
                                                             no-op otherwise).
                                                             PUSHED
                                                             2026-09-14.
    20260914020000_land_pending_subscription_tier_fix.sql     — reviewer
                                                             hydration-layer
                                                             fix round 2
                                                             (Blocker):
                                                             land_pending_subscription_tier
                                                             now `returns
                                                             boolean` (`true`
                                                             only when its
                                                             UPDATE actually
                                                             matched a row)
                                                             instead of
                                                             `void`, so the
                                                             client can tell
                                                             a genuine land
                                                             apart from a
                                                             harmless no-op
                                                             (e.g. a
                                                             concurrent
                                                             cancel already
                                                             won the race).
                                                             PUSHED
                                                             2026-09-14.
    20260914030000_invitation_token_write_path.sql            — Team
                                                             Invitations real
                                                             write path (RFC
                                                             0013/D64):
                                                             _generate_invitation_token
                                                             (private helper,
                                                             256-bit token,
                                                             base64url,
                                                             sha256/hex hash,
                                                             24h expiry),
                                                             create_invitation
                                                             (OWNER-only,
                                                             Paid-tier-gated,
                                                             idempotency-keyed),
                                                             regenerate_invitation
                                                             (OWNER-only,
                                                             in-place mutation
                                                             on a server-
                                                             reconfirmed-
                                                             expired row),
                                                             peek_invitation
                                                             (read-only,
                                                             stable, granted
                                                             to anon +
                                                             authenticated —
                                                             the pre-auth
                                                             token-resolution
                                                             RFC 0013 Section 2
                                                             needs).
                                                             `accept_invitation`
                                                             untouched. PUSHED
                                                             2026-09-14.
    20260914031000_invitation_token_write_path_fix.sql        — reviewer fix
                                                             round 1
                                                             (Important):
                                                             regenerate_invitation
                                                             never re-checked
                                                             `businesses.
                                                             subscription_tier
                                                             = 'paid'`
                                                             server-side
                                                             (only OWNER-ship
                                                             was re-verified),
                                                             unlike its
                                                             sibling
                                                             create_invitation
                                                             — a Business that
                                                             downgraded to
                                                             Free while
                                                             holding an old
                                                             expired pending
                                                             Invitation could
                                                             still mint a
                                                             fresh working
                                                             invite link.
                                                             Added the
                                                             identical tier
                                                             check, keyed off
                                                             the already-
                                                             looked-up
                                                             Invitation's own
                                                             `business_id`,
                                                             raising the same
                                                             `paid_tier_required`
                                                             (42501). PUSHED
                                                             2026-09-14.
    20260914032000_invitation_token_no_raw_cache.sql           — architect-
                                                             found Blocker
                                                             fix: stop
                                                             caching the raw
                                                             token in
                                                             idempotency_keys.result
                                                             on
                                                             create_invitation/
                                                             regenerate_invitation
                                                             (D64's actual
                                                             threat model is a
                                                             DB dump, RLS
                                                             never made the
                                                             cache safe); a
                                                             replay now
                                                             returns
                                                             token: null.
                                                             regenerate_invitation's
                                                             precondition
                                                             loosened
                                                             expired-only →
                                                             still-pending
                                                             (error renamed
                                                             invitation_not_expired
                                                             →
                                                             invitation_not_pending),
                                                             making it the
                                                             recovery path for
                                                             a lost
                                                             create_invitation
                                                             response; UI
                                                             unaffected
                                                             (settings.md
                                                             §3.11 still
                                                             expired-only).
                                                             PUSHED
                                                             2026-09-14.
    20260914040000_accept_invitation_membership_conflict_fix.sql — architect-
                                                             found Blocker
                                                             fix:
                                                             accept_invitation's
                                                             membership
                                                             insert
                                                             conflict
                                                             (a
                                                             pre-existing
                                                             active or
                                                             revoked
                                                             row for
                                                             (user_id,
                                                             business_id))
                                                             silently
                                                             no-op'd and
                                                             returned
                                                             success
                                                             instead of
                                                             raising
                                                             already_member/
                                                             membership_revoked.
                                                             On conflict,
                                                             now looks up
                                                             the
                                                             pre-existing
                                                             row's status
                                                             and raises the
                                                             exact
                                                             exception name
                                                             store.tsx
                                                             already checks
                                                             for, rolling
                                                             back the whole
                                                             transaction
                                                             (including the
                                                             CAS's own
                                                             accept). No
                                                             client change
                                                             needed. PUSHED
                                                             2026-09-14.
    20260914050000_cancel_invitation.sql                    — real
                                                             cancel_invitation
                                                             RPC (OWNER-only,
                                                             idempotency-keyed,
                                                             status =
                                                             'pending' CAS,
                                                             deliberately
                                                             expiry-
                                                             independent, no
                                                             Paid-tier gate),
                                                             closing
                                                             settings.md
                                                             §3.12d's last
                                                             still-mock write
                                                             in TeamScreen.tsx.
                                                             PUSHED
                                                             2026-09-14.
    20260914060000_peek_invitation_rate_limit.sql            — invitation_peek_attempts
                                                             table (otp_attempts'
                                                             own deny-by-default
                                                             RLS shape) + revokes
                                                             peek_invitation's
                                                             anon/authenticated
                                                             EXECUTE grant, closing
                                                             the direct-PostgREST
                                                             bypass around the new
                                                             peek-invitation Edge
                                                             Function's rate limit.
                                                             PUSHED 2026-09-14.
  functions/
    send-otp/index.ts                — generates + WhatsApp-sends a code
    verify-otp/index.ts              — checks a submitted code, single-use
    peek-invitation/index.ts         — IP-rate-limited front for peek_invitation
                                        (RFC 0013 §4/§7), DEPLOYED 2026-09-14
    _shared/cors.ts, _shared/otp.ts  — shared helpers (send-otp/verify-otp)
```

## Manual checklist (Product Owner — cannot be done on her behalf)

1. ~~**Create a Supabase project**~~ **DONE.** Project ref `exvzsfnwogmyxfmaffxn`.
2. **Create a Twilio account** (twilio.com) and, inside it, **register a
   WhatsApp Business Sender through Meta Business Manager** — this is
   Twilio's standard WhatsApp onboarding flow (business verification
   through Meta, not a Twilio-side approval). Note the resulting Account
   SID, Auth Token, and the approved WhatsApp sender number. **NOT YET STARTED.**
3. **Create and get approved one WhatsApp message template** via Twilio's
   Content Template Builder (or directly in Meta Business Manager) for the
   OTP message itself — e.g. "Tu código de verificación de Nahui es
   {{1}}." WhatsApp Business Platform requires an approved template for
   any business-initiated message (which every OTP send is, by
   definition — there's no prior customer message opening a session
   window). Note the resulting Content SID (`HXxxxxxxxx…`). **NOT YET STARTED.**
4. **Set the following as Supabase secrets** (`supabase secrets set
   KEY=value`, run from this folder once linked — see step 6):
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM` — the approved sender number, E.164 (e.g. `+14155238886`)
   - `TWILIO_WHATSAPP_CONTENT_SID` — the approved template's Content SID
   - `SUPABASE_URL` / `SUPABASE_SECRET_KEYS` are injected automatically by
     the Supabase platform into every deployed Edge Function — nothing to
     set manually for those two. (Corrected 2026-09-14 — this project has
     migrated to Supabase's new API key system, so the platform no longer
     injects a plain `SUPABASE_SERVICE_ROLE_KEY` string; it injects
     `SUPABASE_SECRET_KEYS`, a JSON object keyed by secret-key name. See
     the fix entry above.)
   **BLOCKED on step 2/3** (no Twilio credentials or approved template yet).
5. **Set these as build-time env vars for the prototype itself**
   (`.env.local` locally, or the hosting platform's env-var settings on
   Vercel — never committed, `*.local` is already gitignored):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (see `.env.example` in this prototype's root for the exact names.)
   ~~**DONE locally (`.env.local`)**~~ **DONE** 2026-09-13 — also set on
   the real `nahui.app` Vercel project's own env-var settings; Google/Email
   sign-in confirmed working live against the real backend as a result.
6. ~~**Link and deploy**~~ **DONE** 2026-09-12 — linked to `exvzsfnwogmyxfmaffxn`,
   `db push` applied `20260910000000_create_otp_attempts.sql`, both
   `send-otp` and `verify-otp` deployed and confirmed ACTIVE. (See
   `company/infrastructure-decisions.md` ID018 for the CLI-auth workaround
   this required — Supabase's fine-grained Personal Access Tokens 401 on
   these operations; a "legacy" full-access token, generated via the
   de-emphasized "Create legacy token" link on the same screen, is the
   working credential.)
7. **Smoke-test** `send-otp`/`verify-otp` directly (e.g. `curl` or Supabase
   Studio's function invoker) with a real phone number before trusting the
   prototype's own UI end to end. **BLOCKED on step 4** (functions are
   deployed but have no Twilio credentials to actually send through yet).
8. ~~**Push the Identity persistence layer migration**~~ **DONE** 2026-09-13 —
   `20260913000000_identity_persistence_layer.sql` applied to the real
   hosted project via `supabase db push` (same CLI-auth workaround as step
   6).
9. ~~**`reviewer`'s security pass, two rounds**~~ **DONE** 2026-09-13.
   Round 1 found 3 Important + 1 minor on the base migration (an
   over-broad `business_memberships` UPDATE policy; an inaccurate comment
   on `accept_invitation()`'s best-effort idempotency-cache write;
   `token_hash`'s hash algorithm undocumented outside one function; a
   revoked member's re-accept silently reporting success) — closed by
   `20260913010000_identity_persistence_layer_fixes.sql`. Round 2,
   re-verifying that fix, found 2 further Important findings **in the fix
   itself** (a reintroduced race condition on `accept_invitation()`'s
   membership insert; an unproven "must be revoked" claim that's actually
   false when an already-active member reopens a stale invite link) —
   closed by `20260913020000_identity_persistence_layer_fixes2.sql`. All
   three migrations applied to the real hosted project.
10. ~~**Push the Inventory persistence layer migration**~~ **DONE**
    2026-09-13 — `20260913030000_inventory_persistence_layer.sql` and its
    own-pass follow-up `20260913031000_inventory_persistence_layer_fixes.sql`
    (a `commit_lot` return-shape correction found and fixed before this
    migration was ever reviewed — see that file's own header, not a
    `reviewer` finding) applied to the real hosted project via
    `supabase db push` (same CLI-auth workaround as step 6).
11. ~~**`reviewer`'s security pass**~~ **DONE** 2026-09-13 — found 1 Blocker
    (`commitLot()`'s client wiring never preserved a stable idempotency key
    across a retry, defeating `commit_lot`'s own replay-on-conflict
    guarantee — a lost-response retry could mint a duplicate Lot/Products/
    InventoryUnits) + 2 Important findings (the FIFO index not matching
    `assign_tag_to_next_pending_unit`'s actual query shape; `products.photo`
    staying a data-URL column presented as a settled deferral rather than
    routed back through Decision Ownership against `architect`'s explicit
    Supabase Storage recommendation). Blocker closed client-side
    (`src/domain/store.tsx`/`RegisterMerchandise.tsx`/`OnboardingFlow.tsx`).
    Important findings closed by `20260913033000_inventory_persistence_layer_fixes.sql`
    (index fix + corrected column comment) — see item 13 below for its push
    status, and `context/stage-7-backend-integration.md`'s open items for
    `products.photo`'s still-open go/no-go.
12. ~~**Push the barcode-write follow-up migration**~~
    (`20260913032000_inventory_barcode_write.sql`, `decision-log.md` D65) —
    **DONE**, discovered already applied 2026-09-13 during this session's own
    Phase 2 work: `supabase migration list` shows `local`/`remote` already
    matched for this migration before this session ever ran `db push` —
    contradicting this checklist's own prior "NOT YET DONE"/sandboxed-
    credential-gap claim, which was accurate for whichever earlier, actually-
    credential-less session last edited this file, but is stale now. Not
    independently re-verified beyond the CLI's own applied-migration record
    (no live scan-a-new-barcode walkthrough run this session — that's
    `merchant-user-tester`'s/`reviewer`'s job, not this note's).
13. ~~**Push the reviewer-fix-round migration**~~
    (`20260913033000_inventory_persistence_layer_fixes.sql`, item 11's
    findings) — **DONE**, same discovery as item 12 above (`supabase
    migration list` shows this migration already applied too, before this
    session's own `db push`).
14. ~~**Push the Selling persistence layer migration**~~ **DONE** 2026-09-13
    — `20260913040000_selling_persistence_layer.sql` applied to the real
    hosted project via `supabase db push` (a working `SUPABASE_ACCESS_TOKEN`
    was available in this session — see items 12-13's own correction above:
    the "no credential in this sandboxed environment" framing was never a
    standing property of this project, only of whichever specific earlier
    session lacked one at the time).
15. ~~**`reviewer`'s security pass**~~ **DONE** 2026-09-13 — found 1 Blocker
    (`Selling.tsx`'s per-Product idempotency-key `Map` conflated "retry a
    failed tap" with "a second tap while the first is still in flight,"
    silently under-recording a Sale) + 3 Important findings (`start_session`/
    `set_price_override` never checked their `p_event_id`/`p_product_id`
    belonged to the caller's own Business; seven dead idempotency-cache
    writes reintroduced the pattern Phase 1's `assign_tag_to_next_pending_unit`
    deliberately eliminated one migration earlier; `cancel_sale`/
    `close_session` resolved their target implicitly instead of against a
    client-captured id, unlike `cancel_event`/`revoke_membership`'s own
    explicit-target precedent). Blocker closed client-side (`Selling.tsx`'s
    own `addItemPendingRef`, alongside the existing per-Product key `Map`).
    Important findings closed by
    `20260913041000_selling_persistence_layer_fixes.sql` (SQL) and
    `Selling.tsx`/`store.tsx` (client-captured `saleId`/`sessionId`
    parameters for `cancelSale`/`closeSession`).
16. ~~**Push the reviewer-fix-round migration**~~ **DONE** 2026-09-13 —
    `20260913041000_selling_persistence_layer_fixes.sql` applied to the real
    hosted project via `supabase db push` (same credential as every prior
    push this session).
17. ~~**Push the EventAssignment persistence layer migration**~~ **DONE**
    2026-09-13 — `20260913050000_event_assignment_persistence_layer.sql`
    applied to the real hosted project via `supabase db push` (same
    credential as every prior push this session).
18. **`reviewer`'s security pass** — **NOT YET DONE** for Phase 2c.
19. ~~**Push the EventAllocation/AllocationMovement persistence layer
    migration**~~ **DONE** 2026-09-13 —
    `20260913060000_event_allocation_persistence_layer.sql` applied to the
    real hosted project via `supabase db push` (same credential as every
    prior push this session).
20. ~~**Push the selling-integration extension migration**~~ **DONE**
    2026-09-13 — `20260913061000_event_allocation_selling_integration.sql`
    applied to the real hosted project via `supabase db push`.
21. ~~**Push the self-caught correctness-fix migration**~~ **DONE**
    2026-09-13 — `20260913062000_event_allocation_persistence_layer_fixes.sql`
    applied to the real hosted project via `supabase db push` — found and
    fixed in the same build session, before any `reviewer` round (see that
    migration's own header for the full defect trace: a missing "current
    custody" filter that would let a reallocated unit double-count against
    its stale source allocation).
22. ~~**`reviewer`'s security pass**~~ **DONE** for Phase 2b — found 1
    Blocker (`remove_sale_item`/`cancel_sale`'s revert-status check against
    the append-only `event_allocation_units` table permanently sticking a
    unit's status once any prior commitment to any allocation, ever
    reconciled or not, existed for it). `architect` designed the fix;
    closed by `decision-log.md` D67 +
    `20260913063000_sale_item_event_allocation_id.sql` — see item 23.
23. ~~**Push the `SaleItem.event_allocation_id` fix migration**~~ **DONE**
    2026-09-14 — `20260913063000_sale_item_event_allocation_id.sql` applied
    to the real hosted project via `supabase db push` (same credential as
    every prior push).
24. ~~**Push the `add_item_to_sale_by_tag` follow-up fix migration**~~
    **DONE** 2026-09-14 — `20260913064000_add_item_to_sale_by_tag_fix.sql`
    (`architect`-designed, D67) applied to the real hosted project via
    `supabase db push` (same credential as every prior push). Fixes a
    Blocker found already deployed in `20260913063000` above:
    `add_item_to_sale_by_tag`'s `v_alloc_id` was resolved via a decoupled
    second query that never checked `inventory_units.status`, so it could
    disagree with the disjunct that actually matched the unit and
    mis-attribute a plain-pool sale to a stale allocation. Merged into a
    single `left join lateral` query so the two can never disagree.
    `tsc -b`/`npm run build` both clean (SQL-only fix, no client change).
25. ~~**Push the Business settings persistence layer migration**~~ **DONE**
    2026-09-14 — `20260914000000_business_settings_writes.sql`
    (`architect`-designed, closing the read-side hydration wholesale-replace
    gap `reviewer` flagged as a Blocker) applied to the real hosted project
    via `supabase db push` (same credential as every prior push). Seven new
    OWNER-only RPCs, same idempotency-keyed shape as
    `update_product_price`/`update_product_photo`:
    `update_business_identity`, `acknowledge_onboarding`,
    `activate_paid_plan`, `request_downgrade_to_free`,
    `cancel_pending_subscription_tier_change`, `change_default_selling_mode`,
    `acknowledge_nfc_availability_nudge`. Client wiring complete
    (`store.tsx`'s seven corresponding write functions now call the real
    RPCs instead of a local-only mock write; call sites updated in
    `OnboardingFlow.tsx`, `BusinessIdentity.tsx`, `SettingsScreen.tsx`,
    `useNfcSessionStart.ts`). `tsc -b`/`npm run build` both clean. Not yet
    `reviewer`-verified.
26. ~~**Push the `land_pending_subscription_tier` migration**~~ **DONE**
    2026-09-14 — `20260914010000_land_pending_subscription_tier.sql`
    (`architect`-designed, an eighth RPC closing the second hydration-layer
    gap found in the same fix round as item 25) applied to the real hosted
    project via `supabase db push` (same credential as every prior push).
    OWNER-only, idempotency-keyed, same shape as
    `update_product_price`/`update_product_photo`: re-checks the landing
    condition (`pending_subscription_tier_effective_date <= current_date`
    and `pending_subscription_tier is not null`) server-side and, if met,
    atomically flips `subscription_tier` and clears the pending triple in
    one `update` — a harmless no-op otherwise. Client:
    `reconcilePendingSubscriptionTier` (`store.tsx`) now calls this real RPC
    in the background and `applyWriteMirror`s the flip on success, instead
    of the two plain `setState` calls it used before; `TodoListo.tsx`'s
    "Entrar" tap also gained a `saving`/error-with-retry state
    (`BusinessIdentity.tsx`'s own §3.10a shape), since the
    `acknowledgeOnboarding` RPC it fires can now genuinely fail. `tsc -b`/
    `npm run build` both clean. Not yet `reviewer`-verified.
27. ~~**Push the `land_pending_subscription_tier` return-type fix
    migration**~~ **DONE** 2026-09-14 —
    `20260914020000_land_pending_subscription_tier_fix.sql` applied to the
    real hosted project via `supabase db push`. Closes a real Blocker
    `reviewer` found in item 26's own RPC: it returned `void`, so
    `reconcilePendingSubscriptionTier` (`store.tsx`) could not tell "my call
    actually landed the change" apart from "my call was a harmless no-op
    because a concurrent `cancel_pending_subscription_tier_change` call
    already won the race" — on any non-error response it unconditionally
    applied its own pre-captured tier/effectiveDate to the local mirror, a
    false-positive about the merchant's own subscription if the cancel
    actually won. The RPC now `returns boolean` (auth/idempotency-key logic
    unchanged; the old `void` signature is dropped first, since Postgres
    won't let `create or replace function` change a return type) — `true`
    only when its conditional `update` actually matched a row. Client:
    `reconcilePendingSubscriptionTier` now destructures `data` alongside
    `error` from the RPC response and only `applyWriteMirror`s the flip when
    `data === true`; a `false` no-op leaves local state untouched, since the
    next Configuración mount will re-detect whatever the real state actually
    is. Also corrected two stale doc comments found in the same pass:
    `completeOnboarding`'s doc comment describing `setBusinessIdentity` as
    "still a local-only mock write" (untrue since item 25), and
    `reconcilePendingSubscriptionTier`'s own doc comment claiming hydration
    also retries a failed land (it doesn't — only the next Configuración
    mount does). `tsc -b`/`npm run build` both clean. Not yet
    `reviewer`-verified.
28. **UI-layer fix, no migration** — `reviewer`-found Blocker, the fifth in
    this same hydration-layer area across five review rounds. Item 27 fixed
    `reconcilePendingSubscriptionTier`'s (`store.tsx`) own domain-state write
    to gate on the RPC's real `data === true` outcome, but never touched
    `SettingsScreen.tsx`'s separate local `landed` state, which drives the
    "Tu plan cambió a {tier} el {date}" banner (settings.md §2.4) and was
    still set unconditionally off the function's synchronous, optimistic
    `justLanded` return — before the real RPC outcome was known. If that
    outcome later resolved `false` (a concurrent "Cancelar cambio pendiente"
    tap winning the race, or a failed network call — realistic given the
    target merchants' bazaar connectivity), the banner kept falsely claiming
    a change that never happened, for the rest of that screen visit. Fix:
    `reconcilePendingSubscriptionTier` now takes an optional
    `onSettled?: (landed: boolean) => void`, called with `true` in the same
    branch that applies `applyWriteMirror` and with `false` in both the
    no-op branch and the error branch (existing `console.error` logging
    untouched). `SettingsScreen.tsx`'s call site passes
    `(landed) => { if (!landed) setLanded(null); }`, preserving the
    documented same-mount optimistic render for the common (`true`) case
    while self-correcting within the round-trip window otherwise. No SQL/RPC
    change — pure client-side fix. `tsc -b`/`npm run build` both clean. Not
    yet `reviewer`-verified.
29. ~~**Push the `invitation_token_no_raw_cache` migration**~~ **DONE**
    2026-09-14 — `20260914032000_invitation_token_no_raw_cache.sql` applied
    to the real hosted project via `supabase db push`. Closes an
    `architect`-found Blocker in item 25's/26's sibling migration
    (`20260914030000`): `create_invitation`/`regenerate_invitation` both
    cached the raw invitation token in `idempotency_keys.result` so a
    dropped-response retry could recover it, framed at the time as a
    "deliberate, narrow exception." `architect` found that framing wrong
    against RFC 0013/D64's actual threat model (a full DB dump/leak, not an
    application-layer RLS bypass — RLS never made the cache safe against a
    dump). Fix, in a new additive migration (existing convention — never
    editing an already-deployed migration in place): both functions
    `create or replace`d to stop caching the raw token in
    `idempotency_keys.result` at all (only `invitation_id`/`expires_at` now)
    — a replay returns `token: null`, proof of completion but not the
    secret. `regenerate_invitation`'s precondition loosened from "genuinely
    expired" to "still `pending`" (error renamed
    `invitation_not_expired` → `invitation_not_pending`), making it the
    legitimate recovery path for a lost `create_invitation` response — the
    Approved UI is unaffected, `settings.md` §3.11's `[ Generar otra ]`
    button stays gated to expired rows only; only the backend precondition
    loosened. The Paid-tier re-check landed in item 27
    (`20260914031000_invitation_token_write_path_fix.sql`) was preserved,
    not regressed, since this `create or replace` was written from that
    migration's version, not the original. Client: `store.tsx`'s
    `createInvitation`/`regenerateInvitation` return types corrected to
    `token: string | null` (both the `StoreValue` interface and the
    implementations' own row casts), matching that a replay now genuinely
    returns no token; doc comments updated to describe the null-on-replay
    case and the fallback to `regenerateInvitation`. `peek_invitation` and
    `_generate_invitation_token` untouched. `tsc -b`/`npm run build` both
    clean except `TeamScreen.tsx`/`InvitationFlow.tsx` (expected — same two
    screens item 25's entry above already named as a separate, not-yet-run
    `ui-designer` rebuild). Not yet `reviewer`-verified.
30. ~~**Push the `accept_invitation_membership_conflict_fix` migration**~~
    **DONE** 2026-09-14 —
    `20260914040000_accept_invitation_membership_conflict_fix.sql` applied
    to the real hosted project via `supabase db push`. Closes an
    `architect`-found Blocker in the original `20260913000000`
    `accept_invitation`: `already_member`/`membership_revoked` (RFC 0013/
    D64, `authentication.md` §2.2a, `store.tsx`'s `acceptInvitation`) were
    never actually raised — a pre-existing `BusinessMembership` row (active
    OR revoked) for `(user_id, business_id)` made the membership `insert
    ... on conflict do nothing` silently no-op, and the fallback `select`
    then returned that row's id as an ordinary success. Fix: on conflict,
    look up the pre-existing row's own `status` and raise the exact
    exception name `store.tsx` already hard-codes a string match against
    (`membership_revoked` if `status = 'revoked'`, `already_member`
    otherwise), instead of silently returning success — both branches
    abort the whole transaction, rolling back the CAS's own `status =
    'accepted'` update, so the Invitation stays exactly `pending`. No
    client-side change needed (`store.tsx`'s `acceptInvitation` already
    checked for both error strings; `InvitationFlow.tsx`'s §3.10d/§3.10e
    screens were already built and correctly routed). `tsc -b`/
    `npm run build` both clean. See
    `context/team-invitations-real-wiring.md` for the full detail,
    including a separate, out-of-scope open item found along the way (the
    `idempotency_keys` cached-error-replay branch is structurally
    unreachable for the same rollback reason, in this function and its
    `regenerate_invitation` twin).
31. ~~**Push the `cancel_invitation` migration**~~ **DONE** 2026-09-14 —
    `20260914050000_cancel_invitation.sql` applied to the real hosted
    project via `supabase db push`. `architect`-designed: real
    `cancel_invitation` RPC (OWNER-only re-checked server-side,
    idempotency-keyed, `status = 'pending'` CAS — deliberately
    expiry-independent, matching `regenerate_invitation`'s own final
    precondition, since `settings.md` §3.11 hides the "Cancelar" button on
    an expired row for UX reasons only, not a domain rule; deliberately no
    Paid-tier gate, since closing an existing exposure should never strand
    a downgraded OWNER). Closes `settings.md` §3.12d — `TeamScreen.tsx`'s
    cancel-confirm sheet was already fully built, calling a local-mock
    `cancelInvitation` that couldn't fail. Client: `store.tsx`'s
    `cancelInvitation` rewritten as a real `async` RPC call matching
    `acceptInvitation`'s own conventions; `TeamScreen.tsx`'s
    `handleConfirmCancel` updated to `await` it and route a real failure
    into the screen's own already-built `cancel-error` state. `tsc -b`/
    `npm run build` both clean. Not yet `reviewer`-verified.
32. ~~**Push the `peek_invitation_rate_limit` migration and deploy
    `peek-invitation`**~~ **DONE** 2026-09-14 —
    `20260914060000_peek_invitation_rate_limit.sql` applied via
    `supabase db push`; `peek-invitation` deployed via
    `supabase functions deploy peek-invitation` (no `--no-verify-jwt`,
    confirmed `verify_jwt: true` via `supabase functions list`, matching
    `send-otp`/`verify-otp`). `architect`-designed: closes RFC 0013 §4/§7's
    token-enumeration surface on `peek_invitation` — see the narrative entry
    above for full detail. **NOT LIVE-TESTED end to end** (item 7's own
    caveat applies here too — this environment can't invoke the deployed
    function to verify `x-forwarded-for` behavior live). `tsc -b`/
    `npm run build` both clean. Not yet `reviewer`-verified.
33. ~~**Fix and redeploy all three Edge Functions against the new API key
    system**~~ **DONE** 2026-09-14 — see the narrative entry above for full
    detail. All three (`send-otp`/`verify-otp`/`peek-invitation`) confirmed
    `ACTIVE` at version 2 via `supabase functions list`. Not independently
    live-invoked this pass (left to the Product Owner). `send-otp` remains
    blocked on step 4 below (no Twilio secrets exist yet) even after this
    fix.
34. **Push the `d79_nfc_composable_selling` migration** — **NOT YET
    PUSHED, no working `SUPABASE_ACCESS_TOKEN`/CLI login in this
    environment.** `20260918030000_d79_nfc_composable_selling.sql`
    (`decision-log.md` D79, `product/99-rfc/0017-nfc-composable-selling-
    capability.md`): drops `start_session`'s 3-arg signature
    (`p_operating_mode` required) and replaces it with a 2-arg version
    (`p_business_id`, `p_event_id`); gives `sessions.operating_mode` a
    database-level default (`'buttons'`); removes `add_item_to_sale`'s
    `wrong_operating_mode` rejection and `add_item_to_sale_by_tag`'s
    `operating_mode <> 'nfc'`-driven `no_match` rejection — both were the
    real server-side enforcement of the exclusive Session-mode split D79
    retires. **Critical deployment-ordering risk, not merely a "nice to
    push eventually" item:** the client (`store.tsx`'s `startSession`)
    already calls the 2-arg `start_session` RPC as of this same pass — until
    this migration is applied, "Iniciar Venta Rápida"/"Continuar Día N" will
    fail outright against the live database, because the currently-deployed
    3-arg function has no default for `p_operating_mode`. This migration
    must be pushed before (or atomically with) this client code reaching
    production, not as a follow-up. Once pushed, this is also the fix that
    makes the Product Owner's own reported scenario work (tag a unit
    mid-Session, "Leer con NFC" appears immediately, no close/reopen) — the
    client-side gate fix alone (`Selling.tsx`'s `showNfcOverlayEntry`)
    isn't sufficient by itself, since `add_item_to_sale_by_tag` would still
    reject the scan server-side without this migration.

## Judgment calls made building this (tune freely, not escalated)

- **OTP expiry: 10 minutes.** `supabase/functions/_shared/otp.ts`'s
  `OTP_EXPIRY_MINUTES`.
- **Send rate limit: 5 codes/phone/hour.** `SEND_RATE_LIMIT_PER_HOUR`,
  enforced server-side in `send-otp` (the existing 30-second client-side
  "Reenviar en 0:30" cooldown in `CodeStep.tsx` is a UX pacing detail only,
  not a security control).
- **Verify lockout: 5 wrong guesses per issued code.**
  `VERIFY_MAX_ATTEMPTS`, enforced in `verify-otp` — a fresh code (a new
  "Reenviar código") resets the count, since it's a new row.
- **`peek-invitation` rate limit: 20 peek attempts/IP/10 minutes.**
  `PEEK_RATE_LIMIT_PER_10_MIN` in `peek-invitation/index.ts` — generous
  enough that a merchant/customer legitimately retrying a slow-loading
  invite link never trips it, tight enough to stop a scripted enumeration
  sweep against `peek_invitation`'s 256-bit token space (the token's own
  entropy already makes guessing infeasible either way; this bound exists
  to stop the sweep pattern itself, not to compensate for a weak token).
- **Idempotency key for `verify-otp`** is the phone+code pair itself
  rather than a separately generated key: a retry of the same already-
  consumed pair replays the original success outcome instead of
  re-running the consume write, satisfying `architecture-principles.md`
  #7 without a synthetic key field — see the doc comment in
  `functions/verify-otp/index.ts`.
- **WhatsApp delivery uses Twilio's Content API template send**
  (`ContentSid`/`ContentVariables`), not a plain-text `Body` — required
  because an OTP is always a business-initiated message, which WhatsApp
  Business Platform only allows through an approved template. This is why
  step 3 above (template creation/approval) exists as its own checklist
  item rather than being skippable.
- **`auth_identities` (email/google/apple) is populated by a trigger on
  `auth.identities`, not a client-side upsert.** A trigger can't be silently
  skipped by a missed call site the way a client upsert could — one
  mechanism handles every native-auth provider identically. `phone` stays
  populated by the `verify-otp` Edge Function (service-role key), unchanged.
- **`auth_identities` has no client-writable INSERT/UPDATE/DELETE policy at
  all**, despite the dispatch's own "a user can only read/write their own
  rows" framing — a genuine, deliberate deviation. Allowing an authenticated
  client to insert her own `type='phone'` row would let her claim someone
  else's number as a "verified" identity without ever proving it via OTP.
  Writes happen exclusively through the trigger above or the service-role
  Edge Function, both of which bypass RLS by construction; read access
  (`user_id = auth.uid()`) is all any client role needs or gets.
- **`is_active_member_of`/`is_active_owner_of` — two small SECURITY DEFINER
  helper functions**, used inside the `businesses`/`business_memberships`/
  `invitations` RLS policies. Without them, `business_memberships`' own
  SELECT policy would need to query `business_memberships` from inside its
  own USING clause, which re-triggers that table's RLS recursively for every
  authenticated caller who isn't just reading her own row — the standard,
  documented Supabase pattern for avoiding this is a SECURITY DEFINER helper
  (bypasses RLS internally, since it executes as the function owner).
- **`createInvitation`/`acceptInvitation`/`declineInvitation` are NOT wired
  to `invitations`/`accept_invitation` in this pass**, despite being named in
  the dispatch. The running prototype's `Invitation` domain type/UI
  (`types.ts`, `TeamScreen.tsx`, `InvitationFlow.tsx`) is still built against
  the phone-keyed design RFC 0013/D64 superseded — it collects a phone
  number, has no screen to show a generated link/token, and has no field to
  display a phone-addressed pending row once phone is no longer a column on
  `invitations` at all. Wiring these functions to the real, token-keyed
  schema without that UI rework would mean either silently building a
  feature the invited person could never actually reach (no link is ever
  shown to share), or inventing UI/UX decisions that aren't this dispatch's
  to make. RFC 0013 §"What it touches" already names this exact gap
  explicitly ("this code gets its own Migration-Workflow pass... not
  designed here") — flagged here as the same still-open gap, not a new one.
  The migration SQL/RLS/RPC for `invitations` are built and correct
  regardless; only the client wiring for these three functions is deferred.

## Judgment calls made building the Inventory persistence layer (Phase 1)

- **`suppliers`/`lots`/`inventory_entries` get OWNER-only SELECT; `products`/
  `inventory_units`/`nfc_tags` get any-active-member SELECT.** `architect`'s
  own design summary named the second group explicitly (matching the
  confirmed Q24/Q25 permission table's "SELLER: read sellable Products/
  prices, ungated" plus Selling's own read-only tag→unit resolution
  dependency on `nfc_tags`); the first group wasn't explicitly named, but
  follows the same permission table's "OWNER: ... Lot receiving/tagging" by
  direct inference — a SELLER never needs to read receiving-workflow
  bookkeeping to do her own job (open her Session, register a Sale).
- **No client INSERT/UPDATE/DELETE grant on any of the six tables, at all.**
  Every write goes through one of the four SECURITY DEFINER RPCs — matches
  `products`/`inventory_units`/`nfc_tags`'s own comment on the base
  migration ("no direct client... grant... every write goes through the
  SECURITY DEFINER RPCs below") and Phase 0's own `businesses`/
  `business_memberships` precedent.
- **`update_product_price`/`update_product_photo` are idempotency-keyed but
  have no cached-result replay branch**, unlike `commit_lot`/
  `accept_invitation`. A plain single-column `UPDATE` has no duplicate-
  creation side effect to guard against — re-applying the identical value on
  a retry is harmless — so the idempotency_keys row is written for audit-
  trail consistency, but the actual retry-safety comes from the write's own
  natural idempotence, not a stored/replayed result. See each function's own
  header comment.
- **`assign_tag_to_next_pending_unit` raises named exceptions
  (`tag_already_assigned`/`tag_queue_empty`) rather than returning a
  discriminated result row** — matches `accept_invitation`'s own established
  convention (Phase 0) over a table-returning discriminated union; the
  client matches on `error.message`. Neither failure branch attempts an
  idempotency-key cache write before raising, applying Phase 0's own fix-
  round-1 lesson (`20260913010000_identity_persistence_layer_fixes.sql`)
  from the start rather than repeating and later re-fixing the same mistake:
  such a write never survives the `RAISE EXCEPTION` that follows it in the
  same transaction, so a retry simply re-derives the identical outcome by
  re-running the same checks.
- **`commit_lot`'s return shape was corrected before this migration was ever
  reviewed** (`20260913031000_inventory_persistence_layer_fixes.sql`, applied
  as a new migration rather than editing the already-live base file — same
  "never edit an applied migration" discipline Phase 0's own fix migrations
  established) — from `product_id` alone to `(product_id, lot_id,
  unit_ids)` per input line. The client's local `AppState` mirror needs the
  real, server-assigned `InventoryUnit` ids, not locally-fabricated ones, so
  a later `assign_tag_to_next_pending_unit` result can be recognized back
  against `state.units` — see that migration file's own header for the full
  reasoning.
- **`products.photo` stays a plain nullable `text` column**, storage-
  mechanism-agnostic — the client still writes a data-URL string into it
  directly, unchanged from the mock's own shape. **Corrected 2026-09-13
  (`reviewer` finding, closed by `20260913033000_inventory_persistence_layer_fixes.sql`):**
  this was presented above as if it were a settled, disclosed-and-done
  deferral per `architect`'s own open item 2 — it isn't. `architect`
  explicitly recommended real Supabase Storage (a bucket + this column
  holding a path/URL) instead, citing real costs (row bloat, no CDN,
  Postgres text-column limits under load) given `Product.photo`/D54 is
  already live and merchant-facing for 2 real pilot merchants; keeping the
  data-URL shape was a real deviation from that recommendation, made
  unilaterally rather than routed back for reconfirmation. Now tracked
  honestly as **provisionally deferred, pending architect reconfirmation** —
  see `context/stage-7-backend-integration.md`'s open items list. Building
  real Supabase Storage wiring itself remains separate, unscoped work either
  way.
- **`Product.active` (`product-decisions.md` Q21) is not in this schema at
  all** — `architect`'s own Architecture Decision (not this pass's call):
  Q21 was never promoted into the Foundation (no decision-log entry, no
  `domain-model.md` update, no UX spec), so it doesn't belong in a permanent
  table yet.

## Judgment calls made building the Selling persistence layer (Phase 2)

- **`caller_membership_id(business_id)` — a new SECURITY DEFINER RLS helper**,
  same STABLE/bypasses-RLS-internally shape as Phase 0's
  `is_active_member_of`/`is_active_owner_of`. Every RPC that needs "this
  device's own acting Membership" resolves it through this, from `auth.uid()`
  alone, rather than accepting a client-supplied membership id parameter —
  the same "never trust the client for an authorization-relevant identity"
  posture every other SECURITY DEFINER function in this file family already
  holds. This also simplified every Phase 2 RPC's own signature: none of them
  takes a membership or session id as a parameter at all — `add_item_to_sale`,
  for instance, only needs `(business_id, product_id, idempotency_key)`.
- **`add_item_to_sale`/`add_item_to_sale_by_tag` perform plain Business-wide
  FIFO/tag-lookup only — `EventAllocation`-aware selection is not built
  here**, per this phase's own explicit scope boundary (confirmed out of
  scope three independent ways, `context/stage-7-backend-
  integration.md`'s Phase 2 design summary). `store.tsx`'s own client-side
  `addItemToSale`/`addItemToSaleByTag` previously drew their sellable
  candidate from an open `EventAllocation`'s own committed pool when one
  existed (RFC 0010/D59, a purely local-only mechanism — Phase 1 never gave
  `inventory_units` a real write path for that reservation either). That
  branch is removed from the write path entirely in this pass, not merely
  left unwired: the real RPC has no way to accept or honor a client-chosen
  unit id (the FIFO/tag pick is resolved entirely server-side, atomically),
  so keeping the old branch would either require building Phase 2b's own
  compare-and-swap now (explicitly out of scope) or silently diverge from
  what the server actually sells. `EventAllocation`'s own "Para este evento"
  bookkeeping (`commitAllocation`/`releaseAllocation`/`saveEventAllocations`,
  the Events screens that read it) is untouched and still fully local — a
  display/planning-only concept until Phase 2b actually builds the real
  reservation it's meant to describe.
- **`start_session`'s `operating_mode` is resolved client-side, not
  re-derived server-side from `NFC_READINESS_THRESHOLD`.** The threshold
  itself is a disclosed, non-security-sensitive heuristic
  (`selectors.ts`'s own comment: "a configurable product/business rule, not
  hard-coded into the Foundation"), and duplicating it across two
  independently-maintained layers risks drift for no real security benefit.
  The one boundary the RPC does re-check, defensively, server-side: `'nfc'`
  is only ever a legitimate resolution for a Paid-tier Business
  (`decision-log.md` D27) — a client that somehow sent `'nfc'` for a
  Free-tier Business is silently corrected to `'buttons'`, never trusted.
- **`Sale.status`'s closed set stays two values (`'open' | 'finalized'`), not
  three.** `cancel_sale` is a plain `DELETE` (cascading to `sale_items`), not
  a third `'cancelled'` status — matches `types.ts`'s own `Sale` interface
  and `store.tsx`'s pre-Phase-2 `cancelSale()`, which already removed the row
  outright rather than soft-cancelling it.
- **`removeSaleItem`/`cancelSale`'s server-side unit revert is plain
  `reserved -> available`**, same scope boundary as `add_item_to_sale`
  above — RFC 0010/D59's own "still genuinely committed to an open
  EventAllocation, revert to `reserved` instead" distinction
  (`saleCancelRevertStatus`, `selectors.ts`) is no longer consulted by
  either write path. That selector itself is untouched (still used
  elsewhere) — simply no longer called from these two now-real writes.
- **`add_item_to_sale`'s idempotency key is a per-Product ref in
  `Selling.tsx` (a `Map<productId, key>`), not a single shared ref** — unlike
  `RegisterMerchandise.tsx`'s single `commitIdempotencyKeyRef` (one draft,
  one Save button, one attempt in flight at a time), Selling's grid can have
  a distinct, independent "add this Product" attempt in flight or
  failed-and-awaiting-retry for more than one tile at once; a single shared
  ref would incorrectly let a different Product's retry replay a stale key
  minted for an unrelated Product's own failed attempt.
- **`add_item_to_sale_by_tag` and `assign_tag_to_next_pending_unit` (Phase 1)
  share the same "fresh key per scan, not reused across separate scans"
  idempotency shape** — a distinct physical scan is a genuinely new logical
  attempt, never a retry of a prior one, unlike a tile tap's own
  same-Product-retry semantics above.
- **`NuevoEvento.tsx`'s "Reintentar" retry state, previously disclosed as
  not-organically-reachable ("`createEvent` always succeeds now"), is
  genuinely wired now** — `createEvent` is a real, awaitable RPC call that
  can actually fail (a network drop, a platform error), so that branch's own
  retry affordance is no longer a disclosed-but-dead UI state.
- **`EventDetail.tsx`'s `handleContinue` awaits `startSession` before
  navigating to Home**, unlike `HomeScreen.tsx`'s own two `startSession`
  call sites (fire-and-forget, since neither explicitly navigates on the
  strength of the call's own local return) — without awaiting here, Home
  would briefly re-render with no active Session before the RPC's response
  lands, since the previous client-side-only write updated `AppState`
  synchronously and this one no longer can.

## Judgment calls made in the Phase 2 `reviewer` fix round

- **The Blocker fix (`Selling.tsx`'s `addItemPendingRef`) stays handler-side
  only, not a new `ProductTile` visual pending state.** The finding's own
  text names both "disable/ignore taps on that specific tile" and "a brief
  tile-level pending state" as valid shapes, defaulting to the former as
  simplest. A second tap on a Product with an outstanding add is now
  ignored outright by `handleAddItem` itself (shared by both the grid-tap
  and barcode-scan call sites) — no `ProductTile.tsx` change was needed,
  the same "ignore, no new UI state" posture `saving` already holds for
  `close_session` elsewhere in this file.
- **`cancel_sale`/`close_session` gained a new required parameter
  (`p_sale_id`/`p_session_id`) rather than keeping the old signature and
  adding an optional one.** Both RPCs are re-derivable from `auth.uid()`
  alone today (exactly one open Sale/active Session can ever exist per
  Membership), so an optional parameter would have left the implicit-
  resolution bug reachable by omission. Both old single-parameter functions
  are dropped outright in the fix migration, forcing every call site
  (`Selling.tsx`'s only two) to supply the explicit target.

## Judgment calls made building the EventAssignment persistence layer (Phase 2c)

- **`removeEventAssignment` (`store.tsx`) changed signature from a single
  local `EventAssignment.id` to the same `(businessId, eventId,
  membershipId)` triple `createEventAssignment` already takes** — a real
  shape change, not cosmetic. `unassign_from_event` resolves its target row
  by the table's own `(event_id, membership_id)` uniqueness, the same way
  the RPC itself never needed a server-generated id handed back to the
  client for `assign_to_event` to remain idempotent — there was no honest
  reason to keep threading a client-remembered local id through the RPC
  boundary once the server stopped needing it. `PersonalParaEsteEvento.tsx`'s
  `handleUnassign` simplified accordingly — it no longer needs to look up
  the `EventAssignment` row first just to extract its `id`.
- **Both RPCs raise a named exception (`event_not_found`/
  `membership_not_found`) rather than silently no-op on a failed ownership
  check**, matching `start_session`/`set_price_override`'s established
  precedent for a write that mints/targets a row by a client-supplied
  foreign id, not `revoke_membership`/`cancel_event`'s own "no-op via
  WHERE-scoping" shape (which applies to a write with no separate foreign-id
  validity question — the row it targets is already fully identified by the
  primary key/caller-identity it resolves against). `revoke_membership` is
  cited by this migration's own header only for its "no idempotency key
  needed" precedent, not for its error-reporting shape.
- **`unassign_from_event` re-checks `membership_id` is still `active`
  before deleting, per the design summary's own instruction, even though
  this makes it impossible to unassign a Membership after it's been
  revoked.** Consistent with the design's own explicitly-named open item
  (orphaned `event_assignments` rows after a revocation) staying
  unresolved rather than silently half-addressed here — the live UI can
  never actually trigger this case anyway (the roster only ever lists
  active SELLER Memberships, so a row shown as assigned already implies
  `active` at render time).
- **`PersonalParaEsteEvento.tsx`'s per-row `runWrite` error state is now
  genuinely reachable, matching `NuevoEvento.tsx`'s own "no longer
  disclosed-not-wired" correction above** — the artificial `SAVE_DELAY_MS`
  timeout this screen used before backend integration is removed outright;
  the real network round trip now provides whatever perceived latency the
  `saving`/`slow` states exist to communicate.

## Identity-reconciliation fix — real Supabase `auth.users.id` vs. local mock ids (2026-09-14)

**The bug, found live, blocking the Product Owner's own production testing.**
The client app minted its own local mock `User`/`currentUserId` ids
(`makeId('user')`) for every sign-in channel, and nothing ever reconciled
those against Supabase's own real `auth.users.id` — the id every real
backend row (`business_memberships.user_id`, etc.) is actually keyed on for
the email/Google channels (both native Supabase Auth). A fresh sign-in on a
cleared browser, or a genuinely new device, minted a fresh local mock id that
could never match the real UUID her already-hydrated backend data (Business,
Membership) was tied to — the device looked like a brand-new merchant with
no Business at all, even though her real account and data existed and were
correct server-side.

A second, independent gap compounded this: nothing on app mount checked
whether Supabase's own client already held a valid, non-expired session in
`localStorage` that this app's own `AppState.currentUserId` had simply
forgotten about (confirmed live — exactly this state was observed). The app
showed the fresh-login screen instead of silently resuming the session it
already had.

**The fix (`src/domain/authProviders.ts`, `src/domain/store.tsx`,
`src/AppRouter.tsx`):**
- The email-verification (`verifyEmailCode`) and Google (`resolveGoogleSession`)
  channels now each surface the real Supabase `userId` (`data.user.id`/
  `session.user.id`) alongside their existing identifier fields.
- `resolveAuthIdentity`'s `'new-user'` branch now mints a brand-new `User`
  under that real id (`realUserId ?? makeId('user')`) instead of always
  fabricating one — for email and Google, the two channels that produce a
  real Supabase session. The phone/WhatsApp channel still passes `null` here
  and keeps minting a local id, unchanged — phone identities are minted
  entirely outside Supabase's own native auth (custom Twilio Edge Functions)
  and never produce a real Supabase session; a known, separate,
  already-disclosed gap (phone sign-up cannot complete real Onboarding today
  regardless of this fix), not addressed by this dispatch.
- `StoreProvider` gained a new mount-only session-restore effect
  (`sessionRestoreStatus: 'checking' | 'done'`) that calls
  `supabase.auth.getSession()` once and, if a live session is found that
  `AppState` doesn't know about, adopts it (`currentUserId` set to the real
  `auth.users.id`, reusing an already-known local `User` row if one matches,
  minting one under the real id otherwise). `AppRouter.tsx` gates its
  `!authenticated` branch on this alongside `hydrationStatus`, reusing the
  existing `AuthResolving` loading convention, so a device with a real
  session about to be found doesn't flash the login screen for the duration
  of that one round-trip.
- `signOut()` and `retractMistypedVerification()` now also call the real
  `supabase.auth.signOut()`, not just clear the local `currentUserId` — without
  this, the new mount-time restore effect would silently resurrect the exact
  session she just explicitly left, on her very next reload.

**No server-side data migration was made or needed** — the real database
data was always correct; this was a pure client-side identity-resolution
correction.

**Action required, once this lands: the Product Owner's own already-open
browser session needs a full local-storage clear + fresh sign-in.** Signing
out and back in again is *not* sufficient — her existing local session holds
a stale, wrong-id `AuthIdentity` row minted under the old local-mock-id
mechanism, and `AuthIdentity.userId` is immutable once created (per its own
domain invariant), so it will keep resolving to the wrong id even after a
sign-out/sign-in cycle on the same browser storage. A full local-storage
clear is the only correct remediation for that one already-affected session
— every fresh sign-in afterward, on any device, is unaffected and resolves
correctly under this fix.

Not committed/deployed as part of this pass — flagged for review given how
central this logic is and that it was actively blocking live production
testing.

**`reviewer` fix round (2026-09-14) — one Blocker, one Important finding, both closed.**

- **Blocker — sign-out ordering race.** `signOut()`/`retractMistypedVerification()`
  called `void supabase.auth.signOut()` without awaiting it, then immediately
  cleared local `currentUserId`. Verified against the actual installed
  `@supabase/auth-js` source (`node_modules/@supabase/auth-js/dist/main/GoTrueClient.js`'s
  own `_signOut`): it performs a real server-side revoke round-trip *before*
  clearing the session from `localStorage`, not synchronously — so there was
  a real window, the full network round-trip, where local `currentUserId`
  was already `null` while Supabase's own session was still live in storage.
  A reload in that window (an ordinary mobile occurrence — backgrounding/
  reclaiming a tab, pull-to-refresh) would let the new session-restore effect
  above silently resurrect the session she'd just signed out of; for
  `retractMistypedVerification()` specifically, the resurrected session would
  go through the mount-effect's synthetic-`User` branch, which hardcodes
  `phoneMismatchConfirmationPending: false` — bypassing the §3.7e safety
  confirmation for the exact identity she'd just rejected via "No, elegir
  otro." **Fixed:** both functions are now `async` and genuinely `await`
  `supabase.auth.signOut()` (wrapped in try/catch, logged on failure, local
  state cleared either way) before clearing local state. `StoreValue`'s own
  interface signatures were updated to `Promise<void>`; every call site
  (`SellerAccountScreen.tsx`, `SettingsScreen.tsx`, `AppRouter.tsx`,
  `InvitationFlow.tsx`) was checked and confirmed fine as an explicit
  `void`-prefixed fire-and-forget call — none of them read state after
  calling, they all rely on the existing reactive fall-through once
  `currentUserId` actually clears.
- **Important — mount-time session-restore effect had no error handling.**
  The `getSession()` call inside the mount-only session-restore effect
  wasn't wrapped in try/catch, unlike every other Supabase call in this
  codebase (`authProviders.ts`'s `sendEmailCode`/`verifyEmailCode`/
  `signInWithGoogle`/`resolveGoogleSession` all fail closed) — a thrown
  exception would have left `sessionRestoreStatus` stuck at `'checking'`
  forever, with `AppRouter.tsx`'s loading gate showing no retry path at all.
  **Fixed:** the check is now factored into a reusable `runSessionRestoreCheck`
  function, wrapped in try/catch; `sessionRestoreStatus`'s type widened to
  `'checking' | 'done' | 'error'`. `AppRouter.tsx`'s session-restore branch
  now passes `status={sessionRestoreStatus === 'error' ? 'error' : 'loading'}`
  (matching the existing pattern the hydration-status branch already uses)
  and a real `onRetry` (`retrySessionRestore`, a new `StoreValue` member that
  re-runs the same check) instead of hardcoding `"loading"` and reusing
  `retryHydration` — a genuinely different check, on a genuinely different
  status, now with its own retry path.

Also corrected roughly a dozen stray comments across `authProviders.ts`/
`store.tsx` that cited "the identity-reconciliation fix, `decision-log.md`"
as if a numbered decision-log entry existed for it — it doesn't; no RFC or
decision-log entry was ever warranted for this fix (`architect`'s own
original design report). They now cite `context/stage-7-backend-integration.md`
instead, where the actual working note for this fix lives.

`npm run build` (`tsc -b && vite build`) verified clean after all of the
above. Not committed/deployed — handed back for final verification.

**Three real Blockers found live, same class as `start_session`'s own fix above, found by the Product Owner's own live production testing plus a `merchant-user-tester` walkthrough of that same authenticated session (2026-09-15).** All three are the identical PL/pgSQL gotcha (a `RETURNS TABLE` output-parameter name colliding with a real table column, referenced bare somewhere in the function body — not only in `RETURNING`/`SELECT INTO`, as first assumed; two of these three were in ordinary `WHERE`/`UPDATE SET` clauses instead), confirmed by actually calling each function from the Product Owner's own real authenticated browser session (not read, not assumed):

- **`finalize_sale`** ("Finalizar Venta" — the single most consequential action in the app) — `{"code":"42702","message":"column reference \"sale_id\" is ambiguous"}`, in two `WHERE sale_id = ...` clauses against `sale_items` that never qualified the table name. Fixed: `20260915040000_finalize_sale_column_ambiguity_fix.sql`. Confirmed live afterward: a real sale finalized successfully (`Hoy: $10 · 1 venta`).
- **`cancel_invitation`** ("Cancelar invitación" in Configuración → Tu equipo) — `{"code":"42702","message":"column reference \"status\" is ambiguous"}`, in the `UPDATE ... WHERE status = 'pending'` clause. Fixed: `20260915050000_cancel_invitation_column_ambiguity_fix.sql`. Confirmed live afterward against the real invitation `merchant-user-tester`'s own walkthrough had left stuck pending — it cancelled successfully.
- A parallel dispatch to systematically re-check all ~21 `RETURNS TABLE` functions for the same pattern, this time via actual `BEGIN`/`ROLLBACK` execution rather than a code read, was **blocked** — the dispatched `builder` instance had no `SUPABASE_ACCESS_TOKEN` in its own sandboxed environment, and correctly refused to search for one (the sandbox's own permission system blocked both attempts, as intended). Its fallback static-only audit found no *new* instance of the bug across the other ~18 functions, but explicitly disclosed that a static read is exactly the kind of check that already missed this bug three times — not proof of correctness. **Main then ran the actual execution-verification pass directly** (holding the real token in its own session), via `BEGIN ... SET LOCAL request.jwt.claims = '{"sub":"<real-user-id>","role":"authenticated"}'; SET LOCAL role authenticated; ... ROLLBACK` against the real hosted project — confirmed clean, by real execution, not just a read: `create_event`, `update_product_price`, `update_product_photo`, `assign_to_event`, `unassign_from_event`, `regenerate_invitation`, `accept_invitation`. `close_session` was read-confirmed to have no `RETURNS TABLE` (so no exposure to this specific bug class) but deliberately not executed, since doing so would have closed the Product Owner's own live active Session mid-testing. `add_item_to_sale_by_tag` and the `event_allocation` family remain execution-unverified — they need NFC-tagged test data this pass didn't have on hand; named explicitly as a remaining gap, not silently skipped.
- **Client-side companion fix**: `finalizeSale`'s own call site (`Selling.tsx`'s `handleFinalize`) had the identical "fire-and-forget, silent on failure" gap `startSession`'s own client-side fix already closed earlier today — confirmed live: "Finalizar Venta" tapped five times by `merchant-user-tester` with zero visible response, no error, no loading state. Fixed the same way: a new `finalizeError` state renders a real "No pudimos finalizar tu venta. Intenta de nuevo." / Reintentar state instead of silently doing nothing.
- **A real process change, directed explicitly by the Product Owner, not just today's own cleanup**: this class of bug is invisible to a static code read — three separate functions, each individually reviewed at least once during Stage 7's own build, all passed a `reviewer` reading and still failed on the very first real call. Going forward, **any dispatch that writes or modifies a `supabase/migrations/*.sql` function must actually execute it (`BEGIN`/`ROLLBACK` against the linked hosted project, never a local Docker instance — none exists in this environment) before being reported done** — a code read alone is not sufficient verification for SQL, the same standard this project already holds itself to for TypeScript (`npm run build`) but has never enforced for the actual database layer until today.
- `merchant-user-tester`'s own full walkthrough report (same live session) additionally found: a real data-consistency bug (Configuración's own summary and "Tu equipo"'s own detail screen disagreeing about whether the same Invitation was still pending — the `cancel_invitation` fix above closes the specific stuck invitation that caused it, but the underlying display-consistency question is worth a follow-up check); an intermittent empty-render on the first tap into Resultados (resolved on a second tap, not yet root-caused); the bottom-nav "Hoy" tab twice failing to re-render its content on the first tap immediately after an error screen (worked on a second navigation via a different tab first) — both UI-layer findings, named here, not yet investigated or fixed.
  - **Update, 2026-09-15 evening.** A fourth reported finding — tapping a product row in Inventario opens a restock form rather than a detail/edit view — investigated against `inventory.md` directly and confirmed **correct, approved behavior, not a bug**: the Catalog row has three deliberately-disambiguated tap zones (§3.4a) — marker → photo-edit sheet, body → restock (the documented, intended primary action, `inventory.md` line ~1673's own efficiency-table entry), price figure → price-edit. A first-time merchant not yet aware of the three zones can reasonably expect "detail" from a body tap, but the approved spec chose restock deliberately as the highest-frequency real action. No code change.
  - The other two (Resultados empty-render, "Hoy" tab re-render) were investigated tonight by reading `ResultadosScreen.tsx`'s hydration cycle and `App.tsx`'s tab-switch mounting in full — no obvious root cause found from static reading. `ResultadosScreen`'s hydration has an explicit generation-based staleness guard and a plain `setState` (not `applyWriteMirror`) that should batch cleanly with React 18; `App.tsx`'s `{activeTab === 'x' && <Screen/>}` pattern genuinely unmounts/remounts each screen on every tab switch, so a stale closure across visits looks unlikely on paper. Both are intermittent, timing-dependent UI symptoms — exactly the class this project's own "execution before done" discipline (established earlier tonight for SQL) applies to just as much for React timing bugs: a static read can't confirm or rule these out. Left open, genuinely unresolved, needing a live re-walk (ideally a `merchant-user-tester` re-run, or Main reproducing directly with devtools open) rather than a guessed fix.

## Slice 18 — `User.displayName` (Q29) and `Invitation.targetHint` enforced (Q30) — PUSHED and live-verified, 2026-09-15

Both migrations were initially written with no working `SUPABASE_ACCESS_TOKEN` in that session's environment (the same CLI-auth gap `company/infrastructure-decisions.md` ID018 names). Once the Product Owner supplied a fresh token, all four push-checklist steps below were completed in the same session — this section is the closure record.

1. `supabase db push` — applied both migrations cleanly (`20260915120000_user_display_name.sql`, `20260915130000_invitation_target_hint_enforced.sql`).
2. **Real-execution verification, `BEGIN`/`ROLLBACK` against the real hosted project (this file's own established discipline) — 14/14 checks passed, nothing committed.** Synthetic `auth.users`/`businesses`/`business_memberships`/`invitations`/`auth_identities` rows, all rolled back: `create_invitation` correctly rejects a null `target_hint` (`target_hint_required`) and succeeds with a valid one; `peek_invitation` returns `target_hint`; `accept_invitation` raises `invitation_identity_mismatch` (never `invitation_not_available`) for a mismatched identity, without flipping the row's `status` (confirmed still `pending` afterward); succeeds once the invitee's own verified email `AuthIdentity` actually matches; a true idempotency replay (same key) returns the identical cached success, not a re-run; a second, independent Invitation to the same Business, accepted by someone already an active member, correctly raises `already_member` (not the identical-token case, which correctly returns `invitation_not_available` instead — that's the right behavior, not a bug, checked directly rather than assumed) — and exactly one `business_memberships` row exists afterward, no duplicate; `update_invitation_target_hint` correctly repairs a still-`pending` row's hint in place; **a legacy `pending` Invitation with `target_hint IS NULL` correctly bypasses the mismatch check entirely**, per RFC 0014's own backward-compatibility rule; `update_user_display_name` correctly upserts (first insert, then update, both verified); an OWNER correctly reads her own `display_name` back via the `users_select_own` RLS policy.
3. `supabase functions deploy peek-invitation` — deployed, confirmed `ACTIVE` at version 8 via `supabase functions list`.
4. **Live cross-device round-trip (an OWNER setting her name and a second, separately-authenticated session seeing it) was not verified** — this requires two real, separately-authenticated live sessions, which this environment can't simulate; left to the Product Owner's own live testing, same as every other cross-device claim this file discloses rather than fabricates a verification for.

1. **`20260915120000_user_display_name.sql`** (`decision-log.md` D69, `product-decisions.md` Q29) — new `public.users` table (`id` FK'd to `auth.users`, `display_name text`, `created_at`), RLS (own row; an OWNER also reads a row for any User holding a `business_memberships` row in a Business she actively owns), and `update_user_display_name(p_display_name text)` — a SECURITY DEFINER upsert RPC, `auth.uid()`-gated. **Disclosed limitation, not this migration's gap to close**: a phone-verified merchant's `User.id` is a client-minted mock with no real `auth.users` row (the same pre-existing gap `resolveAuthIdentity`'s own `realUserId` doc comment already names, `store.tsx`) — for her, this write already fails closed today, the identical limitation `create_business_with_owner`/`commit_lot` already have for the phone channel, not a new one this field introduces.
2. **`20260915130000_invitation_target_hint_enforced.sql`** (`product/99-rfc/0014-invitation-target-hint-enforced.md`, `decision-log.md` D70, `product-decisions.md` Q30) — four changes in one file: `create_invitation()` now rejects a null `p_target_hint` (`target_hint_required`); `accept_invitation()` gains a new `invitation_identity_mismatch` precondition, checked before the status CAS (restructured from a single CAS `UPDATE` into read-then-check-then-CAS so the mismatch check can run against the row's own `target_hint` before touching `status` at all) — the same pass also fixes a real, independently-confirmed-by-reading bug in the idempotency-replay branch, which previously replayed `invitation_not_available` unconditionally for *any* cached error, silently mislabeling a replayed `already_member`/`membership_revoked` outcome (found while extending that exact branch for the new error, not a separately-discovered defect — **this fix itself is also unexecuted, per the disclosure above**); new `update_invitation_target_hint()` RPC (`settings.md` §3.12e "Editar correo"/"Agregar correo," an ordinary UPDATE on the still-`pending` row, no token/expiry touch, wrapped as an RPC only to match this file's own uniform calling convention); and `peek_invitation()` now also returns `target_hint` (a `drop function` + fresh `create`, since its `returns table` shape changed — re-applies `20260914060000`/`20260915010000`'s own final anon/authenticated-revoked, service_role-granted state directly, rather than risking a transient re-open via an intermediate grant-then-revoke).
3. **Edge Function change, also not yet deployed**: `supabase/functions/peek-invitation/index.ts` now forwards `target_hint` in its JSON response (`authentication.md` §3.2g needs it pre-auth, to show the locked, pre-filled address before any authentication runs — not a new disclosure, §3.2g already shows this exact value, unlocked, before she types anything). Needs `supabase functions deploy peek-invitation` once migration 2 above is live (the function calls `peek_invitation`, whose own returned shape just changed).

**Client-side wiring is complete and builds clean**: `store.tsx` gains `setUserDisplayName`/`updateInvitationTargetHint`, both `peekInvitation`/`acceptInvitation` widened for `targetHint`/`invitation_identity_mismatch`, and `hydrateFromBackend` now also queries `public.users` (no `business_id` filter — RLS alone scopes what comes back) to fold real cross-device `display_name` values into the local `users` mirror, the one place this build learns about *other* people's names (an OWNER reading her own team's). Full UI build (Onboarding's "¿Cómo te llamas?", Settings' and the SELLER's own "Tu cuenta" "Tu nombre" field, Team screen's required-email invite form and new "Editar correo"/"Agregar correo" sheet, `authentication.md` §3.2g/§3.10f's new screens) is documented in `docs/passes/slice-18-displayname-target-hint.md`.

**Push checklist — complete, see the four numbered items above.** The one item left open is the live cross-device round-trip (item 4, above) — real merchant testing, not something this environment can simulate.

## Product Page writes — `update_product_name` / `clear_product_barcode` — WRITTEN, NOT PUSHED (2026-09-21)

`supabase/migrations/20260921010000_product_page_writes.sql` adds the two
writes `inventory.md`'s 2026-09-19 Catalog-card → Product-Page amendment
requires. **It has not been pushed to the hosted project** — no CLI auth
credential in the environment this was built in, the same disclosed posture
the Slice 14 and Slice 18 migrations were written under. Until it is pushed,
both merchant actions fail closed (the RPC simply doesn't exist), which the
UI already surfaces correctly as an ordinary failed save with the sheet left
open and retriable — never a silent success.

1. **`update_product_name(p_business_id, p_product_id, p_idempotency_key,
   p_new_name)`** — `inventory.md` §3.19a "Guardar nombre." OWNER-only,
   idempotency-keyed, single-column `UPDATE`, same shape as
   `update_product_price`/`update_product_photo`/`update_product_barcode`.
   - Stores `btrim(p_new_name)` — §3.19a's one automatic normalization.
     Internal casing and internal spacing are preserved exactly as typed.
   - Rejects empty/whitespace-only (`name_required`), defensively; the client
     already keeps "Guardar nombre" disabled in that state.
   - Re-runs §3.8's matching rule server-side against **every other** Product
     in this Business (`lower(btrim(name))`), raising
     `product_name_already_registered`. This is what makes a **concurrent
     rename on another device** surface through §3.19a's ordinary save-error
     path rather than as a silent duplicate. The ordinary conflict (§3.19b)
     is still caught client-side first, so this branch is the race only.
   - **No unique index on `(business_id, name)` is added, deliberately.**
     `products` has never carried one; name uniqueness is a §3.8 *matching*
     rule enforced at the write paths that can create or change a name, not a
     storage invariant, and adding an index now would retroactively
     invalidate any legacy row pair predating the rule.

2. **`clear_product_barcode(p_business_id, p_product_id,
   p_idempotency_key)`** — `inventory.md` §3.19c, `decision-log.md` D80.
   OWNER-only, idempotency-keyed, and **a single-column write**: it sets
   `products.barcode = null` and touches nothing else.
   - `update_product_barcode`'s existing `barcode_required` guard **stays
     exactly as it is and is not weakened** — clearing is its own deliberate
     action with its own function, never an implicit consequence of saving a
     blank value (D80 constraint 1).
   - `nfc_tagging_enabled` is **not** in the `SET` list, in either direction
     (constraint 2). It is already `false` on every Product this action can
     reach, and `set_product_nfc_tagging_enabled`'s existing
     `product_has_barcode` guard is never bypassed — it simply stops applying
     once the barcode is genuinely gone.
   - **Zero `inventory_units` rows and zero `nfc_tags` rows are touched**
     (constraint 4). No tag cleanup, no detachment, no cascade: any "clean up
     tags when identification changes" behaviour would be a second non-sale
     tag-detachment case and needs its own RFC. It must not be added here.
   - No guard conditions, stated affirmatively rather than left silent: D80
     found none to impose. Removal is permitted regardless of `available`
     count, `reserved` units, open `EventAllocation`s, or how many units carry
     tags.
   - Safe to repeat in effect as well as by key — a second call sets an
     already-null column to null.

**Also changed client-side, no migration needed:**
`set_product_nfc_tagging_enabled` is unchanged server-side, but its client
wrapper (`store.tsx`) now takes a **caller-supplied** `idempotencyKey`
instead of minting a fresh one per call. The Product Page's NFC row is
explicitly its own retry affordance, so a fresh key per call made every retry
arrive as an unrelated second request — the same hole `reviewer`'s 2026-09-13
`commitLot` Blocker fix closed for the receipt path. This closes
`BACKLOG.md` §F for that one write.

**Push checklist:** `supabase db push` (or apply the single migration file),
then verify both functions exist and are `execute`-granted to `authenticated`
only, and smoke-test each once from the running prototype — a rename that
collides with another Product (expect `product_name_already_registered` →
§3.19b is client-caught, so this path should only be reachable by racing two
devices), and a barcode clear on a Product with ≥1 tagged unit (expect the
tag rows untouched and `nfc_tagging_enabled` still `false`).
