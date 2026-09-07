# Slice 12 — Q24/Q25 first usable version: multi-staff concurrent selling

Full scope, Foundation grounding, and `architect`'s Architecture Gap
Analysis lived in `context/q24-q25-first-slice.md` (working file, now
superseded by this entry per this folder's own knowledge-architecture
discipline — see that file's own status note). Built across the 4 phases
the Gap Analysis recommended, in the sequence it specified: foundational
refactor → Identity capability (Invitation/Membership) → Home role
experience + D53 multi-Event resolution → EventAllocation (manual) +
lost-the-race.

**In scope** (per the Product Owner's own stated priority): staff
invite/SELLER accounts, `Sale.performedByMembershipId` attribution
("Mi actividad de hoy"), manual (quantity-based) Event allocation only (no
NFC-scan allocation composability), the compare-and-swap "lost the race"
handling, `home.md`'s SELLER-role experience, D53's own multi-Event Home
resolution. Explicitly deferred (unchanged from the context file's own
scope line): NFC-scan allocation (`events.md` §3.22), cross-Event
reallocation ("Mover mercancía," §3.24), reconciliation at Event close
(§3.25), richer seller analytics beyond "Mi actividad de hoy,"
`AllocationMovement`'s own implementation.

## Phase 1 — Foundational refactor

`src/domain/types.ts`: `AppState.currentUser: User | null` →
`users: User[]` + `currentUserId: ID | null` (the Architecture Gap
Analysis's own named unblocker); `BusinessMembership.status`/`revokedAt`;
new `Invitation` (Identity context); `Sale.performedByMembershipId`; new
`EventAllocation` (Selling context, manual-mode fields only —
`quantityAllocated`/`quantityRemaining`/`status`; `allocatedUnitIds`/NFC
mode deliberately not modeled, out of scope); one **disclosed, reasoned
deviation** from RFC 0009's own "No changes to `Session`" text —
`Session.openedByMembershipId`, a prototype-only field standing in for
real per-device separation (a real deployment needs no such field, since a
device structurally only ever discovers the Session it itself opened; this
single-shared-`localStorage` prototype has no such separation without it).
Flagged in the field's own doc comment for `architect`/`reviewer` to
challenge.

`src/domain/store.tsx`: `verifyOtp` now searches `users[]` by phone
(RFC 0007 §1's real "looked up by phone, globally" shape, not the
single-slot approximation Slice 2 disclosed); `completeOnboarding`/`signOut`
updated for the array shape; `startSession`/`addItemToSale`/
`addItemToSaleByTag`/`cancelSale`/`finalizeSale`/`closeSession` all rescoped
from "any active Session, Business-wide" to "this acting Membership's own"
(`actingMembership`/`myActiveSession`, `selectors.ts`) — the direct
consequence of two Memberships now genuinely able to hold concurrently-open
Sessions; `addItemToSale` gained the Physical-location-exclusivity
invariant's mechanism (b), a real compare-and-swap on
`EventAllocation.quantityRemaining > 0`, decrementing at add-time (not at
Finalizar Venta); `cancelSale` restores it symmetrically. New
`removeSaleItem`, `createInvitation`, `acceptInvitation`,
`revokeMembership`, `saveEventAllocations` writes. `createEvent`'s D17
overlap check removed outright (`decision-log.md` D53) — return type
simplified from a `CreateEventResult` union to a bare `ID`, since the write
can no longer fail. `loadState()` gained a full migration path for
pre-Slice-12 `localStorage` (old `currentUser` → `users[]`/`currentUserId`,
default `status: 'active'` on old Memberships, best-effort
`openedByMembershipId` backfill from the sole pre-existing OWNER Membership).

`src/domain/selectors.ts`: `currentUser`, `findMembership`,
`actingMembership`, `myActiveSession`, `sessionsOpenedBy`,
`pendingInvitationsForPhone`, `teamRows`, `activeTeamCount`,
`eventAllocationFor`, `disponibleEnGeneral`, `eventScopedRemaining`,
`myActivityToday`. `activeEventForBusiness` (singular, "well-defined by
construction" under D17) replaced by `activeEventsForBusiness` (plural) —
D53 retired the singularity guarantee its own doc comment relied on.

`src/screens/Events/NuevoEvento.tsx`: the D17 overlap-check machinery
(`conflict`/`conflictMessage`/`showConflict`/`touched`/`markTouched`) is
pure code-debt deletion — removed, not redesigned, per the dispatching
task's own instruction.

## Phase 2 — Identity capability

`authentication.md` §2.2/§2.2a/§3.10-§3.13a: `AppRouter.tsx` gains a fourth
top-level stage, `InvitationFlow` (`src/screens/Authentication/
InvitationFlow.tsx` + `.module.css`), mounted between Authentication and
Onboarding — the offer (§3.10), accepting near-instant/error (§3.10a/b,
disclosed-not-wired, the mock write never fails), the welcome screen
(§3.10c), and the defensive "no longer available" state (§3.13a).
**Disclosed, reasoned approximation of the spec's own literal gate,**
documented in full in `AppRouter.tsx`'s own doc comment: the spec's actual
condition ("has this phone never been verified before, anywhere") is a
fact only known transiently at the moment `verifyOtp` resolves, not
honestly re-derivable from persisted state on a later render/reload the
way every other check on this page already is. This build instead shows
the offer to any authenticated User holding no Membership anywhere and no
own Business, for as long as a pending Invitation exists for her phone —
functionally identical for every case that matters at pilot scale, with
one named theoretical divergence (a phone that verified long ago, never
finished Onboarding, invited only afterward) reasoned through explicitly
rather than silently accepted.

`settings.md` §2.7/§3.11-§3.14: new "Tu equipo" section on the Paid-tier
vista principal (`SettingsScreen.tsx`/`.module.css`), gated identically to
every other Paid-only capability; new `TeamScreen.tsx` + `.module.css`
(§3.11 main list with empty state, §3.12 "Nueva invitación" phone entry
with inline duplicate/already-member validation, §3.13 "Quitar" confirm);
new `AccesoRevocado.tsx` + `.module.css` (§3.14) — not wired through
Configuración's own navigation (nothing links to it), reached only from
`App.tsx`'s own top-level resolution (see Phase 3).

## Phase 3 — Home role experience + D53 Home resolution

`App.tsx`: resolves `home.md` §2 step 0 (revoked Membership → full-viewport
`AccesoRevocado`, no header, no nav bar — the strongest omission any state
in this document family renders, so it sits one level above the tab
shell) and §3.16 (role-scoped `NavBar`, a SELLER sees only "Hoy," never a
grayed-out tab) at the tab-shell level; a defensive `AccesoNoDisponible`
(§3.17) backstop covers `activeTab !== 'hoy'` for a SELLER — never reached
by tapping anything this build's own SELLER-facing screens offer.

`HomeScreen.tsx`: role resolution (`actingMembership`), step 1 rescoped to
`myActiveSession`, step 2 split into 2a (unchanged single-Event path) and
2b (new `ElegirEvento.tsx`/`.module.css`, §3.6b) with the same-day-signal
skip (`sessionsOpenedBy`, most-recent-first). `ColdStart`/`Idle`/
`EventResume`/`NfcSessionStartNote` all gained `role`/`headerIcon` props
and SELLER copy variants (passive notes replacing OWNER-only links, the
Ready-but-buttons discoverability nudge fully suppressed for SELLER).
`CloseSummary`'s `onViewDetail` made optional — suppressed for SELLER, a
**disclosed extension of an already-stated principle** (§3.6a's own
"never show a link to an unreachable destination"), not text §3.12 itself
enumerates; same judgment call applied to `Idle`'s upcoming-Event card.
New `SellerAccountScreen.tsx`/`.module.css` (§3.15a's own named stand-in,
hosted here per the spec's own instruction) and `MiActividadDeHoy.tsx`/
`.module.css` (§3.7c, full push-in, `performedByMembershipId`-scoped).
`Selling.tsx`/`SessionHeader.tsx` gained the role-scoped header icon and
"Ver mi actividad de hoy" link. `ProductTile.tsx`/`.module.css` gained the
Event-scoped remaining-stock line (§3.9) — "N en este evento" as a genuine
second line, "0 en este evento" as a substitution for "0 disponibles" when
the zero is allocation-exhaustion, per the spec's own explicit distinction.

## Phase 4 — EventAllocation (manual) + lost-the-race

New `MercanciaParaEsteEvento.tsx`/`.module.css` (`events.md` §3.21/§3.23),
reached from `EventDetail.tsx`'s new "Llevar mercancía" (`scheduled`) and
"Ver mercancía de este evento" (`active`) — the identical shared screen,
per the doc's own §4 discipline. **Manual-mode only, as directed:** no
scan affordance, no "sin tag · con tag" split, no "Mover a otro evento" —
every row shows a single plain "Disponible en general: N" figure and a
purpose-built stepper (floor 0, ceiling = live `disponibleEnGeneral`,
inline clamp message). Collapse-to-summary/one-row-expanded-at-a-time,
adapted from Registrar Mercancía's own committed-row precedent per the
spec's own corrected annotation (a display toggle, not a sequential-add
commit). "Guardar cambios" is one bulk `saveEventAllocations` write.

`home.md` §3.8a extended / §3.8d-i / §3.8d-ii — the "lost the race"
terminal state: `VentaActualTray.tsx`/`.module.css` gained an optional
`conflictedProductIds`/`onTapConflictedChip` (a ⊗ marker, distinct from ⚠,
which this slice never builds either — no background-sync simulation
exists to raise it). `Selling.tsx` gained real, correctly-rendering
machinery — a local `conflictedItemIds` set, the detail sheet
("[Producto] ya no está disponible. Otro vendedor la vendió." → "Quitar de
la venta"), the §3.8d-i pre-write block (auto-retries the same Finalizar
Venta attempt once resolved, per the spec's own "no re-tap needed"
reading), and the §3.8d-ii shape (identical rendering, reached at a
different, equally page). **Fully disclosed, not silently glossed over:**
genuinely unreachable through real interaction in this no-backend
prototype — a true cross-actor race needs two independent writers racing a
stale read, which one synchronous JS thread cannot produce, and this
build's own compare-and-swap runs at add-time (immediately gated by the
already-dimmed tile), never leaving anything to discover late at
Finalizar-time. `product-decisions.md` Q24/Q25 explicitly anticipates and
permits this ("the prototype can illustrate the experience... without the
real compare-and-swap mechanism existing underneath yet") — this build
takes that permission at its word rather than inventing a fake trigger
affordance the approved spec never asked for.

## Judgment calls and scope gaps, disclosed

1. **`Session.openedByMembershipId`** — a real, reasoned deviation from
   RFC 0009's "No changes to Session," not silently absorbed. See Phase 1
   and the field's own `types.ts` doc comment.
2. **`AppRouter.tsx`'s invitation-offer gate** is a state-derived
   approximation of the spec's own transient "never verified before"
   condition, not the literal text. See Phase 2 and that file's own doc
   comment for the one named theoretical divergence.
3. **CloseSummary's "Ver detalle" and Idle's upcoming-Event card**, both
   suppressed for SELLER — an extension of §3.6a's own already-stated
   "never link to an unreachable destination" principle to two states the
   approved spec's own SELLER-variant enumeration doesn't explicitly name.
4. **"Lost the race" is real, correctly-rendering, and genuinely
   unreachable through real interaction** in this build, exactly as
   `product-decisions.md` Q24/Q25 anticipates — no fake trigger invented.
5. **A same-tag double-scan / NFC allocation** stays fully out of scope,
   per the dispatching task's own instruction — `addItemToSaleByTag` is
   untouched by the compare-and-swap gate.
6. **Reconciliation at Event close** (`events.md` §3.16/§3.25) is
   unbuilt — an `EventAllocation` left `open` with `quantityRemaining > 0`
   when its Event closes simply has no UI to resolve it this slice, per
   the dispatching task's own explicit deferral.

## Two real bugs found and fixed via live verification

Live-verified against `npm run dev` using `puppeteer-core` (ad hoc,
`--no-save`, driving the machine's own installed Chrome — removed again
after verification, per this folder's own transient-tooling convention).
Two real, load-bearing bugs surfaced only by actually running the
walkthrough, not by code review alone:

1. **`AppRouter.tsx`'s own `pendingInvitation` derivation flipped false the
   instant `acceptInvitation`'s write succeeded** (a Membership now
   existed), unmounting `InvitationFlow` *before* its own `'accepting'`/
   `'welcome'` steps (§3.10a/§3.10c) ever rendered — the write succeeded
   silently, but she'd never see the confirmation she'd just earned. Fixed
   by latching the invitation into local state the moment it's first
   offered (`lockedInvitation`, cleared only by `onDeclined`/`onAccepted`),
   documented in full in that component's own doc comment.
2. **`HomeScreen.tsx`'s `ElegirEvento` row tap was a pure no-op** —
   `onSelect={(eventId) => renderEventResume(eventId)}` computed and
   discarded JSX from inside an event handler, never triggering a
   re-render toward it, since nothing about the tap itself changes
   `AppState` (per §3.6b's own "selecting a row never opens a Session
   itself"). Fixed with a `pickedEventId` local-state latch, consulted
   only after the same-day-signal check, matching §2 step 2b's own
   priority order.

Both confirmed fixed via a second full run of the same live walkthrough
after each fix, screenshotted at every step (transient verification aids,
not persisted to the repo, per this folder's own established convention).

## Verification

`tsc -b` and `npm run build` both clean after every phase (checked
incrementally, not only at the end, per the dispatching task's own
instruction) and again after the full slice.

Live walkthroughs (`puppeteer-core`, ad hoc): (1) OWNER onboards via the
demo path (Paid+NFC seed) → opens Configuración → "Tu equipo" (empty state,
correct copy) → invites a phone → "Invitación enviada" row appears → signs
out → the invited phone verifies → sees the real §3.10 offer (exact copy
match) → accepts → sees the real §3.10c welcome (exact copy match, after
the bug fix above) → lands on Home as a SELLER (⊚ icon, "[Hoy]"-only nav,
correct Not-Ready passive-note copy) → starts a Quick Session → adds an
item → "Mi actividad de hoy" correctly empty pre-finalize → finalizes →
Paid-tier receipt renders correctly, `Sale.performedByMembershipId`
attribution confirmed via direct `localStorage` inspection. (2) OWNER
creates two Events both spanning today at two different Venues → Home
correctly resolves §3.6b "¿Dónde vas a vender hoy?" with both rows (D53's
multi-Event resolution, live-confirmed) → picks one → "Llevar mercancía" →
allocates 3 Playeras → "Mercancía actualizada ✓" → returns to Selling →
tile correctly shows "3 en este evento" → three taps correctly decrement
`EventAllocation.quantityRemaining` 3→0 (confirmed via direct
`localStorage` inspection after each tap) → a fourth tap is correctly
blocked, tile reads "0 en este evento" (the substitution rule, not an
added line), "Venta actual" correctly totals 3 items · $660.

Not live-verified this pass, disclosed: revoke → "Acceso revocado" on the
revoked SELLER's own next resolve (code-traced, not click-tested — the
underlying `App.tsx`/`findMembership`/`revokeMembership` mechanics were
each independently live-verified in isolation, but not chained end-to-end
in one walkthrough this pass); the NFC-mode `addItemToSaleByTag` path
(deliberately untouched, out of scope); the §3.8d-i/§3.8d-ii lost-race
sheets themselves (genuinely unreachable through real interaction, per
this document's own disclosure above).

## Files touched

`src/domain/types.ts`, `src/domain/store.tsx`, `src/domain/selectors.ts`,
`src/domain/onboardingResolution.ts`, `src/AppRouter.tsx`, `src/App.tsx`,
`src/components/NavBar/NavBar.tsx`, `src/components/SessionHeader/
SessionHeader.tsx`/`.module.css`, `src/components/ProductTile/
ProductTile.tsx`/`.module.css`, `src/components/VentaActualTray/
VentaActualTray.tsx`/`.module.css`, `src/screens/Authentication/
InvitationFlow.tsx`/`.module.css` (new), `src/screens/Settings/
SettingsScreen.tsx`, `TeamScreen.tsx`/`.module.css` (new),
`AccesoRevocado.tsx`/`.module.css` (new), `src/screens/Home/HomeScreen.tsx`,
`ColdStart.tsx`, `Idle.tsx`, `EventResume.tsx`, `NfcSessionStartNote.tsx`,
`CloseSummary.tsx`, `Selling.tsx`, `ElegirEvento.tsx`/`.module.css` (new),
`MiActividadDeHoy.tsx`/`.module.css` (new), `SellerAccountScreen.tsx`/
`.module.css` (new), `AccesoNoDisponible.tsx` (new), `src/screens/Events/
NuevoEvento.tsx`, `EventDetail.tsx`, `MercanciaParaEsteEvento.tsx`/
`.module.css` (new), `README.md` (pass-history index entry), this file.
