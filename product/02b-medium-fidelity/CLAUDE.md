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
  Medium-Fidelity tier. **Amended 2026-08-05/06**: a redundant review
  (triggered by a since-fixed Session Recovery failure) found and fixed 5
  real Majors + 5 Minors, but also caused a regression — 3 legitimate
  Journey 2 clone frames deleted. Per Product Owner direction, the
  legitimate fixes were kept and the regression fully restored (new IDs
  `324:540`/`324:559`/`324:563`). Final `ux-critic` pass clean (restoration
  + all 10 items + full 20-frame sweep); `reviewer` pass clean (one
  Important finding — the second cycle's changes were undocumented — closed
  by adding the missing record). See `product/02b-medium-fidelity/events.md`
  §3 for the full account and `company/bitacora.md` for the incident.
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

**2026-08-07 (`decision-log.md` D32) — this technique is now a proactive, mandatory classification, not an ad hoc judgment call.** After this exact pattern recurred repeatedly (Findings 8/9/10, the Guardar-mercancía hijack, a fresh post-remediation leak the Product Owner found by hand), an architectural investigation (`architect` → `ux-designer`/`ui-designer`, each independently verified against real incident evidence, `knowledge-mentor`-grounded) confirmed cloning as the correct mechanism — not the elegant one, the reliable one, since Figma's more "caller-owned" alternatives (instance overrides, Variables-based routing) both have documented silent-failure modes reproducing this exact bug. `.claude/agents/ui-designer.md`'s caller-audit rule now requires a two-axis classification (content-identical? navigation-identical?) the moment a node is first identified as needing a second journey/caller — not only reactively, before a rewrite. No canonical-journey artifact was introduced; `product/02-ux/`'s experience-based organization was confirmed sufficient, the gap was here, in when this classification triggers, not in how journeys are documented upstream.

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
1. ~~Todo listo Variant C's "Empezar" button — no "example business" Home state exists in any approved spec; reusing a real Home frame would misrepresent the fake demo as a real business.~~ **Corrected 2026-08-06 — this characterization was factually wrong, not a real exception.** `onboarding.md` §2.4/§4 already specify exactly this handoff: "Ver un ejemplo" → Home's own Idle state (`home.md` §3.4) or Event-active state (`home.md` §3.6), populated with the seeded demo data, same as any ordinary Business. Reusing Home's real states for the demo *is* the design (`decision-log.md` D19), not a shortcut around one. Independently confirmed unwired via `merchant-user-tester`'s Qualification Run and Main's own reproduction (`product/02-ux/experience-review-2026-08-06.md`) — genuinely a build gap, just never actually an unresolvable one. **Fixed 2026-08-06** — wired to the already-existing `284:3698` (Home §3.6, Event-active nfc-twin, populated with real seeded data), reusing the exact pattern sibling Variant B already used. `ux-critic` verified the fix correct against spec (see `company/infrastructure-decisions.md` for its full pass). A `merchant-user-tester` re-walk was attempted but is **Inconclusive** — the run couldn't achieve genuine click interaction this session (see `company/infrastructure-decisions.md` ID011) and correctly refused to report click-dependent findings as validated. A follow-up re-walk with reliable interaction is still needed before this fix is considered fully confirmed from a real-tap perspective.
2. ProductTile "add another item" loop — the pre-existing, already-documented gap above (NFC's literal equivalent rejected by Figma's Plugin API; buttons-mode never had one).
3. Committed-line "Eliminar línea (✕)" delete targets — deprioritized, not impossible; would need per-line-removed clone frames, a proportionality call.
4. Event detail's Día 1/Día 3 rows — day-level totals exist, but no approved spec gives a per-product breakdown for those specific days (only the whole-event aggregate and Día 2's own numbers do); placeholder clones were built then deleted rather than populated with fabricated numbers.
5. "Iniciar Sesión Rápida" reuses the event-labeled session screen despite Quick Session having no venue per `home.md` §3.4 — disclosed content-accuracy simplification, not a dead link.
6. Several Configuración loyalty-toggle/cancel returns converge on a shared landing frame rather than a distinct clone per tier×state combination — disclosed simplification to avoid an unbounded combinatorial frame matrix; functionally live, just not state-accurate in every branch.

**The seamless demo page is now considered fully click-through-ready** — every button leads somewhere real except the six named exceptions above, each irreducible without inventing content, duplicating a pre-existing unresolved product gap, or an explicit, disclosed simplification.

### 2026-08-04, same day — three-spec amendment sync

Same day as the two passes above, the Product Owner raised three more usability concerns while testing (Cantidad's default clarity, Empieza's default clarity, and Finalizar Venta's missing success confirmation), each routed through the full Low-Fidelity amendment cycle (`ux-designer` → `ux-critic` → `reviewer`, all clean — see `product/02-ux/CLAUDE.md`'s Status section) before landing here. All three applied across both the six production pages and this demo page: `inventory.md` Cantidad default+tap-affordance (7 text updates), `events.md` Empieza/Termina default+gate (14 text updates), and `home.md`'s genuinely new §3.8e "Venta finalizada ✓" confirmation state (one new frame per surface — `192:382` production, `198:823` demo — plus one reaction hop rewired on each, all verified via fresh `node.reactions` readback per ID004/ID006). Full detail in each document's own Medium-Fidelity tracking file.

**One real gap surfaced, not yet closed:** the low-fi `inventory.md` spec's `[−]`/`[+]` Cantidad stepper has never actually been built in this Medium-Fidelity file — only the bordered value box exists, no increment/decrement tap targets. Typed entry (the spec's hard requirement for reaching a large quantity) works and is visibly affordant; the stepper itself is still text-only in the spec, not real UI. Tracked in `inventory.md`'s own Known gaps.

### 2026-08-06 — NFC-mode Settings routing + tab-bar wiring fix (demo page)

Remediation for two `merchant-user-tester` findings from
`product/02-ux/experience-review-2026-08-06-b.md` (Findings 1 and 2): the
NFC-seeded demo Home (`284:3698`) routed Settings to the wrong plan-tier
frame, and its Inventario/Eventos/Resultados tabs were completely unwired
(confirmed via `take_snapshot`: `StaticText`, not `link`).

**Fix 1 — Settings routing.** The shared session-controls sheet (`184:1510`)
is opened by 4 different `▾` triggers across Home variants; rewiring it
directly would have broken 3 legitimate paths. Cloned it (`360:1117`),
rewired the nfc-twin's own trigger (`284:3704`) to open the clone, and
pointed the clone's Configuración button to an already-existing paid/nfc-
consistent frame (`184:1713`, not invented). Follow-up: `184:1713`'s own
back-link (`184:1714`) was pointing to a buttons-mode cold-start (`162:1485`)
— rewired to `284:3698`.

