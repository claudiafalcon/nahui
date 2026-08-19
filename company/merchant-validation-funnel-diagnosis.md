# Nahui — Acquisition-to-Questionnaire Funnel Diagnosis (2026-08-19)

**Status: diagnosis only. Nothing here is authorized to be built, published, or sent.** Prepared by `marketing` at the Product Owner's direct request. This is a validation-process/instrumentation diagnosis, not a product analysis — its job is to say precisely what we know, what we don't, and where the uncertainty in the 423-views/3-responses collapse is actually concentrated, not to propose fixes beyond the minimum needed to close each stage's own evidence gap.

**Companion documents, referenced not duplicated:**
- `company/merchant-validation-strategy-v2.md` §13/§13.5 — the existing diagnosis of the prototype→Forms transition specifically, with its own four-step breakdown (reached the banner? tapped it? opened the Form? completed it?) and its own honest conclusion that the transition-cost and content-length hypotheses remain indistinguishable with current data. This document is broader — the full ad-impression-to-completed-questionnaire chain — and maps its own stages onto §13.5's four explicitly (see the cross-reference table at the end), rather than restating that section's reasoning.
- `company/merchant-validation-campaign-meta-ads.md` §9 — the Learning Agenda (Hypotheses A-E/"H5"), whose falsifiable-hypothesis shape and evidence-threshold language this document reuses stage-by-stage rather than inventing new statistical framing.
- `company/merchant-validation-decision-matrix.md` — the "default threshold convention" (a pattern recurring in 3+ of a first batch of 10 respondents logs as a candidate signal; the same pattern holding at a second batch of 10, n≥20, escalates it toward confirmed) — reused wherever a stage's "smallest experiment" below produces that shape of evidence.
- `company/merchant-validation-strategy-v2.md` §12 — the architecture evaluation confirming no backend, no pixel, and no `api/`/`vercel.json` exist anywhere in the prototype's repository. This diagnosis takes that finding as settled and does not re-litigate it.

**Sample size, stated honestly up front and held throughout:** 423 landing-page views, MXN $419.64 spent, MXN $0.99 cost per view, 3 total questionnaire responses (2 genuine independent respondents + Ana, who is excluded from any "the funnel works" read). This is a diagnosis of what is *unknown* about the gap between those two numbers — not a set of findings dressed up as conclusions.

---

## 0. Two framing corrections, stated directly before anything else

**1. A landing-page view does not prove the ad is "working."** Meta defines Landing Page Views as a click that resulted in a page actually loading — nothing more. It proves three things: the ad was delivered, someone tapped it, and `demo.nahui.app` finished loading in their browser. It proves nothing about whether the creative or targeting resonated with a real itinerant vendor rather than a curious scroller, a bot, or someone outside the actual ICP; nothing about whether she did anything after the page loaded; and nothing about message-market fit. `merchant-validation-campaign-meta-ads.md` §1 chose Landing Page Views as the optimization goal specifically because it's "a closer proxy for 'she actually arrived'" than raw clicks — a proxy, not a success measure. 423 is real evidence the ad reached people and their browsers rendered the page. It is not evidence the ad is doing its job in any sense beyond that.

**2. The current data cannot support "the questionnaire is the bottleneck," and a concrete equally-consistent alternative exists.** The 423→3 collapse could just as easily be explained by most of the 423 never finishing Onboarding — a stage with zero instrumentation, no relationship to the Form or the banner at all, and (per `merchant-validation-strategy-v2.md` §0) at least one on-file anecdote of a genuine respondent stalling somewhere in the early prototype before ever reaching a point where the questionnaire becomes relevant. Stage 4 through Stage 7 below (prototype start through reaching the banner) are, collectively, exactly as plausible a full explanation for the 420 non-respondents as anything Form-side — the data on hand cannot currently rule either explanation in or out, and this document treats them as equally live until instrumentation says otherwise.

---

## 1. The instrumentation baseline — stated once, applied throughout

Three distinct, unrelated root causes explain every "no instrumentation exists" line below. Naming them once here avoids repeating the same explanation eleven times without saying why it recurs.

