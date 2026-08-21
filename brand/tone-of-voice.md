# Tone of Voice

Concrete language guidance — what `brand/character-bible.md`'s Voice section (Decision) sounds like in actual copy. This is what `ux-designer` and `marketing` consult directly when drafting merchant- or customer-facing text; `brand/brand-principles.md` states the "why," this document states the "how it reads."

Every claim below is a **Decision** unless marked otherwise — a direct, deliberate translation of already-adopted character-bible principles into language rules, not a new creative direction awaiting testing.

## The register

Direct, warm, plain. Business language before technical language — this document sits alongside, and never overrides, `product/00-foundation/global-principles.md`'s existing structural rule ("business language before technical language," natural Mexican Spanish, never a literal translation from English for anything merchant-facing). What this document adds is the *feeling* of that language: warm without being cute, direct without being blunt, honest without being clinical.

## Learner before advisor — the register that governs every recommendation

Direct expression of `character-bible.md`'s "Earning the right to advise" (Decision): Nahui should never sound like an expert, a narrator, a bank, a fintech, or a virtual assistant. It arrives knowing nothing about a given merchant, and learns from her before it ever gives advice — only after it has actually earned an understanding of *her specific* business does recommendation-shaped language belong in its copy at all.

- **Observation before instruction.** *"He notado algo..."* ("I've noticed something...") is the shape recommendation copy should take once Nahui does have something worth saying — never *"Deberías hacer esto"* ("You should do this"). The first offers something she can weigh; the second assumes a standing to instruct her that hasn't been earned. This is the single clearest test to run any recommendation-shaped copy against.
- **No prescriptive language without a real, merchant-specific basis behind it.** Words like "deberías," "te recomendamos," "lo correcto es" only belong in copy once there's an actual observation of *this* merchant's own data or behavior underneath them — a pattern in her own sales, a choice she's already made. Absent that basis (a brand-new merchant, a feature with no history to draw on yet), default to plain, neutral statement of fact, or to no comment at all, rather than manufacturing advice-shaped language to fill the space.
- **No expert/narrator/bank/fintech/assistant register, regardless of surface.** This applies as much to a notification or a report as to conversational copy: a confident, explaining tone that reads as "here is what you should know" rather than "here is what I noticed" fails this rule even where no literal imperative verb appears.
- **Age is not the axis.** A voice does not have to sound old, formal, or "wise" to violate this — a young, casual, confident "explainer" tone can claim exactly the same unearned authority a stiff corporate one does. What's being tested is whether the copy sounds like it already knows, not how old it sounds.

## Concrete rules

- **State facts before offering an opinion.** "No pudimos guardar. Sigue aquí, intenta de nuevo" — what happened, then what to do — never an apology-first, fact-second structure.
- **Never use urgency Nahui hasn't earned.** No "¡Solo por hoy!," no manufactured scarcity, no countdown language — this is a companion, not a sales funnel. Directly enforces `character-bible.md`'s "never gives orders."
- **Suggestions read as offers, not instructions.** "Puedes revisar esto en Configuración" (an actual `reports.md` §3.13 precedent), never "Deberías activar esto" or any imperative construction implying she's missed a step.
- **Celebration is about her, plainly stated, never inflated.** A completed sale, a reached milestone — state what happened in her terms ("Ya quedaste registrada con Ropa Ana"), never dress it up with exclamation-heavy congratulatory copy that centers the platform's cleverness.
- **Never imply a merchant needed rescuing.** No "finalmente puedes..." or "ya no tienes que preocuparte por..." framing that casts her prior methods as a problem Nahui solved — she already knew what she was doing.
- **Technical terms never appear in merchant- or customer-facing copy** — `Session`, `SaleItem`, `Customer`, `Claim`, `subscriptionTier`, `registrationMode` and every other domain term stay in the code and the Foundation, never on screen. Restated here from `product/00-foundation/architecture-principles.md` #4 because it's as much a brand rule as a technical one — a leaked internal term breaks the companion illusion instantly.
- **Errors are stated plainly, without over-explaining or self-flagellating.** "No pudimos guardar tu cambio. Intenta de nuevo" — short, honest, no anxious over-apologizing (see `character-bible.md`'s "How Nahui apologizes," currently Hypothesis).

## Two audiences, two contexts, one voice

Nahui speaks to two different people — merchants (in the Merchant Application) and customers (on the Loyalty-claim registration surface, `product/02-ux-loyalty/customer-loyalty-registration.md`) — and both should still sound like the same underlying character, even though the relationship and stakes differ:

- **To the merchant**: a companion who already trusts her expertise, and who is honest about how much of *her* business it has actually learned so far — see "Learner before advisor," above. Plain, warm, business-first.
- **To the customer**: honest and unhurried, with an equally honest and equally easy way to decline — the existing `product/02-ux-loyalty/customer-loyalty-registration.md` spec's own "No, gracias" escape hatch, carrying equal prominence and availability to "Continuar," is the concrete example this document points to. No dark patterns, ever, in either direction.

## What "Hypothesis" looks like here — worth naming explicitly

Some tone choices are still genuinely untested against real merchant/customer reaction:

- **How much warmth reads as "companion" vs. "assistant" in actual Spanish copy** — the character-bible's core distinction (Decision) hasn't yet been checked against whether merchants *feel* that distinction reading real screens. **Hypothesis.**
- **The exact register for apology/error copy** (`character-bible.md`'s own "How Nahui apologizes" section) — the existing error-state copy across `product/02-ux/` is a reasonable starting precedent, not yet confirmed as the right emotional pitch. **Hypothesis.**

Note: "Learner before advisor," above, is not on this list. It is a Decision, not a Hypothesis — the Product Owner articulated it as a firm, present-day rule for how recommendation-shaped copy gets written now, not a direction awaiting merchant reaction to confirm.

## How this gets used

- `ux-designer` and `marketing` consult this document directly when writing new copy, per the consultation triggers in `.claude/agents/brand-guardian.md`.
- `brand-guardian` reviews copy against these concrete rules during a Brand Consistency Review — a Blocker here means copy actively contradicts a stated rule (e.g., a leaked technical term, manufactured urgency, advice-shaped language with no merchant-specific basis behind it), not a matter of taste.
