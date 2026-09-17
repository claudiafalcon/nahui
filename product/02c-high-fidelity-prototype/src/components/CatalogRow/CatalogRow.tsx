import type { CSSProperties } from 'react';
import { TagStub } from '../TagStub/TagStub';
import { toneForProduct } from '../../styles/productIdentity';
import styles from './CatalogRow.module.css';

/** inventory.md §3.4 — Catalog row: marker (own tap target), name/caption
 * (own tap target), price (own tap target) — three independent,
 * non-overlapping zones (`product-decisions.md` Q23's own remediation of a
 * `ux-critic` Major). Same per-Product tone as the selling tile
 * (src/styles/productIdentity.ts) — a merchant learns "Playeras is the clay
 * tag" once, in Inventario, and that same color meets her again on the
 * selling grid, tying the catalog she manages to the grid she sells from.
 *
 * **Fourth tap zone, `decision-log.md` D65's 2026-09-16/17 amendment,
 * Paid tier only** — the overflow indicator ("⋯", rightmost, after the
 * price figure) opens `inventory.md` §3.4c's "Editar código de barras"
 * sheet directly, a single destination today, not an intermediate list.
 * `onTapBarcode` is only ever passed by the caller when
 * `Business.subscriptionTier === 'paid'` (`CatalogView.tsx`'s own gate) —
 * `undefined` on a Free-tier Business, which keeps this row's existing
 * three tap zones exactly as they were, nothing added.
 *
 * **Fifth tap zone, `decision-log.md` D71's amendment
 * (`product-decisions.md` Q31).** A compact NFC-eligibility switch, rendered
 * only when the caller passes `nfcToggle` — `CatalogView.tsx`'s own gate:
 * `Business.nfcPerProductEnabled === true` AND `nfc ∈ registrationMode`
 * AND this Product has no `barcode` (§3.4's own "precise gating condition,
 * stated in full"). A bare tap flips it directly, no sheet, no confirmation
 * — the one action on this row (or anywhere in `inventory.md`) with no
 * separate confirm step. */
export function CatalogRow({
  name,
  photo,
  price,
  available,
  everReceived,
  onTapRow,
  onTapPrice,
  onTapPhoto,
  onTapBarcode,
  nfcToggle,
}: {
  name: string;
  /** `Product.photo` (`product-decisions.md` Q23) — rendered in the
   * marker's position in place of the initial letter whenever set. */
  photo?: string;
  price: number;
  available: number;
  everReceived: boolean;
  onTapRow: () => void;
  onTapPrice: () => void;
  /** Opens `inventory.md` §3.4b's "Editar foto" sheet — a bare tap on the
   * marker/photo icon, distinct from `onTapRow`/`onTapPrice`. */
  onTapPhoto: () => void;
  /** Opens `inventory.md` §3.4c's "Editar código de barras" sheet — a bare
   * tap on the "⋯" overflow indicator, distinct from every other zone on
   * this row. `undefined` on a Free-tier Business (the gate this prop's
   * own caller enforces) renders no overflow indicator at all. */
  onTapBarcode?: () => void;
  /** `inventory.md` §3.4's fifth tap zone — `undefined` renders nothing
   * (the gate this prop's own caller, `CatalogView.tsx`, enforces).
   * `saving`/`slow` distinguish the near-instant (silent dim) vs. slow
   * (>~1.5s, "Guardando…" label) cases per §3.4's own save-state
   * discipline; `error` renders the inline "No pudimos guardar" line below
   * the row, with the switch itself staying tappable as its own retry. */
  nfcToggle?: {
    enabled: boolean;
    saving: boolean;
    slow: boolean;
    error: boolean;
    onTap: () => void;
  };
}) {
  const dimmed = available <= 0;
  const caption = !everReceived ? 'sin registrar' : `${available} disponibles`;
  const tone = toneForProduct(name);
  const nfcSaving = nfcToggle?.saving ?? false;

  return (
    <div
      className={`${styles.row} stitchBottom ${dimmed ? styles.dimmed : ''}`}
      style={{ '--tone-bg': tone.bg } as CSSProperties}
    >
      {/* `settings.md` §3.9's own "fila atenuada" mechanic, composed onto
          this row's existing architecture (§3.4's own D71 text) — the whole
          row dims while the NFC switch's own write is in flight, not just
          the switch itself. */}
      <div className={`${styles.rowMain} ${nfcSaving ? styles.rowMainSaving : ''}`}>
        <button
          className={styles.marker}
          onClick={(e) => {
            e.stopPropagation();
            onTapPhoto();
          }}
          aria-label={`Editar foto de ${name}`}
        >
          <TagStub name={name} photo={photo} muted={dimmed} size={48} />
        </button>
        <button className={styles.main} onClick={onTapRow}>
          <span className={styles.name}>{name}</span>
          <span className={styles.caption}>{caption}</span>
        </button>
        <button
          className={`${styles.price} moneyTag`}
          onClick={(e) => {
            e.stopPropagation();
            onTapPrice();
          }}
        >
          ${price.toLocaleString('es-MX')}
        </button>
        {onTapBarcode && (
          <button
            className={styles.overflow}
            onClick={(e) => {
              e.stopPropagation();
              onTapBarcode();
            }}
            aria-label={`Editar código de barras de ${name}`}
          >
            ⋯
          </button>
        )}
        {nfcToggle && (
          <button
            className={`${styles.nfcToggle} ${nfcSaving ? styles.nfcToggleSaving : ''}`}
            disabled={nfcSaving}
            onClick={(e) => {
              e.stopPropagation();
              nfcToggle.onTap();
            }}
            aria-label={`${nfcToggle.enabled ? 'Desactivar' : 'Activar'} venta con NFC para ${name}`}
          >
            {nfcSaving && nfcToggle.slow ? 'Guardando…' : nfcToggle.enabled ? 'NFC: Sí' : 'NFC: No'}
          </button>
        )}
      </div>
      {nfcToggle?.error && <p className={styles.nfcError}>No pudimos guardar. Intenta de nuevo.</p>}
    </div>
  );
}
