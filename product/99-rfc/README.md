# RFCs

This folder is intentionally separate from `product/00-foundation/`.

`00-foundation` is the frozen source of truth — domain model, information architecture, principles, decision log. This folder is the opposite: a staging ground for ideas, experiments, and future proposals *before* they've earned a place there.

## Rules

- **Every significant new idea starts as an RFC.** If it would change or extend the domain model, capabilities, information architecture, or principles, write it down here first — don't edit `00-foundation` speculatively.
- **RFCs may challenge or extend the current foundation.** That's the point. An RFC can propose replacing a frozen decision, not just adding to it.
- **RFCs are not the source of truth.** Nothing here is binding. Code and design should never cite an RFC as justification — only `00-foundation` counts.
- **Only approved decisions are promoted into `00-foundation`.** When an RFC is accepted, update the relevant `00-foundation` doc(s) and add an entry to `00-foundation/decision-log.md` referencing the RFC. The promotion is the thing that makes it real, not the RFC itself.
- **Historical RFCs are never deleted.** Rejected, superseded, or outdated RFCs stay in place — they're design history, not clutter. Don't renumber or remove them either; if a later RFC replaces one, mark the old one `Superseded` and link forward to the new one.

## Workflow

1. Write the idea as a new RFC file.
2. Discuss and refine it in place.
3. Mark its outcome (see Status below).
4. If accepted: update `00-foundation`, add a `decision-log.md` entry that references this RFC, then mark the RFC `Accepted`.
5. If rejected or superseded: mark it accordingly and leave it in place.

## File naming

`NNNN-short-title.md`, numbered sequentially starting at `0001`, e.g. `0001-loyalty-tag-reuse.md`. Numbers are never reused or reassigned, even for rejected RFCs.

## Status labels

Each RFC should state its status near the top: `Proposed`, `Accepted`, `Rejected`, or `Superseded by NNNN`.

## Log

- `0001-venue-entity.md` — Accepted. Introduces Venue as a new aggregate root, owned by Selling, referenced by Event. Promoted to `product/00-foundation/decision-log.md` D20.
- `0002-loyalty-claim-complete-capability.md` — Accepted. Customer Segmentation as a core capability: Claim generalized to multiple resolution mechanisms (NFC, Sale QR, future), Intelligence consumes only derived/aggregate customer intelligence, never raw Customer/Claim identity. Promoted to `product/00-foundation/decision-log.md` D22.
- `0003-session-selling-mode.md` — Accepted. Splits `registrationMode` into Business-level capability (availability set) + Default Selling Mode (stored fallback), and a Session-level operating mode resolved via a three-state NFC-readiness check (Ready/Limited Ready/Not Ready) at Session start. Promoted to `product/00-foundation/decision-log.md` D23.
- `0007-user-and-business-membership.md` — Accepted. Introduces `User` (global, phone-identified aggregate root) and `BusinessMembership` (own aggregate root, `role: OWNER | SELLER`), plus the Owner-creation invariant (no Business without an atomically-created OWNER Membership). Promoted to `product/00-foundation/decision-log.md` D44.
- `0008-membership-invitation-and-concurrent-selling.md` — Accepted. Extends RFC 0007: `Invitation` as a new Identity-context aggregate root, the Invitation-acceptance invariant (no SELLER Membership without a consumed Invitation), and the Membership authorization gate (promoting/extending RFC 0007's own gateway reasoning to cover D55's `status=active` check). Confirms multi-Business membership needs no schema change and the OWNER/SELLER permission table is application-layer policy, not domain-model content. Promoted to `product/00-foundation/decision-log.md` D56.
- `0009-event-scoped-inventory-allocation.md` — Accepted. `EventAllocation` as a new Selling-context aggregate root, `AllocationMovement` as an internal-only ledger entity. Formalizes the physical-location-exclusivity invariant (two distinct mechanisms: NFC allocation-time exclusivity via `InventoryUnit`'s existing `available→reserved` write, and manual-mode sale-time exclusivity via a new compare-and-swap on `EventAllocation.quantityRemaining`) and the single-local-transaction reallocation mechanism. Promoted to `product/00-foundation/decision-log.md` D57.
- `0010-event-scoped-inventory-allocation-commitment-lifecycle-correction.md` — Accepted. Promoted to `product/00-foundation/decision-log.md` D59. Corrects RFC 0009 §3(b): a confirmed defect in the built prototype where manual-mode allocation's `quantityRemaining` counter never touched `InventoryUnit.status`, letting Quick Sale or another Event consume "reserved" stock. Replaces the counter with `commitAllocation()`/`releaseAllocation()`, real row-level FIFO reservation/release generalizing the NFC mechanism to manual mode; separates soft `quantityPlanned` intent from hard commitment; retires `quantityRemaining` as a stored field (now derived). Event close never auto-releases for either mode (Product Owner direction, 2026-09-09) — both modes require an explicit merchant reconciliation action, differing only in evidentiary shape (quantity-confirmed for manual, unit-identified for NFC); applied to `events.md` §3.16/§3.24, `ux-critic`/`reviewer` clean. Implemented in `product/02c-high-fidelity-prototype/`, code-level `ux-critic`/`reviewer` clean.
- `0011-event-assignment.md` — Accepted. Promoted to `product/00-foundation/decision-log.md` D60. `EventAssignment` as a new Selling-context aggregate root letting an OWNER pre-assign staff to Events; scheduling-conflict handling is warn-with-override. Knowingly reopens Q24/Q25 item 3's settled "no OWNER pre-assignment" decision at the Product Owner's own direction. Zero-assignment SELLER fallback resolved (Product Owner, 2026-09-09): Event access only from assignment, Quick Sale unaffected; applied to `home.md` §2/§3.3-§3.6b. OWNER-side assignment UI designed at `events.md` §3.26 (two `ux-critic` rounds, `reviewer` clean). Gates only on `BusinessMembership.status=active`, never `subscriptionTier` (Open Item 4, resolved).
