# Product Decisions

Standing log of open questions classified as **Product Decisions** under the Decision Ownership policy in `company/CLAUDE.md`: questions that change product behavior, user experience, capabilities, or feature scope, and require a Product Owner call — not something Architect can resolve by interpreting the existing `product/00-foundation/`, and not a pricing/commercialization/legal/operations matter.

This file was created by reclassifying entries that previously lived in `product/02-ux/architect-questions.md`, per the new Decision Ownership policy. **Content and status are unchanged from the original entries** — this is a governance move, not a reassessment. Each entry's original Architect finding is preserved verbatim below; it's still the reasoning behind why each item is open, even though the item itself is no longer an Architect Decision.

Entries are never deleted once resolved; mark them Resolved with the outcome instead, so the history of what was ambiguous and why stays intact (same non-deletion rule as `product/99-rfc/`). A resolved Product Decision that changes the domain model, ubiquitous language, or IA should still go through an RFC (`product/99-rfc/`) before `product/00-foundation/` is touched, per existing policy — this log is the queue feeding that process, not a replacement for it.

## Open

### Q1 — "Día N" counting: raw Session count, or distinct calendar dates?

- **Raised by:** `home.md` §8, during Home UX design.
- **Question:** If Ana closes a Session and opens a new one later the *same calendar day* under the same Event (e.g., a lunch-break resume), does "Día N" stay the same day number, or increment as a new Session?
- **Architect finding:** Genuinely unresolved by the Foundation. `ubiquitous-language.md` defines Session as "one working day," which is a naming intent, not an enforced invariant — the Session lifecycle (`not_started → active → closed → reviewed`) is one-directional and terminal at `closed`, so a same-day reopen is structurally a new Session instance, and nothing in `domain-model.md` or `decision-log.md` specifies whether same-day instances should collapse into one displayed "day" or count separately.
- **Architect's process recommendation:** This doesn't touch an aggregate boundary or contradict a frozen decision — it's an unspecified read-side computation rule. Can be closed later with an additive clarification to `domain-model.md`/`ubiquitous-language.md` (documenting exactly how "Día N" is computed), no RFC needed.
- **Referenced from:** `product/02-ux/home.md` §8, `product/02-ux/events.md` §8, `product/02-ux/reports.md` §8.
- **Status:** Open — needs a Product Decision on which counting rule to use.

### Q2 — Is an untagged InventoryUnit sellable when `registrationMode = nfc`?

- **Raised by:** ux-designer's Inventario draft §8, item 2, during Inventario UX design (Ana can defer tag assignment after registering a Lot via "Terminar después").
- **Question:** If a physical unit is `available` but has no NFCTag attached, and the Business's `registrationMode` is `nfc` (a scan-only selling surface with no product grid, per `home.md` §3.10), how is that unit ever sold? There's nothing to scan.
- **Architect finding:** Genuine gap, not resolved by the Foundation. The InventoryUnit lifecycle (`available → reserved → sold`) has no precondition tied to NFCTag presence — nothing blocks an untagged unit from being `available`. NFCTag's definition describes *when* tags exist, not a hard invariant that 100% of available inventory must be tagged before `nfc` mode can sell it. The dual-purpose tag-resolution mechanism (D10) only runs once a tag is scanned — it has no branch for "no tag to scan at all." D5's FIFO fallback is buttons-mode-only and doesn't generalize here. Net: the Foundation permits a data state (untagged + available) that the `nfc` selling surface has no path to sell.
- **Architect's process recommendation:** This needs a new decision, parallel to D5, choosing between (a) `nfc` mode excludes untagged units from `available`/sellable state entirely, or (b) a fallback manual-identification path is required even in `nfc` mode. Either resolves a real gap and belongs in `decision-log.md` once decided — this is a Product Decision, not something Architect or UX should resolve unilaterally.
- **Interim mitigation already in the Inventario UX spec (non-blocking):** Inventario surfaces an interrupted tagging queue as a persistent, discoverable "faltan etiquetas" card on the Catalog view (`inventory.md` §3.5), nudging the merchant to finish tagging before it becomes a point-of-sale problem. This doesn't resolve the gap, it just reduces how often it's hit.
- **Referenced from:** `product/02-ux/inventory.md` §8, item 2.
- **Status:** Open — needs a Product Decision spanning the Inventory and Selling bounded contexts.

### Q3 — Tie-break rule for two simultaneously active Events

