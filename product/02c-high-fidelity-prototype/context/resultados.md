# Slice context — Resultados

Working file per `CLAUDE.md`'s "Per-slice bounded context files" section — referenced
by pointer in every dispatch touching this slice instead of re-typing this content.
Superseded by README.md's own "Resultados pass" archive entry once this slice is
fully Approved (Stage 4 of the knowledge-architecture refactor); not meant to be a
permanent second copy of the same history.

## Contract
`product/02-ux/reports.md` (Approved). IA Journey 5, Review. Strictly read-only —
no new domain writes, no new aggregate.

## Architecture Gap Analysis (2026-08-13) — no blockers
- Confirmed gate: "Tus clientes"/Frequent Customers = `subscriptionTier === 'paid'`
  alone (D34/D40 superseded D22's original joint gate; `loyaltyEnabled` doesn't
  exist anywhere in the model).
- Confirmed Q7 boundary: Eventos' own closed-Event view stays a thin one-line
  rollup + hand-off; the full day-by-day/per-product breakdown belongs here.
- Two real pre-existing wiring gaps found and closed by this slice: Home's
  `home.md §3.12` "Ver detalle" hand-off was never wired (Resultados didn't exist
  yet when Slice 1 built `CloseSummary.tsx`); Eventos' "Ver resumen en Resultados"
  pointed at an internal `Placeholder`.
- `Customer`/`Claim` don't exist in this codebase's domain layer — "Tus clientes"
  renders only `reports.md §3.13`'s zero-Claims empty state, unconditionally; this
  is spec-compliant, not a gap. Recompensas' populated flow (§3.15-§3.18, including
  its one write action) is explicitly out of scope, same treatment as Asignar Tags.

## Build (2026-08-13) — complete, `tsc`/`vite build` clean
New selectors in `src/domain/selectors.ts`: `hasAnyClosedSession`, `allTimeTotals`,
`topProductsAllTime`, `sessionProductBreakdown`, `eventProductBreakdown`,
`historialRows`, `venuePerformance`, `salesTrend`, etc. — reuse `eventRollup`/
`eventDayRows`/`eventsForList`/`sessionTotals` wherever possible, per this
project's "capture business truth once" discipline. New `src/screens/Resultados/`
tree. Both wiring gaps closed. One self-caught bug already fixed (Session
detail's back-label always said "← Resultados" even when returning to an Event
detail). Disclosed judgment calls (full detail in README.md's "Resultados pass"
section): Monday-first week boundary for the sales-trend comparison;
most-recently-closed Session as the same-calendar-date reopen target;
`ResultadosLoadError` built but structurally unreachable (no async load exists).

## Review pipeline — findings requiring a fix round (2026-08-13)

