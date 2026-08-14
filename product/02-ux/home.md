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
Foundation-consistency pass found zero Blockers, one Important finding
(stale "two real paths" language in `onboarding.md` contradicting its own
§2.2 — fixed directly by Main) — clean on re-check. Folded back into
Approved.
**Amended 2026-08-04 (HOME-Q1, Product Owner-raised):** new §3.8e ambient
"Venta finalizada ✓" confirmation after a successful Finalizar Venta,
previously indistinguishable from a fresh Session start or a cancelled
sale. Full cycle complete, `ux-critic`/`reviewer` clean, folded back into
Approved.
**Amended 2026-08-04 (payment-moment extension of HOME-Q1's §3.8e):** the
ambient "Venta finalizada ✓" confirmation now also carries the sale's own
total and a literal, future-tense placeholder line for a not-yet-built
registration mechanism, with its dwell model changed from a fixed fade to
persisting until Ana's next action. **Superseded, see the entry below.**
**Superseded 2026-08-05 (receipt-moment redesign, supersedes the
payment-moment extension above):** the ambient-overlay model above —
total and placeholder layered on top of §3.7's resting screen — is
retired, not extended further. During the payment moment the device is
held out to the customer, so Ana's revenue total and the live product
grid can't legitimately render at all, not just be de-emphasized — an
overlay can only ever dim that content, never actually remove it from
the render. Finalizar Venta success now routes to a new full-viewport
receipt (§3.8f) that temporarily replaces §3.7 rather than overlaying
it, carrying forward the per-sale total and the (still non-QR-shaped)
future-registration placeholder, with a new exit model (a margin-zone
tap scoped to where Ana's hand grips the phone, backed by a long-dwell
auto-return reserved for the abandoned-phone case — revised once
already after a `ux-critic` Blocker found the first version reachable
by the customer too) replacing "tap a product tile," since the tile
grid is no longer on screen to tap. §3.8e is kept as a superseded pointer entry rather than
deleted, per this document's own amendment-history convention (see
§3.7a's precedent). Full cycle complete (one Blocker on the original
exit mechanism, found and fixed — see `ux-critic-findings.md` HOME-B3
— one non-gating Minor tracked as HOME-MIN3), `ux-critic`/`reviewer`
clean, folded back into Approved.
**Amended 2026-08-04 (icon/comprehension audit):** §3.9's ProductTile now
carries a per-Product marker (first letter of `Product.name`), with an
explicit non-scope note that true custom iconography needs a Product
Decision/RFC. Full cycle complete, `ux-critic`/`reviewer` clean, folded
back into Approved.
**Amended 2026-08-08 (`decision-log.md` D33, MVP pricing operating model):**
Home's existing dollar figures (§3.7's running total, §3.8f's receipt
total) are now explicitly grounded as sums of `SaleItem.pricePaid`,
resolved automatically at every tap/scan — no new screen, state, or tap
added. Part of the same four-document D33 remediation as `inventory.md`/
`events.md`/`reports.md`; `ux-critic` verified this document's portion
clean in round 1, with no findings against it in either round. `reviewer`
clean (no Blockers, no Important findings) — folded back into Approved.
**Amended 2026-08-08 (`decision-log.md` D33, "Define lo que vendes" moved into Onboarding):** §2 step 3's cold-start test corrected from "Product ever registered" to "`available` InventoryUnit exists" — required once Onboarding could create Products with zero stock (`onboarding.md` §2.2a). Two remediation rounds — round 1's fix missed a stale copy of the old test in §4's own wiring section; round 2 corrected it. `ux-critic` verified clean (zero Blockers, zero unresolved Majors). `reviewer` clean (no Blockers, no findings against this document specifically) — folded back into Approved.
**Amended 2026-08-08 (Product Owner decision, Business Identity captured at Onboarding):** §3.8f's receipt moment now shows the merchant's own captured identity (`Business.name`, and her own logo if she set one, per `onboarding.md` §2.2b) in place of "(marca Nahui)" — Nahui's own mark stepping back in favor of the merchant's, a deliberate brand-facing product decision, not an incidental side effect. Honest fallback: `Business.name` as plain text whenever no logo is set (the common case, treated as fully first-class, not a lesser rendering). No new screen, state, or tap — a content/asset-source change to an already-Approved state. Pending `ux-critic`/`reviewer` review before folding back into Approved.
**Amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled` retired, Frequent Customers unified as a Paid-tier-only capability):** §3.8f's future-registration placeholder is now gated on `subscriptionTier=paid` — a Free-tier receipt no longer shows it at all, three elements only (confirmation, total, business identity). A Paid-tier receipt keeps the placeholder, copy unchanged — the capability already exists automatically the instant `subscriptionTier=paid` (D40); only this specific receipt-moment interaction (what exactly renders here, whether a live QR eventually replaces the placeholder) remains undesigned, tracked as `product/02-ux/product-decisions.md` Q15, not resolved by this amendment. §3.8f, §4, §5, §8, §10, §11 updated.
**Amended 2026-08-09 (Product Owner decision — Configuración entry-point relocated from the header's "▾" to a top-right icon-based menu):** the small "▾" dropdown next to the "Nahui"/session header — flagged by the Product Owner as not reading as discoverable or natural — is replaced by a top-right "⋯" (three-dot/overflow) icon, opening the identical session-controls sheet already specified (§3.6c/§3.7a), with no change to which Home states show it, when "Cerrar sesión" appears, or what Configuración itself does once reached. The sheet's Configuración row now also carries a gear icon ("⚙"), specifically distinguishing it from "Cerrar sesión" and from any other entry the sheet may carry in the future, per the Product Owner's explicit request. **Why "⋯" rather than a hamburger ("☰"):** a hamburger conventionally signals a full secondary navigation drawer with many destinations, which would misrepresent — and visually compete with — what's actually behind this trigger (a one-or-two-row sheet, not a parallel navigation system), undercutting `decision-log.md` D13's own ruling that this affordance is a sequencing/reachability fact, not a fifth nav tab, alongside the persistent, already-primary bottom nav bar. `settings.md` receives the matching correction in the same pass — see that document's own status header and §2.1/§8 item 3. `ux-critic`/`reviewer` both clean. Folded into Approved.
**Amended 2026-08-09 (Product Owner decision, resolving `product/02-ux/product-decisions.md` Q15 — the Digital Receipt's Claim Token QR is now real, not a placeholder):** §3.8f's Paid-tier receipt now renders a genuine, tappable/scannable Claim Token QR (`decision-log.md` D22) in the row the earlier textual future-registration placeholder held — the entry point into the already-Approved `product/02-ux-loyalty/customer-loyalty-registration.md` flow (§3.1 onward), which this amendment specifies the bridge into without redesigning. Explicitly supersedes, rather than silently contradicts, this document's own two prior "no QR-shaped render" passages (§3.8f's identity-element bullet; the historical 2026-08-05 entry) — both correctly rejected a decorative, non-functional QR graphic for carrying an unhedgeable liveness claim with nothing behind it, an objection that doesn't hold against a genuinely functional element navigating to a real destination. The Free-tier receipt is unaffected — still three elements, no QR, no placeholder, exactly as the 2026-08-09 D40 amendment above already established. Resolves Q15 (`product-decisions.md`): purely ephemeral, nothing persisted; no dedicated "decline to offer" action exists separate from the receipt's own already-specified exit mechanism. Flags, without resolving, that this activates `company/backlog.md` #2's Stage 2 for this one element ahead of its own stated gating, by direct Product Owner instruction. §3.8f, §4, §5, §7, §8, §10, §11 updated. `ux-critic` round 1: 4 stale-reference findings (3 Major, 1 Minor) — fixed, verification clean. `reviewer` clean (2 Important findings, both documentation-tracking gaps — this `ux-critic-findings.md` entry and a stale status line, both closed separately). Folded into Approved.
**Amended 2026-08-12 (Medium-Fidelity spec-gap escalation — SessionHeader title row during an active Quick Session):** closes an undocumented gap `ux-critic` flagged during Medium-Fidelity build, where an active Quick Session (no `eventId`) had no defined title-row content — a Medium-Fidelity build had defaulted to a blank title row, indistinguishable from a load failure, on Ana's own first-ever live selling screen. New §3.7b specifies the title row reads "Sesión rápida" wherever `Session.eventId` is null, applying to every active-Session wireframe in §3.7–§3.11a — the same term §3.4's "Iniciar Sesión Rápida" already established and `reports.md` §3.7 already assumed this document defined (it hadn't, until now). Small, bounded content addition — no new screen, flow, or navigation branch. §5 (item 9), §9 (architecture-principles.md #3), §10 updated.
**Amended 2026-08-13 (Architect-caught wording-precision fix, ahead of the
Eventos build — no behavior change):** §2 step 2's literal text is
corrected to match Foundation it had drifted from: the gating condition
now reads "Event status = active AND no Session is currently active" (the
direct complement of step 1, dropping the stale "no Session opened yet
under it today" qualifier, which read as literally false — and would have
incorrectly fallen through to plain idle, §3.4 — on the exact lunch-break-
resume case `decision-log.md` D15's own worked example describes), and N's
computation is corrected from a raw Session-row count to D15's distinct-
calendar-date rule (`domain-model.md`'s "Día N" computation, which this
document's own §3.6 wireframe and `events.md`/`reports.md` already reuse).
Classified by `architect` as Architect-resolvable from existing Foundation
alone — no Product Owner input needed, no new decision. The underlying
behavior `events.md` §1/D15 already specify is unchanged; only §2 step 2's
literal wording is brought into agreement with them. Same category as this
document's own EVT-Q1/EVT-Q2-style precision fixes (see `events.md`'s
status header for that precedent).
**Amended 2026-08-13 (Architect-resolvable content amendment, closing an
`experience-review-2026-08-13-eventos.md` finding — see `architect-questions.md`
Q19, cross-referencing Q7):** §3.4/§3.5 ("Iniciar Sesión Rápida," Quick
Session) and §3.6/§3.6a ("Continuar Día N," Event-linked) each gain a
conditional, ambient line — "Ya vendiste $X · N ventas hoy" — shown only
when a Session under the relevant scope (this `eventId`, or `eventId = null`
for Quick Sessions) already has 1+ finalized Sales on today's calendar
date; absent entirely in the common case (first Session of the day), so
the happy path stays pixel-identical to today's spec. Sourced from
`SUM(SaleItem.pricePaid)`/`COUNT(Sale)` across the identical Session set
`domain-model.md`'s "Día N" computation already scopes to today — no new
query, no new fetch. Closes a tester-found trust gap: a same-day resume
(e.g. after a lunch-break close) correctly reopens the same Día N per D15,
but nothing previously told Ana a closed Session's sales already existed
before she reopened selling, and she read the fresh $0 running total as
data loss. Classified by `architect` as Architect-resolvable directly from
`architect-questions.md`'s existing Q7 ruling (Eventos/Home may show "a
thin, ambient, in-progress indicator" as part of their own status role) —
no new Product Owner decision, same category as this document's own
preceding 2026-08-13 entry. Coexists independently with §3.6a's NFC
Readiness/capability lines — both can render at once, in a fixed stacking
order (see §3.6/§3.4 above). No new §5 screen-state entry — a conditional
content addition to already-enumerated states, same treatment as the
2026-08-08 Business Identity receipt amendment above. `events.md` §3.14
receives the matching addition in the same pass — see that document's own
status header.
**Further amended 2026-08-13 (Product Owner decision — §3.7's ongoing header
redefined context-scoped, not Session-scoped; closes a
`merchant-user-tester` re-walk finding surfaced on top of the already-Applied
`architect-questions.md` Q19):** §3.7's "Hoy: $X · N ventas" — and every
active-Session wireframe rendering the identical row (§3.7a, §3.7b, §3.8,
§3.8b, §3.9, §3.10, the dimmed header behind §3.11/§3.11a) — is redefined
from a running sum of this one Session's own Sales to a running sum of every
finalized Sale today sharing this Session's `eventId` (`eventId = null` for a
Quick Session, matching every other Quick Session today; the specific
Event's `eventId` for an Event-linked Session, matching every other Session
under that Event today). Not Architect-resolvable — `architect`'s own Q19
ruling explicitly declined to rule on this, naming it "a deeper, separate
question... not resolving here... a legitimate, separate design call,"
precisely because it redefines an already-Approved, deliberately-reasoned
Session-scoped definition (`decision-log.md` D33) rather than interpreting
existing Foundation. The Product Owner has now made that call directly: "The
merchant interprets 'Hoy' as 'everything I've sold today in the context I'm
currently working in'... this avoids the trust issue where reopening the app
after closing a session shows '$0 · 0 ventas' even though the merchant has
already sold today." Necessity confirmed by a `merchant-user-tester` re-walk
of Q19's own fix: Q19's ambient "Ya vendiste $X · N ventas hoy" line
(§3.4/§3.5/§3.6) correctly warns Ana *before* she resumes selling that a
closed same-day Session's sales still exist — but the live selling screen's
own §3.7 header, the number she's actually looking at continuously once
she's resumed, still reset to Session-scoped $0 immediately after,
reproducing the identical trust gap Q19 set out to close, one screen later.
Reuses the identical `todaySalesSummary`-shaped query `architect-questions.md`
Q19 already established (`SUM(SaleItem.pricePaid)`/`COUNT(Sale)` across the
same Session set), applied here to an ongoing header instead of a one-time
ambient line — no new query, no new field. **"Venta actual" (§3.8), the
close-confirmation dialog (§3.11), and the closing-summary screen (§3.12) are
explicitly unaffected** — all three stay scoped to the single active/closing
Session, a deliberately different kind of fact (one-time transactional
confirmation, not ambient status); see §3.7's own bullets below for the
reasoning and for a small, necessary relabel to §3.11's preview line this
scope split otherwise leaves ambiguous. `events.md` needs no matching
change — confirmed, not assumed: its own §3.14 same-day-resume row (Q19)
already computes the identical context-scoped fact for the Event-linked
case, and its "Vendiendo ahora" hand-off (§3.15) renders no running total of
its own; both hand off into this same Home selling surface rather than
duplicating it. No new screen, state, or tap — a content/scope amendment to
already-enumerated states, same treatment as the 2026-08-08 Business
Identity receipt amendment and this document's own preceding 2026-08-13
entries. §3.7, §3.7a (cross-reference only), §3.11 (preview-line relabel
only), §10 updated. Pending `ux-critic`/`reviewer` review before folding back
into Approved.
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

**Session-controls interlock (added — resolves HOME-M2):** session controls
(the header's "⋯" icon → the sheet in §3.7a) are reachable at any time, but carry exactly one
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
open Session, the header's "⋯" icon opens a lighter, Configuración-only variant
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
  only, no "Cerrar sesión," since no Session is open yet (applies
  `settings.md` §2.1's amendment; relocated from the header's "▾" per the
  Product Owner's 2026-08-09 decision — see status header).** Same affordance §3.7a already provides
  once a Session is active, extended here because the capabilities
  Configuración manages are meaningful to check even before Ana has ever
  registered a Product.

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
  sesión" doesn't apply until "Continuar Día 2" is actually tapped.

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
- Exactly one entry, "Configuración" — no "Cerrar sesión" row, since none of
  these four states has an open Session to close. Contrast with §3.7a,
  reached the identical way once a Session is active, which carries both
  entries. The "Configuración" row carries a gear icon ("⚙"), the same
  marker §3.7a's sheet uses, distinguishing it from "Cerrar sesión" and from
  any entry the sheet may carry in the future (Product Owner decision,
  2026-08-09).
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
│ Plaza Norte · Día 2         ⋯   │  header = ambient info + session-controls
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
  tapping the "⋯" icon opens a small sheet (§3.7a) rather than acting
  immediately (relocated from the header's "▾" per the Product Owner's
  2026-08-09 decision — see status header).
  Concrete implementation of "session controls stay reachable" from the
  framing note in §2 (updated — resolves HOME-M4; see §3.7a for what the
  sheet actually contains and why).
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
  itself, §3.7a (dimmed, behind the sheet), §3.7b (Quick Session title-row
  variant — its total is context-scoped identically), §3.8, §3.8b, §3.9,
  §3.10, and the dimmed header behind §3.11/§3.11a — one content rule,
  cross-referenced rather than redefined at each, per
  `product/02-ux/CLAUDE.md` §4's shared-states convention.
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

### 3.7a Session controls (⋯) — sheet (resolves HOME-M4; extended per `settings.md` §2.1; entry-point icon relocated 2026-08-09, Product Owner decision — see status header)
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⋯   │  dimmed, still visible underneath
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
  exact affordance — described in `decision-log.md` D13 at the time as "the
  header's ▾," now realized as a top-right "⋯" icon (relocated 2026-08-09,
  Product Owner decision — see status header; D13's own ruling, hangs off
  session controls rather than a fifth nav tab, is unaffected, only its
  illustrative glyph is stale) — as the eventual reachability point
  for Settings. **That commitment is now realized:**
  per `settings.md` §2.1 (approved), the sheet carries two entries during an
  active Session — "Cerrar sesión" (unchanged) and "Configuración" (new, now
  marked with a gear icon "⚙" distinguishing it from "Cerrar sesión" and any
  future entry).
- "Cerrar sesión" and "Configuración" are independent actions. Tapping
  "Cerrar sesión" proceeds to §3.11 (Venta actual empty) or §3.11a (Venta
  actual has 1+ items — blocked, resolves HOME-M2), per the interlock stated
  in §2. Tapping "Configuración" routes to `settings.md`'s resolve step
  (§3.1/§3.2) → vista principal (§3.3a), and returns to exactly this screen
  (§3.7, Session unaffected) via "← Hoy." Opening Configuración never touches
  the open Session, "Venta actual," or the Cerrar-sesión interlock above —
  Configuración writes only to Identity's Business Capabilities, never to
  Selling (*architecture-principles.md* #6).

### 3.7b Session active header — Quick Session variant (`Session.eventId = null`; applies to every active-Session wireframe, §3.7–§3.11a)

```
┌───────────────────────────────┐
│ Sesión rápida                ⋯ │
│ Hoy: $850 · 6 ventas             │
├───────────────────────────────┤
│ ...                              │  rest of screen unchanged — see the
└───────────────────────────────┘   base state this variant applies to
```
- Gap closed: every active-Session wireframe from §3.7 onward illustrates its header with "Plaza Norte · Día 2" — the Event-linked case — without ever stating what the same row shows for a Quick Session, a fully valid, equally-prioritized active-Session case per §2 step 1. A Medium-Fidelity build resolved this undocumented gap on its own, defaulting to a blank title row; this section resolves it here instead, per `product/02-ux/CLAUDE.md` §4 (a build-layer content gap "is flagged back to ux-designer... never invented or resolved unilaterally at the Figma layer").
- **Title row reads "Sesión rápida"** — one complete title, no "Día N": a Quick Session has no `eventId` to group prior Sessions under and count against.
- **Not a new term.** Reuses the exact vocabulary §3.4/§3.5's "Iniciar Sesión Rápida" already established, and the term `reports.md` §3.7 already assumed this document defined ("reusing Home's own vocabulary for the same concept, `home.md` §3.4") — this amendment makes that existing citation correct rather than inventing a fourth term for the same concept.
- **Not "Nahui."** §3.3–§3.6's idle-state fallback exists for a genuinely different situation — no Session open yet, nothing operational to state. Once a Session is open — including a Quick Session, which `architecture-principles.md` #3 treats as fully first-class, modeled with a real nullable `eventId`, never a lesser or UI-only path — there is always a true, specific fact to state instead. Reusing "Nahui" would misrepresent an active working state as idle, the opposite of §2's framing note ("selling becomes the default entry point").
- **Not blank.** No basis anywhere else in this document for an empty header — every other headered state states something. A blank row reads as a load failure, exactly as `ux-critic` flagged, on precisely the screen where a first-ever live selling session most needs to read as working. `global-principles.md`'s "technology should disappear" describes a calm, *correct* render, not an absent one.
- Applies identically to §3.7, §3.7a (dimmed header behind the sheet), §3.8–§3.8d, §3.9/§3.10, §3.11/§3.11a — one content rule, cross-referenced per §4's shared-states convention rather than redrawn at each. §3.8f is unaffected — already specified with no header at all.

### 3.8 Session active — Sale in progress
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⋯   │
│ Hoy: $850 · 6 ventas             │
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
│ Plaza Norte · Día 2         ⋯   │
│ Hoy: $850 · 6 ventas             │
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
│ Plaza Norte · Día 2         ⋯   │        │ Plaza Norte · Día 2         ⋯   │
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
│ Plaza Norte · Día 2         ⋯   │
│ Hoy: $850 · 6 ventas             │
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

**Superseded 2026-08-05.** This section previously specified an ambient
confirmation ("Venta finalizada ✓") layered on top of §3.7's resting
selling screen — first as a bare confirmation line (HOME-Q1), then,
later the same day, extended with the sale's own total and a
future-registration placeholder while keeping that same overlay shape
(the "payment-moment extension"). That overlay model is retired, not
extended further: during the payment moment the device is held out to
the customer, and Ana's daily revenue total plus the live, tappable
product grid have no legitimate reason to be visible to someone
standing across the counter. The fix isn't hiding one line of the
existing screen — it's that a successful Finalizar Venta now routes to
a genuinely different state, §3.8f, a full-viewport receipt that
temporarily replaces §3.7 rather than layering on top of it. See §3.8f
for the current, correct behavior. This entry is kept, rather than
deleted outright, so the document's own amendment history stays
legible — the same convention this document already uses elsewhere
(e.g. §3.7a's removal of "ver detalle de hoy").

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
  header (no running total, no Día N, no session-controls "⋯" icon), no
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
- Session-controls ("⋯") is not reachable from this screen — there's no
  header to host it. A deliberate, temporary omission specific to this
  moment, not a removal: it's back, unchanged, the instant §3.7 returns.
- Not the deferred "deshacer" (undo) toast scoped out in §11 — that
  remains a distinct, reversal-oriented mechanism; this stays a
  one-way, positive acknowledgment only.
- **Superseded in part by this amendment (2026-08-09) — named explicitly, not silently dropped.** This bullet originally stated the section "does not design, build, or commit to the Sale-level QR/Claim-Token mechanism (`product/99-rfc/0002-loyalty-claim-complete-capability.md`, `decision-log.md` D22) — that remains `company/backlog.md` #2's Stage 2, gated behind backlog #1's own success bar, not started." No longer accurate for the narrow bridge specified above: by explicit, direct Product Owner instruction, this amendment does commit to rendering a real, functional Claim Token QR on the Paid-tier receipt and to it being the entry point into the already-Approved `product/02-ux-loyalty/customer-loyalty-registration.md` flow. What's not superseded: this amendment still doesn't redesign or alter that destination flow itself. See the backlog-sequencing flag above.

### 3.9 Session active — `Session.operatingMode = buttons` surface
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⋯   │
│ Hoy: $850 · 6 ventas             │
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
│ Plaza Norte · Día 2         ⋯   │
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
│ Plaza Norte · Día 2         ⋯   │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas             │
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
- **Reached only when "Venta actual" is empty** at the moment "Cerrar
  sesión" is tapped from §3.7a's sheet — if 1+ items are still pending, she's
  routed to §3.11a instead, never here with unfinished work silently at risk
  (updated — resolves HOME-M2).

### 3.11a Cerrar sesión blocked — Venta en curso (new — resolves HOME-M2)
```
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⋯   │  dimmed, still visible underneath
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
│ Plaza Norte · Día 2         ⋯   │
│ Hoy: $850 · 6 ventas             │
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
│ Plaza Norte · Día 2         ⋯   │
│ Hoy: $850 · 6 ventas             │
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
  → [rare] ⋯ → session-controls sheet (3.7a) → two independent entries:
      → Cerrar sesión
          → Venta actual empty     → confirm (3.11)
              → Cancelar → back to §3.7, unchanged
              → Sí, cerrar → summary (3.12) → next Hoy open re-resolves per §2
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
   rápida" when it isn't — §3.7b; applies identically to items 10–21
   wherever they carry a header)
