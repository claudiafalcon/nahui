# Brand

## Live brand guide (Claude Design)
https://claude.ai/code/artifact/810dba2f-7931-49e7-8de1-5f2722a920cc — interactive version with full rationale (color usage, typography choices, component specs). Use this link for presentations/pitch; this file is the plain-text reference for agents.

## Colors (final, per Claude Design brand guide)
- Coral (Primary): #E86248 — reference brand hue; non-text-critical uses only (illustration, decorative accents, brand marks). **Does not meet WCAG AA text contrast (3.35:1 vs. white) — never use for Primary-button fill or Tertiary/link text; use Coral AA+ instead (`company/business-decisions.md` Q12, Resolved).**
- **Coral AA+: #C13F26 — 5.24:1 contrast vs. white, passes WCAG AA with real margin.** The button/link-safe variant of Coral: use for Primary-button fill (white text on top) and Tertiary/link text on white/light backgrounds — anywhere Coral would otherwise be load-bearing for text/icon contrast. Resolves `company/business-decisions.md` Q12. Chosen over reusing `color/tezontle-dark` (accessible but reads as maroon, collides with Destructive/Error semantics) and over a tighter minimal-shift alternative (`#CE4935`, 4.54:1 — too little margin above the AA line for safe real-device rendering).
- Tezontle: #D94C3A — hover/pressed state for Coral AA+ elements
- Tezontle Dark: #A72C2C — high-contrast accent, dark-mode primary
- Blush (Secondary): #F2887C — tints, badge fills. Never for body text
- Obsidian: #2D2D2D — all body text and icons on light backgrounds
- Balanced: #F4F4F4 — default page/app background
- White: #FFFFFF — card and sheet surfaces
- Dropped: "Primary Blue #4A90E2" — flagged by Claude Design as a leftover from an earlier direction, doesn't match the logo or shipped mockups. Not part of the palette going forward.

## Typography (final, per Claude Design brand guide)
- Display type (headings, logo-adjacent text): Fredoka — shares the logotype's rounded terminals
- UI text (dense, body copy, labels): Inter — chosen for legibility at small sizes
- Neither prior source (brand-guide.md draft or nahui_palette.svg) defined a UI font; this was decided fresh by Claude Design based on the rounded-geometry brand identity.

## Status colors (new)
Reserved for system feedback, kept muted so they don't compete with Coral:
- Success: #2E7D46
- Warning: #C8811A
- Error: #A72C2C (shared with Tezontle Dark)

Error color usage: reserve Error red for failures with real merchant-facing consequence — a write/save that failed, or entered data at risk (e.g. `home.md`'s Finalizar Venta error, `events.md`'s "No se pudo guardar..."). A passive, retry-only tab-load failure — nothing entered, nothing at risk, just "Reintentar" — uses plain body text instead; the tone should stay calm and routine, not alarming, since nothing was lost. First clarified during `reports.md`'s Medium-Fidelity pass (`product/02b-medium-fidelity/reports.md`) after its own defensive-fallback frame (§3.14) was found using Error red inconsistently with `home.md`/`events.md`/`inventory.md`/`onboarding.md`'s equivalent fallback states, which correctly used plain text. Reuse this distinction rather than defaulting every error-adjacent screen to Error red.

## Type scale
- 40/48, weight 600 — largest display
- 32/40, weight 600
- 24/32, weight 500
- 20/28, weight 600
- 16/24, weight 400 — body default
- 14/20, weight 400 — small body
- 12/16, weight 600 — labels/caps
- 11/14, weight 500 — smallest, badges/meta
(format: font-size/line-height, weight)

## Spacing & radius
- Spacing scale: 4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px
- Radius scale: sm 8 · md 12 · lg 16 · xl 24 · pill (full round)
- Rounded geometry applied consistently — soft curves everywhere, no sharp corners.

## Buttons
- Primary action — solid Coral AA+ fill, white text (`company/business-decisions.md` Q12)
- Secondary action — outlined/light fill
- Tertiary/link — text-only, Coral AA+ (`company/business-decisions.md` Q12)
- Disabled — muted gray, no interaction
- Destructive action — solid Tezontle Dark fill, white text. For rare, effectively irreversible actions only (e.g. cancelling an Event, discarding a Sale) — never for a routine negative action like a simple "no"/dismiss. First built during `events.md`'s Medium-Fidelity pass (`product/02b-medium-fidelity/events.md`) to give a destructive confirm visual weight distinct from Primary's "expected next step" treatment; reuse this variant rather than inventing a new one for the same pattern elsewhere (e.g. Home's "Cancelar venta actual," Inventario's "Descartar").

