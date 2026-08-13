import type { CSSProperties } from 'react';
import { TagStub } from '../TagStub/TagStub';
import { toneForProduct } from '../../styles/productIdentity';
import styles from './CatalogRow.module.css';

/** inventory.md §3.4 — Catalog row: marker, name, price (own tap target), caption.
 * Same per-Product tone as the selling tile (src/styles/productIdentity.ts)
 * — a merchant learns "Playeras is the clay tag" once, in Inventario, and
 * that same color meets her again on the selling grid, tying the catalog
 * she manages to the grid she sells from. */
export function CatalogRow({
  name,
  price,
  available,
  everReceived,
  onTapRow,
  onTapPrice,
}: {
  name: string;
  price: number;
  available: number;
  everReceived: boolean;
  onTapRow: () => void;
  onTapPrice: () => void;
}) {
  const dimmed = available <= 0;
  const caption = !everReceived ? 'sin registrar' : `${available} disponibles`;
  const tone = toneForProduct(name);

  return (
    <div
      className={`${styles.row} ${dimmed ? styles.dimmed : ''}`}
      style={{ '--tone-bg': tone.bg } as CSSProperties}
    >
      <span className={styles.rail} aria-hidden="true" />
      <TagStub name={name} muted={dimmed} size={38} />
      <button className={styles.main} onClick={onTapRow}>
        <span className={styles.name}>{name}</span>
        <span className={styles.caption}>{caption}</span>
      </button>
      <button
        className={styles.price}
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
