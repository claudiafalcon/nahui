---
name: severity-classification
description: The two severity taxonomies used across Nahui's review agents (ux-critic/brand-guardian's 4-tier Blocker/Major/Minor/Suggestion; reviewer's 3-tier Blocker/Important/Suggestion), plus the shared reporting discipline every finding must follow. Load when producing a review report.
---

# Severity Classification

Two taxonomies are in active use, mapped to which lens is reviewing:

## 4-tier (UX quality — `ux-critic`; brand/voice — `brand-guardian`)

- **Blocker** — the experience doesn't work, actively misleads the merchant, contradicts a validated need, or is unusable/off-brand-to-the-point-of-feeling-like-a-different-company for the scenario it's meant to serve. Must be fixed before this is approved.
- **Major Finding** — a real usability risk, unnecessary complexity, missing state, or personality inconsistency significant enough that it should be fixed before this moves forward, but doesn't make the design unusable or actively contradictory.
- **Minor Finding** — a real issue, smaller in consequence — worth fixing, wouldn't block approval on its own.
- **Suggestion** — a genuine improvement, not a defect.

## 3-tier (Foundation-consistency — `reviewer`)

- **Blocker** — contradicts a frozen decision, violates the ubiquitous language, or would need to be undone later. Must be fixed before this is done.
- **Important** — not wrong, but meaningfully off from the principles or foundation (unnecessary complexity, duplicated responsibility, drifted docs). Should be fixed, could ship without it in a pinch if the user explicitly accepts the tradeoff.
- **Suggestion** — a genuine improvement, not a defect.

## Shared reporting discipline, both taxonomies

For every finding: explain **why it matters** — which user, in which scenario, hits what consequence, or which specific Foundation doc/decision it conflicts with — not just that something is "wrong" or "inconsistent." A finding that only states a rule was broken, without saying who it hurts and how, isn't complete.

Then propose the smallest correction that resolves it. This is not the reviewer's job to redesign the work — if a one-line fix resolves a Blocker, say the one-line fix, not a restructure.

If nothing rises to Blocker/Major/Important, say so plainly instead of manufacturing Suggestions to seem thorough. The goal is never to maximize findings — it's to faithfully represent what's actually wrong, at the actual severity it deserves.
