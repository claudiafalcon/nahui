# Nahui — First Large-Scale Merchant Validation Campaign

**Status: Drafted, incentive structure revised by the Product Owner to a fully non-monetary structure (2026-08-15). Recruitment copy and questionnaire revised to match. Questionnaire and incentive-branching further revised (2026-08-15, fourth pass) per five specific Product Owner refinements, then refined again (2026-08-15, fifth pass) after a targeted Product Owner gap-check on usability-vs-workflow-fit — see the revision notes under Deliverable 3 — then remediated a sixth time (2026-08-15, same day) closing a full `ux-critic`/`reviewer` final-review batch (one Blocker, four Major findings, one Important finding, two Suggestions, two Minor findings) — see the **Sixth-pass remediation record** near the end of this document for the complete list of fixes and their disposition — and remediated a seventh time (2026-08-15, same day) closing the one item the sixth pass left open (N3, Q15's anchoring risk), via a `knowledge-mentor` consultation — see the **Seventh-pass remediation record** immediately following it, then a small eighth, closing pass fixing five residual findings (a factual slip in the seventh pass's own fix, a stale time estimate, an undercounted findings summary, and four stale `business-decisions.md` cross-references). **`ux-critic`/`reviewer` re-verification of the full seven-pass batch, plus a final focused spot-check of the eighth pass, are both clean — no open findings remain.** Review pipeline complete. Not yet approved to run — nothing in this document has been posted, sent, or contacted. Requires explicit Product Owner sign-off before any piece goes live, per the standing Approval gate (`company/CLAUDE.md`).**

Prepared by `marketing`, seven passes: initial full draft (2026-08-14); a revision (2026-08-14/15) after the Product Owner rejected a raffle-based incentive in favor of a guaranteed reward; a third revision (2026-08-15) after the Product Owner removed the monetary component entirely — the guaranteed thank-you is now priority-list access to the first pilot and the option to join the early-adopter community, both open to anyone who opts in; actual pilot admission and NFC starter-kit distribution stay merit-based, decided by genuine interest and feedback quality, never by chance or order of arrival; a fourth revision (2026-08-15, same day) reworking Deliverable 3's questionnaire (a confusion/expectation-mismatch split, a forced single-item prioritization question, corrected Sí/Tal vez/No branching, a full per-question audit) and Deliverable 4's incentive branching to match, plus a new companion decision-mapping file; a fifth revision (2026-08-15, same day) evaluating a specific Product Owner gap question — whether the questionnaire cleanly separates "the prototype was hard to use" from "this doesn't reflect how I actually work in a bazaar" — concluding the existing open-text questions let that signal surface but not be cleanly separated without a coder's subjective judgment call, and closing the gap with one lightweight forced-choice question (new Q7) plus a matching qualitative-codebook category and Decision Matrix row, at effectively no completion-time cost; a sixth pass (2026-08-15, same day) closing a full `ux-critic`/`reviewer` final-review batch: corrected the recruitment copy's time promise to actually reconcile with Deliverables 2 and 3's own stated times instead of contradicting them (B1); added a fifth Q7 answer option distinguishing "understood exactly what to do, but the outcome wasn't what I expected" from both the usability option and Q8's own framing (M1); added a concrete, merchant-recognizable example to Q7's hardest-to-articulate option (M2); corrected two Decision Matrix thresholds (Q5's Task 3/7 completion-gap rule, Q13's free-tier-adoption escalation) that had cited a margin-of-error figure not actually applicable at the sample size they fire at (M3); reordered Q7's options to remove a primacy pull toward the positive answer (N2); specified Q5's checkbox-grid row content in full, mirroring Deliverable 2's task table (M4); corrected the Q14→`business-decisions.md` miscitation and recommended a new, accurately-scoped entry instead (Important finding); reconciled the Q7 "Feeds" column's cross-reference list and added a disambiguating clause between the new "workflow/mental-model fit" codebook category and "registration friction (H1)" (Suggestions); and logged Q15's post-pricing anchoring risk (N3) as an explicit open item pending a `knowledge-mentor` consultation, rather than leaving it silently unaddressed; and a seventh revision (2026-08-15, same day) closing N3 once that consultation returned — a Google Forms section-break/transition sentence inserted between Section D and Section E, plus a corresponding post-hoc corroboration-check addition to Q15's own analysis in the Decision Matrix, chosen over a full Section D/E reorder for cost reasons stated in the Seventh-pass remediation record. Grounded in `company/CLAUDE.md`, `company/backlog.md`, `company/brand/brand-guide.md`, `brand/character-bible.md`, `brand/tone-of-voice.md`, `product/00-foundation/global-principles.md`, `product/00-foundation/decision-log.md`, `product/02c-high-fidelity-prototype/README.md` + `BACKLOG.md`, `company/market-validation.md`, `company/jobs-to-be-done.md`, `company/business-decisions.md`, `product/02-ux/product-decisions.md`, `company/usability-testing-plan.md` §7.3. The full hypothesis → decision → threshold mapping behind every questionnaire item lives in the companion file `company/merchant-validation-decision-matrix.md` — this document states the campaign itself, that one states what each answer is for.

**Objective, stated explicitly per the Product Owner's own framing:** validate, don't optimize for positive opinions. The goal of this campaign is discovering why merchants would *not* adopt Nahui, not collecting compliments. Success is not "people liked it."

## Two product-truth facts that shape every wording choice below

1. **Nahui today is a running prototype with no backend.** `nahui.app` (merchant app) and `loyalty.nahui.app` (customer claim flow) are real and live, but everything persists to the browser's own `localStorage` — nothing survives clearing browser data or switching devices, phone/OTP verification accepts any 6-digit code, and NFC "scans" are simulated taps, not real hardware reads.
2. **The Paid-tier promise ("Frequent Customers") is visually present but not functionally real yet.** "Tus clientes" and the reward/Recompensas screens exist and are correct, but permanently show their honest empty state. A merchant who scans her own Paid receipt's QR reaches a real, separate customer-registration prototype (`loyalty.nahui.app`) — but nothing she does there flows back to her own merchant view yet. This has to be disclosed, not glossed over, anywhere the Paid tier is described.

The QR domain-mismatch risk flagged in the first draft (the receipt QR pointing to a mock `.mx` domain instead of the live `.app` one) has since been **confirmed fixed** in the running prototype — no longer a blocker to Deliverable 2's QR-scan task.

---

## Deliverable 1 — Recruitment Strategy

### 1a. Short version (WhatsApp broadcast / quick community post)

> Hola, somos Nahui 💛 Estamos platicando con vendedoras y vendedores de bazar para entender cómo llevan el control de sus ventas y sus clientes — no vendemos nada, solo estamos aprendiendo de tu experiencia real.
>
> Si vendes en bazares, nos ayudarías muchísimo si le echas un ojo a una versión de prueba de lo que estamos construyendo y respondes un cuestionario corto — calcula entre 18 y 26 minutos en total, entre las dos cosas. Al terminar puedes decirnos si quieres que te tengamos en cuenta para el primer piloto de Nahui, y desde ahí mismo puedes unirte a nuestra comunidad de early adopters.
>
> Mientras más nos cuentes con detalle cómo llevas tu negocio, mejor podemos decidir a quién invitar primero al piloto — y a quién considerar entre las primeras en recibir los kits de tags cuando estén listos. Eso se decide por el interés real y por la calidad de tus respuestas, no por orden de llegada.
>
> [liga al cuestionario]
> ¿Te late? Cualquier duda, aquí ando.

### 1b. Long version (Facebook Groups/Pages post)

> ¡Hola! Somos Nahui 💛
>
> Estamos construyendo una app para que vendedoras y vendedores de bazar lleven el control de sus ventas sin que eso les quite tiempo con el cliente. Todavía no está terminada — y antes de seguir armándola, queremos platicar con quienes de verdad la van a usar: tú.
>
> Te invitamos a probar una versión de prueba (unas pantallas, no la app completa) y a responder un cuestionario corto sobre cómo llevas tu negocio hoy — entre las dos cosas, calcula entre 18 y 26 minutos en total.
>
> Aquí tienes la liga para probar el prototipo: https://demo.nahui.app
> Aquí tienes la liga al cuestionario: https://forms.gle/ZZhtJEfee3viWY1h8
>
> Al completar la prueba y el cuestionario, puedes decirnos que quieres que te tengamos en cuenta para el piloto de Nahui — quedas en nuestra lista de acceso prioritario, y ahí mismo puedes unirte a la comunidad de early adopters, sin esperar a nada más.
>
> Si en tus respuestas vemos que conoces bien tu negocio y nos compartes el detalle real de cómo vendes, te consideramos entre las primeras candidatas para el piloto — y entre las primeras en recibir los kits de tags cuando el piloto arranque. Eso lo decidimos por el interés real y la calidad de lo que nos cuentas, nunca al azar ni por quién llega primero.
>
> No es una venta, no te pedimos dinero, y no compartimos tu información con nadie fuera de Nahui.
>
> ¡Gracias por tu tiempo! 💛

