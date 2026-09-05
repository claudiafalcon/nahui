# Nahui — Concierge/DM Validation Pilot: Qualification & Discovery (2026-08-20, reframed 2026-08-27)

**Status: Approved by the Product Owner, 2026-09-03 — content and caps signed off in full.** Not yet live: the Beat 4b video variant (§4) still needs to be built, and Instagram Business Suite's Instant Reply/automation tooling still needs to be confirmed against the real account (§3 item 5) before anything is actually published. No ad published, no Instagram automation configured, no message sent as of this status line. Prepared by `marketing` at the Product Owner's direct request, following the Product Owner's review of this agent's earlier DM-feasibility analysis and a parallel `knowledge-mentor` consultation on Concierge MVP methodology.

---

## Supersession note (2026-08-27) — read this before anything below

This document originally set out to diagnose *why self-serve demo visitors don't complete* (CP1-CP5, funnel non-completion). Cross-functional review (`reviewer`, `marketing`, `architect`) plus a code-and-production audit of the actual `demo_*` instrumentation established, with direct evidence, that a DM-first funnel **structurally cannot observe that population**: of 227 real visitors who saw the demo with full instrumentation live (confirmed via the Vercel dashboard, timestamped precisely against when the events shipped), 225 never took a single action — they're anonymous, silent, unreachable. A DM respondent is, by construction, someone willing to engage in conversation — a categorically different population from someone who bounced before doing anything. Better data didn't resolve this tension; it sharpened it.

**What changes, logged as a dated amendment per §7's own discipline, not a silent edit:**

1. **Objective reframe.** This pilot no longer targets CP1-CP5 (funnel non-completion diagnosis). It targets **H1** (`market-validation.md` — problem-fit/ICP validation: does Nahui solve a real problem for this merchant, does the value proposition land, what language builds trust). CP1-CP5 as a *diagnostic frame for anonymous first-screen abandonment* is retired from this pilot's scope. The anonymous-bounce question is real, well-evidenced now, and higher-priority than previously known — it's being investigated separately (technical/UX audit of the first screen + the dominant Android/mobile/Mexico segment, and the CP5 null hypothesis — low-intent ad clicks — is a live candidate), not through this instrument.
2. **Two independent loops, not one.** See new §0 below.
3. **Everything in §2-§6 (campaign sizing, Instant Reply, discussion guide mechanics, tone discipline) survives unchanged** — none of it depended on the CP1-CP5 framing specifically. §6.2's branch-check and §7's evidence framework are the parts that actually get reframed (below).
4. **A related product proposal — restructuring the demo itself to lead with a completed sale before setup, for DM-qualified merchants specifically — was evaluated in parallel (`architect`, `ux-designer`) and is logged as a genuinely open, deferred Product Decision (`product/02-ux/product-decisions.md` Q19), not built now and not pre-decided.** See §0.3.

**The Product Owner's directive, quoted directly because it governs every design choice below and must not be softened in translation:**

> Do not treat the phone wall as the diagnosed cause yet. Wave 1 did not give us enough instrumented evidence to distinguish between phone-entry friction, lack of understanding of the demo's value, perceived effort, trust, or another cause. The instrumentation was added too late in the campaign to make that conclusion. Proceed with a small Concierge/DM pilot as a learning experiment, not as a replacement for self-serve. The objective of the DM pilot is to discover WHY people are not starting the demo, including whether phone entry is actually one of the barriers.

Everything in this document is built to answer that question honestly — including the real possibility that the answer implicates none of the four named candidates, or several at once, or something not yet named.

