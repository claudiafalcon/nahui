---
name: visual-craft-quality
description: Reusable, artifact-agnostic criteria for evaluating and improving visual craft — hierarchy, density, typography, composition, motion, color/depth, and whole-artifact visual rhythm — across presentations, videos, product UI, diagrams, and marketing assets. Load when building or reviewing any visual artifact's craft quality, not just its content/spec compliance.
---

# Visual Craft Quality

This Skill improves visual **judgment**, not visual **style**. It doesn't define what Nahui should look like — `company/brand/brand-guide.md` and `brand/visual-language.md` already own that, and this Skill defers to them, never overrides them. What this Skill gives `ui-designer` (building) and `ux-critic` (reviewing) is a shared, checkable vocabulary for *why* a composition works or doesn't, so "this feels off" becomes a specific, addressable finding instead of a vague reaction.

**Never force a fixed aesthetic.** A dense data dashboard and a one-line hero slide can both be excellent — judge each artifact against what it's trying to do, not against a single template.

*Sections 1 and 4 below read as near-universal rules — §8's artifact-awareness section is what keeps them from being applied too literally to an artifact type they don't fit (a dense product-UI dashboard, in particular). Read §8 before treating either as an absolute.*

## 1. Visual hierarchy

- Every slide or video beat has one unmistakable focal point. If two elements compete for first attention, that's a finding, not a style choice.
- The intended reading order is explicit — achieved through size, color, position, or motion, not left to chance.
- Secondary elements (captions, labels, chrome) never visually outweigh the primary message they're supporting.

**Beyond the binary test, rate how strong the hierarchy actually is.** "There is a focal point" and "the focal point is visually dominant enough" are different findings — a frame can pass the binary test above and still read as nearly flat. Once a focal point is confirmed to exist, name where it sits:

- **Strong** — the focal point is unmistakably dominant; every secondary element is clearly, visibly subordinate.
- **Moderate** — a focal point exists but a secondary element is close enough in weight to create some competition.
- **Flat** — a focal point is technically identifiable, but nothing about its scale, contrast, saturation, isolation, or motion actually separates it from what's around it.

Base the rating on relative differences in **scale, contrast, saturation, isolation, motion, and overall visual weight** — not a score, a named reason. State which of these (one or more) is doing the separating, or, for a Flat rating, which of these is missing. No numerical scoring — the level and its one-sentence reason is the finding.

## 2. Density and negative space

- Negative space earns its place: it creates focus, separates unrelated groups, sets rhythm, or gives a pause before the next beat. "Because there was nothing else to put there" is not a reason.
- Flag both failure directions — a crowded layout competing for attention, and empty space with no job to do (dead space that reads as unfinished or glitched, not as breathing room).
- Never judge by an arbitrary whitespace percentage. Judge by whether the space is doing something.

**The reviewable test: ask what specific job the empty space is performing, and name it in one short sentence.** Valid answers include directing attention, separating ideas, creating anticipation, providing breathing rhythm, emphasizing scale, supporting motion, and framing evidence. If you can't name the job in one sentence, the space is purposeless — that's the finding, stated as plainly as that. No numerical threshold of any kind (not even as a rough guide) — a small purposeless gap is still a finding, and a large purposeful one is still fine.

## 3. Typography

- No more than three typographic levels active at once (e.g., display / body / caption) — more than that and hierarchy collapses regardless of how good any single choice looks in isolation.
- Readability is checked at the artifact's real viewing condition: mobile-screen distance for video, presentation-room distance for slides — not at 100% zoom on a design tool.
- Follow Nahui's existing type system (`brand-guide.md`'s Fredoka/Inter pairing and scale) unless a specific, stated exception is justified — never a silent substitution.

## 4. Composition

