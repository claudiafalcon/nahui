---
name: figma-clone-discipline
description: The D31/D32 two-axis (Content/Navigation) test for whether a Figma node reused across journeys/entry-contexts must be cloned rather than shared. Load before rewiring any existing node's reaction, wiring a new caller into an existing node, or the moment a node is first identified as needing to serve a second journey/entry-context. This is the single most-recurring defect class this project has hit — every instance was a shared node silently leaking one context's content/navigation into another.
---

# Figma Clone Discipline (D31/D32)

This is Nahui's own operational discipline, not general Figma advice — extracted from `ui-designer.md` because it was the single most-repeated piece of hand-typed context in dispatch prompts across this project's history. Any agent doing Figma work (most often `ui-designer`) loads this before touching shared-node wiring; Main can also reference it by name in a dispatch prompt instead of retyping the test.

## Before rewiring any node's own reaction, or wiring a new caller into an existing node

Enumerate — via a fresh `node.reactions`/reference check, never from memory or a prior build report:
1. Every current caller that already targets this node.
2. If adding a new caller, every existing downstream destination this node itself points to (e.g. a back-link).

Confirm the change doesn't silently redirect an existing legitimate caller's expected destination, and doesn't newly expose the node's own existing outgoing wiring to a caller it was never built to serve. If a node's own layer name signals it's scoped to one journey or mode (e.g. "Journey 1: buttons-only"), treat that as a hard clone-don't-reuse signal, not something to override under time pressure. Once one instance of a wiring defect is found, search for every structurally-parallel sibling before considering the fix complete — don't rely on a separate walkthrough to surface each one individually.

## Node reuse across journeys — classify before touching any reaction, at the moment the reuse is first identified, not only when you're about to rewire

The rule above catches this reactively (before a rewrite); this one triggers proactively, the instant a node is first identified as needing to serve a second journey/entry-context:

1. **Content-identical?** — does every calling context require the exact same content, with no session-state/tier/mode-dependent field anywhere on the frame?
2. **Navigation-identical?** — does the node's own outgoing reaction(s) need to lead to the same destination for every context?

Only Content=Yes AND Navigation=Yes justifies leaving one node shared, untouched. Any other combination requires cloning proactively at the moment the second caller is identified — one clone per diverging destination and/or per diverging content requirement, each carrying its own outgoing reaction:
- Content=Yes, Navigation=No → clone on the navigation axis, one clone per destination.
- Content=No (regardless of Navigation) → clone on the content axis; each clone's content must be verified against the specific approved low-fi state for *that* calling context, not the nearest visually-similar template.

Record which axis triggered the clone in the clone's own layer name (e.g., "nav-diverge" / "content-diverge" / both).

## Why cloning, specifically — not instance overrides, not Variables-based routing

**Do not substitute Figma per-instance interaction overrides or Variables-based conditional routing for cloning, even though they look like the more "correct" caller-owns-the-transition pattern.** Both carry a real, documented silent-failure mode that reproduces this exact bug class:
- **Instance overrides** only apply if the specific variant is active at prototype launch and otherwise silently fall back to the node's default reaction.
- **Variables-based routing** silently produces the wrong destination if any calling journey fails to set the routing variable before handoff.

Cloning is static and deterministic at design time and has no equivalent runtime precondition — that's the property that matters here, not elegance. If a genuinely dynamic router is ever needed, that's a production-code (Coordinator/Router) decision for `builder`, out of scope for Figma prototyping.

## What this discipline has caught, repeatedly, when skipped

Every recorded instance of Nahui's "reconvergence" defect class — a shared node silently leaking one journey's stale content/history into a fresh-account narrative — traces back to this test either never being applied, or being applied reactively (after a tester found the leak) instead of proactively (at the moment the second caller was first identified). Applying it proactively is the entire point: it turns a defect that would otherwise need a tester walk to surface into something caught at build time.
