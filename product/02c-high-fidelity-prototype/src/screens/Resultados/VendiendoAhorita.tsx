import { useStore } from '../../domain/store';
import {
  activeSessionsForBusiness,
  dayNumberForDate,
  findEvent,
  findVenue,
  membershipById,
  sessionTotals,
} from '../../domain/selectors';
import { dateKey } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import type { ID } from '../../domain/types';
import styles from './Resultados.module.css';

/**
 * `reports.md` §2/§3.4a — "Vendiendo ahorita" (`decision-log.md` D68): a
 * Business-wide, cross-Session, cross-device read of every Session with
 * `status = 'active'` right now. Renders at the very top of every Resultados
 * state — above "Total histórico" in the main view (§3.4/§3.5/§3.6,
 * `ResultadosMain.tsx`) and above the cold-start message's own Variant B
 * (§3.3, `ResultadosColdStart.tsx`). One shared component for both call
 * sites so they can never drift from each other — "same placement, same
 * card content, same condition" (§3.3's own annotation about its own
 * illustrative card).
 *
 * Absent entirely (returns `null`) whenever no Session is active anywhere on
 * this Business — "no placeholder line, same restraint step 2's 'En curso'
 * already applies to its own absence" (§2). A caller can render this
 * unconditionally.
 *
 * Shipped as free-tier and paid-tier alike for now — tier placement is a
 * genuinely open Product Decision, not settled here (§1, §8 item 11,
 * `product-decisions.md` Q28).
 */
export function VendiendoAhorita({ onTapSession }: { onTapSession: (sessionId: ID) => void }) {
  const { state } = useStore();
  const sessions = activeSessionsForBusiness(state);
  if (sessions.length === 0) return null;

  return (
    <div className={styles.liveSection}>
      <p className={styles.liveSectionLabel}>Vendiendo ahorita</p>
      {/* The "hasta ahorita" qualifier on every figure below, plus this
          section's own clarifying line here — the load-bearing pair that
          keeps a live, still-moving total from being mistaken for
          Historial's settled numbers (§3.4a's own second governing
          constraint, `decision-log.md` D68). Copy reuses "jornada," not
          "sesión" — `home.md`'s own 2026-08-13 decision retired
          "sesión"-collision terminology from Selling-domain merchant-facing
          copy (`reviewer`'s remediation finding on this exact amendment). */}
      <p className={styles.liveSectionBody}>
        Los números todavía se están moviendo — van a quedar completos en cuanto cada quien cierre su jornada.
      </p>
      <div className={styles.liveCards}>
        {sessions.map((session) => {
          const event = session.eventId ? findEvent(state, session.eventId) : undefined;
          const venueName = event ? findVenue(state, event.venueId)?.displayName : undefined;
          const dayNumber = event ? dayNumberForDate(state, event.id, dateKey(session.openedAt)) : undefined;
          const membership = membershipById(state, session.openedByMembershipId);
          // Role-derived identity, never a personal name — only one OWNER
          // ever exists per Business (`settings.md` §2.7's "Invitar a
          // alguien" only ever creates SELLER rows). No `User` display-name
          // field exists to show anything more specific for a SELLER
          // (already-documented Foundation gap, `settings.md` §2.7/§11;
          // §3.4a's own disambiguation-limits bullet).
          const identity = membership?.role === 'OWNER' ? 'Tú' : 'Alguien de tu equipo';
          const totals = sessionTotals(state, session.id);
          return (
            <button key={session.id} className={styles.liveCard} onClick={() => onTapSession(session.id)}>
              {/* "Venta rápida," not the approved spec's own "Sesión
                  rápida" — this build's disclosed rename, the identical
                  cross-tab-consistency treatment `SessionDetail.tsx`/
                  `ResultadosMain.tsx` already apply to this same header
                  slot. */}
              <span className={styles.cardHeadline}>
                {venueName ? `${venueName} · Día ${dayNumber}` : 'Venta rápida'}
              </span>
              <span className={styles.cardSub}>
                {identity} · {totals.count} {pluralize(totals.count, 'venta', 'ventas')} · {pesos(totals.revenue)} hasta
                ahorita
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
