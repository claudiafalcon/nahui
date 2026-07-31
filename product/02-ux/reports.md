# Resultados — UX Specification

Status: Approved. Full UX Remediation cycle complete — RPT-M1, RPT-M2,
RPT-M3 fixed by `ux-designer`, verified clean by `ux-critic` (zero remaining
Blockers/Majors), and passed `reviewer`'s Foundation-consistency check (no
Blockers; one cross-document Important finding — stale post-renumbering
section references — corrected by Main). See
`product/02-ux/ux-critic-findings.md` for the full finding record.
Scope: `Resultados`, the fourth and last of four top-level nav items per
`product/00-foundation/information-architecture.md`. Covers Journey 5
(Review). Picks up exactly what `product/02-ux/events.md` §3.15 deliberately
deferred per Q7's resolution (`architect-questions.md`, Resolved):
`information-architecture.md`'s nav table assigns "Session/Event summaries"
to Resultados; Eventos only ever shows a thin ambient indicator and hands off
("Ver resumen en Resultados"). Implementation-independent — low-fidelity
only, no visual design.

Out of scope by explicit instruction:
- **No bazaar-recommendation logic** (`company/backlog.md` #3, "Blocked by:
  needs data from multiple vendors... Do not attempt to build"). §3.9 below
  ("Rendimiento por bazar") only ever aggregates Ana's *own* historical
  Sale/Session/Event data — no foot-traffic/weather data, no cross-vendor
  comparison, no forward-looking suggestion copy of any kind. This is
  retrospective "how did I do at each place I've sold" reporting, not "where
  should I go next." Flagged explicitly in §8 and §10 so this boundary isn't
  quietly crossed later.
- **No payments/checkout flow** (`company/CLAUDE.md` non-goals). §3.5's
  paid-tier informational note is passive text only, never a tappable
  "upgrade now" CTA — see §10.
- **No specific customer-segmentation algorithm.** `company/CLAUDE.md`
  describes the *problem* (can't tell a high-volume-occasional buyer from a
  small-but-every-bazaar buyer), not a resolved analytics engine. §3.12 shows
  a plausible, low-fidelity shape for this, explicitly flagged as
  illustrative — both in prose and with an explicit marker directly in the
  wireframe/flow themselves (§3.6, §3.12, §4), not prose alone — see §8's
  primary open question.

## 1. Merchant goal

Resultados is the one tab where Ana isn't doing anything — no customer in
front of her (Home), no merchandise to count (Inventario), no bazaar to book
(Eventos). She opens it to answer one of two questions, at two different
altitudes:

- **"How did I do?"** (retrospective, always available, any tier) — a
  specific day, a specific bazaar, or her whole history at a glance. This is
  the direct continuation of Home's own close-summary ("Ver detalle,"
  `home.md` §3.12) and Eventos' hand-off ("Ver resumen en Resultados,"
  `events.md` §3.15) — both of those screens point here because this is
  where the fuller picture actually lives.
- **"What should I pay attention to, going forward?"** (paid tier only) — not
  "how did today go" but "based on everything I've sold so far, is there a
  pattern worth knowing." This is exactly the two lower-priority validated
  frictions from `company/CLAUDE.md`'s core thesis: which bazares are
  actually worth her time (using only her own history, never multi-vendor
  data), and which customers are loyal vs. occasional. `company/backlog.md`
  #2 confirms this is current MVP UX scope, not deferred — the old
  "blocked until real sales data exists" gate is obsolete
  (`company/lessons.md`, 2026-07-31).

