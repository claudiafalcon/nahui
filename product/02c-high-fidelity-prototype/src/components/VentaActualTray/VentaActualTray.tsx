import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { TagStub } from '../TagStub/TagStub';
import { toneForProduct } from '../../styles/productIdentity';
import { articulos, pesos } from '../../domain/format';
import styles from './VentaActualTray.module.css';

export interface SaleLine {
  productId: string;
  name: string;
  qty: number;
}

/** design-audit-2026-08-15 #3 — the "torn away" exit, faster than the
 * entrance's chipSettle stagger (35ms/chip, --duration-base = 220ms). */
const EXIT_STAGGER_MS = 28;
const MAX_STAGGERED = 6; // same cap the entrance stagger already uses
/** Mirrors `--duration-fast` (120ms, tokens.css); a plain JS constant since
 * this schedules a `setTimeout`, which can't read a CSS custom property —
 * same precedent as `ReceiptTicket`'s own `COUNT_UP_MS`. Kept a little
 * longer than the CSS duration itself as a small buffer so the unmount
 * never clips the animation's own last frame. */
const EXIT_DURATION_MS = 150;

/**
 * home.md §3.7/§3.8: "Venta actual" is always visible, even empty — ambient
 * visibility so a stale/leftover sale is never invisible. Item list by
 * Product name only, never a unit/lot reference (architecture-principles.md
 * #4).
 *
 * Running subtotal (Fix 3, merchant-user-tester finding, 2026-08-13): a
 * merchant building a sale had no on-screen figure until Finalizar Venta —
 * she wants the number before she says it out loud to a customer. Rendered
 * next to the item count using the exact same "plain Fredoka, no tag"
 * treatment SessionHeader's "Hoy: $X" already uses for its own running
 * aggregate — DESIGN-SYSTEM.md §3's `.moneyTag` rule explicitly excludes a
 * sum-in-progress from the tag treatment, so this reuses that existing
 * pattern rather than inventing a new one. The final total still appears
 * once more, unchanged, at Finalizar Venta's own receipt.
 *
 * Composition (High-Fidelity revision): each line renders as a small tag
 * chip in that Product's own tone — the same color already seen on its
 * selling tile — settling into place as it's added. This is the same
 * information the original flat "Playeras · Sudaderas" text line carried
 * (product names only, aggregated, no price, no unit/lot), just composed
 * as a visible, tactile stack of stubs instead of a sentence — the point
 * being that a sale in progress should *look* like something is
 * accumulating, not read like a caption.
 *
 * Exit animation (design-audit-2026-08-15 #3): chips had a staggered
 * entrance (`chipSettle`) but no exit — `onCancel` (via the caller's own
 * confirmation step) previously made the whole row vanish in the single
 * re-render frame where `lines` goes from N items to none. Plain CSS can't
 * animate an element that's already been removed from the DOM, so this
 * component keeps its own local snapshot (`renderedLines`/`renderedSubtotal`)
 * a beat longer than the real `lines`/`subtotal` props whenever that exact
 * "went from something to empty" transition happens, plays a brief,
 * staggered "torn off the string" exit on each chip, then clears the
 * snapshot once the animation has actually finished. This is a rendering-
 * timing change only — `onCancel`/"Cancelar clears the whole sale" is
 * untouched; this component has no say over *when* `lines` empties, only
 * over how long it keeps showing the chips that were there a moment ago.
 */
export function VentaActualTray({
  lines,
  subtotal,
  onCancel,
}: {
  lines: SaleLine[];
  subtotal: number;
  onCancel: () => void;
}) {
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ).current;

  const [renderedLines, setRenderedLines] = useState(lines);
  const [renderedSubtotal, setRenderedSubtotal] = useState(subtotal);
  const [exiting, setExiting] = useState(false);
  const clearTimerRef = useRef<number>();

  useEffect(() => {
    const isClearing = lines.length === 0 && renderedLines.length > 0;
    if (isClearing && !reduceMotion) {
      setExiting(true);
      const staggeredCount = Math.min(renderedLines.length, MAX_STAGGERED);
      const totalMs = EXIT_DURATION_MS + (staggeredCount - 1) * EXIT_STAGGER_MS;
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = window.setTimeout(() => {
        setRenderedLines(lines);
        setRenderedSubtotal(subtotal);
        setExiting(false);
      }, totalMs);
      return () => window.clearTimeout(clearTimerRef.current);
    }
    // Not a clear-to-empty transition (a fresh sale starting, an item
    // added/changed, or reduced motion) — sync immediately, same as before
    // this pass.
    window.clearTimeout(clearTimerRef.current);
    setExiting(false);
    setRenderedLines(lines);
    setRenderedSubtotal(subtotal);
    return undefined;
    // renderedLines/renderedSubtotal are intentionally not in the deps —
    // this effect only needs to compare the *previous* snapshot against the
    // *incoming* props, not re-run every time the snapshot itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, subtotal]);

  const isEmpty = renderedLines.length === 0;
  const totalCount = renderedLines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <div className={styles.tray}>
      <div className={styles.headRow}>
        <span className={styles.label}>
          Venta actual:{' '}
          {isEmpty ? (
            <span className={styles.emptyMark}>(vacía)</span>
          ) : (
            <>
              {articulos(totalCount)} · <strong className={styles.subtotal}>{pesos(renderedSubtotal)}</strong>
            </>
          )}
        </span>
        {!isEmpty && !exiting && (
          <button className={styles.cancel} onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
      {!isEmpty && (
        <div className={styles.chipRow}>
          {renderedLines.map((line, i) => {
            const tone = toneForProduct(line.name);
            return (
              <span
                key={line.productId}
                className={`${styles.chip} ${exiting ? styles.chipExit : ''}`}
                style={
                  {
                    '--tone-bg': tone.bg,
                    '--tone-ink': tone.ink,
                    '--delay': `${Math.min(i, MAX_STAGGERED) * 35}ms`,
                    '--tearDelay': `${Math.min(i, MAX_STAGGERED - 1) * EXIT_STAGGER_MS}ms`,
                  } as CSSProperties
                }
              >
                <TagStub name={line.name} size={20} tilt={false} />
                <span className={styles.chipName}>{line.name}</span>
                {line.qty > 1 && <span className={styles.chipQty}>×{line.qty}</span>}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
