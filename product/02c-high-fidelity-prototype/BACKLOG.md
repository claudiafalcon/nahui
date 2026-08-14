# Implementation Backlog — product/02c-high-fidelity-prototype

Living document. Main owns this (`company/CLAUDE.md`'s "Product Backlog
Ownership" section, added 2026-08-13) — evaluated and re-evaluated after
every completed slice against business value, dependency order, user value,
architectural dependencies, merchant validation value, implementation
effort, and design-system evolution. Not worked in document order; worked in
the order that builds the strongest product foundation.

**Every item below already has an Approved Medium-Fidelity spec, so each
follows the Migration Workflow (`decision-log.md` D43), not the full
New-Feature Workflow:** `Approved UX Specification → Architecture Gap
Analysis → High-Fidelity React Implementation → Review Pipeline → Approved
Slice`. The Approved `product/02-ux/*.md` doc is the implementation
contract — Architecture Gap Analysis identifies implementation gaps only,
it does not reopen the UX itself.

This is a different document from `company/backlog.md` (the company's own
higher-level, phase-gating priority list — Sale registration, Customer
Segmentation, Bazaar recommendation). This file is the more granular
question: *given* that priority order, in what sequence should the
remaining `information-architecture.md` journeys actually get built as
React slices.

## What's built (Slice 1, complete)

Home → Inventario → Registrar mercancía → Selling (Quick Session only) →
Digital receipt. Covers IA Journey 1 (Inventory prep, buttons-mode only, no
`nfc`/Asignar Tags) and the core-path half of Journey 3 (Selling) — the
"nothing scheduled → Iniciar Venta Rápida" branch of Home's resolution
logic only. Full record: `README.md`.

## What's built (Slice 2, complete — Authentication + Onboarding, 2026-08-13)

Phone → OTP → Owner identity → Business onboarding → Home, per
`product/02-ux/authentication.md` and `product/02-ux/onboarding.md` (both
Approved) and `product/99-rfc/0007-user-and-business-membership.md`
(Accepted, D44). Closes the exact gap this file's own prior "what's not
built"/priority-evaluation entries named: `Business.name`/capabilities are
no longer hardcoded ("Luna Mercado," D36's old scope decision) — a real
Business is now created through the same atomic Owner-creation write
(`onboarding.md` §3.5, RFC 0007) every future slice can build on top of.
All three Onboarding paths (Empezar gratis, Activar plan de pago, Ver un
ejemplo) are real and reachable, including every resume guarantee
(`authentication.md` §3.8 post-verification, `onboarding.md` §2.1/§3.7).
`subscriptionTier`/`defaultSellingMode` are no longer pinned — the demo path
can now reach `paid`/`nfc` for real, though NFC Readiness always resolves
Not Ready in this build since NFCTag assignment isn't modeled (disclosed in
`README.md`). Full record, including every disclosed simplification:
`README.md`'s "Authentication + Onboarding pass" section.

## What's built (Slice 3, complete — Eventos, 2026-08-13)

Journey 2 (Event scheduling) in full, the remaining 2/3 of Journey 3
(Event-active Home resolution — "Continuar Día N"), and Journey 4 (Event
close/rollup), per `product/02-ux/events.md` (Approved). `Event`/`Venue`/
Price Override are real, written aggregates — `Session.eventId` is no
longer always `null`. Home's resolution logic now covers all four of §2's
numbered steps, not three. Full record: `README.md`'s "Eventos pass"
section.

## What's built (Slice 4, complete — Configuración, 2026-08-13)

The four Business Capability actions (`subscriptionTier` × 2 directions —
including the deferred "Volver al plan gratis" pending-change indicator and
its own cancel action, `defaultSellingMode` × 2 directions), plus the new
account-level "Cerrar sesión" (`settings.md §2.5/§2.5a`, `authentication.md
§2.2` case 2, RFC 0007), per `product/02-ux/settings.md` (Approved). Closes
the exact gap this file's own prior "what's not built" entry named:
`subscriptionTier=paid` and `nfc` are now reachable from inside the app for
the first time, without going through the demo-onboarding seed — verified
directly (a real free-path Business, brought to Paid+`nfc` purely through
Configuración, correctly drives `Idle.tsx`'s existing NFC-Not-Ready nudge
with zero code changes there). Also closes a real, live correctness gap the
Product Owner identified directly: there was previously no way anywhere in
the built product to sign out of the phone-verified session Slice 2
introduced. Full record, including one real bug found and fixed by this
pass's own verification walkthrough (a landing-render bug in §2.4's pending-
change acknowledgment): `README.md`'s "Configuración pass" section.

