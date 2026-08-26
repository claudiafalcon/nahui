# Gamma Rebuild Spec — Nahui Demo Day Pitch (TI-4041)

**Source:** `evidence/2026-08-22-demo-day/Nahui - Pitch Demo Day.pptx` (10 slides, text + speaker notes read directly from the file's XML)
**For:** paste/feed into Gamma to generate candidate layouts. Content and speaker-note claims are locked to what's already approved and spoken; this spec only changes composition, hierarchy, and asset treatment.

## Addendum (2026-08-25) — whole-deck rhythm findings, `visual-craft-quality` v1.1 §9

The original spec below was written before §9 (Artifact-Level Visual Rhythm) existed. A validation pass ran §9 against the actual current deck (rendered fresh, `slide-render-01.jpg` through `-10.jpg`) specifically to test whether the section generalizes beyond video — it did, and it found the same underlying pattern the spec below already targets, but at the whole-sequence level, not just locally. Feed these into Gamma alongside the per-slide sections, they change what "done" looks like for slides 2, 3-5, and 7-8 specifically.

**One real, independent defect, not a rhythm finding — fix regardless of anything else:** the current Slide 2 has a real layout collision. The headline text ("...venta.") wraps down into the same vertical band the screenshot occupies, and there's a stray thin white sliver crossing the very top edge of the otherwise full-bleed dark slide (looks like an export/crop artifact). This is the same CTA/heading-collision defect class this project already tracks — fix it in the rebuild, it's audience-facing.

**Whole-deck findings:**
- **Slides 3-4-5 are one unbroken same-family run** (screenshot + headline, two-column split — only the background color toggles) sitting at the flattest, lowest-energy stretch of the whole deck, right where the sequence should be building toward slide 6's payoff, not sitting level. The individual-slide fixes already specified below (light/literal → tinted/zoomed → dark/hero-number) address the *local* version of this; make sure the rebuild actually delivers a felt rise in energy across the three, not just three different backgrounds.
- **Slide 5 ("Y queda guardada," the resolution of the whole 3-4-5 arc) isn't visually distinguished as the payoff moment** — it currently reads at the same visual weight as slide 3, a neutral establishing beat. This is the same class of problem just fixed on Campaign B's own receipt beat (Shot 5) — that fix gave the payoff moment something the surrounding beats didn't have (a color/saturation shift marking "this is the moment it worked"), without overselling into confetti/fanfare. Apply the same logic here: slide 5's hero-number/dark-field treatment (already specified below) needs enough visual distinction from slide 3 that a viewer feels the arc land, not just observes a fourth slide.
- **Slides 7-8's light→dark alternation is the deck's only tool for making two same-family slides feel different, and it gets reused a second time with no new mechanic** — by slide 8, a viewer has already learned "background inverts = new content" from slides 3-4-5, so the trick reads as familiar rather than fresh. Not a reason to change slides 7-8's own already-good compositions (keep them, per the original spec below) — but don't rely on background-toggle alone to sell freshness a second time; whatever transition/pacing Gamma builds between slide 6 and slide 7 should do some of that work instead (a genuine beat of pause or a different kind of transition into the diagram trio, not just another color flip).
- **2→3 and 7→8 are the two weakest narrative-to-visual transitions in the deck** — a real tonal/topic shift happens at both points (problem statement → "here's what exists today"; "who decides" → "how the validation loop works") but the visual treatment barely marks either as a new idea starting. Worth a genuine transition cue at both, not just a slide boundary.

**Net effect wanted:** by the end of the rebuild, a viewer should not be able to predict slide 8's treatment just from having seen slides 3-5 — that predictability is the actual, validated finding here, not a hypothesis.

## Findings from reading the source file, before the spec itself

- Every content slide (2-10) is a single full-bleed picture placed on the same `slideLayout7` master — the repetition problem isn't only "3 diagrams in a row," it's structural across the whole deck.
- Slides 3/4/5 (the three product screenshots) are literally the same portrait phone screenshot lineage (`slide-home.png`, `slide-selling.png`, `slide-receipt.png`) placed at native crop, each with a large dead gray/cream zone below the real UI content (the phone screenshots are 1290×2796 portrait but only the top ~35-45% has content) — this is the exact case study named in the brief.
- Slides 7/8/9 (`equipo-v2.png`, `ciclo-v2.png`, `timeline-v2.png`) already got a v2 pass this session and already alternate light/light/dark and grid/radial/list — they're in noticeably better shape than the brief's framing suggested; the spec below mostly protects that gain rather than re-solving it.
- Slide 2's current image (`image1.png`) is an old, unstyled dev screenshot with visible browser chrome and grayed-out disabled buttons — it doesn't match the finished product's visual bar shown two slides later, and it isn't actually evidence of the claim on that slide (unpredictable customer flow).
- Slide 10's current image is the full "Hoy" screen with bottom nav bar, most of it empty gray space, used only as a backdrop for "Gracias." — a textbook case of dead space with no job.

---

## Throughline

Two principles from `visual-craft-quality` drove essentially every change here, over everything else in the skill:

1. **§4 Composition — "avoid repeating the same composition."** This is the deck's dominant, recurring failure. It's not confined to the diagram trio (which already got a v2 fix) — it's structural: every slide is "one full-bleed picture on a plain background," so even where content differs, the eye reads slide-after-slide sameness. The fix isn't new images, it's varying crop strategy, framing, and background treatment slide-to-slide so slides 3/4/5 (all the same underlying screenshot lineage) don't read as one slide repeated three times.
2. **§2 Density and negative space, specifically the "dead space with no job" failure direction.** Several current slides (3, 5, 10 above all) carry large blank zones that exist only because a portrait phone screenshot was placed at native size on a 16:9 canvas, not because that space is doing compositional work. Every crop below is deliberately tightened to the actual evidence, with negative space reintroduced on purpose (as breathing room around a hero number, not as leftover screenshot chrome).

A secondary, narrower thread: §1's "one unmistakable focal point" rule is why slide 6 (funnel) and slide 2 (problem) both get a single hero element promoted above their current multi-element/mismatched-asset treatment.

---

### Slide 1 — Portada

- **Objective:** Establish the promise in one line before anything else competes for attention.
- **Audience reaction:** "This person knows exactly what she built and why it matters in one sentence."
- **Core message:** Nahui registers a sale in under 3 seconds, without losing the next customer.
- **Dominant visual:** The wordmark "Nahui," typographically — no image needed or available that would outrank it.
- **Visual hierarchy:** 1) "Nahui" (Fredoka, display size) → 2) the promise sentence (Inter, body-large, one level down) → 3) byline "Claudia Falcón · Demo Day · TI-4041" (Inter, caption, smallest, bottom edge).
- **Suggested composition:** Full-bleed Balanced (`#F4F4F4`) or warm-cream background, generous margin on all sides, wordmark left-aligned or centered with the promise sentence directly beneath it — nothing else on the canvas. This is the one slide where negative space should be at its most generous in the whole deck, since it's the room's first three seconds of attention.
- **Required evidence:** None — this slide is a claim, not evidence; evidence starts at slide 3.
- **What should be removed:** Nothing currently competes here — this slide is already close to right; the note is to resist the temptation to add a screenshot "for interest."
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 2 — El problema

