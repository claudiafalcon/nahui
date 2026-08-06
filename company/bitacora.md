# Project Log (Bitácora)

The project's historical memory — governed by `company/CLAUDE.md`'s "Project
Log" and "Session Recovery Protocol" sections. Read this file in full at the
start of any recovery, before reconstructing current state from the
repository (`git status` + the active artifacts it points to). This file
answers three questions per entry, nothing more: what happened, why it
mattered, and where the full detail lives. It never duplicates the
authoritative artifact — it references it.

Append-only, newest entry last, half a page or less per entry. Never delete
or rewrite a past entry — correct forward with a new one.

## Log

---
**2026-08-04/05 — Experience Review workstream completed**
*Context:* One-time emotional/experiential walkthrough of the
Medium-Fidelity prototype, requested by the Product Owner, expanded same day
into three workstreams.
*Discovery/Decision:* All three closed: (1) Resultados icon/comprehension
audit, 11 findings resolved; (2) the post-sale moment redesigned into a
full-viewport digital receipt, closing a real privacy leak (Ana's daily
revenue was visible to the customer mid-transaction); (3) a connected NFC
activation-to-sale demo chain built end to end.
*Impact:* Closed the "does this feel real" gap the prototype had going into
this week's live usability sessions. Full `ux-critic`/`reviewer` cycles
clean on all three.
*References:* `product/02-ux/experience-review-2026-08-04.md`.

