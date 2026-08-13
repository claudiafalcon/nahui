import { Button } from '../../components/Button/Button';
import { pesos } from '../../domain/format';
import styles from './ColdStart.module.css';

/** home.md §3.12 — Close-summary, immediate. Two numbers only (free tier). */
export function CloseSummary({
  count,
  revenue,
  onContinue,
}: {
  count: number;
  revenue: number;
  onContinue: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Día cerrado</h1>
        <p className={styles.body}>
          {count} {count === 1 ? 'venta registrada' : 'ventas registradas'}
          <br />{pesos(revenue)} en total
        </p>
      </div>
      <Button className={styles.cta} variant="secondary" onClick={onContinue}>
        Entendido
      </Button>
    </div>
  );
}
