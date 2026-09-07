# 0009 — Event-scoped inventory allocation: `EventAllocation` and `AllocationMovement` in the Selling context

Status: Proposed

## The idea

Formalizes the settled architecture from `product/02-ux/product-decisions.md` Q24/Q25 (2026-09-06/07) — the second of two RFCs that design surfaced as required, sequenced together in practice with "Membership invitation and concurrent selling" but reviewable independently. That design already shipped as Approved UX (`product/02-ux/events.md` §3.21–§3.25, `home.md` §3.8a/§3.8d-i/§3.8d-ii) before either RFC was authored — this RFC is the domain-model formalization that UX design was deliberately not blocked on, per this Foundation's own precedent (RFC 0001, RFC 0007) of writing target schema/invariant design against work that's already been fully reasoned through.

Two things follow, developed in full below:

1. **`EventAllocation` — a new aggregate root, Selling context.** Represents how much of a Product's Business-wide stock is set aside for a specific Event — a manual quantity, specific NFC-tagged `InventoryUnit`s, or both at once. This is the domain object `events.md` §3.21's "Mercancía para este evento" screen reads and writes directly.
2. **`AllocationMovement` — an internal-only entity, owned by `EventAllocation`, not a second aggregate root.** An append-only ledger of every allocation-affecting write (`initial_allocation` | `replenish` | `reallocate_in` | `reallocate_out` | `return_to_general` | `adjustment`), the same shape `InventoryEntry`-under-`Lot` already establishes. One correction to the settled design is proposed below (§2) — a correlating field this RFC adds, without which the design's own claimed "reconciliation-by-query capability" doesn't actually resolve unambiguously.

Also formalized: the physical-location-exclusivity invariant and exactly how it's enforced at the schema/write level (§3); the reallocation transaction mechanism, already finalized by a `knowledge-mentor` consultation (§4); confirmation that `Session.eventId` resolution needs no new mechanism (§5); and confirmation of Selling-only bounded-context placement (§6).

## What it touches

- `domain-model.md`:
  - **Aggregate roots** — one new entry, `EventAllocation` (schema below), inserted after `Event`, before `Session`. Owned by Selling.
  - **Not aggregate roots** — `AllocationMovement` added to the existing "internal-only" list (`InventoryEntry`, `SaleItem`, `NFCTag`, `Price Override`, `Claim`), described as internal to `EventAllocation`, same class as `InventoryEntry`-under-`Lot`.
  - **`InventoryUnit`'s lifecycle comment** — the existing `available → reserved (in an open Sale) → sold` annotation needs a one-line broadening: `reserved` now has two legitimate causes (an open Sale, or an open `EventAllocation` holding the unit), not one. This is an additive documentation correction directly entailed by `EventAllocation` existing at all, not a new field, new status value, or new dependency edge on `InventoryUnit` itself — same class of small, RFC-adjacent Foundation touch D53 made to `Event`'s own lifecycle text.
  - **Entity relationships diagram** — gains the addition below.
  - **Bounded contexts table** — Selling's "Owns" cell gains `EventAllocation`, alongside the existing `Event, Session, Sale, SaleItem, Venue`. No "Depends on" cell changes for Selling or any other context — no new dependency edge (see "Why," §6).
  - **Key mechanisms** — two new subsections: "Physical-location-exclusivity invariant" and "Event-scoped reallocation transaction" (both below).
