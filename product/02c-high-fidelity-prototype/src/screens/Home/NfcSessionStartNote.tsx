import type { NfcSessionStartVariant } from './useNfcSessionStart';
import styles from './Idle.module.css';

/**
 * home.md §3.6a — the one extra line (plus, for Limited Ready only, one
 * inline override control) rendered beneath the Session-start CTA, shared by
 * `Idle.tsx` and `EventResume.tsx`. Renders nothing for `'none'` — the
 * common case, pixel-identical to §3.4/§3.5/§3.6's own base wireframe.
 *
 * Reuses `Idle.module.css`'s existing `.readinessNote`/`.readinessLine`/
 * `.readinessLink` classes (already established for the pre-existing Not
 * Ready mention) rather than introducing new styling per variant — all four
 * variants are, visually, "one line of plain-language copy plus at most one
 * secondary tappable link," exactly the shape that CSS already provides.
 */
export function NfcSessionStartNote({
  variant,
  overrideToNfc,
  onToggleOverride,
  onOpenAssignTags,
  onOpenSettings,
}: {
  variant: NfcSessionStartVariant;
  overrideToNfc: boolean;
  onToggleOverride: () => void;
  onOpenAssignTags: () => void;
  onOpenSettings: () => void;
}) {
  if (variant === 'none') return null;

  if (variant === 'limited-ready') {
    return (
      <div className={styles.readinessNote}>
        {overrideToNfc ? (
          <p className={styles.readinessLine}>
            Vas a usar tags esta sesión ·{' '}
            <button className={styles.readinessLinkInline} onClick={onToggleOverride}>
              Cambiar
            </button>
          </p>
        ) : (
          <>
            <p className={styles.readinessLine}>
              Pocas prendas tienen tag todavía — vas a vender con botones.
            </p>
            <button className={styles.readinessLink} onClick={onToggleOverride}>
              Usar tags de todos modos
            </button>
          </>
        )}
      </div>
    );
  }

  if (variant === 'not-ready') {
    return (
      <div className={styles.readinessNote}>
        <p className={styles.readinessLine}>
          Todavía no tienes prendas con tag para hoy — vas a vender con botones.
        </p>
        <button className={styles.readinessLink} onClick={onOpenAssignTags}>
          Asignar tags
        </button>
      </div>
    );
  }

  if (variant === 'capability-revoked') {
    return (
      <div className={styles.readinessNote}>
        <p className={styles.readinessLine}>Por ahora no puedes vender con tags — vas a vender con botones.</p>
        <button className={styles.readinessLink} onClick={onOpenSettings}>
          Ir a Configuración
        </button>
      </div>
    );
  }

  // variant === 'ready-buttons-nudge'
  return (
    <div className={styles.readinessNote}>
      <p className={styles.readinessLine}>
        Ya tienes prendas con tag suficientes para vender con tags — actívalo cuando quieras en Configuración.
      </p>
      <button className={styles.readinessLink} onClick={onOpenSettings}>
        Ir a Configuración
      </button>
    </div>
  );
}
