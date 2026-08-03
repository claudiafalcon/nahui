# Medium-Fidelity UI — product/02b-medium-fidelity

Tracking only. The actual designs live in Figma, produced by the `ui-designer`
agent via Figma MCP tools — `ui-designer` has no Write access to `product/`,
same constraint as `ux-designer`. Each file here is a lightweight index: Figma
file/frame links, per-screen review status, and a pointer to which version of
the upstream Low-Fidelity spec it was built against.

## Where this fits
- Upstream: an **Approved** Low-Fidelity spec in `product/02-ux/` — real
  layout work never starts ahead of that. If a screen state, edge case, or
  interaction rule isn't in the approved `02-ux/*.md` doc, it doesn't exist
  yet at this fidelity either.
- Downstream: `product/03-build` — Medium-Fidelity is the last stop before
  implementation, once everything below has passed review.
- Sibling: `product/02-ux/` stays scoped to "no visual design," per its own
  `CLAUDE.md` — this folder exists specifically so Medium-Fidelity work
  never has to be squeezed into that folder's rules or 11-section spec
  structure, which was never built to hold layout/Figma tracking.

## Rule
One tracking file per experience, named after its `product/02-ux/` sibling:
`home.md`, `inventory.md`, `events.md`, `reports.md` (and eventually
`onboarding.md`, `settings.md`, once each has its own Approved Low-Fidelity
spec). A tracking file for an experience is only created once that
experience's Low-Fidelity spec is Approved — enforcing the same sequencing
`02-ux/CLAUDE.md` already imposes on itself. If the upstream spec is later
amended (e.g., a Foundation-driven RFC), note here which version/state of
the spec the current Medium-Fidelity work reflects, and flag explicitly if
an in-flight amendment means this tracking file is temporarily stale.

## Document structure (per experience)
1. Upstream spec reference — which `product/02-ux/*.md` doc, and its status
   at the time Medium-Fidelity work started (flag if the upstream doc has
   since been amended and this tracking hasn't caught up yet).
2. Figma file/frame links — one per screen state the upstream spec
   enumerates; a screen isn't "done" until every state has a link, not just
   the happy path.
3. Review status per screen — `ui-designer` → `ux-critic` (fidelity-aware:
   Medium adds information hierarchy and layout consistency on top of every
   Low-Fidelity check) → remediation if needed → `reviewer`'s
   Foundation-consistency pass. A screen is only marked complete once that
   full cycle is clean (zero Blockers, zero unresolved Majors).
4. Deviations from the upstream spec, if any, and why — `ui-designer` never
   invents flows/states/behavior beyond what the approved Low-Fidelity doc
   defines; if a layout constraint forced a genuine deviation, it's recorded
   here and flagged to Main, not silently absorbed.

## Raw design assets
`company/brand/raw-assets/` (Design.pdf, Colores.pdf, nahui_palette.pdf/svg,
mockups.png, and future additions) is reference material only — brand
identity, color, typography, spacing, border radius, general visual
language. It is not a source for layout, component hierarchy, workflows, or
interaction patterns; the approved `product/02-ux/*.md` spec always takes
precedence over anything visual in raw-assets. See `ui-designer`'s own agent
definition (`.claude/agents/ui-designer.md`) for the full rule.

## Status
- `home.md` — **done**. Full cycle complete (including one Important
  finding — SessionHeader compound string vs. `decision-log.md` D20 —
  found, fixed at both the Low-Fidelity and Figma layers, and
  re-verified clean). Second document to complete the Medium-Fidelity tier.
- `inventory.md` — **done**. Full cycle complete (one Major — undersized
  delete tap target — and one Minor — self-contradicting picker-sheet
  state — found, fixed, and re-verified clean). Third document to
  complete the Medium-Fidelity tier.
- `events.md` — **done**. Full cycle complete, zero Blockers, zero
  unresolved Important findings. First document to complete the
  Medium-Fidelity tier.
- `reports.md` — **done**. Full cycle complete (2 Major — undersized Día-row
  tap targets, weak tappability signal — and 1 Minor found, fixed, and
  re-verified clean; 2 Important doc-drift findings from `reviewer`, both
  non-blocking, one resolved via a `brand-guide.md` addition, one routed to
  `ux-designer`). Fourth document to complete the Medium-Fidelity tier.
- `onboarding.md` — **done**. Full cycle complete (0 Blockers, 0 Major/
  Important findings; 2 Minor found, tracked non-blocking). Fifth document
  to complete the Medium-Fidelity tier. **Rebuilt for `decision-log.md` D27**
  (retired activation-code path removed, new "Activar plan de pago"
  confirmation screen added) — `ux-critic` clean (1 tracking-file-only
  Minor, corrected), `reviewer` clean (1 non-blocking wording suggestion,
  applied to the low-fi spec). Folded back into done.
- `settings.md` — **done**. Built directly against the D27-corrected spec
  (retired "Activar venta con tags" activation-code path never existed in
  this build; new `defaultSellingMode` control added across 3 new frames).
  Sixth and final document to complete the Medium-Fidelity tier. `ux-critic`
  clean (1 non-blocking UX gap — SET-D27-MIN1, tracked in this document's
  own Known gaps), `reviewer` clean.

**All six documents (Hoy, Inventario, Eventos, Resultados, Onboarding,
Configuración) have now completed the Medium-Fidelity tier.**
