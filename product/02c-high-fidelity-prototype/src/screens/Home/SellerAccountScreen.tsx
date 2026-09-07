import { useState } from 'react';
import { useStore } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { WritingState } from '../Settings/WritingState';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import styles from './SellerAccountScreen.module.css';

const SAVE_DELAY_MS = 260;

/**
 * home.md §3.15a "Tu cuenta" — a SELLER's own minimal account surface,
 * reached via her header's ⊚ icon (§3.15) instead of full Configuración.
 *
 * **A stand-in, hosted here rather than in `settings.md`, exactly as the
 * approved spec itself names it.** "settings.md §8 item 14 already names
 * the larger gap plainly... a materially larger, separate design gap" — the
 * canonical "Cerrar sesión" mechanism (the confirm dialog, the
 * guardando/error states, the exact handoff to `authentication.md §3.3`) is
 * not redescribed here; it's cited wholesale from `settings.md
 * §2.5/§3.8/§3.8a/§3.8b`, reusing the identical write/confirm shape
 * `SettingsScreen.tsx`'s own OWNER-facing sign-out already implements — a
 * local copy of that same small state machine, not a cross-feature import,
 * matching this codebase's own per-folder convention.
 */
export function SellerAccountScreen({ onBack }: { onBack: () => void }) {
  const { signOut } = useStore();
  const [step, setStep] = useState<'main' | 'confirm' | 'saving' | 'error'>('main');

  function handleConfirm() {
    setStep('saving');
    window.setTimeout(() => {
      signOut();
      // `AppRouter.tsx` falls back to `AuthenticationFlow` automatically the
      // instant `phoneVerifiedAt` clears — no further navigation call
      // needed here, same guarantee `settings.md §2.5` already relies on.
    }, SAVE_DELAY_MS);
  }

  if (step === 'saving') {
    return (
      <ScreenTransition transitionKey="seller-account-saving">
        <WritingState label="Cerrando sesión…" />
      </ScreenTransition>
    );
  }
  if (step === 'error') {
    // §3.8b — never actually reached in this build (the local mock write
    // never fails), same disclosed-not-wired convention as every other
    // write-failure state in this codebase family.
    return (
      <ScreenTransition transitionKey="seller-account-error">
        <WritingState error errorLabel="No pudimos cerrar tu sesión. Intenta de nuevo." onRetry={handleConfirm} />
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition transitionKey="seller-account-main">
      <div className={styles.wrap}>
        <button className={styles.back} onClick={onBack}>
          ← Hoy
        </button>
        <h1 className={styles.heading}>Tu cuenta</h1>
        <Button className={styles.cta} variant="secondary" onClick={() => setStep('confirm')}>
          Cerrar sesión
        </Button>
      </div>

      {step === 'confirm' && (
        <Sheet onDismiss={() => setStep('main')}>
          <p className={styles.confirmTitle}>¿Cerrar tu sesión?</p>
          <p className={styles.confirmBody}>
            La próxima vez que abras Nahui aquí, te vamos a pedir tu número otra vez. Tu negocio, tu inventario y tus
            ventas siguen exactamente como están — no se pierde nada.
          </p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setStep('main')}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Sí, cerrar sesión</Button>
          </div>
        </Sheet>
      )}
    </ScreenTransition>
  );
}
