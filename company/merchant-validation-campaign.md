# Nahui — First Large-Scale Merchant Validation Campaign

**Status: Drafted, incentive structure finalized by the Product Owner (2026-08-14/15). Recruitment copy and questionnaire revised to match. Not yet approved to run — nothing in this document has been posted, sent, or contacted. Requires explicit Product Owner sign-off before any piece goes live, per the standing Approval gate (`company/CLAUDE.md`).**

Prepared by `marketing`, two passes: initial full draft (2026-08-14), then a revision (2026-08-14/15) after the Product Owner rejected a raffle-based incentive in favor of a guaranteed reward. Grounded in `company/CLAUDE.md`, `company/backlog.md`, `company/brand/brand-guide.md`, `brand/character-bible.md`, `brand/tone-of-voice.md`, `product/00-foundation/global-principles.md`, `product/00-foundation/decision-log.md`, `product/02c-high-fidelity-prototype/README.md` + `BACKLOG.md`, `company/market-validation.md`, `company/jobs-to-be-done.md`, `company/business-decisions.md`, `product/02-ux/product-decisions.md`, `company/usability-testing-plan.md` §7.3.

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
> Si vendes en bazares, nos ayudarías muchísimo si le echas un ojo a una versión de prueba de lo que estamos construyendo y respondes un cuestionario corto (10-15 min). Por completarlo, te mandamos una tarjeta de regalo de Amazon [monto a definir] — es segura para todas las personas que terminan la prueba, no es una rifa.
>
> Si además nos cuentas con detalle cómo llevas tu negocio, quedas entre las primeras en enterarte cuando abramos el piloto de Nahui — con acceso prioritario y entre las primeras en recibir los kits de tags NFC.
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
> Como agradecimiento, le mandamos una tarjeta de regalo de Amazon [monto a definir] a cada persona que complete la prueba y el cuestionario — no es una rifa ni un sorteo, es segura para quien participe.
>
> Y si en tus respuestas vemos que conoces bien tu negocio y nos compartes el detalle real de cómo vendes, te dejamos entre las primeras candidatas para el piloto de Nahui cuando esté listo — con acceso prioritario y entre las primeras en recibir los kits de tags NFC para vender con etiquetas.
>
> No es una venta, no te pedimos dinero, y no compartimos tu información con nadie fuera de Nahui.
>
> [liga al cuestionario]
> ¡Gracias por tu tiempo! 💛

Both versions checked against `brand/tone-of-voice.md`: no manufactured urgency, no imperative framing, states facts before asking, never implies her current methods (notebook, memory) were wrong, never oversells what's built. No "sorteo"/"entra a ganar" language anywhere — the gift card is stated as guaranteed and unconditional on completion; the pilot/NFC-kit line is conditioned on engagement quality, never on chance.

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
> Como agradecimiento por completar el cuestionario, te vamos a mandar una tarjeta de regalo de Amazon [monto a definir]. Es para todas las personas que terminan la prueba y el cuestionario completo — no hay sorteo ni nada que adivinar.
>
> Si al leer tus respuestas vemos que conoces bien tu negocio y nos compartiste el detalle real de cómo vendes, te vamos a tomar en cuenta con prioridad cuando abramos el piloto de Nahui — incluyendo entre las primeras en recibir los kits de tags NFC para vender con etiquetas.
>
> Si quieres que te tengamos en la lista para el piloto, dinos que sí en la siguiente pregunta y déjanos un dato de contacto para poder buscarte.

Deliberately excluded: no "¿qué tan satisfecha estás del 1 al 10?", no generic NPS — every question maps to a specific downstream action, not a vibe check.

---

## Deliverable 4 — Incentive Strategy (final, per Product Owner decision 2026-08-14/15)

**No raffle, no chance-based mechanism.** The original idea (raffling "first Premium pilot access" + an NFC Starter Kit) is fully retired. Final structure:

1. **Guaranteed thank-you.** Every participant who completes both the prototype walkthrough and the questionnaire receives an Amazon gift card ([monto a definir] — value set by the Product Owner against real budget). Unconditional on completion, decoupled from what she said — a participant who's honestly critical never has criticism cost her the reward.
2. **Priority access.** Every participant who opts in (Q15) is added to a priority list for future Nahui pilot invitations.
3. **Genuine-engagement path to pilot/NFC priority.** Participants who show real interest and give thoughtful, specific feedback — not just anyone who opts in — become the primary candidates for the first pilot and for receiving the initial NFC starter kits, delivered when the pilot actually begins, not immediately and not by drawing. This also resolves the earlier procurement concern (the kit isn't a sourced/available item yet) without weakening its value — a future pilot benefit, not a giveaway with a delivery deadline.

**Why this serves "build a community of early adopters" over "maximize participation" (the Product Owner's own explicit objective):**
- A guaranteed, completion-based reward removes any incentive to rush or game answers to qualify for a chance at a prize — everyone who genuinely finishes gets the same thank-you, no reward for volume over quality.
- Conditioning pilot/NFC priority on demonstrated genuine interest — rather than a random draw among all entrants — self-selects for people who actually want an ongoing relationship with Nahui.
- Sequencing the NFC kit to real pilot onboarding is a stronger signal to a serious respondent than an immediate giveaway would have been.

**Tracking note for Deliverable 5:** since there's no raffle, there's nothing to track separately from Q15's own opt-in rate — Q15 opt-in is the single adoption-intent proxy this instrument produces, not one of two numbers to keep apart.

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

**Still open:** the guaranteed thank-you's exact dollar amount (every "[monto a definir]" placeholder above needs a real number set against budget before this goes live).
