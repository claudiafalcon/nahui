import { dayNumberForDate, findVenue } from '../../domain/selectors';
import { todayKey } from '../../domain/dates';
import { useStore } from '../../domain/store';
import { pesos, pluralize } from '../../domain/format';
import type { Event, MembershipRole } from '../../domain/types';
import { useNfcSessionStart } from './useNfcSessionStart';
import { NfcSessionStartNote } from './NfcSessionStartNote';
import { Button } from '../../components/Button/Button';
import styles from './ElegirEvento.module.css';

/**
 * home.md §3.6b "Elegir evento" — reached only via §2 step 2b (2+
 * simultaneously `active` Events, no same-day signal yet for this device's
 * own acting Membership). Tapping a row is the entire interaction — no
 * separate confirm screen; it hands off directly into that Event's own
 * §3.6 ("Continuar Día N"), which is where the Session actually opens.
 *
 * **Secondary "Iniciar Sesión Rápida" action (§3.6b, 2026-09-15 amendment —
 * same fix as §3.6's own, closing this screen's own "Iniciar Sesión Rápida
 * stays reachable" claim that was never actually rendered).** Cross-
 * referenced verbatim from §3.4's own primary action (this build's own
 * "Iniciar Venta Rápida" naming — see `Idle.tsx`'s own naming note), opening
 * a Quick Session independent of every Event row listed above. Rendered
 * beneath the Event row list, `variant="secondary"` — the identical
 * primary/secondary composition `EventResume.tsx`'s own new secondary CTA
 * (and `inventory.md` §3.5/§3.17's built precedent) already establish.
 * Shares one `useNfcSessionStart` instance with every row's own
 * "Continuar Día N" hand-off (§3.6a's own "widened" 2026-09-15 note — one
 * ambient, once-per-Home-open computation, regardless of which action on
 * this screen is eventually tapped); `overrideToNfc` threads through
 * `onStartQuickSession` at the moment of this tap.
 *
 * **Stacking order (§3.6b's own worked composition):** row list →
 * Quick-Session same-day-sales line (cross-referenced from §3.4's identical
 * condition) → secondary CTA + the on-screen independence signal ("No se
 * cuenta para ningún evento de arriba," static caption, never a button),
 * grouped together in `.secondaryActionGroup` as of the 2026-09-15
 * remediation (ux-critic MAJOR-1) → `NfcSessionStartNote`.
 */
export function ElegirEvento({
  role,
  events,
  headerIcon,
  quickSessionTodaySales,
  onOpenAccountSurface,
  onSelect,
  onStartQuickSession,
  onOpenAssignTagsPlaceholder,
}: {
  role: MembershipRole;
  events: Event[];
  /** home.md §3.15 — role-scoped header icon, applied here too (§3.15's own
   * governing rule: "wherever a persistent header renders, every state
   * currently showing ⚙"). */
  headerIcon: '⚙' | '⊚';
  /** §3.6b's own Quick-Session same-day-resume line — cross-referenced from
   * §3.4's identical condition, resolved once in `HomeScreen.tsx` and passed
   * down, never recomputed here. */
  quickSessionTodaySales?: { total: number; count: number } | null;
  onOpenAccountSurface: () => void;
  onSelect: (eventId: string) => void;
  /** §3.6b's new secondary action (2026-09-15) — identical call shape to
   * `EventResume.tsx`'s own `onStartQuickSession`, always opening with
   * `eventId = null`. */
  onStartQuickSession: (overrideToNfc: boolean) => void;
  /** §3.6a's "Asignar tags" link, forwarded into `NfcSessionStartNote`. */
  onOpenAssignTagsPlaceholder: () => void;
}) {
  const { state } = useStore();
  const today = todayKey();
  const { variant, overrideToNfc, toggleOverride } = useNfcSessionStart();
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
        {quickSessionTodaySales && (
          <p className={styles.todaySalesLine}>
            Ya vendiste {pesos(quickSessionTodaySales.total)} ·{' '}
            {quickSessionTodaySales.count} {pluralize(quickSessionTodaySales.count, 'venta', 'ventas')} hoy
          </p>
        )}
        <div className={styles.secondaryActionGroup}>
          <Button variant="secondary" onClick={() => onStartQuickSession(overrideToNfc)}>
            Iniciar Venta Rápida
          </Button>
          <p className={styles.qualifyingLine}>No se cuenta para ningún evento de arriba</p>
        </div>
        <NfcSessionStartNote
          variant={variant}
          role={role}
          overrideToNfc={overrideToNfc}
          onToggleOverride={toggleOverride}
          onOpenAssignTags={onOpenAssignTagsPlaceholder}
          onOpenSettings={onOpenAccountSurface}
        />
      </div>
    </>
  );
}
