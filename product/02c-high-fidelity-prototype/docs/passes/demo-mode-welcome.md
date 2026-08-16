# Demo Mode — Welcome Screen

**New-Feature Workflow (`decision-log.md` D42), not a Migration Workflow
slice** — first of its kind in this codebase. No prior Approved
Medium-Fidelity spec exists for this feature; `product/02-ux/demo-mode.md`
(Product Definition + UX Design + placement ruling (`decision-log.md` D48) +
`brand-guardian` review + Architecture Review, all complete) is the
implementation contract, built strictly against it. Not one of the six
Merchant Application experiences tracked in `BACKLOG.md`/its Migration
inventory — that file's own scope is IA-journey slices with an Approved
Medium-Fidelity spec; this is validation-campaign infrastructure with no
code path in a real production build at all, so it isn't logged there.

## What this is

A one-time welcome screen shown before `authentication.md`'s flow begins,
**exclusively in validation-campaign builds.** Structurally absent from a
real production build — not merely hidden behind a runtime check (§1's own
acceptance criterion, reiterated by the Architecture Review at §8 item 1).

## The three Architecture Review decisions (§8), applied exactly as given

1. **Build-detection: compile-time, via a Vite build mode.** New
   `.env.demo-campaign` (`VITE_DEMO_MODE=true`), new `package.json` scripts
   (`build:demo-campaign` — `tsc -b && vite build --mode demo-campaign
   --outDir dist-demo-campaign`; `dev:demo-campaign` — `vite --mode
   demo-campaign`, added for local verification/dev convenience, not itself
   dictated by §8 but harmless and useful given the same mechanism). The
   `--outDir` override on the build script keeps the demo-campaign output
   (`dist-demo-campaign/`) from clobbering the default `dist/` — both are
   gitignored.
2. **Device-acknowledgment persistence: a separate `localStorage` key.**
   `src/screens/DemoMode/demoModeStorage.ts` — `nahui-demo-mode-acknowledged`,
   read/written independently of `store.tsx`'s `STORAGE_KEY`
   (`'nahui-hifi-prototype-v1'`). §2.1 checks 2/3 collapse to the one
   boolean read the Architecture Review's own implementation-guidance note
   specifies — no third persisted state.
3. **Mounting shape: an outer wrapper around the unmodified `<AppRouter />`.**
   `src/screens/DemoMode/DemoModeGate.tsx` (the compile-time branch) →
   `DemoModeGateActive.tsx` (the runtime resolution, only reachable in a
   Demo Mode build) → renders `<AppRouter />` unchanged once acknowledged or
   not applicable. `src/main.tsx` now mounts `<DemoModeGate />` in place of
   the previously-bare `<AppRouter />`; `AppRouter.tsx` itself and
   `authentication.md`'s resolution logic inside it are untouched — verified
   directly, zero lines of that file were edited.

## Why the gate is split into two components (`DemoModeGate` / `DemoModeGateActive`)

Deliberate, to make the dead-code elimination the Architecture Review
requires trivial for the bundler to prove, rather than merely likely:
`DemoModeGate.tsx` is a single, static, top-level `if
(import.meta.env.VITE_DEMO_MODE !== 'true') return <AppRouter />;` — not
funneled through `useState`/React state, which would make the branch's
provable-unreachability dependent on cross-hook data-flow analysis a
minifier can't always do. Because Vite replaces
`import.meta.env.VITE_DEMO_MODE` with a literal at build time (`undefined`
in a real production build, since `.env.demo-campaign` is never loaded
under the default `production` mode), that `if` folds to a statically-known
`true` in a production build, and Rollup/esbuild eliminate the dead branch
— along with every import only reachable from it (`DemoModeGateActive`, and
transitively `DemoWelcome`/`DemoLoadError`/`demoModeStorage.ts`).

## Screens built

- **`DemoWelcome.tsx`/`.module.css`** (§3.3 "Bienvenida a la demo" / §3.4
  "Retomar", one component for both — pixel-identical per the spec's own
  text, nothing typed here to preserve). Reuses the exact `wrap`/`mark`/
  `copy`/`eyebrow`/`body`/`cta` shape `PhoneStep.tsx`/`Welcome.tsx`
  (Onboarding) already establish for a first-screen-in-the-product moment —
  `BrandMark`, the "Nahui" eyebrow, centered intro copy, a single `Button`
  CTA. One new content shape, added deliberately rather than reused from
  elsewhere (no prior bullet-list precedent in this codebase): a left-aligned,
  hanging-indent two-item list for the spec's two operational bullets,
  sitting between the centered intro paragraph and the centered closing
  paragraph — ordinary Inter-body-copy layout at existing spacing/color
  tokens, no new visual vocabulary, tag treatment, or color introduced.
  Copy is verbatim from the spec (already through `brand-guardian` review) —
  not altered.
- **`DemoLoadError.tsx`** (§3.5 "Falla defensiva") — reached via §2.1 check
  4, the device-acknowledgment `localStorage` read failing outright.
  Reuses `ColdStart.module.css`'s shared wrap/copy/cta shape, the same
  pattern `ResultadosLoadError.tsx`/`PhoneStep.tsx`'s own §3.5a error branch
  already reuse. Unlike `ResultadosLoadError` (which has no possible
  trigger at all in this build), this one is a **genuinely reachable**
  branch — `DemoModeGateActive.tsx` wraps the read in a real `try`/`catch`
  and routes here on failure (e.g. `localStorage` inaccessible in a
  restrictive browsing context), not a disclosed-but-unwired stub.
