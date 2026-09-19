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

**Amended 2026-09-17 (`decision-log.md` D72 — Settings collapses to one "Activar NFC" control) — §3.14's "two entry points" bullet corrected: the former whole-Catalog Settings handoff is no longer reachable via any live merchant action.** Copy-only — the Asignar Tags auto-entry logic itself is unaffected; see §3.14's own note.

**Amended 2026-09-17 (Product Owner decision, live, building directly on D71/D72) — "Continuar etiquetando" and the combined, cross-Catalog pending-tag queue retired; tagging entry and resume both become per-Product.** Turning a Product's own NFC toggle on (§3.4's fifth zone) now immediately opens Asignar Tags (§3.14), scoped to only that Product's own pending untagged units, whenever ≥1 already exists. A new, sixth Catalog-row tap zone — a live-computed `[ N sin etiquetar ]` indicator (§3.4) — is the sole way to resume an interrupted Product's tagging after "Terminar después," deliberately independent of the toggle itself. §3.5/§3.17 (the old combined, whole-Catalog "Continuar etiquetando" Catalog-view state) are retired outright, their content folded into §3.4's own per-row rendering; §2 step 2 is retired as a tab-level branch for the identical reason. §3.13 gains a sibling, §3.13a, for a Product-scoped queue's own completion confirmation. §2 step 3 (the Lot-scoped auto-entry immediately after Guardar mercancía) is untouched — reasoned explicitly, not assumed, in §10. No new `decision-log.md` entry — same UI-flow/entry-point-correction class as D46's own Addendum, no schema or aggregate change; `architect` not required. **Expedited, live pass — `ux-critic`/`reviewer` review pending, not skipped, same posture as tonight's D71/D72 passes.**

**Amended 2026-09-17 (`decision-log.md` D73, same day as D71/D72 — composed NFC-tagging-eligible test drops its first disjunct entirely).** The test §2 uses everywhere — steps 0/2/3, §3.4's fifth/sixth zones, §3.12/§3.13/§3.14, §6/§7/§9 — was `Business.defaultSellingMode === 'nfc'` **OR** (`Business.nfcPerProductEnabled === true` **AND** the unit's own `Product.nfcTaggingEnabled === true`); it becomes simply `nfcPerProductEnabled === true` **AND** `Product.nfcTaggingEnabled === true`, full stop — no `defaultSellingMode` read anywhere in the test. A Business in `nfc` mode with `nfcPerProductEnabled = false` (or with Products that haven't individually opted in) now correctly has nothing eligible for tagging, exactly like a `buttons`-mode Business in the same state — there is no more special-cased "whole-Catalog" behavior at all. `settings.md`'s own matching correction (§2.8's gate, D73) is what makes this safe: a grandfathered `nfc`-moded Business can now reach "Activar NFC" directly, without switching to `buttons` mode first, so opting specific Products in stays reachable for her too. §2's own dormant step-0 trigger (the D72-retired Settings-handoff entry point) is now doubly dead, not merely unreachable — its own premise, seeding "every untagged unit across the whole Catalog" the instant `defaultSellingMode` read `nfc`, is itself false under the corrected test, whether or not the entry point were ever reachable again. Kept, marked as such, per this document's non-deletion discipline — not rewritten as though it still describes live or even hypothetically-live behavior. **Expedited, live pass — `ux-critic`/`reviewer` review pending, not skipped, same posture as tonight's other D71/D72/D73 passes.**

**Amended 2026-09-18 (`decision-log.md` D77, `product/99-rfc/0015-inventory-unit-removal.md` Accepted — correcting a Product's on-hand count, live production gap, Product Owner-directed, expedited) — the correction lives inside the existing Registro de mercancía screen, not behind a new menu action.** When Producto (§3.8) resolves to an *existing* Product that currently has ≥1 `available` unit, §3.6/§3.7 now show a second box above the existing one: **Cantidad actual** — the Product's live `disponibles` count, directly editable **downward only** (floor 0, ceiling = the count loaded when Producto resolved), reusing the identical `[−]`/`[+]`-plus-typed-entry stepper mechanism §3.6 already specifies, just with a ceiling instead of a floor-only affordance. This is the correction path (mistyped registration, defective units returned to supplier) — `InventoryUnit.status: available → removed`, FIFO-selected (D5's own existing consumption default, reused, not reinvented), releasing an `NFCTag` if the FIFO-selected unit happens to carry one, no reason field, no Supplier/cost field, **no tier gate** (available Free and Paid alike, same ungated posture §3.4a's Editar precio already establishes for a plain correction affordance — distinct from the genuinely premium barcode/NFC capabilities this document gates elsewhere). The existing **Cantidad** box is untouched in meaning — purely additive, creates a new Lot/InventoryEntry exactly as today — and is never folded into Cantidad actual's absolute number: the Product Owner's own reasoning, verbatim-equivalent — if 50 new units arrive while 12 are on hand, she should never have to mentally compute 62; a real shipment needs its own receipt record for Lot traceability regardless. "Guardar mercancía" commits whichever box she touched — a decrease (D77's removal write), an increase (today's existing `commitLot()` write), or both, composed as two independent writes behind one tap. For a genuinely new Product (§3.8a's create-new path, typed or via unmatched barcode scan), Cantidad actual never applies — the screen is byte-for-byte unchanged from today. **No new `decision-log.md` entry beyond D77** (already promoted from RFC 0015) — this pass only adds the entry-point/UI shape on top of an already-accepted mechanism. **Expedited — not yet run through `ux-critic`/`reviewer`, same posture as this document's other live-fix passes (D65, D71–D73).**

**Amended 2026-09-18, same day (`decision-log.md` D78, `product/99-rfc/0016-inventory-unit-bidirectional-correction.md` Accepted — supersedes this document's own D77 UI shape, not RFC 0015/D77's underlying decrease mechanism, which D78 itself retains unmodified in shape) — the two-box-at-once layout (Cantidad actual + Cantidad, both always visible together the instant an existing Product resolves) is retired, replaced by a default read-only display plus two independent, explicitly-tapped reveals.** Product Owner-directed, live production testing of D77's shipped version, same day: two quantity boxes shown simultaneously read as confusing, and the underlying mechanism (decrease-only, no ledger) was already superseded same-day by D78/RFC 0016's bidirectional, ledger-backed correction (`InventoryCorrection`, `Lot.source`). §3.6/§3.7 rewritten in full to match: an existing Product — at any live `disponibles` value, including exactly 0, not gated on it being > 0 the way D77's box was — now shows **Cantidad disponible actual** as a plain, read-only figure with a pencil/edit action (§3.6). No "Guardar mercancía" CTA is shown at all until she deliberately taps either the pencil (opening a **bidirectional** `[−]`/`[+]`-plus-typed-entry correction stepper, floor 0, no fixed ceiling — see §3.6's own reasoning) or **+ Recibir lote** (revealing the pre-existing, unmodified additive stepper, renamed "Cantidad recibida" for terminology consistency, floor 1 — same mechanism as the old "Cantidad" box, just now hidden until this tap). Both may be open and staged at once — composing a defect correction and a new receipt in the same visit, explicitly preserved from the version being replaced (§10). **This also structurally eliminates §8 item 5's own named phantom-addition risk** — the two-boxes-visible-together scenario that risk was written against no longer exists by construction; marked resolved in §8, not deleted, per this document's non-deletion discipline. For a genuinely new Product (§3.8a, either path), this amendment doesn't apply at all — there's no existing count to display or correct, so the receiving stepper (same rename, "Cantidad recibida," no behavior change) stays always visible immediately, exactly as before. **Expedited — not yet run through `ux-critic`/`reviewer`, same posture as this document's other live-fix passes (D65, D71–D73, D77).**

**Further amended 2026-09-18 (`decision-log.md` D79, `product/99-rfc/0017-nfc-composable-selling-capability.md`, Accepted — NFC becomes a live, composable selling capability elsewhere in this product; `Session.operatingMode`/NFC Readiness retired outright; `Business.defaultSellingMode` fully retired):** **narrow scope here — this document's own composed NFC-tagging-eligibility test (`nfcPerProductEnabled === true` AND `Product.nfcTaggingEnabled === true`, D71/D73) is completely unchanged by D79** and needed no logic edit anywhere it appears. What changed: every remaining live-sounding reference to `Session.operatingMode`, `defaultSellingMode`, or "NFC Readiness" as if still an active mechanism is corrected to note the retirement, or left untouched where already explicitly marked historical from the D72/D73 passes (a large majority already was). See each corrected passage below (§2's state-load list, §2's own `nfc ∈ registrationMode` reasoning paragraph, §9's two `Session.operatingMode` analogies, §9's one-way-dependency bullet's stale live-tense framing, §7's stale cross-reference to `settings.md §2.3`, §10's "is now `defaultSellingMode`" bullet, and two small historical footnotes added inside the already-retired §3.5/§3.17 sections). `nfc ∈ registrationMode` phrasing throughout this document is confirmed still correct under D79's boolean redefinition of `registrationMode` — `nfc` was always the only non-default entry in what was previously described as a set, so the phrasing's own logic never depended on set-framing being literally true; checked at every occurrence, none found load-bearing on the retired set framing.

**Amended 2026-09-18, same day (Product Owner decision, live retest of D78's shipped version — supersedes D78's own multi-line "+ Agregar otro producto" composition, not the bidirectional correction mechanism inside each box, which D78/RFC 0016 itself keeps unmodified) — Registro de mercancía becomes a single-Product-focused operation, regardless of entry point.** Once Producto resolves (§3.6) — whether via a Catalog-row tap or via the "Registrar mercancía" CTA's own picker — that screen's own read-only/correction/receipt states are the entire interaction for this visit: check/correct the current count and/or receive new stock of that one Product, then Guardar mercancía (or leave, silently preserved) returns her to Catalog view. **"+ Agregar otro producto" and the "Ya agregaste" committed-lines list (§3.7) are retired outright** — no journey named in `vision.md` or `inventory.md` §1's own merchant-goal framing supports holding a growing, cross-Product list open on this screen; the plausible-sounding "large mixed shipment in one sitting" scenario was checked explicitly and found not to be a documented merchant need (see §1's own new closing paragraph). **§3.9's Descartar confirmation is retired as a direct structural consequence** — it protected ≥1 already-committed line in that now-retired list from accidental loss; nothing is ever "committed" short of the real "Guardar mercancía" write itself anymore, and each staged fact already has its own instant, no-confirmation undo ("Cancelar"/"Quitar"). A Lot produced by this screen now always contains exactly one Product's units — the "mixed Lot" branches in §2 step 3, §3.13, and §3.14 are corrected/retired to match (see those sections). **No backend change of any kind** — `commit_lot` and `correct_product_available_count` are both already per-write operations and already correct against an array containing exactly one line; this is a UI/flow simplification sitting on top of an already-correct write layer, not a migration. **Flagged, not fixed, in this pass:** `onboarding.md` §2.2a/§3.5b–§3.5e's own multi-Product batch mechanism cites this document's now-retired §3.6/§3.7 shape as its own precedent ("identical gating shape," "the identical guarantee `inventory.md` §3.7 already gives") — that citation is now stale, though Onboarding's own flow is functionally independent and rests on a distinct, real, named need (first-time full-catalog capture, a one-time setup task) this retirement doesn't extend to; a follow-up correction pass on that citation, not a redesign of Onboarding's own flow, is recommended. `events.md` §3.21's decision log also cites "(`inventory.md` §3.7)" as precedent for an unrelated row-collapsing display idea it already distinguishes from the mechanic being retired here — also stale, also not fixed here. **Expedited — not yet run through `ux-critic`/`reviewer`, same posture as this document's other live-fix passes today (D65, D71–D73, D77, D78).**

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

A distant third, for merchants whose stock is currently NFC-tagging-eligible — `Business.nfcPerProductEnabled = true` and she's opted specific, barcode-less Products into NFC individually (`decision-log.md` D71, `product-decisions.md` Q31, corrected `decision-log.md` D73): physically walking through a stack of new garments attaching tags — a one-time-per-unit task that happens once, at receiving time, never again during selling (`vision.md`: "the merchant never switches between them while selling"). NFC *availability* (`nfc ∈ registrationMode`, `subscriptionTier = paid`) is a separate fact from this — a Paid merchant who never turns on `nfcPerProductEnabled` never has this "distant third" task appear at all, by design (`decision-log.md` D46/D71/D73), regardless of `defaultSellingMode`. **A merchant with a genuinely mixed Catalog — some Products sold with tags, most sold with buttons or barcode (Ana's own worked scenario, `product-decisions.md` Q31) — experiences this task only for the specific Products she's opted in, never for the rest of what she registers in the same visit.**

