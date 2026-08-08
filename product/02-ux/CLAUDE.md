# UX Documentation — product/02-ux

Low-fidelity, implementation-independent UX specifications for each merchant-facing
experience in Nahui. These are design specs, not UI code: no HTML/React, no
components, no colors/typography. Visual design is a separate, later pass.

## Where this fits
- Upstream: `product/00-foundation/` — domain model, information architecture, and
  principles are frozen ground truth. Every doc here cites them; none of them
  restate, contradict, or re-derive foundation content.
- Downstream: the `builder` subagent implements from these specs once a doc is
  approved. These docs are the handoff artifact — implementation-independent by
  design, so visual/technical decisions don't leak backward into them.
- Sibling: `company/backlog.md` gates what's real/in-progress vs. blocked. Don't
  design for a backlog item marked "Blocked by" or "Do not start" — flag it as an
  open question instead.

## Rule
One file per experience, named after its `information-architecture.md` nav label:
`home.md` (Hoy), `inventory.md` (Inventario), `events.md` (Eventos), `reports.md`
(Resultados). An experience not present in the frozen IA nav is not given a file
here without an Architect/RFC decision first (`product/00-foundation/decision-log.md`,
`product/99-rfc/README.md`).

## Document structure (every file, same order)
1. Merchant goal
2. Resolution / decision logic
3. Low-fidelity wireframes
4. Interaction flow — see the expanded rule below; not a bare summary
5. Screen states
6. Minimum step count
7. Automation opportunities
8. Open questions for Architect
9. Principle justification
10. Decisions made
11. Future considerations (if any)

## §4, Interaction flow

Added 2026-08-07, after an architectural investigation into where wiring/navigation should be defined (`architect` → `ux-designer`/`ui-designer`, each independently grounded via a `knowledge-mentor` consultation — see `company/bitacora.md` and `decision-log.md` D31). Every branch point — including error states and interruptions (app backgrounded, network loss, session timeout, and similar) — resolves to exactly one of:
- **(a) a named destination**: a screen state defined in this doc's §5, or another Approved doc's screen state referenced by its canonical ID (`docname.md §x.y`) — never re-described in full, only cross-referenced; or
- **(b) an explicit "Not yet resolved" marker**, cross-referenced to the specific entry that owns it in `product-decisions.md`, `business-decisions.md`, or `architect-questions.md`.

A branch with neither is not acceptable at this fidelity. This bar applies to primary, secondary, error, and interruption branches alike.

This scope — defining every branch's destination exhaustively at this stage — is Nahui's own process decision for how `product/02-ux/` operates, not a claim about where "wireflows" universally sit in UX methodology; convention on that varies even within a single source. What matters here is what this project requires of this document, independent of the label.

**This is a navigation-definition requirement, not an implementation-wiring requirement.** §4 defines the canonical navigation and behavioral destination for every branch, in text; it does not build interactive/clickable resolution — that belongs to Medium-Fidelity in Figma (`product/02b-medium-fidelity/`), never to this doc. Figma's own reaction constraints (one destination per interactive node, clone-vs-share tradeoffs) don't exist as a concept at this stage and this rule doesn't ask §4 to anticipate them — that's `ui-designer`'s own pre-wiring caller-audit discipline (`.claude/agents/ui-designer.md`), a separate fix at a separate layer.

