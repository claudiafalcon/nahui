---
name: nahui-core-principles
description: A curated, condensed digest of Nahui's load-bearing, frequently-checked Foundation rules — global-principles.md and architecture-principles.md in full, plus a current-state distillation of decision-log.md's most-referenced invariants. This is a FAST-PATH, not a replacement for the full Foundation documents. If a question isn't clearly settled here, read the actual source doc (product/00-foundation/) — never infer or guess past a gap in this digest. Not yet the default loading path for any agent — pending A/B validation (see company/bitacora.md, 2026-08-12).
---

# Nahui Core Principles — Digest

**This is a fast-path, not a new source of truth.** `product/00-foundation/` remains authoritative. Every rule below traces to a specific source doc/decision-log entry — if your question isn't clearly answered here, or the answer feels like it depends on nuance this digest doesn't carry, stop and read the full source doc. Guessing past a gap in this digest is exactly the failure mode it must never cause.

## Product Language (`global-principles.md`)
- Merchant-facing text: natural Mexican Spanish, never a literal translation, never the UI in English.
- Everything else (docs, code, agent output): English.
- Use the merchant's own vocabulary, never engineering terms — she thinks "llegó la mercancía," never "se creó un InventoryUnit."
- **Actively check for internal/bounded-context terms leaking untranslated into merchant-facing copy** — `ubiquitous-language.md`-scoped words like Claim, InventoryUnit, SaleItem, Lot, or any other domain-model noun are never merchant-facing, in Spanish or English, even inside otherwise-natural Spanish copy. This is a distinct, recurring violation pattern — don't fold it into a generic "sounds too technical" impression; scan copy specifically for domain nouns dropped in unchanged.

## UX Principles (`global-principles.md`)
- The fastest interaction is the one that never happens — question every added step.
- Never ask twice — if the system already knows something, it never asks again.
- Technology should disappear; the software thinks about the merchant, not the reverse.
- Selling is a state, not a navigation destination — no persistent "Ventas" tab.
- Business language before technical language.
- The merchant experiences Products; the platform preserves Inventory traceability underneath.
- Every repeated decision should become automation, never a recurring question to the merchant.
- Capture business truth once, reuse it forever.

## Pipeline (`global-principles.md`)
**Architect → UX Designer → UI Designer → UX Critic → Reviewer → Builder.** Sequencing/prioritization is Main's own work (`backlog-prioritization` skill), not a pipeline stage. UX Critic reviews UX quality; Reviewer checks Foundation consistency — two lenses on the same deliverable, not a duplicate pass. New ideas that touch the domain model, ubiquitous language, or IA start as an RFC (`product/99-rfc/`) before the Foundation itself changes.

## Architecture Principles (`architecture-principles.md`, all 7, technical/binding)
1. Capabilities resolve once, upstream, never mid-flow (`Session.operatingMode` at Session-open).
2. Aggregate boundaries follow write-throughput needs, not just conceptual nesting (Sale is its own root because of the <3s speed bar).
3. Optional relationships stay optional in the data model, not just the UI (Session's `eventId` is nullable).
4. Internal-only entities never leak into user-facing language (InventoryEntry/InventoryUnit; if a concept needs its own screen, it's not internal-only anymore).
5. Schema stability can be deliberately over-modeled — exactly once, and only when explicitly named in `decision-log.md` (Supplier/purchase cost is the one sanctioned case, not a general license).
6. Dependency direction is one-way, enforced by context: Selling reads Inventory/Identity; nothing reads Selling; Intelligence/Loyalty-claim read everything, nothing reads them.
7. Client-retriable writes must be idempotent/keyed — a stable key generated once, reused on every retry; the server treats a repeat as already-done, never a duplicate (D30).

## Current-state Foundation invariants (distilled from `decision-log.md` — current truth, not history)

**Business Capabilities.** `subscriptionTier` (Free/Paid) is fully self-service, bidirectional, at any time; changes never delete historical data; may carry a pending-value + effective-date pair (D25). `defaultSellingMode` is self-service-editable, takes effect immediately, no pending/effective-date structure (D27).

**NFC/`registrationMode`.** `nfc` is a pure read-time derivation of `subscriptionTier = paid` — never independently stored or toggled (D27). `buttons` is always available. The welcome tag package is fulfillment/logistics only; it grants no capability (D27).

**Session Operating Mode.** Resolved once at Session-open from `defaultSellingMode` + a computed, never-persisted NFC Readiness check (Ready/Limited Ready/Not Ready over tagged sellable inventory), immutable for that Session's lifecycle (D23). If capability changes mid-Session, that Session finishes in whatever mode it already resolved.

**Frequent Customers / Loyalty (current state — supersedes any older mention of `loyaltyEnabled`).** `loyaltyEnabled` is retired (D40) — there is no such field. Frequent Customers is ONE capability, gated purely by `subscriptionTier = paid`: absent entirely on Free tier (no Claims, no registration, no QR, no segmentation), fully available on Paid tier with no merchant activation/deactivation toggle. Per-Sale QR-offering is a transient UI choice at the Digital Receipt moment, never a capability or Business-level field.

**Customer / Loyalty-claim.** `Customer` is a Business-scoped aggregate root (`businessId` + `email`, unique pair) — no cross-Business identity (D35, D37). The Merchant Application never identifies customers directly; it consumes only Derived Customer Intelligence (anonymized) plus the allowlisted Loyalty Participation Record — never raw Claim data (D22, D35). Loyalty-claim is customer-facing, zero merchant-IA presence, lives in `product/02-ux-loyalty/` not `product/02-ux/` (D10, D38).

**Pricing.** `Product.defaultPrice`, optional `Event.bazaarCost` (captured, not computed into margin yet), optional per-selling-group price overrides owned by Event, and `SaleItem.pricePaid` (resolved automatically at Sale-write time, never a merchant decision) (D33). The Foundation's pricing model is a working MVP model, explicitly reversible as real evidence arrives — not held to a permanence bar it's never actually had (D33).

**Figma node-reuse / cloning.** Load `figma-clone-discipline` for the full two-axis test — this digest doesn't restate it; that Skill is the source of truth for this specific, high-recurrence defect class (D31, D32).

**Document placement (Architect Decisions, no RFC needed for these kinds of moves).** Foundation docs → `product/00-foundation/`; Medium-Fidelity tracking → `product/02b-medium-fidelity/` (Figma is source, this folder just tracks); Onboarding/Settings are sequencing/affordance facts, not nav tabs — no fifth/sixth tab exists (D12, D13, D24).

**Decision ownership.** Architect Decision = resolved by interpreting existing Foundation. Product Decision = changes product behavior/UX/scope, needs an RFC/Product Owner call. Business Decision = pricing/commercialization/legal/ops, needs Product Owner escalation. Load `decision-ownership-classification` for the full routing mechanic (D14 established this split).

## When this digest is not enough
If a question turns on the *reasoning* behind a rule (why a decision was made, what it superseded, whether a specific edge case was considered), or touches an area not listed above at all, this digest has reached its limit — read `decision-log.md` (or the specific doc named above) directly rather than extrapolating from what's here.
