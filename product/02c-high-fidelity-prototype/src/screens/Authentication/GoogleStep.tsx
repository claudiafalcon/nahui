import { Button } from '../../components/Button/Button';
import styles from './GoogleStep.module.css';

/**
 * authentication.md §3.2b/§3.2c/§3.2d "Continuando con Google" /
 * "Verificando con Google" / "Google — no se pudo continuar" (new,
 * 2026-09-13, `decision-log.md` D62/D63) — one file for all three, per this
 * dispatch's own build-order instruction: they're thin skeleton/near-instant
 * states plus one error screen, not substantial enough to warrant three
 * separate files the way the phone/email entry screens are.
 */

/**
 * §3.2b (reached the instant she taps "Continuar con Google," §3.2a) and
 * §3.2c (reached the moment control returns to Nahui from Google's own UI).
 * Same near-instant/slow convention as every other transition in this
 * document — this build always resolves synchronously fast in the mock
 * paths, so the "slow" >~1.5s variant is architecturally unreached here, the
 * same disclosed posture `PhoneStep`/`CodeStep` already state for their own
 * near-instant states. Google's own account-picker/consent UI itself is
 * below this document's abstraction level (§3.2b's own text, the same
 * treatment `onboarding.md §2.2b` already gives the OS-level device
 * file-picker) — this component never renders anything representing it.
 */
export function GoogleProgress({ mode }: { mode: 'redirecting' | 'verifying' }) {
  return <p className={styles.savingLine}>{mode === 'redirecting' ? 'Un momento…' : 'Confirmando…'}</p>;
}

/**
 * §3.2d — reached only on a genuine send/confirm failure (network drop, a
 * real error Google's own callback reports), never for a plain cancellation
 * (§3.2c's own distinction — a denied/dismissed consent screen routes
 * silently back to §3.2a instead, with no message at all, handled entirely
 * in `AuthenticationFlow.tsx`, never reaching this component at all).
 */
export function GoogleError({ onRetry, onChooseOther }: { onRetry: () => void; onChooseOther: () => void }) {
  return (
    <div className={styles.wrap}>
      <p className={styles.body}>No pudimos continuar con Google. Intenta de nuevo o elige otra forma de entrar.</p>
      <div className={styles.ctaStack}>
        <Button className={styles.cta} onClick={onRetry}>
          Reintentar
        </Button>
        <Button className={styles.cta} variant="secondary" onClick={onChooseOther}>
          Elegir otra forma
        </Button>
      </div>
    </div>
  );
}
