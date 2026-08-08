# Onboarding — UX Specification

Status: Approved. Full UX Remediation cycle complete — `ux-critic`'s first-draft review found one Blocker (ONB-B1: the demo path's framing implied a reversible preview when the write is actually permanent and non-convertible) and one Major (ONB-M1: the milestone screen was silently excluded from the interruption-resume contract), both fixed by `ux-designer` and verified clean, plus three Minor findings also addressed. `reviewer`'s Foundation-consistency pass found no Blockers; three Important findings (an overbroad "never writes into Selling" claim, an unstated seed-content minimum for the demo path's own stated purpose, and a stale `events.md` §3.8 cross-reference — the last one a pre-existing drift also present in `home.md`, fixed in both) — all corrected directly by Main. See `product/02-ux/ux-critic-findings.md` for the full record.
Scope: the first-run flow that precedes all four top-level nav items (`Hoy`, `Inventario`, `Eventos`, `Resultados`) per `product/00-foundation/information-architecture.md`'s "Onboarding and Settings" section and `decision-log.md` D13. Not a nav tab, not reachable again once complete. Implementation-independent — low-fidelity only, no visual design.
**Amended for `decision-log.md` D27** (NFC capability corrected to derive from `subscriptionTier`, not kit/code activation): the "Activar kit NFC" path — its entire activation-code entry/validating/invalid-code mechanism (former §3.4/§3.4a/§3.4b) — is retired. Replaced by "Activar plan de pago," a bare payment-confirmation path (no code, no kit dependency) that grants `subscriptionTier=paid` (and therefore `nfc` capability, derived per D27). `defaultSellingMode` is now written as `buttons` unconditionally for both real paths, never inferred from path choice — a reversal of this document's earlier §2.3 resolution. Went through a coordinated three-document cycle (with `home.md`/`settings.md`) — `ux-critic` found one Blocker (§3.6 Variant B's milestone copy falsely implying automatic tag-selling once tagged) plus two Major and three Minor findings, all fixed and verified. `reviewer`'s Foundation-consistency pass found zero Blockers, one Important finding (stale "two real paths" language in §9/§10 contradicting this document's own §2.2, which correctly states three paths and a genuine two-way `subscriptionTier` choice) — fixed directly by Main. Folded back into Approved.

Resolves, within this document's own design scope per D19: the exact number of Onboarding paths, their precise copy, and the flow's exact screen sequence — none of that was decided upstream; it's the actual design task here.

