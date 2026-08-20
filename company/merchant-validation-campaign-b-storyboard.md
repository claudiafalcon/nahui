# Campaign B (Venta rápida) — Storyboard & Draft Assembly

Storyboard and technical assembly for the video script already Approved-pending-sign-off in `company/merchant-validation-campaign-videos.md` (Campaign B, §B.0–B.2). This document does not restate that script's copy or reasoning — it references it by beat/shot number throughout. Read that document first.

**Owner of this pass:** `ui-designer`, per Main's dispatch — visual storytelling (Part 1) and the actual technical assembly of a first-draft video (Part 2), end to end.

---

## What this draft is, and isn't — read this before watching the video

This is **not** a screen recording. There is no live-capture or video-editing tool in this environment, so this draft uses a fundamentally different, deliberately disclosed method:

- **Every visual is a real, static screenshot** captured from the actual running prototype (`product/02c-high-fidelity-prototype/`, plain `npm run dev`, not the demo-campaign build — see §5) via Playwright, with real `AppState` seeded/typed through genuine interaction. No mockups, no invented copy, no screen that doesn't exist in the live app.
- **There is no real tap or finger motion anywhere in this draft.** Every "tap" the script describes is represented by a hard cut from the before-state screenshot to the after-state screenshot. Nothing animates, presses, or highlights on tap.
- **There is no live scrolling.** Where a screen scrolls in real use (e.g. the product grid, a long form), this draft shows only the static portion that was scrolled to, never the scroll motion itself.
- **There are no smooth screen transitions.** Every cut between shots is a hard cut (see §4 for why, and the one exception considered).
- **The voice is synthesized, not a real human recording** — macOS `say -v Paulina` (Spanish, Mexico), not a live actor.
- **The "fast-forwarded" onboarding montage (Beat 2, shots 1–2) is a sequence of discrete still frames held for fractions of a second, not an actual sped-up recording.** It reads as a rapid slideshow, not smooth fast motion. This is a real, felt difference from what a genuine sped-up screen recording would look like, and is the single largest gap between this draft and a real capture.
- **Every screenshot's on-screen data (product names, prices, quantities) is real prototype state**, produced by really typing/selecting through the live app — not hardcoded images or copy pasted in after the fact.

**My own judgment on whether the final draft needs an on-screen "prototipo, video ilustrativo"-style disclosure to viewers:** the script already carries a full, explicit Product Truth disclosure at Beat 4 ("Este es un prototipo interactivo…"), but that disclosure arrives at ~0:21–0:25, after roughly twenty seconds of footage a first-time viewer could otherwise read as a real screen recording of a finished, shipping app. Given that this specific draft's fidelity gap (no real taps, no real motion, synthesized voice) is larger than what the underlying script's own honesty framework was written to disclose (the script's disclosure is about the *product* being a prototype, not about the *video* being a non-recording), I believe there's a real, distinct question — not the same one the script already answers — about whether viewers should also be told, up front, that they are looking at a sequence of stills rather than a recording. This is a brand/Product-Truth judgment call, not a production-mechanics one, so I am not deciding it myself: **flagged explicitly for `brand-guardian`'s call**, per the task's own instruction. My own leaning, stated plainly rather than hidden: yes, some minimal signal this early (even a single quiet caption in the first 1–2 seconds, e.g. "prototipo — capturas reales") would cost very little scroll-stopping power and would close a gap the current Beat 4 disclosure doesn't actually close. But that's a recommendation, not a decision.

---

## 1. Judgment calls this storyboard depends on, stated up front

**Judgment call SB-1 — the montage (Judgment Call B1 in the source script) has to pass through two real screens the script's own shot table never cites, and I've included both rather than skip them.** The script's Beat 2 shot table goes directly from shot 1 (`onboarding.md §3.3`, tapping "Empezar gratis") to shot 2 (`onboarding.md §3.5b`, "Define lo que vendes"). But the actual, Approved onboarding flow (`onboarding.md` §2.2b) requires a **business-identity capture step** ("Tu negocio" — `onboarding.md` §3.9) between those two, reached the instant the Business/capabilities write succeeds, before "Define lo que vendes" is even reachable — this is a real, required screen, not optional, for either real Onboarding path. Skipping it would either misrepresent the flow or force an impossible jump. I resolved this the same way Judgment Call B1 already resolved its own, structurally identical problem (Home (Idle) presuming a business that doesn't exist yet without Onboarding + product entry first): folded it into the same disclosed "visibly sped-up, jump-cut" montage treatment, with no new caption or voiceover beat added — Beat 2's existing two captions ("Ya armaste tu negocio…" / silent fast-forward) already cover this whole compressed window narratively, so adding a third caption for this screen specifically would relitigate ground the script has already covered, not add clarity.

