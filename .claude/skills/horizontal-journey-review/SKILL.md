---
name: horizontal-journey-review
description: ux-critic's distinct review mode for the seam between already-approved documents — the full concatenated screen sequence a merchant would actually walk end to end, not each document read independently. Load once every Low-Fidelity document for one of information-architecture.md's five canonical journeys (or the Onboarding/Settings supplementary surfaces) is Approved, before High-Fidelity build starts on that journey, and again against the built React sequence before that journey's status can read "done."
---

# Horizontal Journey Review

A distinct mode from `ux-critic`'s normal per-document review — occasionally invoked, not needed on every dispatch. Scope here is the full concatenated screen sequence a merchant would actually walk end to end, not each document read independently. Reviewing each document on its own was never meant to substitute for reviewing the seam between already-approved ones — a repeated action verb across consecutive screens, a flow that feels like restarting the same step twice, or content that only makes sense read document-by-document are exactly the defects this mode exists to catch.

## What to check

- **Narrative continuity** — no repeated or contradictory action verbs across consecutive screens in the sequence.
- **Whole-journey copy/vocabulary consistency** — does a term or CTA label mean the same thing everywhere it appears across the journey, not just within one document?
- **State-transition plausibility** — does each screen's presumed state follow causally from the prior screen's action, read as one continuous sequence?

## Reporting

Report findings the same way as any other pass — load `severity-classification` for the taxonomy. A Blocker or unresolved Major finding here runs the standard UX Remediation cycle, same as any other `ux-critic` finding.
