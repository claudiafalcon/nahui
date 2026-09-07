import { Button } from '../../components/Button/Button';
import styles from './AccesoRevocado.module.css';

/**
 * settings.md §3.14 — "Acceso revocado," reached only from `home.md` §2's
 * own step 0 (`App.tsx`'s top-level resolution, before the tab shell/nav
 * bar ever mount) — never navigated into from within Configuración, and
 * nothing in this document or its siblings links here. No header gear icon,
 * no bottom nav, no back arrow — the one state in the whole product where
 * offering navigation elsewhere is correctly withheld, per the spec's own
 * reasoning (every other destination reads Business-scoped data this
 * Membership has no standing reason to browse).
 *
 * "Entendido" closes/exits rather than navigating (`brand-guardian`
 * finding, remediated in the approved spec — the original draft had zero
 * tappable affordance, a true dead end). This build's own closest honest
 * translation of "closes/exits the app" for a web/PWA context: a
 * best-effort `window.close()` (only ever succeeds for a window/tab this
 * script itself opened — most real browsers will silently no-op it, per
 * the platform's own security model, not a bug in this build). Either way
 * she lands back on this exact same calm, resting screen — never an error,
 * never a different state — matching the spec's own "a stable, repeatable
 * terminal state" framing.
 */
export function AccesoRevocado() {
  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Nahui</h1>
        <p className={styles.body}>Ya no tienes acceso para vender en este negocio.</p>
        <p className={styles.body}>Si crees que esto es un error, habla con quien te invitó.</p>
      </div>
      <Button
        className={styles.cta}
        onClick={() => {
          try {
            window.close();
          } catch {
            // best-effort, see this component's own doc comment
          }
        }}
      >
        Entendido
      </Button>
    </div>
  );
}
