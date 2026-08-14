import { useStore } from '../../domain/store';
import {
  allTimeTotals,
  enCursoRows,
  eventCompletedDays,
  eventRollup,
  findVenue,
  historialRows,
  salesTrend,
  sessionTotals,
  topProductsAllTime,
  venuePerformance,
} from '../../domain/selectors';
import { formatShortDate } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import { EVENT_TYPE_LABELS } from '../Events/eventTypeLabels';
import type { ID } from '../../domain/types';
import styles from './Resultados.module.css';

/**
 * reports.md §3.4 (free tier, En curso present) / §3.5 (free tier, no En
 * curso) / §3.6 (paid tier) — one component covers all three states, the
 * same way `EventsList` covers Activo/Próximos/Pasados by simply omitting
 * empty sections rather than branching into three components (§3.4's own
 * "section headers only render when they have ≥1 card" rule, reused here
 * verbatim).
 */
export function ResultadosMain({
  onTapSession,
  onTapEvent,
  onOpenRendimiento,
  onOpenTusClientes,
}: {
  onTapSession: (sessionId: ID) => void;
  onTapEvent: (eventId: ID) => void;
  onOpenRendimiento: () => void;
  onOpenTusClientes: () => void;
}) {
  const { state } = useStore();
  if (!state.business) return null; // defensive — this tab only mounts once onboarding is complete

  const paid = state.business.subscriptionTier === 'paid';
  const totals = allTimeTotals(state);
  // Graceful degradation at zero sales (§3.4's own bullet) — a closed
  // Session with nothing sold is a real, modeled outcome (events.md §3.17's
  // own zero-Sale precedent), never rendered as a misleading "$0 ticket
  // promedio."
  const ticketPromedio = totals.count > 0 ? Math.round(totals.revenue / totals.count) : null;
  const top = topProductsAllTime(state);
  const trend = totals.count > 0 ? salesTrend(state) : null;
  const trendDiff = trend ? trend.thisWeek - trend.lastWeek : null;
  const enCurso = enCursoRows(state);
  const historial = historialRows(state);
  const venues = paid ? venuePerformance(state) : [];

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Resultados</span>
      </div>

      <div className={styles.scroll}>
        <div className={styles.hero}>
          <p className={styles.heroLabel}>Total histórico</p>
          <p className={styles.heroValue}>
            {totals.count} {pluralize(totals.count, 'venta', 'ventas')} · <strong>{pesos(totals.revenue)}</strong>
            {ticketPromedio != null && ` · ${pesos(ticketPromedio)} ticket promedio`}
          </p>
        </div>

        {/* Two headline-level paired-fact statements (§3.4's own "same
            visual priority as Total histórico" instruction) — omitted
            entirely at zero sales (no product/trend to state), and each
            renders independently of the other (§3.4: "if only one of the two
            statements has data to state, the other renders alone"). */}
        {(top.length > 0 || trend) && (
          <div className={styles.headline}>
            {top.length > 0 && (
              <p className={styles.headlineLine}>
                Tu producto estrella: {top[0].product.name}, con {top[0].count}{' '}
                {pluralize(top[0].count, 'pieza vendida', 'piezas vendidas')} en total.
              </p>
            )}
            {trend && (
              <p className={styles.headlineLine}>
                {trendDiff === 0
                  ? 'Esta semana vendiste la misma cantidad de ventas que la semana pasada.'
                  : trendDiff! > 0
                    ? `Esta semana vendiste ${trendDiff} ${pluralize(trendDiff!, 'venta más', 'ventas más')} que la semana pasada.`
                    : `Esta semana vendiste ${Math.abs(trendDiff!)} ${pluralize(Math.abs(trendDiff!), 'venta menos', 'ventas menos')} que la semana pasada.`}
              </p>
            )}
          </div>
        )}

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Top productos · todo tu historial</p>
          {top.length === 0 ? (
            <p className={styles.emptyNote}>Sin ventas registradas</p>
          ) : (
            <ol className={styles.rankList}>
              {top.map((row, i) => (
                <li key={row.product.id} className={styles.rankRow}>
                  <span>
                    {i + 1}. {row.product.name}
                  </span>
                  <span>{row.count}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {paid && (
          <>
            <button className={styles.teaserRow} onClick={onOpenRendimiento}>
              <span className={styles.teaserHeader}>
                <span className={styles.teaserTitle}>Rendimiento por bazar</span>
                <span className={styles.teaserLink}>Ver más ▸</span>
              </span>
              <span className={styles.teaserBody}>
                {venues.length > 0
                  ? `${venues[0].venue.displayName} · ${pesos(venues[0].avgPerDay)}/día`
                  : 'Aún no hay bazares para mostrar'}
              </span>
            </button>

            {/* `Customer`/`Claim` aren't modeled anywhere in this build's
                domain layer (Gap Analysis finding, disclosed in README) — so
                every paid Business is structurally the zero-Claims case
                (§3.6's own "Aún no hay datos suficientes" teaser, D40),
                never the populated one. This is the honest, only-reachable
                state, not a placeholder. */}
            <button className={styles.teaserRow} onClick={onOpenTusClientes}>
              <span className={styles.teaserHeader}>
                <span className={styles.teaserTitle}>Tus clientes</span>
                <span className={styles.teaserLink}>Ver más ▸</span>
              </span>
              <span className={styles.teaserBody}>Aún no hay datos suficientes</span>
            </button>
          </>
        )}

        {enCurso.length > 0 && (
          <div className={styles.section}>
            <p className={styles.sectionLabel}>En curso</p>
            {enCurso.map(({ event, dayRows }) => {
              const venueName = findVenue(state, event.venueId)?.displayName ?? '';
              return (
                <div key={event.id} className={`${styles.card} ${styles.enCursoCard}`}>
                  <p className={styles.cardHeadline}>{venueName}</p>
                  <div className={styles.dayRows}>
                    {dayRows.map((r) => (
                      <button
                        key={r.dateKey}
                        className={styles.dayRow}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTapSession(r.sessionId);
                        }}
                      >
                        Día {r.dayNumber} · {formatShortDate(r.dateKey)} · {r.sales} {pluralize(r.sales, 'venta', 'ventas')} ·{' '}
                        {pesos(r.revenue)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Historial</p>
          {historial.length === 0 ? (
            <p className={styles.emptyNote}>Todavía no tienes días cerrados que mostrar aquí.</p>
          ) : (
            historial.map((row) => {
              if (row.kind === 'event') {
                const venueName = findVenue(state, row.event.venueId)?.displayName ?? '';
                const days = eventCompletedDays(state, row.event.id);
                const { sales, revenue } = eventRollup(state, row.event.id);
                return (
                  <button key={row.event.id} className={styles.card} onClick={() => onTapEvent(row.event.id)}>
                    <span className={styles.cardHeadline}>
                      {venueName} · {EVENT_TYPE_LABELS[row.event.type]}
                    </span>
                    <span className={styles.cardSub}>
                      {days} {pluralize(days, 'día', 'días')} · {sales} {pluralize(sales, 'venta', 'ventas')} · {pesos(revenue)}
                    </span>
                  </button>
                );
              }
              const t = sessionTotals(state, row.session.id);
              return (
                <button key={row.session.id} className={styles.card} onClick={() => onTapSession(row.session.id)}>
                  {/* "Venta rápida," not the approved spec's own "Sesión
                      rápida" — this build's disclosed rename, applied here
                      for the same cross-tab-consistency reason as
                      SessionDetail.tsx's own headline (README's "Resultados
                      pass" fix round). */}
                  <span className={styles.cardHeadline}>Venta rápida · {formatShortDate(row.sortKey)}</span>
                  <span className={styles.cardSub}>
                    {t.count} {pluralize(t.count, 'venta', 'ventas')} · {pesos(t.revenue)}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {!paid && (
          <div className={styles.noteCard}>
            <p>
              Con el plan de pago vas a ver cómo te fue por bazar y cuántas de tus clientas son frecuentes y cuántas
              ocasionales.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
