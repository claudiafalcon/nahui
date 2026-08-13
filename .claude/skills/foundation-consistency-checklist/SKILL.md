---
name: foundation-consistency-checklist
description: reviewer's actual check list for any artifact under review — what to check for, independent of artifact type (architecture recommendation, UX spec, Figma build, code). Load before starting a Foundation-consistency review.
---

# Foundation Consistency Checklist

Genuinely artifact-agnostic — applies identically whether the artifact under review is an architecture recommendation, a UX handoff, documentation, a Figma build, or code.

## Before checking anything

Read whatever is relevant to the work under review:
- `product/00-foundation/domain-model.md`, `ubiquitous-language.md`, `architecture-principles.md`, `global-principles.md`, `information-architecture.md` — the standard being checked against. `global-principles.md` specifically covers language (Spanish/English split), UX philosophy, and AI-collaboration rules — check every artifact against it, not just code.
- `product/00-foundation/decision-log.md` — before calling something wrong, check whether it was a deliberate, logged decision. Don't flag a settled tradeoff as an oversight.
- `company/CLAUDE.md` and `company/backlog.md` — for whether the work matches actual current priority and doesn't build into a non-goal.
- The actual artifact under review, and, where relevant, the docs it's supposed to stay synchronized with.

## What to check

- **Inconsistency with the foundation**: does this contradict a frozen decision in `domain-model.md` or `decision-log.md` without going through `99-rfc/` first?
- **Ubiquitous-language violations**: does it invent a new name for something `ubiquitous-language.md` already defines, or use an existing term to mean something different? (E.g., calling something a "sale mode" when the vocabulary is `registrationMode`, or treating InventoryEntry as user-facing.)
- **Duplicated responsibility**: does this reimplement something an existing aggregate, context, module, or agent already owns?
- **Unnecessary complexity**: new abstractions, configuration, or indirection beyond what the task actually needed.
- **Simplification opportunities**: a workflow or piece of code that does the same thing in more steps than necessary.
- **Principle violations**: check explicitly against `architecture-principles.md` (e.g., capabilities resolved once and never asked mid-flow, aggregate boundaries matching write-throughput needs) and `global-principles.md` (e.g., "never ask twice," literal-translation Spanish copy, "selling is a state, not a navigation destination").
- **Doc/implementation drift**: does `00-foundation` (or any other doc) still accurately describe what the code/design actually does? Flag either direction — stale docs or undocumented reality.
- **Decision-Log Re-Audit**: when the dispatch is to review a `decision-log.md` entry that tightens or corrects an earlier rule, don't stop at the artifact actively being amended — cross-reference every other Approved artifact in `product/02-ux/` and `product/02b-medium-fidelity/` that references the affected term or rule, and flag each one for a fresh consistency pass even if nothing about it is currently in flight (`company/CLAUDE.md`'s Decision-Log Re-Audit).

For severity classification and reporting format once findings are identified, load `severity-classification`.
