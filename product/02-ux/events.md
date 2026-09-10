# Eventos — UX Specification

Status: Approved. Full UX Remediation cycle complete — EVT-M1, EVT-M2,
EVT-M3. **[Amended 2026-08-14 — see
events.changelog.md#status-full-ux-remediation-cycle]**

**Updated to apply the Venue aggregate root** (`product/99-rfc/0001-venue-entity.md`,
Accepted; `decision-log.md` D20): Event's freeform `Nombre` and optional
`Lugar` fields are retired entirely, replaced by a required Venue picker
(§3.7) — every screen that used to show `Event.Nombre` now shows
`Venue.displayName` in the same slot. **[Amended 2026-08-14 — see
events.changelog.md#status-d20-venue-aggregate-root]**

**Amended (UX fix, no Foundation change):** §3.6's Empieza field now defaults
to hoy (today's date) instead of opening blank. Termina's existing
auto-fill-from-Empieza behavior is unchanged and simply inherits the new
default. Guardar evento's required-field gate narrows to Lugar + Tipo.
**[Amended 2026-08-14 — see
events.changelog.md#status-evt-q1-empieza-hoy-default]**

**Further amended 2026-09-06 (`decision-log.md` D53 — D17 superseded, simultaneous multi-Event operation now supported):** the entire D17 overlap-validation mechanism (inline warning, disabled Guardar evento) is removed outright — D53 retired the single-active-Event rule it existed to enforce. Guardar evento's gate reverts to Lugar + Tipo alone, unconditionally. **[see events.changelog.md#status-2026-09-06-d53-overlap-validation-retired]**

**Further amended 2026-09-06 (`product-decisions.md` Q24/Q25 — Event-scoped inventory allocation, settled architecture, RFCs not yet authored):** new §3.21–§3.25 design the full allocation lifecycle — initial allocation, replenish, reallocate between simultaneous Events, and explicit reconciliation at Event close — reachable via a new "Llevar mercancía" action on scheduled-Event detail (§3.11) and "Ver mercancía de este evento" on active-Event detail (§3.14/§3.15), both landing on the identical shared screen (§3.21), unlike "Ajustar precios" which stays strictly `scheduled`-only (see §3.21's own annotation for why this is a deliberate divergence, not an inconsistency). Gated OWNER-only per `product-decisions.md` Q24/Q25's settled permission table — the SELLER-role experience of these screens is not designed in this pass (§8). Grounded entirely in Q24/Q25's settled design (`EventAllocation`/`AllocationMovement`, the physical-location-exclusivity invariant, the single-local-transaction reallocation mechanism) — the two RFCs formalizing this into `domain-model.md` are not yet authored; this UX design does not wait on that authorship. **Further amended 2026-09-07 (`ux-critic` finding):** §3.21's own claim of matching Registrar Mercancía's "multi-line-entry-then-single-commit shape" was checked against `inventory.md` §3.6/§3.7 directly and found inaccurate — that shape is a sequential-add mechanic Registrar Mercancía uses, not what §3.21 actually rendered (every row expanded simultaneously, no collapse). Corrected: §3.21 now genuinely adopts a collapse-to-summary/one-row-expanded-at-a-time shape, adapted (not copied verbatim, and stated honestly as such) from Registrar Mercancía's row-collapsing precedent. **Further amended 2026-09-07 (`ux-critic` round 2, remediation verification):** 7 of 8 round-1 fixes confirmed clean; one new regression found and fixed — §6's task-efficiency table undercounted four rows by one tap each, a direct side effect of the §3.21 collapse redesign not carried through to its own step-count table. A third, narrow verification pass then found one of those four corrected rows ("Mover mercancía a otro Evento simultáneo") still undercounted by one further tap (missing its own entry-point tap); corrected 5→6 and confirmed via direct arithmetic re-check. **`reviewer` (2026-09-07) found 0 Blockers against this document specifically; its 3 Important findings were documentation-persistence gaps elsewhere (`decision-log.md` D55, `product-decisions.md`'s own stale status paragraph, a `business-decisions.md` numbering collision) — all closed directly by Main.** Folded back into Approved.

**Further amended 2026-09-09 (`product/99-rfc/0010-event-scoped-inventory-allocation-commitment-lifecycle-correction.md`, Proposed but Product-Owner-confirmed as design-settled — corrects RFC 0009's manual/quantity-mode commitment mechanism, and by extension this document's own §3.16 reconciliation UX):** §3.16's persistent reconciliation section now designs a genuinely new, deliberately lightweight manual-mode reconciliation action — one-tap "sí, regresaron las N" as the happy path, a secondary "Ajustar cantidad" affordance revealing a stepper for a lower confirmed number, and an honest "ya revisaste esto" framing on any later visit to a row with an outstanding shortfall — sitting alongside NFC's existing, entirely unchanged two-button mechanism. Manual and NFC evidence can now compose on the same closed-Event Product row (mirroring §3.21's own already-established "sin tag · con tag" composability at allocation time), so a single row may show one or both action shapes. §3.16's trigger-condition prose is corrected to RFC 0010's stated invariant ("1+ unit still `reserved` in `allocatedUnitIds`, either mode, for a `status = open` `EventAllocation`") — also fixing a pre-existing "available" vs. "reserved" wording inconsistency RFC 0010's own Open Items flagged in the prior text. "Mover a otro evento" (§3.24's existing closed-source variant, unchanged copy) is now also offered for manual rows, moving the full current live-expected quantity — decided here per RFC 0010's Open Item 4, routed explicitly to `ux-designer`. No schema change designed or assumed beyond what RFC 0010 itself specifies (`quantityExpected`, `unitSource` — both Architect/Product-Owner sign-off items, not resolved here). §4/§5/§6/§7/§9/§10 updated to match. `ux-critic` found 1 Major + 2 Minor: a mixed row's two "Mover a otro evento" buttons were identical and ungrouped despite moving genuinely different stock (fixed — blank-line grouping matching §3.21's own precedent, plus a mode qualifier on each button); an undefined branch for tapping "Mover a otro evento" mid-stepper-reveal (fixed — silently discards the staged value, matching §3.21's own precedent); the ambient checkmark on a confirmed-shortfall/zero outcome diverged from §3.13's own no-checkmark precedent for neutral/negative outcomes (fixed — checkmark dropped on any confirm below N). All three fixed in this same pass and confirmed closed by `ux-critic` re-verification, no regressions. `reviewer` (2026-09-09) found 0 Blockers/content defects against this amendment; 5 Important documentation-persistence findings (this section's own missing `ux-critic-findings.md` entry, `product-decisions.md`'s stale description of the corrected counter mechanism, `product/99-rfc/README.md`'s stale RFC 0010 summary, `company/bitacora.md`'s same-day entry describing the pre-rework design, and a forward-tracking gap for `home.md` §3.8a-d/§3.9 — now RFC 0010's own Open Item 7) — all closed directly by Main. Folded back into Approved. **[see events.changelog.md#status-2026-09-09-rfc0010-manual-reconciliation]**

**Further amended 2026-09-09 (`product/99-rfc/0011-event-assignment.md`, Accepted, promoted `decision-log.md` D60):** new §3.26 "Personal para este evento" designs the OWNER-side surface for assigning specific `BusinessMembership` SELLERs to a specific Event — the missing half RFC 0011 itself named as unresolved (the SELLER-side consumption, a SELLER's Session-open Event picker narrowing to only Events she's assigned to, was already designed separately, `home.md` §2/§3.6b). Reached via a new secondary action on Event detail, both `scheduled` (§3.11, "Asignar personal") and `active` (§3.14/§3.15, "Ver personal de este evento") — mirroring exactly how "Llevar mercancía"/"Ver mercancía de este evento" already compose across those same two states, not a new entry-point pattern. Deliberately not surfaced on Nuevo Evento (§3.6/§3.7) — `EventAssignment` requires a real, already-saved `eventId`, and Nuevo Evento's own minimal-required-fields discipline (Lugar + Tipo only) is preserved unchanged. **Present unconditionally regardless of `subscriptionTier` (corrected 2026-09-10, EVT-M6 remediation — see below):** `EventAssignment` creation (D60/RFC 0011) gates only on `BusinessMembership.status = active`, never on `subscriptionTier` — this document's original claim that "a Free-tier Business can never hold an active SELLER Membership" is superseded by `settings.md` §8 item 13's resolution (an already-active SELLER Membership survives a Paid→Free downgrade entirely unaffected, grandfathered). A genuinely-never-Paid Free-tier Business simply has zero active SELLER Memberships to show — it could never have issued an Invitation in the first place — and lands on this screen's own zero-state (§3.26); no separate tier-based visibility rule is needed. The screen reads the identical roster `settings.md` §2.7 already maintains (phone-number identification, the same named `User` display-name gap) rather than inventing a second staff list, and adapts (not copies verbatim) `settings.md` §3.11's own zero-state framing. Designs RFC 0011's own Open Item 3 (the scheduling-conflict warning's UX, explicitly routed here) as a non-blocking, computed-live-on-every-render, per-row line, shown before she ever taps — never a separate confirmation step, never rejecting the write, per RFC 0011's own settled warn-with-override decision. RFC 0011's Open Item 4 (gating assignment to `status = active` Memberships) is resolved directly (D60), not merely assumed (§8). **`ux-critic` found 3 Major + 1 Minor against this section (2026-09-09) — all fixed 2026-09-10:** EVT-M4 (the conflict warning moved from a post-tap-only signal to a pre-tap, on-the-row signal, matching `home.md` §3.6a's own Limited Ready precedent), EVT-M5 (the zero-state now distinguishes never-invited from invitation-pending), EVT-M6 (the Free-tier structural-absence claim, superseded by `settings.md` §8 item 13's resolution, corrected here and at §3.11/§3.14/§3.15/§10), EVT-MIN1 (a light row-settle mitigation added). Re-review pending. **[see events.changelog.md#status-2026-09-09-rfc0011-event-assignment]**

**Amended 2026-08-04 (icon/comprehension audit):** §3.4/§3.5's Events list
cards now show Event type alongside `Venue.displayName` ("Plaza Norte ·
Bazar"), matching the subordinate role Type already has on Detail screens.
**[Amended 2026-08-14 — see
events.changelog.md#status-2026-08-04-icon-comprehension-audit]**

**Amended 2026-08-08 (`decision-log.md` D33, MVP pricing operating model):**
`Event.bazaarCost` (optional) added to Nuevo Evento (§3.6), and a new
per-Product Price Override mechanism ("Ajustar precios," new §3.19/§3.20)
added to Event detail, reachable only while an Event is `scheduled` —
removed entirely from active-state screens (§3.14/§3.15). **[Amended
2026-08-14 — see events.changelog.md#status-2026-08-08-d33-mvp-pricing]**

**Amended 2026-08-13 (Architect-resolvable content amendment, closing an
`experience-review-2026-08-13-eventos.md` finding — see `architect-questions.md`
Q19, cross-referencing Q7):** §3.14 (Event detail, active, no Session
opened today) gains a conditional, ambient row — "Hoy (Día N) · $X · N
ventas hasta ahora" — shown only when a Session under this `eventId`
already has 1+ finalized Sales on today's calendar date; absent entirely
in the common case (no Session opened yet today). **[Amended 2026-08-14 —
see events.changelog.md#status-2026-08-13-q19-same-day-resume-row]**

Scope: `Eventos`, the third of four top-level nav items per
`product/00-foundation/information-architecture.md`. Covers Journey 2 (Event
scheduling) and Journey 4 (Event close) from `information-architecture.md`.
Implementation-independent — low-fidelity only, no visual design.

Out of scope by explicit instruction (`company/backlog.md` #3, `company/CLAUDE.md`
non-goals): **no bazaar recommendation logic anywhere in this doc.** Eventos
helps Ana *schedule and record* an Event she has already decided (through her
own network/judgment) to attend, and later *review* how it went — it never
tells her which bazaar to pick, predicts foot traffic, or ranks venues. That
capability is backlog #3, blocked pending multi-vendor data ("do not attempt
to build"). Any future "which bazaar should I go to" feature is explicitly not
designed here.

## 1. Merchant goal

Eventos is neither of Home's two contexts (about to sell / already selling)
nor Inventario's (merchandise arrived / checking stock). It's a third,
distinct kind of moment, and it happens *away from* the pressure of either:

- **Planning ahead** (usually at home, days before a bazaar): she already knows
  where she's selling — a friend told her about a spot, an organizer confirmed
  her space — and wants that written down somewhere the app understands, so
  that when the day arrives, Home already knows "today is Bazar Plaza Norte,
  Día 2" instead of asking her. This is record-keeping of a decision already
  made, not decision support.
- **Looking back** (after a multi-day event ends): a quick, ambient read of
  "how did that one actually go" — the same one-line summary she already saw
  on the Eventos list (§3.4: días · ventas · $ total), enough to recognize
  which Event this was and judge at a glance whether it's worth a closer
  look — then a direct hand-off into Resultados, which owns the actual total
  sales across every day she worked it (Q7, `product/02-ux/architect-questions.md`).
  Eventos surfaces identity and an ambient signal here, not the rollup
  itself.

Nothing in Eventos is time-critical the way Home's <3s bar is
(`company/backlog.md` #1) — there's no customer waiting while she schedules a
future bazaar or reads a rollup. But "not urgent" isn't "worth padding with
steps": the same UX principles apply, just without a hard speed number
attached, exactly the posture `inventory.md` §1 already established for a
non-selling context.

## 2. Resolution / decision logic

Event's own lifecycle (`domain-model.md`: `scheduled → active → closed`, or
`cancelled`) drives everything in this doc. Being explicit about which
transitions are automatic and which are a merchant action:

```
scheduled → active   AUTOMATIC, date-driven.
                      today ∈ [startDate, endDate] (inclusive).
                      Same mechanism Home already reads to decide whether to
                      show "Continuar Día N" (home.md §2, step 2) — Eventos
                      doesn't recompute this differently, it reads the same
                      fact.

active → closed       AUTOMATIC, date-driven.
                      today > endDate. Closes on schedule even if she worked
                      fewer days than the Event spanned (e.g., a 3-day bazaar
                      she only attended twice still closes on time) — closing
                      is about the calendar running out, not about whether
                      every day got a Session.

scheduled → cancelled MANUAL. The only merchant-initiated transition in this
                      whole model. Reachable only while status = scheduled
                      (§3.12). See §10 for why "cancel" isn't offered once an
                      Event is active.

active → cancelled    NOT DESIGNED. No path exists from active back to
                      cancelled or to an early "closed" in this spec — see
                      §10 and §11.

closed / cancelled    Terminal. No further transitions modeled.
```

This status is computed live, every time Eventos (or Home) is opened — never
a flag she sets or a background job she has to trust; from her side, it's
just always correct.

**Which section an Event card appears under** (Activo / Próximos / Pasados,
§3.4) is a pure read of the status above — never a separately tracked list.

**Which Sessions display under an Event** — any Session whose `eventId`
matches, regardless of the Session's own status (`domain-model.md`: Event
"does NOT own Session as a strict aggregate... read-side query across
Sessions sharing that ID"). Nothing here is a write-time list Event
maintains.

**"Día N" per Session** — the identical computed value Home already produces
(`home.md` §2 step 2, §7), reused as-is, never recalculated with different
logic. This is exactly the value Q1 (below) leaves ambiguous, and Eventos is
where that ambiguity becomes visible in list form, not just a single number
on Home — see §8.

**A note on what Session→Event linking is, and isn't, here:** a Session only
ever gets an `eventId` through Home's own automatic resolution at Session-open
time (`home.md` §2). Eventos has no "attach this Session to that Event"
picker, and no way to retroactively assign an already-run Quick Session to an
Event created after the fact — see §11.

**A new fact this doc resolves via Venue, not independently:** every Event
now references exactly one Venue (`venueId`, required, not nullable) —
`domain-model.md`'s entity-relationships diagram, `decision-log.md` D20.
Venue is a lightweight, independent aggregate root owned by the Selling
context (`id`, `businessId`, `displayName`, optional address/notes,
`active`), resolved via the create-or-select picker in §3.7. This doc treats
`Venue.displayName` as the sole identity/display label everywhere Event's
former freeform `Nombre` used to appear — never a second, Event-specific name
field alongside it (ruled out definitively, see §10).

## 3. Low-fidelity wireframes

Conventions inherited from `home.md`/`inventory.md`: `[ ]` = tappable, plain
text = passive/informational, bottom row is the persistent nav bar on every
state, current tab in brackets. Sub-screen navigation (list → detail) is
assumed to use already-fetched data and isn't given its own loading skeleton
below, the same scoping choice `home.md`/`inventory.md` made — only
tab-level resolution and an explicit save action get a loading state.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │
│        ▢▢▢▢▢▢▢▢▢▢              │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Same silent-skeleton convention as `home.md` §3.1 / `inventory.md` §3.1 —
  not re-invented for this tab.

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

### 3.3 Cold start — no Event ever scheduled
```
┌───────────────────────────────┐
│  Eventos                       │
│  Aquí vas a ver tus bazares,     │
│  expos y demás eventos en        │
│  cuanto agendes uno.             │
│      [ Agendar evento ]         │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Same tone/shape as Home's and Inventario's cold starts (`home.md` §3.3,
  `inventory.md` §3.3): one honest sentence, one CTA. "Agendar evento" is new
  vocabulary (no existing CTA fits), chosen to match `vision.md`'s own
  "Schedule Event" step in language Ana would actually use — "agendar" is how
  people really talk about booking something in Mexican Spanish, not a
  literal translation of "schedule." *global-principles.md*, "avoid literal,
  word-for-word translations."

### 3.4 Events list — normal (Activo + Próximos + Pasados all present)
```
┌───────────────────────────────┐
│  Eventos                       │
│  Activo                         │
│  ┌───────────────────────────┐ │
│  │ Plaza Norte · Bazar          │ │
│  │ Día 2 de 3 · 12-14 jul       │ │
│  └───────────────────────────┘ │
│  Próximos                       │
│  ┌───────────────────────────┐ │
│  │ Plaza Toluca · Expo          │ │
│  │ empieza en 5 días            │ │
│  └───────────────────────────┘ │
│  Pasados                        │
│  ┌───────────────────────────┐ │
│  │ Plaza Metepec · Bazar        │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Ixtapan · Bazar              │ │
│  │ Sin ventas registradas        │ │
│  └───────────────────────────┘ │
│      [ Agendar evento ]         │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Each section header only renders when it has ≥1 card — an empty "Activo"
  label with nothing under it is never shown. *global-principles.md*, "the
  fastest interaction is the one that never happens" applied to reading, not
  just tapping: nothing on screen that isn't informative.
- **Card headline is now `Venue.displayName`, not Event's former freeform
  `Nombre`** (`decision-log.md` D20) — same slot, same role (this is the
  identity label Ana recognizes at a glance), different underlying source.
  Because a Venue is a real, independent identity, the exact same Venue
  reappears verbatim across every Event she schedules there, instead of
  depending on her retyping a matching string each time.
- "Día 2 de 3" — the "de 3" is unambiguous (Event's own scheduled span,
  `endDate − startDate + 1`, plain calendar arithmetic on the dates she typed
  in §3.6). "Día 2" is the part Q1 leaves open — see §8. Denominator and
  numerator come from two different, independently-sourced facts; this row is
  the clearest place that distinction matters.
- Pasados cards show a thin, ambient one-line summary (ventas, $ total, días)
  — the same kind of passive indicator Home's own header shows ("Hoy: $850 ·
  6 ventas," `home.md` §3.7), not a breakdown. Tapping through to §3.16 hands
  off to Resultados for anything beyond this one line, per Q7's resolution
  (`architect-questions.md`).
- **Pasados also renders a zero-Session Event gracefully** — "Ixtapan · Sin
  ventas registradas" — instead of mechanically applying the standard card
  shape, which would otherwise read as "0 días · 0 ventas · $0." This is
  the list-level counterpart to §3.17's detail-screen treatment of the exact
  same underlying case (an Event that closed with no Sessions ever opened
  under it — she changed her mind, it got rained out, she simply never
  went): same plain, factual, non-judgmental tone, no guilt-tripping copy,
  just compressed into the one-line ambient summary this list already uses
  for every Pasado card. Ordered by the same "most-recent-first" rule as
  every other Pasado card (its own `endDate`, independent of whether it has
  any Sessions to aggregate). (EVT-M2 remediation.)
- Pasados ordered most-recent-first (most likely to be what she just walked
  away from).
- Home's own upcoming-Event card (`home.md` §3.5) shows only the single
  soonest Próximo — Eventos' Próximos section is the fuller list behind it,
  not a duplicate mechanism.
- **Card headline now also carries Event type, joined to `Venue.displayName`
  by " · " — "Plaza Norte · Bazar"** — the same subordinate relationship
  Type already has on Detail screens (§3.11/§3.14/§3.16: `Venue.displayName`
  leads, Tipo follows, joined the same way), condensed onto the one headline
  line a compact list card has room for rather than Detail's separate second
  line. The existing summary line (día count, countdown, or ventas total) is
  unchanged — card height and every other fact on the card stay exactly as
  before. Safe as a pure copy/label addition: `Event.type` is a closed,
  frozen 6-item enum (`decision-log.md` D16) — no new data, no schema
  change, nothing left for Ana to type or configure. Applies identically to
  every card shape in this section, including the zero-Session "Sin ventas
  registradas" card (EVT-M2), and to §3.5's identical Próximos/Pasados
  cards.

### 3.5 Events list — no Activo Event (most common day-to-day state)
```
┌───────────────────────────────┐
│  Eventos                       │
│  Próximos                       │
│  ┌───────────────────────────┐ │
│  │ Plaza Toluca · Expo          │ │
│  │ empieza en 5 días            │ │
│  └───────────────────────────┘ │
│  Pasados                        │
│  ┌───────────────────────────┐ │
│  │ Plaza Metepec · Bazar        │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Ixtapan · Bazar              │ │
│  │ Sin ventas registradas        │ │
│  └───────────────────────────┘ │
│      [ Agendar evento ]         │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Same layout rule as §3.4, just with the (usually absent) Activo section
  genuinely absent most days — most of Ana's calendar has no Event running.
- A zero-Session Pasado renders identically here — same card shape and copy
  as §3.4's "Ixtapan" example (see §3.4's annotation for the full
  rationale), not restated for every list variant. (EVT-M2 remediation.)

### 3.6 Nuevo Evento — entry form
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Agendar evento                   │
│                                │
│ Lugar                           │
│  [ Elegir lugar ▾ ]               │
│ Tipo                            │
│  [ Elegir tipo ▾ ]                │
│ Empieza                         │
│  [ 04 / 08 / 2026 ]               │  prefilled = hoy, editable
│ Termina                         │
│  [ 04 / 08 / 2026 ]               │  prefilled = Empieza, editable
│ Costo del evento (opcional)        │
│  [ $ ___ ]                       │
│                                │
│  [      Guardar evento       ]   │  disabled until Lugar + Tipo
│                                │   (Empieza/Termina already valid by default)
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
(The "04 / 08 / 2026" is illustrative "hoy" — the field always renders the
real current date, same as any other date field in this doc.)
- **"Costo del evento (opcional)" — new field, captures `Event.bazaarCost`
  (`decision-log.md` D33).** Optional, defaults to blank (stored as 0 if
  left untouched, per D33), and never joins Guardar evento's required-field
  gate — excluded exactly the way Empieza/Termina's own defaults already
  keep them from ever blocking a save. Plain peso entry, no currency
  picker, same numeric-entry posture as `inventory.md`'s new Precio field
  (§3.8a). Captures what attending this Event costs Ana — venue fee,
  optionally plus staffing — sourced to her own volunteered figures (D33's
  evidentiary basis, `company/market-validation.md` §1c/§1d) — displayed
  back to her verbatim on Event detail screens (§3.11/§3.14/§3.15/§3.16/
  §3.17), but **explicitly not computed against anything**: D33 is
  captured-but-not-computed in this MVP — no profitability/margin figure
  netting cost against revenue exists anywhere in this document.
- **Empieza defaults to hoy (today's date) instead of opening blank.** Ana is
  almost always scheduling for an imminent bazar, not months out, so hoy is
  right for the common case and stays a single edit away for the real
  multi-day-ahead case. *global-principles.md*, "never ask twice": since the
  system can already supply a sensible answer, the field shouldn't sit empty
  waiting for her to notice and fill it. Empieza is unchanged as a required
  domain field — this only changes what the UI shows before she's touched it.
  Because Empieza is now always a real, valid date from the moment the form
  opens, **Guardar evento's gate narrows to Lugar + Tipo alone** — she never
  has to touch Empieza to reach a saveable state in the common same-day case.
- "Termina" auto-fills to match whatever Empieza currently holds — her manual
  pick, or its new hoy default — the instant Empieza resolves to a real date;
  most of Ana's events are single-day (bazares), so this removes a "¿va a
  durar varios días?" question entirely; she only touches Termina for the
  minority multi-day case. *global-principles.md*, "never ask twice"; matches
  the spirit of `inventory.md` §3.6's own "only ask what's needed."
- **Lugar replaces Event's former freeform `Nombre` field entirely**
  (`decision-log.md` D20, `product/99-rfc/0001-venue-entity.md`). It's a
  required create-or-select picker (§3.7) referencing a Venue — the exact
  same interaction pattern as Inventario's Product picker (`inventory.md`
  §3.8), reused rather than reinvented per the Architect's ruling: one field
  resolves both "sell here again" (select an existing Venue) and "this is a
  new place" (create one inline), matching typed text case-insensitively and
  trimmed against her existing Venues. Never a second, Event-specific name
  field alongside it — `Venue.displayName` is now the sole identity/display
  label for what this screen used to call Nombre, since repeat visits to one
  Venue are already distinguished by date range in every wireframe in this
  doc (§3.4's "Día 2 de 3," this doc's whole Pasados list) — no information
  is lost by dropping a second name.
- **The previous optional freeform "Lugar (opcional)" address field no
  longer exists on Event at all.** Venue's own optional address/notes is now
  the single durable location record, inherited by every Event that
  references that Venue, rather than a second, per-Event string that could
  drift from the Venue it describes. This spec does not design a UI surface
  for capturing that optional address at Venue-creation time — see §3.7's
  annotation and §11.
- Lugar, Tipo, Empieza remain the three required domain fields; Empieza and
  Termina are now both always populated by default (Empieza = hoy, editable;
  Termina = Empieza, auto, editable) — Lugar and Tipo are the only fields she
  must actively choose. No Supplier/cost-style hidden fields apply here —
  Eventos has nothing analogous to Inventario's deliberate-exception fields.

**Overlap-validation variant (D17) — retired 2026-09-06 (`decision-log.md` D53).** D17's restriction ("at most one Event may be scheduled/active with an overlapping date range at a time") is superseded — Nahui now supports simultaneous multi-Event operation. The inline warning, its two illustrative examples, and every bullet describing its mechanics (computed-on-open/shown-on-engagement timing, the "si agendas para hoy" copy variant, reuse of already-loaded data, naming the conflicting Event, tone/severity treatment, the no-dismiss-tap clearing behavior, the extended Guardar-evento gate) are removed outright — there is no longer a rule for any of it to enforce. **Guardar evento's gate is Lugar + Tipo alone** — Empieza/Termina are always valid by default from the moment the form opens (per §3.6's Empieza-default amendment above); there is no third gate. Full removed text preserved at `events.changelog.md#status-2026-09-06-d53-overlap-validation-retired`, per this document's own non-deletion discipline.

### 3.7 Elegir lugar — picker sheet
```
┌───────────────────────────────┐
│ ← Eventos                        │  dimmed, visible underneath
│  Agendar evento                   │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ¿Dónde vas a vender?             │
│  [ Buscar o escribir… ]          │
│  ─────────────────────────      │
│  [ + Agregar "Plaza Toluca" como  │  only shown once typed text doesn't
│    lugar nuevo ]                  │  match an existing Venue (see rule below)
│                                │
│  Plaza Norte                      │
│  Plaza Metepec                    │
│  Ixtapan                          │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- **New screen, added to apply Venue** (`decision-log.md` D20,
  `product/99-rfc/0001-venue-entity.md`) — mirrors Inventario's "Elegir
  producto" (`inventory.md` §3.8) field-for-field, per the Architect's
  explicit ruling that this is the same interaction pattern, not a new one:
  one field resolves both "sell at a place she's used before" (select an
  existing Venue) and "this is somewhere new" (create it inline) — no
  separate "crear lugar" screen.
- She is never asked "¿es un lugar nuevo?" explicitly — inferred
  automatically from whether her typed text matches an existing Venue, using
  the identical matching rule `inventory.md` §3.8 already established for
  Products: **case-insensitive, trimmed.** "Plaza Norte," "plaza norte,"
  "PLAZA NORTE," and " Plaza Norte " (leading/trailing space) all resolve to
  the same existing Venue — the "+ Agregar... como lugar nuevo" row never
  appears for any of them. Deliberately stops short of fuzzy/typo-tolerant
  matching for the same reason `inventory.md` §3.8 does: collapsing
  genuinely different names could silently merge two physical places she
  meant to keep separate. This is what actually resolves the fragmentation
  risk originally logged as Q9 (`product/02-ux/product-decisions.md`) — not
  by cleverer string-matching on a freeform field, but by giving the place
  itself a real, independent identity she selects rather than retypes.
- **Selecting an existing Venue carries over only its `displayName`.** No
  address/notes field is shown here, and none is captured when creating a
  new Venue through this picker either. Venue's optional address/notes
  exists in the schema (`product/99-rfc/0001-venue-entity.md`) but has no
  data-entry surface designed in this pass — the same structurally-present,
  UI-absent treatment `decision-log.md` D9 already established for
  Supplier/cost. See §11.
- This is a genuinely new required step relative to the old freeform Nombre
  field — but the added cost only lands on a Venue's first-ever use (§6).
  Every later visit to the same physical place is a single tap on an
  existing name, never a re-typed string that could drift, fragment, or cost
  her a second's thought about how she spelled it last time.

### 3.8 Elegir tipo — picker sheet
```
┌───────────────────────────────┐
│ ← Eventos                        │  dimmed, visible underneath
│  Agendar evento                   │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ¿Qué tipo de evento es?          │
│  Bazar                          │
│  Expo                           │
│  Pop-up                         │
│  Festival                       │
│  Tianguis                       │
│  Venta de oficina                │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Shows the six Event types listed as examples in `ubiquitous-language.md`
  ("Bazaar, Expo, Pop-up, Festival, Market, Office Sale, **...**" — note the
  trailing ellipsis), each naturalized into the Mexican-Spanish word a
  vendor would actually say for it — the same treatment `ubiquitous-language.md`
  already gives "Bazaar" itself ("Terms we deliberately do not use": the
  domain model's internal English term stays "Bazaar," but "will likely stay
  'Bazar' in Spanish UI copy for Ana specifically"). **Remediation (EVT-M1):**
  the internal enum's "Market" was previously left untranslated on this
  screen — a literal leftover of the English domain term, not a deliberate
  localization, and the only item breaking the pattern the other five
  (Bazar/Expo/Pop-up/Festival/Venta de oficina) already establish. Corrected
  to "Tianguis" — the recurring, open-air public market a vendor like Ana
  would actually call by that name, and a meaningfully different venue from
  "Bazar" (`company/CLAUDE.md`: Ana sells at private bazares) rather than a
  synonym for it. *global-principles.md*, "avoid literal, word-for-word
  translations… write how a Mexican bazaar vendor actually talks."
- **Whether this list is genuinely closed or open-ended is not actually
  settled by the Foundation** — unlike Inventario's Product picker
  (`inventory.md` §3.8) and this doc's own Elegir lugar (§3.7), both of
  which explicitly support adding a new value. This spec conservatively
  shows no "add a new type" affordance pending that answer, rather than
  asserting either way. Escalated to Architect and logged as Q6 in
  `product/02-ux/product-decisions.md` (reclassified from
  `architect-questions.md` as a Product Decision) — see §8.
- "Bazar" listed first — per `company/CLAUDE.md`, bazares are Ana's primary,
  validated context; ordering reflects actual frequency, not alphabetical
  tidiness.
- **Type stays a separate field from Lugar/Venue.** The same physical Venue
  can host different Event types over time (a Bazar this visit, an Expo
  next), which is exactly why Venue's identity is independent of any one
  Event's Tipo — folding them into one compound label (the way the old
  freeform Nombre often did, e.g. "Bazar Plaza Norte") would have re-created
  the same ambiguity Venue exists to remove. See §10.

### 3.9 Guardar evento — saving / error
```
┌───────────────────────────────┐   ┌───────────────────────────────┐
│                                │   │        Guardando…              │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │   │                                │
├───────────────────────────────┤   ├───────────────────────────────┤
│ Hoy Inventario [Eventos] Resultados│ Hoy Inventario [Eventos] Resultados│
└───────────────────────────────┘   └───────────────────────────────┘
   near-instant: silent skeleton         slow (>~1.5s): one plain line

┌───────────────────────────────┐
│  No se pudo guardar. Tu evento    │
│  sigue aquí, intenta de nuevo.     │
│  Plaza Norte · 12-14 jul          │
│      [   Reintentar   ]          │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Identical convention and identical failure guarantee as `home.md`
  §3.1/§3.2 and `inventory.md` §3.10/§3.11: a failed save never drops what she
  already typed or picked — including her selected/newly-created Lugar.
  *global-principles.md*, "the best interface stays out of the merchant's
  way."

### 3.10 Post-save confirmation (ambient, returns to Events list)
```
┌───────────────────────────────┐
│  Eventos                       │
│  Evento agendado ✓               │  ambient, fades — not a separate screen
│  Próximos                       │
│  ┌───────────────────────────┐ │
│  │ Plaza Norte                 │ │
│  │ empieza en 3 días            │ │
│  └───────────────────────────┘ │
│      [ Agendar evento ]         │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Same ambient-confirmation pattern as `inventory.md` §3.12 — no "Ir a
  Eventos" tap required to leave a confirmation she already wants to leave.
- Whether the new card lands in Activo or Próximos is purely a read of
  §2's rule (today ∈ [startDate, endDate] or not) — never a choice she makes
  or a separate "publish" step.

### 3.11 Event detail — scheduled (not yet active)
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Toluca                     │
│  Expo · empieza en 5 días         │
│  19-21 de agosto                  │
│  Costo: $3,500                     │  passive info, only shown if set
│                                │
│      [ Llevar mercancía ]        │  secondary, optional
│      [ Ajustar precios ]         │  secondary, optional
│      [ Asignar personal ]        │  secondary, optional
│      [ Cancelar evento ]         │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Passive info (Venue name, type, dates) + exactly two secondary actions.
  No edit affordance designed — see §11. No Sessions exist yet (the Event
  hasn't started), so there's nothing else to show.
- **"Llevar mercancía" — new secondary action (`product-decisions.md` Q24/Q25), opens §3.21.** Optional and non-gating: an Event with zero allocations remains exactly as valid and sellable as one with several — Selling's FIFO/manual resolution against the general pool is entirely unaffected by whether allocation was ever used for this Event (allocation is a planning aid, never a precondition for selling). OWNER-only, per `product-decisions.md` Q24/Q25's settled permission table.
- **"Asignar personal" — new secondary action (`product/99-rfc/0011-event-assignment.md`), opens §3.26 "Personal para este evento."** Optional and non-gating: an Event with zero assignments is exactly as valid and sellable as one with several — an OWNER's own Session-open resolution never consults `EventAssignment` at all (RFC 0011's own Open Item 2), and a SELLER with zero assignments simply falls through to Quick Session, unaffected (`home.md` §2 step 2, RFC 0011 Open Item 1). OWNER-only, per `product-decisions.md` Q24/Q25's settled permission table — the same gate already governing "Llevar mercancía"/"Ajustar precios" on this screen and "Tu equipo" (`settings.md` §2.7). **Present unconditionally regardless of `subscriptionTier` (corrected 2026-09-10, EVT-M6 remediation).** `EventAssignment` creation (D60/RFC 0011) gates only on `BusinessMembership.status = active`, never on tier — a grandfathered Free-tier Business with an already-active SELLER Membership (`settings.md` §8 item 13: an active Membership survives a Paid→Free downgrade unaffected) retains real, ongoing ability to assign it to new Events. A genuinely-never-Paid Free-tier Business simply has zero active SELLER Memberships to assign and lands on §3.26's own zero-state — no tier check gates whether the row itself renders.
- **"Ajustar precios" — new secondary action, applies `decision-log.md`
  D33.** Opens §3.19's per-Product Price Override list for this Event.
  Optional and non-gating: an Event with zero overrides is exactly as
  valid, complete, and sellable as one with several — every Sale simply
  resolves each Product's price from its own `defaultPrice` when no
  override exists (`domain-model.md`'s Price resolution Key Mechanism).
- **"Costo" shown as passive info beneath the dates line, only when a
  value was entered at Nuevo Evento** — omitted entirely when left blank,
  never shown as "$0." Same identity/status role as Lugar/Tipo/dates on
  this screen — a fact about the Event, not a computed figure — so this
  stays within Eventos' own §1 role, not Resultados'. Applies identically
  to §3.14/§3.15/§3.16/§3.17.
- **"Ajustar precios" is strictly an Event-*planning* capability, reachable
  only while the Event is still `scheduled` — this is the only Event
  detail state in this document that offers it** (Product Owner decision,
  correcting round 1's draft, which had made the action reachable
  throughout the Event's entire open lifecycle, including while active —
  see §10 for the full correction record). Opens §3.19's per-Product
  Price Override list for this Event. Optional and non-gating: an Event
  with zero overrides is exactly as valid, complete, and sellable as one
  with several — every Sale simply resolves each Product's price from its
  own `defaultPrice` when no override exists (`domain-model.md`'s Price
  resolution Key Mechanism). **Once this Event transitions from
  `scheduled` to `active`, its Price Overrides are finalized and
  immutable for the rest of that Event's duration** — this isn't a UI
  restriction layered on top of an editable value, it's that editing
  simply stops being offered the moment planning ends. See §3.14/§3.15's
  own annotation for the active-state consequence of this rule, and §10
  for the full decision record.
- **Headline is `Venue.displayName` ("Plaza Toluca"), same slot the former
  Nombre occupied.** The former separate "Lugar" address line (previously
  "Plaza Toluca" shown *underneath* a differently-worded Nombre like "Expo
  Toluca") is retired along with the field — there is no longer a second,
  more-specific location string to show beneath the headline, since
  `Venue.displayName` already carries that specificity directly. See §10 for
  why this doc's own example data now uses the more specific former-Lugar-style
  values as `Venue.displayName`, rather than the old compound Nombre strings.
- This is also the exact screen Home's upcoming-Event card (`home.md` §3.5)
  routes into when tapped — not a separate destination invented for that
  entry point.

### 3.12 Cancelar evento — confirmation
```
┌───────────────────────────────┐
│ ← Eventos                        │  dimmed, still visible underneath
│  Plaza Toluca                     │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │ ¿Cancelar el evento en       │ │
│  │ Plaza Toluca?                │ │
│  │ [ No, mantenerlo ] [ Sí, cancelarlo ]│ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- The third deliberate confirmation across the whole product (alongside
  Home's close-session, `home.md` §3.11, and Inventario's Descartar,
  `inventory.md` §3.9) — justified the same way: rare and effectively
  irreversible (cancelled is terminal; she'd have to re-agendar from
  scratch).
- **Deliberate deviation from the "[Cancelar] [Sí, ...]" button-label
  convention** used everywhere else in Home/Inventario: here the *action
  itself* is "cancelar," so reusing "Cancelar" as the dismiss button would
  read as ambiguous ("cancel the cancel"?). Buttons are "No, mantenerlo" /
  "Sí, cancelarlo" instead — same intent (safe dismiss vs. explicit commit),
  different words, chosen specifically to avoid the collision. Noted here so
  this isn't mistaken for inconsistency with the sibling docs.
- **Confirmation copy reworded from "¿Cancelar Plaza Toluca?" to "¿Cancelar
  el evento en Plaza Toluca?"** — a small, deliberate departure from the
  literal "same slot" swap used everywhere else in this doc. Since
  `Venue.displayName` now names a *place*, not the event itself, a bare
  "¿Cancelar Plaza Toluca?" reads as if she's cancelling the venue, not her
  visit to it — exactly the kind of ambiguity worth a few extra words to
  avoid in a destructive-action confirmation. Every other screen in this doc
  keeps the plain "same slot" swap, since a passive headline ("Plaza
  Toluca," §3.4/§3.11) doesn't carry that risk; only this one active verb
  phrase does.

### 3.13 Post-cancel confirmation (ambient, returns to Events list)
```
┌───────────────────────────────┐
│  Eventos                       │
│  Evento cancelado                │  ambient, fades
│  Pasados                        │
│  ┌───────────────────────────┐ │
│  │ Plaza Metepec                │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│      [ Agendar evento ]         │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- The cancelled Event simply no longer appears anywhere en este list (not
  moved to Pasados — it never happened). No "Cancelados" archive is designed
  — see §10, §11.

### 3.14 Event detail — active, no Session opened today
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Norte                      │
│  Bazar · 12-14 de julio            │
│  Costo: $2,800                     │  passive info, only shown if set
│                                │
│  Día 1 · 12 jul · 5 ventas · $610  │
│                                │
│      [   Continuar Día 2     ]   │
│      [ Ver mercancía de este evento ] │  secondary
│      [ Ver personal de este evento ]  │  secondary
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- **"Ver mercancía de este evento" — new secondary action (`product-decisions.md` Q24/Q25), opens the identical §3.21 "Llevar mercancía" reaches from §3.11 (shared state, per `product/02-ux/CLAUDE.md` §4).** Present throughout the Event's `active` life, unlike "Ajustar precios" (absent from every active-state screen per this section's own annotation below) — see §3.21's own annotation for why this divergence is deliberate. OWNER-only.
- **"Ver personal de este evento" — new secondary action (`product/99-rfc/0011-event-assignment.md`), opens the identical §3.26 "Asignar personal" reaches from §3.11 (shared state, per `product/02-ux/CLAUDE.md` §4).** Present throughout the Event's `active` life, the same lifecycle shape as "Ver mercancía de este evento" (a roster she may still want to adjust mid-Event — a SELLER who can't make Día 2, a helper joining partway through) — unlike "Ajustar precios," which is `scheduled`-only. OWNER-only. **Present unconditionally regardless of `subscriptionTier`, same reasoning as §3.11's own annotation (corrected 2026-09-10, EVT-M6 remediation)** — never gated on tier, only on OWNER role; a genuinely-never-Paid Free-tier Business lands on §3.26's own zero-state instead of the row being hidden.
- **Headline is `Venue.displayName` ("Plaza Norte")**, same slot the former
  Nombre ("Bazar Plaza Norte") occupied; Tipo stays its own separate line
  ("Bazar · 12-14 de julio"), unaffected by the Venue change. No separate
  Lugar/address line — see §3.11's annotation for why.
- **"Costo" is shown per §3.11's rule (passive info, beneath the dates
  line, only when a value was entered — never "$0"). "Ajustar precios" is
  deliberately absent from this screen** — same reasoning class as why
  it's already absent from §3.16/§3.17's closed states, extended one
  stage earlier: once an Event transitions from `scheduled` to `active`,
  its Price Overrides are finalized and immutable for the rest of that
  Event's duration (`decision-log.md` D33, Product Owner decision — see
  §10). This is not a UI restriction layered on top of an otherwise-
  editable value — editing simply stops being offered the moment
  planning ends, matching the "finalized before activation, fixed for
  the duration" framing exactly. §3.11 is the only Event detail state
  that offers "Ajustar precios."
- "Continuar Día 2" is la *identical* CTA and underlying computed logic as
  `home.md` §3.6 — surfaced here as a second, equally valid entry point into
  the same single global selling state, not a separate implementation. Tapping
  it takes her to Hoy, exactly as if she'd tapped it from there.
  *global-principles.md*, "selling is a state, not a navigation destination"
  — this doesn't create a second selling screen, it's a shortcut into the one
  that exists.
- Día rows are passive, not tappable — reviewing a closed day's detail is
  Resultados' job (`information-architecture.md`, "deeper analytics"), not
  Eventos'.

**Same-day resume — a Session with finalized Sales already exists today
under this `eventId` (new — closes `architect-questions.md` Q19,
`experience-review-2026-08-13-eventos.md`):**
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Norte                      │
│  Bazar · 13-14 de agosto           │
│                                │
│  Hoy (Día 1) · $750 · 2 ventas hasta ahora │
│                                │
│      [   Continuar Día 1     ]   │
├───────────────────────────────┤
│ Hoy  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- **Condition:** identical to `home.md`'s matching amendment (§3.6) — shown
  only when at least one Session under this `eventId` already has 1+
  finalized Sales falling on today's calendar date, regardless of that
  Session's own current status. Absent entirely otherwise; the base §3.14
  wireframe renders unchanged.
- **Data source:** identical query to `home.md`'s matching amendment —
  `SUM(SaleItem.pricePaid)` and `COUNT(Sale)` across every Sale whose
  Session shares this `eventId` and falls on today's calendar date.
- **Deliberately worded to signal in-progress, not closed** — "Hoy (Día
  N)" + "hasta ahora" ("so far") names today specifically and states the
  total is still accumulating, a different row shape from this screen's own
  past-Día rows ("Día 1 · 12 jul · 5 ventas · $610," a finished prior
  date). This distinction matters precisely because of the tester finding
  this amendment closes: conflating this row with a finished-day row risked
  implying the earlier close had discarded her sales, which it never did.
- **Composes with, doesn't replace, any existing past-Día rows.** When this
  Event also has 1+ Sessions on calendar dates before today, those still
  render exactly as already specified, one row per past date — this row is
  a distinct, additional row for today specifically, always the last row
  before the primary CTA.
- **Same underlying fact as `home.md`'s matching amendment, surfaced a
  second time — not a second computation.** Reuses the identical Session
  set and SUM/COUNT query, the same reuse discipline this document's own
  §2/§7 already establish for "Día N" itself.

### 3.15 Event detail — active, Session already open today elsewhere
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Norte                      │
│  Bazar · 12-14 de julio            │
│  Costo: $2,800                     │  passive info, only shown if set
│                                │
│  Día 1 · 12 jul · 5 ventas · $610  │
│                                │
│  [ Vendiendo ahora · Día 2 ▸ ]   │  tappable → Hoy, resumes selling exactly
│  [ Ver mercancía de este evento ] │  secondary — donde she left it
│  [ Ver personal de este evento ]  │  secondary
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- **"Ver mercancía de este evento" — same new secondary action as §3.14 (`product-decisions.md` Q24/Q25), opening the identical shared §3.21.** OWNER-only.
- **"Ver personal de este evento" — same new secondary action as §3.14 (`product/99-rfc/0011-event-assignment.md`), opening the identical shared §3.26.** OWNER-only. **Present unconditionally regardless of `subscriptionTier`, same reasoning as §3.11/§3.14's own annotations (corrected 2026-09-10, EVT-M6 remediation).**
- Reads the same underlying priority fact Home's §2 checks first ("is there a
  Session with status = active"), scoped here to this specific Event's
  `eventId` — Home's own check doesn't need that filter since it just needs
  *any* active Session, but the computation is not re-derived with separate
  logic, just filtered to one Event's Sessions.
- **"Costo" is shown per §3.11's rule; "Ajustar precios" is deliberately
  absent from this screen too, for the identical reason given in §3.14's
  own annotation** — once an Event is `active`, its Price Overrides are
  already finalized and immutable for the rest of its duration
  (`decision-log.md` D33, Product Owner decision — see §10). §3.11 is the
  only Event detail state that offers "Ajustar precios"; not restated a
  third time here.

### 3.16 Event detail — closed/past
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Metepec                    │
│  Bazar · 5-7 de julio               │
│  Costo: $2,500                     │  passive info, only shown if set
│                                │
│  3 días · 18 ventas · $2,340      │
│                                │
│      [ Ver resumen en Resultados ]│
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**With unresolved mercancía allocated (extends this state — manual and NFC evidence can compose on the same Product row, never a forced choice, mirroring §3.21's own "sin tag · con tag" composability at allocation time):**

**NFC-tagged row (unchanged, `unitSource = scan`):**
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Metepec                    │
│  Bazar · 5-7 de julio               │
│  Costo: $2,500                     │  passive info, only shown if set
│                                │
│  3 días · 18 ventas · $2,340      │
│                                │
│  Mercancía de este evento que      │
│  no se vendió:                   │
│  ┌───────────────────────────┐ │
│  │ Bolsas — 3 sin vender         │ │
│  │  [ Regresar a inventario     │ │
│  │    general ]                 │ │
│  │  [ Mover a otro evento ]      │ │
│  └───────────────────────────┘ │
│                                │
│      [ Ver resumen en Resultados ]│
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**Manual/untagged row — new, quantity N > 1, fresh (never touched):**
```
│  ┌───────────────────────────┐ │
│  │ Playeras — 3 sin vender        │ │
│  │  [ Sí, regresaron las 3 ]       │ │
│  │  [ Ajustar cantidad ]           │ │
│  │  [ Mover a otro evento ]        │ │
│  └───────────────────────────┘ │
```

**Manual/untagged row — "Ajustar cantidad" tapped (in place, same row):**
```
│  ┌───────────────────────────┐ │
│  │ Playeras — 3 sin vender        │ │
│  │  Cuántas regresaron             │ │
│  │   [ − ]  [ 3 ]  [ + ]            │ │
│  │   (o escribe la cantidad)        │ │
│  │  [ Cancelar ]  [ Confirmar ]      │ │
│  │  [ Mover a otro evento ]          │ │
│  └───────────────────────────┘ │
```

**Manual/untagged row — new, quantity N = 1, fresh:**
```
│  ┌───────────────────────────┐ │
│  │ Gorras — 1 sin vender          │ │
│  │  [ Sí, regresó ]                │ │
│  │  [ No regresó ]                 │ │
│  │  [ Mover a otro evento ]        │ │
│  └───────────────────────────┘ │
```

**Manual/untagged row — later visit, an earlier partial/zero confirm left a shortfall outstanding:**
```
│  ┌───────────────────────────┐ │
│  │ Gorras — 1 sin vender          │ │
│  │  Ya revisaste esto — todavía     │ │
│  │  falta 1.                       │ │
│  │  [ Sí, regresó ]                 │ │
│  │  [ No regresó ]                  │ │
│  │  [ Mover a otro evento ]         │ │
│  └───────────────────────────┘ │
```
(plural equivalent: "Ya revisaste esto — todavía faltan N." with N's own primary/secondary copy — "Sí, regresaron las N" / "Ajustar cantidad" — unchanged in shape from the fresh state above; only this one passive line differs.)

**Mixed row — both a scan-sourced and a fifo-sourced pool still outstanding on the same Product:**
```
│  ┌───────────────────────────┐ │
│  │ Bolsas — 5 sin vender          │ │
│  │  con tag: 3                    │ │
│  │  [ Regresar a inventario      │ │
│  │    general ]                  │ │
│  │  [ Mover a otro evento         │ │
│  │    (de las con tag) ]          │ │
│  │                             │ │
│  │  sin tag: 2                    │ │
│  │  [ Sí, regresaron las 2 ]       │ │
│  │  [ Ajustar cantidad ]           │ │
│  │  [ Mover a otro evento          │ │
│  │    (de las sin tag) ]           │ │
│  └───────────────────────────┘ │
```

- **Corrected 2026-09-09 trigger condition (`product/99-rfc/0010-event-scoped-inventory-allocation-commitment-lifecycle-correction.md` §8/§11, Product-Owner-confirmed) — replaces this document's prior text.** This section renders whenever a closed Event has 1+ `EventAllocation` still `status = open` with **1+ unit still `reserved` in `allocatedUnitIds`, regardless of whether that unit's originating movement carries `unitSource = scan` (NFC) or `fifo_assignment` (manual)** — one unconditional trigger, not a per-mode rule — and stays until every row is resolved, never a dismiss-and-forget banner. The prior text read "`quantityRemaining > 0` for manual, or ≥1 `available`-status unit still in `allocatedUnitIds` for NFC" — both a stale schema reference (`quantityRemaining` is retired as a stored field under RFC 0010 §3, now a pure read-time derivation) and a pre-existing wording error RFC 0010's own Open Items flagged: an allocated NFC unit sits in `reserved`, never `available`, for the duration of its allocation — "available" there was always a documentation mistake, never a real second trigger condition. This is still the Product Owner's own explicit "must never happen silently" requirement made real — now correctly stated, uniformly, for both modes.
- **"Expected quantity" for a manual/untagged sub-pool is a live derivation, computed fresh on every render of this screen — never a stored or cached number.** It is the count of this `EventAllocation`'s `allocatedUnitIds` entries whose unit is currently `reserved` and whose originating movement carries `unitSource = fifo_assignment` — the identical candidate-selection query `releaseAllocation()` already performs to find its own release pool (RFC 0010 §8/§11), reused here, not a new query. Same "no independently-writable, driftable number" discipline `quantityRemaining`'s own retirement already established for the aggregate (RFC 0010 §3).
- **Two distinct action shapes per unresolved Product row now — NFC rows and manual rows differ because what the system can already verify differs (RFC 0010 §7's logical/physical-identity invariant), not because one mode is treated as less trustworthy.** NFC-tagged units were unit-identified at allocation time (a real scan), so the reconciliation tap is a bookkeeping confirmation of an already-fully-known fact — unchanged, no evidence to collect. Manual/untagged units were never individually identified, only counted — so reconciliation *is* the first and only moment the system can learn how many actually came back, and the interaction has to collect that evidence, at the coarsest grain that's honest (a quantity, never a fabricated per-unit identity).
- **The manual-mode happy path: one tap on "Sí, regresaron las N" (or "Sí, regresó" at N=1) confirms the full live-expected quantity, with nothing to type or verify.** This is `releaseAllocation(eventAllocationId, quantity=N)` with `N` supplied automatically as the system's own already-known ceiling — she is never asked to state back a number the system already computed (`global-principles.md`'s "never ask twice"). Writes `type = return_to_general`, `quantityExpected = N`, `quantityDelta = -N`; ambient "Se regresó [Producto] a inventario general ✓" (fades, reuses the exact copy NFC's own full-return action already uses — this is the same underlying idea Ana already knows, just reaching a different pool of stock); the manual sub-block disappears from this row immediately (or, on a mixed row, only the manual sub-block — the NFC sub-block, if any, is independently gated and persists on its own).
- **"Ajustar cantidad" is the secondary, deliberately lower-prominence path for the N > 1 case — a single-purpose reveal, not a rare/irreversible action requiring a confirmation sheet of its own.** Tapping it reveals, in place, the exact stepper shape §3.21's manual allocation stepper already established (`[−]`/`[+]`/typed entry via teclado numérico), floor 0, ceiling N, **starting at N** — she decrements from the full expected amount, which keeps the common "off by one or two" case (most of what she brought came back) a one- or two-tap edit, not a re-typed-from-zero entry. `[ Cancelar ]` returns to the default one-tap view with nothing written (matches §3.24's own `Cancelar` semantics — no write has happened yet, nothing to discard). **Tapping "Mover a otro evento" instead of Cancelar or Confirmar has the identical effect on the staged stepper value — it, too, is silently discarded before the screen proceeds into §3.24**, the same "leaving before the explicit commit action discards only the unsaved staged value" discipline §3.21's own precedent already states for its manual edits ("leaving this screen before tapping Guardar cambios discards only unsaved manual edits") — never a second, differently-worded rule invented for this row. `[ Confirmar ]` calls `releaseAllocation(eventAllocationId, quantity=<stepper value>)`, writing `quantityExpected = N`, `quantityDelta = -<value>`, and an ambient confirmation — **"Confirmaste que <value> de N [Producto] regresaron ✓" when `<value> = N` (the stepper reaching the full expected amount is still a full return, and keeps the same checkmark the one-tap happy path uses), or "Confirmaste que <value> de N [Producto] regresaron" — no checkmark — whenever `<value> < N`, including a confirmed 0** (see the new bullet below for why this divergence is deliberate); either way, used uniformly with no special-cased zero copy beyond the checkmark rule itself, keeping this consistent and avoiding a singular/plural rewrite of the merchant's own Product name.
- **At N = 1, the secondary path collapses to a single direct tap — "No regresó" — with no intermediate stepper at all**, a deliberate simplification: there is no intermediate value to select when the only alternative to "1 came back" is "0 came back," so showing a stepper here would be UI for a choice that doesn't exist. Same discipline `inventory.md`'s Cantidad floor-of-1 reasoning already applies elsewhere in this document family (don't design a control for a state that isn't real). Tapping it writes `quantityExpected = 1`, `quantityDelta = 0`, ambient **"Confirmaste que 0 de 1 [Producto] regresaron" — no checkmark, per the same rule stated below.**
- **No confirmed-shortfall or confirmed-zero reconciliation message carries the ambient checkmark the full-return confirmations use — a deliberate divergence from this section's own default treatment, not a silent gap (`ux-critic` finding).** This document already draws exactly this line for a comparably neutral/negative administrative outcome: §3.13's "Evento cancelado" deliberately renders with no checkmark, reserving ✓ for outcomes that are genuinely, unambiguously good news. Confirming that less than everything came back — including a confirmed zero — is a true and useful record, and stays exactly as low-friction and ungated as every other confirmation in this section (see below); it just isn't a moment to visually celebrate, since the merchandise, in fact, didn't come back. This applies identically to "Confirmaste que 0 de 1... regresaron" (the N = 1 path, above) and to the stepper path's own "Confirmaste que <value> de N... regresaron" whenever `<value> < N` — the same class of "not everything came back" outcome, treated the same way. Only a full-return confirmation — the one-tap default's "Se regresó [Producto] a inventario general ✓," or the stepper path reaching `<value> = N` — keeps the checkmark.

- **Corrected 2026-09-10 (`merchant-user-tester` finding, D59 reconciliation-flow test):** the prior template, "[Producto] regresada a inventario general ✓," used a gender/number-agreeing participle (`regresada`) against a Product name whose own grammatical gender/number isn't guaranteed — broke on real catalog entries like "Calcetines" (masc. pl.). Corrected to an invariant finite-verb construction, "Se regresó [Producto] a inventario general ✓," which sidesteps gender entirely (verbs don't inflect for gender) and treats number as deliberately fixed rather than agreed — the same invariant-template principle this section's own stepper confirmation already established one bullet above ("avoiding a singular/plural rewrite of the merchant's own Product name"). Originates from RFC 0009's NFC-only copy, reused unmodified at D59 for manual mode — fixed at both call sites, not just the one D59 touched. A related, still-open latent bug of the identical shape ("[Producto] ya no está disponible," `home.md`'s lost-race ambient message — `disponible` doesn't inflect for gender but does for number) is named, not fixed, here — see `home.md`'s own open items.
- **Neither the one-tap default, "Ajustar cantidad"'s stepper-Confirmar, nor "No regresó" is gated behind a confirmation dialog.** Same reasoning §3.16 already established for "Regresar a inventario general": returning (or confirming a lower/zero amount of) stock is safe and reversible in effect — she can always re-allocate it again later — so this stays in the same low-risk, routine-action class this document already draws a hard line around (contrast Cancelar Evento, §3.12, which is the rare/irreversible class this doc *does* gate behind a confirm step). Confirming a lower-than-expected or zero number doesn't change that classification — it's still a bookkeeping record of what's true, not a destructive commitment.
- **A row that reflects an earlier partial or zero confirm never reads as untouched or as a fresh request for the original full amount.** Two guarantees, not one: (1) the displayed quantity is always the live-recomputed remaining amount — it already shrinks on its own, it is never redisplayed as the original N; (2) whenever this `EventAllocation`'s ledger already carries 1+ prior `return_to_general`-typed, `fifo_assignment`-sourced movement (i.e., she's visited and acted on this row before, whether that confirm released some units or zero), a passive line — "Ya revisaste esto — todavía falta N." — renders above the action buttons, so she never mistakes a shrunk-but-still-outstanding row for a screen that silently forgot her earlier action. This is a plain existence check against the already-written ledger (RFC 0010 §6/§8's `AllocationMovement` rows), not a new computation invented for this copy, and it deliberately states no precise historical split (never "2 of 3 already confirmed") — only that she's reviewed this row before and what remains now, keeping the check cheap and honest without over-claiming precision the ledger wasn't asked to expose here.
- **"Mover a otro evento" is now also offered on a manual/untagged sub-block, reusing §3.24's existing closed-source variant unchanged — same screen, same copy ("Vas a mover N [Producto] que no se vendieron en este evento"), same no-stepper/no-scan/full-amount-only shape already established for NFC.** `N` here is simply this sub-block's own current live-expected quantity. See §10 for the reasoning this is offered at all (RFC 0010 Open Item 4, resolved here). **On a single-pool row (the common case, per the bullet below), the button stays plain "Mover a otro evento" exactly as before — the mode-specific qualifier described next exists only where two pools genuinely coexist on the same row.**
- **A mixed row shows two independent action sets, one per pool, visually grouped apart and never sharing an ambiguous CTA — a deliberate fix, not an oversight (`ux-critic` finding).** An NFC sub-block (unchanged two-button pair) and a manual sub-block (this section's new quantity-confirm pair) each get their own "Mover a otro evento," but on a mixed row specifically, two corrections apply that don't apply to a single-pool row: **(1) a blank line separates the two sub-blocks** — the identical grouping device §3.21's own expanded-row wireframe already establishes between its independent control clusters within one row, not a new convention invented here; **(2) each "Mover a otro evento" button carries a parenthetical mode qualifier — "(de las con tag)" / "(de las sin tag)"** — so the two buttons are never visually or textually identical, closing the mis-tap risk a bare repeated label would otherwise create between two controls that move genuinely different stock. They resolve independently: acting on one sub-block never affects the other, and a row with only one pool outstanding shows only that pool's sub-block, with its plain unqualified button copy (the common case for Ana's actual pilot scale — most Products will have exactly one pool, not both, since NFC is itself a gated capability most Businesses won't have at all; see §11 for the explicitly-deferred combined-move case).
- **Section disappears entirely, reverting to the plain screen above, once every row's every sub-block is resolved** — unchanged from the existing rule, now correctly applying per-pool rather than per-Product where a mixed row exists.
- **OWNER-only, per `product-decisions.md` Q24/Q25's settled permission table** — unchanged.
- **Idempotency.** Every write action in this section — the one-tap default, N=1's "No regresó," and the stepper's `Confirmar` — carries a stable idempotency key, generated once per attempt and reused on retry — the same `architecture-principles.md` #7 discipline this document's other writes (§3.9, §3.23) already require, now explicitly extended to this write per RFC 0010 §8's own bullet.
- **Saving/error/ambient-confirmation shape reuses §3.23 verbatim** — "Guardando…" / "No se pudo guardar. Tus cambios siguen aquí, intenta de nuevo. [ Reintentar ]" / the ambient-fade confirmations named above. No new save-state pattern invented for this action.

**NFC-mode reconciliation — a deliberate departure from the live-allocation scan requirement, reasoned explicitly. (Unchanged, retitled to make explicit this reasoning is NFC-specific, not shared with manual mode's own reasoning below.)** Neither "Regresar a inventario general" nor "Mover a otro evento," on an NFC-tagged row, ever asks for a fresh scan. Live allocation (§3.21/§3.22) requires a scan because, at that moment, the system doesn't yet know which specific tagged garments she's actually picking up — the scan *establishes* that fact. By the time an Event closes, the exact set of unsold tagged units is already fully and unambiguously known, and the exclusivity invariant guarantees nothing else could have touched those specific units meanwhile — reconciliation is a bookkeeping update to an already-true record, not a new claim of physical possession. Requiring a re-scan here would violate `global-principles.md`'s "never ask twice" and would actively work against her, since reconciliation typically happens after the fact, possibly with the garments not all gathered in one place.

**Manual-mode reconciliation — a genuinely different reasoning, not the same argument applied twice (RFC 0010 §7/§8, Product-Owner-confirmed 2026-09-09).** Unlike NFC, the system never verified *which specific physical units* remained out — only that some *quantity* did (§7's logical vs. physical identity invariant: a `fifo_assignment`-sourced unit never carried a verified physical claim in the first place). This is why manual reconciliation is not, and never could be, a bare unconfirmed tap the way NFC's is: there is a real fact to collect (how much actually came back) that the system genuinely does not already know, and asking for it is not "asking twice" — it's asking once, for the first time, at the one moment reconciliation actually happens. What stays identical to NFC's own posture is *that* an explicit action is required at all, never silently assumed, and that the happy path (everything came back) costs exactly one tap regardless.
- **Corrected per Architect's resolution of Q7** (`product/02-ux/architect-questions.md`,
  Resolved): `information-architecture.md`'s nav table already assigns
  "Session/Event summaries" to Resultados; Eventos' own stated job is
  "scheduled/active/past Events, drills into their Sessions" — status and
  navigation, not aggregated analytics. The original draft's totals + full
  per-day breakdown here duplicated scope the frozen IA already assigns
  elsewhere. Corrected to passive identity (Venue name, type, dates) + a
  single hand-off action. No per-day rows — those belong to Resultados once
  that doc is designed.
- **Remediation (EVT-M3): the one-line ambient summary is carried through
  from the list, not re-derived.** Q7's resolution explicitly permits
  Eventos to show "a thin, ambient, in-progress indicator" as part of its
  own navigation/status role — the same allowance already exercised
  elsewhere in this doc (Pasados list card's one-line summary, §3.4; §3.14's
  ambient Día row for an active Event). Dropping it here, between a list
  card that says "$2,340" and a detail screen with no number at all, was a
  real discontinuity: Ana taps through on a number she just saw and it
  vanishes, then has to leave the tab entirely to see it again. The fix is
  not new content — it's the exact same "N días · M ventas · $X" line
  already computed for §3.4, displayed here too. This is still identity +
  one ambient line + hand-off, not the day-by-day breakdown Q7 rules out —
  no per-Día rows, no breakdown table, nothing beyond the single line.
- Q7's original correction removed the over-scoped "días trabajados"
  headline + full per-day breakdown that the initial draft invented here —
  that removal stands. What's restored by this remediation (EVT-M3) is not
  that headline; it's the exact same thin one-line summary already shown on
  the Pasados list card (§3.4), reused verbatim, not recomputed with new
  logic or new prominence. Its "N días" component still carries the same Q1
  (Día N counting) dependency the list card already carries — this doc
  doesn't invent a second, independent exposure of Q1, it surfaces the
  identical fact one screen later. Resultados still owns the full
  day-by-day breakdown and will need to account for Q1 there, per Q7's
  resolution.
- **Headline is `Venue.displayName` ("Plaza Metepec")** — same slot the
  former Nombre ("Bazar Metepec") occupied.
- **"Costo" shown per §3.11's rule; "Ajustar precios" is deliberately not
  offered here.** Once an Event has closed, every Sale that will ever
  belong to it has already resolved and stored its own `pricePaid`
  (`decision-log.md` D33); an override edited after the fact would change
  nothing about history already written and could only mislead her.
  Contrast with §3.11, the only Event detail state where prices are still
  open to adjustment — by the time an Event is `active` (§3.14/§3.15) its
  Price Overrides are already finalized, well before it ever reaches this
  closed state.

### 3.17 Event detail — closed/past, zero Sessions (never attended)
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Metepec                    │
│  Bazar · 5-7 de julio               │
│  Costo: $2,500                     │  passive info, only shown if set
│                                │
│  No registraste ventas en         │
│  este evento.                    │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Plain, factual, no guilt-tripping copy ("te lo perdiste," etc.) — an Event
  can close with zero Sessions (she changed her mind, it got rained out, she
  simply never went) and this is a normal, non-judgmental outcome, not a
  broken 0/0 display. Brand tone: never frame her own workflow as a failure.
- No "Ver resumen en Resultados" CTA — nothing to view.
- Its list-level counterpart (§3.4/§3.5's "Sin ventas registradas" card,
  EVT-M2) uses the same non-judgmental register, so Ana never encounters a
  broken-looking count on the way to this already-graceful screen.
- **"Ajustar precios" absent here, same reasoning as §3.16.**

### 3.18 Defensive fallback / load error
```
┌───────────────────────────────┐
│  No pudimos cargar tus           │
│  eventos. Intenta de nuevo.       │
│      [   Reintentar   ]          │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Nav bar stays fully functional here, same as `home.md` §3.14 — a failure to
  load Eventos never cascades into blocking Hoy/Inventario/Resultados, and
  critically, never blocks selling. The retry mechanism itself is
  deliberately *not* the same as Home's: this is a manual `Reintentar` tap
  (matching Inventario's own error convention, `inventory.md` §3.18), not
  Home's silent automatic retry — Eventos carries no live-customer risk that
  would justify Home's more aggressive, invisible retry behavior.

### 3.19 Ajustar precios — lista por producto (`decision-log.md` D33)
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │
│  Precios para este evento          │
│  Cada producto usa su precio        │
│  normal salvo que lo ajustes        │
│  aquí.                            │
│  ┌───────────────────────────┐ │
│  │ Bolsas                $350   │ │  tappable → 3.20
│  │ Accesorios           $180   │ │
│  │ Playeras              $280   │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Reached by tapping "Ajustar precios" on Event detail — reachable only
  while the Event is still `scheduled` (§3.11); the action doesn't exist
  on any other Event detail state (§3.14/§3.15/§3.16/§3.17). Directly
  applies D33's explicit UX note: she "only edits the groups she
  actually wants to adjust for that event, never a forced review of all
  of them."
- **One row per Catalog Product she's ever registered** (`inventory.md`'s
  Catalog, same source, reused not re-derived) — not only Products
  currently in stock, since a Price Override is about what she'd charge
  if she sells this Product at this Event, independent of that day's
  stock.
- **Every row is pre-filled from that Product's `Product.defaultPrice`**
  — this list is never blank, and no row is required to be touched:
  leaving every row untouched is a fully valid, complete visit, since
  Price Override is optional, per-Product, 0..N per Event
  (`decision-log.md` D33).
- Row shape reuses `inventory.md`'s own Catalog-row list (§3.4) — the
  closest existing precedent for "a list of every Product with one fact
  each" — rather than inventing a new list treatment.
- Tapping a row opens the price-edit sheet (§3.20), reusing the same
  shape `inventory.md` §3.4a already established.
- **Flagged as the one piece of this remediation with no close existing
  precedent.** No prior screen in this document family lists *every*
  Catalog Product pre-populated from a value owned by a different
  aggregate. The design composes two already-established patterns (the
  Catalog-row list, the price-edit sheet) rather than inventing a new
  interaction primitive.

**Zero-Catalog-Product variant** — if she taps "Ajustar precios" having
registered no Products at all yet in Inventario:
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │
│  Precios para este evento          │
│  Todavía no registraste ningún      │
│  producto. Registra mercancía en    │
│  Inventario para poder ajustar      │
│  precios aquí.                    │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Plain, factual, same non-judgmental register this document already
  established for its other zero-data states (§3.17's "No registraste
  ventas en este evento," §3.4/§3.5's "Sin ventas registradas" card,
  EVT-M2 remediation) — not a broken or empty-looking list, simply the
  honest state of a Business that hasn't registered any merchandise yet.
- No direct link into Inventario designed here — a plain factual message
  is sufficient at this fidelity. Ajustar precios stays reachable
  regardless (she's still one nav-bar tap from Inventario herself); this
  document doesn't invent a cross-tab deep-link affordance it hasn't
  designed anywhere else.

### 3.20 Editar precio para este evento — sheet (`decision-log.md` D33)
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │  dimmed, visible underneath
│  Bolsas                          │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Precio normal: $350               │
│  Precio para este evento           │
│   [ $350 ]                       │
│  [ Cancelar ]  [ Guardar precio ]  │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Identical shape to `inventory.md` §3.4a's Catalog-row price-edit sheet,
  with one deliberate difference in what it writes: this sheet writes an
  Event-scoped **Price Override** (`decision-log.md` D33 — "an
  internal-only entity owned by Event... a `(productId, overridePrice)`
  pair"), never `Product.defaultPrice` itself. "Precio normal: $350" is
  read-only context — the Product's own `defaultPrice`, unaffected by
  anything typed here — shown directly above the editable field so she
  always knows what she's adjusting away from.
- **"Guardar precio" writes only this one Product's Price Override for
  this one Event** — every other row on §3.19's list stays exactly as it
  was. This is the concrete mechanism behind D33's "she only edits the
  groups she wants to adjust" — nothing here asks her to confirm or
  dismiss the rows she skipped.
- Returning to §3.19, the edited row shows the override value in place of
  the default.
- "Cancelar" discards the edit, returns to §3.19 unchanged.
- **A cleared/emptied field is not a valid save** — "Guardar precio"
  stays disabled, matching Cantidad's own floor logic (`inventory.md`
  §3.6). No affordance here to explicitly revert a row back to the
  default by blanking it — see §11.
- Same near-instant/slow/error save convention as every other write in
  this document (§3.9) — not restated here.
- **Not a discount, haggling, or point-of-sale mechanism.** Set once,
  only during Event-planning time — while the Event is still `scheduled`
  (§3.11) — never live during a Sale, and no longer reachable at all
  once the Event is `active` (§3.14/§3.15's own annotation, §10). Ana
  never sees a price field anywhere inside the selling flow itself
  (`home.md` §3.9/§3.10). `decision-log.md` D33 explicitly rules out
  point-of-sale override/haggling and promotions/discount pricing — this
  screen is not, and must never become, that mechanism.

### 3.21 Mercancía para este evento — lista por producto (new, shared: "Llevar mercancía" / "Ver mercancía de este evento" — `product-decisions.md` Q24/Q25)

**Default (all-collapsed) state:**
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │
│  Mercancía para este evento        │
│  Elige cuánto llevas de cada        │
│  producto. Lo que no asignes se     │
│  queda disponible para tus otros    │
│  eventos.                        │
│  ┌───────────────────────────┐ │
│  │ Bolsas — 7 para este evento  ▾│ │  collapsed — tap to expand
│  ├───────────────────────────┤ │
│  │ Accesorios — nada para este  ▾│ │  collapsed, nothing allocated yet
│  │ evento todavía                │ │
│  └───────────────────────────┘ │
│      [    Guardar cambios    ]   │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**Expanded state (Bolsas tapped — every other row stays collapsed):**
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │
│  Mercancía para este evento        │
│  ┌───────────────────────────┐ │
│  │ Bolsas — 7 para este evento  ▴│ │  expanded — tap to collapse
│  │ Disponible en general: 8       │ │
│  │ sin tag · 4 con tag            │ │
│  │                             │ │
│  │ Cantidad sin tag               │ │
│  │  [ − ]  [ 5 ]  [ + ]           │ │
│  │  (o escribe la cantidad)       │ │
│  │                             │ │
│  │ [ Escanear las que te llevas ] │ │
│  │  2 escaneadas                  │ │
│  │                             │ │
│  │ [ Mover a otro evento ]        │ │
│  ├───────────────────────────┤ │
│  │ Accesorios — nada para este  ▾│ │  collapsed, unaffected
│  │ evento todavía                │ │
│  └───────────────────────────┘ │
│      [    Guardar cambios    ]   │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**Zero-Catalog-Products variant** (consistent with §3.19's own empty-state register):
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │
│  Mercancía para este evento        │
│  Todavía no registraste ningún      │
│  producto. Registra mercancía en    │
│  Inventario para poder llevar       │
│  mercancía a este evento.           │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

- **Two entry points, one screen — a deliberate, real divergence from "Ajustar precios."** "Llevar mercancía" (§3.11, `scheduled`) and "Ver mercancía de este evento" (§3.14/§3.15, `active`) both land here, unchanged between them. This is a shared state per `product/02-ux/CLAUDE.md` §4's own rule (reference by canonical ID at every entry point, not restated). **Contrast with "Ajustar precios" (§3.19/§3.20), which is strictly `scheduled`-only and disappears entirely once an Event goes `active`:** Price Override is finalized-then-frozen, a one-time planning decision with no reason to revisit once selling starts. Allocation is the opposite — replenishing a Product that's running low, reallocating to a simultaneously-running Event, are things that specifically *only* make sense once selling is underway (`product-decisions.md` Q24/Q25's own lifecycle: "concurrent Sales consume against it → replenish() any number of times → reallocate(toEventId)"). Keeping this screen reachable throughout the Event's whole open life, unlike Price Override, is the correct application of the same underlying rule (D33's "finalized before activation, fixed for the duration"), not an exception to it — the two capabilities simply have opposite lifecycles by their own nature.
- **One row per Catalog Product she's ever registered** — same source, same reasoning as §3.19 ("what she'd charge/bring... independent of that day's stock" for pricing; here, independent of whether she's decided to bring it at all).
- **"Disponible en general" = Business-wide total minus whatever's allocated to every *other* open `EventAllocation`** — deliberately *includes* what's already allocated to *this* Event, since that stock is already hers to freely reassign within this screen, not "elsewhere." This is what makes the manual stepper's ceiling exactly equal to the displayed "Disponible en general" figure — no separate, unexplained cap.
- **The "sin tag · con tag" split only renders when this Business has NFC capability *and* this specific Product has ≥1 available tagged unit** — otherwise a single plain "Disponible en general: N" figure, identical to `inventory.md` §3.4's own Catalog-row language, and the row shows only the manual stepper (no scan affordance at all). Reuses the exact "tienen tag" plain-language register `home.md` §3.6a already established for surfacing NFC state to Ana — never "NFCTag," "reserved," or "allocatedUnitIds."
- **Manual and NFC-scan input compose on the same row rather than forcing a choice** (`product-decisions.md` Q24/Q25: "a Product can have both simultaneously... the same mixed state NFC Readiness already models elsewhere"). This reuses the same disambiguation principle `inventory.md` §3.4's Catalog row already established for its own three independent, non-overlapping tap zones (marker/body/price) — two independently-operable affordances on one row here, each targeting its own distinct pool (manual → untagged units, scan → tagged units), never resolving ambiguously between them.
- **Manual quantity stepper — reuses `inventory.md` §3.6's Cantidad stepper shape (`[−]`/`[+]`/typed entry via `teclado numérico`) with one deliberate difference: floor is 0, not 1.** Cantidad's floor-of-1 exists because "0 units received" isn't a real receiving event; here, "0 units allocated to this Event" *is* a real, valid decision (she may simply choose not to bring a Product at all) — the two fields share a shape, not an identical business meaning. Ceiling = the row's own "Disponible en general" figure; `[+]` goes inert at the ceiling (symmetric to Cantidad's own inert-at-floor `[−]` behavior), and typing past it clamps to the ceiling with a one-line inline message ("Solo tienes N disponibles.") rather than a rejected/blocked keystroke.
- **A successful scan is a live, immediate write — reserves that specific unit to this Event's allocation the instant it's read, exactly like `inventory.md` §3.14's Asignar Tags convention ("no per-unit confirmation tap").** It is *not* staged behind "Guardar cambios." "Para este evento" and the "con tag" figure update immediately on each successful scan; "Disponible en general" decrements live in step, keeping the manual stepper's ceiling honest without her computing anything.
- **Every row starts collapsed to a one-line summary ("Producto — N para este evento," or "nada para este evento todavía" at zero); tapping a row's summary expands it in place to the full control set, collapsing whichever other row was previously expanded — only one row expanded at a time.** Adapted from, not identical to, Registrar Mercancía's own collapsed-row shape (`inventory.md` §3.7's "Bolsas — 10 [✕]" committed lines) — reused for the same reason (this screen shows up to one row per Catalog Product, unbounded, on a screen reached repeatedly per Event, so showing every row's full ~8 facts/controls simultaneously doesn't scale). **The underlying mechanic differs, stated honestly rather than asserted as identical (correcting the previous version of this bullet, which claimed an exact match that wasn't there):** Registrar Mercancía is a *sequential-add* flow — she picks a Product from a picker and commits each new line one at a time via "+ Agregar otro producto." This screen has no add step at all — every Catalog Product already has a row, always, whether or not she's allocated anything to it. Collapsing/expanding a row here is a pure display toggle, never a commit: a staged manual quantity persists in memory whether its row is shown expanded or collapsed, and "Guardar cambios" commits every row's staged manual quantity across the whole screen regardless of which single row happens to be expanded at the moment she taps it — unlike Registrar Mercancía, where committing one line is what makes room to start the next.
- **The collapsed summary line reflects the current live total** — already-committed scans plus any staged-but-unsaved manual edit — never hidden from her just because the row is collapsed; the "sin tag · con tag" breakdown is shown only once expanded, a legitimate simplification for the summary line, not a different figure.
- **"Guardar cambios" commits only the manual (staged) quantities.** Leaving this screen before tapping it discards only the unsaved manual edits (already-scanned units stay committed) — a deliberate choice for internal consistency with this document's own precedent (§10: "Nuevo Evento's draft is not auto-preserved across interruption"), not imported from Inventario's different draft-preservation posture.
- **Whichever of `initial_allocation` / `replenish` / `adjustment` movement type actually applies is resolved entirely from current state, invisibly** (`product-decisions.md` Q24/Q25's `AllocationMovement` enum) — she only ever sees "Para este evento" go up or down; she never picks or is told which underlying movement type wrote.
- **"Mover a otro evento" only appears on a row once "Para este evento" > 0** (nothing to move otherwise) — opens §3.24, live variant, scoped to that one Product.
- Same near-instant/slow/error save convention as every other write in this doc (§3.9), detailed in new §3.23.
- **OWNER-only**, per `product-decisions.md` Q24/Q25's settled permission table — the SELLER-role experience isn't designed here (§8).

### 3.22 Escaneando — cola de escaneo (por Producto) (new — `product-decisions.md` Q24/Q25)

```
┌───────────────────────────────┐
│ ← Mercancía para este evento     │
│  Escaneando: Bolsas               │
│  Ya escaneadas: 2                 │
│  Disponibles con tag: 4            │
│                                │
│      Acerca el tag de la          │
│      prenda que te llevas          │
│                                │
│  [ Terminar ]                    │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**Error — prenda ya asignada a otro evento** (the physical-location-exclusivity invariant, made visible):
```
┌───────────────────────────────┐
│ ← Mercancía para este evento     │
│  Escaneando: Bolsas               │
│  Esta prenda ya está en otro       │
│  evento. Usa otra.               │
│  Ya escaneadas: 2                 │
│  Disponibles con tag: 4            │
│      Acerca el tag de la          │
│      prenda que te llevas          │
│  [ Terminar ]                    │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**Error — no se pudo leer:**
```
┌───────────────────────────────┐
│ ← Mercancía para este evento     │
│  Escaneando: Bolsas               │
│  No se pudo leer el tag.          │
│  Acércalo de nuevo.               │
│  Ya escaneadas: 2                 │
│  Disponibles con tag: 4            │
│      Acerca el tag de la          │
│      prenda que te llevas          │
│  [ Terminar ]                    │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

- Reached from §3.21's "Escanear las que te llevas." Reuses `inventory.md` §3.14/§3.15/§3.16's Asignar Tags shape and error register verbatim, not reinvented — same physical gesture, same failure classes (business-logic conflict vs. genuine read failure), same "business language before technical language" discipline (no UID, no "reserved," no "conflict").
- **The "ya está en otro evento" error is the direct UI surface of `product-decisions.md` Q24/Q25's exclusivity invariant** ("a unit ID may appear in at most one `open` `EventAllocation.allocatedUnitIds` at a time, enforced via `InventoryUnit`'s existing `available→reserved` conditional write") — this is what makes the error possible at all: she physically tries to take a garment that's already committed elsewhere, and the system tells her plainly rather than silently double-booking it.
- "Terminar" returns to §3.21; every scanned-so-far unit stays committed (§3.21's own annotation) — a failing tag never traps her or discards prior progress, same guarantee `inventory.md` §3.16 already gives.

### 3.23 Guardando cambios de mercancía — saving / error (new — bulk manual commit, `product-decisions.md` Q24/Q25)

```
┌───────────────────────────────┐   ┌───────────────────────────────┐
│                                │   │        Guardando…              │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │   │                                │
├───────────────────────────────┤   ├───────────────────────────────┤
│ Hoy Inventario [Eventos] Resultados│ Hoy Inventario [Eventos] Resultados│
└───────────────────────────────┘   └───────────────────────────────┘

┌───────────────────────────────┐
│  No se pudo guardar. Tus         │
│  cambios siguen aquí, intenta     │
│  de nuevo.                       │
│      [   Reintentar   ]          │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

Ambient post-save (stays on §3.21 — no forced navigation, matching §3.10/§3.13's ambient-confirmation posture):
```
Mercancía actualizada ✓   (ambient, fades)
```
- Identical failure guarantee to §3.9 — a failed save never drops her typed quantities. This write carries a stable idempotency key per `architecture-principles.md` #7, since "Reintentar" is a client-initiated retry on a write with real merchant-facing consequence.

### 3.24 Mover a otro evento (new — `product-decisions.md` Q24/Q25)

**Live variant (from §3.21 or an active-Event context — partial quantities expected):**
```
┌───────────────────────────────┐
│ ← Mercancía para este evento     │  dimmed, visible underneath
│  Mover Bolsas a otro evento        │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  A qué evento                    │
│   [ Elegir evento ▾ ]             │
│                                │
│  Cuánto llevas                   │
│   [ − ]  [ 0 ]  [ + ]             │
│   (o escribe la cantidad)         │
│  Tienes 5 disponibles aquí         │
│  para mover.                     │
│                                │
│  [ Escanear las que te llevas ]   │  only if this Product has
│  0 escaneadas                     │  tagged units allocated here
│                                │
│  [ Cancelar ]  [ Mover mercancía ] │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**Destination picker sub-sheet ("Elegir evento"):**
```
┌───────────────────────────────┐
│ ← Mover Bolsas a otro evento      │  dimmed
│  ¿A qué evento la llevas?         │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Plaza Toluca · Expo · empieza en 5 días │
│  Ixtapan · Bazar · Día 1 de 3       │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
Zero-other-Events: `No tienes otro evento programado o activo todavía.` — plain, no CTA designed, same restraint as §3.19's own zero-Catalog-Product state.

**Closed-source variant (reconciliation entry, §3.25/§3.16 — no scan step, fixed full-remaining amount):**
```
┌───────────────────────────────┐
│ ← Plaza Metepec                  │  dimmed
│  Mover Bolsas que no se           │
│  vendieron                       │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  A qué evento                    │
│   [ Elegir evento ▾ ]             │
│                                │
│  Vas a mover 3 Bolsas que no       │
│  se vendieron en este evento.      │
│                                │
│  [ Cancelar ]  [ Mover mercancía ] │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

Saving/error/ambient confirmation for either variant — identical shape to §3.23, worded for this action:
```
No se pudo mover. Tu mercancía sigue en [Venue origen], intenta de nuevo.
                                                    [Reintentar]

Mercancía movida ✓   (ambient, fades, returns to the screen she came from)
```

- **Destination picker lists only this Business's other `scheduled`/`active` Events, never the current one and never a create-inline option** — reuses §3.7/`inventory.md` §3.8's picker shape minus the create-new branch, since there's nothing to create here (she'd Agendar Evento first, separately, then return).
- **"Tienes N disponibles aquí para mover" — the same honest-ceiling rule as §3.21's manual stepper, applied to "currently remaining at the source" instead of "disponible en general."** One rule, two screens, not two separately-invented ceiling concepts.
- **The underlying two-write mechanism is entirely invisible to Ana.** `product-decisions.md` Q24/Q25's finalized design ("a single local DB transaction spanning both `EventAllocation` rows... one commit") is what "Mover mercancía" actually performs — one save state (§3.23's shape, reused), one confirmation, no intermediate "step 1 of 2" ever shown. If it fails, nothing has moved (the error copy says exactly that) — she retries the same single action, not a resume-from-halfway state.
- **Live variant: partial quantities are the expected case** (she's not closing anything — the source Event may keep selling against what's left) — editable stepper/scan input, defaulting to 0.
- **Closed-source variant (reconciliation): no stepper, no scan input, a fixed, pre-stated full-remaining amount.** This follows directly from `product-decisions.md` Q24/Q25's own framing — `return_to_general` *or* `reallocate_out` is "what actually closes the allocation," language that describes fully resolving the row, not partially splitting it. A partial split at reconciliation time (move some, return the rest of the same Product) is a real but narrower case, explicitly deferred, not designed here — see §11.
- **Closed-source variant omits scanning entirely — see §3.16's reconciliation annotation for the full reasoning.**
- **Reused verbatim for manual/untagged reconciliation rows (§3.16, 2026-09-09 amendment) — no new variant.** "Vas a mover N [Producto] que no se vendieron en este evento" already describes a full-remaining-amount move without naming a source mode; a manual sub-block's "Mover a otro evento" lands here identically, with `N` resolved from that sub-block's own live-expected quantity instead of NFC's known `allocatedUnitIds` count. The underlying write composes `releaseAllocation()`'s selection (most-recently-committed-first, `fifo_assignment`-only) with this same single-transaction reallocation mechanism, invisibly — she never sees which specific units moved, for either mode.
- **This screen's own heading/copy stays pool-agnostic by design, even on a mixed row (§3.16) where both an NFC and a manual sub-block exist.** Disambiguation between the two pools happens one tap earlier, at the row itself — each sub-block's own "Mover a otro evento" button carries its own mode qualifier ("(de las con tag)" / "(de las sin tag)", §3.16's mixed-row amendment) precisely so a mis-tap can't happen in the first place, rather than asking her to catch it here after the fact. `N` on this screen is already scoped correctly to whichever single pool's button she tapped — there's never a genuine ambiguity left to resolve by the time she reaches this screen.
- **OWNER-only**, per `product-decisions.md` Q24/Q25's settled permission table.

### 3.26 Personal para este evento — lista de personal (new — `product/99-rfc/0011-event-assignment.md`, shared: "Asignar personal" / "Ver personal de este evento")

**Resolving (near-instant / slow) — same convention as every other read in this document (§3.1/§3.2):**
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│ ← Plaza Norte                    │        │ ← Plaza Norte                    │
│  Personal para este evento         │        │  Personal para este evento         │
│  ▢▢▢▢▢▢▢▢▢▢▢▢                      │        │  Un momento…                     │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```

**Default state (1+ active SELLER Membership exists, some assigned, some not, no scheduling conflict on any row):**
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │
│  Personal para este evento         │
│  Elige quién más va a vender en     │
│  este evento — tú siempre puedes    │
│  vender aquí, sin asignarte.       │
│  Cualquiera puede estar asignada    │
│  a más de un evento a la vez.       │
│                                │
│  Asignadas                      │
│  ┌───────────────────────────┐ │
│  │ 55 1234 5678                  │ │
│  │ Vendiendo en este evento        │ │
│  │ [ Quitar ]                    │ │
│  └───────────────────────────┘ │
│                                │
│  Sin asignar                    │
│  ┌───────────────────────────┐ │
│  │ 55 8765 4321                  │ │
│  │ [ Asignar ]                   │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**Row with a scheduling conflict — computed live, on every render, for every row, whether it's already Asignada or still Sin asignar (corrected 2026-09-10, EVT-M4 remediation — the direct UI surface of RFC 0011's warn-with-override rule, moved to this pre-tap placement from the original post-tap-only design):**
```
│  Asignadas                      │
│  ┌───────────────────────────┐ │
│  │ 55 1234 5678                  │ │
│  │ Vendiendo en este evento        │ │
│  │ También va a vender en          │ │
│  │ Plaza Metepec (5-7 jul), que     │ │
│  │ se cruza con estas fechas.       │ │
│  │ [ Quitar ]                    │ │
│  └───────────────────────────┘ │
│                                │
│  Sin asignar                    │
│  ┌───────────────────────────┐ │
│  │ 55 9999 0000                  │ │
│  │ También va a vender en          │ │
│  │ Plaza Toluca (8-9 jul), que      │ │
│  │ se cruza con estas fechas.       │ │
│  │ [ Asignar ]                   │ │
│  └───────────────────────────┘ │
```
(Two or more conflicting Events, either group: "También va a vender en Plaza Metepec (5-7 jul) y Plaza Toluca (8-9 jul), que se cruzan con estas fechas." — correct plural verb, both named.)

**Zero active SELLER Memberships, and no pending Invitation either — genuinely never invited anyone (adapts, not copies verbatim, `settings.md` §3.11's own empty-state framing):**
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │
│  Personal para este evento         │
│  Todavía no tienes a nadie en       │
│  tu equipo. Invita a alguien de     │
│  tu confianza desde                │
│  Configuración, luego regresa       │
│  aquí para asignarla a este         │
│  evento.                          │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

**Zero active SELLER Memberships, 1+ pending Invitation — invited, still waiting on acceptance (new, corrected 2026-09-10, EVT-M5 remediation):**
```
┌───────────────────────────────┐
│ ← Plaza Norte                    │
│  Personal para este evento         │
│  Ya invitaste a alguien, pero      │
│  todavía no acepta la invitación.  │
│  En cuanto acepte, va a aparecer    │
│  aquí para que la asignes a este    │
│  evento.                          │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

- **New screen — the OWNER-side half of `product/99-rfc/0011-event-assignment.md`.** The SELLER-side consumption (a SELLER's Session-open Event picker narrowing to only the Events she's assigned to) was already designed separately, `home.md` §2/§3.6b — this screen is where the `EventAssignment` rows that filter feed actually get created and removed.
- **One row per active `BusinessMembership` with `role = SELLER`** — the exact same roster `settings.md` §2.7/§3.11 ("Tu equipo") already maintains, read here rather than duplicated. **Only `active`-status Memberships are ever shown or selectable** — a pending Invitation has no `BusinessMembership` yet to assign, and a revoked one has already lost standing to sell at all; neither belongs on a screen about staffing a specific Event. **This is a deliberate narrowing from Tu equipo's own fuller three-state roster (active/pending/revoked), not an oversight** — Tu equipo's job is tracking the whole invite/membership lifecycle; this screen's job is narrower (who's working this one Event), and a row with no possible action attached would be pure clutter here. Gated on `BusinessMembership.status = active`, per `decision-log.md` D60/RFC 0011 Open Item 4 — resolved directly from the same Membership authorization-gate precedent already governing every other Membership-gated action in this Foundation (D55/D56).
- **No display-name field exists on `User` yet** (`ubiquitous-language.md`, the same named gap `settings.md` §2.7 already flags) — rows identify by phone number, not name, the identical real usability cost Tu equipo already carries, not solved a second time here.
- **Row order: "Asignadas" group first, then "Sin asignar," each ordered by `BusinessMembership.createdAt`** — deterministic, never Ana-sorted, matching Tu equipo's own active-first grouping discipline (`settings.md` §3.11) and this document's own "every repeated decision should become automation" posture (§9).
- **Section headers render only when they have ≥1 row** — the identical rule this document's own Events list already applies to Activo/Próximos/Pasados (§3.4) — a Business with everyone already assigned never shows an empty "Sin asignar" label, and vice versa.
- **The OWNER herself never appears on this list, and this screen states why directly rather than leaving her to wonder** — RFC 0011's own §0 confirms an OWNER's own Event-picking has never required assignment and this RFC introduces no such gate for her; the intro line's "tú siempre puedes vender aquí, sin asignarte" makes that explicit rather than implicit, a small, deliberate cost against "the fastest interaction is the one that never happens" justified by the real, first-time confusion a silent omission would otherwise cause (her own name genuinely missing from a new "who works here" list, with nothing on screen explaining why).
- **"Asignar" and "Quitar" are both single, un-confirmed taps — no confirmation dialog, for either direction.** A deliberate departure from `settings.md` §3.13's "Quitar a alguien" (which *is* gated behind a confirmation) — different stakes, not an inconsistency: Tu equipo's "Quitar" permanently revokes a person's ability to sell anywhere in the Business until re-invited; this screen's "Quitar" only removes her from one Event's roster, trivially reversible in one more tap ("Asignar" again), the same low-risk/easily-undone class this document already reserves single-tap treatment for (e.g. "Regresar a inventario general," §3.16) — reserving a confirmation dialog for genuinely rare, hard-to-notice, effectively-irreversible actions (§3.12's "Cancelar evento" remains the actual bar for that).
- **Assigning and un-assigning both save immediately — no "Guardar cambios" batch step exists on this screen**, unlike §3.21's manual-quantity stepper: a toggle has nothing to stage or reconsider mid-edit the way a typed quantity does, so committing it the instant she taps is both the fastest and the most honest representation of what she just decided. **This directly enables assigning multiple people to one Event in a single visit** — each row's tap is independent, so she taps as many rows as she wants, in any order, each one landing immediately; there is no artificial one-at-a-time flow to work around. **The mirror case — one person assigned to multiple Events — needs no special mechanism either**: this screen is scoped per-Event, so assigning the same person to a second Event is simply a second, independent visit to that other Event's own instance of this same screen.
- **Save/error convention reuses this document's own established near-instant/slow/error shape (§3.9), applied per-row rather than per-screen** — the tapped row dims briefly (near-instant) or shows "Guardando…" in place of its action button (slow); a failed save shows inline, beneath that row, "No pudimos asignar a esta persona. Intenta de nuevo." (or "No pudimos quitarla de este evento. Intenta de nuevo." for the reverse direction) with `[ Reintentar ]`, and never drops her tap or silently reverts the row. Every assign/unassign write carries a stable idempotency key (`architecture-principles.md` #7) — a retried "Reintentar" never double-creates or double-removes the same `EventAssignment` row, the identical guarantee already required of every other write in this document. **On success, the row also briefly stays visually distinguished for a moment as it settles into its new group (EVT-MIN1, `ux-critic` finding) — a light, optional mitigation for the narrow risk that a mis-tap on the wrong "Quitar"/"Asignar" in a stacked, phone-number-only list (§11) could otherwise go unnoticed.** Fully recoverable regardless (one more tap); this just makes the change easier to notice in the moment, at effectively no cost.
- **The scheduling-conflict warning (RFC 0011's own Open Item 3, designed here) is computed live, on every render of this screen, for every row — Asignada or Sin asignar alike — and shown before she ever taps "Asignar," not only after (corrected 2026-09-10, EVT-M4 remediation).** The check is a pure read against this Membership's other existing `EventAssignment` rows and their Events' date ranges — a fact entirely independent of whether she's assigned this Membership to *this* Event yet, so nothing about it requires waiting for a tap to compute or reveal. This is the same ambient, pre-commit placement `home.md` §3.6a already established for its own directly comparable Limited Ready recommendation — shown *before* its own commit-equivalent tap specifically so the merchant can make an informed choice before committing, a prior defect there (HOME2-MAJ2) having been fixed specifically to keep that signal pre-tap, not post-tap. RFC 0011 exists to help the OWNER make a good staffing judgment call, and a post-tap-only warning undermined exactly that: she can now scan every "Sin asignar" candidate and see at a glance who's already committed elsewhere, before deciding who to assign — not reconstruct that picture through an assign/read/unassign cycle per candidate. Tapping "Asignar" still saves unconditionally, exactly as before — the write itself never blocks, and the conflict line doesn't change or gate that tap; it's simply already visible on the row before she reaches it, and stays visible, unchanged, once the row moves groups. **This is still the deliberate reading of RFC 0011's own "the assigning OWNER may override" language**: there is nothing to explicitly override, because nothing was ever blocked — the one-tap "Quitar" already sitting on an Asignada row remains the entire override mechanism, should she reconsider after assigning anyway.
- **Conflict copy names every conflicting Event by `Venue.displayName` and date range, joined with "y" when more than one, with the correct singular/plural verb ("se cruza" for one, "se cruzan" for two or more)** — the identical naming-the-specific-conflict discipline this document's own retired D17 overlap-warning already established (`events.changelog.md#status-2026-09-06-d53-overlap-validation-retired`), reused here rather than a generic "hay un conflicto de fechas" that would force her to go hunting for which one. Recomputed live on every render — never a stored flag that could drift from the actual current set of that Membership's other assignments.
- **No ambient "✓" toast on either action** — a deliberate divergence from §3.16/§3.23's own ambient-confirmation convention, reasoned explicitly: this screen's closer structural precedent is Tu equipo (`settings.md` §3.11-§3.13), a standing, always-re-checkable roster whose own row state *is* the confirmation (compare "Vendiendo contigo"/"Ya no vende contigo," neither paired with a fading toast), not §3.16/§3.23's ephemeral action-confirmation flow. The row updating in place, from "Sin asignar" to "Vendiendo en este evento" (or back), is itself the acknowledgment.
- **Two distinct zero-states now exist, both without settings.md's own tappable "[ Invitar a alguien ]" CTA** — that button would require a cross-tab deep-link into Configuración this document has never designed anywhere else, the same restraint §3.19/§3.21 already apply to their own zero-Catalog-Product states ("no direct link into Inventario designed here"); she's still one nav-bar tap from Configuración herself, either way. **Never-invited (zero active Memberships, zero pending Invitations)** adapts, not copies verbatim, `settings.md` §3.11's own empty framing ("todavía no tienes a nadie... invita a alguien de tu confianza"). **Invitation-pending (zero active Memberships, 1+ pending Invitation) is new (corrected 2026-09-10, EVT-M5 remediation, `ux-critic` finding)** — this document's own zero-state previously queried active Memberships only, so a merchant who followed its own "invita a alguien... luego regresa aquí" instruction landed back on the identical "todavía no tienes a nadie" copy, contradicting what she'd just done. The corrected query also checks `Invitation.status = pending` (the same fact `settings.md` §3.11's own three-row-state roster already tracks, read here only far enough to choose the right copy, not to render a second roster) and shows honest, distinct copy naming that an invitation is outstanding rather than repeating an instruction she's already followed. Neither zero-state ever promotes a pending Invitation to a row on this list — only active Memberships ever get rows, unchanged.
- **OWNER-only** — the same `product-decisions.md` Q24/Q25 permission table already gating "Tu equipo" (`settings.md` §2.7) and this document's own allocation screens (§3.21-§3.24); RFC 0011 introduces no new permission dimension, only a new capability inside an already-established gate.
- **Present unconditionally regardless of `subscriptionTier` (corrected 2026-09-10, EVT-M6 remediation — supersedes this document's earlier "structurally absent from Free tier" treatment).** `EventAssignment` creation (D60/RFC 0011) gates only on `BusinessMembership.status = active`, never on tier — `settings.md` §8 item 13 resolved that an already-active SELLER Membership survives a Paid→Free downgrade entirely unaffected, so a grandfathered Free-tier Business retains real ability to view and assign its existing staff. A genuinely-never-Paid Free-tier Business simply has zero active SELLER Memberships to show and lands on this screen's own zero-state above — no tier check is needed, or designed, to produce the correct outcome.

## 4. Interaction flow (summary)

```
Open Eventos tab
  → resolve (§2, automatic)
      → load fails ──────────────────────→ fallback (3.18), Reintentar
      → no Event ever scheduled ─────────→ cold start (3.3) → Agendar evento
      → Events exist ─────────────────────→ Events list (3.4/3.5)

Events list:
  tap "Agendar evento" → Nuevo Evento (3.6)
  tap a Próximo card  → scheduled detail (3.11)
      → [Cancelar evento] → confirm (3.12)
          → No, mantenerlo → back to §3.11, unchanged
          → Sí, cancelarlo → ambient "Evento cancelado" (3.13) → list, card
            removed entirely
  tap an Activo card  → active detail (3.14 or 3.15, depending on whether a
        Session is already open today) → [Continuar Día N / Vendiendo ahora]
        → Hoy, resumes/starts selling (identical mechanism to home.md §2/§3.6)
  tap a Pasado card   → closed detail (3.16, or 3.17 if zero Sessions) —
        3.16 shows the same one-line ambient summary already seen on the
        list before handing off
        → [Ver resumen en Resultados] → Event detail (reports.md §3.8)
          directly, for that specific closed Event

Nuevo Evento (3.6):
  fill Lugar (→ picker 3.7, create-or-select a Venue) + Tipo (→ picker 3.8) +
    Empieza (Termina auto-fills, always valid by default from the moment
    the form opens)
  → tap "Guardar evento" (reachable once Lugar + Tipo are filled — no
    overlap check, `decision-log.md` D53 retired it)
      → saving (3.9) → error → Reintentar → saving again
      → success → Events list, ambient "Evento agendado ✓" (3.10), card
        placed in Activo o Próximos purely by date — never a manual choice
  → [any point before Guardar] leave without saving → draft discarded, no
    confirmation, no auto-preserved draft (see §10 for why this differs from
    Inventario's heavier treatment)

Event detail — scheduled only (3.11):
  tap "Ajustar precios" → 3.19 (per-Product list, D33)
    zero Catalog Products registered → empty-state variant (3.19,
      zero-Catalog-Product) — plain message, no further branch
    ≥1 Catalog Product → tap a row → 3.20 (editar)
      → Cancelar → back to 3.19, unchanged
      → Guardar precio → back to 3.19, that row updated
  (Not offered on 3.14/3.15/3.16/3.17 — see those sections' own
  annotations and §10.)

Elsewhere:
  Home's upcoming-Event card (home.md §3.5) → tap → scheduled detail (3.11)
    for that specific Event — not a new destination invented for this entry.

Event detail — scheduled (3.11):
  tap "Llevar mercancía" → 3.21 (Mercancía para este evento)
    zero Catalog Products → empty-state variant (3.21), no further branch
    ≥1 Catalog Product → per-row:
      adjust manual stepper (local, unsaved until Guardar cambios)
      tap "Escanear las que te llevas" (only if Product has tagged stock)
        → 3.22 (scan queue)
          scan succeeds → assigns unit, live-committed, counters update
          → "ya está en otro evento" → error state, rescan a different tag
          → "no se pudo leer" → error state, rescan
          tap "Terminar" → back to 3.21, updated
      tap "Mover a otro evento" (only if Para este evento > 0)
        → 3.24, live variant → Elegir evento (sub-sheet)
          zero other scheduled/active Events → empty-state message, no
            further branch
          select destination → set cantidad and/or escanear (same
            duality as 3.21, ceiling = remaining at source)
          → Cancelar → back to 3.21, unchanged
          → "Mover mercancía" → saving (3.23 shape) → error → Reintentar
            → success → ambient "Mercancía movida ✓" → back to 3.21,
              both source and destination allocations updated (single
              transaction, invisible)
    tap "Guardar cambios" → saving (3.23) → error → Reintentar
      → success → ambient "Mercancía actualizada ✓", stays on 3.21

Event detail — active, no Session today / Session open elsewhere (3.14/3.15):
  tap "Ver mercancía de este evento" → 3.21 (identical shared screen,
    identical branches to the block above)

Event detail — scheduled (3.11):
  tap "Asignar personal" → 3.26 (Personal para este evento)
    zero active SELLER Memberships, zero pending Invitations → empty-state
      variant (3.26, never-invited), no further branch
    zero active SELLER Memberships, 1+ pending Invitation → empty-state
      variant (3.26, invitation-pending), no further branch
    ≥1 active SELLER Membership → per row, scheduling-conflict line (if any)
      already computed and shown before any tap:
      tap "Asignar" (Sin asignar row) → saving (per-row, 3.9 shape) → error
        → Reintentar → success → row moves to "Asignadas," showing
          "Vendiendo en este evento" — its conflict line, if any, was
          already visible before the tap and carries over unchanged →
          stays on 3.26
      tap "Quitar" (Asignada row) → saving (per-row, 3.9 shape) → error →
        Reintentar → success → row moves to "Sin asignar," its conflict
        line (if any) likewise unchanged → stays on 3.26
    [any point] leave the screen → every already-saved assign/unassign stays
      exactly as saved — no batch step to discard, unlike 3.21's manual
      stepper

Event detail — active, no Session today / Session open elsewhere (3.14/3.15):
  tap "Ver personal de este evento" → 3.26 (identical shared screen,
    identical branches to the block above)

Event detail — closed/past, unresolved allocation (extends 3.16, per-pool — 2026-09-09 amendment):
  per unresolved Product row, per pool present on that row (NFC sub-block, manual sub-block, or both):
    NFC sub-block (unchanged):
      tap "Regresar a inventario general" → immediate write, no
        confirmation sheet → ambient "Se regresó [Producto] a inventario
        general ✓" → sub-block removed from this list
      tap "Mover a otro evento" → 3.24, closed-source variant → Elegir
        evento (sub-sheet) → Cancelar → back to 3.16, unchanged →
        "Mover mercancía" → saving (3.23 shape) → error → Reintentar
        → success → ambient "Mercancía movida ✓" → back to 3.16,
        sub-block removed
    manual sub-block (new):
      tap "Sí, regresaron las N" (N > 1) / "Sí, regresó" (N = 1) →
        immediate write, no confirmation sheet → ambient "Se regresó
        [Producto] a inventario general ✓" → sub-block removed
      N = 1 only: tap "No regresó" → immediate write, no confirmation
        sheet → ambient "Confirmaste que 0 de 1 [Producto] regresaron"
        (no checkmark — a confirmed shortfall/zero, §3.16's own stated
        divergence from §3.13's precedent) → sub-block stays, now
        showing the "Ya revisaste esto" framing on next render (still 1
        outstanding — nothing released)
      N > 1 only: tap "Ajustar cantidad" → stepper revealed in place
        (floor 0, ceiling N, starts at N)
        → Cancelar → collapses back to default view, nothing written
        → Mover a otro evento (tapped instead of Cancelar/Confirmar) →
          identical to Cancelar for the staged value — silently
          discarded, nothing written — then proceeds into 3.24,
          closed-source variant, exactly as the branch below
        → Confirmar → saving (3.23 shape) → error → Reintentar
          → success → ambient "Confirmaste que <valor> de N [Producto]
            regresaron ✓" if valor = N (full return via the stepper —
            same checkmark as the one-tap happy path), or "Confirmaste
            que <valor> de N [Producto] regresaron" — no checkmark — if
            valor < N → sub-block updates in place: fully resolved
            (valor = N) → sub-block removed; partial or zero (valor < N)
            → sub-block persists showing the new, smaller live-expected
            count and the "Ya revisaste esto" framing on any later visit
      tap "Mover a otro evento" (from the default, not-mid-stepper view)
        → 3.24, closed-source variant (reused verbatim, N = this
        sub-block's own live-expected quantity) → identical branch shape
        to the NFC sub-block above → success → sub-block removed
  last unresolved sub-block, of either pool, on the last unresolved row
    → section disappears, screen reverts to plain 3.16 (identity +
    one-line summary + hand-off), no separate transition or
    acknowledgment screen
  [Ver resumen en Resultados] remains reachable throughout, unaffected
    by whether reconciliation is pending — no capability in this doc is
    ever blocked by it (§1)
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no Event ever scheduled
4. Events list — normal (Activo + Próximos + Pasados all present, Pasados
   includes both the normal summary card and the zero-Session card shape)
5. Events list — no Activo Event (Próximos + Pasados only)
6. Nuevo Evento — entry form (D17's overlap-validation variant retired, `decision-log.md` D53 — §3.6)
7. Elegir lugar — picker sheet (create-or-select a Venue)
8. Elegir tipo — picker sheet
9. Guardar evento — saving (near-instant/slow) and error
10. Post-save confirmation (ambient)
11. Event detail — scheduled (not yet active)
12. Cancelar evento — confirmation
13. Post-cancel confirmation (ambient)
14. Event detail — active, no Session opened today
15. Event detail — active, Session already open today ("Vendiendo ahora")
16. Event detail — closed/past (identity + one-line ambient summary +
    hand-off to Resultados)
17. Event detail — closed/past, zero Sessions (never attended)
18. Defensive fallback / load error
19. Ajustar precios — lista por producto, per-Event Price Override (D33),
    including its zero-Catalog-Product empty-state variant
20. Editar precio para este evento — sheet (D33)
21. Mercancía para este evento — lista por producto (shared: "Llevar mercancía" / "Ver mercancía de este evento"), including its zero-Catalog-Product empty-state variant
22. Escaneando — cola de escaneo por Producto, including its two error states (prenda ya en otro evento; no se pudo leer)
23. Guardando cambios de mercancía — saving (near-instant/slow) and error, plus ambient post-save confirmation
24. Mover a otro evento — destino + cantidad/escaneo, live variant and closed-source (reconciliation) variant, including the Elegir evento sub-sheet, its zero-other-Events empty state, saving/error, and ambient post-save confirmation
25. Event detail — closed/past, con mercancía sin resolver (reconciliation section, extends §3.16; per-pool — an NFC-tagged sub-block, unchanged two-button mechanism, and/or a manual/untagged sub-block, new one-tap-default + secondary quantity-adjust mechanism, composing on the same Product row where both apply; disappears once every pool on every row is reconciled) **[revised 2026-09-09, `product/99-rfc/0010-...`]**
26. Personal para este evento — lista de personal (shared: "Asignar personal" / "Ver personal de este evento"), including its two zero-active-SELLER-Membership empty-state variants (never-invited vs. invitation-pending, EVT-M5) and its per-row scheduling-conflict variant, computed live and shown before any tap on every row (EVT-M4) **[new, `product/99-rfc/0011-event-assignment.md`; corrected 2026-09-10]**

## 6. Minimum step count

| Scenario | Taps / entries | Why it can't be fewer |
|---|---|---|
| Agendar un evento en un lugar que ya usó antes (el caso más común: bazares recurrentes) | 1 (Agendar evento) + 2 (Elegir lugar, seleccionar de la lista) + 2 (Elegir tipo, seleccionar) + 1 (Guardar) = 6 acciones | Lugar and Tipo are the minimum facts she must actively supply for Home's future resolution (`home.md` §2) to work — not padding. Empieza defaults to hoy and never needs a tap for this common same-day case (§3.6, §10). Reusing an existing Venue costs one tap more than the old freeform Nombre field did on its own, but removes any re-typing — or fragmentation risk — on every visit after the first (see §10). |
| Agendar un evento en un lugar nuevo (primera vez ahí) | 1 (Agendar evento) + 1 (abrir Elegir lugar) + 1 typed venue name + 1 ("Agregar... como lugar nuevo") + 2 (Elegir tipo, seleccionar) + 1 (Guardar) = 7 acciones | The exact same one-time cost Inventario's own Product picker already imposes for a brand-new Product (`inventory.md` §6) — not a new pattern invented for Eventos, and paid only once per physical place, never again on a return visit. Empieza defaults to hoy and never needs a tap for this common same-day case (§3.6, §10). |
| Agendar un evento de varios días | Same as either row above + 1 (editar Termina) | The one unavoidable extra step for the minority multi-day case; still cheaper than asking "¿cuántos días?" up front for every Event. |
| Ver los Días de un Evento activo | 1 (tap card from list) | Shortest possible — list card is already the shortcut. |
| Retomar la venta desde Eventos | 2 (tap card → tap Continuar/Vendiendo ahora) | One more tap than doing it from Home directly (`home.md` §6: 1 tap when a Session is open, or the 2-tap floor to start one) — a deliberate, acceptable cost of Eventos not being a selling destination; Home remains the fastest path to sell, always. |
| Cancelar un Evento programado | 3 (tap card → Cancelar evento → Sí, cancelarlo) | Matches the deliberate-confirmation cost pattern used everywhere else for rare, irreversible actions (`home.md` §3.11, `inventory.md` §3.9). |
| Ver el resumen completo de un Evento pasado | 2 (tap card → Ver resumen en Resultados) | Eventos identifies the Event and shows its one-line ambient summary in 1 tap (§3.16); the full day-by-day breakdown lives in Resultados per Q7's resolution, one hop further. |
| Ajustar el precio de un producto para este evento | 1 (Detalle → Ajustar precios) + 1 (tocar el producto) + 1 (Guardar precio) = 3 | She only pays this cost for the groups she actually wants to change (`decision-log.md` D33) — every other row costs zero taps. |

Entering an optional Costo del evento costs exactly one typed value beyond
whichever baseline applies in the table above — never gates Guardar evento,
never required.

Unlike Home's <3s bar, Eventos has no comparable hard speed requirement — the
floor above is about not adding unnecessary steps, the same posture
`inventory.md` §6 already established for a non-selling context.

**New rows (`product-decisions.md` Q24/Q25):**

| Scenario | Taps / entries | Why it can't be fewer |
|---|---|---|
| Llevar mercancía a un Evento por primera vez, 1 producto, cantidad manual | 1 (Llevar mercancía) + 1 (expandir el producto) + 1 (ajustar stepper) + 1 (Guardar cambios) = 4 | The stepper defaults to the current allocation (0, first time) — she only touches what she's actually bringing, per §3.21's own manual/scan composability rule. |
| Llevar mercancía con prendas etiquetadas | 1 (Llevar mercancía) + 1 (expandir el producto) + 1 (Escanear las que te llevas) + 1 scan por prenda + 1 (Terminar) | Per-unit tagging is a domain requirement (`decision-log.md` D4), reused unchanged from `inventory.md` §6's identical reasoning for Asignar Tags — one tag, one unit, no shortcut exists that preserves traceability. |
| Reponer un producto que se está agotando, a mitad del Evento | 1 (Ver mercancía de este evento) + 1 (expandir el producto) + 1 (ajustar stepper) + 1 (Guardar cambios) = 4 | Same screen, same mechanism as initial allocation (§3.21) — no second flow to learn or navigate. |
| Mover mercancía a otro Evento simultáneo | 1 (Ver mercancía de este evento) + 1 (expandir el producto) + 1 (Mover a otro evento) + 1 (Elegir evento) + 1 (ajustar cantidad o escanear) + 1 (Mover mercancía) = 6 | The destination pick and the honest remaining-at-source ceiling are both real facts she must supply/see — not padding; the underlying two-write transaction stays a single tap regardless (§3.24). |
| Resolver mercancía sin vender al cerrar un Evento — NFC, regresar a inventario general | 1 (tap "Regresar a inventario general") = 1 | Unchanged. No confirmation dialog — a safe, reversible action per §3.16's own reasoning. |
| Resolver mercancía sin vender al cerrar un Evento — manual, todo regresó (caso común) | 1 (tap "Sí, regresaron las N") = 1 | The Product Owner's own explicit instruction: confirming the full expected amount returned requires minimal interaction — the system already knows N, she only confirms it. |
| Resolver mercancía sin vender al cerrar un Evento — manual, regresaron menos de lo esperado | 1 (Ajustar cantidad) + 1+ (ajustar el stepper, 1 toque por unidad de diferencia) + 1 (Confirmar) = 3+ | The genuinely secondary path — never faster than the happy path above, by design, since it's collecting a real fact the system didn't already have (§3.16's own reasoning); still bounded by however many units actually differ, never a full retyped count from zero (stepper starts at N). |
| Resolver mercancía sin vender al cerrar un Evento — moverla a otro | 1 (Mover a otro evento) + 1 (Elegir evento) + 1 (Mover mercancía) = 3 | Unchanged, now available for either mode. One tap fewer than the live variant — quantity is pre-stated at the full remaining amount, not asked, since reconciliation-time "moving" is framed as fully resolving the row, and no scan step applies (§3.16's reconciliation annotation). |

**New rows (`product/99-rfc/0011-event-assignment.md`):**

| Scenario | Taps / entries | Why it can't be fewer |
|---|---|---|
| Asignar a una persona ya invitada a un Evento (sin conflicto de fechas) | 1 (Detalle → Asignar personal / Ver personal de este evento) + 1 (tocar Asignar) = 2 | She only supplies the one real decision (who) — the write and the conflict-check both happen automatically inside that same tap, never a second confirmation step. |
| Asignar a varias personas al mismo Evento, en una sola visita | 1 (entrar a Personal para este evento) + N (un toque por persona) = 1+N | Each assignment is an independent, deliberate choice about a specific person — no batch/staging step exists to shortcut it, and none should: assigning three people is a different decision made three times, not one decision. |
| Quitar a alguien de un Evento | 1 (Detalle → Ver personal de este evento) + 1 (tocar Quitar) = 2 | Same low-risk, single-tap posture as this document's other reversible, easily-undone actions (e.g. "Regresar a inventario general," §3.16) — she can always reassign in one more tap if she reconsiders. |

## 7. Automation opportunities

- Event status (`scheduled`/`active`/`closed`) — fully computed from
  `startDate`/`endDate` vs. today; never a manual toggle except cancellation
  (§2).
- Which list section a card appears under (Activo/Próximos/Pasados) — a pure
  read of the same computed status, never independently maintained.
- **Existing-vs-new Venue resolution** — inferred automatically from the
  Elegir lugar picker's case-insensitive, whitespace-trimmed match against
  her existing Venues (§3.7), mirroring Inventario's own Product picker
  (`inventory.md` §7). She is never asked "¿es un lugar nuevo?" explicitly.
- "Termina" auto-prefilled from "Empieza" — removes a "¿dura varios días?"
  question for the common single-day case (§3.6).
- "Continuar Día N" / "Vendiendo ahora" — reuses Home's exact computed
  session-resolution logic (`home.md` §2), never re-derived with separate
  rules for Eventos.
- Rollup totals (días, ventas, $ total) — computed automatically from
  Sessions sharing the `eventId`, never manually entered or reconciled by
  Ana; the same computed value feeds the Pasados list card (§3.4/§3.5,
  including its "Sin ventas registradas" case) and its echo on §3.16 — one
  fact, two display points, never two computations.
- Home's countdown text ("empieza en N días") — computed from
  `startDate − today`, never typed.
- No "¿ya terminó este evento?" prompt ever asked — closing is fully
  time-driven (§2).
- `Product.defaultPrice` pre-fills every row of "Ajustar precios" (§3.19)
  automatically — she only types where she wants to differ, never
  re-enters a price already correct (`decision-log.md` D33).
- `SaleItem.pricePaid` resolution at Sale time — fully automatic (Event
  override, else Product default), never a merchant decision at the
  point of sale; Eventos' only role is capturing the override, never
  computing or displaying the resolved price (`domain-model.md`'s Price
  resolution).
- Cancelled Events disappearing from the list entirely, with no separate
  "archive" step required to hide them (§3.13).
- "Disponible en general" (§3.21) is computed automatically as the
  Business-wide total minus every other open `EventAllocation`, refreshed
  live on every successful scan — never a figure Ana reconciles by hand
  across Events.
- Whether a Product row shows the "sin tag · con tag" split at all (§3.21)
  is automatic, gated on Business NFC capability and that Product having at
  least one available tagged unit — never asked, never shown for a
  Buttons-only Business.
- Which of `initial_allocation` / `replenish` / `adjustment` applies to a
  given save (§3.23) is inferred entirely from current state — Ana only
  ever sees a number change, never a movement-type choice.
- The reconciliation section's own visibility (§3.16/§3.25) is a pure
  computed read of unresolved `EventAllocation` rows for a closed Event,
  never a manually-set flag she has to remember to check or clear.
- Which specific physical units move or return at reconciliation (§3.25) is
  resolved automatically from already-known `allocatedUnitIds`/
  `quantityRemaining` — the same "repeated decision becomes automation"
  reasoning FIFO already applies in Buttons mode (`inventory.md` §7).
- The underlying two-write reallocation transaction (§3.24) is a single tap
  ("Mover mercancía") regardless of which two `EventAllocation` instances
  are actually touched underneath.
- **Manual-mode reconciliation's "expected quantity" (§3.16, 2026-09-09 amendment) is computed live on every render, reusing `releaseAllocation()`'s own candidate-selection query — never a figure Ana re-derives or a second number the app maintains separately from real `InventoryUnit` state.**
- Whether a Membership is already assigned to this Event (§3.26) — a pure read of existing `EventAssignment` rows, never a manual cross-check Ana performs herself.
- Which Memberships even qualify to appear on §3.26's list — automatic, gated on `BusinessMembership.status = active`, never a picker of which staff to include.
- The scheduling-conflict warning (§3.26) is computed automatically against this Membership's own other `EventAssignment` rows and their Events' date ranges, on every render, for every row regardless of assignment state (EVT-M4) — never a cross-check Ana has to remember to run herself, and never a stored flag that could go stale.
- Row grouping (Asignadas / Sin asignar) on §3.26 — a pure, deterministic read of current assignment state, never manually sorted.

## 8. Open questions

- **Q1 ("Día N" counting) — not new.** Logged in
  `product/02-ux/product-decisions.md` (reclassified from
  `architect-questions.md` as a Product Decision) from `home.md` §8: whether
  reopening a Session the same calendar day (e.g., a lunch-break resume)
  increments "Día N" or collapses into the same day number. This doc's
  Día-labeled rows (§3.4's "Día 2 de 3"; §3.4/§3.5's Pasados one-line
  summary and its §3.16 echo post-EVT-M3; §3.14/§3.15's single ambient row)
  all reuse whatever "Día N"/days-count Home's shared computation already
  produces, and none of them invent a resolution. The full per-day
  breakdown that originally made Q1 visible a second (and third) time in
  the pre-Q7 draft was removed per Q7's resolution and stays removed — only
  Resultados owns that breakdown and will need to account for Q1 when it's
  designed. The thin one-line summary restored to §3.16 by EVT-M3 is the
  same fact already shown on the list, not a new exposure.

- **Q6 — Is the Event `type` field a closed enum or an open, extensible
  list?** Escalated to Architect, logged as Q6 in
  `product/02-ux/product-decisions.md` (reclassified from
  `architect-questions.md` as a Product Decision) — genuinely unresolved by the
  Foundation (`ubiquitous-language.md`'s trailing ellipsis doesn't settle
  whether the list is closed or merchant-extensible). §3.8's picker
  conservatively shows no "add new type" affordance pending that answer —
  unlike this doc's own Elegir lugar (§3.7), which explicitly does support
  adding a new Venue, since that question is already settled for Venue by
  D20.

- **Q3 — was Resolved via `decision-log.md` D17; superseded 2026-09-06 (`decision-log.md` D53).** The original question (a tie-break rule for two simultaneously active Events) was closed by D17 removing the ambiguous state entirely — a Business could not create or activate an Event whose date range overlapped an already-scheduled-or-active Event, and the inline overlap-validation screen (formerly §3.6) enforced it. **D53 retires D17 outright**, not merely relaxes it: Nahui now supports true simultaneous multi-Event operation (a real prospective merchant's multi-seller use case, `product-decisions.md` Q24/Q25), so there is no longer a rule for Q3's original tie-break question to be moot against — D53's own text confirms this was never a business-capacity rule, only a now-obsolete single-actor `home.md` resolution safeguard. Kept here as historical record per this document's non-deletion discipline, not reopened as a live question — `home.md`'s own multi-Event resolution logic (routed to `ux-designer` per D53) is where the real successor design work lives now, not here.

- **New — SELLER-role experience of these allocation screens is not
  designed in this pass.** The permission table (§2) gates §3.21-§3.25
  OWNER-only; a SELLER's own view of "what am I selling from" is designed
  in `home.md` §3.6a/§3.9, not here. Flagged for a future `ux-designer`
  pass whenever SELLER-facing Event-management needs surface.
- **New, non-blocking implementation nuance, routed to Architect.** An
  `EventAllocation` reaching zero through ordinary sale/reallocation (not
  through the explicit §3.25 reconciliation action) may leave `status`
  still `open` in the data model — this has no merchant-facing
  consequence, since §3.25's own trigger condition is "unsold remaining
  stock on a closed Event," named that way precisely so it isn't silently
  assumed resolved just because the quantity happens to read zero.
- Pre-existing, unaffected by this amendment: Q1 and Q6 stay open exactly
  as already logged above; Q3 stays Resolved-then-superseded-by-D53 per
  its own entry above.

No other new domain ambiguities surfaced during this design — the
`scheduled`/`active`/`closed`/`cancelled` transitions, cancellation being
scheduled-only, and the absence of a manual early-close path for active
Events are all treated as reasonable, non-blocking UX-level defaults (§10),
not gaps requiring escalation — none of them leave the system in a broken or
undefined state the way Q1/Q2/Q3 do. Venue's introduction (D20) itself
surfaced no new domain ambiguity — it's a fully-specified, Accepted RFC; the
only items it leaves genuinely undesigned (Venue address capture, editing,
active-status toggling) are non-blocking scope deferrals, not open questions
— see §11.

- **New, resolved (`product/99-rfc/0010-...` Open Item 4, 2026-09-09) — "Mover a otro evento" is offered on manual/untagged reconciliation rows, alongside the new one-tap quantity-confirm default, not NFC-only.** Reasoning: the write machinery already supports it either way per the RFC's own framing; Ana's own supported use case (D53's simultaneous multi-Event operation) makes "move remaining manual stock to another concurrently-running Event" exactly as realistic for untagged stock as for tagged stock, and restricting it to NFC only would be an arbitrary asymmetry between two pools that already compose on the same Product row (§3.21). See §3.16/§3.24, §10.
- **RFC 0010 Open Items 1/2 (`unitSource`, `quantityExpected` schema additions) are not resolved here — they're Architect/Product-Owner schema sign-off items per the RFC's own framing, orthogonal to this UX pass.** This document's screens are designed assuming both land as RFC 0010 specifies; if either is rejected or altered at sign-off, the manual-mode reconciliation mechanism designed here needs re-checking against whatever lands instead.
- **RFC 0010 Open Item 3 (this document's own §3.16/§3.25 amendment) is now Resolved by this amendment itself.**
- **New — the combined-move case for a mixed row (moving both an NFC sub-pool and a manual sub-pool of the same Product to the same destination Event in one action) is explicitly not designed** — see §11.
- **New — RFC 0011 Open Item 4 (Membership-status gating) is resolved directly (D60), not merely assumed.** §3.26 is designed and implemented gating `EventAssignment` creation on `BusinessMembership.status = active` — resolved by `architect` from the existing Membership authorization-gate precedent (D55/D56), not left open.
- **New — a revoked `BusinessMembership`'s existing `EventAssignment` rows are not addressed by RFC 0011 or this amendment.** Since §3.26 only ever displays `active`-status Memberships, a revoked Membership simply stops appearing on this list — but whether its prior `EventAssignment` rows are cleaned up, or left as harmless orphaned data, is a schema-level housekeeping question RFC 0011 doesn't resolve and this UX pass doesn't need to for correctness (no merchant-facing surface reads a revoked Membership's stale assignments — `home.md` §2 step 0 intercepts a revoked SELLER before her own Session-open resolution ever reaches the assignment check). Flagged for Architect, non-blocking.
- **Resolved 2026-09-10 (EVT-M4, `ux-critic` finding) — a pre-emptive "already busy elsewhere" indicator on an unassigned row, shown before she taps "Asignar," is now designed.** §3.26's scheduling-conflict line renders on every row, assigned or not, computed live on every render — see §3.26's own annotation. Kept here, marked resolved, so the record of this being considered and initially deferred stays visible.
- **New — SELLER-role experience of §3.26 is not designed in this pass**, matching the identical scoping already stated for §3.21-§3.25 above; a SELLER's own view of which Events she's assigned to is `home.md` §3.6b, not a screen in this document.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — Termina
  auto-fills from Empieza (§3.6); post-save/post-cancel confirmations are
  ambient, not screens requiring a dismiss tap (§3.10/§3.13); empty list
  sections simply don't render (§3.4); an Event's status/section placement is
  never a step she performs.
- *"Never ask twice"* — closing/activating an Event is never confirmed or
  re-asked, it's computed (§2); "Continuar Día N"/"Vendiendo ahora" reuse
  Home's already-computed state rather than re-deriving or re-confirming it
  (§3.14/§3.15); the Elegir lugar picker never asks "¿es un lugar nuevo?" —
  inferred via the case-insensitive, trimmed matching rule (§3.7).
- *"Technology should disappear"* — loading states stay silent unless
  genuinely slow (§3.1/§3.2/§3.9), identical convention to the other two
  tabs; no technical status string anywhere.
- *"Selling is a state, not a navigation destination"* — the active-Event
  detail screen never becomes a second selling surface; it only ever hands
  off to Hoy (§3.14/§3.15).
- *"Business language before technical language"* — copy uses "evento,"
  "agendar," "lugar," "vendiendo ahora" — never "Event," "Session," "Venue,"
  or "eventId," anywhere on screen. The Tipo picker's list is fully
  naturalized Mexican-Spanish (Bazar/Expo/Pop-up/Festival/Tianguis/Venta de
  oficina, §3.8) — no leftover English domain term, per EVT-M1's fix.
- *"Every repeated decision should become automation"* — §7 is the direct
  enumeration of this applied to Eventos.
- *"Capture business truth once, reuse it forever"* — the Elegir lugar
  picker (§3.7) means Ana names a place exactly once, ever, then simply
  selects it on every return visit — the identical Venue-identity pattern
  Inventario already established for Product (`inventory.md` §9), applied
  here to where she sells instead of what she sells; the overlap check
  (§3.6) reuses the same already-loaded Events list this tab resolves with
  (§2), never a second fetch just to validate dates.
- *"The best interface stays out of the merchant's way"* — a failed
  Guardar evento never drops her typed data (§3.9); a closed Event with zero
  Sessions is shown factually, not as a failure state, both in its detail
  screen (§3.17) and in its list card (§3.4/§3.5, EVT-M2 remediation); the
  overlap message (§3.6) names the specific conflicting Event rather than a
  bare "fechas inválidas," so she never has to guess which commitment it's
  warning her about.
- *"The fastest interaction is the one that never happens"* — Price
  Override rows pre-fill from `defaultPrice`; she only touches what she
  wants to change (§3.19, `decision-log.md` D33).
- *"Never ask twice"* — an existing override, once set, shows pre-filled
  on return; never re-asked (§3.20).
- *"Business language before technical language"* — copy uses "Precio,"
  "Precio normal," "Costo del evento," never "bazaarCost," "Price
  Override," "defaultPrice."

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — Event status is resolved
  once, automatically, from dates; never a per-screen or per-Event manual
  question.
- *#3 (optional relationships stay optional in the data model)* — this whole
  doc depends on `Session.eventId` being genuinely nullable
  (`domain-model.md`); nothing in Eventos ever requires retrofitting a
  Session to have one. `Event.venueId`, by contrast, is deliberately
  required, not nullable (D20) — a different, equally deliberate choice for
  a different relationship, not an inconsistency.
- *#4 (internal-only entities never leak into user-facing language)* — the
  Sessions underlying an Event's Días are never named as "Session" in copy,
  only "Día N," matching Home's own established convention. Venue, unlike
  Session, is a real, referenceable aggregate root — it's named in copy
  ("Lugar") deliberately, not an internal detail being hidden.
- *#6 (one-way dependency direction)* — Eventos only reads Selling data
  (Sessions/Sales aggregated by `eventId`, and now Venue, also owned by
  Selling per D20); it never writes into Inventory, and "Ver resumen en
  Resultados" (§3.16) is a hand-off, not a duplication of Resultados' own
  analytics — confirmed by Architect's resolution of Q7, not just an
  aspirational framing. The one-line ambient summary restored to §3.16 by
  EVT-M3 is the same reused fact already computed for the list card
  (§3.4) — still a hand-off, not a second analytics surface; Resultados
  alone still owns the full day-by-day breakdown.
- *#1* — `SaleItem.pricePaid` resolves automatically, once, at Sale-write
  time; Eventos never re-litigates it.
- *#4* — Price Override, an internal-only entity, is never named in copy
  ("ajustar precios," not "Price Override").
- *#6* — Eventos only ever writes into its own Event-owned Price Override
  entity; no new bounded-context dependency edge (`decision-log.md` D33's
  own RFC-trigger analysis already confirms this).

**Allocation UX additions (`product-decisions.md` Q24/Q25):**

**global-principles.md:**
- *"Never ask twice"* — reconciliation (§3.25) never asks Ana to rescan
  units she's already accounted for; the remaining-quantity amount is
  pre-stated, not re-collected.
- *"The fastest interaction is the one that never happens"* — "Regresar a
  inventario general" (§3.25) is a single, un-confirmed tap; reconciliation
  amounts arrive pre-stated rather than requiring her to re-enter them.
- *"Every repeated decision should become automation"* — which unit(s) a
  reconciliation move actually touches (§3.25) is resolved automatically
  from already-known allocation state, never a per-unit choice Ana makes.
- *"Capture business truth once, reuse it forever"* — "Disponible en
  general" (§3.21) is computed once, upstream, from existing
  `EventAllocation` rows, never a figure re-entered or reconciled by hand.
- *"Business language before technical language"* — copy uses "mercancía
  para este evento," "mover mercancía," "sin repartir" — never
  "EventAllocation," "AllocationMovement," or "reallocation," anywhere on
  screen.

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — Business NFC capability and
  allocation state are both resolved once and read, never re-derived
  per-screen (§3.21's tag-split visibility).
- *#4 (internal-only entities never leak into user-facing language)* —
  `EventAllocation`/`AllocationMovement` are never named in copy; Ana sees
  quantities and a single "mover mercancía" action, never the underlying
  entities.
- *#6 (one-way dependency direction)* — the allocation-exclusivity
  invariant is enforced entirely inside Selling's own bookkeeping; Inventory
  never learns Events or allocation exist, never gains a new read or write
  path from this feature.
- *#7 (idempotent/keyed retries)* — "Reintentar" on a failed save (§3.23)
  is safe to tap more than once; it never double-applies a movement.

**Manual reconciliation additions (`product/99-rfc/0010-...`, 2026-09-09):**
- *"Never ask twice"* — manual reconciliation's one-tap default (§3.16) supplies the system's own already-computed expected quantity as the release amount; she is never asked to type back a number the system already knows. The stepper's shortfall path is the one place this document *does* ask her something new — deliberately, since that specific fact (how much physically came back) is genuinely unknown to the system until she states it, not a re-ask of something already captured.
- *"The fastest interaction is the one that never happens"* — the N=1 shortfall path collapses to a direct "No regresó" tap rather than revealing a stepper with only one real alternative value to pick.
- *"Business language before technical language"* — copy uses "sin vender," "regresaron," "ajustar cantidad" — never "EventAllocation," "AllocationMovement," "unitSource," "fifo_assignment," or "releaseAllocation," anywhere on screen.
- *"The best interface stays out of the merchant's way"* — a row carrying an earlier partial/zero confirm never re-displays the original full amount or omits acknowledgment of her prior action (§3.16's "Ya revisaste esto" framing), so she's never left guessing whether the screen forgot what she already did.
- *architecture-principles.md* #7 (idempotent/keyed retries) — every new manual-mode reconciliation write (the one-tap default, N=1's "No regresó," and the stepper's `Confirmar` alike) carries a stable idempotency key, the same discipline already required of every other write in this document (§3.9/§3.23).

**Assignment UX additions (`product/99-rfc/0011-event-assignment.md`):**

**global-principles.md:**
- *"Never ask twice"* — assign/unassign state is a pure read, never re-asked; the scheduling-conflict warning is computed automatically against already-known `EventAssignment` data, never a cross-check Ana performs herself (§3.26).
- *"The best interface stays out of the merchant's way"* — the scheduling-conflict warning renders on the row itself before she ever taps "Asignar" (corrected 2026-09-10, EVT-M4 remediation, matching `home.md` §3.6a's own Limited Ready precedent, HOME2-MAJ2) — she never has to run an assign/read/unassign cycle per candidate just to learn who's already committed elsewhere.
- *"The fastest interaction is the one that never happens"* — assign/unassign is a single, un-confirmed tap for a safe, reversible action; empty "Asignadas"/"Sin asignar" group headers simply don't render (§3.26).
- *"Business language before technical language"* — copy uses "personal," "vendiendo en este evento," "asignar," "quitar" — never "EventAssignment," "BusinessMembership," "Membership," or "eventId," anywhere on screen.
- *"Capture business truth once, reuse it forever"* — §3.26 reads the identical roster `settings.md` §2.7 already maintains, rather than collecting a second staff list.
- *"The best interface stays out of the merchant's way"* — a failed assign/unassign save never drops her tap or silently reverts the row; retry replays the same already-decided action.

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — active-Membership gating is a pure read applied once per render, never re-derived ad hoc per row.
- *#4 (internal-only entities never leak into user-facing language)* — `EventAssignment`/`BusinessMembership` are never named in copy; Ana sees a name (a phone number, today) and an "Asignar"/"Quitar" action.
- *#6 (one-way dependency direction)* — Eventos reads Identity's `BusinessMembership` data read-only, the identical edge RFC 0011 itself confirms is already established (Selling→Identity, via `Sale.performedByMembershipId`, D58) — no new dependency direction introduced by this screen.
- *#7 (idempotent/keyed retries)* — every assign/unassign write carries a stable idempotency key; "Reintentar" never double-creates or double-removes the same `EventAssignment` row.

## 10. Decisions made

- **§3.14 (active Event, no Session opened today) now surfaces an ambient
  "Hoy (Día N) · $X · N ventas hasta ahora" row when today already has
  finalized Sales under this `eventId`.** Absent otherwise. **[Amended
  2026-08-14 — see events.changelog.md#decisions-3-14-q19-same-day-resume-row]**
- **Events list cards (§3.4/§3.5) show Event type alongside
  `Venue.displayName` in the headline, joined by " · " —
  "Plaza Norte · Bazar."** Applies to every card shape in §3.4/§3.5.
  **[Amended 2026-08-14 — see
  events.changelog.md#decisions-events-list-type-headline]**
- **Empieza now defaults to hoy (today's date) instead of opening blank, and
  Guardar evento's required-field gate narrows to Lugar + Tipo accordingly.**
  Empieza remains a required domain field; Termina still inherits whatever
  value Empieza holds. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-empieza-hoy-default]**
- **Retired 2026-09-06 (`decision-log.md` D53) — no longer a live decision.** This bullet previously described the D17 overlap-validation check's on-open timing; the entire mechanism is removed (§3.6). Guardar evento's disabled condition is Lugar + Tipo alone. **[see events.changelog.md#decisions-overlap-check-runs-on-open]**
- **Event status transitions are automatic/date-driven except cancellation**,
  which is the sole manual transition and reachable only from `scheduled`
  (§2, §3.12). **[Amended 2026-08-14 — see
  events.changelog.md#decisions-event-status-transitions-automatic]**
- **No manual early-close/cancel path exists for an active Event.** If she
  stops attending a multi-day Event early, it simply closes on its scheduled
  end date with fewer Sessions than days. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-no-early-close-path]**
- **Eventos does not own the per-Event summary/breakdown.** §3.16 shows
  passive identity + the same one-line ambient summary already shown on the
  Pasados list card + a single hand-off to Resultados. **[Amended
  2026-08-14 — see events.changelog.md#decisions-q7-no-summary-ownership]**
- **Event type "Market" is naturalized to "Tianguis" in the Tipo picker
  (§3.8).** "Tianguis" communicates a genuinely different venue from "Bazar"
  (public open-air market vs. private bazares), not a synonym. **[Amended
  2026-08-14 — see events.changelog.md#decisions-market-naturalized-tianguis]**
- **Pasados list cards render a zero-Session Event gracefully (§3.4/§3.5)**
  — the "Sin ventas registradas" card shape, alongside the existing "N días
  · M ventas · $X" shape. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-zero-session-pasados-card]**
- **§3.16 carries the same one-line ambient summary already shown on the
  Pasados list card.** Eventos owns identity, the ambient one-line signal,
  and the hand-off; Resultados owns the actual computed total. **[Amended
  2026-08-14 — see events.changelog.md#decisions-evt-m3-restored-summary]**
- **Nuevo Evento's draft is not auto-preserved across interruption**, unlike
  Inventario's Registrar Mercancía. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-no-draft-autopreserve]**
- **Cancelled Events disappear entirely from the list** rather than moving
  to a "Cancelados" section. No archive view designed (§11). **[Amended
  2026-08-14 — see events.changelog.md#decisions-cancelled-events-disappear]**
- **"Continuar Día N" / "Vendiendo ahora" in Event detail are the same
  mechanism as Home's, surfaced in a second location** — not a parallel
  selling implementation. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-continuar-dia-n-shared-mechanism]**
- **Event type picker shows no "add new type" affordance, pending Architect
  input (Q6)** on whether the six listed types are a closed enum or an
  open, extensible list. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-q6-no-add-type-affordance]**
- **No recommendation logic of any kind** — per `company/backlog.md` #3,
  explicitly a "do not build" item. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-no-recommendation-logic]**
- **Venue replaces Event's freeform Nombre and optional Lugar entirely, via
  a required create-or-select picker (§3.6/§3.7).** Every screen that used
  to display Event's Nombre now displays `Venue.displayName` in the same
  slot. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-venue-replaces-nombre-lugar]**
- **This doc's own worked examples map old-Nombre/old-Lugar pairs onto the
  new single `Venue.displayName` by keeping the more specific, place-only
  value** (e.g. "Plaza Norte," "Plaza Toluca"), not the former
  type-conflated compound Nombre (e.g. "Bazar Plaza Norte"). **[Amended
  2026-08-14 — see events.changelog.md#decisions-example-data-venue-mapping]**
- **No UI designed for capturing a Venue's optional address/notes at
  creation, editing an existing Venue's `displayName` or address after
  creation, or toggling its `active` status.** Mirrors the Supplier/cost
  precedent (`decision-log.md` D9) — schema-present, UI-absent. **[Amended
  2026-08-14 — see events.changelog.md#decisions-no-venue-management-ui]**
- **Copy decision: "Lugar" chosen as the merchant-facing Spanish rendering
  of Venue** (field label in §3.6, picker title/prompt in §3.7, "el evento
  en Plaza Toluca" phrasing in §3.12). **[Amended 2026-08-14 — see
  events.changelog.md#decisions-lugar-copy-choice]**
- **Overlap-warning timing and copy corrected (EVT-Q1), and three stale
  pre-amendment passages fixed for internal consistency (EVT-Q2).** The
  check runs the instant the form opens, but the warning only renders once
  she's had her first real engagement with the form; when the conflicting
  date is still her untouched hoy default, the message says so explicitly
  ("si agendas para hoy…"). **[Amended 2026-08-14 — see
  events.changelog.md#decisions-evt-q1-q2-overlap-warning-fix]**
- **`Event.bazaarCost` and Event-owned Price Override added — applies
  `decision-log.md` D33.** Costo del evento is optional, non-gating,
  displayed back verbatim on Event detail while the Event hasn't closed,
  never computed against Sale revenue. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-d33-bazaarcost-price-override]**
- **"Ajustar precios" is strictly an Event-*planning* capability**
  (Product Owner decision, correcting round 1's draft, which had made it
  reachable throughout the Event's active lifecycle too). §3.11
  (`scheduled`) is the only Event detail state offering it; once the Event
  becomes `active`, the capability disappears from the UI entirely — no
  live repricing, no session-level price freezing, no point-of-sale
  override. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-ajustar-precios-planning-only]**
- **§3.19 gains a zero-Catalog-Product empty-state variant.** If Ana taps
  "Ajustar precios" having registered no Products yet, she sees a plain,
  factual message ("Todavía no registraste ningún producto..."). No direct
  link into Inventario designed. **[Amended 2026-08-14 — see
  events.changelog.md#decisions-3-19-zero-catalog-empty-state]**
- **§3.21/§3.23 ("Mercancía para este evento") is a distinct screen from
  §3.19 ("Ajustar precios"), not a shared/reused one**, reasoned explicitly:
  the two capture genuinely different data (quantity-per-Event vs.
  price-per-Event) with different gating (allocation is available on any
  `scheduled`/`active` Event; price adjustment is `scheduled`-only, §3.19).
  **[Amended 2026-09-06 — see events.changelog.md#decisions-q24-q25-allocation-ux]**
- **Manual quantity entry and NFC scanning compose on the same screen
  (§3.21/§3.22)**, reusing the Catalog-row precedent (`inventory.md` §3.4)
  of a single row supporting both entry modes rather than forking into two
  separate flows. **[Amended 2026-09-06 — see
  events.changelog.md#decisions-q24-q25-allocation-ux]**
- **An allocation's quantity floor is 0, not 1.** Ana can zero out an
  Event's allocation entirely (e.g., she over-allocated and wants it all
  back in general inventory) without that being treated as an error state.
  **[Amended 2026-09-06 — see
  events.changelog.md#decisions-q24-q25-allocation-ux]**
- **Reconciliation (§3.25) never requires a fresh scan**, reasoned in full:
  the system already knows which physical units (tagged) or how much
  quantity (Buttons) remain allocated to a closed Event from its own
  bookkeeping — asking Ana to rescan what she hasn't sold would be asking
  her to re-tell the app something it already knows, violating "capture
  business truth once." **[Amended 2026-09-06 — see
  events.changelog.md#decisions-q24-q25-allocation-ux]**
- **"Regresar a inventario general" (§3.25) is a single, un-confirmed tap** —
  no intermediate confirmation dialog, matching this doc's existing
  posture toward low-risk, easily-visible-consequence actions (e.g.
  cancellation's own confirm-once pattern is reserved for destructive,
  hard-to-notice mistakes, not routine stock movements).
  **[Amended 2026-09-06 — see
  events.changelog.md#decisions-q24-q25-allocation-ux]**
- **Reconciliation's "Mover a otro evento" (§3.24/§3.25) moves the full
  remaining amount, never a partial split.** A partial move is deferred
  (§11). **[Amended 2026-09-06 — see
  events.changelog.md#decisions-q24-q25-allocation-ux]**
- **§3.21-§3.25 are OWNER-only**, per the permission table (§2) —
  no SELLER-facing variant designed in this pass (§8).
  **[Amended 2026-09-06 — see
  events.changelog.md#decisions-q24-q25-allocation-ux]**
- **§3.21 corrected: every Catalog-Product row now collapses to a
  one-line summary by default, with only one row expanded at a time**
  (`ux-critic` finding) — the previous version rendered every row's full
  control set simultaneously and falsely claimed this matched Registrar
  Mercancía's shape; it didn't. The corrected shape is an honest,
  adapted reuse of Registrar Mercancía's row-collapsing precedent
  (`inventory.md` §3.7), not its sequential-add/commit-per-line mechanic
  — collapse/expand here is a pure display toggle, never a commit.
  **[see events.changelog.md#decisions-3-21-collapse-correction]**
- **§6 corrected: four Q24/Q25 task-efficiency rows undercounted by
  exactly one tap each** (`ux-critic` finding) — "Llevar mercancía a un
  Evento por primera vez, 1 producto, cantidad manual," "Llevar mercancía
  con prendas etiquetadas," "Reponer un producto que se está agotando, a
  mitad del Evento," and "Mover mercancía a otro Evento simultáneo" were
  all written before §3.21's collapse-to-summary correction (above) and
  never updated: each stated sequence omitted the tap required to expand a
  Catalog-Product row before any of its controls (manual stepper,
  "Escanear las que te llevas," "Mover a otro evento") are reachable. The
  two reconciliation rows in the same table ("Resolver mercancía sin
  vender al cerrar un Evento...," §3.16/§3.25-driven) are unaffected —
  that screen has no collapse/expand toggle. A second verification pass
  (2026-09-07, `ux-critic`) found "Mover mercancía a otro Evento
  simultáneo" still undercounted by one further tap after that fix —
  missing the tap that actually enters §3.21 in the first place ("Ver
  mercancía de este evento," since this scenario's Event is active);
  corrected again, from 5 to 6.
  **[see events.changelog.md#decisions-q24-q25-tap-count-correction]**
- **Manual/untagged reconciliation rows (§3.16) gain a new, quantity-confirmed action — a one-tap "sí, regresaron las N" happy path, a secondary "Ajustar cantidad" stepper for a lower confirmed number (starting at N, decrementing), and an N=1 special case collapsing the shortfall path to a direct "No regresó" tap.** Distinct in shape from NFC's unchanged two-button mechanism because the underlying evidence differs (RFC 0010 §7) — quantity-confirmed vs. unit-identified — never because one mode is treated as less trustworthy. **[2026-09-09, `product/99-rfc/0010-event-scoped-inventory-allocation-commitment-lifecycle-correction.md` — see events.changelog.md#decisions-rfc0010-manual-reconciliation]**
- **"Mover a otro evento" is now offered on manual/untagged reconciliation rows too, reusing §3.24's closed-source variant unchanged, moving the full current live-expected quantity (never a partial split, matching NFC's own existing constraint).** Resolves RFC 0010's Open Item 4. **[2026-09-09 — see events.changelog.md#decisions-rfc0010-manual-reconciliation]**
- **A row carrying an earlier partial/zero confirm shows a passive "Ya revisaste esto — todavía falta N" line on any later visit, derived from a simple existence check against the already-written movement ledger — never a precise historical breakdown, and never silence.** **[2026-09-09 — see events.changelog.md#decisions-rfc0010-manual-reconciliation]**
- **§3.16's trigger-condition prose corrected to RFC 0010's stated invariant** ("1+ unit still `reserved` in `allocatedUnitIds`, either mode, for a `status = open` `EventAllocation`"), replacing a stale `quantityRemaining`-based check and fixing a pre-existing "available"-vs-"reserved" wording error RFC 0010's own Open Items flagged. **[2026-09-09 — see events.changelog.md#decisions-rfc0010-manual-reconciliation]**
- **New secondary action "Asignar personal" / "Ver personal de este evento" added to Event detail, both `scheduled` (§3.11) and `active` (§3.14/§3.15) — mirroring exactly how "Llevar mercancía"/"Ver mercancía de este evento" already compose across those same two states.** Deliberately not surfaced on Nuevo Evento (§3.6/§3.7) — `EventAssignment` requires an already-saved `eventId`, and Nuevo Evento's own minimal-required-fields discipline (Lugar + Tipo) is preserved unchanged. **[see events.changelog.md#decisions-rfc0011-event-assignment]**
- **"Asignar"/"Quitar" on §3.26 are both single, un-confirmed taps, deliberately lighter than `settings.md` §3.13's "Quitar a alguien" confirmation** — different stakes (removing from one Event's roster vs. permanently revoking Business-wide access), not an inconsistency. **[see events.changelog.md#decisions-rfc0011-event-assignment]**
- **The scheduling-conflict warning (RFC 0011 Open Item 3) is a computed-live, non-blocking, per-row passive line — shown on the row itself before she ever taps "Asignar," not only after (corrected 2026-09-10, EVT-M4 remediation).** The write itself still never blocks or requires a separate confirmation step; only the *timing* of when she sees the warning changed, from post-tap-only to the same ambient, pre-commit placement `home.md` §3.6a's own Limited Ready recommendation already established (a prior defect there, HOME2-MAJ2, was fixed specifically to keep that signal pre-tap). "Quitar," already present on an Asignada row, remains the entire override mechanism, should she reconsider after assigning anyway. **[see events.changelog.md#decisions-rfc0011-event-assignment]**
- **§3.26 reads only `active`-status `BusinessMembership` rows with `role = SELLER`** — a deliberate narrowing from `settings.md`'s own fuller three-state Tu equipo roster, since a pending or revoked Membership has no possible action on this screen (the zero-state alone additionally checks for a pending `Invitation`, EVT-M5 remediation, purely to choose the correct empty-state copy — never to render a second row type). **[see events.changelog.md#decisions-rfc0011-event-assignment]**
- **Both directions of multi-assignment are supported without a new mechanism**: multiple people assigned to one Event in a single visit (each row's tap is independent, no batch step); one person assigned to multiple Events (this screen is scoped per-Event, so a second Event just means a second, independent visit). **[see events.changelog.md#decisions-rfc0011-event-assignment]**
- **"Asignar personal"/"Ver personal de este evento" are present unconditionally, regardless of `subscriptionTier` (corrected 2026-09-10, EVT-M6 remediation — supersedes this document's earlier "structurally absent from Free tier" treatment).** `EventAssignment` creation (D60/RFC 0011) gates only on `BusinessMembership.status = active`, never on tier — `settings.md` §8 item 13 resolved that an already-active SELLER Membership survives a Paid→Free downgrade entirely unaffected, so a grandfathered Free-tier Business retains real ability to view and assign its existing staff. A genuinely-never-Paid Free-tier Business simply has zero active SELLER Memberships to show and lands on §3.26's own zero-state — no tier check is needed to produce the correct outcome. **[see events.changelog.md#decisions-rfc0011-event-assignment]**
- **§3.26's zero-state distinguishes "never invited anyone" from "invited someone, still awaiting acceptance" (corrected 2026-09-10, EVT-M5 remediation, `ux-critic` finding).** The second, previously-missing case now checks for a pending `Invitation` and shows honest, distinct copy naming that an invitation is outstanding, rather than repeating "invita a alguien" to a merchant who just did exactly that. **[see events.changelog.md#decisions-rfc0011-event-assignment]**

## 11. Future considerations

- **Retired 2026-09-06 (`decision-log.md` D53) — no longer applicable.** This item previously named a future defense-in-depth concern for the D17 overlap rule; the rule itself no longer exists.
- Editing an already-scheduled Event (fixing which Venue is selected, its
  Tipo, or its dates before it goes active) — not designed; today's flow
  only lets her view or cancel (§3.11). A real gap if real usage shows
  frequent re-scheduling.
- A manual early-close/cancel path for an active Event (§10) — deferred, not
  a structural blocker today.
- A "Cancelados" archive view, if Ana ever wants to see what she previously
  cancelled — not designed now; no journey calls for it.
- Retroactively creating an Event to "claim" Quick Sessions she already ran
  before scheduling it — explicitly not supported; Session→Event linking only
  ever happens automatically at Session-open time (§2). Revisit only if a
  real need surfaces.
- Pagination/sorting for a long Pasados history, once Ana has attended many
  events — not designed now, matches `inventory.md` §11's same deferral
  pattern for Catalog scale concerns.
- **Capturing a Venue's optional address/notes at creation time, editing an
  existing Venue's `displayName` or address after creation, and how/where a
  Venue's `active` status ever gets toggled** — none of these are designed
  in this pass, per explicit instruction. Mirrors the Supplier/cost
  precedent (D9): schema-present, UI-absent until a real need surfaces.
  Revisit once real usage shows Ana needs to fix a typo'd place name, add an
  address to a Venue, or retire a place she no longer visits. There is
  deliberately no dedicated Venue-management screen and no navigation
  presence of its own for Venue anywhere in this doc, per
  `product/99-rfc/0001-venue-entity.md`'s own scope note ("not a full
  location-management module").
- **Moving both an NFC sub-pool and a manual sub-pool of the same mixed Product row to the same destination Event in a single action** — not designed here; today she performs two separate "Mover a otro evento" actions if she wants both. A reasonable, narrower future refinement if real usage shows mixed rows with a want to move both pools together, deferred rather than designed against a case this RFC's own architecture doesn't require unifying (the two pools resolve via genuinely different underlying mechanisms).
- **No "write off as permanently lost" capability exists for a manual-mode shortfall that never resolves** — confirming "0 returned" (or a partial confirm) leaves the remainder genuinely `reserved` and outstanding indefinitely, by design (Product Owner's own "never silently release" instruction), with no mechanism designed here to ever clear it short of eventually confirming the rest returned or moving it to another Event. If real usage shows merchants accumulating permanently-stuck shortfalls (lost/stolen/given-away stock that will never "come back"), a genuine write-off capability is a real future gap, not solved by this amendment.
- A richer Venue location record (map pin, geocoding, saved-locations
  browsing) — plain optional address/notes is sufficient per the RFC's own
  scope note; no such capability exists in the Foundation to build on yet.
- A reminder/notification ahead of an upcoming Event ("mañana empieza en
  Plaza Norte") — a reasonable idea, but a notifications-infrastructure
  question outside this doc's scope.
- Q1 (D15) is Resolved. Q3 (D17) was Resolved, now superseded by D53 (see §8) — simultaneous active Events are the supported case now, not an excluded one. Whether the "Día N de M" row
  (§3.4) needs the small additive change this bullet originally anticipated
  is worth a final confirmation at build time rather than assumed either
  way — this doc only ever reuses the shared read-side computation, never
  recomputes it independently, so if a change is needed it happens once,
  upstream, not here.
- An explicit "revert to default" affordance for a Price Override, if real
  usage shows she wants to undo an adjustment without retyping the
  original `defaultPrice` from memory — not designed now.
- A visual indicator distinguishing an overridden row from a default one
  on §3.19's list — deferred to Medium-Fidelity visual treatment, same
  posture as §3.9's rank-number-vs-bar precedent.
- A profitability/margin view combining `Event.bazaarCost` with this
  Event's own Sale revenue — **named here explicitly as a future idea,
  not designed now** — out of scope per `decision-log.md` D33's
  "captured-but-not-computed" boundary.
- Partial reconciliation for a single Product (moving only some of its
  remaining units, leaving the rest allocated) — deferred; §3.25 always
  moves the full remaining amount for a Product at once.
- Action ordering on the scheduled-Event detail screen now that "Ajustar
  precios," "Mercancía para este evento," and "Asignar personal" (§3.11)
  can all be present at once — deferred to Medium-Fidelity visual
  treatment, not a low-fidelity behavioral question.
- A visual indicator distinguishing an allocated-vs-not-yet-allocated
  Product row on §3.21's list — deferred to Medium-Fidelity, same posture
  as §3.19's own overridden-vs-default deferral above.
- Bulk/batch scan shortcuts for allocating many units at once (§3.22) —
  not designed now, matches `inventory.md` §11's identical deferral for
  Catalog-scale scanning.
- **Resolved 2026-09-10 (EVT-M4 remediation) — no longer a future consideration.** This item previously deferred a pre-emptive "already busy elsewhere" indicator on an unassigned row; §3.26 now designs exactly this, computed live and shown on every row before any tap (see §3.26, §10).
- **A bulk "assign everyone" or "assign the same people as last time" shortcut on §3.26** — not designed now; every assignment is an individual, deliberate tap. Worth revisiting if a real merchant with a large, stable team finds this repetitive.
- **Cleanup of orphaned `EventAssignment` rows left behind by a revoked `BusinessMembership`** — flagged in §8, not designed here; no merchant-facing surface currently depends on this being resolved either way.
- **A display-name field for `User`, which would let §3.26 (and Tu equipo) identify rows by name instead of phone number** — the same real, already-flagged gap `settings.md` §2.7/§11 carries, not solved a second time here.

**Known Limitations, `merchant-user-tester`-found friction on §3.26 (RFC 0011 build validation), deliberately not turned into a fix round — secondary-path polish beyond RFC 0011's actual Approved scope, per this document's own "converge, not oscillate" remediation discipline:**
- **No confirmation summary after assigning staff to an Event** (e.g., "3 personas asignadas") — after tapping to assign someone on §3.26, the OWNER sees the row move from "Sin asignar" to "Asignadas" but gets no ambient count/summary of the Event's total staffing. A reasonable future affordance, not designed now; revisit if real usage shows OWNERs re-opening §3.26 repeatedly just to recount who's assigned.
- **No visual signal on the Events list itself (§3.4/§3.5) that a given Event has staff assigned** — an OWNER scanning her Events list has no at-a-glance indicator distinguishing a fully-staffed upcoming Event from one nobody's been assigned to yet; she'd need to open each Event's own §3.26 to check. Not designed now, matches this document's own established "defer visual/list-density additions until real usage shows the need" posture (e.g. §3.19/§3.21's own deferred row indicators, above).
