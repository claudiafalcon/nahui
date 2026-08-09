# Loyalty-claim UX — product/02-ux-loyalty

Low-Fidelity UX specifications for the customer-facing Loyalty-claim surface — a separate customer-facing surface, not part of the Nahui Merchant Application (`product/00-foundation/information-architecture.md`'s explicit scope-out; `domain-model.md`'s module-boundaries note that loyalty-claim is "likely a separate deploy target entirely, not a screen inside the merchant app"). Created 2026-08-08 (`decision-log.md` D38), mirroring the same reasoning `product/02b-medium-fidelity/` used to get its own folder (D24) rather than stretch an existing folder's scope.

## Where this fits
- Sibling to `product/02-ux/`, not a subfolder of it — same pipeline stage (Low-Fidelity, implementation-independent UX specs), different surface/deploy target.
- `product/02-ux/CLAUDE.md`'s own charter is explicitly Merchant Application only; documents here are explicitly excluded from that folder, not merely additional to it.
- Same fidelity discipline as `product/02-ux/`: implementation-independent, ASCII/text wireframes, no color, no component names, no framework references (`product/02-ux/CLAUDE.md`'s own Rule, inherited here).

## Rule
Same document structure and review pipeline as `product/02-ux/`: `ux-designer` produces the spec (no Write access — Main persists), `ux-critic` reviews UX quality, `reviewer` checks Foundation consistency, Main persists approved work. Each document's own §0 states its scope boundary against the Merchant Application explicitly, since that boundary is the entire reason this folder exists separately.

## Status

- `customer-loyalty-registration.md` — **Approved (Draft-complete).** First version built 2026-08-08 against `decision-log.md` D34/D35/D37. `ux-critic`: 2 rounds — round 1 found 2 Major (a self-contradictory "No, gracias" button-weight annotation; a missing decline affordance/trust-footer gap on §3.6) + 3 Minor (concurrent-claim race not named, among others), all fixed; round 2 clean, no regressions. `reviewer`: 1 Blocker (implementation-specific Button-class naming, violating the inherited "no component names" fidelity rule — fixed) + 2 Important (undocumented placement in `product/02-ux/`, resolved by this folder's own creation, `decision-log.md` D38; no `product/02-ux/CLAUDE.md` status entry needed). Final `reviewer` pass clean, including a fresh Foundation-consistency check against `domain-model.md`/`ubiquitous-language.md`/RFC 0004/RFC 0005. See `product/02-ux/ux-critic-findings.md`'s "Frequent Customers Stage 2" entry for the full finding record (shared with its merchant-facing sibling amendment, `product/02-ux/reports.md` §3.15–§3.18).
