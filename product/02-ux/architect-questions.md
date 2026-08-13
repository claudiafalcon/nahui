# Architect Questions

Standing log of domain ambiguities surfaced during UX documentation that the frozen `product/00-foundation/` doesn't resolve. Per the architect-escalation protocol in `company/CLAUDE.md`: Main consults `architect` first; anything Architect can resolve from the existing Foundation gets applied directly to the relevant doc and never appears here.

**Since the Decision Ownership policy was added to `company/CLAUDE.md`, this file holds only questions classified as Architect Decisions** — resolvable by interpreting the existing Product Foundation, Information Architecture, domain model, or established architectural principles. Questions requiring a Product Owner call now live in one of two sibling logs instead:

- **`product/02-ux/product-decisions.md`** — changes to product behavior, UX, capabilities, or feature scope.
- **`company/business-decisions.md`** — pricing, commercialization, legal, compliance, operations, or strategic business choices.

Nine questions previously logged here (Q1–Q6, Q8–Q10) were reclassified and moved to those two files per this policy — their content and status are unchanged, only their location and governance category. Q7 is the only entry that was a pure Architect Decision (resolved by interpreting the frozen Foundation, no Product Owner input needed), so it's the only one that stays.

Entries are never deleted once resolved; mark them Resolved with the outcome instead, so the history of what was ambiguous and why stays intact (same non-deletion rule as `product/99-rfc/`).

## Open

### Q17 — What is the User/Owner/Seller domain model (and Business↔User relationship) needed to implement `authentication.md`'s phone+OTP access flow?

- **Raised by:** `ux-designer`, designing `product/02-ux/authentication.md`.
- **Question:** `authentication.md` designs the merchant-facing phone+OTP screens implementing `company/business-decisions.md` Q14 (Resolved directionally: phone + SMS/WhatsApp OTP) — but that entry itself states plainly that "architect still needs to design how this fits domain-model.md's Business/Session aggregates... before builder can implement it." `domain-model.md` today has no User/Account aggregate, no `OWNER`/`SELLER` role concept, and no Business↔User relationship — Business was previously modeled as belonging to "an install" (`onboarding.md §2.1`), not an authenticated identity. `authentication.md` assumes (a) the first-ever verified phone produces a structural Owner fact once `onboarding.md §3.5`'s Business-creation write next succeeds, and (b) could not resolve what happens when an already-onboarded phone re-verifies from a session-less device (Product Decision Q18) — that gap depends on whether a Business is looked up by device or by identity.
- **Proposed resolution:** `product/99-rfc/0007-user-and-business-membership.md` (Status: Proposed) — drafted by `architect` in direct response to this question, schematizing `User` (global aggregate root, identified by `phone`) and `BusinessMembership` (its own aggregate root, `role: OWNER | SELLER`), with Business creation gaining a structural invariant (no Business without an atomically-created OWNER Membership). Not yet Accepted/promoted to `decision-log.md`.
- **Status:** Open, pending Product Owner Accept on RFC 0007. Doesn't block `authentication.md`'s own Low-Fidelity screens (verification UI doesn't depend on the answer); blocks that document's eventual Architecture Gap Analysis and blocks Q18 (below) from being answerable.

## Resolved

### Q7 — Does Eventos own the per-Event Día-by-Día rollup, or does that belong to Resultados?

- **Raised by:** `reviewer`'s audit of `events.md` §3.15, during Eventos UX review.
- **Question:** `information-architecture.md`'s nav table explicitly assigns "Session/Event summaries" to Resultados. `events.md` §3.15 nonetheless designed a persistent, revisitable per-Event summary screen (totals + full per-day breakdown) inside Eventos, justified by a self-drawn "counts-only vs. analytical" distinction that isn't established anywhere in the frozen IA.
- **Resolution:** Already settled by the frozen Foundation — not a gap. `information-architecture.md`'s nav table assigns "Session/Event summaries" to Resultados explicitly; Eventos' own stated job is "scheduled/active/past Events, drills into their Sessions" — status/navigation, not aggregated summary content. The Eventos draft's full breakdown screen contradicted the frozen IA as written. Eventos may show a thin, ambient, in-progress indicator as part of its own navigation/status role and can drill into individual Sessions, but the full multi-day breakdown/rollup belongs in Resultados.
- **Applied:** `events.md` §3.15 corrected — Main replaced the full rollup screen with passive identity (name, type, dates, place) + a single hand-off action ("Ver resumen en Resultados"). No totals, no per-day rows remain in Eventos.
- **Status:** Resolved — applied to `product/02-ux/events.md`.
