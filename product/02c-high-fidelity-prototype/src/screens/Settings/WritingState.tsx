import { Button } from '../../components/Button/Button';
import styles from './WritingState.module.css';

/**
 * Shared near-instant/slow write screen for this feature, reused with two
 * distinct label sets — settings.md §3.9 ("Guardando…", shared by every
 * capability action's actual write — §3.4/§3.5's confirms and §3.7's
 * "Cancelar cambio pendiente") and §3.8a ("Cerrando sesión…" — settings.md
 * §3.8a's own note: "own copy variant, distinct from §3.9's Guardando… —
 * nothing is being saved here, a device's session fact is being cleared").
 * Same one-component/several-labels shape `Onboarding/WritingState.tsx`
 * already established for its own three reuses — a local copy here rather
 * than a cross-feature import, matching this codebase's own per-folder CSS
 * Module convention (see ConfirmScreen.module.css's own note).
 *
 * The error variant renders real, correctly-rendering §3.8b/§3.10 branches
 * that are never triggered through real interaction in this build — the
 * same disclosed-not-wired convention already established for every other
 * write in this codebase (mock writes never actually fail).
 */
export function WritingState({
  label,
  error,
  errorLabel,
  onRetry,
}: {
  label?: string;
  error?: boolean;
  errorLabel?: string;
  onRetry?: () => void;
}) {
  if (error) {
    return (
      <div className={styles.wrap}>
        <p className={styles.body}>{errorLabel ?? 'No pudimos guardar. Intenta de nuevo.'}</p>
        {onRetry && (
          <Button className={styles.cta} onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  return <p className={styles.savingLine}>{label}</p>;
}
