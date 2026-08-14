import styles from './OptionChip.module.css';

/**
 * Tap-once, single-select choice chip group — `company/brand/brand-guide.md`'s
 * OptionChip component, first built specifically for this screen
 * (`customer-loyalty-registration.md` §3.6: rango de edad / género).
 * Reused here, not reinvented, per that guide's own instruction. Selecting
 * an already-selected value clears the selection — same shape §3.6's own
 * "leaving both untouched... is the entire mechanism" requires for
 * genuinely optional fields (no separate way to "unselect" would leave no
 * honest path back to blank).
 */
export function OptionChip({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: readonly string[];
  value: string | undefined;
  onChange: (next: string | undefined) => void;
  ariaLabel: string;
}) {
  return (
    <div className={styles.group} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            className={[styles.chip, selected ? styles.selected : ''].filter(Boolean).join(' ')}
            aria-pressed={selected}
            onClick={() => onChange(selected ? undefined : option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
