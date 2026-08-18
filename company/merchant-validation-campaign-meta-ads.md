# Nahui — Meta (Facebook/Instagram) Ads Plan for Merchant Validation

**Status: Drafted, not executed. No Meta account has been touched, no ad has been created or published, no money has been spent.** This document is a planning/design deliverable the Product Owner will execute herself in Ads Manager — it does not require Marketing's Approval gate (`company/CLAUDE.md`), which governs Marketing touching a real external account directly; that isn't happening here. It does require her own explicit judgment before she publishes anything, same as any real advertising spend would.

**Purpose, stated plainly so it never drifts into an advertising deliverable:** this is a market-validation *experiment*, not a sales or awareness campaign. Its only job is to buy enough qualified reach to answer a question the organic attempt couldn't answer on its own: was low organic engagement a message problem, an audience problem, a reach problem — or something else entirely. Success is qualified questionnaire responses, never impressions, likes, or followers.

**Companion document:** `company/merchant-validation-campaign.md` — the organic campaign this plan follows. This document links to it rather than duplicating it. The questionnaire (Google Form, `https://forms.gle/ZZhtJEfee3viWY1h8`, Deliverable 3), the full incentive structure (Deliverable 4), and the four recommended screenshots (Deliverable 1c) all live there — read that document first if any of those specifics are needed; they are not restated in full here.

---

## Background — why this campaign exists, and a confound that changes how its results should be read

The organic recruitment attempt (`company/merchant-validation-campaign.md` Deliverable 1 — the recruitment post, its two channel tiers, the non-monetary incentive structure) got very little reach and engagement. On its own, that result is ambiguous: it could mean the value proposition doesn't land, the recruitment message doesn't land, or the post simply never reached enough of the right people. A small, controlled paid pulse is a more honest way to separate those explanations than guessing — it buys reach on purpose, using materially the same message, so a lift or a continued flatline actually says something about which explanation is more likely.

**A real confound, not previously known when the organic campaign was written, has to be factored into how that organic result is read from here on.** The live prototype (`demo.nahui.app`) had a genuine onboarding-blocking bug for the first stretch of the organic campaign: the Demo Mode welcome screen told participants "no real code will arrive" but never told them what to actually type at the OTP screen. Any 6-digit code works (e.g. `123456`) — `verifyOtp(phone, _code)` in `src/domain/store.tsx` accepts any input, the `_code` parameter is intentionally unused — but a participant reading "no real code is coming" had nothing to type and no way to know that. Some unknown number of organic respondents likely got stuck at that exact screen and silently gave up before ever reaching the prototype itself, let alone the questionnaire.

This was fixed and confirmed live on 2026-08-16 (`product/02-ux/demo-mode.md`'s own amendment history has the full record — one new operational bullet added to the welcome screen's §3.3 copy, reviewed clean by `ux-critic`/`reviewer`/`brand-guardian` the same day). The practical consequence: **the organic campaign's low-completion signal is genuinely confounded.** Whatever small number of responses did come in during the buggy window can't be cleanly separated into "didn't like the message/product" versus "got stuck at a screen that gave her no way forward." This isn't a detail to footnote once and forget — it changes how several sections below have to be read, most importantly the Decision Playbook (§8) and the Learning Agenda (§9), both of which name this explicitly rather than silently assuming the organic result was a clean read.

**What this means concretely for this paid campaign:** because this campaign runs entirely after the fix is confirmed live, its own completion data is *not* confounded the same way — which is exactly what makes it useful. A clean read here, compared against the organic campaign's confounded one, is itself a piece of evidence about how much the bug actually mattered (§9, Hypothesis C).

---

## 1. Campaign objective

**Recommendation: Traffic**, optimizing the ad set for **Landing Page Views** (not Link Clicks).

Meta's campaign objectives are structured under ODAX (Outcome-Driven Ad Experiences, adopted 2022-2023) and, as of a live check for this document, the objective picker in Ads Manager shows exactly six top-level options: **Awareness, Traffic, Engagement, Leads, App Promotion, Sales.** Older names like "Brand Awareness," "Reach," or "Catalog Sales" no longer appear as selectable top-level objectives — they now live as sub-options or optimization events inside these six. Confirm this against the actual screen when building the campaign, since Meta continues to iterate this menu.

