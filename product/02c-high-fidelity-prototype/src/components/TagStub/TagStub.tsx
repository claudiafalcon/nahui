import type { CSSProperties } from 'react';
import { tiltForProduct, toneForProduct, type TagTone } from '../../styles/productIdentity';
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
 *
 * `showLetter`/`tone` (design-audit-2026-08-15 #1, NFC scan prompt glyph
 * swap): optional overrides so this exact shape can stand in for a *generic*
 * tag silhouette — no real Product behind it — rather than only ever a
 * per-Product marker. `showLetter=false` renders just the body/hole/string
 * (no initial). `tone` bypasses the name-derived hash entirely; the one
 * consumer that needs it (`NFCScanPrompt`) is decorative and has no
 * Product name to hash in the first place, and an empty-string name would
 * otherwise deterministically collide with `--tag-1-bg`, which is the exact
 * same hex as `--color-blush` — invisible against that prompt's own blush
 * ring. Both default to the prior behavior — every existing call site is
 * unaffected.
 */
export function TagStub({
  name,
  muted,
  size = 34,
  tilt = true,
  showLetter = true,
  tone: toneOverride,
}: {
  name: string;
  muted?: boolean;
  size?: number;
  tilt?: boolean;
  showLetter?: boolean;
  tone?: TagTone;
}) {
  const letter = name.trim().charAt(0).toUpperCase() || '?';
  const tone = toneOverride ?? toneForProduct(name);
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
      {showLetter && <span className={styles.letter}>{letter}</span>}
    </div>
  );
}
