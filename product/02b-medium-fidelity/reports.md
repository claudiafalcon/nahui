# Resultados — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/reports.md`, Approved (Q8/Q9 resolved and applied — D20 Venue, D22 Derived Customer Intelligence). Medium-Fidelity work reflects that current state. One doc-drift item found during this review (stale Q5 references vs. D25) — see Known gaps; not blocking, tracked for `ux-designer`.

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4` ("Nahui — Medium-Fidelity UI"), page **"Resultados — Medium Fidelity"** (`58:2`). All 14 `reports.md` §5 states covered across 16 frames (§3.6's three reachable sub-states split into their own frames — `60:97`, the retired `loyaltyEnabled=false` state, deleted 2026-08-09, D34 cascade fix, see Known gaps):

| Frame | reports.md state |
|---|---|
| `58:3` | §3.1 Resolving — near-instant |
| `58:16` | §3.2 Resolving — slow |
| `58:28` | §3.3 Cold start — no Session ever closed |
| `59:38` | §3.4 Main view — free tier, con En curso |
| `59:68` | §3.5 Main view — free tier, sin evento activo |
| `60:64` | §3.6 Main view — paid tier (Tus clientes, con datos) |
| `60:128` | §3.6 Main view — paid tier (Tus clientes, sin Claims aún) |
| `60:161` | §3.6 Main view — paid tier (Rendimiento sin eventos registrados) |
| `61:112` | §3.7 Session detail |
| `61:144` | §3.8 Event detail — closed |
| `62:130` | §3.9 Rendimiento por bazar — con datos |
| `62:159` | §3.10 Rendimiento por bazar — sin eventos registrados |
| `62:179` | §3.11 Rendimiento por bazar — detalle de bazar |
| `63:164` | §3.12 Tus clientes — segmentación (con datos) |
| `63:187` | §3.13 Tus clientes — sin datos aún |
| `58:43` | §3.14 Defensive fallback — load error |

Shared Design System page: `0:1`. Reused: `Button`, `NavBar`, `EventCard`, `BackNav`, `Skeleton`. New pattern introduced this pass: bare coral `▸` row-tappability chevron (Día rows §3.8, VenueRow §3.9) — see Known gaps.

**Added 2026-08-09 (overnight autonomous session) — Loyalty Participation view, `decision-log.md` D35/D37/D39, `product/99-rfc/0004`/`0005` both Accepted:**

| Node | reports.md state |
|---|---|
| `757:5643` | §3.15 Recompensas — con datos |
| `757:5693` | §3.16 Detalle de clienta — con recompensa lista |
| `757:5728` | §3.16 Detalle de clienta — sin recompensa lista |
| `757:5761` | §3.16 Detalle de clienta — actualizado tras confirmar (post-write) |
| `758:508` | §3.17 Confirmar recompensa entregada |
| `758:5721` | §3.18a Guardando — near-instant |
| `758:5725` | §3.18b Guardando — slow |
| `758:5727` | §3.18c Error al guardar |
| new children of `63:164`/`63:165` (`758:5731`) | §3.12 append — "Recompensas" teaser row |
| new children of `63:187`/`63:188` (`758:5737`–`758:5739`) | §3.13 append — Configuración pointer paragraph (closed a pre-existing gap — this paragraph was in the Approved Low-Fidelity spec but had never been built) + passive "Recompensas" line |

Wiring verified via fresh `node.reactions` readback, both `action`/`actions[]` populated (ID007): §3.12's new row → `757:5643`; §3.15's three cards → their respective §3.16 variants (the two "en camino" cards share the "sin recompensa lista" example destination — same accepted static-content pattern already established elsewhere in this file, not a defect); confirm chain `757:5705`→`758:508`→`758:515`→`758:5721`(`AFTER_TIMEOUT` 0.6s)→`757:5761`; `758:5729` ("Reintentar") → `758:5721`. §3.17/§3.18 carry no NavBar, matching the approved wireframe.

§3.17 was built as fresh nodes matching the existing `settings.md`-style confirm-screen shape rather than a literal cross-page clone (100% of content diverges from the source anyway) — no content/behavior difference from what was specified.

One bug caught and fixed during `ui-designer`'s own verification: the cloned `AmbientToast` on `757:5761` initially clipped "Recompensa confirmada ✓" (inherited fixed width from its source). Fixed (`textAutoResize='WIDTH_AND_HEIGHT'`, re-centered), re-verified via screenshot.

## 3. Review status per screen
Full cycle complete: `ui-designer` build → `ux-critic` review (2 Major + 1 Minor found: undersized Día-row tap targets, weak tappability signal reusing the new coral-chevron pattern from the doc's own teaser rows, plus one Minor) → `ui-designer` remediation → `ux-critic` verification (clean, 0 Blockers, 0 remaining findings) → `reviewer` Foundation-consistency pass: **0 Blockers; 2 Important findings** — (1) `reports.md`'s own §3.6/§10/§11 Q5 references are stale against `decision-log.md` D25 (Q5 now Resolved), doc-level drift, not a Figma-build defect; (2) the new coral-chevron row-tappability pattern wasn't yet documented in `company/brand/brand-guide.md` (now fixed — see below). Neither blocks completion of this document. **All 17 frames: complete. Fourth document to complete the Medium-Fidelity tier.**

**Loyalty Participation view (2026-08-09, overnight autonomous session) — done.** `ui-designer` build complete, self-verified via `get_metadata`/`get_screenshot`. `ux-critic` round 1: 1 Major (§3.15's Header, `757:5647`, clipped its own two-line subtitle, colliding with the section label below) — fixed (switched to hug-content sizing, 5 downstream siblings repositioned). `ux-critic` verification, elevated scrutiny per `infrastructure-decisions.md` ID001 (fix built without the mandatory `figma-use` skill loaded): clean. Final sweep (also covering both D34 cascade fixes on this page): clean. `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean.** Independently re-derived (not just accepted) the Primary-vs-Destructive styling question for "Confirmar recompensa entregada" and concurred it's correct (Destructive is scoped to discard/cancel actions per `brand-guide.md`'s own definition; this is an affirmative process-completion action, same category as Finalizar Venta). One disclosed, not-independently-verifiable-by-`reviewer`'s-toolset boundary: the `60:97` deletion's reaction-level safety (no dangling references) was verified by `ui-designer` via `node.reactions` — the correct tool for that specific claim, outside `reviewer`'s own read-only scope (ID004) — not a gap in the artifact. **Folded into done.**

