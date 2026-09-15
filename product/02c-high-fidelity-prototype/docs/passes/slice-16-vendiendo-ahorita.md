# Slice 16 — Vendiendo ahorita: live view of currently-active Sessions

`reports.md` §2/§3.3/§3.4a/§3.4b (Approved 2026-09-15, `decision-log.md`
D68, Product Owner-raised during live production testing). An OWNER at
home with several SELLERs each actively selling wanted to open Resultados
and see live sales without any Session closing first — the tab's own
resolution logic gated the entire tab on "has any Session ever closed,"
and nothing anywhere showed a currently-active Session's live numbers.
`architect` ruled a Business-wide, cross-Session, cross-device read of
`Session.status = active` additive, not a bounded-context violation —
"Intelligence read-only over Selling" governs write direction only, never
data finality (D68).

## What's built

**New selectors** (`src/domain/selectors.ts`): `activeSessionsForBusiness`
— every Session with `status === 'active'`, Business-wide, sorted
most-recently-opened-first (deliberately not `myActiveSession`, which is
Membership-scoped and the wrong shape here). `membershipById` — resolves
`Session.openedByMembershipId` to its `BusinessMembership` row.

**`VendiendoAhorita.tsx`** (new, shared) — one card per active Session:
`Venue.displayName · Día N` (or "Venta rápida" — this prototype's own
already-disclosed rename of `eventId = null`, matching `SessionDetail.tsx`'s
existing convention), role-derived identity only ("Tú"/"Alguien de tu
equipo" — no `User` display-name field exists in the domain model, a gap
already documented in `settings.md` §2.7/§11, not invented here), and a
running total via `sessionTotals` — the identical selector `Selling.tsx`'s
own live header and `SessionDetail.tsx` already call, not a third,
independently-written aggregation. Every figure carries "hasta ahorita";
the section itself states "los números todavía se están moviendo... en
cuanto cada quien cierre su jornada" (not "sesión" — the exact collision
`home.md`'s 2026-08-13 decision already retired from this vocabulary).

**`VendiendoAhoritaDetail.tsx`** (new) — read-only detail, reusing
`SessionDetail`'s layout (`sessionProductBreakdown`, the same selector).
Traced line by line, twice, across two independent reviews: the only
interactive element is "back." No resume/close/act affordance anywhere.

**`ResultadosColdStart.tsx`** — gained a Variant B, selected independently
of the tab's own closed-Session gate: when a Session is active, the
cold-start screen no longer asserts "Aquí vas a ver cómo te fue, en
cuanto cierres tu primera sesión de venta" with an "Empezar a vender" CTA
— both would be false in that exact moment, directly beneath a live
"Vendiendo ahorita" card proving otherwise.

**`ResultadosMain.tsx`** — mounts `VendiendoAhorita` above "Total
histórico," covering the main-view states in one place.

**Files touched:** `src/domain/selectors.ts`,
`src/screens/Resultados/VendiendoAhorita.tsx` (new),
`src/screens/Resultados/VendiendoAhoritaDetail.tsx` (new),
`src/screens/Resultados/ResultadosMain.tsx`,
`src/screens/Resultados/ResultadosColdStart.tsx`,
`src/screens/Resultados/ResultadosScreen.tsx`,
`Resultados.module.css`.

## Review rounds

**`ux-critic`, round 1 — 1 Blocker.** "Total histórico," "Top productos,"
and the sales-trend headline silently included Sales from currently-active
Sessions — directly contradicting §2's own new rule that a live Session's
Sales must never count toward those aggregates. The same Sale could
render twice on one screen: "hasta ahorita" in "Vendiendo ahorita," and
silently settled in the headline figures below it — the identical defect
class the cold-start Blocker (below) also describes, relocated to a
different part of the same screen. Fixed: `allTimeTotals`,
`topProductsAllTime` (rewritten off the shared `salesCount` it previously
called, since that selector is correctly shared with Home's own live
selling-grid ordering and needed to stay untouched), and `salesTrend` all
gained an `activeSessionIds` exclusion.

**`ux-critic`, round 2 — Blocker closed; 1 new Major.** `eventRollup`
(Historial event cards, Event detail, Venue detail) had the identical
gap, reachable whenever a multi-day Event's date has rolled over
(`eventStatus` derives `'closed'` from date alone) while its last Session
is still `active` — a merchant simply hasn't tapped "Cerrar jornada de
venta" yet. Fixed: the same `activeSessionIds` exclusion applied inside
`eventRollup`, propagating automatically to all five of its consumers
(including two in Eventos' own territory, left untouched by design — the
underlying fix is universal).

**`ux-critic`, round 3 (re-verification) — closed; 1 new Minor, left
open, self-correcting.** `eventCompletedDays` (the "días" count) still
includes a still-open Session's calendar date, while `sales`/`revenue`
now correctly exclude that Session's Sales — the same Historial card can
show a día count one higher than its own sales/revenue reflect, in the
same narrow, forgot-to-close scenario. `reviewer` independently confirmed
this reading and concurred it's safe to leave as a disclosed limitation:
the underlying Sale data isn't lost — it's fully visible, correctly
live-labeled, in "Vendiendo ahorita" — and resolves itself the instant
the Session actually closes.

**`reviewer` — 0 Blockers, 0 Important.** Confirmed no write path
anywhere in this new code touches `Session`/`Sale`/any Selling-owned
table (grepped `store.tsx` directly); role resolution degrades safely
when `membershipById` finds no match (`undefined` → "Alguien de tu
equipo," never a crash or a rendered `undefined`); no duplicated
aggregation; no ubiquitous-language leakage; the "jornada" terminology
fix confirmed shipped. The one gap named — this file and its `README.md`
index entry not existing yet — is what this document closes.

## Verification

`npm run build` (`tsc -b && vite build`) — clean, independently
re-confirmed by Main after both `reviewer` dispatches lacked Bash access
to run it themselves. No live browser/device verification was possible in
this environment.

## Known limitation, disclosed, not blocking

`eventCompletedDays` can count a calendar date whose Session is still
`active` (not yet explicitly closed) even after the Event's own date
range has elapsed, while `eventRollup`'s `sales`/`revenue` correctly
exclude that Session — a narrow, self-correcting display inconsistency
(one Historial card, día count off by at most one, until the merchant
taps "Cerrar jornada de venta"). Not fixed in this slice; revisit if real
usage shows this reads confusingly rather than merely momentarily
imprecise.
