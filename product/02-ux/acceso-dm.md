# Acceso DM — Entry Route for Concierge/DM-Qualified Merchants

**Status: Approved — Product Definition, UX Design, and full Review Pipeline complete (2026-09-03). `architect` confirmed the auth/D44 boundary and the Results-gap scoping clean, confirmed a real `commitLot` retry-safety gap (fixed, §2.1 step 5 / §8 item 2), and issued a direct placement ruling (`decision-log.md` D51, §0/§8 item 4). `ux-critic` found 2 Major + 1 Minor + 1 Suggestion — all fixed: a wrong selector name (`hasEverClosedSession` → `hasAnyClosedSession`, corrected throughout), an imprecise call-site citation for `verifyOtp` (corrected), a missing `home.md §3.12` reachability note (added), and one genuinely open gap left as such rather than silently resolved (§8 item 3 — this route has no confirmed way yet to actually reach a DM-qualified merchant, a pilot-mechanics tradeoff for the Product Owner). `brand-guardian` found 1 Major (§3.3's nudge copy used a forbidden imperative construction) — fixed, reworded fact-first. `reviewer` found 2 Important (the D48-analogy placement reasoning, resolved by `architect`'s direct ruling above; `OnboardingPath='demo'` now covering two distinct real-world journeys with no Foundation note — fixed, `onboarding.md`'s capability table) + 3 Suggestions — all fixed (§0 wording; the fixed bypass credential's production-shipping risk flagged for Backend Integration, §8 item 5; the decision-log entry below states its own non-RFC classification explicitly). Two items remain genuinely open, by design, not oversights: §8 item 3 (routing the pilot to this URL) and §8 item 5 (bypass-credential risk at Backend Integration) — both are Product Owner/future-phase calls, not blockers to Approval. Ready for `ui-designer` to build.**

**Placement note — ruled directly by `architect` on this document's own axis, 2026-09-03 (`decision-log.md` D51, not by analogy to D48).** `reviewer` correctly caught that an earlier draft of this note borrowed D48's conclusion via an analogy whose load-bearing premise ("no code path at all in a real, shipped build") this route actually fails — it does ship in the one real production build. `architect` re-ruled on the axis this route actually sits on, rather than inheriting D48's: D13/D45's "genuinely part of the app" test is compound, not single-clause — (a) genuine/permanent content, not campaign-scoped, **and** (b) reachable through every real merchant's ordinary journey, every time. `demo-mode.md` fails clause (a) (D48's own premise). This route passes (a) — it's real, permanent, production code — but fails clause (b) instead: per §2.1 check 1 below, absent the `?acceso=dm` marker this route does nothing at all, and the marker itself is reachable only via a Product-Owner-issued link to a curated, pre-qualified subset of merchants who already had a real DM conversation — never through any screen, navigation affordance, or device-state resolution an ordinary merchant's journey produces on its own. Failing D13/D45's test at the reachability clause is exactly as decisive as `demo-mode.md` failing it at the build-artifact clause — same composite test, different clause. D38's audience/deploy-target test (same codebase, same build artifact, same audience class) passes cleanly and independently, and only ever answered "can this be co-located in this folder" — not "does it belong in the six-experience roster," a distinct question `authentication.md`/D45 needed its own separate ruling for too, even after clearing D38. Two further reasons this isn't instead folded into `onboarding.md`/`authentication.md` as an extension: it *composes* both (calling `verifyOtp` and `completeOnboarding`/`setBusinessIdentity`/`commitLot` unmodified, one layer above where either normally runs, per §2.1 step 3) rather than adding a branch inside either's own resolution logic — its own Non-goals (§6) are explicit that it must never become a new `OnboardingPath` value or a change to either document; and folding a curated-audience, out-of-band-triggered route into a document whose entire authority rests on being audience-uniform would corrupt that guarantee for the one document that most depends on it. **Resolution: co-located in `product/02-ux/`, a third-category document like `demo-mode.md` — same conclusion as `demo-mode.md`, reached by the reachability clause of the same test rather than the build-artifact clause. Not RFC-worthy (same class as D12/D13/D24/D38/D41/D42/D45/D48 — a placement decision, no aggregate/bounded-context/ubiquitous-language term touched).** §8 item 4 closes as resolved.

