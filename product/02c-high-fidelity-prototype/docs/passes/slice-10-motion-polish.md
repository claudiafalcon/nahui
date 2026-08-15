# Slice 10 — Motion polish: NFC glyph, receipt sway, tray tear-away, close-summary entrance

Build proposals #1, #2, #3, and #6 from `docs/design-audit-2026-08-15.md`
(that file's own numbering — #6 is "Día cerrado"/Close-summary). All four
are motion/glyph-only changes with no copy or behavior change, dispatched
together by the Product Owner alongside #5 (Slice 9, Configuración identity
strip, already recorded separately). The implementation itself (all four
diffs) was built and `tsc -b`-verified in a prior, interrupted dispatch;
this pass picked up from there — live-verified all four against a real
running `npm run dev`, found and fixed one real defect surfaced only by
live verification (see "Fix found during verification" below), and closes
out the documentation.

## What changed

1. **NFC scan prompt** (`src/components/NFCScanPrompt/NFCScanPrompt.tsx`/
   `.module.css`, `src/components/TagStub/TagStub.tsx`) — the pulsing ring
   Ana taps in Asignar Tags / Selling's nfc mode used to hold a generic
   Wi-Fi/broadcast-wave SVG. Replaced with a larger `TagStub` silhouette
   (`showLetter={false}`, an explicit neutral `tone` override) — the same
   physical object the whole visual system is built from, reused rather
   than inventing a sixth device. `TagStub` gained `showLetter`/`tone`
   override props, both defaulting to prior behavior so every other call
   site (Venta Actual chips, catalog rows) is unaffected. Pure glyph swap —
   ring pulse, tap behavior, copy all untouched.
2. **Receipt pendulum sway** (`src/components/ReceiptTicket/ReceiptTicket.module.css`)
   — a new `loopSway` keyframe on `.loop` (the punched-hole/string device),
   2-3 small decaying arcs, `animation-delay: var(--duration-slow)` so it
   only starts once the ticket's own `swingIn` has fully landed —  a
   residual echo, not a competing motion. Reduced-motion pins `.loop` to
   its static rest position (`rotate(-3deg)`), matching the pre-pass look
   exactly.
3. **Venta actual tray "torn away" exit** (`src/components/VentaActualTray/VentaActualTray.tsx`/
   `.module.css`) — chips had a staggered `chipSettle` entrance but no
   exit; Cancelar made the row vanish in a single re-render frame. Added a
   `chipTear` exit keyframe (lifts up, twists away, faster than the
   entrance — `--duration-fast`) plus a local-state unmount-delay pattern
   (`renderedLines`/`renderedSubtotal`/`exiting`) so the chips stay mounted
   through their own staggered exit before the tray reports empty. Reduced
   motion clears instantly, no exit class ever applied. `onCancel`/
   "Cancelar clears the whole sale" behavior is untouched — this is a
   rendering-timing change only.
4. **Close-summary entrance** (`src/screens/Home/CloseSummary.tsx`,
   `src/screens/Home/ColdStart.module.css`) — reuses `ColdStart`'s own
   `BrandMark`/`.mark`/`markSettle` device verbatim (no new device
   invented) plus a `figureSettle` landing on the revenue figure, delayed
   until the mark settles. Copy is untouched character-for-character from
   `home.md` §3.12's "two numbers, no breakdown" free-tier rule — "N ventas
   registradas / $X en total."

## Fix found during verification

Live-testing #4/#6's reduced-motion path surfaced a real, if
low-visibility, defect: `ColdStart.module.css`'s reduced-motion override
for `.totalFigure` had been folded into the *pre-existing* early
`@media (prefers-reduced-motion: reduce) { .mark { animation: none; } }`
block, which sits *before* the new unconditional `.totalFigure { animation:
figureSettle ... }` rule later in the same file. Same-specificity CSS
cascades on source order — a rule appearing later always wins a tie — so
that override was dead code from the moment it was written: measured live,
`.totalFigure`'s computed `animation-name` stayed `figureSettle` under
reduced motion instead of `none`. The figure still *looked* correct
(landed at `opacity: 1` immediately) only because `tokens.css` separately
zeroes `--duration-base`/`--duration-slow` under the same media query,
making the still-active animation complete in 0ms — a coincidental safety
net, not this rule doing its own job. `ReceiptTicket.module.css`'s
analogous `.loop` override, written in the same original dispatch, placed
its reduced-motion block correctly (after the unconditional rule) — this
was a real inconsistency, not a deliberate second convention.

**Fix:** split `.totalFigure`'s reduced-motion override into its own
`@media` block, placed after the unconditional `.totalFigure` rule (see
`src/screens/Home/ColdStart.module.css`), matching `ReceiptTicket`'s own
precedent. Verified live before and after: pre-fix, computed
`animation-name` was `figureSettle` under reduced motion (wrong, masked by
the token fallback); post-fix, it's genuinely `none`. `tsc -b` re-checked
clean after the fix.

## Verification

