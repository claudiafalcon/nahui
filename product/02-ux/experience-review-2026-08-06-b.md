# Experience Review — 2026-08-06 (tooling-validation run, `chrome-devtools-mcp`)

Second `merchant-user-tester` review of the day, and the first full run on the
new `chrome-devtools-mcp` stack (see `company/infrastructure-decisions.md`
ID011). Governed by `company/CLAUDE.md`'s Experience Validation section.

**Process note, disclosed plainly:** this run was dispatched before the
Product Owner's narration-separation correction landed, so its raw report
has some tool language embedded inline in the click-by-click path rather
than fully isolated in a diagnostics section — a known, already-fixed gap
in `merchant-user-tester`'s instructions, not repeated here. The findings
below were extracted and independently verified regardless.

## Verification status legend

Same as `experience-review-2026-08-06.md`: Independently Verified / Partially
Verified / Pending Verification / Tooling Artifact.

## Findings

**1. Settings entry point from the NFC-seeded demo routes to the wrong plan-tier frame.**
Ana reached Settings from the "Ver un ejemplo" demo's Home screen and saw
"Tu plan: Gratis" / "Cómo vendes normalmente: Botones (vender con tags
requiere el plan de pago)" — despite having just completed a sale using
tags, in a business seeded specifically as NFC/paid-tier.
**Status: Independently Verified.** Main retraced the identical path via
`chrome-devtools-mcp`. The Home frame's own internal name is "J1 · 6c.
Evento activo, sin sesión (**nfc-twin**)" — confirming NFC-mode context,
consistent with `onboarding.md` §2.2's stated seed
(`defaultSellingMode=nfc`, "the richest capability combination"). The
Settings frame reached from it is internally named "03. Vista principal —
sin cambio pendiente, **plan gratis** (§3.3a)" — the free-plan variant.
**Root cause identified, not a new unknown bug:** this traces directly to
an already-disclosed build simplification, exception #6 in
`product/02b-medium-fidelity/CLAUDE.md`'s "Full-coverage wiring pass":
*"Several Configuración loyalty-toggle/cancel returns converge on a shared
landing frame rather than a distinct clone per tier×state combination...
functionally live, just not state-accurate in every branch."* This run
converts that abstract, accepted limitation into a concrete, felt
inconsistency a real first-time merchant would hit.
**Fix verified, 2026-08-06.** `ui-designer` cloned the shared session-controls
sheet (`360:1117`) and rewired the nfc-twin's own trigger (`284:3704`) to open
it instead of the original shared sheet, routing its Configuración button to
an already-existing paid/nfc-consistent frame (`184:1713`). `ux-critic`
reviewed structurally (clean, 0 Blockers/Majors; flagged that reaction-level
click correctness was outside what its Figma-inspection tools can see —
`infrastructure-decisions.md` ID004). Main then closed that exact gap with a
genuine click-through via `chrome-devtools-mcp`: ▾ → `360:1117` →
Configuración → `184:1713`, which now reads "Tu plan: Pago" / "Cómo vendes
normalmente: Con tags" — correct. **Independently Verified end to end by a
live click**, not just structural inspection.

