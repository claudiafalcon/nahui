# Nahui — Meta (Facebook/Instagram) Ads Plan: Campaign B Video Launch ("Venta rápida")

**Status: spec/recommendation only. Nothing here is authorized to be published, spent, or sent.** Prepared by `marketing` at Main's request. Requires explicit Product Owner sign-off before anything below is created in Ads Manager, per the standing Approval gate (`company/CLAUDE.md`). Ready to launch the moment that sign-off is given — every field below is a real, paste-ready value, not a placeholder.

**Asset this spec launches:** `company/campaign-assets/campaign-b-draft/final/campaign-b-final-v3.mp4` — 29.31s, vertical 1080×1920, real captured footage of the real running prototype (Playwright `recordVideo` → Remotion composition, per `company/merchant-validation-campaign-b-storyboard.md`), Marina voiceover (Azure Neural TTS, `es-MX`, generated on the paid S0 tier — commercial-use rights held from generation, no pending licensing action). Per the dispatching instruction, this asset has already cleared a full review loop (`ux-critic` motion/overlay quality, `brand-guardian` copy-delta review across every `[CHANGED]` line in the script, `reviewer` Foundation consistency) with 0 Blockers. This document treats that as settled and does not re-litigate it — the same "treat as settled" convention `merchant-validation-strategy-v2.md` §12 already applies to its own architecture verdict.

**Read first, treated as this document's precedent and evidence base, not re-derived from scratch:**
- `company/merchant-validation-campaign-meta-ads.md` — the first Meta Ads campaign (single static image, MXN $500/3 days, executed 2026-08-17–20). Format/rigor precedent; every section below states explicitly what carries forward unchanged, what's re-derived, and what's genuinely new.
- `company/merchant-validation-strategy-v2.md` — the evolution from that campaign's real results: the OTP-bug confound, the pivot to hypothesis-specific video campaigns (§2), the guided-instruction entry strategy (§7, `architect`-ruled permanent), the questionnaire architecture (§8, §11), and the delivery-mechanism/transition-cost architecture evaluation (§12, §13).
- `company/merchant-validation-campaign-meta-ads.md` §9 / `company/merchant-validation-funnel-diagnosis.md` — the real evidence this campaign has to account for: 423 Meta landing-page views (285 by Vercel's independent count) against 3 questionnaire responses (2 genuine), a ~0.71–1.05% conversion rate, ~MXN $139.88 cost per response, and — the load-bearing finding for this document — an 11-stage breakdown showing the largest unexplained loss sits in Stages 4-7 (prototype start through reaching the reminder banner), a region Campaign 1 had **zero visibility into**. Hypothesis E ("H5" — whether Demo Mode's own fixes reduced validation-environment confusion) remains untested, needing ≥10 new Demo-Mode-era respondents.
- `company/merchant-validation-campaign-b-storyboard.md` and `company/merchant-validation-campaign-videos.md` — the actual creative/script this video realizes (Campaign B, "Venta rápida," §B.1). Every messaging field below (Primary Text, Headline, CTA) is built by reusing this already-brand-reviewed language, not inventing new claims.
- `company/merchant-validation-concierge-pilot.md` — a separate, not-yet-launched pilot; its relationship to this campaign is named explicitly in §0 below, not silently assumed.
- `product/02-ux/demo-mode.md` §2.5 — the six client-side analytics events this campaign's success metrics (§7) are actually built on: `demo_questionnaire_cta_click` (§2.5.1, confirmed live in production), `demo_pass_through_reached` / `demo_otp_completed` / `demo_onboarding_completed` (§2.5.2, built and reviewed, delivery to the production dashboard not yet independently confirmed), `demo_sale_completed` / `demo_paid_plan_activated_midsession` (§2.5.3, built and live-verified in a dev build, delivery to the production dashboard not yet independently confirmed either).

---

## 0. Is this a new campaign, a continuation, or a relaunch? — and its relationship to the Concierge/DM pilot

**This is a new Ads Manager campaign object — Wave 1's Campaign B, per the already-approved `merchant-validation-strategy-v2.md` roadmap — not an edit or relaunch of Campaign 1's existing campaign.** Campaign 1 already ran its full budget and closed (2026-08-17–20); this is a second, independent campaign, built fresh in Ads Manager, so its own Reach/CTR/CPV/Landing Page View numbers stay independently readable rather than blending into an already-closed campaign's totals — the same "one coherent workstream, one clean record" discipline this project applies to commits and documents elsewhere.

**What carries forward unchanged from Campaign 1, and why re-deriving it would relitigate settled ground:** Objective (Traffic, optimized for Landing Page Views), Audience (broad targeting, 22-60, all genders, Advantage Detailed Targeting on), Geography (CDMX + Estado de México), and Placements (Advantage+/Automatic). None of these were the diagnosed problem. Campaign 1 proved reach and delivery work — MXN $0.99 cost per view, real audience match (Vercel's own referrer data: Instagram/Facebook traffic, not contamination). What broke was downstream of the click, inside stages Campaign 1 could not see at all. Re-targeting, re-narrowing, or re-scoping geography now would spend real effort solving a problem the evidence doesn't show exists — the same reasoning `merchant-validation-strategy-v2.md` §12.4 already applies to why a new backend isn't justified.

**What's genuinely new, and is the actual point of this campaign:** the creative (a hypothesis-specific, guided-hook video replacing a generic static image), the messaging fields tied to that creative, an updated read on the destination-structure question now that the persistent reminder banner exists (it didn't during Campaign 1), and — the most consequential change — the **measurement layer**. Campaign 1 could only measure "did she land on the page" and "did she complete an external Google Form." This campaign can measure, for the first time, whether she got through Authentication, whether she completed Onboarding and on which path, and whether she actually finished a sale inside the demo — independent of whether she ever opens the Form at all. §7 and §8 below are built around this new capability; they are not a copy of Campaign 1's own success-metrics table with new labels.