**Why Traffic, specifically for this experiment, not generic best practice:**
- The two things this campaign needs someone to do are external actions — open `demo.nahui.app` and open the Google Form — neither of which happens inside Meta's own environment. **Leads** is built around native, in-platform conversion events (Instant Forms, click-to-message, click-to-call); it has no clean way to register "she filled out an external Google Form" as a tracked event without a pixel wired to the Form's own confirmation page, which Google Forms doesn't expose. Using Leads here would optimize for the wrong signal.
- **Awareness** and **Engagement** optimize for reach/recall or on-platform interactions (post reactions, video views, page follows) — neither drives toward an external click at all. Wrong tool for a campaign whose entire point is getting someone to leave Meta's app and go do something on two other sites.
- **App Promotion** and **Sales** don't apply — there's no app-store install event and no purchase event; this explicitly isn't a sales campaign.
- **Traffic**, optimized for **Landing Page Views** rather than Link Clicks, filters specifically for people whose click actually resulted in a page loading — a closer proxy for "she actually arrived at the demo or the Form" than a raw click count, which includes accidental taps and people who bounced before the page loaded. This is the correct optimization goal precisely because this campaign has no Meta Pixel installed on `demo.nahui.app` (it's a frontend-only prototype with no backend, per this campaign's own product-truth facts) — Landing Page Views is the best available signal without needing to install anything new.

---

## 2. Audience

**Recommendation: broad targeting with Advantage+ Audience enabled, not a narrow, heavily-stacked interest list.**

**Why broad, given the tiny budget — this is a deliberate call, not a default:** MXN $500 over 3 days is a small enough budget that Meta's delivery system has very little room to "learn" who responds well within a narrowly defined group before the campaign ends. Stacking multiple detailed-targeting interests with AND logic, or excluding aggressively, shrinks the pool of people Meta can show the ad to and typically raises cost-per-result at this spend level rather than improving it — the opposite of what a reach/targeting experiment needs. Meta's own current guidance leans toward broad audiences + algorithmic expansion for small-budget campaigns, for the same reason: the algorithm generally finds efficient delivery faster with more room to work, not less.

