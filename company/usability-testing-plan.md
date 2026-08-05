# Usability Testing Plan — Medium-Fidelity Clickable Prototype

Prepared by: Market Validation & Go-to-Market (marketing agent)
Original draft: 2026-08-04. **Finalized into execution-ready shape: 2026-08-04 (same day, Product Owner request).**
Stage: Product Validation Sprint. **Still preparation only — every asset below is a final draft, not a sent/posted/scheduled artifact.** Same Approval gate as everything in `company/market-validation.md` applies identically here: nothing gets published, sent, or used with a real person until the Product Owner explicitly approves that specific item. Being "finalized" means the copy and scripts are genuinely ready to use the moment approval is given — it does not mean approval has been given. Section 8 states exactly what's still pending and on whom.

## What this is, and what it isn't

This tests **the prototype**, not the ICP hypotheses. `company/market-validation.md` already has a survey and an interview guide (§4.2, §4.6) whose job is to find out whether Ana's frictions generalize to other vendors — a market-breadth question, asked before any screens existed. This document is a different activity: hand a real person the actual built screens (`product/02b-medium-fidelity`'s clickable prototype, file `DPRnGD5JWjfoNBSlAFoVG4`) and observe whether they can understand and complete the three journeys it demos, unaided. Don't conflate the two — a participant here doesn't need to pass H1's screening criteria to be useful (though ICP-fit participants are preferred, see Section 7 below); they need to be a plausible target user handed a phone.

The three journeys under test, per `product/02b-medium-fidelity/CLAUDE.md`:
1. **First-time merchant, empty inventory** — Onboarding ("Empezar gratis") → Home cold start → Registrar mercancía (Inventario) → Nuevo evento (Eventos) → sell with buttons (Home) → Resultados.
2. **Existing NFC merchant** — Home (pre-populated, tagged inventory, Idle) → Nuevo evento → sell with NFC (Home) → Resultados.
3. **Inventory management** — Home → Inventario → add product → Asignar Tags → ready to sell.

Known prototype limitations that the moderator must be aware of going in (so they're not misread as usability failures): cross-document hops (e.g., Eventos → Home) open a new browser tab instead of transitioning in place (a real Figma platform limit, `company/infrastructure-decisions.md` ID003); several states are deliberately unwired (error/slow states, "Ver un ejemplo," most destructive/cancel branches, and — per `home.md`/`CLAUDE.md` — neither selling mode has a wired "add a second item" loop-back reaction); a picker selection (Lugar/Tipo/Producto) doesn't visibly populate the form field it closes back to (documented gap, not fixed). None of these are things a participant is expected to work around alone — see Section 0's dead-end probe.

---

## 0. Moderator Master Script — run the session from this section, start to finish

**This is the only section a moderator needs open (printed or on a second screen) during a live session.** It assembles the exact sequence, in order, using the exact wording already established in Sections 1, 2, and 4 below — nothing here is new content, it's those pieces stitched into one linear script so nobody has to flip between sections mid-session. Sections 1-7 remain the reference/rationale material (why 6-8 participants, why this task order, who to test with) — read those before a session, not during one. Written for someone who has never run a session before: follow it top to bottom.

### Before the participant arrives — checklist
- [ ] Figma prototype link open and tested on the device the participant will actually use (their own phone, or a lent device — Section 8.2 item 5 decides which)
- [ ] This script (Section 0), a blank consent form (Section 2.2), and a blank observation template (Section 3) — one printed or on-screen copy per participant
- [ ] Pen/way to take notes even if also recording
- [ ] Recording method ready and tested, only if approved and decided (Section 8.2 item 6)
- [ ] Incentive ready, only if approved and decided (Section 8.2 item 1)
- [ ] Task order memorized: Journey 1 (5 tasks) → Journey 3 (2 tasks) → Journey 2 (3 tasks) — Journey 2 last since it reuses Home/Eventos context the participant is already oriented in by then; Journey 3 placed second since it's short and keeps momentum between the two longer journeys (rationale: Section 1.2)

### Step 1 — Opening
Greet the participant normally, then say:
> Hola, gracias por tu tiempo. Antes de empezar, te cuento rápido cómo va a funcionar esto.

### Step 2 — Briefing (verbatim, Section 2.1)
> Te voy a pedir que hagas algunas tareas normales, como si fueras a usar la app en tu día a día — por ejemplo, registrar un producto o hacer una venta. Mientras las haces, me encantaría que digas en voz alta lo que vas pensando: qué esperas que pase al tocar algo, si algo te sorprende, si algo no lo entiendes bien. Entre más hables, más nos ayuda.
>
> No te voy a estar diciendo si vas "bien" o "mal" — quiero ver cómo lo resolverías tú normalmente, sin ayuda. Si en algún momento te quedas atorada/o, está perfecto decírmelo, y yo decido si te dejo intentarlo un poco más o seguimos adelante.
>
> Recuerda: si algo no funciona o no tiene sentido, no es que lo estés haciendo mal — es justo lo que necesitamos encontrar. Antes de seguir, te lo dejo también por escrito y te pido que estés de acuerdo. ¿Alguna duda antes de eso?

### Step 3 — Consent (verbatim, Section 2.2)
Hand over or show the written form while reading it aloud:
> **Nahui — prueba de una app en desarrollo**
>
> Gracias por tu tiempo. Te vamos a pedir que uses una versión de prueba de una app que estamos construyendo para vendedoras y vendedores de bazar, y que nos digas en voz alta qué vas pensando mientras la usas.
>
> Algunas cosas importantes antes de empezar:
> - **Estamos probando la app, no a ti.** Si algo te cuesta trabajo o no lo entiendes, esa es información valiosísima para nosotros — no hay respuestas correctas ni incorrectas, y no te estamos evaluando a ti de ninguna forma.
> - La app todavía **no está terminada** — vas a ver pantallas que no son la versión final, y algunas partes todavía no funcionan (te lo vamos a avisar cuando pase).
> - [Si aplica] Nos gustaría grabar la sesión (audio/video/pantalla) solo para poder revisarla después con calma — nadie fuera del equipo la va a ver, y si prefieres que no grabemos, no hay ningún problema, tomamos notas a mano.
> - Puedes parar cuando quieras, por cualquier razón, sin tener que explicar por qué. No pasa nada.
> - No te vamos a pedir datos de tu negocio real (ventas, clientes) — todo lo que hagas en la prueba es dentro de la app de prueba, no tu información real.
> - [Incentivo, si aplica — Section 8.2 item 1]
>
> ¿Estás de acuerdo en participar bajo estas condiciones? [ ] Sí [ ] No
>
> Nombre (opcional): _______________ Fecha: _______________

**Get an explicit yes/no, out loud, before continuing — don't infer consent from them just picking up the phone.** If "No," thank them warmly and end the session here. No task walkthrough happens, and no data about them is kept. This is a real, acceptable outcome, not a failure of the session.

### Step 4 — Warm-up task (throwaway, think-aloud practice)
> Antes de entrar a la app, vamos a practicar tantito. Abre la cámara de tu celular y, mientras lo haces, dime en voz alta qué vas pensando — nada más para agarrarle la onda a pensar en voz alta, no hay nada que hacer bien o mal aquí.

Use the standard think-aloud opener here, verbatim (Section 1.4):
> Mientras haces esto, dime en voz alta qué estás pensando, qué esperas que pase, qué te llama la atención — no hay respuestas correctas, nos ayuda mucho escuchar tu proceso, aunque sea raro decirlo en voz alta.

### Step 5 — Task walkthrough
Read the journey framing line once at the start of that journey, then each task's exact prompt in order. Score each task against its success definition using one block of Section 3's observation template per task.

**Journey 1 — First-time merchant, empty inventory**
Framing: *"Imagina que acabas de bajar la app y nunca la has usado. Vas a empezar desde cero."*

| # | Say exactly this | Scored against |
|---|---|---|
| 1.1 | "Abre una cuenta gratis y llega a la pantalla principal" | Completes onboarding via "Empezar gratis" through to the Home cold-start screen, unaided |
| 1.2 | "Registra tu primera mercancía (el primer producto que vas a vender)" | Reaches Registrar mercancía from Inventario's cold start, adds at least one product with a quantity, and taps Guardar mercancía successfully, unaided |
| 1.3 | "Crea tu primer evento (el próximo bazar al que vas a ir)" | Fills Lugar/Tipo/Empieza y taps Guardar evento successfully, unaided |
| 1.4 | "Registra una venta usando botones — como si un cliente te acabara de comprar" | Selects product(s) from Home's buttons-mode grid and completes the flow through Finalizar Venta, unaided |
| 1.5 | "Encuentra cuánto vendiste hoy" | Navigates to and opens Resultados for the current day, unaided |

**Journey 3 — Inventory management**
Framing: *"Imagina que te llegó mercancía nueva y la quieres dar de alta con tags para poder venderla con NFC."*

| # | Say exactly this | Scored against |
|---|---|---|
| 3.1 | "Agrega un producto nuevo a tu inventario" | Reaches Add Product from Home → Inventario and completes Guardar mercancía, unaided |
| 3.2 | "Asigna un tag NFC a ese producto nuevo" | Completes the Asignar Tags flow to the "ready to sell" state, unaided |

**Journey 2 — Existing NFC merchant**
Framing: *"Ahora imagina que ya llevas tiempo usando la app, ya tienes tu mercancía cargada y usas los tags NFC para vender."*

| # | Say exactly this | Scored against |
|---|---|---|
| 2.1 | "Crea un evento para el bazar de hoy" | Same success criteria as 1.3, from Home's Idle state |
| 2.2 | "Registra una venta usando NFC (acercando/tocando el tag)" | Adds item(s) via the NFC-mode flow and completes Finalizar Venta, unaided — also note (not pass/fail) whether the participant looks for a product grid that mode 3.10 deliberately never shows |
| 2.3 | "Encuentra cuánto vendiste hoy" | Same as 1.5 |

### Standing probes — use during every task, don't improvise new phrasing mid-session
- **Silent for more than ~10-15 seconds:** *"¿Qué estás pensando en este momento?"* — neutral, never "¿qué esperabas que pasara aquí?" mid-task.
- **Visibly stuck (repeating the same tap, circling back to the same screen) but still talking:** after roughly 45-60 seconds without forward progress, *"¿Qué te gustaría intentar ahora?"* — a neutral nudge, not a hint toward the right answer. If still stuck after that, the moderator decides whether to give a little more time or move on — say so out loud rather than silently redirecting: *"Vamos a seguir con la siguiente, no te preocupes."*
- **Participant asks "¿voy bien?" or similar:** *"Haz lo que te parezca más natural — quiero ver cómo lo resolverías tú sola/o."* Never confirm or deny correctness mid-task, even by tone or expression.
- **Participant hits a genuinely unwired/dead-end state (see intro's Known limitations):** break character and say plainly, *"Eso es algo que todavía no está armado en esta versión de prueba — te lo salto,"* then manually advance them. Log it in Section 3 as a coverage gap, not a task failure.

### Step 6 — Transition to interview (verbatim, Section 4 Apertura)
> Ya terminamos con las tareas — ahora nada más quiero platicar un poco de cómo se sintió usar la app. Otra vez, no hay respuestas correctas, y entre más honesta/o seas, más nos ayuda — aunque sea que algo no te haya gustado nada.

### Step 7 — Post-task interview (verbatim, Section 4, in order)
**A — Confusión y expectativa**
1. ¿Hubo algún momento en el que no sabías qué hacer o qué esperabas que pasara y pasó otra cosa? Cuéntame de esa parte.
2. De todo lo que hiciste, ¿qué fue lo que más se te complicó o lo que sentiste más lento?
3. ¿Hubo algo que tocaste esperando que pasara una cosa, y pasó algo distinto (o no pasó nada)?
4. *(only if relevant, e.g. Journey 2's NFC task)* Cuando usaste el modo NFC, ¿fue como te lo imaginabas? ¿Qué esperabas ver que no viste, o viste algo que no esperabas?

**B — Lo que sí funcionó**
5. ¿Qué parte se sintió más fácil o más natural?
6. ¿Hubo algo que te sorprendió para bien?

**C — Propuesta de valor**
7. Si tuvieras que explicarle a otra vendedora qué hace esta app, ¿qué le dirías?
8. Pensando en tu día a día vendiendo, ¿esto te resolvería algo de verdad, o se sintió como algo bonito pero no tan necesario?
9. ¿Usarías algo así regularmente, si ya estuviera terminado? ¿Por qué sí o por qué no?

### Step 8 — Closing (verbatim, Section 4 Cierre)
> Muchísimas gracias, de verdad nos ayuda un montón. [incentivo, si aplica]. Si en algún momento tenemos una versión más avanzada para probar, ¿te gustaría ser de las primeras en verla?

### Step 9 — Immediately after the participant leaves (before the next session, while it's still fresh)
- Expand every `[EXPAND]`-tagged field in Section 3's filled template into full sentences — this is the point at which fragments become real notes, not during the task itself (see Section 3's live/expand split).
- Log the incentive given, if applicable.
- Log verbatim answers to interview Q1, Q2, Q8, Q9 specifically — these four feed Section 5's synthesis directly.
- Note anything for Section 5 that doesn't fit the per-task template (overall impression, anything said off-script, anything that felt like a signal worth feeding back into `market-validation.md`'s H1-H5 — kept separate from the usability call itself, per Section 5.6).

---

## 1. Usability Testing Protocol

*Reference and rationale for the script above — read this before a session to understand the "why," not during one. Section 0 is what you actually run from.*

### 1.1 Participants — how many, and why

**Recommend 6-8 participants**, not the 25-40 that `market-validation.md`'s survey targets. Usability testing and market-breadth research answer different questions and need different sample sizes: a survey needs enough respondents for a proportion to mean something; a usability test needs enough sessions to *see most of the problems*, which saturates fast. The commonly-cited heuristic here (Nielsen Norman Group's "five users") holds that with a per-user problem-discovery probability around 31%, five participants surface roughly 85% of a design's usability problems, and each additional participant beyond that mostly re-finds problems already seen rather than surfacing new ones.

