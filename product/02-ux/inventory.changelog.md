# Inventario — Amendment & Decision History

Companion file to `product/02-ux/inventory.md`. This file holds the
justification, prior-state, and remediation-history prose that used to live
inline in `inventory.md`'s status header and `## 10. Decisions made` section.
`inventory.md` itself keeps only current-rule text and, for these locations, a
pointer back here.

Anchors are prefixed `status-` (from `inventory.md`'s status header) or
`decisions-` (from `inventory.md` §10), to keep them unique within this file.

---

## Status-header history (from `inventory.md`'s front matter)

### status-full-ux-remediation-cycle
**Applies to:** `inventory.md` overall Approval.

Status: Approved. Full UX Remediation cycle complete — INV-M1, INV-M2,
INV-M3 fixed by `ux-designer`, verified clean by `ux-critic` (zero remaining
Blockers/Majors), and passed `reviewer`'s Foundation-consistency check (no
Blockers; one cross-document Important finding — stale post-renumbering
section references — corrected by Main).

### status-d23-session-scoped-selling-mode
**Applies to:** `decision-log.md` D23 (Session-scoped selling mode).

Amended for `decision-log.md` D23 (Session-scoped selling mode — see
`product/99-rfc/0003-session-selling-mode.md`): cross-reference and
terminology only, no redesign. `ux-critic` found zero findings and
`reviewer`'s Foundation-consistency pass found zero Blockers/Important
findings — folded back into Approved.

### status-2026-08-04-inv-q1-cantidad-default
**Date:** 2026-08-04 (INV-Q1, Product Owner-raised).

