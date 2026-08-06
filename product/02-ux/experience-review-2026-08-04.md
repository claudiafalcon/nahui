# Experience Review — 2026-08-04/05

One-time emotional/experiential walkthrough of the Medium-Fidelity prototype, run at the Product Owner's request. Expanded same day into a broader Medium-Fidelity comprehension pass (icons, hierarchy, Resultados value), a deep redesign of the post-sale moment, and a new connected NFC demo chain. This file is the running status tracker across all of it.

Governance held throughout: `ux-critic` identifies/prioritizes and evaluates judgment calls. `ux-designer` proposes UX/spec changes. `ui-designer` implements in Figma. `reviewer` verifies Foundation-consistency. Main coordinates, persists, never designs or decides unilaterally.

## Original verdict (starting point, now resolved by the work below)

Not yet an unambiguous "yes" — the core registration loop worked and built trust; the payoff moments (finishing setup, seeing the day's results) landed flat; the demo's climax (Resultados) showed data from a story Ana never lived. Original findings preserved in `ux-critic-findings.md` (HOME-Q1, INV-Q1, EVT-Q1/Q2, RPT-Q1/Q2, F1–F11, HOME-B3, HOME-MIN3).

## ALL THREE WORKSTREAMS — DONE

### 1. Resultados icon/comprehension audit (F1–F11) — DONE
All 11 findings resolved. Spec amendments landed in `home.md`, `inventory.md`, `events.md`, `reports.md` — full `ux-critic` → `reviewer` cycle clean, folded back into Approved. Figma built and verified: NavBar icons, Settings `CapabilityCard` consolidated into one component with status badges, SearchField icon, "Todo listo" ceremony + brand mark, Home's running-total header as a Stat/highlight card, Resultados hero cards + headline statements + Top productos + rank numbers + Event type. One regression found and fixed mid-stream (a confirmation bubble drifted off its shared component). Two follow-on layout bugs found during close-out (an unauthorized `ProportionBar` on "Tus clientes," and the orphaned spacing gap removing it left on 4 frames) — both fixed, `ux-critic`/`reviewer` clean.

### 2. The post-sale moment — DONE, ended up as a full redesign
Evolved through several rounds, each driven by real Product Owner scrutiny: HOME-Q1 (ambient confirmation) → extended with a per-sale total + placeholder (built, then found to leak Ana's daily revenue + the live selling grid to any customer being shown the phone — a real Major privacy finding) → fully reframed as a **digital receipt**: a full-viewport state that temporarily *replaces* the selling screen (not overlays it) during the payment moment, so the private content simply isn't rendered. Persisted as `home.md` §3.8f (§3.8e kept as a superseded pointer, per this doc's own amendment-history convention).

**One real Blocker found and fixed at the spec level:** the first exit mechanism (auto-return timer + tap-anywhere) didn't reliably solve the privacy problem — a slow customer could outlast the timer, and a full-surface tap was exactly as reachable by the customer as by Ana. Fixed: exit is now a margin-zone tap scoped to where Ana's hand grips the phone, with the timer demoted to a long-dwell backstop for the abandoned-phone case only. Full `ux-critic`/`reviewer` cycle clean.

**A second real Blocker found and fixed at the Figma level:** the rebuilt frames' exit destinations (mistakenly preserved from old demo wiring) showed a non-empty, in-progress sale instead of the required empty tray — real risk of a duplicate Sale or corrupted inventory count. Fixed by rewiring to the genuine empty-tray canonical frames. Two `ux-critic` passes plus `reviewer`, all clean.

Built and verified on all four surfaces: production buttons (`192:382`), production nfc (`231:1920`), demo buttons (`198:823`), demo nfc (`284:3552`) — including a new `BrandMark` component (confirmed non-QR-shaped, resolving a concern raised and rejected twice during design). One non-gating Minor remains open (HOME-MIN3 — an already-true "safe miss" property never stated explicitly in the spec text; cosmetic documentation completeness, not a behavior gap).

### 3. Connected NFC activation-to-sale chain — DONE
Real gap: no demo path showed "activate paid plan → activate NFC → tag a product via NFC → sell via NFC → see results" as one story. Scoped first (chose the narrow connected chain over a full 3-journey restructure, which would have been 4-6× the cost with real risk this close to the deadline) — built for less than estimated (8 new frames, ~19 reaction writes vs. ~12-18/25-40 estimated), because Settings activation, Eventos, and Resultados were already largely built. Found and fixed a real pre-existing bug along the way (a shared bridge frame was routing into Eventos instead of Resultados). Full `ux-critic` → `reviewer` cycle clean. The nfc success frame's content-parity gap (flagged when this chain was built) closed automatically once the receipt redesign (workstream 2) landed on that same frame.

One non-gating Minor remains: the shared Resultados destination frame's static content (date/totals) doesn't numerically match this specific chain's own story — a pre-existing placeholder, not something this build introduced, worth a content touch-up before a live demo of this exact chain but not blocking.

## Everything from the original review — closed, stable
- Reverting totals, contradictory event dates, mismatched Resultados finale numbers, disabled-looking Guardar button, stale search-field placeholder — fixed and verified.
- Resultados venue ranking: plain numbers, not a magnitude bar — Product Owner decision, applied consistently everywhere it recurred (Top productos, Tus clientes).
- "Does Resultados communicate real learning, not just data" — resolved via the two headline synthesis statements.

## Still open (not blocking, real items for when the Product Owner is back)
1. **Q13** (`product/02-ux/product-decisions.md`) — NFC adoption rate metric: free-tier or paid-tier? Still genuinely undecided, doesn't block anything else.
2. **The "regalo"/gift-framing question** for the future-registration placeholder — logged as **Q14** in `product-decisions.md` (see below), only relevant once backlog #2 Stage 2 is actually scheduled.
3. **HOME-MIN3** — a one-line "safe miss" clarification in `home.md` §3.8f, cosmetic, no rush.
4. **Resultados destination content touch-up** for the NFC chain's specific numbers, if that exact chain gets used in a live demo.
5. **Journey 2's original click-through instructions** (production pages, 3-page path, named URL-fallback hops) — now persisted, see `product/02b-medium-fidelity/CLAUDE.md`.
