import { useStore } from '../../domain/store';
import { eventCompletedDays, eventRollup, findVenue, venueHistorialRows, venuePerformance } from '../../domain/selectors';
import { pesos, pluralize } from '../../domain/format';
import { EVENT_TYPE_LABELS } from '../Events/eventTypeLabels';
import type { ID } from '../../domain/types';
import styles from './Resultados.module.css';

/**
 * reports.md §3.11 — "Rendimiento por bazar" venue drill-down: Historial
 * filtered to this Venue's closed Events only, the same Event-rollup card
 * shape already used everywhere else in this tab (§3.4/§3.5/§3.6), not a new
 * screen type. Quick Sessions never appear here (they have no `venueId` to
 * filter by), same as they never contribute to `venuePerformance`'s own
 * aggregate.
 */
export function VenueDetail({
  venueId,
  onBack,
  onTapEvent,
}: {
  venueId: string;
  onBack: () => void;
  onTapEvent: (eventId: ID) => void;
}) {
  const { state } = useStore();
  const venue = findVenue(state, venueId);
  if (!venue) return null; // defensive — reached only from a row naming a real venueId

  const perf = venuePerformance(state).find((v) => v.venue.id === venueId);
  const events = venueHistorialRows(state, venueId);

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Rendimiento por bazar
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.header}>
          <h1 className={styles.title}>{venue.displayName}</h1>
          {perf && (
            <p className={styles.subline}>
              {perf.eventCount} {pluralize(perf.eventCount, 'evento', 'eventos')} · {pesos(perf.avgPerDay)} promedio/día
            </p>
          )}
        </div>

        {events.map((event) => {
          const days = eventCompletedDays(state, event.id);
          const { sales, revenue } = eventRollup(state, event.id);
          return (
            <button key={event.id} className={styles.card} onClick={() => onTapEvent(event.id)}>
              <span className={styles.cardHeadline}>
                {venue.displayName} · {EVENT_TYPE_LABELS[event.type]}
              </span>
              <span className={styles.cardSub}>
                {days} {pluralize(days, 'día', 'días')} · {sales} {pluralize(sales, 'venta', 'ventas')} · {pesos(revenue)}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