---
**2026-08-05 — Session Recovery failure: governance gap discovered and fixed**
*Context:* A session restart erased Main's visibility into the completed
Experience Review workstream (above) and an existing Merchant Experience
Kit. Main, unaware either existed, re-reviewed `events.md`'s already-"done"
Medium-Fidelity build as if for the first time, and — while remediating
findings from that redundant review — had `ui-designer` delete 3 legitimate
Journey 2 ("existing NFC merchant") demo clone frames, despite `ui-designer`
flagging mid-task that they were real and documented.
*Decision:* Established the Session Recovery Protocol and this Project Log
(`company/CLAUDE.md`) as permanent governance, at the Product Owner's
request — not a one-off fix.
*Impact:* Recovery is now a mandatory, gated procedure before any new
dispatch. `events.md` Journey 2 restoration itself is a separate open item
— see the repository's current `git status` and `product/02b-medium-fidelity/CLAUDE.md`
for its live state; Product Owner decision pending as of this entry.
*References:* `company/CLAUDE.md` (Session Recovery Protocol, Project Log,
Main's role sections); `product/02b-medium-fidelity/CLAUDE.md`.

---
**2026-08-05 — ID001 diagnosis corrected: not a structural MCP block**
*Context:* An earlier entry in `company/infrastructure-decisions.md`
diagnosed subagents as categorically unable to access plugin-provided MCP
tools (e.g. Figma). Direct counter-evidence the same day (successful live
Figma calls across multiple subagent spawns) forced a correction.
*Discovery:* Real root cause is connection-timing flakiness — the Figma
plugin's MCP connection observably drops and reconnects mid-session; a
subagent spawned during a down window gets no MCP tools for its run, with no
reconnect. Not structural, intermittent.
*Impact:* Standing practice changed: run a one-call diagnostic before
assuming any Figma-dependent subagent is blocked; fall back to
Main-as-evidence-provider only if that diagnostic itself fails. This
correction was itself missed at the start of a later session until the
Product Owner caught it — see the entry above.
*References:* `company/infrastructure-decisions.md` ID001.

---
**2026-08-05 — Marketing agent evolved to MVP-phase Market Validation mandate**
*Context:* Product Owner requested Marketing's responsibilities reflect the
project's actual current stage (validation and go-to-market prep) rather
than an advertising-execution mandate that doesn't fit yet.
*Decision:* Rewrote `.claude/agents/marketing.md` — ICP definition,
community research, validation-channel comparison (not defaulting to
interviews), proactive initiative recommendations, and a hard
approval-gate on anything that touches a real external account. Approved
by the Product Owner.
*Impact:* Marketing's first deliverables under the new mandate:
`company/market-validation.md` and `company/usability-testing-plan.md`.
*References:* `.claude/agents/marketing.md`; `company/market-validation.md`.

---
**2026-08-05 — Merchant Experience Kit: content Approved, structure open (Q13)**
*Context:* The Merchant Experience Kit (a FigJam board — persona canvas,
empathy map, journey, design principles, experience checklist — meant to
become the primary merchant-persona reference for future design work) had
never gone through `reviewer`'s Foundation-consistency pass.
*Discovery/Decision:* Review found one Important finding (a third-person,
translated-principle phrasing in the empathy map's SIENTE quadrant,
violating Product Language rules) — fixed and verified. Mid-review,
discovered the board actually has two full, independently-built pages
(English + Spanish), not one — a duplication risk with no recorded
rationale and no sync mechanism (the SIENTE bug existed identically on
both, caught by accident). `architect` ruled the two-page structure is out
of compliance with `global-principles.md`'s language-split principle as
written, and routed "why does it exist / what should happen to it" to a
new Business Decision rather than resolving it unilaterally.
*Impact:* Kit content is Approved and citable today. Its two-page structure
is not settled — Product Owner decision pending.
*References:* FigJam `https://www.figma.com/board/yjb7sUjdueUfzGKHmJHKhy`;
`company/business-decisions.md` Q13; `company/market-validation.md` §1a
(source field data).

---
**2026-08-05 — `settings.md` Approved: Low-Fidelity UX phase complete**
*Context:* Final of six Low-Fidelity UX documents (Hoy, Inventario, Eventos,
Resultados, Onboarding, Settings).
*Decision:* Approved after a three-round remediation cycle (one Blocker —
NFC activation losing its required kit-confirmation step — plus several
Majors, including two self-inflicted regressions from a `ux-designer`
full-rewrite pattern, ultimately resolved by Main applying a precise,
previously-verified fix directly rather than a fourth full regeneration).
*Impact:* All six Low-Fidelity UX documents are now Approved — that phase
is closed. Medium-Fidelity build/review is the active phase per document.
*References:* `product/02-ux/settings.md`; `product/02-ux/ux-critic-findings.md`.

---
**2026-08-05 — Known gap: `merchant-user-tester` agent proposal unrecoverable**
*Context:* Product Owner referenced a previously-discussed proposal for a
new `merchant-user-tester` agent (prerequisites reportedly including an
Approved Merchant Experience Kit, Playwright MCP, and a public Figma
Present-mode URL).
*Discovery:* Exhaustive repository search (agent files, every `company/`/
`product/` doc, `product/99-rfc/`, saved plans, full git history) found no
trace of it. Genuinely lost, not stale — the proposal was never persisted.
*Impact:* Cannot be sequenced or built until restated by the Product Owner.
One partial breadcrumb: `playwright` MCP is already configured
project-side (`.mcp.json`, `.claude/settings.local.json`) with no written
justification — plausibly a prerequisite, unconfirmed.
*References:* none — that is the point of this entry. Once restated,
persist immediately (likely `product/99-rfc/`) and update this entry.

---
**2026-08-05 — `merchant-user-tester` agent Approved; Experience Validation formalized as governance**
*Context:* Restated by the Product Owner (the original proposal was lost —
see the entry above) with a changed academic objective — continue
learning/refining before real-merchant sessions, not rush to them — plus
repeated evidence that Product-Owner-led walkthroughs kept finding
experience problems (broken emotional continuity, disconnected screens,
weak NFC journey, underwhelming Results, unclear system state) that
`ux-critic`/`ux-designer`/`reviewer`/Experience Review hadn't caught,
because none of those roles' mandate is "be a first-time merchant," only
"check against spec." Refined over several rounds: single Ana persona;
hard knowledge isolation via tool scoping, not just instructions; report
structured around the Merchant Experience Kit's own dimensions (confidence,
trust, perceived value, expectation-vs-reality), with an explicit
anti-quota rule so positive and negative findings both get equal rigor
rather than manufactured balance; adoption signal captured only as a felt,
in-the-moment reaction, never a business forecast.
*Decision:* Approved. `.claude/agents/merchant-user-tester.md` is the agent;
`company/CLAUDE.md`'s new "Experience Validation" section is its lifecycle
and governance — when it runs (after Medium-Fidelity's `ux-critic`/
`reviewer` cycle, before human-moderated User Validation), how its reports
become `experience-review-*.md` documents and re-enter the standard UX
Remediation cycle, and the hard boundary that its findings never substitute
for real merchants validating business assumptions and product value.
*Impact:* New standing role in the pipeline. Before its findings are
trusted as part of that standard cycle, its first execution must be a
**Qualification Run** against the already-known Journey 2 regression (see
the entry above) — deliberately run before that regression is fixed, so a
successful find is evidence the agent works, not evidence the prototype
does. Concrete blocker before that run can execute: a public Figma
Present-mode URL for the original three-journey prototype (Journey 2
specifically) — likely a manual Figma sharing-settings action, not
something available through current tools.
*References:* `.claude/agents/merchant-user-tester.md`;
`company/CLAUDE.md` ("Experience Validation", "Delegation" sections).

