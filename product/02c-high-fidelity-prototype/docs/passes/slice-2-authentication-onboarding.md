# Slice 2 — Authentication + Onboarding

Archived pass history, extracted from `README.md` as part of the
knowledge-architecture refactor (Stage 4, 2026-08-13). This is a pure,
content-preserving move — nothing below is summarized, reworded, or
deleted, only relocated out of the file every dispatch reads by default.
See `README.md`'s own "Pass history index" for the current, durable
reference this archive was split from.

---

## Authentication + Onboarding pass (2026-08-13) — Migration Workflow (D43):
Phone → OTP → Owner identity → approved Business onboarding → Home

Builds `product/02-ux/authentication.md` (Approved) and
`product/02-ux/onboarding.md` (Approved) as the combined first-run slice, on
top of `product/99-rfc/0007-user-and-business-membership.md` (Accepted,
promoted via `decision-log.md` D44) as the domain contract for
`User`/`BusinessMembership`/the atomic Owner-creation write. An Architecture
Gap Analysis (`architect`) ran ahead of this pass and found no blockers and
nothing requiring Product Owner input; its recommended build sequence
(domain layer → top-level router → Authentication screens → Onboarding real
paths → the demo path last) is what was actually followed, verified below.

**Domain layer (`src/domain/types.ts`/`store.tsx`).** `User` (`id`, `phone`,
`phoneVerifiedAt: number | null`, `createdAt`) and `BusinessMembership`
(`id`, `userId`, `businessId`, `role: 'OWNER' | 'SELLER'`, `createdAt`) added
per RFC 0007/D44. `Business` gains `id` and `description` (previously
missing both). `AppState` gains `currentUser: User | null` and
`memberships: BusinessMembership[]`; `business` is now `Business | null`
(was a hardcoded-always-present singleton, "Luna Mercado" — that workaround,
named as a real gap in `BACKLOG.md`'s own "what's built"/priority-evaluation
entries, is now gone). `initialState()`/`resetPrototype()` return a genuine
pre-Authentication state — this is what makes a full, repeated
Authentication → Onboarding → Home walkthrough possible again, exactly what
`BACKLOG.md` named as blocking realistic re-testing.

