# Home (Hoy) — UX Specification

Status: Approved. Full UX Remediation cycle complete — HOME-B1, HOME-B2,
HOME-M1, HOME-M2, HOME-M3, HOME-M4 fixed by `ux-designer`, verified clean by
`ux-critic` (zero remaining Blockers/Majors), and passed `reviewer`'s
Foundation-consistency check (no Blockers; one cross-document Important
finding — stale post-renumbering section references — corrected by Main).
**Amended for `decision-log.md` D23** (Session-scoped selling mode: Selling
Mode Capability / Default Selling Mode / Session Operating Mode / NFC
Readiness — see `product/99-rfc/0003-session-selling-mode.md`). Amendment
went through its own full cycle — `ux-critic` found four Major findings
across three remediation rounds (HOME2-MAJ1 through HOME2-MAJ4, see
`product/02-ux/ux-critic-findings.md`), all fixed and verified clean, and
`reviewer`'s Foundation-consistency pass found zero Blockers/Important
findings. Folded back into Approved.
**Amended for `decision-log.md` D20** (Venue aggregate root): every session
header ("Bazar Plaza Norte" — Type+Place compound) corrected to
`Venue.displayName` alone ("Plaza Norte"), matching the pattern `events.md`
already established. This document's own wireframes never received this fix
when D20 landed; caught by `reviewer` during `home.md`'s Medium-Fidelity
Figma review (`product/02b-medium-fidelity/home.md`), 14 instances corrected
by `ux-designer`, applied by Main. Copy-only — no flow, state, or behavior
changed.
**Amended for `settings.md` §2.1** (Configuración entry point): added the
header "▾" affordance to Home's four non-Session states (§3.3–§3.6,
including the §3.6a Session-start-moment variants) and a second
"Configuración" row to the active-Session controls sheet (§3.7a), plus a new
Configuración-only sheet variant (§3.6c) for the non-Session states —
closing a gap Architect's build-readiness review found (Configuración had no
way to be reached from three of Home's four non-Session states). Went
through its own cycle — `ux-critic` found three Major findings (missing "▾"
on §3.6a's variants; a stale pre-`settings.md` design note; a
self-contradicting §10 bullet) plus one Minor (section read-order) in the
first pass, all fixed and verified, with one further Minor (a stale Q5
citation) caught and fixed during verification — and `reviewer`'s
Foundation-consistency pass found zero Blockers, two Important
documentation-hygiene findings (a stale `information-architecture.md`
citation, and this status log itself not yet updated — both addressed
alongside this paragraph). Folded back into Approved.
**Amended for `decision-log.md` D27** (NFC capability corrected to derive
from `subscriptionTier`, not kit/code activation — separating Business
capability, preferred selling mode, Session selling mode, and operational
readiness into four genuinely distinct concepts, per Product Owner
correction): §2's Ready-branch check, §3.6a's capability-revoked bullet and
design note, §3.6c's entry-point notes, and §10's decisions bullet were all
corrected to cite `settings.md`'s "Activar plan de pago" as the real
restoration mechanism instead of the retired "Activar venta con tags." A new
fourth §3.6a variant was also added — a one-time (shown once ever, not once
per Session-start), discoverability-only nudge for a Paid-tier merchant
whose tagged inventory clears NFC Readiness while `defaultSellingMode`
still reads `buttons` — closing a gap `ux-critic` found (nothing previously
told her that capability had become usable). Went through its own cycle —
`ux-critic` found one Blocker (in `onboarding.md`'s sibling milestone copy,
not here) plus two Major and three Minor findings across the coordinated
three-document amendment, all fixed and verified. `reviewer`'s
Foundation-consistency pass pending.
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

2. Is there an Event with status = active, with no Session opened yet under
   it today?
     → YES: show "Continuar Día N" (N = existing Sessions under this eventId
       + 1, computed, never asked). Tapping it is the moment a new Session
       actually opens — see the folded-in sub-step below.

3. Does the Catalog have at least one Product ever registered (has she ever
   registered a Lot)?
     → NO:  cold-start empty state → route to Inventario.
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

