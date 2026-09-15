# Slice 15 — Quick Session alongside an active Event

`home.md` §3.6/§3.6b (Approved 2026-09-15, Product Owner-raised during live
production testing). Before this slice, once a qualifying Event went
`active`, Home offered exactly one path — "Continuar Día N" — with no way
to start an event-independent Quick Session (`Session.eventId = null`)
while that Event was active. A merchant selling under a `tianguis`-length
Event (weeks or months, not a single bazaar day) who wanted to make an
ordinary sale away from that Event — the Product Owner's own stated
scenario: closing out a bazaar day, going home, a neighbor buying
something later — had no way to do that sale without either misattributing
it to the Event's own Día N totals/allocation, or not selling at all.
`architecture-principles.md` #3 ("Session works with zero Event... not a
UI shortcut bolted onto a required relationship") was being silently
violated in practice at exactly this one screen.

## What's built

A second, secondary, always-available "Iniciar Venta Rápida" action
(this prototype's own already-disclosed rename of the spec's literal
"Iniciar Sesión Rápida" — see `slice-1-home-inventario.md`'s "Naming"
section) on both `EventResume.tsx` (§3.6, exactly one qualifying Event)
and `ElegirEvento.tsx` (§3.6b, 2+ qualifying Events) — reusing `Idle.tsx`'s
existing primary action verbatim: the same `handleStartSession(null,
overrideToNfc)` call chain through `HomeScreen.tsx`, the same
`startSession` domain call, the same `starting-session`/
`starting-session-error` retry states, the same single, ambient
`useNfcSessionStart()` hook per screen. No new interaction pattern, no new
error path — every mechanism is a genuine cross-reference, not a
redefinition.

Directly beneath the secondary CTA, a short qualifying line renders,
stating the independence as a plain functional fact — "No se cuenta para
{Venue.displayName}" on `EventResume.tsx`, "No se cuenta para ningún
evento de arriba" on `ElegirEvento.tsx` — grouped tightly with its own CTA
(`.secondaryActionGroup`, 4px gap, distinct from the outer 16px stack
rhythm) rather than reading as an unrelated sibling line.

**Files touched:** `src/screens/Home/EventResume.tsx`,
`src/screens/Home/ElegirEvento.tsx`, `src/screens/Home/Idle.module.css`,
`src/screens/Home/ElegirEvento.module.css`, `src/screens/Home/HomeScreen.tsx`.

## Review rounds

**`ux-critic`, round 1 — 2 Major.** (1) The qualifying caption wasn't
visually bound to its secondary CTA — a single flat `gap` across every
element in the stack meant nothing signaled which element the caption
belonged to, and it was visually identical to the unrelated NFC-readiness
note beneath it. Fixed: the `.secondaryActionGroup` wrapper above, plus a
`--text-meta` token swap to differentiate the caption from the NFC note.
(2) `.wrap`'s `overflow: hidden` had no scroll affordance, unlike every
other multi-element screen in this codebase, risking silent clipping or
an un-scrollable viewport overflow at the amendment's fuller composition
(up to 8-9 stacked elements). Fixed: `overflow-x: hidden` (still
containing the BrandMark watermark's own horizontal bleed) +
`overflow-y: auto`, plus `justify-content: safe center` so nothing is
stranded above an unreachable scroll area.

**`ux-critic`, round 2 (re-verification) — both closed, nothing new.**

**`reviewer` — 0 Blockers, 1 Important, closed by Main.** Domain-layer
correctness (all three Quick-Session entry points resolve to the
identical `startSession` call), `Session.eventId` optionality, no
duplicated NFC/error-handling logic, no ubiquitous-language leakage, and
the terminology-drift disclosure (`Idle.tsx`'s own doc comment,
cross-referenced from this very file) were all confirmed clean by direct
inspection. The one Important finding — this file and its `README.md`
index entry didn't exist yet — is what this document closes.

## Verification

`npm run build` (`tsc -b && vite build`) — clean, independently
re-confirmed by Main after `reviewer`'s own dispatch had no Bash access
to run it. No live browser/device verification was possible in this
environment — `ux-critic`'s own MAJOR-2 fix (the `safe center` scroll
fallback) is verified structurally/statically only; a real-device check
of that specific interaction is still worth doing before this reads fully
verified end-to-end, the same disclosed gap this codebase's own barcode-
scanning slice (14) left open for its camera path.
