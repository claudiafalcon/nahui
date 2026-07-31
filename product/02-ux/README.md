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
- **`product-decisions.md`** — Product Decisions (product behavior/UX/capabilities/feature scope). Currently 6 open: Q1 (Día N counting), Q2 (untagged-unit sellability in `nfc` mode), Q3 (overlapping active Events), Q6 (Event-type enum openness), Q9 (venue identity), Q10 (Session-reviewed setter).
- **`company/business-decisions.md`** — Business Decisions (pricing/commercialization/legal/compliance/operations). Currently 3 open: Q4 (who sets initial capabilities), Q5 (capability self-service editability), Q8 (customer segmentation vs. Loyalty-claim boundary).

The single most consequential outstanding item is **Q8** (`company/business-decisions.md`): customer segmentation vs. Loyalty-claim's merchant-invisible design. It needs a Business Decision before "Tus clientes" in Resultados can become more than an illustrative placeholder.

## Open questions surfaced across experiences (not resolved here)
- **Is there a dedicated "Settings" experience at all?** `information-architecture.md`
  specifies exactly four top-level nav items (Hoy, Inventario, Eventos,
  Resultados) and nothing else. Business Capabilities (`registrationMode`,
  `subscriptionTier`, etc.) are described in `domain-model.md` as resolved once,
  but the IA doc never specifies where — or whether — the merchant can ever
  change them after onboarding. Needs Architect/Planner confirmation before
  `settings.md` is scoped, so as not to design a screen for a capability that's
  meant to be fixed at signup.
- **Is there a distinct onboarding experience beyond Home's cold-start state?**
  Registering a Business and choosing an initial `registrationMode` are implied
  by `domain-model.md` but no dedicated flow is specified anywhere in the frozen
  IA. `home.md` state 3 (cold start) currently covers "no Product registered
  yet," but business creation and initial capability choice likely happen even
  earlier than that. Recommend confirming scope before creating a standalone
  `onboarding.md`.
