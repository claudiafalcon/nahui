import { useStore } from '../../domain/store';
import { venuePerformance } from '../../domain/selectors';
import { pesos, pluralize } from '../../domain/format';
import { Button } from '../../components/Button/Button';
import type { ID } from '../../domain/types';
import styles from './Resultados.module.css';

/**
 * reports.md §3.9 (con datos) / §3.10 (sin eventos registrados) — one
 * component, branching on whether this Business has ever closed a
 * Session with a non-null `eventId` (§2 step 4's own sub-branch), the same
 * "empty state instead of a silently-blank list" pattern every other screen
 * in this doc family already applies.
 */
export function RendimientoPorBazar({
  onBack,
  onNavigateToEventos,
  onTapVenue,
}: {
  onBack: () => void;
  onNavigateToEventos: () => void;
  onTapVenue: (venueId: ID) => void;
}) {
  const { state } = useStore();
  const venues = venuePerformance(state);

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Resultados
        </button>
      </div>

      <div className={styles.scroll}>
        <h1 className={styles.title}>Rendimiento por bazar</h1>

        {venues.length === 0 ? (
          <>
            <p className={styles.emptyBody}>
              Esto se arma agrupando tus ventas por lugar, según los eventos que agendas en Eventos. Hasta ahora, todo lo
              que llevas cerrado son sesiones rápidas — no hay lugares que mostrar todavía.
            </p>
            <Button onClick={onNavigateToEventos}>Ver Eventos</Button>
          </>
        ) : (
          <ol className={styles.rankList}>
            {venues.map((v, i) => (
              <li key={v.venue.id}>
                <button className={styles.card} onClick={() => onTapVenue(v.venue.id)}>
                  <span className={styles.cardHeadline}>
                    {i + 1}. {v.venue.displayName}
                  </span>
                  <span className={styles.cardSub}>
                    {v.eventCount} {pluralize(v.eventCount, 'evento', 'eventos')} · {pesos(v.avgPerDay)} promedio/día
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
