# Inventario — UX Specification

Status: Approved. Full UX Remediation cycle complete — INV-M1, INV-M2,
INV-M3. **[Amended 2026-08-14 — see
inventory.changelog.md#status-full-ux-remediation-cycle]**

**Amended for `decision-log.md` D23** (Session-scoped selling mode — see
`product/99-rfc/0003-session-selling-mode.md`): cross-reference and
terminology only, no redesign. **[see
inventory.changelog.md#status-d23-session-scoped-selling-mode]**

**Amended 2026-08-04 (INV-Q1, Product Owner-raised):** Cantidad now
defaults to 1 (was blank) with an explicit tap-affordance requirement and a
"revisa antes de guardar" marker on the unreviewed default, carrying into
the §3.7 committed-lines list. **[see
inventory.changelog.md#status-2026-08-04-inv-q1-cantidad-default]**

**Amended 2026-08-04 (icon/comprehension audit):** §3.4's Catalog rows now
carry the same per-Product marker `home.md` §3.9 introduces, and a
zero-`disponibles` row now renders dimmed while staying fully tappable —
applied identically to §3.5/§3.12/§3.13/§3.17. **[see
inventory.changelog.md#status-2026-08-04-icon-comprehension-audit]**

**Amended 2026-08-06 (Horizontal Journey Review, HJR-INV-M1):** the
on-screen heading at §3.6/§3.7 (and §3.8's dimmed backdrop) changed from
the imperative "Registrar mercancía" to the noun-form "Registro de
mercancía," differentiating it from the identically-worded CTA that leads
to it. No flow, state, or behavior changed — copy-only. **[see
inventory.changelog.md#status-2026-08-06-hjr-inv-m1-heading]**

**Amended 2026-08-07 (Product Owner-directed refinement to §3.5/§3.17,
task-priority drift):** in the pending-tags Catalog-view state, "Continuar
etiquetando" is now the primary action, positioned directly under the
header, and "Registrar mercancía" is now explicit, in prose, as secondary
in that one state only — same position, same behavior, never gated. **[see
inventory.changelog.md#status-2026-08-07-task-priority-refinement]**

**Amended 2026-08-08 (`decision-log.md` D33, MVP pricing operating
model):** `Product.defaultPrice` capture added at Product creation (new
§3.8a) and a Catalog-row-level price-edit affordance added (new §3.4a).
**[see inventory.changelog.md#status-2026-08-08-d33-mvp-pricing]**

**Amended 2026-08-08 (`decision-log.md` D33, "Define lo que vendes" moved into Onboarding):** a zero-`disponibles` Catalog row now distinguishes "sin registrar" (never had a Lot received) from "0 disponibles" (previously stocked, sold out). Copy-only, no schema change, applied identically to §3.4/§3.5/§3.12/§3.13/§3.17. **[see inventory.changelog.md#status-2026-08-08-define-lo-que-vendes]**

**Amended 2026-09-04 (`product/02-ux/product-decisions.md` Q20 — initial inventory quantity now captured at Onboarding itself):** the "sin registrar" caption introduced by the amendment above is narrowed to a legacy-data-only case — `onboarding.md`'s "Define lo que vendes" step no longer produces a named-but-unstocked Product for any real, freshly-onboarded merchant, since it now writes real stock in the same interaction (`onboarding.md` §2.2a). Copy-only, no schema change, applied identically to §3.3a/§3.4 (the only two sections whose reasoning depended on the pre-Q20 assumption; §3.5/§3.12/§3.13/§3.17 inherit the correction automatically, since they only ever reference §3.4's own row definition, never restate it). **[see inventory.changelog.md#status-2026-09-04-q20-legacy-sin-registrar]**

**Amended 2026-08-14 (`decision-log.md` D46 — tag-assignment auto-entry
gates on merchant intent, not mere capability):** every auto-entry/pending-
nudge trigger into Asignar Tags in this document is corrected from `nfc ∈
registrationMode` (NFC *availability*) to `Business.defaultSellingMode ===
'nfc'` (her actual, self-service-chosen selling-mode intent, `settings.md`
§2.2). A new entry point (new §3.3a) guides her to register merchandise
first when `settings.md` §2.6's "Cambiar a vender con tags" succeeds with
zero InventoryUnits ever received for this Business — an empty tagging
queue is never shown as a landing state. NFC availability itself, and its
own separate gate on whether the Assign-Tags mechanism exists in Inventario
at all, are unchanged. **[see
inventory.changelog.md#status-2026-08-14-d46-tag-assignment-intent-gate]**

**Further corrected, same day (architect ruling — see `decision-log.md`
D46's own Addendum):** `settings.md`'s "Cambiar a vender con tags" action
only writes `defaultSellingMode` and hands off a bare entry marker — never
a queried Inventory fact — avoiding the dependency cycle
`architecture-principles.md` #6 forbids (Inventory already depends on
Identity, `domain-model.md`'s Bounded Contexts table). This document's own
§2 gains a new, highest-priority trigger condition (step 0) that performs
the identical whole-Catalog untagged-inventory test step 2 already runs:
untagged inventory exists → auto-enter §3.14, seeded whole-Catalog; already
fully tagged → falls through to steps 1-2 and lands on the plain Catalog
view (§3.4, "Inventory Ready"); zero InventoryUnit ever received → falls
through to step 1 and lands on §3.3a. **[see
inventory.changelog.md#status-2026-08-14-d46-addendum-dependency-cycle-fix]**

**Amended 2026-09-06 (`product/02-ux/product-decisions.md` Q23, Product Owner decision — optional `Product.photo`):** a new optional Foto field added to "nuevo producto" (§3.8a); a new Catalog-row-level "Editar foto" sheet (§3.4b) lets her add, change, remove, or inspect an existing Product's photo at a larger size; the Catalog row's per-Product marker (§3.4) now renders a photo thumbnail in place of the initial letter whenever one is set, and the row's three tap zones (marker, body, price) are now explicitly disambiguated. `ux-critic` found 2 Major (this document's own tap-zone ambiguity; no fallback for a photo failing to render later) + 5 Minor, all remediated in one round; verification pass found 2 further trivial Minor (unbracketed markers in §3.5/§3.12/§3.13/§3.17, closed directly by Main) — `ux-critic` clean. `reviewer` found 1 Important (missing `decision-log.md` D54 entry for `Product.photo`, closed). Folded back into Approved — see `inventory.changelog.md#status-2026-09-06-q23-product-photo`.

**Amended 2026-09-13 (`decision-log.md` D65 — phone-camera barcode
scanning, `Product.barcode`):** a second way to resolve Producto added to
Elegir producto (§3.8) — "Escanear código de barras," alongside the
existing typed-name search, never replacing it. New §3.8b (camera view),
§3.8c (confirm-on-scan when a barcode matches an existing Product —
deliberate, reasoned exception to this picker's own "never ask twice"
resolution, see §10), §3.8d (camera permission denied), §3.8e (scan
failed to read). §3.8a gains a "vía escaneo, sin coincidencia" variant —
the scanned barcode is captured silently, attached to the same
Product-creation write, never asked for separately; she still types the
Product's name herself, since a barcode carries no name and Nahui does no
external lookup (D65). `Product.barcode` may only ever be written from
this document's own Registrar Mercancía flow — Selling reads it read-only
(`home.md` §3.9a/§3.9b, `architecture-principles.md` #6). `ux-critic`
found 2 Major + 3 Minor (fixed in one round, re-verified clean — see
`ux-critic-findings.md`). `reviewer` found 0 Blockers (2 Important
documentation-persistence gaps — this missing `ux-critic-findings.md`
entry, and §3.9's now-stale "only two confirmations" count — both closed
directly by Main; 1 Suggestion, the Free/Paid-tier open item logged to
`company/business-decisions.md`). Folded back into Approved. **[see
inventory.changelog.md#status-2026-09-13-d65-barcode-scanning]**

**Amended 2026-09-13 (`company/business-decisions.md` Q20 resolved, Product Owner) — barcode scanning gated Paid-tier only, same gating class as NFC/Frequent Customers/multi-staff SELLER accounts (`decision-log.md` D27, D34, Q18).** §2 gains a new capability-derivation paragraph gating "Escanear código de barras" (§3.8) and its full sub-flow (§3.8a's scan variant, §3.8b–§3.8e) on `Business.subscriptionTier = paid`, resolved once as part of Inventario's own tab-level state load — never per-scan. §3.8 gains a Free-tier wireframe variant (picker minus the scan row, nothing in its place); §3.8a/§3.8b/§3.8c/§3.8d/§3.8e headers marked Paid-tier-only; §4/§5/§10 corrected to match. No discoverability/upsell copy designed for Free tier — grounded directly in this document family's own precedent (`settings.md` §2.7's "Tu equipo," absent entirely on the Free-tier vista principal; this document's own Assign-Tags gate, absent entirely when `nfc ∉ registrationMode`), not the different `reports.md` "con el plan de pago vas a ver…" pattern, which serves a data-summary context this picker doesn't share. Closes the "Free/Paid-tier open item" this document's own D65 review round logged to `company/business-decisions.md`. `ux-critic` found 0 Blockers/Major/Minor (1 Suggestion, applied directly). `reviewer` found 0 Blockers (3 Important documentation-persistence gaps — two wrong precedent-citation section numbers, a missing `ux-critic-findings.md` entry — all closed directly by Main). Folded back into Approved. **[see inventory.changelog.md#status-2026-09-13-q20-barcode-scanning-paid-tier-gate]**

**Amended 2026-09-16/17 (`decision-log.md` D65, live production defect, Product Owner-confirmed — expedited pass) — a write path to correct a misread `Product.barcode` added.** D65's write-path rule restricts this field to Inventory alone (never Selling) but, until now, offered no way to *correct* an already-captured value — `types.ts`'s own doc comment states it plainly: captured silently, exactly once, at first-scan-to-new-Product resolution, never cleared or reassigned by any other write path. That absence is the direct cause of a real, live defect: a barcode misread once at registration permanently blocks every subsequent, correctly-read scan of that same physical product from matching, with no way for Ana to fix it. New Catalog-row overflow affordance ("⋯", a fourth row-level tap zone alongside marker/body/price — §3.4) opens "Editar código de barras" (new §3.4c), showing the Product's current `barcode` (or "Sin código") and letting her capture a fresh value via "Volver a escanear" (reusing §3.8b's camera mechanism — the same `BarcodeScanner.tsx` component, no new camera surface — new §3.4d). The fresh value is staged, never written until "Guardar código de barras," which then replaces the stored value outright — no merge, no history — matching this document's existing Editar precio/Editar foto posture (§3.4a/§3.4b). A freshly-scanned code that already belongs to a *different* existing Product is caught before it can be staged (new §3.4e, extending §3.15's "identifier already claimed by someone else" pattern and §3.8c's recognition-display convention) — she's shown which Product already holds it and offered to rescan or cancel, never a silent overwrite, never an automatic reassignment away from the other Product. Camera permission-denied/read-failed variants (§3.4f/§3.4g) reuse §3.8d/§3.8e verbatim, adapted only in their fallback destination (back to this sheet, not a typed-search field, since none exists here). Gated identically to §3.8's own barcode-scanning gate — Paid tier only (`company/business-decisions.md` Q20); a Free-tier Catalog row keeps its existing three tap zones, nothing added. **Write-path amendment only** — Selling's read-only scan resolution (`home.md` §3.9a family) and the original registration-time capture (§3.8a–§3.8e) are both completely untouched. **Expedited given live production impact — this pass has not gone through `ux-critic`/`reviewer` before being handed off to `ui-designer`; standard review pipeline deferred, not skipped.** No new `decision-log.md` entry needed — D65 already owns `Product.barcode`'s field/uniqueness rule, this only adds a second Inventory-owned write surface to it, alongside the existing Registrar Mercancía capture point.

**Amended 2026-09-16/17 (`decision-log.md` D71, `product/02-ux/product-decisions.md` Q31 — NFC becomes a per-product opt-in composing with buttons/barcode) — two real, substantive changes, not a footnote.** (1) A new, fifth Catalog-row tap zone — a compact NFC-eligibility switch — is added (§3.4), visible only when `Business.nfcPerProductEnabled = true` AND `nfc ∈ registrationMode` AND this Product has no `Product.barcode` (mutual exclusivity per D71: barcode-identified and NFC-tagging-eligible are never both true for the same Product). Toggling it writes `Product.nfcTaggingEnabled` directly, with its own near-instant/slow/error save discipline, composing this document's own existing dimmed-row save convention (reused from `settings.md` §3.9) with its own existing four-zone row architecture — no new interaction pattern invented, no `knowledge-mentor` consultation needed. A genuine mutual-exclusivity edge this amendment resolves explicitly rather than leaving dangling: assigning a fresh barcode via the existing §3.4c "Editar código de barras" sheet on a Product currently `nfcTaggingEnabled = true` now also clears that flag at the same moment `barcode` is written — enforcing D71's own "never both" rule going forward, while leaving any already-tagged unit of that Product exactly as tagged and sellable as it was (the identical "never untag/orphan, only future eligibility stops" invariant `settings.md` §2.8 states for the Business-level toggle, applied here at the Product level for the first time). (2) §2's Asignar Tags resolution (steps 0, 2, 3) and every dependent state (§1, §3.5, §3.12, §3.13, §3.14, §3.17, §7, §9) are corrected from a pure `Business.defaultSellingMode === 'nfc'` gate to a new composed **NFC-tagging-eligible** test — `defaultSellingMode === 'nfc'` (legacy, whole-Catalog, unchanged) **OR** (`Business.nfcPerProductEnabled === true` AND this unit's `Product.nfcTaggingEnabled === true`) — so a freshly-received Lot of Plumas or Cerveza is never offered for tagging, even on an NFC-capable, `nfcPerProductEnabled = true` Business, exactly as D71 requires. A mixed-Product Lot (e.g., Camisas + Plumas registered in one Guardar mercancía) now seeds Asignar Tags with only its NFC-tagging-eligible lines' units, never the whole Lot — a real, new per-Lot filtering behavior, not only a per-Business gate correction. §3.12/§3.13's own post-save routing, and §3.13's completion copy for a mixed Lot, are corrected to match. Every place this document previously said "every untagged unit... Product-agnostically" is corrected to the composed test — checked across the whole document, not only §3.14's own auto-entry (§1, §2, §3.5, §3.14, §3.17, §7, §9 all touched). `home.md`/`events.md` are untouched by this pass — a parallel dispatch is designing those against the same D71 ruling. **This pass went through a full `architect` review (`decision-log.md` D71), unlike some of tonight's earlier live-bug-fix passes — `ux-critic`/`reviewer` review is pending, to be run before/alongside build if time allows.**

Scope: `Inventario`, the second of four top-level nav items per
`product/00-foundation/information-architecture.md`. Covers the first three
steps of the merchant workflow chain in `product/00-foundation/vision.md`
("Receive Merchandise → Register Lot → (Optional) Assign NFC Tags →...",
which continues on to Schedule Event/Sell beyond this doc's scope). "Inventory
Ready" below is this doc's own shorthand for "these three steps are done," not
a term sourced from `vision.md`. Implementation-independent — low-fidelity
only, no visual design.

Out of scope by explicit instruction (`company/CLAUDE.md`, `domain-model.md`
"Deliberate exceptions," `architecture-principles.md` #5, `decision-log.md` D9):
no Supplier screen, no cost/margin display anywhere. See §8, item 1, for a
wording conflict this surfaced in `information-architecture.md` (since fixed).
This exclusion covers `InventoryEntry.cost`/Supplier only (`decision-log.md`
D9) — Ana's own purchase cost, which stays completely invisible in this
document, unchanged. It does **not** extend to `Product.defaultPrice`
(`decision-log.md` D33) — the price Ana *charges* a customer, a distinct fact
this document now captures at Product creation (§3.8a) and lets her edit
per-Product (§3.4a). Selling price and purchase cost are unrelated facts on
unrelated aggregates; one being newly in scope doesn't reopen the other.

## 1. Merchant goal

Inventario is not where Ana spends her selling day — it's where she gets ready
for it. Unlike Home, there's no customer standing in front of her while she
uses this tab; the pressure here is different in kind, not just degree. Two
real contexts:

- **Merchandise just arrived** (at home, in the car, between bazares): she
  needs to get it "into the system" — counted, ready to sell — without it
  feeling like paperwork. She already did the hard part (buying it, hauling
  it); Inventario's job is to not make her repeat that effort in a form.
- **Checking what she has** (deciding what to bring to the next bazaar, or
  reassuring herself she still has stock of something): a fast, honest glance
  at "what do I have and how much," nothing more.

A distant third, for merchants whose stock is currently NFC-tagging-eligible — either because `defaultSellingMode = 'nfc'` (her whole Catalog), or because `Business.nfcPerProductEnabled = true` and she's opted specific, barcode-less Products into NFC individually (`decision-log.md` D71, `product-decisions.md` Q31): physically walking through a stack of new garments attaching tags — a one-time-per-unit task that happens once, at receiving time, never again during selling (`vision.md`: "the merchant never switches between them while selling"). NFC *availability* (`nfc ∈ registrationMode`, `subscriptionTier = paid`) is a separate fact from either of these — a Paid merchant who keeps `defaultSellingMode = 'buttons'` and never turns on `nfcPerProductEnabled` never has this "distant third" task appear at all, by design (`decision-log.md` D46/D71). **A merchant with a genuinely mixed Catalog — some Products sold with tags, most sold with buttons or barcode (Ana's own worked scenario, `product-decisions.md` Q31) — experiences this task only for the specific Products she's opted in, never for the rest of what she registers in the same visit.**

Registration speed here is real but not the same bar as Home's. `company/backlog.md`
#1 and `company/CLAUDE.md`'s core thesis are specifically about *sale*
registration under unpredictable customer flow — Inventario has no customer
waiting, so a few extra seconds per product line is an acceptable cost of
capturing real information, not a friction to hunt down artificially. What
still applies, undiminished: never make her repeat a count she already typed,
never lose it to an interruption, and never talk down to her about a task
(counting her own merchandise) she already knows how to do better than the
app does.

## 2. Resolution / decision logic

Before any of the following resolves, the tab itself must load its own state
(Catalog membership, `nfc ∈ registrationMode`, `Business.subscriptionTier` —
also gating barcode-scanning availability, see below — `defaultSellingMode`,
pending tag counts) — this can
fail or take longer than expected under real bazaar/car/between-stalls
connectivity, same as every other tab. See §3.1/§3.2 for the near-instant/slow
presentation of that load, and §3.18 for the defensive fallback if it doesn't
resolve at all. The four numbered steps below assume that load has already
succeeded.

Evaluated automatically, every time Inventario is opened or a sub-flow
completes:

```
0. [Reached via Settings' "Cambiar a vender con tags" — an entry marker
   only, never a fact `settings.md` itself computes or reads] Does at
   least one InventoryUnit exist with status = available, no NFCTag
   assigned, and NFC-tagging-eligible (see the composed test below),
   anywhere in the Catalog (the identical whole-Catalog check step 2
   already performs)?
     → YES: auto-enter Asignar Tags (§3.14) directly, seeded with every
       NFC-tagging-eligible untagged unit across the whole Catalog — not
       scoped to one Lot, unlike step 3's Lot-scoped seed — no
       intermediate landing on §3.5.
     → NO: fall through to steps 1-2, exactly as already written below.

1. Does the Catalog have at least one Product ever registered?
     → NO:  cold-start empty state (§3.3).
     → YES: Catalog view (§3.4 / §3.5).

2. [Catalog view] Does at least one InventoryUnit exist with status =
   available, no NFCTag assigned, and NFC-tagging-eligible (see the
   composed test below)?
     → YES: pending-tag-work Catalog view (§3.5) — "Continuar etiquetando" is
       the primary action in this state (non-blocking, resumes Asignar Tags
       exactly where she left off); Registrar mercancía remains fully
       available as a secondary action, never gated.
     → NO: plain Catalog view (§3.4).

3. [Inside Registrar Mercancía, after "Guardar mercancía"] Does this Lot
   contain at least one InventoryUnit that's NFC-tagging-eligible (see
   the composed test below)?
     → YES: auto-enter Asignar Tags (§3.14), seeded with only this Lot's
       NFC-tagging-eligible units — never the whole Lot, when the Lot
       mixes eligible and non-eligible Product lines in one commit — no
       intermediate question asked.
     → NO (no line in this Lot is NFC-tagging-eligible): return to
       Catalog view with an ambient confirmation (§3.12) — done,
       Inventory Ready, nothing further required.

4. [Inside Asignar Tags] Does this Lot still have any InventoryUnit
   without a tag, among the ones actually seeded into this queue?
     → YES: keep the scan prompt active (§3.14).
     → NO: complete — return to Catalog view, "lista para vender"
       confirmation (§3.13, including its own mixed-Lot copy variant
       when applicable).
```

**NFC-tagging-eligible — the composed test every step above now uses (new, `decision-log.md` D71, `product-decisions.md` Q31).** An `InventoryUnit` is NFC-tagging-eligible iff:

`Business.defaultSellingMode === 'nfc'` **OR** (`Business.nfcPerProductEnabled === true` **AND** this unit's `Product.nfcTaggingEnabled === true`)

The first disjunct is the original, unchanged D46 rule — a Business selling her whole Catalog with tags, unaffected by anything in this amendment. The second is new: a Business that keeps `defaultSellingMode = 'buttons'` (her actual majority mode, in Ana's own worked scenario) but has opted specific, barcode-less Products into NFC individually (`settings.md` §2.8, `inventory.md` §3.4's own new per-Product toggle below) now also qualifies, Product by Product, never whole-Catalog. **This composed test deliberately collapses back to the original rule for any Business that never turns on `nfcPerProductEnabled`** — the second disjunct is always false, so nothing changes for her; this is a real, stated backward-compatibility property, not merely a claim. `Product.nfcTaggingEnabled` is never reset when `nfcPerProductEnabled` toggles off Business-wide (`settings.md` §2.8) — it simply stops counting toward this test while the Business-level flag is off, the same "two independent stored fields, no reset rule needed" pattern `settings.md` §2.3 already establishes for `defaultSellingMode`/`subscriptionTier`. Every place in this document that previously read "every untagged unit... Product-agnostically" for NFC-tagging purposes now means "every untagged, NFC-tagging-eligible unit" — checked and corrected at every occurrence, not only §3.14's own headline auto-entry: §1 (merchant goal), step 0/2/3 above, §3.5, §3.12/§3.13, §3.14, §3.17, §7, §9.

**Reached via `settings.md`'s "Cambiar a vender con tags" handoff (step 0), the composed test naturally reduces to its original, unchanged behavior.** At that moment `defaultSellingMode` has just been written `'nfc'`, so the first disjunct is trivially true for every unit, and the whole-Catalog seed proceeds exactly as it always has — this isn't special-cased; it falls out of the composed test as written. **The new per-Product path never triggers step 0, or any hand-off, at all** — see §3.4's own explanation below for why toggling that switch never triggers navigation of its own.

**New, highest-priority trigger condition — step 0, added by architect's
own corrected design (`decision-log.md` D46 Addendum).** This check
belongs entirely to Inventario, not Settings: `settings.md` §2.6's "Cambiar
a vender con tags" action writes `defaultSellingMode` and hands off an
entry marker only — never a queried Inventory fact — precisely to avoid a
dependency back-edge (Inventory already depends on Identity per
`domain-model.md`'s Bounded Contexts table; `architecture-principles.md`
#6 forbids the reverse edge that would result from Identity reading
Inventory state to make its own routing decision). Step 0 reuses the
identical whole-Catalog untagged-inventory test step 2 already runs, for
its own separate reason (surfacing a pending-tag-work nudge on an ordinary
Catalog-view open) — no new fact is invented, only a new, earlier moment
to check the same one. It only ever evaluates when Inventario's resolution
is entered carrying that specific entry marker; an ordinary tab open, or
any other entry point, skips straight to step 1 as always. Traces
correctly through all three real cases: untagged inventory exists →
auto-enter §3.14 per the YES branch above; no untagged inventory but she's
received merchandise before → falls through to step 1 (Product ever
registered — YES, she's sold before) → step 2 reads NO (nothing pending,
`defaultSellingMode` just became `nfc` but no untagged unit exists) →
plain Catalog view (§3.4), "Inventory Ready" — not a return to
Configuración's own vista principal (`settings.md` §2.6/§10); zero
InventoryUnit ever received → falls through to step 1, which reads NO if
zero Products have ever been registered either → cold start with this
entry marker's own variant (§3.3a) — or, if named Products already exist
with zero Lots ever received against them (`onboarding.md`'s "Define lo
que vendes"), step 1 reads YES → Catalog view with the identical one-time
banner (§3.3a's second bullet). All three cases resolve to an
already-defined destination; none is invented here.

**This is deliberately a different, shallower test than Home's own §2 step 3 check** (`decision-log.md` D33 / `onboarding.md`'s 2026-08-08 amendment). Home tests for at least one `available` InventoryUnit, since offering "Iniciar Sesión Rápida" is a promise that something is sellable right now — a promise a named-but-unstocked Catalog can't honestly make (`home.md` §2 step 3, §3.3). Inventario's own question is narrower and carries no such promise: whether there's a Catalog to *display and receive against* at all — a zero-`disponibles` row (§3.4) is never a dead end here the way an all-dimmed selling grid would be in Home, since every Catalog row stays honestly labeled and fully tappable into Registrar Mercancía regardless of stock. The two tabs deliberately read different facts now; before `onboarding.md`'s "Define lo que vendes" step existed, they happened to coincide, since a Product could never exist without an accompanying Lot — that coincidence no longer holds, and this test's own substance was re-checked against it rather than assumed still correct by inertia (see `onboarding.md` §2.2a).

**Gate corrected, `decision-log.md` D46, further extended `decision-log.md` D71.** Steps 2 and 3 above previously gated on `nfc ∈ registrationMode` (NFC *availability*) — a Paid merchant who never intends to sell with tags was unconditionally routed into a tagging queue and shown a persistent tagging nudge, regardless of whether she'd ever choose `nfc` as her normal selling mode. Both steps now gate on the composed **NFC-tagging-eligible** test above — `defaultSellingMode === 'nfc'` (her actual, self-service-chosen whole-Catalog intent, unchanged from D46) **or**, as of D71, `nfcPerProductEnabled === true` together with the specific unit's own `Product.nfcTaggingEnabled === true` — never on capability alone, in either case. A Paid merchant who keeps `defaultSellingMode = 'buttons'` and never opts any Product into NFC individually sees no pending-tag nudge (§3.5) and is never auto-routed into Asignar Tags after Guardar mercancía, exactly as D46 requires ("A Paid merchant who never switches to `nfc` mode is never auto-routed into tagging, at any point, for any reason"). A Paid merchant who opts specific Products in sees the nudge and auto-entry scoped to exactly those Products, never her whole Catalog, exactly as D71 requires. This does not change whether the Assign-Tags step *exists* in Inventario at all — see below.

`nfc ∈ registrationMode` gates whether an "Assign Tags" step exists **at all**
in Inventario, per `information-architecture.md` ("`nfc ∉ registrationMode`
(NFC not in the Business's capability set) → no 'Assign Tags' step anywhere
in Inventario. Gated by capability availability, not by any single Session's
resolved operating mode.") and `domain-model.md`'s business-capability table.
This is resolved once, upstream, at the Business level — never a per-Lot
question like "¿quieres usar NFC para este lote?", and independent of any
single Session's `Session.operatingMode` (*architecture-principles.md* #1,
`decision-log.md` D23). Every condition in this section is a Business-level
capability check, not a Session-level one — Inventario isn't a Selling-context
screen and never reads or depends on any particular Session's resolved mode.
This is a distinct fact from the auto-entry/pending-nudge gate corrected
above: capability decides whether the Assign-Tags mechanism (§3.14 and its
surrounding states) is reachable *at all* for this Business;
The composed NFC-tagging-eligible test (above) decides whether Inventario proactively routes or nudges her into it, for any given unit or Lot. A Paid merchant with `defaultSellingMode = 'buttons'` still has Asignar Tags reachable in principle — she's simply never routed there automatically for any Product she hasn't individually opted in via `nfcPerProductEnabled` and this document's own per-Product toggle (§3.4, `decision-log.md` D71); once she does, the nudge and routing apply, scoped to exactly that Product, never her whole Catalog.

**Barcode-scanning capability gates whether "Escanear código de barras"
exists at all in Elegir producto (§3.8) — resolved the same way,
`company/business-decisions.md` Q20, 2026-09-13 Product Owner decision.**
`Business.subscriptionTier = paid` is the entire gate — same gating class
as NFC/Frequent Customers/multi-staff SELLER accounts (`decision-log.md`
D27, D34, `company/business-decisions.md` Q18) — read once, upstream, as
part of this tab's own state load above, never re-checked per scan
attempt or per line. A Free-tier Business never sees the "Escanear código
de barras" row in §3.8's picker, and §3.8a's scan variant and §3.8b–§3.8e
don't exist for her — not disabled, not shown-then-blocked, simply
absent, the identical posture `settings.md` §2.7's "Tu equipo" already
establishes for a Free-tier merchant and a Paid-only capability. This is
a distinct fact from `nfc ∈ registrationMode`'s own gate immediately
above — two independent Paid-tier capabilities, each derived from the
same `subscriptionTier` field but gating unrelated surfaces (Assign Tags
vs. barcode scanning); a Free-tier Business fails both, a Paid-tier one
passes both, and nothing links them beyond sharing one upstream field.
The same gate now also covers the Catalog-row "Editar código de barras"
correction sheet added 2026-09-16/17 (§3.4c–§3.4g) — its only capture
mechanism is the same camera scan, so it inherits this exact check rather
than defining a separate one.

## 3. Low-fidelity wireframes

Conventions inherited from `home.md`: `[ ]` = tappable, plain text =
passive/informational, bottom row is the persistent nav bar on every state,
current tab in brackets.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Identical silent-skeleton convention as `home.md` §3.1 / `events.md` §3.1 /
  `reports.md` §3.1 — not re-invented here. This is the tab-level resolution
  state `events.md` §3.1's annotation already claimed to reuse from this doc;
  it now actually exists here to be reused. *global-principles.md*, "technology
  should disappear."
- Nav bar present even before resolution finishes: navigation is never
  blocked by the app figuring out its own state, same guarantee `home.md`
  §3.1 makes.

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- One calm, plain-language line, never a technical status string, identical
  convention to `home.md` §3.2 / `events.md` §3.2 / `reports.md` §3.2.
  *global-principles.md*, "business language before technical language."

### 3.3 Cold start — no Product ever registered
```
┌───────────────────────────────┐
│  Inventario                    │
│  Aquí vas a ver lo que tienes    │
│  disponible en cuanto registres  │
│  lo que traes.                   │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Same tone, structure, and CTA label as Home's cold start (`home.md` §3.3):
  reuses "Registrar mercancía" verbatim rather than inventing new vocabulary
  for the same action.
- This is the state she lands on if she reaches the Inventario **tab** directly
  while the Catalog is empty. If she instead arrived via Home's cold-start CTA,
  she skips straight to §3.6 (see §10) — tapping "Registrar mercancía" once on
  Home shouldn't require tapping it again here. *global-principles.md*, "the
  fastest interaction is the one that never happens."
- **Reachable in practice now only as a defensive/legacy fallback.** Every merchant completing the current Onboarding flow (`onboarding.md` §2.2a) already has ≥1 Product by the time she first opens Inventario, so a true "no Product ever registered" state doesn't arise for any real, freshly-onboarded merchant — this screen is kept as the correct baseline for that fallback case, the same way `home.md`'s own §3.3 fallback stays defined even for cases expected to be rare.

### 3.3a Entry from Settings — "Cambiar a vender con tags," zero inventory to tag yet (new — `decision-log.md` D46)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Cambiaste a vender con tags.    │
│  Aquí vas a ver lo que tienes    │
│  disponible en cuanto registres  │
│  lo que traes.                   │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Reached exactly once, immediately, when `settings.md` §2.6's "Cambiar a
  vender con tags" action succeeds and hands off its entry marker into
  this document's own §2 resolution, which finds — through its own new
  step 0, then step 1, never a fact Settings itself computes — neither an
  untagged InventoryUnit to route into Asignar Tags (§3.14) nor any
  InventoryUnit ever received for this Business at all — `decision-log.md`
  D46's third rule ("guided to register merchandise first... an empty
  tagging queue is never shown as the landing state"). Reuses this
  document's own §2 resolution and §3.3's cold-start structure verbatim —
  the same landing state a fresh, never-received Catalog already
  produces — with one added ambient line acknowledging why she landed here
  instead of wherever she tapped from in Configuración. Same CTA, same
  destination (§3.6, blank), same behavior as §3.3 in every other
  respect — no new interaction pattern.
- **Copy tightened (`ux-critic` Suggestion):** the acknowledgment line now
  reads a plain "Cambiaste a vender con tags." rather than also restating
  the registration ask ("registra tu primera mercancía para empezar a
  etiquetar") the reused cold-start body immediately below it already
  makes — both previously pointed at registering merchandise from
  slightly different angles, back-to-back.
- **If this Business already has one or more named Products but zero Lots
  ever received against any of them** — reachable now only as a legacy-data
  case, per §3.4's own 2026-09-04 correction: any Business onboarded before
  `product-decisions.md` Q20 shipped may still carry Products written
  through Onboarding's old, Product-only "Define lo que vendes" write; a
  Business onboarded after cannot reach this state, since that step now
  writes real stock in the same interaction (`onboarding.md` §2.2a) —
  **§2 step 1 still resolves to the plain Catalog view (§3.4), not this
  cold-start screen, whenever it does occur**, the identical ambient line
  prepended there instead, above the Catalog list, with the exact same
  wording and the exact same one-time, non-blocking treatment. Same "reuse
  whichever state already correctly represents her situation" rule §2
  already applies to every other entry into Inventario.
- Shown exactly once — on this landing, not repeated on any later Inventario
  open. Same shown-once discipline `home.md` §3.6a's once-ever variant and
  `settings.md` §2.4's landing acknowledgment already establish elsewhere in
  this document family.
- Plain, factual register, matching §3.4's "sin registrar" precedent —
  states what happened and what to do next, never a warning or an apology.

### 3.4 Catalog view — normal
```
┌───────────────────────────────┐
│  Inventario                    │
│  ┌───────────────────────────┐ │
│  │[B] Bolsas    $350   12 disponibles [⋯]│ │  marker → §3.4b; row → §3.6,
│  │[A] Accesorios $180 3 disponibles [⋯]│ │  prefilled; price [ $XXX ] → §3.4a
│  │[P] Playeras $280   0 disponibles [⋯]│ │  sold out — dimmed, tappable
│  │[D] Delantales $90      sin registrar [⋯]│ │  [⋯] → §3.4c (código de barras),
│  │                                        │ │  never registered — dimmed, tappable    Paid tier only
│  │[C] Camisas   $250   8 disponibles [NFC: No][⋯]│ │  fifth zone — Paid tier +
│  │                                                │ │  nfcPerProductEnabled + sin
│  │                                                │ │  código de barras only → §3.4
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Exact on-row position/width of the fifth zone (inline, on a second line within the row, etc.) is illustrative** — `ui-designer`'s call at Medium-Fidelity, the same disclaimer this document already gives §3.12c's link-display width in `settings.md`.
- List shows Product + available count only — never a Lot, InventoryEntry, or
  InventoryUnit reference. *architecture-principles.md* #4; matches
  *global-principles.md*, "she sees 'Hoodie (4 available)'."
- A sold-out Product (Playeras, 0 disponibles) stays visible rather than
  disappearing: Product persists independent of stock (`domain-model.md` D2).
- Tapping a row is a real shortcut, not decoration — see §3.6 annotation and
  §10.
- **Each row now carries the same per-Product marker `home.md` §3.9
  introduces on the selling grid — the first letter of `Product.name`,
  uppercased and trimmed — reused verbatim, not re-derived.** Same
  derivation, same source fact (`Product.name`), same rule; Inventario
  doesn't invent its own logic for this. Gives the Catalog list the same
  at-a-glance differentiation the selling grid now has, on the two screens
  where Ana actually scans a list of what she sells. **Amended 2026-09-06
  (`product-decisions.md` Q23) — the marker renders `Product.photo` in place
  of the initial letter whenever one is set**, identical substitution rule to
  `home.md` §3.9's own corrected marker (cross-referenced, not re-derived
  here either). A photo that fails to render at read time falls back
  silently to the plain initial-letter marker — see §3.4b for the fuller
  reasoning, cross-referenced from here rather than restated.
- **Amended 2026-09-06 (`product-decisions.md` Q23, remediating a Major
  `ux-critic` found in the original design) — three independent,
  non-overlapping tap zones exist on every Catalog row, now that the
  marker/photo icon is a real destination, not just a passive glyph.**
  Stated explicitly, following §3.4a's own established sub-row-tap-target
  precedent, rather than left implicit:
  1. **Marker/photo icon (leftmost, now bracketed `[ ]` per this document's
     own tappability convention, §3 intro)** — opens §3.4b, "Editar foto."
  2. **Row body** — the Product's name and its disponibles/sin-registrar
     caption, everything between the marker and the price — unchanged:
     opens §3.6, prefilled with that Product.
  3. **Price figure `[ $XXX ]` (rightmost)** — unchanged: opens §3.4a.

  A merchant reaching for "restock," "edit photo," or "open detail" lands in
  a correctly-sized, non-ambiguous target for each — no tap resolves between
  two of these three destinations. This three-zone disambiguation applies
  identically on a dimmed ("sin registrar"/"0 disponibles") row — dimming
  signals a restocking need here, not reduced functionality; all three zones
  stay independently tappable regardless of stock level. Applies identically
  wherever this row shape reappears — §3.5, §3.12, §3.13, §3.17 — the same
  "specified once, reused everywhere" rule this document's own marker/
  dimming treatment already established; no separate rewrite needed at each.
- **Corrected 2026-09-16/17 — a fourth tap zone added, Paid tier only
  (`decision-log.md` D65, live production defect fix).** The "three tap
  zones" enumeration above is superseded, not deleted:
  1. Marker/photo icon → §3.4b, unchanged.
  2. Row body → §3.6, unchanged.
  3. Price figure → §3.4a, unchanged.
  4. **Overflow indicator ("⋯", rightmost, after the price figure) — opens
     §3.4c, "Editar código de barras," directly.** A single destination
     today, not an intermediate list — reuses the "⋯" glyph Ana already
     recognizes from Home/Configuración as "secondary actions live here"
     (`home.md`/`settings.md`'s own entry-point icon), rather than inventing
     new iconography, and follows the same "collapse a single-item overflow
     into a direct affordance" call `home.md`'s own header amendment
     (2026-08-14) already made for an identical one-action-behind-the-icon
     situation.
  A merchant reaching for "restock," "edit photo," "open detail," or "fix a
  misread barcode" now lands in a correctly-sized, non-ambiguous target for
  each of these four — no tap resolves between two of them. **Paid tier
  only**: a Free-tier Catalog row renders the original three zones alone —
  the fourth is absent entirely, never shown-then-blocked, matching §3.8's
  own Free-tier posture for the same underlying capability (§2). Applies
  identically wherever this row shape reappears — §3.5, §3.12, §3.13,
  §3.17 — the same "specified once, reused everywhere" rule already
  governing zones 1–3.
- **Corrected 2026-09-16/17 — a fifth tap zone added (`decision-log.md` D71, `product-decisions.md` Q31).** The "four tap zones" enumeration above is superseded again, not deleted:
  1. Marker/photo icon → §3.4b, unchanged.
  2. Row body → §3.6, unchanged.
  3. Price figure → §3.4a, unchanged.
  4. Overflow indicator ("⋯") → §3.4c, unchanged.
  5. **NFC-eligibility switch (new, rightmost when present) — writes `Product.nfcTaggingEnabled` directly, inline, no sheet.** Rendered `[ NFC: No ]` when off, `[ NFC: Sí ]` when on; a bare tap flips it.

  **Precise gating condition, stated in full:** `Business.nfcPerProductEnabled = true` **and** `nfc ∈ registrationMode` (i.e., `subscriptionTier = paid`) **and** this Product has no `barcode`. The middle clause is normally redundant — the only write path that can ever set `nfcPerProductEnabled = true` (`settings.md` §2.8) is itself only offered while `nfc ∈ registrationMode` — until a subsequent Paid→Free downgrade lands, which never resets `nfcPerProductEnabled`'s own stored value (the same "two independent fields, no reset needed" pattern governing `defaultSellingMode`, `settings.md` §2.3). Checking it explicitly here, rather than assuming it's always redundant, is what keeps this zone honestly absent for a since-downgraded Business, rather than surfacing a tagging affordance for a capability that no longer structurally exists for her.

  **Reasoned explicitly why this is a fifth, independent zone rather than a state folded into the "⋯" overflow sheet, against this document's own tap-zone-disambiguation discipline (§3.4's own 2026-09-06 amendment) — not defaulted to one shape without checking.** "⋯" already resolves to exactly one, unconditional destination for every Paid-tier row today (§3.4c, directly, no intermediate list) — the same "collapse a single-item overflow into a direct affordance" call `home.md`'s own header amendment already made. Folding the NFC toggle in as a second, conditionally-present option inside that same sheet would make "⋯"'s own destination ambiguous exactly on the rows where both conditions are true at once (a Paid-tier, barcode-less row on an `nfcPerProductEnabled = true` Business) — the precise "no tap resolves between two destinations" failure this document's own disambiguation discipline already argues against, and the same class of defect `ux-critic` already found and fixed twice in this document (marker/body/price ambiguity, Q23; the barcode overflow itself needing its own zone rather than merging into the price or body zone, D65). A fifth, always-independently-tappable control keeps "⋯" doing exactly one thing, unconditionally, on every row that has it at all, and gives NFC eligibility its own honestly-labeled, non-overlapping target, visible only under its own gating condition — the same shape barcode's own fourth zone already established for a capability-gated, row-level control.

  **Mutual exclusivity with `Product.barcode`, enforced at the point of conflict, not merely declared (`decision-log.md` D71's own "never both" rule).** This zone is never rendered at all on a barcoded row — the gating condition (`Product.barcode` absent) already makes the two structurally impossible to show together on the same row. The one real path that could still create a conflict — assigning a barcode, via §3.4c, to a Product currently `nfcTaggingEnabled = true` — is corrected at §3.4c itself (see that section): saving a fresh barcode there also clears `nfcTaggingEnabled` in the same write, never leaving both true at once. A newly-created Product resolved via barcode scan (§3.8b–§3.8e) is never a conflict risk by construction, since it starts with `barcode` already set and `nfcTaggingEnabled` at its own default (`false`) — the toggle in §3.4 was never visible for it to begin with.

  **Save-state discipline — composes two already-approved primitives, no new pattern invented, no `knowledge-mentor` consultation needed.** A bare tap on the switch immediately dims that one row (reusing `settings.md` §3.9's own "fila atenuada" mechanic — a row dims in place while its own capability-level write is inflight — composed here onto this document's own existing four-zone row architecture, rather than a sheet). Near-instant: the row simply dims and un-dims silently. Slow (>~1.5s): the row's NFC label reads "Guardando…" in place of its Sí/No state, same calm, plain-language convention as every other write in this document (§3.10). A failed write reverts the switch to its last-saved state and shows a small inline line directly beneath that one row — "No pudimos guardar. Intenta de nuevo." — with the switch itself remaining tappable as its own retry (no separate "Reintentar" button, no full-screen error — this is a small, low-stakes, instantly-retriable boolean flip, the same reasoning `settings.md` §3.10 already gives its own toggle failures, scoped here to one row instead of one screen since nothing else on the Catalog view is affected by this one row's failed save).

  **Toggling it on or off never hands off anywhere, and never immediately auto-enters Asignar Tags** — a deliberate contrast with "Cambiar a vender con tags" (§3.3a), which does auto-route her into tagging, because that action is an explicit declaration of whole-Catalog intent. Enabling this one Product simply makes its currently- or future-`available`, untagged units NFC-tagging-eligible (§2's new composed test) starting at her next ordinary Inventario open (picked up by §2 step 2's existing pending-nudge, unchanged mechanism) or her next Guardar mercancía for this Product (§2 step 3) — never an immediate navigation the moment she flips the switch. The same "no hand-off, only future eligibility starts/stops" posture `settings.md` §2.8 gives the Business-level toggle, applied here at the Product level. **Turning it off never untags or orphans an already-tagged unit of this Product either** — the identical invariant, restated at the per-Product level rather than only inherited silently from the Business-level description: an already-NFC-tagged Camisas unit stays exactly as tagged and sellable via NFC; only future eligibility for not-yet-tagged units of this Product stops.

  Applies identically wherever this row shape reappears — §3.5, §3.12, §3.13, §3.17 — the same "specified once, reused everywhere" rule already governing zones 1–4.
- **A zero-`disponibles` row (Playeras, 0 disponibles) now renders
  dimmed** — the same visual dimming signal `home.md` §3.9 already applies
  to a sold-out ProductTile, reused here rather than inventing a second
  dimming rule. **Unlike the ProductTile case, this row stays fully
  tappable**: tapping it still routes to §3.6, prefilled with that Product,
  exactly like every other Catalog row (§3.6's shortcut annotation, §10).
  Dimming here is a "needs restocking" signal, not a disabled state — this
  is precisely the row Ana is most likely to want to tap, since it's where
  she decides what to bring or replenish next. Contrast explicitly with
  `home.md` §3.9, where dimming *does* pair with non-tappability (there's
  genuinely nothing to do with zero sellable units); Inventario's zero-stock
  row has the opposite relationship to tappability, because restocking is
  exactly Inventario's job.
- **A zero-`disponibles` row's caption now distinguishes two different
  zero-stock causes that can each reach it** (`onboarding.md`'s 2026-08-08
  "Define lo que vendes" amendment, `decision-log.md` D33). Before that
  amendment, a Product could never exist without an accompanying Lot, so
  "0 disponibles" only ever meant "previously stocked, now sold out" and
  needed no further distinguishing. That's no longer the only path to
  zero: a Product created through Onboarding's "Define lo que vendes" step
  reaches the Catalog with a name and a `defaultPrice` but zero units ever
  received (`onboarding.md` §2.2a) — and both cases rendered identically,
  as plain "0 disponibles," with nothing to tell them apart. The gap is
  most likely to surface for a merchant fresh out of Onboarding who taps
  the Inventario nav tab directly, out of curiosity, before ever tapping
  "Registrar mercancía": §2 step 1 ("at least one Product ever
  registered?") already sends her to this ordinary Catalog view rather
  than to the cold-start screen's explanatory framing (§3.3), so every
  Product she just named there would otherwise read as if already sold
  out — precisely the "first impression that reads as intimidating or
  broken" risk `onboarding.md` §1 names as this whole document family's
  highest-stakes concern.
  - **Fix (unchanged by the correction below):** a zero-`disponibles` row's
    caption reads "sin registrar" instead of "0 disponibles" when the
    Product has never had any Lot/InventoryEntry received against it at
    all — a plain, factual read of whether any receiving event has ever
    happened for this Product, derived automatically the same way this doc
    already derives "existing vs. new Product" at the picker (§3.8) — no
    new stored field, no schema change, purely a read-side check. A Product
    that was previously stocked and has since sold out in full keeps the
    existing "0 disponibles" caption, unchanged.
  - Both captions keep every other rule of the existing dimming treatment
    identical: dimmed, fully tappable, routes to §3.6 prefilled with that
    Product — "sin registrar" is not a new state, a disabled affordance,
    or an extra tap; it's the identical row and destination, only the
    caption text differs.
  - Copy stays in this document's own established plain, factual,
    non-judgmental register for a zero-data state — "sin registrar" states
    a fact, not a shortfall.
- **Corrected 2026-09-04 (`product/02-ux/product-decisions.md` Q20) — the
  scenario that made "sin registrar" a real, expected outcome no longer
  exists for any freshly-onboarded merchant.** `onboarding.md`'s "Define lo
  que vendes" step (§2.2a) now captures each Selling Group's initial
  quantity in the same interaction and writes it through the same
  `commitLot()`-shaped write this document's own §3.10 uses — every
  Product Onboarding creates now arrives with at least one `available`
  InventoryUnit already on hand, the identical floor-of-1 Cantidad
  guarantee this document's own §3.6 already enforces for Registrar
  Mercancía. **`inventory.md`'s own "Registrar mercancía" flow was already
  incapable of producing a zero-stock Product on its own** — §3.6's
  Cantidad field has never accepted 0 or a blank value ("typing `0` or
  clearing the field reverts to 1 rather than being accepted, since '0
  units received' isn't a real receiving event") — so, as of this
  amendment, there is no remaining real (non-legacy) write path anywhere
  in this product that can create a Product with zero stock. **"Sin
  registrar" is not retired outright**: the caption, its derivation, and
  its dimmed-but-tappable treatment all stay exactly as specified above,
  unchanged, because `decision-log.md` D25's "never delete historical
  data" precedent means a Business that completed Onboarding before this
  amendment shipped — under the old, Product-only `createProducts()`
  write — may still be carrying a named-but-never-stocked Product today,
  and that Product's row still needs an honest, non-alarming caption. What
  changes is the *reachability* claim this bullet made before: "sin
  registrar" is no longer an outcome any current, real Onboarding or
  Inventario path can produce going forward — it survives only as the
  correct caption for pre-existing (legacy) data, the same narrowing this
  document's own §3.3 already applies to its "no Product ever registered"
  cold-start state ("reachable in practice now only as a defensive/legacy
  fallback").
- **The marker, the zero-stock dimming rule, and the "sin registrar" /
  "0 disponibles" caption distinction above all apply identically wherever
  this same row shape reappears** — §3.5 (pending-tag-work variant),
  §3.12/§3.13 (post-save confirmation views), and §3.17 (deferred-tagging
  view, = §3.5) — unaffected by this amendment; no separate correction
  needed for each, since none of them restates the derivation logic this
  bullet owns.
- **Also reached, with the same one-time ambient banner prepended, via
  Settings' "Cambiar a vender con tags" handoff when this Business has named
  Products but zero Lots ever received — see §3.3a.**
- **Also reached, with a one-time ambient banner of its own prepended, via
  the same Settings handoff when this Business is already fully tagged**
  (`inventory.md` §2 step 0's NO branch, falling through steps 1–2 to land
  here — `decision-log.md` D46 Addendum). A different real outcome from the
  bullet above — she's arrived from Configuración having already finished
  all her tagging, not being asked to register anything — so it carries its
  own wording rather than reusing §3.3a's line verbatim:
  ```
  Cambiaste a vender con tags. Tu mercancía ya está toda
  etiquetada — lista para la próxima sesión.
  ```
  Same shown-once discipline as §3.3a's own banner and this doc's other
  landing acknowledgments (§2.4, §3.6a) — dismissed on this landing, never
  repeated on a later Inventario open. Closes the gap `ux-critic` found
  (SET-INV-D46-MAJ1): without it, this was the one outcome among D46's
  three where she'd land on a different nav tab than the one she tapped
  from, with nothing telling her why.
- **Each row now also shows this Product's current `Product.defaultPrice`**
  (`decision-log.md` D33), e.g. "$350" — plain informational text within
  the row, except the price figure itself, which carries its own tap
  target `[ $350 ]`, distinct from the rest of the row (which stays
  tappable into §3.6, prefilled, exactly as before — unchanged). Tapping
  the price opens the price-edit sheet (§3.4a), the Catalog-row-level edit
  affordance D33 calls for — reusing this document's own existing
  dimmed-backdrop sheet shape (§3.8/§3.9) rather than inventing a new
  interaction. Applies identically wherever this row shape reappears
  (§3.5, §3.12, §3.13, §3.17), the same "specified once, reused
  everywhere" rule this doc's own marker/dimming treatment already
  established.

### 3.4a Editar precio — sheet (`decision-log.md` D33)
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Bolsas                          │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Precio                          │
│   [ $350 ]                       │
│  [ Cancelar ]  [ Guardar precio ]  │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Catalog-row-level edit affordance for `Product.defaultPrice`**
  (`decision-log.md` D33: "a plain mutable current scalar... editable
  later"), reached by tapping the price figure on any Catalog row (§3.4,
  and identically on §3.5/§3.12/§3.13/§3.17). Reuses the exact
  dimmed-backdrop sheet shape already established by "Elegir producto"
  (§3.8) and "Descartar confirmation" (§3.9) — no new sheet/modal pattern
  invented for this.
- Pre-filled with the Product's current `defaultPrice`, immediately
  editable — plain numeric peso entry, no currency picker or format
  toggle, the same unadorned posture as Cantidad's own typed path (§3.6).
- "Guardar precio" writes the new value directly to `Product.defaultPrice`
  and closes the sheet back to the Catalog view it was opened from,
  updated. "Cancelar" discards the edit and returns unchanged. Follows the
  same near-instant/slow/error save convention as every other write in
  this document (§3.10/§3.11) — a failed save leaves the sheet open with
  her typed value intact. **Correction (`reviewer` finding, 2026-09-06, on the built code):** this passage previously claimed the write "carries the same stable idempotency-key guarantee every other retryable write in this doc family already carries," per `decision-log.md` D30/`architecture-principles.md` #7. That's not accurate against the actual implementation — no idempotency key is generated for this write. Same pre-existing gap as `commitLot()` (`product/02c-high-fidelity-prototype/BACKLOG.md` §F), now confirmed to also cover `editPrice`/`setProductPhoto`, not fixed here.
- **Editing a Product's price here never touches any already-recorded
  `SaleItem.pricePaid`.** Those are resolved and stored at the moment each
  Sale was written (`domain-model.md`'s "Price resolution" Key Mechanism,
  D33) and never silently drift when `defaultPrice` changes later — the
  same "never silently alter historical data" invariant D25 already
  established for capability changes, extended here to price. This
  document computes or displays no effect on past totals — that boundary
  belongs entirely to `reports.md`.
- **Not a discount, haggling, or point-of-sale mechanism.** This sheet
  only ever changes a Product's normal going-forward price — never a
  per-transaction, per-customer, or per-Event adjustment (`events.md`'s
  own Price Override entry point is the only place an Event-specific
  price lives, and it's a distinct write target from this one).
  `decision-log.md` D33 explicitly rules out point-of-sale price
  override/haggling and promotions/discount pricing — this screen is not,
  and must never become, that mechanism.

### 3.4b Editar foto — sheet (`product-decisions.md` Q23)
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Bolsas                          │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Foto (opcional)                 │
│  ┌────┐                          │
│  │IMG │   [ Cambiar ]  [ Quitar ]│
│  └────┘                          │
│  [ Cancelar ]  [ Guardar foto ]  │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**Sin foto todavía (mismo sheet):**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Delantales                      │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Foto (opcional)                 │
│  [ Agregar foto ]                │
│  Agrega una foto clara del        │
│  producto.                        │
│  [ Cancelar ]  [ Guardar foto ]  │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

- **Catalog-row-level management affordance for `Product.photo`** (`product-decisions.md` Q23), opened by a bare tap on the marker/photo icon on any Catalog row (§3.4, and identically §3.5/§3.12/§3.13/§3.17) — mirroring §3.4a's own unlabeled price-figure tap target, not a separately-labeled button. This sheet's own on-screen heading is the Product's name ("Bolsas"), never the string "Editar foto" — the same relationship §3.4a already has between its section title and its actual on-screen heading, deliberately avoiding the CTA/heading-collision defect class this project has already found and fixed twice (`ux-critic-findings.md` HJR-INV-M1, HJR-EVT-M1). Reuses the exact dimmed-backdrop sheet shape already established by "Elegir producto" (§3.8), "Descartar confirmation" (§3.9), and "Editar precio" (§3.4a) — no new sheet/modal pattern.
- Reuses `Business.logo`'s device-upload mechanism (`onboarding.md` §3.9/§3.9a, D36) adapted to a per-Product photo — the device's own photo/file picker, no cropping, no editing, no color/branding tooling, per Q23's own "bring what you already have" framing.
- **Why "Cambiar"/"Quitar" need no confirmation here, reasoned for this context, not by citing `onboarding.md` §3.9a's own conclusion.** §3.9a's "no confirmation needed" rests on its own stated precondition — "nothing has been written to the platform yet" — which doesn't hold here: a Product's photo reached through this sheet is already persisted, and may already be rendering live on an active Session's selling tile (`home.md` §3.9) at this exact moment. That precondition failing doesn't automatically mean confirmation is now warranted — it resolves the same way, for a different reason: like §3.4a's own "Editar precio" sheet immediately above, this sheet stages "Cambiar"/"Quitar" as local, uncommitted changes — `Product.photo` is untouched until "Guardar foto" is explicitly tapped, and "Cancelar" discards the staged change, returning to the Catalog view (and any tile already rendering it) exactly as it was. Staging plus an explicit Cancelar/Guardar pair already gives her the protection a confirmation dialog would, the same structural reason §3.4a's own Precio field needs none. No confirmation dialog is added.
- Tapping the "IMG" thumbnail (once a photo exists) opens a simple full-viewport, non-editable large view — dismissed by tapping again or the back arrow, no Cambiar/Quitar controls inside it — satisfying Q23's "can... inspect it at a larger size" without adding a second editing surface. **A photo always renders within this preview at a legible size, cropped or scaled to fit — never distorted.**
- A file that can't be shown at selection time gets this inline failure line (mechanism/shape reused from `onboarding.md` §3.9's logo-failure state, the noun adapted since the original names "logo" literally, not reused verbatim):
  ```
  No pudimos mostrar ese archivo.
  Intenta con otra foto, si quieres.
  ```
  The sheet reverts to whichever state it held before the failed selection.
- **A previously-saved photo that fails to render later — a distinct case from the selection-time failure above — falls back silently to the initial-letter marker, never a broken-image glyph, never a blank tile.** This prototype is local-storage-only (`product-decisions.md` Q23's own architect finding) — corruption/eviction of an already-stored value is real, not hypothetical. This is a passive rendering fallback, not a merchant-facing error state: no message, no retry affordance. Applies wherever a Product's photo can render — the Catalog-row marker (§3.4), the Venta rápida selling tile (`home.md` §3.9, most consequential there, since a customer is standing in front of her), and this sheet itself (reverts to its own "Agregar foto" no-photo-yet state, never "Cambiar"/"Quitar" against a thumbnail she can't see).
- "Cambiar" opens the device picker to replace the current selection; "Quitar" clears it within the sheet's own pending state. "Guardar foto" commits whichever state the sheet currently shows as one write to `Product.photo` and closes back to the Catalog view, updated (that row's marker now showing the photo, or reverting to the initial letter if removed). "Cancelar" discards any in-sheet change and returns unchanged. Follows the same near-instant/slow/error save convention as every other write in this document (§3.10/§3.11) — a failed "Guardar foto" leaves the sheet open with the attempted change intact. **Correction (`reviewer` finding, 2026-09-06, on the built code):** this passage previously claimed the write "carries its own stable idempotency key, generated once per attempt," per `architecture-principles.md` #7. Not accurate against the actual implementation — no key is generated. Same pre-existing gap as `commitLot()`/`editPrice` (`product/02c-high-fidelity-prototype/BACKLOG.md` §F), not fixed here.
- **Not a discount, haggling, or point-of-sale mechanism — n/a here, named only for parallel structure with §3.4a**: this sheet only ever changes what a Product looks like in the app, never anything sold or priced.

### 3.4c Editar código de barras — sheet (`decision-log.md` D65, new write path, Paid tier only)
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Bolsas                          │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Código de barras                │
│  7501234567890                   │
│  [ Volver a escanear ]           │
│  [ Cancelar ]  [ Guardar código de barras ]│
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**Sin código todavía (mismo sheet):**
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Delantales                      │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Código de barras                │
│  Sin código                       │
│  [ Volver a escanear ]           │
│  [ Cancelar ]  [ Guardar código de barras ]│
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**Con un código recién escaneado (staged, sin guardar todavía):**
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Bolsas                          │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Código de barras                │
│  7501234567890 (actual)          │
│  7509876543210 (nuevo, sin guardar)│
│  [ Volver a escanear ]           │
│  [ Cancelar ]  [ Guardar código de barras ]│
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

- **Catalog-row-level correction affordance for `Product.barcode`**
  (`decision-log.md` D65), opened by the fourth tap zone (§3.4's "⋯") on any
  Catalog row (§3.4, and identically §3.5/§3.12/§3.13/§3.17). Reuses the
  exact dimmed-backdrop sheet shape already established by "Elegir
  producto" (§3.8), "Editar precio" (§3.4a), and "Editar foto" (§3.4b) — no
  new sheet/modal pattern.
- **On-screen heading is the Product's name ("Bolsas"), never the string
  "Editar código de barras"** — the identical relationship §3.4a/§3.4b
  already establish between their section title and their actual on-screen
  heading, deliberately avoiding the CTA/heading-collision defect class this
  project has already found and fixed twice (`ux-critic-findings.md`
  HJR-INV-M1, HJR-EVT-M1).
- **The current value is shown plainly**, unformatted, exactly as captured —
  or "Sin código" for a Product that's never had one, whether a legacy
  Product created before D65 shipped or one added without ever scanning.
  Neither case is treated as an error state; both are the correct, factual
  reading of a fact that may legitimately be absent.
- **"Volver a escanear" is the only way to change this value — there is no
  manual/typed entry here.** A barcode is a manufacturer/packaging-printed
  fact, not one Ana authors (§10, citing D65's own reasoning) — typing one
  in by hand would defeat the entire point of the scan-to-match mechanism
  and isn't designed. Opens the shared camera scanner (§3.4d).
- **A successful scan stages the new value; nothing is written until
  "Guardar código de barras" is explicitly tapped.** The sheet then shows
  both the current, still-saved value and the freshly-scanned one side by
  side, clearly marked "(actual)" / "(nuevo, sin guardar)" — reusing this
  document's own "revisa antes de guardar" vocabulary family (§3.6, INV-Q1)
  rather than inventing new copy, and giving her a direct before/after
  comparison at the exact moment this whole amendment exists to serve: she
  can see the wrong value she's replacing and the corrected one she just
  captured, side by side, before committing.
- **"Guardar código de barras" is disabled until a fresh scan has been
  staged.** Unlike Precio/Foto (§3.4a/§3.4b), where a value is always
  present or deliberately re-selected, there's no manually-adjustable state
  here to re-save — resaving an unchanged value serves no purpose, so the
  button stays inert until she's actually captured something new. Once
  enabled, tapping it writes the staged value to `Product.barcode`,
  **replacing the stored value outright — no merge, no history kept** —
  matching D33/`domain-model.md`'s existing "plain mutable current scalar"
  posture for `defaultPrice`/`photo`, extended here to `barcode`. Follows
  the same near-instant/slow/error save convention as every other write in
  this document (§3.10/§3.11) — a failed save leaves the sheet open with the
  staged value intact.
- **New 2026-09-16/17 (`decision-log.md` D71) — saving a fresh barcode here also clears `Product.nfcTaggingEnabled`, in the same write, whenever it was `true`.** D71's own rule is that a Product is barcode-identified or NFC-tagging-eligible, never both; this is the one write path that could otherwise leave both true at once (§3.4's own fifth zone is only ever visible while `barcode` is absent, so the two can't be set to true independently through the UI — this is the sole remaining seam). The clear-on-save is silent, not a separate confirmation step — the same "no confirmation needed for a change that only stops future eligibility" posture `settings.md` §2.8 already establishes for the Business-level toggle's own off-direction. **Any already-tagged `InventoryUnit` of this Product is completely unaffected** — it stays tagged and stays sellable via NFC, the identical never-untag/never-orphan invariant §3.4's own fifth zone already states. This clears only the Product's own *future*-eligibility flag, the exact same effect as her manually switching the row's NFC toggle off, one write earlier than she'd have needed to do it herself.
- **A saved change is confirmed with an ambient "Código de barras
  actualizado ✓" line on the Catalog view she returns to** (same ambient,
  fading, no-tap-to-dismiss shape as §3.12's "Mercancía registrada ✓") —
  added here specifically because, unlike Precio/Foto, nothing in the
  Catalog row itself visibly changes to confirm the write succeeded
  (`Product.barcode` isn't rendered in the row, §3.4). Without this line,
  she'd have no signal at all that "Guardar" did anything.
- **"Cancelar" discards any staged (unsaved) scan and closes the sheet,
  returning to Catalog view unchanged** — identical decline treatment to
  §3.4a/§3.4b.
- **A freshly-scanned code matching a *different* existing Product is never
  staged, never offered for Guardar — see §3.4e.** A scan matching *no*
  other Product, or matching this same Product's own already-stored value
  (a pointless but harmless rescan), stages normally as shown above; the
  uniqueness check is against every *other* Product only, never this one.
- **A residual, accepted race** — the same class D65's own build already
  names for the creation path (`commit_lot`'s collision handling) — exists
  between a successful §3.4e check and the moment "Guardar código de
  barras" actually writes: another device could register the identical code
  in between. Not designed with a dedicated UI branch here, consistent with
  that existing precedent; a genuine collision this late simply surfaces
  through the shared save-error state (§3.10/§3.11-equivalent).
- **No "Quitar" (remove) action designed here**, unlike Foto's Cambiar/Quitar
  pair. A barcode with no value is already the legitimate "Sin código"
  state every pre-D65 or never-scanned Product carries — removing an
  existing one wasn't the reported problem and isn't designed in this pass.
- Reached identically wherever this row shape reappears — §3.5, §3.12,
  §3.13, §3.17 — the same "specified once, reused everywhere" rule §3.4a/
  §3.4b already establish.
- **Not a discount, haggling, or point-of-sale mechanism — n/a here, named
  only for parallel structure with §3.4a/§3.4b.**

### 3.4d Editar código de barras — volver a escanear, cámara activa (`decision-log.md` D65, Paid tier only)
```
┌───────────────────────────────┐
│ ← Bolsas                         │
│                                │
│                                │
│         visor de cámara          │
│                                │
│    Apunta al código de barras    │
│                                │
│  [ Cancelar ]                    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Identical camera mechanics to §3.8b — reused verbatim, not
  re-litigated.** Full-view live camera, no per-frame confirmation tap, a
  successful read resolves automatically. §3.8b's own implementation-
  independence disclaimer (no claim about camera APIs, permission
  mechanics, scan latency, or symbologies) applies here unchanged — the
  same underlying camera mechanism, built once as `BarcodeScanner.tsx`, no
  new camera surface for this context.
- **One contextual adaptation:** §3.8b's "Escribir en su lugar" fallback —
  a typed-name alternative that only makes sense inside the Elegir producto
  picker's own typed-search field — is replaced here by "Cancelar," since
  there is no typed alternative when correcting an already-identified
  Product's barcode. Both return to their respective callers (§3.8 there,
  §3.4c here) with nothing committed.
- Back arrow behaves identically to "Cancelar" — returns to §3.4c
  unchanged.

### 3.4e Editar código de barras — escaneo, coincide con otro producto (conflicto) (`decision-log.md` D65, Paid tier only)
```
┌───────────────────────────────┐
│ ← Bolsas                         │  dimmed, visible underneath
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Este código ya está registrado  │
│  en otro producto:               │
│  [A] Accesorios                   │
│  5 disponibles                    │
│                                │
│  No se puede usar el mismo código │
│  en dos productos. Revisa que sea │
│  la prenda correcta, o escanea    │
│  otro código.                     │
│                                │
│  [ Escanear otro código ]         │
│  [ Cancelar ]                     │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **The one real edge case this amendment resolves explicitly, rather than
  leaving undefined.** `Product.barcode` is enforced unique per Business at
  the database level (`products_barcode_unique_idx`, a partial unique
  index, `types.ts`) — a straight overwrite would violate it whenever the
  freshly-scanned code already belongs to a different Product (scanning the
  wrong physical item, or two products genuinely sharing a manufacturer
  barcode by error).
- **Extends two already-approved patterns rather than inventing a third.**
  The "an identifier already belongs to something else, offer a different
  one, no reassignment" shape is §3.15's exact pattern ("Este tag ya está
  asignado a otra prenda. Usa un tag nuevo."), applied here to a barcode
  instead of an NFC tag. The recognition display — marker/name/disponibles
  for the *other* Product — reuses §3.8c's own presentation verbatim, for
  the identical reason: a bare name is easy to misread past, a real,
  recognizable glance catches the mistake.
- **No reassignment offered — deliberately.** Nothing here clears or moves
  the barcode away from the Product that already legitimately holds it;
  doing so would require a second write against an unrelated Product and
  risks silently breaking *that* Product's own future matching, which
  nothing in this pass asked for or was reported as broken. Her only two
  paths are trying a different scan or backing out — the same narrow,
  conservative posture §3.15 already established for its own conflict.
- **"Escanear otro código" returns to the camera view (§3.4d)** — she can
  reattempt immediately, most usefully if this was simply the wrong
  physical item.
- **"Cancelar" returns to §3.4c** — not all the way back to Catalog view —
  showing its state exactly as it was before this scan attempt (the
  original saved value, nothing staged). Same "return to the nearer state,
  not the furthest one" behavior §3.8c's own "No es este" already
  establishes for a structurally identical moment.
- Nothing is written anywhere by reaching or leaving this state.

### 3.4f Editar código de barras — permiso de cámara denegado (`decision-log.md` D65, Paid tier only)
```
┌───────────────────────────────┐
│ ← Bolsas                         │
│                                │
│  No pudimos usar la cámara.       │
│  Revisa los permisos de cámara    │
│  de tu teléfono e intenta de       │
│  nuevo.                           │
│                                │
│  [ Cancelar ]                    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Reached the instant camera access is denied or unavailable — same
  business-language-first posture as §3.8d, no permission/browser/OS error
  string, ever.
- **Falls back to §3.4c unchanged** rather than §3.8d's typed-search field —
  there is no typed alternative in this context, so the copy also drops
  §3.8d's "Escribe el nombre del producto" clause, which doesn't apply here.
  Never a dead end: the sheet she came from is still exactly as she left it.

### 3.4g Editar código de barras — no se pudo leer el código (`decision-log.md` D65, Paid tier only)
```
┌───────────────────────────────┐
│ ← Bolsas                         │
│         visor de cámara          │
│  No pudimos leer el código.       │
│  Intenta de nuevo.                 │
│  [ Cancelar ]                    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Identical posture to §3.8e — a single missed read, not a terminal state.
  Stays on the live camera view; the message clears automatically on the
  next attempt, no tap to dismiss.
- "Cancelar" stays reachable exactly as in §3.4d — a failing scan never
  traps her here, returning to §3.4c unchanged.

### 3.5 Catalog view — with pending tag work (`defaultSellingMode = 'nfc'` Businesses only)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Te faltan 7 artículos por       │
│  etiquetar                       │
│   [  Continuar etiquetando  ]   │  primary action in this state
│  ┌───────────────────────────┐ │
│  │[B] Bolsas          10 disponibles│ │
│  │[A] Accesorios     5 disponibles│ │
│  │[P] Playeras       20 disponibles│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]     │  secondary — always available, not
│                                │  the current task here
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
**Gate corrected, `decision-log.md` D46 — this state is now keyed to
`defaultSellingMode`, not capability.** Previously gated on `nfc ∈
registrationMode` alone; now requires `defaultSellingMode === 'nfc'` as
well, per §2 step 2's corrected test above. A Paid-tier Business that keeps
`defaultSellingMode = 'buttons'` never sees this state, even with untagged
inventory sitting in her Catalog — not an oversight, see §2's cross-
reference note above for why.
- **Amended 2026-08-07 (Product-Owner-directed refinement — see §10):**
  "Continuar etiquetando" is now the primary action in this state — a plain
  status line ("Te faltan 7 artículos por etiquetar") directly under the
  header, with its CTA immediately beneath it, unboxed — the identical shape
  `home.md` §3.6 uses for "Hoy es tu Día 2" + "[ Continuar Día 2 ]", not the
  boxed, visually-secondary informational-card shape this state used to
  borrow from `home.md` §3.5's upcoming-Event card. "Registrar mercancía"
  keeps the exact position it holds in every other Catalog view
  (§3.4/§3.12/§3.13) — bottom, above the nav bar — but is now explicit, in
  prose, as secondary in this one state: same tap, same destination (§3.6,
  blank), same zero gating, just no longer reading as her current task while
  tagging is genuinely mid-process. Mirrors the primary/secondary pattern
  `home.md` §3.6a already establishes between "Iniciar Sesión Rápida"
  (primary) and "Asignar tags" (its own secondary, optional link) — reused,
  not invented fresh.
- **Why this state specifically, and not §3.4's plain Catalog view:**
  reception and tagging are one Inventory-context process, not two
  (`architect`-confirmed) — §3.5 exists only while she's genuinely mid-task
  on that process. §1's "distant third" ranking of tagging against
  Inventario's two primary contexts is an aggregate description of how often
  tagging happens across a whole session in Inventario, not a claim about
  what she should see the one time she's already holding a stack of newly
  received, partially tagged garments — the two aren't in tension, but the
  aggregate stat was previously read too literally into this specific,
  already-mid-task moment. §7's "no '¿quieres etiquetar ahora?' question;
  it's the obvious next physical action given she's holding the merchandise"
  reasoning, written for entering tagging the first time, extends the same
  way to resuming it — the merchandise in her hand doesn't know whether this
  is her first or second approach to the stack. §2 step 3 already confirms a
  second, later tap on "Registrar mercancía" doesn't route around or skip
  pending tagging — the process picks back up exactly where step 4 leaves
  off — so treating Registrar mercancía as her obvious next move in this
  state was never fully accurate to begin with. And §3.13's "lista para
  vender" wording (vs. §3.12's plain "registrada") already establishes, in
  the spec's own voice, that for a `defaultSellingMode = 'nfc'` Business
  "done" specifically means received *and* tagged — this refinement just
  makes the mid-process
  screen agree with what the finished-process screen already says.
- Tapping "Continuar etiquetando" resumes Asignar Tags (§3.14) exactly where
  she left off — same destination, same non-blocking resume behavior as
  before; only the framing and screen position of the action changed, not
  what it does.
- **Registrar mercancía is never gated, blocked, or hidden by this change —
  the always-reachable invariant (`inventory.md` §3.5/§10, confirmed by
  `architect`) is unmodified.** It remains a single tap away, in the same
  place she already knows from every other Catalog view, with identical
  behavior: no new confirmation, no interstitial, no "¿estás segura?" before
  it opens. What changed is purely which action reads as the obvious next
  one in this specific state — not what's possible, not what's reachable,
  and not the number of taps to reach either action.
- No new process, screen, or domain concept introduced: this remains the
  same single reception-and-tagging process described in §1/§2 — the
  refinement only changes which of its two already-existing actions is
  positioned and framed as primary while a tagging queue is genuinely open.
- **Only the bracketed "[ Continuar etiquetando ]" button is a defined tap
  target here, per this doc's own `[ ] = tappable, plain text = passive`
  convention** — the status line above it is informational only, exactly
  matching `home.md` §3.6's identical shape ("Hoy es tu Día 2" plain,
  "[ Continuar Día 2 ]" tappable). This is a narrower tap surface than the
  prior whole-card-tappable treatment; Medium-Fidelity should still give
  this primary CTA generous touch-target sizing per general mobile-usability
  practice, but sizing itself is `ui-designer`'s concern, not something this
  Low-Fidelity doc defines.
- "Disponibles" counts reflect `InventoryUnit.status` only, independent of tag
  status — see §8, item 2 (logged as Q2 in `product/02-ux/product-decisions.md`,
  reclassified from `architect-questions.md` as a Product Decision), for the
  open question this touches.
- **Cross-reference to NFC Readiness (`decision-log.md` D23, added — no
  redesign):** this state's own "how many units still need tags" count and
  Selling's NFC Readiness check — the "how many sellable units already have
  tags" evaluation run at Session-open time (`home.md` §2/§3.6a) — are two
  views of the identical underlying tagged/untagged split on `available`
  `InventoryUnit`s. The two counts should read off the same underlying number
  rather than drift into two independently-maintained figures. This is a
  cross-reference note only: they remain two distinct UX moments in two
  distinct documents — an ambient, mid-workflow Inventario nudge here, versus
  a Session-start, Selling-context gate there — neither is redesigned by this
  note.
- **Further amended 2026-09-16/17 (`decision-log.md` D71, `product-decisions.md` Q31).** This state's gate is extended, not replaced — reached when the composed NFC-tagging-eligible test (§2) is true for at least one untagged, `available` unit anywhere in the Catalog: `defaultSellingMode === 'nfc'` (unchanged, the original D46 case), **or** `Business.nfcPerProductEnabled === true` with at least one Product individually opted in (§3.4's new fifth tap zone) that still has an untagged unit. A Paid merchant with `defaultSellingMode = 'buttons'` who has opted, say, only Camisas into NFC now sees this nudge exactly when a Camisas unit is still untagged — never for Plumas or any other Product she hasn't individually opted in, and never at all if she hasn't turned on `nfcPerProductEnabled` in the first place.

### 3.6 Registrar mercancía — entry (first line, or shortcut-prefilled)
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Producto                        │
│  [ Elegir producto ▾ ]           │
│ Cantidad                        │
│  [ − ]  [ 1 · revisa antes de guardar ]  [ + ]│
│  (o escribe la cantidad)         │
│                                │
│  [ + Agregar otro producto ]     │
│                                │
│  [      Guardar mercancía    ]   │  enabled once Producto is chosen —
│                                │  Cantidad defaults to 1, never blank
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
(The instant she interacts with Cantidad at all — `[−]`, `[+]`, typed entry, or
tapping the number to open `teclado numérico` — the "· revisa antes de
guardar" suffix disappears and the field renders as "1" (or whatever value
she set) — still within the same tappable/editable treatment, just without
the suffix. Only the untouched, still-default state carries the suffix.)
- **On-screen heading now reads "Registro de mercancía" rather than repeating the CTA's imperative "Registrar mercancía" verbatim (§3.7 and §3.8's dimmed backdrop carry the identical fix) — resolves HJR-INV-M1.** The CTA that leads here (`home.md` §3.3; this doc's own §3.3/§3.4/§3.5/§3.12/§3.13/§3.17) is unchanged — "Registrar mercancía" is still the right action-verb for a button she's about to tap. What was broken is that the screen she lands on used the identical string as a passive title, so "go do this" and "you're now doing this" had no visible difference at the very first productive moment in the product. A noun-form heading in the same vocabulary family ("registro," not "registrar") reads naturally in Mexican Spanish as a form/screen label, grammatically distinguishes it from the button she just tapped, and invents no new vocabulary. Both entry points that reach this screen — `home.md` §3.3's cold-start CTA and this doc's own §3.3 cold-start CTA — route to this identical destination (§10's routing decision), so this single heading correction closes the repeat for both at once, not just one of them. Section titles below (§3.6, §3.7) and every "Registrar Mercancía" reference in §4/§5/§6/§7/§9/§10 keep naming this as the *Registrar Mercancía flow* — that's the flow's editorial name, distinct from the literal on-screen heading text now shown; no renumbering or cross-reference changes are needed.
- Only Producto + Cantidad are asked — no Supplier, no cost field, per
  `architecture-principles.md` #5 and `decision-log.md` D9 (see §8, item 1).
- **Price is never asked on this screen.** `Product.defaultPrice` is
  resolved entirely upstream, inside the Elegir producto picker (§3.8/
  §3.8a) — required once, at the exact moment a brand-new Product name is
  created, never re-asked for an existing Product, never a second field
  on this form (`decision-log.md` D33).
- If reached by tapping a Catalog row (§3.4), Producto arrives already filled
  with that row's Product, and Cantidad defaults to 1 immediately — the row is
  already complete and Guardar mercancía is enabled with zero further taps,
  though she's free to adjust the count before saving. *global-principles.md*,
  "capture business truth once, reuse it forever" and "the fastest interaction
  is the one that never happens."
- **The default quantity now renders as textually distinct from a
  deliberately set one — closes INV-Q1.** Until she interacts with Cantidad
  in any way, the field reads "1 · revisa antes de guardar" instead of a bare
  "1" — a low-cost, always-visible signal that this number is the app's
  placeholder, not something she's actually looked at, addressing the
  specific risk that a pre-filled default is easy to tap past without ever
  registering it as a real decision. This costs zero additional taps in the
  common, correctly-defaulted case — she can still glance and tap Guardar
  directly — since the fix targets *silence*, not speed: an unreviewed
  default can no longer look pixel-identical to a reviewed one. Deliberately
  not a blocking confirmation step, per the same reasoning the original
  Cantidad-default amendment already established (§10) — this doesn't
  reintroduce the friction that amendment removed.
- **The same marker carries into the "Ya agregaste" committed-lines list
  (§3.7) for any line whose Cantidad was never touched before "+ Agregar
  otro producto" committed it.** This is what closes the multi-unit/batch
  half of INV-Q1: if she moves quickly through several Products without ever
  engaging Cantidad on any of them (e.g., a fast pass through a large
  receiving batch), every one of those lines stays visibly flagged in the
  list she reviews right before Guardar mercancía — not just whichever row
  currently has focus — so a run of unreviewed defaults reads as a
  conspicuous pattern rather than looking identical to a batch of genuinely
  single-unit lines. See §3.7.
- Cantidad's default (1) and floor (never below 1) apply identically whether
  Producto came from the existing-Product list or was created inline as new
  (§3.8) — the rule is about the field, not about how Producto was resolved.
- The `[−]`/`[+]` stepper is additive, not a replacement for typing: tapping
  the numeric value still opens `teclado numérico` for jumping straight to a
  larger count without repeated taps. `[−]` goes inert once Cantidad = 1 — it
  never wraps to 0 or negative; typing `0` or clearing the field reverts to 1
  rather than being accepted, since "0 units received" isn't a real receiving
  event.
- **The numeric value itself must render with a clear tappable/editable
  visual affordance — never as plain, static-looking display text.** The
  wireframe above now brackets it (`[ 1 · revisa antes de guardar ]`)
  alongside `[−]`/`[+]`, consistent with this document's own stated
  convention (§3 intro: "`[ ]` = tappable, plain text = passive/
  informational") — previously the value sat unbracketed between the two
  stepper buttons, silently contradicting that convention. This is a
  low-fidelity notation only; the actual visual treatment (border,
  underline, fill, etc.) is a Medium-Fidelity/`ui-designer` decision. But
  *some* real, visible affordance is a hard requirement here, not optional
  polish: without it, tapping the number to open `teclado numérico` isn't
  discoverable as an available action — she'd have to already know it's
  possible rather than see it. This is what actually makes §6's "typed
  entry stays the faster path for large counts" true in practice, not just
  true on paper — a quantity of 20 shouldn't cost nineteen taps on `[+]`,
  because the faster path is visibly there to take. Applies identically
  wherever a live Cantidad field appears in this document, including
  §3.7's entry row.
- **Tapping the Cantidad value to open `teclado numérico` is a hard
  requirement of this field, not an incidental side effect of the stepper
  existing.** The `[−]`/`[+]` stepper is a convenience for small
  adjustments only and must never be the sole way to change Cantidad —
  direct typed entry must always be available and must always be the
  visible, obvious option for reaching a large count quickly.
- **Cantidad's default value (1) remains fully editable at all times before
  Guardar mercancía, by either input method** — the default is a starting
  value only, never a locked or suggested-only one, whether or not the
  "· revisa antes de guardar" marker is still showing.
- Form is a multi-line receiving event, not the Home selling grid
  (`home.md` §3.9): receiving requires a quantity per Product, a
  fundamentally different shape from a single tap = one unit sold. Reusing the
  selling grid here would conflate two different actions in one visual
  language.

### 3.7 Registrar mercancía — with committed lines, editing the next
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Ya agregaste:                    │
│  Bolsas — 10                [✕] │
│  Accesorios — 5            [✕] │
│  Playeras — 1 · revisa       [✕] │  committed without ever touching
│                                │  Cantidad — marker carries through
│ Producto                        │
│  [ Elegir producto ▾ ]           │
│ Cantidad                        │
│  [ − ]  [ 1 · revisa antes de guardar ]  [ + ]│
│  (o escribe la cantidad)         │
│                                │
│  [ + Agregar otro producto ]     │
│                                │
│  [      Guardar mercancía    ]   │
│      Descartar                   │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
*(The "Playeras" line illustrates the "revisa antes de guardar" marker
carrying through into the committed list per INV-Q1 above — "Bolsas" and
"Accesorios" render plain because their quantities were deliberately
typed/adjusted.)*
- "+ Agregar otro producto" commits the current row (now complete the moment
  Producto is chosen, since Cantidad defaults to 1) and opens a fresh blank
  one — exactly one tap per additional Product line, no more. Adjusting a
  line's quantity beyond the default is an additional, optional tap on `[+]`
  (or typed entry), only when the count genuinely differs from 1.
- **The active row's Cantidad field carries the same tappable/editable
  affordance requirement as §3.6** — bracketed in the wireframe above
  (`[ 1 · revisa antes de guardar ]`) for the same reason: the numeric
  value must never read as plain, static display text. Committed-line
  quantities in the "Ya agregaste" list (e.g., "Bolsas — 10") are
  already-saved values in this draft, not live editable fields — only
  `[✕]` is tappable on those rows. The affordance requirement applies to
  the one active, still-being-typed-into row, exactly as in §3.6.
- `[✕]` on a committed row lets her fix a miscount before saving — respects her
  intelligence rather than punishing a typo. *Brand tone*, warm/direct, never
  condescending.
- "Descartar" only appears once ≥1 line is committed (nothing to discard
  before that) — see §3.9 for what it opens.
- Leaving this screen any other way (back arrow, switching nav tabs, phone
  locking) silently preserves this in-progress draft — no confirmation, no
  "keep or discard" prompt — **including a Foto already selected for any new
  Product on this draft (§3.8a, `product-decisions.md` Q23), never silently
  dropped by an interruption any more than Producto/Cantidad/Precio already
  are.** Returning to Registrar Mercancía resumes exactly
  here. *global-principles.md*, "never ask twice," same treatment Home gives an
  interrupted Session (`home.md` §3.13).

*(The expansion of each committed line into individual InventoryUnit records
— "10" becomes 10 distinct units — happens automatically behind "Guardar
mercancía." It is invisible to Ana; no screen represents it. `decision-log.md`
D3: "the merchant still just types a quantity, the platform expands it.")*

### 3.8 Elegir producto — picker sheet
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Registro de mercancía            │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ¿Qué llegó?                    │
│  [ Buscar o escribir… ]          │
│  [ Escanear código de barras ]   │  opens la cámara — §3.8b
│  ─────────────────────────      │
│  [ + Agregar "Chalecos" como      │  only shown once typed text doesn't
│    producto nuevo ]              │  match an existing Product (see rule below)
│                                │
│  Bolsas                          │
│  Accesorios                   │
│  Playeras                      │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**Free tier (`Business.subscriptionTier = free`):**
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Registro de mercancía            │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ¿Qué llegó?                    │
│  [ Buscar o escribir… ]          │
│  ─────────────────────────      │
│  [ + Agregar "Chalecos" como      │
│    producto nuevo ]              │
│                                │
│  Bolsas                          │
│  Accesorios                   │
│  Playeras                      │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
Identical to the Paid-tier picker above, minus the "Escanear código de
barras" row — nothing replaces it, no gap left in its place, no upsell
copy. Typed search stays the only way to resolve Producto. §3.8a's "vía
escaneo, sin coincidencia" variant, §3.8b, §3.8c, §3.8d, and §3.8e are all
unreachable for a Free-tier Business — not error states, simply
destinations with no entry point (`company/business-decisions.md` Q20,
gated the same way `decision-log.md` D27 already gates NFC).

- One field resolves both "add stock of something I already sell" and "this
  is a new item" — no separate "create new Product" screen. Matches
  `decision-log.md` D2: Product is an independent identity that either already
  exists or is created inline, never re-derived from a Lot.
- She is never asked "¿es un producto nuevo?" — inferred automatically from
  whether her typed text matches an existing Catalog entry, using the matching
  rule below. *global-principles.md*, "every repeated decision should become
  automation."
- **Matching rule (case-insensitive, trimmed):** her typed text is compared
  against existing Catalog Product names after lowercasing both sides and
  trimming leading/trailing whitespace. "Bolsas," "bolsas," "BOLSAS," and
  " Bolsas " (trailing/leading space) all resolve to the same existing
  Product — the "+ Agregar... como producto nuevo" row never appears for any
  of them, and selecting the matched result behaves exactly like tapping
  "Bolsas" from the list below. This is the one automatic normalization
  applied to her typed text; it deliberately does **not** fuzzy-match or
  auto-correct beyond case and whitespace — "Bolsa" and "Bolsas" remain two
  distinct Products, since collapsing genuinely different names could
  silently merge two things she actually meant to keep separate. This
  directly prevents one real item's stock from being silently split across
  two Catalog rows over a casing or spacing difference, protecting
  *global-principles.md*'s own promise that she sees one number per Product
  ("Hoodie (4 available)").
- **Selecting an existing match never asks about price.** That Product's
  `defaultPrice` was already set, once, the first time it was created
  (§3.8a) — reused automatically here, matching the same "never ask
  twice" discipline this rule already applies to Product identity itself.
- **A second way to resolve Producto, Paid tier only: "Escanear código de
  barras" (new, `decision-log.md` D65; gated `company/business-decisions.md`
  Q20, 2026-09-13 — see §2).** Available and always-present within a
  Paid-tier Business's picker; absent entirely, never shown, for a
  Free-tier Business (see the Free-tier variant above). Sits directly
  beneath the typed-search field, never replacing it — typing stays the
  primary, always-present path, and every rule above (case-insensitive/trimmed
  matching, "never asked if it's new") is completely unchanged for a
  typed name. Scanning is a faster alternative specifically for
  merchandise that already carries a manufacturer barcode — most useful
  on a first pass through a stack of packaged toys. Tapping it opens the
  camera viewfinder (§3.8b) and resolves exactly one of four ways: a
  barcode already known to this Business's Catalog (§3.8c, confirm-on-
  scan, then the identical outcome as typing an exact matching name); a
  barcode with no match anywhere in the Catalog (routes into a scan-aware
  variant of "nuevo producto," §3.8a); camera access denied (§3.8d); or a
  failed read (§3.8e). Every branch keeps the typed-search field one tap
  away, never a dead end.

### 3.8b Elegir producto — escanear código de barras, cámara activa (`decision-log.md` D65, Paid tier only)
```
┌───────────────────────────────┐
│ ← Elegir producto                 │
│                                │
│                                │
│         visor de cámara          │
│                                │
│    Apunta al código de barras    │
│                                │
│  [ Escribir en su lugar ]        │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Full-view live camera, no per-frame confirmation tap — a successful read
  resolves automatically, the same "point and it just works" posture NFC's
  own scan surfaces already establish (`home.md` §3.10, this document's
  own §3.14), applied here to a camera read instead of an NFC tap.
  *global-principles.md*, "technology should disappear."
- No manual shutter/capture tap: a real barcode read is a discrete,
  machine-verifiable event, not a framing judgment Ana has to make — unlike
  a photo capture (§3.4b's device-upload mechanism), which is composing an
  image, not reading data.
- "Escribir en su lugar" is always visible and always one tap back to §3.8's
  typed-search field, with whatever she'd already typed (if anything)
  preserved untouched — scanning is additive, never a one-way door.
- Back arrow returns to §3.8 unchanged — nothing committed by opening the
  camera and backing out.
- **Implementation-independent by design — no claim made here about
  camera APIs, device permission mechanics, scan latency, or which
  barcode symbologies are read.** Build-time concerns for `ui-designer`/
  `architect` once this spec is approved.

### 3.8c Elegir producto — escaneo, coincidencia encontrada (confirmar) (`decision-log.md` D65, Paid tier only)
```
┌───────────────────────────────┐
│ ← Elegir producto                 │  dimmed, visible underneath
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Encontramos este producto:      │
│  [B] Bolsas                       │  same marker/photo as the Catalog row
│  12 disponibles                   │
│                                │
│  [ No es este ]  [ Sí, es este ] │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **One deliberate, reasoned exception to this picker's own "never ask
  twice" resolution for a typed name (§3.8).** A typed name is a fact Ana
  authors and controls; a barcode is a fact printed by a manufacturer or
  packager, which she doesn't control and can't proofread the way she can
  her own typing. `decision-log.md` D65's own named risk — two unrelated
  Products, more likely off-brand/informal-market goods, could
  coincidentally share a barcode, since Nahui does no external lookup —
  means a silent resolution here could misattribute freshly received
  stock to the wrong Product without her ever noticing. Same class of
  rare-but-consequential exception this document already carries (§3.9's
  Descartar confirmation) — not a violation of "never ask twice," a
  deliberate, narrow departure from it, justified because Inventario's own
  §1 already treats a few extra seconds here as an acceptable cost for
  correctness, unlike Home's live-customer speed bar. Full reasoning in
  §10.
- **Scoped deliberately narrow: only this screen, only Inventory.** Every
  later Sale-time scan of this same barcode (`home.md` §3.9a) resolves
  fully silently, exactly like a typed exact-name match already does. The
  barcode→Product identity trust decision is made exactly once, upstream,
  here — the same "capabilities resolved once, upstream, never asked
  mid-flow" discipline `architecture-principles.md` #1 already applies
  elsewhere in this Foundation, applied to an identity-resolution fact
  instead of a capability flag; what's resolved once, upstream, is
  *Selling's* trust of Inventory's own already-confirmed match — not
  Inventory's own act of confirming it, which is deliberately not a
  "resolved once, upstream" fact the same way, since a barcode never earns
  a typed name's self-authored standing no matter how many times it's
  scanned here. A merchant restocking the same toy every week sees this
  confirm every time she scans it here — the deliberate cost of catching a
  genuine mismatch at the one point it's cheap to catch, not an oversight.
- "Sí, es este" proceeds exactly as if she'd typed the matching name and
  tapped it from the list (§3.8) — back to §3.6/§3.7 with Producto
  resolved, Cantidad defaulting to 1.
- "No es este" returns to §3.8b's camera view (not the typed field), so she
  can re-attempt the scan or back out to typing from there — nothing about
  the rejected match is written anywhere.
- Shows the same marker (photo or initial letter) and the same
  "disponibles"/"sin registrar" caption the Catalog row already carries
  (§3.4) — reused, not redesigned — giving her a real, recognizable glance
  rather than a bare name she'd have to read carefully to catch a mistake.

### 3.8d Elegir producto — escanear, permiso de cámara denegado (`decision-log.md` D65, Paid tier only)
```
┌───────────────────────────────┐
│ ← Elegir producto                 │
│                                │
│  No pudimos usar la cámara.       │
│  Escribe el nombre del producto    │
│  o revisa los permisos de cámara   │
│  de tu teléfono.                   │
│                                │
│  [ Buscar o escribir… ]          │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Reached the instant camera access is denied or unavailable — never a
  blank camera view with no explanation. *global-principles.md*,
  "business language before technical language": no "permission denied,"
  no browser/OS error string, ever.
- **Falls straight back onto §3.8's own typed-search field, already
  focused and ready to type** — never a dead end, since typing was always
  the primary path this affordance sits beside. Same shape as §3.4b's "No
  pudimos mostrar ese archivo" treatment for a different device-capability
  soft-failure — reused, not reinvented: name the failure plainly, land
  her back on the path that still works.
- No retry loop or repeated permission prompt designed here — this
  document specifies behavior, not a permission-request mechanism.

### 3.8e Elegir producto — escanear, no se pudo leer el código (`decision-log.md` D65, Paid tier only)
```
┌───────────────────────────────┐
│ ← Elegir producto                 │
│         visor de cámara          │
│  No pudimos leer el código.       │
│  Intenta de nuevo.                 │
│  [ Escribir en su lugar ]        │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Stays on the live camera view — a failed read (blur, poor light, damaged
  barcode) is a single missed attempt, not a terminal state, the identical
  non-blocking posture §3.16's "No se pudo leer el tag" already
  establishes for a comparable physical-read failure, adapted from an NFC
  tag to a barcode. *global-principles.md*, "business language before
  technical language": no symbology name, no error code, ever named.
- Message clears automatically on the next attempt — no tap to dismiss,
  same as §3.16.
- "Escribir en su lugar" stays reachable exactly as in §3.8b — a failing
  scan never traps her in the camera view.

### 3.8a Elegir producto — nuevo producto, precio inicial (`decision-log.md` D33)
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Registro de mercancía            │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ¿Qué llegó?                    │
│  [ Chalecos ]                    │
│  ─────────────────────────      │
│  Nuevo producto: Chalecos          │
│  Precio                          │
│   [ $ ___ ]                      │
│  Foto (opcional)                 │
│   [ Agregar foto ]               │
│  [   Agregar "Chalecos"    ]      │  disabled until Precio has a value —
│                                │  Foto never gates this button
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**Con foto seleccionada:**
```
│  Foto (opcional)                 │
│   [IMG]  [ Cambiar ]  [ Quitar ] │
```
- Reached from §3.8 by tapping "+ Agregar 'Chalecos' como producto nuevo"
  — the sheet expands in place rather than closing, asking exactly one
  more question, required only because this is genuinely the first and
  only moment it's needed.
- **`Product.defaultPrice` (`decision-log.md` D33) is captured the first
  time a Product is created — whether here or via Onboarding's "Define lo
  que vendes" step (`onboarding.md` §2.2a) — never asked a second time for
  an existing Product.** Required, no silent default: unlike Cantidad's deliberate default-to-1
  (§3.6, INV-Q1), a price has no honest guessable default — substituting
  a placeholder number would risk silently misrepresenting what she
  actually charges, not just save her a tap. "Agregar 'Chalecos'" stays
  disabled until Precio holds a value.
- **Foto (opcional), added 2026-09-06 (`product-decisions.md` Q23) — captured optionally, the first time a Product is created here, whether or not she's also going through Onboarding's own "Define lo que vendes" step.** Reuses §3.4b's device-upload mechanism, adapted to a compact sheet field rather than a full management screen. Never gates "Agregar 'Chalecos'" — only Precio does. A file that can't be shown gets the identical inline failure line as §3.4b: "No pudimos mostrar ese archivo. Intenta con otra foto, si quieres." — the field reverts to its no-photo state, Precio untouched. **Density check (`ux-critic`, addressed):** this sheet now carries Precio (required) and Foto (optional) beneath the already-resolved Producto name — a modest addition, not a meaningful density increase; Foto costs zero required taps and adds one line to an already-short sheet, not warranting a second screen.
- No separate save/error state of its own: like the rest of the draft
  (Producto, Cantidad, Foto, committed lines, §3.7), this value is held in the
  in-progress form and only actually written, atomically with the new
  Product and the rest of the Lot, at "Guardar mercancía" (§3.10/§3.11) —
  a save failure there already preserves everything typed or selected, including a
  not-yet-created Product's name, price, and photo (§3.11's existing guarantee,
  extended to this field).
- Plain numeric peso entry — no currency picker, no decimal/whole-number
  toggle invented here.
- On "Agregar 'Chalecos'," returns to §3.6/§3.7 with Producto selected as
  "Chalecos," Cantidad defaulting to 1, and Foto (if selected) carried into
  the draft, exactly as the existing-Product path already behaves.

**Vía escaneo, sin coincidencia (`decision-log.md` D65):**
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, visible underneath
│  Registro de mercancía            │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Código escaneado — no lo          │
│  tenemos registrado todavía        │
│  Nombre del producto              │
│   [ ___ ]                        │
│  Precio                          │
│   [ $ ___ ]                      │
│  Foto (opcional)                 │
│   [ Agregar foto ]               │
│  [   Agregar producto    ]        │  disabled until Nombre AND Precio
│                                │  both have a value
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Paid tier only** — unreachable when `subscriptionTier = free`; the
  entry point this variant is reached from (§3.8's scan row) doesn't
  exist for a Free-tier Business (§2).
- **Reached instead of §3.8's typed-no-match path whenever a scanned
  barcode matches no existing `Product.barcode` in this Business's
  Catalog** (§3.8b) — the identical sheet, the identical atomic
  Product-creation write as the typed path, with one real difference: a
  scanned barcode carries no human-readable name (D65 explicitly rules out
  any external barcode-lookup database), so unlike the typed path — where
  her already-typed text is the resolved candidate name, shown read-only —
  this variant asks her to type the Nombre herself, the one fact a scan
  structurally cannot supply. This is not a second identity question and
  doesn't reopen "is this new?" (already answered, no match exists) — it's
  the one genuinely missing fact.
- **The scanned barcode itself is captured silently, attached to this same
  creation write, never shown as a field and never asked for separately**
  (D65's own instruction) — she never sees, confirms, or re-enters the
  barcode value anywhere in this sheet. "Agregar producto" gates on Nombre
  **and** Precio both holding a value — Nombre is a new required gate
  specific to this variant only; the existing Precio-required rule (D33)
  is unchanged.
- Foto stays optional, identical to the typed path — never gates the
  button.
- Same in-progress-draft persistence, same failed-save guarantee, same
  outcome on success (back to §3.6/§3.7, Producto resolved, Cantidad
  defaulting to 1) as the typed path — only the entry heading and the
  Nombre field differ.
- **If she backs out without completing it**, the same silent-draft-
  preservation guarantee already covering Producto/Cantidad/Foto (§3.7)
  extends to the scanned barcode value — never dropped by an interruption
  any more than anything else on this draft.

### 3.9 Descartar confirmation
```
┌───────────────────────────────┐
│ ← Inventario                     │  dimmed, still visible underneath
│  Bolsas — 10                     │
│  Accesorios — 5                 │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  ┌───────────────────────────┐ │
│  │ ¿Descartar los 2 productos │ │
│  │  que ya agregaste?          │ │
│  │ [ Cancelar ] [ Sí, descartar]│ │
│  └───────────────────────────┘ │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- One of the deliberate, blocking confirmations in this entire spec —
  alongside §3.8c (new, `decision-log.md` D65), the other genuine
  "ask-before-proceeding" gate this document now carries. **Corrected
  2026-09-13 (`reviewer` finding)** — this bullet previously named §3.12
  as the only other one; §3.12 is an ambient, auto-fading post-save
  confirmation, not a blocking gate requiring a decision, so it was never
  actually a second instance of this pattern even before D65. Justified
  the same way Home justifies its single confirmation (`home.md` §3.11,
  §10): rare, and genuinely destructive of real counted work — an
  intentional exception to "never ask twice," not a violation of it.
- **"Cancelar" returns instantly to the form (§3.6/§3.7, whichever was
  current) exactly as it was** — every committed line and the in-progress row
  untouched — the same decline treatment `home.md` §3.11 gives its own
  close-session confirmation.
- **"Sí, descartar" clears the draft entirely and returns to a blank
  Registrar Mercancía (§3.6)** — the only way this in-progress form is ever
  lost outside a successful Guardar mercancía.

### 3.10 Guardar mercancía — saving (near-instant / slow)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│                                │        │        Guardando…              │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │                                │
├───────────────────────────────┤        ├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │   │ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
- Identical convention to `home.md` §3.1/§3.2 and this doc's own §3.1/§3.2 —
  silent unless genuinely slow, one calm line, never a technical status
  string. *global-principles.md*, "technology should disappear," "business
  language before technical language."

### 3.11 Guardar mercancía — error
```
┌───────────────────────────────┐
│  No se pudo guardar. Tus         │
│  productos siguen aquí,          │
│  intenta de nuevo.                │
│  Bolsas — 10                     │
│  Accesorios — 5                 │
│      [   Reintentar   ]          │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Her typed data is never dropped by a failed save — **including any Foto
  selected for a new Product on this batch (§3.8a, `product-decisions.md`
  Q23)**, the same guarantee already covering Producto/Cantidad/Precio —
  same principle as Home's resolution-fallback (`home.md` §3.14): a failure
  state must never cost her work she already did. *global-principles.md*,
  "the best interface stays out of the merchant's way."

### 3.12 Post-save confirmation — no NFC-tagging-eligible unit in this Lot (`decision-log.md` D46/D71)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Mercancía registrada ✓          │  ambient, fades — not a separate screen
│  ┌───────────────────────────┐ │  requiring a tap to dismiss
│  │[B] Bolsas          10 disponibles│ │
│  │[A] Accesorios     5 disponibles│ │
│  │[P] Playeras       20 disponibles│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- No "Ir a Inventario" tap required to leave a confirmation screen she already
  wants to leave — this **is** Catalog view (§3.4), already updated, with a
  transient line. *global-principles.md*, "the fastest interaction is the one
  that never happens." Inventory Ready, per `vision.md`, with no further step.
- **Reached whenever `Business.defaultSellingMode ≠ 'nfc'` at the moment
  Guardar mercancía succeeds** (`decision-log.md` D46) — including a Paid,
  nfc-capable Business that simply hasn't switched her normal selling mode
  to tags. For her, "done" honestly does mean received, full stop: she has
  no reason to tag anything she doesn't intend to scan. If she later
  switches to `nfc` in Configuración, `settings.md` §2.6 handles routing her
  back into tagging for whatever's still untagged at that point.
- **Further amended 2026-09-16/17 (`decision-log.md` D71).** The original condition ("`Business.defaultSellingMode ≠ 'nfc'`") is subsumed by the composed test (§2), not replaced by an unrelated one: reached whenever this specific Lot contains zero NFC-tagging-eligible units. For a Business with `defaultSellingMode = 'buttons'` and `nfcPerProductEnabled = false`, that's every Lot, exactly as before. For a Business with `nfcPerProductEnabled = true`, it's now also the correct destination for a Lot made up entirely of Products she hasn't individually opted into NFC (a pure-Plumas restock, even while Camisas is opted in elsewhere) — "Inventory Ready" remains fully honest for this Lot specifically, without implying anything about Camisas' own, separate tagging status.

### 3.13 Post-save confirmation — this Lot's NFC-tagging-eligible units are now tagged (`decision-log.md` D46/D71)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Mercancía lista para vender ✓   │
│  ┌───────────────────────────┐ │
│  │[B] Bolsas          10 disponibles│ │
│  │[A] Accesorios     5 disponibles│ │
│  │[P] Playeras       20 disponibles│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- "Lista para vender" (vs. plain "registrada" in §3.12) reflects that for a
  Business whose `defaultSellingMode = 'nfc'` (`decision-log.md` D46 —
  corrected from the earlier, capability-only gate), Inventory Ready
  genuinely means both received *and* tagged — same screen shape, different,
  honest wording.
- **Further amended 2026-09-16/17 (`decision-log.md` D71) — a mixed-Lot variant, same screen shape, corrected copy.** For a Lot that mixed NFC-tagging-eligible and non-eligible Product lines in one Guardar mercancía (e.g., Camisas + Plumas registered together), this same screen is reached once Camisas' own units finish tagging — but "Lista para vender" now needs to state plainly that Plumas' units were never part of that queue and were already sellable the moment Guardar mercancía succeeded, not left out or forgotten:
  ```
  Mercancía lista para vender ✓
  Camisas ya está etiquetada. Plumas no necesita tag —
  se vende con botones, y ya está lista.
  ```
  For a Lot where every line was NFC-tagging-eligible (including the original, unchanged `defaultSellingMode = 'nfc'` whole-Catalog case), the plain, undifferentiated "Mercancía lista para vender ✓" stays exactly as it already was — this variant only renders when the Lot genuinely mixed eligible and non-eligible lines, a fact this document already has on hand from §2 step 3's own per-Lot test, never guessed or inferred separately.

### 3.14 Asignar tags — active queue (auto-entered after Guardar mercancía or after switching to tags in Configuración, for NFC-tagging-eligible units — `decision-log.md` D46/D71)
```
┌───────────────────────────────┐
│  Asignar tags                   │
│  Lo que registraste:             │
│  Bolsas (10) · Accesorios (5)      │
│  · Playeras (20)                │
│                                │
│  Etiquetando: Bolsas              │
│  Faltan 7 de 10                  │
│                                │
│      Acerca el tag a la          │
│         prenda                   │
│                                │
│  [ Terminar después ]            │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Pure scan-driven, no per-unit confirmation tap: a successful scan assigns
  the tag to the next untagged unit and advances the counter automatically.
  Same interaction convention as Home's nfc selling surface (`home.md` §3.10)
  — deliberately reused since it's the same underlying capability
  (`nfc ∈ registrationMode`), not a new gesture invented for Inventario.
- Units are queued Product by Product, in the order she entered them — matches
  the physical mental model of working through one stack of garments at a
  time.
- Each physical unit gets its own tag (`decision-log.md` D4) — this queue is
  necessarily per-unit, never per-Product-type; "Faltan 7 de 10" is exactly
  that granularity.
- **Two entry points now reach this identical queue, both gated on
  `Business.defaultSellingMode === 'nfc'` (`decision-log.md` D46):** (1)
  immediately after "Guardar mercancía" succeeds, for the just-created Lot's
  units (§2 step 3); (2) immediately after `settings.md` §2.6's "Cambiar a
  vender con tags" action hands off its entry marker into this document's
  own §2 step 0, for whatever untagged InventoryUnits already exist across
  her whole Catalog at that moment, not scoped to a single Lot — the check
  itself runs entirely here, in Inventario, never in Settings (architect
  ruling, `decision-log.md` D46 Addendum). Both are the identical
  non-blocking, scan-driven queue below — only which set of units seeded it
  and which screen preceded it differ.
- **Further amended 2026-09-16/17 (`decision-log.md` D71).** Both entry points now seed only NFC-tagging-eligible units (§2's composed test), not every untagged unit Product-agnostically: entry point (1) seeds only this Lot's eligible lines' units, never the whole Lot when it mixes eligible and non-eligible Products (§2 step 3's own corrected test); entry point (2) seeds every eligible untagged unit across the whole Catalog — still whole-Catalog in scope, exactly as before, but now excluding any unit whose Product isn't NFC-tagging-eligible, which only matters for an `nfcPerProductEnabled = true` Business (a pure `defaultSellingMode = 'nfc'` Business sees no difference here, since every unit already qualifies under the test's first disjunct). The on-screen "Lo que registraste:" summary line (this section's own wireframe) lists only the Products actually queued — for a mixed Lot, it never names Plumas alongside Camisas, since Plumas was never seeded into this queue at all.
- **Entry point (2) is no longer reachable via any live merchant action, corrected 2026-09-17 (`decision-log.md` D72)** — `settings.md`'s "Cambiar a vender con tags" is retired outright, so nothing produces this entry marker going forward. Kept here as an accurate description of this document's own resolution logic, which D72 leaves untouched (this document's own scope for this amendment is copy-only — see `settings.md` §2.6 for the corresponding Identity-side retirement note). A Business already `defaultSellingMode = 'nfc'` never needed entry point (2) in the first place — she reaches untagged inventory the ordinary way, through entry point (1), like any other Business.

### 3.15 Asignar tags — error, tag already assigned
```
┌───────────────────────────────┐
│  Asignar tags                   │
│  Este tag ya está asignado a     │
│  otra prenda. Usa un tag nuevo.  │
│  Etiquetando: Bolsas              │
│  Faltan 7 de 10                  │
│      Acerca el tag a la          │
│         prenda                   │
│  [ Terminar después ]            │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Plain-language error, no UID/technical detail shown. *global-principles.md*,
  "business language before technical language."
- A business-logic conflict (the tag is valid and readable, but already
  belongs to a different unit) — contrast with §3.16, a genuine read failure.

### 3.16 Asignar tags — error, scan failed
```
┌───────────────────────────────┐
│  Asignar tags                   │
│  No se pudo leer el tag.          │
│  Acércalo de nuevo a la prenda.    │
│  Etiquetando: Bolsas              │
│  Faltan 7 de 10                  │
│      Acerca el tag a la          │
│         prenda                   │
│  [ Terminar después ]            │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Distinct from §3.15's "ya está asignado" business-logic conflict: this is a
  genuine physical read failure (out of range, foil/metallic interference,
  scan timeout) — a likely more common failure mode than §3.15, since Ana is
  physically moving a tag toward a garment over and over. A silent non-event
  would leave her unsure whether to reposition, retry, or that something's
  broken; this state makes the failure visible and names the fix.
- One message covers all three underlying technical causes (out of range,
  foil interference, timeout) — Ana doesn't need to diagnose *why* a scan
  failed, only what to do about it (reposition, try again).
  *global-principles.md*, "business language before technical language": no
  "timeout," "read error," or UID ever surfaces.
- Nothing is consumed by a failed read: "Faltan 7 de 10" is unchanged — only
  a successful scan advances the counter (§3.14). The message clears
  automatically on the next scan attempt (successful, a repeat failure, or a
  different conflict); no tap is required to dismiss it, same non-blocking
  posture as §3.15.
- "Terminar después" stays reachable exactly as in every other state in this
  queue — a failing tag never traps her in the flow.

### 3.17 Asignar tags — "Terminar después" (deliberate defer)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Te faltan 7 artículos por       │
│  etiquetar                       │
│   [  Continuar etiquetando  ]   │  primary action in this state
│  ┌───────────────────────────┐ │
│  │[B] Bolsas          10 disponibles│ │
│  │[A] Accesorios     5 disponibles│ │
│  │[P] Playeras       20 disponibles│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]     │  secondary — always available, not
│                                │  the current task here
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Identical to §3.5 as amended 2026-08-07 (primary "Continuar etiquetando,"
  secondary "Registrar mercancía") — deferring tagging returns her to a
  Catalog view that already knows work is pending and already reads as such;
  no separate "you stopped early" messaging.
- **Gated identically to §3.5, corrected the same way (`decision-log.md`
  D46): `defaultSellingMode === 'nfc'`, not mere capability.** This state is
  only ever reached from an already-active Asignar Tags queue (§3.14), which
  itself now only ever opens for an NFC-tagging-eligible Business/Lot (§2's
  composed test, `decision-log.md` D46/D71) — no separate gate to restate
  here, only to confirm it's inherited, not independently checked.

### 3.18 Defensive fallback / load error
```
┌───────────────────────────────┐
│  No pudimos cargar tu            │
│  inventario. Intenta de nuevo.     │
│      [   Reintentar   ]          │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Manual `Reintentar`, same convention as `events.md` §3.18 / `reports.md`
  §3.14 (not Home's silent auto-retry) — Inventario carries no live-customer
  risk that would justify Home's more aggressive, invisible retry behavior.
- Nav bar stays fully functional here, same as `home.md` §3.14 / `events.md`
  §3.18 / `reports.md` §3.14: a failure to load the Catalog never cascades
  into blocking Hoy/Eventos/Resultados, and critically, never blocks selling
  — if Ana's Catalog fails to load mid-bazaar-day, she can still reach Hoy
  and keep selling.

## 4. Interaction flow (summary)

```
Open Inventario tab
  → resolve (§2, automatic)
      → load fails ─────────────────────────→ fallback (3.18), Reintentar
      → Catalog empty ───────────────────────→ cold start (3.3) → tap "Registrar mercancía" → 3.6
      → Catalog has Products ────────────────→ Catalog view (3.4 / 3.5)

Catalog view:
  tap "Registrar mercancía" → 3.6 (blank)
  tap a Product row (outside the price figure) → 3.6 (prefilled with that
    Product)
  tap a Product row's price figure → 3.4a (Editar precio)
      → Cancelar → back to Catalog view, unchanged
      → Guardar precio → back to Catalog view, that row's price updated
  tap a Product row's overflow indicator ("⋯", Paid tier only) → 3.4c
    (Editar código de barras) — shows current código, or "Sin código"
      tap "Volver a escanear" → camera (3.4d)
        → scan matches no other Product (or matches this same Product's own
          current code) → back to 3.4c, staged new value shown alongside
          the current one, "Guardar código de barras" now enabled
        → scan matches a different existing Product → conflict (3.4e)
            → "Escanear otro código" → back to camera (3.4d)
            → "Cancelar" → back to 3.4c, unchanged, nothing staged
        → camera permission denied/unavailable → 3.4f → back to 3.4c,
          unchanged
        → scan fails to read → 3.4g → stays on camera, retry, or
          "Cancelar" → back to 3.4c, unchanged
      → tap "Cancelar" (from 3.4c itself) → back to Catalog view, unchanged
      → tap "Guardar código de barras" (enabled only once a fresh scan is
        staged) → saving (near-instant/slow, §3.10-equivalent) → error
        (§3.11-equivalent, Reintentar) or success → Catalog view, ambient
        "Código de barras actualizado ✓" — DONE
  [defaultSellingMode = nfc + pending untagged units] tap "Continuar
    etiquetando" (primary action in this state, §3.5) → 3.14 (resume)

Registrar mercancía (3.6/3.7):
  fill Producto (→ 3.8 if using the picker; matching is case-insensitive,
    trimmed — see §3.8) — Cantidad defaults to 1 the instant Producto
    resolves, marked "revisa antes de guardar" until touched (INV-Q1, §3.6),
    adjustable via [−]/[+] or typed entry (floor: 1)
      within Elegir producto (3.8): typed text matches no existing Product
        → "+ Agregar '...' como producto nuevo" → 3.8a (Precio required,
          D33) → tap "Agregar '...'" (disabled until Precio has a value)
          → back to 3.6/3.7, Producto resolved to the new name, Cantidad
          defaulting to 1, exactly as the existing-Product path
      within Elegir producto (3.8), new (`decision-log.md` D65, Paid tier
      only — row absent entirely for a Free-tier Business, §2/§3.8): tap
      "Escanear código de barras" → camera view (3.8b)
        → barcode matches an existing Product.barcode → confirm-on-scan
          (3.8c) → "Sí, es este" → back to 3.6/3.7, Producto resolved,
          Cantidad defaulting to 1, identical outcome to a typed exact-name
          match → "No es este" → back to camera view (3.8b), nothing
          written
        → barcode matches no existing Product.barcode → scan variant of
          "nuevo producto" (3.8a) → type Nombre + Precio (barcode already
          attached silently) → tap "Agregar producto" (disabled until
          Nombre and Precio both have a value) → back to 3.6/3.7, Producto
          resolved to the new name, Cantidad defaulting to 1
        → camera permission denied/unavailable → 3.8d → back to 3.8's
          typed-search field, focused
        → scan fails to read → 3.8e → stays on camera view, retry, or
          "Escribir en su lugar" → 3.8's typed-search field
      → [any point in 3.8b/3.8c/3.8d/3.8e] "Escribir en su lugar" / back
        arrow → 3.8, typed-search field, nothing committed
  → tap "+ Agregar otro producto" → commits row, opens next blank row → repeat
  → tap "Guardar mercancía"
      → saving (3.10)
      → error (3.11) → Reintentar → saving again
      → success:
          defaultSellingMode = buttons (whether or not nfc ∈ registrationMode)
            → Catalog view + ambient confirmation (3.12) — DONE
          defaultSellingMode = nfc → Asignar tags (3.14), auto-entered
  → [any point] leave without saving → draft preserved silently, resumes
    later at §3.6/§3.7, whichever step was in progress
  → [≥1 line committed] tap "Descartar" → confirm (3.9)
      → Cancelar → back to the form (3.6/3.7, whichever was current), unchanged
      → Sí, descartar → draft cleared → blank Registrar Mercancía (3.6)

Asignar tags (defaultSellingMode = nfc Business only, 3.14):
  scan tag → assign to next pending unit → counter decrements → repeat
  → tag already assigned → error (3.15) → scan a different tag
  → scan fails to read (out of range, foil, timeout) → error (3.16) →
    reposition and try again — queue state unchanged
  → tap "Terminar después" → Catalog view, "Continuar etiquetando" primary
    (3.17, = 3.5)
  → 0 pending → Catalog view + "lista para vender" confirmation (3.13) — DONE

Entry from settings.md §2.6 ("Cambiar a vender con tags" succeeds, carrying
only an entry marker — never a queried Inventory fact, `decision-log.md`
D46 Addendum):
  Inventario's own resolution (§2) evaluates its new step 0 first:
    at least one InventoryUnit exists with status=available and no NFCTag
    assigned, anywhere in the Catalog
      → Asignar tags (3.14), auto-entered, seeded with every untagged unit
        across the whole Catalog
    no such unit → falls through to steps 1-2, exactly as any other
      Inventario resolution:
        Catalog has 1+ Product ever registered (already sold merchandise
        before) → step 2 reads NO (nothing pending) → Catalog view (3.4),
        "Inventory Ready" — not back to Configuración's own vista
        principal (settings.md §2.6/§10)
        zero Product ever registered → cold start with this entry marker's
          one-time banner (3.3a)
        1+ Product registered but zero Lots ever received against any of
          them → Catalog view with the identical one-time banner (3.3a's
          second bullet)
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no Product ever registered
3a. Entry from Settings' "Cambiar a vender con tags," zero inventory to tag yet (D46)
4. Catalog view — normal
4a. Editar precio — sheet, Catalog-row-level (D33)
4c. Editar código de barras — sheet (D65, new write path, Paid tier only)
4d. Editar código de barras — volver a escanear, cámara activa (D65, Paid tier only)
4e. Editar código de barras — escaneo, coincide con otro producto, conflicto (D65, Paid tier only)
4f. Editar código de barras — permiso de cámara denegado (D65, Paid tier only)
4g. Editar código de barras — no se pudo leer el código (D65, Paid tier only)
5. Catalog view — pending tag work (NFC-tagging-eligible Businesses only — `defaultSellingMode = 'nfc'`, or `nfcPerProductEnabled` with 1+ Product opted in — `decision-log.md` D46/D71)
6. Registrar mercancía — entry (blank or shortcut-prefilled)
7. Registrar mercancía — with committed lines, editing the next
8. Elegir producto — picker sheet
8a. Elegir producto — nuevo producto, precio inicial (D33; gains a "vía escaneo, sin coincidencia" variant, D65, Paid tier only)
8b. Elegir producto — escanear código de barras, cámara activa (D65, Paid tier only)
8c. Elegir producto — escaneo, coincidencia encontrada, confirmar (D65, Paid tier only)
8d. Elegir producto — escanear, permiso de cámara denegado (D65, Paid tier only)
8e. Elegir producto — escanear, no se pudo leer el código (D65, Paid tier only)
9. Descartar confirmation
10. Guardar mercancía — saving (near-instant / slow)
11. Guardar mercancía — error
12. Post-save confirmation — no NFC-tagging-eligible unit in this Lot (`decision-log.md` D46/D71)
13. Post-save confirmation — this Lot's NFC-tagging-eligible units are now tagged (`decision-log.md` D46/D71), including a mixed-Lot copy variant
14. Asignar tags — active queue, seeded with only NFC-tagging-eligible units (`decision-log.md` D46/D71)
15. Asignar tags — error, tag already assigned
16. Asignar tags — error, scan failed
17. Asignar tags — "Terminar después" (defer, = state 5 on return)
18. Defensive fallback / load error

## 6. Minimum step count

| Scenario | Taps / entries | Why it can't be fewer |
|---|---|---|
| Register 1 new Product line, quantity 1, Producto already exists in the Catalog (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto) + 1 (Guardar) | Cantidad defaults to 1 on Producto selection — no separate quantity step for the single-unit case, the most common one. |
| Register 1 new Product line, quantity 1, brand-new Product name never typed before (buttons-only) | 1 (Registrar mercancía) + 1 (abrir Elegir producto) + 1 typed Product name + 1 ("+ Agregar... como producto nuevo") + 1 typed Precio + 1 ("Agregar...", §3.8a) + 1 (Guardar) = 7 actions | Precio is a new required, gating cost the instant a brand-new Product identity is created (`decision-log.md` D33) — unlike Cantidad's default-to-1, no honest guessable default exists for a price, so it can't be automated away (§3.8a). A one-time cost per Product identity only: every later restock of this same Product reuses the row above, and never re-asks Precio. |
| Register 1 new Product line, quantity >1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto) + N−1 taps on `[+]` (or 1 typed entry) + 1 (Guardar) | Must still specify *how many* when it's not 1 — this is the information itself, not an artificial gate; typed entry stays the faster path for large counts. |
| Register N Product lines (buttons-only) | 1 (open) + N×(1 elegir producto [+ adjustment taps if quantity ≠1]) + (N−1)×(agregar otro producto) + 1 (Guardar) | Each line is a distinct fact; the (N−1) "agregar otro" taps are the minimum structural cost of an arbitrary-length list, not padding. |
| Restock an already-known, sold-out Product at quantity 1 (tap Catalog row) | 1 (row, prefills Producto + Cantidad defaults to 1) + 1 (Guardar) | Shortest possible — Product identity reused instead of re-searched, and the default removes the previously-required typed quantity for the common 1-unit-restock case. *global-principles.md*, "capture business truth once, reuse it forever." |
| Same, `defaultSellingMode = 'nfc'` Business, U total units in the Lot | + U scans, 1 per physical unit | Per-unit tagging is a domain requirement (`decision-log.md` D4), not a UX choice — one tag, one unit, no shortcut exists that preserves traceability. A failed read (§3.16) costs zero extra taps — she simply re-presents the same tag. |
| Ajustar el precio de un Producto ya existente, fuera de Registrar mercancía (Editar precio, §3.4a) | 1 (tocar el precio en la fila del Catálogo) + 1 (Guardar precio) = 2 | Shortest possible — the price figure is its own tap target directly on the Catalog row (§3.4); no need to open Registrar mercancía at all for a pure price change (`decision-log.md` D33). |
| Corregir el código de barras de un Producto ya existente (Editar código de barras, Paid tier only) | 1 (⋯ en la fila) + 1 (Volver a escanear — el propio scan resuelve la captura) + 1 (Guardar código de barras) = 3 | One fewer action than registering a brand-new Product via barcode scan (6, above) — there's no Nombre or Precio to ask, only a value being replaced. |
| Restock an already-known Product via barcode scan, quantity 1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto → escanear código) + 1 (confirmar "Sí, es este") + 1 (Guardar) = 4 | One deliberate extra tap vs. the typed-name baseline (3) — the confirm-on-scan tap (§3.8c) is intentional, not an oversight; see §10 for why a barcode, unlike a typed name, gets this one extra tap every time it resolves to an existing Product. |
| Register 1 brand-new Product via barcode scan, no match, quantity 1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto → escanear código, sin coincidencia) + 1 typed Nombre + 1 typed Precio + 1 ("Agregar producto") + 1 (Guardar) = 6 | One fewer action than the typed-new-Product path (7) — the scan itself both searches and confirms "not found, create new" in a single motion, skipping the separate "+ Agregar... como producto nuevo" tap the typed path needs. |
| Browse the Catalog only | 0 taps | Opening the tab is itself the answer; nothing to register. |
| Activar/desactivar NFC por producto para un Producto ya existente (Catalog row, fifth zone, §3.4) | 1 (toque en el switch — sin sheet, sin confirmar) | The one action in this document with no separate save/confirm step at all: an inline, instantly-retriable boolean flip, the same low-stakes, easily-reversible reasoning `settings.md` §2.8 gives its own Business-level toggle's — one level lower-friction here, since neither direction discloses a consequence needing a full confirmation screen. |

Unlike Home's <3s-per-item bar (`company/backlog.md` #1, which is specifically
about *sale* registration under live customer pressure), Inventario has no
comparable hard speed requirement — the floor above is about not adding
**unnecessary** steps, not about racing a customer who isn't there.

## 7. Automation opportunities

- InventoryUnit generation from each typed quantity — fully invisible
  expansion, `decision-log.md` D3, never a screen.
- Existing-vs-new Product resolution — inferred from the picker automatically
  (case-insensitive, whitespace-trimmed matching, §3.8); she's never asked
  "¿es un producto nuevo?" explicitly.
- Whether Inventario opens to cold-start or Catalog view — same Catalog-check
  Home already performs (`home.md` §2), not re-derived.
- `nfc ∈ registrationMode` gating whether Asignar Tags exists at all —
  resolved once upstream (*architecture-principles.md* #1), never a per-Lot
  toggle.
- Auto-continuation from Guardar mercancía straight into Asignar Tags, for
  Businesses whose `defaultSellingMode = 'nfc'` (`decision-log.md` D46 —
  corrected from the earlier, capability-only gate) — no "¿quieres etiquetar
  ahora?" question; it's the obvious next physical action given she's
  holding the merchandise, for the merchant who's actually chosen to sell
  that way. A Paid, nfc-capable Business that hasn't made that choice is
  never auto-routed here — see §2's cross-reference note.
- The same automatic routing applies the moment she switches to `nfc` in
  Configuración (`settings.md` §2.6) — whatever's already untagged is picked
  up immediately, with no separate "go tag it now" step to remember, and
  without ever surfacing an empty tagging queue if nothing needs tagging yet
  (`decision-log.md` D46). Computed entirely inside this document's own
  resolution (§2's new step 0), triggered by a bare entry marker
  `settings.md`'s action hands off — never a fact Settings itself computes
  or reads (architect ruling, D46's own Addendum).
- Resuming an interrupted tagging queue (§3.5/§3.17) — automatic, discoverable
  as the primary action in that state, no re-prompt.
- Draft preservation of an in-progress Registrar Mercancía form across any
  accidental interruption — automatic, no discard-vs-keep prompt unless she
  explicitly asks via "Descartar."
- Catalog-row shortcut prefilling Producto for a restock — removes a redundant
  search for something she's already looking at.
- `Product.defaultPrice` resolution (`decision-log.md` D33) — captured
  exactly once, here, at Product creation (§3.8a); never re-asked at
  restock, never asked at Session/Sale time (`home.md`), never a
  per-Event decision unless she deliberately opens `events.md`'s Price
  Override entry point.
- Barcode → Product resolution (`decision-log.md` D65) — a scanned barcode
  already known to the Catalog never re-asks Nombre, Precio, or Foto;
  those were already captured once, at the barcode's first scan, and are
  reused exactly like a typed exact-name match already reuses them (§3.8,
  D33).
- The scanned barcode value itself is captured invisibly, attached to the
  same atomic Product-creation write as Nombre/Precio/Foto, at the exact
  moment a genuinely new Product is created via scan — never asked for or
  shown as its own field, the identical "capture business truth once"
  discipline `decision-log.md` D3 already applies to InventoryUnit
  generation.
- Whether a Catalog row shows the fifth NFC-eligibility zone at all — computed automatically from `Business.nfcPerProductEnabled` AND `nfc ∈ registrationMode` AND this Product having no `barcode`, the same multi-condition derivation discipline `settings.md` §2.3 already applies to `defaultSellingMode`'s own `nfc` option. Never a manual check Ana has to reason through herself.
- The composed **NFC-tagging-eligible** test (`decision-log.md` D71, §2) — computed fresh, per unit, every time Asignar Tags' auto-entry or pending-nudge logic runs; Ana never has to remember which Products she's opted in, or reconcile it herself against her selling mode.
- Assigning a fresh barcode via §3.4c automatically clears a conflicting `Product.nfcTaggingEnabled = true` in the same write — she never has to remember to turn the NFC switch off herself first (§3.4c's own new bullet).

## 8. Open questions

1. **`information-architecture.md` wording conflicted with the Supplier/cost
   exception.** IA's Journey 1 text read: "Registrar Lote (**supplier, date,
   line items: Product + qty + cost**)" — contradicting `domain-model.md`'s
   "Deliberate exceptions" section, `architecture-principles.md` #5, and
   `decision-log.md` D9, which all state Supplier and cost must stay
   structurally present but **completely invisible** until backlog calls for
   them. This spec follows the domain-model/decision-log version — Registrar
   Mercancía (§3.6) asks only for Producto + Cantidad. **Resolved by Main**:
   `information-architecture.md` Journey 1 wording has been corrected to match
   (no Architect consultation needed — not an ambiguity, just a stale line
   that hadn't caught up with D9).

2. **Is an untagged InventoryUnit sellable, in nfc mode?** The InventoryUnit
   lifecycle (`available → reserved → sold`) doesn't reference NFCTag as a
   precondition for `available`, and the "dual-purpose tag resolution"
   mechanism (`domain-model.md`) disambiguates sale-time vs. claim-time scans
   by status — it assumes a tag already exists once one is scanned. If a
   merchant defers tagging (§3.17) and a customer later wants to buy that
   physical, untagged unit, there's no tag to scan it with. This spec doesn't
   invent a block-the-sale mechanic in Selling; it only makes the untagged
   backlog visible and resumable in Inventario (§3.5) so she's nudged to
   finish before it becomes a problem at the point of sale. **Escalated to
   Architect — confirmed a genuine gap, not resolvable from the Foundation as
   it stands. Logged as Q2 in `product/02-ux/product-decisions.md`** (reclassified
   from `architect-questions.md` as a Product Decision), since
   it spans both the Inventory and Selling bounded contexts and needs a
   product decision, not a unilateral UX or Architect call. **Narrowing note
   (D23, cross-reference only):** `decision-log.md` D23 resolves a related but
   distinct, one-level-up question — whether `nfc` is even offered as a
   Session's operating mode at all, based on aggregate tagged-inventory
   coverage at Session-open time. A Not Ready Session never offers `nfc` in
   the first place, which reduces how often this Q2 scenario is reached, but
   doesn't replace Q2's own resolution for the residual case where overall
   coverage is fine yet one particular Product's units happen to lack tags —
   see `decision-log.md` D23's "Relationship to other open items" note.

3. **Is "Lot" ever meant to be individually browsable to Ana** (a "lo que
   llegó el 14 de julio" history view), or purely an internal write-time
   grouping with no dedicated read surface? `architecture-principles.md` #4
   settles that InventoryEntry/InventoryUnit never leak into language, but
   doesn't explicitly say whether the receiving-event grouping itself (Lot) is
   meant to surface as its own browsable concept. This spec takes the
   conservative position — no Lot-history screen, Catalog view only ever shows
   Product-level aggregate counts (§3.4) — and defers a possible "historial"
   screen to §11. Not escalated to Architect: a reasonable, non-blocking
   default was already chosen and documented; revisit only if a future journey
   actually needs it.

4. **Whether toggling a Product's NFC-eligibility off, mid-Event, while some of its units are already committed to that Event's allocation (`events.md`'s own scope), needs any special handling — not designed in this document.** `events.md`'s own parallel D71 amendment is the authoritative source for that surface, not this one; this item exists only so the cross-document dependency is named rather than silently assumed solved. `product-decisions.md` Q31's own worked scenario flags this same seam explicitly ("remember review nfc assignment to the events because I'm [sure] this functionality could change").

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — Home's
  cold-start CTA skips a redundant second empty screen (§3.3 annotation, §10);
  the post-save confirmation is ambient, not a screen requiring a dismiss tap
  (§3.12/§3.13); Asignar Tags auto-continues after Guardar with no
  intermediate question (§3.14, when `defaultSellingMode = nfc` —
  `decision-log.md` D46); the Catalog-row shortcut removes a redundant
  Product search (§3.4, §6).
- *"Never ask twice"* — an in-progress Registrar Mercancía draft survives any
  interruption without a discard-vs-keep prompt (§3.7); the pending-tags state
  resumes automatically via its primary "Continuar etiquetando" action, never
  asking "were you still tagging?" (§3.5/§3.17);
  the picker never asks "is this new?" — inferred via the case-insensitive,
  trimmed matching rule (§3.8).
- *"Never ask twice" (further amendment, D65)* — a barcode scan matching an
  already-known `Product.barcode` reuses the exact identity/price/photo
  resolution a typed exact-name match already gets (§3.8), with one
  deliberate, narrow, explicitly-reasoned exception: the confirm-on-scan
  tap itself (§3.8c), since a barcode is a fact she doesn't author or
  control the way a typed name is (§10). Cantidad, Precio, and Foto are
  never re-asked once a scan resolves, exactly as before.
- *architecture-principles.md #1 (capabilities resolved once, upstream),
  extended (D65)* — the barcode→Product identity trust decision is made
  exactly once, here in Inventory (§3.8c), and never re-made downstream — a
  Sale-time scan of the same barcode (`home.md` §3.9a) inherits that
  already-established trust and resolves silently, the same "decide once,
  let everything downstream inherit it" discipline this principle already
  states for `Session.operatingMode`.
- *architecture-principles.md #6 (one-way dependency direction), extended
  (D65)* — `Product.barcode` is only ever written from Inventory's own
  Product-creation/-matching path (§3.8b–§3.8e); Selling (`home.md`
  §3.9a/§3.9b) only ever reads it, matching the unchanged one-way edge this
  principle already establishes and D65's own "Selling reads Inventory
  read-only, full stop" ruling.
- *"Technology should disappear"* — InventoryUnit generation is fully
  invisible (§3.7 closing note, D3); loading states stay silent unless
  genuinely slow, both for opening the tab itself (§3.1/§3.2) and for Guardar
  mercancía (§3.10) — identical convention to `home.md`/`events.md`/`reports.md`.
- *"Business language before technical language"* — copy uses "mercancía,"
  "lo que traes," "etiquetar," "lista para vender" — never "Lot,"
  "InventoryEntry," "InventoryUnit," or a raw technical error string, anywhere,
  including the scan-failure message in Asignar Tags (§3.16), which names the
  physical fix ("acércalo de nuevo") rather than a cause like "timeout."
- *"The merchant experiences Products, the platform preserves Inventory
  traceability"* — Catalog view (§3.4) is Product + count only; the platform
  still knows every unit's originating Lot, she never sees or needs to.
- *"Every repeated decision should become automation"* — §7 is the direct
  enumeration of this applied to Inventario.
- *"Capture business truth once, reuse it forever"* — Product identity
  persists across Lots (D2); the Catalog-row shortcut and the picker's
  existing-Product list (using the matching rule, §3.8) both reuse it rather
  than re-asking. `Product.defaultPrice` is asked exactly once, at
  Product creation (§3.8a), never re-asked at restock — matching the
  identical pattern D2 already established for Product identity itself,
  extended by `decision-log.md` D33.
- *"The best interface stays out of the merchant's way"* — a failed save never
  drops her typed data (§3.11); a failed scan never drops queue progress
  (§3.16); a failed tab load never dead-ends her out of Inventario or blocks
  the nav bar (§3.18); Descartar is the only place data is deliberately lost,
  and only on her explicit request.
- *"Never delete historical data"* (D25), extended 2026-09-16/17 (`decision-log.md` D71) to the Product-level NFC toggle — turning it off, or a fresh barcode save silently clearing it, never untags or orphans an already-tagged `InventoryUnit`; only future eligibility stops (§3.4's fifth zone, §3.4c).

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — `nfc ∈ registrationMode` gates
  whether Asignar Tags exists at all in Inventario, decided at the Business
  level (Selling Mode Capability, `decision-log.md` D23), never a per-Lot
  question, and independent of any single Session's resolved
  `Session.operatingMode`.
- *#2 (aggregate boundaries follow write-throughput)* — unlike Sale (its own
  root specifically for cheap, independent per-item writes), a Lot legitimately
  batches multiple InventoryEntries into a single "Guardar mercancía" commit,
  because receiving isn't on the same latency-critical path as registering a
  sale in front of a waiting customer.
- *#4 (internal-only entities never leak into user-facing language)* — Lot,
  InventoryEntry, and InventoryUnit are never named or given their own screen;
  "Lot" is downplayed to "lo que registraste" rather than a first-class
  concept (see §8, item 3, for the residual ambiguity this leaves). The
  fifth zone's own copy ("NFC: Sí"/"NFC: No") names the mechanism she's
  actually choosing (tag vs. no tag), never `nfcTaggingEnabled` or
  `nfcPerProductEnabled` as raw field names (`decision-log.md` D71).
- *#5 (schema stability over-modeled exactly once, only when named)* — direct
  basis for excluding Supplier and cost from Registrar Mercancía (§3.6) despite
  the IA wording conflict flagged in §8, item 1 (since corrected).
- *#6 (one-way dependency direction)* — Inventario never reads or writes
  Selling/Session/Sale state; Asignar Tags only ever writes to
  InventoryUnit. Reading `Business.defaultSellingMode` here (§2 steps
  0/2/3) is the existing, allowed direction — Inventory already depends on
  Identity (`domain-model.md`'s Bounded Contexts table); nothing in this
  document ever reverses that edge. The corrected `settings.md` §2.6
  handoff (`decision-log.md` D46 Addendum) is what keeps the other
  direction clean: `settings.md` never reads Inventory-owned state back,
  only hands off a bare entry marker for this document's own,
  already-legitimate check to consume.
- **§3.4's own tap-zone disambiguation discipline, extended a third time (Q23's marker/body/price split; D65's fourth, overflow zone; D71's fifth, NFC-eligibility zone)** — every new row-level control this document has added has been reasoned explicitly against merging into an existing, already-precedented zone before being given its own, rather than defaulting to nesting it inside the nearest existing affordance (§3.4's own reasoning above).

## 10. Decisions made

- **`Product.photo` (optional) added, 2026-09-06, resolving `product/02-ux/product-decisions.md` Q23** — capturable at Product creation (§3.8a) and manageable/inspectable afterward via a new Catalog-row-level sheet (§3.4b). Zero required taps anywhere. `decision-log.md` D54, `domain-model.md`/`ubiquitous-language.md` updated to match. **[see inventory.changelog.md#decisions-q23-product-photo]**
- **The Catalog row's per-Product marker (§3.4) now renders a photo thumbnail in place of the initial letter whenever one is set** — reuses `home.md` §3.9's own corrected marker rule verbatim. **No separate read-only "zoom" screen was designed** — inspection is folded into the same management sheet (§3.4b), a deliberate choice.
- **Cantidad now defaults to 1 the instant Producto is chosen, with an added
  `[−]`/`[+]` stepper alongside the existing typed/`teclado numérico` entry
  (§3.6, §3.7).** Floor: Cantidad can never go below 1 by either input
  method. Consequently, "Guardar mercancía disabled until Producto +
  Cantidad set" now resolves to "enabled once Producto is chosen." **[see
  inventory.changelog.md#decisions-cantidad-default-1-stepper]**
- **The default Cantidad value now carries a "revisa antes de guardar"
  marker until she interacts with the field, and the same marker carries
  into the "Ya agregaste" committed-lines list for any line saved without
  ever touching its quantity (§3.6, §3.7) — resolves INV-Q1.** The marker
  disappears the instant she engages Cantidad in any way, even if the value
  stays 1. **[see
  inventory.changelog.md#decisions-cantidad-revisa-antes-de-guardar-marker]**
- **The Cantidad numeric value must render with a visible tappable/editable
  affordance, and typed entry via `teclado numérico` is a hard requirement
  rather than an incidental capability of the stepper (§3.6, §3.7).** Not a
  redesign — the stepper, default-to-1 behavior, floor at 1, and the INV-Q1
  marker are all unchanged; this makes an already-intended affordance and an
  already-true mechanic explicit. **[see
  inventory.changelog.md#decisions-cantidad-numeric-affordance-requirement]**
- **Home's cold-start CTA routes directly into Registrar Mercancía (§3.6),
  not into Inventario's own cold-start screen (§3.3).** §3.3 remains the
  resting state of the Inventario tab itself when reached any other way
  while the Catalog is still empty. **[see
  inventory.changelog.md#decisions-home-cold-start-routes-to-registrar-mercancia]**
- **Excluded Supplier and cost entirely from Registrar Mercancía**, per D9 /
  *architecture-principles.md* #5. **[see
  inventory.changelog.md#decisions-excluded-supplier-cost]**
- **Registration is a multi-line form (Producto + Cantidad per row), not a
  reuse of Home's selling grid.** **[see
  inventory.changelog.md#decisions-registration-multiline-form-not-selling-grid]**
- **One field resolves both "restock an existing Product" and "register a new
  one"** (§3.8) — no separate "create Product" screen. **[see
  inventory.changelog.md#decisions-one-field-restock-or-new-product]**
- **Elegir producto matching is case-insensitive and whitespace-trimmed**
  (§3.8) — resolving INV-M3. Deliberately stops short of fuzzy/typo-tolerant
  matching — "Bolsa" vs. "Bolsas" stay distinct. **[see
  inventory.changelog.md#decisions-elegir-producto-matching-case-insensitive-trimmed]**
- **An in-progress Lot draft persists automatically across interruption.**
  "Descartar" (§3.9) is the one deliberate, explicit way to lose it. **[see
  inventory.changelog.md#decisions-lot-draft-persists-automatically]**
- **[Superseded 2026-08-14 — see the D46 correction below.] After Guardar
  mercancía, nfc-capable Businesses were taken directly into Asignar Tags**
  for the just-created units; buttons-only businesses saw an ambient
  confirmation and stayed on Catalog view. **[see
  inventory.changelog.md#decisions-nfc-capable-auto-enter-asignar-tags]**
- **A persistent, informational "faltan etiquetas" status + resume action**
  (shape/framing superseded — see the 2026-08-07 entry below) on Catalog view
  makes an interrupted tagging queue discoverable and resumable. **[see
  inventory.changelog.md#decisions-faltan-etiquetas-status-resume-action]**
- **Catalog rows are tappable**, prefilling Registrar Mercancía with that
  Product. **[see inventory.changelog.md#decisions-catalog-rows-tappable]**
- **Inventario now defines its own tab-level Resolving and defensive-fallback
  states** (§3.1, §3.2, §3.18) — resolving INV-M1, identical convention to
  `home.md`/`events.md`/`reports.md`. **[see
  inventory.changelog.md#decisions-inventario-tab-level-resolving-fallback-states]**
- **A distinct scan-failure error state was added to Asignar Tags** (§3.16),
  alongside the existing "already assigned" conflict (§3.15) — resolving
  INV-M2. Queue progress is never affected by a failed read. **[see
  inventory.changelog.md#decisions-asignar-tags-scan-failure-error-state]**
- **The Registrar Mercancía screen's on-screen heading was changed from "Registrar mercancía" to "Registro de mercancía"** (§3.6, §3.7, §3.8's dimmed backdrop) — resolving HJR-INV-M1. The CTA itself is unchanged everywhere it appears; only the destination's title moved to a noun-form label. **[see inventory.changelog.md#decisions-registro-de-mercancia-heading-hjr-inv-m1]**
- **No Lot-history/browsable-receiving-events screen designed.** Catalog view
  shows only current Product-level aggregate counts (*architecture-principles.md*
  #4); see §8, item 3, and §11.
- **Terminology updated for `decision-log.md` D23 (cross-reference only, no
  redesign).** Every condition in this document that gates on whether the
  Assign-Tags workflow exists at all is a Business-level capability check,
  written `nfc ∈ registrationMode`, never `Session.operatingMode`. **[see
  inventory.changelog.md#decisions-d23-terminology-updated]**
- **Catalog rows now carry the same per-Product marker `home.md` §3.9
  introduces on the selling grid, and a zero-`disponibles` row now renders
  dimmed while staying fully tappable (§3.4, applying identically to §3.5,
  §3.12, §3.13, and §3.17).** Unlike the ProductTile case, a dimmed Catalog
  row stays fully tappable — dimming here signals "needs restocking," not
  "nothing to do." **[see
  inventory.changelog.md#decisions-catalog-rows-marker-zero-stock-dimming]**
- **"Continuar etiquetando" is now the primary action in the pending-tags
  Catalog-view state (§3.5, and §3.17 which mirrors it), with "Registrar
  mercancía" repositioned to explicitly secondary in that one state only —
  Product-Owner-directed refinement, 2026-08-07.** No new confirmation step,
  no change to the always-reachable Registrar Mercancía invariant, no split
  into a separate tagging flow, no new domain concept or aggregate. **[see
  inventory.changelog.md#decisions-2026-08-07-continuar-etiquetando-primary-action]**
- **`Product.defaultPrice` capture added at the exact moment a brand-new
  Product name is created (§3.8a — or via Onboarding's "Define lo que
  vendes" step, `onboarding.md` §2.2a, whichever comes first), and a
  Catalog-row-level edit affordance added for an existing Product's price
  (§3.4a) — applies `decision-log.md` D33.** Required, no silent default.
  Never re-asked for an existing Product. Neither addition introduces any
  point-of-sale discount, haggling, or per-transaction price override.
  **[see
  inventory.changelog.md#decisions-d33-defaultprice-capture-and-price-edit]**
- **Checked against `home.md`'s corrected §2 step 3 test (2026-08-08, `decision-log.md` D33) and found not to share its bug.** Inventario's Catalog view carries no "something is sellable right now" promise the way Home's "Iniciar Sesión Rápida" does — left unchanged. **[see inventory.changelog.md#decisions-checked-against-home-q2-step3-test-no-shared-bug]**
- **A zero-`disponibles` Catalog row's caption distinguishes "never registered" from "sold out" (§3.4, applying identically to §3.5, §3.12, §3.13, and §3.17) — resolves a first-impression risk `ux-critic` found.** A never-stocked row reads "sin registrar," derived automatically from whether any Lot/InventoryEntry has ever been received against that Product — no new stored field. A previously-stocked, now-sold-out Product keeps the existing "0 disponibles" caption. Neither caption changes the row's dimming, tappability, or destination. **Narrowed to a legacy-data-only case, 2026-09-04 (`product-decisions.md` Q20)** — see §3.4's own correction; the mechanism above is unchanged, only which real merchants can still reach it. **[see inventory.changelog.md#decisions-zero-disponibles-sin-registrar-vs-sold-out]**
- **Corrected 2026-08-14 (`decision-log.md` D46 — tag-assignment auto-entry
  gates on merchant intent, not mere capability).** The bullet above ("After
  Guardar mercancía, nfc-capable Businesses are taken directly into Asignar
  Tags...") is superseded, not deleted — kept for the historical trail. The
  actual gate, everywhere in this document (§2 steps 2–3, §3.5, §3.12,
  §3.13, §3.14, §3.17, §4, §7), is now `Business.defaultSellingMode ===
  'nfc'` — never `nfc ∈ registrationMode` alone. `settings.md` §2.6's
  "Cambiar a vender con tags" hands off directly into this document's
  Asignar Tags queue (§3.14) if untagged inventory already exists, or
  guides her to register merchandise first (§3.3a) if zero InventoryUnits
  have ever been received. NFC *availability* (`nfc ∈ registrationMode`) is
  unchanged and still gates whether the Assign-Tags mechanism exists in
  Inventario at all. **[see
  inventory.changelog.md#decisions-2026-08-14-d46-corrected-defaultsellingmode-gate]**
- **Further corrected, same day (architect ruling — see D46's own
  Addendum).** `settings.md`'s action now only writes `defaultSellingMode`
  and hands off a bare entry marker — never reading Inventory-owned state
  back, avoiding the dependency cycle `architecture-principles.md` #6
  forbids. This document's §2 gains a new, highest-priority trigger
  condition (step 0) performing the identical whole-Catalog check step 2
  already runs. An already-fully-tagged merchant reached via this entry
  point lands on this document's own plain Catalog view (§3.4, "Inventory
  Ready"), which now carries a one-time ambient acknowledgment for this
  entry marker. **[see
  inventory.changelog.md#decisions-2026-08-14-d46-addendum-dependency-cycle-corrected]**

- **Phone-camera barcode scanning added as a second way to resolve
  Producto in Elegir producto (`decision-log.md` D65, 2026-09-13).** New
  §3.8b–§3.8e; §3.8a gains a scan variant. **The one named, unresolved risk
  D65 left for this design pass — whether a scan resolving to an existing
  Product should show a lightweight confirm, or resolve silently like a
  typed exact-name match — is resolved here as: confirm, every time, in
  Inventory only (§3.8c).** Reasoning: a typed name is a fact Ana authors
  and controls; a barcode is a fact a manufacturer/packager printed, which
  she doesn't. D65's own risk — two unrelated Products, more likely
  off-brand/informal-market goods, coincidentally sharing a barcode, since
  Nahui does no external lookup — could silently misattribute received
  stock without her ever noticing if resolved fully silently. Inventario's
  own §1 already treats a few extra seconds per line as an acceptable cost
  for correctness (unlike Home's live-customer speed bar), and a wrong
  match here is the more consequential failure — it corrupts two Catalog
  entries' stock counts invisibly, going forward. This is the identical
  class of deliberate, narrow "never ask twice" exception §3.9's Descartar
  confirmation already establishes, not a new kind of friction. **Scoped
  deliberately narrow — only Inventory, never Selling:** the trust
  decision is made exactly once, here — and it's *that* decision, not the
  confirm step itself, that a later Sale-time scan of the same barcode
  (`home.md` §3.9a) inherits silently, the same "resolved once, upstream"
  discipline `architecture-principles.md` #1 already applies elsewhere.
  Confirm-on-scan itself fires on every scan inside Inventory, including a
  later restock of the same item — a typed name is self-authored and
  trusted going forward the moment she types it; a barcode never earns
  that same standing here, no matter how many times she scans it.
  **[see inventory.changelog.md#decisions-d65-barcode-scanning]**
- **Barcode scanning gated Paid-tier only, resolving `company/business-decisions.md` Q20 (Product Owner, 2026-09-13) — same gating class as NFC/Frequent Customers/multi-staff SELLER accounts (`decision-log.md` D27, D34, Q18).** `Business.subscriptionTier = paid` is checked once, upstream, as part of this tab's own state load (§2) — never per-scan. A Free-tier merchant's Elegir producto picker (§3.8) shows no "Escanear código de barras" row at all; §3.8a's scan variant and §3.8b–§3.8e are unreachable for her. **Chosen posture: gone entirely, no upsell/discoverability copy** — matches this document family's own existing precedent for a Business capability that isn't relevant to a Free merchant (`settings.md` §2.7's "Tu equipo," absent entirely on the Free-tier vista principal; this document's own Assign-Tags mechanism, absent entirely when `nfc ∉ registrationMode`). **Checked against, and distinguished from, `settings.md` §2.3/§3.3a's own closer precedent for the same NFC/Paid-tier gate** — the "Cómo vendes normalmente" status line there *does* name the paid-only alternative to a Free-tier merchant ("Botones (vender con tags requiere el plan de pago)"), the opposite posture. That line is an always-rendering current-state fact ("how do you sell, right now"), with no analogue for an optional action row like "Escanear código de barras" — the distinction that keeps "gone entirely" correct here despite that closer counter-example existing. Not the different precedent `reports.md` §3.4/§3.5 uses (a passive "con el plan de pago vas a ver..." card) — that pattern exists specifically to explain an otherwise-confusing missing number inside a data summary Ana is already looking at, not to replace an action affordance in a working list, which is what "Escanear código de barras" is. No proactive "why doesn't this exist" mention designed either: `decision-log.md` D27's own discoverability mention (`home.md` §3.6a's "Ready-but-still-on-botones") is scoped narrowly to a Paid-tier merchant who already holds a capability but hasn't activated it — it has no precedent for, and doesn't extend to, a Free-tier merchant who lacks the capability outright. **[see inventory.changelog.md#decisions-q20-barcode-scanning-paid-tier-gate]**
- **A write path to correct a misread `Product.barcode` added, 2026-09-16/17
  (`decision-log.md` D65, live production defect, Product Owner-confirmed,
  expedited pass).** New Catalog-row overflow affordance ("⋯," §3.4, Paid
  tier only) opens "Editar código de barras" (§3.4c–§3.4g). Replaces the
  stored value outright on save — no merge, no history — matching Editar
  precio/Editar foto's existing posture. **The one real edge case resolved
  explicitly: a freshly-scanned code already belonging to a different
  Product.** Caught before it can be staged (§3.4e), extending §3.15's
  "identifier already claimed, no reassignment" pattern and §3.8c's
  recognition-display convention — no new interaction pattern invented, no
  `knowledge-mentor` consultation needed. Stays fully inside D65's own
  "Inventory-only" write-path boundary — a second Inventory-owned write
  surface, never touching Selling. **Expedited: not yet run through
  `ux-critic`/`reviewer`.**
- **New fifth Catalog-row tap zone, an inline NFC-eligibility switch writing `Product.nfcTaggingEnabled`, added 2026-09-16/17 (`decision-log.md` D71, `product-decisions.md` Q31).** Visible only when `Business.nfcPerProductEnabled = true` AND `nfc ∈ registrationMode` AND the Product has no `barcode` — reasoned explicitly as its own zone rather than folded into the existing "⋯" overflow sheet, to preserve this document's own non-overlapping-tap-zone discipline (§3.4).
- **§2's Asignar Tags resolution (steps 0/2/3) corrected from a pure `defaultSellingMode === 'nfc'` gate to a composed NFC-tagging-eligible test** (`decision-log.md` D71) — `defaultSellingMode === 'nfc'` **or** (`nfcPerProductEnabled === true` **and** the unit's own `Product.nfcTaggingEnabled === true`). Collapses back to the original D46 rule for any Business that never turns on `nfcPerProductEnabled` — a stated, real backward-compatibility property.
- **A mixed-Product Lot now seeds Asignar Tags with only its NFC-tagging-eligible lines, never the whole Lot** (`decision-log.md` D71) — a genuine new per-Lot filtering behavior, not only a per-Business gate correction; §3.13 gains a corrected completion-copy variant for this case.
- **Assigning a fresh barcode via §3.4c now also clears a conflicting `Product.nfcTaggingEnabled`, in the same write** (`decision-log.md` D71's "never both" rule) — resolves the one remaining seam that could otherwise leave a Product both barcode-identified and NFC-tagging-eligible at once; never touches an already-tagged unit.

## 11. Future considerations

- A "historial de mercancía" (Lot-level browsing) screen, if Ana ever wants to
  see what arrived and when — not designed now; no journey calls for it yet
  (see §8, item 3).
- A named "borrador" (draft) affordance beyond simple auto-persistence, if real
  usage shows Lots are routinely split across multiple sittings (e.g., over
  several days) rather than counted in one pass.
- Editing an already-saved Lot (correcting a quantity typo after Guardar) —
  not designed; today's flow only catches mistakes before Guardar via the
  inline `[✕]` on a committed row.
- A lightweight low-stock indicator or restock nudge on Catalog view — a
  natural fit once the Intelligence context (`domain-model.md`) exists; out of
  scope for Inventario v1. **Distinct from the zero-stock dimming shipped in
  §3.4/§10** — that signal fires only at exactly 0 disponibles, using data
  already on hand; this future item is about a non-zero low-stock threshold
  (e.g., "solo te quedan 2"), which would need a configurable or
  Intelligence-derived threshold this doc doesn't define today.
- Supplier and cost fields need their own design pass once backlog explicitly
  calls for margin/Open Finance features (D9) — not before.
- Bulk/batch tag-assignment shortcuts (e.g., recognizing a rapid sequence of
  scans without a per-unit prompt) — current design assumes one conscious scan
  per unit; revisit if real usage on large Lots shows this is too slow.
- No repeated-failure escalation path in Asignar Tags (e.g., suggesting a
  different physical tag, or a "sigue sin funcionar" help affordance after
  several consecutive §3.16 failures on the same unit) — deferred; today's
  design treats every failed scan the same way regardless of how many times
  it's happened in a row. Worth revisiting if real usage on defective/foil-
  heavy tag batches shows this matters.
- Whether an existing Product's price history should ever be visible (a
  simple audit trail) — explicitly out of scope: `decision-log.md` D33
  states `defaultPrice` is a plain mutable current scalar, no version
  history. Not designed; revisit only if D33 itself is revised.
- Whether Asignar Tags ever needs a manual, non-auto-entry "go tag this Product now" affordance, independent of Guardar mercancía/Settings' handoff — not designed here; today's two entry points (§3.14) remain the only ways in, unchanged by this amendment.
- The events-side interaction this document flags but doesn't resolve (§8, item 4) — a Product's NFC-eligibility toggling off mid-Event, against already-committed allocation units — `events.md`'s own parallel D71 pass, not this document's.
