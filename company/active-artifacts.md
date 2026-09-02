# Active Artifacts

**Status note, 2026-08-30:** Figma/FigJam is fully removed from this project's toolset (Product Owner decision — no agent holds Figma tool access as of this date, `ui-designer`'s standing execution medium is React/TypeScript only). Every row below is a historical record of artifacts that were live before that decision, kept for reference, not an active lookup table anymore. **One real open item this surfaces, not resolved here:** the Merchant Experience Kit (row below) lived only as a FigJam board's content — its actual persona information needs to be migrated to a plain document if it's still needed as reference material, since nothing currently reads it from FigJam going forward. Flagged for the Product Owner, not silently actioned.

A lightweight lookup table of current canonical URLs for external artifacts
(Figma/FigJam) — owned and kept current by Main. Exists so no agent ever
hardcodes a URL that can go stale, and so any dispatch needing one (most
directly, `merchant-user-tester`, which is deliberately barred from having
its own copy) always pulls the live, current value from one place instead
of a value baked into a prompt or an agent file.

Referenced by `company/CLAUDE.md`'s Session Recovery Protocol (step 4,
external artifacts) and Experience Validation section (dispatch-time URL
injection). Update this file the moment a URL changes or a new canonical
artifact is created — a stale entry here is worse than no entry, since it
reads as current when it isn't.

| Artifact | Type | Public URL | Internal reference | Status |
|---|---|---|---|---|
| Merchant Experience Kit | FigJam board | `https://www.figma.com/board/yjb7sUjdueUfzGKHmJHKhy/Nahui-%E2%80%94-Merchant-Experience-Kit` | fileKey `yjb7sUjdueUfzGKHmJHKhy` | Content Approved (`reviewer`, 2026-08-05); two-page EN/ES structure pending `business-decisions.md` Q13 |
| Seamless demo prototype | Figma design file, Present-mode | `https://www.figma.com/proto/DPRnGD5JWjfoNBSlAFoVG4/Nahui-%E2%80%94-Medium-Fidelity-UI?node-id=162-320&p=f&viewport=574%2C625%2C0.02&t=qPfTobaiUEx4GEvv-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=162%3A320&show-proto-sidebar=1&page-id=160%3A2` | fileKey `DPRnGD5JWjfoNBSlAFoVG4`, page `160:2` ("Demo — Journey 1 Seamless") | Obtained 2026-08-06, in active use for `merchant-user-tester`'s Qualification Run and both Experience Reviews (`chrome-devtools-mcp`). Row corrected — was left marked "Not yet obtained" after the URL was actually acquired, a stale-documentation gap fixed here. |
| Production prototype (6-page, 3-journey) | Figma design file, Present-mode | Not yet obtained | fileKey `DPRnGD5JWjfoNBSlAFoVG4`, pages `0:1`–`1:33` etc. (Hoy/Inventario/Eventos/Resultados/Onboarding/Configuración) | `events.md` fully closed 2026-08-06 — Journey 2 restored, `ux-critic` and `reviewer` both clean (`product/02b-medium-fidelity/events.md`). Medium-Fidelity tier status otherwise unchanged (see that file's own Status section per document). |
| Design System | Figma design file, page within the same file | N/A (internal page, not separately published) | fileKey `DPRnGD5JWjfoNBSlAFoVG4`, page `0:1` ("00 · Design System") | Not published as a standalone public artifact; reached today only via the Figma plugin MCP tools (`ui-designer`/`ux-critic`/`reviewer`), not a public URL. |
| Loyalty — Customer-Facing | Figma design file, Present-mode | Not yet obtained | fileKey `DPRnGD5JWjfoNBSlAFoVG4`, page `753:918` | Blocks nothing in scope today — see 2026-08-10 note below. Not required for `merchant-user-tester`'s Paid/Free journey walks, which end at the merchant's own receipt. |

## Notes

- "Not yet obtained" is a real blocker, not a placeholder to fill in later without action — nothing in `merchant-user-tester`'s pipeline can run until at least the Seamless demo prototype row has a real URL.
- When a URL here changes (a file gets re-published, a new demo page replaces an old one), update the row and note the date/reason in `company/bitacora.md` if the change is significant enough to matter for continuity — routine re-publishing isn't log-worthy on its own.
- This file stores URLs only, not credentials or access tokens — same non-secret discipline as `company/marketing-operating-environment.md`.
- **2026-08-10 — Claim Token QR link found pointing at a private design-mode URL, not a public one.** During a Paid-journey merchant walk, the receipt's `ClaimTokenQR` element's own link reaction was confirmed (via a live browser tab, `figma.com/design/...`, sitting behind Figma's login wall) to be a `URL`-type reaction targeting the private editing link for this file, not a public Present-mode share link — a real customer scanning it today would hit the same login wall. This is a customer-facing-journey concern, explicitly out of scope for `merchant-user-tester`'s Paid/Free journey acceptance criteria (Product Owner ruling, 2026-08-10: "the QR acceptance criterion is only that the correct QR is visibly present on the merchant's completed-sale receipt... Ana's journey ends on the merchant side"). Fixing it requires a public Present-mode URL for this row, which needs the Product Owner's own Figma "Present" → share-link action (not obtainable via any Plugin API/MCP tool, same class of gap already on record for the Production prototype row above) — then the QR's reaction needs rewiring to that public link, then a dedicated customer-facing-journey test (a different persona/tester, not Ana) validates the actual claim flow. Not yet actioned.