**Out of scope, by explicit instruction — flagged rather than designed around:**
- **Settings / capability change after first run.** Whether a Business that chose "Empezar gratis" can later upgrade to the paid plan and its `nfc` capability, or change any other capability, is designed entirely in `settings.md` (Approved) — `company/business-decisions.md` Q5, once open and blocking that document, resolved via `decision-log.md` D25. This is very likely the *most common* real-world path (start free, subscribe later) — it is still not designed *here*, deliberately: Onboarding's job stops at initial values (§1); post-onboarding capability change is `settings.md`'s own, separate scope.
- **Payments/checkout.** "Activar plan de pago" confirms an already-arranged payment (`decision-log.md` D19, D27) — zero in-app payment processing (`company/CLAUDE.md` non-goals). No purchase flow, no price, no card field anywhere in this document.
- **Bazaar recommendations** (`company/backlog.md` #3) — not part of any path's content.
- **Authentication / account provisioning.** How the platform determines which device/account maps to which Business (login, phone verification, etc.) is not modeled anywhere in the frozen `domain-model.md` and is treated the same way every other `02-ux` document treats it: an implementation-level concern below this spec's abstraction level. This document assumes only that, by the time §2's resolution logic runs, the platform can answer "does a Business already exist for this install, and has it completed Onboarding?" — it does not design how that lookup itself is authenticated.
- **A demo-to-real conversion mechanic.** Per `decision-log.md` D19's own stated contingency, a demo Business is an ordinary Business with seeded data, "no conversion migration" — not designed here. See §11.

## 1. Merchant goal

Every other document in this family describes a recurring merchant context — Ana opens Home a dozen times a day, Inventario every few days, Eventos before a bazaar, Resultados after one. Onboarding is different in kind: it happens **exactly once**, ever, in her entire relationship with the app, before she has any reason yet to trust it.

Two things are true at once here, and the design has to hold both:

- **Nothing is time-critical the way Home's <3s bar is** (`company/backlog.md` #1) — there's no customer standing in front of her while she sets this up. The pressure that matters here isn't speed under live customer flow; it's the much more fragile risk of a **first impression that reads as intimidating, bureaucratic, or condescending about how she already runs her business** — exactly what `company/brand/brand-guide.md`'s tone explicitly warns against. Lose her here and there's no second Session to design for.
- **The functional job is narrow and mechanical**: establish a Business and its initial capabilities — Selling Mode Capability (`registrationMode`), Default Selling Mode (`defaultSellingMode`), `subscriptionTier` — before Home's resolution logic (`home.md` §2) has anything at all to resolve into (`decision-log.md` D13). Nothing else. No profile fields, no business name, no legal terms screen invented here — the Domain Model doesn't call for them, and inventing them would be scope creep this document isn't asked to carry.

The tension resolves the same way `inventory.md` §1 resolves its own non-urgent context: the absence of a hard speed number doesn't mean padding is acceptable. It means the standard here is "don't waste a single one of her taps" — with one deliberate exception, spelled out in §3.4c/§6, where a fact worth an extra tap outweighs that default.

## 2. Resolution / decision logic

### 2.1 Whether Onboarding shows at all

Evaluated automatically, on every app open, before anything else:

```
1. Does a Business already exist for this install, with Onboarding fully
   complete — meaning both (a) a path has resolved into stored capabilities
   (§3.5's write succeeded) AND (b) the "Todo listo" milestone (§3.6) has
   actually been dismissed, whether by her own tap or by its auto-continue?
     → YES: Onboarding is never shown. Control passes directly and silently
       to Home's own resolution logic (home.md §2) — not even a flash of
       any Onboarding screen. This is the literal meaning of decision-log.md
       D13's "never revisited once complete."

2. Does a Business exist with capabilities already written (§3.5 succeeded),
   but §3.6 was still on screen when the app was last closed, backgrounded,
   or killed — before she tapped or auto-continued past it?
     → YES: resume directly at §3.6, showing the same variant her stored
       path already determines. Never re-run §3.5's write (capabilities,
       and for the demo path the seed data, already exist and are left
       untouched). Never restart from §3.3. This is the one deliberate
       narrowing of D13's "complete," scoped only to this resume check:
       capabilities being written is necessary but not sufficient to stop
       showing Onboarding screens — she still gets to see her own milestone
       once, even if a phone call or an OS kill interrupted her on the way
       out of it. Full guarantee in §3.7.

3. Does a Business exist, but Onboarding was left incomplete before §3.5's
   write ever succeeded (interrupted mid-flow — a path chosen but not yet
   resolved, e.g. she closed the app before tapping "Confirmar y activar" on
   the Activar plan de pago screen, §3.4 — there's no typed data to preserve
   there, just a bare confirm tap not yet taken — or while the demo path's
   confirmation screen, §3.4c, was on screen before she chose either
   option)?
     → YES: resume at the exact step she left, never restart from the
       welcome screen (§3.7). Same discipline home.md §3.13 and
       inventory.md §3.7 already apply to their own in-progress work.

4. Neither exists yet (true first launch)?
     → Show §3.3 (Bienvenida + Elegir cómo empezar), fresh.
```

### 2.2 What each path resolves, concretely

This is the part D19 explicitly left to this document: exact paths, and exactly what each one sets.

| Path | `registrationMode` (Selling Mode Capability) | `defaultSellingMode` | `subscriptionTier` | `loyaltyEnabled` |
|---|---|---|---|---|
| **Empezar gratis** | `{buttons}` | `buttons` (only value in the set) | `free` | `false` |
| **Activar plan de pago** | `{buttons, nfc}` — `nfc` follows automatically from `subscriptionTier=paid`, never set independently (`decision-log.md` D27) | `buttons` — always, for either real path (see §2.3) | `paid` | `false` |
| **Ver un ejemplo** (demo) | `{buttons, nfc}` | `nfc` | `paid` | `true` |

`eventScheduling` is "always on" regardless of path (`domain-model.md` Business Capabilities table) — never presented as a choice on any screen, for any path.

**Why `subscriptionTier` is now a genuine, honest two-way choice at Onboarding — a correction from this document's earlier reasoning:** An earlier version argued no honest paid option could ever be offered at first run, because Segmentation's value requires sales history that can't exist yet. That's still true of Segmentation specifically — nothing here promises it on Day 1, for either path (`loyaltyEnabled` stays `false` for both). But it no longer implies there's nothing honest to offer: the corrected business model (`decision-log.md` D27) gives Paid tier an immediate, history-independent benefit — NFC selling capability. Forcing every merchant who's already decided she wants this through a Free-tier detour, then into Settings right after finishing Onboarding, would itself violate *global-principles.md*'s "the fastest interaction is the one that never happens." "Empezar gratis" stays the largest, most prominent default for anyone who hasn't already decided; "Activar plan de pago" exists for the merchant who has.

**Why the demo path is seeded at the fullest capability set (`nfc`, `paid`, `loyaltyEnabled`), unlike either real path:** the seeded sales history stands in for the real history a genuine merchant hasn't built yet — it's precisely what lets a demo profile show her `reports.md`'s "Tus clientes" segmentation and the `nfc` selling surface without her needing to actually own a kit or earn paid-tier eligibility first. This is squarely within `decision-log.md` D19's "ordinary Business with seeded data" — no new domain modeling, just a normal Business whose capability values happen to be set to their richest combination so the example is worth looking at. It previews the brand's own "path to what's next" honestly, through real (if seeded) product behavior, rather than through marketing copy forced onto a screen.

**Why "Ver un ejemplo" is the one path gated behind an explicit confirmation screen (§3.4c) before its write happens, unlike either real path:** unlike "Empezar gratis" or "Activar plan de pago," tapping this path writes a permanent Business that she can never later turn into her real one (`decision-log.md` D19 — no conversion mechanic) — and, per §2.1, that write starts counting toward Onboarding being permanently "done." The other two paths don't need an equivalent gate because there's nothing to warn her away from: a real Business existing afterward is the whole point of tapping either of them, not a risk to flag. The demo path is different in kind — its entire value is that it *isn't* her real business, and it's the one path where that fact has to land *before* the irreversible write, not only after it. §3.6 Variant C's own honesty line ("no es información real") is real and worth keeping, but it arrives after the write already happened — too late to be the first time she learns this. §3.4c exists to say it once, plainly, at the one point where choosing differently still costs her nothing.

### 2.3 Why `defaultSellingMode` is always written as `buttons` at Onboarding, for both real paths — never a choice, and never derived from which path she picked

This is a reversal of this document's earlier resolution, corrected alongside `decision-log.md` D27, not a restatement of it. Two independent reasons converge:

- Under the old model, tapping "Activar kit NFC" was an unambiguous statement of intent — that path had exactly one possible reason to exist. Under the corrected model, "Activar plan de pago" conflates two independent benefits (NFC capability now, eventual segmentation once real sales history exists) — the tap alone no longer unambiguously signals "I want tags as my normal selling mode." She may be subscribing purely for the future segmentation value, with no intention of using tags yet.
- Regardless of which real path she picks, she has zero tagged inventory at the exact moment either one completes. Writing `defaultSellingMode = nfc` here would guarantee her first real Session evaluates **Not Ready** (`home.md` §2/§3.6a) and silently substitutes `buttons` anyway — for every Paid-tier merchant, unconditionally, with no corresponding benefit. A default that's wrong the instant it's set isn't a default worth setting.

So `defaultSellingMode` is written as `buttons` unconditionally for **both** real Onboarding paths — never inferred from path choice, never asked as a separate question either. Whether and when she wants `nfc` as her normal selling mode is now a genuinely separate decision, made once she has tagged inventory to back it up, via `settings.md`'s self-service "Cambiar a vender con tags" control (`decision-log.md` D27) — not something Onboarding can honestly infer on her behalf.

This still respects *global-principles.md*'s "never ask twice" and "business language before technical language": Onboarding doesn't ask a raw `defaultSellingMode` question either, it just no longer pretends the path choice answers it. And it still matches *architecture-principles.md* #1 ("capabilities resolved once, upstream, never asked mid-flow") — `registrationMode` (via `subscriptionTier`) is still resolved once, at the highest point it could possibly apply, before any tab, Session, or Sale exists; only the *separate* `defaultSellingMode` preference moved to where it can be set honestly.

Symmetrically, `registrationMode ⊇ {nfc}` immediately activates Inventario's existing Assign-Tags gate (`information-architecture.md`, `inventory.md` §2) the moment she registers her first Lot — no new design needed there either; it's a pure consequence of the capability now being in the set.

### 2.4 Handoff — where Onboarding's responsibility actually ends

The last screen this document owns is §3.6 (Todo listo). The screen after it is produced entirely by `home.md`'s own, already-approved resolution logic — not a new screen defined here:

- **Empezar gratis / Activar plan de pago** → Catalog is genuinely empty → Home's cold start (`home.md` §3.3), verbatim, same CTA ("Registrar mercancía") that document already specifies.
- **Ver un ejemplo** → Catalog is seeded and non-empty, no Session pre-opened → Home's idle state (`home.md` §3.4, or §3.6 "Continuar Día N" if the seed includes an active Event), same screen, populated with seeded data.

No path ever hands off into a pre-opened, *active* Session, for any reason — including the demo. She always taps "Iniciar Sesión Rápida" (or "Continuar Día N") herself, the first time, exactly like every other merchant. This is a narrower claim than "Onboarding never writes Inventory/Selling data at all": the demo path's seed generation does populate Inventory-owned (Catalog/Products/Lots/tagged units) and Selling-owned (past Events/Sessions/Sales) historical data — through those contexts' own write paths, at the point the seed is created — since that's the whole mechanism that makes a demo profile worth looking at (§2.2). What never happens, for any path, is Onboarding fabricating a *live*, already-open selling state on her behalf — that would be a genuinely new, unjustified dependency and a direct violation of *architecture-principles.md* #6. Historical/seeded data existing when she arrives is a different concern from an active Session existing before she's tapped anything.

## 3. Low-fidelity wireframes

Conventions inherited from `home.md`/`inventory.md`: `[ ]` = tappable, plain text = passive/informational. **One deviation from every other document in this family: no persistent bottom nav bar appears on any screen in this section.** Before a Business's capabilities exist, there is nothing yet for Hoy/Inventario/Eventos/Resultados to resolve into — showing four tabs that lead nowhere real would be a false affordance, the opposite of *global-principles.md*'s "technology should disappear." The nav bar's first-ever appearance is the instant Home is reached in §3.6's handoff.

### 3.1 Resolving (near-instant) — determining whether Onboarding is needed at all
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
└───────────────────────────────┘
```
- Identical silent-skeleton convention to every tab's own §3.1 (`home.md`, `inventory.md`, `events.md`, `reports.md`). *global-principles.md*, "technology should disappear."
- No nav bar — none exists to show yet (see §3 preamble).

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
└───────────────────────────────┘
```
- One calm, plain-language line, identical convention to every other tab's §3.2. *global-principles.md*, "business language before technical language."

### 3.3 Bienvenida + Elegir cómo empezar (true first-run entry point)
```
┌───────────────────────────────┐
│                                │
│           Nahui                 │
│                                │
│  Aquí vas a registrar tus        │
│  ventas al momento y ver cómo    │
│  va tu negocio, sin perder       │
│  tiempo con la app.               │
│                                │
│   ¿Cómo quieres empezar?         │
│                                │
│   [    Empezar gratis      ]    │  primary, largest
│                                │
│   [  Activar plan de pago  ]    │  secondary
│   (si ya arreglaste tu pago)     │  subtext, small
│                                │
│      [   Ver un ejemplo    ]     │  tertiary, text-only link
│                                │
└───────────────────────────────┘
```
- **Welcome copy and the path choice live on one screen, not two.** An earlier draft of this design split them, with a separate "Comenzar" tap between them purely to hold a warm welcome line. Merged here because that tap added nothing but a step — the same warmth reads perfectly well sitting directly above the three options. Direct application of *global-principles.md*, "the fastest interaction is the one that never happens." See §10.
- No back arrow — this is the one screen in the whole document with nowhere to go back to.
- "Empezar gratis" is the largest, most prominent option: the fastest, zero-friction default, matching the hierarchy principle `home.md` §3.4 already establishes for its own primary action ("Iniciar Sesión Rápida" first-class, not a fallback).
- "Activar plan de pago" is visually secondary — a real, valid path, but a narrower one (only merchants who've already arranged to pay). The subtext directly beneath it ("si ya arreglaste tu pago") states that prerequisite at the point of decision, not one screen later — the only reassurance that this path doesn't process a payment in-app ("no se te cobra nada aquí," §3.4) previously appeared only after she'd already tapped through, one screen too late for a fact this basic.
- "Ver un ejemplo" (renamed from an earlier draft's "Ver un ejemplo primero" — see §10) is the lightest-weight of the three, text-only, but now bracketed like the other two for tappable-affordance consistency (`home.md`/`inventory.md`'s `[ ]` convention). It isn't starting her real business, so it doesn't compete visually with the two paths that are — but unlike an earlier draft, tapping it no longer writes anything directly: it opens a confirmation step (§3.4c) first, precisely because what it commits to is permanent and irreversible in a way visual weight alone shouldn't be trusted to communicate.
- Copy never mentions "cuenta gratuita," "suscripción," "modo de venta," or any capability by its technical name — "gratis," "plan de pago," "ejemplo" are the only technical-adjacent words used, and all three are words Ana already has a mental model for.

### 3.4 Activar plan de pago — confirmar antes de continuar
```
┌───────────────────────────────┐
│ ← Elegir cómo empezar            │
│                                │
│  Activar plan de pago            │
│                                │
│  Vas a poder vender con tags,     │
│  además de botones. Cuando        │
│  tengas historial de ventas,      │
│  también vas a ver resultados     │
│  por bazar.                       │
│                                │
│  Esto se activa confirmando tu    │
│  pago fuera de la app — no se     │
│  te cobra nada aquí. Si ya lo     │
│  arreglaste, confirma abajo.      │
│                                │
│  [  Confirmar y activar   ]      │
│                                │
│  [ Mejor quiero empezar gratis ] │  escape hatch, tappable
└───────────────────────────────┘
```
- Confirms an already-arranged payment — a bare self-attestation, never a purchase step in-app, per `decision-log.md` D19's payments/checkout boundary and D27's corrected capability mechanism. The reassurance line ("no se te cobra nada aquí") makes that non-goal legible directly in the copy, not just in this document's own reasoning. This is the first and only place the no-charge reassurance appears — §3.3's own subtext states a related but distinct fact (that she needs to already have arranged payment), not the cost point; the two shouldn't be conflated when either screen's copy is revised later.
- No code, no kit dependency — unlike the retired activation-code mechanism this path used to require, there is nothing to type and nothing that can come back "invalid." A single confirm tap either succeeds (§3.5) or fails on genuine save error (§3.5a) — the same shape as every other write in this document family.
- "Mejor quiero empezar gratis" routes back to §3.3 with nothing lost and nothing to confirm — she hasn't committed to anything yet at this point, so there's no destructive action to protect against. *global-principles.md*, "never a dead end," same posture every other document's error/recovery states already take.

### 3.4c Ver un ejemplo — antes de continuar

The demo path's one deliberate pause point, mirroring the pause the NFC path already has at §3.4: a real screen, not an instant pass-through, reached the moment she taps "Ver un ejemplo" in §3.3, before anything is written.

```
┌───────────────────────────────┐
│ ← Elegir cómo empezar            │
│                                │
│  Ver un ejemplo                  │
│                                │
│  Esto crea un negocio de         │
│  ejemplo con ventas y clientes    │
│  inventados, para que veas cómo   │
│  se usa Nahui.                    │
│                                │
│  No es tu negocio real, y no      │
│  vas a poder convertirlo en tu    │
│  negocio real después. Para tu    │
│  negocio real, usa "Empezar       │
│  gratis" o "Activar plan de       │
│  pago."                          │
│                                │
│  [      Ver el ejemplo      ]    │  confirm — this is what commits
│                                │
│  [ Mejor quiero registrar mi     │
│    negocio real ]                │  escape hatch, tappable
└───────────────────────────────┘
```
- Nothing is written yet on this screen — the write happens only after "Ver el ejemplo" is tapped, at §3.5. This is the moment the permanence/non-real-data fact has to land, *before* the irreversible write, not only afterward on §3.6's milestone screen — the earlier draft's only equivalent disclosure came one screen too late to be useful to a merchant deciding whether to proceed.
- "Mejor quiero registrar mi negocio real" routes back to §3.3 with nothing lost and nothing to confirm, identical posture to "Mejor quiero empezar gratis" (§3.4) — she hasn't committed to anything at this point, so there's no destructive action to protect against. *global-principles.md*, "never a dead end."
- No auto-continue here, unlike §3.6 — this is the one screen in the document that should not advance on its own, since its entire purpose is to make sure she actually reads it before an irreversible write happens.
- "Ver un ejemplo" (§3.3) and "Ver el ejemplo" (this screen) are deliberately different verb forms in the Spanish copy — the first is choosing to look at the option, the second is the actual act of committing to it — so the two taps don't read as the same decision repeated twice, even though structurally §3.3's tap is navigation and this screen's tap is the real commitment.

### 3.5 Creando tu negocio — near-instant / slow (shared by all three paths)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│                                │        │      Preparando todo…           │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │                                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
- The one write action every path shares — the moment a Business and its capabilities actually get created (§2.2). Same near-instant/slow convention as every write action in this document family (`inventory.md` §3.10, `events.md` §3.9, `home.md` §3.8c).
- For "Ver un ejemplo," this same state also covers generating the seeded data — no separate "building your example" screen invented; from her side, it's the identical wait with the identical plain copy. Deliberately not more elaborate than this: a longer, more "impressive"-looking generation sequence would just be padding a wait she doesn't need to watch. Reached only after §3.4c's confirmation, never before it.
- **Atomicity guarantee:** for every path, this write is all-or-nothing. For the demo path specifically — where Business creation and seed-data generation are bundled into this one step — either both the Business (with its capabilities) and the full seeded Catalog/history are written together, or neither is written at all. A partial failure (e.g. capabilities saved but seed data only partially generated) is treated identically to a total failure: it routes to §3.5a, and retrying re-runs the entire write from scratch — it never resumes into, or leaves behind, a half-seeded Business. This matters specifically here because §2.1's "capabilities already written" check (case 2) depends on this step having genuinely succeeded in full — an inconsistent partial write is exactly the scenario that check has to be able to rule out. Same rigor `home.md`'s Finalizar Venta gives its own write action.

### 3.5a Creando tu negocio — error
```
┌───────────────────────────────┐
│  No pudimos crear tu negocio.    │
│  Intenta de nuevo.                │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
- Nothing about her choice (which path, a confirmed payment, or a confirmed demo) is lost by a failed creation — retrying replays the same, already-confirmed choice, never asks her to redo the path selection, re-confirm an already-confirmed payment, or re-confirm the demo path's §3.4c screen. *global-principles.md*, "the best interface stays out of the merchant's way," same guarantee `inventory.md` §3.11 makes for a failed Guardar mercancía.
- For the demo path specifically, retrying re-attempts the full atomic write described in §3.5 — never a partial resume into a half-seeded Business.

### 3.6 Todo listo — milestone / handoff (three copy variants)

**Variant A — Empezar gratis:**
```
┌───────────────────────────────┐
│                                │
│         Todo listo              │
│                                │
│  Ya puedes registrar lo que      │
│  traes y empezar a vender.        │
│                                │
│      [      Entrar      ]       │
│                                │
└───────────────────────────────┘
```

**Variant B — Activar plan de pago:**
```
┌───────────────────────────────┐
│                                │
│         Todo listo              │
│                                │
│  Ya puedes vender con botones.    │
│  Cuando tengas mercancía           │
│  etiquetada, cambia a vender       │
│  con tags en Configuración.        │
│                                │
│      [      Entrar      ]       │
│                                │
└───────────────────────────────┘
```

**Variant C — Ver un ejemplo:**
```
┌───────────────────────────────┐
│                                │
│         Todo listo              │
│                                │
│  Esto es un ejemplo de cómo se   │
│  ve tu negocio en Nahui.          │
│  Explora lo que quieras — no      │
│  es información real.             │
│                                │
│      [      Entrar      ]       │
│                                │
└───────────────────────────────┘
```
- One genuinely warranted deliberate moment in an otherwise frictionless flow: this is the single first-ever milestone in Ana's whole relationship with the app, and *brand-guide.md*'s tone ("warm, direct... a tool that feels welcoming, not intimidating") justifies exactly one beat of ceremony here, the same way `home.md` §3.12's close-summary earns its own distinct screen for a real, meaningful, once-per-day event. This is a once-*ever* event, an even more conservative bar to clear.
- "Entrar" auto-continues into Home after a couple of seconds if left untouched, but is tappable immediately — she is never made to wait through her own milestone screen against her will. Same reasoning as the ambient, self-dismissing confirmations in `inventory.md` §3.12/§3.13, scaled to a full screen because this moment, unlike a routine Lot save, is unique.
- Variant C's honesty ("no es información real") is deliberate and load-bearing, but by the time she reaches this screen it's a *reinforcement* of a fact she already read and confirmed at §3.4c, before the write — not the first or only place she learns it. See §8's open validation question and §11 for why this line still matters for trust, without inventing any persistent in-app indicator beyond this screen.
- No back arrow on any variant — by this point a Business and its capabilities already exist (§2.2); there's nothing to undo by going back, the same way none of `inventory.md`'s post-save confirmations offer a way back into the form that produced them.
- If she's interrupted while this screen is showing (phone call, backgrounding, OS kill), the next app open resumes at this exact same variant rather than silently skipping to Home — see §2.1 case 2 and §3.7 for the full guarantee.

### 3.7 Retomar onboarding interrumpido

No new wireframe — reaching any screen in §3.3 through §3.5a a second time (after the app was closed, backgrounded, or crashed mid-flow) renders it **pixel-identical** to the state described above, with whatever she'd already entered still present (the "Activar plan de pago" confirmation screen, §3.4, re-shows itself identically if she was interrupted there before tapping "Confirmar y activar" — there's no typed data to preserve, just a bare confirm tap not yet taken; the demo path's confirmation screen, §3.4c, re-shows itself identically if she was interrupted there before choosing either option; a path already tapped but not yet confirmed by a completed write is re-resumed at that exact step). Same guarantee `home.md` §3.13 and `inventory.md` §3.7 already make for their own in-progress work — *global-principles.md*, "never ask twice." She is never asked "were you still setting up?" and never restarted from §3.3 once she's made real progress past it.

**This same guarantee extends past §3.5, through §3.6 — deliberately, not by oversight (see §2.1, case 2).** Onboarding's capabilities being written (§3.5's write succeeding) is necessary but not sufficient for "complete" to mean "never shown again." If she's interrupted while a "Todo listo" variant (§3.6) is on screen — a phone call, backgrounding, an OS kill, all routine events, not edge cases — the next app open resumes at that exact same variant (recomputed from her already-stored path/capabilities, never re-triggering §3.5's write a second time) rather than silently marking Onboarding complete and skipping straight to Home. This is the one narrowing of D13's "complete" in the whole document, and it exists for a specific reason: §3.6 is this document's own argument for why one deliberate beat of ceremony is warranted at all — an interruption shouldn't be allowed to silently cost her the one screen this document treats as worth having.

### 3.8 Falla defensiva — no se pudo determinar el estado inicial
```
┌───────────────────────────────┐
│  No pudimos cargar Nahui.        │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
- Covers §3.1/§3.2's own resolution failing outright (can't determine whether a Business/completed Onboarding exists at all). Manual `Reintentar`, same convention as `inventory.md` §3.18 / `events.md` §3.18 / `reports.md` §3.14 (not Home's more aggressive silent auto-retry) — there is no live-customer risk at this exact moment to justify that heavier mechanism.
- No nav bar to preserve here (none exists yet) — unlike every other tab's own fallback, this state genuinely has nothing beyond itself to keep functional.

## 4. Interaction flow (summary)

```
Open app (very first time, or any time before Onboarding completes)
  → resolve (§2.1, automatic)
      → already complete (capabilities written AND §3.6 dismissed) ────→ Home's
        own resolution (home.md §2)
      → capabilities written, §3.6 still showing when interrupted ────→ resume
        the same Todo listo variant (§3.6, §2.1 case 2)
      → in-progress, interrupted before §3.5's write succeeded ───────→ resume
        exact step (§3.7)
      → fresh ───────────────────────────────────────────────────────→ Bienvenida
        + Elegir cómo empezar (3.3)
      → resolution itself fails ─────────────────────────────────────→ fallback
        (3.8), Reintentar

From §3.3, tap a path:

  Empezar gratis
    → creando tu negocio (3.5) → error (3.5a) → Reintentar
    → success → Todo listo, Variant A (3.6) → Entrar → Home cold start (home.md §3.3)

  Activar plan de pago
    → confirmar antes de continuar (3.4)
        → "Mejor quiero empezar gratis" → back to 3.3, nothing written
        → tap "Confirmar y activar" → creando tu negocio (3.5) → error (3.5a) → Reintentar
    → success → Todo listo, Variant B (3.6) → Entrar → Home cold start (home.md §3.3)

  Ver un ejemplo
    → confirmar antes de continuar (3.4c)
        → "Mejor quiero registrar mi negocio real" → back to 3.3, nothing written
        → tap "Ver el ejemplo" → creando tu negocio (3.5, generating seeded data)
          → error (3.5a) → Reintentar
    → success → Todo listo, Variant C (3.6) → Entrar → Home idle state, populated
      (home.md §3.4)

Any interruption up to and including §3.6 still being on screen (phone lock,
backgrounding, force-close):
  → next app open resumes exactly where she left — the same in-progress step
    (§3.3–§3.5a) if the write hadn't succeeded yet, or the same Todo listo
    variant if §3.6 itself was showing (§3.7, §2.1 case 2) — never restarts
    from §3.3 once real progress has been made.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Bienvenida + Elegir cómo empezar (fresh first run)
4. Activar plan de pago — confirmar antes de continuar
5. Ver un ejemplo — confirmar antes de continuar
6. Creando tu negocio (near-instant / slow) — shared by all three paths
7. Creando tu negocio — error
8. Todo listo — Variant A (Empezar gratis)
9. Todo listo — Variant B (Activar plan de pago)
10. Todo listo — Variant C (Ver un ejemplo)
11. Retomar onboarding interrumpido (resumes any of states 3–7, pixel-identical, in-progress data intact; if interrupted while a Todo listo variant (8–10) was showing, resumes that exact variant instead of re-running the write or restarting from state 3)
12. Falla defensiva — no se pudo determinar el estado inicial

## 6. Minimum step count

| Scenario | Taps to Home | Why it can't be fewer (or, for the demo path, why one more tap is deliberate) |
|---|---|---|
| Empezar gratis | **1** (+1 optional, to skip the milestone's auto-continue wait) | Tapping the path itself is the only real decision; there is nothing else to type, confirm, or configure. |
| Activar plan de pago | **2** (path + Confirmar y activar) (+1 optional milestone tap) | Confirming an already-arranged payment is a real, necessary fact — not padding — even though nothing is typed; the extra tap protects a real commitment from a stray tap, the same reasoning `settings.md`'s identical two-tap floor already applies to the same action reused here. |
| Ver un ejemplo | **2** (path + confirmar en 3.4c) (+1 optional milestone tap) | The confirmation tap (§3.4c) is the one deliberate exception to "don't waste a tap" anywhere in this document — added on purpose because this path's write is permanent and non-convertible (`decision-log.md` D19); the extra tap is what makes that fact land before commitment, not only after it. Everything else about the path remains zero real information to provide — the seed still supplies everything else. |
| Reopening the app after Onboarding already completed | **0** — never shown again | Direct consequence of `decision-log.md` D13, once §3.6 has also been dismissed (§2.1). |
| Resuming an interrupted Onboarding | **0 extra** — returns to the exact step, nothing re-asked | Same guarantee `home.md` §3.13 / `inventory.md` §3.7 already make for their own in-progress work; extends through §3.6 (§3.7). |

Every scenario's floor is dominated entirely by the information that scenario genuinely requires (an explicit confirmation, for the one path — Activar plan de pago — with a real commitment behind it) — none of the three paths carries a single tap that exists only for ceremony, except two deliberate exceptions: the milestone screen (§3.6), which is itself skippable via auto-continue, and the demo path's one confirmation tap (§3.4c), which is deliberately *not* skippable — because the fact it discloses has to be seen, not skimmed past, before an irreversible write.

## 7. Automation opportunities

- Whether Onboarding shows at all — resolved silently on every app open (§2.1); never a manual "skip onboarding" she has to find or a setting she has to remember she already changed.
- `subscriptionTier` is a genuine, silently-resolved two-way choice at Onboarding, not a live picker — she expresses it entirely through which path she taps ("Empezar gratis" vs. "Activar plan de pago"), never through a separate "gratis / de paga" toggle (§2.2, `decision-log.md` D27).
- `defaultSellingMode` is written as `buttons` unconditionally for both real paths, never derived from path choice and never asked as a separate question — deferred entirely to `settings.md`'s self-service "Cambiar a vender con tags" control, once she actually has tagged inventory to back it up (§2.3, `decision-log.md` D27).
- `eventScheduling` — always on, never asked, per `domain-model.md`.
- Resuming an interrupted Onboarding at the exact step, including mid-display of the §3.6 milestone — automatic, no restart, no re-prompt (§3.7).
- NFC Readiness / Session-start resolution for a freshly onboarded `nfc`-default Business with zero tagged inventory — already fully automatic per `home.md` §2/§3.6a (`decision-log.md` D23); this document only needed to compose correctly with it, not redesign it (§2.3).
- Handoff into Home's own resolution logic — Onboarding never invents its own version of "what does she see next"; it reuses `home.md` §2/§3.3/§3.4 exactly as already specified (§2.4).
- **Deliberate exception, not an oversight:** the demo path's confirmation step (§3.4c) is added on purpose, going against this document's own automation bias. Every other reducible tap in this document is removed (§6); this one is added, because automating it away would hide, rather than surface, the one fact that has to reach her before an irreversible write.

## 8. Open questions

None of the items below block this document's completion or require inventing a new mechanism to route around — flagged for awareness, same discipline `home.md` §8 and `inventory.md` §8 already use for non-blocking items.

1. **Validation recommendation (not a Foundation ambiguity):** whether §3.4c's confirmation copy is clearly understood by a first-time merchant as a non-convertible practice profile, rather than a preview of paid features she could somehow "keep" for her real business. Putting the permanence/non-real-data fact before the write (§3.4c), not only after it (§3.6 Variant C), substantially reduces this risk relative to an earlier draft that disclosed it only afterward — but it's still worth a quick check with Ana or a simulated first-run test before this is fully locked in, the same evidence-driven caution `home.md` §8 already recommends for its own interaction-model changes from the validated prototype.
2. **Cross-document, not designed here:** whether a persistent "estás viendo un ejemplo" indicator should exist inside Home/Inventario/Eventos/Resultados beyond this document's own milestone screen, for a merchant who picked the demo path and is now browsing the four tabs with seeded data. This would be a `home.md` (and sibling) design question, not an Onboarding one — flagged for whoever next touches those documents, not escalated as newly open here.
3. **Confirmed out of scope, not reopened:** whether a demo Business can ever become a real one. `decision-log.md` D19 already states the answer — no conversion mechanic, contingent on demo profiles never needing behaviorally-distinguishable treatment; if that contingency is ever violated, it needs its own small decision-log entry at that time, not something this document should preemptively design. See §11.
4. **Resolved, kept for continuity — the most likely real-world capability-change scenario is now designed, just not in this document:** a merchant who chooses "Empezar gratis" today and wants `nfc` selling later gets there by upgrading to the Paid plan in Configuración (`settings.md` §2.2, "Activar plan de pago") — `nfc` follows automatically as a derived consequence of `subscriptionTier = paid` (`decision-log.md` D27), never through a separately obtained physical kit or activation code. `company/business-decisions.md` Q5 is Resolved (`decision-log.md` D25), and D27 further corrected the mechanism this item originally anticipated (kit possession): the physical tag package she eventually receives is fulfillment logistics only, mailed automatically once she subscribes, and grants nothing by itself. This document still does not design that upgrade path itself — it lives entirely in `settings.md` — but the gap this item once flagged as open is now closed elsewhere, not silently assumed away.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — Bienvenida and the path choice are merged into one screen instead of two (§3.3, §10); "Activar kit NFC" was replaced, not removed, by "Activar plan de pago" (`decision-log.md` D27 — see §2.3), so Onboarding still offers three paths — "Empezar gratis" has a 1-tap floor; `subscriptionTier` is expressed entirely through which of the two real paths she taps, a genuine two-way choice now that Paid tier has an honest, history-independent benefit to offer (§2.2), never a separate technical question of its own; the milestone screen (§3.6) auto-continues rather than requiring a tap. **The one deliberate exception to this principle anywhere in this document is still the demo path's confirmation tap (§3.4c)** — added on purpose, not left over by accident, because the fact it discloses (an irreversible, non-convertible write) has to reach her before she commits; a tap that exists specifically to slow her down for a fact this consequential isn't the kind of waste this principle argues against.
- *"Never ask twice"* — `nfc` is never asked as an Onboarding choice at all, isolated or otherwise: it's a pure read-time derivation from `subscriptionTier = paid` (`decision-log.md` D27), not a value any path sets, so there is no separate question left to avoid asking twice about (§2.3); Onboarding is never shown again once complete, including the §3.6 milestone actually being seen (§2.1, D13); an interrupted flow resumes at the exact step, never re-asking anything already entered (§3.7).
- *"Technology should disappear"* — no nav bar exists before there's anything for it to navigate into (§3 preamble); loading states stay silent unless genuinely slow, identical convention to every other tab (§3.1/§3.2/§3.4a/§3.5).
- *"Selling is a state, not a navigation destination"* — Onboarding hands off into Home's own resolution logic rather than fabricating a fake pre-opened Session for any path, including the demo (§2.4); she always starts selling herself, the same way every merchant does.
- *"Business language before technical language"* — every screen uses "gratis" and "ejemplo," never "registrationMode," "subscriptionTier," "defaultSellingMode," "nfc," or "capability," anywhere, including in the demo path's confirmation state (§3.4c); with "Activar kit NFC" removed, no screen in this document ever mentions a kit, a tag, or an activation code at all (`decision-log.md` D27).
- *"Every repeated decision should become automation"* — every capability this document sets is set exactly once, at this single moment, and never re-asked anywhere downstream (§7).
- *"Capture business truth once, reuse it forever"* — her single first-run choice ("Empezar gratis," "Activar plan de pago," or "Ver un ejemplo") is captured exactly once and never re-asked on a retried creation failure (§3.5a); the demo path's confirmation (§3.4c) is likewise never re-asked on a retry. `nfc`'s own truth — whether it's available at all — is never captured here in the first place, deliberately: it's derived fresh from `subscriptionTier` wherever it's read (`decision-log.md` D27), so there is no second copy of that fact for this document, or any other, to keep in sync.
- *"The best interface stays out of the merchant's way"* — a failed Business-creation write never drops an already-chosen path or an already-confirmed demo screen (§3.5a); "Mejor quiero registrar mi negocio real" is a real, always-available escape hatch, never a dead end (§3.4c).

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream, never asked mid-flow)* — Onboarding is the highest possible point this principle can apply to: `registrationMode`, `defaultSellingMode`, and `subscriptionTier` are all set once, before any tab, Session, or Sale exists, and never re-asked anywhere in `home.md`, `inventory.md`, `events.md`, or `reports.md` (§2.2, §2.3).
- *#4 (internal-only entities never leak into user-facing language)* — no domain term (Business, Capability, Selling Mode Capability, Session Operating Mode) ever appears in merchant-facing copy, including error and confirmation states.
- *#6 (one-way dependency direction)* — Onboarding never fabricates a live, already-open Session for any path, including the demo (§2.4) — the demo's seed generation writes historical Inventory/Selling data through those contexts' own paths, a distinct concern from inventing active selling state on Ana's behalf.

**brand-guide.md:**
- *Tone — "warm, direct, respects the vendor's intelligence"* — §3.4c states plainly, before any commitment, that the demo write is permanent and can't become her real business later; treating her as someone who can handle that fact upfront, rather than only letting her discover it after an irreversible tap, is what "respects the vendor's intelligence" means in practice here, not just as a slogan.

## 10. Decisions made

- **Three paths, named "Empezar gratis," "Activar plan de pago," and "Ver un ejemplo"** — "Activar kit NFC" was replaced, not removed, by "Activar plan de pago" (`decision-log.md` D27: `nfc` is now a pure derivation from `subscriptionTier = paid`, and confirming payment is what sets that field — the same two-real-paths shape as before, just with a corrected mechanism for the second one). "Empezar gratis" reuses D19's own example wording verbatim; the demo path's name and copy are this document's own contribution. **Renamed from an earlier draft's "Ver un ejemplo primero":** "primero" linguistically implied a second step — look first, then still pick a real path afterward — that never existed anywhere in the flow (the write is immediate and irreversible, per D19). Dropping the word removes the false implication instead of inventing a followup step D19 already rules out.
- **"Ver un ejemplo" is gated behind an explicit confirmation screen (§3.4c) before its write happens, unlike either real path.** An earlier draft resolved this path directly from the welcome screen's tap, styled as the lightest-weight of the three options — which made the least-committal-looking option also the one with the single most permanent, irreversible consequence. §3.4c states the permanence/non-convertibility fact plainly before the write and offers a genuine, zero-cost way to choose differently ("Mejor quiero registrar mi negocio real") at the one moment doing so is still free — mirroring the pause-point-with-escape-hatch shape the NFC path (§3.4) already has.
- **Onboarding's "complete," for the specific purpose of §2.1's resume check, is deliberately narrower than "capabilities written."** It also requires the "Todo listo" milestone (§3.6) to have actually been dismissed. An interruption while §3.6 is on screen resumes at that exact screen next time, rather than silently skipping straight to Home and costing her the one screen this document argues is worth deliberate ceremony. This is a one-time narrowing scoped only to this resume check — it doesn't change when a Business's capabilities are considered valid/usable anywhere else in the product.
- **§3.5's write is explicitly atomic, for all three paths** — for the demo path specifically, Business creation and seed-data generation succeed or fail together; there is no state where capabilities are saved but seed data is only partially generated. A failure of any part routes to §3.5a and retries the whole write, never resumes into a half-seeded Business.
- **The prerequisite subtext this document once carried on "Activar kit NFC" ("si ya tienes tu kit en mano") is removed along with the path itself** (`decision-log.md` D27) — there is no longer a kit-possession prerequisite for any Onboarding path to state, since kit possession was never actually what granted `nfc` in the first place. The one no-charge reassurance that used to accompany it ("no se te cobra nada aquí") is likewise removed — with no in-app payment step anywhere in Onboarding, and no path that could be mistaken for one, there is nothing left for that reassurance to be about.
- **All tappable actions, including escape hatches and the demo path's entry point, use the `[ ]` bracket convention consistently** — an earlier draft left "Ver un ejemplo primero" and "No tengo el código a la mano" as unbracketed text despite being tappable, breaking the convention `home.md`/`inventory.md` establish.
- **Bienvenida and the path-choice screen are merged into one screen (§3.3)**, not two — an earlier structure held them apart behind a "Comenzar" tap purely to hold a welcome line; merging removes that tap without losing any warmth, since the same copy reads identically sitting directly above the three options.
- **`defaultSellingMode` resolves automatically to `buttons` for both real paths, with no separate confirmation question ever asked** (§2.3) — a reversal of the earlier draft's "Activar kit NFC" bullet, which used to derive it from path choice. A real Onboarding path can never set `defaultSellingMode = nfc`: `nfc` only exists once `subscriptionTier = paid` (`decision-log.md` D27), and even "Activar plan de pago" writes `buttons` unconditionally, since a merchant confirming payment has zero tagged inventory yet either way (§2.3). The demo path is the sole exception, seeded directly at `nfc` alongside its seeded `paid` tier (§2.2) — never chosen through a question either.
- **`subscriptionTier` is a genuine two-way choice at Onboarding, expressed entirely through which real path she taps** (§2.2) — not a live "gratis / de paga" picker, but not a single forced value either: "Empezar gratis" writes `free`, "Activar plan de pago" writes `paid`. This corrects an earlier draft's reasoning, which held that no honest paid option could ever be offered at first run — true of Segmentation specifically (still `loyaltyEnabled = false` for both real paths), but not of `nfc`, which `decision-log.md` D27 makes an immediate, history-independent Paid-tier benefit.
- **No activation-code entry/validation machinery exists anywhere in this document any longer.** The earlier draft's §3.4 (ingresar código), §3.4a (validando), and §3.4b (código inválido) screens existed solely to confirm possession of a physical kit as the mechanism that granted `nfc` — per `decision-log.md` D27, that mechanism never existed at the domain level to begin with: `nfc` is derived purely from `subscriptionTier = paid`, never confirmed by a code, a kit, or any other artifact. Removing this machinery isn't a simplification of an existing flow; it's the removal of a flow this document should never have specified once the underlying capability model is understood correctly. The welcome tag package she may eventually receive is fulfillment logistics only (D27) and has no Onboarding-facing screen of any kind.
- **The demo path is seeded at the richest capability combination** (`nfc`, `paid`, `loyaltyEnabled = true`) — deliberately different from either real path, so the seeded sales history can stand in for the real history a genuine merchant hasn't built yet, letting her see the full experience honestly rather than a partial one.
- **No path ever hands off into a pre-opened Session** — including the demo. Every path ends at Home's own idle or cold-start state; she always taps "Iniciar Sesión Rápida" (or "Continuar Día N") herself, exactly like a real merchant would, preserving *architecture-principles.md* #6.
- **No persistent bottom nav bar during any Onboarding screen** — a deliberate deviation from every other document in this family, since a Business's capabilities don't exist yet for the four tabs to resolve into; showing them would be a false affordance.
- **The "Todo listo" milestone screen (§3.6) is the one deliberate moment of ceremony in an otherwise frictionless flow** — justified specifically because it happens exactly once, ever, in Ana's whole relationship with the app; auto-continuing (rather than requiring a tap) keeps it from becoming genuine friction for a merchant who just wants to get moving.
- **A shared "Creando tu negocio" write state (§3.5) covers all three paths**, including the demo's data-seeding — deliberately not given its own more elaborate "building your example" sequence, since a longer wait than necessary would be padding, not honesty.
- **No demo-to-real conversion mechanic is designed** — a direct, explicit application of `decision-log.md` D19's own stated contingency, not a gap this document overlooked (§11).
- **Todo listo's CTA renamed from "Empezar" to "Entrar," uniformly across all three variants (§3.6) — Horizontal Journey Review remediation.** "Empezar gratis" (§3.3) and the milestone's own CTA shared the same verb two screens apart, reading as "start... start" rather than two distinct actions — caught by the Product Owner's own walkthrough of the free-tier path. §3.3's three path CTAs are unchanged: they're genuinely about *choosing* which path to begin. The milestone CTA is a different moment — her Business and capabilities already exist (§3.5's write already succeeded) by the time she reaches Todo listo; what's left is entering the app, not starting anything a second time. Checked against all three variants for collision; none found.

## 11. Future considerations

- Whether a persistent, in-app indicator that a merchant is browsing a demo/seeded Business should exist beyond this document's own milestone screen — a `home.md`-and-siblings design question, not designed here (§8, item 2).
- A demo-to-real conversion path, if real usage ever shows merchants trying the demo and then wanting to keep using the app with their seeded example intact rather than starting fresh — per `decision-log.md` D19, this would need its own small decision-log entry (e.g., a distinguishing flag) only if that behavioral need actually surfaces; not designed preemptively.
- Additional Onboarding paths (e.g., a referral or organizer-distributed path) if the business model direction in `company/CLAUDE.md` evolves — not designed now, no evidence yet that a fourth path is needed.
- Whether the seeded demo content's exact shape (which example Products, how many past Events/Sessions/Sales) should be specified more precisely than "illustrative" — left to Builder's discretion, but not entirely unconstrained: §2.2's own reason for choosing the richest capability combination (`nfc`, `paid`, `loyaltyEnabled`) only holds if the seed actually clears the bar those capabilities' own gating logic requires. Two concrete minimums the seed must meet for the demo to deliver on its stated purpose, not just claim the capability: enough `available` InventoryUnits with assigned NFCTags to resolve NFC Readiness as Ready (`home.md` §2/§3.6a) — otherwise her first demo Session silently opens in `buttons` despite the `nfc` capability, undermining the reason `nfc` was chosen at all — and at least one recorded Claim, so `reports.md`'s "Tus clientes" (§3.12) actually renders populated rather than falling back to its own empty-state teaser (§3.13). Neither doc treats either fallback as broken — both handle it gracefully — but a seed that misses either minimum would make the demo path's whole justification for its capability choice silently moot on first use.
