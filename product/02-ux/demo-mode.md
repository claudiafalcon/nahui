# Demo Mode — Welcome Screen

**Status: Product Definition → UX Design → placement ruling → `brand-guardian` review → Architecture Review all complete (2026-08-14/15) — ready for `ui-designer` to build.** Drafted by `ux-designer` at explicit Product Owner request, Product Owner-approved in concept and wireframe. This document's §1 also serves as this feature's Product Definition, per this folder's own front-matter rule (no separate pre-UX artifact exists). `brand-guardian` reviewed §3.3's copy — one Major finding (the opening greeting read as generic, translated-from-English template copy rather than Nahui's established voice; `onboarding.md` §3.3 cited as the correct in-family precedent) — fixed, replacement text applied. `architect` ruled on placement (`decision-log.md` D48 — a third category, neither D13/D45's class nor D38's) and completed Architecture Review (§8 items 1-2, resolved with concrete build-mode/storage/mounting-shape guidance — see below). Not yet passed through `ux-critic`/`reviewer` (New-Feature Workflow's Review Pipeline stage, after the React build).

**Amended 2026-08-16 (Product Owner-relayed, empirically confirmed defect — live campaign).** Real validation-campaign participants (Facebook Groups recruitment post, live at demo.nahui.app) got stuck at `authentication.md`'s OTP entry screen. §3.3's welcome copy correctly warned that no real SMS would arrive, but never stated what to type instead — and `authentication.md`'s own OTP screen is intentionally mock-delivery-agnostic (per that document's own §0 abstraction-level choice, it's the identical screen every real merchant sees, and never reveals that verification is mocked). Confirmed in code: `verifyOtp(phone, _code)` in `src/domain/store.tsx` accepts any 6-digit input, the `_code` parameter is intentionally unused. A participant told "no real code is coming" had nothing to reference and no way to know any 6 digits would work. **Fix, scoped entirely to this document's own §3.3:** a new third operational fact — any 6-digit code (e.g. `123456`) works — added to the welcome screen. `authentication.md` is not touched, per this document's own placement reasoning (`decision-log.md` D48) — that screen must stay general-purpose/mock-delivery-agnostic for every future real merchant, not leak Demo Mode's own concerns into it. Copy/clarity fix only — no flow, decision-logic, or architecture change; §2, §4-§8 below are unaffected. **Review pipeline complete, same day.** `ux-critic`: clean, no Blockers/Majors (one non-blocking Minor on overall screen density approaching the 15-second scan bar, one non-blocking Suggestion on bullet-list grammatical parallelism — both flagged for a later polish pass, not this fix). `reviewer`: clean, no Blockers/Important findings — independently confirmed `authentication.md` untouched, the D48 citation accurate, and the "any 6-digit code" claim correct against `verifyOtp` in `src/domain/store.tsx`. `brand-guardian`: pass, no changes — the concrete example ("123456") reads as the honest, companion-like choice, not a tonal drift. Folded back into Approved. Ready for `ui-designer` to build immediately, given the live-campaign urgency.

