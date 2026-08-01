# 0002 — Customer Segmentation as a core capability: multi-mechanism Claim, derived intelligence only

Status: Accepted

## The idea
Customer Segmentation (`company/CLAUDE.md`'s Core Thesis, `backlog.md` #2) is a **core product capability**, not an NFC-specific one. Its target design, described completely here regardless of build order:

- **Claim is a single business capability** (`loyaltyEnabled`), resolvable through **multiple, mode-appropriate mechanisms** — an NFC tag scan (existing, D10/D4, unit-level), a Sale-level QR/claim token (new, described below), and future mechanisms following the same pattern. All mechanisms converge on the identical terminal write: one or more Customer↔SaleItem Claim links. A Sale-level QR scan resolves into N independent SaleItem-level Claim links (one per item in that Sale) in a single customer action — the same shape a multi-item NFC Sale already produces via N separate tag scans. No new "Sale-level Claim" concept; `ubiquitous-language.md`'s Claim definition stays structurally the same, generalized only in *how* it's triggered.
- **Customer Identity belongs exclusively to the Loyalty platform.** The Merchant Application never performs identification, never runs any part of the Loyalty experience, and never reads raw Customer or Claim records.
- **The Merchant Application consumes only derived customer intelligence** — an anonymized, aggregate signal (e.g., counts of frequent vs. occasional buyers) computed by Loyalty-claim and exposed read-only to Intelligence. No name, no contact info, no per-Claim drill-down ever reaches the merchant app.
- **Selling gains a new artifact**, not a new aggregate root: an opaque, signed claim token generated on `Sale` at finalization time, whenever `loyaltyEnabled = true`, regardless of `registrationMode`. This is what the merchant app displays (as a QR) to let a Buttons-mode customer start the Loyalty-claim flow. Must be an opaque/signed token, never the raw Sale ID (D10's own reasoning — a customer scan must never be able to affect or forge a Sale — extends directly to: it must not be able to *guess* one either).

## What it touches
- `domain-model.md`: bounded-context table — Loyalty-claim's "Depends on" gains `Selling (read-only, resolves Sale → SaleItem set for the Sale-QR mechanism)`; Intelligence's "Depends on" gains `Loyalty-claim (read-only, derived/aggregate signal only — no Customer/Claim identity)`. New "Key mechanisms" entry describing multi-mechanism Claim resolution.
- `ubiquitous-language.md`: Claim's definition generalized beyond "via its InventoryUnit's tag." Customer's definition generalized beyond "post-sale tag scan." Two new terms: **Claim Token** (the Selling-owned, Sale-level artifact) and **Derived Customer Intelligence** (the only form in which customer-related information ever reaches the Merchant Application).
- `decision-log.md`: new entry recording this decision, referencing D10 (unedited, still historically accurate for the NFC mechanism specifically) and D21 (the merchant-app-boundary wording this builds on).
- **Not touched by this RFC**: `reports.md` §3.10/§3.12 ("Tus clientes") stays an illustrative placeholder for now — turning it into a real spec against this now-resolved data source is tracked as a separate follow-up UX task, not done as part of this Foundation change.

## Why
Raised as Q8 (`company/business-decisions.md`), resolved after a joint Planner (business-impact) and Architect (domain-implications) analysis across three rounds — first evaluating the original NFC-tag-only framing, then correcting the assumption that Loyalty-claim was inherently NFC-gated, then evaluating a concrete Sale-QR mechanism once proposed. Both agents independently confirmed: the three framing principles (one capability, multiple mechanisms, one customer experience) are structurally clean and consistent with the Foundation; a Sale-level QR resolving into N SaleItem-level claims is the correct generalization, matching how NFC already behaves; and the "derived intelligence only" boundary is the correct shape for the Intelligence→Loyalty-claim read edge — an aggregate signal, never raw identity.

Product Owner resolved Q8 by choosing this complete-capability design over narrowing Customer Segmentation's scope to something identity-free (the alternative "Path (b)"), on the grounds that Customer Segmentation is a core product capability from the start, not an artifact of which registration mode a merchant happens to use.

## Implementation sequencing — explicitly separate from this vision
This RFC describes the **complete target capability**. It does not commit to a build order. Per the Product Owner's explicit instruction, implementation may be staged; that staging is tracked in `company/backlog.md` #2, not in the Foundation — the Foundation describes what the system *is*, the backlog describes what ships *when*. See `decision-log.md`'s entry for this decision for the cross-reference.
