# Authentication — UX Specification

**Status:** New — first draft, pending `ux-critic`/`reviewer` review cycle. No prior Medium-Fidelity spec exists for this surface, so per `decision-log.md` D43 this enters the **New-Feature Workflow** (D42's full 7 stages), not the Migration Workflow — this document is that workflow's Product Definition/UX Flow Review stage.

**[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-case-2`]**

**Scope:** the phone+OTP verification gate that precedes everything else in the Merchant Application, including the already-Approved `onboarding.md`. Not a nav tab, not reachable again once a device holds a verified session (same "never shown twice" shape `onboarding.md` §2.1 already gives its own completion state). Implementation-independent — low-fidelity only, no visual design.

**Naming note (deviating from the task's suggested `owner-access.md`, reasoned explicitly):** this document is named `authentication.md`, not `owner-access.md`. The screens it designs — phone entry, OTP entry, resend, error/lockout states — are not Owner-specific; they're the general verification mechanism every future user of this product will eventually pass through, including a Seller accepting a future invitation (`§11`). Owner-provisioning is only *one* outcome of a successful verification (the first-ever-verification branch, `§2.2`), and per the Product Owner's own scope constraint this document shows no Owner-specific UI at all — naming the file after that one outcome would overstate what's actually on screen. This also directly resolves what `onboarding.md` §0 already calls, by name, "Authentication" — treated there as "an implementation-level concern below this spec's abstraction level." Reusing that exact word keeps continuity with the one place the Foundation already gestured at this concern, without editing that document (see `§11`).

**Placement note for Main:** per `product/02-ux/CLAUDE.md`'s own Rule, a document outside the frozen IA's four nav tabs needs an Architect/RFC ruling before it's given a file here — `onboarding.md`/`settings.md` got exactly this via `decision-log.md` D13, `product/02-ux-loyalty/` via D38. This document is the same shape (non-tab, supplementary, precedes the app's first tab). Recommend a short analogous ruling be logged before this is folded into Approved — not a blocker to the design itself.

**Out of scope, by explicit instruction — flagged rather than designed around:**
- **Role-management UI.** No role picker, no "you are the Owner" badge or screen, no membership-management surface. Owner-ness is a structural fact this flow produces, never something Ana chooses or sees named — the Product Owner's own explicit instruction, held to on every screen below.
- **Invitations / SELLER-role onboarding.** A separate, future flow — not designed here. See `§11`.
- **Business onboarding redesign.** `onboarding.md`'s three paths are frozen; this document's terminal state for a first-time verification is the literal `onboarding.md §3.3` (cited, not redescribed).
- **Payments/checkout, bazaar recommendations** — non-goals per `company/CLAUDE.md`, unrelated to this surface anyway.
- **Logout / device / account-session management.** Not designed here. See `§11`.
- **How OTP delivery is technically simulated or implemented** (SMS/WhatsApp gateway, mock delay mechanism, real vs. fake code). Below this spec's abstraction level — the same treatment already given to the device file-picker in `onboarding.md` §2.2b and to "how the platform determines which device/account maps to which Business" in that document's own §0. This document specifies only the merchant-*visible* behavior (`§2.3`).
- **The User/Owner/Seller domain model itself** — not something `ux-designer` invents. Named explicitly as Architect Question Q17 (`§8`), not silently assumed.

## 1. Merchant goal

**Business objective:** answer "whose phone is this" once, honestly and with minimal friction, before any Business exists — the prerequisite gate now sitting in front of `onboarding.md`'s own first-impression moment. Its only job is to get out of the way, silently, for every future app open. This directly implements `company/business-decisions.md` Q14 (Resolved, Product Owner, 2026-08-12: phone + SMS/WhatsApp OTP, chosen explicitly over password/email precisely because "any registration-adjacent step over a few seconds competes with the next customer" — this project's own core thesis, `company/CLAUDE.md`).

**Acceptance criteria:**
- A valid Mexican mobile number reaches a verified state via a one-time code, with no password ever created, remembered, or reset.
- A phone verified for the very first time, anywhere, proceeds directly — no separate "create account" step, no name/photo capture (that's `onboarding.md` §3.9/§3.10's job, not this document's) — into `onboarding.md`'s existing fresh entry point, cited by canonical ID (`onboarding.md §3.3`).
- A device that already holds a verified session never sees this flow again, ever — the same "never ask twice" bar `onboarding.md`'s own D13 completion state already holds itself to.
- No screen, in any state, names "Owner," "Seller," "role," or shows anything resembling a picker between them.

**Scope boundary, stated explicitly per this folder's own §1 rule:** this is an access/identity gate, not a parallel onboarding. It captures exactly one fact — a verified phone number — and nothing else. It does not decide *what* she can do once verified (that's the domain model's job, flagged to Architect, `§8`) and does not decide *how* her business gets set up (that's `onboarding.md`'s job, frozen).

**The tension this design holds, mirroring `onboarding.md` §1's own framing:**
- Nothing here is time-critical the way Home's <3s bar is (`company/backlog.md` #1) — no customer is standing in front of her at this moment.
- But unlike `onboarding.md`, which is genuinely "once ever," this gate is the very *first* screen she can ever reach in the whole product — before she's even seen `onboarding.md §3.3`'s own warm welcome copy. A verification step that feels bureaucratic or intimidating here risks losing her before Nahui has said a single word to her. The standard: the minimum honest friction a real verification mechanism ever requires, then silence, permanently, on that device.

## 2. Resolution / decision logic

### 2.1 Whether Authentication shows at all (device-level check)

Evaluated automatically, before anything else, on every app open:

```
1. Does this device already hold a valid verified-phone session? (The
   storage/validity mechanism itself is left as an implementation detail —
   same posture `onboarding.md` §0 already gives "how the platform
   determines which device/account maps to which Business.")
     → YES: Authentication is never shown — not even a flash of a phone/
       OTP screen. Control passes directly and silently to `onboarding.md`'s
       own resolution logic (`onboarding.md §2.1`), unchanged. Whether a
       complete Business exists, an incomplete one, or none yet is entirely
       that document's own question to resolve from here — this document
       has nothing further to say once a session is confirmed valid.

2. Was a phone number typed, or a code sent, but never confirmed, before
   the app was closed, backgrounded, or killed?
     → YES: resume at the exact step, nothing re-typed (§3.8) — same
       discipline `onboarding.md §3.7` already applies to its own
       in-progress work.

3. Neither (true first open, or a device with no persisted session at
   all)?
     → Show §3.3, fresh — Número celular.

4. The check itself fails outright (can't determine session state)?
     → Fallback (§3.9), Reintentar.
```

### 2.2 What happens once a code is confirmed — the three-way branch

This is the part `onboarding.md`'s own §0 explicitly left unmodeled, and the reason this document exists:

```
1. This phone has never been verified before, anywhere?
     → First-verification branch. The moment `onboarding.md §3.5`'s own
       Business-creation write next succeeds (unchanged, that document's
       own mechanism, not redesigned here), Owner-ness is produced as a
       pure structural consequence of that write being the one write path
       capable of creating a Business at all, gated only on the acting
       User being verified (`decision-log.md` D44) — never asked, never
       shown, never named on any screen this document or `onboarding.md`
       define.
       This document's own job stops the instant verification succeeds: it
       hands off directly to `onboarding.md §3.3` (Bienvenida + Elegir cómo
       empezar), cited verbatim — the identical fresh entry point a true
       first launch already reaches there. No interstitial "¡verificado!"
       screen (§10).

2. This phone was already verified on THIS device, with a Business
   already local to it (complete or in-progress)?
     → **[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-case-2`]**
       Reachable. Hands off to `onboarding.md`'s own resolution logic
       (`onboarding.md §2.1`), unchanged — the identical silent
       pass-through case 1 above already describes for an unbroken
       session, reached this time via a fresh OTP confirmation instead of
       a persisted flag. A complete local Business resolves straight
       through to Home (`home.md §2`); one still in-progress resumes
       exactly where Onboarding left off (`onboarding.md §2.1` cases
       2–4). See `settings.md §2.5a` for the full reasoning.

3. This phone verifies successfully on a device holding no local session,
   and it's already associated with an existing, already-onboarded
   Business elsewhere (a new device, a reinstalled app, or any case where
   verification succeeds but no local Business record exists to match
   it)?
     → Not yet resolved. See §8 — this branch's real destination depends
       on a genuine, unresolved question (does a Business belong to a
       device or to a verified identity) that isn't this document's to
       invent. Flagged, not designed around, per this folder's own §4
       rule for exactly this situation.
```

### 2.3 Merchant-visible behavior around simulated OTP delivery

This document doesn't specify how a code is technically generated or delivered (§0). What it does specify: the copy on §3.6 states plainly that a code was sent to her number, without naming a delivery channel ("Te mandamos un código a tu número," never "por SMS" or "por WhatsApp") — deliberate, since `business-decisions.md` Q14 resolved *that* an OTP mechanism is used, not *which* channel(s) ship, and naming a specific channel here would be a technical commitment this Low-Fidelity document has no basis to make. It also never implies a delivery-time guarantee a mock environment can't honor ("revisa en un segundo," "ya casi llega") — the resend cooldown (§3.6) is the only timing promise this document makes, and it's a promise about *when she may ask again*, not about when delivery actually happens.

## 3. Low-fidelity wireframes

Conventions inherited from the rest of this family: `[ ]` = tappable, plain text = passive/informational. No persistent bottom nav bar on any screen in this section — same reasoning `onboarding.md`'s own §3 preamble gives, even more so: not even a Business exists yet at this point.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
└───────────────────────────────┘
```
Identical silent-skeleton convention to every other tab's own §3.1. *global-principles.md*, "technology should disappear."

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
└───────────────────────────────┘
```

### 3.3 Número celular — entry
```
┌───────────────────────────────┐
│                                │
│           Nahui                 │
│                                │
│  Para empezar, dinos tu          │
│  número celular.                  │
│                                │
│ Número celular                   │
│  +52  [ __________ ]             │
│                                │
│  [      Enviar código      ]     │  disabled until 10 digits
│                                │
└───────────────────────────────┘
```
- No back arrow — the one screen in the whole product with nowhere to return to, even more literally than `onboarding.md §3.3`'s own equivalent claim.
- "+52" shown as fixed context, never typed — she gives her number the way she already gives it out to anyone; *global-principles.md*, "business language before technical language."
- "Enviar código" disabled until exactly 10 numeric digits are entered — the same required-no-default, disabled-until-valid convention every other required field in this family uses (`onboarding.md §3.5b`'s Producto+Precio gate, `§3.9`'s Nombre gate). **Deliberately not auto-submitted** the instant the 10th digit lands — sending a code is a real action with a real consequence (a message actually goes out), the identical reasoning `onboarding.md §6` already gives for keeping "Confirmar y activar" an explicit tap even though nothing is typed there: "the extra tap protects a real commitment from a stray tap."

### 3.4 Número celular — formato inválido (inline)
Reached only if a paste or similar produces a superficially-complete value containing non-numeric characters — not reachable through ordinary typing, since the button stays disabled until the field is exactly 10 digits.
```
Número celular
 +52  [ 55abc12345       ]
 Verifica tu número — solo dígitos, a 10 números.
[      Enviar código      ]   (disabled)
```
Non-blocking, corrects in place — nothing was ever submitted, so nothing "failed" from her side.

### 3.5 Enviando código — near-instant / slow
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │      Un momento…                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
The one write-like action in this half of the flow: requests a code be generated and delivered. Same near-instant/slow convention as every other write action in this family. Carries the same stable idempotency-key guarantee every retryable write in this project carries (`architecture-principles.md` #7, `decision-log.md` D30) — a retried send attempt must never risk sending (or being billed for) two codes for one tap.

### 3.5a Enviando código — error
```
┌───────────────────────────────┐
│  No pudimos enviar tu código.    │
│  Intenta de nuevo.                │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Su typed number isn't lost — same guarantee every retry state in this family already gives.

### 3.6 Ingresa el código — entry (code sent)
```
┌───────────────────────────────┐
│ ← Cambiar número                 │
│                                │
│  Ingresa el código                │
│  Te mandamos un código a         │
│  +52 55 1234 5678.               │
│                                │
│ Código                          │
│  [ ______ ]                      │
│                                │
│  [       Confirmar       ]       │  disabled until 6 digits
│                                │
│  ¿No te llegó? Reenviar en 0:30   │  countdown, plain text, not tappable
│                                │
└───────────────────────────────┘
```
- **"← Cambiar número"** — a real, always-available escape hatch, returns to §3.3 with her number pre-filled, never a dead end (`global-principles.md`). Same posture `onboarding.md §3.4`'s "Mejor quiero empezar gratis" already establishes.
- **Assumed: 6-digit code.** Stated plainly as a judgment call, not derived from anywhere in the Foundation (there is none to derive it from).
- **Assumed: 30-second resend cooldown.** Also a plain judgment call — long enough to discourage abuse of the send mechanism, short enough that it never reads as a punitive wait for a merchant who genuinely didn't receive anything.
- Countdown is plain text, not bracketed, per the `[ ]`-vs-plain-text convention already established throughout this family (tappable = brackets).

### 3.6a Ingresa el código — reenvío disponible
Same screen as §3.6, once the cooldown elapses — not a distinct destination, the identical relationship `onboarding.md §3.9/§3.9a` already have to each other.
```
  ¿No te llegó?  [ Reenviar código ]
```
Tapping it replays §3.5's send action (same idempotency guarantee), returns to §3.6 with the cooldown restarted, and shows a brief, self-dismissing ambient confirmation — "Código reenviado" — reusing the identical ambient-confirmation pattern `home.md §3.8e` already established for "Venta finalizada ✓," rather than inventing a new one.

### 3.6b Código — formato inválido (inline)
Reached whenever a paste or similar places non-numeric characters into the Código field — most plausibly, per this flow's own channel (§2.3), pasting the entire delivered message ("Tu código de Nahui es: 123456") rather than just the code itself. Not reachable through ordinary typing, since "Confirmar" stays disabled until the field holds exactly 6 digits — the identical shape §3.4 already handles for the phone field.
```
Código
 [ Tu código de Nahui es... ]
 Verifica tu código — solo dígitos, a 6 números.
[       Confirmar       ]   (disabled)
```
Non-blocking, corrects in place — nothing was ever submitted, so nothing "failed" from her side. Same treatment as §3.4's equivalent state for the phone field.

### 3.7 Verificando código — near-instant / slow
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │      Confirmando…               │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
The one write-like action that actually resolves whether the code was right, expired, or exhausted — triggered by "Confirmar." Carries the identical idempotency-key guarantee §3.5 does (`architecture-principles.md` #7, D30) — this is the single action in this whole document with a genuine downstream consequence for a first-time phone (it's what makes proceeding into `onboarding.md §3.3` possible), so a retried confirm attempt must never risk a duplicated or ambiguous outcome.

Resolves into exactly one of §3.7a–§3.7d below, or — on success — the handoff branch (§2.2/§4). Never a fifth, undefined outcome.

### 3.7a Verificando código — código incorrecto
Same screen as §3.6/§3.6a, re-rendered with the code field cleared (nothing worth preserving in a wrong guess) and an inline message:
```
Código
 [ ______ ]
 Ese código no es correcto. Intenta de nuevo.
[       Confirmar       ]   (disabled until 6 digits again)
```
No attempt counter shown anywhere on screen — deliberately. Surfacing a raw "3 de 5 intentos" style count would read as pressure this moment doesn't need; the fact only becomes relevant, and is stated plainly, once the limit is actually reached (§3.7c). *brand/tone-of-voice.md*, "state facts before offering an opinion" — extended here to mean stating the *relevant* fact at the moment it's true, not manufacturing anxiety ahead of it.

### 3.7b Verificando código — código expirado
```
Código
 [ ______ ]
 Este código ya venció.
[   Reenviar código   ]
```
**Assumed: 5-minute code validity window**, another plain judgment call. "Confirmar" is replaced entirely by "Reenviar código" — there's nothing left worth letting her retry against. Resend here is available immediately, regardless of §3.6's own cooldown state — a deliberate exception: the code is already dead through no further fault of hers, so forcing an additional wait on top of that would be pure friction with no anti-abuse purpose left to serve.

### 3.7c Verificando código — demasiados intentos
Reached after **5 incorrect attempts on the same code**, stated explicitly as the chosen bound — a plain judgment call, not derived from the Foundation.
```
┌───────────────────────────────┐
│ ← Cambiar número                 │
│                                │
│  Ingresa el código                │
│                                │
│  Después de varios intentos,      │
│  este código ya no es válido.     │
│  Pide uno nuevo y con gusto        │
│  lo confirmamos.                  │
│                                │
│  [   Reenviar código   ]         │
│                                │
└───────────────────────────────┘
```
**Deliberadamente a soft, code-level invalidation — never a hard account or device lockout.** Resend is available immediately, no waiting period beyond it. This is a real, considered design choice, not an oversight: a full lockout after a handful of wrong guesses would be the kind of "bureaucratic, intimidating" moment `brand/brand-guide.md`'s tone explicitly warns against, at the exact first moment she's forming an impression of the product. The copy states what happened plainly, offers the fix in the same breath, and never frames the situation as something she did wrong (`brand/tone-of-voice.md`, "never imply a merchant needed rescuing," extended here to "never imply she needs correcting").

**Copy revised per `brand-guardian` consultation (2026-08-13).** The original draft — "Ya intentaste varias veces con este código, así que dejó de ser válido" — made *her* the grammatical subject of the failure clause and used a causal "así que," reading as a tally of her attempts being reported back to her rather than a system-state fact, breaking from this document family's own established pattern (`tone-of-voice.md`'s "no pudimos guardar" precedent, where the system, not the merchant, is always the subject of what-went-wrong). Revised to make "este código" the subject instead, dropping the causal "así que" — same information (she still learns why, per `character-bible.md`'s "tells the truth about what it does and doesn't know yet"), same soft-invalidation behavior, same two-beat fact-then-path-forward shape as every other error state in this family. `brand-guardian` also flagged this register as `tone-of-voice.md`-Hypothesis-tagged, not yet validated against a real merchant reaction — worth a real check once this ships, not a blocker now.

### 3.7d Verificando código — error de plataforma
Distinct from a wrong code — this is a genuine send/confirm failure (network drop, platform error) where the code's correctness was never actually determined.
```
┌───────────────────────────────┐
│  No pudimos confirmar tu código. │
│  Sigue aquí, intenta de nuevo.    │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Her typed code isn't lost. Retrying replays the same confirm attempt under the same idempotency key (§3.7's own guarantee) — critical here specifically, since this is the one ambiguous-outcome case `architecture-principles.md` #7 exists for: if the original attempt actually succeeded server-side and only the confirmation was lost, a blind retry must never risk a second, duplicate provisioning consequence for a first-time phone.

### 3.8 Retomar autenticación interrumpida
No new wireframe — reaching any screen in §3.3–§3.7d a second time (after the app was closed, backgrounded, or crashed mid-flow) renders it pixel-identical, with whatever she'd already typed (her phone number, a partially-typed code) still present. The one exception to "pixel-identical": §3.6's resend countdown is recomputed from real elapsed time on resume, not frozen at its pre-interruption value or reset to a fresh 0:30 — the number changes, nothing else about the screen does. Same guarantee `onboarding.md §3.7`/`home.md §3.13`/`inventory.md §3.7` already make for their own in-progress work. *global-principles.md*, "never ask twice." Never restarts from §3.3 once she's made real progress past it.

### 3.9 Falla defensiva — no se pudo determinar el estado inicial
```
┌───────────────────────────────┐
│  No pudimos cargar Nahui.        │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Covers §2.1's own device-session check failing outright. Manual "Reintentar," same convention as `onboarding.md §3.8`/`inventory.md §3.18`/`events.md §3.18`/`reports.md §3.14` — no live-customer risk at this moment to justify a heavier auto-retry mechanism.

## 4. Interaction flow (summary)

```
Open app (any time)
  → resolve device session (§2.1, automatic)
      → valid session exists ─────────────────────────────────────────→
        onboarding.md's own resolution (onboarding.md §2.1), silently —
        no screen in this document shown at all
      → in-progress (phone typed, or code sent, not yet confirmed),
        interrupted ────────────────────────────────────────────────→
        resume exact step (§3.8) — countdown recomputed from real
        elapsed time, not frozen or reset
      → fresh, no session ────────────────────────────────────────────→
        Número celular (§3.3)
      → resolution itself fails ──────────────────────────────────────→
        fallback (§3.9), Reintentar

From §3.3, type a number:

  A paste (or similar) produces a superficially-complete, non-numeric
  value ───────────────────────────────────────────────────────────→
    formato inválido (§3.4), corrects in place, back to §3.3

  A valid 10-digit number, Enviar código
    → enviando (§3.5) → error (§3.5a) → Reintentar
    → success → Ingresa el código (§3.6/§3.6a)
        → A paste (or similar) places non-numeric characters into the
          code field ────────────────────────────────────────────────→
          formato inválido (§3.6b), corrects in place, back to §3.6
        → (§3.6a only) Reenviar código ─────────────────────────────→
          replays §3.5's send (same idempotency guarantee), returns to
          §3.6 with cooldown restarted, ambient "Código reenviado"
          confirmation
        → Confirmar → verificando (§3.7)
            → código incorrecto (§3.7a) → back to §3.6/§3.6a, retype
            → código expirado (§3.7b) → Reenviar código → back to §3.5
            → demasiados intentos (§3.7c) → Reenviar código → back to §3.5
            → error de plataforma (§3.7d) → Reintentar → §3.7 again
            → success, first-ever verification for this phone ─────────→
              onboarding.md §3.3 (Bienvenida + Elegir cómo empezar),
              cited verbatim — Owner-ness produced structurally the
              moment onboarding.md §3.5's own Business-creation write
              next succeeds (§2.2, not designed here)
            → success, already-verified-on-this-device, Business local
              and intact [Amended 2026-08-13 — see
              authentication.changelog.md#2026-08-13-case-2] (reached
              via: account sign-out, `settings.md §2.5`, then
              re-verification) ──────→ `onboarding.md §2.1`'s own
              resolution — complete Business to Home (`home.md §2`),
              in-progress Business resumes exactly where left off
              (`onboarding.md §2.1` cases 2–4)
            → success, phone already tied to an existing,
              already-onboarded Business, no local session on this
              device ──────────────────────────────────────────────→
              NOT YET RESOLVED — see §8, Product Decision Q18
        → ← Cambiar número → back to §3.3, number preserved

Any interruption up to and including a still-unconfirmed code:
  → next app open resumes exactly where she left (§3.8) — never restarts
    from §3.3 once real progress has been made.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Número celular — entry
4. Número celular — formato inválido
5. Enviando código (near-instant / slow)
6. Enviando código — error
7. Ingresa el código — entry (cooldown active)
8. Ingresa el código — reenvío disponible (cooldown elapsed)
9. Código — formato inválido (inline)
10. Verificando código (near-instant / slow)
11. Verificando código — código incorrecto
12. Verificando código — código expirado
13. Verificando código — demasiados intentos
14. Verificando código — error de plataforma
15. Retomar autenticación interrumpida (resumes any of states 3–14, pixel-identical — except §3.6's resend countdown, recomputed from real elapsed time — in-progress data intact)
16. Falla defensiva — no se pudo determinar el estado inicial

## 6. Minimum step count

| Scenario | Taps to handoff | Why it can't be fewer |
|---|---|---|
| First-time verification (or any fresh verification on a session-less device) | **4** (typed phone + Enviar código + typed code + Confirmar) | Both fields are genuinely required, unique-per-person facts with no honest default — a phone number and a one-time code are the entire minimum a verification mechanism can ask for. Neither "Enviar código" nor "Confirmar" is auto-fired on field completion — both actions have a real, non-trivial consequence (a message sent; an identity confirmed), the same reasoning `onboarding.md §6` already gives its own "Confirmar y activar." |
| Already-verified device | **0** — never shown | Direct consequence of §2.1's silent pass-through. |
| Resuming an interrupted verification | **0 extra** | Same guarantee `onboarding.md §3.7` already gives its own in-progress work. |
| Recovering from a wrong/expired/exhausted code | **+1 per occurrence** (retype code, or tap Reenviar código) | Not part of the floor — only reached when something genuinely went wrong; never a designed-in tax on the happy path. |

## 7. Automation opportunities

- Whether a device already holds a valid session — resolved silently on every app open (§2.1); never a manual "log in again" she has to trigger.
- "+52" is automatic context, never typed.
- Whether a given confirmed code represents a first-ever or a returning verification is resolved automatically, never asked to her as a separate question ("¿ya tienes cuenta?" never appears anywhere).
- The resend cooldown counts down automatically; she never tracks elapsed time herself.
- Owner-ness — fully automatic, a pure structural consequence of the atomic Business-creation write (`decision-log.md` D44), never a question, never a picker, per the Product Owner's explicit scope constraint.
- Whether a client also auto-fires "Confirmar" the instant a 6th digit lands (without changing the underlying required, gated action itself) is a High-Fidelity/implementation nicety, deliberately left undecided here — below this document's abstraction level, the same way exact digit-grouping in the phone field is.

## 8. Open questions

None of the items below block this document's own completion. Both are named explicitly rather than invented around, per this folder's own §4 rule that every branch resolves to a named destination or an explicit "Not yet resolved" marker.

1. **Architect Question Q17 (`product/02-ux/architect-questions.md`) — Resolved.** Was: the User/Owner/Seller domain model this document's flow needs to actually be implementable. `domain-model.md` previously had no User/Account aggregate, no Role concept, no Business↔User relationship — Business was modeled as belonging to "an install" (`onboarding.md §2.1`'s own language), not to an authenticated identity — the concrete follow-up `company/business-decisions.md` Q14 already named as owed. **Resolved** via `product/99-rfc/0007-user-and-business-membership.md`, Accepted and promoted in full via `decision-log.md` D44 — `User` (global aggregate root, identified by `phone`) and `BusinessMembership` (`role: OWNER | SELLER`) are now part of `domain-model.md`/`ubiquitous-language.md`, with Business creation carrying the structural Owner-Membership invariant this document's §2.2 first-verification branch already assumed. No amendment to this document's own flow logic (§2.2/§4) was needed — it already describes exactly the behavior D44 makes implementable.
2. **Product Decision (proposed Q18, `product/02-ux/product-decisions.md`) — §2.2 case 3 (a verified phone, on a session-less device, already tied to an existing already-onboarded Business).** Genuinely undecided: whether a Business belongs to a device or an identity, and whether this mock/local-data prototype can even represent "same Business, second device" today.
3. **Provisional prototype defaults, not frozen domain invariants (Product Owner clarification, 2026-08-13):** the specific numbers chosen here by judgment call — 6-digit code, 30-second resend cooldown, 5-minute code validity, 5-attempt soft-invalidation bound — are product/prototype defaults, not settled Foundation rules. They should be revisited when a real authentication provider is integrated (Stage 7, Backend Integration) — a real SMS/OTP vendor may impose its own constraints (code length, delivery/expiry timing, rate limits) that supersede these values outright, and even absent that, they should be checked against a real or simulated first-run test before being treated as final, same evidence-driven caution `onboarding.md §8` items 1/5/6 already recommend for its own judgment calls. Nothing in this document's flow logic (§2, §4) depends on the exact values — only on their existence and the branches they gate.
4. **[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-open-q4`]** Resolved. `settings.md §2.5` activates §2.2 case 2.
5. **`brand-guardian` consultation complete (2026-08-13)** — §3.7c's "too many attempts" copy revised per that consultation's finding (subject/causal-structure fix, same soft-invalidation design); flagged as `tone-of-voice.md`-Hypothesis-tagged, worth a real merchant-reaction check once shipped, not blocking now.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — a verified device is never asked again (§2.1); no separate "create account" step exists between OTP success and `onboarding.md §3.3` (§2.2, §10).
- *"Never ask twice"* — resuming an interrupted verification never re-asks anything already typed (§3.8); whether a phone is first-time or returning is resolved automatically, never asked as a raw question (§7).
- *"Technology should disappear"* — no nav bar exists before there's anything to navigate into; loading states stay silent unless genuinely slow, identical convention to every other tab.
- *"Business language before technical language"* — "Número celular," "código," never "OTP," "sesión," "token," or "autenticación" anywhere in merchant-facing copy.
- *"Capture business truth once, reuse it forever"* — a verified phone is captured exactly once per device and never re-collected on retry (§3.5a, §3.7d's idempotent-retry guarantees).

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — extended here to identity itself: verification is resolved once, before any Business, Session, or Sale exists, never re-asked mid-flow.
- *#4 (internal-only entities never leak into user-facing language)* — no domain term ("User," "Owner," "Seller," "Role," "Session" in the authentication sense) ever appears in merchant-facing copy.
- *#7 (idempotent/keyed retries)* — both write-like actions in this document (§3.5 send, §3.7 confirm) carry the same stable idempotency-key guarantee every other retryable write in this project carries, named explicitly for §3.7 given its genuine first-time-provisioning consequence.

**brand-guide.md / tone-of-voice.md:**
- *Tone — "warm, direct, respects the vendor's intelligence... never intimidating"* — §3.7c's soft, code-level invalidation (never a hard account lockout) is the concrete application of this principle to a genuinely new situation this document introduces; flagged for a `brand-guardian` consultation rather than asserted as settled (§3.7c, §8).
- *tone-of-voice.md, "state facts before offering an opinion"* — every error/limit state states what happened before what to do next, no apology-first structure.

## 10. Decisions made

- **Named `authentication.md`, not `owner-access.md`** — the screens designed here aren't Owner-specific; naming the file after one outcome of a successful verification would overstate what's on screen. Reasoned in full at the top of this document.
- **No interstitial "¡verificado!" screen between OTP success and `onboarding.md §3.3`.** A first-time verification hands off silently and immediately — adding a ceremony screen here would pad a moment `onboarding.md §3.3`'s own warm welcome copy already covers, the same restraint `onboarding.md §10` already applied when it merged its own Bienvenida and path-choice screens into one.
- **Device-level session persistence assumed** — verified once per device, never re-asked on subsequent opens. The storage mechanism itself is left below this document's abstraction level, the same treatment `onboarding.md §0` already gives comparable platform questions.
- **+52-prefixed, 10-digit Mexican mobile number; 6-digit code; 30-second resend cooldown; 5-minute code validity; 5-attempt soft-invalidation bound** — five explicit judgment calls, none derived from the Foundation, all named plainly rather than silently assumed (§3.3, §3.6, §3.7b, §3.7c).
- **§3.7c's "too many attempts" state is a soft, code-level invalidation, never a hard account/device lockout** — reasoned explicitly against `brand/brand-guide.md`'s tone, not defaulted to a generic security pattern. Copy itself revised per a completed `brand-guardian` consultation — see §3.7c, §8.
- **§2.2 case 3 (returning phone, new device, already-onboarded Business) is explicitly marked "Not yet resolved"** rather than invented — routed to a new Product Decision (Q18) and a new Architect Question (Q17).
- **[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-decisions-10`]** Logout / account-session-management UI — resolved. `settings.md §2.5` ("Cerrar sesión") now designs exactly this, activating §2.2 case 2 above for the first time.

## 11. Future considerations

- **Invitation flow / SELLER-role onboarding** — explicitly out of scope for this document, per the Product Owner's own instruction. Will very likely reuse this document's phone+OTP mechanism as its underlying verification step, but the invitation-acceptance screens themselves, and how a Seller's Role gets attached to an existing Business, are not designed here.
- **[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-future-11`]** Self-service logout / account-level session management — resolved. `settings.md §2.5` ("Cerrar sesión") now designs exactly this.
- **Multi-Business-per-phone** — not addressed. If an Owner ever runs two separate stalls under one phone number, that's a real future question, not evidenced today.
- **`onboarding.md §0`'s own "Authentication... implementation-level concern below this spec's abstraction level" framing is now stale** now that this document exists as a real spec for exactly that concern. Flagged for whoever next amends `onboarding.md` — not resolved here, since `onboarding.md` is treated as frozen for this task.
- **A persistent, read-only display of her own verified phone number somewhere in `settings.md`** — not designed here. **First real evidence, 2026-08-13:** a `merchant-user-tester` walk of `settings.md`'s new "Tu cuenta" section (`experience-review-2026-08-13-configuracion.md`) read the section as "an unfinished corner" for showing nothing but a sign-out button, with no way to confirm which number the device is verified under outside the OTP screen itself. Still not designed here — logged as a real, if mild, want rather than the prior "no evidence yet," for whoever next scopes a `settings.md` amendment.