**Naming — "Acceso DM," deliberately avoiding both reserved terms.** `demo-mode.md §0` reserves "demo"/"prototipo" for the build-level validation-campaign gate and reserves "ejemplo" for `onboarding.md`'s own "Ver un ejemplo" path — both already disclosed there as intentionally distinct concepts. This route needs its own third term for a different reason than either of those two: `architect` confirmed it creates a *real* programmatic coupling to `OnboardingPath`'s existing `'demo'` value (it calls `completeOnboarding('demo')` directly, reusing that path's exact capability/seed shape) — unlike `DemoModeGate.tsx`'s own documented "coincidental token, no shared code" disclaimer between the build gate and the onboarding path. Reusing "demo" or "ejemplo" as this route's own name would misleadingly imply it *is* one of those two already-named things, when it is a third, structurally different mechanism (runtime URL detection, not a build flag or a merchant's own onboarding choice). **Chosen name: "Acceso DM."** Considered and rejected: "Entrada directa" (too generic, doesn't anchor to its actual origin); "Acceso prioritario" (collides with the unrelated incentive language `company/merchant-validation-concierge-pilot.md §6.1`/§6.6 already uses for the DM pilot's "you're on the priority list" line — a real, distinct concept in the same conversation this route's link comes from, and reusing its name here would confuse the two).

---

## 1. Merchant goal

**Business objective:** let a merchant the Product Owner has already qualified and built trust with, one-on-one, through a real DM conversation (`company/merchant-validation-concierge-pilot.md`), reach a working, sellable, populated catalog with the least possible ceremony between "she taps a link the Product Owner sent her" and "she is registering a sale." No phone/OTP screen, no path-choice screen, no confirmation screen — every one of those is friction that has no job to do for a merchant whose trust-building already happened in the conversation itself, not in the product.

**What this route is not for:** it does not replace, redesign, or shorten any of that friction for a cold, self-serve visitor — `authentication.md`'s phone/OTP gate and `onboarding.md`'s three paths remain completely untouched, unmodified, and are what every other merchant still sees. This route exists for exactly one audience: someone the Product Owner has personally sent this specific link to, after a real conversation already happened.

**Acceptance criteria:**
- A merchant who opens the Acceso DM link, on a device with no existing session, never sees `authentication.md §3.3`'s phone-entry screen, its OTP screen, or `onboarding.md §3.3`'s path-choice screen — she lands on `onboarding.md §3.6` Variant C (the "Todo listo" milestone) with zero taps of her own, having already inherited a real (if seeded) catalog with actual stock.
- The four domain writes this route triggers (`verifyOtp`, `completeOnboarding('demo')`, `setBusinessIdentity`, `commitLot`) are the exact same, unchanged functions and the exact same `demoSeed.ts` constants `OnboardingFlow.tsx`'s own `path === 'demo'` branch already calls today, in the same order — no new write function, no new domain field.
- A merchant who opens the same link a second time (or refreshes), on a device that already has a Business, sees the auto-sequence skipped entirely — she resolves through `authentication.md`/`onboarding.md`'s completely normal, unmodified logic instead, landing wherever that logic already takes her.
- Once she's made at least one sale and hasn't yet closed her selling session, a passive, non-blocking nudge — visible only on this route, never for any other merchant — explains, in her own vocabulary, that her sale won't show up in Resultados until she closes her jornada. It stops appearing, permanently for that device, the moment she's ever closed one.
- No screen, error state, or piece of copy anywhere in this route ever uses the words "demo" or "ejemplo."

---

## 2. Resolution / decision logic

### 2.1 Whether the auto-sequence runs at all (checked once, on initial app mount)

This is the first runtime URL read anywhere in this codebase — a deliberately minimal, genuinely new mechanism, not a reuse of `DemoModeGate.tsx`'s build-time (`VITE_DEMO_MODE`) pattern. Detection: a URL query parameter, `?acceso=dm`, read exactly once when the app first mounts, before `authentication.md §2.1`'s own device-session check or `onboarding.md §2.1`'s own resolution logic run.

```
1. Does the current URL carry the Acceso DM marker (?acceso=dm)? [runtime
   check, evaluated once on initial app mount — the first place this
   codebase reads the URL at all]
     → NO: this route has nothing to do. authentication.md §2.1 /
       onboarding.md §2.1 resolve exactly as they already do today, for
       every merchant, with no change of any kind. This is the
       overwhelmingly common case, always.
     → YES: continue to check 2.

2. Does a Business already exist for the current device/session
   (businessForCurrentUser — the identical User→OWNER-Membership→Business
   join OnboardingFlow.tsx and completeOnboarding() already use)?
     → YES: the auto-sequence is skipped entirely. This is not her first
       time reaching this link on this device — she refreshed, returned to
       it a second time, or the device already carries a real, unrelated
       session. Control passes directly to authentication.md §2.1 /
       onboarding.md §2.1's own normal resolution, exactly as if the
       marker weren't present at all — including the case where what
       already exists is her own real Business from some other path
       entirely; the marker never overrides an existing session. This is
       not a new idempotency mechanism — it's completeOnboarding()'s own
       existing-Membership short-circuit, consulted one call earlier than
       it would otherwise run.
     → NO: continue to check 3.

3. Run, once, in this exact sequence — before anything
   authentication.md/onboarding.md would otherwise render:
     a. verifyOtp(ACCESO_DM_FIXED_PHONE, ACCESO_DM_FIXED_CODE)
     b. completeOnboarding('demo')
     c. setBusinessIdentity({ name: DEMO_BUSINESS_NAME,
        description: DEMO_BUSINESS_DESCRIPTION })
     d. commitLot(DEMO_SEED_LINES)
   Identical functions, identical constants, called in the same order —
   but not all four from the same existing call site (`ux-critic`
   correction, 2026-09-03): steps b-d are OnboardingFlow.tsx's own
   existing path === 'demo' branch, verbatim; step a (verifyOtp) is
   Authentication's own existing call (CodeStep.tsx), not part of that
   branch. This route composes all four together, one layer higher than
   either currently sits (before Authentication/Onboarding ever mount),
   without reimplementing or varying any of them. No screen renders
   between the four calls — see §3.1 for the one loading state shown
   while this runs.

4. All four calls complete?
     → Re-resolve. Because business.name is now non-empty and
       state.products is now non-empty, OnboardingFlow.tsx's own existing
       resolution (lines 79-109, unmodified) skips both BusinessIdentity
       and SellingGroups and renders directly at onboarding.md §3.6 Variant
       C (TodoListo, path='demo') — the identical destination "Ver un
       ejemplo" already reaches. See §2.2.

5. Any step throws (e.g. a localStorage write failing in a restrictive
   browsing context — the same narrow failure class demo-mode.md §2.1
   check 4 and authentication.md §3.9 already name for themselves)?
     → Defensive fallback (§3.2), Reintentar. Retrying re-runs the
       sequence from the top, but **steps c/d are gated, not
       unconditionally re-invoked** (`architect` confirmation, 2026-09-03
       — see §8 item 2, now resolved rather than open): `commitLot`
       carries no idempotency guard of its own — unlike `resolveVenue`'s
       dedupe-by-name check, `mintProduct` always mints a fresh Product id,
       so an unguarded second call to `commitLot(DEMO_SEED_LINES)` would
       double-seed the catalog (duplicate Products, doubled Lot/Entries/
       Units). `completeOnboarding` (step b) already guards itself via its
       own existing-Membership short-circuit (store.tsx lines 523-528),
       and `setBusinessIdentity` (step c) is harmless to re-run since it
       always writes the same fixed constants — only step d needs an
       explicit guard. **Before re-running steps c/d on any retry, check
       `state.products.length === 0`** — the identical test
       `OnboardingFlow.tsx`'s own resolution logic already uses (lines
       83/93) to decide whether `BusinessIdentity`/`SellingGroups` still
       need to render — and skip c/d entirely if it's already non-empty,
       since reaching a retry with products already seeded means step d
       already succeeded once before the throw. Step a (`verifyOtp`) and
       step b (`completeOnboarding`) are safe to unconditionally re-run
       regardless, per their own existing guards.
```

**Fixed credential — illustrative constants, format-valid under the current implementation, `ui-designer` to finalize the literal values:** `ACCESO_DM_FIXED_PHONE = '5500000001'` (10 digits, the same digit-count `authentication.md §3.3`'s own phone field already validates — no other format constraint exists at this fidelity), `ACCESO_DM_FIXED_CODE = '000000'` (any 6-digit value already works, per `verifyOtp`'s existing, unchanged mock-verification design — `_code` is intentionally unused).

### 2.2 Handoff — where this route's own responsibility ends

Identical to "Ver un ejemplo," by design, with zero divergence: the milestone screen she lands on is the literal `onboarding.md §3.6` Variant C (`TodoListo`, `COPY['demo']` — "Esto es un ejemplo de cómo se ve tu negocio en Nahui... Explora lo que quieras — no es información real."), cited verbatim, not redescribed. Tapping (or auto-continuing past) "Entrar" writes `onboardingAcknowledged = true` through the existing, unchanged `acknowledgeOnboarding()` call, and she lands on Home's own idle-with-stock state, exactly as "Ver un ejemplo" already does. This is expected, not a defect to fix — the milestone screen's own copy referencing "ejemplo" is `onboarding.md`'s content, not this route's, and is out of this document's scope to change (see Non-goals).

### 2.3 The results-guidance nudge — the actual new UX surface this document designs

**Why this is needed at all.** `reports.md §2` step 1's own gate is correct and unchanged: a Session must reach `status = closed` before anything in it shows in Resultados — Sale-finalization alone isn't enough (`selectors.ts`'s `hasAnyClosedSession`). For this route's whole point ("sample catalog → she sells → she sees it in Results") to actually land, she needs to take a second action — closing her jornada — that nothing in the flow so far has told her is required.

**Why this can't be gated on domain state alone.** Because this route deliberately reuses the exact same `OnboardingPath = 'demo'` value and the exact same seed constants "Ver un ejemplo" already uses, a Business created through Acceso DM is domain-indistinguishable from one created through "Ver un ejemplo" — same `path`, same `business.name`, same seeded Products. The nudge is explicitly DM-route-only (Product Owner's own scoping), so something outside the domain model has to know which route actually created this session. Resolution: one small, local, non-domain flag — `nahui-acceso-dm-active`, a boolean written to `localStorage` at the moment step 2.1.3 begins — the identical abstraction-level category `demoModeStorage.ts`'s own `nahui-demo-mode-acknowledged` already establishes (a device/session-level implementation detail, explicitly not a `Business`/`User`/`Session` field, read only by this nudge's own visibility check, never by anything else). This is not a second idempotency mechanism (§2.1 check 2 still owns that); it exists solely to answer "did *this* route create this session," a question the domain layer is intentionally unable to answer on its own.