Reasons to land at 6-8 rather than the bare minimum of 5:
- This isn't one flow — it's three distinct journeys with real behavioral branching (buttons mode vs. NFC mode is a genuinely different interaction, not a skin), so the "5 users" heuristic's single-flow assumption understates what's needed here.
- The ICP isn't locked yet (`market-validation.md`'s H1-H5 are still hypotheses) — a small buffer above 5 hedges against one atypical participant skewing a small sample, without ballooning into survey-sized recruitment effort.
- 6-8 is still a number reachable without a real recruitment campaign, consistent with staying inside what's actually approvable at this stage.

If scheduling only produces 5, that's still usable evidence — flag it as such in the final report (Section 5), don't wait for a "complete" 8. **Ana's session (Section 7.2) counts toward getting the moderator script and materials working, but should be logged and read separately from this 6-8 count** — see Section 7.2 for why.

**2026-08-04 update — a 3-5 fast round, ahead of the full 6-8:** the Product Owner has asked for the fastest realistic path to 3-5 participants inside a roughly 2-day window (Tuesday-Thursday), not the full 6-8. See Section 7.2b for the concrete plan. This doesn't replace the 6-8 target above — it's a first, faster pass that trades completeness for speed deliberately. A 3-5-participant round, especially referral-clustered, plausibly won't reach the ~85% single-flow saturation the "five users" heuristic promises, and this test has three flows, not one. Read Section 5's synthesis from a 3-5 round as a first signal that likely surfaces the sharpest problems, not as a substitute for eventually reaching 6-8 (or topping this round up to it) once the fastest problems are already known and fixed.

### 1.2 Session structure and duration

Recommend **one participant does all three journeys in a single session**, not three separate participant pools per journey — the journeys are short, and splitting participants across journeys would need 3x the recruitment for the same total task-observations. Rough structure, ~50-60 minutes total:

| Segment | Time | Content |
|---|---|---|
| Briefing | 3-4 min | Section 0 Step 2 / Section 2.1's script, spoken before consent — so the participant knows what they're being asked to agree to before being asked to agree to it |
| Consent | 3-4 min | Section 0 Step 3 / Section 2.2's form, walked through verbally and confirmed explicitly (yes/no), not just handed over silently |
| Think-aloud practice (warm-up) | 5 min | Section 0 Step 4; one throwaway warm-up task so think-aloud isn't being learned *and* evaluated on Task 1 at the same time |
| Task walkthrough | 30-35 min | Journey 1 (5 tasks) → Journey 3 (2 tasks) → Journey 2 (3 tasks) — Journey 2 last since it reuses Home/Eventos context the participant will already be oriented in; Journey 3 placed second since it's short and keeps momentum between the two longer journeys |
| Post-task interview | 10-12 min | Section 0 Step 7 / Section 4 |
| Wrap / thanks | 2-3 min | Confirm any incentive, ask about opt-in to future sessions |

