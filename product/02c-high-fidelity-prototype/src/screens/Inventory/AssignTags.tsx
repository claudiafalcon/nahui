import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { pendingTagBreakdown } from '../../domain/selectors';
import { makeId } from '../../domain/id';
import { Button } from '../../components/Button/Button';
import { NFCScanPrompt } from '../../components/NFCScanPrompt/NFCScanPrompt';
import styles from './AssignTags.module.css';

/** inventory.md §3.16 — a genuine physical read failure (out of range, foil
 * interference, timeout), simulated client-side only; §3.16's own explicit
 * instruction is that this state never touches the domain layer. */
const SCAN_FAIL_CHANCE = 0.18;
/** Simulates a merchant accidentally re-presenting a tag already stuck to a
 * different garment — the only way to reach §3.15 (a genuine business-logic
 * conflict, unlike §3.16) without a dev-only test affordance. Only ever
 * rolled once ≥1 tag has actually been assigned. */
const DUPLICATE_TAG_CHANCE = 0.12;

type ScanFeedback = { kind: 'already-assigned' } | { kind: 'scan-failed' } | null;

/** AT-M1/AT-M2 fix-round shape — a frozen entry (the "Lo que registraste"
 * receipt) plus the frozen per-Product "M" denominator map, both lifted out
 * of this component and owned by the caller (`App.tsx`, alongside
 * `inventoryView`) so neither is lost across this component's own
 * unmount/remount on an ordinary "Terminar después" → "Continuar
 * etiquetando" defer/resume cycle. See each prop's own doc comment below. */
export interface AssignTagsEntryLine {
  productId: string;
  quantity: number;
}

/**
 * inventory.md §3.14/§3.15/§3.16 — Asignar tags, the active tagging queue.
 * Pure scan-driven: a successful scan assigns the tag to the next untagged
 * unit and advances automatically, no per-unit confirm tap (§3.14). Reads
 * `pendingTagBreakdown` live on every render — never a snapshot taken once
 * at mount — so a unit consumed elsewhere (sold via FIFO in buttons mode
 * while she'd deferred tagging, §3.17) silently drops out of the queue.
 */
