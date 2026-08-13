import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from '../Home/ColdStart.module.css';

/** inventory.md §3.3 — reached only as a defensive/legacy fallback in this
 * slice's own flow (Home's cold-start CTA routes straight into Registrar
 * Mercancía, per inventory.md §10) — kept for whoever taps the Inventario
 * tab directly before ever registering anything. */
export function InventoryColdStart({ onRegister }: { onRegister: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Inventario</h1>
        <p className={styles.body}>
          Aquí vas a ver lo que tienes disponible en cuanto registres lo que traes.
        </p>
      </div>
      <Button className={styles.cta} onClick={onRegister}>
        Registrar mercancía
      </Button>
    </div>
  );
}