---
**2026-08-05 — ID009 discovered: new agent files aren't dispatchable within their own creation session**
*Context:* First attempt to dispatch `merchant-user-tester` (created earlier
this session) failed twice, identically — the harness didn't recognize the
agent name at all. Traced via file-timestamp comparison: every agent
successfully dispatched this session (`marketing`, `ux-critic`,
`ui-designer`, `reviewer`) had a file predating this session's start; the
one new file was the one that failed. The standard workaround for a similar
prior issue (ID002 — dispatch via `general-purpose` with the persona pasted
in) was deliberately not applied here, since `general-purpose` has
unrestricted tool access and would have silently defeated
`merchant-user-tester`'s core design property (knowledge isolation
enforced by tool scoping, not just instruction).
*Decision:* Documented as `company/infrastructure-decisions.md` ID009.
Agreed with the Product Owner to end this session and run the Qualification
Run in a fresh one instead of accepting a weaker, instruction-only
substitute — the run's whole purpose is validating the architecture, not
just the prompt.
*Impact:* This session boundary now doubles as the first live test of the
Session Recovery Protocol itself. The next session should: run recovery,
confirm `merchant-user-tester` is now discoverable, then execute the
Qualification Run exactly as already agreed — task text, URL, and
instructions are final, already recorded below, not to be re-litigated.
*References:* `company/infrastructure-decisions.md` ID009.

