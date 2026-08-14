import type { ReactNode } from 'react';
import styles from './NFCScanPrompt.module.css';

/**
 * inventory.md §3.14 — "Acerca el tag a la prenda." Real NFC hardware
 * satisfies this passively (holding a tag near the phone), which a browser
 * can't reproduce; this is that physical gesture simulated as a tap target
 * — the same "mock the physical mechanism, keep every screen state honest"
 * disclosure this codebase's phone-OTP mock already established (any
 * 6-digit code accepted, `authentication.md` §3.7). Named after the
 * Medium-Fidelity precedent component (`product/02b-medium-fidelity/inventory.md`'s
 * own `NFCScanPrompt`, reused on `home.md`'s NFC selling surface too) rather
 * than anything "Tag"-adjacent — `src/components/TagStub/` is a distinct,
 * decorative per-Product marker with no relationship to `NFCTag`/`tagId`.
 *
 * **`label`/`ariaLabel` (NFC Selling pass, D43).** Optional overrides so this
 * exact component can be reused, unchanged, on `home.md` §3.10's selling
 * surface — whose own approved copy is "Acerca el tag del producto," not
 * Asignar Tags' "Acerca el tag a la prenda" — per the Architecture Gap
 * Analysis's own instruction ("reusing `NFCScanPrompt` from the Asignar Tags
 * slice"). Default (no props passed) is unchanged, so `AssignTags.tsx`'s
 * existing call site needs no change.
 */
export function NFCScanPrompt({
  onTap,
  disabled,
  label,
  ariaLabel,
}: {
  onTap: () => void;
  disabled?: boolean;
  label?: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      className={styles.prompt}
      onClick={onTap}
      disabled={disabled}
      aria-label={ariaLabel ?? 'Acerca el tag a la prenda'}
    >
      <span className={styles.ring} aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <circle cx="17" cy="17" r="3.4" fill="currentColor" />
          <path d="M11.8 11.8a7.4 7.4 0 0 1 10.4 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M7.2 7.2a13.6 13.6 0 0 1 19.6 0"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </span>
      <span className={styles.label}>
        {label ?? (
          <>
            Acerca el tag a la
            <br />
            prenda
          </>
        )}
      </span>
    </button>
  );
}