All four live-verified against a real `npm run dev` (not source-reading),
using `puppeteer-core` driving the machine's own installed Chrome
(`executablePath`, no bundled-Chromium download) — the same tool Slice 9
established as available in this environment. `AppState` was seeded
directly via `localStorage` (injected through `page.evaluateOnNewDocument`
so the app's own first mount reads it, avoiding a race against the app's
mount-time persist effect) to reach each state quickly and repeatably,
rather than re-walking the full Authentication/Onboarding flow for every
check; the actual interactions under test (tapping tiles, Cancelar,
Finalizar Venta, Cerrar jornada de venta, toggling
`prefers-reduced-motion` via `emulateMediaFeatures`) were all real DOM
interactions against the live running app, not mocked.

1. **NFC scan prompt** — seeded a `paid`-tier, `nfc`-default-selling
   Business with 2 untagged available units, reached Asignar Tags via
   Inventario → "Continuar etiquetando." Screenshot confirms the pulsing
   ring now contains a plain `TagStub` silhouette (body + string loop, no
   letter) instead of the old wireless-wave glyph. Computed
   `animation-name` on `.ring`: `pulse` under normal conditions, `none`
   under `prefers-reduced-motion: reduce` — the ring pulse itself (pre-
   existing, untouched by this pass) still correctly suppresses.
2. **Receipt pendulum sway** — completed a real sale (buttons mode, Free
   tier) end to end, landed on the receipt. Computed `transform` on
   `.loop`: rest position at mount (`rotate(-3deg)`, sway not yet started
   under its `--duration-slow` delay), visibly different mid-sway
   (~1.2s post-mount), back to the identical rest-position matrix once the
   sway completes (~2.4s post-mount) — a real decaying oscillation, not a
   static prop. Under `prefers-reduced-motion: reduce` (set before the
   receipt mounts, matching a real OS-level accessibility setting): `.loop`
   stays at the exact rest-position matrix throughout, `animation-name:
   none` on both `.screen` (swingIn) and `.loop` (sway) — confirmed
   unchanged 1.5s later.
3. **Venta actual tray tear-away exit** — added 2 items (Playeras, Blusas)
   to a live sale, tapped Cancelar → confirmed "Sí, cancelar." Screenshot
   taken ~40ms after confirming shows the chips mid-exit — one nearly
   faded/lifted out, the other still mid-tear — confirming the staggered
   unmount-delay pattern genuinely keeps chips mounted through their own
   exit rather than vanishing in one frame; tray correctly reports
   "(vacía)" only once the staggered exit finishes (~400ms later). Under
   `prefers-reduced-motion: reduce` set *before* the Selling screen mounts
   (the realistic case — an OS-level preference already active when Ana
   opens the app): the tray goes empty immediately with the exit class
   never applied. (A first pass of this specific check toggled reduced
   motion *after* the screen had already mounted, mid-session — that
   produced a false negative, since `VentaActualTray`'s `reduceMotion` flag
   is a `useRef` snapshot taken once at mount, the same "read once" pattern
   already used elsewhere in this codebase, e.g. `ReceiptTicket`'s
   `COUNT_UP_MS`. Re-tested with the media feature set before mount — the
   realistic scenario — and confirmed clean; not treated as a defect, since
   no in-app UI lets Ana toggle this setting mid-session, only the OS does,
   before the app is opened.)
4. **Close-summary entrance** — closed a live Session (2 finalized sales,
   $540 total). Screenshot ~50ms after confirming close shows the
   `BrandMark` already visible and settling while the revenue figure is
   still at `opacity: 0` (its own `animation-delay` hasn't elapsed yet);
   ~900ms later, both have landed — `BrandMark` settled, figure at
   `opacity: 1`, copy reading exactly "2 ventas registradas / $540 en
   total," matching `home.md` §3.12's "two numbers, no breakdown" rule
   character-for-character, nothing added. Reduced motion (set before the
   Session-close, real scenario) confirmed clean post-fix (see "Fix found
   during verification" above): `.mark` and `.totalFigure` both report
   `animation-name: none`, figure already at `opacity: 1` at the same
   ~50ms checkpoint.

Screenshots taken at a 420×900 viewport, not persisted to the repo
(transient verification aids, per this folder's own established
convention — see `docs/design-audit-2026-08-15.md`'s own "Screenshots
referenced" note).

## Files touched

`src/components/NFCScanPrompt/NFCScanPrompt.tsx`,
`src/components/NFCScanPrompt/NFCScanPrompt.module.css`,
`src/components/TagStub/TagStub.tsx`,
`src/components/ReceiptTicket/ReceiptTicket.module.css`,
`src/components/VentaActualTray/VentaActualTray.tsx`,
`src/components/VentaActualTray/VentaActualTray.module.css`,
`src/screens/Home/CloseSummary.tsx`,
`src/screens/Home/ColdStart.module.css` (including this pass's own fix, see
above), `docs/design-audit-2026-08-15.md` (items #1/#2/#3/#6's "Build
status" lines), this file, `README.md` (pass-history index entry).