- `ubiquitous-language.md`, Selling context: new **EventAllocation** and **AllocationMovement** entries (below).
- **Not touched:** `architecture-principles.md` (no new numbered principle — existing #2, #6, #7, #8 are the lens applied, not extended, same restraint RFC 0007 showed with #1/#6/#7). `information-architecture.md` (no new nav tab — "Eventos" stays exactly the status/navigation surface it already is; `EventAllocation` is reached entirely through existing Event-detail entry points `events.md` §3.11/§3.14/§3.15 already define). `events.md`/`home.md` (already Approved, already amended for this exact design — this RFC formalizes the domain model those docs were already written against; it does not redesign them). `Session`, `Event`, `Business`, `Product`, `Lot` schemas — confirmed unchanged (see "Why," §6). The sibling "Membership invitation and concurrent selling" RFC's own scope — `Invitation`, `BusinessMembership.status`/`revokedAt` (already promoted, D55), `Sale.performedByMembershipId`, multi-Business membership, the OWNER/SELLER permission table — not duplicated here.

## Why

### 1. `EventAllocation` is a new aggregate root, Selling context — not an entity nested inside Event or Product

**Schema:**

```
EventAllocation (Selling context, aggregate root)
  - id
  - businessId          (required — same tenant-scoping discipline every
                          other aggregate root already carries)
  - eventId              (required, references Event)
  - productId            (required, references Product — Inventory-owned,
                          referenced by ID only, same pattern Price
                          Override already uses)
  - quantityAllocated    (integer, manual mode — the running total ever
                          allocated to this Event for this Product,
                          monotonic bookkeeping figure, not itself the
                          selling gate)
  - quantityRemaining    (integer, manual mode — the actual selling gate;
                          atomically decremented at Sale-write time,
                          floor 0; see "Why," §3)
  - allocatedUnitIds     (array of InventoryUnit id, NFC mode — the
                          specific tagged units earmarked to this Event)
  - status               (open | reconciled — closed set, plain mutable
                          current scalar, no version history, same shape
                          as Product.active)
  - createdAt
```

**Unique on `(eventId, productId)`** — at most one `open` `EventAllocation` per Event/Product pair; a second allocation write for the same pair updates the existing row rather than creating a sibling.

**Why a root, not an internal-only entity — the same test RFC 0001 (Venue) and RFC 0007 (`BusinessMembership`) already applied.** `architecture-principles.md` #4's internal-only pattern fits when a concept "has no identity or lookup outside its parent." `EventAllocation` fails this test on two independent, real query axes, both already load-bearing in the Approved UX, not hypothetical:

- **"What's allocated to this Event, across all Products"** — `events.md` §3.21's own list ("one row per Catalog Product she's ever registered," each row showing that Product's current allocation for the Event in view) requires resolving every `EventAllocation` for one `eventId`, independent of any single Product.
- **"What's allocated to this Product, across all Events"** — §3.21's own "Disponible en general" figure is defined as "Business-wide total minus whatever's allocated to every *other* open `EventAllocation`" for that Product — this requires resolving every open `EventAllocation` for one `productId`, across every Event, at the moment any single Event's allocation screen renders. This is the identical structural need D20 used to promote `Venue` (grouping "Rendimiento por bazar" by `venueId`, independent of any single Event) and D44 used for `BusinessMembership` (resolving a User's accessible Businesses, independent of any single Business).

**This is also the exact correction the settled design already made once, and this RFC is formalizing that correction, not re-deriving it from a naive starting point.** The superseded Q25 finding (kept in `product-decisions.md`'s own non-deletion record) originally modeled allocation as an internal-only entity owned by `Event` — the same shape as Price Override. That shape was evaluated once the *full* lifecycle (replenish, reallocate between simultaneously-active Events, reconciliation) was designed, and rejected for exactly the reason above: "Disponible en general" can't be computed by iterating one Event's own owned entities — it needs an index on `productId` that reaches across every Event. `EventAllocation`'s own independent identity is what makes that query well-defined instead of requiring a full table scan across every Event's internal list.

**Why not nested inside `Product` instead, as the other natural single-parent candidate.** Nesting under `Product` would symmetrically fail the mirror-image query — "what's allocated to this Event, across all Products" would then require scanning every Product's internal entities. `EventAllocation` is genuinely a join between two independent aggregates (`Event` and `Product`), each of which has a real, UX-load-bearing reason to query it as if it were the parent — the structural signature of a root, not of an entity naturally homed under either side.

### 2. `AllocationMovement` — internal-only entity owned by `EventAllocation`, not a second aggregate root; one correction proposed

**Reasoned independently, not assumed from `product-decisions.md`'s own phrasing** ("an append-only ledger entity owned by `EventAllocation`, the same pattern `InventoryEntry`-under-`Lot` already establishes") — that phrasing already states the conclusion this section verifies.

**Applying `architecture-principles.md` #4's own test directly:** does resolving anything real require looking up an `AllocationMovement` independent of its parent `EventAllocation`, the same way `BusinessMembership` needed resolution independent of any single `Business`? No genuine domain capability does. `events.md` §3.21's own bullet states this explicitly and is decisive: *"she only ever sees a number change... never picks or is told which underlying movement type wrote"* — no screen, menu entry, or merchant-facing concept surfaces `AllocationMovement` directly, the same disqualifying signal `architecture-principles.md` #4 names outright ("if a concept needs its own screen or menu entry to explain, it's not internal-only anymore" — the negative of that test holds here). It also has no independent lifecycle worth protecting: each row is written once, never mutated, never revisited on its own — the same shape as `InventoryEntry`, which the Foundation already treats as internal-only for the identical reason.

**The one place this looks like it might fail the test — reconciliation-by-query — is not actually a domain-capability query, and doesn't change the classification.** `product-decisions.md`'s `knowledge-mentor` consultation names `AllocationMovement` as "the explicit, queryable reconciliation vehicle" for detecting a `reallocate_out` with no matching `reallocate_in` on the destination side, in the event the sequenced-writes fallback (§4, below) is ever the active mechanism. This is an operational/audit query for detecting a stuck in-flight transfer, not a merchant-facing or cross-context domain capability — the same distinction that already lets `InventoryEntry` be queried across every `Lot` for admin/reporting purposes without that requiring `Lot` to stop being `InventoryEntry`'s write-consistency boundary. A concept's internal-only status is about write-consistency scope and UI-surfacing, not about whether any SQL query may ever cross parent boundaries for operational purposes.

**The correction this RFC proposes, not present in the settled design as written.** As specified in `product-decisions.md`, `AllocationMovement` carries no field correlating a `reallocate_out` row to its paired `reallocate_in` row on the destination `EventAllocation`. Without one, "a `reallocate_out` with no matching `reallocate_in`" is not a well-defined query — if the same Product is reallocated between the same two Events more than once (a real, unremarkable case: replenish, reallocate, replenish again, reallocate again), there is no way to match a specific orphaned `reallocate_out` to the specific `reallocate_in` it should have paired with, only a same-type/same-quantity heuristic match that can misfire. This RFC adds:

```
AllocationMovement (Selling context, internal-only entity, owned by EventAllocation)
  - id
  - eventAllocationId          (required, parent FK)
  - type                       (initial_allocation | replenish |
                                 reallocate_in | reallocate_out |
                                 return_to_general | adjustment —
                                 closed set)
  - quantityDelta               (signed integer, manual-mode movements only;
                                 null for unit-based movements)
  - unitIds                     (array of InventoryUnit id, NFC-mode
                                 movements only; null for quantity-based
                                 movements)
  - counterpartEventAllocationId (nullable — set only on reallocate_in/
                                  reallocate_out pairs, referencing the
                                  EventAllocation on the other side of the
                                  same reallocation write; this is the
                                  correlating key the reconciliation-by-
                                  query capability actually depends on)
  - createdAt
```

Written unconditionally, one row per discrete write action — one per scan (§3.22's live, immediate per-unit write), one per "Guardar cambios" commit per Product row (§3.23), one per side of a reallocation (§3.24), one per reconciliation action (§3.25) — never batched across distinct actions, matching the granularity `events.md` already establishes for each of those writes.

### 3. The physical-location-exclusivity invariant — two distinct mechanisms, not one, both grounded in what the Approved UX actually depends on

The settled design names one sentence — *"a unit ID may appear in at most one open `EventAllocation.allocatedUnitIds` at a time, enforced via `InventoryUnit`'s existing available→reserved conditional write"* — that is actually doing two different jobs, worth separating explicitly because `home.md`'s "lost the race" reasoning depends on getting this right at the domain-model level, not just accepting the sentence at face value.

**(a) Allocation-time exclusivity (NFC mode only) — reuses `InventoryUnit`'s existing `available→reserved` conditional write, unmodified.** When Ana scans a tag to allocate a unit to an Event (`events.md` §3.22), the write is `UPDATE InventoryUnit SET status='reserved' WHERE id=? AND status='available'`. Zero rows affected means the unit is already `sold`, already mid-Sale, or already allocated to a different Event — surfaced as §3.22's "Esta prenda ya está en otro evento. Usa otra." No new field, no new status value, and critically, **no `eventId` or any Event-referencing column is ever added to `InventoryUnit`** — Inventory's own schema stays completely unaware of *why* a unit is `reserved`. The only place that reason is recorded is `EventAllocation.allocatedUnitIds`, entirely inside Selling's own bookkeeping. This is exactly what makes `product-decisions.md`'s "Inventory never learns Events/allocation exist" claim actually true at the schema level, not merely asserted: Inventory's contribution is one existing conditional write on one existing field, triggered by a new caller (allocation, not just Sale) — the same class of Selling-initiated `InventoryUnit` write the FIFO mechanism (D5) and ordinary Sale finalization already perform, not a new dependency edge.

**Why this doesn't break selling of an already-allocated unit — verified, not assumed.** `Dual-purpose tag resolution` (domain-model.md's existing Key Mechanism, D10) already disambiguates a tag scan purely from `InventoryUnit.status`, and already groups `available`/`reserved` together as "this is a sale-time scan" (only `sold` means "this is a claim"). An allocated-and-`reserved` unit therefore still resolves correctly as a sale-time scan when later scanned to sell it in `nfc` operating mode — no new disambiguation logic needed. In `buttons` operating mode, FIFO consumption (D5) filters strictly on `status='available'`, so a `reserved` (allocated) unit is correctly excluded from FIFO's Business-wide pool for that Product — consistent with "a Product can have both simultaneously (some units tagged, some not)": the tagged/allocated units are earmarked for scan-based consumption specifically, the untagged units remain FIFO-eligible. **Confirmed directly against the Approved UX, not inferred**: §3.25's own reconciliation annotation states "'Regresar a inventario general' flips the already-known remaining `allocatedUnitIds` back to `available` directly" — this only makes sense, and only reads as the plain factual statement it is, if allocated-but-unsold units are indeed sitting in `reserved` (not `available`) the whole time they're allocated, exactly as this mechanism describes.

**(b) Sale-time consumption exclusivity (the actual mechanism `home.md`'s "lost the race" pattern depends on) — a separate, Selling-only compare-and-swap on `EventAllocation.quantityRemaining`, unrelated to (a).** `home.md` §3.8a's own text is explicit that "the genuine last-unit race is a manual/buttons-mode phenomenon, fungible units drawn from one shared counter" — this is `EventAllocation.quantityRemaining`, decremented via `UPDATE EventAllocation SET quantityRemaining = quantityRemaining - 1 WHERE id=? AND quantityRemaining > 0`. Zero rows affected is the literal "genuine compare-and-swap on the server" §3.8a's copy-justification cites for withholding Reintentar — the write has already, verifiably failed, so retry cannot succeed. This gate is layered *on top of*, and independent from, the ordinary Business-wide FIFO consumption of `available` `InventoryUnit`s (mechanism (a) territory, unmodified) — it answers "has this Event's earmarked count for this Product been exhausted," a question FIFO alone can't answer since FIFO has no concept of Event scoping at all. For NFC mode, §3.8a itself confirms the same-tag double-scan race is "structurally rare" and resolves through the identical InventoryUnit-status mechanism already described in (a)/dual-purpose resolution — not a third mechanism.

### 4. The reallocation transaction mechanism — settled, restated with its actual `architecture-principles.md` grounding

A single local DB transaction spans both `EventAllocation` rows (source decrement + destination increment + both `AllocationMovement` rows, one commit) — the primary mechanism, per the `knowledge-mentor` consultation already run against this exact question. Not re-litigated here; grounded against the principles that actually justify it:

- **Principle #2** ("aggregate boundaries follow write-throughput needs, not just conceptual nesting") is the boundary-sizing heuristic the consultation correctly identified as a Vernon-style guideline, not an absolute one-aggregate-per-transaction prohibition — the same nuance that lets two `EventAllocation` instances share one transaction when they share one database, at Nahui's actual pilot scale (3 merchants).
- **Principle #6** (one-way dependency direction) is satisfied because both aggregate instances being touched belong to the same context (Selling) — this is an intra-context transaction, not a new cross-context edge.
- **Principle #7** (idempotent/keyed retriable writes) governs the write itself — `events.md` §3.23 already states this explicitly ("this write carries a stable idempotency key... since 'Reintentar' is a client-initiated retry on a write with real merchant-facing consequence").
- **Principle #8** (AI-engineering learning-value tiebreaker, applied correctly *last*) is why full Saga/event-sourcing/CQRS adoption was correctly rejected rather than chosen for its standalone learning value — it fails the principle's own comparable-cost gate at this scale, exactly the ordering principle #8 requires (a genuine need first, comparable alternatives second, learning value only as the tiebreaker).

The sequenced-writes-plus-compensation design is retained as a documented fallback only, for if `EventAllocation` ever stops sharing one transactional store (a future service split — not needed now, named in "Open items"). `AllocationMovement` (§2, above) is written unconditionally regardless of which mechanism is active, which is exactly why its correlating field (§2's correction) matters specifically for the fallback path, not the primary one.

### 5. `Session.eventId` → `EventAllocation` resolution — confirmed, no new mechanism

`Session.eventId` already resolves which Event's data applies at Sale-write time, for Price Override (domain-model.md's existing "Price resolution" Key Mechanism: "this Event's Price Override for the sold Product if one exists, else the Product's `defaultPrice`"). `EventAllocation` resolution at Sale-write time reuses the identical linkage, unmodified — `Session.eventId` resolves which `EventAllocation(eventId, productId)` row (if any) gates a manual-mode consumption via `quantityRemaining`'s compare-and-swap (§3, above). `product-decisions.md`'s own Q24/Q25 resolution item 3 already confirms this directly: "reusing the exact linkage Price Override resolution already established... not a new mechanism." Nothing in this RFC adds a field to `Session` or changes its immutability rule (`Session.eventId` stays resolved once, at Session-open, per the same "resolved once, upstream" discipline already governing `Session.operatingMode`, D23).

### 6. Bounded-context placement — Selling, no new context, no new dependency edge

`domain-model.md`'s bounded-contexts table already places `Event`, `Session`, `Sale`, `SaleItem`, `Venue` under Selling; `information-architecture.md`'s "Eventos" nav label maps to exactly this content ("scheduled/active/past Events, drills into their Sessions") — it is a navigation surface over Selling-owned entities, not a bounded context of its own; `domain-model.md`'s own table has no "Eventos" row. `EventAllocation` (and its internal `AllocationMovement`) fits the identical place `Event`/Price Override already live, for the identical reason Price Override does: it's Event-scoped bookkeeping consumed at Sale-write time, entirely within Selling's own write path.

**No new dependency edge.** `EventAllocation` references `Product` (Inventory-owned) by ID only, the same pattern Price Override already uses — this doesn't create a new edge, since Selling already depends on Inventory read-only for "sellable Products." `EventAllocation.allocatedUnitIds` references `InventoryUnit` by ID, the same pattern `SaleItem` already uses ("exactly one InventoryUnit consumed"). The one write this RFC confirms Selling performs into Inventory-owned state — `InventoryUnit.status` transitions — is not new; Selling already legitimately performs this write today (FIFO consumption, Sale finalization), and §3(a) above confirms this RFC doesn't add a new field or new status value to `InventoryUnit`, only a new *caller* of an existing conditional write. `architecture-principles.md` #6 ("dependency direction is one-way and enforced by context... new features should extend this graph, not add a back-edge") is satisfied exactly as it already was before this RFC.

### 7. Out of scope — the sibling RFC's territory

`Invitation`, `BusinessMembership.status`/`revokedAt` (already promoted, D55), `Sale.performedByMembershipId`, multi-Business membership, and the OWNER/SELLER permission table belong to "Membership invitation and concurrent selling," drafted alongside this one. This RFC assumes that design exists (OWNER-only gating on every allocation screen, per `events.md` §3.21/§3.24/§3.25's own repeated annotation) but doesn't formalize it.

### 8. Ubiquitous-language additions (for `ubiquitous-language.md`'s Selling context section, once promoted)

> **EventAllocation** — how much of a Product's Business-wide stock is set aside for a specific Event (Selling context), own aggregate root. Carries a manual quantity (`quantityAllocated`/`quantityRemaining`) and/or specific NFC-tagged `InventoryUnit`s (`allocatedUnitIds`) — the two compose on the same Product row, never a forced choice. Unique on `(eventId, productId)`. Not nested inside Event or Product — needed independently of either to resolve "what's allocated to this Event across every Product" and "what's allocated to this Product across every Event" (the second is what "Disponible en general" computes). `status: open | reconciled` — stays `open` through an Event's entire `closed` transition (deliberately decoupled, same precedent as Session's dormant `reviewed` state, D18); only an explicit merchant reconciliation action (`return_to_general` or `reallocate_out`, resolving to `quantityRemaining=0` and no remaining `allocatedUnitIds`) sets it `reconciled`. See `decision-log.md` (this RFC's promotion entry).

> **AllocationMovement** — an append-only ledger entity internal to `EventAllocation` (no identity or lookup outside its parent, same class as `InventoryEntry`-under-`Lot`), never surfaced to Ana. One row per discrete allocation-affecting write (`initial_allocation` | `replenish` | `reallocate_in` | `reallocate_out` | `return_to_general` | `adjustment`). Carries `counterpartEventAllocationId` on `reallocate_in`/`reallocate_out` pairs — the correlating key that makes "an orphaned reallocation" a well-defined query, not a heuristic match (see "Why," §2). See `decision-log.md` (this RFC's promotion entry).

## Key mechanisms (for `domain-model.md`'s Key Mechanisms, once promoted)

> **Physical-location-exclusivity invariant.** A unit of stock can only ever be committed to one open Event at a time — the concurrency-safety guarantee `EventAllocation` exists to provide. Two independent mechanisms enforce it, both entirely within Selling's own writes: (a) allocation-time (NFC only) reuses `InventoryUnit`'s existing `available→reserved` conditional write, unmodified — a zero-rows-affected result means the unit is already sold, mid-Sale, or allocated elsewhere. Inventory's schema gains no new field, status value, or Event reference; the *reason* a unit is `reserved` is recorded only in Selling's `EventAllocation.allocatedUnitIds`. (b) Sale-time consumption (manual mode) is a separate compare-and-swap on `EventAllocation.quantityRemaining` (`WHERE quantityRemaining > 0`), layered on top of the ordinary Business-wide FIFO consumption of `available` `InventoryUnit`s, unmodified — this is the literal server-side compare-and-swap `home.md` §3.8a's "lost the race" copy depends on for correctly withholding Reintentar (`architecture-principles.md` #7's one deliberate exception). Reconciliation reverses (a) directly (`reserved→available`) via `return_to_general`/`reallocate_out`. See `decision-log.md` (this RFC's promotion entry).

> **Event-scoped reallocation transaction.** Moving allocated stock between two simultaneously-open Events (`reallocate(toEventId)`) is a single local DB transaction spanning both `EventAllocation` rows (source decrement, destination increment, both `AllocationMovement` rows) — one commit, invisible to Ana as anything but one tap ("Mover mercancía," `events.md` §3.24). Legitimate under `architecture-principles.md` #2's boundary-sizing (not absolute one-aggregate-per-transaction) reading, since both instances share one context and one database at Nahui's current scale; retained as a documented fallback (sequenced writes plus compensation, correlated via `AllocationMovement.counterpartEventAllocationId`) only for a future service split, not needed now. See `decision-log.md` (this RFC's promotion entry).

## Entity relationships diagram addition

```
Event (bazaarCost, optional) ────┘
  ├─ Price Override (internal-only; productId + overridePrice, 0..N per Event)
  ├─ EventAllocation (root; businessId, eventId, productId,
  │    quantityAllocated/quantityRemaining, allocatedUnitIds, status)
  │    unique on (eventId, productId), referenced independently by
  │    productId across Events (for "Disponible en general") and by
  │    eventId across Products (for the per-Event allocation list)
  │      └─ AllocationMovement (internal-only; type, quantityDelta or
  │           unitIds, counterpartEventAllocationId on reallocate pairs)
  └─ Session (one working day; eventId nullable)
       ...
```

## Sequencing

Target schema/invariant design, the same posture RFC 0001/0004/0007 already took — the UX this formalizes (`events.md` §3.21–§3.25, `home.md` §3.8a/§3.8d-i/§3.8d-ii) is already Approved and did not wait on this RFC's authorship. `product-decisions.md` Q24/Q25 already names the real-time concurrency mechanism (the compare-and-swap writes in §3, above) as a Stage 7 (Backend Integration) requirement, not buildable/testable in the current no-backend prototype — `product/02c-high-fidelity-prototype/` can and should illustrate the *experience* of losing a race (a mocked "otro vendedor ya la vendió" state) without the real compare-and-swap existing underneath yet. Once Accepted, `architect`'s next step per the Migration Workflow (D43) is an Architecture Gap Analysis against `events.md`'s already-Approved §3.21–§3.25, checking implementation-readiness for the schema above, not redesigning the approved UX. Sequenced alongside, not blocked by, the sibling "Membership invitation and concurrent selling" RFC — both are needed for the full Q24/Q25 capability, but this RFC's content (`EventAllocation`/`AllocationMovement`) doesn't depend on that RFC's content (`Invitation`/permission table) landing first.

## Open items, named for the Product Owner / Architect, not resolved here

1. **`InventoryUnit`'s lifecycle-comment broadening** (the `(in an open Sale)` parenthetical needs to become `(in an open Sale, or held by an open EventAllocation)` or equivalent) is a small, additive documentation correction this RFC's promotion should carry — flagged explicitly so it isn't silently dropped the way D53/D54/D55 each caught a similar gap late.
2. **`AllocationMovement.counterpartEventAllocationId`** (§2's correction) is this RFC's own addition, not present in `product-decisions.md`'s settled design as written — needs explicit Product Owner/Architect sign-off before being treated as settled, rather than assumed accepted by virtue of appearing in this document.
3. **NFC Readiness's business-wide "sellable tagged inventory" count** (`domain-model.md`'s existing Key Mechanism, D23) is defined over `available`-status tagged `InventoryUnit`s. Once allocation legitimately holds tagged units in `reserved` state pre-sale, an Event with a large NFC allocation could understate NFC Readiness's own count during that Event, even though those units are actively being sold via scan. Not resolved by this RFC — NFC Readiness's definition predates `EventAllocation`'s existence and may need its own small follow-up.
4. **Partial split at reconciliation** (moving *some* of a Product's unsold remainder to another Event while returning the rest to general inventory) is explicitly deferred per `events.md` §3.24/§11 — named, not designed, here or there.
5. **A future service split separating `EventAllocation` instances across different databases** — the only condition under which the sequenced-writes-plus-compensation fallback (§4) would become the active mechanism instead of the documented fallback. Not needed at Nahui's current scale; named for future revisit only.
