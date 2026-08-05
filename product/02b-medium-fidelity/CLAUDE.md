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

## Clickable prototype (final Medium-Fidelity deliverable)

Built 2026-08-03, first as one compressed happy-path chain, then **reorganized the same day** into three distinct, realistic business-scenario journeys per Product Owner request — showcasing how Nahui is actually used in different situations rather than compressing every feature into one continuous path:

1. **First-time merchant, empty inventory**: Onboarding ("Empezar gratis") → Home literal Cold start → Register Merchandise (Inventario) → Create Event (Eventos) → Sell with Buttons (Home) → Results.
2. **Existing merchant using NFC**: Home (pre-populated, tagged inventory, `defaultSellingMode=nfc`, entry at Idle) → Create Event (Eventos) → Sell with NFC (Home) → Results.
3. **Inventory management**: Home → Inventory → Add Product → Assign Tags → Ready to sell.

Every intra-document transition is fully live and Present-mode-smooth. Cross-document hops use a URL-link fallback (opens the destination in a new tab rather than transitioning in place) — a real Figma platform limitation (reactions can't NAVIGATE/OVERLAY across pages), not a build shortcut; see `company/infrastructure-decisions.md` ID003. Product Owner accepted this as-is; not revisited unless a specific future use case requires seamless cross-document transitions.

**Structural technique worth knowing about:** several screens are shared building blocks across journeys (Eventos' Nuevo-evento form/save, Inventario's Registrar-mercancía flow, Home's Continuar-Día-N/Venta-en-curso/Finalizar-Venta) — but Figma reactions are one-destination-per-node, so a shared node can't branch to two different endings (buttons vs. NFC selling mode, or feed into Journey 2 vs. Journey 1's differently-scoped continuation). Rather than let one journey silently overwrite another's reaction on a shared node, `ui-designer` cloned the minimum set of downstream frames needed for each journey to diverge correctly — 10 new clone frames total (1 in Onboarding, 3 each in Inventario/Eventos/Home), zero original frames modified. Every clone exists solely to break a shared-node conflict, not to introduce new content — see each document's frame table below for the specific IDs.

**Journey 1's Onboarding→Home handoff now correctly lands on literal Cold start** (`35:261`), matching `onboarding.md` §2.4 exactly — the earlier version's Idle-state shortcut (and the decision point it raised) is resolved by the reorganization itself: Journey 1 now continues forward through Inventario rather than needing to skip it.

The pre-existing "Activar plan de pago" Onboarding path, and the Settings/Reports secondary journeys from the first build pass, remain fully intact and untouched by this reorganization — not part of the three primary showcased journeys, but still wired and demo-able.

Deliberately not wired (per "primary journeys, not exhaustive" scope): Onboarding's "Ver un ejemplo" path, every error/slow/fallback state, and several destructive/cancel branches (Cancelar evento, Descartar, Cerrar-sesión-bloqueado, etc.) — all remain intact as static frames, just off the wired click paths.

One real Medium-Fidelity coverage gap surfaced (not fixed, per no-redesign scope), inherited identically by the new clone frames: no frame exists showing a form field populated *after* a picker selection (Lugar/Tipo/Producto) — picker rows currently close back to the same static, still-empty form frame. Worth a small frame addition in a future pass if this matters for demo fidelity.

`ux-critic` verified the reorganized 3-journey structure clean across two follow-up passes: all 10 new clone frames confirmed faithful/unedited, Journey 1's Cold-start correction confirmed, buttons-vs-NFC surfaces confirmed genuinely distinct, Journey 3 confirmed untouched, Settings/Reports secondary paths confirmed intact — but one real content gap was found (JOURNEY2-MAJ1, below), fixed, and independently re-verified clean.

**JOURNEY2-MAJ1 (found and fixed same day):** Journey 2's NFC selling flow, once the first item was added, was routing to a frame still showing the buttons-mode product grid — directly contradicting `home.md` §3.7/§3.10's "no product grid in nfc mode, ever" rule. Root cause: no Medium-Fidelity frame had ever been built for "nfc mode, 1+ items in Venta actual" — a real, previously-latent coverage gap this reorg's new wiring made reachable for the first time. Fixed by composing the already-approved §3.8 (with-items shell) and §3.10 (grid-free nfc registration zone) into a new frame (`114:377`) — no new design decision, a direct composition of already-specified content. Independently re-verified clean. See `product/02b-medium-fidelity/home.md` for full detail.

**All new frames from the reorganization have been added to `product/02b-medium-fidelity/{onboarding,inventory,events,home}.md`'s tracking notes.**

**Product Validation Sprint — usability audit and fix cycle (2026-08-03).** `ux-critic` ran a genuine first-time-user usability audit (distinct from every prior Foundation-consistency/build-fidelity pass) and found two priority issues plus three smaller ones, all since fixed and independently re-verified clean: the active-selling session-controls arrow (was ~1/4 the size of its pre-session sibling — real risk of never being found), the NFC scan prompt's missing icon (flagship registration surface), the picker-selected-value gap in Eventos/Inventario, a wordmark alignment outlier, and an ambiguous "0" placeholder on the quantity field. See each affected document's own tracking file for detail. One standing, disclosed caveat carried forward from before this cycle: the picker fixes' reaction *wiring* is outside `ux-critic`'s tool scope to verify directly (ID004) — recommend one manual Present-mode click-through before a live demo.

**The reorganized 3-journey clickable prototype is now considered demo-ready.**

**One open, deliberately-not-resolved item:** neither buttons-mode nor nfc-mode's "with items" screen has a wired "add another item" loop-back reaction in the prototype (buttons mode never had one; nfc mode's literal equivalent is rejected by Figma's Plugin API and wasn't worked around unilaterally). If a live "scan/tap to add a second item" click-through matters for a specific demo, that's a design call to make explicitly, not something to default into.

## Demo — Journey 1 Seamless (2026-08-04)

After personally testing the 3-journey prototype ahead of this week's usability sessions, the Product Owner found the cross-document URL/new-tab hops (ID003) broke the experience into what felt like disconnected prototypes rather than one application — the exact trigger ID003's original decision named for revisiting it. See `company/infrastructure-decisions.md` ID003's 2026-08-04 revisit entry and new ID006 (two real Plugin API gotchas hit during this build: cloning from a non-current page silently drops nested instance reactions, and `.clone()` doesn't preserve a node's own top-level reactions — both worked around).

**New page, additive only:** `Demo — Journey 1 Seamless (First-time merchant)`, page `160:2`, same file (`DPRnGD5JWjfoNBSlAFoVG4`). All six production pages and the existing three-journey URL-fallback wiring are untouched — this page exists alongside them, not instead of them.

26 frame clones, zero new content — every clone reuses an already-approved state (favoring the existing Journey-1 clones and the picker-populated clones — Producto="Pijama", Lugar="Plaza Norte", Tipo="Bazar" — documented in `onboarding.md`/`inventory.md`/`events.md`/`home.md` — over recloning from raw originals wherever a Journey-1 clone already covered the same state). Full sequence: Onboarding (Bienvenida → Creando tu negocio → Todo listo) → Home cold start → Inventario (Registrar mercancía → Elegir producto → Producto=Pijama → committed lines → saving → post-save confirmation) → Eventos (cold start → Nuevo evento → Elegir lugar → Lugar=Plaza Norte → Elegir tipo → Tipo=Bazar → saving → post-save confirmation) → Home (evento activo → hub → Venta en curso → Finalizar Venta → session controls → Cerrar sesión confirmación → Día cerrado) → Resultados (session detail, final destination `162:2019`).

Every hop is a same-page `NODE`/`NAVIGATE` reaction — no URL fallback anywhere in the primary chain. Verified via a fresh, node-by-node `.reactions` readback (not cached from the build, not visual-only, per ID004's structural gap): 26/26 hops pass, correct destination + trigger type, terminates cleanly at Resultados.

One real composition choice, not invented content: no pre-existing wired hop ran directly from "sale complete" to Resultados, so the demo reuses the real, already-approved bridge that does exist (Cerrar sesión → Día cerrado → Ver detalle → Resultados) rather than inventing a shortcut.

**This page is a frozen snapshot, not a living source.** If the underlying Low/Medium-Fidelity specs change later, these clones need manual re-sync — same disclosed tradeoff as ID003's original "duplicate anchor frames" option, just scoped to one dedicated page.

### Full-coverage wiring pass (2026-08-04, same day)

Live-testing the 26-frame primary chain surfaced several off-path taps still opening via URL/new-tab — Resultados' back-arrow, Onboarding's "Activar plan de pago," among others. The Product Owner raised the bar past "primary chain + flag exceptions": every tappable element on the page should lead somewhere real, since a live merchant will click unpredictably and a dead tap reads as broken, not as "out of scope."

`ui-designer` completed a full sweep: **34 new clone frames, ~155 reactions wired, 0 `URL`-type reactions remaining anywhere on the page, 0 dangling/stale destinations** — verified via fresh `node.reactions` readback per hop (not cached from build steps, per ID004/ID006), with `setCurrentPageAsync` + manual reaction re-set applied to every new cross-page clone (ID006 parts 1 & 2). New subtrees, all on page `160:2`:

- **Onboarding "Activar plan de pago"** — full 6-hop path to a new Home Idle clone.
- **Onboarding "Ver un ejemplo"** — wired for the first time ever (was unwired even in production).
- **Configuración** — a full 16-clone, cross-linked graph (activate payment ↔ toggle selling mode ↔ downgrade/cancel-downgrade), reachable from both the in-session sheet and a new pre-session Configuración-only sheet, itself opened by two previously-dead header "▾" arrows.
- **Resultados → Event detail**, and **Eventos' own Event detail** (reached from the post-save confirmation's EventCard).
- **Descartar confirmation** and **Cancelar venta actual confirmation** — two more previously-dead in-session links.
- "Guardar mercancía" now enabled on the Producto-seleccionado state (was disabled despite the spec saying it should be enabled once Producto is chosen); 3 more `SessionHeader` "▾" arrows wired; `Empieza`/`Termina`/`Cantidad` fields now show real values per the same-day `inventory.md`/`events.md` default-value amendments.

**Six named, deliberate exceptions** (not silently skipped):
1. Todo listo Variant C's "Empezar" button — no "example business" Home state exists in any approved spec; reusing a real Home frame would misrepresent the fake demo as a real business.
2. ProductTile "add another item" loop — the pre-existing, already-documented gap above (NFC's literal equivalent rejected by Figma's Plugin API; buttons-mode never had one).
3. Committed-line "Eliminar línea (✕)" delete targets — deprioritized, not impossible; would need per-line-removed clone frames, a proportionality call.
4. Event detail's Día 1/Día 3 rows — day-level totals exist, but no approved spec gives a per-product breakdown for those specific days (only the whole-event aggregate and Día 2's own numbers do); placeholder clones were built then deleted rather than populated with fabricated numbers.
5. "Iniciar Sesión Rápida" reuses the event-labeled session screen despite Quick Session having no venue per `home.md` §3.4 — disclosed content-accuracy simplification, not a dead link.
6. Several Configuración loyalty-toggle/cancel returns converge on a shared landing frame rather than a distinct clone per tier×state combination — disclosed simplification to avoid an unbounded combinatorial frame matrix; functionally live, just not state-accurate in every branch.

**The seamless demo page is now considered fully click-through-ready** — every button leads somewhere real except the six named exceptions above, each irreducible without inventing content, duplicating a pre-existing unresolved product gap, or an explicit, disclosed simplification.

### 2026-08-04, same day — three-spec amendment sync

Same day as the two passes above, the Product Owner raised three more usability concerns while testing (Cantidad's default clarity, Empieza's default clarity, and Finalizar Venta's missing success confirmation), each routed through the full Low-Fidelity amendment cycle (`ux-designer` → `ux-critic` → `reviewer`, all clean — see `product/02-ux/CLAUDE.md`'s Status section) before landing here. All three applied across both the six production pages and this demo page: `inventory.md` Cantidad default+tap-affordance (7 text updates), `events.md` Empieza/Termina default+gate (14 text updates), and `home.md`'s genuinely new §3.8e "Venta finalizada ✓" confirmation state (one new frame per surface — `192:382` production, `198:823` demo — plus one reaction hop rewired on each, all verified via fresh `node.reactions` readback per ID004/ID006). Full detail in each document's own Medium-Fidelity tracking file.

**One real gap surfaced, not yet closed:** the low-fi `inventory.md` spec's `[−]`/`[+]` Cantidad stepper has never actually been built in this Medium-Fidelity file — only the bordered value box exists, no increment/decrement tap targets. Typed entry (the spec's hard requirement for reaching a large quantity) works and is visibly affordant; the stepper itself is still text-only in the spec, not real UI. Tracked in `inventory.md`'s own Known gaps.