- **Objective:** Make Ana's specific friction (registration time competes with the next customer) felt, not just stated.
- **Audience reaction:** Recognition — "of course, that's how a real line of customers works."
- **Core message:** In a bazaar, every second registering a sale is a second not spent on the next customer, and the next customer always wins.
- **Dominant visual:** The headline itself, set large — this is a typography-led slide, not an image-led one.
- **Visual hierarchy:** 1) Headline (largest weight in the deck outside the title slide) → 2) one supporting line of context (Ana-specific detail) → nothing else.
- **Suggested composition:** Solid or near-solid color field (Tezontle Dark `#A72C2C` or Obsidian `#2D2D2D`, white text) with the headline set large and left-aligned, generous margin, no photographic element. A single small clock/motion-line glyph *only if* it reads clearly at presentation distance and doesn't add a second focal point — otherwise omit it entirely; pure type is safer than a weak icon.
- **Required evidence:** None available that qualifies. There is no clean photo/video asset of Ana's actual bazaar customer flow, and the current embedded image (`ppt/media/image1.png`, an unstyled dev-tool screenshot with visible browser chrome and grayed-out disabled buttons) is not evidence of this specific claim — it's an old build artifact. State this as a real gap rather than dressing it up: this slide should carry its argument on language and hierarchy alone, not a borrowed screenshot.
- **What should be removed:** The current embedded screenshot (`image1.png`) entirely — it's off-brand (browser chrome, disabled gray buttons, an earlier unstyled build) relative to every other slide's finished-product bar, and it isn't evidence for the claim being made.
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 3 — Así se ve hoy