**Relationship to the Concierge/DM pilot (`company/merchant-validation-concierge-pilot.md`) — named explicitly, not assumed either way:**

- **Genuinely complementary, not mutually exclusive, and not strictly sequenced as a hard dependency.** Different objective (this campaign: Traffic, self-serve, destination `demo.nahui.app`; the pilot: Engagement/Messaging, destination Instagram Direct), different mechanism (this campaign measures behavior via analytics events and an anonymous Form; the pilot gets a real, named conversation asking *why*), different creative CTA (this campaign's Beat 4b reads "Pruébalo y cuéntanos si esto te serviría — las dos cosas nos ayudan por igual"; the pilot's own §4 proposes a distinct DM-specific swap, "Escríbenos y cuéntanos cómo llevas tus ventas hoy..."). Running one does not substitute for or invalidate the other.
- **This campaign is materially more launch-ready today.** The video is finished, reviewed, 0 Blockers. The Concierge pilot's own approval checklist (§3 there) still has open items: its Beat 4b DM-variant has never been built against any asset version (its own §4 proposes the wording only), Meta Business Suite's Instant Reply/Automations tooling availability is unconfirmed, and a dedicated `brand-guardian` review of the discussion guide is recommended but not confirmed done. **Recommendation: this campaign proceeds on its own track now, pending sign-off, without waiting on the Concierge pilot's separate approval process to close.**
- **A stale cross-reference worth naming now, not silently left for later:** the Concierge pilot's §4 explicitly says it reuses `company/campaign-assets/campaign-b-draft/campaign-b-draft.mp4` — an earlier draft than the asset this document launches. When/if the Concierge pilot proceeds, its own creative note should be updated to build its DM-CTA variant against `campaign-b-final-v3.mp4` instead, not the superseded draft. Flagged here as a small, concrete follow-up; not fixed in this document, since the Concierge pilot file is out of this dispatch's scope.
- **A real, modest complementarity worth naming for later, not a reason to force sequencing now:** this campaign's own Stage 4-8 instrumentation (§7), once delivery is confirmed in production, gives Nahui its first-ever *quantitative* read on exactly the question the Concierge pilot exists to answer *qualitatively* (its own CP1-CP5 candidate hypotheses — phone/OTP friction, unclear value prop, perceived effort, trust, no real barrier). Neither replaces the other: analytics can show *where* the drop happens, never *why*; the pilot's discussion guide is built specifically to get at *why*. If both eventually run, reading this campaign's stage-level cascade first could sharpen which of the pilot's five candidates its discussion guide should probe hardest — a genuine but optional sequencing benefit, not a reason to delay either one. Whether/when to run both is a bandwidth and prioritization call for the Product Owner (Concierge is sized for exactly one person's monitoring capacity, per its own §2.2) — not resolved here.

---

## 1. Campaign objective

**Recommendation: Traffic, optimizing the ad set for Landing Page Views — unchanged from Campaign 1, re-confirmed rather than assumed.**

**Why this doesn't change just because the creative is now video.** A video ad *could* be optimized for Engagement/ThruPlay (paying for people who watch a set portion of the video) instead of Traffic. That would be the wrong choice here: this campaign's actual success signal lives *after* the click — in whether she reaches Authentication, Onboarding, and a completed sale — not in whether she watched 15 seconds of an ad inside Meta's own app. Optimizing for video views would let Meta's delivery system spend the budget finding people likely to watch without clicking through, actively working against the one thing this campaign needs someone to do (leave Meta's app and open `demo.nahui.app`). Traffic/Landing Page Views remains the correct goal for the identical reason Campaign 1 chose it (`merchant-validation-campaign-meta-ads.md` §1): it's the closest available proxy for "she actually arrived," and this campaign still has no Meta Pixel on `demo.nahui.app` to measure anything more precise at the ad-platform level.

**Leads, Awareness, App Promotion, Sales** remain inapplicable for the same reasons stated in Campaign 1's §1 — nothing here changes that reasoning; not re-derived in full a second time.

---

## 2. Audience

**Recommendation: unchanged from Campaign 1 — broad targeting, Advantage+ Audience on.** Age 22-60, Gender: All, 2-3 soft interest terms (e.g., "Pequeña empresa," "Emprendimiento," "Venta al por menor"), Advantage Detailed Targeting: ON, no exclusions beyond geography.

**Why re-confirmed, not just copied:** the diagnosed problem sits downstream of who saw the ad. Narrowing the audience now, on the theory that a sharper video needs a sharper audience, would conflate two different levers — creative message and audience targeting — and make it impossible to attribute any change in outcome to either one cleanly. At this project's still-modest budget, broad targeting + algorithmic expansion remains the right call for the same reason Campaign 1 gave: little room for Meta's delivery system to "learn" within a narrow group before a short campaign window ends.

---

## 3. Geography

**Recommendation: unchanged — Ciudad de México + Estado de México**, two separate region entries. Same reasoning as Campaign 1 §3: matches `market-validation.md`'s pilot-geography criterion exactly, keeps the population large enough for healthy delivery, covers the channel geography this project's own community research already verified real. Nothing in the evidence gathered since Campaign 1 argues for widening or narrowing this.

---

## 4. Placements

**Recommendation: Advantage+ Placements (Automatic) — unchanged.** Same reasoning as Campaign 1 §4 (no placement-specific performance data yet to act on, a first-timer manually selecting placements is the likeliest way to accidentally under-deliver).

**What's genuinely new for video, and requires one extra check Campaign 1 never needed:** this creative is a native vertical 1080×1920 (9:16) video with carefully placed on-screen text — per the storyboard's own design (`merchant-validation-campaign-b-storyboard.md` SB2-4), primary/emphasis text sits in the upper third of frame, running captions in the lower third. Some Feed placements render vertical video cropped toward a narrower ratio (commonly 4:5) rather than full 9:16, which risks clipping exactly the upper-third text zone this creative was deliberately designed around — a risk a single static screenshot never carried in the same way.

**Mandatory step, not optional:** before publishing, use Ads Manager's own Preview panel to check this specific creative across Feed, Stories, and Reels formats — confirm the upper-third hook text (Beat 1b: "…¿se te va el cliente mientras intentas anotar la venta?") and the lower-third karaoke captions (Beat 2, shots 3-5) are both fully visible, not cropped, in every placement format shown. If Feed's own crop clips the upper-third text and Reels/Stories render it correctly, that's real information — but the recommendation is still to keep Advantage+ Placements and accept Feed rendering imperfectly on this one creative, rather than manually excluding Feed without delivery data to justify it (the same "don't over-exclude at this budget" reasoning as Campaign 1 §4). Note the finding in the campaign log either way.

---

## 5. Creative

### 5a. Ad format and video upload

**Ad format: Single Video** — not Carousel, not Collection. Upload `campaign-b-final-v3.mp4` directly. Technical spec (H.264, 1080×1920, 30fps, 29.31s) is well within Meta's current video-ad requirements for every placement this campaign uses (container/codec supported, duration far under any placement's max, file size for a 29-second clip at this resolution is comfortably under Meta's upload cap) — confirm against Ads Manager's own live upload requirements at time of upload, the same live-check discipline Campaign 1 already applied to its own objective menu, since Meta continues to iterate these limits.

### 5b. Thumbnail / cover-frame selection — a new decision this campaign has that Campaign 1 didn't

A static image ad *is* its own thumbnail. A video ad needs an explicit cover frame — shown before playback starts in some placements, and whenever autoplay is paused or hasn't yet triggered.

**Recommendation: manually select a frame, do not accept Meta's auto-selected default.** This creative is built almost entirely from hard cuts (per the storyboard's own transition notes — no crossfades between most shots), which means an auto-selected frame has a real chance of landing mid-transition or on an intermediate, incoherent moment. **Recommended frame: inside Beat 1b's hold, roughly the 0:02.5–0:04.0 mark** — this is the one deliberately-held frame early in the video (not a hard-cut instant), and it shows the hook's full grounded line ("…¿se te va el cliente mientras intentas anotar la venta?") together with the real product screen it was reveal-timed to — the single frame that best represents both the emotional hook and the actual prototype at once. Select this in Ads Manager's own thumbnail picker (drag the scrubber to the timestamp, confirm the frame reads clearly as a still) at upload time — a producer-level task done directly in the tool, not something pre-rendered separately.

### 5c. Captions — burned-in, not platform-generated

This creative already carries its own captions, composited directly into the video file — static pop-in text for Beat 1 (hook), Beat 3 (hypothesis), Beat 4a/4b (disclosure, CTA, incentive), and word-highlight ("karaoke") running captions for Beat 2's three value-framed lines (shots 3-5), all built specifically to satisfy the sound-off-by-default assumption most short-form viewers actually watch under.

**Recommendation: do not enable Meta's automatic caption generation on top of this.** Three reasons: (1) it would duplicate content already present in the frame, cluttering a composition that was deliberately kept clean (per the storyboard's own emphasis-and-overlay discipline); (2) auto-generated Spanish captions carry a real mistranscription risk this project's own reviewed, brand-approved captions don't; (3) the burned-in captions were specifically timed and positioned (upper-third vs. lower-third, per SB2-4) as part of the creative's own reviewed design — a second, independently-positioned caption layer risks visually colliding with them. If Ads Manager exposes a toggle for auto-captions on video ads, leave it off.