```
1. Is nahui-acceso-dm-active set for this device?
     → NO: the nudge never renders, for any merchant, on any screen,
       ever — this includes every real merchant, every "Ver un ejemplo"
       visitor, and every self-serve Free/Paid merchant.
     → YES: continue to check 2.

2. Has any Sale reached status = 'finalized' yet (external observer of
   state.sales — a domain read, never a write, the identical
   "external observer via useStore()" shape demo_sale_completed already
   uses in demo-mode.md §2.5.3)?
     → NO: not shown yet — nothing to nudge her toward closing.
     → YES: continue to check 3.

3. hasAnyClosedSession(state)? [the existing selector, reused unchanged
   — no second signal invented]
     → YES: never shown again, permanently, for this device. The
       nahui-acceso-dm-active flag itself is not cleared — it's simply
       never consulted again in practice, since this check alone already
       and permanently closes the nudge.
     → NO: show the nudge (§3.3).

4. Which screens does it render on?
     → Every Home (`home.md`) screen state reached while a Session is
       active — both the ready/no-sale-open state (home.md §3.7) and every
       active mid-sale/selling substate — with exactly one named
       exception, inherited unchanged from demo-mode.md §2.3 check 2:
       never on home.md §3.8f (Finalizar Venta success, the full-viewport
       digital receipt). Same reasoning, not re-derived: that screen is
       independently defined, in home.md's own Approved spec, as
       deliberately header-less/full-viewport because the device is held
       toward the customer at that exact moment — a compositing overlay
       has no legitimate reason to appear there, for the identical reason
       demo-mode.md's own banner doesn't.
     → Deliberately narrower than demo-mode.md §2.3's own everywhere-
       except-one-screen scope: this nudge does NOT render on Inventario,
       Eventos, or Resultados, and it does NOT render before a Session is
       active (home.md §3.4/§3.6's pre-Session idle states are, in fact,
       structurally unreachable while this nudge's own condition holds —
       having ≥1 finalized Sale and !hasAnyClosedSession can only be true
       while inside an active, unclosed Session). Reasoned, not an
       oversight: the one action this nudge points toward ("Cerrar jornada
       de venta") is only ever reachable from Home's own header — showing
       an action-oriented nudge on a screen where that action isn't
       reachable would be worse, not better, than not showing it there.
       Same reasoning closes `home.md §3.12` (Close-summary) explicitly,
       not just by omission (`ux-critic` Suggestion, 2026-09-03): §3.12 is
       unreachable by construction here too, since closing the Session
       that produces it is exactly what flips `hasAnyClosedSession` to
       true — check 3 above already stops the nudge before she could ever
       reach it.

5. Is any part of it tappable?
     → No. Purely passive text, no interactive zone. Unlike
       demo-mode.md's ReminderBanner row 1 (which opens an external link
       in a new tab, touching nothing in-app), wiring this nudge to
       trigger home.md's own "Cerrar jornada de venta" confirmation would
       mean reaching into Home's own local component state — exactly the
       "never editing any Merchant Application screen's own content"
       boundary this compositing pattern exists to hold. She reaches the
       action through the button that's already there, on Home's own
       header — this nudge only explains why it matters.

6. Does tapping or ignoring it change whether it keeps showing?
     → No dismiss control exists, at all — same deliberate omission
       demo-mode.md §10 already reasons through for its own banner: there
       is no defined "she's seen this enough" moment to hook a dismissal
       to, and the nudge's own lifetime is already short and self-limiting
       (it can only ever show between her first sale and her first session
       close, on one route, for one merchant). Adding a dismiss mechanism
       to something this narrow would be complexity with no real problem
       to solve.
```

