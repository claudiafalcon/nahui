# Slice 6 — Asignar Tags

Migration Workflow (`decision-log.md` D43): `product/02-ux/inventory.md`
§3.14-§3.17 (Approved) is the implementation contract. Architecture Gap
Analysis findings were supplied directly in the dispatching task (domain
field, write-path shape, new selectors, scope boundaries) — applied as
given, not re-derived. Explicitly out of scope, untouched: NFC selling mode,
`Session.operatingMode` resolution, `home.md` §3.6a's remaining variants
(BACKLOG.md item D.2, a separate later slice).

## Domain layer

**`src/domain/types.ts`.** `InventoryUnit` gains one nullable field:
`tagId: string | null` — the domain-model's 1:1 NFCTag attribute, modeled as
a scalar rather than a separate `NFCTag` entity (nothing else needs to hang
off a tag besides "which unit owns it"). Every unit `commitLot` mints starts
`tagId: null`, regardless of `nfc` capability — tagging is optional at the
capability level, never a precondition for `status = 'available'`
(`inventory.md` §8 item 2/Q2, untouched by this pass).

**`src/domain/store.tsx`.** One new action, `assignTagToNextPendingUnit(tagId)`,
following `addItemToSale`'s per-event-write shape (not `commitLot`'s batch
shape), exactly as specified:
- "Next pending unit" = first entry in `state.units` (existing array order)
  where `status === 'available' && tagId == null` — global across every
  Lot/Product, never scoped to one Lot, per the Gap Analysis's own
  confirmation against §2 step 2's business-wide gate.
- `already-assigned` (`state.units.some(u => u.tagId === tagId)`) is checked
  *before* `queue-empty` — a business-logic conflict (§3.15) is a distinct
  question from there being nothing left to tag (§2 step 4/§3.13).
- `loadState`'s backward-compat guard now defaults any pre-existing saved
  unit's missing `tagId` to `null` — an existing localStorage walkthrough
  resumes as a fully untagged, resumable queue instead of losing history.