- One core idea per slide or beat. If a slide is doing two jobs, that's a finding.
- Screenshots are cropped and scaled around the specific evidence they exist to show, never just placed at their native size/crop because that was convenient.
- Watch for repeated composition across an artifact — the same layout template used three-plus times in a row reads as "the same slide" even when the content differs, and is worth flagging on its own. **Before raising this finding, name which kind of repetition it is** — deliberate narrative repetition (the same treatment reused on purpose because the content itself is repeating an action or idea — reinforces understanding, not a defect) versus accidental template repetition (the same layout reused across beats with no shared narrative reason — this is what actually weakens visual rhythm). State which one you're looking at before flagging; only the second kind is the finding.
- Every visual element has to justify its presence — a decorative shape or icon with no hierarchy/rhythm/evidence job is a candidate for removal, not automatically acceptable because it looks nice. **Exception, not a judgment call for this Skill:** a brand-character or illustration-style element (a mascot, an illustration motif not yet covered by `brand/visual-language.md`) doesn't get flagged for removal on craft grounds alone — that decision routes through the existing `ui-designer`/`brand-guardian` consultation trigger, since it's a brand-identity call, not a composition one.

## 5. Motion

- Motion earns its place by directing attention, explaining a state change, or reinforcing pacing — the same "justify its existence" bar as static elements.
- No decorative movement — a bounce, pulse, or drift with no informational job is a finding, not a polish nice-to-have.
- Social/ad video must remain understandable with sound off — this is a hard check, not a nice-to-have, since muted-by-default viewing is the realistic default. Nahui already has a real precedent for a related failure, a contrast-legibility Major (`.claimCaption` at 3.02:1 against the 4.5:1 floor, `product/02c-high-fidelity-prototype/docs/passes/slice-8-paid-receipt-qr.md`) — a different artifact than video, but the same underlying mistake this Skill's §7 perceptual checks exist to catch earlier. (The karaoke/word-highlight caption pattern itself, `company/merchant-validation-campaign-b-storyboard.md` SB2-9, is a deliberate *solution* to sound-off comprehension, not an example of the defect — don't confuse the two.)

**Reviewing motion from still frames** (a realistic, common condition — most reviewers can't play the actual render) requires its own discipline:
- Separate what the frame actually shows from what you're inferring about motion. State both, don't blend them into one claim.
- Any finding that depends on duration, easing, or how long a state is held (a hold that reads as too static, a transition that might be too abrupt) is **provisional** until checked against the real rendered artifact — say so explicitly rather than reporting it as confirmed.
- Don't treat a single mid-transition frame (a cross-fade caught at low opacity, a mid-animation value) as a confirmed defect on its own — it may simply be a normal instant inside a transition that reads fine in motion. Sample a few frames across the same window before concluding a transition itself is the problem, and still mark the conclusion provisional if you can't verify actual playback.

## 6. Color and depth

- Backgrounds, gradients, flat fills, texture, shadow, and lighting are each a deliberate hierarchy/mood choice, not a default. Ask what job the choice is doing before accepting it.
- Nahui's existing brand colors (`brand-guide.md`'s Coral AA+, Obsidian, Balanced, etc.) stay authoritative — this Skill never introduces or mandates a separate palette.
- No invented "mandatory" palette rules beyond what the brand guide already sets — this Skill governs judgment about how those colors get used, not what they are.

## 7. Perceptual quality checks — run every review through these

- **3-second recall test.** After a brief look, can the core message be stated back? If not, hierarchy (§1) or density (§2) likely failed.
- **Thumbnail/small-scale hierarchy test.** Shrink the artifact drastically (as it would appear in a feed, a slide sorter, a gallery). Does the focal point still read?
- **Blur/squint focal-point test.** Blur or squint at the artifact — the focal point should still be identifiable by shape/contrast alone, independent of legible text.
- **Sound-off comprehension test** (video) — does the core claim survive with audio muted, via on-screen text/motion alone?
- **Presentation-distance readability test** (slides) — is every element legible from the back of a room, not just on a laptop screen?

