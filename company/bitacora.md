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

---
**2026-08-06 — First `chrome-devtools-mcp` run: narration-separation gap found and fixed; 2 real findings confirmed and routed**
*Context:* First full `merchant-user-tester` run on the new stack completed successfully (20+ real taps, no workarounds needed). Product Owner caught a real regression while reviewing it live: technical tool language (click confirmations, navigation results) was leaking into Ana's first-person narration — a weaker standard than previously set ("labeled and switched" instead of genuinely separate channels).
*Decision:* Strengthened `.claude/agents/merchant-user-tester.md` to a hard structural split: all technical detail goes exclusively into a Tool Diagnostics/Execution Evidence channel, never into the live narration, not even labeled — narration contains only what Ana sees/thinks/feels/decides. Applies to all future runs; this run's own report predates the fix.
*Discovery:* Main independently verified the run's two most concrete findings by retracing the exact path. (1) Settings reached from the NFC-seeded demo Home shows the free-plan/buttons variant — confirmed via frame names on both ends (`nfc-twin` Home → `plan gratis` Settings), traced to an already-disclosed build simplification (exception #6, `product/02b-medium-fidelity/CLAUDE.md`). (2) The tab bar (Inventario/Eventos/Resultados) is genuinely unwired on that same Home frame — confirmed structurally via `take_snapshot` (plain `StaticText`, not `link`). Three other reported findings (stale daily total, apparent state reset, empty Eventos tab) left as Pending Verification, not yet traced.
*Impact:* `product/02-ux/experience-review-2026-08-06-b.md` persisted with verification-status tags per finding. Both confirmed findings routed to `ui-designer` as one remediation batch.
*References:* `product/02-ux/experience-review-2026-08-06-b.md`; `.claude/agents/merchant-user-tester.md`; `product/02b-medium-fidelity/CLAUDE.md` (exception #6).

---
**2026-08-06 (overnight) — NFC Settings/tab-bar fix verified end-to-end; 2 Pending findings resolved; 1 new finding surfaced**
*Context:* Continuing overnight per explicit Product Owner authorization
("continue the work... capture the findings of merchant-user-tester as
higher priority because it's my zero user"). `ui-designer` had completed the
Findings 1+2 remediation batch from the entry above (Settings routing clone
`360:1117`, tab-bar wiring across all 5 nfc-mode frames) and reported it
ready for verification.
*Discovery/Decision:* `ux-critic` reviewed structurally: clean, 0
Blockers/Majors, confirmed clone fidelity and target-frame content by
screenshot, and caught a real error in `ui-designer`'s own disclosed-items
list (a claimed stale "← Eventos" label that, checked against the render,
already correctly reads "← Hoy" — corrected, not carried forward). `ux-critic`
also flagged that reaction-level click correctness is structurally outside
its Figma-inspection tools (`infrastructure-decisions.md` ID004). Main
closed that exact gap directly via `chrome-devtools-mcp`: every hop of both
fixes (▾ → clone → Configuración → correct paid/nfc Settings → back-link →
origin Home; all three tabs → their destinations) confirmed by live click,
not inference. While doing so, Main also independently traced the two
previously-Pending findings from the prior entry: Finding 5 (empty Eventos
tab) and Finding 6 (tag queue resolving in one tap) are both now
Independently Verified, with root causes identified (5 is the same
canonical-shared-frame pattern as Finding 1; 6 is a disclosed static-
prototype content gap, same class as the accepted daily-total limitation).
A new issue, Finding 7, was surfaced only by fixing Finding 2: the tab bar
now works, but all three destinations are generic canonical frames
inconsistent with the nfc-twin's actual mid-session narrative — logged as a
Product Owner proportionality question (same class as exception #6), not
resolved unilaterally.
*Impact:* `product/02-ux/experience-review-2026-08-06-b.md` fully updated —
every finding (1-7) now carries a verification status and, where
applicable, a fix record. `product/02b-medium-fidelity/CLAUDE.md`'s demo-page
tracking has a new dated subsection recording both fixes. `company/active-artifacts.md`'s
demo-prototype URL row corrected — it had been left marked "Not yet obtained"
for days after the URL was actually acquired and in active use, a stale-
documentation gap fixed in passing. `reviewer` and a `merchant-user-tester`
re-walk (task: check Settings and today's sales/inventory mid-Día-2) were
both dispatched to close the loop — results not yet in as of this entry.
*References:* `product/02-ux/experience-review-2026-08-06-b.md`;
`product/02b-medium-fidelity/CLAUDE.md`; `company/active-artifacts.md`;
`company/infrastructure-decisions.md` ID004.

---
**2026-08-06 (overnight) — `product/03-build` readiness confirmed; `settings.md` §2.1's last disclosed gap closed; forward-looking backlog prep done**
*Context:* With Medium-Fidelity delivery stable and the NFC fix above being verified, Main kept `architect`/`planner` productive per `company/CLAUDE.md`'s standing governance rather than leaving them idle overnight.
*Discovery/Decision:* `architect`'s build-readiness review found the domain model fully implementation-ready for sale registration, event/session, inventory+NFC, and settings/capability toggles — no open `decision-log.md` entry blocks a build start. It found two documentation-hygiene gaps, both closed same night: `product/02-ux/CLAUDE.md`'s status section had a stale "full remediation cycle pending" line for `onboarding.md`/`settings.md`'s already-completed D27 cycle (corrected; a pointer-only entry also added to `ux-critic-findings.md`, honestly noting the original Major/Minor IDs were never captured at the time rather than fabricating them), and `settings.md` §2.1's Home entry-point wiring had never received its formal Medium-Fidelity `ux-critic` pass despite two separate self-disclosures in `home.md`'s own tracking. That formal pass ran and came back clean (0 Blockers/Majors/Minors, all 8 in-scope frames + 4 correctly-excluded frames verified) — the last open item in that lineage is now closed.
`planner`'s backlog prep recommends Home (Hoy), paired with a thin Onboarding and thin Inventario slice, as the first `product/03-build` target — grounded directly in `company/backlog.md`'s own stated gating ("neither stage starts before backlog #1 clears its bar") and a sharp observation from `company/usability-testing-plan.md`: neither the Figma click-through nor a moderated session can ever produce a real "<3 second" registration-speed measurement — only real code in real merchants' hands can close backlog #1 at all.
*Impact:* No blockers remain for a clean `03-build` start on Home/Onboarding/Inventario, whenever that phase begins. One genuine Product Owner-level call surfaced, correctly not resolved by `planner` itself: whether to continue prototype-stage validation testing or move to real `03-build` now — a strategic sequencing decision with no already-established ordering, per Decision Ownership.
*References:* `product/02-ux/CLAUDE.md`; `product/02-ux/ux-critic-findings.md`; `product/02b-medium-fidelity/home.md`; `company/backlog.md`; `company/usability-testing-plan.md`.

---
**2026-08-06 (overnight) — Real dead-end trap found by `merchant-user-tester` re-walk; Blocker routed for urgent fix**
*Context:* The `merchant-user-tester` re-walk dispatched to close tonight's NFC Settings/tab-bar remediation loop (see the entry above) found something more serious than the expected confirmation pass. Ana followed a fully realistic path — active session, checked Settings (worked, felt trustworthy), returned to selling, tapped "Inventario" expecting to see her stock — and got genuinely stuck, with no working control left to get back to her event. She correctly stopped and reported the wall factually rather than diagnosing it or improvising a workaround, exactly per her design ("merchant-user-tester experiences, Main investigates").
*Discovery:* Main reproduced Ana's exact path via `chrome-devtools-mcp`, click for click. Root cause: `162:1661`'s ("Registrar mercancía" form) own "← Inventario" back-link is wired to `162:1485` (Home's literal Journey-1 Cold-start frame) — correct for Journey 1, its original and only caller until tonight, but never reachable from the NFC-mode family before tonight's Finding 2 tab-bar fix made `284:3534`→`162:1661` reachable for the first time. Once on `162:1485`: tab bar entirely unwired (a pre-existing, untouched legacy limitation of that specific frame), and the only working control (header "▾") opens a sheet whose own Inventario link loops back to `162:1661` — never to the live session. A genuine closed loop, not merely a narrative mismatch like Finding 7 from earlier tonight.
*Decision:* Classified as a Blocker, not a proportionality question — this one carries a real risk of a merchant believing her sales were lost, the exact core validated friction the product exists to protect against. Routed to `ui-designer` immediately, ahead of Finding 7: clone `162:1661` for nfc-context entry (repointing the 5 nfc-mode frames' Inventario tabs to the clone), give the clone's back-link a real destination in the live nfc session, and leave `162:1661`/`162:1485` themselves untouched so Journey 1's own correct use of them isn't disturbed.
*Impact:* `product/02-ux/experience-review-2026-08-06-b.md` updated with the full finding (Finding 8) and root-cause trace. Fix dispatched; not yet verified as of this entry. This is the clearest example yet of the Experience Validation layer's actual value: a re-walk meant to confirm a fix instead found a worse problem the fix itself had newly exposed — precisely the reason this gate exists.
*References:* `product/02-ux/experience-review-2026-08-06-b.md` (Finding 8).

---
**2026-08-06 (overnight) — Finding 8 fix verified complete; a second, sibling dead-end (Finding 9) found immediately after**
*Context:* Follow-up to the entry above, whose Impact line said "fix dispatched; not yet verified" — `reviewer` flagged that line as stale once verification actually completed, correctly per the Session Recovery failure this file already documents; this entry closes that gap rather than editing the original (append-only convention).
*Decision/Discovery:* Finding 8's fix (5 self-referencing Inventario clones + the `360:1117` leak fix) is complete: `ux-critic` reviewed clean with elevated scrutiny, `reviewer` confirmed the self-referencing-clone design was a legitimate, disclosed engineering judgment call (not overstepping into invented product behavior), and Main independently verified two full round trips by live click via `chrome-devtools-mcp`. A second `merchant-user-tester` re-walk, dispatched specifically to confirm this fix felt right to Ana, found it did — her "← Inventario" tap worked exactly as intended — but she then tapped the header "▾" (a reasonable next move) and hit a second, sibling dead-end: 4 of the 5 nfc-mode frames' own "▾" trigger still opens the *original, unfixed* session-controls sheet (`162:1526`), whose tab bar is inert and whose "Configuración" reproduces **Finding 1's exact original bug** (free-plan Settings shown to the paid/nfc-seeded business) — plus puts "Cerrar sesión" one tap away with no warning, a real accidental-logout risk mid-sale. Main reproduced and traced this directly. Root cause identical to Finding 8's: tonight's original Fix 1 only ever rewired `284:3698`'s own "▾" trigger (the one frame Finding 1's original report demonstrated the bug from); Finding 2's tab-bar fix made the other 4 frames reachable for the first time, exposing that their own local triggers were never touched.
*Impact:* Logged as Finding 9 in `product/02-ux/experience-review-2026-08-06-b.md`, classified as a Blocker (same severity as Finding 8). Routed to `ui-designer` for an urgent fix, extending Finding 8's self-referencing-clone pattern to the remaining 4 frames. Not yet verified as of this entry.
*References:* `product/02-ux/experience-review-2026-08-06-b.md` (Finding 9).

---
**2026-08-06 (overnight) — Finding 9's own fix caught a fresh regression before reaching `reviewer`; third fix round dispatched**
*Context:* `ui-designer` fixed Finding 9 (correctly identifying along the way that only 3 origins needed it, not the reported 4 — `284:3552` deliberately has no "▾" per its receipt spec). Main live-click-verified 2 of the 3 chains, both landing correctly with session state intact. Routine next step: `ux-critic`'s structural pass.
*Discovery:* `ux-critic` caught a real regression Main's own click-through had missed — the 3 new sheet clones were built from the wrong template (`home.md` §3.6c's no-Session shape: generic header, one "Configuración" button) instead of the correct active-Session shape (§3.7a: real session header, **two** rows — "Cerrar sesión" and "Configuración," always reachable per §2's Session-controls interlock). Checking Main's own transcript confirmed it directly: both live-tested sheets showed only "Configuración." The old, buggy `162:1526` sheet these replaced had actually gotten this part right — fixing the wrong-Settings-tier bug silently dropped "Cerrar sesión" from three mid-selling screens.
*Decision:* Classified as a third Blocker in this same lineage, routed back to `ui-designer` with precise instructions: rebuild the 3 sheet clones from `162:1526`'s own shape (the correct template), keep the 3 already-correct content clones untouched, wire "Cerrar sesión" to a real working destination.
*Impact:* This is the third consecutive round where verifying one fix surfaced a new, genuine problem one layer deeper — not oscillation (each round found something the previous fix's own change newly exposed, converging closer each time), but worth naming as a pattern: this specific nfc-mode session-controls affordance had accumulated more latent, never-exercised wiring debt than any other single surface touched tonight. Fix verified since this entry was written: `ux-critic` re-review clean, Main live-click-confirmed the full chain on the no-items origin (`284:3534`) including a real, working "Cerrar sesión" destination.
*References:* `product/02-ux/experience-review-2026-08-06-b.md` (Finding 9, regression addendum).

---
**2026-08-06 (overnight) — `reviewer`'s closing pass caught a fourth, more severe Blocker: the Session-controls interlock silently bypassed for an in-progress Sale**
*Context:* Dispatched as the closing Foundation-consistency review for the whole Finding 8/9 chain, expecting a routine clean pass given `ux-critic` and Main had both already verified the latest round.
*Discovery:* `reviewer` found that Main's own verification methodology had a real gap: the live click-through only tested `284:3534` (the no-items nfc origin) and assumed `284:3540`/`284:3547` (with-items / mid-save) matched "by identical pattern." That assumption inverted the actual requirement — `home.md` §2's Session-controls interlock exists specifically to make the with-items case *diverge*: "Cerrar sesión" with 1+ items in the open Sale must route to §3.11a's blocking notice, never to §3.11's direct close confirmation. The rebuilt fix wired all 3 origins to the same §3.11 destination, meaning a merchant with an unfinished 2-item sale could tap through to "Sí, cerrar" and silently lose it — more severe than Findings 8/9 (those were dead-ends; this is silent data loss presented as the normal flow), and the exact core validated friction (`company/CLAUDE.md`) this product exists to prevent.
*Decision:* Classified as a fourth Blocker in this lineage. `41:573` (the correct §3.11a frame) already exists in the production build — routed to `ui-designer` to clone it for the demo page rather than inventing new content, and to explicitly verify/decide `284:3547`'s correct behavior rather than assuming it too.
*Impact:* A genuine lesson for Main's own verification discipline, not just `ui-designer`'s build: "identical pattern" is not a safe assumption when the underlying spec requires divergence between similar-looking states — the specific states that most need independent testing are exactly the ones a fix might have wrongly treated as interchangeable. **Fix now complete and verified**: `ui-designer` cloned the production §3.11a frame for both with-items origins, `ux-critic` reviewed with elevated scrutiny (clean, independently re-confirmed the §3.8c "still counts as unfinished" reasoning against `home.md` directly rather than trusting the build report), Main live-click-verified the full round trip. Fourth Blocker in this one-night lineage, fourth clean close.
*References:* `product/02-ux/experience-review-2026-08-06-b.md` (Finding 9, second regression); `product/02-ux/home.md` §2/§3.11/§3.11a.

---
**2026-08-06 (overnight) — Finding 10: a fifth instance of the same pattern, one layer deeper (the "Elegir producto" picker sheet)**
*Context:* A closing `merchant-user-tester` re-walk, dispatched to confirm the whole Finding 8/9 chain felt right end-to-end, instead found a fifth dead-end: from inside Finding 8's own (correctly fixed) registration-form clone, tapping "Elegir producto" opens a separate, shared, un-cloned picker-sheet node whose own back-link still targets the original `162:1485` trap. Main reproduced and confirmed directly.
*Decision:* Given this is the fifth distinct discovery of the identical shared-node-wrong-back-link pattern in one night, Main judged that another narrow one-off patch was unlikely to converge and requested a comprehensive sweep instead — audit everything transitively reachable from the 5 nfc-mode session frames for any remaining reference to the pre-fix frame family, fix all findings from that sweep in one batch. First dispatch hit a genuine, disclosed tool-access gap (`ReadMcpResourceTool` unavailable) and correctly refused to guess rather than proceed unsafely — retried once per the standing `ID001` practice for this exact intermittent failure mode.
*Impact:* Sweep in progress as of this entry.
*References:* `product/02-ux/experience-review-2026-08-06-b.md` (Finding 10); `company/infrastructure-decisions.md` ID001.

---
**2026-08-06 (overnight) — Finding 10 sweep complete; six-round NFC remediation saga closed**
*Context:* Closing the loop on the entry above — the comprehensive sweep it left "in progress."
*Decision/Discovery:* Sweep found 6 real leak instances beyond the picker sheet itself, all the same causal family (shared nodes whose back-link/completion still targeted the pre-fix trap): a second picker-sheet state, the registration form's "committed lines" screen, a destructive action's own completion (Descartar), and two more instances of Finding 1's exact original bug via new side doors (an Activar-clientes-frecuentes confirmation and its completion). Fixed with 28 new clones, one per instance per applicable nfc origin. Two deeper legacy nodes deliberately left unfixed — a disclosed proportionality question, same class as the already-accepted exception #6 — `reviewer`'s closing pass independently verified this classification directly against the actual nodes (both have working back-links, not the inert-tab-bar trap pattern) rather than accepting the analogy on faith. `ux-critic` reviewed with elevated scrutiny: clean, independently derived and spot-checked the clones since none were given by ID, confirmed sources undisturbed. Main live-click-verified the original confirmed instance end-to-end.
*Impact:* Six rounds, six genuine Blockers, one night: dead-end trap, four unfixed Settings triggers, a wrong sheet template dropping "Cerrar sesión," a Session-controls-interlock bypass risking silent data loss, a picker-sheet leak, and this six-instance sweep. `reviewer`'s closing Foundation pass found the underlying work sound with zero Blockers — only three documentation-hygiene gaps (this entry, `product/02b-medium-fidelity/CLAUDE.md`'s missing Finding 10 subsection, and `experience-review-2026-08-06-b.md`'s stale Recommendation section), all closed alongside this entry. This is the clearest demonstration yet of why Experience Validation is its own gate, separate from `ux-critic`/`reviewer`'s spec-compliance checks: every one of these six Blockers was found by verifying — not trusting — the previous round, exactly the chain this project's governance exists to run.
*References:* `product/02-ux/experience-review-2026-08-06-b.md` (Finding 10, full sweep record); `product/02b-medium-fidelity/CLAUDE.md`.

---
**2026-08-06 (overnight) — Finding 11, the seventh and final item: two never-wired terminal screens; investigation deliberately closed for the night**
*Context:* A final closing `merchant-user-tester` re-walk, this time completing the full registration+tagging flow rather than backing out of it, found a genuinely new trap: `284:535` (the tagging-complete confirmation) and, one hop further, `162:1804` (Eventos cold-start) both had entirely unwired tab bars — not a wrong-destination bug like Findings 8-10, but screens that simply never had lateral navigation built at all, since both were built as terminal/leaf screens in their own original journeys. Tonight's nfc-mode wiring work made both reachable as journey-crossing points for the first time.
*Decision:* Fixed and verified — `284:535` (single caller) edited directly; `162:1804` (13 legitimate callers, several Journey-1-native) cloned rather than edited, preserving every other caller's behavior. Main live-click-verified the full two-hop escape chain both ways. Given this was the seventh distinct navigation gap found through six rounds of fix→verify→re-walk in one night, Main made a deliberate decision to close the investigation here rather than continue chasing further leaves — the underlying reachable graph (all of Inventario's registration+tagging flow, Eventos, Resultados, Settings' deeper sub-flows) is larger than what one night's remediation can exhaustively audit with confidence, and returns were diminishing round to round.
*Impact:* Seven Blockers found and fixed in one night, every one surfaced by verifying — never trusting — the previous round: a dead-end trap, four unfixed Settings triggers, a wrong sheet template silently dropping "Cerrar sesión," a Session-controls-interlock bypass risking silent data loss, a picker-sheet leak (closed via a 6-instance/28-clone sweep), and two never-wired terminal screens. A dedicated, systematic full-graph audit of the nfc-mode reachable surface is flagged as good candidate work for a future session — not urgent (the specific traps found tonight are all closed), but the underlying pattern (Journey-1-built shared content silently reused by nfc-mode without re-checking every downstream link) is now well-understood enough to search for proactively rather than only reactively.
*References:* `product/02-ux/experience-review-2026-08-06-b.md` (Finding 11, closing the night's full record).

---
**2026-08-06 — Correction: the entry above miscounts "Seven Blockers"**
*Context:* Caught during fact-checking for an external progress report — the entry above's Impact line says "Seven Blockers found and fixed in one night" but its own enumeration lists only six items (dead-end trap; unfixed Settings triggers; wrong sheet template; interlock bypass; picker-sheet leak/sweep; two never-wired terminal screens). The "seven" was carried over from Finding 11's own self-description as "the seventh distinct navigation gap" — a cumulative count of every finding in the night's sequence (including non-Blocker findings like 5, 6, 7), not a count of Blocker-severity items specifically.
*Correction:* Six genuine Blockers were found and fixed in one night, not seven — matching the entry earlier in this same log ("Six rounds, six genuine Blockers, one night"). Per this file's append-only convention, the original entry above is left unedited; this is the correction of record.
*References:* `product/02-ux/experience-review-2026-08-06-b.md` (Finding 11's own "seventh distinct navigation gap" language, which is the actual source of the miscount).

---
**2026-08-06 — Two external Spanish deliverables produced: progress report (DOCX) and presentation, both brand-designed**
*Context:* Product Owner requested a progress report and a ~4-minute presentation, both in natural Mexican Spanish in her own voice, sourced strictly from real project artifacts, with the explicit division of labor: Marketing improves storytelling, Reviewer verifies facts, Architect verifies technical accuracy, UX Designer verifies the product narrative, Main coordinates and delivers.
*Decision:* Built an English master draft first (internal reasoning stays English per standing instruction), dispatched all four specialist reviews in parallel. All four found real, correctable issues, not rubber-stamped: Marketing found an unstated but true connection between Ana's founding fear and the mid-session data-loss bug found overnight; Reviewer caught a genuine arithmetic error (this file's own "seven Blockers" line contradicted its own six-item enumeration — corrected at the source, see the entry above) plus an entry-point-count error (five Settings screens claimed, actually four); Architect caught a reintroduced-and-already-corrected phrasing about the Loyalty/customer-privacy boundary (D21); UX Designer caught a real factual conflation between two different Figma prototype artifacts, and — most importantly — that the flagship privacy-fix story had been implicitly misattributed to `merchant-user-tester`, when it was actually found by a Product-Owner-led walkthrough before that agent existed. All four corrections applied before translation.
*Impact:* Three files delivered to `evidence/2026-08-06-progress-report/`: the Spanish DOCX progress report, a Spanish HTML presentation built with Nahui's actual brand tokens (Coral AA+, Fredoka/Inter, the real four-pillar mark, real Figma screenshots — not a generic template), and a companion DOCX with the slide outline, full speaker notes, and a coverage checklist. Published as a private artifact for the Product Owner to review before any sharing.
*References:* `evidence/2026-08-06-progress-report/`; `product/00-foundation/decision-log.md` D21; `company/brand/brand-guide.md`.

---
**2026-08-06 — Both deliverables reframed: from "what happened" to "why the process itself evolved"**
*Context:* Product Owner reviewed the first version and asked for a genuine reframing, not a polish — both pieces described the project instead of explaining why it's fundamentally different. New explicit requirement: the report (capped at 3 pages) must naturally answer why specialized agents, governance, and Experience Validation each became necessary, how the project's artifacts support each other, and why the project is ready for High Fidelity — without enumerating artifacts as a list, and without spending space on individual UX findings. The presentation must tell that same evolution as its own story, not summarize the report.
*Decision:* No new facts were introduced — this was a narrative restructuring of already-verified material, done directly rather than redispatching the four specialist reviews (no claims changed, only the framing). Rewrote the report as a continuous narrative: the validation-prototype question → the Foundation (why decisions needed one permanent home) → why specialized agents became necessary (the real story: a boundary was crossed once, and that's exactly why it got hardened) → why governance became necessary (the Session Recovery incident, told as cause and effect) → why Experience Validation exists (the privacy catch, spec-compliance vs. lived experience) → how MCP tooling let agents touch the real prototype instead of only reading about it → why the project is ready for High Fidelity (the method is proven, not just the design finished). Rewrote the presentation (11 slides) around the identical arc, kept "The path to what's next." in English throughout per explicit instruction, reused the same brand system and real screenshots.
*Impact:* All three files in `evidence/2026-08-06-progress-report/` updated in place (same artifact URL preserved for the presentation). The thesis both pieces now carry: Nahui's biggest achievement so far isn't only the application design — it's the AI-native methodology built to design, validate, and govern it with evidence rather than assumption.
*References:* `evidence/2026-08-06-progress-report/`.

---
**2026-08-06 — Native .pptx generated alongside the HTML deck**
*Context:* Product Owner confirmed she wanted the editable PowerPoint file offered earlier, and separately flagged that the deliverables weren't visible where she expected — traced to the files living one folder level deeper (`evidence/2026-08-06-progress-report/`) than she'd checked, not a real gap; confirmed all files were present and pointed to the exact path.
*Decision:* Built `Nahui - Presentacion.pptx` via `python-pptx`, matching the HTML deck's 13-slide content, Nahui's real colors, the logo mark (rasterized to PNG since PowerPoint doesn't render SVG), and the same real Figma screenshots. Disclosed one honest limitation: brand fonts (Fredoka/Inter) are referenced by name, not embedded, so a machine without them installed will see a fallback font — color/logo/layout/screenshots are unaffected.
*Impact:* Four final files in `evidence/2026-08-06-progress-report/`: the DOCX report, the DOCX speaker-notes/checklist companion, the branded HTML presentation (also live as a published artifact), and now the native `.pptx`.
*References:* `evidence/2026-08-06-progress-report/`.

---
**2026-08-06 — Executive Review pass: product visibility restored, method reconnected to Ana, evidence sharpened**
*Context:* Product Owner requested a final executive-quality review against 9 criteria (product-vs-method balance, product visibility, cause-and-effect clarity, evidence quality, executive-level term introductions, one-idea-per-slide, visual consistency, speaker-note naturalness, and the 3-message exit test) — explicitly not a rewrite, and explicitly without growing either deliverable.
*Discovery:* Two real gaps survived the earlier reframe: (1) the product itself had disappeared — no screenshot or concrete description of what using Nahui actually looks like remained anywhere in either deliverable after the process-narrative rewrite; (2) two paragraphs/slides ("why agents," "why governance") were purely internal-process reasoning with zero reconnection back to Ana or the merchant problem. The appendix timeline diagram was also found more decorative than evidentiary — generic milestone labels rather than explicit cause→effect pairs.
*Decision:* Report: added one grounding sentence describing what Ana's day with Nahui actually looks like, reframed the endings of the "why agents" and "why governance" paragraphs to name Ana as the reason each exists, tightened other phrasing to net the report 32 words *shorter* than the prior version despite the additions. Rebuilt the timeline diagram with explicit cause→effect label pairs instead of generic milestones. Presentation: added one new slide ("Esto es Nahui," the real Home/selling screenshot) right after the origin-story slide, simplified two overly-dense slides (why agents, why governance) to one idea each by cutting their redundant lede paragraphs, and added an explicit Ana callback to the closing slide. Swapped a duplicate screenshot in the evidence-grid slide so no image repeats. All changes verified word-count-neutral or negative; no change to the core 8-beat narrative arc.
*Impact:* All four files in `evidence/2026-08-06-progress-report/` updated in place (report and companion notes DOCX, presentation HTML republished at the same artifact URL, `.pptx` rebuilt to match — now 14 slides). A full change log was given directly to the Product Owner in-conversation, organized by the same 9 review criteria.
*References:* `evidence/2026-08-06-progress-report/`.

---
**2026-08-06 — Pure language pass: em dashes removed from every deliverable**
*Context:* Product Owner requested a final writing-style-only review across all four files, explicitly not touching structure, narrative, or visuals: no em dashes as a narrative device, short direct sentences, avoid "not only... but also" constructions, and every paragraph should sound like something she would actually say, not something an author would write.
*Decision:* Rewrote every sentence containing an em dash across the report body, the four appendix diagram images (regenerated, since two captions were baked directly into the matplotlib output, not just doc text), every presentation slide (HTML and `.pptx`), and the full 14-slide speaker-notes script, replacing each with a short sentence, a comma, or a colon depending on what the spoken version would actually use. Also caught and fixed dashes in structural elements that aren't narrative prose but are still part of the artifacts: the HTML page `<title>`, an image `alt` attribute, and the speaker-notes doc's own slide-number labels. Consolidated the previously fragmented speaker-notes doc (earlier versions only recorded deltas between passes) into one complete, single-source script covering all 14 slides.
*Impact:* Verified zero em dashes remain in any of the four files via direct text extraction, not visual spot-check. Report word count and presentation slide count unchanged; only sentence-level phrasing changed.
*References:* `evidence/2026-08-06-progress-report/`.

---
**2026-08-06 — Narrative voice pass: first-person singular for Product Owner decisions, plural reserved for the agent system**
*Context:* Product Owner clarified this is an individual project and asked for a final consistency pass: her own decisions, designs, and discoveries needed first-person singular ("decidí," "diseñé," "introduje," "documenté," "descubrí," "validé"), with plural/team language reserved strictly for describing the AI agent system's own coordinated execution, never blending the two as "the AI and I" or presenting agents as co-authors.
*Decision:* Reclassified every sentence across all four files. Moments of her own design/discovery (freezing the Foundation, documenting the Decision Log, introducing the Merchant Experience Kit and Experience Validation, defining governance rules, personally finding the payment-privacy issue) converted to "yo." Moments describing the agent system's own coordinated behavior (a session-recovery gap during Main's coordination, the verification loop itself) kept in third person ("el sistema," "quien coordina") rather than "nosotros," to avoid any reading that blends her with the agents. Caught one significant miss on the first sweep: the presentation's own title, "Cómo construimos Nahui," used exactly the plural framing being corrected — fixed to "Cómo construí Nahui" across the HTML title, cover slide, `.pptx` cover, and every cross-reference to that title in the notes doc.
*Impact:* Verified zero incorrect first-person-plural verb forms remain in any of the four files via direct text extraction. Added a short explanatory note to the speaker-notes companion doc stating the voice convention explicitly, so it's documented, not just applied silently. Presentation republished at the same artifact URL under its corrected title.
*References:* `evidence/2026-08-06-progress-report/`.

---
**2026-08-06 — Final refinement: inline concept glossary, visual appendix, two new presentation slides**
*Context:* Product Owner confirmed the reframed narrative was right and wanted one more pass, not a rewrite: readers with no project context needed each concept (Fundación, Registro de Decisiones, Kit de Experiencia del Vendedor, Validación de Experiencia, Protocolo de Recuperación de Sesión, Bitácora, MCP) briefly introduced the first time it appears, without turning the report into a glossary or breaking the 3-page cap.
*Decision:* Rewrote the report narrative with one-clause definitions woven inline at each concept's first mention (word count held to ~1,240, still comfortably within 3 pages). Added a visual appendix (explicitly outside the page limit) with four diagrams — agent architecture, artifact relationships, the validation lifecycle, a project timeline — built with `matplotlib` in Nahui's actual brand colors, not text tables. Added two new presentation slides without touching the existing 11-slide story: a responsibilities-not-technology flow (Product Owner → Main → agentes especializados → herramientas MCP → Validación de Experiencia → Alta Fidelidad) and a real-artifact evidence grid, reusing actual Figma screenshots already captured rather than illustrations.
*Impact:* All three files in `evidence/2026-08-06-progress-report/` updated in place; presentation republished at the same artifact URL. Product Owner separately asked whether the presentation could have been built as an editable file (PowerPoint/Keynote); clarified the current deliverable is a branded HTML page (the closest equivalent to a "Canvas" in this environment) and that a native `.pptx` is technically achievable the same way the Word report was generated — offered as a follow-up, not yet requested.
*References:* `evidence/2026-08-06-progress-report/`.

---
**2026-08-06 — Experience Validation Coverage Matrix created**
*Context:* Product Owner requested a coverage matrix cross-referencing `information-architecture.md`'s 5 canonical User journeys against actual `merchant-user-tester` (Ana) test coverage, distinct from spec-review or Main's own manual verification.
*Discovery:* Every `merchant-user-tester` run to date has entered through Onboarding or an already-active NFC Session — none has walked Event scheduling, Event close, or Resultados/Review at all, and even within Selling, Ana has never personally completed Finalizar Venta or Cerrar Sesión through to their terminal states (Main performed those specific taps during independent verification, not the persona). Not a fidelity gap — all relevant screens are done at Medium-Fidelity — a dispatch-scope gap: every run so far has focused on the NFC-mode Home/Settings/Inventario area where the night's findings originated.
*Decision:* New standing artifact created: `product/02-ux/experience-validation-coverage.md`. Explicitly excludes `experience-review-2026-08-04.md` from coverage credit — that was a Product-Owner-led walkthrough, not a `merchant-user-tester` run, a different verification mechanism.
*Impact:* Recommended next-dispatch priority, in Core Thesis order: (1) Selling, completed end-to-end by the persona, not just navigated around; (2) Review/Resultados, zero coverage today; (3) Event scheduling; (4) Event close, lowest urgency.
*References:* `product/02-ux/experience-validation-coverage.md`; `product/00-foundation/information-architecture.md`.

---
**2026-08-06 — Knowledge Mentor introduced: a shared, consultation-only knowledge layer, plus a reusable Consultation Pattern**
*Context:* Product Owner wanted to introduce a long-term Research capability — evidence-gathering across a curated local `Knowledge/` repository, general model knowledge, and external sources — without it ever making decisions, modifying artifacts, or acting as a reviewer. Refined through several rounds: first scoped as a plain search function, then reframed as an organizational "knowledge mentor" consulted by `ux-critic`/`ux-designer`/`ui-designer`/`architect` (reducing duplicated reading and duplicated token cost across those four), then corrected on one architectural point — the specialist requesting a consultation, not Main, must be the one who determines whether its own objective trigger is met, keeping Main a pure orchestrator rather than a reasoning supervisor.
*Decision:* Created `.claude/agents/knowledge-mentor.md` — `Read`/`Glob`/`Grep`/`WebSearch`/`WebFetch` only, no `Write`, strict origin-tagging (Local Knowledge / Model Knowledge / External Sources) on every claim, never classifies findings, never overrides Foundation, never replaces the requesting specialist's judgment. Documented the interaction shape as a new, explicitly reusable **Consultation Pattern** in `company/CLAUDE.md` (specialist determines the need → specialist requests and stops → Main orchestrates only → specialist retains full responsibility), generalized from the escalation mechanism `ux-critic`/`reviewer`/`ux-designer` already used with `architect` — not a new governance shape, a named and generalized version of an existing one. Added objective, task-shape consultation triggers (never "if you have doubts") to `architect.md`, `ux-critic.md`, `ux-designer.md`, and `ui-designer.md`; explicitly excluded `reviewer` (internal-consistency-only mandate) and `merchant-user-tester` (knowledge isolation is load-bearing to its entire purpose) by design, with `planner`/`marketing` flagged as natural future consumers once relevant `Knowledge/` domains exist.
*Impact:* First `Knowledge/` domain (`Knowledge/UX-UI/index.md`) already points at an external, uncopied course repository; future domains (Software Architecture, Payments, Security, Cloud, etc.) can be added the same way with zero edits to the agent itself, since it reads `Knowledge/`'s structure at consultation time rather than hardcoding a domain list. The Consultation Pattern is explicitly documented as the standard shape for any future consultative agent, not something unique to Knowledge Mentor.
*References:* `.claude/agents/knowledge-mentor.md`; `company/CLAUDE.md` (Delegation, Consultation Pattern, Knowledge Mentor sections); `Knowledge/UX-UI/index.md`; `.claude/agents/architect.md`, `ux-critic.md`, `ux-designer.md`, `ui-designer.md`.

---
**2026-08-06 — Review-architecture governance changes: Horizontal Journey Review, wiring-escalation, mandatory coverage gate, decision-log re-audit**
*Context:* A Product-Owner-led walkthrough of "Empezar gratis" (`product/02-ux/experience-review-2026-08-04.md`'s successor conversation, not yet its own persisted review doc) found four real defects the existing review pipeline never caught: a repeated "empezar" action verb across consecutive onboarding screens, apparent NFC-oriented content reachable from a free-tier path, a registration flow that felt like repeating the same step, and inventory content the merchant never entered. A responsibility analysis (not a fix pass) traced each to one of three structural causes, not agent incompetence: a narrative-continuity heuristic `ux-critic` was already mandated to check but had never operationalized; a documented, accepted tooling limitation (`company/infrastructure-decisions.md` ID004 — `ux-critic`/`reviewer` cannot see Figma reaction/wiring data) that leaves capability- and state-gated boundaries verifiable only by empirical click-through; and an unowned seam between independently-approved `product/02-ux/*.md` documents, since the folder's own "one experience reviewed before the next" rule was never paired with a review of the transition between two already-approved ones. Verification during the analysis found first-party confirmation: the "Empezar gratis" Todo-listo variant (`71:955`) has zero destination-wiring documentation anywhere in `product/02b-medium-fidelity/onboarding.md`, unlike its sibling "Ver un ejemplo" variant, whose wiring bug was found and fixed months earlier — and `product/02-ux/CLAUDE.md`'s own status log was caught self-contradicting a correction it claimed to have already made.
*Decision:* Four governance changes added to `company/CLAUDE.md`: a new **Horizontal Journey Review** (`ux-critic` reviews the full concatenated screen sequence of a journey's approved documents, not each one independently, before Medium-Fidelity build starts and again before that journey's build is "done"); a **wiring-dependent-findings** rule (neither `ux-critic` nor `reviewer` may treat a capability/state-gated boundary as verified from content inspection alone — it must be named, then Main reproduces it directly or dispatches `merchant-user-tester`); **coverage is a gate, not a queue** (a journey's Medium-Fidelity "done" status now requires `merchant-user-tester` Fully Tested coverage per `experience-validation-coverage.md`, or a logged, named exception — closing the exact dispatch-priority gap that left "Empezar gratis" untested); and a new **Decision-Log Re-Audit** duty (a `decision-log.md` entry that tightens an earlier rule triggers `reviewer` to cross-reference every other Approved artifact referencing that rule, not only the one being amended). Matching instructions added to `ux-critic.md` (narrative-continuity heuristic, a distinct Horizontal Journey Review mode, wiring-dependent-findings instruction) and `reviewer.md` (capability/state-boundary verification limit, decision-log re-audit duty). `product/02-ux/CLAUDE.md`'s per-document approval rule got a companion sentence pointing at the new seam review; `experience-validation-coverage.md` got a sentence stating it's now an enforced gate, not passive tracking. No change made to `merchant-user-tester.md` itself — full-journey dispatch scope is Main's own dispatch discipline, not agent behavior, so it belongs in `company/CLAUDE.md`'s gate language rather than in agent instructions the agent has no control over.
*Impact:* None of this fixes the four original findings — that remains explicitly out of scope, unstarted. What changed is structural: the next time a similar defect exists in an untested seam or an unverifiable wiring boundary, the gates above are designed to surface it before a human has to find it by hand again.
*References:* `company/CLAUDE.md` (Horizontal Journey Review, Decision-Log Re-Audit, Experience Validation sections); `.claude/agents/ux-critic.md`, `reviewer.md`; `product/02-ux/CLAUDE.md`; `product/02-ux/experience-validation-coverage.md`; `company/infrastructure-decisions.md` ID004; `product/00-foundation/decision-log.md` D27.

---
**2026-08-06 — The four onboarding findings: all fixed, exercising the review-architecture gates the same day they were built**
*Context:* Following up on the responsibility analysis above, the Product Owner asked to actually fix the four findings from her "Empezar gratis" walkthrough — redundant "Empezar" copy, apparent NFC content on the free path, a "register, register" repeated-step feeling, and phantom inventory. Each was routed to its owning specialist per the new governance, not fixed by Main directly.
*Decision:* **Finding 1** (redundant verb) — `ux-designer` renamed Todo listo's CTA "Empezar"→"Entrar" across all three variants in `onboarding.md`; `ux-critic` verified clean. **Finding 3** (repeated steps) — `ux-designer` traced it outside `onboarding.md` entirely, to a `home.md`/`inventory.md` seam; `ux-critic`'s new Horizontal Journey Review mode classified it as Major (`HJR-INV-M1`); `ux-designer` fixed it (`inventory.md`'s heading "Registrar mercancía"→"Registro de mercancía"); `ux-critic` and `reviewer` both verified clean, though `reviewer` caught the Figma build hadn't been re-synced — closed by a follow-up `ui-designer` dispatch (30 heading nodes, full-file search, not just the 4 originally suspected). **Findings 2 & 4** (NFC content, phantom inventory) — `ui-designer`'s first static reaction trace found the Onboarding→Home wiring clean, contradicting the Product Owner's own report; rather than accept that as closed, she directed continued investigation from the exact path she'd walked. A `merchant-user-tester` live re-walk (after Main fixed a browser-session tooling gap blocking the first attempt) reproduced both findings for real, with diagnostics pinpointing the actual cause one hop downstream: Inventario's own "Guardar mercancía," on the buttons-only path, was silently routing into an NFC tag-assignment queue. Root cause: the 2026-08-05 NFC-activation-chain build had hijacked a shared "saving" node — the same "shared node reused across the wrong context" pattern already seen six times the night before, now found a seventh time in a new location. `ui-designer` fixed it (cloned the node for the NFC leg's own use, restored the original's correct destination, rewired 10 total affected callers) — independently confirmed by Main via live click-through, and structurally corroborated by `ux-critic`.
*Discovery, distinct from the fix itself:* live-verifying the fix surfaced two content-fidelity questions (a static confirmation screen showing seeded quantities instead of what was entered; a product picker that always shows "Pijama" regardless of which row is tapped). The Product Owner's ruling on both, stated as a general standard: at Medium-Fidelity, static content is acceptable *unless it contradicts the selected journey or creates business-rule confusion* — the NFC-routing bug crossed that line (D27 violation), these two don't. Saved as a durable memory (`feedback_medium_fidelity_static_content.md`) since it's a reusable standard, not a one-off ruling.
*Impact:* All four original findings closed. Two new, previously-unknown defects found along the way (a product-picker binding gap, now logged as a disclosed limitation matching an existing production-page precedent) and one new documentation-consistency gap caught and fixed (a tracking file claiming "0 Important findings" that hadn't been updated after a real one was found). The review-architecture governance built earlier the same day — Horizontal Journey Review, the wiring-escalation protocol, mandatory `merchant-user-tester` coverage — wasn't theoretical by the end of this session; every piece of it fired at least once on real, current work.
*References:* `product/02-ux/onboarding.md`, `home.md`, `inventory.md`, `ux-critic-findings.md`; `product/02b-medium-fidelity/inventory.md`, `CLAUDE.md`; `product/02-ux/experience-review-2026-08-06-c.md`; `product/02-ux/experience-validation-coverage.md`; `product/00-foundation/decision-log.md` D19/D27.

---
**2026-08-07 — Where wiring belongs: the Consultation Pattern's first real test, and a genuine "no" to the Product Owner's own hypothesis**
*Context:* After fixing the day's wiring bugs, the Product Owner asked an architectural question and explicitly required it be answered through the new consultation architecture rather than by Main's own reasoning: should wireflows/navigation be part of the design definition itself, authored at Low-Fidelity, rather than something that emerges during Medium-Fidelity/Figma work? Stated explicitly as a hypothesis not to be assumed correct — evidence was to drive the conclusion.
*Decision:* `architect` was dispatched first and determined the question wasn't its own domain (no aggregate/IA/ubiquitous-language implication), naming `ux-designer`/`ui-designer` as the actual owners — while still gathering real evidence en route (`onboarding.md` §4 was already an exhaustive node-level flow; the "undocumented destination" case that motivated the question turned out to be a tracking gap, not a missing-spec gap). Both named specialists independently verified that evidence rather than taking it on faith, and both requested their own `knowledge-mentor` consultation — Nahui's first real use of the capability — rather than reasoning from impression. `knowledge-mentor` grounded both against the curated `Knowledge/UX-UI/` course material plus external sources (NN/Group, Figma's own documentation/forum on the identical shared-screen problem), tagging every claim by origin as designed. Verdict, converging independently from both specialists: the Product Owner's hypothesis holds for *naming* (which destination each branch/error/interruption resolves to — genuinely belongs upstream, and was informal before, now an enforced rule) but not for *wiring* (making a transition clickable, resolving Figma's one-destination-per-reaction constraint — conventionally and correctly resolved downstream; no source found supports moving it earlier, and today's specific bugs weren't preventable by doing so, since the violated constraint doesn't exist as a concept before a prototyping tool is involved).
*Impact:* `product/02-ux/CLAUDE.md` §4 gained an enforced naming rule (named destination or explicit "Not yet resolved" marker, no silent gaps), a shared-state ID-reference convention, and an explicit "wiring originates in the spec, never in Figma" clause. `ui-designer.md` gained a mandatory caller/destination audit before rewiring any shared node. `reviewer`'s consistency check on the new rule found zero Blockers but one real, pre-existing drift it caught as a side effect: `ux-designer.md`'s own tool grant and description still referenced Figma MCP tools and visual design work — leftover from before D24 split `ui-designer` out as its own agent, never corrected until this review. Fixed: `ux-designer.md` rewritten to match its actual scope (`Read`/`Glob`/`Grep` only, ASCII/text, implementation-independent, hands off to `ui-designer` not `builder`). Logged as `decision-log.md` D31.
*References:* `product/00-foundation/decision-log.md` D31; `product/02-ux/CLAUDE.md` §4; `.claude/agents/architect.md`, `ux-designer.md`, `ui-designer.md`, `knowledge-mentor.md`; `company/CLAUDE.md` (Consultation Pattern).

---
**2026-08-07 — §4 rule wording tightened: dropped an overclaim about where "wireflows" universally sit**
*Context:* The same `ux-designer` dispatch that finalized D31's §4 rule kept self-refining after its first "final" answer landed, catching its own overreach: the persisted text asserted Nahui's Low-Fidelity docs sit at "the abstract flow-diagram / user-flow stage, not the wireflow stage" — a categorical claim about UX methodology the consultation evidence itself didn't support (even the single local source consulted used "wireflow" inconsistently across its own decks).
*Decision:* Reworded §4 to state the exhaustive-destination-naming bar as Nahui's own process decision for this document, not a claim about universal convention — "what matters here is what this project requires of this document, independent of the label." Also renamed the "naming requirement" framing to "navigation-definition requirement," a more accurate description of what §4 actually asks for (canonical destinations, not just labels).
*Impact:* `product/02-ux/CLAUDE.md` §4 updated in place. No change to the underlying conclusion (naming stays upstream, wiring stays downstream) — this was a precision correction to the rule's own justification, not a reversal.
*References:* `product/02-ux/CLAUDE.md` §4; `product/00-foundation/decision-log.md` D31.

---
**2026-08-07 — First full execution of the Governance Rollout Cascade, D31/§4: found and fixed a real defect the rule change was meant to catch**
*Context:* Product Owner asked for the D31/§4 rollout to run as the standard cascade rather than a one-off review, and to keep applying it as the new standard for future governance changes. Full five-step run: update the rule (already done) → audit all 6 Low-Fidelity docs → fix deviations → verify Medium-Fidelity realizes what's now defined → report gaps → only then consider adopted.
*Decision:* **Step 2** — `reviewer` audited all 6 Approved docs; found a real, repeated pattern (3 of 6 dropped the decline branch of a confirm/decline dialog from their own §4, independently, in `home.md`/`inventory.md`/`events.md`). `ux-designer` fixed all three plus an optional `reports.md` citation improvement in one batch; `reviewer` re-verified clean. **Step 3** — `ui-designer` traced the newly-defined branches against the actual Figma build and found the hypothesis confirmed directly: 6 of 7 were unwired, the one exception being the one branch that was already unambiguous before today's rule existed. Fixed across three follow-up rounds (missing reactions, a genuinely unbuilt local-override content state — correctly not invented on the spot, built properly with Design System components — and inbound triggers into two confirmation frames that had zero live callers at all). **Step 4** — `ux-critic`'s structural pass on this round caught its own earlier scope gap (a first pass had only checked new-frame content, not link destinations) and, in redoing it properly, surfaced a genuine Blocker `reviewer` confirmed: a capability-revoked screen's "Ir a Configuración" routed to a frame asserting an active Paid plan — impossible given the very condition (D27) that reaches that screen. Fixed (routed to the correct, already-built Free-tier frame); `ux-critic` re-verified the fix's content directly rather than trusting the report; Main live-click-verified all three wiring-dependent boundaries this round touched (`ux-critic`/`reviewer`'s tools structurally can't see reaction data, ID004) via the established cross-page URL-fallback tab-opening pattern (ID003). `reviewer` gave final sign-off: all three documents Foundation-consistent, no Blockers, no Important findings.
*Impact:* This is the cascade's first full run, and it justified itself directly — not administrative overhead. The pattern `ui-designer` predicted held exactly: every branch left unspecified before today's rule was also unwired in Figma, and the deepest issue found (a D27 contradiction) was hiding specifically in a spot no prior review had ever actually checked, surfaced only because this round's own process discipline (re-scoping an incomplete review rather than accepting it) caught it. Also demonstrated the wiring-dependent-findings protocol working exactly as designed three separate times in one round: `ux-critic` naming an unverified boundary instead of assuming, Main closing it via live click-through, `reviewer` treating "verified how" as part of what it checks before signing off.
*References:* `company/CLAUDE.md` (Governance Rollout Cascade); `product/02-ux/home.md`, `inventory.md`, `events.md`, `reports.md`; `product/02b-medium-fidelity/home.md`, `inventory.md`, `events.md`; `product/00-foundation/decision-log.md` D27, D31; `company/infrastructure-decisions.md` ID003, ID004.

---
**2026-08-07 — D32: is a canonical-journey layer missing, or is this a Medium-Fidelity classification gap? A second architectural investigation the same day, from a fresh real observation**
*Context:* After the full D31 remediation round closed, the Product Owner walked "Empezar gratis" again and still reached the NFC experience — a real, reproduced observation, not theory. She asked whether this meant `product/02-ux/`'s experience-organized specs structurally permit journey leakage, and whether a first-class canonical-journey artifact is missing — explicit constraint: the single seamless Figma prototype stays, no fragmentation, no predefined solution.
*Decision:* `architect` split the question correctly rather than absorbing or fully declining it: `information-architecture.md` is sufficient (grounded in D28 precedent — IA's journeys are deliberately loose, not exhaustive contracts), but whether a journey artifact should exist is `ux-designer`'s/`ui-designer`'s call, not architect's. Both verified independently rather than ratifying architect's framing: `ux-designer` traced every cited incident to Figma-layer node reuse against specs that were already correct — proving it by finding `inventory.md`'s own spec already branching the exact state that caused the Guardar-mercancía hijack, unprompted — and declined a `knowledge-mentor` consultation with a stated reason (direct repo evidence was stronger than an abstract citation would be). `ui-designer` confirmed the mechanism via direct screenshot comparison across multiple incidents (shared content, diverging navigation) and surfaced a second risk axis from Finding 9 (a correctly-triggered clone can still use the wrong template). One notable process moment: a first attempt to have `ui-designer` "finalize its own dispatch's" recommendation correctly refused — a fresh, stateless subagent instance has no real memory of an earlier dispatch, and it correctly declined to author text for its own governing config file based on a claim of continuity it couldn't verify. Redispatched with honest framing (Main relaying an earlier finding, asking for independent judgment, not self-authorization) and it proceeded correctly. A final `knowledge-mentor` consultation (a narrow follow-up, not a fresh topic) found Figma's more "elegant" caller-owned mechanisms (instance overrides, Variables) both carry documented silent-failure modes reproducing the exact bug — confirming cloning as the right mechanism for this tool, not the merely expedient one.
*Impact:* No canonical-journey artifact, no Foundation change, no further `product/02-ux/CLAUDE.md` §4 extension — both evaluated and rejected on evidence, not assumed unnecessary. `.claude/agents/ui-designer.md`'s caller-audit rule sharpened: a two-axis (content/navigation) classification now triggers proactively, at node-identification time, not only reactively before a rewrite. Logged as `decision-log.md` D32.
*References:* `product/00-foundation/decision-log.md` D32 (and D28, D31 it builds on); `.claude/agents/architect.md`, `ux-designer.md`, `ui-designer.md`; `product/02b-medium-fidelity/CLAUDE.md`.

---
**2026-08-07 — "Empezar gratis" demo-safety audit: the actual leak found and fixed, and a real regression caught before it shipped**
*Context:* Right after D32 concluded the architecture was sound, the Product Owner reframed the same underlying concern as a demo-quality question, not an architecture one: she wanted every reachable path from "Empezar gratis" traced and every unintended transition into NFC or another journey eliminated, with the single seamless prototype kept intact — safe to hand to a user without having to explain away a wrong screen.
*Decision:* Four parallel, read-only trace passes (one per surface: Home, Inventario, Eventos, Selling+Resultados) found one real, confirmed, multi-hop cross-journey leak — Eventos' silent-save screen (`162:1896`) auto-continuing into the NFC-twin confirmation instead of its own buttons-only twin, chaining three hops deep into NFC session/settings/inventory content via that screen's own tab bar. Almost certainly the exact bug the Product Owner had personally hit. Also found: a same-journey Configuración back-link trap (returned to Cold Start regardless of origin — turned out to have 9 real origins, not the 3 assumed) and a pervasive dead tab bar across nearly every frame in the journey, explicitly included in scope per the Product Owner's own framing that non-functional navigation is part of demo quality. All three fixed: the leak by a one-line repoint, the trap by cloning 9+8 nodes on the navigation axis (a residual, deeper instance left explicitly unfixed as out of scope), the tab bar by restoring ~90 dead reactions to already-established destinations only, no new navigation invented. **Before closing the batch, `ux-critic`'s structural review caught a real regression the fix itself had introduced**: repointing the shared save-node away from the NFC path plausibly orphaned the 2026-08-05 Connected NFC activation-to-sale chain, since no dedicated NFC clone of that node existed. Verified true, investigated properly (the assumed fix pattern didn't fit the actual structure, so `ui-designer` adapted rather than forcing it), and fixed with two clones instead of one. Main live-click-verified both the original leak's fix and the regression's fix, end to end, on the actual prototype.
*Impact:* Both journeys now demonstrably stay within their own boundaries on the seamless prototype — verified by direct click-through, not inference. Three genuine, separate gaps were found and deliberately left open rather than absorbed into this pass: buttons-mode has no session-close block state, "Cancelar evento" has no reachable entry point in this journey, and Configuración's trap has a residual two-levels-deep instance. All three logged for `ux-designer`/a future pass, not silently fixed or silently dropped. Also worth naming as process evidence: a fresh `ui-designer` dispatch correctly refused a request framed as "finalize your own last dispatch" since it had no real memory of proposing anything — caught a false-continuity error on Main's part, not a flaw in the agent.
*References:* `product/02b-medium-fidelity/CLAUDE.md` (2026-08-07 entry, full node-level record); `product/00-foundation/decision-log.md` D31, D32; `.claude/agents/ui-designer.md`; `company/infrastructure-decisions.md` ID001, ID004.

---
**2026-08-07 — Full demo-quality remediation closed: both journeys clean, seven manual observations resolved without a single new decision**
*Context:* Direct follow-up to the same day's leak fix — the Product Owner asked for a complete pass: close the three deferred gaps, fully revalidate the Premium/NFC journey without breaking the now-correct Free/buttons one, and investigate four things she'd personally observed (NFC falling back to buttons, stale "Activar plan de pago" copy after paying, plan/mode state inconsistency, "Clientes frecuentes" activation model) plus the post-payment/NFC-kit transition — explicit instruction not to guess business intent, escalate through Decision Ownership if genuinely unresolved.
*Decision:* `architect` grounded all seven items against `decision-log.md`/`domain-model.md`/the approved specs before any Figma work — every one resolved to **Already Decided** or **Build Defect**, zero new Product/Business/Architecture Decisions needed. Notably: the "paid but no kit yet, keep selling with buttons, activate NFC later" experience the Product Owner described is *already the designed behavior* (D27, `home.md` §3.6a's fourth variant); "Clientes frecuentes" being independently activatable regardless of plan tier is *correct*, not a bug (D22/D25 — only the Resultados display needs paid tier); mid-Session mode reversion is never sanctioned, cross-Session reversion via NFC Readiness is. Both previously-deferred "missing" states (buttons-mode session-close block, "Cancelar evento") turned out to already be fully defined in approved specs, just unbuilt. The Premium/NFC trace confirmed the Product Owner's own observation directly — a real, reproducible leak (`188:1574`, reached from the NFC selling screen's own Cancelar link) explains the "falls back to buttons" report exactly, plus five more leaks in the same pass, including one inside that same day's own earlier NFC-chain fix. All fixed: 8 NFC-surface defects, the session-close block (reusing the approved production frame verbatim), "Cancelar evento" (reusing approved content, with one disclosed content-reuse determination), and the Configuración trap's full 27-node depth (traced properly rather than assuming the smaller scope first guessed). Closing `ux-critic`/`reviewer` passes both clean. One Major finding from `ux-critic` — a newly-connected "Cancelar evento" sequence appearing to silently erase unrelated events — was investigated against the spec rather than fixed or dismissed: `ux-designer` found a direct structural sibling section (§3.10) establishing this project's own existing convention for "ambient, returns to list" screens is minimal illustrative content, not an exhaustive snapshot — resolved as not-a-defect, correctly consistent with prior practice, no fix applied.
*Impact:* Both the Free/Buttons and Premium/NFC journeys are now clean — verified structurally, against the Foundation, and by direct live click-through on the highest-risk paths, not asserted from reports. Zero new decisions were required anywhere in this pass; every open question had an existing, correct answer once actually checked against what's already approved.
*References:* `product/02b-medium-fidelity/CLAUDE.md` (2026-08-07 entries, full record); `product/02-ux/home.md` §3.6a/§3.11/§3.11a; `product/02-ux/events.md` §3.10/§3.11-§3.13; `product/00-foundation/decision-log.md` D22, D23, D25, D27, D31, D32.

---
**2026-08-07 — Stale plan-tier display after activation fixed and verified; ID012 tooling gap found along the way**
*Context:* Product Owner personally hit a repro: activate the paid plan, briefly see "Tu plan: Pago," tap back, reopen Configuración, land back on a frozen "Tu plan: Gratis." `ui-designer` traced it one hop past the initial hypothesis — the activation confirmation chain itself was already correct; the defect was on the *return* path, where a heavily-shared plain Home node's session-controls sheet routed into Configuración via a hardcoded pre-activation reaction, affecting all five "just changed a paid-tier setting" confirmations that share that node, not only plan activation.
*Decision:* Fixed with a narrowly-scoped nav-diverge clone (`579:2538` Home, `579:2545` its session sheet), closing the loop back onto the paid confirmation screen without recloning the whole shared Home node. Main live-verified the fix directly via `chrome-devtools-mcp`, walking the real path (Home clone → sheet → Configuración → paid `184:1665` → Back → Home clone again) rather than trusting the build report alone. First verification attempt produced a false negative — clicking the Back link (`184:1666`, a Figma "Back"-type reaction) via synthetic `click` reported success but never navigated, reproduced identically on an unrelated, untouched sibling back-link, then resolved cleanly via `press_key({key:"Enter"})` on the same focused element. Documented as `company/infrastructure-decisions.md` ID012 so a future session doesn't misread the same false negative as a real regression.
*Impact:* The fix is confirmed correct end-to-end, not just reported. `merchant-user-tester`/Main's live-verification protocol for Back-type reactions is now: click to focus, then `Enter` to trigger — a click alone is not sufficient evidence of breakage.
*References:* `company/infrastructure-decisions.md` ID012; `product/02b-medium-fidelity/home.md`.

---
**2026-08-07 — Pending-tags task-priority refinement: from a Product Owner observation to an Approved spec amendment, via a two-round independent-investigation discipline**
*Context:* Product Owner personally noticed that returning to Inventario after deferring NFC tag assignment seemed to push her toward "Registrar mercancía" (register new merchandise) rather than resuming the pending tagging queue — and asked whether Nahui was unintentionally mixing two business processes (reception vs. tagging), with an explicit instruction not to assume she was right and to investigate via independent agent perspectives rather than Main's own reasoning.
*Discovery/Decision, round 1 (process-mixing question):* `architect` and `ux-designer`, dispatched independently with no cross-visibility, both concluded no — reception and tagging are one Inventory-context process (`domain-model.md`'s bounded-context table, one shared verb set), and the Foundation's own completion semantics already distinguish the two capability tiers honestly (`inventory.md` §3.12 "registrada" vs. §3.13 "lista para vender"). `merchant-user-tester`'s parallel live-walk attempt surfaced two separate, real tooling/build problems instead of reaching the question: a zero-open-browser-pages tooling gap (`merchant-user-tester` has no `list_pages`/recovery tool, fixed by Main opening a fresh page and resuming the agent) and a genuine, previously-undocumented dead tab bar on the post-plan-activation Home clone (`184:1503`, "H1 clone of 36:29") — independently reproduced by Main, who also ruled out two false leads (an open Figma "Flows" sidebar, and the same-day ID012 click-vs-Enter quirk) before concluding it's a real, separate defect. Left unfixed pending the Product Owner's explicit sequencing instruction.
*Discovery/Decision, round 2 (task-priority question):* Product Owner narrowed the question to whether the Foundation implies *priority* (not just process ownership) between "Registrar mercancía" and "Continuar etiquetando." `architect`: the Foundation is silent on priority specifically — it guarantees Registrar Mercancía stays reachable (a floor), never that it stays visually primary — leaving the question open to UX judgment. `ux-designer`, building on that opening: the current build's persistent-bottom-button treatment conflates "always available" with "primary," and the spec's own internal reasoning (§7's physical-continuity logic, §2 step 3's auto-continuation default, §3.13's "lista para vender" wording) already favors "Continuar etiquetando" in this specific mid-task state — faithful to the letter of the old spec, drifted from its own priority logic.
*Decision:* Product Owner ruled this a UX refinement, not a new Product Decision, and directed `ux-designer` to propose an actual fix. `ux-designer` proposed (and Main applied) a full amendment to `product/02-ux/inventory.md` (§2, §3.5, §3.17, §4, §7, §9, new §10 entry): "Continuar etiquetando" becomes the primary action (unboxed status line + CTA, mirroring `home.md` §3.6's shape) in the pending-tags state; "Registrar mercancía" stays in its existing position with unmodified reachability, now explicit as secondary in that one state only. `ux-critic`: clean pass, 2 non-blocking Suggestions (INV-S4/S5, logged). `reviewer`: clean pass, 1 Important documentation-hygiene finding (a stale, contradicting §10 bullet) — fixed by Main. Folded back into Approved.
*Impact:* `inventory.md` and `product/02-ux/CLAUDE.md`/`ux-critic-findings.md` all updated and cross-referenced. Two real, disclosed defects remain deliberately unfixed pending Product Owner authorization: the dead Home→Inventario tab bar (`184:1503`) and the already-known dead "Terminar después" button on the demo page (`284:526`, disclosed at build time, 2026-08-05) — both block `merchant-user-tester` from validating this refinement end-to-end on the live prototype, which is the explicitly agreed next step now that the design itself is settled.
*References:* `product/02-ux/inventory.md` §3.5/§3.17/§10; `product/02-ux/CLAUDE.md`; `product/02-ux/ux-critic-findings.md` (INV-S4, INV-S5); `product/02b-medium-fidelity/CLAUDE.md` (dead "Terminar después" disclosure).

---
**2026-08-07 — Correction: the "dead Home tab bar" finding above was a tooling artifact, not a real build defect; both authorized wiring fixes built and live-verified**
*Context:* `ui-designer` built the pending-tags CTA hierarchy into Medium-Fidelity and investigated the two wiring gaps authorized above. For the dead-tab-bar item, its own `node.reactions` readback found the wiring already correct and flagged the contradiction back to Main rather than "fixing" data that wasn't broken.
*Discovery:* Main re-tested live and found the earlier reproduction was itself flawed — a contaminated test sequence (multiple clicks before a single `Enter`, so `Enter` fired on stale prior focus, not the intended target) plus, once isolated properly, a genuine but page-specific automation artifact: a long-lived `chrome-devtools-mcp` browser tab, reused across dozens of navigations this session, had stopped delivering clicks correctly on that one frame. A brand-new page at the identical URL worked immediately, landing exactly on the destination `ui-designer`'s data-layer check had predicted. Documented as `company/infrastructure-decisions.md` ID013.
*Correction:* The "Defect A" dead-tab-bar finding is retracted — it was never a real product defect. No design or wiring change was needed or made for it.
*Decision/Impact:* The other authorized item (the disclosed dead "Terminar después" on the demo page) was real and is now fixed: `ui-designer` cloned the rebuilt §3.5/§3.17 pair onto the demo page (`593:526`/`593:542`) and a navigation-axis clone of the NFC Registrar-Mercancía entry (`594:2659`), wiring the full loop. Main live-verified the entire new chain end-to-end on a fresh page: `284:526` ("Terminar después") → `593:542` (new hierarchy, screenshot-confirmed — "Continuar etiquetando" reads as clearly primary, "Registrar mercancía" clearly secondary) → "Continuar etiquetando" correctly resumes to `284:526`; separately, "Registrar mercancía" correctly reaches `594:2659`. The production master frames (`47:38`/`47:65`) were also rebuilt with the same hierarchy and a Secondary-variant swap on "Registrar mercancía" (closing `ux-critic-findings.md`'s INV-S5). Next: `ux-critic` review of the build, then `merchant-user-tester` validates the actual experience — using a fresh page per ID013's lesson.
*References:* `company/infrastructure-decisions.md` ID013; `product/02b-medium-fidelity/inventory.md` (frame table pending update with new IDs: `47:38`/`47:65` rebuilt, `593:526`/`593:542`/`594:2659` new demo clones).

---
**2026-08-07 — Pending-tags fix closed: `ux-critic` clean, `merchant-user-tester` validates the core question, one same-day defect found and fixed**
*Context:* Closing out the full pipeline from the Product Owner's original observation through to a validated, live experience.
*Discovery/Decision:* `ux-critic`'s Medium-Fidelity review: clean pass (one non-blocking Minor, a button-width inconsistency, `INV-MF-MIN1`) — confirmed the built hierarchy genuinely reads as primary/secondary, not just structurally, closing `INV-S5`. `merchant-user-tester` then ran the actual validation task (activate → register → tag → defer → navigate away → return) and, at the exact moment being tested, reported: "'Continuar etiquetando'... [was] exactly the reassurance I needed," confidence "rose the most" there, and named the state-preservation as the one thing she'd tell another vendor about — no trace of "repeating work." Main independently corroborated via direct click-through immediately prior. The run also surfaced a real, same-day defect: `593:526`/`593:542`'s bottom nav bar was completely unwired (created after the earlier tab-bar restoration sweep, never inherited it) — confirmed structurally by Main, fixed by `ui-designer` (sourcing destinations from the nearest correct sibling, `284:535`, not guessing), and live-verified by Main on a fresh page. Five further findings surfaced outside this task's scope (plan-activation not visibly sticking on first attempt, an unexplained Home state jump, an unresponsive Cantidad field, plus two likely-already-accepted static-content limitations) — logged as Pending Verification, not yet investigated, Product Owner to prioritize.
*Impact:* The original Product Owner observation is fully closed: root-caused (not a business-process conflation), redesigned (Foundation-consistent UX refinement), built, reviewed, and now behaviorally validated by a naive first-time-merchant proxy — the complete pipeline this project's governance describes, exercised end-to-end in one day.
*References:* `product/02-ux/experience-review-2026-08-07.md`; `product/02-ux/ux-critic-findings.md` (INV-MF-MIN1); `product/02b-medium-fidelity/CLAUDE.md`.
