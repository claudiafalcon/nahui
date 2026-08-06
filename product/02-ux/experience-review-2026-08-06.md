# Experience Review — 2026-08-06 (Qualification Run)

The first Experience Review generated through `merchant-user-tester`, run
against the seamless demo prototype's true entry point (fileKey
`DPRnGD5JWjfoNBSlAFoVG4`, page `160:2`, node `162:320` — "Bienvenida +
Elegir cómo empezar"). Governed by `company/CLAUDE.md`'s "Experience
Validation" section.

**Dual purpose of this specific run:** unlike future runs, this one's
primary objective was validating the Experience Validation layer itself,
not the prototype — see `company/bitacora.md` for the full Qualification
Run context. The prototype finding below is real and is being remediated
like any other, but the more important outcome is procedural: the agent
found a genuine issue with zero implementation knowledge, Main
independently reproduced every step of it, and the finding was cleanly
separated from tooling artifacts along the way. **Qualification Run:
successful.**

## Verification status legend

- **Independently Verified** — Main reproduced the behavior itself (a
  click, a screen, a piece of copy) and it matched the agent's report.
- **Partially Verified** — some but not all of the claim was checked.
- **Pending Verification** — not yet checked against anything beyond the
  agent's own report.
- **Tooling Artifact** — traced to the automation mechanism itself
  (Playwright/Figma-canvas interaction), not to the product.

Interpretive/felt reactions (confidence, trust, perceived value) are the
agent's legitimate first-person report, not independently "verifiable" the
way a click outcome is — status tags below apply to the factual claims
those reactions are built on, not the felt reaction as if it were itself a
checkable fact.

## Task given to the agent

"You just heard about an app called Nahui from another vendor at a bazaar.
She said it helps you keep track of your sales without it slowing you down
with customers. You're curious whether it's worth trying. Open it, see what
it's about, and get as far as you naturally would." No journey name, frame
name, node ID, expected path, or prior-known issue was included.

## Navigation path and findings

**1. Bienvenida screen** ("Nahui — Aquí vas a registrar tus ventas al
momento y ver cómo va tu negocio, sin perder tiempo con la app," three
options: "Empezar gratis" / "Activar plan de pago" / "Ver un ejemplo").
Ana's choice: "Ver un ejemplo" — curious, not yet committed, wants to see
before creating an account.
**Status: Independently Verified.** Main navigated to the same URL and
confirmed identical content.

**2. "Ver un ejemplo" confirmation screen** ("Esto crea un negocio de
ejemplo con ventas y clientes inventados... No es tu negocio real, y no vas
a poder convertirlo en tu negocio real después"). Reported as a genuine
trust-building moment — explicit, honest, pre-answers a worry Ana would
have before she could even ask it.
**Status: Independently Verified.** Main clicked through to this screen
and confirmed the text is a word-for-word match.

**3. "Todo listo" screen** (plus icon, "Explora lo que quieras — no es
información real," single "Empezar" button).
**Status: Independently Verified.** Main reached this screen and confirmed
identical content.

**4. Core finding — "Empezar" is unwired.** Tapping the screen's only
button produces no response: no navigation, no error, no feedback. The
agent verified this three independent ways (Tab-traversal skip, role-based
lookup, broad element search) before reporting it.
**Status: Independently Verified.** Main clicked the same button directly
and confirmed the page URL and screenshot were unchanged before/after.

**5. Never encountered an NFC-tag or "existing customer" style flow.**
Reported as a legitimate non-finding, not something the agent went looking
for or treated as a gap.
**Status: Pending Verification.** Main did not explore further from this
entry point to confirm whether such a flow is reachable via a different
path on this same demo page — the absence is consistent with the task
given, not confirmed as the page's full extent.

**6. Confidence/trust/value trajectory** (rose at the welcome screen and
the "ver un ejemplo" disclosure, dropped sharply at the unresponsive
"Empezar"). This is the agent's interpretive report, built on findings 1-4
above (all Independently Verified) — the trajectory itself isn't a
separate checkable claim.

## Tooling artifacts (excluded from product findings)

- The prototype renders to a single canvas with no default accessibility
  content, forcing a Figma accessibility-mode accommodation to interact at
  all — see `company/infrastructure-decisions.md` ID010.
- One accidental click landed on "Activar plan de pago" instead of the
  intended target, caught and backed out by the agent.
- One overly broad element query briefly navigated to Figma's own login
  page, caught and reversed.
- **Status: Tooling Artifact**, all three. Independently corroborated:
  Main's own first attempt at clicking "Ver un ejemplo" hit the identical
  wrong-screen failure, traced to a real ~1.176x scale mismatch between
  screenshot pixel coordinates and the actual viewport — confirming this is
  a property of the interaction mechanism, not something the agent
  mishandled or fabricated.

## Recommendation

Route finding 4 (the unwired "Empezar" button) through the standard
remediation cycle. Note this isn't a fresh defect — `product/02b-medium-fidelity/CLAUDE.md`
already documents it as a deliberate, disclosed exception ("no 'example
business' Home state exists in any approved spec; reusing a real Home
frame would misrepresent the fake demo as a real business"). What this run
adds is independent confirmation the gap is real and reachable, plus a
sharper read on its cost: it lands at the exact peak of Ana's built-up
curiosity, not a low-stakes moment. The underlying question — what should
actually happen when "Empezar" is tapped, given no fabricated example data
is allowed — is a spec-level call, routed to `ux-designer` first.
