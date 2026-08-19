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
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <DemoModeGate />
    </StoreProvider>
    <Analytics />
  </StrictMode>,
);
