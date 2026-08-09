# Configuración — UX Specification

Status: Approved. Full UX Remediation cycle complete across three rounds — SET-M1, SET-M2, SET-M3 (round 1), SET-B1/SET-M4 (round 2), and their round-3 regression fixes — all fixed by `ux-designer` and verified clean by `ux-critic`. `reviewer`'s Foundation-consistency pass caught one further Blocker (Customer Segmentation copy not jointly gated on `subscriptionTier=paid` and `loyaltyEnabled=true`, per `decision-log.md` D22) — fixed, re-verified clean. See `product/02-ux/ux-critic-findings.md` for the full record.
**Amended for `decision-log.md` D27** (NFC capability corrected to derive from `subscriptionTier`, not an independent entitlement): the dedicated "Activar venta con tags" activation-code path (former §2.3/§3.8/§3.8a/§3.8b, SET-B1) is retired entirely — `nfc` is no longer independently self-service-toggleable; it changes only as an automatic consequence of the `subscriptionTier` actions. A new `defaultSellingMode` control ("Cambiar a vender con tags" / "Cambiar a vender con botones") is added, previously out of scope (§8 item 5). Went through a coordinated three-document cycle (with `home.md`/`onboarding.md`) — `ux-critic` found one Blocker (in `onboarding.md`'s sibling milestone copy, not here) plus two Major and three Minor findings across the three documents, all fixed and verified. `reviewer`'s Foundation-consistency pass found zero Blockers, one Important finding (stale "two real paths" language in `onboarding.md`, not here) — fixed directly by Main. Folded back into Approved.

**Further amended 2026-08-08 (`decision-log.md` D34 — Customer Segmentation
visibility gate corrected):** D22's joint-gate clause (`subscriptionTier=
paid` **and** `loyaltyEnabled=true` together, required for Resultados to
show Frequent Customers data) is corrected — Resultados' "Tus clientes"
section now gates on `subscriptionTier=paid` alone (`reports.md`, amended
in the same pass). "Activar clientes frecuentes" (§3.4) stays a real,
meaningful action — it still governs whether Loyalty-claim actually
collects Claims at all — but its copy, and "Activar plan de pago"'s and
"Desactivar clientes frecuentes"'s, no longer frame `loyaltyEnabled` as a
joint precondition, alongside `subscriptionTier`, for the Resultados
section to show anything at all. §2.2's capability table, §3.4's three
affected copy variants corrected; §10 updated.

**Further amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled` retired, Frequent Customers unified as a single `subscriptionTier=paid`-gated capability). `ux-critic`: 1 Major (§2.1 still listed "clientes frecuentes" as something Configuración manages/checks-or-changes) — fixed; verification clean, plus one further stale "six actions"/§2.3 citation in §1 caught and fixed in the same pass. Ready for `reviewer`.** `loyaltyEnabled` is retired outright, not narrowed — there is no Business-level field, screen, or action anywhere in the product for turning Frequent Customers on or off. "Activar clientes frecuentes"/"Desactivar clientes frecuentes" (both directions of §3.4) are removed entirely, not merely re-copied — Frequent Customers becomes automatically available the instant `subscriptionTier` reads `paid` (via "Activar plan de pago"), and becomes automatically unavailable the instant it reads `free` again (via "Volver al plan gratis"); Ana never takes an action of her own to turn it on or off directly. Scope narrows from six actions to four (`subscriptionTier` × 2 directions, `defaultSellingMode` × 2 directions) — §1's "handful of real business decisions" framing, the Scope paragraph, §2.2's table, §3.3a/§3.6's wireframes, §3.4's "Activar plan de pago" copy, §3.5's "Volver al plan gratis" copy, §4, §5, §6, §7, §9, and §10 all corrected. `product/02-ux/reports.md` receives the matching correction on the read/visibility side in the same pass — see that document's own status header.

