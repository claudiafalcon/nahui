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

## Known gaps (tracked, not blocking unless noted)
- **HOME-FIGMA-D27-MIN1** — frame `93:324`'s "Ir a Configuración" button sits 30px below its mention text (vs. 10px on its clone source, `36:345`) — an unexplained 20px spacing inconsistency, not matching the layout-compensation math the builder's report claimed. Nothing is clipped or illegible; purely a consistency nit across the four §3.6a sibling variants. One-line fix when next touched: move node `93:331` from y=472 to y=452.
- **`settings.md` §2.1 amendment still lacks its own formal `ux-critic`/`reviewer` cycle** — direct inspection (by the entry-point verification pass) found it correct, but no formal review record exists for it specifically, unlike every other amendment this document has been through.
- **Minor findings from `ux-critic`** (non-gating, tracked for a later batch):
  - Wordmark alignment inconsistent between the cold-start frame (left-aligned) and six idle/session-start frames (centered).
  - Session-controls sheet (`36:361`) lacks the bounded Card wrapper the other two dimmed-sheet states (`41:548`, `41:573`) use — also noted as present on the new `84:315` sheet, per `settings.md`'s own tracking file M2 finding (same inherited pattern).
  - Coral-as-text-color (Tertiary/link buttons: "Cancelar," "Asignar tags," etc.) — **resolved via Q12**, now Coral AA+, confirmed passing AA.
  - Suggestion: confirm whether "Ver detalle" (`41:595`) using a Secondary/outlined treatment instead of Primary is a deliberate "calm, not urgent" choice or an unintentional divergence from this doc's otherwise-consistent sole-CTA pattern.
- **NavBar contrast**: `active=Hoy`, `active=Inventario`, and `active=Eventos` are all now correctly rebound to `color/tezontle-dark`. Only `active=Resultados` remains unfixed — apply the same fix when `reports.md`'s Medium-Fidelity work starts.
- **NavBar/brand-guide.md drift, flagged for `reviewer`/`architect`, not a UX-quality finding.** `ux-critic`'s Q12 verification noticed NavBar's active-tab color renders as `color/tezontle-dark` (deep maroon), but `brand-guide.md`'s own "Bottom navigation" line still says "active item highlighted in Coral." This predates Q12 and wasn't introduced by it — the NavBar fix was applied for contrast reasons earlier this session without the brand-guide text being updated to match. Needs a one-line `brand-guide.md` correction, not a design change.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's 16 Primary + 6 Tertiary instances (`ux-critic`'s independent height-based sweep found 6, not the 5 the build report claimed — all 6 confirmed correctly colored regardless; see `company/infrastructure-decisions.md` ID001 addendum, Q12-VERIFY-MIN1). `ux-critic` verified clean — no wrong-colored instances found anywhere.
