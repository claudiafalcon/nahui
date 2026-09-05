# Onboarding — Amendment & Decision History

Companion file to `product/02-ux/onboarding.md`. This file holds the justification,
prior-state, and remediation-history prose that used to live inline in
`onboarding.md`'s status header and `## 10. Decisions made` section. `onboarding.md`
itself keeps only current-rule text and, for these two locations, a pointer back
here.

Anchors are prefixed `status-` (from `onboarding.md`'s status header) or
`decisions-` (from `onboarding.md` §10), to keep them unique within this file.
**One documented exception:** when a §10 batch's full reasoning already
lives inline in the spec itself rather than being extracted out to this
file (e.g. `status-2026-08-15-live-identity-preview`, whose entire
justification sits in `onboarding.md` §3.9b), those §10 bullets point back
to the single shared `status-` anchor instead of each getting their own
`decisions-` entry — there's nothing to elaborate here that isn't already
said, in full, at the source.

---

## Status-header history (from `onboarding.md`'s front matter)

### status-full-ux-remediation-cycle
**Applies to:** `onboarding.md` overall Approval.

Full UX Remediation cycle complete — `ux-critic`'s first-draft review found one
Blocker (ONB-B1: the demo path's framing implied a reversible preview when the
write is actually permanent and non-convertible) and one Major (ONB-M1: the
milestone screen was silently excluded from the interruption-resume contract),
both fixed by `ux-designer` and verified clean, plus three Minor findings also
addressed. `reviewer`'s Foundation-consistency pass found no Blockers; three
Important findings (an overbroad "never writes into Selling" claim, an unstated
seed-content minimum for the demo path's own stated purpose, and a stale
`events.md` §3.8 cross-reference — the last one a pre-existing drift also present
in `home.md`, fixed in both) — all corrected directly by Main. See
`product/02-ux/ux-critic-findings.md` for the full record.

### status-d27-nfc-capability-derivation
**Applies to:** `decision-log.md` D27 (NFC capability derived from `subscriptionTier`).

Amended for `decision-log.md` D27 (NFC capability corrected to derive from
`subscriptionTier`, not kit/code activation): the "Activar kit NFC" path — its
entire activation-code entry/validating/invalid-code mechanism (former
§3.4/§3.4a/§3.4b) — is retired. Replaced by "Activar plan de pago," a bare
payment-confirmation path (no code, no kit dependency) that grants
`subscriptionTier=paid` (and therefore `nfc` capability, derived per D27).
`defaultSellingMode` is now written as `buttons` unconditionally for both real
paths, never inferred from path choice — a reversal of this document's earlier
§2.3 resolution. Went through a coordinated three-document cycle (with
`home.md`/`settings.md`) — `ux-critic` found one Blocker (§3.6 Variant B's
milestone copy falsely implying automatic tag-selling once tagged) plus two
Major and three Minor findings, all fixed and verified. `reviewer`'s
Foundation-consistency pass found zero Blockers, one Important finding (stale
"two real paths" language in §9/§10 contradicting this document's own §2.2,
which correctly states three paths and a genuine two-way `subscriptionTier`
choice) — fixed directly by Main. Folded back into Approved.

### status-2026-08-08-define-lo-que-vendes
**Date:** 2026-08-08 (`decision-log.md` D33, Product Owner decision — "Define lo
que vendes" moved into Onboarding).

A new required step (§2.2a, §3.5b–§3.5e) captures the merchant's initial Selling
Groups (name + `Product.defaultPrice`) on both real paths, reusing Inventory's
own existing Product-creation write path rather than a second mechanism.
`architect` cleared this as architecturally clean (no RFC, no Foundation edit)
and flagged one required accompanying fix, applied in the same pass: `home.md`'s
cold-start test corrected from "Product ever registered" to "`available`
InventoryUnit exists," since this step breaks the equivalence those two facts
used to share. Two remediation rounds — round 1 found 2 Major (a stale branch
label in `home.md` §4's canonical wiring section; a new "never registered" vs.
"sold out" ambiguity on Inventario's Catalog view) + 1 Suggestion, all closed in
round 2. `ux-critic` verified clean across both rounds (zero Blockers, zero
unresolved Majors). `reviewer` clean (no Blockers; two Important
documentation-consistency findings, both fixed by Main — a missing
`ux-critic-findings.md` entry, and two stale `inventory.md` passages claiming
`defaultPrice` capture was unique to that document) — folded back into Approved.

### status-2026-08-08-business-identity
**Date:** 2026-08-08 (Product Owner decision, Business Identity captured at
Onboarding).

A new required step (§2.2b, §3.9–§3.10a) captures the merchant's own business
identity — `Business.name` (required), and optional `Business.logo`/
`Business.description` — on both real paths, positioned after §3.5's
Business/capabilities write succeeds and before the existing "Define lo que
vendes" step (§2.2a, §3.5b–§3.5e), never on the demo path. `architect` cleared
this as additive fields on the already-existing `Business` aggregate — no RFC,
no new bounded-context edge; `home.md` §3.8f's Digital Receipt is the real
consumer, now showing the merchant's own identity instead of "(marca Nahui)"
(see that document's own 2026-08-08 amendment). This pass also corrects a
rationale in §1 that became false the moment §3.8f became a real downstream
consumer of a Business-level field, and adds a new resume case to §2.1 parallel
to the existing "Define lo que vendes" one. Pending `ux-critic`/`reviewer`
review before folding back into Approved.

### status-2026-08-14-d46-tag-assignment-intent-correction
**Date:** 2026-08-14 (`decision-log.md` D46 — tag-assignment auto-entry gates on
merchant intent, not mere capability; correction surfaced by a Horizontal
Journey Review, not part of the original D46 cascade).

§3.6 Variant B's milestone copy, §2.3's reasoning, and §7's
automation-opportunities bullet all stated a now-impossible causal order — "once
she has tagged inventory, switch to `nfc` in Configuración" — accurate only
under the pre-D46 model, where auto-routing into tagging was gated on
`nfc ∈ registrationMode` (mere capability) and could fire regardless of
`defaultSellingMode`. Under the corrected D46 mechanism (`settings.md` §2.6;
`inventory.md` §2 step 0), there is no path to tagged merchandise while
`defaultSellingMode` still reads `buttons` — tagging only ever becomes reachable
after switching to `nfc` in Configuración, which either hands her directly into
tagging (untagged inventory already exists) or guides her to register
merchandise first (none exists yet). All three locations corrected to state the
true order. Copy/reasoning-only — no flow, state, or behavior changed beyond
wording. The matching React copy (`TodoListo.tsx`'s `paid` entry) was corrected
in the same pass. `ux-critic` re-verified clean — folded back into Approved.

### status-2026-08-15-live-identity-preview
**Applies to:** `onboarding.md` §3.9/§3.9a — new shared subsection §3.9b (live identity preview).

2026-08-15 (`frontend-design` audit, proposal #4 — live identity preview
added to "Tu negocio"): §3.9/§3.9a gain a new, non-interactive preview
element — a small, explicitly-labeled card reflecting how her typed
`Business.name` and/or selected `Business.logo` will actually render on the
real Digital Receipt (`home.md` §3.8f), updating live as she types or
selects a logo, positioned immediately above "Continuar" rather than
competing with the active field. New shared subsection §3.9b defines its
five screen states (empty, name-only, logo-only, clear/revert, failure
fallback), its accessibility behavior (never an announced live region), and
its visual differentiation from the real receipt (chrome/framing only, not
the type treatment). Sourced from
`product/02c-high-fidelity-prototype/docs/design-audit-2026-08-15.md`
proposal #4; grounded via a `knowledge-mentor` consultation — no existing
precedent in this document family for a live/as-you-type field-reflection
pattern (the two closest matches, this screen's own post-selection logo
thumbnail and `home.md` §3.11's pre-closing preview line, are both static,
never per-keystroke). `ux-critic` found one Major (placement reasoning never established the
preview would actually be seen in the dominant no-logo fast path) and one
Minor (the logo→name-only substitution wasn't called out on screen) — both
fixed same day: the placement section gained four new paragraphs closing
the layout half of the gap and explicitly logging the remaining
attention/noticing risk as new §8 item 8 (not fully closeable by layout
reasoning alone); state 3 gained its own persistent on-screen caption
("Tu nombre sigue guardado arriba. En tu recibo se muestra tu logo.").
`ux-critic` re-verified clean (both findings resolved; one trivial new
Minor surfaced by the fix itself — a stale "three text blocks" count not
accounting for state 3's new fourth caption — fixed in the same pass).
Pending `reviewer` before folding back into Approved.

---

## §10 "Decisions made" — full decision history

### decisions-three-onboarding-paths
**Three paths, named "Empezar gratis," "Activar plan de pago," and "Ver un
ejemplo"** — "Activar kit NFC" was replaced, not removed, by "Activar plan de
pago" (`decision-log.md` D27: `nfc` is now a pure derivation from
`subscriptionTier = paid`, and confirming payment is what sets that field — the
same two-real-paths shape as before, just with a corrected mechanism for the
second one). "Empezar gratis" reuses D19's own example wording verbatim; the
demo path's name and copy are this document's own contribution. **Renamed from
an earlier draft's "Ver un ejemplo primero":** "primero" linguistically implied
a second step — look first, then still pick a real path afterward — that never
existed anywhere in the flow (the write is immediate and irreversible, per
D19). Dropping the word removes the false implication instead of inventing a
followup step D19 already rules out.

### decisions-ver-un-ejemplo-confirmation-gate
**"Ver un ejemplo" is gated behind an explicit confirmation screen (§3.4c)
before its write happens, unlike either real path.** An earlier draft resolved
this path directly from the welcome screen's tap, styled as the
lightest-weight of the three options — which made the least-committal-looking
option also the one with the single most permanent, irreversible consequence.
§3.4c states the permanence/non-convertibility fact plainly before the write
and offers a genuine, zero-cost way to choose differently ("Mejor quiero
registrar mi negocio real") at the one moment doing so is still free —
mirroring the pause-point-with-escape-hatch shape the NFC path (§3.4) already
has.

### decisions-complete-narrower-than-capabilities-written
**Onboarding's "complete," for the specific purpose of §2.1's resume check, is
deliberately narrower than "capabilities written."** It also requires the
"Todo listo" milestone (§3.6) to have actually been dismissed. An interruption
while §3.6 is on screen resumes at that exact screen next time, rather than
silently skipping straight to Home and costing her the one screen this
document argues is worth deliberate ceremony. This is a one-time narrowing
scoped only to this resume check — it doesn't change when a Business's
capabilities are considered valid/usable anywhere else in the product.

### decisions-kit-prerequisite-subtext-removed
**The prerequisite subtext this document once carried on "Activar kit NFC"
("si ya tienes tu kit en mano") is removed along with the path itself**
(`decision-log.md` D27) — there is no longer a kit-possession prerequisite for
any Onboarding path to state, since kit possession was never actually what
granted `nfc` in the first place. The one no-charge reassurance that used to
accompany it ("no se te cobra nada aquí") is likewise removed — with no in-app
payment step anywhere in Onboarding, and no path that could be mistaken for
one, there is nothing left for that reassurance to be about.

### decisions-bracket-convention-consistency
**All tappable actions, including escape hatches and the demo path's entry
point, use the `[ ]` bracket convention consistently** — an earlier draft left
"Ver un ejemplo primero" and "No tengo el código a la mano" as unbracketed
text despite being tappable, breaking the convention `home.md`/`inventory.md`
establish.

### decisions-bienvenida-path-choice-merged
**Bienvenida and the path-choice screen are merged into one screen (§3.3)**,
not two — an earlier structure held them apart behind a "Comenzar" tap purely
to hold a welcome line; merging removes that tap without losing any warmth,
since the same copy reads identically sitting directly above the three
options.

### decisions-defaultsellingmode-buttons-automatic
**`defaultSellingMode` resolves automatically to `buttons` for both real
paths, with no separate confirmation question ever asked** (§2.3) — a
reversal of the earlier draft's "Activar kit NFC" bullet, which used to derive
it from path choice. A real Onboarding path can never set
`defaultSellingMode = nfc`: `nfc` only exists once `subscriptionTier = paid`
(`decision-log.md` D27), and even "Activar plan de pago" writes `buttons`
unconditionally, since a merchant confirming payment has zero tagged
inventory yet either way (§2.3). The demo path is the sole exception, seeded
directly at `nfc` alongside its seeded `paid` tier (§2.2) — never chosen
through a question either.

### decisions-subscriptiontier-two-way-choice
**`subscriptionTier` is a genuine two-way choice at Onboarding, expressed
entirely through which real path she taps** (§2.2) — not a live "gratis / de
paga" picker, but not a single forced value either: "Empezar gratis" writes
`free`, "Activar plan de pago" writes `paid`. This corrects an earlier
draft's reasoning, which held that no honest paid option could ever be
offered at first run — true of Segmentation specifically (real data still
requires real Claims to accumulate, regardless of path), but not of `nfc`,
which `decision-log.md` D27 makes an immediate, history-independent
Paid-tier benefit. **Frequent Customers itself is no longer a separate value
this table tracks at all** (`decision-log.md` D40) — "Activar plan de pago"
makes it available the instant `subscriptionTier=paid` is written,
automatically, the same way it makes `nfc` available.

### decisions-no-activation-code-machinery
**No activation-code entry/validation machinery exists anywhere in this
document any longer.** The earlier draft's §3.4 (ingresar código), §3.4a
(validando), and §3.4b (código inválido) screens existed solely to confirm
possession of a physical kit as the mechanism that granted `nfc` — per
`decision-log.md` D27, that mechanism never existed at the domain level to
begin with: `nfc` is derived purely from `subscriptionTier = paid`, never
confirmed by a code, a kit, or any other artifact. Removing this machinery
isn't a simplification of an existing flow; it's the removal of a flow this
document should never have specified once the underlying capability model is
understood correctly. The welcome tag package she may eventually receive is
fulfillment logistics only (D27) and has no Onboarding-facing screen of any
kind.

### decisions-demo-path-richest-capability-seed
**The demo path is seeded at the richest capability combination** (`nfc`,
`paid`) — deliberately different from either real path, so the seeded sales
history can stand in for the real history a genuine merchant hasn't built
yet, letting her see the full experience honestly rather than a partial one.
`loyaltyEnabled` no longer exists as a separate value to seed
(`decision-log.md` D40) — Frequent Customers is simply present the instant
`paid` is, and the seed's own Claim history (§11) is what makes "Tus
clientes" render populated rather than empty.

### decisions-no-preopened-session-handoff
**No path ever hands off into a pre-opened Session** — including the demo.
Every path ends at Home's own idle or cold-start state; she always taps
"Iniciar Sesión Rápida" (or "Continuar Día N") herself, exactly like a real
merchant would, preserving *architecture-principles.md* #6.

### decisions-no-persistent-nav-bar
**No persistent bottom nav bar during any Onboarding screen** — a deliberate
deviation from every other document in this family, since a Business's
capabilities don't exist yet for the four tabs to resolve into; showing them
would be a false affordance.

### decisions-todo-listo-milestone-ceremony
**The "Todo listo" milestone screen (§3.6) is the one deliberate moment of
ceremony in an otherwise frictionless flow** — justified specifically because
it happens exactly once, ever, in Ana's whole relationship with the app;
auto-continuing (rather than requiring a tap) keeps it from becoming genuine
friction for a merchant who just wants to get moving.

### decisions-shared-creando-negocio-write-state
**A shared "Creando tu negocio" write state (§3.5) covers all three paths**,
including the demo's data-seeding — deliberately not given its own more
elaborate "building your example" sequence, since a longer wait than
necessary would be padding, not honesty.

### decisions-todo-listo-cta-entrar-rename
**Todo listo's CTA renamed from "Empezar" to "Entrar," uniformly across all
three variants (§3.6) — Horizontal Journey Review remediation.** "Empezar
gratis" (§3.3) and the milestone's own CTA shared the same verb two screens
apart, reading as "start... start" rather than two distinct actions — caught
by the Product Owner's own walkthrough of the free-tier path. §3.3's three
path CTAs are unchanged: they're genuinely about *choosing* which path to
begin. The milestone CTA is a different moment — her Business and
capabilities already exist (§3.5's write already succeeded) by the time she
reaches Todo listo; what's left is entering the app, not starting anything a
second time. Checked against all three variants for collision; none found.

### decisions-define-lo-que-vendes-added
**"Define lo que vendes" (§2.2a, §3.5b–§3.5e) added 2026-08-08, Product Owner
decision, `decision-log.md` D33.** Moves the merchant's initial Selling
Groups (name + `defaultPrice`) from being captured only inline during
Inventario's Registrar Mercancía flow to being their own required step
inside Onboarding, on both real paths — matching the Product Owner's read of
Ana's actual mental model ("this is my business, this is what I sell, these
are my prices," established before she ever thinks about the operational act
of receiving inventory). `architect` confirmed this needs no Foundation
change: no new aggregate, no new bounded-context edge (Onboarding invoking
Inventory's own Product-creation write path is the identical shape D29
already established for cross-context UX orchestration, and one this
document's own §2.4 already exercises for the demo path's seed data), no
ubiquitous-language redefinition.

### decisions-selling-group-required-not-skippable
**Required, not skippable — at least one Selling Group before "Todo listo,"
for both real paths, never for the demo path.** Reasoned explicitly in
§2.2a, not assumed: a Business set up to sell nothing isn't a working
Business; Producto/Precio are the least technical, most business-native
facts this document could ask, the identical vocabulary `inventory.md`
already uses; making it skippable would reopen the three-way handoff
ambiguity §2.4 now closes into a clean two-way state.

### decisions-flat-producto-precio-row-simpler-than-inventory
**Deliberately simpler than `inventory.md`'s own two-step "Elegir producto →
nuevo producto, precio inicial" shape** — one flat Producto+Precio row,
since a first-run Catalog is guaranteed empty (§2.2a), so the
existing-vs-new ambiguity Inventario's picker exists to resolve can never
arise here. Not an inconsistency between the two documents; each shape is
correct for what its own Catalog state can actually contain.

### decisions-resume-check-extended-define-lo-que-vendes
**§2.1's resume-check guarantee (already narrower than raw "capabilities
written," per the existing "Todo listo dismissed" bullet above) is extended
one step further, through the new Define lo que vendes step** — an
interruption mid-step resumes with every already-committed Selling Group and
the still-active row's typed values intact, never re-asked, the same
discipline `inventory.md` §3.7 already applies to its own in-progress
Registrar Mercancía draft (§3.7).

### decisions-section-1-2-4-corrected-for-define-lo-que-vendes
**§1's "establish a Business and its initial capabilities... Nothing else"
and §2.4's "Catalog is genuinely empty" handoff description were both
corrected to stay accurate** once this step existed — the former to name
the one precisely-scoped exception this document now carries (Product/
`defaultPrice`, not identity/profile fields, which stay correctly excluded
for the reason already stated); the latter to describe the real
post-Onboarding state (named Products, zero stock) rather than a literally
empty Catalog.

### decisions-home-cold-start-test-corrected-cross-reference
**`home.md`'s §2 step 3 cold-start test was corrected in the same pass**
(that document's own 2026-08-08 amendment, not repeated here) — from "at
least one Product ever registered" to "at least one `available`
InventoryUnit exists," since this step breaks the equivalence between those
two facts that held only as long as Product creation was exclusively
inline-during-receiving. `inventory.md`'s own equivalent test was checked
and found *not* to share the bug — see that document's own §2/§10 for the
reasoning.

### decisions-tu-negocio-identity-capture-added
**"Tu negocio" identity capture (§2.2b, §3.9–§3.10a) added 2026-08-08,
Product Owner decision.** Positioned after §3.5's Business/capabilities
write succeeds and before §2.2a's "Define lo que vendes" step, on both real
paths, never on the demo path — matching the Product Owner's explicit
sequencing: identity first, then what she sells. `architect` confirmed this
needs no Foundation change: `Business.name`/`Business.logo`/
`Business.description` are additive fields on the already-existing
`Business` aggregate, no new aggregate, no new bounded-context edge, no
ubiquitous-language redefinition.

### decisions-business-name-required-logo-description-optional
**`Business.name` required, `Business.logo`/`Business.description` fully
optional with zero required taps to skip — reasoned individually in §2.2b,
not defaulted to a uniform treatment.** Name has no honest default, the
same class of required field Producto/Precio already are (§2.2a). Logo and
description are captured because the Product Owner named them, but neither
gates progress nor requires an explicit skip tap — leaving them blank is
simply not filling them in, the same shape every other genuinely optional
value in this product already takes.

### decisions-no-logo-path-first-class
**The no-logo path is designed as fully first-class, not a lesser option —
deliberate, not incidental.** Most merchants likely don't have a digital
logo ready; §3.9's screen carries no visual or copy cue marking that state
as provisional, incomplete, or something to come back to. No "Ahora no"
escape-hatch-style control exists for the logo specifically, because it was
never gating anything an escape hatch would need to release her from.

### decisions-bring-identity-in-not-create-one
**Explicitly "bring an existing identity in," not "create one" — no logo
generation, no design/branding tooling, no color picker, no
cropping/editing.** A bare device-upload-or-skip affordance only (§3.9),
per the Product Owner's own framing, carried through directly into scope
rather than softened into a lighter-weight editing surface.

### decisions-identity-capture-own-write
**Identity capture gets its own write (§3.10/§3.10a), not folded into
§3.5's atomic Business/capabilities write — reasoned explicitly against
defaulting to "new screen, new write" (§2.2b).** The Product Owner's own
sequencing (identity is reached only after §3.5's write has already
succeeded) rules out folding by itself; `decision-log.md` D30's per-write
idempotency-key requirement, and this exact document's own precedent for
§2.2a's identically-shaped second write, both independently point the same
direction.

### decisions-no-knowledge-mentor-consultation-device-upload
**No `knowledge-mentor` consultation was requested for the device-upload
affordance itself — reasoned explicitly in §2.2b as a composition of two
already-precedented primitives (tap-to-trigger, committed-item-with-remove),
not a genuinely novel interaction pattern.** Flagged for `ux-critic`/
`reviewer` to challenge if that reasoning doesn't hold, since this
document's own tooling has no way to request that consultation directly.

### decisions-section-1-exclusion-rationale-corrected
**§1's exclusion rationale for profile-style fields corrected, not merely
restated, alongside this amendment.** The prior wording ("none of those
fields is ever read by any downstream resolution logic") became false the
instant `home.md` §3.8f became a real consumer of `Business.name`/
`Business.logo` — corrected to state precisely what still separates the
fields this document continues to exclude from the two it now carries: not
"nothing reads them," but "no downstream logic reads *them specifically*."

### decisions-resume-check-case-4-identity
**§2.1's resume-check state machine gains a new case (case 4), parallel to
the existing "Define lo que vendes not yet complete" case (now case 3), and
every other case's "complete"/"already written" language is widened to
include identity.** Same discipline already applied when §2.2a's own step
was added — an interruption mid-capture gets its own defined, exact resume
point, never a restart.

### decisions-home-receipt-shows-merchant-identity-cross-reference
**`home.md` §3.8f's receipt now shows the merchant's own identity instead
of Nahui's own mark — designed jointly with this amendment, decided and
reasoned in that document's own §10, not repeated here.** Named explicitly
in both documents as a real product/brand decision, not an incidental
consequence of a new form field existing.

### status-2026-09-04-q20-initial-quantity
**`product/02-ux/product-decisions.md` Q20 (Product Owner decision, resolved
2026-08-27, persisted 2026-09-04): initial inventory quantity now captured
at the same moment a Product is created in Onboarding, for both real paths,
universally.** §2.2a's "Define lo que vendes" step gains a third field
(Cantidad, reusing `inventory.md` §3.6's own field-level treatment
verbatim) and the underlying write is upgraded from a bare `createProducts()`
Product-only write to the same `commitLot()`-shaped atomic write (Product +
Lot + InventoryEntry + InventoryUnit) `inventory.md`'s Registrar Mercancía
already performs — composing cleanly onto an existing mechanism per the
architect finding already on record at `product-decisions.md` Q20, not a
new write pattern. Both real paths' Home handoff (§2.4) changes from Home's
cold start to Home's idle state, since a newly onboarded Business now
starts with real, available stock rather than a named-but-empty Catalog.
`inventory.md`'s "sin registrar" distinction is narrowed to a legacy-data-
only case as a direct consequence (see that document's own changelog).
Touched: §1 (one corrected sentence), §2.2a, §2.4, §3.5b–§3.5e, §3.6 Variant
A, §4, §6, §7, §8 item 5, §10. `ux-critic`/`brand-guardian` both clean, no
findings against this document.

### decisions-q20-batch-2026-09-04
**Four decisions recorded together as part of the Q20 amendment above, not
independently:** (1) Cantidad added to "Define lo que vendes," reusing
`inventory.md` §3.6's field treatment verbatim; (2) the underlying write
upgraded to `commitLot()`'s shape, per the architect finding at
`product-decisions.md` Q20 — `createProducts()` becomes unused by any real
(non-legacy) flow, an implementation cleanup question for `builder`/
`ui-designer` at build time, not decided here; (3) both real paths' Home
handoff changes from cold start to idle state, a mechanical consequence of
(2), not an independent redesign of `home.md`'s own resolution logic; (4)
`inventory.md`'s "sin registrar" distinction is narrowed to a legacy-data-
only case, cross-referenced rather than restated here.