10. Session controls sheet (⋯) — active Session — "Cerrar sesión" and
    "Configuración" (the latter marked with a gear icon; second entry added
    per settings.md §2.1; icon relocated 2026-08-09, Product Owner decision)
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
21. Cerrar sesión blocked — Venta en curso (non-empty-Sale interlock)
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

- **Session-active header title row now has explicit content for a Quick
  Session (§3.7b, closes a Medium-Fidelity spec-gap escalation,
  `product/02-ux/CLAUDE.md` §4).** Reads "Sesión rápida" — reusing the term
  §3.4/§3.5 and `reports.md` §3.7 already established — rather than the
  idle-state "Nahui" fallback or a blank row. Grounded in
  `architecture-principles.md` #3 (Quick Session as fully first-class) and
  `global-principles.md`'s "technology should disappear" (a calm, correct
  render, not an empty one). Applies to §3.7–§3.11a, excluding §3.8f (no
  header by design).

- **A compact, automatically-generated per-Product marker (first letter of
  `Product.name`, uppercased) is added to every tile in the buttons-mode
  selling grid (§3.9).** Closes a real gap on the highest-frequency screen
  in the app — ProductTile previously had no visual differentiator beyond
  its label. Derived purely from already-stored `Product.name`; no new
  Product attribute, no schema change, no RFC needed for this change
  itself. True custom per-product iconography (a merchant-chosen/uploaded
  icon) is explicitly out of scope here — it would require a new Product
  attribute, a Product Decision, and likely an RFC; flagged as a future,
  deeper option only (§11), not designed in this pass. The marker renders
  muted on a sold-out tile by reusing this section's existing sold-out
  dimming rule, never as an independent visual treatment. Not RFC-worthy
  itself — no aggregate boundary, domain term, or IA change; a UX
  visual-differentiation fix to an already-Approved spec, same category as
  this document's other post-Approval amendments.
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
  the header's session-controls icon (originally "▾," relocated 2026-08-09
  to a top-right "⋯" — see the new bullet below) (§3.3–§3.6, including the
  §3.6a Session-start-moment variants shown on top of §3.4/§3.5/§3.6, and
  §3.6c) —
  not only from an active Session. "Cerrar sesión" stays scoped to an active
  Session, exactly as before; "Configuración" is available in every state,
  since capability self-service (D25) has no dependency on whether a
  Session is open. The two sheet entries are independent actions, not a
  shared flow — this closes the gap `product/00-foundation`'s Architect
  readiness review flagged: without it, Configuración had no way to be
  reached from three of Home's four non-Session states.