Nothing in Resultados is time-critical the way Home's <3s bar is
(`company/backlog.md` #1) — there's no customer waiting while she looks at a
number. Same posture `inventory.md` §1 and `events.md` §1 already
established: not urgent, but "not urgent" isn't "worth padding with steps."

Resultados otherwise never offers a selling entry point of its own — no
"Iniciar sesión" anywhere in this doc. It is the one tab where "selling is a
state, not a navigation destination" (`global-principles.md`) is expressed
mostly by *absence*: looking backward and selling forward are kept
structurally apart. The one necessary exception is the cold-start hand-off
(§3.3), which — like Home's and Inventario's own cold starts — routes to Hoy
rather than building a second selling mechanism inside this tab.

## 2. Resolution / decision logic

```
1. Has any Session ever reached status = closed (or later, reviewed) for
   this Business?
     → NO:  empty state (§3.3) — nothing to review yet.
     → YES: main Resultados view (§3.4 / §3.5 / §3.6).

2. [Main view] Build the history list, most-recent-first:
     - Every closed Event becomes one Event-rollup row — a read-side
       aggregate across every Session sharing its eventId
       (`domain-model.md`: Event "does NOT own Session as a strict
       aggregate... read-side query across Sessions sharing that ID," the
       exact same non-write-time query events.md §2 already established).
     - Every closed/reviewed Session with eventId = null (a Quick Session)
       becomes its own standalone row — Resultados' history list is the one
       place in the whole app that shows Event-rollups and standalone
       Quick-Session days side by side, because eventId is genuinely
       optional in the model (architecture-principles.md #3) and Eventos
       never lists Quick Sessions at all (they belong to no Event).
     - A Session that's already closed but whose Event is still active
       (Día 1 done, Día 2/3 still ahead) surfaces under a separate "En
       curso" section (§3.4), not folded into Historial and not gated
       behind the whole Event finishing — see §10 for why this differs
       from Eventos' own treatment of the same rows.
     - An Event that closed with zero Sessions never reaches this list —
       Eventos' own zero-Session state (`events.md` §3.16) offers no
       hand-off CTA, so Resultados never receives navigation to it and
       has no Event-detail state of its own for that case.

3. [Any row] Tap → Session detail (§3.7) or Event detail (§3.8).
   Reached exactly one way, and both hand-off entry points converge on the
   same destination:
     - Home's immediate post-close "Ver detalle" (`home.md` §3.12) → Session
       detail directly, regardless of Resultados' own tab state (never
       routes through the cold start or the list first — same pattern as
       Home's upcoming-Event card jumping straight into Eventos' detail,
       `events.md` §3.10 annotation).
     - Eventos' "Ver resumen en Resultados" (`events.md` §3.15) → Event
       detail directly, for that specific Event.

4. subscriptionTier = paid?
     → NO:  main view ends with a passive, non-tappable informational note
       on what paid unlocks (§3.4/§3.5). Nothing beyond counts/totals is
       ever rendered, anywhere in this tab.
     → YES: two additional entry points appear on the main view —
       "Rendimiento por bazar" (§3.9/§3.10) and "Tus clientes"* (§3.12) —
       strictly additive to the free-tier baseline (architecture-principles.md
       #1: capability resolved once, upstream; gates whole sections, never a
       per-screen toggle Ana touches). Both sections always render for a
       paid merchant regardless of data volume — the gate is tier-based, not
       data-based (see the sub-step below for what "no data yet" looks like
       within the first one). (* "Tus clientes" is the doc's one
       illustrative row — see §3.6's annotation and §8 item 1/Q8.)

       Within "Rendimiento por bazar" specifically: has this Business ever
       closed a Session with a non-null `eventId` (i.e., has she ever run a
       Session under an Event, as opposed to only Sesión rápida)?
         → NO:  empty state (§3.10) — a real, reachable case, since
           `company/CLAUDE.md` ties paid-tier eligibility to "own sales
           history," not Event history, and Quick Session is first-class,
           never a lesser path (architecture-principles.md #3). A
           Quick-Session-only paid merchant is a normal outcome, not an edge
           case to leave undefined.
         → YES: populated view (§3.9).
```

**How the three altitudes relate:** all-time (a single ambient card, sum
across everything) sits above Historial/En curso (a list of Event-rollups
and Session-rows) which sits above Session detail (the leaf — one working
day, per-Product counts). Event detail is a middle rollup that itself lists
its own Sessions, each still tappable down to the same leaf. Nothing here is
independently entered or reconciled — every number at every altitude is a
read-side computation over the same underlying Sale/SaleItem/Session/Event
data, per `domain-model.md`. "Rendimiento por bazar" (§3.9) sits at that same
all-time altitude as the ambient card above it — a sum across everything,
just grouped by venue instead of collapsed into one number — and now drills
down the same way the rest of the tab does: tapping a venue row reaches a
filtered Historial (§3.11) at the middle altitude, which reaches Event detail
(§3.8), down to the same Session-detail leaf. No altitude in this tab is a
dead end.

## 3. Low-fidelity wireframes

Conventions inherited from `home.md`/`inventory.md`/`events.md`: `[ ]` =
tappable, plain text = passive/informational, bottom row is the persistent
nav bar on every state, current tab in brackets. Sub-screen navigation
(list → detail) uses already-fetched data, no dedicated loading skeleton of
its own — same scoping choice as the other three docs. One doc-specific
addition: a trailing `*` on a row marks it as **illustrative** (§3.6, §3.12,
§4) — this is a documentation-only annotation for readers of this spec, not
on-screen copy Ana would ever see; it exists purely so a reader working
directly from wireframes/flow (not narrative prose) can tell, at a glance,
that row apart from every other row in this doc, which is real.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │
│        ▢▢▢▢▢▢▢▢▢▢              │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Identical silent-skeleton convention as the other three tabs — not
  re-invented here.

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```

### 3.3 Cold start — no Session ever closed
```
┌───────────────────────────────┐
│  Resultados                    │
│  Aquí vas a ver cómo te fue,     │
│  en cuanto cierres tu primera    │
│  sesión de venta.                 │
│      [ Empezar a vender ]        │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Routes to Hoy, an existing tab — not a new destination invented for this
  one case, same pattern `home.md` §3.3 and `inventory.md` §3.3 already
  established. Home resolves whatever's actually appropriate itself (idle,
  cold start, or already-active-Event) — Resultados doesn't re-derive that
  logic. *global-principles.md*, "the fastest interaction is the one that
  never happens."
- No fake "review" content shown for something that hasn't happened yet.

### 3.4 Main view — free tier, with a still-active Event (En curso present)
```
┌───────────────────────────────┐
│  Resultados                    │
│  Total histórico                  │
│  48 ventas · $14,230               │
│                                │
│  En curso                       │
│  ┌───────────────────────────┐ │
│  │ Bazar Plaza Norte           │ │
│  │ Día 1 · 12 jul · 5 ventas · $610│ │
│  └───────────────────────────┘ │
│                                │
│  Historial                      │
│  ┌───────────────────────────┐ │
│  │ Bazar Metepec                │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Sesión rápida · 20 jul        │ │
│  │ 4 ventas · $560                │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Con el plan de pago vas a ver │ │  passive note, not tappable
│  │ cómo te fue por bazar y        │ │
│  │ quiénes son tus clientas        │ │
│  │ frecuentes.                    │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- "Total histórico" is a pure sum across every Session ever closed —
  free-tier eligible, it's a total, not a segmentation
  (`domain-model.md` capability table).
- "En curso" holds one card per still-active Event, listing every Día
  already closed under it as its own tappable row — a deliberate
  improvement over Eventos' own treatment of the same rows: `events.md`
  §3.13/§3.14 keeps them passive there ("reviewing a closed day's detail is
  Resultados' job"). This is where that job actually happens. Note:
  "En curso" tolerates Q3's open gap (two simultaneously active Events, see
  §8 item 6) more gracefully than Home's single "Continuar Día N" CTA does —
  since this is a list of cards, not a single button, showing two Activo
  Events here doesn't require picking a winner the way Home's resolution
  logic does.
- Section headers ("En curso"/"Historial") only render when they have ≥1
  card — same rule `events.md` §3.4 established for Activo/Próximos/Pasados.
- Historial mixes Event-rollup cards and standalone Sesión-rápida cards in
  one reverse-chronological list — see §2, §10.
- The paid-tier note is plain informational text, not a card with a tap
  target — see §10 for why no upgrade CTA is designed here.

### 3.5 Main view — free tier, no active Event (most common day-to-day)
```
┌───────────────────────────────┐
│  Resultados                    │
│  Total histórico                  │
│  48 ventas · $14,230               │
│                                │
│  Historial                      │
│  ┌───────────────────────────┐ │
│  │ Bazar Metepec                │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Sesión rápida · 20 jul        │ │
│  │ 4 ventas · $560                │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Con el plan de pago vas a ver │ │
│  │ cómo te fue por bazar y        │ │
│  │ quiénes son tus clientas        │ │
│  │ frecuentes.                    │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Same layout rule as §3.4, En curso genuinely absent — most días have no
  Event running, same framing `events.md` §3.5 used for its own equivalent
  state.

