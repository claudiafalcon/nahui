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
  findProduct,
  findVenue,
  hasPriorFifoReconciliation,
  openEventAllocationsForEvent,
  quantityRemaining,
  todaySalesSummary,
} from '../../domain/selectors';
import { daysFromToday, formatDateRange, formatShortDate, todayKey } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { AdjustPrices } from './AdjustPrices';
import { MercanciaParaEsteEvento } from './MercanciaParaEsteEvento';
import { PersonalParaEsteEvento } from './PersonalParaEsteEvento';
import { EVENT_TYPE_LABELS } from './eventTypeLabels';
import styles from './EventDetail.module.css';

type SubView = 'main' | 'cancel-confirm' | 'adjust-prices' | 'mercancia' | 'personal';

/**
 * events.md §3.11/§3.12/§3.14/§3.15/§3.16/§3.17 — Event detail, across every
 * status. Status is read live (`eventStatus`, never a stored field, §2) —
 * this component branches on that read, it never receives a status prop.
 */
export function EventDetail({
  eventId,
  onBack,
  onNavigateToHoy,
  onNavigateToResultados,
  onCancelled,
}: {
  eventId: string;
  onBack: () => void;
  onNavigateToHoy: () => void;
  /** events.md §3.16 "Ver resumen en Resultados" (Resultados pass, D43,
   * closing the exact wiring gap the Gap Analysis named) — rewired from an
   * internal Placeholder to real cross-tab navigation into Resultados'
   * Event detail (`reports.md` §3.8) for this specific `eventId`, the same
   * `onChangeView`-bubbling pattern `onNavigateToHoy` already uses. */
  onNavigateToResultados: (eventId: string) => void;
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

  if (subView === 'mercancia') {
    return <MercanciaParaEsteEvento eventId={event.id} venueName={venueName} onBack={() => setSubView('main')} />;
  }

  if (subView === 'personal') {
    return <PersonalParaEsteEvento eventId={event.id} venueName={venueName} onBack={() => setSubView('main')} />;
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
            <Button variant="secondary" onClick={() => setSubView('mercancia')}>
              Llevar mercancía
            </Button>
            <Button variant="secondary" onClick={() => setSubView('adjust-prices')}>
              Ajustar precios
            </Button>
            <Button variant="secondary" onClick={() => setSubView('personal')}>
              Asignar personal
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
            onViewResultados={() => onNavigateToResultados(event.id)}
            onViewMercancia={() => setSubView('mercancia')}
            onViewPersonal={() => setSubView('personal')}
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
  onViewMercancia,
  onViewPersonal,
}: {
  eventId: string;
  status: 'active' | 'closed';
  today: string;
  onContinue: () => void;
  onViewResultados: () => void;
  /** events.md §3.14/§3.15 "Ver mercancía de este evento" (Slice 12) —
   * present throughout the Event's `active` life (unlike "Ajustar precios,"
   * which is `scheduled`-only) — see `MercanciaParaEsteEvento.tsx`'s own
   * doc comment for why this is a deliberate divergence, not an
   * inconsistency. */
  onViewMercancia: () => void;
  /** events.md §3.14/§3.15 "Ver personal de este evento"
   * (`product/99-rfc/0011-event-assignment.md`) — present throughout the
   * Event's `active` life, the identical lifecycle shape as "Ver mercancía
   * de este evento" above; absent from the `closed` branch below, matching
   * §3.16's own wireframe (no "Ver personal" line there). */
  onViewPersonal: () => void;
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
        <Button variant="secondary" onClick={onViewMercancia}>
          Ver mercancía de este evento
        </Button>
        <Button variant="secondary" onClick={onViewPersonal}>
          Ver personal de este evento
        </Button>
      </>
    );
  }

  // closed
  const days = eventCompletedDays(state, eventId);
  // events.md §3.16's own reconciliation trigger is unconditional on
  // EventAllocation state alone ("whenever a closed Event has 1+
  // EventAllocation still status='open' with 1+ unit still reserved") — not
  // scoped to "only once at least one Session/Sale happened." An Event can
  // close with allocated-but-never-touched stock and zero Sessions at all
  // (she planned to attend, allocated mercancía, then never opened a
  // Session) — that stock still needs an explicit path back to general
  // inventory, so this section composes with §3.17's own "zero Sessions"
  // empty-body copy rather than being skipped by its early return, exactly
  // as it composes with §3.16's own rollup line below.
  return (
    <>
      {days === 0 ? (
        <p className={styles.emptyBody}>No registraste ventas en este evento.</p>
      ) : (
        <RollupLine eventId={eventId} days={days} />
      )}
      <ManualReconciliationSection eventId={eventId} />
      {days > 0 && (
        <Button variant="secondary" onClick={onViewResultados}>
          Ver resumen en Resultados
        </Button>
      )}
    </>
  );
}

