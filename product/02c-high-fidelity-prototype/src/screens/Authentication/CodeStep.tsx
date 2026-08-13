import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import styles from './CodeStep.module.css';

const RESEND_COOLDOWN_MS = 30_000; // §3.6, judgment call
const VERIFY_DELAY_MS = 260; // near-instant convention (§3.7)

/**
 * authentication.md §3.6/§3.6a/§3.6b/§3.7/§3.7a-d — Ingresa el código.
 *
 * Mock verification (RFC 0007 §5, disclosed in README.md): any 6-digit code
 * is accepted, so `verifying` always succeeds. §3.7a (código incorrecto),
 * §3.7b (código expirado), §3.7c (demasiados intentos), and §3.7d (error de
 * plataforma) are all built as real, correctly-rendering `codeError`
 * branches on this same screen — never triggered, the same disclosed-not-
 * wired convention already established for this codebase's sync-failure
 * states. §3.6b's format-invalid inline message *is* genuinely reachable
 * (pasting a non-numeric value into the code field, never auto-stripped).
 * §3.6/§3.6a's resend cooldown *is* a real, ticking 30-second countdown —
 * not a static mock.
 */
export function CodeStep({ phone, onBack }: { phone: string; onBack: () => void }) {
  const { verifyOtp } = useStore();
  const [raw, setRaw] = useState('');
  const [verifyState, setVerifyState] = useState<'entry' | 'verifying' | 'platform-error'>('entry');
  const [codeError, setCodeError] = useState<'incorrect' | 'expired' | 'too-many' | null>(null);
  const [resendAt, setResendAt] = useState(() => Date.now() + RESEND_COOLDOWN_MS);
  const [now, setNow] = useState(Date.now());
  const [justResent, setJustResent] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);

  const trimmed = raw.trim();
  const isValidDigits = /^\d{6}$/.test(trimmed);
  // Same widened coverage as PhoneStep — a non-digit at any length, or a
  // too-long value, must also surface an explanation rather than leaving
  // "Confirmar" silently disabled.
  const hasNonDigit = trimmed.length > 0 && !/^\d*$/.test(trimmed);
  const isTooLong = trimmed.length > 6;
  const showFormatError = trimmed.length > 0 && (hasNonDigit || isTooLong);
  const canConfirm = isValidDigits;

  const remainingMs = Math.max(0, resendAt - now);
  const cooldownActive = remainingMs > 0;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const countdownLabel = `0:${String(remainingSeconds).padStart(2, '0')}`;

  function handleConfirm() {
    if (!canConfirm) return;
    setVerifyState('verifying');
    window.setTimeout(() => {
      verifyOtp(phone, trimmed);
      // Success hands off silently — AppRouter re-renders once
      // `currentUser.phoneVerifiedAt` is set; nothing further to do here.
    }, VERIFY_DELAY_MS);
  }

  function handleResend() {
    setRaw('');
    setCodeError(null);
    setResendAt(Date.now() + RESEND_COOLDOWN_MS);
    setJustResent(true);
    window.setTimeout(() => setJustResent(false), 2400);
  }

  if (verifyState === 'platform-error') {
    // §3.7d — never actually reached in this build (disclosed above).
    return (
      <div className={styles.wrap}>
        <p className={styles.body}>No pudimos confirmar tu código. Sigue aquí, intenta de nuevo.</p>
        <Button className={styles.cta} onClick={() => setVerifyState('entry')}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (verifyState === 'verifying') {
    // §3.7 — near-instant convention; see PhoneStep's own note on why the
    // "slow" variant is architecturally unreached in this build.
    return <p className={styles.savingLine}>Confirmando…</p>;
  }

  if (codeError === 'too-many') {
    // §3.7c — never actually reached in this build (disclosed above).
    return (
      <div className={styles.wrap}>
        <button className={styles.back} onClick={onBack}>
          ← Cambiar número
        </button>
        <h1 className={styles.heading}>Ingresa el código</h1>
        <p className={styles.body}>
          Después de varios intentos, este código ya no es válido. Pide uno nuevo y con gusto lo
          confirmamos.
        </p>
        <Button className={styles.cta} onClick={handleResend}>
          Reenviar código
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.back} onClick={onBack}>
        ← Cambiar número
      </button>
      <h1 className={styles.heading}>Ingresa el código</h1>
      <p className={styles.body}>
        Te mandamos un código a +52 {phone.slice(0, 2)} {phone.slice(2, 6)} {phone.slice(6)}.
      </p>

      {justResent && <p className={styles.confirmation}>Código reenviado ✓</p>}

      <div className={styles.field}>
        <span className={styles.label}>Código</span>
        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          autoFocus
          maxLength={6}
          placeholder="______"
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setCodeError(null);
          }}
        />
        {showFormatError && (
          <p className={styles.error}>Verifica tu código — solo dígitos, a 6 números.</p>
        )}
        {codeError === 'incorrect' && <p className={styles.error}>Ese código no es correcto. Intenta de nuevo.</p>}
        {codeError === 'expired' && <p className={styles.error}>Este código ya venció.</p>}
      </div>

      {codeError === 'expired' ? (
        <Button className={styles.cta} onClick={handleResend}>
          Reenviar código
        </Button>
      ) : (
        <Button className={styles.cta} disabled={!canConfirm} onClick={handleConfirm}>
          Confirmar
        </Button>
      )}

      {codeError !== 'expired' && (
        <p className={styles.resendLine}>
          ¿No te llegó?{' '}
          {cooldownActive ? (
            <span className={styles.countdown}>Reenviar en {countdownLabel}</span>
          ) : (
            <button className={styles.resendBtn} onClick={handleResend}>
              Reenviar código
            </button>
          )}
        </p>
      )}
    </div>
  );
}
