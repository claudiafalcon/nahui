import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { DemoModeGate } from './screens/DemoMode/DemoModeGate';
import { StoreProvider } from './domain/store';
import './styles/global.css';

// demo-mode.md — `DemoModeGate` is an outer wrapper around the unmodified
// `<AppRouter />` (Architecture Review §8 item 2), not a branch inside it.
// In a real production build it compiles down to a bare `<AppRouter />`
// (see `DemoModeGate.tsx`'s own doc comment for how/why).
//
// `<Analytics />` (Vercel Web Analytics) is mounted unconditionally — unlike
// Demo Mode's `VITE_DEMO_MODE` gating, this isn't participant-facing UI, and
// traffic visibility on both `demo.nahui.app` and `nahui.app` (two separate
// Vercel projects deployed from this same codebase) is wanted on both.
//
// `<Analytics />` renders BEFORE `<StoreProvider>`/`<DemoModeGate />` here —
// load-bearing ordering, not stylistic. `<Analytics />`'s own `inject()`
// call (which assigns `window.va`, the function `track()` calls into) runs
// inside its own mount `useEffect`, and React fires sibling effects in tree
// order within a single commit. `demo-mode.md` §2.5.2's `demo_pass_through_reached`
// (ReminderBanner.tsx) can itself fire on the very first commit — the
// silent-skip route into `pass-through` for an already-acknowledged device
// (§2.1 check 2) resolves `DemoModeGateActive`'s gate state synchronously,
// mounting `ReminderBanner` immediately rather than after a later user tap.
// With `<Analytics />` listed after `<StoreProvider>`, that first-commit
// `track()` call raced `inject()` and silently no-op'd (`window.va` was
// still unassigned at call time, and `track()`'s `window.va?.call(...)` is
// fire-and-forget, never queued) — found via live verification of §2.5.2's
// three new events, not a hypothetical. Listing `<Analytics />` first
// guarantees its effect commits before any descendant of `<StoreProvider>`
// on that same first commit, closing the race with no behavior change to
// either component.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <StoreProvider>
      <DemoModeGate />
    </StoreProvider>
  </StrictMode>,
);
