# Inventario — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/inventory.md`, Approved (D23-amended, cross-reference/terminology only, folded back to plain Approved).

**Amended 2026-08-08 for `decision-log.md` D33 (pricing/event-cost operating model).** The upstream spec gained new §3.4a (Editar precio — sheet) and §3.8a (Elegir producto — nuevo producto, precio inicial), plus price display on every existing Catalog row. This build (below) realizes both in Figma, as part of the same combined dispatch that also built `onboarding.md`'s "Define lo que vendes" step and `events.md`'s Costo/Ajustar precios work.

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

**Added 2026-08-08 — D33 pricing build. Node-state mapping confirmed directly against live Figma metadata (`get_metadata`), not inferred from the build report:**

| Frame | inventory.md state |
|---|---|
| `735:532` | §3.4a Editar precio — sheet |
| `735:5473` | §3.8a Elegir producto — nuevo producto, precio inicial |
| `735:5510` | §3.6 Registrar mercancía — entry, Producto seleccionado via §3.8a (Chalecos, "1 · revisa antes de guardar") — a composed downstream frame showing the §3.8a picker's own selection landing correctly, same technique as the existing `127:1300` populated-picker clone |
| `745:594` | §3.8 Elegir producto — picker sheet, typed "Chalecos" no-match state. Self-corrected by `ui-designer` mid-build (see `product/02-ux/CLAUDE.md`/session notes) — not a new spec state, a picker-content variant. |

**Price display, all four existing Catalog-view frames** — a new `Price tap target` wrapper (56×44px, opens `735:532`) added per product row, three rows per frame (Pijama/Sudadera/Calcetines), 12 total:

| Frame | Price tap targets |
|---|---|
| `47:38` (§3.5, pending-tag catalog) | `745:636`, `745:639`, `745:642` |
| `47:65` (§3.17, "Terminar después" = §3.5) | mirrors `47:38`'s three, same pattern |
| `52:138` (§3.12, post-save confirmation — buttons-only) | `745:654`, `745:657`, `745:660` |
| `52:162` (§3.13, post-save confirmation — nfc-capable) | mirrors `52:138`'s three, same pattern |

Confirmed live via `chrome-devtools-mcp`: the price tap target on `52:138` (Pijama row, `745:654`) opens `735:532` correctly. The other 11 weren't individually live-tested but are structurally identical clones of the same confirmed pattern.

## 3. Review status per screen
Full cycle complete: `ui-designer` build → `ux-critic` review (1 Major: undersized delete tap target; 1 Minor: self-contradicting search-field content) → `ui-designer` remediation → `ux-critic` verification (clean, node-level re-check given a process flag on the remediation pass — see Known gaps) → `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings.** **All 19 frames: complete. Third document to fully complete the Medium-Fidelity tier.**

**D33 pricing build (2026-08-08).** `ui-designer` build (§3.4a/§3.8a frames + 12 price tap targets, above), part of a combined dispatch spanning this page plus `onboarding.md`/`events.md` → `ux-critic` review round 1: 3 Major + 2 Minor found across the combined build (self-contradictory picker typed-no-match state — self-caught and corrected by `ui-designer` mid-build before the round-1 report, see `745:594`'s note above; missing price display on 4/5 locations — fixed, the 12 tap targets above; visual-weight parity issue scoped to `events.md`'s "Ajustar precios" vs. "Cancelar evento," not this page) → `ui-designer` remediation → `ux-critic` verification: clean, all content/layout confirmed via direct screenshot inspection; 3 wiring-level claims flagged as unverified boundaries (outside `ux-critic`'s tool scope, ID004) → Main live-verified via `chrome-devtools-mcp` (the `52:138`→`735:532` hop above) → `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean** (spot-checked `745:594`, `47:38`/`47:65`/`52:138`/`52:162` directly). Folded into done.

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

**2026-08-11/12 — Inventario Catalog-routing fix: three confirmed defects closed (`inventory.md` §2 step 1).** A merchant walk (Free journey) and independent manual Product Owner testing both hit the same real defect: from a Home state with ≥1 Product already registered, Inventario routed directly to the blank "Registro de mercancía" entry form instead of the Catalog view — a direct violation of §2 step 1's own resolution logic. A `ui-designer` ground-truth trace (live `node.reactions` reads, not inference) confirmed three separate instances, not one:

