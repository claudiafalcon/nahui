---
name: decision-ownership-classification
description: The three-way Architect/Product/Business Decision classification used to route anything a specialist agent surfaces but cannot resolve itself. Load when a finding, question, or ambiguity needs to be named and routed rather than resolved inline. Canonical source: company/CLAUDE.md's "Decision ownership" section — Main is the one who actually classifies and routes; this Skill is for the specialist naming what kind of question it has surfaced.
---

# Decision Ownership Classification

No specialist agent makes an Architect, Product, or Business Decision itself. When a finding surfaces one of these, the specialist names it and stops there — Main classifies and routes it using the definitions below.

- **Architect Decision** — resolved by interpreting the existing Product Foundation, Information Architecture, domain model, or established architectural principles. Consult `architect`; apply the decision and continue.
- **Product Decision** — changes product behavior, user experience, capabilities, feature scope, or customer value. Record it as a Product Decision (RFC) for the Product Owner; do not invent an answer.
- **Business Decision** — pricing, commercialization, legal, compliance, operations, or strategic business choices. Escalate to the Product Owner; do not invent an answer.

Product and Business Decisions get logged in the matching open-questions log (`product/02-ux/product-decisions.md` or `company/business-decisions.md`) and referenced from whichever document they affect, so the gap stays discoverable instead of silently blocking progress.

This classification is what a specialist reaches for at the moment it hits something outside its own lane — it names the *kind* of question, it doesn't resolve it. The one exception is `architect`, whose actual job is telling business decisions apart from architectural ones on live proposals — that judgment stays in `architect.md` itself, not here.
