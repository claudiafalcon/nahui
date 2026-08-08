# Inventario — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/inventory.md`, Approved (D23-amended, cross-reference/terminology only, folded back to plain Approved).

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4` ("Nahui — Medium-Fidelity UI"), page **"02 · Inventario"** (`45:2`). All 18 `inventory.md` §5 states covered across 19 frames (state 10's near-instant/slow sub-states split into two visual panels, same shape as `events.md`'s §3.9 split):

| Frame | inventory.md state |
|---|---|
| `45:3` | §3.1 Resolving — near-instant |
| `45:16` | §3.2 Resolving — slow |
| `45:27` | §3.3 Cold start — no Product ever registered |
| `46:29` | §3.4 Catalog view — normal |
| `47:38` | §3.5 Catalog view — pending tag work (nfc-capable). **Rebuilt 2026-08-07** for the pending-tags task-priority refinement: unboxed "Continuar etiquetando" primary CTA (new nodes `589:527`/`589:528`) replacing the old boxed Tertiary-variant card; "Registrar mercancía" swapped Primary→Secondary variant, same position. See `product/02-ux/inventory.md` §10 (2026-08-07 entry). |
| `48:58` | §3.6 Registrar mercancía — entry |
| `49:68` | §3.7 Registrar mercancía — committed lines |
| `50:78` | §3.8 Elegir producto — picker sheet |
| `50:648` | §3.9 Descartar confirmation |
| `51:102` / `51:115` | §3.10 Guardar — saving (near-instant / slow) |
| `51:682` | §3.11 Guardar mercancía — error |
| `52:138` | §3.12 Post-save confirmation — buttons-only |
| `52:162` | §3.13 Post-save confirmation — nfc-capable |
| `53:174` | §3.14 Asignar tags — active queue |
| `53:737` | §3.15 Asignar tags — error, tag already assigned |
| `53:756` | §3.16 Asignar tags — error, scan failed |
| `47:65` | §3.17 Terminar después (= §3.5). **Rebuilt 2026-08-07** identically to `47:38` — same amendment, same shape. |
| `51:126` | §3.18 Defensive fallback — load error |

Shared Design System page: `0:1`. No new components required — all screens reuse existing symbols (`Button` incl. Destructive variant, `NavBar`, `FieldBox`, `SheetHandle`, `SearchField`, `AddNewRow`, `PickerListRow`, `Skeleton`, `NFCScanPrompt` reused directly from `home.md`'s build). One new, contained, non-componentized element: the `Eliminar línea (tap target)` wrapper frames (`56:189`/`56:190`) — see Known gaps.

## 3. Review status per screen
Full cycle complete: `ui-designer` build → `ux-critic` review (1 Major: undersized delete tap target; 1 Minor: self-contradicting search-field content) → `ui-designer` remediation → `ux-critic` verification (clean, node-level re-check given a process flag on the remediation pass — see Known gaps) → `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings.** **All 19 frames: complete. Third document to fully complete the Medium-Fidelity tier.**

## 4. Deviations from the upstream spec
None.

## Prototype-only clone frames (not new spec states)
The 2026-08-03 clickable-prototype reorganization added three clones for Journey 1 ("First-time merchant, empty inventory")'s own reaction chain, distinct from Journey 3's ("Inventory management") use of the originals: `111:1001` (clone of `48:58`, §3.6 Registrar mercancía entry), `111:1014` (clone of `49:68`, §3.7 committed lines), `111:1037` (clone of `51:102`, §3.10 Guardar — saving). No new content — same states, same copy, duplicated only because Figma reactions are one-destination-per-node and the two journeys needed different downstream endings from the same starting screens. Not new `inventory.md` §5 states; not counted in the 19-frame total above.

