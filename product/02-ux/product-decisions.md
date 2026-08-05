# Product Decisions

Standing log of open questions classified as **Product Decisions** under the Decision Ownership policy in `company/CLAUDE.md`: questions that change product behavior, user experience, capabilities, or feature scope, and require a Product Owner call — not something Architect can resolve by interpreting the existing `product/00-foundation/`, and not a pricing/commercialization/legal/operations matter.

This file was created by reclassifying entries that previously lived in `product/02-ux/architect-questions.md`, per the new Decision Ownership policy. **Content and status are unchanged from the original entries** — this is a governance move, not a reassessment. Each entry's original Architect finding is preserved verbatim below; it's still the reasoning behind why each item is open, even though the item itself is no longer an Architect Decision.

Entries are never deleted once resolved; mark them Resolved with the outcome instead, so the history of what was ambiguous and why stays intact (same non-deletion rule as `product/99-rfc/`). A resolved Product Decision that changes the domain model, ubiquitous language, or IA should still go through an RFC (`product/99-rfc/`) before `product/00-foundation/` is touched, per existing policy — this log is the queue feeding that process, not a replacement for it.

## Open

### Q13 — Should "NFC adoption rate" (% of Sales sold via `nfc` vs. `buttons`) be free-tier or paid-tier?

- **Question:** The Product Owner's 2026-08-04 Medium-Fidelity comprehension pass asked whether Resultados gives merchants enough insight, naming NFC adoption rate as one candidate metric. Unlike the other four metrics raised in the same request (sales trends, top products, ticket average, event performance — all either already Approved in `reports.md` or a direct variant of an already-Approved section), NFC adoption rate has zero precedent anywhere in the current `reports.md` — it isn't mentioned in any of its 14 screen states, so there's no existing tier placement to inherit.
- **Architect finding:** Fully computable now from data that already exists — `Session.operatingMode` (`buttons | nfc`) is a real, stored, per-Session field, resolved once at Session-open (D23) and immutable while `active`. Sale references `sessionId`, so "% of Sales via NFC" = `count(Sales where session.operatingMode = nfc) / count(all Sales)`, a plain join over two already-stored fields — no new field, no new tracking mechanism, no RFC. D25's "never delete historical data" invariant means the metric stays meaningful even after a `subscriptionTier` downgrade (historical `operatingMode` values are untouched; only future Sessions lose `nfc` eligibility). This is purely a **tier-placement** question, the same shape `reports.md` §8 item 7 already flagged and left as "this doc's inference, not an explicit instruction" for "Rendimiento por bazar." Applying `reports.md` §10's own established test (per-Product/aggregate "counts" = free-tier eligible, per the current Approved precedent; venue/customer "segmentation" = paid-tier): NFC adoption rate is arithmetic over Sale counts, the same shape as the free-tier-eligible metrics, but it's also arguably a signal about a *paid capability's* usage (NFC selling itself requires `subscriptionTier=paid`, D27) — a plausible argument either way, not resolved by the existing precedent alone.
- **Not yet resolved:** whether this belongs in the free "counts" tier (consistent with sales trends/top products/ticket average) or the paid tier (since it measures usage of a paid-only capability). Needs a Product Owner call before `ux-designer` commits it to a specific section/gate in `reports.md`.
- **Status:** Open.

## Resolved

### Q9 — Is "venue/bazaar" its own identity, distinct from an Event's freeform Nombre?

