import { Button } from '../../components/Button/Button';
import styles from '../Home/ColdStart.module.css';

/**
 * demo-mode.md §3.8 ("Reiniciando — falla defensiva") — reached only when
 * §2.4 step 4's clear operation (`restartDemo.ts`) itself throws (e.g.
 * storage access failing outright in a restrictive browsing context). "Same
 * class of failure... same Reintentar, no live-customer risk to justify
 * anything heavier" as §3.5's own `DemoLoadError.tsx` — reuses the identical
 * shared `ColdStart.module.css` wrap/copy/cta shape for that reason, applied
 * to the write side instead of the read side. Tapping Reintentar simply
 * re-attempts the same clear-and-reload call; no reload is ever attempted
 * against a partially-cleared or unknown storage state.
 *
 * Rendered by `ReminderBanner.tsx` as a full replacement of its own output
 * (banner rows, `<AppRouter />`, everything) — the same "defensive fallback
 * replaces the whole screen" shape `DemoModeGateActive.tsx`'s own 'error'
 * branch already uses for §3.5, wrapped in its own `app-shell` div there
 * since nothing here is nested inside `AppRouter`'s own app-shell wrapper.
 */
export function RestartFailed({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <p className={styles.body}>No pudimos reiniciar la demo.</p>
      </div>
      <Button className={styles.cta} onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
