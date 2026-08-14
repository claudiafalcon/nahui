import { Button } from '../../components/Button/Button';
import styles from '../Home/ColdStart.module.css';

/**
 * reports.md §3.14 — defensive fallback / load error. Built for
 * completeness (the dispatching task's own explicit scope item) but, like
 * every other screen in this codebase that reads exclusively from
 * synchronous, localStorage-backed `AppState` (no network, no real async
 * load), it has no reachable trigger today — there is no failure mode this
 * build can genuinely produce. Not wired into `ResultadosScreen.tsx`'s
 * resolution for that reason, the same disclosed-as-structurally-present-
 * but-unexercised treatment this codebase already gives other defensive
 * branches (e.g. `if (!event) return null` guards throughout Eventos/
 * Resultados). Kept ready for Backend Integration (Stage 7), when a real
 * network load can actually fail this way.
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
