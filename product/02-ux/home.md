# Home (Hoy) — UX Specification

Status: Approved. Full UX Remediation cycle complete — HOME-B1, HOME-B2,
HOME-M1, HOME-M2, HOME-M3, HOME-M4 fixed by `ux-designer`, verified clean by
`ux-critic` (zero remaining Blockers/Majors), and passed `reviewer`'s
Foundation-consistency check (no Blockers; one cross-document Important
finding — stale post-renumbering section references — corrected by Main).
Scope: `Hoy`, the first of four top-level nav items per
`product/00-foundation/information-architecture.md`. Implementation-independent —
low-fidelity only, no visual design.

## 1. Merchant goal

Ana doesn't open the app to "check Home." She opens it to close the gap between
*having her phone out* and *being able to register whatever a customer just
bought* — because the customer is standing there, not waiting. Two real contexts:

- **About to sell** (arriving at the bazaar, or a walk-in appears): she needs to
  be in a state where tapping a product records a sale, in essentially zero
  perceptible steps.
- **Already selling, glancing back** (phone locked, backgrounded, put down
  between customers): she needs to land exactly back where she left off — no
  re-navigation, no re-deciding anything.

A distant third: closing out at the end of the day. Home's job is to make the
first two cases indistinguishable from "just start selling," and never force her
to re-answer a question the system already has the answer to (is there an event
today, is a session open, buttons-or-NFC).

## 2. Resolution / decision logic

Evaluated in this order, automatically, on every Home open:

```
1. Is there a Session with status = active (any eventId, including null)?
     → YES: selling becomes Home's default entry point. Stop here — highest
       priority, nothing else matters if she's mid-selling.

2. Is there an Event with status = active, with no Session opened yet under
   it today?
     → YES: show "Continuar Día N" (N = existing Sessions under this eventId
       + 1, computed, never asked).

3. Does the Catalog have at least one Product ever registered (has she ever
   registered a Lot)?
     → NO:  cold-start empty state → route to Inventario.
     → YES: idle state → "Iniciar Sesión Rápida" is always the primary
       action. If an Event is scheduled but not yet active, show it as a
       small, non-blocking informational card — it never gates or adds a
       step to Quick Session (domain-model.md: "Quick Session works
       regardless" of eventScheduling).

4. Resolution itself fails or times out?
     → fallback safe state — never a dead end (see §5).
```