**reviewer (Important):** Cross-tab wiring in this slice newly surfaces "Sesión
rápida" in two places (`SessionDetail.tsx:49`, `ResultadosMain.tsx:197`) — this
prototype already has a disclosed, deliberate "Sesión rápida" → "Venta rápida"
rename (`README.md`, prototype-only, not yet landed in `home.md`'s own spec text).
A merchant now flows Home ("Venta rápida") → close → "Ver detalle" → Resultados
("Sesión rápida") in one continuous action. Fix: apply "Venta rápida" in both new
occurrences; log the substitution in README's existing disclosure entry.

**reviewer (Suggestion):** `hasAnyEventGroupedClosedSession` in `selectors.ts` is
dead code (never imported) — its actual role is filled by `venuePerformance(...).
length === 0` instead. Wire it in as the real gate check or delete it.

**ux-critic (Major #1 — real entitlement-gating leak):** `ResultadosScreen.tsx`'s
`rendimiento`/`venue-detail`/`tus-clientes` branches render unconditionally —
only their *entry points* (the teaser buttons in `ResultadosMain.tsx`) check
`subscriptionTier === 'paid'`. A Paid merchant already sitting on one of these
screens who then has a pending downgrade land (reconciled on `SettingsScreen`
mount, no reload needed) and returns to Resultados stays on a Paid-only screen as
a Free-tier merchant. Data shown is accurate, not misleading — this is a gating
leak, not a data-integrity bug. Fix: guard all three branches with the same
`state.business?.subscriptionTier === 'paid'` check `ResultadosMain.tsx` already
uses at the teaser level, falling back to `{mode:'main'}` otherwise.

**ux-critic (Major #2 — routed as Decision Ownership, not a plain bug):**
`reports.md §3.4/§3.5/§3.6` explicitly annotate the two headline statements
("Tu producto estrella...", "Esta semana vendiste...") with "same visual priority
as Total histórico" — this is the literal fix for a previously-logged Major
(`ux-critic-findings.md` RPT-Q1). The build renders them as plain body text, not
elevated — `DESIGN-SYSTEM.md §5` reserves Fredoka-bold for money-figures/brand
identity, and these aren't money figures, so the build silently resolved a real
conflict between the approved spec's explicit instruction and the Design System's
own restraint rule in the Design System's favor, without disclosing the tension.
**Main's classification:** `reports.md`'s explicit, deliberate spec instruction
wins over `DESIGN-SYSTEM.md`'s general restraint convention — the latter is a
design-system judgment call, not a Foundation-frozen rule, and should flex to
satisfy an already-approved spec's specific instruction. This is `ui-designer`'s
own design judgment (how to elevate — bold Inter, size, an accent color not tied
to Fredoka, or a narrowly-scoped Fredoka exception) — not an Architect/Product
Owner escalation, since nothing Foundation-frozen is at stake.

**ux-critic (Minor #1):** New tappable Día rows (`.dayRow`, En curso/Event detail)
have a smaller tap target (~32px) than this codebase's own established
comfortable-row convention (`CatalogRow.module.css`'s `.row`, ~50px) — Eventos'
own equivalent rows are passive, so there's no prior sizing precedent to inherit.
Fix: bring `.dayRow` padding closer to `CatalogRow`'s convention.

**ux-critic (Minor #2):** Historial's empty-list fallback copy ("Todavía no
tienes días cerrados que mostrar aquí") is new, reachable content `reports.md`
never shows a wireframe for — fine as copy, just missing from README's own
judgment-call disclosure list alongside this pass's other implementation-detail
decisions. Fix: add one line to that disclosure section.

## Status
Fix round complete (2026-08-13) — all six findings from "Review pipeline —
findings requiring a fix round" above closed in one batch by `ui-designer`:
1. "Sesión rápida" → "Venta rápida" applied in both new occurrences
   (`SessionDetail.tsx`, `ResultadosMain.tsx`); README's existing disclosure
   entry logged the substitution.
2. `hasAnyEventGroupedClosedSession` deleted (dead code) rather than wired
   in — `RendimientoPorBazar.tsx` already gates on
   `venuePerformance(state).length === 0`, computed directly for its own
   render.
3. `ResultadosScreen.tsx`'s `rendimiento`/`venue-detail`/`tus-clientes`
   branches now re-check `state.business?.subscriptionTier === 'paid'` on
   every render, falling back to `{mode:'main'}` — the entitlement-gating
   leak is closed.
4. The two headline statements (`ResultadosMain.tsx`'s "Tu producto
   estrella..."/"Esta semana vendiste...") are now visually elevated to
   match "Total histórico"'s weight, per Main's Decision Ownership
   classification — bold Inter heading-weight + `.heroValue strong`'s own
   accent color, not Fredoka. The reusable precedent is now recorded in
   `DESIGN-SYSTEM.md` §5.
5. `.dayRow`'s tap target grew from `6px 0` to
   `var(--space-3) var(--space-1)` padding, closer to `CatalogRow`'s own
   ~50px comfortable-row convention.
6. Historial's empty-list fallback copy is now named in README's own
   judgment-call disclosure list for this pass.

`tsc -b && vite build` both clean, zero errors, after all six fixes. Full
fix-round record: README.md's "Resultados pass" section, "Fix round
(2026-08-13)" subsection.

## Verification (2026-08-13) — clean, both agents

`ux-critic` and `reviewer` independently re-verified all six fixes are
genuinely applied as claimed (not just described) — zero discrepancies
found by either. `reviewer`: zero Blockers, zero Important findings.
`ux-critic`: zero Blockers, zero unresolved Majors.

**Known limitation, logged not fixed (ux-critic Minor, new):** the
entitlement-gating fallback in `ResultadosScreen.tsx` (re-checking
`subscriptionTier === 'paid'` on every render for `rendimiento`/
`venue-detail`/`tus-clientes`, falling back to `{mode:'main'}`) is silent —
unlike `SettingsScreen.tsx`'s own "Tu plan cambió a Gratis el..." ack line
for the same underlying reconciliation event. Realistic path: merchant deep
in a paid subview → switches to Configuración (sees the ack) → switches
back to Resultados → silently lands on Main instead of resuming. Softened
by having already seen the ack in Configuración moments earlier — accepted
as-is per this project's exit criteria (secondary-path Minor, not the core
loop), not reopening the fix round for it. Candidate for a future
`ux-designer`/`ui-designer` pass if it resurfaces.

Next: `merchant-user-tester`.
