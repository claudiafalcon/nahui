import type { MembershipRole } from '../../domain/types';
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
 *
 * **SELLER variants (Slice 12, `product-decisions.md` Q24/Q25):** every
 * OWNER-facing next-step link here points at a destination a SELLER cannot
 * reach (Inventario, full Configuración) — per this document's own §3.16
 * discipline, an unreachable destination is never shown as a live link.
 * Limited Ready is unchanged for both roles (a local, in-the-moment
 * override, not a Configuración/Inventario destination). Not Ready and
 * capability-revoked become a passive note naming the real, actionable next
 * step (ask the OWNER) in place of the link. The Ready-but-`buttons`
 * discoverability nudge is suppressed entirely for a SELLER — purely
 * discretionary, unactionable for her either way.
 */
export function NfcSessionStartNote({
  variant,
  role,
  overrideToNfc,
  onToggleOverride,
  onOpenAssignTags,
  onOpenSettings,
}: {
  variant: NfcSessionStartVariant;
  role: MembershipRole;
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
        {role === 'OWNER' ? (
          <button className={styles.readinessLink} onClick={onOpenAssignTags}>
            Asignar tags
          </button>
        ) : (
          <p className={styles.readinessLine}>Pídele a quien te invitó que etiquete mercancía.</p>
        )}
      </div>
    );
  }

  if (variant === 'capability-revoked') {
    return (
      <div className={styles.readinessNote}>
        <p className={styles.readinessLine}>Por ahora no puedes vender con tags — vas a vender con botones.</p>
        {role === 'OWNER' ? (
          <button className={styles.readinessLink} onClick={onOpenSettings}>
            Ir a Configuración
          </button>
        ) : (
          <p className={styles.readinessLine}>Solo quien te invitó puede activar esto.</p>
        )}
      </div>
    );
  }

  // variant === 'ready-buttons-nudge' — suppressed entirely for a SELLER
  if (role !== 'OWNER') return null;
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
