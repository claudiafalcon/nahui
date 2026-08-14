# Slice 7 — NFC Selling

Migration Workflow (`decision-log.md` D43): `product/02-ux/home.md` §2's NFC
Readiness sub-step, §3.6a's remaining three variants, and §3.10's selling
surface (Approved) is the implementation contract. Architecture Gap Analysis
findings were supplied directly in the dispatching task (the readiness
computation, the `startSession` write-path change, the override mechanism,
the `nfcAvailabilityNudgeShown` field, the §3.10 branch, the
`addItemToSaleByTag` write) — applied as given, not re-derived. Explicitly
out of scope, untouched: `home.md` §3.8f (Paid Receipt Claim Token/QR,
BACKLOG.md item D.3), anything Loyalty/Customer, Configuración's existing
controls (Slice 4).

## Domain layer

**`src/domain/selectors.ts`.** Three new selectors plus one disclosed
constant, placed immediately after the existing `nfcCapable` (kept
independent of it, per `home.md` §2's own "check both independently"
instruction):
- `taggedAvailableCount` — `available` units carrying a tag.
- `totalAvailableCount` — `taggedAvailableCount` + the already-shipped
  `pendingTagCount` (reused, not re-derived).
- `NFC_READINESS_THRESHOLD = 0.8` — a disclosed, illustrative constant.
  `decision-log.md` D23 explicitly leaves the actual threshold "a
  configurable product/business rule, not hard-coded into the Foundation";
  0.8 is this build's own stand-in choice, named as such in its own doc
  comment, not presented as a Product Owner-set business rule. Never
  surfaced to Ana as a number anywhere in the UI (`home.md` §3.6a's own
  explicit rule) — it only ever drives internal branching.
- `nfcReadiness(state): 'ready' | 'limited' | 'not-ready'` — Not Ready when
  `taggedAvailableCount === 0` regardless of how much is pending; otherwise a
  pure threshold comparison.

**`src/domain/types.ts`.** `Business` gains one field:
`nfcAvailabilityNudgeShown: boolean` — `home.md` §3.6a's fourth variant's own
"shown once ever" flag, mirroring `pendingSubscriptionTierAcknowledged`'s
existing pattern. Defaulted `false` at the one Business-creation path
(`completeOnboarding`) and in `loadState`'s backward-compat guard (an older
saved Business has no such key at all).

**`src/domain/store.tsx`.**
- `startSession(eventId?, overrideToNfc?)` — signature gains a second,
  optional parameter (defaults `false`, so every pre-existing call site
  needed an explicit update, not a silent behavior change). The function
  body no longer hardcodes `operatingMode: 'buttons'`; it now computes
  `nfcCapable(s)`/`nfcReadiness(s)` defensively from the functional
  updater's own `s` (never trusting a UI-computed value — the same posture
  `setPriceOverride` already establishes) and resolves `operatingMode`
  exactly per the dispatching task's own pseudocode: `nfc` only when
  `defaultSellingMode === 'nfc'` **and** capable **and** (`ready`, or
  `limited` with `overrideToNfc === true`); every other combination stays
  `buttons`. `overrideToNfc` itself is the one input that genuinely can't be
  derived from stored state — it's a per-tap merchant choice — so it's the
  one value trusted as passed in.
- `addItemToSaleByTag(tagId)` — new, mirroring `assignTagToNextPendingUnit`'s
  discriminated-result shape (`{ok:true, unitId, productId} | {ok:false,
  reason}`), reusing `addItemToSale`'s identical price-resolution/
  Sale-creation logic with one swap: unit selection resolves the *specific*
  scanned unit (`u.tagId === tagId && u.status === 'available'`) instead of
  FIFO's oldest-available-for-this-Product pick. `reason: 'no-match'` is
  Q2's own open gap (see below) — the function returns it rather than
  throwing or silently no-opping, but doesn't itself define any merchant-
  facing resolution for it (that's the caller's, disclosed, call).
- `markNfcAvailabilityNudgeShown()` — new, sets the flag unconditionally to
  `true`; idempotent in effect.

## Screens (`src/screens/Home/`)

