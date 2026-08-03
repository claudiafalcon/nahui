# Eventos — UX Specification

Status: Approved. Full UX Remediation cycle complete — EVT-M1, EVT-M2,
EVT-M3 fixed by `ux-designer`, verified clean by `ux-critic` (zero remaining
Blockers/Majors), and passed `reviewer`'s Foundation-consistency check (no
Blockers; one cross-document Important finding — stale post-renumbering
section references — corrected by Main). **Updated to apply the Venue
aggregate root** (`product/99-rfc/0001-venue-entity.md`, Accepted;
`decision-log.md` D20): Event's freeform `Nombre` and optional `Lugar`
fields are retired entirely, replaced by a required Venue picker (§3.7) —
every screen that used to show `Event.Nombre` now shows `Venue.displayName`
in the same slot. This also renumbers every screen state from the old §3.7
onward by one — see §10 for the full change record and the copy decision
("Lugar" as the merchant-facing rendering of Venue).
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
│  │ Plaza Norte                 │ │
│  │ Día 2 de 3 · 12-14 jul       │ │
│  └───────────────────────────┘ │
│  Próximos                       │
│  ┌───────────────────────────┐ │
│  │ Plaza Toluca                │ │
│  │ empieza en 5 días            │ │
│  └───────────────────────────┘ │
│  Pasados                        │
│  ┌───────────────────────────┐ │
│  │ Plaza Metepec                │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Ixtapan                     │ │
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

### 3.5 Events list — no Activo Event (most common day-to-day state)
```
┌───────────────────────────────┐
│  Eventos                       │
│  Próximos                       │
│  ┌───────────────────────────┐ │
│  │ Plaza Toluca                │ │
│  │ empieza en 5 días            │ │
│  └───────────────────────────┘ │
│  Pasados                        │
│  ┌───────────────────────────┐ │
│  │ Plaza Metepec                │ │
│  │ 3 días · 18 ventas · $2,340   │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Ixtapan                     │ │
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
│  [ __ / __ / ____ ]               │
│ Termina                         │
│  [ __ / __ / ____ ]               │  prefilled = Empieza, editable
│                                │
│  [      Guardar evento       ]   │  disabled until Lugar + Tipo + Empieza
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- "Termina" auto-fills to whatever she picks for "Empieza" the instant she
  picks it — most of Ana's events are single-day (bazares), so this removes a
  "¿va a durar varios días?" question entirely; she only touches Termina for
  the minority multi-day case. *global-principles.md*, "never ask twice";
  matches the spirit of `inventory.md` §3.6's own "only ask what's needed."
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
- Only Lugar, Tipo, Empieza are required; Termina is always populated
  (auto). No Supplier/cost-style hidden fields apply here — Eventos has
  nothing analogous to Inventario's deliberate-exception fields.

**Overlap-validation variant (D17) — inline, client-side, no separate screen**

The instant Empieza (and its auto-filled Termina) resolve to a real date
range, an automatic check runs against her own already-loaded Events for
this Business (the same list this tab already fetched to render §3.4/§3.5 —
no new network call). If the range overlaps an already-scheduled-or-active
Event (`decision-log.md` D17), the form shows this instead of a silently
re-enabled Guardar:

```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Agendar evento                   │
│                                │
│ Lugar                           │
│  [ Plaza Metepec ▾ ]              │
│ Tipo                            │
│  [ Bazar ▾ ]                     │
│ Empieza                         │
│  [ 13 / 07 / 2026 ]               │
│ Termina                         │
│  [ 15 / 07 / 2026 ]               │
│                                │
│  Esas fechas se cruzan con        │  plain text, not Error-styled — a
│  Plaza Norte (12-14 jul).          │  normal scheduling catch, not a
│  Ajusta las fechas para           │  system failure
│  continuar.                      │
│                                │
│  [      Guardar evento       ]   │  disabled — same gate as the base state,
├───────────────────────────────┤   overlap is a fourth silent condition
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

