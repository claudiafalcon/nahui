# Visual Language

The strategic layer above `company/brand/brand-guide.md`. That document is the tactical execution spec `ui-designer` builds against — exact hex values, type scale, component states, accessibility-corrected color tokens. This document is different in kind: it's about what Nahui's visual character *should feel like* and why, not the pixel-level values that express it. If the tactical guide ever drifts from what this document says Nahui's character calls for, `brand-guardian` flags it — this document doesn't override or duplicate the tactical one.

## Relationship to `company/brand/brand-guide.md`

Kept where it is, by explicit Product Owner direction (2026-08-08) — no reorganization, to avoid churn across the many existing Medium-Fidelity cross-references that already point to it. This document sits above it strategically:

- `company/brand/brand-guide.md` — the palette (Coral AA+, Tezontle, Obsidian, etc.), typography (Fredoka display / Inter UI), spacing/radius tokens, component specs. Authored for and consulted by `ui-designer`. **Decision** at the token level — these are shipped, load-bearing values `ux-critic` already reviews Medium/High-Fidelity work against.
- `brand/visual-language.md` (this document) — the character question underneath those choices: does the shipped palette and type pairing actually read as "quiet companion," or could the same values serve a colder, more corporate product just as well? A question worth asking periodically, not a challenge to the already-shipped tokens.

## Name and symbol meaning — **added 2026-10-07**

**Why this section exists.** Until this pass, no `/brand/` document mentioned Nahuatl, *Nahui Ollin*, movement, the four cardinal directions, or the four pillars — this document's only character content was the ocelot, below. Meanwhile `company/brand/brand-guide.md` (§"Name meaning," line ~81; §"Logo meaning — the four pillars," lines ~83-88; §"The center"; §"A living symbol") carries all of those identity claims **untagged**, and `landing/index.html` — the first public surface Nahui has ever had — then states several of them to merchants as settled fact. That's the gap this section closes: Nahui's claims about what its own name and mark *mean* are identity claims, and identity claims belong under `/brand/`'s evidence-tier discipline (`brand/CLAUDE.md`), not left untiered inside a tactical visual-execution spec.

**What this section does not do.** It does not edit, replace, or relocate `company/brand/brand-guide.md`. That document stays the authoritative tactical source for the mark's construction, the pillars' names, the center, and the tagline — per this document's own standing rule, `brand-guardian` flags drift in the tactical guide rather than rewriting it. This section supplies the missing tier on each claim, nothing more.

### The Nahuatl etymology and *Nahui Ollin* — the fact is external; the brand's adoption of it is a **Decision**

Two claims live inside `brand-guide.md` §"Name meaning," and keeping them apart is the entire point of this subsection:

