import { BrandMark } from '../../components/BrandMark/BrandMark';
import { Button } from '../../components/Button/Button';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import styles from './PhoneMismatchConfirm.module.css';

/**
 * authentication.md §3.7e "Verificando código — éxito, pero este teléfono
 * guarda otro número" (Slice 12 `merchant-user-tester` defect fix,
 * 2026-09-07). Reached only from `AppRouter.tsx`'s own
 * `needsPhoneMismatchConfirmation` derivation: a genuinely
 * first-ever-anywhere phone just verified successfully (`verifyOtp`,
 * store.tsx) on this shared instance while it already held at least one
 * other `User` row — i.e., a different phone previously held a verified
 * session here, however long ago, sign-out or not. Never reached by an
 * ordinary first-ever verification on a genuinely virgin instance — the
 * common case stays exactly as fast as it already was (§6's own "+1, not
 * part of the floor" accounting).
 *
 * No loading state of its own (§3.7e's own text) — the underlying
 * verification write already completed before this screen ever renders;
 * this is a pure local read-and-confirm gate before `onboarding.md §3.5`'s
 * own Business-creation write ever runs.
 */
export function PhoneMismatchConfirm({
  phone,
  onConfirm,
  onCorrect,
}: {
  phone: string;
  /** "Sí, es mi número" — clears the device-history gate permanently for
   * this User (`confirmPhoneMismatch`, store.tsx) and lets the render below
   * fall through to `onboarding.md §3.3`, identical to an ordinary
   * first-ever verification on a virgin device. */
  onConfirm: () => void;
  /** "No, corregir número" — reverts this just-completed verification
   * (`retractMistypedVerification`, store.tsx) and returns to §3.3 with the
   * just-typed number preserved for editing, never retyped from scratch —
   * the identical destination and pre-fill behavior "← Cambiar número"
   * (§3.6) already establishes. */
  onCorrect: () => void;
}) {
  const formatted = `+52 ${phone.slice(0, 2)} ${phone.slice(2, 6)} ${phone.slice(6)}`;
  return (
    <ScreenTransition transitionKey="phone-mismatch-confirm">
      <div className={styles.wrap}>
        <div className={styles.mark}>
          <BrandMark />
        </div>
        <div className={styles.copy}>
          <h1 className={styles.eyebrow}>Nahui</h1>
          <p className={styles.body}>Este número todavía no tiene un negocio en Nahui:</p>
          <p className={styles.phone}>{formatted}</p>
          <p className={styles.body}>Si es tu número, seguimos y empezamos tu negocio aquí.</p>
        </div>
        <div className={styles.ctaStack}>
          <Button className={styles.cta} onClick={onConfirm}>
            Sí, es mi número
          </Button>
          <Button className={styles.cta} variant="secondary" onClick={onCorrect}>
            No, corregir número
          </Button>
        </div>
      </div>
    </ScreenTransition>
  );
}