New store actions: `verifyOtp(phone, code)` (authentication.md §3.7 —
creates/resolves the device's `User` row, sets `phoneVerifiedAt`),
`completeOnboarding(path)` (onboarding.md §3.5 — the atomic Owner-creation
write: `Business` + an `OWNER` `BusinessMembership` in one state update,
gated on `currentUser.phoneVerifiedAt != null`, per D44's structural
invariant), `setBusinessIdentity(fields)` (§3.10, additive `Business.name`/
`logo`/`description`), `createProducts(lines)` (§2.2a/§3.5d — bare `Product`
rows only, no Lot/InventoryEntry/InventoryUnit), and `acknowledgeOnboarding()`
(§3.6, "Entrar" tapped/auto-continued). `commitLot`'s new-Product-minting
logic was extracted into a shared `mintProduct` helper, reused by both
`commitLot` (Product atomic with a Lot) and `createProducts` (Product alone)
— per onboarding.md §2.2a's own explicit instruction not to build two
independent Product-creation mechanisms. `commitLot` itself is otherwise
unchanged and every existing caller (`RegisterMerchandise.tsx`) still works
exactly as before.

**Disclosed domain-modeling choices, named rather than silently made:**
- **Mock OTP verification — any 6-digit code is accepted**, per RFC 0007
  §5's own suggested simplification. `verifyOtp` never fails. This is also
  why authentication.md §3.7a (código incorrecto), §3.7b (expirado), and
  §3.7c (demasiados intentos) are unreachable through real interaction in
  this build — see "Screen-state coverage" below.
- **Single `currentUser`, no separate `users[]` array.** RFC 0007 models
  `User` as global, looked up by `phone` — real work only once a second
  device/session exists, which this single-localStorage-instance prototype
  structurally cannot represent (the same reasoning that already makes
  authentication.md §2.2 case 3 out of scope, confirmed in the spec itself).
  A first-ever verification mints a `User`; a returning verification for the
  same phone resolves the existing one and preserves its original
  `phoneVerifiedAt` — the one piece of the "global lookup" behavior that
  *is* meaningfully testable here (typing the same phone twice across a
  reset).
- **`Business.name` starts as `''`, not `undefined`.** The atomic
  Owner-creation write (§3.5) necessarily happens *before* identity is ever
  asked for (§3.9/§3.10, a separate, later write) — so for a brief window a
  real Business genuinely exists with no name yet. `''` is a safe,
  unambiguous "not yet captured" sentinel here (Nombre gates "Continuar,"
  §3.9, so a merchant can never actually submit an empty name) rather than
  widening the type to `string | undefined` everywhere `Business.name` is
  read. The router (`isOnboardingComplete`) and `OnboardingFlow`'s own
  step-resolution both key off exactly this fact.
- **No separate `path` field is persisted anywhere.** onboarding.md §2.2's
  capability table is injective — the three paths produce three distinct
  `(subscriptionTier, defaultSellingMode)` pairs — so
  `pathFromCapabilities()` (`src/domain/onboardingResolution.ts`) recovers
  which path a Business took from its stored capabilities alone. One fewer
  fact to keep in sync, the same "derive it, don't store it twice"
  discipline `sellingGridRows`'s own sold-count sort already uses.

**Top-level router (`src/AppRouter.tsx`, mounted above `App.tsx` in
`main.tsx`).** Implements authentication.md §2.1's device-session check
first (`currentUser?.phoneVerifiedAt != null`), then, once verified,
`onboarding.md`'s own §2.1 resolution (`isOnboardingComplete`, in
`src/domain/onboardingResolution.ts`) — falling through to the existing
tab-shell `<App/>` only once both resolve complete. Both checks are **pure
functions of persisted `AppState`**, re-evaluated on every render, the same
pattern `HomeScreen`'s own resolution logic already uses — this is what
makes every resume guarantee below come from `localStorage` persistence
alone, once a real write has actually happened, with no parallel
step-index/tracker to keep in sync.

**What genuinely cannot come from persisted state — because nothing has
been written yet — and is therefore a disclosed, narrower simplification:**
pre-write UI state within each flow (a phone number typed but not yet sent;
a code sent but not yet confirmed; an Onboarding path tapped but not yet
confirmed at §3.4/§3.4c) lives as local component state inside
`AuthenticationFlow`/`OnboardingFlow`. A reload or tab-switch-away *before*
the first real write (`verifyOtp` success, or §3.5's Business-creation
write) resets to that flow's fresh entry point rather than resuming the
exact mid-typing step — the same disclosed-simplification shape
`RegisterMerchandise.tsx`'s own in-progress draft already has (see "Scope
decisions" above), and low-cost for the identical reason onboarding.md
§2.1 case 5 itself gives: "there's no typed data to preserve there, just a
bare confirm tap not yet taken." Everything *after* the first real write —
which is the case that actually matters, since it's the only one a
merchant can lose meaningful typed effort from — resumes correctly, and is
the case verified below.