### 5d. Primary Text, Headline, Description, CTA button

Built by reusing the already `brand-guardian`-cleared lines from the video's own script (`merchant-validation-campaign-videos.md` B.1) wherever possible, rather than inventing new claims — the same discipline Campaign 1 §5a applied when adapting from the organic recruitment copy. **The connective sentences below (not already-approved verbatim lines) are new copy and, per this project's standing discipline for every other new line in this campaign family, should go through a `brand-guardian` delta review before this ad is actually published — flagged explicitly, not glossed over.**

**Primary Text (Spanish, ready to paste — connective lines flagged `[NEW, unreviewed]`; reused lines cited):**

> Hola, somos Nahui 💛 Este es un prototipo interactivo: así se ve registrar una venta en el bazar sin perder al cliente que tienes enfrente. *[NEW, unreviewed]*
>
> Pruébalo y cuéntanos si esto te serviría — las dos cosas nos ayudan por igual. *(verbatim, Beat 4b CTA, `merchant-validation-campaign-videos.md` B.1)*
>
> ¿Ya lo probaste, o prefieres empezar por el cuestionario? Aquí está la liga: forms.gle/ZZhtJEfee3viWY1h8 *[NEW, unreviewed]*
>
> Al terminar, puedes decirnos que quieres que te tengamos en cuenta para el piloto — quedas en la lista de acceso prioritario. *(verbatim, Beat 4b incentive line)*
>
> No es una venta, no te pedimos dinero, y no compartimos tu información con nadie fuera de Nahui. *(carried forward, Campaign 1 §5a, unchanged fact)*

