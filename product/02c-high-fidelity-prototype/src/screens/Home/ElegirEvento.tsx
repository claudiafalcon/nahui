import { dayNumberForDate, findVenue } from '../../domain/selectors';
import { todayKey } from '../../domain/dates';
import { useStore } from '../../domain/store';
import type { Event } from '../../domain/types';
import styles from './ElegirEvento.module.css';

/**
 * home.md §3.6b "Elegir evento" — reached only via §2 step 2b (2+
 * simultaneously `active` Events, no same-day signal yet for this device's
 * own acting Membership). Tapping a row is the entire interaction — no
 * separate confirm screen; it hands off directly into that Event's own
 * §3.6 ("Continuar Día N"), which is where the Session actually opens.
 */
export function ElegirEvento({
  events,
  headerIcon,
  onOpenAccountSurface,
  onSelect,
}: {
  events: Event[];
  /** home.md §3.15 — role-scoped header icon, applied here too (§3.15's own
   * governing rule: "wherever a persistent header renders, every state
   * currently showing ⚙"). */
  headerIcon: '⚙' | '⊚';
  onOpenAccountSurface: () => void;
  onSelect: (eventId: string) => void;
}) {
  const { state } = useStore();
  const today = todayKey();
  // Row order: by Event.startDate ascending — a plain, deterministic
  // tiebreak, never merchant-sorted.
  const rows = events.slice().sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button
          className={styles.gearBtn}
          onClick={onOpenAccountSurface}
          aria-label={headerIcon === '⚙' ? 'Configuración' : 'Tu cuenta'}
        >
          {headerIcon}
        </button>
      </div>
      <div className={styles.wrap}>
        <h1 className={styles.question}>¿Dónde vas a vender hoy?</h1>
        <div className={styles.list}>
          {rows.map((event) => {
            const venueName = findVenue(state, event.venueId)?.displayName ?? '';
            const dayNumber = dayNumberForDate(state, event.id, today);
            return (
              <button key={event.id} className={styles.row} onClick={() => onSelect(event.id)}>
                {venueName} · Día {dayNumber}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