**On the referenced Concierge MVP consultation:** this document does not have that consultation's specific text on hand — it was routed and returned outside this dispatch. Where this design leans on Concierge MVP theory (Eric Ries' "manually deliver the service by hand, behind the scenes, before automating it" pattern — do the unscalable thing on purpose, to learn, not to launch a channel), that's this agent's own general knowledge (Model Knowledge tier, `company/CLAUDE.md`'s Knowledge Mentor tiering), not a citation of that specific consultation's findings. The core Concierge MVP discipline this design does apply throughout: keep automation to the absolute minimum needed to not lose people entirely (one Instant Reply), and put a real human in every substantive exchange — the opposite of a scaled acquisition channel, on purpose.

---

## Companion documents, referenced not duplicated

- `company/merchant-validation-funnel-diagnosis.md` — the original funnel non-completion diagnosis. As of 2026-08-27 (supersession note above), this pilot no longer targets the same question — a code/production audit established the anonymous-abandonment population this document describes is unreachable by a DM instrument. That investigation continues separately (technical/UX audit + the CP5/null-hypothesis line of inquiry), not through this pilot.
- `company/merchant-validation-campaign-meta-ads.md` — the first Meta Ads campaign (Traffic objective, Landing Page Views, MXN $500/3 days). This pilot reuses its audience/geography/placement settings (§2/§4 there) and its budget-discipline conventions (Lifetime Budget, explicit End Date, Account Spending Limit backstop) — differences are stated explicitly in §2 below, not re-derived.
- `company/merchant-validation-strategy-v2.md` §2.2 — Campaign B ("Venta rápida"), the hypothesis-specific video campaign this pilot's creative is built on. Tests the same H1 core hypothesis this pilot's Loop 1 now gathers DM-sourced evidence for (§0, reframed 2026-08-27).
- `company/merchant-validation-campaign-b-storyboard.md` — the storyboard. **Asset reference corrected 2026-08-27:** the actual current, reviewed, approved Campaign B video is `company/campaign-assets/campaign-b-draft/final/campaign-b-final-v3.mp4` (29.31s) — the file this section previously pointed at (`campaign-b-draft.mp4`) was superseded twice since this document was written and is now in `final/superseded/`. §4/§5 below reuse this current asset; beat timings referenced there should be re-verified against v3 specifically before building this pilot's creative variant, since v3's redesign (disclosure-card differentiation, receipt glow, freeze-hold ring) may have shifted exact beat boundaries from what's stated below.
- `company/usability-testing-plan.md` §1.3 (moderated-vs-unmoderated reasoning) and §7.2b (referral-first recruitment script, tone/rigor precedent) — the established precedent for moderated, trust-aware qualitative recruitment this pilot's discussion guide (§6) is built from, per the Product Owner's own instruction not to reinvent it.
- `company/merchant-validation-decision-matrix.md` — the default threshold convention (3+ of a first batch of 10 = candidate signal; the same pattern at a second batch of 10, n≥20 = approaching confirmed; real n=10 margin ±31pp, not the looser ±20pp figure). §7 below adapts this convention to qualitative DM coding rather than restating it from scratch.
- `company/marketing-operating-environment.md` — Instagram's existing account/access model (§3 there: Product Owner-owned Business account linked to the Facebook Page, "every DM needs approval," human-hand-on-every-send). This pilot is fully consistent with that existing policy, not an exception to it — it's the policy's logical shape applied to a deliberate experiment instead of ad-hoc outreach.
- `company/market-validation.md` H1 (§1/§6) — this pilot's actual objective as of 2026-08-27: a second, DM-sourced evidence stream for H1 (registration-friction generalization), alongside the survey/interview channel already scoped there.

---

## 0. Two-loop structure (added 2026-08-27, supersedes the single-loop CP1-CP5 design; Loop 2's own mechanism updated 2026-09-04, see §0.3)

The DM conversation is no longer asked to explain anonymous demo abandonment. Instead it does what it's actually suited for — qualification and discovery — and hands off into a second, independent loop with its own dedicated, minimally-instrumented entry point:

```
Ad → DM conversation (§6, mostly unchanged, see §0.1)
   → short qualification (3-5 natural questions, already the shape of §6.3-6.5)
   → does Nahui appear to solve a real problem for this merchant? (H1 signal)
   → if yes: "¿quieres probar un demo de 2 minutos?" → send the Acceso DM link
     (https://demo.nahui.app/?acceso=dm)
   → she lands directly on a working, sellable sample catalog — no
     phone/OTP screen, no path-choice screen (product/02-ux/acceso-dm.md)
   → acceso_dm_* instrumentation (four count-only events: opened, sale
     completed, session closed, Results viewed) captures where she gets to
   → optional follow-up: "¿llegaste a probarlo? ¿en qué parte te trabaste?"
```

**Loop 1 — the conversation itself** tells us who the ICP really is, whether the problem resonates, how merchants describe it in their own words, what builds trust. This is what §6's discussion guide already collects; see §0.2 for the specific reframe.

**Loop 2 — the demo, for an already-qualified population** tells us where genuinely interested merchants still struggle *inside the product*, a different and more useful signal than an anonymous bounce rate. What this loop deliberately does NOT do, decided explicitly rather than left ambiguous:

- **It does not modify the self-serve flow, and anonymous/organic traffic still reaches exactly what it always has.** **Corrected 2026-09-04 (`decision-log.md` D52):** Acceso DM now lives inside the same `demo.nahui.app` build (moved there from an earlier, since-superseded design that shipped it in the real production bundle instead) — not a separate domain, but still a separate, marker-gated (`?acceso=dm`) entry point with zero effect on any visitor whose URL doesn't carry that marker. `demo-mode.md`'s own Welcome screen, Authentication pass-through, and `ReminderBanner` are otherwise completely unmodified. One real, accepted side effect worth knowing when reading the dashboard: because `ReminderBanner` (and its `demo_*` event suite) now also composites for Acceso-DM-arrived merchants, those events no longer distinguish DM-pilot traffic from ordinary self-serve visitors — the separate, dedicated `acceso_dm_*` events (`product/02-ux/acceso-dm.md §2.4`) remain the reliable, DM-pilot-only signal. Acceso DM is reached only via a link the Product Owner sends directly in a qualified DM conversation, never discoverable any other way (`product/02-ux/acceso-dm.md`'s own placement ruling, `decision-log.md` D51/D52).
- **It now does skip Authentication — a deliberate, later correction to this section's original reasoning, not an oversight.** This section originally kept phone/OTP in Loop 2 specifically to preserve the option of learning whether phone-entry is a barrier for a genuinely-interested population. The Product Owner revisited that tradeoff directly (2026-09-03/04): that research question was secondary to the pilot's actual goal — a value-first first impression for a population that already built trust in conversation — and not worth damaging the experience to preserve, especially once the prior campaign's own funnel data (§2, `merchant-validation-funnel-diagnosis.md`) showed essentially no real downstream progression to begin with. PF5 (§7) is unaffected by this change — it's scored from Track 2 of the DM conversation itself (§6.4.3, someone who already tried `demo.nahui.app` on her own, before this conversation), a population Acceso DM's own link never touches.

**Attribution caveat, named honestly:** `acceso_dm_*` events are anonymous/aggregate, same discipline as the retired `demo_*` suite — no per-visitor ID, no PII. There is no automatic way to link a specific instrumented demo session back to a specific DM conversation. The reliable mechanism is the optional follow-up question in the flow above (self-report) — treat anything from the dashboard itself as directional corroboration only, never as individual attribution. **Not carried forward from the prior campaign, deliberately:** the earlier Meta Ads campaign's own funnel data showed essentially no meaningful real-user progression past the first stage — the few downstream events observed were the Product Owner's own internal testing, not real prospects (`company/bitacora.md`, internal record only, never disclosed in external-facing material). This pilot's population and funnel are different enough that continuity with that prior instrumentation was judged not worth preserving as a constraint on this design.

### 0.1 Discussion guide status

§6 (Instant Reply, discussion guide, standing probes, tone check) needs no structural rewrite — a 3-5 question qualification conversation asking about her business, whether the problem resonates, and what she'd tell someone else about Nahui is the same shape of conversation whether the downstream use is CP1-CP5 coding or H1 signal collection. What changes is §6.2's branch-check purpose (§0.2) and how answers get coded (§7, reframed).

### 0.2 §6.2's branch-check, reframed

The original branch-check ("¿ya le entraste a la app... o el video fue lo único que has visto?") was designed to route into CP1-CP5 coding for people who already saw the demo unprompted. Under the two-loop design, that question no longer routes to a different question set — Track 1/2's downstream questions (§6.3/§6.4) still work fine as-is for H1 signal (problem-fit, comprehension, trust), since none of them actually depended on being able to explain funnel abandonment. Keep the question, drop its role as a CP1-CP5 gate.

### 0.3 Value-first demo sequencing — evaluated, approved, shipped as Acceso DM (2026-09-04)

**Status: shipped, not merely planned.** Everything below this line is the original evaluation, kept verbatim as the honest paper trail of how this design evolved (same non-deletion discipline as `market-validation.md`'s own retired §7 and this document's own §7.6). What actually got built diverged from what's described below in one real respect: **not a new, kept, ongoing fourth Onboarding path.** A later round of scoping (2026-09-03/04) found that requirement unnecessary — the demo/sample experience never needs to convert into her real Business/account at all — which allowed a much smaller design: a dedicated entry route (`product/02-ux/acceso-dm.md`, `decision-log.md` D51) that composes the existing, already-shipped "Ver un ejemplo" mechanism (`decision-log.md` D19) behind a fixed demo-only credential, skipping Authentication entirely rather than deferring it to a conversion moment. See `product/02-ux/product-decisions.md` Q19–Q22 (marked Superseded) for the full intermediate reasoning this shipped design replaced. §0's flow diagram and non-goal list above reflect what actually shipped, not this subsection's original plan.


The Product Owner separately proposed restructuring the demo so a DM-qualified merchant's *first* meaningful interaction is a completed sale (a pre-loaded representative catalog), with business/product/inventory customization explained afterward — instead of today's sequence (auth → identity → catalog naming → still-zero-stock → inventory registration → first sale, verified precisely by `ux-designer` against the current Approved specs and code).

**Findings, from parallel `architect` + `ux-designer` review:**
- The instinct is sound specifically for DM-qualified entrants (their trust-building already happened in conversation, before touching the link) — not a general case for cold self-serve traffic, where pre-filled data would read as presumptuous.
- No domain-model blocker (`architect`): `Sale`/`Product`/`Business`/`InventoryUnit` are structurally agnostic to how data was created; the write path (`commitLot()`) already exists and is proven via the "Ver un ejemplo" path.
- **But "Ver un ejemplo" is the wrong vehicle, not a shortcut to this.** It's explicitly non-convertible/disposable (`decision-log.md` D19 — "no es tu negocio real, y no vas a poder convertirlo en tu negocio real después"). This proposal wants a real, kept, ongoing Business that merely starts pre-populated — a genuinely new, fourth Onboarding path, not a relabeling of the third one. That needs its own spec section, its own name (not "ejemplo," not "demo" — both already reserved and disclosed for other concepts per `demo-mode.md`'s own scope note), a distinct entry point/link so self-serve traffic is untouched, and a new `decision-log.md` entry.
- A pre-filled, not-her-own catalog demonstrates the *mechanic* feels fast — it doesn't, on its own, validate that *her* actual catalog/inventory friction (the project's core thesis, `company/CLAUDE.md`) is solved, unless the "make it yours" transition afterward is real and immediate, not an afterthought.
- Authentication must stay in this flow too, for the same reason as §0's Loop 2 — deferring it would foreclose ever learning about phone-entry friction from a population that would otherwise be worth asking.

**Decision, updated 2026-08-27: build before this pilot launches.** Originally deferred pending Loop 2's own evidence, on the reasoning that a new Onboarding path was a speculative investment. The Product Owner corrected the framing: this isn't a pilot-driven optimization to validate before spending engineering effort — the setup-before-value sequence (identity → catalog → inventory, all before a first sale) is a structural gap in Onboarding itself, independent of whether the DM pilot ever runs. The pilot's own measurement integrity is unaffected either way, confirmed: the `demo_*` instrumentation watches state transitions (auth completed, onboarding completed, a sale finalized), not which path reached them, so building this first loses no evidence Loop 2 would otherwise have collected. See `product/02-ux/product-decisions.md` Q19 (resolved) and Q20 (a complementary structural change — merging initial inventory capture into product creation — bundled into the same amendment, pending an `architect` check). Next: `ux-designer` drafts the combined `onboarding.md` amendment once Q20 clears.

Logged as a Product Decision, not decided here — recorded as Q19 in `product/02-ux/product-decisions.md`, cross-referenced from `onboarding.md`'s own "Future considerations" section (§11).

---

## 1. Non-goals — stated plainly, binding on this document and on how its findings get used

