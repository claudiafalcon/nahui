import { useState } from 'react';
import { useStore } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { InvitationContextLine, type InvitationContext } from './InvitationContextLine';
import styles from './EmailStep.module.css';

/**
 * authentication.md §3.2e "Correo electrónico — entry" and §3.2f "formato
 * inválido" (new, 2026-09-13, `decision-log.md` D62/D63) — combined in one
 * component, mirroring how `PhoneStep.tsx` already folds its own §3.4 inline
 * error into the same file rather than a separate screen state.
 *
 * **Validation is a deliberately loose structural check, not full email
 * validation** (§3.2e's own text): at least one character before "@," an
 * "@," at least one character between it and a final ".," and at least one
 * character after that "." — the same posture §3.3's ten-digit phone gate
 * takes (catch the obviously-incomplete case, real delivery/verification
 * catches the rest). **Unlike §3.4/§3.6b's phone/code equivalents, this
 * inline error is not strictly paste-only** — email validity has no fixed
 * length the way a 10-digit phone or 6-digit code does, so a genuinely typed
 * value can momentarily satisfy the loose "@ plus something" shape then fail
 * the fuller check while she's still mid-typing (e.g. "ana@correo" before
 * she reaches ".com") — shown live rather than gated to paste events, per
 * §3.2f's own explicit text.
 *
 * Stage 7 Backend Integration — `handleSend` calls the store's real
 * `requestEmailOtp` (Supabase Auth's own `signInWithOtp`, via
 * `authProviders.ts`). Not live-tested end to end — no real Supabase
 * project-level email confirmation has been run yet (`supabase/README.md`'s
 * own disclosed posture, extended to this channel).
 */
export function EmailStep({
  initialValue,
  onBack,
  onCodeSent,
  invitationContext,
}: {
  initialValue?: string;
  onBack: () => void;
  onCodeSent: (email: string) => void;
  /** RFC 0013, added 2026-09-14 — see `InvitationContextLine.tsx`'s own doc
   * comment for the full reasoning. */
  invitationContext?: InvitationContext;
}) {
  const { requestEmailOtp } = useStore();
  const [raw, setRaw] = useState(initialValue ?? '');
  const [sendState, setSendState] = useState<'entry' | 'sending' | 'error'>('entry');

  const trimmed = raw.trim();
  // Loose structural check — see this component's own doc comment above.
  const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const hasAtSign = trimmed.includes('@');
  const showFormatError = trimmed.length > 0 && hasAtSign && !looksValid;
  const canSend = looksValid;

  async function handleSend() {
    if (!canSend) return;
    setSendState('sending');
    const result = await requestEmailOtp(trimmed.toLowerCase());
    if (result.ok) {
      onCodeSent(trimmed.toLowerCase());
    } else {
      setSendState('error');
    }
  }

  if (sendState === 'error') {
    // §3.5a's shared error state (cited, not redescribed) — reached here via
    // the email channel's own send attempt.
    return (
      <div className={styles.wrap}>
        {invitationContext && <InvitationContextLine businessName={invitationContext.businessName} />}
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
    // §3.5 — near-instant, silent-skeleton convention; same architecturally-
    // unreached "slow" variant posture every other synchronous mock write in
    // this family already has (the real Supabase call may genuinely be slow
    // once live-tested — not yet reachable to verify either way).
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
        {invitationContext && <InvitationContextLine businessName={invitationContext.businessName} />}
        <p className={styles.eyebrow}>Nahui</p>
        <h1 className={styles.heading}>Correo electrónico</h1>
        <p className={styles.body}>Para empezar, dinos tu correo.</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email-step-input">
          Correo electrónico
        </label>
        <input
          id="email-step-input"
          className={styles.input}
          type="email"
          inputMode="email"
          autoFocus
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="ana@correo.com"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
        {showFormatError && <p className={styles.error}>Verifica tu correo — parece que le falta algo.</p>}
      </div>

      <Button className={styles.cta} disabled={!canSend} onClick={handleSend}>
        Enviar código
      </Button>
    </div>
  );
}