**Judgment call SB-2 — reaching a genuinely sellable Home (Idle, "Iniciar Venta Rápida") requires registering real stock, not just naming Products, and I added that step to the montage too.** `onboarding.md` §2.2a's "Define lo que vendes" step writes **Product records only** (name + `defaultPrice`) — no Lot, no InventoryEntry, no InventoryUnit. Per `home.md` §3.3's own explicit test ("at least one `available` InventoryUnit," not "has a Product ever been registered"), a Business that's completed Onboarding with zero stock still lands on Home's **cold start** ("Registrar mercancía"), not the Idle "ready" screen shot 3 needs. Judgment Call B1's own stated reasoning ("show it, fast, clearly marked as compressed... so the video stays honest about what actually has to happen") applies identically here, so I extended the same montage to include a quick pass through Inventario's real "Registro de mercancía" screen (`inventory.md` §3.6–§3.10), receiving stock for the same two Products already named in shot 2. This is a real screen a merchant genuinely has to pass through to reach shot 3's state — leaving it out would have made the cut from "typed two prices" directly to "ready to sell" quietly untrue.

**Judgment call SB-3 — every "full screen" shot is cropped, not shown edge-to-edge.** Because this montage deliberately uses a minimal, realistic 2-Product catalog (matching the script's own "fast entry of 2 products" instruction, not an artificially padded demo catalog), most raw screenshots have a large empty scroll region between their content and the bottom nav bar/action button — a real, honest property of the phone screen at this content volume, not an artifact. Showing that dead space at full length would waste most of a 9:16 frame on nothing. For screens where the primary action button sits pinned at the very bottom (BusinessIdentity's "Continuar," SellingGroups' "Continuar," RegisterMerchandise's "Guardar mercancía," Selling's "Finalizar Venta"), I composited the top content region directly above the bottom action-button region (a vertical stack of two crops from the same real screenshot, seam-free), so the button stays visible without showing the empty middle. Every pixel in every crop is still a real, unaltered region of the actual screenshot — this is a framing/crop decision, not a content fabrication, but it's a real edit worth disclosing plainly rather than leaving implicit.

**Judgment call SB-4 — the Hook's screen is scripted (`home.md §3.9`), but its framing is mine.** The script explicitly cites the Selling screen's buttons-mode grid, mid-grid, before any tap, as the Hook visual — I did not substitute a different screen. Within that instruction, I considered three framings before choosing: (a) the full, uncropped phone screenshot; (b) an extreme close crop on just the two product tiles, filling the frame edge-to-edge; (c) a header-plus-grid crop (running total, "Cerrar jornada de venta," "Venta actual: (vacía)," the two tiles) that keeps the tension legible — "ready to sell, nothing sold yet" — while still reading unmistakably as a real app screen, not an abstract graphic. I chose (c): (a) wastes too much of the vertical frame on empty scroll space (SB-3's problem, most acute here since the Hook has no caption competing for the same space yet); (b) reads well as a graphic but strips away the "$0 · 0 ventas" / "Venta actual: (vacía)" context that actually carries the hook's loss-aversion premise — a viewer needs to register "she hasn't sold anything yet, and the day just started" for the hook to land, not just "here are two nice tags." **Worth naming as a genuine open question for the next review round, not resolved by me:** I separately generated a full screenshot of Home's *Idle* state (`home.md §3.4` — "¿Vas a vender hoy?", with Nahui's mark and a soft brand illustration) while building shot 3, and it is, on its own, a more polished, more "finished-app" hero image than the Selling grid the script specifies for the Hook. I did not substitute it — the script names §3.9, not §3.4, for the Hook specifically — but I think it's a fair question for `marketing`/`ui-designer`'s next review pass whether that stronger asset should have been the Hook's screen instead, rather than only appearing later, mid-video, at shot 3. Flagged, not decided.

**Judgment call SB-5 — hard cuts throughout, no crossfades.** The brief allows either. I considered a short (~0.15–0.2s) crossfade at beat boundaries, but the montage's own frames are already held for as little as 0.4s each — a crossfade at that scale would consume a disproportionate fraction of an already-tight shot and blur the "fast-forwarded, jump-cut" read the script's own copy explicitly wants ("visiblemente adelantado"). Hard cuts throughout keep the fastest shots legible and avoid over-investing in transition polish the brief explicitly says not to chase.

---

## 2. Shot-by-shot storyboard

Canonical screen IDs below match `company/merchant-validation-campaign-videos.md` Campaign B §B.1's own table exactly; not re-derived here.

### Beat 1 — Hook (0:00–0:04.3)

| | |
|---|---|
| **Screen** | `home.md §3.9` — Session active, `buttons` surface, mid-grid, before any tap. Real state: a Quick Session just opened in `buttons` mode, Catalog holds exactly the two Products the montage later registers (Playeras, Blusas), "Venta actual: (vacía)," running total "$0 · 0 ventas." |
| **Framing** | Cropped to header + product grid (running total, "Cerrar jornada de venta," "Venta actual: (vacía)," both tiles) — excludes the bottom nav bar and the empty scroll region beneath the tiles. See Judgment call SB-4. |
| **Caption** | "¿Se te va el cliente en el bazar mientras intentas anotar la venta?" — identical to the voiceover, per the script's own instruction that these stay word-for-word synced. Sits in a dedicated band below the screenshot crop, never overlapping any UI element. |
| **Voiceover** | Same line, `say -v Paulina`, measured 4.06s. |
| **Pacing** | Held 4.3s (voiceover length + ~0.25s trailing pad so the line finishes before the cut). |
| **Transition out** | Hard cut. |

### Beat 2 — Prototype demonstration (0:04.3–~0:14)

All five frames below are the disclosed "visibly sped-up" montage (script's own Judgment Call B1, extended per SB-1/SB-2 above). No live tap motion on any of them — each is a static hold of a real, reached state.

| Shot | Screen (canonical ID) | Framing | Caption | Voiceover | Held |
|---|---|---|---|---|---|
| 1 | `onboarding.md §3.3` — Bienvenida, "Empezar gratis" prominent | Top-cropped (excludes empty space below the three path options) | "Ya armaste tu negocio…" | silent | 1.3s |
| 1a *(SB-1 addition, not in the script's own table)* | `onboarding.md §3.9` — Tu negocio (identity capture), "Ropa Aurora" typed into Nombre | Top content + bottom "Continuar" button, seam-composited (SB-3) | none | silent | 0.4s |
| 2 | `onboarding.md §3.5b/§3.5c` — Define lo que vendes, Playeras $220 committed, Blusas $320 in the active row | Same top+bottom composite treatment | none | silent | 0.5s |
| 2a *(SB-2 addition, not in the script's own table)* | `inventory.md §3.6–§3.10` — Registro de mercancía, Playeras ×8 committed, Blusas ×6 in the active Cantidad field | Same top+bottom composite treatment | none | silent | 0.4s |

Total Beat 2 montage: 2.6s. Transition into Beat 2 and between every montage frame: hard cut.

### Beat 2 continued — the real payload (~0:14–~0:19.5)

| Shot | Screen (canonical ID) | Action shown | Caption | Voiceover | Held |
|---|---|---|---|---|---|
| 3 | `home.md §3.4` — Idle, ready ("¿Vas a vender hoy?", "Iniciar Venta Rápida") | Static hold, pre-tap | "Inicia sesión en un toque" | "Abres, y ya puedes vender." (1.96s) | 2.15s |
| 4 | `home.md §3.9` — Session active, buttons surface, 2 items already in "Venta actual" ($540, Playeras + Blusas chips, "Finalizar Venta · 2 artículos" visible) | Static hold of the *after* state — no intermediate tap frames shown | "2-3 toques, ya está" | "Registra la venta sin perder al cliente." (2.50s) | 2.7s |
| 5 | `home.md §3.8f` — Digital receipt (Free-tier variant: "Venta finalizada ✓," "$540," "Ropa Aurora" — no QR, correctly, since this real path never activates `subscriptionTier=paid`) | Cropped to the centered receipt content only | "Recibo digital al instante" | silent | 1.8s |

Transitions: hard cut in, hard cut between each, hard cut out.

**Framing note on shot 4:** the script describes "tap 2–3 product tiles, adding items... one after another, no pause." With no live tap motion available, I show only the resulting state (2 items already added) rather than a sequence of intermediate single-item states — a sequence of 2–3 more stills here would have added length without adding real information, since the voiceover ("Registra la venta sin perder al cliente") is about outcome speed, not about narrating each tap individually.

### Beat 3 — Hypothesis statement (~0:19.5–~0:26)

| | |
|---|---|
| **Screen** | None — a plain statement card, matching the source script's own treatment (Beat 3 cites no canonical screen ID in either campaign's script). Background: Balanced (#F4F4F4, the same neutral the app itself uses). Text: Obsidian (#2D2D2D), Fredoka. |
| **Caption/on-screen text (verbatim, per script)** | "Estamos probando si registrar una venta puede ser tan rápido que no te haga perder al siguiente cliente." |
| **Voiceover** | Identical line, measured 6.20s — this is a long sentence at natural pace; the hold time follows it rather than compressing the line to fit a shorter target. |
| **Pacing** | Held 6.5s. |
| **Transition** | Hard cut in and out. |

### Beat 4 — Honest disclosure, CTA, incentive (~0:26–~0:35.4)

Split into two cards rather than one, because the disclosure text and the CTA/incentive text both need real, independent legibility time and don't share a natural single reading rhythm.

| | |
|---|---|
| **4a — Disclosure card** | Balanced background, Obsidian text. On-screen text (verbatim): "Este es un prototipo interactivo. Queremos saber si esta forma de registrar tus ventas resolvería un problema real para tu negocio." No voiceover (per the script — only the CTA pairing carries a voiceover line at this beat). Held 3.3s, sized to the text's own minimum comfortable read time. |
| **4b — CTA + incentive closing card** | Coral AA+ (#C13F26) background, white text — the one deliberate accent-color card in the whole video, marking this as the payoff/closing moment. CTA line (large, bold, verbatim per the `[CHANGED]` script text): "Pruébalo y cuéntanos si esto te serviría — las dos cosas nos ayudan por igual." Voiceover: same line, measured 4.77s. Incentive line (smaller, beneath a gap, verbatim): "Al terminar, puedes decirnos que quieres que te tengamos en cuenta para el piloto — quedas en la lista de acceso prioritario." Held 6.0s total (voiceover length + ~1.2s so the incentive subtext, which has no voiceover of its own, has time to be read after the CTA line finishes speaking). |

Transition: hard cut from Beat 3, hard cut between 4a and 4b, hard cut to end (no fade-to-black — the brief asks for cheap, simple transitions, and a fade on the very last frame adds a production step without adding clarity).

---

## 3. Total runtime — a real, disclosed departure from the script's own target, not hidden

**Measured final runtime: 29.39 seconds.** The script's own Format line targets "20–25 seconds," already revised upward from an original lower target once Beat 1/Beat 4 were refined, with an explicit acknowledgment that "the realistic runtime toward the upper end of this same band (≈25s)" was expected as a consequence of the refinement, not a scope change. My own measured result lands **another ~4–5 seconds past even that acknowledged upper bound.**

Stated plainly, not undersold: this is because Beat 3's hypothesis statement (6.5s) and Beat 4's disclosure-plus-CTA-plus-incentive (9.3s combined) are long sentences that simply take that long to say and to read, once actually measured against real synthesized speech and real minimum caption legibility — not because I padded any shot. I tightened where I reasonably could (the montage is 2.6s total for four real screens; shot 4 shows only the end state, not a tap-by-tap sequence). The two remaining places a future trim could still recover time, if 29s is judged too long: Beat 4b's 1.2s of post-voiceover hold for the incentive subtext (could drop to ~0.5s, accepting a faster read), and Beat 3's 0.3s trailing pad. Neither is more than a second or two; the real cost is the two verbatim, script-locked sentences themselves, which I did not rewrite or shorten, since Beat 3's line is explicitly "kept verbatim" per the script's own instruction and Beat 4's disclosure/incentive lines are similarly locked copy.

---

## 4. Assembly notes

- **Screenshots:** captured via Playwright (`chromium`, viewport 430×932 @3x device-scale-factor) against `npm run dev` (plain build, port 5184 — not `dev:demo-campaign`; Campaign B's shots never touch the Demo Mode welcome screen, so the plain build is the accurate one to capture against). `AppState` reached by real interaction (typing, tapping, selecting) exactly as a merchant would, per `product/02c-high-fidelity-prototype/README.md`'s own disclosed convention for reaching states quickly and repeatably — not by hand-editing `localStorage` to skip any of the shown screens (the one exception: `currentUser.phoneVerifiedAt` was pre-seeded to skip Authentication's phone/OTP screens, which the script never shows and Campaign A/B's shot lists don't cite).
- **Voiceover:** `say -v Paulina -o <file>.aiff "<exact script text>"`, converted to WAV. One voice throughout, per the brief.
- **Captions:** rendered with Pillow (Python), using the project's own actual typefaces (Fredoka for display/statement text, matching `brand-guide.md`'s Typography section) fetched from Google Fonts — **not ffmpeg's `drawtext`**, which this machine's installed `ffmpeg` build lacks (`libfreetype`/`fontconfig` not compiled in); disclosed here since it's a real environment constraint that shaped the technical approach, not a design choice.
- **Assembly:** each shot rendered as its own fixed-duration MP4 (`ffmpeg -loop 1` on the composed PNG frame, muxed with its own voiceover clip padded to the shot's full held duration, or silence for unvoiced shots), concatenated via the `concat` demuxer. Final export: H.264/AAC, 1080×1920 (9:16), 30fps.

## 5. What still needs judgment from the next review round

1. **The on-screen "this is a video of stills, not a recording" disclosure question (top of this document)** — routed to `brand-guardian`, not decided here.
2. **Whether the Hook should instead use the Idle hero screen (§3.4) rather than the scripted Selling grid (§3.9)** — SB-4 above; I stayed faithful to the script's explicit citation, but flag the Idle screen as a genuinely stronger standalone asset worth a second look.
3. **Total runtime (29.4s) vs. the script's own ~25s acknowledged upper bound** — §3 above; real, not padding, and only trimmable by a couple of seconds without rewriting locked copy.
4. **The montage's jump-cut density** (four still frames in ~2.6s) is the single largest visible gap from a real screen recording in this draft — worth a second opinion on whether it reads as "fast-forwarded" or merely "choppy" once watched at full speed, since that's a felt/perceptual judgment I can't fully verify by inspecting frames individually.
