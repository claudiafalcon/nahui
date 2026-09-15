import { useState } from 'react';
import { useStore } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from './LockedEmailStep.module.css';

/**
 * authentication.md §3.2g "Invitación — correo confirmado" (new,
 * `product/99-rfc/0014-invitation-target-hint-enforced.md`/`decision-log.md`
 * D70) — the one and only entry point into authentication for an
 * Invitation-acceptance attempt reached on a session-less device. Never
 * `§3.2a`'s ordinary three-way method choice: RFC 0014 requires the
 * *method*, not just the value, to be fixed to Email, since Google's own
 * `AuthIdentity` never captures a real email to check `targetHint` against.
 *
 * The email shown is `targetHint`'s own stored value, read directly from
 * `peek_invitation`'s response (`InvitationFlow.tsx`'s own `resolveToken`)
 * — never typed, never editable here. "Enviar código" reuses §3.5's own
 * send action verbatim (already channel-neutral, needs no change to accept
 * this new entry point) — mounted here as a thin wrapper, not a
 * reimplementation, so `AuthenticationFlow.tsx`'s own `CodeStep`/§3.6
 * convergence stays the single mechanism every channel shares.
 */
export function LockedEmailStep({
  email,
  businessName,
  onCodeSent,
  onDecline,
}: {
  email: string;
  businessName: string;
  onCodeSent: () => void;
  onDecline: () => void;
}) {
  const { requestEmailOtp } = useStore();
  const [sendState, setSendState] = useState<'entry' | 'sending' | 'error'>('entry');

  async function handleSend() {
    setSendState('sending');
    const result = await requestEmailOtp(email);
    if (result.ok) {
      onCodeSent();
    } else {
      setSendState('error');
    }
  }

  if (sendState === 'error') {
    // §3.5a's shared error state (cited, not redescribed) — reached here via
    // this locked-email flow's own send attempt.
    return (
      <div className={styles.wrap}>
        <p className={styles.body}>No pudimos enviar tu código. Intenta de nuevo.</p>
        <Button className={styles.cta} onClick={handleSend}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (sendState === 'sending') {
    // §3.5 — near-instant, silent-skeleton convention; same architecturally-
    // unreached "slow" variant posture every other synchronous mock/real
    // write in this family already has.
    return <p className={styles.savingLine}>Enviando…</p>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Nahui</p>
        <h1 className={styles.heading}>Para aceptar la invitación de {businessName}</h1>
        <p className={styles.body}>Te vamos a mandar un código al correo con el que te invitaron:</p>
        <p className={styles.lockedEmail}>{email}</p>
      </div>
      <div className={styles.ctaStack}>
        <Button className={styles.cta} onClick={handleSend}>
          Enviar código
        </Button>
        <Button className={styles.cta} variant="secondary" onClick={onDecline}>
          Ahora no
        </Button>
      </div>
      <p className={styles.hint}>¿No es tu correo? Dile a quien te invitó que lo corrija.</p>
    </div>
  );
}