function RollupLine({ eventId, days }: { eventId: string; days: number }) {
  const { state } = useStore();
  const { sales, revenue } = eventRollup(state, eventId);
  return (
    <p className={styles.rollup}>
      {days} {pluralize(days, 'día', 'días')} · {sales} {pluralize(sales, 'venta', 'ventas')} · {pesos(revenue)}
    </p>
  );
}

/**
 * events.md §3.16 (2026-09-09 amendment, RFC 0010/D59) — the closed-Event
 * mercancía reconciliation section: manual/untagged sub-block only. NFC's
 * own two-button "Regresar a inventario general"/"Mover a otro evento"
 * mechanism, and a mixed-row composition of the two, are both correctly
 * unreachable in this build — NFC-scan allocation itself is unmodeled this
 * slice (`MercanciaParaEsteEvento.tsx`'s own scope note), so every
 * `allocatedUnitIds` entry that can ever exist here is `fifo_assignment`-
 * sourced. "Mover a otro evento" is likewise omitted for the manual
 * sub-block (§3.24's reallocation transaction is out of this slice's scope
 * — the same boundary `MercanciaParaEsteEvento.tsx` already draws), never a
 * dead link to an unbuilt destination.
 */
// §3.16's own explicit instruction: "Saving/error/ambient-confirmation shape
// reuses §3.23 verbatim... No new save-state pattern invented for this
// action." Same constant, same value, as `MercanciaParaEsteEvento.tsx`'s own
// §3.23 scaffold (`ui-designer` Important-finding fix, `reviewer`).
const SAVE_DELAY_MS = 260;

