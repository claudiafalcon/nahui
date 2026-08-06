# Active Artifacts

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
| Seamless demo prototype | Figma design file, Present-mode | **Not yet obtained** | fileKey `DPRnGD5JWjfoNBSlAFoVG4`, page `160:2` ("Demo — Journey 1 Seamless") | Blocking `merchant-user-tester`'s Qualification Run. Requires a manual Figma sharing-settings action (Share → Anyone with the link → copy Present-mode URL) — not obtainable via current tools. |
| Production prototype (6-page, 3-journey) | Figma design file, Present-mode | Not yet obtained | fileKey `DPRnGD5JWjfoNBSlAFoVG4`, pages `0:1`–`1:33` etc. (Hoy/Inventario/Eventos/Resultados/Onboarding/Configuración) | `events.md` fully closed 2026-08-06 — Journey 2 restored, `ux-critic` and `reviewer` both clean (`product/02b-medium-fidelity/events.md`). Medium-Fidelity tier status otherwise unchanged (see that file's own Status section per document). |
| Design System | Figma design file, page within the same file | N/A (internal page, not separately published) | fileKey `DPRnGD5JWjfoNBSlAFoVG4`, page `0:1` ("00 · Design System") | Not published as a standalone public artifact; reached today only via the Figma plugin MCP tools (`ui-designer`/`ux-critic`/`reviewer`), not a public URL. |

## Notes

- "Not yet obtained" is a real blocker, not a placeholder to fill in later without action — nothing in `merchant-user-tester`'s pipeline can run until at least the Seamless demo prototype row has a real URL.
- When a URL here changes (a file gets re-published, a new demo page replaces an old one), update the row and note the date/reason in `company/bitacora.md` if the change is significant enough to matter for continuity — routine re-publishing isn't log-worthy on its own.
- This file stores URLs only, not credentials or access tokens — same non-secret discipline as `company/marketing-operating-environment.md`.
