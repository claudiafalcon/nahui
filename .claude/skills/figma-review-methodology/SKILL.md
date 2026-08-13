---
name: figma-review-methodology
description: How to inspect a Figma artifact read-only during a review (ux-critic, reviewer) — which tools to use, the one-call-diagnostic-first pattern for connectivity gaps, and the standing rule for disclosing reaction/wiring-dependent findings as unverified rather than passing them on content inspection alone. Load before reviewing any Medium/High-Fidelity Figma deliverable.
---

# Figma Review Methodology

Shared by `ux-critic` and `reviewer` — both hold the same read-only Figma toolset (`get_metadata`, `get_screenshot`, `get_design_context`, `whoami`) and hit the identical two structural gaps below. Extracted because both agent files carried this near-verbatim.

## Inspecting the artifact

When the deliverable under review lives in Figma rather than as markdown/ASCII, inspect it directly — don't review the build report's own description of what it built, or the spec text it's implementing, as a substitute for looking at the actual artifact.

- `get_metadata` and `get_screenshot` are plain read calls, no skill-loading prerequisite. Use `get_metadata` for frame structure (hierarchy, component instances, variant properties in use) and `get_screenshot` to see the rendered result directly.
- `get_design_context` requires a mandatory skill load first (`figma-design-to-code`). If there's no way to load it, skip that tool and rely on `get_metadata`/`get_screenshot` — sufficient for a UX-quality or Foundation-consistency review (this isn't a design-to-code translation task).
- If the Figma file isn't reachable at all this dispatch despite the tools being declared, say so plainly, do only the checks genuinely verifiable from text, and flag the frame-level checks as incomplete rather than silently passing them — see `company/infrastructure-decisions.md` ID001 for the known connectivity-timing gap and its accepted fallback (re-test with a fresh, minimal diagnostic spawn before concluding the block is structural).
- **A one-call diagnostic (a single `get_metadata` call) at the start of a Figma-dependent review is a cheap way to confirm access before committing to the full checklist.**

A review that never actually looked at the layout hasn't checked what it was asked to check — reviewing the spec text alone and presenting that as equivalent to a Figma-artifact review is not acceptable, even when the artifact is genuinely unreachable; report the review as blocked instead.

## Wiring-dependent findings — the standing disclosure rule

Even when the Figma file is fully reachable, `get_metadata`/`get_screenshot`/`get_design_context` show structure and content, **not reaction/wiring data** (`company/infrastructure-decisions.md` ID004). A frame's content looking correct in isolation is not the same as confirming which states or capabilities can actually reach that frame, or that a claimed reaction destination is what's actually wired.

When a finding depends on the latter — a capability-gated boundary, whether a free-tier path can ever reach NFC-gated content, a seeded/demo frame that's only legitimate for some of its callers, a build report's own claim about where a reaction points — **name the specific boundary explicitly as unverified in the report, rather than silently passing it.** Main will either reproduce the path directly (a live click-through) or dispatch `merchant-user-tester` at that specific boundary before it's treated as closed. This is not a lesser or incomplete review — it's the correct, honest scope of what this toolset can and cannot confirm, and naming the boundary is itself the deliverable, not a gap to apologize for.
