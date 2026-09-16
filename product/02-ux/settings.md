# Configuración — UX Specification

Status: Approved. Full UX Remediation cycle complete across three rounds (SET-M1, SET-M2, SET-M3, SET-B1, SET-M4). **[Amended 2026-08-14 — see settings.changelog.md#status-full-ux-remediation-cycle]**
**Amended for `decision-log.md` D27** (NFC capability derives from `subscriptionTier`, not an independent entitlement): the dedicated "Activar venta con tags" activation-code path is retired entirely; a new `defaultSellingMode` control ("Cambiar a vender con tags" / "Cambiar a vender con botones") is added. **[Amended 2026-08-14 — see settings.changelog.md#status-d27-nfc-capability-derivation]**

**Further amended 2026-08-08 (`decision-log.md` D34 — Customer Segmentation
visibility gate corrected):** Resultados' "Tus clientes" section gates on
`subscriptionTier=paid` alone, not jointly with `loyaltyEnabled`. **[Amended
2026-08-14 — see
settings.changelog.md#status-2026-08-08-d34-customer-segmentation-gate-corrected]**

**Further amended 2026-09-06 (`product/02-ux/product-decisions.md` Q24/Q25 — concurrent multi-seller selling): new §2.7 "Tu equipo" — invite a SELLER (Paid-tier gated, `company/business-decisions.md` Q18), view team status, and revoke an accepted SELLER's access (`BusinessMembership.status: active | revoked`, never deleted, `decision-log.md` D55). New §3.11–§3.14. A new defensive state (§3.14, "Acceso revocado") is cross-referenced from `home.md` §2's new step 0. Remediated same pass (`brand-guardian` finding, pre-`ux-critic`): §3.14 gains a single "Entendido" acknowledgment tap — the screen previously had zero tappable affordance, violating `character-bible.md`'s "no dead ends" rule. **`ux-critic` round 1 (2026-09-07) found, across the Q24/Q25 settings.md/home.md/events.md batch: 4 Major + 4 Minor, 0 Blockers.** Scoped to this document: §3.12's CTA/heading collision (Major — see §10) and §3.11's missing near-instant/slow resolving pair (Minor — see §10), both fixed and re-verified clean. **`reviewer` (2026-09-07) found 0 Blockers against this document specifically; its 3 Important findings were documentation-persistence gaps elsewhere (`decision-log.md` D55, `product-decisions.md`'s own stale status paragraph, the `business-decisions.md` Q13→Q18 renumbering) — all closed directly by Main.** Folded back into Approved. **Further amended 2026-09-07 (Slice 12 `merchant-user-tester` defect, paired with `authentication.md`'s own §2.2/§3.7e fix):** §2.5/§3.3a's "Tu cuenta" section now shows her own verified phone number, read-only, plain text — elevating this document's own already-named Future Consideration (§8 item 8, first flagged 2026-08-13) from deferred to designed. Closes half of a real defect where, with nowhere in the app ever showing her own number, a mistyped digit on re-verification after signing out silently produced a brand-new, empty Business with no way back. No new screen, no new tap — a single read-only line added to an existing, already-reviewed section. **`merchant-user-tester` (2026-09-07) independently verified this fix working after two tooling-artifact reruns were correctly diagnosed and excluded** — see `product/02-ux/experience-review-2026-09-07-slice-12-team-invite.md`. That same walkthrough found one further real defect: §3.14's "Entendido" tap relied on `window.close()`, which silently no-ops in a real browser tab a merchant opened herself — indistinguishable from a broken button. Corrected same day: the mechanism now acknowledges visibly (button disables/relabels, an honest "puedes cerrar esta pestaña" note appears) rather than attempting an auto-close no web/PWA mechanism can actually guarantee here — see §3.14's own updated text. Pending final `ux-critic`/`reviewer` re-verification before Slice 12 folds back into Approved.

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

**Further amended 2026-09-15 (`decision-log.md` D69, `product-decisions.md` Q29 — `User.displayName`):** "Tu cuenta" (§2.5/§3.3a/§3.6) gains a new self-service field, "Tu nombre," reusing `inventory.md` §3.4a/§3.4b's already-established dimmed-sheet edit pattern (new §3.3b) — the SELLER-path capture surface for `User.displayName`, deliberately *not* added to `authentication.md`'s Invitation-acceptance flow (reasoned in §2.5). "Tu equipo" (§2.7/§3.11) now resolves each row's identity through `User.displayName` first, falling back to the phone-number/role-only display it already had. Closes §2.7's own "Row display" gap and §11's two related Future Considerations. **[see settings.changelog.md#status-2026-09-15-displayname-capture]**

**Further amended 2026-09-15 (`decision-log.md` D70, `product/99-rfc/0014-invitation-target-hint-enforced.md`, Accepted — `Invitation.targetHint` becomes required, and acceptance authenticates specifically through it):** §2.7/§3.12 ("Nueva invitación") corrected — the email `targetHint` field is now required, not optional, gating "Generar invitación" on a well-formed address and explaining why in one honest line. A new OWNER-side repair path is added for a still-pending row — "Editar correo"/"Agregar correo" (new §3.12e), reusing §3.3b's dimmed-sheet edit pattern — closing the exact gap RFC 0014 itself names (a typo'd or missing hint, fixable without a cancel-and-recreate round-trip). §3.11's pending-row display now distinguishes a legacy, hint-less pending row (created before this shipped, exempt from the acceptance-time check per RFC 0014's own backward-compatibility rule) from an ordinary one, with its own honest copy and an optional path to opt it in. §8 item 17 (the former "soft mismatch warning" open question) is corrected to match its own already-updated §11 entry — resolved as a hard block, not a soft warning, per `product-decisions.md` Q30. `authentication.md`'s own two new states (the acceptance-side mismatch handling) are that document's own amendment, not this one's — see its own status header. Pending `ux-critic`/`reviewer` review.

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

As of 2026-09-06, a third kind of decision joins the two above for a Paid-tier merchant: who else, besides her, is allowed to open a selling session and register a sale on her behalf. This document is also where that stays changeable, honestly — inviting someone in, and taking that access back without pretending it erases what they already sold.

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

**Her own verified phone number is now shown here too, read-only (added 2026-09-07 — see status header).** `User.phone` (`domain-model.md`), plain text, non-tappable, sitting directly above "Cerrar sesión" in "Tu cuenta" — the one place in the product she can always come back to and check which number this device is verified under, closing the exact gap a `merchant-user-tester` walk first named on 2026-08-13 (§8 item 8, then deferred) and a second, more severe walk (Slice 12) confirmed as a real defect once signing out became a routine part of the multi-Membership workflow. Never editable here — changing the verified number isn't a capability this document designs (it would mean re-running Authentication's own verification mechanism, not toggling a Business Capability).

**"Tu nombre" — new, self-service, 2026-09-15 (`decision-log.md` D69, `product-decisions.md` Q29).** A plain, editable text field, sitting above the phone-number line, showing `User.displayName` if set or a bracketed "Agregar tu nombre" prompt if not. Available identically regardless of role (OWNER or SELLER) or `subscriptionTier` — the same unconditional treatment "Tu cuenta" already gives phone display and "Cerrar sesión," since this is a `User`-level fact, not a Business Capability §2.2's table governs. Tapping either state opens §3.3b, a small edit sheet reusing `inventory.md` §3.4a/§3.4b's already-established dimmed-backdrop, pre-filled-field, Cancelar/Guardar pattern — not a new interaction shape.

**This is the OWNER's own edit surface too, not just a SELLER's capture surface** — closes the Future Consideration `onboarding.md` §11 named ("a self-service edit surface for `Business.name`/`Business.logo`/`Business.description`... explicitly not designed here") for `User.displayName` specifically. `Business.name`/`logo`/`description` themselves remain undesigned for post-capture editing — not touched by this amendment.