---
**Handoff for next session — Qualification Run, ready to execute once recovery confirms the agent is available:**
- Public prototype URL (seamless demo, correct entry point confirmed via
  live `get_metadata` on node `162:320`, "Bienvenida + Elegir cómo
  empezar"): `https://www.figma.com/proto/DPRnGD5JWjfoNBSlAFoVG4/Nahui-%E2%80%94-Medium-Fidelity-UI?node-id=162-320&p=f&viewport=574%2C625%2C0.02&t=qPfTobaiUEx4GEvv-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=162%3A320&show-proto-sidebar=1&page-id=160%3A2`
  — also recorded in `company/active-artifacts.md` (update that row once
  confirmed working).
- Task (verbatim, Product-Owner-approved, do not alter): "You just heard
  about an app called Nahui from another vendor at a bazaar. She said it
  helps you keep track of your sales without it slowing you down with
  customers. You're curious whether it's worth trying. Open it, see what
  it's about, and get as far as you naturally would."
- No journey names, frame names, node IDs, expected paths, or the Journey 2
  regression should be mentioned in the dispatch. Record the complete
  navigation path, preserve screenshots/browser evidence, do not intervene
  if the agent gets confused or chooses an unexpected route.

---
**2026-08-05 — Qualification Run executed and confirmed; `merchant-user-tester` enters standard governance**
*Context:* First real execution, in a fresh session (confirming ID009's
diagnosis — the agent was immediately available once the process
restarted). Ran against the seamless demo prototype's true entry point
("Bienvenida"), with only the approved task text and no journey/frame/node
hints, exactly as scoped.
*Discovery:* The agent independently found and triple-verified a dead CTA
("Empezar" on the "Todo listo" screen) that `product/02b-medium-fidelity/CLAUDE.md`
already documents as a known, deliberate, disclosed exception — with zero
access to that document. It also added a genuinely new angle the original
disclosure lacked: the emotional cost of *where* the dead end lands, right
at the peak of built-up curiosity. Separately, it had to enable Figma's
screenreader accessibility mode to interact with the canvas-rendered
prototype at all, which incidentally exposed internal frame names/spec
citations — disclosed proactively, and independently verified by Main to
not have leaked into its actual findings.
*Decision:* Product Owner confirmed the run as a pass. Two refinements
applied to `.claude/agents/merchant-user-tester.md`: tool-mechanics
narration must stay in a separate voice from Ana's from the first moment,
not just in the final compiled report; and implementation metadata exposed
by tooling (as opposed to Main's dispatch prompt) is now explicit
"environmental noise" — reasoned from never, ignored and continued past,
only ever disclosed if it materially broke the run. Explicitly decided
*against* changing internal frame-naming conventions to reduce this
exposure — those names stay, valuable to the design team and governance;
the agent got more resilient instead. Documented as
`company/infrastructure-decisions.md` ID010.
*Impact:* `merchant-user-tester` is qualified and enters the standard
Experience Validation cycle described in `company/CLAUDE.md`. The
"Empezar" dead-end finding itself is not yet persisted as a formal
`experience-review-*.md` or routed to `ui-designer` for remediation — a
natural next step, not done as part of this entry.
*References:* `.claude/agents/merchant-user-tester.md`;
`company/infrastructure-decisions.md` ID009, ID010;
`product/02b-medium-fidelity/CLAUDE.md` (the pre-existing, now
independently-confirmed "Empezar" exception).

---
**2026-08-06 — Qualification Run confirmed successful; verification-status governance added; `merchant-user-tester` fully operational**
*Context:* The Product Owner questioned whether a real multi-screen
walkthrough had actually occurred (having only observed the browser open,
not the automated interaction). Rather than trust the agent's own report,
Main independently reproduced the entire path — same URL, same clicks —
using its own Playwright access.
*Discovery/Decision:* All three real screens the agent reported (Bienvenida
→ "Ver un ejemplo" confirmation → "Todo listo") matched word-for-word, and
the core finding — "Empezar" on "Todo listo" does nothing — was confirmed
directly by Main clicking it and observing no URL/screen change. Main's own
first click attempt hit the identical wrong-screen mistake the agent had
disclosed (a real ~1.176x screenshot/viewport scale mismatch), further
corroborating the agent's tooling disclosures as accurate, not fabricated.
Product Owner confirmed: the Qualification Run's real value wasn't finding
a broken flow — it was proving the full chain (agent finds issue unaided →
Main independently reproduces it → tooling artifacts stay separated from
product findings) holds together. New standing governance added: every
future `experience-review-*.md` from `merchant-user-tester` must tag each
finding **Independently Verified / Partially Verified / Pending
Verification / Tooling Artifact** (`company/CLAUDE.md`, Experience
Validation section).
*Impact:* First official agent-generated Experience Review persisted:
`product/02-ux/experience-review-2026-08-06.md`. The "Empezar" dead-end
finding routed to `ux-designer` (spec-level question — what should honestly
happen there without fabricating business data — precedes any Figma fix).
`merchant-user-tester` is now fully operational governance, not just
qualified in principle.
*References:* `product/02-ux/experience-review-2026-08-06.md`;
`company/CLAUDE.md` (Experience Validation section, verification-status
rule).

---
**2026-08-06 — `events.md` Medium-Fidelity workstream closed; task #33 completed**
*Context:* Closing the loop on the 2026-08-05 Session Recovery incident's
concrete damage (see that entry above). Product Owner's explicit direction:
don't revert the redundant review's legitimate fixes just because the
review itself was unnecessary — restore only what actually regressed.
*Decision:* Journey 2 fully restored (`ui-designer`, new clone IDs
`324:540`/`324:559`/`324:563`, fresh reaction-chain readback confirmed).
Final `ux-critic` pass: 0 Blockers, 0 unresolved Majors, both the
restoration and all 10 kept fixes (5 Major + 5 Minor) independently
re-verified, full 20-frame sweep clean. `reviewer` pass: 0 Blockers, one
Important finding — the second cycle's 10 findings/fixes had never actually
been recorded anywhere, meaning nobody could independently confirm they
were legitimate. Closed by adding the missing dated record to
`product/02b-medium-fidelity/events.md` §3, in the same style as the
document's existing findings log.
*Impact:* `events.md`'s Medium-Fidelity status is `product/02b-medium-fidelity/CLAUDE.md`-confirmed
done again, with full, honest history intact rather than smoothed over.
Task #33 closed. `company/active-artifacts.md`'s stale regression note
corrected.
*References:* `product/02b-medium-fidelity/events.md` §3;
`product/02b-medium-fidelity/CLAUDE.md`; `company/active-artifacts.md`.

---
**2026-08-06 — Root cause found: Playwright MCP was missing `--caps=vision`; the "canvas can't be clicked" problem was a config gap, not a ceiling**
*Context:* A `merchant-user-tester` re-walk of the "Empezar" fix produced no valid interaction evidence — every accessibility-ref-based click attempt failed, and the run wrongly substituted the prototype's own Next/Previous frame stepper to keep advancing, narrating the result as if it carried interaction evidence. Caught and stopped by the Product Owner before being trusted; the agent itself honestly confirmed, on direct challenge, that it had used the stepper and produced no valid findings.
*Discovery:* The Product Owner identified the actual root cause: Playwright MCP's default capability set only exposes accessibility-tree-based tools, which a canvas-rendered Figma prototype doesn't support — but Playwright MCP has an official, purpose-built `--caps=vision` opt-in exposing coordinate-based tools (`browser_mouse_click_xy` etc.) designed for exactly this case. This project's `.mcp.json` never enabled it. Every prior workaround (the `ID010` accessibility-accommodation trick, Main's own manual clicking via the unsafe code-execution tool) was routing around a missing flag, not evidence of a real limitation.
*Decision:* `.mcp.json` now launches Playwright with `--caps=vision`. `merchant-user-tester`'s tool list replaced entirely with the Vision coordinate tools; every accessibility-ref tool dropped; the unsafe code-execution tool deliberately never granted. Documented as `company/infrastructure-decisions.md` ID011, explicitly corrected to record this as a configuration gap, not an inherent impossibility.
*Impact:* Requires a session restart before the next Qualification Run (both the MCP config change and the agent's tool-list change need one, per `ID009`). A minimal smoke test (navigate, screenshot, click one button at corrected coordinates, confirm the screen changed) should run before trusting a full walkthrough again.
*References:* `company/infrastructure-decisions.md` ID009, ID010, ID011; `.mcp.json`; `.claude/agents/merchant-user-tester.md`.

---
**2026-08-06 — `--caps=vision` fix proved insufficient: genuine, unexplained click-reliability intermittency, not a Button-vs-text pattern**
*Context:* Post-fix, the "Empezar" re-walk showed a real 401 auth-endpoint error that Main initially (and incorrectly) blamed for click failures — retracted once the same error was found present during successful clicks too. Product Owner directly observed successful real-world clicks Main's automation couldn't reproduce. Extensive elimination followed: CDP trust level (already trusted, confirmed via research), natural multi-step movement/hover-settle timing, coordinate precision (verified against live Figma node geometry), an orphaned pre-fix `playwright-mcp` process (found running without `--caps=vision`, killed) — none explained the gap. A resumed re-walk agent produced genuine, node-ID-verified proof one of its clicks worked; a subsequent fresh dispatch then failed on all four taps, including the previously-100%-reliable plain-text link — ruling out even the Button-vs-text-link theory. Net: real, currently unexplained intermittency in Playwright-driven clicks against this Figma canvas, not a fixed, characterizable pattern.
*Decision:* Product Owner declined to accept this as a permanent limitation or hand the investigation to `merchant-user-tester` — reliable, unbiased first-time-user automation is essential precisely because the Product Owner already knows the intended paths. Reclassified as a Main-owned infrastructure research workstream: compare genuinely different automation stacks (official `chrome-devtools-mcp`, Playwright `connectOverCDP`, native macOS pointer input via a narrowly-scoped MCP, other computer-use MCPs, a web-exported prototype as fallback-only), each evaluated for reliability, knowledge-isolation impact, security boundary, and effort — with a real, repeated (3x from clean state) proof-of-concept per viable candidate, not research alone.
*Impact:* `chrome-devtools-mcp` (official, Google-maintained) installed via `claude mcp add`, pending restart to test. Native macOS automation was blocked on macOS Accessibility permission (`osascript` denied assistive access, `-1719`) — Product Owner has now granted it. `connectOverCDP` deprioritized for a full test cycle based on strong existing negative community evidence (documented reliability regressions vs. normal Playwright `connect()`), noted as evidence-based, not directly disproven. Next session: confirm `chrome-devtools-mcp` tools are available, run controlled 3x-from-clean PoC tests for both new candidates, produce the full decision matrix requested (recommended solution, fallback, rejected alternatives with evidence, security boundaries, setup steps, reliability results, rollback plan).
*References:* `company/infrastructure-decisions.md` ID011; `.mcp.json`; `~/.claude.json` (`chrome-devtools` server entry).

---
**2026-08-06 — Infrastructure investigation resolved: `chrome-devtools-mcp` adopted, 9/9 clean, `merchant-user-tester` switched over**
*Context:* Completed the comparative investigation from the entry above. Native macOS automation, after the Accessibility permission was granted, revealed a different, more fundamental block: the automation browser doesn't render to any physically-visible screen in this hosting environment (`System Events` reports zero windows; a full-screen capture shows only desktop wallpaper) — rejected as environment-specific, not a permissions problem. Playwright `connectOverCDP` deprioritized on existing negative community evidence, not directly tested. `chrome-devtools-mcp` tested properly: the same three controls, each clicked 3× from a fresh navigation, 9/9 successful, every click confirmed against the correct destination node via the tool's own explicit navigation report.
*Decision:* `chrome-devtools-mcp` adopted as `merchant-user-tester`'s primary interaction mechanism, replacing Playwright Vision entirely. `.claude/agents/merchant-user-tester.md` updated: new tool list (`navigate_page`/`take_snapshot`/`click`/`take_screenshot`/`wait_for`), interaction instructions rewritten around snapshot→element→click rather than coordinate math, and the "enable screen-reader accommodation" step is now a standing, documented instruction rather than left to ad hoc rediscovery. `.mcp.json`'s Playwright `--caps=vision` config left in place, untouched, as an immediate same-day rollback path.
*Impact:* Full decision matrix delivered (recommended/fallback/rejected alternatives with evidence/security boundaries/setup steps/rollback plan) — see `infrastructure-decisions.md` ID011's final entries for the complete record. Restart required before the next `merchant-user-tester` dispatch, per `ID009`. A fresh Qualification-style run on the new stack is the next step, to confirm it holds up under the agent's own full workflow, not just Main's direct testing.
*References:* `company/infrastructure-decisions.md` ID011 (full resolution); `.claude/agents/merchant-user-tester.md`.
