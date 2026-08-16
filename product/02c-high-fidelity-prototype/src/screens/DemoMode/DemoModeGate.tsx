import { AppRouter } from '../../AppRouter';
import { DemoModeGateActive } from './DemoModeGateActive';

/**
 * Note: "Demo Mode" here is unrelated to `OnboardingPath`'s `'demo'` value
 * (`src/domain/store.tsx`) — that's the Onboarding "Ver un ejemplo" path, a
 * separate, pre-existing domain concept. Both happen to use the "demo"
 * token; no shared imports or storage keys connect them.
 *
 * demo-mode.md — the top-level, compile-time build-detection gate
 * (Architecture Review §8 item 1). `import.meta.env.VITE_DEMO_MODE` is only
 * `'true'` when this build was produced via `vite build --mode
 * demo-campaign` (`.env.demo-campaign` sets it; `package.json`'s
 * `build:demo-campaign` script runs that mode). A real production build
 * (`npm run build`, Vite's default `production` mode) never defines it, so
 * this condition folds to a statically-known `true` — everything below it
 * (`DemoModeGateActive`, and transitively `DemoWelcome`/`DemoLoadError`/
 * `demoModeStorage.ts`) is proven unreachable and stripped by Vite/Rollup's
 * dead-code elimination, not merely hidden behind a runtime flag. This is
 * what makes `authentication.md §1`'s "structurally absent" bar (repeated
 * in `demo-mode.md §1`) actually true of the shipped bundle, not just true
 * by convention.
 *
 * Written as a single, static top-level `if` — not funneled through
 * `useState`/React state — specifically so this fold is trivial for
 * esbuild/Rollup to prove: `import.meta.env.VITE_DEMO_MODE` is a literal
 * Vite replaces at build time, so `!== 'true'` collapses to a constant
 * boolean before minification, and the dead branch (plus every import only
 * reachable from it) is eliminated. Mounted directly by `main.tsx` in place
 * of the previously-bare `<AppRouter />` — this is the "outer wrapper"
 * shape the Architecture Review specified, not a branch injected inside
 * `AppRouter.tsx` itself, which is untouched.
 *
 * Verified live: see README.md's pass history for this feature — `npm run
 * build`'s output bundle contains no "Empezar demo"/"prototipo de Nahui"
 * string; `npm run build:demo-campaign`'s does.
 */
export function DemoModeGate() {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') {
    return <AppRouter />;
  }
  return <DemoModeGateActive />;
}
