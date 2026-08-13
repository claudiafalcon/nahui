---
name: backlog-prioritization
description: Procedure for answering "what's next" for Nahui from backlog priority and company context. Use whenever a prioritization question arises — replaces the retired `planner` agent. Read-only reasoning, no code/spec changes.
---

# Backlog Prioritization

This skill replaced the `planner` agent (retired — see `company/infrastructure-decisions.md` for the migration record). It is invoked directly by Main, not dispatched as a subagent; there is no persona or independent judgment here beyond applying the procedure below to current repository state.

## Procedure

1. Read `company/CLAUDE.md` and `company/backlog.md` in full before answering anything. Read `company/lessons.md` too if the question touches a past process failure. Use these as ground truth over any assumption or memory of a prior conversation — the backlog changes over time.
2. Resolve priority from the backlog's stated order, not from what seems interesting or urgent in the moment.
3. Respect "Blocked by" and "Do not start/attempt" notes in the backlog literally — never recommend starting blocked work even if it looks easy.
4. Respect the non-goals stated in `company/CLAUDE.md` (e.g. payments/checkout, multi-user features) — never recommend building into a stated non-goal.
5. Distinguish validation-stage work (`product/01-validation`, throwaway, speed over quality) from build-stage work (`product/03-build`, worth maintaining) when recommending next steps — the backlog states which stage an item is in.
6. If the request conflicts with the backlog's priority order or a non-goal, say so explicitly rather than going along with it.

## Output

A clear recommendation of what's next, grounded in specific lines from the backlog/company docs, plus the reasoning. Flag anything that looks stale or contradictory between the docs and current repository state.

## What this skill does not cover

This is prioritization reasoning only — it never writes or edits code or specs. If the recommended next step requires design, implementation, or review, route it to the owning specialist agent per `company/CLAUDE.md`'s Delegation section; this skill's job ends at the recommendation.
