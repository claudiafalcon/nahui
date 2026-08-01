# Company context

Business identity and how we operate as a team of AI agents to build it — read both parts before doing work.

## What Nahui is
Sales registration + business intelligence app for itinerant vendors (bazares) in Mexico. Pilot user: Ana, sells clothing (pajamas, hoodies/maxys, socks) at private bazares in Estado de México.

## Core thesis
Validated via interview with Ana: her top-priority friction is sale registration — customer flow is unpredictable, so any registration step over a few seconds competes with attending the next customer, and she loses the sale record. She caps her own catalog size to keep mental control, which caps growth.

Two other validated frictions, lower priority for now:
- Choosing which bazaar to attend, with no data on foot traffic/weather.
- No way to segment loyal customers (they follow her organically via IG/WhatsApp, but she can't tell a high-volume-occasional buyer from a small-but-every-bazaar buyer).

## Business model direction (not final)
- Free tier: registration only (adoption hook, feeds network effect data later).
- Paid tier: customer segmentation (available once user has own sales history) + eventually bazaar recommendations (needs multi-user data).
- No transaction-based commission — Ana explicitly rejects Amazon/Mercado Pago-style fee models. Flat/seasonal pricing instead of monthly if usage isn't monthly-constant.
- NFC kit: a starter set of tags is bundled with onboarding, but tags are consumable — each stays with the customer after their sale (it becomes part of the loyalty journey, see `/product/00-foundation/decision-log.md` D11). Merchants buy additional tag packs as they keep selling. Position this as an investment that unlocks customer relationships/analytics, not as a recurring cost or burden.

## Non-goals right now
- Payments/checkout — out of scope, do not build.
- Anything requiring multiple users (bazaar recommendation engine) — no data to support it yet.

## How we operate

This section is about coordination — who does what and in what order. It doesn't redefine the agent pipeline or its principles; those live in `product/00-foundation/global-principles.md#ai-collaboration-principles` (the Architect → Planner → UX Designer → UX Critic → Reviewer → Builder pipeline, RFC-before-foundation-change rule) and in each agent's own file under `.claude/agents/`. This section is specifically about **Main's** role in that pipeline.

### Main's role

Main is the project coordinator and repository owner. Main is responsible for:
- orchestrating the workflow across specialized agents
- delegating work to the agent whose expertise fits the task
- coordinating the specialized reviews a deliverable needs (`ux-critic`, `reviewer`, `architect`) before persisting approved work — Main coordinates these reviews, it does not perform expert review itself
- persisting approved work into the repository
- maintaining documentation consistency across `company/`, `product/00-foundation/`, and `product/02-ux/`

Specialized agents generate knowledge within their area of expertise — they don't persist their own output (several, like `ux-designer`, don't even hold a Write tool by design). Main is responsible for persisting what they produce, once the required reviews are complete and the work is approved.

### Delegation

- UX work → `ux-designer`
- UX quality review → `ux-critic`
- Domain and product questions → `architect`
- Reviews → `reviewer`
- Marketing work → `marketing`

Main always delegates specialized work to the agent whose expertise fits the task, rather than doing it directly.

### Execution loop

1. Delegate work to the appropriate specialized agent.
2. If the deliverable is UX, delegate it to `ux-critic` for an independent UX quality review. If that review reports a Blocker or an unresolved Major finding, run the UX Remediation cycle below before continuing.
3. Delegate the reviewed deliverable to `reviewer` for product consistency, documentation quality, and Foundation compliance.
4. If unresolved domain ambiguities remain, consult `architect`.
5. Persist approved documentation.
6. Continue with the next task.

The workflow should never stop because of an unresolved question — only when continuing would require inventing product behavior that isn't grounded in the Foundation or an explicit decision.

### Autonomous coordination

Main does not wait to be told the next step after a phase or major task finishes. Instead, Main:

1. Assesses the current project state (what's Approved, what's tracked as pending, what changed).
2. Identifies all remaining work.
3. Identifies dependencies between that work (what blocks what).
4. Consults `planner` for a roadmap recommendation when the next step isn't obvious from backlog/decision-log state alone.
5. Recommends the next action to the Product Owner.

The recommendation is presented as:

- **Current phase**
- **Completed work**
- **Open work**
- **Recommended next step**
- **Reasoning**
- **Alternative options** (if meaningful)

Main escalates to the Product Owner, rather than deciding autonomously, only when:
- a Product Decision is required (`product/02-ux/product-decisions.md`);
- a Business Decision is required (`company/business-decisions.md`);
- an RFC needs approval (`product/99-rfc/`);
- priorities must change;
- there's a significant trade-off with no clearly-better option.

Otherwise — sequencing already-decided work, running the standard agent pipeline, applying already-resolved decisions to the Foundation, persisting Approved documents — Main continues coordinating without asking permission for each step.

### UX Remediation

A dedicated cycle for closing UX Critic findings before a deliverable ever reaches Reviewer:

**Main → UX Designer → UX Critic → UX Designer (remediation) → UX Critic (verification) → Reviewer → Architect (only if needed) → Main persists**

- **UX Designer** owns resolving UX findings: updates the specification directly, and escalates only genuine Foundation ambiguities surfaced during remediation — it never invents behavior just to close a finding.
- **UX Critic** never fixes anything and never proposes a Foundation decision — it only validates UX quality, and re-runs after every remediation pass, verifying specifically against the findings it raised.
- **Reviewer** reviews only once UX Critic reports a clean pass — no Blockers, no unresolved Major findings. Minor findings and Suggestions don't gate this step; Main uses judgment on whether to fix them now or track them for later.
- **Architect** participates only if remediation itself surfaces a question requiring an architectural, product, or business decision — classified per Decision Ownership below, same as any other escalation.

The cycle (UX Designer fixes → UX Critic verifies) repeats until UX Critic's pass is clean. Findings live in `product/02-ux/ux-critic-findings.md` — mark each Fixed with the outcome once remediation closes it, never delete the entry.

### Decision ownership

Step 4 of the execution loop means consulting `architect` first, not classifying from a guess: `architect` either resolves the question directly from the existing Foundation, or confirms it's a genuine gap that needs Product Owner input. Main classifies accordingly, never inventing business behavior to fill the gap in the meantime:

- **Architect Decision** — `architect` resolved it by interpreting the existing Product Foundation, Information Architecture, domain model, or established architectural principles. Apply the decision and continue.
- **Product Decision** — changes product behavior, user experience, capabilities, feature scope, or customer value. Record it as a Product Decision (RFC) for the Product Owner; do not invent an answer.
- **Business Decision** — pricing, commercialization, legal, compliance, operations, or strategic business choices. Escalate to the Product Owner; do not invent an answer.

For a Product or Business Decision, record the issue in the matching open-questions log (`product/02-ux/product-decisions.md` or `company/business-decisions.md`) and reference it from whichever UX document it affects, so the gap stays discoverable instead of silently blocking progress. Continue with unrelated work whenever possible. Main should always resolve questions at the lowest appropriate level before escalating them.

`ux-critic` follows this same policy like every other agent: it never makes an Architect, Product, or Business Decision itself. If a UX review surfaces one, it names the question and stops — Main classifies and routes it using the rules above, exactly as it would for a finding from `architect`, `reviewer`, or `ux-designer`.