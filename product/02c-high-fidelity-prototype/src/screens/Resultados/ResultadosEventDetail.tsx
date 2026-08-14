import { useStore } from '../../domain/store';
import {
  eventCompletedDays,
  eventDayRows,
  eventProductBreakdown,
  eventRollup,
  findEvent,
  findVenue,
  sessionIdForEventDate,
} from '../../domain/selectors';
import { formatDateRange, formatShortDate } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import { EVENT_TYPE_LABELS } from '../Events/eventTypeLabels';
import type { ID } from '../../domain/types';
import styles from './Resultados.module.css';

/**
 * reports.md §3.8 — Event detail (closed), the exact content `events.md`
 * §3.16/§10 deliberately removed from Eventos per Q7's resolution: passive
 * identity there, the full day-by-day + Por-producto breakdown here. Always
 * a closed Event by construction — every path that reaches this screen
 * (Historial's own Event-rollup card, `events.md`'s "Ver resumen en
 * Resultados" hand-off, a "Rendimiento por bazar" venue drill-down) only
 * ever names a closed `eventId` (§2's own "an Event that closed with zero
 * Sessions never reaches this list" rule, and Eventos' own hand-off only
 * ever offers this CTA on a closed Event).
 */
export function ResultadosEventDetail({
  eventId,
  onBack,
  backLabel,
  onTapDay,
}: {
  eventId: string;
  onBack: () => void;
  backLabel: string;
  onTapDay: (sessionId: ID) => void;
}) {
  const { state } = useStore();
  const event = findEvent(state, eventId);
  if (!event) return null; // defensive — reached only from a card/link naming a real eventId

  const venueName = findVenue(state, event.venueId)?.displayName ?? '';
  const typeLabel = EVENT_TYPE_LABELS[event.type];
  const days = eventCompletedDays(state, eventId);
  const { sales, revenue } = eventRollup(state, eventId);
  const dayRows = eventDayRows(state, eventId);
  const breakdown = eventProductBreakdown(state, eventId);

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          {backLabel}
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.header}>
          <h1 className={styles.title}>{venueName}</h1>
          <p className={styles.subline}>
            {typeLabel} · {formatDateRange(event.startDate, event.endDate)}
          </p>
        </div>

        {days === 0 ? (
          <p className={styles.emptyBody}>No registraste ventas en este evento.</p>
        ) : (
          <>
            <p className={styles.rollup}>
              {days} {pluralize(days, 'día', 'días')} · {sales} {pluralize(sales, 'venta', 'ventas')} · {pesos(revenue)}
            </p>

            <div className={styles.dayRows}>
              {dayRows.map((r) => {
                const sessionId = sessionIdForEventDate(state, eventId, r.dateKey);
                return (
                  <button
                    key={r.dateKey}
                    className={styles.dayRow}
                    disabled={!sessionId}
                    onClick={() => sessionId && onTapDay(sessionId)}
                  >
                    Día {r.dayNumber} · {formatShortDate(r.dateKey)} · {r.sales} {pluralize(r.sales, 'venta', 'ventas')} ·{' '}
                    {pesos(r.revenue)}
                  </button>
                );
              })}
            </div>

            <div className={styles.section}>
              <p className={styles.sectionLabel}>Por producto (todo el evento):</p>
              {breakdown.map((row) => (
                <p key={row.product.id} className={styles.breakdownRow}>
                  <span>{row.product.name}</span>
                  <span>{row.count}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
