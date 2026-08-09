# Onboarding — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/onboarding.md`, Approved; amended for `decision-log.md` D27 (NFC capability corrected to derive from `subscriptionTier`, not kit/code activation). Medium-Fidelity work reflects that current, D27-amended state as of this rebuild.

**Amended 2026-08-08 for the Day-0 "Define lo que vendes" move (`decision-log.md` D33, `company/bitacora.md` 2026-08-08).** The upstream spec gained new §2.2a/§3.5b-§3.5e (Selling-Group capture — Producto/Precio — moved out of `inventory.md`'s inline flow into a required Onboarding step on both real paths). This build (below) realizes that step in Figma.

**Amended 2026-08-09 (overnight autonomous session) for the business-identity amendment (`decision-log.md` D36, §2.2b/§3.9-§3.10a, "Tu negocio" — Business.name/logo/description capture).** Now built and fully wired in Medium-Fidelity — see the new frame table below.

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4` ("Nahui — Medium-Fidelity UI"), page **"Onboarding — Medium Fidelity"** (`67:2`). All 12 `onboarding.md` §5 states covered across 12 frames (renumbered/reduced from 14 states/15 frames — the retired "Activar kit NFC" code-entry/validating/invalid sub-states are gone):

| Frame | onboarding.md state |
|---|---|
| `67:3` | §3.1 Resolving — near-instant |
| `67:4` | §3.2 Resolving — slow |
| `68:4` | §3.3 Bienvenida + Elegir cómo empezar |
| `88:1006` | §3.4 Activar plan de pago — confirmar antes de continuar |
| `70:954` | §3.4c Ver un ejemplo — confirmar antes de continuar |
| `71:34` | §3.5 Creando tu negocio — near-instant |
| `71:38` | §3.5 Creando tu negocio — slow |
| `71:40` | §3.5a Creando tu negocio — error |
| `71:955` | §3.6 Todo listo — Variant A (Empezar gratis) |
| `71:960` | §3.6 Todo listo — Variant B (Activar plan de pago) |
| `71:965` | §3.6 Todo listo — Variant C (Ver un ejemplo) |
| `71:970` | §3.8 Falla defensiva |

**Added 2026-08-08 — "Define lo que vendes" (D33 Day-0 move), real paths only. Node-state mapping confirmed directly against live Figma metadata (`get_metadata` on page `67:2`), not inferred from the build report:**

| Frame | onboarding.md state |
|---|---|
| `732:29` | §3.5b Define lo que vendes — entry (Empezar gratis) |
| `732:5427` | §3.5c Define lo que vendes — con líneas agregadas (Empezar gratis) |
| `732:5448` | §3.5d Guardando lo que vendes — near-instant (Empezar gratis) |
| `732:5452` | §3.5d Guardando lo que vendes — slow (Empezar gratis) |
| `732:5454` | §3.5e Guardando lo que vendes — error (Empezar gratis) |

**Activar plan de pago's own copy of the entry/con-líneas/near-instant states** — nav-diverge clones, per `decision-log.md` D32's mandatory two-axis classification (content-identical, navigation-not-identical: this path must return to `88:1006`'s own downstream chain, not "Empezar gratis"'s):

| Frame | onboarding.md state |
|---|---|
| `732:5460` | §3.5b Define lo que vendes — entry (Activar plan de pago) [nav-diverge] |
| `732:5471` | §3.5c Define lo que vendes — con líneas agregadas (Activar plan de pago) [nav-diverge] |
| `732:5490` | §3.5d Guardando lo que vendes — near-instant (Activar plan de pago) [nav-diverge] |

No separate slow/error clones exist for the Activar plan de pago path — a real, disclosed coverage gap (only the happy near-instant save state is wired for this path's own copy), not an oversight: those states are visually identical to their Empezar gratis counterparts and add no new content, deprioritized the same way other same-content clone gaps are elsewhere in this file. Confirmed live: this path's chain terminates at `71:960` (Todo listo — Variant B), not `71:955` (Variant A) — verified by Main via a fresh `chrome-devtools-mcp` click-through of the full path, not inferred from static structure.

**Added 2026-08-09 (overnight autonomous session) — "Tu negocio" business-identity capture (D36), real paths only. Node-state mapping confirmed directly against live Figma metadata:**

| Frame | onboarding.md state |
|---|---|
| `763:48` | §3.9 Tu negocio — entry (Empezar gratis) |
| `763:50` | §3.9a Tu negocio — con logo seleccionado (Empezar gratis) |
| `763:52` | §3.9 inline failure — logo no se pudo mostrar (Empezar gratis) |
| `763:53` | §3.10 Guardando tu negocio — near-instant (Empezar gratis) |
| `763:55` | §3.10 Guardando tu negocio — slow (shared copy) |
| `763:56` | §3.10a Guardando tu negocio — error (Empezar gratis) |

**Activar plan de pago's own copy of the entry/con-logo/near-instant states** — nav-diverge clones, same D32 two-axis rationale as "Define lo que vendes"'s own clone set above:

| Frame | onboarding.md state |
|---|---|
| `764:5706` | §3.9 Tu negocio — entry (Activar plan de pago) [nav-diverge] |
| `764:5739` | §3.9a Tu negocio — con logo seleccionado (Activar plan de pago) [nav-diverge] |
| `764:5783` | §3.10 Guardando tu negocio — near-instant (Activar plan de pago) [nav-diverge] |

No separate slow/error clones for the Activar plan de pago path here either — same disclosed, deprioritized gap as "Define lo que vendes"'s own clone set.

**Build history, disclosed for accuracy:** most of these 9 frames already existed with spec-accurate content from an earlier build pass. This session's actual contribution was wiring — none of the 9 frames had any reactions before tonight, and the two upstream "Creando tu negocio" success frames (`111:20`, `71:34`) previously routed straight past this step into "Define lo que vendes," dead-ending it — plus one content fix: the error state's "Reintentar" button (`763:56`) used the wrong Button variant (Tertiary instead of Primary, inconsistent with every other Reintentar button on this page) and a width mismatch after the variant swap; both corrected. Two-axis caller audit performed before rewiring `111:20`/`71:34`: each had exactly one existing caller, confirmed via a full-page reaction sweep, so redirecting their outgoing reaction was safe.

**Wiring completed:** `111:20` (Empezar gratis) AFTER_TIMEOUT → `763:48` (was: `732:29`); `71:34` (Activar plan de pago, shared frame) AFTER_TIMEOUT → `764:5706` (was: `732:5460`); `763:48`/`764:5706` Continuar → `763:53`/`764:5783`; Subir logo → `763:50`/`764:5739`; `763:50`/`764:5739` Continuar → `763:53`/`764:5783`; `763:53` AFTER_TIMEOUT → `732:29` (Define lo que vendes); `764:5783` AFTER_TIMEOUT → `732:5460` (Define lo que vendes, Activar plan de pago copy). `763:52` (inline logo-failure) and `763:56`'s Cambiar/Quitar/Reintentar controls deliberately left unwired-into, matching this page's own documented "not wired: every error/slow/fallback state" convention.

State 11 (resume-after-interruption) has no separate frame by spec-mandated design — `onboarding.md` itself states it's pixel-identical to states 3-8.

**Amended for D27:** removed `69:924` (§3.4 code-entry), `70:16`/`70:25` (§3.4a validando), `70:938` (§3.4b código inválido) — the retired activation-code mechanism. Added `88:1006` (new §3.4, "Activar plan de pago," a bare payment-confirmation screen, no input field). Updated `71:960`'s copy (no longer promises automatic tag-selling) and `68:4`'s path-choice subtext/button label. Also fixed a stale cross-reference in `70:954` (§3.4c) found during the rebuild's own spec cross-check, not part of the original diff. The `CodeEntry` component (`69:2`, Design System page) is no longer referenced by this page but was left defined, since `settings.md`'s parallel Figma rebuild may still use it — confirm before deleting.

Shared Design System page: `0:1`. No NavBar on any frame in this document — the one explicit, spec-mandated deviation from every other Medium-Fidelity document in this phase (Onboarding precedes all four tabs, per `information-architecture.md`).

## 3. Review status per screen
Full cycle complete for the pre-D27 build: `ui-designer` build → `ux-critic` review (0 Blockers, 0 Major; 2 Minor + 1 Suggestion, non-gating) → `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean.** Fifth document to complete the Medium-Fidelity tier. **D27 rebuild (this amendment)** — `ux-critic` verification: **clean, 0 Blockers, 0 Major** (1 Minor — tracking-file staleness, this file, now corrected). `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean** (1 non-blocking wording suggestion — §3.6 Variant B's "activa" → "cambia" word choice — applied to `product/02-ux/onboarding.md`). Folded back into done.

**"Define lo que vendes" build (2026-08-08, D33 Day-0 move).** `ui-designer` build (8 new frames, above) → `ux-critic` review across 2 rounds as part of the combined Steps 2/3/4 Medium-Fidelity build spanning this page plus `inventory.md`/`events.md` (round 1: 3 Major + 2 Minor found, none scoped to this page's own frames — see `inventory.md`/`events.md` for the findings themselves; round 2 verification: clean) → `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean** (spot-checked the full Onboarding subtree on `67:2` directly). Main independently live-verified the Activar-plan-de-pago nav-diverge chain's destination via `chrome-devtools-mcp` (terminates correctly at `71:960`). Folded into done.

**"Tu negocio" business-identity build (2026-08-09, overnight autonomous session, D36).** `ui-designer` build (9 frames + full wiring, above) — self-verified via live `get_metadata`. `ux-critic` round 1: 1 Major (`ONB-TN-MAJ1`: §3.10a's error heading used plain color instead of Error red, inconsistent with its own document siblings §3.5a/§3.5e) + 1 Minor (`ONB-TN-MIN1`: Cambiar/Quitar tap targets sat closer together than this document's other accepted instances) — both fixed: `764:5777` rebound to the `color/error` variable matching `732:5454`'s exact treatment; Quitar shifted 8px to widen the gap to the `spacing/16` token, applied to both journey clones.

`ux-critic` also named two wiring boundaries its tools can't see — both independently verified by `ui-designer` via fresh `node.reactions` readback: (1) full chain routing (`111:20`→`763:48`, `71:34`→`764:5706`, `763:53`→`732:29`, `764:5783`→`732:5460`) — all four confirmed correct, no fixes needed; (2) the shared §3.10a error frame's Reintentar hijack risk — turned out moot: `763:56`'s Reintentar has zero reactions, and a full-page sweep confirmed all three error frames in this document (§3.5a, §3.5e, §3.10a) are consistently unwired into the click-through demo — a disclosed, intentional convention (error states as static reference screens), not a defect. **Known gap, named not fixed:** unlike Empezar gratis's full near-instant/slow/error triad, the Activar-plan-de-pago path has no dedicated slow/error clone at all for this step — `763:56` is explicitly layer-named "(Empezar gratis)," a hard clone-don't-reuse signal for whenever this path's error case gets wired up. `ux-critic` verification pass: **clean, 0 Blockers/Major/Minor** — error-red match confirmed via direct screenshot pixel comparison against `71:40`/`732:5454` (not just variable-binding inheritance), widened Cambiar/Quitar gap confirmed on both journey clones with no new overlap, full fresh sweep of all 9 frames found nothing new. `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean.** Copy verified verbatim across all 9 frames including all three prior remediation fixes (narrowed intro, honest Descripción caption, dropped redundant §3.9a line, illustrative error-state value, error-red heading, Primary-variant Reintentar). `Business.name`-only gating on Continuar confirmed as far as static frames allow (correlates correctly across all three examined states); the stronger claim — genuinely Nombre-only vs. accidentally requiring all three fields — is named an open boundary no static Figma frame can prove, consistent with `infrastructure-decisions.md` ID004, not a defect. Full wiring chain and the Activar-plan-de-pago clone gap both re-confirmed as accurately disclosed, not independently re-derivable by `reviewer`'s own toolset (ID004). **Done — sixth document to complete the Medium-Fidelity tier.**

## 4. Deviations from the upstream spec
None.

## Prototype-only clone frames (not new spec states)
The 2026-08-03 clickable-prototype reorganization added `111:20`, a clone of `71:34` (§3.5 Creando tu negocio — near-instant), used solely to give Journey 1 ("First-time merchant") its own reaction chain distinct from the "Activar plan de pago" journey sharing the original `71:34`. No new content — same state, same copy, duplicated only because Figma reactions are one-destination-per-node. Not a new `onboarding.md` §5 state; not counted in the 12-state total above.

## Known gaps (tracked, not blocking)
- **Tap-target shortfall, three Tertiary-variant escape hatches + one link.** `88:1012` ("Mejor quiero empezar gratis" — replaces the retired `69:939`/`70:952`, D27 rebuild), `70:962` ("Mejor quiero registrar mi negocio real"), and `68:13` ("Ver un ejemplo") are all 40px tall — below the ~44-48px minimum this design system otherwise aims for. Judged Minor, not Major (unlike `inventory.md`'s/`reports.md`'s prior Major tap-target findings): each instance is full/near-full row width, well-buffered from adjacent elements, and reached at most once ever per `onboarding.md` §1's own framing — not a repeated daily interaction. Root cause is the shared `Tertiary` component's own 40px master height, a Design System property, not something this document introduced independently. Worth tightening for consistency; three instances of the same shortfall in one document is a real pattern.
- **Error-color inconsistency — in remediation.** `onboarding.md`'s and `inventory.md`'s tab-level fallback screens use plain gray text; `home.md`'s and `events.md`'s do too — gray is actually the dominant pattern (4 of 5 completed documents). `reports.md`'s fallback is the actual outlier, using Error red. `reviewer` recommended resolving this as a `brand-guide.md` documentation gap (distinguishing passive read-failure fallbacks from active write-action failures, which correctly use red everywhere) rather than a Business Decision — routed to `ui-designer` as a small, explicit fix.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's 7 Primary + 3 Tertiary instances. `ux-critic` verified clean via an independent instance-level sweep (Tertiary count confirmed exact match, 3 of 3).