## What's built (Slice 5, complete — Resultados, 2026-08-13)

Journey 5 (Review) in full, read-only, per `product/02-ux/reports.md`
(Approved). Cold start; free-tier main view (Total histórico, ticket
promedio, the two headline paired-fact statements, "Top productos," En
curso, Historial); paid-tier main view (adds "Rendimiento por bazar"/"Tus
clientes" teasers); Session detail; Event detail (the exact day-by-day +
Por-producto breakdown `events.md` §3.16/Q7 deliberately deferred to this
tab); "Rendimiento por bazar" (populated + the Quick-Session-only empty
state) and its venue drill-down; "Tus clientes" (§3.13's zero-Claims empty
state, the only reachable branch — `Customer`/`Claim` don't exist anywhere
in this domain layer, confirmed by the Gap Analysis); the defensive-fallback
component (built, structurally unreachable — no real async load exists in
this synchronous, localStorage-backed prototype). Also closes two real
wiring gaps the Gap Analysis found: Home's "Ver detalle" (`home.md` §3.12)
now lands directly on Resultados' Session detail; Eventos' "Ver resumen en
Resultados" (`events.md` §3.16) now lands directly on Resultados' Event
detail — both verified end-to-end via live Puppeteer walkthroughs, not just
seeded-state jumps. Recompensas' populated flow (§3.15-§3.18, including the
"Confirmar recompensa entregada" write) is out of scope for this slice —
structurally unreachable, same as "Tus clientes"'s own populated branch.
Full record, including every disclosed judgment call: `README.md`'s
"Resultados pass" section.

## What's built (Slice 6, complete — Asignar Tags, 2026-08-14)

