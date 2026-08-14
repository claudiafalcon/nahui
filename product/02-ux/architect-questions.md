# Architect Questions

Standing log of domain ambiguities surfaced during UX documentation that the frozen `product/00-foundation/` doesn't resolve. Per the architect-escalation protocol in `company/CLAUDE.md`: Main consults `architect` first; anything Architect can resolve from the existing Foundation gets applied directly to the relevant doc and never appears here.

**Since the Decision Ownership policy was added to `company/CLAUDE.md`, this file holds only questions classified as Architect Decisions** — resolvable by interpreting the existing Product Foundation, Information Architecture, domain model, or established architectural principles. Questions requiring a Product Owner call now live in one of two sibling logs instead:

- **`product/02-ux/product-decisions.md`** — changes to product behavior, UX, capabilities, or feature scope.
- **`company/business-decisions.md`** — pricing, commercialization, legal, compliance, operations, or strategic business choices.

Nine questions previously logged here (Q1–Q6, Q8–Q10) were reclassified and moved to those two files per this policy — their content and status are unchanged, only their location and governance category. Q7 is the only entry that was a pure Architect Decision (resolved by interpreting the frozen Foundation, no Product Owner input needed), so it's the only one that stays.

Entries are never deleted once resolved; mark them Resolved with the outcome instead, so the history of what was ambiguous and why stays intact (same non-deletion rule as `product/99-rfc/`).

## Open

_(none currently)_

## Resolved

### Q19 — Does a same-day "ya vendiste $X hoy" ambient signal (no ambient trust signal for already-recorded sales on a same-day resume) fall inside Q7's existing "thin, ambient, in-progress indicator" allowance?

- **Raised by:** `merchant-user-tester`'s first-ever Eventos walk (`product/02-ux/experience-review-2026-08-13-eventos.md`), during a same-day close/reopen of "Bazar Santa."
- **Question:** After closing "Día 1" (summary correctly showed "$750 · 2 ventas"), returning to Home offered "Continuar Día 1" again — correct per `decision-log.md` D15 (a same-day resume must not increment the day number). But nothing on Home, the Event card, or Event detail told Ana a closed Session with sales already existed for today before she reopened selling; the new Session's own running total legitimately starts at $0, and she read that blank total as her prior sales having vanished — read as a moment that "would make Ana stop trusting the 'close' action." Whether surfacing this fact falls inside `architect-questions.md` Q7's already-sanctioned "thin, ambient, in-progress indicator" allowance, or is new scope needing a fresh Product Owner decision, was routed to `architect` for classification rather than resolved during the tester walk itself.
- **Resolution:** Already settled by Q7's existing ruling — not a new decision. Q7 resolved that Eventos (and, by the same reasoning, Home, since both read the identical Session/Sale data for the identical `eventId`) may show "a thin, ambient, in-progress indicator" as part of their own navigation/status role, distinct from the full day-by-day breakdown reserved for Resultados. A same-day "ya vendiste $X · N ventas hoy" line is exactly this: a single computed fact (`SUM(SaleItem.pricePaid)`, `COUNT(Sale)`) over a Session set both documents already compute for "Día N" (`domain-model.md`), rendered as one ambient line, never a breakdown, never a new fetch, never a new screen. Applies identically to Quick Sessions (`eventId = null`), which have the same same-day-resume blind spot and no Foundation basis for different treatment.
- **Applied:** `product/02-ux/home.md` §3.4/§3.5 (Quick Session, "Iniciar Sesión Rápida") and §3.6/§3.6a (Event-linked, "Continuar Día N") — new conditional ambient line. `product/02-ux/events.md` §3.14 (Event detail, active, no Session opened today) — new conditional ambient row, worded to signal in-progress rather than closed, per the tester finding being specifically about trust in the "close" action.
- **Status:** Resolved — applied to `product/02-ux/home.md` and `product/02-ux/events.md`.

### Q17 — What is the User/Owner/Seller domain model (and Business↔User relationship) needed to implement `authentication.md`'s phone+OTP access flow?

- **Raised by:** `ux-designer`, designing `product/02-ux/authentication.md`.
- **Question:** `authentication.md` designs the merchant-facing phone+OTP screens implementing `company/business-decisions.md` Q14 (Resolved directionally: phone + SMS/WhatsApp OTP) — but that entry itself states plainly that "architect still needs to design how this fits domain-model.md's Business/Session aggregates... before builder can implement it." `domain-model.md` previously had no User/Account aggregate, no `OWNER`/`SELLER` role concept, and no Business↔User relationship — Business was modeled as belonging to "an install" (`onboarding.md §2.1`), not an authenticated identity. `authentication.md` assumes (a) the first-ever verified phone produces a structural Owner fact once `onboarding.md §3.5`'s Business-creation write next succeeds, and (b) could not resolve what happens when an already-onboarded phone re-verifies from a session-less device (Product Decision Q18) — that narrower gap remains open, see `product-decisions.md`.
- **Resolution:** `product/99-rfc/0007-user-and-business-membership.md`, Accepted by the Product Owner and promoted in full via `decision-log.md` D44. `User` (global aggregate root, identified by `phone`) and `BusinessMembership` (its own aggregate root, `role: OWNER | SELLER`) are now part of `domain-model.md`/`ubiquitous-language.md`; Business creation carries the structural invariant (no Business without an atomically-created OWNER Membership).
- **Applied:** `domain-model.md` (Aggregate roots, Entity relationships, Key Mechanisms, Bounded contexts), `ubiquitous-language.md` (Identity context), `decision-log.md` D44.
- **Status:** Resolved — Q18 (`product-decisions.md`) remains separately open, deliberately non-blocking at pilot scale.

### Q7 — Does Eventos own the per-Event Día-by-Día rollup, or does that belong to Resultados?

- **Raised by:** `reviewer`'s audit of `events.md` §3.15, during Eventos UX review.
- **Question:** `information-architecture.md`'s nav table explicitly assigns "Session/Event summaries" to Resultados. `events.md` §3.15 nonetheless designed a persistent, revisitable per-Event summary screen (totals + full per-day breakdown) inside Eventos, justified by a self-drawn "counts-only vs. analytical" distinction that isn't established anywhere in the frozen IA.
- **Resolution:** Already settled by the frozen Foundation — not a gap. `information-architecture.md`'s nav table assigns "Session/Event summaries" to Resultados explicitly; Eventos' own stated job is "scheduled/active/past Events, drills into their Sessions" — status/navigation, not aggregated summary content. The Eventos draft's full breakdown screen contradicted the frozen IA as written. Eventos may show a thin, ambient, in-progress indicator as part of its own navigation/status role and can drill into individual Sessions, but the full multi-day breakdown/rollup belongs in Resultados.
- **Applied:** `events.md` §3.15 corrected — Main replaced the full rollup screen with passive identity (name, type, dates, place) + a single hand-off action ("Ver resumen en Resultados"). No totals, no per-day rows remain in Eventos.
- **Status:** Resolved — applied to `product/02-ux/events.md`.
