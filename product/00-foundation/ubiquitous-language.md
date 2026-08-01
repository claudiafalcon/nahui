# Ubiquitous Language

One definition per term. If a document elsewhere seems to define a term differently, this file wins — fix the other document.

Each term is tagged with the bounded context that owns it (see `domain-model.md` for context definitions).

## Identity context

- **Business** — the merchant tenant (e.g., Ana). Root of all other data. Holds Business Capabilities.
- **Capability** — a Business-level setting that gates behavior elsewhere in the app. Never asked at Session/Sale time. See `domain-model.md#business-capabilities`.
  - `registrationMode`: `buttons` | `nfc`
  - `eventScheduling`: always available
  - `subscriptionTier`: `free` | `paid`
  - `loyaltyEnabled`: off until the loyalty-claim module exists

## Inventory context

- **Catalog** — the set of Products a Business has ever sold. Persists independent of stock.
- **Product** — a sellable thing (e.g., "Pijama"). Exists independently of any Lot; stays in the Catalog even when sold out.
- **Supplier** — who merchandise was bought from. Present in the schema from v1, not yet exposed in any workflow.
- **Lot** — a merchandise receiving event (date, Supplier, the line items received that day). Owns its InventoryEntries and InventoryUnits.
- **InventoryEntry** — what the merchant actually types when registering a Lot: a Product + quantity + cost. Internal to Lot; never shown to the merchant as its own concept.
- **InventoryUnit** — one physical item, generated automatically from an InventoryEntry (typing "3 Hoodies" generates 3 InventoryUnit records). Carries a status: `available` → `reserved` → `sold`. This is what actually gets sold and what preserves Lot traceability — the merchant never sees or thinks about it directly.
- **NFCTag** — a physical tag's UID, attached 1:1 to an InventoryUnit (only when `registrationMode = nfc`). Consumable — it leaves with the customer after the sale.

## Selling context

- **Venue** — a place Ana sells (e.g., a specific bazaar location). Independent identity, referenced by ID from Event; multiple Events may share one Venue over time. Carries an `active` status independent of any single Event. Replaces what Event's freeform `Nombre` used to double as for identity/grouping, and carries the durable address/notes that replaces Event's former freeform `Lugar` field. See `decision-log.md` D20.
- **Event** — a scheduled occasion to sell. May span multiple days. Lightweight — Sessions reference it by ID, it does not own them. Always references exactly one Venue (required, not nullable) — Event no longer carries its own freeform name or location; both are Venue's. Type is one of a **closed** list for the current phase (Bazaar, Expo, Pop-up, Festival, Market, Office Sale — six values, not merchant-extensible) — see `decision-log.md` D16. The list may grow via a future product update, but is not open/self-service the way Product names are.
- **Session** — one working day of selling. May optionally belong to an Event (`eventId`), or stand alone ("Quick Session"). Opens and closes independently.
- **Sale** — one transaction within a Session. References `sessionId`. Carries an opaque, signed **Claim Token**, generated at finalization whenever `loyaltyEnabled = true` (regardless of `registrationMode`) — the artifact the merchant app displays (e.g. as a QR) so the customer can start the Loyalty-claim flow herself. Never the raw Sale ID — must not be guessable. See `decision-log.md` D22.
- **SaleItem** — exactly one InventoryUnit sold within a Sale. Not quantity-bearing — selling 2 Hoodies produces 2 SaleItems, because each may trace back to a different Lot.

## Future: Loyalty-claim context (not built)

- **Customer** — a person identified through a post-sale claim mechanism (an NFC tag scan, a Sale-level Claim Token/QR scan, or a future mechanism). Does not exist as a concept anywhere in the merchant application — Customer Identity belongs exclusively to the Loyalty platform.
- **Claim** — the act of linking a Customer to an already-sold SaleItem. One business capability (`loyaltyEnabled`), resolvable through multiple mechanisms (NFC tag scan — unit-level; Sale-level Claim Token — resolves to one Claim per SaleItem in that Sale; future mechanisms) — all converging on the identical terminal write. Never creates a Sale. See `decision-log.md` D10 (the original NFC mechanism) and D22 (the generalization to multiple mechanisms).
- **Derived Customer Intelligence** — the only form in which any customer-related information ever reaches the Merchant Application: an anonymized, aggregate signal (e.g., counts of frequent vs. occasional buyers) computed by Loyalty-claim from its Claims and exposed read-only to Intelligence. Contains no name, no contact information, and no per-Claim drill-down — ever. See `decision-log.md` D22.

## Terms we deliberately do not use

- "Selling mode" — Buttons/NFC are never described as a mode the merchant picks per sale. It's `registrationMode`, a Capability, chosen once.
- "Bazaar" as the entity name — renamed to **Event** in the domain model (Bazaar is one Event type) even though it will likely stay "Bazaar" in Spanish UI copy for Ana specifically.
