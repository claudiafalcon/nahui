# Experience Review — 2026-08-07 (b): paid journey, post-reconvergence-fix validation

**Persona:** Ana. **Purpose:** final gate on the "Onboarding-native 'Activar plan de pago' reconvergence" fix (`product/02b-medium-fidelity/CLAUDE.md`, 2026-08-07) — does a merchant who pays once and explores naturally ever see a state implying the plan wasn't activated?

## Core question: Validated

Ana's own words: *"the Configuración screen plainly stating 'Tu plan: Pago' was the one moment that actually protected her sense that her payment mattered and registered."* This is the exact defect this fix targeted (Configuración previously read "Gratis" after activation) — now confirmed working, from a naive first-time-user's own felt reaction, not just structural verification. **Verification status: Independently Verified** — matches Main's own repeated live-verification of the same node throughout today's fix cycle.

## New finding, confirmed — "← Inventario" back-link is mislabeled

From the nfc-capable Registrar Mercancía chain built for today's fix (`651:2695`, "Producto seleccionado"), tapping "← Inventario" lands on `184:1503` — the Home Idle screen ("¿Vas a vender hoy?"), not an Inventario catalog view. Ana: *"a small but real mislabeling moment."* **Verification status: Independently Verified** — Main reproduced on a fresh page immediately after the report, confirmed via direct click landing exactly on `184:1503`.

**Root cause, structural:** `ui-designer`'s own build report for today's Fix 1 states explicitly: "All '← Inventario'/Descartar-confirm targets retargeted to `184:1503`." `184:1503`'s own layer name is "H1 clone of `36:29` — 4. Idle — sin evento, listo" — it is Home, not an Inventario-tab resting/catalog view. The retarget was scoped correctly for the *tier* defect (matching every other back-link pattern in this file) but the destination itself doesn't match its own label's semantics — a different defect class from the reconvergence bug, not a regression of it. **Not fixed as part of this review** — flagged for the Product Owner to decide whether to fold into a follow-up pass, per the same scope discipline applied throughout today's work.

## Reconciled against an existing, already-open backlog item — Resultados showing populated history against an empty Eventos tab

From the same `184:1503` origin, Eventos correctly shows a cold-start empty state, but Resultados shows a fully detailed sales history ("Plaza Norte," day-by-day breakdown, per-product counts) for an account with zero recorded sales. Ana named this the most damaging moment in the session.

This was never in scope of either of today's two fixes (both scoped strictly to the Inventario/Configuración and Iniciar-Sesión-Rápida legs) — `184:1503`'s Resultados tab-bar destination was untouched by either. This matches the pattern already logged and left open as **Finding 7** (`product/02b-medium-fidelity/CLAUDE.md`, 2026-08-06): generic canonical tab destinations not matching a fresh account's actual narrative, explicitly recorded as "a Product Owner proportionality question, never decided either way." **Verification status: Partially Verified** — the contradiction itself is confirmed by the naive walk; whether this is literally the same destination node as Finding 7's instance or a structurally-identical new one hasn't been independently traced by Main.

## Not treated as defects — flagged as felt-experience observations against intentional design

- **"Activar plan de pago" has no visible in-app payment mechanism.** Consistent with `company/CLAUDE.md`'s explicit non-goal ("Payments/checkout — out of scope, do not build") and `settings.md`'s own framing of the action as "confirming a payment already arranged," not processing one. Ana's felt confusion is real and worth knowing, but this is very likely working as designed, not a build defect. **Pending Verification** against the approved spec's own stated intent for how this confusion should (or shouldn't) be addressed.
- **"Todo listo" doesn't mention tags or distinguish the paid outcome.** `ui-designer`'s own earlier trace today quoted this exact copy as spec-consistent (`defaultSellingMode` stays `buttons` unconditionally per D27, so a screen that only mentions selling "con botones" at this exact moment is accurate, not a bug). **Pending Verification** against `onboarding.md`'s literal spec text — not chased further today.

## References
- `product/02b-medium-fidelity/CLAUDE.md` (2026-08-07 reconvergence entry; Finding 7, 2026-08-06)
- `company/CLAUDE.md` (payments non-goal)
- `product/02-ux/onboarding.md` §2.3, `settings.md`