### 3.6 Main view — paid tier
```
┌───────────────────────────────┐
│  Resultados                    │
│  Total histórico                  │
│  48 ventas · $14,230               │
│                                │
│  Rendimiento por bazar    [Ver más ▸]│
│  Bazar Plaza Norte · $780/día        │
│                                │
│  Tus clientes*            [Ver más ▸]│
│  6 frecuentes · 14 ocasionales        │
│                                │
│  Historial                      │
│  ┌───────────────────────────┐ │
│  │ Bazar Metepec                │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Sesión rápida · 20 jul        │ │
│  │ 4 ventas · $560                │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Same baseline as §3.4/§3.5 (Total histórico, En curso when applicable,
  Historial), plus exactly two additional entry points — never a
  replacement, never a different app. *architecture-principles.md* #1:
  `subscriptionTier` gates whole sections, resolved once upstream, never a
  per-screen toggle Ana touches or is asked about.
- The free-tier informational note (§3.4/§3.5) disappears entirely once
  paid — she already has what it was telling her about.
- Each summary row here is a one-line teaser of its own full view:
  "Rendimiento por bazar" → §3.9 (or §3.10 if she has no Event-grouped
  Sessions yet); "Tus clientes" → §3.12 — same pattern as Home's own header
  being a teaser of session-controls (`home.md` §3.7).
- **`*` marks "Tus clientes" as the illustrative row (§3.12, §8 item 1/Q8) —
  a documentation-only marker for readers of this spec, not on-screen copy.**
  Ana would never see a literal asterisk, or a label like "(ilustrativo),"
  on this screen; if/when Q8 resolves this into a real feature, the row
  renders identically styled to "Rendimiento por bazar" above it — same
  typography, same "[Ver más ▸]" affordance, no visual demotion. The marker
  exists solely so a reader working from this wireframe, rather than the
  surrounding prose, can tell these two paid-tier rows are fundamentally
  different in kind: one is real data with an honest approximation (Q9,
  §8 item 2), the other has no resolved data source at all, pending a
  Business Decision (Q8, §8 item 1). Same marker reused in §3.12's own
  header and §4's flow line.
- If this Business has never closed an Event-linked Session
  (Quick-Session-only history — a real, reachable case, see §3.10), the
  "Rendimiento por bazar" teaser shows an honest empty summary instead of
  sample data:
  ```
  Rendimiento por bazar    [Ver más ▸]
  Aún no hay bazares para mostrar
  ```
  "Tus clientes" is unaffected — its data source is Sales/Sessions
  generally, not Event-grouped, so it renders normally regardless. Tapping
  "[Ver más ▸]" on the empty variant still leads somewhere real (§3.10), not
  a dead end.

### 3.7 Session detail
```
┌───────────────────────────────┐
│ ← Resultados                     │
│  Bazar Plaza Norte · Día 2        │
│  13 de julio                      │
│                                │
│  8 ventas · $1,120 en total        │
│                                │
│  Por producto:                   │
│   Pijama              5            │
│   Sudadera/Maxy        2            │
│   Calcetines           3            │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Header shows "[Nombre del Evento] · Día N" when `eventId` is set, or
  "Sesión rápida" (reusing Home's own vocabulary for the same concept,
  `home.md` §3.4) when it isn't — never "Session" anywhere in copy.
  *architecture-principles.md* #4.