**`loyaltyEnabled` retirement (2026-08-09, `decision-log.md` D40) — done.** §3.13's zero-Claims empty state (`63:187`) had a stray built text node, `758:5737`, reading "Puedes revisar esto en Configuración ('Activar clientes frecuentes')" — a real Figma-build node, not just stale spec prose. `ui-designer` confirmed it carried no reactions (never tappable) and removed it entirely. `ux-critic` verified clean — the screen closes naturally after the Recompensas sub-line with no orphaned gap; full-page sweep of `58:2` found no other stale `loyaltyEnabled`/Configuración-pointer residue anywhere else (§3.4/§3.5/§3.6/§3.12 all confirmed clean). `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean.** "Tus clientes"'s own visibility gate was untouched by this fix (already `subscriptionTier=paid` alone, D34) — only the now-retired Configuración pointer was removed.

## 4. Deviations from the upstream spec
None — no layout constraint forced a departure from `reports.md`'s specified behavior, copy, or states.

## Known gaps (tracked here, not blocking)
- **NavBar contrast: all four variants now consistent.** `active=Resultados` confirmed rebound to `color/tezontle-dark`, closing the item tracked in `home.md`/`inventory.md`/`events.md`'s own Known gaps sections. No NavBar contrast work remains for this file's variants.
- **`reports.md`'s Q5 references — fixed.** All four stale citations (§2, §3.6, §10, §11 — one more than `reviewer` originally spotted, same error) now correctly state Q5 is Resolved (`decision-log.md` D25) and point to `settings.md` as the actual toggle location. `ux-designer` made the judgment call on whether §3.6's `loyaltyEnabled=false` note should gain a Settings pointer: yes, as plain text naming "Configuración, en el menú de Hoy" — but deliberately not a new tappable affordance, since Configuración isn't a nav-bar tab and making the row itself jump there would mean inventing an unscoped cross-tab navigation hand-off. §11's now-resolved anticipatory bullet was removed, matching this doc's own established pattern (the identical treatment already applied when Q9/Venue resolved).
- **New coral-chevron row-tappability pattern — now documented in `brand-guide.md`.** Reasonable token reuse, no new color, no RFC needed. Added a one-line note to the brand guide (same treatment as the Destructive button variant) so `onboarding.md`/`settings.md`'s upcoming Medium-Fidelity builds reuse it rather than inventing a different signal.
- **Error-color outlier — fixed.** Frame `58:43`'s defensive-fallback text was rebound from `color/error` to `color/muted`, matching the dominant convention (`home.md`, `events.md`, `inventory.md`, `onboarding.md` all correctly use plain text for passive tab-load failures, reserving Error red for write-action failures with real consequence). Verified via token-level `get_design_context` re-check and an independent visual screenshot. `brand-guide.md`'s Status colors section now documents this distinction explicitly.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's 3 Primary instances; this page has no Tertiary-variant instances. `ux-critic` verified clean via an independent instance-level sweep, including confirming zero Tertiary-height instances exist on this page (a specifically re-checked claim, held up exactly — 3 of 3).
- **2026-08-04 batch: hero cards, headline synthesis statements, "Top productos," rank numbers, Event type on cards — built and fully verified (full cycle: `ui-designer` → `ux-critic` including one Major visual-weight fix → `reviewer`, clean).** Per the same-day `reports.md` amendment (ticket promedio, "Top productos · todo tu historial," two headline paired-fact statements, plain rank numbers on "Rendimiento por bazar"). One Major finding en route (headline statements read weaker than the section labels below them, undermining the whole synthesis fix) — fixed via a distinct Blush-tint card treatment, 20/28 Semi Bold, verified across all 6 main-view clones.
- **`ProportionBar` on "Tus clientes" — built, then removed same day, Product Owner call.** Not authorized by spec; mirrored a magnitude-implying device the Product Owner had already rejected for venue ranking. Removed from all 3 affected frames (`60:64`, `60:161`, `63:164`), reverted to spec's plain-text format. `ux-critic` confirmed clean on removal, but found one follow-on layout defect (below) during close-out.
- **D34 Medium-Fidelity cascade gap, part 1 — fixed 2026-08-09.** `decision-log.md` D34 (2026-08-08) corrected "Tus clientes" gating from a joint `subscriptionTier=paid AND loyaltyEnabled=true` gate to `subscriptionTier=paid` alone, collapsing the Low-Fidelity spec's separate `loyaltyEnabled=false` state into the single zero-Claims empty state (§3.13). The Low-Fidelity text was corrected same-day (2026-08-08); this Medium-Fidelity build wasn't cascaded until now. `ui-designer` audited all 9 pages of the file for live callers into `60:97` — found zero (it and its three §3.6 sibling sub-state frames were all already unwired on this page) — then deleted the frame outright, per this project's own established precedent for retired, spec-contradicting content with confirmed zero references. Verified via fresh `get_metadata`: `60:97` gone, all sibling frames (`60:64`, `60:128`, `60:161`, `63:164`, `63:187`) untouched.
- **D34 Medium-Fidelity cascade gap, part 2 — fixed 2026-08-09.** While fixing part 1, `ui-designer` independently noticed a second instance of the identical gap on a different node family: the free-tier "Nota informativa" text still read the retired conditional framing ("Si además activas el seguimiento de clientas..."). Fixed on the actual editable text-node children (corrected from the originally-cited parent-frame IDs): `59:58` (§3.4), `59:83` (§3.5), `256:470` (zero-sales graceful-degradation variant) — all now read the current Approved unconditional sentence verbatim, verified via fresh `get_metadata`. A full-page sweep confirmed these were the only three instances. `ux-critic` visual spot-check pending (the fix was text-content-verified but not yet screenshot-confirmed).
- **Orphaned centering gap, 4 frames — found and fixed.** Removing `ProportionBar` left its parent Content frame stuck at a fixed height with center alignment (stranding content mid-screen) on `63:164`, and the same latent bug — previously unnoticed since taller content mostly masked it — was found on 3 more frames: `61:112` (§3.7), `61:144` (§3.8), `63:187` (§3.13). Fixed on all 4: switched Content frames from fixed-780/center to hug-content/top-aligned, matching the correct pre-existing pattern on `62:131`/`62:180` (§3.9/§3.11). `ux-critic` and `reviewer` both confirmed clean, zero findings, pure layout fix (no copy/content changed). Fully closed.
