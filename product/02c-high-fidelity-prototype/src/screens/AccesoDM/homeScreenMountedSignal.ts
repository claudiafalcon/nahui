import { useSyncExternalStore } from 'react';

/**
 * acceso-dm.md §2.3 check 4 — "is Home (`home.md`) the currently active tab"
 * signal, needed so `ResultsGuidanceNudge.tsx` can render only on Home and
 * never on Inventario/Eventos/Resultados, without reaching into `App.tsx`'s
 * own tab-shell JSX to composite itself (the same "sibling, never inside"
 * discipline `receiptScreenSignal.ts` already established one folder over,
 * for the identical structural reason: the fact this nudge needs —
 * "is HomeScreen currently mounted" — is only known inside `HomeScreen.tsx`
 * itself).
 *
 * Explicitly NOT a domain read: a single boolean route-identity fact, never
 * any Sale/Session/Business data. Not persisted (no `localStorage` key,
 * unlike `accesoDmStorage.ts`'s device flag) — purely an in-memory,
 * per-session signal that resets on reload like any other component state,
 * mirroring `receiptScreenSignal.ts`'s own module-level pub/sub shape
 * exactly (a tiny signal, not React Context, so the one call site that
 * reports it — `HomeScreen.tsx`'s own mount/unmount — doesn't need a new
 * Provider reaching across the `AppRouter` boundary this feature is
 * otherwise built to leave untouched).
 */
let homeScreenMounted = false;
const listeners = new Set<() => void>();

export function setHomeScreenMounted(mounted: boolean) {
  if (homeScreenMounted === mounted) return;
  homeScreenMounted = mounted;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return homeScreenMounted;
}

export function useHomeScreenMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
