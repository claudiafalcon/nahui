# Nahui — Design System (High-Fidelity prototype)

This is the structured reference. `README.md`'s "Design plan" / "Design
System — v1/v2/v3" sections are the *history* of how this system was
arrived at (each pass's own reasoning, what was tried, what was dropped,
what bugs were caught) — keep reading those for *why*. This document is the
*what*: the reusable rules a new screen or component should follow, stated
once, so building screen N+1 doesn't require re-deriving them from prose.

Nothing here is a new decision. Every rule below already exists in
`src/styles/tokens.css`, `src/styles/patterns.css`, or an existing
component — this document names and organizes what was already built across
v1–v3, plus the Demo Polish pass (see README's own changelog entry for that
pass's specific diffs).

## 1. Visual thesis, in one paragraph

Ana's business already runs on tags: a rack of tagged garments, a tag
coming off the rack when something sells, a torn ticket stub handed to the
customer. Nahui doesn't decorate a checkout screen with a market motif — it
is *built from* one physical object she already touches constantly (the
swing tag: rounded body, die-cut corner, punched hole, string, a slight
hand-placed tilt), rendered at five scales from a tiny catalog marker up to
the full-screen receipt. A screen should be recognizable by its
*silhouette* (the shape of its corners, markers, dividers), not only its
color. See README "Design System — v3" §1–§2 for the full derivation.

## 2. Tokens (`src/styles/tokens.css`)

| Category | Tokens | Rule |
|---|---|---|
| Brand color | `--color-coral`, `--color-coral-aa`, `--color-tezontle`, `--color-tezontle-dark`, `--color-blush`, `--color-obsidian`, `--color-balanced`, `--color-white` | Verbatim from `company/brand/brand-guide.md`. Never reinvented. `--color-coral` (raw, non-AA hex) is decorative/illustration-only, per brand-guide.md's own note — never text or a fill behind text. |
| Extensions | `--color-paper` (`#FFFCF8`), `--color-hilo` (`#E8DFD3`), `--color-ink-muted` (`#776D62`) | Named, flagged additions — a warm cardstock surface, a warm sand divider, and that family's **ink**. Used *instead of* stark white / cold gray anywhere this build renders a literal paper/cardstock object. `--color-ink-muted` is this system's one quiet-but-still-legible neutral: ~4.60:1 on `--color-balanced`, ~5.06:1 on white, ~3.84:1 on `--color-hilo`. Reach for it for **quieted text that must still clear AA** (a dimmed Catalog card, a row whose write is in flight) and for **any mark whose meaning is its shape** (§10's chevron and two-position control). It replaced `#9C9186` (~2.80:1 on the shell) in all three of those roles; `#9C9186` survives only on genuinely *inactive* controls, where WCAG exempts it. Never a silent replacement for a shipped brand value. |
| Product identity | `--tag-1-bg/-ink` … `--tag-12-bg/-ink` | The "tag drawer" — 12 hand-picked tones inside the shipped warm coral→terracotta→clay→sand family (never an outside hue: no blue/green/violet). Consumed only via `productIdentity.ts`, never referenced directly by a component. |
| Texture | `--pattern-grain` | A genuine cardstock/paper fiber grain (SVG `feTurbulence`). Applied via the `.grain` primitive (§3) — never inline, never as a bare background-image on a component. |
| Line | `--stitch-line` | The dashed "sewing machine" divider. Applied via `.stitchTop`/`.stitchBottom` (§3) — never redrawn per component. |
| Perforation | `--tear-notch-sm` (7px), `--tear-notch-lg` (15px) | The two sizes the Swing Tag's torn/perforated edge is ever drawn at. `sm` = every small-scale tear (nav, transaction panel, Sheet). `lg` = the receipt only, deliberately deeper (a genuine tear, not a row of sprocket holes). No third size — introducing one needs a real reason, not a one-off tune. |
| Type | `--font-display` (Fredoka), `--font-ui` (Inter), `--text-display-xl/lg/md`, `--text-heading`, `--text-body`, `--text-body-sm`, `--text-label`, `--text-meta` | See §5. |
| Spacing | `--space-1` (4px) … `--space-16` (64px) | Every layout gap/padding value in this codebase should resolve to one of these. A raw pixel value in a component's own CSS for spacing (not a border/shadow/decorative offset) is a smell — check whether an existing `--space-*` token already fits before adding a bespoke number. |
| Radius | `--radius-sm/md/lg/xl/pill` | `sm`/`md` for small controls and tags, `lg` for tiles, `xl` for sheets, `pill` for buttons/badges/chips. The Swing Tag's own signature *asymmetric* corner (one corner sharper — see §4) is a deliberate exception layered on top of these, not a replacement radius token. |
| Motion | `--ease-standard`, `--ease-settle` (slight overshoot), `--duration-fast/base/slow` | See §6. |

## 3. Shared primitives (`src/styles/patterns.css`)

Global (non-CSS-Modules-scoped) classes, applied via `className` strings
alongside a component's own module classes — the literal mechanism that
keeps every consumer provably drawing from one shared rule instead of each
hand-rolling its own version.

- **`.grain`** — genuine paper/cardstock texture. Apply to every surface
  meant to read as an actual physical paper/cardstock object (tiles,
  sheets, the receipt) — never to plain canvas/background (the app-shell
  already carries an ambient version at the body level). Requires the host
  element to already establish its own `position` context (`.grain` does
  not set one itself — see the v3 bug note in README if adding a new
  consumer that doesn't already have `position: relative/absolute`).
- **`.tearTop` / `.tearBottom`** — the small-scale (`--tear-notch-sm`)
  perforation strip. `tearTop` for an edge something rises *out of*
  (`Sheet`, `NavBar`); `tearBottom` for an edge something is torn *away
  from* (the Selling transaction panel). Never both on the same element
  unless the element is genuinely a floating stub torn on two sides (only
  `ReceiptTicket` currently qualifies, and it uses its own `--tear-notch-lg`
  variant directly in its own CSS Module, not this shared class — see the
  note in §4 scale 5).
- **`.stitchTop` / `.stitchBottom`** — replaces *every* plain 1px hairline
  divider in this system. If you're adding a divider between list rows,
  sheet rows, or a footer and a scroll area, it should be one of these two,
  not a bespoke `border-top: 1px solid var(--color-hilo)`.
- **`.moneyTag`** — the hard rule: **a price that belongs to a specific
  Product or transaction renders inside a small tilted tag, never as bare
  running text.** Applies to a *discrete* price (`CatalogRow`'s `$250`,
  `ReceiptTicket`'s total via its own quieter stitched-underline execution
  of the same rule). Does **not** apply to a live aggregate/running total
  (`SessionHeader`'s "Hoy: $X") — that's a sum-in-progress, not a price, and
  stays plain Fredoka per §5's restraint rule. Before adding a new money
  value to a screen, ask: is this a fact about one Product/one transaction
  (→ `.moneyTag`), or a running aggregate (→ plain Fredoka, no tag)? A rule
  applied to every number on screen stops being a rule.

## 4. The signature element — the Swing Tag, at five scales

One shape (rounded body, die-cut corner notch, punched hole, string loop,
a small hand-placed tilt) reused as literal structure, not ornament:

| Scale | Size | Component | Notes |
|---|---|---|---|
| Micro | 16–20px | `VentaActualTray` chip's `TagStub` | Hangs from a stitched "string" line drawn across the top of the chip row. |
| Small | 44–56px | `CatalogRow`'s `TagStub` marker | Real weight — visible border, bigger punched hole, firmer string — reads as an object, not an icon. |
| Medium | tile-sized | `ProductTile` itself | The tile *is* the tag: full tone wash, die-cut corner, its own marker pinned *outside* the frame (overlapping the top-left corner), not boxed inside the card's padding. |
| Large | full-bleed strips | Selling transaction panel's `tearBottom`, `NavBar`'s `tearTop`, `Sheet`'s `tearTop` | One shared formula (`--tear-notch-sm` via `.tearTop`/`.tearBottom`), not three hand-tuned gradients. |
| Full screen | viewport | `ReceiptTicket` | The explicit reveal: a punched hole + string loop at `--tear-notch-lg`, the same TagStub shape as every small marker, just at its biggest size. |

**When adding a new surface that represents "a Product" or "money changing
hands":** it should reach for one of these five scales rather than
inventing a sixth device. A new signature element is explicitly *not*
wanted right now (Product Owner direction, 2026-08-13) — the job is
consistent reuse, not addition.

## 5. Typography roles

Fredoka (display) is reserved, never a default "friendly font." It appears
only where a moment is either (a) brand identity itself, or (b) a sum of
money that matters *right now*:

- The "Nahui" wordmark / "¿Vas a vender hoy?" greeting.
- `SessionHeader`'s running "Hoy: $X" total.
- `ReceiptTicket`'s hero total (count-up animated).

Everything else — every Product name, every label, every list row, every
button, every form field — is Inter. Before giving something Fredoka, ask
"is this brand identity or money-that-matters-right-now?" — if not, it's
Inter, full stop; this is a restraint rule, not a styling default.

**Precedent — when an approved spec explicitly demands equal visual weight
for a non-money statement.** `reports.md` §3.4/§3.5/§3.6 explicitly annotate
two headline statements ("Tu producto estrella...", "Esta semana
vendiste...") with "same visual priority as Total histórico." Neither is a
money figure, so they don't qualify for Fredoka under the rule above — but
the approved spec's explicit, specific instruction wins over this section's
general restraint convention for that one case (a Decision Ownership call,
not a silent resolution either way — see README's "Resultados pass" fix
round). The resolution, and the reusable pattern for the next time this
comes up: **don't reach for Fredoka just because a spec says "match this
figure's weight"** — Fredoka is reserved for money/brand identity regardless
of instructed emphasis. Instead, match the *actual* visual weight (size,
boldness, accent color) using bold Inter at heading weight plus the same
accent color the money figure itself uses (`ResultadosMain`'s
`.headlineLine`, `Resultados.module.css`, is the reference implementation).
This keeps the Fredoka-restraint rule intact while still honoring the
spec's explicit emphasis instruction literally.

## 6. Motion principles

- **`--ease-settle`** (a slight overshoot) is reserved for moments that
  represent something *landing*: a Sale item joining `VentaActualTray`
  (`chipSettle`), a `ProductTile` confirming a tap (`confirmBump`,
  `badgePop` — Demo Polish pass), the receipt itself dropping in
  (`swingIn`), a nav tab's active pip. It is not the default easing for
  routine UI transitions (hover, focus, disabled-state changes use
  `--ease-standard`).
- **Confirmation feedback should be tied to the actual state change, not
  just the press.** `:active` states (press-and-hold scale) revert the
  instant a finger lifts, before a merchant has looked back down at what
  she tapped — mid-sale, that's too fast to register as "yes, that
  worked." Anything that represents a real state change completing (an
  item added, a count incrementing) should animate on that change itself
  (typically via a `key` prop change forcing a remount, replaying an
  entrance keyframe), not rely on `:active` alone.
- **Every animation gets a `prefers-reduced-motion: reduce` fallback** —
  either `animation: none` on the specific rule, or (for anything timing-
  critical, like the receipt's count-up total) a value that's already
  correct without the animation ever running.
- **`ScreenTransition` (`src/components/ScreenTransition/`) is the standard
  entrance for screen-branch changes** — fade + 8px upward settle,
  `--duration-base`/`--ease-standard` (the quiet, standard register, not
  `--ease-settle`'s overshoot, since this plays on every ordinary
  navigation many times a selling day). Applied at nearly every screen's
  own resolution branch (Home, Inventario, Eventos, Resultados, Settings,
  Authentication, Onboarding, Demo Mode's welcome/error gate). Deliberately excluded from `ReceiptTicket`
  (which keeps its own one-of-a-kind `swingIn`) and from `Sheet`/modal
  overlays (not screen-to-screen navigation). Respects
  `prefers-reduced-motion` the same way every other animation here does.

## 7. Content / copy conventions

- **Money on a tag.** See `.moneyTag` (§3) — the one hard visual rule this
  system enforces everywhere a discrete price renders.
- **Pluralization is centralized.** `src/domain/format.ts`'s
  `pluralize`/`articulos` helpers are the only place count-dependent
  Spanish copy is generated — a hardcoded "{n} artículos" string in a new
  component is a bug waiting to happen the first time n = 1 (this exact
  class of bug was caught and fixed once already, per README's v1
  self-critique; don't reintroduce it locally).
- **"Venta rápida" vs. "Venta actual."** These are two different domain
  concepts rendered close together in `SessionHeader`/`VentaActualTray`:
  "Venta rápida" names the *Session* (today's whole working period,
  no-Event case); "Venta actual" names the specific *Sale* in progress
  right now. They are visually disambiguated by treatment, not just
  wording — "Venta rápida" is always the small uppercase, letter-spaced
  eyebrow label; "Venta actual" is always the bold sentence-case line below
  it. If a future screen introduces a third "venta"-prefixed label in this
  same header zone, don't just add it — re-check whether the eyebrow/body
  distinction still reads clearly at three labels, not two.
- **Never invent a state the approved `product/02-ux/*.md` spec doesn't
  define.** This document only governs *how already-approved copy and
  states are rendered* — it has no authority to add a screen state, and
  isn't a substitute for checking the actual spec.

## 8. What's deliberately kept conventional (not reinvented)

Not everything should look like a tag. `Button`'s pill shape, `Sheet`'s
bottom-sheet pattern, and every plain form input (`ProductPicker`'s search
field, the price/quantity inputs) are ordinary, unthemed controls on
purpose — a merchant mid-sale should never have to relearn what a button or
a text field does. The signature vocabulary earns its place on objects that
represent *Ana's own physical world* (a Product, a price, a receipt, a
divider echoing a stitched seam) — not on every interactive control simply
because it's on screen. When adding a new component, default to a plain,
conventional control unless it specifically represents money, a Product, or
a torn/perforated transition between two zones of a screen.

**The on/off switch — relocated 2026-09-21, not superseded. The note below it
(2026-09-19) overstated what had been retired, and this paragraph replaces
it.** What was actually defective on the Catalog card was a **separate small
hit zone inside a larger card** — one of six independently-tappable zones on
a row Ana reads at a glance. `inventory.md`'s 2026-09-19 amendment retired
that zone, correctly. **The switch's geometry went out with the zone as
collateral**, and the rule below was never argued against; it simply fell out
of scope with the component that carried it.

The rule below is the one this section's own 2026-09-17 entry closes with:
the next component needing a binary on/off control should reuse **"switch
plus adjacent text label together, not the switch alone — rather than
hand-rolling a bordered pill or a button that swaps its own text between two
states."** §10's instant-write row was that next control, and as first built
it was literally a `<button>` whose only trailing content swapped between
`Sí` and `No` — the named anti-pattern and the built component were the same
object. Restoring the geometry without the hit area restores a signal the
retirement discarded by accident and adds back nothing the retirement was
for.

**So the switch now lives inside §10's instant-write row**, at the trailing
edge, beside the `Sí`/`No` words rather than instead of them
(`DetailRow.module.css`'s `.instant .switch`). **It is a `<span>`, never a
nested `<button>`:** a signifier inside the row's one 56px tap target, never
a sub-target of its own. That distinction is the whole difference between
this and the retired zone.

**The geometry below carried across; two of its three colours did not
(2026-09-21, `ux-critic` Major 1 / Minor 2).** The sizes, the radius, the
knob and its 16px travel are the original's, unchanged. The fills are not:
the track is `--color-obsidian` on and `--color-hilo` **outlined in
`--color-ink-muted`** off, with that same outline ringing the knob in the off
state. Two things changed underneath the original spec, and both are §10's
doing rather than anything wrong with the 2026-09-17 note on its own terms:
it was written for a switch that **sat beside its own `NFC: Sí`/`NFC: No`
text label** — so its own legibility was never load-bearing and it was never
contrast-checked — and §10 then promoted it to one of three independently
failing **signals**, with a word *beside* it rather than under it, an error
line 8px below it, and a stated 3:1 floor in every state. Same shape, held to
a bar its original was never asked to clear. **A standalone reuse of the
original specification below must adopt the corrected colours**, not the
1.20:1 off-state track printed there.

What carries forward unchanged is the reasoning: a binary setting is one of
this section's conventional controls, never a Swing-Tag device, and **its
current state must be readable in words at rest, never only from a control's
position or colour.** The words are what make the geometry admissible, not
the other way round — a rendering that dropped `Sí`/`No` in favour of the
control alone would be a defect. **A new binary on/off control should reach
for §10's instant-write row first**, and only fall back to a standalone
switch if it genuinely cannot live on a full-width row; if it does, the
original specification follows.

*(Original, 2026-09-17, labeled 2026-09-19 — historical.)* A small
track-and-knob switch — `width: 40px`/`height: 24px` pill track, `border: 1px
solid var(--color-hilo)`, `background: var(--color-hilo)` off /
`var(--color-tezontle-dark)` on, an 18px white knob (`box-shadow: 0 1px 2px
rgba(45,45,45,0.24)`) that translates 16px on `background-color`/`transform`
transitions at `--duration-fast`/`--ease-standard`. One of this section's
conventional controls, not a Swing-Tag device — it represents a per-Product
*setting*, not money or the Product itself, so it deliberately doesn't reach
for `.moneyTag` or any tag silhouette, the same reasoning that already keeps
`Button`/`Sheet`/form inputs plain. Paired with its own adjacent text label
(`.nfcLabel`, `var(--text-meta)`/600/`#6B6259`, dimming to `#9C9186` on a
dimmed row) reading `NFC: No`/`NFC: Sí` — `inventory.md` §3.4 has specified
this exact copy since before the switch was first built; the switch's own
position/color is a reinforcing visual, never a substitute for it, since
without the label there is no way to read the control's meaning or current
state without tapping it. The slow-save affordance still renders as its own
caption *below* the row (see `CatalogRow.module.css`'s `.nfcSavingHint`), not
inside the switch or its label. The next component that needs a binary
on/off control (not a multi-option picker — that's a different pattern)
should reuse this shape — switch plus adjacent text label together, not the
switch alone — rather than hand-rolling a bordered pill or a button that
swaps its own text between two states.

## 9. Extending to screens not yet built (Loyalty, Eventos, Resultados)

None of these have a built screen in this slice, but the primitives are
already screen-agnostic by design (this is the actual test of whether §2–§3
produced a system, not five one-off decorations):

- A future **Loyalty** punch-card is structurally a strip of the same
  punched-hole motif already used at micro scale (`TagStub`'s hole) —
  stamps instead of a hole-and-string, same shared vocabulary.
- A future **Eventos** surface (a market day) reads naturally as a paper
  wristband/entry ticket using the exact same `.tearTop`/`.tearBottom`
  primitive `NavBar` and `Sheet` already consume.
- A future **Resultados** surface with real numbers should apply §3's
  money-tag rule exactly as written: a specific stat tied to one
  Product/one day → tag treatment; a running/aggregate figure → plain
  Fredoka, no tag. Don't invent a third money-rendering convention.

No new visual language should need inventing for any of these — only a new
consumer of the tokens/primitives already in `tokens.css`/`patterns.css`.

## 10. The detail-row vocabulary (`DetailRow`, added 2026-09-19)

**Status: provisional, not frozen (stated 2026-09-21).** Design-system
additions freeze at Stage 6 (Product Approval); this slice is mid Stage 5, so
this section is a working record, not a settled primitive — it has already
been amended twice in its first week (`ux-critic` m1's overstated type
guarantee, and the two-position control below). **Reuse stays permitted and
encouraged**; treating it as unamendable does not. A later reviewer finding a
defect here amends it, exactly as happened both times.

Added with `inventory.md` §3.19's Product Page, and recorded here rather than
left inside that one screen because the shape is screen-agnostic: **any
surface that shows one entity and a stack of its stored details** — some
edited through a sheet, some written in place — should reuse it rather than
re-deriving three near-identical rows.

Three shapes, and only three. `src/components/DetailRow/` is the single
implementation.

**What stops the fourth combination, stated as what it actually is
(corrected 2026-09-21, `ux-critic` m1).** This section previously said the
props "make the fourth combination unrepresentable." They did not: the closed
`Sí`/`No` vocabulary was enforced on the instant-write shape only, and
`<DetailRow shape="value" value="Sí" …/>` compiled and rendered the exact
mixed row the rule forbids. Two guards now stand, and each is worth exactly
what it covers:

- **Compile time** — the value shape is generic in its own literal type, so a
  `Sí`/`No` **literal** written at a call site is a type error naming the
  rule. This catches the realistic mistake.
- **Runtime, dev only** — a value typed merely as `string` that *holds* one of
  those words at runtime is beyond any type, and is asserted with a
  `console.error` where the actual string is known. Never a thrown error and
  never a silently substituted shape: a mixed row is a defect to fix in the
  caller.

Stated this way on purpose — **overstated safety is worse than stated risk**,
because it stops the next author from looking for the case the type misses.

| Shape | Renders as | Behaviour |
|---|---|---|
| **1. Value row that opens a sheet** | `Label            valor ›` | Opens a staged sheet with a Cancelar/Guardar pair. Writes nothing on tap. |
| **2. Action row that opens a sheet** | `Acción                  ›` | Same, with no value to show. |
| **3. Instant-write row** | `Label                Sí  (—●)` | Writes immediately on tap. The whole row is the tap target; the two-position control is a signifier *inside* that one target, never a second target. **Never carries "›".** |

**Every row is a tap target — there is no passive row shape, deliberately.**
A passive fact placed among rows that all read as controls gets pulled toward
control-shaped copy by its neighbours, and — the failure actually observed —
tends to get sourced from whatever stored flag sits nearest rather than from
live state. **Passive facts belong one level up**, as plain figures with no
trailing slot and no target. **A row with no live control is absent, never
present-and-inert.**

**The trailing edge states the row's kind, affirmatively, on every row**
(restated 2026-09-21 — one rule with three instances, not a rule plus an
exception):
- A row that **opens a separate surface** ends in a forward indicator, "›",
  unconditionally, after its value. A sheet-opening row may never omit it.
- A row that **writes in place** ends in a **two-position control**, shown in
  its current position, unconditionally.
- **No row ends in nothing, and no row carries both marks.**

**Three independent signals, and why not one.**
- **The forward indicator.** Stated affirmatively for the reason above: a
  rule about one row's *absence* would be no signal at all — with no row
  carrying an indicator, its absence distinguishes nothing.
- **What kind of thing the trailing words are.** A sheet-opening row trails
  an **open-ended value** she can read but not change from here (`$250`,
  `Con foto`, `7501234567890`, `Camisas`). The instant-write row trails a
  **two-position state from a closed, binary vocabulary — `Sí` or `No`, never
  anything else, ever** (typed as a literal union, so widening it requires
  editing the rule). One is a fact being reported; the other is the current
  position of a control.
- **The control's own position** (added 2026-09-21). The first build applied
  the affirmative-mark rule to the chevron and not to shape 3, which was left
  defined by two absences — no chevron, no control — plus one inference: that
  a trailing `Sí`/`No` reads as a control's position rather than as a reported
  fact. **That inference is what a merchant's transferred expectation runs
  against.** On her own phone's Ajustes, in WhatsApp, in Mercado Libre, a
  chevron-less row of label-and-trailing-value is what a *read-only fact*
  looks like; an instantly-applied binary setting is what carries visible
  two-position geometry. It is also what the accessibility layer already
  declares — the row is exposed as a toggle whose state is its value, and a
  sighted merchant must be told the same thing by the same screen.

The chevron is a small mark at the far edge of a row; the control is a shape
she recognises without reading it; the words state the state even if she
looks at neither. They fail independently, which is the point.

**The perceptibility floor for the two mark-signals (added 2026-09-21,
`ux-critic` Major 1 / Minor 1 — and this omission is *how* both of them
happened).** Two of the three signals are marks rather than words. Until now
this section declared them independent and set them no legibility bar at all,
while the words beside them inherited every text-contrast rule in the
document. So:

> **A mark-signal clears 3:1 against the surface it actually renders on —
> `--color-balanced` (#F4F4F4) for anything on an ordinary screen shell, not
> white — in *every* state it can be in, the off/default state named
> explicitly.**

WCAG 1.4.11's bar for the parts of a graphical object required to understand
it, applied to the two elements this section calls signals. Three things the
wording is doing deliberately:

- **"In every state"**, because a mark that is legible in one position and
  invisible in the other does not signal a two-position control — it signals
  *whether the control exists*, which is a different and much worse thing to
  read off a row.
- **"The off/default state named explicitly"**, because that is the one that
  was missed. `nfcTaggingEnabled` defaults to `false`, so `No` is what every
  Product shows until she deliberately turns tagging on: it is the state a
  first-time merchant meets, and precisely where the row most needs to say
  "this is a control you can flip." As first built the off-state track was
  1.20:1 on the shell with a 1.24:1 knob inside it, and the chevron beside it
  2.80:1 — two of three declared signals imperceptible at once, in the
  default state, in files whose comments were otherwise careful about
  contrast. A floor stated only for the "interesting" state is a floor for
  the state nobody ships in.
- **"Against the surface it renders on"**, because every one of these
  numbers was ~10% better on white, and none of these rows render on white.

This binds the marks, not the words: `Sí`/`No`, the label, `Guardando…` and
the inline failure line are text and carry the ordinary AA obligation, which
the floor never substitutes for. It is also not a general rule about faint
borders — `CatalogRow`'s `.shortcut` keeps an equally quiet hilo border and
is fine, because the pill contains the word `Etiquetar`. **The floor applies
to a mark whose meaning is carried by its shape alone.**

**The words stay, and they are what make the control admissible.** §8's
retained rule requires a binary setting's state to be readable **in words** at
rest — never only from a control's position, and never from colour or weight
at all. The control accompanies `Sí`/`No`; it never replaces them, and a
rendering that dropped the words for the control alone would be a defect, not
a simplification.

**Colour and weight are emphasis, never a signal, and no document may
describe them as one** (corrected 2026-09-21). `.instant .value`'s coral is
emphasis only: §8 bars state readable from colour, coral already carries
brand/Product identity on display-only elements of the same screen, and
`.busy .value` deliberately drops it mid-write — so a colour "signal" would
vanish at exactly the moment the row is least stable.

**Which is why the control is a neutral ink, not a brand accent** (changed
2026-09-21, `ux-critic` Minor 2). Its ON fill was `--color-tezontle-dark`,
inherited from §8's standalone switch — byte-identical to `--color-error`,
and sitting ~8px above a `.rowError` line rendered in that same #A72C2C. On a
failure from `Sí` the row reverts to `Sí`, so the affirmation of "on" and the
announcement of "failed" were the same colour, touching, at the moment the
row is least stable. The fix is not a *different* red: a saturated accent on
the track invites the reading this section just forbade — that the colour is
the state — and any near-red would then have to be defended as a family
rather than a mismatch against both the coral word beside it and the error
line below it. So the track is `--color-obsidian` on, `--color-hilo` with a
`--color-ink-muted` outline off. **The knob's position is the mark; the words
are the state; the fill is only the channel the knob moved along.** Red on
this row now means exactly one thing, which is what makes the failure line
legible as one.

**The control is a signifier, never a second tap target.** A `<span>` inside
the row's single `<button>`, `aria-hidden`: a tap on the label, the word, the
control, or the space between them does the same one thing. **Explicitly not
a sibling region and explicitly not a control inside a control** — the
retired Catalog-card NFC zone was a separate small hit area inside a larger
card, and *that* is what made it a hidden zone. The geometry comes back; the
hit area does not.

**No row may mix shapes.** A sheet-opening row with a binary value (a
hypothetical `Vender con tag NFC   Sí ›`) is forbidden outright: it would
carry both signals and resolve to neither. If a future surface needs a binary
fact edited through a sheet, it renders the value as something *other* than
`Sí`/`No` and carries the "›" — the vocabulary is what's reserved, not the
fact.

**Save discipline for shape 3** (the only shape that writes, so the only one
that needs it — `ProductPage.tsx` is the reference implementation):
- **On tap** the row's label quiets in place (`settings.md` §3.9's "fila
  atenuada" mechanic, reused via `.busy`) and the row **immediately displays
  the attempted new value, in both the word and the control.** It is not tappable again while a
  write is inflight; a second tap is ignored, never queued.
- **What "atenuada" may and may not take down with it** (added 2026-09-21,
  `ux-critic` Minor 3). The quieting is a **colour substitution on the label
  only**, never `opacity` on the row. Row-level opacity took `Guardando…`
  down to ~2.25:1 and the control's own outline to ~2.10:1 — below AA and
  below the mark floor above, on the two elements whose whole job is to be
  read during that exact interval, and with no `disabled` attribute to invoke
  WCAG's inactive-component exemption (shape 3 deliberately never sets one;
  see below). **Nothing that states the write's state may be inside the dim.**
  The label can afford it — she has already read it, and it does not change
  while the write is in flight — so it carries the whole signal, dropping
  12.52:1 → 4.60:1, the same device and the same numbers a dimmed Catalog
  card's name already uses.
- **Near-instant:** the label quiets and un-quiets silently — nothing else on
  the row changes tone — landing on the new value. No message.
- **Slow (>~1.5s):** the trailing value reads `Guardando…` in place of
  `Sí`/`No`, **the control holding the attempted position**, and **both stay
  at full strength for the whole inflight window** — `Guardando…` at its
  stated `#6B6259`, ~5.43:1 on the shell; the control's outline unchanged and
  still clearing §10's 3:1 floor. Only the label is quieted, for as long as
  the write runs. Plain language, never a spinner label, never a technical
  status string.
- **Failure:** the row **reverts to the last value actually stored** — never
  left displaying the attempted value. This is the load-bearing half: the
  optimistic display is only safe because failure is guaranteed to undo it,
  which falls out for free from a store that mirrors only on success. An
  inline failure line renders beneath that row only; nothing else is blocked.
  **The row itself is the retry** — no separate `[ Reintentar ]`, no
  full-screen error — so the write is exposed to a client-initiated retry and
  *architecture-principles.md* #7 applies: one stable idempotency key per
  attempt, replayed unchanged on retry.
- **The control's position and the word never disagree, in any state.** They
  move together on tap, together into `Guardando…`, and together on the
  revert. The control is never the only thing that changes and never lags the
  word — otherwise the geometry could contradict the words §8's retained rule
  makes authoritative, the one failure mode that would make having it worse
  than not having it. **Guaranteed by construction, not by discipline:** both
  are computed from `DetailRow`'s single `value` prop, so there is no second
  piece of state for them to drift apart on.

Visually this is one of §8's **conventional** controls: a plain full-width
list row divided by the shared `.stitchBottom` rule, no tag silhouette, no
tone wash, no tilt. It represents a stored attribute of an entity — not
money, not the entity itself — so it never reaches for `.moneyTag`.

**Shape 3 never uses the `disabled` attribute** while a write is in flight.
`aria-disabled` plus the caller's own early-return guard, per this codebase's
standing convention (`ux-critic` MIN-1, 2026-09-07): `disabled` blurs the
just-tapped button and drops focus to `document.body`, which on a control
whose documented failure path *is* "tap the row again" would force a keyboard
or AT user to re-navigate the level to retry.

## 11. The ambient confirmation (`AmbientConfirmation`, added 2026-09-21)

One line, one lifecycle, one implementation — `src/components/AmbientConfirmation/`.

`inventory.md`'s confirmations (§3.12, §3.13, §3.13a, §3.4b, §3.4c's ordinary
case, §3.19c) are all the same thing: **ambient, fading, no tap to dismiss,
never a separate screen requiring a tap**, rendered in the page's own margin
above the content. They are also a property of the **destination** — under
"return to origin," the same operation can land on two different screens, and
the spec binds it to render there "with identical copy and identical shape on
both."

Three rules that came out of getting this wrong first:

- **The fade belongs to the component, not to each screen.** Two screens each
  holding a private prop→state→timeout pair is how "identical forever"
  drifts, and it did: Catalog view faded at 2400ms while the Product Page
  rendered its prop straight through and never faded at all, leaving a stale
  success claim standing over current state — including over a failure line
  beneath it.
- **A repeat of the same confirmation needs a token.** Identical copy, on a
  screen that didn't remount, changes no prop and therefore shows nothing. On
  a screen whose confirmation is the only evidence a write landed, that means
  the second save appears not to have happened. The caller mints one fresh
  value per *delivered* confirmation, at the single place they funnel through.
- **The message arrives complete, "✓" included.** Composed once, where the
  copy is owned, never half in a helper and half in each screen's JSX.

**When it is the wrong vehicle:** two or three sentences explaining *why*
something changed. That is the one-time acknowledgment banner (§3.3a's
pattern) — non-fading, no tap to dismiss, no fill, plain body text at full
contrast. A fading line cannot carry an explanation, and an explanation must
not be tinted into illegibility to look like a panel.
