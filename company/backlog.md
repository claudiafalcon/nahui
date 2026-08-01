# Backlog (priority order)

## 1. Sale registration — IN PROGRESS
- Prototype exists: /product/01-validation/registro.html (button-based, simulates tap)
- Next: test with Ana or simulate realistic bazaar conditions (see /evidence)
- Success bar: >=90% of sales registered, <3 sec per registration

## 2. Customer segmentation / Reports — IN PROGRESS (UX)
- Previously gated behind real sales history from #1 ("do not start until #1 has real usage data"). That gate predates the Product Foundation and the `product/02-ux/` restructuring and no longer applies — see `company/lessons.md` 2026-07-31.
- Reports (Resultados) is part of current MVP UX scope, documented alongside Home/Inventario/Eventos in `product/02-ux/`.
- **Customer Segmentation capability resolved** (`company/business-decisions.md` Q8, `decision-log.md` D22, `product/99-rfc/0002-loyalty-claim-complete-capability.md`): a core capability, not NFC-specific — Claim resolves via NFC tag scan or a Sale-level QR Claim Token, Merchant App consumes only Derived Customer Intelligence. The Foundation describes the **complete** target design; implementation is staged, tracked here, separately from that vision:
  - **Stage 1** — NFC-mechanism Claim resolution (already-specified, D10/D4) + the Intelligence→Loyalty-claim read edge exposing Derived Customer Intelligence. Ships first; works for NFC-mode merchants; doesn't require the Sale-QR mechanism.
  - **Stage 2** — the Sale-level Claim Token/QR mechanism, extending the same segmentation signal to Buttons-mode merchants. Requires its own new merchant-facing screen at Sale finalization — evaluate against backlog #1's own success bar (below) before adding, since it touches the same critical path.
  - Neither stage starts before backlog #1 clears its stated success bar — a new post-sale screen competing with unresolved registration-speed validation is exactly the risk #1's bar exists to guard against.
  - `reports.md`'s "Tus clientes" (§3.10/§3.12) stays an illustrative placeholder until Stage 1 is built; turning it into a real spec is its own tracked UX task, not started.

## 3. Bazaar recommendation — NOT STARTED
- Blocked by: needs data from multiple vendors, not just Ana
- Do not attempt to build — no data source exists yet

## Later
- Apartado/reservation status — not started.
- Distributor/kg-based purchasing — not started.
- Frequent-customer pre-orders — not started.
