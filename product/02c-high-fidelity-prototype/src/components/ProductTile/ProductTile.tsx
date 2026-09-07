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
  photo,
  available,
  eventRemaining,
  countInSale,
  onTap,
  onDisabledTap,
}: {
  name: string;
  /** `Product.photo` (`product-decisions.md` Q23) — display-only
   * substitution in the tile's marker position, identical footprint, zero
   * new interaction. See `TagStub`'s own doc comment for the render-failure
   * fallback (silent revert to the initial letter). */
  photo?: string;
  available: number;
  /** home.md §3.9's own new Event-scoped remaining-stock line (Slice 12,
   * `product-decisions.md` Q24/Q25) — `null`/`undefined` when no `open`
   * `EventAllocation` applies (a Quick Session, or an Event-linked one where
   * this Product was never allocated), in which case this tile behaves
   * exactly as before, gated only by `available`. When a number, it — not
   * the plain Business-wide `available` figure — becomes the sold-out gate:
   * a pre-emptive signal reducing (never eliminating) how often the "lost
   * the race" terminal state (`Selling.tsx`) is actually hit. */
  eventRemaining?: number | null;
  /** How many units of this Product are already in the open Sale — a purely
   * local aggregation of `Sale.items` (already-available data, home.md
   * §3.8), never a new domain attribute. Surfaces as a small badge so a
   * tile she's already tapped this sale reads differently from one she
   * hasn't, at a glance, mid-transaction. */
  countInSale?: number;
  onTap: () => void;
  /** Called instead of `onTap` when the tile is sold out (`available <= 0`,
   * or — when an Event-scoped allocation applies — `eventRemaining <= 0`).
   * A native `disabled` button intercepts pointer events entirely — a real
   * device tap on it produces literally nothing, which a first-time
   * merchant reads as the app being broken rather than "no stock"
   * (`merchant-user-tester` finding, `product/02-ux/
   * experience-review-2026-08-13-eventos.md`). Left unwired, a sold-out tap
   * is still a harmless no-op — same as before. */
  onDisabledTap?: () => void;
}) {
  const eventScoped = eventRemaining != null;
  const soldOut = eventScoped ? eventRemaining! <= 0 : available <= 0;
  const tone = toneForProduct(name);
  const active = !!countInSale && countInSale > 0;
  // ux-critic fix round (Slice 12) — the figure that actually gates this
  // tile's tappability: `eventRemaining` when event-scoped, `available`
  // otherwise. `aria-label` must announce this, not always the plain
  // Business-wide `available` count — previously a screen-reader user could
  // hear a nonzero "disponibles" announcement on a tile gated (dimmed,
  // non-tappable) by a lower `eventRemaining` figure instead.
  const gatingStockLabel = eventScoped ? `${eventRemaining} en este evento` : `${available} disponibles`;

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
      aria-label={`${name}, ${gatingStockLabel}${active ? `, ${countInSale} en esta venta` : ''}`}
      style={{ '--tone-bg': tone.bg } as CSSProperties}
    >
      {/* the pinned marker breaks the tile's own frame — a real object
          sitting on top of the surface below, not contained by it, so it
          must live outside the clipped `.surface` (which needs its own
          overflow:hidden for the die-cut corner to read as a clean bite
          rather than a floating shape — see .surface's own comment). */}
      <span className={styles.pin}>
        <TagStub name={name} photo={photo} muted={soldOut} size={40} />
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
          {/* home.md §3.9 — "'0 en este evento' replaces '0 disponibles'
              specifically when the tile's zero is an allocation exhaustion,
              not a Business-wide stockout" — a materially different, more
              honest fact, so this is a substitution, not an addition, for
              the exhausted case specifically. **ux-critic fix round (Slice
              12) — the non-zero event-scoped case is also a substitution,
              not an addition**: §3.9 reads `EventAllocation.quantityRemaining`
              "never the plain, Business-wide 'disponibles' figure, which
              stays exactly as invisible here as it always was outside a
              sold-out tile." Showing both at once on an event-scoped,
              non-exhausted tile put two different, competing stock numbers
              on screen simultaneously — fixed here so an event-scoped tile
              ever shows exactly one stock figure, "N en este evento" (or
              "0 en este evento" once exhausted), never both. The
              non-event-scoped tile's own plain-caption rendering is
              unchanged — out of this fix's scope. Verified live at
              realistic two-digit counts, not assumed correct from this
              comment alone. */}
          {eventScoped ? (
            <span className={styles.eventLine}>{soldOut ? '0 en este evento' : `${eventRemaining} en este evento`}</span>
          ) : (
            <span className={styles.caption}>{soldOut ? '0 disponibles' : `${available} disponibles`}</span>
          )}
        </span>
      </span>
    </button>
  );
}
