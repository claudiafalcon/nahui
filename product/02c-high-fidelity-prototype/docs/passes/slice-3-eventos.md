# Slice 3 — Eventos (+ two follow-on fixes)

Archived pass history, extracted from `README.md` as part of the
knowledge-architecture refactor (Stage 4, 2026-08-13). This is a pure,
content-preserving move — nothing below is summarized, reworded, or
deleted, only relocated out of the file every dispatch reads by default.
See `README.md`'s own "Pass history index" for the current, durable
reference this archive was split from.

---

## Eventos pass (2026-08-13) — Migration Workflow (D43): Journey 2 in full,
the remaining 2/3 of Journey 3 (Event-active Home resolution), Journey 4
(Event close/rollup)

Builds `product/02-ux/events.md` (Approved) as its implementation contract.
An Architecture Gap Analysis (`architect`) ran ahead of this pass and found
no blockers, no RFC needed (`Event`/`Venue`/Price Override are already
fully modeled in the frozen Foundation — `domain-model.md`, `decision-log.md`
D8/D15–D20/D33), and nothing requiring Product Owner input. Its recommended
build sequence (domain layer → Home resolution branch → Eventos shell →
list/Nuevo Evento → detail states → cross-screen wiring) is what was
actually followed, verified below via three scripted Puppeteer walkthroughs
against a live Chrome instance (not mocks), screenshots reviewed at each
step.

**One correction applied from existing Foundation, per the dispatching
task's own instruction — built against this reading regardless of whether
`home.md` §2's literal text has been corrected yet.** §2 step 2's condition
is "Event status = active AND no Session is currently active," not "no
Session opened yet under it today" (the literal-but-wrong reading would
incorrectly drop Event-linkage after a lunch-break close). "Día N" is always
D15's distinct-calendar-date computation, never a raw Session-row count —
`selectors.ts`'s `dayNumberForDate`/`eventCompletedDays` implement this
directly, adding the target date to the existing distinct-date set and
ranking it, which correctly handles both "about to become the next day" and
"resuming a date that already has a Session" with one formula, never two.

