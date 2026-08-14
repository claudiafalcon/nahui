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

## Pass history index

Full record of every build/design/fix pass, in the order it actually
happened, is preserved — just relocated so it's read only when actually
needed, not on every dispatch by default. Each archive is a pure,
content-preserving extraction: nothing summarized or reworded, only moved.

- **[`docs/passes/slice-1-home-inventario.md`](docs/passes/slice-1-home-inventario.md)** — the original vertical slice (Home → Inventario → Registrar mercancía → Selling → Digital receipt). Four design passes (v1 build → v2/v3/v4 visual/design-system/demo-polish revisions), the "Cerrar sesión" → "Cerrar jornada de venta" terminology review, and the `ProductPicker` premature-write Blocker fix.
- **[`docs/passes/slice-2-authentication-onboarding.md`](docs/passes/slice-2-authentication-onboarding.md)** — Phone → OTP → Owner identity → Business onboarding, per RFC 0007/D44 and `decision-log.md` D42/D43/D45, plus a post-approval fix (found via a Resultados-slice `merchant-user-tester` walkthrough) for a brand-new phone number silently resolving into a pre-existing, different-owner Business instead of fresh Onboarding.
- **[`docs/passes/slice-3-eventos.md`](docs/passes/slice-3-eventos.md)** — Eventos in full (scheduling, Event-active Home resolution, close/rollup), plus two follow-on merchant-user-tester-driven fixes (sold-out tile tap feedback; the same-day-resume sales-visibility trust gap, Q19).
- **[`docs/passes/slice-4-configuracion.md`](docs/passes/slice-4-configuracion.md)** — the four Business Capability actions (`subscriptionTier` × 2, `defaultSellingMode` × 2) plus the account-level "Cerrar sesión" sign-out action.
- **[`docs/passes/slice-5-resultados.md`](docs/passes/slice-5-resultados.md)** — Free/Paid-tier review (Session/Event/Venue drill-down, "Rendimiento por bazar," "Tus clientes"), plus its own review-pipeline fix round.
- **[`docs/passes/slice-6-asignar-tags.md`](docs/passes/slice-6-asignar-tags.md)** — Inventario's NFC-tagging queue (`InventoryUnit.tagId`, `assignTagToNextPendingUnit`, the live pending-tag selectors, the §3.5/§3.13/§3.14-§3.17 screens), plus rewiring Home's "Asignar tags" link away from its Placeholder stub, plus a `ux-critic` fix round (3 Major + 2 Minor — the "Lo que registraste" receipt and the "Faltan N de M" denominator both lifted out of `AssignTags` into `App.tsx` so neither is lost/misscoped across a defer/resume cycle; Error red replaced with plain body text for the two routine scan-failure states; a fixed-height error-line slot; a stable shell instead of a blank flash).
- **[`docs/passes/slice-7-nfc-selling.md`](docs/passes/slice-7-nfc-selling.md)** — real NFC Readiness (`nfcReadiness`, the disclosed `NFC_READINESS_THRESHOLD` constant), `startSession`'s `Session.operatingMode` resolution replacing its old hardcoded `'buttons'`, the shared `useNfcSessionStart`/`NfcSessionStartNote` pair realizing all four of `home.md` §3.6a's Session-start variants (Limited Ready inline override, Not Ready, capability revoked, and the one-time Ready-but-`buttons` discoverability nudge, `Business.nfcAvailabilityNudgeShown`), and `home.md` §3.10's own nfc-mode selling surface (`Selling.tsx`, `NFCScanPrompt` reused from Asignar Tags, `addItemToSaleByTag`). `product/02-ux/product-decisions.md` Q2 (a scan matching no available tagged unit) stays a genuinely open, disclosed gap — not resolved by this pass.

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
