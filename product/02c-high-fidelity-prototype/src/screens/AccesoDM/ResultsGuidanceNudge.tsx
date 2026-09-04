import { useEffect, useLayoutEffect, useRef } from 'react';
import { track } from '@vercel/analytics';
import { AppRouter } from '../../AppRouter';
import { useStore } from '../../domain/store';
import { hasAnyClosedSession } from '../../domain/selectors';
import { useHomeScreenMounted } from './homeScreenMountedSignal';
import { useResultadosScreenMounted } from './resultadosScreenMountedSignal';
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
 * **As of `decision-log.md` D52 (Acceso DM relocated into the demo-campaign
 * build):** this component is now mounted only from inside
 * `ReminderBanner.tsx` (nested where that component used to render
 * `<AppRouter />` directly) rather than standalone — real DOM nesting, not
 * a sibling, which is what lets `--acceso-dm-nudge-height` (set below)
 * inherit down to `.app-shell` alongside `ReminderBanner`'s own
 * `--demo-banner-height`, and lets this component's own `--demo-banner-
 * height` read (see `.strip`'s `top` offset in the `.module.css`) resolve
 * to that ancestor's real, measured value. See `ReminderBanner.module.css`
 * for the combined-height/stacking fix this composition required.
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
 *
 * Analytics instrumentation (Product Owner-authorized, count-only, reusing
 * `ReminderBanner.tsx`'s exact event pattern one folder over — external
 * observer of `state` via `useStore()`, not-already-true-at-mount guard,
 * one-shot per session): this component is the sole mount point for three of
 * the four `acceso_dm_*` events (`acceso_dm_opened` fires separately, in
 * `AccesoDmGate.tsx`, the moment the URL marker is detected).
 * - `acceso_dm_sale_completed` extends this component's own existing
 *   `hasFinalizedSale` observation rather than adding a second one.
 * - `acceso_dm_session_closed` fires at the same `hasAnyClosedSession`
 *   transition that already permanently hides this nudge (§2.3 check 3) —
 *   not recomputed a second way.
 * - `acceso_dm_results_viewed` observes `resultadosScreenMountedSignal.ts`
 *   (mirroring `homeScreenMountedSignal.ts` exactly, reported by
 *   `ResultadosScreen.tsx`'s own one-line mount/unmount effect).
 * All three are one-shot per session (the `demo_otp_completed`/
 * `demo_onboarding_completed` shape, not `demo_sale_completed`'s repeatable
 * per-Sale-ID shape) — these four events measure funnel progression, not
 * engagement depth, so a single latch per session is correct and simpler.
 * All three are gated on `isAccesoDmActive()`, the same scoping this nudge's
 * own visibility already uses — never fired for any other merchant, on any
 * other route.
 */
export function ResultsGuidanceNudge() {
  const { state } = useStore();
  const homeScreenMounted = useHomeScreenMounted();
  const resultadosScreenMounted = useResultadosScreenMounted();
  const receiptActive = useReceiptScreenActive();

  const hasFinalizedSale = state.sales.some((sa) => sa.status === 'finalized');
  const sessionClosed = hasAnyClosedSession(state);
  const visible = isAccesoDmActive() && homeScreenMounted && !receiptActive && hasFinalizedSale && !sessionClosed;

  // `acceso_dm_sale_completed` — fires once per session, the first time a
  // Sale transitions to `status: 'finalized'` while `nahui-acceso-dm-active`
  // is set. Same not-already-true-at-mount guard shape as
  // `demo_otp_completed`: a device that resumes into an
  // already-has-a-finalized-Sale state never fires this again, since the
  // live transition was already witnessed (and already fired) the first
  // time it actually happened.
  const sawNoFinalizedSaleRef = useRef(false);
  const saleCompletedFiredRef = useRef(false);
  useEffect(() => {
    if (!isAccesoDmActive()) return;
    if (!hasFinalizedSale) {
      sawNoFinalizedSaleRef.current = true;
      return;
    }
    if (saleCompletedFiredRef.current || !sawNoFinalizedSaleRef.current) return;
    saleCompletedFiredRef.current = true;
    track('acceso_dm_sale_completed');
  }, [hasFinalizedSale]);

  // `acceso_dm_session_closed` — fires once per session, the first time
  // `hasAnyClosedSession(state)` flips true while `nahui-acceso-dm-active`
  // is set. `sessionClosed` above is the exact same value that permanently
  // hides this nudge (§2.3 check 3) — fired at that transition, not a second
  // computation of the same fact.
  const sawNotClosedRef = useRef(false);
  const sessionClosedFiredRef = useRef(false);
  useEffect(() => {
    if (!isAccesoDmActive()) return;
    if (!sessionClosed) {
      sawNotClosedRef.current = true;
      return;
    }
    if (sessionClosedFiredRef.current || !sawNotClosedRef.current) return;
    sessionClosedFiredRef.current = true;
    track('acceso_dm_session_closed');
  }, [sessionClosed]);

  // `acceso_dm_results_viewed` — fires once per session, the first time the
  // Resultados screen mounts while `nahui-acceso-dm-active` is set.
  // `resultadosScreenMounted` starts `false` every page load (module-level,
  // not persisted), so no "already true at mount" case exists to guard
  // against here — a plain one-shot ref is enough.
  const resultsViewedFiredRef = useRef(false);
  useEffect(() => {
    if (!isAccesoDmActive() || !resultadosScreenMounted || resultsViewedFiredRef.current) return;
    resultsViewedFiredRef.current = true;
    track('acceso_dm_results_viewed');
  }, [resultadosScreenMounted]);

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
    if (!shellEl) return;
    const stripEl = stripRef.current;
    if (!visible || !stripEl) {
      // Strip isn't currently rendered — reserve zero, not a stale prior
      // measurement. `ReminderBanner.module.css`'s combined padding-top
      // formula reads this variable unconditionally whenever the banner
      // itself renders, so a stale nonzero value here would phantom-inflate
      // that reservation even while this nudge is genuinely hidden
      // (`decision-log.md` D52's CSS-collision fix).
      shellEl.style.setProperty('--acceso-dm-nudge-height', '0px');
      return;
    }
    const observer = new ResizeObserver(() => {
      // `getBoundingClientRect()`, not `entry.contentRect` — `.strip` carries
      // its own vertical `padding` (`ResultsGuidanceNudge.module.css`), and
      // `contentRect` deliberately excludes an element's own padding/border
      // (it reports the content box only). Reserving `contentRect.height`
      // here undercounted the real rendered strip by exactly that padding,
      // leaving a genuine, measured overlap between the strip's true bottom
      // edge and `.app-shell`'s reserved padding-top — found and fixed
      // during `decision-log.md` D52's live verification (a real bug, not
      // hypothetical: the wrapped, two-line copy reproduces it every time).
      // `getBoundingClientRect().height` reports the true border-box height,
      // matching what actually needs reserving.
      const height = Math.ceil(stripEl.getBoundingClientRect().height);
      shellEl.style.setProperty('--acceso-dm-nudge-height', `${height}px`);
    });
    observer.observe(stripEl);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={shellRef} className={styles.shell}>
      {visible && (
        <p ref={stripRef} className={styles.strip}>
          Esta venta se verá en Resultados cuando cierres tu jornada de venta.
        </p>
      )}
      <AppRouter />
    </div>
  );
}
