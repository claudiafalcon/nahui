# Nahui — High-Fidelity Living Prototype

Real, running React/TypeScript vertical slice: **Home → Inventario → Registrar
mercancía → Selling → Digital receipt.** Built per `decision-log.md` D41 —
placement/architecture ruling only; this file is the artifact itself.

**Design system reference:** `DESIGN-SYSTEM.md` — the structured, reusable
rules (tokens, primitives, the Swing Tag at five scales, typography/motion
roles, content conventions). This README stays the *history* of how the
system was arrived at, pass by pass (the "Design plan" / "Design System —
v1/v2/v3/Demo Polish" sections below) — `DESIGN-SYSTEM.md` is the *what a
new screen should follow*, stated once instead of re-derived from prose.

Not disposable demo code, not yet `03-build`. The Product Owner will decide,
from what's running here, whether this becomes Nahui's primary living
prototype. Scope, source-of-truth hierarchy, and functional/visual freedom
constraints all came from the dispatching task — see "Scope decisions" below
for how each judgment call was resolved.

## Run it

```
cd product/02c-high-fidelity-prototype
npm install
npm run dev       # http://localhost:5183
```

`npm run build` produces a production bundle in `dist/` (verified clean —
`tsc -b` and `vite build` both pass with zero errors as of this writing).
`npm run preview` serves that build locally.

No backend, no auth. State lives in React Context + `useReducer`-style
`useState` updates, persisted to `localStorage` (key
`nahui-hifi-prototype-v1`) so a reload or tab switch never loses real state.
Clear that key (or open in a private window) to see the true first-run cold
start again.

## Walkthrough that's actually wired, end to end

1. Fresh load → **Home cold start** (no `available` InventoryUnit exists yet)
   → tap "Registrar mercancía."
2. **Registrar mercancía** → "Elegir producto" → type a new name (e.g.
   "Playeras") → required price → set a quantity → "Guardar mercancía."
3. **Inventario's Catalog view** now shows that Product for real, with an
   ambient "Mercancía registrada ✓" confirmation and the actual count typed.
4. Back on **Home**, the cold start is gone (real `hasAnyAvailableUnit`
   check) → "Iniciar Sesión Rápida" → **Selling** grid shows the same
   Product, same count.
5. Tap the tile → FIFO-consumes the oldest `available` InventoryUnit for
   that Product (decision-log.md D5), adds a real `SaleItem` with
   `pricePaid` resolved from `Product.defaultPrice` (D33) → "Venta actual"
   updates → "Finalizar Venta."
6. **Digital receipt** (full-viewport, the "Tag Tear" signature element) —
   shows the actual sum of this Sale's `SaleItem.pricePaid`, the business
   name. Exit via the (deliberately unmarked, per spec) bottom margin zone.
7. Back in Selling, the header's running total/venta count reflect the
   finalized Sale for real. Back in Inventario, the Product's `disponibles`
   count is down by however many units were just sold.

This was verified with a scripted, real-browser walkthrough (Puppeteer
driving a real Chrome instance against the dev server, not a mock) —
screenshots of every step were reviewed during the build; see "Self-critique"
below for what that surfaced.

## Design plan (per the `frontend-design` methodology, applied before writing
any component)

**Color** — the shipped `company/brand/brand-guide.md` tokens, unchanged, not
reinvented: Coral AA+ `#C13F26` (primary), Tezontle Dark `#A72C2C` (pressed /
active nav / receipt total), Blush `#F2887C` (tag/marker fills), Obsidian
`#2D2D2D` (text), Balanced `#F4F4F4` (canvas), White `#FFFFFF`. Two small,
explicitly-flagged **extensions** (`src/styles/tokens.css`), never a
replacement for a shipped value: `--color-paper` (`#FFFCF8`, a warm card
surface — used for tags, sheets, the receipt — instead of stark white) and
`--color-hilo` (`#E8DFD3`, a warm sand divider instead of cold gray). Named,
because "grounded in the subject" for a clothing-market vendor means paper
and thread tones read truer than clinical UI gray.

**Type** — Fredoka (display) / Inter (UI), the shipped pairing. The
deliberate choice is *restraint*: Fredoka is reserved for moments that
actually matter — the "Nahui"/"¿Vas a vender hoy?" greeting, the receipt
total — never every heading. Inter carries the working UI. This is the
opposite of treating Fredoka as a default "friendly font" slapped on
everything.

**Layout** — mobile-first single column, the frozen four-tab nav
(`information-architecture.md`) always present and always tappable. Flat list
rows in Inventario (no card-per-row), a large tactile 2-column tile grid for
selling (the one place tap-target size is the actual product requirement,
not decoration), and — the one deliberate risk — the receipt reinterpreted as
a physical object rather than three centered lines of text.