- "8 ventas" = number of finalized Sale transactions (same meaning as
  Home's header, `home.md` §3.7); "Por producto" counts are a different
  axis — SaleItems per Product, which is why they don't have to sum to 8.
  This distinction is deliberate, not an inconsistency: `domain-model.md`
  is explicit that "selling 2 Hoodies produces 2 SaleItems" within one Sale.
  Free-tier eligible — this is a count, not a segmentation.
- "Día N" reuses Home's exact computed value (`home.md` §2, §7), never
  recalculated here — and inherits Q1's open ambiguity as-is (see §8).

### 3.8 Event detail — closed
```
┌───────────────────────────────┐
│ ← Resultados                     │
│  Bazar Plaza Norte                │
│  Bazar · 12-14 de julio            │
│  Plaza Norte                      │
│                                │
│  3 días · 18 ventas · $2,340       │
│                                │
│  Día 1 · 12 jul · 5 ventas · $610   │
│  Día 2 · 13 jul · 8 ventas · $1,120 │
│  Día 3 · 14 jul · 5 ventas · $610   │
│                                │
│  Por producto (todo el evento):    │
│   Pijama              10           │
│   Sudadera/Maxy        6            │
│   Calcetines           4            │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- This is the exact content `events.md` §3.15/§10 deliberately removed from
  Eventos per Q7's resolution — passive identity there, full breakdown
  here. Reached three ways: directly from Resultados' own Historial
  (§3.4/§3.5), via Eventos' "Ver resumen en Resultados" hand-off, and now
  also via a "Rendimiento por bazar" venue drill-down (§3.11) — same
  destination every time, never a duplicated or divergent detail screen per
  entry point.
- Día rows are tappable → Session detail (§3.7) for that specific day —
  unlike Eventos' own passive Día rows (`events.md` §3.13/§3.14), which are
  intentionally not tappable there.
- "Por producto (todo el evento)" sums SaleItems across every Session
  sharing this `eventId` — free-tier eligible, same reasoning as §3.7.
- Back navigation ("← Resultados" shown above) follows whatever path she
  actually took to arrive — standard back-stack behavior, not a hardcoded
  jump to the tab root. The label reflects the common case (direct entry
  from Historial or an Eventos hand-off, both one hop from the main view).
  Arriving via §3.11's venue drill-down instead returns to §3.11, then §3.9,
  then the main view — same screen, same content, nested one level deeper.

### 3.9 Rendimiento por bazar (paid) — con datos
```
┌───────────────────────────────┐
│ ← Resultados                     │
│  Rendimiento por bazar             │
│                                │
│  Bazar Plaza Norte                 │
│   3 eventos · $780 promedio/día      │
│  Bazar Metepec                     │
│   2 eventos · $520 promedio/día      │
│  Expo Toluca                       │
│   1 evento · $310 promedio/día        │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Ordered by "$ promedio/día" descending — a plain sort by magnitude, la
  same way any of her own totals would naturally sort in a list, **not** a
  recommendation ranking. No "deberías ir a..." copy, no forward-looking
  suggestion of any kind — this is retrospective, single-vendor data only,
  deliberately distinct from `company/backlog.md` #3's blocked bazaar-
  recommendation feature (needs multi-vendor foot-traffic/weather data,
  "do not attempt to build"). See §8 and §10.
- Grouping key is the Event's own `Nombre` (exact string match) — the
  domain model has no separate Venue/Location identity; `Lugar`
  (`events.md` §3.6) is optional freeform text, not an identifier. This is
  an honest approximation, flagged explicitly in §8, not a resolved
  architecture.
- "$ promedio/día" divides an Event's total by its number of closed
  Sessions — inherits Q1's Día-N-counting ambiguity exactly the same way
  §3.7/§3.8's "Día N" does (see §8).
- **Each venue row is tappable** → a filtered Historial view scoped to that
  venue (§3.11), restoring the three-altitude drill-down (§2) the rest of
  this tab already has: this screen is itself an all-time-altitude view
  (a sum across everything, grouped by venue); tapping a row descends to the
  middle altitude (Event-rollups for that venue only), and from there down
  to the same Session-detail leaf. No number here is un-inspectable.
- If this Business has zero Event-grouped Sessions (Quick-Session-only
  history), this screen instead renders as §3.10's empty state — not a
  broken, silently-blank list.

### 3.10 Rendimiento por bazar (paid) — sin eventos registrados (empty state)
```
┌───────────────────────────────┐
│ ← Resultados                     │
│  Rendimiento por bazar             │
│                                │
│  Esto se arma agrupando tus        │
│  ventas por evento agendado en      │
│  Eventos. Hasta ahora, todo lo      │
│  que llevas cerrado son sesiones    │
│  rápidas — no hay bazares que        │
│  mostrar todavía.                  │
│      [ Ver Eventos ]              │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- **A real, reachable scenario, not a hypothetical.** `company/CLAUDE.md`'s
  paid-tier eligibility is tied to "own sales history," not Event history,
  and Quick Session is explicitly first-class, never a fallback
  (architecture-principles.md #3, `home.md` §10) — a merchant can pay for
  the paid tier, sell plenty, and never once use Eventos. Without this
  state, §3.9 would otherwise render as a silent, broken-looking blank
  screen the first time a Quick-Session-only paid merchant opened it.
- **Plain, factual, no guilt-tripping copy** — same brand posture as
  `events.md` §3.16's "No registraste ventas en este evento": Quick-Session-
  only selling is a normal, valid way to use the app, not a shortfall to be
  corrected. Nothing here implies she's using Nahui "wrong" or should change
  how she sells to unlock this. Directly upholds the brand guide's rule
  against framing bazaar vendors' own workflow as lesser or in need of
  correction.
- **"[ Ver Eventos ]" routes to an existing tab**, same restraint as every
  other cold start in this doc family (§3.3, `home.md` §3.3, `events.md`
  §3.3) — no new destination invented, and tapping it is optional and
  informational, not a forced funnel: the rest of Resultados (Total
  histórico, Historial, Tus clientes) stays fully visible and useful with or
  without ever tapping it.
- **"Tus clientes" (§3.12) is unaffected by this same condition** — its
  grouping doesn't depend on Event `Nombre`, only on Sales generally, so a
  Quick-Session-only paid merchant still sees real segmentation there even
  while "Rendimiento por bazar" is empty. The two paid-tier sections can be
  independently empty or populated; neither one's state depends on the
  other.

### 3.11 Rendimiento por bazar — detalle de bazar (Historial filtrado)
```
┌───────────────────────────────┐
│ ← Rendimiento por bazar           │
│  Bazar Plaza Norte                │
│  3 eventos · $780 promedio/día      │
│                                │
│  ┌───────────────────────────┐ │
│  │ Bazar Plaza Norte            │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Bazar Plaza Norte            │ │
│  │ 2 días · 9 ventas · $1,050    │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Bazar Plaza Norte            │ │
│  │ 1 día · 5 ventas · $610       │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Reached by tapping any venue row in §3.9 — **not a new screen type.** Same
  Event-rollup card shape already used in Historial (§3.4/§3.5/§3.6),
  filtered to only the Events whose `Nombre` exact-matches this row's venue
  name — the identical grouping key §3.9's own aggregate already uses (§8
  item 2/Q9), so what she sees filtered here is exactly what was summed
  there, never a separately-derived list.
