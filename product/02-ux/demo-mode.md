# Demo Mode — Welcome Screen

**Status: Product Definition → UX Design → placement ruling → `brand-guardian` review → Architecture Review all complete (2026-08-14/15) — ready for `ui-designer` to build.** Drafted by `ux-designer` at explicit Product Owner request, Product Owner-approved in concept and wireframe. This document's §1 also serves as this feature's Product Definition, per this folder's own front-matter rule (no separate pre-UX artifact exists). `brand-guardian` reviewed §3.3's copy — one Major finding (the opening greeting read as generic, translated-from-English template copy rather than Nahui's established voice; `onboarding.md` §3.3 cited as the correct in-family precedent) — fixed, replacement text applied. `architect` ruled on placement (`decision-log.md` D48 — a third category, neither D13/D45's class nor D38's) and completed Architecture Review (§8 items 1-2, resolved with concrete build-mode/storage/mounting-shape guidance — see below). Not yet passed through `ux-critic`/`reviewer` (New-Feature Workflow's Review Pipeline stage, after the React build).

**Amended 2026-08-16 (Product Owner-relayed, empirically confirmed defect — live campaign).** Real validation-campaign participants (Facebook Groups recruitment post, live at demo.nahui.app) got stuck at `authentication.md`'s OTP entry screen. §3.3's welcome copy correctly warned that no real SMS would arrive, but never stated what to type instead — and `authentication.md`'s own OTP screen is intentionally mock-delivery-agnostic (per that document's own §0 abstraction-level choice, it's the identical screen every real merchant sees, and never reveals that verification is mocked). Confirmed in code: `verifyOtp(phone, _code)` in `src/domain/store.tsx` accepts any 6-digit input, the `_code` parameter is intentionally unused. A participant told "no real code is coming" had nothing to reference and no way to know any 6 digits would work. **Fix, scoped entirely to this document's own §3.3:** a new third operational fact — any 6-digit code (e.g. `123456`) works — added to the welcome screen. `authentication.md` is not touched, per this document's own placement reasoning (`decision-log.md` D48) — that screen must stay general-purpose/mock-delivery-agnostic for every future real merchant, not leak Demo Mode's own concerns into it. Copy/clarity fix only — no flow, decision-logic, or architecture change; §2, §4-§8 below are unaffected. **Review pipeline complete, same day.** `ux-critic`: clean, no Blockers/Majors (one non-blocking Minor on overall screen density approaching the 15-second scan bar, one non-blocking Suggestion on bullet-list grammatical parallelism — both flagged for a later polish pass, not this fix). `reviewer`: clean, no Blockers/Important findings — independently confirmed `authentication.md` untouched, the D48 citation accurate, and the "any 6-digit code" claim correct against `verifyOtp` in `src/domain/store.tsx`. `brand-guardian`: pass, no changes — the concrete example ("123456") reads as the honest, companion-like choice, not a tonal drift. Folded back into Approved. Ready for `ui-designer` to build immediately, given the live-campaign urgency.