**Domain layer (`src/domain/types.ts`, `dates.ts`, `store.tsx`,
`selectors.ts`).** `Venue` (`id`, `displayName` — minimum viable, no
address/notes/`active` toggle, matching `events.md` §11's own no-UI-designed
scope, the same structurally-present/UI-absent treatment D9 already
established for Supplier/cost) and `Event` (`id`, `venueId` required,
`type` — the closed 6-value enum, internal English keys, Spanish labels
mapped only at the UI layer in `screens/Events/eventTypeLabels.ts` —
`startDate`/`endDate` as `'YYYY-MM-DD'` local-calendar-date strings,
`bazaarCost`, `cancelledAt: number | null`) are new types. **Status is never
a stored field** — `eventStatus(event, now)` computes
`scheduled`/`active`/`closed`/`cancelled` live from dates + `cancelledAt`,
exactly as §2 requires; every screen and selector reads through this one
function, never a cached/stored value. `PriceOverride` (`eventId`,
`productId`, `overridePrice`) is a new internal-only shape, stored flat on
`AppState.priceOverrides` (the same "no independent lookup outside its
parent" treatment `InventoryEntry` already has under `Lot`). `Session.eventId`
generalizes from a hardcoded `null` literal type to `ID | null`.

New store actions: `createEvent` (the atomic Event-creation write — resolves
a pending `VenueRef` via a private `resolveVenue` helper that mirrors
`mintProduct`'s own mint-or-find shape exactly, and enforces D17's overlap
check against every other Event whose *computed* status is
`scheduled`/`active`, returning a named `CreateEventResult` — the
conflicting Event and its Venue's `displayName`, never a bare boolean, per
§3.6's own requirement); `cancelEvent` (sets `cancelledAt`, defensively
no-ops unless the Event's computed status is still `scheduled`);
`setPriceOverride` (upserts one Product's override for one Event,
defensively re-checks computed status is still `scheduled` at write time —
§3.20: "unreachable at all once active, not just hidden," so the write path
itself must not trust the UI alone). `startSession` gained an optional
`eventId` param (defaulting to `null`, preserving every existing Quick
Session call site unchanged) — the existing "any active Session blocks a
new one" guard already generalized correctly, exactly as the dispatching
task anticipated, no change needed there. `addItemToSale`'s price
resolution now checks the active Session's `eventId` for a matching Price
Override before falling back to `Product.defaultPrice`, per D33's Price
resolution mechanism — verified end-to-end (see walkthrough 2 below).

**Applying the preventive lesson from this codebase's own `ProductPicker`
premature-write Blocker (see that entry above).** `VenuePicker` never
writes to the store — like `ProductPicker`, it only returns a `VenueRef`
(`{kind:'existing', venueId}` or `{kind:'new', displayName}`) to its
caller, held as local pending state in `NuevoEvento` until "Guardar evento"
resolves it atomically inside `createEvent`. Applied preventively here
rather than found as a bug, since the exact same shape of mistake (a picker
writing a real aggregate before the form's own atomic save) was already a
real, fixed defect in this same codebase for Product.

**Home resolution (`HomeScreen.tsx`, new `EventResume.tsx`).** A new branch
sits between "active Session" and "cold start/idle": Event active, no
Session currently active → `EventResume` ("Continuar Día N," home.md §3.6),
reusing `Idle.module.css`'s own topbar/wrap/content shape rather than
inventing new visual treatment, and carrying the same NFC-Not-Ready one-time
mention `Idle.tsx` already shows (for consistency, since a demo-path
Business — the only one that can ever set `defaultSellingMode='nfc'` in
this build — can now genuinely reach this branch through Eventos, unlike
before). `Idle.tsx` gained the upcoming-scheduled-Event card (§3.5) — visually
secondary, tappable only into Eventos' detail screen, never into starting a
Session. `SessionHeader.tsx` gained an optional `title` prop (`Selling.tsx`
resolves `"{Venue.displayName} · Día N"` for an Event-linked Session, `home.md`
§3.7b's own convention) and `CloseSummary.tsx` gained an eventId-aware
"Día N cerrado" + Venue-name variant — **no explicit spec text exists for
this exact label; a disclosed, low-stakes judgment call**, per the
dispatching task's own explicit permission. Both verified rendering
correctly in walkthrough 1 below ("PLAZA NORTE · DÍA 1" / "Día 1 cerrado").
The pre-existing "nothing scheduled → Iniciar Venta Rápida" branch (Slice 1)
is untouched — verified by re-running Slice 1's own Quick Session path in a
fresh, event-free seed (still Quick Session, still "Venta rápida," title
unaffected by the new `title` prop's default).

**Eventos shell** (`src/screens/Events/`) — `EventsScreen.tsx` follows
`InventoryScreen`'s own `{mode, ...}` internal view-state pattern
(`list`/`new-event`/`detail`). Built: `EventsColdStart` (§3.3); `EventsList`
(§3.4/§3.5 — Activo/Próximos/Pasados, each section absent when empty, the
zero-Session Pasado card, ambient post-save/post-cancel confirmation, fixed
in this pass so a stale message can never survive an unrelated return to
the list — see "a real, if small, bug" below); `NuevoEvento` (§3.6 — Lugar/
Tipo pickers via new `VenuePicker`/`EventTypeSheet` components, Empieza
defaulting to hoy with Termina auto-following until manually edited, D17's
inline overlap-validation variant with EVT-Q1's exact engagement-gated
visibility and "si agendas para hoy" conditional copy); `EventDetail`
(scheduled §3.11 + cancel confirm §3.12/§3.13, active no-session-today §3.14
+ vendiendo-ahora §3.15, closed §3.16 + zero-Session §3.17); `AdjustPrices`
(§3.19/§3.20, D33 — including its zero-Catalog-Product empty-state variant).

**Cross-screen wiring (`App.tsx`).** New `eventsView` state, mirroring
`inventoryView`'s own pattern — **deliberately persists across tab
switches** within `App`'s own lifetime (verified in walkthrough 1: tapping
away to Hoy mid-Sale and back to Eventos correctly resumes the same Event
detail screen, not a reset to the list, since neither `EventsScreen` nor
`App` unmounts on a tab switch). Home's upcoming-Event card →
`onNavigateToEvent(eventId)` → Eventos' scheduled-detail screen (§3.11), the
identical destination `events.md` §3.11 itself names for this entry point.
Eventos' "Continuar Día N"/"Vendiendo ahora" → `startSession(eventId)`
(safe no-op if already active) then `onNavigateToHoy()` → Hoy, resuming
selling exactly as if tapped from Home directly (§4's own framing:
"identical mechanism to home.md §2/§3.6," never a second selling surface).
"Ver resumen en Resultados" → the existing honest `Placeholder` pattern
(title "Resultados"), the same treatment already given to Configuración/
Asignar Tags — not a new category of gap.

**Disclosed simplifications, named rather than silently resolved:**
- **Eventos' cold-start test uses "nothing currently visible to show"
  (`hasAnyVisibleEvent`, all three sections empty) rather than the literal
  "no Event ever scheduled."** A Business whose only-ever Event was
  cancelled would, read literally, have `state.events.length > 0` while
  every list section is legitimately empty (§3.13: a cancelled Event
  "simply no longer appears anywhere in this list") — a combination
  `events.md` doesn't explicitly design for. This build shows the honest
  cold start in that case instead of an Events list with every section
  silently absent and no CTA-adjacent explanation, the same "show what's
  actually there" posture Home/Inventario's own cold starts already apply.
  Verified directly in walkthrough 3 below (cancelling a Business's one
  scheduled Event, alongside two other real Events, correctly stays on the
  list view with the cancelled one simply gone — the edge case itself,
  zero real Events left at all, wasn't separately re-verified beyond
  reading the selector logic, since it's a one-line boolean condition).
- **§3.9's write-failure state ("No se pudo guardar," Reintentar) is a
  real, correctly-rendering branch in `NuevoEvento.tsx`, never triggered
  through real interaction** — the same disclosed-not-wired convention
  this codebase already established for every other write (Lot/Sale/
  Authentication/Onboarding). `createEvent`'s `ok:false` path is, in
  addition, dead by construction once `canSave` already excludes an
  overlap client-side — so even a hypothetical future failure-injection
  harness would need to inject the failure somewhere `createEvent`'s own
  logic, not the overlap check, to ever reach it.
- **§3.18 (defensive load error) and §3.1/§3.2 (Resolving, near-instant/
  slow) are architecturally inapplicable in this build, not omitted** — the
  identical structural reason already established (silently, by precedent)
  for Home/Inventario's own missing §3.1/§3.2/defensive-fallback states:
  state loads synchronously from `localStorage`, with no observable async
  boundary to represent a "resolving" phase or a load failure.
- **Q6 (`product/02-ux/product-decisions.md`) — whether Event `type` is a
  closed or merchant-extensible list — stays open, exactly as `events.md`
  §3.8 itself specifies.** `EventTypeSheet` shows no "add a new type"
  affordance, matching the approved spec's own conservative choice pending
  that answer.

**A real, if small, bug found and fixed during this pass's own review, not
cosmetic.** `EventsScreen`'s first draft stored a single `ambientMessage`
value in local state, set right before switching to list mode. Because
`eventsView.mode` transitioning through `detail`/`new-event` and back to
`list` remounts a fresh `EventsList` instance each time (a different
component entirely renders in between, not the same instance re-rendering),
an unconsumed ambient message from an earlier save/cancel would still be
sitting in `ambientMessage` the next time she returned to the list for an
unrelated reason (e.g., backing out of a detail screen she'd merely been
looking at) — showing a stale "Evento agendado ✓" or "Evento cancelado ✓"
that didn't just happen. Fixed by clearing `ambientMessage` the instant she
navigates *away* from list mode (`EventsScreen`'s own `go()` wrapper), so
only a message set immediately before the very next return to list can ever
render. Verified directly: walkthrough 1's Eventos-tab return mid-Sale (no
save/cancel involved) shows no stale toast at all.

**Verification.** `tsc -b && vite build` clean, zero errors, confirmed both
mid-pass and at the end. Three scripted Puppeteer walkthroughs against a
live Chrome instance (not mocks), screenshots reviewed at each step:
1. **Full same-day Event lifecycle:** Eventos cold start → Agendar evento
   (new Venue "Plaza Norte," Tipo Bazar, dates left at their hoy default,
   Guardar evento) → ambient "Evento agendado ✓," card lands in Activo
   ("Plaza Norte · Bazar / Día 1 de 1 · 13 ago") → tap card → scheduled...
   no, active-no-session detail ("Continuar Día 1") → tap → Hoy, Selling
   header reads "PLAZA NORTE · DÍA 1" (eventId-aware `SessionHeader`,
   confirmed) → tap a tile (real stock, real FIFO consumption) → switch to
   Eventos mid-Sale → **`eventsView` correctly resumed the same detail
   screen** (not reset to list), now showing "Vendiendo ahora · Día 1 ▸" →
   tap it → back to Hoy, Sale still open → Finalizar Venta → receipt total
   settles to the correct `$350` (an initial `$300` reading was the
   documented count-up animation still in flight, the same precedent
   already named in this README's Authentication pass, not a bug) →
   dismiss → Cerrar jornada de venta → close summary reads "Día 1 cerrado /
   Plaza Norte / 1 venta registrada / $350 en total" (eventId-aware
   `CloseSummary`, confirmed) → final `localStorage` dump confirmed
   `Session.eventId`, `SaleItem.pricePaid`, and the written `Event`/`Venue`
   rows all correct.
2. **Home's upcoming-Event card, Ajustar precios, D17 overlap.** Seeded a
   scheduled Event 5 days out ("Plaza Toluca · Expo," `bazaarCost: 3500`) →
   Home idle correctly shows the card ("Plaza Toluca / empieza en 5 días")
   → tap → Eventos scheduled detail (Costo: $3,500 shown, "empieza en 5
   días" + full date range both correct) → Ajustar precios → zero-override
   list (Bolsas $350) → edit → Guardar precio ($500) → list echoes the
   override → back twice to the Events list (Próximos section correct) →
   Agendar evento at the same Venue, Tipo Bazar, dates still at their hoy
   default (no conflict yet, since the existing Event starts 5 days out) →
   edited Empieza to the same future start date → **the D17 overlap message
   appeared instantly** ("Esas fechas se cruzan con Plaza Toluca (18-20 de
   agosto). Ajusta las fechas para continuar."), Guardar evento correctly
   disabled → final state dump confirmed `priceOverrides: [{eventId,
   productId, overridePrice: 500}]`. (Two apparent failures during this
   walkthrough's first draft — a mis-typed override reading "$350,500" and
   a conflict that never appeared — were both test-script artifacts, not
   product bugs: React-controlled `<input>` elements need their value set
   through the native property setter for React's own change handler to
   fire at all, a well-known Puppeteer/React testing gotcha, not a defect
   in `AdjustPrices.tsx` or `NuevoEvento.tsx`. Fixed the harness, re-ran,
   both confirmed correct.)
3. **Zero-Session Pasado, cancel flow, EVT-Q1 wording.** Seeded three
   Events at once (active today, scheduled 10 days out, closed with zero
   Sessions ever) → list correctly renders all three sections, the
   zero-Session card reading "Ixtapan · Bazar / Sin ventas registradas" →
   its detail screen correctly reads "No registraste ventas en este
   evento." with no CTA → cancel the scheduled Event ("¿Cancelar el evento
   en Plaza Metepec?" / "No, mantenerlo" / "Sí, cancelarlo") → ambient
   "Evento cancelado ✓," the Próximos section (which had exactly that one
   card) correctly disappears entirely, `cancelledAt` confirmed set in the
   final state dump → fresh Agendar evento at the still-active Venue, dates
   untouched at their hoy default, first engagement (picking Lugar) →
   **the conflict message correctly read "Si agendas para hoy, esas fechas
   se cruzan con..."** (the EVT-Q1 conditional framing, confirmed distinct
   from walkthrough 2's plain "Esas fechas se cruzan con..." wording once a
   date is manually edited).

**No genuine blocker the Architecture Gap Analysis didn't anticipate.**

**`ux-critic` remediation (2026-08-13) — four findings fixed, one batch.**
(1) `EventResume.tsx`'s Venue-name paragraph was using `Idle.module.css`'s
`.readinessLine` (the NFC-Not-Ready warning-note style) instead of a
Venue-identity treatment; switched it to `Idle.module.css`'s existing
`.upcomingVenue` class, matching how `Idle.tsx`/`SessionHeader.tsx`/
`EventDetail.tsx` all already render Venue-identity facts. The actual
warning-note paragraph below it is untouched, still `.readinessLine`.
(2) `NuevoEvento.module.css`'s `.errorBody` (the "No se pudo guardar…"
write-failure message) was plain `var(--color-obsidian)` instead of
`brand-guide.md`'s required Error red; now `var(--color-error)`, matching
the same write-failure treatment already used in `SellingGroups`/
`BusinessIdentity`/`PhoneStep`/`CodeStep`. (3) `NuevoEvento.tsx` had no
guard against Termina < Empieza; added `min={startDate}` on the Termina
date input and folded `endDate >= startDate` into `canSave`, so Guardar
evento can't be tapped in that state even if the native `min` is
bypassed. (4) `Placeholder.tsx`'s "what this prototype covers" copy still
omitted Eventos even though it's now fully built; updated to list Hoy,
Inventario, registrar mercancía, vender, el recibo y Eventos. `tsc -b &&
vite build` clean after all four.

**`ux-critic` Horizontal Journey Review remediation (2026-08-13) — two
findings fixed, one batch.** (1) **HJR-EVT-M1** — `NuevoEvento.tsx`'s `<h1>`
reused the exact CTA copy ("Agendar evento" — `EventsColdStart.tsx`,
`EventsList.tsx`) as its own destination heading, the identical defect
shape already found and fixed once for Inventario (`HJR-INV-M1`:
"Registrar mercancía" CTA vs. "Registrar mercancía" heading, resolved by
differentiating into an action-verb CTA vs. a "you are now here"
destination heading — see `product/02-ux/ux-critic-findings.md`, which had
already flagged this exact Eventos recurrence as out-of-scope-but-expected
at the time). Applied the same resolution shape: the CTA copy on
`EventsColdStart.tsx`/`EventsList.tsx` is untouched; only
`NuevoEvento.tsx`'s heading changed, from "Agendar evento" to "Nuevo
evento." (2) **HJR-EVT-M2** — `EventDetail.tsx`'s "Ver resumen en
Resultados" hand-off reaches the shared `Placeholder` component with
`onBack={() => setSubView('main')}` (back to that same Event's own detail
screen, still inside Eventos), but `Placeholder.tsx` hardcoded its
back-button label as "← Volver a Hoy" unconditionally — accurate at every
other call site (`App.tsx`, `HomeScreen.tsx`, both of which do return to
Hoy) but wrong at this one. Added an optional `backLabel` prop to
`Placeholder`, defaulting to the existing "← Volver a Hoy" so every other
call site is unaffected; `EventDetail.tsx`'s call site now passes "← Volver
al evento," matching where the tap actually lands. `tsc -b && vite build`
clean after both.

## Sold-out tile tap feedback fix (2026-08-13) — `merchant-user-tester` finding, `product/02-ux/experience-review-2026-08-13-eventos.md`

**Finding.** Walking the live selling screen for a newly-scheduled Event, Ana's
one product showed "0 disponibles" (no stock registered during onboarding),
correctly dimmed and non-tappable per `home.md` §3.9 — but tapping it produced
no message or hint that stock needed to be registered first. She had to guess
to find Inventario herself. Independently Verified, routed as a direct fix
(unambiguous bug, no scope question). This isn't Eventos-specific: a
zero-stock tile in `ProductTile.tsx` (`Selling.tsx`'s selling grid, shared by
every Session regardless of `eventId`) behaves identically either way — fixed
once, at the shared component, not duplicated per entry path.

**Named tension with the approved spec, not silently absorbed.** `home.md`
§3.9 explicitly states: *"Its tile is dimmed and not tappable; the '0
disponibles' caption is the only difference from a normal tile, and is the
only signal needed — no separate error message on tap, because there's no tap
to respond to."* That sentence describes a native `disabled` `<button>` — on
a real device a tap on it is swallowed entirely, so under that model "there's
no tap to respond to" is literally true. The `merchant-user-tester` finding is
direct evidence that assumption doesn't hold in practice: a first-time
merchant does tap it, gets nothing, and reads the app as broken rather than
"needs stock." This build now deliberately diverges from that sentence's
literal behavior; per this folder's own terminology-drift discipline (D42,
this file's own `CLAUDE.md`), flagged here explicitly rather than treated as
silently canonical — recommend `ux-designer` fold an amendment into `home.md`
§3.9 formalizing this (the dimming/non-add-to-sale behavior itself is
unchanged; only "no tap to respond to" needs correcting to describe the new
ambient-hint behavior).

**Fix.** `ProductTile.tsx` no longer uses the native `disabled` attribute for
a sold-out tile (which is what was blocking pointer events from ever firing)
— it uses `aria-disabled` for the same "this is not currently actionable"
semantics, while staying a live element that still receives the tap. A new
optional `onDisabledTap` prop fires instead of `onTap` when `available <= 0`;
left unwired by a caller, a sold-out tap is still a harmless no-op, same as
before. `Selling.tsx` wires it to the same ambient, self-dismissing toast
mechanism Eventos already established (`EventsList.tsx`'s local
`toast`/`ambientMessage` pattern, e.g. "Evento cancelado ✓") rather than
inventing a new one — a 2.4s auto-dismissing message reading "Necesitas
registrar stock de {producto}." Deliberately no trailing "✓" and
`--color-warning` rather than `--color-success`: this isn't confirming a
completed action, it's explaining why the tap didn't do anything.

**Small, disclosed gap-fill: uniform copy, no "sin registrar" vs. "0
disponibles" distinction.** `inventory.md` §3.4 distinguishes a Product
never yet stocked ("sin registrar") from one previously stocked and now sold
out ("0 disponibles") — but that distinction was applied, by the approved
spec's own text, "identically to §3.4/§3.5/§3.12/§3.13/§3.17," all of them
`inventory.md`'s own sections; `home.md` §3.9's selling-grid tile was never
included in that list, and still shows a single unified "0 disponibles"
caption regardless of cause. This fix's toast copy stays equally
undifferentiated ("Necesitas registrar stock de X," true and actionable
either way) rather than introducing a new distinction this screen was never
given — the smallest addition consistent with what's already there, not a
redesign.

`ProductTile.module.css`'s `.tile:active:not(:disabled) .surface` press-scale
rule updated to `.tile:active .surface` (the `:disabled` attribute selector
is now permanently false for a sold-out tile) — `.soldOut`'s own rule, later
in the same file at equal specificity, still wins on background/opacity/
border, so the muted look is unchanged; only the press-scale transform now
also plays on a sold-out tap, a small tactile "yes, that registered" cue
ahead of the toast itself.

`tsc -b && vite build` clean, zero errors, confirmed after the fix.

## Same-day-resume trust-gap fix (2026-08-13) — `merchant-user-tester` finding,
`product/02-ux/experience-review-2026-08-13-eventos.md`, `architect-questions.md`
Q19

**Finding.** Closing a working day's Session and later reopening "Continuar
Día N" showed a fresh `$0` running total with nothing on screen indicating a
closed Session's Sales already existed for today — the tester read this as
data loss. It isn't: Sessions and Sales are never deleted, only not
surfaced. Closed by a spec amendment applied directly to `product/02-ux/home.md`
(§3.4/§3.5/§3.6) and `product/02-ux/events.md` (§3.14) — both Approved,
implemented here as their implementation contract, not designed in this
prototype.

**Selector (`src/domain/selectors.ts`).** New `todaySalesSummary(state,
eventId: ID | null)` — sums `SaleItem.pricePaid` and counts finalized Sales
across every Session matching `eventId` (`null` for Quick Session scope,
the same convention `Session.eventId` itself already uses) whose calendar
date (`Sale.finalizedAt`) is today; returns `null` on zero matching Sales
so the line is simply absent in the common case, never a rendered `"$0 · 0
ventas"`. Reuses the identical Session-set-by-`eventId` shape
`eventDayRows`/`dayNumberForDate` already scope to — no new query. No file
under `src/domain/` besides this one addition was touched.

**Home (`Idle.tsx`, `EventResume.tsx`, `HomeScreen.tsx`).** Both components
gained an optional `todaySales` prop, resolved once in `HomeScreen.tsx`
(`todaySalesSummary(state, null)` for `Idle`'s Quick Session scope,
`todaySalesSummary(state, activeEvent.id)` for `EventResume`'s Event scope)
and passed down — never recomputed inside the presentational components.
Renders as "Ya vendiste $X · N ventas hoy" between the greeting/Día-N
headline and the primary CTA, exactly the position both wireframes show,
coexisting with (not replacing) the existing upcoming-Event card and the
§3.6a NFC-readiness/capability line already there. New `.todaySalesLine`
class in `Idle.module.css` (shared by both components) — plain factual
styling (`--color-obsidian`, no warning/action treatment), distinct from
`.readinessLine`'s advisory tone, since this line states a fact already
true rather than something to act on.

**Eventos (`EventDetail.tsx`).** The active/no-Session-opened-today branch
(`!activeSession`, i.e. specifically the §3.14 "Continuar Día N" case, not
§3.15's "Vendiendo ahora") gains a row — "Hoy (Día N) · $X · N ventas hasta
ahora" — appended after any existing past-Día rows, deliberately worded
with "hasta ahora"/"Hoy (Día N)" (not the past-Día row's "Día 1 · 12 jul · 5
ventas · $610" shape) so it never reads as a finished, closed day. Scoped
out of the `activeSession` branch entirely — a live in-progress Session
already reads as "Vendiendo ahora" on its own terms, so this fact isn't
duplicated there.

**Verification.** `tsc -b && vite build` clean, zero errors. Manually
walked: close a Quick Session with 1+ Sales, reopen Home same day → "Ya
vendiste $X · N ventas hoy" renders above "Iniciar Venta Rápida"; identical
check for an Event-linked Session → "Continuar Día N" on both Home and the
Event's own detail screen. First Session of the day (no prior Sales) →
line absent on all three surfaces, base states pixel-identical to before
this fix, confirming the "absent in the common case" rule holds.

**Follow-up, same day (Product Owner decision, on top of this fix):** a
`merchant-user-tester` re-walk of the fix above confirmed the Home-level
reminder works, but found the trust gap reproduces one screen later — the
live selling screen's own `SessionHeader` ("Hoy: $X · N ventas") is
Session-scoped, so it still read `$0` the instant she resumed selling,
the exact number she's actually looking at continuously. The Product Owner
ruled this header should be **context-scoped** instead: "the merchant
interprets 'Hoy' as everything sold today in the context she's currently
working in" — every Quick Session today for a Quick Session, every Session
under the same Event today for an Event-linked one. `Selling.tsx` now
computes `contextTotals = todaySalesSummary(state, session.eventId) ?? {
total: 0, count: 0 }` (reusing the exact same selector, defaulting to zero
since this header must always render a value, unlike the conditional
ambient line above) and feeds it to `SessionHeader`'s `revenue`/`count`
props, in place of the prior `sessionTotals(state, session.id)`. "Venta
actual" (`VentaActualTray`) and the close-confirmation dialog's own preview
(`totals`, still `sessionTotals`) are deliberately untouched — both report
on a single committed transaction/Session, not an ambient status figure —
per `home.md`'s own amendment reasoning for exactly this split. The close
dialog's preview line is relabeled "Esta sesión: N ventas · $X" (was bare
"N ventas · $X"), since it now overlays a header that can legitimately show
a larger number, and an unlabeled pair of differing figures would reproduce
the same trust gap one layer deeper. Verified via scripted Puppeteer with a
seeded multi-scope fixture (a closed Quick Session + an active one, a closed
Event-A Session + an active one, plus a same-day Event-B Session as a
non-bleed control): Quick Session header correctly summed only Quick
Sessions, Event-A header correctly summed only Event-A Sessions, neither
leaked into the other's total, and the close-confirm dialog's own
session-scoped figure remained correct and simultaneously visible alongside
the new context-scoped header. `tsc -b && vite build` clean throughout.
Full reasoning, including why the close-confirm/closing-summary screens
stay Session-scoped rather than following the header, is in `home.md`'s own
2026-08-13 amendment (§3.7, §10).