1. **The phone/OTP step in the self-serve flow is not being removed, redesigned, or touched based on this pilot alone.** Any UX change to `authentication.md`'s real screens stays gated on confirmed evidence (§7's threshold convention) and is a separate Product Decision, routed through `product/02-ux/product-decisions.md` per the standard Decision Ownership policy — never resolved unilaterally from this pilot's own findings, however suggestive. **Distinct from Acceso DM's own credential bypass (§0.3):** that's a fixed demo-only fixture scoped entirely to this pilot's own dedicated entry route, never a change to the real Authentication screens or mechanism every other merchant still sees — see `product/02-ux/acceso-dm.md`'s own non-goals for the full boundary.
2. **The self-serve funnel and its existing instrumentation stay fully intact and running, unmodified by this pilot.** `demo.nahui.app`, its Demo Mode welcome screen, the persistent Form-reminder banner, and the pending Stage 4-7 `track()` events (`merchant-validation-funnel-diagnosis.md`) continue exactly as already designed. This pilot's findings are meant to be read *alongside* that self-serve data once both exist, not in place of it.
3. **This pilot is explicitly not a replacement acquisition channel, and not a pivot to concierge-style, human-mediated onboarding as Nahui's standing model.** It is a bounded, time-boxed diagnostic experiment. If it produces useful signal, the next step is a decision about what (if anything) to fix in the self-serve flow — not a decision to keep running DM campaigns instead of self-serve.
4. **This pilot does not, on its own, confirm or reject H1, or any of the PF1-PF5 signal categories (§7).** At the sample size this design can realistically produce (§2), every finding is a candidate signal per the same confidence discipline this project already holds itself to everywhere else (`market-validation.md`, `merchant-validation-decision-matrix.md`) — never a resolved conclusion from n=10-20 DM conversations alone.

---

## 2. Campaign design and sizing — capped for one person, not just "small"

### 2.1 What changes from the existing Meta Ads playbook, and what doesn't

Everything not listed as changed below reuses `merchant-validation-campaign-meta-ads.md`'s already-reasoned-through settings directly — same audience definition, same geography, same placements. Keeping every non-essential variable identical to the already-run campaign is deliberate: it keeps this a clean single-variable test (objective/CTA/destination, not audience or targeting) and avoids reintroducing confounds this project has already worked to eliminate elsewhere.