**Amended 2026-08-18 (Product Owner-relayed, confirmed by real Meta Ads campaign data — live campaign).** The live paid campaign is driving real clicks to `demo.nahui.app`, but the Google Form — the campaign's actual success metric (`company/merchant-validation-campaign-meta-ads.md` §7) — is getting almost no new responses. Root cause, confirmed against that document's own §5b: the Form link exists in exactly one place, as plain text inside the ad's Primary Text (not the ad's clickable button, which points to `demo.nahui.app`) — a named, accepted risk at the time ("a plain-text URL inside an ad's Primary Text is not guaranteed to render as tappable on every placement… Instagram Stories/Reels frequently do not"), now shown by real campaign data to be actually costing conversions. Compounding it: once a participant taps through into the demo, **nothing inside the product itself ever points her back toward the questionnaire** — `demo-mode.md §2.2`'s own hand-off ends the moment `authentication.md`'s flow begins; §5b of the Meta Ads plan named this exact gap explicitly as "a real, honest gap… not something to quietly work around" from Marketing's side, since a product change is out of Marketing's remit. **Fix, two reinforcing touchpoints, deliberately no third:** (1) a brief expectation-setting sentence added to the welcome screen itself (§3.3), before she starts exploring, so what follows doesn't feel like a surprise; (2) a persistent, session-wide reminder banner (new §2.3, §3.6), present on every screen from the moment `pass-through` begins until the app closes, giving her a one-tap path to the questionnaire from wherever she is, at any point, deliberately not tied to any "finish" moment this prototype has no defined trigger for. Product Owner's own reasoning for two touchpoints, not one: if a participant never reaches the questionnaire, that should be her own choice, never a consequence of our side giving her only one chance to notice it — and no third, milestone-triggered mechanism was added on top, since real-time exit/tab-close detection is both technically unreliable (browsers block redirect-on-unload) and would read as a dark pattern out of step with Nahui's honest voice; an explicit, always-available, user-initiated action was judged the better fit. `authentication.md`/`onboarding.md`/`home.md`/every other Merchant Application screen remains untouched, per this document's own D48 placement discipline — the banner mounts as a sibling to `<AppRouter />` inside the existing `pass-through` branch (`DemoModeGateActive.tsx`), never inside any individual screen. **Review pipeline: `brand-guardian` found one Major, fixed same day; `ux-critic`/`reviewer` still in progress.** `brand-guardian` flagged the banner's first draft — a first-person-declarative label ("Ya terminé — ir al cuestionario," letting her tap-to-declare herself done) — as making a claim that's often untrue at the moment of tapping: §2.3/§1 both specify the banner is designed for any-point, repeat access with no dismiss-forever mechanic, so a participant who just wants to check the questionnaire mid-session (not actually "done") would be tapping something that misdescribes her own intent — a real, if narrow, honesty tension per `character-bible.md`'s "tells the truth about what it does and doesn't know yet." Also found the "offers, not instructions" citation didn't actually support the construction — that rule targets narrative-suggestion copy, not standard button-label imperatives, so there was no real tension with existing in-family CTAs (`Empezar demo`, `Reintentar`) to begin with. Fixed by reverting to this document's own already-approved "Cuéntanos" offer register (§3.3) instead — **"Cuéntanos tu opinión — cuestionario"** — true regardless of when she taps it, and continuous with §3.3's own new closing sentence that promises this exact banner is coming. `brand-guardian` judged this a Major, not Blocker, and confirmed the fix needs no further review round given it's a minimal-diff swap back into a voice register already cleared on 2026-08-15/16. A lightweight Architecture Review confirmation (§8 item 6, non-blocking) was folded into `reviewer`'s own pass rather than a separate dispatch, given the addition is stateless and low-risk. `reviewer`: clean — confirmed no Merchant Application screen or its code was actually touched (verified directly: `DemoModeGateActive.tsx`'s `pass-through` branch is still bare `<AppRouter />`, nothing built yet), and independently judged the §8 item 6 Architecture Review flag low-risk enough to fold into its own pass rather than needing a separate `architect` dispatch (no new domain write, no new persistence key, the same outer-wrapper composition technique already established). Found 2 Important documentation-drift findings, both fixed same day: §1's Scope boundary paragraph was stale (still described only the original single screen); §9's #7 citation was stale (still said "no real write here," contradicting §8 item 2's own already-present precision correction that the CTA tap does write an idempotent boolean flag). One Suggestion applied (§2.3's illustrative screen list was incomplete). One Suggestion logged, no action needed (D48's placement test is unaffected by UI footprint, but the banner now visually composites onto every Merchant Application screen for the session, worth future readers of D48 knowing). `ux-critic`: found 3 Major, 2 Minor, 1 Suggestion, all closed same day. DEMO-M1 ("Ya terminé" being contextually false/too narrow) resolved as a side effect of the copy fix above. DEMO-M2 (§3.3's density measurably exceeded the "well under 15 seconds" bar) fixed by merging the two adjacent feedback-ask sentences into one — 91 words down to 75, the fact-bearing bullets left untouched since they're the retention-critical content a compression already proved risky once (2026-08-16). DEMO-M3 (the banner's screen-agnostic design would have rendered across `home.md §3.8f`, the digital-receipt screen deliberately built header-less for customer-facing privacy reasons, HOME-B3) fixed with one named, reasoned exception in §2.3 check 2 — every other screen, including `home.md §3.12`'s own unrelated header-less state, checked and confirmed not to share that rationale. DEMO-MIN1 addressed with a third composed illustration (§3.6, onto `home.md §3.7`, the busiest active-Session header state). DEMO-MIN2 was already fixed during `reviewer`'s own pass. **Given the Product Owner's explicit authorization to move on Main's own scope judgment (active ad spend, ongoing loss of campaign data/participant experience), the resulting new architecture item (§8 item 7 — the `§3.8f` exception needs a route-level screen-identity check) was confirmed directly by Main rather than a further dispatch, following the same low-risk reasoning `reviewer` already applied to item 6. Folded back into Approved. Ready for `ui-designer` to build immediately.**

**Amended 2026-08-18 (Product Owner-relayed, two real findings from campaign response data — draft, pending review pipeline).** Two validated findings: (1) the welcome screen's closing line never actually established that trying the prototype and completing the questionnaire are one experience — only that feedback is wanted "later, somehow"; (2) at least one respondent explicitly said she couldn't find a way to start over after trying the prototype. **Fix, two pieces:**

**(A) §3.3's closing framing, restructured, not just re-trimmed.** The old third bullet (fictitious business/products/customers) is folded into a new second intro sentence, which also now states the previously-missing fact that this is validation, not a sale — freeing the bullet list down to exactly the two retention-critical, causally-ordered phone→OTP facts (unchanged since 2026-08-16). The closing sentence is fully rewritten to state plainly that the questionnaire is part of the same activity, not a separate optional step, with a concrete (softened, Product-Owner-requested) reason: "tu opinión nos ayuda a decidir qué construimos después," not the stronger "decide," which overstated a single response's influence. Restart is deliberately *not* mentioned on this screen — the same "one early moment isn't reliably remembered" reasoning that produced the persistent banner applies here too; solved structurally (B, below), not with a sixth fact crammed onto an already-tight screen. Density: ~79 words (corrected 2026-08-18, `ux-critic` MIN1 — an earlier count of 76 understated the closing sentence by 3 words), a real, if modest, +4 words over the previously-reviewed 75-word version, not "essentially flat" — restructuring recovered most, not all, of a full bullet's worth of overhead.

