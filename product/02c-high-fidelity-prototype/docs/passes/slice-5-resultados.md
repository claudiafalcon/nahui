# Slice 5 — Resultados

Archived pass history, extracted from `README.md` as part of the
knowledge-architecture refactor (Stage 4, 2026-08-13). This is a pure,
content-preserving move — nothing below is summarized, reworded, or
deleted, only relocated out of the file every dispatch reads by default.
See `README.md`'s own "Pass history index" for the current, durable
reference this archive was split from.

---

## Resultados pass (2026-08-13) — Migration Workflow (D43): Journey 5
(Review), read-only

Builds `product/02-ux/reports.md` (Approved) as its implementation contract.
An Architecture Gap Analysis (`architect`) ran ahead of this pass and found
no blockers, no RFC needed, and nothing requiring Product Owner input — the
confirmed gate condition ("Tus clientes" as a whole gates on
`subscriptionTier === 'paid'` alone, D34/D40 having superseded D22's
original joint gate, and `loyaltyEnabled` no longer existing anywhere in the
model) needed no domain-model change, since `Business.subscriptionTier` was
already shaped this way. Its recommended build order (selectors → shell +
cold start + free-tier main → Session/Event detail → cross-tab hand-offs →
paid-tier main + Rendimiento por bazar → Tus clientes empty branch →
defensive fallback) is what was actually followed, verified below via four
scripted Puppeteer walkthroughs against a live Chrome instance (not mocks;
`puppeteer-core` pointed at the local Google Chrome.app binary, the same
pattern every prior pass's own walkthroughs already establish), screenshots
reviewed at each step.

**New selectors (`src/domain/selectors.ts`), no new domain-model field or
write path.** Every one is a pure filter/reduce over the existing `AppState`
arrays, reusing an already-established computation wherever one existed
(`salesCount` — now exported, was private — for `topProductsAllTime`;
`eventRollup`/`eventDayRows`/`eventCompletedDays`/`eventsForList`/
`sessionTotals`/`findVenue`/`eventStatus`/`dates.ts` reused verbatim
throughout, never re-derived):
`hasAnyClosedSession` (§2 step 1's cold-start gate — distinct from
`activeSession`, which answers a different question); `allTimeTotals`
(sum/count of `SaleItem.pricePaid` across every finalized Sale ever — no
prior selector was all-time-scoped); `topProductsAllTime` (per-Product
piece counts, all-time, ranked descending, filtered to count > 0);
`sessionProductBreakdown`/`eventProductBreakdown` (per-Product SaleItem
counts within one Session / summed across an Event's Sessions — ordered by
Product registration order, matching §3.7's own non-count-sorted wireframe
example rather than inventing a ranking the spec never asked for);
`historialRows` (merges `eventsForList(state).pasados` with standalone
closed Quick Sessions, most-recent-first, via a shared `sortKey`);
`enCursoRows` (one entry per still-`active` Event, carrying only the Día
rows whose Session has actually closed, each with the specific `sessionId`
Session detail needs — see the disclosed judgment call below);
`sessionIdForEventDate` (the same closed-Session resolution `enCursoRows`
needs internally, exposed standalone for Event detail's own Día rows);
`hasAnyEventGroupedClosedSession` (§2 step 4's "Rendimiento por bazar" gate);
`venuePerformance` (one row per Venue, `$ promedio/día` descending — the
identical `eventRollup`-style summation, grouped by `venueId` instead of
`eventId`, per the dispatching task's own instruction); `venueHistorialRows`
(§3.11's filtered Historial — `eventsForList`'s own `pasados`, filtered by
`venueId`); `salesTrend` (the genuinely new aggregation the approved spec
itself leaves unspecified at this fidelity — see its own bullet below).

**Disclosed judgment call — same-calendar-date reopen (`enCursoRows`,
`sessionIdForEventDate`).** Session detail is inherently per-Session, but
`eventDayRows` (reused, not re-derived) already aggregates across Sessions
per calendar date. If a date has more than one *closed* Session (a
lunch-break resume, closed twice the same day), the most-recently-closed one
is used as that Día's representative Session for the tap-through. This
extends Q1's own already-acknowledged "Día N counting" ambiguity
(`product/02-ux/product-decisions.md` Q1 — every other screen in this doc
family already inherits it as-is, per `reports.md` §8 item 4) rather than
introducing a new one. A still-active Event with zero *closed* Días yet is
omitted from "En curso" entirely — nothing to review yet.

**Disclosed judgment call — the sales-trend comparison (`salesTrend`).**
`reports.md` §3.4 explicitly names this "a read-side computation detail, not
specified at this fidelity" and leaves the exact week-boundary rule open.
This build uses Monday-first calendar weeks (not a rolling trailing-7-days
window) — the calendar week a Mexican merchant would actually recognize by
name ("esta semana") — computed from `Sale.finalizedAt` via `dateKey`, the
same moment `todaySalesSummary` already reads for its own "hoy" scoping.
Graceful omission, per §3.4's own explicit rule: if Ana's very first closed
Session postdates last week's Sunday, the statement is omitted rather than
comparing against a week she never had.

**Disclosed judgment call — Historial's empty-list fallback copy.**
"Todavía no tienes días cerrados que mostrar aquí." (`ResultadosMain.tsx`'s
Historial section, reachable whenever a Business has a closed Session/Event
but `historialRows` still returns nothing — not actually reachable through
today's own `hasAnyClosedSession` cold-start gate, but written defensively
since `historialRows` and that gate aren't the exact same condition) is new
copy `reports.md` never shows a wireframe for at this fidelity. Written in
the same register as this screen's other empty-state lines (`emptyNote`'s
"Sin ventas registradas," `RendimientoPorBazar`'s own empty copy) rather than
invented from scratch.

**Nav-tab shell (`src/screens/Resultados/ResultadosScreen.tsx`,
`App.tsx`).** Follows `InventoryScreen`/`EventsScreen`'s own `{mode, ...}`
internal-view-state pattern, lifted to `App.tsx` the same way
`inventoryView`/`eventsView` already are. `ResultadosView` extends the
dispatching task's own sketch type with a `returnTo` field on
`session-detail`/`event-detail` — genuinely needed, not scope creep:
`reports.md` §3.8 explicitly requires back navigation to "follow whatever
path she actually took to arrive" (Historial directly, vs. a "Rendimiento
por bazar" venue drill-down, each with a different back label/destination),
and Session detail can be reached from either the main view directly or
from inside an Event detail reached either way — a flat `{mode:'main'}`-only
shape couldn't represent that chain. **A real bug this pass's own
verification walkthrough caught and fixed**: Session detail's back button
initially always read "← Resultados" even when its actual destination was
an Event detail (a label/destination mismatch a merchant would experience
as a broken back button). Fixed — the label now names the specific Event's
Venue when that's genuinely the parent ("← Plaza Metepec"), matching the
same "name the specific parent, not a generic verb" convention Event
detail's own "← Rendimiento por bazar" label already established. Verified
correct in walkthrough 1 below.

**Screen tree (`src/screens/Resultados/`).** `ResultadosColdStart` (§3.3,
reusing `ColdStart.module.css` verbatim, same as `EventsColdStart`);
`ResultadosMain` (§3.4/§3.5/§3.6 in one component, sections omitted rather
than branched when empty — the same `EventsList` convention); `SessionDetail`
(§3.7); `ResultadosEventDetail` (§3.8 — named to avoid a filename collision
with Eventos' own `EventDetail.tsx`); `RendimientoPorBazar` (§3.9/§3.10 in
one component); `VenueDetail` (§3.11); `TusClientes` (§3.13, rendered
unconditionally — see the scope note below); `ResultadosLoadError` (§3.14,
built but not wired into `ResultadosScreen`'s resolution — see its own doc
comment: there is no real async load anywhere in this synchronous,
localStorage-backed prototype, so this state has no reachable trigger today,
the same disclosed-as-structurally-present-but-unexercised treatment this
codebase already gives other defensive branches). New shared
`Resultados.module.css`, following `EventsList.module.css`/
`EventDetail.module.css`'s own "one shared stylesheet per tab's sibling
screens" convention — every class is either a verbatim reuse of an existing
Eventos-tab pattern (topbar/back, scroll, sectionLabel, card/cardHeadline/
cardSub) or a small, obviously-related addition (hero/headline/teaser/
rankList), no new visual vocabulary invented (`DESIGN-SYSTEM.md` §8/§9,
which explicitly names Resultados' own money-tag rule in advance: a running/
aggregate figure — "Total histórico," every Historial/venue $ total — stays
plain Fredoka or plain Inter body-sm depending on visual weight, never
wrapped in `.moneyTag`, which is reserved for a discrete Product/transaction
price; this build follows `EventsList`'s own existing precedent of rendering
card-level $ totals as plain Inter body-sm text, not Fredoka, reserving
Fredoka for the single hero "Total histórico" figure).

**Scope note — "Tus clientes" renders only §3.13, unconditionally, per the
dispatching task's own explicit instruction.** `Customer`/`Claim` don't
exist anywhere in this build's domain layer (confirmed by the Gap Analysis,
already disclosed in `demoSeed.ts`), so every paid Business is structurally
the zero-Claims case — §3.12's populated segmentation view, and the whole
Recompensas populated flow (§3.15-§3.18, including the "Confirmar recompensa
entregada" write) that hangs off it, are unreachable by construction, not
merely deferred. Same honest-placeholder-with-disclosure treatment already
established elsewhere in this codebase (e.g. Asignar Tags) — not silently
omitted, not stubbed without disclosure.

**Cross-tab wiring — the two real gaps the Gap Analysis found, both closed.**
(1) `home.md` §3.12's "Ver detalle" hand-off was never wired (Resultados
didn't exist yet when Slice 1 built `CloseSummary.tsx`). `CloseSummary` gains
an `onViewDetail` prop and a primary "Ver detalle" button (above the
existing secondary "Entendido," per §6's own minimum-step-count table
treating it as the expected route); `Selling.tsx`'s `onSessionClosed`
callback now also passes the closing Session's own `id`; `HomeScreen.tsx`
threads it through as `onNavigateToResultadosSession`; `App.tsx` wires it to
`{mode:'session-detail', sessionId, returnTo:{mode:'main'}}` +
`setActiveTab('resultados')` — verified end-to-end in walkthrough 2 below
(a real Sale → close → "Ver detalle" → lands directly on Session detail,
not seeded/jumped state). (2) Eventos' "Ver resumen en Resultados"
(`EventDetail.tsx`, Events) previously resolved to an internal `Placeholder`
subView — rewired to a new `onNavigateToResultados` prop, bubbled through
`EventsScreen.tsx` the identical way `onNavigateToHoy` already is;
`App.tsx` wires it to `{mode:'event-detail', eventId, returnTo:{mode:'main'}}`
+ `setActiveTab('resultados')` — verified end-to-end in walkthrough 3 below,
including the Día-row tap-through from the landed Event detail into Session
detail (walkthrough 3's own final step).

**Verification.** `tsc -b && vite build` clean, zero errors, throughout.
Four scripted Puppeteer walkthroughs against a live Chrome instance,
screenshots reviewed at each step:
1. **Seeded-state walkthrough across every reachable screen.** A crafted
   paid-tier `AppState` (two Products, two Venues, three closed Events —
   one still `active` with one closed Día, one fully closed multi-day, one
   single-day closed at a second Venue — plus one standalone closed Quick
   Session) injected directly into `localStorage`, bypassing Authentication/
   Onboarding: Resultados main (paid tier) correctly showed Total histórico
   with ticket promedio, both headline statements, ranked Top productos, both
   paid-tier teasers (populated "Rendimiento por bazar," honest-empty "Tus
   clientes"), "En curso" with its one tappable Día row, and a mixed
   Event-rollup/Quick-Session Historial → "Rendimiento por bazar" (ranked,
   correct `$ promedio/día`) → venue drill-down (§3.11, correct filtered
   Historial) → Event detail (back label correctly "← Rendimiento por
   bazar") → Día row → Session detail (back label correctly "← Plaza
   Metepec" after the bug fix above, confirmed *before* the fix it
   incorrectly read "← Resultados") → back correctly returns to the
   unchanged Event detail → Tus clientes (§3.13, correct copy, no
   populated-state leak).
2. **Home's "Ver detalle" hand-off, real path, not seeded.** Idle → "Iniciar
   Venta Rápida" → tap a Product tile → "Finalizar Venta" → receipt → close
   the Session via the "⋯" menu → close summary correctly showing "Ver
   detalle" above "Entendido" → tap "Ver detalle" → lands directly on
   Resultados' Session detail for that exact Session ("Sesión rápida · 13 de
   agosto · 1 venta · $220 en total · Por producto: Playeras 1"), tab bar
   correctly on Resultados, no intermediate list screen.
3. **Eventos' "Ver resumen en Resultados" hand-off, plus the Día-row
   tap-through.** A seeded free-tier Business with one closed Event → Eventos
   list → Event detail → "Ver resumen en Resultados" → lands directly on
   Resultados' Event detail for that Event (full day-by-day + Por-producto
   breakdown, the exact content `events.md` §3.16/Q7 deferred here) → tap the
   Día row → Session detail, confirming the whole hand-off chain is live end
   to end, not just the first hop.
4. **Cold start + free-tier main, real routing.** A seeded Business with a
   Product but zero closed Sessions → Resultados correctly showed the cold
   start (§3.3) → "Empezar a vender" correctly switched to the Hoy tab
   (landing on Home's own cold start, since no stock was registered either —
   confirming this routes to an existing tab's own resolution, never a
   second selling mechanism) → separately, a seeded free-tier Business with
   one closed Quick Session and one Sale correctly showed the free-tier main
   view (Total histórico + ticket promedio, the "producto estrella"
   statement alone with the sales-trend statement gracefully omitted — no
   "last week" data existed for this seed — Top productos, Historial, and
   the free-tier passive note card), confirming no paid-tier teaser renders
   for a free Business.

**No genuine blocker the Architecture Gap Analysis didn't anticipate.** The
one real defect this pass found (the Session-detail back-label mismatch
above) was found and fixed by this pass's own verification walkthrough, the
same "found and fixed, not shipped" discipline every prior pass in this
README already documents for its own self-caught bugs.

**Fix round (2026-08-13) — `reviewer`/`ux-critic` review pipeline findings,
all six closed in one batch (`context/resultados.md`'s own record of this
round).**
1. **Cross-tab "Sesión rápida"/"Venta rápida" collision (reviewer,
   Important).** `SessionDetail.tsx`'s header and `ResultadosMain.tsx`'s
   Historial card both newly surfaced "Sesión rápida" — the two occurrences
   this Migration Workflow pass introduced without applying the Demo
   Polish pass's own already-disclosed "Venta rápida" rename. Both now read
   "Venta rápida," closing the collision a merchant would hit flowing Home
   ("Venta rápida") → close → "Ver detalle" → Resultados in one continuous
   action.
2. **Dead `hasAnyEventGroupedClosedSession` selector (reviewer,
   Suggestion).** Deleted rather than wired in — `RendimientoPorBazar.tsx`
   already gates on `venuePerformance(state).length === 0`, computed
   directly for its own render; adding a second, separate gate check would
   duplicate the same computation without adding anything a caller needs.
3. **Entitlement-gating leak on `rendimiento`/`venue-detail`/`tus-clientes`
   (ux-critic, Major #1).** `ResultadosScreen.tsx` now re-checks
   `state.business?.subscriptionTier === 'paid'` on every render for those
   three subviews, falling back to `{mode:'main'}` when it fails — closing
   the window where a Paid merchant already sitting on one of these screens
   could have a pending downgrade reconcile (`SettingsScreen`'s own
   mount-time reconciliation) and stay on a Paid-only screen as a
   now-Free merchant.
4. **Headline-statement visual priority (ux-critic, Major #2, routed as
   Decision Ownership).** Main ruled `reports.md` §3.4/§3.5/§3.6's explicit
   "same visual priority as Total histórico" instruction wins over
   `DESIGN-SYSTEM.md`'s general Fredoka-restraint rule for this specific
   case. Resolved without reaching for Fredoka (the two statements are
   sentences, not money figures) — `.headlineLine` now renders bold Inter
   at heading weight in the same accent color `.heroValue strong` already
   uses, matching `.hero`'s actual visual weight. The reusable precedent
   (don't default to Fredoka just because a spec says "match this figure's
   weight" — match the weight via bold Inter + accent color instead) is now
   recorded in `DESIGN-SYSTEM.md` §5 so this isn't re-litigated per screen.
5. **Día-row tap target (ux-critic, Minor #1).** `.dayRow`'s padding grew
   from `6px 0` to `var(--space-3) var(--space-1)`, bringing it closer to
   `CatalogRow.module.css`'s own ~50px comfortable-row convention (there was
   no prior sizing precedent from Eventos to inherit, since its own
   equivalent rows are passive, not tappable).
6. **Undisclosed judgment call — Historial's empty-list copy (ux-critic,
   Minor #2).** Added to this section's own judgment-call disclosure list
   above, alongside the sales-trend and same-calendar-date-reopen entries.

Verified after all six: `tsc -b && vite build` clean, zero errors.

