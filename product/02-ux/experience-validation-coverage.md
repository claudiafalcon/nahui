# Experience Validation Coverage Matrix

Tracks how much of `product/00-foundation/information-architecture.md`'s
canonical "User journeys" (§"User journeys", 5 numbered items) has actually
been walked by `merchant-user-tester` (Ana), as opposed to spec-reviewed by
`ux-critic`/`reviewer` or manually exercised by Main/the Product Owner.
Those are different kinds of evidence — this matrix tracks the first kind
specifically, since that's what "Experience Validation" (`company/CLAUDE.md`)
means: a zero-knowledge, first-time-merchant walkthrough, not a spec check.

**Maintained by Main.** Update whenever a new `experience-review-*.md`
document is persisted or an existing journey's coverage changes. Cross-
reference, don't duplicate — this table points at the evidence, it doesn't
restate it.

**This matrix is a gate, not passive tracking** (`company/CLAUDE.md`'s
Experience Validation section, "Coverage is a gate, not a queue"). A row
short of Fully Tested blocks that journey's Medium-Fidelity status from
reading "done" unless Main logs a dated, named exception directly in that
row — silence is no longer read as acceptable coverage.

## Legend

- **Fully Tested** — the complete journey (all its named steps) has been
  walked start to finish by `merchant-user-tester` in at least one run.
- **Partially Tested** — some steps were walked by `merchant-user-tester`;
  others were skipped, blocked, or completed by Main directly instead of
  by the persona.
- **Not Tested** — no `merchant-user-tester` run has reached this journey
  at all.
- **Out of Scope** — not part of the merchant application by design (not a
  Medium-Fidelity limitation; the Foundation itself excludes it).

## Source documents

- `product/02-ux/experience-review-2026-08-06.md` — Qualification Run (first
  `merchant-user-tester` execution, Playwright/pre-`chrome-devtools-mcp`).
- `product/02-ux/experience-review-2026-08-06-b.md` — first
  `chrome-devtools-mcp` run plus five closing re-walks dispatched overnight
  2026-08-06, covering Findings 1–11.
- `product/02-ux/experience-review-2026-08-04.md` — **not** included as
  Experience Validation evidence in this matrix. It's explicitly a
  Product-Owner-led walkthrough ("run at the Product Owner's request"), not
  a `merchant-user-tester` run — a different verification mechanism, real
  and valuable, but not the zero-knowledge persona layer this matrix tracks.
  Noted for context where relevant, not counted toward coverage.

## Matrix