**Framing note (approved refinement):** during an active session, selling
becomes the *default entry point* of the application — not a locked screen. The
merchant can always navigate to Inventario, Eventos, or Resultados, or reach
session controls, but the application always resumes where selling happens. The
persistent bottom nav (`Hoy · Inventario · Eventos · Resultados`, per the frozen
IA) stays visible and tappable through every state below, including all selling
states. Opening Hoy while actively selling takes her directly back to selling
(§2's priority order is unconditional) — but stepping away is always one tap,
never obstructed, and never gated by a confirmation.

**Session-controls interlock (added — resolves HOME-M2):** session controls
(▾ → the sheet in §3.7a) are reachable at any time, but carry exactly one
interlock: if "Venta actual" holds 1+ items, tapping "Cerrar sesión" from that
sheet does not open the close-session confirmation (§3.11) — it opens a
blocking notice instead (§3.11a) that routes her back to the open Sale so she
can finish or explicitly cancel it first. This is the one control in the whole
doc that doesn't go where it says on a first tap: closing a Session is the sole
deliberately irreversible action in the whole flow (§10), so it's the one
control that can never be allowed to silently discard real, registered-but-
unfinished work. This interlock is specific to *closing the Session* — it does
not apply to navigating to another tab mid-Sale, which is always safe and
always resumes exactly where she left off (§3.13, resolving HOME-B2 below).

## 3. Low-fidelity wireframes

Conventions: `[ ]` = tappable. Plain text = passive/informational. Bottom row is
the persistent nav bar on every state, current tab in brackets.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Empty skeleton, no copy: nothing announces "loading" for something that
  should be imperceptible. *global-principles.md*, "technology should
  disappear."
- Nav bar present even before resolution finishes: navigation is never blocked
  by the app figuring out its own state.

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- One calm, plain-language line, never a technical status string.
  *global-principles.md*, "business language before technical language."

### 3.3 Cold start (no Product ever registered)
```
┌───────────────────────────────┐
│  Nahui                         │
│  Aquí vas a ver tu día de       │
│  venta en cuanto registres      │
│  lo que traes.                  │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Single honest CTA, no fake selling button: a botón leading to an empty
  product grid isn't a shortcut, it's a disguised dead end.
  *global-principles.md*, "the fastest interaction is the one that never
  happens."
- Routes into Inventario, an existing nav tab — no new destination invented for
  this one case. (Exactly where within Inventario is resolved in
  `product/02-ux/inventory.md` §10: directly into Registrar Mercancía, not
  Inventario's own cold-start screen.)

### 3.4 Idle — no Event today, ready
```
┌───────────────────────────────┐
│  Nahui                         │
│        ¿Vas a vender hoy?       │
│   [   Iniciar Sesión Rápida  ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Exactly one primary action, large, centered: hierarchy reflects
  *architecture-principles.md* #3 — Quick Session is first-class, not a
  fallback, because `eventId` is genuinely optional in the model, not a UI
  afterthought.

### 3.5 Idle — ready, with an upcoming (not-yet-active) Event
```
┌───────────────────────────────┐
│  Nahui                         │
│  ┌───────────────────────────┐ │
│  │ Bazar Plaza Norte          │ │  informational card, not a button
│  │ empieza en 3 días           │ │
│  └───────────────────────────┘ │
│   [   Iniciar Sesión Rápida  ]  │  still the primary action
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Event card is visually secondary and tappable only into Eventos, never into
  starting a session: keeps scheduling awareness read-only so it can never add
  a step to Quick Session. *domain-model.md*, "Quick Session works regardless."
- "Iniciar Sesión Rápida" keeps full prominence even with the card present.

### 3.6 Event active, no Session opened today
```
┌───────────────────────────────┐
│  Nahui                         │
│      Bazar Plaza Norte          │
│      Hoy es tu Día 2             │
│      [   Continuar Día 2     ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- "Día 2" stated as fact, not asked: computed automatically from existing
  Sessions under the `eventId` (*domain-model.md*, read-side query across
  Sessions sharing that ID). *global-principles.md*, "never ask twice."

### 3.7 Session active — ready, no Sale open (mode-agnostic shell)
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │  header = ambient info + session-controls
│ Hoy: $850 · 6 ventas             │  entry point
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│   [   zona de registro,          │  mode-appropriate content fills here
│       según registrationMode  ]  │  (see 3.9 / 3.10)
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Header doubles as passive info and the session-controls entry point —
  tapping "▾" opens a small sheet (§3.7a) rather than acting immediately.
  Concrete implementation of "session controls stay reachable" from the
  framing note in §2 (updated — resolves HOME-M4; see §3.7a for what the
  sheet actually contains and why).
- "Venta actual: (vacía)" shown even with nothing pending: ambient visibility
  so a stale/leftover sale is never invisible.
- Registration surface is the single biggest area on screen, always exactly
  one mode. *architecture-principles.md* #1.

### 3.7a Session controls (▾) — sheet (new — resolves HOME-M4)
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas             │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  [       Cerrar sesión        ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Resolves HOME-M4. The earlier draft's "▾ reveals Cerrar sesión / ver detalle
  de hoy" referenced a second feature — "ver detalle de hoy" — that had no
  wireframe, no entry in §5, and no defined relationship to the ambient
  header. It's removed here rather than left dangling. The ambient header
  line ("Hoy: $850 · 6 ventas") already shows today's running total; anything
  deeper than that belongs to Resultados once the day's Sessions actually
  close — the same scope boundary `product/02-ux/events.md` §3.16/§10
  established for Eventos after Q7's resolution (Eventos doesn't duplicate
  Resultados' analytics; it hands off). Inventing a live, mid-day analytics
  screen inside Home would both duplicate that scope and break
  *architecture-principles.md* #6 (Home/Selling only ever reads Selling data;
  it has no analytics surface of its own).
- Shown as a small sheet, not collapsed into a single hardcoded action,
  because `information-architecture.md` ("Onboarding and Settings") already
  commits this exact affordance — "the header's ▾" — as the future
  reachability point for Settings (`decision-log.md` D13). Keeping it a
  (currently one-item) sheet is forward-compatible with that frozen
  commitment. Settings itself remains out of scope for this document and is
  not designed here.
- Today, "Cerrar sesión" is the sheet's only entry. Tapping it proceeds to
  §3.11 (Venta actual empty) or §3.11a (Venta actual has 1+ items — blocked,
  resolves HOME-M2), per the interlock stated in §2.

### 3.8 Session active — Sale in progress
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: 2 artículos   Cancelar│
│ Pijama · Calcetines               │
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- "Finalizar Venta" is el largest tappable element on the screen: the one
  deliberate boundary marker in the loop — a Sale's start is implicit, its end
  is the only thing worth ceremony (see §10, Decisions made).
- "Cancelar venta actual" now sits inline with the "Venta actual" line itself
  — physically separated from "Finalizar Venta" by the entire registration
  zone, instead of stacked directly above it (updated — resolves the
  adjacency half of HOME-M1). Tapping it never wipes the Sale instantly; it
  opens an inline confirm (§3.8b).
- Item list by Product name only, never a unit/lot reference.
  *architecture-principles.md* #4.
- An item that failed to sync shows a small, non-blocking marker next to it
  (see §3.8a) — the list shown here is always the true, current contents of
  the Sale, never a display that can silently diverge from what's actually
  saved (resolves HOME-B1 for the tap-to-add action).

### 3.8a Tap-to-add-item — sync states (new — resolves HOME-B1)
```
Optimistic add (instant — no visible loading state on the item at all):
┌───────────────────────────────┐
│ Venta actual: 3 artículos   Cancelar│
│ Pijama · Calcetines · Sudadera     │  new item appears the instant she taps
├───────────────────────────────┤     — never a spinner, never a delay
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
└───────────────────────────────┘

Background sync retrying (silent — nothing changes on screen):
same as above — she keeps tapping/selling uninterrupted while a retry
happens behind the scenes; never surfaced unless it genuinely fails

Persistent sync failure (only after automatic retries are exhausted):
┌───────────────────────────────┐
│ Venta actual: 3 artículos   Cancelar│
│ Pijama · Calcetines · Sudadera ⚠   │  small marker on the affected item only
├───────────────────────────────┤
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
└───────────────────────────────┘
tapping the flagged item → "No se pudo guardar Sudadera. [ Reintentar ]"
shown inline, never a full-screen interruption
```
- An item appears in "Venta actual" the instant she taps a product tile —
  never a loading state on the item itself. *global-principles.md*,
  "technology should disappear." This is possible because Sale is
  specifically architected as its own cheap-to-append aggregate root
  (`architecture-principles.md` #2, `domain-model.md`) so that per-item
  writes never contend on a shared Session lock.
- If the underlying write hasn't confirmed yet, retries happen silently in
  the background — she's never blocked from tapping the next item or
  Finalizar Venta while a retry is pending.
- Only after automatic retries are exhausted does a failure become visible —
  a small, non-blocking marker (⚠) on that one item, never a full-screen
  interruption. She can keep selling around it.
- The guarantee: an item once shown in "Venta actual" is never silently
  dropped by a failed sync — the same guarantee Inventario's Guardar
  mercancía (`inventory.md` §3.10/§3.11) and Eventos' Guardar evento (`events.md`
  §3.8) already make for their own write actions. This closes the gap
  HOME-B1 identified: the two Sale-mutating actions in Home's own loop now
  have an explicit failure/retry guarantee, matching the rest of the
  document family.
- Tapping the flagged item's inline "Reintentar" resolves it and removes the
  marker. If she instead attempts Finalizar Venta while an item is still
  unresolved, that item's sync is retried as part of the same save — see
  §3.8d for what happens if it still can't be confirmed.

### 3.8b Cancelar venta actual — inline confirm (new — resolves HOME-M1)
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: 2 artículos          │
│ Pijama · Calcetines               │
│ ¿Cancelar estos 2 artículos?       │
│      [ No ]   [ Sí, cancelar ]     │
├───────────────────────────────┤
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Replaces the previous zero-confirmation, zero-undo "Cancelar venta actual"
  (resolves HOME-M1). Confirmation happens inline, in place — no navigation,
  no full-screen modal — because this happens mid-transaction with a
  customer present, and Home's <3s bar (`company/backlog.md` #1) still
  applies to everything around it, even while protecting against a costly
  mis-tap.
- Deliberately lighter-weight than Close-session's full dimmed-sheet
  confirmation (§3.11): that action happens at day's end with no customer
  waiting, so more ceremony is affordable there. This one doesn't have that
  luxury — but "no confirmation at all" isn't acceptable either, given it
  destroys already-registered items under direct customer pressure. See §10
  for the reasoning distinguishing the two confirmation weights.
- "No" (not "Cancelar," avoiding the same "cancel-the-cancel" label collision
  `events.md` §3.11 already solved) returns instantly to the normal
  in-progress tray (§3.8), items untouched.
- "Sí, cancelar" clears the tray back to §3.7's empty ready state — the only
  way "Venta actual" is ever emptied without a Finalizar Venta.

### 3.8c Finalizar Venta — saving (near-instant / slow) (new — resolves HOME-B1)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │        │ Bazar Plaza Norte · Día 2   ▾   │
│ Hoy: $850 · 6 ventas             │        │ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤        ├───────────────────────────────┤
│ Venta actual: 2 artículos          │        │        Cerrando venta…          │
│  ▢▢▢▢▢▢▢▢▢▢▢▢ (zona atenuada)      │        │                                │
├───────────────────────────────┤        ├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │   │ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent, brief dim              slow (>~1.5s): one plain line
```
- Identical convention to `inventory.md` §3.10 / `events.md` §3.8 — silent
  unless genuinely slow, one calm plain-language line, never a technical
  status string. Nav bar and header stay live throughout: this never blocks
  navigating away or the running totals from being visible.

### 3.8d Finalizar Venta — error (new — resolves HOME-B1)
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ No se pudo cerrar la venta.        │
│ Tus artículos siguen aquí.          │
│ Venta actual: 2 artículos          │
│ Pijama · Calcetines               │
│      [   Reintentar   ]          │
│      Cancelar venta actual         │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Same failure guarantee as every other write action in the document family
  (`inventory.md` §3.11, `events.md` §3.8): a failed Finalizar Venta never
  drops or half-commits the Sale — the tray survives exactly as it was, with
  both recovery paths (Reintentar, o Cancelar venta actual via §3.8b's
  confirm) still available. Closes the Finalizar-Venta half of HOME-B1.
- If any individual item still carries an unresolved sync marker (§3.8a) at
  the moment Finalizar Venta is attempted, resolving that item is treated as
  part of the same save — she is never shown a "success" that silently
  dropped one item.
- Never a dead end: she can retry, or in the rare case she genuinely needs to
  abandon the sale, cancel it explicitly through the same confirmed path
  everywhere else uses — she's never stuck staring at a broken screen
  mid-transaction.

### 3.9 Session active — `buttons` mode surface
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│  ┌─────────┐  ┌─────────┐       │
│  │ Pijama  │  │Sudadera │       │  ordered most-frequently-sold first
│  │         │  │ / Maxy  │       │
│  └─────────┘  └─────────┘       │
│  ┌─────────┐  ┌─────────┐       │
│  │Bufandas │  │Calcetines│      │
│  │         │  │0 disponibles│    │  sold out — dimmed, not tappable
│  └─────────┘  └─────────┘       │
│  ┌─────────┐  ┌─────────┐       │
│  │   …     │  │   …     │       │  grid scrolls for the rest of the Catalog
│  └─────────┘  └─────────┘       │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Large, equally-weighted 2-column grid, scrollable — reuses the layout
  already validated with Ana in `product/01-validation/registro.html`, in
  service of the <3s bar (`company/backlog.md` #1). The grid scales to
  however many Products the Catalog holds; nothing caps it at a fixed tile
  count, since Inventario itself places no ceiling on Catalog size
  (`inventory.md` §2, "Inventario supports unlimited Products"). Resolves the
  scaling half of HOME-M3.
- Tiles are ordered most-frequently-sold-first, computed automatically from
  her own Sale history — not typed or configured. Keeps her actual top
  sellers within the first screenful without scrolling, regardless of how
  large the Catalog grows. *global-principles.md*, "every repeated decision
  should become automation." A Product with no sales history yet sorts after
  anything with sales, in registration order.
- A sold-out Product (0 disponibles) stays visible in the grid rather than
  disappearing — Product persists independent of stock (`domain-model.md`
  D2), the same rule `inventory.md` §3.4 already applies to the Catalog list.
  Its tile is dimmed and not tappable; the "0 disponibles" caption is the
  only difference from a normal tile, and is the only signal needed — no
  separate error message on tap, because there's no tap to respond to.
  Resolves the sold-out half of HOME-M3.
- **"Otro" tile removed.** The earlier draft's fixed 2×2 mockup included a
  generic "Otro" tile with undefined behavior (HOME-M3). Now that the grid
  shows the full Catalog and scrolls rather than capping at 3–4 tiles, every
  sellable Product already has its own tile — there's no remaining case
  "Otro" would cover. A generic catch-all here would either duplicate a
  Product already visible elsewhere in the grid, or imply selling something
  that isn't a registered Product at all — which Home cannot do, since
  Selling only ever *reads* Inventory and never creates a Product into it
  (`domain-model.md` bounded-context table; `architecture-principles.md` #6,
  one-way dependency direction). Removing it is a direct application of
  *global-principles.md*, "the fastest interaction is the one that never
  happens" — no tile without a real, defined action behind it.
- No mode indicator or toggle drawn anywhere. *architecture-principles.md* #1.

### 3.10 Session active — `nfc` mode surface
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│                                │
│     Acerca el tag del            │
│         producto                 │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- No product grid rendered at all — not grayed out, not present: confirms
  *architecture-principles.md* #1 at the layout level; this is a wholly
  different, exclusive surface, matching `vision.md`: "the merchant never
  switches between them while selling."

### 3.11 Close-session confirmation
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas             │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │  ¿Ya terminaste por hoy?    │ │
│  │  6 ventas · $850             │ │
│  │  [ Cancelar ]  [ Sí, cerrar ]│ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- The one place in the whole flow that deliberately asks rather than
  automates: rare, consequential, and genuinely not inferable — the
  intentional exception to, not a violation of, "never ask twice."
- Selling screen stays visible, dimmed, behind the sheet rather than replaced:
  "Cancelar" returns instantly to exactly where she was.
- **Reached only when "Venta actual" is empty** at the moment "Cerrar
  sesión" is tapped from §3.7a's sheet — if 1+ items are still pending, she's
  routed to §3.11a instead, never here with unfinished work silently at risk
  (updated — resolves HOME-M2).

### 3.11a Cerrar sesión blocked — Venta en curso (new — resolves HOME-M2)
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas             │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │ Tienes una venta sin         │ │
│  │ terminar (2 artículos).       │ │
│  │ Termínala o cancélala antes    │ │
│  │ de cerrar la sesión.           │ │
│  │         [ Entendido ]          │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Closing is the one deliberadamente irreversible action in the whole flow
  (§10) — an open, unfinished Sale is exactly the kind of real,
  registered-but-not-yet-committed work that must never be silently
  discarded by it. Resolves HOME-M2.
- Deliberately **not** a warn-and-proceed dialog: there's no "cerrar de
  todos modos" option here. "Entendido" routes her straight back to the
  selling screen (§3.8) with the tray completely untouched — Finalizar Venta
  o Cancelar venta actual (§3.8b) are how she resolves it; Cerrar sesión is
  reachable again only once "Venta actual" is empty.
- Consistent with §2's own stated priority order: an active, non-empty Sale
  outranks every other action, including ending the day.

### 3.12 Close-summary (immediate)
```
┌───────────────────────────────┐
│        Día 2 cerrado            │
│    6 ventas registradas          │
│         $850 en total             │
│         [ Ver detalle ]           │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Only two numbers, no breakdown: matches free-tier Resultados scope
  (*domain-model.md* capability table, `subscriptionTier = free`).
- "Ver detalle" explicitly leaves Hoy for Resultados — keeps the boundary
  between "immediate confirmation" and "analysis" explicit.
- No "what do you want to do now?" prompt: next Hoy open resolves
  automatically per §2. *global-principles.md*, "every repeated decision
  should become automation."

### 3.13 Resuming a Session left open after an interruption

Two variants, depending on whether "Venta actual" held anything at the moment
of interruption — both reached exactly the same way (unlocking the phone,
returning from background, switching back from another nav tab and returning
to Hoy). (Updated — resolves HOME-B2; the earlier draft showed only Variant A
and left Variant B undefined.)

**Variant A — Venta actual was empty at the moment of interruption:**
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│   [   zona de registro       ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
Pixel-for-pixel identical to the normal ready state (§3.7/§3.9/§3.10).

**Variant B — Venta actual had 1+ items at the moment of interruption:**
```
┌───────────────────────────────┐
│ Bazar Plaza Norte · Día 2   ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: 2 artículos          │
│ Pijama · Calcetines               │
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
Pixel-for-pixel identical to the normal in-progress state (§3.8) — same
items, same count, nothing silently dropped.

- Resolves HOME-B2. "Venta actual" is always a read of the Sale's true,
  current, server-confirmed state — never a client-only cache that resets on
  relaunch. Reopening the app, unlocking the phone, or switching back from
  Inventario/Eventos/Resultados all land on whichever variant above is
  actually true: an interruption never fabricates an empty tray out of a real
  in-progress one, and never fabricates items that were never really added.
- The earlier draft of this section showed only the empty variant and
  described it as "pixel-for-pixel identical to the normal ready state" —
  accurate for Variant A, silent about Variant B. Both are now specified: the
  deliberate design choice stays the same in both cases — the *absence* of
  anything special, no "welcome back," no "were you still selling?" prompt —
  but "nothing special" has to mean "exactly what was really there," never
  "always reset to empty." *global-principles.md*, "never ask twice."
- This guarantee rests on the same durability requirement §3.8a establishes
  for the tap-to-add action: an item is only ever shown in "Venta actual"
  once it's durably queued for save, so an interruption occurring after that
  point can't make it disappear on resume — whether the interruption happens
  mid-selling or mid-sync-retry.
- Applies identically to switching nav tabs mid-Sale and back — not only to
  phone lock/backgrounding. §2's framing note ("the application always
  resumes where selling happens") already implied this; this section makes
  it an explicit, testable guarantee instead of an implication.

### 3.14 Resolution error / defensive fallback
```
┌───────────────────────────────┐
│  No pudimos confirmar tu         │
│  sesión. Intentando de nuevo…     │
│   [   Iniciar Sesión Rápida  ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- "Iniciar Sesión Rápida" stays present and tappable even mid-failure: the
  worst outcome is Ana unable to register a sale in front of a paying
  customer. Safe *because* `eventId` is genuinely nullable in the model.
  *architecture-principles.md* #3.
- Nav bar unaffected by the error: a Home resolution failure never cascades
  into locking her out of Inventario/Eventos/Resultados.

## 4. Interaction flow (summary)

```
Open app
  → resolve (§2, automatic)
      → active Session exists ─────────────→ selling default (3.7-3.10)
      → Event active, no Session today ────→ "Continuar Día N" (3.6) → tap → selling
      → nothing active, Catalog has Products → "Iniciar Sesión Rápida" (3.4/3.5) → tap → selling
      → Catalog empty ─────────────────────→ cold start (3.3) → Inventario
      → resolution fails ──────────────────→ fallback (3.14), Quick Session always reachable

Inside selling (3.7-3.10):
  tap/scan product → item added instantly to (implicitly opened) current sale (3.8)
      → sync happens silently in the background (3.8a)
      → [rare] persistent sync failure → non-blocking marker on that item (3.8a)
        → inline Reintentar
  → repeat for more items
  → Finalizar Venta
      → saving (3.8c)
      → error (3.8d) → Reintentar, o resolve via Cancelar venta actual (3.8b)
      → success → tray clears → back to 3.7 (ready for next customer)
  → [any point, 1+ items pending] Cancelar venta actual → inline confirm (3.8b)
      → No → back to 3.8, items untouched
      → Sí, cancelar → tray clears → back to 3.7
  → [rare] ▾ → session-controls sheet (3.7a) → Cerrar sesión
      → Venta actual empty     → confirm (3.11) → Sí, cerrar → summary (3.12)
        → next Hoy open re-resolves per §2
      → Venta actual has 1+ items → blocked (3.11a) → Entendido → back to 3.8,
        untouched — must finalize or cancel the open Sale before Cerrar sesión
        is reachable again

Interruption at any point (phone lock, backgrounding, switching nav tabs away
and back to Hoy):
  → resuming (3.13) reflects the Sale's true state exactly as it was — empty
    (Variant A) or with whatever items were already durably added (Variant B)
    — never silently reset, never invented
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no Product ever registered
4. Idle — no Event today, ready, no upcoming Event
5. Idle — ready, with an upcoming (not-yet-active) Event card
6. Event active, no Session opened today — "Continuar Día N"
7. Session active, no Sale currently open — ready for next customer
8. Session controls sheet (▾) — "Cerrar sesión"
9. Session active, Sale in progress (1+ items in "Venta actual")
10. Session active, Sale in progress — item sync retrying (silent, background)
11. Session active, Sale in progress — item sync failed, non-blocking marker + inline Reintentar
12. Cancelar venta actual — inline confirm step
13. Finalizar Venta — saving (near-instant / slow)
14. Finalizar Venta — error
15. Session active, `buttons` mode surface (scrollable, frequency-ordered, sold-out tiles dimmed)
16. Session active, `nfc` mode surface
17. Close-session confirmation (reached only with an empty Sale)
18. Cerrar sesión blocked — Venta en curso (non-empty-Sale interlock)
19. Immediate post-close session summary
20. Resuming a Session left open from an interruption/crash — empty-tray variant
21. Resuming a Session left open from an interruption/crash — non-empty-tray variant
22. Resolution error / defensive fallback

## 6. Minimum step count

| Scenario | Taps to first registered item | Why it can't be fewer |
|---|---|---|
| Nothing scheduled, ready (3.4) | 2 | 1 deliberate "start selling" commitment (protects Session-history integrity, prevents accidental first sale from a stray tap) + 1 to register the item. |
| Event active, no session today (3.6) | 2 | Same reasoning — an existing Event doesn't remove the need for a deliberate day-start moment. |
| Session already open, mid-selling (3.7-3.10) | **1** | The "start" decision was already made earlier; this is the target state for most of the selling day. |
| Cold start, no products (3.3) | n/a — routes to Inventario | Cannot register a sale of nothing; a genuine prerequisite, not a repeated friction. |
| Resuming an unclosed session, either variant (3.13) | **1** | Treated identically to the normal ready/in-progress state — no extra step for having been interrupted, regardless of whether items survived. |

| Recovery scenario | Taps | Why it can't be fewer |
|---|---|---|
| Cancelar venta actual (mid-sale) | 2 (Cancelar + Sí, cancelar) | A deliberate two-tap floor for a destructive action, mirroring the doc's own established confirmation cost for irreversible actions (§3.11/§10) — scaled down to an inline step rather than a full modal, given the mid-transaction, customer-present context (see §10). |
| Cerrar sesión with a pending Sale | 1 (Entendido) to return to selling; 0 taps saved by the interlock itself | The interlock (§3.11a) doesn't add a tap to the happy path — it only appears when she was about to lose real work; "Entendido" is the one tap needed to get back to resolving the Sale. |

Overall floor: **1 tap once selling has begun, 2 taps to begin selling** — the
2-tap floor is a deliberate data-integrity choice (protecting Session-history
accuracy), not an unresolved inefficiency. Error/retry paths (§3.8a/§3.8d,
§3.14) are recovery paths for a failure, not part of this minimum-happy-path
floor, and aren't counted above. Locating a rarely-sold Product in a large
buttons-mode grid (§3.9) may require scrolling in addition to the 1 tap;
scrolling isn't counted as a "tap," and frequency-based tile ordering keeps her
actual top sellers within the first screenful regardless of Catalog size.

## 7. Automation opportunities

- `registrationMode` — read once at Session open, never surfaced or re-asked.
  *architecture-principles.md* #1.
- Which Session to open (Event-linked vs. Quick) — computed from Event status +
  today's date, never a picker.
- "Día N" — computed from existing Sessions under the `eventId`, never typed or
  confirmed.
- FIFO unit allocation in `buttons` mode — invisible to Home/Selling entirely
  (`decision-log.md` D5).
- Resuming an unclosed Session (3.13) — automatic, no "were you still
  selling?" prompt, and now explicit that this holds whether or not items were
  pending (resolves HOME-B2).
- Post-close return to the correct next idle state — automatic, no "what do
  you want to do now?" menu.
- Elimination of the "Nueva Venta" gesture (3.8) — a Sale's start is inferred
  from the first product tap, not declared.
- Background retry of a failed item-sync (3.8a) — automatic and silent; a
  manual "Reintentar" only ever surfaces after retries are genuinely
  exhausted, never on the first hiccup.
- Buttons-mode grid ordering (3.9) — computed automatically from her own Sale
  history (most-frequently-sold-first), never a manual sort she configures.

## 8. Open questions

- **"Día N" counting nuance**: if Ana closes a Session and reopens a new one
  later the *same calendar day* under the same Event (e.g., a lunch-break
  resume), should that count as the same "Día N" or a new day number? The
  domain model doesn't specify a strict 1:1 Session-to-calendar-day rule.
  Escalated to Architect — confirmed genuinely unresolved by the Foundation
  (not just an oversight); logged as Q1 in `product/02-ux/product-decisions.md`
  (moved from `architect-questions.md` — reclassified as a Product Decision
  per `company/CLAUDE.md`'s Decision Ownership policy)
  pending a product decision on which counting rule to use.
- **Removing the "Nueva Venta" gesture** (§3.8, §10) is a real interaction-model
  change from the validated prototype (`registro.html`). Reasoning is solid,
  but since backlog #1 is explicitly evidence-driven, recommend a quick
  re-test with Ana (or simulated, per `/evidence`) before Builder locks it in.
- **Buttons-mode grid scaling and reordering (§3.9)** is also a real
  interaction-model change from the validated prototype, which was only ever
  exercised with a small, fixed set of tiles — it never tested scrolling or
  frequency-based reordering at realistic catalog sizes. Same evidence-driven
  caution as the item above: recommend validating the scrolled/reordered grid
  with Ana, or simulating a larger catalog, before Builder locks in the exact
  scroll and ordering behavior. Not escalated to Architect — this is a
  validation recommendation, not a Foundation ambiguity.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — cold-start CTA is
  removed entirely when there's nothing to sell (3.3) rather than a dead-end
  button; the "Nueva Venta" gesture is removed from the core loop (3.8); the
  upcoming-event card adds zero steps to Quick Session; the "Otro" tile is
  removed from the buttons-mode grid once every Product already has its own
  tile (3.9, resolving HOME-M3); the session-controls sheet (3.7a) no longer
  references an undesigned "ver detalle de hoy" screen (resolving HOME-M4).
- *"Never ask twice"* — resuming an interrupted Session (3.13) never
  re-confirms what the system already knows, and now explicitly never
  reinvents the tray's contents either, empty or not (resolving HOME-B2);
  `registrationMode`, Día N, and which Session to open are all computed,
  never asked.
- *"Technology should disappear"* — loading states stay silent unless
  genuinely slow; the selling surface shows only the one mode-appropriate
  input, never a technical toggle; tapping a product adds it to the tray
  instantly, with sync happening invisibly behind it (3.8a).
- *"Selling is a state, not a navigation destination"* — an active Session
  makes selling the *default* thing Hoy shows, not a place she navigates to or
  gets stuck in. The persistent bottom nav is never hidden or disabled during
  selling.
- *"Business language before technical language"* — every screen uses "Día 2,"
  "Venta actual," "Cerrar sesión," never "Session," "Sale," or
  "InventoryUnit."
- *"Every repeated decision should become automation"* — §7 is the direct
  enumeration of this applied to Home.
- *"The best interface stays out of the merchant's way"* — the
  resolution-failure fallback (3.14) never dead-ends her out of selling; a
  failed tap-to-add or Finalizar Venta never drops her registered items
  (3.8a/3.8d, resolving HOME-B1); an interrupted Sale resumes exactly as it
  was, never silently emptied (3.13, resolving HOME-B2); Cerrar sesión can
  never silently discard an open Sale (3.11a, resolving HOME-M2).

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — `registrationMode` read at
  Session open, never re-asked per Sale; selling surface (3.9/3.10) is
  single-mode, no toggle.
- *#2 (aggregate boundaries follow write-throughput needs)* — the 1-tap-per-item
  core loop, the optimistic instant add + silent background retry (3.8a), and
  the removal of "Nueva Venta" are only safe because Sale is its own
  cheap-to-append root, independent of Session's lock.
- *#3 (optional relationships stay optional in the data model)* — Quick
  Session always works with `eventId` null; the defensive fallback (3.14)
  relies on this being a real modeled property, not a UI trick.
- *#4 (internal-only entities never leak into language)* — InventoryUnit /
  InventoryEntry / SaleItem never appear in Home's copy or structure.
- *#6 (one-way dependency direction)* — Home only reads from Selling/Inventory;
  it never writes into Inventory directly and has no Intelligence/
  Loyalty-claim surface. Directly why the "Otro" tile was removed (3.9) rather
  than reinterpreted as a way to sell something outside the Catalog, and why
  "ver detalle de hoy" was removed (3.7a) rather than redesigned as a
  mid-session analytics screen.

## 10. Decisions made

- **Removed the "Nueva Venta" gesture** present in the original validation
  prototype. A Sale's start is now inferred from the first product tap when no
  Sale is open; only "Finalizar Venta" is an explicit boundary. Mitigated the
  one real risk (stale sale from an interrupted customer) by keeping the
  current-sale tray always visible plus a small "Cancelar venta actual"
  action — which now also carries its own lightweight, inline confirmation
  (§3.8b), rather than reintroducing an explicit start step.
- **2-tap floor to start selling is intentional**, not a residual
  inefficiency — Session start is a real, meaningful business event
  (timestamps hours worked, feeds future Resultados) and deserves one
  deliberate commitment tap, distinct from the act of registering an item.
- **Two deliberate confirmations now exist in the flow, at two different
  weights, not one.** The original draft stated Close-session was "the one
  deliberate confirmation in the whole flow" — no longer accurate once
  Cancelar venta actual gained its own confirm step (resolving HOME-M1).
  Close-session (§3.11) keeps the heavier, full dimmed-sheet treatment: it
  happens at day's end, with no customer waiting, and is genuinely
  irreversible. Cancelar venta actual (§3.8b) gets a lighter, inline confirm
  instead: it happens mid-transaction, with a customer physically present,
  where Home's <3s bar still applies. Same underlying principle — a
  destructive/irreversible action never goes unconfirmed — applied with
  proportional ceremony to two genuinely different contexts, not an
  inconsistency between them.
- **Cancelar venta actual is repositioned** away from being stacked directly
  above "Finalizar Venta" (§3.8) — it now sits inline with the "Venta actual"
  line at the top of the tray, separated from the primary action by the
  entire registration zone, directly addressing the mis-tap/adjacency risk
  named in HOME-M1.
- **Tap-to-add-item and Finalizar Venta now both have explicit save/error
  states** (§3.8a–§3.8d), matching every other write action in the document
  family. Chosen shape: tap-to-add is optimistic and instant, syncing silently
  in the background, surfacing a failure only once automatic retries are
  exhausted and only as a small, non-blocking per-item marker — preserving the
  <3s bar while still guaranteeing no silent data loss. Finalizar Venta reuses
  the same near-instant/slow/error pattern already established by Guardar
  mercancía and Guardar evento. Resolves HOME-B1.
- **Resuming an interrupted Session (§3.13) is now specified for both an
  empty and a non-empty "Venta actual."** "Venta actual" is always a read of
  the Sale's true current state, not a client-only cache — an interruption
  can never fabricate an empty tray out of a real in-progress one. Resolves
  HOME-B2.
- **Cerrar sesión now interlocks with a non-empty Sale** (§3.11a) — hard
  blocked, not a warn-and-proceed dialog, because closing is the one
  deliberately irreversible action in the flow and an unfinished Sale is real,
  already-registered work. Resolves HOME-M2.
- **The buttons-mode grid (§3.9) is now explicitly unbounded and scrollable,
  ordered most-frequently-sold-first**, sold-out tiles are dimmed and
  non-tappable (matching Inventario's own sold-out treatment), and the
  undefined "Otro" tile is removed entirely, since Selling never creates a
  Product outside the Catalog (`architecture-principles.md` #6). Resolves
  HOME-M3.
- **The session-controls sheet (§3.7a) now has its own wireframe**, showing
  exactly one live entry today ("Cerrar sesión"). "Ver detalle de hoy" is
  removed as an unspecified, undesigned feature rather than left dangling —
  the ambient header already covers today's running total, and anything
  deeper belongs to Resultados. Kept as an (extensible) sheet rather than a
  single hardcoded action specifically because `information-architecture.md`
  already commits this affordance as the future reachability point for
  Settings (`decision-log.md` D13) — Settings itself is not designed here.
  Resolves HOME-M4.
- **Framing: "selling becomes the default entry point," not "Home is the
  selling screen."** The persistent bottom nav stays reachable through every
  selling state; navigating away is never obstructed. Opening Hoy while
  actively selling still always resumes selling (§2 unconditional), but that's
  a distinct fact from whether she can leave.
- **Ambient header (Día N / running total) included as optional, testable** —
  passive display only, not an interaction, doesn't compete with speed.

## 11. Future considerations

- An "deshacer" (undo) toast for a few seconds after Finalizar Venta — a
  reasonable safety net, complementary to (not a replacement for) the new
  Finalizar Venta error state (§3.8d) — a Selling-flow detail, not core to
  Home; not designed here.
- A stale-sale timeout guard (e.g., visually flagging a "Venta actual" left
  untouched for several minutes) — deferred; the always-visible tray plus
  manual cancel may be sufficient, worth observing in real usage before adding
  a timer-based mechanism.
- Día N / calendar-day reconciliation (see §8) may require a small addition to
  the Event/Session read-side query, pending Architect input.
- A lightweight search/filter on the buttons-mode grid (§3.9), if a real
  Catalog grows large enough that scrolling alone (even with
  frequency-ordering) becomes slow to use mid-sale — not designed now, no
  evidence yet that Ana's actual catalog sizes need it; matches the same
  "defer until real usage shows a need" posture `inventory.md` §11 and
  `events.md` §11 already use for their own scale concerns.
- Whether/how Settings eventually attaches to the session-controls sheet
  (§3.7a), per `information-architecture.md`'s "Onboarding and Settings" —
  genuinely out of scope for this document; the sheet is designed to be
  extensible for exactly this reason, but Settings' own content isn't
  specified here.