**Why this is the SELLER's only capture surface — not also added to `authentication.md`'s Invitation-acceptance flow, reasoned explicitly against "the fastest interaction is the one that never happens."** `authentication.md` §3.10c ("Invitación aceptada — bienvenida") is a single, already brand-reviewed, one-tap celebration screen — `tone-of-voice.md`'s own worked example for "celebration is about her, plainly stated, never inflated." `Business.name` earns a dedicated Onboarding step because it's required and a real downstream consumer (`home.md` §3.8f's receipt) reads it before she can meaningfully use the app; `User.displayName` is optional and nothing at acceptance-time needs it — its only consumers (`reports.md` §3.4a/§3.19, this section's own "Tu equipo" list) are things the *OWNER*, not the newly-accepted SELLER, looks at, later. Asking for it at acceptance would add a field to an already-minimized flow (RFC 0013/D64's entire purpose) for a fact that isn't on that flow's own critical path — the opposite of "don't ask what you don't yet need." "Tu cuenta" already exists, is already reachable the moment she's in the app, and captures the identical field a SELLER or OWNER alike ends up setting self-service regardless — one capture surface, never asked twice, rather than two competing ones.

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

### 2.7 Tu equipo — invite, view, and revoke a SELLER (new — `product-decisions.md` Q24/Q25, "Concurrent multi-seller selling")

**Who this is for.** A Paid-tier merchant who wants someone else — a family member, a trusted helper — to open her own selling Session and register Sales, from her own phone, without sharing Ana's own login. `decision-log.md` D44/RFC 0007 already modeled this (`User` + `BusinessMembership`, `role: OWNER | SELLER`) — this section closes the gap of an actual invitation mechanism, which never existed until now.

**Gated on `subscriptionTier = paid`, composing with the existing gate, not a new gating dimension.** `company/business-decisions.md` Q18 (resolved 2026-09-06, renumbered from a colliding "Q13" 2026-09-07): multi-staff/SELLER seats are a Paid-tier commercial capability, the same class as Frequent Customers/segmentation. An `Invitation` can only be created while `subscriptionTier = paid` — identical shape to how `nfc` and "Tus clientes" are already gated in this document, no new mechanism. **Structurally absent from the Free-tier vista principal** — no row, no locked/disabled hint — same treatment §3.3a already gives Frequent Customers ("structurally absent, not a demoted sub-note") and the same reasoning §2.3 already gives a disabled-but-visible option ("would invite exactly the kind of 'why can't I tap this' confusion `global-principles.md`'s 'technology should disappear' argues against"). Discoverable only via "Activar plan de pago"'s own copy.

**Who can invite/manage.** OWNER only — the Q24/Q25 permission table is explicit that invite/manage-staff is an OWNER capability; a SELLER has no reach into "Tu equipo" specifically (out of this amendment's own scope — see §8, item 5, for the larger, undesigned role-gating question this doesn't solve). **Corrected 2026-09-15 (`ux-critic` Major, closed) — this claim is scoped to "Tu equipo" alone, not to Configuración as a whole.** The original wording ("a SELLER has no reach into this document at all") was inaccurate and risked a real regression: §2.5/§3.3a/§3.3b's "Tu cuenta" — the only self-service surface a SELLER has for setting her own `User.displayName` (`decision-log.md` D69) — is explicitly designed to be reachable "identically regardless of role," and §8 item 14 itself already confirms Configuración carries no role-gate today. A future pass reading the original sentence at face value could have silently gated all of Configuración for SELLER role, taking "Tu cuenta" down with it and reopening the exact identification gap D69 exists to close.

**What "Invitar a alguien" writes (reworked — `product/99-rfc/0013-invitation-token-based.md`, Accepted, `decision-log.md` D64).** A new `Invitation` (`businessId`, `token` — a cryptographically random, single-use value Nahui generates on her behalf, never typed or chosen by Ana; `role`; `status: pending`; `expiresAt`; an optional `targetHint`) — never a `BusinessMembership` directly, unchanged from before. `role` is still always written as `SELLER`, still with no picker, for the identical reason already stated: showing a choice with exactly one real value would cost a tap for nothing (`global-principles.md`, "the fastest interaction is the one that never happens"). **What's genuinely new: creating an Invitation no longer requires Ana to know or type anything about the person she's inviting.** The superseded design (`Invitation.phone`) required her to know the invitee's number and type it correctly before an offer could exist at all; RFC 0013 replaces that with a token Nahui generates unconditionally, alongside an entirely optional `targetHint` (today: an email address) she may add purely as her own memory aid. `targetHint` is never matched against anything, never treated as the accepting person's identity, and never required (§2.7a; §3.12).

**Corrected 2026-09-15 (`product/99-rfc/0014-invitation-target-hint-enforced.md`, Accepted, `decision-log.md` D70) — `targetHint` is now required, not optional, and is checked at acceptance.** The paragraph above's closing claim — "`targetHint` is never matched against anything, never treated as the accepting person's identity, and never required" — is superseded on exactly that point, not deleted, per this document's own non-deletion discipline. `targetHint` is now required at `create_invitation()` (rejects a null value) and the acceptance flow authenticates the invited person specifically through it — Email, pre-filled, locked to its exact value — `authentication.md`'s own concern, designed there, not here. What's unchanged: `targetHint` still never becomes `BusinessMembership`'s own canonical identity (that stays `userId`), and Nahui still never auto-emails anything on Ana's behalf — she still shares the link herself (§2.7a is unaffected). See §3.12 for the corrected field and the new OWNER-side repair path (§3.12d's neighbor, §3.12e). **Backward compatibility, stated here rather than only in the changelog:** any `Invitation` still `pending` with `targetHint = null` at the moment this shipped is exempt from the new check (RFC 0014's own rule) — §3.11 now shows this legacy state distinctly, with its own honest copy and an optional `[ Agregar correo ]` path to opt it into the new protection.

**What happens once the invited person opens the link** is specified in `authentication.md` — today, that document's own §2.2a/§3.10–§3.13a acceptance-side flow is still phone-scoped by design (RFC 0012 §3's original ruling, not yet reworked for RFC 0013). Checked directly against that document's current text (not assumed): several of its mechanisms depend on `Invitation.phone` and a `(businessId, phone)` uniqueness constraint that RFC 0013 already removed from the domain model — this does **not** compose cleanly as-is, a genuine gap, not a citation nit. "Tu equipo" is not end-to-end functional until `authentication.md`'s own token-based acceptance rework exists — a real, not-yet-started follow-on (RFC 0013 §6's own scope), out of this amendment's scope. Full findings: §8, item 10.

**What "Quitar" actually writes (the previously unresolved point, now settled — `product-decisions.md` Q24/Q25).** `BusinessMembership.status` flips `active → revoked` (+ `revokedAt`). **Never a delete.** Every Sale she already registered keeps resolving through `Sale.performedByMembershipId` exactly as before — same non-deletion precedent this document already applies to `subscriptionTier`/`defaultSellingMode` history (D25) and the same shape `Product.active`/`inactive` already established for a discontinued Product (Q21): removed from the merchant's *active* working set, fully intact for history. **No reactivation path is designed here** — `product-decisions.md` Q24/Q25 explicitly names this as "a small, non-urgent open product-scope question, not resolved here"; this document doesn't invent one either.

**Row display — resolved 2026-09-15 (`decision-log.md` D69, `product-decisions.md` Q29): `User.displayName` first, then the pre-existing fallback.** Every "Tu equipo" row identifying a `BusinessMembership` (active or revoked) now resolves in this order: (1) `User.displayName`, if set — the person's own name, shown plainly, closing the identification gap this paragraph named as unsolved before D69; (2) if not set, the pre-existing display this row already had — the User's own phone number, when one exists (still true for any SELLER who verified by phone, unaffected by this amendment); (3) if neither exists — a `User` created cold via email or Google, per D63, with no phone `AuthIdentity` and no `displayName` set — "Alguien de tu equipo," the same role-only fallback `reports.md` §3.4a/§3.19 already use, applied here for the first time as this row's own last-resort case. This degrades honestly rather than fabricating an identity: a Membership never shows a name or number it doesn't actually have. A **pending or expired Invitation** row is unaffected — no `User` exists yet for an offer that hasn't been accepted, so there's nothing to resolve differently there.

### 2.7a Token expiry — why 24 hours (RFC 0013 §4/§7's own named tension, resolved here)

`product/99-rfc/0013-invitation-token-based.md` §4/§7 deliberately left the exact `expiresAt` default to this document, naming a real tension rather than a default answer: product need favors a window measured in days (a family member or helper may not check WhatsApp, or open the link at all, for a day or more after Ana sends it — the same real-world delivery delay `architect`'s own original reasoning named); general security practice for a bearer token embedded in a URL favors a window measured in minutes to hours, because every leakage vector `knowledge-mentor` confirmed (§7 — referrer headers, server access logs, analytics pageview capture, browser history) stays exposed for the entire life of the token, not just at the moment it's generated.

**Resolved: 24 hours.** Reasoned explicitly, not defaulted to either extreme:

- **Meaningfully shorter than the "days" `architect`'s original draft proposed**, cutting the window every leakage vector above stays live for, without pretending a multi-day window is risk-free the way `knowledge-mentor` (§7) explicitly warned against.
- **Long enough to survive one full missed day** — the realistic worst case for a helper who doesn't open WhatsApp until the next morning, not just the same evening. A window measured in hours (the pure-security-practice end of the tension) would produce a real, frequent cost at Nahui's actual pilot scale: a merchant generating a link in the evening for someone who doesn't check it until the next day would routinely find it already dead.
- **The stakes here are lower than the password-reset links OWASP's own guidance is written against** (`knowledge-mentor`, RFC 0013 §7) — a leaked `Invitation` token grants only the *right to join* a Business as a SELLER, contingent on the person who opens it *also* independently authenticating through the ordinary `AuthIdentity` resolution invariant (RFC 0012 §4) before anything is created. It never grants access to an existing account or existing data the way a password-reset token does. This doesn't make the leakage vectors any less real — they stay real regardless of what the token unlocks — but it's a legitimate factor in choosing where inside the named range to land, not a reason to ignore the tension.
- **Paired with a genuinely cheap regenerate affordance** (§3.11/§3.12d, "Generar otra") — exactly the mitigation RFC 0013 §4 itself names as the way to resolve this tension in practice: if 24 hours turns out too short for a given case, recovering from that costs one tap, not a support conversation or a dead-end invitation.

**Not designed here, flagged for the eventual Architecture Gap Analysis** (RFC 0013 §4/§7's own scope, unaffected by this section): `Referrer-Policy: no-referrer` on the invite-landing route, excluding that route from access logs/analytics capture, and rate-limiting the token-lookup endpoint per IP — real mitigations RFC 0013 already names as reducing the *exposure* these leakage vectors create, independent of whatever window this section sets. Choosing 24 hours doesn't substitute for those; it narrows the window they'd apply to.

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
│  Tu nombre                        │
│  [ Agregar tu nombre ]            │
│  +52 55 1234 5678                  │
│  [ Cerrar sesión ]                │
└───────────────────────────────┘
```
No `defaultSellingMode` control shown while `subscriptionTier=free` — nothing to choose between yet, since `nfc` isn't in her capability set (§2.3). The moment "Activar plan de pago" confirms, this row gains a real control (see the Paid-tier state below).

**The "Tu cuenta" section is new (2026-08-13, §2.5) and appears identically in every vista-principal variant below** — the Paid-tier state, its `defaultSellingMode = nfc` mirror, and §3.6's pending-change state — regardless of `subscriptionTier` or pending-change status, the one part of this screen never conditioned on anything else in it. Shown in full on the Paid-tier state and §3.6 below; the `nfc`-mirror state gets the identical addition without a separate redraw, the same shared-state treatment that state already receives from its own base.

**"Tu nombre" is new (2026-09-15, §2.5) and appears identically wherever "Tu cuenta" does — the four sites above.** Shown here in its default, not-yet-set state (the common case for any existing User, and for any new one who skipped it at capture). Once set, the row instead reads her actual name with a bracketed edit affordance, e.g.:
```
│  Tu nombre                        │
│  Juan Pérez            [ Editar ] │
```
Both states open the identical §3.3b sheet.

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
│  Tu equipo                        │
│  2 personas vendiendo contigo     │
│  [ Ver equipo ]                   │
│ ── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ── │
│  Tu cuenta                        │
│  Tu nombre                        │
│  [ Agregar tu nombre ]            │
│  +52 55 1234 5678                  │
│  [ Cerrar sesión ]                │
└───────────────────────────────┘
```
**"Tu equipo" (new, §2.7 — `product-decisions.md` Q24/Q25), present identically on both Paid-tier vista-principal variants, absent entirely on the Free-tier vista principal.** Count line reads "2 personas vendiendo contigo" from `BusinessMembership.status = active` rows only — a pending invitation or a revoked row doesn't count toward it. Zero active members reads "Nadie más vendiendo contigo todavía," never a bare "0." Opens §3.11.

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
│  Tu equipo                        │
│  2 personas vendiendo contigo     │
│  [ Ver equipo ]                   │
│ ── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ── │
│  Tu cuenta                        │
│  Tu nombre                        │
│  [ Agregar tu nombre ]            │
│  +52 55 1234 5678                  │
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

### 3.3b Editar tu nombre — sheet (new, `decision-log.md` D69)
```
┌───────────────────────────────┐
│ ← Configuración                  │  dimmed, visible underneath
│  Tu cuenta                        │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Tu nombre                        │
│   [ Juan Pérez            ]        │
│  Así te van a reconocer en Resultados │
│  y en Tu equipo.                     │
│  [ Cancelar ]     [ Guardar ]        │
└───────────────────────────────┘
```
Reuses `inventory.md` §3.4a/§3.4b's exact dimmed-backdrop sheet shape — no new sheet pattern invented, the same composition-of-precedented-primitives reasoning `onboarding.md` §2.2b already applies to its own device-upload affordance. Pre-filled with the current `User.displayName` if one is set, blank otherwise. Plain text entry, no format constraint.

"Guardar" writes `User.displayName` directly and closes the sheet, updated — reuses §3.9/§3.10's shared near-instant/slow/error write template, with its own copy variant ("No pudimos guardar tu nombre. Intenta de nuevo."), the same retry-safety guarantee every other write in this document carries. **Corrected 2026-09-15 (`reviewer` Important, closed) — the mechanism, not just the guarantee, was overstated.** This write is satisfied by natural idempotency (an unconditional overwrite: any number of retries converge to the identical end state, no duplicate-creation risk) rather than a client-supplied idempotency key — unlike every other write in this document, which keeps the key parameter even where (as with `editPrice`/`setProductPhoto`'s own precedent) it's not used for a replay-cache branch. A failed save leaves the sheet open with her typed value intact, same convention as `inventory.md` §3.4a.

"Cancelar" discards the edit and returns unchanged — nothing written. **Clearing the field to empty and tapping "Guardar" removes the name** (writes `null`) — no separate "Quitar" control, since this is a plain text field, not a file selection; the same low-stakes, fully-reversible posture `onboarding.md` §3.9a's own "Quitar" has for a genuinely different input type.

Available identically regardless of role or `subscriptionTier` (§2.5) — reached from either "Tu nombre" state in §3.3a/§3.6.

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
│  Tu nombre                        │
│  [ Agregar tu nombre ]            │
│  +52 55 1234 5678                  │
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

### 3.11 Tu equipo — vista principal

```
Resolving (near-instant / slow) — same convention as every other read in
this document (§3.1/§3.2):
┌───────────────────────────────┐        ┌───────────────────────────────┐
│ ← Configuración                 │        │ ← Configuración                 │
│  Tu equipo                       │        │  Tu equipo                       │
│  ▢▢▢▢▢▢▢▢▢▢▢▢                      │        │  Un momento…                     │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```

```
┌───────────────────────────────┐
│ ← Configuración                 │
│  Tu equipo                       │
│  [ Invitar a alguien ]           │
│                                   │
│  Juan Pérez                       │
│  Vendiendo contigo    [ Quitar ] │
│                                   │
│  55 1234 5678                     │
│  Vendiendo contigo    [ Quitar ] │
│                                   │
│  Invitación pendiente             │
│  Para ana@correo.com · creada     │
│  el 13 sep       [ Editar correo ]│
│                     [ Cancelar ]  │
│                                   │
│  Invitación pendiente             │
│  Creada el 5 sep · sin correo      │
│  asignado — cualquiera que abra    │
│  el enlace puede aceptarla.         │
│               [ Agregar correo ]    │
│                     [ Cancelar ]     │
│                                   │
│  Invitación caducada              │
│  Creada el 10 sep     [ Generar otra ] │
│                                   │
│  55 2222 3333                     │
│  Ya no vende contigo              │
│                                   │
│  Invitación cancelada             │
│  Creada el 8 sep                  │
└───────────────────────────────┘
```

**Empty state** (no `Invitation`/`BusinessMembership` row has ever existed for this Business) — unchanged, kept verbatim: "desde su propio teléfono" already referred to her own device, not a phone-*identity* claim, so it stays accurate under the token model:
```
┌───────────────────────────────┐
│ ← Configuración                 │
│  Tu equipo                       │
│  Todavía nadie vende contigo.     │
│  Invita a alguien de tu confianza │
│  para que registre ventas también,│
│  desde su propio teléfono.        │
│  [ Invitar a alguien ]            │
└───────────────────────────────┘
```

- **Five row states now, each a pure read, never a merchant choice** (widened from three — RFC 0013/D64 corrected here, not just field-path). **`Invitation.status = accepted` deliberately has no row of its own** (`ux-critic`-caught gap, closed 2026-09-13) — accepting is an atomic write (RFC 0013 §2 step 6) that creates the active `BusinessMembership` in the same transaction that flips the `Invitation`, so the person simply appears as a new "Vendiendo contigo" row instead; nothing stays visible under its old pending identity:
  - `BusinessMembership.status = active` → identity line per §2.7's resolved resolution order (`User.displayName` → phone → "Alguien de tu equipo") + "Vendiendo contigo" + `[ Quitar ]`.
  - `Invitation.status = pending` **and not yet expired** → "Invitación pendiente" + creation date, plus one of two variants (**corrected 2026-09-15, RFC 0014/D70** — supersedes the previous "only if one was set" framing, which described `targetHint` as purely optional): **`targetHint` set** (the ordinary case for every Invitation created after this shipped, since `create_invitation()` now rejects a null value) → "Para {targetHint}" + `[ Editar correo ]` + `[ Cancelar ]`; **`targetHint = null`** (a legacy row, created before this shipped, exempt from the acceptance-time check per RFC 0014's own backward-compatibility rule) → "Creada el {date} · sin correo asignado — cualquiera que abra el enlace puede aceptarla." + `[ Agregar correo ]` + `[ Cancelar ]` — stated as a plain fact about how this one row still behaves, per `tone-of-voice.md`'s "state facts before offering an opinion," never phrased as a warning. **No phone number is ever shown here** — `Invitation` carries none anymore (RFC 0013).
  - `Invitation.status = pending` **and past `expiresAt`** (a read-time derivation, `status = pending AND now > expiresAt` — §2.7a; never a written value) → "Invitación caducada" + creation date, plus "Para {targetHint}" only if one was set + `[ Generar otra ]`. No `[ Cancelar ]` on this row — the link is already unusable, so cancelling it would be a no-op action offered for nothing.
  - `Invitation.status = revoked` → "Invitación cancelada" + creation date, no action — reached via §3.12d.
  - `BusinessMembership.status = revoked` → identical identity resolution + "Ya no vende contigo," no action (no reactivation mechanism is designed, per `product-decisions.md` Q24/Q25).
- **`targetHint`, when shown, is always framed as "Para {value}," never "Enviado a {value}"** — deliberate: Nahui never automatically emailed anything (§2.7, "What 'Invitar a alguien' writes"; RFC 0013 §1's Business Decision #1), so "enviado" would overstate what actually happened. "Para" states only what Ana herself typed as a memory aid.
- **Row order:** active Memberships, then pending Invitations, then expired Invitations, then revoked Memberships, then cancelled Invitations — deterministic, by date within each group, never Ana-sorted (`global-principles.md`, "every repeated decision should become automation"). Both terminal groups (revoked Memberships, cancelled Invitations) sit last, since neither offers an action; the two still-actionable groups (pending, expired) sit ahead of them.
- **No delete/hide action on a revoked Membership row or a cancelled/expired Invitation row** — same non-deletion discipline as `subscriptionTier` history; every one of them stays visible, clearly labeled, forever.
- **A still-pending row never offers "Copiar enlace" again.** RFC 0013 §4 requires the token stored hashed at rest, never raw — the plaintext link is only ever retrievable once, at generation time (§3.12c). If Ana needs to reshare a link that's still valid but that she's lost, her only path is the always-available top-level `[ Invitar a alguien ]` CTA to create a fresh, independent invitation (nothing structurally prevents two simultaneously-valid Invitations for the same Business — RFC 0013's own uniqueness is global on `token`, not per-recipient).

### 3.12 Nueva invitación

```
┌───────────────────────────────┐
│ ← Tu equipo                     │
│  Nueva invitación                │
│  Esta persona va a poder abrir    │
│  sus propias sesiones de venta     │
│  y registrar ventas desde su        │
│  propio teléfono, usando tu          │
│  mismo Catálogo y tus mismos          │
│  precios.                              │
│                                          │
│  Correo electrónico                      │
│  [ __________________ ]                  │
│  Para que solo esa persona pueda           │
│  aceptarla, aunque alguien más llegue       │
│  a tener el enlace.                          │
│                                                │
│  [      Generar invitación      ]  (disabled  │
│                                until it looks  │
│                                like a real     │
│                                email)          │
└───────────────────────────────┘
```

**Opening paragraph is preserved verbatim from the retired phone-entry screen** — the same "esta persona va a poder..." sentence `authentication.md §3.10` already mirrors from the invitee's side (`global-principles.md`, "capture business truth once, reuse it forever"). That cross-reference still holds correctly after this rework: no correction needed there (§8, item 10).

**Corrected 2026-09-15 (`product/99-rfc/0014-invitation-target-hint-enforced.md`, Accepted, `decision-log.md` D70) — the button is now gated on the field, reversing the structural departure this paragraph previously described.** `create_invitation()` rejects a null `targetHint` going forward, so "Generar invitación" stays disabled until the typed value passes the identical loose format check `authentication.md §3.2e`'s own email field already uses (at least one character before "@", an "@", at least one character before a final ".", at least one character after it) — the same "disabled-until-valid, no new validation pattern invented" discipline this document family already holds itself to everywhere else. This is a real, honest trade against RFC 0013's own earlier simplification, not a silent reversal: the Product Owner explicitly accepted this friction ("I think email is fine," `decision-log.md` D70) in exchange for closing a real, freshly-confirmed leaked-link exposure — the field's *validity* gate is what's new; its still-non-blocking soft-duplicate advisory (below) is unaffected.

Inline validation, shown in place (same discipline as `authentication.md §3.2f`'s own inline invalid-email message — no navigation, no dedicated error screen):
```
Correo electrónico
 [ ana@corr         ]
 Verifica el correo — parece que le falta
 algo.
[      Generar invitación      ]   (disabled)
```
```
Correo electrónico
 [ ana@correo.com    ]
 Ya tienes una invitación pendiente con
 este correo. Puedes crear otra invitación
 de todas formas si quieres.
```
**The duplicate-pending-row advisory (second block above) stays non-blocking, unaffected by this correction** — required-ness and duplicate-detection are two independent questions; only the first changed.
**Wording corrected 2026-09-13 (`reviewer` Suggestion, closed)** — "generar otra" was reused here for a genuinely different operation than the identically-worded `[ Generar otra ]` CTA on an expired row (§3.11): this advisory means *create a brand-new, independent Invitation*, while the row action means *mutate this same Invitation in place* (§4). Reworded to "crear otra invitación" to avoid the collision, matching this document's own established discipline of distinguishing near-identical actions by name (§10's "Invitar a alguien" vs. "Nueva invitación" precedent).
The second is a soft, optional nicety, not a structural check — RFC 0013 §4/Domain-model additions are explicit that uniqueness on `(businessId, targetHint.value)` is "an optional, soft UX-level duplicate-pending-row nicety... not a hard invariant," reused here exactly as scoped.

Write path: `[ Generar invitación ]` → guardando (§3.12a) → error (§3.12b) → success → Invitación lista (§3.12c).

### 3.12a Generando invitación — near-instant / slow
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │      Generando…                 │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
Own copy variant, distinct from §3.9's "Guardando…" — a link/token is being produced, not a stored capability flipped. Same near-instant/slow convention as every other write in this family.

### 3.12b Error al generar invitación
```
┌───────────────────────────────┐
│  No pudimos generar la            │
│  invitación. Intenta de nuevo.      │
│      [   Reintentar   ]              │
└───────────────────────────────┘
```
Same idempotent-retry guarantee §3.10's shared shape already carries (`architecture-principles.md` #7, `decision-log.md` D30) — a retried generation attempt must never risk creating two live tokens for one confirming tap.

### 3.12c Invitación lista
```
┌───────────────────────────────┐
│ ← Tu equipo                     │
│  Invitación lista                │
│  Comparte este enlace con la       │
│  persona que va a vender contigo.    │
│  Solo ana@correo.com va a poder        │
│  aceptarlo, aunque alguien más llegue   │
│  a tenerlo.                              │
│                                           │
│  nahui.app/invite/8fK3x91Q...             │
│                                             │
│  [   Copiar enlace   ]                      │
│  [   Compartir...    ]                       │
│                                                │
│  Este es el único momento en que vas a         │
│  poder ver este enlace — guárdalo o             │
│  compártelo ahora. Deja de funcionar 24           │
│  horas después de creado.                          │
│                                                        │
│  [        Listo        ]  (disabled until Copiar       │
│                             enlace or Compartir has      │
│                             fired at least once)          │
└───────────────────────────────┘
```
- **The link display shown here is illustrative** — exact truncation width/format is `ui-designer`'s call at Medium-Fidelity, not fixed here. The route shape itself (`nahui.app/invite/<token>`) mirrors RFC 0013 §2's own worked example; RFC 0013 explicitly leaves the exact route shape to `ux-designer`/`ui-designer`, not fixed at the architecture layer.
- **"Compartir..." opens the device's own native share mechanism** (WhatsApp, SMS, correo, or any other installed app) — which apps actually appear is device-controlled, not something Nahui lists or names explicitly, the same "below this document's abstraction level" treatment `authentication.md §2.3` already gives OTP delivery mechanics.
- ~~"El enlace funciona para cualquiera que lo abra — compártelo solo con la persona de tu confianza" states RFC 0013's own accepted-risk posture plainly, once, at the one moment it's actionable (RFC 0013 §4 — a forwarded/leaked link is a named, accepted risk at current pilot scale, not a structural guarantee this document can offer). Stated as fact, not warning-styled ceremony (`brand/tone-of-voice.md`, "state facts before offering an opinion"). **Wording corrected 2026-09-13 (`brand-guardian` finding, Minor, closed)**...~~ **Superseded 2026-09-15 (`product/99-rfc/0014-invitation-target-hint-enforced.md`, Accepted, `decision-log.md` D70) — this line was left uncorrected when §3.12's own copy changed, and directly contradicted it (`ux-critic` Blocker, closed same day).** RFC 0013's accepted-risk posture ("anyone who opens it can accept") is no longer true — D70 requires the exact `targetHint` email to authenticate before acceptance succeeds (`authentication.md §3.2g/§3.10f`). Telling Ana the old, now-false fact right after she typed a required email specifically to prevent it would actively mislead her at the one moment this matters most. Corrected to state the real, current guarantee: "Solo {targetHint} va a poder aceptarlo, aunque alguien más llegue a tenerlo." Still a plain factual statement, not warning-styled ceremony (`brand/tone-of-voice.md`, "state facts before offering an opinion") — the register this line has held since 2026-09-13 is unaffected, only its content is corrected.
- **"Este es el único momento en que vas a poder ver este enlace" is a real, structural constraint, not manufactured urgency** — RFC 0013 §4 requires the token stored hashed at rest, never raw, so the plaintext is genuinely unrecoverable after this screen. Stated once, plainly, no exclamation, no countdown framing (`brand/tone-of-voice.md`, "never use urgency Nahui hasn't earned" — this is a factual, one-time disclosure of a real constraint, not the manufactured-scarcity pattern that rule targets).
- **"Listo" is gated on having tapped "Copiar enlace" or "Compartir" at least once — corrected 2026-09-13, `ux-critic`-raised, `knowledge-mentor`-confirmed (§8, item 18).** The original draft left it ungated, defended only by brand-tone reasoning ("respects the vendor's intelligence") — `ux-critic` correctly named this as a usability-safety question a tone citation can't settle on its own. Research converged from two independent directions: general practice for one-time, non-recoverable secrets (password managers, 2FA backup codes, API-key-generation flows) uniformly gates the dismiss/continue action, grounded in Norman's "forcing function" principle (block-until-acknowledged for high-cost, irreversible errors) and Nielsen's error-prevention-over-warning heuristic; and this exact project already holds itself to the identical standard elsewhere — `settings.md §3.14`'s own earlier fix moved that screen from a silent, unconfirmed exit mechanism to one that positively confirms before letting her go, for the same underlying reason (a passive warning alone proved insufficient once a real interruption-prone user was the actual audience). Once either action fires, "Listo" enables — no forced navigation into Compartir's own native OS flow, no requirement to actually complete a share, only to have started one.
- **Interruption before she taps Copiar/Compartir/Listo (`ux-critic`-caught gap, closed 2026-09-13) — stated plainly, a real named limitation, not left silent.** Unlike every other in-progress flow in this family (`ux-pattern-conventions`'s standing "resumes pixel-identical" guarantee), this screen's content cannot be resumed the ordinary way if the app is closed or reloaded before she acts: RFC 0013 §4 requires the plaintext link to exist only in this one render — it's never re-fetchable from the server once this moment passes, by design (the token is stored hashed). If she backgrounds the app and it's later reloaded fresh (not merely backgrounded in a way the OS keeps alive), the link is genuinely gone — she'd return to §3.11 and find a still-"Invitación pendiente" row with no link she can retrieve, and would need `[ Generar otra ]` (only available once it's `caducada`) or, in the interim, re-open "Nueva invitación" for a fresh one. Not designed around further here — named so it isn't discovered as a silent gap later.
- `[ Listo ]` → back to §3.11, new "Invitación pendiente" row.

### 3.12d Cancelar invitación — confirmar
```
┌───────────────────────────────┐
│ Tu equipo                       │  dimmed, still visible underneath
│  ¿Cancelar esta invitación?       │
│  Nadie va a poder usar este         │
│  enlace después de esto.             │
│      [ No ]   [ Sí, cancelar ]        │
└───────────────────────────────┘
```
Same dimmed-overlay, two-button shape as §3.7/§3.8/§3.13 — states the real, honest consequence plainly. `[ Sí, cancelar ]` → guardando (§3.9's shared template — a plain status flip, not a generation write) → error (§3.10's shared template, copy variant "No pudimos cancelar la invitación. Intenta de nuevo.") → success → back to §3.11, that row now "Invitación cancelada." Writes `Invitation.status: pending → revoked` — closes §8 item 11.

**"Generar otra" (expired-row action) reuses §3.12a/§3.12b/§3.12c directly, with no separate confirm screen and no intervening form** — see §4 for the full branch. Closes §8 item 12.

### 3.12e Editar correo / Agregar correo — sheet (new, RFC 0014/D70)
```
┌───────────────────────────────┐
│ ← Tu equipo                     │  dimmed, visible underneath
│  Invitación pendiente             │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Correo electrónico                │
│   [ ana@correo.com        ]         │
│  Para que solo esa persona pueda     │
│  aceptar la invitación.               │
│  [ Cancelar ]     [ Guardar ]          │
└───────────────────────────────┘
```
Reuses §3.3b's exact dimmed-backdrop, pre-filled-field, Cancelar/Guardar sheet shape — no new sheet pattern invented, the same composition-of-precedented-primitives reasoning that document's own D69 amendment already applied. Reached by tapping either `[ Editar correo ]` (targetHint already set) or `[ Agregar correo ]` (a legacy, hint-less pending row) on §3.11 — same sheet, same field, differing only in whether it opens pre-filled or blank.

**Deliberately not the same as §3.3b's own "Tu nombre" pattern on one point: clearing the field to blank does not save.** `User.displayName` is a genuinely optional, person-level fact, so §3.3b lets an empty save clear it. `Invitation.targetHint` is required for every Invitation created after this shipped and is only ever exempt-by-history for an old legacy row — this sheet never offers a way to *remove* a hint that's set, or to save a blank value onto a legacy row, since doing so would silently defeat the protection RFC 0014 exists to add. "Guardar" stays disabled until the typed value passes the same loose format check §3.12 already uses.

"Guardar" writes `Invitation.targetHint` directly, on the same still-`pending` row — no token regeneration, no `expiresAt` reset (the exact mechanism RFC 0014 itself names: "she can correct `targetHint` on the still-pending row via an ordinary UPDATE, the existing OWNER-scoped `invitations_update` RLS policy already permits this, no new RPC needed") — and closes the sheet, updated. Reuses §3.9/§3.10's shared near-instant/slow/error write template, copy variant "No pudimos guardar el correo. Intenta de nuevo." A failed save leaves the sheet open with her typed value intact, same convention as §3.3b.

"Cancelar" discards the edit and returns unchanged — nothing written.

Not available on an expired, revoked, or cancelled row — only a still-`pending`, not-yet-expired row carries this action, since a dead or resolved Invitation has nothing left for a corrected hint to protect going forward. (Regenerating an expired row via "Generar otra," §3.12d's own neighbor, reuses `regenerate_invitation()` — RFC 0014 confirms this RPC "never touches `target_hint`" — so a regenerated legacy row stays legacy until she separately opens this sheet on the now-freshly-pending row.)

### 3.13 Quitar a alguien — confirmar

```
┌───────────────────────────────┐
│ Tu equipo                       │  dimmed, still visible underneath
│  ¿Quitar a 55 1234 5678 de tu     │
│  equipo?                           │
│  Ya no va a poder abrir sesiones   │
│  de venta ni registrar ventas       │
│  desde su teléfono. Las ventas       │
│  que ya registró siguen exactamente  │
│  como están — no se pierde nada.      │
│      [ Cancelar ]   [ Sí, quitar ]     │
└───────────────────────────────┘
```

Same dimmed-overlay, two-button shape as §3.7/§3.8 — states the real, honest consequence (loses ability to act, going forward) and the real, honest guarantee (nothing she already sold is touched), mirroring "Volver al plan gratis"/"Cerrar sesión"'s established reassurance shape rather than a warning-styled dialog. `[ Sí, quitar ]` → guardando (§3.9) → error (§3.10, copy variant "No pudimos quitar a esta persona de tu equipo. Intenta de nuevo.") → success → back to §3.11, that row now reads "Ya no vende contigo," `[ Quitar ]` gone.

### 3.14 Acceso revocado — what the revoked SELLER's own device shows

Reached only from `home.md`'s own resolution (§2, new step 0) — never navigated into from within this document, never reachable by tapping anything in Configuración, since a Membership in this state has no read/write standing left to reach any of it.

```
┌───────────────────────────────┐
│  Nahui                          │
│  Ya no tienes acceso para         │
│  vender en este negocio.            │
│  Si crees que esto es un error,      │
│  habla con quien te invitó.           │
│      [   Entendido   ]                │
└───────────────────────────────┘
```

- **No header gear icon, no bottom nav, no back arrow** — the one state in the whole product where offering navigation elsewhere is correctly withheld: every other nav destination reads Business-scoped data this Membership has no standing reason to browse, and none of it helps her.
- **States the fact, never a diagnosis** — "ya no tienes acceso," never "fuiste despedida" or anything implying data loss or personal judgment. Same non-diagnostic discipline `home.md` §3.6a's capability-revoked mention already established.
- **"Entendido" is the one tap this screen offers — not a navigation, an acknowledgment (`brand-guardian` finding, remediated 2026-09-07; mechanism corrected same day after a real build surfaced the gap between the original wording and what a merchant actually experiences).** The original draft rendered this screen with zero tappable affordance at all, leaving her no way to signal she'd seen the message — a real violation of `character-bible.md`'s "Things Nahui always does": "gives her an honest way out of anything — no dead ends, no forced commitments." The fix stays inside this screen's own, already-correct restraint about navigation: every ordinary destination (nav bar, header, back arrow) is still correctly withheld, since every one of them reads Business-scoped data this Membership has no standing reason to browse. "Entendido" doesn't reach any of them — **it acknowledges the message instead, visibly confirming she's seen it and telling her plainly that she can close this tab herself, rather than claiming the app closes on her behalf (a guarantee no web/PWA mechanism can actually make for a tab she opened herself — a real merchant-user-tester walk confirmed this exact gap: a silent, unconfirmed `window.close()` attempt is indistinguishable from a broken button).** She still ends the moment on her own terms — the acknowledgment is what makes that felt, not an attempted auto-close. If she reopens Nahui afterward, Home's resolution (`home.md` §2 step 0) shows this identical screen again, unchanged — a stable, repeatable terminal state, now with an honest way to step away from it each time it's reached.
- **Does not touch her device's own phone session** (`authentication.md §2.1`) — this is about her Membership in *this* Business only. If she also holds a Membership in a different Business (`product-decisions.md` Q24/Q25, multi-Business membership), that Membership is completely unaffected — a real case neither this document nor `home.md` resolves into yet (no Business-switching surface exists), flagged in §8/§11, not designed here.
- **An already-open Session isn't forcibly interrupted.** Q24/Q25's settled architecture makes no change to `Session` itself; this document doesn't invent one. She reaches this screen the next time Home resolution runs fresh — an app reopen, or her next attempt to start a new Session — never mid-Sale.
- No "Reintentar" — this isn't a failed write, it's an accurate read of her current status; the only real next step (a conversation outside the app) is stated plainly rather than implying a button fixes it.

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

From "Tu equipo" (§3.11, Paid-tier only, reached via the vista principal's
"Ver equipo" row — §3.3a):

  [ Invitar a alguien ] → Nueva invitación (§3.12)
    → **[Corrected 2026-09-15, RFC 0014/D70]** Correo electrónico required
      — "Generar invitación" disabled until the typed value passes the
      loose format check; a format-invalid or soft-duplicate advisory
      shown inline (the format one blocking, the duplicate one still
      non-blocking, §3.12)
    → Generar invitación → guardando (§3.12a) → error (§3.12b) → Reintentar
    → success → Invitación lista (§3.12c), showing the generated link
        → [ Copiar enlace ] / [ Compartir... ] → device-level copy/share
          mechanism, outside this document's own scope — same screen,
          tappable any number of times before leaving
        → [ Listo ] → back to §3.11, new "Invitación pendiente" row

  [ Editar correo ] on a pending row with a hint set, or
  [ Agregar correo ] on a legacy pending row with none → Editar correo (§3.12e)
    → Cancelar → back to §3.11, untouched
    → Guardar → guardando (§3.9) → error (§3.10) → Reintentar
    → success → back to §3.11, row's own targetHint updated in place

  [ Cancelar ] on a still-pending, not-yet-expired row → confirmar (§3.12d)
    → No → back to §3.11, untouched
    → Sí, cancelar → guardando (§3.9) → error (§3.10) → Reintentar
    → success → back to §3.11, that row now "Invitación cancelada"

  [ Generar otra ] on an expired row → guardando (§3.12a) → error (§3.12b)
    → Reintentar → success → Invitación lista (§3.12c), showing the new
      link — no intervening form screen, since nothing new needs typing
      (the expired row's own targetHint, if it had one, carries forward
      automatically — global-principles.md, "never ask twice") → [ Listo ]
      → back to §3.11, **that same row** now reads "Invitación pendiente"
      again (`ux-critic`-caught branch-destination gap, closed 2026-09-13:
      "Generar otra" mutates the existing Invitation in place — same
      `id`, freshly-generated `token`, `status` reset to `pending`,
      `expiresAt` reset — never a second, independent Invitation. This
      is the write-semantics choice that actually makes the regenerate
      affordance read as "fixing this offer," not as leaving a dead
      "Invitación caducada" row sitting next to an unrelated new one;
      RFC 0013 itself didn't fix this mechanic, left to this document.)

  [ Quitar ] on an active row → confirmar (§3.13)
    → Cancelar → back to §3.11, untouched
    → Sí, quitar → guardando (§3.9) → error (§3.10) → Reintentar
    → success → back to §3.11, that row now "Ya no vende contigo"

  Back arrow ("← Configuración") → vista principal (§3.3a), untouched

From home.md §2's new step 0 (this device's own Membership is revoked):
  → §3.14 (Acceso revocado) directly — no path back into any other state
    of this document, or of home.md, exists from here.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. ~~Entry — session-controls sheet, Home idle/cold-start/Event-active-no-Session states~~ — **Retired 2026-08-15** (see status header): the header's gear icon (⚙) now routes directly into item 4 below for these states too, no sheet.
3b. Editar tu nombre — sheet (§3.3b, new, `decision-log.md` D69)
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
14. Tu equipo — vista principal (empty, or with pending/expired/active/revoked rows), plus its own near-instant/slow resolving pair
15. Nueva invitación — entry form, **required** email `targetHint` field (corrected 2026-09-15, RFC 0014/D70), blocking format advisory + non-blocking soft duplicate advisory
15a. Generando invitación — near-instant / slow
15b. Error al generar invitación
15c. Invitación lista — generated link, copiar/compartir, one-time-display notice
15d. Cancelar invitación — confirmar
15e. Editar correo / Agregar correo — sheet (§3.12e, new, RFC 0014/D70)
16. Quitar a alguien — confirmar
17. Acceso revocado (reached only via home.md §2 step 0)
17a. Acceso revocado — tras tocar "Entendido" (button disabled/relabeled "Entendido ✓," inline "Ya puedes cerrar esta pestaña." confirmation shown; resets to 17 on a fresh app open, per this state's own "stable, repeatable terminal state" requirement)

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

Every action in this table now shares an identical 2-tap floor, measured at this document's own boundary. The one previous exception — Activar venta con tags's code-entry requirement — is gone along with the path itself (`decision-log.md` D27): `defaultSellingMode`'s two directions are pure toggles like every other immediate-effect action, with no real fact left to type. Configuración was, until this amendment, the one document in this family where every merchant-initiated action, without exception, cost exactly two taps. That's no longer quite true, named plainly rather than left stale: "Generar otra" (below) is a single deliberate exception, reasoned the same way `authentication.md §3.10`'s zero-tap "Ahora no" already is — nothing to disclose, nothing at risk. Every other action in this document, including every other part of "Tu equipo," still holds the uniform two-tap floor. **Rows updated for §2.7's RFC 0013/D64 rework:**

| Action | Taps | Why it can't be fewer |
|---|---|---|
| Invitar a alguien | **4** (Invitar a alguien → Generar invitación → Copiar enlace *or* Compartir → Listo) | **Corrected 2026-09-15, RFC 0014/D70** — the tap floor itself is unchanged (typing the email isn't a counted tap, per this table's own convention of counting button-presses, not keystrokes — the same convention that already lets the phone-entry floor count "Enviar código" as one tap despite ten typed digits). What changed: the email is no longer skippable — "Generar invitación" now stays disabled until a plausible address is typed, the same disabled-until-valid gate `authentication.md §3.3`'s phone field already uses. §3.12c's one-time-link display remains a required screen: reaching a usable "Invitación pendiente" state requires acting on the link (Copiar or Compartir, gated per §8 item 18) before "Listo" enables. |
| Corregir el correo de una invitación pendiente (Editar correo / Agregar correo) | 2 (tap the row action → Guardar) | New, RFC 0014/D70 — the OWNER-side repair path the RFC names by name: a typo'd or missing `targetHint` is fixed with one edit, never a full cancel-and-recreate. Same two-tap floor as every other real commitment in this document. |
| Generar otra (regenerate an expired Invitation) | 1 | The one deliberate exception to this document's otherwise-uniform two-tap floor, reasoned explicitly, not a gap: nothing new needs disclosing (she already saw and accepted the consequences once, when she first created the invitation being replaced), and nothing is lost or put at risk by tapping it — mirrors why `authentication.md §3.10`'s "Ahora no" already costs zero taps ("nothing is lost or destroyed"), the identical reasoning applied to the positive-activation side. |
| Cancelar invitación | 2 (Cancelar → Sí, cancelar) | Same floor as "Quitar a alguien" — a real, if only-ever-history-preserving, commitment gets one confirming tap. |
| Quitar a alguien | 2 (Quitar → Sí, quitar) | Same floor — a real, if reversible-in-history-only, commitment gets one confirming tap. |

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
- Whether "Tu equipo" appears in the vista principal at all — a pure read of `subscriptionTier`, same derivation discipline as `defaultSellingMode`'s `nfc` option (§2.7).
- Which action a "Tu equipo" row offers (`Quitar`, or nothing) — a pure read of `BusinessMembership.status`/`Invitation.status`, never Ana's own interpretation.
- Row order in "Tu equipo" — deterministic (active → pending → expired → revoked → cancelled, by date), never manually sorted.
- `Invitation.role` is never asked — always written `SELLER`, since no second value exists to choose between.
- Her own verified phone number is displayed automatically in "Tu cuenta" — never something she has to ask support for, guess from memory, or reconstruct from the original OTP screen.
- Whether an Invitation row shows as pending, expired, active, or revoked — a pure read-time derivation (`status = pending AND now > expiresAt` for "expired," per RFC 0013 §4/D64), never something Ana marks herself.
- Which action a pending/expired Invitation row offers ("Cancelar," "Generar otra," or nothing) — computed automatically from that same derived state, the identical discipline this document already applies to an active/revoked Membership row's own action.
- The token itself — generated, formatted, and (per RFC 0013 §4) stored hashed entirely by Nahui; Ana never sees, types, or handles anything about it beyond the finished shareable link.
- The soft duplicate-`targetHint` advisory (§3.12) — a pure read of existing pending rows, shown automatically, never something she has to check for herself.
- Whether a pending row offers "Editar correo" or "Agregar correo" — a pure read of whether `targetHint` is currently set, never something Ana has to remember or check for herself (RFC 0014/D70).

## 8. Open questions

None of the items below block this document's completion.

1. **Q11** (`company/business-decisions.md`, Open) — the specific per-transition immediate/deferred assignment in §2.2's table is illustrative, not final, blocked on a pricing/billing-cycle model that doesn't exist in the Foundation yet.
2. **The specific external-payment channel is deliberately left unnamed** in §3.4's "Activar plan de pago" copy — a business-model detail to fill in once decided.
3. **Resolved, kept for continuity — the required `home.md` amendment landed.** §2.1 originally flagged that extending the entry-point affordance (then the header's "▾") to every Home header state except §3.1/§3.2/§3.12/§3.14 required a small, additive amendment to `home.md`'s own approved wireframes (same category as `decision-log.md` D23's amendment to `inventory.md`) — that amendment landed (`home.md`'s own status header, "Amended for `settings.md` §2.1"). **Further update, 2026-08-09:** the entry-point trigger itself relocated from the header's "▾" to a top-right "⋯" icon opening the identical sheet, with a gear icon ("⚙") added to the sheet's "Configuración" row specifically (Product Owner decision) — the matching `home.md`-side amendment for this relocation is performed in the same pass as this correction; see `home.md`'s own status header and §10 for the full reasoning, including why "⋯" was chosen over a hamburger icon. **Further update, 2026-08-14 (Product Owner-raised, `home.md`'s own "Cerrar jornada de venta" discoverability fix):** the entry point itself now differs by Home state rather than sharing one uniform shape everywhere. During an active Session, tapping the icon (now "⚙" for this state specifically) routes directly into Configuración with no intermediate sheet at all, since "Cerrar jornada de venta" moved to its own direct header button and left the sheet with a single entry; outside an active Session, the "⋯" icon and its one-entry sheet (§3.3) are unchanged. The matching `home.md`-side amendment is performed in the same pass — see that document's own status header, §2, §3.6c, and §10 for the full reasoning, including why a gear replaces the ellipsis specifically for the active-Session case.
4. **Whether the pending-change-lands acknowledgment (§2.4) should ever surface anywhere outside Configuración itself** (a badge, a notification) — not designed here, no evidence yet the in-surface acknowledgment is insufficient.
5. **Resolved, kept for continuity — a `defaultSellingMode` control is now designed here.** `decision-log.md` D27 extended self-service editability to this field: §2.2/§2.3/§3.4/§3.6 now specify it directly, as an immediate-effect action with no pending-change structure, constrained to whichever modes `subscriptionTier` currently makes available. The gap this item originally flagged (D25/Q5 resolving exactly three capabilities, none of which was `defaultSellingMode`) is closed — kept here, marked resolved, so the record of what was once genuinely out of scope stays visible rather than silently disappearing.
6. **Whether signing out should interlock with an active, non-empty Sale or Session** — `home.md §3.11a` already blocks the Selling-Session close the moment "Venta actual" holds 1+ items, precisely because that action would otherwise silently put unfinished work at risk. §2.5 above states plainly that signing out never touches Selling data — the Session and its Venta actual stay exactly as they are, waiting for the same phone to re-verify (§2.5a) — so no *data* is at risk the way HOME-M2 was designed to prevent. Whether it's still worth warning her that a customer may be standing in front of her mid-Sale at the moment she chooses to sign out — a situational risk, not a data-loss one — isn't designed here. No evidence yet this is common enough to warrant its own interlock.
7. **Resolved, kept for continuity.** `authentication.md §2.2` case 2 (and its §4 flow line, §8/§11 references) previously described re-verifying an already-verified-on-this-device phone as theoretically unreachable. This action (§2.5) makes it reachable for the first time (§2.5a). The matching correction to that document was applied in the same pass — see its own status header and §2.2/§4/§8/§11.
8. **Resolved 2026-09-07 (Slice 12 `merchant-user-tester` defect).** A persistent, read-only display of her own verified phone number now exists in "Tu cuenta" (§2.5, §3.3a/§3.6) — `User.phone`, plain text, non-tappable, present in every vista-principal variant identically. Closes the want this item named on 2026-08-13 and the more severe defect a later Slice 12 walk surfaced once signing out became a routine part of the multi-Membership workflow (`authentication.md`'s own companion fix, §2.2/§3.7e, closes the other half).
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
10. **The acceptance-side flow's own real rework** (`authentication.md`) — genuinely undesigned still, and now a sharper gap than when this item was first written. RFC 0013/D64 already replaced `Invitation.phone` in the domain model itself; `authentication.md`'s own §2.1/§2.2/§2.2a/§3.10–§3.13a, as currently written, depend on that exact field (a phone-keyed lookup, and a `(businessId, phone)` uniqueness constraint that no longer exists at all) and do not compose cleanly against the now-Accepted model — confirmed directly against that document's actual text, not assumed. The citations most acutely affected: §2.1's device-level Invitation check and §2.2's case-0 routing (both depend on a phone-match mechanism the schema no longer supports), §2.2a step 1's re-check and step 2's multi-pending tie-break (the uniqueness constraint it tie-breaks against is gone), and §2.2a step 6's decline-memory marker (RFC 0013 §2 already reasons this should be eliminated outright under the new mechanism, not merely re-pathed, since nothing auto-surfaces an Invitation anymore). **One citation confirmed to still hold, named so it isn't mistakenly re-flagged:** §3.10's reuse of this document's "what a SELLER can do" sentence — that exact sentence is preserved verbatim in the redesigned §3.12, so no correction is needed there. **A second, smaller stale cross-reference, worth naming precisely:** §2.2a step 1's own parenthetical ("`settings.md §8` items 11/12 name this same gap from the issuing side") now points at two items this same amendment resolves — needs updating from "names this same gap" to "this gap is resolved from the issuing side," once `authentication.md` gets its own pass. "Tu equipo" is not end-to-end functional until `authentication.md`'s own token-based acceptance rework exists — a real, not-yet-started follow-on (RFC 0013 §6's own scope), out of this amendment. The row-display half of this document's own team-identification gap (§2.7's "Row display" paragraph) is resolved separately, 2026-09-15, `decision-log.md` D69 — unaffected by whether this item's own acceptance-flow rework ever lands.
11. **Resolved in this pass.** Cancelling a still-pending `Invitation` before it's accepted is now designed — §3.11's "Cancelar" action on a still-valid pending row, §3.12d's confirm screen, writing `Invitation.status: pending → revoked`. Bundled alongside RFC 0013's own token rework per that RFC's own explicit suggestion (§6) that this had become a natural, low-cost close once `revoked` already existed in the schema.
12. **Resolved in this pass.** `Invitation.status = expired`'s trigger is now defined (RFC 0013 §4/D64 — `expiresAt`, set at creation; `expired` itself stays a read-time derivation, `status = pending AND now > expiresAt`, never written) and given a real UI treatment: an expired row reads "Invitación caducada" and offers "Generar otra" (§3.11/§2.7a), rather than being silently indistinguishable from a still-live pending offer.
13. **Resolved, 2026-09-09 (`architect`), from existing Foundation precedent — no Product Decision needed.** An already-active SELLER `BusinessMembership` survives a Paid→Free downgrade entirely unaffected. `BusinessMembership.status` has exactly one specified write path — the OWNER-only "Quitar" action (D55: "only via the OWNER-only revoke action... no reactivation path designed") — with no second, tier-driven path anywhere in the Foundation, unlike `nfc`'s deliberate pure read-time derivation from `subscriptionTier` (D27). The Membership authorization gate (`domain-model.md` Key Mechanism, written in D56 *after* Q18's Paid-gating decision) checks existence and `status=active` only, naming no `subscriptionTier` condition. Q18/`settings.md` §2.7 both consistently gate *creating a new Invitation* on `subscriptionTier=paid`, never the *validity of an already-created Membership* — the same shape D40/D25 already established for Claim Tokens (generation stops on downgrade; existing Claims untouched). A downgrade gates future capability, never claws back already-granted state (D25's general invariant). §3.5's "Volver al plan gratis" copy correctly asserts nothing here — nothing changes for an existing SELLER, so there's nothing to disclose. **Real consequence, not just documentation:** `product/02-ux/events.md` §3.26's own affordances needed correcting to match — routed to `ux-designer`, applied 2026-09-10. Both "Ver personal de este evento" and "Asignar personal" are now present unconditionally, regardless of `subscriptionTier` — `ux-designer`'s own remediation pass corrected this entry's own initial framing here, which had conflated *assigning an already-active Membership to an Event* (`EventAssignment` creation, D60/RFC 0011 — gated only on `BusinessMembership.status = active`, never on tier) with *creating a new `Invitation`* (a separate write, reached from a separate screen, genuinely still Paid-gated). A grandfathered Free-tier Business with an active SELLER can both view and reassign that person to new Events; only inviting someone new stays behind the Paid gate. See `events.md` §3.26/§10 for the corrected design.
14. **Configuración/nav carries no role-based access gate at all today.** §2.7/§3.14 design the OWNER-only invite/revoke surface and the revoked-SELLER defensive state, but a full SELLER-specific stripped Home/nav experience isn't designed in this document — a materially larger, separate design gap, surfaced here rather than silently assumed solved.
15. **Multi-Business membership switching** (`product-decisions.md` Q24/Q25, item 1) — no surface designed anywhere yet; §3.14 states this plainly rather than pretending it's handled.
16. **Whether Nahui ever builds automated email delivery for a `targetHint`** (rather than Ana always sharing the link herself) — explicitly deferred, not a gap this document leaves accidentally open: RFC 0013's own Business/Product Decisions (§1) resolve this as a separable, optional future enhancement, deliberately not built now, the identical "don't gate a path on unvalidated infrastructure" lesson `company/business-decisions.md` Q19 already taught. `targetHint`'s schema shape already supports it without a migration, whenever it does land.
17. ~~Whether a soft post-acceptance mismatch warning... is worth designing~~ **Superseded 2026-09-15 (`product-decisions.md` Q30, `product/99-rfc/0014-invitation-target-hint-enforced.md`, Accepted, `decision-log.md` D70).** The "no evidence yet" posture this item held is directly overtaken — the Product Owner herself surfaced this live, testing the just-shipped feature, and resolved it as a hard block at acceptance time, not a soft warning: the Invitation-acceptance flow (`authentication.md`, that document's own §2.0/§2.2a/§3.2g/§3.10f) now authenticates specifically through `targetHint`, so a mismatch is prevented rather than merely flagged after the fact. See §2.7/§3.12/§3.12e above for the invite-creation-side correction this required.
18. **Resolved 2026-09-13.** §3.12c's "Listo" is now gated on Copiar enlace/Compartir having fired at least once — `ux-critic`-raised, `knowledge-mentor`-confirmed (general practice for one-time, non-recoverable secrets uniformly gates the dismiss action; Norman's forcing-function principle and Nielsen's error-prevention-over-warning heuristic both apply directly; this project already holds `settings.md §3.14` to the identical standard). The original ungated design, defended on brand-tone grounds alone, is corrected — see §3.12c.

## 9. Principle justification

**global-principles.md:**
- *"Never ask twice"* — a pending change's target capability is never re-asked when cancelling; the landing acknowledgment (§2.4) is shown exactly once; `defaultSellingMode`'s own value is never asked twice either — Session-start (`home.md` §2/§3.6a) already reads whatever she last set here, and setting it here never re-confirms a fact Session-start would otherwise have had to ask about.
- *"Business language before technical language"* — every screen uses "plan," "cómo vendes," never `subscriptionTier`, `registrationMode`, `defaultSellingMode`, or "entitlement," anywhere. "Clientes frecuentes" no longer appears as an action name in this document (`decision-log.md` D40) — only as a description of what "Activar plan de pago"/"Volver al plan gratis" affect.
- *"Capture business truth once, reuse it forever"* — `nfc`'s availability is captured exactly once, as `subscriptionTier`, and never re-captured as a second, independent fact anywhere in this document (`decision-log.md` D27) — the earlier design's NFC activation code confirmed the same underlying truth a second time, in a second place; removing it is this principle applied more completely, not a new application of it.
- *"The best interface stays out of the merchant's way"* — a failed capability save never drops an already-confirmed toggle, including a `defaultSellingMode` change (§3.10); cancelling a pending change is always reachable and never destructive to anything but the pending change itself (§3.7).
- **The SET-M1 fix, stated as its own principle-level point:** every piece of copy describing what client-tracking reveals is worded as a count/category ("cuántas... son frecuentes y cuántas ocasionales"), never an identity claim ("cuáles"/"quiénes son") — the same correction `reports.md` already made once (RPT2-MAJ1), applied consistently across every instance in this document, including the one a prior remediation round briefly reintroduced while fixing SET-M4.
- *"Capture business truth once, reuse it forever"* — extended to the new sign-out action: her Business, Catálogo, and historial de ventas are captured exactly once and never re-captured, reset, or discarded by signing out — the device-held session fact is the only thing this action ever touches (§2.5).
- *"Never ask twice"* — a same-device re-verification after signing out never re-runs Onboarding or re-asks anything already on record; it resolves straight through to wherever her existing Business already stood (§2.5a).
- *"Never ask twice"* — extended 2026-09-15 (D69): her own name, once set via §3.3b, is never asked again anywhere — `reports.md`/`Tu equipo` all read the same stored value.
- *"Capture business truth once, reuse it forever"* — extended to person-level truth (D69): `User.displayName` is captured once, either at Onboarding (OWNER) or here (SELLER or a self-editing OWNER), and reused everywhere identity resolves.

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream, never asked mid-flow)* — Configuración is the one deliberate exception D25/D27 carve out for merchant-initiated, explicit self-service change; no other screen re-asks any of the capabilities or settings managed here.
- *#4 (internal-only entities never leak into user-facing language)* — no capability is ever named by its technical field anywhere.
- *#6 (one-way dependency direction)* — this document only writes to Identity's Business Capabilities; it never designs a Selling/Inventory/Intelligence screen of its own. "Cerrar sesión" writes only to this device's own session fact, not part of the domain model at all (RFC 0007 §5's explicit infrastructure deferral) — it never reads or writes Selling, Inventory, or Intelligence data, the identical discipline the rest of this document already holds itself to. **"Cambiar a vender con tags" (§2.6) observes this identically** — corrected specifically to hold this line, per `decision-log.md` D46's Addendum: it writes `defaultSellingMode` and hands off a bare entry marker, never reading or querying `InventoryUnit`/Catalog state itself; the one check that decides her routing lives entirely inside `inventory.md`, which already legitimately owns it.

**brand-guide.md:**
- *Tone — "warm, direct, respects the vendor's intelligence"* — every deactivation confirmation states plainly what's lost without a warning-styled dialog; "Activar plan de pago"'s restored copy states plainly that this activates by confirming a payment arranged elsewhere, rather than omitting that fact. §3.8's sign-out confirmation states the one fact that matters (nothing is lost) plainly and up front, mirroring the reassurance shape "Volver al plan gratis" (§3.5) already established, rather than an apology-first or warning-styled dialog. §3.13's confirmation and §3.14's defensive state (§2.7) extend this same register to a materially higher-stakes moment (losing access, not just a mode) without diagnosing or moralizing about why.

**§2.7/§3.11–§3.14 additions:**
- *global-principles.md*, "never delete historical data" (D25) — extended to `Quitar`: a status flip, not a delete; `Sale.performedByMembershipId` keeps resolving unaffected. Same non-deletion discipline this document already applies to `subscriptionTier` history, and the same shape `Product.active`/`inactive` (Q21) already established.
- *global-principles.md*, "the fastest interaction is the one that never happens" — RFC 0013's reasoning here (no phone number, no role picker) stays true; **the "only an optional memory-aid field she may skip entirely" half is superseded 2026-09-15 (RFC 0014/D70)**: creating an Invitation now requires one typed, validated fact — the email — the real, named friction the Product Owner explicitly accepted ("I think email is fine," `decision-log.md` D70) in exchange for closing a freshly-confirmed leaked-link exposure. What's still true and unchanged: no phone number, no role picker, no second collection pattern reintroduced — the token itself is still generated, not collected.
- *global-principles.md*, "business language before technical language" — every "Tu equipo" screen says "vendiendo contigo," "ya no vende contigo," never "Membership," "Invitation," or "status." Extended to the new copy: "enlace," "invitación," "caducada," never "token," "expiresAt," or "targetHint" anywhere on screen.
- *architecture-principles.md* #7 (idempotent/keyed writes) — "Sí, quitar" reuses §3.9/§3.10's shared guardando/error/Reintentar template, the same D30-keyed-retry guarantee every other write in this document already gets; "Generar invitación," "Generar otra," and "Sí, cancelar" reuse the same template at §3.12a/§3.12b — a retried token-generation attempt must never risk creating two live Invitations for one confirming tap.
- *architecture-principles.md* #6 (one-way dependency direction) — this section writes only to Identity's `Invitation`/`BusinessMembership`; it never reads or writes Selling data. `Sale.performedByMembershipId` continuing to resolve after a revoke is Selling's own read, not something this document touches.
- **Superseded 2026-09-15 (`product/99-rfc/0014-invitation-target-hint-enforced.md`, Accepted, `decision-log.md` D70) — `targetHint` is no longer a pure memory aid.** "Correo electrónico" (no longer labeled "(opcional)") now gates "Generar invitación" on well-formed input and is checked as identity at acceptance time (`authentication.md`'s own concern). What's unaffected: the soft, non-blocking duplicate-pending-row advisory stays exactly as RFC 0013 scoped it — "an optional, soft UX-level duplicate-pending-row nicety... not a hard invariant" — required-ness and duplicate-detection are two independent questions, and only the first changed.
- *brand/tone-of-voice.md*, "state facts before offering an opinion" — the required field's own helper copy states the real reason plainly ("para que solo esa persona pueda aceptarla, aunque alguien más llegue a tener el enlace"), never framed as a scary security warning (RFC 0014/D70).
- *company/brand/brand-guide.md*, tone — "warm, direct, respects the vendor's intelligence" — §3.12c's one-time-display notice states the real constraint plainly, once, without manufactured urgency (`brand/tone-of-voice.md`, "never use urgency Nahui hasn't earned" — a factual, one-time disclosure of a real technical constraint is not the countdown-language pattern that rule targets). **"Listo" is force-gated on Copiar enlace/Compartir (corrected 2026-09-13, §8 item 18)** — this is a deliberate exception to "respects the vendor's intelligence" trumping every other consideration: `knowledge-mentor`'s research confirmed that for a one-time, non-recoverable secret, a forcing function is the established, correct pattern precisely because trusting-the-user's-attention is what fails for a realistically interrupted user, not a brand-tone call to make unilaterally.

**§2.5/§3.3a phone-number-display fix (Slice 12 `merchant-user-tester`, 2026-09-07):**
- *global-principles.md*, "never ask twice" — she never has to ask a teammate, guess from memory, or reverse-engineer which number this device is verified under — it's always right where she'd already look to sign out (§2.5, §3.3a).
- §3.3a's new phone-number line completes §3.8's own "no se pierde nada" promise in practice, not just in copy — she can always confirm which identity this device is holding, closing the exact trust gap a Slice 12 `merchant-user-tester` walk found this promise otherwise broke.

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
- **New §2.7 "Tu equipo" capability** — Paid-tier gated (`company/business-decisions.md` Q18, resolved 2026-09-06), OWNER-only invite/manage per the `product-decisions.md` Q24/Q25 permission table.
- **`BusinessMembership` revocation is a status flip (`active → revoked`), never a delete** (`product-decisions.md` Q24/Q25).
- **No reactivation path designed** — explicitly deferred, matching the settled architecture's own deferral.
- **No role picker on Invitar a alguien** — role is always `SELLER`.
- **New §3.14 "Acceso revocado" defensive state**, cross-referenced from `home.md` §2's new step 0. **Remediated same pass — a single "Entendido" acknowledgment tap added (`brand-guardian` finding): the original draft had zero tappable affordance, violating `character-bible.md`'s "no dead ends" rule; the fix stays a close/exit, not a navigation, since every other destination is correctly withheld from this Membership.**
- **§3.12's on-screen heading changed from "Invitar a alguien" to "Nueva
  invitación," differentiating it from §3.11's identically-worded CTA**
  (`ux-critic` finding) — same fix shape as HJR-INV-M1 (`inventory.md`
  §3.6/§3.7, "Registrar mercancía" → "Registro de mercancía"): the CTA is
  unchanged, the destination's passive title moves to a noun form so "go
  do this" and "you're now doing this" read as visibly different moments.
- **"Tu equipo" (§3.11) now has its own explicit near-instant/slow
  resolving pair**, closing a gap where it was the one read in this
  document without one (`ux-critic` finding).
- **Her own verified phone number is now shown, read-only, in "Tu cuenta" (2026-09-07, Slice 12 `merchant-user-tester` defect).** Elevates this document's own already-named Future Consideration (§8 item 8, first flagged 2026-08-13) from deferred to designed, paired with a companion fix in `authentication.md` §2.2/§3.7e. Plain text, non-tappable, `User.phone` — never editable here, since changing it isn't a Business Capability this document manages.
- **RFC 0013/D64: `Invitation`'s identity moves from `Invitation.phone` to `Invitation.token`.** §3.12's invite-creation screen no longer collects a phone number — it generates a secure link unconditionally, gated on nothing but the existing `subscriptionTier=paid`/OWNER-only checks already in place. §2.7/§3.11 corrected to match throughout.
- **A `targetHint` email field is added to invite-creation — optional, non-blocking, never gating the primary action, never matched against anything** (RFC 0013 §1). Real share affordances (copy link, native share sheet) are added at generation time (§3.12c), replacing the old design's silent "invitation sent" assumption.
- **§3.11's pending-row display no longer shows a phone number** — a generic "Invitación pendiente" + creation date, plus the `targetHint` email only when one was set, explicitly labeled and reasoned as an advisory-only memory aid, never a delivery confirmation.
- **§8 items 11/12 closed in this same pass, per RFC 0013's own suggestion.** A pending Invitation can now be cancelled (new §3.12d, writes `pending → revoked`); `Invitation.status = expired` now has a real, defined trigger (`expiresAt`, §2.7a) and a real row treatment ("Invitación caducada" + "Generar otra").
- **`expiresAt` default set to 24 hours, reasoned explicitly against both sides of the tension `knowledge-mentor` surfaced** (RFC 0013 §4/§7) — see §2.7a for the full reasoning; paired with a deliberately cheap, single-tap regenerate affordance rather than defaulting to either "days" or "hours" silently.
- **"Generar otra" is a deliberate, reasoned one-tap exception to this document's otherwise-uniform two-tap floor** (§6) — the positive-activation mirror of `authentication.md §3.10`'s already-zero-tap "Ahora no."
- **`authentication.md`'s own §2.2a/§3.10–§3.13a confirmed NOT to compose cleanly against the now-Accepted RFC 0013 domain model** — checked directly, not assumed (§8, item 10). Its own real rework is out of this amendment's scope, per RFC 0013 §6's own sequencing, and remains a named, not-yet-started follow-on.
- **"Tu nombre" (§2.5/§3.3a/§3.3b), self-service `User.displayName` capture/edit, added 2026-09-15, resolving `decision-log.md` D69/`product-decisions.md` Q29.** Deliberately not added to `authentication.md`'s Invitation-acceptance flow — reasoned explicitly in §2.5 against "the fastest interaction is the one that never happens." "Tu equipo" (§2.7/§3.11) now resolves identity through it first. **[see settings.changelog.md#status-2026-09-15-displayname-capture]**
- **RFC 0014/D70, 2026-09-15: `targetHint` becomes required at invite-creation, not optional — supersedes the earlier "optional, non-blocking, never gating the primary action, never matched against anything (RFC 0013 §1)" bullet above, on that one point only.** §3.12's field drops its "(opcional)" label, gates "Generar invitación" on a well-formed email, and its helper copy states the real reason. A new OWNER-side repair path (§3.12e) lets her correct a typo'd or missing `targetHint` on a still-pending row with one edit, writing `targetHint` in place with no token/expiry reset — the exact mechanism RFC 0014 names. A `pending` row created before this shipped, with `targetHint = null`, is exempt from the acceptance-time check (RFC 0014's own backward-compatibility rule) — §3.11 now distinguishes this legacy state with honest copy and an optional `[ Agregar correo ]` path to opt it in. **[see settings.changelog.md#status-2026-09-15-targethint-enforced]**

## 11. Future considerations

- Once Q11 resolves, assign `subscriptionTier`'s two directions to their actual immediate/deferred treatment and replace the illustrative examples in §3.4/§3.5.
- Whether the pending-change-lands acknowledgment needs an ambient signal beyond the in-surface one (§8, item 4).
- The `home.md` amendment this document specifies but doesn't perform (§2.1, §8 item 3) needs its own small pass through `home.md` directly.
- The actual payment-collection mechanism for the paid plan (§8, item 2) — a future Business Decision.
- `authentication.md`'s own real token-based Invitation-acceptance rework (§8, item 10) — a separate, not-yet-started follow-on, RFC 0013 §6's own scope.
- Whether a Paid→Free downgrade affects already-active SELLER Memberships (§8, item 13).
- Role-based access gating for Configuración/nav as a whole, once a SELLER-specific Home experience is actually designed (§8, item 14) — this is the largest real gap surfaced by this amendment.
- ~~A merchant-visible display name for a team member...~~ **Resolved 2026-09-15 (`decision-log.md` D69, `product-decisions.md` Q29)** — `User.displayName`, self-service via §2.5/§3.3b, resolved in "Tu equipo" per §2.7's corrected "Row display" paragraph.
- Multi-Business switching surface (§8, item 15).
- Whether "Cerrar sesión" should interlock with an active, non-empty Sale (§8, item 6) — not designed now, no evidence of need.
- Whether Nahui ever builds automated email delivery for `targetHint` (§8, item 16).
- ~~Whether a post-acceptance soft mismatch warning (`targetHint` vs. resolved identity) is worth designing (§8, item 17) — no evidence yet it's needed.~~ **Superseded 2026-09-15 (`product-decisions.md` Q30, `product/99-rfc/0014-invitation-target-hint-enforced.md`, Accepted, `decision-log.md` D70):** resolved as a hard block, not a soft warning — the Invitation-acceptance flow now authenticates specifically through `targetHint`, so a mismatch is prevented rather than merely flagged after the fact.
- ~~The phone-display gap on an active/revoked "Tu equipo" row once a SELLER can accept via a method other than phone (§2.7's "Row display" paragraph) — sharpened, not created, by this amendment; still unsolved, still needs a real `User` display-name field.~~ **Resolved 2026-09-15 (`decision-log.md` D69)** — `User.displayName` now resolves first; phone stays as the fallback beneath it; "Alguien de tu equipo" is the final, honest fallback for a `User` with neither.
