import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from '../Home/ColdStart.module.css';

/**
 * reports.md §3.3 — cold start, reached whenever `hasAnyClosedSession` is
 * false. Same centered-copy shape as Home's/Inventario's/Eventos' own cold
 * starts (`ColdStart.module.css`, reused verbatim rather than a fifth
 * hand-rolled copy) — routes to Hoy, an existing tab, never a second
 * selling mechanism inside this tab (§1's own explicit rule).
 */
export function ResultadosColdStart({ onNavigateToHoy }: { onNavigateToHoy: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Resultados</h1>
        <p className={styles.body}>
          Aquí vas a ver cómo te fue, en cuanto cierres tu primera sesión de venta.
        </p>
      </div>
      <Button className={styles.cta} onClick={onNavigateToHoy}>
        Empezar a vender
      </Button>
    </div>
  );
}
