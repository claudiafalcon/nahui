# Merchant Validation Backlog — Risk-Ranked

Prepared by: Market Validation & Go-to-Market (`marketing` agent), 2026-08-08.
Status: preparation/design artifact — a prioritization tool, not itself an external-facing action.

**Trigger.** Written in direct response to a Knowledge Mentor consultation (Question B, dispatched by Main against the "Post-D33 Continuous Validation Package" recommendation) on risk-ranking methodology and this document's own prior "already built into the product" weighting.

**Relationship to other artifacts:**
- `company/market-validation.md` §1, §1c — the hypotheses themselves (H1-H6a), their evidentiary tiers, and per-hypothesis channel recommendations. This backlog scores and sequences those hypotheses; it does not restate their text.
- `company/market-validation-roadmap.md` — the status/sequencing layer across *all* of Marketing's work (infrastructure, positioning, this backlog, etc.). This document is one input to that roadmap, not a replacement for it.
- `company/merchant-validation-pipeline.md` — the cadence/loop this backlog's items move through.

---

## 1. Tiering legend

Same four-tier convention as `merchant-validation-pipeline.md` §1 (Project Foundation / Learning Resources / General Knowledge — Model Knowledge or External Sources — / Inference-Recommendation). Evidentiary tiers for the hypotheses themselves reuse `company/jobs-to-be-done.md`'s own three-tier scale (Validated Finding / Supported Evidence / Open Hypothesis), cited explicitly per row below.

---

## 2. Framework (Question B, General Knowledge — Model Knowledge)

Knowledge Mentor named Bland's **Assumptions Mapping** (*Testing Business Ideas*) as the direct methodological equivalent of what this document was already informally doing: two axes, **Importance** (how much the business depends on the assumption being true; cost of being wrong) and **Evidence** (how much real, converging support the assumption already has). Neither axis is "already built into the product" — that phrase, used in the prior (never-persisted) draft of this backlog, is not part of the named framework and is addressed directly in Section 4 below.

---

## 3. Per-hypothesis scoring

For each hypothesis, two separate things are scored, kept explicitly apart per Knowledge Mentor's finding: **(a) evidentiary strength of the single-subject base claim** (does this hold for Ana specifically) and **(b) evidentiary strength of the market-generalization claim** (does it hold beyond Ana) — because collapsing these two into one "Evidence" score is exactly what caused the ambiguity Knowledge Mentor flagged.