Registration speed here is real but not the same bar as Home's. `company/backlog.md`
#1 and `company/CLAUDE.md`'s core thesis are specifically about *sale*
registration under unpredictable customer flow — Inventario has no customer
waiting, so a few extra seconds per product line is an acceptable cost of
capturing real information, not a friction to hunt down artificially. What
still applies, undiminished: never make her repeat a count she already typed,
never lose it to an interruption, and never talk down to her about a task
(counting her own merchandise) she already knows how to do better than the
app does.

**Registro de mercancía is a single-Product-focused operation, not a batch/shopping-list form (Product Owner decision, 2026-09-18 — see §10).** Once she's picked or created the Product she's working on, this screen's entire job is that one Product: check/correct its current count, and/or receive new stock of it, then she's done and back on Catalog view. Nothing in `vision.md`'s own "Receive Merchandise → Register Lot" framing, or the two real contexts above, names "enter my whole day's mixed shipment across many different Products in one continuous sitting" as a distinct merchant need. The closest genuinely plausible scenario — a large, mixed haul of assorted merchandise bought from a supplier — still resolves naturally as a sequence of independent per-Product visits: pick up one pile, register that Product, move to the next; nothing about that physical reality requires a shared cross-Product list to stay open on one screen. If real usage later shows this costs her something material, that's new evidence for a deliberately-designed batch capability — not grounds to keep one by default (§11).

## 2. Resolution / decision logic

Before any of the following resolves, the tab itself must load its own state
(Catalog membership, `nfc ∈ registrationMode`, `Business.subscriptionTier` —
also gating barcode-scanning availability, see below — pending tag counts)
— this can
fail or take longer than expected under real bazaar/car/between-stalls
connectivity, same as every other tab. See §3.1/§3.2 for the near-instant/slow
presentation of that load, and §3.18 for the defensive fallback if it doesn't
resolve at all. The four numbered steps below assume that load has already
succeeded.

Evaluated automatically, every time Inventario is opened or a sub-flow
completes:

```
0. [**Dormant, D72; doubly dead, D73 — see the note below.** Reached via
   Settings' "Cambiar a vender con tags" — an entry marker only, never a
   fact `settings.md` itself computes or reads] Does at
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

2. ~~[Catalog view] Does at least one InventoryUnit exist with status =
   available, no NFCTag assigned, and NFC-tagging-eligible (see the
   composed test below)? → YES: pending-tag-work Catalog view (§3.5)...
   → NO: plain Catalog view (§3.4).~~
   **[Retired 2026-09-17.]** Catalog view no longer branches on this test
   at the tab level — there is exactly one Catalog view (§3.4) now,
   always. Whether any given row shows a pending-tag indicator is a
   **per-row**, not a per-tab, computation (see §3.4's new sixth zone) —
   every row independently checks whether *its own* Product currently has
   ≥1 `available`, untagged, NFC-tagging-eligible unit (the identical
   composed test above, applied Product-by-Product instead of
   Catalog-wide). §3.5/§3.17 are retired as distinct screen states — see
   their own headers.

3. [Inside Registro de mercancía, after "Guardar mercancía"] Does this
   Lot contain at least one InventoryUnit that's NFC-tagging-eligible
   (see the composed test below)?
     → YES: auto-enter Asignar Tags (§3.14), seeded with this Lot's own
       units — no intermediate question asked. **Corrected 2026-09-18
       (Product Owner decision, single-Product focus, §10) — a Lot from
       this screen now always contains exactly one Product's units, so
       there is no longer a "mixed Lot" case to scope among; the old
       "never the whole Lot, when the Lot mixes eligible and
       non-eligible Product lines in one commit" clause described a
       shape this screen can no longer produce going forward.**
     → NO (this Lot's own Product isn't NFC-tagging-eligible): return to
       Catalog view with an ambient confirmation (§3.12) — done,
       Inventory Ready, nothing further required.

4. [Inside Asignar Tags] Does this Lot still have any InventoryUnit
   without a tag, among the ones actually seeded into this queue?
     → YES: keep the scan prompt active (§3.14).
     → NO: complete — return to Catalog view, "lista para vender"
       confirmation (§3.13, including its own mixed-Lot copy variant
       when applicable).
```

**NFC-tagging-eligible — the composed test every step above now uses (`decision-log.md` D71, `product-decisions.md` Q31; corrected `decision-log.md` D73).** An `InventoryUnit` is NFC-tagging-eligible iff:

`Business.nfcPerProductEnabled === true` **AND** this unit's `Product.nfcTaggingEnabled === true`

**Corrected 2026-09-17 (`decision-log.md` D73) — the test's original first disjunct, `Business.defaultSellingMode === 'nfc'`, is dropped entirely; there is only one condition now, not two.** A Business that's opted specific, barcode-less Products into NFC individually (`settings.md` §2.8, `inventory.md` §3.4's own per-Product toggle below) qualifies, Product by Product, never whole-Catalog — whether her `defaultSellingMode` reads `buttons` or `nfc` makes no difference to this test at all. D73's own reasoning: a barcoded Product being swept into "needs an NFC tag" via the old first disjunct was never a state that could actually resolve — `Product.barcode` and `Product.nfcTaggingEnabled` are server-side mutually exclusive (D71) — and keeping it, combined with `settings.md`'s then-live second gating clause, would have left `nfcPerProductEnabled` permanently unreachable for any Business that stayed in `nfc` mode. **This test deliberately collapses to "nothing eligible" for any Business that never turns on `nfcPerProductEnabled`** — the same real, stated backward-compatibility property as before, now true independent of `defaultSellingMode` too: a Business in `nfc` mode with `nfcPerProductEnabled = false` has nothing eligible for tagging, exactly like a `buttons`-mode Business in the same state — there is no more special-cased "whole-Catalog" behavior at all. `Product.nfcTaggingEnabled` is never reset when `nfcPerProductEnabled` toggles off Business-wide (`settings.md` §2.8) — it simply stops counting toward this test while the Business-level flag is off, the same "two independent stored fields, no reset rule needed" pattern `settings.md` §2.3 already establishes for `defaultSellingMode`/`subscriptionTier`. Every place in this document that previously read "every untagged unit... Product-agnostically" for NFC-tagging purposes now means "every untagged, NFC-tagging-eligible unit" — checked and corrected at every occurrence, not only §3.14's own headline auto-entry: §1 (merchant goal), step 0/2/3 above, §3.4's fifth/sixth zones, §3.12/§3.13, §3.14, §7, §9. (§3.5/§3.17 are themselves already retired, 2026-09-17, kept only as historical record — not corrected further here.)

**This paragraph described step 0's behavior under the pre-D73 test; it no longer applies and is kept only for the historical trail (see step 0's own note, above, for its current doubly-dead status).** Under the corrected, single-condition test, there is no disjunct for `defaultSellingMode = 'nfc'` to trivially satisfy — step 0, even if it were still reachable, would no longer auto-seed anything from mode alone. **The per-Product path never triggers step 0, unchanged from before.** Toggling a Product's own NFC switch on triggers navigation directly into Asignar Tags (§3.14), Product-scoped, never through step 0's whole-Catalog hand-off shape — see §3.4's own corrected explanation below for the actual sequence.