Inventario's NFC-tagging queue in full, per `product/02-ux/inventory.md`
§3.14-§3.17 (Approved). `InventoryUnit.tagId` (nullable, D43's own domain
addition) and the new `assignTagToNextPendingUnit` write path (one scan, one
unit, global across every Lot/Product — never a Lot-scoped queue); four new
live selectors (`pendingTagUnits`/`pendingTagCount`/`pendingTagBreakdown`/
`nfcCapable`, the last one D27-correct — `subscriptionTier=paid` alone, not
kit/code activation). Screens: the active tagging queue (§3.14, pure
scan-driven, no per-unit confirm tap), both error states (§3.15
"already-assigned," §3.16 "scan failed" — simulated entirely client-side,
same posture as this codebase's own phone-OTP mock), deferral (§3.17, = §3.5)
and the Catalog view's own previously-unbuilt §3.5 pending-tag-work variant
("Continuar etiquetando" as primary CTA, "Registrar mercancía" demoted to
secondary in that one state, per the spec's own 2026-08-07 task-priority
amendment). Auto-entry after "Guardar mercancía" (§2 step 3, nfc-capable →
Asignar Tags directly, no intermediate question) and the "lista para vender"
completion confirmation (§2 step 4 → §3.13) are both wired through
`InventoryScreen`'s own resolution logic. Also rewires Home's "Asignar tags"
link (`Idle.tsx`/`EventResume.tsx`, both instances) away from its earlier
honest Placeholder stub to this real screen — the link's own trigger
condition (`defaultSellingMode === 'nfc'`) is unchanged, out of this slice's
explicit scope. NFC selling mode itself, `Session.operatingMode` resolution,
and `home.md` §3.6a's remaining variants remain untouched — item D.2, a
separate later slice. Full record, including every disclosed judgment call
and simplification: `docs/passes/slice-6-asignar-tags.md`.

## Migration inventory (authoritative — knowledge-architecture backlog hygiene pass, 2026-08-14)

Full lineage audit (Foundation → Approved UX → Medium Fidelity → React →
Backlog) run across every slice, 2026-08-13/14. Supersedes the old, thinner
"What's not built" list below it — every item here has a precise
classification, a stated dependency, a deploy target, and an owner. No
implementation code changed during this pass; this is documentation only.

**Classification vocabulary used throughout:** Fully migrated · Partially
migrated · Approved, pending React migration · Deferred to backend
integration · Separate deploy target · Genuine regression · Not yet
designed (architecture-level).

### A. Deferred to backend integration (Stage 7) — one consolidated entry

All 14 states below are Approved, built in Medium-Fidelity Figma, and absent
from React for the same structural reason: this prototype's state resolves
synchronously from `localStorage` — there is no async boundary for a
loading/error state to occupy. Building any of these now would mean
simulating a failure mode that can't yet genuinely occur. **Correctly
deferred, not a current gap** — but previously untracked except for one
instance (`ResultadosLoadError.tsx`, already disclosed). Owner: Stage 7
(Backend Integration), no earlier slice.

| Slice | States | Approved UX citation |
|---|---|---|
| Home | Resolving (§3.1/§3.2), item-sync failure (§3.8a), Finalizar Venta error (§3.8d), fallback (§3.14) | `home.md` |
| Inventario | Resolving (§3.1/§3.2), Guardar error (§3.11), fallback (§3.18) | `inventory.md` |
| Authentication | Resolving/defensive fallback (§3.1/§3.2/§3.9) | `authentication.md` |
| Onboarding | Resolving/defensive fallback (§3.1/§3.2/§3.8) | `onboarding.md` |
| Eventos | Resolving/load-error (§3.1/§3.2/§3.18) | `events.md` |
| Configuración | Resolving (§3.1/§3.2), Guardar error (§3.10), Cerrar sesión error (§3.8b) | `settings.md` |
| Resultados | Resolving (§3.1/§3.2); fallback already built (§3.14, `ResultadosLoadError.tsx`) | `reports.md` |

**Dependency:** a real async load/write path, i.e. Stage 7 itself. No earlier
slice should attempt these individually — build them together once a real
backend makes the failure modes genuine.

### B. Genuine regressions — fixed (2026-08-14)

Unlike (A), these were built in Medium-Fidelity, are structurally reachable
today (their save paths already exist and run in React), and simply never
got their error/retry branch wired — caught during Slice 2's own review and
narrowed to a disclosure instead of fixed at the time. **Both fixed directly,
independent of any larger slice — no longer pending.**

- **BusinessIdentity save error/retry** (`onboarding.md` §3.10a) — Medium-Fi
  frame `763:56` exists; `BusinessIdentity.tsx` now passes
  `error`/`errorLabel`/`onRetry` to `WritingState`, identical shape to
  §3.5a's already-correct wiring in `OnboardingFlow.tsx`, **including the
  itemized Nombre/logo/Descripción preview §3.10a's wireframe shows on the
  error screen itself** (`WritingState`'s new `children` prop, additive and
  a no-op for every other caller). Fixed, not yet triggerable (same
  disclosed convention as (A) — the local mock write never fails). Full
  record: `docs/passes/slice-2-authentication-onboarding.md`.
- **SellingGroups save error/retry** (`onboarding.md` §3.5e) — Medium-Fi
  frame `732:5454` exists; `SellingGroups.tsx` had the identical gap, fixed
  the same way, **including the Selling-Group-lines preview §3.5e's
  wireframe shows**. Fixed, not yet triggerable, same convention. **Corrected
  in a follow-up fix round (`ux-critic` Findings A/B):** the initial fix
  reused the normal state's interactive `committedList` (title, TagStub, live
  `[✕]` remove button) as the error preview, and only showed already-
  committed lines, so a merchant who typed one product and tapped
  "Continuar" directly — without ever using "+ Agregar otro producto" —
  saw a blank error screen on a failed save. Now a separate, purpose-built
  passive rendering (`previewLines`/`.errorPreview`) — plain "Nombre —
  $Precio" text lines, no title, no `[✕]`, matching §3.5e's wireframe
  exactly — and it always includes the still-uncommitted active row when
  it's save-ready, not only already-committed lines, so the preview is never
  blank when real unsaved data exists. Full record:
  `docs/passes/slice-2-authentication-onboarding.md`.