**Headline — two options, stated explicitly rather than picking silently:**
- **Option A (recommended for immediate launch, zero new-copy risk): `Prueba el prototipo de Nahui`** — Campaign 1's own already-reviewed headline, reused as-is. Safe, factual, no overclaim, no new `brand-guardian` gate to clear before launch.
- **Option B (stronger, echoes the video's own hook, requires a delta review first): `¿Se te va el cliente en el bazar?`** — a compressed echo of Beat 1's already-approved hook line, not a verbatim reuse (verbatim is too long for a headline field). Flagged as new/adapted copy needing its own brand-guardian pass before use, not launched under Option A's clean-review status.

**Description (link description, shown on some placements only):** `Para vendedoras y vendedores de bazar` — unchanged from Campaign 1, reused as-is.

**CTA button: `Más información`** — unchanged from Campaign 1. Same reasoning holds: "Regístrate" overstates the ask (implies a real account); "Contáctanos" is the wrong register (this isn't a contact request, and this campaign's own conversation-based counterpart — the Concierge pilot — already owns that register on a separate campaign object). "Más información" is still the closest honest match.

### 5e. Destination — one clickable button, one plain-text link, reasoning updated with new evidence

**Recommendation, unchanged in structure from Campaign 1: the button/headline destination is `demo.nahui.app`; the Google Form URL appears as a second, plain-text link inside the Primary Text (above).**

**What's genuinely different from Campaign 1, and should be stated plainly rather than silently inheriting the old reasoning verbatim:** Campaign 1's §5b named "a real, honest gap — nothing inside the prototype hands off toward the questionnaire" as the reason the Form link had to live in the ad's own text as the only path to it. **That gap has since been substantially closed.** The persistent reminder banner (`product/02-ux/demo-mode.md` §2.3/§3.6), built and Approved after Campaign 1 ran, now gives any participant a one-tap path to the questionnaire from wherever she is in the demo, for the entire session — this campaign is the first to launch with that infrastructure already live. The plain-text Form link in the ad's own Primary Text is now a genuinely **redundant**, not sole, path to the Form — useful for someone who wants to skip straight to the questionnaire without trying the demo at all, but no longer the only way a participant who does try the demo can find her way to it.

**What's unchanged, and still a real, named limitation:** a plain-text URL inside Primary Text is still not guaranteed to render as tappable on every placement (Instagram Stories/Reels frequently don't auto-link it) — the same risk Campaign 1 named and didn't solve. This campaign doesn't solve it either; it's meaningfully less costly now that the banner provides a second, guaranteed-in-app path once she's actually in the demo.

**Known, honest limitation carried forward from the source documents and not yet resolved by anything built since — stated plainly, not glossed over:** the Campaign-B-specific welcome-screen guidance sentence drafted in `merchant-validation-campaign-videos.md` §B.2 ("En este prototipo, crea tu negocio, registra un par de productos y haz una venta rápida — es lo que viste en el video.") was **never actually built or wired.** Direct inspection of `demo-mode.md` confirms the welcome screen remains a single, generic screen with no mechanism to detect which campaign a session arrived from — the open item that document's own item 3 flagged in 2026-08-19/20 was never resolved. **Practical consequence for this launch:** a participant clicking through from this ad sees the same generic Demo Mode welcome screen every visitor sees, not a sentence pointing her toward the specific flow the video just showed her (Empezar gratis → business identity → two products → Iniciar Venta Rápida → sell → receipt). The video's own guided montage still primes her on what to expect, so this isn't a launch-blocking gap — but it's real, it's the exact expectation-alignment mechanism `merchant-validation-strategy-v2.md` §4 argued mattered, and it should be routed to `ux-designer`/`architect` as a genuine follow-up (a client-side URL query-parameter read, per campaign-videos.md's own suggestion, is the lightest-weight fix) rather than assumed solved because a sentence for it was once drafted.

**UTM parameters** — use Ads Manager's "Build a URL parameter" field (never hand-appended to the visible link): `utm_source=meta&utm_medium=paid&utm_campaign=campana_b_video_ago2026&utm_content=v3`. A distinct `utm_campaign` value from Campaign 1's own `validacion_ago2026`, so any future manual log/referrer inspection can tell the two campaigns' traffic apart even though neither is currently surfaced inside Vercel's own dashboard by UTM.

---

## 6. Budget

