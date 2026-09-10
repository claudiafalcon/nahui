import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import styles from './CodeStep.module.css';

const RESEND_COOLDOWN_MS = 30_000; // §3.6, judgment call

/**
 * authentication.md §3.6/§3.6a/§3.6b/§3.7/§3.7a-d — Ingresa el código.
 *
 * Stage 7 Backend Integration — `handleConfirm`/`handleResend` now call the
 * store's real `verifyOtp`/`requestOtp` (the `verify-otp`/`send-otp`
 * Supabase Edge Functions, via `otpClient.ts`), replacing the previous
 * mock (RFC 0007 §5, disclosed in
 * docs/passes/slice-2-authentication-onboarding.md — retired). §3.7a
 * (código incorrecto), §3.7b (código expirado), §3.7c (demasiados
 * intentos), and §3.7d (error de plataforma) are real `codeError`/
 * `verifyState` branches that a real rejected outcome now genuinely
 * drives, mapped 1:1 from `verifyOtp`'s `VerifyOtpOutcome.reason`. Not
 * live-tested end to end — no real Supabase/Twilio account exists yet
 * (`supabase/README.md`); until credentials are configured, every real
 * call resolves to the `platform-error`/`'error'` branch. §3.6b's
 * format-invalid inline message *is* genuinely reachable (pasting a
 * non-numeric value into the code field, never auto-stripped). §3.6/§3.6a's
 * resend cooldown *is* a real, ticking 30-second countdown — not a static
 * mock, and now also triggers a real resend, not just a local UI reset.
 */
export function CodeStep({ phone, onBack }: { phone: string; onBack: () => void }) {
  const { verifyOtp, requestOtp } = useStore();
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

  async function handleConfirm() {
    if (!canConfirm) return;
    setVerifyState('verifying');
    const result = await verifyOtp(phone, trimmed);
    if (result.ok) {
      // Success hands off silently — AppRouter re-renders once
      // `currentUser.phoneVerifiedAt` is set; nothing further to do here.
      return;
    }
    if (result.reason === 'platform-error') {
      setVerifyState('platform-error');
    } else {
      setVerifyState('entry');
      setCodeError(result.reason);
    }
  }

  async function handleResend() {
    setCodeError(null);
    const result = await requestOtp(phone);
    if (result.ok) {
      setRaw('');
      setResendAt(Date.now() + RESEND_COOLDOWN_MS);
      setJustResent(true);
      window.setTimeout(() => setJustResent(false), 2400);
    }
    // A failed resend leaves the existing code field/cooldown untouched —
    // the merchant can just tap "Reenviar código" again once the cooldown
    // clears, the same recovery path §3.5a's own "Reintentar" already
    // gives PhoneStep for an identical failure class. No separate
    // resend-failure copy exists in the Approved spec to show instead.
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
