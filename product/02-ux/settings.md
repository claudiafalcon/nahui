# Configuración — UX Specification

Status: Approved. Full UX Remediation cycle complete across three rounds (SET-M1, SET-M2, SET-M3, SET-B1, SET-M4). **[Amended 2026-08-14 — see settings.changelog.md#status-full-ux-remediation-cycle]**
**Amended for `decision-log.md` D27** (NFC capability derives from `subscriptionTier`, not an independent entitlement): the dedicated "Activar venta con tags" activation-code path is retired entirely; a new `defaultSellingMode` control ("Cambiar a vender con tags" / "Cambiar a vender con botones") is added. **[Amended 2026-08-14 — see settings.changelog.md#status-d27-nfc-capability-derivation]**

**Further amended 2026-08-08 (`decision-log.md` D34 — Customer Segmentation
visibility gate corrected):** Resultados' "Tus clientes" section gates on
`subscriptionTier=paid` alone, not jointly with `loyaltyEnabled`. **[Amended
2026-08-14 — see
settings.changelog.md#status-2026-08-08-d34-customer-segmentation-gate-corrected]**

**Further amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled` retired):** Frequent Customers becomes automatically available the instant `subscriptionTier` reads `paid`, and unavailable when it reads `free` again — no Business-level field, screen, or action of Ana's own turns it on or off directly. Configuración narrows from six actions to four. **[Amended 2026-08-14 — see settings.changelog.md#status-2026-08-09-d40-loyalty-enabled-retired]**

**Further amended 2026-08-09 (Product Owner decision):** the Configuración entry-point trigger is a top-right "⋯" icon (not the header's "▾"); the sheet's Configuración row carries a gear icon ("⚙"). **[Amended 2026-08-14 — see settings.changelog.md#status-2026-08-09-configuracion-entry-point-relocated]**

**Further amended 2026-08-13 (Product Owner decision):** a fifth action, "Cerrar sesión" (§2.5/§2.5a, new "Tu cuenta" section, §3.8/§3.8a/§3.8b), ends this device's verified session without touching the Business or its data. **[Amended 2026-08-14 — see settings.changelog.md#status-2026-08-13-cerrar-sesion-added]**

**Further amended 2026-08-14 (`decision-log.md` D46):** "Cambiar a vender con
tags" is now a real, three-way transition — handing off into `inventory.md`
§3.14 (Asignar Tags) if untagged inventory exists, into
register-merchandise-first guidance if none has ever been received, or
leaving her on Configuración's own vista principal unchanged if she's
already fully tagged. **[Amended 2026-08-14 — see
settings.changelog.md#status-2026-08-14-d46-tag-assignment-auto-entry]**

**Further corrected, same day (architect ruling — see `decision-log.md`
D46's own Addendum):** §2.6 writes `defaultSellingMode` and hands off a bare
entry marker only, never reading Inventory-owned state directly — the
routing decision lives entirely in `inventory.md` §2's own resolution. An
already-fully-tagged merchant lands on `inventory.md`'s plain Catalog view
(§3.4), not back on Configuración's vista principal. **[Amended 2026-08-14 —
see
settings.changelog.md#status-2026-08-14-d46-addendum-architect-correction]**

**Further amended 2026-08-14 (Product Owner-raised — `home.md`'s "Cerrar
jornada de venta" discoverability fix, matching correction):** during an
active Selling Session, the header's session-controls trigger is a gear
icon ("⚙") that routes directly into Configuración's resolve step — no
intermediate sheet; "Cerrar jornada de venta" no longer routes through
this trigger at all (see `home.md` §3.7 for its own new direct header
affordance). Outside an active Session, the entry point and sheet
(§2.1/§3.3) are unchanged. `ux-critic` clean (4 Minor + 1 Suggestion,
all fixed). `reviewer` clean (2 findings, both fixed). Folded back into
Approved. **[see
settings.changelog.md#status-2026-08-14-active-session-gear-direct-nav]**
**Further amended 2026-08-15 (Product Owner-raised — `home.md`'s "Cerrar
jornada de venta" discoverability fix, extended to every Home header
state):** outside an active Session too, the entry point is now a gear
icon ("⚙") that routes directly into Configuración's resolve step — no
intermediate sheet. The non-Session sheet (§3.3) is retired — it was
already single-item ("Configuración" only), the same condition that
retired the active-Session sheet a day earlier (see `home.md`'s own
status header for the fuller reasoning). Configuración's entry point now
has one uniform shape across every Home state with a persistent header.
`ux-critic` clean (no findings). `reviewer` clean (no Blockers, no
Important findings). Folded back into Approved.
**[see settings.changelog.md#status-2026-08-15-non-session-gear-direct-nav]**

Scope: `Configuración`, the merchant-facing surface for the Business Capabilities `decision-log.md` D25/D27/D40 leave merchant-self-service: `subscriptionTier` (Free ↔ Paid) — two actions (both directions), a reusable "pending change" indicator, and a way to cancel a pending change before it lands — plus `decision-log.md` D27's `defaultSellingMode` control (Botones ↔ Etiquetas NFC), constrained to whichever modes `subscriptionTier` currently makes available: **four actions total**, not six. Both `defaultSellingMode` directions use the same immediate-effect template `subscriptionTier`'s "activate" direction already uses (§2.3, §3.4) — the only real difference is that neither carries a pending-value/effective-date pair, since the field has no billing-cycle implication for D25's deferred-timing rationale to apply to, not a differently-shaped UI. `registrationMode`'s `nfc` entitlement is no longer an independently self-service-toggleable capability of its own (D27 superseded that part of D25) — it is a pure read-time derivation from `subscriptionTier = paid`, so it has no dedicated action or row here; it changes only as an automatic consequence of the `subscriptionTier` actions below. **`loyaltyEnabled` is retired outright, not merely absent from self-service scope** (`decision-log.md` D40) — there is no Business-level field left to toggle, self-service or otherwise; Frequent Customers as a whole is entitled purely by `subscriptionTier`, present in full on Paid and structurally absent on Free, with no action of Ana's own anywhere in this document or any other. **Not a fifth nav tab** — per `decision-log.md` D13 and `information-architecture.md`'s "Onboarding and Settings" section, Configuración hangs off the existing session-controls affordance already specified in `home.md` — originally the header's "▾," relocated 2026-08-09 to a top-right "⋯" icon opening a sheet, then (2026-08-14, active Session; 2026-08-15, every other Home state) replaced by a direct gear icon ("⚙") with no intermediate sheet at all (Product Owner decisions; see status header above and `home.md`'s own status header/§10 for the full reasoning) — as of 2026-08-15, this single direct shape applies uniformly across every Home state with a persistent header (§2.1). This is the last of the five merchant-facing experiences to be designed (`product/02-ux/CLAUDE.md`). Implementation-independent — low-fidelity only, no visual design. A fifth action, added 2026-08-13, sits outside this four-capability count entirely: "Cerrar sesión" (§2.5) is an Identity-context, `User`-level action (RFC 0007) — it has no Business Capability to represent, changes nothing about her plan or how she sells, and is never conditioned on `subscriptionTier` or any pending change. It's placed in its own "Tu cuenta" section, not counted among, or confused with, the four capability actions above.

Out of scope by explicit instruction:
- **No payment/checkout flow of any kind.** `company/CLAUDE.md`'s non-goals state "Payments/checkout — out of scope, do not build." Activating the paid plan here flips `subscriptionTier`, exactly as D25 resolves it — it never shows a price, a card field, or any payment-processing step. By what mechanism money actually changes hands, if any, is a distinct, unnamed question this document doesn't invent an answer to.
- **No bazaar-recommendation logic, no multi-user features** (`company/backlog.md` #3).
- **The specific per-transition timing rule (Q11) is not decided here.** Which of `subscriptionTier`'s two directions (immediate vs. deferred, since `decision-log.md` D27 already settled `defaultSellingMode` as immediate-only with no billing-cycle implication, and `decision-log.md` D40 retires `loyaltyEnabled` entirely, leaving no third capability for Q11 to apply to) is immediate vs. deferred, and the exact deferred rule, depends on a pricing/billing-cycle model that doesn't exist in the Foundation yet (`company/business-decisions.md` Q11, Open). This document specifies both UI shapes generically (§3.4/§3.5) with today's best-available illustrative assignment, not a final table.
- **No multi-device session management.** No way to see other devices currently signed in, no remote sign-out, no "también estás conectada en..." list. This is a single-device action only — it reads and writes the same device-level session fact `authentication.md §2.1` already checks silently on every app open, nothing more.
- **No real token/credential invalidation mechanism designed here.** Same infrastructure/domain split `authentication.md §0`/RFC 0007 §5 already draw for the sign-in side — this document specifies only the merchant-visible consequence (this device stops holding a valid session), never how that's actually implemented.
- **No switching or remembering multiple accounts on one device.** RFC 0007 leaves open whether a single verified phone may ever found more than one Business (its own "Open items," item 1) — this document doesn't answer that, and offers no account-picker or "cambiar de cuenta" affordance of any kind.

## 1. Merchant goal

Ana doesn't think of this as "settings" the way a phone's Settings app works — she thinks of it as the handful of real business decisions she's already made (sell free or paid, sell with tags or buttons) staying changeable, honestly, without her needing to uninstall anything or ask someone else to flip a switch for her. `decision-log.md` D25 exists precisely because "sell free or paid" was originally fixed at Onboarding; this document is what makes Q5's "yes, self-service, both directions, any time" resolution real for her. The second — sell with tags or buttons — reaches the same self-service treatment by a separate route: `decision-log.md` D27 extends it here, after D19/D23 had it Onboarding-only. **Whether she tracks her regulars at all is no longer a decision Ana makes anywhere in this document** — `decision-log.md` D40 retires `loyaltyEnabled` and makes Frequent Customers a pure, automatic consequence of "sell free or paid": present in full the moment `subscriptionTier` reads `paid`, entirely absent while it reads `free`, with no separate switch of its own.

Nothing here is time-critical the way `home.md`'s <3s bar is (`company/backlog.md` #1) — there's no customer waiting while she's in Configuración. Same posture `inventory.md` §1, `events.md` §1, and `onboarding.md` §1 already establish for their own non-urgent contexts: not urgent isn't license to pad it with friction, or to under-explain a decision that involves money or her clientele's data.

This document holds two things in tension, deliberately:

- **Activating something should cost her almost nothing** — nothing is put at risk by turning a capability on.
- **Turning something off or downgrading deserves one deliberate, honest beat** — not a wall of ceremony, but a real moment where she sees what she's giving up and is reassured about what she isn't losing (her history).

Two of the four actions below carry a real, necessary fact beyond a toggle, and the design has to protect them even while every other action stays a clean single-tap-to-confirm.

A fifth, differently-shaped concern joins these two as of 2026-08-13: whether *this phone, on this device* stays recognized by Nahui at all. It's not a business decision the way the four above are — it doesn't change her plan or how she sells — but it deserves the same honest, deliberate-beat treatment as turning something off, for the same reason: getting it wrong (reading as data loss) would break trust in exactly the way this document's whole second bullet above already exists to prevent.

## 2. Resolution / decision logic

### 2.1 Where the entry point lives (SET-M2 — corrected back to the verified-clean version; entry-point icon relocated 2026-08-09, Product Owner decision; direct-gear shape applied 2026-08-14 to the active-Session state, extended 2026-08-15 to every remaining Home state — see status header)

Configuración is not a nav tab. Per `decision-log.md` D13 and `information-architecture.md`'s "Onboarding and Settings" section, it hangs off Home's own header — originally rendered at the header's "▾," relocated 2026-08-09 to a top-right "⋯" icon (Product Owner decision, reasoned in full in `home.md`'s own status header and §10), then replaced entirely — in two steps, a day apart — by a direct gear icon ("⚙") with no intermediate sheet: first for the active-Session state (2026-08-14), then for the remaining four non-Session states (2026-08-15). **As of 2026-08-15, that entry point has one uniform shape across every Home state with a persistent header — see below, and `home.md`'s own status header/§2/§10 for the full reasoning, including why the earlier one-day divergence between the two shapes is now corrected, not merely superseded.** This document extends the affordance to render anywhere Home shows a persistent header at all — not only the ambient "`[Venue] · Día N`" header of an active Session (`home.md` §3.7–§3.11a), but also the plain "Nahui" heading shown during cold start, idle, and Event-active-no-Session states (`home.md` §3.3–§3.6, including the §3.6a Session-start-moment variants rendered on top of §3.4/§3.5/§3.6). This is deliberate, not an oversight: what's managed here — her plan and how she sells — is meaningful to check or change whether or not she happens to be selling that particular day — precisely the scenario `onboarding.md`'s "Out of scope" preamble names as "very likely the most common real-world path" (subscribing to the paid plan weeks after choosing "Empezar gratis," with no reason to have a Session open at that moment) — restated again, in different words, at `onboarding.md` §8 item 4. Gating Configuración behind "only reachable while a Session is open" would make it unreachable on the many days she doesn't sell at all, and would misuse a real business event (Session-start, which timestamps hours worked — `home.md` §10) for a non-selling errand.

Concretely:

- **Everywhere a persistent header exists — active Session or not**
  (`home.md` §3.7–§3.11a for an active Session; §3.3–§3.6, including its
  §3.6a variants, otherwise): the header's gear icon ("⚙") routes directly
  into this document's resolve step (§3.1/§3.2) → vista principal
  (§3.3a/§3.6) — **no intermediate sheet, in either case.** "Cerrar
  jornada de venta" never shares a trigger with Configuración at all
  during an active Session — it's a direct, always-visible header button
  of its own (`home.md` §3.7), reached and behaving exactly as before
  (§3.11/§3.11a's interlock, unchanged). Outside an active Session, there
  is no second action for the gear icon to have ever shared a trigger
  with — Configuración was always the only thing behind it.
- **Both sheets that used to sit behind this trigger are retired, in two
  steps a day apart.** During an active Session, the two-entry sheet
  (`home.md` §3.7a) was retired 2026-08-14: once "Cerrar jornada de
  venta" moved out to its own header button, it would have held exactly
  one item, and a single-item menu adds a tap without representing a real
  choice. **The non-Session sheet (`home.md` §3.6c) is retired 2026-08-15
  by the identical reasoning, corrected from this document's own earlier
  position:** it was already single-item — "Configuración" only, since
  none of §3.3–§3.6 has an open Session's "Cerrar jornada de venta" to
  sit beside it — the same condition that retired the active-Session
  sheet a day earlier. The original 2026-08-14 amendment kept this sheet
  on the reasoning that it was "a deliberate divergence, not an
  inconsistency" — but that reasoning only ever established that
  Configuración should stay reachable from these four states (a real,
  still-correct point, argued in full above), never that the *sheet
  shape specifically* should. It never separately asked whether the
  sheet still represented a real choice once isolated to its own single
  entry. It didn't, and once the Product Owner compared the two live
  header states directly, there was no longer a principled basis for the
  divergence to continue. No sheet remains anywhere in this document's
  own entry point.

**This is deliberately absent from four Home states — stated explicitly, not silently omitted:**

- **`home.md` §3.1/§3.2 (Resolving — near-instant / slow).** Nothing has resolved into a header yet — there's genuinely nothing stable to hang a Settings detour off of.
- **`home.md` §3.12 (Close-summary).** A deliberately transient, self-clearing acknowledgment screen — `home.md` itself is explicit that this state carries "no 'what do you want to do now?' prompt." A Settings entry point competing for attention here would undo that restraint.
- **`home.md` §3.14 (Resolution error / defensive fallback).** A recovery screen whose only job is getting her back to a working state. A Settings detour competing with her one recovery path would work against the reason that state exists.

**Cross-document note (see §8, item 3):** the original required addition to `home.md`'s wireframes — a second sheet entry in §3.7a, and the entry-point trigger itself appearing in §3.3–§3.6's (and §3.6a's three Session-start-moment variants') currently-plain "Nahui" header — landed (`home.md`'s own status header, "Amended for `settings.md` §2.1"). **Further update, 2026-08-09:** that trigger relocated from the header's "▾" to a top-right "⋯" icon, with a gear icon added to the sheet's "Configuración" row; the matching `home.md`-side amendment for this relocation is performed in the same pass as this correction — see `home.md`'s own status header and §10 for the full reasoning, including why "⋯" was chosen over a hamburger icon. **Further update, 2026-08-15:** the "⋯" icon and its one-entry sheet are retired for these four states too — see this section's own bullets above, and `home.md`'s own status header/§2/§3.6c for the full reasoning.

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

**"Cambiar a vender con tags" carries one more consequence beyond flipping
the stored field, added 2026-08-14 (`decision-log.md` D46, corrected the
same day per D46's own Addendum) — see §2.6.** Unlike every other row
above, this action's own success doesn't stop at "row updated, no pending
state" (§4) — it also hands off, via a lightweight entry marker, into
`inventory.md`'s own resolution (§2), which is what actually determines
whether/how she's routed into tagging her existing Catalog. This action
never reads or decides that itself (architect ruling,
`architecture-principles.md` #6 — see §2.6 for the full reasoning).

### 2.3 Why `defaultSellingMode`'s two directions are both immediate, with no pending-change structure (`decision-log.md` D27)

Unlike `subscriptionTier`, `defaultSellingMode` is not a commercial or billing capability — it's an operational fallback (`decision-log.md` D23) that Session-start already reads fresh, every time, alongside NFC Readiness. `decision-log.md` D25's deferred-timing rationale exists specifically to make a *commercial* change (one with billing-cycle implications, like a Paid→Free downgrade) honestly displayable before it lands; `defaultSellingMode` carries no such implication in either direction. Setting it to `nfc` or back to `buttons` changes nothing about what she's being charged, when, or under what plan — it only changes which mode Session-start resolves toward the next time she opens a Session, exactly the same way any other read of a Business-level fallback field already behaves.

This is why both directions — Botones → Etiquetas NFC and Etiquetas NFC → Botones — use the generic immediate-effect template (§3.4), never the deferred one (§3.5): there is nothing to defer. The change takes effect at her very next Session-open, automatically, with no separate scheduling mechanism and no pending-value/effective-date pair to track (`decision-log.md` D27 states this explicitly: this field "carries no pending-value/effective-date structure... an edit here takes effect immediately"). Nothing about `Session.operatingMode`'s own resolution changes as a result — D23's existing guarantee (resolved once, at Session-open, from `defaultSellingMode` plus NFC Readiness) already assumes `defaultSellingMode` can be read fresh at any moment; who's allowed to edit the fallback, or how often, was never part of what made that guarantee true.

**The `nfc` option is constrained, not offered unconditionally.** Per D27's own wording, this control only ever offers modes "available to her" — `buttons` always, `nfc` only while `subscriptionTier = paid`. A Free-tier merchant sees a single, un-choosable "Botones" row rather than a picker with a disabled option: there is nothing to pick between yet, and showing a visibly-disabled `nfc` option would invite exactly the kind of "why can't I tap this" confusion `global-principles.md`'s "technology should disappear" argues against. The moment `subscriptionTier` becomes `paid` — immediately, via "Activar plan de pago" — this control gains its second option with no separate unlock step of its own; the derivation in §2.2 already makes `nfc` available the instant `subscriptionTier` flips, so there's nothing left for this control to wait on.

**`defaultSellingMode`'s stored value is never written by any action other than its own two rows above.** Specifically, "Volver al plan gratis" (§2.2, §3.5) writes only to `subscriptionTier` — it never resets, clears, or otherwise touches `defaultSellingMode`. If a merchant's `defaultSellingMode` reads `nfc` at the moment a Paid→Free downgrade lands, it simply stays `nfc` in storage; `nfc` just stops being an available mode for Session-start to resolve into, per the derivation in §2.2, until she either returns to Paid or changes `defaultSellingMode` herself. This is a direct consequence of `defaultSellingMode` and `subscriptionTier` being two independent stored fields with two independent write paths (`decision-log.md` D25/D27) — no separate reset rule was ever needed, or written, to make this true.

### 2.4 When a deferred change actually lands (SET-M3 — resolved with a concrete mechanism, stated honestly as an addition, not a restatement)

A silent flip with zero acknowledgment would mean Ana only discovers a real change to her own business by noticing a row's label is different than she remembered. Instead: the first time Configuración's main view (§3.3) is opened after a pending change's effective date has passed, that capability's row carries a one-time, dismissible acknowledgment line above it ("Tu plan cambió a Gratis el 14 de agosto"), styled the same low-ceremony way `home.md` §3.12's close-summary states a fact rather than asking a question. Shown exactly once — the next Configuración open after that renders the row as an ordinary current-state row. Whether this should also surface anywhere *outside* Configuración (a badge, a notification) stays open (§8, item 4) — this section only resolves the in-surface acknowledgment.

### 2.5 Cerrar sesión — an account-level action, distinct from every capability above and from Home's own Selling-Session close (new — Product Owner decision, 2026-08-13)

Every action in §2.2's table changes something about the Business — what she's charged, how she sells, what Resultados shows. This one doesn't touch the Business at all. It ends this device's verified-phone session (`authentication.md §2.1`) — the fact, established once at Authentication and checked silently on every app open since, that this phone is who's using this device right now. Turning it off doesn't unmake anything she's built: her Business, its Capabilities, its Catálogo, its historial de ventas all stay exactly where `product/99-rfc/0007-user-and-business-membership.md`/`decision-log.md` D44 already put them — independent of whether this device currently holds a valid session for it (`onboarding.md §2.1`'s own "for this install" language describes exactly the record this action never touches). `authentication.md §2.1` already draws this line for the opposite direction — a device either holds a valid session or it doesn't, entirely separate from whether a Business exists to resolve into; this is the first place in the product where Ana herself deliberately flips that fact, rather than it only ever being set once and read silently forever after.

**Naming: plain "Cerrar sesión."** `home.md §3.7`/§3.11 name a different concept — ending a Selling Session, a working day — but as of `home.md`'s own 2026-08-13 rename (see that document's own status header), that action is now named "Cerrar jornada de venta," not "Cerrar sesión." The Product Owner's own reasoning for that rename applies here too: "sesión" is now reserved exclusively for the authenticated User/device context RFC 0007 introduced, so there's no collision left to guard against by suffixing this action's name. This is now the one and only account-level action in the product named "Cerrar sesión," used bare, everywhere it appears — no device-scoping suffix needed to disambiguate it from anything else. (Whether this action *should* interlock with an open Selling Session is a separate, unrelated question, flagged not decided, in §8 below.)

**Why it's not a fifth row in §2.2's table.** §2.2 is exhaustively about `subscriptionTier`/`defaultSellingMode` — capabilities that live on the `Business` (Identity context). This action has no Business Capability to represent; it reads and writes a fact about the device's own session, a `User`-level concern (RFC 0007), not a `Business`-level one. It gets its own clearly-separated place instead: a "Tu cuenta" section at the bottom of the vista principal (§3.3a, §3.6), below a visual divider, present identically regardless of `subscriptionTier` or whether a pending change exists — the one action in this document never conditioned on anything else in it.

**A real commitment, not a bare tap.** Per `onboarding.md §6`'s established standard ("the extra tap protects a real commitment from a stray tap") and this document's own §1 framing, a stray tap here ends her ability to use this phone for Nahui until she re-verifies — a real, if fully reversible, interruption to her day. It gets the same explicit confirming step every other real commitment in this family already gets (§3.7's "Cancelar cambio pendiente," `home.md §3.11`'s own Selling-Session close) — never an instant action.

**What it doesn't touch — the single most important fact here, stated plainly rather than left implicit.** Signing out does not delete, hide, reset, or otherwise touch the `Business`, its Capabilities, its Catálogo, its historial de ventas, or any Sale, Session, or Event record. The device-held session fact this action clears isn't part of the domain model at all — RFC 0007 §5 explicitly defers any real authentication/session mechanism as infrastructure, sitting above the aggregate graph per RFC 0007 §3's own layering argument — so there's no dependency between it and `Business`/`BusinessMembership` for this action to disturb in the first place. Getting this wrong would read as data loss, the same class of trust break `architect-questions.md` Q19 already cost real design effort to fix elsewhere in this project (Eventos) — the confirmation copy itself (§3.8) states this guarantee plainly, rather than leaving her to discover it only by re-verifying and hoping.

**Where it resolves.** A successful sign-out hands off to `authentication.md §3.3` (Número celular — entry), fresh — never that document's §3.8 resume state, which exists for an *interrupted*, incomplete verification attempt, a different situation from a deliberate, completed sign-out.

### 2.5a What happens when the same phone re-verifies afterward (cross-document consequence, not a new destination invented here)

`authentication.md §2.2` already enumerates three cases for what a confirmed code does next. Signing out and re-verifying with the same phone, on the same device, is **case 2** — "This phone was already verified on THIS device, with a Business already local to it (complete or in-progress)" — a case that document already named, but marked "Not reachable through this branch... this document never re-verifies a phone already verified on its own device," because nothing, before this action existed, ever cleared a device's session fact while leaving its local Business record intact. This action is exactly the mechanism that makes that case real for the first time — not a fourth, undesigned case, and not case 3 (a genuinely *new* device or reinstalled app with no local Business record at all — still "Not yet resolved," `product-decisions.md` Q18, untouched by this addition, since §2.5 above guarantees the local record is never cleared by signing out).

The local Business record stays fully intact through a sign-out, so a successful re-verification on the same device finds it waiting exactly as it was — and hands off to `onboarding.md`'s own resolution logic (`onboarding.md §2.1`), the identical silent pass-through `authentication.md §2.1` case 1 already describes for an unbroken session, reached this time via a fresh OTP confirmation instead of a persisted flag. **In practice this always resolves straight through to Home (`home.md §2`), not to a resumed Onboarding step** — "Cerrar sesión" is reachable only from Home's own persistent header (§2.1: "anywhere Home shows a persistent header"), and Home itself is reachable only once `onboarding.md §2.1`'s case 1 (a fully complete Business) has already resolved; there is no path into Configuración, or this row, during an in-progress Onboarding. `onboarding.md §2.1`'s in-progress cases (2–4) describe what the general handoff *would* do if this trigger were ever reachable mid-Onboarding — a state this specific mechanism cannot structurally produce, not a live branch of it. This document has nothing further to add once verification succeeds — the same as case 1's own handoff already states.

`authentication.md §2.2` case 2's own text was stale — correctly unreachable when written, made reachable by this action. The matching correction is applied to that document in the same pass — see its own status header.

### 2.6 What "Cambiar a vender con tags" does beyond flipping the field —
hand off into tagging, or guide her to register first (corrected —
architect ruling, `decision-log.md` D46 Addendum)

`decision-log.md` D46 corrects a real, previously-unnoticed contradiction:
`inventory.md`'s own auto-entry trigger into Asignar Tags read `nfc ∈
registrationMode` (NFC *availability*) rather than `defaultSellingMode =
'nfc'` (her actual, self-service-chosen *intent* — precisely the field this
action writes). §2.3 above already explains why `defaultSellingMode`'s two
directions are pure, immediate toggles with no billing-cycle implication;
this section adds the one genuine consequence beyond the toggle itself —
what happens to whatever's already sitting untagged in her Catalog the
instant she makes this specific choice.

**Corrected mechanism, same day as D46 (`architect` ruling — see
`decision-log.md` D46's own Addendum).** The first drafted version of this
section had this action read Inventory-owned state
(`InventoryUnit.status`/`tagId`) directly to decide its own routing.
`architect` ruled this would close a dependency cycle: `domain-model.md`'s
Bounded Contexts table already has Inventory depend on Identity, so an
Identity-context action reading Inventory state back to make its own
routing decision would add a return edge (Identity → Inventory →
Identity) — exactly what `architecture-principles.md` #6 forbids
("dependency direction is one-way... new features extend the graph, they
don't add a back-edge"). Resolved without losing the direct-auto-entry
behavior D46 itself requires: this action now writes `defaultSellingMode`
and nothing else — the routing decision moves entirely into
`inventory.md`, which already legitimately owns the check that decides it.

**The write and the handoff are one action, but the handoff carries no
queried domain fact — only a lightweight entry marker.** The moment §3.4's
"Cambiar ahora" confirms and `defaultSellingMode` is written as `nfc`
(§3.9's guardando step), this same action unconditionally hands off
navigation into `inventory.md` §2's own resolution, carrying nothing more
than an entry marker — "reached via Cambiar a vender con tags" — the same
lightweight "arrived-via" marker shape this document family already uses
elsewhere (`inventory.md` §3.3's own text: "If she instead arrived via
Home's cold-start CTA, she skips straight to §3.6"). This document never
checks, branches on, or reads any `InventoryUnit`/Catalog fact to decide
where she lands — that decision belongs entirely to `inventory.md` §2,
which gains a new, highest-priority trigger condition performing exactly
the check it already legitimately runs for its own, separate reason (its
own pending-tag-work test, step 2).

**What actually happens once the handoff lands** (fully specified in
`inventory.md` §2 — summarized here only so this action's real
consequence stays honestly disclosed before she confirms, §3.4):
- **Untagged, `available` inventory exists anywhere in her Catalog** → she
  lands directly in `inventory.md` §3.14 (Asignar Tags), seeded with every
  untagged unit across her whole Catalog, not scoped to any single Lot.
  She never sees Configuración's own vista principal again in between —
  the same "auto-continue, no intermediate question" shape `inventory.md`
  §2 step 3 already establishes for the Guardar mercancía trigger, applied
  here to D46's second trigger.
- **No untagged inventory, but she's received merchandise before** →
  `inventory.md` §2's own resolution takes over from there and lands her
  on the plain Catalog view (`inventory.md` §3.4, "Inventory Ready") —
  **not** back on Configuración's own vista principal (a real, small
  UX-surface delta from this section's original draft, reasoned in full in
  §10 below). She's already fully tagged, ready to sell with tags next
  Session.
- **Zero InventoryUnit ever received for this Business** → `inventory.md`
  §2's own cold-start branch takes over, landing on its one-time
  acknowledgment (`inventory.md` §3.3a) — D46's explicit third rule: "an
  empty tagging queue is never shown as the landing state." She's guided
  to register merchandise first, using the exact "Registrar mercancía"
  entry point Inventario already offers — no new capture mechanism
  invented. (Two sub-renders depending on whether named Products already
  exist with zero Lots received — see `inventory.md` §3.3a.)

**Why this lives here, split the way it is.** This document owns *when*
the transition fires and *what field it writes* — the moment
`defaultSellingMode` changes to `nfc`. `inventory.md` owns *what she sees
once it does*, using state it already legitimately reads for its own,
independent reason — cross-referenced, not redescribed, per this folder's
own §4 discipline. Keeping the destination logic entirely inside
`inventory.md`, triggered by a bare marker rather than a fact this
document queries, is what avoids the dependency back-edge structurally,
not merely by convention.

**"Cambiar a vender con botones" has no equivalent branch.** Switching back
to `buttons` never routes anywhere beyond the ordinary immediate-effect
return (§4) — any inventory she'd left untagged simply stays untagged, per
`inventory.md` §3.5's corrected gate.

**"Activar plan de pago" and "Volver al plan gratis" are unaffected.**
Neither writes `defaultSellingMode`, so neither triggers this handoff —
Free→Paid makes `nfc` *available*, but `defaultSellingMode` stays whatever
it already was (`buttons`, for every real Onboarding path, `onboarding.md`
§2.3) until she takes this specific action.

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

### 3.3 Entry — session-controls sheet, Home idle/cold-start/Event-active-no-Session states — retired (superseded 2026-08-15 — see status header)

**Retired 2026-08-15 (Product Owner-raised, matching `home.md`'s own
retirement of §3.6c).** This sheet was already single-item
("Configuración" only, no "Cerrar jornada de venta" row, since none of
these four Home states has an open Session to close) — the identical
"single-item menu adds a tap without representing a real choice"
condition that retired the active-Session sheet a day earlier. The
header's gear icon (⚙) on these four Home states now routes directly into
Configuración's resolve step (§3.1/§3.2), no intermediate sheet — see
§2.1. No entry point anywhere in this document routes here any longer.
Kept as a named, non-deleted entry — not silently dropped — so the
historical record of this sheet's own shape stays legible; full prior
content at `settings.changelog.md#section-3-3-retired`.

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
│ ── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ── │
│  Tu cuenta                        │
│  [ Cerrar sesión ]                │
└───────────────────────────────┘
```
No `defaultSellingMode` control shown while `subscriptionTier=free` — nothing to choose between yet, since `nfc` isn't in her capability set (§2.3). The moment "Activar plan de pago" confirms, this row gains a real control (see the Paid-tier state below).

**The "Tu cuenta" section is new (2026-08-13, §2.5) and appears identically in every vista-principal variant below** — the Paid-tier state, its `defaultSellingMode = nfc` mirror, and §3.6's pending-change state — regardless of `subscriptionTier` or pending-change status, the one part of this screen never conditioned on anything else in it. Shown in full on the Paid-tier state and §3.6 below; the `nfc`-mirror state gets the identical addition without a separate redraw, the same shared-state treatment that state already receives from its own base.

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
│ ── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ── │
│  Tu cuenta                        │
│  [ Cerrar sesión ]                │
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
│ ── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ── │
│  Tu cuenta                        │
│  [ Cerrar sesión ]                │
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

### 3.4 Confirmación de efecto inmediato (generic template — shared by three copy variants)
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

**Copy variant — Cambiar a vender con tags (`decision-log.md` D27;
handoff disclosure added `decision-log.md` D46; both outcomes disclosed
per `ux-critic` finding):**
```
Cambiar a vender con tags
Desde tu próxima sesión, vas a empezar vendiendo con tags,
siempre que tengas mercancía etiquetada lista. Si no tienes
tags listos ese día, vendes con botones sin problema.
Si tienes mercancía sin etiquetar, te llevamos a etiquetarla
en cuanto confirmes. Si aún no has registrado mercancía,
primero te pedimos que la registres.
[ Cambiar ahora ]
```
New last two lines disclose §2.6's handoff plainly before she confirms —
both real outcomes (untagged inventory exists; no inventory exists yet),
not only the first — the same "never leave her to discover a real
consequence only after the fact" discipline this document already applies
to "Activar plan de pago"'s `nfc` disclosure and "Volver al plan gratis"'s
consequence disclosure. **The third outcome (already fully tagged) needs no
pre-confirmation disclosure of its own here** — unlike the other two,
nothing about what happens next depends on anything she'd need to know
before tapping "Cambiar ahora." That doesn't make it silent afterward,
though (corrected — `ux-critic` finding SET-INV-D46-MAJ1; the previous
version of this sentence claimed "exactly like every other row in this
table," which wasn't true): per §2.6, she still lands on a different
screen than every other row returns her to — `inventory.md`'s plain
Catalog view (§3.4), not back on Configuración's own vista principal —
carrying its own brief, one-time acknowledgment there. That acknowledgment
is specified once, at its actual destination (`inventory.md` §3.4), not
redescribed here, per this folder's own §4 discipline of citing shared
states instead of duplicating them.

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
│ ── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ── │
│  Tu cuenta                        │
│  [ Cerrar sesión ]                │
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

### 3.8 Cerrar sesión — confirmar (new — Product Owner decision, 2026-08-13)
```
┌───────────────────────────────┐
│ Configuración                   │  dimmed, still visible underneath
│  ¿Cerrar tu sesión?                │
│  La próxima vez que abras Nahui     │
│  aquí, te vamos a pedir tu          │
│  número otra vez. Tu negocio,       │
│  tu inventario y tus ventas          │
│  siguen exactamente como están —     │
│  no se pierde nada.                  │
│      [ Cancelar ]  [ Sí, cerrar      │
│              sesión ]                 │
└───────────────────────────────┘
```
Same shape as §3.7's cancel-pending-change sheet — a dimmed background, the current screen still visible underneath, a two-button choice — chosen deliberately over §3.4/§3.5's single-button "confirm" template, since this action isn't a Business Capability write with an "effect" to disclose; it's a real yes/no decision about whether this device keeps recognizing her. **Copy states the guarantee plainly, per §2.5** — "tu negocio, tu inventario y tus ventas siguen exactamente como están," the identical reassurance shape "Volver al plan gratis" (§3.5) already uses for its own "No perdemos tu historial" — never left implicit.

### 3.8a Cerrando sesión — near-instant / slow
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │      Cerrando sesión…          │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
Own copy variant, distinct from §3.9's "Guardando…" — nothing is being saved here, a device's session fact is being cleared. Same near-instant/slow convention as every other write-like action in this family.

### 3.8b Error al cerrar sesión
```
┌───────────────────────────────┐
│  No pudimos cerrar tu sesión.     │
│  Intenta de nuevo.                 │
│      [   Reintentar   ]            │
└───────────────────────────────┘
```
A retried attempt replays the same already-confirmed action, never re-asking her to re-confirm — same guarantee §3.10 gives its own retry. Nothing about her Business, Catálogo, or historial is ever at risk from this failing partway (§2.5) — the failure is purely local to whether this device's session fact cleared, not to anything the fact was pointing at.

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
From any Home header state (home.md §3.3–§3.6 including its §3.6a
variants, or the active-Session header §3.7–§3.11a) — see §2.1 for the
four states where the entry point is deliberately absent entirely:
§3.1/§3.2/§3.12/§3.14 — amended 2026-08-15, matching home.md's own
amendment (see status header):
  tap the header's "⚙" icon → resolve (§3.1/§3.2) → vista principal
    (§3.3a, or §3.6 if 1+ pending change exists) — no intermediate sheet,
    in any state. During an active Session, "Cerrar jornada de venta" is
    reached separately, via its own direct header button (home.md §3.7),
    never through this tap.

From the main view, tap any action row:

  Activar plan de pago / Cambiar a vender con botones
    → confirmación de efecto inmediato (§3.4) → {acción} ahora
        → guardando (§3.9) → error (§3.10) → Reintentar
        → success → back to vista principal, row updated, no pending state

  Cambiar a vender con tags
    → confirmación de efecto inmediato (§3.4) → Cambiar ahora
        → guardando (§3.9) → error (§3.10) → Reintentar
        → success → unconditional handoff into inventory.md §2's own
          resolution, carrying only an entry marker ("reached via Cambiar
          a vender con tags") — this document performs no check of its
          own (`decision-log.md` D46 Addendum, architect ruling; see §2.6):
            untagged InventoryUnit exists anywhere in her Catalog
              → inventory.md §3.14 (Asignar Tags), auto-entered, per
                inventory.md §2's new highest-priority trigger
            no untagged unit, 1+ InventoryUnit ever received
              → inventory.md §2's ordinary resolution → inventory.md §3.4
                (Catalog view, "Inventory Ready") — not back to
                Configuración's own vista principal (see §10)
            zero InventoryUnit ever received
              → inventory.md §2's ordinary resolution → inventory.md §3.3a

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

From the main view's "Tu cuenta" section (§3.3a, §3.6 — present in every state):

```
Cerrar sesión
  → confirmar (§3.8) → Cancelar → back to vista principal, untouched
  → Sí, cerrar sesión
      → cerrando (§3.8a) → error (§3.8b) → Reintentar
      → success → authentication.md §3.3 (Número celular — entry), fresh
        (reached via: account sign-out, settings.md §2.5 — not that
        document's own §3.8 resume state, reserved for an interrupted
        attempt). If the same phone re-verifies afterward, see settings.md
        §2.5a — authentication.md §2.2 case 2, made reachable by this
        action, hands off silently to onboarding.md §2.1's own resolution.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. ~~Entry — session-controls sheet, Home idle/cold-start/Event-active-no-Session states~~ — **Retired 2026-08-15** (see status header): the header's gear icon (⚙) now routes directly into item 4 below for these states too, no sheet.
4. Configuración — vista principal, sin cambio pendiente (now includes a "Tu cuenta" section, §2.5)
5. Confirmación de efecto inmediato — generic template (three copy variants: Activar plan de pago — SET-M4/D34/D40-corrected — and the two `defaultSellingMode` variants; "Activar/Desactivar clientes frecuentes" retired entirely per `decision-log.md` D40)
6. Confirmación de efecto diferido — generic template (Volver al plan gratis)
7. Configuración — vista principal, con cambio pendiente (also includes "Tu cuenta," §2.5)
8. Cancelar cambio pendiente — confirmar
9. Guardando cambio — near-instant / slow (shared, every action)
10. Error al guardar cambio
11. Cerrar sesión — confirmar
12. Cerrando sesión — near-instant / slow
13. Error al cerrar sesión

## 6. Minimum step count

| Scenario | Taps | Why it can't be fewer |
|---|---|---|
| Reach Configuración from any Home header state | **1** (⚙, direct) | Amended in two steps — active Session 2026-08-14, the remaining four non-Session states 2026-08-15 — the intermediate sheet is retired everywhere it once held only one entry; see §2.1. |
| Activar plan de pago | 2 (Activar plan de pago → Confirmar y activar) | One tap to open the action, one to confirm the self-attestation — nothing beyond that to type once the payment itself has already happened elsewhere. |
| Cambiar a vender con botones | 2 | Pure toggle — unlike the retired NFC-activation path, nothing left in this document requires typing anything. |
| Cambiar a vender con tags | 2, for this action itself (`decision-log.md` D46) | Pure toggle at this document's own layer — identical floor. This action always hands off into `inventory.md` §2's own resolution (§2.6); whether that lands her in Asignar Tags (`inventory.md` §3.14, incurring that document's own per-unit scan cost), the plain Catalog view, or the register-first cold start costs nothing further at this document's own boundary — not double-counted here, since Inventario's own resolution is a separate document's own action, not part of this Settings transition. |
| Volver al plan gratis | 2 | Deferred effect doesn't change the tap count — only when the write takes effect. |
| Cancelar cambio pendiente | 2 | Mirrors `home.md`'s own destructive-action confirmation floor. |
| Cerrar sesión | 2 (tap row → Sí, cerrar sesión) | Same two-tap floor as every other action here — a real, if fully reversible, commitment gets one real confirming tap, nothing more. |

Every action in this table now shares an identical 2-tap floor, measured at this document's own boundary. The one previous exception — Activar venta con tags's code-entry requirement — is gone along with the path itself (`decision-log.md` D27): `defaultSellingMode`'s two directions are pure toggles like every other immediate-effect action, with no real fact left to type. Configuración is now the one document in this family where every merchant-initiated action, without exception, costs exactly two taps — open the action, confirm it.

## 7. Automation opportunities

- Which action button shows per capability row — always exactly the one valid opposite of the current stored value.
- The pending-change banner — a pure read of stored pending-value/effective-date data.
- Effective-date computation — produced by whatever business rule Q11 eventually settles, never typed or chosen by Ana herself.
- A capability with a pending change never offers a second, stacking action.
- Which `defaultSellingMode` direction is offered — computed automatically from `nfc ∈ registrationMode`, never something Ana has to unlock separately.
- The one-time landing acknowledgment (§2.4) is shown automatically, never requiring her to remember she had a pending change.
- Whether Frequent Customers is available at all — computed automatically from `subscriptionTier`, with no capability of Ana's own to set (`decision-log.md` D40).
- Whether this device already holds a valid session — resolved silently by `authentication.md §2.1` on every app open; this document never asks that question itself, only ever offers the one deliberate action to flip it off.
- Whether "Cambiar a vender con tags" hands off into tagging, the plain
  Catalog view, or Inventario's own register-first guidance — computed
  automatically, entirely inside `inventory.md`'s own resolution (§2),
  reached via an unconditional handoff carrying only an entry marker; this
  document never reads or computes any Inventory-owned fact itself
  (`decision-log.md` D46 Addendum, architect ruling; §2.6).

## 8. Open questions

None of the items below block this document's completion.

1. **Q11** (`company/business-decisions.md`, Open) — the specific per-transition immediate/deferred assignment in §2.2's table is illustrative, not final, blocked on a pricing/billing-cycle model that doesn't exist in the Foundation yet.
2. **The specific external-payment channel is deliberately left unnamed** in §3.4's "Activar plan de pago" copy — a business-model detail to fill in once decided.
3. **Resolved, kept for continuity — the required `home.md` amendment landed.** §2.1 originally flagged that extending the entry-point affordance (then the header's "▾") to every Home header state except §3.1/§3.2/§3.12/§3.14 required a small, additive amendment to `home.md`'s own approved wireframes (same category as `decision-log.md` D23's amendment to `inventory.md`) — that amendment landed (`home.md`'s own status header, "Amended for `settings.md` §2.1"). **Further update, 2026-08-09:** the entry-point trigger itself relocated from the header's "▾" to a top-right "⋯" icon opening the identical sheet, with a gear icon ("⚙") added to the sheet's "Configuración" row specifically (Product Owner decision) — the matching `home.md`-side amendment for this relocation is performed in the same pass as this correction; see `home.md`'s own status header and §10 for the full reasoning, including why "⋯" was chosen over a hamburger icon. **Further update, 2026-08-14 (Product Owner-raised, `home.md`'s own "Cerrar jornada de venta" discoverability fix):** the entry point itself now differs by Home state rather than sharing one uniform shape everywhere. During an active Session, tapping the icon (now "⚙" for this state specifically) routes directly into Configuración with no intermediate sheet at all, since "Cerrar jornada de venta" moved to its own direct header button and left the sheet with a single entry; outside an active Session, the "⋯" icon and its one-entry sheet (§3.3) are unchanged. The matching `home.md`-side amendment is performed in the same pass — see that document's own status header, §2, §3.6c, and §10 for the full reasoning, including why a gear replaces the ellipsis specifically for the active-Session case.
4. **Whether the pending-change-lands acknowledgment (§2.4) should ever surface anywhere outside Configuración itself** (a badge, a notification) — not designed here, no evidence yet the in-surface acknowledgment is insufficient.
5. **Resolved, kept for continuity — a `defaultSellingMode` control is now designed here.** `decision-log.md` D27 extended self-service editability to this field: §2.2/§2.3/§3.4/§3.6 now specify it directly, as an immediate-effect action with no pending-change structure, constrained to whichever modes `subscriptionTier` currently makes available. The gap this item originally flagged (D25/Q5 resolving exactly three capabilities, none of which was `defaultSellingMode`) is closed — kept here, marked resolved, so the record of what was once genuinely out of scope stays visible rather than silently disappearing.
6. **Whether signing out should interlock with an active, non-empty Sale or Session** — `home.md §3.11a` already blocks the Selling-Session close the moment "Venta actual" holds 1+ items, precisely because that action would otherwise silently put unfinished work at risk. §2.5 above states plainly that signing out never touches Selling data — the Session and its Venta actual stay exactly as they are, waiting for the same phone to re-verify (§2.5a) — so no *data* is at risk the way HOME-M2 was designed to prevent. Whether it's still worth warning her that a customer may be standing in front of her mid-Sale at the moment she chooses to sign out — a situational risk, not a data-loss one — isn't designed here. No evidence yet this is common enough to warrant its own interlock.
7. **Resolved, kept for continuity.** `authentication.md §2.2` case 2 (and its §4 flow line, §8/§11 references) previously described re-verifying an already-verified-on-this-device phone as theoretically unreachable. This action (§2.5) makes it reachable for the first time (§2.5a). The matching correction to that document was applied in the same pass — see its own status header and §2.2/§4/§8/§11.
8. **A persistent, read-only display of her own verified phone number in Configuración** — already named as a future consideration in `authentication.md §11`, unrelated to whether sign-out itself works; still not designed here, no evidence of need yet.
9. **Resolved 2026-08-15, kept for continuity.** This item asked whether
   the idle/cold-start/Event-active-no-Session sheet (formerly §3.3)
   should also collapse to a direct gear tap. It has: the Product Owner
   raised this directly, comparing the two live header states, and the
   answer corrects rather than confirms this item's original framing —
   the "extra tap" wasn't merely a friction point worth deferred
   observation, it was the identical single-item-menu condition that had
   already justified retiring the active-Session sheet a day earlier;
   this document's own earlier reasoning (§2.1) had separated *whether*
   Configuración stays reachable from *what shape* the trigger takes
   without noticing the second question was still open. See `home.md` §2
   and §10 for the fuller correction.

## 9. Principle justification

**global-principles.md:**
- *"Never ask twice"* — a pending change's target capability is never re-asked when cancelling; the landing acknowledgment (§2.4) is shown exactly once; `defaultSellingMode`'s own value is never asked twice either — Session-start (`home.md` §2/§3.6a) already reads whatever she last set here, and setting it here never re-confirms a fact Session-start would otherwise have had to ask about.
- *"Business language before technical language"* — every screen uses "plan," "cómo vendes," never `subscriptionTier`, `registrationMode`, `defaultSellingMode`, or "entitlement," anywhere. "Clientes frecuentes" no longer appears as an action name in this document (`decision-log.md` D40) — only as a description of what "Activar plan de pago"/"Volver al plan gratis" affect.
- *"Capture business truth once, reuse it forever"* — `nfc`'s availability is captured exactly once, as `subscriptionTier`, and never re-captured as a second, independent fact anywhere in this document (`decision-log.md` D27) — the earlier design's NFC activation code confirmed the same underlying truth a second time, in a second place; removing it is this principle applied more completely, not a new application of it.
- *"The best interface stays out of the merchant's way"* — a failed capability save never drops an already-confirmed toggle, including a `defaultSellingMode` change (§3.10); cancelling a pending change is always reachable and never destructive to anything but the pending change itself (§3.7).
- **The SET-M1 fix, stated as its own principle-level point:** every piece of copy describing what client-tracking reveals is worded as a count/category ("cuántas... son frecuentes y cuántas ocasionales"), never an identity claim ("cuáles"/"quiénes son") — the same correction `reports.md` already made once (RPT2-MAJ1), applied consistently across every instance in this document, including the one a prior remediation round briefly reintroduced while fixing SET-M4.
- *"Capture business truth once, reuse it forever"* — extended to the new sign-out action: her Business, Catálogo, and historial de ventas are captured exactly once and never re-captured, reset, or discarded by signing out — the device-held session fact is the only thing this action ever touches (§2.5).
- *"Never ask twice"* — a same-device re-verification after signing out never re-runs Onboarding or re-asks anything already on record; it resolves straight through to wherever her existing Business already stood (§2.5a).

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream, never asked mid-flow)* — Configuración is the one deliberate exception D25/D27 carve out for merchant-initiated, explicit self-service change; no other screen re-asks any of the capabilities or settings managed here.
- *#4 (internal-only entities never leak into user-facing language)* — no capability is ever named by its technical field anywhere.
- *#6 (one-way dependency direction)* — this document only writes to Identity's Business Capabilities; it never designs a Selling/Inventory/Intelligence screen of its own. "Cerrar sesión" writes only to this device's own session fact, not part of the domain model at all (RFC 0007 §5's explicit infrastructure deferral) — it never reads or writes Selling, Inventory, or Intelligence data, the identical discipline the rest of this document already holds itself to. **"Cambiar a vender con tags" (§2.6) observes this identically** — corrected specifically to hold this line, per `decision-log.md` D46's Addendum: it writes `defaultSellingMode` and hands off a bare entry marker, never reading or querying `InventoryUnit`/Catalog state itself; the one check that decides her routing lives entirely inside `inventory.md`, which already legitimately owns it.

**brand-guide.md:**
- *Tone — "warm, direct, respects the vendor's intelligence"* — every deactivation confirmation states plainly what's lost without a warning-styled dialog; "Activar plan de pago"'s restored copy states plainly that this activates by confirming a payment arranged elsewhere, rather than omitting that fact. §3.8's sign-out confirmation states the one fact that matters (nothing is lost) plainly and up front, mirroring the reassurance shape "Volver al plan gratis" (§3.5) already established, rather than an apology-first or warning-styled dialog.

## 10. Decisions made

- Configuración hangs off Home's session-controls trigger — originally the header's "▾," relocated 2026-08-09 to a top-right "⋯" icon — extended to every Home state that has a persistent header, not only the active-Session one. **[Superseded in two steps: 2026-08-14 for the active-Session state, 2026-08-15 for the remaining non-Session states — see the two newest bullets below; the trigger is now a direct gear icon everywhere, no sheet remains.]** **[see settings.changelog.md#decisions-configuracion-hangs-off-session-controls-trigger]**
- **2026-08-09 (Product Owner decision): the entry-point trigger relocates from the header's "▾" to a top-right "⋯" icon; the sheet's "Configuración" row gains a gear icon ("⚙").** Full reasoning lives in `home.md`'s own status header and §10. **[see settings.changelog.md#decisions-2026-08-09-trigger-relocated-ellipsis-gear-icon]**
- The entry point is explicitly absent from exactly four Home states (`home.md` §3.1/§3.2/§3.12/§3.14), each with its own one-line reason.
- **The dedicated "Activar venta con tags" path (activation-code entry) is removed entirely, not merely restructured** (`decision-log.md` D27) — `nfc` is a pure derivation from `subscriptionTier`. **[see settings.changelog.md#decisions-activar-venta-con-tags-path-removed]**
- **A new `defaultSellingMode` control (Botones ↔ Etiquetas NFC) is added** (`decision-log.md` D27), constrained to whichever modes `subscriptionTier` currently makes available. **[see settings.changelog.md#decisions-defaultsellingmode-control-added]**
- **`defaultSellingMode`'s two directions are both immediate, with no pending-value/effective-date structure at all** (§2.3, `decision-log.md` D27) — it uses the generic immediate-effect template (§3.4), never the deferred template (§3.5). **[see settings.changelog.md#decisions-defaultsellingmode-immediate-no-pending-structure]**
- "Activar plan de pago" stays in the generic immediate-effect template, using count/category framing ("cuántas... y cuántas"), never identity-implying framing. Its consequence now also includes `nfc` becoming available automatically the moment this confirms (`decision-log.md` D27). **[see settings.changelog.md#decisions-activar-plan-de-pago-nfc-disclosure]**
- All actions now share exactly two confirmation shapes (immediate-effect, deferred-effect), with no exception at all — the previous exception (NFC activation's code-entry path) is removed along with the path itself (`decision-log.md` D27). **[see settings.changelog.md#decisions-two-confirmation-shapes-no-exception]**
- No capability with a pending change offers a second, competing action.
- **"Volver al plan gratis" now discloses its `nfc` consequence explicitly, not only its Resultados/segmentation consequence** — downgrading to Free also withdraws `nfc` availability at the effective date (`decision-log.md` D27). **[see settings.changelog.md#decisions-volver-al-plan-gratis-nfc-disclosure]**
- Cancelling a pending change gets a lightweight, single-step confirm.
- No payment/checkout flow and no bazaar-recommendation logic designed anywhere in this document. **`defaultSellingMode` is no longer excluded** — `decision-log.md` D27 brought it into scope. **[see settings.changelog.md#decisions-defaultsellingmode-scope-no-longer-excluded]**
- The gap between "a pending change lands" and "Ana is told" is closed with a concrete, one-time, in-surface acknowledgment (§2.4) — whether this also needs to surface outside Configuración stays open (§8, item 4).
- **`decision-log.md` D34 corrects the framing of "Activar clientes
  frecuentes," "Desactivar clientes frecuentes," and "Activar plan de
  pago" (§3.4).** Their copy no longer presents `loyaltyEnabled` as a
  joint precondition, alongside `subscriptionTier=paid`, for Resultados'
  "Tus clientes" section to show anything. **[see
  settings.changelog.md#decisions-d34-corrects-clientes-frecuentes-framing]**
- **`decision-log.md` D40 retires "Activar clientes frecuentes"/"Desactivar clientes frecuentes" (§3.4) entirely, superseding the D34 bullet above.** Frequent Customers is now a pure, automatic consequence of `subscriptionTier`; Configuración narrows from six actions to four. **[see settings.changelog.md#decisions-d40-retires-clientes-frecuentes-actions]**
- **A fifth, account-level action — "Cerrar sesión" — is added 2026-08-13 (Product Owner decision), outside the four-capability count.** Ends this device's verified session without touching the Business or its data (§2.5), placed in its own "Tu cuenta" section, with an explicit confirming step (§3.8). **[see settings.changelog.md#decisions-2026-08-13-cerrar-sesion-account-level-action]**
- **A sixth consequence added 2026-08-14 (`decision-log.md` D46), corrected
  the same day (architect ruling — see D46's own Addendum).** "Cambiar a
  vender con tags" writes `defaultSellingMode` and hands off a lightweight
  entry marker only — `inventory.md` §2 owns the routing check (§2.6). An
  already-fully-tagged merchant lands on `inventory.md`'s plain Catalog
  view (§3.4), which carries its own one-time ambient acknowledgment
  disclosing the handoff. **[see
  settings.changelog.md#decisions-2026-08-14-d46-tag-assignment-handoff-corrected]**
- **2026-08-14 (Product Owner-raised, matching `home.md`'s own
  amendment): during an active Session, the entry-point icon becomes a
  gear ("⚙") that routes directly into Configuración, with no
  intermediate sheet.** "Cerrar jornada de venta" no longer shares this
  trigger at all — it moved to its own direct header button, specified
  entirely in `home.md` §3.7. Outside an active Session, the "⋯" icon and
  its sheet (§3.3) were, at the time, deliberately left unchanged —
  superseded the following day; see the new bullet below. `ux-critic`/
  `reviewer` clean, folded back into Approved. **[see
  settings.changelog.md#decisions-2026-08-14-active-session-gear-direct-nav]**
- **2026-08-15 (Product Owner-raised — extending the 2026-08-14 fix to
  every Home header state): outside an active Session too, the
  entry-point icon is now a gear ("⚙") that routes directly into
  Configuración, with no intermediate sheet.** The non-Session sheet
  (formerly §3.3) is retired — it was already single-item
  ("Configuración" only), the same condition that retired the
  active-Session sheet a day earlier. §2.1's earlier "kept deliberately,
  not an inconsistency" reasoning is corrected: it only ever addressed
  whether Configuración should stay reachable from these four states,
  never what shape the trigger reaching it should take. `home.md`
  receives the matching correction (status header, §2, §3.3–§3.6, §3.6a,
  §3.6c retired, §4, §5, §10). **[see
  settings.changelog.md#decisions-2026-08-15-non-session-gear-direct-nav]**

## 11. Future considerations

- Once Q11 resolves, assign `subscriptionTier`'s two directions to their actual immediate/deferred treatment and replace the illustrative examples in §3.4/§3.5.
- Whether the pending-change-lands acknowledgment needs an ambient signal beyond the in-surface one (§8, item 4).
- The `home.md` amendment this document specifies but doesn't perform (§2.1, §8 item 3) needs its own small pass through `home.md` directly.
- The actual payment-collection mechanism for the paid plan (§8, item 2) — a future Business Decision.
- Whether "Cerrar sesión" should interlock with an active, non-empty Sale (§8, item 6) — not designed now, no evidence of need.
