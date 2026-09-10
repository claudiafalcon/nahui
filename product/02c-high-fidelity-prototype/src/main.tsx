import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { AppRouter } from './AppRouter';
import { StoreProvider } from './domain/store';
import './styles/global.css';

// `<Analytics />` (Vercel Web Analytics) is mounted unconditionally, before
// `<StoreProvider>`/`<AppRouter />` — load-bearing ordering, not stylistic.
// `<Analytics />`'s own `inject()` call (which assigns `window.va`, the
// function `track()` calls into) runs inside its own mount `useEffect`, and
// React fires sibling effects in tree order within a single commit. Any
// event fired from a descendant's own first-commit effect would otherwise
// race `inject()` and silently no-op (`window.va` still unassigned at call
// time, and `track()`'s `window.va?.call(...)` is fire-and-forget, never
// queued). Listing `<Analytics />` first guarantees its effect commits
// before any descendant of `<StoreProvider>` on that same first commit,
// closing that race with no behavior change to either component.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  </StrictMode>,
);
