import { useMemo, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { disponibleEnGeneral, eventAllocationFor, quantityRemaining } from '../../domain/selectors';
import { Button } from '../../components/Button/Button';
import styles from './MercanciaParaEsteEvento.module.css';

/**
 * events.md §3.21/§3.23 "Mercancía para este evento" — the shared screen
 * both "Llevar mercancía" (§3.11, `scheduled`) and "Ver mercancía de este
 * evento" (§3.14/§3.15, `active`) land on, unchanged between them (this
 * document's own §4 shared-state convention). OWNER-only, per
 * `product-decisions.md` Q24/Q25's settled permission table.
 *
 * **Manual (quantity-based) allocation only, this slice
 * (`context/q24-q25-first-slice.md`).** NFC-scan allocation (§3.22) and its
 * own "sin tag · con tag" split are both out of scope — every row shows a
 * single plain "Disponible en general: N" figure and the manual stepper
 * only, never the scan affordance §3.21's own conditional split would
 * otherwise offer a Paid/tagged Business. "Mover a otro evento" (§3.24) is
 * also out of scope this slice and is omitted entirely, never a dead link
 * to an unbuilt destination.
 *
 * Stage 7 Backend Integration, Phase 2b — `handleSave` now awaits a real
 * `save_event_allocations` call (`saveEventAllocations`, `store.tsx`)
 * instead of a synchronous local write; `saveState='error'` is now a really
 * reachable outcome (a rejected/failed RPC call), not merely a disclosed,
 * never-triggered branch. `commitIdempotencyKeyRef` mirrors
 * `RegisterMerchandise.tsx`'s own per-attempt key ref — generated once per
 * "Guardar cambios" attempt, reused unchanged across a Reintentar retry of
 * that same attempt, cleared only on success.
 */
export function MercanciaParaEsteEvento({
  eventId,
  venueName,
  onBack,
}: {
  eventId: string;
  venueName: string;
  onBack: () => void;
}) {
  const { state, saveEventAllocations } = useStore();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');
  const [confirmation, setConfirmation] = useState(false);

  // Staged manual quantities — initialized once from each Product's current
  // live-remaining committed count (`quantityRemaining`, 0 if no
  // EventAllocation exists yet for this pair). **Corrected, RFC 0010/D59:**
  // never `quantityAllocated`, which is now a monotonic lifetime total that
  // never decreases — reading it here would silently ignore any prior
  // mid-Event release and redisplay a stale, too-high number. Collapsing/
  // expanding a row is a pure display toggle, never a commit (§3.21's own
  // annotation) — this map persists whichever row is shown expanded or not.
  const [staged, setStaged] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const product of state.products) {
      const allocation = eventAllocationFor(state, eventId, product.id);
      initial[product.id] = allocation ? quantityRemaining(state, allocation) : 0;
    }
    return initial;
  });
  // ux-critic fix round — §3.21 reserves "Solo tienes N disponibles." for
  // the specific case of typing past the ceiling (a keystroke actually
  // rejected/reduced), not for merely reaching the ceiling normally via
  // `[+]` (a completely valid, unremarkable "allocate everything" choice).
  // Set only inside `setQuantity` when the raw requested value genuinely
  // exceeded the ceiling; `[+]` itself is disabled at `quantity >= ceiling`
  // so it can never produce a `raw` above the ceiling in the first place —
  // this flag is only ever true after a real typed overflow.
  const [clamped, setClamped] = useState<Record<string, boolean>>({});
  // Stage 7 Backend Integration, Phase 2b — one idempotency key per logical
  // "Guardar cambios" attempt, mirroring `RegisterMerchandise.tsx`'s own
  // `commitIdempotencyKeyRef`. Cleared on success; left in place on failure
  // so Reintentar replays the exact same attempt.
  const saveIdempotencyKeyRef = useRef<string | null>(null);

  const ceilings = useMemo(() => {
    const map: Record<string, number> = {};
    for (const product of state.products) {
      map[product.id] = disponibleEnGeneral(state, eventId, product.id);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recomputed
    // once per mount, matching the same "ceiling read at open time" posture
    // `staged`'s own initializer already uses; a live merchant edit to
    // Inventario mid-visit here is out of this screen's own scope to react to.
  }, []);

  function setQuantity(productId: string, raw: number) {
    const ceiling = ceilings[productId] ?? 0;
    const overflowed = raw > ceiling;
    setStaged((prev) => ({ ...prev, [productId]: Math.max(0, Math.min(raw, ceiling)) }));
    setClamped((prev) => (prev[productId] === overflowed ? prev : { ...prev, [productId]: overflowed }));
  }

  async function handleSave() {
    setSaveState('saving');
    if (!saveIdempotencyKeyRef.current) {
      saveIdempotencyKeyRef.current = crypto.randomUUID();
    }
    const changes = state.products.map((p) => ({ productId: p.id, quantity: staged[p.id] ?? 0 }));
    const saved = await saveEventAllocations(eventId, changes, saveIdempotencyKeyRef.current);
    if (!saved) {
      console.error('[MercanciaParaEsteEvento] saveEventAllocations failed');
      setSaveState('error');
      return;
    }
    saveIdempotencyKeyRef.current = null; // this attempt is over; a future save mints its own key
    setSaveState('idle');
    setConfirmation(true);
    window.setTimeout(() => setConfirmation(false), 2400);
  }

  if (state.products.length === 0) {
    return (
      <>
        <div className={styles.topbar}>
          <button className={styles.back} onClick={onBack}>
            ← {venueName}
          </button>
        </div>
        <h1 className={styles.heading}>Mercancía para este evento</h1>
        <p className={styles.empty}>
          Todavía no registraste ningún producto. Registra mercancía en Inventario para poder llevar mercancía a
          este evento.
        </p>
      </>
    );
  }

  if (saveState === 'saving') {
    return <p className={styles.savingLine}>Guardando…</p>;
  }
  if (saveState === 'error') {
    // §3.23's own write-failure branch — Stage 7 Backend Integration, Phase
    // 2b: a real, reachable outcome now (a rejected/failed
    // `save_event_allocations` call), not merely disclosed-not-wired.
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorBody}>No se pudo guardar. Tus cambios siguen aquí, intenta de nuevo.</p>
        <Button onClick={handleSave}>Reintentar</Button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← {venueName}
        </button>
      </div>
      <h1 className={styles.heading}>Mercancía para este evento</h1>
      <p className={styles.intro}>
        Elige cuánto llevas de cada producto. Lo que no asignes se queda disponible para tus otros eventos.
      </p>

      {confirmation && <p className={styles.confirmation}>Mercancía actualizada ✓</p>}

      <div className={styles.list}>
        {state.products.map((product) => {
          const quantity = staged[product.id] ?? 0;
          const ceiling = ceilings[product.id] ?? 0;
          const expanded = expandedProductId === product.id;
          const summary = quantity > 0 ? `${quantity} para este evento` : 'nada para este evento todavía';

          return (
            <div key={product.id} className={`${styles.row} stitchBottom`}>
              <button
                className={styles.rowSummary}
                onClick={() => setExpandedProductId(expanded ? null : product.id)}
              >
                <span className={styles.rowName}>
                  {product.name} — {summary}
                </span>
                <span className={styles.chevron}>{expanded ? '▴' : '▾'}</span>
              </button>

              {expanded && (
                <div className={styles.rowDetail}>
                  <p className={styles.available}>Disponible en general: {ceiling}</p>
                  <p className={styles.stepperLabel}>Cantidad</p>
                  <div className={styles.stepperRow}>
                    <button
                      className={styles.stepBtn}
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 0}
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
                        value={quantity}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/[^0-9]/g, '');
                          setQuantity(product.id, digits === '' ? 0 : parseInt(digits, 10));
                        }}
                      />
                    </div>
                    <button
                      className={styles.stepBtn}
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      disabled={quantity >= ceiling}
                      aria-label="Más"
                    >
                      +
                    </button>
                  </div>
                  {clamped[product.id] && <p className={styles.clampNote}>Solo tienes {ceiling} disponibles.</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button onClick={handleSave}>Guardar cambios</Button>
      </div>
    </>
  );
}
