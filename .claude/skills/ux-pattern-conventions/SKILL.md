---
name: ux-pattern-conventions
description: The stable, already-converged interaction/wireframe conventions shared across every product/02-ux/*.md document — near-instant/slow loading, error/retry shape, confirmation-dialog templates, ambient self-dismissing confirmations, tappable-vs-passive notation, and the CTA/heading-collision defect class. A fast path for ux-critic's "does this deliverable reuse established patterns" check, replacing a full read of every sibling doc for the common case. Not a replacement for reading a specific sibling doc when the question is genuinely about that doc's own content, not a shared convention.
---

# UX Pattern Conventions — Cross-Document Digest

**This is a fast-path for recognizing already-converged conventions, not a substitute for reading a sibling doc when the question is actually about that doc's specific content.** If a new deliverable's pattern isn't listed here, or the question is "does this match how `inventory.md` specifically phrases X," identify the one or two siblings actually relevant to that question and read them directly — don't guess from this digest, and don't fall back to reading every sibling "just in case." That blanket-read is exactly the cost this digest exists to remove.

## When this digest is enough

Checking whether a new deliverable reuses an **already-standardized mechanic** — the items below — rather than quietly inventing a new one. If the deliverable's pattern matches what's listed here, it's consistent; no further sibling read needed for that specific check.

## When it isn't — go read the specific sibling doc

- The question is about **shared vocabulary for a shared concept** (e.g., does this doc's term for a Venue/Event/Product match how another doc already names it) — read the specific sibling doc that concept actually lives in, not all of them.
- The question is about a **specific cross-reference** one doc makes to another (e.g., `events.md`'s own citation of `home.md §2` step 2) — read the cited section directly.
- The question is a **Horizontal Journey Review** (the full concatenated screen sequence a merchant would actually walk) — load `horizontal-journey-review` instead; that mode requires the actual full sequence of documents, not this digest, by design.

## Converged conventions (apply project-wide, cite this digest rather than re-deriving)

**Wireframe notation.** `[ ]` = tappable. Plain text = passive/informational. No other bracket convention exists.

**Loading states — near-instant / slow, shared shape.** Every write-like action across every document uses the identical two-state pattern: a silent skeleton (`▢▢▢▢▢▢▢▢▢▢▢▢`, no text, no spinner) for the near-instant case, and one plain line ("Un momento…" / "Guardando…" / a verb-specific variant) only if the action runs past ~1.5s. Never a spinner, never a percentage, never more than one line of copy in the slow case.

**Error/retry — shared shape.** "No pudimos [verb]. Intenta de nuevo. [Reintentar]" — states what failed, offers exactly one action, never apologizes first (`tone-of-voice.md`'s "state facts before offering an opinion"). A retry always replays the same already-confirmed action under the same idempotency key (`architecture-principles.md` #7) — typed/selected data is never lost on a retry.

**Confirmation templates — three shapes, not ad hoc per screen.**
- *Immediate-effect, single button*: one title, plain-language consequence copy, one "[Verb] ahora" button. Used whenever an action has a real but non-catastrophic, non-deferred consequence (e.g. `settings.md §3.4`).
- *Deferred-effect, single button*: same shape, but the copy states *what changes and when* (an effective date), used only when an action has a genuine billing/commercial deferral (`decision-log.md` D25) — never applied to a purely operational field with no billing implication (D27 explicitly draws this line for `defaultSellingMode`).
- *Two-button Sí/No, dimmed backdrop*: reserved for a real yes/no decision with no "effect" to disclose beyond the choice itself (cancel-pending-change, sign-out, destructive-but-reversible actions). Never used for a routine capability toggle.

**Ambient self-dismissing confirmation.** A brief (~2.4s), non-blocking toast for an action that succeeded but doesn't need a full screen — "Venta finalizada ✓," "Código reenviado," "Evento cancelado ✓." Always a checkmark for success; a plain or warning-toned line (no checkmark) for a non-error explanation of why a tap didn't do anything (e.g. `Selling.tsx`'s stock-hint pattern).

**"Never ask twice" / resume-exactly-where-left-off.** Every in-progress, interruptible flow (Onboarding, Authentication, a partially-filled form) resumes pixel-identical to where the merchant left it after a backgrounding/reload — never restarts, never re-asks something already typed. This is a hard cross-document invariant, not a per-doc choice.

**Business language before technical language.** No merchant-facing copy, in any document, ever names an internal/domain noun (Session, SaleItem, Claim, InventoryUnit, Membership, etc.) — always the merchant's own vocabulary ("tu jornada de venta," "lo que traes," "tu código").

## The single most-recurring real defect class — check this explicitly, every time

**CTA text colliding with its own destination's heading.** A button that says "Registrar mercancía" leading to a screen whose own `<h1>` also says "Registrar mercancía" — same exact string reused as both the action prompt and the next screen's passive title — undermines the one moment a merchant is deciding whether her tap "did something" or "she's now doing it." Already found and fixed twice this project (`HJR-INV-M1`, `HJR-EVT-M1`) — check every new CTA-to-destination-heading pair explicitly, don't wait for Horizontal Journey Review to catch it. The resolution pattern each time: differentiate into an action-verb CTA vs. a "you are now here" destination heading (e.g. "Agendar evento" → lands on "Nuevo evento," not "Agendar evento" again).

## Session-controls sheet pattern

The "⋯" icon opening a small sheet ("Cerrar jornada de venta" when a Session is open, "⚙ Configuración" always) is the one standing affordance for reaching Configuración from anywhere in Home — not a nav tab, not a hamburger/full-drawer pattern. Present on every Home header state except the four explicitly excluded ones (Resolving/Resolving-slow/Close-summary/Resolution-error) — check `settings.md §2.1` directly if verifying this exact exclusion list, since it's specific and worth confirming rather than assuming.