- **2026-08-09 (Product Owner decision): the entry-point trigger relocates from the header's "▾" to a top-right "⋯" icon; the sheet's "Configuración" row gains a gear icon ("⚙").** Raised because the Product Owner found the "▾" insufficiently discoverable/natural. Purely a trigger-level and sheet-row-marker change — no state gains or loses the entry point (the same four-state exclusion this document already establishes, §3.1/§3.2/§3.12/§3.14, is unchanged), "Cerrar sesión" stays scoped to an active Session exactly as before, and nothing about Configuración's own downstream behavior (settings.md §3.3a onward) is touched. **"⋯" chosen over a hamburger ("☰"):** a hamburger conventionally signals a full secondary navigation drawer with many destinations; adopting one here would misrepresent, and visually compete with, what's actually behind this trigger — a one-or-two-row sheet, not a parallel navigation system — undercutting decision-log.md D13's own ruling that this affordance is a sequencing/reachability fact, not a fifth nav tab, alongside the persistent, already-primary bottom nav bar. A three-dot overflow icon is the more standard, more honestly-scoped mobile convention for a small set of secondary actions attached to a screen, and directly answers the Product Owner's stated concern with a widely-recognized signifier the "▾" never was. The gear icon on "Configuración" specifically (not on "Cerrar sesión") answers the Product Owner's explicit request to distinguish it from any other entry the sheet may carry in the future. Every current-state wireframe and current-tense description of the trigger across this document (§2, §3.3–§3.7a, §3.8f, §4, §5) is updated to "⋯"; narrative describing the moment the "▾" affordance was first introduced (this bullet's own predecessor, and §3.7a's HOME-M4 history) is left as an accurate record of that point in time, not rewritten. settings.md receives the matching correction in the same pass — see that document's own status header and §2.1/§8 item 3.
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
- **A successful Finalizar Venta now gets an explicit, ambient confirmation
  ("Venta finalizada ✓," §3.8e) — resolves HOME-Q1.** Every other successful
  write action in the document family (`inventory.md`'s "Mercancía
  registrada ✓," "Mercancía lista para vender ✓"; `events.md`'s "Evento
  agendado ✓") already got this treatment; Finalizar Venta — the highest-
  frequency, most consequential write action in the product, directly tied
  to `company/CLAUDE.md`'s core registration-speed thesis — had none. Before
  this fix, the post-success resting state ("Venta actual: (vacía)," §3.7)
  was pixel-identical to both a fresh Session start and a post-cancellation
  state (§3.8b), giving Ana no way to tell "it saved" from "nothing
  happened" or "I cancelled it" without mentally tracking the header total
  herself. Fixed by reusing the same ambient, zero-tap posture already
  established by the sibling docs — no dismiss tap, adds no step to the next
  sale (note: the fixed-fade timing was later changed by the 2026-08-04
  payment-moment extension below — this bullet describes the original
  zero-tap mechanism, not the current dwell model) — rather than inventing a new
  mechanism. Distinct from, and does not reopen, §11's already-deferred
  "deshacer" (undo) toast: that's a separate, reversal-oriented affordance;
  this is a one-way positive acknowledgment only. Not RFC-worthy — no
  aggregate boundary, domain term, or IA change; a UX state-design fix to an
  already-Approved spec, same category as the other amendments recorded
  above.
- **[Superseded 2026-08-05 by the bullet immediately below — kept for
  history, per this document's amendment-log convention.] §3.8e's ambient
  confirmation now carries the sale's own total and a
  literal, future-tense placeholder for a not-yet-built registration
  mechanism, and its dwell model changed from a fixed fade to
  persist-until-her-next-action.** Extends, not replaces, HOME-Q1's original
  fix. Two things drove this: (1) the total makes a genuine Finalizar Venta
  success even more clearly distinct from a fresh Session start or a
  cancelled sale — a stronger version of the same signal HOME-Q1 already
  established, since neither of those paths ever produces a per-sale total;
  (2) this screen is designed to be turned toward the customer during
  payment, so its content now has a real external reader and a real,
  variable-length moment to survive, which the original half-second-glance
  fade was never tuned for. The dwell model was changed accordingly: the
  block persists until she taps forward (any product tile, which starts the
  next sale and clears it as a side effect — no dedicated dismiss action)
  or until she leaves Hoy or the app is interrupted, at which point §3.13's
  existing "resolve fresh, no stale state" guarantee already applies. An
  explicit "Continuar vendiendo" control was considered and dropped — since
  the registration grid is never blocked or covered by this content, there
  is no real state for such a control to resolve, and it would only add
  chrome competing with the total for attention on a screen that may be
  facing a customer. The placeholder line is deliberately literal
  ("algún día vas a poder registrar aquí tu compra") rather than any
  QR-shaped graphic — a QR render would carry an unhedgeable "this is live"
  claim regardless of who's reading it or in what context, and this
  document is a permanent spec, not a one-week moderated-test artifact where
  that risk is temporarily lower. Its copy uses Ana's own vocabulary, never
  the internal "Claim"/"Claim Token" terms from `decision-log.md`
  D22/`ubiquitous-language.md` (`global-principles.md`, Product Language).
  This does not design, build, or commit to the Sale-level QR/Claim-Token
  mechanism itself (`product/99-rfc/0002-loyalty-claim-complete-capability.md`)
  — that remains `company/backlog.md` #2's Stage 2, gated behind backlog
  #1's own success bar, not started. Not RFC-worthy — no aggregate boundary,
  domain term, or IA change; a UX state-design amendment to an
  already-Approved spec, same category as this document's other
  post-Approval amendments.
- **2026-08-05: the payment-moment extension above is superseded by a
  full-viewport receipt (§3.8f), replacing the ambient-overlay model
  entirely rather than extending it again.** Two things forced this: (1)
  a confirmed privacy problem — during the payment moment the device is
  held out to the customer, and Ana's cumulative daily revenue (the
  header's running total) plus the live, tappable product grid have no
  legitimate reason to be visible to that customer; an overlay can only
  ever de-emphasize that content, never actually remove it from the
  render, so the fix has to be structural, not cosmetic; (2) once the
  grid genuinely isn't on screen, "tap a product tile" — the mechanism
  the overlay model used to clear itself and return to selling — no
  longer exists to tap. Resolved as follows:
  - **Full-viewport replacement, not overlay.** A successful Finalizar
    Venta now routes to a dedicated state (§3.8f) that temporarily
    replaces §3.7 — no header, no Venta actual tray, no product grid —
    built from exactly three elements: the existing "Venta finalizada
    ✓" line (now de-emphasized, no longer dominant), the per-sale total
    (still the single largest, most legible element on screen), and the
    future-registration placeholder. Still not a navigation destination
    in the IA sense — no back arrow, nothing added to the nav graph —
    it's a temporary full-screen state of Hoy, the same way §3.1's
    resolving skeleton or §3.14's fallback are states of Hoy without
    being destinations of their own.
  - **Exit mechanism, revised after a `ux-critic` Blocker: a tap zone
    scoped to the screen's outer margin — bottom edge foremost, matching
    where Ana's hand already grips the phone to present it — replaces
    the full-surface tap, with the fixed auto-return demoted to a
    backstop rather than shared common-case duty.** The original hybrid
    (full-surface tap-anywhere, plus a short — illustratively 4–6s —
    auto-return) failed on both halves against the exact exposure this
    redesign exists to prevent, for the same underlying reason: neither
    half was tied to an event under Ana's exclusive control. A fixed
    timer fires on a clock, blind to whether the customer is still
    looking — one who takes longer than the illustrative window
    (counting change, negotiating, ordinary bazaar behavior) is still
    looking straight at the phone when it auto-flips to the private §3.7
    grid. A full-surface tap is exactly as reachable by the customer's
    hand as by Ana's — the phone is, by this screen's own premise, held
    out and often within the customer's reach, so a customer pointing at
    the total or touching the brand mark triggers the identical
    dismissal, sooner than the timer would have, and by exactly the
    person the mechanism exists to shield the content from.
  - The fix ties dismissal to where Ana's hand already is, not to
    "anywhere." Presenting the total means tilting the phone so its far
    edge points toward the customer while its near edge stays against
    her own palm — the geometry of the gesture itself, not a new one to
    learn. The live zone is the screen's outer margin, bottom edge
    foremost: reaching it means reaching past the visible total and into
    Ana's own grip, a conspicuous motion for the person the total is
    being shown to, unlike reaching for what's already directly in front
    of them. This doesn't claim the zone is unreachable by a customer —
    nothing on a phone held out and visible to them can be made
    unreachable without abandoning the premise that it's shown to them
    at all, which this screen doesn't get to escape — only that the
    ordinary physics of the gesture make it the one part of the screen a
    customer has no natural reason to touch, sharply reducing an
    accidental trigger rather than eliminating it. That's the tradeoff
    being accepted here, stated plainly rather than assumed away.
  - This costs Ana real precision, weighed honestly rather than glossed
    over: a passive regrip alone was already shown not to reliably
    register as a tap, and narrowing the target from the full surface to
    a margin makes landing a deliberate tap there less forgiving, not
    more. It's still one motion, not two — the tap lands as she starts
    pulling the phone back, not as a separate step — but it's a smaller
    target than "anywhere," and that cost is accepted because leaving
    the full surface live is the exact defect being fixed.
  - The auto-return's role changes with it. With a reliably Ana-scoped
    tap as the everyday exit, the timer no longer needs to double as the
    common-case mechanism or stay short — its only remaining job is
    recovering a phone set down and forgotten with the receipt still
    showing, no tap, no nav, no lock (§3.13's own scenario). Decoupled
    from the common case, its default can run generously long —
    illustratively tens of seconds rather than several — specifically so
    it isn't expected to fire while a customer is still genuinely
    present, including a slow one. The cost is narrow and bounded: only
    if Ana genuinely sets the phone down and later picks it up without
    tapping does she wait longer for the receipt to clear on its own,
    and even then the same near-zero-friction margin tap she'd have made
    anyway clears it the moment she actually means to sell again — a
    bounded convenience cost, not the live privacy failure the timer
    firing early used to be.
  - Duration-only was reconsidered and rejected again, more sharply than
    the first time: a duration short enough to avoid a real per-sale
    wait cost is exactly the duration a slow customer can still be
    looking at the phone through, and a duration long enough to make
    that reliably unlikely reintroduces a wait cost on every sale, in
    direct conflict with `company/backlog.md` #1's <3s bar — the exact
    cost the hybrid model exists to avoid. With the tap's own
    reachability problem solved, there's no remaining reason to give it
    up.
  - This is still a judgment call about how Ana physically holds and
    presents the phone during payment, not something validated with her
    directly — flagged the same way the original mechanism was, for the
    Product Owner to confirm or override once real usage, or a moderated
    session, can check whether the margin zone matches how she actually
    grips the phone in practice.
  - **Visual device for the placeholder: the Nahui mark alone, not a
    QR/scan-pattern render.** Confirmed rejected twice now — a rendered
    scan-pattern grid carries an unhedgeable "this is live and
    scannable" claim regardless of styling or context, and this is a
    permanent spec describing every sale, not a one-week artifact. The
    composition/polish cue from the Product Owner's branded reference (a
    centered QR with the Nahui logo overlaid) is taken as exactly that —
    composition only: centered, clean, brand-forward — applied to the
    brand mark alone, with the scan-pattern grid dropped entirely rather
    than stylized. This also gives the placeholder a legitimate,
    undesigned tie to `brand-guide.md`'s "the center" narrative (where a
    sale becomes data, a customer becomes a relationship) without
    forcing the four-pillar story onto a screen that doesn't need it to
    function.
  - **Superseded 2026-08-09, for the placeholder element specifically — named explicitly, not silently edited.** This bullet's rejection was scoped to a *decorative*, non-functional graphic carrying an unhedgeable "this is live and scannable" claim with no real interaction behind it — correct at the time, for that risk. It doesn't extend to a genuinely functional element that, when engaged, actually navigates to a real, already-built destination (`product/02-ux-loyalty/customer-loyalty-registration.md` §3.1 onward) — that risk doesn't apply to something that's actually live. Per explicit, direct Product Owner instruction, §3.8f's current, dated 2026-08-09 amendment now specifies exactly this. Kept, not deleted, per this document's own amendment-history convention — it correctly records why a QR was rejected at the time, for the reason that applied at the time.
  - **Copy stays exactly as before** ("algún día vas a poder registrar
    aquí tu compra") — still names no mechanism, still doesn't commit to
    a reward/gift framing (`decision-log.md` D22's Claim Token is a
    Customer Segmentation/intelligence mechanism, not confirmed
    gift-based) — see §8 for an explicit flag on whether that framing
    question needs its own Product Decision once backlog #2 Stage 2 is
    actually designed.
  - **Ceremony stays restrained, not decorated, despite this being the
    one customer-facing screen in the product.** Weighed explicitly:
    this is both the highest-frequency screen in the app (every sale)
    and the only one a customer ever sees, two facts pulling in opposite
    directions on how much ceremony is appropriate. Resolved toward
    `brand-guide.md`'s existing restraint — no decorative elements
    specified — with the "celebratory conclusion" feeling the Product
    Owner asked for expressed through composition instead of ornament:
    full-viewport space, one dominant number, nothing else competing for
    attention is already a meaningfully bigger gesture than the cramped
    overlay version, without adding literal decoration that would read
    as gimmicky in front of a real customer at a real bazaar — a look
    this document's whole tone (`brand-guide.md`, never framing informal
    commerce as needing to be "modernized" with novelty chrome) exists
    to avoid.
  Not RFC-worthy — no aggregate boundary, domain term, or IA change; a
  UX state-design amendment to an already-Approved spec, same category
  as this document's other post-Approval amendments. Ready for the
  standard `ux-critic`/`reviewer` cycle before folding back into
  Approved.
- **Price resolution (`decision-log.md` D33) confirmed as a zero-decision
  automatic mechanism at every tap/scan, and both of Home's existing
  dollar figures — the header's running total (§3.7) and the receipt's
  per-sale total (§3.8f) — are now explicitly grounded as sums of
  `SaleItem.pricePaid`, not previously-untraced numbers.** This closes
  the exact ambient-assumption gap D33's own Context paragraph names
  ("Hoy: $850 · 6 ventas"... "with no traceable source"). No new screen,
  state, or tap was added anywhere in the tap-to-sell flow (§3.9/§3.10) —
  this is a grounding/citation fix, confirming an already-Approved
  interaction remains exactly as fast and decision-free as specified, now
  traceable to a real domain field instead of an implicit assumption.
- **§2 step 3's cold-start resolution test corrected from "at least one Product ever registered" to "at least one `available` InventoryUnit exists"** (2026-08-08, alongside `onboarding.md`'s new "Define lo que vendes" step, `decision-log.md` D33) — the original test's parenthetical ("has she ever registered a Lot") was an accurate proxy for "has anything to sell" only as long as a Product could never exist without an accompanying Lot; `onboarding.md`'s new step breaks that equivalence by design. Left uncorrected, a merchant fresh from that step would have been offered "Iniciar Sesión Rápida" (§3.4) — a promise something is sellable — and land on an entirely dimmed, non-tappable selling grid (§3.9) the instant she tapped it: precisely the "disguised dead end" §3.3's own design note already warns against, reached from the opposite direction. The corrected test also closes a second, previously latent instance of the identical gap: a merchant fully sold out mid-run (every unit sold, nothing new received) was also, under the old test, routed to the dead-end grid — now correctly routed to cold start instead.
- **§4's own interaction-flow summary was still citing the pre-correction test after §2 step 3 was corrected above — fixed to match (2026-08-08, caught during `ux-critic`'s D33 remediation re-check, missed by the original correction).** §4's branch labels read "nothing active, Catalog has Products" / "Catalog empty" — the retired "Product ever registered" proxy §2 step 3 was already corrected to replace, above. Corrected to "at least one `available` InventoryUnit exists" / "zero `available` InventoryUnits," matching §2 exactly, since §4 is this document family's own designated canonical wiring section (`product/02-ux/CLAUDE.md`) and a stale copy there is exactly the kind of section-drift this project's own incident history (`decision-log.md` D31/D32) already treats as a real Medium-Fidelity build-defect risk when a doc's own §2 and §4 disagree about the same branch. No wireframe, state, or routing decision changes — §4 always described the identical branch §2 step 3 defines; only its own wording had fallen out of sync with a fix already applied one section away.
- **2026-08-08: §3.8f's receipt now shows the merchant's own captured identity instead of Nahui's own mark — a deliberate brand-facing product decision, named explicitly per this document's own review discipline, not an incidental side effect of `onboarding.md`'s new identity-capture step.** Until this amendment, every receipt Ana ever showed a customer carried Nahui's own mark — reasonable when nothing else was available to show, but never actually a brand statement anyone chose on purpose; it was the honest fallback for an empty field, not a considered choice. Once `onboarding.md` §2.2b makes `Business.name` a required, always-populated field (and `Business.logo` an optional one), the honest fallback for an *absent logo* is her own business name as text, not Nahui's mark — Nahui's mark was never the right fallback for a missing merchant logo, it was only ever standing in for a data field this product hadn't captured yet. This is the correct, considered choice, not merely a technical consequence of a new field existing: the receipt moment (§3.8f) is Ana's own customer-facing surface, at the single instant in the whole product a real customer ever sees anything — reinforcing her own identity there, not Nahui's, is the more honest and more merchant-respecting choice, consistent with `brand-guide.md`'s tone (never positioning Nahui's own presence ahead of the merchant she serves) and with the general shift this identity-capture amendment represents across the product. **Fallback is `Business.name` as plain text, not Nahui's mark, and not a generic placeholder** — reasoned explicitly: `Business.name` is required (never blank, `onboarding.md` §2.2b), so there is always a genuine, honest thing to show; falling back to Nahui's own mark when only the logo (not the name) is missing would mean the *common* case — most merchants likely won't have a digital logo ready, per this amendment's own design note — shows Nahui's brand more often than the merchant's, exactly backwards from the stated intent. Not RFC-worthy — no aggregate boundary, domain term, or IA change (`Business.name`/`Business.logo` are additive fields `architect` already cleared as sitting inside Selling's existing read-only dependency on Identity); a content-source and asset-source change to an already-Approved state's third element, same category as this document's other post-Approval amendments.
- **2026-08-09: §3.8f's future-registration placeholder is now gated on `subscriptionTier=paid`, absent entirely on a Free-tier receipt (`decision-log.md` D40).** The original copy was written mechanism-noncommittal but tier-noncommittal too, before D40 existed — promising every merchant she'll "someday" get this is false for Free tier; only upgrading gets her there. Fix: a Free-tier receipt renders exactly three elements; a Paid-tier receipt is unaffected. **Not a design of the live QR interaction itself** — tracked as `product/02-ux/product-decisions.md` Q15, scoped explicitly to Paid-tier Sales.
- **2026-08-09 (Product Owner decision, resolving `product/02-ux/product-decisions.md` Q15): §3.8f's Paid-tier receipt now renders a real, tappable/scannable Claim Token QR in place of the former literal placeholder text — the entry point into the already-Approved `product/02-ux-loyalty/customer-loyalty-registration.md` flow, §3.1 onward.** Needed to work end-to-end for the demo specifically; the design generalizes cleanly beyond the demo, since nothing about it is demo-specific except the single-device tap-stand-in for a camera scan (§3.8f). **Explicitly supersedes, not contradicts, the two prior "no QR-shaped render" passages in this document** — both correctly rejected a decorative, non-functional QR graphic for carrying an unhedgeable liveness claim with nothing behind it; that objection doesn't apply to a genuinely functional element navigating somewhere real. The identity element (`Business.name`/`Business.logo`) is unaffected and still never renders as a QR — only the separate future-registration row changes. Reasoning, the destination bridge, the demo-vs-production distinction, and the exit-mechanism non-conflict are specified in full in §3.8f's own bullets, not repeated here. **Does not redesign the destination flow** — already fully specified and Approved before this amendment; only the bridge is new. **Resolves Q15**: purely ephemeral, nothing persisted — Ana's existing control over the receipt's own exit already fully realizes D40's "she controls whether she offers the QR." **Flagged, not resolved:** this activates `company/backlog.md` #2's Stage 2 ahead of its own stated gating, by this specific Product Owner instruction; the general sequencing question `decision-log.md` D34 left open stays open. **Consultation self-check, not a live request:** this bridge decomposes from already-Approved precedent (`decision-log.md` D21/D22; §3.6a's own cross-document hand-off links) — not escalated to `knowledge-mentor`; flagged for `ux-critic`/`reviewer` to challenge if that judgment doesn't hold. Not RFC-worthy — no aggregate boundary, bounded-context edge, or ubiquitous-language term changes; D22 already named the QR as a Claim Token display mechanism, D40 already established per-Sale offering as UI-layer state. A UX state-design amendment to an already-Approved spec. Ready for the standard `ux-critic`/`reviewer` cycle before folding back into Approved.
- **2026-08-13 (architect-caught wording-precision fix, ahead of the
  Eventos build): §2 step 2's gating condition and Día N computation
  corrected to match already-settled Foundation, no behavior change.**
  `architect`'s Architecture Gap Analysis for the upcoming Eventos slice
  found step 2's literal text had drifted from Foundation in two ways: (1)
  "N = existing Sessions under this eventId + 1, computed, never asked"
  contradicted `decision-log.md` D15 and `domain-model.md`'s own "Día N"
  computation verbatim — Día N is computed from *distinct calendar dates*
  of Sessions sharing an eventId, never a raw Session-row count; (2) the
  gating condition "no Session opened yet under it today" is literally
  false the moment Ana closes a Session for a lunch break and reopens Home
  the same day (a Session *was* already opened under that Event today),
  which would have incorrectly routed her to plain idle (step 3) instead
  of "Continuar Día N," losing Event-awareness for the rest of that day —
  directly contradicting D15's own worked example (a lunch-break resume
  "does not increment the day number") and this document's §1 (Home should
  already know "today is Bazar Plaza Norte, Día 2," not ask). Corrected
  reading, resolved entirely from existing Foundation (classified
  Architect-resolvable, no Product Owner input needed): the condition is
  now "Event status = active AND no Session is currently active" (the
  direct complement of step 1, dropping the "opened yet today" qualifier),
  and N is computed as distinct calendar dates before today with a Session
  under this eventId, plus one for today — invariant to whether today is a
  fresh day or a same-day resume. §3.6's wireframe display ("Continuar Día
  2") and every other section referencing this branch are unaffected —
  they never asserted the raw-count formula themselves, only §2's own
  prose did. Not RFC-worthy — no aggregate boundary, domain term, or IA
  change; a literal-text-only correction to an already-Approved spec, same
  category as `events.md`'s EVT-Q1/EVT-Q2 precedent.
