import { useStore } from '../../domain/store';
import { dayNumberForDate, findEvent, findVenue, sessionProductBreakdown, sessionTotals } from '../../domain/selectors';
import { dateKey, formatDateRange } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import styles from './Resultados.module.css';

/**
 * reports.md §3.7 — Session detail, the leaf altitude every other screen in
 * this tab eventually drills down to (§2's "How the three altitudes
 * relate"). Reached from the main view's own En curso/Historial rows, from
 * Event detail's Día rows, or directly from Home's "Ver detalle" hand-off
 * (`home.md` §3.12) — same destination, same content, regardless of entry
 * point (`ResultadosScreen.tsx` resolves the correct `onBack` target for
 * each).
 */
export function SessionDetail({
  sessionId,
  onBack,
  backLabel = '← Resultados',
}: {
  sessionId: string;
  onBack: () => void;
  backLabel?: string;
}) {
  const { state } = useStore();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session) return null; // defensive — reached only from a row/hand-off naming a real sessionId

  const event = session.eventId ? findEvent(state, session.eventId) : undefined;
  const venueName = event ? findVenue(state, event.venueId)?.displayName : undefined;
  const sessionDateKey = dateKey(session.openedAt);
  const dayNumber = event ? dayNumberForDate(state, event.id, sessionDateKey) : undefined;
  const totals = sessionTotals(state, sessionId);
  const breakdown = sessionProductBreakdown(state, sessionId);

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          {backLabel}
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.header}>
          {/* "[Lugar] · Día N" when eventId is set, "Venta rápida" when it
              isn't — never "Session"/"Venue" on screen (architecture-
              principles.md #4). "Venta rápida," not the approved spec's own
              "Sesión rápida" — this build's disclosed, deliberate rename
              (README's "Demo Polish pass"), applied here to close a
              cross-tab collision with Home's own "Venta rápida" CTA/header
              (a merchant now flows Home → close → "Ver detalle" → here in
              one continuous action; the two screens must agree). */}
          <h1 className={styles.title}>{venueName ? `${venueName} · Día ${dayNumber}` : 'Venta rápida'}</h1>
          <p className={styles.subline}>{formatDateRange(sessionDateKey, sessionDateKey)}</p>
        </div>

        <p className={styles.rollup}>
          {totals.count} {pluralize(totals.count, 'venta', 'ventas')} · {pesos(totals.revenue)} en total
        </p>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Por producto:</p>
          {breakdown.length === 0 ? (
            <p className={styles.emptyBody}>Sin ventas registradas</p>
          ) : (
            breakdown.map((row) => (
              <p key={row.product.id} className={styles.breakdownRow}>
                <span>{row.product.name}</span>
                <span>{row.count}</span>
              </p>
            ))
          )}
        </div>
      </div>
    </>
  );
}
