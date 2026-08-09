# Configuración — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/settings.md`, Approved; amended for `decision-log.md` D27 (NFC capability corrected to derive from `subscriptionTier`, not kit/code activation — the "Activar venta con tags" activation path is retired, a new `defaultSellingMode` control is added). Medium-Fidelity work reflects that current, D27-amended state as of this rebuild. **Further amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled` retired):** "Activar clientes frecuentes"/"Desactivar clientes frecuentes" are retired entirely, narrowing Configuración from six actions to four. Now built in Medium-Fidelity — see below.

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4` ("Nahui — Medium-Fidelity UI"), page **"Configuración — Medium Fidelity"** (`74:2`). All 8 `settings.md` §5 states covered across 15 frames (§3.4's three remaining copy variants and §3.9's near-instant/slow sub-states each split into their own frame, matching this phase's established convention). `74:8`/`74:9` ("Activar/Desactivar clientes frecuentes," D40) deleted 2026-08-09 — zero-caller audit confirmed before deletion:

| Frame | `settings.md` state |
|---|---|
| `74:3` | §3.1 Resolving — near-instant |
| `74:4` | §3.2 Resolving — slow |
| `74:5` | §3.3 Entry — session-controls sheet (new row, idle/cold-start/Event-active-no-Session) |
| `74:6` | §3.3a Vista principal — sin cambio pendiente, plan gratis |
| `88:1024` | §3.3a Vista principal — plan pago, modo botones |
| `88:1041` | §3.3a Vista principal — plan pago, modo con tags |
| `74:7` | §3.4 Activar plan de pago |
| `74:10` | §3.4 Cambiar a vender con tags |
| `88:1016` | §3.4 Cambiar a vender con botones |
| `74:11` | §3.5 Volver al plan gratis (deferred-effect) |
| `74:12` | §3.6 Vista principal — con cambio pendiente |
| `74:13` | §3.7 Cancelar cambio pendiente — confirmar |
| `74:18` | §3.9 Guardando cambio — near-instant |
| `74:19` | §3.9 Guardando cambio — slow |
| `74:20` | §3.10 Error al guardar cambio |

Shared Design System page: `0:1`. No new components required for this rebuild — everything reuses existing symbols (`Button`, `BackNav`, `NavBar`, `Skeleton`, `CardStack`, `CapabilityCard`).

## 3. Review status per screen
**Original pre-D27 build:** full cycle complete (`ui-designer` → `ux-critic` → `reviewer`), 0 Blockers, verified clean — see history in `ux-critic-findings.md` if referenced elsewhere. **D27 rebuild:** `ui-designer` removed 4 frames (retired activation-code mechanism: `74:14`–`74:17`), changed 5 frames (`74:6`, `74:12`, `74:7`, `74:11`, `74:10` repurposed), added 3 new frames (`88:1016`, `88:1024`, `88:1041`). `ux-critic` review: **clean, 0 Blockers, 0 Major** (1 Minor — SET-D27-MIN1, see Known gaps below, tracked non-blocking). `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean.** Sixth and final document to complete the Medium-Fidelity tier at that time.

**D40 amendment (2026-08-09, overnight autonomous session) — `loyaltyEnabled` retired.** `ui-designer`: zero-caller audit confirmed before deleting `74:8`/`74:9` (former "Activar/Desactivar clientes frecuentes"). Removed the "Clientes frecuentes" `CapabilityCard` row from all 4 Configuración main-view states (`74:6`, `74:12`, `88:1024`, `88:1041`). Updated `74:7`/`74:11`'s copy to the corrected spec (Frequent Customers now disclosed as a full consequence of the plan action, not a separately-conditioned Resultados nuance) — this triggered a `74:11` Content-frame FIXED-height overflow, fixed to AUTO (same bug class as the pre-existing fix already noted below for the D27 rebuild). `ux-critic` verified clean (all 4 states screenshot-confirmed with no visual trace of the retired row; both copy updates confirmed non-clipping). `reviewer` Foundation-consistency pass found **1 Important finding**: the shared `CapabilityCard` component set (`236:3404`, Design System page `0:1`) still carried two dead variants reproducing the retired toggle verbatim (`capability=Clientes, state=Apagado`/`Encendido`, formerly `236:3359`/`236:3366`) — unreachable from any live screen (confirmed via a 1,041-instance caller audit across all 9 pages, zero references) but a live re-instantiation risk per D40's "retired, not kept dormant" standard. Fixed: both variants deleted; `capability`'s variant options correctly recomputed to `["Plan", "Modo"]`, `state` correctly dropped "Apagado"/"Encendido," no sibling variants disturbed (verified via fresh `get_metadata` post-deletion). **0 Blockers, 0 remaining findings — done.**

## 4. Deviations from the upstream spec
None — no layout constraint forced a departure from `settings.md`'s specified behavior, copy, or states.

## Known gaps (tracked here, not blocking)
- **`CapabilityCard`/`CardStack` consolidated into one real Design System component (`236:3404`, page `0:1`), 2026-08-04.** Originally 8 variants (capability × state) replacing 12 previously-duplicated ad-hoc frames. **Resolved/superseded 2026-08-09 (`decision-log.md` D40):** the `Clientes/Apagado` and `Clientes/Encendido` variants this bullet originally flagged as dormant-but-present are now deleted outright, not merely unreferenced — see §3's D40 amendment record above. The component set now has 6 variants (`Plan` × 3, `Modo` × 3).
- **SET-D27-MIN1 — `defaultSellingMode` stays fully switchable to `nfc` during an already-pending `subscriptionTier` downgrade, with no inline signal the choice is about to become moot.** Found by `ux-critic` during the D27 rebuild review. Architecturally correct (§2.3: `defaultSellingMode` is independent of any pending `subscriptionTier` change, `nfc` genuinely stays available until the downgrade's effective date) — but a merchant who taps "Cambiar a vender con tags" while a downgrade is already scheduled (visible right above, "Tu plan: Pago (cambia a Gratis el 14 ago)") gets no reminder that her new default will stop being usable once that downgrade lands. She'd only discover this later, indirectly, via `home.md`'s existing capability-revoked one-time mention. Low-consequence (no data loss, self-resolves via an existing downstream mechanism), not blocking — worth a small copy fix (an inline note on the pending-downgrade card, or in the "Cambiar a vender con tags" confirmation copy when a pending downgrade already exists) in a future pass.
- **`74:11`'s Content frame sizing fixed as an incidental consequence of the D27 copy change.** The frame was `FIXED` height, which clipped the "Confirmar cambio" button once the required nfc-withdrawal disclosure lengthened the body copy. Changed to `AUTO` (hug) — a mechanical fix, not a new design decision, but noting it since it wasn't part of the original dispatched diff.
- **Frame numbering renumbered after removal.** `74:18`/`74:19`/`74:20` kept their node IDs but their display names were renumbered (11/12/13) to stay sequential after `74:14`–`74:17` were removed — content unchanged.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's Primary instances; this page has no Tertiary-variant instances — uses Secondary heavily instead, per the separately-tracked semantic-clarity concern. `ux-critic` verified clean via an independent instance-level sweep, including confirming zero Tertiary-height instances exist on this page (a specifically re-checked claim, held up).
- **Secondary/outlined-button maroon tone (Q12's third instance)** — flagged during the original build's review as visually near-identical to the Error/Destructive accent; tracked alongside Q12 in `company/business-decisions.md`, not resolved by this rebuild.
