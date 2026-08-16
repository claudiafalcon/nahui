# Demo Mode — Welcome Screen

**Status: PROPOSED — drafted by `ux-designer` at explicit Product Owner request (2026-08-14), Product Owner-approved in concept and wireframe (2026-08-15).** This document's §1 also serves as this feature's Product Definition, per this folder's own front-matter rule (no separate pre-UX artifact exists). **`brand-guardian` reviewed §3.3's copy (2026-08-15)** — one Major finding (the opening greeting read as generic, translated-from-English template copy rather than Nahui's established voice; `onboarding.md` §3.3 cited as the correct in-family precedent) — fixed, replacement text applied. Not yet passed through `ux-critic`/`reviewer` or a placement ruling.

**Scope:** one expectation-setting screen shown before `authentication.md`'s flow begins, present **only** in validation-campaign builds where a real bazaar-vendor participant tests the live prototype. Not a production feature — has no code path at all in a real, shipped build. Implementation-independent, low-fidelity only.

**Deliberately not conflated with `onboarding.md`'s "Ver un ejemplo."** That is an in-app guided example business a merchant explores from *inside* the real product, reachable via a path choice on `onboarding.md §3.3`. This is a build-level gate shown *before* `authentication.md` even starts, regardless of which of `onboarding.md`'s three paths she later picks — including "Ver un ejemplo" itself. The two compose freely and never overlap. To keep them visibly distinct even in copy, this document uses "demo"/"prototipo," never "ejemplo" — that word stays reserved for `onboarding.md`'s own concept.

**Placement note:** this isn't one of `information-architecture.md`'s four nav labels, so per `product/02-ux/CLAUDE.md`'s own Rule it needs the same kind of lightweight Architect/Main placement ruling `onboarding.md`/`settings.md` got (D13) and `authentication.md` itself just got (D45) — flagged explicitly, not a blocker to the design. Same class as D13/D45 (a genuine gap, but a Merchant-Application-adjacent sequencing/build-variant fact, not a fifth/sixth nav tab), distinguished from D38 (Loyalty-claim, which failed the more basic "is this even part of the app" bar — this screen IS part of the same build artifact, just conditionally shown).

---

## Answers to the three design questions the Product Owner's brief raised

**1. Placement — a standalone document (`demo-mode.md`), not a section amended into `authentication.md`.** `authentication.md`'s own scope statement is written entirely in production terms — acceptance criteria phrased as permanent guarantees. This new screen has a fundamentally different lifecycle: disposable, campaign-scoped, no code path in production at all. Folding it into `authentication.md` would force every future reader to mentally filter "is this bullet real or demo-build-only" through an otherwise clean, already-Approved spec. A standalone file keeps the temporary nature legible at the folder level without polluting `authentication.md`'s dense Approved history.

**2. What happens after "Empezar demo" — clean, simple hand-off, no domain write.** Tapping the CTA hands off directly into `authentication.md §2.1`'s existing resolution logic, cited verbatim — the identical entry point a production build's app-open reaches at this exact moment. This screen writes nothing to the domain model. The one thing it needs to remember — "has this device already seen this" — is a device/build-level implementation detail, the same abstraction-level treatment `authentication.md §0/§10` already gives its own device-session persistence mechanism. Not a domain fact, nothing for `architect` to model. Back-navigation: `authentication.md §3.3` already claims "no back arrow, nowhere to return to" for itself — that claim needs no amendment, since this screen sits chronologically before it and defines no back-affordance pointing here.

**3. Whether this needs a "how is Demo Mode toggled" indication — no, purely from a UX standpoint.** This screen's own content/behavior depends only on: is this a validation-campaign build → show once, first, before `authentication.md`, on this device. The technical mechanism that determines "is this build a Demo Mode build" is below this document's abstraction level (Architecture Review's job, next stage). No in-app "you're in Demo Mode" indicator is designed anywhere else in the product — flagged as a possible future cross-document question (§11), not designed here.

---

## 1. Participant goal

*(This document's audience is a validation-campaign participant, not Ana-as-ongoing-merchant — noted explicitly since it changes the addressee, not the product's values.)*

**Business objective:** make sure a real bazaar-vendor validation participant understands, before typing anything, that (a) this is an interactive prototype, not the finished product; (b) everything she enters — phone number, business name, products, customer info — should be fictitious; (c) no real SMS is sent; (d) the goal is evaluating the experience, not creating a real account; (e) honest feedback, including critical/confused reactions, is explicitly wanted. Directly supports the upcoming real-merchant validation campaign (`company/CLAUDE.md`'s Experience Validation section).

**Acceptance criteria:**
- Every fact above is conveyed in natural Spanish, scannable in well under 15 seconds.
- This screen has no code path in a real production build — not merely hidden, structurally absent (Architecture Review's concern, §8).
- Tapping the primary CTA hands off cleanly into `authentication.md §2.1`'s existing resolution logic, with zero new domain writes.
- The screen never reappears on the same device once acknowledged, for the rest of that install.
- No screen anywhere else in the product shows a "you're in Demo Mode" indicator (explicit non-goal, §11).

**Scope boundary:** validation/testing infrastructure, not a merchant-application capability. Doesn't decide *how* Demo Mode is technically detected (Architecture Review's job) and doesn't touch `authentication.md`'s or `onboarding.md`'s own flow logic — it only prepends one screen ahead of `authentication.md`'s existing entry point, in specific builds.

**Explicit non-goals:**
- Not shown in a real production build, ever.
- Writes nothing to the domain model — no `Business`, `User`, or `Session` field is touched.
- Not the same concept as `onboarding.md`'s "Ver un ejemplo."
- No in-app "Demo Mode" indicator anywhere else in the product.
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
│  •  Usa cualquier número de       │
│     celular — no te va a llegar    │
│     ningún código real.            │
│                                │
│  •  El nombre de tu negocio,       │
│     tus productos y tus clientes   │
│     también pueden ser             │
│     inventados.                    │
│                                │
│  No es la versión final.           │
│  Cuéntanos qué se te hace          │
│  confuso — nos sirve tanto como    │
│  lo que te gusta.                  │
│                                │
│  [       Empezar demo       ]      │
│                                │
└───────────────────────────────┘
```
- **No back arrow** — nowhere to return to, the same "first screen in the product" shape `authentication.md §3.3` already claims for itself, one step further upstream.
- **Deliberately not auto-advanced.** The purpose of this screen is that she actually reads the two operational facts (fictitious data, no real SMS) before typing anything into `authentication.md`'s phone/OTP screens — the identical reasoning `onboarding.md §3.4c` already gives its own no-auto-continue confirmation screen.
- Single primary CTA, no secondary/escape action — nothing to decline here, this is informational, not a consent gate with two real outcomes.
- Copy never says "build," "environment," "QA," "staging," or "feature flag" — only "demo" and "prototipo." *global-principles.md*, "business language before technical language."

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
        in this document shown at all
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
```

---

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Bienvenida a la demo (fresh or resumed — identical)
4. Falla defensiva — no se pudo determinar si ya se mostró

---

## 6. Minimum step count

| Scenario | Taps to handoff | Why it can't be fewer |
|---|---|---|
| First time on this device, Demo Mode build | **1** (Empezar demo) | Auto-advancing would defeat the screen's purpose — same reasoning `onboarding.md §3.4c` gives its own no-auto-continue screen. |
| Already acknowledged on this device | **0** — never shown again | Direct consequence of §2.1 check 2's silent pass-through — "never ask twice," applied even to a non-domain fact. |
| Not a Demo Mode build (production) | **0** — screen doesn't exist | No code path at all in production. |

---

## 7. Automation opportunities

- Whether this is a Demo Mode build — resolved automatically, never a manual toggle she sees.
- Whether this device has already acknowledged the screen — resolved automatically, never re-asked.
- No separate "understood?" checkbox — the single available tap is itself the acknowledgment.

---

## 8. Open questions for Architect / Main

1. **Technical mechanism for detecting a Demo Mode / validation-campaign build** (build flag, environment config, feature flag) — below this document's abstraction level, same treatment `authentication.md §0/§2.3` gives OTP-delivery-channel questions. Architecture Review's job, next stage.
2. **The device-level "already acknowledged" persistence mechanism** — same abstraction-level treatment `authentication.md §10` already gives its own device-session persistence.
3. **Operational, not a UX/domain question:** how a shared test device gets reset between different validation-campaign participants on the same day. Campaign-logistics concern, flagged for whoever plans the campaign, not escalated as a product gap.
4. **Placement ruling recommended, non-blocking:** a short Architect/Main ruling confirming `demo-mode.md` as a standalone, non-nav-tab document in `product/02-ux/`, same class as D13/D45, distinguished from D38.
5. **`brand-guardian` consultation recommended, not yet completed:** this screen speaks to a genuinely new addressee (a validation-campaign participant, not an ongoing merchant) and explicitly invites critical feedback — a touchpoint type this document family hasn't designed for before. The draft copy follows `tone-of-voice.md`'s existing concrete rules directly, but should get the same treatment `authentication.md §3.7c` got: drafted now, reviewed and possibly revised before being treated as final.

---

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — never shown at all in a production build (§2.1 check 1); never shown twice on an unreset device (§2.1 check 2).
- *"Never ask twice"* — applied here even to a non-domain, campaign-only fact.
- *"Technology should disappear"* — identical silent-skeleton/slow-fallback convention as every other tab's own resolving state; no new loading pattern invented.
- *"Business language before technical language"* — "build," "environment," "QA," "staging," "feature flag" never appear in participant-facing copy; only "demo"/"prototipo."
- *"Capture business truth once, reuse it forever"* — extended by analogy to a non-domain fact: acknowledgment is captured once and never re-asked for the rest of that install.

**architecture-principles.md:**
- *#4 (internal-only entities never leak into user-facing language)* — "Demo Mode," "validation campaign," "build variant" stay internal/agent-facing English terms; on-screen copy never uses them.
- *#6 (dependency direction)* — not applicable; this screen reads and writes nothing in the domain model.
- *#7 (idempotent/keyed retries)* — not applicable the way it governs `authentication.md`'s OTP send: no real write here, so the defensive fallback's "Reintentar" simply re-runs a read-only local check with no duplication risk to guard against.

**brand-guide.md / tone-of-voice.md:**
- Tone — "warm, direct, respects the vendor's intelligence" — states plainly what's fictitious and what won't happen (no real SMS) before she types anything, frames critical feedback as equally valuable to praise.
- *tone-of-voice.md, "state facts before offering an opinion"* — the two operational bullets precede the feedback-framing sentence.
- **Flagged, not asserted as settled:** this screen addresses a validation participant, a relationship this document family hasn't spoken to before. Recommending a `brand-guardian` consultation before this copy is final — see §8.5.

---

## 10. Decisions made

- **Named `demo-mode.md`, standalone — not amended into `authentication.md`.** Reasoned in full above. Recommend a lightweight Architect/Main placement ruling before Approved, non-blocking to the design itself.
- **Uses "demo"/"prototipo" in copy, never "ejemplo"** — that word stays reserved for `onboarding.md`'s own, fully independent "Ver un ejemplo" concept.
- **Writes nothing to the domain model.** The one piece of state needed (device acknowledgment) is an implementation detail below this document's abstraction level, same treatment as `authentication.md`'s own device-session persistence.
- **Shown exactly once per device (until reset), never on every app open.**
- **No back arrow, no escape hatch** — nothing to escape from; a one-way, purely informational gate with a single CTA.
- **No in-app "Demo Mode" indicator anywhere else in the product** — explicitly out of scope, flagged for a future document (§11).

---

## 11. Future considerations

- A persistent in-app "estás en modo demo" indicator, if a future campaign runs long/multi-session enough that participants lose track — not evidenced as needed yet, flagged only.
- A demo-mode-specific feedback capture mechanism embedded in the product itself — not requested by the Product Owner's brief; feedback capture is presumably a moderator/facilitator-side concern for this campaign.
- Whether this document is retired/archived once the validation campaign concludes, given its explicitly disposable, campaign-scoped nature — a repository-stewardship question for Main, not a design question.
