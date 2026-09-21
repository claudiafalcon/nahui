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
 * | `instant` | `Label         Sí  (—●)`    | Writes immediately on tap. **Never carries "›".** The two-position control is a signifier *inside* the row's one target, never a second target. |
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
 * **Signal three — the control's own position** (added 2026-09-21, §3.19's
 * "the trailing edge states the row's kind, affirmatively, on every row").
 * The chevron was always stated affirmatively, for the right reason: a rule
 * about one row's *absence* is no signal at all. That reasoning was then not
 * applied to shape 3, which was left defined by two absences — no chevron, no
 * control — plus one inference: that a trailing `Sí`/`No` reads as a
 * control's position rather than as a reported fact. **That inference is what
 * a merchant's transferred expectation runs against.** On her own phone's
 * Ajustes, in WhatsApp, in Mercado Libre, a chevron-less row of
 * label-and-trailing-value is what a *read-only fact* looks like; an
 * instantly-applied binary setting is what carries visible two-position
 * geometry. So the instant-write row ends in a visible control shown in its
 * current position, unconditionally. **No row ends in nothing, and no row
 * carries both marks.**
 *
 * **Why three signals and not one.** The chevron is a small mark at the far
 * edge of a row; the control is a shape she recognises without reading it;
 * the words state the state even if she looks at neither. They fail
 * independently, which is the point.
 *
 * **Which is why the two mark-signals carry a perceptibility floor**
 * (DESIGN-SYSTEM §10, added 2026-09-21): each clears 3:1 against the surface
 * it renders on, **in every state it can be in, the off/default state
 * included**. A mark below that bar is not an independent signal, it is an
 * absent one — and as first built, both of them were below it: the chevron at
 * ~2.80:1 on this app's own shell, and the control at ~1.20:1 in the `No`
 * state that `nfcTaggingEnabled`'s `false` default makes the first one any
 * merchant ever sees. See `DetailRow.module.css` for the tokens and the
 * numbers. **The words stay, and they are what make
 * the control admissible** — this row's state must be readable *in words* at
 * rest, never only from a control's position, and never from colour or weight
 * at all (DESIGN-SYSTEM §8's retained rule). The control accompanies the
 * words; a rendering that dropped `Sí`/`No` in favour of the control alone
 * would be a defect, not a simplification.
 *
 * **The control is a signifier, never a second tap target.** It is a
 * `<span>`, inside the row's single `<button>`, `aria-hidden` — a tap on the
 * label, on the word, on the control, or on the empty space between them does
 * the same one thing. Recreating a sub-target here is precisely what the
 * Catalog card's retired NFC hit zone was, and what this shape exists to
 * avoid; restoring the geometry without the hit area restores a signal that
 * retirement discarded by accident, and adds back nothing the retirement was
 * for.
 *
 * **No row may mix shapes.** A sheet-opening row with a binary value (a
 * hypothetical `Vender con tag NFC   Sí ›`) is forbidden outright: it would
 * carry both signals and resolve to neither. If a future amendment needs a
 * binary fact edited through a sheet, it renders the value as something other
 * than `Sí`/`No` and carries the "›" — the vocabulary is what's reserved, not
 * the fact.
 *
 * **What the types actually guarantee, stated precisely (`ux-critic` m1,
 * 2026-09-21).** The first build claimed the props "make the fourth
 * combination unrepresentable." That was overstated: the closed vocabulary
 * was enforced on `instant` only, and `<DetailRow shape="value" value="Sí"/>`
 * compiled and rendered the exact forbidden row. Two guards now stand, and
 * neither is described as more than it is:
 * 1. **Compile time** — the `value` shape is generic in its own literal type
 *    and a `Sí`/`No` literal resolves it to a variant demanding a prop that
 *    cannot be supplied, so that call is a type error at the call site. This
 *    catches the realistic mistake: a literal typed into JSX. It does **not**
 *    catch a value whose type is merely `string` (`product.barcode`, a
 *    template literal) that happens to hold "Sí" at runtime — no type can.
 * 2. **Runtime, dev only** — that residual case is asserted below, where the
 *    actual string is known. It is a `console.error`, not a thrown error or a
 *    swapped-in fallback row: a mixed row is a design defect to fix in the
 *    caller, never something this component should silently "correct" into a
 *    different shape than the caller asked for.
 *
 * Overstated safety is worse than stated risk — a future author who believes
 * the type covers everything stops looking for the case it doesn't.
 *
 * Deliberately one of this design system's **conventional** controls
 * (`DESIGN-SYSTEM.md` §8): a plain list row, not a Swing-Tag device. It
 * represents a stored *setting or attribute* of a Product, not money, not the
 * Product itself, and not a torn transition between two zones of a screen —
 * the identical reasoning that already keeps `Button`/`Sheet`/form inputs
 * plain, and that DESIGN-SYSTEM §8 applied to the on/off switch whose
 * geometry this row's `instant` shape now carries. That switch was
 * **relocated, not superseded**: §8's own prospective rule named "a button
 * that swaps its own text between two states" as the thing *not* to
 * hand-roll, and the first build of this row was exactly that. The track and
 * knob are back, in the one place the rule always pointed them — inside the
 * full-width row, as a signifier rather than as its own control. Its
 * *geometry* is §8's, unchanged; two of its three colours are not, because
 * §8's original sat beside its own text label and was never held to the
 * floor above (see `DetailRow.module.css`'s `.instant .switch`).
 */

/** The closed, two-position vocabulary an instant-write row may trail — and
 * the only one it may ever trail (§3.19's shape-3 contract). Typed as a
 * literal union on purpose: a future caller cannot widen it to an arbitrary
 * string without editing this line and confronting the rule. */
export type InstantRowValue = 'Sí' | 'No';

/** Guard 1, compile time. `V` is inferred from the literal passed as `value`;
 * when that literal is one of the two reserved words, the intersection
 * demands a property no caller can supply and the call fails to type-check,
 * naming the rule in the error text. A `value` whose type is merely `string`
 * resolves the conditional to `unknown` and is unaffected — that case is what
 * guard 2, below, exists for. */
type ForbidInstantVocabulary<V extends string> = V extends InstantRowValue
  ? { 'a value row may never trail Sí or No — see §3.19 shape 3': never }
  : unknown;

export type DetailRowProps<V extends string = string> =
  | ({
      shape: 'value';
      label: string;
      /** The open-ended value she can read but not change from here. */
      value: V;
      onTap: () => void;
    } & ForbidInstantVocabulary<V>)
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
       * place of `Sí`/`No`, with the control holding the attempted position.
       * Both stay at **full strength** for the whole inflight window — only
       * the label is quieted (see `busy` below). Never a spinner label, never
       * a technical status string — the same calm, plain-language convention
       * as every other write in `inventory.md` (§3.10).
       */
      pending?: boolean;
      /**
       * A write is in flight (either half of §3.10). The row's **label**
       * quiets in place (`settings.md` §3.9's "fila atenuada" mechanic,
       * reused as a colour substitution on the label only — never `opacity`
       * on the row; see `DetailRow.module.css`'s `.busy` for why nothing
       * that states the write's state may be inside it) and the row is not
       * tappable again until it resolves — **a second tap is ignored, never
       * queued.** `value` still carries the *attempted* new value throughout,
       * which is only safe because failure is guaranteed to revert it (the
       * caller owns that revert; see §3.19's save-state discipline).
       */
      busy?: boolean;
      onTap: () => void;
    };

export function DetailRow<V extends string>(props: DetailRowProps<V>) {
  if (props.shape === 'instant') {
    const { label, value, pending, busy, onTap } = props;
    return (
      <button
        type="button"
        className={`${styles.row} ${styles.instant} ${busy ? styles.busy : ''} stitchBottom`}
        // **`aria-disabled`, never `disabled`** — this codebase's own
        // convention (`ux-critic` MIN-1, 2026-09-07, `AccesoRevocado.tsx`),
        // and it matters most precisely here: `disabled` blurs the button the
        // instant she taps it and drops focus to `document.body`. On the one
        // control in this system whose failure path *is* "tap the row again,"
        // that would force a keyboard or assistive-technology user to
        // re-navigate the whole level to retry a write that just failed. The
        // row stays focused and announced; the caller's own `if (busy) return`
        // guard is what actually ignores the second tap (never queues it).
        aria-disabled={busy || undefined}
        // `aria-pressed`, not `role="switch"`: the whole row is the target and
        // its accessible name is the label, so the row genuinely is a toggle
        // button whose pressed state is the value — there is no separate
        // switch-shaped sub-target to expose as one.
        aria-pressed={value === 'Sí'}
        onClick={onTap}
      >
        <span className={styles.label}>{label}</span>
        {/* No "›" here, ever — one third of the shape-3 contract, and the
            part a future edit is most likely to break by copying the row
            above. */}
        <span className={styles.value}>{pending ? 'Guardando…' : value}</span>
        {/* The two-position control. **Its position and the word can never
            disagree, in any state, by construction** — both are computed from
            the same single `value` prop, which carries the *attempted* value
            for the whole time a write is in flight and falls straight back to
            stored state when it resolves. So they move together on tap,
            together into `Guardando…` (the control holds the attempted
            position while the word is replaced), and together on the revert.
            The control is never the only thing that changes and can never lag
            the word — the one failure mode that would make having this
            geometry worse than not having it (§3.19's save-state discipline).

            `aria-hidden` and non-interactive on purpose: the row is already
            exposed as a toggle whose pressed state is the value, so reading
            this out would be the same fact twice, and giving it a target of
            its own would reinstate the hit zone this shape exists to avoid. */}
        <span
          className={`${styles.switch} ${value === 'Sí' ? styles.switchOn : ''}`}
          aria-hidden="true"
        >
          <span className={styles.switchKnob} />
        </span>
      </button>
    );
  }

  const isValueRow = props.shape === 'value';
  // Guard 2, runtime, dev only — the residual case no type can reach: a
  // `string`-typed value that happens to hold one of the two reserved words.
  if (import.meta.env.DEV && isValueRow && (props.value === 'Sí' || props.value === 'No')) {
    console.error(
      `[DetailRow] "${props.label}" is a sheet-opening row trailing "${props.value}". ` +
        '§3.19 reserves the Sí/No vocabulary for the instant-write shape: this row would ' +
        'carry both signals (a "›" and a binary value) and resolve to neither. Render a ' +
        'different value, or make it shape="instant".',
    );
  }
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