**`useNfcSessionStart.ts`** (new) — the shared hook the dispatching task's
own connection-points note asked for ("factoring the shared logic into one
hook consumed by both files rather than duplicating them"), replacing the
single hardcoded `notReady` boolean in both `Idle.tsx` and `EventResume.tsx`.
Resolves which of `home.md` §3.6a's four variants (if any — `'none'` is the
common case) applies, **frozen at this hook's own mount** via `useState`'s
lazy initializer rather than recomputed on every render. This freezing is
load-bearing for the fourth variant specifically: `markNfcAvailabilityNudgeShown()`
fires, via a `useEffect` with an empty dependency array, the render this
variant is first resolved — without freezing the initial read, that same
write's own resulting re-render would flip the live `nfcAvailabilityNudgeShown`
flag to `true` and make the mention vanish before Ana can read it. This is
the identical technique `SettingsScreen.tsx`'s own `reconcilePendingSubscriptionTier`/
`landed` local-state pair already established for an analogous one-time-
acknowledgment case (capture the moment, don't re-derive off a live flag the
same action just flipped) — reused, not reinvented. Freezing all four
variants uniformly (not only the fourth) also gives the other three the
"shown once per occurrence of this Session-start moment" behavior §3.6a
already specifies for free: an "occurrence" is exactly one mount-to-unmount
visit to Idle/EventResume, and both components genuinely unmount/remount on
every real Home-open-adjacent navigation this build has (opening
Configuración, opening Asignar Tags, a fresh Session starting).

**`NfcSessionStartNote.tsx`** (new) — the presentational half, also shared,
rendering the one extra line (+ at most one link/override control) per
variant, reusing `Idle.module.css`'s pre-existing `.readinessNote`/
`.readinessLine`/`.readinessLink` classes (already established for the old
single Not Ready case) rather than inventing new styling per variant. One
small additive class, `.readinessLinkInline`, was needed for Limited Ready's
post-override state ("Vas a usar tags esta sesión · [ Cambiar ]" — one line,
not a stacked line+link the way the other three variants render).

**`Idle.tsx` / `EventResume.tsx`** — both now call `useNfcSessionStart()` and
render `<NfcSessionStartNote>` instead of their old inline `notReady &&
(...)` block. Both dropped the `defaultSellingMode` prop entirely (the hook
now derives it from `state.business` directly) and both gained a signature
change on their own Session-start callback — `onStartSession`/`onContinue`
now take `(overrideToNfc: boolean)` — so the CTA tap threads Limited Ready's
current override choice through to `startSession` at the exact moment of
that tap, per §6's own footnote ("before the existing Session-start tap").

**`HomeScreen.tsx`** — both call sites updated:
`onStartSession={(overrideToNfc) => startSession(undefined, overrideToNfc)}`
and `onContinue={(overrideToNfc) => startSession(activeEvent.id, overrideToNfc)}`;
the now-unused `defaultSellingMode={state.business.defaultSellingMode}` prop
was removed from both call sites.

**`Selling.tsx`** — gains one branch: `session.operatingMode === 'nfc'`
renders §3.10's surface (the same `SessionHeader`/`VentaActualTray` shell,
zero product grid — not grayed out, not present) via a centered
`NFCScanPrompt`, instead of the `ProductTile` grid; the `'buttons'` path is
byte-identical to before. `NFCScanPrompt` (`src/components/NFCScanPrompt/`,
built for the Asignar Tags slice) gained two optional props — `label`/
`ariaLabel` — so this exact component could be reused unchanged rather than
forked, per the Gap Analysis's own instruction; `AssignTags.tsx`'s existing
call site passes neither and is untouched (defaults preserve its original
copy exactly). Scanning is simulated the same way Asignar Tags simulates
tagging: `handleScan` picks a random unit from
`state.units.filter(u => u.status === 'available' && u.tagId != null)` and
calls `addItemToSaleByTag` with its `tagId` — never minting a new tag, never
touching the domain layer with a fabricated identity.

## Genuine open gap — disclosed, not resolved (`product-decisions.md` Q2)

**Updated by the 2026-08-14 fix round below** — the original pass's own
`showHint`-only fallback (message, no link) was the "dead end" a
`ux-critic` Major later caught; the fallback now also offers the "Asignar
tags" hand-off Q2's own text already decided as the mechanism. The
paragraphs immediately below describe this section's *original* state, kept
for the historical record; see "Fix round — 2026-08-14" at the end of this
file for what changed and why Q2 itself still isn't closed.

`home.md` §3.10 as Approved defines only the empty-tray idle prompt — no
behavior for a scan matching zero `available` tagged units (every tagged
unit for a Product already sold this Session; a customer wants a Product
whose only remaining stock happens to be untagged — FIFO substitution
doesn't apply in `nfc` mode). This build does **not** invent a resolution
affordance for that case. `handleScan`'s own empty-pool branch (and
`addItemToSaleByTag`'s defensively-unreachable `'no-match'` result) reuses
`Selling.tsx`'s own pre-existing ambient-hint mechanism (`showHint` — the
same mechanism a sold-out buttons-mode tile tap already used, Slice 3) so
the tap is never silently inert, but this is deliberately *not* a designed
§3.10 state — it's the minimum honest non-crash guard, disclosed the same
way every other unresolved gap in this codebase is disclosed. Q2 stays open
for `ux-designer`; nothing here should be read as having closed it.

