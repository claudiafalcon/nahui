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

- **Event** — a scheduled occasion to sell (Bazaar, Expo, Pop-up, Festival, Market, Office Sale, ...). May span multiple days. Lightweight — Sessions reference it by ID, it does not own them.
- **Session** — one working day of selling. May optionally belong to an Event (`eventId`), or stand alone ("Quick Session"). Opens and closes independently.
- **Sale** — one transaction within a Session. References `sessionId`.
- **SaleItem** — exactly one InventoryUnit sold within a Sale. Not quantity-bearing — selling 2 Hoodies produces 2 SaleItems, because each may trace back to a different Lot.

## Future: Loyalty-claim context (not built)

- **Customer** — a person identified through a post-sale tag scan. Does not exist as a concept anywhere in the merchant application.
- **Claim** — the act of linking a Customer to an already-sold SaleItem via its InventoryUnit's tag. Never creates a Sale.

## Terms we deliberately do not use

- "Selling mode" — Buttons/NFC are never described as a mode the merchant picks per sale. It's `registrationMode`, a Capability, chosen once.
- "Bazaar" as the entity name — renamed to **Event** in the domain model (Bazaar is one Event type) even though it will likely stay "Bazaar" in Spanish UI copy for Ana specifically.
