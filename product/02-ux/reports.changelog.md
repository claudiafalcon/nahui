# Resultados (reports.md) — Amendment & Decision History

Companion file to `product/02-ux/reports.md`, per the same knowledge-architecture
convention already applied to `authentication.md`/`home.md`: current-rule text
stays inline in `reports.md`; justification, prior-state, and remediation-history
prose moves here, dated and anchored, with a one-line pointer left inline.

Anchors are prefixed `status-` (from the front-matter status header) or
`decisions-` (from §10).

---

## Status-header history

### status-full-ux-remediation
Full UX Remediation cycle complete — RPT-M1, RPT-M2, RPT-M3 fixed by
`ux-designer`, verified clean by `ux-critic` (zero remaining Blockers/Majors),
and passed `reviewer`'s Foundation-consistency check (no Blockers; one
cross-document Important finding — stale post-renumbering section references —
corrected by Main). See `product/02-ux/ux-critic-findings.md` for the full
finding record.

### status-d20-venue-aggregate
**Updated to apply the Venue aggregate root** (`product/99-rfc/0001-venue-entity.md`,
Accepted; `decision-log.md` D20): "Rendimiento por bazar" (§3.9/§3.11) now
groups by `venueId`, a real independent identity, instead of exact-string
matching on Event's former freeform `Nombre` — this is the direct,
by-construction resolution of what was previously logged as Q9. See §10 for
the full change record. This update also renumbers `events.md`'s own §3.x
screen states from its old §3.7 onward by one (a new Venue picker was inserted
there) — every cross-reference to `events.md` in this document has been
updated to match.

### status-d22-customer-segmentation
**Updated to apply the resolved Customer Segmentation capability**
(`product/99-rfc/0002-loyalty-claim-complete-capability.md`, Accepted;
`decision-log.md` D22): "Tus clientes" (§3.6/§3.12/§3.13) is no longer an
illustrative placeholder — this is the direct resolution of what was
previously logged as Q8 (`company/business-decisions.md`, Resolved). Customer
Segmentation is gated by `subscriptionTier=paid` **and** `loyaltyEnabled=true`
together, never `subscriptionTier` alone — corrected by D34 later;
`registrationMode` only ever selects *which* Claim mechanism a Sale uses (the
existing NFC tag scan, or the new Sale-level Claim Token/QR), never *whether*
segmentation exists. The Merchant Application still never sees raw Customer
or Claim data — it consumes only **Derived Customer Intelligence**, an
anonymized, aggregate signal the future Loyalty-claim context computes and
exposes read-only to Intelligence (`domain-model.md`, `ubiquitous-language.md`).
This update designs the state this doc never needed before — a paid merchant
with `loyaltyEnabled=false` (§3.6) — plus the empty state for a paid,
loyalty-active merchant with zero Claims recorded yet (§3.13, new). The
documentation-only `*` illustrative marker is retired throughout — every row
shown in this doc is now a real, specified feature, even though Loyalty-claim
and Intelligence themselves remain future, not-yet-built bounded contexts per
`domain-model.md`'s own table (this doc specs the target UI ahead of
implementation, the same posture already established for every other screen
here, and for Venue before its own aggregate root existed). See §8 item 1
(rewritten) and §10 for the full change record; §4/§5 updated to add §3.13,
one new read-only state (renumbering the former §3.13 "Defensive fallback" to
§3.14).

### status-2026-08-04-consolidated-pass
**Amended 2026-08-04 (consolidated pass — Event type legibility, three new
free-tier insight elements, and a headline synthesis fix).** Three prior
analyses applied together for coherence: (1) Historial's Event-rollup cards
and §3.11's filtered venue-detail cards now carry Event type alongside
`Venue.displayName` — the same closed, frozen 6-item enum already shown in
`events.md`'s Event detail (`decision-log.md` D16), no new data. (2) Three new
free-tier insight elements — ticket promedio, sales trend, and top products
all-time — all confirmed computable now with no new fields
(`product/02-ux/product-decisions.md` Q13's own architect finding already
treats these three as "a direct variant of an already-Approved section,"
distinct from NFC adoption rate, which stays open). (3) `ux-critic`'s
synthesis-gap finding: items (1)-(2) combined were still separate facts Ana
had to connect herself, not insight — this pass adds one or two headline-level
"paired fact" statements at the same visual priority as "Total histórico,"
each pairing two values this doc already computes independently into one
retrospective, descriptive sentence about her own history. (4) "Rendimiento
por bazar" (§3.9) rows now carry a plain rank number (1., 2., 3.) instead of a
magnitude bar — Product Owner call, the bar was judged too close to implying a
recommendation. Every addition below stays inside `company/backlog.md` #3's
guardrail (plain magnitude/own-data only, never recommendation-flavored copy)
— no "deberías" language, no cross-vendor data, no forward-looking suggestion
of any kind, same posture §3.9 already established. See §10 for the full
decision record.

