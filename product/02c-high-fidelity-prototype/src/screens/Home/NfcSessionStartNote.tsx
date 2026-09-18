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
 * step (ask the OWNER) in place of the link.
 *
 * **The former fourth variant, `'ready-buttons-nudge'`, is retired
 * (2026-09-17, `decision-log.md` D72)** — it used to nudge a `buttons`-mode
 * Paid merchant toward `settings.md`'s "Cambiar a vender con tags," an
 * action D72 removes outright. `useNfcSessionStart.ts`'s own resolution can
 * no longer produce this variant, so this component has nothing left to
 * render for it — see that hook's own comment for the full reasoning.
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

  // variant === 'capability-revoked'
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
