# Inventario — UX Specification

Status: Approved. Full UX Remediation cycle complete — INV-M1, INV-M2,
INV-M3 fixed by `ux-designer`, verified clean by `ux-critic` (zero remaining
Blockers/Majors), and passed `reviewer`'s Foundation-consistency check (no
Blockers; one cross-document Important finding — stale post-renumbering
section references — corrected by Main).
**Amended for `decision-log.md` D23** (Session-scoped selling mode — see
`product/99-rfc/0003-session-selling-mode.md`): cross-reference and
terminology only, no redesign. `ux-critic` found zero findings and
`reviewer`'s Foundation-consistency pass found zero Blockers/Important
findings — folded back into Approved.
**Amended 2026-08-04 (INV-Q1, Product Owner-raised):** Cantidad now
defaults to 1 (was blank) with an explicit tap-affordance requirement
(bracketed per this doc's own `[ ]` = tappable convention) and a "revisa
antes de guardar" marker on the unreviewed default, carrying into the
§3.7 committed-lines list. Full cycle complete, `ux-critic`/`reviewer`
clean, folded back into Approved.
**Amended 2026-08-04 (icon/comprehension audit):** §3.4's Catalog rows now
carry the same per-Product marker `home.md` §3.9 introduces, and a
zero-`disponibles` row now renders dimmed while staying fully tappable —
applied identically to §3.5/§3.12/§3.13/§3.17. Full cycle complete,
`ux-critic`/`reviewer` clean, folded back into Approved.
Scope: `Inventario`, the second of four top-level nav items per
`product/00-foundation/information-architecture.md`. Covers the first three
steps of the merchant workflow chain in `product/00-foundation/vision.md`
("Receive Merchandise → Register Lot → (Optional) Assign NFC Tags →...",
which continues on to Schedule Event/Sell beyond this doc's scope). "Inventory
Ready" below is this doc's own shorthand for "these three steps are done," not
a term sourced from `vision.md`. Implementation-independent — low-fidelity
only, no visual design.

Out of scope by explicit instruction (`company/CLAUDE.md`, `domain-model.md`
"Deliberate exceptions," `architecture-principles.md` #5, `decision-log.md` D9):
no Supplier screen, no cost/margin display anywhere. See §8, item 1, for a
wording conflict this surfaced in `information-architecture.md` (since fixed).

## 1. Merchant goal

Inventario is not where Ana spends her selling day — it's where she gets ready
for it. Unlike Home, there's no customer standing in front of her while she
uses this tab; the pressure here is different in kind, not just degree. Two
real contexts:

- **Merchandise just arrived** (at home, in the car, between bazares): she
  needs to get it "into the system" — counted, ready to sell — without it
  feeling like paperwork. She already did the hard part (buying it, hauling
  it); Inventario's job is to not make her repeat that effort in a form.
- **Checking what she has** (deciding what to bring to the next bazaar, or
  reassuring herself she still has stock of something): a fast, honest glance
  at "what do I have and how much," nothing more.

A distant third, only for `nfc ∈ registrationMode` merchants: physically
walking through a stack of new garments attaching tags — a one-time-per-unit
task that happens once, at receiving time, never again during selling
(`vision.md`: "the merchant never switches between them while selling").

Registration speed here is real but not the same bar as Home's. `company/backlog.md`
#1 and `company/CLAUDE.md`'s core thesis are specifically about *sale*
registration under unpredictable customer flow — Inventario has no customer
waiting, so a few extra seconds per product line is an acceptable cost of
capturing real information, not a friction to hunt down artificially. What
still applies, undiminished: never make her repeat a count she already typed,
never lose it to an interruption, and never talk down to her about a task
(counting her own merchandise) she already knows how to do better than the
app does.

## 2. Resolution / decision logic

Before any of the following resolves, the tab itself must load its own state
(Catalog membership, `nfc ∈ registrationMode`, pending tag counts) — this can
fail or take longer than expected under real bazaar/car/between-stalls
connectivity, same as every other tab. See §3.1/§3.2 for the near-instant/slow
presentation of that load, and §3.18 for the defensive fallback if it doesn't
resolve at all. The four numbered steps below assume that load has already
succeeded.

Evaluated automatically, every time Inventario is opened or a sub-flow
completes:

```
1. Does the Catalog have at least one Product ever registered?
     → NO:  cold-start empty state (§3.3).
     → YES: Catalog view (§3.4 / §3.5).

2. [Catalog view] Is `nfc ∈ registrationMode`, AND does at least one
   InventoryUnit exist with status = available and no NFCTag assigned?
     → YES: show the non-blocking "faltan etiquetas" card (§3.5) — informational
       + tappable, resumes Asignar Tags exactly where she left off.
     → NO (buttons-only capability, or nfc-capable with nothing pending): plain
       Catalog view (§3.4).

3. [Inside Registrar Mercancía, after "Guardar mercancía"] Is
   `nfc ∈ registrationMode`?
     → YES: auto-enter Asignar Tags (§3.14) for this Lot's freshly generated
       InventoryUnits — no intermediate question asked.
     → NO: return to Catalog view with an ambient confirmation (§3.12) — done,
       Inventory Ready, nothing further required.

4. [Inside Asignar Tags] Does this Lot still have any InventoryUnit without a
   tag?
     → YES: keep the scan prompt active (§3.14).
     → NO: complete — return to Catalog view, "lista para vender" confirmation
       (§3.13).
```

This is the same underlying "does the Catalog have a Product" check Home
already performs (`home.md` §2, step 3) — not re-derived independently; both
tabs read the same fact.

`nfc ∈ registrationMode` gates whether an "Assign Tags" step exists **at all**
in Inventario, per `information-architecture.md` ("`nfc ∉ registrationMode`
(NFC not in the Business's capability set) → no 'Assign Tags' step anywhere
in Inventario. Gated by capability availability, not by any single Session's
resolved operating mode.") and `domain-model.md`'s business-capability table.
This is resolved once, upstream, at the Business level — never a per-Lot
question like "¿quieres usar NFC para este lote?", and independent of any
single Session's `Session.operatingMode` (*architecture-principles.md* #1,
`decision-log.md` D23). Every condition in this section is a Business-level
capability check, not a Session-level one — Inventario isn't a Selling-context
screen and never reads or depends on any particular Session's resolved mode.

## 3. Low-fidelity wireframes

Conventions inherited from `home.md`: `[ ]` = tappable, plain text =
passive/informational, bottom row is the persistent nav bar on every state,
current tab in brackets.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Identical silent-skeleton convention as `home.md` §3.1 / `events.md` §3.1 /
  `reports.md` §3.1 — not re-invented here. This is the tab-level resolution
  state `events.md` §3.1's annotation already claimed to reuse from this doc;
  it now actually exists here to be reused. *global-principles.md*, "technology
  should disappear."
- Nav bar present even before resolution finishes: navigation is never
  blocked by the app figuring out its own state, same guarantee `home.md`
  §3.1 makes.

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- One calm, plain-language line, never a technical status string, identical
  convention to `home.md` §3.2 / `events.md` §3.2 / `reports.md` §3.2.
  *global-principles.md*, "business language before technical language."

### 3.3 Cold start — no Product ever registered
```
┌───────────────────────────────┐
│  Inventario                    │
│  Aquí vas a ver lo que tienes    │
│  disponible en cuanto registres  │
│  lo que traes.                   │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Same tone, structure, and CTA label as Home's cold start (`home.md` §3.3):
  reuses "Registrar mercancía" verbatim rather than inventing new vocabulary
  for the same action.
- This is the state she lands on if she reaches the Inventario **tab** directly
  while the Catalog is empty. If she instead arrived via Home's cold-start CTA,
  she skips straight to §3.6 (see §10) — tapping "Registrar mercancía" once on
  Home shouldn't require tapping it again here. *global-principles.md*, "the
  fastest interaction is the one that never happens."

### 3.4 Catalog view — normal
```
┌───────────────────────────────┐
│  Inventario                    │
│  ┌───────────────────────────┐ │
│  │(P) Pijama          12 disponibles│ │  tappable → §3.6, prefilled
│  │(S) Sudadera/Maxy     3 disponibles│ │
│  │(C) Calcetines        0 disponibles│ │  needs restocking — dimmed, still
│  └───────────────────────────┘ │  fully tappable → §3.6, prefilled
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- List shows Product + available count only — never a Lot, InventoryEntry, or
  InventoryUnit reference. *architecture-principles.md* #4; matches
  *global-principles.md*, "she sees 'Hoodie (4 available)'."
- A sold-out Product (Calcetines, 0 disponibles) stays visible rather than
  disappearing: Product persists independent of stock (`domain-model.md` D2).
- Tapping a row is a real shortcut, not decoration — see §3.6 annotation and
  §10.
- **Each row now carries the same per-Product marker `home.md` §3.9
  introduces on the selling grid — the first letter of `Product.name`,
  uppercased and trimmed — reused verbatim, not re-derived.** Same
  derivation, same source fact (`Product.name`), same rule; Inventario
  doesn't invent its own logic for this. Gives the Catalog list the same
  at-a-glance differentiation the selling grid now has, on the two screens
  where Ana actually scans a list of what she sells.
- **A zero-`disponibles` row (Calcetines, 0 disponibles) now renders
  dimmed** — the same visual dimming signal `home.md` §3.9 already applies
  to a sold-out ProductTile, reused here rather than inventing a second
  dimming rule. **Unlike the ProductTile case, this row stays fully
  tappable**: tapping it still routes to §3.6, prefilled with that Product,
  exactly like every other Catalog row (§3.6's shortcut annotation, §10).
  Dimming here is a "needs restocking" signal, not a disabled state — this
  is precisely the row Ana is most likely to want to tap, since it's where
  she decides what to bring or replenish next. Contrast explicitly with
  `home.md` §3.9, where dimming *does* pair with non-tappability (there's
  genuinely nothing to do with zero sellable units); Inventario's zero-stock
  row has the opposite relationship to tappability, because restocking is
  exactly Inventario's job.
- **Both the marker and the zero-stock dimming rule apply identically
  wherever this same row shape reappears** — §3.5 (pending-tag-work
  variant), §3.12/§3.13 (post-save confirmation views), and §3.17
  (deferred-tagging view, = §3.5) — no separate specification needed for
  each; they all render the identical Catalog row.

### 3.5 Catalog view — with pending tag work (nfc-capable Businesses only)
```
┌───────────────────────────────┐
│  Inventario                    │
│  ┌───────────────────────────┐ │
│  │ Te faltan 7 artículos por    │ │  informational + tappable card
│  │ etiquetar                    │ │
│  │ [ Terminar de etiquetar ]     │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │(P) Pijama          10 disponibles│ │
│  │(S) Sudadera/Maxy     5 disponibles│ │
│  │(C) Calcetines       20 disponibles│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Same visual pattern as Home's upcoming-Event card (`home.md` §3.5):
  secondary, informational, tappable only into the relevant place — never
  gates or adds a step to Registrar Mercancía.
- Makes an interrupted tagging queue discoverable without ever asking "were
  you still tagging?" — same pattern as `home.md` §3.13. *global-principles.md*,
  "never ask twice."
- "Disponibles" counts reflect `InventoryUnit.status` only, independent of tag
  status — see §8, item 2 (logged as Q2 in `product/02-ux/product-decisions.md`,
  reclassified from `architect-questions.md` as a Product Decision), for the
  open question this touches.
- **Cross-reference to NFC Readiness (`decision-log.md` D23, added — no
  redesign):** this card's own "how many units still need tags" count and
  Selling's NFC Readiness check — the "how many sellable units already have
  tags" evaluation run at Session-open time (`home.md` §2/§3.6a) — are two
  views of the identical underlying tagged/untagged split on `available`
  `InventoryUnit`s. The two counts should read off the same underlying number
  rather than drift into two independently-maintained figures. This is a
  cross-reference note only: they remain two distinct UX moments in two
  distinct documents — an ambient, mid-workflow Inventario nudge here, versus
  a Session-start, Selling-context gate there — neither is redesigned by this
  note.

### 3.6 Registrar mercancía — entry (first line, or shortcut-prefilled)
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registrar mercancía              │
│                                │
│ Producto                        │
│  [ Elegir producto ▾ ]           │
│ Cantidad                        │
│  [ − ]  [ 1 · revisa antes de guardar ]  [ + ]│
│  (o escribe la cantidad)         │
│                                │
│  [ + Agregar otro producto ]     │
│                                │
│  [      Guardar mercancía    ]   │  enabled once Producto is chosen —
│                                │  Cantidad defaults to 1, never blank
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
(The instant she interacts with Cantidad at all — `[−]`, `[+]`, typed entry, or
tapping the number to open `teclado numérico` — the "· revisa antes de
guardar" suffix disappears and the field renders as "1" (or whatever value
she set) — still within the same tappable/editable treatment, just without
the suffix. Only the untouched, still-default state carries the suffix.)
- Only Producto + Cantidad are asked — no Supplier, no cost field, per
  `architecture-principles.md` #5 and `decision-log.md` D9 (see §8, item 1).
- If reached by tapping a Catalog row (§3.4), Producto arrives already filled
  with that row's Product, and Cantidad defaults to 1 immediately — the row is
  already complete and Guardar mercancía is enabled with zero further taps,
  though she's free to adjust the count before saving. *global-principles.md*,
  "capture business truth once, reuse it forever" and "the fastest interaction
  is the one that never happens."
- **The default quantity now renders as textually distinct from a
  deliberately set one — closes INV-Q1.** Until she interacts with Cantidad
  in any way, the field reads "1 · revisa antes de guardar" instead of a bare
  "1" — a low-cost, always-visible signal that this number is the app's
  placeholder, not something she's actually looked at, addressing the
  specific risk that a pre-filled default is easy to tap past without ever
  registering it as a real decision. This costs zero additional taps in the
  common, correctly-defaulted case — she can still glance and tap Guardar
  directly — since the fix targets *silence*, not speed: an unreviewed
  default can no longer look pixel-identical to a reviewed one. Deliberately
  not a blocking confirmation step, per the same reasoning the original
  Cantidad-default amendment already established (§10) — this doesn't
  reintroduce the friction that amendment removed.
- **The same marker carries into the "Ya agregaste" committed-lines list
  (§3.7) for any line whose Cantidad was never touched before "+ Agregar
  otro producto" committed it.** This is what closes the multi-unit/batch
  half of INV-Q1: if she moves quickly through several Products without ever
  engaging Cantidad on any of them (e.g., a fast pass through a large
  receiving batch), every one of those lines stays visibly flagged in the
  list she reviews right before Guardar mercancía — not just whichever row
  currently has focus — so a run of unreviewed defaults reads as a
  conspicuous pattern rather than looking identical to a batch of genuinely
  single-unit lines. See §3.7.
- Cantidad's default (1) and floor (never below 1) apply identically whether
  Producto came from the existing-Product list or was created inline as new
  (§3.8) — the rule is about the field, not about how Producto was resolved.
- The `[−]`/`[+]` stepper is additive, not a replacement for typing: tapping
  the numeric value still opens `teclado numérico` for jumping straight to a
  larger count without repeated taps. `[−]` goes inert once Cantidad = 1 — it
  never wraps to 0 or negative; typing `0` or clearing the field reverts to 1
  rather than being accepted, since "0 units received" isn't a real receiving
  event.
- **The numeric value itself must render with a clear tappable/editable
  visual affordance — never as plain, static-looking display text.** The
  wireframe above now brackets it (`[ 1 · revisa antes de guardar ]`)
  alongside `[−]`/`[+]`, consistent with this document's own stated
  convention (§3 intro: "`[ ]` = tappable, plain text = passive/
  informational") — previously the value sat unbracketed between the two
  stepper buttons, silently contradicting that convention. This is a
  low-fidelity notation only; the actual visual treatment (border,
  underline, fill, etc.) is a Medium-Fidelity/`ui-designer` decision. But
  *some* real, visible affordance is a hard requirement here, not optional
  polish: without it, tapping the number to open `teclado numérico` isn't
  discoverable as an available action — she'd have to already know it's
  possible rather than see it. This is what actually makes §6's "typed
  entry stays the faster path for large counts" true in practice, not just
  true on paper — a quantity of 20 shouldn't cost nineteen taps on `[+]`,
  because the faster path is visibly there to take. Applies identically
  wherever a live Cantidad field appears in this document, including
  §3.7's entry row.
- **Tapping the Cantidad value to open `teclado numérico` is a hard
  requirement of this field, not an incidental side effect of the stepper
  existing.** The `[−]`/`[+]` stepper is a convenience for small
  adjustments only and must never be the sole way to change Cantidad —
  direct typed entry must always be available and must always be the
  visible, obvious option for reaching a large count quickly.
- **Cantidad's default value (1) remains fully editable at all times before
  Guardar mercancía, by either input method** — the default is a starting
  value only, never a locked or suggested-only one, whether or not the
  "· revisa antes de guardar" marker is still showing.
- Form is a multi-line receiving event, not the Home selling grid
  (`home.md` §3.9): receiving requires a quantity per Product, a
  fundamentally different shape from a single tap = one unit sold. Reusing the
  selling grid here would conflate two different actions in one visual
  language.

### 3.7 Registrar mercancía — with committed lines, editing the next
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registrar mercancía              │
│                                │
│ Ya agregaste:                    │
│  Pijama — 10                [✕] │
│  Sudadera/Maxy — 5            [✕] │
│  Calcetines — 1 · revisa       [✕] │  committed without ever touching
│                                │  Cantidad — marker carries through
│ Producto                        │
│  [ Elegir producto ▾ ]           │
│ Cantidad                        │
│  [ − ]  [ 1 · revisa antes de guardar ]  [ + ]│
│  (o escribe la cantidad)         │
│                                │
│  [ + Agregar otro producto ]     │
│                                │
│  [      Guardar mercancía    ]   │
│      Descartar                   │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
*(The "Calcetines" line illustrates the "revisa antes de guardar" marker
carrying through into the committed list per INV-Q1 above — "Pijama" and
"Sudadera/Maxy" render plain because their quantities were deliberately
typed/adjusted.)*
- "+ Agregar otro producto" commits the current row (now complete the moment
  Producto is chosen, since Cantidad defaults to 1) and opens a fresh blank
  one — exactly one tap per additional Product line, no more. Adjusting a
  line's quantity beyond the default is an additional, optional tap on `[+]`
  (or typed entry), only when the count genuinely differs from 1.
- **The active row's Cantidad field carries the same tappable/editable
  affordance requirement as §3.6** — bracketed in the wireframe above
  (`[ 1 · revisa antes de guardar ]`) for the same reason: the numeric
  value must never read as plain, static display text. Committed-line
  quantities in the "Ya agregaste" list (e.g., "Pijama — 10") are
  already-saved values in this draft, not live editable fields — only
  `[✕]` is tappable on those rows. The affordance requirement applies to
  the one active, still-being-typed-into row, exactly as in §3.6.
- `[✕]` on a committed row lets her fix a miscount before saving — respects her
  intelligence rather than punishing a typo. *Brand tone*, warm/direct, never
  condescending.
- "Descartar" only appears once ≥1 line is committed (nothing to discard
  before that) — see §3.9 for what it opens.
- Leaving this screen any other way (back arrow, switching nav tabs, phone
  locking) silently preserves this in-progress draft — no confirmation, no
  "keep or discard" prompt. Returning to Registrar Mercancía resumes exactly
  here. *global-principles.md*, "never ask twice," same treatment Home gives an
  interrupted Session (`home.md` §3.13).

*(The expansion of each committed line into individual InventoryUnit records
— "10" becomes 10 distinct units — happens automatically behind "Guardar
mercancía." It is invisible to Ana; no screen represents it. `decision-log.md`
D3: "the merchant still just types a quantity, the platform expands it.")*

### 3.8 Elegir producto — picker sheet
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Registrar mercancía              │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ¿Qué llegó?                    │
│  [ Buscar o escribir… ]          │
│  ─────────────────────────      │
│  [ + Agregar "Chalecos" como      │  only shown once typed text doesn't
│    producto nuevo ]              │  match an existing Product (see rule below)
│                                │
│  Pijama                          │
│  Sudadera/Maxy                   │
│  Calcetines                      │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- One field resolves both "add stock of something I already sell" and "this
  is a new item" — no separate "create new Product" screen. Matches
  `decision-log.md` D2: Product is an independent identity that either already
  exists or is created inline, never re-derived from a Lot.
- She is never asked "¿es un producto nuevo?" — inferred automatically from
  whether her typed text matches an existing Catalog entry, using the matching
  rule below. *global-principles.md*, "every repeated decision should become
  automation."
- **Matching rule (case-insensitive, trimmed):** her typed text is compared
  against existing Catalog Product names after lowercasing both sides and
  trimming leading/trailing whitespace. "Pijama," "pijama," "PIJAMA," and
  " Pijama " (trailing/leading space) all resolve to the same existing
  Product — the "+ Agregar... como producto nuevo" row never appears for any
  of them, and selecting the matched result behaves exactly like tapping
  "Pijama" from the list below. This is the one automatic normalization
  applied to her typed text; it deliberately does **not** fuzzy-match or
  auto-correct beyond case and whitespace — "Pijama" and "Pijamas" remain two
  distinct Products, since collapsing genuinely different names could
  silently merge two things she actually meant to keep separate. This
  directly prevents one real item's stock from being silently split across
  two Catalog rows over a casing or spacing difference, protecting
  *global-principles.md*'s own promise that she sees one number per Product
  ("Hoodie (4 available)").

### 3.9 Descartar confirmation
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, still visible underneath
│  Pijama — 10                     │
│  Sudadera/Maxy — 5                 │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │ ¿Descartar los 2 productos │ │
│  │  que ya agregaste?          │ │
│  │ [ Cancelar ] [ Sí, descartar]│ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- One of only two deliberate confirmations in this entire spec (the other is
  §3.12). Justified the same way Home justifies its single confirmation
  (`home.md` §3.11, §10): rare, and genuinely destructive of real counted
  work — an intentional exception to "never ask twice," not a violation of it.

### 3.10 Guardar mercancía — saving (near-instant / slow)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│                                │        │        Guardando…              │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │                                │
├───────────────────────────────┤        ├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │   │ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
- Identical convention to `home.md` §3.1/§3.2 and this doc's own §3.1/§3.2 —
  silent unless genuinely slow, one calm line, never a technical status
  string. *global-principles.md*, "technology should disappear," "business
  language before technical language."

### 3.11 Guardar mercancía — error
```
┌───────────────────────────────┐
│  No se pudo guardar. Tus         │
│  productos siguen aquí,          │
│  intenta de nuevo.                │
│  Pijama — 10                     │
│  Sudadera/Maxy — 5                 │
│      [   Reintentar   ]          │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Her typed data is never dropped by a failed save — same principle as Home's
  resolution-fallback (`home.md` §3.14): a failure state must never cost her
  work she already did. *global-principles.md*, "the best interface stays out
  of the merchant's way."

### 3.12 Post-save confirmation — buttons-only businesses (`nfc ∉ registrationMode`)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Mercancía registrada ✓          │  ambient, fades — not a separate screen
│  ┌───────────────────────────┐ │  requiring a tap to dismiss
│  │(P) Pijama          10 disponibles│ │
│  │(S) Sudadera/Maxy     5 disponibles│ │
│  │(C) Calcetines       20 disponibles│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- No "Ir a Inventario" tap required to leave a confirmation screen she already
  wants to leave — this **is** Catalog view (§3.4), already updated, with a
  transient line. *global-principles.md*, "the fastest interaction is the one
  that never happens." Inventory Ready, per `vision.md`, with no further step.

### 3.13 Post-save confirmation — nfc-capable Business, tagging complete
```
┌───────────────────────────────┐
│  Inventario                    │
│  Mercancía lista para vender ✓   │
│  ┌───────────────────────────┐ │
│  │(P) Pijama          10 disponibles│ │
│  │(S) Sudadera/Maxy     5 disponibles│ │
│  │(C) Calcetines       20 disponibles│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- "Lista para vender" (vs. plain "registrada" in §3.12) reflects that for an
  nfc-capable Business, Inventory Ready genuinely means both received *and*
  tagged — same screen shape, different, honest wording.

### 3.14 Asignar tags — active queue (nfc-capable Business, auto-entered after Guardar)
```
┌───────────────────────────────┐
│  Asignar tags                   │
│  Lo que registraste:             │
│  Pijama (10) · Sudadera (5)      │
│  · Calcetines (20)                │
│                                │
│  Etiquetando: Pijama              │
│  Faltan 7 de 10                  │
│                                │
│      Acerca el tag a la          │
│         prenda                   │
│                                │
│  [ Terminar después ]            │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Pure scan-driven, no per-unit confirmation tap: a successful scan assigns
  the tag to the next untagged unit and advances the counter automatically.
  Same interaction convention as Home's nfc selling surface (`home.md` §3.10)
  — deliberately reused since it's the same underlying capability
  (`nfc ∈ registrationMode`), not a new gesture invented for Inventario.
- Units are queued Product by Product, in the order she entered them — matches
  the physical mental model of working through one stack of garments at a
  time.
- Each physical unit gets its own tag (`decision-log.md` D4) — this queue is
  necessarily per-unit, never per-Product-type; "Faltan 7 de 10" is exactly
  that granularity.

### 3.15 Asignar tags — error, tag already assigned
```
┌───────────────────────────────┐
│  Asignar tags                   │
│  Este tag ya está asignado a     │
│  otra prenda. Usa un tag nuevo.  │
│  Etiquetando: Pijama              │
│  Faltan 7 de 10                  │
│      Acerca el tag a la          │
│         prenda                   │
│  [ Terminar después ]            │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Plain-language error, no UID/technical detail shown. *global-principles.md*,
  "business language before technical language."
- A business-logic conflict (the tag is valid and readable, but already
  belongs to a different unit) — contrast with §3.16, a genuine read failure.

### 3.16 Asignar tags — error, scan failed
```
┌───────────────────────────────┐
│  Asignar tags                   │
│  No se pudo leer el tag.          │
│  Acércalo de nuevo a la prenda.    │
│  Etiquetando: Pijama              │
│  Faltan 7 de 10                  │
│      Acerca el tag a la          │
│         prenda                   │
│  [ Terminar después ]            │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Distinct from §3.15's "ya está asignado" business-logic conflict: this is a
  genuine physical read failure (out of range, foil/metallic interference,
  scan timeout) — a likely more common failure mode than §3.15, since Ana is
  physically moving a tag toward a garment over and over. A silent non-event
  would leave her unsure whether to reposition, retry, or that something's
  broken; this state makes the failure visible and names the fix.
- One message covers all three underlying technical causes (out of range,
  foil interference, timeout) — Ana doesn't need to diagnose *why* a scan
  failed, only what to do about it (reposition, try again).
  *global-principles.md*, "business language before technical language": no
  "timeout," "read error," or UID ever surfaces.
- Nothing is consumed by a failed read: "Faltan 7 de 10" is unchanged — only
  a successful scan advances the counter (§3.14). The message clears
  automatically on the next scan attempt (successful, a repeat failure, or a
  different conflict); no tap is required to dismiss it, same non-blocking
  posture as §3.15.
- "Terminar después" stays reachable exactly as in every other state in this
  queue — a failing tag never traps her in the flow.

### 3.17 Asignar tags — "Terminar después" (deliberate defer)
```
┌───────────────────────────────┐
│  Inventario                    │
│  ┌───────────────────────────┐ │
│  │ Te faltan 7 artículos por    │ │
│  │ etiquetar                    │ │
│  │ [ Terminar de etiquetar ]     │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │(P) Pijama          10 disponibles│ │
│  │(S) Sudadera/Maxy     5 disponibles│ │
│  │(C) Calcetines       20 disponibles│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Identical to §3.5 — deferring tagging returns her to a Catalog view that
  already knows work is pending; no separate "you stopped early" messaging.

### 3.18 Defensive fallback / load error
```
┌───────────────────────────────┐
│  No pudimos cargar tu            │
│  inventario. Intenta de nuevo.     │
│      [   Reintentar   ]          │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Manual `Reintentar`, same convention as `events.md` §3.18 / `reports.md`
  §3.14 (not Home's silent auto-retry) — Inventario carries no live-customer
  risk that would justify Home's more aggressive, invisible retry behavior.
- Nav bar stays fully functional here, same as `home.md` §3.14 / `events.md`
  §3.18 / `reports.md` §3.14: a failure to load the Catalog never cascades
  into blocking Hoy/Eventos/Resultados, and critically, never blocks selling
  — if Ana's Catalog fails to load mid-bazaar-day, she can still reach Hoy
  and keep selling.

## 4. Interaction flow (summary)

```
Open Inventario tab
  → resolve (§2, automatic)
      → load fails ─────────────────────────→ fallback (3.18), Reintentar
      → Catalog empty ───────────────────────→ cold start (3.3) → tap "Registrar mercancía" → 3.6
      → Catalog has Products ────────────────→ Catalog view (3.4 / 3.5)

Catalog view:
  tap "Registrar mercancía" → 3.6 (blank)
  tap a Product row → 3.6 (prefilled with that Product)
  [nfc-capable + pending untagged units] tap card → 3.14 (resume)

Registrar mercancía (3.6/3.7):
  fill Producto (→ 3.8 if using the picker; matching is case-insensitive,
    trimmed — see §3.8) — Cantidad defaults to 1 the instant Producto
    resolves, marked "revisa antes de guardar" until touched (INV-Q1, §3.6),
    adjustable via [−]/[+] or typed entry (floor: 1)
  → tap "+ Agregar otro producto" → commits row, opens next blank row → repeat
  → tap "Guardar mercancía"
      → saving (3.10)
      → error (3.11) → Reintentar → saving again
      → success:
          nfc ∉ registrationMode → Catalog view + ambient confirmation (3.12) — DONE
          nfc ∈ registrationMode → Asignar tags (3.14), auto-entered
  → [any point] leave without saving → draft preserved silently, resumes later
  → [≥1 line committed] tap "Descartar" → confirm (3.9) → Sí → draft cleared

Asignar tags (nfc-capable Business only, 3.14):
  scan tag → assign to next pending unit → counter decrements → repeat
  → tag already assigned → error (3.15) → scan a different tag
  → scan fails to read (out of range, foil, timeout) → error (3.16) →
    reposition and try again — queue state unchanged
  → tap "Terminar después" → Catalog view + pending card (3.17, = 3.5)
  → 0 pending → Catalog view + "lista para vender" confirmation (3.13) — DONE
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no Product ever registered
4. Catalog view — normal
5. Catalog view — pending tag work (nfc-capable Businesses only)
6. Registrar mercancía — entry (blank or shortcut-prefilled)
7. Registrar mercancía — with committed lines, editing the next
8. Elegir producto — picker sheet
9. Descartar confirmation
10. Guardar mercancía — saving (near-instant / slow)
11. Guardar mercancía — error
12. Post-save confirmation — buttons-only businesses
13. Post-save confirmation — nfc-capable Business, tagging complete
14. Asignar tags — active queue
15. Asignar tags — error, tag already assigned
16. Asignar tags — error, scan failed
17. Asignar tags — "Terminar después" (defer, = state 5 on return)
18. Defensive fallback / load error

## 6. Minimum step count

| Scenario | Taps / entries | Why it can't be fewer |
|---|---|---|
| Register 1 new Product line, quantity 1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto) + 1 (Guardar) | Cantidad defaults to 1 on Producto selection — no separate quantity step for the single-unit case, the most common one. |
| Register 1 new Product line, quantity >1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto) + N−1 taps on `[+]` (or 1 typed entry) + 1 (Guardar) | Must still specify *how many* when it's not 1 — this is the information itself, not an artificial gate; typed entry stays the faster path for large counts. |
| Register N Product lines (buttons-only) | 1 (open) + N×(1 elegir producto [+ adjustment taps if quantity ≠1]) + (N−1)×(agregar otro producto) + 1 (Guardar) | Each line is a distinct fact; the (N−1) "agregar otro" taps are the minimum structural cost of an arbitrary-length list, not padding. |
| Restock an already-known, sold-out Product at quantity 1 (tap Catalog row) | 1 (row, prefills Producto + Cantidad defaults to 1) + 1 (Guardar) | Shortest possible — Product identity reused instead of re-searched, and the default removes the previously-required typed quantity for the common 1-unit-restock case. *global-principles.md*, "capture business truth once, reuse it forever." |
| Same, nfc-capable Business, U total units in the Lot | + U scans, 1 per physical unit | Per-unit tagging is a domain requirement (`decision-log.md` D4), not a UX choice — one tag, one unit, no shortcut exists that preserves traceability. A failed read (§3.16) costs zero extra taps — she simply re-presents the same tag. |
| Browse the Catalog only | 0 taps | Opening the tab is itself the answer; nothing to register. |

Unlike Home's <3s-per-item bar (`company/backlog.md` #1, which is specifically
about *sale* registration under live customer pressure), Inventario has no
comparable hard speed requirement — the floor above is about not adding
**unnecessary** steps, not about racing a customer who isn't there.

## 7. Automation opportunities

- InventoryUnit generation from each typed quantity — fully invisible
  expansion, `decision-log.md` D3, never a screen.
- Existing-vs-new Product resolution — inferred from the picker automatically
  (case-insensitive, whitespace-trimmed matching, §3.8); she's never asked
  "¿es un producto nuevo?" explicitly.
- Whether Inventario opens to cold-start or Catalog view — same Catalog-check
  Home already performs (`home.md` §2), not re-derived.
- `nfc ∈ registrationMode` gating whether Asignar Tags exists at all —
  resolved once upstream (*architecture-principles.md* #1), never a per-Lot
  toggle.
- Auto-continuation from Guardar mercancía straight into Asignar Tags for
  nfc-capable Businesses — no "¿quieres etiquetar ahora?" question; it's the
  obvious next physical action given she's holding the merchandise.
- Resuming an interrupted tagging queue (§3.5/§3.17) — automatic, discoverable
  card, no re-prompt.
- Draft preservation of an in-progress Registrar Mercancía form across any
  accidental interruption — automatic, no discard-vs-keep prompt unless she
  explicitly asks via "Descartar."
- Catalog-row shortcut prefilling Producto for a restock — removes a redundant
  search for something she's already looking at.

## 8. Open questions

1. **`information-architecture.md` wording conflicted with the Supplier/cost
   exception.** IA's Journey 1 text read: "Registrar Lote (**supplier, date,
   line items: Product + qty + cost**)" — contradicting `domain-model.md`'s
   "Deliberate exceptions" section, `architecture-principles.md` #5, and
   `decision-log.md` D9, which all state Supplier and cost must stay
   structurally present but **completely invisible** until backlog calls for
   them. This spec follows the domain-model/decision-log version — Registrar
   Mercancía (§3.6) asks only for Producto + Cantidad. **Resolved by Main**:
   `information-architecture.md` Journey 1 wording has been corrected to match
   (no Architect consultation needed — not an ambiguity, just a stale line
   that hadn't caught up with D9).

2. **Is an untagged InventoryUnit sellable, in nfc mode?** The InventoryUnit
   lifecycle (`available → reserved → sold`) doesn't reference NFCTag as a
   precondition for `available`, and the "dual-purpose tag resolution"
   mechanism (`domain-model.md`) disambiguates sale-time vs. claim-time scans
   by status — it assumes a tag already exists once one is scanned. If a
   merchant defers tagging (§3.17) and a customer later wants to buy that
   physical, untagged unit, there's no tag to scan it with. This spec doesn't
   invent a block-the-sale mechanic in Selling; it only makes the untagged
   backlog visible and resumable in Inventario (§3.5) so she's nudged to
   finish before it becomes a problem at the point of sale. **Escalated to
   Architect — confirmed a genuine gap, not resolvable from the Foundation as
   it stands. Logged as Q2 in `product/02-ux/product-decisions.md`** (reclassified
   from `architect-questions.md` as a Product Decision), since
   it spans both the Inventory and Selling bounded contexts and needs a
   product decision, not a unilateral UX or Architect call. **Narrowing note
   (D23, cross-reference only):** `decision-log.md` D23 resolves a related but
   distinct, one-level-up question — whether `nfc` is even offered as a
   Session's operating mode at all, based on aggregate tagged-inventory
   coverage at Session-open time. A Not Ready Session never offers `nfc` in
   the first place, which reduces how often this Q2 scenario is reached, but
   doesn't replace Q2's own resolution for the residual case where overall
   coverage is fine yet one particular Product's units happen to lack tags —
   see `decision-log.md` D23's "Relationship to other open items" note.

3. **Is "Lot" ever meant to be individually browsable to Ana** (a "lo que
   llegó el 14 de julio" history view), or purely an internal write-time
   grouping with no dedicated read surface? `architecture-principles.md` #4
   settles that InventoryEntry/InventoryUnit never leak into language, but
   doesn't explicitly say whether the receiving-event grouping itself (Lot) is
   meant to surface as its own browsable concept. This spec takes the
   conservative position — no Lot-history screen, Catalog view only ever shows
   Product-level aggregate counts (§3.4) — and defers a possible "historial"
   screen to §11. Not escalated to Architect: a reasonable, non-blocking
   default was already chosen and documented; revisit only if a future journey
   actually needs it.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — Home's
  cold-start CTA skips a redundant second empty screen (§3.3 annotation, §10);
  the post-save confirmation is ambient, not a screen requiring a dismiss tap
  (§3.12/§3.13); Asignar Tags auto-continues after Guardar with no
  intermediate question (§3.14); the Catalog-row shortcut removes a redundant
  Product search (§3.4, §6).
- *"Never ask twice"* — an in-progress Registrar Mercancía draft survives any
  interruption without a discard-vs-keep prompt (§3.7); the pending-tags card
  resumes automatically, never asking "were you still tagging?" (§3.5/§3.17);
  the picker never asks "is this new?" — inferred via the case-insensitive,
  trimmed matching rule (§3.8).
- *"Technology should disappear"* — InventoryUnit generation is fully
  invisible (§3.7 closing note, D3); loading states stay silent unless
  genuinely slow, both for opening the tab itself (§3.1/§3.2) and for Guardar
  mercancía (§3.10) — identical convention to `home.md`/`events.md`/`reports.md`.
- *"Business language before technical language"* — copy uses "mercancía,"
  "lo que traes," "etiquetar," "lista para vender" — never "Lot,"
  "InventoryEntry," "InventoryUnit," or a raw technical error string, anywhere,
  including the scan-failure message in Asignar Tags (§3.16), which names the
  physical fix ("acércalo de nuevo") rather than a cause like "timeout."
- *"The merchant experiences Products, the platform preserves Inventory
  traceability"* — Catalog view (§3.4) is Product + count only; the platform
  still knows every unit's originating Lot, she never sees or needs to.
- *"Every repeated decision should become automation"* — §7 is the direct
  enumeration of this applied to Inventario.
- *"Capture business truth once, reuse it forever"* — Product identity
  persists across Lots (D2); the Catalog-row shortcut and the picker's
  existing-Product list (using the matching rule, §3.8) both reuse it rather
  than re-asking.
- *"The best interface stays out of the merchant's way"* — a failed save never
  drops her typed data (§3.11); a failed scan never drops queue progress
  (§3.16); a failed tab load never dead-ends her out of Inventario or blocks
  the nav bar (§3.18); Descartar is the only place data is deliberately lost,
  and only on her explicit request.

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — `nfc ∈ registrationMode` gates
  whether Asignar Tags exists at all in Inventario, decided at the Business
  level (Selling Mode Capability, `decision-log.md` D23), never a per-Lot
  question, and independent of any single Session's resolved
  `Session.operatingMode`.
- *#2 (aggregate boundaries follow write-throughput)* — unlike Sale (its own
  root specifically for cheap, independent per-item writes), a Lot legitimately
  batches multiple InventoryEntries into a single "Guardar mercancía" commit,
  because receiving isn't on the same latency-critical path as registering a
  sale in front of a waiting customer.
- *#4 (internal-only entities never leak into user-facing language)* — Lot,
  InventoryEntry, and InventoryUnit are never named or given their own screen;
  "Lot" is downplayed to "lo que registraste" rather than a first-class
  concept (see §8, item 3, for the residual ambiguity this leaves).
- *#5 (schema stability over-modeled exactly once, only when named)* — direct
  basis for excluding Supplier and cost from Registrar Mercancía (§3.6) despite
  the IA wording conflict flagged in §8, item 1 (since corrected).
- *#6 (one-way dependency direction)* — Inventario never reads or writes
  Selling/Session/Sale state; Asignar Tags only ever writes to InventoryUnit.

## 10. Decisions made

- **Cantidad now defaults to 1 the instant Producto is chosen, with an added
  `[−]`/`[+]` stepper alongside the existing typed/`teclado numérico` entry
  (§3.6, §3.7).** Amends the original spec, which specified Cantidad as an
  empty, typed-only field with only an en-dash placeholder — found unclear in
  Product Owner testing (no default shown, no non-keyboard way to reach 2, 3,
  etc.). Default value of 1 matches the most common receiving case ("just
  arrived, one piece") and removes an artificial blank-field gate for that
  case — *global-principles.md*'s "the fastest interaction is the one that
  never happens" and "every repeated decision should become automation"
  apply directly. The stepper is additive, not a replacement: typing (and the
  numeric keyboard) remains fully available for jumping straight to a larger
  count. Floor: Cantidad can never go below 1 by either input method — `[−]`
  is inert at 1, and a typed `0`/blank reverts to 1 rather than being
  accepted, since "0 units received" isn't a real receiving event.
  **Consequently, "Guardar mercancía disabled until Producto + Cantidad set"
  (§3.6) now resolves to "enabled once Producto is chosen"** — Cantidad is
  never in an unset state once a Producto exists, so the original gate's
  substance (both fields must hold a value) is unchanged; only the mechanics
  of reaching a valid Cantidad changed. Deliberately not offset with an extra
  confirmation step before Guardar — the quantity is always visible in the
  row before saving, same as the "Ya agregaste" list already gives her in
  §3.7. Does not touch `decision-log.md` D3 ("the merchant still just types a
  quantity, the platform expands it") — the stepper is one more way to arrive
  at the same typed value, not a different data path; InventoryUnit expansion
  is unaffected. Not RFC-worthy — no aggregate boundary, domain term, or IA
  change; a UX interaction-behavior fix to an already-Approved spec, same
  category as the D23 amendment above.
- **The default Cantidad value now carries a "revisa antes de guardar"
  marker until she interacts with the field, and the same marker carries
  into the "Ya agregaste" committed-lines list for any line saved without
  ever touching its quantity (§3.6, §3.7) — resolves INV-Q1.** The prior
  amendment above (default-to-1 + immediately-reachable Guardar) closed one
  friction problem but opened a silent-under-registration risk: a pre-filled
  "1" was visually identical whether she'd genuinely reviewed it or simply
  tapped through. This fix doesn't revert the default or add a confirmation
  step — it makes the unreviewed state impossible to mistake for a
  deliberate one, at zero added taps for the common, correctly-defaulted
  case. The marker disappears the instant she engages Cantidad in any way,
  even if the value stays 1. Does not touch `decision-log.md` D3 or the
  stepper/typed-entry mechanics — copy/state-signal only.
- **The Cantidad numeric value must render with a visible tappable/editable
  affordance, and typed entry via `teclado numérico` is now stated as a
  hard requirement rather than an incidental capability of the stepper
  (§3.6, §3.7).** Product Owner follow-up to the two amendments above:
  confirmed both are real, permanent product decisions, and specifically
  confirmed neither closes the "quantity of 20" concern (whether tapping
  `[+]` nineteen times would be frustrating) on its own — the mechanic
  (typed entry as the faster path for large counts, §6) already existed,
  but nothing previously mandated that it be *visually discoverable*
  rather than something she'd have to already know was possible. Closed by
  bracketing the numeric value in the wireframe, consistent with this
  document's own `[ ]` = tappable convention (§3 intro), and by explicit
  bullets in §3.6/§3.7 stating the affordance requirement, the
  hard-requirement status of typed entry, and Cantidad's continued full
  editability at its default value. Not a redesign: the stepper, the
  default-to-1 behavior, the floor at 1, and the INV-Q1 marker are all
  unchanged — this only makes an already-intended affordance and an
  already-true mechanic explicit design mandates instead of implied ones.
- **Home's cold-start CTA routes directly into Registrar Mercancía (§3.6),
  not into Inventario's own cold-start screen (§3.3).** Home's cold-start
  annotation says the CTA "routes into Inventario, an existing nav tab" —
  compatible with either landing point. Chose the more efficient one: she
  already committed by tapping "Registrar mercancía" once; making her tap an
  identical-looking CTA a second time would violate "the fastest interaction
  is the one that never happens." §3.3 remains the resting state of the
  Inventario tab itself when reached any other way while the Catalog is still
  empty.
- **Excluded Supplier and cost entirely from Registrar Mercancía**, per D9 /
  *architecture-principles.md* #5, despite the IA wording conflict (§8, item
  1, now corrected) — following Main's explicit instruction over the literal
  IA text.
- **Registration is a multi-line form (Producto + Cantidad per row), not a
  reuse of Home's selling grid.** Receiving requires typed quantities per
  Product — a different interaction shape from single-tap selling; reusing
  the grid would conflate two different actions in one visual language.
- **One field resolves both "restock an existing Product" and "register a new
  one"** (§3.8) — no separate "create Product" screen, consistent with Product
  being an independent, persistent identity (D2).
- **Elegir producto matching is case-insensitive and whitespace-trimmed**
  (§3.8) — resolving INV-M3: prevents "Pijama"/"pijama"/a trailing-space
  variant from silently becoming two separate Products and fragmenting one
  real item's stock across two Catalog rows. Deliberately stops short of
  fuzzy/typo-tolerant matching (e.g., "Pijama" vs. "Pijamas" stay distinct),
  since collapsing genuinely different names could silently merge two things
  she meant to keep separate — a narrower, safer rule than solving the general
  string-matching problem.
- **An in-progress Lot draft persists automatically across interruption.** No
  discard-vs-keep prompt on back/navigate-away; "Descartar" (§3.9) is the one
  deliberate, explicit way to lose it, and the sole confirmation dialog in this
  flow besides none other.
- **After Guardar mercancía, nfc-capable Businesses are taken directly into
  Asignar Tags** for the just-created units, no intermediate choice screen;
  buttons-only businesses see an ambient confirmation and stay on Catalog view.
  Concrete implementation of `vision.md`'s "(Optional) Assign NFC Tags" —
  optional at the capability level only, not a per-Lot choice.
- **A persistent, informational "faltan etiquetas" card** on Catalog view
  (nfc-capable Businesses only) makes an interrupted tagging queue discoverable
  and resumable — same pattern as `home.md` §3.13's silent Session resume.
  Cross-references Selling's NFC Readiness check as reading off the same
  underlying tagged/untagged count (§3.5, D23) — a note only, not a shared
  screen.
- **Catalog rows are tappable**, prefilling Registrar Mercancía with that
  Product — gives a concrete purpose to the list beyond display, and shortens
  the single most common repeat action (restocking something she already
  sells).
- **Inventario now defines its own tab-level Resolving and defensive-fallback
  states** (§3.1, §3.2, §3.18) — resolving INV-M1: identical convention to
  `home.md`, `events.md`, and `reports.md` (silent near-instant skeleton,
  ">~1.5s" plain-language wait, manual-`Reintentar` load-failure fallback that
  never blocks the nav bar). This closes a gap `events.md` §3.1/§3 had already
  (incorrectly) asserted was covered by this doc.
- **A distinct scan-failure error state was added to Asignar Tags** (§3.16),
  alongside the existing "already assigned" business-logic conflict (§3.15) —
  resolving INV-M2: a genuine NFC read failure (out of range, foil
  interference, timeout) is a separate and likely more common case, now with
  its own plain-language message; queue progress is never affected by a
  failed read. Note: `home.md`'s nfc selling surface (§3.10) has the identical
  gap for the selling context — out of this doc's scope to fix, flagged for
  awareness only, per the finding.
- **No Lot-history/browsable-receiving-events screen designed.** Catalog view
  shows only current Product-level aggregate counts (*architecture-principles.md*
  #4); see §8, item 3, and §11.
- **Terminology updated for `decision-log.md` D23 (cross-reference only, no
  redesign).** Every condition in this document that gates on whether the
  Assign-Tags workflow exists at all is a Business-level capability check —
  now written `nfc ∈ registrationMode` (Selling Mode Capability) rather than
  the old single-scalar `registrationMode = nfc` — since Inventario is not a
  Selling-context screen and none of its own conditions ever depend on which
  operating mode any particular Session resolved to. `Session.operatingMode`
  (the Session-level, Selling-context concept) does not appear anywhere in
  this document, because nothing here is actually about a specific Session.
- **Catalog rows now carry the same per-Product marker `home.md` §3.9
  introduces on the selling grid, and a zero-`disponibles` row now renders
  dimmed while staying fully tappable (§3.4, applying identically to §3.5,
  §3.12, §3.13, and §3.17 wherever the same Catalog row shape reappears).**
  Reuses `home.md`'s existing marker derivation (first letter of
  `Product.name`, uppercased and trimmed) and its existing sold-out dimming
  treatment verbatim — no new logic invented for Inventario. Unlike the
  ProductTile case, a dimmed Catalog row stays fully tappable: dimming here
  signals "needs restocking," not "nothing to do," since restocking is
  exactly Inventario's job. Same letter-collision caveat as `home.md` §3.9
  applies here too — the marker is a fast-scan aid, not a guarantee of
  uniqueness; the full Product label remains the primary identifier.

## 11. Future considerations

- A "historial de mercancía" (Lot-level browsing) screen, if Ana ever wants to
  see what arrived and when — not designed now; no journey calls for it yet
  (see §8, item 3).
- A named "borrador" (draft) affordance beyond simple auto-persistence, if real
  usage shows Lots are routinely split across multiple sittings (e.g., over
  several days) rather than counted in one pass.
- Editing an already-saved Lot (correcting a quantity typo after Guardar) —
  not designed; today's flow only catches mistakes before Guardar via the
  inline `[✕]` on a committed row.
- A lightweight low-stock indicator or restock nudge on Catalog view — a
  natural fit once the Intelligence context (`domain-model.md`) exists; out of
  scope for Inventario v1. **Distinct from the zero-stock dimming shipped in
  §3.4/§10** — that signal fires only at exactly 0 disponibles, using data
  already on hand; this future item is about a non-zero low-stock threshold
  (e.g., "solo te quedan 2"), which would need a configurable or
  Intelligence-derived threshold this doc doesn't define today.
- Supplier and cost fields need their own design pass once backlog explicitly
  calls for margin/Open Finance features (D9) — not before.
- Bulk/batch tag-assignment shortcuts (e.g., recognizing a rapid sequence of
  scans without a per-unit prompt) — current design assumes one conscious scan
  per unit; revisit if real usage on large Lots shows this is too slow.
- No repeated-failure escalation path in Asignar Tags (e.g., suggesting a
  different physical tag, or a "sigue sin funcionar" help affordance after
  several consecutive §3.16 failures on the same unit) — deferred; today's
  design treats every failed scan the same way regardless of how many times
  it's happened in a row. Worth revisiting if real usage on defective/foil-
  heavy tag batches shows this matters.
