import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from './ColdStart.module.css';

/** home.md §3.3 — reached whenever zero `available` InventoryUnits exist. */
export function ColdStart({ onRegister }: { onRegister: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Nahui</h1>
        <p className={styles.body}>
          Aquí vas a ver tu día de venta en cuanto registres lo que traes.
        </p>
      </div>
      <Button className={styles.cta} onClick={onRegister}>
        Registrar mercancía
      </Button>
    </div>
  );
}