- Each card is tappable → Event detail (§3.8), the same destination and
  mechanism as tapping straight from Historial — no new detail screen
  invented for this entry point. From there, Día rows tap through to
  Session detail (§3.7) exactly as they already do everywhere else in this
  tab.
- Quick Sessions never appear here, same as they never contribute to §3.9's
  aggregate — a Quick Session has no venue/Event `Nombre` to group by, so
  there is nothing inconsistent about their absence.
- Back arrow reads "← Rendimiento por bazar," not "← Resultados," because
  this screen's immediate parent is §3.9, not the main view — the same
  logic that makes §3.7/§3.8/§3.9's own "← Resultados" correct for *their*
  immediate parent. Standard back-stack behavior, not a new convention.
- **If Q9's fragmentation risk ever manifests** (a typo splits one real
  venue into two rows in §3.9), this is where she'd first notice it: two
  visually distinct venue names in what she knows was one bazaar, each
  showing a plausible-looking but incomplete Event list. This view doesn't
  resolve Q9's underlying ambiguity, but it gives her a concrete way to
  notice a silent split instead of none at all.

### 3.12 Tus clientes* — segmentación (paid, illustrative)
```
┌───────────────────────────────┐
│ ← Resultados                     │
│  Tus clientes*                    │
│                                │
│  Frecuentes                       │
│   6 clientas · te compraron en     │
│   3 bazares o más                    │
│                                │
│  Ocasionales                       │
│   14 clientas · te compraron        │
│   1 o 2 veces                       │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- `*` — same documentation-only marker introduced in §3.6/§4; see that
  annotation for what it does (and doesn't) mean for on-screen copy. Ana
  would see a plain "Tus clientes" header here, with no asterisk.
- **Explicitly illustrative, not a fully-specified feature** — per the
  task's own constraint, this shows a plausible shape for the friction
  `company/CLAUDE.md` describes ("can't tell a high-volume-occasional buyer
  from a small-but-every-bazaar buyer"), not an invented, resolved
  segmentation algorithm. The "3 bazares o más" / "1 o 2 veces" thresholds
  are placeholders for illustration only, not a validated rule.
- **This screen's real data source is this doc's primary open question**
  (§8) — the merchant-facing app currently has no way to know two different
  Sales belong to the same repeat customer. That link only exists via
  Loyalty-claim (Customer/Claim), which `domain-model.md` and
  `ubiquitous-language.md` both describe as customer-facing, zero merchant
  IA presence. Shown here per the explicit instruction to design a
  plausible low-fidelity view, not to pretend the gap doesn't exist.

### 3.13 Defensive fallback / load error
```
┌───────────────────────────────┐
│  No pudimos cargar tus            │
│  resultados. Intenta de nuevo.      │
│      [   Reintentar   ]           │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Manual `Reintentar`, same convention as `events.md` §3.17 (not Home's
  silent auto-retry) — Resultados carries no live-customer risk that would
  justify Home's more aggressive behavior.
- Nav bar stays fully functional — a Resultados load failure never
  cascades into blocking Hoy/Inventario/Eventos or selling.

## 4. Interaction flow (summary)

