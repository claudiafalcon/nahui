# Nahui — AI Engineering Lab: Decisions & Lessons

Running log for `company/CLAUDE.md`'s "Secondary strategic objective" and `product/00-foundation/architecture-principles.md` principle 8 (`decision-log.md` D49, 2026-08-17). Every architecture decision where AI-engineering learning value broke a genuine tie between comparable alternatives gets one entry here — the trade-off considered, what was chosen and why, and (added once real) the lesson learned building and living with it.

This file tracks *this specific lens* only. It doesn't duplicate `product/00-foundation/decision-log.md` (domain/architecture decisions generally) or `company/bitacora.md` (the project's full history) — an entry here should also get a one-line cross-reference in whichever of those is the decision's primary home, per principle 8's own logging requirement.

## Format per entry

- **Date, decision.**
- **Alternatives considered** — the genuine tie this broke, and why they were actually comparable in cost/complexity before learning value was applied.
- **AI-engineering area(s)** — which of the named target areas this maps to (agentic AI, long-term memory, multi-agent collaboration, RAG, knowledge management, semantic search, tool calling, AI orchestration, workflow automation, evaluation frameworks, AI observability, human-in-the-loop patterns, multimodal AI, reasoning models, MCP, AI security/governance).
- **Why this serves the product too** — principle 8 step 1 requires a genuine product/technical need already justifying the choice; state it, don't skip it.
- **Lesson learned** — filled in once the decision has actually been built and lived with, not at decision time. An entry with this still open is expected and normal; check back rather than leaving it silently stale.

## Status

No entries yet. This log activates the first time a Stage 7 (backend integration) or infrastructure/tooling decision genuinely reaches a tie between comparable alternatives — `product/03-build` hasn't started (per `company/backlog.md`), so nothing has qualified yet. Do not add a speculative or hypothetical entry here before a real decision is actually made.
