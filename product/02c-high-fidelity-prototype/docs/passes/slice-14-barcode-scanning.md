# Slice 14 — Phone-camera barcode scanning

`decision-log.md` D65, `inventory.md` §3.8/§3.8a-§3.8e, `home.md`
§3.9/§3.9a/§3.9a-i/§3.9b/§3.9c. A second way to resolve Producto —
alongside the existing typed-name search (Inventario's Elegir producto
picker) and tapping a tile (Home's Selling grid) — via real phone-camera
barcode scanning. This is the one place both approved specs explicitly
deferred to `ui-designer`: "Implementation-independent by design — no
claim made here about camera APIs, device permission mechanics, scan
latency, or which barcode symbologies are read" (`inventory.md` §3.8b).

## What's built

**Domain layer.** `Product.barcode?: string` (`src/domain/types.ts`) —
only ever written from Inventario's own Registrar Mercancía flow;
Selling reads it read-only (`architecture-principles.md` #6, D65's own
ruling). `CommitLotLine`'s `new` variant gains an optional `barcode`,
threaded through `commitLot`'s payload/local-mirror update exactly like
`photo` already is. A new shared selector, `productByBarcode` (trimmed,
**not** case-folded — a barcode is a fact a manufacturer/packager printed,
not one Ana types, so there's no human-typing-variance case to normalize
away the way §3.8's typed-name matching rule does), used identically by
both consumers below so the two never drift into separately-maintained
matching rules.

**`src/components/BarcodeScanner/`** — the one real camera-access surface
in this codebase (every other "scan" here — NFC — is a simulated tap,
since a browser can't reproduce real NFC hardware). Shared, verbatim, by
both consumers below — `home.md` §3.9's own cross-reference ("reuses the
same camera-viewfinder shape... except the header") is implemented as one
component with two label props, not two near-duplicate builds. Built on
`@zxing/browser` (new dependency — `BrowserMultiFormatReader`, a
well-established, actively-maintained TS port of ZXing), chosen over the
native `BarcodeDetector` API specifically for broader browser coverage
(Chrome-only today, no Safari/iOS). **Dynamically imported**
(`await import('@zxing/browser')`), not a top-level import — this library
is sizeable (~570KB), and Home/Selling is the everyday, <3-second screen
(`company/backlog.md` #1); splitting it into its own lazy chunk cut the
main bundle from ~1030KB to ~453KB gzipped-source. The `<video>` element
is always mounted (never gated behind a "ready" flag) so `videoRef.current`
already exists the moment the effect runs and can be handed to
`decodeFromConstraints` as the preview target on the very first attempt —
visibility/interactivity are gated by CSS (`opacity`/`pointer-events`)
instead, so a consumer that keeps its own content mounted underneath
(Selling's grid) is never covered by, or loses taps to, a half-initialized
camera box during the brief permission-negotiation window (load-bearing
for §3.9c's "nothing was ever obscuring the grid" requirement on a denied
outcome). A rejected/failed `getUserMedia` (denied permission, no camera,
a non-secure context) and a browser with no `mediaDevices` API at all
(checked explicitly first) both fold into the identical
`onPermissionDenied` outcome — the approved specs define no separate
"unsupported" state (§3.9c's own heading literally reads "cámara no
disponible / no se pudo leer"). A genuine "no pudimos leer el código"
outcome has no natural discrete trigger with a *continuous* decoder (every
frame is its own silent pass/fail, unlike a shutter-tap capture) — this
build treats 7 seconds of sustained no-decode as the "missed attempt" the
approved copy describes; scanning never stops underneath, and the message
clears the instant a decode actually succeeds.

**`ProductPicker.tsx`** (`inventory.md` §3.8/§3.8a-§3.8e) — extended with
an internal mode state machine (`search | creating | creatingFromScan |
scanning | confirmScan`) rather than a second component. "Escanear código
de barras" sits directly beneath the typed-search field. A scan resolving
to a known `Product.barcode` shows §3.8c's confirm-on-scan sheet — the one
deliberate, reasoned exception to this picker's own "never ask twice"
resolution (a barcode is a fact she doesn't author/control the way a typed
name is; a wrong silent match here would corrupt two Catalog entries'
stock counts invisibly, per D65's own named risk). No match opens §3.8a's
scan variant — an editable Nombre field (a scan structurally can't supply
a name), Precio (required, unchanged), Foto (optional, unchanged), with
the scanned barcode carried silently, never shown as its own field.
Camera-permission-denied falls back onto the same typed-search field,
already focused, with an inline message — never a dead end.

**`Selling.tsx`** (`home.md` §3.9/§3.9a/§3.9a-i/§3.9b/§3.9c) —
"Escanear código de barras" above the tile grid, `buttons`-mode only
(absent from `nfc` mode entirely — a different hardware capability).
Resolves through the identical `addItemToSale` write a tile tap already
uses — no confirm step (deliberately different from Inventory's §3.8c;
the trust decision was already made once, upstream, the first time this
barcode was resolved in Inventory, `architecture-principles.md` #1). A
match at zero available stock (Business-wide or Event-scoped) reuses the
existing dimmed-tile ambient-message mechanism verbatim (`handleDisabledTap`
— the one branch a scan can reach that a tile tap structurally can't,
since a scan carries no pre-flight visibility into a Product's stock the
way an already-dimmed tile does). No match is a genuine dead end toward
Inventario — deliberately **not** an inline "create this Product" prompt
(Selling only ever reads Inventory, never writes to it, D65's explicit
instruction) — "Entendido" returns to the same active-Session screen,
never forcing navigation away from a live customer interaction. Permission
denied reuses the existing ambient self-dismissing `showHint` mechanism
(no link, auto-dismiss); a failed read stays on the shared `BarcodeScanner`
inline, same as Inventory's own §3.8e.

## Backend: a real gap found and closed, not silently assumed

The dispatch's own framing ("the RPC should already raise
`barcode_already_registered` on a uniqueness conflict, per Stage 7 Phase
1") turned out not to hold against the actual applied migrations —
checked directly, not assumed. `20260913030000_inventory_persistence_layer.sql`/
`20260913031000_...fixes.sql` added the `products.barcode` column and its
partial unique index, but `commit_lot`'s own `insert into public.products`
never named the column — a scanned barcode would have been silently
discarded on write regardless of what the client sent, and no collision
exception existed at all. Closed with a new, additive migration
(`supabase/migrations/20260913032000_inventory_barcode_write.sql`) that
writes `barcode` when present and catches a genuine unique-constraint
collision, re-raising it as a named `barcode_already_registered`
exception. No dedicated merchant-facing UI branches on that specific
message — `inventory.md` designs none, since a collision this late (after
§3.8c's own confirm-on-scan already resolved the identity question once)
is a genuinely rare two-device race, correctly and sufficiently covered by
§3.11's existing generic "No se pudo guardar... intenta de nuevo" retry
(her typed data, including the not-yet-created Product's name/price/photo,
is preserved either way). **Not yet pushed to the real hosted Supabase
project** — this sandboxed build environment has no
`SUPABASE_ACCESS_TOKEN`/legacy-token credential (same CLI-auth workaround
`company/infrastructure-decisions.md` ID018 documents for every prior push
in `supabase/README.md`); confirmed via `npx supabase projects list`
returning `LegacyPlatformAuthRequiredError`. Until pushed, a real device
scanning a genuinely new barcode and completing "Guardar mercancía" will
create the Product correctly (name/price/photo) but silently lose the
barcode itself — full disclosure and the exact operational step needed
live in `supabase/README.md`'s checklist item 12.

`tsc -b`/`npm run build` both clean.

## What was not, and could not be, verified here

This dispatch's own instruction anticipated this: **no live device/browser
camera test was possible in this sandboxed build environment** — no
physical camera, no printed/on-screen barcode to present to it, and (per
above) the barcode-write migration isn't even live yet. Everything above
is verified at the build/type-check level and by direct reading of the
resulting component tree and control flow, not by an actual scan. A real
device walkthrough (ideally `merchant-user-tester` against a deployed
build, or a manual pass by the Product Owner) is needed before this
feature is considered fully verified — specifically: real-world permission
prompts on iOS Safari/Android Chrome, real symbology coverage against
actual retail/off-brand packaging, and the 7-second no-read-timeout
heuristic's real-world feel (tune freely if it reads as too eager or too
slow in practice — not escalated, a disclosed implementation choice, not a
spec requirement).