- **Root cause A — the prototype has no URL-based routing.** Confirmed directly against the codebase (no `react-router`, no `BrowserRouter`, no route-based navigation anywhere in `product/02c-high-fidelity-prototype/src/`) and by live browser verification (the URL stays at `https://demo.nahui.app/` through every screen transition — Authentication, Onboarding, Home, selling flow, all of it). Because of this, Vercel's automatic page-view tracking (`<Analytics />`, mounted unconditionally in `src/main.tsx` for both `nahui.app` and `demo.nahui.app`) can register only **one pageview per demo session load** — it has zero visibility into which screen a participant reached, how long she stayed, or where inside the single-page app she stopped. This is Root Cause A for every stage between "the page loaded" and "she tapped the CTA."
- **Root cause B — Google Forms' free tier reports completed responses only.** No partial/abandoned-response visibility, no source/referrer field on the Form itself. This is Root Cause B for the two Form-side stages (starting, completing).
- **Root cause C — exactly one custom client-side event exists, and it started counting only this session.** `demo_questionnaire_cta_click`, fired from `product/02c-high-fidelity-prototype/src/screens/DemoMode/ReminderBanner.tsx` on a tap of the banner's questionnaire row, added in this session's final build. It has zero historical data against the 423 views already collected — it only starts counting forward from this point. This explains why the one stage with any real instrumentation still can't retroactively explain anything about the numbers already in hand.

No backend, no Meta Pixel, no server-side event logging exists anywhere in this project (`merchant-validation-strategy-v2.md` §12, confirmed against the repo directly: no `api/` directory, no `vercel.json`). Every instrumentation option below that isn't already live is evaluated against this same constraint — nothing proposed here quietly reintroduces a backend to answer a marketing question.

---

## 2. Stage-by-stage breakdown

### Stage 1 — Ad Impression / Delivery

1. **Hypothesis:** the ad is actually being delivered to real, relevant people within the targeted CDMX/Estado de México audience, at a volume sufficient to plausibly generate 423 landing-page views without requiring an implausibly high click/load rate.
2. **Evidence we have:** spend (MXN $419.64) and resulting landing-page views (423) and CPV (MXN $0.99) are known. Reach, raw impressions, frequency (how many times the same person saw it), and placement/demographic breakdown are not part of the numbers supplied to this diagnosis.
3. **Evidence still missing:** actual Reach and Impressions counts; frequency (a high frequency with flat response volume would suggest the same small pool of people seeing the ad repeatedly, not fresh reach); age/gender/placement breakdown, to sanity-check delivery actually matched the intended 22-60, CDMX+Edomex targeting rather than drifting via Advantage+ expansion into an unrelated population.
4. **Instrumentation that already exists:** Meta Ads Manager's native reporting — Reach, Impressions, Frequency, CPM, placement and demographic breakdowns are all standard, zero-cost fields already available for this campaign; none of them require anything to be built.
5. **Smallest experiment:** pull the full native Ads Manager report for the campaign window (Reach, Impressions, Frequency, placement/demo breakdown) — a data-read, not a new build. Compare Frequency against Reach: a low Reach-to-Frequency ratio (many repeat impressions on few people) would materially change how the 423 views should be read.

### Stage 2 — Ad Click

1. **Hypothesis:** people who saw the ad clicked through at a rate consistent with the creative and targeting actually being compelling to the intended audience, not merely tolerated or accidentally tapped.
2. **Evidence we have:** none directly — CTR and raw Link Clicks are not part of the numbers supplied to this diagnosis; only the downstream Landing Page View count (423) is known.
3. **Evidence still missing:** CTR, Link Clicks, and the ratio of Link Clicks to Landing Page Views (a large gap between the two would indicate clicks that never resulted in a successful page load — a technical or connectivity issue, not a message or targeting one).
4. **Instrumentation that already exists:** Meta Ads Manager reports Link Clicks and CTR natively for any Traffic-objective campaign — already collected, not yet pulled into this diagnosis.
5. **Smallest experiment:** pull CTR and Link Clicks from Ads Manager and compute the Click-to-Landing-Page-View ratio. A CTR at or above typical Traffic-campaign benchmark ranges with a healthy Click-to-LPV ratio would support the creative/targeting; a low CTR despite real reach would be the same "message/creative diagnostic" signal `merchant-validation-campaign-meta-ads.md` §7 already names for this metric.

