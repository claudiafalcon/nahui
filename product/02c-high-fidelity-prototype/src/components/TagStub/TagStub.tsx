import type { CSSProperties } from 'react';
import { tiltForProduct, toneForProduct } from '../../styles/productIdentity';
import styles from './TagStub.module.css';

/**
 * TagStub — the per-Product marker (home.md §3.9 / inventory.md §3.4: first
 * letter of Product.name). Styled as a miniature swing-tag: a rounded
 * square with a punched hole and a short loop of "string," carrying its
 * own deterministic tone (src/styles/productIdentity.ts) so the same
 * Product reads as the same color everywhere — Catalog row, selling tile,
 * Venta Actual chip. One consistent visual vocabulary for "this represents
 * a Product," echoing the receipt's own Tag Tear signature element at a
 * small scale, not a decorative afterthought.
 */
export function TagStub({
  name,
  muted,
  size = 34,
  tilt = true,
}: {
  name: string;
  muted?: boolean;
  size?: number;
  tilt?: boolean;
}) {
  const letter = name.trim().charAt(0).toUpperCase() || '?';
  const tone = toneForProduct(name);
  const rotation = tilt ? tiltForProduct(name) : 0;

  return (
    <div
      className={`${styles.tag} ${muted ? styles.muted : ''}`}
      aria-hidden="true"
      style={
        {
          '--size': `${size}px`,
          '--tone-bg': tone.bg,
          '--tone-ink': tone.ink,
          '--tilt': `${rotation}deg`,
        } as CSSProperties
      }
    >
      <span className={styles.string} />
      <span className={styles.letter}>{letter}</span>
    </div>
  );
}
