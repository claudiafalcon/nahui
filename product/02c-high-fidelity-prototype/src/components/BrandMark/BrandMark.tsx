/**
 * A simple, original interpretation of brand-guide.md's mark description:
 * "four elements converging at a shared center... not a cross." Four
 * rounded petals meeting at an empty center point. Used sparingly — cold
 * start and the nav's own visual language only, never competing with the
 * merchant's own identity on the receipt (home.md §3.8f already specifies
 * Business.name/logo takes that spot, not Nahui's own mark).
 */
export function BrandMark({ size = 28, color = 'var(--color-tezontle-dark)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="13" y="2" width="6" height="12" rx="3" fill={color} />
      <rect x="13" y="18" width="6" height="12" rx="3" fill={color} />
      <rect x="2" y="13" width="12" height="6" rx="3" fill={color} />
      <rect x="18" y="13" width="12" height="6" rx="3" fill={color} />
    </svg>
  );
}
