import { Button } from '../../components/Button/Button';
import { pesos, pluralize } from '../../domain/format';
import type { MembershipRole } from '../../domain/types';
import { useNfcSessionStart } from './useNfcSessionStart';
import { NfcSessionStartNote } from './NfcSessionStartNote';
import styles from './Idle.module.css';

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
 *
 * **Direct gear (⚙) entry point (settings.md §2.1; amended 2026-08-15 — see
 * home.md's own status header/§2/§3.6c).** Previously a "⋯" icon opening a
 * one-row Sheet ("⚙ Configuración" only) — that intermediate sheet is now
 * retired here too (already retired for the active-Session header a day
 * earlier, SessionHeader.tsx): the gear icon calls `onOpenSettings` directly,
 * no `Sheet`, no `menuOpen` state.
 *
 * **Secondary "Iniciar Sesión Rápida" action (home.md §3.6, 2026-09-15
 * amendment — Product Owner-raised, live-selling scenario).** Cross-
 * referenced verbatim from §3.4's own primary action (this build's own
 * "Iniciar Venta Rápida" naming, `Idle.tsx`'s same copy/mechanism/destination
 * — see that component's own doc comment for the naming note) — opens a
 * Quick Session (`Session.eventId = null`), completely independent of this
 * Event. Renders secondary (`variant="secondary"`, the identical
 * primary/secondary composition `inventory.md` §3.5/§3.17's "Continuar
 * etiquetando"/"Registrar mercancía" already established in this codebase),
 * immediately beneath "Continuar Día {dayNumber}," which keeps its exact
 * position/size/destination — zero change to the fastest path. Shares this
 * component's single `useNfcSessionStart` instance with the primary CTA
 * (§3.6a's own 2026-09-15 "widened" note: one ambient, once-per-Home-open
 * computation, applying regardless of which of the two actions is tapped) —
 * `overrideToNfc` is threaded through `onStartQuickSession` at the moment of
 * *this* tap, exactly like `onContinue`.
 *
 * **Stacking order (§3.6's own worked composition, unchanged by this
 * amendment):** identity → Día N → Event-scoped same-day-sales line →
 * primary CTA → Quick-Session same-day-sales line (`quickSessionTodaySales`,
 * cross-referenced from §3.4's own identical definition/condition) →
 * secondary CTA + the on-screen independence signal ("No se cuenta para
 * {venueName}," a static caption, never a button — closes the `ux-critic`
 * Major finding this same amendment fixed), grouped together in
 * `.secondaryActionGroup` as of the 2026-09-15 remediation (ux-critic
 * MAJOR-1 — binds the caption visually to the CTA it qualifies rather than
 * letting it read as just the next line in the stack) → `NfcSessionStartNote`
 * (moved here from directly-after-primary-CTA to preserve this exact order).
 */
export function EventResume({
  role,
  headerIcon,
  venueName,
  dayNumber,
  todaySales,
  quickSessionTodaySales,
  onContinue,
  onStartQuickSession,
  onOpenAccountSurface,
  onOpenAssignTagsPlaceholder,
}: {
  role: MembershipRole;
  headerIcon: '⚙' | '⊚';
  venueName: string;
  dayNumber: number;
  todaySales?: { total: number; count: number } | null;
  /** §3.6's own Quick-Session same-day-resume line — cross-referenced from
   * §3.4's identical condition (1+ Session with `eventId = null` has 1+
   * finalized Sales today), resolved once in `HomeScreen.tsx` and passed
   * down, never recomputed here. */
  quickSessionTodaySales?: { total: number; count: number } | null;
  /** NFC Selling pass (D43) — `overrideToNfc` is whatever
   * `useNfcSessionStart`'s own local override state currently reads at the
   * moment of this tap (always `false` outside the Limited Ready variant). */
  onContinue: (overrideToNfc: boolean) => void;
  /** §3.6's new secondary action (2026-09-15) — identical call shape to
   * `onContinue`, but always opens with `eventId = null` (wired in
   * `HomeScreen.tsx` to the same `handleStartSession` helper, just a
   * different `eventId` argument). */
  onStartQuickSession: (overrideToNfc: boolean) => void;
  onOpenAccountSurface: () => void;
  /** §3.6a's "Asignar tags" link — routes into Inventario's real Asignar
   * Tags queue (inventory.md §3.14, Asignar Tags pass, D43). Prop name kept
   * as-is (not a stub anymore) to keep that pass's diff scoped to wiring,
   * not a cosmetic rename. */
  onOpenAssignTagsPlaceholder: () => void;
}) {
  const { variant, overrideToNfc, toggleOverride } = useNfcSessionStart();

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button
          className={styles.gearBtn}
          onClick={onOpenAccountSurface}
          aria-label={role === 'OWNER' ? 'Configuración' : 'Tu cuenta'}
        >
          {headerIcon}
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
          {quickSessionTodaySales && (
            <p className={styles.todaySalesLine}>
              Ya vendiste {pesos(quickSessionTodaySales.total)} ·{' '}
              {quickSessionTodaySales.count} {pluralize(quickSessionTodaySales.count, 'venta', 'ventas')} hoy
            </p>
          )}
          <div className={styles.secondaryActionGroup}>
            <Button className={styles.cta} variant="secondary" onClick={() => onStartQuickSession(overrideToNfc)}>
              Iniciar Venta Rápida
            </Button>
            <p className={styles.qualifyingLine}>No se cuenta para {venueName}</p>
          </div>
          <NfcSessionStartNote
            variant={variant}
            role={role}
            overrideToNfc={overrideToNfc}
            onToggleOverride={toggleOverride}
            onOpenAssignTags={onOpenAssignTagsPlaceholder}
            onOpenSettings={onOpenAccountSurface}
          />
        </div>
      </div>
    </>
  );
}
