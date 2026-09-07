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
 * selling grid, tying the catalog she manages to the grid she sells from. */
export function CatalogRow({
  name,
  photo,
  price,
  available,
  everReceived,
  onTapRow,
  onTapPrice,
  onTapPhoto,
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
}) {
  const dimmed = available <= 0;
  const caption = !everReceived ? 'sin registrar' : `${available} disponibles`;
  const tone = toneForProduct(name);

  return (
    <div
      className={`${styles.row} stitchBottom ${dimmed ? styles.dimmed : ''}`}
      style={{ '--tone-bg': tone.bg } as CSSProperties}
    >
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
    </div>
  );
}
