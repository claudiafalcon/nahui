import { Button } from '../../components/Button/Button';
import styles from './ConfirmScreen.module.css';

/**
 * onboarding.md §3.4c — Ver un ejemplo, antes de continuar. The permanence/
 * non-real-data fact has to land here, before the write, not only
 * afterward (§3.6 Variant C) — see that section's own reasoning.
 */
export function ConfirmDemo({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  return (
    <div className={styles.wrap}>
      <button className={styles.back} onClick={onBack}>
        ← Elegir cómo empezar
      </button>
      <h1 className={styles.heading}>Ver un ejemplo</h1>
      <p className={styles.body}>
        Esto crea un negocio de ejemplo con ventas y clientes inventados, para que veas cómo se usa
        Nahui.
      </p>
      <p className={styles.body}>
        No es tu negocio real, y no vas a poder convertirlo en tu negocio real después. Para tu
        negocio real, usa "Empezar gratis" o "Activar plan de pago."
      </p>
      <div className={styles.spacer} />
      <Button className={styles.cta} onClick={onConfirm}>
        Ver el ejemplo
      </Button>
      <button className={styles.escape} onClick={onBack}>
        Mejor quiero registrar mi negocio real
      </button>
    </div>
  );
}