In practice, this pool can only run empty mid-Session if every tagged unit
for some Product sells out while untagged stock of the same Product remains
— a real but narrow scenario at pilot scale (Asignar Tags' own default
posture is "tag as you register," so most Catalogs reach a mostly-tagged
steady state quickly). Not fabricated as solved; just named as unlikely to
be hit in an ordinary walkthrough.

## Judgment calls / disclosed simplifications

1. **`useNfcSessionStart`'s freeze-at-mount, not the literal "recomputed on
   every render" reading of "evaluated ambiently, on every Home open."**
   Freezing at mount is what makes "ambiently, on every Home open" and
   "shown once ever"/"shown once per occurrence" simultaneously true without
   two different mechanisms — see the hook's own doc comment for the full
   reasoning (a live re-derivation of the fourth variant would make it
   disappear on-screen the instant its own mark-write landed). Considered
   and rejected: a live recompute for the first three variants and freezing
   only the fourth — rejected for introducing two different mental models
   for what should be one shared hook, and because a genuinely live
   recompute for Not Ready/Limited Ready/capability-revoked would let a
   background write (e.g. Configuración reachable via the "⋯" sheet without
   fully unmounting Idle in some future refactor) silently swap the
   displayed mention mid-read — freezing avoids that class of bug too, not
   only the one it was designed to fix.
2. **No scan-failure simulation on the selling surface**, unlike Asignar
   Tags' own `SCAN_FAIL_CHANCE`. `home.md` §3.10 doesn't define a
   scan-failed state for selling (that's `inventory.md` §3.16, a distinct
   screen in a distinct document) — adding one here would be inventing a
   state the approved spec doesn't call for, not reusing an existing one.
   Every tap on the `NFCScanPrompt` in `nfc` mode either adds an item or hits
   the disclosed Q2 fallback above; nothing in between.
3. **The demo Onboarding path (`defaultSellingMode='nfc'`, `subscriptionTier='paid'`)
   still seeds zero Lots/units** (`onboarding.md` §11's own disclosed
   thinness, unchanged by this pass) — so it still starts every fresh demo
   walkthrough at Not Ready, exactly as before, but now for a real,
   computed reason (`taggedAvailableCount === 0`) rather than a hardcoded
   one. This is the expected, correct behavior post-Slice-6: a merchant has
   to actually register merchandise and tag some of it (Inventario) before
   `nfc` becomes reachable, on the demo path exactly as on any other.

## Verification

`tsc -b && vite build` — zero errors. No browser-automation tool was
available in this session — verification here is a thorough manual
code-review pass (the `startSession` resolution table traced by hand against
all five combinations §2 lists; the freeze/mark-once interaction in
`useNfcSessionStart` traced against the mount → effect → write → re-render
sequence; `addItemToSaleByTag`'s price-resolution parity with `addItemToSale`
confirmed line-by-line; every removed/added prop's call sites grepped for
staleness) plus the clean build, not a live click-through. **Flagged
explicitly:** a live walkthrough — demo path → register + partially tag
merchandise → confirm Limited Ready's inline override appears and actually
flips `Session.operatingMode` → a separate Paid-tier walkthrough tagging to
100% → confirm the Ready-but-buttons nudge appears exactly once across two
Home opens → a scan-driven Sale through Finalizar Venta — is the natural
next verification step before this slice is considered fully confirmed
end-to-end, consistent with Slice 6's own disclosure at this same point.

## Files touched

`src/domain/types.ts`, `src/domain/selectors.ts`, `src/domain/store.tsx`,
`src/screens/Home/useNfcSessionStart.ts` (new),
`src/screens/Home/NfcSessionStartNote.tsx` (new), `src/screens/Home/Idle.tsx`,
`src/screens/Home/Idle.module.css`, `src/screens/Home/EventResume.tsx`,
`src/screens/Home/HomeScreen.tsx`, `src/screens/Home/Selling.tsx`,
`src/screens/Home/Selling.module.css`,
`src/components/NFCScanPrompt/NFCScanPrompt.tsx`.

## Fix round — 2026-08-14

