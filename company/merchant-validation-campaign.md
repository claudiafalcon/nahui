# Nahui — First Large-Scale Merchant Validation Campaign

**Status: Drafted, incentive structure revised by the Product Owner to a fully non-monetary structure (2026-08-15). Recruitment copy and questionnaire revised to match. Not yet approved to run — nothing in this document has been posted, sent, or contacted. Requires explicit Product Owner sign-off before any piece goes live, per the standing Approval gate (`company/CLAUDE.md`).**

Prepared by `marketing`, three passes: initial full draft (2026-08-14); a revision (2026-08-14/15) after the Product Owner rejected a raffle-based incentive in favor of a guaranteed reward; and a third revision (2026-08-15) after the Product Owner removed the monetary component entirely — the guaranteed thank-you is now priority-list access to the first pilot and the option to join the early-adopter community, both open to anyone who opts in; actual pilot admission and NFC starter-kit distribution stay merit-based, decided by genuine interest and feedback quality, never by chance or order of arrival. Grounded in `company/CLAUDE.md`, `company/backlog.md`, `company/brand/brand-guide.md`, `brand/character-bible.md`, `brand/tone-of-voice.md`, `product/00-foundation/global-principles.md`, `product/00-foundation/decision-log.md`, `product/02c-high-fidelity-prototype/README.md` + `BACKLOG.md`, `company/market-validation.md`, `company/jobs-to-be-done.md`, `company/business-decisions.md`, `product/02-ux/product-decisions.md`, `company/usability-testing-plan.md` §7.3.

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
> Si vendes en bazares, nos ayudarías muchísimo si le echas un ojo a una versión de prueba de lo que estamos construyendo y respondes un cuestionario corto (10-15 min). Al terminar puedes decirnos si quieres que te tengamos en cuenta para el primer piloto de Nahui, y desde ahí mismo puedes unirte a nuestra comunidad de early adopters.
>
> Mientras más nos cuentes con detalle cómo llevas tu negocio, mejor podemos decidir a quién invitar primero al piloto — y a quién considerar entre las primeras en recibir los kits de tags NFC cuando estén listos. Eso se decide por el interés real y por la calidad de tus respuestas, no por orden de llegada.
>
> [liga al cuestionario]
> ¿Te late? Cualquier duda, aquí ando.

### 1b. Long version (Facebook Groups/Pages post)

> ¡Hola! Somos Nahui 💛
>
> Estamos construyendo una app para que vendedoras y vendedores de bazar lleven el control de sus ventas sin que eso les quite tiempo con el cliente. Todavía no está terminada — y antes de seguir armándola, queremos platicar con quienes de verdad la van a usar: tú.
>
> Te invitamos a probar una versión de prueba (unas pantallas, no la app completa) y a responder un cuestionario corto sobre cómo llevas tu negocio hoy — te toma entre 10 y 15 minutos.
>
> Al completar la prueba y el cuestionario, puedes decirnos que quieres que te tengamos en cuenta para el piloto de Nahui — quedas en nuestra lista de acceso prioritario, y ahí mismo puedes unirte a la comunidad de early adopters, sin esperar a nada más.
>
> Si en tus respuestas vemos que conoces bien tu negocio y nos compartes el detalle real de cómo vendes, te consideramos entre las primeras candidatas para el piloto — y entre las primeras en recibir los kits de tags NFC cuando el piloto arranque. Eso lo decidimos por el interés real y la calidad de lo que nos cuentas, nunca al azar ni por quién llega primero.
>
> No es una venta, no te pedimos dinero, y no compartimos tu información con nadie fuera de Nahui.
>
> [liga al cuestionario]
> ¡Gracias por tu tiempo! 💛

Both versions checked against `brand/tone-of-voice.md`: no manufactured urgency, no imperative framing, states facts before asking, never implies her current methods (notebook, memory) were wrong, never oversells what's built. No monetary language anywhere, no "sorteo"/"entra a ganar" framing — priority-list access and the community opt-in are stated as genuinely open to everyone who completes and opts in; pilot admission and NFC-kit consideration are stated plainly as conditioned on genuine interest and feedback quality, never on chance or order of arrival.

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

