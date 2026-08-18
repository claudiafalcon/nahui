import { useSyncExternalStore } from 'react';

/**
 * demo-mode.md §2.3 check 2 / §8 item 7 — a route-level "is `home.md §3.8f`
 * (Finalizar Venta success, the full-viewport digital receipt) the
 * currently active screen" signal.
 *
 * Explicitly NOT a domain read: this carries a single boolean screen-
 * identity fact, never any Sale/Session/Business/Receipt data, matching
 * Architecture Review §8 item 7's own framing ("a route-level check, not a
 * domain read") for the one narrower coupling this amendment introduces.
 * Not persisted anywhere (no `localStorage` key, unlike
 * `demoModeStorage.ts`'s device-acknowledgment flag) — purely an in-memory,
 * per-session signal that resets on reload like any other component state.
 *
 * A tiny module-level pub/sub rather than React Context, so the one call
 * site that needs to report screen identity (`HomeScreen.tsx`, the only
 * place `ui.kind === 'receipt'` is already known) doesn't need to be
 * wrapped in a new Provider reaching across the `AppRouter` boundary this
 * feature is otherwise built to leave untouched (Architecture Review §8
 * item 2's outer-wrapper shape). This module itself is not gated behind
 * `import.meta.env.VITE_DEMO_MODE` — unlike `DemoWelcome`/`DemoLoadError`/
 * `demoModeStorage.ts`, it has no participant-facing copy and no build-
 * detection concern of its own (`demo-mode.md §1`'s "structurally absent"
 * bar governs the Demo Mode *screens*, not this) — in a real production
 * build it is simply never read, since its only subscriber
 * (`ReminderBanner.tsx`) has no code path there at all.
 */
let receiptScreenActive = false;
const listeners = new Set<() => void>();

export function setReceiptScreenActive(active: boolean) {
  if (receiptScreenActive === active) return;
  receiptScreenActive = active;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return receiptScreenActive;
}

export function useReceiptScreenActive(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
