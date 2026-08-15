# Slice 8 — Paid Receipt Claim Token / QR

Migration Workflow (`decision-log.md` D43): `product/02-ux/home.md` §3.8f
(Approved) is the implementation contract. The Architecture Gap Analysis
findings were supplied directly in the dispatching task (the ephemeral,
in-memory-only write shape; the write-time-capture condition for the
Paid-tier variant; the mock-URL QR contents; the open build-layer call on
tap behavior) — applied as given, not re-derived. Explicitly out of scope,
untouched: any part of `product/02-ux-loyalty/customer-loyalty-registration.md`'s
own flow (separate deploy target, D38) and any `Customer`/`Claim` domain
modeling.

## Domain layer (`src/domain/store.tsx`)

**`Receipt`** gains `claimToken?: string` — present only when this specific
`Receipt` was captured, at `finalizeSale()` time, with
`state.business.subscriptionTier === 'paid'`; `undefined` (structurally
absent, not merely hidden) for Free tier. Stays exactly what it already
was: an ephemeral read-projection, never part of `AppState`, never written
to `localStorage`, never a field on `Sale`. This keeps the whole slice
outside `decision-log.md` D26's deferral of a persisted `Sale.claimToken`
schema field — nothing here writes anything durable.

**`mintClaimToken(saleId, businessId, finalizedAt)`** (new, private helper)
— a deliberately unsophisticated, opaque mock token. Real cryptographic
signing is out of scope for a backend-less prototype (this pass's own
dispatching task); D22 does still survive as "the Claim Token's
opaque/signed requirement" and explicitly names "never the raw Sale ID" as
the one hard constraint that matters even for a mock — so `saleId`,
`businessId`, and the finalization timestamp are folded through a small
non-cryptographic string hash (djb2, base36-encoded) rather than
concatenated/encoded directly. The result never contains a recognizable,
reversible fragment of the raw Sale ID. Collision-resistance and
unguessability are explicitly not load-bearing: nothing downstream in this
prototype validates or looks the token up (the destination flow is a
separate, confirmed-unbuilt deploy target, D38).

**`finalizeSale()`** — unchanged in every other respect (same write, same
returned `total`/`itemCount`/`businessName`/`businessLogo`/
`subscriptionTier`). One addition: `claimToken` is computed from
`mintClaimToken(openSale.id, state.business.id, finalizedAt)` when
`state.business.subscriptionTier === 'paid'`, else left `undefined`. Uses
the same `finalizedAt` timestamp already being written onto the `Sale`
itself (extracted into a local so the domain write and the token-minting
input are provably the same instant, not two separate `Date.now()` calls
that could theoretically drift).

## UI layer

**`src/screens/Home/HomeScreen.tsx`** — the one `<ReceiptTicket>` call site
now forwards `subscriptionTier={ui.receipt.subscriptionTier}` and
`claimToken={ui.receipt.claimToken}` alongside the three props it already
passed. `subscriptionTier` was already on `Receipt`, just unused by this
call site before; `claimToken` is new.

