import { useStore } from '../../domain/store';
import { dayNumberForDate, findEvent, findVenue, sessionProductBreakdown, sessionTotals } from '../../domain/selectors';
import { dateKey } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import styles from './Resultados.module.css';

/**
 * `reports.md` §3.4b — "Sesión en vivo — detalle," reached by tapping a
 * §3.4a card (`VendiendoAhorita.tsx`). Reuses §3.7's exact layout
 * (`SessionDetail.tsx`'s header + total + "Por producto") — the spec's own
 * instruction is "the only difference is copy, marking every number as live
 * rather than final."
 *
 * **Genuinely read-only — no action of any kind.** No "cerrar," no
 * "entrar," no "ver más," nothing that could be mistaken for resuming,
 * closing, or acting on this Session — this is the load-bearing requirement
 * `reports.md` §3.4b states explicitly ("no CTA of any kind"), reinforcing
 * §1's own tab-wide rule ("no selling entry point of its own") and
 * `global-principles.md`'s "selling is a state, not a navigation
 * destination." Only affordance on this screen is "back."
 *
 * Back always returns to the Resultados tab root — its only two possible
 * parents, §3.3's cold-start Variant B and §3.4a's own card list, are both
 * the same `{ mode: 'main' }` view state in this build (`ResultadosScreen.tsx`
 * resolves cold start vs. the main view internally, from the identical
 * `mode: 'main'` case), so there is only ever one real back destination
 * here — unlike `SessionDetail.tsx`'s closed-Session sibling, which has
 * multiple distinct possible parents and carries a `returnTo` for that
 * reason.
 */
export function VendiendoAhoritaDetail({ sessionId, onBack }: { sessionId: string; onBack: () => void }) {
  const { state } = useStore();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session) return null; // defensive — reached only from a real, currently-active session's own card

  const event = session.eventId ? findEvent(state, session.eventId) : undefined;
  const venueName = event ? findVenue(state, event.venueId)?.displayName : undefined;
  const dayNumber = event ? dayNumberForDate(state, event.id, dateKey(session.openedAt)) : undefined;
  const totals = sessionTotals(state, sessionId);
  const breakdown = sessionProductBreakdown(state, sessionId);

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Resultados
        </button>
      </div>

      <div className={styles.scroll}>
        <div className={styles.header}>
          {/* "Venta rápida," not the approved spec's own "Sesión rápida" —
              same disclosed rename `SessionDetail.tsx`/`VendiendoAhorita.tsx`
              already apply to this identical header slot. */}
          <h1 className={styles.title}>{venueName ? `${venueName} · Día ${dayNumber}` : 'Venta rápida'}</h1>
          <p className={styles.subline}>Vendiendo ahorita</p>
        </div>

        <p className={styles.rollup}>
          {totals.count} {pluralize(totals.count, 'venta', 'ventas')} · {pesos(totals.revenue)} hasta ahorita
        </p>
        <p className={styles.emptyBody}>Los números todavía pueden cambiar.</p>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Por producto (hasta ahorita):</p>
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
