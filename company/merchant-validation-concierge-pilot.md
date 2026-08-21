# Nahui — Concierge/DM Validation Pilot: Diagnosing Non-Completion (2026-08-20)

**Status: design/proposal only. Nothing here is authorized to launch — no ad published, no Instagram automation configured, no message sent.** Prepared by `marketing` at the Product Owner's direct request, following the Product Owner's review of this agent's earlier DM-feasibility analysis and a parallel `knowledge-mentor` consultation on Concierge MVP methodology. Requires explicit, per-item Product Owner sign-off before any piece is built or published, per the standing Approval gate (`company/CLAUDE.md`, `company/marketing-operating-environment.md`).

**The Product Owner's directive, quoted directly because it governs every design choice below and must not be softened in translation:**

> Do not treat the phone wall as the diagnosed cause yet. Wave 1 did not give us enough instrumented evidence to distinguish between phone-entry friction, lack of understanding of the demo's value, perceived effort, trust, or another cause. The instrumentation was added too late in the campaign to make that conclusion. Proceed with a small Concierge/DM pilot as a learning experiment, not as a replacement for self-serve. The objective of the DM pilot is to discover WHY people are not starting the demo, including whether phone entry is actually one of the barriers.

Everything in this document is built to answer that question honestly — including the real possibility that the answer implicates none of the four named candidates, or several at once, or something not yet named.

