import { useState } from 'react';
import { PhoneStep } from './PhoneStep';
import { CodeStep } from './CodeStep';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';

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
 * (docs/passes/slice-1-home-inventario.md "Scope decisions"). Within a single mount of this flow —
 * including tapping back and forth between §3.3 and §3.6 via "← Cambiar
 * número" — nothing typed is lost, which is the guarantee that actually
 * matters for the walkthrough this pass builds.
 *
 * `initialPhone` (Slice 12 `merchant-user-tester` defect fix, 2026-09-07,
 * `authentication.md` §3.7e) — set by `AppRouter.tsx` only when it just
 * mounted this component fresh in response to "No, corregir número"
 * (`PhoneMismatchConfirm.tsx`), so the just-typed, just-rejected number is
 * preserved for editing rather than retyped from scratch — the identical
 * pre-fill behavior "← Cambiar número" (§3.6) already gives, applied to a
 * second escape hatch rather than a new one.
 */
export function AuthenticationFlow({ initialPhone }: { initialPhone?: string } = {}) {
  const [step, setStep] = useState<AuthStep>({ kind: 'phone', prefill: initialPhone });

  if (step.kind === 'code') {
    return (
      <ScreenTransition transitionKey="code">
        <CodeStep
          phone={step.phone}
          onBack={() => setStep({ kind: 'phone', prefill: step.phone })}
        />
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition transitionKey="phone">
      <PhoneStep initialValue={step.prefill} onCodeSent={(phone) => setStep({ kind: 'code', phone })} />
    </ScreenTransition>
  );
}
