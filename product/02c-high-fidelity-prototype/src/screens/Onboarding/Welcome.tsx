import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from './Welcome.module.css';

/**
 * onboarding.md §3.3 — Bienvenida + Elegir cómo empezar. No back arrow, no
 * nav bar (§3 preamble — a Business's capabilities don't exist yet for the
 * four tabs to resolve into).
 */
export function Welcome({
  onChooseFree,
  onChoosePaid,
  onChooseDemo,
}: {
  onChooseFree: () => void;
  onChoosePaid: () => void;
  onChooseDemo: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Nahui</h1>
        <p className={styles.body}>
          Aquí vas a registrar tus ventas al momento y ver cómo va tu negocio, sin perder tiempo con
          la app.
        </p>
      </div>

      <div className={styles.paths}>
        <span className={styles.question}>¿Cómo quieres empezar?</span>
        <Button onClick={onChooseFree}>Empezar gratis</Button>
        <div className={styles.secondary}>
          <Button variant="secondary" onClick={onChoosePaid}>
            Activar plan de pago
          </Button>
          <span className={styles.subtext}>(si ya arreglaste tu pago)</span>
        </div>
        <button className={styles.tertiary} onClick={onChooseDemo}>
          Ver un ejemplo
        </button>
      </div>
    </div>
  );
}
