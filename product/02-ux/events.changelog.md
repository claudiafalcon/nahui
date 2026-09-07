# Eventos — Amendment & Decision History

Companion file to `product/02-ux/events.md`. This file holds the justification,
prior-state, and remediation-history prose that used to live inline in
`events.md`'s status header and `## 10. Decisions made` section. `events.md`
itself keeps only current-rule text and, for these two locations, a pointer
back here.

Anchors are prefixed `status-` (from `events.md`'s status header) or
`decisions-` (from `events.md` §10), to keep them unique within this file.

---

## Status-header history (from `events.md`'s front matter)

### status-full-ux-remediation-cycle
**Applies to:** `events.md` overall Approval.

Status: Approved. Full UX Remediation cycle complete — EVT-M1, EVT-M2,
EVT-M3 fixed by `ux-designer`, verified clean by `ux-critic` (zero remaining
Blockers/Majors), and passed `reviewer`'s Foundation-consistency check (no
Blockers; one cross-document Important finding — stale post-renumbering
section references — corrected by Main).

### status-d20-venue-aggregate-root
**Applies to:** `decision-log.md` D20 (Venue aggregate root).

**Updated to apply the Venue aggregate root** (`product/99-rfc/0001-venue-entity.md`,
Accepted; `decision-log.md` D20): Event's freeform `Nombre` and optional `Lugar`
fields are retired entirely, replaced by a required Venue picker (§3.7) —
every screen that used to show `Event.Nombre` now shows `Venue.displayName`
in the same slot. This also renumbers every screen state from the old §3.7
onward by one — see §10 for the full change record and the copy decision
("Lugar" as the merchant-facing rendering of Venue).

### status-evt-q1-empieza-hoy-default
**Applies to:** EVT-Q1 (Empieza default / D17 overlap-check visibility timing).

