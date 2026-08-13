# Nahui

AI-native company building sales/business-intelligence tools for itinerant vendors (bazares) in Mexico.

## Where things live
- `/company` — who we are, backlog, lessons. Read this for context, don't build here.
- `/brand` — Nahui's long-term identity: character, voice, storytelling, strategic visual language. Owned by `brand-guardian`. Read before writing any merchant/customer-facing copy or brand-facing decision. See `brand/CLAUDE.md`. (`company/brand/brand-guide.md` remains the separate, tactical visual-execution spec `ui-designer` builds against.)
- `/product/00-foundation` — permanent product knowledge: vision, domain model, information architecture, decision log. Read this before making product/UX/engineering decisions.
- `/product/01-validation` — throwaway prototypes to test hypotheses. Not production code. Optimize for speed, not quality.
- `/product/02-ux` — low-fidelity UX specifications for merchant-facing experiences, reviewed one at a time before implementation.
- `/product/02-ux-loyalty` — low-fidelity UX specifications for the customer-facing Loyalty-claim surface — explicitly not part of the Merchant Application (`decision-log.md` D38). Same pipeline stage and fidelity discipline as `/product/02-ux`, different deploy target.
- `/product/02b-medium-fidelity` — dormant/legacy as of D42. Tracking for Medium-Fidelity UI (real layouts, in Figma) built on top of an Approved Low-Fidelity spec; six completed tracking files retained as historical record. Not used for new feature work — superseded by `/product/02c-high-fidelity-prototype`.
- `/product/02c-high-fidelity-prototype` — Nahui's primary living prototype: real React/TypeScript code, the standing home for all future feature UI work (`decision-log.md` D41, D42). Not disposable (`01-validation`'s charter), not yet backend-integrated (`03-build`'s charter) — see the folder's own `CLAUDE.md`.
- `/product/03-build` — code that survived validation, worth maintaining.
- `/product/04-scale` — features that require multiple users/network effects (not yet started).
- `/evidence` — weekly progress snapshots for course deliverables. Not part of the product.

## Rule
Before building anything, check `/company/CLAUDE.md` for full context, `/company/backlog.md` for current priority, and `/product/00-foundation/CLAUDE.md` for the frozen domain model and architecture this all has to fit into.

## Language
- Internal docs/code/agents: English.
- Anything end-user-facing (UI text for Ana): Spanish. Never translate the UI.
- Full detail (natural Mexican Spanish, avoid literal translations, merchant vocabulary): `product/00-foundation/global-principles.md`.
