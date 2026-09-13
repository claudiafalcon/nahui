import { useState } from 'react';
import { useStore } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from './PhoneStep.module.css';

/**
 * authentication.md §3.3/§3.4/§3.5/§3.5a — Número celular.
 *
 * **Amended 2026-09-13, `decision-log.md` D62/D63:** gains a back arrow,
 * "← Elegir cómo entrar," returning to §3.2a — no longer the first screen in
 * the product; `ChooseMethodStep` (§3.2a) is. Not a persisted resume state
 * (`AuthenticationFlow.tsx`'s own §3.8 mechanism owns that) — simply doesn't
 * discard a partially-typed number if she taps back into this screen within
 * the same session, the same courtesy every other escape hatch in this
 * family already gives (`CodeStep.tsx`'s "← Cambiar [número / correo]").
 *
 * Stage 7 Backend Integration — `handleSend` now calls the store's real
 * `requestOtp` (the `send-otp` Supabase Edge Function, via
 * `otpClient.ts`), replacing the previous local-only fake-delay mock.
 * §3.5a ("No pudimos enviar tu código") is a real, now genuinely reachable
 * render branch (`sendState === 'error'`) — a rate-limited or
 * platform-error outcome from the real call lands here; the same generic
 * copy covers both without inventing new UI text beyond the Approved spec.
 * Not live-tested end to end — no real Supabase/Twilio account exists yet
 * (`supabase/README.md`); until credentials are configured, every real
 * call resolves to this error branch. §3.4's format-invalid state *is*
 * genuinely reachable, through real interaction (pasting a non-numeric
 * value) — the field is deliberately never auto-stripped of non-digit
 * characters, so a paste carries through exactly as typed.
 */
export function PhoneStep({
  initialValue,
  onBack,
  onCodeSent,
}: {
  initialValue?: string;
  onBack: () => void;
  onCodeSent: (phone: string) => void;
}) {
  const { requestOtp } = useStore();
  const [raw, setRaw] = useState(initialValue ?? '');
  const [sendState, setSendState] = useState<'entry' | 'sending' | 'error'>('entry');

  const trimmed = raw.trim();
  const isValidDigits = /^\d{10}$/.test(trimmed);
  // Covers every malformed case, not only "exactly 10 chars with a
  // non-digit mixed in" — a non-digit at any length (e.g. a pasted value),
  // or a too-long value (e.g. a merchant typing a leading 044/045 prefix),
  // must also surface an explanation rather than leaving "Enviar código"
  // silently disabled.
  const hasNonDigit = trimmed.length > 0 && !/^\d*$/.test(trimmed);
  const isTooLong = trimmed.length > 10;
  const showFormatError = trimmed.length > 0 && (hasNonDigit || isTooLong);
  const canSend = isValidDigits;

  async function handleSend() {
    if (!canSend) return;
    setSendState('sending');
    const result = await requestOtp(trimmed);
    if (result.ok) {
      onCodeSent(trimmed);
    } else {
      setSendState('error');
    }
  }

  if (sendState === 'error') {
    // §3.5a — never actually reached in this build (disclosed above), kept
    // as a real, correctly-rendering branch rather than an unwritten state.
    return (
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <p className={styles.body}>No pudimos enviar tu código. Intenta de nuevo.</p>
        </div>
        <Button className={styles.cta} onClick={() => setSendState('entry')}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (sendState === 'sending') {
    // §3.5 — near-instant, silent-skeleton convention; this build always
    // resolves within SEND_DELAY_MS, so the "slow" >~1.5s variant is never
    // reached in practice, the same architecturally-inapplicable posture
    // already established for every other tab's own §3.1/§3.2 (state loads
    // synchronously here too).
    return <p className={styles.savingLine}>Enviando…</p>;
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.back} onClick={onBack}>
        ← Elegir cómo entrar
      </button>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Nahui</p>
        <h1 className={styles.heading}>Número celular</h1>
        <p className={styles.body}>Para empezar, dinos tu número celular.</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="phone-step-input">
          Número celular
        </label>
        <div className={styles.inputRow}>
          <span className={styles.prefix}>+52</span>
          <input
            id="phone-step-input"
            className={styles.input}
            type="tel"
            inputMode="numeric"
            autoFocus
            maxLength={10}
            placeholder="55 1234 5678"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        {showFormatError && (
          <p className={styles.error}>Verifica tu número — solo dígitos, a 10 números.</p>
        )}
      </div>

      <Button className={styles.cta} disabled={!canSend} onClick={handleSend}>
        Enviar código
      </Button>
    </div>
  );
}