**Signature element — "the Tag Tear."** The Digital Receipt
(`home.md` §3.8f) renders as a literal torn market ticket: a scalloped,
punched top edge (`ReceiptTicket.module.css`, a repeating radial-gradient
mask, not an SVG asset) as if torn from a roll, dropping into view. This is
grounded directly in Ana's own physical world — the price tag/ticket stub
she already tears off for a customer — and in the brand mark's own stated
meaning ("four elements converging at a shared center," `brand-guide.md`):
product, customer, data, and movement all land in this one moment. The same
tag vocabulary repeats at small scale as `TagStub`, the per-Product letter
marker the low-fi spec calls for but deliberately leaves unstyled
("the actual visual treatment... is a Medium-Fidelity/`ui-designer`
decision," `home.md` §3.9) — one consistent visual language, not a one-off
flourish. Everything else on the receipt stays quiet around it (Chanel's "one
accessory" — restraint is the point).

**Critique against genericness (done before writing code, per
`frontend-design`'s required pass):** none of the three named AI-default
looks apply — no warm-cream+serif+terracotta (this is a rounded coral system
with a display sans, not a serif), no near-black+neon (canvas is warm/light
throughout), no broadsheet/hairline/zero-radius (brand mandates rounded
geometry and pill buttons throughout, the opposite of that look). The
receipt in particular was checked against "would this be my default answer
for any similar checkout/receipt screen?" — a generic answer here is a
gradient card with a checkmark icon; the torn-ticket motif is specific to
this subject (a market vendor's own paper tickets) and doesn't transfer
cleanly to an unrelated SaaS receipt.

## Scope decisions (stated explicitly, per the task's own requirement)

- **`subscriptionTier` fixed at `'free'` for this slice.** Per D27, `nfc ∈
  registrationMode ⟺ subscriptionTier = paid` — so this Business never has
  `nfc` available, and `Session.operatingMode` always resolves silently to
  `'buttons'` (the Ready/common-case branch, D23). No NFC hardware
  simulation is attempted, and no `home.md` §3.6a variant is reachable in
  this slice — by construction, not by an unstated omission. This also
  correctly keeps the Paid-tier Claim Token/QR bridge (D22/D40, which routes
  into `product/02-ux-loyalty/`, a structurally separate deploy target per
  D38) out of scope: the receipt renders the exact three-element Free-tier
  variant `home.md` §3.8f specifies, nothing invented or stubbed.
- **Full unit-level inventory modeling (`Product → Lot → InventoryEntry →
  InventoryUnit`), not the simplified single-quantity fallback the brief
  permitted.** FIFO consumption by receipt date (D5) is real, not
  decorative — `src/domain/store.tsx`'s `addItemToSale` sorts `available`
  units by `receivedAt` and consumes the oldest first. Chosen because it's
  cheap to model correctly and is exactly the "real architecture to
  continue building from" the task asked for.
- **`Business.name` is pre-seeded ("Luna Mercado"), not captured.**
  Onboarding is out of this slice's scope, and D36 requires `Business.name`
  to exist unconditionally — so a pre-existing business (the honest state
  Ana would already be in) is the correct substitute, not an empty/undefined
  identity.
- **Every Session in this slice is a Quick Session (`eventId: null`).**
  Eventos is out of scope, so the header always reads "Sesión rápida" per
  `home.md` §3.7b, never "Plaza Norte · Día 2."
- **Eventos, Resultados, Configuración are honest placeholders, not hidden.**
  The frozen four-tab nav (`information-architecture.md`) and the
  session-controls "⋯" affordance (D13) both still render and stay
  reachable at all times — nothing is silently removed from the shell. Each
  unbuilt destination says plainly that it isn't part of this prototype,
  the same "never a dead end" discipline the approved specs apply to every
  other not-yet-built state, rather than a broken tap or a missing tab.
- **Sync-failure/retry states are not wired to a real failure simulator.**
  `home.md` §3.8a/§3.8d, `inventory.md` §3.11's error/"Reintentar" states
  exist in the approved specs but this prototype's local data layer never
  actually fails a write, so those specific screens aren't reachable through
  real interaction in this pass — disclosed here rather than silently
  dropped. (The near-instant/slow "saving" beat *is* real — see
  `Selling.tsx`/`RegisterMerchandise.tsx`'s deliberate ~260ms pause before
  the write commits, matching `home.md` §3.8c / `inventory.md` §3.10's
  own near-instant-vs-slow convention.)
- **Registrar mercancía's in-progress draft (committed lines + the active
  row) lives in local component state, not the global store.** Per
  `inventory.md` §3.7, this draft should survive navigating away and back;
  in this build it survives staying on the screen (back-arrow within the
  form, etc.) but resets if you switch nav tabs away from Inventario and
  back, because `App.tsx` unmounts the screen tree per tab. Everything that
  actually matters for the required walkthrough — the Catalog, Session,
  Sale, and receipt state — lives in the global store and *does* survive
  tab switches and reloads; this is a narrower, disclosed gap, not a
  reset of the core loop.
- **`CloseSummary.tsx`'s single button reads "Entendido," not the approved
  spec's "Ver detalle."** `home.md` §3.12's close-summary is deliberately
  two numbers only (free tier) with no further detail screen built in this
  slice, so a "ver detalle" label would point at a destination that doesn't
  exist here — "Entendido" is a plausible, deliberate demo substitution for
  that reason, not an oversight.

## Deviations from Medium-Fidelity's visual treatment (named explicitly, per
the task's own request — this should be the norm, not the exception, for a
High-Fidelity pass)

- **Typography is actually applied.** `product/02b-medium-fidelity/`'s own
  tracking notes describe component reuse and layout only — no evidence
  Fredoka/Inter's type pairing was ever rendered there; this build is the
  first place that pairing (and the restraint rule governing where Fredoka
  appears) is real.
- **The receipt is reinterpreted, not reskinned.** Medium-Fidelity's
  receipt used a flat, centered `BrandMark` component ("two overlapping
  rounded bars forming a plus") with plain text beneath it, per its own
  tracking notes — a correct, functional composition with zero material
  identity. This build's torn-ticket signature element is new.
- **The per-Product letter marker gets a real visual identity** (the small
  hang-tag `TagStub`, tying it to the receipt's own motif) — the low-fi spec
  explicitly left this undecided pending Medium/High-Fidelity work; this is
  that decision, made once, consistently, everywhere the marker appears.
- **Motion is real.** Sheets slide up with easing, the receipt drops in,
  tiles compress on tap. Figma's click-through prototyping is a state jump,
  never real motion — this is the first pass where that distinction matters.
- **No solid-color "stat card" block for the running total.** `brand-guide.md`'s
  documented Card pattern (solid Coral background, white text, large number)
  was built for Home's header in Medium-Fidelity per that file's own
  changelog. This build deliberately keeps the in-session header quiet — a
  small numeral inline, not a colored block competing with the selling
  grid — and spends that same visual weight once, at the receipt's own
  total, where it actually matters most. A considered call, not an oversight.
- **Custom nav icons.** Medium-Fidelity's tracking notes name no icon
  component; this build ships a small set of rounded-stroke line icons
  matching the brand's own geometry.

No place in this build preserves Medium-Fidelity's visual treatment
unreinterpreted — that was the explicit instruction, and every visual choice
above was made against the approved *behavior*, not against a Figma
screenshot.

## UX ambiguity / Foundation gaps flagged (none blocking; stated honestly
rather than silently resolved)

No genuine contradiction in the approved specs was found. Three small,
low-stakes implementation-completion judgment calls were made where the
low-fi spec is intentionally loose (not contradictory) — named here so
they're visible, not because they need escalation:

1. **`inventory.md` §3.6's "Guardar mercancía enabled once Producto is
   chosen"** describes the single-row case. When 1+ lines are already
   committed and the active row is blank, this build keeps "Guardar
   mercancía" enabled off the committed lines alone (`canSave = committed.length
   > 0 || draft !== null`) — a direct, low-risk reading, not a new rule.
2. **§3.9's "Sí, descartar" scope** — the wireframe's own example only shows
   already-committed lines being discarded. This build also clears
   whatever's in the still-uncommitted active row, on the reading that
   "descartar el borrador" means the whole in-progress form, not just its
   committed portion.
3. **The receipt's margin-zone exit has no visible affordance at all, by
   spec** ("no rendered marker, no label, no visible boundary,"
   `home.md` §3.8f). Followed exactly as written — worth naming that this
   makes the exit genuinely non-obvious to anyone reviewing the prototype
   who isn't told where to tap, which is the correct behavior for the
   customer-facing moment it's modeling, not a bug.

## Self-critique (the `frontend-design` skill's required second pass, done
against real screenshots — a scripted Puppeteer walkthrough against a live
Chrome instance, not a static mockup)

**What holds up:** the receipt reads as a distinct, intentional object, not
a generic confirmation screen — the scalloped edge is visible and legible
even at a glance. The type pairing's restraint works: Fredoka shows up
exactly three places (wordmark, session question, receipt total) and each
one earns it. Real state flows correctly and visibly across every screenshot
— disponibles counts, running totals, and the receipt's own total all matched
hand-calculated expectations at each step.

**What was fixed after the first review pass:**
- The product picker showed "Sin resultados." even on a completely empty
  Catalog with nothing typed yet, which reads as a search that failed
  rather than "there's nothing to search yet" — corrected to a first-run-
  appropriate line.
- Spanish pluralization ("1 artículos," "1 ventas," "estos 1 artículo") was
  wrong in four places once a real single-item Sale was walked through end
  to end — a class of bug that's easy to miss when eyeballing wireframe
  copy with placeholder counts, and exactly the kind of thing a real,
  interactive build (vs. a static mock) surfaces. Fixed with one shared
  `pluralize`/`articulos` helper (`src/domain/format.ts`) reused everywhere
  a count renders, rather than four separate inline fixes.

**What's honestly still thin, named rather than hidden:** the scalloped
receipt edge is a restrained effect and could read as more deliberate at a
slightly larger notch size — it was kept small on purpose (competing with
the total would defeat the point), but it's the one place a second design
pass would look first. The Eventos/Resultados/Configuración placeholders are
functionally honest but visually minimal — acceptable since building them
out was explicitly not the task, but worth naming so it's not mistaken for
an oversight if the vertical slice expands later.

## Visual revision v2 (2026-08-12) — Product Owner direct feedback: "too close
to polished Medium Fidelity," not the High-Fidelity leap expected

The Product Owner reviewed v1 directly and judged it functionally clean but
visually sparse/static — "it has the Nahui colors, but it does not yet have
enough Nahui product character." Explicitly not a checklist: no components
were prescribed, on the stated premise that part of this experiment is
evaluating `frontend-design`'s own judgment given real creative latitude.
This section documents that second pass, structured the way the Product
Owner asked (functional behavior unchanged throughout — verified below).

**1. Visual thesis for this merchant context.** Ana's countertop mid-sale
should feel like an actual market stall in the middle of a transaction — a
growing stack of colored ticket stubs, tags pinned at a slight hand-placed
tilt, paper with real texture — not a settings screen that happens to sell
things. Life comes from *materiality and motion tied to what's actually
happening* (an item lands, a total climbs, a tab is torn), never from
adding more panels, cards, or numbers to look at.

**2. Color/token system.** The shipped `brand-guide.md` palette is
unchanged. New, named additions in `src/styles/tokens.css`: a 12-swatch
"tag drawer" (`--tag-1..12-bg/-ink`) — three are the shipped Blush/Coral/
Tezontle hexes used decoratively for the first time (Coral's own
brand-guide.md note explicitly permits decorative/illustration use); nine
are new tones mixed to sit inside the same warm coral→terracotta→clay→sand
family, never a hue outside it (no blue, no green, no violet anywhere).
Each Product hashes deterministically to one tone (`productIdentity.ts`) —
the same tone follows that Product everywhere it renders. Also added: a
5%-then-tuned-to-2%-opacity ambient texture (`--pattern-weave`, a tiny
repeating cross echoing the brand mark) tiled once at the app-shell level.

**3. Typography roles.** Unchanged pairing (Fredoka display / Inter UI),
restraint rule *extended*, not abandoned: Fredoka now also carries the
in-session running total (`SessionHeader`) and the receipt's count-up
total — both are "a sum of money that matters right now" moments, the same
category Fredoka was already reserved for, not a loosening of the rule.
Product names, labels, and every dense UI surface stay Inter.

**4. Composition/layout concept — the actual structural change, not just
decoration** (per the coordinator's explicit clarification that
Medium-Fidelity-era composition, as opposed to the approved UX behavior
itself, was fair game to rethink):
- **Selling screen: `SessionHeader` + `VentaActualTray` recomposed as one
  continuous "active transaction" surface**, not two flat disconnected
  rows on bare canvas. Same components, same props, same information
  (session identity, running total, "⋯" controls, always-visible Venta
  actual even when empty, Cancelar) — now a single paper-toned zone with
  its own torn lower edge, separating "where the live transaction lives"
  from the catalog grid below it. This is the direct answer to "an active
  sale feels like a mostly empty screen" — the same underlying UX
  requirement (ambient Venta-actual visibility, running total, session
  controls) is satisfied by a different arrangement of the same elements.
- **`VentaActualTray` renders each Sale line as a small tag chip** (tone +
  marker + name + ×qty), settling into the row as it's added, instead of a
  joined name string. Same underlying data (`Sale.items`, Product names
  only, no price/unit/lot — architecture-principles.md #4 unchanged).
- **`ProductTile` gains a per-Product tone accent, a die-cut corner notch,
  and an "already in this Sale" badge/wash** — a purely local aggregation
  of `Sale.items` by `productId` (computed in `Selling.tsx`, not a domain
  change) drives the badge; no new information is shown that wasn't
  already derivable from existing state.
- **Idle/ColdStart recomposed from a dead-centered stack to an asymmetric
  layout**, anchored by an oversized, softly-tinted BrandMark watermark
  (the same mark, reused at a different scale, not a new decorative
  device) bridging the empty canvas between the greeting and the CTA.
- **`CatalogRow` gains the same per-Product tone as a thin leading rail** —
  the "flat list, no card-per-row" discipline from v1 is kept exactly (no
  bordered/shadowed row was introduced); the tone is what now ties
  Inventario to the selling grid visually.
- **`NavBar`, `Sheet` gain the receipt's own perforation motif** at
  progressively smaller scale (nav's top edge, sheet's rising edge) — one
  signature vocabulary reused system-wide, the specific gap v1's own
  self-critique named ("the Eventos/Resultados/Configuración placeholders
  are... visually minimal," "the scalloped edge... kept small on purpose").

**5. Signature element.** Still the Tag Tear (`ReceiptTicket`), pushed
further per explicit instruction: larger notches top *and* bottom (reads
as a stub floating between two tears, not a card with one decorated edge),
a slight rotational swing-settle on drop-in instead of a straight slide,
and the total now counts up rather than appearing instantly. The same
motif now also appears, consistently scaled down, as: `TagStub`'s punched
hole + string loop (every Product marker, everywhere), `ProductTile`'s
corner notch, `NavBar`'s perforated top edge, `Sheet`'s rising edge, and
the transaction panel's own torn lower edge — one vocabulary, not a
one-off flourish confined to the receipt (the exact risk v1's own
self-critique flagged and this pass was asked to go further on).

**6. The justified aesthetic risk.** Reusing one physical metaphor (a torn
market ticket) as the *entire system's* structural language — corners,
edges, badges, and the hero moment all speaking the same visual dialect —
rather than treating each component as its own separate design problem.
The risk: if the metaphor doesn't read at small scale, the whole system
looks like it has stray "bites" taken out of every rounded rect. Judged
worth it because the alternative (each component solved independently) is
exactly how a competent-but-generic SaaS product ends up looking assembled
rather than designed by one hand.

**7. Genericness self-critique.** Could this direction belong to any
generic merchant/payment app? A rounded-corner coral system with
soft-UI tiles, honestly, could — that was v1's own real risk. What makes
v2 harder to mistake for a generic answer: (a) the per-Product tag-tone
system is *specific to a bazaar vendor's own material world* (an assorted
drawer of colored cardstock tags), not a palette-generator output — a
generic answer here would be "assign each category a random Material
Design color"; (b) the torn-ticket vocabulary reused at four different
scales as actual structure (not just the receipt) is a distinctive,
load-bearing design decision a generic template wouldn't make, since it
requires the whole system to agree to one physical metaphor; (c) the
asymmetric BrandMark watermark is Nahui's own mark, not a generic
decorative blob. Where it's honestly still closer to a safe default: the
Button/Sheet component shapes themselves (pill buttons, bottom sheets)
remain conventional — deliberately not reinvented, since the brief asks
for character *without sacrificing speed or simplicity*, and a merchant
mid-sale should never have to relearn what a button does.

**A real bug found and fixed during this pass, not cosmetic.** The
receipt's new count-up total used a pure `requestAnimationFrame` loop with
no fallback. Verified (via `getComputedStyle`, isolated A/B tests, and a
live console dump of the actual `Receipt` object — see the reasoning trail
in this session's scratchpad debug scripts) that `finalizeSale()` and the
domain layer were always correct, but rAF can legitimately stop firing
entirely under real, non-hypothetical conditions (a backgrounded tab, an
inactive window, aggressive power-saving) — exactly the moment a merchant
turns her phone toward a customer. Fixed with a plain `setTimeout` safety
net (`ReceiptTicket.tsx`) that force-settles `displayTotal` to the true
total once the animation's nominal duration has elapsed, independent of
whether any animation frames actually ran. Separately: a headless/software-
rendered screenshot-capture artifact was found and root-caused (the CSS
color token was always correct per `getComputedStyle`; only a
CSS-keyframe-animated capture in this specific tooling path
under-composited certain paints) — classified as a Tooling Artifact
per `company/CLAUDE.md`'s own category, not a product defect; screenshots
taken with animations neutralized (a standard visual-regression-testing
technique) confirm the shipped color renders correctly.

**Domain layer: fully untouched, not just "disclosed."** No file under
`src/domain/` (`types.ts`, `store.tsx`, `selectors.ts`, `format.ts`,
`id.ts`) was modified — verified by file mtime and content re-read at the
end of this pass. Every visual addition that needed data (per-Product tone,
tilt, in-Sale count/quantity) was computed either as a pure presentation
function (`src/styles/productIdentity.ts`, deriving only from
`Product.name`, already-read data) or as a local aggregation inside the
consuming component (`Selling.tsx`'s `countByProduct`/`lines`, reducing
over `Sale.items`, already-available data) — no new derived selector was
added to `src/domain/selectors.ts`, because none was genuinely needed.

**Honest self-assessment.** This clears "warm, alive, distinctly Nahui"
by a real margin over v1 — the selling screen in particular no longer
reads as a form with a grid attached; it reads as a stall mid-transaction.
Where I'd push further with more time: the tag-tone system caps at 12
colors, so a merchant with a genuinely large catalog (20+ Products) will
see occasional tone repeats — accepted on the same "fast-scan aid, not a
uniqueness guarantee" logic `home.md` §3.9 already applies to the letter
marker itself, but worth revisiting if real catalog sizes prove this
insufficient. The Idle/ColdStart screens, even improved, still carry more
resting canvas below the CTA than the busier screens — inherent to having
only one action to offer there, not fought further given "density is not
the objective." Whether this now reads as "nothing else on the market"
rather than "a very good coral SaaS app" is a judgment call the Product
Owner is better positioned to make from the running prototype than I am
from describing it — but the receipt-plus-tag-chip-plus-tile-accent system
working together, system-wide, off one reused physical metaphor, is the
strongest case this pass has for it.

## Design System — v3 (2026-08-13) — Product Owner direct feedback: v2 confirmed
as a real improvement over Figma Medium-Fidelity and v1, but the next pass
should establish Nahui's visual *language* first, not keep polishing screens

The Product Owner's own framing for this pass, relayed directly: *"What
should make Nahui instantly recognizable? What is Nahui's signature visual
element? What recurring visual language ties together inventory, products,
selling, receipts, loyalty and events? ... Do not optimize one screen at a
time. Instead, establish a coherent design language first, then apply it
consistently ... I would rather see one bold, coherent direction than five
conservative improvements."* This section is that answer — a design-system
document first, an implementation record second. Functional behavior,
merchant workflow, domain concepts, and navigation intent are unchanged
throughout (verified below); this pass is visual-only.

### 1. Nahui's visual thesis

**Ana's whole business already runs on tags.** What she has is a rack of
tagged garments. What she sells is a tag coming off that rack. What she
hands over is a torn ticket stub. Nahui doesn't decorate a checkout screen
with a market motif borrowed from Ana's world — it *is built from* one
physical object she already touches a hundred times a bazaar: the swing
tag / price tag, punched hole and string and all, rendered at five
different scales, from a tiny catalog marker up to the full-screen receipt.
The test this pass was held to: a merchant should recognize a Nahui screen
by its *silhouette* — the shape of its corners, its markers, its dividers —
not only by its color, the way v1 and (to a lesser extent) v2 both still
required.

### 2. The signature element(s) — "the Swing Tag," at five scales

One shape — a rounded body, a die-cut corner notch, a punched hole, a
loop of string, a small hand-placed tilt — reused as literal *structure*,
not ornament, at five scales across the app:

1. **Micro (16–20px)** — `VentaActualTray`'s chips, now hanging from a
   stitched "string" line drawn across the top of the tray, not just
   loose colored pills.
2. **Small (44–56px)** — `CatalogRow`'s marker, enlarged from v2's 38px and
   given real weight (a visible border, a bigger punched hole, a firmer
   string) so it reads as an actual object, not an icon.
3. **Medium (the tile itself)** — `ProductTile` *is* the tag shape now: a
   full tone wash (not a thin accent sliver), a die-cut corner, and its own
   marker *pinned outside the frame*, overlapping the top-left corner
   rather than living inside the card's padding — a tag pinned onto a
   folded stack of merchandise, not an icon boxed inside a rounded
   rectangle.
4. **Large (full-bleed strips)** — the Selling transaction panel's torn
   lower edge, `NavBar`'s rising edge, `Sheet`'s rising edge — now drawn
   from one shared formula (`--tear-notch-sm`, `patterns.css`'s
   `.tearTop`/`.tearBottom`) instead of three components each hand-rolling
   their own slightly-different gradient, which is what v2 actually shipped
   despite its own README claiming one shared vocabulary (a real
   discrepancy this pass corrected — see §6).
5. **Full screen — `ReceiptTicket`**, pushed past v1/v2's own self-critique
   ("the scalloped edge... could read as more deliberate at a slightly
   larger notch size"): a bigger notch (`--tear-notch-lg`, 15px, up from a
   hardcoded 12px), *and*, new in v3, an actual punched hole + string loop
   at the very top — the explicit reveal that the receipt isn't just
   torn-ticket-*styled*, it's the same TagStub shape as every small marker
   in the app, just at its biggest size. This is the moment the system
   closes the loop for the merchant: the receipt she just handed a
   customer is visibly the same object as the tag she pinned on the rack
   an hour earlier.

Why this is specifically Nahui's and not any generic merchant/payment
app's: no POS or fintech product's structural DNA is a physical clothing
tag, because none of them are built for a vendor who spends her day
literally tagging garments. A rounded-corner coral system with soft tiles
(v1's real risk, and v2's own named residual risk) is imitable by any
competitor in an afternoon; a system where five completely different UI
surfaces are provably the same die-cut, punched, stringed shape at
different scale is not.

### 3. The design-system direction — primitives, stated as a system

New in v3, centralized in `src/styles/patterns.css` (imported once,
alongside `tokens.css`) rather than re-implemented per component — this is
the literal answer to "what graduates from a one-off screen decision to a
real primitive":

- **`.grain`** — a genuine paper/cardstock fiber texture (SVG
  `feTurbulence`, `--pattern-grain` in `tokens.css`), applied to every
  literal paper surface (`ProductTile`, `Sheet`, `ReceiptTicket`) and once
  at the app-shell canvas. **Replaces v2's `--pattern-weave`** (a 2%-opacity
  brand-mark cross-hatch that, honestly assessed against the actual
  screenshots taken during this pass, contributed nothing legible — see §6,
  "what gets dropped").
- **`.tearTop` / `.tearBottom`** — the shared small-scale perforation strip
  (`--tear-notch-sm`), one formula reused by `NavBar`, the transaction
  panel, and `Sheet`'s rising edge. `ReceiptTicket` keeps its own
  deliberately *deeper* scallop at `--tear-notch-lg` — a genuine tear, not
  a row of sprocket holes — named as an intentional distinction, not an
  inconsistency.
- **`--stitch-line` / `.stitchTop` / `.stitchBottom`** — a new primitive
  this pass introduces: a dashed "sewing machine" line replacing every
  plain 1px hilo hairline (`CatalogRow`, `RegisterMerchandise`'s committed
  lines, `SessionHeader`'s sheet rows, `ProductPicker`'s rows, every
  footer divider). Specific to Ana as a *clothing* vendor, not just "a
  market vendor" generically — her own product is literally stitched.
  Cheap to apply everywhere a divider already existed, which is exactly
  why it reads as systemic rather than decorative.
- **`.moneyTag`** — the hard rule this pass adds: **a price that belongs
  to a specific Product or transaction renders inside a small tilted tag,
  never as bare running text.** Applied to `CatalogRow`'s price (now a
  tilted tag-shaped tap target instead of an outlined pill) and to
  `ReceiptTicket`'s total (a quiet stitched underline under the hero
  number — deliberately the lightest possible execution of the rule, so
  the one number that actually matters keeps v2's own "Chanel — one
  accessory" restraint rather than getting boxed in). **Deliberately not**
  applied to `SessionHeader`'s running "Hoy: $X" — that's a live
  aggregate, not a discrete price, and stays plain Fredoka per the
  existing type-restraint rule. A rule that applied to every number on
  screen wouldn't be a rule, it'd be a decoration.
- **Per-Product tone** (`productIdentity.ts`, unchanged in substance from
  v2 — still 12 hand-picked swatches, still deterministic, still
  presentation-only) now does real work instead of a thin accent: it's the
  tile's own background wash, the marker's own fill, the price tag's own
  border. The selling grid is now visibly "an assorted rack of colored
  tags," which is the literal, structural answer to "recognizability of
  products," not a color-coding afterthought.

### 4. Rationale — tied to Ana's actual context

Ana is mid-sale, phone in one hand, a customer waiting, deciding in
seconds whether to trust a screen enough to keep using it instead of her
notebook. Every choice above optimizes for *recognition speed under real
pressure*, not decoration:

- **A shape she already knows beats a color she has to learn.** A tag's
  silhouette (notch, hole, string) is legible at a glance because it's not
  an abstract UI convention — it's an object from her own stall. Color
  alone (v1's whole strategy, and still most of v2's) requires learning an
  arbitrary mapping; a shape she recognizes from her own physical world
  requires nothing.
- **The stitch-rule and grain add real texture without adding a single
  extra tap, read, or decision.** Both are pure background-layer
  primitives — zero interaction cost, all of the "this feels like a
  physical, considered product" payoff. This matches
  `global-principles.md`'s own UX principle that the fastest interaction
  is the one that never happens: visual richness here costs Ana nothing.
- **The marker breaking the tile's frame is a deliberate risk, taken for
  a reason.** A tag pinned *onto* a surface, not contained *inside* a
  card, is a stronger, more literal read of "this represents real
  merchandise" than a bordered rectangle with an icon in the corner — the
  exact difference between a generic dashboard tile and something that
  looks like it was designed for a market stall specifically.
- **This is what makes it a merchant tool, not a generic SaaS dashboard.**
  A generic dashboard shows a price in a stat card or plain text; Nahui
  shows a price on a tag, because that's genuinely how prices exist in
  Ana's world. A generic empty state uses an icon-and-copy hero; Nahui's
  cold start uses the same tilted tag-badge treatment the rest of the
  system uses. Nothing here is arbitrary brand flourish — every primitive
  traces back to an object Ana already owns.

### 5. Extending to Loyalty and Events (a system question, not a scope
expansion — neither has a built screen in this slice)

The whole point of promoting these from "something v2 did once" to named
primitives in `patterns.css` is that they're not screen-specific. A future
Loyalty punch-card is, structurally, a strip of the same punched-hole
motif already used at micro scale — stamps instead of a hole-and-string,
same shared vocabulary. A future Events surface (a market day) reads
naturally as a paper wristband/entry ticket using the exact same
`.tearTop`/`.tearBottom` perforation primitive `NavBar` and `Sheet` already
consume — no new visual language would need inventing, only a new
consumer of the same tokens. That extensibility is the actual test of
whether this pass produced a *system* rather than five more one-off
decorations, and it's why the primitives live in one shared file instead
of being redrawn per screen.

### 6. Honest accounting — what's kept, what changed, what's dropped

**Kept, because it already worked:** the shipped brand palette exactly as
`brand-guide.md` states it (no reinvention); the `--color-paper`/
`--color-hilo` extensions; the Fredoka/Inter restraint rule (extended, not
loosened — see the money-tag scoping note in §3); the flat-list-no-
card-per-row discipline in `CatalogRow`; the torn-ticket receipt as the
hero signature moment; the 12-tone deterministic per-Product color system;
the existing motion easing curves (`--ease-settle`'s slight overshoot).
These are the actual foundation this pass builds on, not things reinvented
for novelty's sake.

**Changed, because it was real but too quiet to register:** every
perforation notch is bigger and now token-driven instead of hand-tuned per
component; `TagStub` itself is heavier (a visible border, a bigger hole, a
firmer string) since it now has to carry the system's entire vocabulary,
not just be a small letter marker; `ProductTile` went from "a card with a
thin colored accent" to "the tag shape itself, with the marker breaking
its frame"; every plain hairline divider became the stitch-rule.

**Dropped, after an honest look at the actual rendered screenshots (the
Product Owner's own instruction — "critically assess v1 and v2 honestly,"
not assume the last build was automatically the right foundation):**

- **v2's `--pattern-weave`** (the 2%-opacity brand-mark cross-hatch). It
  is not visible in a single screenshot taken during this pass, at any
  zoom level checked — a decorative idea that never actually shipped
  legibly. Replaced by real paper grain, applied only where the metaphor
  is literal (actual paper/cardstock surfaces), not as a page-wide wash.
- **The thin 3–6px colored accent bar/rail** on `ProductTile` and
  `CatalogRow` as the *primary* color cue — too subtle to read as "this
  grid is colorful" from a normal viewing distance, confirmed by
  comparing v2's own screenshots against this pass's. Replaced by full
  tone washes and a marker with real size and weight.
- **A real, non-cosmetic bug caught by actually screenshotting this
  pass's own work, not assumed away:** `patterns.css`'s first draft of
  `.grain` set `position: relative` on its host as a convenience. Because
  `ReceiptTicket`'s `.screen` specifically requires `position: absolute`
  (`inset: 0`, full-viewport), and both rules share the same specificity
  with `.grain` loading later in cascade order, `.grain` silently
  overrode it — collapsing the full-screen receipt down to its own content
  height and pushing its bottom scalloped edge up to sit awkwardly mid-
  screen, right under the business name, instead of at the true bottom of
  the viewport. Caught by literally screenshotting the receipt state and
  noticing a stray row of gray circles where none should be, root-caused
  with `getBoundingClientRect`/`getComputedStyle` (confirmed `position:
  relative` where `absolute` was required), and fixed by removing
  `.grain`'s own `position` declaration entirely — every current consumer
  already establishes its own positioning context, so the primitive never
  needed to set one. Documented in `patterns.css` itself so a future
  consumer doesn't reintroduce the same assumption.
- **A second bug from the same restructuring work:** `ProductTile`'s
  die-cut corner notch, when the tile was first given `overflow: visible`
  (needed so the new pinned marker could break the frame above the tile),
  stopped being clipped to the corner and rendered as a stray floating
  white diamond beside the tile instead of a clean bite out of its corner
  — visible in this pass's own first-draft screenshot. Fixed by splitting
  `ProductTile` into two layers: an outer `.tile` (`overflow: visible`,
  hosts only the breaking-the-frame marker) wrapping an inner `.surface`
  (`overflow: hidden`, hosts the toned card and its die-cut corner) — the
  clipping the notch needs and the overflow the marker needs were never
  compatible on one element, so they're now on two.
- **v2's own documentation overstated what shipped**, a discrepancy this
  pass corrected rather than perpetuated: v2's README claimed `Sheet`
  "gains the receipt's own perforation motif at progressively smaller
  scale," but `Sheet.module.css` at the start of this pass had no such
  treatment — only a plain handle pill. `Sheet` now genuinely has the
  perforation (via the shared `.tearTop`/`.tearSm` primitive, clipped to
  its own rounded corners via `overflow: hidden`), closing a gap between
  what was documented and what was actually built.

**What still feels the most generic after this pass, named rather than
hidden:** the Idle/ColdStart screens' fundamental composition (a centered
badge, a headline, one CTA, a lot of resting canvas below it) is still the
closest thing in this system to "any onboarding empty state" — improved
(the badge now carries the tag family's own tilt and grain, tying it to
the rest of the system rather than being a one-off hero treatment) but not
restructured, on the same reasoning v2 already gave and this pass didn't
find a better answer to: there is only one action to offer on that screen,
and "density is not the objective." This is the one place a future pass
should look first if the Product Owner wants to push further.

### Verification — functional behavior unchanged

No file under `src/domain/` (`types.ts`, `store.tsx`, `selectors.ts`,
`format.ts`, `id.ts`) was read for editing purposes or modified — confirmed
via `git status`/`git diff --stat` scoped to that directory, both empty, at
the end of this pass. Every visual primitive added is either pure CSS
(`patterns.css`, `tokens.css`) or a presentation-only prop/className change
in an existing component; no new store action, no new selector, no new
domain-shaped data was introduced. The full scripted walkthrough (Home cold
start → register a Product → Catalog → Selling → tap a tile twice → close
edge cases → Finalizar Venta → receipt → back to Catalog with the real
decremented count) was re-run against this build via a real headless-Chrome
session driving the live dev server, not a static mock, and every state
transition (`disponibles` counts, running totals, the receipt's own total)
matched hand-calculated expectations exactly as in v1/v2 — nothing in the
underlying data flow changed, only its presentation.

## Demo Polish pass (2026-08-13) — Product Owner-approved visual direction
(v3), focused pass to prepare for showing this to a real external audience

The Product Owner approved v3's Swing Tag direction outright — this pass is
explicitly *not* another design exploration. It is bounded: consistency,
polish, and first-impression quality on top of what's already approved,
"fix only issues that materially improve the first impression," not an
exhaustive audit. Functional behavior, merchant workflow, domain concepts,
and navigation are unchanged throughout (verified below, same discipline as
every prior pass).

**1. Naming — "Sesión rápida" → "Venta rápida."** Replaced in both places
the approved spec's own copy appears in this build: `SessionHeader`'s title
row and `Idle`'s primary CTA (now "Iniciar Venta Rápida"). Reasoning
(Product Owner's own framing, adopted as-is): Ana is starting a selling
workflow, not a login session — "sesión" reads as a technical/account term
where "venta" is already her working vocabulary. **This is a prototype-only
naming decision, not a spec correction** — `product/02-ux/home.md` itself
still specifies "Sesión rápida" (§3.4, §3.7b) and is unowned by this build;
if the Product Owner wants this rename to persist beyond this prototype, it
needs to land back in the approved spec through `ux-designer`, not just
here. Flagged, not silently done. Both occurrences were kept identical on
purpose — the spec's own §3.7b amendment explicitly reuses one term across
the CTA and the header to close a prior cross-screen-consistency gap;
diverging the two would reintroduce exactly that gap. **One honest
residual concern, not resolved, surfaced for the Product Owner to weigh:**
"Venta rápida" (the header eyebrow) now sits directly above "Hoy: $X · N
ventas" and "Venta actual: N artículos" — three distinct uses of "venta"
in roughly 80px of vertical space, naming three different domain concepts
(the Session, a count of finalized Sales, the in-progress Sale). Mitigated
today by treatment, not wording (`DESIGN-SYSTEM.md` §7) — the eyebrow is
small-caps/letter-spaced/grey, "Venta actual" is bold sentence-case — but
this is worth a fresh look if a future pass adds a fourth "venta"-prefixed
label to the same zone. A terminology-consistency sweep of the rest of the
slice found nothing else stale — every other label (Registrar mercancía,
Guardar mercancía, Cerrar sesión, Venta actual, disponibles, Finalizar
Venta) already matches its approved spec section consistently.

**2. Selling screen — interaction feedback, not a redesign.** The screen's
composition (the unified transaction panel, the tag-chip tray, the tile
grid) was already strong from v3 and is unchanged. The one real gap: tapping
a tile had no confirmation *after* release — `:active`'s press-scale reverts
the instant a thumb lifts, before a merchant mid-sale has looked back down
at what she tapped. Added `confirmBump` (`ProductTile.module.css`) — a
quick settle-scale plus a brief tone-colored glow — and `badgePop` for the
count badge, both keyed to remount on every count-in-sale change (not just
the first tap), so tapping the same tile twice lands twice. Both use the
system's existing `--ease-settle` curve (§6 of `DESIGN-SYSTEM.md`) — no new
motion language, and both respect `prefers-reduced-motion`. Verified with a
6-Product catalog (not just the 2-Product minimal walkthrough) that the
"assorted rack of colored tags" read holds up convincingly at a realistic
catalog size — screenshots reviewed during this pass; see "Honest
self-assessment" below for the one state (a 1–2-Product catalog) where the
grid still reads sparse, and why that wasn't chased further.

**3/4. Design language — reinforced, not extended.** No new signature
element was added or considered, per explicit instruction. `DESIGN-SYSTEM.md`
is the concrete deliverable for "reinforce, don't invent": it names the
Swing Tag's five scales, the four shared primitives, and the rules
governing them in one place, so a future component reaches for an existing
primitive by default instead of re-deriving one from README prose.

**A real (if small) bug found and fixed during self-review, not cosmetic.**
`Selling.tsx`'s transaction panel, `NavBar`, and `Sheet` all referenced a
`tearSm` class in their JSX (`grain tearBottom tearSm`, `tearTop tearSm`)
that `patterns.css` never actually defined — an unknown CSS class, silently
ignored by the browser, so it never caused a visible defect, but it read as
load-bearing (referenced in three components' own code comments as "the
shared token") when it was dead. `--tear-notch-sm` already does the sizing
work directly inside `.tearTop`/`.tearBottom`. Removed from all three
consumers; confirmed via a clean production build that the compiled CSS
bundle size is byte-identical before/after (`28.32 kB`), which is the
expected signature of removing a selector that was never doing anything.

**Verification.** `tsc -b && vite build` clean (zero errors) both before
committing to the interaction-feedback change and after the `tearSm`
cleanup. A scripted Puppeteer walkthrough against a live Chrome instance
(not a mock) re-ran the full loop — cold start → register 1–6 Products
(both the minimal 2-Product path and a realistic 6-Product catalog) →
Catalog → Selling (empty, single-item, multi-item, sold-out, multi-Product)
→ Finalizar Venta → receipt — with screenshots reviewed at each step;
`disponibles` counts, running totals, and the receipt's own total matched
hand-calculated expectations exactly, confirming this pass changed
presentation only. No file under `src/domain/` was read for editing
purposes or modified.

**Honest self-assessment.** The rename is complete and consistent (grep-
verified — every remaining "Sesión rápida"/"Sesión Rápida" string in the
codebase is inside a disclosure comment explaining the deviation, not
user-facing copy). The Selling screen at a realistic catalog size (5–6
Products) is genuinely the strongest screen in this build — the "assorted
rack of colored tags" thesis reads immediately and confidently, and the new
tap-confirmation feedback closes the one real interaction gap this pass
found. Where this is honestly still thin: a 1–2-Product catalog (exactly
what a from-scratch live walkthrough produces before more Products are
added) leaves real empty canvas below the grid on any modern phone height —
confirmed by testing both catalog sizes side by side. Not chased further
this pass: it's the same accepted "only one thing to show, density isn't
the objective" limitation v2/v3 already named for Idle/ColdStart, it isn't
fixable without either inventing filler content (explicitly against this
system's own restraint principle) or artificially padding tile size, and
the fix that actually matters is operational, not visual — **whoever runs
the live demo should register 4–6 Products up front**, matching how Ana's
real catalog would look, not the 2-Product minimal-path state. Worth
naming as explicit demo guidance rather than a design defect. The receipt,
ColdStart, and Idle screens were reviewed but not touched further this
pass — each already went through multiple targeted revisions in v1–v3 and
none showed a first-impression-blocking issue on review; per this pass's
own "avoid endless polish cycles" instruction, they were left alone rather
than polished for polish's sake.

## Terminology Review pass (2026-08-13) — Product Owner-requested, focused
copy/naming review before further work continues

Explicitly not a design pass: no layout, component, or workflow change —
copy and naming only, evaluated against the merchant's real-world mental
model, not against what "sounds nicer." Same reasoning discipline as the
Demo Polish pass's "Sesión rápida" → "Venta rápida" rename (which this pass
re-examined, not just repeated).

**1. "Cerrar sesión" → "Cerrar jornada de venta."** The Product Owner's own
framing: closing is ending a selling workflow, not logging out. Five
candidates were evaluated against one concrete domain-model constraint, not
picked for style: `ubiquitous-language.md` defines **Session** as "one
working day of selling" (can contain many Sales — the header's own "Hoy:
$850 · 6 ventas" proves it), while **Venta** is already this build's
established term for *one individual transaction* — "Venta actual,"
"Finalizar Venta" (completes one Sale), "N ventas" in the header. Any
rename phrased "cerrar/finalizar + venta" risks a merchant reading it as
"finish the sale in progress" (an action "Finalizar Venta" and "Cancelar"
already own, doing something different — completing or discarding *one*
transaction, not the whole working period):

- **"Cerrar venta rápida"** — rejected. "Venta" is the head noun being
  closed; sitting one menu-tap away from "Venta actual" and "N ventas" in
  the same header, it reads as "close this current quick sale," not "end
  the day." Fails the constraint directly.
- **"Finalizar venta rápida"** — rejected, worse than the above. Reuses the
  *exact verb* ("Finalizar") from "Finalizar Venta," the button a merchant
  has already tapped once per completed Sale all day — the single highest
  collision risk of the four.
- **"Finalizar venta del día"** — rejected. Same verb/noun collision as
  above, *plus* a factual error: "the day's sale" (singular) implies one
  Sale spans the whole day, contradicting the domain model this build's own
  header displays ("6 ventas," not "1 venta del día"). This phrase would
  actively teach the wrong mental model of what a Session is, not just risk
  ambiguity.
- **"Cerrar jornada de venta" — adopted.** "Jornada" (workday/shift) is the
  head noun being closed; "de venta" is a modifier ("a workday of
  selling"), not the object "cerrar" acts on — so neither the verb nor the
  noun collides with "Finalizar Venta." "Jornada" is also a genuinely
  merchant-native Mexican Spanish market-vendor term ("una buena jornada de
  ventas" is ordinary tianguis/bazaar vocabulary), and it maps exactly onto
  Session's own domain definition ("one working day of selling") rather
  than onto Sale's. It also reads coherently with the resulting
  `CloseSummary` screen's own title, "Día cerrado" — closing a "jornada"
  (a day's work) resulting in "Día cerrado" (Day closed) reinforces rather
  than introduces a fourth, competing term.

Changed in `SessionHeader.tsx` (the "⋯" menu's action label) and
`Selling.tsx` (the blocked-interlock body copy, "Termínala o cancélala
antes de cerrar la jornada de venta," kept consistent with the renamed
trigger it describes). The confirm step itself ("¿Ya terminaste por hoy?" /
"Sí, cerrar") was left untouched — it already never said "sesión" and
already reads as merchant-native.

**This is a prototype-only naming decision, not a spec correction** — same
disclosure status as the "Venta rápida" rename. `product/02-ux/home.md`
itself still specifies "Cerrar sesión" throughout (§3.7a, §3.11a's own
title and body copy, §3.12's flow references) and is unowned by this
build; if the Product Owner wants this rename to persist beyond this
prototype, it needs to land back in the approved spec through
`ux-designer`, not just here.

**2. Full-slice terminology sweep — nothing else changed.** Every screen
title, button, menu, and action string in `src/screens/` and
`src/components/` was reviewed against the merchant's mental model, not
just greppable spec-term matches:

- Inventario flow ("Registrar mercancía," "Registro de mercancía,"
  "Elegir producto," "¿Qué llegó?," "Ya agregaste," "+ Agregar otro
  producto," "Guardar mercancía," "Descartar" / "Sí, descartar," "Guardar
  precio") — all already merchant vocabulary matching `inventory.md`
  verbatim, no engineering/technical terms found.
- Selling flow ("Venta actual," "Finalizar Venta," "Cancelar" /
  "¿Cancelar este/estos N artículo(s)?" / "Sí, cancelar," "Cerrando
  venta…," "Venta finalizada ✓") — already consistent, and specifically
  checked against the same "does this collide with Venta-as-one-transaction"
  test just applied to "Cerrar sesión": none of these do, since each one
  *is* correctly describing the single in-progress Sale, not the Session.
- Home idle/cold-start ("¿Vas a vender hoy?," "Iniciar Venta Rápida" — the
  prior pass's own rename, re-checked here and still correct on the same
  reasoning), receipt ("Total," "Continuar vendiendo"), and close summary
  ("Día cerrado," "Entendido") — all read as plain merchant language, no
  technical/implementation terms surfaced.
- `Placeholder.tsx` ("Esta sección no está incluida en este prototipo…")
  is scaffolding disclosure copy, not a merchant-facing product label —
  correctly out of scope for this review.

No second stale term was found. The prior Demo Polish pass's own claim
("A terminology-consistency sweep of the rest of the slice found nothing
else stale… Cerrar sesión, Venta actual, disponibles, Finalizar Venta")
is now superseded for "Cerrar sesión" specifically by this pass's finding
above — that prior sweep checked for internal *consistency*, not for
mental-model fit against the merchant's actual vocabulary, which is the
narrower, sharper test this pass applied.

**Verification.** `tsc -b && vite build` clean (zero errors). No file
under `src/domain/` (`types.ts`, `store.tsx`, `selectors.ts`, `format.ts`,
`id.ts`) was read for editing purposes or modified — confirmed via
`git status`/`git diff --stat` scoped to that directory, both empty.
Grep-verified: zero remaining "Cerrar sesión" (or "Cerrar Sesión") strings
render in any component's JSX — every remaining occurrence in the codebase
is inside a disclosure comment citing the approved spec's own term, not
user-facing copy.

## File structure

```
product/02c-high-fidelity-prototype/
  README.md                  — this file (history, pass-by-pass)
  DESIGN-SYSTEM.md           — structured reference (tokens, primitives,
                               the Swing Tag at five scales, typography/
                               motion roles, content conventions)
  package.json, tsconfig*.json, vite.config.ts, index.html
  src/
    main.tsx, App.tsx         — StoreProvider + tab shell (frozen 4-tab nav)
    styles/
      tokens.css              — design tokens (see "Design plan" above)
      patterns.css              — v3: shared system primitives (.grain,
                                 .tearTop/.tearBottom, .stitchTop/
                                 .stitchBottom, .moneyTag) — see "Design
                                 System — v3" §3
      global.css               — resets, app-shell device frame
      productIdentity.ts       — v2: deterministic per-Product tone/tilt
                                 (presentation-only, derives from Product.name)
    domain/
      types.ts                — Product/Lot/InventoryEntry/InventoryUnit/
                                 Session/Sale/SaleItem/Business, mirroring
                                 domain-model.md's aggregates for this slice
      store.tsx                — StoreProvider/useStore: all writes (FIFO
                                 consumption, price resolution, Session/Sale
                                 lifecycle), localStorage-persisted
      selectors.ts             — pure derived reads (catalog rows, selling
                                 grid order, session totals)
      format.ts, id.ts         — pesos/pluralize formatting, id generator
    components/                — Button, NavBar, SessionHeader, ProductTile,
                                 TagStub, VentaActualTray, ReceiptTicket
                                 (signature element), Sheet, CatalogRow,
                                 QuantityStepper, ProductPicker, Placeholder,
                                 BrandMark
    screens/
      Home/                    — HomeScreen (resolution per home.md §2),
                                 ColdStart, Idle, Selling, CloseSummary
      Inventory/                — InventoryScreen, CatalogView,
                                 RegisterMerchandise, InventoryColdStart
```
