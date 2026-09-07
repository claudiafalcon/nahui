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

**Further amended 2026-09-06 (`product-decisions.md` Q24/Q25 — Event-scoped inventory allocation, settled architecture, RFCs not yet authored):** new §3.21–§3.25 design the full allocation lifecycle — initial allocation, replenish, reallocate between simultaneous Events, and explicit reconciliation at Event close — reachable via a new "Llevar mercancía" action on scheduled-Event detail (§3.11) and "Ver mercancía de este evento" on active-Event detail (§3.14/§3.15), both landing on the identical shared screen (§3.21), unlike "Ajustar precios" which stays strictly `scheduled`-only (see §3.21's own annotation for why this is a deliberate divergence, not an inconsistency). Gated OWNER-only per `product-decisions.md` Q24/Q25's settled permission table — the SELLER-role experience of these screens is not designed in this pass (§8). Grounded entirely in Q24/Q25's settled design (`EventAllocation`/`AllocationMovement`, the physical-location-exclusivity invariant, the single-local-transaction reallocation mechanism) — the two RFCs formalizing this into `domain-model.md` are not yet authored; this UX design does not wait on that authorship. **Further amended 2026-09-07 (`ux-critic` finding):** §3.21's own claim of matching Registrar Mercancía's "multi-line-entry-then-single-commit shape" was checked against `inventory.md` §3.6/§3.7 directly and found inaccurate — that shape is a sequential-add mechanic Registrar Mercancía uses, not what §3.21 actually rendered (every row expanded simultaneously, no collapse). Corrected: §3.21 now genuinely adopts a collapse-to-summary/one-row-expanded-at-a-time shape, adapted (not copied verbatim, and stated honestly as such) from Registrar Mercancía's row-collapsing precedent. Re-verification pending. Pending `ux-critic`/`reviewer`.

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
│      [ Cancelar evento ]         │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Passive info (Venue name, type, dates) + exactly two secondary actions.
  No edit affordance designed — see §11. No Sessions exist yet (the Event
  hasn't started), so there's nothing else to show.
- **"Llevar mercancía" — new secondary action (`product-decisions.md` Q24/Q25), opens §3.21.** Optional and non-gating: an Event with zero allocations remains exactly as valid and sellable as one with several — Selling's FIFO/manual resolution against the general pool is entirely unaffected by whether allocation was ever used for this Event (allocation is a planning aid, never a precondition for selling). OWNER-only, per `product-decisions.md` Q24/Q25's settled permission table.
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
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- **"Ver mercancía de este evento" — new secondary action (`product-decisions.md` Q24/Q25), opens the identical §3.21 "Llevar mercancía" reaches from §3.11 (shared state, per `product/02-ux/CLAUDE.md` §4).** Present throughout the Event's `active` life, unlike "Ajustar precios" (absent from every active-state screen per this section's own annotation below) — see §3.21's own annotation for why this divergence is deliberate. OWNER-only.
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
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- **"Ver mercancía de este evento" — same new secondary action as §3.14 (`product-decisions.md` Q24/Q25), opening the identical shared §3.21.** OWNER-only.
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

**With unresolved mercancía allocated (new §3.25 — `product-decisions.md` Q24/Q25, extends this state):**
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
│  ├───────────────────────────┤ │
│  │ Playeras — 1 sin vender       │ │
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
- **This is a real, persistent screen state on the closed-Event detail — not the ambient/fading pattern this doc uses for confirmations (§3.10/§3.13).** It renders whenever this closed Event has 1+ `EventAllocation` still `status = open` with unsold remaining stock (`quantityRemaining > 0` for manual, or ≥1 `available`-status unit still in `allocatedUnitIds` for NFC), and stays until every row is resolved — never a dismiss-and-forget banner. This is the Product Owner's own explicit "must never happen silently" requirement made real, not merely stated.
- **Precedent for a persistent, must-resolve-but-non-blocking screen section: `inventory.md` §3.5's pending-tag-work Catalog state** — a real, standing state on an existing screen (not a modal/sheet), with a primary action, that disappears once resolved and never blocks any other capability. Reused here rather than inventing a new "reminder" primitive.
- **Copy stays inside this document's own established plain, factual, non-judgmental register** for a zero/leftover-data state — "no se vendió," not "te quedaste con," "olvidaste vender," or any framing that reads as her failure. Same tonal family as §3.17's "No registraste ventas en este evento" and §3.4/§3.5's "Sin ventas registradas" — a routine fact about an Event, never a scold.
- **Two actions per unresolved Product row, matching the Product Owner's own named pair exactly, applied per-row rather than Event-wide** — a merchant who wants to return some Products and move others to her next Event can do exactly that, consistent with D33's "she only edits the groups she actually wants to adjust for that event" precedent, applied here to reconciliation instead of pricing.
- **"Regresar a inventario general" is a single, immediate tap — no confirmation dialog.** Writes `return_to_general` and sets `status = reconciled` for that row directly; ambient "Bolsas regresada a inventario general ✓" (fades); the row disappears from this list immediately. **Deliberately not treated as a rare/irreversible action requiring the confirmation-sheet pattern §3.12 reserves for Cancelar Evento** — returning stock to the general pool is safe and reversible in effect (she can always re-allocate it again later), so adding a confirmation step here would be padding a routine action, not protecting an irreversible one.
- **"Mover a otro evento" opens §3.24's closed-source variant**, scoped to that one Product, pre-stated at the full unsold amount.
- **Section disappears entirely, reverting to the plain screen already specified above, once every row is resolved** — exactly per the Product Owner's own instruction; never a hard block on "Ver resumen en Resultados" or anything else on this screen, matching this document's own §1 "not time-critical" posture.
- **OWNER-only, per `product-decisions.md` Q24/Q25's settled permission table** — the SELLER-role experience of this screen is not designed here (§8).

**NFC-mode reconciliation — a deliberate departure from the live-allocation scan requirement, reasoned explicitly.** Neither "Regresar a inventario general" nor "Mover a otro evento" ever asks for a fresh scan, for either manual or NFC-tagged remaining stock. Live allocation (§3.21/§3.22) requires a scan because, at that moment, the system doesn't yet know which specific tagged garments she's actually picking up — the scan *establishes* that fact and enforces the physical-location-exclusivity invariant in the same motion. By the time an Event closes, the exact set of unsold tagged units is already fully and unambiguously known — it's whatever remains in that `EventAllocation`'s own `allocatedUnitIds` after every Sale that ever consumed against it, and the exclusivity invariant guarantees nothing else could have touched those specific units meanwhile. Reconciliation is a bookkeeping update to an already-true record, not a new claim of physical possession — requiring a re-scan here would ask the system to re-verify something it already knows with certainty, a direct violation of *global-principles.md*'s "never ask twice," and would actively work against her, since reconciliation typically happens after the fact, possibly with the garments not all gathered in one place. "Regresar a inventario general" flips the already-known remaining `allocatedUnitIds` back to `available` directly; "Mover a otro evento" resolves which specific units transfer the same automatic way FIFO already resolves "which unit" in Buttons-mode selling.
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
- **OWNER-only**, per `product-decisions.md` Q24/Q25's settled permission table.

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

Event detail — closed/past, unresolved allocation (3.25, extends 3.16):
  per unresolved Product row:
    tap "Regresar a inventario general" → immediate write, no
      confirmation sheet → ambient "[Producto] regresada a inventario
      general ✓" → row removed from this list
    tap "Mover a otro evento" → 3.24, closed-source variant → Elegir
      evento (sub-sheet, identical to the live variant's) → Cancelar →
      back to 3.25, unchanged → "Mover mercancía" → saving (3.23 shape)
      → error → Reintentar → success → ambient "Mercancía movida ✓" →
      back to 3.25, row removed
  last unresolved row cleared → section disappears, screen reverts to
    plain 3.16 (identity + one-line summary + hand-off), no separate
    transition or acknowledgment screen
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
25. Event detail — closed/past, con mercancía sin resolver (reconciliation section, extends §3.16; disappears once every row is reconciled)

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
| Llevar mercancía a un Evento por primera vez, 1 producto, cantidad manual | 1 (Llevar mercancía) + 1 (ajustar stepper) + 1 (Guardar cambios) = 3 | The stepper defaults to the current allocation (0, first time) — she only touches what she's actually bringing, per §3.21's own manual/scan composability rule. |
| Llevar mercancía con prendas etiquetadas | 1 (Llevar mercancía) + 1 (Escanear las que te llevas) + 1 scan por prenda + 1 (Terminar) | Per-unit tagging is a domain requirement (`decision-log.md` D4), reused unchanged from `inventory.md` §6's identical reasoning for Asignar Tags — one tag, one unit, no shortcut exists that preserves traceability. |
| Reponer un producto que se está agotando, a mitad del Evento | 1 (Ver mercancía de este evento) + 1 (ajustar stepper) + 1 (Guardar cambios) = 3 | Same screen, same mechanism as initial allocation (§3.21) — no second flow to learn or navigate. |
| Mover mercancía a otro Evento simultáneo | 1 (Mover a otro evento) + 1 (Elegir evento) + 1 (ajustar cantidad o escanear) + 1 (Mover mercancía) = 4 | The destination pick and the honest remaining-at-source ceiling are both real facts she must supply/see — not padding; the underlying two-write transaction stays a single tap regardless (§3.24). |
| Resolver mercancía sin vender al cerrar un Evento — regresar a inventario general | 1 (tap "Regresar a inventario general") = 1 | No confirmation dialog — a safe, reversible action per §3.16's own reasoning, not the rare/irreversible class §3.12 gates behind a confirm step. |
| Resolver mercancía sin vender al cerrar un Evento — moverla a otro | 1 (Mover a otro evento) + 1 (Elegir evento) + 1 (Mover mercancía) = 3 | One tap fewer than the live variant — quantity is pre-stated at the full remaining amount, not asked, since reconciliation-time "moving" is framed as fully resolving the row, and no scan step applies (§3.16's reconciliation annotation). |

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
- Action ordering on the scheduled-Event detail screen once both "Ajustar
  precios" and "Mercancía para este evento" are both present (§3.11) —
  deferred to Medium-Fidelity visual treatment, not a low-fidelity
  behavioral question.
- A visual indicator distinguishing an allocated-vs-not-yet-allocated
  Product row on §3.21's list — deferred to Medium-Fidelity, same posture
  as §3.19's own overridden-vs-default deferral above.
- Bulk/batch scan shortcuts for allocating many units at once (§3.22) —
  not designed now, matches `inventory.md` §11's identical deferral for
  Catalog-scale scanning.
