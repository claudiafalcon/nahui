import type { CSSProperties } from 'react';
import { TagStub } from '../TagStub/TagStub';
import { toneForProduct } from '../../styles/productIdentity';
import { articulos, pesos } from '../../domain/format';
import styles from './VentaActualTray.module.css';

export interface SaleLine {
  productId: string;
  name: string;
  qty: number;
}

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
  const isEmpty = lines.length === 0;
  const totalCount = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <div className={styles.tray}>
      <div className={styles.headRow}>
        <span className={styles.label}>
          Venta actual:{' '}
          {isEmpty ? (
            <span className={styles.emptyMark}>(vacía)</span>
          ) : (
            <>
              {articulos(totalCount)} · <strong className={styles.subtotal}>{pesos(subtotal)}</strong>
            </>
          )}
        </span>
        {!isEmpty && (
          <button className={styles.cancel} onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
      {!isEmpty && (
        <div className={styles.chipRow}>
          {lines.map((line, i) => {
            const tone = toneForProduct(line.name);
            return (
              <span
                key={line.productId}
                className={styles.chip}
                style={
                  {
                    '--tone-bg': tone.bg,
                    '--tone-ink': tone.ink,
                    '--delay': `${Math.min(i, 6) * 35}ms`,
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
