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

## Where this fits

- Upstream: an **Approved** Low-Fidelity spec in `product/02-ux/` (which also
  covers the workflow's Product Definition and UX Flow Review stages, D42),
  plus an Approved Architecture Review (Stage 3, `architect`). Real build work
  never starts ahead of either.
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

## Status

First feature slice (Home → Inventario → Registrar mercancía → Selling →
Digital receipt) complete: four design passes (v1 build → v2/v3/v4 visual/
design-system/demo-polish revisions), one `ux-critic`-caught Major (price-
validation gap, fixed), one `reviewer`-caught Blocker (premature Product
write, fixed), two real bugs found by `merchant-user-tester` across three
walkthrough runs (a Sheet backdrop positioning-context bug, fixed; a missing
running-subtotal gap, fixed) — full record in `README.md`. Approved by the
Product Owner as the workflow-defining experiment behind D42.