**(B) New "Reiniciar demo" control in the persistent banner (§2.4, new §3.7/§3.8), not on the welcome screen or in Settings.** A restart trigger literally cannot live on §3.3 — §2.1 check 2 skips that screen entirely, forever, once a device is acknowledged. Settings/Configuración is out of bounds under this document's own D48 placement discipline — it's a real Merchant Application screen (`settings.md`), and demo-only functionality has never been allowed to touch one. The reminder banner (§3.6) is the one existing precedent for a persistent, demo-only, cross-screen control that touches no Merchant Application screen's own content — restart's trigger lives there instead, as a small secondary element. Its *destination* is still, correctly, the welcome screen — reached not by a new decision-logic branch, but by clearing the device-acknowledgment flag and forcing a reload, letting §2.1's completely unmodified resolution logic land fresh on §3.3, exactly as a brand-new device would. Mechanism: clear both `nahui-demo-mode-acknowledged` and `AppState`'s own storage key, then reload — a full reload, not an in-app state transition. Chosen, not the only possible mechanism (`reviewer` finding, corrected 2026-08-18): `store.tsx` already exports a working, currently-unused `resetPrototype()` that could flush the domain store without a reload, but a full reload is still the simpler, more complete choice — direct inspection of `main.tsx` confirms `StoreProvider` mounts above `DemoModeGate`, so an in-app transition alone wouldn't remount the gate itself, and reload also resets `DemoModeGateActive`'s own local `gate` state, which `resetPrototype()` alone would not. A confirmation dialog (§3.7) precedes any clear, reusing this project's own established destructive-action pattern (`home.md §3.11`, `settings.md §3.8`) — no interlock like "Cerrar jornada de venta"'s Sale-in-progress block, since nothing a demo restart discards is ever real merchant data.

**Banner gains the real questionnaire time estimate, on its own line, not appended to row 1's label** ("8-12 min," `merchant-validation-campaign.md`'s own established figure for the questionnaire alone) — addressing the concern that the ask might read as smaller/more skippable than it is, without resorting to a sequence claim ("Último paso"/"Paso final") that was evaluated and rejected: it would carry the same context-blindness that sank the earlier "Ya terminé" draft (a static, unconditionally-shown label can't actually verify it's "the last step" from wherever she's standing), and would directly contradict §3.3's own new "no es un paso aparte" framing two touchpoints apart in the same document. **Revised same day (`ux-critic` M1/M2):** appending "(8-12 min)" directly onto row 1's label first produced a ~46-character line genuinely close to wrapping on a narrow viewport, and the restart control was first added as a second, identically-shaped full-width row — a structural collision with row 1, not a deferrable styling question. Both are fixed together: row 1 reverts to its already-vetted label alone; the time estimate and a small, corner-positioned "Reiniciar demo" control both move to a new, slim, asymmetric second line — never a second full-width row. See §3.6 for the corrected wireframe and full reasoning.

**Status: draft — `brand-guardian` reviewed and passed all three copy changes clean (one non-blocking style Suggestion); `ux-critic` found 2 Major + 3 Minor, `reviewer` found 2 Important + 2 Suggestions, all seven fixed same day (see §3.3/§3.6/§3.7/§8/§9 design notes for the specific fixes). Pending `ux-critic`/`reviewer` re-verification of the fixes** (not a fresh review) **before this folds back into Approved or reaches `ui-designer`.**

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

**Business objective:** make sure a real bazaar-vendor validation participant understands, before typing anything, that (a) this is an interactive prototype, not the finished product; (b) everything she enters — phone number, business name, products, customer info — should be fictitious; (c) no real SMS is sent; (d) what to type instead when the app's code screen appears — any 6-digit sequence, e.g. `123456` — since no real code is coming; (e) the goal is evaluating the experience, not creating a real account; (f) honest feedback, including critical/confused reactions, is explicitly wanted; (g) this is a validation exercise, not a sales pitch — nothing is being sold to her; (h) trying the prototype and completing the short questionnaire afterward are one continuous experience, not two separate optional activities, and her feedback has a concrete, stated consequence — it helps decide what gets built next, never a vague "it helps us." Directly supports the upcoming real-merchant validation campaign (`company/CLAUDE.md`'s Experience Validation section).

**Business objective — restart (added 2026-08-18, see status header).** A real validation-campaign respondent could not find a way to start over. Give any participant an easy, always-discoverable, in-session way to reset all demo progress and return to the initial welcome screen — without needing to know how to manually clear browser storage — from wherever she currently is in the app.

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
- **Restart acceptance criteria (added 2026-08-18):**
  - A restart affordance is visible and tappable from every screen the persistent reminder banner (§3.6) already renders on — inheriting that banner's one existing named exception (`home.md §3.8f`) automatically, no new exception invented.
  - Tapping it always shows an explicit confirmation dialog (§3.7) stating plainly that all demo progress will be lost before anything is cleared. No single tap ever destroys anything.
  - Confirming clears both `nahui-demo-mode-acknowledged` and `AppState`'s own storage key (`nahui-hifi-prototype-v1`) and forces a full app reload; §2.1's existing, unmodified resolution logic then resolves fresh, landing on §3.3 exactly as a brand-new device would — no new decision-logic branch.
  - No interlock blocks restart the way `home.md`'s "Cerrar jornada de venta" is blocked mid-Sale — nothing restart could discard is ever real, registered business data (this document's own §1 framing), so there is nothing analogous to protect.
  - The clear operation is a write-only, content-blind clear of `AppState`'s storage key — it never reads, inspects, or interprets any Business/Session/Sale field, consistent with this document's standing "no domain read" posture.

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

### 2.4 What happens when "Reiniciar demo" is tapped (added 2026-08-18)