- **Runs before she ever taps Guardar, not after.** Checked the moment
  Empieza (and Termina, auto-filled to match) are known, and re-checked on
  every subsequent date edit — never waits for a save round-trip to tell her
  something already computable from data already in memory.
  *global-principles.md*, "the fastest interaction is the one that never
  happens": a doomed save is never attempted, so there's nothing to wait on
  and nothing to retry.
- **Reuses already-loaded data, not a new fetch.** The Events list this
  check compares against is the same one Eventos already resolved to render
  §3.4/§3.5 — the identical "sub-screen navigation assumed to use
  already-fetched data" scoping this doc's §3 intro already establishes for
  Elegir lugar/Elegir tipo. *global-principles.md*, "capture business truth
  once, reuse it forever."
- **Names the conflicting Event, not a bare "fechas inválidas."** Shows the
  conflicting Event's `Venue.displayName` + date range (the same identity
  fact used everywhere else in this doc, D20) so she can recognize which
  commitment conflicts and, if needed, check her own calendar — without
  leaving the form. A generic error would leave her guessing.
- **Tone is plain and informational, not alarming.** A merchant scheduling
  two overlapping bazares is a routine data-entry catch, not a destructive
  action or a system failure — nothing she typed is lost or at risk, so this
  doesn't warrant the Error-red treatment brand-guide.md reserves for
  "failures with real merchant-facing consequence — a write/save that failed,
  or entered data at risk" (e.g. this doc's own §3.9 "No se pudo guardar").
- **No §3.9 near-instant/slow/error treatment.** That three-state pattern
  exists specifically to cover write-time latency and failure. This is a
  pure client-side comparison of two already-known date ranges against
  already-loaded data — there is no network round-trip for a state to be
  slow or fail on.
- **Clears itself reactively, no dismiss tap.** The instant she edits
  Empieza/Termina into a non-overlapping range, the message disappears and
  Guardar evento re-enables (once Lugar/Tipo are also filled) — same
  no-extra-tap posture as this doc's ambient post-save/post-cancel
  confirmations (§3.10/§3.13).
- **Guardar evento's disabled condition is extended, not replaced.** The
  base state already disables Guardar until Lugar + Tipo + Empieza are
  filled; overlap detection is a fourth, equally silent gate — in the
  normal (non-overlapping) flow, nothing changes and she never sees this
  variant at all.

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
│                                │
│      [ Cancelar evento ]         │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Passive info (Venue name, type, dates) + exactly one action. No edit
  affordance designed — see §11. No Sessions exist yet (the Event hasn't
  started), so there's nothing else to show.
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
│                                │
│  Día 1 · 12 jul · 5 ventas · $610  │
│                                │
│      [   Continuar Día 2     ]   │
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- **Headline is `Venue.displayName` ("Plaza Norte")**, same slot the former
  Nombre ("Bazar Plaza Norte") occupied; Tipo stays its own separate line
  ("Bazar · 12-14 de julio"), unaffected by the Venue change. No separate
  Lugar/address line — see §3.11's annotation for why.
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

### 3.15 Event detail — active, Session already open today elsewhere
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Norte                      │
│  Bazar · 12-14 de julio            │
│                                │
│  Día 1 · 12 jul · 5 ventas · $610  │
│                                │
│  [ Vendiendo ahora · Día 2 ▸ ]   │  tappable → Hoy, resumes selling exactly
├───────────────────────────────┤   donde she left it
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
- Reads the same underlying priority fact Home's §2 checks first ("is there a
  Session with status = active"), scoped here to this specific Event's
  `eventId` — Home's own check doesn't need that filter since it just needs
  *any* active Session, but the computation is not re-derived with separate
  logic, just filtered to one Event's Sessions.

