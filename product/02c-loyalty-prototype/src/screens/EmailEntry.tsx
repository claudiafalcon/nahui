import { useState } from 'react';
import { BusinessBadge } from '../components/BusinessBadge/BusinessBadge';
import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { PoweredByFooter } from '../components/PoweredByFooter/PoweredByFooter';
import shared from './shared.module.css';

/** §2 step 3's own "nothing stronger validated here, since deeper
 * validation isn't a UI-layer concern" — an "@" plus a domain segment,
 * nothing more. */
const PLAUSIBLE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * §3.5 (Correo — entrada) + §3.5a (formato inválido variant) — the first
 * interactive screen, shown to every visit. "Continuar" is enabled only
 * once the field holds a plausible-shaped value (§3.5's own annotation);
 * the inline §3.5a message shows live once she's typed something that
 * doesn't look like an email yet, so the disabled button and the message
 * always agree with each other.
 */
export function EmailEntry({
  businessName,
  businessLogo,
  submitting,
  onContinue,
  onDecline,
}: {
  businessName: string;
  businessLogo?: string;
  submitting: boolean;
  onContinue: (email: string) => void;
  onDecline: () => void;
}) {
  const [email, setEmail] = useState('');
  const trimmed = email.trim();
  const isPlausible = PLAUSIBLE_EMAIL.test(trimmed);
  const showInlineError = trimmed.length > 0 && !isPlausible;

  return (
    <Card>
      <BusinessBadge name={businessName} logo={businessLogo} />
      <div className={shared.stackLeft}>
        <h1 className={shared.heading}>¿Quieres que {businessName} te recuerde la próxima vez que le compres?</h1>
        <p className={shared.body}>
          Con tu correo, {businessName} puede llevar la cuenta de tus compras aquí y, cuando juntes suficientes,
          darte algo a cambio.
        </p>
        <p className={shared.trustNote}>
          Esto es solo con este negocio — no es una cuenta de Nahui, y tu correo no se comparte con nadie más.
        </p>
      </div>

      <form
        className={shared.stackLeft}
        onSubmit={(e) => {
          e.preventDefault();
          if (isPlausible && !submitting) onContinue(trimmed);
        }}
      >
        <div className={shared.field}>
          <label className={shared.label} htmlFor="loyalty-email">
            Correo
          </label>
          <input
            id="loyalty-email"
            className={`${shared.input} ${showInlineError ? shared.inputError : ''}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={email}
            disabled={submitting}
            onChange={(e) => setEmail(e.target.value)}
          />
          {showInlineError && <p className={shared.errorText}>Escribe un correo válido</p>}
        </div>

        <div className={shared.actions}>
          <Button type="submit" variant="primary" disabled={!isPlausible || submitting}>
            Continuar
          </Button>
          <Button type="button" variant="decline" disabled={submitting} onClick={onDecline}>
            No, gracias
          </Button>
        </div>
      </form>

      <PoweredByFooter />
    </Card>
  );
}