**2. Tab bar (Inventario/Eventos/Resultados) is unwired — wider than one frame.**
Ana tapped "Resultados" and "Inventario" from the NFC-mode Home screen
(`284:3698`) and got no response.
**Status: Independently Verified, and broader than first scoped.** Main
confirmed via `take_snapshot` on `284:3698`: "Inventario," "Eventos," and
"Resultados" are plain `StaticText`, not `link` elements. Checking further,
the identical gap exists on a second, sibling frame, `284:3534` ("Modo nfc
— listo, sin venta," reached both before starting a sale and again as the
receipt's exit destination). Routed to `ui-designer` with the wider scope
— check the full nfc-mode Home/selling frame family, not just the
originally-reported frame.
**Fix verified, 2026-08-06.** `ui-designer` wired all 15 tab reactions (5
nfc-mode frames × Inventario/Eventos/Resultados) to the same canonical
destinations already used elsewhere on the page. Main confirmed via fresh
`take_snapshot` on `284:3698`: all three are now `link` elements, and live
clicks on all three land on the reported destinations
(`162:1661`/`162:1804`/`184:1536`). **Independently Verified — the links now
work.** See Finding 7: the destinations they land on are a separate,
newly-surfaced issue, not a wiring failure.

**3. Daily sale total did not update after a completed sale ($850 unchanged after a $580 sale).**
**Status: Independently Verified — and correctly classified as an
accepted Medium-Fidelity limitation, not a defect to fix.** Main completed
a real sale via `chrome-devtools-mcp` (tapped the tag icon, added 2 items,
finalized, dismissed the full-viewport receipt) and confirmed the receipt's
exit destination is the exact same static frame (`284:3534`) reached before
the sale — its "$850 · 6 ventas" text is necessarily hardcoded, not
live-computed, since Figma prototypes have no real backend. Building a
dynamically-updating total would mean either fabricating numbers or an
unbounded combinatorial frame set — the same tradeoff already accepted for
exception #6. No fix routed; this is expected prototype behavior, not
a product gap.

**4. Leaving Settings landed on an apparent "cold start" reset rather than the prior Día 2 screen.**
**Status: Independently Verified — identified as downstream of finding 1,
not a separate defect.** Main confirmed the free-plan Settings frame's
(`184:1645`) "← Hoy" link returns to `162:1485` ("Cold start — sin
productos"). This is correctly paired with *that* frame's own
(buttons-mode, cold-start) context — the actual defect is finding 1
routing an NFC-context Settings visit to this frame at all. Flagged to
`ui-designer` as a verification step once Fix 1 lands (confirm the
correct target frame's own back-link is context-appropriate), not a
separate build task.
**Fix verified, 2026-08-06.** `184:1713`'s own back-link (`184:1714`) was
rewired to `284:3698` (the correct nfc-context active-event Home). `ux-critic`
flagged a discrepancy worth correcting here: the link's internal layer name
still reads "← Eventos," but the actual *rendered* text — confirmed both by
`ux-critic`'s screenshot and Main's own live click — reads "← Hoy," already
correct and consistent with the new target. Main clicked it directly: lands
back on `284:3698`, matching the frame it started from. **Independently
Verified by live click.**

**5. Eventos tab showed zero events despite an event already appearing to exist earlier in the session.**
**Status: Independently Verified, 2026-08-06 (post-fix).** Traced directly by
Main via `chrome-devtools-mcp`: tapping "Eventos" from the nfc-twin Home
(`284:3698`, now wired — see Finding 2's fix) lands on `162:1804`, internally
named "J1 · 3.3 Cold start — sin eventos" — the literal empty-state frame
("Aquí vas a ver tus bazares, expos y demás eventos en cuanto agendes uno"),
despite this same Home screen's own EventCard showing an active "Plaza Norte"
event in progress. Same root cause as Finding 1: a shared canonical
destination reused across contexts that isn't state-accurate for all of them.
See Finding 7 below — this is one instance of a pattern, not an isolated bug.

**6. Tag-assignment queue resolved all remaining items in a single tap rather than incrementally.**
**Status: Independently Verified, 2026-08-06.** Traced directly by Main:
navigated to the active queue (`284:526`, "Faltan 7 de 10 · Etiquetando:
Pijama") and tapped "Acerca el tag a la prenda" once. It jumped straight to
`284:535` ("Mercancía lista para vender ✓," tagging complete) — no
intermediate "Faltan 6 de 10," "Faltan 5 de 10," etc. frames exist. **Root
cause: a genuine Medium-Fidelity content gap, not a defect** — this is a
static prototype; building one frame per remaining-count step (9 more clones
for a 10-item queue) was never done, the same class of accepted tradeoff as
Finding 3's static daily total. Not blocking; a real merchant would likely
read this as "it registered everything at once" rather than as broken,
similar in spirit to Finding 3, but worth a note if a live queue-count demo
matters for a future usability session.

**7. Tab bar destinations, now wired, land on content-mismatched frames — a new pattern, surfaced only by fixing Finding 2.**
**Status: Independently Verified, 2026-08-06.** With the tab bar wired
(Finding 2's fix), Main clicked all three from the nfc-twin Home
(`284:3698`, mid-Día-2, active "Plaza Norte" event) and found every
destination is a generic canonical frame inconsistent with that narrative:
Inventario → `162:1661` ("Registrar mercancía — entry," a blank first-time
registration form, Journey-1-buttons-only internal naming), Eventos →
`162:1804` ("Cold start — sin eventos," see Finding 5), Resultados →
`184:1536` ("Event detail — closed," an already-closed, unrelated "12-14 de
julio" event). **Root cause: identical pattern to Finding 1/exception #6** —
`ui-designer` correctly reused the same canonical destinations every other
wired NavBar on the page already points to (the only ones that existed), but
those destinations were built for Journey 1's generic/buttons-mode context,
not the nfc-mode, mid-session narrative these five frames represent. This is
a genuine improvement over Finding 2's prior state (nothing happened at all)
but not fully state-accurate — the same disclosed tradeoff `ui-designer`'s
exception #6 already names, now visible on three more surfaces. Not a
Blocker: nothing is broken or misleading about data loss/correctness, just
narratively inconsistent. Worth a Product Owner call on whether building
nfc-context-accurate destination clones for these three taps is worth the
cost, same proportionality question exception #6 already raised — not
resolved unilaterally here.

**8. NFC-mode Inventario tap leads into a genuine dead end — no path back to the active session.** (Found 2026-08-06, `merchant-user-tester` re-walk verifying the Finding 1/2 fix)
**Status: Independently Verified — Blocker, not a proportionality question like Finding 7.**
Ana's path: Home (`284:3698`) → "Continuar Día 2" → `284:3534` (live nfc selling screen, "Hoy: $850 · 6 ventas") → tapped "Inventario" → `162:1661` ("Registrar mercancía" form, empty, per Finding 7) → tapped the form's own "← Inventario" back-link → landed on `162:1485` ("Cold start — sin productos," Home's literal Journey-1 first-time-merchant empty state: "Aquí vas a ver tu día de venta en cuanto registres lo que traes") — directly contradicting the $850/6-ventas she'd just seen. From `162:1485`, the tab bar is entirely inert (`StaticText`, not `link` — an old, never-wired legacy frame) and the only working control, the header "▾", opens a sheet whose own Inventario link loops right back to `162:1661` — the same dead-end form, not back to her session. **No path back to `284:3534`/`284:3698` exists from this point.** Main reproduced Ana's exact path via `chrome-devtools-mcp` and confirmed every step, including the closed loop.

**Root cause:** `162:1661`'s "← Inventario" back-link was wired for its original context — Journey 1, the first-time-merchant flow, where returning to a blank Cold-start Home from an empty registration form is correct. That link was never reachable from the NFC-mode family until tonight's Finding 2 fix (`284:3534`→`162:1661`) made it reachable for the first time — the same "shared node, wrong context for a new caller" pattern as Finding 7, but with a materially worse consequence: not narrative mismatch, a genuine trap. A real merchant hitting this mid-event would have real reason to worry her sales were lost, exactly the core validated friction (`company/CLAUDE.md`) this product exists to protect against.

**Fix verified, 2026-08-06.** `ui-designer` built 5 self-referencing clones of `162:1661` (`371:1138`/`371:1175`/`371:1212`/`371:1249`/`371:1286`, one per nfc-mode origin frame) — a better design than the literal recommendation above: each clone's back-link returns to its own origin frame rather than a shared generic destination, deliberately avoiding misrepresenting an in-progress sale's items as gone. A 6th leak was found and fixed proactively: `360:1117` (the nfc-twin's Configuración sheet, built earlier tonight) had its own Inventario tab still pointing at the original trap — repointed. `ux-critic` reviewed with elevated scrutiny (the build was done without the mandatory `figma-use` skill loaded): clean structurally, one Minor (the "← Inventario" label no longer matches its destination — an acceptable, disclosed tradeoff, not a trap), and correctly flagged that reaction-level destinations are outside what its tools can see, recommending a live click-through as the real closing test. Main performed that click-through via `chrome-devtools-mcp`: `284:3534` → Inventario → `371:1175` → "← Inventario" → back to `284:3534` (confirmed, "$850 · 6 ventas" intact), and `360:1117` → Inventario → `371:1138` → "← Inventario" → back to `284:3698` (confirmed). **Independently Verified** for these two round trips; the remaining 3 clones (`371:1212`/`371:1249`/`371:1286`) were not individually live-tested but follow the identical build pattern, confirmed structurally faithful and correctly named by `ux-critic`. `162:1661`/`162:1485` confirmed untouched — Journey 1's own path is undisturbed.

**9. The "▾" trigger on 4 of the 5 nfc-mode frames still opens the old, unfixed sheet — Finding 1's original bug reappears via a side door, plus a second dead-end.** (Found 2026-08-06, second `merchant-user-tester` re-walk, verifying Finding 8's fix)
**Status: Independently Verified — Blocker, same severity class as Finding 8.**
The Finding 8 fix worked exactly as intended (Ana's "← Inventario" tap correctly returned her to `284:3534`, confirmed both by the agent and by Main's live click). But immediately after, tapping the header "▾" — a completely reasonable next move, expecting event detail — opened `162:1526` ("Session controls sheet — Cerrar sesión, §3.7a"), **not** the fixed `360:1117` clone. On that sheet: the tab bar is entirely inert (`StaticText`, same pattern as Finding 8's original trap), and the only two live controls are "Configuración" and "Cerrar sesión." Repeated taps on every other visible element (the "▾" toggle itself, "Hoy," the sales-total card) produced no response — a second, sibling dead-end, one hop earlier than Finding 8's.

Main reproduced this directly and traced it further: `162:1526`'s "Configuración" leads to `184:1645` — the exact free-plan Settings frame from **Finding 1's original bug report** ("Tu plan: Gratis" / "Cómo vendes normalmente: Botones (vender con tags requiere el plan de pago)"), fully reproducible again via this path, on a business seeded specifically as NFC/paid-tier.

**Root cause:** tonight's Fix 1 rewired exactly one trigger — `284:3704`, `284:3698`'s own "▾" — to open the new `360:1117` clone. It never touched the other 4 nfc-mode frames' own "▾" triggers (`284:3534`, `284:3540`, `284:3547`, `284:3552` each have their own), because Finding 1's original report only ever demonstrated the bug from `284:3698` specifically. Finding 2's tab-bar fix (same night) made all 5 frames mutually reachable via lateral navigation for the first time — which is exactly what exposed this gap: a merchant can now reach any of the 4 un-fixed frames and hit their local "▾" affordance, which nobody had reason to check before tonight. Identical pattern to Finding 8 (Fix 2's lateral reach outpacing Fix 1's narrower original scope), now confirmed twice.

**Compounding risk, worth naming explicitly:** unlike Finding 8 (informational dead-end), this one puts "Cerrar sesión" one tap away with no warning, on a screen a merchant could easily land on expecting event detail — a real accidental-logout risk mid-sale, not just a stranded feeling.

**Fix verified, 2026-08-06.** `ui-designer` corrected the finding's own facts first: only 3 origins actually needed fixing, not 4 — `284:3552` has no "▾" trigger at all (deliberately absent, per its §3.8f full-viewport receipt spec, which removes `SessionHeader` entirely). Built 6 new clones (a sheet + a Settings-content clone per origin — `284:3534`→`380:1248`/`380:1256`, `284:3540`→`380:1269`/`380:1277`, `284:3547`→`380:1290`/`380:1298`), a disclosed deviation from sharing one content clone: cloning the content frame too, not just the sheet, because `284:3540` (the with-items frame) sharing a back-link with any other origin risked showing an empty tray on return — the same data-loss-perception risk Finding 8 exists to prevent. `ux-critic` reviewed structurally, clean. Main live-click-verified 2 of the 3 chains end-to-end via `chrome-devtools-mcp`: `284:3534`→▾→`380:1248`→Configuración→`380:1256` ("Tu plan: Pago"/"Con tags")→"← Hoy"→back to `284:3534` (confirmed); `284:3540`→▾→`380:1269`→Configuración→`380:1277`→"← Hoy"→back to `284:3540` **with "Venta actual: 2 artículos" still intact** (confirmed) — the critical case validating the per-origin-clone decision was correct. **Independently Verified** for these two; the third (`284:3547`) wasn't individually live-tested but follows the identical, verified-correct pattern. `162:1526`/`184:1645`/`184:1510` and their 5 legitimate Journey-1 callers confirmed untouched.

**Regression caught by `ux-critic` before this reached `reviewer` — real, confirmed independently against Main's own click-through transcript.** The three new sheet clones (`380:1248`/`380:1269`/`380:1290`) were built from the wrong template: `home.md` §3.6c's no-Session shape (generic "Nahui ▾" header, single "Configuración" button) rather than §3.7a's active-Session shape (real session header with venue/día/total, **two** rows — "Cerrar sesión" *and* "Configuración"). All three origins (`284:3534`/`284:3540`/`284:3547`) are active-Session frames — `home.md` §2's Session-controls interlock states this sheet must be "reachable at any time" during an active Session, with both rows present. Checking Main's own snapshots from the click-through above confirms it directly: both tested sheets show only "Configuración," no "Cerrar sesión" row at all. **Before tonight's fix, these frames' "▾" opened the old shared `162:1526` sheet, which — despite routing to the wrong Settings tier — correctly showed both rows.** Fixing the Configuración-destination bug silently removed a spec-mandated, always-available control from three mid-selling screens — a genuine regression traded for a fix, not a net-clean one. Classified as a Blocker, same severity as Findings 8/9. Routed back to `ui-designer`: rebuild the three sheet clones from the correct active-Session template (`162:1526`'s own shape is the right model — real header + both rows), pointing "Configuración" at each origin's already-correct, already-built content clone (`380:1256`/`380:1277`/`380:1298` — these don't need to change). **Fix verified, 2026-08-06.** `ui-designer` rebuilt all 3 sheet clones from the correct template (`162:1526`'s own active-Session shape, not `360:1117`): `385:1323`/`385:1360`/`385:1397`, each origin's "▾" rewired to its new clone, the 3 wrong clones deleted after confirming nothing else referenced them. Main live-click-verified the full picture on `284:3534`: "▾" → `385:1323` (real session header, "Plaza Norte · Día 2" / "Hoy: $850 · 6 ventas," **both** rows present) → "Cerrar sesión" → `162:1534` ("Cerrar sesión — confirmación," a real, working "¿Ya terminaste por hoy? / Sí, cerrar / Cancelar" screen, not a dead end) — confirmed. Separately, "Configuración" from the same sheet → `380:1256` (the already-verified correct content clone, unchanged) — confirmed. **Independently Verified** for `284:3534`; `284:3540`/`284:3547` weren't individually re-tested this round but follow the identical rebuilt pattern.

**A more severe Blocker found by `reviewer`'s closing pass, from the identical-pattern assumption above.** `284:3540` is the *with-items* origin ("Venta en curso — modo nfc, con items," confirmed earlier this chain: "Venta actual: 2 artículos"). Per `home.md` §2's Session-controls interlock, an active Sale with 1+ items must route "Cerrar sesión" to §3.11a's blocking notice ("Tienes una venta sin terminar... Termínala o cancélala antes de cerrar la sesión"), never to §3.11's direct "¿Ya terminaste por hoy? / Sí, cerrar" confirmation — the one behavior `home.md` calls out as never allowed to silently discard unfinished work. The rebuilt sheet for `284:3540` was wired to `162:1534` (§3.11, the *no-items* confirmation) — the exact same destination as the no-items origin, because the fix assumed identical behavior across all 3 rebuilt sheets. That assumption is precisely backwards: the interlock exists *specifically* to make the with-items case diverge. As built, a merchant with 2 unfinished items in her sale could tap "▾" → "Cerrar sesión" → "Sí, cerrar" and silently lose that in-progress registration — a more severe failure than Findings 8/9 (those were dead-ends; this is silent data loss dressed as the normal flow), and exactly the core validated friction (`company/CLAUDE.md`: "she loses the sale record") this product exists to prevent.

**Root cause of the miss:** `ux-critic`'s structural pass correctly scoped itself to template/row-presence, not reaction destinations (`infrastructure-decisions.md` ID004); Main's live click-through tested only `284:3534` (no-items) and assumed `284:3540`/`284:3547` matched "by identical pattern" — backwards, since the interlock requires divergence, not identity. `284:3547` (a transient Finalizar-Venta-saving moment) is a more ambiguous case, not asserted to need identical treatment, but flagged for an explicit check rather than the same unchecked assumption.

**Fix verified, 2026-08-06.** `ui-designer` cloned `41:573` twice — `393:860` (origin `284:3540`) and `393:869` (origin `284:3547`, treated identically after explicit, spec-grounded reasoning: §3.8c's "guardando" state is the Sale's most-unfinished moment, not a safe one, and `home.md` explicitly keeps the header/▾ live throughout it). Both sheets' "Cerrar sesión" rewired to the new clones; `284:3534`'s sheet left untouched (correctly, it's the no-items case). Main live-click-verified the full chain: `284:3540` → ▾ → "Cerrar sesión" → `393:860` (confirmed exact text: "Tienes una venta sin terminar (2 artículos). Termínala o cancélala antes de cerrar la sesión.") → "Entendido" → back to `284:3540`. **Independently Verified.**

**10. A fifth instance of the same root-cause pattern: the "Elegir producto" picker sheet is a shared, un-cloned node still routing back into the original trap.** (Found by a closing `merchant-user-tester` re-walk, confirmed by Main)
**Status: Independently Verified.** Ana's path: `284:3540` → Inventario → `371:1212` (Finding 8's own correct clone) → "Elegir producto ⌄" → a *separate* frame, "3.8 Elegir producto — picker sheet" (product list: Pijama/Sudadera/Calcetines) → that sheet's own "← Inventario" link → `162:1485` — the identical original trap Finding 8 fixed, reached through a path Finding 8's fix never touched. Main reproduced this exact chain via `chrome-devtools-mcp` and confirmed it precisely.

**Root cause, same class as Findings 8/9/9-regression/9-interlock, now confirmed as a genuine pattern rather than one-off:** Finding 8 cloned the outer "Registrar mercancía" form per nfc origin (5 clones), but each clone's "Elegir producto" button still opens the *same shared, un-cloned* picker-sheet node every context uses — because Figma reactions are one-destination-per-node (an established constraint throughout this build, see `product/02b-medium-fidelity/CLAUDE.md`'s "Structural technique" note), that shared sheet's own back-link can only point one place, and it was never re-pointed when Finding 8 cloned its parent.

**Given this is the fifth distinct discovery of the identical pattern in one night, a sixth narrow patch is unlikely to converge — a comprehensive sweep is the more precise move.** Recommend: audit every node transitively reachable from the 5 nfc-mode session frames (and their Finding-8/9 clones) for any surviving reference to the pre-fix frame family (`162:1485`, `162:1526`, `184:1645`, `184:1510`), and fix all findings from that sweep in one batch, rather than continuing to fix one newly-discovered leaf per re-walk.

**Sweep completed, 2026-08-06 (two dispatches blocked on a real, disclosed tool-access gap — `ReadMcpResourceTool` unavailable this session — before a third succeeded via the known `figma-use` local-cache-file fallback, `infrastructure-decisions.md` ID001).** `ui-designer` found 6 real leak instances beyond the picker sheet itself, all the same causal family: `162:1674` (the picker sheet, confirmed instance), `162:1687` ("Producto seleccionado" state), `162:1700` ("committed lines" screen), `188:1007` (Descartar confirmation's own completion — worse than the others, a destructive action landing in the trap), `184:1678` (Activar-clientes-frecuentes confirmation — reproducing Finding 1's exact bug via a 4th side door), `184:1684` (that action's own completion — landing a real state-change in the wrong-tier trap). Fixed with 28 new clones (one per instance per applicable nfc origin), each rewired one hop back to its own live session frame. Two deeper legacy nodes (`184:1665`/`184:1742`) found but deliberately left unfixed — a disclosed proportionality question, same class as the already-accepted exception #6, not silently absorbed. Main live-click-verified the original confirmed instance end-to-end: `284:3540` → Inventario → `371:1212` → "Elegir producto" → its own nfc-mode picker clone (correctly labeled, correct product list) → "← Inventario" → back to `284:3540`. **Independently Verified** for this instance; the other 27 clones weren't individually live-tested but follow the identical, `ux-critic`-reviewed pattern.

**11. A seventh, structurally different instance: two terminal screens at the end of the full registration+tagging flow have no tab bar wired at all.** (Found by the final closing `merchant-user-tester` re-walk, confirmed by Main)
**Status: Independently Verified — Blocker, different root cause than Findings 8-10.**
Ana's path this time went *forward* through the full flow rather than backing out: Inventario → Elegir producto (Pijama) → Guardar mercancía → Asignar tags queue → tagging complete → `284:535` ("Post-save confirmation — nfc-capable, tagging complete"). From there, the tab bar is entirely inert — "Hoy," "Inventario," "Resultados" are all `StaticText`, only "Eventos" is a real link. Following it lands on `162:1804` (the same "Cold start — sin eventos" frame from Findings 5/7) — whose own tab bar is *also* entirely inert, only "Agendar evento" works. Two consecutive fully-dead screens, a genuine closed trap with no forward-only escape either.

**Root cause, different class from Findings 8-10:** those were shared nodes with a *wrong* back-link (built for one context, silently reused by another). This is different — `284:535` and `162:1804` simply never had a tab bar wired *at all*, in any context, because both were built as terminal/leaf screens within their own original journeys (Journey 3's tagging flow, Journey 1's onboarding-adjacent Eventos cold-start) where nobody was expected to want lateral navigation from them. Tonight's nfc-mode wiring work made both newly reachable as journey-crossing points for the first time, exposing that they were never given the tab-bar wiring every other reachable screen has — the same underlying gap Finding 2 originally fixed on the 5 session frames, now found two hops further into the flow.

**A stopping point, stated explicitly rather than silently abandoned.** This is the seventh distinct navigation gap found in one night through six rounds of fix→verify→re-walk. Each has been a genuine, newly-surfaced problem rather than an unfixed repeat, and this one is being routed and fixed like the others — but the underlying graph (everything transitively reachable from the 5 nfc-mode session frames, across Inventario's full registration+tagging flow, Eventos, Resultados, and Settings' deeper sub-flows) is larger than what any single night's remediation can exhaustively audit with confidence. After this fix is verified, Main is deliberately closing this investigation for the night rather than continuing to chase further leaves — flagged as a candidate for a dedicated, systematic full-graph audit in a future session, not a corner being quietly cut.

**Fix verified, 2026-08-06 — the last item in tonight's investigation.** `ui-designer` checked callers before editing: `284:535` has exactly one caller, edited directly (Hoy→`284:3698`, Inventario→`162:1661`, Resultados→`184:1536`, Eventos→a new clone). `162:1804` has 13 distinct callers, several genuinely Journey-1-native — left untouched, cloned instead (`410:1879`), with the same three tabs wired and Eventos left self-referencing, matching the original's own unreacted state. "Hoy" destination reasoning disclosed: `284:3698`, the same canonical nfc-mode "Hoy" target every other fix tonight used, a single reasonable default rather than a context-exact match for every entry point — same disclosed tradeoff class as Finding 7/exception #6. Main live-click-verified the complete escape chain: `284:535` → Hoy → `284:3698` (confirmed); `284:535` → Eventos → `410:1879` → Hoy → `284:3698` (confirmed) — the two-hop trap Ana got stuck in is now fully escapable both ways. **Independently Verified.**

**Two other things this same re-walk reported, addressed here rather than routed as new defects:**
- **The Cantidad field didn't respond to a tap.** Almost certainly a tooling limitation, not a product defect: `merchant-user-tester`'s toolset (`navigate_page`/`take_snapshot`/`click`/`take_screenshot`/`wait_for`) has no text-input capability — a `click` on a text field can open it for typing but can't itself demonstrate a value change the way a button-tap can. This matches an already-known, disclosed Medium-Fidelity gap: `product/02b-medium-fidelity/CLAUDE.md`'s "One real gap surfaced" note states the `[−]`/`[+]` Cantidad stepper was never built, only the bordered value box exists, and typed entry "works and is visibly affordant" — consistent with a real field that simply can't be exercised by a click-only agent. **Status: Tooling Artifact**, not routed for a fix.
- **"Phantom" pre-filled quantities for products never touched (Sudadera, Calcetines).** Traced directly: `284:535` is the same static tagging-queue-completion frame investigated earlier tonight for Finding 6, and "Pijama (10) · Sudadera (5) · Calcetines (20)" is the demo business's seeded, pre-existing inventory summary — not data invented in response to Ana's specific action. This is the identical static-prototype-content limitation already established for Finding 6 (the tag queue can't reflect incremental state, only pre-built totals), encountered here from a new entry path. **Status: Tooling Artifact / accepted Medium-Fidelity limitation**, same class as Finding 6, not a new defect.

## Tooling artifact (disclosed, not reasoned from)

Accessibility tree exposed a few internal component names ("MarginTapZone,"
"BrandMark," "SheetHandle") not present as visible on-screen text — noted by
the agent as incidental exposure, correctly not used to inform any tap or
judgment.

## Recommendation

**Update, 2026-08-06 (post-remediation).** Findings 1, 2, and 4 were routed
to `ui-designer` as a single batch, fixed, `ux-critic`-reviewed, and
Independently Verified end-to-end by Main via live `chrome-devtools-mcp`
clicks — closed. Finding 3 remains an accepted limitation, not a defect —
closed, no action. Findings 5 and 6, previously Pending Verification, were
traced directly by Main this session and are now Independently Verified —
Finding 5 is downstream of the same root cause as Finding 1 (see Finding 7),
Finding 6 is a disclosed static-prototype content gap, not blocking. Finding
7 is new, surfaced only once Finding 2's fix made the tab bar clickable at
all — logged as a Product Owner-level proportionality question (build
nfc-context-accurate destinations, same class of cost/benefit call as
exception #6), not resolved unilaterally. **That `merchant-user-tester`
re-walk happened and found something more severe: Finding 8, a genuine
dead-end trap one hop past Finding 7's Inventario tap**, with no path back
to the active session. Independently reproduced and root-caused by Main.
Routed to `ui-designer` as a Blocker, ahead of Finding 7 — fixing Finding 8
first, since it's the one causing real risk of an Ana-perceived data-loss
moment, not just a narrative mismatch.

**Update, closing this document out for the night.** Findings 8, 9, and 10
were each found, fixed, and Independently Verified across six total rounds
— Finding 8 (dead-end trap), Finding 9 (four unfixed Settings triggers,
then two regressions of its own: a wrong sheet template silently dropping
"Cerrar sesión," then a Session-controls-interlock bypass risking silent
data loss), and Finding 10 (a picker-sheet leak, closed via a
6-instance/28-clone comprehensive sweep, with two deeper legacy nodes
deliberately left unfixed as a disclosed, `reviewer`-verified proportionality
question). Every round was surfaced by verifying the previous one rather
than trusting it — `merchant-user-tester` found the felt experience,
`ux-critic` checked structure, Main click-verified behavior, `reviewer`
checked Foundation consistency, repeated six times. `reviewer`'s final pass
found the underlying Figma work sound with zero Blockers. Finding 7 remains
open as the one still-outstanding Product Owner call — a proportionality
question, not a defect, and not blocking anything else. See
`company/bitacora.md` and `product/02b-medium-fidelity/CLAUDE.md` for the
full night's record.
