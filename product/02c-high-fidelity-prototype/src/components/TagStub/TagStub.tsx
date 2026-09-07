import { useEffect, useState, type CSSProperties } from 'react';
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
 *
 * `photo` (`product-decisions.md` Q23, `decision-log.md` D54) — when set,
 * renders `Product.photo` in place of the initial letter, the identical
 * substitution rule `inventory.md` §3.4/§3.4b and `home.md` §3.9 both
 * specify, applying identically wherever this one marker component is used
 * (Catalog row, selling tile, committed-line previews). **Fallback is
 * silent and local to this component, by design (§3.4b's own reasoning):**
 * a photo that fails to load (`onError`) flips a local "failed" flag and the
 * marker reverts to its plain letter rendering — no broken-image glyph, no
 * message, no retry affordance, since every consumer of this component
 * already treats "no photo" as a completely normal, first-class state. The
 * flag resets whenever `photo` itself changes (a new selection, or the
 * photo being removed/replaced elsewhere) so a stale failure never sticks to
 * a since-corrected value.
 */
export function TagStub({
  name,
  photo,
  muted,
  size = 34,
  tilt = true,
  showLetter = true,
  tone: toneOverride,
}: {
  name: string;
  photo?: string;
  muted?: boolean;
  size?: number;
  tilt?: boolean;
  showLetter?: boolean;
  tone?: TagTone;
}) {
  const [photoFailed, setPhotoFailed] = useState(false);
  useEffect(() => {
    setPhotoFailed(false);
  }, [photo]);

  const letter = name.trim().charAt(0).toUpperCase() || '?';
  const tone = toneOverride ?? toneForProduct(name);
  const rotation = tilt ? tiltForProduct(name) : 0;
  const showPhoto = !!photo && !photoFailed;

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
      {showPhoto ? (
        <span className={styles.photoClip}>
          <img className={styles.photo} src={photo} alt="" onError={() => setPhotoFailed(true)} />
        </span>
      ) : (
        showLetter && <span className={styles.letter}>{letter}</span>
      )}
    </div>
  );
}
