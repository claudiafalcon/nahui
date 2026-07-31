# Product Foundation

This folder is permanent product knowledge: what Nahui is, how its domain is modeled, and how that model is structured into navigation. It sits between `company/CLAUDE.md` (why the business exists) and the execution folders (`01-validation`, `02-ux`, `03-build`, `04-scale` — how it gets built). Read this before making product, UX, or engineering decisions that touch more than a single screen or file.

## Files

- `vision.md` — what Nahui is, and the merchant workflow chain everything else is derived from.
- `ubiquitous-language.md` — the single definition of every domain term. If another doc's wording conflicts with this one, this one wins.
- `domain-model.md` — aggregate roots, entity relationships, lifecycles, business capabilities, bounded contexts, module boundaries. The core of the architecture.
- `architecture-principles.md` — technical rules that constrain implementation (aggregate boundaries, dependency direction, capability resolution).
- `global-principles.md` — canonical, cross-cutting rules every agent follows regardless of task: product language (Spanish/English split), UX philosophy, and how agents collaborate. Read this before making *any* recommendation, not just build/UX-specific ones — it exists precisely so these rules never have to be repeated in conversation again.
- `information-architecture.md` — merchant-app navigation and user journeys. Explicitly scopes out the loyalty-claim module.
- `decision-log.md` — why each non-obvious decision was made, in order. Read this when something in the model looks arbitrary — it probably isn't.

## Status

**Domain Model v1 — frozen.** **Information Architecture v1 — frozen.** UX and UI have not been designed yet — do not infer screen layouts, components, or visual design from these documents. They intentionally stop at structure.

## How future agents should use this

- **Every agent, every task**: read `global-principles.md` before making a recommendation, regardless of what the task is. It's the canonical source for language rules, UX philosophy, and how agents hand off to each other — if you're about to state one of those rules yourself, cite it instead of repeating it.
- Building in `03-build`? Read `domain-model.md` and `architecture-principles.md` first. Aggregate boundaries and dependency directions here are load-bearing, not suggestions — check `decision-log.md` before changing one.
- Designing UX/UI? Read `vision.md` and `information-architecture.md` first, then check `global-principles.md`'s UX principles before proposing any flow that asks the merchant a technical question mid-workflow.
- Unsure why something is the way it is? Check `decision-log.md` before assuming it's undecided or arbitrary — most of what looks like an open question here has already been through a design pass.
- Adding a new capability, entity, or context? Update `ubiquitous-language.md` and `domain-model.md` together, and add a `decision-log.md` entry. Don't let a second definition of a term drift into existence somewhere else in the repo.