**Demo link added, 1b only (fixed 2026-08-16).** 1b's copy described two separate asks — trying the demo prototype and answering the questionnaire — but carried only one link, `[liga al cuestionario]`, placed once at the very end of the post; there was no link to the demo prototype anywhere in the copy at all. This is the exact gap the Product Owner flagged previously ("the post does not have the url for the demo"), which is what led to deploying `https://demo.nahui.app` as a second, public Vercel project specifically so this post could link to it — that URL is real and live (confirmed via `curl` earlier this session), but had never been folded back into this document's copy until now. **Fixed:** the paragraph introducing both asks stays as written, but is now immediately followed by two separate, plainly labeled links — one to the demo, one to the questionnaire — instead of one shared placeholder appearing only at the end. The trailing `[liga al cuestionario]` line that used to close the post is removed, since the questionnaire link now lives inline, right where it's introduced. The questionnaire link itself was a placeholder pending the real Google Forms URL from the Product Owner; she supplied it the same day (`https://forms.gle/ZZhtJEfee3viWY1h8`), now filled in directly above — 1b is send-ready as written. **Checked against `brand/tone-of-voice.md`:** both link lines use an offer construction ("Aquí tienes...") rather than an imperative ("Prueba aquí"/"Responde aquí"), consistent with the tone doc's own "suggestions read as offers, not instructions" rule; no urgency language introduced anywhere; no monetary language touched; nothing else in the post's factual claims, time promise, or incentive framing changed. **1a is unaffected and intentionally left as-is** — the Product Owner is sending 1b to Facebook Groups specifically (Deliverable 1d's own recommended order), and this fix is scoped to 1b only, per that channel choice.

**Time promise, reconciled with Deliverables 2 and 3 (fixed 2026-08-15, sixth pass, B1).** 18-26 minutes is not an independently chosen number — it's the literal sum of Deliverable 2's core-path walkthrough estimate (10-14 min) and Deliverable 3's questionnaire estimate (8-12 min): 10+8=18 at the low end, 14+12=26 at the high end. The two prior passes' "10-15 minutos" figure was never actually derived from either deliverable's own stated time — it understated the real combined total by roughly half, in a document whose own stated discipline is to state facts before asking. The optional NFC branch (Deliverable 2, +5-7 min) is deliberately **not** folded into this promise: 1c already deliberately excludes NFC from the recruitment pitch itself and only ever surfaces it if curiosity comes up in replies ("también estamos probando algo con etiquetas NFC, todavía experimental") — so it correctly stays outside a number that's meant to describe what every recruit is actually being asked to do. **If Deliverable 2's or Deliverable 3's own time estimate ever changes, this promise must be recomputed as their new sum, not edited independently of them** — that's exactly how the prior "10-15 minutos" figure drifted out of reconciliation in the first place.

Both versions checked against `brand/tone-of-voice.md`: no manufactured urgency, no imperative framing, states facts before asking, never implies her current methods (notebook, memory) were wrong, never oversells what's built. No monetary language anywhere, no "sorteo"/"entra a ganar" framing — priority-list access and the community opt-in are stated as genuinely open to everyone who completes and opts in; pilot admission and NFC-kit consideration are stated plainly as conditioned on genuine interest and feedback quality, never on chance or order of arrival.

**Checked against Deliverable 3/4's corrected three-way branch (2026-08-15):** neither 1a nor 1b names "Tal vez" specifically or claims every opt-in reaches the priority list — both speak generically about opting in, being considered for the pilot "por el interés real y la calidad de tus respuestas," and joining the community. That framing stays accurate under the corrected branch (only "Sí" is a pilot candidate; "Tal vez" joins the community and future communications only) without needing a wording change — recorded here so this file stays internally consistent without re-touching copy the correction doesn't actually affect.

### 1c. Suggested screenshots — honest, representative, not cherry-picked

Four, in this order, each captioned so nobody mistakes the prototype for a finished product:

1. **`Home/Idle` cold-start state** — the real first-run screen a merchant with an empty catalog actually sees. Deliberately unglamorous.
2. **`Selling` (buttons-mode grid, mid-sale)** — the core value proposition in motion: tapping a product to register a sale. Shown as-is, not staged with an impressive catalog.
3. **`ReceiptTicket` — Free-tier variant** — the tangible output of a completed sale. Free tier specifically, since that's what most recruits will actually reach.
4. **`CatalogView`** with two or three real registered products — shows registering merchandise is genuinely a few taps.

**Deliberately excluded from the recruitment post itself:** the NFC selling surface and the Paid-tier receipt QR — both real, but leading with them risks implying NFC/segmentation is a finished, working capability. If curiosity comes up in replies, describe them honestly as "también estamos probando algo con etiquetas NFC, todavía experimental."

### 1d. Which communities to approach first, and why

Verified, real channels — from `company/usability-testing-plan.md` §7.3.2 (a live `WebSearch`/`WebFetch` pass, 2026-08-04). Two tiers:

**Tier 1 — Edomex bazaar-organizer channels (closer geography, imperfect niche fit):**

| Channel | URL | Why first |
|---|---|---|
| Bazar Nueva Comunidad | facebook.com/BazarNezaOficial | Real Page, 3,146 likes, Nezahualcóyotl — recurring bazares, open calls for exhibitors |
| Bazar Nocturno | facebook.com/BazarNocturnoIzcalli | Real Page, 1,210 likes, 350 check-ins, Cuautitlán Izcalli |
| Bazar Red Emprendedoras | facebook.com/groups/284884441992251 | Real Group, Cuautitlán/Izcalli — Group specifically for local entrepreneurs |
| Bazar la Estación | facebook.com/BazarlaEstaciion | Real Page, Toluca |
| Bazar Emprendedoras C. | facebook.com/p/Bazar-Emprendedoras-C-100089919555020 | Real Page, Cuautitlán Centro |

**Tier 2 — CDMX-adjacent channels (more independently verifiable activity, skew toward curated urban fashion pop-ups):**

| Channel | URL | Note |
|---|---|---|
| @sobreruedas.bazar (Instagram) | instagram.com/sobreruedas.bazar | 7,066 followers, actively posting, publicly invites vendors to reach out — strongest willingness signal found |
| Ventas de Garage CDMX (Facebook Group) | facebook.com/groups/2095326257526446 | "Venta de garage" framing close to Ana's own vocabulary |
| @bazares_mexico (Instagram) | instagram.com/bazares_mexico | 25.6K followers — curator/media account, amplification only |

**Recommended order:** (1) Bazar Red Emprendedoras + Ventas de Garage CDMX first — Groups, peer-posting format. (2) @sobreruedas.bazar second — the one confirmed willingness signal. (3) Remaining organizer Pages as a second wave — breadth, not the fastest path to a real respondent. (4) @bazares_mexico last, amplification only.

**Explicit assumption flags, not settled fact:** open-join vs. admin-approval status wasn't verifiable from outside; Edomex channels' actual composition (itinerant multi-SKU apparel vendors vs. artisans/food/skincare) is inferred, not confirmed; WhatsApp communities are structurally unobservable from outside and can only be reached through a warm referral.

---

## Deliverable 2 — Validation Protocol

**Format:** primarily self-guided (core path 10-14 min — see the estimate below), with a moderator script for live sessions (phone/video/in-person, most likely via warm referral). Both modes use the identical task list and post-task instrument (Deliverable 3) for comparability.

### Core task sequence (Free-tier path — every participant)

| # | Task | Est. time | What it's testing |
|---|---|---|---|
| 1 | Entra a nahui.app como si fuera la primera vez, crea tu negocio con el plan gratis. | 2-3 min | Onboarding comprehension |
| 2 | Registra 3-4 productos que tú realmente vendas, con precios reales. | 3-4 min | Whether her real catalog maps cleanly onto the product's model |
| 3 | **Deliberate interruption task:** empieza a registrar un producto más, a la mitad cambia a Vender sin guardar, luego regresa a Inventario y dinos qué esperabas encontrar. | 1-2 min | `BACKLOG.md`'s own disclosed gap: the draft doesn't survive a nav-tab switch — a direct test of this project's core interruption thesis |
| 4 | Haz 2-3 ventas seguidas, sin pausar, como en un bazar real. | 3-4 min | The core hypothesis (H1): does registration feel fast enough not to compete with the next customer? |
| 5 | Mira el recibo digital después de una venta — ¿qué esperabas ver que no está? | 1 min | Perceived completeness of the receipt |

