# Storytelling

How Nahui's narrative gets told across longer-form surfaces — Onboarding's own arc, marketing narrative, and any future brand content that needs more than a single screen's worth of copy. `brand/tone-of-voice.md` governs sentence-level language; this document governs the shape of a story told over multiple moments.

Everything below is **Hypothesis** unless marked otherwise — this document was the least tested of `/brand`'s files, and remains the least *validated*, though it is no longer the thinnest: the 2026-10-07 pass added three real precedents set by Nahui's first public narrative surface (`landing/index.html`), each tagged individually below. `product/02-ux/onboarding.md` remains the only in-product longer-form precedent.

## The shape of Nahui's story, as currently understood — **Hypothesis**

Not a hero's-journey pitch about the product. The story is always Ana's — her business, her growth, her customers — with Nahui as a quiet presence across it, never the protagonist. The one existing precedent this project has for narrative pacing is `onboarding.md`'s own Day-0 journey: identity first, then what she sells, each step earning the right to ask for the next thing rather than front-loading everything at once (`decision-log.md` D33/D36's own sequencing rationale). That pacing discipline — earn trust before asking for more — is the closest thing to a storytelling principle this project has actually exercised in practice, and is a reasonable Hypothesis for how longer brand narrative should work too.

### The About-surface carve-out — **Decision**, added 2026-10-07

**The boundary, stated because it was about to be misapplied.** "Nahui is never the protagonist" is a rule about *whose story gets told in Nahui's own narrative surfaces* — onboarding, in-product copy, milestone moments, marketing narrative about the product. It is **not** a rule that Nahui may never speak about itself anywhere. **An "About" section on the company's own website is the one surface where the company legitimately speaks about itself**, including who built it, where it came from, and what it is today. Read without this boundary, the Hypothesis above would flag Nahui's own origin story as off-brand on the only page in existence whose explicit job is to tell it — and a future agent reviewing the next About surface, an investor page, a press note, or a founder bio would reach exactly that wrong conclusion.

**What stays binding inside the carve-out** — the carve-out is about *subject*, not about *register*, and every other rule still applies in full:
- The origin story stays honest about Ana's primacy even while describing Nahui. `landing/index.html`'s own About copy is the working precedent: "Nahui nació platicando con una vendedora de pijamas, sudaderas y calcetines... **Ella conoce su negocio de memoria:** qué se vende, a quién y en qué bazar" — the company speaks about itself, and the expertise in the sentence is still hers. That's the shape to reuse.
- "What Nahui's origin story is not" (below, Decision) applies with full force here, and most sharply here: the About surface is precisely where a rescue narrative is most tempting to write.
- Scale and certainty stay honest. "Nahui es un proyecto pequeño, hecho en México. Hoy estamos en piloto" is in-register; a founding myth, a traction claim, or an inflated origin is not.
- Nahui speaking about itself is still not Nahui *centering* itself. An About section that narrates the company's cleverness rather than the work and the merchants it came from fails the parent Hypothesis even inside the carve-out.

**Where the carve-out does not reach:** in-product copy (there is no About-surface inside the Merchant Application where Nahui narrates itself to Ana mid-task), notifications, reports, and any marketing asset that isn't specifically an about/origin surface. Those remain fully governed by the parent Hypothesis.

**Tier.** **Decision** — a deliberately adopted scope boundary on an existing claim, taken under `brand-guardian`'s ownership of `/brand/`, not a new narrative direction awaiting testing. The claim it bounds ("the story is always Ana's, Nahui never the protagonist") stays **Hypothesis**; bounding a Hypothesis does not promote it.

**Open, and pending a Product Owner call — not resolved here.** The current About copy paraphrases Ana rather than quoting her, and attributes the paraphrase to "nuestra primera entrevista con una vendedora." Whether Nahui obtains and uses **Ana's own real words, with her explicit consent and her chosen level of identification**, is an open question routed to the Product Owner. It matters to this document specifically: a real quoted merchant voice would be the single strongest possible execution of "the story is always Ana's," and it is also the one storytelling move that cannot be made unilaterally by any agent. Until she decides, the paraphrase-and-attribute shape above is what the precedent covers; nothing here authorizes attributing words to a real merchant that she did not say or agree to.

## "Nahui te propone" — the reusable shape for AI-suggestion copy — **Decision**, added 2026-10-07

**The precedent.** `landing/index.html`'s roadmap copy describes a future capability as: "Toma una foto de la prenda y **Nahui te propone** la categoría, el nombre y la descripción para agregarla a tu inventario."

**Why it's worth recording as a reusable shape rather than leaving it as one line on one page.** *Proponer* — to offer, to put forward — is a textbook execution of `tone-of-voice.md`'s "observation before instruction" (Decision) applied to an AI-generated output specifically, which is a situation that rule had never been exercised against before. The output is framed as **something offered to her, which she then accepts, edits, or discards** — not as an action taken on her behalf and announced afterward. Compare the three alternatives it was chosen over:

- *"Nahui te propone la categoría"* — an offer. Her judgment is the last step. In-register.
- *"Nahui clasifica tu prenda"* / *"Nahui lo agrega a tu inventario"* — an action taken for her. Fails `character-bible.md`'s "How Nahui helps" (Decision: reduce work, never take over decisions that are hers to make) and brushes "the merchant's expertise is never in question."
- *"Nahui detecta la categoría correcta"* — a claim of certainty about her own merchandise, from a model that has never seen her catalog. Fails "never claims certainty it doesn't have."

