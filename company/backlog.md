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
