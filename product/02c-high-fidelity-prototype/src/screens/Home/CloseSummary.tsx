import { Button } from '../../components/Button/Button';
import { pesos } from '../../domain/format';
import styles from './ColdStart.module.css';

/**
 * home.md §3.12 — Close-summary, immediate. Two numbers only (free tier).
 *
 * `eventId`-aware variant (Eventos pass, D43): no explicit spec text exists
 * for this exact label — the approved doc's own §3.12 only ever illustrates
 * the Quick Session case — so this is a judgment call, low-stakes per this
 * pass's own dispatching task. "Día N cerrado" (+ the Venue name as a
 * passive line) mirrors the eyebrow/body shape "Día cerrado" already
 * establishes, extended the same way `SessionHeader`'s own eventId-aware
 * title already is: same slot, same treatment, only the content differs.
 */
export function CloseSummary({
  count,
  revenue,
  venueName,
  dayNumber,
  onContinue,
}: {
  count: number;
  revenue: number;
  venueName?: string;
  dayNumber?: number;
  onContinue: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>{dayNumber != null ? `Día ${dayNumber} cerrado` : 'Día cerrado'}</h1>
        {venueName && <p className={styles.body}>{venueName}</p>}
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