| Setting | This pilot | Reused from `merchant-validation-campaign-meta-ads.md` |
|---|---|---|
| **Objective** | **Engagement** (not Traffic) | — |
| **Conversion location** | **Instagram Direct** | — |
| **Performance goal** | Maximize the number of message conversations started (Meta's exact on-screen naming for this varies by rollout — confirm live, same discipline `merchant-validation-campaign-meta-ads.md` §1 already applies to its own objective picker) | — |
| **CTA button** | **Enviar mensaje** ("Send Message") | — |
| **Creative** | Campaign B's current video (`campaign-b-final-v3.mp4`, corrected 2026-08-27 — see companion-documents note above), with a swapped closing card — see §5 | Same video, reused as-is otherwise |
| **Audience** | 22-60, all genders, 2-3 soft interest terms, Advantage Detailed Targeting on | `merchant-validation-campaign-meta-ads.md` §2, unchanged |
| **Geography** | CDMX + Estado de México | `merchant-validation-campaign-meta-ads.md` §3, unchanged |
| **Placements** | Advantage+ (Automatic) | `merchant-validation-campaign-meta-ads.md` §4, unchanged |

**Why Instagram Direct specifically, not Messenger or WhatsApp:** Instagram is where Nahui's existing ad presence and Business account already live (`marketing-operating-environment.md` §3), and it's the channel this project's own community research has already found the ICP genuinely uses (`market-validation.md` §2). WhatsApp Business is explicitly deferred in `marketing-operating-environment.md`'s own provisioning plan ("defer until interview scheduling actually starts — no reason to hold a dedicated number idle") — standing up a new number and account for this pilot would contradict that already-made call, for no clear benefit over the channel already provisioned.

### 2.2 The actual sizing mechanism — three independent caps, not one probabilistic estimate

A dollar budget alone doesn't guarantee "answerable by one person" — a cheap, viral conversation-starter could still produce more DMs than one person can genuinely have real qualitative exchanges with. This design uses three independent, stacked caps, so the sizing claim doesn't rest on getting a cost estimate right:

1. **Budget cap: MXN $200** (Lifetime Budget, explicit Start/End datetime, Account Spending Limit backstop — same overspend-prevention discipline as `merchant-validation-campaign-meta-ads.md` §6/§10). Chosen within the previously-estimated $150-250 range, biased toward the lower end deliberately: Engagement/Messaging campaigns are conventionally more expensive per result than the Traffic/Landing-Page-View objective Nahui's only real cost data point (MXN $0.99 CPV) comes from, and this is the first time Nahui has ever run this objective type — a smaller budget reduces the real risk of an unfamiliar objective type overspending or over-delivering before the operational cap below can catch it.
2. **Window cap: 2 days** (not the prior campaign's 3), chosen shorter on purpose. A conversation-based ad accumulates a real, standing reply obligation the moment it starts delivering — a shorter window keeps that obligation from outrunning one person's actual capacity to respond same-day, before the hard volume cap (below) even needs to fire.
3. **Hard operational cap: pause the ad manually the instant cumulative message-starts reach 20 total, regardless of remaining budget or time in the window.** This is the actual sizing guarantee, not the estimate below — a probabilistic cost estimate can be wrong in either direction; a manually-enforced stop cannot. Aligns deliberately with `merchant-validation-decision-matrix.md`'s own default convention (a first batch of 10, with room to reach a second batch of 10 for the same "does it hold" check) — 20 is the smallest number that plausibly lets this pilot's evidence framework (§7) reach its own "candidate signal, checked against a second batch" bar, not an arbitrary round number.

**Estimated volume, stated with its real uncertainty, not false precision:** Nahui has no first-party cost data for a Messaging-conversion campaign — only the unrelated MXN $0.99 CPV figure from the Traffic campaign, which measures a materially lighter action (a page load, not opening a DM thread and sending a message). Using a general, unverified assumption that cost-per-conversation-started for a small-budget Messaging campaign in a comparably cost-competitive market typically runs several times the CPV figure — very roughly MXN $5-20 per conversation, though Nahui has no data point of its own to confirm this — MXN $200 plausibly produces somewhere in the range of **10 to 40 message-starts**. That range is wide on purpose, precisely because it isn't the thing doing the actual sizing work; the hard cap in point 3 is.

**Why 20 is genuinely manageable by one person, stated explicitly rather than assumed:** DM exchanges are asynchronous, not live calls — a real qualitative conversation (§6) can unfold over several short exchanges across a day or two rather than one sitting. Twenty conversations spread across a 2-day ad window plus a few days of follow-up (§2.4) averages to roughly 4-5 new or ongoing conversations a day, which is a realistic manual workload for one person doing genuine, unhurried qualitative exchanges — materially different from, and much lighter than, moderating six to eight hour-long in-person sessions (`usability-testing-plan.md` §1.2), which this project has already treated as a reasonable one-person workload.

### 2.3 SLA

- **Instant Reply (automated):** fires immediately, sub-second, the moment she taps "Enviar mensaje" or sends any first message — covers the acknowledgment gap before a human can respond (§6).
- **First human reply:** same calendar day, targeted within **4 hours** during a 9am-9pm CST window — outside that window, first thing the next morning. This is the Product Owner's own personal SLA, since this pilot is sized for exactly one person to handle.
- **Full discussion-guide exchange:** targeted completion within **48-72 hours** of first human contact, understood as an asynchronous back-and-forth (several short exchanges), not a single live session. If a respondent goes quiet mid-conversation, one gentle no-pressure follow-up after 24 hours, then let it go — per `character-bible.md`'s "gives her an honest way out of anything."

### 2.4 Monitoring cadence and stop conditions

- Check the Instagram Direct inbox **at least twice daily** during the 2-day active window.
- Continue checking **once daily for 3 additional days** after the ad stops delivering, to catch delayed replies to the Instant Reply (someone who saw the ad, messaged a day later on her own schedule, per the same asynchronous logic as §2.3).
- **Confirm the campaign actually stopped** at the end of the window (same discipline as `merchant-validation-campaign-meta-ads.md` Step 18) — don't assume the End Date setting worked without checking once.
- **Stop-early trigger:** the moment cumulative message-starts hit 20 (§2.2, point 3), pause the ad manually in Ads Manager immediately, even if budget or time remains.

### 2.5 Confounds and limitations, named honestly — not deferred to a synthesis report written after the fact

- **Self-selection for messaging, not for self-serve.** A person willing to DM an unfamiliar business account is, by definition, a different population than "everyone who saw the self-serve ad" — plausibly a population with *higher*, not lower, baseline trust/comfort, since messaging itself requires a comparable act of disclosure to entering a phone number. This means the pilot's respondents may under-represent the most phone-averse or most trust-averse share of the non-completing population, not just sample it directly. State this explicitly in any synthesis this pilot produces — don't let a low phone-friction count here be read as "phone friction isn't real," when it may partly reflect who chose to respond to a DM ask at all.
- **No retargeting capability exists.** Ideally this pilot would specifically reach people who saw Campaign B's self-serve ad and did *not* convert — the most direct population to ask "why didn't you." This isn't available: Nahui has no Meta Pixel and no Custom Audience retargeting set up (`merchant-validation-funnel-diagnosis.md` §1, `merchant-validation-strategy-v2.md` §12's confirmed architecture finding). This pilot instead draws a fresh audience from the same population definition (§2.1's table) — a population-level match, not a controlled retargeting experiment. Named here as a real limitation and a candidate future improvement, not something to build now (out of Marketing's remit, and not justified by current evidence per the same discipline `strategy-v2.md` §12 already applies to Form-delivery-mechanism changes).
- **Cross-campaign comparison isn't apples-to-apples.** Any comparison between this pilot's completion/engagement pattern and Campaign B's own self-serve numbers carries the same caveat `merchant-validation-strategy-v2.md` §6 already states for comparing Campaign A and B to each other — different objective, different creative CTA, different audience draw at a different time. Read side by side for pattern, never as a controlled A/B result.

---

## 3. Approval checklist — everything below requires explicit, itemized Product Owner sign-off before it goes live

Per `company/marketing-operating-environment.md` §14's existing workflow, applied item by item, not as a blanket go-ahead:

- [x] Ad Set configuration (§2.1) — objective, conversion location, performance goal, CTA, budget, schedule — **Approved 2026-09-03**
- [x] Creative — copy for the DM ask (§4/§5) — **Approved 2026-09-03.** The Beat 4b video variant is built (`campaign-b-dm-pilot-variant-v1.mp4`), generated with a substitute TTS voice (`es-MX-DaliaNeural`), not the real Marina/Azure account. **Product Owner decision, 2026-09-05: accepted as-is for this launch, not a blocker** — the real-voice re-record can happen later without holding up the pilot.
- [x] Instant Reply copy and quick-reply questions (§5) — **Approved 2026-09-03, redesigned and re-approved 2026-09-05** (Meta's real "Conversaciones" tool required a branching design, not the originally-assumed flat quick-reply questions — see §5's own dated amendment; brand-reviewed twice, once for the branching tree, once for the resulting §6.1b/§6.1c human openers)
- [x] Discussion guide (§6) — **Approved 2026-09-03**, including the 2026-08-27 §6.1/§6.6 rewrite, brand-reviewed 2026-09-03 (one Major fixed — see §6.1's own text)
- [x] Confirmation of Instagram Business account setup and Instant Reply/automation tooling availability (Meta Business Suite Automations) — **Confirmed 2026-09-05, Product Owner, directly against the real account.**
- [x] The MXN $200 budget, 2-day window, and 20-conversation stop-early trigger (§2.2) as the governing caps — **Approved 2026-09-03**

**Resolved, 2026-09-05:** the ad primary text (drafted late — see new §4a) and Instant Reply copy both went through `brand-guardian` review before this pilot's sign-off, per the reasoning below (1:1 conversational DM being new emotional/tonal territory for Nahui). Discussion-guide spoken lines were checked directly against `tone-of-voice.md`'s concrete rules (§6.3/§6.8) and covered by the 2026-08-20 review below.

**Brand-guardian review, 2026-08-20:** clean overall (no Blocker, no Major); three small fixes applied directly below — §5's Instant Reply copy (emoji dropped), §6.4.1's opening line (flattened to match the register `character-bible.md` requires for a neutral, not-yet-eventful action), and §6's moderator guidance (explicit acknowledge-before-next-question and menu-not-sequence instruction added). **This review does not cover §6.1/§6.6's 2026-08-27 rewrite** (front-loaded incentive, respondent-led exit) — that copy is new since this pass and needs its own `brand-guardian` check before Approval sign-off, not yet done.

---

## 4. Creative note for `ui-designer` — what the DM pilot's own CTA/ask should be

**Not redesigning the video.** Campaign B's current, approved video (`campaign-b-final-v3.mp4`, corrected 2026-08-27) is reused as-is through Beat 4a (the honest disclosure card) — nothing changes there; `ui-designer` should confirm Beat 4a's exact current timing against v3 directly rather than relying on the storyboard doc's original timestamps, since v3's redesign may have shifted them. What needs a variant is **Beat 4b only** (the CTA + incentive closing card, `merchant-validation-campaign-b-storyboard.md` §2), since its current text and voiceover point at the self-serve ask ("Pruébalo y cuéntanos si esto te serviría..."), which doesn't match this pilot's actual button destination (Instagram Direct, not `demo.nahui.app`).

**Recommended Beat 4b variant, DM-pilot version only:**

> **CTA line (large, bold), voiceover:** "Escríbenos y cuéntanos cómo llevas tus ventas hoy — nos ayuda tanto como que lo pruebes tú misma."
>
> **Incentive line (smaller, no voiceover), unchanged in spirit from the existing "acceso prioritario" convention:** "Al platicar con nosotros, quedas en la lista de acceso prioritario para cuando la app esté lista."

Reasoning for this specific line, stated for `ui-designer`/`brand-guardian` to weigh, not decided unilaterally here: it keeps the existing "both things help us equally" framing from the original CTA (`merchant-validation-campaign-videos.md`'s `[CHANGED]` line) — a real continuity worth preserving — but swaps the verb from "pruébalo" (try it) to "escríbenos" (write to us), matching the actual ask this campaign's CTA button makes. It avoids implying she's replacing the demo with a chat (still says "cómo llevas tus ventas hoy," an open invitation to talk about her business, not a sales pitch) and keeps the incentive line's wording identical to the one already brand-reviewed in the storyboard, rather than introducing new incentive language that would need its own review pass.

**What stays entirely `ui-designer`'s call, not specified here:** whether Beat 4b needs a visual change (e.g., an Instagram DM icon) beyond the copy swap, and how the swap gets built (a second export of the same video, or a platform-level creative variant if Ads Manager supports serving the same video with different end-cards to different campaigns). This document states the ask's wording only, per its own remit.

---

## 4a. Ad Primary Text and Headline — the gap this document's own §3 checklist flagged (line 167), closed 2026-09-05

Never actually drafted until now, despite §3's approval checklist referencing an "ad primary text" as something to route through `brand-guardian`. Closed via `marketing` draft → `brand-guardian` review (1 Major: cross-touchpoint redundancy with §5/§6.1, fixed) → `marketing` trim → `brand-guardian` confirmation (clean).

**Primary Text:**

> Hola, somos Nahui 💛 Este es un prototipo interactivo: así se ve registrar una venta en el bazar sin perder al cliente que tienes enfrente.
>
> Escríbenos y cuéntanos cómo llevas tus ventas hoy — nos ayuda tanto como que lo pruebes tú misma.

**Headline:** ¿Cómo llevas tus ventas hoy?

**Why the disclosure and incentive lines an earlier draft included are deliberately absent here:** a first draft reused Campaign B's own carried-forward "No es una venta, no te pedimos dinero..." disclosure and this document's own §4 incentive line ("Al platicar con nosotros, quedas en la lista de acceso prioritario...") — both individually already-cleared lines, but stitching them into the ad meant a merchant would read the same two reassurances here, then again in §5's Instant Reply ("no venderte nada"), then again in §6.1's human opener ("esto no es una venta"/"ya quedas en la lista de acceso prioritario"), within minutes. `brand-guardian` traced this as undercutting §0's own 2026-08-27 design intent — the incentive is meant to land as a personal reveal from the actual human in §6.1, not a repeat of something she already skimmed in an ad caption. Trimmed to just the opener (Beat 4a's own already-cleared line) and the plain invitation to message (Beat 4b's own CTA voiceover, verbatim) — the disclosure and incentive now land exactly once each, spoken by a human, where §0/§5/§6.1 already designed them to.

**The Headline/body echo ("cómo llevas tus ventas hoy," appearing in both fields) was checked and kept deliberately** — `brand-guardian` confirmed this is a different case from the cross-touchpoint redundancy above: one ad unit, one glance, reinforcing a single question, not a reassurance restated across separate moments in time. No change needed.

---

## 5. Instant Reply — light automated qualification, honestly disclosed as automated

**Design principle, stated once:** the Instant Reply must never pretend to be a human, and must set the expectation that a real human is coming — both because pretending otherwise breaks trust the moment she realizes it, and because `character-bible.md`'s "never claims certainty it doesn't have" extends naturally to "never claims to be someone it isn't."

**Redesigned 2026-09-05 (dated amendment, per this section's own non-silent-edit discipline) — the mechanic below replaced the original design.** The original version of this section assumed Meta's Instant Reply tooling offered simple button-based quick replies (two fixed questions, no branching). Building the real ad in Ads Manager showed the actual tool ("Conversaciones," at the ad level) works differently: a single Saludo, up to 3 custom question nodes that can branch on the tapped answer, and an optional automated follow-up message. The original two questions (zona, tipo de bazar) are preserved below, now correctly scoped to only the branch where they're coherent to ask — nested behind a new first question that screens for vendor status at all, which the old flat design had no way to do. Went through the same `marketing` draft → `brand-guardian` review cycle as §4a, twice (once for the branching tree, once for the two human openers it made necessary — see §6.1b/§6.1c below).

**Saludo (opening line, before the question tree):**

> ¡Hola! Gracias por escribirnos. Somos Nahui — un equipo que está construyendo una app para vendedoras y vendedores de bazar. Una persona de nuestro equipo (no un bot) te va a contestar en las próximas horas — queremos platicar contigo, no venderte nada.
>
> Mientras tanto, unas preguntas rápidas para conocerte mejor:

("Unas," not "dos" — the question count now varies by branch, 1 to 3, so a fixed number would overclaim.)

**Question tree, confirm live against Meta's actual branching mechanics before finalizing** (same "confirm live" discipline `merchant-validation-campaign-meta-ads.md` §1 already applies to its own objective picker — this design assumes up to 3 question nodes total, the only hard constraint confirmed as of this writing; if the tool supports fewer chained levels, drop Q3 first, geography outranks bazaar-type for triage value given the campaign is already geo-targeted to CDMX/Edomex; if the tool doesn't support true chained branching at all, fall back to the flat two-question design this replaces):

**Q1 (shown to everyone):** "¿Vendes en bazares o eventos como el que viste en el video?"
- A. "Sí, vendo en bazares/tianguis" → Q2
- B. "Vendo, pero no en bazares" → Cierre B
- C. "No vendo, tengo curiosidad" → Cierre C

**Q2 (Branch A only):** "¿Dónde vendes más seguido?" → *Ciudad de México* / *Estado de México* / *Otro lugar* → Q3

**Q3 (Branch A only):** "¿Qué tipo de bazares?" → *Bazares privados* / *Tianguis* / *Los dos* → Cierre A

These two feed the same H1 screening criteria `market-validation.md` §2b already uses (geography, private-bazaar vs. tianguis) — light context for the human follow-up, never a substitute for the actual qualitative conversation. Neither this nor Q1 collects PF1-PF5 signal (§7) — that stays §6's job, done by a human.

**Cierre A** (confirmed bazaar vendor, geo + type known — hands off to §6.1's existing human opener):

> Perfecto, gracias por contarme. Ya con esto, en un rato te escribe alguien de nuestro equipo para platicar con calma.

**Cierre B** (sells, but not at bazares — hands off to §6.1b):

> Gracias por contarme. Nahui está pensado sobre todo para quien vende en bazares o tianguis — igual alguien de nuestro equipo te escribe, por si aplica o si conoces a alguien a quien le pueda servir.

**Cierre C** (not currently a vendor / curious — hands off to §6.1c):

> Gracias por contarme. Nahui es para vendedoras y vendedores de bazar — si tú no vendes pero conoces a alguien que sí, nos ayudaría mucho que le compartas. Si te late seguir platicando, aquí seguimos — sin ningún compromiso.

**Mensaje de seguimiento (Meta's separate automated re-engagement field): leave OFF.** §2.3/§6.7 already assign the 24-hour no-pressure follow-up after a stalled conversation to a real human speaking as herself ("soy [Product Owner]") — an automated version firing into the same thread risks double-messaging a respondent or reading as if the Product Owner personally sent a line she didn't write in the moment, against `character-bible.md`'s "never claims to be someone it isn't." If this is ever revisited, it needs both a mechanism decision (who owns this moment, human or automation, never both) and, only if automation is kept, copy that self-discloses as automated the way the Saludo does.

---

## 6. Discussion guide — the pilot's actual point

*Internal use only. Spoken/typed portions are in natural Mexican Spanish, per `global-principles.md`. This is the reference script; the person handling the pilot personalizes with her name/answers but shouldn't improvise new questions mid-conversation, per the same consistency discipline `usability-testing-plan.md` §1.4 already establishes for its own standing probes.*

**Standing guidance, applies throughout — read before running the first conversation:** this guide is a menu to draw from in the conversation's natural order, not a fixed top-to-bottom sequence. If she's already answered a question spontaneously, skip it rather than asking it again — consistent with §7.2's own spontaneous-answer logic, made explicit here as guidance for whoever runs the pilot. Before moving from one question to the next, acknowledge what she actually said with a short reflective line ("Entiendo," "Tiene sentido, gracias por contarme," "Ah, ok, te entiendo") — not a new question — so that a run of direct probes back-to-back doesn't read as a checklist, especially with a respondent who answers briefly and triggers the vagueness-probe on nearly every question.

**Front-loaded incentive, respondent-led exit (added 2026-08-27):** the "acceso prioritario" incentive is granted for engaging in the conversation at all, stated up front (§6.1) — not held back as a reward for reaching the closing question (§6.6). And she decides when the conversation is done, not this guide's question count: if at any point she signals she's ready to stop, thank her and close there, without steering back toward remaining questions. This is the same "earn the right to ask the next question" principle already governing this pilot's design (time-to-value, not maximum-information-collected) — see the Standing probes (§6.7) for the explicit rule.

### 6.1 Opening (human, first message)

> Hola [nombre], soy [Product Owner], de Nahui — gracias de verdad por escribirnos. Antes que nada: esto no es una venta, no te vamos a pedir dinero. Nada más quiero entender cómo vendes en tus bazares, y si lo que viste en el video tiene sentido para ti o no — no hay respuestas correctas, y platicamos lo que tú quieras, tú decides cuándo parar. Y algo más: nada más por platicar conmigo, ya quedas en la lista de acceso prioritario para cuando la app esté lista — no tienes que hacer nada extra. ¿Tienes un ratito ahora, o prefieres que sigamos más tarde? Contesta cuando puedas, no hay ninguna prisa.

### 6.1b Branch B opener — "Vendo, pero no en bazares" (added 2026-09-05, following §5's redesign)

*Only reached via §5's Cierre B. §6.2 onward (the discussion guide proper) doesn't apply to this branch — this opener, and whatever brief exchange follows from it, is the entire human interaction for her.*

> Hola [nombre], soy [Product Owner], de Nahui — gracias de verdad por escribirnos. Vi que nos contaste que sí vendes, aunque no en un bazar. Lo que estamos armando es justo para quien vende en bazares o tianguis, así que no te voy a pedir que pruebes nada ni te voy a hacer un cuestionario. Nomás tengo curiosidad genuina: cuéntame, ¿qué vendes? Lo que te nazca contarme está bien, y si prefieres no contestar nada más, también está bien, en serio. Contesta cuando puedas, no hay ninguna prisa.

### 6.1c Branch C opener — "No vendo, tengo curiosidad" (added 2026-09-05, following §5's redesign)

*Only reached via §5's Cierre C. Same scope note as §6.1b — this is the entire human interaction, not an entry into the discussion guide.*

> Hola [nombre], soy [Product Owner], de Nahui — gracias de verdad por escribirnos, aunque no vendas en un bazar. Como ya te comentamos, si conoces a alguien que sí venda en bazares o tianguis, nos ayudaría muchísimo que le compartas esto — así como tú nos escribiste a nosotros. No hace falta que me contestes si no se te ocurre nadie, de verdad. Gracias otra vez por tu tiempo.

### 6.2 Branch check — did she reach the demo at all

*From here to §6.7, applies to Branch A only (confirmed bazaar/tianguis vendors, per §5's Q1).*

> Para empezar — ¿ya le entraste a la app que se ve en el video (demo.nahui.app), o el video fue lo único que has visto hasta ahora?

**→ Track 1 if no. → Track 2 if yes.** (Renamed from "Branch A/B" 2026-09-05 to avoid collision with §5's new vendor-status Branches A/B/C — this is an unrelated, nested branch that only ever applies within vendor-Branch A.)

### 6.3 Track 1 — never opened the demo

1. **Open, no options offered:** "¿Qué te detuvo, o qué te hizo dudar?" — wait for her actual answer before saying anything else. Log it verbatim; code it per §7 as **spontaneous**.
2. **Only if her answer is vague/non-specific** (e.g., "no he tenido tiempo," "se me pasó," "ahorita ando ocupada"): "Te entiendo, a todas nos pasa. Si te animas a intentarlo en algún momento, ¿qué esperarías que te pidiera la app al abrirla? ¿Habría algo que te hiciera dudar en meter tu información — como tu número de teléfono — o es más que no ha llegado el momento?" — a gentle, still-open nudge, offered only as a probe, never a leading confirmation. Log her answer here as **prompted**, distinct from a spontaneous mention, per §7's evidence-weighting rule.
3. "¿Qué entendiste que hace la app, nada más viendo el video?" — probes value-prop clarity independent of whether she ever tried it. **Equivalence skip:** if she already gave an equivalent answer earlier in the conversation (this overlaps with §6.5.1), don't ask it again — code her existing answer against both, note it in the log rather than re-asking.

### 6.4 Track 2 — opened the demo

1. "Ok, cuéntame: ¿hasta dónde llegaste — alcanzaste a hacer una venta de prueba, o te quedaste en algún paso antes?"
2. **Open:** "¿Hubo algún momento en el que dudaste si seguir, o que te costó más trabajo del que esperabas?"
3. **The one direct, targeted phone-entry question — asked openly, not leadingly, and only here, where she actually experienced the step:** "Cuando te pidió tu número de teléfono para entrar, ¿cómo se sintió eso? ¿Lo hubieras hecho igual si fuera una app que no conoces?" **Applicability skip:** only ask this if 6.4.1's answer confirms she actually reached the phone/OTP step before stopping — if she says she got stuck before that point, this question doesn't apply; don't ask it hypothetically.

### 6.5 Both branches converge

1. "Si tuvieras que explicarle a otra persona qué hace Nahui, ¿qué le dirías?" — value-proposition-in-her-own-words check, reusing `usability-testing-plan.md` §4 Q7's exact convention rather than inventing new phrasing.
2. "¿Esto te resolvería algo de verdad en tu día a día vendiendo, o se sintió como algo bonito pero no tan necesario?" — reusing `usability-testing-plan.md` §4 Q8's exact convention, per the Product Owner's own instruction not to reinvent Nahui's established discipline for this kind of conversation.
3. "¿Hay algo que te haya dado dudas o desconfianza de nosotros o de la app? Así sea chiquito, nos ayuda mucho saberlo." — direct, honest trust-probe.

### 6.6 Closing

> Muchísimas gracias por platicar conmigo, de verdad ayuda un montón. Como te comenté, ya quedaste en la lista de acceso prioritario. Si te late, te mando el link para que pruebes la app tú misma cuando quieras — nada obligatorio. ¿Te gustaría?

If yes, this is the Loop 2 handoff (§0): send the Acceso DM link (`https://demo.nahui.app/?acceso=dm`), log it in §8's template. If she opts in but doesn't want the link right now, that's still a valid, complete close — don't push for it.

Log the opt-in for future contact (Sí/Tal vez/No) same as before, non-blended-rate convention `merchant-validation-decision-matrix.md` §E already applies to Q16/Q17 — and log the separate Loop 2 opt-in (demo link accepted or not) distinctly, per §8's template.

### 6.7 Standing probes — use throughout, don't improvise variants mid-conversation

- **Vague or one-word answer:** "Cuéntame un poco más, ¿cómo así?" — neutral, never suggesting an answer.
- **Never confirm or guess a reason before she's named it herself** — don't say "seguro fue lo del teléfono, ¿no?" Let her get there in her own words; a guess offered first contaminates §7's evidence exactly the way a leading question would.
- **Goes quiet mid-conversation:** one gentle, no-pressure follow-up after 24 hours ("Oye, sin presión, ¿seguimos platicando cuando puedas?"), then let it go — per §2.3/`character-bible.md`'s "honest way out."
- **She asks whether she's "doing it right":** "No hay nada que hacer bien o mal aquí — nada más queremos entender cómo lo viviste tú."
- **She signals she's ready to stop, at any point, however many questions remain:** thank her and move to §6.6's closing immediately. The guide's remaining questions are never a reason to keep her — she decides when the conversation is done, not the guide's own length.

### 6.8 Tone check against `tone-of-voice.md`'s concrete rules, done explicitly rather than assumed

- States facts before framing ("esto no es una venta... nada más queremos entender") — matches the "state facts before opinion" rule.
- No urgency anywhere in the script — no deadline, no scarcity language.
- Every question reads as an invitation, never an instruction ("¿tienes un ratito?", never "cuéntanos ahora").
- Never implies she needed rescuing or did anything wrong by not finishing the demo — 6.3's opener to Track 1 is deliberately warm, not corrective.
- No technical/domain terms anywhere in the script (no "onboarding," "OTP," "conversion," "funnel") — every question is phrased in her own vocabulary about her own bazaar business.
- No performed excitement disproportionate to what actually happened (`character-bible.md`) — 6.4.1's opener stays flat/warm rather than exclamatory, since opening a demo isn't yet an accomplishment; real warmth-escalation is reserved for later in the exchange if she describes an actual completed sale or milestone.

---

## 7. Pre-registered measurement/evidence framework

**Locked as of 2026-08-20, before any DM conversation happens. Reframed 2026-08-27 (dated amendment, per the rule directly below, not a silent edit) — see the Supersession note at the top of this document.** Any change to the definitions below after the pilot begins must be logged as a dated amendment here, never silently edited — the same non-deletion, amend-forward discipline already used throughout `company/` (e.g. `product/00-foundation/decision-log.md`'s own convention) and explicitly required by the Product Owner's own framing ("written down now, before any conversation happens, so it can't be reinterpreted after the fact").

**What changed and why:** the five categories below (CP1-CP5) originally coded *why an anonymous self-serve visitor abandons the demo funnel*. Cross-functional review plus a code/production audit established that a DM respondent is structurally the wrong population to answer that question — she's self-selected as willing to engage, categorically different from someone who bounced silently before taking any action. The underlying questions (does the problem resonate, is the value prop clear, is there a trust barrier, how does phone-entry feel to someone who actually experiences it) aren't discarded — they're real, useful evidence about problem-fit (H1) and product perception from a qualified population. Four of the five (CP1→PF5, CP2→PF2, CP3→PF3, CP4→PF4) recode directly below as **PF1-PF5** (Problem-Fit signals); the fifth (CP5, the null hypothesis) is dropped as a standalone category since its function — evidence *against* a specific claimed obstacle — is now absorbed into each row's own invalidating-evidence column (§7.4) rather than needing a separate code, and **PF1 (problem recognition) is newly added**, not a recode of anything, since it's the actual core H1 signal this reframe exists to collect. All of this reuses the exact same evidence-weighting and threshold mechanics (§7.2/§7.3, unchanged), routed to `market-validation.md`'s H1 instead of to a funnel-abandonment diagnosis.

### 7.1 Five signal categories — not funnel-diagnosis codes, not ranked by likelihood

- **PF1 — Problem recognition.** The core H1 signal (`market-validation.md` §1/§6): does she recognize "losing track of a sale competes with attending the next customer" as a real, recurring, specifically-describable friction in her own business — a remembered concrete incident, not a vague "sí, a veces"? What would weaken it, same bar `market-validation.md` already sets for H1: she describes sales-tracking as a solved non-issue, or ranks it clearly below other frictions when asked.
- **PF2 — Value-prop clarity.** Can she restate what Nahui does, accurately, in her own words (§6.5.1) — independent of whether she ever opened the demo? A gap here is evidence about messaging/creative, not about whether the underlying problem is real.
- **PF3 — Perceived effort/cost.** Does she describe an assumed setup/time cost as a reason for hesitation — distinct from PF1 (is the problem real) and PF2 (does she understand the product)?
- **PF4 — Trust/unfamiliarity.** General hesitancy toward Nahui as an unknown company/app, named spontaneously or in response to §6.5.3's direct question.
- **PF5 — Phone-entry experience (Track 2 only, §6.4.3).** Kept as a direct, in-context question for anyone who actually reached that step. Not evidence about anonymous funnel abandonment (that population is unreachable by this instrument, per the supersession note) — real evidence about how a genuinely-interested, already-engaged person experiences that specific step, useful context whenever the separate anonymous-bounce investigation needs a comparison point.
- **Other, named verbatim, no pre-set code.** Any reason a respondent gives that doesn't fit PF1-PF5 is logged in her own words, not forced into one of the five — stays open by design.

### 7.2 Evidence weighting — spontaneous vs. prompted, stated once, applied to every hypothesis below

A reason she names **unprompted**, in response to an open question (§6.3.1, §6.4.2, §6.5.3), is strong evidence. A reason she confirms only after being **prompted** with a specific candidate (§6.3.2's nudge, or §6.4.3's direct phone-entry question, which is inherently a prompted context since it names the topic) is weaker evidence — real, but logged and counted separately, never blended into the same tally as a spontaneous mention. This mirrors the anti-leading discipline `merchant-validation-decision-matrix.md` already applies to Q15 (the `knowledge-mentor`-confirmed Availability Bias correction) and to Q7/Q8's spontaneous-classification design — reused here, not reinvented.

**Only spontaneous mentions, plus Track 2's direct §6.4.3 answer (asked after she actually experienced the step, not a hypothetical prompt), count toward the primary 3-of-10 threshold below.** Track 1's §6.3.2 prompted nudge answers are logged as a secondary, softer signal — reported alongside the primary count, never merged into it.

### 7.3 Threshold, adapted from `merchant-validation-decision-matrix.md`'s default convention

> A given signal (PF1-PF5) recurring — by the weighting rule above — across **3 or more of the first 10 codeable conversations** is logged as a **candidate signal**, not acted on unilaterally. The same pattern recurring in **3+ of a second batch of 10** (n≥20, reachable if the pilot's stop-early cap allows a second wave) reinforces it toward an actual decision-worthy finding. At n=10, the real worst-case 95% margin is **~±31pp**, not the looser ±20pp figure that only applies at n=20 — stated explicitly here so this instrument doesn't repeat the imprecision `merchant-validation-decision-matrix.md` itself already had to correct twice.

**What "codeable" means, stated precisely:** a conversation counts toward this n only if she gave a substantive answer to at least one of §6's open reason-seeking questions. A respondent who only interacted with the Instant Reply and never replied to the human follow-up is logged separately as **non-response** and excluded from this denominator entirely — the same discipline `merchant-validation-funnel-diagnosis.md` Stage 3 already applies to picking the correct denominator (Meta's 423 vs. Vercel's 285), reused here rather than silently inflating or deflating the codeable sample.

**Composite/multiple-mention rule:** a respondent may name more than one reason (e.g., CP2 and CP4 together) — code every reason she actually gives, don't force a single dominant code. Report each hypothesis's count independently; don't let one respondent's multiple mentions be silently treated as multiple respondents.

### 7.4 Supporting / invalidating evidence, per signal

| Signal | Supporting evidence | Invalidating evidence (weakens it, per `market-validation.md` H1's own bar) |
|---|---|---|
| **PF1 — Problem recognition** | Spontaneous mentions of a remembered, concrete lost-sale/lost-record incident, in her own words, before being asked directly; a specific description of the flow-competes-with-next-customer dynamic matching H1's own framing, offered unprompted. | She describes sales-tracking as a solved non-issue ("uso una libreta y me funciona bien"), or ranks it clearly below other frictions (cobrar, cargar mercancía, elegir bazar) when asked. |
| **PF2 — Value-prop clarity** | She can't restate what Nahui does in §6.5.1, or restates it inaccurately/vaguely; spontaneous language like "no entendí bien para qué es," "no supe qué hacía diferente." | She restates the value proposition accurately and specifically (e.g., names the speed/registration angle unprompted) in §6.5.1, whether or not she ever opened the demo. |
| **PF3 — Perceived effort/cost** | Spontaneous mentions coding to assumed setup burden, catalog entry, or general "esto me va a quitar tiempo" reasoning — said *before* or *instead of* trying. | She says she assumed it would be quick/easy, or that time cost wasn't part of her hesitation at all. |
| **PF4 — Trust/unfamiliarity** | Spontaneous mentions of not recognizing Nahui, general scam/legitimacy worry, or an explicit "no" answer to §6.5.3's direct trust question. | She names Nahui as familiar/credible (e.g., via a referral, having heard of it before), or explicitly says trust wasn't a factor when asked directly at §6.5.3. |
| **PF5 — Phone-entry experience (Track 2 only)** | Track 2's direct §6.4.3 answer describing real hesitation or genuine confusion at that step, from someone who actually experienced it. | She says the phone step felt normal/expected, comparable to other apps she already uses. |
| **Other (unclassified)** | Logged verbatim, no threshold applied at n=10-20 — if the same *unclassified* reason recurs across 3+ respondents in a later batch, it becomes a candidate for a sixth named signal in a future amendment to this document, not silently folded into one of PF1-PF5. | N/A — this bucket exists to stay open, not to be falsified. |

### 7.5 What this feeds — and, explicitly, what it doesn't

Per §1's non-goals: every outcome above tops out at **candidate signal**, never a unilateral resolution. **PF1 findings route to `company/market-validation.md`, as a second, DM-sourced evidence stream feeding H1 directly** (alongside the survey/interview channel already scoped there — same signal, different channel, both tagged by origin, never blended, per this project's standing evidence-tiering discipline). **PF2-PF4 findings route to `product/02-ux/product-decisions.md`** when they implicate a genuine UX/product question, per standard Decision Ownership — never resolved unilaterally from this pilot's own findings. **PF5 is logged and retained, not routed anywhere for action** — it's context for a possible future anonymous-abandonment investigation, not actionable on its own since it doesn't represent that population (per the supersession note). Escalation past "candidate" requires the same second-batch-of-10 pattern this project already requires everywhere else, or independent corroboration from another source, the same bar `market-validation.md` already sets for "Validated."

### 7.6 Superseded CP1-CP5 framework — retained as dated historical record, no longer the operative framing

**Status note added 2026-08-27 (`reviewer` caught that the original 2026-08-27 edit deleted this content instead of preserving it, violating the "never silently edited" rule stated at the top of §7 — corrected here).** This is the original CP1-CP5 funnel-non-completion coding framework (§7.1/§7.4 as first written 2026-08-20), kept below unedited, for the same two reasons `market-validation.md`'s own retired §7 states for itself: (1) the underlying reasoning (evidence-weighting logic, the specific candidate-cause language) stays genuinely useful input if an anonymous-abandonment instrument is ever designed for real; (2) it's an honest paper trail of how this pilot's design evolved, consistent with not silently rewriting something that was already reasoned through and locked. **Nothing below should be read as this pilot's active coding framework — §7.1-§7.5 above (PF1-PF5) is the operative version as of 2026-08-27.**

**Original 7.1 — Five candidate hypotheses — not four, and not ranked by likelihood**

The Product Owner named four; this document adds a fifth as the honest null hypothesis a diagnostic study needs, so the framework isn't structurally forced to find a product-side cause even when there isn't one.

- **CP1 — Phone-entry / OTP friction.** She is deterred specifically by being asked to enter her phone number and a verification code — whether from privacy concern, distrust of giving her number to an unfamiliar app, or literal confusion about the step (the historical OTP-disclosure bug is fixed as of 2026-08-16, but a *new*, post-fix instance of this confusion would still be a real, current finding, not an echo of the old bug).
- **CP2 — Unclear value proposition.** She doesn't understand, from the ad/video alone, what the app actually does or how it differs from what she already does — a comprehension gap independent of anything inside the demo itself.
- **CP3 — Perceived effort.** She assumes trying it will cost real time or setup work (entering a catalog, learning a new interface) that competes with time she'd rather spend selling — a cost she assumes *before* trying, distinct from CP1 (a specific step) and CP2 (not understanding what it's for).
- **CP4 — Trust / unfamiliarity.** General hesitancy toward an unknown company or app, not specifically about the phone number — e.g., worry about a scam, about her data, or simply not recognizing Nahui as a real, legitimate thing.
- **CP5 — No real barrier; attention/context mismatch (the null hypothesis).** She saw the ad passively while scrolling with no real intention to act at that moment; clicking through and then doing anything further requires a context switch that has nothing to do with the product itself — a naturally low-intent ad interaction, not evidence of any product-side problem.
- **Other, named verbatim, no pre-set code.** Any reason a respondent gives that doesn't fit CP1-CP5 is logged in her own words, not forced into one of the five — this stays open by design, per the Product Owner's own instruction not to prejudge the answer set.

**Original 7.4 — Supporting / invalidating evidence, per hypothesis**

| Hypothesis | Supporting evidence | Invalidating evidence |
|---|---|---|
| **CP1 — Phone-entry/OTP friction** | Spontaneous mentions coding to "no quise dar mi teléfono," "me dio desconfianza meter mi número," "no supe qué código poner," "no me llegó nada" — in her own words, before being asked about the phone step specifically. Branch B's direct §6.4.3 answer describing real hesitation or a real point of confusion at that step. | She names a different reason entirely when asked openly (§6.3.1/§6.4.2), and — when the direct §6.4.3 question is asked in Branch B — says the phone step felt normal/expected, comparable to other apps she already uses. Branch A respondents who, even after the §6.3.2 nudge, say the phone number specifically wasn't a concern. |
| **CP2 — Unclear value proposition** | She can't restate what Nahui does in §6.5.1, or restates it inaccurately/vaguely; spontaneous language like "no entendí bien para qué es," "no supe qué hacía diferente." | She restates the value proposition accurately and specifically (e.g., names the speed/registration angle unprompted) in §6.5.1, even if she never opened the demo. |
| **CP3 — Perceived effort** | Spontaneous mentions coding to assumed setup burden, catalog entry, or general "esto me va a quitar tiempo" reasoning — said *before* or *instead of* trying, distinct from a reported real experience of effort inside the demo. | She says she assumed it would be quick/easy, or that time cost wasn't part of her hesitation at all. |
| **CP4 — Trust/unfamiliarity** | Spontaneous mentions of not recognizing Nahui, general scam/legitimacy worry, or an explicit "no" answer to §6.5.3's direct trust question. | She names Nahui as familiar/credible (e.g., via a referral, having heard of it before), or explicitly says trust wasn't a factor when asked directly at §6.5.3. |
| **CP5 — No real barrier / attention mismatch** | She says she simply hasn't gotten to it yet, was busy, or genuinely intends to try it later with no described obstacle — "no real reason," offered as an actual answer, not a polite deflection (judgment call for the person running the pilot; log the verbatim quote so this call is reviewable later, not just asserted). | She names a specific, substantive obstacle at all (any of CP1-CP4, or a genuine "Other") — the presence of *any* named obstacle is itself invalidating evidence against "no real barrier." |
| **Other (unclassified)** | Logged verbatim, no threshold applied at n=10-20 — if the same *unclassified* reason recurs across 3+ respondents in a later batch, it becomes a candidate for a sixth named hypothesis in a future amendment to this document, not silently folded into one of CP1-CP5. | N/A — this bucket exists to stay open, not to be falsified. |

**§8's logging template was not reverted to CP1-CP5's checkboxes.** No conversation has run under either framework — this is still a pre-launch document (top status line) — so this isn't a data-preservation question for either §7.1/§7.4 or §8. The distinction is what each actually is: §7.1/§7.4 are the "locked... never silently edited" definitional content this document explicitly commits to preserving (§7's own stated rule, the basis for the Blocker fix above); §8 is a working tool with no such commitment, so it was simply updated to reflect the current, operative framework directly.

---

## 8. Logging template — one entry per codeable conversation

```
CONCIERGE PILOT — CONVERSATION LOG

Respondent ID: __________          Date first contacted: __________
Instant Reply — vendor status (§5 Q1): [ ] A - bazar/tianguis  [ ] B - vende, no bazar  [ ] C - no vende
Instant Reply answers (zona / tipo de bazar, vendor-Branch A only): __________ / __________
Demo track (vendor-Branch A only, §6.2): [ ] Track 1 — never opened demo   [ ] Track 2 — opened demo
Codeable: [ ] Yes   [ ] No (Instant Reply only, no human-follow-up reply — excluded from n)

Reasons named (code each, mark spontaneous [S] or prompted [P]):
  [ ] PF1 problem recognition [S/P]   Quote: "________________________"
  [ ] PF2 unclear value       [S/P]   Quote: "________________________"
  [ ] PF3 perceived effort    [S/P]   Quote: "________________________"
  [ ] PF4 trust/unfamiliar    [S/P]   Quote: "________________________"
  [ ] PF5 phone-entry (Track 2 only) [S/P]   Quote: "________________________"
  [ ] Other (verbatim): ___________________________________________

Loop 2 — demo invited: [ ] Yes  [ ] No     If yes, link sent: __________
  Self-reported outcome (optional follow-up, §0): _______________________

Value-prop-in-her-own-words (§6.5.1): "____________________________"
Would this solve something real (§6.5.2): [ ] Sí  [ ] Tal vez  [ ] No
  Quote: "____________________________________________________"
Opt-in for future contact (§6.6): [ ] Sí  [ ] Tal vez  [ ] No

Moderator notes (anything not captured above): _____________________
```

Keep raw logs — they're the primary source for whatever synthesis follows once the pilot's stop-early cap is reached or the window closes, whichever comes first.

---

## 9. What this pilot cannot tell us, stated so a future reader doesn't overclaim it

- **It cannot produce a statistically confirmed answer at n=10-20** — every finding is a candidate signal, per §7.3's own stated margin.
- **It cannot explain anonymous, self-serve demo abandonment.** This was the original objective (CP1-CP5); reframed away from it as of 2026-08-27 specifically because a DM respondent structurally cannot represent that population (supersession note, top of document). Do not cite this pilot's findings as evidence about why the 225-of-227 anonymous bounce happens — that's a separate, ongoing investigation (technical/UX audit of the first screen).
- **It cannot cleanly separate a DM-qualified respondent's stated problem-fit from the self-selection built into being willing to DM a business at all** — §2.5's confound is real and unresolved by this design; state it every time PF1 findings are cited toward H1.
- **It cannot be compared to Campaign B's own self-serve numbers as a controlled experiment** — different objective, different CTA, different audience draw at a different time (§2.5).
- **It cannot, by itself, justify a UX change to Authentication, or justify building the value-first onboarding path described in §0.3** — both require confirmed evidence, gated separately, and §0.3's own decision explicitly defers that build until Loop 2's own instrumentation shows whether it's actually needed.
- **Loop 2 cannot individually attribute a specific demo session to a specific DM conversation** — the `acceso_dm_*` instrumentation is anonymous/aggregate, same as the retired `demo_*` suite; only the optional self-report follow-up reliably closes that gap (§0).

What it *can* do — the actual point — is give the Product Owner, and this project, real, human, unscripted conversations that test H1 against a broader population than Ana alone, and, for whoever gets far enough to want to try it, a first read on whether a genuinely interested merchant still struggles inside the existing product — at a scale one person can genuinely absorb and act on.
