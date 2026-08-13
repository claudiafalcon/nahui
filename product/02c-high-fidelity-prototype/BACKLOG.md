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
logic only. `subscriptionTier` pinned `free` for the whole slice (D27), so
`nfc` is structurally unreachable; Onboarding is skipped (`Business.name`
pre-seeded, D36). Full record: `README.md`.

## What's not built

- **Onboarding** — no first-run flow exists; `Business.name`/capabilities
  are hardcoded. Approved Low-Fidelity spec already exists
  (`product/02-ux/onboarding.md`).
- **Eventos** (Journey 2: Event scheduling) — nav tab is a placeholder. No
  Event entity, no "Nuevo Evento," no Event-active Home resolution branch.
  Approved spec exists (`product/02-ux/events.md`).
- **"Continuar Día N"** (the other 2/3 of Journey 3's Home-resolution
  logic) — currently unreachable; `Session.eventId` is always `null` in
  this codebase. Depends on Eventos existing.
- **Event close / rollup** (Journey 4) — depends on Eventos + multi-day
  Sessions existing.
- **Resultados** (Journey 5: Review) — nav tab is a placeholder. No
  Session/Event history view, no Free-tier counts/totals, no Paid-tier
  segmentation. Approved spec exists (`product/02-ux/reports.md`).
- **Configuración** (Settings) — placeholder. No capability toggles
  (`subscriptionTier`, `defaultSellingMode`), no way to reach Paid tier or
  `nfc` from inside the app. Approved spec exists (`product/02-ux/settings.md`).
- **NFC/`nfc` registration mode** — structurally unreachable end-to-end
  (needs `subscriptionTier=paid`, reachable only via Configuración, which
  doesn't exist yet) and Asignar Tags (part of Inventario) is unbuilt.
- **Frequent Customers / Customer Segmentation** (`company/backlog.md` #2)
  — Stage 1 (NFC-mechanism Claim resolution) needs `nfc` mode built first;
  Stage 2 (Sale-QR mechanism) needs Paid tier reachable first, i.e.
  Configuración. Neither is buildable yet without an earlier slice.
  Free-tier Resultados (counts/totals only, no segmentation) does **not**
  need any of this and is buildable now.
- **Loyalty-claim** (`product/02-ux-loyalty/`) — explicitly out of the
  merchant-app IA (D10/D21/D38), a structurally separate deploy target.
  Not part of this backlog's sequencing; revisited only once Frequent
  Customers' merchant-side Stage 2 is itself in progress.

## Priority evaluation

| Candidate | Business value | Dependency order | User value | Architectural dependencies | Merchant validation value | Effort | Design-system evolution |
|---|---|---|---|---|---|---|---|
| **Onboarding** | Removes a known, disclosed workaround (`Business.name` hardcoded) blocking a genuine cold-start test | Upstream of everything — every other journey assumes a real Business already exists | Real first-time experience instead of a stand-in | Touches Business-initialization logic other slices already build on top of — better fixed before more work stacks on the workaround | **Already validated as a real gap** — Ana hit "Luna Mercado, unexplained" in all 3 walkthrough runs | Low — approved spec exists, self-contained, no new domain entity (Product Definition/UX Flow Review already done) | Form/wizard patterns likely reusable for Eventos' "Nuevo Evento" |
| **Eventos** | Unlocks Journey 2, the other 2/3 of Home's resolution logic (Journey 3), and Journey 4 | Unblocks the largest number of downstream journeys of any single slice | Real value for scheduled-bazaar vendors, not just walk-in sessions | New aggregate (`Event`), new Home branch, genuinely tests architecture not yet exercised (`Session.eventId` non-null path) | Untested — `merchant-user-tester` has never walked a Día N≥2 or Event-active path | Medium-high — new entity, date handling, multi-day continuation logic | New card/list patterns, likely reusable for Resultados' history views |
| **Resultados (Free-tier only)** | Directly serves `company/backlog.md` #2's spirit without needing its blocked dependencies | Depends on nothing new — reads existing Sale/Session data | Ana explicitly wanted this and hit a wall (all 3 walkthroughs) | Read-only, no new write path, lowest architectural risk of the three | Real, already-surfaced want; would close a named finding | Low-medium — mostly display logic over data that already exists | Chart/summary display patterns, first of their kind in this build |
| **Configuración** | Unlocks Paid tier / `nfc`, which unlocks backlog #2 in full | Prerequisite for NFC-mode and Frequent Customers, not valuable alone | Lower standalone value — capability management, not a task Ana starts her day wanting to do | Straightforward — no new aggregate, just capability writes already modeled | Low on its own; high once it unblocks NFC/Paid-tier testing | Low-medium | Toggle/settings-row patterns |

## Recommendation — next slice: **Onboarding**

**Why this slice is next.** It's the most upstream unbuilt journey — every other candidate either assumes a real Business already exists or doesn't need one. Its absence today is a workaround baked into the codebase (`Business.name` hardcoded, D36's scope decision from Slice 1), not a neutral gap — the longer it stays unbuilt, the more future slices implicitly depend on that workaround rather than the real thing. It also has the lowest risk/effort of the four real candidates (an Approved Low-Fidelity spec already exists, so Stage 1/2 of the workflow are largely already satisfied) while directly closing a finding that's now been independently confirmed three separate times by `merchant-user-tester`.

**What dependencies it resolves.** Removes the `Business.name` pre-seed workaround; establishes the real Business-initialization write path every later slice (Configuración's capability edits, Eventos, Resultados) will read from or extend.

**What it unlocks.** A genuinely complete cold-start walkthrough for the first time — no disclosed workarounds left in the core loop. Indirectly de-risks Configuración (the same "how does a Business's stored identity/capabilities actually get set" logic).

**Expected risks.** Low. The main risk is scope creep into capability-selection UI that more properly belongs to Configuración — Onboarding's own approved spec (`onboarding.md`) already scopes initial capability-setting narrowly (D19: capabilities are a consequence of which onboarding path she picks, never a raw toggle) so this should stay contained.

**Expected learning.** Whether the real Onboarding flow, built with the same Swing Tag design system, holds together as a first impression — this is literally the first screen a real merchant would ever see, and hasn't been visually designed at all yet in this codebase.

This does not change product direction, business behavior, the Foundation, or UX intent — it builds an already-approved spec via the Migration Workflow (D43): `onboarding.md` is the implementation contract, and `architect`'s next step is an Architecture Gap Analysis (implementation-readiness only, not a UX re-evaluation), reported back before the React build starts.

## Backlog order after Onboarding (subject to re-evaluation after each slice)

1. **Onboarding** — proposed above.
2. **Eventos** — highest unlock count of any remaining slice; real architectural validation (the untested 2/3 of Home's resolution logic).
3. **Resultados (Free-tier)** — real, already-surfaced merchant want; low risk; can be resequenced ahead of Eventos if a future checkpoint shows stronger demand for it.
4. **Configuración** — unlocks Paid tier/`nfc`, prerequisite for Frequent Customers Stage 1/2.
5. **Frequent Customers Stage 1 (NFC-mechanism)** — depends on 4 (and Inventario's Asignar Tags, currently unbuilt within Inventario itself).
6. **Frequent Customers Stage 2 (Sale-QR mechanism)** — depends on 4; `company/backlog.md` #2's own stated priority ordering (Stage 1 before Stage 2) is preserved here.

`company/backlog.md` #3 (Bazaar recommendation) stays explicitly out of this sequencing — blocked, no data source exists, not attempted.