**Suggested settings:**
- **Age:** roughly 22-60. Wide enough to include both younger sellers and organizers in Ana's own age range (mid-40s, per the Merchant Experience Kit's field observation) without needlessly narrowing.
- **Gender:** All. Ana is a woman, but H1's own ICP criteria (`company/market-validation.md` §1, §2b) never state a gender restriction, and the Tier 1/Tier 2 channels already researched (organizer Pages, entrepreneurship groups) show mixed participation. Restricting to women only would roughly halve an already-thin reach without evidence that only women are eligible respondents.
- **Detailed targeting (as a soft signal, not a hard filter):** try a small handful of interest/behavior terms as you type them into the interest search box — e.g. "Pequeña empresa" / small business, "Emprendimiento," "Venta al por menor" / retail. Meta's available interest categories shift over time and don't reliably include a category as specific as "bazaar," so treat these as starting suggestions to try on-screen, not a guaranteed list — don't stack more than 2-3.
- **Advantage Detailed Targeting: ON** (Meta's current toggle name for letting the system expand delivery beyond the stated interests when it finds a better match) — the safety net for exactly this uncertainty, and standard current guidance for a small budget.
- **Exclusions:** none recommended beyond geography (§3). At this budget, over-exclusion is the more likely mistake than under-exclusion.

---

## 3. Geography

**Recommendation: Ciudad de México + Estado de México** (two region-level location entries, not a radius/pin selection — simpler and less error-prone for a first build).

**Trade-offs considered:**

| Scope | Trade-off |
|---|---|
| **All of Mexico** | Rejected. Wastes a meaningful share of an already-tiny budget on impressions far outside the geography this pilot can actually use — `company/market-validation.md`'s own pilot-candidate criterion 3 requires Edomex/CDMX-metro, and Deliverable 3's Q3 already screens for zone. A response from Cancún or Tijuana doesn't help this specific pilot, however genuine it is. |
| **Estado de México only** | Matches the Tier 1 organizer-channel geography (`merchant-validation-campaign.md` Deliverable 1d) most tightly, but excludes the one channel that already showed the strongest *organic willingness signal* found in research — `@sobreruedas.bazar` (Instagram), a CDMX-adjacent account that publicly invites vendors to reach out. It also narrows the population enough, at this budget, to risk under-delivery (the algorithm struggling to find enough people to show ads to efficiently within 3 days). |
| **CDMX + Estado de México (recommended)** | Matches `market-validation.md`'s own stated pilot-geography criterion exactly ("Estado de México / CDMX metro"), keeps the population large enough for healthy delivery at MXN $500/3 days, and covers both Tier 1 (Edomex organizer Pages/Groups) and Tier 2 (CDMX-adjacent) channel geographies already verified real in Deliverable 1d — without the waste of going national. |

Select "Ciudad de México" and "Estado de México" as two separate region entries in the location field — both are standard selectable regions in Ads Manager's location search, no custom radius drawing required.

---

## 4. Placements

**Recommendation: Advantage+ Placements (Automatic)**, not Manual.

For this specific combination — small budget, short 3-day window, a Traffic/Landing-Page-Views objective, and a first-time advertiser — automatic placement selection is the safer and more effective default:

- Manual placement selection only reliably outperforms Automatic once there's *placement-specific performance data to act on* (e.g., "Stories consistently costs less per landing page view for us than Feed"). None exists yet — this is campaign #1.
- A first-timer manually selecting placements is also the likeliest way to accidentally under-deliver: excluding an effective placement by mistake, or leaving in a low-quality one (Audience Network is the most commonly cited culprit for wasted spend on Traffic campaigns) without knowing it needs excluding.
- Advantage+ Placements lets Meta's delivery system find the cheapest available inventory across Facebook and Instagram Feed, Stories, Reels, and Search/Messages placements, which matters more at MXN $500 total than controlling exactly where the ad shows.

If she later wants more control (a second, better-informed round), Manual placement selection informed by this campaign's own placement breakdown report is the natural next step — not something to reach for on a first, small, time-boxed test.

---

## 5. Creative

### 5a. Message — reused from the already-approved recruitment copy, not rewritten

This campaign is testing reach and targeting, **not re-testing message-market fit on brand-new copy.** The ad's Primary Text is adapted directly from `merchant-validation-campaign.md` Deliverable 1b (the long-form, already `brand-guardian`-reviewed version, chosen over 1a because it already carries both links, exactly what this ad needs) — trimmed for Meta's practical length conventions, not rewritten from scratch. Deviations from 1b are named explicitly below.

**Primary Text (Spanish, ready to paste into Ads Manager):**

> Hola, somos Nahui 💛 Estamos construyendo una app para que vendedoras y vendedores de bazar lleven el control de sus ventas sin que eso les quite tiempo con el cliente. Todavía no está terminada — antes de seguir armándola, queremos platicar con quienes de verdad la van a usar.
>
> Te invitamos a probar una versión de prueba (unas pantallas, no la app completa) y a responder un cuestionario corto sobre cómo llevas tu negocio hoy — entre las dos cosas, calcula entre 18 y 26 minutos en total.
>
> Aquí tienes la liga al cuestionario, por si ya probaste el prototipo o prefieres empezar por ahí: forms.gle/ZZhtJEfee3viWY1h8
>
> No es una venta, no te pedimos dinero, y no compartimos tu información con nadie fuera de Nahui.

**Headline:** `Prueba el prototipo de Nahui`

**Description (link description, shown on some placements only):** `Para vendedoras y vendedores de bazar`

**CTA button:** **Más información** ("Learn More"). Considered and rejected: "Regístrate" ("Sign Up") — implies creating a real account, overstating the ask; "Contáctanos" — wrong register, this isn't a contact request. "Learn More" is the closest honest match to "come see what this is."

**Deviations from the approved 1a/1b copy, stated explicitly:**
1. **Shortened.** 1b's full paragraph structure is trimmed — the opening sentence about "todavía no está terminada" is kept (states the product-truth fact plainly, per brand voice), but the priority-list/pilot-candidacy explanation (1b's third and fourth paragraphs) is cut entirely from the ad itself. Reasoning: Meta ad primary text that runs long gets truncated behind "See More" on most placements, and the incentive-structure explanation is exactly the kind of nuance that's better read in full inside the Form's own closing text (which already carries it, per Deliverable 3/4) than skimmed in an ad caption. Nothing about the incentive structure is changed — it's simply not restated in the ad; anyone who opts in still gets the same accurate structure at Q16/Q17.
2. **Only one link is carried in the ad text (the Form), not two.** See §5b below for the full reasoning — this is the one structural change from 1b, made necessary by how a Meta ad's clickable destination works, not a message change.
3. **No monetary language added or implied** — unchanged from 1a/1b's existing discipline; nothing here goes beyond the already-approved non-monetary incentive structure (`merchant-validation-campaign.md` Deliverable 4).

### 5b. Destination — one clickable button, one plain-text link, reasoned through explicitly

A Meta ad has exactly one guaranteed-clickable destination (the Headline/CTA button, tied to one URL). This campaign needs two things to happen — trying the demo, and completing the Form — so this needed a real decision, not a default.

**Recommendation: the button/headline destination is `demo.nahui.app`; the Google Form URL appears as a second, plain-text link inside the Primary Text (shown above).**

