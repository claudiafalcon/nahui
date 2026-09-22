import { useState } from 'react';
import { useStore } from '../../domain/store';
import { currentUser } from '../../domain/selectors';
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
 *
 * **"Tu nombre" (added 2026-09-15, `decision-log.md` D69, `product-
 * decisions.md` Q29) — load-bearing here, not merely mirrored.** `App.tsx`/
 * `HomeScreen.tsx` route a SELLER to *this* screen, never to
 * `SettingsScreen.tsx`'s own OWNER-facing Configuración — so without this
 * addition, a SELLER would have no way to reach `settings.md` §2.5's own
 * "Tu cuenta" section, or the self-service field D69 requires it carry,
 * anywhere in the built app: `authentication.md` §3.10c's own new pointer
 * line ("Cuando quieras, puedes agregar tu nombre en Tu cuenta") would name
 * a destination that structurally doesn't exist for the exact role that
 * line targets. Reuses `SettingsScreen.tsx`'s own §3.3b sheet shape
 * verbatim — a local copy, not a cross-feature import, matching this
 * folder's own established convention for the sign-out mechanism above.
 */
export function SellerAccountScreen({ onBack }: { onBack: () => void }) {
  const { state, signOut, setUserDisplayName } = useStore();
  const [step, setStep] = useState<'main' | 'confirm' | 'saving' | 'error'>('main');
  const displayName = currentUser(state)?.displayName ?? null;
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [nameSaveError, setNameSaveError] = useState(false);

  function openEditName() {
    setNameDraft(displayName ?? '');
    setNameSaveError(false);
    setEditNameOpen(true);
  }

  async function handleSaveName() {
    setNameSaveError(false);
    const ok = await setUserDisplayName(nameDraft);
    if (ok) {
      setEditNameOpen(false);
    } else {
      setNameSaveError(true);
    }
  }

  function handleConfirm() {
    setStep('saving');
    window.setTimeout(() => {
      // `signOut` is now `Promise<void>` (`reviewer` Blocker fix,
      // 2026-09-14) — fire-and-forget here is still correct: this screen
      // never reads state after the call, it just waits for `AppRouter.tsx`'s
      // own reactive fall-through once `currentUserId` clears, which
      // `signOut` itself already awaits the real Supabase sign-out before
      // doing.
      void signOut();
      // `AppRouter.tsx` falls back to `AuthenticationFlow` automatically the
      // instant `currentUserId` clears (RFC 0012/D62-63 — was
      // `phoneVerifiedAt`) — no further navigation call needed here, same
      // guarantee `settings.md §2.5` already relies on.
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

        {/* "Tu nombre" — new 2026-09-15, `decision-log.md` D69. Both states
            open the identical §3.3b sheet. */}
        <p className={styles.sectionLabel}>Tu nombre</p>
        {displayName ? (
          <div className={styles.nameRow}>
            <span className={styles.nameValue}>{displayName}</span>
            <Button variant="secondary" inline onClick={openEditName}>
              Editar
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={openEditName}>
            Agregar tu nombre
          </Button>
        )}

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

      {editNameOpen && (
        <Sheet onDismiss={() => setEditNameOpen(false)}>
          <p className={styles.confirmTitle}>Tu nombre</p>
          <div className={styles.field}>
            {/* Pre-filled with her current display name, so it gets the same
                select-on-focus guard as every other "edit this existing
                value" field (see EditPriceSheet.tsx). No-op when empty. */}
            <input
              className={styles.input}
              type="text"
              autoFocus
              onFocus={(e) => e.target.select()}
              placeholder="Escribe tu nombre…"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
            />
          </div>
          <p className={styles.hint}>Así te van a reconocer en Resultados y en Tu equipo.</p>
          {nameSaveError && <p className={styles.error}>No pudimos guardar tu nombre. Intenta de nuevo.</p>}
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setEditNameOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleSaveName()}>Guardar</Button>
          </div>
        </Sheet>
      )}
    </ScreenTransition>
  );
}
