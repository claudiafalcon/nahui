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
          // in `onChange` below by stripping non-digits.
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
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
            if (!touched) onChange(value, true);
          }}
          onChange={(e) => {
            const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
            const n = parseInt(digitsOnly, 10);
            onChange(Number.isFinite(n) && n > 0 ? n : 1, true);
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
