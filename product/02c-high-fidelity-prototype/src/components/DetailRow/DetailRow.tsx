import styles from './DetailRow.module.css';

/**
 * **The Level-2 detail-row vocabulary** — `inventory.md` §3.19's own
 * "Level-2 row shapes — three, each readable before the tap. Binding, not
 * illustrative," built once here so a future screen with the same job (one
 * entity, a stack of details, some edited through a sheet and some written in
 * place) reuses it rather than re-deriving three near-identical rows.
 * Recorded in `DESIGN-SYSTEM.md` §10 as a reusable primitive.
 *
 * | Shape | Renders as | Behaviour |
 * |---|---|---|
 * | `value`   | `Label            valor ›` | Opens a staged sheet with a Cancelar/Guardar pair. Writes nothing on tap. |
 * | `action`  | `Acción                  ›` | Same, with no value to show. |
 * | `instant` | `Label                Sí`   | Writes immediately on tap. **Never carries "›".** |
 *
 * **Every row is a tap target — there is no passive row shape, deliberately**
 * (§3.19). A passive fact placed on this level sits among rows that all read
 * as controls and gets pulled toward control-shaped copy by its neighbours;
 * worse, it tends to get sourced from whatever stored flag is nearest rather
 * than from live state. Passive facts belong one level up, as plain figures
 * with no trailing slot and no target. **A row with no live control is absent
 * from the level entirely, never present-and-inert.**
 *
 * **Signal one — the forward indicator, stated affirmatively.** Every row
 * that opens a separate surface carries a trailing "›" after its value,
 * unconditionally. The instant-write row never carries it, and a
 * sheet-opening row may never omit it. A rule about one row's *absence* would
 * be no signal at all. (`inventory.md` §3.8's `[ Elegir producto ▾ ]` and
 * `events.md` §3.15's `[ Vendiendo ahora · Día 2 ▸ ]` already establish a
 * trailing directional glyph as vocabulary in this document family — this is
 * not new notation.)
 *
 * **Signal two — what kind of thing the trailing element is.** A
 * sheet-opening row trails an **open-ended value** she can read but not change
 * from here (`$250`, `Con foto`, `7501234567890`, `Camisas`). The
 * instant-write row trails a **two-position state from a closed, binary
 * vocabulary** — `Sí` or `No`, never anything else, ever, which is why
 * `InstantRowValue` below is a literal union rather than a `string`. One is a
 * fact being reported; the other is the current position of a control.
 *
 * **Why two signals and not one.** The chevron is a small mark at the far edge
 * of a row; the binary-vocabulary rule holds even if she never looks there.
 * They fail independently, which is the point. Neither is a visual-design
 * decision — one is the presence of a forward affordance, the other the
 * cardinality of a value's vocabulary.
 *
 * **No row may mix shapes.** A sheet-opening row with a binary value (a
 * hypothetical `Vender con tag NFC   Sí ›`) is forbidden outright: it would
 * carry both signals and resolve to neither. The type below makes that
 * unrepresentable. If a future amendment needs a binary fact edited through a
 * sheet, it renders the value as something other than `Sí`/`No` and carries
 * the "›" — the vocabulary is what's reserved, not the fact.
 *
 * Deliberately one of this design system's **conventional** controls
 * (`DESIGN-SYSTEM.md` §8): a plain list row, not a Swing-Tag device. It
 * represents a stored *setting or attribute* of a Product, not money, not the
 * Product itself, and not a torn transition between two zones of a screen —
 * the identical reasoning that already keeps `Button`/`Sheet`/form inputs
 * plain, and that DESIGN-SYSTEM §8 applied to the on/off switch this row's
 * `instant` shape replaces.
 */

/** The closed, two-position vocabulary an instant-write row may trail — and
 * the only one it may ever trail (§3.19's shape-3 contract). Typed as a
 * literal union on purpose: a future caller cannot widen it to an arbitrary
 * string without editing this line and confronting the rule. */
export type InstantRowValue = 'Sí' | 'No';

export type DetailRowProps =
  | {
      shape: 'value';
      label: string;
      /** The open-ended value she can read but not change from here. */
      value: string;
      onTap: () => void;
    }
  | {
      shape: 'action';
      label: string;
      onTap: () => void;
    }
  | {
      shape: 'instant';
      label: string;
      value: InstantRowValue;
      /**
       * §3.19's slow half (>~1.5s): the trailing value reads `Guardando…` in
       * place of `Sí`/`No`, row still dimmed. Never a spinner label, never a
       * technical status string — the same calm, plain-language convention as
       * every other write in `inventory.md` (§3.10).
       */
      pending?: boolean;
      /**
       * A write is in flight (either half of §3.10). The row dims in place
       * (`settings.md` §3.9's "fila atenuada" mechanic, reused) and is not
       * tappable again until it resolves — **a second tap is ignored, never
       * queued.** `value` still carries the *attempted* new value throughout,
       * which is only safe because failure is guaranteed to revert it (the
       * caller owns that revert; see §3.19's save-state discipline).
       */
      busy?: boolean;
      onTap: () => void;
    };

export function DetailRow(props: DetailRowProps) {
  if (props.shape === 'instant') {
    const { label, value, pending, busy, onTap } = props;
    return (
      <button
        type="button"
        className={`${styles.row} ${styles.instant} ${busy ? styles.busy : ''} stitchBottom`}
        disabled={busy}
        // `aria-pressed`, not `role="switch"`: the whole row is the target and
        // its accessible name is the label, so the row genuinely is a toggle
        // button whose pressed state is the value — there is no separate
        // switch-shaped sub-target to expose as one.
        aria-pressed={value === 'Sí'}
        onClick={onTap}
      >
        <span className={styles.label}>{label}</span>
        {/* No "›" here, ever — half of the shape-3 contract, and the half a
            future edit is most likely to break by copying the row above. */}
        <span className={styles.value}>{pending ? 'Guardando…' : value}</span>
      </button>
    );
  }

  const isValueRow = props.shape === 'value';
  return (
    <button type="button" className={`${styles.row} stitchBottom`} onClick={props.onTap}>
      <span className={styles.label}>{props.label}</span>
      {isValueRow && <span className={styles.value}>{props.value}</span>}
      {/* Unconditional on every sheet-opening row — a value row and an action
          row alike. Decorative to AT: the row is already a button, and "›"
          read aloud after the value adds nothing. */}
      <span className={styles.chevron} aria-hidden="true">
        ›
      </span>
    </button>
  );
}
