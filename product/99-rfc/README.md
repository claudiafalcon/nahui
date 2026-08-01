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
- `0003-session-selling-mode.md` — Proposed, awaiting final Product Owner approval. Splits `registrationMode` into Business-level capability (availability set) + Default Selling Mode (stored fallback), and a Session-level operating mode resolved via a three-state NFC-readiness check (Ready/Limited Ready/Not Ready) at Session start. Not yet promoted to `decision-log.md`.
