# Brand

The long-term identity layer for Nahui — who Nahui is, how it speaks, and how that stays consistent across every touchpoint the company or product ever has. Owned and maintained by `brand-guardian` (`.claude/agents/brand-guardian.md`). Sits alongside `/company` (why the business exists) and `/product` (what gets built) as a third permanent knowledge area — read this before writing any merchant- or customer-facing copy, designing a new emotional moment, or producing any external-facing brand asset.

## Files

- `character-bible.md` — the single source of truth for who Nahui is: mission, personality, values, voice, emotional behavior, always/never rules, how Nahui speaks/asks/celebrates/helps/apologizes/learns/evolves, and its relationships with merchants, customers, and the company itself. If another document here seems to define Nahui's character differently, this one wins.
- `brand-principles.md` — the small number of durable rules everything else derives from, the brand equivalent of `product/00-foundation/global-principles.md`.
- `tone-of-voice.md` — concrete language guidance `ux-designer`/`marketing` consult directly when writing copy. Also holds the scope line on "never gives orders" (what it governs, and why control labels and CTAs are outside it) and the open, undecided gendered-register question for Spanish copy.
- `storytelling.md` — how Nahui's narrative gets told across longer-form surfaces, including the About-surface carve-out, the "Nahui te propone" shape for AI-suggestion copy, and the roadmap-honesty pattern.
- `visual-language.md` — the strategic visual identity (name and symbol meaning with its tiers, the ocelot exploration, mood, character-appropriate direction) sitting above `company/brand/brand-guide.md`'s tactical execution spec.

## Relationship to `company/brand/brand-guide.md`

That document stays exactly where it is — the tactical, component-level visual-execution guide `ui-designer` builds against (palette, typography, spacing, component states). It is not folded into this folder, by explicit Product Owner decision (2026-08-08), to avoid churn across its many existing cross-references in `product/02-ux/` and `product/02b-medium-fidelity/`. `visual-language.md` is the strategic layer above it; `brand-guardian` cross-references, never rewrites, the tactical guide.

**Standing flag (2026-10-07), not a rewrite.** That guide also carries Nahui's *identity* claims — §"Name meaning," §"Logo meaning — the four pillars," §"The center," §"A living symbol," §"Tagline" — entirely **untagged**. A tactical visual-execution spec is the wrong home for untiered identity claims, and `landing/index.html` has already stated several of them to merchants as settled fact. `visual-language.md` §"Name and symbol meaning" now supplies the missing tier on each claim without touching the guide; the guide's own text remains authoritative for the mark's construction and the pillars' names.

## Evidence-tier discipline — every claim in `/brand/` carries exactly one tag

Four statuses, not three — this project already distinguishes evidence from deliberate choice everywhere else (`company/market-validation.md`'s Evidence tiers, `product/00-foundation/decision-log.md`'s reasoning-vs-proof distinction), and brand governance holds the same line rather than blurring it:

- **Decision** — deliberately adopted by the Product Owner (or `brand-guardian`, once delegated a specific call) as the current brand direction. Binding — it governs what gets built — but not evidence-backed, the same way a `decision-log.md` entry is adopted on reasoning, not proof. Example: "Nahui is a companion, not an AI assistant."
- **Hypothesis** — an active creative direction, not yet tested. Example: the stylized ocelot visual concept.
- **Validated** — supported by sufficient external merchant/customer evidence: a real reaction, a real interview finding, a real signal from `merchant-user-tester` or human-moderated User Validation. Never awarded for internal conviction alone, however confident. Example (not yet true of anything here): "merchants perceive Nahui as trustworthy/protective."
- **Aspiration** — a longer-term intention, not yet actionable.

**A Decision is never presented as Validated.** This is the one rule the Product Owner asked to be held most explicitly: a deliberate choice about who Nahui is stays a Decision, however confident the conviction behind it, until real external evidence earns it the Validated tag. Conflating the two is exactly the failure mode this discipline exists to prevent.

**Two refinements, added 2026-10-07 after the first pass that hit them in practice:**