Two findings from the Review Pipeline, both fixed directly (no redesign,
per the dispatching task's own framing).

**1. `ux-critic` Major — §3.10's no-match scan fallback was a dead end.**
`product-decisions.md` Q2 already decides the *mechanism* for a scan
matching zero `available` tagged units: "the merchant is guided to tag the
unit immediately when the situation arises," via "the redirect from Selling
into Inventario's Asignar Tags flow… a sanctioned UI hand-off pattern
already used elsewhere" — the same hand-off §3.6a's own Not Ready mention
already uses ("Todavía no tienes prendas con tag para hoy… [Asignar tags]").
Only the *exact wireframe placement* on §3.10 itself is still Q2's own open
item for `ux-designer` — not invented here.

`Selling.tsx` now takes an `onNavigateToAssignTags` prop (`HomeScreen.tsx`
threads its own existing `onNavigateToAssignTags` down one level, the same
prop `Idle.tsx`/`EventResume.tsx` already receive it as — no new navigation
concept). `handleScan`'s no-match branch (both the empty-pool case and the
defensively-unreachable `!result.ok` case) now calls `showHint` with an
optional `link` — a tappable "Asignar tags" button rendered inline inside
the same ambient, self-dismissing hint paragraph, styled to match the
copy/visual register of the sibling `.readinessLink`/`.readinessLinkInline`
links elsewhere in this file family (`Selling.module.css`'s new
`.stockHintLink`). `showHint`'s dismiss timeout is now conditional — 4200ms
when a link is present (was 2400ms uniformly) — so a merchant mid-Sale has a
real chance to read and tap the link, not just read the fact before it
vanishes. This stays a link inside the existing toast/hint, not a modal
interruption, per the dispatching task's own explicit instruction (fires
mid-Sale, customer potentially present). Q2 is not closed by this fix — only
the "no next step at all" defect is; the wireframe placement question stays
open for `ux-designer`.

**2. `reviewer` Important — `addItemToSaleByTag` duplicated rather than
reused `addItemToSale`'s logic.** `store.tsx` gains two shared helpers,
mirroring the `mintProduct`/`resolveVenue` extraction pattern already in
this file (both pure, called from inside each writer's own `setState`
updater, never calling `setState` themselves):
- `resolvePricePaid(s, session, productId)` — the D33 Price Override
  lookup + `defaultPrice` fallback, previously implemented twice.
- `appendItemToOpenSale(s, sessionId, productId, unitId, pricePaid)` — the
  find-or-create-open-Sale + append-`SaleItem` + mark-unit-`reserved` write,
  previously implemented twice.

`addItemToSale` and `addItemToSaleByTag` now both call these two helpers
instead of each carrying its own copy of the same logic — the doc comments
that already described this as "reuse" are now accurate rather than
aspirational. Bundled in alongside this extraction, per the dispatching
task's own explicit invitation (reviewer's Suggestion, low-risk): both
functions now also defensively re-check `session.operatingMode` matches
the mode they're only ever reachable under (`'buttons'`/`'nfc'`
respectively) before doing any work — unreachable through the real UI
today, same "never trust a UI-computed value" posture `setPriceOverride`/
`startSession` already apply elsewhere in this file. `addItemToSaleByTag`
reuses the existing `'no-match'` reason for this case rather than adding a
new reason variant nothing in the UI branches on differently.

Verification: `tsc -b && vite build`, zero errors (same manual-code-review
posture as the original pass — no browser-automation tool available in this
session either).

`ux-critic` re-verified fix 1 (Major closed — traced `onNavigateToAssignTags`
end-to-end from `App.tsx` through `HomeScreen.tsx` to `Selling.tsx`'s two
no-match branches; confirmed the toast-not-modal shape and Sale-state safety
across the tab switch) and `reviewer` re-verified fix 2 (both write actions
genuinely call the same two shared helpers; D33 behavior preserved; the
bundled `operatingMode` re-check can't misfire on any real UI path) — both
PASS.

**Known limitation, logged not fixed (ux-critic Minor, new, found during
re-verification):** `.stockHintLink`'s `font-weight: 700` +
`text-decoration: underline` don't exactly match `.readinessLink`/
`.readinessLinkInline`'s `font-weight: 600`, no underline — the doc comment
introduced in fix 1 claims exact parity with that register when the CSS
doesn't quite deliver it. Not a usability defect (arguably the underline
helps tap affordance inside a fast-dismissing toast) and not a Blocker or
unresolved Major, so per this project's exit criteria it doesn't require
another fix round on its own. Accepted as-is; candidate for a future visual
pass to either match `.readinessLinkInline` exactly or correct the comment
to state the deliberate deviation.

## Fix round — 2026-08-14 (2), race condition on "Asignar tags"