**Primary recommendation: MXN $750, Lifetime Budget, explicit 4-day Start/End window**, plus an Account Spending Limit of MXN $750 as a hard backstop (same discipline as Campaign 1 §6/§10 — never rely on Daily Budget's pacing alone).

**Why larger than Campaign 1's MXN $500/3 days, stated as reasoning, not a default bump:** two things changed since that budget was set. First, this campaign carries a materially higher already-sunk production cost (a fully produced, reviewed video vs. one screenshot) that deserves a fair reach test, not a token pulse. Second, and more load-bearing: **this campaign converts a materially larger share of its own spend into usable data than Campaign 1 could, even without a single Form completion**, because the six analytics events (§7) fire on in-app behavior alone. Campaign 1's marginal peso bought, in practice, only a Landing Page View and a very thin chance at a Form response; this campaign's marginal peso also buys a real chance at a `demo_pass_through_reached`, `demo_otp_completed`, or `demo_onboarding_completed` count — stage-level evidence Campaign 1 could never produce at any spend level. A somewhat larger budget is a more defensible bet given that shift, while still staying well inside this project's own "small, cheap, learning-first" discipline — not a full launch budget.

**Alternative, if closest before/after comparability against Campaign 1 is preferred instead:** keep the exact MXN $500/3-day parameters unchanged. This produces a cleaner CPV/spend comparison against Campaign 1's own real numbers ($0.99 CPV, MXN $419.64 actually spent), at the cost of less volume flowing into the new stage-level instrumentation. **Stated as a genuine, PO-decidable tradeoff — not defaulted past.**

**One ad set, one ad — unchanged.** Same reasoning as Campaign 1 §6: fragmenting an already-modest budget across ad sets or creative variants is one of the most reliable ways to end a small campaign with too little data at any single point to say anything useful. **A video-vs-static-image A/B test was considered and explicitly rejected for this round** — genuinely interesting (does video outperform the original static image on CTR/CPV), but it would split this campaign's own already-limited volume across two arms right when the new instrumentation most needs a single, undiluted stream to reach a usable stage-level sample. A legitimate idea for a later, larger-budget round once this round's own instrumentation is confirmed reliable — not now.

**Learning-phase honesty, carried forward unchanged from Campaign 1 §6:** this campaign will very likely show "Learning" in Ads Manager for its entire run at either budget level — expected, not a failure signal.

---

## 7. Success metrics

Real behavioral and funnel-stage metrics, never impressions/likes/follower counts in isolation — but this campaign's own metrics are structurally richer than Campaign 1's, built directly on `company/merchant-validation-funnel-diagnosis.md`'s 11-stage breakdown and the six analytics events `product/02-ux/demo-mode.md` §2.5 now defines. **Not re-invented from scratch — every metric below maps to a stage that document already named as unmeasured.**

### 7a. Tier A — Meta Ads Manager native (ad-platform side)

| Metric | Purpose | Notes |
|---|---|---|
| Reach, Impressions, Frequency | Delivery sanity check | Unchanged role from Campaign 1 §7 |
| CTR, Link Clicks | Message/creative diagnostic | Unchanged role |
| **Video: ThruPlays / 25-50-75-100% Video Views, Average Watch Time** | **New — a diagnostic Campaign 1's static image structurally could not produce.** | Tells whether the hook holds attention *before* any click at all — a genuinely new signal for judging whether Beat 1's redesigned pattern-interrupt hook is working as designed, independent of whether it converts to a click. Not a success metric on its own (per §1 — this campaign is not optimized for video views), but real diagnostic color. |
| Landing Page Views | Top-of-funnel proxy | Same role as Campaign 1 §7 — the cleanest available signal that she actually arrived at `demo.nahui.app` |
| Cost per Landing Page View | Efficiency check | Compare directly against Campaign 1's own real MXN $0.99 CPV baseline |

### 7b. Tier B — client-side session/funnel events (`@vercel/analytics`, via `demo.nahui.app`) — the genuinely new capability

Each event below is count-only or count-plus-one-closed-enum, zero PII, fired client-side, mapped to its owning stage in `company/merchant-validation-funnel-diagnosis.md`:

| Event | Funnel stage(s) it feeds | What it tells us | Production delivery status |
|---|---|---|---|
| `demo_pass_through_reached` | Stage 4 / Stage 7 (same instant, per `demo-mode.md` §2.5.2's own correction — fires the moment "Empezar demo" is tapped, covering both "started the flow" and "the banner is now visible") | Whether people who land actually proceed past the welcome screen at all | **Not yet independently confirmed delivering to the production dashboard.** Built and `reviewer`-verified against spec; not dashboard-confirmed the way §2.5.1 was. |
| `demo_otp_completed` | Stage 5 (Authentication/OTP) | Whether Authentication specifically is where people stall, now measurable for the first time | Same status — built, not yet dashboard-confirmed. |
| `demo_onboarding_completed` `{path: 'free'\|'paid'\|'demo'}` | Stage 6 (Onboarding completion, by path) | Whether Onboarding is a separate bottleneck from Authentication, and which of the three paths respondents actually choose | Same status — built, not yet dashboard-confirmed. |
| `demo_questionnaire_cta_click` | Stage 8 (banner CTA tap) | Whether people who make it that far actually tap toward the questionnaire | **CONFIRMED live in production** (Product Owner verified 2/2 real events in the Vercel Events panel, 2026-08-19). The one event in this table with real, dashboard-verified delivery. |
| `demo_sale_completed` | Within-session engagement depth — **the single most direct behavioral proxy for H1 available anywhere in this project.** Repeatable per session (fires once per finalized Sale). | Whether she actually completed a fast sale in the demo — independent of whether she ever opens or finishes the Form at all. This is new: Campaign 1 had no way to measure task completion except a self-reported Form answer from the tiny handful who completed it. | Built and live-verified in a dev build (2026-08-20); **not yet independently confirmed delivering to the production dashboard.** |
| `demo_paid_plan_activated_midsession` | Secondary engagement-depth signal | Whether a participant explores Configuración deeply enough to self-activate the paid plan | Same status as `demo_sale_completed` — built, dev-verified, not production-dashboard-confirmed. Lower relevance to H1 specifically; free to observe alongside the others. |

**Two structural limitations, stated honestly rather than glossed over:**
1. **No session-correlation ID exists across these events.** Each is a bare count with no participant identifier — this campaign can read aggregate stage-to-stage *ratios* (how many `demo_pass_through_reached` vs. `demo_otp_completed` vs. `demo_onboarding_completed` vs. `demo_sale_completed` counts accumulated over the window) as an approximate funnel, but it cannot say "this exact person reached OTP, then Onboarding, then a sale" — the same limitation `merchant-validation-funnel-diagnosis.md` Stage 8 already carries for its own single event, now extended honestly to all six.
2. **Only `demo_questionnaire_cta_click` has confirmed production delivery as of this writing.** The other five are built, code-reviewed, and (for the two newest) verified firing correctly in a dev build — but none of that is the same as confirmed, counted data on the live `demo.nahui.app` dashboard. **This is Step 0 of §8's Decision Playbook below, not an afterthought:** confirm all six events are actually visible and counting in the Vercel Analytics dashboard *before* spending a single peso — the same discipline Campaign 1's own Decision Playbook applied to reconfirming the OTP fix was actually live before that campaign spent anything.

### 7c. Tier C — Google Form (unchanged mechanism from Campaign 1)

| Metric | Notes |
|---|---|
| Questionnaire completions (response count) | Cross-referenced against this campaign's exact window by submission timestamp, same convention as Campaign 1 §7 |
| Q16 Sí / Tal vez / No split | Reported separately, never blended, same convention |
| Cost per qualified questionnaire completion | Compare directly against Campaign 1's own real MXN ≈$139.88 baseline |

---

## 8. Decision playbook

**Step 0, before anything else — mandatory, not optional.** Confirm each of the six §7b events is actually visible and counting in the live Vercel Analytics dashboard for `demo.nahui.app` (not merely code-verified or dev-build-verified) before spending anything. This mirrors Campaign 1's own "reconfirm the fix is actually live... before spending a single peso" step, applied to this campaign's own new dependency. If a given event isn't yet dashboard-confirmed, either resolve that first or launch while treating that specific event's numbers as unverified until confirmed mid-flight — never presented as clean data before that confirmation happens.

Once delivery is confirmed, this campaign's own stage-level cascade is decision-useful in a way Campaign 1's aggregate 423-vs-3 number never was — for the first time, a real drop can be *localized*, not just observed as one opaque collapse:

- **High Landing Page Views, much lower `demo_pass_through_reached`.** Before concluding a real drop-off at the welcome screen, cross-check against Vercel's own independent visitor count the same way Stage 3 already had to (Meta's 423 vs. Vercel's 285 — a real, still-unresolved ~33% gap) — some of any observed gap here may repeat that same measurement discrepancy, not a new behavioral finding.
- **High `demo_pass_through_reached`, much lower `demo_otp_completed`.** Localizes the drop specifically to Authentication/OTP — a genuinely new, previously invisible finding. Escalate as a real UX candidate finding (`product/02-ux/ux-critic-findings.md` or `product-decisions.md`, per Decision Ownership), not dismissed as "probably the old OTP bug again" — that bug is fixed and predates this campaign entirely.
- **High `demo_otp_completed`, much lower `demo_onboarding_completed`.** Localizes the drop to Onboarding specifically. Read the `path` payload's split across free/paid/demo — a heavy skew toward one path, or an unexpectedly low share choosing any path at all, is itself informative.
- **High `demo_onboarding_completed`, low `demo_sale_completed`.** She completes setup but doesn't get through the guided selling task the video actually promised — points at Home/selling-flow friction specifically, a finding this campaign is the first thing in this project able to produce.
- **High `demo_sale_completed`, still low `demo_questionnaire_cta_click` or Form completions.** This is the single most decision-useful possible outcome: it would be the first real evidence separating "she didn't complete the task" from "she completed the task but the banner→Form transition or the Form's own length is where she stops" — directly resolving the indistinguishability `merchant-validation-strategy-v2.md` §13.5 explicitly left open. Feeds directly into whether §11's core/extended Form restructure (still a pending Product Owner decision) is worth prioritizing.
- **Low `demo_sale_completed` counts relative to `demo_onboarding_completed`, while the few Form respondents who do complete report high Task-completion-grid success.** Before concluding a real behavioral finding, cross-check whether the event is actually firing reliably in production — an instrumentation-delivery problem can look identical to a real drop-off at this sample size, the same caution Step 0 exists to prevent.
- **Any outcome, read against H1/H5:** this campaign's respondents are the population `company/merchant-validation-campaign-meta-ads.md` §9's Hypothesis E ("H5" — whether Demo Mode's cumulative fixes actually reduced validation-environment confusion) needs. Report this campaign's own completion pattern against H5's own composite evidence threshold (§9 there) once ≥10 genuinely independent respondents accumulate — this campaign is very likely where H5 gets its first real evaluable batch, not a separate task to run later.

---

## 9. Learning agenda

This campaign continues testing **H1** (the core thesis — does registration feel fast enough not to lose the customer) and is the primary vehicle for evaluating **Hypothesis E / "H5"** (`merchant-validation-campaign-meta-ads.md` §9) — both cross-referenced, not restated in full here. Three new hypotheses, specific to what *this* campaign uniquely can test, given the first campaign already answered the reach question and found (but couldn't localize) the adoption problem:

**Hypothesis F — A hypothesis-specific, guided-hook video performs at least comparably to Campaign 1's static image on top-of-funnel efficiency, despite carrying a heavier disclosure obligation.**
- *Supporting evidence:* CTR and cost-per-Landing-Page-View at or better than Campaign 1's real MXN $0.99 CPV baseline.
- *Invalidating evidence:* materially worse CTR/CPV despite the same broad audience/geography — would suggest video underperforms for this specific audience/platform mix, or that the longer disclosure requirement (Beat 4a/4b) costs more attention than a single static image's brief caption did.
- *Decision this feeds:* whether video becomes the default creative format for future validation-recruitment rounds, or whether static images remain preferable for cheap reach pulses specifically.

**Hypothesis G — The Stage 4-7 collapse Campaign 1 could only observe as one opaque block is a real, localizable bottleneck at a specific stage, not evenly distributed across all four.**
- *Supporting evidence:* a clear, disproportionate cascade drop concentrated at one of `demo_pass_through_reached` → `demo_otp_completed` → `demo_onboarding_completed` → `demo_sale_completed`, once production delivery is confirmed (Step 0, §8).
- *Invalidating evidence:* a roughly even, gradual falloff across all four stages with no single disproportionate drop — would suggest general friction/attrition rather than one fixable bottleneck.
- *Decision this feeds:* which Approved spec (`authentication.md`, `onboarding.md`, or `home.md`'s selling flow) gets the next UX-remediation attention — the exact question `merchant-validation-funnel-diagnosis.md` named as Tier 1's own largest, most consequential unknown.

**Hypothesis H — `demo_sale_completed`, a Form-independent behavioral event, is a viable scalable proxy for H1's own task-completion signal, corroborating (or diverging from) the thin n=2 self-report baseline on file.**
- *Supporting evidence:* a `demo_sale_completed` rate (as a share of Landing Page Views or `demo_pass_through_reached`) directionally consistent with what the two genuine Campaign 1 respondents' own Task 4 self-report suggested.
- *Invalidating evidence:* a `demo_sale_completed` rate near zero despite healthy upstream counts — would suggest the guided video's own promise (fast, uninterrupted selling) doesn't survive contact with the actual interaction, a real and different finding from a pure top-of-funnel or Form-completion problem.
- *Decision this feeds:* whether future campaigns can rely on this event as a primary success metric on its own, reducing dependence on the Form (and its own §11 length/friction questions) for measuring task completion specifically.

**Cross-campaign confound, stated explicitly, not glossed over:** comparing this campaign's own numbers to Campaign 1's is not apples-to-apples, per the same caution `merchant-validation-strategy-v2.md` §6 already names for comparing Campaign A and B to each other — different creative, a materially different product state (the OTP fix, the reminder banner, and all six analytics events postdate Campaign 1 entirely), and a different point in time. Read any Campaign-1-vs-this-campaign delta as directional signal, never a controlled result.

---

## 10. Ads Manager implementation guide

A complete walkthrough, current as of a live 2026 check — confirm each step against what's actually on screen, the same standing caution Campaign 1's own guide carries. **Prerequisites already satisfied, not re-walked from scratch:** Campaign 1 already ran successfully through this same Meta Business Manager / Ad Account / Facebook Page / Instagram account, per `company/marketing-operating-environment.md`'s provisioning model — Step 0-3 below are confirm-not-repeat steps, not a fresh account setup.

### Step 0 — Confirm existing account state (not a fresh setup)

Confirm the Nahui Facebook Page, linked Instagram Business account, Meta Business Manager, and the MXN-denominated Ad Account with a working payment method all still exist and are active — the same account Campaign 1 already used successfully. No new account creation should be needed.

### Step 1 — Open Ads Manager, start a new campaign

`adsmanager.facebook.com`, green **+ Create** button. **Do not** duplicate or edit Campaign 1's existing (closed) campaign object — build a genuinely new one, per §0's own reasoning.

### Step 2 — Buying type

**Auction** (default), unchanged from Campaign 1.

### Step 3 — Campaign objective

**Traffic** (§1). Name it distinctly from Campaign 1, e.g. `Nahui — Campaign B Video Ago2026`.

### Step 4 — Campaign-level settings

Leave **Advantage Campaign Budget** off (one ad set, budget set at ad-set level, Step 7). Skip the A/B-test toggle — this campaign deliberately runs one ad, one creative (§6's own reasoning against a video-vs-image split this round).

### Step 5 — Ad Set: conversion location and optimization goal

**Conversion location: Website. Performance goal: Landing Page Views** (§1). Leave Meta Pixel/Conversions API blank — still no pixel on `demo.nahui.app`, unchanged from Campaign 1.

### Step 6 — Audience

Enter §2/§3's settings: Locations — Estado de México + Ciudad de México, two separate entries. Age 22-60. Gender: All. Detailed targeting: 2-3 broad interest terms, Advantage Detailed Targeting on.

### Step 7 — Budget and schedule

Per §6: **Lifetime Budget, MXN $750** (or MXN $500 if the closest-comparability alternative is chosen instead — a genuine PO call, not defaulted). Explicit Start/End datetime spanning the chosen window (4 days for the primary recommendation, 3 for the alternative). **Do not leave End Date blank.** Set an **Account Spending Limit** matching the chosen budget as a hard backstop.

### Step 8 — Placements

**Advantage+ Placements (Automatic)** (§4). Do not switch to Manual.

### Step 9 — Ad level: identity and format

Select the Nahui Facebook Page (and linked Instagram account). **Ad format: Single Video** (§5a) — not Single Image, not Carousel. Upload `campaign-b-final-v3.mp4`.

### Step 10 — Thumbnail selection

Per §5b: manually scrub to roughly the 0:02.5–0:04.0 mark (inside Beat 1b's hold) and select that frame as the cover image. Do not accept the auto-selected default without checking it first, given this creative's hard-cut-heavy editing.

### Step 11 — Captions

Confirm no automatic-caption toggle is enabled on top of this video's own burned-in captions (§5c). If Ads Manager defaults this on, turn it off explicitly.

### Step 12 — Ad creative fields

Paste in the Primary Text, Headline (Option A recommended for immediate launch, per §5d), Description, and CTA button from §5d exactly as drafted. Set the **Website URL** to `https://demo.nahui.app`.

### Step 13 — URL parameters (tracking)

Under the ad's **Tracking** section, use the **"Build a URL parameter"** field to add: `utm_source=meta&utm_medium=paid&utm_campaign=campana_b_video_ago2026&utm_content=v3` (§5e).

### Step 14 — Preview across placements — the one step this campaign needs that Campaign 1 didn't

Use the Preview panel to check this specific video across Feed, Stories, and Reels. Confirm: (a) the upper-third hook text and lower-third captions are not cropped in any format (§4's mandatory check); (b) Primary Text isn't awkwardly truncated; (c) the selected thumbnail (Step 10) renders as intended, not blank or mid-transition.

### Step 15 — Publish, with review-time buffer

Submit at least several hours — ideally the day before — the intended start time, same reasoning as Campaign 1 §16 (Meta's review can take up to ~24 hours).

### Step 16 — Confirm dashboard delivery for all six analytics events — before treating any campaign data as clean

Per §8 Step 0: open the Vercel Analytics dashboard for `demo.nahui.app` and confirm `demo_pass_through_reached`, `demo_otp_completed`, `demo_onboarding_completed`, `demo_sale_completed`, and `demo_paid_plan_activated_midsession` are visible and counting real events (`demo_questionnaire_cta_click` is already confirmed). This should happen before or immediately upon launch, not discovered as a gap partway through the campaign window.

### Step 17 — Monitor daily

Check Reach, Landing Page Views, CTR, Amount Spent (Ads Manager) and all six event counts (Vercel Analytics) once a day during the campaign window. Cross-check the Google Form's response count against the same window, same convention as Campaign 1 §17.

### Step 18 — Confirm it actually stopped

At the end of the window, confirm the campaign's status shows ended/no longer delivering — same discipline as Campaign 1 §18.

### Common first-timer mistakes — carried forward, plus video-specific additions

All nine of Campaign 1's own named mistakes (§10 there — no End Date, wrong currency, using Boost Post instead of Ads Manager's Create flow, Manual Placements without data, over-stacking Detailed Targeting, overselling copy, visible device chrome in a static image, assuming "In Review" means live, not cross-referencing Form completions against the exact window) still apply and aren't re-derived here. **New, specific to this campaign:**

10. **Editing Campaign 1's existing campaign object instead of creating a new one** — corrupts a closed, already-analyzed campaign's own historical metrics. Always start fresh (Step 1).
11. **Accepting Meta's auto-selected video thumbnail without checking it** — a real risk on this hard-cut-heavy edit; a mid-transition frame reads as broken or incoherent. Always manually select (Step 10).
12. **Leaving Meta's automatic captions on** — duplicates and risks colliding with this video's own carefully positioned burned-in captions (Step 11).
13. **Not checking the Preview panel for upper-third text cropping in Feed's vertical-video handling** — this creative has content placed specifically to avoid this on native 9:16 surfaces; Feed's own crop behavior is the one placement genuinely worth a dedicated look (Step 14).
14. **Treating any of the five newly-built analytics events as reliable data before confirming production dashboard delivery** — five of six events in §7b are built and reviewed but not yet dashboard-confirmed; spending real budget before Step 16 risks a campaign's worth of "evidence" that turns out to be an unconfirmed instrumentation gap, not a real behavioral finding.

---

## Summary of top recommendations, one line each

1. **Not a relaunch — a new, independent campaign object**, Wave 1's Campaign B of the already-approved Strategy v2 program, complementary to (not sequenced strictly before/after, and materially more launch-ready than) the not-yet-launched Concierge/DM pilot.
2. **Objective, Audience, Geography, Placements: unchanged from Campaign 1**, re-confirmed rather than re-derived — reach/delivery were never the diagnosed problem.
3. **Creative: single video ad**, `campaign-b-final-v3.mp4` — manually selected thumbnail (~0:02.5–0:04.0), no platform auto-captions on top of the already burned-in ones, Primary Text/Headline/CTA built by reusing already-brand-reviewed script lines, one Preview-panel check specific to vertical-video Feed cropping.
4. **Destination: `demo.nahui.app` (button) + Form link (plain text, now genuinely redundant thanks to the persistent reminder banner built since Campaign 1)** — with one honest, still-open gap named plainly: the Campaign-B-specific welcome-screen guidance sentence was drafted but never built or wired.
5. **Budget: MXN $750/4 days recommended (MXN $500/3 days as a closest-comparability alternative)**, Lifetime Budget, explicit End Date, Account Spending Limit backstop, one ad set/one ad — a video-vs-image A/B test considered and explicitly deferred, not run this round.
6. **Success metrics: three tiers** — Meta native (including new video-view diagnostics), six client-side analytics events mapped directly to `merchant-validation-funnel-diagnosis.md`'s own 11 stages (only one of six confirmed delivering to production as of this writing — confirming the other five is Step 0, mandatory, before any spend), and the unchanged Google Form mechanism.
7. **Decision playbook: for the first time, a real stage-by-stage localization is possible** — this campaign can distinguish an Authentication problem from an Onboarding problem from a selling-flow problem from a Form-transition problem, resolving several indistinguishability findings the source documents left explicitly open.
8. **Learning agenda: continues H1 and H5 (cross-referenced, not restated)**, adds three new hypotheses (F: video creative efficiency, G: localizing the Stage 4-7 collapse, H: `demo_sale_completed` as a scalable H1 proxy) — each falsifiable, each naming the decision it feeds.
9. **Implementation: an 18-step walkthrough**, 9 mistakes carried forward from Campaign 1 plus 4 new ones specific to video creative and the new instrumentation dependency.