**Wiring originates in this definition, not in Figma.** Medium-Fidelity build realizes exactly the destinations §4/§5 already define — using build-layer techniques (e.g., node cloning to work around Figma's one-destination-per-reaction limit) is expected and does not require a new design decision. If Figma work surfaces a genuine need for a destination or behavior not already defined here, that is a spec gap: it's flagged back to `ux-designer` and recorded as a deviation in the Medium-Fidelity tracking file (`product/02b-medium-fidelity/CLAUDE.md`'s own document-structure item 4), never invented or resolved unilaterally at the Figma layer. This formalizes a rule `product/02b-medium-fidelity/CLAUDE.md` already states and this project has already lived by (see its incident log: JOURNEY2-MAJ1's fix composed already-approved states rather than inventing one; the corrected "Todo listo Variant C" exception, where a destination assumed missing turned out to already be defined in `onboarding.md` §2.4/§4) — this cross-reference makes it explicit at the Low-Fidelity side too, not just the Medium-Fidelity side.

**Shared states across diverging branches** (within a doc, or across docs — e.g. `onboarding.md` §3.5's "Creando tu negocio," reached by all three onboarding paths): reference the shared state by its canonical ID at every entry point instead of duplicating its description, and note in parentheses which flow type reaches it there (e.g., "shared by all three paths," "reached via: onboarding entry / settings reactivation"). Don't restate a shared state's content more than once.

## Rules for every doc
- Implementation-independent: layout/hierarchy/affordance only, ASCII/text
  wireframes, no color, no component names, no framework references.
- Merchant-facing copy in natural Mexican Spanish, using the merchant's own
  vocabulary (never literal translation, never engineering terms). Agent-facing
  reasoning in English. See `global-principles.md#product-language`.
- Cite `global-principles.md` and `architecture-principles.md` by name for every
  major decision — a general "this aligns with our principles" is not sufficient.
- Never modify `product/00-foundation/` from this folder. If a doc surfaces a gap
  the foundation doesn't cover, record it under that doc's "Open questions for
  Architect" section — don't resolve it unilaterally here.
- One experience is designed, reviewed, and approved before the next one starts. Once every document in one of `information-architecture.md`'s canonical journeys is Approved, that rule is complemented, not superseded, by a Horizontal Journey Review (`company/CLAUDE.md`) across the full sequence — reviewing each document on its own was never meant to substitute for reviewing the seam between already-approved ones.

## Status
- `home.md` — approved; amended for `decision-log.md` D23 (Session-scoped selling mode) — full remediation cycle complete (four Major findings across three rounds, see `ux-critic-findings.md`), `reviewer` clean, folded back into Approved. Further amended for `settings.md` §2.1 (Configuración entry point) — full cycle complete (3 Major + 2 Minor across two rounds, see `ux-critic-findings.md`), `reviewer` clean (2 non-blocking documentation-hygiene findings, addressed), folded back into Approved. **Further amended for `decision-log.md` D27** (NFC capability corrected to derive from `subscriptionTier`, not kit/code activation) — 5 stale passages fixed (§2's Ready-branch check, §3.6a's capability-revoked bullet and design note, §3.6c's entry-point notes, §10's decisions bullet), all now point to `settings.md`'s "Activar plan de pago" as the real restoration mechanism. Full cycle complete (1 Blocker in `onboarding.md`'s sibling copy, 2 Major + 3 Minor across the coordinated three-document amendment, all fixed/verified), `reviewer` clean, folded back into Approved. **Further amended 2026-08-04 (HOME-Q1, Product Owner-raised):** new §3.8e ambient "Venta finalizada ✓" confirmation after a successful Finalizar Venta, previously indistinguishable from a fresh Session start or a cancelled sale. Full cycle complete, `ux-critic`/`reviewer` clean, folded back into Approved.
- `onboarding.md` / `settings.md` — **both amended for `decision-log.md` D27** (see their own entries below) — full coordinated three-document remediation cycle complete for both (`ux-critic`: one Blocker in `onboarding.md`'s milestone copy plus two Major/three Minor across the two docs, all fixed and verified; `reviewer`: zero Blockers, one Important documentation-drift finding, fixed), folded back into Approved. **Corrected 2026-08-06** — this line previously read "full remediation cycle pending for both" after the cycle had already completed; a stale status left behind, caught during an `architect` build-readiness review. See `product/02-ux/onboarding.md`/`settings.md`'s own status headers for the full remediation record.
- `inventory.md` — approved; amended for D23 (cross-reference/terminology only) — zero findings, `reviewer` clean, folded back into Approved. **Further amended 2026-08-04 (Product Owner-raised, INV-Q1):** Cantidad now defaults to 1 (was blank) with an explicit tap-affordance requirement (bracketed per the doc's own `[ ]` = tappable convention) and a "revisa antes de guardar" marker on the unreviewed default, carrying into the §3.7 committed-lines list. Full cycle complete, `ux-critic`/`reviewer` clean, folded back into Approved. **Further amended 2026-08-07 (Product Owner-directed, pending-tags task-priority refinement):** in the pending-tags Catalog-view state (§3.5/§3.17), "Continuar etiquetando" (renamed from "Terminar de etiquetar") is now the primary action, "Registrar mercancía" explicitly secondary in that one state only — same position/destination/gating otherwise. Grounded in a joint `architect`/`ux-designer` investigation (Foundation confirmed silent on priority; no business-rule conflict). Full cycle complete, `ux-critic` clean (2 Suggestions logged), `reviewer` clean (1 Important documentation-hygiene fix applied), folded back into Approved.
- `events.md` — done, approved (one open item, Q6, doesn't block approval). **Further amended 2026-08-04 (Product Owner-raised, EVT-Q1/EVT-Q2):** Empieza now defaults to hoy (was blank), Guardar evento's gate narrowed to Lugar + Tipo, and the D17 overlap-check warning's visibility (not computation) deferred until her first engagement with the form. Full cycle complete, `ux-critic`/`reviewer` clean, folded back into Approved.
- `reports.md` — done, approved (Q8, Q9 resolved and applied — "Tus clientes" and "Rendimiento por bazar" are both real, reviewed specs; Q10 resolved — `reviewed` stays dormant, no UX design needed, `decision-log.md` D18)

- `onboarding.md` — approved; first document written and reviewed from a blank slate (one Blocker, one Major, four Minors — all fixed and verified, see `ux-critic-findings.md`). **Amended for `decision-log.md` D27**: the "Activar kit NFC" path (activation-code entry/validating/invalid-code mechanism) is retired entirely, replaced by "Activar plan de pago" — a bare payment-confirmation path granting `subscriptionTier=paid` (and therefore `nfc`, derived per D27). `defaultSellingMode` now written as `buttons` unconditionally for both real paths, deferred to `settings.md`'s new self-service control. Full remediation cycle pending.

- `settings.md` — approved; six merchant-facing actions (three self-service capabilities × two directions each, `decision-log.md` D25), a reusable pending-change indicator, a way to cancel a pending change before it lands. Full remediation cycle complete across three rounds (see `ux-critic-findings.md`) — one Blocker (SET-B1: NFC activation losing its required kit-confirmation step) and five Major findings, including a self-inflicted regression from a restructuring pass that briefly reverted an already-fixed entry-point issue and reintroduced a copy issue. `reviewer` also caught a real Foundation-consistency Blocker (segmentation copy not jointly gated on both `subscriptionTier=paid` and `loyaltyEnabled=true`, per D22) — fixed, verified clean. One narrower open item (Q11 — the specific per-transition immediate/deferred timing rule) doesn't block approval — the UI supports either shape per capability, with today's assignment stated as illustrative. **Amended for `decision-log.md` D27**: the dedicated "Activar venta con tags" activation-code path (SET-B1's own mechanism) is retired entirely — `nfc` is no longer independently self-service-toggleable, it changes only as an automatic consequence of the `subscriptionTier` actions. A new `defaultSellingMode` control ("Cambiar a vender con tags"/"...con botones") is added, previously out of scope. Full remediation cycle pending.

All six designed experiences (Hoy, Inventario, Eventos, Resultados, Onboarding, Settings) are done and approved — the Low-Fidelity UX phase is complete.

## UX Critic Findings

`ux-critic-findings.md` is the standing log of UX-quality findings from `ux-critic`'s review of any spec in this folder — usability, missing states, complexity, consistency. Different in kind from the three Decision Ownership logs below: findings here are actionable directly by `ux-designer`, not questions needing an owner's decision. Check it before assuming a UX weakness you've found is new, and before treating any "Approved" doc's status as meaning its UX quality has been checked — approval before this log existed only ever meant `reviewer`'s Foundation-consistency pass.

## Open Questions — classified by Decision Ownership

Domain ambiguities the Foundation doesn't resolve are split into three logs by who needs to decide them, per the Decision Ownership policy in `company/CLAUDE.md`:

- `architect-questions.md` — resolvable by Architect from the existing Foundation alone.
- `product-decisions.md` (this folder) — needs a Product Owner call on product behavior/UX/capabilities/feature scope.
- `company/business-decisions.md` — needs a Business Decision (pricing/commercialization/legal/compliance/operations).

Check all three before assuming a gap you've found is new. When escalating a new one, classify it by ownership first (per `company/CLAUDE.md`'s Decision Ownership section) and log it in the matching file — don't resolve it yourself, and don't default everything into `architect-questions.md` the way earlier entries did before this policy existed.
