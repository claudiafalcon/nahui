# Home (Hoy) — Amendment & Decision History

Companion file to `product/02-ux/home.md`. This file holds the justification,
prior-state, and remediation-history prose that used to live inline in
`home.md`'s status header and `## 10. Decisions made` section, plus the
retired `§3.8e` ambient-confirmation narrative. `home.md` itself keeps only
current-rule text and, for these three locations, a pointer back here.

Anchors are prefixed `status-` (from `home.md`'s status header), `decisions-`
(from `home.md` §10), or `section-` (from a superseded numbered section), to
keep them unique within this file.

---

## Status-header history (from `home.md`'s front matter)

### status-full-ux-remediation-cycle
**Applies to:** `home.md` overall Approval.

Full UX Remediation cycle complete — HOME-B1, HOME-B2, HOME-M1, HOME-M2,
HOME-M3, HOME-M4 fixed by `ux-designer`, verified clean by `ux-critic` (zero
remaining Blockers/Majors), and passed `reviewer`'s Foundation-consistency
check (no Blockers; one cross-document Important finding — stale
post-renumbering section references — corrected by Main).

### status-d23-session-scoped-selling-mode
**Applies to:** `decision-log.md` D23 (Session-scoped selling mode).

Amended for `decision-log.md` D23 (Session-scoped selling mode: Selling Mode
Capability / Default Selling Mode / Session Operating Mode / NFC Readiness —
see `product/99-rfc/0003-session-selling-mode.md`). Amendment went through its
own full cycle — `ux-critic` found four Major findings across three
remediation rounds (HOME2-MAJ1 through HOME2-MAJ4, see
`product/02-ux/ux-critic-findings.md`), all fixed and verified clean, and
`reviewer`'s Foundation-consistency pass found zero Blockers/Important
findings. Folded back into Approved.

### status-d20-venue-display-name
**Applies to:** `decision-log.md` D20 (Venue aggregate root).

Amended for `decision-log.md` D20 (Venue aggregate root): every session
header ("Bazar Plaza Norte" — Type+Place compound) corrected to
`Venue.displayName` alone ("Plaza Norte"), matching the pattern `events.md`
already established. This document's own wireframes never received this fix
when D20 landed; caught by `reviewer` during `home.md`'s Medium-Fidelity Figma
review (`product/02b-medium-fidelity/home.md`), 14 instances corrected by
`ux-designer`, applied by Main. Copy-only — no flow, state, or behavior
changed.

### status-settings-2-1-configuracion-entry-point
**Applies to:** `settings.md` §2.1 (Configuración entry point).

Amended for `settings.md` §2.1 (Configuración entry point): added the header
"▾" affordance to Home's four non-Session states (§3.3–§3.6, including the
§3.6a Session-start-moment variants) and a second "Configuración" row to the
active-Session controls sheet (§3.7a), plus a new Configuración-only sheet
variant (§3.6c) for the non-Session states — closing a gap Architect's
build-readiness review found (Configuración had no way to be reached from
three of Home's four non-Session states). Went through its own cycle —
`ux-critic` found three Major findings (missing "▾" on §3.6a's variants; a
stale pre-`settings.md` design note; a self-contradicting §10 bullet) plus one
Minor (section read-order) in the first pass, all fixed and verified, with one
further Minor (a stale Q5 citation) caught and fixed during verification —
and `reviewer`'s Foundation-consistency pass found zero Blockers, two
Important documentation-hygiene findings (a stale `information-architecture.md`
citation, and this status log itself not yet updated — both addressed
alongside this paragraph). Folded back into Approved.

*(Note: this entry pre-dates the 2026-08-09 relocation of the entry-point
trigger from "▾" to "⋯" — see `status-2026-08-09-configuracion-entry-point-relocated`
below.)*

### status-d27-nfc-capability-derivation
**Applies to:** `decision-log.md` D27 (NFC capability derived from `subscriptionTier`).

Amended for `decision-log.md` D27 (NFC capability corrected to derive from
`subscriptionTier`, not kit/code activation — separating Business capability,
preferred selling mode, Session selling mode, and operational readiness into
four genuinely distinct concepts, per Product Owner correction): §2's
Ready-branch check, §3.6a's capability-revoked bullet and design note, §3.6c's
entry-point notes, and §10's decisions bullet were all corrected to cite
`settings.md`'s "Activar plan de pago" as the real restoration mechanism
instead of the retired "Activar venta con tags." A new fourth §3.6a variant
was also added — a one-time (shown once ever, not once per Session-start),
discoverability-only nudge for a Paid-tier merchant whose tagged inventory
clears NFC Readiness while `defaultSellingMode` still reads `buttons` —
closing a gap `ux-critic` found (nothing previously told her that capability
had become usable). Went through its own cycle — `ux-critic` found one
Blocker (in `onboarding.md`'s sibling milestone copy, not here) plus two Major
and three Minor findings across the coordinated three-document amendment, all
fixed and verified. `reviewer`'s Foundation-consistency pass found zero
Blockers, one Important finding (stale "two real paths" language in
`onboarding.md` contradicting its own §2.2 — fixed directly by Main) — clean
on re-check. Folded back into Approved.

### status-2026-08-04-home-q1-venta-finalizada-confirmation
**Date:** 2026-08-04 (HOME-Q1, Product Owner-raised).

New §3.8e ambient "Venta finalizada ✓" confirmation after a successful
Finalizar Venta, previously indistinguishable from a fresh Session start or a
cancelled sale. Full cycle complete, `ux-critic`/`reviewer` clean, folded back
into Approved.

*(Superseded — see `status-2026-08-05-receipt-moment-redesign` and
`section-3-8e-superseded` below.)*

### status-2026-08-04-payment-moment-extension
**Date:** 2026-08-04 (payment-moment extension of HOME-Q1's §3.8e). **Superseded.**

The ambient "Venta finalizada ✓" confirmation now also carries the sale's own
total and a literal, future-tense placeholder line for a not-yet-built
registration mechanism, with its dwell model changed from a fixed fade to
persisting until Ana's next action.

**Superseded 2026-08-05** — see `status-2026-08-05-receipt-moment-redesign`
below.

### status-2026-08-05-receipt-moment-redesign
**Date:** 2026-08-05 (receipt-moment redesign, supersedes the payment-moment extension).

The ambient-overlay model above — total and placeholder layered on top of
§3.7's resting screen — is retired, not extended further. During the payment
moment the device is held out to the customer, so Ana's revenue total and the
live product grid can't legitimately render at all, not just be de-emphasized
— an overlay can only ever dim that content, never actually remove it from
the render. Finalizar Venta success now routes to a new full-viewport receipt
(§3.8f) that temporarily replaces §3.7 rather than overlaying it, carrying
forward the per-sale total and the (still non-QR-shaped) future-registration
placeholder, with a new exit model (a margin-zone tap scoped to where Ana's
hand grips the phone, backed by a long-dwell auto-return reserved for the
abandoned-phone case — revised once already after a `ux-critic` Blocker found
the first version reachable by the customer too) replacing "tap a product
tile," since the tile grid is no longer on screen to tap. §3.8e is kept as a
superseded pointer entry rather than deleted, per this document's own
amendment-history convention (see §3.7a's precedent). Full cycle complete (one
Blocker on the original exit mechanism, found and fixed — see
`ux-critic-findings.md` HOME-B3 — one non-gating Minor tracked as HOME-MIN3),
`ux-critic`/`reviewer` clean, folded back into Approved.

*(Current behavior lives at `home.md` §3.8f. Full reasoning for the
full-viewport model, the margin-zone exit, and the visual device also appears
at `decisions-2026-08-05-full-viewport-receipt-3-8f` below — the §10 version
of the same decision.)*

### status-2026-08-04-icon-comprehension-audit
**Date:** 2026-08-04 (icon/comprehension audit).

§3.9's ProductTile now carries a per-Product marker (first letter of
`Product.name`), with an explicit non-scope note that true custom iconography
needs a Product Decision/RFC. Full cycle complete, `ux-critic`/`reviewer`
clean, folded back into Approved.

### status-2026-08-08-d33-mvp-pricing
**Date:** 2026-08-08 (`decision-log.md` D33, MVP pricing operating model).

Home's existing dollar figures (§3.7's running total, §3.8f's receipt total)
are now explicitly grounded as sums of `SaleItem.pricePaid`, resolved
automatically at every tap/scan — no new screen, state, or tap added. Part of
the same four-document D33 remediation as `inventory.md`/`events.md`/
`reports.md`; `ux-critic` verified this document's portion clean in round 1,
with no findings against it in either round. `reviewer` clean (no Blockers, no
Important findings) — folded back into Approved.

### status-2026-08-08-define-lo-que-vendes
**Date:** 2026-08-08 (`decision-log.md` D33, "Define lo que vendes" moved into Onboarding).

§2 step 3's cold-start test corrected from "Product ever registered" to
"`available` InventoryUnit exists" — required once Onboarding could create
Products with zero stock (`onboarding.md` §2.2a). Two remediation rounds —
round 1's fix missed a stale copy of the old test in §4's own wiring section;
round 2 corrected it. `ux-critic` verified clean (zero Blockers, zero
unresolved Majors). `reviewer` clean (no Blockers, no findings against this
document specifically) — folded back into Approved.

### status-2026-08-08-business-identity
**Date:** 2026-08-08 (Product Owner decision, Business Identity captured at Onboarding).

§3.8f's receipt moment now shows the merchant's own captured identity
(`Business.name`, and her own logo if she set one, per `onboarding.md` §2.2b)
in place of "(marca Nahui)" — Nahui's own mark stepping back in favor of the
merchant's, a deliberate brand-facing product decision, not an incidental side
effect. Honest fallback: `Business.name` as plain text whenever no logo is set
(the common case, treated as fully first-class, not a lesser rendering). No
new screen, state, or tap — a content/asset-source change to an
already-Approved state. Pending `ux-critic`/`reviewer` review before folding
back into Approved (see later 2026-08-08/09 entries below, which continued to
build on this state).

### status-2026-08-09-d40-loyalty-enabled-retired
**Date:** 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled` retired, Frequent Customers unified as a Paid-tier-only capability).

§3.8f's future-registration placeholder is now gated on `subscriptionTier=paid`
— a Free-tier receipt no longer shows it at all, three elements only
(confirmation, total, business identity). A Paid-tier receipt keeps the
placeholder, copy unchanged — the capability already exists automatically the
instant `subscriptionTier=paid` (D40); only this specific receipt-moment
interaction (what exactly renders here, whether a live QR eventually replaces
the placeholder) remains undesigned, tracked as `product/02-ux/product-decisions.md`
Q15, not resolved by this amendment. §3.8f, §4, §5, §8, §10, §11 updated.

*(The placeholder itself is superseded — see `status-2026-08-09-q15-claim-token-qr`
below.)*

### status-2026-08-09-configuracion-entry-point-relocated
**Date:** 2026-08-09 (Product Owner decision — Configuración entry-point relocated from the header's "▾" to a top-right icon-based menu).

The small "▾" dropdown next to the "Nahui"/session header — flagged by the
Product Owner as not reading as discoverable or natural — is replaced by a
top-right "⋯" (three-dot/overflow) icon, opening the identical
session-controls sheet already specified (§3.6c/§3.7a), with no change to
which Home states show it, when "Cerrar jornada de venta" appears, or what
Configuración itself does once reached. The sheet's Configuración row now also
carries a gear icon ("⚙"), specifically distinguishing it from "Cerrar
jornada de venta" and from any other entry the sheet may carry in the future,
per the Product Owner's explicit request. **Why "⋯" rather than a hamburger
("☰"):** a hamburger conventionally signals a full secondary navigation
drawer with many destinations, which would misrepresent — and visually
compete with — what's actually behind this trigger (a one-or-two-row sheet,
not a parallel navigation system), undercutting `decision-log.md` D13's own
ruling that this affordance is a sequencing/reachability fact, not a fifth nav
tab, alongside the persistent, already-primary bottom nav bar. `settings.md`
receives the matching correction in the same pass — see that document's own
status header and §2.1/§8 item 3. `ux-critic`/`reviewer` both clean. Folded
into Approved.

*(Current behavior lives throughout `home.md`'s §3.3–§3.7a wireframes. The §10
version of this same decision is at `decisions-2026-08-09-trigger-relocated-ellipsis-gear-icon`
below.)*

### status-2026-08-09-q15-claim-token-qr
**Date:** 2026-08-09 (Product Owner decision, resolving `product/02-ux/product-decisions.md` Q15 — the Digital Receipt's Claim Token QR is now real, not a placeholder).

§3.8f's Paid-tier receipt now renders a genuine, tappable/scannable Claim
Token QR (`decision-log.md` D22) in the row the earlier textual
future-registration placeholder held — the entry point into the
already-Approved `product/02-ux-loyalty/customer-loyalty-registration.md` flow
(§3.1 onward), which this amendment specifies the bridge into without
redesigning. Explicitly supersedes, rather than silently contradicts, this
document's own two prior "no QR-shaped render" passages (§3.8f's
identity-element bullet; the historical 2026-08-05 entry) — both correctly
rejected a decorative, non-functional QR graphic for carrying an unhedgeable
liveness claim with nothing behind it, an objection that doesn't hold against
a genuinely functional element navigating to a real destination. The
Free-tier receipt is unaffected — still three elements, no QR, no placeholder,
exactly as the 2026-08-09 D40 amendment above already established. Resolves
Q15 (`product-decisions.md`): purely ephemeral, nothing persisted; no
dedicated "decline to offer" action exists separate from the receipt's own
already-specified exit mechanism. Flags, without resolving, that this
activates `company/backlog.md` #2's Stage 2 for this one element ahead of its
own stated gating, by direct Product Owner instruction. §3.8f, §4, §5, §7, §8,
§10, §11 updated. `ux-critic` round 1: 4 stale-reference findings (3 Major, 1
Minor) — fixed, verification clean. `reviewer` clean (2 Important findings,
both documentation-tracking gaps — this `ux-critic-findings.md` entry and a
stale status line, both closed separately). Folded into Approved.

### status-2026-08-12-quick-session-title-row
**Date:** 2026-08-12 (Medium-Fidelity spec-gap escalation — SessionHeader title row during an active Quick Session).

Closes an undocumented gap `ux-critic` flagged during Medium-Fidelity build,
where an active Quick Session (no `eventId`) had no defined title-row content
— a Medium-Fidelity build had defaulted to a blank title row, indistinguishable
from a load failure, on Ana's own first-ever live selling screen. New §3.7b
specifies the title row reads "Sesión rápida" wherever `Session.eventId` is
null, applying to every active-Session wireframe in §3.7–§3.11a — the same
term §3.4's "Iniciar Sesión Rápida" already established and `reports.md` §3.7
already assumed this document defined (it hadn't, until now). Small, bounded
content addition — no new screen, flow, or navigation branch. §5 (item 9), §9
(architecture-principles.md #3), §10 updated.

### status-2026-08-13-architect-wording-precision
**Date:** 2026-08-13 (Architect-caught wording-precision fix, ahead of the Eventos build — no behavior change).

§2 step 2's literal text is corrected to match Foundation it had drifted from:
the gating condition now reads "Event status = active AND no Session is
currently active" (the direct complement of step 1, dropping the stale "no
Session opened yet under it today" qualifier, which read as literally false —
and would have incorrectly fallen through to plain idle, §3.4 — on the exact
lunch-break-resume case `decision-log.md` D15's own worked example describes),
and N's computation is corrected from a raw Session-row count to D15's
distinct-calendar-date rule (`domain-model.md`'s "Día N" computation, which
this document's own §3.6 wireframe and `events.md`/`reports.md` already
reuse). Classified by `architect` as Architect-resolvable from existing
Foundation alone — no Product Owner input needed, no new decision. The
underlying behavior `events.md` §1/D15 already specify is unchanged; only §2
step 2's literal wording is brought into agreement with them. Same category as
this document's own EVT-Q1/EVT-Q2-style precision fixes (see `events.md`'s
status header for that precedent).

### status-2026-08-13-q19-same-day-resume-line
**Date:** 2026-08-13 (Architect-resolvable content amendment, closing an `experience-review-2026-08-13-eventos.md` finding — see `architect-questions.md` Q19, cross-referencing Q7).

§3.4/§3.5 ("Iniciar Sesión Rápida," Quick Session) and §3.6/§3.6a ("Continuar
Día N," Event-linked) each gain a conditional, ambient line — "Ya vendiste $X
· N ventas hoy" — shown only when a Session under the relevant scope (this
`eventId`, or `eventId = null` for Quick Sessions) already has 1+ finalized
Sales on today's calendar date; absent entirely in the common case (first
Session of the day), so the happy path stays pixel-identical to today's spec.
Sourced from `SUM(SaleItem.pricePaid)`/`COUNT(Sale)` across the identical
Session set `domain-model.md`'s "Día N" computation already scopes to today —
no new query, no new fetch. Closes a tester-found trust gap: a same-day resume
(e.g. after a lunch-break close) correctly reopens the same Día N per D15, but
nothing previously told Ana a closed Session's sales already existed before
she reopened selling, and she read the fresh $0 running total as data loss.
Classified by `architect` as Architect-resolvable directly from
`architect-questions.md`'s existing Q7 ruling (Eventos/Home may show "a thin,
ambient, in-progress indicator" as part of their own status role) — no new
Product Owner decision, same category as this document's own preceding
2026-08-13 entry. Coexists independently with §3.6a's NFC Readiness/capability
lines — both can render at once, in a fixed stacking order (see §3.6/§3.4
above). No new §5 screen-state entry — a conditional content addition to
already-enumerated states, same treatment as the 2026-08-08 Business Identity
receipt amendment above. `events.md` §3.14 receives the matching addition in
the same pass — see that document's own status header.

### status-2026-08-13-header-context-scope
**Date:** 2026-08-13 (Product Owner decision — §3.7's ongoing header redefined context-scoped, not Session-scoped; closes a `merchant-user-tester` re-walk finding surfaced on top of the already-Applied `architect-questions.md` Q19).

§3.7's "Hoy: $X · N ventas" — and every active-Session wireframe rendering the
identical row (§3.7a, §3.7b, §3.8, §3.8b, §3.9, §3.10, the dimmed header
behind §3.11/§3.11a) — is redefined from a running sum of this one Session's
own Sales to a running sum of every finalized Sale today sharing this
Session's `eventId` (`eventId = null` for a Quick Session, matching every
other Quick Session today; the specific Event's `eventId` for an Event-linked
Session, matching every other Session under that Event today). Not
Architect-resolvable — `architect`'s own Q19 ruling explicitly declined to
rule on this, naming it "a deeper, separate question... not resolving
here... a legitimate, separate design call," precisely because it redefines
an already-Approved, deliberately-reasoned Session-scoped definition
(`decision-log.md` D33) rather than interpreting existing Foundation. The
Product Owner has now made that call directly: "The merchant interprets 'Hoy'
as 'everything I've sold today in the context I'm currently working in'...
this avoids the trust issue where reopening the app after closing a session
shows '$0 · 0 ventas' even though the merchant has already sold today."
Necessity confirmed by a `merchant-user-tester` re-walk of Q19's own fix: Q19's
ambient "Ya vendiste $X · N ventas hoy" line (§3.4/§3.5/§3.6) correctly warns
Ana *before* she resumes selling that a closed same-day Session's sales still
exist — but the live selling screen's own §3.7 header, the number she's
actually looking at continuously once she's resumed, still reset to
Session-scoped $0 immediately after, reproducing the identical trust gap Q19
set out to close, one screen later. Reuses the identical
`todaySalesSummary`-shaped query `architect-questions.md` Q19 already
established (`SUM(SaleItem.pricePaid)`/`COUNT(Sale)` across the same Session
set), applied here to an ongoing header instead of a one-time ambient line —
no new query, no new field. "Venta actual" (§3.8), the close-confirmation
dialog (§3.11), and the closing-summary screen (§3.12) are explicitly
unaffected — all three stay scoped to the single active/closing Session, a
deliberately different kind of fact (one-time transactional confirmation, not
ambient status); see §3.7's own bullets for the reasoning and for a small,
necessary relabel to §3.11's preview line this scope split otherwise leaves
ambiguous. `events.md` needs no matching change — confirmed, not assumed: its
own §3.14 same-day-resume row (Q19) already computes the identical
context-scoped fact for the Event-linked case, and its "Vendiendo ahora"
hand-off (§3.15) renders no running total of its own; both hand off into this
same Home selling surface rather than duplicating it. No new screen, state, or
tap — a content/scope amendment to already-enumerated states, same treatment
as the 2026-08-08 Business Identity receipt amendment and this document's own
preceding 2026-08-13 entries. §3.7, §3.7a (cross-reference only), §3.11
(preview-line relabel only), §10 updated. Pending `ux-critic`/`reviewer`
review before folding back into Approved.

*(Current behavior lives at `home.md` §3.7. The §10 version of this same
decision is at `decisions-2026-08-13-header-context-scope` below.)*

### status-2026-08-13-cerrar-jornada-de-venta-rename
**Date:** 2026-08-13 (Product Owner decision — Selling-Session-close action renamed from "Cerrar sesión" to "Cerrar jornada de venta").

Every wireframe, current-tense flow description, and section heading in this
document naming Home's Selling-Session-close action is renamed to "Cerrar
jornada de venta." This formalizes a rename already live in the built
prototype, not a new product decision invented here — see
`product/02c-high-fidelity-prototype/README.md`'s "Terminology Review pass
(2026-08-13)" §1 ("'Cerrar sesión' → 'Cerrar jornada de venta.'"), which
reasoned the rename against a concrete domain-model constraint (Session vs.
Venta — five candidates evaluated; "Cerrar jornada de venta" adopted as the
only phrasing colliding with neither "Finalizar Venta" nor "Venta actual")
and disclosed it explicitly as prototype-only, pending this document's own
correction. The Product Owner's further reasoning for formalizing it now:
"sesión" is reserved exclusively for the authenticated User/device context RFC
0007 (`product/99-rfc/0007-user-and-business-membership.md`) introduced into
this product's vocabulary — `authentication.md`'s own domain, not Selling's —
so there is no longer a naming collision to guard against; the Selling-domain
meaning of "sesión" (one working day of selling) is retired from
merchant-facing vocabulary entirely. This is also why `settings.md`'s new
account-level sign-out action (added this session, §2.5) simplifies to plain
"Cerrar sesión" in the same pass — see that document's own status header.
Historical-record mentions of the retired copy (the "▾ reveals Cerrar sesión
/ ver detalle de hoy" direct quotes at §3.7a's and §10's own amendment
history) are left untouched, describing what an earlier draft said, not
current terminology. Copy-only — no flow, state, gating, or interlock changes;
the interlock itself (§2, §3.11a) is unaffected, only its trigger's name.
Pending `ux-critic`/`reviewer` review before folding back into Approved.

### status-2026-08-14-cerrar-jornada-direct-affordance
**Applies to:** `home.md` overall Approval, active-Session header (§3.7 and
every wireframe through §3.11a), §3.7a (retired).

Amended 2026-08-14 (Product Owner-raised — "Cerrar jornada de venta"
discoverability): during an active Selling Session, "Cerrar jornada de
venta" moves out of the session-controls sheet entirely and becomes a
direct, always-visible header button (§3.7 and every active-Session
wireframe through §3.11a); the header's "⋯" icon is replaced by a gear
icon ("⚙") that now routes straight into Configuración with no
intermediate sheet, since only one destination remained behind it. §3.7a
(the sheet) is retired for this state. Outside an active Session
(§3.3–§3.6/§3.6a/§3.6c), the "⋯" icon and its Configuración-only sheet are
unchanged — see §2 and §3.6c for why this divergence is deliberate, not
an inconsistency left unaddressed. `settings.md` receives the matching
correction (§2.1, §3.3, §4, §6, §8). `ux-critic`/`reviewer` reviewed this
amendment: `reviewer` found two documentation-persistence gaps (this
anchor and its §10 sibling had never been created; §3.7's own
shared-header cross-reference bullet still listed the now-retired §3.7a
as live) — both closed in the same pass. Folded back into Approved.

---

## §10 "Decisions made" — full decision history

### decisions-3-7b-quick-session-title-row
**Session-active header title row now has explicit content for a Quick
Session (§3.7b, closes a Medium-Fidelity spec-gap escalation,
`product/02-ux/CLAUDE.md` §4).** Reads "Sesión rápida" — reusing the term
§3.4/§3.5 and `reports.md` §3.7 already established — rather than the
idle-state "Nahui" fallback or a blank row. Grounded in
`architecture-principles.md` #3 (Quick Session as fully first-class) and
`global-principles.md`'s "technology should disappear" (a calm, correct
render, not an empty one). Applies to §3.7–§3.11a, excluding §3.8f (no header
by design).

### decisions-3-9-product-tile-marker
**A compact, automatically-generated per-Product marker (first letter of
`Product.name`, uppercased) is added to every tile in the buttons-mode selling
grid (§3.9).** Closes a real gap on the highest-frequency screen in the app —
ProductTile previously had no visual differentiator beyond its label. Derived
purely from already-stored `Product.name`; no new Product attribute, no
schema change, no RFC needed for this change itself. True custom per-product
iconography (a merchant-chosen/uploaded icon) is explicitly out of scope here
— it would require a new Product attribute, a Product Decision, and likely an
RFC; flagged as a future, deeper option only (§11), not designed in this pass.
The marker renders muted on a sold-out tile by reusing this section's existing
sold-out dimming rule, never as an independent visual treatment. Not
RFC-worthy itself — no aggregate boundary, domain term, or IA change; a UX
visual-differentiation fix to an already-Approved spec, same category as this
document's other post-Approval amendments.

### decisions-removed-nueva-venta-gesture
**Removed the "Nueva Venta" gesture** present in the original validation
prototype. A Sale's start is now inferred from the first product tap when no
Sale is open; only "Finalizar Venta" is an explicit boundary. Mitigated the
one real risk (stale sale from an interrupted customer) by keeping the
current-sale tray always visible plus a small "Cancelar venta actual" action —
which now also carries its own lightweight, inline confirmation (§3.8b),
rather than reintroducing an explicit start step.

### decisions-2-tap-floor-intentional
**2-tap floor to start selling is intentional**, not a residual inefficiency
— Session start is a real, meaningful business event (timestamps hours
worked, feeds future Resultados) and deserves one deliberate commitment tap,
distinct from the act of registering an item.

### decisions-two-confirmation-weights
**Two deliberate confirmations now exist in the flow, at two different
weights, not one.** The original draft stated Close-session was "the one
deliberate confirmation in the whole flow" — no longer accurate once Cancelar
venta actual gained its own confirm step (resolving HOME-M1). Close-session
(§3.11) keeps the heavier, full dimmed-sheet treatment: it happens at day's
end, with no customer waiting, and is genuinely irreversible. Cancelar venta
actual (§3.8b) gets a lighter, inline confirm instead: it happens
mid-transaction, with a customer physically present, where Home's <3s bar
still applies. Same underlying principle — a destructive/irreversible action
never goes unconfirmed — applied with proportional ceremony to two genuinely
different contexts, not an inconsistency between them.

### decisions-cancelar-venta-actual-repositioned
**Cancelar venta actual is repositioned** away from being stacked directly
above "Finalizar Venta" (§3.8) — it now sits inline with the "Venta actual"
line at the top of the tray, separated from the primary action by the entire
registration zone, directly addressing the mis-tap/adjacency risk named in
HOME-M1.

### decisions-tap-to-add-and-finalizar-venta-save-error-states
**Tap-to-add-item and Finalizar Venta now both have explicit save/error
states** (§3.8a–§3.8d), matching every other write action in the document
family. Chosen shape: tap-to-add is optimistic and instant, syncing silently
in the background, surfacing a failure only once automatic retries are
exhausted and only as a small, non-blocking per-item marker — preserving the
<3s bar while still guaranteeing no silent data loss. Finalizar Venta reuses
the same near-instant/slow/error pattern already established by Guardar
mercancía and Guardar evento. Resolves HOME-B1.

### decisions-resuming-interrupted-session-3-13
**Resuming an interrupted Session (§3.13) is now specified for both an empty
and a non-empty "Venta actual."** "Venta actual" is always a read of the
Sale's true current state, not a client-only cache — an interruption can
never fabricate an empty tray out of a real in-progress one. Resolves HOME-B2.

### decisions-cerrar-jornada-interlock-non-empty-sale
**Cerrar jornada de venta now interlocks with a non-empty Sale** (§3.11a) —
hard blocked, not a warn-and-proceed dialog, because closing is the one
deliberately irreversible action in the flow and an unfinished Sale is real,
already-registered work. Resolves HOME-M2.

### decisions-buttons-grid-unbounded-sold-out-otro-removed
**The buttons-mode grid (§3.9) is now explicitly unbounded and scrollable,
ordered most-frequently-sold-first**, sold-out tiles are dimmed and
non-tappable (matching Inventario's own sold-out treatment), and the
undefined "Otro" tile is removed entirely, since Selling never creates a
Product outside the Catalog (`architecture-principles.md` #6). Resolves
HOME-M3.

### decisions-session-controls-sheet-wireframe
**The session-controls sheet (§3.7a) now has its own wireframe**, replacing
the earlier draft's undesigned "▾ reveals Cerrar sesión / ver detalle de hoy"
reference. "Ver detalle de hoy" is removed as an unspecified, undesigned
feature rather than left dangling — the ambient header already covers today's
running total, and anything deeper belongs to Resultados. Kept as an
(extensible) sheet rather than a single hardcoded action specifically because
`information-architecture.md` already commits this affordance as the future
reachability point for Settings (`decision-log.md` D13) — the extensibility
commitment is now realized: the sheet carries two entries today, "Cerrar
jornada de venta" and "Configuración" (see the next entry for how the second
entry landed). Resolves HOME-M4.

### decisions-configuracion-reachable-from-home
**Configuración is now reachable from Home, per `settings.md` §2.1.**
`settings.md`'s own spec amends this document: a "Configuración" row is added
to the session-controls sheet (§3.7a) below "Cerrar jornada de venta," and the
sheet itself is now reachable from Home's four non-Session header states
(Cold start, Idle-no-event, Idle-with-event, Event-active-no-Session) via the
header's session-controls icon (originally "▾," relocated 2026-08-09 to a
top-right "⋯" — see the entry below) (§3.3–§3.6, including the §3.6a
Session-start-moment variants shown on top of §3.4/§3.5/§3.6, and §3.6c) —
not only from an active Session. "Cerrar jornada de venta" stays scoped to an
active Session, exactly as before; "Configuración" is available in every
state, since capability self-service (D25) has no dependency on whether a
Session is open. The two sheet entries are independent actions, not a shared
flow — this closes the gap `product/00-foundation`'s Architect readiness
review flagged: without it, Configuración had no way to be reached from three
of Home's four non-Session states.

### decisions-2026-08-09-trigger-relocated-ellipsis-gear-icon
**2026-08-09 (Product Owner decision): the entry-point trigger relocates from
the header's "▾" to a top-right "⋯" icon; the sheet's "Configuración" row
gains a gear icon ("⚙").** Raised because the Product Owner found the "▾"
insufficiently discoverable/natural. Purely a trigger-level and sheet-row-marker
change — no state gains or loses the entry point (the same four-state
exclusion this document already establishes, §3.1/§3.2/§3.12/§3.14, is
unchanged), "Cerrar jornada de venta" stays scoped to an active Session
exactly as before, and nothing about Configuración's own downstream behavior
(settings.md §3.3a onward) is touched. **"⋯" chosen over a hamburger ("☰"):**
a hamburger conventionally signals a full secondary navigation drawer with
many destinations; adopting one here would misrepresent, and visually
compete with, what's actually behind this trigger — a one-or-two-row sheet,
not a parallel navigation system — undercutting decision-log.md D13's own
ruling that this affordance is a sequencing/reachability fact, not a fifth
nav tab, alongside the persistent, already-primary bottom nav bar. A
three-dot overflow icon is the more standard, more honestly-scoped mobile
convention for a small set of secondary actions attached to a screen, and
directly answers the Product Owner's stated concern with a widely-recognized
signifier the "▾" never was. The gear icon on "Configuración" specifically
(not on "Cerrar jornada de venta") answers the Product Owner's explicit
request to distinguish it from any other entry the sheet may carry in the
future. Every current-state wireframe and current-tense description of the
trigger across this document (§2, §3.3–§3.7a, §3.8f, §4, §5) is updated to
"⋯"; narrative describing the moment the "▾" affordance was first introduced
(the predecessor status-header entry, and §3.7a's HOME-M4 history) is left as
an accurate record of that point in time, not rewritten. settings.md receives
the matching correction in the same pass — see that document's own status
header and §2.1/§8 item 3.

### decisions-framing-default-entry-point
**Framing: "selling becomes the default entry point," not "Home is the
selling screen."** The persistent bottom nav stays reachable through every
selling state; navigating away is never obstructed. Opening Hoy while
actively selling still always resumes selling (§2 unconditional), but that's
a distinct fact from whether she can leave.

### decisions-ambient-header-optional-testable
**Ambient header (Día N / running total) included as optional, testable** —
passive display only, not an interaction, doesn't compete with speed.

### decisions-nfc-readiness-session-start-d23-d27
**NFC Readiness folded into Session-start, per `decision-log.md` D23, further
corrected for D27.** The Ready-matching-default case (the common one) stays
exactly as fast and silent as before — zero wireframe changes, zero new taps.
Limited Ready, Not Ready, an unavailable Selling Mode Capability, and (see the
next entry) the Ready-but-still-on-`botones` discoverability mention are the
only cases that ever become visible, all scoped to the existing Session-start
action (§3.6a) rather than a new screen: Limited Ready is a one-tap-to-override
inline recommendation; Not Ready is a one-time, non-blocking mention (only
when it disagrees with a `defaultSellingMode` of `nfc`) with a path to
Asignar Tags, never a block on selling itself. `Session.operatingMode`
replaces the old Business-wide `registrationMode` wherever this document
meant "which mode this specific Session runs in" — the Business-level Selling
Mode Capability (whether `nfc` is available at all) is a distinct concept
from `Session.operatingMode`, but no longer one this document leaves ungated:
§2's Ready branch now explicitly checks `nfc ∈ registrationMode` before ever
resolving a Session silently into `nfc`, so an unavailable `nfc` can never be
silently bypassed just because a stale `defaultSellingMode` field still reads
`nfc`. Per `decision-log.md` D27, `nfc ∈ registrationMode` is itself now a
pure read-time derivation from `subscriptionTier = paid` — the case this
entry describes arises specifically from a Paid→Free downgrade landing
(`settings.md` §2.2, "Volver al plan gratis"), not an unspecified "capability
revocation." The Session still opens in `buttons` automatically in this case
— but, as of this fix, never silently: it now gets the same kind of one-time,
non-blocking mention Not Ready gets, and — once `settings.md` landed and
provided a real destination — the same kind of next-step link too ("Ir a
Configuración"): `settings.md` (Approved, Q5 Resolved via `decision-log.md`
D25, further corrected by D27) specifies the actual self-service restoration
path at §2.2 ("Activar plan de pago") — see §3.6a. Resolves HOME2-MAJ3.

### decisions-2026-08-09-d27-cross-m1-buttons-to-nfc-nudge
**A new, fourth Session-start mention closes a discoverability gap D27
introduced: a Paid-tier merchant whose tagged inventory clears NFC Readiness
while `defaultSellingMode` still reads `buttons` now gets a one-time nudge
toward Configuración's "Cambiar a vender con tags" control (§2, §3.6a).**
Before this, nothing in the product ever told her the capability she's paying
for had become usable. D23's asymmetric nudge architecture (nudges only ever
point away from `nfc`) is unchanged and not reopened by this addition — the
new mention is purely informational, changes nothing about Session-start's
own resolution (the Session still opens silently in `buttons`, exactly as
before), and is shown once ever rather than once per occurrence — a
deliberate, narrower discipline than the other three §3.6a mentions, chosen
because this one nudges toward a discretionary choice she's entitled to
decline, not an operational fact that changes what's happening right now.

### decisions-home-q1-venta-finalizada-ambient-confirmation
**A successful Finalizar Venta now gets an explicit, ambient confirmation
("Venta finalizada ✓," §3.8e) — resolves HOME-Q1.** Every other successful
write action in the document family (`inventory.md`'s "Mercancía registrada
✓," "Mercancía lista para vender ✓"; `events.md`'s "Evento agendado ✓")
already got this treatment; Finalizar Venta — the highest-frequency, most
consequential write action in the product, directly tied to
`company/CLAUDE.md`'s core registration-speed thesis — had none. Before this
fix, the post-success resting state ("Venta actual: (vacía)," §3.7) was
pixel-identical to both a fresh Session start and a post-cancellation state
(§3.8b), giving Ana no way to tell "it saved" from "nothing happened" or "I
cancelled it" without mentally tracking the header total herself. Fixed by
reusing the same ambient, zero-tap posture already established by the
sibling docs — no dismiss tap, adds no step to the next sale (note: the
fixed-fade timing was later changed by the 2026-08-04 payment-moment
extension — see `decisions-2026-08-04-payment-moment-extension-superseded-note`
— this entry describes the original zero-tap mechanism, not the current dwell
model) — rather than inventing a new mechanism. Distinct from, and does not
reopen, §11's already-deferred "deshacer" (undo) toast: that's a separate,
reversal-oriented affordance; this is a one-way positive acknowledgment only.
Not RFC-worthy — no aggregate boundary, domain term, or IA change; a UX
state-design fix to an already-Approved spec, same category as the other
amendments recorded above.

*(Superseded — current behavior lives at `home.md` §3.8f. See
`section-3-8e-superseded` below.)*

### decisions-2026-08-04-payment-moment-extension-superseded-note
**[Superseded 2026-08-05 by `decisions-2026-08-05-full-viewport-receipt-3-8f`
below — kept for history, per this document's amendment-log convention.]
§3.8e's ambient confirmation now carries the sale's own total and a literal,
future-tense placeholder for a not-yet-built registration mechanism, and its
dwell model changed from a fixed fade to persist-until-her-next-action.**
Extends, not replaces, HOME-Q1's original fix. Two things drove this: (1) the
total makes a genuine Finalizar Venta success even more clearly distinct from
a fresh Session start or a cancelled sale — a stronger version of the same
signal HOME-Q1 already established, since neither of those paths ever
produces a per-sale total; (2) this screen is designed to be turned toward
the customer during payment, so its content now has a real external reader
and a real, variable-length moment to survive, which the original
half-second-glance fade was never tuned for. The dwell model was changed
accordingly: the block persists until she taps forward (any product tile,
which starts the next sale and clears it as a side effect — no dedicated
dismiss action) or until she leaves Hoy or the app is interrupted, at which
point §3.13's existing "resolve fresh, no stale state" guarantee already
applies. An explicit "Continuar vendiendo" control was considered and dropped
— since the registration grid is never blocked or covered by this content,
there is no real state for such a control to resolve, and it would only add
chrome competing with the total for attention on a screen that may be facing
a customer. The placeholder line is deliberately literal ("algún día vas a
poder registrar aquí tu compra") rather than any QR-shaped graphic — a QR
render would carry an unhedgeable "this is live" claim regardless of who's
reading it or in what context, and this document is a permanent spec, not a
one-week moderated-test artifact where that risk is temporarily lower. Its
copy uses Ana's own vocabulary, never the internal "Claim"/"Claim Token"
terms from `decision-log.md` D22/`ubiquitous-language.md`
(`global-principles.md`, Product Language). This does not design, build, or
commit to the Sale-level QR/Claim-Token mechanism itself
(`product/99-rfc/0002-loyalty-claim-complete-capability.md`) — that remains
`company/backlog.md` #2's Stage 2, gated behind backlog #1's own success bar,
not started. Not RFC-worthy — no aggregate boundary, domain term, or IA
change; a UX state-design amendment to an already-Approved spec, same
category as this document's other post-Approval amendments.

### decisions-2026-08-05-full-viewport-receipt-3-8f
**2026-08-05: the payment-moment extension above is superseded by a
full-viewport receipt (§3.8f), replacing the ambient-overlay model entirely
rather than extending it again.** Two things forced this: (1) a confirmed
privacy problem — during the payment moment the device is held out to the
customer, and Ana's cumulative daily revenue (the header's running total)
plus the live, tappable product grid have no legitimate reason to be visible
to that customer; an overlay can only ever de-emphasize that content, never
actually remove it from the render, so the fix has to be structural, not
cosmetic; (2) once the grid genuinely isn't on screen, "tap a product tile" —
the mechanism the overlay model used to clear itself and return to selling —
no longer exists to tap. Resolved as follows:
  - **Full-viewport replacement, not overlay.** A successful Finalizar Venta
    now routes to a dedicated state (§3.8f) that temporarily replaces §3.7 —
    no header, no Venta actual tray, no product grid — built from exactly
    three elements: the existing "Venta finalizada ✓" line (now
    de-emphasized, no longer dominant), the per-sale total (still the single
    largest, most legible element on screen), and the future-registration
    placeholder. Still not a navigation destination in the IA sense — no
    back arrow, nothing added to the nav graph — it's a temporary
    full-screen state of Hoy, the same way §3.1's resolving skeleton or
    §3.14's fallback are states of Hoy without being destinations of their
    own.
  - **Exit mechanism, revised after a `ux-critic` Blocker: a tap zone
    scoped to the screen's outer margin — bottom edge foremost, matching
    where Ana's hand already grips the phone to present it — replaces the
    full-surface tap, with the fixed auto-return demoted to a backstop
    rather than shared common-case duty.** The original hybrid
    (full-surface tap-anywhere, plus a short — illustratively 4–6s —
    auto-return) failed on both halves against the exact exposure this
    redesign exists to prevent, for the same underlying reason: neither half
    was tied to an event under Ana's exclusive control. A fixed timer fires
    on a clock, blind to whether the customer is still looking — one who
    takes longer than the illustrative window (counting change, negotiating,
    ordinary bazaar behavior) is still looking straight at the phone when it
    auto-flips to the private §3.7 grid. A full-surface tap is exactly as
    reachable by the customer's hand as by Ana's — the phone is, by this
    screen's own premise, held out and often within the customer's reach, so
    a customer pointing at the total or touching the brand mark triggers the
    identical dismissal, sooner than the timer would have, and by exactly
    the person the mechanism exists to shield the content from.
  - The fix ties dismissal to where Ana's hand already is, not to
    "anywhere." Presenting the total means tilting the phone so its far
    edge points toward the customer while its near edge stays against her
    own palm — the geometry of the gesture itself, not a new one to learn.
    The live zone is the screen's outer margin, bottom edge foremost:
    reaching it means reaching past the visible total and into Ana's own
    grip, a conspicuous motion for the person the total is being shown to,
    unlike reaching for what's already directly in front of them. This
    doesn't claim the zone is unreachable by a customer — nothing on a phone
    held out and visible to them can be made unreachable without abandoning
    the premise that it's shown to them at all, which this screen doesn't
    get to escape — only that the ordinary physics of the gesture make it
    the one part of the screen a customer has no natural reason to touch,
    sharply reducing an accidental trigger rather than eliminating it.
    That's the tradeoff being accepted here, stated plainly rather than
    assumed away.
  - This costs Ana real precision, weighed honestly rather than glossed
    over: a passive regrip alone was already shown not to reliably register
    as a tap, and narrowing the target from the full surface to a margin
    makes landing a deliberate tap there less forgiving, not more. It's
    still one motion, not two — the tap lands as she starts pulling the
    phone back, not as a separate step — but it's a smaller target than
    "anywhere," and that cost is accepted because leaving the full surface
    live is the exact defect being fixed.
  - The auto-return's role changes with it. With a reliably Ana-scoped tap
    as the everyday exit, the timer no longer needs to double as the
    common-case mechanism or stay short — its only remaining job is
    recovering a phone set down and forgotten with the receipt still
    showing, no tap, no nav, no lock (§3.13's own scenario). Decoupled from
    the common case, its default can run generously long — illustratively
    tens of seconds rather than several — specifically so it isn't expected
    to fire while a customer is still genuinely present, including a slow
    one. The cost is narrow and bounded: only if Ana genuinely sets the
    phone down and later picks it up without tapping does she wait longer
    for the receipt to clear on its own, and even then the same
    near-zero-friction margin tap she'd have made anyway clears it the
    moment she actually means to sell again — a bounded convenience cost,
    not the live privacy failure the timer firing early used to be.
  - Duration-only was reconsidered and rejected again, more sharply than
    the first time: a duration short enough to avoid a real per-sale wait
    cost is exactly the duration a slow customer can still be looking at
    the phone through, and a duration long enough to make that reliably
    unlikely reintroduces a wait cost on every sale, in direct conflict
    with `company/backlog.md` #1's <3s bar — the exact cost the hybrid
    model exists to avoid. With the tap's own reachability problem solved,
    there's no remaining reason to give it up.
  - This is still a judgment call about how Ana physically holds and
    presents the phone during payment, not something validated with her
    directly — flagged the same way the original mechanism was, for the
    Product Owner to confirm or override once real usage, or a moderated
    session, can check whether the margin zone matches how she actually
    grips the phone in practice.
  - **Visual device for the placeholder: the Nahui mark alone, not a
    QR/scan-pattern render.** Confirmed rejected twice now — a rendered
    scan-pattern grid carries an unhedgeable "this is live and scannable"
    claim regardless of styling or context, and this is a permanent spec
    describing every sale, not a one-week artifact. The composition/polish
    cue from the Product Owner's branded reference (a centered QR with the
    Nahui logo overlaid) is taken as exactly that — composition only:
    centered, clean, brand-forward — applied to the brand mark alone, with
    the scan-pattern grid dropped entirely rather than stylized. This also
    gives the placeholder a legitimate, undesigned tie to `brand-guide.md`'s
    "the center" narrative (where a sale becomes data, a customer becomes a
    relationship) without forcing the four-pillar story onto a screen that
    doesn't need it to function.
  - **Superseded 2026-08-09, for the placeholder element specifically —
    named explicitly, not silently edited.** This entry's rejection was
    scoped to a *decorative*, non-functional graphic carrying an unhedgeable
    "this is live and scannable" claim with no real interaction behind it —
    correct at the time, for that risk. It doesn't extend to a genuinely
    functional element that, when engaged, actually navigates to a real,
    already-built destination (`product/02-ux-loyalty/customer-loyalty-registration.md`
    §3.1 onward) — that risk doesn't apply to something that's actually
    live. Per explicit, direct Product Owner instruction, §3.8f's current,
    dated 2026-08-09 amendment now specifies exactly this. Kept, not
    deleted, per this document's own amendment-history convention — it
    correctly records why a QR was rejected at the time, for the reason
    that applied at the time.
  - **Copy stays exactly as before** ("algún día vas a poder registrar aquí
    tu compra") — still names no mechanism, still doesn't commit to a
    reward/gift framing (`decision-log.md` D22's Claim Token is a Customer
    Segmentation/intelligence mechanism, not confirmed gift-based) — see §8
    for an explicit flag on whether that framing question needs its own
    Product Decision once backlog #2 Stage 2 is actually designed.
  - **Ceremony stays restrained, not decorated, despite this being the one
    customer-facing screen in the product.** Weighed explicitly: this is
    both the highest-frequency screen in the app (every sale) and the only
    one a customer ever sees, two facts pulling in opposite directions on
    how much ceremony is appropriate. Resolved toward `brand-guide.md`'s
    existing restraint — no decorative elements specified — with the
    "celebratory conclusion" feeling the Product Owner asked for expressed
    through composition instead of ornament: full-viewport space, one
    dominant number, nothing else competing for attention is already a
    meaningfully bigger gesture than the cramped overlay version, without
    adding literal decoration that would read as gimmicky in front of a
    real customer at a real bazaar — a look this document's whole tone
    (`brand-guide.md`, never framing informal commerce as needing to be
    "modernized" with novelty chrome) exists to avoid.

Not RFC-worthy — no aggregate boundary, domain term, or IA change; a UX
state-design amendment to an already-Approved spec, same category as this
document's other post-Approval amendments. Ready for the standard
`ux-critic`/`reviewer` cycle before folding back into Approved.

### decisions-d33-price-resolution-grounded
**Price resolution (`decision-log.md` D33) confirmed as a zero-decision
automatic mechanism at every tap/scan, and both of Home's existing dollar
figures — the header's running total (§3.7) and the receipt's per-sale total
(§3.8f) — are now explicitly grounded as sums of `SaleItem.pricePaid`, not
previously-untraced numbers.** This closes the exact ambient-assumption gap
D33's own Context paragraph names ("Hoy: $850 · 6 ventas"... "with no
traceable source"). No new screen, state, or tap was added anywhere in the
tap-to-sell flow (§3.9/§3.10) — this is a grounding/citation fix, confirming
an already-Approved interaction remains exactly as fast and decision-free as
specified, now traceable to a real domain field instead of an implicit
assumption.

### decisions-2026-08-08-cold-start-test-corrected
**§2 step 3's cold-start resolution test corrected from "at least one Product
ever registered" to "at least one `available` InventoryUnit exists"**
(2026-08-08, alongside `onboarding.md`'s new "Define lo que vendes" step,
`decision-log.md` D33) — the original test's parenthetical ("has she ever
registered a Lot") was an accurate proxy for "has anything to sell" only as
long as a Product could never exist without an accompanying Lot;
`onboarding.md`'s new step breaks that equivalence by design. Left
uncorrected, a merchant fresh from that step would have been offered "Iniciar
Sesión Rápida" (§3.4) — a promise something is sellable — and land on an
entirely dimmed, non-tappable selling grid (§3.9) the instant she tapped it:
precisely the "disguised dead end" §3.3's own design note already warns
against, reached from the opposite direction. The corrected test also closes
a second, previously latent instance of the identical gap: a merchant fully
sold out mid-run (every unit sold, nothing new received) was also, under the
old test, routed to the dead-end grid — now correctly routed to cold start
instead.

### decisions-2026-08-08-section-4-wiring-stale-fix
**§4's own interaction-flow summary was still citing the pre-correction test
after §2 step 3 was corrected above — fixed to match (2026-08-08, caught
during `ux-critic`'s D33 remediation re-check, missed by the original
correction).** §4's branch labels read "nothing active, Catalog has Products"
/ "Catalog empty" — the retired "Product ever registered" proxy §2 step 3 was
already corrected to replace, above. Corrected to "at least one `available`
InventoryUnit exists" / "zero `available` InventoryUnits," matching §2
exactly, since §4 is this document family's own designated canonical wiring
section (`product/02-ux/CLAUDE.md`) and a stale copy there is exactly the
kind of section-drift this project's own incident history (`decision-log.md`
D31/D32) already treats as a real Medium-Fidelity build-defect risk when a
doc's own §2 and §4 disagree about the same branch. No wireframe, state, or
routing decision changes — §4 always described the identical branch §2 step 3
defines; only its own wording had fallen out of sync with a fix already
applied one section away.

### decisions-2026-08-08-business-identity-receipt
**2026-08-08: §3.8f's receipt now shows the merchant's own captured identity
instead of Nahui's own mark — a deliberate brand-facing product decision,
named explicitly per this document's own review discipline, not an incidental
side effect of `onboarding.md`'s new identity-capture step.** Until this
amendment, every receipt Ana ever showed a customer carried Nahui's own mark —
reasonable when nothing else was available to show, but never actually a
brand statement anyone chose on purpose; it was the honest fallback for an
empty field, not a considered choice. Once `onboarding.md` §2.2b makes
`Business.name` a required, always-populated field (and `Business.logo` an
optional one), the honest fallback for an *absent logo* is her own business
name as text, not Nahui's mark — Nahui's mark was never the right fallback
for a missing merchant logo, it was only ever standing in for a data field
this product hadn't captured yet. This is the correct, considered choice, not
merely a technical consequence of a new field existing: the receipt moment
(§3.8f) is Ana's own customer-facing surface, at the single instant in the
whole product a real customer ever sees anything — reinforcing her own
identity there, not Nahui's, is the more honest and more merchant-respecting
choice, consistent with `brand-guide.md`'s tone (never positioning Nahui's own
presence ahead of the merchant she serves) and with the general shift this
identity-capture amendment represents across the product. **Fallback is
`Business.name` as plain text, not Nahui's mark, and not a generic
placeholder** — reasoned explicitly: `Business.name` is required (never
blank, `onboarding.md` §2.2b), so there is always a genuine, honest thing to
show; falling back to Nahui's own mark when only the logo (not the name) is
missing would mean the *common* case — most merchants likely won't have a
digital logo ready, per this amendment's own design note — shows Nahui's
brand more often than the merchant's, exactly backwards from the stated
intent. Not RFC-worthy — no aggregate boundary, domain term, or IA change
(`Business.name`/`Business.logo` are additive fields `architect` already
cleared as sitting inside Selling's existing read-only dependency on
Identity); a content-source and asset-source change to an already-Approved
state's third element, same category as this document's other post-Approval
amendments.

### decisions-2026-08-09-d40-placeholder-gated-paid-tier
**2026-08-09: §3.8f's future-registration placeholder is now gated on
`subscriptionTier=paid`, absent entirely on a Free-tier receipt
(`decision-log.md` D40).** The original copy was written mechanism-noncommittal
but tier-noncommittal too, before D40 existed — promising every merchant
she'll "someday" get this is false for Free tier; only upgrading gets her
there. Fix: a Free-tier receipt renders exactly three elements; a Paid-tier
receipt is unaffected. **Not a design of the live QR interaction itself** —
tracked as `product/02-ux/product-decisions.md` Q15, scoped explicitly to
Paid-tier Sales.

### decisions-2026-08-09-q15-real-qr-resolved
**2026-08-09 (Product Owner decision, resolving `product/02-ux/product-decisions.md`
Q15): §3.8f's Paid-tier receipt now renders a real, tappable/scannable Claim
Token QR in place of the former literal placeholder text — the entry point
into the already-Approved `product/02-ux-loyalty/customer-loyalty-registration.md`
flow, §3.1 onward.** Needed to work end-to-end for the demo specifically; the
design generalizes cleanly beyond the demo, since nothing about it is
demo-specific except the single-device tap-stand-in for a camera scan
(§3.8f). **Explicitly supersedes, not contradicts, the two prior "no
QR-shaped render" passages in this document** — both correctly rejected a
decorative, non-functional QR graphic for carrying an unhedgeable liveness
claim with nothing behind it; that objection doesn't apply to a genuinely
functional element navigating somewhere real. The identity element
(`Business.name`/`Business.logo`) is unaffected and still never renders as a
QR — only the separate future-registration row changes. Reasoning, the
destination bridge, the demo-vs-production distinction, and the exit-mechanism
non-conflict are specified in full in §3.8f's own bullets, not repeated here.
**Does not redesign the destination flow** — already fully specified and
Approved before this amendment; only the bridge is new. **Resolves Q15**:
purely ephemeral, nothing persisted — Ana's existing control over the
receipt's own exit already fully realizes D40's "she controls whether she
offers the QR." **Flagged, not resolved:** this activates
`company/backlog.md` #2's Stage 2 ahead of its own stated gating, by this
specific Product Owner instruction; the general sequencing question
`decision-log.md` D34 left open stays open. **Consultation self-check, not a
live request:** this bridge decomposes from already-Approved precedent
(`decision-log.md` D21/D22; §3.6a's own cross-document hand-off links) — not
escalated to `knowledge-mentor`; flagged for `ux-critic`/`reviewer` to
challenge if that judgment doesn't hold. Not RFC-worthy — no aggregate
boundary, bounded-context edge, or ubiquitous-language term changes; D22
already named the QR as a Claim Token display mechanism, D40 already
established per-Sale offering as UI-layer state. A UX state-design amendment
to an already-Approved spec. Ready for the standard `ux-critic`/`reviewer`
cycle before folding back into Approved.

### decisions-2026-08-13-architect-wording-precision-day-n
**2026-08-13 (architect-caught wording-precision fix, ahead of the Eventos
build): §2 step 2's gating condition and Día N computation corrected to match
already-settled Foundation, no behavior change.** `architect`'s Architecture
Gap Analysis for the upcoming Eventos slice found step 2's literal text had
drifted from Foundation in two ways: (1) "N = existing Sessions under this
eventId + 1, computed, never asked" contradicted `decision-log.md` D15 and
`domain-model.md`'s own "Día N" computation verbatim — Día N is computed from
*distinct calendar dates* of Sessions sharing an eventId, never a raw
Session-row count; (2) the gating condition "no Session opened yet under it
today" is literally false the moment Ana closes a Session for a lunch break
and reopens Home the same day (a Session *was* already opened under that
Event today), which would have incorrectly routed her to plain idle (step 3)
instead of "Continuar Día N," losing Event-awareness for the rest of that day
— directly contradicting D15's own worked example (a lunch-break resume
"does not increment the day number") and this document's §1 (Home should
already know "today is Bazar Plaza Norte, Día 2," not ask). Corrected reading,
resolved entirely from existing Foundation (classified Architect-resolvable,
no Product Owner input needed): the condition is now "Event status = active
AND no Session is currently active" (the direct complement of step 1,
dropping the "opened yet today" qualifier), and N is computed as distinct
calendar dates before today with a Session under this eventId, plus one for
today — invariant to whether today is a fresh day or a same-day resume. §3.6's
wireframe display ("Continuar Día 2") and every other section referencing
this branch are unaffected — they never asserted the raw-count formula
themselves, only §2's own prose did. Not RFC-worthy — no aggregate boundary,
domain term, or IA change; a literal-text-only correction to an
already-Approved spec, same category as `events.md`'s EVT-Q1/EVT-Q2
precedent.

### decisions-2026-08-13-q19-same-day-resume-ambient-line
**Same-day resume now surfaces an ambient "Ya vendiste $X · N ventas hoy"
line on §3.4/§3.5 (Quick Session) and §3.6 (Event-linked), closing a
tester-found trust gap in the "cerrar sesión" action
(`product/02-ux/experience-review-2026-08-13-eventos.md`).** Reopening the
same Día N after a same-day close (D15) previously showed a fresh $0 running
total with no signal that a closed Session's sales still existed; Ana read
this as data loss. Sourced from the identical Session set `domain-model.md`'s
"Día N" computation already scopes to today (`SUM(SaleItem.pricePaid)`,
`COUNT(Sale)`) — no new query. Shown only when the condition holds; the
common case (first Session of the day) is unaffected, pixel-identical to
before. Classified by `architect` as resolvable directly from
`architect-questions.md` Q7's existing ruling — logged as Q19,
cross-referenced, not a new Product Owner decision. Coexists independently
with §3.6a's NFC/capability lines. `events.md` §3.14 receives the matching
addition, worded for an in-progress (not closed) day per the same finding.

### decisions-2026-08-13-header-context-scope
**2026-08-13 (Product Owner decision): §3.7's ongoing "Hoy: $X · N ventas"
header is now context-scoped (every finalized Sale today sharing this
Session's `eventId`), not Session-scoped (only this Session's own Sales).**
Closes a `merchant-user-tester` re-walk finding that Q19's own fix (the
pre-resume ambient "Ya vendiste $X · N ventas hoy" line, §3.4/§3.5/§3.6)
wasn't sufficient on its own — the live selling screen's own header still
reset to Session-scoped $0 the moment she actually resumed, the exact number
she's looking at continuously while selling. Reuses Q19's identical query,
unchanged, applied to a continuous status line instead of a one-time ambient
one. **Deliberately does not extend to "Venta actual" (single active Sale),
the close-confirmation dialog (§3.11), or the closing-summary screen
(§3.12)** — all three report on a specific committed transaction/Session, a
one-time transactional fact, not an ambient status fact re-read at arbitrary
moments; conflating the two would make §3.12's own closing numbers untrue to
what actually happened inside the Session being closed. Introduces one small,
necessary side effect: §3.11's dialog now overlays a header that can
legitimately show a larger number than the Session it's about to close, so
its own preview line is relabeled "Esta sesión: N ventas · $X" (was bare "N
ventas · $X") to keep the two simultaneously-visible numbers legible as two
different, correctly-scoped facts rather than reading as the same
discrepancy Q19 already fixed once. Classified by the Product Owner directly,
not `architect` — `architect`'s own Q19 ruling explicitly declined to
resolve this broader question, naming it "a legitimate, separate design
call." `events.md` needs no matching amendment — confirmed, not assumed: §3.7
is the only place an ongoing running total renders; `events.md` §3.14's own
Q19 row is already context-scoped and one-time, and §3.15's "Vendiendo ahora"
hand-off carries no total of its own.

*(The status-header version of this same decision is at
`status-2026-08-13-header-context-scope` above.)*

### decisions-2026-08-13-cerrar-jornada-rename
**2026-08-13 (Product Owner decision, formalizing a prototype-only rename):
the Selling-Session-close action is renamed from "Cerrar sesión" to "Cerrar
jornada de venta" everywhere in this document.** Not a new UX decision —
brings this spec into agreement with
`product/02c-high-fidelity-prototype/README.md`'s own "Terminology Review
pass (2026-08-13)" §1, which reasoned the rename directly against the domain
model (Session ≠ Venta; "Cerrar jornada de venta" is the only evaluated
candidate colliding with neither "Finalizar Venta" nor "Venta actual") and
explicitly deferred formalizing it here until now. Freed by a further Product
Owner clarification: "sesión" is reserved exclusively for the authenticated
User/device context RFC 0007 introduced (`authentication.md`'s domain), so no
collision remains to guard against by keeping Selling's own close action
unrenamed. Consequently, `settings.md`'s new account-level sign-out action —
named "Cerrar sesión en este teléfono" specifically to avoid this exact
collision — simplifies to plain "Cerrar sesión" in the same pass (see that
document's own status header). Copy-only across every current-tense
wireframe, flow branch, and enumeration; the close interlock (§2, §3.11a)
itself is unchanged, only its trigger's label.

### decisions-2026-08-14-cerrar-jornada-direct-affordance
**Applies to:** `home.md` §10 — the active-Session header's two entry
points.

2026-08-14 (Product Owner-raised — "Cerrar jornada de venta"
discoverability): the active-Session header gains two direct,
always-visible affordances, replacing the shared "⋯"-triggered sheet
(§3.7a, now retired) for this state only. "Cerrar jornada de venta" is a
labeled button (`[ Cerrar jornada de venta ]`, reusing this document's own
existing tappable-button convention rather than a new icon vocabulary);
the "⋯" icon is replaced by a gear icon ("⚙") that routes directly into
Configuración with no intermediate sheet, since a single-destination menu
no longer represents a real choice. Outside an active Session (§3.3–§3.6,
§3.6c), the "⋯" icon and its Configuración-only sheet are unchanged — §2
and §3.6c state the reasoning for the resulting divergence explicitly,
rather than leaving it implicit. Folded back into Approved.

---

## Superseded section

### section-3-8e-superseded
**From `home.md` §3.8e ("Finalizar Venta — success," superseded 2026-08-05,
folded into §3.8f).**

This section previously specified an ambient confirmation ("Venta finalizada
✓") layered on top of §3.7's resting selling screen — first as a bare
confirmation line (HOME-Q1), then, later the same day, extended with the
sale's own total and a future-registration placeholder while keeping that
same overlay shape (the "payment-moment extension"). That overlay model is
retired, not extended further: during the payment moment the device is held
out to the customer, and Ana's daily revenue total plus the live, tappable
product grid have no legitimate reason to be visible to someone standing
across the counter. The fix isn't hiding one line of the existing screen —
it's that a successful Finalizar Venta now routes to a genuinely different
state, §3.8f, a full-viewport receipt that temporarily replaces §3.7 rather
than layering on top of it. See §3.8f for the current, correct behavior. This
entry is kept, rather than deleted outright, so the document's own amendment
history stays legible — the same convention this document already uses
elsewhere (e.g. §3.7a's removal of "ver detalle de hoy").

### section-3-7a-retired
**From `home.md` §3.7a ("Session controls (⋯) — sheet," retired 2026-08-14,
folded into §3.7 — see status header.)**

```
### 3.7a Session controls (⋯) — sheet (resolves HOME-M4; extended per `settings.md` §2.1; entry-point icon relocated 2026-08-09, Product Owner decision — see status header)
┌───────────────────────────────┐
│ Plaza Norte · Día 2         ⋯   │  dimmed, still visible underneath
│ Hoy: $850 · 6 ventas             │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  [   Cerrar jornada de venta   ]  │
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
  active Session — "Cerrar jornada de venta" (unchanged) and "Configuración" (new, now
  marked with a gear icon "⚙" distinguishing it from "Cerrar jornada de venta" and any
  future entry).
- "Cerrar jornada de venta" and "Configuración" are independent actions. Tapping
  "Cerrar jornada de venta" proceeds to §3.11 (Venta actual empty) or §3.11a (Venta
  actual has 1+ items — blocked, resolves HOME-M2), per the interlock stated
  in §2. Tapping "Configuración" routes to `settings.md`'s resolve step
  (§3.1/§3.2) → vista principal (§3.3a), and returns to exactly this screen
  (§3.7, Session unaffected) via "← Hoy." Opening Configuración never touches
  the open Session, "Venta actual," or the "Cerrar jornada de venta" interlock above —
  Configuración writes only to Identity's Business Capabilities, never to
  Selling (*architecture-principles.md* #6).

Retired because, once "Cerrar jornada de venta" moved to its own direct header
button (§3.7), this sheet would have held exactly one entry
("Configuración") — a one-item menu costs a tap without representing a
real choice, so the gear icon now routes directly into Configuración
instead. See `home.md`'s own status header (2026-08-14 entry) and §10 for
the full reasoning, including why this diverges deliberately from §3.6c's
own sheet (which never held a second entry, so the same reconsideration
never applied there).
