# Visual Language

The strategic layer above `company/brand/brand-guide.md`. That document is the tactical execution spec `ui-designer` builds against — exact hex values, type scale, component states, accessibility-corrected color tokens. This document is different in kind: it's about what Nahui's visual character *should feel like* and why, not the pixel-level values that express it. If the tactical guide ever drifts from what this document says Nahui's character calls for, `brand-guardian` flags it — this document doesn't override or duplicate the tactical one.

## Relationship to `company/brand/brand-guide.md`

Kept where it is, by explicit Product Owner direction (2026-08-08) — no reorganization, to avoid churn across the many existing Medium-Fidelity cross-references that already point to it. This document sits above it strategically:

- `company/brand/brand-guide.md` — the palette (Coral AA+, Tezontle, Obsidian, etc.), typography (Fredoka display / Inter UI), spacing/radius tokens, component specs. Authored for and consulted by `ui-designer`. **Decision** at the token level — these are shipped, load-bearing values `ux-critic` already reviews Medium/High-Fidelity work against.
- `brand/visual-language.md` (this document) — the character question underneath those choices: does the shipped palette and type pairing actually read as "quiet companion," or could the same values serve a colder, more corporate product just as well? A question worth asking periodically, not a challenge to the already-shipped tokens.

## The ocelot — **Hypothesis**

An original, stylized ocelot is currently being explored as visual inspiration for Nahui's character — mentioned nowhere in `company/brand/brand-guide.md`'s current shipped palette/component spec, and that's correct: it hasn't been decided into the tactical guide, because it hasn't been decided at all. This is an active creative exploration, not a finalized mascot, not a logo direction, not confirmed anywhere downstream yet.

**What "stylized ocelot" is being explored for, as currently understood:** a visual metaphor consistent with `character-bible.md`'s Decision-level personality traits — quiet, attentive, watchful without being intrusive. An ocelot is a real Mexican wild cat, regionally resonant (not an imported mascot trope), naturally associated with quiet observation rather than performance — a plausible visual expression of "Nahui quietly observes, learns, and protects" (Decision). None of that reasoning has been tested against real merchant reaction; it's the internal logic behind exploring this direction, not evidence that it works.

## What's actually shipped today vs. what's still open

- **Shipped, Decision-level** (per `company/brand/brand-guide.md`): the Coral AA+ palette, Fredoka/Inter typography pairing, the accessibility-corrected color tokens, the component-level Design System `ui-designer` builds against. None of this was authored with the ocelot direction in mind — it predates that exploration.
- **Open, Hypothesis-level**: whether/how a character mark (the ocelot or any alternative) integrates with the already-shipped palette and typography; whether a character mark belongs in-product at all, or stays confined to marketing/brand surfaces; what "stylized" means concretely (illustration style, level of abstraction, color treatment).

## Non-goals for this document

- Does not specify component-level visual rules — that stays `company/brand/brand-guide.md`.
- Does not decide whether/when a character mark actually ships anywhere — that's a Product Owner call, informed by this document, not made by it.
- Does not design the character mark itself — that's a visual-design task for whoever eventually executes the Hypothesis, once it's ready to move past exploration.

## How this gets used

`ui-designer` consults `brand-guardian` (who consults this document) when a Medium-Fidelity build introduces a visual character choice — illustration style, mascot/character use — not yet covered by the shipped `brand-guide.md`, per the consultation trigger in `.claude/agents/brand-guardian.md`.