### 3.16 Event detail — closed/past
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Metepec                    │
│  Bazar · 5-7 de julio               │
│                                │
│  3 días · 18 ventas · $2,340      │
│                                │
│      [ Ver resumen en Resultados ]│
├───────────────────────────────┤
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```
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

### 3.17 Event detail — closed/past, zero Sessions (never attended)
```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Plaza Metepec                    │
│  Bazar · 5-7 de julio               │
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
      → [Cancelar evento] → confirm (3.12) → Sí, cancelarlo →
        ambient "Evento cancelado" (3.13) → list, card removed entirely
  tap an Activo card  → active detail (3.14 or 3.15, depending on whether a
        Session is already open today) → [Continuar Día N / Vendiendo ahora]
        → Hoy, resumes/starts selling (identical mechanism to home.md §2/§3.6)
  tap a Pasado card   → closed detail (3.16, or 3.17 if zero Sessions) —
        3.16 shows the same one-line ambient summary already seen on the
        list before handing off
        → [Ver resumen en Resultados] → leaves Eventos for Resultados

Nuevo Evento (3.6):
  fill Lugar (→ picker 3.7, create-or-select a Venue) + Tipo (→ picker 3.8) +
    Empieza (Termina auto-fills)
      → the instant Empieza (and its auto-filled Termina) resolve, an
        automatic client-side overlap check runs against her own
        already-loaded Events (no network round-trip, D17) — see §3.6's
        overlap-validation variant
      → overlap detected → inline message names the conflicting Event,
        Guardar evento stays disabled → she edits Empieza/Termina → message
        clears the instant the range no longer overlaps, re-checked on
        every edit
      → no overlap → nothing shown, form behaves exactly as before
  → tap "Guardar evento" (only reachable once Lugar + Tipo + Empieza are
    filled and no overlap is detected)
      → saving (3.9) → error → Reintentar → saving again
      → success → Events list, ambient "Evento agendado ✓" (3.10), card
        placed in Activo o Próximos purely by date — never a manual choice
  → [any point before Guardar] leave without saving → draft discarded, no
    confirmation, no auto-preserved draft (see §10 for why this differs from
    Inventario's heavier treatment)

Elsewhere:
  Home's upcoming-Event card (home.md §3.5) → tap → scheduled detail (3.11)
    for that specific Event — not a new destination invented for this entry.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no Event ever scheduled
4. Events list — normal (Activo + Próximos + Pasados all present, Pasados
   includes both the normal summary card and the zero-Session card shape)
5. Events list — no Activo Event (Próximos + Pasados only)
6. Nuevo Evento — entry form, including its inline overlap-validation
   variant (D17; client-side, no separate screen or navigation — §3.6)
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

## 6. Minimum step count

| Scenario | Taps / entries | Why it can't be fewer |
|---|---|---|
| Agendar un evento en un lugar que ya usó antes (el caso más común: bazares recurrentes) | 1 (Agendar evento) + 2 (Elegir lugar, seleccionar de la lista) + 2 (Elegir tipo, seleccionar) + 1 (Empieza) + 1 (Guardar) = 7 acciones | Lugar, Tipo, and a start date are the minimum facts needed to make Home's future resolution (`home.md` §2) work at all — not padding. Reusing an existing Venue costs one tap more than the old freeform Nombre field did on its own, but removes any re-typing — or fragmentation risk — on every visit after the first (see §10). |
| Agendar un evento en un lugar nuevo (primera vez ahí) | 1 (Agendar evento) + 1 (abrir Elegir lugar) + 1 typed venue name + 1 ("Agregar... como lugar nuevo") + 2 (Elegir tipo, seleccionar) + 1 (Empieza) + 1 (Guardar) = 8 acciones | The exact same one-time cost Inventario's own Product picker already imposes for a brand-new Product (`inventory.md` §6) — not a new pattern invented for Eventos, and paid only once per physical place, never again on a return visit. |
| Agendar un evento de varios días | Same as either row above + 1 (editar Termina) | The one unavoidable extra step for the minority multi-day case; still cheaper than asking "¿cuántos días?" up front for every Event. |
| Ver los Días de un Evento activo | 1 (tap card from list) | Shortest possible — list card is already the shortcut. |
| Retomar la venta desde Eventos | 2 (tap card → tap Continuar/Vendiendo ahora) | One more tap than doing it from Home directly (`home.md` §6: 1 tap when a Session is open, or the 2-tap floor to start one) — a deliberate, acceptable cost of Eventos not being a selling destination; Home remains the fastest path to sell, always. |
| Cancelar un Evento programado | 3 (tap card → Cancelar evento → Sí, cancelarlo) | Matches the deliberate-confirmation cost pattern used everywhere else for rare, irreversible actions (`home.md` §3.11, `inventory.md` §3.9). |
| Ver el resumen completo de un Evento pasado | 2 (tap card → Ver resumen en Resultados) | Eventos identifies the Event and shows its one-line ambient summary in 1 tap (§3.16); the full day-by-day breakdown lives in Resultados per Q7's resolution, one hop further. |

Unlike Home's <3s bar, Eventos has no comparable hard speed requirement — the
floor above is about not adding unnecessary steps, the same posture
`inventory.md` §6 already established for a non-selling context.

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
- Cancelled Events disappearing from the list entirely, with no separate
  "archive" step required to hide them (§3.13).
- **Overlap validation against her own already-scheduled-or-active Events**
  (`decision-log.md` D17) — checked automatically, client-side, the instant
  both dates are known; never something she has to cross-reference against
  her own memory or a separate calendar (§3.6).

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

- **Q3 — Resolved via `decision-log.md` D17, not reopened here.** The
  original question (a tie-break rule for two simultaneously active Events)
  no longer applies: D17 resolved it by removing the ambiguous state
  entirely rather than adding tie-break logic — a Business may not create
  or activate an Event whose date range overlaps an already-scheduled-or-
  active Event. This makes `home.md` §2's single-active-Event assumption
  correct by construction; no change to `home.md` was needed.
  **What D17 left genuinely undesigned is now designed.** "Nuevo Evento"
  (§3.6) now has an inline, client-side overlap-validation state: the
  instant both dates are known, an automatic check against her own
  already-loaded Events blocks Guardar evento and names the conflicting
  Event, before any save is ever attempted. This was named explicitly in
  D17's own text as "a UX design task, not designed as part of this
  decision," and surfaced again, still undesigned, during an Architect
  build-readiness review ahead of `product/03-build` — that gap is now
  closed; D17's rule and its enforcing screen are both fully specified.
  Nothing here reopens D17 itself or Q3's original tie-break question, both
  settled. No open item remains for this gap.

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
  never a step she performs; the overlap-validation check itself (§3.6,
  D17) runs instantly against already-loaded data the moment both dates are
  known, so a doomed save is never attempted and never costs her a
  round-trip to discover it.
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

## 10. Decisions made

- **Nuevo Evento's overlap check (D17) is enforced inline, client-side, the
  moment both dates are known — never a save-time rejection.** The check
  needs only two facts already in memory the instant Empieza is picked: her
  date range, and the Events list this tab already loaded to resolve
  §3.4/§3.5 — the same already-fetched-data scoping §3's own intro
  establishes for every sub-screen, and the same timing pattern Elegir
  lugar/Elegir tipo (§3.7/§3.8) already use. This is a pure client-side
  comparison with no server round-trip, so it deliberately does not reuse
  §3.9's near-instant/slow/error three-state pattern — that pattern exists
  to cover write-time latency and failure, neither of which applies here.
  Message tone is plain and informational, not alarming or Error-styled: a
  merchant double-booking two bazares is a normal scheduling mistake, not a
  system failure, consistent with brand-guide.md's reservation of Error
  treatment for failures with real merchant-facing consequence (a write/save
  that failed or data at risk) — nothing is lost or at risk here. The
  message names the specific conflicting Event (its `Venue.displayName` +
  date range, e.g. "Plaza Norte (12-14 jul)") rather than a generic "fechas
  inválidas," since she needs enough information to actually resolve it.
  Guardar evento's existing disabled-until-filled condition (§3.6) is
  extended with a fourth, equally silent gate — no overlap detected —
  rather than ever letting a doomed save reach §3.9.
- **Event status transitions are automatic/date-driven except cancellation**,
  which is the sole manual transition and reachable only from `scheduled`
  (§2, §3.12). Chosen because it needs no merchant upkeep ("never ask
  twice"/automation principle) and because once an Event is active, real
  Sessions and real money are already attached to it — "cancelling" something
  already partly lived through doesn't map cleanly onto the same word as
  cancelling something that hasn't happened yet.
- **No manual early-close/cancel path exists for an active Event.** If she
  stops attending a multi-day Event early, it simply closes on its scheduled
  end date with fewer Sessions than days — no extra action required from her.
  This is a deliberate, low-risk default (not escalated — nothing breaks),
  revisited in §11 if real usage shows a need (e.g., an organizer cancelling
  remaining days).
- **Eventos does not own the per-Event summary/breakdown — corrected per Q7's
  resolution.** The original draft put a full days/totals rollup in §3.16;
  Architect confirmed `information-architecture.md`'s nav table already
  assigns "Session/Event summaries" to Resultados, and Eventos' job is
  status/navigation ("drills into their Sessions"), not analytics. §3.16 now
  shows passive identity + the same one-line ambient summary already shown
  on the Pasados list card + a single hand-off to Resultados (restored by
  EVT-M3 remediation, see below). This also means there's no "automatic
  interstitial right after her last Session closes" to design here at all —
  that moment, if it's designed anywhere, belongs to Resultados or Home's own
  close-summary (`home.md` §3.12), not Eventos.
- **Event type "Market" naturalized to "Tianguis" in the Tipo picker (§3.8)**
  — resolves EVT-M1: the prior copy left the internal domain term's English
  word untranslated, breaking the Spanish-only principle and the
  naturalized-Mexican-Spanish pattern the other five types already
  followed. "Tianguis" also communicates a genuinely different venue from
  "Bazar" (public open-air market vs. private bazares, `company/CLAUDE.md`),
  rather than reading as a synonym.
- **Pasados list cards render a zero-Session Event gracefully (§3.4/§3.5)**
  — resolves EVT-M2: added the "Sin ventas registradas" card shape alongside
  the existing "N días · M ventas · $X" shape, so a rained-out/changed-mind
  Event never mechanically renders "0 días · 0 ventas · $0" one screen
  before its detail view (§3.17) already handles the same case gracefully.
- **§3.16 carries the same one-line ambient summary already shown on the
  Pasados list card, restoring it after Q7's correction over-corrected it
  away** — resolves EVT-M3: Q7's resolution explicitly permits a "thin,
  ambient, in-progress indicator" as part of Eventos' own navigation/status
  role; §3.16 had dropped this entirely, leaving §1's stated Merchant Goal
  ("how did that one actually go") without any signal inside Eventos
  itself. §1 was also reworded so it no longer reads as though Eventos owns
  the rollup — it owns identity, the ambient one-line signal, and the
  hand-off; Resultados owns the actual computed total.
- **Nuevo Evento's draft is not auto-preserved across interruption**, unlike
  Inventario's Registrar Mercancía (`inventory.md` §3.7). Deliberate
  proportionality call: Inventario's multi-line form can represent real,
  counted work across several committed lines; Nuevo Evento is a single short
  form where the cost of re-typing/re-selecting (one place, one date pick) is
  low enough that neither a silent-preserve mechanism nor a Descartar
  confirmation is justified.
- **Cancelled Events disappear entirely from the list** rather than moving to
  a "Cancelados" section — they never happened, and Pasados is reserved for
  Events that actually ran their course. No archive view designed (§11).
- **"Continuar Día N" / "Vendiendo ahora" in Event detail are the same
  mechanism as Home's, surfaced in a second location** — not a parallel
  selling implementation. This keeps Eventos from ever becoming a second
  place selling "lives."
- **Event type picker shows no "add new type" affordance, pending Architect
  input (Q6)** on whether the six listed types are a closed enum or an
  open, extensible list like Product names — the Foundation's own wording
  (`ubiquitous-language.md`'s trailing ellipsis) doesn't settle it either way.
  Conservative default chosen so this doc doesn't unilaterally assert
  extensibility the Foundation hasn't confirmed.
- **No recommendation logic of any kind** — per `company/backlog.md` #3,
  explicitly a "do not build" item; Eventos only ever records and reviews
  Ana's own decisions.
- **Venue replaces Event's freeform Nombre and optional Lugar entirely, via
  a required create-or-select picker (§3.6/§3.7)** — applies
  `product/99-rfc/0001-venue-entity.md` (Accepted) and `decision-log.md` D20.
  Every screen that used to display Event's Nombre (§3.4, §3.5, §3.9, §3.10,
  §3.11, §3.12, §3.14, §3.15, §3.16, §3.17) now displays `Venue.displayName`
  in the same slot; the old optional "Lugar (opcional)" freeform address field is
  removed, its role absorbed into Venue's own optional address/notes, which
  this pass does not design a data-entry surface for (see below and §11).
  This is the direct fix for the fragmentation risk originally logged as Q9
  (`product/02-ux/product-decisions.md`): a real, independent identity
  instead of an exact-string match on freeform text.
- **This doc's own worked examples map old-Nombre/old-Lugar pairs onto the
  new single `Venue.displayName` by keeping the more specific, place-only
  value (the former Lugar, e.g. "Plaza Norte," "Plaza Toluca," "Plaza
  Metepec," "Ixtapan"), not the former type-conflated compound Nombre (e.g.
  "Bazar Plaza Norte," "Expo Toluca").** This is a documentation choice for
  this spec's example data, not something the Foundation dictates (D20 is
  silent on example strings, only on the field/schema shape). Reasoning: a
  Venue's identity should be independent of any one Event's `type` — the
  same physical place may host a Bazar this year and an Expo next, and
  Event.type already carries that distinction separately on every detail
  screen (e.g. §3.11's "Expo · empieza en 5 días"). A merchant using this
  picker for real would simply type the place's actual name once, with no
  compound-name habit to work around.
- **No UI designed for capturing a Venue's optional address/notes at
  creation, editing an existing Venue's `displayName` or address after
  creation, or toggling its `active` status.** Mirrors the Supplier/cost
  precedent (`decision-log.md` D9): structurally present in the schema
  (`product/99-rfc/0001-venue-entity.md`), completely absent from any screen
  in this pass, until a real merchant need surfaces. Flagged explicitly per
  instruction — see §11.
- **Copy decision: "Lugar" chosen as the merchant-facing Spanish rendering
  of Venue** (field label in §3.6, picker title/prompt in §3.7, "el evento
  en Plaza Toluca" phrasing in §3.12). Chosen over "sede" — the latter reads
  as formal/corporate ("la sede del evento") rather than how a bazaar vendor
  actually talks; "lugar" is how Ana would naturally say it ("el lugar de
  siempre," "un lugar nuevo"), and doesn't collide with any other term
  already in use in this doc now that the old freeform "Lugar (opcional)"
  address field is retired.

## 11. Future considerations

- Defense-in-depth server-side re-validation of the D17 overlap rule at
  actual save time, for the rare case where her locally-loaded Events list
  goes stale between opening Nuevo Evento and tapping Guardar. Not designed
  here — genuinely rare for a single-operator business today; if it ever
  surfaces, the natural home for that rejection is the same inline overlap
  message (§3.6), re-shown, not a new §3.9-style error state — the rule is
  identical either way, only the trigger differs.
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
- Q1 (D15) and Q3 (D17) are both now Resolved. Whether the "Día N de M" row
  (§3.4) needs the small additive change this bullet originally anticipated
  is worth a final confirmation at build time rather than assumed either
  way — this doc only ever reuses the shared read-side computation, never
  recomputes it independently, so if a change is needed it happens once,
  upstream, not here.