Reasoning:
- **The demo is the lighter first ask.** Sending the button there, rather than straight to the Form, gives the cleanest possible top-of-funnel read: did a paid, reach-expanded audience even click through to try something, at all? That's the single most direct way to test whether the organic campaign's problem was reach, since it isolates click-through from every downstream step (demo completion, Form completion) that could fail for unrelated reasons.
- **The demo has no built-in hand-off to the Form.** `product/02-ux/demo-mode.md`'s own decision logic (§2.2) hands off directly into `authentication.md`'s existing flow and ends there — there's no designed screen inside the prototype that, on completion, points her toward the questionnaire. That's a real, honest gap, not something to quietly work around by inventing a new screen here — a product change is out of Marketing's remit (`company/CLAUDE.md`'s Product boundaries). Given that gap, the Form link has to live somewhere outside the demo for her to actually find it, which is why it's carried in the ad's own text.
- **Named limitation, stated plainly rather than glossed over:** a plain-text URL inside an ad's Primary Text is not guaranteed to render as tappable on every placement — Facebook Feed often auto-links it, Instagram Stories/Reels frequently do not. This is the same imperfect tradeoff the organic post (1b) already carries by listing two links in one message; this campaign isn't designed to solve that structural gap, only to test reach against the message that already exists. If a future round of this campaign is warranted, a minimal one-page bridge (two guaranteed-clickable buttons, demo first then Form) would remove this risk entirely — flagged here as a genuine improvement worth a Product Owner call for a *next* round, not something to build under this round's 3-day/MXN $500 constraints.
- **Add UTM parameters to the destination URL** using Ads Manager's own "Build a URL parameter" field under the ad's Tracking section (not hand-appended to the visible link) — e.g. `utm_source=meta&utm_medium=paid&utm_campaign=validacion_ago2026`. This costs nothing to set up and gives a clean way to distinguish paid-driven `demo.nahui.app` visits from organic ones later, even without a full analytics tool installed.

### 5c. Images

**Recommendation: a single image, not a carousel.** Two reasons, both specific to this campaign, not generic advice: a carousel implies several distinct features worth swiping through, which risks presenting Nahui as more built-out and finished than a validation-stage prototype honestly is — in tension with Product Truth. And a small budget doesn't earn the extra creative variance a carousel introduces; one clear image keeps this a clean single-variable test of reach/targeting, matching this campaign's own stated scope.

**Recommended image: Screenshot #2 from `merchant-validation-campaign.md` Deliverable 1c — `Selling` (buttons-mode grid, mid-sale).** Already the recommended second image in that document's own ordering, and the single most legible "here's the point" image at small ad-thumbnail size — the core value proposition (tapping a product to register a sale) in motion, shown as-is per that document's own instruction not to stage it with an impressive catalog.

**Deliberately not used here, consistent with 1c's own exclusion:** the NFC selling surface and the Paid-tier receipt QR — leading an ad with either risks implying a not-yet-proven capability is a finished, working feature.

**No new creative asset needed beyond what 1c already specifies** — this is genuinely a reach/targeting test, not a new creative-message test, so reusing an already-honest, already-reviewed screenshot is the right call rather than commissioning something new.

---

## 6. Budget

**Recommendation: Lifetime Budget of MXN $500, not Daily Budget**, with explicit Start and End datetimes spanning exactly 3 days.

**Why Lifetime Budget for this specific case:** the constraint stated is a hard-ish total cap ("approximately MXN $500 total"), not a per-day spend target. A Lifetime Budget tells Meta "spend exactly this much across this whole window, you decide the day-by-day pacing," which removes the overspend risk a Daily Budget carries (Meta's delivery system can spend up to roughly 25% over a given day's budget and even out over the campaign — fine over a longer run, but a real risk of drifting past MXN $500 over just 3 days). It also removes one manual step: no need to compute and enter a daily figure at all.

**If she prefers day-by-day visibility/control instead** (to be able to watch Day 1 and pause early if something looks wrong — a reasonable instinct given the OTP-bug history), Daily Budget of roughly MXN $165-170/day is the alternative — but pair it with an Account Spending Limit of MXN $500 in Billing settings as a hard backstop regardless of which option she picks, so a pacing surprise can never quietly exceed the intended spend.

**Learning-phase honesty, stated so she isn't confused by what Ads Manager shows her:** Meta's formal "exit learning phase" milestone generally needs roughly 50 optimization events per week per ad set — far more than this MXN $500/3-day test will generate. This campaign will very likely show "Learning" in Ads Manager for its entire run, and that's expected, not a sign of failure — this is a short reconnaissance pulse meant to generate a qualified sample cheaply, not a campaign designed to reach steady-state delivery efficiency.