**`src/domain/selectors.ts`.** Four new selectors, all pure/live, none
cached:
- `pendingTagUnits` — the live queue itself (`available && tagId == null`,
  `state.units`' own array order).
- `pendingTagCount` — its length, driving §2 step 2's gate and §3.5's "Te
  faltan N artículos por etiquetar."
- `pendingTagBreakdown` — the same filtered set grouped by `productId`, in
  first-appearance order within the live queue (not Catalog registration
  order) — this is what actually reproduces §3.14's per-Product summary
  order ("Bolsas (10) · Accesorios (5)... in the order she entered them").
- `nfcCapable` — `state.business?.subscriptionTier === 'paid'` (D27), not
  gated on `defaultSellingMode` or kit/code activation.

None of these are snapshotted anywhere — every consumer (`CatalogView`,
`AssignTags`, `InventoryScreen`'s routing decision) calls them fresh off
`state` on every render, so a unit consumed elsewhere (sold via FIFO in
buttons mode while tagging was deliberately deferred, §3.17) silently drops
out of the count, exactly as the Gap Analysis required.

## Screens (`src/screens/Inventory/`)

- **`AssignTags.tsx`** (§3.14/§3.15/§3.16, one component covering all
  three — they're the same screen with a conditional error line, not three
  separate states). Pure scan-driven: no per-unit confirm tap, a successful
  scan advances automatically. `pendingTagBreakdown` drives both the "Lo que
  registraste" summary and, via its first entry, "Etiquetando: X / Faltan N
  de M." A `useEffect` watches `breakdown.length` and calls `onComplete()`
  the instant it reaches 0 (§2 step 4 → §3.13), so the screen never lingers
  empty.
- **`NFCScanPrompt`** (`src/components/NFCScanPrompt/`) — the "Acerca el tag
  a la prenda" affordance, named after the Medium-Fidelity precedent
  component per the dispatching task's naming note, deliberately not
  "Tag"-adjacent to avoid confusion with the pre-existing, structurally
  unrelated `src/components/TagStub/` (a decorative per-Product marker).
- **`CatalogView.tsx`** — added the §3.5 pending-tag-work variant: an
  unboxed status line + primary "Continuar etiquetando" CTA directly under
  the header (the identical shape `home.md` §3.6 uses for "Hoy es tu Día 2"
  + its CTA, per the 2026-08-07 task-priority amendment already in the
  spec), and demotes "Registrar mercancía" to the `secondary` Button variant
  in that one state only — same position, same destination, never gated.
  §3.17 ("Terminar después") is the identical variant, reached a different
  way; no separate flag was added to distinguish them, since the spec itself
  says they're the same state.
- **`InventoryScreen.tsx`** — new `'assign-tags'` view mode; the §2 step 3
  auto-entry decision (nfc-capable → Asignar Tags, buttons-only → Catalog
  with the existing ambient confirmation) now lives in the `onSaved`
  callback passed to `RegisterMerchandise`, reading `nfcCapable(state)` from
  this component's own pre-commit render (see "Judgment calls" below for why
  that's sufficient without a post-commit re-read); a new `tagsComplete`
  catalog-view flag drives §3.13's "Mercancía lista para vender ✓" ambient
  toast, parallel to the existing `justSaved` → "Mercancía registrada ✓"
  (§3.12).

## Rewiring the existing stub

`Idle.tsx` and `EventResume.tsx`'s "Asignar tags" link (both gated on
`defaultSellingMode === 'nfc'`, unchanged) now call a real
`onNavigateToAssignTags` prop threaded from `App.tsx` (switches to the
Inventario tab, sets `{ mode: 'assign-tags' }`) instead of opening a
Home-local Placeholder. `HomeScreen.tsx`'s `'assign-tags-placeholder'` UI
state and its `Placeholder` render branch are removed entirely, both callers
now point at the real screen. The child components' own prop name
(`onOpenAssignTagsPlaceholder`) was deliberately left unrenamed — a cosmetic
rename would have widened this pass's diff for no functional benefit; each
component's own doc comment now explains what it actually does.

## Judgment calls / disclosed simplifications

1. **§2 step 3's auto-entry condition is `nfcCapable(state)` alone, not
   `nfcCapable && pendingTagCount > 0` computed post-commit.** The dispatching
   task's own phrasing ("on an nfcCapable Business with pending tags")
   is satisfied automatically: `commitLot` always mints ≥1 fresh, untagged,
   `available` unit on a successful save (canSave already requires ≥1 line),
   so for an nfc-capable Business the tagging queue is guaranteed non-empty
   immediately afterward regardless of what was pending before. Reading
   `nfcCapable` from `InventoryScreen`'s own pre-commit `state` (captured at
   the closure's last render, before `commitLot`'s `setState` flushes) is
   therefore correct without needing a post-commit re-read — `subscriptionTier`
   never changes as a side effect of registering merchandise. Avoids a real
   stale-closure trap a naive `pendingTagCount(state) > 0` check taken from
   the same pre-commit `state` would have hit (it would read the *old* count,
   undercounting by exactly the units just added).
2. **"Faltan N de M" needs a per-Product denominator that doesn't shrink as
   she scans, but the underlying selector is intentionally never cached.**
   Resolved by capturing each Product's own total (`M`) in local component
   state (`AssignTags.tsx`'s `segmentTotals`) the moment it first becomes the
   front of the live queue, refreshed automatically whenever the front
   Product changes — the live selector still decides *when* that happens and
   what the live remaining count (`N`) is on every render; only the frozen
   `M` per segment lives outside the selector layer. Not spec-ambiguous on
   the happy path (working through one stack of garments front-to-back,
   never revisiting an earlier Product); a Product sold out of the queue
   mid-tagging via a deferred-then-resumed FIFO sale is a genuine edge case
   this simplification doesn't perfectly reconcile (`M` wouldn't shrink to
   match a smaller live `N` if that exact Product's segment was already
   frozen) — disclosed, not fabricated as a fully-solved case.
