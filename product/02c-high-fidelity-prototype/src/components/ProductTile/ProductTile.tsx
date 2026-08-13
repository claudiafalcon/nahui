import type { CSSProperties } from 'react';
import { TagStub } from '../TagStub/TagStub';
import { toneForProduct } from '../../styles/productIdentity';
import styles from './ProductTile.module.css';

export function ProductTile({
  name,
  available,
  countInSale,
  onTap,
}: {
  name: string;
  available: number;
  /** How many units of this Product are already in the open Sale — a purely
   * local aggregation of `Sale.items` (already-available data, home.md
   * §3.8), never a new domain attribute. Surfaces as a small badge so a
   * tile she's already tapped this sale reads differently from one she
   * hasn't, at a glance, mid-transaction. */
  countInSale?: number;
  onTap: () => void;
}) {
  const soldOut = available <= 0;
  const tone = toneForProduct(name);
  const active = !!countInSale && countInSale > 0;

  return (
    <button
      className={`${styles.tile} ${soldOut ? styles.soldOut : ''} ${active ? styles.active : ''}`}
      onClick={onTap}
      disabled={soldOut}
      aria-label={`${name}, ${available} disponibles${active ? `, ${countInSale} en esta venta` : ''}`}
      style={{ '--tone-bg': tone.bg } as CSSProperties}
    >
      <span className={styles.topRow}>
        <TagStub name={name} muted={soldOut} size={38} />
        {active && <span className={styles.countBadge}>×{countInSale}</span>}
      </span>
      <span className={styles.name}>{name}</span>
      <span className={styles.caption}>{soldOut ? '0 disponibles' : `${available} disponibles`}</span>
      <span className={styles.accent} aria-hidden="true" />
    </button>
  );
}