**Amended 2026-08-18 (Product Owner-relayed, confirmed by real Meta Ads campaign data — live campaign).** The live paid campaign is driving real clicks to `demo.nahui.app`, but the Google Form — the campaign's actual success metric (`company/merchant-validation-campaign-meta-ads.md` §7) — is getting almost no new responses. Root cause, confirmed against that document's own §5b: the Form link exists in exactly one place, as plain text inside the ad's Primary Text (not the ad's clickable button, which points to `demo.nahui.app`) — a named, accepted risk at the time ("a plain-text URL inside an ad's Primary Text is not guaranteed to render as tappable on every placement… Instagram Stories/Reels frequently do not"), now shown by real campaign data to be actually costing conversions. Compounding it: once a participant taps through into the demo, **nothing inside the product itself ever points her back toward the questionnaire** — `demo-mode.md §2.2`'s own hand-off ends the moment `authentication.md`'s flow begins; §5b of the Meta Ads plan named this exact gap explicitly as "a real, honest gap… not something to quietly work around" from Marketing's side, since a product change is out of Marketing's remit. **Fix, two reinforcing touchpoints, deliberately no third:** (1) a brief expectation-setting sentence added to the welcome screen itself (§3.3), before she starts exploring, so what follows doesn't feel like a surprise; (2) a persistent, session-wide reminder banner (new §2.3, §3.6), present on every screen from the moment `pass-through` begins until the app closes, giving her a one-tap path to the questionnaire from wherever she is, at any point, deliberately not tied to any "finish" moment this prototype has no defined trigger for. Product Owner's own reasoning for two touchpoints, not one: if a participant never reaches the questionnaire, that should be her own choice, never a consequence of our side giving her only one chance to notice it — and no third, milestone-triggered mechanism was added on top, since real-time exit/tab-close detection is both technically unreliable (browsers block redirect-on-unload) and would read as a dark pattern out of step with Nahui's honest voice; an explicit, always-available, user-initiated action was judged the better fit. `authentication.md`/`onboarding.md`/`home.md`/every other Merchant Application screen remains untouched, per this document's own D48 placement discipline — the banner mounts as a sibling to `<AppRouter />` inside the existing `pass-through` branch (`DemoModeGateActive.tsx`), never inside any individual screen. **Review pipeline: `brand-guardian` found one Major, fixed same day; `ux-critic`/`reviewer` still in progress.** `brand-guardian` flagged the banner's first draft — a first-person-declarative label ("Ya terminé — ir al cuestionario," letting her tap-to-declare herself done) — as making a claim that's often untrue at the moment of tapping: §2.3/§1 both specify the banner is designed for any-point, repeat access with no dismiss-forever mechanic, so a participant who just wants to check the questionnaire mid-session (not actually "done") would be tapping something that misdescribes her own intent — a real, if narrow, honesty tension per `character-bible.md`'s "tells the truth about what it does and doesn't know yet." Also found the "offers, not instructions" citation didn't actually support the construction — that rule targets narrative-suggestion copy, not standard button-label imperatives, so there was no real tension with existing in-family CTAs (`Empezar demo`, `Reintentar`) to begin with. Fixed by reverting to this document's own already-approved "Cuéntanos" offer register (§3.3) instead — **"Cuéntanos tu opinión — cuestionario"** — true regardless of when she taps it, and continuous with §3.3's own new closing sentence that promises this exact banner is coming. `brand-guardian` judged this a Major, not Blocker, and confirmed the fix needs no further review round given it's a minimal-diff swap back into a voice register already cleared on 2026-08-15/16. A lightweight Architecture Review confirmation (§8 item 6, non-blocking) was folded into `reviewer`'s own pass rather than a separate dispatch, given the addition is stateless and low-risk. `reviewer`: clean — confirmed no Merchant Application screen or its code was actually touched (verified directly: `DemoModeGateActive.tsx`'s `pass-through` branch is still bare `<AppRouter />`, nothing built yet), and independently judged the §8 item 6 Architecture Review flag low-risk enough to fold into its own pass rather than needing a separate `architect` dispatch (no new domain write, no new persistence key, the same outer-wrapper composition technique already established). Found 2 Important documentation-drift findings, both fixed same day: §1's Scope boundary paragraph was stale (still described only the original single screen); §9's #7 citation was stale (still said "no real write here," contradicting §8 item 2's own already-present precision correction that the CTA tap does write an idempotent boolean flag). One Suggestion applied (§2.3's illustrative screen list was incomplete). One Suggestion logged, no action needed (D48's placement test is unaffected by UI footprint, but the banner now visually composites onto every Merchant Application screen for the session, worth future readers of D48 knowing). `ux-critic`: found 3 Major, 2 Minor, 1 Suggestion, all closed same day. DEMO-M1 ("Ya terminé" being contextually false/too narrow) resolved as a side effect of the copy fix above. DEMO-M2 (§3.3's density measurably exceeded the "well under 15 seconds" bar) fixed by merging the two adjacent feedback-ask sentences into one — 91 words down to 75, the fact-bearing bullets left untouched since they're the retention-critical content a compression already proved risky once (2026-08-16). DEMO-M3 (the banner's screen-agnostic design would have rendered across `home.md §3.8f`, the digital-receipt screen deliberately built header-less for customer-facing privacy reasons, HOME-B3) fixed with one named, reasoned exception in §2.3 check 2 — every other screen, including `home.md §3.12`'s own unrelated header-less state, checked and confirmed not to share that rationale. DEMO-MIN1 addressed with a third composed illustration (§3.6, onto `home.md §3.7`, the busiest active-Session header state). DEMO-MIN2 was already fixed during `reviewer`'s own pass. **Given the Product Owner's explicit authorization to move on Main's own scope judgment (active ad spend, ongoing loss of campaign data/participant experience), the resulting new architecture item (§8 item 7 — the `§3.8f` exception needs a route-level screen-identity check) was confirmed directly by Main rather than a further dispatch, following the same low-risk reasoning `reviewer` already applied to item 6. Folded back into Approved. Ready for `ui-designer` to build immediately.**

**Scope:** two elements, both present **only** in validation-campaign builds where a real bazaar-vendor participant tests the live prototype: (1) one expectation-setting screen shown before `authentication.md`'s flow begins (§3.3), and (2) a persistent, session-wide reminder banner shown on every screen from that point until the app closes (added 2026-08-18, §2.3/§3.6). Not a production feature — neither has any code path at all in a real, shipped build. Implementation-independent, low-fidelity only.

**Deliberately not conflated with `onboarding.md`'s "Ver un ejemplo."** That is an in-app guided example business a merchant explores from *inside* the real product, reachable via a path choice on `onboarding.md §3.3`. This is a build-level gate shown *before* `authentication.md` even starts, regardless of which of `onboarding.md`'s three paths she later picks — including "Ver un ejemplo" itself. The two compose freely and never overlap. To keep them visibly distinct even in copy, this document uses "demo"/"prototipo," never "ejemplo" — that word stays reserved for `onboarding.md`'s own concept.

**Placement note, ruled by `architect` (`decision-log.md` D48):** this document fits neither D13/D45's class nor D38's — a third, narrower category. It fails D13/D45's test at the premise, not just the specifics: this screen "has no code path at all in a real, shipped build," and its own §1 Scope explicitly disclaims "not a merchant-application capability" — the identical self-exclusion shape D38 relied on for Loyalty-claim, so it can't credibly claim D13/D45-class membership ("genuinely part of the app") while its own body says otherwise. It isn't D38's class either — same codebase, same build artifact (`product/02c-high-fidelity-prototype/`), same audience class (a real bazaar vendor, not a structurally distinct domain role like Customer), no new bounded context. **Resolution: stays in `product/02-ux/`, no new folder — but is explicitly validation-campaign infrastructure, co-located here for pipeline/deploy convenience, not a Merchant Application experience document.** See D48 for the full reasoning.

---

## Answers to the three design questions the Product Owner's brief raised

**1. Placement — a standalone document (`demo-mode.md`), not a section amended into `authentication.md`.** `authentication.md`'s own scope statement is written entirely in production terms — acceptance criteria phrased as permanent guarantees. This new screen has a fundamentally different lifecycle: disposable, campaign-scoped, no code path in production at all. Folding it into `authentication.md` would force every future reader to mentally filter "is this bullet real or demo-build-only" through an otherwise clean, already-Approved spec. A standalone file keeps the temporary nature legible at the folder level without polluting `authentication.md`'s dense Approved history.

**2. What happens after "Empezar demo" — clean, simple hand-off, no domain write.** Tapping the CTA hands off directly into `authentication.md §2.1`'s existing resolution logic, cited verbatim — the identical entry point a production build's app-open reaches at this exact moment. This screen writes nothing to the domain model. The one thing it needs to remember — "has this device already seen this" — is a device/build-level implementation detail, the same abstraction-level treatment `authentication.md §0/§10` already gives its own device-session persistence mechanism. Not a domain fact, nothing for `architect` to model. Back-navigation: `authentication.md §3.3` already claims "no back arrow, nowhere to return to" for itself — that claim needs no amendment, since this screen sits chronologically before it and defines no back-affordance pointing here.

