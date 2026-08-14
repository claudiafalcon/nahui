import { Sheet } from '../Sheet/Sheet';
import type { EventType } from '../../domain/types';
import { EVENT_TYPE_LABELS, EVENT_TYPE_ORDER } from '../../screens/Events/eventTypeLabels';
import styles from '../ProductPicker/ProductPicker.module.css';

/**
 * events.md §3.8 — Elegir tipo. A plain, closed six-row list (no search, no
 * "add new type" affordance — Q6, `product/02-ux/product-decisions.md`,
 * leaves whether the list is open-ended genuinely unresolved by the
 * Foundation, so this picker conservatively shows no such affordance,
 * exactly as the approved spec specifies).
 */
export function EventTypeSheet({
  onDismiss,
  onSelect,
}: {
  onDismiss: () => void;
  onSelect: (type: EventType) => void;
}) {
  return (
    <Sheet onDismiss={onDismiss}>
      <p className={styles.sheetTitle}>¿Qué tipo de evento es?</p>
      <div className={styles.list}>
        {EVENT_TYPE_ORDER.map((type) => (
          <button key={type} className={`${styles.option} stitchBottom`} onClick={() => onSelect(type)}>
            {EVENT_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
