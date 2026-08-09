# 0005 — Merchant-initiated reward-cycle confirmation: a new narrow write edge, Intelligence → Loyalty-claim

Status: Proposed — pending Product Owner review and approval before promotion to `decision-log.md`.

## The idea

The Frequent Customers MVP spec requires a merchant-manual "reward-confirm"
action: reviewing her Loyalty Participation view (Resultados/"Tus clientes"),
Ana confirms she has given a customer the physical reward earned by completing
a reward cycle. This must reset `Customer.currentCycleProgress` to 0 and
increment `Customer.completedCyclesCount` by 1 — a real, persisted write to
Loyalty-claim's own owned aggregate, triggered from the Merchant Application.

Every existing Intelligence↔Loyalty-claim grant (Derived Customer Intelligence,
D22; Loyalty Participation Record, D35) is explicitly read-only. This proposal
adds a third, narrow, additive grant: a single write action, not a general
write capability.

## What it touches

- `domain-model.md`: Intelligence's "Depends on" cell in the bounded-context
  table gains a third grant into Loyalty-claim, stated separately from the
  two existing read-only grants, which are unchanged. Customer's aggregate
  entry (D35) gains one additional internal-only field,
  `lastRewardConfirmedAt` (timestamp), per the Contract below.
- `ubiquitous-language.md`: no new term required — this doesn't rename or
  redefine Customer, Claim, or Loyalty Participation Record; it adds one new
  described mechanism under "Future: Loyalty-claim context" or "Key mechanisms."
- Not touched: any aggregate boundary beyond the one additive field noted
  above (Customer's D35 schema is otherwise unchanged), Selling (untouched,
  no new dependency), the existing two read-only grants (unchanged in scope
  or wording).

## Named Business Decision, not resolved here

Whether Nahui ever builds an actual human/support-mediated dispute-resolution
process on top of `lastRewardConfirmedAt` (e.g., a customer complains, Ana or
a future support flow looks up the timestamp and manually re-credits her) is
a genuine risk-tolerance and resourcing call — is a merchant mis-tap costing
a customer her progress an acceptable MVP-stage risk, full stop — and belongs
to the Product Owner/Planner, not to `architect`. This RFC only ensures the
domain model doesn't structurally foreclose that later by leaving zero trace
of the event; it does not decide whether or when such a process gets built.

## Why

Argued in full by `architect` (dispatched 2026-08-08 to finalize the
remaining Frequent Customers Stage 2 Product specification once the Product
Owner elevated it to a first-class MVP capability):

**It cannot be automatic.** The spec explicitly calls it "manual
reward-confirm" — Ana might reach a threshold without immediately having the
reward on hand, so the reset (`currentCycleProgress → 0`,
`completedCyclesCount += 1`) must wait for her deliberate action, not fire the
instant the counter crosses the threshold.

**It cannot happen customer-side.** The spec's own framing — Ana reviewing a
customer list and confirming — implies the action originates from her review
of the Loyalty Participation view, not from a second interaction on the
customer's own device. Routing it there instead would also be a clunkier flow
(re-presenting a QR just to confirm a reward) with no support in the given
spec.

**It must land on Customer, Loyalty-claim's own aggregate.**
`completedCyclesCount`/`currentCycleProgress` are real, persisted fields the
merchant relies on across sessions (two of the seven fields in D35's Loyalty
Participation Record allowlist) — an ephemeral, non-persisted "Ana remembers
she gave the reward" doesn't satisfy the spec. Only Loyalty-claim may write to
Customer (D35: "Loyalty-claim mutating its own owned aggregate in response to
its own domain event" — the same self-mutation shape D29 already established,
here triggered by a merchant action relayed through Intelligence rather than
a Claim event).

**The existing Intelligence↔Loyalty-claim edge is explicitly read-only** (D35:
"an explicit allowlisted per-Customer field projection... exposed read-only").
It cannot carry this write as-is — a genuinely new, separate grant is
required, additive to the two existing read grants, not a widening of either.

**This does not touch Selling or reverse the dependency graph.** The action
surfaces from Resultados (Intelligence's own surface), never from the live
Sale flow — Selling gains no dependency, preserving D35's explicit Selling
exclusion ("Ana does not need to identify or look up customers during the
live Sale flow" — reviewing/confirming a reward in Resultados is a different
moment entirely, not Sale-time identification) and
`architecture-principles.md` #6's "Selling itself never gains a dependency on
Loyalty-claim or Intelligence" guarantee, unchanged. The new edge extends
Intelligence's already-existing dependency on Loyalty-claim (same direction,
same context pairing) — it does not add a back-edge in the sense #6 warns
against (Loyalty-claim would still never depend on or read from Intelligence).