### Stage 3 — Landing Page Load

1. **Hypothesis:** the 423 counted views represent real, successful loads of `demo.nahui.app` (not bot/farm traffic inflating Meta's count, and not a meaningful share of failed/partial loads counted anyway).
2. **Evidence we have:** 423 is Meta's own count of a page actually finishing its load — by Meta's own definition, this is the most trustworthy number in the entire funnel, since "did the page load" is exactly what the metric is built to measure.
3. **Evidence still missing:** whether Meta's 423 is corroborated by an independent, non-Meta-controlled count of real page loads; whether any share of loads hit an error state (`demo-mode.md`'s own `DemoLoadError` fallback) with no telemetry on how often that fires.
4. **Instrumentation that already exists:** `@vercel/analytics`'s single pageview-per-session-load event, mounted unconditionally, already fires independently of Meta's own count — this has simply never been cross-checked against the 423 figure.
5. **Smallest experiment:** pull Vercel Analytics' own pageview count for `demo.nahui.app` over the exact campaign window and compare it against Meta's 423. A close match corroborates 423 as real, successful loads; a materially lower Vercel count would be evidence of ad-fraud/bot inflation or failed loads Meta still counted. This is a free, read-only cross-reference of two data sources that already exist — no new instrumentation required.

### Stage 4 — Prototype Engagement Start (does she proceed past the Demo Mode welcome screen at all)

1. **Hypothesis:** of those whose page successfully loads, a meaningful share tap through the welcome screen and actually start the demo, rather than reading it and leaving, or being confused by the "Modo demo" framing itself before ever engaging with the product.
2. **Evidence we have:** none. No count, of any kind, exists for "started the flow" versus "loaded and left."
3. **Evidence still missing:** any completion/progression signal at all for this stage.
4. **Instrumentation that already exists:** none — Root Cause A. This is the first of four consecutive stages (4 through 7) with total instrumentation blindness for the same structural reason: no routing means no way to observe in-session progression short of a dedicated event on each transition.
5. **Smallest experiment:** the only viable option compatible with the no-backend constraint is a client-side `track()` call (the same `@vercel/analytics` mechanism already proven out for the CTA-click event) fired when she taps past the welcome screen. **This is a product/UX code change — it touches Demo Mode screen components — and must be flagged for the standard `ux-designer`/`architect` pipeline before it is built. It is not authorized by this diagnosis.**

### Stage 5 — Authentication / OTP Completion

