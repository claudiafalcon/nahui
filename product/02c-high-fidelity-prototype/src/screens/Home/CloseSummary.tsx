import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { pesos } from '../../domain/format';
import styles from './ColdStart.module.css';

/**
 * home.md §3.12 — Close-summary, immediate. Two numbers only (free tier).
 *
 * **Entrance (design-audit-2026-08-15 #6).** Previously rendered with zero
 * animation and, unlike every other "nothing/something happened" Home
 * state, without even the shared `BrandMark` halo `ColdStart`/`Idle` both
 * use — plain text dropped into an empty canvas the instant the Session
 * closed. Now reuses `ColdStart.module.css`'s own `.mark`/`markSettle`
 * device verbatim (same file already imported here, same class, no new
 * animation invented) plus a small `figureSettle` landing on the revenue
 * figure only. Motion/presence only — the two-line copy below is untouched
 * character-for-character from §3.12's own "two numbers, no breakdown"
 * free-tier restriction; nothing new is rendered, only *how* the existing
 * total arrives on screen.
 *
 * `eventId`-aware variant (Eventos pass, D43): no explicit spec text exists
 * for this exact label — the approved doc's own §3.12 only ever illustrates
 * the Quick Session case — so this is a judgment call, low-stakes per this
 * pass's own dispatching task. "Día N cerrado" (+ the Venue name as a
 * passive line) mirrors the eyebrow/body shape "Día cerrado" already
 * establishes, extended the same way `SessionHeader`'s own eventId-aware
 * title already is: same slot, same treatment, only the content differs.
 *
 * **"Ver detalle" (Resultados pass, D43) — closes the exact wiring gap the
 * Gap Analysis named.** `home.md` §3.12 always specified this hand-off
 * (`reports.md` §2 step 3, §6: "1 tap" from close to Session detail); it was
 * never wired because Resultados didn't exist yet when this screen was
 * first built. Primary action now, above "Entendido" — the faster,
 * more-informative path (§6's own minimum-step-count table treats it as the
 * expected route, not a secondary option).
 */
export function CloseSummary({
  count,
  revenue,
  venueName,
  dayNumber,
  onViewDetail,
  onContinue,
}: {
  count: number;
  revenue: number;
  venueName?: string;
  dayNumber?: number;
  onViewDetail: () => void;
  onContinue: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>{dayNumber != null ? `Día ${dayNumber} cerrado` : 'Día cerrado'}</h1>
        {venueName && <p className={styles.body}>{venueName}</p>}
        <p className={styles.body}>
          {count} {count === 1 ? 'venta registrada' : 'ventas registradas'}
          <br /><span className={styles.totalFigure}>{pesos(revenue)}</span> en total
        </p>
      </div>
      <div className={styles.ctaStack}>
        <Button onClick={onViewDetail}>Ver detalle</Button>
        <Button variant="secondary" onClick={onContinue}>
          Entendido
        </Button>
      </div>
    </div>
  );
}
