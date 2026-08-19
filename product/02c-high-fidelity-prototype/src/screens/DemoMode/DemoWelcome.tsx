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
 * Restructured 2026-08-18 (`demo-mode.md` §3.3, second same-day amendment,
 * Product Owner-relayed campaign-response findings): the old third bullet
 * (fictitious business/products/customers) is folded into a new second
 * intro sentence, which now also states the previously-missing fact that
 * this is validation, not a sale — freeing the bullet list down to exactly
 * the two retention-critical, causally-ordered phone→OTP facts (unchanged
 * since 2026-08-16). The closing sentence is fully rewritten to state
 * plainly that the questionnaire is part of the same activity, not a
 * separate optional step, with the Product-Owner-requested softened reason
 * ("nos ayuda a decidir," not "decide"). Restart is deliberately not
 * mentioned here — solved structurally via the persistent banner's own
 * restart control (§3.6/§2.4, `ReminderBanner.tsx`), not a sixth fact
 * crammed onto this already-tight screen.
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
        <p className={styles.body}>
          Estamos validando ideas, no vendiéndote nada — tu negocio, tus productos y tus clientes
          pueden ser inventados.
        </p>
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
      </ul>

      <p className={styles.closing}>
        Al final hay un cuestionario breve — es parte de la misma prueba, no un paso aparte, y tu
        opinión nos ayuda a decidir qué construimos después.
      </p>

      <Button className={styles.cta} onClick={onStart}>
        Empezar demo
      </Button>
    </div>
  );
}