A finding that fails one of these tests should name *which* test it failed — that's what makes the finding actionable rather than a feeling. Not every test applies to every artifact type equally — sound-off comprehension matters most for social video, presentation-distance readability only applies to slides, 3-second recall and thumbnail hierarchy matter most where an artifact is seen briefly or small (video, marketing creative) and less where it's used at length (product UI, documentation). Weight accordingly per §8, don't apply all five with equal force everywhere.

## 8. Artifact awareness — the same rule doesn't apply the same way everywhere

Different artifact types call for different visual strategies. Before applying any rule above, identify which of these the artifact actually is, since the right answer differs:

- **Product UI** — hierarchy serves task completion; density tolerance is higher than marketing material, since a returning user values information density over drama.
- **Presentation decks** — one idea per slide is close to a hard rule; negative space usually needs to be generous, since a room full of people reads a slide for seconds, not minutes.
- **Short-form social video** — sound-off comprehension and the 3-second recall test dominate; motion is doing more work than in any other artifact type here.
- **Storyboards** — clarity of intent matters more than final polish; the craft question is "does this communicate the plan," not "is this beautiful yet."
- **Marketing creatives** (static ads, campaign images) — thumbnail/small-scale hierarchy dominates, since most viewers see these small and scrolling.
- **Documentation** (diagrams, technical illustrations) — density tolerance is high and expected; the craft question is legibility and correct information hierarchy, not emotional impact.

Applying a presentation deck's "generous negative space" instinct to a dense product-UI screen, or a product UI's information density to a social ad, is itself a finding — name the mismatch explicitly rather than silently judging every artifact by the same yardstick.

## 9. Artifact-level visual rhythm — the sequence as a whole, not any single frame

**This is a separate evaluation, not a rerun of §1-§7 at a larger scale.** §1-§7 judge individual frames/beats/slides; §4's repetition rule catches local adjacency (three-plus consecutive beats sharing one template). None of that guarantees the artifact reads well end-to-end — a sequence of individually-fine, non-locally-repetitive compositions can still feel monotonous across its full runtime, if the *relationship* between beats never varies. Two composition families strictly alternating every other beat never trips §4's "3+ in a row" rule, but can still read as entirely predictable across a full sequence. That's the gap this section exists to catch.

**Run this as a second pass, after §1-§7 have been applied to every individual frame/beat/slide.** Step back and evaluate the artifact as one continuous visual experience:

- Does it alternate between different composition families, or does it spend too long inside the same visual structure?
- Does visual energy (density, motion, saturation, focal contrast) rise and fall across the sequence, or sit at one constant level throughout?
- Are there intentional moments of surprise, compression, expansion, or pause — or does every beat carry roughly the same weight?
- Does each major narrative transition (a new idea, a tonal shift, an emotional beat) get a corresponding visual transition, or does the composition stay identical while the content moves on underneath it?
- Could a viewer predict the next layout before it appears, based on the pattern established so far?
- Are emotionally important moments visually distinguished from purely informational ones, or do they share the same treatment?

**The goal is not maximum variation.** Forcing needless novelty into every beat is its own failure mode, and a deliberate run of similar beats is sometimes exactly right (the same narrative job, told the same way, on purpose — see §4's deliberate-vs-accidental distinction, which this section inherits). The goal is avoiding monotony while preserving narrative clarity: an unbroken visual pattern with no relationship to what's actually changing in the story is the defect, not similarity on its own.

## How this Skill is used

- **`ui-designer`** loads this while building, as a self-check before calling something done — the same way it already checks Figma clone discipline or Foundation fit.
- **`ux-critic`** loads this as part of its existing visual-consistency check for High-Fidelity artifacts (already a stated part of its mandate) — this Skill sharpens that check with concrete, testable criteria instead of leaving "visual quality" as an unstructured judgment call.
- Neither agent's existing authority changes — this Skill doesn't create a new reviewer or a new approval gate. It's shared vocabulary and a shared checklist, the same relationship `figma-review-methodology` and `severity-classification` already have to the agents that load them.
