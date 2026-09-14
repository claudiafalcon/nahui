# Nahui — High-Fidelity Living Prototype

Real, running React/TypeScript vertical slice. Built per `decision-log.md`
D41 — placement/architecture ruling only; this file is the artifact itself.

**What's currently built** (see `BACKLOG.md` for the authoritative, always-current
"what's built"/"what's not built" status — this paragraph is a summary, not
the source of truth): a three-method identity gate — Google Sign-In, Email,
or phone/WhatsApp OTP, presented as equal-weight choices (`authentication.md`
§3.2a, `decision-log.md` D62/D63) — → Owner identity → Business onboarding →
Home → Inventario → Registrar mercancía → Selling → Digital receipt, plus
Eventos (scheduling, an Event-active Home resolution branch, Event
close/rollup), Configuración (the four Business Capability actions plus the
account-level "Cerrar sesión"), Resultados (Free/Paid-tier review,
Session/Event/Venue drill-down), Asignar Tags (Inventario's NFC-tagging
queue for nfc-capable Businesses, auto-entered after Guardar mercancía,
resumable via the Catalog view's own pending-tag status), an optional
`Product.photo` (captured at Product creation in either Onboarding or
Inventario, managed afterward via Inventario's own "Editar foto" sheet,
displayed on the Catalog row and the Venta rápida selling tile), and
multi-staff concurrent selling (`product-decisions.md` Q24/Q25's first
usable version — Invitation-based SELLER onboarding, a role-scoped Home/nav
experience, D53's simultaneous multi-Event Home resolution, manual
Event-scoped inventory allocation, and the "lost the race" concurrent-
selling conflict pattern; NFC-scan allocation, cross-Event reallocation,
and Event-close reconciliation are explicitly out of this first slice), and
real phone-camera barcode scanning (`decision-log.md` D65) — a second way
to resolve Producto in both Inventario's Elegir producto picker and
Selling's tile grid, alongside typed search/tile taps.

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

No backend beyond Supabase Auth for the identity gate. Real phone/WhatsApp
OTP (Twilio, via custom `send-otp`/`verify-otp` Edge Functions), real Email
OTP, and real Google Sign-In (both via Supabase Auth's own native
`signInWithOtp`/`signInWithOAuth`) are all wired to genuine calls — see
`supabase/README.md`'s own checklist for what's actually provisioned as of
this writing (fails closed, not mocked, until real credentials exist for
each). State otherwise lives in React Context + `useReducer`-style
`useState` updates, persisted to `localStorage` (key
`nahui-hifi-prototype-v1`) so a reload or tab switch never loses real
state. Clear that key (or open in a private window) to see the true
first-run experience again — "Elegir cómo entrar" (§3.2a), not Home cold
start, is the actual fresh-install screen.

`@vercel/analytics` (`<Analytics />`, mounted unconditionally in
`src/main.tsx`) provides Vercel Web Analytics for the Product Owner on
`nahui.app` — no local dev-time effect, active only on Vercel-deployed
builds.

## Pass history index

Full record of every build/design/fix pass, in the order it actually
happened, is preserved — just relocated so it's read only when actually
needed, not on every dispatch by default. Each archive is a pure,
content-preserving extraction: nothing summarized or reworded, only moved.

- **[`docs/passes/slice-1-home-inventario.md`](docs/passes/slice-1-home-inventario.md)** — the original vertical slice (Home → Inventario → Registrar mercancía → Selling → Digital receipt). Four design passes (v1 build → v2/v3/v4 visual/design-system/demo-polish revisions), the "Cerrar sesión" → "Cerrar jornada de venta" terminology review, the `ProductPicker` premature-write Blocker fix, and a 2026-08-14 spec amendment (`home.md` §2/§3.7/§10, `settings.md` §2.1, Product Owner-raised) replacing the active-Session header's shared "⋯" → sheet with two direct affordances — a gear icon (⚙) straight into Configuración and a labeled "Cerrar jornada de venta" button straight into the unchanged close-session interlock; non-Session states keep the "⋯" → sheet shape unchanged. **Fix round, same day:** `ux-critic` caught the header's own `flex-wrap` allowing the button to drop to a genuine third line at realistic values ($12,450/23 ventas) — replaced with `flex-wrap: nowrap` plus a tightened `.stat`/`.closeSessionBtn` type scale so both elements hold one line even at extreme stress values; `reviewer` caught a stale, self-contradicting "Cerrar sesión" disclosure comment in `SessionHeader.tsx` — corrected to state that divergence closed 2026-08-13, matching this archive's own account. **2026-08-15 amendment (Product Owner-raised, extending the fix above to every remaining Home header state; `home.md` §2/§3.3–§3.6/§3.6a/§3.6c, `settings.md` §2.1):** `ColdStart.tsx`/`Idle.tsx`/`EventResume.tsx`'s own local "⋯" + one-row Sheet ("⚙ Configuración" only) is retired the same way the active-Session sheet was a day earlier — each now renders a direct gear icon (⚙) calling its existing `onOpenSettings` prop straight into Configuración, no `Sheet`, no `menuOpen` state, reusing (renamed, not reinvented) the CSS already identical to `SessionHeader.module.css`'s own `.gearBtn`. `tsc -b` clean; live-verified via Puppeteer against the cold-start state — screenshot confirms the gear icon renders and routes directly to Configuración's vista principal with no intermediate sheet.
- **[`docs/passes/slice-2-authentication-onboarding.md`](docs/passes/slice-2-authentication-onboarding.md)** — Phone → OTP → Owner identity → Business onboarding, per RFC 0007/D44 and `decision-log.md` D42/D43/D45, plus a post-approval fix (found via a Resultados-slice `merchant-user-tester` walkthrough) for a brand-new phone number silently resolving into a pre-existing, different-owner Business instead of fresh Onboarding. **2026-09-04 amendment (`product-decisions.md` Q20):** "Define lo que vendes" gains a Cantidad field (reusing `QuantityStepper` verbatim) and switches its write from the now-removed `createProducts()` to `commitLot()` — same atomic Product+Lot+InventoryEntry+InventoryUnit write Inventario's Registrar Mercancía already uses. `ux-critic` found 2 Minor on the build (a bare, unlabeled quantity numeral; a quote-style mismatch against the Approved copy) — both fixed, the quantity now rendering as a unit-suffixed "N pzas." (Product Owner-confirmed treatment, folded back into `onboarding.md` §3.5c). `reviewer` found 0 Blockers and 2 Important documentation-persistence gaps on the built code (this entry closes one; the "pzas." spec fold-back closes the other) plus one pre-existing, tracked-not-fixed gap — `commitLot()` carries no idempotency guard, `BACKLOG.md` §F.
- **[`docs/passes/slice-3-eventos.md`](docs/passes/slice-3-eventos.md)** — Eventos in full (scheduling, Event-active Home resolution, close/rollup), plus two follow-on merchant-user-tester-driven fixes (sold-out tile tap feedback; the same-day-resume sales-visibility trust gap, Q19).
- **[`docs/passes/slice-4-configuracion.md`](docs/passes/slice-4-configuracion.md)** — the four Business Capability actions (`subscriptionTier` × 2, `defaultSellingMode` × 2) plus the account-level "Cerrar sesión" sign-out action.
- **[`docs/passes/slice-5-resultados.md`](docs/passes/slice-5-resultados.md)** — Free/Paid-tier review (Session/Event/Venue drill-down, "Rendimiento por bazar," "Tus clientes"), plus its own review-pipeline fix round.
- **[`docs/passes/slice-6-asignar-tags.md`](docs/passes/slice-6-asignar-tags.md)** — Inventario's NFC-tagging queue (`InventoryUnit.tagId`, `assignTagToNextPendingUnit`, the live pending-tag selectors, the §3.5/§3.13/§3.14-§3.17 screens), plus rewiring Home's "Asignar tags" link away from its Placeholder stub, plus a `ux-critic` fix round (3 Major + 2 Minor — the "Lo que registraste" receipt and the "Faltan N de M" denominator both lifted out of `AssignTags` into `App.tsx` so neither is lost/misscoped across a defer/resume cycle; Error red replaced with plain body text for the two routine scan-failure states; a fixed-height error-line slot; a stable shell instead of a blank flash).
- **[`docs/passes/slice-7-nfc-selling.md`](docs/passes/slice-7-nfc-selling.md)** — real NFC Readiness (`nfcReadiness`, the disclosed `NFC_READINESS_THRESHOLD` constant), `startSession`'s `Session.operatingMode` resolution replacing its old hardcoded `'buttons'`, the shared `useNfcSessionStart`/`NfcSessionStartNote` pair realizing all four of `home.md` §3.6a's Session-start variants (Limited Ready inline override, Not Ready, capability revoked, and the one-time Ready-but-`buttons` discoverability nudge, `Business.nfcAvailabilityNudgeShown`), and `home.md` §3.10's own nfc-mode selling surface (`Selling.tsx`, `NFCScanPrompt` reused from Asignar Tags, `addItemToSaleByTag`). `product/02-ux/product-decisions.md` Q2 (a scan matching no available tagged unit) stays a genuinely open, disclosed gap — not resolved by this pass.
- **[`docs/passes/slice-8-paid-receipt-qr.md`](docs/passes/slice-8-paid-receipt-qr.md)** — the Paid-tier Claim Token/QR bridge (`home.md` §3.8f, `decision-log.md` D22/D40): `Receipt.claimToken` (ephemeral, in-memory only, never persisted to `Sale`/`AppState`), `finalizeSale`'s mock non-cryptographic `mintClaimToken` (opaque, never the raw Sale ID), and `ReceiptTicket`'s fourth element — a real, scannable `qrcode.react` QR encoding a mock `https://loyalty.nahui.mx/c/<token>` URL, plus its verbatim caption — rendered only when a Receipt was captured at finalization with `subscriptionTier=paid`. No in-app tap-navigation on the QR (Ana's own screen is never touched by this interaction, per the spec's own text); the separate `customer-loyalty-registration.md` destination flow (D38) stays untouched.
- **[`docs/passes/slice-9-settings-identity-strip.md`](docs/passes/slice-9-settings-identity-strip.md)** — design-audit-2026-08-15 item #5: a small, read-only business identity strip (`Business.name` + `Business.logo` when set) at the top of Configuración's vista principal (`settings.md` §3.3a/§3.6), above the existing "Tu plan"/"Cómo vendes normalmente" rows, reusing the exact fields `ReceiptTicket` already renders — no new data source, no interaction, no gating logic. Verified live against both real states (with logo, via a real path's file upload; without, via the demo path's seeded identity) using `puppeteer-core` driving the machine's own installed Chrome — the first pass in this folder with a real browser-automation tool available in-session.
- **[`docs/passes/slice-10-motion-polish.md`](docs/passes/slice-10-motion-polish.md)** — design-audit-2026-08-15 items #1/#2/#3/#6: the NFC scan prompt's generic wireless glyph swapped for a `TagStub` silhouette (new `showLetter`/`tone` override props, both defaulting to prior behavior); a residual decaying pendulum sway on the receipt's punched-hole/string `.loop` after `swingIn` settles; a staggered "torn away" exit on Venta Actual's chips when a sale is cancelled (a local unmount-delay pattern, since plain CSS can't animate an already-removed element); and a `BrandMark`/figure-settle entrance on the Close-summary screen, reusing `ColdStart`'s own shared device rather than inventing a new one. All four live-verified end to end against `npm run dev` (real sales, real Session closes, real Cancelar taps, `prefers-reduced-motion` toggled via `emulateMediaFeatures`) using `AppState` seeded directly through `localStorage` for fast, repeatable reach into each state. Live verification of #6's reduced-motion path caught and fixed a real CSS cascade-order bug — the Close-summary figure's reduced-motion override had been placed *before* the unconditional rule it was meant to override, making it dead code masked only by `tokens.css`'s separate 0ms-duration fallback; corrected to match `ReceiptTicket`'s own already-correct precedent.
- **Demo-campaign build variant — retired 2026-09-10.** `demo.nahui.app`'s separate welcome screen + build gate (`DemoModeGate.tsx`, `.env.demo-campaign`, `npm run build:demo-campaign`) and the "Acceso DM" auto-login shortcut (`src/screens/AccesoDM/`) were removed from this codebase by Product Owner decision: once real WhatsApp OTP shipped, `demo.nahui.app` mirrored `nahui.app`'s own auth flow, so it no longer offered the low-friction, no-real-phone-number experience it was built for. Full reasoning in `company/bitacora.md`'s retirement entry. The two build passes that created this capability remain preserved, content-unchanged, as historical record: [`docs/passes/demo-mode-welcome.md`](docs/passes/demo-mode-welcome.md), [`docs/passes/demo-mode-reminder-banner.md`](docs/passes/demo-mode-reminder-banner.md) — both now flagged at their own top as describing a retired feature.

- **[`docs/passes/slice-11-product-photo.md`](docs/passes/slice-11-product-photo.md)** — `product/02-ux/product-decisions.md` Q23 / `decision-log.md` D54: optional `Product.photo`, captured at Product creation (Onboarding's "Define lo que vendes," Inventario's "Registrar mercancía") and manageable afterward via Inventario's new Catalog-row "Editar foto" sheet (§3.4b — add/change/remove, staged until "Guardar foto," a simple full-viewport inspect view). The shared `TagStub` marker component (Catalog row, selling tile, product picker, committed-line previews) gains the photo-substitution rendering and its own silent render-failure fallback once, for every consumer at once. `CatalogRow`'s marker becomes its own independent tap target, disambiguated from the row body and the price figure. Display-only on Home's Venta rápida tile, by explicit Product Owner instruction — no upload/edit/remove/enlarge interaction there. `tsc -b` and `npm run build` both clean; no live browser verification this session (disclosed).
- **[`docs/passes/slice-12-multi-staff-concurrent-selling.md`](docs/passes/slice-12-multi-staff-concurrent-selling.md)** — `product/02-ux/product-decisions.md` Q24/Q25's own directed "first usable version," built in the 4 phases `architect`'s own Architecture Gap Analysis recommended (`context/q24-q25-first-slice.md`, now superseded by this entry): a foundational refactor (`AppState.currentUser` → `users[]`/`currentUserId`, a real global-phone `verifyOtp` lookup, `actingMembership`/`myActiveSession` as the shared "this device's own acting Membership" primitive, D17's dead overlap-check code removed); Identity capability (`Invitation`, `BusinessMembership.status`/`revokedAt`, `Sale.performedByMembershipId`, `authentication.md`'s new Invitation-acceptance flow, `settings.md`'s new "Tu equipo"); Home's full role-scoped SELLER experience plus D53's simultaneous multi-Event resolution (`home.md` §3.6b "Elegir evento," §3.7c "Mi actividad de hoy," §3.15-§3.17); manual (quantity-only, no NFC-scan) Event-scoped inventory allocation (`events.md` §3.21/§3.23) and the real Physical-location-exclusivity compare-and-swap gate, plus the "lost the race" terminal UI pattern (disclosed genuinely unreachable through real interaction in this no-backend prototype, exactly as `product-decisions.md` itself anticipates). One disclosed, `architect`-adjudicated deviation from RFC 0009's own "No changes to Session" (a prototype-only `Session.openedByMembershipId`, standing in for real per-device separation — kept, never promoted to `domain-model.md`) and one real spec-fidelity gap the build's own approximation surfaced: `authentication.md`'s literal "never verified before, anywhere" case-0 gate missed a real, reachable population (verified once, stalled before Onboarding, invited later). `architect` confirmed the gap; `ux-designer` drafted a formal amendment (§2.1/§2.2/§2.2a/§8 item 6, 2026-09-07) correcting the condition and adding a second entry point — no new screen/copy, the code already matched once the spec caught up. `tsc -b`/`npm run build` verified clean after every phase, not only at the end. Two real bugs found and fixed via live `puppeteer-core` walkthroughs against `npm run dev` (an `InvitationFlow` success-screen skip caused by a state-derived condition flipping under its own write; an `ElegirEvento` row tap that computed and discarded JSX instead of triggering a re-render) — both confirmed fixed via a second full live run. **Review Pipeline complete:** `ux-critic` found 3 Major + 1 Minor, 0 Blockers on first pass (ProductTile's stock-line legibility/duplication, wrong disabled-tap hint/aria-label for allocation-exhausted tiles, a declined-Invitation reload-persistence gap, an over-triggering clamp message) — all fixed and re-verified clean. `reviewer` found 1 Important (a stale doc comment in `InvitationFlow.tsx`, fixed), 0 Blockers — everything else, including the `Session.openedByMembershipId` disclosure, `AllocationMovement` correctly left unbuilt, bounded-context discipline, and ubiquitous-language leaks, checked clean. Full disclosure, scope-gap, and verification record in the pass entry itself. **Further fix round, 2026-09-07 (`merchant-user-tester`-found defect):** `AccesoRevocado.tsx`'s "Entendido" button produced zero visible feedback on tap (`window.close()` silently no-ops for a tab the merchant opened herself) — fixed with an unconditional disable/relabel plus an inline "Ya puedes cerrar esta pestaña." acknowledgment, live-verified via a scripted Playwright walkthrough. A `settings.md §3.14` wording amendment (correcting its "closes/exits the app" phrasing) was drafted and handed to Main to apply — see the pass entry's own fix-round section.

- **[`docs/passes/slice-13-multi-method-auth.md`](docs/passes/slice-13-multi-method-auth.md)** — `product/99-rfc/0012-auth-identity-multi-method.md` (Accepted)/`decision-log.md` D62/D63: a real `AuthIdentity` aggregate (`(type, identifier)`-keyed, `phone | email | google | apple`) replaces `User.phone`/`phoneVerifiedAt` directly; Google Sign-In and Email activated as fully independent first-time methods alongside phone, via a thin `src/domain/authProviders.ts` wrapper around Supabase Auth's own `signInWithOAuth`/`signInWithOtp` (a separate seam from `otpClient.ts`'s own custom Edge Functions, since phone identities mint outside Supabase's native auth tables and Google/Email mint inside them). New `ChooseMethodStep` (§3.2a, the new default first-run entry point), `EmailStep` (§3.2e/§3.2f combined), a Google sub-flow (`GoogleStep.tsx`, §3.2b/§3.2c/§3.2d); `CodeStep`/`PhoneMismatchConfirm` generalized (`channel`/`identifier`, `channel`/`displayValue`) rather than forked. `AppRouter.tsx`'s prefill plumbing made channel-aware; Google's ephemeral display label (never persisted, RFC 0012 §1) threaded up through a callback since a real OAuth redirect is a full-page navigation that destroys in-flight component state. `tsc -b`/`npm run build` verified clean after each build stage (domain layer, `ChooseMethodStep`/state-machine, email path, Google path), not only at the end. Both new provider calls fail closed (real errors) until the Product Owner provisions a Google Cloud OAuth Client in the Supabase project — same disclosed posture `otpClient.ts` already holds for Twilio/WhatsApp; not live-tested end to end. `Invitation`/`InvitationFlow.tsx`/`createInvitation`/`acceptInvitation`/`declineInvitation` deliberately untouched, per this dispatch's own scope (separate RFC 0013 work) — only their `User.phone` reads were corrected to resolve through the new `phoneIdentifierFor` selector, a necessary compile-level/domain-layer consequence of the `AuthIdentity` correction, not a redesign of Invitation semantics.

- **[`docs/passes/slice-14-barcode-scanning.md`](docs/passes/slice-14-barcode-scanning.md)** — `decision-log.md` D65, `inventory.md` §3.8/§3.8a-§3.8e, `home.md` §3.9/§3.9a/§3.9a-i/§3.9b/§3.9c: real phone-camera barcode scanning (`@zxing/browser`, dynamically imported so Home/Selling's main bundle stays lean), a second way to resolve Producto alongside typed search (Inventario) and a tile tap (Selling). New shared `BarcodeScanner` component (live `getUserMedia` + continuous decode — the one real camera surface in this codebase, unlike NFC's simulated tap); `ProductPicker.tsx` gains the confirm-on-scan sheet (§3.8c, this picker's one deliberate "ask before resolving" exception), the scan-no-match "nuevo producto" variant (§3.8a), and the permission-denied/failed-read states (§3.8d/§3.8e); `Selling.tsx` gains the silent scan-to-add (§3.9a), the zero-stock ambient message (§3.9a-i, reusing the existing dimmed-tile mechanism), and the no-match dead end toward Inventario (§3.9b, never an inline-creation shortcut, per D65). Found and closed a real backend gap along the way, disclosed rather than silently assumed: the already-applied Stage 7 Phase 1 migration never actually wrote `products.barcode` despite the column/index existing — a new, additive migration fixes it, **not yet pushed** to the real hosted project (no CLI-auth credential in this environment; see `supabase/README.md` checklist item 12). `tsc -b`/`npm run build` both clean. No live camera/device test was possible in this environment (no physical camera, no barcode to present, and the write-path migration isn't live yet) — full disclosure, and the specific real-device verification still needed, in the pass entry itself.
- **Stage 7 Backend Integration — Read-side data hydration (2026-09-14, `architect`'s design, `context/stage-7-backend-integration.md`).** Not a new feature slice — no `docs/passes/slice-N.md` entry, matching every earlier Stage 7 Phase 0-2c pass's own precedent of living entirely in `supabase/README.md` instead (see that file's own entry for the full detail: every new/changed function, the 22-site `applyWriteMirror` substitution, the new `hydrationMapping.ts`). Closes the cross-cutting gap Phases 0-2c left behind: 22 write RPCs were wired, but nothing ever re-fetched real backend data on load, so a second device or a cleared browser saw none of the real, correctly-persisted data. Two small new UI pieces genuinely belong here: the shared `ResolvingState.tsx` (the §3.1/§3.2 near-instant-skeleton/"Un momento…" convention `home.md`/`inventory.md`/`events.md`/`reports.md` already specify identically, now wired to a real `Promise` for the first time) and `AuthResolving.tsx` (`AppRouter.tsx`'s new pre-shell gate for the actual second-device bug this pass fixes — disclosed as a deliberate deviation from those same specs' nav-bar-present wireframes, since no tab/role context exists yet at that exact moment). `ResultadosLoadError.tsx` (built, disclosed-unwired since the Resultados pass) is now genuinely wired. `tsc -b`/`npm run build` both clean. Not yet `reviewer`-verified.
- **Stage 7 Backend Integration — Phase 3, Results/Resultados (2026-09-14, `architect`'s design, `context/stage-7-backend-integration.md`).** Verification-only pass, no code changes: `architect`'s Gap Analysis confirmed no new tables/RLS needed, and direct inspection confirmed every Resultados screen (`ResultadosScreen.tsx` and every sub-screen — Session/Event detail, Rendimiento por bazar, venue drill-down, Historial, En curso, Top productos, Tus clientes) already reads exclusively from `useStore()`'s real `AppState` via the existing `selectors.ts` pure functions (`allTimeTotals`, `topProductsAllTime`, `sessionTotals`, `sessionProductBreakdown`, `eventRollup`, `eventDayRows`, `eventProductBreakdown`, `historialRows`, `enCursoRows`, `venuePerformance`, `venueHistorialRows`, `salesTrend`, `hasAnyClosedSession`) — never a mock/seed structure, since mock and hydrated data were always the same `AppState` shape. Every dollar figure traced to `SaleItem.pricePaid` only (`allTimeTotals`/`sessionTotals`/`eventRollup`/etc.), never a re-read of `price_overrides`/`products.default_price` — `priceOverrideFor` exists but is Selling-write-path-only, never called from Resultados. `TusClientes.tsx` confirmed to render only its unconditional zero-Claims empty state, no `customers`/`claims` query anywhere. Resultados' OWNER-only gating confirmed already correct in code (`App.tsx`'s `activeTab === 'resultados' && role === 'OWNER'`, `NavBar`'s `visibleTabs` restriction for non-OWNER) — `reports.md` itself never states this scope in its own text, a documentation-only gap `architect` already flagged and routed to `ux-designer`, not a code fix. One stale doc-comment fixed in this file's own file-structure listing (`ResultadosLoadError` marked "unreachable" before the hydration pass wired it). `tsc -b`/`npm run build` both clean. Not yet `reviewer`-verified.

- **Team Invitations — real token-based UI rebuild (2026-09-14, `ui-designer`, Migration Workflow — full detail in `context/team-invitations-real-wiring.md`).** `TeamScreen.tsx`/`InvitationFlow.tsx` rebuilt against the reworked `settings.md` §2.7/§3.11-§3.14 and the new `authentication.md` §2.0/§2.2/§2.2a/§3.9a-§3.9b/§3.10-§3.13a (RFC 0013/D64), closing the compile-error gap `builder`'s own backend-wiring pass (same day) left disclosed. `InvitationFlow.tsx` is now the full pre-auth Invitation-link gate — `peekInvitation` read before any authentication runs, the offer screen, an inline `AuthenticationFlow` mounting (carrying a new `invitationContext` prop, threaded through `ChooseMethodStep`/`PhoneStep`/`EmailStep`/`GoogleError`/`CodeStep` via a new shared `InvitationContextLine` component) for a session-less device, and the four-outcome `acceptInvitation` resolution (success, `invitation_not_available`, `already_member`, `membership_revoked`) — mounted by `AppRouter.tsx` as a new, higher-precedence `invitationGateActive` branch that fully preempts every ordinary post-auth branch (including the §3.7e device-history check, structurally, not via a special-case flag) until it calls `onDone`, which also clears the URL back to `/` so a reload can't re-open the same offer forever. `TeamScreen.tsx` rebuilt against `Invitation`'s new token shape (`targetHint`/`expiresAt`, `invitationDisplayStatus`), including the real one-time link generation/display/copy/share flow (§3.12/§3.12c) and the widened five-row-state `teamRows` selector (`selectors.ts`, `TeamRow` split into five single-literal-discriminant variants — a TS narrowing limitation with a multi-literal discriminant, not a logic bug, is why). One small, disclosed store.tsx addition: `cancelInvitation` (§3.12d), local-mock only, same disclosed not-yet-real-backend-wired shape `revokeMembership` already has (the real `cancel_invitation` RPC stays a named, out-of-scope gap). `tsc -b`/`npm run build` both clean. **Full review pipeline complete.** `ux-critic`/`reviewer` fix round 1 found and closed 1 Blocker (the §3.7e identity-confirmation gate was skippable via the Invitation-accept path — fixed by extracting a shared `phoneMismatchConfirmationTarget` selector, `src/domain/authResolution.ts`, consumed by both `AppRouter.tsx` and `InvitationFlow.tsx`) + 2 Major (a Google-redirect-return state gap; a missing-per-screen-heading accessibility regression) + 1 Minor, plus a `knowledge-mentor`-driven fix (an honest copy-success/failure signal on the one-time-secret reveal screen, replacing a silently-swallowed clipboard error). Re-verification found the Blocker fix itself sound but surfaced a genuine spec-authorization gap: the new §3.7e-reuse composition wasn't described anywhere in `authentication.md`'s literal text. `ux-designer` authorized it explicitly (`authentication.md`'s new §2.0 step 4 third branch) after showing the spec's own literal alternative — re-authenticating via §3.2a — would have silently defeated the very device-history check §3.7e exists to enforce. A second, independent Blocker was found reading the deployed backend SQL directly: `accept_invitation` never actually raised `already_member`/`membership_revoked` (a pre-existing `BusinessMembership`, active or revoked, silently resolved to a false success) — fixed per `architect`'s design (`20260914040000_accept_invitation_membership_conflict_fix.sql`): raise the named exceptions and let Postgres's own transaction rollback leave the Invitation untouched, no new mechanism needed. All committed (`4b901ec`, `57ba043`).

- **`cancel_invitation` real wiring (2026-09-14, `builder`, `architect`-designed RPC — full detail in `supabase/README.md`).** Closes the last still-open instance of the "UI built, RPC still local-mock" defect class the Team Invitations pass above and the same-day `revokeMembership` wiring already closed for `createInvitation`/`acceptInvitation`/`revokeMembership`: `settings.md` §3.12d "Cancelar invitación" was already fully built in `TeamScreen.tsx`'s cancel-confirm sheet, calling a local-mock `cancelInvitation` that couldn't fail. New migration `20260914050000_cancel_invitation.sql` (OWNER-only, idempotency-keyed, `status = 'pending'` CAS — deliberately expiry-independent, matching `regenerate_invitation`'s own precedent; deliberately no Paid-tier gate, since closing an existing exposure should never strand a downgraded OWNER), pushed to the real hosted project. `store.tsx`'s `cancelInvitation` rewritten as a real `async` RPC call matching `acceptInvitation`'s own conventions (named-exception check, `applyWriteMirror` mirror, discriminated return shape); `TeamScreen.tsx`'s `handleConfirmCancel` updated to `await` it (a persisted, retry-reused idempotency key, since this CAS — unlike `regenerate_invitation`'s — consumes the `pending` status on success) and route a real failure into the screen's own already-built `cancel-error` state, previously unreachable dead code. `tsc -b`/`npm run build` both clean. Not yet `reviewer`-verified.

- **`peek_invitation` rate-limit mitigation (2026-09-14, `builder`, `architect`-designed — full detail in `supabase/README.md`, independent of the `cancel_invitation` pass above).** Closes RFC 0013 §4/§7's token-enumeration surface: `peek_invitation` is anon-callable and resolves an Invitation by token alone, before authentication runs, with nothing previously stopping a caller from hammering it with guessed tokens directly via PostgREST. New table `invitation_peek_attempts` (`otp_attempts`'s own deny-by-default RLS shape), `peek_invitation`'s anon/authenticated `EXECUTE` grant revoked outright, and a new Edge Function `peek-invitation` (structured identically to `send-otp`) fronting the RPC — reads the caller's IP from `x-forwarded-for`, buckets under `'unknown'` if absent (fail closed), returns `429 rate-limited` at ≥20 attempts/IP/10 minutes without touching `peek_invitation` at all otherwise. Client: new `src/domain/invitationClient.ts` (mirrors `otpClient.ts`'s `callOtpFunction` shape), `store.tsx`'s `peekInvitation` switched from a direct RPC call to this Edge Function; a rate-limited response collapses into the same `null` → §3.9b generic retry state every other `peekInvitation` failure already produces, matching how `sendOtp`'s own `rate-limited` reason already collapses into `PhoneStep.tsx`'s one generic error branch — no new UI state invented. Migration pushed via `supabase db push`, function deployed via `supabase functions deploy peek-invitation` and confirmed `ACTIVE`. **NOT LIVE-TESTED end to end** — this environment can't invoke the deployed function to verify `x-forwarded-for` behavior live, same disclosure `send-otp`/`verify-otp` already carry. `tsc -b`/`npm run build` both clean. Not yet `reviewer`-verified.

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
    AppRouter.tsx              — Authentication → InvitationFlow →
                               Onboarding → tab-shell resolution
                               (authentication.md §2.1/§2.2 case 0,
                               onboarding.md §2.1), pure function of state
                               (Slice 12's own disclosed InvitationFlow-gate
                               approximation lives in this file's own doc
                               comment)
    App.tsx                   — the tab shell (frozen 4-tab nav for OWNER;
                               role-scoped to Hoy-only for SELLER, Slice 12
                               — also resolves home.md §2 step 0, a revoked
                               Membership, above the tab shell entirely)
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
                                 Session (including `openedByMembershipId`,
                                 a disclosed Slice 12 prototype-only field —
                                 see its own doc comment)/Sale (including
                                 `performedByMembershipId`, D58)/SaleItem/
                                 Business (including the
                                 pending-subscriptionTier-change triple)/
                                 User (array-shaped, Slice 12)/
                                 BusinessMembership (including
                                 `status`/`revokedAt`, D55)/Invitation
                                 (new, Slice 12, D56)/Venue/Event/
                                 PriceOverride/EventAllocation (new, Slice
                                 12, D57 — manual-mode fields only),
                                 mirroring domain-model.md's aggregates for
                                 this slice
      store.tsx                — StoreProvider/useStore: all writes (FIFO
                                 consumption, price resolution, Session/Sale
                                 lifecycle scoped to the acting Membership,
                                 the EventAllocation compare-and-swap gate,
                                 Authentication/Onboarding writes,
                                 createEvent/cancelEvent/setPriceOverride,
                                 activatePaidPlan/requestDowngradeToFree/
                                 cancelPendingSubscriptionTierChange/
                                 changeDefaultSellingMode/
                                 reconcilePendingSubscriptionTier/signOut/
                                 assignTagToNextPendingUnit/
                                 createInvitation/acceptInvitation/
                                 revokeMembership/removeSaleItem/
                                 saveEventAllocations — Slice 12),
                                 localStorage-persisted (with a full
                                 pre-Slice-12 migration path in `loadState`)
      selectors.ts             — pure derived reads (catalog rows, selling
                                 grid order, session totals, eventStatus/
                                 dayNumberForDate/eventRollup/eventsForList,
                                 Resultados' own all-time/per-Product/
                                 per-Venue rollups and sales-trend comparison,
                                 pendingTagUnits/pendingTagCount/
                                 pendingTagBreakdown/nfcCapable,
                                 currentUser/findMembership/actingMembership/
                                 myActiveSession/sessionsOpenedBy/
                                 pendingInvitationsForPhone/teamRows/
                                 activeTeamCount/eventAllocationFor/
                                 disponibleEnGeneral/eventScopedRemaining/
                                 myActivityToday/activeEventsForBusiness —
                                 Slice 12)
      dates.ts                  — calendar-date utilities (dateKey/todayKey,
                                 formatDateRange/formatShortDateRange,
                                 addDaysToKey — `rangesOverlap`, the D17
                                 check's own primitive, is no longer
                                 imported by store.tsx as of Slice 12/D53,
                                 kept here as a general-purpose utility)
      onboardingResolution.ts — pathFromCapabilities/isOnboardingComplete,
                                 the router's own pure-function resolution
      demoSeed.ts               — "Ver un ejemplo" seed data
      format.ts, id.ts         — pesos/pluralize/articulos formatting, id
                                 generator
    components/                — Button, NavBar (role-scoped `visibleTabs`,
                                 Slice 12), SessionHeader (role-scoped
                                 header icon + "Ver mi actividad de hoy,"
                                 Slice 12), ProductTile (Event-scoped
                                 remaining-stock line, Slice 12), TagStub,
                                 VentaActualTray (the ⊗ "lost the race"
                                 marker, Slice 12), ReceiptTicket
                                 (signature element), Sheet, CatalogRow,
                                 QuantityStepper, ProductPicker, VenuePicker,
                                 EventTypeSheet, Placeholder, BrandMark,
                                 NFCScanPrompt (Asignar Tags pass, D43)
    screens/
      Authentication/          — AuthenticationFlow, PhoneStep, CodeStep,
                                 InvitationFlow (authentication.md
                                 §2.2a/§3.10-§3.13a, Slice 12)
      Onboarding/               — OnboardingFlow, Welcome, ConfirmPaid,
                                 ConfirmDemo, WritingState, BusinessIdentity,
                                 SellingGroups, TodoListo
      Home/                    — HomeScreen (resolution per home.md §2,
                                 including Slice 12's role resolution and
                                 D53's §2 step 2a/2b split), ColdStart, Idle,
                                 EventResume (all three role-scoped, Slice
                                 12), Selling (role-scoped header + lost-
                                 the-race handling, Slice 12), CloseSummary,
                                 ElegirEvento (§3.6b, Slice 12),
                                 MiActividadDeHoy (§3.7c, Slice 12),
                                 SellerAccountScreen (§3.15a's own stand-in,
                                 Slice 12), AccesoNoDisponible (§3.17, Slice
                                 12)
      Inventory/                — InventoryScreen ({mode,...} resolution,
                                 including 'assign-tags'), CatalogView
                                 (including the §3.5 pending-tag-work
                                 variant), RegisterMerchandise,
                                 InventoryColdStart, AssignTags (§3.14-§3.17,
                                 Asignar Tags pass, D43)
      Events/                    — EventsScreen ({mode,...} resolution,
                                 mirrors InventoryScreen), EventsColdStart,
                                 EventsList, NuevoEvento (D17 dead code
                                 removed, Slice 12), EventDetail (new
                                 "Llevar mercancía"/"Ver mercancía de este
                                 evento" entry points, Slice 12),
                                 AdjustPrices, MercanciaParaEsteEvento
                                 (§3.21/§3.23, manual-only, Slice 12),
                                 eventTypeLabels.ts
      Settings/                  — SettingsScreen (orchestrator + SettingsMain,
                                 settings.md §3.3a/§3.6, now including "Tu
                                 equipo," Slice 12), ActionConfirm
                                 (§3.4/§3.5, one generic component for both),
                                 WritingState (§3.9/§3.10/§3.8a/§3.8b),
                                 TeamScreen (§3.11-§3.13, Slice 12),
                                 AccesoRevocado (§3.14, Slice 12)
      Resultados/                 — ResultadosScreen ({mode,...} resolution,
                                 mirrors InventoryScreen/EventsScreen, plus a
                                 returnTo chain for correct Session/Event
                                 detail back-navigation), ResultadosColdStart,
                                 ResultadosMain, SessionDetail,
                                 ResultadosEventDetail, RendimientoPorBazar,
                                 VenueDetail, TusClientes (§3.13 only —
                                 Customer/Claim aren't modeled),
                                 ResultadosLoadError (built and wired since
                                 the Stage 7 read-side hydration pass — no
                                 longer unreachable, see that pass's entry)
  docs/
    passes/                    — pass-by-pass build history archive, see
                               "Pass history index" above
  context/
    <slice-name>.md            — live working context for a slice currently
                               in progress, see CLAUDE.md
```
