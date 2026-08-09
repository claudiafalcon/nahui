# Brand

The long-term identity layer for Nahui — who Nahui is, how it speaks, and how that stays consistent across every touchpoint the company or product ever has. Owned and maintained by `brand-guardian` (`.claude/agents/brand-guardian.md`). Sits alongside `/company` (why the business exists) and `/product` (what gets built) as a third permanent knowledge area — read this before writing any merchant- or customer-facing copy, designing a new emotional moment, or producing any external-facing brand asset.

## Files

- `character-bible.md` — the single source of truth for who Nahui is: mission, personality, values, voice, emotional behavior, always/never rules, how Nahui speaks/asks/celebrates/helps/apologizes/learns/evolves, and its relationships with merchants, customers, and the company itself. If another document here seems to define Nahui's character differently, this one wins.
- `brand-principles.md` — the small number of durable rules everything else derives from, the brand equivalent of `product/00-foundation/global-principles.md`.
- `tone-of-voice.md` — concrete language guidance `ux-designer`/`marketing` consult directly when writing copy.
- `storytelling.md` — how Nahui's narrative gets told across longer-form surfaces.
- `visual-language.md` — the strategic visual identity (the ocelot exploration, mood, character-appropriate direction) sitting above `company/brand/brand-guide.md`'s tactical execution spec.

## Relationship to `company/brand/brand-guide.md`

That document stays exactly where it is — the tactical, component-level visual-execution guide `ui-designer` builds against (palette, typography, spacing, component states). It is not folded into this folder, by explicit Product Owner decision (2026-08-08), to avoid churn across its many existing cross-references in `product/02-ux/` and `product/02b-medium-fidelity/`. `visual-language.md` is the strategic layer above it; `brand-guardian` cross-references, never rewrites, the tactical guide.

## Evidence-tier discipline — every claim in `/brand/` carries exactly one tag

Four statuses, not three — this project already distinguishes evidence from deliberate choice everywhere else (`company/market-validation.md`'s Evidence tiers, `product/00-foundation/decision-log.md`'s reasoning-vs-proof distinction), and brand governance holds the same line rather than blurring it:

- **Decision** — deliberately adopted by the Product Owner (or `brand-guardian`, once delegated a specific call) as the current brand direction. Binding — it governs what gets built — but not evidence-backed, the same way a `decision-log.md` entry is adopted on reasoning, not proof. Example: "Nahui is a companion, not an AI assistant."
- **Hypothesis** — an active creative direction, not yet tested. Example: the stylized ocelot visual concept.
- **Validated** — supported by sufficient external merchant/customer evidence: a real reaction, a real interview finding, a real signal from `merchant-user-tester` or human-moderated User Validation. Never awarded for internal conviction alone, however confident. Example (not yet true of anything here): "merchants perceive Nahui as trustworthy/protective."
- **Aspiration** — a longer-term intention, not yet actionable.

**A Decision is never presented as Validated.** This is the one rule the Product Owner asked to be held most explicitly: a deliberate choice about who Nahui is stays a Decision, however confident the conviction behind it, until real external evidence earns it the Validated tag. Conflating the two is exactly the failure mode this discipline exists to prevent.

## Status

All five documents created 2026-08-08. Every claim in them today is tagged **Decision** or **Hypothesis** — nothing has been Validated yet, since Nahui has not yet had sustained real merchant/customer contact to test brand claims against. That's stated honestly throughout rather than implied otherwise.

## How future agents should use this

- **`ux-designer`**: consult `tone-of-voice.md` directly when drafting merchant- or customer-facing copy; request a `brand-guardian` consultation (per that agent's stated triggers) when writing for genuinely new emotional/tonal territory.
- **`marketing`**: consult before finalizing any external-facing asset, alongside its existing Product Truth discipline.
- **`ui-designer`**: consult `visual-language.md` (via `brand-guardian`) when a Medium-Fidelity build introduces a new visual character choice.
- **`architect`**: no routine dependency; low-frequency consultation only if naming a new domain concept risks leaking into personality-bearing merchant-facing copy.
- **Anyone drafting `company/CLAUDE.md`-level company narrative**: `character-bible.md`'s "Who Nahui is" and "Mission" sections are the canonical source; don't restate or redefine Nahui's identity elsewhere.