- **Objective:** Establish that what follows is the real, working prototype — not a mockup — before showing the flow.
- **Audience reaction:** "This is a real product, not slides pretending to be one."
- **Core message:** This is a real, functional prototype, tested in person with a real vendor.
- **Dominant visual:** A tightly cropped screenshot of the cold-start "Venta Rápida" screen (Playeras/Blusas categories, $0 · 0 ventas state) — cropped to only the content-bearing top ~40% of the real screenshot, not the native portrait frame.
- **Visual hierarchy:** 1) The cropped screenshot (framed as a device card, not full-bleed) → 2) headline "Así se ve hoy" → 3) supporting line "Prototipo real, funcional, probado con una vendedora real."
- **Suggested composition:** Warm-cream/Balanced background (matches the app's own chrome, the most literal of the three screenshot slides). Screenshot placed as a framed card occupying roughly the right half or a centered card with real drop shadow, headline and supporting line on the opposite side or above — not full-bleed. This establishes the "literal, unadorned" treatment that slides 4 and 5 will each deliberately break from.
- **Required evidence:** `evidence/2026-08-22-demo-day/pitch-assets/slide-home.png` — crop to the top content zone only (categories + header bar), discard the blank lower two-thirds.
- **What should be removed:** The native full-height crop and the plain full-bleed placement — replace with the tight crop + framed-card treatment above.
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 4 — Menos de 3 segundos

- **Objective:** Show the actual one-tap mechanic, not just claim it.
- **Audience reaction:** "That's genuinely fast — I can see the total building itself."
- **Core message:** One tap per product; the total assembles itself in the moment of the sale.
- **Dominant visual:** A zoomed, callout-style crop of the "Venta actual: 2 artículos · $540" state with the ×1 quantity badges — not the same wide framed-card treatment as slide 3.
- **Visual hierarchy:** 1) The zoomed total/badge region (largest element, tightly cropped) → 2) a single motion/tap-indicator cue on the tapped card → 3) headline + supporting line, demoted to a corner or lower band.
- **Suggested composition:** Deliberately different from slide 3 to break the "same slide" read: a bolder Coral-tinted split panel (screenshot crop on one side against a solid Coral AA+ or Blush field on the other, not the plain cream background repeated) with the zoomed crop given a subtle pulse/highlight motion on the tapped product card — motion here earns its place, it's demonstrating the one-tap mechanic itself, not decoration.
- **Required evidence:** `evidence/2026-08-22-demo-day/pitch-assets/slide-selling.png` — crop tight to the "Venta actual" total + the two category cards with ×1 badges, discard the blank lower area entirely.
- **What should be removed:** Native full-height screenshot crop; the visual should not repeat slide 3's plain-cream, wide-framed-card composition.
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 5 — Y queda guardada

- **Objective:** Land the resolution of the flow — the sale is safely recorded — as a clean, confident beat.
- **Audience reaction:** Relief/satisfaction — "done, and it's not going anywhere."
- **Core message:** The sale is saved for good, even if the next customer arrives without warning.
- **Dominant visual:** The `$540` total and "Venta finalizada ✓" — set as a hero number, not framed inside a device screenshot.
- **Visual hierarchy:** 1) `$540` (largest single element in the slide, and one of the largest numerals in the whole deck) → 2) "Venta finalizada ✓" directly above it → 3) headline/supporting line, smallest, positioned so it doesn't compete with the number.
- **Suggested composition:** Third distinct treatment in the trio — solid Obsidian or Tezontle Dark background (breaks the cream-cream-tinted rhythm of slides 3 and 4, giving this "success" beat real visual weight), with the receipt's core numeral extracted and set oversized in white/Coral against the dark field — no phone-frame chrome at all. This is the most stripped-down of the three, matching that it's the resolution beat.
- **Required evidence:** `evidence/2026-08-22-demo-day/pitch-assets/slide-receipt.png` — extract just the "Venta finalizada ✓ / TOTAL / $540 / Ropa Aurora" block; discard the large surrounding blank cream field entirely rather than placing the screenshot as-is.
- **What should be removed:** The full receipt screenshot at native crop and its large surrounding blank space — extract only the numeral block described above.
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 6 — La campaña real