```
1. Tap "Reiniciar demo" (reachable from the persistent banner, §3.6,
   on every screen it renders on — the identical single named
   exception as the banner itself, home.md §3.8f — no separate
   exception invented for this control)
     → Shows the confirmation dialog (§3.7) — the second place in
       this document that deliberately asks rather than automates
       (the first being §3.3's original one-way gate, which never
       asks anything — this is the first genuine two-outcome
       confirmation the feature has). Reuses home.md §3.11's and
       settings.md §3.8's already-Approved confirm-dialog convention,
       not a new pattern.

2. Cancelar
     → Dialog closes, returns to exactly whatever screen/state she was
       on — untouched. Same guarantee home.md §3.11 already gives its
       own Cancelar path.

3. Sí, reiniciar
     → Clears both `nahui-demo-mode-acknowledged` (demoModeStorage.ts)
       and `nahui-hifi-prototype-v1` (store.tsx) — a write-only,
       content-blind clear of the second key, never a read of it.
     → Forces a full reload of the app.
     → On that reload, §2.1's existing resolution logic runs
       completely unchanged: check 1 (Demo Mode build) still passes,
       check 2 (device already acknowledged) now reads NO, since the
       flag was just cleared — resolving to a fresh §3.3, identical
       to what a brand-new device sees. No new §2.1 condition, no new
       gate state inside DemoModeGateActive — restart reuses the
       existing resolution path in full, precisely because it clears
       the exact fact that path already keys off of.

4. The clear operation itself fails outright (e.g. storage access
   throwing in a restrictive browsing context)?
     → Defensive fallback (§3.8), Reintentar. No reload is attempted
       against a partially-cleared or unknown storage state.
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
│  Estamos validando ideas, no       │
│  vendiéndote nada — tu negocio,    │
│  tus productos y tus clientes      │
│  pueden ser inventados.            │
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
│  Al final hay un cuestionario      │
│  breve — es parte de la misma      │
│  prueba, no un paso aparte, y      │
│  tu opinión nos ayuda a decidir    │
│  qué construimos después.          │
│                                │
│  [       Empezar demo       ]      │
│                                │
└───────────────────────────────┘
```
- **No back arrow** — nowhere to return to, the same "first screen in the product" shape `authentication.md §3.3` already claims for itself, one step further upstream.
- **Deliberately not auto-advanced.** The purpose of this screen is that she actually reads the operational facts (fictitious data, no real SMS, and what to type instead at the code screen) before typing anything into `authentication.md`'s phone/OTP screens — the identical reasoning `onboarding.md §3.4c` already gives its own no-auto-continue confirmation screen.
- Single primary CTA, no secondary/escape action — nothing to decline here, this is informational, not a consent gate with two real outcomes.
- **New bullet (added 2026-08-16, see status header):** placed immediately after the phone-number bullet, matching the actual chronological order she'll hit — enter a phone number, then reach `authentication.md`'s OTP screen next. States a concrete example (`123456`) rather than an abstract "any code," matching this screen's existing register (the phone-number bullet already gives a concrete instruction, not just a warning).
- **Closing sentence merged into the existing feedback-invitation sentence (fixed 2026-08-18, `ux-critic` DEMO-M2).** The 2026-08-18 amendment originally added a *second*, separate closing sentence about the upcoming banner right next to the already-existing "Cuéntanos qué se te hace confuso" sentence — two adjacent feedback-asks that pushed this screen's body copy to 91 words (`ux-critic`'s count), measurably past §1's "well under 15 seconds" bar. Per `ux-critic`'s own DEMO-S1 suggestion — §3.6's banner already carries the ongoing "cuéntanos tu opinión" invitation for the rest of the session, so this screen's own closing sentence doesn't need to fully restate it — the two were merged into one, then that merged sentence was itself fully rewritten in this same-day follow-up (below).
- **Restructured, not just re-trimmed (same day, second pass, Product Owner-relayed findings).** Two new required facts (this is validation not a sale; prototype+questionnaire are one experience with a concrete reason for the ask) needed to land on an already-tight screen. Rather than append a fourth bullet and a longer closing sentence, the old third bullet (fictitious business/products/customers) was folded into a **new second intro sentence**, which now also carries the "validating ideas, not selling" fact — freeing the bullet list down to exactly the two retention-critical, causally-ordered phone→OTP facts, unchanged since 2026-08-16. The closing sentence is fully rewritten: states plainly the questionnaire is part of the same activity, not a separate optional step, with a concrete reason. **Reason clause deliberately softened, Product-Owner-requested:** "tu opinión nos ayuda a decidir qué construimos después," not "tu opinión decide qué construimos después" — the stronger verb implied a single response determines the roadmap; "nos ayuda a decidir" frames her opinion as input to a decision Nahui makes, not the decision itself, matching the vocabulary this document already uses elsewhere ("nos sirve tanto," "Cuéntanos"). Does not restate "no es la versión final" — "prototipo" in the opening sentence already establishes it.
- **Restart deliberately not mentioned here.** The same "one early moment isn't reliably remembered" reasoning that produced the persistent banner (2026-08-18) applies — she needs "how do I restart" only well after this screen is out of memory, not at the very start. Solved structurally via the persistent banner's own new restart control (§3.6/§2.4), not a sixth fact crammed onto this screen.
- **Density: ~79 words** (10 intro + 16 new second-intro-sentence + 27 bullets, content unchanged + 26 closing — corrected 2026-08-18, `ux-critic` MIN1; the closing sentence is 26 words by direct count, not 23 as this note originally claimed), a real, if modest, +4 words over the previously-reviewed 75-word version — not "essentially flat" as this note previously claimed. The increase is honest, not concealed: two brand-new required facts landed on this screen, and restructuring (folding the old bullet 3 into prose) recovered most, not all, of a full list item's worth of overhead. Not claimed as a pixel-verified scan-time measurement at this fidelity, same caveat this document's density notes have always carried — worth explicit `ux-critic` re-verification given the history here (two prior rounds already found this screen exceeding its own bar), not assumed fine by inertia.
- Copy never says "build," "environment," "QA," "staging," or "feature flag" — only "demo" and "prototipo." *global-principles.md*, "business language before technical language."

