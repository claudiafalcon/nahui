import { useState } from 'react';
import { useStore } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import type { Invitation } from '../../domain/types';
import styles from './InvitationFlow.module.css';

type Step = 'offer' | 'accepting' | 'accepting-error' | 'welcome' | 'no-longer-available';

const ACCEPT_DELAY_MS = 260; // near-instant convention (§3.10a), matching every other write in this flow

/**
 * authentication.md §2.2a/§3.10–§3.13a (`product-decisions.md` Q24/Q25) —
 * the Invitation-acceptance branch, reached only via `AppRouter.tsx`'s own
 * §2.2 case 0 resolution (a verified phone, first-ever, holding a pending
 * Invitation). Mounted in place of `OnboardingFlow`/`App` for exactly as
 * long as this offer stays unresolved — see `AppRouter.tsx`'s own doc
 * comment for the full routing reasoning, including the disclosed,
 * state-derived approximation of "never verified before" this build uses.
 *
 * `businessName` is passed in already-resolved (`AppRouter.tsx` reads it
 * once from `state.business` matching `invitation.businessId` — this
 * component never looks up a Business of its own, keeping it a pure
 * function of props plus the one Invitation it was handed).
 */
export function InvitationFlow({
  invitation,
  businessName,
  onDeclined,
  onAccepted,
}: {
  invitation: Invitation;
  businessName: string;
  /** §2.2a step 4 — "Ahora no" touches nothing; the caller only needs to
   * stop offering this screen for the rest of this session (see
   * `AppRouter.tsx`'s own disclosed local-state limitation). */
  onDeclined: () => void;
  /** §3.10c "Ir a Hoy" — hands off into `home.md §2`'s own resolution, now
   * reading a real, active SELLER Membership for the first time. */
  onAccepted: () => void;
}) {
  const { acceptInvitation } = useStore();
  const [step, setStep] = useState<Step>('offer');

  function handleAccept() {
    setStep('accepting');
    window.setTimeout(() => {
      const result = acceptInvitation(invitation.id);
      if (result) {
        setStep('welcome');
      } else {
        // §2.2a step 1's own re-check — reached only if the Invitation
        // stopped being `pending` between this screen rendering and this
        // tap (a stale local check discovering a fact it can no longer act
        // on). Never actually reachable in this single-tab prototype (see
        // this codebase's existing disclosed-not-wired convention for
        // states a genuine second actor alone could trigger), kept as a
        // real, correctly-rendering branch rather than an unwritten state.
        setStep('no-longer-available');
      }
    }, ACCEPT_DELAY_MS);
  }

  if (step === 'welcome') {
    return (
      <ScreenTransition transitionKey="invitation-welcome">
        <div className={styles.wrap}>
          <div className={styles.mark}>
            <BrandMark />
          </div>
          <div className={styles.copy}>
            <h1 className={styles.eyebrow}>Nahui</h1>
            <p className={styles.body}>Ya quedaste registrada con {businessName}.</p>
            <p className={styles.body}>Cuando quieras vender, abre tu sesión aquí.</p>
          </div>
          <Button className={styles.cta} onClick={onAccepted}>
            Ir a Hoy
          </Button>
        </div>
      </ScreenTransition>
    );
  }

  if (step === 'no-longer-available') {
    return (
      <ScreenTransition transitionKey="invitation-expired">
        <div className={styles.wrap}>
          <div className={styles.copy}>
            <h1 className={styles.eyebrow}>Nahui</h1>
            <p className={styles.body}>Esta invitación ya no está disponible.</p>
            <p className={styles.body}>Si crees que esto es un error, habla con quien te invitó.</p>
          </div>
          <Button className={styles.cta} onClick={onDeclined}>
            Continuar
          </Button>
        </div>
      </ScreenTransition>
    );
  }

  if (step === 'accepting-error') {
    // §3.10b — never actually reached in this build (the local mock write
    // never fails), same disclosed-not-wired convention as every other
    // write-failure state in this codebase family.
    return (
      <div className={styles.wrap}>
        <p className={styles.body}>No pudimos completar esto. Sigue aquí, intenta de nuevo.</p>
        <Button className={styles.cta} onClick={handleAccept}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (step === 'accepting') {
    // §3.10a — near-instant convention, matching every other write in this
    // flow; the "slow" (>~1.5s) variant is architecturally unreached here,
    // same posture PhoneStep/CodeStep already establish for their own
    // synchronous mock writes.
    return <p className={styles.savingLine}>Uniéndote a {businessName}…</p>;
  }

  return (
    <ScreenTransition transitionKey="invitation-offer">
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <h1 className={styles.eyebrow}>Nahui</h1>
          <p className={styles.body}>Te invitaron a vender con {businessName}.</p>
          <p className={styles.body}>
            Vas a poder abrir tus propias sesiones de venta y registrar ventas, usando su Catálogo y sus precios.
          </p>
        </div>
        <div className={styles.ctaStack}>
          <Button className={styles.cta} onClick={handleAccept}>
            Aceptar y empezar a vender
          </Button>
          <Button className={styles.cta} variant="secondary" onClick={onDeclined}>
            Ahora no
          </Button>
        </div>
      </div>
    </ScreenTransition>
  );
}