**Screen-state coverage (authentication.md's 16 enumerated states).**
Reachable through real interaction, verified via scripted walkthroughs: §3.3
(Número celular), §3.4 (formato inválido — genuinely reachable, pasting a
non-numeric value; the field is deliberately never auto-stripped), §3.5
(enviando, near-instant), §3.6/§3.6a (código entry, with a real 30-second
ticking resend cooldown — not a static mock), §3.6b (formato inválido, same
paste-based reachability as §3.4), §3.7 (verificando, near-instant). Built
as real, correctly-rendering branches but **never triggered** (mock
verification never fails, per the disclosed simplification above), the same
"reachable static state, not wired to a real failure-injection mechanism"
convention this codebase already established for its sync-failure states:
§3.5a (enviando — error), §3.7a (código incorrecto), §3.7b (código
expirado), §3.7c (demasiados intentos), §3.7d (error de plataforma). §3.8
(retomar interrumpida) holds within a single mount of the flow (tapping
back and forth via "← Cambiar número" loses nothing) but not across a
reload before verification succeeds — the disclosed pre-write-state
simplification above. §3.1/§3.2 (resolving, near-instant/slow) and §3.9
(falla defensiva) are **architecturally inapplicable in this build**, not
omitted — state loads synchronously from `localStorage` with no observable
async boundary to represent a "resolving" phase, the identical posture
already established (silently, by precedent) for every existing tab's own
§3.1/§3.2/defensive-fallback states — `HomeScreen`/`InventoryScreen` don't
build these either, for the same structural reason. The identical
"reachable-but-unwired vs. architecturally-inapplicable" split applies to
onboarding.md's own write-error states (§3.5a/§3.5e/§3.10a, plus this
build's own `'creating-error'` branch for §3.5's shared write) and its own
resolving/defensive-fallback states.

