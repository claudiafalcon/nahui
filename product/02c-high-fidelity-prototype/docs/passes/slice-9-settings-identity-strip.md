# Slice 9 — Configuración: read-only business identity strip

Build proposal #5 from `docs/design-audit-2026-08-15.md` — a direct
build-layer addition, `ux-designer`-confirmed to need no spec amendment
(read-only, reflects already-captured data, `settings.md` §3.3a's
wireframe doesn't reserve this space for anything else).

## What changed

`src/screens/Settings/SettingsScreen.tsx` (`settings.md` §3.3a/§3.6). A
small, non-interactive strip now sits at the top of the vista principal —
below the existing `← Hoy` topbar, above the "Configuración" heading and
every capability row — showing `Business.name` and, when set,
`Business.logo`. No new data source: it reads the exact same `Business`
object/fields `ReceiptTicket.tsx` already renders (`home.md` §3.8f), via
the same `business` binding `SettingsMain` already receives as a prop. No
`onClick`, no chevron, no gating logic — pure display.

Placed outside `.scroll` (the scrollable rows container), so it stays
visible regardless of scroll position — it's page-level context ("whose
business is this"), not a list item competing with "Tu plan"/"Cómo vendes
normalmente." Divided from the heading below by the shared stitch-rule
(`patterns.css`'s `.stitchBottom`), the same divider device
`.accountSection` already uses (as `.stitchTop`) above itself further down
this same screen — reused, not a new visual device invented for this one
strip.

## Styling

`SettingsScreen.module.css` gains three classes:

- `.identity` — flex row, logo + name, `gap: var(--space-2)`, horizontal
  padding matching `.topbar`'s own `var(--space-4)`.
- `.identityLogo` — 32×32, `var(--radius-md)`, `object-fit: cover`, a
  `--color-hilo` border — the identical treatment `ReceiptTicket.module.css`'s
  own `.businessLogo` already uses, just smaller (32px vs. 36px, since this
  is a compact header strip, not a full-viewport hero moment).
- `.identityName` — `var(--font-display)` (Fredoka) at weight 500, same
  family/weight `ReceiptTicket`'s `.businessName` uses, sized down to 17px
  (from 20px) for the same reason; `overflow`/`text-overflow: ellipsis`/
  `white-space: nowrap` added since this is a compact single-line row, not
  a centered hero block with room to wrap.

No new component was created — this is layout/CSS only, folded directly
into `SettingsScreen.tsx`'s existing `SettingsMain` render body, next to
where `.topbar` and `.scroll` already sit.

## Verification

`tsc -b` — zero errors.

Live walkthrough, this time with a real browser-automation tool available
in this session (`puppeteer-core`, driving the machine's own installed
Chrome via `executablePath`, no bundled-Chromium download needed) — a
genuine change from prior slices in this folder, which disclosed no such
tool was available and fell back to code-trace-only verification. Two full
real, reachable flows were driven end-to-end against `npm run dev`:

1. **Real path, with logo** — Número celular → código → "Empezar gratis" →
   Tu negocio (typed a name, uploaded a real PNG via the file input,
   confirmed the in-flow logo preview rendered) → Selling Groups (one
   product) → Todo listo → Home (cold start) → "⋯" → "⚙ Configuración".
   Screenshot confirms: logo renders at top-left of the strip, name
   ("Boutique Ana") beside it, strip sits above the stitch divider and the
   "Configuración" heading, no interaction affordance on the strip itself,
   rest of the screen (Tu plan, Cómo vendes normalmente, Tu cuenta) is
   unchanged.
2. **Demo path, no logo** — Número celular → código → "Ver un ejemplo" →
   "Ver el ejemplo" → Todo listo (auto-seeded identity, no logo ever set on
   this path) → Home → "⋯" → "⚙ Configuración". Screenshot confirms the
   honest fallback: plain business name text only ("Ropa Aurora," the demo
   seed name), no logo image, no broken `<img>`, no layout gap left where a
   logo would have been — same fallback discipline `ReceiptTicket` already
   established for the identical case.

Both screenshots taken at a 390×844 mobile viewport (2x device scale),
matching this codebase's existing target device class. Not persisted to
the repo (transient verification aids, per this folder's own established
convention — see `docs/design-audit-2026-08-15.md`'s own "Screenshots
referenced" note).

## Files touched

`src/screens/Settings/SettingsScreen.tsx`,
`src/screens/Settings/SettingsScreen.module.css`,
`docs/design-audit-2026-08-15.md` (item #5's "Build status" line), this
file, `README.md` (pass-history index entry).
