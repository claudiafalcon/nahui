import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from './DemoWelcome.module.css';

/**
 * demo-mode.md §3.3 ("Bienvenida a la demo") / §3.4 ("Retomar") — one
 * component realizes both, pixel-identical per the spec's own text: nothing
 * is typed here and nothing needs preserving mid-screen, so a fresh
 * showing and a resumed one (app closed/backgrounded before the tap)
 * render identically. §2.1 checks 2/3 already collapse to the same single
 * boolean read one layer up (`DemoModeGateActive.tsx`).
 *
 * No back arrow, no nav bar, no auto-advance, single primary CTA — the same
 * "first screen in the product, nowhere to return to" shape
 * `authentication.md §3.3`/`PhoneStep.tsx` already establish, one step
 * further upstream (this screen precedes even that one, validation-campaign
 * builds only). Copy is verbatim per the Approved spec.
 *
 * Closing paragraph updated 2026-08-18 (`demo-mode.md` §3.3, same-day
 * amendment): the two adjacent feedback-ask sentences (`ux-critic` DEMO-M2)
 * are merged into one, and now plants the expectation that a way to give
 * feedback is coming ("Más adelante te decimos cómo") — the persistent
 * reminder banner introduced this same amendment (§3.6, `ReminderBanner.tsx`).
 */
export function DemoWelcome({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Nahui</h1>
        <p className={styles.body}>Vas a probar un prototipo de Nahui — gracias por ayudarnos.</p>
      </div>

      <ul className={styles.list}>
        <li className={styles.listItem}>
          <span className={styles.bullet} aria-hidden="true">
            •
          </span>
          <span>Usa cualquier número de celular — no te va a llegar ningún código real.</span>
        </li>
        <li className={styles.listItem}>
          <span className={styles.bullet} aria-hidden="true">
            •
          </span>
          <span>
            Cuando te pida el código, escribe cualquier número de 6 dígitos — por ejemplo,
            123456.
          </span>
        </li>
        <li className={styles.listItem}>
          <span className={styles.bullet} aria-hidden="true">
            •
          </span>
          <span>
            El nombre de tu negocio, tus productos y tus clientes también pueden ser inventados.
          </span>
        </li>
      </ul>

      <p className={styles.closing}>
        No es la versión final — cuéntanos qué se te hace confuso, nos sirve tanto como lo que te
        gusta. Más adelante te decimos cómo.
      </p>

      <Button className={styles.cta} onClick={onStart}>
        Empezar demo
      </Button>
    </div>
  );
}
