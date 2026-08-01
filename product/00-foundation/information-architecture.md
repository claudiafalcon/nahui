# Information Architecture — FROZEN (v1, merchant application only)

Scope: this file covers the merchant-facing application only. The loyalty-claim module is intentionally **not** part of this IA — see the note at the end.

## Navigation (top-level)

Structured around the merchant's workflow language (`vision.md`), not around entities:

```
Hoy (Home)     — contextual, no fixed content: "Continuar Día 2" or "Iniciar Sesión Rápida"
Inventario     — Catalog, Register Lot, Assign Tags (only if nfc ∈ registrationMode)
Eventos        — scheduled/active/past Events, drills into their Sessions
Resultados     — Session/Event summaries; deeper analytics only if subscriptionTier = paid
```

Deliberately **no persistent "Ventas" tab.** Selling is not a place you navigate to, it's a state Home resolves into. If there's an open Session, selling becomes Home's default entry point — the merchant can still navigate to Inventario, Eventos, or Resultados at any time; the application simply always resumes where selling happens. This follows directly from the product principle "selling is a state, not a navigation destination" — see `global-principles.md` — applied here to navigation structure itself, not just to selling mechanics.

Capability gating (see `domain-model.md#business-capabilities` for the source of truth on these):

- `nfc ∉ registrationMode` (NFC not in the Business's capability set) → no "Assign Tags" step anywhere in Inventario. Gated by capability availability, not by any single Session's resolved operating mode (`decision-log.md` D23).
- `subscriptionTier = free` → Resultados shows counts/totals only, no segmentation.

## Onboarding and Settings

Onboarding and Settings are not absent from Nahui — they're absent from this section because neither is a fifth tab alongside Hoy/Inventario/Eventos/Resultados:

- **Onboarding**: a first-run flow precedes all four tabs. A Business and its initial capabilities (`registrationMode`, at minimum) must exist before Home's resolution logic (`home.md` §2) has anything to resolve. This is a sequencing fact, not a navigation destination — it is never reachable again once complete, and is not a place the merchant "goes."
- **Settings**: reachable from the existing session-controls affordance already specified in `home.md` §3.7 (the header's "▾"), not a dedicated tab. This keeps capability management consistent with "selling is a state, not a navigation destination" — settings hang off an existing surface rather than adding a fifth persistent destination.

Q4 (who/what sets `registrationMode` on first run) and Q5 (whether any Business Capability is ever merchant-self-service-editable after onboarding) — both Business Decisions per the Decision Ownership policy in `company/CLAUDE.md`, not navigational ones — are now both Resolved (`decision-log.md` D19, D25; `company/business-decisions.md`). Settings' merchant-facing scope is unblocked; the one remaining open item (Q11, the specific per-transition timing rule for deferred capability changes) is narrower and doesn't block `settings.md`'s design.

## User journeys

1. **Inventory prep** — Home → Inventario → Registrar Lote (line items: Product + qty) → system auto-generates InventoryUnits → if `nfc`: Asignar Tags per unit → done, no separate confirm step. (Supplier and cost exist in the schema per `domain-model.md`'s deliberate exceptions but are never asked here — see `architecture-principles.md` #5 and `decision-log.md` D9.)
2. **Event scheduling** (optional, never blocking) — Home → Eventos → Nuevo Evento (name, type, dates) → appears on Home automatically once its date arrives.
3. **Selling** (core path) — Home resolves current state automatically:
   - open Session exists → continue it
   - Event active, no Session opened today → "Continuar Día N"
   - nothing scheduled → "Iniciar Sesión Rápida"
   One tap into selling in every case. Add items (mode-appropriate, mode never shown or asked) → Finalizar Venta → loop → Cerrar Sesión → immediate session summary.
4. **Event close** — last Session of an Event closes → Event-level rollup, aggregated across its Sessions.
5. **Review** — Home/Resultados → past Sessions/Events → free tier: counts and totals; paid tier: segmentation (`company/backlog.md` #2 — part of current MVP UX scope; the earlier "blocked until real history exists" gate predates the Product Foundation and no longer applies, see `company/lessons.md` 2026-07-31).

## Explicitly out of scope: loyalty-claim

The customer-side flow (identify yourself → claim the purchase) is **not** part of this IA. The precise rule, corrected from an earlier, misleading formulation ("no entry point anywhere in the merchant app" — see `decision-log.md` D21):

- The Merchant Application never participates in customer identification or the Loyalty flow.
- Customer Identity is owned exclusively by the Loyalty platform.
- The Merchant Application may display artifacts (such as an NFC tag, QR code, receipt, or future claim mechanism) that allow the customer to start the Loyalty experience on their own device.
- The Loyalty experience always runs independently from the Merchant Application.

In other words: the merchant app may show something the customer uses to *start* the Loyalty flow (a tag she taps, a QR she scans, a receipt she keeps), but never performs identification itself, never displays Loyalty-claim content, and never runs any part of the Loyalty experience — that experience is a separate, customer-facing surface (initially a lightweight web/app destination the artifact resolves to) built on top of the same domain model, in its own future module. See `domain-model.md#bounded-contexts` and `decision-log.md` D10/D21 for the reasoning — the short version is that identification and claiming are things the *customer* does, on their own device, never Ana or her app.