**On the referenced Concierge MVP consultation:** this document does not have that consultation's specific text on hand — it was routed and returned outside this dispatch. Where this design leans on Concierge MVP theory (Eric Ries' "manually deliver the service by hand, behind the scenes, before automating it" pattern — do the unscalable thing on purpose, to learn, not to launch a channel), that's this agent's own general knowledge (Model Knowledge tier, `company/CLAUDE.md`'s Knowledge Mentor tiering), not a citation of that specific consultation's findings. The core Concierge MVP discipline this design does apply throughout: keep automation to the absolute minimum needed to not lose people entirely (one Instant Reply), and put a real human in every substantive exchange — the opposite of a scaled acquisition channel, on purpose.

---

## Companion documents, referenced not duplicated

- `company/merchant-validation-funnel-diagnosis.md` — the diagnosis this pilot exists to help resolve. Tier 1 of that document (Stages 4-7: prototype engagement start, Authentication/OTP, Onboarding completion, reaching the banner) is the largest unmeasured share of the 423→3 (or 285→3) collapse, and self-serve instrumentation for those stages is still pending the standard `ux-designer`/`architect` pipeline. This pilot is a second, qualitative route to the same question, not a replacement for that instrumentation work.
- `company/merchant-validation-campaign-meta-ads.md` — the first Meta Ads campaign (Traffic objective, Landing Page Views, MXN $500/3 days). This pilot reuses its audience/geography/placement settings (§2/§4 there) and its budget-discipline conventions (Lifetime Budget, explicit End Date, Account Spending Limit backstop) — differences are stated explicitly in §2 below, not re-derived.
- `company/merchant-validation-strategy-v2.md` §2.2 — Campaign B ("Venta rápida"), the hypothesis-specific video campaign this pilot's creative is built on. Tests the same H1 core hypothesis this pilot is diagnosing non-completion of.
- `company/merchant-validation-campaign-b-storyboard.md` — the already-produced, already-brand-reviewed Campaign B video draft (`company/campaign-assets/campaign-b-draft/final/campaign-b-draft.mp4`, 29.4s). §5 below reuses this asset rather than proposing a new one.
- `company/usability-testing-plan.md` §1.3 (moderated-vs-unmoderated reasoning) and §7.2b (referral-first recruitment script, tone/rigor precedent) — the established precedent for moderated, trust-aware qualitative recruitment this pilot's discussion guide (§6) is built from, per the Product Owner's own instruction not to reinvent it.
- `company/merchant-validation-decision-matrix.md` — the default threshold convention (3+ of a first batch of 10 = candidate signal; the same pattern at a second batch of 10, n≥20 = approaching confirmed; real n=10 margin ±31pp, not the looser ±20pp figure). §7 below adapts this convention to qualitative DM coding rather than restating it from scratch.
- `company/marketing-operating-environment.md` — Instagram's existing account/access model (§3 there: Product Owner-owned Business account linked to the Facebook Page, "every DM needs approval," human-hand-on-every-send). This pilot is fully consistent with that existing policy, not an exception to it — it's the policy's logical shape applied to a deliberate experiment instead of ad-hoc outreach.
- `company/market-validation.md` H1 — the core hypothesis this pilot's respondents are drawn from the same population to test non-completion of, not a new hypothesis.

---

## 1. Non-goals — stated plainly, binding on this document and on how its findings get used

1. **The phone/OTP step in the self-serve flow is not being removed, redesigned, or touched based on this pilot alone.** Any UX change to Authentication stays gated on confirmed evidence (§7's threshold convention) and is a separate Product Decision, routed through `product/02-ux/product-decisions.md` per the standard Decision Ownership policy — never resolved unilaterally from this pilot's own findings, however suggestive.
2. **The self-serve funnel and its existing instrumentation stay fully intact and running, unmodified by this pilot.** `demo.nahui.app`, its Demo Mode welcome screen, the persistent Form-reminder banner, and the pending Stage 4-7 `track()` events (`merchant-validation-funnel-diagnosis.md`) continue exactly as already designed. This pilot's findings are meant to be read *alongside* that self-serve data once both exist, not in place of it.
3. **This pilot is explicitly not a replacement acquisition channel, and not a pivot to concierge-style, human-mediated onboarding as Nahui's standing model.** It is a bounded, time-boxed diagnostic experiment. If it produces useful signal, the next step is a decision about what (if anything) to fix in the self-serve flow — not a decision to keep running DM campaigns instead of self-serve.
4. **This pilot does not, on its own, confirm or reject any of the four named candidate causes (or the fifth this document adds, §7).** At the sample size this design can realistically produce (§2), every finding is a candidate signal per the same confidence discipline this project already holds itself to everywhere else (`market-validation.md`, `merchant-validation-decision-matrix.md`) — never a resolved diagnosis from n=10-20 DM conversations alone.

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
| **Creative** | Campaign B's existing video (`campaign-b-draft.mp4`), with a swapped closing card — see §5 | Same video, reused as-is otherwise |
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

- [ ] Ad Set configuration (§2.1) — objective, conversion location, performance goal, CTA, budget, schedule
- [ ] Creative — swapped closing-card copy for the DM ask (§5), routed to `ui-designer` to build against the existing video, then to `brand-guardian` for a voice-consistency pass before publishing (flagged below, not performed by this agent)
- [ ] Instant Reply copy and quick-reply questions (§6.1)
- [ ] Discussion guide (§6.2) — the actual message content the Product Owner will send
- [ ] Confirmation of Instagram Business account setup and Instant Reply/automation tooling availability (Meta Business Suite Automations) before anything is built against an assumed capability
- [ ] The MXN $200 budget, 2-day window, and 20-conversation stop-early trigger (§2.2) as the governing caps

**Recommended, not yet done:** route the ad primary text, Instant Reply copy, and discussion-guide's actual spoken lines through `brand-guardian` for a voice-consistency review before Product Owner sign-off — these are new external-facing copy in a register (1:1 conversational DM) Nahui hasn't used before, which is exactly the kind of "new emotional/tonal territory" `brand/CLAUDE.md` names as a consultation trigger, not just an ordinary-copy check against `tone-of-voice.md` directly. This agent has checked the copy below against `tone-of-voice.md`'s concrete rules directly (§6.3), but a dedicated review is worth routing through Main before publishing.

**Brand-guardian review, 2026-08-20:** clean overall (no Blocker, no Major); three small fixes applied directly below — §5's Instant Reply copy (emoji dropped), §6.4.1's opening line (flattened to match the register `character-bible.md` requires for a neutral, not-yet-eventful action), and §6's moderator guidance (explicit acknowledge-before-next-question and menu-not-sequence instruction added).

---

## 4. Creative note for `ui-designer` — what the DM pilot's own CTA/ask should be

**Not redesigning the video.** Campaign B's existing draft (`campaign-b-draft.mp4`) is reused as-is through Beat 4a (the honest disclosure card, 0:26-0:29.3) — nothing changes there. What needs a variant is **Beat 4b only** (the CTA + incentive closing card, `merchant-validation-campaign-b-storyboard.md` §2), since its current text and voiceover point at the self-serve ask ("Pruébalo y cuéntanos si esto te serviría..."), which doesn't match this pilot's actual button destination (Instagram Direct, not `demo.nahui.app`).

**Recommended Beat 4b variant, DM-pilot version only:**

> **CTA line (large, bold), voiceover:** "Escríbenos y cuéntanos cómo llevas tus ventas hoy — nos ayuda tanto como que lo pruebes tú misma."
>
> **Incentive line (smaller, no voiceover), unchanged in spirit from the existing "acceso prioritario" convention:** "Al platicar con nosotros, quedas en la lista de acceso prioritario para cuando la app esté lista."

Reasoning for this specific line, stated for `ui-designer`/`brand-guardian` to weigh, not decided unilaterally here: it keeps the existing "both things help us equally" framing from the original CTA (`merchant-validation-campaign-videos.md`'s `[CHANGED]` line) — a real continuity worth preserving — but swaps the verb from "pruébalo" (try it) to "escríbenos" (write to us), matching the actual ask this campaign's CTA button makes. It avoids implying she's replacing the demo with a chat (still says "cómo llevas tus ventas hoy," an open invitation to talk about her business, not a sales pitch) and keeps the incentive line's wording identical to the one already brand-reviewed in the storyboard, rather than introducing new incentive language that would need its own review pass.

**What stays entirely `ui-designer`'s call, not specified here:** whether Beat 4b needs a visual change (e.g., an Instagram DM icon) beyond the copy swap, and how the swap gets built (a second export of the same video, or a platform-level creative variant if Ads Manager supports serving the same video with different end-cards to different campaigns). This document states the ask's wording only, per its own remit.

---

## 5. Instant Reply — light automated qualification, honestly disclosed as automated

**Design principle, stated once:** the Instant Reply must never pretend to be a human, and must set the expectation that a real human is coming — both because pretending otherwise breaks trust the moment she realizes it, and because `character-bible.md`'s "never claims certainty it doesn't have" extends naturally to "never claims to be someone it isn't."

**Recommended copy:**

> ¡Hola! Gracias por escribirnos. Somos Nahui — un equipo que está construyendo una app para vendedoras y vendedores de bazar. Una persona de nuestro equipo (no un bot) te va a contestar en las próximas horas — queremos platicar contigo, no venderte nada.
>
> Mientras tanto, dos preguntas rápidas para conocerte mejor:

**Quick-reply questions (if Meta's Instant Reply tooling supports button-based quick replies at the point of building this — confirm live, same discipline `merchant-validation-campaign-meta-ads.md` §1 already applies to its own objective picker; fall back to a single combined plain-text question if it doesn't):**

1. "¿Dónde vendes más seguido?" → *Ciudad de México* / *Estado de México* / *Otro lugar*
2. "¿Qué tipo de bazares?" → *Bazares privados* / *Tianguis* / *Los dos*

These two answers feed the same H1 screening criteria `market-validation.md` §2b already uses (geography, private-bazaar vs. tianguis) — light context for the human follow-up, never a substitute for the actual qualitative conversation.

---

## 6. Discussion guide — the pilot's actual point

*Internal use only. Spoken/typed portions are in natural Mexican Spanish, per `global-principles.md`. This is the reference script; the person handling the pilot personalizes with her name/answers but shouldn't improvise new questions mid-conversation, per the same consistency discipline `usability-testing-plan.md` §1.4 already establishes for its own standing probes.*

**Standing guidance, applies throughout — read before running the first conversation:** this guide is a menu to draw from in the conversation's natural order, not a fixed top-to-bottom sequence. If she's already answered a question spontaneously, skip it rather than asking it again — consistent with §7.2's own spontaneous-answer logic, made explicit here as guidance for whoever runs the pilot. Before moving from one question to the next, acknowledge what she actually said with a short reflective line ("Entiendo," "Tiene sentido, gracias por contarme," "Ah, ok, te entiendo") — not a new question — so that a run of direct probes back-to-back doesn't read as a checklist, especially with a respondent who answers briefly and triggers the vagueness-probe on nearly every question.

### 6.1 Opening (human, first message)

> Hola [nombre], soy [Product Owner], de Nahui — gracias de verdad por escribirnos. Antes que nada: esto no es una venta, no te vamos a pedir dinero, y nada de lo que platiquemos lleva tu nombre si lo usamos para mejorar la app. Nada más queremos entender cómo vendes en tus bazares, y si lo que viste en el video tiene sentido para ti o no — no hay respuestas correctas. ¿Tienes un ratito ahora, o prefieres que sigamos más tarde? Contesta cuando puedas, no hay ninguna prisa.

### 6.2 Branch check — did she reach the demo at all

> Para empezar — ¿ya le entraste a la app que se ve en el video (demo.nahui.app), o el video fue lo único que has visto hasta ahora?

**→ Branch A if no. → Branch B if yes.**

### 6.3 Branch A — never opened the demo

1. **Open, no options offered:** "¿Qué te detuvo, o qué te hizo dudar?" — wait for her actual answer before saying anything else. Log it verbatim; code it per §7 as **spontaneous**.
2. **Only if her answer is vague/non-specific** (e.g., "no he tenido tiempo," "se me pasó," "ahorita ando ocupada"): "Te entiendo, a todas nos pasa. Si te animas a intentarlo en algún momento, ¿qué esperarías que te pidiera la app al abrirla? ¿Habría algo que te hiciera dudar en meter tu información — como tu número de teléfono — o es más que no ha llegado el momento?" — a gentle, still-open nudge, offered only as a probe, never a leading confirmation. Log her answer here as **prompted**, distinct from a spontaneous mention, per §7's evidence-weighting rule.
3. "¿Qué entendiste que hace la app, nada más viendo el video?" — probes value-prop clarity independent of whether she ever tried it.

### 6.4 Branch B — opened the demo

1. "Ok, cuéntame: ¿hasta dónde llegaste — alcanzaste a hacer una venta de prueba, o te quedaste en algún paso antes?"
2. **Open:** "¿Hubo algún momento en el que dudaste si seguir, o que te costó más trabajo del que esperabas?"
3. **The one direct, targeted phone-entry question — asked openly, not leadingly, and only here, where she actually experienced the step:** "Cuando te pidió tu número de teléfono para entrar, ¿cómo se sintió eso? ¿Lo hubieras hecho igual si fuera una app que no conoces?"

### 6.5 Both branches converge

1. "Si tuvieras que explicarle a otra persona qué hace Nahui, ¿qué le dirías?" — value-proposition-in-her-own-words check, reusing `usability-testing-plan.md` §4 Q7's exact convention rather than inventing new phrasing.
2. "¿Esto te resolvería algo de verdad en tu día a día vendiendo, o se sintió como algo bonito pero no tan necesario?" — reusing `usability-testing-plan.md` §4 Q8's exact convention, per the Product Owner's own instruction not to reinvent Nahui's established discipline for this kind of conversation.
3. "¿Hay algo que te haya dado dudas o desconfianza de nosotros o de la app? Así sea chiquito, nos ayuda mucho saberlo." — direct, honest trust-probe.

### 6.6 Closing

> Muchísimas gracias por platicar con nosotros, de verdad ayuda un montón. Si quieres, te dejamos en la lista para ser de las primeras en probar la versión más avanzada cuando esté lista — sin compromiso. ¿Te interesa?

Log the opt-in (Sí/Tal vez/No), same non-blended-rate convention `merchant-validation-decision-matrix.md` §E already applies to Q16/Q17.

### 6.7 Standing probes — use throughout, don't improvise variants mid-conversation

- **Vague or one-word answer:** "Cuéntame un poco más, ¿cómo así?" — neutral, never suggesting an answer.
- **Never confirm or guess a reason before she's named it herself** — don't say "seguro fue lo del teléfono, ¿no?" Let her get there in her own words; a guess offered first contaminates §7's evidence exactly the way a leading question would.
- **Goes quiet mid-conversation:** one gentle, no-pressure follow-up after 24 hours ("Oye, sin presión, ¿seguimos platicando cuando puedas?"), then let it go — per §2.3/`character-bible.md`'s "honest way out."
- **She asks whether she's "doing it right":** "No hay nada que hacer bien o mal aquí — nada más queremos entender cómo lo viviste tú."

### 6.8 Tone check against `tone-of-voice.md`'s concrete rules, done explicitly rather than assumed

- States facts before framing ("esto no es una venta... nada más queremos entender") — matches the "state facts before opinion" rule.
- No urgency anywhere in the script — no deadline, no scarcity language.
- Every question reads as an invitation, never an instruction ("¿tienes un ratito?", never "cuéntanos ahora").
- Never implies she needed rescuing or did anything wrong by not finishing the demo — 6.3's opener to Branch A is deliberately warm, not corrective.
- No technical/domain terms anywhere in the script (no "onboarding," "OTP," "conversion," "funnel") — every question is phrased in her own vocabulary about her own bazaar business.
- No performed excitement disproportionate to what actually happened (`character-bible.md`) — 6.4.1's opener stays flat/warm rather than exclamatory, since opening a demo isn't yet an accomplishment; real warmth-escalation is reserved for later in the exchange if she describes an actual completed sale or milestone.

---

## 7. Pre-registered measurement/evidence framework

**Locked as of 2026-08-20, before any DM conversation happens.** Any change to the definitions below after the pilot begins must be logged as a dated amendment here, never silently edited — the same non-deletion, amend-forward discipline already used throughout `company/` (e.g. `product/00-foundation/decision-log.md`'s own convention) and explicitly required by the Product Owner's own framing ("written down now, before any conversation happens, so it can't be reinterpreted after the fact").

### 7.1 Five candidate hypotheses — not four, and not ranked by likelihood

The Product Owner named four; this document adds a fifth as the honest null hypothesis a diagnostic study needs, so the framework isn't structurally forced to find a product-side cause even when there isn't one.

- **CP1 — Phone-entry / OTP friction.** She is deterred specifically by being asked to enter her phone number and a verification code — whether from privacy concern, distrust of giving her number to an unfamiliar app, or literal confusion about the step (the historical OTP-disclosure bug is fixed as of 2026-08-16, but a *new*, post-fix instance of this confusion would still be a real, current finding, not an echo of the old bug).
- **CP2 — Unclear value proposition.** She doesn't understand, from the ad/video alone, what the app actually does or how it differs from what she already does — a comprehension gap independent of anything inside the demo itself.
- **CP3 — Perceived effort.** She assumes trying it will cost real time or setup work (entering a catalog, learning a new interface) that competes with time she'd rather spend selling — a cost she assumes *before* trying, distinct from CP1 (a specific step) and CP2 (not understanding what it's for).
- **CP4 — Trust / unfamiliarity.** General hesitancy toward an unknown company or app, not specifically about the phone number — e.g., worry about a scam, about her data, or simply not recognizing Nahui as a real, legitimate thing.
- **CP5 — No real barrier; attention/context mismatch (the null hypothesis).** She saw the ad passively while scrolling with no real intention to act at that moment; clicking through and then doing anything further requires a context switch that has nothing to do with the product itself — a naturally low-intent ad interaction, not evidence of any product-side problem.
- **Other, named verbatim, no pre-set code.** Any reason a respondent gives that doesn't fit CP1-CP5 is logged in her own words, not forced into one of the five — this stays open by design, per the Product Owner's own instruction not to prejudge the answer set.

### 7.2 Evidence weighting — spontaneous vs. prompted, stated once, applied to every hypothesis below

A reason she names **unprompted**, in response to an open question (§6.3.1, §6.4.2, §6.5.3), is strong evidence. A reason she confirms only after being **prompted** with a specific candidate (§6.3.2's nudge, or §6.4.3's direct phone-entry question, which is inherently a prompted context since it names the topic) is weaker evidence — real, but logged and counted separately, never blended into the same tally as a spontaneous mention. This mirrors the anti-leading discipline `merchant-validation-decision-matrix.md` already applies to Q15 (the `knowledge-mentor`-confirmed Availability Bias correction) and to Q7/Q8's spontaneous-classification design — reused here, not reinvented.

**Only spontaneous mentions, plus Branch B's direct §6.4.3 answer (asked after she actually experienced the step, not a hypothetical prompt), count toward the primary 3-of-10 threshold below.** Branch A's §6.3.2 prompted nudge answers are logged as a secondary, softer signal — reported alongside the primary count, never merged into it.

### 7.3 Threshold, adapted from `merchant-validation-decision-matrix.md`'s default convention

> A given hypothesis (CP1-CP5) recurring — by the weighting rule above — across **3 or more of the first 10 codeable conversations** is logged as a **candidate signal**, not acted on unilaterally. The same pattern recurring in **3+ of a second batch of 10** (n≥20, reachable if the pilot's stop-early cap allows a second wave) reinforces it toward an actual decision-worthy finding. At n=10, the real worst-case 95% margin is **~±31pp**, not the looser ±20pp figure that only applies at n=20 — stated explicitly here so this instrument doesn't repeat the imprecision `merchant-validation-decision-matrix.md` itself already had to correct twice.

**What "codeable" means, stated precisely:** a conversation counts toward this n only if she gave a substantive answer to at least one of §6's open reason-seeking questions. A respondent who only interacted with the Instant Reply and never replied to the human follow-up is logged separately as **non-response** and excluded from this denominator entirely — the same discipline `merchant-validation-funnel-diagnosis.md` Stage 3 already applies to picking the correct denominator (Meta's 423 vs. Vercel's 285), reused here rather than silently inflating or deflating the codeable sample.

**Composite/multiple-mention rule:** a respondent may name more than one reason (e.g., CP2 and CP4 together) — code every reason she actually gives, don't force a single dominant code. Report each hypothesis's count independently; don't let one respondent's multiple mentions be silently treated as multiple respondents.

### 7.4 Supporting / invalidating evidence, per hypothesis

| Hypothesis | Supporting evidence | Invalidating evidence |
|---|---|---|
| **CP1 — Phone-entry/OTP friction** | Spontaneous mentions coding to "no quise dar mi teléfono," "me dio desconfianza meter mi número," "no supe qué código poner," "no me llegó nada" — in her own words, before being asked about the phone step specifically. Branch B's direct §6.4.3 answer describing real hesitation or a real point of confusion at that step. | She names a different reason entirely when asked openly (§6.3.1/§6.4.2), and — when the direct §6.4.3 question is asked in Branch B — says the phone step felt normal/expected, comparable to other apps she already uses. Branch A respondents who, even after the §6.3.2 nudge, say the phone number specifically wasn't a concern. |
| **CP2 — Unclear value proposition** | She can't restate what Nahui does in §6.5.1, or restates it inaccurately/vaguely; spontaneous language like "no entendí bien para qué es," "no supe qué hacía diferente." | She restates the value proposition accurately and specifically (e.g., names the speed/registration angle unprompted) in §6.5.1, even if she never opened the demo. |
| **CP3 — Perceived effort** | Spontaneous mentions coding to assumed setup burden, catalog entry, or general "esto me va a quitar tiempo" reasoning — said *before* or *instead of* trying, distinct from a reported real experience of effort inside the demo. | She says she assumed it would be quick/easy, or that time cost wasn't part of her hesitation at all. |
| **CP4 — Trust/unfamiliarity** | Spontaneous mentions of not recognizing Nahui, general scam/legitimacy worry, or an explicit "no" answer to §6.5.3's direct trust question. | She names Nahui as familiar/credible (e.g., via a referral, having heard of it before), or explicitly says trust wasn't a factor when asked directly at §6.5.3. |
| **CP5 — No real barrier / attention mismatch** | She says she simply hasn't gotten to it yet, was busy, or genuinely intends to try it later with no described obstacle — "no real reason," offered as an actual answer, not a polite deflection (judgment call for the person running the pilot; log the verbatim quote so this call is reviewable later, not just asserted). | She names a specific, substantive obstacle at all (any of CP1-CP4, or a genuine "Other") — the presence of *any* named obstacle is itself invalidating evidence against "no real barrier." |
| **Other (unclassified)** | Logged verbatim, no threshold applied at n=10-20 — if the same *unclassified* reason recurs across 3+ respondents in a later batch, it becomes a candidate for a sixth named hypothesis in a future amendment to this document, not silently folded into one of CP1-CP5. | N/A — this bucket exists to stay open, not to be falsified. |

### 7.5 What this feeds — and, explicitly, what it doesn't

Per §1's non-goals: every outcome above tops out at **candidate signal**, logged in `product/02-ux/product-decisions.md` (if it implicates a UX/product question, per standard Decision Ownership routing) or `company/market-validation.md` (if it's a market/messaging finding) — never a unilateral resolution, and never, on its own, grounds to touch the phone/OTP step. Escalation past "candidate" requires the same second-batch-of-10 pattern this project already requires everywhere else, or independent corroboration from the self-serve funnel's own instrumentation once Stage 4-7's `track()` events are live and confirmed (`merchant-validation-funnel-diagnosis.md`) — two independent sources, the same bar `market-validation.md` already sets for "Validated."

---

## 8. Logging template — one entry per codeable conversation

```
CONCIERGE PILOT — CONVERSATION LOG

Respondent ID: __________          Date first contacted: __________
Instant Reply answers (zona / tipo de bazar): __________ / __________
Branch: [ ] A — never opened demo   [ ] B — opened demo
Codeable: [ ] Yes   [ ] No (Instant Reply only, no human-follow-up reply — excluded from n)

Reasons named (code each, mark spontaneous [S] or prompted [P]):
  [ ] CP1 phone/OTP        [S/P]   Quote: "________________________"
  [ ] CP2 unclear value    [S/P]   Quote: "________________________"
  [ ] CP3 perceived effort [S/P]   Quote: "________________________"
  [ ] CP4 trust/unfamiliar [S/P]   Quote: "________________________"
  [ ] CP5 no real barrier  [S/P]   Quote: "________________________"
  [ ] Other (verbatim): ___________________________________________

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
- **It cannot cleanly separate "why people don't complete self-serve" from "why people who are willing to DM a business don't complete self-serve"** — §2.5's self-selection confound is real and unresolved by this design; state it every time this pilot's findings are cited.
- **It cannot be compared to Campaign B's own self-serve numbers as a controlled experiment** — different objective, different CTA, different audience draw at a different time (§2.5).
- **It cannot, by itself, justify a UX change to Authentication** — that requires confirmed evidence per §1's non-goals and §7.5's routing, gated separately.

What it *can* do — the actual point — is give the Product Owner, and this project, the first real, human, unscripted conversations with people who saw Nahui's own ad and did not (yet) become a self-serve respondent, at a scale one person can genuinely absorb and act on.
