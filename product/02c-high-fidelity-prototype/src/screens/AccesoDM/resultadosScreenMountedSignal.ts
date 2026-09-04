import { useSyncExternalStore } from 'react';

/**
 * acceso-dm.md instrumentation — "is the Resultados screen currently
 * mounted" signal, needed so `ResultsGuidanceNudge.tsx` can fire
 * `acceso_dm_results_viewed` the first time she reaches Resultados, without
 * reaching into `App.tsx`'s own tab-shell JSX to composite itself. Mirrors
 * `homeScreenMountedSignal.ts`'s own module-level pub/sub shape exactly, one
 * file over — same structural reason: the fact this event needs ("is
 * ResultadosScreen currently mounted") is only known inside
 * `ResultadosScreen.tsx` itself.
 *
 * Explicitly NOT a domain read: a single boolean route-identity fact, never
 * any Sale/Session/Business data. Not persisted (no `localStorage` key) —
 * purely an in-memory, per-session signal that resets on reload like any
 * other component state.
 */
let resultadosScreenMounted = false;
const listeners = new Set<() => void>();

export function setResultadosScreenMounted(mounted: boolean) {
  if (resultadosScreenMounted === mounted) return;
  resultadosScreenMounted = mounted;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return resultadosScreenMounted;
}

export function useResultadosScreenMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
