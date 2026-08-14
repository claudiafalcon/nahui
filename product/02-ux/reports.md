# Resultados — UX Specification

Status: Approved. Full UX Remediation cycle complete (RPT-M1, RPT-M2,
RPT-M3). **[Amended 2026-08-13 — see
reports.changelog.md#status-full-ux-remediation]**

**Updated to apply the Venue aggregate root** (`product/99-rfc/0001-venue-entity.md`,
Accepted; `decision-log.md` D20): "Rendimiento por bazar" (§3.9/§3.11) groups
by `venueId`, a real independent identity, instead of exact-string matching
on Event's former freeform `Nombre`. **[see
reports.changelog.md#status-d20-venue-aggregate]**

**Updated to apply the resolved Customer Segmentation capability**
(`product/99-rfc/0002-loyalty-claim-complete-capability.md`, Accepted;
`decision-log.md` D22): "Tus clientes" (§3.6/§3.12/§3.13) is a real,
specified feature — Customer Segmentation is gated by `subscriptionTier=paid`
alone (corrected by D34 below), consuming only Derived Customer Intelligence,
never raw Customer/Claim data. **[see
reports.changelog.md#status-d22-customer-segmentation]**

**Amended 2026-08-04 (consolidated pass — Event type legibility, three new
free-tier insight elements, and a headline synthesis fix):** Historial/§3.11
cards now show Event type; three new free-tier insight elements (ticket
promedio, sales trend, top products all-time); two headline "paired fact"
statements at the same visual priority as "Total histórico"; "Rendimiento por
bazar" rows carry a plain rank number instead of a magnitude bar. **[see
reports.changelog.md#status-2026-08-04-consolidated-pass]**

**Amended 2026-08-08 (`decision-log.md` D33, MVP pricing operating model):**
every dollar figure is grounded as a sum of `SaleItem.pricePaid`;
`bazaarCost` is never read or netted here. **[see
reports.changelog.md#status-2026-08-08-d33-mvp-pricing]**

**Further amended 2026-08-08 (`decision-log.md` D34 — Customer Segmentation
visibility gate corrected):** "Tus clientes" now gates on
`subscriptionTier=paid` alone; the two previously-separate
`loyaltyEnabled`-dependent states collapse into one naturally-empty, tappable
§3.13 state. **[see
reports.changelog.md#status-2026-08-08-d34-segmentation-gate-corrected]**

**Amended 2026-08-08 (`decision-log.md` D34/D35/D37;
`product/99-rfc/0004-customer-loyalty-participation-record.md`, Accepted) —
Loyalty Participation view added:** new §3.15–§3.18 give Ana a per-customer
view of loyalty progress, reading D35's allowlist exactly, gated identically
to "Tus clientes." "Confirmar recompensa entregada" (§3.17/§3.18) is designed
against RFC 0005 (now Accepted, D39). **[see
reports.changelog.md#status-2026-08-08-loyalty-participation-view]**

**Further amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled`
retired):** every remaining reference to `loyaltyEnabled` as a live merchant
decision, or pointing to a now-retired `settings.md` action, is corrected;
§3.13's zero-Claims empty state no longer ties emptiness to a toggle. **[see
reports.changelog.md#status-2026-08-09-d40-loyalty-enabled-retired]**

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
- **No customer-facing registration/QR-claim flow, and no Loyalty
  reward-threshold self-service configuration surface.** Both are
  separate, not-yet-designed pieces of the Frequent Customers capability
  (`company/backlog.md` #2 Stage 2; `decision-log.md` D37's
  `Business.loyaltyRewardThreshold`). This document specs only the
  merchant-facing read (and one narrow write, D39) once that data
  already exists — never how a customer claims a purchase, and never how
  Ana sets or changes her own reward threshold in Configuración. See §11.
- **No specific customer-segmentation algorithm.** `company/CLAUDE.md`
  describes the *problem* (can't tell a high-volume-occasional buyer from a
  small-but-every-bazaar buyer) — the underlying capability and data source
  are now resolved (`product/99-rfc/0002-loyalty-claim-complete-capability.md`,
  Accepted; `decision-log.md` D22, corrected by D34 and D40): Customer Segmentation
  is gated by `subscriptionTier=paid` alone — the same tier-based gate as
  "Rendimiento por bazar," not a joint gate — and consumes only **Derived
  Customer Intelligence**, an anonymized aggregate signal computed by the
  future Loyalty-claim context and exposed read-only to Intelligence.
  **`loyaltyEnabled` is retired outright** (`decision-log.md` D40) — Claim
  collection and this section's visibility now share the identical
  `subscriptionTier=paid` gate, with no separate merchant decision governing
  whether Claims accumulate. What's still genuinely open is
  narrower than before: the
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
- **"What should I pay attention to, going forward?"** (paid tier — see §2)
  — not "how did today go" but "based on everything I've sold so far, is
  there a pattern worth knowing." This is exactly the two lower-priority
  validated frictions from `company/CLAUDE.md`'s core thesis: which bazares
  are actually worth her time (using only her own history, never
  multi-vendor data), and which customers are loyal vs. occasional. Both
  gate on `subscriptionTier=paid` alone (`decision-log.md` D34) — customer
  segmentation carries no second, independent activation requirement.
  `company/backlog.md` #2 confirms this is current MVP UX scope, not
  deferred — the old "blocked until real sales data exists" gate is obsolete
  (`company/lessons.md`, 2026-07-31).

  **A third element within "what should I pay attention to, going
  forward?"** — alongside "which bazares are worth her time" and
  "frequent vs. occasional customer counts," Ana can now see, per
  identified customer, exactly how close each one is to her next reward
  and confirm when she's physically handed it over. This is the
  identified counterpart to "Tus clientes"'s anonymized counts — same
  underlying Claims, a second, additive, narrower-but-identified view of
  them (`decision-log.md` D35), never a replacement.

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

       A second entry point, "Tus clientes," is also gated by
       `subscriptionTier=paid` alone — the identical tier-based gate as
       "Rendimiento por bazar," not a second, joint gate
       (`decision-log.md` D34, correcting the joint-gate clause D22 had
       introduced, and extended by D40 to Claim collection itself — there
       is no separate `loyaltyEnabled` capability left to govern whether
       Claims accumulate; both the data and the visibility now read from
       the same single gate). `registrationMode` never
       enters this gate either — it only ever determines *which* Claim
       mechanism a given Sale uses, never *whether* Customer Segmentation
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

       Within "Tus clientes" specifically: has Loyalty-claim recorded any
       Claim yet for this Business?
         → NO:  empty-state teaser (§3.6) → §3.12's own empty state
           (§3.13) — the ordinary state for a Business that just became
           Paid, or one whose customers simply haven't completed a Claim
           yet; Claim collection is automatic the instant
           `subscriptionTier=paid` (`decision-log.md` D40), so there's no
           merchant-side reason for this to be empty beyond "hasn't
           happened yet" — same restraint
           "Rendimiento por bazar"'s own empty teaser above already takes
           toward a Quick-Session-only paid merchant.
         → YES: populated teaser (§3.6) → §3.12's populated view.

       Within "Tus clientes," a second, additive signal — "Recompensas"
       (Loyalty Participation Record, `decision-log.md` D35/D37) — tracks
       the identical YES/NO branch immediately above, never independently
       gated: a Customer record is created only at the moment a Claim
       first resolves for a given email (D35: "email... captured at first
       Claim"), so "zero Claims" and "zero Customer records" are the same
       condition for this Business, by construction.
         → NO (zero Claims): §3.13 carries one additional passive line
           for Recompensas — no separate screen, no tap target, same
           restraint §3.13 already applies to itself.
         → YES: §3.12 gains one additional, independently tappable
           teaser row, "Recompensas" → §3.15 (populated list, grouped
           by readiness) → §3.16 (per-customer detail — exactly D35's
           seven-field allowlist, never more) → optionally, §3.17/§3.18
           ("Confirmar recompensa entregada" —
           `product/99-rfc/0005-reward-cycle-confirmation-write-edge.md`,
           Accepted, `decision-log.md` D39).
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

**Grounding every dollar figure in this document (`decision-log.md`
D33):** every $ figure anywhere in this tab — "Total histórico," ticket
promedio, every Historial/En curso card's $ total, Session detail's
"$1,120 en total," Event detail's "$2,340," and "Rendimiento por bazar"'s
"$780 promedio/día" — is a sum (or a sum divided by a count) of
`SaleItem.pricePaid` values, each already resolved automatically at the
moment its Sale was written (that Event's Price Override for the sold
Product if one exists, else the Product's `defaultPrice`;
`domain-model.md`'s "Price resolution" Key Mechanism). Nothing in this
document re-derives, re-prices, or recomputes any of these figures
independently — read-side sums over data other contexts already wrote,
the same "capture business truth once, reuse it forever" discipline §7/
§9 already state for every other computed value here.

**One documented exception: `lifetimeSpend` on §3.16's customer detail is
not computed here.** Unlike every other $ figure in this document (a sum
of `SaleItem.pricePaid`, resolved by Selling/Intelligence, D33),
`lifetimeSpend` is a Customer-owned field, stored and incrementally
updated by Loyalty-claim itself at the moment each Claim resolves
(`decision-log.md` D35 — "the same D33 storage pattern... Loyalty-claim
mutating its own owned aggregate"). Resultados only ever displays this
value via the Loyalty Participation Record read edge; it never computes,
re-derives, or re-sums it — a different context owns and writes this
number, unlike every other dollar figure this doc renders.

**`Event.bazaarCost`, though captured and displayed elsewhere
(`events.md`'s Event detail), is never read, displayed, or netted against
any figure in this document.** D33 is explicit that `bazaarCost` is
captured-but-not-computed in this MVP — no profitability/margin figure
subtracting cost from revenue exists anywhere in Nahui today, and this
document does not introduce one. Stated here explicitly, not only in
`events.md`, because Resultados is the one tab where a merchant might
otherwise expect exactly that kind of figure — see §10/§11 for this named
as a deliberate boundary, not a gap.

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
│  Tu producto estrella: Bolsas, con   │
│  42 piezas vendidas en total.          │  ← same visual priority as
│  Esta semana vendiste 4 ventas menos  │     "Total histórico"
│  que la semana pasada.                 │
│                                │
│  Top productos · todo tu historial  │
│   1. Bolsas              42        │
│   2. Accesorios        25        │
│   3. Playeras           18        │
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
│  │ cómo te fue por bazar y         │ │
│  │ cuántas de tus clientas son      │ │
│  │ frecuentes y cuántas             │ │
│  │ ocasionales.                     │ │
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
- **The paid-tier note now promises both benefits unconditionally on
  `subscriptionTier=paid` alone** — Customer Segmentation carries no
  second, independent activation requirement (`decision-log.md` D34,
  correcting the joint-gate clause D22 had introduced, and further
  corrected by D40: there is no `loyaltyEnabled` left to have a state at
  all). A free-tier merchant who goes paid sees both benefits described
  here become real immediately — a paid merchant with zero Claims
  recorded yet simply sees "Tus clientes"'s own naturally-empty state
  (§3.13), the same way she'd see "Rendimiento por bazar"'s own empty
  state if she'd never used Eventos. Still plain informational text, not
  a card with a tap target — see §10 for why no upgrade CTA is designed
  here.
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
│  Tu producto estrella: Bolsas, con   │
│  42 piezas vendidas en total.          │  ← same visual priority as
│  Esta semana vendiste 4 ventas menos  │     "Total histórico"
│  que la semana pasada.                 │
│                                │
│  Top productos · todo tu historial  │
│   1. Bolsas              42        │
│   2. Accesorios        25        │
│   3. Playeras           18        │
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
│  │ cómo te fue por bazar y         │ │
│  │ cuántas de tus clientas son      │ │
│  │ frecuentes y cuántas             │ │
│  │ ocasionales.                     │ │
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
│  Tu producto estrella: Bolsas, con   │
│  42 piezas vendidas en total.          │  ← same visual priority as
│  Esta semana vendiste 4 ventas menos  │     "Total histórico"
│  que la semana pasada.                 │
│                                │
│  Top productos · todo tu historial  │
│   1. Bolsas              42        │
│   2. Accesorios        25        │
│   3. Playeras           18        │
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
(Above: at least one Claim already recorded for this Business — see the
variant below for the other reachable state, zero Claims recorded yet,
`decision-log.md` D34.)
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
  paid — she already has what it was telling her about, for both
  "Rendimiento por bazar" and "Tus clientes" alike, since both gate on
  `subscriptionTier=paid` alone (`decision-log.md` D34); whether "Tus
  clientes" specifically shows data yet is a separate, data-based
  question, handled below.
- Each summary row here is a one-line teaser of its own full view:
  "Rendimiento por bazar" → §3.9 (or §3.10 if she has no Event-grouped
  Sessions yet); "Tus clientes" → §3.12 (or §3.13 if no Claim has been
  recorded yet — the ordinary state for a newly-Paid Business,
  `decision-log.md` D40) — same pattern as Home's own header being a teaser
  of session-controls (`home.md` §3.7). The teaser now shows a **Venue
  name** ("Plaza Norte") rather than Event's former Nombre.
- **"Rendimiento por bazar" and "Tus clientes" are gated identically, on
  `subscriptionTier=paid` alone, and both are real, fully-specified
  features — styled identically, same typography, same "[Ver más ▸]"
  affordance, no visual demotion of either.** This resolves what was
  previously logged as Q8 (§8 item 1), and is the corrected version of
  D22's original joint-gate wording, corrected by `decision-log.md` D34
  (visibility) and D40 (Claim collection itself) — there is no
  `loyaltyEnabled` field left anywhere, for visibility or for anything
  else. "Tus clientes" never shows raw Customer
  or Claim data; it renders only **Derived Customer Intelligence** — an
  anonymized, aggregate signal (counts of frequent vs. occasional buyers)
  that the future Loyalty-claim context computes and exposes read-only to
  Intelligence (`domain-model.md`, `ubiquitous-language.md`). See the
  variant below for what she sees before any Claim has been recorded yet.
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
- **If this Business has zero Claims recorded yet — the ordinary state for
  a Business newly on the paid plan, or one whose customers simply haven't
  claimed a purchase yet — the row stays tappable but shows an honest
  empty summary instead of sample counts:**
  ```
  Tus clientes             [Ver más ▸]
  Aún no hay datos suficientes
  ```
  leading to §3.12's own empty state (§3.13) — same restraint as
  "Rendimiento por bazar"'s own empty teaser above, never a dead end.
  **This one state covers the entire zero-Claims case, with no
  merchant-configuration branching of any kind** (`decision-log.md` D40,
  extending D34's correction) — Claim collection is a pure, automatic
  consequence of `subscriptionTier=paid`, the same as this section's own
  visibility; there is no `loyaltyEnabled` field left for a paid merchant
  to have "never turned on" or "turned off." Zero Claims simply means no
  customer has completed one yet.
  **Copy states a count/category, never an identity claim** — see the
  annotation under §3.4 and RPT2-MAJ1 (`ux-critic-findings.md`) for why
  this was corrected from an earlier "quiénes son" draft.

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
│   Bolsas              5            │
│   Accesorios        2            │
│   Playeras           3            │
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
│   Bolsas              10           │
│   Accesorios        6            │
│   Playeras           4            │
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
- **This figure is revenue only — "$ promedio/día" is a pure sum of
  `SaleItem.pricePaid` divided by closed-Session count, never netted
  against `Event.bazaarCost`.** `bazaarCost` is Eventos' own
  captured-but-not-computed field (`decision-log.md` D33) and is
  deliberately absent from this screen, this document, and every other
  Resultados figure — a cost-adjusted/profitability view here would be
  exactly the margin computation D33 rules out of this MVP. Flagged here
  specifically because "which bazares are worth her time" (§1) is the one
  question in this document where a merchant might naturally expect cost
  to already be part of the answer — it isn't, by deliberate design, not
  by omission.
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
  its gating (`subscriptionTier=paid`, same as "Rendimiento por bazar"
  itself, `decision-log.md` D34) and data source (Claims generally) don't
  depend on Event/Venue data at all, so a Quick-Session-only paid merchant
  still sees whichever "Tus clientes" state actually applies to her (§3.6)
  even while "Rendimiento por bazar" is empty. The two paid-tier sections
  can be independently empty or populated; neither's state depends on the
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

### 3.12 Tus clientes — segmentación (paid, con Claims registrados)
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
│                                │
│  Recompensas              [Ver más ▸]│
│  1 clienta con recompensa lista      │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- **"Recompensas" is additive content, appended below the unchanged
  Frecuentes/Ocasionales block above** (`decision-log.md` D35's own
  instruction for `ubiquitous-language.md`, "so the two sit side by side
  without merging" — the identical relationship between the two grants,
  applied here to the screen that surfaces them). Summary line reflects
  readiness, not raw counts — the single most actionable fact ("how many
  are ready right now"), same restraint as this screen's own empty-teaser
  bullets elsewhere. If none are ready yet but tracked customers exist:
  "Ninguna clienta ha llegado a su meta todavía." Never shows the
  "frecuente"/"ocasional" category alongside a reward-progress row — two
  independently computed signals with no Foundation-stated relationship
  between them, not implied here (see §11). Styled identically to the two
  rows above it — same "[Ver más ▸]" affordance, no visual demotion. See
  §3.15/§3.16.
- **This is now a real, fully-specified feature, not an illustrative
  placeholder** — the direct resolution of what was previously logged as
  Q8 (`company/business-decisions.md`, Resolved;
  `product/99-rfc/0002-loyalty-claim-complete-capability.md`, Accepted;
  `decision-log.md` D22). Ana sees a plain "Tus clientes" header here,
  rendered identically to "Rendimiento por bazar" — no asterisk, no visual
  demotion, ever.
- **Gated by `subscriptionTier=paid` alone** (§2, §3.6,
  `decision-log.md` D34, correcting D22's original joint-gate wording, and
  extended by D40 to Claim collection itself) — there is no separate
  `loyaltyEnabled` field to play any role in reaching this screen, ever.
  This screen is only ever reached once at least one Claim has been
  recorded for this Business; zero Claims routes to §3.13 instead, not
  this one.
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
│  Todavía no tienes compras            │
│  registradas con seguimiento de       │
│  clientas. En cuanto tus clientas    │
│  empiecen a reclamar sus compras,    │
│  vas a ver aquí cuántas son tus       │
│  clientas frecuentes y cuántas         │
│  ocasionales.                        │
│                                │
│  Recompensas                       │
│  Todavía no tienes clientas con      │
│  seguimiento para mostrar aquí.       │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- **"Recompensas" gets one additional, non-tappable passive line** — same
  restraint this screen already applies to itself; there is nothing to
  drill into yet. Reached whenever zero Claims exist for this Business
  (`decision-log.md` D40) — no special-casing added for Recompensas
  specifically; it's the identical condition as the parent screen's own
  zero-Claims state, restated once for this section rather than
  duplicated logic.
- **A real, reachable state, and now the only one possible**
  (`decision-log.md` D34, extended by D40): zero Claims exist for this
  Business simply because no customer has completed one yet — Claim
  collection has no merchant-side on/off state left to vary.
  Without this state, §3.12 would otherwise render as a silent,
  broken-looking blank screen the first time a paid merchant with zero
  Claims opened it — same reasoning §3.10 (its "Rendimiento por bazar"
  counterpart) already established for the equivalent gap in that section,
  and the same gap `ux-critic-findings.md` RPT-MIN1 flagged as worth
  designing "whenever it becomes real."
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
- **No tappable CTA is shown, and no pointer to Configuración either**
  (`decision-log.md` D40) — there is no longer any capability for Ana to
  check or change there; Frequent Customers is a pure consequence of
  `subscriptionTier=paid`, already confirmed the moment she reads "Tu
  plan: Pago" anywhere in this app. Claims accumulate automatically as her
  existing sales flow continues, and the actual claiming action happens on
  the *customer's* device, never Ana's (`decision-log.md` D21) — no action
  of Ana's, here or in Configuración, would speed that up. This is a
  strict simplification of the earlier design, which pointed to a
  now-retired "Activar clientes frecuentes" action in `settings.md`; that
  destination no longer exists.
- Reached whenever zero Claims exist for this Business (§2, §3.6,
  `decision-log.md` D34/D40) — the one screen every zero-Claims case
  routes to.

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

### 3.15 Recompensas (paid) — con datos
```
┌───────────────────────────────┐
│ ← Tus clientes                   │
│  Recompensas                      │
│  8 clientas con seguimiento ·        │
│  1 con recompensa lista             │
│                                │
│  Con recompensa lista              │
│  ┌───────────────────────────┐ │
│  │ ana.compradora@gmail.com    │ │
│  │ 10 de 10 · lista para        │ │
│  │ entregar                     │ │
│  └───────────────────────────┘ │
│                                │
│  En camino a su próxima recompensa │
│  ┌───────────────────────────┐ │
│  │ fer.lopez22@hotmail.com      │ │
│  │ 6 de 10                      │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ maria.g@gmail.com             │ │
│  │ 2 de 10                      │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- **Sort: customers with a completed cycle awaiting confirmation first
  ("Con recompensa lista"), then remaining customers by
  `currentCycleProgress` descending.** Justification: unlike §3.9's plain
  magnitude sort (a passive fact), this ordering directly serves the one
  thing this screen exists for — letting Ana spot who's ready for a
  reward without scrolling, and secondarily see who's close. Not a
  recommendation-flavored ranking (`company/backlog.md` #3's guardrail
  doesn't apply — this is her own single-Business customer data, no
  cross-vendor dimension).
- **Section headers only render when they have ≥1 row** — reuses
  `events.md` §3.4's already-established header-omission rule verbatim,
  not a new convention.
- **Full email shown, never masked, in both this list and §3.16's
  detail.** D35 leaves this choice explicitly to `ux-designer` ("Whether
  the merchant-facing UI ever renders the raw or masked form is a UX
  decision"). Chosen because `company/CLAUDE.md`'s own validated friction
  is literally "she can't tell who her repeat customers are" — a masked
  email (`an***@gmail.com`) would often fail to let her actually
  recognize someone she knows from WhatsApp/IG, defeating the point of
  this specific, narrower, identified grant. Within D35's explicitly
  sanctioned range either way — see §10.
- **`Business.loyaltyRewardThreshold` (D37) assumed to always have a
  value by the time this screen renders — an illustrative default (e.g.
  10) applies until the merchant sets her own.** D37 explicitly leaves
  "required blocking step vs. sensible default" to `ux-designer`; chosen
  so this document never needs a "no threshold configured" empty state,
  and never needs to design any Settings-side capture UI (out of scope
  here — see §11). The exact default value is illustrative only, same
  convention §3.12's own thresholds already use.
- Reached only from §3.12's tappable "Recompensas" row — never
  independently, so this screen is only ever entered when ≥1 Customer
  record exists for this Business.
- List length not fixed at this fidelity — same restraint this doc
  already takes toward Historial's and "Top productos"'s own unbounded
  lengths.

### 3.16 Detalle de clienta
```
┌───────────────────────────────┐
│ ← Recompensas                    │
│  ana.compradora@gmail.com          │
│                                │
│  Edad: 25-34 años                  │
│  Género: Mujer                     │
│  Compras totales: 14                │
│  Total gastado: $3,180              │
│                                │
│  Recompensa actual                 │
│  10 de 10 · lista para entregar     │
│                                │
│  Recompensas entregadas: 1          │
│                                │
│      [ Confirmar recompensa       │
│         entregada ]              │
├───────────────────────────────┤
│ Hoy  Inventario Eventos [Resultados] │
└───────────────────────────────┘
```
- **Exactly D35's seven-field Loyalty Participation Record allowlist, in
  the same order the allowlist itself is stated, never more, never
  less**: email, edad, género, compras totales (`purchaseCount`), total
  gastado (`lifetimeSpend`), recompensa actual (`currentCycleProgress`
  vs. `Business.loyaltyRewardThreshold`), recompensas entregadas
  (`completedCyclesCount`). **Structurally never rendered here, anywhere,
  ever**: phone, address, payment credentials, any other Customer field,
  any Customer belonging to another Business, raw Claim/Sale data — this
  is a denylist enforced by the read edge's own contract (D35), not a
  convention this screen chooses to follow.
- **Optional fields (`ageRange`, `gender`) show "No indicado" when not
  captured** — plain, factual, same brand posture as every other honest
  gap state in this doc family; never implies she should go collect it.
- **"Compras totales" deliberately doesn't assert whether it counts Sales
  or SaleItems/Claims — see §8, an Architect-resolvable open question,
  not a UX choice.** The label is honest regardless of which; this
  document doesn't invent a counting-unit answer the Foundation hasn't
  stated.
- **"Recompensa actual" and "Compras totales" are two distinct counters,
  never conflated** — `currentCycleProgress` (resets on confirm) vs.
  `purchaseCount` (lifetime, never resets), per D35's schema. Rendered on
  separate, clearly labeled lines specifically to avoid this confusion.
- **"[ Confirmar recompensa entregada ]" only appears when
  `currentCycleProgress >= Business.loyaltyRewardThreshold`** — nothing
  to confirm otherwise. Placed on the detail screen, not the compact list
  row (§3.15), a deliberate choice: this app family never places a
  consequential write action on a compact/scannable list row (Historial
  cards, §3.9's venue rows — none carry an action; actions live on the
  detail screen that shows full context). One extra tap, traded for
  avoiding an accidental reset from a scrolling list. See §6, §10.
- **Speculative section, flagged explicitly**: the button and everything
  downstream of it (§3.17/§3.18) are designed fully against
  `product/99-rfc/0005-reward-cycle-confirmation-write-edge.md`'s
  complete write contract, but that RFC's status is Proposed, not yet
  Accepted. The read-only content above the button (everything else on
  this screen) depends only on the already-Accepted D35/D37.

### 3.17 Confirmar recompensa entregada — confirmación de efecto inmediato
```
┌───────────────────────────────┐
│ ← ana.compradora@gmail.com        │
│  Confirmar recompensa entregada    │
│  Vas a registrar que ya le diste    │
│  su recompensa a esta clienta.       │
│  Su conteo (10 de 10) se reinicia    │
│  a 0 y empieza a acumular otra vez   │
│  para su siguiente recompensa.        │
│                                │
│  Una vez que confirmes, no vas a     │
│  poder deshacerlo — hazlo solo       │
│  cuando ya le hayas dado la          │
│  recompensa.                         │
│      [ Confirmar ahora ]           │
└───────────────────────────────┘
```
- **Reuses `settings.md` §3.4's confirm-screen template shape — the same
  two-tap commit mechanism (a single button committing a real, immediate
  state change, copy stating plainly what changes before she commits) —
  but deliberately not its reversibility.** Every one of `settings.md`'s
  five instances of this shape is a self-service, bidirectional Business
  Capability toggle (D25); each one's copy explicitly reassures Ana that
  nothing lasting is lost (e.g. "Desactivar clientes frecuentes": "lo que
  ya se juntó sigue disponible en Resultados — no se borra"). This action
  is not reversible — RFC 0005 explicitly excludes "any reversal, undo, or
  edit of a completed reward-cycle confirmation," because by the time she
  taps "Confirmar ahora" the physical reward has already left her hands;
  no software undo could retrieve it (RFC 0005's own reasoning, amended
  2026-08-08). The new line above states that plainly, in the same "no
  vas a poder... después" register `onboarding.md` §3.4c already
  established for its own irreversible-write disclosure — not a new
  tonal pattern for this document family — rather than borrowing
  `settings.md`'s reassurance language, which would misrepresent this
  specific action. **This correction is scoped to copy only.** It changes
  nothing about the shared visual/interaction shape. RFC 0005 has since
  been Accepted (`decision-log.md` D39) exactly as drafted — the Product
  Owner explicitly accepted the residual risk this fix's own disclosure
  line names, and no correction mechanism was added — so this section is
  now fully Approved, not speculative.
- Back arrow ("← [email]") or any implicit "no" → returns to §3.16
  unchanged, no write attempted — same restraint as every cancel path in
  this app family. **This is the one and only correction path this action
  ever has.** Before "Confirmar ahora" is tapped, backing out costs
  nothing; after, nothing in this app changes it — no in-app reversal is
  invented here to soften that, consistent with RFC 0005's own explicit
  exclusion.
- **Effect stated verbatim from RFC 0005's contract**:
  `currentCycleProgress → 0`, `completedCyclesCount += 1`, atomic,
  nothing else editable — no create/delete Customer, no editing
  `email`/`ageRange`/`gender`/`purchaseCount`/`lifetimeSpend`, no
  Claim/Sale/SaleItem access, and no reversal, undo, or edit of the
  confirmation itself once committed (RFC 0005's own explicit
  exclusions) — the same "no undo by design" posture `home.md` §3.8/§11
  already established for Finalizar Venta, this Foundation's single most
  consequential atomic write, which likewise ships with no confirm-time
  undo mechanism.

### 3.18 Confirmar recompensa entregada — guardando / error
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│  (pantalla anterior atenuada)      │        │      Guardando…                │
└───────────────────────────────┘        └───────────────────────────────┘

┌───────────────────────────────┐
│  No pudimos guardar tu           │
│  confirmación. Intenta de nuevo.  │
│      [   Reintentar   ]           │
└───────────────────────────────┘
```
- **Same near-instant/slow/error/retry convention already shared across
  `home.md` §3.8c, `inventory.md` §3.10, `events.md` §3.9,
  `onboarding.md` §3.5, `settings.md` §3.9/§3.10** — not reinvented here.
- **Idempotent, keyed retry — `architecture-principles.md` #7, cited by
  name.** This is Resultados' first-ever write, so this principle has
  never been exercised in this document before: a stable idempotency key
  is generated once when "Confirmar ahora" is first tapped and reused
  unchanged on every retry of that attempt. The server treats a repeated
  key as already-applied, returning the original result rather than
  resetting `currentCycleProgress`/incrementing `completedCyclesCount` a
  second time — critical here specifically, since a blind re-execution
  would silently and wrongly cost the customer a second cycle's worth of
  progress.
- **Success → returns directly to §3.16, updated in place** ("0 de
  {threshold}," `completedCyclesCount` incremented by 1, the confirm
  button now absent since nothing is ready anymore), with a brief ambient
  "Recompensa confirmada ✓" line — same posture as `settings.md`'s
  "success → back to vista principal, row updated, no pending state" and
  `home.md` §3.8f's own ambient-confirmation precedent ("Venta finalizada
  ✓"), reused rather than inventing a new success-feedback shape.

## 4. Interaction flow (summary)

```
Open Resultados tab
  → resolve (§2, automatic)
      → load fails ─────────────────────→ fallback (3.14), Reintentar
      → no Session ever closed ─────────→ cold start (3.3) → Hoy (home.md §2)
      → Sessions exist ──────────────────→ main view (3.4/3.5, or 3.6 if paid)

Main view:
  tap an "En curso" Día row      → Session detail (3.7)
  tap a Historial Event card      → Event detail (3.8)
  tap a Historial Sesión rápida card → Session detail (3.7)
  [paid only] tap "Rendimiento por bazar" → 3.9 (or 3.10 if this Business has
    no Event-grouped Sessions yet — see §2 step 4)
  [paid only] tap "Tus clientes" → 3.12 (or 3.13 if this Business has zero
    Claims recorded yet, for any reason — see §2 step 4, `decision-log.md`
    D34)

Tus clientes (3.12, con datos):
  tap "Recompensas [Ver más ▸]" → Recompensas (3.15)

Tus clientes (3.13, sin datos aún):
  Recompensas note shown as passive text only, no destination.

Recompensas (3.15):
  tap a customer row → Detalle de clienta (3.16)

Detalle de clienta (3.16):
  [reward ready only] tap "Confirmar recompensa entregada"
    → Confirmación de efecto inmediato (3.17)
      → back / no → Detalle de clienta (3.16), unchanged
      → Confirmar ahora → Guardando (3.18)
        → error → Reintentar (3.18), idempotent retry
        → success → Detalle de clienta (3.16), updated, "Recompensa
          confirmada ✓"

Load failure anywhere in this branch: covered by the existing whole-tab
fallback (3.14) — Recompensas data resolves as part of the same initial
Resultados load as everything else (§2/§3.1/§3.2), same "no dedicated
sub-screen loading state" rule this doc already establishes. See §8/§11
for the named, still-open, doc-set-wide refinement this connects to
(`ux-critic-findings.md` RPT-S2) — not designed here, deliberately
reusing existing precedent instead of inventing a new partial-failure
pattern.

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
   clientes in whichever of its two states applies — populated, or zero
   Claims recorded yet, `decision-log.md` D34)
7. Session detail
8. Event detail — closed (day-by-day breakdown + totals)
9. Rendimiento por bazar (paid) — con datos
10. Rendimiento por bazar (paid) — sin eventos registrados (empty state)
11. Rendimiento por bazar — detalle de bazar (Historial filtrado)
12. Tus clientes — segmentación (paid, con Claims registrados)
13. Tus clientes — sin datos aún (empty state; the natural zero-Claims state for a Paid-tier Business — no merchant toggle involved, `decision-log.md` D40)
14. Defensive fallback / load error
15. Recompensas (paid) — con datos
16. Detalle de clienta (los siete campos exactos del allowlist de
    Loyalty Participation Record, `decision-log.md` D35)
17. Confirmar recompensa entregada — confirmación de efecto inmediato
    (`product/99-rfc/0005-...`, Accepted, `decision-log.md` D39)
18. Confirmar recompensa entregada — guardando / error

**This document is no longer purely read-side** — §3.17/§3.18 introduce
Resultados' first-ever write. Every other state in this document, including every other
state in this amendment (§3.15, §3.16's read-only content, both
§3.12/§3.13 appends), remains read-only, unchanged from the posture the
paragraph below originally described.

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
| Ver rendimiento por bazar / Ver tus clientes (paid) | 2 (abrir pestaña → Ver más) | Same shape as the row above — a one-line teaser plus one tap into the full view. Both rows are always tappable for any paid merchant — "Rendimiento por bazar" regardless of Event history, "Tus clientes" regardless of how many Claims exist yet (`decision-log.md` D34/D40) — each simply lands on its own populated or empty-state view (§3.6, §4). |
| Ver qué eventos componen un renglón de "Rendimiento por bazar" | 3 (abrir pestaña → Ver más → tocar el renglón del lugar) | One tap deeper than reaching the summary itself (row above) — the same per-altitude cost §2 already establishes for Historial → Event detail, just entered from a different starting altitude. |
| Ver el evento específico detrás de ese renglón | 4 (abrir pestaña → Ver más → tocar el renglón → tocar la tarjeta del evento) | Same destination and cost as reaching Event detail from Historial directly (two rows above) — the venue filter adds exactly one tap, never more. |
| Ver el detalle de una clienta con seguimiento | 4 (abrir pestaña → Ver más [Tus clientes] → Ver más [Recompensas] → tocar la fila de la clienta) | One altitude deeper than "Tus clientes" itself, matching the same per-altitude cost §2/§6 already charge for "Rendimiento por bazar"'s own venue drill-down. |
| Confirmar que ya le diste su recompensa a una clienta | 6 (los 4 anteriores + tocar "Confirmar recompensa entregada" + tocar "Confirmar ahora") | A consequential write deliberately requires an explicit confirm step, reusing `settings.md`'s own two-tap commit shape for every comparable Business/Customer-state change — never a bare single tap for an action with a real, atomic, hard-to-undo effect. |

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
  toggle Ana touches.** Both "Rendimiento por bazar" and "Tus clientes" are
  gated by `subscriptionTier=paid` alone (`decision-log.md` D34, extended
  by D40 to Claim collection itself). Whether either section specifically
  shows data or its own empty state (§3.9 vs. §3.10; §3.12 vs. §3.13) is a
  separate, data-based read, resolved automatically from whatever
  Claims/Sessions actually exist — there is no merchant-facing toggle
  anywhere in this capability anymore, for visibility or for collection.
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
- `SaleItem.pricePaid` resolution — fully automatic at Sale-write time in
  Selling (`decision-log.md` D33); Resultados only ever sums an
  already-resolved value, never resolves or re-prices anything itself.
- **Recompensas' populated/empty branching is a pure derivation of the
  same "any Claim recorded?" read "Tus clientes" already resolves — never
  a second, independently-tracked flag.**
- **Readiness ("Con recompensa lista") is a pure comparison,
  `currentCycleProgress >= Business.loyaltyRewardThreshold`, computed
  once, never asked of Ana.**
- **The reward-cycle reset itself (`currentCycleProgress → 0`,
  `completedCyclesCount += 1`) is the one thing in this whole capability
  that stays deliberately manual** — RFC 0005's own "it cannot be
  automatic" finding: Ana might reach a threshold without the physical
  reward on hand yet, so the reset must wait for her deliberate
  confirmation, not fire the instant the counter crosses the line.

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
   **Further corrected by `decision-log.md` D34 (2026-08-08):** the
   joint-gate clause above (`subscriptionTier=paid` **and**
   `loyaltyEnabled=true`) is itself corrected — Customer Segmentation now
   gates on `subscriptionTier=paid` alone, matching "Rendimiento por
   bazar"'s own gate. `loyaltyEnabled` is kept, narrowed back to its
   original scope (whether Claims are actively collected), never a
   visibility precondition. §3.6's former passive `loyaltyEnabled=false`
   note and §3.13's zero-Claims empty state collapse into the single §3.13
   state — see §2 step 4, §3.6, §3.12, §3.13 for the corrected design.
   **Further corrected by `decision-log.md` D40 (2026-08-09):**
   `loyaltyEnabled` itself is retired, not merely narrowed — there is no
   Business-level capability left governing whether Claims are collected.
   Frequent Customers as a whole (Claim collection and Loyalty
   Participation Record visibility alike) is entitled purely by
   `subscriptionTier`. §2, §3.4/§3.5/§3.6/§3.12/§3.13, §4, §5, §6, §7, and
   §9 corrected to remove every remaining reference to `loyaltyEnabled` as
   a live merchant decision or a `product/02-ux/settings.md` destination —
   that action ("Activar/Desactivar clientes frecuentes") no longer exists
   there either.

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

9. **[New, escalated — Architect-resolvable] Does `Customer.purchaseCount`
   (D35) increment once per Sale, or once per SaleItem/Claim?** D22's own
   established mechanism generates "one Claim per SaleItem in that Sale"
   for the Sale-level Claim Token — if a customer buys 3 different items
   in one Sale, does that count as 1 purchase or 3 toward her reward
   cycle? This materially affects when she actually reaches a reward, not
   just a cosmetic label — §3.16's "Compras totales" copy is deliberately
   worded to avoid asserting either answer, but the underlying counting
   unit is a real Foundation gap, not a UX choice, and looks directly
   resolvable from existing Foundation text (D22's Claim-per-SaleItem
   mechanism) without needing a Product Owner call. Named here rather
   than resolved by inventing an answer.

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
  (§3.3). "Tus clientes"'s own zero-Claims empty state (§3.13) shows no
  invented "Activar" control either, for the same reason, and no longer
  special-cases any reason for zero Claims as a distinct condition
  (`decision-log.md` D34/D40 — there is no merchant-facing toggle left to
  special-case).
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
  "Session," "SaleItem," "eventId," "Venue," "Customer," or "Claim,"
  anywhere on screen.
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
  segmentation logic. Every dollar figure in this tab is a sum of
  `SaleItem.pricePaid`, resolved once at Sale-write time by Selling, never
  re-derived or re-priced here (`decision-log.md` D33).
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
  both "Rendimiento por bazar" and "Tus clientes" identically, as whole
  sections (§3.9/§3.10; §3.6/§3.12/§3.13, `decision-log.md` D34, correcting
  D22's original joint-gate wording) — decided once at the Business level,
  never a per-screen or per-visit question, and `registrationMode` never
  enters either gate (it only selects which Claim mechanism a Sale uses,
  `domain-model.md`'s "Multi-mechanism Claim resolution"). There is no
  `loyaltyEnabled` capability left to enter either gate — Claim collection
  now shares the identical `subscriptionTier=paid` gate as visibility
  (`decision-log.md` D40), unifying what D34 first corrected for
  visibility alone. Whether either
  section shows data or its own empty state is a separate, data-based axis
  — it doesn't contradict this principle, since each section is still
  always present (or absent) purely by `subscriptionTier`; only its
  content varies with what actually exists to show.
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
  with the same one-way rule. Reading `SaleItem.pricePaid` sits inside
  Intelligence's existing read-only dependency on Selling — no new edge.
  `Event.bazaarCost`, while a Selling-owned field this document *could*
  technically read, is deliberately never read here — a restraint
  exercised on purpose, not a gap.

**Loyalty Participation view (2026-08-08 amendment) — additional principle grounding:**
- *global-principles.md, "Never ask twice"* — `ageRange`/`gender`, once
  captured at first Claim, are never re-asked; a returning customer's
  scan matches the existing `(businessId, email)` record and increments
  its counters (D37's dedup invariant), never creating a duplicate Ana
  would have to reconcile.
- *global-principles.md, "Capture business truth once, reuse it
  forever"* — `lifetimeSpend`/`purchaseCount`/`currentCycleProgress`/
  `completedCyclesCount` are all written once, by Loyalty-claim, at the
  moment each Claim resolves (D35); this document only ever reads them,
  never recomputes them.
- *global-principles.md, "Business language before technical language"* —
  "Recompensas," "recompensa lista," "compras totales" throughout;
  "Customer," "Claim," `currentCycleProgress`, `loyaltyRewardThreshold`
  never appear on screen.
- *architecture-principles.md #1 (capabilities resolved once, upstream)*
  — Recompensas gates on `subscriptionTier=paid` alone, the identical
  whole-section gate as its two siblings, never a per-screen question.
- *architecture-principles.md #4* — Customer and Claim are never named as
  such anywhere in this amendment, same restraint the rest of this
  document already applies.
- *architecture-principles.md #6* — the new write (§3.17/§3.18) extends
  Intelligence's already-existing edge into Loyalty-claim, same direction
  as its two existing read grants, per RFC 0005's own explicit
  dependency-direction check — no back-edge, no new dependency for
  Selling.
- *architecture-principles.md #7 (idempotent/keyed retry)* — §3.18's
  retry, argued in full there.

## 10. Decisions made

- **Historial's Event-rollup cards and §3.11's filtered venue-detail cards
  show Event type alongside `Venue.displayName`**, the same subordinate role
  Type plays in `events.md`'s Event detail. **[see
  reports.changelog.md#decisions-historial-event-type-cards]**
- **Three new free-tier insight elements added to the main view
  (§3.4/§3.5/§3.6): ticket promedio, sales trend, and "Top productos · todo
  tu historial."** NFC adoption rate (Q13) stays open. **[see
  reports.changelog.md#decisions-three-free-tier-insight-elements]**
- **Two headline-level "paired fact" statements added, at the same visual
  priority as "Total histórico."** Never evaluative, gracefully omitted
  when there's no real data yet. **[see
  reports.changelog.md#decisions-headline-paired-fact-statements]**
- **"Rendimiento por bazar" (§3.9) rows carry a plain rank number (1., 2.,
  3.) instead of a magnitude-proportional bar** — Product Owner decision. **[see
  reports.changelog.md#decisions-rendimiento-rank-number]**
- **Historial merges closed Event-rollups and standalone closed Quick
  Sessions into one reverse-chronological list.** **[see
  reports.changelog.md#decisions-historial-merged-list]**
- **"En curso" makes already-closed Días of a still-active Event
  individually tappable**, deliberately differing from `events.md`
  §3.14/§3.15's passive treatment. **[see
  reports.changelog.md#decisions-en-curso-tappable-dias]**
- **No auto-"reviewed" marking mechanic designed** — would require
  Resultados to write into Session, breaking the read-only dependency
  direction. **[see
  reports.changelog.md#decisions-no-auto-reviewed-marking]**
- **Free tier includes per-Product counts at Session and Event
  granularity** — "counts," not "segmentation." **[see
  reports.changelog.md#decisions-free-tier-per-product-counts]**
- **"Rendimiento por bazar" (§3.9) is retrospective, own-data-only, ranking
  is a plain sort by magnitude** — avoids overlap with `company/backlog.md`
  #3's blocked bazaar-recommendation feature. **[see
  reports.changelog.md#decisions-rendimiento-retrospective-own-data]**
- **"Rendimiento por bazar" groups by `venueId`**, applying
  `product/99-rfc/0001-venue-entity.md` and `decision-log.md` D20 — the
  direct fix for former Q9. **[see
  reports.changelog.md#decisions-rendimiento-groups-by-venueid]**
- **"Rendimiento por bazar" rows are tappable**, drilling into a filtered
  Historial view (§3.11) and onward into Event detail (§3.8)/Session detail
  (§3.7). **[see
  reports.changelog.md#decisions-rendimiento-rows-tappable-drilldown]**
- **An explicit empty state (§3.10) covers a paid merchant with closed
  Sessions but zero Event-grouped Sessions (Quick-Session-only history).** **[see
  reports.changelog.md#decisions-empty-state-quick-session-only]**
- **"Tus clientes" (§3.6/§3.12) is a real, resolved spec**, applying RFC
  0002/D22 — the direct resolution of former Q8. Two new states cover the
  `loyaltyEnabled` dimension. **[see
  reports.changelog.md#decisions-tus-clientes-resolved-spec]**
- **`decision-log.md` D34 corrects the joint-gate clause** — "Tus clientes"
  now gates on `subscriptionTier=paid` alone; the two `loyaltyEnabled`
  states collapse into one. **[see
  reports.changelog.md#decisions-d34-joint-gate-corrected]**
- **The `loyaltyEnabled=false` state is retired** (D34), collapsed into the
  zero-Claims §3.13 state; D40 removes its Configuración pointer too. **[see
  reports.changelog.md#decisions-loyaltyenabled-false-state-retired]**
- **No paid-tier upgrade/purchase flow designed anywhere in this tab** —
  payments/checkout are an explicit non-goal; the actual actions live once
  in `settings.md`. **[see
  reports.changelog.md#decisions-no-paid-upgrade-flow]**
- **Cold start's CTA routes to Hoy**, reusing an existing tab. **[see
  reports.changelog.md#decisions-cold-start-cta-routes-hoy]**
- **This doc designs no Venue-management surface of its own** — that lives
  in `events.md` §3.7. **[see
  reports.changelog.md#decisions-no-venue-management-surface]**
- **All merchant-facing copy pointing at "Tus clientes" is worded as a
  count/category, never an identity claim** — corrected per `ux-critic`'s
  RPT2-MAJ1 finding. **[see
  reports.changelog.md#decisions-tus-clientes-copy-count-not-identity]**
- **Every dollar figure explicitly grounded as a sum of
  `SaleItem.pricePaid`** (D33); `bazaarCost` deliberately never netted here. **[see
  reports.changelog.md#decisions-d33-dollar-figures-grounded]**
- **Loyalty Participation view designed as new sections within
  `reports.md` (§3.15–§3.18)**, not a standalone document. **[see
  reports.changelog.md#decisions-loyalty-participation-view-placement]**
- **Full (not masked) email shown throughout** — masking would undercut the
  friction this capability exists to solve. **[see
  reports.changelog.md#decisions-full-email-shown]**
- **Recompensas list sorted by readiness first, then progress
  descending.** **[see
  reports.changelog.md#decisions-recompensas-sort-order]**
- **"Confirmar recompensa entregada" placed on the customer-detail screen,
  never on the compact list row.** **[see
  reports.changelog.md#decisions-confirmar-recompensa-placement]**
- **`Business.loyaltyRewardThreshold` assumed to always carry a value**
  (illustrative default) — D37 leaves this shape open. **[see
  reports.changelog.md#decisions-loyaltyrewardthreshold-default-assumed]**
- **No new partial-section load-failure pattern designed** — the existing
  whole-tab fallback (§3.14) already covers it; RPT-S2 stays open. **[see
  reports.changelog.md#decisions-no-partial-load-failure-pattern]**
- **"Confirmar recompensa entregada" (§3.16-§3.18) was designed against RFC
  0005's complete write contract — now Accepted, D39, no amendments.** **[see
  reports.changelog.md#decisions-confirmar-recompensa-rfc0005-accepted]**
- **§3.17's copy corrected to honestly disclose "Confirmar recompensa
  entregada" is not reversible**, closing a `ux-critic` gap. **[see
  reports.changelog.md#decisions-317-irreversibility-disclosure]**
- **`decision-log.md` D40 retires `loyaltyEnabled` outright** — every
  remaining reference to it as a live decision or `settings.md` pointer is
  corrected across §2-§9. **[see
  reports.changelog.md#decisions-d40-loyaltyenabled-retired-outright]**

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
- A profitability/margin view netting `Event.bazaarCost` against Sale
  revenue — **named here explicitly as a future idea, not designed now**
  — would require moving `bazaarCost` out of `decision-log.md` D33's
  deliberate "captured-but-not-computed" state, a Product Owner call this
  document doesn't make.
- **Settings-side `Business.loyaltyRewardThreshold` configuration UI** —
  not designed anywhere in this document; D37 names it as open, this
  amendment only consumes whatever value currently exists (defaulting
  illustratively). A future `settings.md` amendment, likely following its
  own established self-service-editable, immediate-effect pattern (D37's
  own comparison to `defaultSellingMode`).
- **Whether "frecuente"/"ocasional" (Derived Customer Intelligence) and
  reward-cycle readiness (Loyalty Participation Record) should ever be
  shown together or cross-filtered** — deliberately not designed; no
  Foundation-stated relationship between the two independently-computed
  signals exists today, and inventing one here would overstate what's
  actually known.
- **Finer-grained partial-section load failure**
  (`ux-critic-findings.md` RPT-S2) — still open, doc-set-wide, not
  resolved by this amendment; named explicitly rather than silently left
  implicit.
- **`Customer.purchaseCount`'s exact counting unit** (§8, item 9) — once
  resolved by Architect, may change what number literally renders in
  §3.16, with no structural change to the screen itself.