### 2.4 Analytics instrumentation (added 2026-09-04, `reviewer`-flagged documentation gap, same shape as `demo-mode.md §2.5`)

Not a screen-resolution branch like §2.1-§2.3 above — no new screen state. Four count-only events, added post-build at the Product Owner's explicit request (minimal funnel-progression signal only, no analytics-continuity constraint with the retired `demo-mode.md §2.5` suite — see `company/merchant-validation-concierge-pilot.md §0`'s own amendment for why). All four: `@vercel/analytics` `track()`, external observer of shared `AppState` via `useStore()`, bare event name, no payload, zero PII, zero session identifier — identical payload discipline to every `demo_*` event this replaces functionally.

**`acceso_dm_opened`**
- Fires once, in `AccesoDmGate.tsx`, the moment `?acceso=dm` is detected in the URL (`urlHasMarker`) — regardless of whether the auto-sequence (§2.1 step 3) actually runs or is skipped because a Business already exists (§2.1 check 2). A returning visit still counts as "opened."
- Gated on `urlHasMarker` directly, not `nahui-acceso-dm-active` — correct, since this event's whole job is marking that the marker was ever seen, before the flag that depends on the auto-sequence having run even exists.

**`acceso_dm_sale_completed`**
- Fires once per session, the first time a Sale transitions to `status: 'finalized'` while `nahui-acceso-dm-active` is set (`ResultsGuidanceNudge.tsx`, reusing that component's own existing `hasFinalizedSale` observation from §2.3 check 2 — not a second, independent observer).

**`acceso_dm_session_closed`**
- Fires once per session, the first time `hasAnyClosedSession(state)` flips to true while `nahui-acceso-dm-active` is set (`ResultsGuidanceNudge.tsx`, the identical transition that already hides the nudge per §2.3 check 3 — same computed value, not recomputed a second way).

**`acceso_dm_results_viewed`**
- Fires once per session, the first time the Resultados screen mounts while `nahui-acceso-dm-active` is set. Required one small new signal (`resultadosScreenMountedSignal.ts`), an exact mirror of the existing `homeScreenMountedSignal.ts`/`HomeScreen.tsx` pattern this document's own §2.3 already established for the nudge — applied to `ResultadosScreen.tsx` via the identical one-line mount/unmount effect shape. No `reports.md`-owned aggregation or content logic touched — a mount signal only.

**Why no `decision-log.md` amendment:** purely additive instrumentation — no new domain field, no aggregate or ubiquitous-language term touched, no change to `reports.md`/`selectors.ts`. D51 already covers this route's placement and mechanism; this subsection is the complete record for the instrumentation layer, same precedent `demo-mode.md`'s own analytics amendments already set for itself.

---

## 3. Low-fidelity wireframes

Conventions inherited from the rest of this family: `[ ]` = tappable, plain text = passive/informational.

### 3.1 Preparando tu catálogo — near-instant / slow

```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│                                │        │      Un momento…                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │                                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (&gt;~1.5s): one plain line
```
Identical near-instant/slow convention to every other tab's own §3.1/§3.2. Since all four writes are local, synchronous, and already proven (they're `OnboardingFlow.tsx`'s own existing demo-path writes, just called one layer earlier), this state is expected to resolve near-instantly in practice — the slow-path variant exists for completeness, the same way every other document in this family carries one regardless of how rarely it's actually seen.

### 3.2 Falla defensiva — no se pudo preparar el catálogo

```
┌───────────────────────────────┐
│  No pudimos preparar tu          │
│  catálogo. Intenta de nuevo.      │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Same class of failure, same "Reintentar," as every other storage-access-throwing fallback in this family (`demo-mode.md §3.5`, `authentication.md §3.9`) — no live-customer risk at this moment to justify anything heavier.

### 3.3 El aviso de cierre de jornada — composed onto `home.md §3.7` (active Session, ready, no Sale open)

```
┌───────────────────────────────┐
│  Esta venta se verá en Resultados │
│  cuando cierres tu jornada        │
│  de venta.                        │
├───────────────────────────────┤
│ Plaza Norte · Día 1         ⚙  │
│ Hoy: $220 · 1 venta  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│   [   zona de registro,          │
│       según Session.operatingMode ]│
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Passive, single slim strip above Home's own header — deliberately lighter-weight than `demo-mode.md`'s two-row `ReminderBanner`, since this nudge carries no secondary controls (no restart, no time estimate, no state label) — one sentence, no interactive zone, per §2.3 check 5.
- Copy states the fact plainly, fact-first rather than as a command, in her own vocabulary — reuses "jornada de venta"/"Cerrar jornada de venta" verbatim from `home.md`'s own already-Approved button label, and "Resultados" as the nav tab's own real name — never a technical term ("Session," "cierre de estado") anywhere in the copy. **Fixed (`brand-guardian`, Major, 2026-09-03):** the original draft opened with a bare imperative ("Cierra tu jornada de venta cuando termines...") — a command construction `tone-of-voice.md`'s Concrete Rules explicitly forbid ("suggestions read as offers, not instructions... never an imperative implying she's missed a step"), exactly the scenario this nudge exists for. Reworded fact-first ("Esta venta se verá en Resultados cuando cierres tu jornada de venta.") — states the mechanic as a fact rather than issuing a command, and leaves the one imperative-shaped element on screen as the actual `[ Cerrar jornada de venta ]` button itself, not a duplicate in prose.
- Points her toward the action without duplicating it: the actual `[ Cerrar jornada de venta ]` button is already visible on the same screen, one band below — the nudge explains *why* it matters, the button itself is untouched, unmoved, and un-re-labeled.

### 3.4 El aviso — never composed onto `home.md §3.8f`

No new wireframe — the digital receipt renders exactly as `home.md §3.8f` already specifies, full-viewport, header-less, nothing composited above it, for the identical reason `demo-mode.md §2.3` check 2 already gives.

---

## 4. Interaction flow (summary)

```
Open app with ?acceso=dm in the URL
  → Business already exists for this device? ────────────────────────→
    marker ignored entirely; authentication.md §2.1 / onboarding.md §2.1
    resolve completely normally, as if the marker weren't present
  → No Business yet:
    → run auto-sequence (§2.1.3) → Preparando (§3.1)
        → fails outright → Falla defensiva (§3.2) → Reintentar → retries
          the whole sequence from the top
        → succeeds → re-resolve → OnboardingFlow.tsx's own existing
          resolution (business.name set, products.length &gt; 0) → lands
          directly on onboarding.md §3.6 Variant C (TodoListo, path=
          'demo'), cited verbatim — zero intermediate Authentication or
          Onboarding screens ever rendered
            → Entrar (tap or auto-continue) → Home, idle-with-stock,
              identical to what "Ver un ejemplo" already reaches

From Home, once ≥1 Sale is finalized and hasAnyClosedSession is false,
on a device where nahui-acceso-dm-active is set:
  → el aviso de cierre (§3.3) renders on every Home screen reached while
    the Session stays active, except home.md §3.8f (§3.4) — no tap
    target of its own, points at the already-existing "Cerrar jornada de
    venta" button
  → she taps that existing button → home.md's own, completely unmodified
    close-session flow → once the Session reaches status = closed,
    hasAnyClosedSession flips true → el aviso never renders again on
    this device
```

---

## 5. Acceptance criteria

- The `?acceso=dm` URL marker is the only new runtime-URL-reading code anywhere in this codebase — checked exactly once, on initial app mount, nowhere else.
- No phone/OTP screen, no `onboarding.md §3.3` path-choice screen, and no `onboarding.md §3.4c` demo-confirmation screen ever render for a merchant who reaches this route with no existing Business on her device.
- The four domain writes triggered are `verifyOtp`, `completeOnboarding('demo')`, `setBusinessIdentity`, `commitLot` — unchanged, in that order, with no new write function and no new domain field anywhere.
- A device that already has a Business (any Business, from any path) never has its session touched or overridden by the marker — the marker is simply inert in that case.
- The results-guidance nudge (§2.3/§3.3) shows only when all three of its own conditions hold (`nahui-acceso-dm-active` set, ≥1 finalized Sale, `!hasAnyClosedSession`), never for any other merchant, on any other route, ever.
- The nudge never renders on `home.md §3.8f`, has no tap target, and cannot be dismissed independently of `hasAnyClosedSession` becoming true.
- No screen, error state, or piece of copy anywhere in this document uses the words "demo" or "ejemplo."

---

## 6. Explicit non-goals

- **No change to `authentication.md`, to any of `onboarding.md`'s three existing paths, to `reports.md`, or to any Merchant Application screen's own content.** Every screen this route ends up rendering (the `TodoListo` milestone, Home, the `Cerrar jornada de venta` button) is cited verbatim from its own already-Approved spec, never redescribed or edited here.
- **No new domain field, no schema change, no new write function.** Every domain write this route triggers — `verifyOtp`, `completeOnboarding`, `setBusinessIdentity`, `commitLot` — already exists and is reused entirely unchanged. The one new piece of state this route introduces (`nahui-acceso-dm-active`) is explicitly not a domain write — the same non-domain, device-level-flag category `demoModeStorage.ts`'s own `nahui-demo-mode-acknowledged` already establishes.
- **No new `OnboardingPath` value.** This route reuses the existing `'demo'` value unchanged — it is not, and must not become, a genuinely new fourth onboarding path with its own capability/seed shape.
- **The fixed credential is a demo/test fixture only, never a new authentication or identity pattern.** Product Owner's own words: *"That should be treated purely as demo/test fixture behavior, not as a new authentication or identity pattern for the real product."* It does not change, weaken, or set precedent for `authentication.md`'s real verification architecture in any way.
- **Not a conversion mechanism.** The Business this route creates is exactly as disposable as any "Ver un ejemplo" Business (`decision-log.md` D19) — it is not meant to become her real account later. No `Sale.origin`, no replay-at-conversion, no synthetic Session, and no "make it yours" transition of any kind are part of this design — that entire direction was explicitly ruled out by the Product Owner and does not reappear here.
- **No change to `reports.md`, `selectors.ts`, or Session's close-gating logic anywhere.** The results-guidance nudge is copy/flow only, composited above Home, never touching the actual close-gating rule it explains.
- **No in-app "Acceso DM" indicator anywhere in the real Merchant Application's own content** — the closing nudge is the one composited, validation-campaign-only surface that discloses anything at all, and only in its own copy, on Home, never on any Merchant Application screen's own header, content, or navigation.

---

## 7. Decisions made

- Runtime URL-parameter detection (`?acceso=dm`), checked once on mount — the smallest possible new mechanism, explicitly not a reuse of `DemoModeGate.tsx`'s build-time pattern, since this route must exist in the one real production build.
- Named "Acceso DM," avoiding both "demo" and "ejemplo," reasoned in full above.
- The results-guidance nudge is passive, non-tappable, Home-only, and inherits `demo-mode.md §2.3` check 2's `home.md §3.8f` exception unchanged rather than re-justifying a new one.
- A new, small, explicitly non-domain local flag (`nahui-acceso-dm-active`) is the only new persisted state this document introduces, needed solely because this route intentionally produces domain-identical state to "Ver un ejemplo" and the domain layer therefore cannot answer "which route created this session" on its own.

---

## 8. Flags for Product Owner / Architect — not decided here

1. **`product/02-ux/product-decisions.md` Q19–Q22 describe a different, more elaborate direction for essentially the same underlying goal** (a fourth, convertible Onboarding path with a pre-loaded sample catalog, a "Haz que sea tuyo" conversion moment, `Sale.origin`, replay-at-conversion, and an active/inactive Product field) — logged as "Resolved... build now" as of 2026-09-03. This document's brief states plainly that "that entire prior direction was explicitly ruled out by the Product Owner and must not reappear here," which this document has followed. But `product-decisions.md` itself still reads as if Q19–Q22 are the live, approved plan. Someone with authority over that log should reconcile the two — mark Q19–Q22 superseded by this route, or clarify that both are meant to coexist for different purposes — since this document has no authority to edit that log itself.
2. **Retry-safety of `commitLot` — resolved, 2026-09-03 (`architect` confirmation).** Not safe as originally drafted: `commitLot` has no idempotency guard (unlike `completeOnboarding`'s existing-Membership short-circuit), so an unconditional retry would double-seed the catalog — a property of `commitLot`/`mintProduct` themselves, not of which call site invokes them; `OnboardingFlow.tsx`'s own `'creating-error'` retry path carries the identical, previously-untested exposure (that branch is dead code today per its own code comment — never yet actually exercised). Fixed directly in §2.1 step 5 above: steps c/d are now explicitly gated on `state.products.length === 0` before re-running on retry, reusing the exact test `OnboardingFlow.tsx`'s own resolution logic already applies elsewhere. No longer open.
3. **Genuinely undecided — this route currently has no confirmed way to actually reach a real DM-qualified merchant (`ux-critic` finding, 2026-09-03).** `company/merchant-validation-concierge-pilot.md`'s own Loop-2 DM handoff script (its line 242 as of this writing) still sends `demo.nahui.app` — the separate, build-gated `demo-mode.md` experience — not this route's `?acceso=dm` production URL. Two real options, not decided here: (a) update the pilot's handoff script to send the `?acceso=dm` link instead, or (b) keep the pilot on `demo.nahui.app` for now and treat this route as a capability not yet wired into the live pilot. **Option (a) has a real cost worth naming, not just a copy change:** `demo-mode.md §2.5`'s entire `demo_*` analytics-event suite (`demo_pass_through_reached`, `demo_otp_completed`, `demo_onboarding_completed`, `demo_sale_completed`, `demo_paid_plan_activated_midsession`) is mounted only inside `DemoModeGate`'s own `pass-through` branch — this route, running in the real production build, has no instrumentation of any kind as designed. Switching the pilot's own DM handoff to this route without also deciding whether/how to instrument it would mean losing Loop 2's entire measurement mechanism, not just changing which link she receives. Left open deliberately — this is a pilot-mechanics tradeoff, not a UX or architecture question this document can settle.
4. **Placement ruling — resolved, 2026-09-03 (`architect`, `decision-log.md` D51).** See §0's own updated placement note for the full ruling. No longer open.
5. **The fixed bypass credential ships permanently in the real production JS bundle (`reviewer` Suggestion, 2026-09-03) — low-risk today, worth re-examining at Backend Integration.** Unlike everything in `demo-mode.md`'s family (which Architecture Review required to be structurally absent from production, `demo-mode.md §8` item 1), `ACCESO_DM_FIXED_PHONE`/`ACCESO_DM_FIXED_CODE` are real constants in the one production bundle every merchant loads. Low-risk today only because `verifyOtp` already accepts any 6-digit code for every merchant in this mock-backend prototype — this route adds no new exposure class, just a URL-triggerable shortcut into an already-open door. That stops being true once Stage 7 backend integration (`product/02c-high-fidelity-prototype/CLAUDE.md`) replaces the mock with real verification — a hardcoded bypass credential shipped to every browser becomes a materially different risk once real auth exists behind it. Not a blocker now; should be revisited explicitly when Backend Integration is scoped, not carried forward silently.
