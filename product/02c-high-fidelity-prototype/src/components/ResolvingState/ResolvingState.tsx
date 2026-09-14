import { useEffect, useState } from 'react';
import styles from './ResolvingState.module.css';

/** `home.md`/`inventory.md`/`events.md`/`reports.md` §3.2's own shared,
 * cross-referenced "slow (>~1.5s)" boundary — not re-derived here, the same
 * literal threshold `PersonalParaEsteEvento.tsx`'s own `SLOW_THRESHOLD_MS`
 * already uses for its own per-row save-state variant of the identical
 * convention. */
const SLOW_THRESHOLD_MS = 1500;

/**
 * Stage 7 Backend Integration — Read-side data hydration's own §3.1/§3.2
 * "Resolving" convention (`home.md`/`inventory.md`/`events.md`/`reports.md`
 * all specify the identical pair and explicitly cross-reference each other
 * rather than redefining it — see e.g. `inventory.md` §3.1: "Identical
 * silent-skeleton convention as home.md §3.1 / events.md §3.1 / reports.md
 * §3.1 — not re-invented here"). One real implementation, reused wherever a
 * genuine async read is now in flight.
 *
 * §3.1 (near-instant): an empty skeleton, no copy — "nothing announces
 * 'loading' for something that should be imperceptible"
 * (*global-principles.md*, "technology should disappear"). §3.2 (slow,
 * after `SLOW_THRESHOLD_MS`): one calm, plain-language line, never a
 * technical status string.
 */
export function ResolvingState() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_THRESHOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  if (slow) {
    return (
      <div className={styles.wrap}>
        <p className={styles.slowText}>Un momento…</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.blockLg} />
      <div className={styles.blockSm} />
    </div>
  );
}
