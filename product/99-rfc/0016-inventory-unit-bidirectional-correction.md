# RFC 0016 — Bidirectional InventoryUnit correction with an append-only ledger

**Status:** Accepted (2026-09-18, Product Owner-directed, live production redesign)
**Supersedes:** RFC 0015 (`0015-inventory-unit-removal.md`) — the decrease mechanism it
shipped (`available → removed`, FIFO, conditional write, tag release) is retained
unmodified; this RFC supersedes only its "no reason-tracking, no ledger entity" v1 scope.

## The idea

RFC 0015 shipped a decrease-only correction ("Cantidad actual") the same day it was
proposed. Live testing by the Product Owner surfaced requirements beyond that scope:
correction must be bidirectional (her own example: "Nahui says 21, physically 23 →
+2"), must be modeled as an append-only ledger movement rather than a status flip alone
("preserve history and append... according to our existing append-only inventory ledger
model" — invoking the EventAllocation/AllocationMovement pattern, D57/D59, by name), a
positive correction must stay distinguishable in the ledger from a real Lot receipt even
though both increase `available` count, and correction must never violate an existing
reservation or produce an impossible state. Explicit non-goal: this never edits a
historical "total received" number — only the derived `available` count is ever
corrected, and no existing Sale/Allocation/Claim/reconciliation is touched.

## What it changes

- **New internal-only entity, owned by `Product`** (not a new aggregate root — fails
  the internal-only-entity test the same direction Price Override/InventoryEntry do,
  not the direction EventAllocation did): `InventoryCorrection` — `id`, `businessId`,
  `productId`, `type` (`increase` | `decrease`, closed set), `quantityDelta` (signed
  integer, audit convenience), `unitIds` (array of InventoryUnit id, unconditional on
  every row — no bare-quantity write ever happens, closing the exact counter-drift class
  D59 corrected), `sourceLotId` (nullable, set only on `increase`), `createdAt`.
- **New field on `Lot`**: `source` (`supplier_delivery` default | `correction`, closed
  set, same treatment as `BusinessMembership.role`/`Event.type`). A positive correction
  creates a real `Lot` with `source='correction'` and one `InventoryEntry` (Product +
  delta quantity), generating N new `InventoryUnit` rows through the existing,
  unmodified `InventoryEntry → generates N → InventoryUnit` mechanism — no second
  unit-creation code path. `cost`/`Supplier` stay exactly as dormant as RFC 0015 left
  them.
- **Decrease mechanism (RFC 0015) unchanged** — `available → removed`, FIFO, never
  `reserved`, conditional write, tag release — now additionally appends one
  `InventoryCorrection(type='decrease')` row in the same transaction.
- **Increase mechanism (new)**: creates the correction-`Lot`/`InventoryEntry`, generates
  N `available` `InventoryUnit` rows, appends one `InventoryCorrection(type='increase')`
  row referencing both the new units and the correction-`Lot`, in one transaction.

## Reservation/commitment behavior

- Decrease: unchanged from RFC 0015 — `available` only, never `reserved`. Structurally
  can't violate a commitment.
- Increase: unconstrained by construction — never touches an existing row, only mints
  new `available` ones. No impossible state is reachable.

## What it does not change

No new aggregate root. No new bounded-context dependency edge — stays entirely inside
Inventory's ownership of `Lot`/`InventoryEntry`/`InventoryUnit`, now plus
`InventoryCorrection`. Selling stays a pure read-only consumer of `InventoryUnit.status`
and sees correction-sourced units identically to any other `available` unit. No
historical Sale, SaleItem, EventAllocation, AllocationMovement, or Claim is ever
touched or rewritten.

## Architect review

Consulted live (2026-09-18) against the full Foundation. `InventoryCorrection`'s
internal-only-vs-root shape, `Lot.source` over a dedicated correction-Lot type, and the
reservation-constraint asymmetry were Architect-decidable directly by extending the
already-Foundation-validated AllocationMovement pattern (D57/D59); the RFC is required
because this reopens `InventoryUnit.status`'s lifecycle again and explicitly reverses
RFC 0015's named "no ledger entity" v1 scope.

Promoted to `product/00-foundation/decision-log.md` D78.
