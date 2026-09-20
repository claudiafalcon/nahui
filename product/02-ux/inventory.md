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

**Amended 2026-09-19 (Product Owner decision, live, following a `ux-designer` audit of the Catalog card and a `ux-critic` review returning "sound with specific changes") — the Catalog card stops being a six-zone composite control and becomes one tap target into a new Product Page.** The card had accumulated six independently-tappable zones across four separate amendments (marker/photo → §3.4b, row body → §3.6, price → §3.4a, "⋯" → §3.4c, an NFC switch writing `Product.nfcTaggingEnabled` inline, and the `[ N sin etiquetar ]` resume indicator), each individually well-reasoned against this document's own tap-zone-disambiguation discipline and each individually correct — but collectively turning a list Ana reads at a glance into six decisions per row, with a live write among them. **This amendment reverses that accumulation rather than adding a seventh zone.** A Catalog card is now one tap target opening the new **§3.19 Página de producto**, with exactly one deliberately-preserved exception: a contextual `[ Etiquetar ]` shortcut, rendered only while that Product has units actually waiting to be tagged, structurally separated from the price column so it can never reintroduce the column-drift defect the Product Owner reported and the retired 84px reserved slot existed to fix. A **hard cap of one shortcut per card**, plus an ordered precedence list for any future candidate, replaces the previous four-part filter, which was a filter and never a limit. §3.19 organises one Product into three levels in the Product Owner's own stated order — stock/status + primary inventory actions; product details and identification (Precio, Foto, Código de barras, the NFC switch, Nombre); and a named, reserved, deliberately-undesigned place for contextual/future sections (Event allocations, movement history) and for archive. **Four real behaviour changes, not only a relocation:** (1) **product rename is newly supported** (§3.19a/§3.19b), validated against §3.8's existing case-insensitive/trimmed matching rule, never merging two Products — `Product.name` is a plain mutable scalar referenced everywhere by ID, so a rename is retroactive to every past Sale/report/receipt by construction, with no name history kept (§8); (2) **turning a Product's NFC switch on no longer auto-enters Asignar Tags** — the 2026-09-17 toggle-ON auto-open is retired outright, reversing that decision at the Product Owner's explicit direction; the switch now only ever writes the setting, and `[ Etiquetar ]` is the sole explicit action that starts a tagging run; (3) **"return to origin" becomes this document's single, consistent navigation rule** for Registro de mercancía's back arrow, its "Guardar mercancía" success, and the completion or deferral of any tagging run — each returns to the screen the operation was opened from (§3.19 or §3.4), with exactly one named, reasoned exception (an origin the save itself makes untrue); (4) **a way to clear an existing `Product.barcode` is newly added (§3.19c)** — `architect`-ruled and approved as additive, no RFC (`decision-log.md` D80). Null is not a new state (the field is already optional, the uniqueness index is partial so multiple nulls never collide, and §3.4c already renders "Sin código" as a correct reading), and nothing historical breaks: `SaleItem` stores `productId`/`unitId` and never the barcode, so past Sales, receipts, Resultados and the Excel export are all untouched. Clearing is its own deliberate action, never an implicit consequence of saving a blank value; it is a **single-column write** touching no `InventoryUnit` and no `NFCTag` row, and it does not change `Product.nfcTaggingEnabled` in either direction — clearing a barcode and opting into NFC stay two separate merchant actions with two separate writes, so D71's server-side guard is never bypassed and the opt-in is never decided for her. **Relatedly, and closing the one gap `ux-critic` found that neither D80 nor an earlier draft of this amendment resolved:** a Product can be barcode-identified while some of its units still carry tags, and those units keep selling — tag resolution carries no Product-flag and no barcode predicate (`decision-log.md` D79). That fact was previously stated nowhere. It is now reported as a **Level-1 status line on §3.19, sourced from the live tagged-unit count — `InventoryUnit.tagId != null AND status IN ('available','reserved')` — and never from `Product.nfcTaggingEnabled`** (`architect` clarification, binding; status scope added same-day after `reviewer` found that an unqualified count includes garments already sold, since `finalize_sale` never deletes the `NFCTag` row), rendered only while ≥1 such unit exists, and never framed as a conflict, a warning or an error. The NFC switch itself stays **absent** from a barcoded Product's Level 2, unchanged and not reinterpreted (D71). **Product archive is named a reserved place in this page's information architecture and is explicitly not designed** — its behaviour against existing stock, open `EventAllocation`s and sales history needs its own Product Decision (§8). `ux-critic`'s findings M1/M3/M4/m1/m2/m3 and its verification round's Major-1/Major-2/Major-3 are each resolved and individually traceable — see §10's own resolution table. The full prior text of §3.4's stacked three→four→five→six-zone enumerations, the 84px reserved-slot reasoning, and the retired 2026-09-17 toggle-ON auto-entry text are preserved unmodified at `inventory.changelog.md#status-2026-09-19-catalog-card-to-product-page`, not deleted. **Expedited, live pass — `ux-critic`'s re-verification against its own audit is complete; `reviewer` pending before build, not skipped, same posture as this document's D65/D71–D73/D77/D78 passes.**

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
   **per-row**, not a per-tab, computation (see §3.4's own per-card
   rendering — the passive `· N sin etiquetar` caption and the
   `[ Etiquetar ]` shortcut — and §3.19's own Level-1 `[ Etiquetar ]`
   action) —
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

   **Amended 2026-09-19 (return to origin).** The Lot-scoped queue this
   step auto-enters completes back to **the origin of the operation that
   produced the Lot** — §3.19 if the Registro de mercancía was opened
   from a Product Page, §3.4 if it was opened from Catalog view's own
   CTA — never unconditionally to Catalog view. Origin propagates
   through an auto-entered queue: it belongs to the operation, not to
   the screen immediately preceding it.

4. [Inside Asignar Tags] Does this Lot still have any InventoryUnit
   without a tag, among the ones actually seeded into this queue?
     → YES: keep the scan prompt active (§3.14).
     → NO: complete — **return to origin** (§3.19, §3.4, §3.3/§3.3a or
       Home, per §3.6's own origin rule **including its "origin untrue"
       exception**), with the matching confirmation rendered there
       (§3.13 for a Lot-scoped queue, §3.13a for a Product-scoped one).
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