**Format:** primarily self-guided (10-15 min, matching the recruitment copy), with a moderator script for live sessions (phone/video/in-person, most likely via warm referral). Both modes use the identical task list and post-task instrument (Deliverable 3) for comparability.

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
| 6 | Activa el plan de pago en Configuración, registra un producto y sigue el flujo de "etiquetado" NFC (simulado). | 3-4 min | Comprehension/perceived value of the Paid tier |
| 7 | **Deliberate friction task:** con el plan de pago activo, intenta vender un producto registrado pero no etiquetado. | 1-2 min | Tests `product-decisions.md` Q2's resolved design (no manual fallback, forced into tagging mid-sale) against a real merchant's tolerance |
| 8 | Termina la venta, mira el recibo, escanea el QR si aparece. | 1 min | Whether the Claim Token QR resolves — now unblocked, domain fixed |

**Total estimated time:** core path 10-14 min; optional branch adds 5-7 min, offered not required.

### Moderator instructions (live sessions only)

Confirm consent before starting; stay silent unless stuck 30+ seconds, then ask "¿qué esperarías que pasara aquí?" rather than explaining; never suggest the right next tap; log time-to-first-tap, wrong taps/backtracks, spoken confusion, and completion per task; for tasks 3 and 7 specifically, log her *reaction* (tone, whether she says something like "eso no me gustaría que pasara de verdad"), not just recovery.

### Success metrics

