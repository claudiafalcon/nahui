import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { daysFromToday } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import { useNfcSessionStart } from './useNfcSessionStart';
import { NfcSessionStartNote } from './NfcSessionStartNote';
import styles from './Idle.module.css';

/** home.md §3.4/§3.5 — idle, ready to sell, no Session open yet. Same
 * elements the approved spec calls for (greeting question, the primary CTA,
 * §3.5's optional upcoming-Event card) — composition below is a
 * High-Fidelity revision: an asymmetric layout anchored by an oversized,
 * softly-tinted BrandMark watermark instead of a perfectly centered stack
 * floating in empty space. Reuses Nahui's own mark at a different scale
 * (already established in ColdStart) rather than inventing a new decorative
 * device for this screen alone.
 *
 * CTA copy: "Iniciar Venta Rápida," not the approved spec's own "Iniciar
 * Sesión Rápida" — a Demo Polish-pass naming decision, see README "Naming —
 * Venta rápida (2026-08-13)."
 *
 * **Upcoming-Event card (§3.5, Eventos pass D43).** Visually secondary and
 * tappable only into Eventos' own detail screen — never into starting a
 * Session — so scheduling awareness stays read-only and can never add a
 * step to Quick Session ("Quick Session works regardless," domain-model.md).
 * "Iniciar Venta Rápida" keeps full prominence with or without the card.
 *
 * **§3.6a (NFC Selling pass, D43) — all four Session-start variants are now
 * real**, via the shared `useNfcSessionStart`/`NfcSessionStartNote` pair
 * (see those files' own doc comments): Limited Ready (inline override),
 * Not Ready, capability revoked, and the one-time Ready-but-`buttons`
 * discoverability nudge. `overrideToNfc` — Limited Ready's own local
 * override choice — is threaded through `onStartSession` at the moment of
 * *this* tap (§6's footnote: "before the existing Session-start tap"),
 * never gating or delaying it. "Asignar tags" routes into Inventario's real
 * Asignar Tags queue (`inventory.md` §3.14, via
 * `onOpenAssignTagsPlaceholder`, unrenamed from the Asignar Tags pass to
 * keep that diff scoped) instead of a Home-local Placeholder stub.
 *
 * **Same-day resume line (§3.4/§3.5, closes `architect-questions.md` Q19).**
 * `todaySales` is `todaySalesSummary(state, null)` — the Quick Session scope
 * (`Session.eventId === null`) — resolved once in `HomeScreen.tsx` and
 * passed down, never recomputed here. Renders only when non-null (1+
 * finalized Sales already exist today under a Quick Session), between the
 * greeting and the primary CTA, exactly the position both wireframes show —
 * pixel-identical to the base state otherwise.
 *
 * **Direct gear (⚙) entry point (settings.md §2.1; amended 2026-08-15 — see
 * home.md's own status header/§2/§3.6c).** Previously a "⋯" icon opening a
 * one-row Sheet ("⚙ Configuración" only) — that intermediate sheet is now
 * retired here too (already retired for the active-Session header a day
 * earlier, SessionHeader.tsx): the gear icon calls `onOpenSettings` directly,
 * no `Sheet`, no `menuOpen` state. Same shape as §3.6a's own gear icon below
 * (`NfcSessionStartNote`'s "Ir a Configuración" link is a separate,
 * secondary affordance, unaffected by this change). */
export function Idle({
  upcomingEventVenueName,
  upcomingEventStartDate,
  onTapUpcomingEvent,
  todaySales,
  onStartSession,
  onOpenSettings,
  onOpenAssignTagsPlaceholder,
}: {
  upcomingEventVenueName?: string;
  upcomingEventStartDate?: string;
  onTapUpcomingEvent?: () => void;
  todaySales?: { total: number; count: number } | null;
  /** NFC Selling pass (D43) — `overrideToNfc` is whatever
   * `useNfcSessionStart`'s own local override state currently reads at the
   * moment of this tap (always `false` outside the Limited Ready variant). */
  onStartSession: (overrideToNfc: boolean) => void;
  onOpenSettings: () => void;
  onOpenAssignTagsPlaceholder: () => void;
}) {
  const { variant, overrideToNfc, toggleOverride } = useNfcSessionStart();
  const showUpcomingCard = Boolean(upcomingEventVenueName && upcomingEventStartDate && onTapUpcomingEvent);

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button className={styles.gearBtn} onClick={onOpenSettings} aria-label="Configuración">
          ⚙
        </button>
      </div>
      <div className={styles.wrap}>
        <div className={styles.watermark} aria-hidden="true">
          <BrandMark size={340} color="var(--color-blush)" />
        </div>
        <div className={styles.content}>
          {showUpcomingCard && (
            <button className={styles.upcomingCard} onClick={onTapUpcomingEvent}>
              <span className={styles.upcomingVenue}>{upcomingEventVenueName}</span>
              <span className={styles.upcomingCountdown}>
                {daysFromToday(upcomingEventStartDate!) <= 0
                  ? 'empieza hoy'
                  : `empieza en ${daysFromToday(upcomingEventStartDate!)} ${
                      daysFromToday(upcomingEventStartDate!) === 1 ? 'día' : 'días'
                    }`}
              </span>
            </button>
          )}
          <h1 className={styles.question}>¿Vas a vender hoy?</h1>
          {todaySales && (
            <p className={styles.todaySalesLine}>
              Ya vendiste {pesos(todaySales.total)} · {todaySales.count} {pluralize(todaySales.count, 'venta', 'ventas')} hoy
            </p>
          )}
          <Button className={styles.cta} onClick={() => onStartSession(overrideToNfc)}>
            Iniciar Venta Rápida
          </Button>
          <NfcSessionStartNote
            variant={variant}
            overrideToNfc={overrideToNfc}
            onToggleOverride={toggleOverride}
            onOpenAssignTags={onOpenAssignTagsPlaceholder}
            onOpenSettings={onOpenSettings}
          />
        </div>
      </div>
    </>
  );
}
