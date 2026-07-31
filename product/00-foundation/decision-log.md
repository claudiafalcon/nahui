# Decision Log

Chronological. Each entry: the decision, why it was made, and what it superseded if anything. Don't edit past entries when a decision changes later — add a new entry that supersedes it, so the reasoning trail stays intact.

## D1 — Registration mode is a Business capability, not a selling-screen choice
The original validation prototype (`product/01-validation/registro.html`) exposed Buttons/NFC as a tab the seller switches live while selling. This was correct for validating registration *speed* (the actual hypothesis under test) but is wrong as a permanent interaction model. `registrationMode` now lives on Business, resolved once at Session start. The selling screen never asks.

## D2 — Product is independent of Lot
Initial framing treated a Lot as if it were tied to a single product ("a Pajama Lot arrived"). Corrected: a Lot is a receiving event that can contain many different Products. Products persist in the Catalog independent of stock, so a sold-out Product doesn't disappear — she'll likely restock it.

## D3 — Full traceability requires unit-level inventory, not batch-level
Initial domain pass modeled Lot → InventoryEntry (a line-item: Product + quantity + cost). This was insufficient: the requirement is that every physical unit's originating Lot is always knowable, even when two Lots of the same Product have different costs. Resolved by generating individual InventoryUnit records from each InventoryEntry — the merchant still just types a quantity, the platform expands it.

## D4 — NFCTag attaches to InventoryUnit, not Product
Originally assumed tags were durable, reusable, and assigned per Product type (matching the validation prototype's flat `uid → producto` map). Corrected: each physical unit gets its own tag at receiving time, so a scan identifies the exact unit (and therefore exact Lot) sold.

## D5 — Buttons-mode inventory allocation defaults to FIFO by Lot receipt date
NFC mode gets unit-level precision for free (the scan says which unit). Buttons mode has no physical identifier, so the system must decide which InventoryUnit a tap consumes. Default: oldest available unit first, fully automatic. Directly follows the principle "every repeated decision should become automation" — this is not a decision the merchant should ever be asked to make.

## D6 — Session does not require an Event
Selling must never require scheduling first — it would add a step in front of the exact friction point (registration speed) already validated as the top priority (`company/backlog.md` #1). Session carries an optional `eventId`; "Iniciar Sesión Rápida" always works with zero setup.

## D7 — Sale is its own aggregate root, not nested inside Session
Considered nesting Sale inside Session's aggregate boundary. Rejected: the <3s speed requirement means Sale writes need to be independent and cheap to append, not mediated through a shared Session-level lock.

## D8 — Bazaar renamed to Event; Event is a light root, not a strict parent of Session
Generalizes beyond bazaars (Expo, Pop-up, Festival, Market, Office Sale) without a schema change later. Event does not own Session as a strict aggregate — "analyze the Event as a whole" is a read-side query across Sessions sharing an `eventId`, not a write-consistency requirement, per DDD guidance to keep aggregates small.

## D9 — Supplier and purchase cost included in schema from v1, deliberately unused
The one sanctioned exception to "build only what's validated." Avoids a future migration once margin analysis / Open Finance features are prioritized. Must stay structurally present and completely invisible (no menu, no screen) until backlog calls for it — see `architecture-principles.md` #5.

## D10 — Loyalty-claim is an independent future module, customer-facing, zero merchant IA presence
The person scanning a sold tag post-sale is the customer, on their own device — not Ana. Modeled as a separate bounded context that only reads `InventoryUnit.status` (must be `sold`) and writes a Customer↔SaleItem link. The dual-purpose tag scan (sale-time vs. claim-time) is disambiguated entirely by `InventoryUnit.status`, so no explicit mode/intent has to be asked of anyone. This is also what guarantees a customer scan can never overwrite or create a Sale — the merchant's finalized Sale remains the sole source of truth structurally, not just by convention.

## D11 — NFC tags are consumable; reframed as a recurring investment, not a one-time kit
`company/CLAUDE.md` originally noted the NFC kit as "likely bundled once, not recurring." That's now superseded: tags are attached per InventoryUnit and leave with the customer permanently (they become part of the loyalty journey, D10). This makes them a recurring consumable — the starter kit is a one-time onboarding item, but merchants buy additional tag packs as they keep selling. This is a business-model decision, not an architectural one; the domain model (D4) already supports either resolution. `company/CLAUDE.md` was updated to match. Positioning: an investment that unlocks customer relationships and analytics, not a recurring cost/burden.

## D12 — Foundation docs live in `product/00-foundation/`, not `company/` or a flat `product/architecture/`
Considered putting this documentation under `company/` (treating it as business-level knowledge) or as flat files directly under `product/`. Settled on `product/00-foundation/` as a dedicated, numbered-first folder: it separates company knowledge (why the business exists), product knowledge (what we're building and why it's structured this way), and execution work (`01-validation` / `02-build` / `03-scale`, which build *on top of* this foundation). Mirrors the existing pattern where `company/CLAUDE.md` is a nested entry point referenced from root `CLAUDE.md`.
