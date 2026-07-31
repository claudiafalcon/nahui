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

Deliberately **no persistent "Ventas" tab.** Selling is not a place you navigate to, it's a state Home resolves into. If there's an open Session, selling becomes Home's default entry point — the merchant can still navigate to Inventario, Eventos, or Resultados at any time; the application simply always resumes where selling happens. This follows directly from the product principle "selling is a state, not a navigation destination" — see `global-principles.md` — applied here to navigation structure itself, not just to selling mechanics.

Capability gating (see `domain-model.md#business-capabilities` for the source of truth on these):

- `registrationMode = buttons` → no "Assign Tags" step anywhere in Inventario.
- `subscriptionTier = free` → Resultados shows counts/totals only, no segmentation.

## Onboarding and Settings

Onboarding and Settings are not absent from Nahui — they're absent from this section because neither is a fifth tab alongside Hoy/Inventario/Eventos/Resultados:

- **Onboarding**: a first-run flow precedes all four tabs. A Business and its initial capabilities (`registrationMode`, at minimum) must exist before Home's resolution logic (`home.md` §2) has anything to resolve. This is a sequencing fact, not a navigation destination — it is never reachable again once complete, and is not a place the merchant "goes."
- **Settings**: reachable from the existing session-controls affordance already specified in `home.md` §3.7 (the header's "▾"), not a dedicated tab. This keeps capability management consistent with "selling is a state, not a navigation destination" — settings hang off an existing surface rather than adding a fifth persistent destination.

What this section does not resolve (open, logged in `company/business-decisions.md` as Q4 and Q5): who/what sets `registrationMode` on first run, and whether any Business Capability is ever merchant-self-service-editable after onboarding versus fixed by a backend/support process. Both are Business Decisions per the Decision Ownership policy in `company/CLAUDE.md`, not navigational ones.

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

The customer-side flow (scan a sold tag → identify yourself → claim the purchase) is **not** part of this IA and has **no entry point anywhere in the merchant app**. It's a separate, customer-facing surface (a lightweight web page the tag resolves to, later possibly an app) built on top of the same domain model, in its own future module. See `domain-model.md#bounded-contexts` and `decision-log.md` D10 for the reasoning — the short version is that the person scanning the tag post-sale is the *customer*, on their own phone, not Ana.
