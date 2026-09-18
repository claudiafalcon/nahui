# RFC 0015 — InventoryUnit removal (defective/returned stock)

**Status:** Accepted (2026-09-18, Product Owner — live production gap, urgent)

## The idea

A merchant needs a way to reduce a Product's sellable count for a reason other than a Sale — most concretely, discovering some just-registered units are defective and returning them to the supplier. Today `InventoryUnit`'s lifecycle is a closed set (`available → reserved → sold`, `domain-model.md`) with no way to leave sellable stock without going through a Sale. Confirmed via grep across `decision-log.md`/`ubiquitous-language.md`/`product/02-ux/*.md`: never designed, never discussed, not a rediscovery of an existing rule.

Trigger: Product Owner's own live example — "I registered 17 units by mistake save and everything, then I noticed 5 comes with defects so I need to return them. I need to modify the inventory to reflect 12, as now we don't have this mechanism available."

## What it changes

- **New terminal status on `InventoryUnit`**: `removed` (English internal name; Spanish merchant-facing copy is `ui-designer`'s call), parallel to `sold`. `available → removed`, conditional write (zero-rows-affected = already moved on — same "lost the race" shape as `commitAllocation()`), only `available` units eligible (never `reserved` — that's Selling's in-flight write, Inventory must never reach into it, same discipline D59's RFC 0010 exists to protect).
- **Lot/InventoryEntry's original received quantity is untouched** — 17 stays 17 in history; only the derived "available" count changes (12). Never a decrement on a stored counter — same "counts are derived from unit-level status" discipline as D25/D59.
- **Unit selection for untagged (buttons-mode) merchandise**: FIFO — same default already governing sale consumption (D5). No per-unit picker UI for v1.
- **NFCTag detachment**: a tagged unit marked `removed` releases its tag (tag becomes unattached, reusable) — the first non-sale NFCTag detachment case the model has ever needed. `NFCTag` stays a 1:1 attribute with no independent lifecycle; nothing about its own schema changes, only a new caller of the existing "unit no longer sellable" transition.
- **No reason-tracking in v1** (Product Owner-approved default, this entry — urgency: ship the mechanism itself first). One generic `removed` status only, no ledger entity, no reason code. `Supplier`/`InventoryEntry.cost` stay dormant/invisible, unchanged from today — not activated by this RFC. If reason-tracking is wanted later, `EventAllocation`/`AllocationMovement`'s append-only-ledger pattern is the established shape to reuse — deliberately not built now.
- **Dual-purpose tag resolution (D10)** and **NFC Readiness** both already key off `available`/`reserved`/`sold` by name — `removed` simply falls outside all three, same as `sold` already does for Readiness. No change to either mechanism's own logic needed, since neither currently has a branch for "removed."

## What it does not change

No new aggregate root. No new bounded-context dependency edge — this stays entirely inside Inventory's own ownership of `InventoryUnit` (`Inventory | ... InventoryUnit, NFCTag assignment | receive, register, prepare, assign, replenish`). Selling remains a read-only consumer of `InventoryUnit.status`, unchanged.

## Architect review

Consulted live (2026-09-18) against the full Foundation before this RFC was written. Confirmed: bounded-context ownership, the "only `available` eligible" constraint, and the "conditional per-unit write, never a decrement" constraint were Architect-decidable directly; the status-set widening itself needed this RFC because `InventoryUnit.status` is a ubiquitous-language-defined closed set with cross-context dependents (D10, NFC Readiness, `commitAllocation()`'s `available AND untagged` filter).

Promoted to `product/00-foundation/decision-log.md` D76.
