# Domain Model v1 — FROZEN

Status: frozen after multi-round product-architecture review. Changing an aggregate boundary or a bounded context here is an architectural decision — log it in `decision-log.md`, don't just edit code around it.

Term definitions live in `ubiquitous-language.md`, not here — this file is about structure and rules, not vocabulary.

## Aggregate roots

An aggregate root owns consistency for a cluster of data; everything inside it is reached only through it.

- **Business** — tenant/config anchor. Not a transactional aggregate so much as the root everything else hangs `businessId` off of. Holds Business Capabilities (below).
- **Product** — independent identity, referenced by ID from InventoryUnit, NFCTag, SaleItem. Never embedded in a Lot. This is why a sold-out Product stays in the Catalog.
- **Lot** — owns InventoryEntry and InventoryUnit as internal-only entities (no identity or lookup outside their parent Lot).
- **Event** — light root. Does NOT own Session as a strict aggregate (a Session must be able to exist with zero Event, for Quick Session). Sessions reference `eventId` optionally; "Event as a whole" summaries are read-side queries across Sessions sharing that ID, not a write-consistency boundary.
- **Session** — root. Opens/closes independently of any Event.
- **Sale** — root, not nested inside Session. Owns SaleItem (internal-only, no existence outside its Sale). Kept as its own root specifically so Sale writes don't contend on a shared Session lock — the <3 second registration speed requirement (`company/backlog.md` #1) needs Sales to be cheap and independent to append.

**Not aggregate roots:** InventoryEntry, SaleItem, NFCTag. NFCTag is a 1:1 attribute of InventoryUnit — it has no lifecycle worth protecting on its own.

## Entity relationships

```
Business
  └─ Catalog
       └─ Product ──────────────┐
                                 │ (referenced by ID)
Lot (a receiving event)         │
  └─ InventoryEntry             │   what the merchant types: Product + qty + cost
       └─ generates N →  InventoryUnit   one row per physical item
                            ├─ references Product
                            ├─ references parent Lot
                            └─ optional 1:1 NFCTag (registrationMode = nfc only)

Event (optional, lightweight)
  └─ Session (one working day; eventId nullable)
       └─ Sale (a transaction)
            └─ SaleItem (exactly one InventoryUnit consumed)
```

Key point: `Product → InventoryUnit → Lot` is the traceability chain. The merchant only ever sees Product-level aggregates ("Hoodie (4 available)" = count of InventoryUnits with status `available` for that Product, across all Lots). The platform always knows which specific Lot a sold unit came from.

## Lifecycles / state machines

```
InventoryUnit:  available → reserved (in an open Sale) → sold
Lot:            received → active (has available units) → depleted
Event:          scheduled → active → closed  (or cancelled)
Session:        not_started → active → closed → reviewed
Sale:           open → finalized
```

## Business capabilities

Attributes on the Business aggregate. Read once, resolved at the point where they matter, never re-asked:

| Capability | Values | Gates |
|---|---|---|
| `registrationMode` | `buttons` \| `nfc` | Resolved once at Session start. How a Sale identifies which InventoryUnit sold, and whether Inventory prep includes a tag-assignment step at all. |
| `eventScheduling` | always on | Whether Eventos has content. Quick Session works regardless. |
| `subscriptionTier` | `free` \| `paid` | Whether Resultados shows raw counts only, or segmentation (`company/backlog.md` #2). |
| `loyaltyEnabled` | off until built | Whether a sold InventoryUnit's tag is claimable. |

## Key mechanisms

**FIFO allocation (Buttons mode).** In `nfc` mode, the scanned tag identifies the exact InventoryUnit sold — no ambiguity. In `buttons` mode, the merchant just taps a Product name; nothing indicates which physical unit that maps to. Default: consume the oldest available InventoryUnit for that Product (FIFO by Lot receipt date), automatically, with no merchant decision. See `decision-log.md` D5.

**Dual-purpose tag resolution.** The same physical tag is scanned twice in its life: once during a sale (Selling context, adds to Sale) and potentially once after, by the customer (future loyalty-claim context, links a Customer). The system disambiguates purely from `InventoryUnit.status` — `available`/`reserved` means "this is a sale-time scan," `sold` means "this is a claim." No explicit mode or intent has to be asked of anyone. See `decision-log.md` D10.

## Bounded contexts

| Context | Owns | Language | Depends on |
|---|---|---|---|
| **Identity** | Business, Capabilities | *configure* | — |
| **Inventory** | Catalog, Product, Supplier, Lot, InventoryEntry, InventoryUnit, NFCTag assignment | *receive, register, prepare, assign, replenish* | Identity (read-only) |
| **Selling** | Event, Session, Sale, SaleItem | *start, continue, sell, close* | Inventory (read-only — sellable Products, tag→unit resolution), Identity (read-only) |
| **Intelligence** *(future, not built)* | Review/reporting over Sale + Session + Lot history | *analyze, segment, recommend* | Inventory, Selling (read-only) |
| **Loyalty-claim** *(future, not built, customer-facing, no merchant IA presence)* | Customer, Claim | *identify, claim* | Inventory (reads `InventoryUnit.status` only; writes Customer↔SaleItem link) |

Dependency direction only ever points one way: Selling never writes to Inventory; nothing depends on Selling; Intelligence and Loyalty-claim depend on the others but nothing depends on them. This is what lets backlog #2 (segmentation) and the loyalty module get built later without touching the selling-speed-critical path.

## Module boundaries

Maps 1:1 to the bounded contexts above: `identity/`, `inventory/`, `selling/`, `intelligence/` (future), `loyalty-claim/` (future, separate customer-facing surface — likely a separate deploy target entirely, not a screen inside the merchant app). See `information-architecture.md` for how this shows up (or explicitly doesn't) in navigation.

## Deliberate exceptions to "model only what's validated"

- **Supplier** and **purchase cost on InventoryEntry** exist in the schema now even though no workflow surfaces them yet. This is a bet against a future migration once margin/Open Finance features are prioritized. Keep them structurally present and completely invisible — no menu entry, no screen — until backlog actually calls for them.
