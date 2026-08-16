import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoModeGate } from './screens/DemoMode/DemoModeGate';
import { StoreProvider } from './domain/store';
import './styles/global.css';

// demo-mode.md — `DemoModeGate` is an outer wrapper around the unmodified
// `<AppRouter />` (Architecture Review §8 item 2), not a branch inside it.
// In a real production build it compiles down to a bare `<AppRouter />`
// (see `DemoModeGate.tsx`'s own doc comment for how/why).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <DemoModeGate />
    </StoreProvider>
  </StrictMode>,
);
