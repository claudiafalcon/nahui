# Eventos — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/events.md`, Approved (D20/Venue-amended, folded back to plain Approved). Medium-Fidelity work in this file reflects that current state — no upstream amendment is in flight.

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4` ("Nahui — Medium-Fidelity UI"), page **"Eventos — Medium Fidelity"** (`1:33`). All 18 `events.md` §5 states covered across 20 frames (§3.9's three visual sub-states split into their own frames):

| Frame | events.md state |
|---|---|
| `10:2` | 3.1 Resolving — near-instant |
| `10:3` | 3.2 Resolving — slow |
| `10:4` | 3.3 Cold start — sin eventos |
| `10:5` | 3.4 Lista de eventos — normal |
| `10:6` | 3.5 Lista de eventos — sin Activo |
| `10:7` | 3.6 Nuevo evento — formulario |
| `10:8` | 3.7 Elegir lugar — picker |
| `10:9` | 3.8 Elegir tipo — picker |
| `10:10`/`10:11`/`10:12` | 3.9 Guardar evento — silencioso / lento / error |
| `10:13` | 3.10 Confirmación post-guardado |
| `10:14` | 3.11 Detalle — programado |
| `10:15` | 3.12 Cancelar evento — confirmación |
| `10:16` | 3.13 Confirmación post-cancelación |
| `10:17` | 3.14 Detalle — activo sin sesión hoy |
| `10:18` | 3.15 Detalle — activo sesión abierta |
| `10:19` | 3.16 Detalle — cerrado |
| `10:20` | 3.17 Detalle — cerrado sin sesiones |
| `10:21` | 3.18 Fallback — error de carga |

Shared Design System page: `0:1` (variable collections `Nahui/Colors`, `Nahui/Spacing & Radius`; text styles; component sets Button, NavBar, EventCard, FieldBox, AmbientToast; standalone components BackNav, SectionLabel, Skeleton, SheetHandle, PickerListRow, AddNewRow, SearchField).

## 3. Review status per screen
Full cycle complete: `ui-designer` build → `ux-critic` review (4 Major, 2 Minor found) → `ui-designer` remediation → `ux-critic` verification (clean, 0 Blockers, 0 unresolved Majors) → `reviewer` Foundation-consistency pass, round 1 (0 Blockers; 3 Important findings — brand-guide.md missing the new Destructive variant, missing tracking file, uncategorized brand-wide contrast issue — all addressed, see Known gaps below) → `reviewer` Foundation-consistency pass, round 2, with live Figma access throughout (spot-checked spec fidelity and ubiquitous-language on 3 representative frames, independently resolved the Blush-pill compliance question by direct inspection, independently re-confirmed all three round-1 fixes rather than trusting the round-1 report): **0 Blockers, 0 Important findings — clean.** **All 20 frames: complete. This is the first document to fully complete the Medium-Fidelity tier.**

Incidental finding from round 2: frame `10:18`'s visual distinction between the passive "Día 1..." row and the tappable "Vendiendo ahora..." pill resolves `events.md`'s own open EVT-MIN4 (Minor, still logged as Open in `ux-critic-findings.md` since it doesn't gate anything, but worth noting the Medium-Fidelity layer solved it without anyone asking it to).

## 4. Deviations from the upstream spec
None — no layout constraint forced a departure from `events.md`'s specified behavior, copy, or states.

## Prototype-only clone frames (not new spec states)
The 2026-08-03 clickable-prototype reorganization added three clones for Journey 2 ("Existing NFC merchant")'s own reaction chain, distinct from Journey 1's use of the originals: `112:247` (clone of `10:7`, §3.6 Nuevo evento — formulario), `112:266` (clone of `10:10`, §3.9 Guardar evento — silencioso), `111:1077` (clone of `10:13`, §3.10 Confirmación post-guardado). No new content — same states, same copy, duplicated only because Figma reactions are one-destination-per-node and the two journeys' shared "create an event" screens needed to route back to different Home selling modes afterward. Not new `events.md` §5 states; not counted in the 20-frame total above.

**Product Validation Sprint fix, same day:** `ux-critic`'s usability audit found that Lugar/Tipo pickers (`10:8`/`10:9`) closed back to the same static, still-empty Nuevo Evento form regardless of what was selected — a real "did my selection register?" gap on the primary demo path. Fixed by composing already-approved states (no new design decision, same technique as `home.md`'s `JOURNEY2-MAJ1` fix): two new "populated" clone frames, `127:1230` (Lugar = "Plaza Norte") and `127:1249` (Tipo = "Bazar"), with all 9 picker-row `CLOSE` reactions (3 Lugar rows, 6 Tipo rows) rewired to land there instead of the empty form. **Known, disclosed limitation:** each field has one populated frame, not a full combinatorial matrix — selecting both Lugar and Tipo in sequence in the live prototype won't retain both selections at once, the same one-destination-per-node constraint documented elsewhere in this file. **`ux-critic` independently verified: both new frames confirmed to show the correct populated values.** One disclosed, not-a-defect caveat: the reaction *wiring* (whether the 9 picker rows actually route to these frames) is outside `ux-critic`'s tool scope to verify directly (ID004) — `ui-designer`'s own reaction-readback self-verification is the evidence for that; recommend a quick manual Present-mode click-through before a live demo.

**2026-08-04 amendment sync (EVT-Q1/EVT-Q2 Empieza default).** Empieza/Termina updated from blank `__ / __ / ____` to today's date "04 / 08 / 2026," with fill corrected from a manual muted override to the real `color/obsidian` variable binding: production `10:7`, Journey-2 clone `112:247`, populated clones `127:1230`/`127:1249`, and demo-page equivalents `162:1810`/`162:1843`/`162:1877`. No overlap warning shown anywhere — this demo/production's own Venue data (Plaza Norte, 12–14 jul) doesn't conflict with today's default (04 ago), consistent with the spec's own "no overlap → nothing shown" rule. Guardar evento's Lugar+Tipo gate confirmed unchanged.

## Known gaps (tracked here per `reviewer`'s recommendation, not blocking)
- **NavBar contrast fix, status as of `events.md`'s own remediation: applied to `active=Eventos` only.** Update, recorded during `home.md`'s review: `active=Hoy` and `active=Inventario` have since also been fixed (rebound to `color/tezontle-dark`), as part of the `home.md` and `inventory.md` Medium-Fidelity builds respectively. Only `active=Resultados` remains outstanding — whoever builds `reports.md`'s Medium-Fidelity work next should apply the same fix there.
- **Brand-wide Primary-CTA contrast (Q12) — Resolved.** Every solid-Coral/white-text Primary button (`brand-guide.md`'s own literal definition) computed to ~3.35:1, failing WCAG AA. Correctly left unfixed at the time since it was a brand-wide color decision, not something a single-document remediation pass should resolve unilaterally. Product Owner resolved via a new token, Coral AA+ (`#C13F26`, 5.24:1) — applied as a component-level rebind on the shared `Button` component (Primary fill, Tertiary text), cascading automatically to every document including this one (8 Primary instances here, all confirmed correctly colored, no Tertiary instances on this page). `ux-critic` verified clean via an independent instance-level sweep.
- **Error-state color is the outlier against `home.md`/`inventory.md`.** Identified during `inventory.md`'s review: this document's save-error frames (e.g. `10:12`, "No se pudo guardar...") render error text in default body gray/black, while `home.md` and `inventory.md`'s equivalent error states correctly use the brand-guide Error color (`#A72C2C`-family) per `brand-guide.md`'s own reservation of that color for system feedback. `events.md` should be updated to match when next touched — not blocking, but this document is the one that's inconsistent, not the other two.
- **`brand-guide.md`'s Buttons section doesn't yet document the new Destructive variant** built during this remediation (used for "Sí, cancelarlo," `events.md` §3.12) — added as a one-line addition (see brand-guide.md itself); future Medium-Fidelity work needing the same pattern (`home.md`'s "Cancelar venta actual," `inventory.md`'s "Descartar") should reuse this variant rather than building a new one.
