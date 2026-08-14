import { useEffect, useState } from 'react';
import styles from './SkeletonBlock.module.css';

const SLOW_THRESHOLD_MS = 1500;

/**
 * Shared near-instant/slow wait-state visual — covers both 3.1/3.2
 * (Resolving) and 3.7/3.8 (Guardando…), the same shared convention the
 * spec itself calls out ("visually and textually identical either way,
 * since from her side it's the same wait"). Renders a silent skeleton
 * immediately; if the underlying operation is still in flight past
 * `~1.5s`, swaps to one plain line of text — never a spinner, per the
 * wireframes' own "no text, no spinner" / "one plain line" annotations.
 */
export function WaitState({ slowLabel }: { slowLabel: string }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), SLOW_THRESHOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (slow) {
    return (
      <p className={styles.slowLabel} role="status">
        {slowLabel}
      </p>
    );
  }

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.bar} />
      <div className={styles.bar} />
    </div>
  );
}
