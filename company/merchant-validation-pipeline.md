# Merchant Validation Pipeline — Cadence Design

Prepared by: Market Validation & Go-to-Market (`marketing` agent), 2026-08-08.
Status: preparation/design artifact. Defines *how* and *when* validation work cycles, not what gets published or sent — nothing here is itself an external-facing action; the Approval gate in `company/CLAUDE.md`/this agent's own file governs execution of anything this pipeline schedules.

**Trigger.** Written in direct response to a Knowledge Mentor consultation (Question A, dispatched by Main against the "Post-D33 Continuous Validation Package" recommendation) on validation cadence, and to the Product Owner's request to reconcile that evidence into a persisted design rather than leaving it as an unactioned finding.

**Relationship to other artifacts** — stays in its own lane, per `company/CLAUDE.md`'s non-duplication discipline:
- `company/market-validation-roadmap.md` — the *status/sequencing* layer across all of Marketing's work (what's done, in progress, blocked, in priority order). This document doesn't restate that list. It defines the *cadence model* the roadmap's items run inside — when a new validation cycle should start and on what trigger, not which specific item is next.
- `company/merchant-validation-backlog.md` — the *risk-ranked* hypothesis backlog (which hypothesis to test next and why). This document defines the loop those backlog items move through; it doesn't re-score them.
- `company/market-validation.md` — the hypotheses themselves (H1-H6a) and the channel-selection reasoning per hypothesis. Unchanged by this document.

---

## 1. Tiering legend (used throughout)

- **Project Foundation** — `company/CLAUDE.md`, `product/00-foundation/`, `company/business-decisions.md`, `company/backlog.md`, or another governance artifact.
- **Learning Resources** — the Product Owner's curated `Knowledge/` repository.
- **General Knowledge** — Knowledge Mentor's training (**Model Knowledge**) or a fetched external source (**External Sources**), kept distinct.
- **Inference-Recommendation** — this agent's own reasoning connecting evidence to a design choice. Never presented as if it were itself evidence.

---

## 2. What Knowledge Mentor actually found (Question A, relayed verbatim in substance)

**General Knowledge (Model Knowledge), no Learning Resources or Foundation artifact prescribes a cadence — a real, named gap:**
- Torres — weekly touchpoints, one living opportunity-solution tree, presupposes an existing user base large enough to draw weekly interviewees from.
- Ries — Build-Measure-Learn: learning-loop-driven, not calendar-driven; the goal is minimizing total loop time, not hitting a fixed interval.
- Bland (*Testing Business Ideas*) — risk-sequenced experiment cycles: run cheap/fast tests before expensive ones.
- **Convergence noted by Knowledge Mentor:** all three converge on one continuously-updated artifact, not a point-in-time deliverable — which is itself already this project's operating assumption for `market-validation.md` (append/update in place, never a new dated snapshot per finding).

**Nuance Knowledge Mentor flagged, load-bearing for this design:** Torres' weekly model presupposes a *live product with a renewable user base* to draw weekly interviewees from. Nahui's current stage — one validated customer (Ana), no acquisition channel (`company/market-validation-roadmap.md` items 8-9 both **Blocked on Product Owner**; `company/business-decisions.md` Q11 open) — is structurally closer to Ries/Blank's earlier "customer development" phase than to Torres' steady-state cadence.

**Precedent cited by Knowledge Mentor:** `decision-log.md` D33 itself is Nahui's own internal precedent for provisional, reversible adoption of an operating hypothesis ahead of structured validation — the same posture this cadence design formalizes for the process layer, not just the one domain-model decision.

---

## 3. Diagnosis — which stage Nahui is actually in

**Inference-Recommendation, grounded in Project Foundation facts above.** Nahui does not yet have the precondition Torres' weekly cadence assumes: a renewable pool of merchants to draw from every week without a fresh recruitment effort each time. Applying a calendar-fixed weekly cadence today would either (a) manufacture busywork on weeks with no real new signal, just to hit the interval, or (b) quietly go through the motions with the same single respondent (Ana) repeatedly, which risks over-reading one person's pattern as market signal — exactly what H1-H6's own generalization-vs-single-subject discipline (`market-validation.md` §1c) exists to prevent.

