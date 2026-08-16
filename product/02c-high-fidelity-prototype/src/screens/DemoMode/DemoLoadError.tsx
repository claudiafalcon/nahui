import { Button } from '../../components/Button/Button';
import styles from '../Home/ColdStart.module.css';

/**
 * demo-mode.md §3.5 ("Falla defensiva") — reached only via §2.1 check 4,
 * the device-acknowledgment `localStorage` read itself failing outright
 * (e.g. storage access throwing in a restrictive browsing context). Unlike
 * `ResultadosLoadError.tsx` (which has no possible trigger at all in this
 * build — no network, no real async load), this one is a genuinely
 * reachable branch: `DemoModeGateActive.tsx` wraps `isDemoModeAcknowledged()`
 * in a real `try`/`catch` and routes here on failure. Same shared
 * `ColdStart.module.css` wrap/copy/cta shape `ResultadosLoadError.tsx`/
 * `PhoneStep.tsx`'s own §3.5a error branch already reuse — a plain
 * "Reintentar," no live-customer risk to justify anything heavier (spec's
 * own §3.5 note).
 */
export function DemoLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <p className={styles.body}>No pudimos cargar la demo.</p>
      </div>
      <Button className={styles.cta} onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
