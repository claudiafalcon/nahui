# Experience Review — 2026-08-07: Pending-tags task-priority validation

**Persona:** Ana (single approved Merchant Experience Kit persona).
**Run type:** `merchant-user-tester`, standard cycle (post `ux-critic`/`reviewer` clean pass on both the `product/02-ux/inventory.md` spec amendment and its Medium-Fidelity build).
**Purpose:** validate whether the 2026-08-07 pending-tags task-priority refinement (`inventory.md` §3.5/§3.17 — "Continuar etiquetando" primary, "Registrar mercancía" secondary) actually delivers, for a first-time merchant, the intended experience: obvious next action, no confusion, no feeling of repeating work.
**Task given:** activate the paid/NFC plan, register newly-arrived merchandise, begin tagging, defer partway via "Terminar después," step away to look around elsewhere in the app, then return and finish.

## Verdict on the core question: Validated

At the exact moment being tested — returning to Inventario after deferring tagging — Ana's own words:

> "the moment of returning to Inventario after stepping away: the 'Te faltan 7 artículos por etiquetar' messaging and prominent 'Continuar etiquetando' button were exactly the reassurance I needed."

> "Most notably, the app perfectly preserved my in-progress tagging state across a full detour... that's exactly the kind of protection of my effort I'd want as a real vendor who gets interrupted constantly."

> "no perdí nada, hasta les seguí después" — cited as the single thing she'd tell another vendor about.

Confidence trajectory names this moment as the point confidence "rose the most" in the entire session. Nothing in the report describes the moment as feeling like repeating work — the opposite: explicit relief at continuity being preserved. **Verification status: Independently Verified** — Main confirmed the same screen, same button hierarchy, same working "Continuar etiquetando" → resume and "Registrar mercancía" → new-entry wiring via direct `chrome-devtools-mcp` click-through immediately before this run (see `company/bitacora.md`, 2026-08-07).

## Confirmed defect found during this run (in scope, fixed same day)

**Dead bottom nav bar on the new pending-tags clones (`593:526`/`593:542`).** Ana: "tapping 'Eventos,' 'Hoy,' and 'Resultados' in the bottom nav produced no response at all — three consecutive dead taps on the exact screen where the task asked me to step away and look around." **Verification status: Independently Verified** — Main confirmed structurally via `take_snapshot`: the four nav items render as plain `StaticText`, not `link`, in the accessibility tree (same diagnostic `reviewer` has used previously for this exact defect class). Root cause: these are brand-new clones, created today, after the 2026-08-07 tab-bar restoration swept the rest of this journey — they never inherited that fix. Routed to `ui-designer` as a small follow-up (see below).

## Other findings surfaced, outside this task's scope — Pending Verification

Not independently checked by Main yet; reporting as raised, not as confirmed defects. Two are very likely already-accepted, previously-disclosed limitations; the rest are new and unverified either way.

1. **Plan activation appeared not to "stick" on the first attempt** — Ana completed the full "Activar plan de pago" → "Todo listo" sequence, then later found Configuración still showing "Tu plan: Gratis," requiring a second activation. Potentially significant — worth checking whether this is a session/demo-state artifact or a real regression, possibly interacting with today's earlier Home-node clone fix. **Not yet investigated.**
2. **Home screen silently changed from idle to an active "Plaza Norte · Día 2" event state** between two navigations, with no visible transition or action by Ana that would explain it. **Not yet investigated.**
3. **"Cantidad" field did not respond to taps** in "Registro de mercancía" — could not be changed from 1. **Not yet investigated.**
4. **Product picker always resolved to "Pijama"** regardless of which product was tapped. **Likely already an accepted, disclosed limitation** — matches the "one populated frame, not a full combinatorial matrix" gap the Product Owner explicitly ruled a non-defect on 2026-08-06 (`product/02b-medium-fidelity/CLAUDE.md`).
5. **Tagging queue resolved entirely on a single tap** rather than decrementing one unit at a time. **Likely already an accepted, disclosed limitation** — same class as Finding 6's already-accepted static-content gap from the 2026-08-06 review.

## References
- `product/02-ux/inventory.md` §3.5/§3.17/§10
- `product/02b-medium-fidelity/inventory.md`, `product/02b-medium-fidelity/CLAUDE.md`
- `company/bitacora.md` (2026-08-07 entries, full investigation record)
- `company/infrastructure-decisions.md` ID012, ID013