1. **The linguistic and cultural fact** — that *nahui* is the Nahuatl numeral "four," and that *Nahui Ollin* ("Four Movement") is a real Mexica cosmological concept associated with movement, transformation, and the four directions — is an external fact, verifiable outside Nahui. **It carries no tier**, because `/brand/`'s four tiers measure the status of *Nahui's own claims*, not the accuracy of the world. (If this etymology ever needs sourcing rather than asserting, that's a `knowledge-mentor` consultation, not a brand tier.)
2. **Nahui's adoption of that concept as its own meaning** — "it reflects that every business is constantly evolving — selling, learning, growing, adapting. It also honors Mexican roots while keeping a modern, global identity" (`brand-guide.md` §"Name meaning") — is a **Decision**. Deliberately adopted by the Product Owner as the brand's story about its own name. Binding on what gets built and said; not evidence-backed.

**Why this distinction is load-bearing, written out so it doesn't get collapsed on a future pass.** A verifiable etymology sitting immediately next to a brand claim built on top of it makes the brand claim *look* verified by proximity. It isn't. That *Nahui Ollin* means what it means is checkable against sources outside this company. That a merchant hears the name "Nahui" and feels movement, transformation, evolution, or Mexican roots is a completely different claim, about a completely different thing — a reaction in someone else's head — and it has never been checked with anyone. A future agent reading only `brand-guide.md` has no way to see that line, which is exactly how an external fact gets silently laundered into evidence for the brand claim leaning on it. **The etymology is not evidence for the brand meaning. It is the raw material the brand meaning was deliberately chosen from.**

### The four pillars — **Decision**

Comercio (the sale itself), Clientes (the relationship, loyalty, who buys and how), Datos / Inteligencia (turning what happens into decisions), Movimiento (the itinerant nature of the business — moving between bazares, adapting, growing), converging on a shared center (`brand-guide.md` §"Logo meaning — the four pillars," §"The center").

**Decision.** Deliberately adopted as what the mark represents — and a genuinely coherent one: the four pillars map cleanly onto `company/CLAUDE.md`'s own stated scope (sale registration, Frequent Customers, business intelligence, itinerant commerce), which is a real internal consistency worth naming. **Zero merchant evidence.** No merchant has been shown the mark and asked what they see, and internal coherence with our own scope is not evidence of merchant perception — it's evidence that we designed the mark from our own scope, which we did. Treat accordingly: binding as direction, unproven as reception.

Also **Decision**, same tier and same reasoning: the "not a cross" clarification (`brand-guide.md` §"Logo meaning") and the deliberate rounded geometry rationale (§"Rounded geometry" — soft curves as approachability rather than institutional authority). The rounded-geometry reasoning is notably consistent with `character-bible.md`'s Decision-level "never an expert, a narrator, a bank, a fintech" register and with Value #4 ("the merchant is already an expert") — a real alignment between the tactical guide and the character bible, and the clearest existing example of the two documents agreeing rather than drifting.

### "A living symbol" — the multiple readings — **Hypothesis**

`brand-guide.md` §"A living symbol" states the mark can be read as a plus sign (growth, added value), a compass (four directions), four connected paths, a person with open arms, or continuous movement around a shared center — and that the ambiguity is intentional and memorable.

**Hypothesis, at best.** Every item on that list is a claim about what someone else will perceive, and not one of them has been tested against whether any real person actually sees it. "The ambiguity is intentional" is a Decision (we chose not to fix a single meaning); "the ambiguity is memorable" and "the mark reads as a compass / a person with open arms / four paths" are untested perceptual claims, and the gap between a designer's intended reading and a stranger's first reading is exactly the kind of thing that turns out differently than expected. Cheap to test the moment any real merchant contact happens: show the mark, say nothing, ask what they see. Until then, these readings may be used as internal creative rationale and must not be stated anywhere merchant- or customer-facing as what the mark *means*.

### The one sentence most worth carrying forward

**No merchant has ever been asked what the Nahui name or the Nahui mark means to them. Nothing in this section is Validated.**

Not the etymology's resonance, not the four pillars, not the center, not the rounded geometry's warmth, not a single one of the "living symbol" readings. Everything here is either a deliberate Decision or an untested Hypothesis, and the distance between "we chose this meaning carefully" and "this meaning lands" has not been crossed even once. Per `brand/CLAUDE.md`, nothing here moves to Validated on internal conviction, however well-reasoned the mark is — only on a real merchant or customer reaction.

### Open, and pending a Product Owner call — not resolved here

- **The tagline.** `brand-guide.md` §"Tagline" states "The path to what's next." Whether that is still Nahui's tagline is **open** and sits with the Product Owner — it is an English-language line in a tactical guide, it appears on no current merchant-facing surface in that form, and `/brand/` has never held a position on it. Not tiered here, because a tier on a claim whose current status is unknown would be worse than no tier at all. Once the Product Owner confirms or retires it, it gets a tier in this section.
- **Who the English-language reader of any Nahui surface actually is.** Raised by the 2026-10-07 landing-page review and routed to the Product Owner. Relevant here because the tagline, the brand attributes, and the brand promise in `brand-guide.md` are all written in English, and `/brand/` cannot say what register they should carry until that audience is identified. Open; not answered by this document.

## The ocelot — **Hypothesis**

An original, stylized ocelot is currently being explored as visual inspiration for Nahui's character — mentioned nowhere in `company/brand/brand-guide.md`'s current shipped palette/component spec, and that's correct: it hasn't been decided into the tactical guide, because it hasn't been decided at all. This is an active creative exploration, not a finalized mascot, not a logo direction, not confirmed anywhere downstream yet.

**What "stylized ocelot" is being explored for, as currently understood:** a visual metaphor consistent with `character-bible.md`'s Decision-level personality traits — quiet, attentive, watchful without being intrusive. An ocelot is a real Mexican wild cat, regionally resonant (not an imported mascot trope), naturally associated with quiet observation rather than performance — a plausible visual expression of "Nahui quietly observes, learns, and protects" (Decision). None of that reasoning has been tested against real merchant reaction; it's the internal logic behind exploring this direction, not evidence that it works.

**Relationship to the existing mark, named rather than assumed (added 2026-10-07).** The four-pillar symbol above is Nahui's current, shipped identity mark; the ocelot is an exploration of Nahui's *character*. These are not obviously the same object, and this document does not assume they resolve into one: whether a character mark eventually sits alongside the pillar symbol, replaces it, or stays confined to non-product surfaces is part of the open question already listed below, now with the pillar symbol explicitly named as the incumbent it would have to coexist with. Both share the same regional-but-not-folkloric intent (Mexican by origin, modern in execution), which is a point of coherence worth preserving in whichever direction this resolves.

## What's actually shipped today vs. what's still open

- **Shipped, Decision-level** (per `company/brand/brand-guide.md`): the Coral AA+ palette, Fredoka/Inter typography pairing, the accessibility-corrected color tokens, the component-level Design System `ui-designer` builds against, and the four-pillar symbol itself. None of the palette/typography work was authored with the ocelot direction in mind — it predates that exploration.
- **Open, Hypothesis-level**: whether/how a character mark (the ocelot or any alternative) integrates with the already-shipped palette, typography, and pillar symbol; whether a character mark belongs in-product at all, or stays confined to marketing/brand surfaces; what "stylized" means concretely (illustration style, level of abstraction, color treatment); and every perceptual claim in "A living symbol," above.

## Non-goals for this document

- Does not specify component-level visual rules — that stays `company/brand/brand-guide.md`.
- Does not decide whether/when a character mark actually ships anywhere — that's a Product Owner call, informed by this document, not made by it.
- Does not design the character mark itself — that's a visual-design task for whoever eventually executes the Hypothesis, once it's ready to move past exploration.
- Does not change the name, the mark, the pillars, or the tagline. The "Name and symbol meaning" section above tiers existing claims; it does not author new ones, and a change to any of them is a Product Owner call.

## How this gets used

`ui-designer` consults `brand-guardian` (who consults this document) when a Medium-Fidelity build introduces a visual character choice — illustration style, mascot/character use — not yet covered by the shipped `brand-guide.md`, per the consultation trigger in `.claude/agents/brand-guardian.md`.

**For anyone writing copy about the name or the mark** (`marketing` especially, and `ux-designer` for any in-product "about Nahui" surface): the "Name and symbol meaning" section above is the one that governs. Decision-tier claims (the name's adopted meaning, the four pillars) may be stated as what Nahui stands for, because the company deliberately chose them. Hypothesis-tier claims (every "living symbol" reading) may not be presented as what the mark means to anyone, because no one has ever told us that it does.
