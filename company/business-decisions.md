# Business Decisions

Standing log of open questions classified as **Business Decisions** under the Decision Ownership policy in `company/CLAUDE.md`: pricing, commercialization, legal, compliance, operations, or strategic business choices — not something Architect can resolve from `product/00-foundation/`, and not primarily a product-behavior/feature-scope question.

This file was created by reclassifying entries that previously lived in `product/02-ux/architect-questions.md`, per the new Decision Ownership policy. **Content and status are unchanged from the original entries** — this is a governance move, not a reassessment.

Entries are never deleted once resolved; mark them Resolved with the outcome instead, so the history of what was ambiguous and why stays intact (same non-deletion rule as `product/99-rfc/`).

## Open

### Q5 — Are Business Capabilities ever merchant-self-service-editable after onboarding?

- **Raised by:** Architect's IA recommendation on Onboarding/Settings placement.
- **Question:** Is `registrationMode`/`subscriptionTier`/`loyaltyEnabled` fixed for a Business's lifetime once chosen (e.g., changed only by a backend/support process, such as a tier upgrade triggered by a sales conversation), or can Ana ever change one herself in-app? This determines whether `settings.md` needs any merchant-facing UI at all.
- **Architect finding:** Genuine gap. `subscriptionTier` upgrading free→paid is implied by `company/backlog.md` #2 and the business-model direction in `company/CLAUDE.md`, so *some* change mechanism must exist somewhere — but whether it's merchant self-service is unresolved. The navigational placement, if self-service turns out to be true (hangs off Home's `▾` affordance, not a fifth tab), is already resolved and logged as `decision-log.md` D13.
- **Referenced from:** `product/00-foundation/information-architecture.md` "Onboarding and Settings" section; will be referenced from `product/02-ux/settings.md` once that doc exists.
- **Status:** Open — needs a Business Decision (pricing-tier change mechanism) before Settings UX can be fully designed (or ruled out of merchant-facing scope entirely).

### Q4 — Who/what sets `registrationMode` (and other capabilities) on first run?

- **Raised by:** Architect's IA recommendation on Onboarding/Settings placement.
- **Question:** A Business must have its initial capabilities (`registrationMode` at minimum) set before Home's resolution logic has anything to resolve. Is this Ana self-selecting during onboarding, implied by a purchase decision (e.g., buying an NFC starter kit, per D11), or something else? The Foundation doesn't settle this.
- **Architect finding:** Genuine gap — a business decision about onboarding content, not a navigational one. The navigational placement (a first-run flow precedes all four tabs, is not itself a tab) is resolved and logged as `decision-log.md` D13; this question is narrower and still open.
- **Referenced from:** `product/00-foundation/information-architecture.md` "Onboarding and Settings" section; will be referenced from `product/02-ux/onboarding.md` once that doc exists.
- **Status:** Open — needs a Business Decision before Onboarding UX can be fully designed.

### Q8 — Does paid-tier customer segmentation require merchant-visible customer identity, and how does that reconcile with Loyalty-claim's "zero merchant IA presence"?

- **Raised by:** ux-designer's Resultados draft §8, item 1, during Resultados UX design — the most consequential finding in that draft.
- **Question:** `company/CLAUDE.md`'s core thesis and `backlog.md` #2 frame customer segmentation as a paid-tier, merchant-facing Resultados feature ("can't tell a high-volume-occasional buyer from a small-but-every-bazaar buyer"). But `domain-model.md`'s bounded-context table puts Customer identity entirely inside Loyalty-claim, explicitly "customer-facing, no merchant IA presence," and `information-architecture.md` itself states the loyalty-claim flow has "no entry point anywhere in the merchant app." There is currently no mechanism by which Ana's app could ever know two Sales came from the same repeat customer — that link only forms on the *customer's* own device, post-sale (D10). The draft's "Tus clientes" screen was built as an explicitly-flagged illustrative placeholder, not backed by a resolved data source.
- **Architect finding:** Confirmed genuine, unresolved tension between two frozen documents — not a contradiction the Foundation already resolves. `domain-model.md`'s bounded-context table gives Intelligence a "Depends on" column of `Inventory, Selling (read-only)` — Loyalty-claim is not listed; the narrative summary sentence saying "Intelligence and Loyalty-claim depend on the others" is loose paraphrase, the table is authoritative. This absence is consistent with (not an oversight against) `ubiquitous-language.md`'s Customer definition, `information-architecture.md`'s "no entry point anywhere in the merchant app," and D10's reasoning — none of which ever contemplated a read-only aggregate signal flowing back. Two genuinely different resolutions: **(a) Architectural** — add a new read edge (Intelligence → Loyalty-claim or narrower) exposing only an anonymized/aggregate signal (e.g. "N repeat buyers," no identity/drill-down); this reopens D10 explicitly, amends the bounded-context table and Customer/Claim definitions — RFC territory (changes a dependency graph + ubiquitous language, both explicit RFC triggers), and would itself need Business sign-off before Architect implements it, since it changes what the paid tier commercially delivers. **(b) Business/scope narrowing** — redefine "customer segmentation" in `company/CLAUDE.md`/backlog #2 to something the current model already supports without any Customer entity (e.g., Session/Event-level purchase-pattern metrics) — but this likely means the originally-validated friction (telling apart a specific high-volume-occasional buyer from a specific small-but-every-bazaar buyer, which is inherently person-level) isn't what actually gets built. Architect's recommendation: hold `reports.md` §3.10 exactly as illustrative until (a) or (b) is decided — this is a business call, not an architectural one.
- **Referenced from:** `product/02-ux/reports.md` §3.10, §8 item 1.
- **Status:** Open — needs a Business Decision between (a) sponsoring an RFC reopening D10/Loyalty-claim's boundary, or (b) narrowing the segmentation promise to something person-identity-free. This is the most consequential open item across all three decision logs — it determines whether "Tus clientes" in Resultados becomes a real feature or gets redefined.

## Resolved

_(none yet)_
