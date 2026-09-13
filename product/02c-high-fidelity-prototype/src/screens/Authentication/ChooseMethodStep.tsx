import { BrandMark } from '../../components/BrandMark/BrandMark';
import { Button } from '../../components/Button/Button';
import styles from './ChooseMethodStep.module.css';

/**
 * authentication.md §3.2a "Elegir cómo entrar" (new, 2026-09-13,
 * `decision-log.md` D62/D63) — the true first-run entry point, replacing
 * §3.3 ("Número celular") in that role. No back arrow — "this is now the one
 * screen in the whole product with nowhere to return to" (§3.2a's own text).
 *
 * All three options carry the same visual weight — same size, same variant,
 * stacked — deliberately not primary/secondary/tertiary the way
 * `onboarding.md §3.3`'s three paths are (§3.2a's own explicit rule). Order
 * (Google, Correo, Número celular) is the spec's own stated, non-validated
 * judgment call, not a priority ranking — see §3.2a's own reasoning (phone
 * listed last so a phone-reluctant merchant, the exact population this
 * activation exists for, never has to visually pass it first).
 */
export function ChooseMethodStep({
  onGoogle,
  onEmail,
  onPhone,
}: {
  onGoogle: () => void;
  onEmail: () => void;
  onPhone: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Nahui</p>
        <h1 className={styles.heading}>Elegir cómo entrar</h1>
        <p className={styles.body}>Para empezar, elige cómo quieres entrar.</p>
      </div>

      <div className={styles.ctaStack}>
        <Button className={styles.cta} variant="secondary" onClick={onGoogle}>
          Continuar con Google
        </Button>
        <Button className={styles.cta} variant="secondary" onClick={onEmail}>
          Continuar con correo
        </Button>
        <Button className={styles.cta} variant="secondary" onClick={onPhone}>
          Continuar con número celular
        </Button>
      </div>
    </div>
  );
}
