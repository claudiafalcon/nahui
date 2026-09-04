import { useLayoutEffect, useRef } from 'react';
import { AppRouter } from '../../AppRouter';
import { useStore } from '../../domain/store';
import { hasAnyClosedSession } from '../../domain/selectors';
import { useHomeScreenMounted } from './homeScreenMountedSignal';
import { useReceiptScreenActive } from '../DemoMode/receiptScreenSignal';
import { isAccesoDmActive } from './accesoDmStorage';
import styles from './ResultsGuidanceNudge.module.css';

/**
 * acceso-dm.md §2.3/§3.3 — the results-guidance nudge, the one new UX
 * surface this document actually designs. Mounted as a sibling wrapper
 * around the unmodified `<AppRouter />` — the identical "sibling, never
 * inside" compositing shape `ReminderBanner.tsx` already establishes one
 * folder over (down to reusing its own `--*-height` custom-property/
 * `ResizeObserver` reservation technique, since this strip's own copy can
 * wrap depending on viewport width, exactly the same risk that file's own
 * comment already documents for its row 2).
 *
 * All three visibility conditions (§2.3 checks 1-3) are read fresh on every
 * render, no cached/derived local state:
 * - check 1: `isAccesoDmActive()` — this device's own persisted flag
 *   (`accesoDmStorage.ts`), the one non-domain fact this route needs since a
 *   Business created here is domain-indistinguishable from one created via
 *   "Ver un ejemplo."
 * - check 2: an external observer of `state.sales` (`useStore()`) — has any
 *   Sale reached `status = 'finalized'` yet. A domain read, never a write,
 *   the identical shape `demo_sale_completed` (`ReminderBanner.tsx`) already
 *   uses for the same underlying question.
 * - check 3: `hasAnyClosedSession(state)` — the existing selector
 *   (`selectors.ts`), reused unchanged, no second signal invented.
 *
 * Check 4 (which screens) is realized by two further, independent gates:
 * `useHomeScreenMounted()` (Home only, never Inventario/Eventos/Resultados —
 * `homeScreenMountedSignal.ts`) and `useReceiptScreenActive()` (never on
 * `home.md §3.8f`, reusing `receiptScreenSignal.ts` exactly as-is, the same
 * exclusion `ReminderBanner.tsx` already implements for the same screen —
 * per this feature's own build instructions, not reinvented here).
 *
 * Purely passive text (§2.3 check 5) — no `<button>`, no `onClick`, no
 * dismiss control of any kind (check 6): the only way this stops rendering
 * is `hasAnyClosedSession` becoming true, permanently, for this device.
 */
export function ResultsGuidanceNudge() {
  const { state } = useStore();
  const homeScreenMounted = useHomeScreenMounted();
  const receiptActive = useReceiptScreenActive();

  const hasFinalizedSale = state.sales.some((sa) => sa.status === 'finalized');
  const visible =
    isAccesoDmActive() && homeScreenMounted && !receiptActive && hasFinalizedSale && !hasAnyClosedSession(state);

  const shellRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLParagraphElement>(null);

  // Same technique as `ReminderBanner.module.css`'s own `--demo-banner-
  // height` reservation: this strip's fixed-position placement takes it out
  // of normal flow, so `.app-shell` (rendered inside `<AppRouter />`, a
  // descendant of `.shell` below) needs its own `padding-top` reserved by an
  // exact measurement of the strip's real rendered height — including the
  // wrapped-onto-two-lines case on narrower viewports, since this copy
  // ("Esta venta se verá en Resultados cuando cierres tu jornada de venta.")
  // is long enough to wrap there.
  useLayoutEffect(() => {
    const shellEl = shellRef.current;
    const stripEl = stripRef.current;
    if (!shellEl || !stripEl || !visible) return;
    const observer = new ResizeObserver(([entry]) => {
      const height = Math.ceil(entry.contentRect.height);
      shellEl.style.setProperty('--acceso-dm-nudge-height', `${height}px`);
    });
    observer.observe(stripEl);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={shellRef} className={`${styles.shell} ${visible ? styles.withNudge : ''}`}>
      {visible && (
        <p ref={stripRef} className={styles.strip}>
          Esta venta se verá en Resultados cuando cierres tu jornada de venta.
        </p>
      )}
      <AppRouter />
    </div>
  );
}
