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

## What's not built

- **Asignar Tags (Inventario)** — NFCTag assignment isn't modeled at all;
  `nfc` mode is reachable end-to-end (`subscriptionTier=paid` via
  Configuración) but NFC Readiness always resolves Not Ready, since no
  InventoryUnit can ever carry an assigned tag. A full NFC sale still needs
  this built before it's actually exercisable.
- **Frequent Customers / Customer Segmentation** (`company/backlog.md` #2)
  — Stage 1 (NFC-mechanism Claim resolution) needs Asignar Tags built first;
  Stage 2 (Sale-QR mechanism) is now unblocked on the Paid-tier-reachability
  side (Configuración), but still needs its own Claim-resolution mechanism
  built. Free-tier Resultados (counts/totals only, no segmentation) does
  **not** need any of this and is buildable now.
- **Loyalty-claim** (`product/02-ux-loyalty/`) — explicitly out of the
  merchant-app IA (D10/D21/D38), a structurally separate deploy target.
  Not part of this backlog's sequencing; revisited only once Frequent
  Customers' merchant-side Stage 2 is itself in progress.

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

## Backlog order after Onboarding (subject to re-evaluation after each slice)

1. ~~Onboarding~~ — complete, Slice 2.
2. ~~Eventos~~ — complete, Slice 3.
3. **Resultados (Free-tier)** — real, already-surfaced merchant want; low risk; standing next candidate, subject to Main's own re-evaluation.
4. **Configuración** — unlocks Paid tier/`nfc`, prerequisite for Frequent Customers Stage 1/2.
5. **Frequent Customers Stage 1 (NFC-mechanism)** — depends on 4 (and Inventario's Asignar Tags, currently unbuilt within Inventario itself).
6. **Frequent Customers Stage 2 (Sale-QR mechanism)** — depends on 4; `company/backlog.md` #2's own stated priority ordering (Stage 1 before Stage 2) is preserved here.

`company/backlog.md` #3 (Bazaar recommendation) stays explicitly out of this sequencing — blocked, no data source exists, not attempted.