### 3.6 Recordatorio del cuestionario (persistent — present on every screen once `pass-through` begins)

```
┌───────────────────────────────┐
│ [ Cuéntanos tu opinión — cuestionario ] │
│  (8-12 min)            [ Reiniciar demo ] │
├───────────────────────────────┤
│   (whatever screen is currently active     │
│    renders exactly as its own document      │
│    specifies — unmodified; this banner       │
│    only adds one strip above it)              │
└───────────────────────────────┘
```
- **One full-width primary row, one slim asymmetric secondary line (revised 2026-08-18, fixing `ux-critic` M1/M2) — not two stacked full-width rows.** Row 1 is the single, full-width, dominant "Cuéntanos tu opinión — cuestionario" tap target — the actual ask this whole feature exists to drive her toward, unchanged in text from its already-`brand-guardian`-approved form. Row 2 is a slim line beneath it, carrying two small, unequal elements side by side: the honest time estimate ("8-12 min") as passive text on the left, and the "Reiniciar demo" tap target as a small, corner-positioned control on the right — sharing a line with ancillary text, at a fraction of row 1's width, never standing alone as a second equally-shaped row. Neither row overlaps or hides any part of any screen's own header, content, or bottom navigation bar (`home.md §3.1`'s persistent `[Hoy] Inventario Eventos Resultados` row included).
- **Restart's shape is now structurally, not just visually, distinct from the primary row (fixed 2026-08-18, `ux-critic` M2).** Two adjacent, identically-shaped, full-width `[ ]` rows — this design's prior shape — genuinely risked a participant not being able to tell at a glance which was the app's real ask and which was a reset utility, the same "equally-weighted competing CTA" defect class this project already treats as a real usability problem, not a font-size question. Restart now differs in every structural way available at this fidelity: it's on the secondary line, not the primary one; it shares that line with passive text rather than standing alone; and it occupies a small corner span, not the row's full width. This is the differentiation itself, defined here — `ui-designer` inherits an already-distinct shape to execute, not an ambiguous one to somehow disambiguate later.
- **Time estimate given its own line, not appended inline (fixed 2026-08-18, `ux-critic` M1).** The prior draft appended "(8-12 min)" directly onto row 1's label — "Cuéntanos tu opinión — cuestionario (8-12 min)," ~46 characters — genuinely close to wrapping on a narrow mobile viewport, stacked directly on top of `home.md §3.7`'s own already-tight two-line header (that document's own 2026-08-14 review flagged its ambient-total row as tight enough to need explicit legibility verification). Rather than shorten the honest 8-12 min figure, or drop it, it moves to row 2, freeing row 1 back to exactly its already-vetted text alone — "Cuéntanos tu opinión — cuestionario," unchanged in length (35 characters) from before this same-day amendment ever touched it — removing the wrap risk at its source rather than shrinking the honest figure to fit.
- **Space-budget answer for the busiest composed example, not just an overlap check (fixed 2026-08-18, `ux-critic` M1).** Composited onto `home.md §3.7`, total non-task chrome above the "Venta actual" registration surface is four lines: banner row 1 (35 characters), banner row 2 (two short fragments, each well under either neighbor's length), `home.md`'s own header title row (~30 characters, "Plaza Norte · Día 2 ⚙"), and its own ambient-total row (~50 characters, "Hoy: $850 · 6 ventas [ Cerrar jornada de venta ]" — the exact row `home.md`'s own 2026-08-14 review already flagged and accepted, with a standing `ui-designer` legibility-verification caveat, not a redesign). No line in this redesigned banner is longer than that already-accepted 50-character benchmark, on the very same composed screen — this fix doesn't introduce a new worst case, it stays inside one the product already lives with, and carries that same caveat forward rather than assuming it's fine by inertia.
- **Citation corrected (2026-08-18, `ux-critic` MIN2), and no longer load-bearing.** An earlier draft cited `home.md §3.7`'s header as in-family precedent for "one header area, two independent affordances," describing it as "one row" — it is actually already two lines (the gear icon ⚙ sits on the title row; "Cerrar jornada de venta" sits alone on the ambient-total row below it). That citation is corrected here for accuracy, but it no longer justifies this banner's structure anyway: `home.md §3.7`'s two lines each carry an equally-weighted, independently important affordance — Configuración and closing the selling day are both real actions Ana needs equal, undifferentiated access to — the opposite of what this banner needs, where exactly one of its two rows must read as clearly secondary. This design is justified on its own terms (bullets above), not by equal-weight precedent.
- **Copy reuses this document's own already-approved "Cuéntanos" register (§3.3)** — an offer in Nahui's voice, true regardless of when she taps it. An earlier draft tried a first-person-declarative label ("Ya terminé — ir al cuestionario," her tap-to-declare-herself-done), but `brand-guardian` found it made a claim that's often untrue given this banner's own any-point, repeat-access design (§2.3/§1) — a participant checking the questionnaire mid-session, not actually "done," would be tapping words that misdescribe her own intent. Reverted to the offer construction instead (§10).
- **Tapping row 1 opens the Google Form (`https://forms.gle/ZZhtJEfee3viWY1h8`) in a new browser tab** — her current demo screen is untouched and stays exactly where she left it. She can tap it again later in the same session; re-opening an already-completed public Form is harmless.
- **Tapping the "Reiniciar demo" control (row 2's corner element, not a standalone row) opens the confirmation dialog (§3.7)** — see §2.4 for the full resolution logic. Tap target, destination, and dialog are unchanged from the prior draft; only its shape/position within the banner changed.
- **No dismiss control on either row, ever** — see §10 for why that's deliberate, not an oversight.
- **Identical on every screen it renders on, every time** — no progressive states, no "you already tapped this" acknowledgment, no post-tap visual change on row 1. Row 2's restart control always opens the same confirmation dialog, never a stateful variant.
- **Exactly one named exception, both rows: does not render on `home.md §3.8f`** (Finalizar Venta success — the full-viewport digital receipt) — see §2.3 check 2 for the full reasoning. Renders identically, per every rule above, on every other screen, including every other header-less state (`home.md §3.12` included — its own header-less layout is for an unrelated, non-customer-facing reason and gets no exception).
- **Flagged for `ui-designer`:** within this already-differentiated structure (row 1 full-width dominant CTA; row 2's small corner tap target sharing a line with passive text), execute the size/weight so "Reiniciar demo" reads unmistakably as a minor utility control, never mistaken for a second primary action — the same care already given to this banner's own no-dismiss-control decision. The shape differentiation itself is no longer this flag's concern (resolved at this layer, `ux-critic` M2); only its pixel-level execution is.

**Composed onto three different Merchant Application screens, purely to illustrate — the screens themselves are unmodified, cited by canonical ID, never redescribed here** (per this folder's own "shared states across diverging branches" convention):

**Composed onto `authentication.md §3.1` (phone-number entry):**
```
┌───────────────────────────────┐
│ [ Cuéntanos tu opinión — cuestionario ] │
│  (8-12 min)            [ Reiniciar demo ] │
├───────────────────────────────┤
│   (authentication.md §3.1's own screen,     │
│    unmodified — phone-number entry)          │
└───────────────────────────────┘
```

**Composed onto `home.md §3.4` (Idle — no Event today, ready):**
```
┌───────────────────────────────┐
│ [ Cuéntanos tu opinión — cuestionario ] │
│  (8-12 min)            [ Reiniciar demo ] │
├───────────────────────────────┤
│  Nahui                        ⚙ │
│        ¿Vas a vender hoy?       │
│   [   Iniciar Sesión Rápida  ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```

**Composed onto `home.md §3.7` (Session active — ready, no Sale open; the busiest active-Session header state — added 2026-08-18 to verify vertical-chrome stacking against this state specifically, not just the lighter states above):**
```
┌───────────────────────────────┐
│ [ Cuéntanos tu opinión — cuestionario ] │
│  (8-12 min)            [ Reiniciar demo ] │
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
**Chrome accounting, corrected and made explicit (fixed 2026-08-18, `ux-critic` M1 — a real space-budget answer, not just an overlap check).** Six horizontal bands stack above and including the registration surface's own container on this, the busiest composed example: banner row 1, banner row 2, header title row, header ambient-total row, the registration surface itself, and the bottom nav bar. That total line count is unchanged from the flawed two-full-width-row draft this replaces — what changed is composition, not count: banner row 2 is now a slim, asymmetric line (short time-estimate text plus a small corner control) rather than a second full-width tappable band carrying the same visual weight as row 1. Character-length accounting for every non-task line above "Venta actual" is in the space-budget bullet above — none exceeds the ~50-character benchmark `home.md`'s own 2026-08-14 review already flagged and accepted (with a standing legibility-verification caveat) on this exact screen. Still no overlap: the banner adds exactly two strips above everything else; it doesn't compress, hide, or crowd the gear icon, "Cerrar jornada de venta," or the nav bar underneath. **Re-flagged for `ux-critic`'s explicit re-verification against this specific example**, given the row 2 restructuring — not assumed fixed by description alone.

### 3.7 Reiniciar la demo — confirmar (added 2026-08-18)
```
┌───────────────────────────────┐
│ (pantalla actual)               │  dimmed, still visible underneath
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │ ¿Reiniciar la demo?          │ │
│  │ Se borra todo lo que          │ │
│  │ registraste — tu negocio,      │ │
│  │ tus productos, tus eventos,     │ │
│  │ tus ventas — y vuelves a la     │ │
│  │ pantalla de bienvenida.         │ │
│  │  [ Cancelar ] [ Sí, reiniciar ] │ │
│  └───────────────────────────┘ │
└───────────────────────────────┘
```
Reuses `home.md §3.11`'s dimmed-sheet-over-current-screen convention. Copy direction is the mirror image of `settings.md §3.8`'s "Cerrar sesión" dialog — that one reassures nothing is lost; this one plainly states everything demo-related is lost, since it genuinely is. States the fact before the choice, per `tone-of-voice.md`'s "state facts before offering an opinion." **Deliberately no interlock** like `home.md`'s Sale-in-progress block on "Cerrar jornada de venta" — nothing this dialog discards is ever real, registered business data (§1's own framing), so there's nothing analogous to protect. **One accepted, low-probability edge case, not specially guarded against:** tapping "Reiniciar demo" while a Merchant-Application-owned confirm dialog (e.g. `home.md §3.11`'s own "¿Ya terminaste por hoy?") happens to already be open underneath would visually stack two dimmed sheets — the same posture this document already takes toward the banner's own inability to detect Form completion (§1): a named, accepted limitation, not a defect to design around. **List corrected (2026-08-18, `ux-critic` MIN3):** the original list named "tu negocio, tus productos, tus ventas" but omitted Eventos created during the session, which §2.4's full, content-blind clear also discards — now named explicitly, keeping this exact dialog accurate as the document's own cited example of "stating facts precisely."

### 3.8 Reiniciando — falla defensiva (added 2026-08-18)
```
┌───────────────────────────────┐
│  No pudimos reiniciar la demo.   │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Identical shape to §3.5, applied to the write side instead of the read side — same class of failure (storage access throwing in a restrictive browsing context), same "Reintentar," no live-customer risk to justify anything heavier.

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
  render while home.md §3.8f is active (§2.3 check 2). It now has two
  independent interactive zones (added 2026-08-18):
    Tap row 1 (questionnaire) → opens
      https://forms.gle/ZZhtJEfee3viWY1h8 in a new browser tab. The
      demo's own current screen is untouched and remains exactly
      where she left it.
    Tap row 2 ("Reiniciar demo") → confirm dialog (§3.7)
        → Cancelar → back to exactly where she was, untouched
        → Sí, reiniciar → clears both storage keys → forces a full
            reload → clear succeeds → reload runs §2.1 fresh,
              unchanged → resolves to §3.3 (Bienvenida a la demo),
              identical to a brand-new device
            → clear itself fails outright → defensive fallback
              (§3.8), Reintentar, no reload attempted
  No other branches exist for either zone.
```

---

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Bienvenida a la demo (fresh or resumed — identical)
4. Falla defensiva — no se pudo determinar si ya se mostró
5. Recordatorio del cuestionario (§3.6) — **not a mutually-exclusive state like 1-4 above; a persistent overlay coexisting with whichever of every other Approved document's screens is currently active, for the entire `pass-through` duration.**
6. Reiniciar la demo — confirmar (§3.7)
7. Reiniciando — falla defensiva (§3.8)

---

## 6. Minimum step count

| Scenario | Taps to handoff | Why it can't be fewer |
|---|---|---|
| First time on this device, Demo Mode build | **1** (Empezar demo) | Auto-advancing would defeat the screen's purpose — same reasoning `onboarding.md §3.4c` gives its own no-auto-continue screen. |
| Already acknowledged on this device | **0** — never shown again | Direct consequence of §2.1 check 2's silent pass-through — "never ask twice," applied even to a non-domain fact. |
| Not a Demo Mode build (production) | **0** — screen doesn't exist | No code path at all in production. |
| Reaching the questionnaire from anywhere in the session | **1** (tap the reminder banner) | Previously required remembering a link she may never have seen render tappable inside the ad itself. Now always one tap away, from wherever she already is, no recall required. |
| Restart demo, from anywhere in the session | **2** (Reiniciar demo → Sí, reiniciar) | Same 2-tap floor as every other real, deliberately-asked commitment in this project (`home.md`'s "Cerrar jornada de venta," `settings.md`'s "Cerrar sesión") — a genuinely destructive action gets one real confirming tap, nothing more. |

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
8. **New, flagged for Architecture Review — restart mechanism (added 2026-08-18; softened 2026-08-18, `reviewer` finding).** Where the "clear both keys, then reload" function lives (a new small module, or an addition to `demoModeStorage.ts` despite that module's own established single-key responsibility) is an implementation-shape question, not resolved here. Confirmed by direct inspection of `main.tsx`: `<StoreProvider>` mounts **above** `<DemoModeGate>` in the component tree — an in-app `gate` state transition alone would not remount the gate itself. **Correction:** this doesn't make "clear storage, then reload" the *only* possible mechanism — `store.tsx` already exports a working, currently-unused `resetPrototype()` that could flush the domain store without a reload — only the *simpler, chosen* one, since reload also resets `DemoModeGateActive`'s own local `gate` state, which `resetPrototype()` alone would not. `ui-designer` should treat the chosen mechanism as settled, not re-litigate it, but the exact module placement is still open for Architecture Review's own call. **New flag for Architecture Review:** consider whether the restart implementation should reuse `store.tsx`'s existing exported storage-key constant (if one exists) or export one, rather than a fresh hardcoded `'nahui-hifi-prototype-v1'` string literal here and in §2.4 — a literal that could silently drift from `store.tsx`'s own private `STORAGE_KEY` if ever renamed.

8. **New, flagged for Architecture Review — restart mechanism (added 2026-08-18).** Where the "clear both keys, then reload" function lives (a new small module, or an addition to `demoModeStorage.ts` despite that module's own established single-key responsibility) is an implementation-shape question, not resolved here. Confirmed by direct inspection of `main.tsx`: `<StoreProvider>` mounts **above** `<DemoModeGate>` in the component tree — an in-app `gate` state transition alone would not flush the already-hydrated domain store, only a genuine full reload does, which is why §2.4 specifies "clear storage, then reload," not an in-app transition. `ui-designer` should treat this as confirmed, not re-litigate it, but the exact module placement is still open for Architecture Review's own call.

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
- *#6 (dependency direction)* — not applicable to the welcome screen or the reminder banner, both of which read and write nothing in the domain model. **Restart is a narrower exception (added 2026-08-18):** its clear operation does write to `nahui-hifi-prototype-v1`, `store.tsx`'s own `AppState`-mirroring storage key — but it's a content-blind clear, never a read or interpretation of any Business/Session/Sale field (§2.4, §8 item 8), the identical distinction already drawn for principle #7's own citation below. No dependency-direction violation: nothing is derived from, branches on, or reacts to domain content — the key is simply removed, wholesale.
- *#7 (idempotent/keyed retries)* — the "Empezar demo" CTA tap does write (the acknowledgment flag, §2.2), but #7 doesn't apply because that write is a boolean set, naturally idempotent by construction (setting `true` twice is a no-op), not because no write occurs — see §8 item 2's own precision correction. §3.5's defensive fallback "Reintentar" re-runs the same read-only local check, with no duplication risk to guard against.

**brand-guide.md / tone-of-voice.md:**
- Tone — "warm, direct, respects the vendor's intelligence" — states plainly what's fictitious and what won't happen (no real SMS) before she types anything, frames critical feedback as equally valuable to praise.
- *tone-of-voice.md, "state facts before offering an opinion"* — the three operational bullets precede the feedback-framing sentence. §3.3's new closing sentence (added 2026-08-18) states the fact — a way to share her opinion will appear — before she's asked to form any opinion about the demo itself, and before §3.6's banner appears at all: the expectation is set, not sprung.
- *tone-of-voice.md, "suggestions read as offers, not instructions"* (added 2026-08-18) — the reminder banner's copy ("Cuéntanos tu opinión — cuestionario") reuses §3.3's own already-approved offer register, true regardless of when she taps it. `brand-guardian` also corrected the initial reasoning here: an earlier first-person-declarative draft was defended under this same citation, but the rule actually targets narrative-suggestion copy, not standard button-label imperatives — the existing in-family CTAs (`Empezar demo`, `Reintentar`) were never in tension with it to begin with.
- **A deliberate, named exception to *"technology should disappear"*, added 2026-08-18.** That principle generally argues for minimal, receding UI — the opposite of an always-visible banner. The exception is grounded in this document's own §1 Scope framing: this is *validation-campaign infrastructure*, not a Merchant Application UI pattern, so the general minimalism bar this project holds real merchant-facing screens to doesn't govern it the same way. The banner exists because the alternative — a genuinely lost primary success metric on live ad spend — is a worse outcome than one unobtrusive, non-blocking strip for the campaign's short duration.
- **Flagged, not asserted as settled:** this screen addresses a validation participant, a relationship this document family hasn't spoken to before. Recommending a `brand-guardian` consultation before this copy is final — see §8.5. The 2026-08-18 reminder banner (§3.6) was reviewed on this same basis — its first draft tried a first-person-declarative pattern new to this family, `brand-guardian` found it a Major (a truth claim often false given the banner's own repeat-tap design) and it was reverted to the already-approved "Cuéntanos" offer register instead.
- **Cross-document consistency (added 2026-08-18).** The `home.md §3.8f` exception (§2.3 check 2) protects a privacy/trust reasoning `home.md` itself already justifies in full (HOME-B3) — this document doesn't re-derive that reasoning, only respects it by not compositing onto that one screen. Consistent with this document's own posture of citing sibling documents' precedent rather than inventing a parallel rule.
- **(Added 2026-08-18, restart feature) "Never ask twice"** — restart is a second, deliberate exception, alongside `home.md`'s own close-session confirm, to a rule this project otherwise holds strictly.
- **(Added 2026-08-18) architecture-principles.md #7** — the storage clear is idempotent by construction (clearing twice is a no-op), same reasoning §8 item 2 already applied to the acknowledgment flag.
- **(Added 2026-08-18) brand/character-bible.md, "Gives her an honest way out of anything — no dead ends, no forced commitments"** — the direct rationale for restart existing at all. §3.3 deliberately has no back arrow because there's nothing to escape from at that point; once she's deep into the demo, "no dead ends" now applies to the whole session.
- **(Added 2026-08-18) tone-of-voice.md, "state facts before offering an opinion"** — the restart confirm dialog (§3.7) states what will be lost before asking for confirmation.

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
- **(Added 2026-08-18, onboarding restructuring) §3.3's reason clause softened from "tu opinión decide qué construimos después" to "tu opinión nos ayuda a decidir qué construimos después"** — Product Owner-requested, avoiding the implication that a single response determines the roadmap.
- **(Added 2026-08-18) "Último paso"/"Paso final" evaluated and rejected for the banner label** — carries the same context-blindness that sank the earlier "Ya terminé" draft (a static, unconditionally-shown label can't verify it's actually the last step from wherever she's standing), and would contradict §3.3's own "no es un paso aparte" framing. A real time estimate ("8-12 min") was added instead, addressing the same underlying concern (the ask reading as skippable) without a false sequence claim.
- **(Added 2026-08-18) Restart's trigger lives in the persistent banner (§3.6), not on §3.3 itself** — resolves the placement tension by separating "where she taps" from "where restart takes her." §3.3 can't host it (the screen never shows again once acknowledged); Settings can't host it (a real Merchant Application screen, out of bounds per D48).
- **(Added 2026-08-18) Restart mechanism is "clear both storage keys, then force a full reload," not an in-app state transition** — the only version that's actually correct given `StoreProvider`'s mounting position above `DemoModeGate` in `main.tsx` (confirmed by direct inspection, §8 item 8).
- **(Added 2026-08-18) No change to §2.1's decision logic for restart** — it reuses the existing, unmodified resolution path by clearing the exact fact that path already keys off of.
- **(Added 2026-08-18) No interlock on restart** (contrast with `home.md`'s Sale-in-progress block on "Cerrar jornada de venta") — nothing restart discards is ever real merchant data, since everything in this document's own scope is fictitious by design (§1).

---

## 11. Future considerations

- A persistent in-app "estás en modo demo" indicator, if a future campaign runs long/multi-session enough that participants lose track — not evidenced as needed yet, flagged only.
- A demo-mode-specific feedback capture mechanism embedded in the product itself — not requested by the Product Owner's brief; feedback capture is presumably a moderator/facilitator-side concern for this campaign.
- Whether this document is retired/archived once the validation campaign concludes, given its explicitly disposable, campaign-scoped nature — a repository-stewardship question for Main, not a design question.