**Amended (UX fix, no Foundation change):** §3.6's Empieza field now defaults
to hoy (today's date) instead of opening blank, closing the same "unclear
what to enter" gap flagged on `inventory.md`'s Cantidad field. Termina's
existing auto-fill-from-Empieza behavior is unchanged and simply inherits the
new default. Guardar evento's required-field gate narrows to Lugar + Tipo.
The D17 overlap check (§3.6) is now computed at form-open time, since
Empieza is pre-resolved from the start — but the warning itself only becomes
visible once she engages with the form for the first time, not on raw open,
closing a follow-up comprehension gap (EVT-Q1) found during amendment
verification. See §10 for the full change record.

### status-2026-08-04-icon-comprehension-audit
**Applies to:** 2026-08-04 icon/comprehension audit.

**Amended 2026-08-04 (icon/comprehension audit):** §3.4/§3.5's Events list
cards now show Event type alongside `Venue.displayName` ("Plaza Norte ·
Bazar"), matching the subordinate role Type already has on Detail screens.
Full cycle complete, `ux-critic`/`reviewer` clean, folded back into
Approved.

### status-2026-08-08-d33-mvp-pricing
**Applies to:** `decision-log.md` D33 (MVP pricing operating model).

**Amended 2026-08-08 (`decision-log.md` D33, MVP pricing operating model):**
`Event.bazaarCost` (optional) added to Nuevo Evento (§3.6), and a new
per-Product Price Override mechanism ("Ajustar precios," new §3.19/§3.20)
added to Event detail. Two remediation rounds — round 1 found 2 Major
(a wiring-completeness gap in `inventory.md`'s §4/§5/§6, and "Ajustar
precios" being reachable during active selling, undercutting D33's own
offline-planning premise) + 2 Minor + 1 Suggestion. Round 2 applied the
Product Owner's direct ruling: "Ajustar precios" is now strictly an
Event-*planning* capability, reachable only while an Event is
`scheduled` — removed entirely from active-state screens (§3.14/§3.15).
`ux-critic` verified clean (zero Blockers/unresolved Majors). One Minor
finding remains open, non-blocking (`ux-critic-findings.md`'s D33 entry:
`EVT-D33-MIN-A`, a duplicate-bullet cleanup in §3.11). `reviewer` clean
(no Blockers, no Important findings) — folded back into Approved.

### status-2026-08-13-q19-same-day-resume-row
**Applies to:** `architect-questions.md` Q19 (same-day resume ambient row),
cross-referencing Q7.

**Amended 2026-08-13 (Architect-resolvable content amendment, closing an
`experience-review-2026-08-13-eventos.md` finding — see `architect-questions.md`
Q19, cross-referencing Q7):** §3.14 (Event detail, active, no Session
opened today) gains a conditional, ambient row — "Hoy (Día N) · $X · N
ventas hasta ahora" — shown only when a Session under this `eventId`
already has 1+ finalized Sales on today's calendar date; absent entirely
in the common case (no Session opened yet today). Deliberately worded to
signal in-progress, not closed — a different shape from this screen's own
past-Día row format ("Día 1 · 12 jul · 5 ventas · $610," which names a
finished, prior calendar date) — since this row describes today's still-
open day, not a finished one; the tester finding this amendment closes was
specifically about trust in the "close" action, so conflating the two row
shapes would have reintroduced the same risk in a different form. Sourced
from `SUM(SaleItem.pricePaid)`/`COUNT(Sale)` across the identical Session
set already reused for "Día N" (§2/§7) — no new query. Classified by
`architect` as Architect-resolvable directly from `architect-questions.md`
Q7's existing ruling (this document may show "a thin, ambient, in-progress
indicator" as part of its own navigation/status role) — no new Product
Owner decision. No new §5 screen-state entry — a conditional content
addition to §3.14, same treatment as EVT-M3's restored one-line summary
above. `home.md` §3.4/§3.5/§3.6 receive the matching addition in the same
pass, including for Quick Sessions (no `eventId`) — see that document's
own status header.

---

## Decisions-made history (from `events.md` §10)

### decisions-3-14-q19-same-day-resume-row
**§3.14 (active Event, no Session opened today) now surfaces an ambient
"Hoy (Día N) · $X · N ventas hasta ahora" row when today already has
finalized Sales under this `eventId`, closing the same trust gap
`home.md`'s matching amendment closes
(`product/02-ux/experience-review-2026-08-13-eventos.md`).** Deliberately
worded to read as in-progress, not closed — a different shape from this
screen's own past-Día row format ("Día 1 · 12 jul · 5 ventas · $610") —
since a same-day-resume row describes today's still-open day, not a
finished one; conflating the two would have reintroduced the exact trust
risk the tester found in the "close" action. Sourced from the identical
Session set already reused for "Día N" (§2/§7) — no new query. Classified
by `architect` as resolvable directly from `architect-questions.md` Q7's
existing ruling — logged as Q19, not a new Product Owner decision.
`home.md` §3.4/§3.5/§3.6 receive the matching addition, including for
Quick Sessions.

### decisions-events-list-type-headline
**Events list cards (§3.4/§3.5) now show Event type alongside
`Venue.displayName` in the headline, joined by " · " —
"Plaza Norte · Bazar."** Previously the list showed only the Venue's
identity, while every Detail screen (§3.11/§3.14/§3.16) already paired
`Venue.displayName` with its Tipo, one line down. This closes that
inconsistency: the list now carries the same fact, in the same
subordinate visual order (place leads, type follows), just condensed
onto the headline rather than a separate line, since a list card is more
compact than a Detail screen. Safe purely as a copy change —
`Event.type` is a closed, frozen 6-item enum (`decision-log.md` D16); no
schema change, no new merchant input, no interaction change. Applies to
every card shape in §3.4 (Activo, Próximos, Pasados, and the zero-Session
"Sin ventas registradas" variant) and to §3.5's identical Próximos/Pasados
cards. Not RFC-worthy — no aggregate boundary, domain term, or IA change;
a UX comprehension fix to an already-Approved spec, same category as this
document's other post-Approval amendments.

### decisions-empieza-hoy-default
**Empieza now defaults to hoy (today's date) instead of opening blank, and
Guardar evento's required-field gate narrows to Lugar + Tipo accordingly.**
Closes the same "unclear what to enter without tapping in and picking" gap
identified on `inventory.md`'s Cantidad field: Ana is almost always
scheduling for an imminent bazar, not months out, so hoy is the correct
default for the common case and remains a single edit away for the real
multi-day-ahead case. *global-principles.md*, "never ask twice" — the same
justification already cited for Termina's auto-fill from Empieza (§3.6) now
applies to Empieza itself, one level up. Empieza is unchanged as a required
domain field; only the UI's pre-fill behavior changes, so Guardar evento
becomes reachable with Lugar + Tipo alone, without her ever touching
Empieza, for the common same-day case. Termina needed no separate change —
it already inherited whatever value Empieza holds, so it now inherits hoy
through that same existing mechanism.

### decisions-overlap-check-runs-on-open
**Consequently, the overlap check (D17) now runs the instant Agendar evento
opens, not only after she picks a date.** The prior wording assumed Empieza
only ever "resolved to a real date" after a manual pick; with hoy as the
default, that's already true at open. The check is enforced inline,
client-side, the moment both dates are known: a pure comparison against
her already-loaded Events list (no new fetch, no server round-trip) — the
same already-fetched-data scoping §3's own intro establishes for every
sub-screen, and the same timing pattern Elegir lugar/Elegir tipo
(§3.7/§3.8) already use — running before Lugar/Tipo are even set, and
continuing to re-check on every subsequent date edit. This directly helps
the one case where it matters: if she already has an active/scheduled
Event covering today (e.g. she's mid-bazar and pre-scheduling the next
one), she now finds out before spending taps on Lugar/Tipo —
*global-principles.md*, "the fastest interaction is the one that never
happens." Because there's no write-time latency or failure mode here, it
deliberately does not reuse §3.9's near-instant/slow/error three-state
pattern — that pattern exists to cover save-time risk, which doesn't
apply to a client-side comparison. Message tone is plain and
informational, not alarming or Error-styled: a merchant double-booking
two bazares is a normal scheduling mistake, not a system failure,
consistent with brand-guide.md's reservation of Error treatment for
failures with real merchant-facing consequence (a write/save that failed
or data at risk) — nothing is lost or at risk here. The message names the
specific conflicting Event (its `Venue.displayName` + date range, e.g.
"Plaza Norte (12-14 jul)") rather than a generic "fechas inválidas,"
since she needs enough information to actually resolve it. Guardar
evento's disabled condition is still Lugar + Tipo + no-overlap; overlap
is now the third silent gate, not the fourth, since Empieza no longer
independently counts. Not RFC-worthy — no aggregate boundary, domain
term, or IA change; a UX interaction-behavior fix to an already-Approved
spec, same category as `inventory.md`'s Cantidad-default amendment
above.

### decisions-event-status-transitions-automatic
**Event status transitions are automatic/date-driven except cancellation**,
which is the sole manual transition and reachable only from `scheduled`
(§2, §3.12). Chosen because it needs no merchant upkeep ("never ask
twice"/automation principle) and because once an Event is active, real
Sessions and real money are already attached to it — "cancelling" something
already partly lived through doesn't map cleanly onto the same word as
cancelling something that hasn't happened yet.

### decisions-no-early-close-path
**No manual early-close/cancel path exists for an active Event.** If she
stops attending a multi-day Event early, it simply closes on its scheduled
end date with fewer Sessions than days — no extra action required from her.
This is a deliberate, low-risk default (not escalated — nothing breaks),
revisited in §11 if real usage shows a need (e.g., an organizer cancelling
remaining days).

### decisions-q7-no-summary-ownership
**Eventos does not own the per-Event summary/breakdown — corrected per Q7's
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

### decisions-market-naturalized-tianguis
**Event type "Market" naturalized to "Tianguis" in the Tipo picker (§3.8)**
— resolves EVT-M1: the prior copy left the internal domain term's English
word untranslated, breaking the Spanish-only principle and the
naturalized-Mexican-Spanish pattern the other five types already
followed. "Tianguis" also communicates a genuinely different venue from
"Bazar" (public open-air market vs. private bazares, `company/CLAUDE.md`),
rather than reading as a synonym.

### decisions-zero-session-pasados-card
**Pasados list cards render a zero-Session Event gracefully (§3.4/§3.5)**
— resolves EVT-M2: added the "Sin ventas registradas" card shape alongside
the existing "N días · M ventas · $X" shape, so a rained-out/changed-mind
Event never mechanically renders "0 días · 0 ventas · $0" one screen
before its detail view (§3.17) already handles the same case gracefully.

### decisions-evt-m3-restored-summary
**§3.16 carries the same one-line ambient summary already shown on the
Pasados list card, restoring it after Q7's correction over-corrected it
away** — resolves EVT-M3: Q7's resolution explicitly permits a "thin,
ambient, in-progress indicator" as part of Eventos' own navigation/status
role; §3.16 had dropped this entirely, leaving §1's stated Merchant Goal
("how did that one actually go") without any signal inside Eventos
itself. §1 was also reworded so it no longer reads as though Eventos owns
the rollup — it owns identity, the ambient one-line signal, and the
hand-off; Resultados owns the actual computed total.

### decisions-no-draft-autopreserve
**Nuevo Evento's draft is not auto-preserved across interruption**, unlike
Inventario's Registrar Mercancía (`inventory.md` §3.7). Deliberate
proportionality call: Inventario's multi-line form can represent real,
counted work across several committed lines; Nuevo Evento is a single short
form where the cost of re-typing/re-selecting (one place, one date pick) is
low enough that neither a silent-preserve mechanism nor a Descartar
confirmation is justified.

### decisions-cancelled-events-disappear
**Cancelled Events disappear entirely from the list** rather than moving to
a "Cancelados" section — they never happened, and Pasados is reserved for
Events that actually ran their course. No archive view designed (§11).

### decisions-continuar-dia-n-shared-mechanism
**"Continuar Día N" / "Vendiendo ahora" in Event detail are the same
mechanism as Home's, surfaced in a second location** — not a parallel
selling implementation. This keeps Eventos from ever becoming a second
place selling "lives."

### decisions-q6-no-add-type-affordance
**Event type picker shows no "add new type" affordance, pending Architect
input (Q6)** on whether the six listed types are a closed enum or an
open, extensible list like Product names — the Foundation's own wording
(`ubiquitous-language.md`'s trailing ellipsis) doesn't settle it either way.
Conservative default chosen so this doc doesn't unilaterally assert
extensibility the Foundation hasn't confirmed.

### decisions-no-recommendation-logic
**No recommendation logic of any kind** — per `company/backlog.md` #3,
explicitly a "do not build" item; Eventos only ever records and reviews
Ana's own decisions.

### decisions-venue-replaces-nombre-lugar
**Venue replaces Event's freeform Nombre and optional Lugar entirely, via
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

### decisions-example-data-venue-mapping
**This doc's own worked examples map old-Nombre/old-Lugar pairs onto the
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

### decisions-no-venue-management-ui
**No UI designed for capturing a Venue's optional address/notes at
creation, editing an existing Venue's `displayName` or address after
creation, or toggling its `active` status.** Mirrors the Supplier/cost
precedent (`decision-log.md` D9): structurally present in the schema
(`product/99-rfc/0001-venue-entity.md`), completely absent from any screen
in this pass, until a real merchant need surfaces. Flagged explicitly per
instruction — see §11.

### decisions-lugar-copy-choice
**Copy decision: "Lugar" chosen as the merchant-facing Spanish rendering
of Venue** (field label in §3.6, picker title/prompt in §3.7, "el evento
en Plaza Toluca" phrasing in §3.12). Chosen over "sede" — the latter reads
as formal/corporate ("la sede del evento") rather than how a bazaar vendor
actually talks; "lugar" is how Ana would naturally say it ("el lugar de
siempre," "un lugar nuevo"), and doesn't collide with any other term
already in use in this doc now that the old freeform "Lugar (opcional)"
address field is retired.

### decisions-evt-q1-q2-overlap-warning-fix
**Overlap-warning timing and copy corrected (EVT-Q1), and three stale
pre-amendment passages fixed for internal consistency (EVT-Q2).** The
Empieza-default amendment above made the D17 overlap check computable the
instant Agendar evento opens, but the original wording also made the
*warning* visible at that same instant — before Ana had touched anything,
including in the named scenario where she's mid-Session at a Venue today
and opens the form to pre-schedule a different, future bazaar, and
immediately sees a conflict warning naming the Venue she's currently
selling at. Fixed by decoupling computation from visibility: the check
still runs the instant the form opens (no lost tap-efficiency — a doomed
save is never attempted), but the warning itself only renders once she's
had her first real engagement with the form (picks Lugar or Tipo, or
edits a date) — reading as validation following an action, the same
pattern every other validation state in this doc already uses, rather
than an unprompted error about "today." When the conflicting date is
still her untouched hoy default, the message now says so explicitly
("si agendas para hoy…") instead of asserting a flat conflict. See §3.6's
overlap-validation variant and its wireframes. Separately, three passages
left over from before the Empieza-default amendment still described the
old four-gate/Empieza-required behavior — the §3.6 overlap-variant bullet
("fourth gate"), §4's interaction-flow summary, and §6's minimum-step-count
table (both common-case rows) — all corrected to agree with the rest of
the document: Guardar evento's gate is Lugar + Tipo (+ no-overlap), and
the common same-day case never requires touching Empieza. Neither fix
reopens D17 or changes any domain field — both are UX-level corrections
to an already-Approved spec, same category as the Empieza-default
amendment itself.

### decisions-d33-bazaarcost-price-override
**`Event.bazaarCost` and Event-owned Price Override added — applies
`decision-log.md` D33.** Costo del evento is optional, non-gating,
displayed back verbatim on Event detail while the Event hasn't closed,
never computed against Sale revenue. The Price Override entry point
("Ajustar precios," §3.19/§3.20) composes two already-established
patterns — `inventory.md`'s Catalog-row list shape and its new
price-edit sheet (§3.4a) — rather than inventing a new interaction
primitive.

### decisions-ajustar-precios-planning-only
**Correction (remediation round 2, Product Owner decision):** round 1
of this amendment made "Ajustar precios" reachable throughout an
Event's entire open lifecycle — scheduled *and* active — which
`ux-critic` flagged as undercutting D33's own "deliberate, offline
planning moment" premise: it left the action reachable while Ana was
actively selling at that Event. The Product Owner resolved this
directly: "Ajustar precios" is strictly an Event-*planning* capability.
While the Event is `scheduled`, she reviews default prices, changes
only the ones she wants, and saves them as that Event's prices. **Once
the Event becomes `active`, the capability disappears from the Event
UI entirely** — no live repricing, no delayed-effective pricing, no
session-level price freezing, no point-of-sale override. The Event's
prices are finalized before activation and stay fixed for the
duration of that Event. Applied precisely: §3.11 (`scheduled`) is now
the *only* Event detail state offering "Ajustar precios" — removed
from §3.14/§3.15 (`active`) entirely, both the action itself and every
cross-reference that previously described it as available there. It
remains absent from §3.16/§3.17 (`closed`), for the pre-existing reason
below, now understood as one stage further along the same rule: once
planning ends — first at activation, later at closure — editing stops
being offered, full stop. Deliberately absent from closed Events
(§3.16/§3.17), since a Price Override edited after closure could
affect no Sale that will ever exist. Neither addition introduces a
discount, haggling, or point-of-sale mechanism — explicitly out of
scope by D33 itself.

### decisions-3-19-zero-catalog-empty-state
**§3.19 gains a zero-Catalog-Product empty-state variant (MIN2,
`ux-critic`-caught, round 2).** If Ana taps "Ajustar precios" having
registered no Products yet in Inventario, she sees a plain, factual
message ("Todavía no registraste ningún producto...") in the same
non-judgmental register this document already uses for its other
zero-data states (§3.17, EVT-M2) — not a broken or empty-looking list.
No direct link into Inventario designed; she's still one nav-bar tap
away herself.

### status-2026-09-06-d53-overlap-validation-retired

**Applies to:** `events.md` status header, §3.6, §4, §7, §8 (Q3), §9, §10, §11.

`decision-log.md` D53 (2026-09-06) confirmed Nahui now supports true
simultaneous multi-Event operation — a Product Owner decision made while
designing concurrent multi-seller selling (`product-decisions.md` Q24/Q25).
D17's own restriction ("at most one Event per Business may be
`scheduled`/`active` with an overlapping date range at a time") was never a
business-capacity rule — it existed solely to keep `home.md`'s single-actor
"which Event am I continuing" resolution logic unambiguous, at a time when
exactly one person could ever operate a Business. That contingency no
longer holds once multiple staff can each run their own Session under their
own Event. D53 retires D17 outright, not merely relaxes it — this entry
removes the entire enforcing mechanism from `events.md`.

**Full removed §3.6 content, preserved verbatim below, per this project's
non-deletion discipline:**

---

**Overlap-validation variant (D17) — inline, client-side, no separate screen**

Empieza (and its auto-filled Termina) now resolve to a real date range from
the moment Agendar evento opens — Empieza defaults to hoy — rather than only
once she taps in and picks a date. An automatic check runs immediately
against her own already-loaded Events for this Business (the same list this
tab already fetched to render §3.4/§3.5 — no new network call), and re-runs
on every subsequent date edit. **The check itself is computed the instant
the form opens, but the warning only becomes visible once she's actually
engaged with the form for the first time** — returned from Elegir lugar or
Elegir tipo having made a selection, or edited a date field, whichever
happens first (EVT-Q1). A raw, untouched Agendar evento screen never shows
it, even though hoy's default already technically conflicts — surfacing a
warning about a date she hasn't looked at yet, the instant the screen
renders, read as an unprompted error rather than validation feedback. If the
range overlaps an already-scheduled-or-active Event (`decision-log.md` D17),
the form shows this — instead of a silently re-enabled Guardar — the moment
that first engagement completes, most commonly right after she picks Lugar,
since it's the form's first field:

```
┌───────────────────────────────┐
│ ← Eventos                        │
│  Agendar evento                   │
│                                │
│ Lugar                           │
│  [ Plaza Toluca ▾ ]               │  she just picked this — first
│                                │  engagement with the form
│ Tipo                            │
│  [ Elegir tipo ▾ ]                │
│ Empieza                         │
│  [ 04 / 08 / 2026 ]               │  still hoy — she hasn't touched it
│ Termina                         │
│  [ 04 / 08 / 2026 ]               │  prefilled = Empieza
│                                │
│  Si agendas para hoy, esas        │  becomes visible now that she's
│  fechas se cruzan con Plaza       │  engaged with the form — not
│  Norte (04-06 ago). Ajusta las    │  shown before any interaction
│  fechas para continuar.           │  at all
│                                │
│  [      Guardar evento       ]   │  disabled — Tipo still unset,
├───────────────────────────────┤   plus overlap unresolved
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

The example below (Plaza Metepec / Bazar / 13–15 jul) stays valid for the
case where she picks Lugar/Tipo first, then edits dates into a conflict —
this scenario was already action-triggered before EVT-Q1 and needs no
change:

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
├───────────────────────────────┤   overlap is a third silent condition
│ Hoy  Inventario [Eventos] Resultados │
└───────────────────────────────┘
```

- **Computed the instant the form opens; shown the instant she first
  engages with it — closes EVT-Q1.** Empieza's hoy default (and Termina,
  auto-filled to match) means a real date range is known immediately when
  Agendar evento renders, so the check itself runs with no manual date pick
  required — but the *warning* waits for her first real interaction with the
  form (picking Lugar or Tipo, or editing a date), so it never appears as an
  unprompted error about a date she hasn't looked at or touched. In the
  common case (Lugar is the form's first field), she still finds out right
  after picking Lugar — before spending a tap on Tipo — preserving nearly
  all of the original tap-efficiency benefit while making the warning read
  as validation following something she just did, the same pattern
  established everywhere else in this doc, rather than a surprise on open.
  *global-principles.md*, "the fastest interaction is the one that never
  happens": a doomed save is still never attempted.
- **When the conflicting date is still the untouched hoy default (as in the
  Lugar-first example above), the message says so explicitly — "Si agendas
  para hoy, esas fechas se cruzan con..." — rather than asserting a flat
  conflict as if she'd deliberately chosen that date.** This is the copy
  half of the EVT-Q1 fix: even shown after an engagement (Lugar picked), the
  date itself may still be one she hasn't actively set, so the copy names
  that condition instead of reading as a claim about a decision she made.
  Once she actually edits Empieza/Termina herself (the Plaza Metepec example
  below), the message drops the "si agendas para hoy" framing — that
  phrasing is used only while Empieza still holds its unedited default
  value.
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
  base state already disables Guardar until Lugar + Tipo are filled
  (Empieza/Termina are always valid by default from the moment the form
  opens, per §3.6's Empieza-default amendment above) — overlap detection is
  a third, equally silent gate alongside them, not a fourth; in the normal
  (non-overlapping) flow, nothing changes and she never sees this variant at
  all. (EVT-Q2 correction — this bullet previously described the
  pre-amendment four-gate behavior.)

---

**End of removed content.** Every other cross-reference to D17/the overlap
check across §4, §7, §8 (Q3), §9, §10, §11 was also corrected or struck in
this same pass — see `events.md`'s own current text for the corrected
versions; not duplicated here since none of it carried unique reasoning
beyond what's preserved above.

---

### decisions-q24-q25-allocation-ux

**New §3.21-§3.25 designed 2026-09-06 (`product-decisions.md` Q24/Q25 —
Event-scoped inventory allocation).** Additive, not a removal — this
anchor exists because §7-§11 each carry a decisions-made/future-
considerations bullet pointing here, per this document's own
cross-referencing convention, even though nothing was struck or replaced.
The full lifecycle (initial allocation, replenish, cross-Event
reallocation, explicit merchant-initiated reconciliation at Event close)
is designed in `events.md`'s own current text (§3.21-§3.25); see that
document directly for the authoritative content rather than a duplicate
here. OWNER-only per Q24/Q25's settled permission table; grounded in
`EventAllocation`/`AllocationMovement`, the physical-location-exclusivity
invariant, and the single-local-transaction reallocation mechanism.

### decisions-3-21-collapse-correction

**§3.21 corrected 2026-09-07 (`ux-critic` finding, Q24/Q25 remediation
round 1).** The originally-shipped version rendered every Catalog-Product
row's full control set (~8 facts/controls) simultaneously and claimed —
inaccurately — that this matched Registrar Mercancía's own
"multi-line-entry-then-single-commit shape" (`inventory.md` §3.6/§3.7).
Checked directly, Registrar Mercancía is a sequential-add flow (one
Product picked and committed at a time); §3.21 had no add step at all —
every Catalog Product always has a row. Corrected to a genuine
collapse-to-summary, one-row-expanded-at-a-time shape: every row starts
collapsed ("Producto — N para este evento," or "nada para este evento
todavía"), tapping a row's summary expands it, collapsing whichever other
row was previously expanded. Collapsing/expanding is a pure display
toggle, never a commit — a staged manual quantity persists regardless of
which row is currently shown expanded, and "Guardar cambios" commits every
row's staged quantity across the whole screen, not just the visible one.
See `events.md` §3.21's own current text for the full wireframes and
reasoning.

### decisions-q24-q25-tap-count-correction

**§6 corrected 2026-09-07 (`ux-critic` finding, Q24/Q25 remediation round
2) — four task-efficiency rows undercounted by exactly one tap each,** a
direct side effect of the §3.21 collapse-correction above landing after
these rows were originally written. Each affected row's stated sequence
omitted the tap required to expand a Catalog-Product row before any of
its controls (manual stepper, "Escanear las que te llevas," "Mover a otro
evento") are reachable:
- "Llevar mercancía a un Evento por primera vez, 1 producto, cantidad
  manual" — 3 taps stated, corrected to 4.
- "Llevar mercancía con prendas etiquetadas" — same gap, corrected.
- "Reponer un producto que se está agotando, a mitad del Evento" — same
  gap, corrected to 4.
- "Mover mercancía a otro Evento simultáneo" — 4 taps stated, corrected
  to 5, then found still wrong by a second `ux-critic` verification pass
  (missing the "Ver mercancía de este evento" entry tap present in its
  sibling rows) and corrected again to 6.

The two reconciliation rows in the same table ("Resolver mercancía sin
vender al cerrar un Evento...," §3.16/§3.25-driven) are unaffected — that
screen has no collapse/expand mechanic. See `events.md` §6's own current
table for the corrected figures.
