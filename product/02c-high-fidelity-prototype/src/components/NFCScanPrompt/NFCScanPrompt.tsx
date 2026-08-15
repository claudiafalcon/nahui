import type { ReactNode } from 'react';
import { TagStub } from '../TagStub/TagStub';
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
 *
 * **Glyph (design-audit-2026-08-15 #1).** The pulsing ring used to hold a
 * generic Wi-Fi/broadcast-wave SVG, disconnected from the system's own
 * vocabulary. The NFC tag being scanned here *is*, physically, the same
 * swing tag the whole visual system is built from — it stays with the
 * customer as part of the loyalty journey (`company/CLAUDE.md`). Swapped
 * for a larger `TagStub` silhouette (`showLetter={false}`, an explicit
 * neutral `tone` override — see `TagStub`'s own doc comment for why a bare
 * name-derived tone can't be used here) at the "Small" scale
 * (`DESIGN-SYSTEM.md` §4) rather than inventing a sixth device. Pure glyph
 * swap — no copy/behavior change.
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
        <TagStub
          name=""
          size={52}
          showLetter={false}
          tone={{ bg: 'var(--color-white)', ink: 'var(--color-white)' }}
        />
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
