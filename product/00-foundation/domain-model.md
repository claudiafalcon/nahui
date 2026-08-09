# Domain Model v1

Status: baseline established after multi-round product-architecture review; represents the product's **current** operating model, not a permanently static one — it evolves through disciplined `decision-log.md` entries (plain entries for additive change, RFC for anything crossing an aggregate-boundary/bounded-context-edge/ubiquitous-language trigger), never by editing code around it or drifting silently. Changing an aggregate boundary or a bounded context is still an architectural decision requiring that same log discipline — "not frozen" means governed evolution, not unconstrained change.

Term definitions live in `ubiquitous-language.md`, not here — this file is about structure and rules, not vocabulary.

## Aggregate roots

An aggregate root owns consistency for a cluster of data; everything inside it is reached only through it.

- **Business** — tenant/config anchor. Not a transactional aggregate so much as the root everything else hangs `businessId` off of. Holds Business Capabilities (below). Carries `name` (required), `logo` (optional), `description` (optional) — the merchant's own bring-your-own identity, captured once at Onboarding; `name`/`logo` are consumed by the Digital Receipt (`home.md` §3.8f), `description` is stored only, not yet consumed by any downstream logic. Plain mutable current scalars, no version history. See `decision-log.md` D36. Also carries `loyaltyRewardThreshold` (integer, optional) — the number of completed Claims that make up one reward cycle for this Business, read against Customer's own `currentCycleProgress`/`completedCyclesCount` (below). Self-service-editable, immediate effect, no pending-value/effective-date pair — same class as `defaultSellingMode` (D27), not a commercial/billing capability. A later change is never retroactive to already-completed cycles; it only changes what an in-progress `currentCycleProgress` compares against going forward. See `decision-log.md` D37.
- **Venue** — independent identity, referenced by ID from Event. Never embedded in Event. Multiple Events may share one Venue (Ana returning to the same bazaar location repeatedly); Venue's `active` status is independent of any single Event's own lifecycle — deactivating a Venue doesn't retroactively affect Events that already reference it. Owned by the Selling context (its only consumer is Event). See `decision-log.md` D20.
- **Product** — independent identity, referenced by ID from InventoryUnit, NFCTag, SaleItem. Never embedded in a Lot. This is why a sold-out Product stays in the Catalog. Carries `defaultPrice` — the normal price Ana charges for this selling-group, set once at Product creation, a plain mutable current scalar (no version history). See `decision-log.md` D33.
- **Lot** — owns InventoryEntry and InventoryUnit as internal-only entities (no identity or lookup outside their parent Lot).
- **Event** — light root. Does NOT own Session as a strict aggregate (a Session must be able to exist with zero Event, for Quick Session). Sessions reference `eventId` optionally; "Event as a whole" summaries are read-side queries across Sessions sharing that ID, not a write-consistency boundary. **At most one Event per Business may be `scheduled` or `active` with an overlapping date range at a time** — a Business cannot have two Events in flight simultaneously (`decision-log.md` D17). This is a business-rule invariant validated at Event creation/scheduling time, not a change to Event's own lifecycle or its relationship to Session. Carries `bazaarCost` (optional, default `0` — captured contextual data, not yet a computed input to anything) and owns **Price Override** as an internal-only entity (no identity or lookup outside its parent Event, same class as InventoryEntry/InventoryUnit under Lot): one `(productId, overridePrice)` pair per Product whose price Ana has adjusted specifically for this Event. See `decision-log.md` D33.
- **Session** — root. Opens/closes independently of any Event.
- **Sale** — root, not nested inside Session. Owns SaleItem (internal-only, no existence outside its Sale). Kept as its own root specifically so Sale writes don't contend on a shared Session lock — the <3 second registration speed requirement (`company/backlog.md` #1) needs Sales to be cheap and independent to append. SaleItem carries `pricePaid`, resolved automatically at write time (see Key Mechanisms, "Price resolution") — never a merchant decision. See `decision-log.md` D33.