**3. Whether this needs a "how is Demo Mode toggled" indication — no, purely from a UX standpoint.** This screen's own content/behavior depends only on: is this a validation-campaign build → show once, first, before `authentication.md`, on this device. The technical mechanism that determines "is this build a Demo Mode build" is below this document's abstraction level (Architecture Review's job, next stage). No in-app "you're in Demo Mode" indicator is designed anywhere else in the product — flagged as a possible future cross-document question (§11), not designed here.

---

## 1. Participant goal

*(This document's audience is a validation-campaign participant, not Ana-as-ongoing-merchant — noted explicitly since it changes the addressee, not the product's values.)*

**Business objective:** make sure a real bazaar-vendor validation participant understands, before typing anything, that (a) this is an interactive prototype, not the finished product; (b) everything she enters — phone number, business name, products, customer info — should be fictitious; (c) no real SMS is sent; (d) what to type instead when the app's code screen appears — any 6-digit sequence, e.g. `123456` — since no real code is coming; (e) the goal is evaluating the experience, not creating a real account; (f) honest feedback, including critical/confused reactions, is explicitly wanted. Directly supports the upcoming real-merchant validation campaign (`company/CLAUDE.md`'s Experience Validation section).

**Business objective — persistent session reminder (added 2026-08-18, see status header).** Independent of what the welcome screen alone conveys before she starts, ensure that at *any* point during the rest of the session — not just the moment right after "Empezar demo" — a participant has an easy, unmissable way to find the questionnaire, without having to recall a link she may never have seen render tappable inside the ad's own text. This is deliberately session-wide, not a one-time prompt: the prototype has no defined "finish" moment to hook a single reminder to, and a participant might decide she's "done exploring" from literally any screen.

**Acceptance criteria:**
- Every fact above is conveyed in natural Spanish, scannable in well under 15 seconds.
- This screen has no code path in a real production build — not merely hidden, structurally absent (Architecture Review's concern, §8).
- Tapping the primary CTA hands off cleanly into `authentication.md §2.1`'s existing resolution logic, with zero new domain writes.
- The screen never reappears on the same device once acknowledged, for the rest of that install.
- No screen anywhere else in the product shows a "you're in Demo Mode" indicator (explicit non-goal, §11).
- A persistent, non-blocking reminder pointing to the Google Form questionnaire (`https://forms.gle/ZZhtJEfee3viWY1h8`) is visible on every screen for the entire session, from the moment `pass-through` begins (§2.3) until the app is closed — never on this document's own welcome/resolving/fallback screens (§3.1-§3.5), which already end with their own single, uncompeted CTA.
- The reminder never blocks, delays, or requires dismissal to keep using the demo. Tapping it opens the questionnaire in a new browser tab; her current demo screen stays exactly as she left it.
- No dismiss-forever control exists — see §10 for why that's a deliberate omission, not an oversight.
- Identical copy and behavior on every screen it renders on — with exactly one named, reasoned exception (`home.md §3.8f`, see §2.3 check 2 and §10); no other per-screen or per-journey exception exists.
- **One further, narrower exception within `pass-through` itself (added 2026-08-18): never on `home.md §3.8f`** (Finalizar Venta success — the full-viewport digital receipt), since that screen is independently defined, in `home.md`'s own already-Approved spec, as deliberately header-less/full-viewport for a privacy reason unrelated to this document (the device is held toward the customer at that exact moment) — see §2.3 check 2 for the full reasoning.
- The reminder cannot detect whether she's already submitted the Form (same accepted limitation as `demo.nahui.app` having no analytics/pixel installed, `company/merchant-validation-campaign-meta-ads.md` §7) — it keeps showing regardless. Re-opening an already-completed public Form is harmless, not a defect.
- Two reinforcing, honest touchpoints exist — §3.3's expectation-setting sentence (seen once, before she starts) and §3.6's persistent banner (seen throughout) — deliberately no third, milestone-triggered mechanism. Whether she ever reaches the questionnaire is her own choice, never a consequence of our side giving her only one chance to notice it.

**Scope boundary:** validation/testing infrastructure, not a merchant-application capability. Doesn't decide *how* Demo Mode is technically detected (Architecture Review's job) and doesn't touch `authentication.md`'s, `onboarding.md`'s, or any other Merchant Application document's own flow logic — it only prepends one screen ahead of `authentication.md`'s existing entry point (§3.3), and composites a persistent reminder banner (§3.6, added 2026-08-18) above whatever screen is otherwise showing for the rest of the session, in specific builds.