### C. Stale disclosure — correct this, don't rebuild yet

- **NFC Session-start, `home.md` §3.6a's three non-NFC-surface variants**
  (Limited Ready inline override, capability-revoked mention, Ready-but-
  `buttons` one-time nudge) — Slice 1 disclosed these as correctly
  out-of-scope because `subscriptionTier` was pinned to `'free'` at the
  time. **Slice 4 (Configuración) removed that pin** — Paid is now reachable
  in-app. The original "by construction, not by an unstated omission"
  framing is no longer accurate; these are now genuinely reachable states
  with no implementation, same tier as (D) below, not a settled boundary.
  Reclassify from "correctly scoped out" to **Approved, pending React
  migration**, dependent on (D)(2) below (NFC Selling — (D)(1)/Asignar Tags
  is now complete, `InventoryUnit.tagId` is real, but Session-open-time NFC
  Readiness evaluation was explicitly out of that slice's own scope and
  `startSession` still always resolves `'buttons'` regardless of how many
  units actually carry a tag; without that resolution logic, NFC Readiness
  still can't reach Limited Ready or the capability-revoked case in
  practice, only the nudge case is independently reachable today).

### D. Sequenced feature gaps — the real NFC/payment-tier chain

Dependency order matters here; each depends on the one above it unless noted.

1. ~~**Asignar Tags**~~ — **complete, Slice 6 (2026-08-14).** Was: Approved,
   Medium-Fi built (3 frames + `NFCScanPrompt` component), React had only a
   `Placeholder` stub. Now fully migrated — `InventoryUnit.tagId`,
   `assignTagToNextPendingUnit`, the four new selectors, all four screen
   states (§3.14-§3.17) plus the previously-unbuilt §3.5 Catalog variant,
   and the §2 step 3/step 4 auto-entry/completion wiring. See "What's built
   (Slice 6)" above and `docs/passes/slice-6-asignar-tags.md`. Unlocks (2)
   and Frequent Customers Stage 1.
