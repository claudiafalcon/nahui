# UX Documentation — product/02-ux

Low-fidelity, implementation-independent UX specifications for each merchant-facing
experience in Nahui. These are design specs, not UI code: no HTML/React, no
components, no colors/typography. Visual design is a separate, later pass.

## Where this fits
- Upstream: `product/00-foundation/` — domain model, information architecture, and
  principles are frozen ground truth. Every doc here cites them; none of them
  restate, contradict, or re-derive foundation content.
- Downstream: the `builder` subagent implements from these specs once a doc is
  approved. These docs are the handoff artifact — implementation-independent by
  design, so visual/technical decisions don't leak backward into them.
- Sibling: `company/backlog.md` gates what's real/in-progress vs. blocked. Don't
  design for a backlog item marked "Blocked by" or "Do not start" — flag it as an
  open question instead.

## Rule
One file per experience, named after its `information-architecture.md` nav label:
`home.md` (Hoy), `inventory.md` (Inventario), `events.md` (Eventos), `reports.md`
(Resultados). An experience not present in the frozen IA nav is not given a file
here without an Architect/RFC decision first (`product/00-foundation/decision-log.md`,
`product/99-rfc/README.md`).

## Document structure (every file, same order)
1. Merchant goal
2. Resolution / decision logic
3. Low-fidelity wireframes
4. Interaction flow
5. Screen states
6. Minimum step count
7. Automation opportunities
8. Open questions for Architect
9. Principle justification
10. Decisions made
11. Future considerations (if any)

## Rules for every doc
- Implementation-independent: layout/hierarchy/affordance only, ASCII/text
  wireframes, no color, no component names, no framework references.
- Merchant-facing copy in natural Mexican Spanish, using the merchant's own
  vocabulary (never literal translation, never engineering terms). Agent-facing
  reasoning in English. See `global-principles.md#product-language`.
- Cite `global-principles.md` and `architecture-principles.md` by name for every
  major decision — a general "this aligns with our principles" is not sufficient.
- Never modify `product/00-foundation/` from this folder. If a doc surfaces a gap
  the foundation doesn't cover, record it under that doc's "Open questions for
  Architect" section — don't resolve it unilaterally here.
- One experience is designed, reviewed, and approved before the next one starts.

## Status
- `home.md` — approved; amended for `decision-log.md` D23 (Session-scoped selling mode) — full remediation cycle complete (four Major findings across three rounds, see `ux-critic-findings.md`), `reviewer` clean, folded back into Approved
- `inventory.md` — approved; amended for D23 (cross-reference/terminology only) — zero findings, `reviewer` clean, folded back into Approved
- `events.md` — done, approved (one open item, Q6, doesn't block approval)
- `reports.md` — done, approved (Q8, Q9 resolved and applied — "Tus clientes" and "Rendimiento por bazar" are both real, reviewed specs; Q10 resolved — `reviewed` stays dormant, no UX design needed, `decision-log.md` D18)

- `onboarding.md` — approved; first document written and reviewed from a blank slate (one Blocker, one Major, four Minors — all fixed and verified, see `ux-critic-findings.md`)

All five designed experiences (Hoy, Inventario, Eventos, Resultados, Onboarding) are done and approved.
- `settings.md` — not started; **unblocked** — Q5 resolved (`decision-log.md` D25, `company/business-decisions.md`): Business Capabilities (`subscriptionTier`, `loyaltyEnabled`, `registrationMode`'s `nfc` entitlement) are fully self-service, bidirectional, at any time, never deleting historical data. Ready to design as the last Low-Fidelity deliverable: six actions (three capabilities × two directions), a reusable "pending change, takes effect on [date]" indicator, a way to cancel a pending change. One narrower open item (Q11 — the specific per-transition immediate/deferred timing rule, blocked on a not-yet-designed pricing/billing-cycle model) doesn't block starting the design — the UI can support either immediate-with-confirmation or deferred-with-indicator per capability.

## UX Critic Findings

`ux-critic-findings.md` is the standing log of UX-quality findings from `ux-critic`'s review of any spec in this folder — usability, missing states, complexity, consistency. Different in kind from the three Decision Ownership logs below: findings here are actionable directly by `ux-designer`, not questions needing an owner's decision. Check it before assuming a UX weakness you've found is new, and before treating any "Approved" doc's status as meaning its UX quality has been checked — approval before this log existed only ever meant `reviewer`'s Foundation-consistency pass.

## Open Questions — classified by Decision Ownership

Domain ambiguities the Foundation doesn't resolve are split into three logs by who needs to decide them, per the Decision Ownership policy in `company/CLAUDE.md`:

- `architect-questions.md` — resolvable by Architect from the existing Foundation alone.
- `product-decisions.md` (this folder) — needs a Product Owner call on product behavior/UX/capabilities/feature scope.
- `company/business-decisions.md` — needs a Business Decision (pricing/commercialization/legal/compliance/operations).

Check all three before assuming a gap you've found is new. When escalating a new one, classify it by ownership first (per `company/CLAUDE.md`'s Decision Ownership section) and log it in the matching file — don't resolve it yourself, and don't default everything into `architect-questions.md` the way earlier entries did before this policy existed.