function ManualReconciliationSection({ eventId }: { eventId: string }) {
  const { state, releaseAllocation } = useStore();
  const [adjustingIds, setAdjustingIds] = useState<Set<string>>(new Set());
  const [stepperValues, setStepperValues] = useState<Record<string, number>>({});
  // §3.16/§3.23 — one row's write is independent of every other row's, so
  // (unlike `MercanciaParaEsteEvento.tsx`'s single screen-level `saveState`,
  // one "Guardar cambios" for the whole screen) this is keyed per
  // `allocationId`: each row transitions through its own
  // `'idle' | 'saving' | 'error'` exactly as that screen's single state does.
  const [saveState, setSaveState] = useState<Record<string, 'idle' | 'saving' | 'error'>>({});
  // The exact attempt (quantity/quantityExpected/onSuccess already bound) a
  // row's own Reintentar re-runs — never re-derived from possibly-stale
  // component state at retry time.
  const [retryAttempts, setRetryAttempts] = useState<Record<string, () => void>>({});
  // `success` gates both the color (fix round, D59 ux-critic Major — see
  // EventDetail.module.css's `.confirmationSuccess`/`.confirmationNeutral`
  // doc comment) and mirrors the identical condition each call site already
  // uses to decide whether the copy itself carries a trailing ✓.
  const [ambientMessages, setAmbientMessages] = useState<{ id: string; text: string; success: boolean }[]>([]);

  // Live-derived every render — never a stored/cached number (RFC 0010 §8's
  // own "no independently-writable, driftable number" discipline).
  const rows = openEventAllocationsForEvent(state, eventId)
    .map((allocation) => ({ allocation, remaining: quantityRemaining(state, allocation) }))
    .filter((row) => row.remaining > 0);

  function pushAmbient(text: string, success: boolean) {
    const id = `${Date.now()}-${Math.random()}`;
    setAmbientMessages((prev) => [...prev, { id, text, success }]);
    window.setTimeout(() => {
      setAmbientMessages((prev) => prev.filter((m) => m.id !== id));
    }, 2400);
  }

  function openAdjust(allocationId: string, n: number) {
    setStepperValues((prev) => ({ ...prev, [allocationId]: n }));
    setAdjustingIds((prev) => new Set(prev).add(allocationId));
  }

  // §3.16 — "Mover a otro evento" tapped instead of Cancelar/Confirmar has
  // the identical discard effect on the staged stepper value; this build
  // omits "Mover a otro evento" entirely (see this component's own doc
  // comment), so only Cancelar/leaving the row need this effect today, but
  // the discard-on-close shape is the same regardless of exit path.
  function cancelAdjust(allocationId: string) {
    setAdjustingIds((prev) => {
      const next = new Set(prev);
      next.delete(allocationId);
      return next;
    });
  }

  function setStepper(allocationId: string, raw: number, ceiling: number) {
    setStepperValues((prev) => ({ ...prev, [allocationId]: Math.max(0, Math.min(raw, ceiling)) }));
  }

  // §3.16/§3.23 — the shared save/error scaffold every reconciliation write
  // (full return, "No regresó," Ajustar-cantidad Confirmar) goes through:
  // a `'saving'` transient (`SAVE_DELAY_MS`, the exact same simulated-delay
  // pattern `MercanciaParaEsteEvento.tsx`'s own `handleSave` already uses),
  // the real `releaseAllocation` write only committed after that delay
  // resolves, then `'idle'` + `onSuccess` (the row's own ambient
  // confirmation, and — for Ajustar cantidad — collapsing the stepper). The
  // `'error'` branch (never actually triggered by this build's local mock
  // write, same disclosed-not-wired convention as
  // `MercanciaParaEsteEvento.tsx`'s own error branch) is a real, rendering
  // state whose Reintentar re-invokes this exact bound attempt again.
  function performRelease(allocationId: string, quantity: number, quantityExpected: number, onSuccess: () => void) {
    const attempt = () => {
      setSaveState((prev) => ({ ...prev, [allocationId]: 'saving' }));
      window.setTimeout(() => {
        releaseAllocation(allocationId, quantity, 'return_to_general', quantityExpected);
        setSaveState((prev) => ({ ...prev, [allocationId]: 'idle' }));
        onSuccess();
      }, SAVE_DELAY_MS);
    };
    setRetryAttempts((prev) => ({ ...prev, [allocationId]: attempt }));
    attempt();
  }

  function retrySave(allocationId: string) {
    retryAttempts[allocationId]?.();
  }

  // One-tap default — "Sí, regresaron las N" / "Sí, regresó" — confirms the
  // full live-expected quantity, N as both the release quantity and the
  // ledger's `quantityExpected` (RFC 0010 §8's own "N supplied automatically
  // as the system's own already-known ceiling").
  function handleFullReturn(allocationId: string, n: number, productName: string) {
    performRelease(allocationId, n, n, () => {
      pushAmbient(`Se regresó ${productName} a inventario general ✓`, true);
    });
  }

  // N=1's direct "No regresó" — collapses the stepper entirely (no
  // intermediate value exists between "1 came back" and "0 came back").
  function handleNoRegreso(allocationId: string, productName: string) {
    performRelease(allocationId, 0, 1, () => {
      pushAmbient(`Confirmaste que 0 de 1 ${productName} regresaron`, false);
    });
  }

  // "Ajustar cantidad"'s own Confirmar — writes whatever the stepper is
  // currently staged at, `quantityExpected` always the original N regardless
  // of the confirmed value (§3.16: "she was asked to confirm N, confirmed
  // <value>"). Checkmark only when the stepper reached the full N — still a
  // full return, per §3.16's own explicit rule — never for anything less,
  // including a confirmed 0.
  function confirmAdjust(allocationId: string, n: number, productName: string) {
    const value = stepperValues[allocationId] ?? n;
    performRelease(allocationId, value, n, () => {
      const isFullReturn = value === n;
      const checkmark = isFullReturn ? ' ✓' : '';
      pushAmbient(`Confirmaste que ${value} de ${n} ${productName} regresaron${checkmark}`, isFullReturn);
      cancelAdjust(allocationId);
    });
  }

  if (rows.length === 0 && ambientMessages.length === 0) return null;

  return (
    <div className={styles.reconcile}>
      {rows.length > 0 && <p className={styles.reconcileHeading}>Mercancía de este evento que no se vendió:</p>}
      {ambientMessages.map((m) => (
        <p
          key={m.id}
          className={`${styles.confirmation} ${m.success ? styles.confirmationSuccess : styles.confirmationNeutral}`}
        >
          {m.text}
        </p>
      ))}
      {rows.length > 0 && (
        <div className={styles.reconcileList}>
          {rows.map(({ allocation, remaining: n }) => {
            const product = findProduct(state, allocation.productId);
            if (!product) return null; // defensive — every allocation references a real Product
            const revisited = hasPriorFifoReconciliation(state, allocation.id);
            const adjusting = adjustingIds.has(allocation.id);
            const stepperValue = stepperValues[allocation.id] ?? n;
            const rowSaveState = saveState[allocation.id] ?? 'idle';

            return (
              <div key={allocation.id} className={`${styles.reconcileRow} stitchBottom`}>
                <p className={styles.reconcileRowTitle}>
                  {product.name} — {n} sin vender
                </p>
                {revisited && (
                  <p className={styles.reconcileRevisited}>
                    Ya revisaste esto — todavía {pluralize(n, 'falta', 'faltan')} {n}.
                  </p>
                )}

                {rowSaveState === 'saving' ? (
                  <p className={styles.reconcileSaving}>Guardando…</p>
                ) : rowSaveState === 'error' ? (
                  // §3.23's own write-failure branch — never actually
                  // triggered in this build (the local mock write never
                  // fails), same disclosed-not-wired convention as
                  // `MercanciaParaEsteEvento.tsx`'s own error branch.
                  <div className={styles.reconcileError}>
                    <p className={styles.reconcileErrorBody}>
                      No se pudo guardar. Tus cambios siguen aquí, intenta de nuevo.
                    </p>
                    <Button onClick={() => retrySave(allocation.id)}>Reintentar</Button>
                  </div>
                ) : !adjusting ? (
                  <div className={styles.reconcileActions}>
                    <Button onClick={() => handleFullReturn(allocation.id, n, product.name)}>
                      {n === 1 ? 'Sí, regresó' : `Sí, regresaron las ${n}`}
                    </Button>
                    {n === 1 ? (
                      <Button variant="secondary" onClick={() => handleNoRegreso(allocation.id, product.name)}>
                        No regresó
                      </Button>
                    ) : (
                      <Button variant="secondary" onClick={() => openAdjust(allocation.id, n)}>
                        Ajustar cantidad
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className={styles.reconcileAdjust}>
                    <p className={styles.stepperLabel}>Cuántas regresaron</p>
                    <div className={styles.stepperRow}>
                      <button
                        className={styles.stepBtn}
                        onClick={() => setStepper(allocation.id, stepperValue - 1, n)}
                        disabled={stepperValue <= 0}
                        aria-label="Menos"
                      >
                        −
                      </button>
                      <div className={styles.valueWrap}>
                        <input
                          className={styles.valueInput}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={stepperValue}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/[^0-9]/g, '');
                            setStepper(allocation.id, digits === '' ? 0 : parseInt(digits, 10), n);
                          }}
                        />
                      </div>
                      <button
                        className={styles.stepBtn}
                        onClick={() => setStepper(allocation.id, stepperValue + 1, n)}
                        disabled={stepperValue >= n}
                        aria-label="Más"
                      >
                        +
                      </button>
                    </div>
                    <div className={styles.reconcileActions}>
                      <Button variant="secondary" onClick={() => cancelAdjust(allocation.id)}>
                        Cancelar
                      </Button>
                      <Button onClick={() => confirmAdjust(allocation.id, n, product.name)}>Confirmar</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