| Hyp. | Single-subject base evidence (tier, `jobs-to-be-done.md`/`market-validation.md`) | Market-generalization evidence | Importance (Inference-Recommendation) |
|---|---|---|---|
| **H1** — Registration friction generalizes | **Validated Finding** — two independent, converging sources (Ana interview + independent field observation, `jobs-to-be-done.md` §1/§3) | None yet — no survey/interview beyond Ana has run | **Very high.** The entire product thesis and MVP scope (`company/CLAUDE.md` Core Thesis, backlog #1) rest on this. If it doesn't generalize, the GTM strategy needs rethinking, not just a tuning pass. |
| **H2** — Catalog-capping is control, not capital | Supported Evidence, single-sourced (`market-validation.md` §1c) | None yet | High — feeds the growth-ceiling argument, but is downstream of H1 holding at all. |
| **H3** — Segmentation readiness follows registration | Supported Evidence (interview only) | None yet | Medium — explicitly sequenced *after* registration (`company/CLAUDE.md`); not urgent to resolve before H1 is further along. |
| **H4** — Bazaar-selection friction | Supported Evidence, strengthened by a concrete cost-differential fact (`market-validation.md` §1d) | None — deliberately parking-lot, `backlog.md` #3 not started | Deliberately low-priority-to-test now — listening-only, no build decision depends on it yet. |
| **H5** — Pricing model generalizes | Supported Evidence (Ana's stated rejection of commission pricing, `company/CLAUDE.md`) | None yet | High but partially blocked — depends on `business-decisions.md` Q11 before a specific price point is testable; the directional shape is testable now. |
| **H6 / H6a** — Price-grouping + event-driven override mechanism | **Supported Evidence, informally sourced** — one unprompted but informal conversation (`market-validation.md` §1c's H6a), explicitly *not* the structured interview still pending | None — single-subject question first by design (§1c's own framing: "no validated starting point even for Ana") | Real but **scoped**, not existential — a sub-mechanism of pricing UX already realized in Low-Fidelity/domain-model form (`decision-log.md` D33; `events.md` §3.19/§3.20, `inventory.md` §3.4a/§3.8a). Getting it wrong means reworking a bounded set of already-built artifacts, not the product's core thesis. |

**Reading the table (Inference-Recommendation):** H6/H6a carries *more stacked uncertainty* than H1 — its single-subject base sits at Supported Evidence (one informal exchange) rather than H1's Validated Finding (two converging sources), so H6 has two open layers (is it even true for Ana in full? does it generalize?) where H1 has one (does an already-solid base claim generalize?). This is the discriminator Knowledge Mentor's Evidence-axis reading surfaces, and it holds on its own, independent of anything about what's "already built."

---

## 4. Reconciling the ranking — does H6 still rank above H1?

**Direct answer: no, not in overall importance — and the prior draft's "already built into the product" justification was doing weaker, more conflated work than it should have. The corrected picture separates two different questions that the prior ranking blurred together:**

**(a) Which hypothesis is more important to the business, full stop?** **H1.** By a wide margin. H1's failure would undermine the product's core thesis and the MVP's entire scope; H6's failure would require reworking a bounded set of already-shipped Low-Fidelity/domain-model artifacts (D33, four documents), a real but scoped cost. Section 3's Importance column reflects this plainly — H1 is "very high," H6 is "real but scoped." **This backlog does not rank H6 as more important than H1**, and any prior framing that implied otherwise is corrected here.

**(b) Which hypothesis's *next validation action* should actually run first, given cost and availability?** Here, **H6's structured interview legitimately runs first or concurrently** — but for a different, narrower reason than "it's more important": it is **cheap, fast, and already has a warm, available channel** (Ana, who has already had one informal, unprompted conversation on exactly this topic — `market-validation.md` §1c's H6a). H1's own primary recommended channel (community observation) is currently **structurally blocked** (`market-validation.md` §2a, 2026-08-07 finding) and its secondary channel (the survey) isn't yet approved to run live (`market-validation-roadmap.md` item 9, Blocked on Product Owner). **This is Bland's own sequencing principle — run cheap/fast tests before expensive ones — applied as an opportunistic accelerant, not a re-ranking of importance.** H1 stays the higher-importance hypothesis; H6's interview is scheduled first in the *execution queue* because it's available and nearly free to run right now, while H1's cheapest available channel is stalled on external blockers outside this document's control.

**On "already built into the product" specifically:** Knowledge Mentor named two legitimate readings — a defensible remediation-cost proxy for Importance, or the sunk-cost/confirmation-seeking pattern the methodology warns against. **Plain assessment:** it's a legitimate, if narrow, Importance-axis input — forward-looking (cost of unwinding a wrong assumption *now that it's encoded in shipped artifacts* is real and higher than it would have been pre-D33) rather than backward-looking (it is not "we already invested, so it must be validated" — no claim is made here that D33's adoption makes the underlying hypothesis more likely to be true). But it was never doing the ranking work the prior draft implied — **the Evidence axis alone, correctly scored per Section 3, already explains why H6's interview is urgent, without needing "already built" to carry that weight.** "Already built" nudges H6's Importance score up slightly (from a bare feature-mechanism concern to one with real, scoped remediation cost attached); it does not, and should not, be read as elevating H6 above H1 overall. This backlog no longer states or implies that it does.

---

## 5. Priority-ordered next actions

Cross-references `market-validation.md` §3 for full channel-comparison reasoning per hypothesis — not restated here.

1. **H6/H6a structured interview with Ana** (`market-validation.md` §4.6, C2, corrected probe per §8.1 below) — cheapest, fastest, already-available channel; closes the largest stacked-uncertainty gap on the backlog. Ready to schedule now, pending Product Owner approval to actually contact Ana for a dedicated session (distinct from the informal conversation already had).
2. **H1 community observation, re-attempted** — contingent on the 2026-08-07 blocker (`market-validation.md` §2a) clearing (authenticated access, or a Product Owner-approved alternative). Highest-importance hypothesis; currently blocked on tooling, not on design.
3. **H1/H2/H5 survey, live** — pending Product Owner approval to run (`market-validation-roadmap.md` item 9). Ready to execute the moment approval and a channel exist.
4. **H3 fake-door landing page** — pending Marketing infrastructure provisioning (`market-validation-roadmap.md` item 8) and Product Owner approval to publish.
5. **H4** — stays listening-only; no action beyond passive-observation logging when H1's community-observation channel is active again.

---

## 6. Open items

- This backlog should be re-scored whenever a trigger in `merchant-validation-pipeline.md` §4 fires and produces new evidence — not on a calendar interval.
- If a future hypothesis surfaces with a genuinely higher Importance score than H1 (e.g., something bearing on whether the product should exist in its current form at all), that would be the first hypothesis in this project's history to outrank H1 — worth flagging explicitly if it happens, rather than silently re-sorting the table.
