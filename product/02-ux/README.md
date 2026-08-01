# Nahui — UX Documentation

This folder holds the low-fidelity UX specification for each merchant-facing
experience in Nahui: Ana's actual goal, the decision logic behind what she sees,
every screen state (not just the happy path), text/ASCII wireframes, and the
reasoning tying each decision back to a named product or architecture principle.

These are conceptual specs, not visual design and not implementation. Wireframes
are structure and hierarchy only — no color, no typography, no components. Visual
design and engineering both happen downstream of an approved doc here.

## Methodology (applied to every experience, in order)
1. Read the relevant `product/00-foundation/` documents in full — vision, domain
   model, information architecture, global principles, architecture principles —
   plus `company/CLAUDE.md` and `company/backlog.md` for who Ana is and what's
   actually a current priority.
2. Define the merchant's goal and the automatic resolution/decision logic first,
   before drawing any screen.
3. Enumerate every state the experience can be in — not just the happy path:
   loading, empty, success, error, edge/recovery cases.
4. Wireframe low-fidelity only: hierarchy (what's biggest/most prominent) and
   interaction affordance (what's tappable vs. passive), nothing visual.
5. Justify every decision against a specific, named principle from
   `global-principles.md` or `architecture-principles.md`.
6. Flag anything the frozen foundation doesn't resolve as an open question for
   the Architect rather than inventing an answer.
7. Review and approve before moving to the next experience.

## Status

| Experience | Doc | Status |
|---|---|---|
| Hoy (Home) | `home.md` | Approved |
| Inventario | `inventory.md` | Approved |
| Eventos | `events.md` | Approved |
| Resultados | `reports.md` | Approved |
| Settings | `settings.md` | Not started — see open question below |
| Onboarding | `onboarding.md` | Not started — see open question below |

All four primary merchant experiences are now designed, reviewed, and approved — including a full UX Remediation cycle (Main → UX Designer → UX Critic → UX Designer (remediation) → UX Critic (verification) → Reviewer → Main persists) that closed every Blocker and Major UX-quality finding. See "UX Critic Findings" below for the record.

## UX Critic Findings

`ux-critic-findings.md` tracks UX-quality findings (Blocker / Major / Minor / Suggestion) from `ux-critic`'s review of each spec — separate from the Decision Ownership logs below, since these are actionable directly by `ux-designer`, not open questions needing an owner's decision. All 15 Blocker/Major findings from the first pass (below) have been remediated and verified clean; a handful of Minor findings and Suggestions remain open (untouched, by design — they don't gate the cycle).

| Doc | Blockers | Major | Minor | Suggestions |
|---|---|---|---|---|
| `home.md` | 2 (fixed) | 4 (fixed) | 2 | 3 |
| `inventory.md` | 0 | 3 (fixed) | 4 | 3 |
| `events.md` | 0 | 3 (fixed) | 5 | 2 (1 fixed as part of a broader cross-reference sweep) |
| `reports.md` | 0 | 3 (fixed) | 4 | 3 |

## Open Questions — now classified by Decision Ownership

Per the Decision Ownership policy in `company/CLAUDE.md`, domain ambiguities surfaced during UX work are no longer kept in one undifferentiated log — they're split by who needs to resolve them:

- **`architect-questions.md`** — Architect Decisions only. Currently 0 open, 1 resolved (Q7: Eventos/Resultados scope boundary).
- **`product-decisions.md`** — Product Decisions (product behavior/UX/capabilities/feature scope). Currently **0 open** — Q1, Q2, Q3, Q6, Q9, Q10 all resolved, and their follow-up UX work is done: Q9 (Venue entity, RFC 0001/D20 — picker designed in `events.md`, grouping updated in `reports.md`) and the Q8-adjacent "Tus clientes" spec (below) have both completed their full design pass.
- **`company/business-decisions.md`** — Business Decisions (pricing/commercialization/legal/compliance/operations). Currently **1 open**: Q5 (capability self-service editability after onboarding — narrowed by Q4's resolution, still genuinely undecided). Q4 and Q8 resolved.

**Q8 is resolved and applied** (`decision-log.md` D22, `product/99-rfc/0002-loyalty-claim-complete-capability.md`): Customer Segmentation is a core capability, Claim resolves via NFC tag or a Sale-level QR Claim Token, Merchant App consumes only Derived Customer Intelligence. `reports.md`'s "Tus clientes" (§3.6/§3.12/§3.13) is now a real, fully-specified feature — gated by `subscriptionTier=paid` and `loyaltyEnabled=true` together — that went through its own full design pass (`ux-designer` → `ux-critic` → `reviewer`, zero Blockers/unresolved Majors). See `product/02-ux/ux-critic-findings.md`'s "Customer Segmentation (Q8) resolution cycle" entry.

## Onboarding and Settings — what's still open before design can start

Navigational placement for both is already resolved (`decision-log.md` D13, `information-architecture.md`'s "Onboarding and Settings" section): Onboarding is a first-run flow preceding all four tabs, not a tab itself; Settings hangs off Home's session-controls affordance (`home.md` §3.7's "▾"), not a fifth tab. What's still open:

- **Onboarding**: Q4 is resolved (`decision-log.md` D19) — initial capabilities emerge from an Onboarding path selection (e.g. "Empezar gratis," "Activar kit NFC," a demo profile), never an isolated toggle, and the NFC path must be modeled as confirming possession of an already-obtained kit (zero in-app payment processing, per the payments/checkout non-goal). What D19 explicitly left to Onboarding's own design: the exact paths, their copy, and how many there are. No blocking gap — this is the design task itself, not a prerequisite to it.
- **Settings**: Q5 is still **open** — whether any Business Capability is ever merchant-self-service-editable after onboarding, or only changed via backend/support, is genuinely undecided (you deferred it last time we discussed it). This is a real blocker: it determines whether `settings.md` needs any merchant-facing UI at all, or should be ruled out of scope entirely.