**NFC Readiness always evaluates Not Ready, disclosed and load-bearing.**
NFCTag assignment ("Asignar Tags," `inventory.md` §3.14) isn't modeled at
all in this codebase — no `InventoryUnit` can ever carry an assigned tag.
Since the demo Onboarding path ("Ver un ejemplo") is the only path that can
ever seed `defaultSellingMode = 'nfc'` (onboarding.md §2.2's table), this is
the first thing in the prototype to reach `home.md` §2/§3.6a's NFC-readiness
**Not Ready** branch — `startSession` now always resolves
`Session.operatingMode = 'buttons'` regardless of capabilities (the Ready/
Limited-Ready branches are structurally unreachable, not merely unbuilt,
since tagged inventory can never exist). `Idle.tsx` renders the real §3.6a
Not Ready one-time mention ("Todavía no tienes prendas con tag para hoy —
vas a vender con botones.") beneath the CTA whenever
`business.defaultSellingMode === 'nfc'`, with "Asignar tags" wired to an
honest `Placeholder` (title "Asignar Tags") — a visible but stubbed/no-op
link, the same "never hidden" treatment already given to
Eventos/Resultados/Configuración, not a new category of gap.

**"Ver un ejemplo" seed data (`src/domain/demoSeed.ts`), deliberately
thinner than onboarding.md §11's own full recommendation — per this pass's
own explicit scope decision, not an oversight.** Seeds a Business identity
("Ropa Aurora") and four plausible clothing-vendor Selling Groups with real
stock (Playeras/Blusas/Pantalones/Bolsas, via the existing `commitLot` write
path — real `Lot`/`InventoryEntry`/`InventoryUnit` rows, so Home's idle
state renders correctly populated). No Event, no Customer/Claim; the
NFC-readiness and Claim minimums §11 otherwise recommends are explicitly
skipped, consistent with — and the direct cause of — the Not Ready nudge
above always showing on this path.

**`ReceiptTicket` now renders `Business.logo`.** A small, in-scope-adjacent
fix: `home.md` §3.8f's own spec has always said the receipt shows the
merchant's captured logo if she set one, but no prior pass could ever
exercise this (identity was never actually captured before this one). Since
this pass is the first place a real logo ever exists, and the fix is small
or the spec's own named consumer would go unexercised, `ReceiptTicket`
gained a `businessLogo` prop (a 36px rounded thumbnail beside the business
name) — `HomeScreen` now threads `Receipt.businessLogo` (a field the
`Receipt` interface already carried, unused) through to it.

**Kept out of scope, disclosed rather than fixed:** `CloseSummary` keeps its
existing free-tier-only two-number treatment even for the demo path's
`paid`-tier Business — `home.md` §3.12's fuller Paid-tier variant, if one
exists, is not built here, the same boundary this slice's original "Scope
decisions" already drew around the Paid-tier Claim Token/QR bridge.
`Business.description` is written and stored but rendered nowhere — correct
per onboarding.md §2.2b itself ("stored only... not yet consumed by any
downstream resolution logic").

**Verification.** `tsc -b && vite build` clean, zero errors, both before and
after every change in this pass. Three scripted Puppeteer walkthroughs
against a live Chrome instance (not a mock), screenshots reviewed at each
step:
1. **Free path, straight through:** Phone → Enviar código → code entry
   (real 30s countdown visible) → Confirmar → Onboarding Welcome → "Empezar
   gratis" → Tu negocio (Nombre filled) → Continuar → Define lo que vendes
   (Producto/Precio filled) → Continuar → Todo listo Variant A → Entrar →
   Home cold start (correct — a real path never seeds stock) → Inventario
   shows the just-typed Product as "sin registrar," `$250` (correct —
   Product exists, no Lot yet).
2. **Paid path + every resume guarantee:** verify once, reload immediately
   (resumes at Onboarding Welcome, never re-shows Phone entry) → "Activar
   plan de pago" → confirm screen → Confirmar y activar → Tu negocio →
   Continuar → **reload mid-"Define lo que vendes," nothing committed yet**
   (resumes at that exact step, Business + identity already intact, never
   restarts) → commit a Selling Group → Continuar → Todo listo Variant B →
   **reload while Todo listo is on screen** (resumes Todo listo exactly,
   does not silently skip to Home) → Entrar → Home cold start → **reload
   after full completion** (goes straight to Home, Authentication/Onboarding
   never shown again).
3. **Demo path:** Welcome → "Ver un ejemplo" → confirm screen (permanence
   copy) → "Ver el ejemplo" → Todo listo Variant C directly (identity/
   Selling-Groups steps correctly skipped, already seeded) → Entrar → Home
   **idle** (not cold start — real seeded stock) showing the Not Ready
   nudge and "Asignar tags" → Inventario shows all four seeded Products with
   real `disponibles` counts → Iniciar Venta Rápida → Selling resolves
   silently to buttons mode → tap a tile → Finalizar Venta → receipt shows
   "Ropa Aurora" and the correct settled total (`$220`, verified against
   `localStorage`'s own `Sale.items[0].pricePaid` directly — an
   intermediate `$166` reading during manual inspection was the receipt's
   own documented count-up animation still in flight, not a bug, confirmed
   by waiting for it to settle).

**One Tooling Artifact, not a product defect, named per `company/CLAUDE.md`'s
own category (same class already documented in this README's v2 pass).** A
"Define lo que vendes" screenshot appeared to show "Continuar" rendered in a
muted, washed-out rose rather than the shipped Coral AA fill. Verified via
`getComputedStyle` in the same live session: the button's actual
`background-color` is `rgb(193, 63, 38)` — `#C13F26`, `--color-coral-aa`,
exactly correct. Not investigated further, consistent with the existing
precedent for this exact category of finding.

**No genuine blocker the Architecture Gap Analysis didn't anticipate.** The
one place this pass exercised real judgment beyond the Gap Analysis's literal
text was the NFC Readiness/demo-seed scope decision above (how to handle a
capability, `nfc`, whose supporting mechanism — Asignar Tags — isn't built
yet) — already flagged explicitly in the dispatching task itself as expected
and non-blocking, and resolved exactly as that task anticipated.

**Review pipeline fixes (`ux-critic` + `reviewer`), same pass.** Three items
fixed in one batch, `tsc -b && vite build` clean before and after:
1. **`completeOnboarding` idempotency guard (`reviewer` Important, RFC 0007
   §4/D44).** The write unconditionally minted a fresh `businessId` on every
   call, with no check for an already-existing `Business`+`OWNER`
   `BusinessMembership` for the current user — live, reachable through
   `OnboardingFlow.tsx`'s `'creating-error'` retry button even though mock
   writes never actually fail in this build. Now short-circuits and returns
   the existing `Business.id` if the current user already has an `OWNER`
   membership pointing at it, the same "never ask twice" guard `startSession`
   already applies. Companion fix: `WritingState.tsx`'s doc comment
   overclaimed that the error+retry branch was built (just unwired) for
   §3.5a/§3.10a/§3.5e collectively — narrowed to name only §3.5a as actually
   built; §3.10a (`BusinessIdentity.tsx`) and §3.5e (`SellingGroups.tsx`)
   don't pass `error`/`errorLabel`/`onRetry` to `WritingState` at all, so
   they have no error+retry UI whatsoever, a disclosed gap rather than an
   untriggered branch.
2. **`.moneyTag` Design System violation in `SellingGroups.tsx`** (`ux-critic`
   Minor #1). The committed Selling Group line rendered `{name} —
   {pesos(price)}` as plain merged text; `DESIGN-SYSTEM.md` §3's hard rule
   requires a discrete Product price inside the shared `.moneyTag` tag,
   never bare running text. Fixed to match `CatalogRow`'s own treatment: name
   and price are now separate elements, price wrapped in a `.priceTag
   .moneyTag` span (new `.priceTag` class in `SellingGroups.module.css`,
   same shape as `CatalogRow.module.css`'s `.price`).
3. **Dead disabled button on malformed phone/code input** (`ux-critic` Minor
   #2). `PhoneStep.tsx`'s format-error only fired for exactly-10-chars-with-
   a-non-digit, leaving "Enviar código" silently disabled with zero
   explanation for an 11-digit number (e.g. a merchant typing a leading
   044/045 prefix) or any other length mismatch; `CodeStep.tsx` had the
   identical gap. Both inputs gained `maxLength` (10/6), and both
   format-error conditions were widened to cover a non-digit at any length
   or a too-long value, not only the exactly-N case — the CTA is never
   silently dead with no explanation now.

**Logged, not fixed in this pass — pre-existing, systemic, already present
in `RegisterMerchandise.tsx` before this pass, not regressions this build
introduced.** Per this pass's own dispatching task, deliberately deferred to
a dedicated future accessibility pass across the whole prototype rather than
patched piecemeal here:
- `ux-critic` Minor #3 — form fields across the prototype use a plain
  `<span>` label sibling instead of a real `<label htmlFor>`/`id` pairing.
- `ux-critic` Minor #4 — link-style tap targets (`Cambiar`/`Quitar`/
  `Reenviar código`/remove-committed-line `✕`, etc.) sit around ~24-28px,
  under the common ~44px guidance.

**Fixed anyway, since it was trivial and needed no new state (`ux-critic`
Suggestion #5, optional).** The logo preview upload in `BusinessIdentity.tsx`
had no accessible success confirmation — the preview `<img>` carried
`alt=""` and nothing else signaled success to a screen reader. Fixed at
near-zero cost: `alt="Logo de tu negocio"` on the preview image, plus a
visually-hidden `role="status"` announcement ("Logo cargado") next to it —
both reuse `logo`, the state that already existed.

**Both fixes verified in a dedicated `reviewer`/`ux-critic` re-check pass**
before moving to `merchant-user-tester`: the idempotency guard traced
correctly against its only real retry path with no new bug introduced, the
stale `WritingState.tsx` comment confirmed accurate, the `.moneyTag` fix
confirmed a genuine match to `CatalogRow`'s pattern (not a same-named class
with different styling), and the phone/code `maxLength` fix confirmed to
fully close the dead-button case (native `maxLength` now prevents the
over-length input from ever reaching the app's own validation logic).

**`merchant-user-tester` (Ana) — full first-time walkthrough, free path,
localStorage cleared and reload-verified beforehand.** Completed the entire
journey (phone → code → "Empezar gratis" → Tu negocio → Define lo que vendes
→ Todo listo → Entrar → Home) with no confusion points and no data loss.
Confidence rose steadily throughout — explicitly called out the copy that
explains *why* each field is needed and that nothing is locked in as more
reassuring than a typical registration flow. The strongest trust signal in
the whole run: a full reload with cache cleared preserved login, business
name, and the just-added Product with zero re-entry required. One surfaced
tool-level event, investigated and resolved as a non-issue, not a product
defect: the automated click on the final "Entrar" button returned a
timeout error, immediately followed by a snapshot showing Home already
loaded. Root cause, confirmed by reading `TodoListo.tsx`/`.module.css`
directly: the screen has a documented, deliberate 2.6-second auto-continue
timer (`AUTO_CONTINUE_MS`), and no blocking CSS transition or
`pointer-events` rule exists on the button or screen. The tester's
character-by-character `press_key` input (no `fill` tool available that
run) plausibly consumed enough time that the auto-timer fired before the
deliberate click resolved, unmounting the target element mid-click. Both
paths call the identical `onEnter` handler, so there is no functional
difference and no risk to a real merchant tapping normally — named here for
the record, not actioned.

**Migration Workflow (D43) complete for this slice: Approved UX → Architecture
Gap Analysis → React Implementation → Review Pipeline (`ux-critic` +
`reviewer`, both clean after one fix round, independently re-verified) +
`merchant-user-tester` (clean) → Approved Slice.**

**Post-approval fix, found by the Product Owner directly (not any review
pass): `.app-shell` (`global.css` — the device-frame/desktop-preview
treatment every screen in this product gets: rounded corners, shadow,
centered against `#E2DED6` at widths >430px) was only applied inside
`App.tsx`.** `AuthenticationFlow`/`OnboardingFlow`, rendered directly by the
new top-level `AppRouter` before a user is authenticated/onboarded, never
got that wrapper — they rendered flat, edge-to-edge, with none of that
framing, a visible inconsistency against every other screen in the app.
Missed by every automated review pass this slice went through, since none
of them exercised a desktop-width viewport specifically. Fixed by moving
`.app-shell` up from `App.tsx` into `AppRouter.tsx`, wrapping all three of
its branches (`AuthenticationFlow` / `OnboardingFlow` / `App`) identically —
`App.tsx` itself now returns a bare fragment. Both `PhoneStep`/`Welcome`
(and every other new screen) already carried their own `flex: 1` on their
root wrapper, so no layout changes were needed beyond moving the wrapping
div itself. `tsc -b && vite build` clean after the change.

**Post-approval fix (2026-08-13), found by `merchant-user-tester` during a
walkthrough of the Resultados slice, root-caused via an Explore
investigation: a brand-new, never-before-verified phone number silently
logged into whichever pre-existing Business happened to be in
`localStorage`, instead of routing to fresh Onboarding for a new
User/Business — directly contradicting `authentication.md` §2.2 case 1 and
RFC 0007/D44's User/BusinessMembership model.** Root cause: `verifyOtp`
(`store.tsx`) correctly mints a distinct `User` row keyed by phone (new
phone → new `User.id`; existing verified phone → the same `User`), but
`isOnboardingComplete` (`onboardingResolution.ts`) only ever checked
whether `state.business` existed globally and had finished onboarding —
never whether `state.currentUser` actually held an OWNER
`BusinessMembership` on it. Any verified `User`, genuinely new or not, got
routed past Onboarding straight into whichever Business happened to already
be in `state.business`. `OnboardingFlow.tsx`'s own resume-step branch
(`if (state.business)`) carried the identical bug, one layer in: even on
the rare path where a fresh User *did* reach `OnboardingFlow`, it would
have resumed her into a stale, different-owner Business's mid-flow screen
(identity capture, Selling Groups, or even "Todo listo") rather than a
fresh Welcome.

Fixed by extracting the same membership-check logic `completeOnboarding`
(`store.tsx`) already used for its own idempotency guard into a new shared
`businessForCurrentUser(state)` helper (`onboardingResolution.ts`) —
returns `state.business` only if an OWNER `BusinessMembership` actually
joins it to `state.currentUser`, `null` otherwise. Both `isOnboardingComplete`
and `OnboardingFlow.tsx`'s resume branch now resolve against this helper
instead of `state.business` directly. The already-onboarded-returning-User
case (`authentication.md` §2.2 case 2) is unaffected: `verifyOtp` resolves
back to the *same* `User.id` for a re-verified phone, so that User's own
OWNER membership still matches and she still resolves straight through to
her own Business. `tsc -b && vite build` clean after the fix.