Cantidad now defaults to 1 (was blank) with an explicit tap-affordance
requirement (bracketed per this doc's own `[ ]` = tappable convention) and a
"revisa antes de guardar" marker on the unreviewed default, carrying into the
§3.7 committed-lines list. Full cycle complete, `ux-critic`/`reviewer` clean,
folded back into Approved.

### status-2026-08-04-icon-comprehension-audit
**Date:** 2026-08-04 (icon/comprehension audit).

§3.4's Catalog rows now carry the same per-Product marker `home.md` §3.9
introduces, and a zero-`disponibles` row now renders dimmed while staying
fully tappable — applied identically to §3.5/§3.12/§3.13/§3.17. Full cycle
complete, `ux-critic`/`reviewer` clean, folded back into Approved.

### status-2026-08-06-hjr-inv-m1-heading
**Date:** 2026-08-06 (Horizontal Journey Review, HJR-INV-M1).

The on-screen heading at §3.6/§3.7 (and §3.8's dimmed backdrop) changed from
the imperative "Registrar mercancía" to the noun-form "Registro de
mercancía," differentiating it from the identically-worded CTA that leads to
it — both `home.md` §3.3's and this doc's own §3.3's cold-start CTAs route to
this same destination, so one heading fix closes both. No flow, state, or
behavior changed — copy-only.

### status-2026-08-07-task-priority-refinement
**Date:** 2026-08-07 (Product Owner-directed refinement to §3.5/§3.17,
grounded in the `architect`/`ux-designer` investigation into task-priority
drift).

In the pending-tags Catalog-view state, "Continuar etiquetando" is now the
primary action (positioned directly under the header, mirroring `home.md`
§3.6's primary-CTA shape) and "Registrar mercancía" is now explicit, in
prose, as secondary in that one state only — same position, same behavior,
never gated. Full UX Remediation cycle complete — `ux-critic` clean pass
(zero Blockers/Majors/Minors, two Suggestions logged), `reviewer` clean pass
(one Important documentation-hygiene finding, a stale cross-reference in
§10's older bullet, fixed by Main) — folded back into Approved.

### status-2026-08-08-d33-mvp-pricing
**Date:** 2026-08-08 (`decision-log.md` D33, MVP pricing operating model).

`Product.defaultPrice` capture added at Product creation (new §3.8a) and a
Catalog-row-level price-edit affordance added (new §3.4a). Two remediation
rounds — round 1 found 2 Major (a wiring-completeness gap in §4/§5/§6, plus a
shared cross-document scope question resolved in `events.md`) + 2 Minor + 1
Suggestion; round 2 closed both Majors, `ux-critic` verified clean (zero
Blockers/unresolved Majors). Two Minor findings remain open, non-blocking
(`ux-critic-findings.md`'s D33 entry: `INV-D33-MIN-A`, a
wireframe-propagation/bracket-convention gap). `reviewer` clean (no Blockers,
no Important findings) — folded back into Approved.

### status-2026-08-08-define-lo-que-vendes
**Date:** 2026-08-08 (`decision-log.md` D33, "Define lo que vendes" moved
into Onboarding).

A zero-`disponibles` Catalog row now distinguishes "sin registrar" (never had
a Lot received, reachable for the first time now that Onboarding can create
Products with zero stock) from "0 disponibles" (previously stocked, sold
out) — resolves a first-impression risk `ux-critic` found where a fresh
merchant's own named Products would otherwise read as already sold out.
Copy-only, no schema change, applied identically to
§3.4/§3.5/§3.12/§3.13/§3.17. `ux-critic` verified clean (zero Blockers, zero
unresolved Majors). `reviewer` clean (no Blockers; two Important findings
fixed by Main — a missing `ux-critic-findings.md` entry, and two stale
passages here claiming `defaultPrice` capture was unique to this document,
now updated to acknowledge Onboarding's sibling entry point) — folded back
into Approved.

### status-2026-08-14-d46-tag-assignment-intent-gate
**Date:** 2026-08-14 (`decision-log.md` D46 — tag-assignment auto-entry gates
on merchant intent, not mere capability).

Every auto-entry/pending-nudge trigger into Asignar Tags in this document —
§2 steps 2–3, §3.5, §3.12, §3.13, §3.14, §3.17, §4, §7, §10 — is corrected
from `nfc ∈ registrationMode` (NFC *availability*, a pure `subscriptionTier =
paid`-derived capability) to `Business.defaultSellingMode === 'nfc'` (her
actual, self-service-chosen selling-mode intent, `settings.md` §2.2). A new
entry point (new §3.3a) guides her to register merchandise first, reusing
this document's own cold-start/Catalog-view resolution, when `settings.md`
§2.6's "Cambiar a vender con tags" succeeds with zero InventoryUnits ever
received for this Business — an empty tagging queue is never shown as a
landing state. NFC availability itself, and its own separate gate on whether
the Assign-Tags mechanism exists in Inventario at all, are unchanged.
Pending `ux-critic`/`reviewer` review before folding back into Approved.

*(Superseded/resolved same day — see `status-2026-08-14-d46-addendum-dependency-cycle-fix`
below.)*

### status-2026-08-14-d46-addendum-dependency-cycle-fix
**Date:** 2026-08-14 (architect ruling — `decision-log.md` D46's own
Addendum, dependency-cycle correction).

Further corrected, same day (architect ruling — see `decision-log.md` D46's
own Addendum): the paragraph above described `settings.md`'s "Cambiar a
vender con tags" action itself reading Inventory-owned state to decide its
own routing — `architect` ruled this would close a dependency cycle
(Inventory already depends on Identity, `domain-model.md`'s Bounded Contexts
table; a return edge would violate `architecture-principles.md` #6).
Corrected: `settings.md`'s action now only writes `defaultSellingMode` and
hands off a bare entry marker; this document's own §2 gains a new,
highest-priority trigger condition (step 0) that performs the identical
check this document already legitimately owns — the same whole-Catalog
untagged-inventory test step 2 already runs, reused here rather than
duplicated in `settings.md`. Traces correctly through all three cases:
untagged inventory exists → auto-enter §3.14, seeded whole-Catalog; already
fully tagged → falls through to steps 1-2 and lands on the plain Catalog
view (§3.4, "Inventory Ready") — a real, small delta from the original
draft's "returns to Configuración" landing, reasoned in full in `settings.md`
§2.6/§10; zero InventoryUnit ever received → falls through to step 1 and
lands on §3.3a exactly as before. §2 (new step 0), §3.3a, §3.14, §4, §6, §7,
and §10 updated to match. `reviewer` clean (1 Suggestion, applied).
`ux-critic` found 1 Major (SET-INV-D46-MAJ1 — the already-fully-tagged
outcome silently landed her on this document's Catalog view with no
acknowledgment) — fixed (new one-time banner at §3.4, mirroring the existing
"named Products, zero Lots" banner already on the same screen; §10 corrected
to match) and re-verified clean. Folded back into Approved.

---

## Decisions-made history (from `inventory.md` §10)

### decisions-cantidad-default-1-stepper
**Cantidad now defaults to 1 the instant Producto is chosen, with an added
`[−]`/`[+]` stepper alongside the existing typed/`teclado numérico` entry
(§3.6, §3.7).** Amends the original spec, which specified Cantidad as an
empty, typed-only field with only an en-dash placeholder — found unclear in
Product Owner testing (no default shown, no non-keyboard way to reach 2, 3,
etc.). Default value of 1 matches the most common receiving case ("just
arrived, one piece") and removes an artificial blank-field gate for that
case — *global-principles.md*'s "the fastest interaction is the one that
never happens" and "every repeated decision should become automation" apply
directly. The stepper is additive, not a replacement: typing (and the
numeric keyboard) remains fully available for jumping straight to a larger
count. Floor: Cantidad can never go below 1 by either input method — `[−]`
is inert at 1, and a typed `0`/blank reverts to 1 rather than being
accepted, since "0 units received" isn't a real receiving event.
**Consequently, "Guardar mercancía disabled until Producto + Cantidad set"
(§3.6) now resolves to "enabled once Producto is chosen"** — Cantidad is
never in an unset state once a Producto exists, so the original gate's
substance (both fields must hold a value) is unchanged; only the mechanics
of reaching a valid Cantidad changed. Deliberately not offset with an extra
confirmation step before Guardar — the quantity is always visible in the row
before saving, same as the "Ya agregaste" list already gives her in §3.7.
Does not touch `decision-log.md` D3 ("the merchant still just types a
quantity, the platform expands it") — the stepper is one more way to arrive
at the same typed value, not a different data path; InventoryUnit expansion
is unaffected. Not RFC-worthy — no aggregate boundary, domain term, or IA
change; a UX interaction-behavior fix to an already-Approved spec, same
category as the D23 amendment above.

### decisions-cantidad-revisa-antes-de-guardar-marker
**The default Cantidad value now carries a "revisa antes de guardar" marker
until she interacts with the field, and the same marker carries into the "Ya
agregaste" committed-lines list for any line saved without ever touching its
quantity (§3.6, §3.7) — resolves INV-Q1.** The prior amendment above
(default-to-1 + immediately-reachable Guardar) closed one friction problem
but opened a silent-under-registration risk: a pre-filled "1" was visually
identical whether she'd genuinely reviewed it or simply tapped through. This
fix doesn't revert the default or add a confirmation step — it makes the
unreviewed state impossible to mistake for a deliberate one, at zero added
taps for the common, correctly-defaulted case. The marker disappears the
instant she engages Cantidad in any way, even if the value stays 1. Does not
touch `decision-log.md` D3 or the stepper/typed-entry mechanics —
copy/state-signal only.

### decisions-cantidad-numeric-affordance-requirement
**The Cantidad numeric value must render with a visible tappable/editable
affordance, and typed entry via `teclado numérico` is now stated as a hard
requirement rather than an incidental capability of the stepper (§3.6,
§3.7).** Product Owner follow-up to the two amendments above: confirmed both
are real, permanent product decisions, and specifically confirmed neither
closes the "quantity of 20" concern (whether tapping `[+]` nineteen times
would be frustrating) on its own — the mechanic (typed entry as the faster
path for large counts, §6) already existed, but nothing previously mandated
that it be *visually discoverable* rather than something she'd have to
already know was possible. Closed by bracketing the numeric value in the
wireframe, consistent with this document's own `[ ]` = tappable convention
(§3 intro), and by explicit bullets in §3.6/§3.7 stating the affordance
requirement, the hard-requirement status of typed entry, and Cantidad's
continued full editability at its default value. Not a redesign: the
stepper, the default-to-1 behavior, the floor at 1, and the INV-Q1 marker
are all unchanged — this only makes an already-intended affordance and an
already-true mechanic explicit design mandates instead of implied ones.

### decisions-home-cold-start-routes-to-registrar-mercancia
**Home's cold-start CTA routes directly into Registrar Mercancía (§3.6), not
into Inventario's own cold-start screen (§3.3).** Home's cold-start
annotation says the CTA "routes into Inventario, an existing nav tab" —
compatible with either landing point. Chose the more efficient one: she
already committed by tapping "Registrar mercancía" once; making her tap an
identical-looking CTA a second time would violate "the fastest interaction
is the one that never happens." §3.3 remains the resting state of the
Inventario tab itself when reached any other way while the Catalog is still
empty.

### decisions-excluded-supplier-cost
**Excluded Supplier and cost entirely from Registrar Mercancía**, per D9 /
*architecture-principles.md* #5, despite the IA wording conflict (§8, item
1, now corrected) — following Main's explicit instruction over the literal
IA text.

### decisions-registration-multiline-form-not-selling-grid
**Registration is a multi-line form (Producto + Cantidad per row), not a
reuse of Home's selling grid.** Receiving requires typed quantities per
Product — a different interaction shape from single-tap selling; reusing the
grid would conflate two different actions in one visual language.

### decisions-one-field-restock-or-new-product
**One field resolves both "restock an existing Product" and "register a new
one"** (§3.8) — no separate "create Product" screen, consistent with Product
being an independent, persistent identity (D2).

### decisions-elegir-producto-matching-case-insensitive-trimmed
**Elegir producto matching is case-insensitive and whitespace-trimmed**
(§3.8) — resolving INV-M3: prevents "Bolsas"/"bolsas"/a trailing-space
variant from silently becoming two separate Products and fragmenting one
real item's stock across two Catalog rows. Deliberately stops short of
fuzzy/typo-tolerant matching (e.g., "Bolsa" vs. "Bolsas" stay distinct),
since collapsing genuinely different names could silently merge two things
she meant to keep separate — a narrower, safer rule than solving the general
string-matching problem.

### decisions-lot-draft-persists-automatically
**An in-progress Lot draft persists automatically across interruption.** No
discard-vs-keep prompt on back/navigate-away; "Descartar" (§3.9) is the one
deliberate, explicit way to lose it, and the sole confirmation dialog in this
flow besides none other.

### decisions-nfc-capable-auto-enter-asignar-tags
**[Superseded 2026-08-14 — see `decisions-2026-08-14-d46-corrected-defaultsellingmode-gate`
below, kept for the historical trail.]**

After Guardar mercancía, nfc-capable Businesses are taken directly into
Asignar Tags for the just-created units, no intermediate choice screen;
buttons-only businesses see an ambient confirmation and stay on Catalog
view. Concrete implementation of `vision.md`'s "(Optional) Assign NFC Tags"
— optional at the capability level only, not a per-Lot choice.

### decisions-faltan-etiquetas-status-resume-action
**[Shape/framing superseded 2026-08-07 — see
`decisions-2026-08-07-continuar-etiquetando-primary-action` below.]**

A persistent, informational "faltan etiquetas" status + resume action on
Catalog view (nfc-capable Businesses only) makes an interrupted tagging
queue discoverable and resumable — same pattern as `home.md` §3.13's silent
Session resume. Cross-references Selling's NFC Readiness check as reading
off the same underlying tagged/untagged count (§3.5, D23) — a note only, not
a shared screen.

### decisions-catalog-rows-tappable
**Catalog rows are tappable**, prefilling Registrar Mercancía with that
Product — gives a concrete purpose to the list beyond display, and shortens
the single most common repeat action (restocking something she already
sells).

### decisions-inventario-tab-level-resolving-fallback-states
**Inventario now defines its own tab-level Resolving and defensive-fallback
states** (§3.1, §3.2, §3.18) — resolving INV-M1: identical convention to
`home.md`, `events.md`, and `reports.md` (silent near-instant skeleton,
">~1.5s" plain-language wait, manual-`Reintentar` load-failure fallback that
never blocks the nav bar). This closes a gap `events.md` §3.1/§3 had already
(incorrectly) asserted was covered by this doc.

### decisions-asignar-tags-scan-failure-error-state
**A distinct scan-failure error state was added to Asignar Tags** (§3.16),
alongside the existing "already assigned" business-logic conflict (§3.15) —
resolving INV-M2: a genuine NFC read failure (out of range, foil
interference, timeout) is a separate and likely more common case, now with
its own plain-language message; queue progress is never affected by a
failed read. Note: `home.md`'s nfc selling surface (§3.10) has the identical
gap for the selling context — out of this doc's scope to fix, flagged for
awareness only, per the finding.

### decisions-registro-de-mercancia-heading-hjr-inv-m1
**The Registrar Mercancía screen's on-screen heading was changed from
"Registrar mercancía" to "Registro de mercancía"** (§3.6, §3.7, §3.8's
dimmed backdrop) — resolving HJR-INV-M1 (Horizontal Journey Review,
`ux-critic-findings.md`): the identical imperative phrase was appearing as
both the CTA she taps and the passive title of the screen she lands on. The
CTA itself is unchanged everywhere it appears; only the destination's title
moved from a repeated verb to a noun-form label, closing the repeat for both
entry points that reach this screen (`home.md` §3.3's cold-start CTA and
this doc's own §3.3 cold-start CTA — both route to the same §3.6/§3.7
destination per the routing decision above).

### decisions-d23-terminology-updated
**Terminology updated for `decision-log.md` D23 (cross-reference only, no
redesign).** Every condition in this document that gates on whether the
Assign-Tags workflow exists at all is a Business-level capability check —
now written `nfc ∈ registrationMode` (Selling Mode Capability) rather than
the old single-scalar `registrationMode = nfc` — since Inventario is not a
Selling-context screen and none of its own conditions ever depend on which
operating mode any particular Session resolved to. `Session.operatingMode`
(the Session-level, Selling-context concept) does not appear anywhere in
this document, because nothing here is actually about a specific Session.

### decisions-catalog-rows-marker-zero-stock-dimming
**Catalog rows now carry the same per-Product marker `home.md` §3.9
introduces on the selling grid, and a zero-`disponibles` row now renders
dimmed while staying fully tappable (§3.4, applying identically to §3.5,
§3.12, §3.13, and §3.17 wherever the same Catalog row shape reappears).**
Reuses `home.md`'s existing marker derivation (first letter of
`Product.name`, uppercased and trimmed) and its existing sold-out dimming
treatment verbatim — no new logic invented for Inventario. Unlike the
ProductTile case, a dimmed Catalog row stays fully tappable: dimming here
signals "needs restocking," not "nothing to do," since restocking is
exactly Inventario's job. Same letter-collision caveat as `home.md` §3.9
applies here too — the marker is a fast-scan aid, not a guarantee of
uniqueness; the full Product label remains the primary identifier.

### decisions-2026-08-07-continuar-etiquetando-primary-action
**"Continuar etiquetando" is now the primary action in the pending-tags
Catalog-view state (§3.5, and §3.17 which mirrors it), with "Registrar
mercancía" repositioned to explicitly secondary in that one state only —
Product-Owner-directed refinement, 2026-08-07.** Follows a joint
`architect`/`ux-designer` investigation (see `company/bitacora.md`) into
whether the prior framing — Registrar mercancía as the persistent,
default-emphasis bottom CTA, the pending-tags card as a secondary
informational card above it — was still faithful to this doc's own
reasoning once a merchant is genuinely mid-process on reception-and-tagging.
`architect` confirmed no business-rule conflict: reception and tagging
remain one Inventory-context process, not two, and Registrar mercancía must
stay always reachable, never gated (unmodified `inventory.md` §3.5/§10
invariant) — the Foundation is silent on which action should read as
primary in this specific state, leaving that call to UX. The investigation
found the prior framing had drifted from the spec's own task-priority
reasoning: §1's "distant third" ranking is an aggregate stat about how often
tagging happens at all, over-extended to this one already-mid-task moment;
§7's "obvious next physical action" reasoning for entering tagging the
first time logically extends to resuming it; §2 step 3 already means a
second Registrar mercancía tap doesn't skip pending tagging, so treating it
as the obvious next move here was never fully accurate; and §3.13 vs.
§3.12's own wording ("lista para vender" vs. plain "registrada") already
establishes that for an nfc-capable Business, done means received *and*
tagged. This refinement makes the mid-process screen agree with what the
spec's own finished-process screen already says. Implemented as a
layout/positioning and behavioral-language change only, per this doc's `[ ]`
= tappable convention and its existing primary/secondary vocabulary
(mirroring `home.md` §3.6/§3.6a's "Iniciar Sesión Rápida" primary vs.
"Asignar tags" secondary pattern) — no color, typography, or component
decision, which stays Medium-Fidelity's job. No new confirmation step, no
change to the always-reachable Registrar Mercancía invariant, no split into
a separate tagging flow, no new domain concept or aggregate. Does not touch
§3.4 (plain Catalog view, no pending tags) or §2's resolution logic beyond
restating the same YES/NO branch in the new vocabulary — the branch itself,
and every other state in this doc, is unchanged. Scoped explicitly by the
Product Owner as a UX refinement to an already-Approved spec, not a new
Product Decision — goes through the standard UX Remediation cycle
(`ux-critic`, then `reviewer`'s Foundation-consistency pass) before folding
back into Approved status, same as HJR-INV-M1 above.

### decisions-d33-defaultprice-capture-and-price-edit
**`Product.defaultPrice` capture added at the exact moment a brand-new
Product name is created (§3.8a — or via Onboarding's "Define lo que vendes"
step, `onboarding.md` §2.2a, whichever comes first for a given Product), and
a Catalog-row-level edit affordance added for an existing Product's price
(§3.4a) — applies `decision-log.md` D33.** Required, no silent default,
unlike Cantidad's own deliberate default-to-1 treatment (§3.6, INV-Q1) — a
price has no honest guessable default. Never re-asked for an existing
Product, per D33's "resolved once, upstream" framing and
*global-principles.md*'s "never ask twice" — the exact discipline this
doc's own Elegir producto matching rule already established for Product
identity. The edit affordance reuses this document's own dimmed-backdrop
sheet shape (§3.8/§3.9) rather than inventing a new interaction, per
explicit instruction. Neither addition introduces any point-of-sale
discount, haggling, or per-transaction price override — out of scope by D33
itself, same boundary `home.md`/`events.md` observe.

### decisions-checked-against-home-q2-step3-test-no-shared-bug
**Checked against `home.md`'s corrected §2 step 3 test (2026-08-08,
`decision-log.md` D33) and found not to share its bug.** Inventario's
Catalog view carries no "something is sellable right now" promise the way
Home's "Iniciar Sesión Rápida" does — a zero-`disponibles` Catalog row is
already honestly labeled and fully tappable (§3.4), never a disguised dead
end. Left unchanged. The stale cross-reference claiming both tabs "read the
same fact" is corrected in §2 to state the two tests now deliberately
diverge, and why.

### decisions-zero-disponibles-sin-registrar-vs-sold-out
**A zero-`disponibles` Catalog row's caption now distinguishes "never
registered" from "sold out" (§3.4, applying identically to §3.5, §3.12,
§3.13, and §3.17 per that row shape's own "specified once, reused
everywhere" convention) — resolves a first-impression risk `ux-critic`
found in this document's D33/`onboarding.md` remediation.** Before
`onboarding.md`'s 2026-08-08 "Define lo que vendes" amendment, a Product
could never exist without an accompanying Lot, so a zero-`disponibles` row
only ever meant "previously stocked, now sold out." That amendment makes a
second, new meaning possible — "named in Onboarding, never stocked yet" —
and both rendered identically, with zero distinguishing copy: a real risk
for a merchant fresh out of Onboarding who taps the Inventario nav tab
directly rather than "Registrar mercancía," lands on the ordinary Catalog
view (§2 step 1's test is still satisfied), and sees every Product she just
named marked as if already sold out. Fixed by giving a never-stocked
zero-`disponibles` row its own caption, "sin registrar," derived
automatically from whether any Lot/InventoryEntry has ever been received
against that Product — no new stored field, no schema change. A
previously-stocked, now-sold-out Product keeps the existing "0 disponibles"
caption unchanged. Neither caption changes the row's dimming, tappability,
or destination (§3.6, prefilled) — copy only, in this document's own plain,
factual register (`events.md` §3.17's precedent).

### decisions-2026-08-14-d46-corrected-defaultsellingmode-gate
**Corrected 2026-08-14 (`decision-log.md` D46 — tag-assignment auto-entry
gates on merchant intent, not mere capability).** The bullet above ("After
Guardar mercancía, nfc-capable Businesses are taken directly into Asignar
Tags...") is superseded, not deleted — kept for the historical trail. The
actual gate, everywhere in this document (§2 steps 2–3, §3.5, §3.12, §3.13,
§3.14, §3.17, §4, §7), is now `Business.defaultSellingMode === 'nfc'` —
never `nfc ∈ registrationMode` alone. D46's own reasoning: `onboarding.md`
§2.3 already reasons that `defaultSellingMode` stays `buttons` at
Onboarding precisely because "she may be subscribing purely for the future
segmentation value, with no intention of using tags yet" — this document's
old trigger silently ignored that exact distinction it was written to
respect. Two new transitions are added in the same pass, fully specified:
(1) `settings.md` §2.6's "Cambiar a vender con tags" hands off directly
into this document's Asignar Tags queue (§3.14) the instant it succeeds, if
untagged inventory already exists — not scoped to a single Lot; (2) the
same action guides her to register merchandise first (§3.3a) if zero
InventoryUnits have ever been received for this Business — an empty
Asignar Tags queue is never shown as a landing state. NFC *availability*
(`nfc ∈ registrationMode`) is unchanged and still gates whether the
Assign-Tags mechanism exists in Inventario at all — this correction only
narrows *when Inventario proactively routes or nudges her into it*, never
whether the mechanism is reachable in principle.

### decisions-2026-08-14-d46-addendum-dependency-cycle-corrected
**Further corrected, same day (architect ruling — see D46's own Addendum).**
The two-bullet mechanism directly above originally had `settings.md`'s
action itself read Inventory-owned state (`InventoryUnit.status`/`tagId`) to
decide its own routing. `architect` ruled this would close a dependency
cycle: Inventory already depends on Identity (`domain-model.md`'s Bounded
Contexts table), so an Identity action reading Inventory state back would
add a return edge, violating `architecture-principles.md` #6. Resolved
without losing D46's own direct-auto-entry behavior: `settings.md`'s action
now only writes `defaultSellingMode` and hands off a bare entry marker; this
document's §2 gains a new, highest-priority trigger condition (step 0) that
performs the identical whole-Catalog check this document already
legitimately runs for its own, separate reason (step 2). One real, small
UX-surface delta results, not mandated or contradicted by D46's own text: an
already-fully-tagged merchant reached via this entry point now lands on
this document's own plain Catalog view (§3.4, "Inventory Ready") instead of
back on Configuración's own vista principal. **Corrected (`ux-critic`
finding SET-INV-D46-MAJ1):** landing here silently, with no explanation of
why she'd left Configuración, was itself an undisclosed consequence — §3.4
now carries its own one-time ambient acknowledgment for this exact entry
marker, mirroring the banner treatment already used for the sibling "named
Products, zero Lots" case on the same screen. §2 (new step 0), §3.3a, §3.4
(new banner), §3.14, §4, §6, §7 updated to match.
