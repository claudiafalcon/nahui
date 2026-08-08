# Experience Review — 2026-08-06 (c)

`merchant-user-tester` (Ana) run, dispatched to independently test a discrepancy the Product Owner reported between her own manual walkthrough of "Empezar gratis" and a static Figma reaction trace (`ui-designer`, same day) that found the Onboarding→Home wiring clean. Task: set up a free account and register the first few products she'd sell. Prototype: the Journey-1-Seamless demo page (`company/active-artifacts.md`), the same artifact used for all prior `merchant-user-tester` runs.

This closes a real coverage gap: `product/02-ux/experience-validation-coverage.md` had explicitly flagged "Empezar gratis" as never tested by the persona.

## Outcome

Reached a populated Inventario screen, but not through a path Ana controlled — she would not trust the numbers on it. Full click-by-click path, narration, and diagnostics are in the task transcript this document summarizes; key facts below.

## What happened, condensed

Bienvenida → "Empezar gratis" → Todo listo → "Empezar" → Home cold start → "Registrar mercancía" → product picker → tapped "Pijama." The Cantidad field showed no way to type a real value (a known Tooling Artifact category — no text-input tool — not a confirmed product defect on its own). Tapping "+ Agregar otro producto" surfaced "Pijama — 10" and an unrequested second line, "Sudadera/Maxy — 5," neither entered by Ana. Discarding and retrying, the product picker didn't reflect her tap (chose "Calcetines," the Producto field still showed "Pijama"). Tapping "Guardar mercancía" jumped directly to an NFC tag-assignment queue ("Faltan 7 de 10"), with zero prior explanation of tags, showing "Pijama (10) · Sudadera (5) · Calcetines (20)" as what she'd "registered." Two controls on that screen ("Terminar después," the "Hoy" tab) produced no response. The only remaining live control advanced her straight to a "tagging complete" Inventario screen showing all three fabricated lines as available stock.

## Findings and verification status

- **Phantom inventory (Pijama 10 / Sudadera 5 / Calcetines 20) — Independently Verified.** Reproduced live by the persona on the exact "Empezar gratis" path the Product Owner walked; matches her original report.
- **Unrequested NFC tag-assignment step on a free-tier path — Independently Verified.** Reproduced live; the accessibility-tree label captured in diagnostics (`J1 · 3.14b Asignar tags — active queue (nfc, post-Guardar)`) confirms this is a genuine NFC-context frame, not a misread.
- **Root cause located, narrower than originally suspected — Partially Verified.** `ui-designer`'s earlier static trace of Onboarding's Todo-listo→Home wiring (`71:955`/`162:330`→`162:1485`) is not contradicted by this run — Ana's own path confirms Home itself rendered clean (cold start, no NFC, no products) after Onboarding. The divergence happens later: Inventario's own "Guardar mercancía" action, on this same buttons-only Journey-1 path, routes to an NFC tagging queue instead of `inventory.md` §3.12's buttons-only post-save confirmation. Not yet hop-by-hop traced in Figma — that's the next dispatch.
- **Product picker not reflecting the tapped product — Independently Verified, previously undocumented.** A second, distinct defect: selecting "Calcetines" left "Pijama" showing in the Producto field.
- **Two dead controls on the tagging screen ("Terminar después," "Hoy" tab) — Independently Verified, previously undocumented.**
- **Cantidad field appears uneditable — Tooling Artifact, not a confirmed product defect.** Consistent with the same limitation already logged for this exact field in `experience-validation-coverage.md` (no text-input tool available to the persona).

## Coverage impact

`product/02-ux/experience-validation-coverage.md`'s Onboarding supplementary row updated separately to reflect this run — see that file.

## Next step

Routed to `ui-designer`: trace Inventario's "Guardar mercancía" reaction on the Journey-1-Seamless page's buttons-only path and the product-picker's selection-binding, using the same hop-by-hop, reaction-data discipline as the earlier Onboarding trace — not yet dispatched as of this document's creation.
