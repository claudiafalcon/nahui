# Nahui

AI-native company building sales/business-intelligence tools for itinerant vendors (bazares) in Mexico.

## Where things live
- `/company` — who we are, brand, backlog, lessons. Read this for context, don't build here.
- `/product/00-foundation` — permanent product knowledge: vision, domain model, information architecture, decision log. Read this before making product/UX/engineering decisions.
- `/product/01-validation` — throwaway prototypes to test hypotheses. Not production code. Optimize for speed, not quality.
- `/product/02-ux` — low-fidelity UX specifications for merchant-facing experiences, reviewed one at a time before implementation.
- `/product/03-build` — code that survived validation, worth maintaining.
- `/product/04-scale` — features that require multiple users/network effects (not yet started).
- `/evidence` — weekly progress snapshots for course deliverables. Not part of the product.

## Rule
Before building anything, check `/company/CLAUDE.md` for full context, `/company/backlog.md` for current priority, and `/product/00-foundation/CLAUDE.md` for the frozen domain model and architecture this all has to fit into.

## Language
- Internal docs/code/agents: English.
- Anything end-user-facing (UI text for Ana): Spanish. Never translate the UI.
- Full detail (natural Mexican Spanish, avoid literal translations, merchant vocabulary): `product/00-foundation/global-principles.md`.
