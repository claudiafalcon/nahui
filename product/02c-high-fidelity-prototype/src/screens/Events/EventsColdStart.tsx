import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from '../Home/ColdStart.module.css';

/** events.md §3.3 — cold start, no Event ever scheduled (reused here for the
 * "nothing currently visible to show" case too — see EventsScreen's own
 * comment on that judgment call). Same shape as Home's/Inventario's cold
 * starts — one honest sentence, one CTA. */
export function EventsColdStart({ onAgendar }: { onAgendar: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Eventos</h1>
        <p className={styles.body}>
          Aquí vas a ver tus bazares, expos y demás eventos en cuanto agendes uno.
        </p>
      </div>
      <Button className={styles.cta} onClick={onAgendar}>
        Agendar evento
      </Button>
    </div>
  );
}