- **Same-day resume now surfaces an ambient "Ya vendiste $X · N ventas
  hoy" line on §3.4/§3.5 (Quick Session) and §3.6 (Event-linked), closing
  a tester-found trust gap in the "cerrar sesión" action
  (`product/02-ux/experience-review-2026-08-13-eventos.md`).** Reopening
  the same Día N after a same-day close (D15) previously showed a fresh $0
  running total with no signal that a closed Session's sales still
  existed; Ana read this as data loss. Sourced from the identical Session
  set `domain-model.md`'s "Día N" computation already scopes to today
  (`SUM(SaleItem.pricePaid)`, `COUNT(Sale)`) — no new query. Shown only
  when the condition holds; the common case (first Session of the day) is
  unaffected, pixel-identical to before. Classified by `architect` as
  resolvable directly from `architect-questions.md` Q7's existing ruling —
  logged as Q19, cross-referenced, not a new Product Owner decision.
  Coexists independently with §3.6a's NFC/capability lines. `events.md`
  §3.14 receives the matching addition, worded for an in-progress (not
  closed) day per the same finding.
- **2026-08-13 (Product Owner decision): §3.7's ongoing "Hoy: $X · N ventas"
  header is now context-scoped (every finalized Sale today sharing this
  Session's `eventId`), not Session-scoped (only this Session's own
  Sales).** Closes a `merchant-user-tester` re-walk finding that Q19's own
  fix (the pre-resume ambient "Ya vendiste $X · N ventas hoy" line,
  §3.4/§3.5/§3.6) wasn't sufficient on its own — the live selling screen's
  own header still reset to Session-scoped $0 the moment she actually
  resumed, the exact number she's looking at continuously while selling.
  Reuses Q19's identical query, unchanged, applied to a continuous status
  line instead of a one-time ambient one. **Deliberately does not extend to
  "Venta actual" (single active Sale), the close-confirmation dialog
  (§3.11), or the closing-summary screen (§3.12)** — all three report on a
  specific committed transaction/Session, a one-time transactional fact, not
  an ambient status fact re-read at arbitrary moments; conflating the two
  would make §3.12's own closing numbers untrue to what actually happened
  inside the Session being closed. Introduces one small, necessary side
  effect: §3.11's dialog now overlays a header that can legitimately show a
  larger number than the Session it's about to close, so its own preview
  line is relabeled "Esta sesión: N ventas · $X" (was bare "N ventas · $X")
  to keep the two simultaneously-visible numbers legible as two different,
  correctly-scoped facts rather than reading as the same discrepancy Q19
  already fixed once. Classified by the Product Owner directly, not
  `architect` — `architect`'s own Q19 ruling explicitly declined to resolve
  this broader question, naming it "a legitimate, separate design call."
  `events.md` needs no matching amendment — confirmed, not assumed: §3.7 is
  the only place an ongoing running total renders; `events.md` §3.14's own
  Q19 row is already context-scoped and one-time, and §3.15's "Vendiendo
  ahora" hand-off carries no total of its own.

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
