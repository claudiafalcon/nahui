import { Button } from '../../components/Button/Button';
import styles from './ColdStart.module.css';

/**
 * home.md §3.17 — "Acceso no disponible," a defensive backstop reached only
 * via a stale link, a browser-back artifact, or any other path that lands a
 * SELLER's device somewhere her own Membership has no standing reach —
 * never reachable by tapping anything this build actually offers her
 * (`App.tsx`'s own role-scoped tab gate is what mounts this component in
 * practice, since nothing in this codebase ever routes `activeTab` away
 * from `'hoy'` for a SELLER through a real interaction).
 *
 * **Distinct from `settings.md §3.14`'s "Acceso revocado" in one
 * load-bearing way — her Membership is still perfectly `active` here.**
 * This is about a structurally unreachable destination, not a revoked one:
 * the header (reusing `ColdStart.module.css`'s own topbar shape, the ⊚
 * SELLER icon — see `home.md §3.15`) and the nav bar (`App.tsx`'s own
 * unconditional render, unaffected by this component) both stay present
 * and functional, since she's still a legitimate, working SELLER.
 */
export function AccesoNoDisponible({ onBack, onOpenAccount }: { onBack: () => void; onOpenAccount: () => void }) {
  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button className={styles.gearBtn} onClick={onOpenAccount} aria-label="Tu cuenta">
          ⊚
        </button>
      </div>
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <p className={styles.body}>Esto no está disponible para tu cuenta.</p>
        </div>
        <Button className={styles.cta} onClick={onBack}>
          Volver a Hoy
        </Button>
      </div>
    </>
  );
}