- **An external fact is not a tier.** A verifiable fact about the world (the Nahuatl etymology of "Nahui," for instance) carries no tag, because these four tiers measure the status of *Nahui's own claims*, not the accuracy of the world. What does carry a tag is the brand's **adoption** of that fact as its own meaning — a Decision. Keeping these apart matters because a verifiable fact sitting next to a brand claim built on it makes the brand claim look verified; it isn't. See `visual-language.md` §"Name and symbol meaning."
- **A genuinely open question carries no tier either.** Where `/brand/` records a gap awaiting a Product Owner call (today: gendered register in Spanish copy, the English reader's identity, Ana's real words and consent, the tagline's current status), it is marked **open**, not tagged Hypothesis — tagging an undecided question would wrongly imply a direction had been chosen. An open gap is also not enforceable in a Brand Consistency Review; existing copy can't violate a rule that doesn't exist yet.

## Status

All five documents created 2026-08-08. **Updated 2026-10-07** (first Brand Consistency Review of an external-facing surface, `landing/index.html`, closing four gaps the review exposed in these documents — review and remediation of that page itself stays with `marketing`):

- `visual-language.md` — new §"Name and symbol meaning," tiering the name/*Nahui Ollin* adoption (**Decision**), the four pillars and rounded geometry (**Decision**), and every "living symbol" reading (**Hypothesis**); the tagline left **open**. Also names the ocelot's unresolved relationship to the shipped four-pillar mark.
- `tone-of-voice.md` — new §"What 'never gives orders' governs — and what it doesn't" (**Decision**, a scope clarification of an existing Decision, carving out CTAs/buttons/headings/navigation from a rule that governs advice-shaped copy); new §"Gendered register in Spanish copy" (**open**, four options drafted, none adopted, Product Owner call); fourth-audience note on the English reader (**open**).
- `storytelling.md` — three precedents absorbed from Nahui's first public narrative surface: the About-surface carve-out (**Decision**, bounding an existing Hypothesis without promoting it), "Nahui te propone" as the reusable AI-suggestion shape (**Decision** for the shape, **Hypothesis** for its reception), and the roadmap-honesty pattern (**Decision** for the pattern, **Hypothesis** for its reception).
- `brand-principles.md` — principle 2 gained the "never orders" scope pointer; principle 5's heading corrected forward (the ocelot is a character exploration, not Nahui's shipped identity mark); new principle 7 (adopted meaning, never evidenced meaning).

**Nothing in any of these five documents is Validated.** Every claim is **Decision**, **Hypothesis**, **Aspiration**, or explicitly **open** — Nahui has not yet had sustained real merchant/customer contact to test brand claims against, no merchant has ever been asked what the Nahui name or mark means to them, and no merchant or customer has read `landing/index.html`. That's stated honestly throughout rather than implied otherwise.

## Open questions routed to the Product Owner — tracked here so no surface resolves one by default

None of these is answered in any `/brand/` document, and none may be assumed by whichever surface reaches it first:

1. **A gender-register rule for all merchant-facing Spanish** — `tone-of-voice.md` §"Gendered register in Spanish copy" (options drafted, not picked).
2. **Who the English-language reader of any Nahui surface actually is** — `tone-of-voice.md`'s fourth-audience note; `visual-language.md`'s tagline entry.
3. **Obtaining Ana's own real words and her consent** for any quoted or attributed merchant voice — `storytelling.md` §"The About-surface carve-out."
4. **Whether "The path to what's next" is still Nahui's tagline** — `visual-language.md` §"Open, and pending a Product Owner call."

## How future agents should use this

- **`ux-designer`**: consult `tone-of-voice.md` directly when drafting merchant- or customer-facing copy; request a `brand-guardian` consultation (per that agent's stated triggers) when writing for genuinely new emotional/tonal territory.
- **`marketing`**: consult before finalizing any external-facing asset, alongside its existing Product Truth discipline. Pay particular attention to `visual-language.md` §"Name and symbol meaning" before stating anything about what the Nahui name or mark means, and to `storytelling.md`'s roadmap-honesty pattern before describing any unbuilt capability.
- **`ui-designer`**: consult `visual-language.md` (via `brand-guardian`) when a Medium-Fidelity build introduces a new visual character choice.
- **`architect`**: no routine dependency; low-frequency consultation only if naming a new domain concept risks leaking into personality-bearing merchant-facing copy.
- **Anyone drafting `company/CLAUDE.md`-level company narrative**: `character-bible.md`'s "Who Nahui is" and "Mission" sections are the canonical source; don't restate or redefine Nahui's identity elsewhere.
