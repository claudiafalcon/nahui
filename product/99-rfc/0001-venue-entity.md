# 0001 — Venue as a lightweight aggregate root, referenced by Event

Status: Accepted

## The idea
Introduce a new, minimal Venue aggregate root: `id`, `businessId`, `displayName`, optional address/notes, `active` status. Event references a Venue by ID (required, not nullable) instead of relying on a freeform `Nombre` string for identity and grouping. Venue is not a location-management module — no map/geocoding, no dedicated management UI beyond an inline create-or-select picker at Event-creation time.

## What it touches
- `domain-model.md`: new aggregate root (Venue), entity-relationships diagram, Selling bounded-context row ("Owns" gains Venue).
- `ubiquitous-language.md`: new Selling-context term (Venue).
- `events.md`: §3.6 "Nuevo Evento" — Nombre field replaced by a required Venue picker (§3.7, create-or-select, same pattern as Inventario's Product picker); Lugar field removed. Every screen displaying Event.Nombre now displays Venue.displayName in the same slot. **Applied** — full design pass complete (`ux-designer` → `ux-critic` → `reviewer`), Approved.
- `reports.md`: §3.9/§3.11 "Rendimiento por bazar" groups by `venueId` instead of exact-string match on `Nombre` — the direct fix for the fragmentation risk raised in Q9. **Applied** — full design pass complete (`ux-designer` → `ux-critic` → `reviewer`), Approved.

## Why
Raised as Q9 (`product/02-ux/product-decisions.md`): `reports.md`'s "Rendimiento por bazar" could only group by exact-name match on Event's freeform `Nombre`, risking silent fragmentation (a typo or rename splits one real venue into multiple report rows). No Venue/Location identity existed in the frozen domain model to prevent this.

Venue follows the same independent-identity pattern as Product (D2): independent id, referenced by ID (never embedded), many Events may share one Venue, and Venue's `active` lifecycle is independent of any single referencing Event. Owned by Selling (not Inventory) because its only consumer is Event — mirrors the existing Supplier/Lot ownership precedent in the bounded-context table, and avoids introducing an unnecessary Selling→Inventory dependency edge for a concept with no relationship to merchandise.

Event's former freeform Nombre is retired — Venue.displayName is now the sole identity label; repeat visits to the same Venue are already distinguished by date range in every existing wireframe, so no information is lost. Event's optional Lugar is also retired — Venue's own optional address/notes is the single durable location record, avoiding a second, per-Event string that could drift from the Venue it describes (the same class of problem this RFC exists to fix).

This is the first new aggregate root added since Domain Model v1 froze, and it retires fields in two already-Approved UX specs — routed through this RFC rather than a direct decision-log entry, per the standing rule that new aggregate roots (even fully-specified ones) get the review trail an RFC preserves.

## Decision trail
Product Owner decided to introduce Venue now (not defer), with the exact schema above, while closing Q9. Architect formalized the aggregate classification, bounded-context ownership, and the Nombre/Lugar disposition (§1–3 of the evaluation), and made the call that this specific change — despite being fully specified — should route through this RFC rather than a bare decision-log entry, given it's a new aggregate root retiring fields in Approved docs. Proposed and Accepted in the same session, since the substantive decision was already made and the architectural analysis found no issues requiring further discussion. Promoted to `decision-log.md` D20.