1. **Demo page (`160:2`), Free/buttons-only** (`162:1492`, "Continuar Día 2"): no Catalog-view frame existed anywhere on the Demo page for this journey at all — a missing-content gap, not just a wiring gap. New node `955:3697` — cross-page clone of production `46:29` ("3.4 Catalog view — normal"), content-faithful (Bolsas 12/$350, Accesorios 3/$180, Playeras 0/$280). `162:1492`'s Inventario tab (`I162:1499;2:27`) rewired from `162:1661` (the entry form) to `955:3697`; the clone's own "Registrar mercancía" button (`955:3716`) rewired to `162:1661`, so the entry form is now reached *from* the Catalog view rather than being the direct landing target. Caller-audited `162:1661` first (36 pre-existing callers) — only the one tab moved, all 35 others confirmed unchanged via fresh before/after readback.
2. **Demo page, Paid/nfc twin** (`284:3698`): a correct §3.5-nfc Catalog view already existed (`593:526`, "Te faltan 7 artículos por etiquetar" — content confirmed to genuinely fit a merchant returning mid-Día-2, not a scripted just-registered narrative). Pure rewiring: `284:3698`'s Inventario tab (`I284:3705;2:27`) repointed from `371:1138` to `593:526`. `371:1138`'s other legitimate caller (`360:1117`'s own tab) confirmed unaffected.
3. **Production page (`35:2`)**, both Home frames: `36:61` and `111:1085` (Journey 2/nfc twin) both had **zero reactions at all** on their Inventario tabs — not miswired, entirely unwired. Both wired to `46:29` via the page's existing cross-page `URL`-fallback convention (ID003) — including `111:1085`, where `ui-designer` and independently `reviewer` both confirmed (from the frame's own content and `product/02b-medium-fidelity/CLAUDE.md`'s documented "Journey 2: pre-populated, tagged inventory" persona description) that the plain Catalog view is the Foundation-correct destination, not the pending-tag variant — nothing on this persona's frame family signals pending tag work.

**Verification, full chain.** `ux-critic` (elevated scrutiny, per the ID001 local-cache-fallback disclosure): zero Blockers, content fidelity of `955:3697` confirmed via direct pixel comparison against `46:29`, the `111:1085` judgment call independently re-derived from spec and frame content (not just accepted as asserted). Named 6 reaction-level claims as open boundaries outside its tools (ID004) — Main closed every one via live `chrome-devtools-mcp` click-through on fresh pages: `162:1492`→`955:3697`, `284:3698`→`593:526`, `36:61`→`46:29` (cross-page), `111:1085`→`46:29` (cross-page), and `955:3697`'s own "Registrar mercancía"→`162:1661`, all confirmed landing on the correct node with correct visible content (screenshot-verified for `955:3697`). `reviewer`: zero Blockers, confirmed the D31/D32 clone-don't-share discipline was applied correctly (clone only where content was genuinely missing, pure rewiring where it already existed), confirmed no `decision-log.md`/ubiquitous-language drift, independently re-derived the `111:1085` judgment call as Foundation-sound (not just UX-sound).

**Disclosed, out-of-scope, not fixed here:** `955:3697`'s 3 price-tap-target nodes inherited stale cross-page destinations from the clone operation (non-functional in Present mode, a D33 pricing-feature tap target, not part of this fix's scope). Also, both `46:29` and its faithful clone `955:3697` are missing the per-Product marker letter and zero-stock dimming `inventory.md` §3.4 requires on every Catalog row — a real, pre-existing gap `ux-critic` found while reviewing this fix, present on the original production frame (not introduced here), logged separately in `product/02-ux/ux-critic-findings.md`'s Inventario section rather than folded into this fix's scope.

**New Demo-page clone frame added to the Prototype-only clone list above:** `955:3697` (clone of `46:29`, "3.4 Catalog view — normal") — same class as `111:1001`/`111:1014`/`111:1037`, a content-identical clone needed because Figma reactions are one-destination-per-node and this journey needed its own Catalog-view entry point distinct from production's.

## Known gaps (tracked, not blocking)
- **The low-fi spec's `[−]`/`[+]` stepper has never been built in this Medium-Fidelity Figma file.** Only the single bordered Cantidad value box exists — no increment/decrement tap targets. Pre-existing gap (not introduced by today's amendment sync), surfaced while updating the field's text. The spec's hard requirement that typed entry be visibly available for large counts is met (the value box is genuinely tappable/bordered), but the stepper itself — described in the spec as "a convenience for small adjustments" alongside typing — doesn't yet exist as real UI. Build it when this document is next touched, or sooner if a live demo needs the literal tap-to-increment interaction, not just typed entry.
- **Cross-document error-state color inconsistency, newly identified.** `events.md`'s save-error frames (e.g. `10:12`) render error text in default body gray/black; `home.md` and `inventory.md`'s equivalent error states correctly use the brand-guide Error color (`#A72C2C`-family). `inventory.md` and `home.md` are the brand-guide-correct implementations — `events.md` is the outlier and should be updated to match when next touched. (Also recorded in `events.md`'s own tracking file.)
- **NavBar contrast**: `active=Inventario` confirmed rebound to `color/tezontle-dark` as part of this build. Combined with `home.md`'s and `events.md`'s builds, only `active=Resultados` now remains outstanding — apply the fix when `reports.md`'s Medium-Fidelity work starts.
- **Suggestion, non-blocking:** the `Eliminar línea (tap target)` pattern (40×32 invisible tap wrapper around a small ✕ glyph) exists only as two one-off duplicated frames, not a registered Design System component. Fine as-is with only two same-screen instances; worth promoting to a reusable symbol if the same "small icon needs a larger tap wrapper" need recurs (e.g. a future delete affordance elsewhere).
- **Process note**: the remediation pass that fixed the Major/Minor above proceeded without loading its mandatory `figma-use` skill (a tool-access gap, not a choice made freely — see `company/infrastructure-decisions.md` ID001's addendum). The resulting edits were independently verified correct via node-level inspection (auto-layout membership, token bindings), not just visual/self-report — no quality concern remains, flagged here only for the record.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's 8 Primary + 8 Tertiary instances (`ux-critic`'s independent height-based sweep found 8, not the 6 the build report claimed — all 8 confirmed correctly colored regardless; see `company/infrastructure-decisions.md` ID001 addendum, Q12-VERIFY-MIN1). `ux-critic` verified clean — no wrong-colored instances found anywhere.
