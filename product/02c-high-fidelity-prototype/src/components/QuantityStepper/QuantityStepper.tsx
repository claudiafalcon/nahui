import { useEffect, useState } from 'react';
import styles from './QuantityStepper.module.css';

/**
 * inventory.md §3.6 (INV-Q1) — Cantidad defaults to 1, floor of 1, a visible
 * tappable/editable affordance (never plain display text), and a "revisa
 * antes de guardar" marker that disappears the instant she engages the
 * field in any way — even if the value stays 1.
 *
 * **`min`/`max`/`showMarker` (`decision-log.md` D77) — added for Cantidad
 * actual, the correction stepper §3.6 reuses this exact component for,
 * "with a ceiling in place of a floor-only rule."** Every existing caller
 * (Cantidad itself, `SellingGroups.tsx`) omits all three and keeps its
 * original floor-of-1/no-ceiling/marker-shown behavior unchanged — `min`
 * defaults to 1, `max` to unbounded, `showMarker` to `true`.
 */
export function QuantityStepper({
  value,
  touched,
  onChange,
  min = 1,
  /** D77 — Cantidad actual's ceiling (the `disponibles` count loaded when
   * Producto resolved). `undefined` means no ceiling, the original
   * behavior every other existing caller keeps. */
  max,
  /** D77 — Cantidad actual is a known, already-loaded fact, never a guess
   * (§3.6), so it never carries the "· revisa antes de guardar" marker
   * regardless of `touched`. */
  showMarker = true,
  ariaLabel = 'Cantidad',
}: {
  value: number;
  touched: boolean;
  onChange: (next: number, touched: boolean) => void;
  min?: number;
  max?: number;
  showMarker?: boolean;
  ariaLabel?: string;
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
    const clamped = max !== undefined ? Math.min(max, next) : next;
    onChange(Math.max(min, clamped), true);
  }

  return (
    <div className={styles.row}>
      <button className={styles.stepBtn} onClick={() => set(value - 1)} disabled={value <= min} aria-label="Menos">
        −
      </button>
      <div className={`${styles.valueWrap} ${showMarker && !touched ? styles.reviewMarker : ''}`}>
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
            // Only commit while she's typed an actual valid-at-or-above-the-
            // floor number — an empty/mid-edit field is a real, allowed
            // local state, not immediately clamped back (see the comment
            // above `text`'s own declaration for why). D77's Cantidad
            // actual has `min = 0`, so typing "0" now commits immediately
            // here too, unlike Cantidad's own `min = 1`, where it still
            // waits for blur (below) the same way it always has.
            if (digitsOnly !== '') {
              const n = parseInt(digitsOnly, 10);
              if (Number.isFinite(n) && n >= min) onChange(n, true);
            }
          }}
          onBlur={() => {
            setFocused(false);
            // She's done editing — this is the one moment the floor/ceiling
            // actually apply. If she leaves the field empty or below the
            // floor, fall back to the last valid committed value (never
            // below the floor). D77 — a typed value above the ceiling
            // (Cantidad actual only; every other caller has no `max`)
            // reverts to the ceiling instead — "a no-op, nothing to
            // correct" (§3.6), not an error.
            const n = parseInt(text, 10);
            if (!Number.isFinite(n) || n < min) {
              const fallback = Math.max(min, value);
              setText(String(fallback));
              onChange(fallback, true);
            } else if (max !== undefined && n > max) {
              setText(String(max));
              onChange(max, true);
            }
          }}
          aria-label={ariaLabel}
        />
        {showMarker && !touched && <span className={styles.marker}>· revisa antes de guardar</span>}
      </div>
      <button
        className={styles.stepBtn}
        onClick={() => set(value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label="Más"
      >
        +
      </button>
    </div>
  );
}