- **Objective:** Deliver the deck's hardest, most honest beat — reach worked, real adoption didn't yet — without burying it under competing chart elements.
- **Audience reaction:** Respect for the honesty, not defensiveness — "she's not hiding the bad number."
- **Core message:** Reach worked and was cheap; real adoption of the demo did not happen yet, and that was confirmed mid-campaign, not assumed from day one.
- **Dominant visual:** The `0.34%` figure (or its "2 / 583" framing) as a single oversized hero number — not the three stat cards + two chart images all competing at once, as in the current build.
- **Visual hierarchy:** 1) `0.34%` / "2 de 583" (largest, centered or left-anchored) → 2) the two supporting context numbers (583 visitantes, $569.24/731 resultados de Meta) demoted to small caption-weight stat chips below/beside → 3) the traffic chart and events breakdown as small supporting evidence panels, not full-width → 4) the closing line "El alcance funciona. La adopción real todavía no..." as the final read, bottom of the slide.
- **Suggested composition:** Keep the current dark background (matches the Vercel dashboard's own dark chrome, so the evidence panels don't need re-skinning). One large focal number dominates the upper two-thirds; the traffic chart (`vercel1-chart.png`) and events table (`vercel2-events.png`) sit as two small, tightly cropped side-by-side evidence cards beneath it — both are already reasonably tight crops, keep them that size, don't stretch them to fill more space than the data needs.
- **Required evidence:** `evidence/2026-08-22-demo-day/pitch-assets/vercel1-chart.png` (583 visitors / 612 page views / 96% bounce, Aug 15-22 traffic curve peaking Aug 19) and `evidence/2026-08-22-demo-day/pitch-assets/vercel2-events.png` (event-by-event funnel: `demo_onboarding_completed` 2/2, `demo_otp_completed` 2/2, `demo_pass_through_reached` 2/4, `demo_questionnaire_cta_click` 2/2, `demo_sale_completed` 1/2). Meta spend/reach figures ($569.24 spend, 731 results) come from the existing speaker notes, not a separate visual asset — keep them as small text, not a third chart.
- **What should be removed:** The current flat three-stat-card row (583 / 2 of 583 / 0.34%) presented at equal visual weight — collapse to one hero number with the other two demoted, per the hierarchy above.
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 7 — Equipo

- **Objective:** Show Nahui is built by a governed multi-agent team, each with a scoped role, not one generalist AI.
- **Audience reaction:** "This is a real governance structure, not a gimmick."
- **Core message:** Each agent has exactly one function and its own authority limit; Main coordinates and persists, it never decides for the others.
- **Dominant visual:** Already correct — the org-tree diagram (`equipo-v2.png`), Main at top, two rows of five scoped agent roles beneath, `merchant-user-tester` visually distinguished (coral border/fill) as the one with no file access.
- **Visual hierarchy:** Already correct in the existing asset: label → headline → Main node → two agent rows → footer line. No change needed.
- **Suggested composition:** Keep as-is (light `#FAF7F2`-family background, bordered box grid) — this is the anchor light composition against which slide 8's dark radial and slide 9's light list both read as deliberate variation, not accident. One legibility check only: confirm the small role-caption text inside each box (currently quite small relative to the box) reads at back-of-room presentation distance; if not, increase caption size slightly without adding a fourth typographic level.
- **Required evidence:** `evidence/2026-08-22-demo-day/pitch-assets/equipo-v2.png` (already embedded in the current deck as `image7.png`, confirmed by hash match).
- **What should be removed:** Nothing — this asset already resolved the "same box style" problem for this slide's own composition; don't reintroduce a generic bordered-card template here that would make it look like slide 9 again.
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 8 — El ciclo de validación

- **Objective:** Show that nothing closes without being checked against the real product.
- **Audience reaction:** "Every correction gets re-verified, nothing is taken on faith."
- **Core message:** Each correction is re-validated against the real product before being considered closed — trust is never assumed, only confirmed.
- **Dominant visual:** Already correct — the radial diagram (`ciclo-v2.png`), "Hallazgo real" (Coral-filled) at the center, four connected nodes (Diseño/especificación, Validación, Revisión, Corrección, Construcción) around it.
- **Visual hierarchy:** Already correct: label → headline → center node (highest-contrast element on the slide) → four satellite nodes → footer line.
- **Suggested composition:** Keep as-is — the dark Obsidian background is the deliberate middle beat of the light/dark/light rhythm across slides 7-9, and it's also the strongest color-rhythm break in the whole deck, which is doing real work against the otherwise cream-dominant deck. Don't lighten it to "match" the other diagram slides — that would undo the one place composition variation is already working well.
- **Required evidence:** `evidence/2026-08-22-demo-day/pitch-assets/ciclo-v2.png` (already embedded in the current deck as `image8.png`, confirmed by hash match).
- **What should be removed:** Nothing.
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 9 — Timeline (Causa y efecto)

