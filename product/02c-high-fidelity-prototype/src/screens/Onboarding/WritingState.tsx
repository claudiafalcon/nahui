import type { ReactNode } from 'react';
import { Button } from '../../components/Button/Button';
import styles from './WritingState.module.css';

/**
 * Shared near-instant/slow write screen, reused by §3.5 ("Preparando
 * todo…"), §3.10 ("Guardando tu negocio…"), and §3.5d ("Guardando lo que
 * vendes…") — one component, three labels, matching this document family's
 * own convention that these three states share identical shape.
 *
 * The error variant is wired for all three of its callers now: §3.5a
 * ("Preparando todo…", `OnboardingFlow.tsx`'s `'creating-error'` state),
 * §3.10a ("Guardando tu negocio…", `BusinessIdentity.tsx`), and §3.5e
 * ("Guardando lo que vendes…", `SellingGroups.tsx`) — three real,
 * correctly-rendering branches, none triggered in this build, the same
 * disclosed-not-wired convention already established for this codebase's
 * other sync-failure states (`BACKLOG.md`'s migration inventory, section A).
 * `BusinessIdentity.tsx`/`SellingGroups.tsx` previously did not pass
 * `error`/`errorLabel`/`onRetry` to this component at all — that gap
 * (`BACKLOG.md`'s migration inventory, section B) is now closed.
 *
 * `children`, error variant only — §3.10a and §3.5e's own wireframes both
 * draw the actual preserved data (Nombre/logo/Descripción; the committed
 * Selling Group lines) visible above "Reintentar," not just the message and
 * button. Optional so callers with nothing itemized to show (§3.5a) render
 * unchanged.
 */
export function WritingState({
  label,
  error,
  errorLabel,
  onRetry,
  children,
}: {
  label?: string;
  error?: boolean;
  errorLabel?: string;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  if (error) {
    return (
      <div className={styles.wrap}>
        <p className={styles.body}>{errorLabel ?? 'No pudimos guardar. Intenta de nuevo.'}</p>
        {children}
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
