# Experience Review — 2026-08-13: Eventos, first walk (scheduling, day-linkage, overlap detection)

**Persona:** Ana. **Purpose:** first-ever `merchant-user-tester` walk of Eventos (`product/02c-high-fidelity-prototype/`, Slice 3), after `ux-critic`/`reviewer`/Horizontal Journey Review all passed clean. Path: fresh onboarding (Empezar gratis) → schedule an Event for today ("Bazar Santa") → observe Home's own resolution logic pick it up → continue Día 1, register stock, sell → close the day → re-open Home → schedule a second, overlapping Event to test D17.

## Core question 1: does scheduling an Event make Home "just know" — Validated

The moment "Bazar Santa" was saved for today, Home switched from its blank cold-start prompt to "Bazar Santa / Hoy es tu Día 1 / Continuar Día 1" with no further navigation from Ana. **Verification status: Independently Verified** — Ana's own completed walk, unprompted.

## Core question 2: D17 overlap detection — Validated

Scheduling a second Event ("Tianguis") on the same date surfaced an inline message naming the conflicting Event ("Bazar Santa (13 de agosto)") and the fix (adjust dates) worked immediately once applied. Read by Ana as protective, not punitive. **Verification status: Independently Verified.**

## Finding — no ambient signal that a closed same-day session's sales already exist, read by Ana as data loss

After closing "Día 1" (summary screen correctly showed "$750 · 2 ventas"), returning to Home offered "Continuar Día 1" again — correct per `decision-log.md` D15 (a same-day resume must not increment the day number, `home.md` §2 step 2's own 2026-08-13 correction). Tapping it opens a genuinely new `Session` row (verified in `store.tsx`: `startSession` always appends a new session, never reuses one; `closeSession` only ever sets `status: 'closed'`, never deletes; `Sale.sessionId` keeps every sale attached to its originating session). **The $750 is not lost — it is not surfaced anywhere.** The new session's own running total legitimately starts at $0, but nothing on Home, the event card, or event detail tells Ana a closed session with sales already exists for today before she reopens selling. She read the blank $0 as her prior sales having vanished, and said this specific moment "would make Ana stop trusting the 'close' action."

This sits at the edge of an already-resolved boundary: `architect-questions.md` Q7 explicitly permits Eventos "a thin, ambient, in-progress indicator as part of its own navigation/status role," while the full day-by-day breakdown is reserved for the not-yet-built Resultados. Whether a same-day "ya vendiste $X hoy" ambient line falls inside Q7's already-sanctioned allowance, or is new scope needing a fresh decision, is being routed to `architect` for classification — not resolved here. **Verification status: Independently Verified** (the felt confusion) — **root cause Verified via direct source inspection** (not data loss; a surfacing gap).

## Finding — disabled "0 disponibles" product button gives no feedback on tap

Reaching the live selling screen for the newly-scheduled event, Ana's one product showed "0 disponibles" (no stock registered during onboarding) and was correctly disabled — but tapping it produced no message or hint that stock needed to be registered first. She had to guess to find Inventario herself. **Verification status: Independently Verified.** Routed to `ui-designer` as a direct fix (unambiguous bug, no scope question).

## Not treated as a defect — Eventos skipping the list view with exactly one Event

With only one Event scheduled, the Eventos tab goes straight to that Event's detail screen rather than a list. Ana called it "a shortcut rather than a real list view" but not disorienting. Consistent with `events.md`'s own list-of-one convention elsewhere in this build family. **Verification status: Pending Verification** — a felt-experience note, not acted on.

## Not reached

Resultados (explicit stub, correctly self-disclosed as not built in this prototype) — Ana could not verify whether the $750 exists anywhere visible through that surface, since it doesn't exist yet.