**Fix 2 — Tab bar, expanded scope.** The same unwired-tab-bar gap was
confirmed on all 5 nfc-mode frames (`284:3698`, `284:3534`, `284:3540`,
`284:3547`, `284:3552`), not just the one originally reported. All 15 tab
reactions wired to the same canonical destinations already used by every
other wired NavBar on the page (`162:1661`/`162:1804`/`184:1536`), `Hoy`
left unreacted per the established convention.

**Verification, two layers.** `ux-critic` reviewed structurally: clean, 0
Blockers/Majors; both the clone's fidelity and the target frame's paid/nfc-
consistent content confirmed via screenshot; also caught and corrected a
build-report error — `184:1714`'s internal layer name reads "← Eventos" but
its *rendered* text is "← Hoy," already correct, not a stale-label gap as
first disclosed. `ux-critic` flagged that reaction-level click correctness
is outside what Figma-inspection tools can see (`infrastructure-decisions.md`
ID004) — Main closed that exact gap with a live `chrome-devtools-mcp`
click-through: ▾ → `360:1117` → Configuración → `184:1713` (confirmed "Tu
plan: Pago" / "Con tags"), back-link → `284:3698` (confirmed), and all three
tabs on the origin frame → their reported destinations. **Both fixes
Independently Verified end-to-end by live click, not just structural
review.**

**New issue surfaced by Fix 2, not a regression.** Clicking through the now-
wired tabs found all three destinations are generic canonical frames that
don't match the nfc-twin's mid-Día-2, active-event narrative: Inventario →
a blank first-time registration form, Eventos → literal "cold start, no
events" (despite this same Home showing an active event), Resultados → an
unrelated already-closed event. Same root-cause pattern as exception #6
below — reusing the only existing canonical destinations rather than
building context-accurate clones. A genuine improvement over "nothing
happens," not fully state-accurate. Logged as Finding 7 in
`experience-review-2026-08-06-b.md`, a Product Owner proportionality
question (same class as exception #6), not resolved unilaterally.

### 2026-08-07 — Finding 7 resolved: Option C (targeted fix, not full narrative-accuracy coverage)

Product Owner reviewed the trade-offs (full narrative-accurate coverage per every Home state / accept-as-is / a targeted fix) and chose **Option C**: build one genuinely-empty Resultados state and route only demonstrably-fresh-account entry points to it, leaving established personas (the nfc-twin) on the existing populated canonical destination (`184:1536`) — correct content for them, not a bug.

**Build.** `ui-designer` confirmed `184:1536` as the shared populated destination, found and cross-page-cloned an already-approved empty-Resultados state from the production build (`58:28`, matching `reports.md` §3.3 verbatim) → new node `675:2851`. Enumerated all 49 nodes on the page whose Resultados tab targeted `184:1536` and retargeted the ones classified as fresh-account to `675:2851`.

**Round 1 correction — `ux-critic` caught two Major findings.** `675:2851`'s own "Empezar a vender" CTA routed to `162:1492`, a screen showing "$850 · 6 ventas" — fixed → `184:1503` (the genuinely zero-sales anchor). `162:1500`/`162:1511` were misclassified as fresh-account despite displaying "$850 · 6 ventas" — this triggered a full content-based re-audit of all 34 originally-retargeted nodes (not just the 2 caught), which found the original classification was wrong on 18 of 34, not 2. **Corrected split: 16 nodes stay on `675:2851` (genuinely zero-sales); 18 reverted to `184:1536`** (joining the 15 pre-existing legitimate callers, for 33 total on the populated destination). Two judgment calls beyond the literal `$`/ventas check were made and independently re-verified by `ux-critic`: `162:1499`'s reversion on a "Día 2" structural signal (`home.md` line 133: reaching any Día-N≥2 screen requires a prior Session to exist), and `554:4921`/`554:4933`'s reversion based on being mid-chain nodes of one continuous wired flow (`554:4900`→`554:4934`, EV1→EV4) whose endpoints both display "18 ventas·$2,340."

**Round 2 correction — `ux-critic` found a third issue.** `162:1907` was left on the empty state citing the EV4/§3.13 "ambient, minimal-example" precedent — but that precedent is about a screen *omitting* a section, not *displaying* a contradictory one, and doesn't actually cover this case. The real problem traced one layer deeper: `162:1900` (the screen `162:1907` lives on — the first-time "Empezar gratis" journey's post-save-Event confirmation) displayed "Activo, Día 2 de 2 · 03-04 ago," never actually matching its own approved spec (`events.md` §3.10's illustrative state is a **not-yet-started** event, "Próximos... empieza en 3 días") — a pre-existing content-fidelity gap this round's routing work happened to expose, not something it introduced.

**Conformance fix, explicitly scoped by the Product Owner** ("bring `162:1900` back into conformance with §3.10 — no redesign, no new copy, no new product decision"): `ui-designer` made exactly two text edits — `SectionLabel` "Activo"→"Próximos", `EventCard` subtitle "Día 2 de 2 · 03-04 ago"→"empieza en 3 días" — matching §3.10's literal text verbatim. Structure (`AmbientToast`/`SectionLabel`/`EventCard`/`Button`/`NavBar`) confirmed unchanged.

**`284:3690`, confirmed non-conforming, deliberately deferred — not silently skipped.** The nfc-mode twin of `162:1900` shares the identical pre-fix wrong content ("Activo, Día 2 de 2 · 03-04 ago" instead of §3.10's "Próximos... empieza en 3 días") — confirmed directly by `ui-designer`, independently re-confirmed by both `ux-critic` and `reviewer`. Explicitly out of this round's authorized scope (only `162:1900` was named) and left untouched. Same two-text-edit fix would close it whenever authorized — flagged here as a named, owned exception, same discipline as every other deferred item in this file.

**Verification, full chain.** `ux-critic` reviewed every step (the original Option C build, both correction rounds, and the final conformance fix), each time correctly naming reaction/wiring-level boundaries as outside its inspection tools (ID004). Main independently live-click-verified every one of those boundaries on fresh `chrome-devtools-mcp` pages: `162:1500`/`162:1511`→Resultados→`184:1536` (correct); `675:2851`'s CTA→`184:1503` (correct); `284:3698` (nfc-twin)→Resultados→`184:1536` unchanged (correct); `162:1896`'s `AFTER_TIMEOUT`→`162:1900` fires correctly showing the corrected content; `162:1900`'s own Resultados tab→`675:2851` (correct, consistent with its now-accurate content). `reviewer`'s final Foundation-consistency pass: clean — `162:1900` matches `events.md` §3.10 verbatim, `675:2851` matches `reports.md` §3.3 verbatim, no ubiquitous-language/domain-model drift anywhere in the chain, scope discipline held throughout (structural comparison confirms the conformance fix touched only two text fields), and Option C's actual build genuinely satisfies its own stated scope (fresh accounts get real emptiness, established personas keep accurate history).

**Finding 7 is closed.** Two items remain open by deliberate, named deferral, not oversight: `284:3690`'s identical non-conformance (above), and exception #6 below (the broader shared-landing-frame simplification this specific finding was one instance of).

### 2026-08-06 (later same night) — Finding 8: genuine dead-end trap found and fixed (demo page)

A `merchant-user-tester` re-walk dispatched to confirm the fix above found
something more serious than expected: from any of the 5 nfc-mode session
frames, tapping "Inventario" led into `162:1661` ("Registrar mercancía"
form) whose own "← Inventario" back-link dead-ended at `162:1485` (Home's
unrelated Journey-1 Cold-start frame — correct for Journey 1, its original
and only caller, but never reachable from the NFC-mode family until this
same night's tab-bar fix made it reachable for the first time). Once there:
tab bar entirely unwired (a pre-existing, untouched limitation of that
specific frame), only working control (header "▾") loops right back into
the same trap. No path back to the live session existed. Ana correctly
stopped and reported the wall factually rather than diagnosing it, per her
design; Main reproduced every step via `chrome-devtools-mcp` and traced the
root cause.

**Fix.** `ui-designer` built 5 self-referencing clones of `162:1661`
(`371:1138`/`371:1175`/`371:1212`/`371:1249`/`371:1286`, one per nfc-mode
origin frame), each origin's Inventario tab repointed to its own clone —
deliberately self-referencing rather than one shared destination, to avoid
misrepresenting an in-progress sale's items as gone. A 6th leak was found
and fixed proactively: `360:1117` (this same night's Configuración-sheet
clone) had its own Inventario tab still pointing at the original trap —
repointed to `371:1138`. `162:1661`/`162:1485` themselves left untouched;
Journey 1's own use of them is undisturbed.

**Verification.** `ux-critic` reviewed with elevated scrutiny (built without
the mandatory `figma-use` skill loaded) — clean structurally, one Minor
(the "← Inventario" label no longer matches its destination, a disclosed,
acceptable tradeoff, not a trap) — and correctly named that reaction-level
destinations are outside what its tools can see, recommending a live
click-through as the real closing test. Main performed that click-through:
two full round trips confirmed by direct click (`284:3534`→clone→back to
`284:3534`; `360:1117`→clone→back to `284:3698`), both landing exactly on
the correct live session frame. The remaining 3 clones weren't individually
live-tested but are structurally identical in build pattern and correctly
named, per `ux-critic`'s independent check.

**This is the clearest demonstration yet of why Experience Validation
exists as its own gate:** a re-walk dispatched to confirm one fix instead
found a worse problem that fix had newly exposed, one hop further in.

**Finding 10 (same night, found by the re-walk closing out Finding 9): a
fifth instance of the identical pattern, one layer deeper.** From inside
one of Finding 8's own correctly-fixed registration-form clones, tapping
"Elegir producto" opens a separate, shared, un-cloned picker-sheet node
(`162:1674`) whose own "← Inventario" back-link still targeted `162:1485` —
the identical original trap, reached through a path Finding 8 never
touched. Given this was the fifth distinct discovery of the same
shared-node/wrong-back-link pattern in one night, Main requested a
comprehensive sweep rather than another one-off patch.

**Sweep result: 6 real leak instances found, all the same causal family.**
Beyond the picker sheet itself: `162:1687` ("Producto seleccionado" state),
`162:1700` ("Registrar mercancía — committed lines"), `188:1007` (Descartar
confirmation's own completion — worse than a back-link, a destructive
action landing in the trap), `184:1678` (Activar-clientes-frecuentes
confirmation — Finding 1's exact bug reappearing via a fourth side door),
`184:1684` (that action's own completion, landing a real state change in
the wrong-tier trap). Fixed with 28 new clones (one per instance per
applicable nfc origin), each rewired one hop back to its own live nfc
session frame, mirroring Finding 8's established pattern exactly. Two
deeper legacy nodes (`184:1665`/`184:1742`) found but deliberately left
unfixed — a disclosed proportionality question, same class as the
already-accepted exception #6 below, not silently absorbed.

**Verification.** Two dispatches were genuinely blocked by a disclosed
tool-access gap (`ReadMcpResourceTool` unavailable — `infrastructure-
decisions.md` ID001) and correctly refused to proceed rather than guess; a
third succeeded via the known local-plugin-cache-file fallback for loading
`figma-use`. `ux-critic` reviewed with elevated scrutiny: independently
derived and spot-checked 5 of the 28 clones (content-faithful, correctly
state-specific), confirmed the 6 original source nodes structurally
undisturbed, found the proportionality call on the two deferred nodes
credible, and — correctly — flagged that reaction-level wiring is outside
what its tools can see (the same standing ID004 limit hit at every round
tonight), recommending Main's live click-through as the actual closing
test. Main performed that click-through on the confirmed original
instance: `284:3540` → Inventario → its own registration-form clone →
"Elegir producto" → its own nfc-mode picker-sheet clone (correctly labeled,
correct product list) → "← Inventario" → back to `284:3540` — confirmed.
The other 27 clones weren't individually live-tested but follow the
identical, `ux-critic`-reviewed pattern.

**Six rounds, six genuine Blockers, one night** — dead-end trap, four
unfixed Settings triggers, a wrong sheet template silently dropping "Cerrar
sesión," a Session-controls-interlock bypass risking silent data loss, a
picker-sheet leak, and a six-instance comprehensive sweep. Every round was
surfaced by verifying the previous one rather than trusting it — the exact
chain of independent checks (`merchant-user-tester` experiences, `ux-critic`
reviews structure, Main click-verifies behavior, `reviewer` checks
Foundation consistency) this project's governance exists to run.

**Finding 9 (same night, immediate follow-up): the "▾" trigger on the other
nfc-mode frames still opened the old, unfixed sheet.** A second
`merchant-user-tester` re-walk confirmed the Inventario fix above worked
perfectly, then hit a sibling dead-end one hop later: 3 of the remaining 4
nfc-mode frames' own "▾" trigger (`284:3552` has none — deliberately, its
header was removed per §3.8f) still opened the *original* sheet chain
(`162:1526`→`184:1645`), reproducing Finding 1's exact original bug (wrong
plan-tier Settings) plus a fresh dead-end (that sheet's tab bar is inert,
only "Configuración"/"Cerrar sesión" work). Root cause: the original Fix 1
only ever rewired `284:3698`'s own trigger, never the other 4 — invisible
until Finding 2's tab-bar fix made all 5 frames mutually reachable.

**Fix, round 1:** `ui-designer` built 6 new clones (a sheet + a Settings-
content clone per origin, `284:3534`/`284:3540`/`284:3547`) rather than
sharing one — cloning the content frame too, not just the sheet, since
`284:3540` (with items in progress) sharing a back-link with any other
origin risked showing an empty tray on return, the same risk Finding 8
exists to prevent.

**Regression caught before reaching `reviewer`:** `ux-critic` found the 3
new sheet clones used the wrong template — `home.md` §3.6c's no-Session
shape (single "Configuración" button) instead of §3.7a's active-Session
shape (real session header + **both** "Cerrar sesión" and "Configuración,"
always reachable per §2's interlock). The old buggy sheet had actually
gotten this part right; fixing the Settings-tier bug silently dropped
"Cerrar sesión" from three mid-selling screens — confirmed against Main's
own click-through transcript, not just `ux-critic`'s structural read.

**Fix, round 2:** `ui-designer` rebuilt all 3 sheet clones from `162:1526`'s
own correct active-Session template, wired "Cerrar sesión" to the same
working destination (`162:1534`) `162:1526` already used, kept the 3
already-correct content clones untouched, deleted the 3 wrong clones after
confirming nothing else referenced them.

**Verification, final.** `ux-critic` re-reviewed: clean, 0 Blockers/Majors —
real session header + both rows confirmed present on all 3 by screenshot,
correct template lineage confirmed, wrong clones confirmed deleted, all
"must stay untouched" nodes confirmed unchanged. Main live-click-verified
the full chain on `284:3534`: ▾ → new sheet (both rows, real header) →
"Cerrar sesión" → `162:1534` (a real, working confirmation screen, not a
dead end) — confirmed; separately, "Configuración" → the already-correct
content clone — confirmed. Three rounds, three genuine Blockers, each
surfaced by verifying the previous round rather than trusting it — the
Experience Validation loop and the ux-critic/Main verification split both
did exactly what they exist to do here.

### 2026-08-06 (later) — Finding: buttons-only "Guardar mercancía" was silently hijacked by the NFC-chain build

A `merchant-user-tester` walk of "Empezar gratis," dispatched to independently verify a Product-Owner-reported discrepancy that a static wiring trace hadn't reproduced, found the real bug one hop past what that trace covered: on the buttons-only path, "Guardar mercancía" routed into the NFC tag-assignment queue (`284:526`) showing hardcoded "Pijama (10) · Sudadera (5) · Calcetines (20)" — none of it entered by Ana.

**Root cause, the same "shared node reused across the wrong context" pattern already documented repeatedly above.** `162:1723` ("Guardar — saving," explicitly named "*Journey 1: buttons-only*" in its own layer name) was the sole node the 2026-08-05 Connected NFC activation-to-sale chain build (below) reused for the NFC-tagging leg's own save step, silently overwriting its original destination (§3.12's confirmation, `162:1726`) with `284:526`. A full-page sweep found this wasn't an isolated instance: 9 more NFC-mode "Guardar mercancía" buttons across all 5 NFC-mode Home-origin clones funneled through the same hijacked node.

**Fix.** `ui-designer` cloned `162:1723` → `475:1925` for the NFC-tagging leg's own use (re-set its own `AFTER_TIMEOUT` to `284:526`, ID006 workaround applied), restored `162:1723`'s original reaction to `162:1726`, and rewired all 10 NFC-mode buttons (1 reported + 9 found in the sweep) to the new clone. Verified via independent fresh `node.reactions` readback: correct destinations on both sides, both legitimate buttons-only callers untouched, zero stray pointers either direction.

**Independently confirmed by Main via live click-through**, the full buttons-only path start to finish: Bienvenida → "Empezar gratis" → Todo listo → Home cold start → "Registrar mercancía" → picker → Pijama → "Guardar mercancía" → lands on `162:1726`, "J1 · 3.12 Post-save confirmation — buttons-only." No NFC step anywhere in this path — confirmed, not inferred.

**Two content-fidelity observations from that same live verification, both explicitly resolved as non-defects by the Product Owner, not fixed:** (1) `162:1726`'s content ("Pijama — 10 disponibles," "Sudadera/Maxy — 5 disponibles," "Calcetines — 20 disponibles") is static and doesn't reflect what was actually registered in this specific walkthrough (one Pijama). (2) The product picker (`162:1674`)'s three rows all `NAVIGATE` to the identical single destination (`162:1687`), whose Producto field is hardcoded "Pijama" regardless of which row is tapped — the same already-disclosed "one populated frame, not a full combinatorial matrix" limitation `inventory.md`'s own tracking file already records for the production page. **Product Owner ruling (2026-08-06), stated as a general standard for this fidelity tier, not just these two instances:** a Medium-Fidelity prototype exists to validate interaction flow, navigation, information architecture, and UX decisions — not dynamic application state. Static content is acceptable *as long as it doesn't contradict the selected journey or create confusion about business rules* (the NFC-routing defect fixed above was worth fixing precisely because it violated that bar — free tier reaching NFC content is a business-rule contradiction, not a static-content question). Neither of these two observations crosses that line, so neither is a defect; effort belongs in flow definition and prototype behavior, not building dynamic-looking variants that get thrown away once the real application exists. Closed, not deferred.

**One disclosed, unverified boundary, not chased further per the same proportionality standard above.** `ux-critic`'s structural review confirmed clone fidelity (`475:1925`) and content fidelity of all 10 rewired NFC-mode "Guardar mercancía" buttons, but reaction-level correctness — whether those 10 buttons' taps actually reach `475:1925`/`284:526` as intended — is outside what design-inspection tools can see (ID004); only 1 of the 10 chains (the buttons-only path) has been live-click-verified by Main. A follow-up attempt to verify one NFC-mode instance directly hit a separate, genuine tooling nuance: the "Adapt content for screen readers" accessibility setting does not persist across a direct node-id URL navigation the way it does across in-app clicks, producing an ambiguous, unreliable click result — not trusted as a finding either way. Not pursued further given the buttons-only path (the actual reported defect) is already confirmed fixed.

### 2026-08-05 — Connected NFC activation-to-sale chain (demo page)

The Product Owner identified a real gap: no path in the demo let you see "activate paid plan → activate NFC selling mode → register + tag a product via NFC → create an event → sell via NFC → see the result" as one continuous story — Journey 2 (production pages) started pre-configured, skipping activation entirely, and Journey 3's tagging flow never connected into an actual NFC sale. Considered and rejected a full demo restructure (~60-120+ frames, 4-6× the cost, real risk this close to the usability-testing deadline) in favor of one connected chain, scoped first (~12-18 frames estimated) then built.

**Built for less than estimated: 8 new clone frames, ~19 reaction writes**, spanning Settings → Inventario (NFC tagging) → Eventos → Home (NFC selling) → Resultados, all on demo page `160:2`. Lower counts than scoped because Leg 1 (Settings activation) was already fully built and wired from earlier work, and the session-controls sheet / post-venta-finalizada bridge turned out to be genuinely mode-agnostic and reusable rather than needing NFC-specific clones.

**New frames:** `284:526`/`284:535` (Inventario — Asignar tags queue + nfc-capable post-save confirmation), `284:3690` (Eventos — post-save confirmation routing to nfc-mode Home), `284:3698`/`284:3534`/`284:3540`/`284:3547`/`284:3552` (Home — evento activo entry through nfc selling through Finalizar Venta through success confirmation, mirroring the existing buttons-mode chain). Full 26/26-hop chain verified via fresh `node.reactions` readback, terminating cleanly at Resultados.

**Two disclosed deviations from the literal build brief, both improvements:**
1. Inventario's post-save routing was built spec-accurate (save → Asignar Tags queue directly → completion) rather than inventing an "Asignar tags →" CTA on `52:162`-equivalent that the approved spec doesn't actually put there (`inventory.md` §2 explicitly says saving auto-enters tagging, "no intermediate question asked").
2. **A real pre-existing bug was found and fixed as a byproduct:** the "post-venta-finalizada" bridge's "Ver detalle" button was routing into Eventos' event detail, not Resultados — introduced silently when the earlier §3.8e amendment inserted this bridge without reconnecting it. Fixed for both the nfc ending (this build) and, retroactively, the pre-existing buttons-mode ending — both now correctly converge on `162:2019` (Resultados' real session detail).

**Follow-up closed:** `284:3552` (and its production source `231:1920`) now both carry the full §3.8f "digital receipt" content (`SaleTotal`, `BrandMark`, `FutureRegistrationPlaceholder`, `MarginTapZone`) — built, and their exit destinations corrected to genuinely-empty-tray frames after a real Blocker was found and fixed (see `home.md` §3.8f's own status; `ux-critic`/`reviewer` cycle for the receipt rebuild tracked there, not duplicated here).

**One named, deliberate exception:** `284:526`'s "Terminar después" button still points to a production-only node (`47:65`) that doesn't exist on the demo page — a dead tap in Present mode, left unwired per this build's scoped-to-5-legs discipline rather than a full-coverage sweep. Not silently skipped — flagged for a future pass if it matters.

**Closed 2026-08-07**, as part of building the pending-tags task-priority refinement (`product/02-ux/inventory.md` §3.5/§3.17/§10). `ui-designer` cloned the rebuilt production pair (`47:38`/`47:65`) onto this demo page → `593:526`/`593:542`, and a navigation-axis clone of the existing nfc Registrar-Mercancía entry (`371:1138`) → `594:2659` for the "Registrar mercancía" leg. Wired: `284:534` ("Terminar después") → `593:542`; `593:542`'s "Continuar etiquetando" → `284:526` (resume); `593:542`'s "Registrar mercancía" → `594:2659`. Main live-verified the full chain end-to-end on a fresh browser page (see `company/infrastructure-decisions.md` ID013 — the first verification attempt produced a false negative from a stale, long-lived page, not a real defect): `284:526` → "Terminar después" → `593:542` (screenshot-confirmed correct hierarchy) → both "Continuar etiquetando" (→ `284:526`) and "Registrar mercancía" (→ `594:2659`) work. **Residual, disclosed and not chased (proportionality, same class as Finding 10):** `594:2659`'s own picker still carries an inherited back-link scoped to a different origin (`284:3698`), two levels deeper than this task's scope.

**Second gap found and closed same day, via `merchant-user-tester`'s validation run.** The bottom nav bar on `593:526`/`593:542` was completely unwired (all 4 items genuinely empty `reactions` — these two clones postdate the earlier 2026-08-07 tab-bar restoration sweep, so they never inherited it). `merchant-user-tester` hit this directly (three dead taps trying to "look around" mid-task); Main independently confirmed structurally (`take_snapshot` showed plain `StaticText`, not `link`). `ui-designer` wired both frames identically, sourcing destinations from the nearest already-correct sibling in the same NFC chain (`284:535`) rather than guessing: Hoy → `284:3698`, Inventario → `371:1249` (shared landing node, matching `284:535`'s own established convention — not a new self-reference), Eventos → `410:1879`, Resultados → `184:1536`. Fresh reactions readback confirmed all 8 correct and the two pre-existing buttons undisturbed. Main live-click-verified the Inventario leg on a fresh page: lands exactly on `371:1249` as reported. **One disclosed, non-blocking residual, inherited not introduced:** `371:1249`'s own back-link points to `284:3547` (its original NFC-Home origin), not back to the tag-queue screens that now also route through it — a merchant tapping Inventario then "back" lands in an unrelated Home session state. Pre-existing property of the shared node (already true for `284:535`'s prior use of it), same disclosed-simplification class as `594:2659`'s picker residual above — not chased further.

**`ux-critic` verified clean** — zero Blockers/Majors, both disclosed deviations confirmed correct, no wrong-mode content leaking anywhere (including the specifically-flagged `284:3540` "with items" nfc surface). One non-gating Minor: `162:2019`'s static content (date/ventas/total, inherited from the original Journey-1-Seamless build) doesn't numerically match this specific chain's own preceding "Día cerrado" numbers or Eventos' date range — the routing fix is structurally correct, the destination's content is just a pre-existing placeholder now reachable through a new path. Worth a content touch-up before a live demo of this exact chain, not blocking.

**`reviewer` clean** — no Blockers, both disclosed deviations confirmed correct against the approved specs, no side effects on the shared buttons-mode ending, no Foundation/ubiquitous-language drift. One Important finding raised and resolved as a false alarm: `284:3552` was being actively rebuilt by the concurrent §3.8f receipt-redesign work at the exact moment of review (caught mid-edit, two different structural reads seconds apart) — **this is why the line below was stale; see the corrected version**, confirmed once that separate build completed and was independently verified.

### 2026-08-07 — Full "Empezar gratis" demo-safety audit and repair (post-D31/D32)

Following D32's architectural conclusion (no canonical-journey artifact needed; the recurring leak pattern is a Medium-Fidelity node-classification gap, correctly closed by sharpening `ui-designer`'s caller-audit rule), the Product Owner asked for a separate, concrete pass: trace every reachable path from "Empezar gratis" to the end of that journey on the demo page and eliminate every unintended transition into NFC or another journey — explicitly a demo-quality request, not another architecture question, and explicitly scoped to *repair already-defined navigation only*, no redesign, no new destinations invented.

**Trace phase — four parallel, read-only passes, one per surface (Home, Inventario, Eventos, Selling+Resultados):**
- **Inventario** — fully clean. Also resolved a false lead from the initial (blocked) pass: the "missing cold-start frame" concern was wrong — the frame exists at `162:1485`, just wasn't discoverable by a name search.
- **Selling + Resultados** — no cross-journey leak. One real spec-conformance gap found and left unresolved (correctly, per scope): buttons mode has no session-close block state analogous to NFC's `21c` frames — closing mid-venta is silently allowed rather than blocked. Flagged for `ux-designer`, not fixed.
- **Eventos — one confirmed, real, multi-hop leak.** `162:1896` ("3.9a Guardar evento — silencioso")'s `AFTER_TIMEOUT` pointed to the NFC-twin `284:3690` instead of the buttons-only twin `162:1900`. A buttons-only merchant saving her first event could chain through `284:3690` → an NFC-mode Home (`284:3698`) → an NFC session (`284:3534`) → an NFC settings sheet (`360:1117`) → NFC inventory entry (`371:1138`), all via that screen's own tab bar. This is almost certainly the exact bug the Product Owner personally hit. Two smaller, confirmed-real spec gaps also found: "Cancelar evento" has no reachable entry point in this journey at all (no "Detalle — próximo" state exists to trigger it — the masters `10:15`/`10:16` are correctly unreachable, not leaking), and the persistent tab bar is dead on nearly every frame across all three of Home/Eventos/Selling-Resultados (not itself a leak, but a real "safe to hand to a user" gap the Product Owner explicitly asked to include).
- **Home** — no cross-journey leak, but two same-journey defects: the Configuración screen's back-link unconditionally returned to Cold Start regardless of which of (eventually confirmed) 9 distinct contexts opened it; and the same pervasive dead-tab-bar pattern.

**Two tooling notes from this phase, both resolved:** three of the four trace dispatches initially hit the same known `figma-use` skill-load gap (missing `ReadMcpResourceTool`/`ListMcpResourcesTool`) and correctly refused to fabricate a reaction map rather than guess — redispatched each with the already-documented local-plugin-cache fallback (`infrastructure-decisions.md` ID001), which resolved it every time. Separately, a request framed as "finalize your own last dispatch's recommendation" was correctly refused by a fresh `ui-designer` instance, which had no actual memory of proposing anything — a genuine, healthy catch of a false-continuity framing on Main's part, not a flaw in the agent; redispatched with honest framing ("Main relaying an earlier dispatch's finding") and it proceeded correctly.

**Fix phase:**
1. `162:1896`'s `AFTER_TIMEOUT` repointed `284:3690` → `162:1900` — the confirmed leak, closed. Live-click-verified by Main.
2. Configuración's back-link trap: `184:1645` cloned 9× (one per actual origin, not the 3 originally assumed), plus its two shared entry sheets (`184:1510` ×3, `162:1526` ×5) cloned on the navigation axis so each origin's Configuración now returns to its own correct source screen. A residual, deeper instance of the same trap (S3/S8/S19 sub-confirmations two levels in, ~20+ more nodes to fully close) was found and explicitly left unfixed as out of the named scope, not silently expanded into.
3. Tab bar restoration, all four surfaces: ~90 previously-dead Hoy/Inventario/Eventos/Resultados reactions wired to already-established canonical destinations (`162:1492`/`162:1661`/`162:1804`/`184:1536`), following the file's own pre-existing "omit the current section's own tab" convention (confirmed against `home.md`/`reports.md`'s `[Tab]` bracket notation, not invented). One frame (`198:823`, the digital receipt) correctly deviates per its own spec text (`home.md` §3.8f) — Hoy routes to `162:1500`, the spec's literal "plain §3.7, tray already empty," not the generic canonical.
4. **A real regression, caught before close-out, not after.** `ux-critic`'s structural review of the batch flagged that `162:1896` was the *sole* Eventos-save node on the page — meaning fixing the buttons-only leak by simple repoint, rather than cloning, plausibly orphaned the 2026-08-05 Connected NFC activation-to-sale chain's own path to `284:3690`. Verified true: `284:3690` had zero live callers after the fix. Investigation found the assumed "distinct NFC trigger" didn't exist (unlike the `162:1723`/mercancía precedent, where 10 already-distinct NFC buttons just needed rewiring) — the NFC cold-start's own "+ Nuevo evento" shared the *entire* form chain with buttons-only, not just the save step. Fixed correctly by cloning two nodes, not one: `162:1877` → `534:2220` (form) and `162:1896` → `534:2239` (saving state, → `284:3690`), with the NFC cold-start's trigger (`410:1883`) repointed to the new chain. `162:1810`/`1843`/`1877`/`1894`/`1896` (buttons-only) left completely untouched. Live-click-verified end to end by Main: NFC cold-start → new form clone → new saving clone → `284:3690`, exactly its original destination.
5. A second regression risk `ux-critic` flagged (whether the blanket tab-bar sweep touched the 5 NFC-mode Inventario self-clones Finding 8 built) was checked and confirmed a **false alarm** — all 5 still correctly point to their own `371:*` clones.

**Net result:** the one real cross-journey leak is closed and verified live twice (the fix itself, and that fixing it didn't break the other journey it was adjacent to). Two same-journey navigation defects (Configuración trap, dead tab bar) are repaired using only already-established destinations, no new design. Three genuine gaps were found and deliberately left open rather than fixed unilaterally: buttons-mode's missing session-close block state, "Cancelar evento"'s missing entry point, and Configuración's residual two-levels-deep trap — all named for `ux-designer`/Main, none silently absorbed into this pass.

### 2026-08-07 (continued) — Full demo-quality remediation: three deferred gaps closed, Premium/NFC journey revalidated

Direct follow-up to the entry above, at the Product Owner's request: resolve the three deferred gaps, revalidate the complete Premium/NFC journey without breaking the now-correct Free/buttons journey, and investigate four manually-observed inconsistencies without guessing at business intent.

**Grounding pass (`architect`), before any Figma work:** all seven items checked against `decision-log.md`/`domain-model.md`/the approved `02-ux` specs — every one resolved to either **Already Decided** (with exact citation) or **Build Defect** (spec already defines the correct behavior, something's just built wrong). No new Product/Business/Architecture Decision was required. Key findings: the "paid but no NFC kit yet" experience the Product Owner described is *already the designed behavior* (D27, `home.md` §3.6a's fourth variant, `settings.md`'s self-service `defaultSellingMode` control) — any demo path implying immediate NFC activation on payment is a build defect, not a missing decision. "Clientes frecuentes" being independently activatable regardless of plan tier is *correct* per D22/D25 (`loyaltyEnabled` is tier-independent; only the Resultados *display* requires paid tier) — not a business-rule inconsistency to fix. Mid-Session selling-mode reversion is never spec-sanctioned (`Session.operatingMode` is frozen for the Session's active lifecycle, D23); cross-Session reversion via NFC Readiness dropping is legitimate and designed. The buttons-mode session-close block state was never actually missing from the spec — `home.md` §3.11a is written mode-agnostically from the start; it just wasn't wired/reachable in buttons mode. Same for "Cancelar evento" — `events.md` §3.11 is fully defined, just unbuilt in this journey.

**Configuración residual trap (deferred gap #3), closed:** traced the actual scope first rather than assuming — all 9 origins reach all three flagged sub-screens (S3/S8/S19) identically, so the full 27-node ceiling (9 origins × 3 sub-screens) was genuinely needed, not the smaller scope initially guessed. All navigation-axis-cloned, each returning to its own correct origin.

**Premium/NFC journey trace (read-only, mirroring the buttons-only audit):** found the mechanism directly behind the Product Owner's "NFC falls back to buttons" observation — `188:1574` ("Cancelar venta actual" confirm), reached from the NFC selling screen's own Cancelar link, had never been cloned for its nfc caller and leaked every one of its own outgoing reactions (including declining the cancel) into buttons-only content. Five more leaks found in the same pass, including one inside *today's own new NFC-chain fix* (its Lugar/Tipo pickers routed into the buttons-only "seleccionado" frames instead of back to themselves) — confirming the same class of defect can reappear even in code written the same day if the two-axis classification isn't applied to every touched node, not just the one node a fix is nominally about. Two further state-inconsistencies found (a dead Hoy tab on the NFC receipt screen, asymmetric with its buttons-only twin; four shared plan-change confirmation screens hardcoding a single return destination regardless of which of 4 real origins reached them).

**All 8 NFC-surface defects + both remaining buttons-only gaps fixed**, same discipline throughout (caller-audit before every write, independent fresh readback after, reuse existing approved content, trace actual scope rather than assume it): the "Cancelar evento" fix reused the exact approved production content verbatim (including its "Plaza Toluca" example naming, a disclosed, deliberate decision not to content-diverge since it crosses no business-rule boundary — this project's own established bar per the 2026-08-06 static-content ruling); the session-close block state reused the already-approved production §3.11a frame directly, plus proactively wired a previously-dead "Entendido" button per the spec's own text rather than leaving a new dead end. One tooling mistake (three clones landing on the wrong page) was self-caught and corrected mid-fix, before it became a hidden problem.

**Closing verification, completed:** `ux-critic` structural pass and `reviewer` Foundation-consistency pass both clean (no Blockers, no Important findings) — every claim checked against actual spec text and actual Figma content, not just trusted reports. Main live-click-verified the highest-risk fix end to end (B1's "Cancelar venta actual" — the exact reproducible mechanism behind the Product Owner's own "NFC falls back to buttons" report — confirmed on the live prototype: the decline path now correctly returns to the NFC selling screen, not buttons-only).

**One Major finding from `ux-critic`'s pass, investigated and resolved as not-a-defect:** connecting the new "Cancelar evento" chain (EV1→EV4) for the first time exposed that EV4 (`554:4934`, §3.13's post-cancel ambient confirmation) shows only "Pasados: Plaza Metepec," with the journey's actual Activo "Plaza Norte" and Pasado "Ixtapan" both missing — read naively, this looks like cancelling one event silently removed two unrelated ones. Live-confirmed by Main via click-through. Routed to `ux-designer` for a formal spec-intent determination before treating it as a defect, per the Product Owner's own instruction not to guess. **Determination: not a defect.** `events.md` §3.13 has a direct structural sibling, §3.10 ("Post-save confirmation," same "ambient, returns to Events list" header pattern) — §3.10's own wireframe *also* shows only a minimal, self-contained example with no Activo/Pasados sections, despite saving a new Event obviously not erasing the rest of the list. This establishes the document's own established convention for this screen category: "ambient, returns to X list" screens are illustrated with a minimal example, not an exhaustive accumulated-state snapshot. §3.13 (and EV4) follows that same convention — it isn't a one-off gap, it's consistent with how this doc already treats every screen in this family. No fix needed; logged as the same accepted static-content category as this project's other disclosed limitations, not a state-continuity defect.

**Round fully closed.** Every confirmed defect from this pass (the original NFC leak and its regression, the Configuración trap at full depth, the dead tab bar, the session-close block state, "Cancelar evento" reachability, and all 8 NFC-surface leaks/inconsistencies) is fixed, independently verified via Figma readback, structurally reviewed, Foundation-consistency reviewed, and spot-checked live on the actual prototype. The one open narrative question was investigated on the evidence, not guessed at, and resolved without needing a fix. Both journeys — Free/Buttons ("Empezar gratis") and Premium/NFC — are clean.

### 2026-08-07 (same day, later) — Onboarding-native "Activar plan de pago" reconvergence: a sixth-ish distinct instance, found via `merchant-user-tester`'s pending-tags validation run

The above round closed every previously-known instance of the shared-node reconvergence pattern — but none of those rounds had ever traced the literal Onboarding-native path (`Bienvenida → "Activar plan de pago" → "Confirmar y activar" → "Todo listo" → "Empezar"`, landing on `184:1503`) end-to-end. `merchant-user-tester`, dispatched to validate the pending-tags task-priority fix, hit it directly: Configuración read "Tu plan: Gratis" after already completing activation, and "Guardar mercancía" produced the buttons-only confirmation with no tagging step offered.

**Root-caused via three independent investigations** (`architect`, `ux-designer`, `ui-designer`, each dispatched separately, no cross-visibility) at the Product Owner's explicit request, before any fix was proposed: `architect` confirmed the Foundation expects immediate, everywhere-consistent capability visibility with one narrow, named exception (an already-open Selling Session). `ux-designer` confirmed the approved specs say the same. `ui-designer` traced the actual build and found the literal defect: `184:34` ("Empezar," Variant B) correctly diverged from the Free path at the first hop (`184:1503` is its own clone), but one hop later silently reconverged onto the shared "Journey 1: buttons-only" subtree (`162:1661` family, `162:1492`, `524:1936`) — the exact two-axis-classification gap D32 already names, just a new instance of it.

**Fix 1 — Inventario/Configuración leg.** New content-cloned chain `651:2646`/`651:2659`/`651:2682`/`651:2695`/`651:2708` (nfc-capable Registrar Mercancía, content-cloned from the `371:1138` family), reusing the pre-existing `475:1925`→`284:526`→`284:535` saving/tagging/confirmation sequence rather than recloning it; new navigation-axis clone `651:5396` (paid Configuración). `184:1509;2:27` and `524:4635;2:27` (both frames' own Inventario-tab reactions) repointed `162:1661` → `651:2646`; `524:4634` (Configuración button) repointed `524:1950` → `651:5396`.

**Fix 2 — "Iniciar Sesión Rápida" leg**, found and fixed the same day after the Product Owner explicitly authorized including it in the same pass (same defect class, `184:1507` → `162:1500`'s shared buttons-mode hub → its own Configuración chain, also reading "Gratis"). New navigation-axis clones `658:2766` (hub, clone of `162:1500`), `658:2777` (session sheet, clone of `524:4701`), `658:2785` (paid Configuración, content template `184:1665` — buttons-mode, not `184:1713`'s nfc-mode, since this hub is buttons-mode). `184:1507` repointed `162:1500` → `658:2766`.

**Verification, both fixes:** `ux-critic` clean (zero Blockers/Majors/Minors on first pass; confirmed Free-path non-regression via direct screenshot comparison of `162:1661`/`524:1936`/`524:1964`, confirmed correct two-axis classification, confirmed the two fixes' differing Configuración content — "Con tags" vs. "Botones" — was consistent with each hub's own selling mode). Main live-click-verified both full chains end-to-end on fresh pages, screenshots matching.

**`reviewer` caught a real Blocker on the first pass, not a false alarm:** `651:5396` showed "Cómo vendes normalmente: Con tags" — content cloned verbatim from `184:1713`, but wrong for this specific context. `onboarding.md` §2.3/`decision-log.md` D27 are explicit that `defaultSellingMode` stays `buttons` unconditionally right after either onboarding path — a genuinely separate field from `nfc ∈ registrationMode` (the capability gate correctly making Inventario's tagging step available immediately, which is why the rest of the chain routing into tagging was and remains correct). Content faithful to its clone *source* isn't the same as content correct for its *new context* — exactly the risk D32 names. **Fixed:** `651:5396`'s displayed value and toggle-button label corrected to "Botones"/"Cambiar a vender con tags," matching `658:2785`. `ui-designer` also caught and fixed a secondary consequence in the same pass: the toggle button's own reaction still pointed at the old "Con tags" confirmation destination, which would have become a fresh label/destination mismatch — retargeted to the correct "Botones" confirmation (`184:1686`), joining its three legitimate sibling callers; the original destination's one remaining legitimate caller (`184:1725`) untouched. `reviewer` also caught a real documentation gap: neither fix had a tracking-file or bitácora entry before reaching review — this entry closes that gap.

Main live-verified the corrected `651:5396` on a fresh page: "Tu plan: Pago" / "Cómo vendes normalmente: Botones" / "Cambiar a vender con tags," matching `658:2785` exactly.

**One tooling-verification lesson from this same investigation:** the first attempt to reproduce the original Home-tab-bar-dead-link report (before root-causing the real defect above) turned out to be a false positive from a stale, long-lived browser page — see `company/infrastructure-decisions.md` ID013. Retracted explicitly rather than left standing.

Re-review (`ux-critic`/`reviewer` on the corrected `651:5396`) and a `merchant-user-tester` walk of the paid journey specifically are the remaining steps before this closes.

**Closing regression, found by that same `merchant-user-tester` walk, treated as part of this workstream rather than a separate item.** The chain's "← Inventario" back-links and Descartar-confirmation target (`651:2648`/`651:2661`/`651:2697`/`651:2718`) had all been retargeted to `184:1503` (Home Idle) during the original fix — correct for the tier-consistency defect, wrong destination class for links labeled "Inventario." Independently confirmed by both `merchant-user-tester` and Main's own live click.

**Fix, round 1.** No existing Inventario cold-start clone was reachable on this page (two name-plausible candidates, `162:1485` and `579:2538`, both turned out on content inspection to actually be *Home's* cold start, not Inventario's — verified by content, not name, before reuse). Cloned the approved production frame `45:27` (`inventory.md` §3.3) → new node `668:526`, content verbatim. Retargeted `651:2648`/`651:2661`/`651:2697`/`651:2718` → `668:526`. One necessary hygiene fix on the new clone itself: its cloned "Registrar mercancía" CTA carried a production-only destination (`48:58`) that doesn't exist on this page — retargeted to `651:2646` (this chain's own entry).

**`ux-critic` caught a real Major finding in round 1:** `651:2718` ("Sí, descartar") had been swept into the same retarget as the three genuine "← Inventario" links, but per `inventory.md` §3.9, discarding a draft should return to a **blank Registrar Mercancía form** (§3.6), not the Inventario Catalog tab — a different destination class, already correctly implemented elsewhere in this same file for the identical button type (production `50:648`→`48:58`). **Fix, round 2:** `651:2718` retargeted `668:526` → `651:2646` (this chain's own blank entry, already existed, no new clone needed). Main live-verified: "Sí, descartar" now lands exactly on `651:2646`.

Content fidelity, scope discipline, and two-axis conformance on round 1 were all otherwise confirmed clean by `ux-critic`. Round-2 re-verified clean by `ux-critic`; Main independently live-verified both hops on fresh pages (`651:2695`→"← Inventario"→`668:526`, `651:2708`→"Sí, descartar"→`651:2646`). **`reviewer`'s final sign-off: clean, no Blockers, no Important findings** — independently re-checked `668:526` against `inventory.md` §3.3, `651:2718`'s corrected destination against §3.9's literal text, cross-document consistency with the established `50:648`→`48:58` precedent, and this tracking entry's own accuracy against live node content. **The "Onboarding-native 'Activar plan de pago' reconvergence" workstream is fully closed** — built, reviewed, Foundation-checked, and behaviorally validated by `merchant-user-tester` on the actual paid journey.