**Revision to the prior pipeline design (Section 1.2 of the pre-persistence "Post-D33" draft):** that draft is not adopted as-written. A calendar-cadence framing (e.g., "weekly review") is replaced below with a **trigger-driven loop** — cycles start when a real, named event produces new evidence or capacity to act, not when a fixed number of days has passed. This is the direct product of Question A's nuance finding, not a cosmetic relabeling.

---

## 4. Cadence model — trigger-driven, not calendar-driven

A new validation cycle opens whenever any of the following occurs. Each is a real, checkable event, not a vague "if it seems relevant":

| Trigger | Example already on record | What the cycle does |
|---|---|---|
| **A new operating-model or domain-model hypothesis surfaces from product discovery** | D33's pricing/event-cost gap surfacing H6 (`market-validation.md` §1c) | Name the hypothesis, tier its starting evidence, add it to `merchant-validation-backlog.md`, assign a channel per the existing considered-channels discipline |
| **An already-available, low-cost touchpoint with a known merchant becomes possible** | The 2026-08-08 informal conversation with Ana producing H6a | Run the structured interview/probe already designed and waiting, rather than waiting for a calendar slot |
| **A blocked channel's blocker clears** | Community observation currently structurally blocked for content (`market-validation.md` §2a, 2026-08-07) pending authenticated access | Re-attempt the blocked channel; log result either way |
| **A batch of async signal accumulates to a size worth reading together** | A survey/interview round actually running live (once approved) | Read the batch against Section 6's learning objectives; update hypothesis evidence tiers |
| **A Product Owner decision resolves a standing blocker** | `business-decisions.md` Q11 resolving; Marketing infrastructure (roadmap item 8) provisioned | Re-open the specific hypothesis/channel that blocker was gating |

**Sequencing rule inside every cycle (Bland, General Knowledge/Model Knowledge):** within a cycle, run the cheapest/fastest available test before a more expensive one, provided it targets a comparably risk-ranked hypothesis (see `merchant-validation-backlog.md` for how risk-ranking and cost interact — cheapness is a sequencing accelerant, never a substitute for importance).

**What this deliberately does not do:** it does not schedule a "next Monday" review. There is currently no standing weekly ritual because there is no renewable weekly input to feed one — manufacturing one would produce the appearance of cadence without the substance Torres' model actually depends on.

---

## 5. Graduation criteria — when to adopt a Torres-style steady-state cadence

**Inference-Recommendation**, stated as concrete, checkable conditions rather than a vague "later":

1. A real acquisition/reach channel exists and is live (`company/market-validation-roadmap.md` item 9, currently Blocked on Product Owner) — meaning new merchants can be reached without a bespoke recruitment effort each time.
2. A renewable pool of interviewable merchants exists beyond Ana — i.e., H1's own survey/interview channels (`market-validation.md` §3) have actually produced reachable, opted-in respondents, not just verified community *channels* (which exist today, §2.1, but haven't yet produced individual, reachable people).
3. `business-decisions.md` Q11 is resolved enough that pricing conversations (H5) don't have to be held at a purely directional level.

Once all three hold, this document should be revised to adopt something closer to Torres' weekly opportunity-solution-tree cadence — a single, living document reviewed on a fixed interval — rather than the trigger-driven loop above. **Not proposed as active now**; recorded here so the transition is a deliberate, checkable decision later, not something drifted into.

---

## 6. Standing loop, textually

```
[Trigger fires] → [Name/tier the resulting hypothesis or evidence,
  per merchant-validation-backlog.md's Assumptions Mapping] →
  [Select channel(s) per market-validation.md §3's existing
  channel-comparison discipline] → [Prepare assets (interview
  probe / survey item / usability script / recruitment draft) —
  preparation only] → [Await Product Owner approval for anything
  external-facing] → [Run, if approved] → [Read evidence against
  the hypothesis's learning objective] → [Update evidence tier in
  merchant-validation-backlog.md] → [loop back to trigger-watch]
```

This loop is what `merchant-validation-backlog.md` and `market-validation.md` §8 (new, this pass) are built to feed and be fed by.

---

## 7. Open items

- No date-based checkpoint exists in this design deliberately. If the Product Owner wants a minimum check-in cadence regardless of triggers (e.g., "review this pipeline at least every two weeks even if no trigger fired"), that is a Product Owner preference to state explicitly — this document doesn't assume one.
- Section 5's graduation criteria should be re-checked whenever `company/market-validation-roadmap.md`'s blocked items (8, 9) change status.
