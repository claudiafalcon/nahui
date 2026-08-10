# Experience Review — 2026-08-09: `decision-log.md` D40 cascade, first walk of the synced "Tu negocio" step and the retired-toggle Configuración page

**Persona:** Ana. **Purpose:** first-ever `merchant-user-tester` walk of the "Demo — Journey 1 Seamless" page since it was (a) synced with the "Tu negocio" business-identity step for the first time and (b) had its independent "Activar/Desactivar clientes frecuentes" toggle sub-flow deleted, both as part of the D40 (`loyaltyEnabled` retired) cascade. Also the first successful `merchant-user-tester` dispatch after `infrastructure-decisions.md` ID014 (the agent was refusing to spawn with zero tools for two prior attempts this session, root-caused and fixed by registering `chrome-devtools` as a Project MCP).

## Core question 1: "Tu negocio" reachable via "Empezar gratis" — Validated

Ana's path: Bienvenida → "Empezar gratis" → "Tu negocio" (business name pre-filled "Ropa Ana") → "Continuar" → "Todo listo" → "Empezar" → Home cold start. She reached and passed through the newly-synced step herself, without any prompting or hint that it was new. **Verification status: Independently Verified** — by Ana's own completed walk through it; this is the actual evidence, not a substitute for it.

## Core question 2: no `loyaltyEnabled`-style toggle anywhere in Configuración — Validated

Ana's own description of the full Configuración screen: exactly two cards, "Tu plan: Gratis" with an "Activar plan de pago" button, and a text-only "Cómo vendes normalmente" line — "no toggles, no account/profile section... nothing about customers." She never found anything labeled "clientes frecuentes" anywhere in the app. **Verification status: Independently Verified** — by Ana's own direct, specific report of the screen's contents.

## Finding, reported as a defect, not yet properly re-validated — "dead" ▾/"Registrar mercancía" buttons

Ana reported that after one round-trip into Configuración and back ("← Hoy"), both remaining visible controls on the Home cold-start screen (the "▾" dropdown and "Registrar mercancía") stopped responding to repeated taps, blocking her from continuing to explore (including ever finding, or not finding, the Loyalty Participation/Recompensas content — she never got that far).

**Verification status: Pending Verification.** Main clicked the same path on a fresh `chrome-devtools-mcp` page immediately after the report and got successful navigations both times — mechanically consistent with `infrastructure-decisions.md` ID013's known pattern (a long-lived automation page can silently stop delivering clicks on specific frames; a fresh page resolves it). But Main's own click-through is not the right evidence to close this finding: Main already knows the expected destinations and the spec, which is exactly the "spec-informed pattern-matching" `company/CLAUDE.md`'s knowledge-isolation rule for `merchant-user-tester` exists to keep out of Experience Validation — a click succeeding for Main doesn't establish what a genuinely naive user would have experienced at that same moment. Downgraded from an earlier draft of this review that treated Main's reproduction as dispositive; that was a mistake, corrected here. **Real next step:** a fresh `merchant-user-tester` walk of the identical path, not Main's own testing, is what actually resolves whether this was a tooling artifact or a real defect.

## New finding — session-controls sheet reads as a large button in mostly empty space

Ana: *"almost the entire panel was empty grey space with just one red 'Configuración' button floating in it... felt unfinished."* **Verification status: Pending Verification** — this is Ana's own felt observation about the single-entry variant of the session-controls sheet (reached from Home's cold-start/idle states, no "Cerrar sesión" row since no Session is open); it hasn't been independently corroborated by anyone else's naive walk. Likely pre-existing and unrelated to D40 (this sheet's shape wasn't touched by this cascade, only its Configuración-page destination content), but that's an inference from the build history, not confirmation of the felt experience itself. Not fixed here; flagged as a candidate for a future visual-polish pass, not routed to `ui-designer` unilaterally.

## Not treated as a defect — pre-filled business name

Ana found it "strange" / "disorienting" that the "Nombre de tu negocio" field on "Tu negocio" already showed "Ropa Ana" before she'd typed anything. This is the Medium-Fidelity build's established static-content convention for illustrative demo data (the same pattern used throughout this file for seeded/example values), not a build defect or a real product behavior — a real merchant's own field would start empty. **Verification status: Pending Verification** against whether this specific illustrative pre-fill is confusing enough in a demo context to warrant a visual "example data" cue — a felt-experience observation worth logging, not something to silently dismiss, but not acted on in this review.

## Not reached — Loyalty Participation / Recompensas content

Because Ana's walk stopped at the point described above (the ▾/"Registrar mercancía" controls no longer responding), she never attempted to reach the newly-synced Recompensas sub-chain (`798:488`–`798:589`, reachable via Resultados' "Tus clientes"). This remains genuinely un-walked by a persona. **Coverage gap, named plainly:** a follow-up `merchant-user-tester` dispatch is needed — both to re-attempt the stuck path (resolving whether it was a tooling artifact or a real defect) and to continue on to Recompensas, which no naive walk has reached yet.

## References
- `company/infrastructure-decisions.md` ID013 (a chrome-devtools long-lived-page click-delivery pattern this review's dead-button finding may or may not be an instance of — not confirmed) and ID014 (this session's `merchant-user-tester` spawn-failure root cause/fix)
- `product/00-foundation/decision-log.md` D40; `product/99-rfc/0006-retire-loyalty-enabled.md`
- `product/02b-medium-fidelity/settings.md`, `onboarding.md`, `CLAUDE.md` (the D40 demo-page sync/cleanup section)
- `product/02-ux/experience-validation-coverage.md` (Onboarding/Settings supplementary rows — this walk adds evidence, not yet reflected there)
