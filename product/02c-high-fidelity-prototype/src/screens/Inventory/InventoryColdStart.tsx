import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from '../Home/ColdStart.module.css';

/** inventory.md §3.3 — reached only as a defensive/legacy fallback in this
 * slice's own flow (Home's cold-start CTA routes straight into Registrar
 * Mercancía, per inventory.md §10) — kept for whoever taps the Inventario
 * tab directly before ever registering anything.
 *
 * inventory.md §3.3a (`decision-log.md` D46 Addendum) — this same screen
 * also serves the "reached via settings.md §2.6, zero inventory to tag yet"
 * variant, with one added one-time acknowledgment line (`bannerLine`) above
 * the reused body copy — same CTA, same destination, no new interaction
 * pattern. */
export function InventoryColdStart({
  onRegister,
  bannerLine,
}: {
  onRegister: () => void;
  /** §3.3a's "Cambiaste a vender con tags." line — omitted entirely (the
   * plain §3.3 fallback) when this screen isn't reached via that marker. */
  bannerLine?: string | null;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Inventario</h1>
        {bannerLine && <p className={styles.banner}>{bannerLine}</p>}
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
