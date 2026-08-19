# Nahui — High-Fidelity Living Prototype

Real, running React/TypeScript vertical slice. Built per `decision-log.md`
D41 — placement/architecture ruling only; this file is the artifact itself.

**What's currently built** (see `BACKLOG.md` for the authoritative, always-current
"what's built"/"what's not built" status — this paragraph is a summary, not
the source of truth): Phone → OTP → Owner identity → Business onboarding →
Home → Inventario → Registrar mercancía → Selling → Digital receipt, plus
Eventos (scheduling, an Event-active Home resolution branch, Event
close/rollup), Configuración (the four Business Capability actions plus the
account-level "Cerrar sesión"), Resultados (Free/Paid-tier review,
Session/Event/Venue drill-down), and Asignar Tags (Inventario's NFC-tagging
queue for nfc-capable Businesses, auto-entered after Guardar mercancía,
resumable via the Catalog view's own pending-tag status).

**Design system reference:** `DESIGN-SYSTEM.md` — the structured, reusable
rules (tokens, primitives, the Swing Tag at five scales, typography/motion
roles, content conventions). This is the *what a new screen should follow*,
stated once instead of re-derived from prose.

**Pass-by-pass build history** now lives in `docs/passes/` (see the index
below), not in this file — split out 2026-08-13 as part of a
knowledge-architecture refactor, since this file's own pass history had
grown to dominate what every dispatch touching this folder reads by
default, disproportionate to how often that history actually needs
rereading. Nothing was deleted; every pass's full record, reasoning, and
disclosed simplifications are preserved exactly, just relocated.

Not disposable demo code, not yet `03-build`. The Product Owner will decide,
from what's running here, whether this becomes Nahui's primary living
prototype.

## Run it

```
cd product/02c-high-fidelity-prototype
npm install
npm run dev       # http://localhost:5183
```

`npm run build` produces a production bundle in `dist/` (verified clean —
`tsc -b` and `vite build` both pass with zero errors as of this writing).
`npm run preview` serves that build locally.

No backend. Real, mocked phone+OTP authentication (any 6-digit code is
accepted) gates everything else. State lives in React Context +
`useReducer`-style `useState` updates, persisted to `localStorage` (key
`nahui-hifi-prototype-v1`) so a reload or tab switch never loses real
state. Clear that key (or open in a private window) to see the true
first-run experience again — Phone entry, not Home cold start, is the
actual fresh-install screen.

`@vercel/analytics` (`<Analytics />`, mounted unconditionally in
`src/main.tsx`) provides Vercel Web Analytics for the Product Owner on both
`demo.nahui.app` and `nahui.app` — no local dev-time effect, active only on
Vercel-deployed builds.

## Pass history index

Full record of every build/design/fix pass, in the order it actually
happened, is preserved — just relocated so it's read only when actually
needed, not on every dispatch by default. Each archive is a pure,
content-preserving extraction: nothing summarized or reworded, only moved.

- **[`docs/passes/slice-1-home-inventario.md`](docs/passes/slice-1-home-inventario.md)** — the original vertical slice (Home → Inventario → Registrar mercancía → Selling → Digital receipt). Four design passes (v1 build → v2/v3/v4 visual/design-system/demo-polish revisions), the "Cerrar sesión" → "Cerrar jornada de venta" terminology review, the `ProductPicker` premature-write Blocker fix, and a 2026-08-14 spec amendment (`home.md` §2/§3.7/§10, `settings.md` §2.1, Product Owner-raised) replacing the active-Session header's shared "⋯" → sheet with two direct affordances — a gear icon (⚙) straight into Configuración and a labeled "Cerrar jornada de venta" button straight into the unchanged close-session interlock; non-Session states keep the "⋯" → sheet shape unchanged. **Fix round, same day:** `ux-critic` caught the header's own `flex-wrap` allowing the button to drop to a genuine third line at realistic values ($12,450/23 ventas) — replaced with `flex-wrap: nowrap` plus a tightened `.stat`/`.closeSessionBtn` type scale so both elements hold one line even at extreme stress values; `reviewer` caught a stale, self-contradicting "Cerrar sesión" disclosure comment in `SessionHeader.tsx` — corrected to state that divergence closed 2026-08-13, matching this archive's own account. **2026-08-15 amendment (Product Owner-raised, extending the fix above to every remaining Home header state; `home.md` §2/§3.3–§3.6/§3.6a/§3.6c, `settings.md` §2.1):** `ColdStart.tsx`/`Idle.tsx`/`EventResume.tsx`'s own local "⋯" + one-row Sheet ("⚙ Configuración" only) is retired the same way the active-Session sheet was a day earlier — each now renders a direct gear icon (⚙) calling its existing `onOpenSettings` prop straight into Configuración, no `Sheet`, no `menuOpen` state, reusing (renamed, not reinvented) the CSS already identical to `SessionHeader.module.css`'s own `.gearBtn`. `tsc -b` clean; live-verified via Puppeteer against the cold-start state — screenshot confirms the gear icon renders and routes directly to Configuración's vista principal with no intermediate sheet.
- **[`docs/passes/slice-2-authentication-onboarding.md`](docs/passes/slice-2-authentication-onboarding.md)** — Phone → OTP → Owner identity → Business onboarding, per RFC 0007/D44 and `decision-log.md` D42/D43/D45, plus a post-approval fix (found via a Resultados-slice `merchant-user-tester` walkthrough) for a brand-new phone number silently resolving into a pre-existing, different-owner Business instead of fresh Onboarding.
- **[`docs/passes/slice-3-eventos.md`](docs/passes/slice-3-eventos.md)** — Eventos in full (scheduling, Event-active Home resolution, close/rollup), plus two follow-on merchant-user-tester-driven fixes (sold-out tile tap feedback; the same-day-resume sales-visibility trust gap, Q19).
- **[`docs/passes/slice-4-configuracion.md`](docs/passes/slice-4-configuracion.md)** — the four Business Capability actions (`subscriptionTier` × 2, `defaultSellingMode` × 2) plus the account-level "Cerrar sesión" sign-out action.
- **[`docs/passes/slice-5-resultados.md`](docs/passes/slice-5-resultados.md)** — Free/Paid-tier review (Session/Event/Venue drill-down, "Rendimiento por bazar," "Tus clientes"), plus its own review-pipeline fix round.
- **[`docs/passes/slice-6-asignar-tags.md`](docs/passes/slice-6-asignar-tags.md)** — Inventario's NFC-tagging queue (`InventoryUnit.tagId`, `assignTagToNextPendingUnit`, the live pending-tag selectors, the §3.5/§3.13/§3.14-§3.17 screens), plus rewiring Home's "Asignar tags" link away from its Placeholder stub, plus a `ux-critic` fix round (3 Major + 2 Minor — the "Lo que registraste" receipt and the "Faltan N de M" denominator both lifted out of `AssignTags` into `App.tsx` so neither is lost/misscoped across a defer/resume cycle; Error red replaced with plain body text for the two routine scan-failure states; a fixed-height error-line slot; a stable shell instead of a blank flash).
- **[`docs/passes/slice-7-nfc-selling.md`](docs/passes/slice-7-nfc-selling.md)** — real NFC Readiness (`nfcReadiness`, the disclosed `NFC_READINESS_THRESHOLD` constant), `startSession`'s `Session.operatingMode` resolution replacing its old hardcoded `'buttons'`, the shared `useNfcSessionStart`/`NfcSessionStartNote` pair realizing all four of `home.md` §3.6a's Session-start variants (Limited Ready inline override, Not Ready, capability revoked, and the one-time Ready-but-`buttons` discoverability nudge, `Business.nfcAvailabilityNudgeShown`), and `home.md` §3.10's own nfc-mode selling surface (`Selling.tsx`, `NFCScanPrompt` reused from Asignar Tags, `addItemToSaleByTag`). `product/02-ux/product-decisions.md` Q2 (a scan matching no available tagged unit) stays a genuinely open, disclosed gap — not resolved by this pass.
- **[`docs/passes/slice-8-paid-receipt-qr.md`](docs/passes/slice-8-paid-receipt-qr.md)** — the Paid-tier Claim Token/QR bridge (`home.md` §3.8f, `decision-log.md` D22/D40): `Receipt.claimToken` (ephemeral, in-memory only, never persisted to `Sale`/`AppState`), `finalizeSale`'s mock non-cryptographic `mintClaimToken` (opaque, never the raw Sale ID), and `ReceiptTicket`'s fourth element — a real, scannable `qrcode.react` QR encoding a mock `https://loyalty.nahui.mx/c/<token>` URL, plus its verbatim caption — rendered only when a Receipt was captured at finalization with `subscriptionTier=paid`. No in-app tap-navigation on the QR (Ana's own screen is never touched by this interaction, per the spec's own text); the separate `customer-loyalty-registration.md` destination flow (D38) stays untouched.
- **[`docs/passes/slice-9-settings-identity-strip.md`](docs/passes/slice-9-settings-identity-strip.md)** — design-audit-2026-08-15 item #5: a small, read-only business identity strip (`Business.name` + `Business.logo` when set) at the top of Configuración's vista principal (`settings.md` §3.3a/§3.6), above the existing "Tu plan"/"Cómo vendes normalmente" rows, reusing the exact fields `ReceiptTicket` already renders — no new data source, no interaction, no gating logic. Verified live against both real states (with logo, via a real path's file upload; without, via the demo path's seeded identity) using `puppeteer-core` driving the machine's own installed Chrome — the first pass in this folder with a real browser-automation tool available in-session.
- **[`docs/passes/slice-10-motion-polish.md`](docs/passes/slice-10-motion-polish.md)** — design-audit-2026-08-15 items #1/#2/#3/#6: the NFC scan prompt's generic wireless glyph swapped for a `TagStub` silhouette (new `showLetter`/`tone` override props, both defaulting to prior behavior); a residual decaying pendulum sway on the receipt's punched-hole/string `.loop` after `swingIn` settles; a staggered "torn away" exit on Venta Actual's chips when a sale is cancelled (a local unmount-delay pattern, since plain CSS can't animate an already-removed element); and a `BrandMark`/figure-settle entrance on the Close-summary screen, reusing `ColdStart`'s own shared device rather than inventing a new one. All four live-verified end to end against `npm run dev` (real sales, real Session closes, real Cancelar taps, `prefers-reduced-motion` toggled via `emulateMediaFeatures`) using `AppState` seeded directly through `localStorage` for fast, repeatable reach into each state. Live verification of #6's reduced-motion path caught and fixed a real CSS cascade-order bug — the Close-summary figure's reduced-motion override had been placed *before* the unconditional rule it was meant to override, making it dead code masked only by `tokens.css`'s separate 0ms-duration fallback; corrected to match `ReceiptTicket`'s own already-correct precedent.
- **[`docs/passes/demo-mode-welcome.md`](docs/passes/demo-mode-welcome.md)** — **New-Feature Workflow (D42), not a Migration Workflow slice** — first of its kind in this codebase, built against `product/02-ux/demo-mode.md` (Product Definition + UX Design + placement ruling D48 + `brand-guardian` review + Architecture Review, all complete), no prior Approved Medium-Fidelity spec. A one-time, validation-campaign-only welcome screen shown before `authentication.md`'s flow begins, structurally absent from a real production build. `DemoModeGate.tsx` (a static, compile-time `import.meta.env.VITE_DEMO_MODE` branch — new `.env.demo-campaign` / `package.json`'s `build:demo-campaign` script) wraps the unmodified `<AppRouter />`, mounted by `main.tsx` in place of the previously-bare `<AppRouter />`; `AppRouter.tsx` itself is untouched. `DemoModeGateActive.tsx` realizes `demo-mode.md` §2.1's device-acknowledgment check against a distinctly-named `localStorage` key (`nahui-demo-mode-acknowledged`, separate from `store.tsx`'s own `STORAGE_KEY`) via `demoModeStorage.ts`; `DemoWelcome.tsx` (§3.3/§3.4, one component, verbatim `brand-guardian`-reviewed copy) and `DemoLoadError.tsx` (§3.5, a genuinely reachable branch — unlike most of this codebase's other disclosed-unreachable defensive states) round out the screens. Verified: `tsc -b` clean; `npm run build`'s bundle grepped clean of every Demo Mode string/copy marker; `npm run build:demo-campaign`'s bundle contains all of them; both `npm run dev`/`npm run dev:demo-campaign` confirmed, via the Vite dev server's own served module output, that `import.meta.env.VITE_DEMO_MODE` is genuinely absent vs. `"true"` respectively. No browser-automation tool was available this session, so the actual interactive click-through (tap "Empezar demo" → land on `authentication.md`'s Phone step) was verified by direct code trace, not a live run — flagged as the natural next confirmation step.
- **[`docs/passes/demo-mode-reminder-banner.md`](docs/passes/demo-mode-reminder-banner.md)** — `demo-mode.md`'s 2026-08-18 §3.3 welcome-copy restructure (validation-not-a-sale sentence folded in, closing sentence rewritten, third bullet retired) plus the new "Reiniciar demo" restart feature (§2.4/§3.7/§3.8): the persistent reminder banner restructures from one full-width row into a primary row plus a slim secondary line (real "8-12 min" time estimate + a deliberately minor-weighted restart control, never a second full-width CTA), a `Sheet`-based confirm dialog, and a defensive fallback screen reusing `DemoLoadError.tsx`'s shape. Restart itself is a new `restartDemo.ts` module — clears `demoModeStorage.ts`'s device-acknowledgment flag plus `store.tsx`'s own newly-exported `STORAGE_KEY`, then forces a full reload, per the spec's own reasoning (`resetPrototype()` alone wouldn't remount `DemoModeGateActive`'s local gate state). Verified: `tsc -b` clean; production bundle still grepped clean of every Demo Mode string; demo-campaign bundle contains all new copy/labels; a full live click-through via a headless-Chromium/Playwright session (installed ad hoc, not a project dependency) exercised the real welcome screen, phone/OTP entry, the Onboarding demo path into Home, both banner rows, the confirm dialog's Cancelar (untouched-return) and Sí-reiniciar (real storage clear + reload back to a fresh welcome screen, confirmed via direct `localStorage` inspection) paths. The write-failure fallback (§3.8) was verified by code trace only, not a live-forced storage failure.

**A slice currently in progress** has its own live working file at
`context/<slice-name>.md` instead (see `CLAUDE.md`'s "Per-slice bounded
context files" section) — that's the one to read for anything not yet
folded into an archive above.

## File structure

```
product/02c-high-fidelity-prototype/
  README.md                  — this file (current reference; pass history in docs/passes/)
  DESIGN-SYSTEM.md           — structured reference (tokens, primitives,
                               the Swing Tag at five scales, typography/
                               motion roles, content conventions)
  package.json, tsconfig*.json, vite.config.ts, index.html
  src/
    main.tsx                  — StoreProvider + AppRouter
    AppRouter.tsx              — Authentication → Onboarding → tab-shell
                               resolution (authentication.md §2.1 /
                               onboarding.md §2.1), pure function of state
    App.tsx                   — the tab shell itself (frozen 4-tab nav)
    styles/
      tokens.css              — design tokens (see docs/passes/slice-1... "Design plan")
      patterns.css              — v3: shared system primitives (.grain,
                                 .tearTop/.tearBottom, .stitchTop/
                                 .stitchBottom, .moneyTag)
      global.css               — resets, app-shell device frame
      productIdentity.ts       — v2: deterministic per-Product tone/tilt
                                 (presentation-only, derives from Product.name)
    domain/
      types.ts                — Product/Lot/InventoryEntry/InventoryUnit
                                 (including `tagId`, Asignar Tags pass, D43)/
                                 Session/Sale/SaleItem/Business (including
                                 the pending-subscriptionTier-change
                                 triple)/User/BusinessMembership/Venue/Event/
                                 PriceOverride, mirroring domain-model.md's
                                 aggregates for this slice
      store.tsx                — StoreProvider/useStore: all writes (FIFO
                                 consumption, price resolution, Session/Sale
                                 lifecycle, Authentication/Onboarding writes,
                                 createEvent/cancelEvent/setPriceOverride,
                                 activatePaidPlan/requestDowngradeToFree/
                                 cancelPendingSubscriptionTierChange/
                                 changeDefaultSellingMode/
                                 reconcilePendingSubscriptionTier/signOut/
                                 assignTagToNextPendingUnit),
                                 localStorage-persisted
      selectors.ts             — pure derived reads (catalog rows, selling
                                 grid order, session totals, eventStatus/
                                 dayNumberForDate/eventRollup/eventsForList,
                                 Resultados' own all-time/per-Product/
                                 per-Venue rollups and sales-trend comparison,
                                 pendingTagUnits/pendingTagCount/
                                 pendingTagBreakdown/nfcCapable)
      dates.ts                  — calendar-date utilities (dateKey/todayKey,
                                 formatDateRange/formatShortDateRange,
                                 addDaysToKey, rangesOverlap — the D17
                                 check's own primitive)
      onboardingResolution.ts — pathFromCapabilities/isOnboardingComplete,
                                 the router's own pure-function resolution
      demoSeed.ts               — "Ver un ejemplo" seed data
      format.ts, id.ts         — pesos/pluralize/articulos formatting, id
                                 generator
    components/                — Button, NavBar, SessionHeader, ProductTile,
                                 TagStub, VentaActualTray, ReceiptTicket
                                 (signature element), Sheet, CatalogRow,
                                 QuantityStepper, ProductPicker, VenuePicker,
                                 EventTypeSheet, Placeholder, BrandMark,
                                 NFCScanPrompt (Asignar Tags pass, D43)
    screens/
      Authentication/          — AuthenticationFlow, PhoneStep, CodeStep
      Onboarding/               — OnboardingFlow, Welcome, ConfirmPaid,
                                 ConfirmDemo, WritingState, BusinessIdentity,
                                 SellingGroups, TodoListo
      Home/                    — HomeScreen (resolution per home.md §2),
                                 ColdStart, Idle, EventResume, Selling,
                                 CloseSummary
      Inventory/                — InventoryScreen ({mode,...} resolution,
                                 including 'assign-tags'), CatalogView
                                 (including the §3.5 pending-tag-work
                                 variant), RegisterMerchandise,
                                 InventoryColdStart, AssignTags (§3.14-§3.17,
                                 Asignar Tags pass, D43)
      Events/                    — EventsScreen ({mode,...} resolution,
                                 mirrors InventoryScreen), EventsColdStart,
                                 EventsList, NuevoEvento, EventDetail,
                                 AdjustPrices, eventTypeLabels.ts
      Settings/                  — SettingsScreen (orchestrator + SettingsMain,
                                 settings.md §3.3a/§3.6), ActionConfirm
                                 (§3.4/§3.5, one generic component for both),
                                 WritingState (§3.9/§3.10/§3.8a/§3.8b)
      Resultados/                 — ResultadosScreen ({mode,...} resolution,
                                 mirrors InventoryScreen/EventsScreen, plus a
                                 returnTo chain for correct Session/Event
                                 detail back-navigation), ResultadosColdStart,
                                 ResultadosMain, SessionDetail,
                                 ResultadosEventDetail, RendimientoPorBazar,
                                 VenueDetail, TusClientes (§3.13 only —
                                 Customer/Claim aren't modeled),
                                 ResultadosLoadError (built, unreachable —
                                 no real async load exists in this build)
  docs/
    passes/                    — pass-by-pass build history archive, see
                               "Pass history index" above
  context/
    <slice-name>.md            — live working context for a slice currently
                               in progress, see CLAUDE.md
```