**`src/components/ReceiptTicket/ReceiptTicket.tsx`** — two new props,
`subscriptionTier: 'free' | 'paid'` and `claimToken?: string`. The file's
own doc comment (previously stating it renders "only the Free-tier variant
... regardless of the current Business's actual `subscriptionTier`") is
corrected to describe the real, now-conditional behavior. One new block,
rendered between the `.business` identity element and the exit-zone
`<button>`, gated on `subscriptionTier === 'paid' && claimToken` — the
exact "four elements on Paid tier vs. three on Free tier" split §3.8f
specifies, with the fourth genuinely absent (not rendered-but-hidden) on
every other path.

The block renders:
- A real, functional QR (`qrcode.react`'s `<QRCodeSVG>`), encoding
  `https://loyalty.nahui.mx/c/<claimToken>` — a well-formed but necessarily
  mock URL. The destination (`customer-loyalty-registration.md`) is a
  separate, confirmed-unbuilt deploy target (D38); this will not resolve if
  actually scanned. Disclosed limitation, not a bug — matches the task's
  own framing exactly. **Superseded later the same day — see this file's own
  "Update — 2026-08-14... QR now resolves for real" section at the end: the
  domain is now the real, live `loyalty.nahui.app`, and scanning it reaches
  a working registration flow.**
- The caption, copied verbatim from `home.md` line ~1304: "Escanéala si
  quieres que te recuerden la próxima vez que compres aquí." No "Claim,"
  "Claim Token," or "QR" wording appears anywhere in the rendered copy.

**No `onClick`/navigation on the QR element** — see "Tap-behavior decision"
below.

**`src/components/ReceiptTicket/ReceiptTicket.module.css`** — three new
classes (`.claimBlock`, `.claimQr`, `.claimCaption`), added immediately
before `.exitZone`. `.exitZone` itself is untouched, confirmed unaffected:
it's already scoped to `position: absolute; bottom: 0; height: 22%` — a
fixed band pinned to the viewport bottom, entirely independent of how tall
the centered `.body` flex stack grows above it. The new block adds one more
child to that stack (spaced by `.body`'s own existing `gap:
var(--space-8)`, no extra margin invented) and never intrudes into the
absolutely-positioned exit band.

## QR-library choice

Added `qrcode.react` (`^4.2.0`) — no QR-generation dependency existed in
`package.json` before this pass. Chosen over the lower-level `qrcode`
package specifically for React ergonomics: `<QRCodeSVG>` is a synchronous
component (`value` in, SVG out), so no `useEffect`/async-state plumbing was
needed just to render a QR, unlike `qrcode`'s callback/Promise-based
`toDataURL`/`toString` API. SVG output also scales cleanly at any DPI
(relevant here — this is a "hold the phone toward a customer to scan"
moment) rather than needing a fixed-resolution rasterized PNG. `fgColor`/
`bgColor` render as literal SVG fill attributes (can't reference a CSS
`var(...)` custom property), so they're hardcoded to mirror
`--color-obsidian`/`--color-paper` exactly (`tokens.css`) — flagged in the
component's own inline comment as "kept in sync by eye, not by reference"
so a future token-value change doesn't silently drift without anyone
noticing.

## Tap-behavior decision

The Gap Analysis's recommendation — no in-app tap-navigation on Ana's own
side, since building even a stub destination screen for a tap would mean
fabricating part of the explicitly out-of-scope
`customer-loyalty-registration.md` flow — is followed exactly, not
deviated from. The QR renders as a genuine, visually scannable SVG image
with `aria-hidden="true"` on its wrapping element and no `onClick`
whatsoever. `home.md` §3.8f's own text is explicit that this is correct:
"Ana's own screen is never touched by this interaction... a direct tap on
this element by whoever is driving the demo is the equivalent stand-in
action" is scoped by the spec itself to "a single-device, click-driven
prototyping medium with no real camera (Figma Present mode)" — i.e., a
Medium-Fidelity/Figma-Present-mode concern, not this React build, which can
render a real, inspectable SVG that a phone camera (or `merchant-user-tester`,
if ever given a second device) could plausibly scan for real, even though
it resolves nowhere. No compelling reason surfaced to add a no-op tap
acknowledgment either — the caption already fully communicates the
element's purpose without needing a tap to confirm engagement, and D22/D40
already establish Ana's own screen has zero read dependency on whatever
happens next on the customer's separate device (`architecture-principles.md`
#6, D35).

`aria-hidden="true"` on the QR's wrapping `<div>` is one small accessibility
judgment call made here, not dictated by the spec: the caption immediately
below is the QR block's real accessible description, and the QR pattern
itself carries no separate meaning to a screen-reader user (she can't scan
it either way, on her own device or anyone else's, through the accessibility
tree). No internal jargon ("Claim," "Token," "QR") was introduced into any
visible or accessible string as a result — the block simply isn't
independently announced beyond its caption.

## Judgment calls / disclosed simplifications

1. **Mock token derivation (djb2 hash over `saleId:businessId:finalizedAt`,
   base36-encoded)** — see "Domain layer" above. Deliberately non-
   cryptographic and explicitly not collision-resistant at any rigorous
   standard; sufficient only to (a) look opaque rather than being a literal
   Sale ID and (b) vary per Sale/Business/moment, which is all any consumer
   of this value in this prototype (a `<QRCodeSVG>` render) actually needs.
2. **`fgColor`/`bgColor` hardcoded hex, not `var(...)` references** — a
   library API constraint (SVG `fill` attributes aren't CSS), not a
   deliberate divergence from the token system. Named explicitly in the
   component's own comment so a future palette change doesn't silently
   leave this element visually stale.
3. **No distinct "declined to offer" affordance** — matches §3.8f's own
   explicit resolution of Q15 ("no dedicated 'decline to offer' action
   exists separately from this screen's own existing exit mechanism"). Ana's
   existing control (how long she leaves the receipt open, when she taps
   the exit margin) is the entire mechanism; nothing new was added or
   needed.
4. **`aria-hidden` on the QR wrapper** — see "Tap-behavior decision" above.
   A build-layer accessibility judgment call, not a spec requirement either
   way (Low-Fidelity is explicitly implementation-independent); disclosed
   rather than silently decided.

## Verification

`tsc -b && vite build` — zero errors. `npm install qrcode.react` completed
against the real npm registry (no offline/vendoring concerns). No
browser-automation tool was available in this session — verification here
is a thorough manual code-review/trace (the `finalizeSale` write-time-
capture condition traced against `state.business.subscriptionTier` at the
exact call site, confirmed never re-read live elsewhere; the single
`ReceiptTicket` call site confirmed to be the only one in `src/`; the
`.exitZone`/new-block layout interaction reasoned through the actual CSS,
not assumed) plus the clean build, not a live click-through. **Flagged
explicitly, same posture as prior slices' own disclosures:** a live
walkthrough — Configuración → activate Paid tier → a full Sale → Finalizar
Venta → confirm the QR + caption render, confirm a Free-tier Sale still
renders the original three-element receipt unchanged, confirm the exit
margin/auto-return both still work with the taller stack — is the natural
next confirmation step before this slice is considered fully confirmed
end-to-end.

## Files touched

`src/domain/store.tsx`, `src/screens/Home/HomeScreen.tsx`,
`src/components/ReceiptTicket/ReceiptTicket.tsx`,
`src/components/ReceiptTicket/ReceiptTicket.module.css`, `package.json`,
`package-lock.json` (new dependency, `qrcode.react`).

## Fix round — 2026-08-14 (`ux-critic` Major + 2 Minors, `knowledge-mentor`
consultation, `reviewer` Suggestion)

One Major, two Minors from `ux-critic`'s review, one accessibility question
routed through `knowledge-mentor`, and one trivial `reviewer` Suggestion —
all against `ReceiptTicket.tsx`/`.module.css` only. No behavior/flow change;
no new dependency.

**Major — `.claimCaption` contrast fails WCAG AA.** `#9C9186` (this
codebase's established "de-emphasized/disabled" gray) against
`--color-paper` computes to **3.02:1** — verified by direct sRGB relative-
luminance calculation (WCAG 2.x formula), not eyeballed — failing the 4.5:1
floor for this 11px normal-weight text. Real problem here specifically
because this caption is the QR block's entire load-bearing explanation, not
decorative secondary content the way `#9C9186` is used correctly elsewhere
(e.g. `.totalLabel`, untouched, left as-is — it sits directly beside its own
bolder value and isn't independently load-bearing the way this caption is).
Fix: `.claimCaption` now uses `#6B6259` — **5.84:1** against `--color-paper`,
clearing AA with real margin. Not a new/invented token: `#6B6259` is this
codebase's own established "secondary but still load-bearing" text gray,
already used this exact way in ~20 other screens (e.g.
`EventsList.module.css`'s `.cardSub`/`.sectionLabel`, `Selling.module.css`,
`RegisterMerchandise.module.css`) — reused, not invented, per the task's own
instruction to check what's already available first.

**Minor 1 — no tap-feedback on a card-styled, visually-tappable QR block.**
Chose **option (b)**: dropped `.claimQr`'s `border`/`border-radius`
entirely, rather than adding a new tap-acknowledgment toast (option (a)).
Reasoning: this element is deliberately inert by explicit architecture
decision — no stub destination screen, no `onClick`, "Ana's own screen is
never touched by this interaction" (`home.md` §3.8f, already quoted in this
file's own "Tap-behavior decision" section above) — and option (a) would
have meant adding a new interactive affordance (an `onClick` + toast-timer
state) to an element the architecture record already, deliberately, gives
zero interactivity. Removing the border/radius is the smaller, cleaner fix
that resolves the actual defect (a bordered rectangle visually matching
`CatalogRow`/`ProductTile`/`TagStub`'s established tappable-card grammar)
without contradicting that existing decision: the QR now renders as plain
layout — the SVG + a small quiet margin, directly on the ticket's own paper
— nothing left that visually invites a tap in the first place. `padding`/
`background` kept (unchanged) purely for the QR's own legibility margin.

**Minor 2 — unverified short-viewport clipping risk, investigated and
disclosed.** No browser/DOM automation tool was available in this session
(same limitation already disclosed in this file's own "Verification"
section above) — this could not be confirmed by an actual render. Instead:
a manual arithmetic trace of the actual shipped CSS values against `.body`'s
real box model:
- `.body`: padding 48px top / 64px bottom (`--space-12`/`--space-16`), `gap:
  32px` (`--space-8`) between each of its (now up to 4) children.
- Per-child natural height, worst case (Paid tier, `businessLogo` set,
  caption wrapping to 3 lines at its 220px `max-width`): `.confirmation`
  ≈20px; `.totalBlock` ≈80–96px (the hero total's `clamp(48px,15vw,64px)`
  varies with real device width); `.business` (with logo) ≈65px;
  `.claimBlock` ≈184–198px (132px QR + 16px padding + 8px gap + 2–3 lines of
  14px-line-height caption).
- Sum, worst case: **≈579px** of natural content height, against a
  genuinely short device's available viewport (e.g. an iPhone SE-class
  device, ~570–667px CSS-px tall depending on Safari's dynamic toolbar
  state) — meaning the worst-case combination (logo set + a 3-line caption)
  sits right at or just past the edge of a ~570px worst-case short viewport,
  a narrow but real margin (single-digit to low-double-digit px), not a
  comfortable safety margin.
- Because `.body`'s children are flex items with the browser default
  `flex-shrink: 1`, and `justify-content: center`, any real overflow would
  clip **symmetrically top and bottom** once `.screen`'s `overflow: hidden`
  applies (confirmed by reading the CSS, not observed live) — most likely
  shaving a few px off the very top of "Venta finalizada ✓" and/or the
  bottom line of the new caption, not a specific single element vanishing
  outright.
- **The exit-tap zone itself is not at risk regardless of this overflow
  question** — `.exitZone` is `position: absolute; bottom: 0; height: 22%;
  min-height: 96px` scoped to `.screen`, which fills the real viewport via
  `inset: 0`, independent of `.body`'s own content flow/overflow. Its hit
  target neither shrinks nor moves based on how tall `.body`'s content
  stack grows.
- **Explicitly disclosed as still-unverified via live rendering** — this
  narrow, worst-case-only clipping risk (not the tap-target itself, which is
  safe by construction) should be checked directly in the live walkthrough
  that follows this fix round, on an actual short-viewport device/emulation,
  exactly as this file's task flagged.

**Accessibility (`knowledge-mentor` consultation, resolved) — chose remedy
(a).** The QR wrapper (`.claimQr`) was `aria-hidden="true"`; the adjacent
caption ("Escanéala...") grammatically depends on the QR as its antecedent
(`-la`), leaving a screen-reader user hearing an orphaned pronoun —
`knowledge-mentor` confirmed (WCAG SC 1.1.1, Tier 3) this doesn't cleanly
qualify for the "decorative, described by nearby text" exception, since the
QR is information-bearing, not pure decoration. Chose **remedy (a)**: the
wrapper now carries `role="img" aria-label="Código QR para que te recuerden
la próxima vez que compres aquí"` instead of `aria-hidden`; the inner
`<QRCodeSVG>` itself now carries its own `aria-hidden="true"` so it isn't
announced a second time as an unlabeled nested image once the wrapper
already has an accessible name. **Not remedy (b)** (rewriting the caption to
drop the pronoun): this layer's own mandate is to lay out the approved
spec's copy exactly as written, not rewrite it — `home.md` line ~1304
quotes "Escanéala si quieres que te recuerden la próxima vez que compres
aquí" verbatim, and (b) would have required changing that exact string.
Remedy (a) fixes the gap without touching spec-owned copy at all.

**Suggestion (`reviewer`, trivial) — trailing period.** Removed. The caption
now reads exactly as `home.md`'s own quoted copy (no trailing period),
one-character change, done alongside the above per the task's own framing.

**Verification:** `tsc -b && vite build` — zero errors (re-confirmed after
all edits above). No browser-automation tool was available in this session
either — same disclosed limitation as this file's original "Verification"
section. Contrast ratios (3.02:1 old, 5.84:1 new) were computed directly via
the WCAG relative-luminance formula (not eyeballed) as part of this fix
round. The short-viewport question above remains genuinely unverified by an
actual render; everything else in this fix round was verified either by
direct calculation, by reading the actual shipped CSS/component code, or by
the clean `tsc`/`vite build`.

**Files touched (this fix round):** `src/components/ReceiptTicket/
ReceiptTicket.tsx`, `src/components/ReceiptTicket/ReceiptTicket.module.css`,
this file.

## Update — 2026-08-14 (later same day, separate pass): QR now resolves for real

The mock URL described above (`loyalty.nahui.mx`) is superseded. A separate,
later pass wired this QR to the real, deployed customer-registration
prototype: `store.tsx`'s `Receipt.claimToken` assignment now writes the fixed
string `'demo-nueva'` (Paid tier only) instead of calling `mintClaimToken`,
and this component's QR URL was changed to
`https://loyalty.nahui.app/c/<claimToken>` — the real, live domain, not the
placeholder `.mx` one described earlier in this file. Scanning the QR now
genuinely reaches a working registration flow. Disclosed limitation, not
fixed: every Paid-tier sale in this demo build encodes the same fixed token,
not a unique one per sale (`mintClaimToken` itself is untouched, kept as the
real mechanism for whenever backend integration replaces this demo-sync
trick). See `BACKLOG.md` item 10 / D.5 and `store.tsx`'s own comment at the
assignment site for the full disclosure. Everything else in this file
(domain layer shape, UI layer structure, QR-library choice, tap-behavior
decision, the 2026-08-14 fix round above) is unaffected and still accurate.