**Found by `merchant-user-tester`'s live walkthrough, then independently
reproduced directly in the browser** (not a code-review finding this time):
the fix immediately above ("Fix round — 2026-08-14", finding 1) closed the
"dead end" defect but introduced a new one of its own. `showHint`'s
link-bearing branch kept the auto-dismiss timer, just lengthened it to
4200ms. Reproduced with a live injected state (Paid Business,
`defaultSellingMode: 'nfc'`, an active `nfc`-mode Session, zero
tagged-and-available units, three untagged-available units): tapping the
scan prompt correctly surfaced the "No hay ninguna prenda con tag lista para
escanear… Asignar tags" toast, but clicking "Asignar tags" failed on both a
delayed attempt and an attempt made immediately after the toast appeared —
`document.querySelectorAll` confirmed the button was already gone from the
DOM by the time the click could land. 4200ms is not a real fix for a race
condition; it's a bigger number racing the same clock. This is also the one
message in this file wrapping an actual decision+action (read, decide,
move, tap) rather than a passive glance-only fact, which is exactly why it
alone can't be timed the way the rest of `stockHint`'s callers correctly
are.

**Fix: remove the auto-dismiss for the link-bearing case entirely, rather
than lengthening the timeout further.** `showHint` no longer schedules
`stockHintTimeout` at all when a `link` is present — no timer, so nothing
can race the click, structurally, not just "a longer window that's
statistically less likely to be hit." This mirrors the pattern already
established elsewhere in this file family for "here's a problem, here's
your fix" moments: `NfcSessionStartNote.tsx`'s "Not Ready" variant never
auto-dismisses either; it stays visible until Ana acts or the screen
unmounts. The no-match toast now gets the same treatment, cleared only by a
real event: (a) tapping "Asignar tags" navigates away, and the toast's own
component state is discarded on `Selling.tsx`'s unmount; (b) `handleScan`'s
own success branch now explicitly clears a still-showing link-bearing
`stockHint` before returning, so a scan that actually resolves (a tagged
unit somehow becomes available mid-Session) doesn't leave a stale "no
match" message sitting next to a Sale that just gained an item; (c) leaving
this screen entirely via any other path (Session close, etc.) clears it
naturally through unmount, as before. `handleDisabledTap`'s plain,
link-less sold-out-tile message (§3.9's `'buttons'`-mode path — mutually
exclusive with `'nfc'`-mode's `handleScan` at the `Session.operatingMode`
level, so the two never compete for the same toast) is untouched and keeps
its original 2400ms auto-dismiss.

**Why not just lengthen the timeout again (e.g. to 8-10s):** any fixed
timer is still racing an unbounded human variable (how long it takes a
first-time merchant, possibly mid-conversation with a customer, to notice,
read, and act on a message) — a longer number only moves the failure
threshold, it doesn't remove it. The one call site in this file that wraps
a real decision+action is exactly the one call site that shouldn't be on a
clock at all; every other `stockHint` usage stays a passive fact and
correctly keeps its short auto-dismiss.

**Traced for stuck-forever/stacking risk:** re-tapping the scan prompt while
the no-match message is already showing re-runs `handleScan`, which
recomputes the (still-empty) tagged-available pool and calls `showHint`
again with the same message/link — this simply replaces `stockHint`'s state
(React `setState`, not an append) and clears an already-`undefined`
timeout ref (a safe no-op), so it re-shows the identical message rather than
stacking or breaking. No path leaves a stale toast visible after the
underlying condition genuinely changes, and no path leaves it stuck across
a screen change (component unmount discards the state regardless of any
timer).

**Verification:** `tsc -b && vite build` — zero errors. No browser-automation
tool was available in this session (Figma MCP tools only; no Playwright
dependency in this project) — the dev server was started and reachable
(`curl` 200), but with no way to drive a real click, it was stopped rather
than left running unverified. Verification here is a deliberate, structural
code trace, not a longer timeout hoped to avoid the race: confirmed no
`window.setTimeout` is scheduled at all on the link-bearing path (the branch
returns before reaching the `setTimeout` call), confirmed the success path
explicitly clears a stale link-bearing hint, and confirmed the two
`operatingMode`s that could otherwise contend for `stockHint` never run
concurrently. Flagged explicitly, same posture as the rest of this slice's
own disclosures: a real click-through of "trigger the no-match toast → tap
Asignar tags → land on Inventario's Asignar Tags queue" with actual browser
tooling is the natural next confirmation step, not yet performed live here.

Files touched (this fix round): `src/screens/Home/Selling.tsx` only.
