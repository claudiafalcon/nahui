# Architecture Principles

Technical rules that constrain implementation — how aggregates, capabilities, and dependencies are structured. Binding on future engineering decisions, not just aspirational.

For product-wide language, UX, and AI-collaboration principles (not specific to technical architecture), see `global-principles.md` instead — don't duplicate those here.

## Architecture principles (technical)

1. **Capabilities are resolved once, upstream, never asked mid-flow.** `registrationMode` is a Business capability, read at Session start. It is never a screen-level choice, never re-asked per Sale. Any new configuration surface should default to this pattern: decide once, at the highest level that makes sense, and let everything downstream inherit it.
2. **Aggregate boundaries follow write-throughput needs, not just conceptual nesting.** Sale is its own aggregate root instead of living inside Session specifically because the <3s registration speed bar (`company/backlog.md` #1) means Sale writes can't contend on a shared Session lock.
3. **Optional relationships stay optional in the data model, not just in the UI.** Session works with zero Event because selling must never require scheduling first — this is modeled as a nullable `eventId`, not a UI shortcut bolted onto a required relationship.
4. **Internal-only entities never leak into user-facing language.** InventoryEntry and the individual InventoryUnit records are real, necessary parts of the model, and the merchant never sees either — she sees "3 Hoodies arrived" and "Hoodie (4 available)." If a concept needs its own screen or menu entry to explain, it's not internal-only anymore — reconsider it.
5. **Schema stability can be deliberately over-modeled, exactly once, and only when named.** Supplier and purchase cost are the one sanctioned exception to building only what's validated — done to avoid a future migration for margin/Open Finance work. Any future case like this should be called out explicitly in `decision-log.md`, not quietly smuggled in.
6. **Dependency direction is one-way and enforced by context, not convention.** Selling reads Inventory and Identity; nothing reads Selling; Intelligence and Loyalty-claim read everything and nothing reads them. New features should extend this graph, not add a back-edge.