## List rows — tappability signal
For a plain list row that drills into more detail (not a bordered card, not a button) — e.g. a day/session row, a venue row — signal tappability with a small filled triangle (`▸`) in Coral at the row's trailing edge, the same token and glyph already used for "Ver más ▸" teaser links. **Flagged, not yet resolved:** this is a small glyph on a light background, the same underlying contrast math as Q12 (Coral computes ~3.35:1) — outside Q12's approved scope (Primary-button fill, Tertiary/link text only), but worth a quick follow-up decision on whether to widen to Coral AA+ too. Give the row a real minimum tap-target height (~46-48px), not just the glyph. First established during `reports.md`'s Medium-Fidelity pass (`product/02b-medium-fidelity/reports.md`) to replace a weaker gray-chevron pattern; reuse this rather than inventing a third tappability signal elsewhere (e.g. `onboarding.md`/`settings.md`'s upcoming Medium-Fidelity work). A row using this pattern is tappable; a row without it (plain text, no chevron) is deliberately passive — the same row *shape* can be either depending on the tab (see `events.md`/`reports.md`'s own documented Día-row tappability distinction, EVT-MIN4/RPT-S3).

## Cards
- Stat/highlight card (e.g. "Ventas del día $4,850.00") — solid Coral background, white text, large number emphasis. **Flagged, not yet resolved:** white text on this fill has the identical Q12 contrast problem as the Primary button (same underlying color, same ~3.35:1), but wasn't part of Q12's approved scope — worth a quick follow-up decision.
- List card (e.g. customer/transaction rows) — white background, avatar circle + name + amount, light dividers
- Media card (e.g. bazaar photo) — image top, content below, rounded corners per radius scale

## Form inputs
- Label above field, light border, rounded corners (radius scale)
- Error state shown inline below field in Error red
- Standard fields observed: email, password, monto (amount), concepto (optional text)

## Badges & status tags
- Pill-shaped (radius: pill), used for status words (e.g. "Pagado", "Confirmado", "Pendiente")
- Color-coded by status (success/warning/error/neutral)
- Dot indicators used for loyalty/progress (e.g. filled vs. outline circles for a punch-card style tracker)

## Bottom navigation
- Fixed bottom bar, icon + label per item, active item highlighted in Tezontle Dark (rebound from Coral for WCAG AA contrast during Medium-Fidelity work — Coral's ~3.35:1 fails the same way it did for Primary buttons, see Q12), rest in Obsidian/gray

## Tagline
"The path to what's next"

## Name meaning
**Nahui** comes from Nahuatl, tied to the concept of **movement, transformation, and the four cardinal directions** (as in *Nahui Ollin*). It reflects that every business is constantly evolving — selling, learning, growing, adapting. It also honors Mexican roots while keeping a modern, global identity.

## Logo meaning — the four pillars
The Nahui symbol is intentionally simple. It is **not a cross** — it represents four elements converging at a shared center:
- Comercio (Commerce) — the sale itself, the transaction as it happens
- Clientes (Customers) — the relationship, loyalty, who buys and how
- Datos / Inteligencia (Data / Intelligence) — turning what happens into decisions
- Movimiento (Movement) — the itinerant nature of the business itself: moving between bazares, adapting, growing. Directly tied to the name's origin (Nahui Ollin).

## Rounded geometry
Chosen deliberately. Traditional institutions often signal authority through rigid, sharp geometry. Nahui takes the opposite approach — soft curves communicate approachability, simplicity, trust, human-centered technology. A tool that feels welcoming, not intimidating, to someone who has never used business software before.

## The center
The empty space at the center is not accidental. It's where the four pillars meet — where a sale becomes data, where a customer becomes a relationship, where movement becomes a pattern worth acting on. Nahui exists at that intersection: not a single feature, but the connective layer.

## A living symbol
The mark can be read multiple ways — a plus sign (growth, added value), a compass (four directions), four connected paths, a person with open arms, continuous movement around a shared center. The ambiguity is intentional: memorable, and reinforcing the idea of connection and transformation rather than a single fixed meaning.

## Tone
Warm, direct, respects the vendor's intelligence — never condescending about "informal" commerce.

## Brand attributes
Human · Intelligent · Trustworthy · Simple · Connected · Mexican by origin, global by vision.

## Brand promise
Connecting commerce, customers, and intelligence so every itinerant merchant can see their own business clearly — and grow it on their own terms.

## Vision
To become the operating system for itinerant and informal commerce in Latin America — starting with something as simple as registering a sale — so merchants like Ana can make better decisions without needing to become accountants or data analysts.

## Scope note (important for whoever designs from this doc)
This is a brand identity document, not a product spec. It intentionally does NOT include payments/checkout as a pillar or promise — that is an explicit non-goal today (see company/CLAUDE.md). If a future strategic decision changes that, update this doc explicitly; don't infer payment features from brand language alone.