export function AssignTags({
  onDefer,
  onComplete,
  entryBreakdown,
  segmentTotals,
  onSegmentTotalsChange,
}: {
  onDefer: () => void;
  onComplete: () => void;
  /** AT-M1 fix — the receipt of exactly what the specific `commitLot` call
   * that triggered *this* entry into Asignar Tags actually wrote, captured
   * once by the caller at that moment and handed down unchanged for the
   * life of this tagging session (including across a defer/resume cycle,
   * since resuming isn't itself a new commit). Previously this line was
   * recomputed from the live, business-wide pending queue, so an old
   * deferred Lot's own backlog and a brand-new, unrelated Lot's units read
   * as one undifferentiated "what you just registered" — misrepresenting
   * what she actually just entered. `null` when this screen is reached with
   * no commit known this app session (e.g. resuming right after a reload)
   * — the summary line is simply omitted then, never fabricated from the
   * live queue. */
  entryBreakdown: AssignTagsEntryLine[] | null;
  /** AT-M2 fix — the frozen per-Product "M" denominator ("Faltan N de M"),
   * owned by the caller instead of this component's own state, so it
   * survives this component unmounting when she taps "Terminar después"
   * and remounting when she taps "Continuar etiquetando." */
  segmentTotals: Record<string, number>;
  onSegmentTotalsChange: (updater: (totals: Record<string, number>) => Record<string, number>) => void;
}) {
  const { state, assignTagToNextPendingUnit } = useStore();
  const breakdown = pendingTagBreakdown(state);
  const current = breakdown[0] ?? null;

  const [feedback, setFeedback] = useState<ScanFeedback>(null);

  // A stable string key of the live queue's own shape (product id + its
  // live count, front-to-back) — changes exactly when a scan lands or the
  // queue's composition genuinely changes, never merely because
  // `pendingTagBreakdown` returns a fresh array/object identity on every
  // render the way `breakdown` itself does.
  const breakdownKey = breakdown.map((row) => `${row.product.id}:${row.count}`).join('|');

  useEffect(() => {
    // §3.14's "Faltan N de M": M is fixed per Product segment while N (that
    // Product's own live remaining count) ticks down as she scans —
    // captured once per Product, the moment it first becomes (or already
    // is) part of the live queue, and never evicted while it's still
    // pending — so an ordinary defer/resume, which only unmounts/remounts
    // this component without changing the queue itself, hands the same M
    // straight back rather than re-capturing a smaller live remainder as a
    // new, wrong M (AT-M2). A segment's frozen total is only ever dropped
    // once it's fully tagged and genuinely disappears from the live queue —
    // exactly the moment a later, unrelated commitLot minting a fresh batch
    // of that same Product would need a brand-new M rather than reusing a
    // stale one. This also correctly leaves an *other*, still-pending
    // segment's own frozen total untouched when a new, unrelated Lot is
    // registered mid-queue (the AT-M1 scenario) — only the segment that
    // actually finished is ever reset, never the whole map at once.
    //
    // AT-M4 — this used to only ever *keep* an already-frozen total, never
    // *raise* it. "Registrar mercancía" stays reachable at all times while a
    // tagging queue is active (inventory.md §3.5) — registering more of a
    // Product that's still mid-queue (e.g. "Faltan 7 de 10" for Playeras)
    // grows that Product's live remaining count past its own frozen M
    // ("Faltan 12 de 10"), a denominator smaller than the count it's
    // supposed to bound, on the one screen whose entire job is a
    // trustworthy live count. Fixed by also raising a still-pending
    // segment's frozen total up to the live count whenever the live count
    // has grown past it — never only holding or shrinking. This is
    // idempotent by construction (it reacts to the live count actually
    // exceeding the frozen one, not to a remount or a resume event by
    // itself), so a plain "Terminar después" → "Continuar etiquetando"
    // cycle with no intervening growth still hands back the exact same M,
    // exactly as AT-M2 already guarantees.
    onSegmentTotalsChange((totals) => {
      const liveIds = new Set(breakdown.map((row) => row.product.id));
      let changed = false;
      const next: Record<string, number> = {};
      for (const row of breakdown) {
        const frozen = totals[row.product.id];
        if (frozen == null) {
          next[row.product.id] = row.count;
          changed = true;
        } else if (row.count > frozen) {
          next[row.product.id] = row.count;
          changed = true;
        } else {
          next[row.product.id] = frozen;
        }
      }
      for (const key of Object.keys(totals)) {
        if (!liveIds.has(key)) changed = true;
      }
      return changed ? next : totals;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakdownKey]);

  useEffect(() => {
    // inventory.md §2 step 4 — 0 pending units left: return to Catalog view
    // with the "lista para vender" confirmation (§3.13). A live check, so
    // this fires the instant the last scan lands, not on a separate poll.
    if (breakdown.length === 0) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakdown.length]);

  if (!current) {
    // AT-MIN2 fix — the render right before `onComplete()`'s effect above
    // actually fires still shows the topbar shell rather than a bare
    // `null`, so leaving this screen doesn't flash a fully blank content
    // area under the nav bar for one frame.
    return (
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Asignar tags</span>
      </div>
    );
  }

  const total = segmentTotals[current.product.id] ?? current.count;

  const entrySummary =
    entryBreakdown && entryBreakdown.length > 0
      ? entryBreakdown
          .map(({ productId, quantity }) => {
            const product = state.products.find((p) => p.id === productId);
            return product ? `${product.name} (${quantity})` : null;
          })
          .filter((line): line is string => line != null)
          .join(' · ')
      : null;

  function handleScan() {
    if (Math.random() < SCAN_FAIL_CHANCE) {
      // §3.16 — never touches the domain layer; queue state is unchanged.
      setFeedback({ kind: 'scan-failed' });
      return;
    }

    const assignedTagIds = state.units.map((u) => u.tagId).filter((id): id is string => id != null);
    const simulateDuplicate = assignedTagIds.length > 0 && Math.random() < DUPLICATE_TAG_CHANCE;
    const tagId = simulateDuplicate
      ? assignedTagIds[Math.floor(Math.random() * assignedTagIds.length)]
      : makeId('tag');

    const result = assignTagToNextPendingUnit(tagId);
    if (!result.ok) {
      // `queue-empty` is defensively unreachable here — `current` above
      // already guarantees ≥1 pending unit this render; only
      // `already-assigned` (§3.15) can actually occur.
      setFeedback({ kind: 'already-assigned' });
      return;
    }
    // A successful scan (or a different conflict) clears any prior message
    // automatically — no tap required to dismiss it (§3.15/§3.16).
    setFeedback(null);
  }

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Asignar tags</span>
      </div>
      <div className={styles.wrap}>
        {entrySummary && <p className={styles.summary}>Lo que registraste: {entrySummary}</p>}

        <p className={`${styles.errorLine} ${feedback ? '' : styles.errorLineHidden}`}>
          {feedback?.kind === 'already-assigned' && 'Este tag ya está asignado a otra prenda. Usa un tag nuevo.'}
          {feedback?.kind === 'scan-failed' && 'No se pudo leer el tag. Acércalo de nuevo a la prenda.'}
        </p>

        <div className={styles.progress}>
          <p className={styles.progressLabel}>Etiquetando: {current.product.name}</p>
          <p className={styles.progressCount}>
            Faltan {current.count} de {total}
          </p>
        </div>

        <NFCScanPrompt onTap={handleScan} />
      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button variant="secondary" onClick={onDefer}>
          Terminar después
        </Button>
      </div>
    </>
  );
}