3. **§3.16's "scan failed" and a mock "already-assigned" collision are both
   simulated client-side**, exactly as the dispatching task specified for
   §3.16 (never touches the domain layer) and extended the same way for a
   demonstrable §3.15: `handleScan` rolls a client-side failure chance
   (18%) before ever calling the store, and — separately — has a small
   chance (12%, only once ≥1 tag is already assigned) of re-presenting an
   already-assigned `tagId` instead of minting a fresh one, so a genuine
   `already-assigned` result from `assignTagToNextPendingUnit` is actually
   reachable without a dev-only test affordance. This mirrors the codebase's
   existing mock phone-OTP precedent (any 6-digit code accepted) rather than
   inventing a new simulation convention.
4. **§3.14's "Lo que registraste" summary line stays visible during §3.15/
   §3.16's error states**, rather than disappearing the way the low-fidelity
   wireframes (which omit it) might suggest literally. Chosen because §3.16's
   own text ("Nothing is consumed by a failed read... Faltan 7 de 10 is
   unchanged") reads as "everything else on screen stays as it was," and
   because the wireframes' minimalism elsewhere in this doc family is an
   established illustrative convention, not a literal removal instruction —
   toggling the summary line on and off around a transient error message
   would also be a jarring layout shift with no functional purpose. Disclosed
   as a small deviation from the literal wireframe, not a redesign.
5. **A reachable-but-unaddressed edge case, not fixed (Home's own scope, not
   this pass's).** `Idle`/`EventResume`'s "Asignar tags" link visibility is
   gated on `defaultSellingMode === 'nfc'` alone (`home.md` §3.6a, untouched
   by this pass) — not on whether anything is actually still pending. A
   Business that's `nfc`-default but already has a fully-tagged Catalog can
   still tap the link, land on `AssignTags` with an already-empty queue, and
   bounce immediately back to Catalog's "lista para vender" ambient toast.
   Not a dead end and not a fabricated state, but also not literally a
   distinct §3.14 moment — named here rather than silently absorbed, since
   fixing Home's own gating condition is out of this pass's explicit scope
   (`home.md` §3.6a's remaining variants are BACKLOG.md item D.2).

## Verification

`tsc -b && vite build` — zero errors. No browser-automation tool was
available in this session (unlike several prior passes' Puppeteer/
`chrome-devtools-mcp` walkthroughs) — verification here is a thorough manual
code-review pass (hook-ordering correctness in `AssignTags.tsx`, closure/
stale-state correctness in `InventoryScreen.tsx`'s routing decision, the
`already-assigned`-before-`queue-empty` check order, the backward-compat
`loadState` guard) plus the clean build, not a live click-through. **Flagged
explicitly, not silently skipped:** a live walkthrough (register merchandise
as an nfc-capable Business → auto-enter Asignar Tags → scan through a full
queue, including hitting both error states at least once → confirm the
"lista para vender" catalog return; separately, Home's "Asignar tags" link
from both Idle and EventResume) is the natural next verification step
before this slice is considered fully confirmed end-to-end.

## Fix round (2026-08-14) — `ux-critic` found 3 Major + 2 Minor; `reviewer`'s
Foundation-consistency pass was clean (no changes needed on that front). All
five fixed in this round; nothing `reviewer` already passed was reopened.

**AT-M1 (Major) — "Lo que registraste" mixed old deferred backlog into what
read as a receipt of the just-registered Lot.** `pendingTagBreakdown(state)`
is (correctly, per the Gap Analysis) scoped globally across every Lot, so it
was also the wrong source for a one-time "what you just entered" summary: if
Ana deferred tagging on an old Lot, then registered a new unrelated Lot, the
auto-entry screen showed both Lots' units together as if she'd just entered
all of them.
**Fix.** The summary is now sourced from a frozen receipt captured once, by
the caller, at the exact moment the triggering `commitLot` call resolves —
never recomputed from the live queue. `RegisterMerchandise.handleSave` builds
`{productId, quantity}[]` directly from the lines it just committed
(aggregating any repeated Product across lines defensively, though the form
itself never produces that today) and hands it through `onSaved`'s second
argument. `InventoryScreen`'s `onOpenAssignTags` forwards it only on that
auto-entry path; `App.tsx` owns the actual state (`assignTagsEntry`,
alongside `inventoryView`) and only replaces it when a fresh breakdown
arrives — a plain resume (`onContinueTagging`, Home's "Asignar tags" link)
calls `onOpenAssignTags()` with no argument, so the previous receipt is left
untouched, exactly matching that it's still the same session's own commit.
`AssignTags.tsx` renders the line only when a receipt is present, resolving
each `productId` to its current `Product.name` at render time; omitted
entirely (not fabricated from the live queue) on the structurally rare case
of resuming with no receipt known this app session (e.g. right after a page
reload, since this state — like `inventoryView` itself — is in-memory only,
not persisted to `localStorage`, matching this codebase's existing
convention for navigation state).
*Noted for `architect`'s awareness, not resolved here, per the dispatching
task's own instruction:* `inventory.md` itself has an unaddressed tension
between §2 step 2's business-wide gate and §2 step 4's Lot-scoped wording
("Does **this Lot** still have any InventoryUnit without a tag?") — the
Architecture Gap Analysis resolved the queue toward global scope, but the
copy mismatch in the spec's own §2 step 4 was never corrected. This fix
resolves the UI-level misrepresentation without touching that spec-level
wording question.

**AT-M2 (Major) — "Faltan N de M" denominator reset on ordinary
defer/resume.** `segmentTotals` lived in `AssignTags`' own component state;
`InventoryScreen.tsx` unmounts `<AssignTags>` whenever `view.mode` leaves
`'assign-tags'`, so the designed-for "Terminar después" → "Continuar
etiquetando" cycle silently lost the frozen total and re-captured a smaller
live remainder as the new (wrong) `M` — e.g. "Faltan 7 de 10" → resume →
"Faltan 7 de 7."
**Fix.** The frozen map now lives in `App.tsx` (`assignTagsSegmentTotals`,
alongside `inventoryView`/`assignTagsEntry`) and is threaded into
`AssignTags` as a controlled prop + updater callback
(`onSegmentTotalsChange`) instead of local `useState`, so it survives the
component's own unmount/remount. The capture rule itself is unchanged in
spirit (capture a Product's total the first time it's part of the live
queue) but is now also self-evicting: a Product's frozen total is dropped
from the map the moment it genuinely disappears from the live queue (fully
tagged), and only then — so a later, unrelated `commitLot` that eventually
mints a fresh batch of that same Product starts from a clean `M`, while an
*other*, still-pending segment (the AT-M1 scenario: an old deferred Lot's
Product, still mid-queue, plus a newly registered unrelated Lot) keeps its
own frozen total untouched. This satisfies the "reset on a genuinely new
session, not on a plain resume" requirement at the correct granularity —
per-Product, driven by the live queue's own presence/absence — without
needing a separate explicit "new session" signal threaded from `App.tsx`.
Both `assignTagsEntry` and `assignTagsSegmentTotals` are cleared in
`onTagsComplete` once the queue genuinely reaches zero, for hygiene (by that
point every segment has already self-evicted via the mechanism above, so
this is a no-op in practice, not load-bearing).

**AT-M3 (Major) — Error red used for a routine, nothing-lost scan
failure.** `.errorLine` used `var(--color-error)` for both §3.15
(already-assigned) and §3.16 (scan failed) — per `brand-guide.md`'s Error
color usage section, Error red is reserved for a write/save that failed with
real merchant-facing consequence, not a passive, retry-only, nothing-lost
failure (§3.16's own text: "Nothing is consumed by a failed read... Faltan 7
de 10 is unchanged").
**Fix.** `.errorLine`'s color changed from `var(--color-error)` to `#6b6259`
— the same plain body-text color already used elsewhere on this same screen
(`.summary`, `.progressCount`) and the same one `ResultadosLoadError.tsx`
uses for its own comparable retry-only failure. `font-weight: 600` is kept
for visibility, per the fix's own instruction to keep weight/emphasis while
dropping the error-red token.

**AT-MIN1 (Minor) — scan target visibly shifted position when the transient
error line appeared/disappeared.** `.wrap` is a vertically-centered flex
column with nothing reserving space for the error line, so its
appearance/disappearance re-centered the whole stack and moved the scan
target — during repeated scan attempts at roughly the same physical spot.
**Fix.** The error `<p>` is now always rendered (never conditionally mounted
— text is empty when there's no feedback), with a fixed `min-height: 40px`
(two lines at `--text-body-sm`'s own 20px line-height) and `visibility:
hidden` (via a `.errorLineHidden` class) when empty — reserves the slot's
height at all times without ever showing empty chrome, so the scan target's
position stays stable across attempts.

**AT-MIN2 (Minor) — brief blank-content flash on the disclosed Home-link
edge case.** `AssignTags` returned `null` on the render where `current` is
`null`, before its own `useEffect` fires `onComplete()` — a one-frame empty
flash before bouncing to Catalog (the already-disclosed edge case:
`Idle`/`EventResume`'s "Asignar tags" link is reachable even with an already-
empty queue, per this doc's own judgment call 5 above).
**Fix.** That branch now renders the same topbar shell (`Asignar tags`
wordmark) instead of `null` — a one-line-scope change, not a redesign of the
transition — so the nav-bar-adjacent chrome stays visually continuous for
that one render instead of going fully blank.

**Verification.** `tsc -b && vite build` — zero errors. Files touched:
`src/screens/Inventory/AssignTags.tsx`, `AssignTags.module.css`,
`RegisterMerchandise.tsx`, `InventoryScreen.tsx`, `src/App.tsx`. No domain
layer (`src/domain/`) or selector changed — every fix is confined to
navigation-state ownership and presentation, consistent with `reviewer`'s
already-clean Foundation-consistency pass not being reopened. Same
verification posture as the original pass: no browser-automation tool
available this session, so this is a thorough manual code-review pass (prop
threading end-to-end from `RegisterMerchandise` through `InventoryScreen` to
`App.tsx` and back down into `AssignTags`; the per-Product eviction logic
traced by hand against the AT-M1/AT-M2 scenarios stated above) plus the
clean build — a live walkthrough remains the natural next verification step,
same disclosure already carried by the original pass.

## Follow-up fix (2026-08-14) — AT-M4, found during `ux-critic`'s
re-verification of the round above (Major).

**AT-M4 (Major) — frozen "M" denominator could only shrink-or-hold, never
rise, so it could end up smaller than its own live remaining count.**
AT-M2's eviction logic (above) correctly *drops* a segment's frozen total
once that Product genuinely disappears from the live queue, but the
still-pending branch only ever *kept* an existing frozen total unconditionally
— it never checked whether the live count had grown past it.
**Reachable scenario:** Ana is mid-tagging Playeras, "Faltan 7 de 10" (frozen
M=10, still live in the map since that segment hasn't fully disappeared).
She taps "Registrar mercancía" — always reachable, never gated while a
tagging queue is active (`inventory.md` §3.5) — and registers more Playeras
(merchandise arriving in batches, or topping up an existing line before
finishing the first tagging pass). This re-enters Asignar Tags with a larger
live count for Playeras, but the frozen M stayed at 10: the screen showed
"Faltan 12 de 10" — a denominator smaller than the remaining count, broken
arithmetic on the one screen whose entire job is a trustworthy live count.
It also directly contradicted the correctly-scoped "Lo que registraste" line
next to it (AT-M1's fix), which correctly showed only the smaller new
commit — the two numbers on screen actively disagreed.
**Fix.** The still-pending branch of the same per-Product reconciliation
(`AssignTags.tsx`'s mount/`breakdownKey` effect) now also raises a frozen
total up to the live count whenever the live count has grown past it —
`row.count > frozen` → `next[row.product.id] = row.count` — rather than only
`row.count == null` triggering a fresh capture. The reconciliation rule:
whenever the live remaining count for a still-pending Product exceeds its
own frozen total, the frozen total is raised to match the live count exactly
(never below it). This is deliberately the simple, self-contained version —
raising M to the live count directly, not attempting to reconstruct exactly
how many units were "already tagged before this growth" from `entryBreakdown`
deltas — because it reads straight off state that's already correct and
already persisted across remounts (`totals` in `App.tsx`, `row.count` from
the live `pendingTagBreakdown` selector), with no dependency on `entryBreakdown`
reference identity surviving an unrelated defer/resume cycle (which would
have reapplied the same delta a second time on a plain resume — a real
idempotency risk with a delta-based alternative that was considered and
rejected in favor of this one). The tradeoff: a growth event resets that
segment's *visible* progress percentage (already-tagged units stop being
reflected in M once M is raised to match the new live count) — accepted
because the task's stated invariant is strictly "M must never sit below the
live remaining count," not "M must preserve historical progress across a
mid-queue top-up," and the simpler rule satisfies the former without any of
the identity/idempotency risk the latter would introduce. Confirmed
idempotent under an ordinary defer/resume with no intervening growth: since
the rule only fires when the *live* count has genuinely grown past the
frozen one, a bare remount with an unchanged live queue changes nothing,
exactly preserving AT-M2's own guarantee.
Scope: additive only, confined to the still-pending branch of this one
effect. AT-M1's frozen-receipt sourcing, AT-M3's error color, AT-MIN1's
fixed-height error slot, and AT-MIN2's shell-instead-of-null are all
untouched.
**Verification.** `tsc -b && vite build` — zero errors. Only
`src/screens/Inventory/AssignTags.tsx` touched. Same manual-code-review
verification posture as the round above (no browser-automation tool
available this session) — traced by hand against the exact reachable
scenario described (frozen M=10, live N=7, +5 registered mid-queue → live
N=12 > frozen M=10 → raised to M=12, "Faltan 12 de 12," invariant restored)
and against the defer/resume-with-no-growth case (frozen M unchanged, per
AT-M2). `ux-critic` re-verified all five original findings plus AT-M4 clean
— zero Blocker/Major/Minor findings remain open.

## `merchant-user-tester` walkthrough (2026-08-14)

Real first-time walk: Phone → OTP → "Activar plan de pago" → Business
identity → Catalog setup → registered a 5-unit Lot ("Pijama") → auto-entered
Asignar Tags, tagged 2/5, deferred ("Terminar después") → Inventario
correctly showed "Te faltan 3 artículos por etiquetar" → registered a new
2-unit Lot ("Hoodie") mid-task → correctly re-entered Asignar Tags, finished
Pijama's remaining 3, auto-advanced to Hoodie, finished 2/2 → Inventario
showed "Mercancía lista para vender ✓," both Products fully stocked, zero
pending. **This slice's own contract worked end-to-end exactly as
specified** — no denominator/receipt contradictions were hit at any point in
this real walkthrough (AT-M1/AT-M2/AT-M4's fixes held).

**The one significant finding is explicitly out of this slice's own
scope, not a defect in it.** After fully tagging, switching
`defaultSellingMode` to "Con tags" in Configuración, and confirming zero
pending tags, Home still read "Todavía no tienes prendas con tag para hoy —
vas a vender con botones," and "Iniciar Venta Rápida" still opened the plain
buttons-mode grid. This is `Idle.tsx`'s own already-documented, deliberately
untouched behavior (`Session.operatingMode` resolution is hardcoded to
always evaluate Not Ready, regardless of real tag data — BACKLOG.md item
D.2, NFC Selling, not this slice). A real merchant hitting this exact
contradiction is strong, validating evidence that D.2 is correctly next in
sequence, not optional — logged here rather than silently absorbed as "the
tester didn't understand scope."

**Two smaller, non-blocking observations, logged for a future pass, not
fixed here:**
- A brief header mismatch mid-tagging-session: right after registering
  Hoodie while Pijama's queue was still active, "Lo que registraste: Hoodie
  (2)" (correct, per AT-M1) appeared above "Etiquetando: Pijama... Faltan 3
  de 5" (also correct — the live queue processes in existing order) —
  momentarily reads as if the wrong Product is being tagged. Resolves itself
  once Pijama's segment completes and the queue auto-advances to Hoodie. Not
  a data bug (both lines were independently accurate) — a legibility gap
  worth a visual pass (e.g. clearer separation between "what you just
  registered" and "what you're tagging right now").
- One reported click miss on the "Hoy" bottom-nav tab while on Configuración
  (no visible change on first tap; a distinct "← Configuración" back link
  worked instead). `NavBar.tsx`'s click handler is a direct, unconditional
  `onChange(tab.key)` call with no apparent logic gap — most likely
  test-tooling timing noise (the same walkthrough had one other, similarly
  self-resolved click miss on an unrelated screen), not investigated
  further as a code change this pass.