- **Question:** "Rendimiento por bazar" (`reports.md` §3.9) could only group by exact string match on `Nombre`, since there was no Venue/Location entity in `domain-model.md`. A typo or renaming across visits could silently fragment one venue into multiple rows.
- **Resolution (Product Owner):** Introduce a lightweight Venue entity now, rather than deferring. Shape: `id`, `businessId`, `displayName`, optional address/notes, `active` status. Event references a Venue instead of relying on freeform exact-name matching. When creating an Event, the merchant selects an existing Venue or creates a new one with minimal friction. Explicitly not a full location-management module.
- **Architect finding:** Venue is a new aggregate root (same independent-identity pattern as Product, D2), owned by Selling (its only consumer is Event — mirrors the existing Supplier/Lot precedent, avoids an unforced new Selling→Inventory dependency). Venue.displayName replaces Event's freeform `Nombre` entirely; Venue's optional address/notes replaces Event's freeform `Lugar` entirely — both retired, not kept alongside Venue. `Event.venueId` is a required reference (not nullable), resolved via an inline create-or-select picker mirroring Inventario's Product picker. Because this is the first new aggregate root since Domain Model v1 froze, and it retires fields in two already-Approved UX specs, Architect routed it through a formal RFC rather than a bare decision-log entry.
- **Applied:** `product/99-rfc/0001-venue-entity.md` (Accepted); `domain-model.md` (new aggregate root, entity-relationships diagram, Selling bounded-context row), `ubiquitous-language.md` (new Venue term, Event definition updated), `decision-log.md` D20.
- **Applied (UX):** `events.md` §3.6 "Nuevo Evento" now has `Nombre` replaced by a required Venue picker (§3.7, create-or-select, mirroring Inventario's Product picker) and `Lugar` removed; every screen that rendered `Event.Nombre` now renders `Venue.displayName`. `reports.md` §3.9/§3.11 "Rendimiento por bazar" now groups by `venueId` instead of exact-name match. Both went through their own full design pass (`ux-designer` → `ux-critic` → `reviewer`, zero Blockers/Majors) — see `product/02-ux/ux-critic-findings.md`'s "Venue aggregate root cycle" entry.
- **Status:** Resolved — Foundation and UX both fully applied.

### Q10 — What sets Session.status = `reviewed`, and by whom?

- **Question:** `domain-model.md`'s own Session lifecycle includes `closed → reviewed`, and Resultados (Journey 5, "Review") is the obvious place this would matter. But Resultados/Intelligence is read-only over Selling (`architecture-principles.md` #6) — it cannot be the thing that writes this status without breaking a frozen rule.
- **Resolution (Product Owner):** Leave `reviewed` dormant. No merchant-facing "mark as reviewed" action designed. Documented as reserved for a possible future reporting/reconciliation workflow — not exposed in any UX until there's a real merchant need and a defined, Selling-owned trigger.
- **Applied:** `domain-model.md`'s Lifecycles section now carries this note directly; `decision-log.md` D18 records the decision. No UX spec change needed — `reports.md` already correctly avoided designing a write path here.
- **Status:** Resolved.

### Q2 — Is an untagged InventoryUnit sellable when `registrationMode = nfc`?

- **Question:** If a merchant defers tagging and a customer wants to buy that untagged unit while in `nfc` mode (a scan-only surface, no product grid), there's nothing to scan.
- **Resolution (Product Owner):** Untagged units are never sellable in `nfc` mode — no data-model exception, no mid-session mode switch, and explicitly no manual-fallback picker embedded in the NFC surface (which would functionally recreate Buttons mode inside an NFC session). Instead, the merchant is guided to tag the unit immediately when the situation arises.
- **Architect finding:** Adopted as proposed — this is the principle-preserving option (equivalent to the Architect's original option (a)), and correctly avoids reintroducing a second selling surface (`architecture-principles.md` #1, `vision.md`'s mode-switching prohibition). The redirect from Selling into Inventario's Asignar Tags flow is a sanctioned UI hand-off pattern already used elsewhere (`events.md`'s "Ver resumen en Resultados," `home.md`'s upcoming-Event card) — not a new architectural exception.
- **Two items remain, deliberately not resolved here:**
  1. **UX design gap (not a decision, a design task):** Home's `nfc` selling surface (`home.md` §3.10) has no product grid or picker at all — there's currently no affordance through which "attempting to sell an untagged unit" could surface as a discrete event. Whoever designs this must not let the redirect resolve into an enumerable, selectable product list (that would recreate the rejected fallback picker). Flagged for `ux-designer`.
  2. **"Emergency Sale" is explicitly deferred as a future RFC**, not decided now. It requires reopening `decision-log.md` D10: if an emergency-sold unit is tagged *after* the sale, that tag's first-ever scan would be misread as a customer loyalty claim under D10's current status-based disambiguation (`sold` = claim scan), not as the deferred sale confirmation. Any future RFC for Emergency Sale must resolve this collision explicitly, not just the Session-close-gating and traceability points already named.
- **Status:** Resolved (principle) — two follow-ups tracked above, not open questions requiring further Product Owner input.

### Q3 — Tie-break rule for two simultaneously active Events

- **Question:** Home's resolution logic assumes at most one Event is ever `active` at a time. Nothing in the Foundation prevented a Business from having two Events with overlapping date ranges both active simultaneously.
- **Resolution (Product Owner):** Rather than add tie-break logic, remove the ambiguous state entirely — a Business may not create or activate an Event whose date range overlaps an already-scheduled-or-active Event. A deliberate MVP simplification; concurrent Events belong to a future multi-employee capability, not built now.
- **Architect finding:** Additive, no RFC needed — a same-context, same-entity uniqueness validation, not a cross-bounded-context concern. Fully eliminates the need for any tie-break logic in `home.md` by construction; no change to `home.md` required. `events.md`'s "Nuevo Evento" flow will need a new blocked-save/validation error state for the overlap check (a UX design task, not resolved here). Flagged one framing nuance: the "future multi-employee capability" this is deferred to is an *intra-tenant* multi-user problem (multiple sellers under one Business), structurally different from backlog #3's *cross-tenant* bazaar-recommendation feature — coherent as a scoping choice, but not blocked on a data source the same way backlog #3 is; it could be built whenever prioritized.
- **Applied:** `domain-model.md`'s Event description now states this invariant; `decision-log.md` D17 records the decision and reasoning.
- **Status:** Resolved.

### Q1 — "Día N" counting: raw Session count, or distinct calendar dates?

- **Question:** If Ana closes a Session and opens a new one later the *same calendar day* under the same Event (e.g., a lunch-break resume), does "Día N" stay the same day number, or increment as a new Session?
- **Resolution (Product Owner):** Distinct calendar dates — a same-day reopen never increments "Día N." Matches Session's own naming intent ("one working day of selling") literally.
- **Applied:** `domain-model.md` "Key mechanisms" now states this computation rule canonically; `decision-log.md` D15 records the decision and reasoning. No UX spec changes needed — `home.md`, `events.md`, `reports.md` already reuse one shared "Día N" computation rather than deriving it per-screen, so this closes the ambiguity everywhere at once.
- **Status:** Resolved.

### Q6 — Is the Event `type` field a closed enum or an open, extensible list?

- **Question:** Is the six-item Event type list (Bazar, Expo, Pop-up, Festival, Market/Tianguis, Venta de oficina) closed, or merchant-extensible like Product names?
- **Resolution (Product Owner):** Closed list for the current phase. Simpler to build/validate; nothing in the domain model currently branches on Event type in a way that needs openness. Can grow via a future product update if real usage calls for it — not a permanent constraint.
- **Applied:** `ubiquitous-language.md`'s Event definition now states the list is closed, not illustrative; `decision-log.md` D16 records the decision. `events.md` §3.7's picker already showed no "add new type" affordance, so no UX spec change was required.
- **Status:** Resolved.
