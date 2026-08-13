import { Button } from '../../components/Button/Button';
import styles from './ConfirmScreen.module.css';

/** onboarding.md §3.4 — Activar plan de pago, confirmar antes de continuar. */
export function ConfirmPaid({ onConfirm, onBack }: { onConfirm: () => void; onBack: () => void }) {
  return (
    <div className={styles.wrap}>
      <button className={styles.back} onClick={onBack}>
        ← Elegir cómo empezar
      </button>
      <h1 className={styles.heading}>Activar plan de pago</h1>
      <p className={styles.body}>
        Vas a poder vender con tags, además de botones. Cuando tengas historial de ventas, también
        vas a ver resultados por bazar.
      </p>
      <p className={styles.body}>
        Esto se activa confirmando tu pago fuera de la app — no se te cobra nada aquí. Si ya lo
        arreglaste, confirma abajo.
      </p>
      <div className={styles.spacer} />
      <Button className={styles.cta} onClick={onConfirm}>
        Confirmar y activar
      </Button>
      <button className={styles.escape} onClick={onBack}>
        Mejor quiero empezar gratis
      </button>
    </div>
  );
}
