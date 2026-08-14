import { useState } from 'react';
import { Sheet } from '../../components/Sheet/Sheet';
import { Button } from '../../components/Button/Button';
import { pesos, pluralize } from '../../domain/format';
import { useNfcSessionStart } from './useNfcSessionStart';
import { NfcSessionStartNote } from './NfcSessionStartNote';
import styles from './Idle.module.css';
import sheetStyles from '../../components/SessionHeader/SessionHeader.module.css';

/**
 * home.md §2 step 2 / §3.6 — "Event active, no Session opened today."
 * Corrected reading (per this pass's own dispatching task, applied ahead of
 * a parallel doc-text fix to `home.md` §2): the condition is "Event status =
 * active AND no Session is currently active" — not "no Session opened yet
 * under it today," which would incorrectly drop Event-linkage after a
 * lunch-break close. `HomeScreen` only reaches this branch once step 1 (any
 * active Session) has already failed, so "no Session is currently active"
 * is guaranteed by construction here — this component never re-checks it.
 *
 * Reuses `Idle.module.css` — same topbar/wrap/content shape as `Idle.tsx`
 * (§3.4/§3.5), just a different headline/CTA, exactly as the approved spec's
 * own wireframe for §3.6 shows (one screen family, not a new visual
 * treatment invented for this one branch).
 *
 * **Same-day resume line (§3.6, closes `architect-questions.md` Q19).**
 * `todaySales` is `todaySalesSummary(state, event.id)` — scoped to this
 * Event's `eventId`, resolved once in `HomeScreen.tsx` and passed down.
 * Renders only when non-null (1+ finalized Sales already exist today under
 * this Event, e.g. a lunch-break resume), between the "Hoy es tu Día N"
 * headline and the primary CTA — the exact composition order the amendment
 * specifies (identity → Día N → same-day-sales line → primary CTA →
 * §3.6a's own lines, if any).
 *
 * **§3.6a (NFC Selling pass, D43) — shares `useNfcSessionStart`/
 * `NfcSessionStartNote` with `Idle.tsx`** rather than duplicating the same
 * four-variant branching a second time (§3.6a's own text: "applies
 * identically wherever a new Session is about to open — §3.4... §3.5...
 * §3.6"). `overrideToNfc` is threaded through `onContinue` at the moment of
 * *this* tap, same as `Idle.tsx`'s own `onStartSession`.
 */
export function EventResume({
  venueName,
  dayNumber,
  todaySales,
  onContinue,
  onOpenSettings,
  onOpenAssignTagsPlaceholder,
}: {
  venueName: string;
  dayNumber: number;
  todaySales?: { total: number; count: number } | null;
  /** NFC Selling pass (D43) — `overrideToNfc` is whatever
   * `useNfcSessionStart`'s own local override state currently reads at the
   * moment of this tap (always `false` outside the Limited Ready variant). */
  onContinue: (overrideToNfc: boolean) => void;
  onOpenSettings: () => void;
  /** §3.6a's "Asignar tags" link — routes into Inventario's real Asignar
   * Tags queue (inventory.md §3.14, Asignar Tags pass, D43). Prop name kept
   * as-is (not a stub anymore) to keep that pass's diff scoped to wiring,
   * not a cosmetic rename. */
  onOpenAssignTagsPlaceholder: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { variant, overrideToNfc, toggleOverride } = useNfcSessionStart();

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button className={styles.menuBtn} onClick={() => setMenuOpen((open) => !open)} aria-label="Controles">
          ⋯
        </button>
      </div>
      <div className={styles.wrap}>
        <div className={styles.content}>
          <p className={styles.upcomingVenue} style={{ marginBottom: 0 }}>
            {venueName}
          </p>
          <h1 className={styles.question}>Hoy es tu Día {dayNumber}</h1>
          {todaySales && (
            <p className={styles.todaySalesLine}>
              Ya vendiste {pesos(todaySales.total)} · {todaySales.count} {pluralize(todaySales.count, 'venta', 'ventas')} hoy
            </p>
          )}
          <Button className={styles.cta} onClick={() => onContinue(overrideToNfc)}>
            Continuar Día {dayNumber}
          </Button>
          <NfcSessionStartNote
            variant={variant}
            overrideToNfc={overrideToNfc}
            onToggleOverride={toggleOverride}
            onOpenAssignTags={onOpenAssignTagsPlaceholder}
            onOpenSettings={onOpenSettings}
          />
        </div>
      </div>

      {menuOpen && (
        <Sheet onDismiss={() => setMenuOpen(false)}>
          <button
            className={`${sheetStyles.sheetRow} stitchBottom`}
            onClick={() => {
              setMenuOpen(false);
              onOpenSettings();
            }}
          >
            ⚙ Configuración
          </button>
        </Sheet>
      )}
    </>
  );
}