- **Raised by:** ux-designer's Eventos draft §8, during Eventos UX design.
- **Question:** Home's resolution logic (`home.md` §2) assumes at most one Event is ever `active` at a time and offers a single "Continuar Día N" for it. Nothing in the Foundation prevents a Business from having two Events with overlapping date ranges both `active` simultaneously. If that happens, which one does Home's single CTA mean?
- **Architect finding:** Genuine gap. `domain-model.md`'s Event lifecycle (`scheduled → active → closed`, or `cancelled`) is a per-Event state machine only — no uniqueness constraint anywhere limits how many Events on a Business can be `active` concurrently. D6 and D8 don't touch Event-to-Event concurrency (only Session-to-Event optionality and the read-side "Event as a whole" query). Event being a deliberately "light root" (so Sessions can reference it loosely, no parent-child lock) makes overlapping active Events structurally easy to end up with, but nothing rules on how the UI should resolve it. One real constraint on any fix: per architecture-principles #1 and D5's automation stance, whatever tie-break gets chosen must be fully automatic — Home can never ask Ana "which event did you mean."
- **Architect's process recommendation:** Needs a new decision, parallel to D5 (e.g., earliest-start-date-wins, most-recently-created-wins, or some other automatic rule) — a Product Decision on UX/resolution behavior, not something to resolve via the UX draft.
- **Referenced from:** `product/02-ux/events.md` §8, `product/02-ux/home.md` (Home's single-active-Event assumption in §2), `product/02-ux/reports.md` §8.
- **Status:** Open — needs a Product Decision on the tie-break rule.

### Q6 — Is the Event `type` field a closed enum or an open, extensible list?

- **Raised by:** `reviewer`'s audit of `events.md` §3.7/§10, during Eventos UX review.
- **Question:** `ubiquitous-language.md` describes Event type with a trailing ellipsis ("Bazaar, Expo, Pop-up, Festival, Market, Office Sale, ...") — is that list illustrative/open (like Product names, which merchants can add to), or a fixed, closed set of exactly six? The ux-designer's original draft asserted it was closed without Foundation backing; corrected to an open question pending Architect input.
- **Architect finding:** Genuinely unresolved. `ubiquitous-language.md`'s trailing ellipsis is the only place `type` is mentioned at all — `domain-model.md` doesn't model `type` as a field, and D8 only justifies the Bazaar→Event rename for future generality, without saying who extends the list or when. Both "closed, product-controlled, grows via updates" and "open, merchant-typed like Product names" are equally consistent with D8 — inventing either would be inventing product scope, not applying the Foundation.
- **Referenced from:** `product/02-ux/events.md` §3.7, §8, §10.
- **Status:** Open — a Product Decision on feature scope.

### Q9 — Is "venue/bazaar" its own identity, distinct from an Event's freeform Nombre?

- **Raised by:** ux-designer's Resultados draft §8, item 2.
- **Question:** "Rendimiento por bazar" (`reports.md` §3.9) can only group by exact string match on `Nombre`, since there's no Venue/Location entity in `domain-model.md` and `Lugar` (`events.md` §3.6) is optional freeform text, not an identifier. A typo or renaming across visits would silently fragment one venue into multiple rows.
- **Architect finding:** Genuine gap, not a contradiction of any frozen decision — there's simply no Venue/Location entity to protect. `Lugar` (`events.md` §3.6) is optional freeform text, not an identifier; nothing in `domain-model.md`/`decision-log.md` addresses venue identity at all. Unlike Q8, adding a lightweight Venue entity (optionally referenced by Event) is additive — it wouldn't strain any existing aggregate boundary or redefine a term. Since it does introduce a new identity plus dedup/matching logic for typo'd names, Architect leans toward a lightweight RFC rather than a silent doc edit, but treats it as non-blocking either way.
- **Referenced from:** `product/02-ux/reports.md` §3.9, §8 item 2.
- **Status:** Open — non-blocking; the doc proceeds with exact-name-match as a stated, honest approximation. Candidate for a lightweight future RFC in `product/99-rfc/`.

### Q10 — What sets Session.status = `reviewed`, and by whom?

- **Raised by:** ux-designer's Resultados draft §8, item 3.
- **Question:** `domain-model.md`'s own Session lifecycle includes `closed → reviewed`, and Resultados (Journey 5, "Review") is the obvious place this would matter (e.g., an "unread" marker). But Resultados maps to the read-only Intelligence context (`domain-model.md` bounded-context table; `architecture-principles.md` #6, one-way dependency) — it cannot be the thing that writes this status without breaking a frozen rule. Nothing else in the Foundation sets this state either.
- **Architect finding:** Genuine, currently-inert domain state with no documented setter — confirmed, nothing elsewhere in the Foundation resolves it. The ux-designer's withdrawal of an auto-marking mechanic was correct: Intelligence is read-only over Selling (`architecture-principles.md` #6), so Resultados can never flip `Session.status` directly. The only architecturally consistent path would be a write originating from Selling's own command surface (e.g., a UI action in Resultados invoking a Selling-owned "mark reviewed" operation, not Intelligence writing directly) — but the Foundation doesn't specify this mechanism, its trigger, or whether it's even wanted. Needs a Product Decision (what triggers "reviewed," does it matter to Ana at all) before it's worth designing — the dependency-direction rule is already respected by simply not building it yet.
- **Referenced from:** `product/02-ux/reports.md` §3.7 (implicitly, by not designing a reviewed-marking mechanic), §8 item 3.
- **Status:** Open — non-blocking; no reviewed-marking mechanic was designed, avoiding an invented write path.

## Resolved

_(none yet)_