### status-2026-08-08-d33-mvp-pricing
**Amended 2026-08-08 (`decision-log.md` D33, MVP pricing operating model):**
every dollar figure in this tab is now explicitly grounded as a sum of
`SaleItem.pricePaid`, resolved once at Sale-write time by Selling — resolves
the exact ambient-assumption gap D33's Context names. `bazaarCost` explicitly
never read or netted against any figure here — captured elsewhere,
deliberately unused in this MVP. Part of the same four-document D33
remediation as `inventory.md`/`events.md`/`home.md`; `ux-critic` verified this
document's portion clean in round 1, with no findings against it in either
round. `reviewer` clean (no Blockers, no Important findings) — folded back
into Approved.

### status-2026-08-08-d34-segmentation-gate-corrected
**Further amended 2026-08-08 (`decision-log.md` D34 — Customer Segmentation
visibility gate corrected):** D22's joint gate — `subscriptionTier=paid` **and**
`loyaltyEnabled=true` together — is corrected. "Tus clientes" now gates on
`subscriptionTier=paid` alone, the same pattern already used for "Rendimiento
por bazar." `loyaltyEnabled` is kept, narrowed back to its original scope —
whether Loyalty-claim actively collects Claims at all — never a precondition
for seeing this section. The two previously-separate `loyaltyEnabled`-dependent
states this doc designed (§3.6's non-tappable "not yet activated" note, and
§3.13's zero-Claims empty state) collapse into one: any paid merchant with
zero Claims recorded yet — whether because `loyaltyEnabled` was never turned
on, is currently off, or is on with nothing collected yet — sees the same
naturally-empty, tappable state (§3.13), with no special-casing by reason. §1,
§2, §3.4/§3.5/§3.6/§3.12/§3.13, §4, §5, §6, §7, §8 item 1, §9, and §10 updated
accordingly.

### status-2026-08-08-loyalty-participation-view
**Amended 2026-08-08 (`decision-log.md` D34/D35/D37; `product/99-rfc/0004-customer-loyalty-participation-record.md`,
Accepted) — Loyalty Participation view added.** New §3.15–§3.18, plus
additive appends to §3.12/§3.13 (their existing content unchanged), give Ana a
per-customer view of loyalty progress — email, age range, gender, purchase
count, lifetime spend, reward-cycle progress, completed-cycles count — reading
D35's Loyalty Participation Record allowlist exactly, structurally never
anything beyond it. Gated identically to "Tus clientes" itself:
`subscriptionTier=paid` alone (D34), independent of `loyaltyEnabled`. **The
"Confirmar recompensa entregada" write action (§3.17/§3.18) was designed fully
against `product/99-rfc/0005-reward-cycle-confirmation-write-edge.md`'s
complete write contract while that RFC was still Proposed — now Accepted and
promoted to `decision-log.md` D39.** `ux-critic` round 1: 1 Major (the
confirm-screen reused a reversible-action template without disclosing this
action's irreversibility) found alongside the sibling
`customer-loyalty-registration.md` review — fixed (§3.17's copy discloses
plainly, RFC 0005 amended with a `lastRewardConfirmedAt` trace field, no
reversal mechanism added by design — the Product Owner's own D39 decision
explicitly accepts the residual risk and defers any correction mechanism
until real evidence warrants one). `reviewer`'s Foundation-consistency pass
clean. Folded back into Approved — no longer speculative. See §10 for the full
decision record.

### status-2026-08-09-d40-loyalty-enabled-retired
**Further amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled`
retired):** every remaining reference in this document that framed
`loyaltyEnabled` as a live, independent merchant decision, or pointed to
"Configuración → Activar clientes frecuentes" as a destination, is corrected —
that action no longer exists (`settings.md`, amended in the same pass). "Tus
clientes"'s own visibility gate is unaffected (it already gated on
`subscriptionTier=paid` alone, D34), but its zero-Claims empty state (§3.13)
no longer frames "zero Claims" as tied to a toggle — under D40, collection
shares the identical gate as visibility, so a zero-Claims Paid-tier Business
simply hasn't had a customer complete one yet. §1/§8's preamble, §2,
§3.4/§3.5/§3.6, §3.12/§3.13, §4, §5, §6, §7, §8 item 1, §9, and §10 corrected.
§3.15–§3.18 (the Loyalty Participation view) verified clean — built after D34,
no stale references found.

---

## §10 "Decisions made" — full decision history

### decisions-historial-event-type-cards
**Historial's Event-rollup cards and §3.11's filtered venue-detail cards now
show Event type alongside `Venue.displayName`**, the same subordinate role
Type already plays in `events.md`'s Event detail. Safe to add with zero
ambiguity — `Event.type` is a closed, frozen 6-item enum (`decision-log.md`
D16), the same vocabulary already shown elsewhere in the app, no new copy
decision. Most useful in §3.11, where every card already repeats the same
Venue name and Type is the one differentiator a card there can add.

### decisions-three-free-tier-insight-elements
**Three new free-tier insight elements added to the main view
(§3.4/§3.5/§3.6): ticket promedio (inline on the "Total histórico" line),
sales trend (folded into a headline statement, never shown as raw
side-by-side numbers), and "Top productos · todo tu historial" (a new
section, reusing §3.7/§3.8's existing per-Product aggregation, re-scoped to
all-time).** All three confirmed computable now with no new fields
(`architect` finding, `product/02-ux/product-decisions.md` Q13) and
classified free-tier — the same "counts" classification this doc's own
established precedent already gives per-Product breakdowns. Placed above any
paid-tier content in §3.6, since none of the three depend on
`subscriptionTier`. NFC adoption rate (Q13) is unaffected and stays open — it
has no precedent in this doc and a genuine tier-placement ambiguity the other
three don't share.

### decisions-headline-paired-fact-statements
**Two headline-level "paired fact" statements added, rendered at the same
visual priority as "Total histórico," directly resolving `ux-critic`'s
synthesis-gap finding** that the improvements above, even combined, were
still separate facts Ana had to connect herself. Each statement pairs two
values this doc already computes independently (a product's identity + its
own count; this week vs. last week, stated as direction/magnitude) into one
retrospective, descriptive sentence — never evaluative, never a suggestion of
what to do next, same guardrail as §3.9's existing plain-sort precedent
(`company/backlog.md` #3). Gracefully omitted, never fabricated, when the
underlying comparison has no real data yet (§9's "no fabricated venue data"
principle, extended here to prose).

### decisions-rendimiento-rank-number
**"Rendimiento por bazar" (§3.9) rows now carry a plain rank number (1., 2.,
3.) instead of a magnitude-proportional bar.** Product Owner decision — a bar
was judged too close to implying a recommendation, the exact risk this
section already exists to avoid. Primarily a visual-treatment call, but
changes what the row displays, so it's recorded here even though its full
resolution belongs to Medium-Fidelity.

### decisions-historial-merged-list
**Historial merges closed Event-rollups and standalone closed Quick Sessions
into one reverse-chronological list.** A genuinely new pattern relative to
Eventos (which only ever lists Events) — necessary because Journey 5
explicitly covers "past Sessions/Events" together, and a Quick Session's
history would otherwise have no home anywhere in the app.

### decisions-en-curso-tappable-dias
**"En curso" makes already-closed Días of a still-active Event individually
tappable**, deliberately differing from `events.md` §3.14/§3.15's passive
treatment of the same rows — Resultados is where "reviewing a closed day's
detail" was always meant to live per Q7's resolution, and she shouldn't have
to wait for a multi-day Event to fully close before checking Día 1.

### decisions-no-auto-reviewed-marking
**No auto-"reviewed" marking mechanic designed** (see §8 item 3) — would
require Resultados to write into Session, breaking the frozen
Intelligence-is-read-only dependency direction. Left as an open question
rather than quietly implemented.

### decisions-free-tier-per-product-counts
**Free tier includes per-Product counts at Session and Event granularity**
(§3.7/§3.8) — read as "counts," not "segmentation," per `domain-model.md`'s
own capability-table wording; segmentation is reserved for the two paid-tier
views that break down by venue or by customer pattern.

### decisions-rendimiento-retrospective-own-data
**"Rendimiento por bazar" (§3.9) is retrospective, own-data-only, and ranking
is a plain sort by magnitude** — deliberately built to avoid any overlap with
`company/backlog.md` #3's blocked bazaar-recommendation feature; flagged
prominently in §8/§10 rather than silently included or silently omitted,
since the task explicitly asked for something grounded in that friction.

### decisions-rendimiento-groups-by-venueid
**"Rendimiento por bazar" now groups by `venueId`, not exact-name match on
Event's former freeform `Nombre` — applies `product/99-rfc/0001-venue-entity.md`
(Accepted) and `decision-log.md` D20.** This is the direct fix for what was
previously logged as Q9 (`product/02-ux/product-decisions.md`): each row in
§3.9 now represents one real Venue, an independent aggregate root, not one
distinct string that happened to match exactly. No structural change to any
screen in this doc — same card shapes, same drill-down, same three-altitude
model (§2) — only the underlying grouping key and identity source changed,
exactly as this doc's own Future Considerations previously anticipated it
would if a Venue entity were ever introduced (that anticipatory note is now
removed from §11, since it's applied, not future).

### decisions-rendimiento-rows-tappable-drilldown
**"Rendimiento por bazar" rows are tappable, drilling into a filtered
Historial view (§3.11) and onward into the same Event detail (§3.8)/Session
detail (§3.7) screens the rest of this tab already uses** — restores the
three-altitude drill-down model (§2) this section previously broke. No new
screen type was invented: the filtered view reuses Historial's existing
Event-rollup card shape and the exact same `venueId` grouping key §3.9's own
aggregate uses, so what she sees filtered is exactly what was summed.

### decisions-empty-state-quick-session-only
**An explicit empty state (§3.10) now covers a paid merchant with closed
Sessions but zero Event-grouped Sessions (Quick-Session-only history)** — a
real, reachable case per `company/CLAUDE.md`'s "own sales history" (not Event
history) eligibility rule. Copy is plain and factual, same brand posture as
`events.md` §3.17, and never implies Quick-Session-only selling is a lesser
or incomplete way to use the app. "Tus clientes" (§3.6/§3.12/§3.13) is
unaffected by this same condition, since its gating and data source don't
depend on Event/Venue data at all.

### decisions-tus-clientes-resolved-spec
**"Tus clientes" (§3.6/§3.12) is now a real, resolved spec — applies
`product/99-rfc/0002-loyalty-claim-complete-capability.md` (Accepted) and
`decision-log.md` D22.** This is the direct resolution of what was previously
logged as Q8 (`company/business-decisions.md`): Customer Segmentation is a
core capability gated by `subscriptionTier=paid` **and** `loyaltyEnabled=true`
— not `subscriptionTier` alone — consuming only Derived Customer
Intelligence, never raw Customer/Claim data. The documentation-only `*`
illustrative marker previously carried on this row (§3.6/§3.12/§4) is retired
throughout the doc; every row shown in this document is now a real, specified
feature, styled identically to "Rendimiento por bazar." Two new states were
designed to cover the `loyaltyEnabled` dimension this doc never needed before:
a passive, non-tappable note for `loyaltyEnabled=false` (§3.6 — a real,
reachable state, since `registrationMode` and `loyaltyEnabled` are
independent Business capabilities) and an empty state for `loyaltyEnabled=true`
with zero Claims recorded yet (§3.13, new screen). What remains genuinely open
— narrower than before — is only the specific segmentation
algorithm/thresholds; tracked in §11, not as an open question here, since
`company/CLAUDE.md` already scopes that out explicitly rather than treating it
as awaiting a decision-owner's call.

### decisions-d34-joint-gate-corrected
**`decision-log.md` D34 corrects the joint-gate clause the Q8 resolution
above introduced.** "Tus clientes" now gates on `subscriptionTier=paid` alone
— the identical gate "Rendimiento por bazar" already used, per
`architecture-principles.md` #1. `loyaltyEnabled` is kept, narrowed back to
its original, correct scope (whether Loyalty-claim actively collects Claims
at all), never a second activation switch Ana must flip before Resultados
will show her whatever segmentation data already exists. The two states this
doc previously designed for the `loyaltyEnabled` dimension — §3.6's passive,
non-tappable `loyaltyEnabled=false` note, and §3.13's zero-Claims-yet empty
state — collapse into one: any paid merchant with zero Claims recorded, for
any reason, sees the same tappable, naturally-empty §3.13 state, with no
special-casing of *why* it's empty. §1, §2, §3.4/§3.5/§3.6/§3.12/§3.13, §4,
§5, §6, §7, §8 item 1, and §9 updated to match.

### decisions-loyaltyenabled-false-state-retired
**The `loyaltyEnabled=false` state (formerly its own non-tappable note in
§3.6, pointing to Configuración) is retired** (`decision-log.md` D34). It
collapses into the same tappable, naturally-empty §3.13 state used for "zero
Claims recorded yet" — no distinct rendering, no branching on which of the
three underlying reasons applies, since `loyaltyEnabled` is no longer a
visibility precondition for this section at all. **`decision-log.md` D40 goes
one step further and removes that pointer too** — there is no longer any
"Activar clientes frecuentes" action in `product/02-ux/settings.md` for it to
point to; `loyaltyEnabled` is retired outright, not merely narrowed. §3.13 now
states plainly that zero Claims means no customer has completed one yet, with
no reference to Configuración anywhere on the screen.

### decisions-no-paid-upgrade-flow
**No paid-tier upgrade/purchase flow designed anywhere in this tab.** The
free-tier informational note (§3.4/§3.5) stays passive text, not a tappable
CTA — payments/checkout are an explicit `company/CLAUDE.md` non-goal.
`subscriptionTier` is now confirmed self-service-editable in both directions
(Q5, `company/business-decisions.md`, Resolved; `decision-log.md` D25), but
the actual "Activar plan de pago"/"Volver al plan gratis" actions are
designed once, in `product/02-ux/settings.md` (§3.4/§3.5), never duplicated
here — this doc's free-tier note tells her what paid unlocks, not how to get
it.

### decisions-cold-start-cta-routes-hoy
**Cold start's CTA routes to Hoy**, reusing an existing tab rather than
inventing a new destination — same pattern the other three docs already
established for their own cold starts.

### decisions-no-venue-management-surface
**This doc designs no Venue-management surface of its own** — Resultados
only ever reads `venueId` as a grouping key; creating, selecting, renaming, or
deactivating a Venue happens entirely in `events.md` §3.7, per
`product/99-rfc/0001-venue-entity.md`'s own scope note that Venue is not a
full location-management module.

### decisions-tus-clientes-copy-count-not-identity
**All merchant-facing copy that points at "Tus clientes" (§3.4/§3.5's
free-tier note, §3.6's zero-Claims teaser, §3.13's empty state) is worded as
a count/category ("cuántas son tus clientas frecuentes y cuántas
ocasionales"), never as an identity claim ("quiénes son tus clientas").**
Corrected per `ux-critic`'s RPT2-MAJ1 finding (`ux-critic-findings.md`): the
architecture (§3.12, `product/99-rfc/0002-loyalty-claim-complete-capability.md`,
D22) only ever exposes an anonymized aggregate signal — two counts — never a
name or any way to identify which specific customer is which. Copy promising
she'll see "who" her frequent/occasional customers are would set up a real,
foreseeable expectation break given `company/CLAUDE.md`'s own framing of
Ana's validated friction as "I can't tell who my repeat customers are" — the
fix keeps every teaser's promise scoped to exactly what §3.12 delivers.
(§3.6's own note previously distinguished a `loyaltyEnabled=false` case here;
`decision-log.md` D34 collapses that into the same zero-Claims teaser,
unaffected by this count/category wording rule either way.)

### decisions-d33-dollar-figures-grounded
**Every dollar figure in this tab explicitly grounded as a sum of
`SaleItem.pricePaid` — applies `decision-log.md` D33.** Resolves the exact
ambient-assumption D33's own Context names ("Hoy: $850... $14,230... $296
ticket promedio," rendered with no traceable source before D33). No screen,
state, computation, or gate changed — this is a citation/grounding pass.
**Deliberately does not add any profitability/margin figure netting
`Event.bazaarCost` against revenue anywhere in this document** — out of scope
by explicit Product Owner instruction and by D33 itself.

### decisions-loyalty-participation-view-placement
**Loyalty Participation view designed as new sections within `reports.md`
(§3.15–§3.18), plus additive appends to §3.12/§3.13, rather than a standalone
document.** Grounded directly in RFC 0004's own "adds content within
[Resultados]" framing and this doc's own §3.9→§3.11 precedent (a summary
teaser → populated list → per-entity detail).

### decisions-full-email-shown
**Full (not masked) email shown throughout.** D35 leaves this choice to
`ux-designer`; chosen because masking would undercut the very friction this
capability exists to solve (`company/CLAUDE.md`'s "can't tell who my repeat
customers are").

### decisions-recompensas-sort-order
**Recompensas list sorted by readiness first, then progress descending** —
the ordering that most directly serves this screen's purpose (spotting who's
ready for a reward today), not a "Rendimiento por bazar"-style neutral
magnitude sort.

### decisions-confirmar-recompensa-placement
**"Confirmar recompensa entregada" placed on the customer-detail screen,
never on the compact list row** — consistent with this app family's existing
restraint of never placing a consequential write on a scannable list row.

### decisions-loyaltyrewardthreshold-default-assumed
**`Business.loyaltyRewardThreshold` assumed to always carry a value
(illustrative default) rather than designing a "no threshold set" state** —
D37 explicitly leaves this shape open to `ux-designer`; this choice keeps
this document self-contained and defers the actual Settings-side
configuration surface entirely (§11).

### decisions-no-partial-load-failure-pattern
**No new partial-section load-failure pattern designed** — Recompensas data
is deliberately architected to load as part of the same initial Resultados
resolve as everything else, so the existing whole-tab fallback (§3.14)
already covers it. `ux-critic-findings.md` RPT-S2 stays open for a future,
more granular pass; not resolved here.

### decisions-confirmar-recompensa-rfc0005-accepted
**The "Confirmar recompensa entregada" action (§3.16's button, §3.17, §3.18)
was designed against RFC 0005's complete write contract while that RFC was
Proposed — now Accepted, `decision-log.md` D39, no amendments.** The Product
Owner's own D39 decision explicitly accepts the residual risk of an
MVP-stage merchant mis-tap and defers any correction mechanism until real
evidence warrants one. This entire amendment, including this action, is now
fully Approved.

### decisions-317-irreversibility-disclosure
**§3.17's copy corrected to honestly disclose that "Confirmar recompensa
entregada" is not reversible, closing a gap `ux-critic` found in this
screen's reuse of `settings.md` §3.4's confirm-screen template.** Every one
of `settings.md`'s five instances of that template is a self-service,
bidirectional Business Capability toggle (D25) whose copy reassures Ana
nothing lasting is lost; this action isn't one of those — RFC 0005 explicitly
excludes any reversal, undo, or edit of a completed confirmation, since the
physical reward has already left Ana's hands by the time she taps it. The fix
adds one plain sentence stating that fact before she commits, in the same
disclosure register `onboarding.md` §3.4c already established ("no vas a
poder convertirlo en tu negocio real después") — not a new tonal pattern for
this document family, and not a reason to invent a correction mechanism RFC
0005 deliberately doesn't have.

### decisions-d40-loyaltyenabled-retired-outright
**`decision-log.md` D40 retires `loyaltyEnabled` outright.** Every remaining
reference in this document to it as a live, independent merchant decision, or
as pointing to a `settings.md` action, is corrected: §2's branching logic,
§3.4/§3.5/§3.6's wireframe commentary, §3.12/§3.13's gating language, and
§3.13's own empty-state copy (no longer names or points to Configuración at
all). "Tus clientes"'s own visibility gate is unaffected — it already read
`subscriptionTier=paid` alone since D34. What changes is that Claim
*collection* now shares that identical gate too, so a zero-Claims state has
exactly one honest explanation left: no customer has completed one yet.
