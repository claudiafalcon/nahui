import { useState } from 'react';
import { useStore } from '../../domain/store';
import {
  activeSessionForEvent,
  dayNumberForDate,
  eventCompletedDays,
  eventDayRows,
  eventRollup,
  eventStatus,
  findEvent,
  findVenue,
  todaySalesSummary,
} from '../../domain/selectors';
import { daysFromToday, formatDateRange, formatShortDate, todayKey } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { Placeholder } from '../../components/Placeholder/Placeholder';
import { AdjustPrices } from './AdjustPrices';
import { EVENT_TYPE_LABELS } from './eventTypeLabels';
import styles from './EventDetail.module.css';

type SubView = 'main' | 'cancel-confirm' | 'adjust-prices' | 'resultados-placeholder';

/**
 * events.md §3.11/§3.12/§3.14/§3.15/§3.16/§3.17 — Event detail, across every
 * status. Status is read live (`eventStatus`, never a stored field, §2) —
 * this component branches on that read, it never receives a status prop.
 */
export function EventDetail({
  eventId,
  onBack,
  onNavigateToHoy,
  onCancelled,
}: {
  eventId: string;
  onBack: () => void;
  onNavigateToHoy: () => void;
  onCancelled: () => void;
}) {
  const { state, startSession, cancelEvent } = useStore();
  const [subView, setSubView] = useState<SubView>('main');

  const event = findEvent(state, eventId);
  if (!event) return null; // defensive — reached only from a card/link naming a real eventId

  const venueName = findVenue(state, event.venueId)?.displayName ?? '';
  const typeLabel = EVENT_TYPE_LABELS[event.type];
  const status = eventStatus(event);
  const today = todayKey();

  function handleContinue() {
    startSession(event!.id); // safe no-op if a Session under this Event is already active
    onNavigateToHoy();
  }

  if (subView === 'adjust-prices') {
    return <AdjustPrices eventId={event.id} venueName={venueName} onBack={() => setSubView('main')} />;
  }

  if (subView === 'resultados-placeholder') {
    return (
      <Placeholder
        title="Resultados"
        onBack={() => setSubView('main')}
        backLabel="← Volver al evento"
      />
    );
  }

  const costLine = event.bazaarCost > 0 ? `Costo: ${pesos(event.bazaarCost)}` : null;

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Eventos
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.header}>
          <h1 className={styles.venue}>{venueName}</h1>
          {status === 'scheduled' ? (
            <p className={styles.subline}>
              {typeLabel} · {daysFromToday(event.startDate) <= 0 ? 'empieza hoy' : `empieza en ${daysFromToday(event.startDate)} ${pluralize(daysFromToday(event.startDate), 'día', 'días')}`}
            </p>
          ) : (
            <p className={styles.subline}>{typeLabel}</p>
          )}
          <p className={styles.subline}>{formatDateRange(event.startDate, event.endDate)}</p>
          {costLine && <p className={styles.cost}>{costLine}</p>}
        </div>

        {status === 'scheduled' && (
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setSubView('adjust-prices')}>
              Ajustar precios
            </Button>
            <Button variant="secondary" onClick={() => setSubView('cancel-confirm')}>
              Cancelar evento
            </Button>
          </div>
        )}

        {(status === 'active' || status === 'closed') && (
          <ActiveOrClosedBody
            eventId={event.id}
            status={status}
            today={today}
            onContinue={handleContinue}
            onViewResultados={() => setSubView('resultados-placeholder')}
          />
        )}
      </div>

      {subView === 'cancel-confirm' && (
        <Sheet onDismiss={() => setSubView('main')}>
          <p className={styles.confirmTitle}>¿Cancelar el evento en {venueName}?</p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setSubView('main')}>
              No, mantenerlo
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                cancelEvent(event!.id);
                onCancelled();
              }}
            >
              Sí, cancelarlo
            </Button>
          </div>
        </Sheet>
      )}
    </>
  );
}

/** §3.14/§3.15 (active) and §3.16/§3.17 (closed) share the same "Día rows +
 * one bottom action" shape, differing only in which rows/action render —
 * split out to keep `EventDetail`'s own branching readable. */
function ActiveOrClosedBody({
  eventId,
  status,
  today,
  onContinue,
  onViewResultados,
}: {
  eventId: string;
  status: 'active' | 'closed';
  today: string;
  onContinue: () => void;
  onViewResultados: () => void;
}) {
  const { state } = useStore();

  if (status === 'active') {
    const activeSession = activeSessionForEvent(state, eventId);
    const rows = eventDayRows(state, eventId).filter((r) => r.dateKey !== today);
    const dayNumber = dayNumberForDate(state, eventId, today);
    // events.md §3.14 same-day-resume amendment (architect-questions.md
    // Q19) — "no Session opened today" is specifically the !activeSession
    // branch below (§3.15's "Vendiendo ahora" already reads a live,
    // in-progress Session on its own terms, so this row is scoped out of
    // that branch, not duplicated into it).
    const todaySales = !activeSession ? todaySalesSummary(state, eventId) : null;

    return (
      <>
        {(rows.length > 0 || todaySales) && (
          <div className={styles.dayRows}>
            {rows.map((r) => (
              <p key={r.dateKey} className={styles.dayRow}>
                Día {r.dayNumber} · {formatShortDate(r.dateKey)} · {r.sales} {pluralize(r.sales, 'venta', 'ventas')} ·{' '}
                {pesos(r.revenue)}
              </p>
            ))}
            {todaySales && (
              <p className={styles.dayRow}>
                Hoy (Día {dayNumber}) · {pesos(todaySales.total)} · {todaySales.count}{' '}
                {pluralize(todaySales.count, 'venta', 'ventas')} hasta ahora
              </p>
            )}
          </div>
        )}
        {activeSession ? (
          <Button variant="secondary" onClick={onContinue}>
            Vendiendo ahora · Día {dayNumber} ▸
          </Button>
        ) : (
          <Button onClick={onContinue}>Continuar Día {dayNumber}</Button>
        )}
      </>
    );
  }

  // closed
  const days = eventCompletedDays(state, eventId);
  if (days === 0) {
    return <p className={styles.emptyBody}>No registraste ventas en este evento.</p>;
  }
  const { sales, revenue } = eventRollup(state, eventId);
  return (
    <>
      <p className={styles.rollup}>
        {days} {pluralize(days, 'día', 'días')} · {sales} {pluralize(sales, 'venta', 'ventas')} · {pesos(revenue)}
      </p>
      <Button variant="secondary" onClick={onViewResultados}>
        Ver resumen en Resultados
      </Button>
    </>
  );
}
