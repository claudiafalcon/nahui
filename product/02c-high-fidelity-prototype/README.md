# Nahui — High-Fidelity Living Prototype

Real, running React/TypeScript vertical slice: **Home → Inventario → Registrar
mercancía → Selling → Digital receipt.** Built per `decision-log.md` D41 —
placement/architecture ruling only; this file is the artifact itself.

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

## File structure

```
product/02c-high-fidelity-prototype/
  README.md                  — this file
  package.json, tsconfig*.json, vite.config.ts, index.html
  src/
    main.tsx, App.tsx         — StoreProvider + tab shell (frozen 4-tab nav)
    styles/
      tokens.css              — design tokens (see "Design plan" above)
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
