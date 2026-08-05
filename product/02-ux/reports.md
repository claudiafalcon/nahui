# Resultados — UX Specification

Status: Approved. Full UX Remediation cycle complete — RPT-M1, RPT-M2,
RPT-M3 fixed by `ux-designer`, verified clean by `ux-critic` (zero remaining
Blockers/Majors), and passed `reviewer`'s Foundation-consistency check (no
Blockers; one cross-document Important finding — stale post-renumbering
section references — corrected by Main). See
`product/02-ux/ux-critic-findings.md` for the full finding record.
**Updated to apply the Venue aggregate root** (`product/99-rfc/0001-venue-entity.md`,
Accepted; `decision-log.md` D20): "Rendimiento por bazar" (§3.9/§3.11) now
groups by `venueId`, a real independent identity, instead of exact-string
matching on Event's former freeform `Nombre` — this is the direct, by-construction
resolution of what was previously logged as Q9. See §10 for the full change
record. This update also renumbers `events.md`'s own §3.x screen states from
its old §3.7 onward by one (a new Venue picker was inserted there) — every
cross-reference to `events.md` in this document has been updated to match.
**Updated to apply the resolved Customer Segmentation capability**
(`product/99-rfc/0002-loyalty-claim-complete-capability.md`, Accepted;
`decision-log.md` D22): "Tus clientes" (§3.6/§3.12/§3.13) is no longer an
illustrative placeholder — this is the direct resolution of what was
previously logged as Q8 (`company/business-decisions.md`, Resolved).
Customer Segmentation is gated by `subscriptionTier=paid` **and**
`loyaltyEnabled=true` together, never `subscriptionTier` alone;
`registrationMode` only ever selects *which* Claim mechanism a Sale uses
(the existing NFC tag scan, or the new Sale-level Claim Token/QR), never
*whether* segmentation exists. The Merchant Application still never sees
raw Customer or Claim data — it consumes only **Derived Customer
Intelligence**, an anonymized, aggregate signal the future Loyalty-claim
context computes and exposes read-only to Intelligence (`domain-model.md`,
`ubiquitous-language.md`). This update designs the state this doc never
needed before — a paid merchant with `loyaltyEnabled=false` (§3.6) — plus
the empty state for a paid, loyalty-active merchant with zero Claims
recorded yet (§3.13, new). The documentation-only `*` illustrative marker
is retired throughout — every row shown in this doc is now a real,
specified feature, even though Loyalty-claim and Intelligence themselves
remain future, not-yet-built bounded contexts per `domain-model.md`'s own
table (this doc specs the target UI ahead of implementation, the same
posture already established for every other screen here, and for Venue
before its own aggregate root existed). See §8 item 1 (rewritten) and §10
for the full change record; §4/§5 updated to add §3.13, one new read-only
state (renumbering the former §3.13 "Defensive fallback" to §3.14).
**Amended 2026-08-04 (consolidated pass — Event type legibility, three new
free-tier insight elements, and a headline synthesis fix).** Three prior
analyses applied together for coherence: (1) Historial's Event-rollup cards
and §3.11's filtered venue-detail cards now carry Event type alongside
`Venue.displayName` — the same closed, frozen 6-item enum already shown in
`events.md`'s Event detail (`decision-log.md` D16), no new data. (2) Three
new free-tier insight elements — ticket promedio, sales trend, and top
products all-time — all confirmed computable now with no new fields
(`product/02-ux/product-decisions.md` Q13's own architect finding already
treats these three as "a direct variant of an already-Approved section,"
distinct from NFC adoption rate, which stays open). (3) `ux-critic`'s
synthesis-gap finding: items (1)-(2) combined were still separate facts Ana
had to connect herself, not insight — this pass adds one or two
headline-level "paired fact" statements at the same visual priority as
"Total histórico," each pairing two values this doc already computes
independently into one retrospective, descriptive sentence about her own
history. (4) "Rendimiento por bazar" (§3.9) rows now carry a plain rank
number (1., 2., 3.) instead of a magnitude bar — Product Owner call, the bar
was judged too close to implying a recommendation. Every addition below
stays inside `company/backlog.md` #3's guardrail (plain magnitude/own-data
only, never recommendation-flavored copy) — no "deberías" language, no
cross-vendor data, no forward-looking suggestion of any kind, same posture
§3.9 already established. See §10 for the full decision record.
Scope: `Resultados`, the fourth and last of four top-level nav items per
`product/00-foundation/information-architecture.md`. Covers Journey 5
(Review). Picks up exactly what `product/02-ux/events.md` §3.16 deliberately
deferred per Q7's resolution (`architect-questions.md`, Resolved):
`information-architecture.md`'s nav table assigns "Session/Event summaries"
to Resultados; Eventos only ever shows a thin ambient indicator and hands off
("Ver resumen en Resultados"). Implementation-independent — low-fidelity
only, no visual design.

Out of scope by explicit instruction:
- **No bazaar-recommendation logic** (`company/backlog.md` #3, "Blocked by:
  needs data from multiple vendors... Do not attempt to build"). §3.9 below
  ("Rendimiento por bazar") only ever aggregates Ana's *own* historical
  Sale/Session/Event/Venue data — no foot-traffic/weather data, no cross-vendor
  comparison, no forward-looking suggestion copy of any kind. This is
  retrospective "how did I do at each place I've sold" reporting, not "where
  should I go next." Flagged explicitly in §8 and §10 so this boundary isn't
  quietly crossed later.
- **No payments/checkout flow** (`company/CLAUDE.md` non-goals). §3.5's
  paid-tier informational note is passive text only, never a tappable
  "upgrade now" CTA — see §10.
- **No specific customer-segmentation algorithm.** `company/CLAUDE.md`
  describes the *problem* (can't tell a high-volume-occasional buyer from a
  small-but-every-bazaar buyer) — the underlying capability and data source
  are now resolved (`product/99-rfc/0002-loyalty-claim-complete-capability.md`,
  Accepted; `decision-log.md` D22): Customer Segmentation is gated by
  `subscriptionTier=paid` **and** `loyaltyEnabled=true` together, and
  consumes only **Derived Customer Intelligence**, an anonymized aggregate
  signal computed by the future Loyalty-claim context and exposed read-only
  to Intelligence. What's still genuinely open is narrower than before: the
  exact thresholds/rule for what counts as "frecuente" vs. "ocasional." §3.12
  shows a plausible aggregate shape using illustrative example numbers for
  those thresholds only (e.g., "3 bazares o más," "1 o 2 veces") — not a
  validated analytics engine. Tracked in §11, not as an open question, since
  this out-of-scope note already settles that it isn't awaiting a
  decision-owner's call right now.
- **No Venue-management surface of any kind.** Per
  `product/99-rfc/0001-venue-entity.md`'s own scope note, Venue is not a
  full location-management module — this doc only ever reads `venueId` as a
  grouping key for reporting; it never lets Ana create, rename, or manage a
  Venue (that inline picker lives entirely in `events.md` §3.7).

## 1. Merchant goal

Resultados is the one tab where Ana isn't doing anything — no customer in
front of her (Home), no merchandise to count (Inventario), no bazaar to book
(Eventos). She opens it to answer one of two questions, at two different
altitudes:

- **"How did I do?"** (retrospective, always available, any tier) — a
  specific day, a specific bazaar, or her whole history at a glance. This is
  the direct continuation of Home's own close-summary ("Ver detalle,"
  `home.md` §3.12) and Eventos' hand-off ("Ver resumen en Resultados,"
  `events.md` §3.16) — both of those screens point here because this is
  where the fuller picture actually lives.
- **"What should I pay attention to, going forward?"** (paid tier, and for
  customer segmentation specifically, `loyaltyEnabled` active too — see §2)
  — not "how did today go" but "based on everything I've sold so far, is
  there a pattern worth knowing." This is exactly the two lower-priority
  validated frictions from `company/CLAUDE.md`'s core thesis: which bazares
  are actually worth her time (using only her own history, never
  multi-vendor data), and which customers are loyal vs. occasional.
  `company/backlog.md` #2 confirms this is current MVP UX scope, not
  deferred — the old "blocked until real sales data exists" gate is obsolete
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
       Eventos' own zero-Session state (`events.md` §3.17) offers no
       hand-off CTA, so Resultados never receives navigation to it and
       has no Event-detail state of its own for that case.

3. [Any row] Tap → Session detail (§3.7) or Event detail (§3.8).
   Reached exactly one way, and both hand-off entry points converge on the
   same destination:
     - Home's immediate post-close "Ver detalle" (`home.md` §3.12) → Session
       detail directly, regardless of Resultados' own tab state (never
       routes through the cold start or the list first — same pattern as
       Home's upcoming-Event card jumping straight into Eventos' detail,
       `events.md` §3.11 annotation).
     - Eventos' "Ver resumen en Resultados" (`events.md` §3.16) → Event
       detail directly, for that specific Event.

