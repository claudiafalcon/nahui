# Brand

## Live brand guide (Claude Design)
https://claude.ai/code/artifact/810dba2f-7931-49e7-8de1-5f2722a920cc — interactive version with full rationale (color usage, typography choices, component specs). Use this link for presentations/pitch; this file is the plain-text reference for agents.

## Colors (final, per Claude Design brand guide)
- Coral (Primary): #E86248 — CTAs, active states, key brand moments
- Tezontle: #D94C3A — hover/pressed state for Coral elements
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
- Primary action — solid Coral fill, white text
- Secondary action — outlined/light fill
- Tertiary/link — text-only, Coral
- Disabled — muted gray, no interaction

## Cards
- Stat/highlight card (e.g. "Ventas del día $4,850.00") — solid Coral background, white text, large number emphasis
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
- Fixed bottom bar, icon + label per item, active item highlighted in Coral, rest in Obsidian/gray

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
