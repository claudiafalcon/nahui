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
          type="number"
          inputMode="numeric"
          min={1}
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
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
