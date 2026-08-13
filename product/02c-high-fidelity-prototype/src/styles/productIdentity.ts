/**
 * Presentation-only derivation of a per-Product visual tone — never touches
 * src/domain/. Product.name is already the one fact this reads (the same
 * source TagStub's own letter-marker already derives from, home.md §3.9) —
 * no new attribute, no schema change, nothing extra for Ana to enter.
 *
 * Deterministic: the same Product.name always resolves to the same tone
 * and the same small marker rotation, everywhere it's rendered (Catalog
 * row, selling tile, Venta Actual chip, Registrar mercancía's committed
 * lines) — so a merchant learns "Playeras is the clay-brown tag" once and
 * that association holds across every screen, not just within one of them.
 * This is what answers "visual richness and recognizability of products"
 * without inventing product photography this domain doesn't have.
 */

export interface TagTone {
  bg: string; // CSS var reference, e.g. 'var(--tag-3-bg)'
  ink: string;
}

const TONE_COUNT = 12;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function toneForProduct(name: string): TagTone {
  const index = (hashString(name.trim().toLowerCase()) % TONE_COUNT) + 1;
  return { bg: `var(--tag-${index}-bg)`, ink: `var(--tag-${index}-ink)` };
}

/** A small, consistent tilt (-4deg..4deg) for the decorative tag marker only
 * — never applied to a full tap target, so grid precision/speed is
 * unaffected. Gives the marker a hand-placed, pinned-on feel rather than a
 * mechanically perfect grid of identical icons. */
export function tiltForProduct(name: string): number {
  const h = hashString(`tilt:${name.trim().toLowerCase()}`);
  return (h % 9) - 4; // -4..4
}