- **§3.1/§3.2 (Resolving, near-instant/slow) — architecturally
  inapplicable in this build, not omitted.** Same, repeatedly-established
  reason already disclosed for every other tab's own missing §3.1/§3.2
  states (`docs/passes/slice-3-eventos.md`'s Eventos-pass note, itself
  citing the same precedent for Home/Inventario): state loads synchronously
  from `localStorage`, with no observable async boundary to represent a
  "resolving" phase. `DemoModeGateActive`'s `resolveGateState()` runs
  inside `useState`'s lazy initializer, before first paint — there is no
  frame in which either wireframe could ever render. Not built as separate
  components, for the same reason this codebase's other tabs don't build
  them either (contrast with the Falla defensiva/PhoneStep-error
  precedent above, which *are* built despite being unreachable in this
  build — the difference is that those two represent a real failure mode a
  future backend could genuinely produce, where "resolving" represents an
  async gap this build's architecture doesn't have at all).

## Files touched / added

New: `src/screens/DemoMode/DemoModeGate.tsx`, `DemoModeGateActive.tsx`,
`DemoWelcome.tsx`, `DemoWelcome.module.css`, `DemoLoadError.tsx`,
`demoModeStorage.ts`; `.env.demo-campaign`.
Modified: `src/main.tsx` (mounts `<DemoModeGate />` instead of
`<AppRouter />`), `src/vite-env.d.ts` (`ImportMetaEnv`/`ImportMeta`
augmentation for `VITE_DEMO_MODE`), `package.json` (two new scripts),
`.gitignore` (`dist-demo-campaign`). **Untouched, verified directly:**
`src/AppRouter.tsx`, `product/02-ux/demo-mode.md`.

## Verification

- `npx tsc -b --force` — zero errors.
- `npm run build` (default `production` mode) — built clean; grepped the
  output bundle (`dist/assets/*.js`, `*.css`) for `"Empezar demo"`,
  `"prototipo de Nahui"`, `"No pudimos cargar la demo"`,
  `"nahui-demo-mode-acknowledged"` — **none found.** Confirms the spec's
  own "structurally absent... in a real production build" bar (§1), not
  just "hidden behind a runtime check."
- `npm run build:demo-campaign` — built clean into `dist-demo-campaign/`;
  the same grep against its output bundle found **all four markers
  present.** Bundle size delta (~2.1KB minified JS) is consistent with the
  gate + two small screens + storage helper actually being included, not a
  false positive from an unrelated string.
- `npm run dev` vs. `npm run dev:demo-campaign` — started each in turn,
  `curl`'d the Vite dev server's own transformed module output for
  `DemoModeGate.tsx` directly: under the default dev mode,
  `import.meta.env` has no `VITE_DEMO_MODE` key at all (confirms the
  compile-time condition reads as falsy exactly as intended); under
  `--mode demo-campaign`, `import.meta.env.VITE_DEMO_MODE` is literally
  `"true"`. Confirms the mode flag is respected identically in dev and
  build, and that `DemoModeGate`'s branch condition is driven by the real
  Vite-injected value, not a hardcoded/mocked one.
- **No browser-automation tool was available in this session** (no
  `puppeteer-core`/Playwright installed, no headless Chrome on this
  machine) — a real interactive click-through ("does tapping 'Empezar
  demo' genuinely land on `authentication.md`'s Phone step, does a second
  app-open on the same device skip straight past this screen") was **not**
  performed live. Verified instead by direct code trace: `DemoModeGateActive`
  sets `gate` to `'pass-through'` both on "already acknowledged" (initial
  resolution) and immediately after `onStart` fires (post-tap), and the
  `'pass-through'` branch renders `<AppRouter />` with no other condition
  gating it — the identical, unmodified component the rest of this
  codebase already exercises end-to-end. Flagged as the natural next
  confirmation step, the same disclosed posture prior New-Feature/Migration
  passes in this folder have used when no browser tool was available (e.g.
  `docs/passes/slice-8-paid-receipt-qr.md`'s own "Verification" section).

## Judgment calls / disclosed simplifications

1. **The left-aligned bullet-list layout for §3.3's two operational
   bullets** is a new content shape not previously present anywhere in this
   codebase's screens. Treated as ordinary layout/typography work (existing
   spacing/color/type tokens only, no new component or visual vocabulary)
   rather than something requiring a `knowledge-mentor` consultation before
   finalizing — flagged here explicitly in case Main disagrees with that
   call, since no `knowledge-mentor`-invocation tool was available to this
   dispatch to actually route the question even if warranted.
2. **`dev:demo-campaign` script** — added beyond the Architecture Review's
   literal ask (`build:demo-campaign` only) purely to make the mode-flag
   verification above possible without a production build each time. Same
   mechanism, zero behavior risk, easy to remove if Main prefers a smaller
   diff.
3. **`--outDir dist-demo-campaign` on the demo-campaign build script** — not
   specified by the Architecture Review, added so the two build outputs
   don't collide/overwrite each other on disk, which is what made the
   side-by-side bundle-content verification above possible in the first
   place.
