# Hoy (Home) — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/home.md`, Approved — amended for `decision-log.md` D23, `settings.md` §2.1 (Configuración entry point), and `decision-log.md` D27 (NFC capability correction). Medium-Fidelity work reflects the D23 + settings.md §2.1 amendments as of this update; **the D27 amendment's fourth §3.6a variant is not yet built in Figma — see Known gaps.**

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4` ("Nahui — Medium-Fidelity UI"), page **"Hoy — Medium Fidelity"** (`35:2`). All 24 `home.md` §5 states now covered:

| Frame | home.md state |
|---|---|
| `35:3` | §3.1 Resolving — near-instant |
| `35:17` | §3.2 Resolving — slow |
| `35:261` | §3.3 Cold start — sin productos (header carries "▾") |
| `36:29` | §3.4 Idle — sin evento, listo (header carries "▾") |
| `36:44` | §3.5 Idle — evento próximo (header carries "▾"; `EventCard` shows "Plaza Norte," D20 fix applied) |
| `36:61` | §3.6 Evento activo, sin sesión (header carries "▾") |
| `36:309` | §3.6a Limited Ready, override (header carries "▾") |
| `36:327` | §3.6a Not Ready, mención (header carries "▾") |
| `36:345` | §3.6a Capacidad revocada, mención (header carries "▾"; "Ir a Configuración" link) |
| `93:324` | §3.6a Ready-but-`buttons`-default, tags now sufficient — discoverability nudge (new, D27) |
| `84:315` | §3.6c Session-controls sheet — Configuración only (new, `settings.md` §2.1) |
| `36:361` | §3.7a Session controls sheet — now two rows: "Cerrar sesión" + "Configuración" |
| `37:100` | §3.8 Venta en curso |
| `39:122` | §3.8a falla de sync, marcador |
| `39:154` | §3.8a ítem marcado — error inline |
| `41:167` | §3.8b Cancelar venta actual — confirm |
| `41:436` | §3.8c Finalizar Venta — instantáneo |
| `41:453` | §3.8c Finalizar Venta — lento |
| `41:470` | §3.8d Finalizar Venta — error |
| `192:382` | §3.8e Finalizar Venta — éxito, confirmación ambiental (new, 2026-08-04) |
| `41:496` | §3.9 Modo botones, estado 8 |
| `41:527` | §3.10 Modo nfc, estado 8 |
| `41:548` | §3.11 Cerrar sesión — confirmación |
| `41:573` | §3.11a Cerrar sesión bloqueado |
| `41:595` | §3.12 Día cerrado |
| `41:611` | §3.14 Resolución — fallback defensivo |

§3.13's two Resuming-a-Session variants have no separate frame by design — `home.md` itself states they're "pixel-for-pixel identical" to §3.7/§3.9/§3.10 (frames `41:496`/`41:527`) and §3.8 (`37:100`). No coverage gap.

Shared Design System page: `0:1`. New components built this pass: `SessionHeader` (`33:2`), `VentaActualTray` (`34:14`, states Vacia/ConItems/ConItemsSyncFail), `ProductTile` (`34:252`, states Default/SoldOut), `NFCScanPrompt` (`34:253`). Reused: `Button` (incl. the `events.md`-established Destructive variant), `NavBar`, `EventCard`.

## 3. Review status per screen
Full cycle for the original 23-frame D23-amended build: `ui-designer` build → `ux-critic` review (0 Blockers, 0 Major; 3 Minor + 1 Suggestion, non-gating) → `reviewer` Foundation-consistency pass, round 1 (0 Blockers, 1 Important finding: SessionHeader compound "Bazar Plaza Norte" string contradicting `decision-log.md` D20) → fix applied at both layers → `reviewer` re-verification: **0 Blockers, 0 Important findings — clean.**

**`settings.md` §2.1 entry-point amendment** (header "▾" on all four non-Session states + three §3.6a variants, second sheet row on `36:361`, new sheet `84:315`) — built, verification confirmed all of it present and correct by direct frame inspection (`get_metadata`/`get_screenshot` on all named frames above), though the completion was never formally reported at the time. **No `ux-critic`/`reviewer` pass has been run on this specific amendment yet** — recommend one before treating it as fully closed, even though direct inspection found it correct.

**D27 amendment (fourth §3.6a variant, discoverability nudge) and the stale `EventCard` D20 instance** — both built/fixed. Frame `93:324` built by cloning `36:345`; `36:44`'s `EventCard` instance override corrected to "Plaza Norte." Built without the mandatory `figma-use` skill loaded (disclosed upfront, per `company/infrastructure-decisions.md` ID001's addendum) — `ux-critic` ran an elevated-scrutiny independent verification pass rather than trusting the self-report, including a full file-wide re-sweep of every `EventCard` instance across Eventos/Resultados (not just the one flagged frame). **Result: both fixes confirmed correct on direct inspection. 0 Blockers, 0 Major.** One new Minor found (HOME-FIGMA-D27-MIN1, below). Folded back into done.

## 4. Deviations from the upstream spec
None introduced by `ui-designer` in the original build — the one Important finding was the Medium-Fidelity build faithfully reproducing a string that was already stale in the Low-Fidelity spec relative to D20, not a deviation introduced during that build.

## Prototype-only clone frames (not new spec states)
The 2026-08-03 clickable-prototype reorganization added three clones for Journey 2 ("Existing NFC merchant")'s own reaction chain, distinct from Journey 1's use of the originals: `111:1085` (clone of `36:61`, §3.6 Evento activo — sin sesión), `112:1100` (clone of `37:100`, §3.8 Venta en curso — buttons-mode content, **later found wrong for this context and replaced, see below**), `112:1110` (clone of `41:436`, §3.8c Finalizar Venta — instantáneo). No new content beyond §3.8's own text; duplicated only because Figma reactions are one-destination-per-node. Not new `home.md` §5 states; not counted in the 24-state total above.

**Real content gap found and fixed, same day.** `ux-critic` caught that `41:527`'s `NFCScanPrompt` routed to `112:1100` — which still showed the full buttons-mode `ProductTile` grid, directly contradicting §3.7/§3.10's explicit "one mode, never re-evaluated mid-Session, no product grid at all in nfc mode" rule. Root cause: no Medium-Fidelity frame had ever been built for "nfc mode, 1+ items already in Venta actual" — the low-fi spec never draws this exact combination as its own numbered state, but it's an unambiguous composition of §3.8's with-items shell and §3.10's grid-free registration zone. Fixed: new frame **`114:377`** ("Venta en curso — modo nfc, con items," §3.7/§3.8/§3.10) built by cloning `112:1100`, removing all `ProductTile` instances, and inserting the same `NFCScanPrompt` instance already used on `41:527` — zero product grid anywhere, screenshot-confirmed. `41:527`'s `NFCScanPrompt` reaction rewired to `114:377`; `112:1100` (the wrong clone) deleted after confirming nothing else referenced it. **`ux-critic` independently re-verified: clean, 0 Blockers/Major/Minor** — `114:377` confirmed grid-free with correct tray/scan-prompt/Finalizar-Venta content, `112:1100` confirmed deleted with no dangling references anywhere on the page, `114:377`→`112:1110` (Journey-2-specific saving frame, not Journey 1's) confirmed correctly scoped, Journeys 1 (`37:100`'s grid untouched) and 3 confirmed unaffected. **The reorganized 3-journey prototype is now demo-ready.**

**Open item, not resolved (flagged by `ui-designer`, not a redesign call to make silently):** buttons-mode's own "add another item" interaction has no wired loop-back reaction either (all `ProductTile` instances on `37:100` have empty `.reactions` — the "loop" is implicit, since the grid already lives on the same with-items frame). The literal NFC equivalent (a self-referencing `NFCScanPrompt` reaction) is rejected by Figma's Plugin API ("destinations must be a different top-level frame"). So `114:377` has no "scan again" click-through either, matching buttons mode's own unwired precedent rather than inventing a workaround (e.g. a duplicate twin frame) unilaterally. If a real "tap to add a second NFC item" demo moment matters, that's a design call for `ux-designer`/Product Owner, not something to default into.

## Product Validation Sprint — usability fixes (2026-08-03)

`ux-critic`'s usability audit (distinct from all prior Foundation-consistency/build-fidelity passes — a first-time-user heuristic evaluation) found two priority issues on this document's screens, since fixed:

- **SessionHeader "▾" arrow — fixed.** The active-selling header's session-controls trigger (`33:5`, inside the `SessionHeader` master `33:2`) was built at 6×24px — roughly a quarter the size of the identical control on Home's pre-session screens (24×30px) — making it near-invisible and putting the only path to "Cerrar sesión"/"Configuración" while actively selling at real risk of never being found. Fixed at the component-master level: resized to 24×24px, fontSize 20, right-aligned — verified by node-level readback (not just screenshot) on all 9 in-session frames using `SessionHeader` (`37:100`, `41:436`, `41:453`, `41:470`, `41:496`, `41:527`, `41:548`, `41:573`, `114:377`). Cascaded cleanly, no per-instance overrides found blocking it.
- **Wordmark alignment — fixed.** Cold-start's outlier (`35:263`, was left-aligned) corrected to match the centered treatment used by every sibling non-Session state — no longer a known gap.
- **Quantity field placeholder — fixed alongside Inventario's own fix** (see `inventory.md`'s tracking file) — the literal "0" placeholder on Registrar Mercancía's Cantidad field (shared pattern, this doc's own instances too) replaced with an en dash, no longer ambiguous as "already has a value."

**`ux-critic` independently verified: clean, 0 Blockers/Major.** Arrow fix confirmed at the pixel level (rendered ink now comparably sized to the pre-session arrow, cascade confirmed on 4 of 9 instances with no blocking overrides). NFC icon, wordmark, and quantity-field fixes all confirmed. One disclosed, not-a-defect caveat: reaction *wiring* on the picker-row fixes (see `events.md`/`inventory.md`) is outside `ux-critic`'s tool scope to verify directly (same limitation as `company/infrastructure-decisions.md` ID004) — `ui-designer`'s own reaction-readback self-verification is the evidence for that piece; a quick manual Present-mode click-through is recommended before a live demo, same standing caveat as ever with this class of fix.

**New §3.8e frame (2026-08-04, Product Owner-raised HOME-Q1 amendment).** Built by cloning `41:496`, inserting a real `AmbientToast` (kind=Success) instance reused from the Design System, no new visual treatment. `41:436` rewired `AFTER_TIMEOUT`→`192:382` (was `41:496`); fresh reaction readback confirmed. Demo-page clone `198:823` (cross-page clone of `192:382` per `infrastructure-decisions.md` ID006), inserted between `162:1521` and `162:1526`, with nested session-controls-arrow and ProductTile reactions re-targeted to the demo's own local destinations (`162:1526`, `162:1511`); `162:1521` rewired `AFTER_TIMEOUT`→`198:823`, fresh readback confirmed. Both exhaustively checked against every other node still pointing at the old destinations (`41:496`/`162:1500`) — all confirmed correctly unrelated to the Finalizar-Venta-success path (Session-start entries, Cerrar-sesión-cancel, Cancelar-venta-actual-confirm).

## Known gaps (tracked, not blocking unless noted)
- **HOME-FIGMA-D27-MIN1** — frame `93:324`'s "Ir a Configuración" button sits 30px below its mention text (vs. 10px on its clone source, `36:345`) — an unexplained 20px spacing inconsistency, not matching the layout-compensation math the builder's report claimed. Nothing is clipped or illegible; purely a consistency nit across the four §3.6a sibling variants. One-line fix when next touched: move node `93:331` from y=472 to y=452.
- **`settings.md` §2.1 amendment still lacks its own formal `ux-critic`/`reviewer` cycle** — direct inspection (by the entry-point verification pass) found it correct, but no formal review record exists for it specifically, unlike every other amendment this document has been through.
- **Minor findings from `ux-critic`** (non-gating, tracked for a later batch):
  - Session-controls sheet (`36:361`) lacks the bounded Card wrapper the other two dimmed-sheet states (`41:548`, `41:573`) use — also noted as present on the new `84:315` sheet, per `settings.md`'s own tracking file M2 finding (same inherited pattern).
  - Coral-as-text-color (Tertiary/link buttons: "Cancelar," "Asignar tags," etc.) — **resolved via Q12**, now Coral AA+, confirmed passing AA.
  - Suggestion: confirm whether "Ver detalle" (`41:595`) using a Secondary/outlined treatment instead of Primary is a deliberate "calm, not urgent" choice or an unintentional divergence from this doc's otherwise-consistent sole-CTA pattern.
- **NavBar contrast**: `active=Hoy`, `active=Inventario`, and `active=Eventos` are all now correctly rebound to `color/tezontle-dark`. Only `active=Resultados` remains unfixed — apply the same fix when `reports.md`'s Medium-Fidelity work starts.
- **NavBar/brand-guide.md drift, flagged for `reviewer`/`architect`, not a UX-quality finding.** `ux-critic`'s Q12 verification noticed NavBar's active-tab color renders as `color/tezontle-dark` (deep maroon), but `brand-guide.md`'s own "Bottom navigation" line still says "active item highlighted in Coral." This predates Q12 and wasn't introduced by it — the NavBar fix was applied for contrast reasons earlier this session without the brand-guide text being updated to match. Needs a one-line `brand-guide.md` correction, not a design change.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's 16 Primary + 6 Tertiary instances (`ux-critic`'s independent height-based sweep found 6, not the 5 the build report claimed — all 6 confirmed correctly colored regardless; see `company/infrastructure-decisions.md` ID001 addendum, Q12-VERIFY-MIN1). `ux-critic` verified clean — no wrong-colored instances found anywhere.