- **Objective:** Show the project's real trajectory as cause-and-effect, not a pre-planned deliverables list.
- **Audience reaction:** "This wasn't a straight line, it was earned through real problems."
- **Core message:** Each timeline point exists because it solved a real problem that appeared along the way, not because it was planned from the start.
- **Dominant visual:** Already correct — the vertical dot-and-line timeline (`timeline-v2.png`), left-column headline/intro paragraph, right-column chronological list (Fundación congelada → Nacen los agentes → Bitácora + Recuperación → Campaña de Meta cerrada → Piloto Concierge/DM → Regla escrita, no lograda aún → Autoridad rechazada correctamente...).
- **Visual hierarchy:** Already correct: label → headline → intro paragraph (left) → chronological dot-list (right), each entry bold title + italic one-line consequence.
- **Suggested composition:** Keep as-is — light background, two-column layout, is the third beat completing the light/dark/light rhythm with slides 7 and 8. One check: verify the full list doesn't get cut off at the bottom of the canvas the way the current asset's crop suggests it might (the last visible entry, "Autoridad rechazada correctamente," appears right at the frame edge) — confirm all timeline entries are fully visible within the slide bounds when rebuilt in Gamma, not truncated.
- **Required evidence:** `evidence/2026-08-22-demo-day/pitch-assets/timeline-v2.png` (already embedded in the current deck as `image9.png`, confirmed by hash match).
- **What should be removed:** Nothing structurally — only fix the potential bottom-edge truncation noted above.
- **Presenter notes:** Unchanged, reuse existing.

---

### Slide 10 — Cierre

- **Objective:** Close on an honest, confident note — real progress, real gaps acknowledged, nothing oversold.
- **Audience reaction:** Trust — "she's telling me exactly where this stands, good and unresolved both."
- **Core message:** This is Nahui today: a real, working, tested prototype, with a real campaign that taught us reach isn't the problem, adoption is — and a governed agent team that checks everything before calling it done.
- **Dominant visual:** The word "Gracias." set large, typographically — no product screenshot needed for a thank-you beat.
- **Visual hierarchy:** 1) "Gracias." (largest element) → 2) nothing else needed on-canvas; per the notes, demo/repo links live in the companion document and don't need to be repeated here.
- **Suggested composition:** Solid brand-color field (Coral AA+ or Obsidian, matching slide 2's treatment to bookend the deck) with "Gracias." centered, generous negative space on all sides — deliberately the emptiest slide in the deck by design, since it's the closing beat and needs nothing competing with it.
- **Required evidence:** None needed.
- **What should be removed:** The current full "Hoy" screen screenshot with visible bottom nav bar and a large dead gray field behind the text — this is the clearest instance in the whole deck of negative space with no job (§2); remove entirely and replace with the solid-field typographic treatment above.
- **Presenter notes:** Unchanged, reuse existing.

---

## Summary of composition rhythm across the rebuilt deck

Type-led (1) → Type-led, dark field (2) → Screenshot, light/literal (3) → Screenshot, tinted/zoomed (4) → Screenshot, dark/hero-number (5) → Data-led, dark, single hero stat (6) → Diagram, light/grid (7) → Diagram, dark/radial (8) → Diagram, light/list (9) → Type-led, dark field, minimal (10). No composition type repeats back-to-back anywhere in the sequence, and the two screenshot-adjacent runs (3-5, 6) and diagram run (7-9) each carry internal light/tint/dark variation rather than one shared box-and-background template.

## File paths referenced

- Source deck: `evidence/2026-08-22-demo-day/Nahui - Pitch Demo Day.pptx`
- Screenshot evidence: `evidence/2026-08-22-demo-day/pitch-assets/slide-home.png`, `slide-selling.png`, `slide-receipt.png`
- Metrics evidence: `evidence/2026-08-22-demo-day/pitch-assets/vercel1-chart.png`, `vercel2-events.png`
- Diagram evidence (already v2, already embedded): `evidence/2026-08-22-demo-day/pitch-assets/equipo-v2.png`, `ciclo-v2.png`, `timeline-v2.png`
- Skill loaded: `.claude/skills/visual-craft-quality/SKILL.md`
- Brand tokens referenced: `company/brand/brand-guide.md` (Coral AA+ `#C13F26`, Tezontle Dark `#A72C2C`, Obsidian `#2D2D2D`, Balanced `#F4F4F4`, Fredoka/Inter pairing)
