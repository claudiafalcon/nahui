# Home (Hoy) — UX Specification

Status: Approved. Full UX Remediation cycle complete (HOME-B1, HOME-B2,
HOME-M1, HOME-M2, HOME-M3, HOME-M4). **[Amended 2026-08-13 — see
home.changelog.md#status-full-ux-remediation-cycle]**

**Amended for `decision-log.md` D23** (Session-scoped selling mode: Selling
Mode Capability / Default Selling Mode / Session Operating Mode / NFC
Readiness — see `product/99-rfc/0003-session-selling-mode.md`). **[see
home.changelog.md#status-d23-session-scoped-selling-mode]**

**Amended for `decision-log.md` D20** (Venue aggregate root): every session
header shows `Venue.displayName` alone ("Plaza Norte"), not the
Type+Place compound. **[see home.changelog.md#status-d20-venue-display-name]**

**Amended for `settings.md` §2.1** (Configuración entry point): the header
session-controls trigger and its sheet are reachable from all four
non-Session states (§3.3–§3.6, including §3.6a) and from the
active-Session sheet (§3.7a), which carries a second "Configuración" row.
**[see home.changelog.md#status-settings-2-1-configuracion-entry-point]**

**Amended for `decision-log.md` D27** (NFC capability corrected to derive
from `subscriptionTier`, not kit/code activation): §2's Ready-branch check,
§3.6a's capability-revoked bullet and design note, §3.6c's entry-point
notes, and §10's decisions bullet all cite `settings.md`'s "Activar plan de
pago" as the restoration mechanism. A fourth §3.6a variant nudges a
Paid-tier merchant whose tagged inventory clears NFC Readiness while
`defaultSellingMode` still reads `buttons`, shown once ever. **[see
home.changelog.md#status-d27-nfc-capability-derivation]**

**Amended 2026-08-04 (HOME-Q1, Product Owner-raised):** new §3.8e ambient
"Venta finalizada ✓" confirmation. **Superseded — see §3.8f.** **[see
home.changelog.md#status-2026-08-04-home-q1-venta-finalizada-confirmation]**

**Amended 2026-08-04 (payment-moment extension of HOME-Q1's §3.8e):**
**Superseded — see §3.8f.** **[see
home.changelog.md#status-2026-08-04-payment-moment-extension]**

**Superseded 2026-08-05 (receipt-moment redesign):** Finalizar Venta
success now routes to a new full-viewport receipt (§3.8f) that temporarily
replaces §3.7 rather than overlaying it, exiting via a margin-zone tap
scoped to where Ana's hand grips the phone, backed by a long-dwell
auto-return backstop. §3.8e is kept as a superseded pointer entry. **[see
home.changelog.md#status-2026-08-05-receipt-moment-redesign]**

**Amended 2026-08-04 (icon/comprehension audit):** §3.9's ProductTile now
carries a per-Product marker (first letter of `Product.name`); true custom
iconography is out of scope (needs a Product Decision/RFC). **[see
home.changelog.md#status-2026-08-04-icon-comprehension-audit]**

**Amended 2026-08-08 (`decision-log.md` D33, MVP pricing operating model):**
Home's existing dollar figures (§3.7's running total, §3.8f's receipt
total) are explicitly grounded as sums of `SaleItem.pricePaid`. **[see
home.changelog.md#status-2026-08-08-d33-mvp-pricing]**

**Amended 2026-08-08 (`decision-log.md` D33, "Define lo que vendes" moved
into Onboarding):** §2 step 3's cold-start test corrected from "Product
ever registered" to "`available` InventoryUnit exists." **[see
home.changelog.md#status-2026-08-08-define-lo-que-vendes]**

**Amended 2026-08-08 (Product Owner decision, Business Identity captured at
Onboarding):** §3.8f's receipt moment now shows the merchant's own captured
identity (`Business.name`, and her own logo if set) in place of "(marca
Nahui)." Honest fallback: `Business.name` as plain text whenever no logo is
set. **[see home.changelog.md#status-2026-08-08-business-identity]**

**Amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled` retired,
Frequent Customers unified as a Paid-tier-only capability):** §3.8f's
future-registration placeholder is gated on `subscriptionTier=paid` — a
Free-tier receipt shows three elements only (confirmation, total, business
identity). **[see home.changelog.md#status-2026-08-09-d40-loyalty-enabled-retired]**

**Amended 2026-08-09 (Product Owner decision — Configuración entry-point
relocated):** the header's session-controls trigger is a top-right "⋯"
(three-dot/overflow) icon; the sheet's Configuración row carries a gear
icon ("⚙"). `settings.md` receives the matching correction. **[see
home.changelog.md#status-2026-08-09-configuracion-entry-point-relocated]**

**Amended 2026-08-09 (Product Owner decision, resolving
`product/02-ux/product-decisions.md` Q15):** §3.8f's Paid-tier receipt now
renders a genuine, tappable/scannable Claim Token QR (`decision-log.md`
D22) — the entry point into the already-Approved
`product/02-ux-loyalty/customer-loyalty-registration.md` flow (§3.1
onward). The Free-tier receipt is unaffected. **[see
home.changelog.md#status-2026-08-09-q15-claim-token-qr]**

**Amended 2026-08-12 (Medium-Fidelity spec-gap escalation — SessionHeader
title row during an active Quick Session):** new §3.7b specifies the title
row reads "Sesión rápida" wherever `Session.eventId` is null, applying to
every active-Session wireframe in §3.7–§3.11a. **[see
home.changelog.md#status-2026-08-12-quick-session-title-row]**

**Amended 2026-08-13 (Architect-caught wording-precision fix, ahead of the
Eventos build — no behavior change):** §2 step 2's gating condition now
reads "Event status = active AND no Session is currently active," and N's
computation follows D15's distinct-calendar-date rule
(`domain-model.md`'s "Día N" computation). **[see
home.changelog.md#status-2026-08-13-architect-wording-precision]**

**Amended 2026-08-13 (Architect-resolvable content amendment — see
`architect-questions.md` Q19, cross-referencing Q7):** §3.4/§3.5 and
§3.6/§3.6a each gain a conditional, ambient line — "Ya vendiste $X · N
ventas hoy" — shown only when a Session under the relevant scope already
has 1+ finalized Sales on today's calendar date; absent entirely in the
common case. `events.md` §3.14 receives the matching addition. **[see
home.changelog.md#status-2026-08-13-q19-same-day-resume-line]**

**Further amended 2026-08-13 (Product Owner decision — §3.7's ongoing
header redefined context-scoped, not Session-scoped; closes a
`merchant-user-tester` re-walk finding on top of Q19):** §3.7's "Hoy: $X ·
N ventas" — and every active-Session wireframe rendering the identical row
(§3.7a, §3.7b, §3.8, §3.8b, §3.9, §3.10, the dimmed header behind
§3.11/§3.11a) — is a running sum of every finalized Sale today sharing this
Session's `eventId` (`eventId = null` for a Quick Session), not only this
Session's own Sales. **"Venta actual" (§3.8), the close-confirmation dialog
(§3.11), and the closing-summary screen (§3.12) are explicitly
unaffected** — all three stay scoped to the single active/closing Session;
§3.11's preview line is relabeled "Esta sesión: N ventas · $X" to keep the
two simultaneously-visible numbers legible as distinct facts. `events.md`
needs no matching change. Pending `ux-critic`/`reviewer` review before
folding back into Approved. **[see
home.changelog.md#status-2026-08-13-header-context-scope]**

**Amended 2026-08-13 (Product Owner decision — Selling-Session-close action
renamed from "Cerrar sesión" to "Cerrar jornada de venta"):** every
wireframe, flow description, and section heading naming Home's
Selling-Session-close action reads "Cerrar jornada de venta" — "sesión" is
now reserved exclusively for the authenticated User/device context (RFC
0007). Historical-record quotes of the retired copy (§3.7a, §10) are left
untouched. Copy-only — the interlock itself (§2, §3.11a) is unaffected.
Pending `ux-critic`/`reviewer` review before folding back into Approved.
**[see home.changelog.md#status-2026-08-13-cerrar-jornada-de-venta-rename]**

**Amended 2026-08-14 (Product Owner-raised — "Cerrar jornada de venta"
discoverability):** during an active Selling Session, "Cerrar jornada de
venta" moves out of the session-controls sheet entirely and becomes a
direct, always-visible header button (§3.7 and every active-Session
wireframe through §3.11a); the header's "⋯" icon is replaced by a gear
icon ("⚙") that now routes straight into Configuración with no
intermediate sheet, since only one destination remained behind it. §3.7a
(the sheet) is retired for this state. Outside an active Session
(§3.3–§3.6/§3.6a/§3.6c), the "⋯" icon and its Configuración-only sheet are
unchanged — see §2 and §3.6c for why this divergence is deliberate, not an
inconsistency left unaddressed. `settings.md` receives the matching
correction (§2.1, §3.3, §4, §6, §8). `ux-critic` clean (4 Minor + 1
Suggestion, all fixed — see `home.changelog.md`'s own entry). `reviewer`
clean (2 findings, both fixed). Folded back into Approved. **[see
home.changelog.md#status-2026-08-14-cerrar-jornada-direct-affordance]**

Scope: `Hoy`, the first of four top-level nav items per
`product/00-foundation/information-architecture.md`. Implementation-independent —
low-fidelity only, no visual design.

## 1. Merchant goal

Ana doesn't open the app to "check Home." She opens it to close the gap between
*having her phone out* and *being able to register whatever a customer just
bought* — because the customer is standing there, not waiting. Two real contexts:

- **About to sell** (arriving at the bazaar, or a walk-in appears): she needs to
  be in a state where tapping a product records a sale, in essentially zero
  perceptible steps.
- **Already selling, glancing back** (phone locked, backgrounded, put down
  between customers): she needs to land exactly back where she left off — no
  re-navigation, no re-deciding anything.

A distant third: closing out at the end of the day. Home's job is to make the
first two cases indistinguishable from "just start selling," and never force her
to re-answer a question the system already has the answer to (is there an event
today, is a session open, buttons-or-NFC).

## 2. Resolution / decision logic

Evaluated in this order, automatically, on every Home open:

```
1. Is there a Session with status = active (any eventId, including null)?
     → YES: selling becomes Home's default entry point. Stop here — highest
       priority, nothing else matters if she's mid-selling. Its
       `Session.operatingMode` was already resolved the moment this Session
       opened, and stays immutable while `active` (decision-log.md D23) — this
       step never re-runs NFC Readiness or re-resolves the mode; see the
       folded-in sub-step below for where that resolution actually happens.

2. Is there an Event with status = active, and no Session is currently
   active (the direct complement of step 1 — dropping the earlier "opened
   yet today" qualifier, so a same-day resume, e.g. after a lunch break,
   still lands here rather than falling through to step 3; matches
   `decision-log.md` D15's own worked example)?
     → YES: show "Continuar Día N" (N = the number of distinct calendar
       dates before today with at least one Session under this eventId,
       plus one for today — `decision-log.md` D15, `domain-model.md`'s "Día
       N" computation — never a raw count of Session rows, and unchanged by
       a same-day resume). Tapping it is the moment a new Session actually
       opens — see the folded-in sub-step below.

3. Does at least one `available` InventoryUnit exist?
     → NO:  cold-start empty state → route to Inventario. Reached whenever
       nothing is currently sellable — before any Lot has ever been
       received (including immediately after `onboarding.md`'s new
       "Define lo que vendes" step, which creates named Products with a
       `defaultPrice` but zero Lots/stock, `onboarding.md` §2.2a /
       `decision-log.md` D33), or if every previously received unit has
       since sold with nothing new received since.
     → YES: idle state → "Iniciar Sesión Rápida" is always the primary
       action. If an Event is scheduled but not yet active, show it as a
       small, non-blocking informational card — it never gates or adds a
       step to Quick Session (domain-model.md: "Quick Session works
       regardless" of eventScheduling). Tapping "Iniciar Sesión Rápida" is
       likewise the moment a new (Quick) Session opens — see the folded-in
       sub-step below.

4. Resolution itself fails or times out?
     → fallback safe state — never a dead end (see §5).
```

**NFC Readiness sub-step, folded into Session-start (`decision-log.md` D23):**
Steps 2 and 3 above are the only two points in this resolution logic where a
Session doesn't yet exist and one is about to open — this is **not** a new
top-level branch of its own. Two distinct moments are involved here, and
they're not the same moment:

- **Evaluated ambiently, on every Home open.** NFC Readiness — computed
  against sellable tagged inventory (`available` `InventoryUnit`s with an
  assigned `NFCTag`) — is part of the same resolution query Home already runs
  on every open (the numbered steps above), reusing it rather than adding a
  new dependency edge or a new perceptible delay. This is exactly why the
  recommendation/override line already renders on the resting, pre-tap idle
  screen in §3.4/§3.5/§3.6, and why it's tappable before "Continuar Día N" or
  "Iniciar Sesión Rápida" is ever touched — §6's footnote states this
  directly: the override tap happens "before the existing Session-start tap."
- **Committed only at the Session-start tap.** At the exact moment "Continuar
  Día N" (step 2) or "Iniciar Sesión Rápida" (step 3) is tapped, the
  already-evaluated result — the recommendation, or the override if she
  tapped it — is written onto `Session.operatingMode`. It can't happen any
  earlier than this tap, simply because the `Session` record doesn't exist
  until then; there's nothing yet to commit the value onto. Nothing about the
  wireframes changes because of this distinction — it's a wording fix so this
  prose matches what §3.6a and §6 already depict, not a behavior change.

`Session.operatingMode` resolves from the ambiently-computed NFC Readiness
plus the Business's stored `defaultSellingMode` and Selling Mode Capability
(`registrationMode`):

- **Ready, `nfc ∈ registrationMode`, and matching `defaultSellingMode`** →
  resolves silently; no UI moment at all, identical to today's behavior. The
  common case. This capability check mirrors the hedge Limited Ready's
  override already states explicitly below ("if her capability set allows
  it") — Ready was the one branch that had dropped it. `nfc ∈
  registrationMode` is now a pure read-time derivation, `nfc ⟺
  subscriptionTier = paid` (`decision-log.md` D27) — not an independently
  stored or toggled value. If coverage is above threshold and
  `defaultSellingMode` still reads `nfc`, but `subscriptionTier` has since
  moved away from `paid` (a Paid→Free downgrade landing, per `settings.md`
  §2.2's "Volver al plan gratis" — nothing about that transition resets
  `defaultSellingMode` itself, by design; see `settings.md` §2.3), this no
  longer counts as a match: `nfc` is treated as unavailable exactly as Not
  Ready treats zero sellable tagged inventory below, and the Session opens
  in `buttons` automatically — **but never silently.** Unlike Not Ready,
  this divergence isn't something Ana can see for herself (there's no
  tagged-stock count to check) — an `nfc` availability that changed because
  of a plan she may not be actively thinking about at Session-start is
  completely invisible to her otherwise, so the one-time, non-blocking
  mention this case gets is if anything more load-bearing than Not Ready's,
  not less (§3.6a; resolves
  HOME2-MAJ3). Like Not Ready's mention, it carries a next-step link
  too: `settings.md` (Approved, Q5 Resolved via `decision-log.md` D25,
  further corrected by D27) specifies the actual self-service restoration
  path at §2.2 ("Activar plan de pago") — `nfc` becomes available again the
  instant `subscriptionTier` returns to `paid`, automatically, with no
  separate NFC-specific action to take — see §3.6a for the line and its "Ir
  a Configuración" link. If `defaultSellingMode` is already `buttons`, this
  case can't arise — there's nothing for an unavailable `nfc` to disagree
  with — and resolution stays silent, same as the common case.
- **Ready, `nfc ∈ registrationMode`, but `defaultSellingMode` still reads
  `buttons`** → resolves silently in `buttons`, exactly like the common
  case — this isn't a disagreement Session-start itself needs to flag,
  since `buttons` is what she's asked for. But it is a real discoverability
  gap worth closing once, not at every Session-start: a Paid-tier merchant
  who has never once been told her tagged inventory is now sufficient to
  sell with tags has no way to discover that fact anywhere in the product,
  since D23's nudges only ever point away from `nfc`, never toward it. A
  single, one-time (shown once ever, not once per Session-start) mention
  closes this gap without touching Session-start's own resolution or
  reopening D23's asymmetric-nudge architecture — see §3.6a.
- **Limited Ready** (some tagged inventory exists, below the readiness
  threshold, disagreeing with `defaultSellingMode`) → a single, lightweight
  inline recommendation appears at the same Session-start action, with one
  tap to override toward `nfc` if her capability set allows it — see §3.6a.
- **Not Ready** (zero sellable tagged inventory units) → `nfc` isn't offered
  as a choice at all; the Session opens in `buttons` automatically — an
  operational impossibility, not a restriction (nothing exists to scan). If
  this disagrees with a `defaultSellingMode` of `nfc`, a brief, one-time,
  non-blocking mention appears alongside the same action, with a path to
  Asignar Tags; if `defaultSellingMode` is already `buttons`, this is
  silent — see §3.6a.

Step 1 (an already-open Session) never re-runs any of this — the resolved
`Session.operatingMode` is immutable for the remainder of that Session's
`active` lifecycle.

**Price resolution (folded into every tap/scan, `decision-log.md` D33):**
every time an item is added to "Venta actual" (§3.8/§3.8a — a buttons-mode
tap, §3.9, or an nfc-mode scan, §3.10), its `SaleItem.pricePaid` is
resolved automatically, at that same write: this Session's Event's Price
Override for the sold Product if one exists, else the Product's own
`defaultPrice` (`domain-model.md`'s "Price resolution" Key Mechanism).
This is never a merchant decision and never surfaces as a UI moment of any
kind — no price picker, no confirmation, no per-item choice — the
identical automation pattern this section already establishes for FIFO
allocation (D5) and NFC Readiness (D23), and the same
`architecture-principles.md` #1 discipline every other Session-time
resolution here already follows. A Quick Session (no `eventId`) always
resolves straight to the Product's `defaultPrice`, since there's no Event
to carry a Price Override.

**Framing note (approved refinement):** during an active session, selling
becomes the *default entry point* of the application — not a locked screen. The
merchant can always navigate to Inventario, Eventos, or Resultados, or reach
session controls, but the application always resumes where selling happens. The
persistent bottom nav (`Hoy · Inventario · Eventos · Resultados`, per the frozen
IA) stays visible and tappable through every state below, including all selling
states. Opening Hoy while actively selling takes her directly back to selling
(§2's priority order is unconditional) — but stepping away is always one tap,
never obstructed, and never gated by a confirmation.

**Session-controls interlock (added — resolves HOME-M2; entry points
amended 2026-08-14 for the active-Session state — see status header):**
during an active Session, "Cerrar jornada de venta" is a direct,
always-visible header button (§3.7) — no longer reached through a sheet —
but it carries exactly one interlock: if "Venta actual" holds 1+ items,
tapping it does not open the close-session confirmation (§3.11) — it opens
a blocking notice instead (§3.11a) that routes her back to the open Sale
so she can finish or explicitly cancel it first. This is the one control
in the whole doc that doesn't go where it says on a first tap: closing a
Session is the sole deliberately irreversible action in the whole flow
(§10), so it's the one control that can never be allowed to silently
discard real, registered-but-unfinished work. This interlock is specific
to *closing the Session* — it does not apply to navigating to another tab
mid-Sale, which is always safe and always resumes exactly where she left
off (§3.13, resolving HOME-B2 below). **This interlock is scoped to
"Cerrar jornada de venta" specifically — "Configuración," now reached via
the header's gear icon (⚙) directly, with no intermediate sheet, per
`settings.md` §2.1, is unaffected and reachable even with an open Sale,
since it never touches Selling data.** Outside an open Session, the
header's "⋯" icon still opens a lighter, Configuración-only variant of the
same sheet shape (§3.6c) on §3.3–§3.6, including the §3.6a
Session-start-moment variants shown on top of §3.4/§3.5/§3.6 — a Session
hasn't opened yet at that moment either, and a merchant seeing the
capability-revoked variant in particular has arguably the most reason of
all three to want to reach Configuración right then (§3.6a). **This is a
deliberate divergence from the active-Session state, not an inconsistency
left unaddressed:** once a Session is open, "Cerrar jornada de venta" no
longer shares a trigger with Configuración at all, so the "⋯"/sheet
shape — appropriate when a menu has to represent a real choice between two
destinations — no longer describes what's actually behind either
affordance. See the status header's 2026-08-14 entry and §10 for the
reasoning. **Learning both shapes on the same day is not treated as a
consistency risk:** the glyph itself changes (⋯ → ⚙) exactly where the
behavior does, ⚙ is a near-universal direct-settings icon independent of
this document, and the primary registration CTA already changes its own
label/behavior by state throughout this doc ("Iniciar Sesión Rápida" vs.
"Continuar Día N") without that being treated as a learnability problem —
the icon swap follows the same established precedent, not a new one.

## 3. Low-fidelity wireframes

Conventions: `[ ]` = tappable. Plain text = passive/informational. Bottom row is
the persistent nav bar on every state, current tab in brackets.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Empty skeleton, no copy: nothing announces "loading" for something that
  should be imperceptible. *global-principles.md*, "technology should
  disappear."
- Nav bar present even before resolution finishes: navigation is never blocked
  by the app figuring out its own state.

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- One calm, plain-language line, never a technical status string.
  *global-principles.md*, "business language before technical language."

### 3.3 Cold start (no sellable inventory yet)
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│  Aquí vas a ver tu día de       │
│  venta en cuanto registres      │
│  lo que traes.                  │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Single honest CTA, no fake selling button: a botón leading to an empty
  product grid isn't a shortcut, it's a disguised dead end.
  *global-principles.md*, "the fastest interaction is the one that never
  happens."
- **Reached whenever zero `available` InventoryUnits exist** (2026-08-08
  correction — see §10) — before any Lot has ever been received,
  immediately after `onboarding.md`'s new "Define lo que vendes" step
  (named Products, zero Lots/stock, `onboarding.md` §2.2a), or if every
  previously received unit has since sold with nothing new received
  since. Not the same test as "has a Product ever been registered" — a
  named-but-unstocked Catalog is exactly the state this screen exists to
  catch, not a state that should bypass it.
- Routes into Inventario, an existing nav tab — no new destination invented for
  this one case. (Exactly where within Inventario is resolved in
  `product/02-ux/inventory.md` §3.6: directly into Registrar Mercancía
  (on-screen heading "Registro de mercancía," per HJR-INV-M1), not
  Inventario's own cold-start screen.)
- **Header's "⋯" icon opens the session-controls sheet (§3.6c) — "Configuración"
  only, no "Cerrar jornada de venta," since no Session is open yet (applies
  `settings.md` §2.1's amendment; relocated from the header's "▾" per the
  Product Owner's 2026-08-09 decision — see status header).** Reaches the
  same destination the active-Session state's gear icon (⚙, §3.7) routes
  to directly — this state just keeps the "⋯"/sheet shape rather than the
  active-Session state's own direct affordance, since no Session is open
  yet for it to share a trigger with (§2's "deliberate divergence"
  reasoning). Extended here because the capabilities Configuración manages
  are meaningful to check even before Ana has ever registered a Product.

### 3.4 Idle — no Event today, ready
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│        ¿Vas a vender hoy?       │
│   [   Iniciar Sesión Rápida  ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Exactly one primary action, large, centered: hierarchy reflects
  *architecture-principles.md* #3 — Quick Session is first-class, not a
  fallback, because `eventId` is genuinely optional in the model, not a UI
  afterthought.
- In the rare case NFC Readiness disagrees with the stored `defaultSellingMode`
  at the moment this button is tapped, this screen gains exactly one
  additional inline line beneath the button — see §3.6a. The screen shown
  above is the common case and is otherwise pixel-identical.
- **Header's "⋯" icon opens the session-controls sheet (§3.6c) — "Configuración"
  only, same as §3.3 (applies `settings.md` §2.1's amendment; icon relocated
  2026-08-09 — see status header).**

**Same-day resume — a Session with `eventId = null` and finalized Sales
already exists today (new — closes `architect-questions.md` Q19,
`experience-review-2026-08-13-eventos.md`):**
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│        ¿Vas a vender hoy?       │
│   Ya vendiste $420 · 3 ventas hoy │
│   [   Iniciar Sesión Rápida  ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- **Condition:** shown only when at least one Session with `eventId = null`
  (any status — active or closed) already has 1+ finalized Sales falling on
  today's calendar date. Absent entirely otherwise, including the common
  case (first Quick Session of the day) — the screen above renders
  pixel-identical to §3.4's base wireframe, zero added line, zero added tap.
- **Data source:** `SUM(SaleItem.pricePaid)` and `COUNT(Sale)` across every
  Sale whose Session has `eventId = null` and whose calendar date is today —
  the Quick Session counterpart to §3.6's identical fix below, no Día N
  framing since a Quick Session has none.
- **Coexists with §3.6a's NFC Readiness/capability lines, independent
  facts.** When both conditions hold, this line renders above the primary
  CTA (as shown), §3.6a's recommendation/mention line renders beneath it,
  exactly as §3.6a already specifies — neither suppresses or reflows the
  other.

### 3.5 Idle — ready, with an upcoming (not-yet-active) Event
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│  ┌───────────────────────────┐ │
│  │ Plaza Norte                │ │  informational card, not a button
│  │ empieza en 3 días           │ │
│  └───────────────────────────┘ │
│   [   Iniciar Sesión Rápida  ]  │  still the primary action
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Event card is visually secondary and tappable only into Eventos, never into
  starting a session: keeps scheduling awareness read-only so it can never add
  a step to Quick Session. *domain-model.md*, "Quick Session works regardless."
- "Iniciar Sesión Rápida" keeps full prominence even with the card present.
- Same NFC Readiness disagreement note as §3.4: the event card is unaffected
  either way — see §3.6a for the rare additional line beneath the button.
- **Header's "⋯" icon opens the session-controls sheet (§3.6c) — "Configuración"
  only, same as §3.3/§3.4 (applies `settings.md` §2.1's amendment; icon
  relocated 2026-08-09 — see status header).**
  The event card and the sheet are unrelated — opening Configuración never
  touches the upcoming Event.

**Same-day resume — a Session with `eventId = null` and finalized Sales
already exists today (new — closes `architect-questions.md` Q19,
`experience-review-2026-08-13-eventos.md`):** identical condition and
treatment as §3.4's matching addition above — the upcoming-Event card and
this line are unrelated facts; both can render at once, the card unaffected
either way, same independence this section already states for the NFC
Readiness disagreement note.

### 3.6 Event active, no Session opened today
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│      Plaza Norte                │
│      Hoy es tu Día 2             │
│      [   Continuar Día 2     ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- "Día 2" stated as fact, not asked: computed automatically from existing
  Sessions under the `eventId` (*domain-model.md*, read-side query across
  Sessions sharing that ID). *global-principles.md*, "never ask twice."
- Same NFC Readiness disagreement note as §3.4/§3.5 — see §3.6a.
- **Header's "⋯" icon opens the session-controls sheet (§3.6c) — "Configuración"
  only, same as §3.3–§3.5 (applies `settings.md` §2.1's amendment; icon
  relocated 2026-08-09 — see status header).**
  An active Event with no Session yet still has nothing to close — "Cerrar
  jornada de venta" doesn't apply until "Continuar Día 2" is actually tapped.

**Same-day resume — a Session with finalized Sales already exists today
under this `eventId` (new — closes `architect-questions.md` Q19,
`experience-review-2026-08-13-eventos.md`):**
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│      Plaza Norte                │
│      Hoy es tu Día 1             │
│      Ya vendiste $750 · 2 ventas hoy │
│      [   Continuar Día 1     ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- **Condition:** shown only when at least one Session (any status — active
  or closed) under this `eventId` already has 1+ finalized Sales falling on
  today's calendar date. Absent entirely otherwise, including the common
  case (first Session of the day under this Event) — the base §3.6
  wireframe renders pixel-identical, zero added line, zero added tap.
- **Data source:** `SUM(SaleItem.pricePaid)` and `COUNT(Sale)` across every
  Sale whose Session shares this `eventId` and whose calendar date is
  today — the identical Session set `domain-model.md`'s "Día N" computation
  already scopes to today's date, reused here rather than a second,
  independently-defined query (`global-principles.md`, "capture business
  truth once, reuse it forever").
- **Why this is needed:** closes the gap
  `product/02-ux/experience-review-2026-08-13-eventos.md` found — a
  same-day resume (e.g. after closing a lunch-break Session) correctly
  shows "Continuar Día 1" again per D15, but nothing told Ana a closed
  Session with real sales already existed for today before she reopened
  selling; she read the fresh $0 running total as her prior sales having
  vanished. Classified Architect-resolvable directly from
  `architect-questions.md` Q7's existing ruling — no new Product Owner
  decision, a content amendment only (`architect-questions.md` Q19).
- **Coexists with §3.6a's NFC Readiness/capability lines, independent
  facts.** Both can appear at once — this line is about Sessions and money
  already recorded today; §3.6a's lines are about which selling mode the
  next Session will open in. When both hold, the order is: identity → Día N
  → this same-day-sales line → primary CTA → §3.6a's recommendation/mention
  line (if any) → §3.6a's own secondary action, if offered. Neither
  suppresses or reflows the other.

### 3.6a Session-start moment — NFC Readiness disagreement (new — folds in `decision-log.md` D23)

Applies identically wherever a new Session is about to open — §3.4 (Iniciar
Sesión Rápida, no Event), §3.5 (same, with an upcoming-Event card present), and
§3.6 (Continuar Día N). Shown in four cases. Three are where the
Session-start resolution disagrees with a stored `defaultSellingMode` of
`nfc`: two are NFC Readiness disagreements (Limited Ready, Not Ready); the
third is the Business's Selling Mode Capability no longer including `nfc` at
all (capability revoked — e.g. a lapsed subscription; §2) — a distinct check
from NFC Readiness, grouped here because it produces the same Session-start UI
moment. The fourth is the mirror direction: `defaultSellingMode` still reads
`buttons`, but tagged inventory has become sufficient to sell with tags for
the first time (§2) — the one case in this section that nudges *toward*
`nfc` rather than away from it, and the one shown once ever rather than once
per Session-start occurrence (see its own bullets below for why). The common
case (Ready, capability intact, matching default) shows none of this —
pixel-identical to §3.4/§3.5/§3.6 as already specified, exactly as fast as
today.

**Header carries the "⋯" icon too, identically to §3.4/§3.5/§3.6 — every
wireframe below shows it.** Opening it reaches the same session-controls sheet
as the resting screen (§3.6c) — reachable at this Session-start moment exactly
as it is before or after it, since no Session is open yet even here. This
matters most for the capability-revoked variant below: a merchant who's just
been told she can't sell with tags has arguably the most reason of the three
to want to reach Configuración right then (§2).

**Limited Ready, `defaultSellingMode = nfc` (recommends `buttons`, overridable):**
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│        ¿Vas a vender hoy?       │
│   [   Iniciar Sesión Rápida  ]  │
│   Pocas prendas tienen tag       │
│   todavía — vas a vender con     │
│   botones.                       │
│   [ Usar tags de todos modos ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
(the same line attaches beneath "Continuar Día 2" when reached via §3.6, and
beneath "Iniciar Sesión Rápida" with the Event card still shown when reached
via §3.5)

- One line, plain business language, no percentage/threshold/count ever
  shown — the readiness threshold itself stays invisible to Ana as a number
  (`product/99-rfc/0003-session-selling-mode.md`, "Why"). It never says
  "NFC," "readiness," or any technical term — "tienen tag" is her own
  vocabulary for the physical tag, "botones" the tap-grid she already knows.
- "Usar tags de todos modos" is a single tap, not a second screen or a
  blocking modal: tapping it flips the mode locally (before the Session
  itself opens) and the line updates to confirm the override — "Vas a usar
  tags esta sesión · [ Cambiar ]" — with the same tap available to flip back.
  Nothing about this delays or gates the primary CTA underneath it.
- Tapping the primary CTA ("Iniciar Sesión Rápida" / "Continuar Día N")
  commits whichever mode the line currently shows (the recommendation, or the
  override if she tapped it) as `Session.operatingMode` — resolved once, at
  that tap, immutable for the rest of the Session (`decision-log.md` D23).
- This is the one place in the whole document where a selling mode becomes a
  visible, named choice — deliberately: `ubiquitous-language.md` explicitly
  carves out this exact moment ("only rarely becomes an explicit per-Session
  choice — a Limited Ready override — never a raw screen-level toggle"). It
  does not reopen `architecture-principles.md` #1: the decision is still made
  once, upstream of selling, never mid-Sale, never per-Sale.
- If `defaultSellingMode` is already `buttons`, none of this appears — Limited
  Ready then has no `nfc` default to disagree with, and the Session opens
  exactly as silently as the Ready case (the same explicit symmetry stated
  below for Not Ready).

**Not Ready, `defaultSellingMode = nfc` (`nfc` withdrawn, one-time mention):**
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│        ¿Vas a vender hoy?       │
│   [   Iniciar Sesión Rápida  ]  │
│   Todavía no tienes prendas      │
│   con tag para hoy — vas a       │
│   vender con botones.             │
│   [ Asignar tags ]                │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- No override offered here (contrast with Limited Ready above) — there is
  nothing to override toward: zero sellable tagged units means `nfc` has no
  physical tag to scan, an operational impossibility, not a restriction
  (`decision-log.md` D23). The primary CTA is unaffected either way — selling
  itself is never blocked.
- "Asignar tags" is a secondary, optional link into Inventario's existing
  tag-assignment flow (`inventory.md` §3.14) — never required before selling.
  Tapping it leaves this screen without starting a Session at all — a
  deliberate escape hatch, not a forced detour.
- Shown once per occurrence of this Session-start moment, never repeated
  mid-Session, consistent with "never ask twice" (`global-principles.md`):
  it never re-surfaces once the Session is open.
- If `defaultSellingMode` is already `buttons`, none of this appears — Not
  Ready then matches her existing default with nothing to disagree with, and
  the Session opens exactly as silently as the Ready case.

**Design note — why Not Ready gets a mention here at all, rather than staying
completely silent (`global-principles.md`):** "The fastest interaction is the
one that never happens" argues for silence by default; but Not Ready
specifically means her *normal* selling mode (`defaultSellingMode = nfc`) has
become unavailable, for a reason entirely within her control (no tagged stock
ready) — silently substituting botones would read as an unexplained
inconsistency the moment she notices her usual scan prompt isn't there, which
is a worse violation of "technology should disappear" than one calm, actionable
line. This is a materially bigger divergence from her expectation than Limited
Ready's "same mode still available, just recommended against" — it's the one
mode she's used to not existing at all for this Session. A single line with a
real next step (Asignar tags) resolves that without adding a tap to the happy
path and without ever blocking her from selling, right now, in `buttons`.

**Capability revoked, `defaultSellingMode = nfc` (Selling Mode Capability no
longer includes `nfc`, one-time mention with a next-step link — resolves
HOME2-MAJ3; next-step link added once `settings.md` provided one to point
to):**
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│        ¿Vas a vender hoy?       │
│   [   Iniciar Sesión Rápida  ]  │
│   Por ahora no puedes vender     │
│   con tags — vas a vender con    │
│   botones.                       │
│   [ Ir a Configuración ]         │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
(the same line attaches beneath "Continuar Día 2" when reached via §3.6, and
beneath "Iniciar Sesión Rápida" with the Event card still shown when reached
via §3.5)

- Distinct trigger from both cases above: this isn't about tagged inventory at
  all (she may have plenty of tagged stock ready to go) — it's that her
  Business's Selling Mode Capability (`registrationMode`) no longer includes
  `nfc` as an option, full stop (§2). No amount of tagging fixes it — the fix
  lives in Configuración, not Inventario, which is exactly why this gets no
  "Asignar tags"-style link even though it does get its own next-step link,
  below.
- No override offered (contrast with Limited Ready): she cannot flip her way
  back into `nfc` from this screen the way Limited Ready's override works,
  since the capability itself — not just a readiness threshold — is what's
  missing; only Configuración can restore it, and only indirectly, as a
  consequence of a different action. `nfc` is a pure read-time derivation
  from `subscriptionTier = paid` (`decision-log.md` D27) — this is no
  longer a dead end: `settings.md` (Approved, Q5 Resolved via
  `decision-log.md` D25, further corrected by D27) resolves this
  self-service restoration path at its §2.2 ("Activar plan de pago") — the
  same action that activates the Paid plan for any other reason also
  restores `nfc`, automatically, with no separate NFC-specific action or
  code to confirm; there is no longer a dedicated activation path to route
  to (`onboarding.md`'s former kit-activation mechanism is retired for the
  same reason, D27). "Ir a Configuración" routes there, the same shape Not
  Ready's "Asignar tags" link already establishes: one calm line, one real
  next step, never a promise the app can't yet keep.
- "Ir a Configuración" is a secondary, optional link — never required before
  selling. Tapping it routes to `settings.md`'s resolve step (§3.1/§3.2) →
  vista principal (§3.3a, or §3.6 if a pending change already exists),
  exactly the same routing §3.6c's "Configuración" entry uses, without
  starting a Session at all. "← Hoy" returns her to this exact screen,
  recommendation line unchanged, since opening Configuración never
  re-evaluates the Selling Mode Capability check that produced it — she'll
  see the same mention again until she actually restores `nfc` there.
- Copy stays deliberately plain and non-diagnostic — "Por ahora no puedes
  vender con tags," never "tu capacidad fue revocada" or "tu suscripción
  venció." This document has no way to know, and shouldn't guess at, the
  specific business reason a capability was revoked;
  it states only what's true and immediately useful: the mode she's used to
  isn't available right now, and what she's selling with instead.
- Shown once per occurrence of this Session-start moment, same discipline as
  Not Ready above — never repeated mid-Session, consistent with "never ask
  twice" (`global-principles.md`).
- If `defaultSellingMode` is already `buttons`, this case can't arise at
  all — see §2.

**Design note — why capability-revoked (above) gets a mention, and now a
next-step link too:** the reasoning that applies to Not Ready — that silently
substituting `botones` "would read as an unexplained inconsistency the moment
she notices her usual scan prompt isn't there" — applies at least as strongly
here, arguably more so: with Not Ready, Ana can at least see for herself that
she hasn't tagged inventory yet, so a silent switch would merely be
unexplained. A revoked capability is invisible to her by construction —
there's no stock count, no setting on this screen alone that would tell her
why her usual `nfc` prompt vanished. Silently opening `buttons` in this case
(this document's original behavior, before HOME2-MAJ3) wasn't just less
informative than Not Ready's mention — it was actively worse, since it gave
her no way to even suspect why, let alone fix it.

This section originally stopped at the mention alone, with no next-step
link, because Settings/subscription management didn't exist yet — Q5 was
Open and this document had no self-service surface to point her toward.
That premise is now stale in two successive ways: `settings.md` reached
Approved with Q5 Resolved (`decision-log.md` D25), and `decision-log.md`
D27 then corrected exactly how the restoration actually happens — not
through a dedicated NFC-activation action at all, but automatically, as a
side effect of "Activar plan de pago" (`settings.md` §2.2), since `nfc` is
now a pure derivation from `subscriptionTier = paid` rather than an
independently grantable entitlement. Leaving this mention dead-ended after
either of those documents landed would mean Ana is one tap away from her own
fix and this screen simply doesn't tell her — a worse outcome than the gap
this note originally justified accepting. "Ir a Configuración" closes that
gap the same way "Asignar tags" already closes it for Not Ready: a real next
step, not a promise standing in for behavior that doesn't exist — it just no
longer points at a screen of its own; it points at the same "Activar plan de
pago" action any other Paid-tier benefit already routes through.

**Ready, but `defaultSellingMode = buttons` and tagged inventory has just
become sufficient (new — closes D27-CROSS-M1, the one mention in this
section pointed toward `nfc` rather than away from it):**
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │
│        ¿Vas a vender hoy?       │
│   [   Iniciar Sesión Rápida  ]  │
│   Ya tienes prendas con tag      │
│   suficientes para vender con    │
│   tags — actívalo cuando         │
│   quieras en Configuración.       │
│   [ Ir a Configuración ]          │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
(the same line attaches beneath "Continuar Día 2" when reached via §3.6, and
beneath "Iniciar Sesión Rápida" with the Event card still shown when reached
via §3.5)

- Distinct trigger from every other case in this section: NFC Readiness has
  crossed from Not Ready or Limited Ready into Ready — she now has enough
  tagged inventory to sell with tags — while `defaultSellingMode` still
  reads `buttons`, the value every real Onboarding path writes
  unconditionally (`onboarding.md` §2.3, `decision-log.md` D27). Without
  this mention, nothing anywhere in the product would ever tell her the
  capability she's paying for is sitting dormant — a real discoverability
  gap, not a case D23's asymmetric-nudge architecture already covers (D23's
  nudges only ever point away from `nfc`; this is the one deliberate
  exception, added for discoverability, not a reversal of that
  architecture — nothing about Session-start's own resolution changes: the
  Session still opens silently in `buttons` here, exactly as the Ready
  branch in §2 already specifies).
- No inline override offered here, unlike Limited Ready — tapping her way
  into `nfc` for just this one Session isn't the fix: she'd hit this same
  gap again tomorrow, since her stored `defaultSellingMode` would still
  read `buttons`. "Ir a Configuración" routes to the actual, durable fix —
  `settings.md`'s "Cambiar a vender con tags" (§2.2/§3.4) — the same
  Configuración routing every other next-step link in this section already
  uses.
- **Shown once ever, not once per Session-start occurrence** — the one
  deliberate exception to this section's usual "shown once per occurrence,
  every time the condition holds" discipline (contrast Not Ready and
  capability-revoked above). This is a discretionary opportunity to
  surface, not an operational fact that changes what she can do right now —
  she may genuinely prefer `botones`, and repeating this mention at every
  Session-start from here on would read as the app second-guessing a choice
  she's entitled to make, the opposite of *brand-guide.md*'s "respects the
  vendor's intelligence." Tracked the same lightweight way `settings.md`
  §2.4 already tracks its own one-time landing acknowledgment — no new
  mechanism invented, the same shown-once pattern reused.
- If she acts on it and switches to `nfc` in Configuración, this mention
  never has a reason to show again (the condition it detects — `nfc`
  available and unused — no longer holds). If she doesn't act on it, it
  still never repeats — one honest heads-up, not a recurring nag.

### 3.6c Session-controls sheet — cold start / idle / Event-active-no-Session states (new — applies `settings.md` §2.1's required amendment)
```
┌───────────────────────────────┐
│  Nahui                        ⋯ │  dimmed, still visible underneath
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  [       Configuración        ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Reached by tapping the header's "⋯" icon (relocated from the header's "▾"
  per the Product Owner's 2026-08-09 decision — see status header) from any
  of §3.3 (cold start), §3.4/§3.5
  (idle, with or without an upcoming Event card), or §3.6 (Event active, no
  Session opened today) — the four Home states with a persistent header but
  no open Session — including whichever of §3.4/§3.5/§3.6's §3.6a
  Session-start-moment variants (Limited Ready, Not Ready, capability
  revoked, or the Ready-but-`buttons`-default discoverability mention)
  happens to be showing at the time, since those are the identical screens
  with one extra line, not separate states requiring their own entry point.
  Per `settings.md` §2.1, this is deliberate, not an oversight: the
  things Configuración manages — her plan and now
  (per `decision-log.md` D27) her `defaultSellingMode` (Botones ↔ Etiquetas
  NFC) directly — are meaningful to check or change whether or not Ana
  happens to be selling that particular day. Gating them behind an open
  Session would misuse Session-start — a real business event that
  timestamps hours worked (§10) — for a non-selling errand.
- Exactly one entry, "Configuración" — no "Cerrar jornada de venta" row, since none of
  these four states has an open Session to close. **Contrast with the
  active-Session header (§3.7, amended 2026-08-14 — see status header):
  once a Session is open, "Cerrar jornada de venta" is a direct,
  always-visible header button, never a sheet row at all, and the same
  gear icon here (⚙) instead routes straight into Configuración with no
  intermediate sheet — §3.6c is now the only Home state family still
  using the sheet shape.** The "Configuración" row carries a gear icon
  ("⚙") here too, the same marker the active-Session header now uses
  directly — kept for the reason it was originally added, distinguishing
  it visually from any other entry this sheet may carry in the future
  (Product Owner decision, 2026-08-09, extended 2026-08-14).
- Tapping "Configuración" routes to `settings.md`'s resolve step (§3.1/§3.2)
  → vista principal (§3.3a). Tapping outside the sheet, or a dismiss
  gesture, closes it and returns to whichever of §3.3–§3.6 it was opened
  from, unchanged — including, if it was opened from a §3.6a variant, that
  same recommendation/mention line exactly as it was (opening Configuración
  never re-evaluates NFC Readiness or the Selling Mode Capability check).
- **Not shown** on §3.1/§3.2 (Resolving — nothing stable yet to hang a sheet
  off), §3.12 (Close-summary — a deliberately transient, prompt-free
  acknowledgment a Settings entry point would compete with), or §3.14
  (Resolution error — a recovery screen whose one job is getting her back to
  a working state). Same three exclusions `settings.md` §2.1 states
  explicitly, for the same reasons.
- Configuración's own content — the three capability toggles, their
  confirmation templates, the pending-change indicator — is designed
  entirely in `settings.md`, not here; this document only specifies the
  entry point and routing. *architecture-principles.md* #6 (one-way
  dependency direction) — Home never grows an Identity/Settings surface of
  its own.
- **Renumbered from §3.6b to §3.6c, and repositioned to follow §3.6a rather
  than precede it** — cleaner read order given §3.6a's own three variants are
  pixel-identical to §3.4/§3.5/§3.6 plus one extra line each, so this sheet (which those
  same three states also open) reads more naturally right after them than
  interleaved between §3.6 and §3.6a.

### 3.7 Session active — ready, no Sale open (mode-agnostic shell)
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │  header = ambient info + two direct
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │  entry points (see below)
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│   [   zona de registro,          │  mode-appropriate content fills here
│       según Session.operatingMode ]│  (see 3.9 / 3.10)
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- **Header now carries two independent, directly visible entry points —
  no overflow menu for either (amended 2026-08-14, Product Owner-raised —
  see status header).** The gear icon (⚙, top-right of the title row)
  routes directly into Configuración (`settings.md` §3.1/§3.2 → vista
  principal §3.3a/§3.6) — no intermediate sheet. "Cerrar jornada de venta"
  (right side of the ambient-total row) routes to the close-session
  confirmation (§3.11) or, if "Venta actual" holds 1+ items, the blocking
  notice instead (§3.11a), per the interlock in §2. Both were previously
  reached through a shared "⋯" icon opening a two-row sheet (§3.7a, now
  retired for this state — see its own entry) — this replaces that
  indirection with two affordances that each go exactly where they say,
  on a first tap.
- The header stays exactly two lines, unchanged from before this
  amendment — the new "Cerrar jornada de venta" affordance sits within
  the existing ambient-total row rather than adding a third, preserving
  the registration surface as "the single biggest area on screen" (below,
  unchanged claim).
- **Flagged for High-Fidelity attention, not resolved here (`ux-critic`
  finding, 2026-08-14 amendment review):** packing the ambient
  `Hoy: $850 · 6 ventas` total and the `[ Cerrar jornada de venta ]`
  button onto one row is a legitimate Low-Fidelity tradeoff — this
  fidelity doesn't pixel-verify legibility or tap-target size — but the
  entire point of this amendment is discoverability, so `ui-designer`
  must explicitly verify the button reads as tappable and doesn't end up
  visually subordinate to the ambient text on an actual phone screen when
  building this in `product/02c-high-fidelity-prototype/`, rather than
  treating the Low-Fidelity text description alone as proof the
  discoverability goal was met.
- "Venta actual: (vacía)" shown even with nothing pending: ambient visibility
  so a stale/leftover sale is never invisible.
- Registration surface is the single biggest area on screen, always exactly
  one mode, resolved once at Session-start (§2/§3.6a) and never re-evaluated
  mid-Session. *architecture-principles.md* #1.
- **"Hoy: $850 · 6 ventas" is now context-scoped, not Session-scoped
  (Product Owner decision, 2026-08-13, correcting this document's original
  D33 grounding) — a running sum of `SaleItem.pricePaid` / count of
  finalized Sale across every Session sharing this Session's own `eventId`
  and falling on today's calendar date, not only this one Session's own
  contribution.** For a Quick Session (`eventId = null`), that means every
  other Quick Session finalized today; for an Event-linked Session, every
  other Session under that same Event finalized today. Reuses, unchanged,
  the identical `todaySalesSummary`-shaped query `architect-questions.md`
  Q19 already established and §3.4/§3.5/§3.6's same-day-resume lines ("Ya
  vendiste $X · N ventas hoy") already compute (`global-principles.md`,
  "capture business truth once, reuse it forever") — the only thing new is
  *where* that same fact renders: an ongoing header Ana glances at
  continuously while selling, rather than a one-time ambient line shown once
  at Session-start. No new query, no new fetch, no new field. Updates the
  instant any Sale under this scope finalizes (§3.8c), same timing as
  before. Each item's own resolved price (Event override or Product
  default) already reflects any adjustment made in `events.md`'s "Ajustar
  precios," with zero recomputation happening here — unchanged from the
  original D33 grounding.
- **Applies to every wireframe rendering this same header row** — §3.7
  itself, §3.7b (Quick Session title-row variant — its total is
  context-scoped identically), §3.8, §3.8b, §3.9, §3.10, and the header
  behind §3.11/§3.11a — one content rule, cross-referenced rather than
  redefined at each, per `product/02-ux/CLAUDE.md` §4's shared-states
  convention. (§3.7a, once listed here as a dimmed sheet-backdrop variant
  of this same header, is retired as of the 2026-08-14 amendment — see
  that section's own entry — and no longer renders for the active-Session
  state at all.)
- **Does not change: "Venta actual."** The current in-progress transaction —
  the tray Ana is actively building toward Finalizar Venta — stays scoped to
  the single active Sale, exactly as before ("Venta actual: 2 artículos,"
  §3.8). Nothing about this amendment touches its content, its
  cancel/confirm mechanics (§3.8b), or its receipt (§3.8f).
- **Does not change: the close-confirmation dialog (§3.11, "¿Ya terminaste
  por hoy?") or the closing-summary screen (§3.12, "Día N cerrado — N ventas
  registradas — $X en total").** Both stay Session-scoped — reporting only
  the specific Session being closed right now, not the context total. A
  deliberately different kind of fact from the ongoing header above, not an
  oversight left uncorrected: the header is an *ambient, continuous status*
  fact — the number Ana glances at repeatedly, at arbitrary moments, while
  selling is still ongoing and nothing has been decided — while §3.11's
  preview and §3.12's summary are a *one-time, transactional confirmation* —
  "here is exactly what you're about to close / just closed," a receipt for
  a single, already-committed action. Conflating the two would mean "Día 2
  cerrado — 6 ventas registradas" could report a number Ana never actually
  saw accumulate under this Session — undermining the one moment this flow
  most needs to be literally true. Same "in-progress vs. closed" distinction
  `events.md` §3.14's own Q19 amendment already draws between its "hasta
  ahora" in-progress row and a finished Día row — applied here one layer
  deeper, between two states within this document rather than two rows on
  one screen.
- **New adjacency this creates, addressed directly rather than left
  implicit:** §3.11's confirm dialog renders as an overlay on top of the
  dimmed §3.7 header — the two numbers are now visible on screen at once,
  and can legitimately differ the moment this isn't Ana's first Session of
  the day under this scope (e.g. a lunch-break reopen, `decision-log.md`
  D15). A header reading "Hoy: $1,600 · 10 ventas" behind a dialog reading
  "6 ventas · $850" is correct — the dialog is about this Session's own 6
  ventas, the header is about all 10 today — but rendered with zero
  relabeling, it reads exactly like the discrepancy `architect-questions.md`
  Q19 already found erodes trust, one layer deeper. §3.11's own preview line
  is relabeled to disambiguate: "Esta sesión: 6 ventas · $850" (was: "6
  ventas · $850") — a wording-only fix, no new field, no new query, same
  number as before. §3.12 needs no matching fix — it's a full-viewport
  replacement of §3.7 (no header, §3.8f's own precedent), so the two numbers
  are never simultaneously on screen there.

### 3.7a Session controls sheet — retired for the active Session (superseded 2026-08-14 — see status header)

**Retired 2026-08-14 (Product Owner-raised — "Cerrar jornada de venta"
discoverability).** During an active Session, both actions this sheet used
to hold are now direct header affordances specified at §3.7 —
"Cerrar jornada de venta" as a labeled button, "Configuración" reached by
tapping the gear icon (⚙) directly, no intermediate sheet. No entry point
anywhere in the document routes here any longer. Kept as a named,
non-deleted entry — not silently dropped — so the historical record of
HOME-M4's original fix (why this sheet was created, and its reasoning)
stays legible; full prior content at `home.changelog.md#section-3-7a-retired`.

### 3.7b Session active header — Quick Session variant (`Session.eventId = null`; applies to every active-Session wireframe, §3.7–§3.11a)

```
┌───────────────────────────────┐
│ Sesión rápida                ⚙ │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ ...                              │  rest of screen unchanged — see the
└───────────────────────────────┘   base state this variant applies to
```
- Gap closed: every active-Session wireframe from §3.7 onward illustrates its header with "Plaza Norte · Día 2" — the Event-linked case — without ever stating what the same row shows for a Quick Session, a fully valid, equally-prioritized active-Session case per §2 step 1. A Medium-Fidelity build resolved this undocumented gap on its own, defaulting to a blank title row; this section resolves it here instead, per `product/02-ux/CLAUDE.md` §4 (a build-layer content gap "is flagged back to ux-designer... never invented or resolved unilaterally at the Figma layer").
- **Title row reads "Sesión rápida"** — one complete title, no "Día N": a Quick Session has no `eventId` to group prior Sessions under and count against.
- **Not a new term.** Reuses the exact vocabulary §3.4/§3.5's "Iniciar Sesión Rápida" already established, and the term `reports.md` §3.7 already assumed this document defined ("reusing Home's own vocabulary for the same concept, `home.md` §3.4") — this amendment makes that existing citation correct rather than inventing a fourth term for the same concept.
- **Not "Nahui."** §3.3–§3.6's idle-state fallback exists for a genuinely different situation — no Session open yet, nothing operational to state. Once a Session is open — including a Quick Session, which `architecture-principles.md` #3 treats as fully first-class, modeled with a real nullable `eventId`, never a lesser or UI-only path — there is always a true, specific fact to state instead. Reusing "Nahui" would misrepresent an active working state as idle, the opposite of §2's framing note ("selling becomes the default entry point").
- **Not blank.** No basis anywhere else in this document for an empty header — every other headered state states something. A blank row reads as a load failure, exactly as `ux-critic` flagged, on precisely the screen where a first-ever live selling session most needs to read as working. `global-principles.md`'s "technology should disappear" describes a calm, *correct* render, not an absent one.
- Applies identically to §3.7, §3.8–§3.8d, §3.9/§3.10, §3.11/§3.11a
  (dimmed header behind the confirm/blocked dialog) — one content rule,
  cross-referenced per §4's shared-states convention rather than redrawn
  at each. §3.8f is unaffected — already specified with no header at all.
  (Previously also applied to §3.7a's dimmed sheet-backdrop header —
  retired 2026-08-14, see status header.)

### 3.8 Session active — Sale in progress
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ Venta actual: 2 artículos   Cancelar│
│ Bolsas · Playeras               │
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- "Finalizar Venta" is the largest tappable element on the screen: the one
  deliberate boundary marker in the loop — a Sale's start is implicit, its end
  is the only thing worth ceremony (see §10, Decisions made).
- "Cancelar venta actual" now sits inline with the "Venta actual" line itself
  — physically separated from "Finalizar Venta" by the entire registration
  zone, instead of stacked directly above it (updated — resolves the
  adjacency half of HOME-M1). Tapping it never wipes the Sale instantly; it
  opens an inline confirm (§3.8b).
- Item list by Product name only, never a unit/lot reference.
  *architecture-principles.md* #4.
- An item that failed to sync shows a small, non-blocking marker next to it
  (see §3.8a) — the list shown here is always the true, current contents of
  the Sale, never a display that can silently diverge from what's actually
  saved (resolves HOME-B1 for the tap-to-add action).
- **No live running subtotal is shown in the tray itself while a Sale is
  in progress** — matching this section's own existing posture (item list
  by Product name only, no price/unit/lot reference) and
  `architecture-principles.md` #1: nothing about the resolved price needs
  her attention or a decision mid-Sale, so nothing about it is surfaced
  until Finalizar Venta's own total (§3.8f). The per-item name list stays
  the state of record for what's in the Sale; the dollar figure appears
  exactly once, at the boundary that already exists for a different
  reason — "a Sale's start is implicit, its end is the only thing worth
  ceremony" (§10).
- The header's "Cerrar jornada de venta" button (§3.7) stays visible and
  tappable even with an open Sale — tapping it here routes to the blocked
  notice (§3.11a), not the confirm (§3.11), per the unchanged interlock in
  §2; the button itself is never hidden or disabled to signal this,
  consistent with how the interlock already worked when this action lived
  in the sheet.

### 3.8a Tap-to-add-item — sync states (new — resolves HOME-B1)
```
Optimistic add (instant — no visible loading state on the item at all):
┌───────────────────────────────┐
│ Venta actual: 3 artículos   Cancelar│
│ Bolsas · Playeras · Accesorios     │  new item appears the instant she taps
├───────────────────────────────┤     — never a spinner, never a delay
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
└───────────────────────────────┘

Background sync retrying (silent — nothing changes on screen):
same as above — she keeps tapping/selling uninterrupted while a retry
happens behind the scenes; never surfaced unless it genuinely fails

Persistent sync failure (only after automatic retries are exhausted):
┌───────────────────────────────┐
│ Venta actual: 3 artículos   Cancelar│
│ Bolsas · Playeras · Accesorios ⚠   │  small marker on the affected item only
├───────────────────────────────┤
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
└───────────────────────────────┘
tapping the flagged item → "No se pudo guardar Accesorios. [ Reintentar ]"
shown inline, never a full-screen interruption
```
- An item appears in "Venta actual" the instant she taps a product tile —
  never a loading state on the item itself. *global-principles.md*,
  "technology should disappear." This is possible because Sale is
  specifically architected as its own cheap-to-append aggregate root
  (`architecture-principles.md` #2, `domain-model.md`) so that per-item
  writes never contend on a shared Session lock.
- If the underlying write hasn't confirmed yet, retries happen silently in
  the background — she's never blocked from tapping the next item or
  Finalizar Venta while a retry is pending.
- Only after automatic retries are exhausted does a failure become visible —
  a small, non-blocking marker (⚠) on that one item, never a full-screen
  interruption. She can keep selling around it.
- The guarantee: an item once shown in "Venta actual" is never silently
  dropped by a failed sync — the same guarantee Inventario's Guardar
  mercancía (`inventory.md` §3.10/§3.11) and Eventos' Guardar evento (`events.md`
  §3.8) already make for their own write actions. This closes the gap
  HOME-B1 identified: the two Sale-mutating actions in Home's own loop now
  have an explicit failure/retry guarantee, matching the rest of the
  document family.
- Tapping the flagged item's inline "Reintentar" resolves it and removes the
  marker. If she instead attempts Finalizar Venta while an item is still
  unresolved, that item's sync is retried as part of the same save — see
  §3.8d for what happens if it still can't be confirmed.

### 3.8b Cancelar venta actual — inline confirm (new — resolves HOME-M1)
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ Venta actual: 2 artículos          │
│ Bolsas · Playeras               │
│ ¿Cancelar estos 2 artículos?       │
│      [ No ]   [ Sí, cancelar ]     │
├───────────────────────────────┤
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Replaces the previous zero-confirmation, zero-undo "Cancelar venta actual"
  (resolves HOME-M1). Confirmation happens inline, in place — no navigation,
  no full-screen modal — because this happens mid-transaction with a
  customer present, and Home's <3s bar (`company/backlog.md` #1) still
  applies to everything around it, even while protecting against a costly
  mis-tap.
- Deliberately lighter-weight than Close-session's full dimmed-sheet
  confirmation (§3.11): that action happens at day's end with no customer
  waiting, so more ceremony is affordable there. This one doesn't have that
  luxury — but "no confirmation at all" isn't acceptable either, given it
  destroys already-registered items under direct customer pressure. See §10
  for the reasoning distinguishing the two confirmation weights.
- "No" (not "Cancelar," avoiding the same "cancel-the-cancel" label collision
  `events.md` §3.11 already solved) returns instantly to the normal
  in-progress tray (§3.8), items untouched.
- "Sí, cancelar" clears the tray back to §3.7's empty ready state — the only
  way "Venta actual" is ever emptied without a Finalizar Venta.

### 3.8c Finalizar Venta — saving (near-instant / slow) (new — resolves HOME-B1)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │        │ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │        │ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤        ├───────────────────────────────┤
│ Venta actual: 2 artículos          │        │        Cerrando venta…          │
│  ▢▢▢▢▢▢▢▢▢▢▢▢ (zona atenuada)      │        │                                │
├───────────────────────────────┤        ├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │   │ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent, brief dim              slow (>~1.5s): one plain line
```
- Identical convention to `inventory.md` §3.10 / `events.md` §3.9 — silent
  unless genuinely slow, one calm plain-language line, never a technical
  status string. Nav bar and header stay live throughout: this never blocks
  navigating away or the running totals from being visible.

### 3.8d Finalizar Venta — error (new — resolves HOME-B1)
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ No se pudo cerrar la venta.        │
│ Tus artículos siguen aquí.          │
│ Venta actual: 2 artículos          │
│ Bolsas · Playeras               │
│      [   Reintentar   ]          │
│      Cancelar venta actual         │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Same failure guarantee as every other write action in the document family
  (`inventory.md` §3.11, `events.md` §3.9): a failed Finalizar Venta never
  drops or half-commits the Sale — the tray survives exactly as it was, with
  both recovery paths (Reintentar, o Cancelar venta actual via §3.8b's
  confirm) still available. Closes the Finalizar-Venta half of HOME-B1.
- If any individual item still carries an unresolved sync marker (§3.8a) at
  the moment Finalizar Venta is attempted, resolving that item is treated as
  part of the same save — she is never shown a "success" that silently
  dropped one item.
- Never a dead end: she can retry, or in the rare case she genuinely needs to
  abandon the sale, cancel it explicitly through the same confirmed path
  everywhere else uses — she's never stuck staring at a broken screen
  mid-transaction.

### 3.8e Finalizar Venta — success (superseded — folded into §3.8f)

**Superseded 2026-08-05.** See §3.8f for the current, correct behavior —
full history at `home.changelog.md#section-3-8e-superseded`.

### 3.8f Finalizar Venta — success, receipt moment (full-viewport — new, replaces §3.8e's ambient/payment-moment model)
```
┌───────────────────────────────┐
│                                │
│                                │
│                                │
│       Venta finalizada ✓        │  small, quiet — Ana's own read
│                                │  that the write succeeded; not
│                                │  sized to compete with what follows
│                                │
│                                │
│                                │
│             $580                │  this sale's own total — the
│                                  │  largest text anywhere in the
│                                  │  product, centered, alone: the
│                                  │  number that has to land the
│                                  │  instant she turns the phone
│                                  │  around toward the customer
│                                │
│                                │
│                                │
│         Luna Mercado                │  Business.name — quiet, centered,
│                                │  same position/weight the Nahui mark
│                                │  previously held; her own logo
│                                │  renders here instead if she set one
│                                │  (see variant below) — never both
│      ┌───────────────┐          │  Paid tier only — a real,
│      │▪▪▪▪  ▪  ▪▪▪▪  │          │  tappable/scannable Claim
│      │▪  ▪  ▪▪ ▪  ▪  │          │  Token QR (decision-log.md
│      │▪▪▪▪  ▪▪ ▪▪▪▪  │          │  D22, D40) — replaces the
│      │      ▪▪       │          │  former literal placeholder
│      │▪▪ ▪▪▪▪  ▪▪    │          │  text (see the Free-tier
│      │   ▪  ▪▪ ▪▪ ▪  │          │  variant below for the tier
│      └───────────────┘          │  that gets none of this)
│   Escanéala si quieres que      │
│   te recuerden la próxima       │
│   vez que compres aquí          │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │  nav bar unchanged — reachable
└───────────────────────────────┘   exactly as everywhere else;
                                      leaving Hoy ends the receipt early
```

**Variant — `Business.logo` set:**
```
│                                │
│      [ logo del negocio ]       │  Business.logo, same centered position
│                                │  and weight the name-as-text case above
│                                │  holds — the two never render together
│                                │
```

**Variant — Free tier (`subscriptionTier=free`):**
```
┌───────────────────────────────┐
│                                │
│       Venta finalizada ✓        │
│             $580                │
│         Luna Mercado                │
│                                │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
Three elements only — confirmation, total, business identity. No future-registration line of any kind, not even a de-emphasized one: Frequent Customers isn't part of a Free-tier merchant's plan, and a placeholder hinting she'll "someday" get it would be false under `decision-log.md` D40 — she only will if she upgrades (`settings.md`'s "Activar plan de pago"), not something this receipt should imply is already coming.
- Reached only from §3.8c's success path, the instant the tray clears —
  never from a slow save (§3.8c, >~1.5s, until it actually resolves) or
  an error (§3.8d) until a retry succeeds. Same trigger condition the
  superseded §3.8e used.
- **Full-viewport replacement of §3.7, not an overlay on top of it.** No
  header (no running total, no Día N, no gear icon or "Cerrar jornada de
  venta" button — amended 2026-08-14, see status header), no
  "Venta actual" tray, no product grid — all deliberately absent, not
  merely dimmed, because during this moment the device is held toward
  the customer and none of that content has a legitimate reason to be
  customer-visible. Still a *state* of Hoy, not a new destination — no
  back arrow, nothing added to the nav graph, same category as §3.1's
  resolving skeleton or §3.14's fallback screen.
- **Three elements on a Free-tier receipt, four on a Paid-tier one**
  (`decision-log.md` D40): the existing "Venta finalizada ✓" line (carried
  over from HOME-Q1, now de-emphasized rather than dominant), the
  per-sale total (unchanged in role/prominence from the superseded
  draft — still the largest, most legible element on screen), the
  business identity (`Business.name`/`Business.logo`), and — Paid tier
  only — a real, tappable/scannable Claim Token QR (`decision-log.md`
  D22/D40), replacing, as of this amendment, the row's former textual
  placeholder. A Free-tier receipt ends at business identity.
- **"$580" is the sum of `SaleItem.pricePaid` across every item in this
  one Sale** (`decision-log.md` D33's Price resolution) — each item's
  price was already resolved automatically, at the instant it was added
  to "Venta actual" (§3.8a), from that Session's Event Price Override if
  one exists, else the Product's `defaultPrice`. Nothing about this
  number required a decision from Ana at any point in the Sale — it's a
  pure read of values already fixed before Finalizar Venta was ever
  tapped.
- **Visual device: the merchant's own identity — `Business.name`, or her own `Business.logo` if she's set one — never a QR/scan-pattern render, and, as of this amendment, no longer Nahui's own mark either.** The scan-pattern-grid rejection from the original design stands unchanged (a rendered scan pattern carries an unhedgeable "this is live and scannable" claim no matter how it's styled, and this document describes every sale forever, not a limited-run artifact) — what changes here is whose identity fills that same centered, quiet position. `Business.name` is required on every Business (`onboarding.md` §2.2b), so this element is never empty; `Business.logo` is optional and, when set, renders alone in the identical position/weight — the two are never shown together, keeping this element the same single-item composition it's always been, just pointed at a different source. **Deliberate brand-facing decision, named explicitly rather than left as an incidental consequence of adding a form field:** Nahui's own mark steps back here in favor of the merchant's — the honest read of what this moment actually is for her, a receipt from *her* business, not an ad impression for the platform she happens to be using. See §10 for the full reasoning. **Scope note, added 2026-08-09:** this bullet governs the identity element specifically (`Business.name`/`Business.logo`) and is unaffected by, and doesn't conflict with, this amendment's addition of a genuine QR one row below it (see the bullets immediately following, and §10's supersession note) — Ana's own name/logo is still never rendered as a QR; only the separate future-registration row below it changes. The two positions shared one combined rejection before splitting into distinct elements (2026-08-08's Business Identity amendment); this note keeps that history legible rather than leaving the two passages to read as contradictory.
- **Visual device for the future-registration row (Paid tier only): a real, tappable/scannable Claim Token — `decision-log.md` D22, generated automatically at Sale finalization whenever `subscriptionTier=paid` (D40) — rendered as a QR, replacing the literal textual placeholder this row previously carried.** Superseded by explicit Product Owner direction (2026-08-09), not contradicted: the two earlier "no QR-shaped render" rejections in this document (this section's own scan-pattern-grid rejection above, scoped to the identity element; the fuller historical rejection recorded later in this document's amendment history) both rejected a QR specifically because it was *decorative* — a graphic styled to look scannable while resolving to nothing, carrying an unhedgeable "this is live" claim with no real interaction behind it. What's specified here is different in kind: a genuinely functional element that, when engaged, actually navigates somewhere real — the already-built, already-Approved customer-facing flow at `product/02-ux-loyalty/customer-loyalty-registration.md` §3.1 onward. The original objection was never against QR shapes categorically, only against an unhedgeable liveness claim with nothing behind it; that risk doesn't apply to something that's actually live. See §10 for this reasoning in full.
- **Entry point, nothing more.** Engaging this element is the entry point into `product/02-ux-loyalty/customer-loyalty-registration.md`'s own already-defined resolution logic, starting at its §3.1 (Resolving) and branching exactly per that document's own §2/§4: an existing customer identifies via email and continues to §3.11 (`Compra confirmada — cliente que regresa`); a new customer goes through §3.6's minimal, fully-skippable optional-fields step to §3.10 (`Registro exitoso — primera vez`); a malformed/expired/already-claimed token resolves to §3.3/§3.4. None of this is redesigned or restated here — this amendment specifies only the bridge (this element's appearance, and that engaging it is the entry point), never the destination flow, which was already fully specified and Approved before this amendment existed.
- **Real-world mechanism vs. single-device demo realization, stated explicitly so the two aren't conflated.** In real operation, the customer scans this element with her own phone's camera, on her own separate device — the same "display an artifact the customer's own device resolves" pattern `decision-log.md` D21/D22 already establish at the Foundation level (an NFC tag, a QR, "a future claim mechanism") — so Ana's own screen is never touched by this interaction and stays exactly as it was: the receipt keeps showing until she ends it herself (below). This document's own `[ ]` = tappable convention is applied here to mark the element as genuinely live (unlike the decorative graphic the prior rejection ruled out), not as a literal claim that Ana's own finger is the intended actor. Separately — only because this is being built and demonstrated in a single-device, click-driven prototyping medium with no real camera (Figma Present mode), not a Low-Fidelity design decision — a direct tap on this element by whoever is driving the demo is the equivalent stand-in action, producing the identical destination. Realizing that stand-in mechanically is Medium-Fidelity's own job, per `product/02-ux/CLAUDE.md` §4 — not specified further here (see §11).
- **No effect on Ana's own screen state, Session, or the exit mechanism below.** Nothing about this element being engaged ends the receipt, returns her to §3.7, or touches "Venta actual," the Session, or the header total — those remain governed entirely by the margin-zone tap/auto-return specified below, unchanged. The two are spatially and functionally distinct: this element sits in the centered column where the placeholder text previously sat; the exit tap lives in the outer margin specifically because that zone is where nothing else renders. A customer engaging this element via her own device never touches Ana's screen at all, so it can never interact with the exit mechanism either way. Consistent with `architecture-principles.md` #6 — Selling has no read dependency on Loyalty-claim (`decision-log.md` D35: "Selling is explicitly not granted this edge") — Ana's screen never reflects, and never attempts to reflect, whatever happens next on the customer's own device; she'd see any resulting Claim only later, asynchronously, in Resultados' "Tus clientes" (`reports.md` §3.12/§3.13), never here.
- **Resolves `product/02-ux/product-decisions.md` Q15 — purely ephemeral, nothing persisted; no dedicated "decline to offer" action exists separately from this screen's own existing exit mechanism.** `decision-log.md` D40 states Ana "still controls whether she offers the QR during a particular Sale" — that control is located entirely in behavior she already has on this same screen: how long she holds the receipt open, and when she taps the margin zone to end it. No concrete reason surfaced during this design pass to add a distinct "skip" affordance or to persist a Sale's non-engagement — a Claim Token is generated automatically regardless (D22/D40); an unscanned one simply goes unclaimed, and nothing about that state needs tracking anywhere the merchant-facing product reads. See Q15's own resolution entry in `product-decisions.md`.
- **Flag, not resolved here: this amendment activates the Sale-level Claim Token/QR bridge — `company/backlog.md` #2's Stage 2 — ahead of that item's own stated gating (behind backlog #1's success bar), by explicit, direct Product Owner instruction specific to this amendment.** Named rather than silently assumed (`decision-log.md` D34 already flagged this identical sequencing question without resolving it generally: "a business/prioritization call... remains open for the Product Owner/Planner"). This doesn't reopen or resolve that general question — it records that this one instruction overrides it for this one element, consistent with D34's own finding that a strictly-post-sale QR placement never touched backlog #1's <3s write-path gate in the first place.
- **Consultation self-check (`company/CLAUDE.md`'s Consultation Pattern), not a live request — this bridge decomposes from already-Approved precedent, not a genuinely novel pattern.** "Display an artifact that hands a customer off to a separate, already-designed, cross-device flow" is already resolved at the Foundation level (`decision-log.md` D21/D22); "a tap that hands off into a different already-Approved document's own flow" has direct precedent within this exact document (§3.6a's "Ir a Configuración"/"Asignar tags" links); the demo-realization mechanism (a tap standing in for a camera scan) was specified directly by the Product Owner's own instruction. Flagged the same way `product/02-ux-loyalty/customer-loyalty-registration.md` §8 item 5 flags its own comparable self-check, for `ux-critic`/`reviewer` to challenge if this judgment doesn't hold.
- **Copy, replacing the retired placeholder (2026-08-09).** "(algún día vas a poder registrar aquí tu compra)" — future-tense, deliberately mechanism-noncommittal — is no longer accurate now that the mechanism is real and present. Replaced by a caption beneath the QR: "Escanéala si quieres que te recuerden la próxima vez que compres aquí" — present tense, an offer rather than an instruction (`brand/tone-of-voice.md`, "suggestions read as offers, not instructions"), reusing the same "recordar"/"la próxima vez que compres" vocabulary `product/02-ux-loyalty/customer-loyalty-registration.md` §3.5 already establishes, so the two surfaces read as one voice. Still names no internal mechanism term — "Claim," "Claim Token," "QR" never appear in the on-screen copy, only in this document's own annotations (`global-principles.md`, Product Language). Doesn't commit to a reward/gift framing either — §8's Q14 flag stays open, now attached to real copy rather than a hypothetical.
- **Ends primarily via a deliberate tap in a margin zone along the
  screen's outer edges — bottom edge foremost, not the centered column
  carrying the total/mark/QR, and not a tap anywhere on the
  receipt — with a generous, fixed auto-return held in reserve as a
  backstop, not the common-case exit.** Both return to the same place —
  plain §3.7, tray already empty (§3.13 Variant A) — the tap simply gets
  her there sooner, same as before. The bottom portion of that margin is
  the part of the device nearest Ana's own supporting hand: showing the
  total means tilting the phone's far edge toward the customer while its
  near edge stays against her palm, so reaching that zone means reaching
  past the visible total and into Ana's own grip — not the customer's
  natural motion when looking at or pointing toward what's already held
  out in front of them. Ending the receipt is a small, deliberate tap
  made there as she starts pulling the phone back toward herself — one
  motion, not two — but a real tap, not assumed from grip contact alone
  (the same limitation already raised about relying on regrip). No
  rendered marker, no label, no visible boundary for the zone itself:
  same "no new control" reading as before, just a smaller and positioned
  target rather than the full surface. The auto-return no longer aims at
  the length of an average sale — its only remaining job is recovering a
  phone set down and forgotten with the receipt still showing (§3.13's
  own scenario) — so its default is set generously long, illustratively
  tens of seconds rather than several, specifically so it isn't expected
  to fire while a customer is still genuinely present, even a slow one.
  Neither the zone's exact bounds nor the backstop's exact duration is
  pinned as hard spec here; see §11. Full reasoning for this mechanism,
  including the tradeoff it accepts, is in §10.
- **Navigating away (nav bar) or an interruption (phone lock,
  backgrounding) end the receipt immediately**, same as any other Home
  state — on return to Hoy she resolves fresh per §2/§3.13, landing on
  plain §3.7, never a lingering receipt from a now-past customer.
- Neither of the header's two direct entry points (⚙ → Configuración,
  `[ Cerrar jornada de venta ]` — amended 2026-08-14, see status header)
  is reachable from this screen — there's no header to host either. A
  deliberate, temporary omission specific to this moment, not a removal:
  both are back, unchanged, the instant §3.7 returns.
- Not the deferred "deshacer" (undo) toast scoped out in §11 — that
  remains a distinct, reversal-oriented mechanism; this stays a
  one-way, positive acknowledgment only.
- **Superseded in part by this amendment (2026-08-09) — named explicitly, not silently dropped.** This bullet originally stated the section "does not design, build, or commit to the Sale-level QR/Claim-Token mechanism (`product/99-rfc/0002-loyalty-claim-complete-capability.md`, `decision-log.md` D22) — that remains `company/backlog.md` #2's Stage 2, gated behind backlog #1's own success bar, not started." No longer accurate for the narrow bridge specified above: by explicit, direct Product Owner instruction, this amendment does commit to rendering a real, functional Claim Token QR on the Paid-tier receipt and to it being the entry point into the already-Approved `product/02-ux-loyalty/customer-loyalty-registration.md` flow. What's not superseded: this amendment still doesn't redesign or alter that destination flow itself. See the backlog-sequencing flag above.

### 3.9 Session active — `Session.operatingMode = buttons` surface
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│  ┌─────────┐  ┌─────────┐       │
│  │(B)      │  │(A)      │       │  per-Product marker — first letter of
│  │ Bolsas  │  │Accesorios│       │  Product.name, uppercased
│  │         │  │         │       │  ordered most-frequently-sold first
│  └─────────┘  └─────────┘       │
│  ┌─────────┐  ┌─────────┐       │
│  │(G)      │  │(P)      │       │  marker renders muted here too — same
│  │ Gorras  │  │Playeras │       │  dimming as the rest of the tile, not
│  │         │  │0 disponibles│    │  a separate visual case
│  └─────────┘  └─────────┘       │  sold out — dimmed, not tappable
│  ┌─────────┐  ┌─────────┐       │
│  │   …     │  │   …     │       │  grid scrolls for the rest of the Catalog
│  └─────────┘  └─────────┘       │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- This surface renders whenever `Session.operatingMode = buttons` —
  resolved once, silently in the common case, at the Session-start action
  that opened this Session (§2, §3.6a for the rare visible exception); never
  re-evaluated mid-Session.
- Large, equally-weighted 2-column grid, scrollable — reuses the layout
  already validated with Ana in `product/01-validation/registro.html`, in
  service of the <3s bar (`company/backlog.md` #1). The grid scales to
  however many Products the Catalog holds; nothing caps it at a fixed tile
  count, since Inventario itself places no ceiling on Catalog size
  (`inventory.md` §2, "Inventario supports unlimited Products"). Resolves the
  scaling half of HOME-M3.
- Tiles are ordered most-frequently-sold-first, computed automatically from
  her own Sale history — not typed or configured. Keeps her actual top
  sellers within the first screenful without scrolling, regardless of how
  large the Catalog grows. *global-principles.md*, "every repeated decision
  should become automation." A Product with no sales history yet sorts after
  anything with sales, in registration order.
- A sold-out Product (0 disponibles) stays visible in the grid rather than
  disappearing — Product persists independent of stock (`domain-model.md`
  D2), the same rule `inventory.md` §3.4 already applies to the Catalog list.
  Its tile is dimmed and does not add to the Sale on tap; the "0 disponibles"
  caption is the primary signal. Resolves the sold-out half of HOME-M3.
  **Amended 2026-08-13 (implementation-caught assumption correction, closing
  `experience-review-2026-08-13-eventos.md`'s disabled-tile finding):** this
  bullet previously read "not tappable... no separate error message on tap,
  because there's no tap to respond to," assuming a genuinely inert native
  control. A `merchant-user-tester` walk found that assumption doesn't hold
  for a first-time merchant — a tile that visually invites a tap but gives
  zero response reads as broken, not as "nothing to respond to." The tile
  stays dimmed and never adds to the Sale; a brief, self-dismissing ambient
  message ("Necesitas registrar stock de [Producto]") now confirms the tap
  registered and names the reason, reusing this codebase's existing
  ambient-confirmation pattern (`home.md` §3.8e's own "Venta finalizada ✓"),
  not a new mechanism. The underlying non-add-to-sale behavior is unchanged
  — this corrects only the "no message needed" assumption. Not RFC-worthy,
  same category as this document's other 2026-08-13 wording-precision fixes.
- **Each tile now carries a small, automatically-generated marker — the
  first letter of `Product.name`, uppercased and whitespace-trimmed** (e.g.
  "Bolsas" → "B," "Accesorios" → "A"). Closes a real gap on the
  highest-frequency screen in the app: before this, ProductTile had zero
  per-Product visual differentiator beyond its label text. Derived purely
  from `Product.name` — a fact already typed once, at Registrar Mercancía
  (`inventory.md` §3.8), and already read elsewhere in this doc — no new
  Product attribute, no schema change, nothing extra for Ana to enter.
  *global-principles.md*, "capture business truth once, reuse it forever."
  Letter collisions between two Products sharing an initial (e.g.
  "Blusa"/"Bolsa") are acceptable — the full label stays the primary
  identifier; this marker is a fast-scan aid, not a guarantee of uniqueness.
- **This is not custom per-product iconography, and isn't meant to be
  mistaken for it.** A merchant-chosen or uploaded icon per Product (a
  clothing-type glyph, a photo swatch, etc.) would require a genuinely new
  attribute on the Product aggregate — a change to the frozen
  `domain-model.md`, a Product Decision, and likely an RFC
  (`product/99-rfc/README.md`). Not designed here; flagged only as a deeper
  option worth revisiting if a bare initial letter proves insufficient at
  real catalog scale (see §11).
- **The marker renders on a sold-out tile too, muted along with the rest of
  the tile — never a separate case.** It reuses this section's own existing
  sold-out dimming rule (the bullet above) rather than adding new visual
  logic: the same dim that already covers the label and the "0 disponibles"
  caption also covers the marker, so a sold-out tile's marker never reads as
  more current or prominent than a sellable one's.
- **"Otro" tile removed.** The earlier draft's fixed 2×2 mockup included a
  generic "Otro" tile with undefined behavior (HOME-M3). Now that the grid
  shows the full Catalog and scrolls rather than capping at 3–4 tiles, every
  sellable Product already has its own tile — there's no remaining case
  "Otro" would cover. A generic catch-all here would either duplicate a
  Product already visible elsewhere in the grid, or imply selling something
  that isn't a registered Product at all — which Home cannot do, since
  Selling only ever *reads* Inventory and never creates a Product into it
  (`domain-model.md` bounded-context table; `architecture-principles.md` #6,
  one-way dependency direction). Removing it is a direct application of
  *global-principles.md*, "the fastest interaction is the one that never
  happens" — no tile without a real, defined action behind it.
- No mode indicator or toggle drawn anywhere. *architecture-principles.md* #1.

### 3.10 Session active — `Session.operatingMode = nfc` surface
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│                                │
│     Acerca el tag del            │
│         producto                 │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- This surface renders whenever `Session.operatingMode = nfc` — resolved
  once, silently in the common case, at the Session-start action that opened
  this Session (§2, §3.6a for the rare visible exception); never re-evaluated
  mid-Session.
- No product grid rendered at all — not grayed out, not present: confirms
  *architecture-principles.md* #1 at the layout level; this is a wholly
  different, exclusive surface, matching `vision.md`: "the merchant never
  switches between them while selling."

### 3.11 Close-session confirmation
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │  ¿Ya terminaste por hoy?    │ │
│  │  Esta sesión: 6 ventas · $850 │ │
│  │  [ Cancelar ]  [ Sí, cerrar ]│ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- The one place in the whole flow that deliberately asks rather than
  automates: rare, consequential, and genuinely not inferable — the
  intentional exception to, not a violation of, "never ask twice."
- Selling screen stays visible, dimmed, behind the sheet rather than replaced:
  "Cancelar" returns instantly to exactly where she was.
- **Reached only when "Venta actual" is empty** at the moment the
  header's "Cerrar jornada de venta" button (§3.7, amended 2026-08-14 —
  no longer behind a sheet) is tapped — if 1+ items are still pending,
  she's routed to §3.11a instead, never here with unfinished work
  silently at risk (updated — resolves HOME-M2).

### 3.11a Cerrar jornada de venta blocked — Venta en curso (new — resolves HOME-M2)
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │ Tienes una venta sin         │ │
│  │ terminar (2 artículos).       │ │
│  │ Termínala o cancélala antes    │ │
│  │ de cerrar la jornada de venta. │ │
│  │         [ Entendido ]          │ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Closing is the one deliberately irreversible action in the whole flow
  (§10) — an open, unfinished Sale is exactly the kind of real,
  registered-but-not-yet-committed work that must never be silently
  discarded by it. Resolves HOME-M2.
- Deliberately **not** a warn-and-proceed dialog: there's no "cerrar de
  todos modos" option here. "Entendido" routes her straight back to the
  selling screen (§3.8) with the tray completely untouched — Finalizar Venta
  o Cancelar venta actual (§3.8b) are how she resolves it; Cerrar jornada de venta is
  reachable again only once "Venta actual" is empty.
- Consistent with §2's own stated priority order: an active, non-empty Sale
  outranks every other action, including ending the day.

### 3.12 Close-summary (immediate)
```
┌───────────────────────────────┐
│        Día 2 cerrado            │
│    6 ventas registradas          │
│         $850 en total             │
│         [ Ver detalle ]           │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Only two numbers, no breakdown: matches free-tier Resultados scope
  (*domain-model.md* capability table, `subscriptionTier = free`).
- "Ver detalle" explicitly leaves Hoy for Resultados — keeps the boundary
  between "immediate confirmation" and "analysis" explicit.
- No "what do you want to do now?" prompt: next Hoy open resolves
  automatically per §2. *global-principles.md*, "every repeated decision
  should become automation."

### 3.13 Resuming a Session left open after an interruption

Two variants, depending on whether "Venta actual" held anything at the moment
of interruption — both reached exactly the same way (unlocking the phone,
returning from background, switching back from another nav tab and returning
to Hoy). (Updated — resolves HOME-B2; the earlier draft showed only Variant A
and left Variant B undefined.)

**Variant A — Venta actual was empty at the moment of interruption:**
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│   [   zona de registro       ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
Pixel-for-pixel identical to the normal ready state (§3.7/§3.9/§3.10). This
is also the condition §3.8f's full-viewport receipt relies on to clear
itself on interruption/nav-away — since the tray is already empty by the
time the receipt is showing, Variant A's resolution here is what makes "the
receipt never lingers across an interruption" true, not a separate
mechanism.

**Variant B — Venta actual had 1+ items at the moment of interruption:**
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⚙  │
│ Hoy: $850 · 6 ventas  [ Cerrar jornada de venta ] │
├───────────────────────────────┤
│ Venta actual: 2 artículos          │
│ Bolsas · Playeras               │
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
Pixel-for-pixel identical to the normal in-progress state (§3.8) — same
items, same count, nothing silently dropped.

- Resolves HOME-B2. "Venta actual" is always a read of the Sale's true,
  current, server-confirmed state — never a client-only cache that resets on
  relaunch. Reopening the app, unlocking the phone, or switching back from
  Inventario/Eventos/Resultados all land on whichever variant above is
  actually true: an interruption never fabricates an empty tray out of a real
  in-progress one, and never fabricates items that were never really added.
- The earlier draft of this section showed only the empty variant and
  described it as "pixel-for-pixel identical to the normal ready state" —
  accurate for Variant A, silent about Variant B. Both are now specified: the
  deliberate design choice stays the same in both cases — the *absence* of
  anything special, no "welcome back," no "were you still selling?" prompt —
  but "nothing special" has to mean "exactly what was really there," never
  "always reset to empty." *global-principles.md*, "never ask twice."
- This guarantee rests on the same durability requirement §3.8a establishes
  for the tap-to-add action: an item is only ever shown in "Venta actual"
  once it's durably queued for save, so an interruption occurring after that
  point can't make it disappear on resume — whether the interruption happens
  mid-selling or mid-sync-retry.
- Applies identically to switching nav tabs mid-Sale and back — not only to
  phone lock/backgrounding. §2's framing note ("the application always
  resumes where selling happens") already implied this; this section makes
  it an explicit, testable guarantee instead of an implication.
- `Session.operatingMode` itself was already resolved at the moment this
  Session first opened (§2/§3.6a) and never changes across an interruption —
  resuming never re-runs NFC Readiness or re-asks anything about mode.

### 3.14 Resolution error / defensive fallback
```
┌───────────────────────────────┐
│  No pudimos confirmar tu         │
│  sesión. Intentando de nuevo…     │
│   [   Iniciar Sesión Rápida  ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- "Iniciar Sesión Rápida" stays present and tappable even mid-failure: the
  worst outcome is Ana unable to register a sale in front of a paying
  customer. Safe *because* `eventId` is genuinely nullable in the model.
  *architecture-principles.md* #3.
- Nav bar unaffected by the error: a Home resolution failure never cascades
  into locking her out of Inventario/Eventos/Resultados.

## 4. Interaction flow (summary)

```
Open app
  → resolve (§2, automatic)
      → active Session exists ─────────────→ selling default (3.7-3.10)
      → Event active, no Session today ────→ "Continuar Día N" (3.6) → tap
          (NFC Readiness resolves Session.operatingMode — silent, or §3.6a
          if it disagrees with defaultSellingMode) → selling
          [§3.6a, when it disagrees, also offers up to one inline secondary
          action beneath the Session-start CTA, before it's tapped — none of
          which open a Session on their own:]
            → Limited Ready: [ Usar tags de todos modos ] → local override
              only, no navigation — flips the recommendation line in place
              (§3.6a); the Session-start CTA underneath stays tappable
            → Not Ready: [ Asignar tags ] → inventory.md §3.14, leaving this
              screen without starting a Session
            → Capability revoked / Ready-but-buttons-default: [ Ir a
              Configuración ] → resolve (settings.md §3.1/§3.2) → vista
              principal (settings.md §3.3a, or §3.6 if a pending change
              already exists) → "← Hoy" → back to whichever of 3.4/3.5/3.6
              (and its 3.6a variant, unchanged) was current
      → at least one `available` InventoryUnit exists → "Iniciar Sesión
          Rápida" (3.4/3.5) → tap (same NFC Readiness resolution as above)
          → selling (same §3.6a inline secondary actions as above, when
          shown)
      → zero `available` InventoryUnits ────────────→ cold start (3.3) →
          Inventario (inventory.md §3.6)
      → resolution fails ──────────────────→ fallback (3.14), Quick Session always reachable

From any of Home's four non-Session header states (3.3 cold start; 3.4/3.5
idle, with or without an upcoming Event card; 3.6 Event-active-no-Session —
new, applies settings.md §2.1's amendment) — including whichever §3.6a
Session-start-moment variant (Limited Ready / Not Ready / capability
revoked / Ready-but-`buttons`-default discoverability mention) happens to be
showing on top of 3.4/3.5/3.6 at the time, since those are the same states
with one extra line, not separate states:
  → [rare] ⋯ → session-controls sheet (3.6c) → Configuración
      → resolve (settings.md §3.1/§3.2) → vista principal (settings.md §3.3a,
        or §3.6 if a pending change already exists)
      → "← Hoy" → back to whichever of 3.3-3.6 (and its 3.6a variant, if any)
        was current, resolved fresh per §2, untouched by anything done in
        Configuración

Inside selling (3.7-3.10):
  tap/scan product → item added instantly to (implicitly opened) current sale (3.8)
      → sync happens silently in the background (3.8a)
      → [rare] persistent sync failure → non-blocking marker on that item (3.8a)
        → inline Reintentar
  → repeat for more items
  → Finalizar Venta
      → saving (3.8c)
      → error (3.8d) → Reintentar, o resolve via Cancelar venta actual (3.8b)
      → success → tray clears → full-viewport receipt (3.8f: "Venta
          finalizada ✓" + this sale's total + business identity, plus —
          Paid tier only, `decision-log.md` D40 — a real, tappable/scannable
          Claim Token QR) — replaces §3.7 entirely for the payment moment;
          no header, no grid, no Venta actual tray rendered
          → [Paid tier only, `decision-log.md` D40] tap/scan the Claim
            Token QR (§3.8f) → entry point into
            `product/02-ux-loyalty/customer-loyalty-registration.md` §3.1
            onward (Approved, out of this document's own scope to
            redesign) — resolves per that document's own already-defined
            logic; has no effect on this screen, this Session, or the exit
            mechanism above, and produces no destination back into this
            document (that document's own §4 confirms every terminal state
            there is a genuine end of its own graph)
          → auto-returns to plain §3.7 after a generous, fixed dwell —
            no tap required, nothing gated on the customer
          → [any tap on the receipt] → returns to §3.7 immediately,
            same destination as the auto-return, just sooner — the
            real-world equivalent of physically taking the phone back
          → [nav away / interruption] → same as any other Home
            interruption: returns to plain §3.7 on resume (§3.13),
            receipt never lingers across it
          → in every case, the header's running total and the product
            grid are exactly where she left them the instant §3.7
            reappears — nothing about reaching them is gated on
            anything the customer does
  → [any point, 1+ items pending] Cancelar venta actual → inline confirm (3.8b)
      → No → back to 3.8, items untouched
      → Sí, cancelar → tray clears → back to 3.7
  → [always visible, not behind a menu — amended 2026-08-14, see status
    header] [ Cerrar jornada de venta ] (header button, §3.7)
      → Venta actual empty     → confirm (3.11)
          → Cancelar → back to §3.7, unchanged
          → Sí, cerrar → summary (3.12) → next Hoy open re-resolves per §2
      → Venta actual has 1+ items → blocked (3.11a) → Entendido → back to
        3.8, untouched — must finalize or cancel the open Sale before
        Cerrar jornada de venta is reachable again
  → [always visible] ⚙ (header icon, §3.7) → Configuración, no
    intermediate sheet (amended 2026-08-14 — retires the two-entry sheet
    that used to sit here, §3.7a)
      → resolve (settings.md §3.1/§3.2) → vista principal (settings.md
        §3.3a/§3.6) → "← Hoy" → back to 3.7-3.10, Session and any open
        Sale completely untouched — reachable even mid-Sale, since
        Configuración never reads or writes Selling data

Interruption at any point (phone lock, backgrounding, switching nav tabs away
and back to Hoy):
  → resuming (3.13) reflects the Sale's true state exactly as it was — empty
    (Variant A) or with whatever items were already durably added (Variant B)
    — never silently reset, never invented. Session.operatingMode never
    re-resolves across an interruption — it was fixed the moment this Session
    first opened.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no sellable inventory (no `available` InventoryUnit)
4. Idle — no Event today, ready, no upcoming Event
5. Idle — ready, with an upcoming (not-yet-active) Event card
6. Event active, no Session opened today — "Continuar Día N"
7. Session-start moment — Session-start mode disagreement or discoverability
   mention: Limited Ready recommendation, Not Ready mention, Selling Mode
   Capability revoked mention, or (new) Ready-but-still-on-botones tags-now-
   available mention — with a next-step link on every variant except Limited
   Ready, which offers an inline override instead (§3.6a)
8. Session-controls sheet (⋯) — cold start / idle / Event-active-no-Session
   states — "Configuración" only, marked with a gear icon (§3.6c; applies
   settings.md §2.1; icon relocated 2026-08-09, Product Owner decision)
9. Session active, no Sale currently open — ready for next customer
   (header reads Venue.displayName · Día N when eventId is set, or "Sesión
   rápida" when it isn't — §3.7b; header also carries two direct entry
   points, Configuración (⚙, direct — no sheet) and "Cerrar jornada de
   venta" (labeled button) — amended 2026-08-14, see status header;
   applies identically to items 11–21 wherever they carry a header)
10. ~~Session controls sheet (⋯) — active Session~~ — **Retired
    2026-08-14** (see status header): both entries are now direct header
    affordances, folded into item 9 above; no sheet renders for this
    state any longer.
11. Session active, Sale in progress (1+ items in "Venta actual")
12. Session active, Sale in progress — item sync retrying (silent, background)
13. Session active, Sale in progress — item sync failed, non-blocking marker + inline Reintentar
14. Cancelar venta actual — inline confirm step
15. Finalizar Venta — saving (near-instant / slow)
16. Finalizar Venta — error
17. Finalizar Venta — success, full-viewport receipt: "Venta finalizada ✓"
    + per-sale total + business identity, plus — Paid tier only,
    `decision-log.md` D40 — a real, tappable/scannable Claim Token QR, the
    entry point into `product/02-ux-loyalty/customer-loyalty-registration.md`
    (2026-08-09 amendment, supersedes the earlier textual placeholder);
    temporarily replacing §3.7 entirely (no header, no grid) —
    auto-returns to §3.7
    after a generous dwell, or immediately on any tap (resolves HOME-Q1;
    superseded the same-day ambient-overlay extension on 2026-08-05, see
    §3.8f)
18. Session active, `Session.operatingMode = buttons` surface (scrollable, frequency-ordered, sold-out tiles dimmed)
19. Session active, `Session.operatingMode = nfc` surface
20. Close-session confirmation (reached only with an empty Sale)
21. Cerrar jornada de venta blocked — Venta en curso (non-empty-Sale interlock)
22. Immediate post-close session summary
23. Resuming a Session left open from an interruption/crash — empty-tray variant
24. Resuming a Session left open from an interruption/crash — non-empty-tray variant
25. Resolution error / defensive fallback

## 6. Minimum step count

| Scenario | Taps to first registered item | Why it can't be fewer |
|---|---|---|
| Nothing scheduled, ready (3.4) | 2* | 1 deliberate "start selling" commitment (protects Session-history integrity, prevents accidental first sale from a stray tap) + 1 to register the item. |
| Event active, no session today (3.6) | 2* | Same reasoning — an existing Event doesn't remove the need for a deliberate day-start moment. |
| Session already open, mid-selling (3.7-3.10) | **1** | The "start" decision was already made earlier; this is the target state for most of the selling day. |
| Cold start, no sellable inventory (3.3) | n/a — routes to Inventario | Cannot register a sale of nothing; a genuine prerequisite, not a repeated friction. |
| Resuming an unclosed session, either variant (3.13) | **1** | Treated identically to the normal ready/in-progress state — no extra step for having been interrupted, regardless of whether items survived. |

*Floor stays 2 in the common case (Ready-matching-default, or
Not-Ready-matching-a-`buttons`-default, or capability-revoked-matching-a-
`buttons`-default). The one rare exception is a Limited Ready override
(§3.6a): tapping "Usar tags de todos modos" before the existing Session-start
tap adds exactly 1 tap, making that one path 3 taps to first registered item.
Not Ready never adds a tap — there's no override to offer, only a mention.
Capability-revoked (§2/§3.6a) likewise never adds a tap, for the same
reason — mention only, no override to offer. The new Ready-but-
`defaultSellingMode=buttons` discoverability mention (§2/§3.6a) likewise
never adds a tap — a mention and an optional "Ir a Configuración" link only,
no override to offer, and shown just once ever rather than on every
qualifying Session-start.

| Recovery scenario | Taps | Why it can't be fewer |
|---|---|---|
| Cancelar venta actual (mid-sale) | 2 (Cancelar + Sí, cancelar) | A deliberate two-tap floor for a destructive action, mirroring the doc's own established confirmation cost for irreversible actions (§3.11/§10) — scaled down to an inline step rather than a full modal, given the mid-transaction, customer-present context (see §10). |
| Cerrar jornada de venta with a pending Sale | 1 (Entendido) to return to selling; 0 taps saved by the interlock itself | The interlock (§3.11a) doesn't add a tap to the happy path — it only appears when she was about to lose real work; "Entendido" is the one tap needed to get back to resolving the Sale. |
| Cerrar jornada de venta's confirm/block, from active selling (3.7-3.10) | **1** | Direct header button, no intermediate sheet (amended 2026-08-14) — was 2 (⋯ → Cerrar jornada de venta row) before this change. |

Overall floor: **1 tap once selling has begun, 2 taps to begin selling** — the
2-tap floor is a deliberate data-integrity choice (protecting Session-history
accuracy), not an unresolved inefficiency. The sole exception is a Limited
Ready override (§3.6a): overriding the recommended mode is exactly 1
additional tap before the existing Session-start tap, making that one rare
path 3 taps to begin selling — Not Ready never adds a tap, since it offers no
choice to override, and neither does a revoked Selling Mode Capability
(§2/§3.6a) — both are mentions only. Error/retry paths (§3.8a/§3.8d, §3.14)
are recovery paths for a failure, not part of this minimum-happy-path floor,
and aren't counted above. Locating a rarely-sold Product in a large
buttons-mode grid (§3.9) may require scrolling in addition to the 1 tap;
scrolling isn't counted as a "tap," and frequency-based tile ordering keeps
her actual top sellers within the first screenful regardless of Catalog size.

## 7. Automation opportunities

- `Session.operatingMode` — resolved once at Session open from the
  Business's stored `defaultSellingMode` and a computed NFC Readiness check
  (`decision-log.md` D23); never re-asked mid-Session. It can rarely surface
  *at* Session start itself — only the Limited Ready case shows a one-tap
  override (§3.6a); Not Ready, a revoked Selling Mode Capability, and the
  Ready-but-still-on-`botones` discoverability mention show a mention only,
  never an override — but once resolved, it's exactly as invisible and
  final as before. *architecture-principles.md* #1.
- Which Session to open (Event-linked vs. Quick) — computed from Event status +
  today's date, never a picker.
- "Día N" — computed from existing Sessions under the `eventId`, never typed or
  confirmed.
- FIFO unit allocation in `buttons` mode — invisible to Home/Selling entirely
  (`decision-log.md` D5).
- Resuming an unclosed Session (3.13) — automatic, no "were you still
  selling?" prompt, and now explicit that this holds whether or not items were
  pending (resolves HOME-B2).
- Post-close return to the correct next idle state — automatic, no "what do
  you want to do now?" menu.
- Elimination of the "Nueva Venta" gesture (3.8) — a Sale's start is inferred
  from the first product tap, not declared.
- Background retry of a failed item-sync (3.8a) — automatic and silent; a
  manual "Reintentar" only ever surfaces after retries are genuinely
  exhausted, never on the first hiccup.
- Buttons-mode grid ordering (3.9) — computed automatically from her own Sale
  history (most-frequently-sold-first), never a manual sort she configures.
- Price resolution (`SaleItem.pricePaid`) — resolved automatically at the
  instant each item is added, Event override if one exists else Product
  default; never a merchant decision, never a UI moment (`decision-log.md`
  D33, `domain-model.md`'s Price resolution Key Mechanism).
- Claim Token generation (`decision-log.md` D22/D40) — generated
  automatically at Sale finalization whenever `subscriptionTier=paid`,
  never a merchant decision or a UI moment of its own; §3.8f's QR is a pure
  display of an already-resolved token, the same zero-decision pattern
  already established for `SaleItem.pricePaid` (D33) and
  `Session.operatingMode` (D23).

## 8. Open questions

- **"Día N" counting nuance**: if Ana closes a Session and reopens a new one
  later the *same calendar day* under the same Event (e.g., a lunch-break
  resume), should that count as the same "Día N" or a new day number? The
  domain model doesn't specify a strict 1:1 Session-to-calendar-day rule.
  Escalated to Architect — confirmed genuinely unresolved by the Foundation
  (not just an oversight); logged as Q1 in `product/02-ux/product-decisions.md`
  (moved from `architect-questions.md` — reclassified as a Product Decision
  per `company/CLAUDE.md`'s Decision Ownership policy)
  pending a product decision on which counting rule to use.
- **Removing the "Nueva Venta" gesture** (§3.8, §10) is a real interaction-model
  change from the validated prototype (`registro.html`). Reasoning is solid,
  but since backlog #1 is explicitly evidence-driven, recommend a quick
  re-test with Ana (or simulated, per `/evidence`) before Builder locks it in.
- **Buttons-mode grid scaling and reordering (§3.9)** is also a real
  interaction-model change from the validated prototype, which was only ever
  exercised with a small, fixed set of tiles — it never tested scrolling or
  frequency-based reordering at realistic catalog sizes. Same evidence-driven
  caution as the item above: recommend validating the scrolled/reordered grid
  with Ana, or simulating a larger catalog, before Builder locks in the exact
  scroll and ordering behavior. Not escalated to Architect — this is a
  validation recommendation, not a Foundation ambiguity.
- **Future-registration/QR row's "what it does" framing** —
  the row's copy ("Escanéala si quieres que te recuerden la próxima vez
  que compres aquí," §3.8f) is present-tense and offer-shaped but still
  deliberately neutral/informational — it names no reward or incentive.
  Whether the underlying mechanism (`company/backlog.md` #2 Stage 2,
  Sale-level Claim Token per `decision-log.md` D22) should ever be framed
  to Ana/the customer as a reward or gift ("regalo," or similar) isn't
  resolved anywhere in the Foundation — D22's Claim Token is scoped to
  Customer Segmentation/intelligence, not confirmed to carry a
  reward/incentive mechanic. Not something `architect` can resolve from
  what's already written; flagged as a genuine Product Decision, logged
  as Q14 in `product/02-ux/product-decisions.md` and still Open — not
  blocking this amendment, since the current copy commits to nothing
  that would need to be walked back if Q14 resolves toward reward/gift
  language later. **Now explicitly scoped to Paid-tier receipts only**
  (`decision-log.md` D40) — a Free-tier receipt no longer shows this row
  at all (§3.8f, §10). **As of the 2026-08-09 QR amendment, this row
  renders a real, tappable/scannable QR rather than placeholder text** —
  the row's presence/copy-tone question this item tracks is unchanged in
  substance by that amendment, only its concrete on-screen form. Note,
  for anyone cross-referencing history: `product/02-ux/product-decisions.md`
  Q15 was a related but distinct question (whether a merchant's
  non-engagement with the QR on a given Sale should be persisted) — Q15
  is now Resolved (purely ephemeral, nothing persisted) and doesn't bear
  on this item's own still-open question of reward/gift framing.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — cold-start CTA is
  removed entirely when there's nothing to sell (3.3) rather than a dead-end
  button; the "Nueva Venta" gesture is removed from the core loop (3.8); the
  upcoming-event card adds zero steps to Quick Session; the "Otro" tile is
  removed from the buttons-mode grid once every Product already has its own
  tile (3.9, resolving HOME-M3); the session-controls sheet (3.7a) no longer
  references an undesigned "ver detalle de hoy" screen (resolving HOME-M4);
  the Ready-matching-default case (the common one) gains zero new screens or
  taps under D23 (§3.6a).
- *"Never ask twice"* — resuming an interrupted Session (3.13) never
  re-confirms what the system already knows, and now explicitly never
  reinvents the tray's contents either, empty or not (resolving HOME-B2);
  `Session.operatingMode` (silently resolved in the common case; §3.6a is the
  rare, single, Session-start exception — never a recurring or mid-Session
  question), Día N, and which Session to open are all computed, never asked.
  The capability-revoked mention (§3.6a) follows the same discipline as Not
  Ready's — shown once per Session-start occurrence, never repeated
  mid-Session. The new Ready-but-`buttons`-default discoverability mention
  (§3.6a) goes one step further, deliberately: shown once ever, not once per
  occurrence — repeating an FYI about a discretionary choice she may not
  want to change would itself violate this same principle.
- *"Technology should disappear"* — loading states stay silent unless
  genuinely slow; the selling surface shows only the one mode-appropriate
  input, never a technical toggle; tapping a product adds it to the tray
  instantly, with sync happening invisibly behind it (3.8a).
- *"Selling is a state, not a navigation destination"* — an active Session
  makes selling the *default* thing Hoy shows, not a place she navigates to or
  gets stuck in. The persistent bottom nav is never hidden or disabled during
  selling.
- *"Business language before technical language"* — every screen uses "Día 2,"
  "Venta actual," "Cerrar jornada de venta," never "Session," "Sale," or
  "InventoryUnit"; §3.6a's recommendation/mention lines use "tienen tag" and
  "botones," never "NFC Readiness," "threshold," or a raw count/percentage;
  the capability-revoked mention (§3.6a) stays equally plain — "no puedes
  vender con tags" — never naming "capability," "subscription," or
  "registrationMode."
- *"Every repeated decision should become automation"* — §7 is the direct
  enumeration of this applied to Home.
- *"The best interface stays out of the merchant's way"* — the
  resolution-failure fallback (3.14) never dead-ends her out of selling; a
  failed tap-to-add or Finalizar Venta never drops her registered items
  (3.8a/3.8d, resolving HOME-B1); an interrupted Sale resumes exactly as it
  was, never silently emptied (3.13, resolving HOME-B2); Cerrar jornada de venta can
  never silently discard an open Sale (3.11a, resolving HOME-M2); Not Ready
  never blocks selling itself, only withholds the one operationally
  impossible mode (§3.6a); a revoked Selling Mode Capability likewise never
  blocks selling — it states the fact plainly rather than silently
  reassigning her mode without any explanation (§2/§3.6a, resolving
  HOME2-MAJ3).

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — `Session.operatingMode` is
  resolved once, at Session start, from the Business's stored
  `defaultSellingMode` and a computed NFC Readiness check (`decision-log.md`
  D23), never re-asked per Sale; the rare Limited Ready override (§3.6a) is
  still a single, Session-start decision, not a recurring one; selling
  surface (3.9/3.10) is single-mode, no toggle. `SaleItem.pricePaid`
  resolves the identical way — automatically, at write time, from Event
  Price Override or Product default, never a per-item or per-Sale question
  (`decision-log.md` D33).
- *#2 (aggregate boundaries follow write-throughput needs)* — the 1-tap-per-item
  core loop, the optimistic instant add + silent background retry (3.8a), and
  the removal of "Nueva Venta" are only safe because Sale is its own
  cheap-to-append root, independent of Session's lock.
- *#3 (optional relationships stay optional in the data model)* — Quick
  Session always works with `eventId` null; the defensive fallback (3.14)
  relies on this being a real modeled property, not a UI trick; §3.7b's
  Quick Session header content ("Sesión rápida") is the direct UI
  consequence of treating that null `eventId` as fully first-class rather
  than a fallback needing borrowed or blank chrome.
- *#4 (internal-only entities never leak into language)* — InventoryUnit /
  InventoryEntry / SaleItem never appear in Home's copy or structure.
- *#6 (one-way dependency direction)* — Home only reads from Selling/Inventory;
  it never writes into Inventory directly and has no Intelligence/
  Loyalty-claim surface. Directly why the "Otro" tile was removed (3.9) rather
  than reinterpreted as a way to sell something outside the Catalog, and why
  "ver detalle de hoy" was removed (3.7a) rather than redesigned as a
  mid-session analytics screen. Also why NFC Readiness (§3.6a) needed no new
  bounded-context dependency edge — it reads only Inventory data Selling
  already reads (`decision-log.md` D23).

## 10. Decisions made

- **Session-active header title row has explicit content for a Quick
  Session (§3.7b).** Reads "Sesión rápida" wherever `Session.eventId` is
  null; applies to §3.7–§3.11a, excluding §3.8f. **[see
  home.changelog.md#decisions-3-7b-quick-session-title-row]**
- **A compact, automatically-generated per-Product marker (first letter of
  `Product.name`, uppercased) is added to every tile in the buttons-mode
  selling grid (§3.9).** True custom iconography is out of scope (§11).
  **[see home.changelog.md#decisions-3-9-product-tile-marker]**
- **Removed the "Nueva Venta" gesture.** A Sale's start is inferred from
  the first product tap when no Sale is open; only "Finalizar Venta" is an
  explicit boundary. **[see
  home.changelog.md#decisions-removed-nueva-venta-gesture]**
- **2-tap floor to start selling is intentional**, not a residual
  inefficiency. **[see home.changelog.md#decisions-2-tap-floor-intentional]**
- **Two deliberate confirmations exist in the flow, at two different
  weights.** Close-session (§3.11) keeps the heavier, full dimmed-sheet
  treatment; Cancelar venta actual (§3.8b) gets a lighter, inline confirm.
  **[see home.changelog.md#decisions-two-confirmation-weights]**
- **Cancelar venta actual is repositioned** inline with the "Venta actual"
  line at the top of the tray, separated from "Finalizar Venta" by the
  entire registration zone. **[see
  home.changelog.md#decisions-cancelar-venta-actual-repositioned]**
- **Tap-to-add-item and Finalizar Venta both have explicit save/error
  states** (§3.8a–§3.8d). Resolves HOME-B1. **[see
  home.changelog.md#decisions-tap-to-add-and-finalizar-venta-save-error-states]**
- **Resuming an interrupted Session (§3.13) is specified for both an
  empty and a non-empty "Venta actual."** Resolves HOME-B2. **[see
  home.changelog.md#decisions-resuming-interrupted-session-3-13]**
- **Cerrar jornada de venta interlocks with a non-empty Sale** (§3.11a) —
  hard blocked. Resolves HOME-M2. **[see
  home.changelog.md#decisions-cerrar-jornada-interlock-non-empty-sale]**
- **The buttons-mode grid (§3.9) is unbounded and scrollable, ordered
  most-frequently-sold-first**, sold-out tiles are dimmed and non-tappable,
  and the "Otro" tile is removed. Resolves HOME-M3. **[see
  home.changelog.md#decisions-buttons-grid-unbounded-sold-out-otro-removed]**
- **The session-controls sheet (§3.7a) has its own wireframe**, carrying
  two entries: "Cerrar jornada de venta" and "Configuración." Resolves
  HOME-M4. **[Partially superseded 2026-08-14 for the active-Session
  state — see the new bullet below; §3.7a itself is retired, its
  non-Session sibling §3.6c is unaffected.]** **[see
  home.changelog.md#decisions-session-controls-sheet-wireframe]**
- **Configuración is reachable from Home, per `settings.md` §2.1.** The
  session-controls sheet, and its header entry point, is reachable from
  all four non-Session states plus the active Session. **[see
  home.changelog.md#decisions-configuracion-reachable-from-home]**
- **2026-08-09 (Product Owner decision): the entry-point trigger is a
  top-right "⋯" icon; the sheet's "Configuración" row carries a gear icon
  ("⚙").** **[see
  home.changelog.md#decisions-2026-08-09-trigger-relocated-ellipsis-gear-icon]**
- **Framing: "selling becomes the default entry point," not "Home is the
  selling screen."** **[see
  home.changelog.md#decisions-framing-default-entry-point]**
- **Ambient header (Día N / running total) included as optional,
  testable.** **[see
  home.changelog.md#decisions-ambient-header-optional-testable]**
- **NFC Readiness folded into Session-start, per `decision-log.md` D23,
  further corrected for D27.** `Session.operatingMode` is the per-Session
  field; §2's Ready branch checks `nfc ∈ registrationMode`, itself derived
  from `subscriptionTier=paid` (D27). Resolves HOME2-MAJ3. **[see
  home.changelog.md#decisions-nfc-readiness-session-start-d23-d27]**
- **A fourth Session-start mention closes a D27 discoverability gap:** a
  Paid-tier merchant whose tagged inventory clears NFC Readiness while
  `defaultSellingMode` still reads `buttons` gets a one-time nudge toward
  "Cambiar a vender con tags" (§2, §3.6a). **[see
  home.changelog.md#decisions-2026-08-09-d27-cross-m1-buttons-to-nfc-nudge]**
- **A successful Finalizar Venta gets an explicit, ambient confirmation
  ("Venta finalizada ✓," §3.8e) — resolves HOME-Q1.** **[Superseded — see
  §3.8f.]** **[see
  home.changelog.md#decisions-home-q1-venta-finalizada-ambient-confirmation]**
- **[Superseded 2026-08-05 — kept for history.] §3.8e's ambient
  confirmation carries the sale's own total and a future-registration
  placeholder, dwell model changed to persist-until-next-action.** **[see
  home.changelog.md#decisions-2026-08-04-payment-moment-extension-superseded-note]**
- **2026-08-05: the payment-moment extension is superseded by a
  full-viewport receipt (§3.8f).** Three elements (confirmation, total,
  placeholder); exit via a margin-zone tap scoped to where Ana's hand
  grips the phone, backed by a long-dwell auto-return backstop; visual
  device for the placeholder is the Nahui mark alone (superseded
  2026-08-09 for the placeholder element specifically — see the Q15
  bullet below); copy unchanged; ceremony stays restrained per
  `brand-guide.md`. **[see
  home.changelog.md#decisions-2026-08-05-full-viewport-receipt-3-8f]**
- **Price resolution (`decision-log.md` D33) confirmed as a zero-decision
  automatic mechanism**, both dollar figures (§3.7, §3.8f) grounded as
  sums of `SaleItem.pricePaid`. **[see
  home.changelog.md#decisions-d33-price-resolution-grounded]**
- **§2 step 3's cold-start test corrected to "at least one `available`
  InventoryUnit exists"** (2026-08-08). **[see
  home.changelog.md#decisions-2026-08-08-cold-start-test-corrected]**
- **§4's own interaction-flow summary corrected to match §2 step 3's
  test** (2026-08-08). **[see
  home.changelog.md#decisions-2026-08-08-section-4-wiring-stale-fix]**
- **2026-08-08: §3.8f's receipt shows the merchant's own captured
  identity instead of Nahui's own mark.** Fallback is `Business.name` as
  plain text, never Nahui's mark. **[see
  home.changelog.md#decisions-2026-08-08-business-identity-receipt]**
- **2026-08-09: §3.8f's future-registration placeholder is gated on
  `subscriptionTier=paid`, absent entirely on a Free-tier receipt
  (`decision-log.md` D40).** **[see
  home.changelog.md#decisions-2026-08-09-d40-placeholder-gated-paid-tier]**
- **2026-08-09 (Product Owner decision, resolving Q15): §3.8f's Paid-tier
  receipt renders a real, tappable/scannable Claim Token QR** in place of
  the former literal placeholder text — the entry point into
  `customer-loyalty-registration.md` §3.1 onward. **[see
  home.changelog.md#decisions-2026-08-09-q15-real-qr-resolved]**
- **2026-08-13 (architect-caught wording-precision fix): §2 step 2's
  gating condition and Día N computation corrected to match already-settled
  Foundation, no behavior change.** Condition is "Event status = active
  AND no Session is currently active"; N is distinct calendar dates
  before today with a Session under this eventId, plus one for today.
  **[see
  home.changelog.md#decisions-2026-08-13-architect-wording-precision-day-n]**
- **Same-day resume surfaces an ambient "Ya vendiste $X · N ventas hoy"
  line on §3.4/§3.5/§3.6, closing a tester-found trust gap (Q19).** Shown
  only when the condition holds; the common case is unaffected. **[see
  home.changelog.md#decisions-2026-08-13-q19-same-day-resume-ambient-line]**
- **2026-08-13 (Product Owner decision): §3.7's ongoing "Hoy: $X · N
  ventas" header is context-scoped (every finalized Sale today sharing
  this Session's `eventId`), not Session-scoped.** Deliberately does not
  extend to "Venta actual," the close-confirmation dialog (§3.11), or the
  closing-summary screen (§3.12) — all three stay scoped to the single
  active/closing Session. §3.11's preview line is relabeled "Esta sesión:
  N ventas · $X." `events.md` needs no matching amendment. **[see
  home.changelog.md#decisions-2026-08-13-header-context-scope]**
- **2026-08-13 (Product Owner decision, formalizing a prototype-only
  rename): the Selling-Session-close action is renamed from "Cerrar
  sesión" to "Cerrar jornada de venta" everywhere in this document.**
  Copy-only — the close interlock (§2, §3.11a) is unchanged, only its
  trigger's label. **[see
  home.changelog.md#decisions-2026-08-13-cerrar-jornada-rename]**
- **2026-08-14 (Product Owner-raised — "Cerrar jornada de venta"
  discoverability): the active-Session header gains two direct,
  always-visible affordances, replacing the shared "⋯"-triggered sheet
  (§3.7a, now retired) for this state only.** "Cerrar jornada de venta" is
  a labeled button (`[ Cerrar jornada de venta ]`, reusing this document's
  own existing tappable-button convention rather than a new icon
  vocabulary); the "⋯" icon is replaced by a gear icon ("⚙") that routes
  directly into Configuración with no intermediate sheet, since a
  single-destination menu no longer represents a real choice. Outside an
  active Session (§3.3–§3.6, §3.6c), the "⋯" icon and its Configuración-only
  sheet are unchanged — §2 and §3.6c state the reasoning for the resulting
  divergence explicitly, rather than leaving it implicit. **[see
  home.changelog.md#decisions-2026-08-14-cerrar-jornada-direct-affordance]**

## 11. Future considerations

- **Resolved, no longer open** (was: "a generous backstop fade for
  §3.8e's ambient confirmation block"): §3.8f's receipt now specifies
  exactly this — a generous, fixed auto-return — as part of the state
  itself, not a future add-on, precisely because the phone-set-down-
  without-any-signal scenario this bullet worried about is no longer a
  possible stuck state once the receipt clears on its own. The one thing
  still open is the *exact* duration value (a few seconds vs. a specific
  number) — left as a UI-polish/tunable decision for Medium-Fidelity or
  Build, consistent with how this document already treats other timing
  thresholds (e.g. §3.2's "&gt;~1.5s").
- A true, custom per-Product icon (merchant-chosen or uploaded, beyond the
  automatic first-letter marker in §3.9) — would require a new Product
  attribute, a schema change to the frozen Domain Model, and a Product
  Decision (likely an RFC). Not designed now; the automatic marker is the
  deliberately low-cost interim signal.
- An "deshacer" (undo) toast for a few seconds after Finalizar Venta — a
  reasonable safety net, complementary to (not a replacement for) the new
  Finalizar Venta error state (§3.8d) — a Selling-flow detail, not core to
  Home; not designed here.
- A stale-sale timeout guard (e.g., visually flagging a "Venta actual" left
  untouched for several minutes) — deferred; the always-visible tray plus
  manual cancel may be sufficient, worth observing in real usage before adding
  a timer-based mechanism.
- Día N / calendar-day reconciliation (see §8) may require a small addition to
  the Event/Session read-side query, pending Architect input.
- A lightweight search/filter on the buttons-mode grid (§3.9), if a real
  Catalog grows large enough that scrolling alone (even with
  frequency-ordering) becomes slow to use mid-sale — not designed now, no
  evidence yet that Ana's actual catalog sizes need it; matches the same
  "defer until real usage shows a need" posture `inventory.md` §11 and
  `events.md` §11 already use for their own scale concerns.
- Whether the readiness threshold itself should ever be merchant-configurable
  (vs. a fixed product/business rule) — `product/99-rfc/0003-session-selling-mode.md`
  explicitly leaves the threshold's exact value as a business rule, not a
  Foundation constant; not designed here, and Ana never sees the number
  either way (§3.6a).
- **Exact single-device demo realization of the QR-to-loyalty-flow bridge (§3.8f) — a Medium-Fidelity/`ui-designer` task, not specified further here**, per `product/02-ux/CLAUDE.md` §4: this document names the destination and confirms engaging the element is the entry point; which Figma node/frame a click resolves to, and how a demo returns from `product/02-ux-loyalty/customer-loyalty-registration.md`'s own terminal states (which, by that document's own design, has no "return to Merchant App" destination — a presenter-driven manual step, not a designed interaction) is build-layer wiring.