**One ad set, not several.** Don't split the audience into multiple ad sets (e.g., separate CDMX and Edomex ad sets) — fragmenting an already-small budget across ad sets is one of the most common reasons a small campaign never gets enough delivery data to say anything useful. Keep one campaign, one ad set, one audience (§2/§3), one ad (§5).

---

## 7. Success metrics

Real metrics only — never impressions, likes, comments, shares, or follower counts in isolation.

| Metric | What it's for | How to read it |
|---|---|---|
| **Reach** | Sanity check only | Confirms the campaign is delivering at all. Never treated as success on its own. |
| **CTR (link click-through rate)** | Message/creative diagnostic | Very low CTR despite real reach suggests the creative/message itself isn't connecting, even before anything downstream is measured. |
| **Landing Page Views, split by destination** | The real top-of-funnel signal | This campaign has one guaranteed-clickable destination (`demo.nahui.app`, §5b) — Landing Page Views on that link is the cleanest available proxy for "people actually arrived." |
| **Cost per Landing Page View** | Efficiency check | Read alongside reach/CTR — a very high cost here at this budget usually means audience or creative, not a downstream problem. |
| **"Prototype starts/completions" — not directly measurable by Meta** | Named honestly as a real gap | `demo.nahui.app` has no Meta Pixel or analytics installed (it's a frontend-only prototype, no backend). Meta cannot report how many people who landed there actually completed a task. This is an accepted limitation for a 3-day test, not something to build infrastructure for under this timeline — flagged so no one mistakes its absence for a metric that was simply forgotten. |
| **Questionnaire completions (Google Form response count)** | The real, primary success metric | Cross-reference completions against the campaign's exact 3-day window by submission timestamp — the Form doesn't carry a source field, so a visible spike during the active window relative to whatever baseline organic traffic existed is the practical read. |
| **Q16 Sí / Tal vez / No split, reported separately** | Secondary adoption-intent signal | Per `merchant-validation-campaign.md` Deliverable 4's own tracking note — never blend these into one "opt-in %." |
| **Cost per qualified questionnaire completion** | The single most decision-useful number | MXN $500 ÷ completions. The clearest read on whether paid recruitment is worth repeating for future validation rounds. |

---

## 8. Decision playbook

For each likely outcome, what Product should conclude and do next — the OTP-bug confound (Background, above) is named explicitly wherever it changes the read.

**Before anything else: reconfirm the fix is actually live on the public URL, not just in a status document.** Do one manual walkthrough of `demo.nahui.app` end to end — including typing a random 6-digit code at the OTP screen — before spending a single peso. Cheap insurance against relaunching paid traffic into a still-broken funnel, given how badly the same defect class already hurt the organic campaign.

- **High CTR, few questionnaire completions.** The message and audience are working — people are curious enough to click. The break is somewhere between click and completion. Since this campaign runs entirely after the fix, the OTP-bug explanation is *ruled out* here — look instead at whether the drop-off is demo-side (prototype friction) or Form-side (the 17-question, 8-12-minute ask is real friction on its own). Don't shorten the already-reviewed Deliverable 3 instrument unilaterally; log this as a candidate finding for a future round.

- **Many demo landing-page views, few questionnaire completions.** Similar to above, but stronger evidence the demo itself isn't the blocker — people are arriving, the ask that follows (the Form) is where they stop. Directional signal that a future round should test a shorter or optional path, not a reason to change the current, already-approved instrument mid-flight.

- **Strong questionnaire completion, low pilot interest (Q16 skewed No/Tal vez).** Because this campaign already answered the reach question with real paid volume, a low Sí-rate here is *not* explainable as "we didn't reach enough people" the way it was for the organic attempt. Treat it as genuine signal on adoption intent (H1/message-market fit) — a real, unconfounded finding, not a recruitment-execution failure.

- **High pilot interest (many Sí).** A genuinely encouraging outcome — proceed into the existing merit-based pilot-selection process (`merchant-validation-campaign.md` Deliverable 4), unchanged. Caveat honestly: paid, ad-driven volunteers are still self-selected, same as any other recruited channel — don't treat the Sí-rate as representative of "all itinerant vendors."

- **Repeated same-feature requests across Q9/Q12/Q15.** Directional at this sample size, per the campaign's own confidence-threshold discipline — feed into `product/02c-high-fidelity-prototype/BACKLOG.md`'s reprioritization as a candidate signal, not a confirmed finding, unless corroborated by a second source.

- **High onboarding abandonment (low Task 1 completion in Q5, or a large gap between ad clicks and Form starts).** This is exactly where the OTP-bug confound matters most, and it splits into two genuinely different conclusions:
  - **If any material portion of this campaign's traffic somehow ran before the fix was confirmed live, or against a stale cached build** — treat any abandonment signal here with the same caution as the organic campaign's own confounded result. Don't conclude anything about demand or value proposition until the fix is independently reconfirmed against the exact live traffic this campaign drove.
  - **If this campaign ran entirely after the fix (the expected case, given the fix predates this plan) and high abandonment still shows up** — this is a genuinely new, *unconfounded* signal, structurally different from the organic campaign's own ambiguous result. It should be escalated as a real UX finding, routed through the standard pipeline to `ux-designer`/`architect`, not dismissed as "probably the same bug again" — that dismissal is exactly the reasoning error this whole confound exists to prevent.

---

## 9. Learning agenda

This campaign is an experiment, applying standard falsifiable-hypothesis, build-measure-learn discipline (Lean Startup / innovation-accounting practice, as broadly established in that field) directly to the general knowledge already in the marketing agent's own reasoning — **not routed through a `knowledge-mentor` consultation in this pass**, since this session's available tools don't include a way to dispatch that consultation directly. Per the standing Consultation Pattern (`company/CLAUDE.md`), that consultation is a genuine open recommendation, not something quietly skipped: if Main wants tighter methodological grounding on how these hypotheses are structured before this ships, routing the specific question ("is this the right falsifiable-hypothesis shape for a short paid-reach validation experiment?") to `knowledge-mentor` is the next step, not a requirement already satisfied here.

**Hypothesis A — Reach/channel explanation.** Organic reach failed primarily because the message never reached enough of the right people, not because the message or value proposition itself failed.
- *Supporting evidence:* this campaign, reusing materially the same message (§5a) at a targeted but broader reach, produces meaningfully higher click-through and questionnaire-completion volume than the organic post achieved in a comparable window.
- *Invalidating evidence:* even with real paid reach (hundreds of clicks, not dozens), CTR stays very low (well under typical benchmark ranges) or completions stay near zero — meaning the message/value proposition doesn't resonate even when it reaches many more people, not just a reach problem.
- *Decision this feeds:* if supported, future recruitment should pair the existing organic channels (Deliverable 1d's Tier 1/Tier 2 list) with modest paid boosts rather than rewriting the message. If invalidated, the message/value-proposition itself needs a fresh look before spending more on any channel.

**Hypothesis B — Message reuse holds up in a paid context.** The already-approved recruitment copy (1a/1b) performs adequately as paid ad creative without a rewrite — i.e., weak organic engagement wasn't a message-quality problem in the first place.
- *Supporting evidence:* CTR at or above a reasonable range for this ad type/audience, reasonable cost-per-click.
- *Invalidating evidence:* very low CTR despite an appropriately broad, geographically-matched audience — a real signal the message itself, not just the channel, needs rework.
- *Decision this feeds:* whether the existing, already brand-reviewed copy can keep being reused as-is for future recruitment, or whether it needs to go back through `brand-guardian`/`marketing` for revision before the next round.

**Hypothesis C — The OTP-bug confound substantially explains the organic campaign's weak result.** The organic campaign's low completion signal was mostly a consequence of the onboarding-blocking bug, not weak demand or a broken value proposition.
- *Supporting evidence:* this campaign (running entirely post-fix) shows a meaningfully higher completion rate per qualified click than can be reconstructed from the organic campaign's own (confounded, low-n) numbers — an imperfect but directionally useful before/after comparison.
- *Invalidating evidence:* completion rate stays similarly low even post-fix — meaning the bug wasn't the primary explanation, and demo usability or the Form's own length/ask needs a closer look instead.
- *Decision this feeds:* whether the organic campaign is worth quietly re-running as-is (same channels, same message, zero paid spend) now that the bug is fixed, or whether a more substantial redesign of the ask itself is warranted first.

**Hypothesis D — Paid-recruited respondents show comparable adoption intent to organically/curated-community-recruited ones.** Paid Meta targeting doesn't systematically attract lower-intent, "curious but uncommitted" respondents relative to community-sourced ones.
- *Supporting evidence:* Q16 Sí-rate in a broadly similar range to whatever small baseline exists from any organic responses received.
- *Invalidating evidence:* Q16 Sí-rate near zero despite healthy completion volume — a real signal that paid Meta reach, at least at this audience configuration, brings curious clickers rather than genuine prospects.
- *Decision this feeds:* whether paid Meta recruitment is a channel worth keeping in the mix for the *pilot-selection* stage specifically, or only useful for broader message/reach testing while community channels stay the primary pilot-sourcing route.

---

## 10. Ads Manager implementation guide

A complete, zero-prior-experience walkthrough. Current as of a live web check for this document (2026-08) — Meta continues to iterate screen names and flows, so confirm each step against what's actually on screen; the structure (Business Manager → Ad Account → Campaign → Ad Set → Ad) has been stable for years even as individual field names shift.

### Step 0 — Prerequisites

- A **Facebook Page for Nahui** must exist before any ad can run — Ads Manager requires a Page identity behind every ad. Confirm one exists (or create one) before starting anything below.
- An **Instagram account** is optional but recommended if placements should include Instagram (they should, per §4's Automatic-placements recommendation) — it can be linked to the Facebook Page, or Ads Manager can use the Page's identity as a stand-in for Instagram placements if none is linked.
- A **payment method** — a Mexican debit/credit card is the simplest path. **Confirm the ad account's billing currency is set to MXN before entering any budget number** — entering "500" into a USD-denominated account spends $500 USD, not MXN. This is the single most damaging first-timer mistake given how tight this budget is.

### Step 1 — Set up Meta Business Manager

Go to `business.facebook.com`. Create a Business Manager account for Nahui if one doesn't already exist (business name, your own name/email). Connect the Nahui Facebook Page and Instagram account here.

### Step 2 — Create the Ad Account

Inside Business Manager, create an Ad Account under Nahui's business. Set:
- **Currency: MXN** (cannot be changed later — confirm before saving).
- **Time zone: Mexico City** (matters for how the 3-day schedule is interpreted).

### Step 3 — Add a payment method

In the Ad Account's Payment Settings, add the card that will fund this campaign.

### Step 4 — Open Ads Manager and start a new campaign

Go to Ads Manager (`adsmanager.facebook.com` or via Business Manager's menu), click the green **+ Create** button.

### Step 5 — Buying type

Leave this at the default, **Auction** — not Reach & Frequency (a different, larger-scale buying model not relevant here).

### Step 6 — Campaign objective

Select **Traffic** (§1). Name the campaign something identifiable, e.g. `Nahui — Validación Meta Ads Ago2026`.

### Step 7 — Campaign-level settings

Leave **Advantage Campaign Budget** off — this campaign uses exactly one ad set (§6), so budget is set at the ad-set level instead (Step 10). Skip any A/B-test toggle offered here — unnecessary complexity for a first campaign with one ad.

### Step 8 — Ad Set: conversion location and optimization goal

Name the ad set. Set:
- **Conversion location: Website.**
- **Performance goal: Landing Page Views** (§1) — not Link Clicks.
- Leave the **Meta Pixel / Conversions API** field blank if none is set up. This is expected and fine for this campaign, given `demo.nahui.app` has no backend or pixel installed (§7) — it does not block publishing.

### Step 9 — Audience

Enter the settings from §2/§3:
- **Locations:** add "Estado de México" and "Ciudad de México" as two separate region entries.
- **Age:** 22-60.
- **Gender:** All.
- **Detailed targeting:** try 2-3 broad interest terms (e.g., "Pequeña empresa," "Emprendimiento," "Venta al por menor"), and confirm **Advantage Detailed Targeting** is toggled on.

### Step 10 — Budget and schedule

Enter the settings from §6:
- **Budget type: Lifetime.**
- **Amount: MXN $500.**
- **Start date/time:** the intended campaign start.
- **End date/time:** exactly 3 days later. **Do not leave this blank** — an unset end date is the single most common way a small campaign silently overspends past its intended window.
- As a backstop regardless of budget type chosen, set an **Account Spending Limit of MXN $500** under Billing Settings.

### Step 11 — Placements

Select **Advantage+ Placements** (Automatic) — the default option (§4). Do not switch to Manual for this first campaign.

### Step 12 — Ad level: identity and format

- Select the Nahui Facebook Page (and linked Instagram account, or "use Facebook Page" if none is linked) as the ad's identity.
- **Ad format: Single Image** (§5c) — not Carousel.
- Upload the recommended image (§5c — the `Selling` grid mid-sale screenshot). Light-crop it to the app content itself if the raw screenshot includes phone status-bar or browser-address-bar chrome — keeps the honest, unpolished register without looking like an accidental capture.

### Step 13 — Ad creative fields

Paste in the Primary Text, Headline, Description, and CTA button from §5a exactly as drafted. Set the **Website URL** to `https://demo.nahui.app`.

### Step 14 — URL parameters (tracking)

Under the ad's **Tracking** section, use the **"Build a URL parameter"** field (not hand-appending `?utm=` to the visible link) to add: `utm_source=meta&utm_medium=paid&utm_campaign=validacion_ago2026` (§5b).

### Step 15 — Preview before publishing

Use Ads Manager's built-in **Preview** panel to check the ad across Feed, Stories, and Reels formats specifically — confirm the Primary Text isn't awkwardly cut off and the image reads clearly in a vertical (Stories/Reels) crop, not only the horizontal Feed crop.

### Step 16 — Publish, with review-time buffer

Submit for publishing. Meta's ad review typically takes anywhere from a few minutes up to about 24 hours. **Submit at least several hours — ideally the day before — the intended start time**, so review delay doesn't quietly eat into the 3-day budget window itself.

### Step 17 — Monitor daily

Check Reach, Landing Page Views, CTR, and Amount Spent in Ads Manager once a day during the 3-day run. Cross-check the Google Form's response count against the same window each day (§7).

### Step 18 — Confirm it actually stopped

At the end of the 3-day window, confirm in Ads Manager that the campaign's status shows as ended/no longer delivering — don't assume the End Date setting worked without checking once.

### Common first-timer mistakes, gathered in one place

1. **No End Date set** — the campaign keeps running and spending past the intended 3-day window. The single most common and costly beginner mistake; always set it explicitly (Step 10).
2. **Wrong ad-account currency** (USD instead of MXN) — silently multiplies the intended spend. Confirm before entering any budget number (Step 0/Step 2).
3. **Using "Promocionar publicación" (Boost Post) from the Page instead of Ads Manager's own Create flow** — Boost Post is a simplified tool with fewer objective/optimization options and no proper Traffic/Landing-Page-Views setup. Always start from Ads Manager's green **+ Create** button (Step 4), never from a Page post's Boost button.
4. **Manual Placements without data to justify it** — accidentally excludes an effective placement, or leaves in low-quality inventory. Stick to Advantage+ Placements for this first run (Step 11).
5. **Over-stacking Detailed Targeting** — too many interests with AND logic starves delivery at this budget. Keep it to 2-3 broad terms, Advantage Detailed Targeting on (Step 9).
6. **Overselling copy** — anything that reads like "¡Descubre la mejor app!" breaks both brand voice and Product Truth for a genuinely unfinished prototype. Stick to the copy in §5a as drafted; don't punch it up.
7. **Screenshot with visible device chrome** (status bar, browser tabs) used as the ad image without a light crop — looks like an accidental capture rather than a deliberate, honest one (Step 12).
8. **Assuming "In Review" means live** — check back for **Active** delivery status before assuming the campaign is actually running (Step 16).
9. **Not double-checking the Form-completion cross-reference is actually being tracked** — since there's no pixel and no source field on the Form itself (§7), the only way to attribute completions to this campaign is checking submission timestamps against the exact 3-day window daily, not retroactively at the end.

---

## Summary of top recommendations, one line each

1. **Objective:** Traffic, optimized for Landing Page Views.
2. **Audience:** Broad — 22-60, all genders, 2-3 soft interest terms, Advantage Detailed Targeting on.
3. **Geography:** Ciudad de México + Estado de México.
4. **Placements:** Advantage+ (Automatic).
5. **Creative:** One single-image ad, copy adapted from the already-approved Deliverable 1b, image = the `Selling` grid screenshot, button destination = `demo.nahui.app`, Google Form link carried as plain text in the ad copy.
6. **Budget:** Lifetime budget, MXN $500, exact 3-day start/end, one ad set only.
7. **Success metrics:** Landing Page Views and cost-per-view as top-of-funnel; questionnaire completions and cost-per-completion as the real bottom-line numbers; Q16 Sí/Tal vez/No tracked separately.
8. **Decision playbook:** Every abandonment-related outcome is read through the OTP-bug confound explicitly — post-fix abandonment is a real new signal, not an assumed repeat of the same bug.
9. **Learning agenda:** Four falsifiable hypotheses (reach, message, bug-confound, adoption-intent-by-channel), each with named supporting/invalidating evidence and the decision it feeds — a `knowledge-mentor` consultation on hypothesis structure is a recommended, not-yet-performed, follow-up.
10. **Implementation:** Full 18-step Ads Manager walkthrough with 9 named first-timer mistakes, grounded in a live 2026 check of Meta's current ODAX objective menu and campaign/ad-set/ad structure.
