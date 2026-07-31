# Company context

## What Nahui is
Sales registration + business intelligence app for itinerant vendors (bazares) in Mexico. Pilot user: Ana, sells clothing (pajamas, hoodies/maxys, socks) at private bazares in Estado de México.

## Core thesis
Validated via interview with Ana: her top-priority friction is sale registration — customer flow is unpredictable, so any registration step over a few seconds competes with attending the next customer, and she loses the sale record. She caps her own catalog size to keep mental control, which caps growth.

Two other validated frictions, lower priority for now:
- Choosing which bazaar to attend, with no data on foot traffic/weather.
- No way to segment loyal customers (they follow her organically via IG/WhatsApp, but she can't tell a high-volume-occasional buyer from a small-but-every-bazaar buyer).

## Business model direction (not final)
- Free tier: registration only (adoption hook, feeds network effect data later).
- Paid tier: customer segmentation (available once user has own sales history) + eventually bazaar recommendations (needs multi-user data).
- No transaction-based commission — Ana explicitly rejects Amazon/Mercado Pago-style fee models. Flat/seasonal pricing instead of monthly if usage isn't monthly-constant.
- NFC kit: a starter set of tags is bundled with onboarding, but tags are consumable — each stays with the customer after their sale (it becomes part of the loyalty journey, see `/product/00-foundation/decision-log.md` D11). Merchants buy additional tag packs as they keep selling. Position this as an investment that unlocks customer relationships/analytics, not as a recurring cost or burden.

## Non-goals right now
- Payments/checkout — out of scope, do not build.
- Anything requiring multiple users (bazaar recommendation engine) — no data to support it yet.
