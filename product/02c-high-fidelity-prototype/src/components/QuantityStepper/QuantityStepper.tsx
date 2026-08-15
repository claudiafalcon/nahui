import { useEffect, useState } from 'react';
import styles from './QuantityStepper.module.css';

/**
 * inventory.md §3.6 (INV-Q1) — Cantidad defaults to 1, floor of 1, a visible
 * tappable/editable affordance (never plain display text), and a "revisa
 * antes de guardar" marker that disappears the instant she engages the
 * field in any way — even if the value stays 1.
 */
export function QuantityStepper({
  value,
  touched,
  onChange,
}: {
  value: number;
  touched: boolean;
  onChange: (next: number, touched: boolean) => void;
}) {
  // Real-device testing found the floor-of-1 rule, when enforced on every
  // keystroke against the committed `value` prop directly, made it
  // impossible to ever clear the field: the instant she deleted the "1" to
  // type a fresh number, the field read as empty for a moment, `onChange`
  // below fell back to 1 (nothing else is a valid floor-respecting value
  // for an empty string), and the "1" reappeared before her next keystroke
  // landed — from her side, indistinguishable from the digit simply
  // refusing to delete. Local `text` state lets the field sit empty
  // mid-edit without that round-trip; the floor is enforced only once, on
  // blur, when she's actually done typing.
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  function set(next: number) {
    onChange(Math.max(1, next), true);
  }

  return (
    <div className={styles.row}>
      <button className={styles.stepBtn} onClick={() => set(value - 1)} disabled={value <= 1} aria-label="Menos">
        −
      </button>
      <div className={`${styles.valueWrap} ${!touched ? styles.reviewMarker : ''}`}>
        <input
          className={styles.input}
          // `type="text"` + `inputMode="numeric"`, not `type="number"` —
          // real-device testing found `.select()` (below) silently no-ops
          // on `type="number"` in some browsers (Safari in particular; the
          // HTML spec never actually requires number/email/tel inputs to
          // support the Selection API the way text inputs do, so this
          // isn't an edge case, it's the documented, expected behavior).
          // `inputMode="numeric"` still gets her the numeric keypad on
          // mobile; `pattern` is a semantic hint only, enforcement happens
          // in `onChange`/`onBlur` below by stripping non-digits.
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={text}
          onFocus={(e) => {
            // Product Owner-reported bug: with no focus handling, tapping
            // into the field (which defaults to 1, per §3.6/INV-Q1) placed
            // the cursor *after* the existing value, so typing "20" produced
            // "120" instead of replacing it. Selecting the full current
            // value the instant the field is focused/tapped is the standard
            // pattern for a numeric input carrying a default value — the
            // first keystroke now replaces the whole thing, matching §3.6's
            // "jumping straight to a larger count without repeated taps."
            // Corrected (reviewer Blocker — §3.6/§10 explicitly list
            // "tapping the number to open teclado numérico" as its own
            // fourth trigger, alongside [-]/[+]/typed entry, that dismisses
            // the marker "even if the value stays 1": a bare tap that opens
            // the keypad must dismiss it on its own, not only an actual edit.
            e.target.select();
            setFocused(true);
            if (!touched) onChange(value, true);
          }}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
            setText(digitsOnly);
            // Only commit upward once she's typed an actual positive
            // number — an empty/mid-edit field is a real, allowed local
            // state, not immediately clamped back to the floor (see the
            // comment above `text`'s own declaration for why).
            if (digitsOnly !== '') {
              const n = parseInt(digitsOnly, 10);
              if (Number.isFinite(n) && n > 0) onChange(n, true);
            }
          }}
          onBlur={() => {
            setFocused(false);
            // She's done editing — this is the one moment the floor of 1
            // actually applies. If she leaves the field empty or at 0,
            // fall back to the last valid committed value (never below 1).
            const n = parseInt(text, 10);
            if (!Number.isFinite(n) || n < 1) {
              const fallback = Math.max(1, value);
              setText(String(fallback));
              onChange(fallback, true);
            }
          }}
          aria-label="Cantidad"
        />
        {!touched && <span className={styles.marker}>· revisa antes de guardar</span>}
      </div>
      <button className={styles.stepBtn} onClick={() => set(value + 1)} aria-label="Más">
        +
      </button>
    </div>
  );
}