### Optional branch (Paid-tier curious merchants only)

| # | Task | Est. time | What it's testing |
|---|---|---|---|
| 6 | Activa el plan de pago en Configuración, registra un producto y sigue el flujo de etiquetado de tags (simulado). | 3-4 min | Comprehension/perceived value of the Paid tier |
| 7 | **Deliberate friction task:** con el plan de pago activo, intenta vender un producto registrado pero no etiquetado. | 1-2 min | Tests `product-decisions.md` Q2's resolved design (no manual fallback, forced into tagging mid-sale) against a real merchant's tolerance |
| 8 | Termina la venta, mira el recibo, escanea el QR si aparece. | 1 min | Whether the Claim Token QR resolves — now unblocked, domain fixed |

**Total estimated time:** core path 10-14 min; optional branch adds 5-7 min, offered not required.

### Moderator instructions (live sessions only)

Confirm consent before starting; stay silent unless stuck 30+ seconds, then ask "¿qué esperarías que pasara aquí?" rather than explaining; never suggest the right next tap; log time-to-first-tap, wrong taps/backtracks, spoken confusion, and completion per task; for tasks 3 and 7 specifically, log her *reaction* (tone, whether she says something like "eso no me gustaría que pasara de verdad"), not just recovery.

### Success metrics

Directional signal at this sample size, not a go/no-go bar (`company/market-validation.md`'s own established discipline): product understanding (can she describe Nahui unprompted), usability (completion rate on tasks 1-5, with particular attention to tasks 3/7), perceived value (a concrete named use case, not "está bien"), willingness to adopt/pay (never against a fixed bar), biggest blockers (explicit open-text question plus everything logged during tasks 3/7).

---

## Deliverable 3 — Google Forms Questionnaire

Every question maps to a specific downstream decision or backlog action — no generic satisfaction/NPS questions. **The full hypothesis → decision → threshold reasoning for every question or question-group lives in the companion file `company/merchant-validation-decision-matrix.md`** — this table stays the question list and a short one-line pointer, not a duplicate of that reasoning.

**Revision note (2026-08-15, fourth pass), per five Product Owner refinements:**
1. A new question separates "me confundí" from "esperaba algo distinto" — the SMS-verification case the Product Owner's own walkthrough surfaced was a real expectation mismatch, not a confusion instance, and the two call for different downstream actions (see the rationale below Section B).
2. A forced single-item prioritization question ("si solo pudieras cambiar UNA cosa...") now closes the substantive content, placed deliberately before the opt-in mechanism, not after (rationale below Section E).
3. The Sí/Tal vez/No branching (today's Q16) is corrected to the Product Owner's exact logic: **Sí → community + pilot candidate (pending feedback quality). Tal vez → community + future communications only, no pilot consideration. No → thanked and the flow closes.** The closing text, previously blurring Sí and Tal vez into one shared message, is now three separate variants.
4. Every question — the original set and the two new additions — was re-audited for a stated decision it feeds. Two of the original questions ("¿cuántos bazares haces al mes?" and "si solo pudieras usar una parte desde el día uno, ¿cuál sería?") were cut as thin or now-redundant. Net effect at that point: two cuts, two additions, total question count unchanged at 16 (15 always shown, 1 conditional). (Superseded by the fifth-pass addition below — see that note for the current total.)
5. The completion-time estimate was corrected from **5-8 minutes to 8-12 minutes** at that point — the question count hadn't changed yet, but the mix had shifted toward slower open-ended items (6 paragraph questions, versus 4 before).

**Revision note (2026-08-15, fifth pass), evaluating a specific Product Owner gap question:**

The Product Owner asked whether the instrument can distinguish "the prototype was difficult to use" from "this doesn't reflect how I actually work in a bazaar" — a usability problem versus a workflow/mental-model-fit problem, which call for entirely different fixes (a UX/copy fix vs. a Product Decision about the interaction model itself).

**Judgment, stated plainly rather than hedged:** the fourth-pass instrument (Q6 confusión, Q7 expectativa distinta, Q11 qué te haría dudar, Q14 cambia UNA cosa — pre-fifth-pass numbering) lets this signal *surface*, but does not let it be *cleanly separated* in the resulting data without a coder's subjective judgment call. Q6 is explicitly scoped to confusion by its own wording ("¿en qué parte te confundiste o te trabaste?") — a respondent with a genuine workflow-fit complaint has no prompt inviting that reflection, and may either not report it or misreport it as confusion for lack of better vocabulary in the question itself. Q7 is scoped to a nameable "moment" ("hubo algún momento en que..."), which fits a discrete surprise (the SMS case) but poorly fits a diffuse "this doesn't match my rhythm" feeling that may never present as one instance. Q11 and Q14 are genuine catch-alls that could surface either signal, but a blended answer ("se me hizo difícil, así no es como yo vendo") forces a coder to guess which one she meant. That guessing problem is compounded, not just duplicated, by a real gap in the qualitative codebook itself (Deliverable 5): its eight categories (registration friction, catalog/inventory, segmentation, pricing, NFC/Paid-tier friction, trust/data-loss, tech-literacy/device, other) have no category named for "the interaction model doesn't match how she actually sells" distinct from "registration friction" — so even a coder trying in good faith to tag this distinction has nowhere accurate to put it.

**Decision: add the smallest-footprint fix, not skip it.** Given this campaign's own stated objective (discovering real non-adoption reasons, not collecting positive-sounding usability notes), a merchant could report zero usability friction on every task and still never adopt Nahui because it doesn't fit how she sells — and the instrument, as it stood, could not reliably tell that apart from ordinary usability friction. A codebook-only fix (adding a category without a corresponding question) was considered and rejected as insufficient on its own: it would still require a coder to infer intent from prose that was never actually prompted to draw this line, which is the exact subjectivity risk in question — though the codebook gap is real and gets fixed regardless (see below). A new open-ended paragraph question was considered and rejected as more expensive than necessary: this is a question best answered by forcing a choice, not by hoping she articulates an unprompted reflection in her own words — a forced-choice framing does the classification work more reliably than prose would, at a fraction of the time cost.

**What was added:** one new forced-choice question, **Q7**, placed immediately after Q6 (confusión) — cheap (a multiple-choice item, ~15-25 seconds, versus ~45-90 seconds for another paragraph question) and structurally stronger, since it makes *her* draw the line explicitly rather than leaving it to be inferred. Every question from the prior Q7 onward shifts down by one slot (prior Q7 → Q8, prior Q8 → Q9, ... prior Q15 → Q16, prior Q16 → Q17); every cross-reference in this document and in `merchant-validation-decision-matrix.md` is updated to match. The qualitative codebook (Deliverable 5) also gains a matching **"workflow/mental-model fit"** category, both so Q7's own answers have a home and so open-text answers elsewhere (Q6, Q8, Q9, Q11, Q12, Q15) can be cross-coded against it as corroborating evidence — the question and the codebook fix reinforce each other rather than being alternatives. Net effect: one addition, no cuts, total question count now 17 (16 always shown, 1 conditional). Completion-time estimate recomputed below — stays within the same 8-12 minute band already reported.

**Revision note (2026-08-15, sixth pass), closing a full `ux-critic`/`reviewer` final-review batch — Q7 specifically (M1, M2, N2):**

The final-review pass found Q7's answer set wasn't jointly exhaustive: a respondent who understood the interaction perfectly, watched the prototype work exactly as designed, and still didn't get the outcome she expected (the exact SMS case Q8 exists to probe) had no accurate substantive option to pick — she'd have to misclassify herself under "no entendía qué hacer" or fall back to "otro," the exact outcome Q7 was added to avoid. **Fixed (M1):** a fifth substantive option, stated in full below, captures this case directly. The review also found the workflow-fit option — by the document's own account, the most novel and hardest-to-articulate concept in the whole instrument — had no worked example, while the (easier) expectation-mismatch case got a full concrete one in Q8. **Fixed (M2):** a short, merchant-recognizable example is now inline in that option's own text. Finally, the review flagged that listing the positive "no tuve ningún problema" option first risks a mild primacy pull toward it in a self-administered mobile list, in tension with the questionnaire's own explicit anti-positivity-bias intro framing. **Addressed (N2), by direct judgment rather than a `knowledge-mentor` consultation:** primacy/order effects in single-select survey lists are well-established, uncontroversial survey-design practice, not a nuanced methodological question needing external grounding — the fix is simply reordering, applied below. Every negative/substantive option now precedes the positive one, so a respondent has to actively rule each one out before reaching the easy answer, rather than defaulting to whichever item happens to load first.

**Intro text:**
> Estas preguntas son para vendedoras y vendedores de bazar que probaron el prototipo de Nahui. Nos ayudan a decidir qué construir de verdad — no vendemos nada, y tus respuestas no se comparten fuera del equipo. Lo que más nos sirve es tu honestidad, incluso (sobre todo) si algo no te gustó.

### Section A — Sobre tu negocio

| # | Question | Type | Feeds |
|---|---|---|---|
| Q1 | ¿Qué tipo de productos vendes principalmente? | Short answer | Confirms/refines H1's ICP category scope (`market-validation.md` H1) — whether recruitment targeting and pilot-candidate criteria should tighten or widen around specific merchandise types |
| Q2 | ¿Vendes en bazares privados, tianguis abiertos, o ambos? | Multiple choice | H1 screening (`market-validation.md` §4.2 Q0a) — separates H1's core ICP (private-bazaar sellers) from a tianguis-only comparison population |
| Q3 | ¿En qué zona vendes principalmente? | Short answer | Geographic pilot-feasibility screen — confirms whether a respondent falls inside the Edomex/CDMX-metro range the first pilot needs (`market-validation.md` §2b, candidate criterion 3) |
| Q4 | ¿Cuántos productos distintos manejas más o menos? | Numeric | Direct H2 input (catalog-complexity fit, `market-validation.md` H2) |

**Cut from the original set:** "¿Más o menos cuántos bazares haces al mes?" (frequency segmentation). Its only concrete use — ranking pilot candidates by exposure/data-generation potential — only matters for the subset of respondents who actually opt in at Q16; that's better gathered directly in the follow-up conversation with an opted-in candidate than asked of every respondent up front. Cut for completion rate, not because the underlying signal is worthless — it's resequenced to where it's actually needed, not discarded.

### Section B — Cómo te fue en el recorrido

| # | Question | Type | Feeds |
|---|---|---|---|
| Q5 | ¿Lograste terminar cada una de estas partes sin ayuda? | Checkbox grid | Per-task completion — the only usability signal available for self-guided sessions (Deliverable 2's own usability metric, particular attention to Tasks 3/7) |
| Q6 | ¿En qué parte te confundiste o te trabaste, si acaso? | Paragraph | Direct UX-fix triage input — a confusion signal usually means a discoverability/interaction-design fix |
| Q7 | *(new, fifth pass; options revised sixth pass — M1, M2, N2; stem revised — `brand-guardian`)* Si algo no te salió como esperabas en todo esto, ¿qué fue principalmente? | Multiple choice + otro | Usability-vs-workflow-fit-vs-expectation-mismatch classifier — a distinct signal from Q6, Q8, Q9, Q11, Q12, and Q15 — see rationale below |
| Q8 | ¿Hubo algún momento en que pasó algo distinto de lo que esperabas — aunque en el momento hayas sabido exactamente qué hacer? Por ejemplo: esperar que te llegara un código de verificación por SMS a tu celular, y que nunca llegara. Cuéntanos qué esperabas que pasara en tu caso. | Paragraph | Expectation-mismatch signal, distinct from confusion — see rationale below |
| Q9 | ¿Hubo algo que buscaste y no encontraste — algo que hubieras querido que existiera? | Paragraph | Missing-capability / roadmap-candidate signal |

**Q5's checkbox-grid rows, stated in full — added sixth pass (M4).** The grid mirrors Deliverable 2's own task table exactly, one row per task, in the same order and using Deliverable 2's own task numbering (1-8) rather than restating it with new labels — so the two artifacts can never quietly drift apart:

- Tarea 1 — Crear tu negocio con el plan gratis
- Tarea 2 — Registrar 3-4 productos reales, con precios reales
- Tarea 3 — Empezar a registrar un producto, cambiar a Vender sin guardar, y volver a Inventario
- Tarea 4 — Hacer 2-3 ventas seguidas, sin pausar
- Tarea 5 — Ver el recibo digital después de una venta
- Tarea 6 *(condicional — solo para quien hizo la rama opcional de pago/NFC)* — Activar el plan de pago, registrar un producto y completar el etiquetado de tags
- Tarea 7 *(condicional)* — Intentar vender un producto registrado pero no etiquetado, con el plan de pago activo
- Tarea 8 *(condicional)* — Terminar la venta, ver el recibo, escanear el QR

Rows 6-8 are shown only to respondents who actually attempted Deliverable 2's optional branch — a respondent who never saw those tasks isn't asked to self-report completion on them. These are short task-name labels for specification purposes; the exact on-screen wording (e.g., a plainer "Crear tu negocio" instead of the full sentence) is a Google Forms build-time detail, as long as it stays traceable one-to-one back to this list.

**Q7's answer options, stated in full (revised sixth pass — M1, M2, N2):**
> - No entendía qué hacer en la pantalla (se me dificultó usarlo)
> - Así no es como yo realmente vendo en mi bazar (por ejemplo: cuando llegan varios clientes preguntando por lo mismo al mismo tiempo, o cuando alguien se va y regresa después — la app no sigue ese ritmo)
> - Entendí bien qué hacer, pero el resultado no fue el que esperaba
> - Una mezcla de las dos primeras (se me dificultó usarlo Y no encaja con mi forma de vender)
> - No tuve ningún problema, todo estuvo claro
> - Otro: [texto corto]

**Why the option set changed, sixth pass:**
- **M1 — the new third option** ("Entendí bien qué hacer, pero el resultado no fue el que esperaba") closes a real gap: a respondent who understood the interaction perfectly, watched it work exactly as designed, and still didn't get the outcome she expected (the SMS case Q8 exists to probe) previously had no accurate substantive option — she'd have had to misclassify herself under the usability option or fall back to "otro," the exact outcome Q7 was added to avoid in the first place. This option is a forced-choice mirror of Q8's own framing, not a duplicate of it: Q8 is an open paragraph inviting her to describe one specific moment, in her own words, with a worked example; this option lets the same underlying signal also be captured as a whole-session classification, the same way the usability and workflow-fit options already are. A respondent can select this option *and* still elaborate on the specific moment in Q8 — the two corroborate each other, the same way Q7 and Q8 already corroborate each other on the workflow-fit signal (see the Decision Matrix's Q8 branch (b) cross-check).
- **M2 — the workflow-fit option now carries a concrete example inline**, rather than a bare restatement of the abstract phrasing. This document's own rationale (below) already names the concrete scenario that makes the concept legible — three customers asking about the same item at once, someone walking away and coming back later, the flow assuming a calm gap between customers her real bazaar never gives her — condensed here into a short parenthetical a respondent would recognize from her own experience, rather than left only in this document's prose where she'd never see it.
- **N2 — ordering, corrected.** The positive "no tuve ningún problema" option, previously listed first, is moved to the last substantive position (immediately before "otro"). A self-administered single-select list risks a mild primacy pull toward whichever option appears first, which would work directly against this questionnaire's own explicit anti-positivity-bias framing (the intro text's "sobre todo si algo no te gustó"). Addressed directly, without a `knowledge-mentor` consultation — primacy/order effects in single-select list design are established, low-ambiguity survey-design practice, not a question needing external grounding to resolve safely.

Q7's five substantive options now span three possible root causes and their overlap — a usability problem, a workflow/mental-model-fit problem, and the outcome-mismatch case Q8 also probes in depth — plus a blend option for the first two and a genuine positive; "otro" stays open for anything genuinely uncategorized.

**Why Q7 is a distinct signal from Q6 and Q8, and why it's a forced choice rather than another paragraph question:** Q6 asks her to name *where* she got confused — it presumes a usability framing and doesn't invite a workflow-fit reflection. Q8 asks about a specific *moment* something differed from expectation — it fits a discrete surprise (the SMS case) but not a diffuse sense that the whole interaction model doesn't match her real bazaar rhythm (three customers asking about the same item at once, haggling, walking away and coming back — the flow assuming a calm gap between customers that her real bazaar never gives her). Q7 exists specifically to catch that diffuse case, and to do it as a forced choice rather than open prose, because this is a distinction better made by *her*, explicitly, than inferred by a coder from blended text afterward. Its five substantive options map directly onto the three possible root causes and their overlap; the sixth ("otro") stays open for anything genuinely uncategorized. Q7's own answer also becomes the primary signal for the new "workflow/mental-model fit" codebook category (Deliverable 5) — and lets that category's application to Q6/Q8/Q9/Q11/Q12/Q15's open text be checked against an explicit self-report from the same respondent, rather than resting on inference alone.

**Why Q8 remains a distinct signal from Q6 and Q7, stated explicitly — the Product Owner's own framing:** Q6 (confusion) means the prototype didn't communicate itself clearly — she couldn't tell what to do next. Q8 (expectation mismatch) means the prototype worked exactly as designed, and she still didn't get what she expected — the SMS example named in the question is real and already observed (this document's own Product-truth fact #1: phone/OTP verification accepts any 6-digit code, no real SMS is sent). These are different Product signals and imply different downstream actions:
- A **confusion finding (Q6)** usually triages to a UX/discoverability fix — clearer copy, a more obvious next affordance — `ux-designer`'s territory.
- An **expectation-mismatch finding (Q8)** usually triages to one of two different places, depending on what recurs: **(a)** a communication/framing fix, when the experience just needs to say plainly what will and won't happen (e.g., disclosing that OTP is simulated during the pilot) — a copy fix, `marketing`/`ux-designer`'s territory; or **(b)** something more significant, when a recurring mismatch suggests her mental model of how selling or registration *should* work genuinely differs from how Nahui is built — a Product signal that routes to `product/02-ux/product-decisions.md` as a new entry, not resolved with better wording.
- **Q9** differs from all three — it's about a capability she looked for and it simply didn't exist, not about something behaving differently than she assumed, and not about a diffuse fit problem.

### Section C — Qué tan útil te parece

| # | Question | Type | Feeds |
|---|---|---|---|
| Q10 | ¿Qué parte te pareció más útil para tu negocio? | Multiple choice + otro | Feature-prioritization signal — the Product Owner's own example pattern ("most merchants choose Inventory as first valuable feature → prioritize Inventory") |
| Q11 | ¿Para qué usarías esto en tus propias palabras? | Paragraph | Perceived-value signal — qualitative corroboration for the adoption-intent read (Deliverable 5) |
| Q12 | ¿Qué es lo que más te haría dudar en usar Nahui de verdad? | Paragraph | Explicit adoption-blocker question — this campaign's own stated objective ("discovering why merchants would *not* adopt Nahui") |

**Cut from the original set:** "Si solo pudieras usar una parte desde el día uno, ¿cuál sería?" (same option list as Q10, old Q9; its stated purpose was reading a divergence between "most useful" and "would use first" as an aspirational-vs-practical signal). The Q15 (below) now serves a broader, stronger version of the same "force a single choice" mechanic — not scoped to which already-built feature ships first, but to the single most important thing to change about the whole experience before the pilot. Asking her to force a single choice twice, for a marginal cross-tab signal that was closer to an interesting comparison than a concrete decision input, doesn't earn the fatigue cost.

### Section D — Adopción y precio

| # | Question | Type | Feeds |
|---|---|---|---|
| Q13 | Si Nahui existiera gratis mañana, ¿lo usarías? | Scale | Free-tier adoption-likelihood distribution (Deliverable 5, secondary adoption indicator) |
| Q14 | Si cobrara por funciones extra, ¿preferirías cuota fija, porcentaje, o depende del precio? | Multiple choice + otro | H5 replication (`market-validation.md` H5); feeds `company/business-decisions.md` Q17 (pricing-model type) — **corrected sixth pass (Important finding): not Q11**, which is about billing-cycle *timing* for capability changes, an unrelated question the prior citation wrongly conflated with this one. See the Sixth-pass remediation record below for the entry's original recommended text.

### Section E — Para cerrar

**Section-break text, shown between Section D and Section E (added 2026-08-15, seventh pass — closes N3, see below; wording corrected 2026-08-15 to fix a factual error — see below):**
> Ya casi terminamos: antes de la última pregunta sobre el producto, piensa en todo tu recorrido completo, de principio a fin — no solo en las últimas preguntas sobre precio.

This is a Google Forms section-break/description field, not a question — it introduces Section E the way a Google Form's own section-transition screen normally does, and doesn't add to the 17-question count or move any existing question.

**Fixed — the sentence previously read "Antes de la última pregunta," which is factually wrong: Q15 is the last question about the product itself, but Q16 and Q17 (the opt-in mechanism) follow it, so a respondent primed with "the last question" then hits two more.** That breaks trust at exactly the spot this fix exists to strengthen it, in a campaign whose own stated discipline is to state facts before asking. Reworded to scope the claim to "la última pregunta sobre el producto" — accurate, since Q16/Q17 are about opting in to future contact, not about the product itself — while keeping the frame-widening effect (re-scanning the whole session before answering) fully intact.

| # | Question | Type | Feeds |
|---|---|---|---|
| Q15 | Si solo pudieras cambiar UNA cosa antes de que arranque el primer piloto de Nahui, ¿cuál sería? | Paragraph (short, open) | Forced cross-cutting prioritization signal — see rationale below, and the Decision Matrix for the concrete pattern threshold |
| Q16 | ¿Te gustaría que te tengamos en cuenta para el piloto de Nahui cuando esté listo? | Sí / Tal vez, avísenme / No, gracias | Real adoption-intent filter, with a three-way branch — see Deliverable 4 |
| Q17 | Déjanos un WhatsApp o correo donde podamos contactarte | Short answer, conditional — shown only if Q16 = Sí or Tal vez | Enables real follow-up — what she's contacted *for* differs by branch, see Deliverable 4 |

**Why Q15 sits here, before Q16/Q17, and not after — the Product Owner's own question, reasoned through:** forcing a real prioritization judgment takes genuine thought, and that's easiest to get while she's still in "helping build the product" mode — right after the substantive content questions, not after she's already made her opt-in decision and mentally shifted into "am I staying in touch with this company" mode. Placing it after Q16/Q17 risks two things: a rushed, low-effort answer from fatigue (she's already done the "real" work and is now filling in contact logistics), and an odd framing problem for a respondent who just answered "No" — asking her to imagine changing something "before the pilot" reads strangely once she's already signaled she isn't tracking the pilot. Q15 stays inside the section where she's still reflecting on the product itself, immediately before the mechanism that shifts her attention to whether she wants ongoing contact.

**Resolved (N3, seventh pass) — Q15's proximity to Section D's pricing questions.** The sixth pass logged this as an open item pending a `knowledge-mentor` consultation rather than resolving it unilaterally, since it read as a genuine anchoring/availability-bias risk needing methodological grounding, not a settled convention the way N2's ordering fix was. The consultation confirmed the risk is real: Tier 2 evidence (a survey-methodology resource in `Knowledge/UX-UI/`) names Availability Bias specifically as the mechanism at play — what's most recently active in working memory (pricing, just answered) is cheaper to retrieve than a genuine re-scan of the whole session, especially under the cognitive load a mobile self-administered form already creates — and notes that Q15's forced-single-answer, open-ended format doesn't protect against this and may compound it: an effortful open-ended question under completion-time pressure is exactly where satisficing (reaching for the most available answer rather than the best one) shows up. The same source's own general survey-construction guidance names the established, low-cost fix directly: a short contextualizing sentence at a block/section transition ("insertar frases para contextualizar al participante") is standard practice, not an ad-hoc workaround.

**Applied:** the section-break text stated above, shown between Section D and Section E, immediately before Q15 — it explicitly re-widens her frame back to the whole session before she names her one thing. This is structural (a Google Forms section-header/description field), not a new question — it doesn't touch the 17-question count, the 8-12 minute estimate, or the already-settled Q15-before-Q16/17 placement rationale immediately above, which addresses a different adjacency (Q16/17's opt-in mechanism, not Section D's pricing content) and stays unchanged.

**Considered and not chosen:** moving Section D after Q15 entirely, which would more completely remove the adjacency. Rejected on cost, not on merit — it would re-trigger a consistency review across every cross-reference this document and the Decision Matrix build on Section D/E's current order (Deliverable 5's coding strategy, the Decision Matrix's Section D/E rows, the completion-time derivation), in a document already through six same-day revision passes, for a mitigation whose lighter-weight alternative the evidence itself frames as standard, sufficient practice — not a compromise forced by expedience.

**Complementary, not a substitute: a post-hoc corroboration check.** Q15's coding now also cross-checks a price/cost-themed answer against independent price-mentions already present in that same respondent's Section B open text (Q6, Q8, Q9) — the same corroboration logic this instrument already applies to workflow/mental-model-fit categorization (Q7 cross-checked against Q6/Q8/Q9/Q11/Q12/Q15, per Deliverable 5's codebook). This is a triangulation aid for a coder's judgment, not a statistical correction, and it can't recover a signal that was never named in Q15 in the first place because pricing was simply more available in the moment — it stays a complement to the section-break mitigation above, not a replacement for it. See the corresponding addition to `merchant-validation-decision-matrix.md`'s Q15 row, and Deliverable 5's coding strategy below.

**Closing text — three variants, one per Q16 branch (previously one shared text blurring Sí and Tal vez; corrected here):**

> **If Q16 = Sí:**
> ¡Gracias por tu tiempo y por contarnos cómo llevas tu negocio! Quedas en nuestra lista de acceso prioritario para el piloto de Nahui, y ya formas parte de nuestra comunidad de early adopters. Si al leer tus respuestas vemos que conoces bien tu negocio y nos compartiste el detalle real de cómo vendes, te consideramos entre las primeras candidatas para el piloto — y entre las primeras en recibir los kits de tags cuando arranque. Eso se decide por el interés real y la calidad de tus respuestas, nunca al azar.

> **If Q16 = Tal vez, avísenme:**
> ¡Gracias por tu tiempo y por contarnos cómo llevas tu negocio! Ya formas parte de nuestra comunidad de early adopters, y te vamos a mantener al tanto de las novedades de Nahui. Por ahora no te tenemos en la lista para el primer piloto — si más adelante quieres que te consideremos, nos puedes escribir cuando quieras.

> **If Q16 = No, gracias:**
> ¡Gracias por tu tiempo y por contarnos cómo llevas tu negocio — de verdad nos ayuda muchísimo, aunque no sigas con nosotros por ahora!

**Estimated completion time — 8-12 minutes, unchanged by the sixth-pass edits.** Q7's fifth answer option and reordering don't add or remove a question, and Q5's row-content specification (M4) states content the grid already implicitly had — the total question count stays at 17 (16 always shown, 1 conditional), and the count of paragraph/open questions stays at **6** (Q6, Q8, Q9, Q11, Q12, Q15). The reported range stays **8-12 minutes**, per the same per-item convention established in the fourth pass. **Confirmed unaffected by the seventh pass too:** the Section D/E section-break description added to close N3 (above) is a Google Forms description field, not a question — it adds zero items to the 17-question count and zero minutes to this estimate.

Deliberately excluded: no "¿qué tan satisfecha estás del 1 al 10?", no generic NPS — every question maps to a specific downstream action, not a vibe check. Full hypothesis → decision → threshold mapping for every question/group: `company/merchant-validation-decision-matrix.md`.

---

## Deliverable 4 — Incentive Strategy (revised 2026-08-15, fourth pass — three-way opt-in branch corrected; question numbering updated 2026-08-15, fifth pass)

**No monetary incentive, of any kind.** No cash, no gift card, no phone recharge, no voucher — nothing. This isn't an open budget question left to fill in later; it's a deliberate design choice. The objective of this campaign is attracting merchants genuinely interested in helping shape Nahui, not merchants motivated primarily by a payment. Removing money from the mechanism entirely is how that selection actually happens — it's the mechanism working as intended, not a compromise on what the campaign can offer.

**The structure that replaces it, per the Product Owner's exact branching logic — corrected below to a genuine three-way split, resolving the earlier version's blurred Sí/Tal vez treatment:**

1. **Early-adopter community — guaranteed to "Sí" and "Tal vez, avísenme" alike.** Any participant who completes the prototype walkthrough and questionnaire and answers either "Sí" or "Tal vez, avísenme" to Q16 joins the early-adopter community. This half of the mechanism is genuinely unconditional for both branches — no quality bar, no selection, open to anyone who opts in either way.
2. **Priority-list access and pilot candidacy — "Sí" respondents only.** Answering "Sí" additionally places her on the priority list for the first Nahui pilot and marks her as an active pilot candidate. "Tal vez, avísenme" respondents are **not** added to this list and are **not** under active pilot consideration — they join the community and receive future communications, nothing more, until/unless they say otherwise. This is the corrected distinction: the earlier version of this document treated "Sí" and "Tal vez" as functionally identical for priority-list purposes ("anyone who answers Sí or Tal vez is added to a priority list"), which was wrong — a place on the priority list is a real, meaningful thing being offered, and offering it to "Tal vez, avísenme" respondents (who explicitly haven't committed to pilot interest) would have blurred the one part of this mechanism that's supposed to signal something real.
3. **Consideration for pilot admission and NFC starter kits — merit-based, among "Sí" respondents only.** Being on the priority list means being *considered*, not admitted. Actual selection for the first pilot cohort, and for one of the first NFC starter kits when the pilot begins, is based on genuine interest and the quality of the feedback given during the walkthrough and questionnaire — never random, never first-come. A "Sí" respondent who gives thin or generic answers stays on the list but isn't prioritized; a "Sí" respondent who clearly demonstrates she understands her own business and engaged seriously with the prototype is who actually gets selected first. This part of the mechanism is unchanged from the prior version — only which respondents it applies to (Sí only, not Sí+Tal vez) is corrected.
4. **"No, gracias" — thanked, and the flow closes.** No community membership, no priority list, no further contact initiated by Nahui. She's thanked for her time (see Deliverable 3's closing-text variant), and that's the end of the relationship unless she reaches out herself later.

**Why this serves "build a community of early adopters" over "maximize participation" (the Product Owner's own explicit objective), and why the corrected three-way split strengthens that, not weakens it:**
- Removing any monetary instrument removes the one incentive that would otherwise attract people motivated by the reward rather than by the product — the entire mechanism, not just the merit-based half, now selects for genuine interest by design.
- A guaranteed, real, zero-cost benefit (community membership) still gives every "Sí" or "Tal vez" respondent a reason to finish honestly, without creating any incentive to rush or embellish answers to compete for something scarce.
- Distinguishing "Sí" (active pilot interest) from "Tal vez" (open to staying in touch, not yet committing) keeps the priority list meaning something specific — a merchant reading "quedas en nuestra lista de acceso prioritario" should be able to trust that claim reflects a real signal she gave, not a default extended to anyone who didn't say "No." Blurring the two, as the prior version did, would have quietly inflated the priority list with respondents who never actually signaled pilot interest — the opposite of what a merit-based, genuine-interest selection mechanism is supposed to protect.
- Conditioning pilot admission and NFC-kit consideration on demonstrated genuine interest — rather than a random draw or first-come order — self-selects for people who actually want an ongoing relationship with Nahui, which is what a pilot cohort and an early-adopter community both need to be worth building.

**Tracking note for Deliverable 5 — corrected for the three-way branch:** report Q16's three outcomes (Sí rate, Tal vez rate, No rate) separately, never as one blended "opt-in %" — collapsing them back into a single figure would silently reintroduce the exact ambiguity this revision exists to remove. Sí rate is the strongest single quantitative adoption-intent proxy this instrument produces; Tal vez rate is a distinct, weaker signal (willingness to stay in touch, not commitment) worth tracking on its own, not folded into Sí's number. Since selection from the priority list is never random and never first-come, there's nothing else to track separately from these three rates and the qualitative read of Q6/Q7/Q8/Q9/Q11/Q12 — who actually gets selected from the priority list is a qualitative judgment made after the fact, not a metric to report.

---

## Deliverable 5 — Analysis Plan

The per-question hypothesis → decision → threshold mapping this section summarizes at the aggregate level is fully operationalized, question by question, in `company/merchant-validation-decision-matrix.md` — read that file for the concrete pattern thresholds; this section stays the aggregate analysis approach.

### Quantitative metrics
Task completion rate per task (1-8), split by the two deliberate-friction tasks (3, 7) vs. the rest; Free-tier adoption-likelihood distribution (Q13); pricing-preference distribution (Q14, read directionally); usability-vs-workflow-fit-vs-expectation-mismatch distribution (Q7, read directionally — see Decision Matrix); **Q16's three-way rate — Sí, Tal vez, and No, reported separately** (not a single blended "opt-in %," per Deliverable 4's corrected tracking note) — Sí rate is the strongest single quantitative adoption proxy this instrument has.

### Qualitative coding strategy
Open-text answers (Q6, Q8, Q9, Q11, Q12) coded against a fixed codebook reusing categories already established in `market-validation.md`/`jobs-to-be-done.md`, plus one added in the fifth pass: registration friction (H1), catalog/inventory control (H2), segmentation/customer recognition (H3), pricing/willingness to pay (H5), NFC/Paid-tier friction (Task 7-specific), trust/data-loss concern, tech-literacy/device barrier, **workflow/mental-model fit** (*new, fifth pass* — the interaction model itself doesn't match how she actually sells, distinct from a discoverability/usability problem, **and distinct from registration friction (H1) — disambiguating clause added sixth pass:** registration friction covers a specific step in the sale-registration flow being too slow, effortful, or interruption-prone; workflow/mental-model fit covers the interaction model's overall shape or pace not matching her selling rhythm, independent of any single step's own cost. A response like "así no es como yo llevo mi control real" codes to registration friction if she's naming a specific step's time/effort cost, and to workflow/mental-model fit if she's describing the interaction model's shape or pace as a mismatch with how she actually sells — when genuinely ambiguous, a coder defaults to workflow/mental-model fit only if that respondent's own Q7 forced-choice answer corroborates it, the same corroboration discipline already used for Q8 branch (b); primary signal is Q7's own forced-choice answer, cross-coded against this category when it recurs in Q6/Q8/Q9/Q11/Q12's open text), other/uncategorized. Two independent coders where feasible. At n<30, treat code frequencies as illustrative, not proportions worth citing numerically. **Q8 specifically** also gets tagged by the communication-fix vs. mental-model-mismatch distinction described in Deliverable 3's own rationale, since the two route to different owners. **Q15** (the forced single-change question) is coded separately, not folded into this general friction codebook — it's a forced single answer per respondent, so its analysis is a tally of named "one thing" answers against the same threshold discipline as `market-validation.md`'s pattern-recurrence logic, not a multi-code content analysis. **Added seventh pass, closing N3:** a price/cost-themed Q15 answer is additionally cross-checked against that same respondent's own Section B open text (Q6, Q8, Q9) for an independent price-mention — convergence strengthens the signal, absence is a flag for closer coder scrutiny, not a basis to discard the answer outright; see `merchant-validation-decision-matrix.md`'s Q15 row and the campaign document's Seventh-pass remediation record for the full rationale.

### Segmentation approach
Cross-tabulate outcomes against: merchant type/product category (Q1), bazaar type (Q2), catalog size band (Q4), and session mode (self-guided vs. moderated, to check for a moderator-presence confound).

### Adoption indicators
Q16 **Sí rate** (primary), Q16 **Tal vez rate** (secondary, distinct signal — not blended with Sí), Q13 "definitivamente/probablemente sí" (secondary), a concrete Q11 answer (qualitative corroboration) — read together, not in isolation.

### Usability indicators
Per-task completion (Q5), with particular attention to whether Task 3 (draft-loss interruption) and Task 7 (forced-tag NFC interruption) produce disproportionately worse completion or stronger negative language than the rest of the flow — the entire reason those two tasks were deliberately included. Q7's forced-choice distribution is read alongside this — a Task 3/7 completion gap paired with a Q7 skew toward "no entendía qué hacer" corroborates a genuine usability finding; the same gap paired with a skew toward "así no es como yo vendo" (or the blend option) points toward a workflow-fit finding instead, and a gap paired with a skew toward the new "entendí bien, pero el resultado no fue el que esperaba" option points toward an expectation-mismatch finding instead — the three route differently (see the Decision Matrix).

### Confidence thresholds — stated honestly

- **n=20:** directional/qualitative-signal territory only. A reported proportion carries roughly ±20pp margin of error at 95% confidence — do not report a single percentage from this size as a stable finding.
- **n=100:** margin narrows to roughly ±10pp — enough to distinguish a strong majority from a weak one, not enough for confident sub-segment cuts.
- **n=300:** margin narrows to roughly ±5.7pp — legitimate segment-level comparisons become possible. Every respondent at any sample size is self-selected through a recruited channel — state that boundary explicitly at any n, never claim statistical representativeness for "all itinerant vendors in Mexico."

**Note, added sixth pass:** these bands describe n=20/n=100/n=300 specifically. The Decision Matrix's own default 3-of-10 convention operates at n=10, where the real worst-case margin is closer to ±31pp, not the ±20pp figure above — see that companion document's own corrected framing of this distinction, added in the same pass, for which of its rules that imprecision actually matters for.

### Feeding back into the backlog
Hypothesis-tier updates go into `company/market-validation.md` §6 (H1-H6, upgraded only with two independent sources, per that document's own bar). UX-specific findings route to `product/02-ux/product-decisions.md` or `product/02c-high-fidelity-prototype/BACKLOG.md`'s reprioritization. **Pricing findings (Q14) feed `company/business-decisions.md` Q17 (pricing-model type) as evidence, not a resolution — corrected sixth pass: not Q11**, which is about billing-cycle timing, a different question the prior citation wrongly conflated with this one (see the Sixth-pass remediation record below for the entry's original recommended text). Anything that doesn't fit an existing open question gets classified (Architect/Product/Business Decision) and logged in the matching file — never resolved unilaterally. **The specific, per-question routing and numeric/pattern thresholds that trigger each of these actions are in `company/merchant-validation-decision-matrix.md`** — this paragraph states where things go in general; that file states exactly when.

---

## Sixth-pass remediation record (2026-08-15) — closing the `ux-critic`/`reviewer` final-review batch

Each finding from the final-review batch, and how it was addressed, for traceability:

- **B1 (Blocker) — recruitment time promise didn't reconcile with Deliverables 2/3.** Fixed: 1a/1b now state "entre 18 y 26 minutos en total," the literal sum of Deliverable 2's core-path estimate (10-14 min) and Deliverable 3's questionnaire estimate (8-12 min), with an explicit derivation note requiring recomputation if either estimate changes. See 1a/1b and the "Time promise, reconciled" note above.
- **M1 (Major) — Q7's answer options weren't jointly exhaustive.** Fixed: added a fifth substantive option ("Entendí bien qué hacer, pero el resultado no fue el que esperaba"). See Q7's option list and rationale above.
- **M2 (Major) — Q7's workflow-fit option had no worked example.** Fixed: added a concrete parenthetical example (multiple customers asking about the same item at once; someone leaving and returning) inline in that option's text.
- **M3 (Major) — two Decision Matrix thresholds cited n=20/±20pp reasoning to justify n=10 rules with a real ~±31pp margin.** Fixed in the companion file: Q5's Task 3/7 completion-gap rule now requires a 30pp+ gap at n=10 to log even a *candidate* signal (not "confirmed"), with confirmation gated at n≥20; Q13's free-tier-adoption escalation now requires n≥20, with the same pattern below n=20 logged as a non-escalated candidate signal instead. The general default-convention section is corrected to state the real n=10 margin and to explain why most rows' imprecision was low-consequence while these two specifically needed the fix. See `company/merchant-validation-decision-matrix.md`.
- **M4 (Major) — Q5's checkbox-grid rows were never specified.** Fixed: the eight row labels are now stated in full, mirroring Deliverable 2's task table by shared numbering. See "Q5's checkbox-grid rows, stated in full" above.
- **Important — Q14 wrongly cited as feeding `business-decisions.md` Q11.** Fixed in both this document and the companion Decision Matrix: the citation is corrected to point to a new, not-yet-created `business-decisions.md` entry on pricing-*model type*, since Q11 is actually about billing-cycle *timing* and doesn't cover this question at all. **Recommended entry text, for Main to review and apply** (per `company/CLAUDE.md`, `business-decisions.md` ownership sits outside `marketing`'s own scope):

  > ### Q17 — What pricing model should Nahui actually charge (flat fee, percentage, or usage-dependent), for functions beyond the free tier?
  > - **Raised by:** `company/merchant-validation-campaign.md` Deliverable 3 Q14 ("Si cobrara por funciones extra, ¿preferirías cuota fija, porcentaje, o depende del precio?") — this campaign document and its companion Decision Matrix previously (incorrectly) cited this question as feeding Q11, which is actually about billing-cycle *timing* for capability changes (immediate vs. deferred), not pricing *model type*. Corrected during the campaign document's sixth remediation pass (2026-08-15) once the mismatch was found; this entry is the corrected destination for that evidence. `company/market-validation.md`'s own H5 entry already gets this right — it cites Q11 only to note it's "still open," never claims resolution through it.
  > - **Question:** Which pricing model should Nahui actually charge for Paid-tier functionality — a flat/fixed fee (e.g., monthly or seasonal, matching `company/CLAUDE.md`'s stated direction), a percentage-of-sales model (already rejected in principle — Ana "explicitly rejects Amazon/Mercado Pago-style fee models," per `company/CLAUDE.md`'s Business model direction), or some hybrid/depends-on-context structure? `company/CLAUDE.md` already states a directional lean ("Flat/seasonal pricing instead of monthly if usage isn't monthly-constant") and a hard exclusion (no transaction commission), but that's stated as direction, not a settled Business Decision backed by market evidence — Q14's own answer options ("cuota fija, porcentaje, o depende del precio") are designed to test whether that direction generalizes beyond Ana or needs revision.
  > - **Why this needs a Business Decision, not just a design fix:** pricing-model type is a strategic commercialization choice with real financial-modeling implications, and directly affects the free/paid tier design already committed in `company/CLAUDE.md`. Not something `architect` can resolve from the Foundation; not something `marketing` should resolve unilaterally from survey evidence.
  > - **Relationship to Q11 — genuinely separate, stated explicitly so this never gets re-conflated:** Q11 asks *when* a self-service capability change (e.g., Free→Paid) takes effect once a merchant makes it; this entry asks *what pricing shape* Nahui charges in the first place. Q11's own resolution notes it's "blocked on [a] pricing/billing model being designed first" — this entry is the open question Q11's own blocking language points at but never itself defined until now.
  > - **Evidence expected:** `company/merchant-validation-campaign.md` Deliverable 3 Q14's response distribution (directional only, per that document's own confidence-threshold discipline — never resolved from survey data alone, however skewed); `company/market-validation.md` H5 (pricing model generalization beyond Ana).
  > - **Status:** Open. Does not block current design/build work — same posture Q11 already takes ("does not block current work"). Flagged as new so Q14's evidence has an accurate home instead of continuing to misroute to Q11.

- **Suggestion — Q7's "Feeds" table cell cited an inconsistent cross-reference list.** Fixed: the table now reads "a distinct signal from Q6, Q8, Q9, Q11, Q12, and Q15," matching the fuller list already used in the full rationale and Deliverable 5's coding-strategy list.
- **Suggestion — the "workflow/mental-model fit" codebook category wasn't disambiguated from "registration friction (H1)."** Fixed: Deliverable 5's codebook entry now carries an explicit disambiguating clause, including a worked example and a tie-break rule (defer to that respondent's own Q7 answer when genuinely ambiguous). See Deliverable 5's Qualitative coding strategy above.
- **N2 (Minor) — Q7 primacy/order-effect risk.** Addressed directly, without a `knowledge-mentor` consultation — reordering to remove a well-established primacy risk didn't need external grounding. See Q7's revised option list and the "Why the option set changed" note above.
- **N3 (Minor) — Q15 anchoring risk from proximity to Q13/Q14.** Not resolved unilaterally in this pass — logged as an explicit open item under Section E, with a specific `knowledge-mentor` consultation requested (for Main to dispatch) rather than left silently unaddressed or guessed at. **Closed in the Seventh-pass remediation record below**, once the requested consultation returned.

**`brand-guardian` pass (2026-08-15) — Q7's finalized copy, one Minor finding, fixed.** The question stem originally read "Pensando en todo lo que acabas de hacer: si algo no te resultó como esperabas, ¿qué fue principalmente?" — a reflective-prompt scaffold that broke register against every sibling question in this same section (Q6, Q8, Q11 all ask directly, no preamble). **Fixed:** stem changed to "Si algo no te salió como esperabas en todo esto, ¿qué fue principalmente?" — matches Q11's own precedent of using "esto" casually, keeps the whole-session scope the five options need, drops the scene-setting colon construction. The five answer options themselves passed with no findings, including the two flagged as risk areas going in (the workflow-fit example and the new fifth option) — both read as lived/plainspoken, not invented or bolted-on.

---

## Seventh-pass remediation record (2026-08-15) — closing N3 via a `knowledge-mentor` consultation

The sixth pass left one item open rather than resolved unilaterally: N3, Q15's anchoring/availability-bias risk from sitting directly after Section D's pricing questions (Q13/Q14). Per the standing Consultation Pattern (`company/CLAUDE.md`), Main dispatched the requested `knowledge-mentor` consultation; findings returned tagged by tier:

- **Tier 1 (Project Foundation):** silent on survey methodology — confirmed by direct check, not assumed.
- **Tier 2 (`Knowledge/UX-UI/` learning resources) — the source that actually resolved this.** A survey-methodology deck on cognitive biases explicitly names Anchoring Bias, and more precisely for this case, Availability Bias — what's most recently active in working memory (pricing, just answered) is cheaper to retrieve than a genuine re-scan of the whole session, especially under the cognitive-load conditions a mobile self-administered form creates. Q15's forced-single-answer format doesn't protect against this and may compound it, since an effortful open-ended question under completion-time pressure is exactly where satisficing shows up. The same deck's own general survey-construction guidance names the established, low-cost mitigation directly: a short contextualizing sentence at block/section transitions ("insertar frases para contextualizar al participante") is standard practice, not an ad-hoc workaround.
- **Tier 3 (general/model knowledge), convergent with Tier 2.** The post-hoc corroboration-check idea already under consideration is methodologically sound — a standard convergent-validity/triangulation technique, consistent with a pattern this instrument already uses (the workflow/mental-model-fit codebook's own Q7 tie-break rule, which already defers to a respondent's own Q7 answer when Q6/Q8/Q9/Q11/Q12 read ambiguously). It's a complement to upfront mitigation, not a substitute for it — at this instrument's own stated small-N confidence discipline, a single respondent's absence of an independent price-mention is a weak flag for a coder's judgment call, not a statistical correction, and can't recover a signal that never got named in Q15 in the first place.

**Applied:**
1. A Google Forms section-break/transition sentence between Section D and Section E, immediately before Q15 — see Section E above for the exact text and its full rationale.
2. A post-hoc corroboration check added to Q15's own analysis: a price/cost-themed Q15 answer is cross-checked against independent price-mentions in that same respondent's Section B open text (Q6, Q8, Q9) — see Deliverable 5's coding strategy above and `merchant-validation-decision-matrix.md`'s Q15 row.

**Considered and not chosen:** a full Section D/E reorder (moving Section D after Q15), which would more completely remove the adjacency but at real cost — re-triggering a consistency review across every cross-reference this document and the Decision Matrix build on Section D/E's current order, in a document already through six same-day revision passes, for a mitigation whose lighter-weight alternative the evidence itself frames as standard, sufficient practice.

**Unaffected:** question count (still 17 — 16 always shown, 1 conditional), completion-time estimate (still 8-12 minutes), and the already-settled Q15-before-Q16/17 placement rationale — the section-break addition is a description field, not a question, and doesn't touch any of the three.

N3 is now closed. This was the last open item from the sixth-pass remediation batch — the whole questionnaire is ready for `ux-critic`/`reviewer` final re-verification of the full sixth-and-seventh-pass batch together.

---

## What's ready vs. what still needs a Product Owner call

**Ready, pending explicit go-ahead to run:** all five deliverables above, plus the companion `company/merchant-validation-decision-matrix.md` — it introduces no new merchant-facing content, only the internal analysis-to-decision mapping for what's already listed here, so it carries the same readiness status as Deliverable 3/5.

**Still open:**
- How "consideration" for a limited number of NFC starter kits gets communicated so it reads honestly as *consideration* — never as an implied promise — given that only a small number of kits will exist when the first pilot begins. The current copy (1a, 1b, Deliverable 3's Sí-branch closing text) states this as conditioned on genuine interest and feedback quality, explicitly never guaranteed; worth a final Product Owner read specifically for whether that line lands as clearly as intended before this goes live, since it's the one piece of the incentive structure that could still be misread as a promise if a future edit loosens the wording.

**Confirmed, not open — `company/business-decisions.md` Q17 already exists.** The recommended entry text in the Sixth-pass remediation record above was applied by Main and verified correct and content-accurate by `reviewer` directly; it's `business-decisions.md` Q17, not a pending creation. Q14's evidence has an accurate home to land in.

**Next in the pipeline, per the Product Owner's own sequencing:** N3 is now closed (Seventh-pass remediation record above) — the last open item from the sixth-pass review batch. Next: `ux-critic`/`reviewer` spot-check of this final small remediation batch (the N3-sentence factual-error fix above, Deliverable 2's stale Format-line time estimate, the Status-line/revision-history Major-finding count, the Decision Matrix's Q5-row justification, and the `business-decisions.md` Q17 cross-references) — a focused verification of these five specific edits, not a full re-review.
</content>
