# Experience Review — 2026-08-04

One-time emotional/experiential walkthrough of the Medium-Fidelity prototype, run at the Product Owner's request, separate from the standing spec-compliance findings in `ux-critic-findings.md`. Question asked: not "is this correct," but "would Ana leave this session excited to adopt Nahui."

Governance: `ux-critic` identified/prioritized only. `ux-designer` proposed UX improvements. `ui-designer` implemented visuals. `reviewer` verifies no regressions. Main coordinated, did not design or fix anything directly.

## Final verdict (from `ux-critic`'s walkthrough)

Not yet an unambiguous "yes." The core registration loop (the thing the product is actually staked on) works and builds real trust. The two moments meant to create genuine excitement — finishing setup, seeing the payoff after a full day of selling — landed flat, and the demo's emotional climax (Resultados) showed data from a story Ana never lived. None of this reflected a flawed design — it was a mix of missing visual delight at high-stakes moments and demo-content bugs.

## Findings

**Real usability issues (ranked by cost to the emotional arc):**
1. Resultados' session-detail screen (the payoff of the whole demo) had no celebration or hierarchy — plain list.
2. "Venta finalizada ✓" worked correctly but read as ordinary text, not a moment worth noticing.
3. "Todo listo" (finishing onboarding) had zero celebration for the first real commitment to the product.
4. No brand mark anywhere in 27 screens; the brand guide's own Coral "Stat/highlight card" was never used for running totals.

**Prototype limitations (demo-content bugs, not design flaws — specs were already correct):**
- Sale totals reverted to stale numbers after a successful sale.
- A just-scheduled event contradicted itself ("starts in 3 days" then "Day 2" one screen later).
- Resultados' final screen showed an unrelated date/total/product.
- "Guardar mercancía" rendered visually disabled after a valid selection.
- No NFC-appropriate success screen existed (showed the buttons-mode product grid, violating the "no grid in nfc mode" rule).
- The NFC journey never received the seamless same-page navigation fix the buttons journey got.
- Leftover placeholder text in a search field.

**Future enhancement (not built, correctly deferred at the time):** a customer-facing continuation after the sale. Evaluated further below — since resolved into an actual design direction.

## Remediation status

| Item | Status |
|---|---|
| Reverting totals, contradictory dates, mismatched Resultados finale, disabled Guardar button, search-field placeholder | **Fixed & verified** (`ui-designer`, 2026-08-04) |
| NFC success screen | **Fixed & verified** — nfc-mode equivalent of "Venta finalizada ✓" built |
| NFC journey seamless-navigation parity | **Scoped, not built** — estimated 15–40 new frames, tracked as its own follow-up, timing is the Product Owner's call |
| Resultados hero-tier hierarchy, "Venta finalizada" felt-not-read treatment, "Todo listo" ceremony, brand mark/Stat-card usage | `ux-designer` briefs complete, **`ui-designer` implementation not yet dispatched** — queued to avoid colliding with the bug-fix pass on the same frames, now clear to proceed |
| Resultados venue ranking: plain numbers vs. magnitude bar | **Decided** — plain numbers, per Product Owner (avoids implying a recommendation engine) |
| Sale QR after "Venta finalizada" | **Reframed by Product Owner** (not a customer QR — a Sale QR representing the completed transaction, zero merchant action required) — `architect` confirming Foundation fit now |
| "Does Resultados communicate real learning, not just data" | `ux-critic` re-evaluating now, informed by the Product Owner's sharper framing |

## Related, broader Medium-Fidelity workstream (separate request, same day)

A second, independent request — icon system, Resultados value, visual hierarchy app-wide — produced its own findings (F1–F11) and proposals, tracked separately once persisted. Referenced here only because both workstreams converge on the same Resultados screens; implementation is being consolidated rather than dispatched piecemeal to avoid rework.

## Open, pending Product Owner input or in-flight evaluation
- Sale QR: `architect` confirming scope against D21/D22/RFC-0002/D26 staging.
- Resultados "communicates learning": `ux-critic` re-evaluating.
- NFC journey seamless-navigation build: timing decision, not yet requested.
