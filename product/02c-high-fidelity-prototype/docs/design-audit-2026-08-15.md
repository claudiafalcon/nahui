# Design Audit — `frontend-design` evaluation (2026-08-15)

**Status: Proposals drafted by `ui-designer`, evaluating the live running prototype end-to-end. Product Owner has directed all 6 to be implemented — see build status per item below as each is dispatched. As of this writing: #1, #2, #3, #5, #6 built and verified live; #4 remains pending its own `ux-designer` sign-off before build (see that item's own flag), handled as a separate dispatch.**

Full walkthrough: Authentication → Onboarding (both "Empezar gratis" and "Ver un ejemplo" paths) → Home cold-start/idle/selling → a full sale → the Paid-tier QR receipt → session close → Resultados (cold-start and populated) → Inventario (catalog, Registro de mercancía, Asignar Tags/NFC scan) → Eventos (cold-start, Nuevo evento) → Configuración. Source read behind every flagged screen specifically to avoid proposing anything the design system had already deliberately considered and rejected — two initial ideas were dropped this way (an "extend the ambient background to every cold-start" idea duplicated a treatment `ColdStart.module.css` explicitly reasoned against; a "tag the per-Session revenue figure" idea turned out to already be correct per the `.moneyTag` aggregate-vs-transaction rule).