2. **NFC Selling** (`home.md` §3.10, the registration surface itself, plus
   the (C) variants above once reachable) — Approved, Medium-Fi built (full
   demo chain), React always renders buttons-mode regardless of
   `Session.operatingMode`. **Classification: Partially migrated** (the
   domain field, the Settings toggle, the tagging queue itself, and one
   §3.6a variant are real; the selling surface itself and three §3.6a
   variants are not). **Depends on (1), now satisfied** — no longer blocked,
   though NFC Readiness still always resolves Not Ready until this item
   itself is built (`store.tsx`'s `startSession` disclosure, unchanged by
   Slice 6 — Asignar Tags writes `tagId` for real now, but Session-open-time
   NFC Readiness evaluation was explicitly out of this slice's scope).
3. **Paid Receipt Claim Token / QR** (`home.md` §3.8f) — Approved
   2026-08-09, not built; `ReceiptTicket.tsx` renders only the Free-tier
   variant for every tier, with a stale comment claiming Paid is
   unreachable (no longer true since Slice 4). **Classification: Approved,
   pending React migration.** Independent of (1)/(2) — Paid-tier reachability
   alone (already built, Slice 4) is its only real precondition. Can be
   built in parallel with (1)/(2), not after.
4. **Customer Loyalty Registration** (`product/02-ux-loyalty/customer-loyalty-registration.md`)
   — Approved (Draft-complete), fully built in Medium-Fidelity (14 real
   frames, 0 open findings). **Classification: Separate deploy target** —
   not a migration item inside `02c-high-fidelity-prototype` at all, per
   D38. Needs its own backlog line and its own future sequencing outside
   this file, not "pending React migration" inside this codebase.
5. **Cross-app Loyalty data bridge** — the mechanism by which the Merchant
   Application would actually receive Derived Customer Intelligence
   computed by (4), once (4) exists. **Classification: Not yet designed
   (architecture-level)** — this prototype has no backend and no
   cross-app integration mechanism of any kind yet (everything is
   per-app `localStorage`), so even a complete (3) + complete (4) would not,
   by themselves, make data flow between them. This is a Stage 7-adjacent
   architecture question, not a UI migration item — no RFC currently
   specifies it. **Depends on (3) and (4) both existing**, and likely on
   Stage 7 (a real backend) to be meaningful at all.
6. **Populated "Tus clientes" / Recompensas states** (`reports.md`
   §3.12/§3.15-§3.18) — the screens exist and are correct
   (`TusClientesScreen.tsx` et al.), permanently showing the honest empty
   state. **Classification: Implemented, not exercisable.** Depends on the
   full chain above ((1) through (5)) — this is the terminal consumer, not
   an independent gap. Nothing to build here directly; it will start
   working once its upstream dependencies do.

### E. Smaller partial migrations and copy drift — all non-urgent

None of these block anything above; fix opportunistically.

- **Cancel-venta confirm weight** (`home.md` §3.8b) — spec calls for a
  lighter inline confirm than Close-session's full sheet; React collapsed
  both to the same `Sheet` component. **Partially migrated.**
- **Registrar mercancía draft persistence** (`inventory.md` §3.6/§3.7) —
  draft doesn't survive nav-tab switches (disclosed). **Partially migrated.**
- **Auth/Onboarding pre-write resume state** (`authentication.md` §3.8,
  `onboarding.md` §2.1 case 5) — typed phone/unsent code/tapped-but-
  unconfirmed path lost on reload (disclosed, low-cost). **Partially
  migrated.**
- **Demo seed data** (`onboarding.md` §11) — thinner than spec (no Event, no
  Customer/Claim seeded) — direct cause of NFC always resolving Not Ready on
  the demo path specifically. **Partially migrated.**
- **Configuración §3.9 saving-state granularity** — Figma has distinct
  near-instant/slow frames; React has one fixed-260ms state, undisclosed
  until this pass. **Partially migrated.**
- **SET-D27-MIN1** (`02b/settings.md`) — no inline signal that a
  `defaultSellingMode → nfc` change becomes moot under a pending downgrade;
  never carried into 02c, no owning item until now. **Partially migrated.**
- **Eventos copy drift** — "Nuevo evento" (React) vs. spec's "Agendar
  evento"; an extra "✓" on the cancel-ambient message not in the spec. **Not
  a migration gap** — route through `ux-designer` per D42's terminology-
  drift rule before treating either as canonical.
- **Resultados empty-Historial copy** — `ResultadosMain.tsx` renders an
  invented empty-state line the spec says shouldn't render at all when
  there are zero cards. **Not a migration gap** — same D42 routing.

## Priority evaluation

**Re-evaluated 2026-08-13, post-Slice-2.** The table below is retained
as-built from the pre-Onboarding pass (its Onboarding row is now historical
— see "What's built (Slice 2)" above) since the other three rows' reasoning
still holds unchanged: nothing about Slice 2's completion altered Eventos',
Resultados', or Configuración's own dependency shape, merchant-validation
status, or effort estimate. Recommendation below is updated for the actual
next slice.


| Candidate | Business value | Dependency order | User value | Architectural dependencies | Merchant validation value | Effort | Design-system evolution |
|---|---|---|---|---|---|---|---|
| **Onboarding** | Removes a known, disclosed workaround (`Business.name` hardcoded) blocking a genuine cold-start test | Upstream of everything — every other journey assumes a real Business already exists | Real first-time experience instead of a stand-in | Touches Business-initialization logic other slices already build on top of — better fixed before more work stacks on the workaround | **Already validated as a real gap** — Ana hit "Luna Mercado, unexplained" in all 3 walkthrough runs | Low — approved spec exists, self-contained, no new domain entity (Product Definition/UX Flow Review already done) | Form/wizard patterns likely reusable for Eventos' "Nuevo Evento" |
| **Eventos** | Unlocks Journey 2, the other 2/3 of Home's resolution logic (Journey 3), and Journey 4 | Unblocks the largest number of downstream journeys of any single slice | Real value for scheduled-bazaar vendors, not just walk-in sessions | New aggregate (`Event`), new Home branch, genuinely tests architecture not yet exercised (`Session.eventId` non-null path) | Untested — `merchant-user-tester` has never walked a Día N≥2 or Event-active path | Medium-high — new entity, date handling, multi-day continuation logic | New card/list patterns, likely reusable for Resultados' history views |
| **Resultados (Free-tier only)** | Directly serves `company/backlog.md` #2's spirit without needing its blocked dependencies | Depends on nothing new — reads existing Sale/Session data | Ana explicitly wanted this and hit a wall (all 3 walkthroughs) | Read-only, no new write path, lowest architectural risk of the three | Real, already-surfaced want; would close a named finding | Low-medium — mostly display logic over data that already exists | Chart/summary display patterns, first of their kind in this build |
| **Configuración** | Unlocks Paid tier / `nfc`, which unlocks backlog #2 in full | Prerequisite for NFC-mode and Frequent Customers, not valuable alone | Lower standalone value — capability management, not a task Ana starts her day wanting to do | Straightforward — no new aggregate, just capability writes already modeled | Low on its own; high once it unblocks NFC/Paid-tier testing | Low-medium | Toggle/settings-row patterns |

## Recommendation — next slice: **Configuración** (re-evaluated under refined criteria, 2026-08-13)

**Eventos (Slice 3) is now complete** — see "What's built (Slice 3)" above.
This re-evaluation applies the Product Owner's refinement to
`company/CLAUDE.md`'s Product Backlog Ownership section (2026-08-13):
sequencing is no longer led by effort/risk, but by product learning value
first, merchant value second, dependency graph third, effort as a
tie-breaker only. The pre-Eventos priority table above predates this
refinement and is retained as historical record, not reapplied here.

**1. Product learning value — Configuración wins decisively, not narrowly.**
Of the two remaining candidates, only one gates an entirely untested core
product assumption. `defaultSellingMode: 'nfc'` — one of exactly two selling
modes this product's own domain model defines — has never been exercised by
a single `merchant-user-tester` walk across this project's entire history.
Every prior mention of it in this file says the same thing: "structurally
unreachable end-to-end," "NFC Readiness always resolves Not Ready... NFCTag
assignment isn't modeled at all." Configuración is the only slice that can
ever open that door — it's the sole gate to `subscriptionTier=paid`, which
is itself the other genuinely untested assumption (does a merchant actually
opt into the paid tier from inside the app at all — Nahui's core
monetization path, never once exercised end-to-end). Resultados, by
contrast, mostly *confirms* an already-strongly-signaled want (Ana has
explicitly asked for it in every walkthrough this session ran) rather than
*testing* a real unknown — valuable, but a different, lower-risk kind of
learning under the new ordering's own explicit instruction: "an
entirely-untested core assumption... outranks a well-understood, expected
feature, even if repeatedly requested." Honest caveat, not glossed over:
Configuración alone gets us to `nfc` mode being *reachable*, not to full NFC
*selling* being exercisable — "Asignar Tags" (tagging inventory units,
Inventario's own unbuilt corner) is still needed after this slice for a
complete NFC sale to actually happen. Configuración is the necessary first
domino, not the whole chain — still the higher-learning choice, since
nothing downstream of it is reachable at all today.

**2. Merchant value — real, though more indirect for the capability toggles
themselves; immediate and concrete for the sign-out addition.** Ana doesn't
wake up wanting to visit Configuración the way she wants to check Resultados
— but the Product Owner directly identified a real, currently-live gap
during this same conversation: there is no way anywhere in the built product
to sign out of the phone-verified session `authentication.md`/RFC 0007
introduced (Slice 2). That's not a hypothetical future need — it's a
correctness gap in an already-shipped feature, surfaced by actually using
it. Closing it is immediate, concrete merchant value, not a "someday" one.

**3. Dependency graph — Configuración is the single largest unlock left in
the entire backlog.** It's the sole prerequisite for NFC-mode selling and
both stages of Frequent Customers (`company/backlog.md` #2). Resultados
unlocks comparatively little downstream — it's closer to a leaf feature.

**4. Effort — roughly comparable, not the deciding factor either way.** Both
are low-medium; Configuración gains a small, well-scoped addition (the
sign-out function) but neither candidate's effort is high enough to override
what criteria 1–3 already decided.

**Net: Configuración is next**, confirming the direction already agreed in
conversation before this formal re-evaluation, now reasoned explicitly
against the refined criteria rather than the old effort-led ordering.
Resultados remains the standing next-after candidate — nothing above lowers
its value, it's simply outranked by a bigger untested assumption this pass.

### Historical: recommendation that led to Eventos (Slice 3)

**Onboarding (Slice 2) is complete** — see "What's built (Slice 2)" above; the recommendation that follows is for the slice after it, superseding the prior "next slice: Onboarding" pass.

**Why this slice is next.** Of the three remaining real candidates, Eventos unlocks the largest number of downstream journeys of any single slice — it's the direct prerequisite for "Continuar Día N" (the other 2/3 of Journey 3's Home-resolution logic, currently unreachable since `Session.eventId` is always `null`) and Event close/rollup (Journey 4). It also genuinely tests architecture no prior slice has exercised — every walkthrough so far, including this session's, has only ever taken the "nothing scheduled → Iniciar Venta Rápida" branch. Resultados (Free-tier) remains a close second (lower effort, an already-surfaced merchant want across all `merchant-user-tester` runs, no new aggregate) and can be resequenced ahead of Eventos if a future checkpoint shows stronger demand for it — see "Backlog order" below, unchanged from the prior pass on this point.

**What dependencies it resolves.** Establishes the `Event` aggregate and the Event-active Home resolution branch every later multi-day/rollup journey depends on.

**What it unlocks.** Journey 2 in full, the remaining 2/3 of Journey 3, and Journey 4 — the largest single unlock of any remaining candidate.

**Expected risks.** Medium — the largest effort of the three real candidates (new entity, date handling, multi-day continuation logic), and the first slice since Slice 1 to introduce a genuinely new aggregate rather than extend an existing one.

**Expected learning.** Whether a Día N≥2/Event-active path holds together end-to-end for a real merchant — untested by `merchant-user-tester` in every run so far.

This does not change product direction, business behavior, the Foundation, or UX intent — it builds an already-approved spec via the Migration Workflow (D43): `events.md` is the implementation contract, and `architect`'s next step is an Architecture Gap Analysis (implementation-readiness only, not a UX re-evaluation), reported back before the React build starts.

## Backlog order — revised 2026-08-14, post Asignar Tags (Slice 6)

1. ~~Onboarding~~ — complete, Slice 2.
2. ~~Eventos~~ — complete, Slice 3.
3. ~~Resultados (Free-tier + Paid-tier UI)~~ — complete, Slice 5.
4. ~~Configuración~~ — complete, Slice 4. Unlocked Paid tier/`nfc` reachability.
5. **Fix the two genuine regressions (B)** — BusinessIdentity + SellingGroups
   save-error/retry wiring. Not a slice; a direct, ungated fix, cheapest item
   in the inventory, do this regardless of what's picked as "next slice."
6. ~~Asignar Tags~~ (D.1) — **complete, Slice 6 (2026-08-14).** See "What's
   built (Slice 6)" above.
7. **NFC Selling** (D.2) — depends on 6, now satisfied. Recommended next
   slice — see below (recommendation unchanged from the prior pass; the
   dependency it was waiting on is now built).
8. **Paid Receipt Claim Token / QR** (D.3) — depends only on Configuración
   (already built); can run in parallel with 7, not strictly after it.
9. **Customer Loyalty Registration** (D.4) — separate deploy target, own
   future sequencing, not gated on 7-8, needs its own backlog line outside
   this file.
10. **Cross-app Loyalty data bridge** (D.5) — depends on 8 and 9 both
    existing; architecture-level, likely Stage 7-adjacent.
11. **Populated "Tus clientes"/Recompensas** (D.6) — terminal consumer,
    depends on the full 7→10 chain; nothing to build here directly.

`company/backlog.md` #3 (Bazaar recommendation) stays explicitly out of this
sequencing — blocked, no data source exists, not attempted.

### Recommended next implementation slice: **NFC Selling** (D.2)

Asignar Tags (D.1) — the precondition the prior pass's own recommendation
below was building toward — is now complete (Slice 6, 2026-08-14):
`InventoryUnit.tagId` is a real, written field, and a merchant can actually
work a tagging queue to completion. NFC Selling is the direct next domino:
the registration surface itself (`home.md` §3.10) and `home.md` §3.6a's
three remaining non-NFC-surface variants (Limited Ready, capability-revoked,
Ready-but-buttons — reclassified in section C above) all still render
buttons-mode/Not-Ready unconditionally, since Session-open-time NFC
Readiness evaluation (`store.tsx`'s `startSession`) was explicitly out of
Slice 6's own scope and is untouched. This is the same untested-core-
assumption argument the prior recommendation already made for why this
chain matters — reapplied one link further down the chain now that its own
precondition is satisfied, not re-derived from scratch:

**1. Product learning value — decisive.** `defaultSellingMode: 'nfc'` is one
of exactly two selling modes this product's domain model defines, and it has
never been exercised by a single `merchant-user-tester` walk in this
project's history. Configuración (Slice 4) opened the door to Paid tier;
Asignar Tags (Slice 6) opened the door to a real tagged Catalog. NFC Selling
is now the *only* remaining precondition for testing whether NFC selling
holds together at all as a real merchant flow — the single largest untested
core assumption left in the backlog.

**2. Merchant value — real and direct**, unlike Asignar Tags' own indirect
framing (tagging inventory isn't a task Ana wakes up wanting to do). NFC
Selling *is* the product bet itself (`domain-model.md`'s own two-selling-mode
design) — a merchant who chose `nfc` actually gets to sell that way for the
first time in this build.

**3. Dependency graph — the sole remaining gate on the NFC/payment-tier
chain.** It's the direct prerequisite for section (C)'s three reclassified
`home.md` §3.6a variants (Limited Ready, capability-revoked, Ready-but-
buttons) — none of them are reachable without a real selling surface to
resolve `Session.operatingMode` against.

**4. Effort — medium**, the largest single remaining item in the D chain
(a new selling surface plus `Session.operatingMode` resolution logic, not
just a domain field and a queue screen the way Asignar Tags was); doesn't
override 1-3.

**Sequencing note:** the Paid Receipt QR (D.3) has no dependency on NFC
Selling and could be pulled forward in parallel if a second build track is
available — it's independent, not blocked. But as a single next slice, NFC
Selling has the larger, more decisive learning value and is the one item
left that a real merchant-flow validation of `nfc` actually depends on.