Directional signal at this sample size, not a go/no-go bar (`company/market-validation.md`'s own established discipline): product understanding (can she describe Nahui unprompted), usability (completion rate on tasks 1-5, with particular attention to tasks 3/7), perceived value (a concrete named use case, not "está bien"), willingness to adopt/pay (never against a fixed bar), biggest blockers (explicit open-text question plus everything logged during tasks 3/7).

---

## Deliverable 3 — Google Forms Questionnaire

Every question maps to a specific downstream decision or backlog action — no generic satisfaction/NPS questions.

**Intro text:**
> Estas preguntas son para vendedoras y vendedores de bazar que probaron el prototipo de Nahui. Nos ayudan a decidir qué construir de verdad — no vendemos nada, y tus respuestas no se comparten fuera del equipo. Lo que más nos sirve es tu honestidad, incluso (sobre todo) si algo no te gustó.

| # | Question | Type | Feeds |
|---|---|---|---|
| Q1 | ¿Qué tipo de productos vendes principalmente? | Short answer | ICP segmentation |
| Q2 | ¿Vendes en bazares privados, tianguis abiertos, o ambos? | Multiple choice | H1 screening (`market-validation.md` §4.2 Q0a) |
| Q3 | ¿En qué zona vendes principalmente? | Short answer | Geographic-fit check |
| Q4 | ¿Más o menos cuántos bazares haces al mes? | Multiple choice | Frequency segmentation |
| Q5 | ¿Cuántos productos distintos manejas más o menos? | Numeric | H2 input, catalog-complexity fit |
| Q6 | ¿Lograste terminar cada una de estas partes sin ayuda? | Checkbox grid | Per-task completion (Deliverable 2's usability metric) |
| Q7 | ¿En qué parte te confundiste o te trabaste, si acaso? | Paragraph | Direct UX-fix triage input |
| Q8 | ¿Hubo algo que buscaste y no encontraste? | Paragraph | Unmet-expectation / Product Decision candidate |
| Q9 | ¿Qué parte te pareció más útil para tu negocio? | Multiple choice + otro | Prioritization signal |
| Q10 | Si solo pudieras usar una parte desde el día uno, ¿cuál sería? | Same option set as Q9 | Divergence from Q9 = aspirational vs. practical value |
| Q11 | ¿Para qué usarías esto en tu negocio, en tus propias palabras? | Paragraph | Perceived-value signal |
| Q12 | ¿Qué es lo que más te haría dudar en usar Nahui de verdad? | Paragraph | Explicit adoption-blocker question |
| Q13 | Si Nahui existiera gratis mañana, ¿lo usarías? | Scale | Free-tier adoption likelihood |
| Q14 | Si cobrara por funciones extra, ¿preferirías cuota fija, porcentaje, o depende del precio? | Multiple choice + otro | H5 replication, `business-decisions.md` Q11 input |
| Q15 | ¿Te gustaría que te tengamos en cuenta para el piloto de Nahui cuando esté listo? | Sí / No / Tal vez, avísenme | **Real adoption-intent filter** — see Deliverable 4 |
| Q16 | Déjanos un WhatsApp o correo donde podamos contactarte (mostrado solo si Q15 = Sí/Tal vez) | Short answer, conditional | Enables real pilot-candidate follow-up |

**Closing text:**
> Gracias por tu tiempo y por contarnos cómo llevas tu negocio — de verdad nos ayuda muchísimo.
>
> Si quieres que te tengamos en cuenta para el piloto de Nahui cuando esté listo, dinos que sí en la siguiente pregunta y déjanos un dato de contacto para poder buscarte — quedas en nuestra lista de acceso prioritario, y desde aquí mismo te puedes unir a nuestra comunidad de early adopters.
>
> Si al leer tus respuestas vemos que conoces bien tu negocio y nos compartiste el detalle real de cómo vendes, te consideramos entre las primeras candidatas para el piloto — y entre las primeras en recibir los kits de tags NFC cuando el piloto arranque. Eso se decide por el interés real y la calidad de tus respuestas, nunca al azar.

Deliberately excluded: no "¿qué tan satisfecha estás del 1 al 10?", no generic NPS — every question maps to a specific downstream action, not a vibe check.

---

## Deliverable 4 — Incentive Strategy (revised, per Product Owner decision 2026-08-15 — fully non-monetary)

**No monetary incentive, of any kind.** No cash, no gift card, no phone recharge, no voucher — nothing. This isn't an open budget question left to fill in later; it's a deliberate design choice. The objective of this campaign is attracting merchants genuinely interested in helping shape Nahui, not merchants motivated primarily by a payment. Removing money from the mechanism entirely is how that selection actually happens — it's the mechanism working as intended, not a compromise on what the campaign can offer.

The structure that replaces it, in full:

1. **Priority-list access — guaranteed to everyone who opts in.** Any participant who completes the prototype walkthrough and questionnaire and answers "Sí" or "Tal vez, avísenme" to Q15 is added to a priority list for the first Nahui pilot. This part is genuinely unconditional: a place on the list, open to anyone who says yes — but a place on the list, not automatic admission to the pilot itself. That distinction is stated plainly everywhere this is communicated, never blurred.
2. **Early-adopter community — same mechanism, no new question.** Q15's opt-in is also how she joins the early-adopter community. No separate step, no additional form field — Q16 collects the contact info both the priority list and the community run on.
3. **Consideration for pilot admission and NFC starter kits — merit-based, not guaranteed.** Being on the priority list means being *considered*, not admitted. Actual selection for the first pilot cohort, and for one of the first NFC starter kits when the pilot begins, is based on genuine interest and the quality of the feedback given during the walkthrough and questionnaire — never random, never first-come. A participant who opts in but gives thin or generic answers stays on the list; a participant who opts in and clearly demonstrates she understands her own business and engaged seriously with the prototype is who actually gets selected first.

**Why this serves "build a community of early adopters" over "maximize participation" (the Product Owner's own explicit objective):**
- Removing any monetary instrument removes the one incentive that would otherwise attract people motivated by the reward rather than by the product — the entire mechanism, not just the merit-based half, now selects for genuine interest by design.
- A guaranteed, real, zero-cost benefit (priority-list access, community membership) still gives every participant who opts in a reason to finish honestly, without creating any incentive to rush or embellish answers to compete for something scarce.
- Conditioning pilot admission and NFC-kit consideration on demonstrated genuine interest — rather than a random draw or first-come order — self-selects for people who actually want an ongoing relationship with Nahui, which is what a pilot cohort and an early-adopter community both need to be worth building.

**Tracking note for Deliverable 5:** since selection is never random and never first-come, there's nothing to track separately from Q15's own opt-in rate and the qualitative read of Q7/Q8/Q11/Q12 — Q15 opt-in remains the single quantitative adoption-intent proxy this instrument produces; who actually gets selected from the priority list is a qualitative judgment made after the fact, not a metric to report.

---

## Deliverable 5 — Analysis Plan

### Quantitative metrics
Task completion rate per task (1-8), split by the two deliberate-friction tasks (3, 7) vs. the rest; Free-tier adoption-likelihood distribution (Q13); pricing-preference distribution (Q14, read directionally); Q15 opt-in rate — the strongest single quantitative adoption proxy this instrument has.

### Qualitative coding strategy
Open-text answers (Q7, Q8, Q11, Q12) coded against a fixed codebook reusing categories already established in `market-validation.md`/`jobs-to-be-done.md`: registration friction (H1), catalog/inventory control (H2), segmentation/customer recognition (H3), pricing/willingness to pay (H5), NFC/Paid-tier friction (Task 7-specific), trust/data-loss concern, tech-literacy/device barrier, other/uncategorized. Two independent coders where feasible. At n<30, treat code frequencies as illustrative, not proportions worth citing numerically.

### Segmentation approach
Cross-tabulate outcomes against: merchant type/product category (Q1), bazaar type (Q2), frequency band (Q4), catalog size band (Q5), and session mode (self-guided vs. moderated, to check for a moderator-presence confound).

### Adoption indicators
Q15 opt-in (primary), Q13 "definitivamente/probablemente sí" (secondary), a concrete Q11 answer (qualitative corroboration) — read together, not in isolation.

### Usability indicators
Per-task completion (Q6), with particular attention to whether Task 3 (draft-loss interruption) and Task 7 (forced-tag NFC interruption) produce disproportionately worse completion or stronger negative language than the rest of the flow — the entire reason those two tasks were deliberately included.

### Confidence thresholds — stated honestly

- **n=20:** directional/qualitative-signal territory only. A reported proportion carries roughly ±20pp margin of error at 95% confidence — do not report a single percentage from this size as a stable finding.
- **n=100:** margin narrows to roughly ±10pp — enough to distinguish a strong majority from a weak one, not enough for confident sub-segment cuts.
- **n=300:** margin narrows to roughly ±5.7pp — legitimate segment-level comparisons become possible. Every respondent at any sample size is self-selected through a recruited channel — state that boundary explicitly at any n, never claim statistical representativeness for "all itinerant vendors in Mexico."

### Feeding back into the backlog
Hypothesis-tier updates go into `company/market-validation.md` §6 (H1-H6, upgraded only with two independent sources, per that document's own bar). UX-specific findings route to `product/02-ux/product-decisions.md` or `product/02c-high-fidelity-prototype/BACKLOG.md`'s reprioritization. Pricing findings (Q14) feed `company/business-decisions.md` Q11 as evidence, not a resolution. Anything that doesn't fit an existing open question gets classified (Architect/Product/Business Decision) and logged in the matching file — never resolved unilaterally.

---

## What's ready vs. what still needs a Product Owner call

**Ready, pending explicit go-ahead to run:** all five deliverables above.

**Still open:** how "consideration" for a limited number of NFC starter kits gets communicated so it reads honestly as *consideration* — never as an implied promise — given that only a small number of kits will exist when the first pilot begins. The current copy (1a, 1b, Deliverable 3's closing text) states this as conditioned on genuine interest and feedback quality, explicitly never guaranteed; worth a final Product Owner read specifically for whether that line lands as clearly as intended before this goes live, since it's the one piece of the incentive structure that could still be misread as a promise if a future edit loosens the wording.
