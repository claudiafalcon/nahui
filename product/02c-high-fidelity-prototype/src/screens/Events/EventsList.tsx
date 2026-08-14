import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import {
  dayNumberForDate,
  eventRollup,
  eventsForList,
  eventCompletedDays,
  findVenue,
} from '../../domain/selectors';
import { daysFromToday, eventSpanDays, formatShortDateRange, todayKey } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import { Button } from '../../components/Button/Button';
import { EVENT_TYPE_LABELS } from './eventTypeLabels';
import type { Event } from '../../domain/types';
import type { AppState } from '../../domain/types';
import styles from './EventsList.module.css';

/**
 * events.md §3.4/§3.5 — Events list. Each section header only renders when
 * it has ≥1 card (Activo is genuinely absent most days, §3.5) — the "fastest
 * interaction is the one that never happens," applied to reading.
 */
export function EventsList({
  onAgendar,
  onTapEvent,
  ambientMessage,
}: {
  onAgendar: () => void;
  onTapEvent: (eventId: string) => void;
  ambientMessage?: string | null;
}) {
  const { state } = useStore();
  const [toast, setToast] = useState<string | null>(ambientMessage ?? null);

  useEffect(() => {
    if (ambientMessage) {
      setToast(ambientMessage);
      const t = window.setTimeout(() => setToast(null), 2400);
      return () => window.clearTimeout(t);
    }
  }, [ambientMessage]);

  const { activo, proximos, pasados } = eventsForList(state);

  function headline(event: Event): string {
    const venueName = findVenue(state, event.venueId)?.displayName ?? '';
    return `${venueName} · ${EVENT_TYPE_LABELS[event.type]}`;
  }

  function activoSubtitle(event: Event): string {
    const dayNumber = dayNumberForDate(state, event.id, todayKey());
    const span = eventSpanDays(event.startDate, event.endDate);
    return `Día ${dayNumber} de ${span} · ${formatShortDateRange(event.startDate, event.endDate)}`;
  }

  function proximoSubtitle(event: Event): string {
    const n = daysFromToday(event.startDate);
    if (n <= 0) return 'empieza hoy';
    return `empieza en ${n} ${pluralize(n, 'día', 'días')}`;
  }

  function pasadoSubtitle(event: Event): string {
    const days = eventCompletedDays(state, event.id);
    if (days === 0) return 'Sin ventas registradas';
    const { sales, revenue } = eventRollup(state, event.id);
    return `${days} ${pluralize(days, 'día', 'días')} · ${sales} ${pluralize(sales, 'venta', 'ventas')} · ${pesos(revenue)}`;
  }

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Eventos</span>
      </div>
      {toast && <p className={styles.confirmation}>{toast} ✓</p>}

      <div className={styles.scroll}>
        {activo.length > 0 && (
          <>
            <p className={styles.sectionLabel}>Activo</p>
            {activo.map((event) => (
              <button key={event.id} className={styles.card} onClick={() => onTapEvent(event.id)}>
                <span className={styles.cardHeadline}>{headline(event)}</span>
                <span className={styles.cardSub}>{activoSubtitle(event)}</span>
              </button>
            ))}
          </>
        )}

        {proximos.length > 0 && (
          <>
            <p className={styles.sectionLabel}>Próximos</p>
            {proximos.map((event) => (
              <button key={event.id} className={styles.card} onClick={() => onTapEvent(event.id)}>
                <span className={styles.cardHeadline}>{headline(event)}</span>
                <span className={styles.cardSub}>{proximoSubtitle(event)}</span>
              </button>
            ))}
          </>
        )}

        {pasados.length > 0 && (
          <>
            <p className={styles.sectionLabel}>Pasados</p>
            {pasados.map((event) => (
              <button key={event.id} className={styles.card} onClick={() => onTapEvent(event.id)}>
                <span className={styles.cardHeadline}>{headline(event)}</span>
                <span className={styles.cardSub}>{pasadoSubtitle(event)}</span>
              </button>
            ))}
          </>
        )}
      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button onClick={onAgendar}>Agendar evento</Button>
      </div>
    </>
  );
}

// re-exported for EventsScreen's own cold-start test — avoids computing
// eventsForList twice for the same render.
export function hasAnyVisibleEvent(state: AppState): boolean {
  const { activo, proximos, pasados } = eventsForList(state);
  return activo.length + proximos.length + pasados.length > 0;
}