**Framing note (approved refinement):** during an active session, selling
becomes the *default entry point* of the application — not a locked screen. The
merchant can always navigate to Inventario, Eventos, or Resultados, or reach
session controls, but the application always resumes where selling happens. The
persistent bottom nav (`Hoy · Inventario · Eventos · Resultados`, per the frozen
IA) stays visible and tappable through every state below, including all selling
states. Opening Hoy while actively selling takes her directly back to selling
(§2's priority order is unconditional) — but stepping away is always one tap,
never obstructed, and never gated by a confirmation.

**Session-controls interlock (added — resolves HOME-M2):** session controls
(▾ → the sheet in §3.7a) are reachable at any time, but carry exactly one
interlock: if "Venta actual" holds 1+ items, tapping "Cerrar sesión" from that
sheet does not open the close-session confirmation (§3.11) — it opens a
blocking notice instead (§3.11a) that routes her back to the open Sale so she
can finish or explicitly cancel it first. This is the one control in the whole
doc that doesn't go where it says on a first tap: closing a Session is the sole
deliberately irreversible action in the whole flow (§10), so it's the one
control that can never be allowed to silently discard real, registered-but-
unfinished work. This interlock is specific to *closing the Session* — it does
not apply to navigating to another tab mid-Sale, which is always safe and
always resumes exactly where she left off (§3.13, resolving HOME-B2 below).
**This interlock is scoped to "Cerrar sesión" specifically — "Configuración,"
the sheet's other entry per `settings.md` §2.1, is unaffected and reachable
even with an open Sale, since it never touches Selling data.** Outside an
open Session, the header's "▾" opens a lighter, Configuración-only variant
of the same sheet (§3.6c) on §3.3–§3.6, including the §3.6a
Session-start-moment variants shown on top of §3.4/§3.5/§3.6 — a Session
hasn't opened yet at that moment either, and a merchant seeing the
capability-revoked variant in particular has arguably the most reason of all
three to want to reach Configuración right then (§3.6a).

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

### 3.3 Cold start (no Product ever registered)
```
┌───────────────────────────────┐
│  Nahui                        ▾ │
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
- Routes into Inventario, an existing nav tab — no new destination invented for
  this one case. (Exactly where within Inventario is resolved in
  `product/02-ux/inventory.md` §10: directly into Registrar Mercancía, not
  Inventario's own cold-start screen.)
- **Header's "▾" opens the session-controls sheet (§3.6c) — "Configuración"
  only, no "Cerrar sesión," since no Session is open yet (new — applies
  `settings.md` §2.1's amendment).** Same affordance §3.7a already provides
  once a Session is active, extended here because the capabilities
  Configuración manages are meaningful to check even before Ana has ever
  registered a Product.

### 3.4 Idle — no Event today, ready
```
┌───────────────────────────────┐
│  Nahui                        ▾ │
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
- **Header's "▾" opens the session-controls sheet (§3.6c) — "Configuración"
  only, same as §3.3 (new — applies `settings.md` §2.1's amendment).**

### 3.5 Idle — ready, with an upcoming (not-yet-active) Event
```
┌───────────────────────────────┐
│  Nahui                        ▾ │
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
- **Header's "▾" opens the session-controls sheet (§3.6c) — "Configuración"
  only, same as §3.3/§3.4 (new — applies `settings.md` §2.1's amendment).**
  The event card and the sheet are unrelated — opening Configuración never
  touches the upcoming Event.

### 3.6 Event active, no Session opened today
```
┌───────────────────────────────┐
│  Nahui                        ▾ │
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
- **Header's "▾" opens the session-controls sheet (§3.6c) — "Configuración"
  only, same as §3.3–§3.5 (new — applies `settings.md` §2.1's amendment).**
  An active Event with no Session yet still has nothing to close — "Cerrar
  sesión" doesn't apply until "Continuar Día 2" is actually tapped.

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

**Header carries the "▾" affordance too, identically to §3.4/§3.5/§3.6 — every
wireframe below shows it.** Opening it reaches the same session-controls sheet
as the resting screen (§3.6c) — reachable at this Session-start moment exactly
as it is before or after it, since no Session is open yet even here. This
matters most for the capability-revoked variant below: a merchant who's just
been told she can't sell with tags has arguably the most reason of the three
to want to reach Configuración right then (§2).

**Limited Ready, `defaultSellingMode = nfc` (recommends `buttons`, overridable):**
```
┌───────────────────────────────┐
│  Nahui                        ▾ │
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
│  Nahui                        ▾ │
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
│  Nahui                        ▾ │
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
│  Nahui                        ▾ │
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
│  Nahui                        ▾ │  dimmed, still visible underneath
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  [       Configuración        ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Reached by tapping the header "▾" from any of §3.3 (cold start), §3.4/§3.5
  (idle, with or without an upcoming Event card), or §3.6 (Event active, no
  Session opened today) — the four Home states with a persistent header but
  no open Session — including whichever of §3.4/§3.5/§3.6's §3.6a
  Session-start-moment variants (Limited Ready, Not Ready, capability
  revoked, or the Ready-but-`buttons`-default discoverability mention)
  happens to be showing at the time, since those are the identical screens
  with one extra line, not separate states requiring their own entry point.
  Per `settings.md` §2.1, this is deliberate, not an oversight: the
  things Configuración manages — her plan, clientes frecuentes, and now
  (per `decision-log.md` D27) her `defaultSellingMode` (Botones ↔ Etiquetas
  NFC) directly — are meaningful to check or change whether or not Ana
  happens to be selling that particular day. Gating them behind an open
  Session would misuse Session-start — a real business event that
  timestamps hours worked (§10) — for a non-selling errand.
- Exactly one entry, "Configuración" — no "Cerrar sesión" row, since none of
  these four states has an open Session to close. Contrast with §3.7a,
  reached the identical way once a Session is active, which carries both
  entries.
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
│ Plaza Norte · Día 2         ▾   │  header = ambient info + session-controls
│ Hoy: $850 · 6 ventas             │  entry point
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│   [   zona de registro,          │  mode-appropriate content fills here
│       según Session.operatingMode ]│  (see 3.9 / 3.10)
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Header doubles as passive info and the session-controls entry point —
  tapping "▾" opens a small sheet (§3.7a) rather than acting immediately.
  Concrete implementation of "session controls stay reachable" from the
  framing note in §2 (updated — resolves HOME-M4; see §3.7a for what the
  sheet actually contains and why).
- "Venta actual: (vacía)" shown even with nothing pending: ambient visibility
  so a stale/leftover sale is never invisible.
- Registration surface is the single biggest area on screen, always exactly
  one mode, resolved once at Session-start (§2/§3.6a) and never re-evaluated
  mid-Session. *architecture-principles.md* #1.

### 3.7a Session controls (▾) — sheet (resolves HOME-M4; extended per `settings.md` §2.1)
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ▾   │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas             │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  [       Cerrar sesión        ]  │
│  [       Configuración        ]  │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
- Resolves HOME-M4. The earlier draft's "▾ reveals Cerrar sesión / ver detalle
  de hoy" referenced a second feature — "ver detalle de hoy" — that had no
  wireframe, no entry in §5, and no defined relationship to the ambient
  header. It's removed here rather than left dangling. The ambient header
  line ("Hoy: $850 · 6 ventas") already shows today's running total; anything
  deeper than that belongs to Resultados once the day's Sessions actually
  close — the same scope boundary `product/02-ux/events.md` §3.16/§10
  established for Eventos after Q7's resolution (Eventos doesn't duplicate
  Resultados' analytics; it hands off). Inventing a live, mid-day analytics
  screen inside Home would both duplicate that scope and break
  *architecture-principles.md* #6 (Home/Selling only ever reads Selling data;
  it has no analytics surface of its own).
- Shown as a small sheet rather than a single hardcoded action, because
  `information-architecture.md` ("Onboarding and Settings") committed this
  exact affordance — "the header's ▾" — as the eventual reachability point
  for Settings (`decision-log.md` D13). **That commitment is now realized:**
  per `settings.md` §2.1 (approved), the sheet carries two entries during an
  active Session — "Cerrar sesión" (unchanged) and "Configuración" (new).
- "Cerrar sesión" and "Configuración" are independent actions. Tapping
  "Cerrar sesión" proceeds to §3.11 (Venta actual empty) or §3.11a (Venta
  actual has 1+ items — blocked, resolves HOME-M2), per the interlock stated
  in §2. Tapping "Configuración" routes to `settings.md`'s resolve step
  (§3.1/§3.2) → vista principal (§3.3a), and returns to exactly this screen
  (§3.7, Session unaffected) via "← Hoy." Opening Configuración never touches
  the open Session, "Venta actual," or the Cerrar-sesión interlock above —
  Configuración writes only to Identity's Business Capabilities, never to
  Selling (*architecture-principles.md* #6).

### 3.8 Session active — Sale in progress
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: 2 artículos   Cancelar│
│ Pijama · Calcetines               │
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

### 3.8a Tap-to-add-item — sync states (new — resolves HOME-B1)
```
Optimistic add (instant — no visible loading state on the item at all):
┌───────────────────────────────┐
│ Venta actual: 3 artículos   Cancelar│
│ Pijama · Calcetines · Sudadera     │  new item appears the instant she taps
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
│ Pijama · Calcetines · Sudadera ⚠   │  small marker on the affected item only
├───────────────────────────────┤
│   [   zona de registro       ]   │
│   [      Finalizar Venta     ]   │
└───────────────────────────────┘
tapping the flagged item → "No se pudo guardar Sudadera. [ Reintentar ]"
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
│ Plaza Norte · Día 2         ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: 2 artículos          │
│ Pijama · Calcetines               │
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
│ Plaza Norte · Día 2         ▾   │        │ Plaza Norte · Día 2         ▾   │
│ Hoy: $850 · 6 ventas             │        │ Hoy: $850 · 6 ventas             │
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
│ Plaza Norte · Día 2         ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ No se pudo cerrar la venta.        │
│ Tus artículos siguen aquí.          │
│ Venta actual: 2 artículos          │
│ Pijama · Calcetines               │
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

### 3.9 Session active — `Session.operatingMode = buttons` surface
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│  ┌─────────┐  ┌─────────┐       │
│  │ Pijama  │  │Sudadera │       │  ordered most-frequently-sold first
│  │         │  │ / Maxy  │       │
│  └─────────┘  └─────────┘       │
│  ┌─────────┐  ┌─────────┐       │
│  │Bufandas │  │Calcetines│      │
│  │         │  │0 disponibles│    │  sold out — dimmed, not tappable
│  └─────────┘  └─────────┘       │
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
  Its tile is dimmed and not tappable; the "0 disponibles" caption is the
  only difference from a normal tile, and is the only signal needed — no
  separate error message on tap, because there's no tap to respond to.
  Resolves the sold-out half of HOME-M3.
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
│ Plaza Norte · Día 2         ▾   │
│ Hoy: $850 · 6 ventas             │
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
│ Plaza Norte · Día 2         ▾   │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas             │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │  ¿Ya terminaste por hoy?    │ │
│  │  6 ventas · $850             │ │
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
- **Reached only when "Venta actual" is empty** at the moment "Cerrar
  sesión" is tapped from §3.7a's sheet — if 1+ items are still pending, she's
  routed to §3.11a instead, never here with unfinished work silently at risk
  (updated — resolves HOME-M2).

### 3.11a Cerrar sesión blocked — Venta en curso (new — resolves HOME-M2)
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ▾   │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas             │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │ Tienes una venta sin         │ │
│  │ terminar (2 artículos).       │ │
│  │ Termínala o cancélala antes    │ │
│  │ de cerrar la sesión.           │ │
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
  o Cancelar venta actual (§3.8b) are how she resolves it; Cerrar sesión is
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
│ Plaza Norte · Día 2         ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: (vacía)            │
│   [   zona de registro       ]   │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
Pixel-for-pixel identical to the normal ready state (§3.7/§3.9/§3.10).

**Variant B — Venta actual had 1+ items at the moment of interruption:**
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ▾   │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ Venta actual: 2 artículos          │
│ Pijama · Calcetines               │
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
      → nothing active, Catalog has Products → "Iniciar Sesión Rápida"
          (3.4/3.5) → tap (same NFC Readiness resolution as above) → selling
      → Catalog empty ─────────────────────→ cold start (3.3) → Inventario
      → resolution fails ──────────────────→ fallback (3.14), Quick Session always reachable

From any of Home's four non-Session header states (3.3 cold start; 3.4/3.5
idle, with or without an upcoming Event card; 3.6 Event-active-no-Session —
new, applies settings.md §2.1's amendment) — including whichever §3.6a
Session-start-moment variant (Limited Ready / Not Ready / capability
revoked / Ready-but-`buttons`-default discoverability mention) happens to be
showing on top of 3.4/3.5/3.6 at the time, since those are the same states
with one extra line, not separate states:
  → [rare] ▾ → session-controls sheet (3.6c) → Configuración
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
      → success → tray clears → back to 3.7 (ready for next customer)
  → [any point, 1+ items pending] Cancelar venta actual → inline confirm (3.8b)
      → No → back to 3.8, items untouched
      → Sí, cancelar → tray clears → back to 3.7
  → [rare] ▾ → session-controls sheet (3.7a) → two independent entries:
      → Cerrar sesión
          → Venta actual empty     → confirm (3.11) → Sí, cerrar → summary (3.12)
            → next Hoy open re-resolves per §2
          → Venta actual has 1+ items → blocked (3.11a) → Entendido → back to
            3.8, untouched — must finalize or cancel the open Sale before
            Cerrar sesión is reachable again
      → Configuración (new — applies settings.md §2.1's amendment)
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
3. Cold start — no Product ever registered
4. Idle — no Event today, ready, no upcoming Event
5. Idle — ready, with an upcoming (not-yet-active) Event card
6. Event active, no Session opened today — "Continuar Día N"
7. Session-start moment — Session-start mode disagreement or discoverability
   mention: Limited Ready recommendation, Not Ready mention, Selling Mode
   Capability revoked mention, or (new) Ready-but-still-on-botones tags-now-
   available mention — with a next-step link on every variant except Limited
   Ready, which offers an inline override instead (§3.6a)
8. Session-controls sheet (▾) — cold start / idle / Event-active-no-Session
   states — "Configuración" only (§3.6c; applies settings.md §2.1)
9. Session active, no Sale currently open — ready for next customer
10. Session controls sheet (▾) — active Session — "Cerrar sesión" and
    "Configuración" (updated — second entry added per settings.md §2.1)
11. Session active, Sale in progress (1+ items in "Venta actual")
12. Session active, Sale in progress — item sync retrying (silent, background)
13. Session active, Sale in progress — item sync failed, non-blocking marker + inline Reintentar
14. Cancelar venta actual — inline confirm step
15. Finalizar Venta — saving (near-instant / slow)
16. Finalizar Venta — error
17. Session active, `Session.operatingMode = buttons` surface (scrollable, frequency-ordered, sold-out tiles dimmed)
18. Session active, `Session.operatingMode = nfc` surface
19. Close-session confirmation (reached only with an empty Sale)
20. Cerrar sesión blocked — Venta en curso (non-empty-Sale interlock)
21. Immediate post-close session summary
22. Resuming a Session left open from an interruption/crash — empty-tray variant
23. Resuming a Session left open from an interruption/crash — non-empty-tray variant
24. Resolution error / defensive fallback

## 6. Minimum step count

| Scenario | Taps to first registered item | Why it can't be fewer |
|---|---|---|
| Nothing scheduled, ready (3.4) | 2* | 1 deliberate "start selling" commitment (protects Session-history integrity, prevents accidental first sale from a stray tap) + 1 to register the item. |
| Event active, no session today (3.6) | 2* | Same reasoning — an existing Event doesn't remove the need for a deliberate day-start moment. |
| Session already open, mid-selling (3.7-3.10) | **1** | The "start" decision was already made earlier; this is the target state for most of the selling day. |
| Cold start, no products (3.3) | n/a — routes to Inventario | Cannot register a sale of nothing; a genuine prerequisite, not a repeated friction. |
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
| Cerrar sesión with a pending Sale | 1 (Entendido) to return to selling; 0 taps saved by the interlock itself | The interlock (§3.11a) doesn't add a tap to the happy path — it only appears when she was about to lose real work; "Entendido" is the one tap needed to get back to resolving the Sale. |

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
  "Venta actual," "Cerrar sesión," never "Session," "Sale," or
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
  was, never silently emptied (3.13, resolving HOME-B2); Cerrar sesión can
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
  surface (3.9/3.10) is single-mode, no toggle.
- *#2 (aggregate boundaries follow write-throughput needs)* — the 1-tap-per-item
  core loop, the optimistic instant add + silent background retry (3.8a), and
  the removal of "Nueva Venta" are only safe because Sale is its own
  cheap-to-append root, independent of Session's lock.
- *#3 (optional relationships stay optional in the data model)* — Quick
  Session always works with `eventId` null; the defensive fallback (3.14)
  relies on this being a real modeled property, not a UI trick.
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

- **Removed the "Nueva Venta" gesture** present in the original validation
  prototype. A Sale's start is now inferred from the first product tap when no
  Sale is open; only "Finalizar Venta" is an explicit boundary. Mitigated the
  one real risk (stale sale from an interrupted customer) by keeping the
  current-sale tray always visible plus a small "Cancelar venta actual"
  action — which now also carries its own lightweight, inline confirmation
  (§3.8b), rather than reintroducing an explicit start step.
- **2-tap floor to start selling is intentional**, not a residual
  inefficiency — Session start is a real, meaningful business event
  (timestamps hours worked, feeds future Resultados) and deserves one
  deliberate commitment tap, distinct from the act of registering an item.
- **Two deliberate confirmations now exist in the flow, at two different
  weights, not one.** The original draft stated Close-session was "the one
  deliberate confirmation in the whole flow" — no longer accurate once
  Cancelar venta actual gained its own confirm step (resolving HOME-M1).
  Close-session (§3.11) keeps the heavier, full dimmed-sheet treatment: it
  happens at day's end, with no customer waiting, and is genuinely
  irreversible. Cancelar venta actual (§3.8b) gets a lighter, inline confirm
  instead: it happens mid-transaction, with a customer physically present,
  where Home's <3s bar still applies. Same underlying principle — a
  destructive/irreversible action never goes unconfirmed — applied with
  proportional ceremony to two genuinely different contexts, not an
  inconsistency between them.
- **Cancelar venta actual is repositioned** away from being stacked directly
  above "Finalizar Venta" (§3.8) — it now sits inline with the "Venta actual"
  line at the top of the tray, separated from the primary action by the
  entire registration zone, directly addressing the mis-tap/adjacency risk
  named in HOME-M1.
- **Tap-to-add-item and Finalizar Venta now both have explicit save/error
  states** (§3.8a–§3.8d), matching every other write action in the document
  family. Chosen shape: tap-to-add is optimistic and instant, syncing silently
  in the background, surfacing a failure only once automatic retries are
  exhausted and only as a small, non-blocking per-item marker — preserving the
  <3s bar while still guaranteeing no silent data loss. Finalizar Venta reuses
  the same near-instant/slow/error pattern already established by Guardar
  mercancía and Guardar evento. Resolves HOME-B1.
- **Resuming an interrupted Session (§3.13) is now specified for both an
  empty and a non-empty "Venta actual."** "Venta actual" is always a read of
  the Sale's true current state, not a client-only cache — an interruption
  can never fabricate an empty tray out of a real in-progress one. Resolves
  HOME-B2.
- **Cerrar sesión now interlocks with a non-empty Sale** (§3.11a) — hard
  blocked, not a warn-and-proceed dialog, because closing is the one
  deliberately irreversible action in the flow and an unfinished Sale is real,
  already-registered work. Resolves HOME-M2.
- **The buttons-mode grid (§3.9) is now explicitly unbounded and scrollable,
  ordered most-frequently-sold-first**, sold-out tiles are dimmed and
  non-tappable (matching Inventario's own sold-out treatment), and the
  undefined "Otro" tile is removed entirely, since Selling never creates a
  Product outside the Catalog (`architecture-principles.md` #6). Resolves
  HOME-M3.
- **The session-controls sheet (§3.7a) now has its own wireframe**, replacing
  the earlier draft's undesigned "▾ reveals Cerrar sesión / ver detalle de
  hoy" reference. "Ver detalle de hoy" is removed as an unspecified,
  undesigned feature rather than left dangling — the ambient header already
  covers today's running total, and anything deeper belongs to Resultados.
  Kept as an (extensible) sheet rather than a single hardcoded action
  specifically because `information-architecture.md` already commits this
  affordance as the future reachability point for Settings
  (`decision-log.md` D13) — the extensibility commitment is now realized:
  the sheet carries two entries today, "Cerrar sesión" and "Configuración"
  (see the next bullet for how the second entry landed). Resolves HOME-M4.
- **Configuración is now reachable from Home, per `settings.md` §2.1.**
  `settings.md`'s own spec amends this document: a "Configuración" row is
  added to the session-controls sheet (§3.7a) below "Cerrar sesión," and the
  sheet itself is now reachable from Home's four non-Session header states
  (Cold start, Idle-no-event, Idle-with-event, Event-active-no-Session) via
  a new "▾" affordance on the header (§3.3–§3.6, including the §3.6a
  Session-start-moment variants shown on top of §3.4/§3.5/§3.6, and §3.6c) —
  not only from an active Session. "Cerrar sesión" stays scoped to an active
  Session, exactly as before; "Configuración" is available in every state,
  since capability self-service (D25) has no dependency on whether a
  Session is open. The two sheet entries are independent actions, not a
  shared flow — this closes the gap `product/00-foundation`'s Architect
  readiness review flagged: without it, Configuración had no way to be
  reached from three of Home's four non-Session states.
- **Framing: "selling becomes the default entry point," not "Home is the
  selling screen."** The persistent bottom nav stays reachable through every
  selling state; navigating away is never obstructed. Opening Hoy while
  actively selling still always resumes selling (§2 unconditional), but that's
  a distinct fact from whether she can leave.
- **Ambient header (Día N / running total) included as optional, testable** —
  passive display only, not an interaction, doesn't compete with speed.
- **NFC Readiness folded into Session-start, per `decision-log.md` D23,
  further corrected for D27.** The
  Ready-matching-default case (the common one) stays exactly as fast and
  silent as before — zero wireframe changes, zero new taps. Limited Ready,
  Not Ready, an unavailable Selling Mode Capability, and (see the next
  bullet) the Ready-but-still-on-`botones` discoverability mention are the
  only cases that ever become visible, all scoped to
  the existing Session-start action (§3.6a) rather than a new screen: Limited
  Ready is a one-tap-to-override inline recommendation; Not Ready is a
  one-time, non-blocking mention (only when it disagrees with a
  `defaultSellingMode` of `nfc`) with a path to Asignar Tags, never a block on
  selling itself. `Session.operatingMode` replaces the old Business-wide
  `registrationMode` wherever this document meant "which mode this specific
  Session runs in" — the Business-level Selling Mode Capability (whether
  `nfc` is available at all) is a distinct concept from `Session.operatingMode`,
  but no longer one this document leaves ungated: §2's Ready branch now
  explicitly checks `nfc ∈ registrationMode` before ever resolving a Session
  silently into `nfc`, so an unavailable `nfc` can never be silently
  bypassed just because a stale `defaultSellingMode` field still reads
  `nfc`. Per `decision-log.md` D27, `nfc ∈ registrationMode` is itself now a
  pure read-time derivation from `subscriptionTier = paid` — the case this
  bullet describes arises specifically from a Paid→Free downgrade landing
  (`settings.md` §2.2, "Volver al plan gratis"), not an unspecified
  "capability revocation." The Session still opens in
  `buttons` automatically in this case — but, as of this fix, never
  silently: it now gets the same kind of one-time, non-blocking mention Not
  Ready gets, and — once `settings.md` landed and provided a real
  destination — the same kind of next-step link too ("Ir a Configuración"):
  `settings.md` (Approved, Q5 Resolved via `decision-log.md` D25, further
  corrected by D27) specifies the actual self-service restoration path at
  §2.2 ("Activar plan de pago") — see §3.6a.
  Resolves HOME2-MAJ3.
- **A new, fourth Session-start mention closes a discoverability gap D27
  introduced: a Paid-tier merchant whose tagged inventory clears NFC
  Readiness while `defaultSellingMode` still reads `buttons` now gets a
  one-time nudge toward Configuración's "Cambiar a vender con tags" control
  (§2, §3.6a).** Before this, nothing in the product ever told her the
  capability she's paying for had become usable. D23's asymmetric nudge
  architecture (nudges only ever point away from `nfc`) is unchanged and not
  reopened by this addition — the new mention is purely informational,
  changes nothing about Session-start's own resolution (the Session still
  opens silently in `buttons`, exactly as before), and is shown once ever
  rather than once per occurrence — a deliberate, narrower discipline than
  the other three §3.6a mentions, chosen because this one nudges toward a
  discretionary choice she's entitled to decline, not an operational fact
  that changes what's happening right now.

## 11. Future considerations

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