| # | Journey (`information-architecture.md` §"User journeys") | Status | Evidence |
|---|---|---|---|
| 1 | **Inventory prep** — Home → Inventario → Registrar Lote (Product + qty) → auto-generate InventoryUnits → if `nfc`: Asignar Tags per unit → done | **Partially Tested** | `experience-review-2026-08-06-b.md` Findings 6, 8, 9, 10, 11 — the closing re-walk (Finding 11) walked the full happy path start to finish: Elegir producto → Pijama → Guardar mercancía → Asignar tags queue → "Mercancía lista para vender ✓." Not tested: the Cantidad field itself (Ana's tap produced no visible response — logged as a Tooling Artifact, `merchant-user-tester` has no text-input tool, not a confirmed product defect), "+ Agregar otro producto" (multi-item registration in one Lote), and any delete/edit-existing-line path. |
| 2 | **Event scheduling** — Home → Eventos → Nuevo Evento (name, type, dates) → appears on Home automatically | **Not Tested** | No `merchant-user-tester` run has tapped "Agendar evento" or walked the Nuevo Evento form. Eventos was only ever encountered as a tab-bar *destination* (`experience-review-2026-08-06-b.md` Findings 5, 7, 11), always landing on the cold-start empty state, never the creation flow. |
| 3 | **Selling (core path)** — Home resolves state (continue Session / "Continuar Día N" / "Iniciar Sesión Rápida") → add items → Finalizar Venta → loop → Cerrar Sesión → session summary | **Partially Tested** | `experience-review-2026-08-06.md` — blocked before reaching Selling at all (the "Empezar" dead end on Onboarding's "Todo listo" screen; fixed since, not re-confirmed by a fresh run from that entry point). `experience-review-2026-08-06-b.md` — extensive navigation of active-Session states (NFC scan prompt, with-items tray, Cerrar-sesión confirmation/interlock screens all reached and narrated by Ana). **Not walked by Ana herself**: completing Finalizar Venta through to its success state, completing Cerrar Sesión through to the session summary (both were exercised by Main directly during independent verification, not by the persona), and "Iniciar Sesión Rápida" (the no-Event Quick Session path) — every nfc-mode run entered through an existing Event ("Plaza Norte · Día 2"), never the zero-setup path. |
| 4 | **Event close** — last Session of an Event closes → Event-level rollup, aggregated across Sessions | **Not Tested** | No run has reached an Event-level rollup/closed-Event summary screen. |
| 5 | **Review** — Home/Resultados → past Sessions/Events → free tier: counts/totals; paid tier: segmentation | **Not Tested** | Ana has never navigated into Resultados by her own action in any run. Main reached specific Resultados frames directly during independent verification (tracing Finding 7's tab-bar destinations, and Finding 9's second regression) — that's Main's own reproduction, not persona coverage. |
| — | **Loyalty-claim** (customer-side identify/claim flow) | **Out of Scope** | `information-architecture.md` §"Explicitly out of scope: loyalty-claim" — by Foundation design, the merchant application never participates in customer identification or the Loyalty flow at all. Not a Medium-Fidelity gap; there is nothing here for `merchant-user-tester` to ever test as a *merchant* journey. |

## Supplementary — tested surfaces that aren't numbered IA journeys

`information-architecture.md` explicitly excludes these two from its
"User journeys" list (Onboarding is "a sequencing fact, not a navigation
destination"; Settings is "not a dedicated tab"), but both have real
Experience Validation coverage worth recording honestly:

| Surface | Status | Evidence |
|---|---|---|
| **Onboarding** (first-run flow, precedes all four tabs) | Partially Tested | `experience-review-2026-08-06.md` — Bienvenida → "Ver un ejemplo" confirmation → "Todo listo" all walked and Independently Verified; found the "Empezar" dead end (since fixed). `experience-review-2026-08-06-c.md` — "Empezar gratis" walked fully for the first time, start through first merchandise registration: Onboarding→Home hop confirmed clean (Independently Verified), but a real, previously-unknown defect found downstream in Inventario's own "Guardar mercancía" routing (phantom inventory, unrequested NFC tagging step) — see that document. "Activar plan de pago" still never tested by the persona at all. |
| **Settings** (session-controls "▾" affordance, not a tab) | Partially Tested | `experience-review-2026-08-06-b.md` Findings 1, 4, 9 — reached and narrated repeatedly via the mid-session dropdown; content, plan-tier accuracy, and the Cerrar-sesión-interlock all walked. Only ever reached mid-session, never via a fresh Onboarding→Settings path or the pre-Session Configuración-only sheet (`84:315`). |

## Summary

Of the 5 canonical IA journeys: **0 Fully Tested, 3 Partially Tested
(Inventory prep, Selling, and by extension Onboarding as its prerequisite),
2 Not Tested (Event scheduling, Event close), 1 genuinely Not Tested
(Review/Resultados)**, 1 Out of Scope (Loyalty-claim, by design).

**The gap worth naming plainly:** every `merchant-user-tester` run to date
has entered through Onboarding or an already-active NFC Session — nothing
has walked Event scheduling, Event close, or Resultados/Review at all. This
isn't a fidelity gap (all four are "done" at Medium-Fidelity per
`product/02b-medium-fidelity/CLAUDE.md`) — it's a dispatch-scope gap. The
natural next Experience Validation dispatches, in priority order matching
how central each journey is to the Core Thesis (`company/CLAUDE.md`):
1. **Selling, completed end-to-end by the persona** (not just navigated
   around) — this is Nahui's core hypothesis; Ana has never personally
   tapped Finalizar Venta or Cerrar Sesión through to completion.
2. **Review/Resultados** — the payoff moment for everything else; genuinely
   zero persona coverage today.
3. **Event scheduling** — lower urgency (`decision-log.md` D6: Sessions
   never require an Event), but zero coverage nonetheless.
4. **Event close** — lowest urgency of the four; requires a multi-day
   Event setup to even reach, a legitimate reason it's been deprioritized
   so far, not an oversight.