**Product Validation Sprint fixes, same day (`ux-critic`'s usability audit):**
- **Elegir Producto picker gap — fixed.** Same "did my selection register?" issue as `events.md`'s pickers. New "populated" clone `127:1300` (Producto = "Pijama") built by composing already-approved states; the picker's 3 row `CLOSE` reactions rewired to land there instead of the empty form. Same disclosed limitation as `events.md`: one populated frame, not a full combinatorial matrix.
- **NFCScanPrompt icon added — fixed.** The shared `NFCScanPrompt` component (`34:253`, also used on `home.md`'s `41:527`/`114:377`) had no icon at all — just a plain colored circle, ambiguous about the physical scan action. Fixed at the component-master level with a proper NFC/contactless-wave glyph, cascading to this document's own usage on the Asignar Tags queue (`53:174`, via instance `53:189`).
- **Cantidad field placeholder — fixed.** The literal "0" placeholder on Registrar Mercancía (`48:76`, `49:93`, and the new clones' equivalents) read ambiguously as an already-entered value, especially in bright outdoor lighting. Replaced with an en dash across all instances.

**`ux-critic` independently verified: all three confirmed clean** — populated frame content correct, NFC icon cascade confirmed on `53:174`/`53:189`, quantity placeholder confirmed unambiguous. One disclosed, not-a-defect caveat on the picker's reaction wiring specifically, same as `events.md` — outside `ux-critic`'s tool scope (ID004), `ui-designer`'s own reaction-readback is the evidence; a manual click-through is recommended before a live demo.

**2026-08-04 amendment sync (INV-Q1 default text).** Cantidad's default value text updated from a bare en-dash placeholder to "1 · revisa antes de guardar" on every live instance: production `48:76` (in `48:58`), `49:93` (in `49:68`); Journey-1 clones `111:1011` (in `111:1001`), `111:1033` (in `111:1014`); demo-page clones `162:1671` (in `162:1661`), `162:1697` (in `162:1687`), `162:1719` (in `162:1700`). Tap affordance requirement was already satisfied by the existing bordered/white/rounded `Frame` treatment (identical to the Producto picker box) — confirmed via screenshot, no new visual element needed.

**2026-08-06 amendment sync — complete (HJR-INV-M1 heading text).** `product/02-ux/inventory.md`'s on-screen heading at §3.6/§3.7/§3.8 was changed from "Registrar mercancía" to "Registro de mercancía." `ui-designer` ran a full-file text search across all 8 pages (not just the frames named in the original pending note, which undercounted the real scope) and updated **30 heading nodes**: 6 on the production "02 · Inventario" page (`48:69`/`49:79`/`50:89`/`111:1004`/`111:1017`/`127:1303`) and 24 on the demo page `160:2` (`162:1664`/`162:1677`/`162:1690`/`162:1703`, plus the 20 nfc-mode clones from the Finding 8/10 sweeps: `371:1141`/`371:1178`/`371:1215`/`371:1252`/`371:1289`, `403:1396`/`403:4085`/`403:4254`/`403:4423`/`403:4592`, `403:1419`/`403:4108`/`403:4277`/`403:4446`/`403:4615`, `403:1432`/`403:4121`/`403:4290`/`403:4459`/`403:4628`). All 30 confirmed via independent fresh readback. The 10 CTA button instances still reading "Registrar mercancía" (Inventario's own cold-start/catalog/pending-tag/terminar-después/post-save frames, plus Home's own cold-start CTA on page `35:2`) were confirmed correctly left unchanged — a full re-search of both edited pages post-fix found zero remaining stray headings and zero leakage into any other page. Fully synced end to end.

**2026-08-07 amendment sync — Governance Rollout Cascade (D31 / §4) wiring batch.** §3.9's Descartar confirmation (`50:648`) had zero live callers and both its own buttons unwired — all three now fixed: `49:98` ("Descartar" text on §3.7, `49:68`) → `50:648`; `50:665` ("Cancelar") → `49:68` (§3.7, confirmed the only possible source screen — `48:58`/§3.6 has no Descartar affordance, checked directly); `50:667` ("Sí, descartar") → `48:58` (§3.6, blank). All three reactions verified via independent fresh readback (corrected 2026-08-07: this line previously read "all four," a miscount caught by `ux-critic`'s structural review — three reactions were listed, three were fixed). `ux-critic` structural pass clean; pending `reviewer` and a live click-through before folding into done.

## Known gaps (tracked, not blocking)
- **The low-fi spec's `[−]`/`[+]` stepper has never been built in this Medium-Fidelity Figma file.** Only the single bordered Cantidad value box exists — no increment/decrement tap targets. Pre-existing gap (not introduced by today's amendment sync), surfaced while updating the field's text. The spec's hard requirement that typed entry be visibly available for large counts is met (the value box is genuinely tappable/bordered), but the stepper itself — described in the spec as "a convenience for small adjustments" alongside typing — doesn't yet exist as real UI. Build it when this document is next touched, or sooner if a live demo needs the literal tap-to-increment interaction, not just typed entry.
- **Cross-document error-state color inconsistency, newly identified.** `events.md`'s save-error frames (e.g. `10:12`) render error text in default body gray/black; `home.md` and `inventory.md`'s equivalent error states correctly use the brand-guide Error color (`#A72C2C`-family). `inventory.md` and `home.md` are the brand-guide-correct implementations — `events.md` is the outlier and should be updated to match when next touched. (Also recorded in `events.md`'s own tracking file.)
- **NavBar contrast**: `active=Inventario` confirmed rebound to `color/tezontle-dark` as part of this build. Combined with `home.md`'s and `events.md`'s builds, only `active=Resultados` now remains outstanding — apply the fix when `reports.md`'s Medium-Fidelity work starts.
- **Suggestion, non-blocking:** the `Eliminar línea (tap target)` pattern (40×32 invisible tap wrapper around a small ✕ glyph) exists only as two one-off duplicated frames, not a registered Design System component. Fine as-is with only two same-screen instances; worth promoting to a reusable symbol if the same "small icon needs a larger tap wrapper" need recurs (e.g. a future delete affordance elsewhere).
- **Process note**: the remediation pass that fixed the Major/Minor above proceeded without loading its mandatory `figma-use` skill (a tool-access gap, not a choice made freely — see `company/infrastructure-decisions.md` ID001's addendum). The resulting edits were independently verified correct via node-level inspection (auto-layout membership, token bindings), not just visual/self-report — no quality concern remains, flagged here only for the record.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's 8 Primary + 8 Tertiary instances (`ux-critic`'s independent height-based sweep found 8, not the 6 the build report claimed — all 8 confirmed correctly colored regardless; see `company/infrastructure-decisions.md` ID001 addendum, Q12-VERIFY-MIN1). `ux-critic` verified clean — no wrong-colored instances found anywhere.
