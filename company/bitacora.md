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