**Ordering note:** briefing runs before consent, not after — a participant can't meaningfully agree to a session's terms without first knowing what the session actually involves. Section 2 is written in this order below; Section 0 assembles it the same way.

### 1.3 Moderated/unmoderated, in-person/remote

**Recommend moderated**, not unmoderated. This is a click-through Figma prototype with known dead ends and platform-limitation jank (see above) — an unmoderated session has no way to distinguish "the participant is confused because the design is confusing" from "the participant is confused because they hit an intentionally-unwired branch or a new-tab hop they didn't expect." A moderator can redirect past a known gap in real time and log it as "not a design issue, a coverage gap" instead of contaminating the usability read. This population (bazaar merchants, per `market-validation.md`'s ICP) also can't be assumed to be comfortable navigating an unfamiliar Figma preview link unassisted — that's itself a variable worth removing from what's being measured.

**Recommend in-person as the default, remote (video call, screen share) as an accepted fallback** if in-person scheduling isn't feasible for a given participant. In-person better mimics real conditions (a phone in hand, possibly mid-bazaar-day distraction) and removes a second unfamiliar-technology layer (video-call software) from the session. Remote is fine as a fallback — the loss is realism, not validity, and it keeps the sample from being limited to whoever is geographically reachable.

### 1.4 Think-aloud protocol

Standard **concurrent think-aloud** (participant narrates while acting, not after). The exact phrasing to use is in Section 0's "Standing probes" — use those consistently rather than improvising variants mid-session, so behavior across sessions stays comparable.

### 1.5 Task list, mapped to the three journeys

Each task states what the participant is asked to do (framed in their language, not ours) and the binary **success** definition a moderator scores against. "Without moderator help" means the participant reached the end state via their own taps, with no verbal or physical steering beyond the neutral think-aloud prompts above. The exact prompts and success definitions are reproduced verbatim in Section 0 Step 5 — this is the reference copy; that's the copy to run from.

Note on overlap: 1.2 and 3.1 are the same underlying flow reached from different entry points/contexts (per `CLAUDE.md`'s note that several screens are shared building blocks across journeys). This is intentional, not redundant — it lets the report compare whether the *same* flow performs differently when framed as "your very first product ever" versus "adding one more item to an existing catalog," which is a real difference in mental state worth checking rather than assuming away.

### 1.6 How backlog #1's success bar should — and shouldn't — inform task-level criteria

`product/00-foundation/backlog.md` #1 sets a **live-product** success bar: ≥90% of sales registered, <3 seconds per registration. Being honest about what this test can and can't speak to:

- **What it can't do:** a click-through Figma prototype cannot produce a meaningful "<3 seconds" measurement. Prototype transitions are near-instant regardless of real interaction cost (no real typing latency beyond what the participant actually types, no real NFC hardware read time, no real network round-trip, no real product catalog to search through). A stopwatch time recorded in this test measures "how long it took this person to find the right tap sequence in an unfamiliar interface," not "how long registering a sale takes in production." Presenting a prototype-session time as evidence toward the <3-second bar would overclaim what was actually tested — don't do it, and don't let a synthesized report do it either (see Section 5's explicit guardrail).
- **What it can't do, second point:** "≥90% of sales registered" is a rate measured over many real sales, by many real merchants, over time. A single moderated session with 6-8 participants doing one or two sales each cannot produce a percentage that means the same thing — a 6/8 or 8/8 task-completion rate here is a different statistic answering a different question (did people understand the flow), not an early read on the production threshold.
- **What it *can* do:** task-level success is scored as **completed unaided / completed with moderator help / not completed**, per the definitions in Section 0/1.5 — a comprehension-and-completion question, not a speed question. Approximate elapsed time is still worth recording (Section 3's template includes it) as a *relative, directional* signal — useful for spotting which specific step within a journey felt long or made a participant hesitate, compared against the other steps in the same session — not as a proxy for the <3-second production bar. The report (Section 5) states this distinction explicitly rather than implying a prototype pass predicts production performance.

---

## 2. Participant Materials

Merchant-facing — natural Mexican Spanish, per `global-principles.md`. Internal notes in brackets are for whoever runs the session, not read aloud. **Run in this order: 2.1 briefing, then 2.2 consent, then the session begins** — a participant should know what a session involves before being asked to agree to it. Section 0 Steps 2-3 already assemble this in the correct order for live use; this section is the reference copy.

### 2.1 Pre-session briefing script

> Antes de empezar, te cuento rápido cómo va a funcionar esto:
>
> Te voy a pedir que hagas algunas tareas normales, como si fueras a usar la app en tu día a día — por ejemplo, registrar un producto o hacer una venta. Mientras las haces, me encantaría que digas en voz alta lo que vas pensando: qué esperas que pase al tocar algo, si algo te sorprende, si algo no lo entiendes bien. Entre más hables, más nos ayuda.
>
> No te voy a estar diciendo si vas "bien" o "mal" — quiero ver cómo lo resolverías tú normalmente, sin ayuda. Si en algún momento te quedas atorada/o, está perfecto decírmelo, y yo decido si te dejo intentarlo un poco más o seguimos adelante.
>
> Recuerda: si algo no funciona o no tiene sentido, no es que lo estés haciendo mal — es justo lo que necesitamos encontrar. Antes de seguir, te lo dejo también por escrito y te pido que estés de acuerdo. ¿Alguna duda antes de eso?

### 2.2 Consent / participation form

> **Nahui — prueba de una app en desarrollo**
>
> Gracias por tu tiempo. Te vamos a pedir que uses una versión de prueba de una app que estamos construyendo para vendedoras y vendedores de bazar, y que nos digas en voz alta qué vas pensando mientras la usas.
>
> Algunas cosas importantes antes de empezar:
> - **Estamos probando la app, no a ti.** Si algo te cuesta trabajo o no lo entiendes, esa es información valiosísima para nosotros — no hay respuestas correctas ni incorrectas, y no te estamos evaluando a ti de ninguna forma.
> - La app todavía **no está terminada** — vas a ver pantallas que no son la versión final, y algunas partes todavía no funcionan (te lo vamos a avisar cuando pase).
> - [Si aplica] Nos gustaría grabar la sesión (audio/video/pantalla) solo para poder revisarla después con calma — nadie fuera del equipo la va a ver, y si prefieres que no grabemos, no hay ningún problema, tomamos notas a mano.
> - Puedes parar cuando quieras, por cualquier razón, sin tener que explicar por qué. No pasa nada.
> - No te vamos a pedir datos de tu negocio real (ventas, clientes) — todo lo que hagas en la prueba es dentro de la app de prueba, no tu información real.
> - [Incentivo, si aplica — Section 8.2 item 1]
>
> ¿Estás de acuerdo en participar bajo estas condiciones? [ ] Sí [ ] No
>
> Nombre (opcional): _______________ Fecha: _______________

*[Internal note: recording consent, if used, should be captured as its own explicit yes/no, not bundled silently into general consent — leave the "Si aplica" line active only once a recording method is actually decided, per Section 8.2 item 6.]*

---

## 3. Observation Template

One reusable template, filled per task, per participant. **Capture in two passes, not one** — this is what makes it genuinely fillable live rather than too dense to complete while also moderating:
- **`[LIVE]`** fields are checkboxes/tallies/fragments — fast enough to fill in the moment without breaking moderation flow.
- **`[EXPAND]`** fields are written as a word or fragment during the task, then turned into full sentences in the 1-2 minute gap before the next task starts, or at the latest during Section 0 Step 9 (immediately after the participant leaves, while it's still fresh). No moderator can moderate a session and write full narrative sentences in real time at the same speed — this split is what keeps the template honest about that.

```
SESSION OBSERVATION LOG

Participant ID: __________        Date: __________        Moderator: __________
Session mode: [ ] In-person  [ ] Remote        Recorded: [ ] Yes  [ ] No (notes only)

--- Per task (copy this block for each of the 10 tasks in Section 0/1.5) ---

Task ID / name: __________________________________________________
Journey: [ ] J1 First-time  [ ] J2 NFC merchant  [ ] J3 Inventory mgmt

[LIVE] Attempted:          [ ] Yes   [ ] No (skipped — one-word why: ______)
[LIVE] Completed:          [ ] Unaided   [ ] With moderator help   [ ] Not completed
[LIVE] Time (approx):      start ___:___   end ___:___
  [ ] Time affected by a known prototype limitation (new-tab hop / unwired
      state) — see intro. If checked, don't count this time as a usability
      signal; note which limitation under Moderator notes below.

[LIVE] Errors / wrong taps (tally marks, not descriptions, while it happens):
  | | | | |
[EXPAND] What each error actually was (fill after the task, not during):
  ______________________________________________________________________

[LIVE] Hesitation:  [ ] None   [ ] Some   [ ] Significant
  (tally backtracks/re-reads if it's easy to catch live: ____)
[EXPAND] What the hesitation looked like:
  ______________________________________________________________________

[LIVE] Quote worth keeping — jot the fragment as it happens, don't try to
  transcribe it in full while also moderating:
  "________________________________________________________________"
[EXPAND] Full quote, cleaned up from memory or recording right after:
  "________________________________________________________________"

[EXPAND] Moderator notes (facial expression, tone, comparison to something
else they use, a workaround they tried, anything not captured above):
  ______________________________________________________________________

--- End per-task block ---
```

Fill one full block per task per participant (10 blocks per full session — see Section 0 Step 9 for exactly when the `[EXPAND]` fields get finished). Keep the raw filled logs — they're the primary source Section 5's synthesis pulls from.

---

## 4. Interview Scripts — Post-Task Interview Guide

*Internal use only, spoken portions in natural Mexican Spanish. Distinct from `market-validation.md` §4.6 (which asks about her business and frictions in general, before any product exists to react to). This guide asks specifically about the prototype she just used — 10-12 minutes, right after the task walkthrough while it's fresh. Reproduced verbatim in Section 0 Steps 6-8 for live use; this is the reference copy.*

**Apertura (1 min)**
> Ya terminamos con las tareas — ahora nada más quiero platicar un poco de cómo se sintió usar la app. Otra vez, no hay respuestas correctas, y entre más honesta/o seas, más nos ayuda — aunque sea que algo no te haya gustado nada.

**A — Confusión y expectativa (4-5 min)**
1. ¿Hubo algún momento en el que no sabías qué hacer o qué esperabas que pasara y pasó otra cosa? Cuéntame de esa parte.
2. De todo lo que hiciste, ¿qué fue lo que más se te complicó o lo que sentiste más lento?
3. ¿Hubo algo que tocaste esperando que pasara una cosa, y pasó algo distinto (o no pasó nada)?
4. *(only if relevant, e.g. Journey 2's NFC task)* Cuando usaste el modo NFC, ¿fue como te lo imaginabas? ¿Qué esperabas ver que no viste, o viste algo que no esperabas?

**B — Lo que sí funcionó (2-3 min)**
5. ¿Qué parte se sintió más fácil o más natural?
6. ¿Hubo algo que te sorprendió para bien?

**C — Propuesta de valor (3-4 min)**
7. Si tuvieras que explicarle a otra vendedora qué hace esta app, ¿qué le dirías?
8. Pensando en tu día a día vendiendo, ¿esto te resolvería algo de verdad, o se sintió como algo bonito pero no tan necesario? *(listen for the difference between "está bien" politeness and genuine relevance)*
9. ¿Usarías algo así regularmente, si ya estuviera terminado? ¿Por qué sí o por qué no?

**Cierre (1 min)**
> Muchísimas gracias, de verdad nos ayuda un montón. [incentivo, si aplica]. Si en algún momento tenemos una versión más avanzada para probar, ¿te gustaría ser de las primeras en verla?

**Post-interview (internal, not spoken):** log verbatim answers to Q1, Q2, Q8, and Q9 specifically — these are the four answers Section 5's synthesis keys off of (confusion location, slowness perception, value-prop landing, retention intent).

---

## 5. Evidence Templates — Final Report Synthesis

Fill this once all sessions are complete, pulling from the raw observation logs (Section 3) and interview notes (Section 4). This is the actual "validated product evidence" artifact the sprint exists to produce.

```
USABILITY TEST — SYNTHESIS REPORT

Sessions completed: ____ of ____ planned        Date range: __________
Participant mix (brief, no PII): e.g. "4 vendedoras de bazar privado, 2 con
experiencia previa usando alguna app de ventas, 2 sin ninguna app similar"
[If Ana's session (Section 7.2) is included, list it separately from the
count above and flag it per that section's limitation, rather than folding
it anonymously into the general sample.]

--- 5.1 Task completion rates, per journey ---

Journey 1 — First-time merchant
| Task | Unaided | With help | Not completed | Notes |
|------|---------|-----------|----------------|-------|
| 1.1  |   n/N   |    n/N    |      n/N       |       |
| 1.2  |         |           |                |       |
| 1.3  |         |           |                |       |
| 1.4  |         |           |                |       |
| 1.5  |         |           |                |       |

Journey 2 — Existing NFC merchant
| Task | Unaided | With help | Not completed | Notes |
|------|---------|-----------|----------------|-------|
| 2.1  |   n/N   |    n/N    |      n/N       |       |
| 2.2  |         |           |                |       |
| 2.3  |         |           |                |       |

Journey 3 — Inventory management
| Task | Unaided | With help | Not completed | Notes |
|------|---------|-----------|----------------|-------|
| 3.1  |   n/N   |    n/N    |      n/N       |       |
| 3.2  |         |           |                |       |

--- 5.2 Common failure points ---

For each task where 2+ participants needed help or failed, describe the
*specific* moment/element, not just "task X was hard":
  Task: __________
  What happened: __________
  How many of N participants hit this: ____
  Was it a real design confusion, or a known prototype limitation (per
  the intro's Known limitations list)? [ ] Design  [ ] Prototype limitation
  [If design] Suggested next step: [ ] RFC to Architect (if it implies a
  product-behavior change) [ ] Flag to ux-designer/ui-designer (if it's a
  layout/copy/affordance fix within existing scope)

--- 5.3 Direct quote bank ---

Organize by theme, not by participant — pull the sharpest verbatim lines
from Section 3's logs and Section 4's interviews:
  Confusion: "..." (Participant ID)
  Delight / worked well: "..." (Participant ID)
  Value proposition, in their own words: "..." (Participant ID)
  Retention intent: "..." (Participant ID)

--- 5.4 Validated / Not Validated / Inconclusive — one call per journey ---

State the call plainly, plus the reasoning. Suggested reading (adjust
if the actual pattern in the data doesn't fit these bands cleanly —
these are a starting frame, not a rigid formula):

  VALIDATED — most participants (roughly 5+ of 6-8) completed the
  journey's tasks unaided, confusion points were minor/cosmetic rather
  than blocking, and the post-task interview suggests the value
  proposition landed without heavy prompting.

  NOT VALIDATED — most participants needed moderator help or failed
  outright on one or more tasks in the journey, the same specific
  failure point recurred across several participants (a pattern, not
  a one-off), and/or interview answers suggest the value proposition
  didn't land even after using it.

  INCONCLUSIVE — results are mixed with no clear majority pattern,
  the sample for this specific journey is too small to say (e.g., a
  scheduling gap left only 3-4 observations for one journey), or a
  known prototype limitation (new-tab hop, unwired state) is
  plausibly responsible for enough of the observed friction that the
  design itself can't be fairly judged from this round.

Journey 1 — First-time merchant:     [ ] Validated  [ ] Not validated  [ ] Inconclusive
  Reasoning: __________

Journey 2 — Existing NFC merchant:   [ ] Validated  [ ] Not validated  [ ] Inconclusive
  Reasoning: __________

Journey 3 — Inventory management:    [ ] Validated  [ ] Not validated  [ ] Inconclusive
  Reasoning: __________

--- 5.5 Explicit guardrail (carry forward, don't drop when filling this in) ---

This report speaks to comprehension and task completion on a
click-through prototype. It does NOT speak to, and should not be cited
as evidence toward, backlog #1's live-product thresholds (>=90% of
sales registered, <3 sec per registration) — see Section 1.6 above. Any
elapsed-time figures in this report are relative/directional signals
within this test only, not production-performance estimates.

--- 5.6 Recommended next steps ---

  Design fixes to route to ux-designer/ui-designer: __________
  Items needing an RFC (product-behavior implication): __________
  Open questions for another round of testing: __________
  ICP/market signal surfaced worth feeding back into `market-validation.md`
  (e.g., a phrase a participant used, a reaction that sharpens H1-H5) — kept
  separate from the usability call itself: __________
```

---

## 6. Recruitment Assets — FINAL DRAFTS, SAME APPROVAL GATE AS EVERYTHING ELSE

**This copy is final — one best version per channel, not another round of options. Nothing below has been posted or sent, and nothing goes out without explicit, per-item Product Owner sign-off** (per `market-validation.md`'s Approval gate and `marketing-operating-environment.md`'s "publishing and outreach require a human hand on every send" rule). These drafts are specifically for **usability-test participation** — a different ask than `market-validation.md` §4.1's general ICP-recruitment post (that one asks for 3 minutes answering a survey; this one asks for a ~50-60 minute session using a prototype, in person or on video call). Same target channels already researched in `market-validation.md` §2 (bazaar-organizer Facebook Pages/Groups, Instagram hashtag activity, etc.) — no new channel research needed for this pass.

Two placeholders remain in the copy below — `[incentivo]` and `[contacto]`. These aren't unfinished drafting; they're real, specific pending inputs (a Business Decision and a not-yet-provisioned contact channel, respectively) tracked in Section 8.2. The copy itself doesn't need another revision pass once those two values exist — it needs those two values.

### 6.1 Community post (Facebook Groups/Pages)

> ¡Hola! Somos Nahui — estamos construyendo una app para que vendedoras y vendedores de bazar lleven el control de sus ventas sin que les quite tiempo con el cliente. Buscamos a 6-8 personas que vendan en bazares para probar una versión de prueba (todavía no está terminada) y platicar con nosotros sobre cómo se sintió usarla. Es una sesión de 45-60 minutos, en persona o por videollamada, cuando te acomode — no es una venta ni te pedimos dinero. [incentivo] por tu tiempo. Si te late, escríbenos por acá o manda mensaje a [contacto].
> ¡Gracias! 💛

### 6.2 Direct invite (DM)

*For someone already identified as a good candidate — e.g., a survey respondent who opted in, per `market-validation.md` §4.3's opt-in bridge.*

> Hola [nombre], ¡gracias otra vez por platicar con nosotros! Ya tenemos una versión de prueba de la app y nos encantaría que fueras de las primeras en probarla y contarnos qué tal. Es una sesión de 45-60 minutos donde vas usando la app y nos vas contando qué vas pensando — [en persona / por videollamada], como te acomode mejor. [incentivo]. ¿Te late? Tú dices qué día.

### 6.3 Scheduling confirmation

*Sent once a participant has already agreed to a session.*

> ¡Perfecto! Quedamos el [fecha] a las [hora], [lugar / liga de videollamada]. Te va a tomar como una hora en total. No necesitas preparar nada — solo tu celular (o te prestamos uno, si prefieres). Cualquier cosa, aquí ando: [contacto].

---

## 7. Candidate Merchants and Communities — Prioritization for This Week's Testing

**Real constraint, stated plainly:** this session's tool access is Read/Write/Glob/Grep against the local repository only — no live web/social access. I cannot name a single real, verified merchant, Facebook Group, Instagram/TikTok account, or bazaar organizer here without risking exactly the fabrication Product Truth forbids. Everything below is either (a) a scoring framework to apply the moment a real candidate exists, or (b) Ana — the one merchant Nahui already has a real, validated relationship with. Building an actual list of names beyond Ana requires either the Product Owner's own outreach/network, or a live-access community-verification pass that hasn't happened yet (`market-validation.md` §2.1, still open). Section 8 states this as a specific, actionable checklist item rather than leaving it as background noise.

**Update, 2026-08-04 (live-access pass now run):** the constraint above was true when this document was first drafted. This session had live `WebSearch`/`WebFetch` access and ran the verification pass Section 7.3 previously described as blocked. Section 7.3 below now reports what that pass actually found — real channels, not merchant names (merchant names still correctly don't appear anywhere in this document — see Section 7.3 for why that distinction matters and stays intact).

### 7.1 Prioritization framework — scoring rubric for "who to test with this week"

Builds directly on `market-validation.md` §2b's ICP-fit criteria, re-weighted specifically for immediate usability-test recruitment rather than general market research. §2b optimizes for finding a representative sample over weeks of channel-verification work; this rubric optimizes for finding 6-8 people who can plausibly sit down with a phone for an hour this week.

Score each candidate 0-2 per row (0 = fails, 1 = partial/unclear, 2 = clear fit). **Rows 1 and 2 are gating, not just scored** — a candidate who fails either shouldn't be scheduled regardless of how well they score elsewhere; this week's test needs people who are both reachable and willing, not just theoretically perfect ICP fits.

| # | Criterion | Why it matters for *this* test specifically | 0 | 1 | 2 |
|---|---|---|---|---|---|
| 1 (gating) | Reachable within about a week — a warm contact, a referral, or someone already opted in (e.g., a `market-validation.md` survey/interview respondent who agreed to be contacted again) | Cold outreach to an unverified stranger takes longer than a usability sprint can absorb; §2b's channels (organizer Pages, hashtag activity) aren't verified yet | No plausible path to contact | A channel exists but is unverified/cold | Warm — an existing relationship or an opt-in already in hand |
| 2 (gating) | Willing to be observed using unfinished software by someone they don't know, for 45-60 minutes, and to think out loud the whole time | Not everyone who fits the ICP is comfortable with this, independent of interest in the product itself | Unknown or likely uncomfortable | Probably okay, not confirmed | Explicitly comfortable (asked directly, or clearly implied) |
| 3 | Matches H1's core ICP (multi-SKU apparel/accessories, private bazares, Edomex/CDMX, itinerant — `market-validation.md` §2b criteria 1-4) | Keeps the test population close to Ana's validated context; a poor-fit participant's reactions are harder to interpret cleanly | Clear mismatch (made-to-order only, fixed storefront only, outside Edomex/CDMX metro — §2b's disqualifiers) | Partial fit / unclear | Clear fit on all four |
| 4 | Actually available for a full 45-60 minute session this week, in-person feasible or genuinely comfortable on video call | Session length and moderation quality both depend on this; a rushed session produces weaker data than no session | Not available this week | Available, but only a much shorter slot, or remote-only with low comfort | Available, full length, flexible on mode |
| 5 | Adds mix to the sample already scheduled (different prior experience with any sales-tracking tool, different bazaar type, different tenure selling) | A sample of 6-8 identical profiles answers fewer questions than a slightly varied one, for the same recruitment effort | Identical profile to 2+ already-scheduled participants | Some overlap | Genuinely different angle |

A candidate scoring 2 on every row is close to ideal. A candidate scoring highly on rows 3-5 but failing row 1 or 2 should still not be scheduled this week — theoretical fit doesn't substitute for actual reachability and willingness on a real timeline.

### 7.2 Ana — confirmed top candidate

Ana is the only merchant Nahui has an actual, already-validated relationship with (`company/CLAUDE.md`) — she scores maximally on rows 1-3 of the rubric above by default, and is by far the fastest, lowest-risk session to schedule: no cold outreach, no channel verification, no incentive-mechanics to design for a stranger.

**What a first session with Ana specifically could validate:**
- Whether the prototype's flows genuinely break, confuse, or dead-end for someone who was never coached through them — a real prototype-quality check, independent of who's testing.
- Whether the flows match how she actually described her own process in the original interview — a domain-expert sanity check nobody else can offer as sharply ("esto no es como yo lo hago" is a more specific, more actionable signal from her than from anyone else).
- A safe first real-world run of the Section 0 moderator script and the Section 3 observation template, before using them on someone unfamiliar to the team.

**What it could not validate, and why this is a genuine limitation, not a formality:**
Ana is already deeply familiar with her own workflow, and — because Nahui's product was built directly from her original interview — she may already know, consciously or not, what the "intended" next step in a given flow is supposed to be. That familiarity can let her navigate cleanly through a screen that would genuinely confuse a first-time stranger, not because the design is actually clear, but because she already knows what it's meant to do. Her session is not a substitute for a stranger's first-time reaction and shouldn't be reported as one. It's a valuable, but non-representative, data point — worth running first for the reasons above, but the Section 1.1 sample of 6-8 other participants is still what Section 5.4's Validated/Not Validated call should rest on, not Ana's session in isolation.

**Recommend logging Ana's session under a distinct Participant ID ("ANA"), not folded anonymously into the general 6-8 count**, precisely so Section 5's synthesis can read her results separately and carry this limitation forward, rather than silently averaging a domain expert's reactions in with a demographically different sample.

### 7.2b — Referral-first recruitment plan for this week (Tuesday 8/4 → Thursday 8/6)

**Added 2026-08-04, Product Owner request: fastest realistic path to 3-5 participants, sessions ideally by Thursday.** Ana (above) is the starting point; this subsection is about what happens next — turning one confirmed relationship into 3-5 people without cold outreach. **Referral through Ana's own network is the primary strategy this week. §7.3.2's 8 verified channels (below) are the secondary/backup channel, not the primary** — see 7.2b.4 for exactly when and how they'd get used.

**Why 3-5, not 6-8, changes §1.1's reasoning, not replaces it:** §1.1 recommends 6-8 specifically to hedge against ICP uncertainty and cover three distinct journeys with real behavioral branching, since a single-flow "five users" heuristic understates what three journeys need. That reasoning doesn't go away at 3-5 — it gets partially deferred. A 3-5-person round, especially one clustered through one referrer's network, won't reach the ~85% single-flow saturation the "five users" heuristic promises, and this test has three journeys, not one. Treat this round as a genuine first pass that will surface the sharpest, most obvious problems fast — not as a substitute for eventually reaching 6-8 (or topping this batch up to it) once those fastest problems are known. Section 5's synthesis should say plainly that this is an N=3-5 fast round if that's what ships.

#### 7.2b.1 — The referral ask, concretely

What to ask Ana for, specifically: **an introduction to 2-3 other vendors she sells alongside** at the bazares she attends — not an open-ended "do you know anyone who'd be interested," which is too vague to act on inside two days. Two acceptable mechanics, Ana's choice:
- **(a)** Ana shares their contact info with the Product Owner directly, and the Product Owner reaches out; or
- **(b)** Ana sends them a message herself (draft below), and they reach out when ready.

**Script for the Product Owner to use with Ana** — spoken or WhatsApp, in Spanish since this is direct communication with Ana per `global-principles.md`, and warm/direct/honest per the brand guide (not a corporate-register message even though it's coming from the team):

> Hola Ana, ¿cómo va todo? Oye, te quiero pedir un favor. Estamos por probar la nueva versión de la app con más gente, y pensé que la persona que mejor conoce a otras vendedoras como tú eres tú misma. ¿Conocerías a 2 o 3 personas con las que vendes seguido, que quisieran probarla también?
>
> Me ayudaría mucho si pudieran ser un poco distintas a ti — alguien que venda algo diferente a ropa (zapatos, accesorios, bisutería), alguien que lleve más o menos tiempo vendiendo que tú, o alguien que vaya a bazares distintos a los que tú vas seguido. Así vemos cómo la usa gente con experiencias distintas, no nada más parecidas a la tuya.
>
> Si me pasas sus contactos, yo les escribo directo. O si prefieres, tú les compartes esto que te mando y ellas me buscan cuando quieran. ¿Cómo la ves?

**Draft message Ana could send to a referral herself** (mechanic (b) above) — distinct from Section 6's copy, which is written for Nahui reaching a stranger cold. This one is peer-to-peer, in Ana's own voice, informal "tú," since it's a trusted vendor talking to another vendor, not a company introducing itself:

> Oye [nombre], ¿te acuerdas que te platiqué de la app que estoy probando para llevar mis ventas? Los que la están haciendo (se llama Nahui) me preguntaron si conocía a alguien más que venda en bazares, y pensé en ti.
>
> Quieren que la pruebes tú misma — como una hora, en persona o por videollamada, nada más usando la app y diciendo en voz alta qué vas pensando mientras la usas. No te van a vender nada ni te van a evaluar a ti, es la app la que están probando. [incentivo] por tu tiempo.
>
> ¿Te late? Si sí, te paso el contacto: [contacto] — o si quieres, yo les aviso y ellos te buscan.

Both scripts reuse the same `[incentivo]`/`[contacto]` placeholders as Section 6 — the same pending Business Decision and contact channel already tracked in Section 8.2 items 1 and 4, not a new dependency. The referral path needs the same two inputs the cold-channel path already needed; nothing extra to provision.

#### 7.2b.2 — Realistic timeline for the 2-day window

Being direct about what's achievable rather than inflating feasibility to fit the ask:

**Tuesday 8/4 (today), afternoon/evening:**
- Product Owner reaches Ana (call/WhatsApp), schedules Ana's own session for tonight or tomorrow morning — this is the one session with zero dependency on anything else in this plan, and should be locked in first regardless of how the referral ask goes.
- Same conversation: make the referral ask (7.2b.1's script). Whether Ana can actually name and reach 2-3 people same-day depends entirely on her — a real unknown this plan can't control.

**Wednesday 8/5:**
- Follow up with Ana on referral responses. Realistically, a referral reading a message, deciding, and replying rarely completes same-day even for a warm ask from a trusted peer — expect responses trickling in through Wednesday, not all landing Tuesday night.
- Anyone who says yes gets scheduled for Wednesday evening or Thursday, whichever they can actually do — don't compress a referral's own schedule to force a fit.
- **Midday checkpoint:** how many of Ana + referrals are confirmed/scheduled at this point? This is the trigger moment for whether §7.3.2's channels get activated as a parallel fallback (7.2b.4).

**Thursday 8/6:**
- Run whatever sessions are scheduled. With one moderator and 45-60 minutes per session plus setup/wrap time, realistically **2-3 sessions is a full day**, not more — a same-day scheduling backlog doesn't get absorbed just because Thursday is the target date.

**The honest read:** 3-5 people *recruited and scheduled* by Thursday is achievable if Ana is responsive today and her referrals reply within a day or so — a real but not guaranteed outcome, not a baseline to assume. 3-5 sessions *actually run* by Thursday is optimistic. The more likely outcome is **Ana's session plus 1-2 referrals run by Thursday**, with the remaining sessions trailing into Friday or early the following week rather than all landing inside the original 2-day window. Plan the week around the trailing outcome; treat hitting the full 3-5-run number by Thursday as a good result, not the expectation to hold the plan to.

#### 7.2b.3 — Sample diversity despite referral clustering

Referrals from one person's network cluster by default — same bazar circuit, similar product mix, similar tenure — exactly what §7.1 row 5 flags as reducing what a small sample can answer (four more Anas isn't a meaningfully broader read than one Ana). The referral script in 7.2b.1 already asks Ana to vary three things; restated here explicitly for the Product Owner to check when reviewing who Ana actually names:

- **Different bazar type/venue** — not exclusively the bazares Ana herself attends regularly. Someone she knows from a different private bazar circuit still fits §2b's ICP criteria but removes the risk of testing several people who only ever see the same venue and the same audience.
- **Different tenure** — someone newer to selling than Ana, and/or someone with more years in it. Tenure plausibly affects how quickly someone picks up a new tool, independent of whether the tool itself is clear.
- **Different product category within apparel/accessories** — not exclusively clothing like Ana sells (pajamas, hoodies, socks). Shoes, jewelry/bisutería, and other accessories are still inside H1's ICP (§2b criterion 1, multi-SKU apparel/accessories) but exercise the same inventory/catalog flows against a different mental model of "my products."

If Ana names 2-3 people who all turn out to be close friends from the same stall lineup, it's worth one direct follow-up question rather than accepting the first names offered by default — *"¿hay alguien que conozcas que venda algo distinto, o que vaya a otro bazar?"* is a natural, low-friction way to ask for that without turning the referral ask into something that feels like a screening test.

#### 7.2b.4 — Where §7.3.2's 8 channels fit this week

**Not the primary path this week.** The reasoning in §7.3.2/§8.2 item 7 already holds, and gets sharper under a 2-day constraint specifically: every channel there scores 0 or a partial 1 on Row 2 (willingness) — none has confirmed openness to a *research* ask, as opposed to general vendor recruitment — and the mechanism itself (post → organizer/admin visibility → a follower notices and responds → screening → scheduling) has strictly more sequential steps, each with its own latency, than a warm referral from someone the candidate already trusts. If a cold response comes at all, it plausibly lands days after Thursday, not before it.

**Exact trigger for using it this week:** if, at Wednesday midday's checkpoint (7.2b.2), fewer than 3 people total (Ana + referrals) are confirmed or scheduled, that's the moment to decide whether to activate 1-2 of §7.3.2's best-fit channels as a *parallel* track — not instead of continuing to push referrals, and not with the expectation it produces a session by Thursday. Its realistic payoff is feeding the pipeline for Friday or next week, not this window. `@sobreruedas.bazar` (Instagram, ~7,066 followers, publicly and explicitly inviting apparel-vendor outreach — §7.3.2) is the strongest single candidate to activate first if that trigger is hit, given its partial Row 2 signal relative to the other seven. Activating it still requires its own Approval-gate sign-off before any post or DM goes out, same as every other item in §8.2 — this section names the trigger condition, it doesn't pre-approve the action.

### 7.3 Beyond Ana — what's still needed

No other real *individual merchant* name appears anywhere in this document, and that still holds after this pass — individual vendors aren't discoverable or identifiable through public search/social browsing without outreach (which stays behind the Approval gate), and surfacing a specific person's account here without contacting them would add no real scheduling value while creating a privacy/Product-Truth risk for no benefit. What changed 2026-08-04: this session had live `WebSearch`/`WebFetch` access and ran the community-verification pass this section previously described as blocked (`market-validation.md` §2.1). That pass found real, verifiable **channels** — Facebook Groups/Pages, Instagram accounts — through which real candidate merchants could plausibly be reached. It did not, and could not, find a real candidate merchant's own name (see above) — that next step still requires either posting into one of these channels (Approval gate) or the Product Owner's personal network.

#### 7.3.1 What was searched

Web searches (read-only, no joining/posting/messaging) across: Facebook Groups/Pages combining "bazar" with private-bazaar/venta-de-garage language and Edomex municipios (Cuautitlán, Cuautitlán Izcalli, Nezahualcóyotl, Naucalpan, Tlalnepantla, Toluca, Ecatepec); Instagram accounts and hashtags for "bazar sobre ruedas," "bazar itinerante," `#bazaredomex`; TikTok for bazaar/apparel-vendor content in Edomex; and general CDMX bazaar-directory sites. Each candidate URL that surfaced was then checked directly — via `WebFetch` where the platform allowed it, or via a second, more specific `WebSearch` for indexed detail (like/follower counts, location, recent snippets) where the platform blocked direct fetching, which was the case for essentially every Facebook Page/Group tried (Facebook returns a truncated, unauthenticated shell to `WebFetch` — title visible, body content not). Instagram fetched more completely for public accounts and consistently failed (redirected to a login wall) for hashtag-explore pages specifically, which could not be verified directly.

#### 7.3.2 What was found — real, URL-verified channels

None of these is an individual merchant. All are organizer Pages, entrepreneur-community Groups, or directory/curator accounts — exactly the kind of channel this section was missing. "Verified" here means: the URL resolves to a real, named, located account (confirmed via direct `WebFetch` and/or an independent `WebSearch` snippet), not that its privacy settings, join requirements, or true recent-activity level were independently confirmed beyond what's noted — Facebook in particular blocks deep unauthenticated verification, so "exists and is named/located as described" is as far as most of these could be checked from here.

**Edomex-located bazaar-organizer channels** (closest to H1's geography; fit against §2b's "private/invite-based, not open tianguis" criterion is genuine but imperfect — see caveat below):

| Channel | URL | Location | What's verified | Row 1 — Reachable (channel) | Row 2 — Willingness signal |
|---|---|---|---|---|---|
| Bazar Nueva Comunidad | facebook.com/BazarNezaOficial | Nezahualcóyotl Centro, Edomex | Real Page, 3,146 likes (search-indexed). Self-described as "la plataforma de emprendedores, artesanos y productores del oriente del Edo. de México" — runs recurring bazares, workshops, open calls for exhibitors. | 1 — public Page exists and is sizeable, but posting/joining still needs Approval-gate sign-off; recent-activity dates not independently confirmed (Facebook content blocked) | 0 — no direct evidence either way of receptiveness to a research ask specifically (commercial vendor recruitment ≠ confirmed openness to a usability-study ask) |
| Bazar Nocturno | facebook.com/BazarNocturnoIzcalli | Cuautitlán Izcalli, Edomex | Real Page, 1,210 likes, 350 check-ins (search-indexed). Recurring physical venue (Av. Jiménez Cantú esq. Tlatlaya). | 1 — same caveats as above | 0 — same caveat |
| Bazar Red Emprendedoras | facebook.com/groups/284884441992251 | Cuautitlán, Izcalli y alrededores, Edomex | Real Group, name/URL/location confirmed via search index; member count and join-approval requirement not verifiable without an authenticated fetch. | 1 — a Group specifically for local entrepreneurs is a plausible entry point, but whether it's open-join or vetted couldn't be confirmed | 0 — no evidence either way |
| Bazar la Estación | facebook.com/BazarlaEstaciion | Toluca, Edomex | Real Page confirmed to exist and be named/located as such; content beyond that was blocked from verification. | 1 | 0 |
| Bazar Emprendedoras C. | facebook.com/p/Bazar-Emprendedoras-C-100089919555020 | Cuautitlán Centro, Edomex | Real Page confirmed to exist and be named/located as such; content beyond that was blocked from verification. | 1 | 0 |

**CDMX-adjacent channels** (more independently verifiable in depth, but geography and framing skew away from H1's specific "private bazar en casa/salón" niche toward curated urban design/fashion pop-ups — a real fit gap, not a minor one):

| Channel | URL | What's verified | Row 1 — Reachable | Row 2 — Willingness signal |
|---|---|---|---|---|
| @sobreruedas.bazar (Instagram) | instagram.com/sobreruedas.bazar | Real, actively posting account, 7,066 followers. Bio: "Bazar de ropa, joyería, accesorios y mucho +." Confirmed upcoming event Aug 29-30 2026 near Metrobús Campeche, CDMX (Roma-adjacent), venue "DOMÉSTICO." Recent post activity confirmed late July-early Aug 2026. | 2 — active, public, currently operating, recent and forward-dated content confirmed directly | 1 — the account publicly and explicitly invites apparel/jewelry vendors to reach out ("si tienes un emprendimiento de ropa/joyería... quieres vender tu clóset") — real evidence of openness to *vendor* outreach, though not specifically tested against a *research/usability-study* ask, which is a different kind of request |
| @bazares_mexico (Instagram) | instagram.com/bazares_mexico | Real, active directory/guide account, 25.6K followers. Curates CDMX bazaar listings (Roma, Polanco, Hipódromo, Narvarte), posts dated July-Aug 2026. Not itself an organizer or vendor community — a meta-channel for discovering further organizer accounts/events. | 2 — active and large, but it's a media account, not a vendor community; using it means it might amplify a post, not that its own followers are the target audience | 0 — no evidence of receptiveness to any direct ask, since it's a curator, not a community host |
| Ventas de Garage CDMX (Facebook Group) | facebook.com/groups/2095326257526446 | Real Group confirmed to exist; "venta de garage" framing is close to Ana's own vocabulary. Member count and join-approval requirement not verifiable without an authenticated fetch. | 1 | 0 |

#### 7.3.3 What was found but is too weak or too poor-fit to use

- **@nezahualcoyotlbazar / facebook.com/NezaBazar** — real, explicitly lists "ropa" (clothing) alongside jewelry/skincare, only 335 followers, and its most recent visible post dates from **April 2023** — over three years stale. Confirmed real, but not usable as a reach channel; flagged rather than silently dropped.
- **Municipal-government seasonal bazaars** (e.g., "Bazar Raíces Nezahualcóyotl," "Bazar El Coyote Enamorado," reported by local press) — real events, but organized by city government as formal, open seasonal craft/gift fairs, not the private/invite-based itinerant bazaar circuit `market-validation.md` §2b defines. Disqualified per §2b's own criteria, not included as candidates.
- **`#bazaredomex` as a directly browsable Instagram hashtag page** — could not be verified: `WebFetch` on `instagram.com/explore/tags/bazaredomex` returned Instagram's logged-out landing/login page, not real tag content. Secondary `WebSearch` results describe the hashtag as associated with Edomex bazaar/clothing content, but that's a description of the hashtag, not a direct, independently confirmed view of it — reported here as unverified, not as a real finding.
- **TikTok** — searches for Edomex/CDMX-specific itinerant-apparel-vendor TikTok activity did not surface a real, geographically-specific, currently-active account or hashtag community distinct from what Instagram/Facebook already turned up (results were either generic advice content, unrelated cities, or duplicates of the Instagram accounts above). Searched, found nothing usable beyond what's listed above — stated plainly rather than padded with a loosely-related account.
- **WhatsApp** — as `market-validation.md` §2 already notes, this remains structurally unobservable from outside a private group; nothing new to report here.

#### 7.3.4 Honest read on what this does and doesn't unblock

- It resolves the specific "no channels found" gap this section previously described — there are now 8 real, URL-verified channels (5 Edomex-organizer, 3 CDMX-adjacent), not zero.
- It does **not** produce a real candidate merchant name — that was never the goal of this pass (per the task framing: individual vendors aren't discoverable this way), and none of the channels above should be read as "ready to schedule someone from this week." Every one of them scores 0 or 1 on Row 2 (willingness) except `@sobreruedas.bazar`'s partial 1, and even that's evidence of openness to *vendor* recruitment, not confirmed openness to a usability-research ask specifically — a materially different question that only posting (or a warm intro) could actually answer.
- It does **not** resolve the ICP-fit tension worth naming plainly: the Edomex-organizer channels found (Bazar Nueva Comunidad, Bazar Nocturno, Bazar Red Emprendedoras, Bazar la Estación, Bazar Emprendedoras C.) are recurring, organizer-curated markets for "emprendedores" broadly (mixing artisan crafts, jewelry, skincare, food alongside apparel) — closer to semi-formal organized fairs than to the invite-only "bazar en casa/salón" format Ana specifically described. They're plausible channels to *reach* itinerant multi-SKU apparel vendors (some exhibitors there likely fit H1 exactly), but reaching the organizer isn't the same as reaching the ICP directly — there's an extra hop (organizer → their vendor list/group → an individual itinerant apparel vendor) this pass couldn't complete without contact. The CDMX Instagram accounts found are more directly apparel-focused and independently verifiable, but skew toward curated urban fashion pop-ups (Roma/Condesa-adjacent), not Edomex household bazares — also an imperfect fit, in the other direction.
- **What this implies for Section 8.2 item 7:** the honest takeaway isn't "channel-finding solved it" — it's that even a successful verification pass lands on organizer/community channels one step removed from an actual ICP-fit candidate, each requiring a posting decision (Approval gate) to find out if they convert into real people at all. **The Product Owner's personal network remains the faster, lower-friction path to an actual second candidate this week**; these channels are a real, now-available second track worth pursuing in parallel once approved, not a replacement for that first path — and for this specific 2-day window, referral through Ana (§7.2b) is faster still than either. Section 8.2 item 7 is updated below to reflect this.

Section 7.1's rubric applies the moment any candidate name surfaces from any of the above (or from the Product Owner's network) — nothing further needs to be built to use it.

---

## 8. Product Owner Action Checklist — Ready vs. Blocked, in Priority Order

Specific to getting *this execution package* into real use — not a restatement of the general Approval gate already stated throughout this document and `market-validation.md`.

### 8.0 — This week's priority order (Tuesday → Thursday), referral-first

**Added 2026-08-04.** Sequences everything in 8.2 against the realistic timeline in §7.2b.2. This resequences 8.2's items by *when* to do them — it doesn't change what each item is; see 8.2 below for the full content of each numbered item.

**Today (Tuesday 8/4):**
1. **Item 3 (revised below)** — contact Ana: lock in her own session for tonight or tomorrow morning, and make the referral ask (§7.2b.1) in the same conversation. This is the single highest-priority action this week — everything else in this list either blocks it or follows from it.
2. **Item 1** — decide the incentive. Blocks the consent form (§2.2) for Ana's own session and both referral scripts in §7.2b.1.
3. **Item 4** — provide a real contact channel. Blocks the `[contacto]` placeholder in the referral script Ana would send.
4. **Item 5** — decide session logistics (location/device/remote). Blocks Ana's session, which could run as soon as tonight.
5. **Item 6** — decide recording method, if any. Same reasoning as item 5 — needed before the *first* session runs, not by Thursday.

**Tomorrow (Wednesday 8/5):**
6. Follow up with Ana on referral responses; schedule anyone who said yes for Wednesday evening or Thursday.
7. **Item 2** — approve Section 6's recruitment copy. Lower urgency than the referral items above, but needed in advance in case item 8 below ends up triggered.
8. **Midday checkpoint (§7.2b.2):** if fewer than 3 people total are confirmed/scheduled (Ana + referrals), decide on **Item 7 (revised below)** — activate 1-2 of §7.3.2's channels as a parallel fallback, understanding it realistically won't produce a Thursday session (§7.2b.4).

**Thursday 8/6:**
9. Run whatever sessions are scheduled — realistically 2-3 in a day with one moderator (§7.2b.2). Let any remainder trail into Friday or early next week rather than compressing the schedule to force a Thursday fit.

### 8.1 Ready to use the moment it's approved (no further Product Owner action needed beyond the approval itself)
- Moderator Master Script (Section 0)
- Briefing script + consent form, correctly ordered (Section 2)
- Observation template, live/expand split (Section 3)
- Post-task interview guide (Section 4)
- Evidence synthesis template, all three journeys' tables built out (Section 5)
- Recruitment copy — community post, direct invite, scheduling confirmation (Section 6) — final wording; still needs the two inputs in 8.2 below before it can actually be sent anywhere
- Referral scripts — Product Owner→Ana ask, and Ana→referral message (Section 7.2b.1) — final wording; same two pending inputs as Section 6
- Candidate-scoring rubric (Section 7.1)
- Verified channel list (Section 7.3.2) — ready the moment the Product Owner decides which, if any, to post into (see 8.2 item 7, revised)

### 8.2 Needs the Product Owner to personally do something, in priority order

1. **Decide the incentive** — what, if anything, is offered for a 45-60 minute session. A Business Decision, referenced as `[incentivo]` throughout Section 6, Section 7.2b.1's referral scripts, and in the Section 2.2 consent form. Nothing in Section 6 or 7.2b.1 can be sent as-is until this is filled in.
2. **Approve Section 6's recruitment copy specifically** — the community post, direct invite, and scheduling confirmation, each as its own sign-off, not one blanket "go ahead" for the whole document. Per the standing Approval gate, this is separate from approving the plan in general.
3. **Contact Ana personally today** to (a) schedule her own session — she's the confirmed top candidate (§7.2), reachable today, and depends on nothing else in this checklist — and (b) make the referral ask (§7.2b.1) for 2-3 other vendors she sells alongside, applying the diversity guidance in §7.2b.3 (different bazar, different tenure, different product category) rather than accepting the first names offered by default. This is the single fastest actionable step available and the one this week's 3-5 target depends on most.
4. **Provide a real contact channel** to put in place of `[contacto]` in Section 6's copy and Section 7.2b.1's referral scripts. Per `marketing-operating-environment.md`, WhatsApp Business is explicitly deferred and no dedicated Nahui number or inbox exists yet — decide what channel (a personal number for now, `hola@nahui.app` once Workspace is provisioned, or something else) will actually receive responses before the community post, DM, or referral message goes out.
5. **Decide session logistics** — in-person location(s) vs. remote video-call platform/link, and whether a device is lent to participants or they use their own phone with the Figma prototype link. Section 0's pre-session checklist and Section 6.3's confirmation message both assume this is already settled.
6. **Decide recording method, if any** (audio/video/screen). The consent form's recording clause (Section 2.2) is conditional on this — leave it inactive if no method is chosen.
7. **Secondary this week, not primary — decide only if triggered (§7.2b.4):** Section 7.3.2 lists 8 real, URL-verified channels (5 Edomex bazaar-organizer Pages/Groups, 3 CDMX-adjacent Instagram/directory accounts). None has been joined, posted to, or contacted — that still requires explicit per-channel Product Owner approval, per the standing Approval gate (joining a Group, posting Section 6.1's community post, or DMing an organizer account are all outreach, not research). Referral through Ana (§7.2b) is the faster path for this specific 2-day window — only decide on activating 1-2 of these channels if Wednesday midday's checkpoint (§7.2b.2, item 8 above) shows fewer than 3 people confirmed from Ana + referrals. If triggered, `@sobreruedas.bazar` is the strongest single candidate to start with (§7.2b.4). Even approved immediately, treat this as feeding Friday/next week's pipeline, not this window's target — it should run in parallel with continued referral push, not replace it.

Everything in 8.1 is genuinely execution-ready today. Everything in 8.2 is a specific, real, human action — not more drafting from Marketing — standing between this package and an actual first session. Section 8.0 above is the concrete day-by-day order to work through it in.
