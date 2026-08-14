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
  onDisabledTap,
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
  /** Called instead of `onTap` when the tile is sold out (`available <= 0`).
   * A native `disabled` button intercepts pointer events entirely — a real
   * device tap on it produces literally nothing, which a first-time
   * merchant reads as the app being broken rather than "no stock"
   * (`merchant-user-tester` finding, `product/02-ux/
   * experience-review-2026-08-13-eventos.md`). Left unwired, a sold-out tap
   * is still a harmless no-op — same as before. */
  onDisabledTap?: () => void;
}) {
  const soldOut = available <= 0;
  const tone = toneForProduct(name);
  const active = !!countInSale && countInSale > 0;

  function handleClick() {
    if (soldOut) {
      onDisabledTap?.();
    } else {
      onTap();
    }
  }

  return (
    <button
      className={`${styles.tile} ${soldOut ? styles.soldOut : ''} ${active ? styles.active : ''}`}
      onClick={handleClick}
      aria-disabled={soldOut || undefined}
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
        {active && (
          <span key={countInSale} className={styles.countBadge}>
            ×{countInSale}
          </span>
        )}
      </span>
      {/* `key` forces a remount on every qty change (not just the first tap),
          replaying `.confirmBump`/`.countBadge`'s own entrance keyframes —
          the tactile "yes, got it" feedback a real tap during a live sale
          needs, distinct from `:active`'s press-only scale (which reverts
          the instant she lifts her thumb, before she's looked back down at
          the tile). Only applied once `active` (never on the tile's own
          first paint), so a fresh grid never appears to "pop" on load. */}
      <span
        key={active ? countInSale : 'idle'}
        className={`${styles.surface} grain ${active ? styles.confirmBump : ''}`}
      >
        <span className={styles.body}>
          <span className={styles.name}>{name}</span>
          <span className={styles.caption}>{soldOut ? '0 disponibles' : `${available} disponibles`}</span>
        </span>
      </span>
    </button>
  );
}