**Explicit non-goals:**
- Not shown in a real production build, ever.
- Writes nothing to the domain model — no `Business`, `User`, or `Session` field is touched.
- Not the same concept as `onboarding.md`'s "Ver un ejemplo."
- No in-app "Demo Mode" indicator anywhere else in the product *(the reminder banner added 2026-08-18, §3.6, is a distinct thing — a campaign-recruitment nudge pointing to the questionnaire, never disclosing build/test state in its own copy; it doesn't announce "you're in Demo Mode," so this non-goal is unaffected)*.
- No role/account management, no payments/checkout — inherited non-goals.
- No design of the technical build-detection mechanism itself.

---

## 2. Resolution / decision logic

### 2.1 Whether this screen shows at all (device-level check)

```
1. Is this a Demo Mode (validation-campaign) build? [build-level fact,
   below this document's abstraction level — Architecture Review's job]
     → NO (real production build): this screen has no code path — app
       open resolves directly into authentication.md §2.1, unchanged.
     → YES: continue to check 2.

2. Has this device already shown and acknowledged this screen, this
   install? [device-level fact, same abstraction-level treatment
   authentication.md §2.1 already gives its own verified-session check]
     → YES: skip straight to authentication.md's own §2.1 resolution,
       unchanged — identical silent pass-through authentication.md
       already gives a device holding a valid session.
     → NO: continue to check 3.

3. Was this screen shown but not yet acknowledged (app closed/
   backgrounded before the tap)?
     → Resume the identical screen (§3.3) — read-only, nothing to
       preserve, so "resume" and "fresh" render identically.
     → Neither shown nor acknowledged: show fresh (§3.3).

4. The check itself fails outright?
     → Defensive fallback (§3.5), Reintentar.
```

### 2.2 What happens once "Empezar demo" is tapped

```
1. Tap "Empezar demo"
     → Marks this device as having acknowledged the screen (§2.1 check 2
       — an implementation-level device flag, never a domain write)
     → Hands off directly, with no interstitial screen, into
       authentication.md §2.1's own resolution logic, cited verbatim.
       This screen's job stops here; it never re-appears mid-flow.
```

Any interruption *after* this tap is entirely `authentication.md`'s own concern (its own §3.8 resume logic) — nothing new to design once control has passed.

### 2.3 Whether the persistent Form-reminder banner shows (added 2026-08-18; one named exception added same day, `ux-critic` DEMO-M3)

```
1. Is control currently inside the pass-through branch — either §2.2's
   hand-off has already happened this session, or this device's
   acknowledgment was already recorded and §2.1 check 2 skipped straight
   there?
     → NO (still resolving, or still showing this document's own
       §3.1/§3.2/§3.3/§3.4/§3.5 screens): banner not shown. Those
       screens already end in a clear, single next step of their own —
       a second competing tappable target there would undercut §3.3's
       existing single-CTA discipline.
     → YES: show the banner (§3.6), on every screen, for the rest of
       the session. No further condition to check.

2. Any additional per-screen condition — which screen is active, how
   far she's progressed, whether she's mid-form-entry on that screen?
     → Exactly one, named explicitly, not a general category: the
       banner does not render while `home.md §3.8f` (Finalizar Venta
       success — the full-viewport digital receipt) is the currently
       active screen. `home.md` itself defines that screen as
       deliberately header-less and full-viewport — no header, no
       "Venta actual" tray, no product grid, nothing customer-visible
       beyond the receipt itself (HOME-B3's privacy-exposure fix,
       `home.md §3.8f`, and its own margin-zone exit-tap design that
       replaces all visible chrome) — because at that exact moment Ana
       is holding the device out toward the customer, and nothing else
       on screen has a legitimate reason to be customer-visible. A
       participant reaching this screen is implicitly being asked
       whether the receipt itself feels clean and trustworthy enough
       to show a real customer; compositing an obvious testing-artifact
       banner across exactly that screen would contaminate that
       specific signal, and risks looking unprofessional or broken in
       the one moment this product cares most about looking finished.
       Checked every other Approved Merchant Application document
       (`authentication.md`, `onboarding.md`, `inventory.md`,
       `events.md`, `reports.md`, `settings.md`) plus every other
       header-less state within `home.md` itself — `home.md §3.12`
       (Close-summary) is also header-less/full-viewport, but for an
       unrelated reason (an immediate, Ana-facing confirmation of her
       own closed selling day, never a moment the device is held
       toward a customer) — it does not share §3.8f's rationale and
       gets no exception; the banner renders there normally. `home.md
       §3.8f` is the only screen in the product with this specific
       rationale, so this is one narrow, named exception, not a
       category.
     → Otherwise: none. Visibility depends only on check 1 and this one
       named exception — the banner is not journey-aware or
       form-entry-aware in any other way. **Implementation note, not
       resolved here:** honoring this exception requires the mounting
       wrapper to know which screen is currently active — a
       route-level check, not a domain read — a narrower claim than
       §8 item 6's original "never reads or depends on anything inside
       home.md," which predates this exception and needs updating
       alongside it (see new §8 item 7).

3. Does tapping it, or leaving it unread, change whether it keeps
   showing?
     → No. No dismiss-forever mechanic (§10). Tapping it opens the
       questionnaire in a new browser tab (§4) and leaves the banner
       exactly as it was — she can tap it again later, any number of
       times, in the same session.
```

---

## 3. Low-fidelity wireframes

Conventions inherited from the rest of this family: `[ ]` = tappable, plain text = passive/informational.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │
│        ▢▢▢▢▢▢▢▢▢▢              │
└───────────────────────────────┘
```
Identical silent-skeleton convention every other tab's own §3.1 already uses. *global-principles.md*, "technology should disappear."

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
└───────────────────────────────┘
```

### 3.3 Bienvenida a la demo (fresh, or resumed — identical, read-only)
```
┌───────────────────────────────┐
│                                │
│           Nahui                 │
│                                │
│  Vas a probar un prototipo de    │
│  Nahui — gracias por ayudarnos.  │
│                                │
│  •  Usa cualquier número de       │
│     celular — no te va a llegar    │
│     ningún código real.            │
│                                │
│  •  Cuando te pida el código,      │
│     escribe cualquier número de    │
│     6 dígitos — por ejemplo,       │
│     123456.                        │
│                                │
│  •  El nombre de tu negocio,       │
│     tus productos y tus clientes   │
│     también pueden ser             │
│     inventados.                    │
│                                │
│  No es la versión final —          │
│  cuéntanos qué se te hace          │
│  confuso, nos sirve tanto como     │
│  lo que te gusta. Más adelante     │
│  te decimos cómo.                  │
│                                │
│  [       Empezar demo       ]      │
│                                │
└───────────────────────────────┘
```
- **No back arrow** — nowhere to return to, the same "first screen in the product" shape `authentication.md §3.3` already claims for itself, one step further upstream.
- **Deliberately not auto-advanced.** The purpose of this screen is that she actually reads the three operational facts (fictitious data, no real SMS, and what to type instead at the code screen) before typing anything into `authentication.md`'s phone/OTP screens — the identical reasoning `onboarding.md §3.4c` already gives its own no-auto-continue confirmation screen.
- Single primary CTA, no secondary/escape action — nothing to decline here, this is informational, not a consent gate with two real outcomes.
- **New bullet (added 2026-08-16, see status header):** placed immediately after the phone-number bullet, matching the actual chronological order she'll hit — enter a phone number, then reach `authentication.md`'s OTP screen next. States a concrete example (`123456`) rather than an abstract "any code," matching this screen's existing register (the phone-number bullet already gives a concrete instruction, not just a warning).
- **Closing sentence merged into the existing feedback-invitation sentence (fixed 2026-08-18, `ux-critic` DEMO-M2).** The 2026-08-18 amendment originally added a *second*, separate closing sentence about the upcoming banner right next to the already-existing "Cuéntanos qué se te hace confuso" sentence — two adjacent feedback-asks that pushed this screen's body copy to 91 words (`ux-critic`'s count), measurably past §1's "well under 15 seconds" bar. Per `ux-critic`'s own DEMO-S1 suggestion — §3.6's banner already carries the ongoing "cuéntanos tu opinión" invitation for the rest of the session, so this screen's own closing sentence doesn't need to fully restate it — the two are now one: "No es la versión final — cuéntanos qué se te hace confuso, nos sirve tanto como lo que te gusta. Más adelante te decimos cómo." Still states fact (a) ("no es la versión final") and fact (f) (critical feedback wanted, worth as much as praise), and still plants the expectation that a way to give it is coming ("más adelante te decimos cómo") — without repeating the Form's URL, the word "cuestionario," or "cuando quieras" a second time, since §3.6's banner already owns that ongoing, any-point framing for the rest of the session.
- **Density re-verified, this amendment (2026-08-18, `ux-critic` DEMO-M2).** Body copy drops from 91 words to 75 (intro 10 + three bullets 41, unchanged — the fact-bearing content that specifically needs retention, not skimming, per the 2026-08-16 live-campaign defect — + this merged closing sentence's 24). 75 words returns this screen to the same order of magnitude as the 70-word version `ux-critic` already reviewed and passed, with only a non-blocking Minor, on 2026-08-16 — the bullets themselves are left untouched deliberately, since they're the retention-critical content that compression already proved risky once. Not claimed as a pixel-verified scan-time measurement at this fidelity, same caveat this document's density notes have always carried, but a real, measured reduction back toward the bar, not an assumption.
- Copy never says "build," "environment," "QA," "staging," or "feature flag" — only "demo" and "prototipo." *global-principles.md*, "business language before technical language."

### 3.6 Recordatorio del cuestionario (persistent — present on every screen once `pass-through` begins)

```
┌───────────────────────────────┐
│ [ Cuéntanos tu opinión — cuestionario ] │
├───────────────────────────────┤
│   (whatever screen is currently active     │
│    renders exactly as its own document      │
│    specifies — unmodified; this banner       │
│    only adds one strip above it)              │
└───────────────────────────────┘
```
- **A single, full-width, always-tappable strip fixed at the very top of the screen** — it never overlaps or hides any part of any screen's own header, content, or bottom navigation bar (`home.md §3.1`'s persistent `[Hoy] Inventario Eventos Resultados` row included).
- **The whole strip is the tap target** — no separate button inside it, following this family's own `[ ]` = tappable convention.
- **Copy reuses this document's own already-approved "Cuéntanos" register (§3.3)** — an offer in Nahui's voice, true regardless of when she taps it. An earlier draft tried a first-person-declarative label ("Ya terminé — ir al cuestionario," her tap-to-declare-herself-done), but `brand-guardian` found it made a claim that's often untrue given this banner's own any-point, repeat-access design (§2.3/§1) — a participant checking the questionnaire mid-session, not actually "done," would be tapping words that misdescribe her own intent. Reverted to the offer construction instead (§10).
- **Tapping it opens the Google Form (`https://forms.gle/ZZhtJEfee3viWY1h8`) in a new browser tab** — her current demo screen is untouched and stays exactly where she left it. She can tap it again later in the same session; re-opening an already-completed public Form is harmless.
- **No dismiss control, ever** — see §10 for why that's deliberate, not an oversight.
- **Identical on every screen it renders on, every time** — no progressive states, no "you already tapped this" acknowledgment, no post-tap visual change. Deliberately the simplest possible stateless design, given the urgency of shipping this fix.
- **Exactly one named exception: does not render on `home.md §3.8f`** (Finalizar Venta success — the full-viewport digital receipt) — see §2.3 check 2 for the full reasoning. Renders identically, per every rule above, on every other screen, including every other header-less state (`home.md §3.12` included — its own header-less layout is for an unrelated, non-customer-facing reason and gets no exception).

