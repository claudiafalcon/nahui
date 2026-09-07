import { myActivityToday } from '../../domain/selectors';
import { useStore } from '../../domain/store';
import { pesos, pluralize, articulos } from '../../domain/format';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import styles from './MiActividadDeHoy.module.css';

/**
 * home.md §3.7c "Mi actividad de hoy" — a full push-in (not a dimmed
 * overlay, deliberately: leaving the ambient header behind avoids two
 * different "N ventas" figures ever being on screen at once) showing this
 * acting Membership's own finalized Sales today, scoped to the same
 * `eventId` context §3.7's own ambient header already uses. Available
 * identically to both roles.
 *
 * §3.7c's own near-instant/slow resolving pair is architecturally
 * inapplicable in this build — state loads synchronously from already-held
 * `AppState`, the identical posture every other tab's own resolving state
 * already carries (`BACKLOG.md`'s migration inventory, section A).
 */
export function MiActividadDeHoy({
  membershipId,
  eventId,
  headerTitle,
  onBack,
}: {
  membershipId: string;
  eventId: string | null;
  /** The same title the active-Session header already shows ("Plaza Norte
   * · Día 2," or "Venta rápida") — reused verbatim in the back arrow, per
   * this screen's own wireframe. */
  headerTitle: string;
  onBack: () => void;
}) {
  const { state } = useStore();
  const activity = myActivityToday(state, membershipId, eventId);

  return (
    <ScreenTransition transitionKey="mi-actividad">
      <div className={styles.wrap}>
        <button className={styles.back} onClick={onBack}>
          ← {headerTitle}
        </button>
        <h1 className={styles.heading}>Mi actividad de hoy</h1>

        {activity.count === 0 ? (
          <p className={styles.empty}>Todavía no has registrado ventas hoy.</p>
        ) : (
          <>
            <p className={styles.summary}>
              {activity.count} {pluralize(activity.count, 'venta', 'ventas')} · {pesos(activity.total)}
            </p>
            <div className={styles.rows}>
              {activity.rows.map((row) => (
                <p key={row.time} className={styles.row}>
                  <span className={styles.rowTime}>{formatTime(row.time)}</span>
                  <span className={styles.rowFacts}>
                    {pesos(row.total)} · {articulos(row.itemCount)}
                  </span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </ScreenTransition>
  );
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
}