4. subscriptionTier = paid?
     → NO:  main view ends with a passive, non-tappable informational note
       on what paid unlocks (§3.4/§3.5). Nothing beyond counts/totals is
       ever rendered, anywhere in this tab.
     → YES: "Rendimiento por bazar" (§3.9/§3.10) always appears — strictly
       additive to the free-tier baseline (architecture-principles.md #1:
       capability resolved once, upstream; gates the whole section, never a
       per-screen toggle Ana touches). It always renders for a paid
       merchant regardless of data volume — the gate is tier-based, not
       data-based (see the sub-step below for what "no data yet" looks
       like within it).

       A second entry point, "Tus clientes," is gated independently — see
       the second sub-step below. Customer Segmentation is gated by
       `subscriptionTier=paid` **and** `loyaltyEnabled=true` together, not
       `subscriptionTier` alone (`decision-log.md` D22,
       `product/99-rfc/0002-loyalty-claim-complete-capability.md`).
       `registrationMode` never enters this gate — it only ever determines
       *which* Claim mechanism a given Sale uses (NFC tag scan or the new
       Sale-level Claim Token/QR), never *whether* Customer Segmentation
       exists for this Business (`domain-model.md`'s "Multi-mechanism Claim
       resolution").

       Within "Rendimiento por bazar" specifically: has this Business ever
       closed a Session with a non-null `eventId` (i.e., has she ever run a
       Session under an Event, as opposed to only Sesión rápida)?
         → NO:  empty state (§3.10) — a real, reachable case, since
           `company/CLAUDE.md` ties paid-tier eligibility to "own sales
           history," not Event history, and Quick Session is first-class,
           never a lesser path (architecture-principles.md #3). A
           Quick-Session-only paid merchant is a normal outcome, not an edge
           case to leave undefined.
         → YES: populated view (§3.9), one row per **Venue** (`venueId`) —
           see §10 for how this differs from the pre-Venue design.

       Within "Tus clientes" specifically: is `loyaltyEnabled = true` for
       this Business?
         → NO: a passive, non-tappable informational note appears in this
           row's place (§3.6) — a real, reachable state for a paid merchant
           who never activated loyalty tracking (e.g., a Buttons-mode paid
           merchant: `registrationMode` and `loyaltyEnabled` are
           independent Business capabilities, so a paid merchant with
           loyalty tracking off is a normal outcome, not a lesser or
           incomplete one). No self-service activation control is designed
           in this tab — Business Capabilities, including `loyaltyEnabled`,
           are now fully self-service and bidirectional at any time (Q5,
           Resolved, `company/business-decisions.md`; `decision-log.md`
           D25), but the actual toggle lives in
           `product/02-ux/settings.md` ("Activar clientes frecuentes"),
           never duplicated here; §3.6 points to it in plain text.
         → YES: has Loyalty-claim recorded any Claim yet for this Business?
           → NO:  empty-state teaser (§3.6) → §3.12's own empty state
             (§3.13) — a real, reachable transitional state right after
             activating loyalty tracking, before any Sale has produced a
             Claim yet.
           → YES: populated teaser (§3.6) → §3.12's populated view.
```

**How the three altitudes relate:** all-time (a single ambient card, sum
across everything) sits above Historial/En curso (a list of Event-rollups
and Session-rows) which sits above Session detail (the leaf — one working
day, per-Product counts). Event detail is a middle rollup that itself lists
its own Sessions, each still tappable down to the same leaf. Nothing here is
independently entered or reconciled — every number at every altitude is a
read-side computation over the same underlying Sale/SaleItem/Session/Event/
Venue data, per `domain-model.md`. "Rendimiento por bazar" (§3.9) sits at that
same all-time altitude as the ambient card above it — a sum across
everything, just grouped by **Venue** instead of collapsed into one number —
and now drills down the same way the rest of the tab does: tapping a venue
row reaches a filtered Historial (§3.11) at the middle altitude, which
reaches Event detail (§3.8), down to the same Session-detail leaf. No
altitude in this tab is a dead end.

## 3. Low-fidelity wireframes

Conventions inherited from `home.md`/`inventory.md`/`events.md`: `[ ]` =
tappable, plain text = passive/informational, bottom row is the persistent
nav bar on every state, current tab in brackets. Sub-screen navigation
(list → detail) uses already-fetched data, no dedicated loading skeleton of
its own — same scoping choice as the other three docs.

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
│  48 ventas · $14,230 · $296 ticket promedio │
│                                │
│  Tu producto estrella: Pijama, con   │
│  42 piezas vendidas en total.          │  ← same visual priority as
│  Esta semana vendiste 4 ventas menos  │     "Total histórico"
│  que la semana pasada.                 │
│                                │
│  Top productos · todo tu historial  │
│   1. Pijama              42        │
│   2. Sudadera/Maxy        25        │
│   3. Calcetines           18        │
│                                │
│  En curso                       │
│  ┌───────────────────────────┐ │
│  │ Plaza Norte                 │ │
│  │ Día 1 · 12 jul · 5 ventas · $610│ │
│  └───────────────────────────┘ │
│                                │
│  Historial                      │
│  ┌───────────────────────────┐ │
│  │ Plaza Metepec · Bazar        │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Sesión rápida · 20 jul        │ │
│  │ 4 ventas · $560                │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Con el plan de pago vas a ver │ │  passive note, not tappable
│  │ cómo te fue por bazar. Si       │ │
│  │ además activas el seguimiento   │ │
│  │ de clientas, también vas a ver │ │
│  │ cuántas son frecuentes y         │ │
│  │ cuántas ocasionales.            │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- "Total histórico" is a pure sum across every Session ever closed —
  free-tier eligible, it's a total, not a segmentation
  (`domain-model.md` capability table).
- **Ticket promedio** (total ÷ número de ventas) is added inline on the same
  "Total histórico" line, following the same " · " separator convention
  every card in this doc already uses for related stats (e.g. "3 días · 18
  ventas · $2,340"). Free-tier eligible — arithmetic over a total and a
  count this doc already computes, the same "counts" classification this
  doc's own §10 precedent already applies to per-Product breakdowns, and the
  same classification `product-decisions.md` Q13 already gives this exact
  metric ("a direct variant of an already-Approved section"). Rounded to the
  nearest peso, same rounding convention §3.9's "$ promedio/día" already
  establishes. **Scope note:** this amendment adds ticket promedio only to
  the all-time hero line, not to Session detail (§3.7) or Event detail
  (§3.8) — extending it to those altitudes is a separate, not-yet-designed
  idea.
- **"Top productos · todo tu historial"** reuses the exact per-Product/
  SaleItem aggregation §3.7's "Por producto" and §3.8's "Por producto (todo
  el evento)" already perform — same read-side computation, re-scoped from
  one Session/Event to every Session ever closed (the same all-time scope
  "Total histórico" already uses, §2). Ordered by total pieces sold,
  descending, with a plain rank-number prefix (1., 2., 3.) — the same
  numbering convention §3.9 uses, reused here rather than inventing a second
  ranking style in the same document. **Plain sort by magnitude, not a
  recommendation** — same guardrail and same restraint §3.9's own bullet
  already states: no "deberías vender más..." copy, no forward-looking
  suggestion, retrospective own-data only (`company/backlog.md` #3). List
  length is a Medium-Fidelity/visual-density decision, not fixed here — same
  restraint this doc already takes toward Historial's own unbounded list
  length.
- **Graceful degradation at zero sales.** The cold-start gate (§2) only
  checks "has any Session ever closed," not "has any Sale ever been
  recorded" — so a Business can have closed Sessions with zero actual Sales
  (a slow day, closed with nothing sold), the same way `events.md` §3.17
  already designs for a zero-Sale Event. In that case: ticket promedio is
  omitted from the "Total histórico" line entirely (never shown as "$0
  ticket promedio," which would misrepresent an undefined division), no
  headline paired-fact statements render (see the bullet below — there is no
  product or trend to state), and "Top productos" shows "Sin ventas
  registradas," reusing `events.md` §3.17's exact precedent phrase. Plain,
  factual, no guilt-tripping copy — same brand posture as every other empty
  state in this doc (§3.10, §3.13).
- **Two headline-level statements, rendered with the same visual priority as
  "Total histórico," directly above "Top productos."** These are not new
  data. Only the sales-trend statement closes a genuine synthesis gap
  `ux-critic` found — it pairs two values ("esta semana," "semana pasada")
  that weren't otherwise shown together anywhere in this view. "Producto
  estrella" is a different kind of device and is described honestly as one
  below: it doesn't combine anything new — see its own bullet.
  - **"Producto estrella"** pairs Top productos' own #1 entry (a product's
    identity) with its own count into one sentence — the same computation
    "Top productos" already does, just stated as prose for its leading item
    instead of left as a list row to interpret. This is a spotlight/emphasis
    device, not synthesis: unlike the trend statement below, both values it
    states are already independently visible three lines away in "Top
    productos," at the same visual priority — it restates rather than
    combines. Kept at headline prominence anyway, on the same logic "Total
    histórico" already uses: her single best-selling product is worth
    naming plainly up front rather than making her scan a list to find it.
  - **Sales trend** pairs "esta semana" and "semana pasada" into one
    direction-and-magnitude sentence — "vendiste N ventas menos/más," never
    shown as two side-by-side numbers for her to subtract herself. This is
    the statement that actually closes the synthesis gap `ux-critic` found —
    neither value appears anywhere else in this view on its own. Week
    boundary (Monday-first vs. a rolling 7-day window) is a read-side
    computation detail, not specified at this fidelity — same posture this
    doc already takes toward Q1's "Día N" ambiguity (§8 item 4).
  - Copy above is illustrative, not final — same convention §3.12's
    thresholds already use. Both statements are strictly retrospective and
    descriptive: no "deberías" language, no evaluative framing of "menos" as
    bad or "más" as good, no suggested action — same guardrail §3.9's
    existing "plain sort by magnitude, not a recommendation ranking" bullet
    already establishes, extended here to prose (`company/backlog.md` #3).
  - **Graceful omission, not a fabricated comparison.** If "semana pasada"
    predates Ana's very first closed Session, the sales-trend statement is
    omitted rather than stating a comparison against a week before she ever
    used the app — same restraint as the zero-sales bullet above, and the
    same principle §3.10's empty state already applies ("no fabricated
    venue data," §9). If only one of the two statements has data to state,
    the other renders alone — never a blank placeholder for the missing
    one. Never more than two statements — a third would start competing
    with "Total histórico" for attention rather than supporting it.
  - A fuller time-series view (a proper trend chart, a longer trailing
    window) is out of scope for this amendment — see §11.
- **Every Event-rollup card's headline is `Venue.displayName`** ("Plaza
  Norte," "Plaza Metepec"), the same slot Event's former freeform `Nombre`
  occupied — same swap `events.md` §3.4 already applies to its own list
  (`decision-log.md` D20).
- **Every Historial Event-rollup card now also carries Event type, in the
  same subordinate role Type already plays in `events.md`'s Event detail**
  (`Bazar · 12-14 de julio` — Type leads that line, secondary to the
  headline Venue name shown above it, `events.md` §3.11/§3.16). Adapted here
  for a compact card: Type sits inline after Venue.displayName on the
  card's headline line ("Plaza Metepec · Bazar"), rather than its own line,
  since the card has no separate headline row the way full Detail screens
  do — still visually and informationally subordinate to the Venue identity,
  never competing with it. Safe with no new ambiguity: `Event.type` is a
  closed, frozen 6-item enum (`decision-log.md` D16, `product-decisions.md`
  Q6, Resolved), the identical vocabulary already shown in `events.md`'s own
  Event detail. **Quick Session cards are unaffected** — a Quick Session has
  no `eventId` and therefore no Type; "Sesión rápida · 20 jul" stays exactly
  as it is.
- "En curso" holds one card per still-active Event, listing every Día
  already closed under it as its own tappable row — a deliberate
  improvement over Eventos' own treatment of the same rows: `events.md`
  §3.14/§3.15 keeps them passive there ("reviewing a closed day's detail is
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
- **The paid-tier note now names both gates it's promising**, since
  Customer Segmentation depends on `subscriptionTier=paid` **and**
  `loyaltyEnabled=true` together, not `subscriptionTier` alone
  (`decision-log.md` D22) — a free-tier merchant who later goes paid but
  never activates loyalty tracking would otherwise be told something the
  paid tier alone doesn't deliver. Still plain informational text, not a
  card with a tap target — see §10 for why no upgrade CTA is designed here.
- **Copy states a count/category, never an identity claim.** "Cuántas son
  frecuentes y cuántas ocasionales" promises exactly what §3.12 delivers —
  an anonymized aggregate count per category — never "who" a specific
  customer is. See RPT2-MAJ1 (`ux-critic-findings.md`) for why this wording
  was corrected from an earlier draft that said "quiénes son," which would
  have implied identity-level information this architecture deliberately
  never surfaces to the merchant (`decision-log.md` D22, `product/99-rfc/0002-loyalty-claim-complete-capability.md`).

### 3.5 Main view — free tier, no active Event (most common day-to-day)
```
┌───────────────────────────────┐
│  Resultados                    │
│  Total histórico                  │
│  48 ventas · $14,230 · $296 ticket promedio │
│                                │
│  Tu producto estrella: Pijama, con   │
│  42 piezas vendidas en total.          │  ← same visual priority as
│  Esta semana vendiste 4 ventas menos  │     "Total histórico"
│  que la semana pasada.                 │
│                                │
│  Top productos · todo tu historial  │
│   1. Pijama              42        │
│   2. Sudadera/Maxy        25        │
│   3. Calcetines           18        │
│                                │
│  Historial                      │
│  ┌───────────────────────────┐ │
│  │ Plaza Metepec · Bazar        │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Sesión rápida · 20 jul        │ │
│  │ 4 ventas · $560                │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Con el plan de pago vas a ver │ │
│  │ cómo te fue por bazar. Si       │ │
│  │ además activas el seguimiento   │ │
│  │ de clientas, también vas a ver │ │
│  │ cuántas son frecuentes y         │ │
│  │ cuántas ocasionales.            │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Same layout rule as §3.4, En curso genuinely absent — most días have no
  Event running, same framing `events.md` §3.5 used for its own equivalent
  state.
- Same corrected count/category wording as §3.4 — see that section's
  annotation and RPT2-MAJ1.
- **Ticket promedio, "Top productos," the two headline paired-fact
  statements, and Event type on Historial cards are all identical to §3.4**
  — same computation, same guardrails, same graceful-degradation and
  graceful-omission rules. Not restated here; see §3.4's own bullets for
  the full reasoning.

### 3.6 Main view — paid tier
```
┌───────────────────────────────┐
│  Resultados                    │
│  Total histórico                  │
│  48 ventas · $14,230 · $296 ticket promedio │
│                                │
│  Tu producto estrella: Pijama, con   │
│  42 piezas vendidas en total.          │  ← same visual priority as
│  Esta semana vendiste 4 ventas menos  │     "Total histórico"
│  que la semana pasada.                 │
│                                │
│  Top productos · todo tu historial  │
│   1. Pijama              42        │
│   2. Sudadera/Maxy        25        │
│   3. Calcetines           18        │
│                                │
│  Rendimiento por bazar    [Ver más ▸]│
│  Plaza Norte · $780/día              │
│                                │
│  Tus clientes             [Ver más ▸]│
│  6 frecuentes · 14 ocasionales        │
│                                │
│  Historial                      │
│  ┌───────────────────────────┐ │
│  │ Plaza Metepec · Bazar        │ │
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
(Above: `loyaltyEnabled = true`, with at least one Claim already recorded —
see the two variants below for the other two reachable states.)
- Same baseline as §3.4/§3.5 (Total histórico, En curso when applicable,
  Historial), plus up to two additional entry points — never a
  replacement, never a different app. *architecture-principles.md* #1:
  each capability gates a whole section, resolved once upstream, never a
  per-screen or per-visit question Ana is asked about.
- **Ticket promedio, "Top productos," the two headline paired-fact
  statements, and Event type on Historial cards are identical to §3.4** —
  same computation, same guardrails, same graceful-degradation and
  graceful-omission rules, placed above any paid-tier content since none of
  the four depend on `subscriptionTier`. Not restated here; see §3.4's own
  bullets.
- The free-tier informational note (§3.4/§3.5) disappears entirely once
  paid — she already has what it was telling her about "Rendimiento por
  bazar," and "Tus clientes" now has its own independent gating, handled
  below.
- Each summary row here is a one-line teaser of its own full view:
  "Rendimiento por bazar" → §3.9 (or §3.10 if she has no Event-grouped
  Sessions yet); "Tus clientes" → §3.12 (or §3.13 if `loyaltyEnabled=true`
  but no Claim has been recorded yet) — same pattern as Home's own header
  being a teaser of session-controls (`home.md` §3.7). The teaser now shows
  a **Venue name** ("Plaza Norte") rather than Event's former Nombre.
- **"Rendimiento por bazar" and "Tus clientes" are gated independently, and
  both are real, fully-specified features — styled identically, same
  typography, same "[Ver más ▸]" affordance, no visual demotion of either.**
  "Rendimiento por bazar" is gated by `subscriptionTier=paid` alone.
  "Tus clientes" is gated by `subscriptionTier=paid` **and**
  `loyaltyEnabled=true` together (`decision-log.md` D22,
  `product/99-rfc/0002-loyalty-claim-complete-capability.md`) — this
  resolves what was previously logged as Q8 (§8 item 1). "Tus clientes"
  never shows raw Customer or Claim data; it renders only **Derived
  Customer Intelligence** — an anonymized, aggregate signal (counts of
  frequent vs. occasional buyers) that the future Loyalty-claim context
  computes and exposes read-only to Intelligence (`domain-model.md`,
  `ubiquitous-language.md`). See the two variants below for what she sees
  when either half of that gate isn't yet satisfied.
- If this Business has never closed an Event-linked Session
  (Quick-Session-only history — a real, reachable case, see §3.10), the
  "Rendimiento por bazar" teaser shows an honest empty summary instead of
  sample data:
  ```
  Rendimiento por bazar    [Ver más ▸]
  Aún no hay bazares para mostrar
  ```
  "Tus clientes" is unaffected by this specific condition — its gating and
  data source are Sales/Claims generally, not Event/Venue-grouped, so a
  Quick-Session-only paid merchant still sees whatever "Tus clientes" state
  actually applies to her (below), independent of whether she's ever used
  Eventos. Tapping "[Ver más ▸]" on the empty variant still leads somewhere
  real (§3.10), not a dead end.
- **If `loyaltyEnabled = false` for this Business** — a real, reachable
  state this doc never needed before, since `registrationMode` and
  `loyaltyEnabled` are independent Business capabilities (a Buttons-mode
  paid merchant who never activated loyalty tracking is a completely normal
  outcome, not a lesser or incomplete way of using the app,
  `architecture-principles.md` #1) — "Tus clientes" is replaced by a
  passive, non-tappable note in the same position, no "[Ver más ▸]"
  affordance at all:
  ```
  Tus clientes
  Con el seguimiento de clientas activo
  vas a ver cuántas son tus clientas
  frecuentes y cuántas ocasionales.
  Lo puedes activar cuando quieras
  desde Configuración, en el menú
  de Hoy.
  ```
  "Rendimiento por bazar" is entirely unaffected — the two paid-tier rows
  are gated independently. **No self-service "Activar" control is designed
  in this tab.** Business Capabilities, including `loyaltyEnabled`, are
  fully self-service and bidirectional at any time — Q5 is Resolved
  (`company/business-decisions.md`; `decision-log.md` D25) — but the actual
  toggle is designed once, in `product/02-ux/settings.md`
  ("Activar clientes frecuentes," §3.3a/§3.4), reached from Home's header
  "▾" (`settings.md` §2.1), not duplicated here
  (`architecture-principles.md` #1). This note now names that destination
  in plain text, since Q5's resolution makes Configuración a real place to
  point her to, but stays non-tappable: Configuración isn't a nav-bar tab
  the way Eventos is (§3.10's "[ Ver Eventos ]" precedent), so making this
  row itself jump there would mean inventing a new cross-tab navigation
  hand-off this doc was never scoped to design — a plain-text pointer gets
  her there just as well without it.
  **Copy states a count/category, never an identity claim** — see the
  annotation under §3.4 and RPT2-MAJ1 (`ux-critic-findings.md`) for why
  this was corrected from an earlier "quiénes son" draft.
- **If `loyaltyEnabled = true` but no Claim has been recorded yet** for this
  Business — a normal, transitional state right after activating loyalty
  tracking, before any Sale has produced a Claim — the row stays tappable
  but shows an honest empty summary instead of sample counts:
  ```
  Tus clientes             [Ver más ▸]
  Aún no hay datos suficientes
  ```
  leading to §3.12's own empty state (§3.13) — same restraint as
  "Rendimiento por bazar"'s own empty teaser above, never a dead end.

### 3.7 Session detail
```
┌───────────────────────────────┐
│ ← Resultados                     │
│  Plaza Norte · Día 2              │
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
- Header shows "[Lugar] · Día N" (`Venue.displayName`, `events.md` §3.7/D20)
  when `eventId` is set, or "Sesión rápida" (reusing Home's own vocabulary
  for the same concept, `home.md` §3.4) when it isn't — never "Session" or
  "Venue" anywhere in copy. *architecture-principles.md* #4.
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
│  Plaza Norte                      │
│  Bazar · 12-14 de julio            │
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
- This is the exact content `events.md` §3.16/§10 deliberately removed from
  Eventos per Q7's resolution — passive identity there, full breakdown
  here. Reached three ways: directly from Resultados' own Historial
  (§3.4/§3.5), via Eventos' "Ver resumen en Resultados" hand-off, and now
  also via a "Rendimiento por bazar" venue drill-down (§3.11) — same
  destination every time, never a duplicated or divergent detail screen per
  entry point.
- **Headline is `Venue.displayName` ("Plaza Norte")** — same slot Event's
  former `Nombre` occupied; the Tipo·dates line ("Bazar · 12-14 de julio")
  is unaffected by the Venue change, since Type stays its own separate
  field. No separate address/Lugar line — Venue's own optional address/notes
  has no data-entry surface designed anywhere in this doc family yet
  (`events.md` §11).
- Día rows are tappable → Session detail (§3.7) for that specific day —
  unlike Eventos' own passive Día rows (`events.md` §3.14/§3.15), which are
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
│  1. Plaza Norte                    │
│      3 eventos · $780 promedio/día  │
│  2. Plaza Metepec                  │
│      2 eventos · $520 promedio/día  │
│  3. Plaza Toluca                    │
│      1 evento · $310 promedio/día    │
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
- **Each row is now prefixed with a plain rank number (1., 2., 3., ...)
  matching its sort position** — Product Owner decision: a bare numeral,
  not a magnitude-proportional bar, since a bar was judged too close to
  implying a recommendation, the exact risk the bullet above already exists
  to avoid. Primarily a Medium-Fidelity/visual-treatment decision, noted
  here at Low-Fidelity because it changes what data the row displays — the
  rank number itself, not merely the list order already implied by
  position. No change to the underlying sort, grouping key, or drill-down
  behavior below.
- **Grouping key is `venueId`, not exact string match on a freeform name.**
  Venue is a real, independent aggregate root (`domain-model.md`,
  `decision-log.md` D20) — `businessId`-scoped, referenced by ID from Event,
  resolved via the create-or-select picker at Event-creation time
  (`events.md` §3.7). Each row here is one Venue, exactly; repeat visits to
  the same physical place are already distinguished by date range in every
  card this doc shows (§3.4's Historial cards, §3.11's filtered view), so
  grouping by identity rather than by string loses nothing and gains
  precision. This is the direct, by-construction resolution of what was
  previously logged as Q9 — see §8 item 2 for the full record of what
  changed and why.
- "$ promedio/día" divides a Venue's total by its number of closed
  Sessions across every Event held there — inherits Q1's Día-N-counting
  ambiguity exactly the same way §3.7/§3.8's "Día N" does (see §8).
- **Each venue row is tappable** → a filtered Historial view scoped to that
  Venue (§3.11), restoring the three-altitude drill-down (§2) the rest of
  this tab already has: this screen is itself an all-time-altitude view
  (a sum across everything, grouped by Venue); tapping a row descends to the
  middle altitude (Event-rollups for that Venue only), and from there down
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
│  ventas por lugar, según los        │
│  eventos que agendas en Eventos.    │
│  Hasta ahora, todo lo que llevas    │
│  cerrado son sesiones rápidas —     │
│  no hay lugares que mostrar          │
│  todavía.                          │
│      [ Ver Eventos ]              │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- **A real, reachable scenario, not a hypothetical.** `company/CLAUDE.md`'s
  paid-tier eligibility is tied to "own sales history," not Event history,
  and Quick Session is explicitly first-class, never a fallback
  (architecture-principles.md #3, `home.md` §10) — a merchant can pay for
  the paid tier, sell plenty, and never once use Eventos (and therefore
  never select or create a Venue). Without this state, §3.9 would otherwise
  render as a silent, broken-looking blank screen the first time a
  Quick-Session-only paid merchant opened it.
- **Plain, factual, no guilt-tripping copy** — same brand posture as
  `events.md` §3.17's "No registraste ventas en este evento": Quick-Session-
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
- **"Tus clientes" (§3.12/§3.13) is unaffected by this same condition** —
  its gating (`loyaltyEnabled`) and data source (Sales/Claims generally)
  don't depend on Event/Venue data at all, so a Quick-Session-only paid
  merchant still sees whichever "Tus clientes" state actually applies to her
  (§3.6) even while "Rendimiento por bazar" is empty. The paid-tier sections
  can be independently empty, populated, or (for "Tus clientes"
  specifically) not-yet-activated; none of their states depend on each
  other.

### 3.11 Rendimiento por bazar — detalle de bazar (Historial filtrado)
```
┌───────────────────────────────┐
│ ← Rendimiento por bazar           │
│  Plaza Norte                      │
│  3 eventos · $780 promedio/día      │
│                                │
│  ┌───────────────────────────┐ │
│  │ Plaza Norte · Bazar           │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Plaza Norte · Bazar           │ │
│  │ 2 días · 9 ventas · $1,050    │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Plaza Norte · Expo            │ │
│  │ 1 día · 5 ventas · $610       │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Reached by tapping any venue row in §3.9 — **not a new screen type.** Same
  Event-rollup card shape already used in Historial (§3.4/§3.5/§3.6),
  filtered to only the Events whose `venueId` matches this row's Venue —
  the identical grouping key §3.9's own aggregate already uses (§8 item
  2/Q9, resolved), so what she sees filtered here is exactly what was
  summed there, never a separately-derived list.
- Each card is tappable → Event detail (§3.8), the same destination and
  mechanism as tapping straight from Historial — no new detail screen
  invented for this entry point. From there, Día rows tap through to
  Session detail (§3.7) exactly as they already do everywhere else in this
  tab.
- **Event type now shown on every card here too, same subordinate role as
  §3.4/§3.5/§3.6.** Distinct value from that reuse: since every card in
  this filtered view repeats the same `Venue.displayName` ("Plaza Norte"
  three times), Type is the one piece of new information a card here can
  add — a real, useful case, since `events.md`'s own Q9 record notes "a
  Business can host different Event types over time (a Bazar this visit,
  an Expo next)" at the same Venue. The third card above illustrates
  exactly that (Bazar, Bazar, then Expo at the same Plaza Norte) —
  illustrative numbers, not a claim about this particular Venue's real
  history.
- Quick Sessions never appear here, same as they never contribute to §3.9's
  aggregate — a Quick Session has no `eventId`, and therefore no Venue, to
  group by, so there is nothing inconsistent about their absence.
- Back arrow reads "← Rendimiento por bazar," not "← Resultados," because
  this screen's immediate parent is §3.9, not the main view — the same
  logic that makes §3.7/§3.8/§3.9's own "← Resultados" correct for *their*
  immediate parent. Standard back-stack behavior, not a new convention.
- **What used to be Q9's fragmentation risk is now resolved by construction,
  not merely made visible.** Previously, a typo or rename across visits
  could silently split one real venue into two rows in §3.9, and this
  screen's own job was to at least let her *notice* that split after the
  fact. Now that grouping is by `venueId` — a real identity she selects from
  a picker at Event-creation time (`events.md` §3.7), matched
  case-insensitively/trimmed against her existing Venues — that specific
  failure mode can no longer happen. The one residual, much narrower risk
  this screen still helps her catch: if she ever fails to recognize an
  existing Venue in the picker and creates a near-duplicate one by mistake
  (e.g., a genuinely different typed name that doesn't match), she'd see two
  visually similar venue rows in §3.9 instead of one — this view still lets
  her inspect what fed each row and notice that, even though it's no longer
  the same silent-fragmentation risk Q9 originally described.

### 3.12 Tus clientes — segmentación (paid + seguimiento de clientas activo)
```
┌───────────────────────────────┐
│ ← Resultados                     │
│  Tus clientes                     │
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
- **This is now a real, fully-specified feature, not an illustrative
  placeholder** — the direct resolution of what was previously logged as
  Q8 (`company/business-decisions.md`, Resolved;
  `product/99-rfc/0002-loyalty-claim-complete-capability.md`, Accepted;
  `decision-log.md` D22). Ana sees a plain "Tus clientes" header here,
  rendered identically to "Rendimiento por bazar" — no asterisk, no visual
  demotion, ever.
- **Gated by `subscriptionTier=paid` and `loyaltyEnabled=true` together**
  (§2, §3.6) — not `subscriptionTier` alone. This screen is only ever
  reached once both are true; the `loyaltyEnabled=false` state is handled
  entirely at the main-view teaser (§3.6) and never routes here, and the
  zero-Claims-yet state has its own screen (§3.13), not this one.
- **The data behind this screen is Derived Customer Intelligence, never raw
  Customer or Claim data.** The Merchant Application never performs
  identification and never reads an individual Customer or Claim record
  (`decision-log.md` D21's corrected wording: the merchant app may *display*
  a passive claim artifact, like the QR shown to the customer at Sale
  finalization, but never runs any part of identification or the Loyalty
  experience itself). What reaches this screen is a single anonymized,
  aggregate signal — counts of frequent vs. occasional buyers — that the
  future Loyalty-claim context computes from its own Claims and exposes
  read-only to Intelligence (`domain-model.md`'s bounded-context table,
  `ubiquitous-language.md`'s "Derived Customer Intelligence"). No name, no
  contact info, no per-customer drill-down is ever designed here or
  reachable from here — that boundary isn't a UX choice this doc is making,
  it's the Foundation's own resolved architecture. This is also why every
  piece of copy pointing at this screen (§3.4/§3.5, §3.6, §3.13) is worded
  as a count/category ("cuántas son frecuentes y cuántas ocasionales"),
  never as an identity claim ("quiénes son") — see RPT2-MAJ1
  (`ux-critic-findings.md`).
- **"Bazares" here means distinct Venues she's sold at, not a count of
  Sales** — unaffected by this update beyond that clarification, carried
  over unchanged from the prior illustrative version.
- **The specific thresholds shown ("3 bazares o más," "1 o 2 veces") are
  illustrative example numbers only, not a validated segmentation rule.**
  This is the one part of "Tus clientes" that's still genuinely open —
  narrower than before, and now a matter of designing the actual
  segmentation algorithm once real Claim data exists, not a question of
  whether the feature has a resolved data source at all. Tracked in §11,
  per `company/CLAUDE.md`'s own "no specific customer-segmentation
  algorithm" scope note (unchanged by this update).
- Loyalty-claim and Intelligence are both still future, not-yet-built
  bounded contexts (`domain-model.md`'s table; `company/backlog.md` #2's
  staged build order — Stage 1 NFC, Stage 2 Sale-QR, neither started) — this
  screen specs the target UI ahead of implementation, the same posture
  every other screen in this doc family already takes, not a claim that this
  data exists today.

### 3.13 Tus clientes — sin datos aún (empty state)
```
┌───────────────────────────────┐
│ ← Resultados                     │
│  Tus clientes                     │
│                                │
│  Todavía no tienes compras con      │
│  seguimiento de clientas. En          │
│  cuanto empieces a acumularlas,      │
│  vas a ver aquí cuántas son tus       │
│  clientas frecuentes y cuántas         │
│  ocasionales.                        │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- **A real, reachable transitional state, not a hypothetical** — the normal
  gap between activating loyalty tracking (`loyaltyEnabled=true`) and the
  first Sale that actually produces a Claim. Without this state, §3.12 would
  otherwise render as a silent, broken-looking blank screen the first time
  a newly-loyalty-active paid merchant opened it — same reasoning §3.10 (its
  "Rendimiento por bazar" counterpart) already established for the
  equivalent gap in that section, and the same gap `ux-critic-findings.md`
  RPT-MIN1 flagged as worth designing "whenever it becomes real."
- **Plain, factual, no guilt-tripping copy** — same brand posture as §3.10
  and `events.md` §3.17: having zero Claims yet is a normal, temporary state
  of a newly-activated capability, not a shortfall on Ana's part. Nothing
  here implies she's done something wrong or needs to change how she sells
  to unlock this.
- **Copy states a count/category, never an identity claim** — "cuántas son
  tus clientas frecuentes y cuántas ocasionales" matches exactly what §3.12
  delivers once data exists (two anonymized aggregate counts), never a
  promise that she'll learn *who* a specific customer is. See RPT2-MAJ1
  (`ux-critic-findings.md`) for why this was corrected from an earlier
  "quiénes son" draft.
- **No CTA is shown.** Unlike §3.10's "[ Ver Eventos ]" (which routes to an
  existing tab she can act on directly), there's no equivalent action for
  Ana to take here — Claims accumulate automatically as her existing sales
  flow continues, and the actual claiming action happens on the *customer's*
  device, never Ana's (`decision-log.md` D21). Inventing a tap target here
  would either be a dead end or would misleadingly suggest Ana has something
  to do; neither is designed.
- Reached only when `loyaltyEnabled=true` and zero Claims exist yet (§2,
  §3.6) — never reached when `loyaltyEnabled=false` (that state is handled
  entirely at the main-view teaser, §3.6, which never links to this screen
  at all).

### 3.14 Defensive fallback / load error
```
┌───────────────────────────────┐
│  No pudimos cargar tus            │
│  resultados. Intenta de nuevo.      │
│      [   Reintentar   ]           │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- Manual `Reintentar`, same convention as `events.md` §3.18 (not Home's
  silent auto-retry) — Resultados carries no live-customer risk that would
  justify Home's more aggressive behavior.
- Nav bar stays fully functional — a Resultados load failure never
  cascades into blocking Hoy/Inventario/Eventos or selling.

## 4. Interaction flow (summary)

```
Open Resultados tab
  → resolve (§2, automatic)
      → load fails ─────────────────────→ fallback (3.14), Reintentar
      → no Session ever closed ─────────→ cold start (3.3) → Hoy
      → Sessions exist ──────────────────→ main view (3.4/3.5, or 3.6 if paid)

Main view:
  tap an "En curso" Día row      → Session detail (3.7)
  tap a Historial Event card      → Event detail (3.8)
  tap a Historial Sesión rápida card → Session detail (3.7)
  [paid only] tap "Rendimiento por bazar" → 3.9 (or 3.10 if this Business has
    no Event-grouped Sessions yet — see §2 step 4)
  [paid + loyaltyEnabled=true] tap "Tus clientes" → 3.12 (or 3.13 if no Claim
    has been recorded yet — see §2 step 4)
  [paid + loyaltyEnabled=false] "Tus clientes" renders as a passive,
    non-tappable note (§3.6) — nothing to tap, no destination reached

Rendimiento por bazar (3.9):
  tap a venue row → filtered Historial for that Venue (3.11)
    → tap an Event-rollup card → Event detail (3.8)
      → tap a Día row → Session detail (3.7)
  (same three-altitude drill-down §2 already establishes for the rest of
  this tab — see §2's "How the three altitudes relate")

Event detail (3.8):
  tap any Día row → Session detail (3.7) for that day

Elsewhere (entry points into this tab's screens, not from the tab itself):
  Home's post-close "Ver detalle" (home.md §3.12)     → Session detail (3.7)
    directly, for the Session that just closed
  Eventos' "Ver resumen en Resultados" (events.md §3.16) → Event detail (3.8)
    directly, for that specific closed Event
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no Session ever closed
4. Main view — free tier, with a still-active Event (En curso present)
5. Main view — free tier, no active Event (most common day-to-day)
6. Main view — paid tier (adds Rendimiento por bazar always; adds Tus
   clientes in whichever of its three states applies — populated,
   zero-Claims-yet, or `loyaltyEnabled=false`)
7. Session detail
8. Event detail — closed (day-by-day breakdown + totals)
9. Rendimiento por bazar (paid) — con datos
10. Rendimiento por bazar (paid) — sin eventos registrados (empty state)
11. Rendimiento por bazar — detalle de bazar (Historial filtrado)
12. Tus clientes — segmentación (paid + seguimiento de clientas activo, con
    datos)
13. Tus clientes — sin datos aún (empty state)
14. Defensive fallback / load error

Notably fewer states than `home.md` (23), `inventory.md` (18), or
`events.md` (18) — Resultados has no forms, no writes, no destructive
actions, and therefore no confirmation dialogs, no draft-preservation
states, and no save/error pairs. It's the only one of the four tabs that is
purely read-side. The three states added since the earlier remediation pass
(§3.10, §3.11, and now §3.13) are all still read-only, so this remains true;
applying Venue changed what §3.9/§3.11 group by, and resolving Q8 changed
what §3.6/§3.12 are gated by and added §3.13 — neither changed how many
*kinds* of interaction this tab supports.

## 6. Minimum step count

| Scenario | Taps | Why it can't be fewer |
|---|---|---|
| Ver el resumen justo al cerrar una sesión | 1 (Ver detalle, `home.md` §3.12) | Home's immediate confirmation already identifies exactly which Session; this is a direct hand-off, not a second search. |
| Ver el total histórico | 1 (abrir la pestaña) | It's the first thing shown, no further tap needed. |
| Ver el detalle de un día ya cerrado, desde Resultados | 2 (abrir pestaña → tocar la fila) | Shortest possible once she's browsing rather than being handed off directly. |
| Ver el resumen completo de un evento ya cerrado, desde Resultados | 2 (abrir pestaña → tocar la tarjeta) | Shortest path when she's already browsing Resultados directly. |
| Ver el resumen completo de un evento ya cerrado, desde Eventos | 3 (abrir Eventos → tocar tarjeta → Ver resumen en Resultados) | One hop more than arriving directly (`events.md` §6 counts only the 2 taps taken once already inside Eventos, not the initial tab-open — counted on the same basis as this row, the Eventos route costs one more tap than going to Resultados directly. Not a defect: Eventos' hand-off exists for someone who started there for Eventos' own reasons, not to be the fastest route to a report.) |
| Ver rendimiento por bazar / Ver tus clientes (paid) | 2 (abrir pestaña → Ver más) | Same shape as the row above — a one-line teaser plus one tap into the full view. Assumes the row is tappable: "Rendimiento por bazar" always is, for a paid merchant; "Tus clientes" is too, whenever `loyaltyEnabled=true` (populated or its own §3.13 empty state) — when `loyaltyEnabled=false`, "Tus clientes" is a passive note with nothing to tap, so this scenario doesn't apply to it (§3.6, §4). |
| Ver qué eventos componen un renglón de "Rendimiento por bazar" | 3 (abrir pestaña → Ver más → tocar el renglón del lugar) | One tap deeper than reaching the summary itself (row above) — the same per-altitude cost §2 already establishes for Historial → Event detail, just entered from a different starting altitude. |
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
- **Paid-tier sections (§3.9/§3.10/§3.12/§3.13) appear or disappear as whole
  units based on Business capabilities — never a per-screen or per-visit
  toggle Ana touches.** "Rendimiento por bazar" is gated by
  `subscriptionTier` alone; "Tus clientes" is gated by `subscriptionTier`
  **and** `loyaltyEnabled` together (`decision-log.md` D22). Whether either
  section specifically shows data or its own empty state (§3.9 vs. §3.10;
  §3.12 vs. §3.13) is a separate, data-based read, resolved automatically —
  never a manual toggle either.
- Per-Product breakdowns (§3.7/§3.8) are aggregated automatically from
  SaleItems, never typed or summarized by Ana herself.
- Cold-start vs. main-view resolution reuses the same "has anything closed
  yet" read the rest of the app already understands — not a separately
  tracked flag.
- The venue drill-down (§3.11) reuses §3.9's own `venueId` grouping key and
  Historial's own card shape — computed once, read twice, never a
  separately maintained list.
- **Venue identity itself is resolved once, at Event-creation time, by
  `events.md`'s own Elegir lugar picker** — this doc never re-derives or
  re-matches venue identity of its own accord; every grouping here simply
  reads the `venueId` Selling already recorded.
- **Derived Customer Intelligence is computed once, upstream, by
  Loyalty-claim** — this doc never re-derives frequency/occasional counts
  of its own accord; §3.12 simply reads the one aggregate signal Loyalty-
  claim exposes read-only to Intelligence (`domain-model.md`).

## 8. Open questions

1. **[Q8 — Resolved, via `product/99-rfc/0002-loyalty-claim-complete-capability.md`
   (Accepted) and `decision-log.md` D22; full record in
   `company/business-decisions.md`.] Customer Segmentation is a core,
   resolved capability — gated by `subscriptionTier=paid` and
   `loyaltyEnabled=true` together, consuming only Derived Customer
   Intelligence.** Previously, nothing in the Foundation gave the merchant
   app a way to know that two different Sales came from the same repeat
   customer, and Loyalty-claim's original "zero merchant IA presence"
   wording (`decision-log.md` D10) seemed to foreclose the idea entirely —
   §3.12 ("Tus clientes") was designed as an explicitly illustrative
   placeholder pending this decision, flagged directly in the wireframes/
   flow themselves (§3.6, §3.12's own header, §4), not only in prose. **This
   is now resolved, not merely mitigated:** Claim generalizes to multiple,
   mode-appropriate mechanisms (the existing NFC tag scan, D4/D10, and a new
   Sale-level Claim Token/QR, D22) that all converge on the identical
   terminal write — one or more Customer↔SaleItem links. `registrationMode`
   determines *which* mechanism a given Sale uses, never *whether* the
   capability exists (`domain-model.md`'s "Multi-mechanism Claim
   resolution"). Customer Identity stays exclusively on the Loyalty
   platform — the Merchant Application never performs identification and
   never reads a raw Customer or Claim record (`decision-log.md` D21's
   corrected wording: displaying a passive artifact, like a QR the customer
   scans, is explicitly permitted; running any part of identification or
   the Loyalty experience is not). The Merchant Application consumes only
   **Derived Customer Intelligence** — an anonymized, aggregate signal
   Loyalty-claim computes from its Claims and exposes read-only to
   Intelligence (`domain-model.md`'s bounded-context table,
   `ubiquitous-language.md`). §3.6/§3.12/§3.13 now design directly against
   this real, resolved architecture: "Tus clientes" is gated by
   `loyaltyEnabled` independently of `subscriptionTier` (§2 step 4), with
   its own passive not-yet-activated note (§3.6) and its own
   zero-Claims-yet empty state (§3.13) — two states this doc never needed
   while the row was illustrative. What remains genuinely open — narrower
   than before, and tracked in §11, not here — is only the specific
   segmentation algorithm/thresholds (what precisely counts as "frecuente"
   vs. "ocasional"); `company/CLAUDE.md`'s own scope note on this is
   unchanged by this resolution.

2. **[Q9 — Resolved, via `product/99-rfc/0001-venue-entity.md`
   (Accepted) and `decision-log.md` D20; full record in
   `product/02-ux/product-decisions.md`.] "Venue/bazaar" is now its own
   identity, distinct from Event.** §3.9's "Rendimiento por bazar" previously
   could only group by exact string match on the freeform `Nombre` field
   Event used to carry (`events.md`'s old §3.6) — there was no Venue/Location
   entity in `domain-model.md`, and `Lugar` was optional, freeform text, not
   an identifier. A typo or slight renaming across visits could silently
   fragment what should be one row — this spec previously proceeded with
   exact-name-match as a stated, honest approximation, not a precise
   architecture. **This is now resolved, not merely mitigated:** a new
   Venue aggregate root (`id`, `businessId`, `displayName`, optional
   address/notes, `active`) is a required reference from Event
   (`venueId`, not nullable), resolved via a create-or-select picker at
   Event-creation time (`events.md` §3.7) that mirrors Inventario's own
   Product picker, including its case-insensitive/trimmed matching rule.
   §3.9/§3.11 now group by `venueId` — a real identity, never an
   approximate string match — so the fragmentation risk this item used to
   flag is resolved by construction. The tap-through from each §3.9 row into
   a filtered Historial view (§3.11) still exists and is still useful, but
   for a narrower residual risk now (accidentally creating a near-duplicate
   Venue instead of recognizing an existing one in the picker), not for the
   original silent-typo-fragmentation risk, which can no longer occur.

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

8. **[Escalated as Q13, open, logged in `product/02-ux/product-decisions.md`
   as a Product Decision] Should "NFC adoption rate" (% of Sales sold via
   `nfc` vs. `buttons`) be free-tier or paid-tier?** Raised during the
   Product Owner's 2026-08-04 Medium-Fidelity comprehension pass asking
   whether Resultados surfaces enough insight. Confirmed computable now,
   no new field — `Session.operatingMode`, resolved once at Session-open
   (D23) and immutable while `active`, already gives a plain join over
   existing data. Unlike the other insight types raised in the same pass
   (sales trends, top products, ticket average — all "counts" arithmetic
   over existing totals; event performance — already Approved as
   "Rendimiento por bazar," §3.9), this metric has zero precedent anywhere
   in this document — no existing section/tier placement to inherit, and a
   plausible argument either way (arithmetic-over-counts suggests free
   tier, consistent with the rest; measuring usage of a paid-only capability
   suggests paid tier). Same shape as item 7 above — a placement question,
   not an architecture gap — but genuinely undecided rather than an
   inference to flag. Not designed anywhere in this document until resolved.

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
  (§3.3). The `loyaltyEnabled=false` note (§3.6) shows no invented
  "Activar" control either, for the same reason.
- *"Never ask twice"* — nothing in this tab asks Ana to re-enter or confirm
  a number the system already computed; §7 is the direct enumeration.
- *"Technology should disappear"* — loading states stay silent unless
  genuinely slow (§3.1/§3.2), identical convention to the other three tabs.
- *"Selling is a state, not a navigation destination"* — Resultados offers
  no selling entry point of its own anywhere except the cold-start hand-off
  to Hoy (§3.3, same exception every other tab's cold start makes),
  expressing this principle mostly by deliberate absence (§1).
- *"Business language before technical language"* — copy uses "Sesión
  rápida," "Día N," "Por producto," "clientas frecuentes," "lugar" — never
  "Session," "SaleItem," "eventId," "Venue," "Customer," "Claim," or
  "loyaltyEnabled," anywhere on screen.
- *"The merchant experiences Products, the platform preserves Inventory
  traceability"* — §3.7/§3.8's "Por producto" breakdowns are Product-name +
  count only, never a Lot/InventoryUnit reference.
- *"Every repeated decision should become automation"* — §7 is the direct
  enumeration applied to Resultados.
- *"Capture business truth once, reuse it forever"* — Día N, Event rollups,
  and "which section a row belongs under" are all reused from Home's/
  Eventos' existing computations, never re-derived (§2, §7); the venue
  drill-down (§3.11) reuses the exact same `venueId` grouping key and card
  shape §3.9 already computes, rather than deriving a second, parallel
  list; "Tus clientes" (§3.12) reuses the single Derived Customer
  Intelligence signal Loyalty-claim computes, rather than deriving its own
  segmentation logic.
- *"Collect data today. Create intelligence tomorrow."* — directly names
  this tab's whole premise: free tier is the "collect" side (counts/totals
  over data already captured elsewhere), paid tier (§3.9/§3.12) is the
  first designed expression of "intelligence" over that same data, exactly
  the two lower-priority validated frictions `company/CLAUDE.md` names.
- *"The best interface stays out of the merchant's way"* — no forms, no
  destructive actions exist in this tab, so there's nothing to protect her
  from losing; the load-failure fallback (§3.14) never blocks the rest of
  the app; a Quick-Session-only paid merchant is shown a plain, factual
  empty state (§3.10), and a paid merchant who hasn't activated loyalty
  tracking, or has but has zero Claims yet, is shown equally plain, factual
  states (§3.6, §3.13) — none of them ever treated as a failure or an
  incomplete way of using the app.

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — `subscriptionTier` gates
  "Rendimiento por bazar" as a whole section (§3.9/§3.10); `subscriptionTier`
  **and** `loyaltyEnabled` together gate "Tus clientes" (§3.6/§3.12/§3.13,
  `decision-log.md` D22) — both decided at the Business level, never a
  per-screen or per-visit question, and `registrationMode` never enters
  either gate (it only selects which Claim mechanism a Sale uses,
  `domain-model.md`'s "Multi-mechanism Claim resolution"). Whether either
  section shows data or its own empty state is a separate, data-based axis
  — it doesn't contradict this principle, since each section is still
  always present (or absent) purely by capability state; only its content
  varies with what actually exists to show.
- *#3 (optional relationships stay optional in the data model)* — Historial
  mixing Event-rollups and standalone Sesión-rápida rows (§2, §10) only
  works because `Session.eventId` is genuinely nullable, not a UI
  workaround. The same nullability is exactly why a Quick-Session-only
  paid merchant is a normal, modeled outcome, not an edge case requiring a
  UI trick — it's the direct reason §3.10 exists. `Event.venueId`, by
  contrast, is deliberately required (D20) — a Quick Session simply has no
  Event and therefore no Venue at all, which is why it never contributes to
  §3.9's aggregate.
- *#4 (internal-only entities never leak into user-facing language)* —
  Session, Sale, SaleItem, and Event are never named as such; "Día N,"
  "ventas," "Por producto" carry the same weight without exposing the
  model. Venue, unlike those internal entities, is named in copy
  deliberately ("lugar") — it's a real, referenceable identity, not a
  detail being hidden. Customer and Claim, by contrast, are never named at
  all anywhere in this doc — "Tus clientes" only ever shows the derived
  frequent/occasional counts, never the underlying entities.
- *#6 (one-way dependency direction)* — directly why §8 item 3 exists:
  Resultados/Intelligence only ever reads Selling and Inventory data
  (`domain-model.md` bounded-context table, which now includes Venue under
  Selling per D20), and this spec deliberately avoided designing a
  mechanic that would require writing back into Session. Intelligence's
  table row also now includes a read-only edge to Loyalty-claim, scoped
  strictly to Derived Customer Intelligence (D22) — §3.12/§3.13 never
  design anything beyond consuming that one aggregate signal, consistent
  with the same one-way rule.

## 10. Decisions made

- **Historial's Event-rollup cards and §3.11's filtered venue-detail cards
  now show Event type alongside `Venue.displayName`**, the same subordinate
  role Type already plays in `events.md`'s Event detail. Safe to add with
  zero ambiguity — `Event.type` is a closed, frozen 6-item enum
  (`decision-log.md` D16), the same vocabulary already shown elsewhere in
  the app, no new copy decision. Most useful in §3.11, where every card
  already repeats the same Venue name and Type is the one differentiator a
  card there can add.
- **Three new free-tier insight elements added to the main view
  (§3.4/§3.5/§3.6): ticket promedio (inline on the "Total histórico" line),
  sales trend (folded into a headline statement, never shown as raw
  side-by-side numbers), and "Top productos · todo tu historial" (a new
  section, reusing §3.7/§3.8's existing per-Product aggregation, re-scoped
  to all-time).** All three confirmed computable now with no new fields
  (`architect` finding, `product/02-ux/product-decisions.md` Q13) and
  classified free-tier — the same "counts" classification this doc's own
  established precedent already gives per-Product breakdowns. Placed above
  any paid-tier content in §3.6, since none of the three depend on
  `subscriptionTier`. NFC adoption rate (Q13) is unaffected and stays open
  — it has no precedent in this doc and a genuine tier-placement ambiguity
  the other three don't share.
- **Two headline-level "paired fact" statements added, rendered at the same
  visual priority as "Total histórico," directly resolving `ux-critic`'s
  synthesis-gap finding** that the improvements above, even combined, were
  still separate facts Ana had to connect herself. Each statement pairs two
  values this doc already computes independently (a product's identity +
  its own count; this week vs. last week, stated as direction/magnitude)
  into one retrospective, descriptive sentence — never evaluative, never a
  suggestion of what to do next, same guardrail as §3.9's existing
  plain-sort precedent (`company/backlog.md` #3). Gracefully omitted, never
  fabricated, when the underlying comparison has no real data yet (§9's "no
  fabricated venue data" principle, extended here to prose).
- **"Rendimiento por bazar" (§3.9) rows now carry a plain rank number (1.,
  2., 3.) instead of a magnitude-proportional bar.** Product Owner decision
  — a bar was judged too close to implying a recommendation, the exact risk
  this section already exists to avoid. Primarily a visual-treatment call,
  but changes what the row displays, so it's recorded here even though its
  full resolution belongs to Medium-Fidelity.
- **Historial merges closed Event-rollups and standalone closed Quick
  Sessions into one reverse-chronological list.** A genuinely new pattern
  relative to Eventos (which only ever lists Events) — necessary because
  Journey 5 explicitly covers "past Sessions/Events" together, and a Quick
  Session's history would otherwise have no home anywhere in the app.
- **"En curso" makes already-closed Días of a still-active Event
  individually tappable**, deliberately differing from `events.md`
  §3.14/§3.15's passive treatment of the same rows — Resultados is where
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
- **"Rendimiento por bazar" now groups by `venueId`, not exact-name match on
  Event's former freeform `Nombre` — applies `product/99-rfc/0001-venue-entity.md`
  (Accepted) and `decision-log.md` D20.** This is the direct fix for what
  was previously logged as Q9 (`product/02-ux/product-decisions.md`): each
  row in §3.9 now represents one real Venue, an independent aggregate root,
  not one distinct string that happened to match exactly. No structural
  change to any screen in this doc — same card shapes, same drill-down,
  same three-altitude model (§2) — only the underlying grouping key and
  identity source changed, exactly as this doc's own Future Considerations
  previously anticipated it would if a Venue entity were ever introduced
  (that anticipatory note is now removed from §11, since it's applied, not
  future).
- **"Rendimiento por bazar" rows are tappable, drilling into a filtered
  Historial view (§3.11) and onward into the same Event detail (§3.8)/
  Session detail (§3.7) screens the rest of this tab already uses** —
  restores the three-altitude drill-down model (§2) this section previously
  broke. No new screen type was invented: the filtered view reuses
  Historial's existing Event-rollup card shape and the exact same
  `venueId` grouping key §3.9's own aggregate uses, so what she sees
  filtered is exactly what was summed.
- **An explicit empty state (§3.10) now covers a paid merchant with closed
  Sessions but zero Event-grouped Sessions (Quick-Session-only history)** —
  a real, reachable case per `company/CLAUDE.md`'s "own sales history" (not
  Event history) eligibility rule. Copy is plain and factual, same brand
  posture as `events.md` §3.17, and never implies Quick-Session-only
  selling is a lesser or incomplete way to use the app. "Tus clientes"
  (§3.6/§3.12/§3.13) is unaffected by this same condition, since its gating
  and data source don't depend on Event/Venue data at all.
- **"Tus clientes" (§3.6/§3.12) is now a real, resolved spec — applies
  `product/99-rfc/0002-loyalty-claim-complete-capability.md` (Accepted) and
  `decision-log.md` D22.** This is the direct resolution of what was
  previously logged as Q8 (`company/business-decisions.md`): Customer
  Segmentation is a core capability gated by `subscriptionTier=paid`
  **and** `loyaltyEnabled=true` — not `subscriptionTier` alone — consuming
  only Derived Customer Intelligence, never raw Customer/Claim data. The
  documentation-only `*` illustrative marker previously carried on this row
  (§3.6/§3.12/§4) is retired throughout the doc; every row shown in this
  document is now a real, specified feature, styled identically to
  "Rendimiento por bazar." Two new states were designed to cover the
  `loyaltyEnabled` dimension this doc never needed before: a passive,
  non-tappable note for `loyaltyEnabled=false` (§3.6 — a real, reachable
  state, since `registrationMode` and `loyaltyEnabled` are independent
  Business capabilities) and an empty state for `loyaltyEnabled=true` with
  zero Claims recorded yet (§3.13, new screen). What remains genuinely
  open — narrower than before — is only the specific segmentation
  algorithm/thresholds; tracked in §11, not as an open question here, since
  `company/CLAUDE.md` already scopes that out explicitly rather than
  treating it as awaiting a decision-owner's call.
- **No self-service loyalty-activation control designed within this tab
  for the `loyaltyEnabled=false` state (§3.6).** Q5
  (`company/business-decisions.md`, Resolved) and `decision-log.md` D25
  establish that Business Capabilities, including `loyaltyEnabled`, are
  fully self-service and bidirectional at any time — but the actual toggle
  ("Activar clientes frecuentes") is designed once, in
  `product/02-ux/settings.md` (§3.3a/§3.4), reached from Home's header "▾,"
  never duplicated here. §3.6's note now names Configuración as the real
  place to go — a plain-text pointer, added now that Settings exists as an
  Approved destination to point to — but stays non-tappable in this doc:
  inventing a second, parallel "Activar" control inside Resultados would
  duplicate a capability change this doc doesn't own, contradicting
  `architecture-principles.md` #1 (each capability resolved once, upstream,
  never a per-screen toggle).
- **No paid-tier upgrade/purchase flow designed anywhere in this tab.** The
  free-tier informational note (§3.4/§3.5) stays passive text, not a
  tappable CTA — payments/checkout are an explicit `company/CLAUDE.md`
  non-goal. `subscriptionTier` is now confirmed self-service-editable in
  both directions (Q5, `company/business-decisions.md`, Resolved;
  `decision-log.md` D25), but the actual "Activar plan de pago"/"Volver al
  plan gratis" actions are designed once, in `product/02-ux/settings.md`
  (§3.4/§3.5), never duplicated here — this doc's free-tier note tells her
  what paid unlocks, not how to get it.
- **Cold start's CTA routes to Hoy**, reusing an existing tab rather than
  inventing a new destination — same pattern the other three docs already
  established for their own cold starts.
- **This doc designs no Venue-management surface of its own** — Resultados
  only ever reads `venueId` as a grouping key; creating, selecting, renaming,
  or deactivating a Venue happens entirely in `events.md` §3.7, per
  `product/99-rfc/0001-venue-entity.md`'s own scope note that Venue is not a
  full location-management module.
- **All merchant-facing copy that points at "Tus clientes" (§3.4/§3.5's
  free-tier note, §3.6's `loyaltyEnabled=false` note, §3.13's empty state)
  is worded as a count/category ("cuántas son tus clientas frecuentes y
  cuántas ocasionales"), never as an identity claim ("quiénes son tus
  clientas").** Corrected per `ux-critic`'s RPT2-MAJ1 finding
  (`ux-critic-findings.md`): the architecture (§3.12,
  `product/99-rfc/0002-loyalty-claim-complete-capability.md`, D22) only ever
  exposes an anonymized aggregate signal — two counts — never a name or any
  way to identify which specific customer is which. Copy promising she'll
  see "who" her frequent/occasional customers are would set up a real,
  foreseeable expectation break given `company/CLAUDE.md`'s own framing of
  Ana's validated friction as "I can't tell who my repeat customers are" —
  the fix keeps every teaser's promise scoped to exactly what §3.12
  delivers.

## 11. Future considerations

- **A fuller time-series view of sales over time** (e.g. a longer trailing
  window than "this week vs. last week," a proper trend chart) — explicitly
  out of scope for the 2026-08-04 amendment. This week/last week stays a
  plain two-value comparison (folded into one headline statement, §3.4)
  precisely because a real time-series view deserves its own dedicated
  design pass, not a rushed extension of this one.
- **The specific customer-segmentation algorithm/thresholds** — what
  precisely counts as "frecuente" vs. "ocasional" (§3.12's "3 bazares o
  más" / "1 o 2 veces" are illustrative example numbers only, not a
  validated rule). `company/CLAUDE.md`'s own scope note keeps this
  explicitly out of scope for now — this is deliberately placed here rather
  than in §8, since it isn't an open question awaiting a decision-owner's
  call the way Q8 was; it's forward-looking design/data-science work that
  can't meaningfully happen before real Claim data exists. Revisit once
  Loyalty-claim's Derived Customer Intelligence signal is actually built
  and there's real data to validate thresholds against
  (`company/backlog.md` #2's staged build order — Stage 1 NFC, Stage 2
  Sale-QR, neither started).
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
- If `events.md` ever designs a Venue-editing/address-capture surface
  (`events.md` §11), this doc's grouping logic needs no change — it already
  keys off `venueId`, not any freeform text, so a Venue gaining a
  displayName correction or an address later has zero structural effect
  here.
