# High-Fidelity React Prototype — product/02c-high-fidelity-prototype

Nahui's primary living prototype and the standing home for all future feature
UI work, React-first as of `decision-log.md` D42. Real, running
React/TypeScript code — not tracking, not a spec, the artifact itself. Stage 4
("High-Fidelity React Prototype") of the standing feature-development
workflow (`company/CLAUDE.md`).

Not disposable (`product/01-validation`'s charter — throwaway, speed over
quality), not yet backend-integrated (`product/03-build`'s charter — code
that survived validation with a real backend). Whether/when this folder is
later renamed into or merged with `product/03-build` once backend
integration (Stage 7) actually starts is a genuinely open future decision,
deliberately not resolved now — see `decision-log.md` D42 point 3.

## Two workflows (D43) — pick the right one per slice

- **Migration Workflow** — for any journey with an already-Approved
  Medium-Fidelity spec (currently: Eventos, Resultados, Onboarding,
  Configuración; Hoy/Inventario already migrated as Slice 1):
  `Approved UX Specification → Architecture Gap Analysis → High-Fidelity
  React Implementation → Review Pipeline → Approved Slice`. The Approved
  `product/02-ux/*.md` doc is the implementation contract — `architect`'s
  Architecture Gap Analysis identifies implementation gaps only (missing
  domain-model fields, write-path strategy, scope boundaries against other
  not-yet-built slices), it never redesigns or re-evaluates the approved UX.
  This is what actually runs for every remaining item in `BACKLOG.md` today.
- **New-Feature Workflow** — D42's full 7 stages (Product Definition → UX
  Flow Review → Architecture Review → High-Fidelity React → Review Pipeline
  → Product Approval → Backend Integration), reserved for a feature with no
  prior Approved spec. Becomes default only once every existing
  Medium-Fidelity journey has been migrated.

## Where this fits

- Upstream: an **Approved** Low-Fidelity/Medium-Fidelity spec in
  `product/02-ux/`, plus an Approved Architecture Review or Gap Analysis
  (`architect`, per whichever workflow above applies). Real build work never
  starts ahead of either.
- Downstream: Backend Integration (Stage 7) — replacing mocked services with
  production services while preserving the approved interaction model, in
  place, on this same codebase. Not a rewrite into a separate folder.
- Sibling: `product/02b-medium-fidelity/` is dormant/legacy as of D42 — Figma
  is no longer a required intermediate stage, retained only for brainstorming,
  concept exploration, marketing assets, illustrations, diagrams, and
  documentation support.

## Rules

- Behavior is sourced only from an Approved `product/02-ux/*.md` (or
  `product/02-ux-loyalty/*.md`) spec — `ui-designer` never invents flows,
  states, or business rules beyond what the approved spec defines, the same
  discipline it already held at Medium Fidelity.
- `ui-designer` is the sole writer here (`Write`/`Edit`/`Bash`, scoped
  strictly to this folder — see `.claude/agents/ui-designer.md`). Every other
  agent reviewing this artifact (`ux-critic`, `reviewer`, `merchant-user-tester`)
  reads/interacts with it, never edits it directly.
- Foundation consistency is required exactly as everywhere else —
  `domain-model.md`/`ubiquitous-language.md`/`architecture-principles.md`
  govern the domain layer (`src/domain/`) the same way they govern any other
  implementation.
- **Terminology drift discipline (D42):** any terminology/copy decision made
  directly inside this prototype that diverges from an Approved `02-ux/*.md`
  spec must be flagged back through `ux-designer`/`architect` before it's
  treated as canonical — never silently absorbed as fact just because it's
  what's running live. Name it explicitly in `README.md`'s own pass history,
  the same disclosure discipline already established there.
- All future feature work extends this same codebase (new `src/screens/<Feature>/`
  trees, following the existing domain-layer/file-structure convention
  `README.md` documents) rather than forking a new folder per feature — the
  direct consequence of "React is the Living Product Specification: a single
  source of truth," not one per feature.

## Review Pipeline (Stage 5)

Typical sequence: `ui-designer` builds/fixes → `ux-critic` (UX quality) →
`reviewer` (Foundation consistency) → `merchant-user-tester` (naive
first-time-merchant walkthrough of the running prototype). Every review
improves the same running artifact — no parallel design implementations.
`ux-critic`/`reviewer` read the source directly (`src/`) since neither holds
browser tools; `merchant-user-tester` interacts with the live dev server.

## Product Approval (Stage 6)

Once a feature's prototype satisfies UX, architecture, and merchant
validation: UX decisions, interaction patterns, and design-system additions
for that feature are frozen. The React prototype becomes the implementation
reference for Backend Integration (Stage 7).

## Where the actual content lives

- `README.md` — the real build history: every pass, every bug found and
  fixed, every scope decision and its rationale, in the order it actually
  happened. Read this first.
- `DESIGN-SYSTEM.md` — the reusable design language (tokens, the Swing Tag
  primitive at its five scales, typography/motion roles, content
  conventions) — what should carry forward into every future feature, not
  just this one.

## Per-slice bounded context files (knowledge-architecture refactor, Stage 3,
2026-08-13)

While a slice is actively in progress — from the Architecture Gap Analysis
through build, review, fix rounds, and merchant validation — Main maintains
one working file at `context/<slice-name>.md` (e.g., `context/resultados.md`)
holding exactly what every dispatch touching that slice actually needs:
the Gap Analysis's findings, the load-bearing decision-log citations for
this slice specifically, the current build/review status, and a running
log of what's been found and fixed so far. Every dispatch for that slice —
the build itself, each fix round, each verification pass — references this
file by pointer instead of Main re-typing the same 500-1000 words of
context into every dispatch prompt from scratch, which is both a real,
avoidable generation cost for Main and a redundant re-derivation cost for
whichever agent reads it.

**This is a working file, not a permanent archive.** Once a slice is fully
Approved and complete, its context file's content is superseded by that
slice's own entry in README.md's per-pass archive (see the next section) —
the two are not meant to duplicate each other long-term. At that point the
context file is either deleted or reduced to a one-line pointer at the
archive entry, Main's call at the time, made explicitly rather than left to
silently rot as stale, contradictory context a future dispatch might
mistakenly read.

## Status

First feature slice (Home → Inventario → Registrar mercancía → Selling →
Digital receipt) complete: four design passes (v1 build → v2/v3/v4 visual/
design-system/demo-polish revisions), one `ux-critic`-caught Major (price-
validation gap, fixed), one `reviewer`-caught Blocker (premature Product
write, fixed), two real bugs found by `merchant-user-tester` across three
walkthrough runs (a Sheet backdrop positioning-context bug, fixed; a missing
running-subtotal gap, fixed) — full record in `README.md`. Approved by the
Product Owner as the workflow-defining experiment behind D42.
