# Information Architecture — FROZEN (v1, merchant application only)

Scope: this file covers the merchant-facing application only. The loyalty-claim module is intentionally **not** part of this IA — see the note at the end.

## Navigation (top-level)

Structured around the merchant's workflow language (`vision.md`), not around entities:

```
Hoy (Home)     — contextual, no fixed content: "Continuar Día 2" or "Iniciar Sesión Rápida"
Inventario     — Catalog, Register Lot, Assign Tags (only if registrationMode = nfc)
Eventos        — scheduled/active/past Events, drills into their Sessions
Resultados     — Session/Event summaries; deeper analytics only if subscriptionTier = paid
```

Deliberately **no persistent "Ventas" tab.** Selling is not a place you navigate to, it's a state Home resolves into. If there's an open Session, Home *is* the sale screen. This follows directly from the product principle "the fastest interaction is the one that never happens" — applied to navigation itself, not just to selling mechanics.

Capability gating (see `domain-model.md#business-capabilities` for the source of truth on these):

- `registrationMode = buttons` → no "Assign Tags" step anywhere in Inventario.
- `subscriptionTier = free` → Resultados shows counts/totals only, no segmentation.

## User journeys

1. **Inventory prep** — Home → Inventario → Registrar Lote (supplier, date, line items: Product + qty + cost) → system auto-generates InventoryUnits → if `nfc`: Asignar Tags per unit → done, no separate confirm step.
2. **Event scheduling** (optional, never blocking) — Home → Eventos → Nuevo Evento (name, type, dates) → appears on Home automatically once its date arrives.
3. **Selling** (core path) — Home resolves current state automatically:
   - open Session exists → continue it
   - Event active, no Session opened today → "Continuar Día N"
   - nothing scheduled → "Iniciar Sesión Rápida"
   One tap into selling in every case. Add items (mode-appropriate, mode never shown or asked) → Finalizar Venta → loop → Cerrar Sesión → immediate session summary.
4. **Event close** — last Session of an Event closes → Event-level rollup, aggregated across its Sessions.
5. **Review** — Home/Resultados → past Sessions/Events → free tier: counts and totals; paid tier: segmentation once real history exists (`company/backlog.md` #2 — blocked until this history exists, do not build early).

## Explicitly out of scope: loyalty-claim

The customer-side flow (scan a sold tag → identify yourself → claim the purchase) is **not** part of this IA and has **no entry point anywhere in the merchant app**. It's a separate, customer-facing surface (a lightweight web page the tag resolves to, later possibly an app) built on top of the same domain model, in its own future module. See `domain-model.md#bounded-contexts` and `decision-log.md` D10 for the reasoning — the short version is that the person scanning the tag post-sale is the *customer*, on their own phone, not Ana.
