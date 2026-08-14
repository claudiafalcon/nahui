import { Button } from '../../components/Button/Button';
import styles from './WritingState.module.css';

/**
 * Shared near-instant/slow write screen, reused by §3.5 ("Preparando
 * todo…"), §3.10 ("Guardando tu negocio…"), and §3.5d ("Guardando lo que
 * vendes…") — one component, three labels, matching this document family's
 * own convention that these three states share identical shape.
 *
 * The error variant is only actually wired for §3.5a ("Preparando todo…",
 * `OnboardingFlow.tsx`'s `'creating-error'` state) — a real,
 * correctly-rendering branch, never triggered in this build, the same
 * disclosed-not-wired convention already established for this codebase's
 * other sync-failure states (`BACKLOG.md`'s migration inventory, section A).
 * §3.10a (`BusinessIdentity.tsx`) and §3.5e (`SellingGroups.tsx`) do not pass
 * `error`/`errorLabel`/`onRetry` to this component at all, so those two
 * screens currently have no error+retry UI whatsoever — not merely an
 * untriggered branch, but a genuine regression, tracked in `BACKLOG.md`'s
 * migration inventory, section B.
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