**On whether this needed a `knowledge-mentor` consultation:** considered,
per `architect`'s own remit's trigger for a new bounded-context edge. Not
requested — the reasoning above is fully grounded in Nahui's own precedent
(`architecture-principles.md` #6's own "extend the graph, don't add a
back-edge" language already anticipates exactly this shape of extension;
D22's own precedent establishes that a new edge is an RFC-process question,
not a question needing external DDD grounding to be well-founded) — the same
self-check RFC 0004 applied and declined a consultation for, on the same
basis.

**Amended 2026-08-08 — a correction-path gap, raised by `ux-critic` during the corresponding UX review, resolved by `architect` before Product Owner approval.** `ux-critic` flagged that this action reuses the same 2-tap confirm template `settings.md` already uses for Ana's own Business Capability toggles — but every one of those precedent actions is self-service and bidirectional (D25); this write is atomic and, as originally drafted, left zero trace that the event ever occurred. `architect` checked this against the closest real precedent in this Foundation — Sale finalization (`home.md` §3.8, "Finalizar Venta"), this project's single most consequential atomic write, which ships with **no confirm screen at all** and an explicitly deferred, non-blocking undo (`home.md` §11: *"a reasonable safety net... not designed here"*). Against that precedent, an in-app reversal mechanism for this action is **not warranted** — it wouldn't undo the real-world fact that the physical reward has already been handed over, and no comparable write anywhere in this Foundation has ever needed one. But the precedent check surfaced a real, narrower gap: every other consequential write in this Foundation leaves *some* durable trace it happened (the Sale record itself; D25's pending-value/effective-date; D29's `acknowledged` fields) — this was the only one that didn't. Closed below by adding one internal-only timestamp field, not a reversal mechanism.

## Contract

- **Grant**: Intelligence → Loyalty-claim, write, single action: "confirm
  reward cycle" for one named Customer belonging to the reading Business.
- **Effect**: atomically `currentCycleProgress → 0`, `completedCyclesCount += 1`
  on that Customer record — the identical write shape Loyalty-claim already
  performs on itself when a Claim resolves (D35); only the trigger changes.
- **Explicitly excluded**: create/delete Customer; edit `email`, `ageRange`,
  `gender`, `purchaseCount`, `lifetimeSpend`; any access to Claim, Sale, or
  SaleItem records. No broader capability is granted than this one action —
  the same default-deny/explicitly-allow discipline D35 established for the
  read side.
- **Requires** the target Customer to already be identifiable from the same
  Loyalty Participation Record view Ana already reads — no new identification
  capability, only a new narrow mutation on an already-visible record.
- **Also writes** (internal-only, never merchant-facing, no new screen or
  menu entry — `architecture-principles.md` #4): `Customer.lastRewardConfirmedAt`,
  a timestamp set to the moment this action is committed. Recorded solely so
  a future support/dispute process has a minimal, honest trace that a
  confirm event occurred and when — it grants no new read/write capability
  to anyone, reverses nothing, and is not itself a correction mechanism.
  Same additive-field discipline as `decision-log.md` D29's
  `acknowledged`/`nfcAvailabilityNudgeShown` fields. Added 2026-08-08 per
  `architect`'s precedent check, above.
- **Explicitly still excluded**: any reversal, undo, or edit of a completed
  reward-cycle confirmation. Consistent with `home.md` §11's own precedent
  (Finalizar Venta, this Foundation's most consequential atomic write, ships
  with no undo mechanism by design) — not a gap unique to this action.
- **Selling is untouched.** The action surfaces only from the merchant-facing
  Loyalty Participation view (Resultados), never the live Sale flow.
- **Dependency-direction check**: extends Intelligence's already-existing
  edge into Loyalty-claim (same direction as the two existing read grants); no
  reversal, no back-edge, per `architecture-principles.md` #6.

## Sequencing

Does not block the customer-facing registration/QR-claim flow or the
merchant-facing Loyalty Participation view's read-only display (purchase
count, lifetime spend, "X de Y" progress) — both are fully specifiable
against the already-Accepted D35 schema with no dependency on this RFC.
Only the "confirm reward" write action itself waits on this RFC's approval
before being folded into an Approved spec.

## Open items

None named as blocking; the exact UI trigger point (a button on each customer
row in the Loyalty Participation view, most likely) is `ux-designer`'s task
once this is Accepted.