**§3.19, the Product Page, introduces no new capability resolution and no
new tab-level gate (added 2026-09-19).** It is a screen inside the
Inventario tab, reading the state this section's own load already
resolved, plus the one Product's own already-loaded identification facts.
Every gate on it is an existing one, read once upstream and never
re-checked per row or per tap (*architecture-principles.md* #1):
`subscriptionTier = paid` for the Código de barras row and its
`[ Quitar código de barras ]` sibling; `nfcPerProductEnabled === true`
AND `nfc ∈ registrationMode` AND no `Product.barcode` for the NFC switch.
A gate that fails means the row is **absent**, never disabled and never
shown-then-blocked — the identical posture this section already
establishes for barcode scanning in §3.8. A page-load failure resolves to
§3.18, unchanged.

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

### 3.4 Catalog view — normal (card rewritten in full 2026-09-19 — one tap target; see status header and §10)

**This section's previous three-, four-, five-, and six-zone enumerations are retired as a set, not individually superseded again.** Each was correct when written and each is preserved unmodified at `inventory.changelog.md#status-2026-09-19-catalog-card-to-product-page`, per this document's non-deletion discipline. What follows is the one current description of a Catalog card — it does not stack on top of them.

```
┌───────────────────────────────┐
│  Inventario                    │
│  ┌───────────────────────────────────────┐ │  cada tarjeta completa
│  │  B   Bolsas                    $350   │ │  → §3.19
│  │      12 disponibles                    │ │
│  ├───────────────────────────────────────┤ │
│  │  P   Playeras                  $280   │ │  sold out — dimmed,
│  │      0 disponibles                     │ │  tarjeta completa tappable
│  ├───────────────────────────────────────┤ │
│  │  D   Delantales                 $90   │ │  legacy data only — dimmed,
│  │      sin registrar                     │ │  tarjeta completa tappable
│  ├───────────────────────────────────────┤ │
│  │  C   Camisas                   $250   │ │
│  │      8 disponibles · 3 sin etiquetar   [ Etiquetar ] │ │  el único atajo
│  └───────────────────────────────────────┘ │
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**Notation, added 2026-09-19.** This document's `[ ]` = tappable convention (§3 intro) marks a single inline element and cannot express a multi-line block as one target. **A whole-block tap target is therefore indicated by its annotation** ("cada tarjeta completa → §3.19"), never by bracketing its contents. Applies to §3.4's cards and identically to §3.12/§3.13/§3.13a. **Consequently the marker renders unbracketed** — it is display-only, and bracketing it would say the opposite of what the prose says; this is the same convention slip flagged for routing at §3.4e. The one bracketed element on a card is `[ Etiquetar ]`, and that is correct: it is the one genuinely independent inline target on the card, which is exactly what the brackets are for.

**A Catalog card is one tap target.** Tapping anywhere on a card — marker, name, price, caption, empty space — opens **§3.19, that Product's own page**. There is no second destination reachable from the card's own area, and no tap on it resolves between two outcomes. This is the direct reversal of four rounds of zone addition (Q23's marker/body/price split, D65's "⋯", D71's NFC switch, 2026-09-17's pending-tag indicator): each was individually well-reasoned against this document's own disambiguation discipline, and the discipline held every time — what failed was the cumulative result, six decisions per row on the one screen whose entire job is scanning and comparing. The discipline is unchanged and still binding; what changed is that it now has almost nothing to arbitrate, which is the point.

**What the card carries, and nothing else.** Catalog view answers "what do I have, how much, and at what price" (§1's second real context) — every element on the card is one of those facts, or the one shortcut below:
- **Marker (leftmost)** — the first letter of `Product.name`, uppercased and trimmed, or `Product.photo` rendered in its place whenever one is set (same substitution rule as `home.md` §3.9 — reused verbatim, not re-derived; a photo that fails to render at read time falls back silently to the initial letter, §3.4b). **Display-only now** — no longer a tap zone, and rendered unbracketed per the notation rule above.
- **Name** — `Product.name`, plain.
- **Price (line 1, trailing)** — this Product's current `Product.defaultPrice`, e.g. "$350". **Display-only now** — no longer a tap zone. `decision-log.md` D33's own "Catalog-row-level edit affordance" requirement is satisfied by §3.19's Precio row, one tap deeper; D33 calls for a Catalog-level *entry point* to price editing, which the card still is.
- **Caption (line 2, leading)** — `N disponibles`, or `0 disponibles` (previously stocked, sold out), or `sin registrar` (never had a Lot/InventoryEntry received against it — a legacy-data-only case since `product-decisions.md` Q20; see the caption derivation below, unchanged). When this Product currently has ≥1 `available`, untagged, NFC-tagging-eligible unit, the caption extends with ` · N sin etiquetar` — **passive informational text, not a tap target**, carrying the count the retired sixth zone used to carry.
- **`[ Etiquetar ]` (line 2, trailing, fixed slot)** — the one exception, below.

**Removed from the card by this amendment, each named explicitly:** the marker tap (→ §3.19's Foto row), the price tap (→ §3.19's Precio row), the "⋯" overflow (→ §3.19's Código de barras row), the inline NFC-eligibility switch (→ §3.19's NFC switch), the `[ N sin etiquetar ]` tap zone (→ the passive caption above plus the `[ Etiquetar ]` shortcut), and the fixed reserved slot that held the NFC switch's column width. That slot was the correct fix for the price-column-drift defect the Product Owner reported while a variable-presence control shared line 1 with the price; with no such control left on line 1 at all, the drift it protected against is structurally impossible and the reservation has nothing to reserve. It is retired, not relaxed.

**The price-edit cost is accepted deliberately, not overlooked (Product Owner decision, 2026-09-19).** Editing a price is now three taps instead of two (§6). The Product Owner's own words: "+1 tap to edit price is acceptable. Do not use the card's shortcut allowance for price. I want to keep the card structurally stable rather than gradually adding shortcuts again." A price edit is a *change*, not *pending work* — it fails filter 1 below on its merits, independent of the cap.

**The one shortcut: `[ Etiquetar ]`.**

Rendered on a card only while that Product currently has ≥1 `available`, untagged unit that is NFC-tagging-eligible under §2's composed test (`Business.nfcPerProductEnabled === true` AND this Product's own `Product.nfcTaggingEnabled === true`, `decision-log.md` D71, corrected D73). Computed fresh on every Catalog render, per card. Pure navigation: opens **Asignar Tags (§3.14), Product-scoped**, seeded with only that Product's own pending untagged units. It never reads or writes `Product.nfcTaggingEnabled` — resuming a tagging run and changing a Product's NFC setting are two different intentions and must never be reachable through the same control (the 2026-09-17 reasoning that separated them, retained unchanged; that reasoning is what makes the switch's own removal from the card safe rather than a regression).

**Disappears the moment its condition stops holding** — she finishes this Product's queue (§3.13a), or turns its NFC setting off on §3.19, which instantly removes every still-untagged unit from eligibility. Not a new rule; the already-approved consequence of the toggle's own semantics (D71), surfaced through a card affordance instead of a row zone.

**The label carries no count, and is identical to §3.19's own Level-1 action.** Both read `[ Etiquetar ]`. The count is one line away on both screens — in this card's own caption, and in §3.19's Level-1 figures — so putting it in the button too would state one fact twice within a few millimetres. Two entry points to one destination read identically, which is what makes them recognisably the same action.

**Hit-area requirements, stated as binding, not illustrative (`ux-critic` M4):**
1. **Structural separation from the price column, first.** `[ Etiquetar ]` lives on line 2, at the card's trailing edge; the price lives on line 1. They share no horizontal space at all, so the shortcut's presence or absence on any given card **cannot** move the price column on that card or any other — the same reasoning already applied when the `[ N sin etiquetar ]` indicator was deliberately placed on its own line rather than given a seventh horizontal column. This is the primary guarantee against the Product Owner-reported alignment defect, and it is structural, not a layout convention that could drift.
2. **A fixed slot within line 2.** Within line 2 the shortcut occupies a fixed-width, fixed-position slot at the trailing edge, reserved on every card in a given list whenever at least one card in that list could carry a shortcut — the same list-level, derived-once signal the retired NFC slot used. This keeps the caption's own available width constant card to card, so a caption never reflows depending on whether its neighbour has pending tag work.
3. **Minimum 48×48 hit area, with a real gap.** The shortcut's tap area is at least 48 density-independent units in both dimensions and is separated from the card's own tap area by a visible, non-zero gap that is itself outside both targets. A tap landing in that gap resolves to the card, not the shortcut — the safe default, since the card is reversible navigation and the shortcut opens a scan queue.
4. **No nested-button semantics.** The card is **not** a control containing another control. The card's tap area and the shortcut's tap area are two sibling, non-overlapping regions within one visual block; the card's region explicitly **excludes** the shortcut's rect rather than sitting beneath it. Nothing about this arrangement may be built as an interactive element nested inside another interactive element.

**The shortcut rule — a filter *and* a cap (`ux-critic` m2, resolved by the Product Owner's own "maximum one shortcut on a product card").** A control may appear on a Catalog card only if it passes **all four** filters:
1. It resolves **pending work that already exists on this Product right now** — never a configuration change, never an edit of a stored fact. The card shortcuts *finishing something*, never *changing something*.
2. The fact that produced it is **already visible on the card itself**, so its presence is self-explaining and never needs a legend.
3. It **disappears automatically** the instant its underlying condition stops holding. Nothing permanent earns a card slot.
4. It is **pure navigation, never a write** — so no save, pending, failure, or retry state can ever live on a card. (This filter alone is what disqualified the NFC switch, and is why its removal is not merely a decluttering preference.)

**Passing all four makes a control a candidate, not a resident.** m2 is correct that the four filters are a filter and not a limit — a hypothetical `Agotado [ Recibir ]` passes all four honestly. The cap is what bounds it:

> **At most one shortcut renders on a Catalog card, ever — even when two or more candidates qualify simultaneously.**

**Precedence, stated now rather than resolved at render time.** Which candidate wins is decided by an explicit, ordered list maintained in this section, not by a computed heuristic:

> **Card shortcut precedence (ordered; one entry today):**
> 1. `[ Etiquetar ]` — pending NFC tag work.

A candidate that is not on this list does not render, regardless of how many filters it passes. Adding a second candidate means deliberately placing it in this order, in this section, as part of whatever amendment introduces it. A computed tie-break was rejected explicitly: any usable tie-break (recency, blocking-ness, magnitude) would have to read facts the card does not display, breaking filter 2, and would make a card's own content non-deterministic between renders of the same list. **`Agotado [ Recibir ]` specifically is not added today** — restocking already has a full-width primary CTA at the bottom of this very screen, and the card itself opens a page whose first Level-1 action is exactly that; a shortcut would be a third route to a destination already two taps away, spending the single allowance on the one candidate that needs it least. **A losing or unlisted candidate is never relocated onto the card in another form** — no badge, no dot, no third line. It lives on §3.19.

**A dimmed card stays fully tappable — restated explicitly now that the whole card is the target (`ux-critic` m3).** A `0 disponibles` or `sin registrar` card renders dimmed, the same dimming signal `home.md` §3.9 applies to a sold-out ProductTile. **Unlike that case, dimming here never pairs with non-tappability, and this is now a statement about the entire card, not about one zone within it**: tapping anywhere on a dimmed card opens §3.19 exactly like any other card. Dimming here means "needs restocking," not "disabled" — and this is precisely the card Ana is most likely to want to open, since deciding what to replenish is exactly Inventario's job. The contrast with `home.md` §3.9 (where dimming *does* pair with non-tappability, because there is genuinely nothing to do with zero sellable units) is unchanged and still deliberate. Her one previous risk — reaching for a dimmed row and hitting a zone she did not mean — is now structurally gone, since there is only one thing to hit.

**Caption derivation — unchanged, restated for completeness, not re-decided.** A zero-`disponibles` card reads `sin registrar` when no Lot/InventoryEntry has ever been received against that Product, and `0 disponibles` when it was previously stocked and has since sold out. A plain, factual read-side check, no stored field, no schema change; "sin registrar" states a fact, not a shortfall. **Reachable only as legacy data** since `onboarding.md` §2.2a began writing real stock in the same interaction (`product-decisions.md` Q20) — kept as the correct, non-alarming caption for a Business onboarded before that shipped, per D25.

**The tagged-unit count is deliberately not carried here.** §3.19's Level 1 reports `N ya etiquetadas` for a Product with tagged units on hand; the card does not. That is a reassurance fact she goes looking for, not a comparison fact she scans across Products, and line 2 already carries `N disponibles · N sin etiquetar`. This section's whole rewrite is about the card not accumulating.

**Ambient confirmation lines still render here, unchanged**, above the card list: §3.12's "Mercancía registrada ✓", §3.13's "Mercancía lista para vender ✓", §3.13a's "Camisas ya está etiquetada ✓", §3.4c's "Código de barras actualizado ✓", §3.19c's "Código de barras quitado ✓" — each still ambient, fading, no tap to dismiss. **What changes is only where each one lands**, now that "return to origin" governs (§3.6, §3.14, §4): a confirmation renders on whichever screen the operation actually returns to, §3.4 or §3.19, with identical copy and identical shape on both. §3.4c's own confirmation additionally has a two-shape rule of its own — see that section.

**§3.3a's two one-time Settings-handoff banners still render here**, prepended above the list, unchanged and still shown-once — both historical (dormant since D72, doubly dead since D73, §2's own step-0 note).

**"Registrar mercancía" (bottom CTA) is unchanged** — always present, never gated, opens §3.6 blank with Catalog view as its origin.

**Where this shape reappears.** §3.12/§3.13/§3.13a render this exact card, unchanged — the same "specified once, reused everywhere" rule that governed every previous version of this section. §3.5/§3.17 are retired states and are not corrected further.
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
- **Entry point moved 2026-09-19 (see status header and §10) — this sheet itself is unchanged in every respect.** It is no longer reached from a Catalog-row tap zone; it is reached from the corresponding row on **§3.19, Página de producto** (Precio → §3.4a; Foto → §3.4b; Código de barras → §3.4c). One tap deeper than before, deliberately accepted (§6, §10). "Cancelar" and a successful save both return to **§3.19**, not to Catalog view — the same "return to origin" rule now governing every flow in this document (§3.6/§3.14/§4). Every other property — the dimmed-backdrop shape, the Product-name heading, the staging/save/error behaviour, the tier gate, the copy — is untouched by that amendment.

- **Catalog-row-level edit affordance for `Product.defaultPrice`**
  (`decision-log.md` D33: "a plain mutable current scalar... editable
  later"), reached by tapping the price figure on any Catalog row (§3.4,
  and identically on §3.5/§3.12/§3.13/§3.17).
  **[Corrected 2026-09-19: the Catalog-row tap zone named here is retired;
  the live entry point is §3.19's corresponding row. §3.5/§3.17 were
  already retired 2026-09-17. §3.12/§3.13/§3.13a render §3.4's own card,
  whose single tap target is §3.19.]**
  Reuses the exact
  dimmed-backdrop sheet shape already established by "Elegir producto"
  (§3.8) and "Descartar confirmation" (§3.9) — no new sheet/modal pattern
  invented for this.
- Pre-filled with the Product's current `defaultPrice`, immediately
  editable — plain numeric peso entry, no currency picker or format
  toggle, the same unadorned posture as Cantidad's own typed path (§3.6).
- "Guardar precio" writes the new value directly to `Product.defaultPrice`
  and closes the sheet back to **§3.19, that Product's page** (corrected
  2026-09-19 — this sheet is no longer opened from a Catalog row), its
  Precio row updated. "Cancelar" discards the edit and returns unchanged. Follows the
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

- **Entry point moved 2026-09-19 (see status header and §10) — this sheet itself is unchanged in every respect.** It is no longer reached from a Catalog-row tap zone; it is reached from the corresponding row on **§3.19, Página de producto** (Precio → §3.4a; Foto → §3.4b; Código de barras → §3.4c). One tap deeper than before, deliberately accepted (§6, §10). "Cancelar" and a successful save both return to **§3.19**, not to Catalog view — the same "return to origin" rule now governing every flow in this document (§3.6/§3.14/§4). Every other property — the dimmed-backdrop shape, the Product-name heading, the staging/save/error behaviour, the tier gate, the copy — is untouched by that amendment.

- **Catalog-row-level management affordance for `Product.photo`** (`product-decisions.md` Q23), opened by a bare tap on the marker/photo icon on any Catalog row (§3.4, and identically §3.5/§3.12/§3.13/§3.17). **[Corrected 2026-09-19: the Catalog-row tap zone named here is retired; the live entry point is §3.19's corresponding row. §3.5/§3.17 were already retired 2026-09-17. §3.12/§3.13/§3.13a render §3.4's own card, whose single tap target is §3.19.]** Mirroring §3.4a's own unlabeled price-figure tap target, not a separately-labeled button. This sheet's own on-screen heading is the Product's name ("Bolsas"), never the string "Editar foto" — the same relationship §3.4a already has between its section title and its actual on-screen heading, deliberately avoiding the CTA/heading-collision defect class this project has already found and fixed twice (`ux-critic-findings.md` HJR-INV-M1, HJR-EVT-M1). Reuses the exact dimmed-backdrop sheet shape already established by "Elegir producto" (§3.8) and "Editar precio" (§3.4a) — and, historically, by the now-retired "Descartar confirmation" (§3.9; see that section's own retirement note) — no new sheet/modal pattern.
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
- "Cambiar" opens the device picker to replace the current selection; "Quitar" clears it within the sheet's own pending state. "Guardar foto" commits whichever state the sheet currently shows as one write to `Product.photo` and closes back to **§3.19, that Product's page** (corrected 2026-09-19 — this sheet is no longer opened from a Catalog row), updated: its Foto row now reads `Con foto`/`Sin foto`, and the page's own header marker shows the photo, or reverts to the initial letter if removed. The Catalog card's marker reflects the same change on return to §3.4. "Cancelar" discards any in-sheet change and returns unchanged. Follows the same near-instant/slow/error save convention as every other write in this document (§3.10/§3.11) — a failed "Guardar foto" leaves the sheet open with the attempted change intact. **Correction (`reviewer` finding, 2026-09-06, on the built code):** this passage previously claimed the write "carries its own stable idempotency key, generated once per attempt," per `architecture-principles.md` #7. Not accurate against the actual implementation — no key is generated. Same pre-existing gap as `commitLot()`/`editPrice` (`product/02c-high-fidelity-prototype/BACKLOG.md` §F), not fixed here.
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

- **Entry point moved 2026-09-19 (see status header and §10) — this sheet itself is unchanged in every respect.** It is no longer reached from a Catalog-row tap zone; it is reached from the corresponding row on **§3.19, Página de producto** (Precio → §3.4a; Foto → §3.4b; Código de barras → §3.4c). One tap deeper than before, deliberately accepted (§6, §10). "Cancelar" and a successful save both return to **§3.19**, not to Catalog view — the same "return to origin" rule now governing every flow in this document (§3.6/§3.14/§4). Every other property — the dimmed-backdrop shape, the Product-name heading, the staging/save/error behaviour, the tier gate, the copy — is untouched by that amendment.

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
- **New 2026-09-16/17 (`decision-log.md` D71) — saving a fresh barcode here also clears `Product.nfcTaggingEnabled`, in the same write, whenever it was `true`.** D71's own rule is that a Product is barcode-identified or NFC-tagging-eligible, never both; this is the one write path that could otherwise leave both true at once (§3.4's own fifth zone is only ever visible while `barcode` is absent, so the two can't be set to true independently through the UI — this is the sole remaining seam). The clear-on-save is silent, not a separate confirmation step — the same "no confirmation needed for a change that only stops future eligibility" posture `settings.md` §2.8 already establishes for the Business-level toggle's own off-direction. **Any already-tagged `InventoryUnit` of this Product is completely unaffected** — it stays tagged and stays sellable via NFC, the identical never-untag/never-orphan invariant §3.4's own fifth zone already states. This clears only the Product's own *future*-eligibility flag, the exact same effect as her manually switching the row's NFC toggle off, one write earlier than she'd have needed to do it herself. **Page-level consequence (2026-09-19):** returning from a successful save, §3.19's NFC row is gone (the Product now has a barcode, so D71's gate excludes it), `N sin etiquetar` and `[ Etiquetar ]` are gone (those units genuinely stopped being taggable, D73), and `N ya etiquetadas` remains — gaining its added clause, since no live switch is present any more to make the fact self-evident. All three changes are explained at that moment by the confirmation below; the clear of the flag itself stays silent as its own event.
- **A saved change is confirmed on the screen it returns to, in one of two shapes (amended 2026-09-19).**

  **Ordinary case — a plain ambient line, unchanged:** `Código de barras actualizado ✓`. Same ambient, fading, no-tap-to-dismiss shape as §3.12's "Mercancía registrada ✓," added originally because nothing in the Catalog card itself visibly changes to confirm the write landed.

  **When this save also cleared `Product.nfcTaggingEnabled = true` (D71's clear-on-save), and/or this Product has ≥1 tagged unit — a one-time, non-blocking acknowledgment banner instead**, in the shape §3.3a and §3.4's own Settings-handoff banner already establish: shown once on this landing, never repeated on a later open, no tap to dismiss it and no tap required to proceed. A fading ambient line is the wrong vehicle for two or three sentences — this document already has the right pattern for "acknowledge why something just changed," reused rather than stretched.

  ```
  Código de barras actualizado ✓
  Camisas ya no se etiqueta — ahora la
  encuentras escaneando su código.
  Las 5 prendas que ya tienen tag se
  siguen vendiendo igual.
  ```

  **Two independently-conditional clauses:**
  - **Second sentence — only when this save actually cleared `nfcTaggingEnabled = true`.** It names what stopped, because what she will notice is that the NFC row, the `N sin etiquetar` figure and `[ Etiquetar ]` all vanished at once. **Those three disappearances are correct and are not restored** — the switch's absence is required by D71, and the untagged units genuinely stopped being taggable, which is the phantom-queue defect D73 fixed. The sentence explains them; it does not apologise for them or offer to undo them.
  - **Third sentence — only when ≥1 unit of this Product currently carries an attached `NFCTag`**, counted live from `InventoryUnit.tagId != null AND status IN ('available','reserved')` (D10's sale-time side; a `sold` unit keeps its `tagId`), never from the flag this same write just cleared. This is the one fact that persists through the change and that nothing else on screen would otherwise tell her (`architect` clarification, 2026-09-19, binding).

  For a Product with no tagged units and no flag to clear — the common case, correcting a misread code — the plain one-line ambient renders and nothing else changes. Factual throughout, never a warning.

**What changes in §3.4c, precisely — the whole diff:**

| | |
|---|---|
| **Changes** | One thing: what renders on the screen §3.4c returns to, after a successful save, **and only when a real consequence occurred.** The existing one-line ambient confirmation gains two independently-conditional sentences and, when either applies, switches from a fading line to the one-time acknowledgment-banner pattern already used elsewhere in this document (§3.3a). |
| **Does not change** | The sheet's fields, its "Volver a escanear"-only capture, its staged "(actual)/(nuevo, sin guardar)" display, its disabled-until-staged "Guardar código de barras," its "Cancelar," its Paid-tier gate, its camera sub-flow (§3.4d–§3.4g), its conflict handling (§3.4e), and its D71 clear-on-save. **No interaction inside the sheet is touched, and no field, gate or write behaviour changes.** |
| **When it's invisible** | The common case — correcting a misread code on a Product with no tagged units and no NFC flag to clear. Byte-identical to today: one fading line, `Código de barras actualizado ✓`. |
| **Why it's here** | Assigning a barcode to a Product that was NFC-tagging-eligible makes three affordances vanish at once from a page she is acting on (the NFC switch, the `N sin etiquetar` figure, `[ Etiquetar ]`), and until now nothing told her that the garments already carrying tags keep selling normally. Two of those disappearances are correct and required (D71, D73); the persisting fact was simply never stated anywhere. |
| **Scope note** | This is the only place in this amendment where an existing sheet's *behaviour* changes rather than only its entry point. Every other sheet (§3.4a, §3.4b, and §3.4c's own interior) is untouched — the amendment moves where they are reached from, nothing else. |
- **"Cancelar" discards any staged (unsaved) scan and closes the sheet,
  returning to **§3.19** unchanged** (corrected 2026-09-19) — identical
  decline treatment to §3.4a/§3.4b/§3.19a/§3.19c.
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
  **[Corrected 2026-09-19.] A removal path now exists — but it lives on
  §3.19, as its own row and its own confirmation (§3.19c), not inside this
  sheet.** This sheet stays exactly as specified: change-by-rescan only, no
  typed entry, no "Quitar." The statement above that removal "wasn't the
  reported problem and isn't designed in this pass" is accurate for *that*
  pass and is retained as the historical record; §3.19c is where it is
  designed, and `decision-log.md` D80 is the ruling that approved it as
  additive.
- Reached identically wherever this row shape reappears — §3.5, §3.12,
  §3.13, §3.17 — the same "specified once, reused everywhere" rule §3.4a/
  §3.4b already establish.
  **[Corrected 2026-09-19: the Catalog-row tap zone named here is retired;
  the live entry point is §3.19's corresponding row. §3.5/§3.17 were
  already retired 2026-09-17. §3.12/§3.13/§3.13a render §3.4's own card,
  whose single tap target is §3.19.]**
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

### 3.6 Registro de mercancía — Producto seleccionado, una operación enfocada (rewritten 2026-09-18, Product Owner decision, live — single-Product focus; the bidirectional-correction/receipt mechanism inside each box is unchanged from D78/RFC 0016; entry points and exit destinations amended 2026-09-19 — pre-expanded reveals from §3.19, and "return to origin" for every exit)

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

**"Guardar mercancía" — what it does and where it goes, stated explicitly (Product Owner-directed, 2026-09-18).** Visible and enabled only once this Product's draft carries at least one real, nonzero staged effect — an open correction whose value differs from the loaded count, and/or an open (floor-1) receipt. Tapping it commits whichever is staged, composed as up to two independent writes behind one tap (a correction — `InventoryCorrection` + FIFO removal, or a `source='correction'` Lot, RFC 0016 — and/or a receipt — `source='supplier_delivery'` Lot, the existing `commitLot()` write) — for this one Product, never a list. Its navigation is governed by the rule below — no intermediate "add another?" prompt, since there's nothing left to add from this screen.

**"Return to origin" — this document's single navigation rule for this screen, applied to all three of its exits (Product Owner decision, 2026-09-19; closes `ux-critic` M3).** Her own words: "Navigation after Guardar mercancía should return to the context the user came from. If the flow was started from Product Page, return to that Product Page. If it was started from the general Catalog flow, return to Catalog. Treat 'return to origin' as the consistent rule."

**Origin** is the screen this Registro de mercancía was opened from — §3.19, §3.4, §3.3/§3.3a, or Home — captured when it opens and held for the whole operation. It is never asked and never chosen; she is shown no "¿a dónde quieres volver?" anywhere (§7).

All three exits, no exceptions beyond the one named below:
1. **Back arrow "←"** — returns to origin. Anything staged is preserved silently and resumes exactly as she left it (unchanged from today, including an open-but-uncommitted correction/receipt state).
2. **"Guardar mercancía" success** — returns to origin, already showing this Product's fresh `disponibles`, with the existing ambient confirmation rendered **on that origin screen**: §3.12 ("Mercancía registrada ✓") or §3.13 ("Mercancía lista para vender ✓"), same copy, same ambient/fading/no-tap-to-dismiss shape, on §3.19 exactly as on §3.4.
3. **A tagging run auto-entered from this save** (§2 step 3) — origin propagates through the queue; §3.14's own completion and "Terminar después" both return to **this operation's** origin, not to Catalog view unconditionally (§3.14).

**The one exception, stated as a rule rather than a special case: if the save itself makes the origin untrue, return to the nearest still-true state instead.** Exactly one case exists today — a Registro de mercancía opened from Home's cold-start CTA (or from §3.3/§3.3a's own CTA). Its origin is a cold-start state whose precondition ("no Product ever registered") is false the instant the save succeeds, so the save returns to **Catalog view (§3.4)** with the ambient confirmation, unchanged from today's behaviour. The back arrow from that same screen, with nothing saved, still returns to Home — the origin is still true while nothing has been written.

To register a different Product next, she starts over from Catalog view — never a continuation of this visit (unchanged, single-Product focus).

*(The expansion into individual InventoryUnit records — and, for a correction, into an `InventoryCorrection` ledger row plus, for an increase, a `source='correction'` Lot — happens automatically behind "Guardar mercancía." It is invisible to Ana; no screen represents it. `decision-log.md` D3/D78.)*

**Shared, unchanged from before this amendment (still apply as written):**
- **Corrected 2026-09-19 — entry is no longer directly from a Catalog row, and two entries now arrive pre-expanded.** Four live entry points, each landing on a different, already-defined state of this screen:
  1. **Catalog view's own `[ Registrar mercancía ]` CTA (§3.4)** — opens blank, Producto unresolved. Unchanged. Origin: §3.4.
  2. **§3.19's `[ Registrar mercancía ]` (Level 1)** — Producto arrives already resolved to that Product, **with the receipt stepper ("Cantidad recibida") already revealed**: default 1, carrying the "· revisa antes de guardar" marker (INV-Q1), floor 1, "Guardar mercancía" visible and enabled. Exactly the state this screen already defines after a "+ Recibir lote" tap, reached without that tap, because she already declared the intent to receive by tapping a receiving-labelled action one screen earlier (*global-principles.md*, "never ask twice" and "the fastest interaction is the one that never happens"). Origin: §3.19.
  3. **§3.19's `[ Corregir cantidad ]` (Level 1)** — Producto arrives already resolved, **with correction mode already revealed**: stepper defaulting to the loaded count, delta 0, and — per this screen's own existing rule — **no "Guardar mercancía" rendered**, since an untouched correction is a genuine no-op. Nothing is staged by the pre-expansion itself. Origin: §3.19.
  4. **Home's cold-start CTA (`home.md` §3.3, this document's §3.3 annotation and §10)** — opens blank. Unchanged. Origin: Home (see the exception in the exit rule below).

  For a "sin registrar" legacy Product reached via (2) or (3), the always-visible receiving-stepper variant applies exactly as already specified. **Nothing is ever pre-*staged* by any entry point** — a pre-expanded reveal shows a box at its already-defined default; it does not put a nonzero value into the draft that she did not ask for.
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
│  ┌───────────────────────────────────────┐ │  requiring a tap to dismiss
│  │  B   Bolsas                    $350   │ │  cada tarjeta completa → §3.19
│  │      10 disponibles                    │ │
│  ├───────────────────────────────────────┤ │
│  │  A   Accesorios                $180   │ │
│  │      5 disponibles                     │ │
│  └───────────────────────────────────────┘ │
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
- **Corrected 2026-09-19 (return to origin).** This ambient line is a property of the **destination**, not of Catalog view specifically: it renders on whichever screen the operation returns to — §3.4 or §3.19 — with identical copy and the identical ambient, fading, no-tap-to-dismiss shape on both. §3.13a's Product-named line is the most common case to land on §3.19, since a Product-scoped queue is usually started from that Product's own page.

### 3.13 Post-save confirmation — this Lot's NFC-tagging-eligible units are now tagged (`decision-log.md` D46/D71)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Mercancía lista para vender ✓   │  ambient, fades
│  ┌───────────────────────────────────────┐ │  cada tarjeta completa → §3.19
│  │  B   Bolsas                    $350   │ │
│  │      10 disponibles                    │ │
│  ├───────────────────────────────────────┤ │
│  │  A   Accesorios                $180   │ │
│  │      5 disponibles                     │ │
│  └───────────────────────────────────────┘ │
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
- **Corrected 2026-09-19 (return to origin).** This ambient line is a property of the **destination**, not of Catalog view specifically: it renders on whichever screen the operation returns to — §3.4 or §3.19 — with identical copy and the identical ambient, fading, no-tap-to-dismiss shape on both. §3.13a's Product-named line is the most common case to land on §3.19, since a Product-scoped queue is usually started from that Product's own page.

### 3.13a Post-tagging confirmation — Product-scoped queue complete (new 2026-09-17; entry points corrected 2026-09-19)
```
┌───────────────────────────────┐
│  Inventario                    │
│  Camisas ya está etiquetada ✓    │  ambient, fades — not a separate screen
│  ┌───────────────────────────────────────┐ │  requiring a tap to dismiss
│  │  B   Bolsas                    $350   │ │  cada tarjeta completa → §3.19
│  │      12 disponibles                    │ │
│  ├───────────────────────────────────────┤ │
│  │  C   Camisas                   $250   │ │
│  │      8 disponibles                     │ │  ya sin "sin etiquetar"
│  └───────────────────────────────────────┘ │  ni [ Etiquetar ]
│      [ Registrar mercancía ]    │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Reached whenever a Product-scoped Asignar Tags queue (§3.14) finishes with 0 units remaining.** **Entry points corrected 2026-09-19:** that queue is now started from §3.4's card-level `[ Etiquetar ]` shortcut or §3.19's Level-1 `[ Etiquetar ]` action — **not** from the retired fifth-zone toggle-ON auto-open (reversed outright, Product Owner decision) or the retired sixth-zone resume indicator (folded into the card shortcut). A distinct case from §3.13, which is specifically the post-Guardar-mercancía, Lot-scoped completion — this state carries no "just registered" framing, since a Product-scoped queue may resolve units received long before today. **It renders on the queue's origin** (§3.19 or §3.4), per §3.14's own corrected rule.
- Names the specific Product, not a generic "lista para vender" — she just finished exactly one Product's stack, and the copy should say which one, matching this document's own precedent for naming specifics rather than a generic line whenever the underlying fact is already on hand (§3.13's own mixed-Lot variant, same reasoning).
- Same ambient, fading, no-tap-to-dismiss shape as §3.12/§3.13 — no new confirmation pattern invented.
- **Corrected 2026-09-19 (return to origin).** This ambient line is a property of the **destination**, not of Catalog view specifically: it renders on whichever screen the operation returns to — §3.4 or §3.19 — with identical copy and the identical ambient, fading, no-tap-to-dismiss shape on both. §3.13a's Product-named line is the most common case to land on §3.19, since a Product-scoped queue is usually started from that Product's own page.

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
3. **Product-scoped** — reached from **two live places, neither of which is a settings toggle (corrected 2026-09-19, Product Owner decision):** §3.4's card-level `[ Etiquetar ]` shortcut, and §3.19's Level-1 `[ Etiquetar ]` action. Both carry the identical label and reach the identical destination. Seeded with only that one Product's own NFC-tagging-eligible untagged units, drawn from however many Lots/receiving events they originated in. This is still the only entry point that survives an interruption: after any "Terminar después," from any entry point, resuming is always Product-scoped going forward — there is no persisted, ordered, cross-Product queue position to restore. Each card's own live `· N sin etiquetar` caption, and §3.19's own Level-1 figure, always reflect the current count.
   **[Retired 2026-09-19 — Product Owner decision, reversing the 2026-09-17 behaviour. Full prior text at `inventory.changelog.md#status-2026-09-19-catalog-card-to-product-page`.]** A third trigger existed here: turning a Product's own NFC switch ON auto-opened this queue whenever ≥1 eligible unit already existed. That is retired outright. The switch (now §3.19's NFC row) writes only `Product.nfcTaggingEnabled` and never navigates. Her own words: "turning NFC on should only change the product setting. It should NOT automatically enter tagging. [Etiquetar] is the explicit action that starts the tagging flow." What she gets instead, on the same screen, in the same beat: §3.19's Level 1 gains `N sin etiquetar` and `[ Etiquetar ]`, and switches to its pending-work ordering, the moment the setting saves — the consequence stays visible, only the navigation is withheld.
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
- **Completion — returns to origin (corrected 2026-09-19, `ux-critic` M3).** A **Lot-scoped** queue (entry point 1) completes into §3.12/§3.13, rendered on the origin of the operation that produced the Lot. A **Product-scoped** queue (entry point 3) completes into §3.13a, rendered on the screen it was started from — §3.19 or §3.4. **The full origin set is §3.6's, not a narrower one: §3.19, §3.4, §3.3/§3.3a, or Home — and §3.6's "origin untrue" exception applies identically here.** A queue auto-entered from a Home cold-start-originated save completes to **Catalog view (§3.4)**, not to Home, for the same reason the save itself does: the cold-start precondition is false the instant a Product exists. One rule, one exception, applied at every exit — §3.6's back arrow, §3.6's save, and this queue's completion and deferral alike.
- **"Terminar después" returns to origin too, by the same rule and with the same exception** — never unconditionally to Catalog view and never to a retired §3.5/§3.17. On §3.4, every still-pending Product's card shows its own live `· N sin etiquetar` caption and `[ Etiquetar ]` shortcut; on §3.19, Level 1 reflects what is left. Independently resumable from either.

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

### 3.19 Página de producto (new 2026-09-19 — Product Owner decision; the destination of every Catalog card tap)

**Section placement note.** §3.19 is the next free top-level number. The §3.4x family was checked and rejected — every member of it is a dimmed-backdrop sheet, while this is a first-class screen, peer to §3.4 and §3.6; §3.4h would also have sorted after the very sheets this page now owns. §3 is not ordered by navigation depth (§3.18's fallback already sits after every flow state; `events.md` §3.21–§3.26 set the appending precedent), and renumbering is forbidden by this document's own non-deletion discipline, which covers identifiers as much as content.

**What this screen is for, in one line each — the Product Owner's own division, verbatim in substance:** Catalog view = scan and compare Products. **Product Page = understand and manage one Product.** Editors/flows (§3.4a/§3.4b/§3.4c, §3.6, §3.14, §3.19a) = perform one specific task. Nothing on this page performs a task that has its own flow; the page's job is to show one Product truthfully and route.

**Default state — Paid tier, NFC switch live, no `Product.barcode`, pending tag work:**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  ┌────┐                          │
│  │IMG │  Camisas                  │  encabezado pasivo — no es un control
│  └────┘  $250                     │
│                                │
│  8 disponibles                    │
│  5 ya etiquetadas                 │
│  3 sin etiquetar                  │
│                                │
│  [       Etiquetar           ]   │  primaria en este estado
│  [   Registrar mercancía     ]   │  secundaria en este estado
│  [   Corregir cantidad       ]   │  secundaria
│  ─────────────────────────      │
│  [ Precio               $250 › ] │  forma 1 → §3.4a
│  [ Foto             Con foto › ] │  forma 1 → §3.4b
│  [ Código de barras Sin código › ]│ forma 1 → §3.4c   (solo plan de pago)
│  [ Vender con tag NFC      Sí ]  │  forma 3 — sin "›", cambia aquí mismo
│   Si lo apagas, las prendas que    │
│   ya tienen tag siguen igual.      │
│   Solo dejas de etiquetar las que  │
│   faltan.                          │
│  [ Nombre            Camisas › ] │  forma 1 → §3.19a
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**On-screen heading is the Product's name ("Camisas"), never the string "Página de producto"** — the identical relationship §3.4a/§3.4b/§3.4c already establish between their section title and their on-screen heading, deliberately avoiding the CTA/heading-collision defect class this project has found and fixed twice (`ux-critic-findings.md` HJR-INV-M1, HJR-EVT-M1).

**Back arrow "← Inventario" returns to Catalog view (§3.4), always** — this page is reached from exactly one place today, so its own back destination needs no origin logic.

**The header marker is passive** — display-only, never a tap target, deliberately unbracketed. It renders `Product.photo` when one is set, otherwise the initial letter, by the same substitution rule §3.4 uses. Photo inspection at a larger size stays inside §3.4b, unchanged; the page already shows the photo at header size, so a second route to it would be a second way to do one thing.

**This page is never dimmed, at any stock level** — dimming is a list-scanning signal that distinguishes one card from its neighbours; on a screen about exactly one Product there are no neighbours for it to distinguish against, so applying it here would carry no information and would read as "disabled." A `0 disponibles` or `sin registrar` Product renders this page in full, normally, with the stock figure stating the plain fact. Deliberate divergence from §3.4's own card treatment, reasoned rather than inherited.

---

**Level 1 — stock/status and primary inventory actions.**

The figures, plain text (§3 intro's "plain text = passive/informational"), in this order:

- **`N disponibles` / `0 disponibles` / `sin registrar`** — the identical derivation §3.4 owns, read here, never re-derived. Counts units with status `available`.
- **`N ya etiquetadas`** — the count of this Product's units that carry an attached `NFCTag` **and** are still on the sale-time side of the unit lifecycle: `tagId != null` **AND** `status IN ('available', 'reserved')`. **Stated as an allowlist, never as a denylist** (`architect` ruling, 2026-09-19) — an `NFCTag` row survives the sale (`finalize_sale` sets `status = 'sold'` and never deletes the tag), so an unscoped `tagId != null` would count garments she already sold. The status set is not chosen for this line: D10's dual-purpose tag resolution already partitions on exactly this boundary (`available`/`reserved` is the sale-time side, `sold` is the claim side), and the live `add_item_to_sale_by_tag` predicate agrees. **No narrower scope is computable here, by design** — the reason a unit is `reserved` lives in Selling's `EventAllocation`, and reading it would invert the dependency direction *architecture-principles.md* #6 fixes. **Sourced from live unit state, never from `Product.nfcTaggingEnabled`** — the flag records a *future-eligibility choice* and says nothing about whether a given garment sells by tag; D71 draws that line in its own entry ("never itself asserts unit-level sellability, which stays derived purely from `InventoryUnit.tagId`"). A statement sourced from `tagId` is not the control, offers no opt-in and asserts no eligibility — compatible with D71, which governs the control, not the topic. **No eligibility predicate is added** (this line exists precisely for a Product that is no longer eligible) and **no Session or Event term** (a Product-level figure must not shift with whichever jornada happens to be open). **Rendered only while ≥1 such unit exists**; at zero it is absent entirely, since there is nothing to disclose and a standing line at zero would reintroduce the phantom-entry class D73 removed. **The condition is tagged units, never the barcode.**
- **`N sin etiquetar`** — unchanged: units that are `available`, untagged, and NFC-tagging-eligible under §2's composed test.

**Three figures, three different bases — and they deliberately do not sum. Stated explicitly so no reader infers an arithmetic relationship that does not hold.** This follows D78's own "Named, not modeled" resolution of the identical cross-basis problem, which fixed it by making each figure's comparison basis explicit in its own copy rather than by forcing the figures onto one basis:
- `sin etiquetar` is a strict subset of `disponibles` — every unit it counts is `available`.
- `ya etiquetadas` is **not** a subset of `disponibles`. It spans `available` **and** `reserved`, so it counts garments that `disponibles` does not.
- **`disponibles = ya etiquetadas + sin etiquetar` is therefore false, and is never true by coincidence in any state worth designing around.** `ya etiquetadas` can legitimately exceed `disponibles`, and at `0 disponibles` it can be the only nonzero figure on Level 1.

**Each figure is honest on its own terms and none is a correction of another.** `disponibles` answers "what can I sell from stock right now"; `ya etiquetadas` answers "how many of my garments carry a tag"; `sin etiquetar` answers "how much tagging work is waiting." A merchant with ten tagged garments committed to an open Event genuinely has `0 disponibles` and genuinely has ten tagged garments with her that sell by tag — both true, neither a contradiction, and Inventario cannot and should not reconcile them, because the fact that would reconcile them (where those units went) belongs to Selling.

**`N ya etiquetadas` carries up to two added clauses, on independent conditions.** Both are basis statements, not warnings, and they compose into one sentence rather than stacking as fragments:

- **Clause A — "se siguen vendiendo con su tag."** Rendered when **no live NFC switch is present on Level 2** (this Product has a `barcode`, or `nfcPerProductEnabled` is off). Where the switch is live and on, this is self-evident from the switch itself and saying it is noise; where there is no switch, it is the one fact nothing else on the page implies.
- **Clause B — "aunque no todas aparezcan como disponibles."** Rendered when **`ya etiquetadas > disponibles`** — a plain comparison of two figures already on screen, never a read into Selling and never a check of why. This is the cross-basis disclosure: it states that the tagged count is not drawn from the available count, at the one moment the two figures visibly disagree.

**The four resulting forms, exhaustively:**
```
10 ya etiquetadas                                  ninguna cláusula

10 ya etiquetadas — se siguen                      solo A
vendiendo con su tag

10 ya etiquetadas — aunque no todas                solo B
aparezcan como disponibles

10 ya etiquetadas — se siguen                      A y B
vendiendo con su tag, aunque no todas
aparezcan como disponibles
```

**Worked example, corrected (`reviewer` finding, 2026-09-19).** The example previously given here — `8 disponibles / 10 ya etiquetadas / 3 sin etiquetar` — was arithmetically impossible under the corrected scope: three `available` untagged units means at most five of the eight available units carry tags. The honest version of that same Camisas is `8 disponibles / 5 ya etiquetadas / 3 sin etiquetar`, and it renders **no clause at all** — `5 ≤ 8`, and the switch is live.

**Worked example, the case this clause exists for.** Camisas with ten tagged garments committed to an open Event and nothing left in general stock:
```
0 disponibles
10 ya etiquetadas — se siguen
vendiendo con su tag, aunque no todas
aparezcan como disponibles
```
`sin etiquetar` is absent (it counts `available` units, of which there are none), and Level 1 shows `[ Registrar mercancía ]` as primary, since there is no pending tag work. **Every line on that screen is true, and the clause is what keeps them from reading as a contradiction.**

**Never framed as a conflict, a warning, or an error** — unchanged, and it governs clause B as much as clause A. No icon, no colour cue, no "atención," no offer to reconcile anything. Clause B states a fact about how two numbers are counted; it does not apologise for them disagreeing, does not imply something is wrong, and does not point her anywhere to fix it. It is the same plain, factual register as `sin registrar` and `0 disponibles`, which this document already holds to for exactly this kind of honest, unalarming zero.

**Copy note.** "aunque no todas aparezcan como disponibles" is true at every value the condition fires on, including `0 disponibles` (where none of the ten appear), and it names the other figure by the label she just read one line above rather than introducing a second word for it. It deliberately avoids "apartadas" — that word belongs to the not-yet-started Apartado/reservation capability (`company/backlog.md`, "Later"), and borrowing it here would pre-empt a feature's vocabulary for an unrelated state. It also deliberately does not say *why* they are not available: Inventario does not know, and inventing a reason it cannot verify would be worse than the silence.

**What is correctly absent on such a Product, and deliberately not restored:** the NFC switch (required by D71) and the `N sin etiquetar` figure with `[ Etiquetar ]` (required by D73 — those untagged garments genuinely stopped being taggable, and that figure persisting was the phantom-queue defect D73 fixed). Only the tagged-garments fact persists, and it is the entire gap this line closes.

The actions. **Two orderings, depending on whether pending tag work exists — the direct application of this document's own 2026-08-07 task-priority precedent (§10), at the Product level now that the Catalog-level state it was written for is retired.** That precedent made "Continuar etiquetando" the primary action and "Registrar mercancía" explicitly secondary *in that one state only*, never gated and never moved; this mirrors it exactly, one scope down.

**When this Product has pending tag work (`N sin etiquetar` ≥ 1):**
1. **`[ Etiquetar ]` — primary in this state.**
2. **`[ Registrar mercancía ]` — secondary in this state only.** Same position, same destination, same behaviour, never gated — only its prominence changes, and only while tag work is pending. Identical treatment to §3.5/§3.17's own handling of this same CTA.
3. **`[ Corregir cantidad ]` — secondary.**

**Otherwise (the ordinary case):**
1. **`[ Registrar mercancía ]` — primary.**
2. **`[ Corregir cantidad ]` — secondary.**

Destinations and behaviour, identical in both orderings:
- **`[ Registrar mercancía ]`** — opens §3.6 with Producto already resolved to this Product **and the receipt stepper ("Cantidad recibida") already revealed**: default 1, carrying the "· revisa antes de guardar" marker (INV-Q1), floor 1, "Guardar mercancía" visible and enabled. Exactly the state §3.6 already defines after a "+ Recibir lote" tap, reached without that tap, because she declared the intent to receive by tapping a receiving-labelled action one screen earlier (*global-principles.md*, "never ask twice"). This is also what keeps a one-unit restock at three taps despite the page adding one (§6).
- **`[ Etiquetar ]`** — opens Asignar Tags (§3.14), Product-scoped, exactly like §3.4's card shortcut, with the identical label. Rendered only while pending tag work exists; disappears the instant the condition stops holding (queue reaches 0, or the NFC setting is turned off).
- **`[ Corregir cantidad ]`** — opens §3.6 with Producto resolved and **correction mode already revealed**: stepper defaulting to the loaded count, delta 0, and — per §3.6's own existing rule — **no "Guardar mercancía" rendered**, since an untouched correction is a genuine no-op. Same "never ask twice" reasoning, and it keeps a count correction at its current step count rather than regressing it by the page's +1 (§6). **Design note, stated as mine under the Product Owner's hierarchy constraint** ("stock/status and primary inventory actions" on Level 1): a new entry point into an already-approved state, not a new capability — §3.6's pencil is unchanged and still reachable. Reversible if review disagrees; nothing else depends on it.

**Nothing on Level 1 writes anything.** All three are navigation into flows that own their own writes.

---

**Level 2 — product details and identification.**

Separated from Level 1 by a plain divider, with **no section heading** — the level break is carried by the divider plus the uniform row shape, and an added heading would be a label that informs nothing (`events.md` §3.4's own rule: nothing on screen that isn't informative).

**Level-2 row shapes — three, each readable before the tap. Binding, not illustrative.**

| Shape | Renders as | Behaviour |
|---|---|---|
| **1. Value row that opens a sheet** | `[ Label            valor › ]` | Opens a staged sheet with a Cancelar/Guardar pair. Writes nothing on tap. |
| **2. Action row that opens a sheet** | `[ Acción                  › ]` | Same, with no value to show. |
| **3. Instant-write row** | `[ Label                Sí ]` | Writes immediately on tap. **Never carries "›".** |

**Every Level-2 row is a tap target — there is no passive row shape, deliberately.** A passive fact on this level sits among rows that all read as controls and is pulled toward control-shaped copy by its neighbours. Not hypothetical: an earlier draft of this amendment put a read-only NFC statement here and, in taking the row shape, drew its subject from `Product.nfcTaggingEnabled` — rendering "No" for a Product with ten tagged garments that were selling perfectly well. **Passive facts belong on Level 1**, alongside `N disponibles` and `N sin etiquetar`: a plain figure, derived from live unit state, no trailing slot, no target. The level split is what keeps the sourcing honest — Level 1 reports what is true of the units right now; Level 2 edits what is stored about the Product.

**A row with no live control is absent from Level 2, never present-and-inert.** On a barcode-identified Product the NFC switch is gone entirely — `decision-log.md` D71, unchanged and not reinterpreted.

**Signal one — the forward indicator, stated affirmatively.** **Every Level-2 row that opens a separate surface carries a trailing "›" after its value.** Precio, Foto, Código de barras, `[ Quitar código de barras ]`, and Nombre all carry it, unconditionally. **The instant-write row never carries it, and a sheet-opening row may never omit it.** A rule about one row's *absence* would be no signal at all — with no row carrying an indicator, its absence distinguishes nothing. A trailing directional glyph is established vocabulary in this document family, not new notation: §3.8's `[ Elegir producto ▾ ]` and `events.md` §3.15's `[ Vendiendo ahora · Día 2 ▸ ]` both already use one.

**Signal two — what kind of thing the trailing element is.** A sheet-opening row trails an **open-ended value** she can read but not change from here: `$250`, `Con foto`, `7501234567890`, `Camisas`. The instant-write row trails a **two-position state from a closed, binary vocabulary** — `Sí` or `No`, never anything else, ever. That is a different kind of trailing element, visible at rest: one is a fact being reported, the other is the current position of a control.

**Why two signals and not one.** The chevron alone is a small mark at the far edge of a row; the binary-vocabulary rule holds even if she never looks there, and holds in every future rendering of this page. They fail independently, which is the point. **Neither is a visual-design decision** — one is the presence of a forward affordance, the other is the cardinality of a value's vocabulary; both are hierarchy and affordance, and both survive intact into any visual treatment.

**No row may mix shapes.** A sheet-opening row with a binary value (a hypothetical `[ Vender con tag NFC   Sí › ]`) is forbidden outright: it would carry both signals and resolve to neither. If a future amendment ever needs a binary fact edited through a sheet, it renders the value as something other than `Sí`/`No` and carries the "›" — the vocabulary is what's reserved, not the fact.

Row order is **frequency of real use, most-used first** — the Product Owner's own listed order, and the honest one: price changes with the season, a photo gets added once and rarely touched, a barcode is corrected only when misread, an NFC setting is decided once per Product, a name is changed almost never.

1. **`[ Precio            $250 › ]` → §3.4a "Editar precio," unchanged.**
2. **`[ Foto         Con foto › ]` / `[ Foto        Sin foto › ]` → §3.4b "Editar foto," unchanged.** Value reads a plain `Con foto`/`Sin foto` rather than a thumbnail — the page already shows the photo at header size, and a second thumbnail here would be the same fact twice.
3. **`[ Código de barras   7501234567890 › ]` / `[ Código de barras   Sin código › ]` → §3.4c, unchanged. Paid tier only** — absent entirely on a Free-tier Business, never shown-then-blocked, inheriting §2's existing gate rather than defining a new one. The "⋯" glyph is retired with the card zone; a named row needs no overflow indicator.
   - **When a barcode is present, a second row renders directly beneath it: `[ Quitar código de barras › ]` → §3.19c.** Absent entirely when the value reads `Sin código`. Its own full-width tap target, a sibling row and never nested inside the row above. Paid tier only, same inherited gate.
4. **`[ Vender con tag NFC      Sí ]` / `[ ... No ]`** — the one control on this page that writes directly. Full specification below.
5. **`[ Nombre            Camisas › ]` → §3.19a "Editar nombre."** New. Placed last deliberately: the rarest change on the page, and the only row whose value is already the page's own heading — putting it first would read as a duplicated title rather than a control.

**Rows absent rather than empty.** A Free-tier Business sees Precio, Foto, Nombre and nothing else. A Paid Business with `nfcPerProductEnabled = false` sees Precio, Foto, Código de barras, Nombre. A barcode-identified Product sees no NFC row at all. Nothing renders disabled, greyed, or with explanatory upsell copy — the identical posture §2 already establishes for barcode scanning and `settings.md` §2.7 for "Tu equipo." No empty divider or orphan heading ever renders.

---

**The NFC switch — full behaviour.**

**Gate.** Rendered — as a live switch, the only form it has — when `Business.nfcPerProductEnabled === true` **and** `nfc ∈ registrationMode` (i.e. `subscriptionTier = paid`) **and** this Product has **no** `barcode`. Absent entirely otherwise. The middle clause is normally redundant — the only write path that can set `nfcPerProductEnabled = true` (`settings.md` §2.8) is itself only offered while `nfc ∈ registrationMode` — until a Paid→Free downgrade lands, which never resets that stored value. Checking it explicitly keeps this row honestly absent for a since-downgraded Business.

**The whole row is the tap target — shape 3, above.** A bare tap anywhere on the row flips the value; there is no smaller switch-shaped sub-target to aim at, no sheet, no confirmation, and no separate save. It carries **no "›"** and trails **only `Sí` or `No`** — both halves of the shape-3 contract, and both readable at rest, before she commits to anything. She can tell this row writes and the three above it don't without touching any of them.

**Copy beneath the row, rendered only while the value reads `Sí`:**
```
Si lo apagas, las prendas que ya tienen
tag siguen igual. Solo dejas de etiquetar
las que faltan.
```
This is `decision-log.md` D71's own invariant, already settled and not reopened here, stated in merchant language at the moment it matters: **turning NFC off never untags or orphans an already-tagged `InventoryUnit`.** An already-tagged Camisas unit stays exactly as tagged and exactly as sellable; only future eligibility for not-yet-tagged units stops. A standing caption, not a warning and not a confirmation dialog: a fact about a reversible setting, not a risk. Merchant vocabulary throughout — no `nfcTaggingEnabled`, no `InventoryUnit`, no "eligibility" (*architecture-principles.md* #4).

**Turning it ON writes the setting and nothing else — the 2026-09-17 auto-entry is reversed and retired (Product Owner decision, 2026-09-19).** A successful ON save never navigates anywhere. Her own words: "Reverse the previous NFC behavior: turning NFC on should only change the product setting. It should NOT automatically enter tagging. [Etiquetar] is the explicit action that starts the tagging flow." **What she sees instead, immediately, without leaving this page:** if this Product already has ≥1 `available` untagged unit, the `N sin etiquetar` figure and the `[ Etiquetar ]` action both appear on Level 1 in the same beat the row finishes saving, and Level 1's ordering switches to its pending-work form. The consequence of the setting becomes visible one level up on the screen she is already on — which is what makes withholding the navigation honest rather than merely quieter. If she has nothing yet received, nothing appears, and no empty tagging queue is ever reachable (D46's own rule, preserved at the Product level).

**Turning it OFF never hands off anywhere** — unchanged. `[ Etiquetar ]` and the `N sin etiquetar` figure both disappear in the same beat, since every still-untagged unit leaves eligibility (D71). `N ya etiquetadas` is unaffected, because it was never sourced from this flag.

**Save-state discipline — composes two already-approved primitives, invents nothing.** This is the only control on this page that saves instantly, so it is the only one that needs this stated:
- **On tap:** the row dims in place (`settings.md` §3.9's "fila atenuada" mechanic, reused) and **immediately displays the attempted new value** — she sees `Sí` the instant she taps `No`. The row is not tappable again while a write is inflight; a second tap is ignored, never queued.
- **Near-instant:** the row dims and un-dims silently, landing on the new value. No message.
- **Slow (>~1.5s) — the pending state:**
  ```
  [ Vender con tag NFC  Guardando… ]
  ```
  The trailing value reads `Guardando…` in place of `Sí`/`No`, row still dimmed. Same calm, plain-language convention as every other write in this document (§3.10) — never a spinner label, never a technical status string.
- **Failure — the failure state and the revert:**
  ```
  [ Vender con tag NFC      No  ] │  revertido al último valor guardado
   No pudimos guardar. Intenta de
   nuevo.
  ```
  **The row reverts to the last value actually stored — never left displaying the attempted value.** This is the load-bearing half: the optimistic display above is only safe because failure is guaranteed to undo it. The inline line renders directly beneath that row only; nothing else on the page is affected, nothing is blocked, and the rest of the page stays fully interactive. The row itself becomes tappable again and **is** the retry — no separate `[ Reintentar ]` button, no full-screen error. Same reasoning `settings.md` §3.10 gives its own toggle failures, and the same reasoning §3.4's retired fifth zone already carried, scoped here to one row: a small, low-stakes, instantly-retriable boolean flip. The line clears on the next tap of that row, successful or not. No tap is required to dismiss it.
- **Interruption mid-write (app backgrounded, connection lost, tab killed):** on returning to this page, the row renders whatever the server actually holds, re-read as part of the page's own load — **never a persisted `Guardando…`**, and never a locally-remembered attempt replayed silently. If the write landed, she sees the new value; if it did not, she sees the old one. Nothing is staged on this page across an interruption, because nothing on this page is ever staged at all.
- **Idempotency.** This write is exposed to a client-initiated retry (the row itself), so *architecture-principles.md* #7 applies: it must carry a stable idempotency key generated once per attempt and reused on every retry of that attempt. **Stated as a requirement on the build, not as a claim about what exists** — this document has twice been corrected for asserting a key that was not actually generated (§3.4a/§3.4b's own `reviewer` corrections, `product/02c-high-fidelity-prototype/BACKLOG.md` §F). The same standing gap covers this write until §F is closed.

**Mutual exclusivity with `Product.barcode` (D71, unchanged).** The NFC switch is never rendered while a barcode exists, so the two can never be set true independently through this page. The one seam — saving a fresh barcode via §3.4c on a Product currently `nfcTaggingEnabled = true` — is handled at §3.4c itself (the save clears the flag in the same write, never touching an already-tagged unit). **The page's own consequence:** returning from a successful §3.4c save, the NFC row is gone, `N sin etiquetar` and `[ Etiquetar ]` are gone, and `N ya etiquetadas` remains with its added clause — see §3.4c for the acknowledgment that explains all three at that moment. The reverse direction — what a *clear* does — is specified at §3.19c: a single-column write that **does not touch `nfcTaggingEnabled` in either direction.** The flag stays `false` (it already was, whichever path produced the barcode), and this row reappears as a live switch reading `No`. Opting in stays a separate, deliberate second action with its own write — never combined, never automatic.

---

**Level 3 — contextual and future sections. Named, reserved, deliberately not designed.**

**Nothing renders here today.** No heading, no placeholder, no "próximamente," no empty container — `events.md` §3.4's own rule applies unchanged ("an empty label with nothing under it is never shown"). This level exists in the page's information architecture so that a future section lands in a decided place instead of being wedged into Level 1 or Level 2, which is exactly how the Catalog card accumulated six zones.

**Reserved, in this order, when each is eventually designed — below Level 2, never above it:**
1. **`Este producto en tus eventos`** — this Product's `EventAllocation` picture across open Events. **Not designed here, and not designable here:** `events.md` owns `EventAllocation` end to end (§3.21–§3.25, `product-decisions.md` Q24/Q25, `decision-log.md` D57/D59), and a read surface for it on an Inventory screen needs that document's agreement on what an Inventory-side view may show and whether it inherits the OWNER-only scoping every other allocation surface has. **Not yet resolved** → `product-decisions.md` Q32.
2. **`Movimientos de este producto`** — receiving events, corrections, and removals over time. **Not designed:** §8 item 3's standing question (is `Lot` ever meant to be browsable to Ana) is unresolved, and `InventoryCorrection` is an append-only ledger deliberately kept internal (D78, RFC 0016). Designing a read surface for either would pre-empt both. **Not yet resolved** → §8 item 3 and `product-decisions.md` Q32.
3. **`Desactivar producto`** — see immediately below.

**Marking a Product inactive — a named reserved place, explicitly not designed in this pass.** The mechanism is already decided and is **not** new: `product-decisions.md` **Q21** settled it on 2026-08-30 as an **active/inactive state on `Product`**, scoped deliberately as a general Inventario capability for any discontinued product rather than narrowly as sample-catalog cleanup, and ruled that an inactive Product "disappears from the selling grid/active Catalog view but stays fully intact for history, `reports.md`, and every existing `Sale`/`SaleItem`." **This pass deliberately uses Q21's own vocabulary — activo/inactivo, "Desactivar producto" — and does not introduce "archivar" as a competing term** for the same mechanism; a second word for one concept is exactly the drift `ubiquitous-language.md` exists to prevent.

**No affordance of any kind renders on this page today** — not disabled, not greyed, not hinted. What this amendment contributes is the decided *location*: Q21's own "Not yet designed" list names "the actual toggle affordance (where in `inventory.md` a merchant sets a Product active/inactive)" as open, and Level 3, last, is that home. Two of Q21's open items remain untouched by this pass and are named here so the seam is visible rather than assumed solved:
- **The affordance itself** — its label, its confirmation (if any), what it says about stock on hand, and whether reactivation is reachable and from where, given nothing in Inventario lists inactive Products today.
- **Whether `active`/`inactive` needs a new `Product` field or can derive from something already modelled** — Q21's own named `architect` check. **`Product.active` does not currently exist.** It is absent from `domain-model.md`'s `Product` entry and from `types.ts`, and was deliberately kept out of the Stage 7 Phase 1 schema per *architecture-principles.md* #5. Several documents (`decision-log.md` D55, `settings.md`) cite `Product.active` as precedent for `BusinessMembership.status`'s *shape* — sound as a naming precedent, unsound as an existence claim, and this spec asserts neither.

One further question this page's own existence raises for whoever designs it: an inactive Product disappears from the active Catalog view, and the Catalog card is now the only route to this page — so the affordance's design must also answer how she reaches an inactive Product's page at all. Named, not resolved.

---

**Load and failure behaviour for the page itself.**

- **This page renders synchronously from already-loaded state and has no resolving pair of its own — §3.1/§3.2's convention does not apply here.** Every fact it shows was already loaded by §2's own tab-level state load: Catalog membership (name, `defaultPrice`, `photo`, `barcode`, `nfcTaggingEnabled`), the capability values gating its rows, the per-Product pending-tag count §3.4's cards already compute, and the tagged-unit count drawn from the same unit state. Opening a Product Page performs **no new fetch and no new capability resolution**, so there is no interval for a skeleton or a "Cargando…" line to occupy, and neither is ever shown.
- **§3.18 is reached only on an explicit resolution failure** — the tab's own state unavailable, or a Product that cannot be resolved at all (today, only a stale card tapped after a concurrent change on another device) — never after an intermediate wait. No new error screen is invented for a case an already-approved state covers correctly; its manual `[ Reintentar ]` and fully functional nav bar are unchanged.

**Sin trabajo de etiquetado pendiente — el orden ordinario:**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  ┌────┐                          │
│  │ B  │  Bolsas                   │  inicial cuando no hay foto
│  └────┘  $350                     │
│                                │
│  12 disponibles                   │
│                                │
│  [   Registrar mercancía     ]   │  primaria
│  [   Corregir cantidad       ]   │  secundaria
│  ─────────────────────────      │
│  [ Precio               $350 › ] │
│  [ Foto             Sin foto › ] │
│  [ Código de barras Sin código › ]│  (solo plan de pago)
│  [ Vender con tag NFC      No ]  │  forma 3
│  [ Nombre             Bolsas › ] │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**Free-tier / reduced variant:**
```
│  [ Precio               $350 › ] │
│  [ Foto             Sin foto › ] │
│  [ Nombre             Bolsas › ] │
```

**Con código de barras (Paid tier), con prendas ya etiquetadas — el caso Camisas:**
```
┌───────────────────────────────┐
│ ← Inventario                     │
│  ┌────┐                          │
│  │IMG │  Camisas                  │
│  └────┘  $250                     │
│                                │
│  8 disponibles                    │
│  5 ya etiquetadas — se siguen     │  Nivel 1, desde InventoryUnit.tagId
│  vendiendo con su tag             │  solo si hay ≥1 con tag
│                                │
│  [   Registrar mercancía     ]   │  primaria — ya no hay [ Etiquetar ]
│  [   Corregir cantidad       ]   │
│  ─────────────────────────      │
│  [ Precio               $250 › ] │
│  [ Foto             Con foto › ] │
│  [ Código de barras 7501234567890 › ]│  → §3.4c (cambiar)
│  [ Quitar código de barras     › ]│  → §3.19c
│  [ Nombre            Camisas › ] │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
No NFC row on Level 2 at all (D71). `3 sin etiquetar` and `[ Etiquetar ]` correctly gone (D73).

**Con código de barras, sin prendas etiquetadas — el caso común:**
```
│  12 disponibles                   │
│                                │
│  [   Registrar mercancía     ]   │
│  [   Corregir cantidad       ]   │
│  ─────────────────────────      │
│  [ Precio               $350 › ] │
│  [ Foto             Con foto › ] │
│  [ Código de barras 7501234567890 › ]│
│  [ Quitar código de barras     › ]│
│  [ Nombre             Bolsas › ] │
```
Nothing about NFC renders anywhere — no row, no line, no trace.

### 3.19a Editar nombre — sheet (new 2026-09-19)
```
┌───────────────────────────────┐
│ ← Camisas                        │  dimmed, visible underneath
│  Camisas                         │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Nombre                          │
│   [ Camisas ]                    │
│  [ Cancelar ]  [ Guardar nombre ]│
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

- **Reached from §3.19's Nombre row.** Reuses the exact dimmed-backdrop sheet shape already established by "Elegir producto" (§3.8), "Editar precio" (§3.4a), "Editar foto" (§3.4b), and "Editar código de barras" (§3.4c) — no new sheet/modal pattern.
- **On-screen heading is the Product's current name ("Camisas"), never "Editar nombre"** — the identical rule §3.4a/§3.4b/§3.4c already hold, avoiding the HJR-INV-M1/HJR-EVT-M1 collision class.
- **Pre-filled with the current name, immediately editable.** Plain text entry, no casing help, no suggestions, no autocomplete against the Catalog — she is naming her own merchandise, and the app has nothing to add to that (*global-principles.md*: never talk down to her about a task she already knows how to do better than the app does).
- **`[ Guardar nombre ]` stays disabled while the field is empty or whitespace-only.** Same disabled-until-valid posture §3.8a's "Agregar" and §3.4c's "Guardar código de barras" already use. No error copy is needed for this case — there is simply nothing to save.
- **Validation runs on `[ Guardar nombre ]`, not as she types.** Deliberate: this document family's only live/as-you-type precedent is `onboarding.md` §3.9b, which needed its own grounding before it was adopted, and a name typed one character at a time would flash a conflict warning at half the intermediate strings. Staged-then-validated also matches §3.4c's own posture exactly. A concurrent rename on another device surfaces through the same save-error path (§3.10/§3.11-equivalent), not through a separate branch.
- **The matching rule is §3.8's, reused verbatim, never re-derived.** Her typed text is compared against **every other Product's name in this Business's Catalog** after lowercasing both sides and trimming leading/trailing whitespace — the one automatic normalization, exactly as §3.8 defines it, and deliberately no fuzzy or typo-tolerant matching ("Bolsa" and "Bolsas" stay two distinct Products). Three outcomes:
  1. **Normalizes to a different existing Product** → §3.19b, conflict. Never saved, never merged.
  2. **Normalizes to this same Product's own current name** (a pure casing or spacing change — " camisas " → "Camisas") → **saved normally.** Not treated as a no-op: the stored literal genuinely changes, and the Catalog marker's own derived initial letter may change with it. The uniqueness check is against every *other* Product only, never this one — the identical carve-out §3.4c already makes for a pointless-but-harmless barcode rescan.
  3. **Matches nothing** → saved normally.
- **What is stored:** her typed text with leading and trailing whitespace trimmed. Internal casing and internal spacing are preserved exactly as typed — no title-casing, no collapsing of double spaces, no other normalization. Same "one automatic normalization, no more" posture §3.8 already holds, applied to the write side.
- **`[ Guardar nombre ]` writes `Product.name` directly and closes back to §3.19**, updated — its heading, its Nombre row, and its marker (when no photo is set) all now reading the new name. `[ Cancelar ]` discards and returns unchanged. Follows the same near-instant/slow/error save convention as every other write in this document (§3.10/§3.11); a failed save leaves the sheet open with her typed value intact. Exposed to a client-initiated retry, so *architecture-principles.md* #7's stable-idempotency-key requirement applies — stated as a requirement on the build, against the same standing `BACKLOG.md` §F gap named at §3.4a/§3.4b and §3.19's NFC switch.
- **What a rename does to history — stated plainly, because it is not nothing (`Product.name` is a plain mutable scalar).** Every `InventoryUnit`, `NFCTag`, `SaleItem`, `Lot`, `EventAllocation`, and `Claim` references this Product **by ID, never by name** (`domain-model.md`'s Product entry, D2). So a rename is complete and retroactive **by construction**: `reports.md`'s past figures, `events.md`'s allocation lists, and a re-rendered Digital Receipt (`home.md` §3.8f) all show the new name for sales made under the old one, because none of them ever stored the old one.
  - **No historical data is altered or deleted by this** (D25): not one Sale, SaleItem, Lot, or InventoryUnit row changes. What changes is the single label every one of them already resolved through.
  - **No name history is kept, and no "antes: ..." is shown anywhere** — the same "plain mutable current scalar, no version history" posture `decision-log.md` D33 already fixed for `defaultPrice`, D54 for `photo`, and D65 for `barcode`, applied to `name` for consistency rather than singled out for special treatment.
  - **The consequence is named, not buried:** a merchant who renames "Playeras" to "Playeras niño" will see last month's sales of the old Playeras reported under the new name. That is the honest behaviour of a plain scalar and is very likely what she means when she renames something; it is flagged as an open question in §8 so it is a decision on record rather than an accident.
- **`Product.barcode`, `defaultPrice`, `photo`, `nfcTaggingEnabled`, every `InventoryUnit`, and every attached `NFCTag` are all completely untouched by a rename.**
- **No merge, ever.** Renaming a Product onto another Product's name is refused (§3.19b), never resolved by combining the two. Merging two Products would silently combine two independent identities' stock, prices, photos, barcodes, and sales history, and `decision-log.md` D2 keeps Product identity independent precisely so that cannot happen — the same reasoning §3.8's matching rule already gives for refusing to fuzzy-match "Bolsa" into "Bolsas."
- **Not a discount, haggling, or point-of-sale mechanism — n/a here, named only for parallel structure with §3.4a/§3.4b/§3.4c.**

### 3.19b Editar nombre — ya tienes un producto con ese nombre (new 2026-09-19)
```
┌───────────────────────────────┐
│ ← Camisas                        │  dimmed, visible underneath
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  Ya tienes un producto con ese    │
│  nombre:                         │
│   A   Accesorios                  │  passive — no es un botón
│       5 disponibles               │
│                                │
│  No se pueden tener dos productos │
│  con el mismo nombre. Ponle otro  │
│  nombre, o déjalo como estaba.    │
│                                │
│  [ Escribir otro nombre ]         │
│  [ Cancelar ]                     │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```
- **Extends two already-approved patterns rather than inventing a third.** The "this identifier already belongs to something else — pick a different one, nothing is reassigned" shape is §3.15's exact pattern ("Este tag ya está asignado a otra prenda") and §3.4e's ("Este código ya está registrado en otro producto"), applied here to a name. The recognition display — marker, name, disponibles for the *other* Product — reuses §3.8c/§3.4e's presentation, for the identical reason: a bare name is easy to misread past; a real, recognizable glance catches the mistake.
- **The recognition display is passive and deliberately unbracketed**, since nothing in it is tappable. **Noted, not fixed here:** §3.4e's own wireframe renders the same passive recognition display as `[A] Accesorios`, which reads as tappable under this document's `[ ]` convention. That is a pre-existing convention slip in a section this pass leaves otherwise unchanged; flagged for routing rather than silently corrected from here.
- **No merge, no reassignment, no swap offered — deliberately.** Her only two paths are a different name or backing out, the same narrow, conservative posture §3.4e and §3.15 already established for their own conflicts.
- **`[ Escribir otro nombre ]` returns to §3.19a with her typed text intact**, cursor in the field — she is one edit away, never retyping from scratch. Same "return to the nearer state, not the furthest one" behaviour §3.4e's own "Cancelar" and §3.8c's "No es este" already establish.
- **`[ Cancelar ]` returns all the way to §3.19, unchanged**, nothing staged, nothing written.
- **Nothing is written anywhere by reaching or leaving this state.**

### 3.19c Quitar código de barras — confirmación (new 2026-09-19, `decision-log.md` D80, Paid tier only)
```
┌───────────────────────────────┐
│ ← Bolsas                         │  dimmed, visible underneath
│  Bolsas                          │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  7501234567890                   │
│                                │
│  Si quitas este código, ya no     │
│  vas a poder encontrar este       │
│  producto escaneándolo.          │
│  Si te equivocas, puedes volver   │
│  a escanearlo.                    │
│                                │
│  [ Cancelar ]  [ Sí, quitarlo ]  │
├───────────────────────────────┤
│ Hoy [Inventario] Eventos Resultados │
└───────────────────────────────┘
```

**Con prendas que ya tienen tag (mismo sheet, una línea más):**
```
│  Si quitas este código, ya no     │
│  vas a poder encontrar este       │
│  producto escaneándolo.          │
│  Las prendas que ya tienen tag     │
│  siguen funcionando igual.        │
│  Si te equivocas, puedes volver   │
│  a escanearlo.                    │
```

- **Approved as additive, no RFC (`architect` ruling, `decision-log.md` D80).** Null is not a new state: `Product.barcode` is already optional, the database uniqueness index is partial so multiple nulls never collide, and §3.4c already renders "Sin código" as a correct, non-error reading of a legitimately absent fact. Freeing a value and later scanning it onto a different Product is constraint-safe and historically safe — D65's existing *replace* path already permitted effectively the same outcome.
- **Nothing historical breaks, and nothing on screen says so.** `SaleItem` stores `productId`/`unitId` and never the barcode; resolution is purely live, and the scanned code is consumed before any write ever happens. Past Sales, Digital Receipts (`home.md` §3.8f), Resultados' figures, and the Excel export (`reports.md` §3.19) are all untouched. **Deliberately not stated in the copy** — volunteering "tus ventas no se borran" would raise a worry she did not arrive with, and this document's own register for a factual, non-alarming state is to state what changes and stop (§3.4's "sin registrar" precedent, §3.4c's "Sin código").
- **Entry point:** §3.19, Level 2, its own full-width row directly beneath the Código de barras row and above the Nombre row. Never on the Catalog card — the Product Owner's explicit instruction, and it would fail §3.4's filter 1 regardless (a change, not pending work). Rendered only when this Product currently has a `barcode`; absent at "Sin código," where there is nothing to remove. **Paid tier only**, inheriting §2's existing gate exactly as its sibling change action does, never defining a separate one.
- **The action is explicit and its own intent — never an implicit consequence of saving a blank value (D80's first binding constraint).** The server's existing rejection of an empty or null barcode on the save path (`barcode_required`) stays exactly as it is and is not weakened. §3.4c already makes the implicit case unreachable from the UI, since it has no typed entry at all — "Volver a escanear" is its only capture mechanism, by design — so there is no blank-save path in this document for removal to be confused with. A labelled action is the only way to clear a barcode, anywhere.
- **What she taps:** `[ Quitar código de barras › ]` — fully labelled, never a "⋯", never a swipe, never a long-press. This document has no swipe or long-press vocabulary anywhere, and a removal is not the place to introduce one.
- **On-screen heading is the Product's name ("Bolsas"), never "Quitar el código de barras de Bolsas"** — the rule §3.19/§3.19a/§3.4a/§3.4b/§3.4c all hold, avoiding the CTA/heading-collision defect class (`ux-critic-findings.md` HJR-INV-M1, HJR-EVT-M1). The action lives in the body sentence, where it reads as a consequence rather than a restated label.
- **The confirm button is `[ Sí, quitarlo ]`, deliberately not a third near-identical action string.** A chain of row `[ Quitar código de barras ]` → heading → button `[ Quitar código ]` would say almost the same thing three times in three sizes. `[ Sí, quitarlo ]` answers the sentence directly above it instead of repeating the row she tapped, reusing §3.8c's own established `[ Sí, es este ]` affirmative-confirm shape rather than inventing one.
- **The sheet shows the exact code being removed, plainly and unformatted, exactly as §3.4c displays it.** Seeing the literal value before removing it is the same reasoning §3.4c's own staged "(actual)/(nuevo, sin guardar)" comparison rests on: the value is the whole point of the screen, and a bare "¿quitar el código?" would ask her to confirm something she cannot see.
- **The "Las prendas que ya tienen tag siguen funcionando igual" line renders only when ≥1 unit of this Product currently carries an attached `NFCTag`** (`InventoryUnit.tagId != null AND status IN ('available','reserved')`), counted live — the same allowlist scope §3.19's Level-1 line carries, since a `sold` unit keeps its `tagId`. **It must never be conditioned on `Product.nfcTaggingEnabled`** — on a barcoded Product that flag is always `false` (either §3.4c's clear-on-save cleared it, or the Product was created barcode-identified), so a flag-sourced condition would render this line **never**, in exactly the case it exists for. Same binding sourcing rule as §3.19's Level-1 `N ya etiquetadas` line (`architect` ruling, 2026-09-19). At zero tagged units the sheet shows the two-sentence form above, unchanged.

**Decision: this keeps a confirmation, and the reason survives the ruling.**

D80 is clear that both a confirmation and a plain save are architecturally sound — the write is reversible by rescanning and destroys no history. The deciding factor is therefore not severity, and it is not reversibility. It is that **every other edit on this page is protected by staging, and this one cannot be.**

Precio (§3.4a), Foto (§3.4b), and a barcode *change* (§3.4c) each stage the change locally behind an explicit Cancelar/Guardar pair — which is exactly the reasoning §3.4b gives for needing no confirmation dialog, and exactly the reasoning that let §3.9's Descartar confirmation be retired outright on 2026-09-18 (it protected staged data, and staging plus an explicit pair already gives her what a dialog would). A removal has no staging equivalent: the action *is* the change, so a single tap commits it with nothing in between. A confirmation is the cheapest way to give the one unstageable action on this page the identical protection every other action already gets for free — consistency with the page's existing posture, not an exception to it.

Three supporting facts, none load-bearing on their own:
- `Product.barcode` is not rendered on the Catalog card, so a mis-tap leaves no visible trace to notice it against afterwards (the same gap that made §3.4c add its own confirmation line).
- Recovery requires physically having the item in hand and rescanning it — §3.4c permits no typed entry, by design — which is not comparable to retyping a price.
- This row sits directly beneath the row that opens the *change* sheet. Two adjacent barcode actions with different outcomes is precisely the adjacency a confirmation is cheap insurance against.

**It is a plain confirmation, not a destructive-styled one.** No warning language, no red, no "esta acción no se puede deshacer" — that would be false, since D80 confirms it can. The copy states what changes, states what keeps working, and says she can rescan. One tap to confirm, no typed-to-confirm, no two-step.

**Decision: no in-flow NFC offer after a clear.**

D80 permits offering the NFC switch prominently right after a clear and forbids auto-enabling it. **No in-flow offer is added, because the page already makes the offer better than a prompt would.** On returning from a successful clear, §3.19's NFC row — in the exact screen position it already occupied — appears as a live switch reading `No`. The affordance appears where she is already looking, at the moment it becomes real, with no extra screen and no extra tap. This is the identical mechanism this amendment uses for the reverse case: turning NFC on withholds the navigation into tagging and instead surfaces `[ Etiquetar ]` on Level 1 in the same beat (§3.14's own 2026-09-19 retirement note). **Using one mechanism for both directions is what makes the page predictable**; adding a prompt here would make the two directions behave differently for no reason she could infer.

A prompt would also be asked at a moment she may not be deciding anything: clearing a misread code is the exact defect D65's own live production report was about, and that merchant has no NFC intent at all. *global-principles.md*, "the fastest interaction is the one that never happens" — a question asked at the wrong moment is a step, even when the answer is one tap.

**What she gets instead, and it is not nothing:** the ambient confirmation names the newly-available choice once, as a fact, without asking anything —

> `Código de barras quitado ✓ — ahora puedes venderlo con tag, si quieres.`

**The second clause renders only when the NFC row will actually be a live switch after the clear** (`nfcPerProductEnabled === true` and `nfc ∈ registrationMode`). For every other Business the line is plain `Código de barras quitado ✓` — mentioning a capability she does not have would be both untrue and the upsell posture §2 already rules out. Same ambient, fading, no-tap-to-dismiss shape as §3.4c's own "Código de barras actualizado ✓," and for the identical reason: nothing else visible confirms the write landed.

**What the write does, exactly.**
- **A single-column write on this Product** — `Product.barcode` set to null. **Zero `InventoryUnit` rows and zero `NFCTag` rows are touched (D80's fourth binding constraint).** No tag cleanup, no detachment, no cascade of any kind is designed here: any "clean up tags when identification changes" behaviour would be a second non-sale tag-detachment case and needs its own RFC. It is not designed, not implied, and must not be added at build time.
- **`Product.nfcTaggingEnabled` is not touched, in either direction (D80's second binding constraint).** It stays `false` — which it already was, whichever path produced the barcode (either §3.4c's save cleared it in the same write, D71, or the Product was created barcode-identified and never opted in). She opts into NFC separately, deliberately, through the now-live NFC row.
- **Clearing a barcode and enabling NFC are two separate merchant actions with two separate writes (D80's third binding constraint).** No combined "cambiar este producto a NFC" action exists anywhere in this document, and none may be added: it would bypass the server-side guard D71 deliberately introduced, and it would decide the opt-in on her behalf — the exact thing `settings.md` §2.8's "never turned on as a side effect of anything else" rules out at the Business level, applied here one level down.
- `defaultPrice`, `photo`, `name`, every `InventoryUnit`, and every attached `NFCTag` are all completely unaffected.

**After the clear — what she sees on §3.19.**
- The Código de barras row reads `Sin código`.
- `[ Quitar código de barras ]` is gone — its rendering condition no longer holds.
- The NFC row is now a **live switch reading `No`** (when her Business has NFC available), in the position it already occupied.
- `N ya etiquetadas` is unchanged, since it was never sourced from the flag — but it **drops its added clause**, because a live switch is now present to make the fact self-evident (§3.19's Level-1 condition).
- The ambient confirmation renders above, once, fading.

**Save discipline.** Near-instant / slow / error per §3.10/§3.11's existing convention; a failed removal leaves this sheet open, unchanged and retriable, with nothing written. Exposed to a client-initiated retry, so *architecture-principles.md* #7's stable-idempotency-key requirement applies — stated as a requirement on the build, against the same standing `product/02c-high-fidelity-prototype/BACKLOG.md` §F gap named at §3.4a/§3.4b/§3.19a and §3.19's NFC switch.

**`[ Cancelar ]` returns to §3.19 unchanged, nothing written** — identical decline treatment to §3.4a/§3.4b/§3.4c/§3.19a.

**No guard conditions, stated affirmatively rather than left silent.** D80 found none to impose: removal is permitted regardless of this Product's `available` count, regardless of `reserved` units in an in-flight Sale elsewhere, regardless of units committed to an open `EventAllocation`, and regardless of how many of its units carry tags. Nothing is blocked, nothing is warned about, and no branch of this flow depends on any of those facts. Recorded explicitly so a future reader does not mistake the absence of a guard for an oversight.

**Out of scope, deliberately not designed around (flagged by the ruling, handled separately).** D80 surfaced a genuine pre-existing defect elsewhere: `events.md`'s NFC scan entry point gates on `Product.nfcTaggingEnabled` while `commit_allocation` excludes tagged units, so residual tagged units of a now-barcoded Product cannot be committed to an Event allocation. That is `events.md`'s to fix, is being handled separately, and **this section does not compensate for it** — no warning, no guard, no copy here references it. Named only so a reviewer does not read its absence as a miss.

## 4. Interaction flow (summary)

```
Open Inventario tab
  → resolve (§2, automatic)
      → load fails ─────────────────────────→ fallback (3.18), Reintentar
      → Catalog empty ───────────────────────→ cold start (3.3) → tap "Registrar mercancía" → 3.6
      → Catalog has Products ────────────────→ Catalog view (3.4 / 3.5)

Catalog view (3.4):
  tap "Registrar mercancía" (bottom CTA) → 3.6 (blank) — origin: 3.4
  tap anywhere on a Product card → 3.19 (that Product's page)
      dimmed card (0 disponibles / sin registrar) → identical destination,
      unchanged; dimming never affects tappability
  tap a card's [ Etiquetar ] shortcut (rendered only while ≥1 eligible
    untagged unit exists on that Product) → 3.14, Product-scoped — origin: 3.4
  [retired 2026-09-19: marker tap → 3.4b; price tap → 3.4a; "⋯" → 3.4c;
   NFC switch (inline write); [ N sin etiquetar ] tap zone — all now
   reached from 3.19 instead, or replaced by a passive caption]

Página de producto (3.19) — understand/manage one Product:
  back arrow "←" → 3.4, always
  page fails to load / Product unresolvable → 3.18 (Reintentar), nav bar live
  [no resolving pair — renders synchronously from already-loaded state]

  Level 1 (ordering switches when pending tag work exists):
    tap "Etiquetar" (only while pending tag work exists; primary in that
      state) → 3.14, Product-scoped — origin: 3.19
    tap "Registrar mercancía" (primary otherwise; secondary while tag work
      is pending) → 3.6, Producto resolved, receipt stepper pre-revealed
      (default 1, "revisa antes de guardar", Guardar enabled) — origin: 3.19
    tap "Corregir cantidad" → 3.6, Producto resolved, correction mode
      pre-revealed (default = loaded count, delta 0, Guardar NOT rendered)
      — origin: 3.19

  Level 2:
    tap "Precio" (shape 1, "›") → 3.4a → Cancelar → 3.19 unchanged
                                        → Guardar precio → 3.19, row updated
    tap "Foto" (shape 1, "›") → 3.4b → Cancelar → 3.19 unchanged
                                      → Guardar foto → 3.19, row + header
                                        marker updated
    tap "Código de barras" (shape 1, "›", Paid only) → 3.4c
      → [3.4d/3.4e/3.4f/3.4g sub-flow unchanged]
      → Cancelar → 3.19 unchanged
      → Guardar código de barras → 3.19, confirmation per 3.4c's two-shape
        rule; if this save cleared nfcTaggingEnabled: NFC row gone,
        "N sin etiquetar" gone, [ Etiquetar ] gone, "N ya etiquetadas"
        gains its added clause
    tap "Quitar código de barras" (shape 2, "›", Paid only, rendered only
      when a code exists) → 3.19c (confirmación; muestra el código exacto)
        → "Cancelar" → 3.19 unchanged, nothing written
        → "Sí, quitarlo" → saving (3.10) → error (3.11-equivalent, sheet
          stays open, nothing written, retriable) or success → 3.19:
            · Código de barras row reads "Sin código"
            · "Quitar código de barras" row gone
            · NFC row becomes a LIVE SWITCH reading "No" (when
              nfcPerProductEnabled + nfc ∈ registrationMode); never
              auto-flipped to "Sí" — two separate actions, two separate
              writes (D80)
            · "N ya etiquetadas" unchanged, but drops its added clause
            · ambient "Código de barras quitado ✓ — ahora puedes venderlo
              con tag, si quieres." (second clause only when the NFC row
              will actually be live; otherwise plain "Código de barras
              quitado ✓")
          — DONE. Single-column write: zero inventory_units, zero nfc_tags
          rows touched; nfcTaggingEnabled untouched in either direction; no
          guard conditions on available/reserved/Event-allocated/tagged
          units (D80)
    tap the NFC row — LIVE SWITCH ONLY (shape 3; gated nfcPerProductEnabled
      + nfc ∈ registrationMode + NO barcode; no "›") → writes
      Product.nfcTaggingEnabled directly, in place
        → row dims, immediately shows the attempted value; further taps
          ignored while inflight
        → near-instant → un-dims on the new value, silently — DONE
        → slow (>~1.5s) → trailing value reads "Guardando…", row dimmed
        → success, ON, ≥1 available untagged unit exists → stays on 3.19;
          Level 1 gains "N sin etiquetar" + [ Etiquetar ] and switches to
          its pending-work ordering — NO navigation (2026-09-17 auto-entry
          retired, Product Owner decision)
        → success, ON, nothing available to tag → stays on 3.19, nothing
          added — an empty tagging queue is never a landing state (D46)
        → success, OFF → stays on 3.19; "N sin etiquetar" and [ Etiquetar ]
          both disappear; "N ya etiquetadas" unaffected (never sourced from
          this flag); already-tagged units untouched and still sellable (D71)
        → failure → value REVERTS to the last stored value; inline
          "No pudimos guardar. Intenta de nuevo." beneath that row only;
          the row itself is the retry, still tappable; rest of page
          unaffected
        → app backgrounded / connection lost mid-write → on return, the row
          renders whatever the server actually holds, re-read at page load;
          never a persisted "Guardando…", never a silently replayed attempt
      [Product HAS a barcode → NO NFC row on Level 2 at all (D71, absent
       never disabled). No branch. The persisting fact — "N ya etiquetadas
       — se siguen vendiendo con su tag" — renders on LEVEL 1, sourced from
       live InventoryUnit.tagId, only while ≥1 tagged unit exists. Passive,
       no target, no branch.]
      [nfcPerProductEnabled false or nfc ∉ registrationMode → row absent
       entirely; no branch]
    tap "Nombre" (shape 1, "›") → 3.19a (Editar nombre)
        → "Cancelar" → 3.19 unchanged
        → "Guardar nombre" (disabled while empty/whitespace-only)
            → normalizes (case-insensitive, trimmed, §3.8's rule) to a
              DIFFERENT existing Product → 3.19b (conflicto)
                  → "Escribir otro nombre" → 3.19a, typed text intact
                  → "Cancelar" → 3.19 unchanged, nothing written
            → normalizes to this same Product's own name (pure casing/
              spacing change) → saves normally
            → matches nothing → saves normally
            → saving (3.10) → error (3.11-equivalent, sheet stays open with
              her typed value) or success → 3.19, heading + Nombre row +
              marker (when no photo) all updated — DONE
            → concurrent rename elsewhere → surfaces via the same save-error
              path, no separate branch

  Level 3: nothing renders today (reserved, in order: Este producto en tus
    eventos; Movimientos de este producto; Desactivar producto) — see §8
    for the items owning each (product-decisions.md Q32; §8 item 3;
    product-decisions.md Q21).

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
      → success (RETURN TO ORIGIN — §3.6's own rule):
          this Lot's unit(s) are NFC-tagging-eligible (§2 step 3) →
            Asignar tags (3.14), Lot-scoped, auto-entered; origin
            propagates through the queue
          not NFC-tagging-eligible → back to ORIGIN (3.19, 3.4, 3.3/3.3a
            or Home), ambient confirmation (3.12) rendered there — DONE
          exception: origin was Home's cold start (or 3.3/3.3a), which
            this save itself makes untrue → 3.4 + ambient confirmation
  → [any point] back arrow / leave without saving → back to ORIGIN, draft
    preserved silently, resumes later at §3.6 exactly as she left it
  → to work on a different Product: finish (Guardar mercancía) or back
    out of this one, then start a fresh, independent Registro de
    mercancía from Catalog view (3.4) — never a continuation of this
    visit

Asignar tags (3.14, any of the three entry points — see that section's own list):
  scan tag → assign to next pending unit → counter decrements → repeat
  → tag already assigned → error (3.15) → scan a different tag
  → scan fails to read (out of range, foil, timeout) → error (3.16) →
    reposition and try again — queue state unchanged
  → tap "Terminar después" → back to ORIGIN (3.19, 3.4, 3.3/3.3a or Home,
    with the same "origin untrue" exception); on 3.4, every still-pending
    Product's card shows its own live "· N sin etiquetar" caption and
    [ Etiquetar ] shortcut; on 3.19, Level 1 reflects what's left
  → 0 pending, Lot-scoped entry → ORIGIN + "lista para vender" confirmation
    (3.13) — DONE
  → 0 pending, Product-scoped entry → ORIGIN + Product-named confirmation
    (3.13a) — DONE

**[Historical — retired 2026-09-19. Both tap zones below are gone from the
 Catalog card; their live replacements are specified in the Catalog view (3.4)
 and Página de producto (3.19) blocks above. Kept as an accurate record of what
 these paths did, not as live flows.]**

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

**[Historical — retired 2026-09-19.]** A fourth live path into Asignar tags
once existed: toggling a Product's NFC switch ON directly from the Catalog
row auto-opened the Product-scoped queue. Retired at the Product Owner's
explicit direction — the switch (now 3.19's NFC row) only ever writes the
setting. Kept as an accurate record of what that path did, not as a live
flow. Full prior text at
`inventory.changelog.md#status-2026-09-19-catalog-card-to-product-page`.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Cold start — no Product ever registered
3a. Entry from Settings' "Cambiar a vender con tags," zero inventory to tag yet (D46)
4. Catalog view — normal. **Card rewritten in full 2026-09-19: one tap target → state 19, plus one contextual `[ Etiquetar ]` shortcut under a hard one-shortcut-per-card cap. Zones 1–6 and the fixed reserved slot are retired as a set — see §3.4.**
4a. Editar precio — sheet, reached from §3.19's Precio row (D33; **Product-Page-level as of 2026-09-19**, formerly Catalog-row-level)
4b. Editar foto — sheet, reached from §3.19's Foto row (`product-decisions.md` Q23; **Product-Page-level as of 2026-09-19**, formerly Catalog-row-level) **[added to this enumeration 2026-09-19 — a pre-existing omission; §3.4b has existed since 2026-09-06]**
4c. Editar código de barras — sheet, reached from §3.19's Código de barras row (D65, new write path, Paid tier only; **Product-Page-level as of 2026-09-19**, formerly reached from the Catalog row's "⋯")
4d. Editar código de barras — volver a escanear, cámara activa (D65, Paid tier only)
4e. Editar código de barras — escaneo, coincide con otro producto, conflicto (D65, Paid tier only)
4f. Editar código de barras — permiso de cámara denegado (D65, Paid tier only)
4g. Editar código de barras — no se pudo leer el código (D65, Paid tier only)
5. [RETIRED 2026-09-17] Catalog view — pending tag work — see §3.4's own `· N sin etiquetar` caption and `[ Etiquetar ]` shortcut, and §3.19's Level 1 instead. **[Cross-reference corrected 2026-09-19 — the sixth zone this previously named is itself retired.]**
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
17. [RETIRED 2026-09-17] Asignar tags — "Terminar después" — see §3.4's Catalog view (state 4) plus its `· N sin etiquetar` caption and `[ Etiquetar ]` shortcut, and §3.19's Level 1. **[Cross-reference corrected 2026-09-19.]** "Terminar después" now returns to origin (§3.14), not unconditionally to Catalog view.
18. Defensive fallback / load error
19. **Página de producto** (new 2026-09-19) — one Product, three levels: stock/status + primary inventory actions; product details and identification; a named, reserved, undesigned Level 3. **Five defined variants:** default with pending tag work (NFC live switch, no barcode, `[ Etiquetar ]` primary); default without pending tag work (`[ Registrar mercancía ]` primary); barcode-identified with ≥1 tagged unit (Level-1 persistence line with its added clause, no NFC row, `[ Quitar código de barras ]` present); barcode-identified with 0 tagged units (no NFC anything); Free-tier/reduced (Precio, Foto, Nombre only). Plus the NFC switch's own **pending** (`Guardando…`, row dimmed) and **failure** (reverted value + inline retry line) states. **There is no passive Level-2 row shape** — passive facts render on Level 1.
19a. **Editar nombre — sheet** (new 2026-09-19) — validated on save against §3.8's existing case-insensitive/trimmed matching rule.
19b. **Editar nombre — ya tienes un producto con ese nombre** (new 2026-09-19) — conflict, no merge, no reassignment; extends §3.4e/§3.15's pattern.
19c. **Quitar código de barras — confirmación** (new 2026-09-19, `decision-log.md` D80, Paid tier only) — two copy forms (with and without the tagged-units line). Single-column write, no cascade, `nfcTaggingEnabled` untouched, no guard conditions.

## 6. Minimum step count

| Scenario | Taps / entries | Why it can't be fewer |
|---|---|---|
| Register 1 new Product line, quantity 1, Producto already exists in the Catalog (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto) + 1 (Guardar) | Cantidad defaults to 1 on Producto selection — no separate quantity step for the single-unit case, the most common one. |
| Register 1 new Product line, quantity 1, brand-new Product name never typed before (buttons-only) | 1 (Registrar mercancía) + 1 (abrir Elegir producto) + 1 typed Product name + 1 ("+ Agregar... como producto nuevo") + 1 typed Precio + 1 ("Agregar...", §3.8a) + 1 (Guardar) = 7 actions | Precio is a new required, gating cost the instant a brand-new Product identity is created (`decision-log.md` D33) — unlike Cantidad's default-to-1, no honest guessable default exists for a price, so it can't be automated away (§3.8a). A one-time cost per Product identity only: every later restock of this same Product reuses the row above, and never re-asks Precio. |
| Register 1 new Product line, quantity >1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto) + N−1 taps on `[+]` (or 1 typed entry) + 1 (Guardar) | Must still specify *how many* when it's not 1 — this is the information itself, not an artificial gate; typed entry stays the faster path for large counts. |
| ~~Register N Product lines in one visit (buttons-only)~~ **[RETIRED 2026-09-18]** | ~~1 (open) + N×(1 elegir producto [+ adjustment taps]) + (N−1)×(agregar otro producto) + 1 (Guardar)~~ | This shape no longer exists — see the row immediately below. |
| Register N different Products (buttons-only) | N × [1 (Registrar mercancía) + 1 (elegir producto) + adjustment taps + 1 (Guardar)] — no shared savings across Products | Each Product is now its own fully separate operation, start to finish (Product Owner decision, single-Product focus, §10). Strictly more total taps than the retired shared-batch shape above for N≥2 — an accepted, deliberate trade-off, not an oversight; see §10 for why the batch mechanism didn't survive review despite this cost. |
| ~~Restock an already-known Product at quantity 1 (tap Catalog row, receive new stock)~~ **[SUPERSEDED 2026-09-19 — see the corrected row below]** | — | Entry point moved to §3.19. |
| Same, but this Lot contains U units of a Product with `nfcTaggingEnabled = true` on an `nfcPerProductEnabled = true` Business (corrected `decision-log.md` D73 — no longer framed as a `defaultSellingMode = 'nfc'` scenario) | + U scans, 1 per physical unit | Per-unit tagging is a domain requirement (`decision-log.md` D4), not a UX choice — one tag, one unit, no shortcut exists that preserves traceability. A failed read (§3.16) costs zero extra taps — she simply re-presents the same tag. |
| ~~Ajustar el precio de un Producto ya existente, fuera de Registrar mercancía (Editar precio, §3.4a)~~ **[SUPERSEDED 2026-09-19 — see the corrected row below]** | — | Retired with the Catalog-row price tap zone (§3.4). |
| ~~Corregir el código de barras de un Producto ya existente (Editar código de barras, Paid tier only)~~ **[SUPERSEDED 2026-09-19 — see the corrected row below]** | — | Retired with the Catalog-row "⋯" zone (§3.4). |
| Restock an already-known Product via barcode scan, quantity 1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto → escanear código) + 1 (confirmar "Sí, es este") + 1 (Guardar) = 4 | One deliberate extra tap vs. the typed-name baseline (3) — the confirm-on-scan tap (§3.8c) is intentional, not an oversight; see §10 for why a barcode, unlike a typed name, gets this one extra tap every time it resolves to an existing Product. |
| Register 1 brand-new Product via barcode scan, no match, quantity 1 (buttons-only) | 1 (Registrar mercancía) + 1 (elegir producto → escanear código, sin coincidencia) + 1 typed Nombre + 1 typed Precio + 1 ("Agregar producto") + 1 (Guardar) = 6 | One fewer action than the typed-new-Product path (7) — the scan itself both searches and confirms "not found, create new" in a single motion, skipping the separate "+ Agregar... como producto nuevo" tap the typed path needs. |
| Browse the Catalog only | 0 taps | Opening the tab is itself the answer; nothing to register. |
| ~~Activar/desactivar NFC por producto para un Producto ya existente (Catalog row, fifth zone, §3.4)~~ **[SUPERSEDED 2026-09-19 — see the corrected row below]** | — | Retired with the Catalog-row fifth zone (§3.4). |
| ~~Reanudar el etiquetado de un Producto con trabajo pendiente (tocar `[ N sin etiquetar ]` en su fila)~~ **[SUPERSEDED 2026-09-19 — see the corrected row below]** | — | Sixth zone retired; replaced by the card shortcut (§3.4). |
| ~~Activar NFC por producto cuando ya hay unidades disponibles sin etiquetar (toggle)~~ **[SUPERSEDED 2026-09-19 — see the corrected row below]** | — | Toggle-ON auto-entry retired (§3.14). |
| ~~Corregir el conteo de un Producto ya registrado, sin mercancía nueva (tocar la fila, abrir corrección, ajustar)~~ **[SUPERSEDED 2026-09-19 — see the corrected row below]** | — | Entry point moved to §3.19. |
| ~~Corregir y recibir mercancía nueva en la misma visita (ambos abiertos)~~ **[SUPERSEDED 2026-09-19 — see the corrected row below]** | — | Entry point moved to §3.19. |
| Restock an already-known Product at quantity 1 | 1 (tarjeta → §3.19) + 1 ("Registrar mercancía," llega con la caja de recepción ya abierta) + 1 (Guardar) = **3** | **Corrected 2026-09-19 — unchanged at 3, despite the Product Page adding a hop.** The page's +1 is exactly offset by the receipt stepper arriving pre-revealed (§3.6), which removes D78's own "+ Recibir lote" tap. Deliberate, not a coincidence: it is why the pre-expansion exists. |
| Corregir el conteo de un Producto ya registrado, sin mercancía nueva | 1 (tarjeta) + 1 ("Corregir cantidad," llega en modo corrección) + N taps en `[−]`/`[+]` (o 1 entrada tecleada) + 1 (Guardar) | **Corrected 2026-09-19 — unchanged.** The page's +1 is offset by correction mode arriving pre-revealed, which removes the pencil tap. Both directions, floor 0, no fixed ceiling, unchanged. |
| Corregir y recibir mercancía nueva en la misma visita | 1 (tarjeta) + 1 ("Corregir cantidad") + N taps + 1 ("+ Recibir lote") + M taps (o 1 típeada) + 1 (Guardar) | **Corrected 2026-09-19 — unchanged.** One box arrives pre-revealed, the other is still an explicit tap. Two independent business facts composed behind one Guardar (D78), unchanged. |
| Ajustar el precio de un Producto ya existente (§3.4a) | 1 (tarjeta) + 1 (fila "Precio") + 1 (Guardar precio) = **3** | **Corrected 2026-09-19 — one more than before (was 2).** Product Owner decision, explicit and accepted: "+1 tap to edit price is acceptable. Do not use the card's shortcut allowance for price." A price edit is a change, not pending work, and fails the card's own filter 1 on its merits (§3.4). |
| Cambiar o quitar la foto de un Producto (§3.4b) | 1 (tarjeta) + 1 (fila "Foto") + 1 (Guardar foto) = **3** | Corrected 2026-09-19 — one more than before (was 2), same accepted trade-off as Precio. |
| Corregir el código de barras de un Producto (Paid) | 1 (tarjeta) + 1 (fila "Código de barras") + 1 (Volver a escanear) + 1 (Guardar código de barras) = **4** | Corrected 2026-09-19 — one more than before (was 3). The "⋯" zone is retired; a named row replaces an unlabelled glyph, which is itself the gain. |
| Quitar el código de barras de un Producto (Paid, §3.19c) | 1 (tarjeta) + 1 ("Quitar código de barras") + 1 ("Sí, quitarlo") = **3** | New. **Confirmed at 3 by `decision-log.md` D80 — the ruling imposes no guard conditions, so no step is added.** The one confirmation is a deliberate UX call the ruling explicitly left open (§3.19c: it is the only unstageable action on a page where every other edit is protected by a Cancelar/Guardar pair). Opting into NFC afterwards is a separate, optional action with its own cost (+1 on the now-live NFC row) — never bundled, never automatic (D80). |
| Activar/desactivar NFC por producto (§3.19's NFC row) | 1 (tarjeta) + 1 (toque en la fila) = **2** | Corrected 2026-09-19 — one more than before (was 1). A configuration change does not earn a card slot; the card is for scanning and comparing (§3.4's filter 1). Still no sheet and no confirm step — the whole row is the target, and it saves in place. |
| Activar NFC cuando ya hay unidades disponibles sin etiquetar, y empezar a etiquetar | 1 (tarjeta) + 1 (fila NFC) + 1 ("Etiquetar," que aparece ahí mismo) = **3** al prompt de escaneo | **Corrected 2026-09-19 — two more than before (was 1).** The direct, accepted cost of the Product Owner's own reversal: the switch is never a navigation trigger. The consequence still appears on the same screen without navigating, so the third tap is a deliberate choice she makes, not a step she is forced through. |
| Reanudar el etiquetado de un Producto con trabajo pendiente | 1 (`[ Etiquetar ]` en su tarjeta) | **Unchanged at 1.** This is exactly what the single card-shortcut allowance is spent on — the only Catalog-level action this amendment deliberately kept at one tap. |
| Cambiar el nombre de un Producto (§3.19a) | 1 (tarjeta) + 1 (fila "Nombre") + 1 texto tecleado + 1 (Guardar nombre) = **4** | New capability, no prior baseline. Nothing is guessable or defaultable about a name she is deliberately changing; the typed entry is the information itself. |
| Ver el precio, la foto, el código de barras, el estado NFC y cuántas prendas ya tienen tag, todo junto | 1 (tarjeta) | New. Previously impossible at any tap count — those facts lived in four separate sheets, and the tagged-unit count was not surfaced anywhere at all. |

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
- Resuming an interrupted, Product-scoped tagging queue — automatic and discoverable per card, via the Catalog card's own live-computed `· N sin etiquetar` caption and `[ Etiquetar ]` shortcut (§3.4), and via §3.19's Level 1. Never a whole-Catalog prompt, never a remembered cross-Product queue position — every card and every page always reflects its own current pending count, recomputed with the same composed test (§2) on every render.
- **[Retired 2026-09-19 — Product Owner decision, reversing 2026-09-17. Full prior text at `inventory.changelog.md#status-2026-09-19-catalog-card-to-product-page`.]** Turning a Product's NFC setting on once auto-opened Asignar Tags directly. It no longer does: the setting is a setting, and `[ Etiquetar ]` is the explicit action. What remains automatic, and is the real automation here: **the consequence of the setting appears on the same screen, in the same beat, without her asking** — §3.19's Level 1 gains `N sin etiquetar` and `[ Etiquetar ]` and switches to its pending-work ordering the instant the write lands, and loses both the instant she turns it off. She never has to navigate anywhere to find out what the setting did.
- Draft preservation of an in-progress Registrar Mercancía form across any
  accidental interruption — automatic, no discard-vs-keep prompt unless she
  explicitly asks via "Descartar."
- Producto arriving already resolved for a restock — removes a redundant
  search for something she's already looking at. **Corrected 2026-09-19:**
  the prefill now comes from §3.19's Level-1 `[ Registrar mercancía ]`
  (which additionally arrives with the receipt stepper already revealed),
  not from a Catalog-row tap — a Catalog card opens §3.19, never §3.6.
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
- Whether §3.19 shows the NFC switch at all — computed automatically from `Business.nfcPerProductEnabled` AND `nfc ∈ registrationMode` AND this Product having no `barcode`, the same multi-condition derivation discipline `settings.md` §2.8 applies to its own "Activar NFC" gate. Never a manual check Ana reasons through. **(Corrected 2026-09-19 — this gate moved from the Catalog row's retired fifth zone to §3.19's own row; the condition itself is unchanged.)**
- The composed **NFC-tagging-eligible** test (`decision-log.md` D71, §2) — computed fresh, per unit, every time Asignar Tags' auto-entry or pending-nudge logic runs; Ana never has to remember which Products she's opted in, or reconcile it herself against her selling mode.
- Assigning a fresh barcode via §3.4c automatically clears a conflicting `Product.nfcTaggingEnabled = true` in the same write — she never has to remember to turn the NFC switch off herself first (§3.4c's own new bullet).
- Cantidad disponible actual's decrease write converges to whatever target she lands on, computed against real-time `disponibles` at Guardar, never a stale client-side subtraction — she never sees or resolves a race condition herself. An increase carries no equivalent race at all, by construction (`decision-log.md` D78) — she never has to reason about the difference.
- A correction left untouched (still equals the loaded count) costs nothing — no correction write fires at all, the same zero-cost-for-the-common-case discipline INV-Q1's marker already established.
- Which specific `InventoryUnit`s a decrease actually consumes — FIFO, invisible, automatic (`decision-log.md` D5/RFC 0016). An increase mints fresh units through the existing, unmodified Lot/InventoryEntry generation path — no second unit-creation code path for Ana to ever be aware of.
- A removed, tagged unit's `NFCTag` release — automatic, invisible, no separate step (unchanged from D77, retained by D78).
- Whether a correction is written as `source='correction'` vs. a receipt as `source='supplier_delivery'` — decided entirely by which of the two on-screen actions she used (pencil vs. "+ Recibir lote"), never a question asked separately (`decision-log.md` D78).
- Whether "Guardar mercancía" renders at all — computed live from whether the current draft carries any real, nonzero staged effect, never a manual check Ana has to reason through (`decision-log.md` D78; "+ Agregar otro producto" itself retired 2026-09-18, single-Product focus, §10).
- **Whether a Catalog card carries its one shortcut at all** — computed live, per card, per render, from §2's composed test. She never configures, dismisses, or maintains it; it appears with the work and leaves with it.
- **Where every flow returns to** — computed from the operation's own origin, never asked. She is never shown a "¿a dónde quieres volver?" choice, never has to re-navigate back to the Product she was working on, and never lands on a screen she did not come from (§3.6/§3.14/§4). The one exception (an origin the save itself makes untrue) is itself derived, not asked.
- **Rename conflict detection reuses §3.8's existing matching rule** — she is never asked "¿es un producto nuevo?", never asked to confirm a near-match, and never offered a merge. The normalization is the same one already applied at the picker (`decision-log.md` D2, §3.8).
- **A rename propagates to every past Sale, report, and receipt automatically**, because all of them reference the Product by ID and never stored its name (`domain-model.md`). She never re-labels history, and there is no migration or re-tagging step of any kind.
- **Whether §3.19 reports `N ya etiquetadas`, and whether that line carries its added clause** — both computed live: the count from `InventoryUnit.tagId != null AND status IN ('available','reserved')`, the clause from whether a live NFC switch is present to make the fact self-evident. She never toggles, dismisses, or maintains either.
- **Which confirmation shape §3.4c returns with** — computed from whether that save actually cleared a flag and whether tagged units exist, never a preference and never a question.
- **§3.19's per-row capability gates are resolved once, at tab load** (*architecture-principles.md* #1) — never re-checked per row and never re-checked per tap, so opening a Product Page performs no new capability work at all.

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
   Inventario (§3.4's own `· N sin etiquetar` caption and `[ Etiquetar ]`
   shortcut, and §3.19's Level 1 — corrected 2026-09-19) so she's nudged to
   finish before it
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

4. **Whether toggling a Product's NFC-eligibility off, mid-Event, while some of its units are already committed to that Event's allocation (`events.md`'s own scope), needs any special handling — not designed in this document.** `events.md`'s own parallel D71 amendment is the authoritative source for that surface, not this one; this item exists only so the cross-document dependency is named rather than silently assumed solved. `product-decisions.md` Q31's own worked scenario flags this same seam explicitly ("remember review nfc assignment to the events because I'm [sure] this functionality could change"). **[Cross-reference updated 2026-09-19.]** The toggle this item concerns now lives on §3.19's NFC row rather than a Catalog-row zone. The seam itself is unchanged and still `events.md`'s to resolve.

5. **[Resolved 2026-09-18, `decision-log.md` D78/RFC 0016 — no longer a live risk, kept for the historical trail per this document's own non-deletion discipline.]** A Cantidad actual correction left unreviewed alongside Cantidad's own default-to-1 could silently add one phantom unit she didn't intend, on a visit whose only real purpose was correcting a miscount. This risk was named against D77's shape, where both boxes rendered together unconditionally the instant Producto resolved. That shape is retired: Cantidad recibida (the receiving stepper) is now only ever shown after she deliberately taps "+ Recibir lote" — there is no longer a way to open a correction without the receiving stepper being silently present alongside it. The scenario this item was written against no longer exists by construction, not because the existing mitigations (the marker, adjacency, committed-list carry-through) got stronger.

6. **Marking a Product inactive — a named reserved place on §3.19's Level 3, explicitly not designed in this pass. Owned by `product-decisions.md` Q21; not a new item.** Q21 settled the mechanism on 2026-08-30 as an **active/inactive state on `Product`**, deliberately scoped as a general Inventario capability for any discontinued product rather than narrowly as starter-catalog cleanup, and ruled that an inactive Product "disappears from the selling grid/active Catalog view but stays fully intact for history, `reports.md`, and every existing `Sale`/`SaleItem`." **This document uses Q21's own vocabulary — activo/inactivo, "Desactivar producto" — and deliberately does not introduce "archivar" as a competing term** for the same mechanism. What this amendment contributes is the decided *location*: Q21's own "Not yet designed" list names "the actual toggle affordance (where in `inventory.md` a merchant sets a Product active/inactive)" as open, and Level 3, last, is that home. **Three items remain open and are Q21's, not this document's:** the affordance itself (label, confirmation if any, what it says about stock on hand, whether reactivation is reachable and from where); Q21's own named `architect` check on whether `active`/`inactive` needs a new `Product` field or can derive from something already modelled — **`Product.active` does not currently exist**, being absent from `domain-model.md`'s `Product` entry and from `types.ts` and deliberately kept out of the Stage 7 Phase 1 schema per *architecture-principles.md* #5, so `decision-log.md` D55's and `settings.md`'s citations of it are sound as *naming* precedent for `BusinessMembership.status`'s shape and unsound as an existence claim; and one question this page's own existence newly raises — **an inactive Product disappears from the active Catalog view, and the Catalog card is now the only route to §3.19**, so the affordance's design must also answer how she reaches an inactive Product's page at all.

7. **[Resolved 2026-09-19 — `architect` ruling, `decision-log.md` D80, plus its follow-up clarification. Kept, not deleted, per this document's non-deletion discipline.]** This item held open the consequence copy and guard conditions for clearing an existing `Product.barcode`. **It is fully closed.** D80 approved clearing as additive with no RFC (null is not a new state — the field is already optional, the uniqueness index is partial, and "Sin código" is already a correct reading) and confirmed nothing historical breaks (`SaleItem` stores `productId`/`unitId`, never the barcode; resolution is purely live and the code is consumed before any write). Every branch is specified in §3.19c under four binding constraints: the clear is its own deliberate action, never an implicit blank-save (the server's `barcode_required` rejection stays); it does not touch `nfcTaggingEnabled` in either direction; clearing and opting into NFC stay two separate actions with two separate writes, with no combined action anywhere; and there is no cascade — zero `inventory_units`, zero `nfc_tags` rows. **No guard conditions were imposed**, on `available`, `reserved`, Event-allocated, or tagged units — recorded affirmatively in §3.19c so a future reader does not read their absence as an oversight. The follow-up clarification resolved the one gap `ux-critic` found: D71's "visible/settable only when `barcode` is unset" governs the **control**, not the topic, so the switch stays absent while a read-only statement sourced from `InventoryUnit.tagId` is permitted and now renders on §3.19's Level 1 (§10). The two UX calls the ruling explicitly left open — confirmation vs. plain save, and whether to offer NFC in-flow after a clear — are both made and justified in §3.19c.

7a. **Carried forward from item 7, deliberately not bundled.** D80 surfaced a genuine pre-existing defect in `events.md`: its NFC scan entry point gates on `Product.nfcTaggingEnabled` while `commit_allocation` excludes tagged units, so residual tagged units of a now-barcoded Product cannot be committed to an Event allocation. Being handled separately; §3.19c deliberately does not design around it, warn about it, or reference it in copy. Named here only so its absence from this pass is visibly a decision. Related to, but distinct from, item 4's own events/NFC seam.

8. **A rename retroactively relabels every past Sale, report, and receipt, and no name history is kept (2026-09-19).** A direct, unavoidable consequence of `Product.name` being a plain mutable scalar referenced everywhere by ID — no data is altered or deleted (D25 fully satisfied); only the one label every historical row already resolved through changes. In the common case this is what she means by renaming. **Deliberately recorded as a named open question here rather than opened as its own `product-decisions.md` item — reasoning stated so the classification is reviewable, not assumed:** (i) it is not a question about what to build, since the behaviour is fully specified and deterministic in §3.19a; (ii) it is a disclosed consequence of an already-settled Foundation posture (`decision-log.md` D33 for `defaultPrice`, D54 for `photo`, D65 for `barcode` — "plain mutable current scalar, no version history"), not a gap the Foundation leaves open; (iii) the change that would reverse it — preserving name-at-time-of-sale — would revise D33's posture itself and therefore belongs in `product/99-rfc/`, not in an open-questions log; (iv) §11 already carries the exact structural sibling (whether `defaultPrice` history should ever be visible) as a named future consideration with no ID, and splitting the two would be inconsistent. **If the Product Owner reacts to this and wants name-at-time-of-sale, it becomes an RFC against D33, not a `product-decisions.md` item.** Non-blocking either way.

9. **§3.19's Level 3 contextual sections are reserved, not designed (2026-09-19) — `product-decisions.md` Q32.** "Este producto en tus eventos" would be an Inventory-side read of `EventAllocation`, which `events.md` owns end to end (§3.21–§3.25, `product-decisions.md` Q24/Q25, `decision-log.md` D57/D59) and which is OWNER-only there — what an Inventory screen may show, and whether it inherits that role scoping, is that document's call, not this one's. "Movimientos de este producto" is additionally blocked on **§8 item 3** (whether `Lot` is ever meant to be browsable to Ana) and on `InventoryCorrection`'s deliberate internality (D78, RFC 0016). Nothing renders for either today; no empty heading, no placeholder. **Q32 explicitly excludes the inactive-Product affordance, which belongs to Q21 (item 6 above).**

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — Home's
  cold-start CTA skips a redundant second empty screen (§3.3 annotation, §10);
  the post-save confirmation is ambient, not a screen requiring a dismiss tap
  (§3.12/§3.13); Asignar Tags auto-continues after Guardar with no
  intermediate question (§3.14, when this Lot has ≥1 NFC-tagging-eligible
  unit — `decision-log.md` D46/D71, corrected D73 to drop the
  `defaultSellingMode` gate); Producto arrives already resolved from
  §3.19's Level-1 action, removing a redundant Product search (§3.19, §6 —
  corrected 2026-09-19 from the retired Catalog-row shortcut).
- *"Never ask twice"* — an in-progress Registrar Mercancía draft survives any
  interruption without a discard-vs-keep prompt (§3.7); an interrupted
  per-Product tagging queue resumes with a single tap on that row's own
  pending-tag affordance, never asking "were you still tagging?" and never
  asking which Product or where she left off — both already known (§3.4's
  own caption plus `[ Etiquetar ]` shortcut, and §3.19's Level 1; corrected
  2026-09-19);
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
- *"The fastest interaction is the one that never happens," extended 2026-09-19* — the Catalog card stops being six decisions and becomes one; the `[ Etiquetar ]` shortcut exists only while there is work and vanishes when there is not; §3.6 arrives pre-expanded from §3.19, so the reveal tap she already implied is never asked for again; §3.19 shows price, photo, barcode, NFC state and tagged-unit count together, so checking any of them costs zero taps where it previously cost one sheet each, or was impossible.
- *"Never ask twice," extended 2026-09-19* — "return to origin" means she is never asked where she came from and never has to navigate back to the Product she was working on (§3.6/§3.14/§4); rename validation reuses §3.8's already-defined matching rule rather than a second, parallel one; a rename propagates to every past Sale by ID, so she never re-labels history; no in-flow NFC prompt follows a barcode clear, since the now-live switch appears in the position it already occupied.
- *"The best interface is the one that stays out of the merchant's way," extended 2026-09-19* — Catalog view is returned to what §1's second real context actually describes ("a fast, honest glance at what do I have and how much"): a scanning surface with no live write on it and nothing to aim at. Management moved to the screen whose whole job is management.
- *"Business language always comes before technical language"* — §3.19's NFC row reads "Vender con tag NFC," never `nfcTaggingEnabled`; its disclosure says "las prendas que ya tienen tag siguen igual," never "already-tagged units retain eligibility"; §3.19b says "Ya tienes un producto con ese nombre," never "name collision"; §3.19c says "ya no vas a poder encontrar este producto escaneándolo," never "clearing `Product.barcode` removes the scan-resolution path."
- *"Technology should disappear"* — the NFC row's save is silent unless genuinely slow, one plain line when it is, and a plain reverted value plus one sentence when it fails; no spinner label, no status string, no error code anywhere on §3.19. A barcode-identified Product whose units still carry tags is an internally interesting state and a merchant-facing non-event, described in one clause and never surfaced as something to resolve.
- *"Never delete historical data" (D25), extended 2026-09-19* — a rename alters no Sale, SaleItem, Lot, InventoryUnit, EventAllocation, or Claim row; only the label they already resolved through changes. Clearing a barcode is a single-column write touching no unit and no tag row. §3.4's retired zone enumerations, the retired 84px reserved slot, and the retired 2026-09-17 toggle-ON auto-entry are all marked and preserved at `inventory.changelog.md#status-2026-09-19-catalog-card-to-product-page`.
- *"The merchant experiences Products. The platform preserves Inventory traceability," extended 2026-09-19* — this is the principle an earlier draft of this amendment violated, and the correction is instructive: it reported a Product-level *setting* where she experiences *garments*, rendering "NFC: No" for a Product with ten tagged garments still selling by tag. Sourcing `N ya etiquetadas` from unit state is that principle applied literally.
- *"Selling is a state, not a navigation destination"* — checked explicitly rather than assumed irrelevant: §3.19 adds a navigation destination inside Inventario, reads no Session/Sale state, and creates no route into or out of Selling. Nothing on it can be reached mid-Sale, and nothing on it changes what a live Session can do.

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
  NFC row's own copy — "Vender con tag NFC," trailing `Sí`/`No` — names the
  mechanism she's actually choosing (tag vs. no tag), never
  `nfcTaggingEnabled` or `nfcPerProductEnabled` as raw field names
  (`decision-log.md` D71). **Corrected 2026-09-19: this copy moved from the
  Catalog row's retired fifth zone to §3.19's NFC row; the wording rationale
  is unchanged.**
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
- *#1 (capabilities resolved once, upstream), extended 2026-09-19* — §3.19's per-row gates are the same values §2 already resolved at tab load, read here and never re-derived, never re-checked per row, never re-checked per tap.
- *#4 (internal-only entities never leak), extended 2026-09-19* — §3.19 names no `InventoryUnit`, `Lot`, `InventoryEntry`, `InventoryCorrection`, `NFCTag`, or `Lot.source` anywhere. `N ya etiquetadas` reports a count of physical garments carrying a physical tag; the distinction that makes it correct — unit state vs. Product flag — is entirely invisible to her, which is the point: she is told a true thing about her garments, not a true thing about a field. Level 3's reserved "Movimientos" section is unnamed on screen precisely because designing it would mean deciding how much of the Lot/correction ledger surfaces, which §8 item 3 has not settled.
- *#6 (one-way dependency direction), extended 2026-09-19* — every write reachable from §3.19 (`defaultPrice`, `photo`, `barcode`, `nfcTaggingEnabled`, `name`) stays inside Inventory's own ownership of `Product`; §3.19 reads Identity-owned capability facts one way, exactly as this document already does, and reads or writes no Selling state of any kind. Selling remains a read-only consumer of `Product.barcode` (`home.md` §3.9a/§3.9b, D65) and is untouched by anything on this page — including a rename, which changes nothing Selling reads by ID, and a barcode clear, which Selling simply stops resolving. No cascade, and no second non-sale tag-detachment path.
- *#7 (client-retryable writes must be idempotent or keyed), 2026-09-19* — the NFC switch's write, the rename write, and the barcode-clear write are all exposed to a client-initiated retry, so each must carry a stable idempotency key generated once per attempt and reused unchanged on every retry. **Stated as a requirement on the build, deliberately not as a claim about what exists**: this document has twice been corrected for asserting a key that was not actually generated (§3.4a/§3.4b's `reviewer` corrections). The same standing gap (`product/02c-high-fidelity-prototype/BACKLOG.md` §F, covering `commitLot`/`editPrice`/`setProductPhoto`) covers these three until §F is closed.
- **§3.4's own tap-zone disambiguation discipline — reversed rather than extended a fifth time (2026-09-19).** Four consecutive amendments (Q23's marker/body/price split, D65's overflow zone, D71's NFC switch, 2026-09-17's pending-tag indicator) each correctly reasoned a new control into its own non-overlapping zone rather than nesting it. The discipline worked every time and is unchanged. What it could not do — because it is a rule about *individual* controls — is notice the aggregate: six zones on the one screen whose job is glancing. The new invariant is stated at the level the old one could not reach: **a Catalog card is one tap target, with a hard cap of one contextual shortcut and an ordered precedence list for any future candidate (§3.4).** This is the first amendment in this family to *remove* zones, and it is what the discipline itself implies once the count of zones is the defect.

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

- **The Catalog card becomes one tap target into a new Product Page (§3.19), 2026-09-19 (Product Owner decision, live, following a `ux-designer` audit and a `ux-critic` review returning "sound with specific changes").** Six zones (marker, body, price, "⋯", NFC switch, pending-tag indicator) reduce to one, plus one contextual `[ Etiquetar ]` shortcut. **Model 3 was chosen over leaving the card as-is or splitting it further** because the defect was never any individual zone — each was correctly reasoned — but the count, on the one screen (§1's second real context) whose entire job is glancing at what she has. Every retired zone's destination is preserved exactly, one tap deeper, in a screen whose job is management. Three costs accepted explicitly: +1 tap for Precio, Foto, and the NFC setting; +1 for a barcode correction; +2 for turning NFC on *and* starting to tag. Two costs deliberately engineered to zero: restock and count-correction both stay at their current step counts, via §3.6's pre-expanded reveals. One cost deliberately kept at zero: resuming tagging, which is what the single shortcut allowance is spent on.
- **Price does not get the card's shortcut allowance (Product Owner decision, verbatim):** "+1 tap to edit price is acceptable. Do not use the card's shortcut allowance for price. I want to keep the card structurally stable rather than gradually adding shortcuts again." A price edit is a *change*, not pending work, and fails §3.4's filter 1 on its own merits independent of the cap — so this is a principled exclusion, not a rationing decision.
- **The shortcut rule gains a hard cap and an ordered precedence list (closes `ux-critic` m2).** The four filters were a filter and never a limit — m2's own `Agotado [ Recibir ]` example passes all four honestly. The cap is the Product Owner's: **at most one shortcut per card, ever.** Precedence is an explicit ordered list maintained in §3.4 (one entry today: `[ Etiquetar ]`), extended deliberately by whatever amendment ever adds a second candidate — never a heuristic resolved at render time, which would have to read facts the card does not display (breaking filter 2) and would make a card's content non-deterministic between renders. `Agotado [ Recibir ]` is deliberately **not** added: restocking already has a full-width CTA on this very screen and is Level 1's first action on the page the card opens.
- **Turning a Product's NFC setting ON no longer auto-enters Asignar Tags — the 2026-09-17 behaviour is reversed and retired (Product Owner decision, verbatim):** "turning NFC on should only change the product setting. It should NOT automatically enter tagging. [Etiquetar] is the explicit action that starts the tagging flow." The 2026-09-17 reasoning (extending D46's post-Guardar auto-entry to the toggle) was sound about *immediacy* and wrong about *category*: a configuration change and a work-queue entry are different intentions, and one firing the other means the switch quietly does two things. **What preserves the original intent without the navigation:** the consequence becomes visible on the same screen, in the same beat — §3.19's Level 1 gains `N sin etiquetar` and `[ Etiquetar (N) ]` the instant the write lands. D71's never-untag/never-orphan invariant is unchanged, unreopened, and now stated in the row's own copy rather than left implicit.
- **"Return to origin" becomes this document's single navigation rule (Product Owner decision, closes `ux-critic` M3).** Applied to all three of Registro de mercancía's exits — back arrow, "Guardar mercancía" success, and the completion or deferral of any tagging run, including a Lot-scoped queue auto-entered from a save (origin propagates through the queue; it belongs to the operation, not to the preceding screen). **One exception, stated as a rule rather than a special case:** if the save itself makes the origin untrue, return to the nearest still-true state — exactly one case today, a Home cold-start-originated save, whose origin's own precondition ("no Product ever registered") the save falsifies. This closes the gap where a tagging run started from the page ended somewhere that was not the page.
- **`[ Etiquetar ]`'s hit area is specified as binding, not illustrative (closes `ux-critic` M4).** Structural separation first — the shortcut is on line 2, the price on line 1, so they share no horizontal space and the shortcut's presence can never move the price column, the exact defect the Product Owner reported and the retired 84px reserved slot existed to fix. Within line 2: a fixed-width, fixed-position trailing slot, reserved list-wide. Minimum 48×48 hit area with a real, non-zero gap, where a tap in the gap resolves to the card (the reversible destination). **No nested-button semantics** — the card's tap region explicitly excludes the shortcut's rect; these are two sibling regions in one visual block, never a control inside a control.
- **The NFC row's pending, failure, and revert-on-failure behaviour are fully specified (closes `ux-critic` M1).** It is the only control on §3.19 that saves instantly and had the same silent-failure gap already flagged elsewhere. Optimistic display on tap, dimmed row, silent when near-instant, `Guardando…` when slow, **revert to the last stored value on failure** plus one inline sentence scoped to that row, the row itself as the retry, and a defined interruption behaviour (re-read from the server at page load, never a persisted `Guardando…`, never a silently replayed attempt). The optimistic display is only safe *because* the revert is guaranteed; the two are one decision.
- **The NFC row is tappable across its whole width and carries no "›" (closes `ux-critic` m1).** Every other Level-2 row opens something; this one changes something in place. A chevron says "opens"; a current `Sí`/`No` value that flips under her finger says "changes here." No row on this page may carry both signals.
- **A sold-out card stays dimmed *and* tappable — restated at card level (closes `ux-critic` m3).** Dimming here means "needs restocking," never "disabled," and this is now a statement about the whole card rather than one zone within it. Her previous risk (reaching for a dimmed row and hitting a zone she did not mean) is structurally gone. The contrast with `home.md` §3.9, where dimming *does* pair with non-tappability, is unchanged and still deliberate.
- **Product rename added and fully specified (§3.19a/§3.19b), 2026-09-19.** `Product.name` is a plain mutable scalar; every dependent references the Product by ID, so a rename is retroactive by construction and no historical row is altered or deleted (D25 fully satisfied). Validated on save — not as she types — against §3.8's existing case-insensitive/trimmed rule, reused verbatim; a conflict with a *different* Product is refused with §3.4e/§3.15's established "identifier already claimed, no reassignment" pattern; a pure casing/spacing change of this same Product's own name saves normally. **No merge, ever** — merging would silently combine two independent identities' stock, price, photo, barcode, and sales history, which D2 exists to prevent. **No name history kept**, matching D33/D54/D65's "plain mutable current scalar" posture for `defaultPrice`/`photo`/`barcode`; the consequence (past sales report under the new name) is logged as §8 item 8 rather than left to be discovered.
- **A way to remove an existing `Product.barcode` added as an entry point (§3.19c), with consequence copy and guard conditions deliberately left unwritten.** Product Owner's own instruction: design the entry point and interaction shape now, and check the implications for existing inventory and tagged units before specifying behaviour. The `architect` ruling on exactly that is in flight. Settled now: the row's location (page, not card), its rendering condition, the confirmation and why it earns one when §3.4a/§3.4b do not, the decline branch, and the fact that the NFC row appears afterwards reading `No` and is **never** auto-flipped to `Sí`. Pending: everything about what she is told and what is guarded (§8 item 7).
- **Product archive: a named reserved place in §3.19's Level 3, explicitly not designed.** Product Owner's own instruction. No affordance renders today — not disabled, not hinted. What this pass delivers is the decided location and the named set of questions its own design pass must answer first (§8 item 6), including an Architect question about whether `Product.active` is a real field or a stale `domain-model.md` citation.
- **§3.4's stacked three→four→five→six-zone enumerations replaced with one current description.** Preserved unmodified at `inventory.changelog.md#status-2026-09-19-catalog-card-to-product-page`. A reader should not have to reconstruct a card's current behaviour by diffing four superseded lists — the same readability problem this amendment fixes on screen, fixed in the document.
- **Clearing an existing `Product.barcode` specified in full, 2026-09-19 (`architect` ruling, `decision-log.md` D80 — approved as additive, no RFC).** Null is not a new state; nothing historical breaks, since `SaleItem` stores `productId`/`unitId` and the code is consumed before any write. Four binding constraints honored explicitly in §3.19c: an explicit, deliberate action rather than a blank save (the server's `barcode_required` rejection stays and is not weakened); no touch to `nfcTaggingEnabled` in either direction; clearing and opting into NFC kept as two separate actions with two separate writes, with **no combined "switch this product to NFC" action anywhere** — that would bypass D71's server-side guard and decide the opt-in for her; and **no cascade** — zero `inventory_units`, zero `nfc_tags` rows, with any tag-cleanup-on-identification-change behaviour explicitly out of scope and RFC-requiring. **No guard conditions imposed**, recorded affirmatively rather than left silent.
- **Decision: the clear keeps a confirmation (the UX call D80 explicitly left open).** The ruling makes reversibility and history-safety non-factors — both options were architecturally sound. The deciding factor is that **every other edit on §3.19 is protected by staging behind a Cancelar/Guardar pair, and a removal cannot be** (the action *is* the change). A confirmation gives the page's one unstageable action the same protection the others get for free — consistency with the page's existing posture, not an exception to it. This is also why §3.9's 2026-09-18 retirement does not argue against it: that confirmation protected *staged* data, the opposite case. **Plain confirmation, not destructive-styled** — no warning language and no "no se puede deshacer," which D80 confirms would be false.
- **Decision: no in-flow NFC offer after a clear (the second UX call D80 left open).** The ruling permits offering the toggle prominently and forbids auto-enabling. Neither is chosen: the NFC row transforms in place, in the same screen position, from passive to a live switch reading `No`, and an ambient line names the newly-available choice once without asking anything — with its second clause rendered only when the row will actually be live, so a Business without NFC is never told about a capability she does not have. **This is the same mechanism this amendment already uses in the reverse direction** (turning NFC on surfaces `[ Etiquetar (N) ]` on Level 1 instead of navigating), and using one mechanism for both directions is what makes the page predictable.
- **§3.19's NFC row corrected from "absent on a barcoded Product" to "present but passive," 2026-09-19 — a correction to this same pass's own earlier draft, prompted by D80's description of the barcode/NFC steady state.** D71 requires the toggle to be *unsettable* while a barcode exists; it never required the row to be invisible. **Absence is the right posture for a capability she does not have** (Free tier, `nfcPerProductEnabled = false`) — nothing is missing from her point of view. **It is the wrong posture for a choice this Product has already made**, where the absence itself is the confusing thing: a page silent about NFC for a Product whose units may visibly carry tags. The three row states (live switch / absent / passive) are never visually interchangeable — the passive variant drops the trailing value slot entirely and is unbracketed, so it can never read as a switch that happens to be off. **The steady state it describes is coherent and is stated as such, never as a conflict or a warning** (D80): tag resolution carries no barcode or Product-flag predicate and FIFO does not exclude tagged units, so an already-tagged unit of a now-barcoded Product stays reachable both ways and keeps working. The "already-tagged pieces keep working" line renders only when ≥1 tagged unit actually exists.
- **Queue magnitude after a barcode→NFC transition named as an expectation, not designed around (D80).** A Product that accumulated stock under barcode identity drops its whole untagged `available` population into the tagging queue at once, because the queue is computed live and never cached. Intended behaviour. **No threshold, no warning, no confirmation prompt is designed** — a threshold would be a number nothing in this Foundation defines. What carries the expectation is the honesty of the count everywhere it appears (§3.19's Level 1, the Catalog card's caption, and the queue's own "Faltan N de N" — two sightings before she starts) plus "Terminar después" being reachable from the first scan onward, which is what makes a large queue a job she can start rather than a wall (§3.14).

**Add to §10's `ux-critic` resolution table, as a new final row:**

| **Architect-pending item (original handback)** — §3.19c's consequence copy and guard conditions | Resolved by `decision-log.md` D80; §3.19c specified in full; §8 item 7 marked Resolved (kept, not deleted); §3.19's NFC row corrected to a three-state gate as a direct consequence |
- **Tag cleanup when a Product's identification method changes** — explicitly not designed and explicitly RFC-requiring (`decision-log.md` D80). Today, clearing or assigning a barcode touches zero `NFCTag` rows, and already-tagged units of a barcode-identified Product keep working. Any future "detach tags when identification changes" behaviour would be a second non-sale tag-detachment case alongside the removal path D77/RFC 0015 already defines, and must go through an RFC — never added as a build-time convenience inside §3.4c or §3.19c.
- **A combined "cambiar este producto a NFC" action** (clear the barcode and opt into NFC in one tap) — explicitly ruled out, not deferred (`decision-log.md` D80). It would bypass the server-side guard D71 deliberately introduced and decide the opt-in on her behalf, which `settings.md` §2.8's "never turned on as a side effect of anything else" rules out at the Business level and D71 rules out at the Product level. Not a future consideration; a standing prohibition, recorded here so a future pass does not propose it as an obvious convenience.
- **The barcode/NFC persistence fact resolved, 2026-09-19 (`architect` clarification; no RFC, no change to D80).** D71's "visible/settable only when `barcode` is unset" governs `Product.nfcTaggingEnabled`'s **control**, not every NFC-related fact — D71 itself separates them, stating the flag "never itself asserts unit-level sellability, which stays derived purely from `InventoryUnit.tagId`." **Both disclosure surfaces ship**, answering different questions: a standing Level-1 line (the more durable, since tagged garments stay true for months) and a one-time acknowledgment banner at the moment of change (needed because three affordances vanish at once from a page she is acting on). **Two binding rules:** sourced from the live tagged-unit count, never the flag; rendered only while ≥1 tagged unit exists, since a standing line at zero would reintroduce the phantom-entry class D73 removed.
- **An earlier draft of this same pass would have shipped a false statement, and the record is kept (2026-09-19).** That draft put a read-only "Vender con tag NFC — No" row on Level 2 of a barcode-identified Product. On a Camisas with ten tagged and three untagged garments, that is true of the flag and false of the ten garments, which still resolve by tag and still sell (`add_item_to_sale_by_tag` carries no Product-flag or barcode predicate, D79). **The root cause was structural, not a copy slip:** the fact was filed on the wrong level. A passive row sitting among Precio/Foto/Código/Nombre takes their shape, and the only Product-level NFC attribute available to a row like that is the flag. **The fix is the level split, stated as an invariant: every Level-2 row is a tap target; passive facts belong on Level 1**, alongside `N disponibles` and `N sin etiquetar`, sourced from live unit state. Form 4 (the passive row shape) is deleted from §3.19's shape table so the misfiling cannot recur.
- **The tagged-count line renders regardless of identification method, not only on barcoded Products** — one rule, no special case. The consequence is deliberate and is the better half of this design: the line does not *appear* when a barcode is assigned, it was already there and simply **stays** while the three untrue things disappear. Nothing new pops up at the moment of change; the constancy of the true fact is itself the reassurance. Only its one added clause ("— se siguen vendiendo con su tag") is conditional on there being no live toggle to make that obvious.
- **Three disappearances, two of them correct and deliberately not restored.** The NFC toggle going absent is required by D71. `N sin etiquetar` and `[ Etiquetar ]` going absent is required by D73 — those untagged garments genuinely stopped being taggable, and that figure persisting was the phantom-queue defect D73 fixed. Only the third fact, that already-tagged garments keep selling, persists and was previously stated nowhere. The copy explains the first two rather than reversing them.
- **Not carried on the Catalog card.** A reassurance fact she goes looking for, not a comparison fact she scans across Products; line 2 already carries `N disponibles · N sin etiquetar`, and §3.4's whole rewrite is about the card not accumulating.

- **`N ya etiquetadas`'s status scope corrected before build (`reviewer` finding, `architect` ruling, 2026-09-19).** The derivation shipped in draft as a bare `tagId != null`, which counts already-sold garments, since an `NFCTag` row survives the sale. Corrected to `tagId != null AND status IN ('available','reserved')`, as an allowlist — the same boundary D10's dual-purpose tag resolution already partitions on, and the narrowest scope Inventory can compute without reading Selling's `EventAllocation` (*architecture-principles.md* #6). **The spec's own worked example was the evidence**: `8 disponibles / 10 ya etiquetadas / 3 sin etiquetar` cannot hold, since three available untagged units cap the available tagged ones at five. **The correction's real consequence is a cross-basis one** — `ya etiquetadas` and `disponibles` now sit on different status bases, so the former can legitimately exceed the latter, and at `0 disponibles` it can be the only nonzero figure on Level 1. Resolved the way D78 resolved the identical problem: the figure with the unusual basis names its own basis in its own copy, via a second conditional clause fired by a plain comparison of two figures already on screen (`ya etiquetadas > disponibles`), never by a read into Selling and never by a check of *why* a unit is `reserved` — which Inventory cannot know, and which it would be worse to guess at than to leave unsaid.

**`ux-critic` finding resolution — traceable against both rounds of its audit:**

| Finding | Where resolved |
|---|---|
| **M1** — NFC switch needs pending state, failure state, revert-on-failure | §3.19's NFC row, "Save-state discipline": optimistic display on tap, dimmed row, silent near-instant, `Guardando…` when slow, **revert to last stored value on failure** plus one inline sentence scoped to that row, the row itself as retry, defined interruption behaviour, idempotency stated as a build requirement. §4's NFC-row branch map; §5 state 19's named variants. The optimistic display and the guaranteed revert are stated as one decision, since the first is only safe because of the second. |
| **M3** — one consistent return target, applied to all three exits | §3.6's "Return to origin" rule (back arrow, Guardar success, auto-entered queue); §3.14's corrected Completion and "Terminar después" bullets; §2 steps 3/4; §4 throughout. One exception, stated as a rule (an origin the save itself makes untrue), not a special case. |
| **M4** — `[ Etiquetar ]` hit area, fixed position, price column, no nested buttons | §3.4, "Hit-area requirements," points 1–4: structural line separation first (shortcut on line 2, price on line 1, zero shared horizontal space — impossible by construction, not prevented by convention), then the fixed reserved slot within line 2, then ≥48×48 with a real gap resolving to the card, then explicit non-nesting. |
| **m1** — whole NFC row tappable, no "›" | §3.19's Level-2 shape table and the NFC row's own specification. Closed **affirmatively** rather than negatively: every sheet-opening row carries "›" and may never omit it; the instant-write row never carries it and trails only a closed binary `Sí`/`No` vocabulary. Two independent pre-tap signals, both readable at rest. |
| **m2** — four-part rule is a filter, not a limit | §3.4, "The shortcut rule — a filter *and* a cap": four filters + hard cap of one + an ordered precedence list maintained in that section. A computed tie-break was rejected explicitly (any usable one reads facts the card does not display, breaking filter 2, and makes a card's content non-deterministic between renders). `Agotado [ Recibir ]` addressed by name and deliberately not added. |
| **m3** — sold-out row stays dimmed *and* tappable at card level | §3.4, "A dimmed card stays fully tappable — restated explicitly now that the whole card is the target." Her previous risk (reaching for a dimmed row and hitting a zone she did not mean) is structurally gone. |
| **Verification Major-1** — pre-tap signal asserted counterfactually | §3.19's Level-2 shape table (see m1 above). The previous formulation was a rule about one row's *absence*, which distinguished nothing when no row carried an indicator. |
| **Verification Major-2** — ordering contradicted its own cited precedent | §3.19's Level 1: the 2026-08-07 precedent is now **applied as cited** — `[ Etiquetar ]` primary whenever it renders, `[ Registrar mercancía ]` secondary in that state only, mirroring §3.5/§3.17's own shape. No new Product Decision was needed. |
| **Verification Major-3(a)** — the barcoded-product NFC disclosure | Resolved by the `architect` clarification; see the dedicated bullets above and §3.19's Level-1 `N ya etiquetadas` line. Both disclosure surfaces ship (standing line + one-time acknowledgment at §3.4c/§3.19c). |
| **Verification Major-3(b)** — retire-and-mark not carried through to §3.13a | §3.12/§3.13/§3.13a's wireframes all corrected to the current card shape; §3.13a's title parenthetical and entry-point bullet corrected. §3.4's "render this exact card, unchanged" claim is now true as written rather than downgraded. |
| **Verification m1–m4** | Unbracketed markers plus the whole-block notation rule (§3.4); §3.19c's heading brought into the family rule and its confirm button differentiated to `[ Sí, quitarlo ]`; the origin-untrue exception stated at §3.14's completion; §3.19's synchronous-render statement replacing a missing resolving pair. |
| **Verification m5** | Sequencing only — open-item IDs assigned by Main on application (`product-decisions.md` Q21, Q32). |
| **Suggestions** | `etiquetar` vs. "Asignar tags" checked and deliberately left as-is (HJR-INV-M1's established CTA≠heading pattern; "tag" is established merchant vocabulary here). Card and page shortcut labels unified to `[ Etiquetar ]`, with no count in either, since both screens show the count one line away. |

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
- **[Resolved 2026-09-17 — see §3.4's card-level `[ Etiquetar ]` shortcut and §3.19's Level-1 action / §3.14's entry point 3. Cross-reference corrected 2026-09-19, when the sixth zone itself was retired.]** A manual, per-Product resume affordance now exists.
- The events-side interaction this document flags but doesn't resolve (§8, item 4) — a Product's NFC-eligibility toggling off mid-Event, against already-committed allocation units — `events.md`'s own parallel D71 pass, not this document's.
- **A second Catalog-card shortcut** — deliberately not added (§3.4's ordered precedence list has exactly one entry). `Agotado [ Recibir ]` is the obvious candidate and passes all four filters honestly; it loses on the cap and on redundancy. If real usage ever justifies one, it is added by placing it in that list deliberately, in §3.4, never by relaxing the cap.
- **§3.19's Level 3 contextual sections** — location decided, behaviour not designed (`product-decisions.md` Q32; §8 items 3 and 9).
- **Marking a Product inactive** — reserved place on Level 3, mechanism already decided, affordance not designed (`product-decisions.md` Q21; §8 item 6).
- **Name-at-time-of-sale / rename history** — explicitly out of scope, the structural sibling of this section's existing price-history item: `Product.name` is a plain mutable scalar with no version history, matching D33's posture for `defaultPrice`. Reversing it would revise D33 and belongs in `product/99-rfc/`, not an open-questions log (§8 item 8).
- **Tag cleanup when a Product's identification method changes** — explicitly not designed and explicitly RFC-requiring (`decision-log.md` D80). Clearing or assigning a barcode touches zero `NFCTag` rows, and already-tagged units of a barcode-identified Product keep working. Any "detach tags when identification changes" behaviour would be a second non-sale tag-detachment case alongside D77/RFC 0015's removal path, and must go through an RFC — never added as a build-time convenience.
- **A combined "cambiar este producto a NFC" action** (clear the barcode and opt into NFC in one tap) — **explicitly ruled out, not deferred** (`decision-log.md` D80). It would bypass D71's server-side guard and decide the opt-in on her behalf. A standing prohibition, recorded here so a future pass does not propose it as an obvious convenience.
- **Surfacing tagged-unit counts elsewhere** (the Catalog card, `events.md`'s allocation lists, `reports.md`) — deliberately not designed. §3.19's line answers a question at the one screen about one Product; generalising it into a standing badge is a different decision needing its own evidence.
- **A read-only "inspect" view for the Código de barras value** — not designed; §3.19's row already shows the value in full, which the retired "⋯" zone never did.
