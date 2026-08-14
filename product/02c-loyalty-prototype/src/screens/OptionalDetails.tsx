import { useState } from 'react';
import { BusinessBadge } from '../components/BusinessBadge/BusinessBadge';
import { Button } from '../components/Button/Button';
import { Card } from '../components/Card/Card';
import { OptionChip } from '../components/OptionChip/OptionChip';
import { PoweredByFooter } from '../components/PoweredByFooter/PoweredByFooter';
import shared from './shared.module.css';

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55+'] as const;
const GENDERS = ['Mujer', 'Hombre', 'Otro'] as const;

/**
 * §3.6 — Cuéntanos un poco más, opcional. Reached only when the dedup
 * lookup found no existing Customer — a returning customer never sees
 * this screen at all (§7's "never asked twice" guarantee, made
 * structurally true by this two-step split). No separate "skip" tap for
 * either field — leaving both untouched and tapping "Listo" is the entire
 * mechanism (§3.6's own note, same shape `onboarding.md` §2.2b already
 * established).
 */
export function OptionalDetails({
  businessName,
  businessLogo,
  submitting,
  onListo,
  onDecline,
}: {
  businessName: string;
  businessLogo?: string;
  submitting: boolean;
  onListo: (ageRange: string | undefined, gender: string | undefined) => void;
  onDecline: () => void;
}) {
  const [ageRange, setAgeRange] = useState<string | undefined>(undefined);
  const [gender, setGender] = useState<string | undefined>(undefined);

  return (
    <Card>
      <BusinessBadge name={businessName} logo={businessLogo} />
      <p className={shared.body}>Ya casi. Esto es opcional — puedes dejarlo en blanco.</p>

      <div className={shared.optionalGroup}>
        <span className={shared.label}>Rango de edad (opcional)</span>
        <OptionChip options={AGE_RANGES} value={ageRange} onChange={setAgeRange} ariaLabel="Rango de edad" />
      </div>

      <div className={shared.optionalGroup}>
        <span className={shared.label}>Género (opcional)</span>
        <OptionChip options={GENDERS} value={gender} onChange={setGender} ariaLabel="Género" />
      </div>

      <div className={shared.actions}>
        <Button
          type="button"
          variant="primary"
          disabled={submitting}
          onClick={() => onListo(ageRange, gender)}
        >
          Listo
        </Button>
        <Button type="button" variant="decline" disabled={submitting} onClick={onDecline}>
          No, gracias
        </Button>
      </div>

      <PoweredByFooter />
    </Card>
  );
}
