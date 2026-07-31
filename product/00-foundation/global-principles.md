# Global Principles

Canonical source for cross-cutting rules that apply to every agent, every time, and aren't part of the domain model itself (`domain-model.md`) or narrowly technical architecture rules (`architecture-principles.md`). Language, UX philosophy, and how agents collaborate live here, once. If you're about to restate one of these rules in a new file, agent, or answer — link here instead of copying the text.

## Product Language

- Merchant-facing experience (anything Ana sees or reads) is written in natural Mexican Spanish. Never translate the UI into English, for any reason.
- Architecture, documentation, code, comments, and all developer/agent-facing artifacts are written in English.
- Avoid literal, word-for-word translations from English when writing Spanish copy — write how a Mexican bazaar vendor actually talks, not a translated English sentence.
- Always use the merchant's own mental model and vocabulary, not engineering vocabulary. `ubiquitous-language.md` defines terms like InventoryUnit and SaleItem for internal/agent use — Ana would never hear or say either one. She thinks "llegó la mercancía," not "se creó un InventoryUnit."

## UX Principles

- **The fastest interaction is the one that never happens.** Before adding a step, ask whether it needs to exist at all.
- **Never ask twice.** If the system already knows something — a capability, a prior choice, an already-scanned tag — it must never ask again.
- **Technology should disappear.** The merchant should never think about software; the software should think about the merchant.
- **Selling is a state, not a navigation destination.** There is no persistent "Ventas" tab — see `information-architecture.md` for where this is actually implemented (Home resolves directly into the active Session).
- **Business language always comes before technical language.** Technology is an implementation detail; the business is the product.
- **The merchant experiences Products. The platform preserves Inventory traceability.** She sees "Hoodie (4 available)"; the platform still knows exactly which Lot each unit came from.
- **Every repeated decision should become automation** — e.g. FIFO allocation in Buttons mode (`domain-model.md`), never a question to the merchant.
- **Capture business truth once. Reuse it forever.**
- **Collect data today. Create intelligence tomorrow.**
- **The best interface is the one that stays out of the merchant's way.**

## AI Collaboration Principles

- Every agent consults the relevant `product/00-foundation/` documents before making a recommendation — treat these docs as ground truth over memory of a past conversation.
- Standard pipeline: **Architect → Planner → UX Designer → Builder → Reviewer.** Each agent's own file (`.claude/agents/`) defines its exact remit and how it hands off to the next.
- The **Architect** protects the foundation — new ideas are checked against it before Planner sequences them or Builder implements them.
- The **Reviewer** verifies consistency with the foundation on the way out — the last check before any work is considered done.
- New ideas that would change the domain model, the ubiquitous language, or the information architecture start as an RFC (`product/99-rfc/`) before the foundation itself is touched — see `99-rfc/README.md` for the mechanics of that workflow.