**The shape, generalized for reuse.** Any copy describing an AI- or automation-generated output anywhere in Nahui — a suggested category, a drafted description, a detected pattern, a proposed price, a recommended restock — states it as **something Nahui puts forward and she disposes of**. Three properties must all hold:
1. **Nahui is the subject of an offering verb** (*propone*, *sugiere*, *encontró algo*), never of a deciding or classifying verb applied to her business.
2. **Her acceptance is visibly the next step**, in the copy and in the flow — the offer is incomplete until she acts on it (the direct narrative expression of `global-principles.md`'s "never a dead end" and `character-bible.md`'s "gives her an honest way out of anything").
3. **No asserted certainty about her own goods, customers, or business** that Nahui has no basis for. Where Nahui is genuinely unsure, the copy says so plainly rather than hedging decoratively.

**Tier.** **Decision** — adopted as brand-execution guidance under `brand-guardian`'s ownership of `/brand/`, derived directly from already-adopted character-bible and tone-of-voice Decisions rather than introducing a new one. **Two things it explicitly is not:** (a) it is not a commitment that the photo-to-inventory capability it was written for will be built — that is roadmap copy and a Product/Backlog matter, entirely outside this document; (b) it is not **Validated** — whether a merchant reading "Nahui te propone" actually experiences an offer she's free to refuse, rather than a system that has already decided, is untested. **That reception claim is Hypothesis**, and it is one of the cheapest things to test the first time this pattern ships in-product.

## The roadmap-honesty pattern — **Decision** (pattern) / **Hypothesis** (reception), added 2026-10-07

**The precedent.** `landing/index.html`'s roadmap section labels each item with one of two tags — **"En piloto"** (`road.now`) and **"En camino"** (`road.next`) — under the lead line "Vamos paso a paso, y cada paso lo probamos con vendedoras reales."

**What the pattern actually is.** Future capability is shown rather than hidden, and labeled for exactly what it is: what exists today is marked as existing today, what doesn't is marked as not existing yet. Nothing unbuilt is described in the present tense, and nothing built is inflated. The lead line additionally discloses *how* the line between them moves — tested with real merchants — rather than leaving it as a vague promise of progress.

**Why this is a brand pattern and not just a marketing-page layout choice.** It is the narrative-scale version of three rules Nahui already holds at sentence scale: `character-bible.md`'s "tells the truth about what it does and doesn't know yet" and "never claims certainty it doesn't have" (both Decision), and "earned trust over assumed trust" (Decision). Roadmap copy is the single easiest place in any company's narrative to quietly claim a capability it doesn't have, and the standing temptation is to describe an unbuilt feature in the present tense because it reads better. This pattern is the standing answer to that temptation: **Nahui never describes a capability it doesn't have in the tense of one it does.** It also pairs with the About-surface carve-out above — "hoy estamos en piloto" and "En camino" are the same honesty operating on two different surfaces, and both should survive the first time there's commercial pressure to drop them.

**How to reuse it.** Any surface presenting future capability — a roadmap, a feature list, a pitch, an in-product "coming soon," release notes — carries an explicit now-vs-next distinction, in the merchant's own plain vocabulary, not platform language ("En camino," not "Roadmap," "Beta," "Q3," or "Backlog"). A future capability with no honest label does not go on the surface at all. **Two guardrails:** the pattern is not a license to list speculative features because a tag makes them safe — an "En camino" item should still be something the company genuinely intends; and an item's tag must be corrected the moment reality changes, in either direction. A stale "En camino" on something that shipped, or an "En piloto" on something that was dropped, converts the pattern from an honesty mechanism into the opposite.

**Tier.** **Decision** for the pattern itself — deliberately adopted, and a direct derivation of existing Decisions. **Hypothesis** for its reception: that a merchant reads a visible now/next split as trustworthy rather than as an unfinished product is exactly the kind of plausible-sounding claim this document is not allowed to assume. No merchant has seen this page.

## What Nahui's origin story is not — **Decision**, restated from `brand-principles.md`

Not "an AI that helps small businesses." Not "smart technology for the underserved." Any narrative framing that implies merchants needed rescuing violates `character-bible.md`'s "things Nahui never does" directly — this applies as much to a landing-page narrative as to in-app copy, and applies most sharply inside the About-surface carve-out above, where a rescue narrative is most tempting to write.

## Milestone moments — **Hypothesis**

The one deliberate moment of ceremony this project has already built is `onboarding.md`'s "Todo listo" milestone screen — justified there as "the one deliberate moment of ceremony in an otherwise frictionless flow... it happens exactly once, ever, in Ana's whole relationship with the app." That reasoning generalizes into a storytelling principle worth testing further: Nahui earns ceremony at genuine milestones (first sale, first reward cycle completed, first year), and stays quiet everywhere else. Not yet validated as a general rule beyond the one place it's already been applied.

## Open, honestly

This document is still the least validated in `/brand/` — nothing in it is **Validated**, and the three precedents added 2026-10-07 are precedents set by Nahui's own first public surface, not evidence about how anyone received it. No merchant or customer has read `landing/index.html`. It should keep growing as real storytelling moments get designed (a fuller onboarding narrative, marketing content, milestone celebrations, the first About surface anyone actually reads) — each new instance either confirms or revises the Hypotheses above, per `brand/CLAUDE.md`'s evidence-tier discipline.

Two questions this document needs answered and cannot answer itself, both routed to the Product Owner and deliberately left open here: **obtaining Ana's own real words and her consent** (see the About-surface carve-out above) and **who the English-language reader of any Nahui narrative surface actually is** (see `brand/tone-of-voice.md`'s fourth-audience note, and `brand/visual-language.md`'s tagline entry). Neither is resolved in any `/brand/` document, and neither should be assumed by whichever surface reaches it first.