1. **Hypothesis:** participants who start the demo successfully complete Authentication (enter any 6-digit code and proceed) without getting stuck — specifically, that no comprehension gap remains for this specific paid cohort now that the original OTP-disclosure bug (fixed 2026-08-16, per `merchant-validation-campaign-meta-ads.md`'s Background section) predates this campaign's entire run.
2. **Evidence we have:** only an indirect, confounded anecdote — the pre-fix organic cohort's own stall pattern, which that document's own Background section already names as unreliable evidence for anything post-fix. No data exists for this specific paid-campaign cohort at this specific stage.
3. **Evidence still missing:** any completion count or rate at the OTP screen for this campaign's actual traffic.
4. **Instrumentation that already exists:** none — Root Cause A, same as Stage 4.
5. **Smallest experiment:** same category as Stage 4 — a `track()` event on successful OTP submission (distinguishing "reached the screen" from "submitted successfully," ideally with a third state for "repeated/failed attempts" if that's cheaply available). **Flagged for the standard `ux-designer`/`architect` pipeline, not authorized here.**

### Stage 6 — Onboarding Completion (and which of the three paths: Empezar gratis / Activar plan de pago / Ver un ejemplo)

1. **Hypothesis:** participants who reach Onboarding actually complete one of the three paths (rather than abandoning mid-flow at, for example, catalog entry, the "Ver un ejemplo" confirmation gate, or the "Creando tu negocio" write state), and a meaningful share choose "Ver un ejemplo" specifically — the path best suited to a first-time stranger with no real catalog to enter, since it skips manual catalog/business-identity entry (`product/02-ux/onboarding.md` §2.2a/§3.4c).
2. **Evidence we have:** only the two genuine respondents' post-hoc self-reports in the questionnaire's task-completion section — n=2, and by definition limited to the tiny share of the 423 who eventually completed the Form, telling us nothing about the 420 who didn't reach it.
3. **Evidence still missing:** onboarding completion rate for this campaign's actual traffic; the distribution across the three paths; where within Onboarding any abandonment concentrates.
4. **Instrumentation that already exists:** none — Root Cause A, same as Stages 4-5.
5. **Smallest experiment:** same category — a `track()` event on successful Business-creation write (Onboarding §3.5's atomic write completing), tagged with which of the three paths was taken. **Flagged for the standard `ux-designer`/`architect` pipeline, not authorized here.**

### Stage 7 — Reaching `pass-through` / the Banner Becoming Visible

1. **Hypothesis:** participants who complete Onboarding actually reach a screen where the persistent Form-reminder banner is rendered and visible on their device — i.e., no rendering failure or viewport issue suppresses it despite the code guaranteeing it structurally.
2. **Evidence we have:** a structural guarantee from the code itself (`ReminderBanner.tsx`'s own documentation confirms the banner mounts for the entire `pass-through` duration, with one deliberate exception — the full-viewport digital-receipt screen) — not measured behavior, a code-level assertion about intended behavior.
3. **Evidence still missing:** any confirmation, from a real device in the field, that the banner actually rendered as intended — a rendering or viewport edge case could theoretically suppress it despite passing code review.
4. **Instrumentation that already exists:** none — Root Cause A. This is the last of the four consecutive zero-visibility stages (4 through 7).
5. **Smallest experiment:** a `track()` "banner mounted" impression event, distinct from the existing tap event — combined with Stage 8's already-live click event, this would split "reached the banner but didn't tap" (a motivation/framing question) from "never reached the banner at all" (a stage-4-through-6 completion question). **Flagged for the standard `ux-designer`/`architect` pipeline, not authorized here.**

### Stage 8 — Tapping the Banner CTA

1. **Hypothesis:** of those who reach the banner, a meaningful share tap the questionnaire row, rather than continuing to explore the prototype and never tapping.
2. **Evidence we have:** the `demo_questionnaire_cta_click` event exists and is live as of this session's final build — but it has zero historical data against the 423 views already collected; it only starts counting from this point forward.
3. **Evidence still missing:** any count to date; and, going forward, the true denominator this event needs to become a rate rather than a raw count — Stage 7's own banner-impression count, which does not yet exist.
4. **Instrumentation that already exists:** the one genuinely live, forward-looking piece of instrumentation in this entire funnel — `track('demo_questionnaire_cta_click')`, firing in `ReminderBanner.tsx` alongside `window.open`.
5. **Smallest experiment:** no new build needed. Let traffic continue (this campaign's remainder, or the next wave) and read the Vercel Analytics custom-event count for `demo_questionnaire_cta_click` afterward. Per the decision matrix's default threshold convention, treat the resulting pattern as a candidate signal once ≥10 new sessions are observable, and as approaching confirmed at n≥20 — the same convention `merchant-validation-campaign-meta-ads.md` §9 already applies to Hypothesis E ("H5"), which this event was built specifically to feed.

### Stage 9 — Opening the Google Form

1. **Hypothesis:** tapping the CTA reliably results in the Form tab actually opening and loading — not silently blocked by a popup blocker, and not bouncing off the Form's own unbranded landing moment (`merchant-validation-strategy-v2.md` §13.1's named visual/interactional discontinuity) before she ever sees a question.
2. **Evidence we have:** none. `window.open(...)`'s success or failure is not observed or logged anywhere; a popup blocker silently swallowing the call would look, in our data, identical to "she saw the CTA and chose not to tap it" (i.e., it would be invisibly folded into Stage 8's own count as a non-tap, when it's actually a tap that failed downstream).
3. **Evidence still missing:** confirmation the new tab actually opened; any signal distinguishing "tapped, opened, then closed immediately" from "tapped, blocked, never opened."
4. **Instrumentation that already exists:** none directly. The CTA click event (Stage 8) fires on tap, not on confirmed navigation; `window.open`'s return value (which is `null` when blocked) is not currently checked or logged.
5. **Smallest experiment, two options of different weight:** (a) a minimal code change checking `window.open`'s return value and firing a distinct `track()` event when it's falsy — flagged for the standard pipeline, not authorized here; (b) a zero-code alternative — a manual QA pass opening the CTA link on the actual device/browser mix Ads Manager's own device breakdown shows this audience is using, to sanity-check `target="_blank"` behavior isn't silently failing on a common configuration. Option (b) is available immediately with no approval gate beyond ordinary QA.

### Stage 10 — Starting the Form (answering the first question)

1. **Hypothesis:** of those who open the Form, a meaningful share begin answering rather than closing the tab immediately on arrival — i.e., the Form's own landing moment (generic Google branding, the "17 preguntas, 8-12 min" framing) doesn't by itself repel her before she reads a single question.
2. **Evidence we have:** none. Google Forms' free tier reports completed responses only.
3. **Evidence still missing:** any partial-response count; any signal distinguishing "opened and immediately closed" from "opened, read the first question, then left."
4. **Instrumentation that already exists:** none available under the current architecture — Root Cause B, a Google Forms platform limitation, not a routing gap. `merchant-validation-strategy-v2.md` §12 already evaluated and rejected the options that would surface this (Option B disqualified outright on reliability grounds; Option C1 judged a real but currently unjustified cost).
5. **Smallest experiment:** no instrumentation fix is available without reopening §12's already-settled architecture verdict. The only available lever is qualitative and survivorship-biased by construction: the short, optional self-report item strategy-v2 §13.5 already proposes ("¿qué tanto te costó pasar del prototipo al cuestionario?"), which samples only respondents who got past this exact stage — real color, not a measurement of the drop at this stage. Named as a known limit, not solved.

### Stage 11 — Completing the Form

1. **Hypothesis:** of those who start the Form, a meaningful share complete it rather than abandoning partway through — the content-length hypothesis `merchant-validation-strategy-v2.md` §11 already evaluates in full.
2. **Evidence we have:** 3 total completions on file (2 genuine independent respondents + Ana); the two genuine respondents' actual task-completion detail is documented in strategy-v2 §0. Neither of the two genuine respondents shows any sign of abandoning the Form itself once opened — both are recorded as completed submissions.
3. **Evidence still missing:** any completion *rate* at this stage, since the denominator (how many started, per Stage 10) is unmeasured; and, for anyone who might abandon partway, no visibility into which of the 17 questions is where they stopped.
4. **Instrumentation that already exists:** none — same Root Cause B as Stage 10.
5. **Smallest experiment:** already fully specified, not re-derived here — `merchant-validation-strategy-v2.md` §11's two-stage core (~7 questions)/optional-extended (~10-11 questions) restructure is exactly this stage's smallest experiment, a Product Owner decision already pending. The experiment itself is: run the restructured instrument against the next recruitment wave and compare core-only completion count against the current flat instrument's completion count. This document does not re-propose or re-argue that recommendation — it is referenced, per this project's "reference, don't duplicate" convention.

---

## 3. Cross-reference to `merchant-validation-strategy-v2.md` §13.5's existing four-step breakdown

§13.5 already named four unobserved steps within the prototype→Forms transition specifically. This document's Stages 1-6 are new (upstream of anything §13.5 addressed); Stages 7-11 map onto §13.5's four steps as follows:

| §13.5's step | This document's stage(s) |
|---|---|
| 1. Reached a screen where the banner/CTA is visible | Stage 7 |
| 2. Tapped the banner/link | Stage 8 |
| 3. Opened the Form; started answering vs. closed immediately | Stages 9 and 10 (split further here, since "opened" and "started answering" are technically distinguishable even though both are currently equally unmeasured) |
| 4. Of those who started, abandoned partway vs. completed | Stage 11 |

Nothing in §13.5's own conclusion changes here — this document confirms rather than revises it: the transition-cost and content-length hypotheses remain indistinguishable with current data, for exactly the reasons §13.5 already gives.

---

## 4. Where our uncertainty is greatest — ranked, not just listed

**Tier 1 — the largest unknown share of the 423→3 collapse: Stages 4 through 7 (prototype engagement start, Authentication/OTP, Onboarding completion, reaching the banner).** These four stages share Root Cause A (no routing) and have zero instrumentation each — but the reason they rank above every other tier isn't just "zero data," it's that they are **sequential and compounding**. A funnel is multiplicative: whatever fraction of the 423 is lost across four consecutive, entirely unmeasured stages directly caps how many people can ever reach Stage 8 (the one stage with any live instrumentation) or Stages 9-11 (the Form-side stages) at all. Even a Form-completion problem at Stage 11 that turned out to be severe could only ever explain a fraction of the total 420-person gap — bounded by however many people survived Stages 4-7 to reach the Form in the first place, a number this data cannot currently estimate at all. This is also the region of the funnel where a first-time, unassisted stranger — not Ana, an already-onboarded and previously-validated user — is asked to complete Authentication and a full Business-creation write with no guide beside the welcome screen's own copy; and it is the region an existing, if unconfirmed, anecdote (strategy-v2 §0's puzzle-vendor stall) already suggests contains real friction somewhere. This tier is where the next instrumentation investment (Stages 4-7's `track()` events, once routed through the standard pipeline) would resolve the most uncertainty per unit of effort.

**Tier 2 — partially measured, moderate uncertainty: Stage 8 (tap CTA — instrumented but with zero historical baseline and no denominator yet) and Stage 9 (Form open — a single, well-understood failure mode, `target="_blank"`/popup-blocker behavior, that a manual QA pass can bound cheaply without new instrumentation).**

**Tier 3 — genuinely unmeasured, but bounded by a known, narrower explanation: Stages 10-11 (Form start/complete).** These are Root Cause B, a well-understood platform limitation (not a mystery), and the thin evidence that does exist (both genuine respondents completed the Form once they reached it) offers at least an anecdotal — not statistical — reason not to assume this is where most of the loss concentrates, though n=2 is far too small to generalize.

**Tier 4 — reasonably well understood: Stages 1-3 (ad impression, click, landing-page load).** Meta Ads Manager gives real, native, already-collected reporting for all three; Stage 3 specifically can be cross-checked for free against Vercel Analytics' own independent pageview count, which no other stage in this funnel can claim.

**The direct answer to "is the questionnaire the bottleneck":** the data cannot currently support that conclusion. Tier 1 is a larger, more structurally plausible source of the 420-person gap than anything Form-side, precisely because it sits upstream of every other stage and nothing currently measures it at all.

---

## 5. Constraints acknowledged

This is a diagnosis, not a decision document. Every "smallest experiment" above that involves reading, pulling, or cross-referencing already-existing Ads Manager or Vercel Analytics data is available immediately, at no cost, with no approval gate beyond ordinary reporting. Every "smallest experiment" that involves adding a new `track()` event inside the Merchant Application/Demo Mode code (Stages 4, 5, 6, 7, and optionally 9) is explicitly flagged as requiring the standard `ux-designer`/`architect` pipeline before being built — this document does not authorize any of them. Stages 10 and 11 have no available instrumentation fix under the current architecture at all (per `merchant-validation-strategy-v2.md` §12's own settled verdict) and are named as known limits, not solved here. Nothing in this document modifies `company/backlog.md` or `product/02c-high-fidelity-prototype/BACKLOG.md`.
