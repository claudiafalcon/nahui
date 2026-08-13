import type { CSSProperties } from 'react';
import { TagStub } from '../TagStub/TagStub';
import { toneForProduct } from '../../styles/productIdentity';
import styles from './ProductTile.module.css';

/**
 * v3: the tile itself is now the signature Swing Tag shape at "medium"
 * scale (README "Design System — v3" §2/§3) — a full tone wash instead of
 * a thin accent sliver, and its own TagStub marker *pinned outside the
 * frame* (negative offset, overlapping the top-left corner) rather than
 * contained inside the card's own padding. The intent: this should read
 * as an actual tag pinned onto a folded stack of merchandise, not an icon
 * sitting inside a rounded rectangle — the selling grid as a whole should
 * look like an assorted rack of colored tags, which is the literal answer
 * to "recognizability of products" this pass was asked to sharpen.
 */
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
      {/* the pinned marker breaks the tile's own frame — a real object
          sitting on top of the surface below, not contained by it, so it
          must live outside the clipped `.surface` (which needs its own
          overflow:hidden for the die-cut corner to read as a clean bite
          rather than a floating shape — see .surface's own comment). */}
      <span className={styles.pin}>
        <TagStub name={name} muted={soldOut} size={40} />
        {active && <span className={styles.countBadge}>×{countInSale}</span>}
      </span>
      <span className={`${styles.surface} grain`}>
        <span className={styles.body}>
          <span className={styles.name}>{name}</span>
          <span className={styles.caption}>{soldOut ? '0 disponibles' : `${available} disponibles`}</span>
        </span>
      </span>
    </button>
  );
}
