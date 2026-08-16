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
| Extensions | `--color-paper` (`#FFFCF8`), `--color-hilo` (`#E8DFD3`) | Named, flagged additions — a warm cardstock surface and a warm sand divider, used *instead of* stark white / cold gray anywhere this build renders a literal paper/cardstock object. Never a silent replacement for a shipped brand value. |
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