Most of what looked like gaps at first glance (tile grain, product tone/tilt, the nav pip, the receipt's tear/hole) turned out to be deliberately, already built. The six below are the real remaining openings.

---

## 1. NFC scan prompt: replace the generic wireless glyph with the Swing Tag silhouette itself

- **Screen/component:** `src/components/NFCScanPrompt/NFCScanPrompt.tsx` + `.module.css` (Inventario's Asignar Tags queue, Home's NFC-mode selling surface).
- **What:** the pulsing circle Ana taps to simulate "hold the tag near the phone" currently contains a generic Wi-Fi/broadcast-wave SVG, disconnected from the system's own vocabulary. The NFC tag *is*, physically, the same swing tag object the whole visual system is built from (it stays with the customer as part of the loyalty journey — `company/CLAUDE.md`). Swap the wireless-wave glyph for a larger `TagStub` silhouette inside the same pulsing ring.
- **Why it serves Ana:** closes the gap between the product's dominant metaphor and the one interaction that's most literally about that exact physical object.
- **Effort:** Small. **Risk:** Low — pure glyph swap, reuses an already-built primitive (`TagStub`), no copy/behavior change, no sign-off needed.
- **Build status:** Built and verified live — `src/components/NFCScanPrompt/NFCScanPrompt.tsx`/`.module.css`, `src/components/TagStub/TagStub.tsx`. `tsc -b` clean. Verified live against a real `npm run dev`: the pulsing ring now renders a plain `TagStub` silhouette in place of the old wireless-wave SVG; ring pulse (pre-existing) confirmed still correctly suppressed under `prefers-reduced-motion: reduce`. Full record: `docs/passes/slice-10-motion-polish.md`.

## 2. Receipt: a residual pendulum sway after the swing-tag drops in

- **Screen/component:** `src/components/ReceiptTicket/ReceiptTicket.tsx` + `.module.css`.
- **What:** `swingIn` plays once (`--duration-slow`, `--ease-settle`) then goes fully static. Add 2-3 small, decaying pendulum arcs on the punched-hole/string `.loop` element after landing — extends the existing keyframe, no new device.
- **Why it serves Ana:** `DESIGN-SYSTEM.md` names this "the one moment in the whole product that should feel like something consequential just happened." Gives that beat a little more life with no new visual vocabulary.
- **Effort:** Small. **Risk:** Low — motion only, doesn't touch the spec-governed QR/claim-token content.
- **Build status:** Built and verified live — `src/components/ReceiptTicket/ReceiptTicket.module.css`. `tsc -b` clean. Verified live: completed a real sale end to end, confirmed `.loop`'s computed transform is at rest at mount, visibly mid-sway ~1.2s later, and back at rest once the sway completes; confirmed fully suppressed (static, `animation-name: none`) under `prefers-reduced-motion: reduce`. Full record: `docs/passes/slice-10-motion-polish.md`.

## 3. Venta actual tray: a "torn away" exit animation when a sale is cancelled

- **Screen/component:** `src/components/VentaActualTray/VentaActualTray.tsx` + `.module.css`.
- **What:** chips have a staggered `chipSettle` entrance but no exit — "Cancelar" makes the row vanish in a single re-render frame. Add a brief, staggered "torn off the string" exit (same physical language as the entrance, reversed/faster) before the tray reports empty.
- **Why it serves Ana:** mid-sale cancel needs instant, legible confirmation — `DESIGN-SYSTEM.md`'s motion principle already ties confirmation to the actual state change; the add side of that rule is honored, the remove side isn't.
- **Effort:** Small-Medium (needs a brief unmount-delay pattern, plain CSS can't animate an already-removed element). **Risk:** Low — visual/motion only, doesn't touch the existing "Cancelar clears the whole sale" behavior.
- **Build status:** Built and verified live — `src/components/VentaActualTray/VentaActualTray.tsx`/`.module.css`. `tsc -b` clean. Verified live: added 2 items, tapped Cancelar, confirmed a screenshot ~40ms after confirming shows the chips genuinely mid-exit (staggered, not vanished in one frame), tray reports empty only once the exit finishes; confirmed instant/no-animation clearing under `prefers-reduced-motion: reduce` set before the screen mounts (the realistic case). Full record: `docs/passes/slice-10-motion-polish.md`.

## 4. Onboarding "Tu negocio": a live mini-preview of her business identity as she types

- **Screen/component:** `src/screens/Onboarding/BusinessIdentity.tsx` + `.module.css` (`onboarding.md` §3.9/§3.9a).
- **What:** this screen tells her "tu nombre y tu logo son lo que tus clientes van a ver en tu recibo digital" but is a flat, generic form with no brand texture. Add a small live preview card — her typed name in the same Fredoka `businessName` treatment `ReceiptTicket` already uses, plus logo if selected — updating as she types. Pure reflection of already-entered form fields, no new domain state.
- **Why it serves Ana:** makes the screen's own promise literal instead of asking her to imagine it.
- **Effort:** Medium (new small subcomponent + layout accommodation above the keyboard-heavy form). **Risk:** Low-but-flagged — implementation-independent per `onboarding.md`, no gating/copy change, but it's new on-screen content not in the approved wireframe (a new *decoration* of already-captured data, not a new state). `ui-designer` recommended a quick `ux-designer` nod before building.
- **Build status:** not yet dispatched — pending `ux-designer` sign-off per the flag above.

## 5. Configuración: a read-only business identity header above "Tu plan"

- **Screen/component:** `src/screens/Settings/SettingsScreen.tsx` (`settings.md` §3.3a).
- **What:** Configuración opens straight into "Tu plan" rows with nothing confirming whose business this is. Add a small, non-interactive strip at the top (name + logo if set, same values `ReceiptTicket` already renders) above the existing rows.
- **Why it serves Ana:** grounds the flattest, emptiest screen in the app in her own identity — the same data already trusted enough for her customer's receipt.
- **Effort:** Small (pure display, reads already-in-state `Business.name`/`Business.logo`). **Risk:** Low-but-flagged — same as #4, adds a rendered fact not in the approved wireframe (read-only, no new control, no gating change). `ui-designer` recommended a quick `ux-designer` nod before building.
- **Build status:** Built and verified live — `src/screens/Settings/SettingsScreen.tsx`/`.module.css`. `tsc -b` clean. Verified against both real, reachable states (with logo, without) via a live browser-automation walkthrough. Full record: `docs/passes/slice-9-settings-identity-strip.md`.

## 6. "Día cerrado" (Close-summary): give the day's actual close a matching moment, not a static screen

- **Screen/component:** `src/screens/Home/CloseSummary.tsx` (reuses `ColdStart.module.css`, `home.md` §3.12).
- **What:** renders with zero animation and, unlike every other "nothing/something happened" screen, without even the shared `BrandMark` halo `ColdStart`/`Idle` both use — plain text dropped into an empty canvas the instant the Session closes. Give it the same `markSettle`-style entrance `ColdStart`'s mark already has (reused, not reinvented), and let the total figure land with a brief settle.
- **Why it serves Ana:** closing a full selling day is arguably the largest "a real state change just completed" moment in the product outside the receipt — `DESIGN-SYSTEM.md`'s own motion principle argues for exactly this, and it's currently the one comparable moment with no treatment at all. Content stays exactly "two numbers, no breakdown" per the spec's explicit free-tier restriction — pure motion/presence, no new information.
- **Effort:** Small. **Risk:** Low — motion-only, reuses an already-approved shared device, doesn't touch the "two numbers only" content rule `home.md` §3.12 states.
- **Build status:** Built and verified live — `src/screens/Home/CloseSummary.tsx`, `src/screens/Home/ColdStart.module.css`. `tsc -b` clean. Verified live: closed a real Session, confirmed the `BrandMark` and revenue-figure entrances both play (figure lands after the mark, ~900ms), copy reads exactly "N ventas registradas / $X en total" with nothing added; confirmed suppressed under `prefers-reduced-motion: reduce` — this check surfaced a real CSS cascade-order bug in the figure's reduced-motion override (fixed live, see `docs/passes/slice-10-motion-polish.md`'s "Fix found during verification" section). Full record: `docs/passes/slice-10-motion-polish.md`.

---

## Screenshots referenced

Captured live from `npm run dev`, saved to this session's scratch directory (not part of the repo) — `q01-asignar-tags.png` (#1), `h01-receipt-full.png` (#2), `g01-selling-2items.png` (#3), `n02-after-empezar-gratis.png`/`o01-negocio-name-filled.png` (#4), `j01-settings.png` (#5), `m01-close-summary.png` (#6). Not persisted here since they were transient verification aids, not final deliverables — a fresh screenshot should be taken as part of each build's own verification pass instead.
