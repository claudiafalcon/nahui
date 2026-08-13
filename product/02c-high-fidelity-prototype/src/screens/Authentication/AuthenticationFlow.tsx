import { useState } from 'react';
import { PhoneStep } from './PhoneStep';
import { CodeStep } from './CodeStep';

type AuthStep = { kind: 'phone'; prefill?: string } | { kind: 'code'; phone: string };

/**
 * authentication.md — the phone+OTP verification gate that precedes
 * everything else in the Merchant Application (§0). Mounted by `AppRouter`
 * whenever `state.currentUser?.phoneVerifiedAt` is unset.
 *
 * §3.8 ("Retomar autenticación interrumpida") is a disclosed, narrower
 * simplification in this build: nothing is written to the persisted store
 * before `verifyOtp` succeeds (per RFC 0007 — a `User` row is only created
 * on successful verification), so a typed-but-unsent phone number or a
 * sent-but-unconfirmed code lives only in this component's own local state,
 * the same "resets on reload/tab-away, not on ordinary in-flow navigation"
 * shape `RegisterMerchandise.tsx`'s own in-progress draft already has
 * (README.md "Scope decisions"). Within a single mount of this flow —
 * including tapping back and forth between §3.3 and §3.6 via "← Cambiar
 * número" — nothing typed is lost, which is the guarantee that actually
 * matters for the walkthrough this pass builds.
 */
export function AuthenticationFlow() {
  const [step, setStep] = useState<AuthStep>({ kind: 'phone' });

  if (step.kind === 'code') {
    return (
      <CodeStep
        phone={step.phone}
        onBack={() => setStep({ kind: 'phone', prefill: step.phone })}
      />
    );
  }

  return <PhoneStep initialValue={step.prefill} onCodeSent={(phone) => setStep({ kind: 'code', phone })} />;
}
