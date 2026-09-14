import { Button } from '../../components/Button/Button';
import styles from '../Home/ColdStart.module.css';

/**
 * reports.md §3.14 — defensive fallback / load error. Wired, as of Stage 7
 * Backend Integration's Read-side data hydration pass:
 * `ResultadosScreen.tsx`'s own mount-triggered `hydrateFromBackend()` call
 * (reports.md §2's own trigger) resolves to this screen whenever that read
 * genuinely fails, with "Reintentar" re-running the identical hydration
 * call. Previously built for completeness only, with no reachable trigger
 * (every read was synchronous, localStorage-backed `AppState`) — that
 * disclosure no longer applies now that a real async read exists.
 */
export function ResultadosLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <p className={styles.body}>No pudimos cargar tus resultados. Intenta de nuevo.</p>
      </div>
      <Button className={styles.cta} onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
