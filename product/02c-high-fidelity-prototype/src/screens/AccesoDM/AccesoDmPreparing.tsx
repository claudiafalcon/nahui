import { useEffect, useState } from 'react';
import { Button } from '../../components/Button/Button';
import styles from './AccesoDmPreparing.module.css';

const SLOW_THRESHOLD_MS = 1500; // acceso-dm.md §3.1's own "slow (>~1.5s)" boundary

/**
 * acceso-dm.md §3.1/§3.2 — "Preparando tu catálogo," near-instant/slow, plus
 * the defensive fallback. Same near-instant/slow convention as every other
 * tab's own §3.1/§3.2 (`ux-pattern-conventions`), and the same visual family
 * as `OnboardingFlow.tsx`'s own `WritingState` — a dedicated component here
 * rather than reusing `WritingState` directly, since §3.1's own wireframe
 * draws a genuinely different near-instant treatment (a silent skeleton
 * block, not a blank line) that `WritingState` doesn't have a slot for.
 *
 * Since all four of Acceso DM's writes are local, synchronous, and already
 * proven (they're `OnboardingFlow.tsx`'s own existing demo-path writes, one
 * layer earlier), this resolves near-instantly in practice — a handful of
 * React commits, well under a browser paint frame. The "slow" >1.5s variant
 * and the defensive fallback are both real, correctly-rendering branches,
 * never actually reached in this build — the same disclosed-not-wired
 * convention already established for this codebase's other sync-failure and
 * slow-path states (`WritingState.tsx`'s own doc comment, `PhoneStep.tsx`'s
 * "resolves within SEND_DELAY_MS" note).
 */
export function AccesoDmPreparing({ error, onRetry }: { error?: boolean; onRetry?: () => void }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (error) return;
    const t = window.setTimeout(() => setSlow(true), SLOW_THRESHOLD_MS);
    return () => window.clearTimeout(t);
  }, [error]);

  if (error) {
    return (
      <div className="app-shell">
        <div className={styles.wrap}>
          <p className={styles.body}>No pudimos preparar tu catálogo. Intenta de nuevo.</p>
          {onRetry && (
            <Button className={styles.cta} onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className={styles.wrap}>
        {slow ? <p className={styles.slowLine}>Un momento…</p> : <div className={styles.skeleton} aria-hidden="true" />}
      </div>
    </div>
  );
}
