import { STORAGE_KEY } from '../../domain/store';
import { clearDemoModeAcknowledgment } from './demoModeStorage';

/**
 * demo-mode.md §2.4 step 3 / §8 item 8 — the restart mechanism itself: a
 * write-only, content-blind clear of both storage keys this feature's own
 * two persistence layers use (`demoModeStorage.ts`'s device-acknowledgment
 * flag, `store.tsx`'s own `AppState`-mirroring blob, reused here via its
 * exported `STORAGE_KEY` rather than a second hardcoded string literal that
 * could silently drift from it), then a full page reload. Neither call ever
 * reads or interprets either key's stored value — `localStorage.removeItem`
 * is the entire operation, the same "no domain read" posture §2.4 step 3 and
 * `architecture-principles.md` #6 both hold this write to.
 *
 * Deliberately not `store.tsx`'s own exported `resetPrototype()` — chosen
 * per §8 item 8's own reasoning: a full reload is the only mechanism that
 * also resets `DemoModeGateActive.tsx`'s own local `gate` React state, which
 * an in-app-only `resetPrototype()` call would leave untouched (confirmed by
 * direct inspection of `main.tsx`: `StoreProvider` mounts *above*
 * `DemoModeGate` in the component tree, so an in-app state transition alone
 * would never remount the gate itself).
 *
 * Throws (propagates whatever `localStorage` itself throws) if either clear
 * call fails outright — the caller (`ReminderBanner.tsx`) is responsible for
 * catching this and routing to the §3.8 defensive fallback. `window.location
 * .reload()` is only ever reached once both clears have already succeeded,
 * so no reload is ever attempted against a partially-cleared or unknown
 * storage state (§2.4 step 4).
 */
export function restartDemo(): void {
  clearDemoModeAcknowledgment();
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
