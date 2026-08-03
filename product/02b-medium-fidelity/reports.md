# Resultados — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/reports.md`, Approved (Q8/Q9 resolved and applied — D20 Venue, D22 Derived Customer Intelligence). Medium-Fidelity work reflects that current state. One doc-drift item found during this review (stale Q5 references vs. D25) — see Known gaps; not blocking, tracked for `ux-designer`.

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4` ("Nahui — Medium-Fidelity UI"), page **"Resultados — Medium Fidelity"** (`58:2`). All 14 `reports.md` §5 states covered across 17 frames (§3.6's four reachable sub-states split into their own frames):

| Frame | reports.md state |
|---|---|
| `58:3` | §3.1 Resolving — near-instant |
| `58:16` | §3.2 Resolving — slow |
| `58:28` | §3.3 Cold start — no Session ever closed |
| `59:38` | §3.4 Main view — free tier, con En curso |
| `59:68` | §3.5 Main view — free tier, sin evento activo |
| `60:64` | §3.6 Main view — paid tier (Tus clientes, con datos) |
| `60:97` | §3.6 Main view — paid tier (Tus clientes, loyaltyEnabled=false) |
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

## 3. Review status per screen
Full cycle complete: `ui-designer` build → `ux-critic` review (2 Major + 1 Minor found: undersized Día-row tap targets, weak tappability signal reusing the new coral-chevron pattern from the doc's own teaser rows, plus one Minor) → `ui-designer` remediation → `ux-critic` verification (clean, 0 Blockers, 0 remaining findings) → `reviewer` Foundation-consistency pass: **0 Blockers; 2 Important findings** — (1) `reports.md`'s own §3.6/§10/§11 Q5 references are stale against `decision-log.md` D25 (Q5 now Resolved), doc-level drift, not a Figma-build defect; (2) the new coral-chevron row-tappability pattern wasn't yet documented in `company/brand/brand-guide.md` (now fixed — see below). Neither blocks completion of this document. **All 17 frames: complete. Fourth document to complete the Medium-Fidelity tier.**

## 4. Deviations from the upstream spec
None — no layout constraint forced a departure from `reports.md`'s specified behavior, copy, or states.

## Known gaps (tracked here, not blocking)
- **NavBar contrast: all four variants now consistent.** `active=Resultados` confirmed rebound to `color/tezontle-dark`, closing the item tracked in `home.md`/`inventory.md`/`events.md`'s own Known gaps sections. No NavBar contrast work remains for this file's variants.
- **`reports.md`'s Q5 references — fixed.** All four stale citations (§2, §3.6, §10, §11 — one more than `reviewer` originally spotted, same error) now correctly state Q5 is Resolved (`decision-log.md` D25) and point to `settings.md` as the actual toggle location. `ux-designer` made the judgment call on whether §3.6's `loyaltyEnabled=false` note should gain a Settings pointer: yes, as plain text naming "Configuración, en el menú de Hoy" — but deliberately not a new tappable affordance, since Configuración isn't a nav-bar tab and making the row itself jump there would mean inventing an unscoped cross-tab navigation hand-off. §11's now-resolved anticipatory bullet was removed, matching this doc's own established pattern (the identical treatment already applied when Q9/Venue resolved).
- **New coral-chevron row-tappability pattern — now documented in `brand-guide.md`.** Reasonable token reuse, no new color, no RFC needed. Added a one-line note to the brand guide (same treatment as the Destructive button variant) so `onboarding.md`/`settings.md`'s upcoming Medium-Fidelity builds reuse it rather than inventing a different signal.
- **Error-color outlier — fixed.** Frame `58:43`'s defensive-fallback text was rebound from `color/error` to `color/muted`, matching the dominant convention (`home.md`, `events.md`, `inventory.md`, `onboarding.md` all correctly use plain text for passive tab-load failures, reserving Error red for write-action failures with real consequence). Verified via token-level `get_design_context` re-check and an independent visual screenshot. `brand-guide.md`'s Status colors section now documents this distinction explicitly.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's 3 Primary instances; this page has no Tertiary-variant instances. `ux-critic` verified clean via an independent instance-level sweep, including confirming zero Tertiary-height instances exist on this page (a specifically re-checked claim, held up exactly — 3 of 3).