- **Customer** — root, owned by Loyalty-claim, **Business-scoped, not global** (carries `businessId`; the same physical person shopping at two Businesses produces two independent, unlinked Customer records). Schema: `id`, `businessId`, `email` (required, captured at first Claim), `ageRange`/`gender` (optional), `purchaseCount`, `lifetimeSpend`, `currentCycleProgress`, `completedCyclesCount` — the four counters stored, incrementally updated at the moment each Claim resolves (not derived live). `maskedEmail` is a read-time derivation of `email`, not a stored field. **Uniquely identified within a Business by `(businessId, email)`** — any Claim mechanism that collects/receives an email first looks up an existing Customer row for that pair; if found, the new Claim links to it and `ageRange`/`gender` are never re-asked ("first visit" means first visit to this Business's loyalty program, not a platform-wide first visit); if not found, a new Customer row is created. Entirely internal to Loyalty-claim, never surfaced to Ana. See `decision-log.md` D35, D37.

**Not aggregate roots:** InventoryEntry, SaleItem, NFCTag, Price Override. NFCTag is a 1:1 attribute of InventoryUnit — it has no lifecycle worth protecting on its own. Price Override is internal to Event, the same shape as InventoryEntry is internal to Lot.

## Entity relationships

```
Business
  └─ Catalog
       └─ Product (defaultPrice) ┐
                                 │ (referenced by ID)
Lot (a receiving event)         │
  └─ InventoryEntry             │   what the merchant types: Product + qty + cost
       └─ generates N →  InventoryUnit   one row per physical item
                            ├─ references Product
                            ├─ references parent Lot
                            └─ optional 1:1 NFCTag (registrationMode = nfc only)

Business
  └─ Venue (independent identity, businessId-scoped)
                                 │ (referenced by ID, required — not nullable)
Event (bazaarCost, optional) ────┘
  ├─ Price Override (internal-only; productId + overridePrice, 0..N per Event)
  └─ Session (one working day; eventId nullable)
       │    operatingMode: buttons | nfc — resolved once at open time
       │    from defaultSellingMode + NFC Readiness, immutable while
       │    active (decision-log.md D23)
       └─ Sale (a transaction)
            └─ SaleItem (pricePaid — resolved at write time: this Event's
                          Price Override for the sold Product if one
                          exists, else Product.defaultPrice. Never asked;
                          exactly one InventoryUnit consumed.)
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

`Session`'s `reviewed` terminal state is modeled but currently unused — no
trigger is defined, and none is designed yet. Reserved for a future
reporting/reconciliation workflow; not surfaced in any UX until a real
merchant need and a defined, Selling-owned trigger exist (`decision-log.md`
D18).

## Business capabilities

Attributes on the Business aggregate. Read once, resolved at the point where they matter, never re-asked:

| Capability | Values | Gates |
|---|---|---|
| `registrationMode` | subset of `{buttons, nfc}` — `buttons` always included; `nfc` **read-time derived**, never stored: `nfc ∈ registrationMode ⟺ subscriptionTier = paid` (D27) | Which selling modes are *available* to the Business. Whether Inventory prep includes a tag-assignment step at all is gated by `nfc ∈ registrationMode`, not by any single Session's resolved operating mode. Not its own storage slot on Business — computed fresh wherever read, from `subscriptionTier` alone. See `defaultSellingMode` below and "NFC Readiness" under Key Mechanisms for how a Session actually resolves *which* available mode it runs in. `decision-log.md` D23, D27. |
| `defaultSellingMode` | `buttons` \| `nfc` | The Business's stored fallback selling mode — read at Session start alongside NFC Readiness to resolve `Session.operatingMode`. Not itself the operative value for any given Session. Merchant-self-service-editable at any time, constrained to whichever modes `registrationMode` currently allows; takes effect immediately (no pending-value/effective-date pair — not a commercial/billing capability, D27). `decision-log.md` D23, D27. |
| `eventScheduling` | always on | Whether Eventos has content. Quick Session works regardless. |
| `subscriptionTier` | `free` \| `paid`, self-service, both directions (D25) | Whether Resultados shows raw counts only, or segmentation (`company/backlog.md` #2). |
| `loyaltyEnabled` | boolean, self-service, both directions (D25) | Whether a sold InventoryUnit's tag is claimable. |

**Self-service mutability (`decision-log.md` D25, narrowed by D27).** `subscriptionTier` and `loyaltyEnabled` are merchant-self-service-editable, in both directions, at any time — not fixed once set at Onboarding. Two invariants govern every such change: it never deletes historical data (each capability is a read-time gate only, never a condition on a write path — disabling `loyaltyEnabled` never touches an existing Claim, NFCTag, or unit/Lot traceability record), and it may take effect immediately or on a delay, per business rules not yet specified (tracked in `company/business-decisions.md`, pending a pricing/billing-cycle model that doesn't exist yet). To make a deferred change honestly displayable, each of these two capabilities carries an optional pending-value + effective-date pair alongside its current value — the fact that a change was requested and when it lands is domain data; the mechanism that actually applies it at the right time (a scheduled job, a billing-webhook handler) stays external to this model. `registrationMode`'s `nfc` entry is not independently editable — it moves only as a read-time consequence of `subscriptionTier` changing (D27), so it carries no pending-value pair of its own; a pending `nfc` change is simply a read of `subscriptionTier`'s. `defaultSellingMode` is also merchant-self-service-editable, differently shaped: immediate-only, no pending-value pair, constrained to whichever modes `registrationMode` currently allows (D27). Each of `subscriptionTier`/`loyaltyEnabled`'s pending-value + effective-date pairs also carries an `acknowledged` boolean (default `false`), reset to `false` whenever a new pending change is set: `true` once `settings.md` §2.4's one-time landing acknowledgment has been shown for that specific landed change, so a subsequent landed change gets its own independent acknowledgment (`decision-log.md` D29).

**`nfcAvailabilityNudgeShown` — a Business-level stored field, not a Business Capability.** Gates nothing about what the merchant can do; it only records whether `home.md` §3.6a's fourth Session-start variant (the one-time nudge toward `nfc` once tagged inventory clears NFC Readiness while `defaultSellingMode` still reads `buttons`) has already been shown to this Business. Boolean, default `false`; set `true` the first time that nudge renders, never reset (`decision-log.md` D29).

## Key mechanisms

**FIFO allocation (Buttons mode).** In `nfc` operating mode, the scanned tag identifies the exact InventoryUnit sold — no ambiguity. In `buttons` operating mode, the merchant just taps a Product name; nothing indicates which physical unit that maps to. Default: consume the oldest available InventoryUnit for that Product (FIFO by Lot receipt date), automatically, with no merchant decision. See `decision-log.md` D5. (Re-anchored from `Business.registrationMode` to `Session.operatingMode` per D23 — the same allocation rule, now keyed to whichever mode the Session actually resolved to, not a single Business-wide value.)

**Dual-purpose tag resolution.** The same physical tag is scanned twice in its life: once during a sale (Selling context, adds to Sale) and potentially once after, by the customer (future loyalty-claim context, links a Customer). The system disambiguates purely from `InventoryUnit.status` — `available`/`reserved` means "this is a sale-time scan," `sold` means "this is a claim." No explicit mode or intent has to be asked of anyone. See `decision-log.md` D10.

**NFC Readiness (Session-start resolution).** Before a Session opens, the system evaluates sellable tagged inventory — `available` `InventoryUnit`s with an assigned `NFCTag` — against a configurable readiness threshold, producing one of three states: **Ready** (coverage above threshold — if `nfc ∈ registrationMode` and matches `defaultSellingMode`, the Session opens silently in `nfc`, no UI moment), **Limited Ready** (some tagged inventory exists but below threshold — `buttons` is recommended via a single lightweight inline nudge at Session start; the merchant may override toward `nfc` if her capability set allows it), or **Not Ready** (precisely zero sellable tagged inventory units exist — `nfc` cannot be selected for that Session at all, an operational impossibility rather than a restriction, since there is nothing to scan; `buttons` remains available regardless, so selling itself is never blocked). The resolved value is stored on `Session.operatingMode`, immutable while `active`. The recommendation itself is computed fresh at every Session start and never persisted — it is surfaced to the merchant only when it disagrees with `defaultSellingMode`; a Ready Session that already matches the default opens with no UI moment at all. See `decision-log.md` D23.

**Multi-mechanism Claim resolution.** Claim is one business capability (`loyaltyEnabled`), resolvable through multiple, mode-appropriate mechanisms, all converging on the same terminal write (one or more Customer↔SaleItem links): an **NFC tag scan** (unit-level — the mechanism above, D4/D10, one physical tag per InventoryUnit), a **Sale-level Claim Token** (Selling-owned, generated at Sale finalization whenever `loyaltyEnabled = true`, regardless of `registrationMode` — displayed to the customer, e.g. as a QR, so she can start the Loyalty-claim flow on her own device), and future mechanisms following the same pattern. A single Sale-level Claim Token scan resolves into N independent Customer↔SaleItem links — one per SaleItem in that Sale — in one customer action, the same shape a multi-item NFC Sale already produces via N separate tag scans. `registrationMode` determines *which* mechanism a given Sale uses, never *whether* Customer Segmentation is available to that Business — visibility of Customer Segmentation and Loyalty Participation Record is gated by `subscriptionTier=paid` alone (corrected, `decision-log.md` D34); `loyaltyEnabled` is a separate, independent toggle gating only whether Loyalty-claim actively collects Claims at all, never report visibility. The Merchant Application never sees raw Customer or Claim data; it consumes only **Derived Customer Intelligence** — an anonymized, aggregate signal Loyalty-claim computes and exposes read-only to Intelligence — and, for a Business's own Customers, the narrower **Loyalty Participation Record** (D35). See `decision-log.md` D22, D34, D35.

**Price resolution (Sale-write time).** `SaleItem.pricePaid` is resolved automatically, at the moment a Sale/SaleItem is written: the sold Product's Event-scoped Price Override if one exists for that Event, else the Product's `defaultPrice`. Never a merchant decision, never asked mid-flow — the same automation pattern already established for FIFO allocation (D5). Capturing this at write time (rather than only reading `Product.defaultPrice`/Price Override live at display time) is what keeps already-closed Sales/Events from silently changing their computed totals whenever a price is edited later — the same "never silently alter historical data" invariant D25 already established for capability changes. See `decision-log.md` D33.

**"Día N" computation.** A working day under an Event is counted by distinct calendar date, not by raw Session count — closing a Session and reopening a new one later the *same* calendar date (e.g., a lunch-break resume) does not increment the day number; it's still the same "Día N." This matches Session's own naming intent ("one working day of selling," `ubiquitous-language.md`) and is computed automatically from the distinct calendar dates of Sessions sharing an `eventId` — never a raw count of Session rows. Wherever "Día N" is shown (`product/02-ux/home.md`, `events.md`, `reports.md`), it reuses this one computation. See `decision-log.md` D15.

## Bounded contexts

| Context | Owns | Language | Depends on |
|---|---|---|---|
| **Identity** | Business, Capabilities | *configure* | — |
| **Inventory** | Catalog, Product, Supplier, Lot, InventoryEntry, InventoryUnit, NFCTag assignment | *receive, register, prepare, assign, replenish* | Identity (read-only) |
| **Selling** | Event, Session, Sale, SaleItem, Venue | *start, continue, sell, close* | Inventory (read-only — sellable Products, tag→unit resolution, NFC Readiness's tagged-unit count), Identity (read-only) |
| **Intelligence** *(future, not built)* | Review/reporting over Sale + Session + Lot history | *analyze, segment, recommend* | Inventory, Selling (read-only), Loyalty-claim (read-only — two distinct grants: (1) Derived Customer Intelligence, anonymized/aggregate, no per-Claim drill-down, unchanged, D22; (2) Loyalty Participation Record, an explicit allowlisted per-Customer field projection — email/masked email, age range, gender, purchase count, lifetime spend, reward-cycle progress — scoped to Customers belonging to the reading Business, never phone/address/payment/other Customer fields, never another Business's Customer record, never raw Claim data; see D35) |
| **Loyalty-claim** *(future, not built; runs independently of the Merchant Application — see `information-architecture.md`)* | Customer, Claim | *identify, claim* | Inventory (reads `InventoryUnit.status` only; writes Customer↔SaleItem link), Selling (read-only — resolves Sale → SaleItem set for the Sale-QR mechanism; writes Customer↔SaleItem link there too; see D22) |

Dependency direction only ever points one way: Selling never writes to Inventory, and neither Loyalty-claim nor Intelligence ever writes back into a context that depends on them. Loyalty-claim reads Selling (read-only, to resolve a Sale's SaleItem set for the Sale-QR mechanism — D22); Intelligence reads both Selling/Inventory and Loyalty-claim (read-only, Derived Customer Intelligence only, never raw Customer/Claim identity). Selling itself never gains a dependency on Loyalty-claim or Intelligence — it stays completely ignorant that either exists, exactly as `architecture-principles.md` #6 requires. This is what lets backlog #2 (segmentation) and the loyalty module get built later without touching the selling-speed-critical path.

## Module boundaries

Maps 1:1 to the bounded contexts above: `identity/`, `inventory/`, `selling/`, `intelligence/` (future), `loyalty-claim/` (future, separate customer-facing surface — likely a separate deploy target entirely, not a screen inside the merchant app). See `information-architecture.md` for how this shows up (or explicitly doesn't) in navigation.

## Deliberate exceptions to "model only what's validated"

- **Supplier** and **purchase cost on InventoryEntry** exist in the schema now even though no workflow surfaces them yet. This is a bet against a future migration once margin/Open Finance features are prioritized. Keep them structurally present and completely invisible — no menu entry, no screen — until backlog actually calls for them.