Scope: `Configuración`, the merchant-facing surface for the Business Capabilities `decision-log.md` D25/D27/D40 leave merchant-self-service: `subscriptionTier` (Free ↔ Paid) — two actions (both directions), a reusable "pending change" indicator, and a way to cancel a pending change before it lands — plus `decision-log.md` D27's `defaultSellingMode` control (Botones ↔ Etiquetas NFC), constrained to whichever modes `subscriptionTier` currently makes available: **four actions total**, not six. Both `defaultSellingMode` directions use the same immediate-effect template `subscriptionTier`'s "activate" direction already uses (§2.3, §3.4) — the only real difference is that neither carries a pending-value/effective-date pair, since the field has no billing-cycle implication for D25's deferred-timing rationale to apply to, not a differently-shaped UI. `registrationMode`'s `nfc` entitlement is no longer an independently self-service-toggleable capability of its own (D27 superseded that part of D25) — it is a pure read-time derivation from `subscriptionTier = paid`, so it has no dedicated action or row here; it changes only as an automatic consequence of the `subscriptionTier` actions below. **`loyaltyEnabled` is retired outright, not merely absent from self-service scope** (`decision-log.md` D40) — there is no Business-level field left to toggle, self-service or otherwise; Frequent Customers as a whole is entitled purely by `subscriptionTier`, present in full on Paid and structurally absent on Free, with no action of Ana's own anywhere in this document or any other. **Not a fifth nav tab** — per `decision-log.md` D13 and `information-architecture.md`'s "Onboarding and Settings" section, Configuración hangs off the existing session-controls affordance already specified in `home.md` (the header's "▾"). This is the last of the five merchant-facing experiences to be designed (`product/02-ux/CLAUDE.md`). Implementation-independent — low-fidelity only, no visual design.

Out of scope by explicit instruction:
- **No payment/checkout flow of any kind.** `company/CLAUDE.md`'s non-goals state "Payments/checkout — out of scope, do not build." Activating the paid plan here flips `subscriptionTier`, exactly as D25 resolves it — it never shows a price, a card field, or any payment-processing step. By what mechanism money actually changes hands, if any, is a distinct, unnamed question this document doesn't invent an answer to.
- **No bazaar-recommendation logic, no multi-user features** (`company/backlog.md` #3).
- **The specific per-transition timing rule (Q11) is not decided here.** Which of `subscriptionTier`'s two directions (immediate vs. deferred, since `decision-log.md` D27 already settled `defaultSellingMode` as immediate-only with no billing-cycle implication, and `decision-log.md` D40 retires `loyaltyEnabled` entirely, leaving no third capability for Q11 to apply to) is immediate vs. deferred, and the exact deferred rule, depends on a pricing/billing-cycle model that doesn't exist in the Foundation yet (`company/business-decisions.md` Q11, Open). This document specifies both UI shapes generically (§3.4/§3.5) with today's best-available illustrative assignment, not a final table.

## 1. Merchant goal

Ana doesn't think of this as "settings" the way a phone's Settings app works — she thinks of it as the handful of real business decisions she's already made (sell free or paid, sell with tags or buttons) staying changeable, honestly, without her needing to uninstall anything or ask someone else to flip a switch for her. `decision-log.md` D25 exists precisely because "sell free or paid" was originally fixed at Onboarding; this document is what makes Q5's "yes, self-service, both directions, any time" resolution real for her. The second — sell with tags or buttons — reaches the same self-service treatment by a separate route: `decision-log.md` D27 extends it here, after D19/D23 had it Onboarding-only. **Whether she tracks her regulars at all is no longer a decision Ana makes anywhere in this document** — `decision-log.md` D40 retires `loyaltyEnabled` and makes Frequent Customers a pure, automatic consequence of "sell free or paid": present in full the moment `subscriptionTier` reads `paid`, entirely absent while it reads `free`, with no separate switch of its own.

Nothing here is time-critical the way `home.md`'s <3s bar is (`company/backlog.md` #1) — there's no customer waiting while she's in Configuración. Same posture `inventory.md` §1, `events.md` §1, and `onboarding.md` §1 already establish for their own non-urgent contexts: not urgent isn't license to pad it with friction, or to under-explain a decision that involves money or her clientele's data.

This document holds two things in tension, deliberately:

- **Activating something should cost her almost nothing** — nothing is put at risk by turning a capability on.
- **Turning something off or downgrading deserves one deliberate, honest beat** — not a wall of ceremony, but a real moment where she sees what she's giving up and is reassured about what she isn't losing (her history).

Two of the four actions below carry a real, necessary fact beyond a toggle, and the design has to protect them even while every other action stays a clean single-tap-to-confirm.

## 2. Resolution / decision logic

### 2.1 Where the entry point lives — and where it deliberately doesn't (SET-M2 — corrected back to the verified-clean version)

Configuración is not a nav tab. Per `decision-log.md` D13 and `information-architecture.md`'s "Onboarding and Settings" section, it hangs off the session-controls affordance `home.md` §3.7a already specifies at the header's "▾." This document extends that affordance to render anywhere Home shows a persistent header at all — not only the ambient "`[Venue] · Día N` ▾" header of an active Session (`home.md` §3.7–§3.11a), but also the plain "Nahui" heading shown during cold start, idle, and Event-active-no-Session states (`home.md` §3.3–§3.6, including the §3.6a Session-start-moment variants rendered on top of §3.4/§3.5/§3.6). This is deliberate, not an oversight: what's managed here — her plan and how she sells — is meaningful to check or change whether or not she happens to be selling that particular day — precisely the scenario `onboarding.md`'s "Out of scope" preamble names as "very likely the most common real-world path" (subscribing to the paid plan weeks after choosing "Empezar gratis," with no reason to have a Session open at that moment) — restated again, in different words, at `onboarding.md` §8 item 4. Gating Configuración behind "only reachable while a Session is open" would make it unreachable on the many days she doesn't sell at all, and would misuse a real business event (Session-start, which timestamps hours worked — `home.md` §10) for a non-selling errand.

Concretely, tapping the header's "▾":

- **During an active Session** (`home.md` §3.7–§3.11a): opens the existing session-controls sheet (`home.md` §3.7a), now carrying **two** entries — "Cerrar sesión" (unchanged) and "Configuración" (new).
- **During cold start, idle, or Event-active-no-Session** (`home.md` §3.3–§3.6, including its §3.6a variants): opens the same sheet shape, with its one available entry ("Configuración" — "Cerrar sesión" doesn't render, since there's no open Session to close).

**This is deliberately absent from four Home states — stated explicitly, not silently omitted:**

- **`home.md` §3.1/§3.2 (Resolving — near-instant / slow).** Nothing has resolved into a header yet — there's genuinely nothing stable to hang a Settings detour off of.
- **`home.md` §3.12 (Close-summary).** A deliberately transient, self-clearing acknowledgment screen — `home.md` itself is explicit that this state carries "no 'what do you want to do now?' prompt." A Settings entry point competing for attention here would undo that restraint.
- **`home.md` §3.14 (Resolution error / defensive fallback).** A recovery screen whose only job is getting her back to a working state. A Settings detour competing with her one recovery path would work against the reason that state exists.

**Cross-document note, flagged rather than silently assumed (see §8, item 3):** rendering this — a second sheet entry in `home.md` §3.7a, and the "▾" itself appearing in §3.3–§3.6's (and §3.6a's three Session-start-moment variants') currently-plain "Nahui" header — is a small, required addition to `home.md`'s own, already-Approved wireframes. This document specifies *what* the addition is and *why*; actually amending `home.md`'s frozen wireframes to draw it (the same shape of small, additive amendment `home.md` already went through once for `decision-log.md` D23) is a follow-up this document flags for Main/`reviewer` rather than performing itself.

### 2.2 The four actions, their templates, and today's illustrative immediate/deferred assignment

| Capability | Direction | Merchant-facing action name | Template | Effect timing (illustrative — Q11 open) |
|---|---|---|---|---|
| `subscriptionTier` | free → paid | **Activar plan de pago** | §3.4 (immediate-effect, copy fixed — SET-M4, corrected again below) | Immediate — she's confirming a payment already arranged. |
| `subscriptionTier` | paid → free | Volver al plan gratis | §3.5 (deferred-effect) | Deferred — Product Owner's own illustrative example (`decision-log.md` D25): may land at the end of the current billing period. |
| `defaultSellingMode` | buttons → nfc | Cambiar a vender con tags | §3.4 (immediate-effect) | Immediate — offered only when `nfc ∈ registrationMode` (`decision-log.md` D27). |
| `defaultSellingMode` | nfc → buttons | Cambiar a vender con botones | §3.4 (immediate-effect) | Immediate. |

**`registrationMode`'s `nfc` entitlement is no longer its own row in this table, and no longer has a dedicated action anywhere in this document** (`decision-log.md` D27, superseding the relevant part of D25). It has no independent existence to toggle: `nfc ∈ registrationMode` is a pure read-time derivation from `subscriptionTier = paid`, so it changes automatically, as a side effect, whenever "Activar plan de pago" or "Volver al plan gratis" changes `subscriptionTier` — never through an action of its own. The earlier design's dedicated NFC-activation path (an activation code confirming a physical kit) is removed entirely, not merely relocated: D27 corrected the underlying assumption that kit possession was ever the thing granting the capability. What she can control directly is `defaultSellingMode` — which of her currently-available modes (always `buttons`; `nfc` only while `subscriptionTier = paid`) is her normal one — a distinct action, above.

**`loyaltyEnabled` is no longer its own row either, and no longer has a dedicated action anywhere in this document** (`decision-log.md` D40, retiring the capability outright rather than narrowing it). Unlike `nfc`'s derivation (D27), there is nothing here for Ana to configure even indirectly — Frequent Customers isn't an option she selects; it's a plan-level consequence. What used to be "Activar clientes frecuentes"/"Desactivar clientes frecuentes" — a real, explicit action with its own confirmation screen — is now nothing at all: no row, no button, no confirmation, anywhere in Configuración. The moment "Activar plan de pago" confirms, Frequent Customers is available; the moment "Volver al plan gratis" lands, it isn't — see §3.4/§3.5's corrected copy below.

Every action honors D25's two invariants identically: **never delete historical data**, and **business rules determine timing** (except `defaultSellingMode`, which carries no billing-cycle implication at all — see §2.3).

### 2.3 Why `defaultSellingMode`'s two directions are both immediate, with no pending-change structure (`decision-log.md` D27)

Unlike `subscriptionTier`, `defaultSellingMode` is not a commercial or billing capability — it's an operational fallback (`decision-log.md` D23) that Session-start already reads fresh, every time, alongside NFC Readiness. `decision-log.md` D25's deferred-timing rationale exists specifically to make a *commercial* change (one with billing-cycle implications, like a Paid→Free downgrade) honestly displayable before it lands; `defaultSellingMode` carries no such implication in either direction. Setting it to `nfc` or back to `buttons` changes nothing about what she's being charged, when, or under what plan — it only changes which mode Session-start resolves toward the next time she opens a Session, exactly the same way any other read of a Business-level fallback field already behaves.

This is why both directions — Botones → Etiquetas NFC and Etiquetas NFC → Botones — use the generic immediate-effect template (§3.4), never the deferred one (§3.5): there is nothing to defer. The change takes effect at her very next Session-open, automatically, with no separate scheduling mechanism and no pending-value/effective-date pair to track (`decision-log.md` D27 states this explicitly: this field "carries no pending-value/effective-date structure... an edit here takes effect immediately"). Nothing about `Session.operatingMode`'s own resolution changes as a result — D23's existing guarantee (resolved once, at Session-open, from `defaultSellingMode` plus NFC Readiness) already assumes `defaultSellingMode` can be read fresh at any moment; who's allowed to edit the fallback, or how often, was never part of what made that guarantee true.

**The `nfc` option is constrained, not offered unconditionally.** Per D27's own wording, this control only ever offers modes "available to her" — `buttons` always, `nfc` only while `subscriptionTier = paid`. A Free-tier merchant sees a single, un-choosable "Botones" row rather than a picker with a disabled option: there is nothing to pick between yet, and showing a visibly-disabled `nfc` option would invite exactly the kind of "why can't I tap this" confusion `global-principles.md`'s "technology should disappear" argues against. The moment `subscriptionTier` becomes `paid` — immediately, via "Activar plan de pago" — this control gains its second option with no separate unlock step of its own; the derivation in §2.2 already makes `nfc` available the instant `subscriptionTier` flips, so there's nothing left for this control to wait on.

**`defaultSellingMode`'s stored value is never written by any action other than its own two rows above.** Specifically, "Volver al plan gratis" (§2.2, §3.5) writes only to `subscriptionTier` — it never resets, clears, or otherwise touches `defaultSellingMode`. If a merchant's `defaultSellingMode` reads `nfc` at the moment a Paid→Free downgrade lands, it simply stays `nfc` in storage; `nfc` just stops being an available mode for Session-start to resolve into, per the derivation in §2.2, until she either returns to Paid or changes `defaultSellingMode` herself. This is a direct consequence of `defaultSellingMode` and `subscriptionTier` being two independent stored fields with two independent write paths (`decision-log.md` D25/D27) — no separate reset rule was ever needed, or written, to make this true.

### 2.4 When a deferred change actually lands (SET-M3 — resolved with a concrete mechanism, stated honestly as an addition, not a restatement)

A silent flip with zero acknowledgment would mean Ana only discovers a real change to her own business by noticing a row's label is different than she remembered. Instead: the first time Configuración's main view (§3.3) is opened after a pending change's effective date has passed, that capability's row carries a one-time, dismissible acknowledgment line above it ("Tu plan cambió a Gratis el 14 de agosto"), styled the same low-ceremony way `home.md` §3.12's close-summary states a fact rather than asking a question. Shown exactly once — the next Configuración open after that renders the row as an ordinary current-state row. Whether this should also surface anywhere *outside* Configuración (a badge, a notification) stays open (§8, item 4) — this section only resolves the in-surface acknowledgment.

## 3. Low-fidelity wireframes

Conventions inherited from `home.md`/`inventory.md`/`onboarding.md`: `[ ]` = tappable, plain text = passive/informational.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
└───────────────────────────────┘
```

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
└───────────────────────────────┘
```

### 3.3 Entry — session-controls sheet, Home idle/cold-start/Event-active-no-Session states (new row)
```
┌───────────────────────────────┐
│ Nahui                        ▾ │  dimmed, still visible underneath
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  [       Configuración        ] │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
No "Cerrar sesión" row — there is no open Session to close.

### 3.3a Configuración — vista principal (sin cambio pendiente)
```
┌───────────────────────────────┐
│ ← Hoy                          │
│  Configuración                  │
│  Tu plan: Gratis                 │
│  [ Activar plan de pago ]        │
│  Cómo vendes normalmente:         │
│  Botones (vender con tags         │
│  requiere el plan de pago)        │
└───────────────────────────────┘
```
No `defaultSellingMode` control shown while `subscriptionTier=free` — nothing to choose between yet, since `nfc` isn't in her capability set (§2.3). The moment "Activar plan de pago" confirms, this row gains a real control (see the Paid-tier state below).

**Paid-tier state (new — this document previously never drew this state explicitly):**
```
┌───────────────────────────────┐
│ ← Hoy                          │
│  Configuración                  │
│  Tu plan: Pago                   │
│  [ Volver al plan gratis ]       │
│  Cómo vendes normalmente:         │
│  Botones                          │
│  [ Cambiar a vender con tags ]    │
└───────────────────────────────┘
```

**Paid-tier state, `defaultSellingMode = nfc` (mirror — completes the pair of reachable Paid-tier states):**
```
┌───────────────────────────────┐
│ ← Hoy                          │
│  Configuración                  │
│  Tu plan: Pago                   │
│  [ Volver al plan gratis ]       │
│  Cómo vendes normalmente:         │
│  Con tags                         │
│  [ Cambiar a vender con botones ] │
└───────────────────────────────┘
```
Same shape as the Botones-current-mode state above, mirrored — the current
mode reads "Con tags," and the button offers the only other available
option, "Botones." Reached by any Paid-tier merchant whose
`defaultSellingMode` currently reads `nfc`, whether because she just
switched it here (§3.4's "Cambiar a vender con tags" copy variant) or
because it arrived that way another way (e.g. the demo-path seed,
`onboarding.md` §2.2) — this view is a pure read of current state,
indifferent to how it got there.

**Frequent Customers has no row anywhere in this view, in either tier** (`decision-log.md` D40) — structurally absent, not a demoted sub-note. A Free-tier merchant sees nothing suggesting she could turn it on; a Paid-tier merchant sees nothing suggesting she needs to. Whether it's active is answered entirely by "Tu plan," one line above. If she wants to see what it's actually collecting, that lives in Resultados' "Tus clientes" (`reports.md` §3.6/§3.12/§3.13), not here.

Once `subscriptionTier=paid`, the mode row becomes a real, tappable control — "Botones" or "Con tags," whichever `defaultSellingMode` currently is, with a button offering the other option (§2.2, §2.3, `decision-log.md` D27).

### 3.4 Confirmación de efecto inmediato (generic template — shared by five actions)
```
┌───────────────────────────────┐
│ ← Configuración                 │
│  {título de la acción}           │
│  {copy — what changes, plainly}  │
│  [   {acción} ahora   ]           │
└───────────────────────────────┘
```

**Copy variant — Activar plan de pago (SET-M4, corrected — "quiénes" → "cuántas"; joint-gating fix below; `nfc` benefit disclosure added per `decision-log.md` D27):**
```
Activar plan de pago
Vas a poder vender con tags, además de botones. También vas
a poder ver cómo te va por cada bazar, y la sección de tus
clientas frecuentes y ocasionales en Resultados — esta última
te va a mostrar datos reales en cuanto tengas compras
registradas.
Esto se activa confirmando tu pago fuera de la app — no se
te cobra nada aquí. Si ya lo arreglaste, confirma abajo.
[ Confirmar y activar ]
```
States plainly that this activates by confirming a payment already
arranged outside the app — channel unnamed (correctly out of scope, §8
item 2), existence stated plainly. Uses "cuántas... y cuántas" — the same
count/category framing matching `reports.md`'s RPT2-MAJ1-corrected
phrasing — not "quiénes" (identity-implying). **Reviewer finding, fixed
(original, `decision-log.md` D22):** the earlier version promised
segmentation as an unconditional consequence of activating the paid plan
alone, contradicting D22's original rule that Customer Segmentation
required `subscriptionTier=paid` **and** `loyaltyEnabled=true` together.
Copy conditioned it explicitly ("si además tienes activo..."). **Further
corrected (`decision-log.md` D34, 2026-08-08):** D22's joint-gate rule is
itself now corrected — the "Tus clientes" section in Resultados is visible
to any paid merchant regardless of `loyaltyEnabled`, the same gate
"Rendimiento por bazar" already uses. **`nfc` benefit disclosure**
(`decision-log.md` D27) is unaffected by either correction and stays
as-is: this is still the single action that grants `nfc` capability, a
real consequence of this tap the pre-D27 copy never mentioned.
**Further corrected (`decision-log.md` D40, 2026-08-09):** the earlier
phrase "con el seguimiento de clientas activo" implied a second,
independent toggle gating whether these counts ever populate — that
toggle (`loyaltyEnabled`) is retired. This single tap is now the entire
mechanism: Frequent Customers becomes fully available the instant this
confirms, with nothing else for Ana to turn on afterward.

**"Activar clientes frecuentes" and "Desactivar clientes frecuentes" — retired entirely, not corrected (`decision-log.md` D40).** Both actions no longer exist anywhere in this document. Kept here as a one-line record so the trail stays visible: D22 first introduced them as a real toggle; D34 corrected their copy to stop framing `loyaltyEnabled` as a Resultados-visibility precondition; D40 removes them altogether, since there is no longer a capability for either action to act on. Frequent Customers now turns on and off exactly when `subscriptionTier` does — see "Activar plan de pago" (above) and "Volver al plan gratis" (§3.5) for where that consequence is now disclosed.

**Copy variant — Cambiar a vender con tags (new — `decision-log.md` D27):**
```
Cambiar a vender con tags
Desde tu próxima sesión, vas a empezar vendiendo con tags,
siempre que tengas mercancía etiquetada lista. Si no tienes
tags listos ese día, vendes con botones sin problema.
[ Cambiar ahora ]
```

**Copy variant — Cambiar a vender con botones (new — `decision-log.md` D27):**
```
Cambiar a vender con botones
Desde tu próxima sesión, vas a empezar vendiendo con
botones. Puedes volver a cambiarlo cuando quieras.
[ Cambiar ahora ]
```

### 3.5 Confirmación de efecto diferido (generic template — one action)
```
┌───────────────────────────────┐
│ ← Configuración                 │
│  {título}                        │
│  {copy — what changes, and when} │
│  [    Confirmar cambio    ]      │
└───────────────────────────────┘
```

**Copy variant — Volver al plan gratis (`nfc` consequence disclosure added — `decision-log.md` D27):**
```
Volver al plan gratis
Tu plan de pago sigue activo hasta el final de tu periodo actual,
el 14 de agosto. Después de esa fecha ya no vas a poder vender
con tags — vas a vender con botones —, dejas de ver cómo te va
por cada bazar, y clientes frecuentes deja de estar disponible:
no se junta información nueva de tus clientas ni se muestra en
Resultados. No perdemos tu historial.
[ Confirmar cambio ]
```
The date shown is illustrative — Q11 hasn't settled the exact deferred-timing rule yet. **New, previously-undisclosed consequence (`decision-log.md` D27):** under the pre-D27 model, `nfc` was independent of plan, so downgrading never touched it; now `nfc` is derived from `subscriptionTier`, so downgrading withdraws it too, at the same effective date. Already-assigned NFCTags stay inert but intact (D25's unchanged never-delete-history invariant) — the copy states this plainly rather than leaving her to discover it only once she can no longer sell with tags. **Further corrected (`decision-log.md` D40, 2026-08-09):** under the pre-D40 model, downgrading only ever withdrew "Tus clientes"'s *visibility* — `loyaltyEnabled` was independent, so Claims kept accumulating invisibly after a downgrade. That's no longer true: collection and visibility now share the identical gate, so downgrading genuinely stops Frequent Customers as a whole. The copy above states this plainly, not only the older "dejas de ver" framing.

### 3.6 Configuración — vista principal (con cambio pendiente)
```
┌───────────────────────────────┐
│ ← Hoy                          │
│  Configuración                  │
│  Tu plan: Pago (cambia a          │
│  Gratis el 14 ago)                │
│  [ Cancelar cambio ]              │
│  Cómo vendes normalmente:         │
│  Botones                          │
│  [ Cambiar a vender con tags ]    │
└───────────────────────────────┘
```

### 3.7 Cancelar cambio pendiente — confirmar
```
┌───────────────────────────────┐
│ Configuración                   │  dimmed, still visible underneath
│  ¿Cancelar el cambio a plan       │
│  gratis? Tu plan de pago sigue     │
│  como está.                        │
│      [ No ]   [ Sí, cancelar ]     │
└───────────────────────────────┘
```

### 3.9 Guardando cambio — near-instant / slow (shared by every action's actual write)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│  ▢▢▢▢▢▢▢▢▢▢▢▢ (fila atenuada)      │        │      Guardando…                │
└───────────────────────────────┘        └───────────────────────────────┘
```
Same near-instant/slow convention as `inventory.md` §3.10, `events.md` §3.9, `home.md` §3.8c, `onboarding.md` §3.5.

### 3.10 Error al guardar cambio
```
┌───────────────────────────────┐
│  No pudimos guardar tu cambio.    │
│  Intenta de nuevo.                 │
│      [   Reintentar   ]            │
└───────────────────────────────┘
```
A retried save replays the same already-confirmed toggle, never re-asking her to re-confirm it.

## 4. Interaction flow (summary)

```
From any Home header state (home.md §3.3–§3.6, including its §3.6a variants,
idle/cold-start/Event-active-no-Session, and §3.7–§3.11a active-Session alike — see §2.1 for the four
states where it's deliberately absent: §3.1/§3.2/§3.12/§3.14):
  tap header "▾" → session-controls sheet
    → sheet shows "Configuración" (§3.3), plus "Cerrar sesión" only if a
      Session is open
    → tap Configuración → resolve (§3.1/§3.2) → vista principal (§3.3a, or
      §3.6 if 1+ pending change exists)

From the main view, tap any action row:

  Activar plan de pago / Cambiar a vender con tags /
  Cambiar a vender con botones
    → confirmación de efecto inmediato (§3.4) → {acción} ahora
        → guardando (§3.9) → error (§3.10) → Reintentar
        → success → back to vista principal, row updated, no pending state

  Volver al plan gratis
    → confirmación de efecto diferido (§3.5) → Confirmar cambio
        → guardando (§3.9) → error (§3.10) → Reintentar
        → success → back to vista principal (§3.6), pending shown

From a pending-change row (§3.6):
  Cancelar cambio → confirmar (§3.7)
    → No → back to §3.6, untouched
    → Sí, cancelar → guardando (§3.9) → error (§3.10) → Reintentar
    → success → back to vista principal (§3.3a), no pending state

Back arrow ("← Hoy") from anywhere in Configuración → Home, resolved exactly
per home.md §2 (resumes an active Session if one exists; otherwise idle/cold
start).
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Entry — session-controls sheet, Home idle/cold-start/Event-active-no-Session states (new row)
4. Configuración — vista principal, sin cambio pendiente
5. Confirmación de efecto inmediato — generic template (three copy variants: Activar plan de pago — SET-M4/D34/D40-corrected — and the two `defaultSellingMode` variants; "Activar/Desactivar clientes frecuentes" retired entirely per `decision-log.md` D40)
6. Confirmación de efecto diferido — generic template (Volver al plan gratis)
7. Configuración — vista principal, con cambio pendiente
8. Cancelar cambio pendiente — confirmar
9. Guardando cambio — near-instant / slow (shared, every action)
10. Error al guardar cambio

## 6. Minimum step count

| Scenario | Taps | Why it can't be fewer |
|---|---|---|
| Reach Configuración from anywhere in Home | 2 (▾ → Configuración) | Single deliberate tap to open the sheet, same shape as reaching Cerrar sesión today, now available from every Home header state per §2.1. |
| Activar plan de pago | 2 (Activar plan de pago → Confirmar y activar) | One tap to open the action, one to confirm the self-attestation — nothing beyond that to type once the payment itself has already happened elsewhere. |
| Cambiar a vender con tags / Cambiar a vender con botones | 2 | Pure toggle — unlike the retired NFC-activation path, nothing left in this document requires typing anything. |
| Volver al plan gratis | 2 | Deferred effect doesn't change the tap count — only when the write takes effect. |
| Cancelar cambio pendiente | 2 | Mirrors `home.md`'s own destructive-action confirmation floor. |

Every action in this table now shares an identical 2-tap floor. The one previous exception — Activar venta con tags's code-entry requirement — is gone along with the path itself (`decision-log.md` D27): `defaultSellingMode`'s two directions are pure toggles like every other immediate-effect action, with no real fact left to type. Configuración is now the one document in this family where every merchant-initiated action, without exception, costs exactly two taps — open the action, confirm it.

## 7. Automation opportunities

- Which action button shows per capability row — always exactly the one valid opposite of the current stored value.
- The pending-change banner — a pure read of stored pending-value/effective-date data.
- Effective-date computation — produced by whatever business rule Q11 eventually settles, never typed or chosen by Ana herself.
- A capability with a pending change never offers a second, stacking action.
- Which `defaultSellingMode` direction is offered — computed automatically from `nfc ∈ registrationMode`, never something Ana has to unlock separately.
- The one-time landing acknowledgment (§2.4) is shown automatically, never requiring her to remember she had a pending change.
- Whether Frequent Customers is available at all — computed automatically from `subscriptionTier`, with no capability of Ana's own to set (`decision-log.md` D40).

## 8. Open questions

None of the items below block this document's completion.

1. **Q11** (`company/business-decisions.md`, Open) — the specific per-transition immediate/deferred assignment in §2.2's table is illustrative, not final, blocked on a pricing/billing-cycle model that doesn't exist in the Foundation yet.
2. **The specific external-payment channel is deliberately left unnamed** in §3.4's "Activar plan de pago" copy — a business-model detail to fill in once decided.
3. **Required cross-document dependency, not silently assumed:** §2.1 extends `home.md`'s "▾" affordance to every Home header state except §3.1/§3.2/§3.12/§3.14 — a small, additive amendment to `home.md`'s own approved wireframes (same category as `decision-log.md` D23's amendment to `inventory.md`), flagged for Main/`reviewer` to route, not performed here.
4. **Whether the pending-change-lands acknowledgment (§2.4) should ever surface anywhere outside Configuración itself** (a badge, a notification) — not designed here, no evidence yet the in-surface acknowledgment is insufficient.
5. **Resolved, kept for continuity — a `defaultSellingMode` control is now designed here.** `decision-log.md` D27 extended self-service editability to this field: §2.2/§2.3/§3.4/§3.6 now specify it directly, as an immediate-effect action with no pending-change structure, constrained to whichever modes `subscriptionTier` currently makes available. The gap this item originally flagged (D25/Q5 resolving exactly three capabilities, none of which was `defaultSellingMode`) is closed — kept here, marked resolved, so the record of what was once genuinely out of scope stays visible rather than silently disappearing.

## 9. Principle justification

**global-principles.md:**
- *"Never ask twice"* — a pending change's target capability is never re-asked when cancelling; the landing acknowledgment (§2.4) is shown exactly once; `defaultSellingMode`'s own value is never asked twice either — Session-start (`home.md` §2/§3.6a) already reads whatever she last set here, and setting it here never re-confirms a fact Session-start would otherwise have had to ask about.
- *"Business language before technical language"* — every screen uses "plan," "cómo vendes," never `subscriptionTier`, `registrationMode`, `defaultSellingMode`, or "entitlement," anywhere. "Clientes frecuentes" no longer appears as an action name in this document (`decision-log.md` D40) — only as a description of what "Activar plan de pago"/"Volver al plan gratis" affect.
- *"Capture business truth once, reuse it forever"* — `nfc`'s availability is captured exactly once, as `subscriptionTier`, and never re-captured as a second, independent fact anywhere in this document (`decision-log.md` D27) — the earlier design's NFC activation code confirmed the same underlying truth a second time, in a second place; removing it is this principle applied more completely, not a new application of it.
- *"The best interface stays out of the merchant's way"* — a failed capability save never drops an already-confirmed toggle, including a `defaultSellingMode` change (§3.10); cancelling a pending change is always reachable and never destructive to anything but the pending change itself (§3.7).
- **The SET-M1 fix, stated as its own principle-level point:** every piece of copy describing what client-tracking reveals is worded as a count/category ("cuántas... son frecuentes y cuántas ocasionales"), never an identity claim ("cuáles"/"quiénes son") — the same correction `reports.md` already made once (RPT2-MAJ1), applied consistently across every instance in this document, including the one a prior remediation round briefly reintroduced while fixing SET-M4.

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream, never asked mid-flow)* — Configuración is the one deliberate exception D25/D27 carve out for merchant-initiated, explicit self-service change; no other screen re-asks any of the capabilities or settings managed here.
- *#4 (internal-only entities never leak into user-facing language)* — no capability is ever named by its technical field anywhere.
- *#6 (one-way dependency direction)* — this document only writes to Identity's Business Capabilities; it never designs a Selling/Inventory/Intelligence screen of its own.

**brand-guide.md:**
- *Tone — "warm, direct, respects the vendor's intelligence"* — every deactivation confirmation states plainly what's lost without a warning-styled dialog; "Activar plan de pago"'s restored copy states plainly that this activates by confirming a payment arranged elsewhere, rather than omitting that fact.

## 10. Decisions made

- Configuración hangs off Home's header "▾," extended to every Home state that has a persistent header (cold start, idle, Event-active-no-Session, and every active-Session state), not only the active-Session one — required because what it manages matters on days she isn't actively selling too.
- The entry point is explicitly absent from exactly four Home states (`home.md` §3.1/§3.2/§3.12/§3.14), each with its own one-line reason.
- **The dedicated "Activar venta con tags" path (activation-code entry, reusing `onboarding.md` §3.4–§3.4b) is removed entirely, not merely restructured** (`decision-log.md` D27) — the physical-kit-confirmation mechanism it modeled never actually granted the capability; `nfc` is a pure derivation from `subscriptionTier`, so there is nothing left for a dedicated activation path to do.
- **A new `defaultSellingMode` control (Botones ↔ Etiquetas NFC) is added** (`decision-log.md` D27), constrained to whichever modes `subscriptionTier` currently makes available — always `buttons`; `nfc` only while `subscriptionTier = paid`. This is the field's first-ever self-service edit surface; it was Onboarding-only before D27 (`decision-log.md` D19/D23).
- **`defaultSellingMode`'s two directions are both immediate, with no pending-value/effective-date structure at all** — unlike `subscriptionTier`, it carries no commercial or billing-cycle implication for D25's deferred-timing rationale to apply to (§2.3, `decision-log.md` D27). It uses the generic immediate-effect template (§3.4) exactly like a toggle, never the deferred template (§3.5).
- "Activar plan de pago" stays in the generic immediate-effect template, with copy stating plainly that it activates by confirming a payment arranged outside the app, using count/category framing ("cuántas... y cuántas"), never identity-implying framing ("quiénes son"/"cuáles"). Its consequence now also includes `nfc` becoming available automatically the moment this confirms (`decision-log.md` D27) — a fact worth surfacing honestly in this action's own copy, not left implicit, since it's a real new capability she gains from the same tap, not only the segmentation/reporting benefits the existing copy already states.
- All actions now share exactly two confirmation shapes (immediate-effect, deferred-effect), with no exception at all — the one previous exception (NFC activation's code-entry path) is removed along with the path itself (`decision-log.md` D27), and `defaultSellingMode`'s two new directions are ordinary immediate-effect actions, not a third shape.
- No capability with a pending change offers a second, competing action.
- **"Volver al plan gratis" now discloses its `nfc` consequence explicitly, not only its Resultados/segmentation consequence** — downgrading to Free also withdraws `nfc` availability at the effective date (`decision-log.md` D27), since `nfc` is derived from `subscriptionTier`. Already-assigned NFCTags stay inert but intact, per D25's unchanged never-delete-history invariant; the copy states this plainly rather than leaving her to discover it only once she can no longer sell with tags.
- Cancelling a pending change gets a lightweight, single-step confirm.
- No payment/checkout flow and no bazaar-recommendation logic designed anywhere in this document. **`defaultSellingMode` is no longer excluded** — `decision-log.md` D27 brought it into scope; see the `defaultSellingMode`-control bullet above.
- The gap between "a pending change lands" and "Ana is told" is closed with a concrete, one-time, in-surface acknowledgment (§2.4) — whether this also needs to surface outside Configuración stays open (§8, item 4).
- **`decision-log.md` D34 corrects the framing of "Activar clientes
  frecuentes" (§3.4), "Desactivar clientes frecuentes" (§3.4), and
  "Activar plan de pago" (§3.4).** None of these actions changed — same
  six actions, same templates, same tap counts — only their copy is
  corrected to stop presenting `loyaltyEnabled` as a joint precondition,
  alongside `subscriptionTier=paid`, for Resultados' "Tus clientes"
  section to show anything at all. That section is now visible to any
  paid merchant regardless of `loyaltyEnabled` (`reports.md`, amended in
  the same pass) — `loyaltyEnabled` only ever gated real Claim collection,
  and its copy now says so plainly instead of implying it gates
  visibility. "Desactivar clientes frecuentes" is also corrected to state
  accurately that already-accumulated segmentation data isn't hidden or
  erased when she turns collection off, consistent with D25's
  never-delete-historical-data invariant.
- **`decision-log.md` D40 retires "Activar clientes frecuentes"/"Desactivar clientes frecuentes" (§3.4) entirely, superseding the D34 bullet above.** `loyaltyEnabled` no longer exists as a Business-level field; Frequent Customers is now a pure, automatic consequence of `subscriptionTier`, the identical shape D27 already established for `nfc`. Narrows Configuración from six actions to four (§2.2); "Activar plan de pago"'s and "Volver al plan gratis"'s copy now state the fuller consequence (Frequent Customers as a whole, not only Resultados visibility).

## 11. Future considerations

- Once Q11 resolves, assign `subscriptionTier`'s two directions to their actual immediate/deferred treatment and replace the illustrative examples in §3.4/§3.5.
- Whether the pending-change-lands acknowledgment needs an ambient signal beyond the in-surface one (§8, item 4).
- The `home.md` amendment this document specifies but doesn't perform (§2.1, §8 item 3) needs its own small pass through `home.md` directly.
- The actual payment-collection mechanism for the paid plan (§8, item 2) — a future Business Decision.
