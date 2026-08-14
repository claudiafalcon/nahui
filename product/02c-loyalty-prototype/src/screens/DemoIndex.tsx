import { Card } from '../components/Card/Card';
import { demoTokens } from '../domain/seed';
import { resetLoyaltyDemoData } from '../domain/store';
import shared from './shared.module.css';
import styles from './DemoIndex.module.css';

/**
 * Dev-only entry screen, shown at `/` — NOT one of
 * `customer-loyalty-registration.md` §5's 14 enumerated states. A real
 * customer only ever lands here via the Claim Token QR/link embedded in
 * her receipt (`/c/:token`); there is no "home" for this surface in the
 * approved spec, and this document's own §3 is explicit there is nothing
 * to navigate to. This screen exists purely so a click-through of this
 * prototype doesn't require hand-typing a URL — disclosed plainly here
 * and in this build's own report, never presented as spec content.
 */
export function DemoIndex() {
  return (
    <Card>
      <div className={shared.stackLeft}>
        <h1 className={shared.heading}>Nahui Loyalty — panel de pruebas</h1>
        <p className={shared.muted}>
          Esta pantalla no es parte del flujo del cliente — es solo para probar los distintos estados sin escanear
          un código QR real. Cada enlace abre <span className={styles.code}>/c/&lt;token&gt;</span>, igual que el QR
          del recibo digital.
        </p>
      </div>

      <div className={styles.list}>
        {demoTokens.map((demo) => (
          <a key={demo.token} className={styles.item} href={`/c/${demo.token}`}>
            <span className={styles.token}>/c/{demo.token}</span>
            <span className={styles.label}>{demo.label}</span>
            <span className={styles.desc}>{demo.description}</span>
          </a>
        ))}
      </div>

      <div className={shared.stackLeft}>
        <p className={styles.note}>
          Agrega <span className={styles.code}>?flaky=resolve</span>, <span className={styles.code}>?flaky=save</span>{' '}
          o <span className={styles.code}>?flaky=both</span> a cualquier enlace para forzar, una sola vez, un error
          de carga (3.12) o de guardado (3.9) y luego reintentar con éxito.
        </p>
        <button
          type="button"
          className={styles.resetButton}
          onClick={() => {
            resetLoyaltyDemoData();
            window.location.reload();
          }}
        >
          Reiniciar datos de prueba
        </button>
      </div>
    </Card>
  );
}
