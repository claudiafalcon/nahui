# Backlog (priority order)

## 1. Sale registration — IN PROGRESS
- Prototype exists: /product/01-validation/registro.html (button-based, simulates tap)
- Next: test with Ana or simulate realistic bazaar conditions (see /evidence)
- Success bar: >=90% of sales registered, <3 sec per registration

## 2. Customer segmentation / Reports (Frequent Customers) — IN PROGRESS (UX)
- Previously gated behind real sales history from #1 ("do not start until #1 has real usage data"). That gate predates the Product Foundation and the `product/02-ux/` restructuring and no longer applies — see `company/lessons.md` 2026-07-31.
- Reports (Resultados) is part of current MVP UX scope, documented alongside Home/Inventario/Eventos in `product/02-ux/`.
- **Customer Segmentation capability resolved** (`company/business-decisions.md` Q8, `decision-log.md` D22, `product/99-rfc/0002-loyalty-claim-complete-capability.md`): a core capability, not NFC-specific — Claim resolves via NFC tag scan or a Sale-level QR Claim Token, Merchant App consumes only Derived Customer Intelligence. **Frequent Customers has since moved from a deferred, lower-priority module to a real MVP-vision capability, and is a Paid-tier-only capability, not a merchant-toggled one** — `decision-log.md` D35 schematized `Customer` as a real, Business-scoped aggregate root and introduced the allowlisted Loyalty Participation Record read edge; D34 corrected segmentation *visibility* to gate on `subscriptionTier=paid` alone; **D40 (2026-08-09) went further and retired `loyaltyEnabled` entirely** — there is no merchant-facing activation toggle anywhere in the product, for visibility or for Claim collection. Entitlement is automatic on Paid, structurally absent on Free — Ana never enables or disables it. `reports.md`'s "Tus clientes" (§3.6/§3.12/§3.13) is a real, fully-specified feature, not an illustrative placeholder — the earlier note here describing it as one is stale as of D22/D34 and is corrected by this entry. The Foundation describes the **complete** target design; implementation is staged, tracked here, separately from that vision:
  - **Stage 1** — NFC-mechanism Claim resolution (already-specified, D10/D4) + the Intelligence→Loyalty-claim read edge exposing Derived Customer Intelligence. Ships first; works for NFC-mode merchants; doesn't require the Sale-QR mechanism.
  - **Stage 2** — the Sale-level Claim Token/QR mechanism, extending the same segmentation signal to Buttons-mode merchants.
  - **Corrected 2026-08-08 (Product Owner + `architect`, re-evaluated against Frequent Customers' new MVP standing):** Stage 2 was previously described here as "touching the same critical path" as backlog #1's registration-speed bar — that description is factually wrong for the mechanism as actually specified, not merely superseded by changed priorities. The Digital Receipt QR (`home.md` §3.8f) renders only after the Sale write has already succeeded (`architecture-principles.md` #2 ties the <3s bar specifically to the Sale-write path itself, not to anything shown afterward), and it's optional and entirely merchant-controlled — a merchant can decline to offer/present the QR at all during a busy stretch if maintaining checkout speed matters more than loyalty enrollment in that moment. Stage 2 therefore does not compete with backlog #1's critical path, structurally or in practice. **Stage 2 is no longer hard-gated behind backlog #1.** It remains a lower implementation-priority item than #1 (#1 stays the top MVP priority, per `company/CLAUDE.md`'s core thesis), but **UX design and specification work for Stage 2 (the actual QR/claim-flow screens, the customer registration flow, the merchant-facing Loyalty Participation view) may proceed immediately** — it is not blocked on #1's success bar clearing. Only the relative build/implementation sequencing stays deferred to #1, as a deliberate attention-discipline choice, not a technical constraint.
  - Backlog #1 itself remains unresolved (IN PROGRESS, unmet success bar) and stays the top MVP priority regardless of this correction.

## 3. Bazaar recommendation — NOT STARTED
- Blocked by: needs data from multiple vendors, not just Ana
- Do not attempt to build — no data source exists yet

## Later
- Apartado/reservation status — not started.
- Distributor/kg-based purchasing — not started.
- Frequent-customer pre-orders — not started.

## Product Discovery — unscoped, not prioritized, not designed

Raw findings worth preserving for a future design pass. Distinct from "Later" above: these aren't yet decided features, just real signal that needs its own product-discovery pass before any design work starts. Not part of any current build's scope unless explicitly pulled in by the Product Owner.

### Event-scoped inventory allocation (multi-seller concurrent selling)

- **Source: unsolicited real-merchant feedback (2026-09-03).** A prospective merchant contacted the Product Owner directly after trying Nahui — found it useful, but wants concurrent/parallel selling by multiple sellers at the same Event (e.g., 3 salespeople working one table simultaneously, each needing their own access).
- **Explicitly out of scope for the current pilot.** Not folded into the active Q19/Q20/Q21 value-first-onboarding work, and does not expand that pilot's scope. No design or implementation started.
- **The finding, beyond "let multiple people sell at once":** it exposes an inventory-allocation requirement more fundamental than concurrency alone. Inventory should be allocatable *to an Event*, not owned by whichever seller happens to be working it. Example given by the Product Owner: a merchant owns 30 units of a Product, takes 20 to Event A and 10 to Event B. Event A may have 3 sellers working simultaneously, but all 3 sell against the same shared pool of 20 units allocated to Event A — no seller has their own separate slice. Event B sells independently against its own, separately allocated 10 units.
- **Implication, not yet designed:** Event preparation/setup would eventually need to include not just event-specific pricing (already a concept) but selecting *which* Products and *how much* inventory are being taken to that Event.
- **Relationship to the existing, still-open "multiple people per Event" question:** related but not the same question. `product/99-rfc/0007-user-and-business-membership.md` (Accepted, `decision-log.md` D44) already introduced `BusinessMembership.role: OWNER | SELLER` at the identity layer — a SELLER role exists — but the *selling-session* mechanics for multiple people working one Event concurrently (multiple simultaneous active Sessions under one Event, how they'd share vs. partition inventory) were never designed. This new feedback doesn't resolve that gap; it adds a second, load-bearing requirement (Event-scoped inventory allocation) that any future design of concurrent selling needs to account for from the start, not bolt on afterward.
- **Deliberately preserved as open, not resolved — do not let a future pass silently pick one answer without revisiting these:**
  - What concurrency model, exactly, does "multiple sellers at one Event" require (shared live state, per-seller devices reading/writing one Event's pool, conflict handling)?
  - How does inventory allocation/reconciliation actually work — is "taking stock to an Event" a real write (a reservation/transfer) or a soft filter, and what enforces that a seller can't oversell an Event's allocated pool?
  - What happens to unsold Event stock afterward — does it return to general availability automatically, stay "at the Event" until explicitly returned, something else?
  - How this composes with the still-open concurrent-selling/multiple-people-per-Event question above — one coherent design, not two independently-solved halves.
- **Not yet classified** as Architect/Product/Business Decision — that classification, and any RFC-trigger evaluation, waits for an actual design pass, not this discovery entry.