**Composed onto three different Merchant Application screens, purely to illustrate — the screens themselves are unmodified, cited by canonical ID, never redescribed here** (per this folder's own "shared states across diverging branches" convention):

**Composed onto `authentication.md §3.1` (phone-number entry):**
```
┌───────────────────────────────┐
│ [ Cuéntanos tu opinión — cuestionario ] │
├───────────────────────────────┤
│   (authentication.md §3.1's own screen,     │
│    unmodified — phone-number entry)          │
└───────────────────────────────┘
```

**Composed onto `home.md §3.4` (Idle — no Event today, ready):**
```
┌───────────────────────────────┐
│ [ Cuéntanos tu opinión — cuestionario ] │
├───────────────────────────────┤
│  Nahui                        ⚙ │
│        ¿Vas a vender hoy?       │
│   [   Iniciar Sesión Rápida  ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```

**Composed onto `home.md §3.7` (Session active — ready, no Sale open; the busiest active-Session header state, two stacked rows, plus the bottom nav bar — added 2026-08-18 to verify vertical-chrome stacking against this state specifically, not just the lighter states above):**
```
┌───────────────────────────────┐
│ [ Cuéntanos tu opinión — cuestionario ] │
├───────────────────────────────┤
│ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│   [   zona de registro,          │
│       según Session.operatingMode ]│
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
Four horizontal bands stack in total (banner, two-row header, registration surface, bottom nav) — one more band than either lighter composed example shows, against the single densest header state this document family has (per `home.md`'s own 2026-08-14 discoverability amendment). Still no overlap: the banner adds exactly one strip above everything else; it doesn't compress, hide, or crowd the gear icon, "Cerrar jornada de venta," or the nav bar underneath. Confirms, rather than assumes, that the banner's chrome cost stays constant regardless of how dense the screen underneath it already is.

### 3.4 Retomar — interrupted before acknowledgment
No new wireframe — reaching this screen a second time (app closed/backgrounded before the tap) renders it pixel-identical to §3.3. Trivially satisfied since nothing is typed and nothing needs preserving — same "never restart progress" posture `authentication.md §3.8` holds itself to, at zero extra design cost.

### 3.5 Falla defensiva — no se pudo determinar si ya se mostró
```
┌───────────────────────────────┐
│  No pudimos cargar la demo.      │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Same convention as `authentication.md §3.9`/`onboarding.md §3.8` — manual "Reintentar," no live-customer risk to justify anything heavier.

---

## 4. Interaction flow (summary)

```
Open app (any time, Demo Mode build only)
  → resolve build type + device acknowledgment (§2.1, automatic)
      → not a Demo Mode build ───────────────────────────────────────→
        no code path — authentication.md's own §2.1 resolution runs
        directly, this document never involved
      → already acknowledged on this device ─────────────────────────→
        authentication.md §2.1's own resolution, silently — no screen
        in this document shown at all, but the persistent reminder
        banner (§3.6) is already present from this point on, per §2.3.
      → interrupted before acknowledgment ────────────────────────────→
        resume identical screen (§3.4)
      → fresh ─────────────────────────────────────────────────────────→
        Bienvenida a la demo (§3.3)
      → resolution itself fails ──────────────────────────────────────→
        fallback (§3.5), Reintentar

From §3.3:
  Empezar demo → marks device acknowledged (implementation detail,
    §2.2) → hands off directly to authentication.md §2.1's own
    resolution logic, cited verbatim. This document's job ends here;
    every subsequent screen, interruption, and edge case is
    authentication.md's own, unchanged.

From pass-through onward (either branch above):
  The reminder banner (§3.6) renders on every screen simultaneously,
  mounted independently above whatever screen state is currently
  active — see §2.3 — with exactly one named exception: it does not
  render while home.md §3.8f is active (§2.3 check 2). It has exactly
  one interactive behavior:
    Tap the banner → opens https://forms.gle/ZZhtJEfee3viWY1h8 in a
      new browser tab. The demo's own current screen is untouched and
      remains exactly where she left it.
  No other branches exist for this element.
```

---

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Bienvenida a la demo (fresh or resumed — identical)
4. Falla defensiva — no se pudo determinar si ya se mostró
5. Recordatorio del cuestionario (§3.6) — **not a mutually-exclusive state like 1-4 above; a persistent overlay coexisting with whichever of every other Approved document's screens is currently active, for the entire `pass-through` duration.**

---

## 6. Minimum step count

| Scenario | Taps to handoff | Why it can't be fewer |
|---|---|---|
| First time on this device, Demo Mode build | **1** (Empezar demo) | Auto-advancing would defeat the screen's purpose — same reasoning `onboarding.md §3.4c` gives its own no-auto-continue screen. |
| Already acknowledged on this device | **0** — never shown again | Direct consequence of §2.1 check 2's silent pass-through — "never ask twice," applied even to a non-domain fact. |
| Not a Demo Mode build (production) | **0** — screen doesn't exist | No code path at all in production. |
| Reaching the questionnaire from anywhere in the session | **1** (tap the reminder banner) | Previously required remembering a link she may never have seen render tappable inside the ad itself. Now always one tap away, from wherever she already is, no recall required. |

---

## 7. Automation opportunities

- Whether this is a Demo Mode build — resolved automatically, never a manual toggle she sees.
- Whether this device has already acknowledged the screen — resolved automatically, never re-asked.
- No separate "understood?" checkbox — the single available tap is itself the acknowledgment.
- Whether the reminder banner shows — resolved automatically from `pass-through` state alone (§2.3), never a manual toggle, never screen-aware.

---

## 8. Open questions for Architect / Main

1. **Resolved (Architecture Review).** Build-detection mechanism: a compile-time constant, not a runtime flag — `authentication.md §1`'s "structurally absent" bar means the Demo Mode code must not ship in the production bundle at all, which only a build-time gate achieves. Concretely: a dedicated `.env.demo-campaign` setting `VITE_DEMO_MODE=true`, built via a distinct `vite build --mode demo-campaign` script, gating the component behind `import.meta.env.VITE_DEMO_MODE` so dead-code elimination strips it from the production build. Two compiled outputs from one shared source tree — consistent with D48's "same codebase, same build artifact" reasoning, which is about deploy-target/audience unity, not literal single-binary output.
2. **Resolved (Architecture Review).** Device-acknowledgment persistence: a distinctly-named, separate `localStorage` key (e.g. `nahui-demo-mode-acknowledged`), read/written independently of `AppState`'s existing domain-mirroring blob — not folded in as a sibling field on that object, even though `authentication.md`'s own device-session precedent (`currentUser.phoneVerifiedAt`) lives there. That precedent is appropriate in `AppState` because it's real domain data; this flag explicitly isn't (§1, §9), so keeping it in a structurally separate location is what makes the "no domain write" claim true in practice, not just by convention. **Implementation-guidance note:** §2.1's checks 2 and 3 ("already acknowledged" vs. "shown but not yet acknowledged") don't need distinct persisted states — §3.4 already renders them identically ("nothing to preserve"); `ui-designer` only needs a single boolean read.
   - **Integration-shape recommendation, also from Architecture Review:** mount the Demo Mode gate as a new outer wrapper around the existing `<AppRouter />` (e.g. `DemoModeGate`), rendering its own screens when unresolved and the *unmodified* `<AppRouter />` once acknowledged or not applicable — not as a new branch injected inside `AppRouter.tsx`'s own resolution logic. Keeps `authentication.md`'s already-Approved logic untouched at the code level, matching this document's own "hands off directly... this document's job ends here" framing literally, not just in spec text.
   - **Precision correction to §9's `architecture-principles.md` #7 citation:** the CTA tap does write (the acknowledgment flag) — #7 doesn't apply not because "no real write happens," but because that write is a boolean set, naturally idempotent by construction (setting `true` twice is a no-op), unlike a keyed domain write where a blind retry risks duplication. Same conclusion, more precisely grounded.
3. **Operational, not a UX/domain question:** how a shared test device gets reset between different validation-campaign participants on the same day. Campaign-logistics concern, flagged for whoever plans the campaign, not escalated as a product gap.
4. **Resolved.** `architect` ruled this document fits neither D13/D45's class nor D38's — a third, narrower category (validation-campaign infrastructure, co-located in `product/02-ux/` for pipeline/deploy convenience, explicitly not a Merchant Application experience document). See `decision-log.md` D48 and the status header above.
5. **Resolved.** `brand-guardian` reviewed the welcome copy (§3.3) — one Major finding (the opening greeting read as generic, translated-from-English template copy rather than Nahui's established voice; `onboarding.md §3.3` cited as the correct in-family precedent) — fixed, replacement text applied. Everything else (the two operational bullets, the criticism-invitation line, the "Empezar demo" CTA) passed as-is. **Note (2026-08-16):** the new third operational bullet (see status header) also passed `brand-guardian`'s review, no changes — the concrete example ("123456") was judged the more honest, companion-like choice, consistent with the character bible's "always gives her an honest way out" rule.
6. **Resolved — folded into `reviewer`'s own Foundation-consistency pass rather than a separate `architect` dispatch, given live-campaign urgency.** The `pass-through` branch previously rendered bare `<AppRouter />` with nothing else; this amendment adds a sibling element inside it for the first time. `reviewer` confirmed via direct code inspection (`DemoModeGate.tsx`'s compile-time check, `DemoModeGateActive.tsx`'s current bare `pass-through` branch) that the addition inherits "structurally absent from production" for free, introduces no new domain write/persistence key/read of Selling/Inventory/Identity data, and that item 2's existing outer-wrapper guidance already establishes the one load-bearing invariant it has to preserve (keep `AppRouter`'s own logic untouched at the code level) — judged low-risk enough to confirm directly rather than gate on a separate dispatch.
7. **New, flagged for the same lightweight confirmation as item 6 — the §2.3 check 2 exception (`home.md §3.8f`, added 2026-08-18 alongside `ux-critic` DEMO-M3) narrows item 6's original "never reads or depends on anything inside `home.md`" claim.** Suppressing the banner on exactly one screen requires the mounting wrapper to know which screen is currently active — a route-level check, not a domain read (no new `AppState` field, no new `localStorage` key) — but it is a new coupling this design didn't have before this amendment. Main judged this the same low-risk shape as item 6 (route-awareness, not domain-awareness) and confirmed directly, per the Product Owner's explicit authorization to move on scope judgment given active ad spend and lost campaign data — not a silently skipped step, a stated call under real time pressure. `ui-designer` should still flag back explicitly if implementing this exception turns out to need anything beyond a simple current-screen-identity check.

**Architecture Review verdict (added, this pass): clean, no blockers — ready for `ui-designer`.** Items 1-2 above resolve the two mechanism questions this section originally deferred; nothing here is a redesign of this document's own decision logic or wireframes, and none of it required a `knowledge-mentor` consultation (build-mode/env-based conditional compilation and `localStorage`-keyed device state are both ordinary, already-precedented techniques in this exact codebase — Vite build modes are stock tooling, and `localStorage`-keyed device state is the pattern `store.tsx` already uses for the session this document explicitly analogizes to).

---

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — never shown at all in a production build (§2.1 check 1); never shown twice on an unreset device (§2.1 check 2).
- *"Never ask twice"* — applied here even to a non-domain, campaign-only fact.
- *"Technology should disappear"* — identical silent-skeleton/slow-fallback convention as every other tab's own resolving state; no new loading pattern invented.
- *"Business language before technical language"* — "build," "environment," "QA," "staging," "feature flag" never appear in participant-facing copy; only "demo"/"prototipo."
- *"Capture business truth once, reuse it forever"* — extended by analogy to a non-domain fact: acknowledgment is captured once and never re-asked for the rest of that install.

**architecture-principles.md:**
- *#4 (internal-only entities never leak into user-facing language)* — "Demo Mode," "validation campaign," "build variant" stay internal/agent-facing English terms; on-screen copy never uses them. The reminder banner's copy (added 2026-08-18) never uses "campaign," "form," "tracking," or "conversion" either — only "cuestionario."
- *#6 (dependency direction)* — not applicable; this screen reads and writes nothing in the domain model.
- *#7 (idempotent/keyed retries)* — the "Empezar demo" CTA tap does write (the acknowledgment flag, §2.2), but #7 doesn't apply because that write is a boolean set, naturally idempotent by construction (setting `true` twice is a no-op), not because no write occurs — see §8 item 2's own precision correction. §3.5's defensive fallback "Reintentar" re-runs the same read-only local check, with no duplication risk to guard against.

**brand-guide.md / tone-of-voice.md:**
- Tone — "warm, direct, respects the vendor's intelligence" — states plainly what's fictitious and what won't happen (no real SMS) before she types anything, frames critical feedback as equally valuable to praise.
- *tone-of-voice.md, "state facts before offering an opinion"* — the three operational bullets precede the feedback-framing sentence. §3.3's new closing sentence (added 2026-08-18) states the fact — a way to share her opinion will appear — before she's asked to form any opinion about the demo itself, and before §3.6's banner appears at all: the expectation is set, not sprung.
- *tone-of-voice.md, "suggestions read as offers, not instructions"* (added 2026-08-18) — the reminder banner's copy ("Cuéntanos tu opinión — cuestionario") reuses §3.3's own already-approved offer register, true regardless of when she taps it. `brand-guardian` also corrected the initial reasoning here: an earlier first-person-declarative draft was defended under this same citation, but the rule actually targets narrative-suggestion copy, not standard button-label imperatives — the existing in-family CTAs (`Empezar demo`, `Reintentar`) were never in tension with it to begin with.
- **A deliberate, named exception to *"technology should disappear"*, added 2026-08-18.** That principle generally argues for minimal, receding UI — the opposite of an always-visible banner. The exception is grounded in this document's own §1 Scope framing: this is *validation-campaign infrastructure*, not a Merchant Application UI pattern, so the general minimalism bar this project holds real merchant-facing screens to doesn't govern it the same way. The banner exists because the alternative — a genuinely lost primary success metric on live ad spend — is a worse outcome than one unobtrusive, non-blocking strip for the campaign's short duration.
- **Flagged, not asserted as settled:** this screen addresses a validation participant, a relationship this document family hasn't spoken to before. Recommending a `brand-guardian` consultation before this copy is final — see §8.5. The 2026-08-18 reminder banner (§3.6) was reviewed on this same basis — its first draft tried a first-person-declarative pattern new to this family, `brand-guardian` found it a Major (a truth claim often false given the banner's own repeat-tap design) and it was reverted to the already-approved "Cuéntanos" offer register instead.
- **Cross-document consistency (added 2026-08-18).** The `home.md §3.8f` exception (§2.3 check 2) protects a privacy/trust reasoning `home.md` itself already justifies in full (HOME-B3) — this document doesn't re-derive that reasoning, only respects it by not compositing onto that one screen. Consistent with this document's own posture of citing sibling documents' precedent rather than inventing a parallel rule.

---

## 10. Decisions made

- **Named `demo-mode.md`, standalone — not amended into `authentication.md`.** Reasoned in full above. Recommend a lightweight Architect/Main placement ruling before Approved, non-blocking to the design itself.
- **Uses "demo"/"prototipo" in copy, never "ejemplo"** — that word stays reserved for `onboarding.md`'s own, fully independent "Ver un ejemplo" concept.
- **Writes nothing to the domain model.** The one piece of state needed (device acknowledgment) is an implementation detail below this document's abstraction level, same treatment as `authentication.md`'s own device-session persistence.
- **Shown exactly once per device (until reset), never on every app open.**
- **No back arrow, no escape hatch** — nothing to escape from; a one-way, purely informational gate with a single CTA.
- **No in-app "Demo Mode" indicator anywhere else in the product** — explicitly out of scope, flagged for a future document (§11).
- **(Added 2026-08-16) §3.3 states a third operational fact — what to type at `authentication.md`'s OTP screen (any 6-digit code, e.g. `123456`) — never touching `authentication.md` itself.** See status header for the empirical trigger (live-campaign participants stuck) and full reasoning.
- **(Added 2026-08-18) Top-anchored, non-overlapping strip — chosen specifically to avoid colliding with any existing screen's own header controls or `home.md §3.1`'s persistent bottom nav bar.** Since this document is explicitly forbidden from touching any Merchant Application screen (per D48's placement discipline), non-collision with their existing elements was a hard constraint, not a preference — ruled out bottom-fixed/overlay placement on that basis.
- **(Added 2026-08-18) No dismiss control at all, by design.** A dismissible banner risks a participant closing it early "just to see it once," silently recreating this exact fix's own root problem for the rest of her session — worse than the mild persistent-UI cost of leaving it un-dismissible for a short, time-boxed campaign.
- **(Added 2026-08-18, refined same day) Copy is a first-person declarative label ("Cuéntanos tu opinión — cuestionario"), not this document's earlier "Cuéntanos" register.** Deliberately turns the tap itself into the "finish moment" this prototype otherwise has no defined trigger for (§1), rather than leaving her to notice an ambient nudge and separately decide she's done. This is the first first-person-declarative CTA in this document family — flagged explicitly for `brand-guardian`'s pending review rather than treated as a routine copy variation.
- **(Added 2026-08-18) Opens the Form in a new browser tab, never replacing the current demo screen** — preserves whatever she was doing exactly as she left it; consistent with "never ask twice"/no wasted navigation.
- **(Added 2026-08-18) Scoped strictly to `pass-through` (§2.3)** — never shown on this document's own §3.1/§3.2/§3.5 screens, which already resolve to their own clear, single next step.
- **(Added 2026-08-18) Exactly two touchpoints, deliberately no third.** §3.3's new closing sentence plants the expectation early; §3.6's persistent banner delivers the real link throughout. Product Owner's explicit reasoning: if a participant never reaches the questionnaire, that should be her own choice — not a consequence of our side giving her only one chance to notice it. Stops at two by design, not by omission.
- **(Added 2026-08-18, `ux-critic` DEMO-M3) Exactly one named exception to the banner's otherwise-universal rendering: never on `home.md §3.8f`.** Checked every other screen in the product for the same rationale — only `home.md §3.8f` has it; `home.md §3.12` is header-less too but for an unrelated, non-customer-facing reason and gets no exception.

---

## 11. Future considerations

- A persistent in-app "estás en modo demo" indicator, if a future campaign runs long/multi-session enough that participants lose track — not evidenced as needed yet, flagged only.
- A demo-mode-specific feedback capture mechanism embedded in the product itself — not requested by the Product Owner's brief; feedback capture is presumably a moderator/facilitator-side concern for this campaign.
- Whether this document is retired/archived once the validation campaign concludes, given its explicitly disposable, campaign-scoped nature — a repository-stewardship question for Main, not a design question.