**Step 0, added by architect's own corrected design (`decision-log.md` D46 Addendum) — dormant since `decision-log.md` D72, now doubly dead as of `decision-log.md` D73.** This check belonged entirely to Inventario, not Settings, for the reason given at the time: `settings.md`'s (then-live) "Cambiar a vender con tags" action wrote `defaultSellingMode` and handed off an entry marker only — never a queried Inventory fact — precisely to avoid a dependency back-edge (Inventory already depends on Identity per `domain-model.md`'s Bounded Contexts table; `architecture-principles.md` #6 forbids the reverse edge). **D72 retired that action outright** — no merchant-facing way to write `defaultSellingMode` to `nfc` from Settings exists anymore — so this entry marker can no longer be handed off by anything live; step 0 was already correctly marked dormant for that reason alone. **D73 goes further: even setting the unreachability aside, the check's own premise is now false.** Step 0 was written to reuse "the identical whole-Catalog untagged-inventory test step 2 already runs" — a test that, at the time, treated `defaultSellingMode === 'nfc'` alone as sufficient to make every untagged unit in the Catalog NFC-tagging-eligible. The composed test no longer reads `defaultSellingMode` at all (§2's own corrected definition, above) — so even a Business that had somehow reached `defaultSellingMode = 'nfc'` the instant this step evaluated would seed nothing, unless `nfcPerProductEnabled` and the individual Products' own opt-ins were also already true, in which case the ordinary per-row mechanism (§3.4's fifth/sixth zones) already handles it without step 0's involvement. Kept below, unmodified, as an accurate historical record of what this step once did — not as a description of anything currently reachable or currently true, doubly so now.

**This is deliberately a different, shallower test than Home's own §2 step 3 check** (`decision-log.md` D33 / `onboarding.md`'s 2026-08-08 amendment). Home tests for at least one `available` InventoryUnit, since offering "Iniciar Sesión Rápida" is a promise that something is sellable right now — a promise a named-but-unstocked Catalog can't honestly make (`home.md` §2 step 3, §3.3). Inventario's own question is narrower and carries no such promise: whether there's a Catalog to *display and receive against* at all — a zero-`disponibles` row (§3.4) is never a dead end here the way an all-dimmed selling grid would be in Home, since every Catalog row stays honestly labeled and fully tappable into Registrar Mercancía regardless of stock. The two tabs deliberately read different facts now; before `onboarding.md`'s "Define lo que vendes" step existed, they happened to coincide, since a Product could never exist without an accompanying Lot — that coincidence no longer holds, and this test's own substance was re-checked against it rather than assumed still correct by inertia (see `onboarding.md` §2.2a).

**Gate corrected, `decision-log.md` D46, extended `decision-log.md` D71, corrected again `decision-log.md` D73.** Steps 2 and 3 above previously gated on `nfc ∈ registrationMode` (NFC *availability*) — a Paid merchant who never intends to sell with tags was unconditionally routed into a tagging queue and shown a persistent tagging nudge, regardless of whether she'd ever choose `nfc` as her normal selling mode. Both steps now gate on the composed **NFC-tagging-eligible** test above — `nfcPerProductEnabled === true` together with the specific unit's own `Product.nfcTaggingEnabled === true`, full stop, never on `defaultSellingMode` and never on capability alone. A Paid merchant who never opts any Product into NFC individually sees no pending-tag indicator anywhere on the Catalog (§3.4's sixth zone, 2026-09-17) and is never auto-routed into Asignar Tags after Guardar mercancía — true for a `buttons`-mode Business and an `nfc`-mode (grandfathered/demo) Business alike, exactly as D46 requires ("A Paid merchant who never switches to `nfc` mode is never auto-routed into tagging, at any point, for any reason"), now with no special case left for `nfc`-mode either. A Paid merchant who opts specific Products in sees the nudge and auto-entry scoped to exactly those Products, never her whole Catalog, regardless of `defaultSellingMode`, exactly as D71/D73 require. This does not change whether the Assign-Tags step *exists* in Inventario at all — see below.

`nfc ∈ registrationMode` gates whether an "Assign Tags" step exists **at all**
in Inventario, per `information-architecture.md` ("`nfc ∉ registrationMode`
(NFC not in the Business's capability set) → no 'Assign Tags' step anywhere
in Inventario. Gated by capability availability, not by any single Session's
resolved operating mode.") and `domain-model.md`'s business-capability table.
This is resolved once, upstream, at the Business level — never a per-Lot
question like "¿quieres usar NFC para este lote?", and (**corrected
2026-09-18, `decision-log.md` D79 — `Session.operatingMode` no longer
exists as a concept**) never a Session-level question of any kind, since
Selling itself no longer resolves a per-Session mode either
(*architecture-principles.md* #1, `decision-log.md` D27, D79). Every
condition in this section is a Business-level capability check, not a
Session-level one — Inventario isn't a Selling-context screen and never
reads or depends on any particular Session's state.
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

  **Corrected 2026-09-17 (Product Owner decision, live) — toggling this switch ON now auto-enters Asignar Tags directly, Product-scoped, exactly when there's already something to tag.** The write sequence: a tap dims the row (unchanged save mechanic, above) → on a successful save, if this Product currently has ≥1 `available`, untagged unit (i.e., it's immediately NFC-tagging-eligible under the composed test the instant `nfcTaggingEnabled` lands), she's taken straight into Asignar Tags (§3.14), scoped to only this Product's own pending units — no intermediate question, the same "obvious next action" reasoning §7 already gives the post-Guardar-mercancía auto-entry (D46), now extended to this toggle. If this Product has zero `available` units at that moment (nothing yet received, or everything already tagged), the row simply un-dims in place, exactly as before — an empty tagging queue is never shown as a landing state (D46's own rule, restated here at the per-Product level). **Toggling OFF never hands off anywhere, unchanged** — it only ever stops future eligibility, the same never-untag/never-orphan invariant restated below: an already-NFC-tagged Camisas unit stays exactly as tagged and sellable via NFC; only future eligibility for not-yet-tagged units of this Product stops.

- **Corrected 2026-09-17 (Product Owner decision, live) — a sixth tap zone added, the resume affordance for an interrupted per-Product tagging queue.** The "five tap zones" enumeration above is superseded, not deleted:
  1–5. Unchanged (marker, body, price, overflow, NFC-eligibility switch).
  6. **Pending-tag indicator (new, rendered near the fifth zone when present, or in its place when absent — exact on-row position is illustrative, same disclaimer as the fifth zone's own) — `[ N sin etiquetar ]`, tappable, opens Asignar Tags (§3.14) scoped to only this Product's own pending untagged units.**

  **Rendering condition, computed fresh on every Catalog view render, per row:** this Product currently has ≥1 `available`, untagged unit that is NFC-tagging-eligible under the single-condition composed test (§2, corrected `decision-log.md` D73) — `nfcPerProductEnabled = true` and this Product's own `Product.nfcTaggingEnabled = true`. **Corrected 2026-09-17 (`decision-log.md` D73) — the composed test no longer has a second disjunct for this zone to be agnostic between.** There is one mechanism, serving one condition, independent of `defaultSellingMode` entirely — not two mechanisms collapsed into one, as the pre-D73 test briefly required.

  **Reasoned explicitly why this is a sixth, independent zone rather than folded into the fifth (the NFC toggle) — the exact gap this amendment exists to close.** Turning NFC off for a Product is a real, meaningful state change (withdraws future eligibility) that must never fire as a side effect of wanting to resume tagging; if resuming required tapping the toggle, a merchant who's already ON (which is what got her into this state in the first place) would have no way to re-enter without first turning NFC off — the wrong, and only, other thing that switch does. This is the identical "no tap resolves between two destinations" failure this document's own disambiguation discipline (§3.4's own precedent, Q23/D65/D71 each checked explicitly before adding a zone) already argues against. Nor is it folded into the fourth zone ("⋯") — that resolves unconditionally to the barcode sheet today, and this document's own §3.4 reasoning for the fifth zone already rejected overloading "⋯" with a second, conditionally-present destination for the identical reason.

  **Never requires touching the toggle.** Tapping this indicator never reads or writes `Product.nfcTaggingEnabled` — pure navigation, into the identical Product-scoped Asignar Tags destination the toggle's own auto-open (above) reaches. Whether she got here by flipping the toggle just now or by resuming days later makes no difference to the destination.

  **No save-state discipline needed** — unlike zones 1–5, this is a read-only navigation trigger, not a write; there's nothing to dim, retry, or fail beyond ordinary navigation.

  **Disappears the moment its underlying condition stops holding** — either she finishes tagging this Product's units (queue reaches 0 pending, §3.13a) or she turns the Product's own NFC toggle off, which (per the existing, unmodified D71 invariant) instantly removes any remaining untagged units from eligibility. This is not a new rule; it's the already-approved consequence of the toggle's own semantics, simply now visible through a second zone.

  Applies identically wherever this row shape reappears — §3.4's own the one, ordinary Catalog view (§3.5/§3.17 retired, see their own headers) — no separate variant exists anymore to restate it for.
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
  dimmed-backdrop sheet shape (§3.8; also §3.9, historically — see that
  section's own 2026-09-18 retirement note) rather than inventing a new
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

- **Catalog-row-level management affordance for `Product.photo`** (`product-decisions.md` Q23), opened by a bare tap on the marker/photo icon on any Catalog row (§3.4, and identically §3.5/§3.12/§3.13/§3.17) — mirroring §3.4a's own unlabeled price-figure tap target, not a separately-labeled button. This sheet's own on-screen heading is the Product's name ("Bolsas"), never the string "Editar foto" — the same relationship §3.4a already has between its section title and its actual on-screen heading, deliberately avoiding the CTA/heading-collision defect class this project has already found and fixed twice (`ux-critic-findings.md` HJR-INV-M1, HJR-EVT-M1). Reuses the exact dimmed-backdrop sheet shape already established by "Elegir producto" (§3.8) and "Editar precio" (§3.4a) — and, historically, by the now-retired "Descartar confirmation" (§3.9; see that section's own retirement note) — no new sheet/modal pattern.
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

### 3.5 [RETIRED 2026-09-17 — see status header and §10] Catalog view — with pending tag work

**This state no longer exists.** Its role — surfacing and resuming pending tag work — is now served entirely by §3.4's own sixth zone (the `[ N sin etiquetar ]` per-row indicator), computed live on the one, ordinary Catalog view. There is no longer a separate Catalog-view variant, no promoted primary action, and no combined, cross-Catalog "Continuar etiquetando" entry point. The wireframe and reasoning below are preserved as historical record only, per this project's non-deletion discipline — not a live spec.

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
**Gate corrected, `decision-log.md` D46 — this state was keyed to
`defaultSellingMode`, not capability.** Previously gated on `nfc ∈
registrationMode` alone; then required `defaultSellingMode === 'nfc'` as
well, per former §2 step 2's corrected test. A Paid-tier Business that kept
`defaultSellingMode = 'buttons'` never saw this state, even with untagged
inventory sitting in her Catalog. **[Further historical note, 2026-09-18: `defaultSellingMode` is separately, fully retired at the Foundation level by `decision-log.md` D79 — this whole passage was already non-live per D72's own retirement of this state, before that.]**
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
  Selling's former NFC Readiness check — the "how many sellable units
  already have tags" evaluation once run at Session-open time (`home.md`
  former §2/§3.6a) — were two views of the identical underlying
  tagged/untagged split on `available` `InventoryUnit`s. **[Further
  historical note, 2026-09-18: NFC Readiness itself is separately retired
  outright at the Foundation level by `decision-log.md` D79 — not
  re-thresholded — so this cross-reference now points at a retired
  mechanism on both sides. Kept here as historical record only, alongside
  the rest of this already-retired §3.5.]**
- **Further amended 2026-09-16/17 (`decision-log.md` D71, `product-decisions.md` Q31).** This state's gate is extended, not replaced — reached when the composed NFC-tagging-eligible test (§2) is true for at least one untagged, `available` unit anywhere in the Catalog: `defaultSellingMode === 'nfc'` (unchanged, the original D46 case), **or** `Business.nfcPerProductEnabled === true` with at least one Product individually opted in (§3.4's new fifth tap zone) that still has an untagged unit. A Paid merchant with `defaultSellingMode = 'buttons'` who has opted, say, only Camisas into NFC now sees this nudge exactly when a Camisas unit is still untagged — never for Plumas or any other Product she hasn't individually opted in, and never at all if she hasn't turned on `nfcPerProductEnabled` in the first place.

### 3.6 Registro de mercancía — Producto seleccionado, una operación enfocada (rewritten 2026-09-18, Product Owner decision, live — single-Product focus; the bidirectional-correction/receipt mechanism inside each box is unchanged from D78/RFC 0016)

**Producto not yet resolved (blank open):**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Producto                        │
│  [ Elegir producto ▾ ]           │
│                                │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Corrected 2026-09-18.** No quantity field of any kind renders before
  Producto resolves — previously this state showed a live "Cantidad" box
  pre-emptively, harmless only because that box was unconditional under the
  old model. Under this amendment, which fact to show (read-only + pencil
  for an existing Product, vs. an always-visible receiving stepper for a
  new one) depends on how Producto resolves, so showing either eagerly
  before that's known would be actively misleading, not merely premature.
  "Guardar mercancía" stays absent here too — nothing is stageable yet.

**Producto resolves to an existing Product — default, read-only state:**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Producto                        │
│  Bolsas                          │
│                                │
│ Cantidad disponible actual        │
│  17                     [ ✎ Corregir ]│
│                                │
│  [ + Recibir lote ]              │
│                                │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Gating condition, stated in full:** this state renders whenever
  Producto resolves to a Product that already exists in the Catalog —
  **regardless of its live `disponibles` value, including exactly 0.**
  Corrected from D77: that version omitted the box entirely at 0
  disponibles, reasoning it was a degenerate, decrease-only control at that
  floor. Now that correction is bidirectional, 0 is a legitimate starting
  point for a real correction (an undercounted sold-out Product, or a Product
  she'd registered but genuinely miscounted down to zero) — there is no
  degenerate case left to omit. A brand-new Product (§3.8a, either path)
  still never shows this at all — see that section, unchanged in spirit,
  renamed only.
- **Nothing on screen is editable by default.** "Cantidad disponible
  actual" renders as plain text — the doc's own "plain text = passive/
  informational" convention (§3 intro) — with exactly one tap target next
  to it: the pencil/edit action. **No "Guardar mercancía" CTA renders in
  this state.** Direct application of the Product Owner's own reasoning:
  there is nothing to save until she initiates an actual correction or
  receipt operation. This is a genuine visibility change, not merely
  disablement — matching this document's own precedent for withholding an
  action affordance entirely rather than showing it inert (§2's "not
  disabled, not shown-then-blocked, simply absent" posture, applied here to
  a data-state instead of a capability gate).
- **Producto stays tappable while nothing has been staged yet.** Tapping
  the Product's name re-opens Elegir producto (§3.8) to change the
  selection, as long as neither the correction stepper nor Cantidad
  recibida currently holds a real, nonzero staged value. The instant
  either does, Producto locks (renders as plain text, matching every
  other state in this document) for the rest of this operation.
  **Amended 2026-09-18 (Product Owner decision, single-Product focus) —
  there is no longer an "+ Agregar otro producto" to fall back on if she
  wants to work on a different Product after staging something here.**
  Once Producto is locked, her only two paths forward are finishing this
  operation (tapping "Guardar mercancía," once it's enabled) or backing
  out of it — either by discarding the specific staged change via that
  box's own "Cancelar"/"Quitar" (below), or by leaving the screen
  entirely, which silently preserves whatever's staged and resumes it
  later (§4). To work with a different Product, she opens a fresh
  Registro de mercancía from Catalog view (§3.4) — a new, independent
  operation, never a continuation of this one. Direct application of the
  Product Owner's own words: "Once a specific product is selected and I
  am working on that product, keep the screen focused on that product...
  If the merchant wants to work with another product, she can
  finish/cancel this operation and select another product through the
  appropriate inventory flow."

**Correction mode — pencil tapped:**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Producto                        │
│  Bolsas                          │
│                                │
│ Cantidad disponible actual        │
│  [ − ]  [ 17 ]  [ + ]             │
│  Corrígela si algo no cuadra —     │
│  por ejemplo, piezas defectuosas   │
│  que regresaste, o si contaste     │
│  más de lo que dice Nahui.        │
│      Cancelar                    │
│                                │
│  [ + Recibir lote ]              │
│                                │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Default value on open: the loaded count itself (17), unmarked** — a
  known fact, not a guess, same "known fact, not a guess" posture D77
  already established for its own default. Opening correction mode with no
  further action is a genuine no-op: delta = 0, nothing to save, "Guardar
  mercancía" stays absent.
- **Bidirectional, stated in full.** `[−]` decrements toward 0, where it
  goes inert — the hard floor, matching D78's own reservation-safety rule
  (only `available` units are ever eligible for a decrease; she can never
  correct below what's physically possible to remove). `[+]` increments
  with **no fixed ceiling** — a deliberate call, not an omission: D78/RFC
  0016 states the increase direction is "unconstrained by construction" (it
  only ever mints new units, never touches an existing row, so no
  impossible state is reachable), and this document's own existing
  "Cantidad recibida" stepper has never carried an artificial UX ceiling
  either. Imposing one here for the increase direction would contradict the
  mechanism's own shape, not protect it.
- Typed entry (tapping the bracketed value opens `teclado numérico`, same
  hard requirement as every other quantity field in this document) is
  clamped only at the floor: a typed negative value or a cleared field
  reverts to 0. A typed value above the loaded count is accepted outright
  — that's precisely the new, +N correction case this whole amendment
  exists for, never clamped or second-guessed (`decision-log.md` D3, "the
  merchant still just types a quantity, the platform expands it").
- **"Cancelar" collapses correction mode back to the read-only display,
  discarding any typed/stepped value** — reverts to the loaded count,
  no confirmation needed. This screen carries no state anymore where a
  blocking confirmation is warranted — see §3.9's own retirement note.
- **The stepper's ceiling for the decrease direction is fixed to the count
  loaded when Producto resolved, not re-fetched live while she stays on
  this screen** — same snapshot-until-Guardar convention, and the same
  race-condition convergence discipline, D77 already established: if the
  real `disponibles` has moved by the time she taps "Guardar mercancía"
  (the ordinary case being a concurrent Sale on another device), a decrease
  converges toward what's actually left to remove rather than erroring —
  the identical conditional-write, zero-rows-affected discipline
  `product/99-rfc/0016-inventory-unit-bidirectional-correction.md` inherits
  unmodified from RFC 0015. **An increase carries no equivalent race
  condition at all** — it never touches an existing row, only mints new
  `available` units, so nothing she does elsewhere on another device can
  invalidate it (D78's own "no impossible state is reachable" finding).
- **Only `available` units are ever eligible for a decrease — never
  `reserved`** (an in-flight Sale elsewhere), unchanged from D77/RFC 0015,
  now additionally the specific invariant D78 names at the architecture
  level.
- **No reason field, no Supplier field, no per-unit picker.** FIFO
  selection only for a decrease (D5, reused); an increase mints fresh,
  untagged `available` units through the ordinary Lot/InventoryEntry
  generation path (`Lot.source = 'correction'`, invisible to Ana — see §9).
  Deliberately deferred, per RFC 0016's own v1 scope (§11).
- **Never delete historical data (D25), retained:** the original
  Lot/InventoryEntry's received quantity, and every historical Sale, are
  untouched by a correction in either direction — only the derived,
  unit-status-driven `disponibles` count changes. D78's own worked example:
  received 5, sold 4, available 1 — if she counts 3, the correction is a
  +2 movement on top of that history, never a rewrite of the original 5 or
  the four Sales.
- **A positive correction and a real receipt are different business facts
  and stay distinguishable in the ledger even though both can increase
  `disponibles`** (`Lot.source = 'correction'` vs. the default
  `'supplier_delivery'`, D78) — this document never names either value on
  screen (*architecture-principles.md* #4); the distinction is carried
  entirely by which of the two on-screen actions she actually used (pencil
  vs. "+ Recibir lote"), never asked as a separate question.
- **Ungated — no `subscriptionTier` check**, unchanged from D77. Correcting
  your own count is basic inventory accuracy, not a premium capability.

**"+ Recibir lote" tapped — receipt stepper revealed:**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Producto                        │
│  Bolsas                          │
│                                │
│ Cantidad disponible actual        │
│  17                     [ ✎ Corregir ]│
│                                │
│ Cantidad recibida                │
│  [ − ]  [ 1 · revisa antes de guardar ]  [ + ]│
│  Lo que te llegó nuevo             │
│  (o escribe la cantidad)         │
│      Quitar                      │
│                                │
│  [      Guardar mercancía    ]   │  enabled — a real qty (1) is already staged
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Identical mechanism to D77's/the pre-D77 "Cantidad" box, unchanged —
  renamed "Cantidad recibida" for terminology consistency with this
  amendment's own new naming, nothing else about it changes.** Floor 1
  (never below — "0 units received isn't a real receiving event," carried
  forward unmodified); default 1 with the existing "· revisa antes de
  guardar" marker (INV-Q1, unchanged); `[−]`/`[+]` plus typed entry via
  `teclado numérico`, no fixed ceiling (unchanged); creates a real new
  `Lot`/`InventoryEntry` with `source = 'supplier_delivery'` (D78) exactly
  as today's `commitLot()` write already does.
- **"+ Recibir lote" itself disappears once tapped, replaced by this
  section.** "Quitar" collapses it back to the plain link, discarding
  whatever quantity was staged — same low-stakes, no-confirmation-needed
  posture as correction mode's own "Cancelar."
- **The instant this section opens, "Guardar mercancía" becomes visible
  and enabled** — its default value (1) is already a real, savable
  quantity, the identical reasoning that made Guardar mercancía enable the
  instant Producto resolved under the pre-amendment design ("Guardar
  mercancía disabled until Producto + Cantidad set" → "enabled once
  Producto is chosen," §10) — now scoped to the moment she deliberately
  asks for a receiving quantity to exist, rather than assumed the instant
  Producto resolves.

**Both correction mode and "+ Recibir lote" open at once — explicitly
supported, order-independent:**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Producto                        │
│  Bolsas                          │
│                                │
│ Cantidad disponible actual        │
│  [ − ]  [ 19 ]  [ + ]             │
│  Corrígela si algo no cuadra —     │
│  por ejemplo, piezas defectuosas   │
│  que regresaste, o si contaste     │
│  más de lo que dice Nahui.        │
│      Cancelar                    │
│                                │
│ Cantidad recibida                │
│  [ − ]  [ 1 · revisa antes de guardar ]  [ + ]│
│  Lo que te llegó nuevo             │
│      Quitar                      │
│                                │
│  [      Guardar mercancía    ]   │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Deliberately preserved from the version being replaced.** The
  Product Owner's own worked scenario — "a merchant who's correcting a
  defect and receiving new stock in the same visit" — was explicitly
  supported under D77's two-box shape, and nothing in her replacement
  direction retracts it; only the *default/at-rest* screen shape changes.
  The pencil and "+ Recibir lote" are independent triggers, tappable in
  either order, with no interaction between them beyond both contributing
  to whether "Guardar mercancía" is visible/enabled (below).
- "Guardar mercancía" composes up to two independent writes for this line
  exactly as before D78: a correction (increase or decrease, per RFC 0016)
  and/or a real receipt, resolved together behind one tap (§4).

**Producto resolves to a brand-new Product (§3.8a, either path) — unchanged in spirit, renamed only:**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Producto                        │
│  Chalecos                        │
│                                │
│ Cantidad recibida                │
│  [ − ]  [ 1 · revisa antes de guardar ]  [ + ]│
│  (o escribe la cantidad)         │
│                                │
│  [      Guardar mercancía    ]   │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **This amendment doesn't apply to a genuinely new Product at all.**
  There's no existing `disponibles` to display or correct — no "Cantidad
  disponible actual" line, no pencil, no "+ Recibir lote" tap required.
  The receiving stepper stays always visible immediately, floor 1, default
  1, exactly as the pre-amendment "Cantidad" box already behaved — only
  its label changes, to "Cantidad recibida," for terminology consistency
  with the existing-Product states above. "Guardar mercancía" is visible
  and enabled the instant Producto resolves, unchanged from today.

**"Guardar mercancía" — what it does and where it goes, stated explicitly (Product Owner-directed, 2026-09-18).** Visible and enabled only once this Product's draft carries at least one real, nonzero staged effect — an open correction whose value differs from the loaded count, and/or an open (floor-1) receipt. Tapping it commits whichever is staged, composed as up to two independent writes behind one tap (a correction — `InventoryCorrection` + FIFO removal, or a `source='correction'` Lot, RFC 0016 — and/or a receipt — `source='supplier_delivery'` Lot, the existing `commitLot()` write) — for this one Product, never a list. On success, she lands back on Catalog view (§3.4), already showing this Product's fresh `disponibles` count, with the same ambient confirmation this document already specifies (§3.12/§3.13, or Asignar Tags auto-entry per §2 step 3, when this Product's own units are NFC-tagging-eligible) — no intermediate "add another?" prompt, since there's nothing left to add from this screen. To register a different Product next, she starts over from Catalog view — never a continuation of this visit.

*(The expansion into individual InventoryUnit records — and, for a correction, into an `InventoryCorrection` ledger row plus, for an increase, a `source='correction'` Lot — happens automatically behind "Guardar mercancía." It is invisible to Ana; no screen represents it. `decision-log.md` D3/D78.)*

**Shared, unchanged from before this amendment (still apply as written):**
- If reached by tapping a Catalog row (§3.4), Producto arrives already
  filled with that row's Product, landing on the default read-only state
  (or the always-visible receiving stepper, for the "sin registrar" legacy
  case) — never with anything pre-staged. (Unchanged from D78.)
- On-screen heading reads "Registro de mercancía" (HJR-INV-M1, unchanged).
- Only Producto + Cantidad (disponible actual / recibida) are ever asked —
  no Supplier, no cost field (*architecture-principles.md* #5, D9).
- Price is never asked on this screen — resolved upstream in Elegir
  producto (D33), unchanged.
- **Form is a single-Product receiving/correction event, not the Home
  selling grid** — unchanged reasoning (`home.md` §3.9), corrected from
  "multi-line" now that the batch shape is retired.
- The numeric value in any open stepper must render with a visible
  tappable/editable affordance (never plain, static-looking text) and
  typed entry via `teclado numérico` is a hard requirement, not incidental
  — unchanged, applies identically to the correction stepper and Cantidad
  recibida alike.

### 3.7 [RETIRED 2026-09-18 — see status header and §10] Registrar mercancía — con líneas comprometidas, editando la siguiente

**This state no longer exists.** Registro de mercancía is now a single-Product-focused operation, regardless of entry point (Product Owner decision, live — see status header): once Producto resolves (§3.6), that screen's own read-only/correction/receipt states are the entire interaction for this visit. There is no "commit this Product and open the next" mechanic anymore, so there is nothing for a "Ya agregaste" list to ever show. The wireframe and reasoning below are preserved as historical record only, per this project's non-deletion discipline — not a live spec.

[— original §3.7 content, unmodified, continues below this note —]

```
┌───────────────────────────────┐
│ ← Inventario                     │
│  Registro de mercancía            │
│                                │
│ Ya agregaste:                    │
│  Bolsas — 10                [✕] │
│  Accesorios — corregido a 19       │
│  (antes 17)                [✕]  │
│  Camisas — corregido a 8          │
│  (antes 10) + 50 nuevas    [✕] │
│  Playeras — 1 · revisa       [✕] │
│                                │
│ Producto                        │
│  [ Elegir producto ▾ ]           │
│                                │
│      Descartar                   │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
*(The active/next row beneath "Ya agregaste" renders exactly as §3.6's own
states — blank, default read-only + pencil + Recibir lote, correction mode
open, receipt mode open, or a new Product's always-visible receiving
stepper — never re-described here; whichever of §3.6's shapes currently
applies to the row being worked on is what's shown.)*

- **Committed-line rendering, rewritten for bidirectional correction
  (`decision-log.md` D78, replaces D77's decrease-only rendering):**
  - **A pure receipt (Cantidad recibida only, correction never opened or
    opened-then-cancelled-with-no-delta) renders exactly as it always has**
    — "Bolsas — 10." Zero visual cost for the common case.
  - **A pure correction, either direction, renders as "corregido a N
    (antes M)"** — natural, direct language, never "removed," "increased,"
    `InventoryUnit`, or any status/entity name (*global-principles.md*,
    "business language before technical language"). "Accesorios —
    corregido a 19 (antes 17)" (an increase) and "Bolsas — corregido a 12
    (antes 17)" (a decrease) use the identical phrasing — the sign of the
    change is legible from the two numbers themselves, never called out
    with a separate "+"/"−" label.
  - **A line where both a correction and a real receipt happened together
    renders both facts, never merged into one number** — "Camisas —
    corregido a 8 (antes 10) + 50 nuevas" — matching §3.6's own "never
    fold into the same editable number" rule (Cantidad disponible actual
    and Cantidad recibida stay two independent facts even after commit).
  - **A committed line can now only exist if it carries a real, nonzero
    effect** — a corollary of §3.6's own "+ Agregar otro producto" gate,
    below. There is no longer a "she opened the row and changed nothing"
    committed line, unlike before this amendment; that visit simply never
    commits anything, by construction.
  - **`[✕]` on any committed line undoes the entire line** — reverts
    Cantidad disponible actual to its loaded, unedited value and clears any
    staged Cantidad recibida — the identical "fix a miscount before
    saving" behavior `[✕]` already gave a plain addition line, now
    covering a compound or bidirectional fact identically.
  - The existing marker-carry-through rule (INV-Q1: an unreviewed
    Cantidad recibida default of 1 carries its "· revisa" marker into
    this list) is unchanged and composes directly with the above —
    "Camisas — corregido a 8 (antes 10) + 1 · revisa [✕]" is a real,
    expected rendering whenever she corrects Cantidad disponible actual
    and separately opens Recibir lote without ever touching its default.

- **"+ Agregar otro producto" is now conditional, not unconditional the
  instant Producto resolves — a direct, necessary consequence of this
  amendment (`decision-log.md` D78).** It commits the current row and
  opens a fresh blank one, exactly as before, but is only enabled once the
  active row carries a real, nonzero effect: an open correction whose value
  differs from the loaded count, and/or an open (necessarily nonzero,
  floor-1) receipt. For a brand-new Product, Cantidad recibida's own
  default of 1 already satisfies this the instant Producto resolves — no
  behavior change there. For an existing Product sitting at rest (pencil
  and "+ Recibir lote" both untouched), it's absent — matching "Guardar
  mercancía"'s own absence in that same state, and for the identical
  reason: nothing to commit yet.
- `[✕]` on a committed row, "Descartar" (§3.9, unchanged, only appears once
  ≥1 line is committed), and the silent draft-preservation-across-
  interruption guarantee (§3.7, unchanged) all carry forward exactly as
  written before this amendment.
- **The affordance requirement for any live numeric stepper (bracketed,
  tappable, never plain display text) applies identically to the
  correction stepper and Cantidad recibida** — unchanged from §3.6.

*(The expansion of each committed line into individual InventoryUnit
records — and, for a correction, into an `InventoryCorrection` ledger row
plus, for an increase, a `source='correction'` Lot — happens automatically
behind "Guardar mercancía." It is invisible to Ana; no screen represents
it. `decision-log.md` D3/D78.)*

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
- **Corrected 2026-09-18 (`decision-log.md` D78, RFC 0016).** Whenever
  Producto resolves to an existing Product — typed exact-name match here,
  the Catalog-row shortcut (§3.4), or a barcode confirm-on-scan (§3.8c,
  "Sí, es este") — that Product's live `disponibles` count is carried
  forward into the draft as the value Cantidad disponible actual displays
  read-only, in the same motion, **whether it's 0 or greater** (D77's own
  ">0 only" gate is retired along with its box — see §3.6). Never a
  separate fetch or question; the same "capture business truth once, reuse
  it forever" discipline this section's own price/photo reuse already
  follows. §3.8a (new-Product creation, either path) is unaffected —
  Cantidad disponible actual never applies there; that path keeps its
  always-visible "Cantidad recibida" stepper (renamed only, D78).

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
  rare-but-consequential, deliberate departure from "never ask twice"
  this document once also shared with §3.9's Descartar confirmation —
  now the sole remaining instance in this document, since that section's
  2026-09-18 retirement (see its own note); not a violation of "never
  ask twice," reasoned the same way it always was — justified because
  Inventario's own §1 already treats a few extra seconds here as an
  acceptable cost for correctness, unlike Home's live-customer speed bar.
  Full reasoning in §10.
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
  tapped it from the list (§3.8) — back to §3.6 with Producto
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
- No separate save/error state of its own: like the rest of this
  single-Product draft (Producto, Cantidad, Foto), this value is held in
  the in-progress form (§3.6) and only actually written, atomically with the new
  Product and the rest of the Lot, at "Guardar mercancía" (§3.10/§3.11) —
  a save failure there already preserves everything typed or selected, including a
  not-yet-created Product's name, price, and photo (§3.11's existing guarantee,
  extended to this field).
- Plain numeric peso entry — no currency picker, no decimal/whole-number
  toggle invented here.
- On "Agregar 'Chalecos'," returns to §3.6 with Producto selected as
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
  outcome on success (back to §3.6, Producto resolved, Cantidad
  defaulting to 1) as the typed path — only the entry heading and the
  Nombre field differ.
- **If she backs out without completing it**, the same silent-draft-
  preservation guarantee already covering Producto/Cantidad/Foto (§3.6)
  extends to the scanned barcode value — never dropped by an interruption
  any more than anything else on this draft.

### 3.9 [RETIRED 2026-09-18 — see status header and §10] Descartar confirmation

**This state no longer exists.** It protected a specific risk — losing ≥1 already-committed line from a growing, multi-Product "Ya agregaste" list (§3.7, itself retired the same day) — that no longer exists now that Registro de mercancía is single-Product-focused. Nothing is ever "committed" short of the real, final "Guardar mercancía" write itself; an in-progress correction or receipt is undone instantly and without ceremony via that box's own "Cancelar"/"Quitar" (§3.6), and leaving the screen entirely without saving silently preserves whatever's staged rather than losing it (§4) — there is no remaining scenario on this screen where a blocking "are you sure?" gate protects real, otherwise-unrecoverable work. The wireframe and reasoning below are preserved as historical record only, per this project's non-deletion discipline — not a live spec.

[— original §3.9 content, unmodified, continues below this note —]
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
│  No se pudo guardar. Bolsas      │
│  sigue aquí, intenta de nuevo.     │
│  Bolsas — corregido a 19          │
│  (antes 17) + 1 nueva             │
│      [   Reintentar   ]          │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- Her staged data for this Product is never dropped by a failed save —
  **including any Foto selected for a new Product (§3.8a,
  `product-decisions.md` Q23)** — same guarantee already covering
  Producto/Cantidad/Precio. **Corrected 2026-09-18 (single-Product
  focus)** — the summary line reuses the "corregido a N (antes M)" / "N
  nuevas" copy this document already established for a staged, not-yet-
  saved line (formerly rendered in the now-retired §3.7 committed-lines
  list; relocated here, describing this one Product's own staged effect,
  never a list). *global-principles.md*, "the best interface stays out of
  the merchant's way."

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
- **Further corrected 2026-09-17 (`decision-log.md` D73).** The composed test above no longer reads `defaultSellingMode` at all — so a grandfathered/demo Business whose `defaultSellingMode = 'nfc'` reaches this same "Inventory Ready" state (not §3.13) for any Lot where she hasn't individually opted the relevant Product(s) into NFC via `nfcPerProductEnabled`, exactly like a `buttons`-mode Business in the same state. There is no more mode-based special case: reaching §3.12 vs. §3.13 depends entirely on whether this Lot's units are NFC-tagging-eligible under the single, per-Product condition, never on which selling mode she happens to be in.

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
  Lot containing ≥1 NFC-tagging-eligible unit — `nfcPerProductEnabled = true`
  and the relevant Product(s) individually opted in (`decision-log.md` D46,
  corrected D71, corrected again D73 to drop the earlier
  `defaultSellingMode = 'nfc'` whole-Catalog case as a separate path) —
  Inventory Ready genuinely means both received *and* tagged — same screen
  shape, different, honest wording.
- **[RETIRED 2026-09-18 — see status header and §10.] Former mixed-Lot variant, kept as historical record only.** This variant covered a Lot that mixed NFC-tagging-eligible and non-eligible Product lines in one Guardar mercancía (e.g., Camisas + Plumas registered together) — a shape only reachable under the now-retired multi-Product batch mechanism (§3.7's own retirement note). A Lot from this screen now always contains exactly one Product's units, so a mixed Lot can no longer be created going forward, and this variant's copy never renders for any new Lot. Preserved below unmodified, per this document's non-deletion discipline, not as a description of anything currently reachable:

  **Further amended 2026-09-16/17 (`decision-log.md` D71) — a mixed-Lot variant, same screen shape, corrected copy.** For a Lot that mixed NFC-tagging-eligible and non-eligible Product lines in one Guardar mercancía (e.g., Camisas + Plumas registered together), this same screen is reached once Camisas' own units finish tagging — but "Lista para vender" now needs to state plainly that Plumas' units were never part of that queue and were already sellable the moment Guardar mercancía succeeded, not left out or forgotten:
  ```
  Mercancía lista para vender ✓
  Camisas ya está etiquetada. Plumas no necesita tag —
  se vende con botones, y ya está lista.
  ```
  For a Lot where every line was NFC-tagging-eligible, the plain, undifferentiated "Mercancía lista para vender ✓" stays exactly as it already was — this variant only renders when the Lot genuinely mixed eligible and non-eligible lines, a fact this document already has on hand from §2 step 3's own per-Lot test, never guessed or inferred separately. (Corrected 2026-09-17, `decision-log.md` D73 — the old "whole-Catalog `defaultSellingMode = 'nfc'`" phrasing here described a case that no longer exists as a distinct path; every Lot's eligibility is decided per-Product now, never per-mode.)

### 3.13a Post-tagging confirmation — Product-scoped queue complete (new 2026-09-17, toggle-ON or resume-indicator entry)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Camisas ya está etiquetada ✓    │  ambient, fades — not a separate screen
│  ┌───────────────────────────┐ │  requiring a tap to dismiss
│  │[B] Bolsas    $350   12 disponibles [⋯]│ │
│  │[C] Camisas   $250   8 disponibles [NFC: Sí][⋯]│ │
│  └───────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Reached whenever a Product-scoped Asignar Tags queue (§3.14, entered via the fifth zone's toggle-ON auto-open or the sixth zone's resume tap) finishes with 0 units remaining.** A distinct case from §3.13, which is specifically the post-Guardar-mercancía, Lot-scoped completion — this state carries no "just registered" framing, since a Product-scoped queue may resolve units received long before today.
- Names the specific Product, not a generic "lista para vender" — she just finished exactly one Product's stack, and the copy should say which one, matching this document's own precedent for naming specifics rather than a generic line whenever the underlying fact is already on hand (§3.13's own mixed-Lot variant, same reasoning).
- Same ambient, fading, no-tap-to-dismiss shape as §3.12/§3.13 — no new confirmation pattern invented.

### 3.14 Asignar tags — active queue (three entry points, all seeding the identical scan-driven queue — `decision-log.md` D46/D71, amended 2026-09-17)
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
- **Three entry points now reach this identical queue mechanism, differing only in what's seeded and the summary line shown — the scan mechanics, error states (§3.15/§3.16), and "Terminar después" behavior below are unchanged across all three:**
  1. **Lot-scoped** — immediately after "Guardar mercancía" succeeds (§2 step 3), seeded with the just-saved Lot's own units, when NFC-tagging-eligible. **Corrected 2026-09-18** — a Lot from this screen now always contains exactly one Product's units (single-Product focus, §10), so this is no longer a filter among multiple lines, simply the one Product's own units.
  2. **[Retired, D72; doubly dead, D73]** — the former whole-Catalog Settings handoff. Not only is it no longer reachable via any live merchant action (D72) — its own underlying seeding premise, "every untagged unit across the whole Catalog qualifies once `defaultSellingMode` reads `nfc`," is itself no longer true under the corrected composed test (D73, §2), whether or not the entry point were ever reachable again. Kept only as an accurate historical description of what this document's dormant resolution logic once did, never as a description of anything currently or hypothetically live.
  3. **Product-scoped (new, 2026-09-17)** — via §3.4's fifth zone (toggle-ON, when ≥1 eligible unit already exists) or sixth zone (the `[ N sin etiquetar ]` resume indicator) — seeded with only that one Product's own NFC-tagging-eligible untagged units, drawn from however many Lots/receiving-events they originated in. This is the *only* entry point that survives an interruption: after any "Terminar después," from any of the three entry points above, resuming is always Product-scoped going forward — there is no persisted, ordered, cross-Product queue position to restore. Each row's own sixth-zone indicator always reflects the current, live count.
- **Wireframe variant for entry point 3 — the "Lo que registraste:" summary line is dropped** (it implies units just received, which isn't necessarily true for a resumed or toggle-triggered Product-scoped queue):
  ```
  ┌───────────────────────────────┐
  │  Asignar tags                   │
  │  Etiquetando: Camisas             │
  │  Faltan 3 de 10                  │
  │                                │
  │      Acerca el tag a la          │
  │         prenda                   │
  │                                │
  │  [ Terminar después ]            │
  ├───────────────────────────────┤
  │ Hoy [Inventario] Eventos Resultados │
  └───────────────────────────────┘
  ```
- **Completion:** entry point 1 (Lot-scoped) still completes into §3.12/§3.13, unchanged. Entry point 3 (Product-scoped) completes into §3.13a.
- **"Terminar después" always returns to the one, ordinary Catalog view (§3.4)** — never to a retired §3.5/§3.17 — where every still-pending Product's own sixth-zone indicator reflects exactly what's left, independently resumable.

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

### 3.17 [RETIRED 2026-09-17 — see status header and §10] Asignar tags — "Terminar después"

**This state no longer exists as a separate Catalog-view variant.** "Terminar después" now returns to the one, ordinary Catalog view (§3.4), where each still-pending Product's own sixth-zone `[ N sin etiquetar ]` indicator reflects exactly what's left — see §3.14's own note. The wireframe and reasoning below are preserved as historical record only, per this project's non-deletion discipline — not a live spec.

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
  D46): `defaultSellingMode === 'nfc'`, not mere capability.** This state was
  only ever reached from an already-active Asignar Tags queue (§3.14), which
  itself only ever opened for an NFC-tagging-eligible Business/Lot (§2's
  composed test, `decision-log.md` D46/D71) — no separate gate, only inherited. **[Further historical note, 2026-09-18: `defaultSellingMode` is separately, fully retired at the Foundation level by `decision-log.md` D79 — this whole passage was already non-live per D72's own retirement of this state, before that.]**

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
  [Product row has ≥1 eligible untagged unit] tap the pending-tag indicator
    (sixth zone, §3.4) → 3.14 (Product-scoped, resume)

Registro de mercancía (3.6) — single Product, one focused operation:
  fill Producto (→ 3.8 if using the picker; matching is case-insensitive,
    trimmed — see §3.8)
  [Producto resolves to a brand-new Product, §3.8a] Cantidad recibida
    stepper appears immediately, default 1, marked "revisa antes de
    guardar" (INV-Q1) until touched, floor 1
  [Producto resolves to an existing Product, any disponibles value
    including 0] Cantidad disponible actual renders read-only, no CTA
    visible on screen yet
      tap the pencil action → correction mode: bidirectional [−]/[+] +
        typed-entry stepper, floor 0, no fixed ceiling, default = loaded
        count (no-op until moved)
          → "Cancelar" → collapses back to read-only, delta discarded
      tap "+ Recibir lote" → reveals Cantidad recibida stepper, default
        1, marked "revisa antes de guardar," floor 1
          → "Quitar" → collapses back to the plain "+ Recibir lote" link,
            staged quantity discarded
      both may be open/staged simultaneously, in either order
      → the instant either one holds a real, nonzero value, "Guardar
        mercancía" becomes visible and enabled for this Product
      within Elegir producto (3.8): typed text matches no existing Product
        → "+ Agregar '...' como producto nuevo" → 3.8a (Precio required,
          D33) → tap "Agregar '...'" (disabled until Precio has a value)
          → back to 3.6, Producto resolved to the new name, Cantidad
          recibida defaulting to 1
      within Elegir producto (3.8), Paid tier only: tap "Escanear código
      de barras" → camera view (3.8b)
        → barcode matches an existing Product.barcode → confirm-on-scan
          (3.8c) → "Sí, es este" → back to 3.6, Producto resolved,
          landing on the default read-only Cantidad disponible actual
          state → "No es este" → back to camera view (3.8b), nothing
          written
        → barcode matches no existing Product.barcode → scan variant of
          "nuevo producto" (3.8a) → type Nombre + Precio → tap "Agregar
          producto" (disabled until both have a value) → back to 3.6,
          Producto resolved to the new name, Cantidad recibida
          defaulting to 1
        → camera permission denied/unavailable → 3.8d → back to 3.8's
          typed-search field, focused
        → scan fails to read → 3.8e → stays on camera view, retry, or
          "Escribir en su lugar" → 3.8's typed-search field
      → [any point in 3.8b/3.8c/3.8d/3.8e] "Escribir en su lugar" / back
        arrow → 3.8, typed-search field, nothing committed
  → tap "Guardar mercancía" (visible/enabled only once this Product's
    draft carries at least one real, nonzero effect — an open
    correction and/or an open receipt) — composes up to two independent
    writes for this Product: a correction (increase or decrease,
    `InventoryCorrection` + FIFO removal or a `source='correction'` Lot,
    RFC 0016) and/or a receipt (`source='supplier_delivery'` Lot,
    existing `commitLot()` write) — either, neither, or both, resolved
    together behind one tap
      → saving (3.10)
      → error (3.11) → Reintentar → saving again
      → success:
          this Lot's unit(s) are NFC-tagging-eligible (composed test, §2
          step 3) → Asignar tags (3.14), Lot-scoped, auto-entered
          not NFC-tagging-eligible → Catalog view + ambient confirmation
          (3.12) — DONE
  → [any point] leave without saving → draft preserved silently for this
    Product, resumes later at §3.6 exactly as she left it, including any
    open-but-uncommitted correction/receipt state
  → to work on a different Product: finish (Guardar mercancía) or back
    out of this one, then start a fresh, independent Registro de
    mercancía from Catalog view (3.4) — never a continuation of this
    visit

Asignar tags (3.14, any of the three entry points — see that section's own list):
  scan tag → assign to next pending unit → counter decrements → repeat
  → tag already assigned → error (3.15) → scan a different tag
  → scan fails to read (out of range, foil, timeout) → error (3.16) →
    reposition and try again — queue state unchanged
  → tap "Terminar después" → Catalog view (3.4), unchanged Catalog rows,
    each still-pending Product's own sixth-zone indicator now reflecting
    current progress
  → 0 pending, Lot-scoped entry → Catalog view + "lista para vender"
    confirmation (3.13) — DONE
  → 0 pending, Product-scoped entry → Catalog view + Product-named
    confirmation (3.13a) — DONE

Catalog view (3.4), Product row:
  tap NFC-eligibility switch (fifth zone, when shown) → write
  `nfcTaggingEnabled` (dim/save, unchanged)
    → on success: ≥1 eligible unit already available and untagged for this
      Product → Asignar tags (3.14), Product-scoped, auto-entered
    → on success, otherwise → stays on Catalog view, row un-dimmed, no
      navigation
  tap pending-tag indicator (sixth zone, "[ N sin etiquetar ]", when shown)
    → Asignar tags (3.14), Product-scoped, resumed

**[Historical — dormant since D72, doubly dead since D73; see §2's own step-0 note. Kept as an accurate description of what this dormant path once did, not a live flow.]**

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
5. [RETIRED 2026-09-17] Catalog view — pending tag work — see §3.4's sixth zone instead.
6. Registro de mercancía — the entire interaction for one selected
   Product: blank Producto picker; existing-Product default read-only
   "Cantidad disponible actual" + pencil + "+ Recibir lote," each
   independently revealing a bidirectional correction stepper / the
   receiving stepper, composable; or a new Product's always-visible
   receiving stepper (`decision-log.md` D78, RFC 0016 for the mechanism
   inside each box; Product Owner decision 2026-09-18 for the
   single-Product screen shape — supersedes D78's own multi-line
   composition)
7. [RETIRED 2026-09-18] Registrar mercancía — con líneas comprometidas,
   editando la siguiente — folded entirely into state 6; there is no
   longer a "next" row.
8. Elegir producto — picker sheet
8a. Elegir producto — nuevo producto, precio inicial (D33; gains a "vía escaneo, sin coincidencia" variant, D65, Paid tier only)
8b. Elegir producto — escanear código de barras, cámara activa (D65, Paid tier only)
8c. Elegir producto — escaneo, coincidencia encontrada, confirmar (D65, Paid tier only)
8d. Elegir producto — escanear, permiso de cámara denegado (D65, Paid tier only)
8e. Elegir producto — escanear, no se pudo leer el código (D65, Paid tier only)
9. [RETIRED 2026-09-18] Descartar confirmation — the risk it protected
   against no longer exists; see that section's own retirement note.
10. Guardar mercancía — saving (near-instant / slow)
11. Guardar mercancía — error
12. Post-save confirmation — no NFC-tagging-eligible unit in this Lot (`decision-log.md` D46/D71)
13. Post-save confirmation — this Lot's NFC-tagging-eligible units are now tagged (`decision-log.md` D46/D71), including a mixed-Lot copy variant
13a. Post-tagging confirmation — Product-scoped queue complete (new 2026-09-17)
14. Asignar tags — active queue, three entry points (Lot-scoped / retired-Settings-handoff / Product-scoped), seeded with only NFC-tagging-eligible units (`decision-log.md` D46/D71, amended 2026-09-17)
15. Asignar tags — error, tag already assigned
16. Asignar tags — error, scan failed
17. [RETIRED 2026-09-17] Asignar tags — "Terminar después" — see §3.4's Catalog view (state 4), unchanged, plus the sixth-zone indicator.
18. Defensive fallback / load error

## 6. Minimum step count

| Scenario | Taps / entries | Why it can't be fewer |
|---|---|---|
| Register 1 new Product line, quantity 1, Producto already exists in the Catalog (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto) + 1 (Guardar) | Cantidad defaults to 1 on Producto selection — no separate quantity step for the single-unit case, the most common one. |
| Register 1 new Product line, quantity 1, brand-new Product name never typed before (buttons-only) | 1 (Registrar mercancía) + 1 (abrir Elegir producto) + 1 typed Product name + 1 ("+ Agregar... como producto nuevo") + 1 typed Precio + 1 ("Agregar...", §3.8a) + 1 (Guardar) = 7 actions | Precio is a new required, gating cost the instant a brand-new Product identity is created (`decision-log.md` D33) — unlike Cantidad's default-to-1, no honest guessable default exists for a price, so it can't be automated away (§3.8a). A one-time cost per Product identity only: every later restock of this same Product reuses the row above, and never re-asks Precio. |
| Register 1 new Product line, quantity >1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto) + N−1 taps on `[+]` (or 1 typed entry) + 1 (Guardar) | Must still specify *how many* when it's not 1 — this is the information itself, not an artificial gate; typed entry stays the faster path for large counts. |
| ~~Register N Product lines in one visit (buttons-only)~~ **[RETIRED 2026-09-18]** | ~~1 (open) + N×(1 elegir producto [+ adjustment taps]) + (N−1)×(agregar otro producto) + 1 (Guardar)~~ | This shape no longer exists — see the row immediately below. |
| Register N different Products (buttons-only) | N × [1 (Registrar mercancía) + 1 (elegir producto) + adjustment taps + 1 (Guardar)] — no shared savings across Products | Each Product is now its own fully separate operation, start to finish (Product Owner decision, single-Product focus, §10). Strictly more total taps than the retired shared-batch shape above for N≥2 — an accepted, deliberate trade-off, not an oversight; see §10 for why the batch mechanism didn't survive review despite this cost. |
| Restock an already-known Product at quantity 1 (tap Catalog row, receive new stock) | 1 (row, prefills Producto) + 1 (+ Recibir lote) + 1 (Guardar) = 3 | **Corrected 2026-09-18 (`decision-log.md` D78) — one tap more than before this amendment (previously 2).** A deliberate, accepted trade-off: Guardar mercancía can no longer be honestly pre-enabled the instant Producto resolves, since nothing defaults anymore — the Product Owner's own stated reason for this redesign (a persistent CTA with nothing real behind it). The extra tap is the direct, visible cost of an honest at-rest state, not padding. |
| Same, but this Lot contains U units of a Product with `nfcTaggingEnabled = true` on an `nfcPerProductEnabled = true` Business (corrected `decision-log.md` D73 — no longer framed as a `defaultSellingMode = 'nfc'` scenario) | + U scans, 1 per physical unit | Per-unit tagging is a domain requirement (`decision-log.md` D4), not a UX choice — one tag, one unit, no shortcut exists that preserves traceability. A failed read (§3.16) costs zero extra taps — she simply re-presents the same tag. |
| Ajustar el precio de un Producto ya existente, fuera de Registrar mercancía (Editar precio, §3.4a) | 1 (tocar el precio en la fila del Catálogo) + 1 (Guardar precio) = 2 | Shortest possible — the price figure is its own tap target directly on the Catalog row (§3.4); no need to open Registrar mercancía at all for a pure price change (`decision-log.md` D33). |
| Corregir el código de barras de un Producto ya existente (Editar código de barras, Paid tier only) | 1 (⋯ en la fila) + 1 (Volver a escanear — el propio scan resuelve la captura) + 1 (Guardar código de barras) = 3 | One fewer action than registering a brand-new Product via barcode scan (6, above) — there's no Nombre or Precio to ask, only a value being replaced. |
| Restock an already-known Product via barcode scan, quantity 1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto → escanear código) + 1 (confirmar "Sí, es este") + 1 (Guardar) = 4 | One deliberate extra tap vs. the typed-name baseline (3) — the confirm-on-scan tap (§3.8c) is intentional, not an oversight; see §10 for why a barcode, unlike a typed name, gets this one extra tap every time it resolves to an existing Product. |
| Register 1 brand-new Product via barcode scan, no match, quantity 1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto → escanear código, sin coincidencia) + 1 typed Nombre + 1 typed Precio + 1 ("Agregar producto") + 1 (Guardar) = 6 | One fewer action than the typed-new-Product path (7) — the scan itself both searches and confirms "not found, create new" in a single motion, skipping the separate "+ Agregar... como producto nuevo" tap the typed path needs. |
| Browse the Catalog only | 0 taps | Opening the tab is itself the answer; nothing to register. |
| Activar/desactivar NFC por producto para un Producto ya existente (Catalog row, fifth zone, §3.4) | 1 (toque en el switch — sin sheet, sin confirmar) | The one action in this document with no separate save/confirm step at all: an inline, instantly-retriable boolean flip, the same low-stakes, easily-reversible reasoning `settings.md` §2.8 gives its own Business-level toggle's — one level lower-friction here, since neither direction discloses a consequence needing a full confirmation screen. |
| Reanudar el etiquetado de un Producto con trabajo pendiente (tocar `[ N sin etiquetar ]` en su fila) | 1 | Sixth zone, pure navigation, no intermediate question — she already knows which Product, the app already knows how many remain. |
| Activar NFC por producto cuando ya hay unidades disponibles sin etiquetar (toggle) | 1 (toque en el switch) — abre Asignar Tags directamente, sin pantalla intermedia | Mismo costo del switch de siempre; el escaneo posterior ya está contado en la fila "U scans, 1 per physical unit." |
| Corregir el conteo de un Producto ya registrado, sin mercancía nueva (tocar la fila, abrir corrección, ajustar) | 1 (fila) + 1 (tocar el lápiz) + N taps en `[−]`/`[+]` (o 1 entrada tecleada) + 1 (Guardar) | Corregido 2026-09-18 (`decision-log.md` D78) — un tap más que antes (el lápiz), directo reflejo de que la corrección ya no está visible por defecto; el resto del costo es proporcional al tamaño de la corrección, sin cambios. Soporta ambas direcciones ahora, no solo decrementos. |
| Corregir y recibir mercancía nueva en la misma visita (ambos abiertos) | 1 (fila) + 1 (lápiz) + N taps de ajuste + 1 (+ Recibir lote) + M taps de ajuste (o 1 típeada) + 1 (Guardar) | Dos hechos de negocio independientes, compuestos en un solo Guardar — el costo estructural mínimo de capturar ambos sin fusionarlos en un número mentalmente calculado (razonamiento explícito de la Product Owner, `decision-log.md` D78). |

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
- Auto-continuation from Guardar mercancía straight into Asignar Tags, for a Lot containing ≥1 NFC-tagging-eligible unit (`nfcPerProductEnabled = true` and the specific Product opted in — `decision-log.md` D46/D71, corrected D73 to drop the `defaultSellingMode`-based gate entirely) — no "¿quieres etiquetar ahora?" question; it's the obvious next physical action given she's holding the merchandise, for a merchant who's actually opted that Product into NFC. A Paid, nfc-capable Business that hasn't opted any Product in is never auto-routed here, regardless of `defaultSellingMode` — see §2's cross-reference note.
- **[Historical, dormant since D72, doubly dead since D73 — see §2's own step-0 note.]** The same automatic routing once applied the moment she switched `defaultSellingMode` to `nfc` in Configuración (`settings.md`'s then-live §2.6 action, now retired) — computed entirely inside this document's own resolution (§2's now-dormant step 0), triggered by a bare entry marker `settings.md`'s action used to hand off. No merchant-facing action reaches this path any longer, and the check's own premise no longer holds regardless.
- Resuming an interrupted, Product-scoped tagging queue — automatic and
  discoverable per row, via the Catalog's own live-computed sixth-zone
  indicator (§3.4). Never a whole-Catalog prompt, never a remembered
  cross-Product queue position — every row always reflects its own current
  pending count fresh, computed the same composed test (§2) every render.
- Turning a Product's own NFC toggle on auto-opens Asignar Tags directly,
  scoped to just that Product, whenever ≥1 of its units already qualifies —
  no "¿quieres etiquetar ahora?" question, the identical reasoning D46
  already applies to the post-Guardar-mercancía auto-entry, now extended to
  the per-Product toggle (2026-09-17).
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
- Whether a Catalog row shows the fifth NFC-eligibility zone at all — computed automatically from `Business.nfcPerProductEnabled` AND `nfc ∈ registrationMode` AND this Product having no `barcode`, the same multi-condition derivation discipline `settings.md` §2.8 already applies to its own "Activar NFC" gate (**corrected 2026-09-18, `decision-log.md` D79 — `settings.md §2.3`'s `defaultSellingMode`-based precedent is retired; §2.8 is the live precedent now**). Never a manual check Ana has to reason through herself.
- The composed **NFC-tagging-eligible** test (`decision-log.md` D71, §2) — computed fresh, per unit, every time Asignar Tags' auto-entry or pending-nudge logic runs; Ana never has to remember which Products she's opted in, or reconcile it herself against her selling mode.
- Assigning a fresh barcode via §3.4c automatically clears a conflicting `Product.nfcTaggingEnabled = true` in the same write — she never has to remember to turn the NFC switch off herself first (§3.4c's own new bullet).
- Cantidad disponible actual's decrease write converges to whatever target she lands on, computed against real-time `disponibles` at Guardar, never a stale client-side subtraction — she never sees or resolves a race condition herself. An increase carries no equivalent race at all, by construction (`decision-log.md` D78) — she never has to reason about the difference.
- A correction left untouched (still equals the loaded count) costs nothing — no correction write fires at all, the same zero-cost-for-the-common-case discipline INV-Q1's marker already established.
- Which specific `InventoryUnit`s a decrease actually consumes — FIFO, invisible, automatic (`decision-log.md` D5/RFC 0016). An increase mints fresh units through the existing, unmodified Lot/InventoryEntry generation path — no second unit-creation code path for Ana to ever be aware of.
- A removed, tagged unit's `NFCTag` release — automatic, invisible, no separate step (unchanged from D77, retained by D78).
- Whether a correction is written as `source='correction'` vs. a receipt as `source='supplier_delivery'` — decided entirely by which of the two on-screen actions she used (pencil vs. "+ Recibir lote"), never a question asked separately (`decision-log.md` D78).
- Whether "Guardar mercancía" renders at all — computed live from whether the current draft carries any real, nonzero staged effect, never a manual check Ana has to reason through (`decision-log.md` D78; "+ Agregar otro producto" itself retired 2026-09-18, single-Product focus, §10).

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
   merchant defers tagging ("Terminar después," §3.14) and a customer later
   wants to buy that physical, untagged unit, there's no tag to scan it
   with. This spec doesn't invent a block-the-sale mechanic in Selling; it
   only makes the untagged backlog visible and resumable per Product in
   Inventario (§3.4's sixth zone) so she's nudged to finish before it
   becomes a problem at the point of sale. **Escalated to
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

5. **[Resolved 2026-09-18, `decision-log.md` D78/RFC 0016 — no longer a live risk, kept for the historical trail per this document's own non-deletion discipline.]** A Cantidad actual correction left unreviewed alongside Cantidad's own default-to-1 could silently add one phantom unit she didn't intend, on a visit whose only real purpose was correcting a miscount. This risk was named against D77's shape, where both boxes rendered together unconditionally the instant Producto resolved. That shape is retired: Cantidad recibida (the receiving stepper) is now only ever shown after she deliberately taps "+ Recibir lote" — there is no longer a way to open a correction without the receiving stepper being silently present alongside it. The scenario this item was written against no longer exists by construction, not because the existing mitigations (the marker, adjacency, committed-list carry-through) got stronger.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — Home's
  cold-start CTA skips a redundant second empty screen (§3.3 annotation, §10);
  the post-save confirmation is ambient, not a screen requiring a dismiss tap
  (§3.12/§3.13); Asignar Tags auto-continues after Guardar with no
  intermediate question (§3.14, when this Lot has ≥1 NFC-tagging-eligible
  unit — `decision-log.md` D46/D71, corrected D73 to drop the
  `defaultSellingMode` gate); the Catalog-row shortcut removes a redundant
  Product search (§3.4, §6).
- *"Never ask twice"* — an in-progress Registrar Mercancía draft survives any
  interruption without a discard-vs-keep prompt (§3.7); an interrupted
  per-Product tagging queue resumes with a single tap on that row's own
  pending-tag indicator, never asking "were you still tagging?" and never
  asking which Product or where she left off — both already known (§3.4's
  sixth zone, 2026-09-17);
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
  let everything downstream inherit it" discipline every live-read
  capability gate in the Selling flow now follows (`decision-log.md` D79).
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
  drops her staged data (§3.11); a failed scan never drops queue progress
  (§3.16); a failed tab load never dead-ends her out of Inventario or blocks
  the nav bar (§3.18). **Corrected 2026-09-18** — Descartar (§3.9) is
  retired; "Cancelar"/"Quitar" (§3.6) are now the only places a staged,
  not-yet-saved value is deliberately discarded, always on her explicit,
  low-stakes request, never a destructive confirmation.
- *"Never delete historical data"* (D25), extended 2026-09-16/17 (`decision-log.md` D71) to the Product-level NFC toggle — turning it off, or a fresh barcode save silently clearing it, never untags or orphans an already-tagged `InventoryUnit`; only future eligibility stops (§3.4's fifth zone, §3.4c).
- *"The merchant experiences Products. The platform preserves Inventory
  traceability,"* extended 2026-09-18 (single-Product focus) — she now
  experiences exactly one Product at a time on this screen, matching how
  she physically holds one stack of one item; the platform's own Lot
  structure (which can still, internally, batch multiple line items in a
  single write elsewhere) is never surfaced here as a "batch" concept she
  has to manage, add to, or discard from.
- *"The fastest interaction is the one that never happens,"* extended
  2026-09-18 — retiring "+ Agregar otro producto" and the "Ya agregaste"
  list removes an entire secondary screen state and its own blocking
  confirmation (§3.9) that existed only to protect a composition risk
  this redesign eliminates by construction, not just mitigates.

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — `nfc ∈ registrationMode` gates
  whether Asignar Tags exists at all in Inventario, decided at the Business
  level (Selling Mode Capability, `decision-log.md` D27, D79), never a
  per-Lot question. **Corrected 2026-09-18 (`decision-log.md` D79) — no
  longer stated as "independent of `Session.operatingMode`," since that
  field no longer exists**; there is simply no Session-level concept left
  for this Business-level check to be independent of.
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
- *#4, extended 2026-09-18* — retiring "+ Agregar otro producto" and the
  "Ya agregaste" list goes one step further and never gives the UI a
  reason to create a Lot with more than one Product's line from this
  screen at all, closing a gap where "Ya agregaste" was, in effect,
  teaching her a de facto "Lot contents" preview even though the copy
  never named the word.
- *#5 (schema stability over-modeled exactly once, only when named)* — direct
  basis for excluding Supplier and cost from Registro de mercancía (§3.6) despite
  the IA wording conflict flagged in §8, item 1 (since corrected).
- *#6 (one-way dependency direction)* — Inventario never reads or writes
  Selling/Session/Sale state; Asignar Tags only ever writes to
  InventoryUnit. **Corrected 2026-09-18 (`decision-log.md` D79) — this
  document's own step 0 no longer reads `Business.defaultSellingMode`,
  because nothing does anywhere in the Foundation any longer** (that
  field is fully retired; step 0 itself has been marked "dormant, D72;
  doubly dead, D73" since before this correction, and stays exactly as
  marked). What remains true, unchanged: Inventory already legitimately
  depends on Identity (`domain-model.md`'s Bounded Contexts table) for the
  capability facts it *does* still read (`nfc ∈ registrationMode`,
  `nfcPerProductEnabled`); nothing in this document ever reverses that
  edge. `settings.md`'s own former §2.6 handoff mechanism (`decision-log.md`
  D46 Addendum), which this bullet used to cite as the thing keeping the
  reverse direction clean, is itself retired in full (`settings.md`'s own
  D79 pass) — there is no longer a handoff for this bullet to describe.
- **§3.4's own tap-zone disambiguation discipline, extended a fourth time (Q23's marker/body/price split; D65's fourth, overflow zone; D71's fifth, NFC-eligibility zone; this 2026-09-17 amendment's sixth, pending-tag indicator zone)** — every new row-level control this document has added has been reasoned explicitly against merging into an existing, already-precedented zone before being given its own, rather than defaulting to nesting it inside the nearest existing affordance (§3.4's own reasoning above).
- *"Never delete historical data" (D25), extended 2026-09-18 (`decision-log.md` D78, RFC 0016, supersedes D77's own extension of this same principle)* — a correction, in either direction, never rewrites the original Lot/InventoryEntry's received quantity or any historical Sale; only the derived, unit-status-driven `disponibles` count changes. A decrease removes only `available` units (never `reserved`); an increase only ever mints new units through the unmodified Lot/InventoryEntry path — the identical FIFO default (D5) and conditional-write discipline already governing Sale consumption, plus the existing receipt-generation path, both reused rather than reinvented.
- *"Capture business truth once, reuse it forever"* — Cantidad disponible actual's default is the Product's own real, current count, not re-derived or re-asked; §3.8's carry-forward rule extends the same discipline already covering Product identity, price, and photo to this fact, now regardless of whether it's 0.
- *"The fastest interaction is the one that never happens," extended 2026-09-18 (`decision-log.md` D78)* — a screen with nothing to save shows no CTA at all, rather than a persistent one she'd have to recognize as inert; she's never asked to notice an action is unavailable, it simply isn't offered until it's real (§2/§3.6's own "not shown-then-blocked" posture, applied here for the first time to an entire primary CTA, not only a secondary affordance).
- *architecture-principles.md* #4 (internal-only entities never leak) — Cantidad disponible actual and Cantidad recibida never name `InventoryUnit`, `InventoryCorrection`, `Lot.source`, or `status` on screen; copy stays "corregido a N (antes M)" / "N nuevas," matching the same discipline governing every other Inventory-internal concept in this document. The correction-vs-receipt ledger distinction D78 requires (`Lot.source`) is carried entirely by *which action she used*, never a field she sees or names.
- *architecture-principles.md* #6 (one-way dependency direction) — both the correction and receipt writes stay entirely inside Inventory's own ownership of `Lot`/`InventoryEntry`/`InventoryUnit`/`InventoryCorrection` (RFC 0016's own "no new bounded-context dependency edge" finding); Selling remains a read-only consumer of `InventoryUnit.status`, unchanged, and sees a correction-sourced unit identically to any other `available` unit.

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
  into a separate tagging flow, no new domain concept or aggregate.
  **[Superseded 2026-09-17 — see the entry below.]** **[see
  inventory.changelog.md#decisions-2026-08-07-continuar-etiquetando-primary-action]**
- **"Continuar etiquetando" and the combined, cross-Catalog pending-tag queue retired outright, 2026-09-17 (Product Owner decision, live, building on D71/D72).** The existing Asignar Tags queue already seeds from a single underlying parameter — "which set of eligible untagged units to work through" — at three possible grains the document already exercises: whole-Catalog (dead since D72, kept only as historical description) and one-Lot (alive, §2 step 3). A Product-scoped grain is simply a third, narrower instance of that same parameter — no new RPC/selector shape, no new completion semantics (§2 step 4's "does this queue still have units" already reads generically against "the ones actually seeded into this queue," which is grain-agnostic by design). Critically, this also means **the queue is not persisted/resumed as a stateful, ordered, cross-session object** — it's recomputed fresh, live, every time it's opened, scoped to whatever's requested at that moment. That's what makes the resume design clean: after any "Terminar después," resuming is *always* Product-scoped going forward, regardless of whether the original entry was Lot-scoped (spanning several Products from one Guardar mercancía). No "remember exactly where she left off in a specific cross-Product order" mechanism is needed at all — a genuine simplification, not just a UI relabel. **Two different mechanisms, two different answers on whether the legacy whole-catalog `nfc` case needed anything new:** §2 step 3 (Lot-scoped auto-entry, immediately after Guardar mercancía) is **untouched** — it was never "continuing a standing task," it already opens immediately at registration time, which is the same immediacy this amendment now gives the per-Product toggle. But §3.5/§3.17 (the Catalog-view "Continuar etiquetando" resume state) served **both** whole-catalog `nfc` and per-Product businesses identically — that shared mechanism **is** retired, for both. The new per-row `[ N sin etiquetar ]` indicator (driven by the same composed test, disjunct-agnostic) becomes the *only* resume path for a whole-catalog `nfc` business too — not a second, case-A-specific mechanism, since inventing one would contradict "tagging becomes per-product, not a combined queue" and would duplicate a mechanism that already generalizes cleanly. No new `decision-log.md` entry — same UI-flow/entry-point-correction class as D46's own Addendum, no schema or aggregate change.
- **Further corrected, same day (`decision-log.md` D73).** The entry above's own framing — "two different mechanisms, two different answers on whether the legacy whole-catalog `nfc` case needed anything new" and "the new per-row `[ N sin etiquetar ]` indicator... disjunct-agnostic" — described the composed test as it stood immediately after D71/D72, which still read `defaultSellingMode` as one of two disjuncts. D73, decided the same day, drops that disjunct entirely: there is no longer a "legacy whole-catalog `nfc` case" as a distinct case at all, and the per-row indicator isn't disjunct-agnostic so much as simply the only mechanism there is, since there's only one condition left to be agnostic between. Kept here as the accurate record of the reasoning at each moment, not merged into a single corrected paragraph — see §2's own composed-test definition for the current, live rule.
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
  gated on merchant intent, not mere capability).** The bullet above ("After
  Guardar mercancía, nfc-capable Businesses are taken directly into Asignar
  Tags...") was superseded, not deleted — kept for the historical trail. The
  gate this bullet described, at the time, everywhere in this document (§2
  steps 2–3, §3.5, §3.12, §3.13, §3.14, §3.17, §4, §7), was
  `Business.defaultSellingMode === 'nfc'` — never `nfc ∈ registrationMode`
  alone. `settings.md` §2.6's "Cambiar a vender con tags" handed off
  directly into this document's Asignar Tags queue (§3.14) if untagged
  inventory already existed, or guided her to register merchandise first
  (§3.3a) if zero InventoryUnits had ever been received. NFC *availability*
  (`nfc ∈ registrationMode`) was unchanged and still gated whether the
  Assign-Tags mechanism existed in Inventario at all. **[see
  inventory.changelog.md#decisions-2026-08-14-d46-corrected-defaultsellingmode-gate]**
- **Further corrected, same day (architect ruling — see D46's own
  Addendum).** `settings.md`'s action wrote only `defaultSellingMode`
  and handed off a bare entry marker — never reading Inventory-owned state
  back, avoiding the dependency cycle `architecture-principles.md` #6
  forbids. This document's §2 gained a new, highest-priority trigger
  condition (step 0) performing the identical whole-Catalog check step 2
  already ran. **[see
  inventory.changelog.md#decisions-2026-08-14-d46-addendum-dependency-cycle-corrected]**
- **Superseded twice more, both already reflected in §2's own current text: `decision-log.md` D73 (2026-09-17) dropped `defaultSellingMode` from the composed test entirely — step 0 became "dormant, D72; doubly dead, D73." `decision-log.md` D79 (2026-09-18) then retired `Business.defaultSellingMode` itself at the Foundation level, and retired `settings.md`'s own §2.6 handoff action in full — the entry marker this bullet's own mechanism depended on can no longer be produced by anything live.** Nothing further changes in this document as a result: step 0's own current text already correctly describes it as unreachable and premise-false, independent of D79 — this note only confirms the Foundation-level retirement is now complete on both ends (the writer, in `settings.md`; the field itself). **[see inventory.changelog.md#decisions-d79-defaultsellingmode-foundation-retired]**

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
- **Corrected 2026-09-17, same day (`decision-log.md` D73).** The composed test recorded above drops its first disjunct entirely — `defaultSellingMode === 'nfc'` is no longer read anywhere in the test. The test is now simply `nfcPerProductEnabled === true` **and** `Product.nfcTaggingEnabled === true`. Every downstream description in this document that referenced "the legacy whole-Catalog `defaultSellingMode = 'nfc'` case" as a distinct case is corrected to match — see §1, §2, §3.4, §3.12, §3.13, §3.14, §6, §7, §9, and this section's own note above (following the 2026-09-17 "Continuar etiquetando retired" entry).
- **A way to correct a Product's on-hand count added directly inside Registro de mercancía, 2026-09-18 (`decision-log.md` D77, `product/99-rfc/0015-inventory-unit-removal.md` Accepted, Product Owner-directed, live production gap, expedited).** A new **Cantidad actual** box (§3.6/§3.7), shown only for an existing Product with disponibles > 0, editable downward only (floor 0, ceiling = the loaded count) — reuses the existing Cantidad stepper mechanism with a ceiling instead of a floor-only rule. The existing **Cantidad** box stays purely additive and unmerged, per the Product Owner's own explicit reasoning against making her mentally compute an absolute total; its floor drops from 1 to 0 only when Cantidad actual is present, the one real behavioral change made to it. "Guardar mercancía" composes up to two independent writes per line. No reason field, no Supplier field, no per-unit picker, no tier gate (D77/RFC 0015's own stated v1 scope). **An earlier, discarded draft of this same RFC proposed a Catalog-row "⋯" overflow action opening a separate sheet — the Product Owner redirected to this inline shape live before it was ever written to this document; §3.4 (Catalog view) is untouched by this amendment.** **[not yet run through `ux-critic`/`reviewer` — expedited, same posture as this document's D65/D71–D73 passes]**
- **The two-box-at-once shape (D77) replaced with a default read-only state plus two independent, explicitly-tapped reveals, 2026-09-18 (`decision-log.md` D78, `product/99-rfc/0016-inventory-unit-bidirectional-correction.md` Accepted, Product Owner-directed, live testing of D77's shipped version).** "Cantidad disponible actual" renders read-only, with a pencil action, for any resolved existing Product regardless of `disponibles` (0 included — D77's own ">0" gate is retired). The pencil opens a bidirectional `[−]`/`[+]`-plus-typed-entry correction stepper (floor 0, no fixed ceiling — a deliberate call, see §3.6). "+ Recibir lote" independently reveals the unmodified additive stepper, renamed "Cantidad recibida." Both may be staged at once, explicitly preserved from the version being replaced. "Guardar mercancía" (and "+ Agregar otro producto") are absent from the screen until the draft carries at least one real, nonzero staged effect — a genuine visibility change, not mere disablement, and the direct cause of a real step-count regression for the common one-tap-restock case (§6), accepted as the honest cost of an at-rest screen with nothing to save. A genuinely new Product is unaffected beyond a copy-only rename of its always-visible receiving stepper. This also structurally resolves §8's own former item 5 (phantom-addition risk) — that scenario can no longer arise, since the two steppers can never both render by default anymore. **Expedited — not yet run through `ux-critic`/`reviewer`.**
- **"+ Agregar otro producto," §3.7's multi-line "Ya agregaste" screen,
  and §3.9's Descartar confirmation all retired outright, 2026-09-18
  (Product Owner decision, live retest of D78's shipped version) —
  Registro de mercancía becomes a single-Product-focused operation,
  regardless of entry point.** Checked explicitly against `vision.md`'s
  own "Receive Merchandise → Register Lot" framing and this document's
  own §1 merchant-goal contexts — no real, named merchant need for
  holding a cross-Product batch open on this screen was found; a large
  mixed supplier haul resolves naturally as a sequence of independent
  per-Product visits instead (§1's own new closing paragraph). §3.9
  retires as a direct structural consequence, not a separate call: it
  protected ≥1 already-committed line in the now-retired list from
  accidental loss, a risk eliminated by construction once nothing is
  ever "committed" short of the real "Guardar mercancía" write, and each
  staged fact already has its own instant, no-confirmation undo
  ("Cancelar"/"Quitar"). A Lot from this screen now always contains
  exactly one Product's units going forward — the earlier D71 "mixed-Lot"
  seeding behavior (§2 step 3, §3.13's mixed-Lot copy variant) is
  correspondingly retired as unreachable prospectively, kept as
  historical record only; nothing about `InventoryCorrection`/`Lot.source`
  or the underlying per-write mechanism changes. **No backend change —
  `commit_lot`/`correct_product_available_count` are already per-write
  and already correct against a single-line array.** Every place
  elsewhere in this document that previously cited §3.7/§3.9 as live
  states (e.g. §3.4b/§3.4a's dimmed-backdrop-sheet precedent, §3.8c's
  "never ask twice" exception company) is corrected in place to note the
  retirement rather than silently left stale. **Cross-document
  dependency flagged, not fixed:** `onboarding.md` §2.2a/§3.5b–§3.5e's
  own multi-Product batch mechanism cites this document's now-retired
  §3.6/§3.7 shape as precedent — stale citation, functionally
  independent flow, resting on Onboarding's own distinct, real,
  first-time-full-catalog-capture need; `events.md` §3.21's own citation
  of "(`inventory.md` §3.7)" for an unrelated row-collapsing idea is
  similarly stale but not a functional break (events.md already
  distinguishes what it borrowed from the retired mechanic). Both
  recommended as narrow follow-up citation fixes, out of scope here.
  **Expedited — not yet run through `ux-critic`/`reviewer`.**

## 11. Future considerations

- A "historial de mercancía" (Lot-level browsing) screen, if Ana ever wants to
  see what arrived and when — not designed now; no journey calls for it yet
  (see §8, item 3).
- A named "borrador" (draft) affordance beyond simple auto-persistence, if real
  usage shows Lots are routinely split across multiple sittings (e.g., over
  several days) rather than counted in one pass.
- **Corrected 2026-09-18 (`decision-log.md` D77, further corrected the same day, single-Product focus) — no longer accurate as originally written.** Editing an already-saved Lot's own received quantity is still not designed and still out of scope (that historical record stays immutable, per D25/D77) — but correcting a Product's current on-hand *count* after Guardar is now designed, via Cantidad disponible actual (§3.6). §3.7's own inline `[✕]`, which this bullet originally credited with covering "fixing a miscount before Guardar fires," is itself retired along with §3.7 (see that section's own retirement note) — that role is now played by each box's own "Cancelar"/"Quitar" (§3.6), same moment, same purpose, different mechanism.
- Reason-tracking for a correction (why units were removed or added — defective, lost, given away, miscounted) — still deliberately deferred, per RFC 0016's own v1 scope (`decision-log.md` D78, extends D77/RFC 0015's identical deferral). `InventoryCorrection` records `type`/`quantityDelta`/`unitIds`/`sourceLotId`, not a reason code. If ever wanted, `EventAllocation`/`AllocationMovement`'s append-only-ledger pattern (D57/D59) — the same shape D78 itself already reused for `InventoryCorrection` — is the established shape to extend, not a new mechanism.
- A per-unit picker for a correction on an `nfcPerProductEnabled` Product, letting her scan or select the exact physical garment being returned or found, rather than relying on FIFO for a decrease (an increase has no equivalent physical-unit question — it mints fresh, untagged units) — named explicitly as a v1 limitation (D78/RFC 0016, extends D77/RFC 0015) and out of scope here; revisit if real usage shows the FIFO/physical-unit mismatch causes confusion.
- A deliberately-designed multi-Product batch-receiving capability for
  Registro de mercancía — explicitly not designed now (retired
  2026-09-18, see §10): no named merchant goal in `vision.md`/this
  document's own §1 currently supports it. Revisit only if real usage
  evidence shows the per-Product-visit cost (§6) is a genuine problem for
  a merchant regularly receiving large, mixed shipments — and design it
  then as its own deliberate capability, not by silently reintroducing
  "+ Agregar otro producto."
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
- **[Resolved 2026-09-17 — see §3.4's sixth zone / §3.14's entry point 3.]** A manual, per-Product resume affordance now exists.
- The events-side interaction this document flags but doesn't resolve (§8, item 4) — a Product's NFC-eligibility toggling off mid-Event, against already-committed allocation units — `events.md`'s own parallel D71 pass, not this document's.