```
Open Resultados tab
  → resolve (§2, automatic)
      → load fails ─────────────────────→ fallback (3.13), Reintentar
      → no Session ever closed ─────────→ cold start (3.3) → Hoy
      → Sessions exist ──────────────────→ main view (3.4/3.5, or 3.6 if paid)

Main view:
  tap an "En curso" Día row      → Session detail (3.7)
  tap a Historial Event card      → Event detail (3.8)
  tap a Historial Sesión rápida card → Session detail (3.7)
  [paid only] tap "Rendimiento por bazar" → 3.9 (or 3.10 if this Business has
    no Event-grouped Sessions yet — see §2 step 4)
  [paid only] tap "Tus clientes"*         → 3.12
    (* illustrative, no resolved data source — see §3.6's annotation, §8
    item 1/Q8; same marker shown in §3.6 and §3.12's own header)

Rendimiento por bazar (3.9):
  tap a venue row → filtered Historial for that venue (3.11)
    → tap an Event-rollup card → Event detail (3.8)
      → tap a Día row → Session detail (3.7)
  (same three-altitude drill-down §2 already establishes for the rest of
  this tab — see §2's "How the three altitudes relate")

Event detail (3.8):
  tap any Día row → Session detail (3.7) for that day

Elsewhere (entry points into this tab's screens, not from the tab itself):
  Home's post-close "Ver detalle" (home.md §3.12)     → Session detail (3.7)
    directly, for the Session that just closed
  Eventos' "Ver resumen en Resultados" (events.md §3.15) → Event detail (3.8)
    directly, for that specific closed Event
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no Session ever closed
4. Main view — free tier, with a still-active Event (En curso present)
5. Main view — free tier, no active Event (most common day-to-day)
6. Main view — paid tier (adds Rendimiento por bazar / Tus clientes)
7. Session detail
8. Event detail — closed (day-by-day breakdown + totals)
9. Rendimiento por bazar (paid) — con datos
10. Rendimiento por bazar (paid) — sin eventos registrados (empty state)
11. Rendimiento por bazar — detalle de bazar (Historial filtrado)
12. Tus clientes — segmentación (paid, illustrative)
13. Defensive fallback / load error

Notably fewer states than `home.md` (22), `inventory.md` (18), or
`events.md` (17) — Resultados has no forms, no writes, no destructive
actions, and therefore no confirmation dialogs, no draft-preservation
states, and no save/error pairs. It's the only one of the four tabs that is
purely read-side. The two new states added during this remediation pass
(§3.10, §3.11) are both still read-only, so this remains true.

## 6. Minimum step count

| Scenario | Taps | Why it can't be fewer |
|---|---|---|
| Ver el resumen justo al cerrar una sesión | 1 (Ver detalle, `home.md` §3.12) | Home's immediate confirmation already identifies exactly which Session; this is a direct hand-off, not a second search. |
| Ver el total histórico | 1 (abrir la pestaña) | It's the first thing shown, no further tap needed. |
| Ver el detalle de un día ya cerrado, desde Resultados | 2 (abrir pestaña → tocar la fila) | Shortest possible once she's browsing rather than being handed off directly. |
| Ver el resumen completo de un evento ya cerrado, desde Resultados | 2 (abrir pestaña → tocar la tarjeta) | Shortest path when she's already browsing Resultados directly. |
| Ver el resumen completo de un evento ya cerrado, desde Eventos | 3 (abrir Eventos → tocar tarjeta → Ver resumen en Resultados) | One hop more than arriving directly (`events.md` §6 counts only the 2 taps taken once already inside Eventos, not the initial tab-open — counted on the same basis as this row, the Eventos route costs one more tap than going to Resultados directly. Not a defect: Eventos' hand-off exists for someone who started there for Eventos' own reasons, not to be the fastest route to a report.) |
| Ver rendimiento por bazar / Ver tus clientes (paid) | 2 (abrir pestaña → Ver más) | Same shape as the row above — a one-line teaser plus one tap into the full view. |
| Ver qué eventos componen un renglón de "Rendimiento por bazar" | 3 (abrir pestaña → Ver más → tocar el renglón del bazar) | One tap deeper than reaching the summary itself (row above) — the same per-altitude cost §2 already establishes for Historial → Event detail, just entered from a different starting altitude. |
| Ver el evento específico detrás de ese renglón | 4 (abrir pestaña → Ver más → tocar el renglón → tocar la tarjeta del evento) | Same destination and cost as reaching Event detail from Historial directly (two rows above) — the venue filter adds exactly one tap, never more. |

Resultados has no comparable hard speed requirement to Home's <3s bar
(`company/backlog.md` #1) — same posture `inventory.md` §6 and `events.md`
§6 already established for their own non-selling contexts. The floor above
is about not adding unnecessary steps, not about racing a customer who isn't
there; no urgency is invented where none exists.

## 7. Automation opportunities

- All-time, Event-rollup, and Session totals are all computed, never
  entered or reconciled by hand.
- Which section a row appears under (En curso vs. Historial) — a pure read
  of Event/Session status, never a manually maintained list, same pattern
  `events.md` §7 already established for Activo/Próximos/Pasados.
- "Día N" and per-Event rollups reuse Home's/Eventos' already-computed
  values — never re-derived with separate logic (*global-principles.md*,
  "capture business truth once, reuse it forever").
- Paid-tier sections (§3.9/§3.10/§3.12) appear or disappear as whole units
  based on `subscriptionTier`, never a per-screen or per-visit toggle —
  whether "Rendimiento por bazar" specifically shows data or its empty
  state (§3.9 vs. §3.10) is a separate, data-based read, never a manual
  toggle either.
- Per-Product breakdowns (§3.7/§3.8) are aggregated automatically from
  SaleItems, never typed or summarized by Ana herself.
- Cold-start vs. main-view resolution reuses the same "has anything closed
  yet" read the rest of the app already understands — not a separately
  tracked flag.
- The venue drill-down (§3.11) reuses §3.9's own exact-name grouping key
  and Historial's own card shape — computed once, read twice, never a
  separately maintained list.

## 8. Open questions

1. **[Escalated as Q8, primary — logged in `company/business-decisions.md`
   as a Business Decision] Does the Foundation's customer-segmentation
   intent (`company/CLAUDE.md`, `company/backlog.md` #2) require
   merchant-visible customer identity, and if so, how does that reconcile
   with Loyalty-claim's explicit "customer-facing, zero merchant IA
   presence" design (`domain-model.md` bounded contexts,
   `ubiquitous-language.md`)?** Right now, nothing in the Foundation gives
   the merchant app a way to know that two different Sales came from the
   same repeat customer — that link only ever forms via a post-sale tag scan
   on the *customer's* own device (D10), and is deliberately excluded from
   merchant IA (`information-architecture.md`'s own "Explicitly out of
   scope: loyalty-claim" section). §3.12 ("Tus clientes") is designed as an
   explicitly illustrative placeholder — it is not backed by a resolved data
   source. This distinction is now also visible directly in the
   wireframes/flow themselves (§3.6, §3.12's own header, §4), not only here
   in prose. This is a genuine tension between two Foundation documents, not
   something UX should resolve unilaterally.

2. **[Escalated as Q9, logged in `product/02-ux/product-decisions.md` as a
   Product Decision] Is "venue/bazaar" meant to be its own identity,
   distinct from Event.Nombre?** §3.9's "Rendimiento por bazar" can only
   group by exact string match on the freeform `Nombre` field
   (`events.md` §3.6) — there's no Venue/Location entity in
   `domain-model.md`, and `Lugar` is optional, freeform text, not an
   identifier. A typo or slight renaming across visits would silently
   fragment what should be one row. Not resolvable from the Foundation as it
   stands — this spec proceeds with exact-name-match as a stated, honest
   approximation, not a precise architecture. A tap-through from each §3.9
   row into a filtered Historial view (§3.11) now lets her inspect exactly
   which Events fed a given row — it doesn't resolve this ambiguity, but
   means a silent fragmentation (a typo'd venue splitting into two rows)
   is at least visible and noticeable to her, not invisible.

3. **[Escalated as Q10, non-blocking, logged in `product/02-ux/product-decisions.md`
   as a Product Decision] What sets Session.status =
   `reviewed`, and by whom?** `domain-model.md`'s own Session lifecycle
   (`not_started → active → closed → reviewed`) already includes this
   state, and Resultados (Journey 5, "Review") is the obvious place it would
   matter — e.g., an "unread" marker on Historial rows. Explored designing
   exactly that, then withdrew it: Resultados maps to the `Intelligence`
   bounded context, which `domain-model.md`'s own table marks explicitly
   **read-only** over Selling (Session's owning context) —
   `architecture-principles.md` #6 (one-way dependency, nothing writes
   back) means Resultados cannot be the thing that flips this status
   without breaking a frozen rule. Nothing else in the Foundation sets this
   state either. No reviewed-marking mechanic was designed, rather than
   invent a write path that contradicts the frozen dependency graph.

4. **Q1 ("Día N" counting) — not new, directly relevant here.**
   `home.md` §8 / `product/02-ux/product-decisions.md` Q1 (reclassified from
   `architect-questions.md` as a Product Decision): whether a same-calendar-day
   Session reopen increments "Día N" or collapses into the same day number
   remains open. §3.7's "Día N" and §3.8's per-Día rows and §3.9's "$
   promedio/día" all reuse Home's existing computed value as-is and inherit
   this ambiguity without resolving it — same treatment `events.md` gave it.

5. **Q2 (untagged-unit sellability) — checked, confirmed not relevant.**
   Resultados never touches the tagging workflow or unit-level sellability
   preconditions; it only reports on Sales that already completed.

6. **Q3 (overlapping active Events) — not new, cross-referenced.** Logged
   from `home.md`/`events.md` §8: no tie-break rule exists for two
   simultaneously active Events. "En curso" (§3.4) tolerates this gap better
   than Home's single CTA does, since it's a list of cards rather than one
   button — see the annotation in §3.4. Not re-invented or re-resolved here.

7. **[Suggestion, not escalated as a new Q] Placing "which bazares are worth
   her time" (§3.9) under paid tier is an inference, not an explicit
   statement in `company/CLAUDE.md`.** `company/CLAUDE.md`'s Business Model
   Direction ties the paid tier explicitly to "customer segmentation" and
   defers "bazaar recommendations" separately ("eventually, needs
   multi-user data"). This doc's own-data-only "Rendimiento por bazar" is
   materially different from that blocked recommendation feature (no
   multi-vendor data involved), but its specific placement in the paid tier
   — rather than free — is this doc's inference from the Core Thesis
   friction list, not an explicit instruction. Flagging for Architect/Planner
   visibility rather than treating it as settled.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — cold start's
  CTA reuses Hoy rather than inventing a new destination (§3.3); Home's and
  Eventos' hand-offs land directly on Session/Event detail, never routing
  back through Resultados' own list first (§2, §4); paid-tier sections
  appear as whole units, never a per-visit toggle (§3.6); the "Rendimiento
  por bazar" empty state (§3.10) shows no fabricated venue data and forces
  no navigation elsewhere — she simply isn't shown something that doesn't
  exist yet, the same restraint as Resultados' own top-level cold start
  (§3.3).
- *"Never ask twice"* — nothing in this tab asks Ana to re-enter or confirm
  a number the system already computed; §7 is the direct enumeration.
- *"Technology should disappear"* — loading states stay silent unless
  genuinely slow (§3.1/§3.2), identical convention to the other three tabs.
- *"Selling is a state, not a navigation destination"* — Resultados offers
  no selling entry point of its own anywhere except the cold-start hand-off
  to Hoy (§3.3, same exception every other tab's cold start makes),
  expressing this principle mostly by deliberate absence (§1).
- *"Business language before technical language"* — copy uses "Sesión
  rápida," "Día N," "Por producto," "clientas frecuentes" — never
  "Session," "SaleItem," "eventId," or "Customer," anywhere on screen.
- *"The merchant experiences Products, the platform preserves Inventory
  traceability"* — §3.7/§3.8's "Por producto" breakdowns are Product-name +
  count only, never a Lot/InventoryUnit reference.
- *"Every repeated decision should become automation"* — §7 is the direct
  enumeration applied to Resultados.
- *"Capture business truth once, reuse it forever"* — Día N, Event rollups,
  and "which section a row belongs under" are all reused from Home's/
  Eventos' existing computations, never re-derived (§2, §7); the venue
  drill-down (§3.11) reuses the exact same grouping key and card shape §3.9
  already computes, rather than deriving a second, parallel list.
- *"Collect data today. Create intelligence tomorrow."* — directly names
  this tab's whole premise: free tier is the "collect" side (counts/totals
  over data already captured elsewhere), paid tier (§3.9/§3.12) is the
  first designed expression of "intelligence" over that same data, exactly
  the two lower-priority validated frictions `company/CLAUDE.md` names.
- *"The best interface stays out of the merchant's way"* — no forms, no
  destructive actions exist in this tab, so there's nothing to protect her
  from losing; the load-failure fallback (§3.13) never blocks the rest of
  the app; a Quick-Session-only paid merchant is shown a plain, factual
  empty state (§3.10), never treated as a failure or an incomplete way of
  using the app.

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — `subscriptionTier` gates two
  whole sections (§3.9/§3.10/§3.12), decided at the Business level, never a
  per-screen or per-visit question. Whether "Rendimiento por bazar" shows
  data or its empty state (§3.9 vs. §3.10) is a separate, data-based axis —
  it doesn't contradict this principle, since the section itself is still
  always present for a paid merchant; only its content varies with what
  actually exists to show.
- *#3 (optional relationships stay optional in the data model)* — Historial
  mixing Event-rollups and standalone Sesión-rápida rows (§2, §10) only
  works because `Session.eventId` is genuinely nullable, not a UI
  workaround. The same nullability is exactly why a Quick-Session-only
  paid merchant is a normal, modeled outcome, not an edge case requiring a
  UI trick — it's the direct reason §3.10 exists.
- *#4 (internal-only entities never leak into user-facing language)* —
  Session, Sale, SaleItem, and Event are never named as such; "Día N,"
  "ventas," "Por producto" carry the same weight without exposing the
  model.
- *#6 (one-way dependency direction)* — directly why §8 item 3 exists:
  Resultados/Intelligence only ever reads Selling and Inventory data
  (`domain-model.md` bounded-context table), and this spec deliberately
  avoided designing a mechanic that would require writing back into
  Session.

## 10. Decisions made

- **Historial merges closed Event-rollups and standalone closed Quick
  Sessions into one reverse-chronological list.** A genuinely new pattern
  relative to Eventos (which only ever lists Events) — necessary because
  Journey 5 explicitly covers "past Sessions/Events" together, and a Quick
  Session's history would otherwise have no home anywhere in the app.
- **"En curso" makes already-closed Días of a still-active Event
  individually tappable**, deliberately differing from `events.md`
  §3.13/§3.14's passive treatment of the same rows — Resultados is where
  "reviewing a closed day's detail" was always meant to live per Q7's
  resolution, and she shouldn't have to wait for a multi-day Event to fully
  close before checking Día 1.
- **No auto-"reviewed" marking mechanic designed** (see §8 item 3) — would
  require Resultados to write into Session, breaking the frozen
  Intelligence-is-read-only dependency direction. Left as an open question
  rather than quietly implemented.
- **Free tier includes per-Product counts at Session and Event granularity**
  (§3.7/§3.8) — read as "counts," not "segmentation," per
  `domain-model.md`'s own capability-table wording; segmentation is reserved
  for the two paid-tier views that break down by venue or by customer
  pattern.
- **"Rendimiento por bazar" (§3.9) is retrospective, own-data-only, and
  ranking is a plain sort by magnitude** — deliberately built to avoid any
  overlap with `company/backlog.md` #3's blocked bazaar-recommendation
  feature; flagged prominently in §8/§10 rather than silently included or
  silently omitted, since the task explicitly asked for something grounded
  in that friction.
- **"Rendimiento por bazar" rows are tappable, drilling into a filtered
  Historial view (§3.11) and onward into the same Event detail (§3.8)/
  Session detail (§3.7) screens the rest of this tab already uses** —
  restores the three-altitude drill-down model (§2) this section previously
  broke. No new screen type was invented: the filtered view reuses
  Historial's existing Event-rollup card shape and the exact same
  exact-name grouping key §3.9's own aggregate uses, so what she sees
  filtered is exactly what was summed.
- **An explicit empty state (§3.10) now covers a paid merchant with closed
  Sessions but zero Event-grouped Sessions (Quick-Session-only history)** —
  a real, reachable case per `company/CLAUDE.md`'s "own sales history" (not
  Event history) eligibility rule. Copy is plain and factual, same brand
  posture as `events.md` §3.16, and never implies Quick-Session-only
  selling is a lesser or incomplete way to use the app. "Tus clientes"
  (§3.12) is unaffected by this same condition, since its grouping doesn't
  depend on Event data at all.
- **"Tus clientes" (§3.12) is explicitly illustrative**, not a
  fully-specified analytics engine, per the task's own constraint — its real
  data dependency is logged as this doc's primary open question (§8 item
  1) rather than assumed resolved. It now also carries a documentation-only
  `*` marker everywhere it appears in a wireframe or the flow diagram
  (§3.6, §3.12, §4), so a reader working only from those artifacts — not
  narrative prose — can still tell this row apart from the real
  "Rendimiento por bazar" row at a glance. The marker is a spec-only
  annotation, never literal on-screen copy Ana would see.
- **No paid-tier upgrade/purchase flow designed anywhere.** The free-tier
  informational note (§3.4/§3.5) is passive text, not a tappable CTA —
  payments/checkout are an explicit `company/CLAUDE.md` non-goal, and
  whether/how `subscriptionTier` is ever merchant-self-service-editable is
  itself unresolved (Q5, `company/business-decisions.md`, Open — reclassified
  from `architect-questions.md` as a Business Decision).
- **Cold start's CTA routes to Hoy**, reusing an existing tab rather than
  inventing a new destination — same pattern the other three docs already
  established for their own cold starts.

## 11. Future considerations

- A formal Architect/product decision on customer-identity surfacing to the
  merchant side (§8 item 1) — this doc's single biggest dependency for
  §3.12 to become a real, buildable feature rather than an illustration.
- A formal Venue/Location entity, if `company/backlog.md` #2's bazaar-
  performance angle needs grouping more precise than exact-name matching
  (§8 item 2). If/when this exists, the filtered drill-down (§3.11) would
  key off a Venue ID instead of exact-name match, automatically becoming
  precise rather than approximate — no structural change to the screen
  itself, just to its underlying query.
- Once Q1/Q3 are resolved, "Día N" labels (§3.7/§3.8) and "$ promedio/día"
  (§3.9) may need a small additive change to their read-side computation —
  same caveat `home.md` §11 and `events.md` §11 already carry.
- A time-range filter (e.g., "este mes" vs. "todo el tiempo") for the
  Historial list — not designed now, no journey calls for it yet; matches
  `inventory.md`/`events.md`'s own deferral pattern for list-scale concerns.
- Exporting or sharing a summary (e.g., end-of-day totals to send herself
  or a supplier) — not designed, no validated need yet.
- If Architect ever resolves what `reviewed` is for (§8 item 3), revisit
  whether an unread-style indicator belongs in Historial after all.
- If Ana never adopts Eventos at all, "Rendimiento por bazar" (§3.10's
  empty state) stays permanently empty for her. Acceptable today — Quick
  Session is fully first-class and nothing in this doc pressures her toward
  Eventos — but worth watching whether paid merchants in that position
  perceive this one feature as under-delivering, distinct from the paid
  tier as a whole (`company/CLAUDE.md`'s Business Model Direction ties paid
  eligibility to sales history generally, not to this one feature working
  for everyone equally).
