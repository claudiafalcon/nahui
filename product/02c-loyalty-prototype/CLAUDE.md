# Loyalty Prototype — product/02c-loyalty-prototype

Real, running React/TypeScript code for the customer-facing Claim-registration
surface — a separate deploy target from the Nahui Merchant Application
(`product/02c-high-fidelity-prototype/`), per `decision-log.md` D38 and
`product/02-ux-loyalty/customer-loyalty-registration.md` §0's own scope
boundary. A customer reaches this by scanning the Claim Token QR on her
digital receipt, on her own phone, whenever she chooses — Ana's own
involvement ends the moment she lets the customer scan it.

## Where this fits

- Upstream: `product/02-ux-loyalty/customer-loyalty-registration.md`
  (Approved), plus the Architecture Gap Analysis that preceded this folder's
  first build (see `docs/gap-analysis.md`).
- Sibling, not child: `product/02c-high-fidelity-prototype/` is a different
  surface, same pipeline stage (High-Fidelity React prototype) — mirrors
  exactly how `product/02-ux-loyalty/` sits alongside `product/02-ux/`
  rather than inside it (D38).
- Downstream: `product/99-rfc`'s Cross-app Loyalty data bridge (D.5,
  `product/02c-high-fidelity-prototype/BACKLOG.md` item 10) — real,
  backend-integrated resolution between this app and the Merchant
  Application. Not yet designed, not this folder's concern today.

## Rules — read before writing any code here

- **Never import from `product/02c-high-fidelity-prototype/src/`.** No
  shared types, no shared components, no shared domain-layer code, no
  linked workspace package. Separate deploy targets share nothing at
  runtime in the real system; a build-time import would create a coupling
  that doesn't exist in production.
- **No backend, no cross-app data bridge, at this stage.** This prototype
  resolves a Claim Token against its own fully self-contained, seeded mock
  data — never a live read of the Merchant prototype's actual `localStorage`
  or runtime state (confirmed architecturally sound and the only option
  available at this stage — see `docs/gap-analysis.md`). A handful of seed
  tokens should cover the spec's real branches: malformed/expired, already
  fully claimed, valid for a brand-new email, valid for an already-known
  email at that Business.
- **No shared nav, no app shell, no Nahui-mark-as-primary-identity.** Per
  the spec's own §0/§10: `Business.name`/`Business.logo` is the foreground
  identity throughout, never Nahui's own mark; "Powered by Nahui" is a
  small, passive, non-tappable trust footer only. Don't reflexively pull in
  `DESIGN-SYSTEM.md`'s merchant-app components/tokens wholesale — this
  surface's entire trust posture depends on not reading as merchant-app
  chrome.
- Behavior is sourced only from the Approved spec — never invent a flow,
  screen state, or business rule beyond what it defines.
- Same review pipeline as the Merchant prototype: `ux-critic` (UX quality)
  → `reviewer` (Foundation consistency) → `merchant-user-tester` doesn't
  apply here (its persona is Ana, the merchant, not a customer) — a live
  click-through by Main is the closing verification step instead.

## Domain layer

`Claim`'s schema was never given an explicit field table in the Foundation
before this build — formalized as `{ id, businessId, customerId,
saleItemId, claimedAt }` per the Gap Analysis, recorded in `decision-log.md`.
`Customer`'s fields are already complete as specified in `domain-model.md`
(D35/D37) — no new fields needed.

## Status

First build in progress — see `docs/gap-analysis.md` for the full
Architecture Gap Analysis this build proceeds from.
