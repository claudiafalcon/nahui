import { useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, availableCount, everReceived } from '../../domain/selectors';
import { makeId } from '../../domain/id';
import type { AppState, Product } from '../../domain/types';
import { ProductPicker } from '../../components/ProductPicker/ProductPicker';
import { QuantityStepper } from '../../components/QuantityStepper/QuantityStepper';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { TagStub } from '../../components/TagStub/TagStub';
import styles from './RegisterMerchandise.module.css';

/**
 * Which Product this in-progress line refers to. `existing` names a real,
 * already-written Product. `new` is a not-yet-real identity picked up in
 * "¿Qué llegó?" this same visit — inventory.md §3.8a: held here, in local
 * draft/committed state, and only actually written (atomically with the
 * rest of the Lot) at "Guardar mercancía" — see `commitLot` in `store.tsx`.
 */
type ProductRef =
  | { kind: 'existing'; productId: string }
  /** `barcode` (`decision-log.md` D65) — set only when this line's Producto
   * was resolved via the picker's "vía escaneo, sin coincidencia" path
   * (`inventory.md` §3.8a's scan variant); `undefined` for the typed path,
   * the same posture `photo` already has. Never shown or re-asked anywhere
   * on this screen — captured silently, attached to the same atomic
   * Product-creation write at "Guardar mercancía." */
  | { kind: 'new'; name: string; price: number; photo?: string; barcode?: string };

interface Line {
  key: string; // stable local identity for React lists/removal — a pending `new` line has no real productId yet
  product: ProductRef;
  productName: string;
  /**
   * Cantidad recibida — purely additive, never merged with `currentQuantity`
   * below. For an `existing` line this value is only ever a real staged
   * receipt while `receiptOpen` is true (§3.6's "+ Recibir lote" reveal);
   * while closed it sits at its own default (1) but contributes nothing —
   * always read through `effectiveReceiptQty` below, never directly, so a
   * closed/never-opened receipt section can never leak into a save.
   */
  quantity: number;
  touched: boolean; // Cantidad recibida's own "revisa antes de guardar" state
  /**
   * `decision-log.md` D78, `inventory.md` §3.6/§3.7/§3.8 — Cantidad
   * disponible actual. Present whenever this line's Producto resolved to an
   * *existing* Product — **regardless of its live `disponibles` value,
   * including exactly 0** (D78 corrected D77's own ceiling>0 gate: 0 is now
   * a legitimate correction starting point, bidirectional correction has no
   * degenerate case left to omit). `undefined` only for a brand-new Product
   * (§3.8a, either path), which never shows this at all. `ceiling` is the
   * snapshot loaded once when Producto resolved and never re-fetched while
   * she stays on this screen (§3.6's own "snapshot-until-Guardar"
   * convention — Guardar itself converges against the real, live count
   * server-side, never a stale client-side subtraction). `value` is her
   * current edit, defaulting to `ceiling` untouched (a known fact, not a
   * guess — never carries a "revisa" marker, unlike Cantidad recibida's own
   * default-to-1).
   */
  currentQuantity?: { ceiling: number; value: number };
  /** D78 — the pencil ("✎ Corregir") reveal state. Only ever meaningful
   * when `currentQuantity` is set; ignored for a brand-new Product's line,
   * which has no correction UI at all. Opening this alone (value still
   * equal to `ceiling`) is a genuine no-op — see `hasRealEffect` below. */
  correctionOpen: boolean;
  /** D78 — the "+ Recibir lote" reveal state, for an *existing* line only.
   * Always effectively true for a brand-new Product's line (its receiving
   * stepper is unconditionally visible, §3.8a) — the flag still exists on
   * that line for shape-consistency but is never read for it, since
   * `currentQuantity === undefined` already routes past every check of this
   * flag. */
  receiptOpen: boolean;
}

/**
 * `decision-log.md` D78 — builds a fresh line for an *existing* Product,
 * carrying forward its live `disponibles` as Cantidad disponible actual's
 * snapshot in the same motion (§3.8's own carry-forward rule), the same
 * "capture business truth once, reuse it forever" discipline this screen's
 * price/photo carry-forward already follows. Shared by every path that
 * resolves Producto to an existing Product: the Catalog-row shortcut
 * (`initialProductId`, below), a typed exact-name match, and a barcode
 * confirm-on-scan (§3.8c) — `ProductPicker`'s own `onSelectExisting` is the
 * single callback all three already funnel through. Both correction and
 * receipt open false by default — she lands on the read-only at-rest state
 * (§3.6), never with anything pre-staged.
 *
 * **`currentQuantity` is gated on `everReceived`, not mere Catalog
 * presence.** §3.6's own "Shared, unchanged" bullet preserves the legacy
 * "sin registrar" case (`product-decisions.md` Q20, `inventory.md`
 * §3.3a/§3.4 — a Product that exists as a row but has never actually had a
 * real receipt) as still landing on "the always-visible receiving
 * stepper," the same treatment as a brand-new Product — D78's own "0 is a
 * legitimate correction starting point" language is about a Product *she'd
 * registered* and later sold out or miscounted down to zero (D78's own
 * worked example), never about a Product with no received history to
 * correct *against* in the first place. `everReceived` (`selectors.ts`) is
 * this codebase's own existing test for exactly that distinction, reused
 * here rather than reinvented.
 */
function buildExistingLine(state: AppState, product: Product): Line {
  const registered = everReceived(state, product.id);
  const ceiling = availableCount(state, product.id);
  return {
    key: product.id,
    product: { kind: 'existing', productId: product.id },
    productName: product.name,
    quantity: 1,
    touched: false,
    currentQuantity: registered ? { ceiling, value: ceiling } : undefined,
    correctionOpen: false,
    receiptOpen: !registered,
  };
}

/**
 * D78 — whether this line currently carries a real, nonzero staged effect:
 * an open correction whose value differs from the loaded ceiling, and/or an
 * open (necessarily nonzero, floor-1) receipt. Drives every gate this
 * amendment adds — Producto's re-selectability, "+ Agregar otro producto,"
 * "Guardar mercancía," and which committed lines can ever exist at all
 * (§3.6/§3.7).
 */
function hasRealEffect(line: Line): boolean {
  if (!line.currentQuantity) {
    // A brand-new Product's line has no correction UI at all — its
    // always-visible receiving stepper (floor 1) already carries a real
    // value the instant Producto resolves (§3.8a, unchanged from before
    // this amendment).
    return line.quantity > 0;
  }
  const correctionEffect = line.correctionOpen && line.currentQuantity.value !== line.currentQuantity.ceiling;
  const receiptEffect = line.receiptOpen && line.quantity > 0;
  return correctionEffect || receiptEffect;
}

/**
 * D78 — the actual receipt quantity this line contributes to a save. For a
 * brand-new Product, always `quantity` (always-visible, always real). For
 * an existing Product, `quantity` only while `receiptOpen` is true —
 * otherwise 0, even though `quantity` itself still sits at its own default
 * internally. Every read of "how much is being received" on this line goes
 * through this function, never `line.quantity` directly, so a closed
 * receipt section can never leak a phantom default-1 receipt into a save.
 */
function effectiveReceiptQty(line: Line): number {
  if (!line.currentQuantity) return line.quantity;
  return line.receiptOpen ? line.quantity : 0;
}

/**
 * inventory.md §3.6/§3.7 — Registro de mercancía. Producto + Cantidad
 * disponible actual (correction) + Cantidad recibida (receipt) only
 * (D9/architecture-principles.md #5 — no Supplier, no cost field).
 * Rewritten in full 2026-09-18 (`decision-log.md` D78, RFC 0016): an
 * existing Product's line now defaults to a read-only "Cantidad disponible
 * actual" + pencil + "+ Recibir lote" link, with no persistent "Guardar
 * mercancía" until she actually stages a real, nonzero effect on the active
 * row (or the committed list already holds one) — replaces the always-on
 * two-box shape D77 shipped only hours earlier the same day.
 */
export function RegisterMerchandise({
  initialProductId,
  onSaved,
  onBack,
}: {
  initialProductId?: string;
  /** AT-M1 fix (`AssignTags.tsx`) — alongside the last-saved productId,
   * hands back exactly what this specific `commitLot` call wrote (productId
   * + quantity per line, existing lines with a repeated Product merged into
   * one), so a caller auto-entering Asignar Tags right after can freeze a
   * receipt scoped to only this commit — never the live, business-wide
   * pending-tag queue, which may also hold an older, unrelated deferred
   * Lot's own backlog. */
  onSaved: (lastProductId: string, entryBreakdown: { productId: string; quantity: number }[]) => void;
  onBack: () => void;
}) {
  const { state, commitLot, correctProductAvailableCount } = useStore();
  const initialProduct = state.products.find((p) => p.id === initialProductId);

  const [committed, setCommitted] = useState<Line[]>([]);
  // D78 — the Catalog-row shortcut is one of §3.8's three carry-forward
  // entry points; `buildExistingLine` loads Cantidad disponible actual's
  // snapshot from this Product's live `disponibles` in the same motion, but
  // lands her on the read-only at-rest state, never pre-staged.
  const [draft, setDraft] = useState<Line | null>(initialProduct ? buildExistingLine(state, initialProduct) : null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  /** `reviewer` Blocker fix (2026-09-13) — the stable idempotency key for one
   * logical "Guardar mercancía" attempt, mirroring `store.tsx`'s own
   * `onboardingIdempotencyKeyRef` exactly: generated once when `handleSave`
   * starts an attempt, reused unchanged across any retry of that same
   * attempt (a failed save just resets `saving` and leaves `committed`/
   * `draft` untouched, so tapping "Guardar mercancía" again must replay the
   * same key, never mint a fresh one — a fresh key on retry is exactly what
   * let a lost-response retry mint a duplicate Lot/Products/InventoryUnits).
   * Cleared on success (below) and on every action that actually changes
   * what would be saved (`resetSaveAttempt`, used by `removeCommitted`/
   * `handleAddAnother`/the picker callbacks/every stepper and toggle) —
   * never on a mere failed-save retry, which is the one case this key must
   * survive unchanged. */
  const commitIdempotencyKeyRef = useRef<string | null>(null);

  /** D78 — one idempotency key per corrected line's own
   * `correctProductAvailableCount` call (a single-product write, not a
   * batch one like `commit_lot`), same generate-once-per-attempt/
   * reused-across-retry discipline as `commitIdempotencyKeyRef` above,
   * keyed by `Line.key` since more than one line can be corrected in the
   * same "Guardar mercancía" tap. */
  const correctionIdempotencyKeysRef = useRef<Map<string, string>>(new Map());
  /** D78 — which lines' correction write has already succeeded *within
   * this attempt*. Required for a correct retry after a partial failure
   * (a correction succeeds, then `commitLot` fails): without this, a
   * retry would re-run the already-applied line's local mirror a second
   * time — over-removing on a decrease, or minting a second batch of
   * phantom units on an increase. The server call itself is naturally safe
   * to repeat (idempotency-keyed, RFC 0016's own "converges toward her
   * target" design) — this guard exists only to protect the *local
   * mirror*, which the server has no way to make idempotent on its own. */
  const appliedCorrectionsRef = useRef<Set<string>>(new Set());

  function resetSaveAttempt() {
    commitIdempotencyKeyRef.current = null;
    correctionIdempotencyKeysRef.current.clear();
    appliedCorrectionsRef.current.clear();
  }

  const canSave = committed.length > 0 || (draft !== null && hasRealEffect(draft));

  // Resolves whichever photo this line's marker should show — a real
  // Product's already-saved `photo` for an `existing` line, or the draft's
  // own not-yet-written selection for a `new` one. Presentation-only, same
  // "reuse the one TagStub component" discipline as every other marker in
  // this codebase.
  function photoForLine(line: Line): string | undefined {
    const ref = line.product;
    if (ref.kind === 'existing') {
      return state.products.find((p) => p.id === ref.productId)?.photo;
    }
    return ref.photo;
  }

  /**
   * D78 — a draft only ever joins the committed list (whether via
   * "+ Agregar otro producto" or an implicit commit at "Guardar mercancía")
   * while it carries a real, nonzero effect. There is no longer a "she
   * opened the row and changed nothing" committed line (§3.7) — a draft
   * with no real effect simply evaporates on save, by construction.
   */
  function commitDraftIfAny(next: Line[]): Line[] {
    if (draft && hasRealEffect(draft)) return [...next, draft];
    return next;
  }

  function handleAddAnother() {
    if (!draft || !hasRealEffect(draft)) return;
    resetSaveAttempt();
    setCommitted((c) => [...c, draft]);
    setDraft(null);
    setPickerOpen(true);
  }

  async function handleSave() {
    const lines = commitDraftIfAny(committed);
    if (lines.length === 0) return;
    setSaving(true);

    // D78 — up to two independent writes per line, composed behind this one
    // tap (§3.6/§3.7): a correction (either direction) via Cantidad
    // disponible actual, a real receipt via Cantidad recibida, or both.
    // Corrections run first; each already-applied line (from a prior,
    // partially-failed attempt) is skipped outright, not just re-sent —
    // see `appliedCorrectionsRef`'s own doc comment above for why
    // re-sending would be locally unsafe even though the RPC itself is
    // idempotent.
    const correctionLines = lines.filter(
      (l) =>
        l.currentQuantity !== undefined &&
        l.currentQuantity.value !== l.currentQuantity.ceiling &&
        !appliedCorrectionsRef.current.has(l.key),
    );
    for (const line of correctionLines) {
      // Cantidad disponible actual only ever exists on an `existing` line
      // (§3.8a: it never applies to a fresh Product) — this cast is always
      // safe by construction, same posture as this file's other
      // `kind === 'existing'` casts below.
      const productId = (line.product as { kind: 'existing'; productId: string }).productId;
      let key = correctionIdempotencyKeysRef.current.get(line.key);
      if (!key) {
        key = crypto.randomUUID();
        correctionIdempotencyKeysRef.current.set(line.key, key);
      }
      const result = await correctProductAvailableCount(productId, line.currentQuantity!.value, key);
      if (!result.ok) {
        console.error('[RegisterMerchandise] correctProductAvailableCount failed');
        setSaving(false);
        return;
      }
      appliedCorrectionsRef.current.add(line.key);
    }

    // Cantidad recibida's own write — purely additive, unchanged in
    // mechanism from before D78, but now only fires for a line whose
    // *effective* receipt quantity is > 0 — a pure-correction line, whose
    // receipt section was never opened, contributes nothing here even
    // though `quantity` still sits at its own internal default (§3.6's own
    // "never fold into the same editable number" rule). `commitLot` is
    // skipped entirely, not called with an empty array, whenever every line
    // in this save is a pure correction — no Lot/InventoryEntry is created
    // for zero new stock.
    const additiveLines = lines.filter((l) => effectiveReceiptQty(l) > 0);
    let resolved: string[] = [];
    if (additiveLines.length > 0) {
      // `reviewer` Blocker fix — generated once per attempt, reused
      // unchanged across a retry (see `commitIdempotencyKeyRef`'s own doc
      // comment above).
      if (!commitIdempotencyKeyRef.current) {
        commitIdempotencyKeyRef.current = crypto.randomUUID();
      }
      const idempotencyKey = commitIdempotencyKeyRef.current;
      // The atomic write, per inventory.md §3.8a: any `new` line's Product
      // identity is minted here, inside commitLot's own transaction — never
      // before. `resolvedOrNull` mirrors `additiveLines`' order, so its last
      // entry is the productId (real or freshly-minted) of the line just
      // saved.
      const resolvedOrNull = await commitLot(
        additiveLines.map((l) => ({
          quantity: effectiveReceiptQty(l),
          product:
            l.product.kind === 'existing'
              ? { kind: 'existing' as const, productId: l.product.productId }
              : {
                  kind: 'new' as const,
                  name: l.product.name,
                  defaultPrice: l.product.price,
                  photo: l.product.photo,
                  barcode: l.product.barcode,
                },
        })),
        idempotencyKey,
      );
      if (!resolvedOrNull) {
        console.error('[RegisterMerchandise] commitLot failed');
        setSaving(false);
        return;
      }
      resolved = resolvedOrNull;
      // Success — this logical attempt is over; a future, genuinely new
      // attempt (a fresh Lot registered after this one) must mint its own key.
      commitIdempotencyKeyRef.current = null;
    }

    // Every write for this attempt has now succeeded — clear the
    // correction bookkeeping too, the same "over, a future attempt mints
    // its own" reset `commitIdempotencyKeyRef` just got above.
    correctionIdempotencyKeysRef.current.clear();
    appliedCorrectionsRef.current.clear();

    // AT-M1 — exactly what this commit wrote, merging any repeated
    // Product across lines into a single quantity (defensive: the form
    // itself never produces two lines for the same Product today, but the
    // receipt should stay correct even if that ever changes).
    const entryBreakdown: { productId: string; quantity: number }[] = [];
    const entryTotals = new Map<string, number>();
    additiveLines.forEach((l, i) => {
      const productId = resolved[i];
      entryTotals.set(productId, (entryTotals.get(productId) ?? 0) + effectiveReceiptQty(l));
    });
    entryTotals.forEach((quantity, productId) => entryBreakdown.push({ productId, quantity }));
    setSaving(false);
    // D78 — a save can now be pure correction, with `commitLot` never
    // called and `resolved` empty. The confirmation this hands off to
    // (§3.12/§3.13) still needs *a* productId to scope its ambient
    // "registrada" line to — falls back to the last line's own productId,
    // always an `existing` line's real id whenever `resolved` is empty
    // (a brand-new Product's own line always has a real receipt, so it can
    // only ever be absent from `resolved` by never existing in `lines` at
    // all — this fallback path is only ever reached by an all-corrections
    // save, which by construction has no `new` lines).
    const lastLine = lines[lines.length - 1];
    const lastProductId =
      resolved.length > 0
        ? resolved[resolved.length - 1]
        : (lastLine.product as { kind: 'existing'; productId: string }).productId;
    onSaved(lastProductId, entryBreakdown);
  }

  function removeCommitted(key: string) {
    resetSaveAttempt();
    setCommitted((c) => c.filter((l) => l.key !== key));
  }

  /**
   * `decision-log.md` D78, `inventory.md` §3.7 — the "Ya agregaste"
   * committed-line rendering, rewritten for bidirectional correction
   * (replaces D77's decrease-only rendering). A pure receipt (correction
   * never opened, or opened-then-cancelled with no delta) renders exactly
   * as it always has — "Bolsas — 10," zero visual cost for the common
   * case. A pure correction, either direction, renders "corregido a N
   * (antes M)" — natural, direct language, never "removed," "increased,"
   * `InventoryUnit`, or any status/entity name (*global-principles.md*,
   * "business language before technical language"). Both together render
   * "corregido a N (antes M) + K nuevas," never merged into one number
   * (§3.6's own "never fold into the same editable number" rule). The
   * existing INV-Q1 marker-carry-through rule (an unreviewed default-1
   * receipt carries its "· revisa" marker here) composes directly on top —
   * gated on a *real* receipt quantity (`effectiveReceiptQty`), so a pure
   * correction whose receipt section was never opened never shows a
   * spurious marker for a default it never actually staged.
   */
  function committedLineText(line: Line): { text: string; showReviewMarker: boolean } {
    const cq = line.currentQuantity;
    const receiptQty = effectiveReceiptQty(line);
    const corrected = cq !== undefined && cq.value !== cq.ceiling;
    if (!corrected) {
      return { text: `${line.productName} — ${receiptQty}`, showReviewMarker: receiptQty > 0 && !line.touched };
    }
    const correctionText = `corregido a ${cq!.value} (antes ${cq!.ceiling})`;
    const addition = receiptQty > 0 ? ` + ${receiptQty} nueva${receiptQty === 1 ? '' : 's'}` : '';
    return {
      text: `${line.productName} — ${correctionText}${addition}`,
      showReviewMarker: receiptQty > 0 && !line.touched,
    };
  }

  if (saving) {
    return <p className={styles.savingLine}>Guardando…</p>;
  }

  // D78 — Producto stays tappable (reopens Elegir producto) only while
  // nothing has been staged on the active row yet; locks (plain text) the
  // instant it does. Closes a real gap this amendment's own removal of the
  // always-on default introduced: under D77, a wrongly-resolved Producto
  // had no way back short of "Descartar" (§3.9), which doesn't even exist
  // yet on a first, only row.
  const draftLocked = draft !== null && hasRealEffect(draft);

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Inventario
        </button>
      </div>
      <h1 className={styles.heading}>Registro de mercancía</h1>

      <div className={styles.scroll}>
        {committed.length > 0 && (
          <div className={styles.committed}>
            <span className={styles.committedTitle}>Ya agregaste:</span>
            {committed.map((line) => {
              const { text, showReviewMarker } = committedLineText(line);
              return (
                <div key={line.key} className={`${styles.committedRow} stitchBottom`}>
                  <TagStub name={line.productName} photo={photoForLine(line)} size={28} />
                  <span className={styles.committedName}>
                    {text}
                    {showReviewMarker && <span className={styles.reviewFlag}> · revisa</span>}
                  </span>
                  <button className={styles.removeBtn} onClick={() => removeCommitted(line.key)} aria-label={`Quitar ${line.productName}`}>
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.field}>
          <span className={styles.label}>Producto</span>
          {draftLocked ? (
            <span className={styles.productLocked}>{draft!.productName}</span>
          ) : (
            <button
              className={`${styles.pickerBtn} ${!draft ? styles.placeholder : ''}`}
              onClick={() => setPickerOpen(true)}
            >
              {draft ? draft.productName : 'Elegir producto ▾'}
            </button>
          )}
        </div>

        {draft && draft.currentQuantity && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad disponible actual</span>
            {!draft.correctionOpen ? (
              <div className={styles.readonlyRow}>
                <span className={styles.readonlyValue}>{draft.currentQuantity.value}</span>
                <button
                  className={styles.linkBtn}
                  onClick={() => {
                    resetSaveAttempt();
                    setDraft((d) => (d ? { ...d, correctionOpen: true } : d));
                  }}
                >
                  ✎ Corregir
                </button>
              </div>
            ) : (
              <>
                <QuantityStepper
                  value={draft.currentQuantity.value}
                  touched
                  showMarker={false}
                  ariaLabel="Cantidad disponible actual"
                  min={0}
                  onChange={(next) => {
                    resetSaveAttempt();
                    setDraft((d) =>
                      d && d.currentQuantity ? { ...d, currentQuantity: { ...d.currentQuantity, value: next } } : d,
                    );
                  }}
                />
                <span className={styles.hint}>
                  Corrígela si algo no cuadra — por ejemplo, piezas defectuosas que regresaste, o si contaste más de
                  lo que dice Nahui.
                </span>
                <button
                  className={styles.linkBtn}
                  onClick={() => {
                    resetSaveAttempt();
                    setDraft((d) =>
                      d && d.currentQuantity
                        ? { ...d, correctionOpen: false, currentQuantity: { ...d.currentQuantity, value: d.currentQuantity.ceiling } }
                        : d,
                    );
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}

        {draft && draft.currentQuantity && !draft.receiptOpen && (
          <button
            className={styles.linkBtn}
            onClick={() => {
              resetSaveAttempt();
              setDraft((d) => (d ? { ...d, receiptOpen: true } : d));
            }}
          >
            + Recibir lote
          </button>
        )}

        {draft && draft.currentQuantity && draft.receiptOpen && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad recibida</span>
            <QuantityStepper
              value={draft.quantity}
              touched={draft.touched}
              min={1}
              ariaLabel="Cantidad recibida"
              onChange={(next, touched) => {
                resetSaveAttempt();
                setDraft((d) => (d ? { ...d, quantity: next, touched } : d));
              }}
            />
            <span className={styles.hint}>Lo que te llegó nuevo (o escribe la cantidad)</span>
            <button
              className={styles.linkBtn}
              onClick={() => {
                resetSaveAttempt();
                setDraft((d) => (d ? { ...d, receiptOpen: false, quantity: 1, touched: false } : d));
              }}
            >
              Quitar
            </button>
          </div>
        )}

        {draft && !draft.currentQuantity && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad recibida</span>
            <QuantityStepper
              value={draft.quantity}
              touched={draft.touched}
              min={1}
              ariaLabel="Cantidad recibida"
              onChange={(next, touched) => {
                resetSaveAttempt();
                setDraft((d) => (d ? { ...d, quantity: next, touched } : d));
              }}
            />
            <span className={styles.hint}>(o escribe la cantidad)</span>
          </div>
        )}

        {draft && hasRealEffect(draft) && (
          <button className={styles.addAnother} onClick={handleAddAnother}>
            + Agregar otro producto
          </button>
        )}
      </div>

      {canSave && (
        <div className={`${styles.footer} stitchTop`}>
          <Button onClick={handleSave}>Guardar mercancía</Button>
          {committed.length > 0 && (
            <button className={styles.discard} onClick={() => setDiscardOpen(true)}>
              Descartar
            </button>
          )}
        </div>
      )}

      {pickerOpen && (
        <ProductPicker
          rows={catalogRows(state)}
          onDismiss={() => setPickerOpen(false)}
          onSelectExisting={(product) => {
            // D78/§3.8 — covers all three carry-forward entry points this
            // callback serves (typed exact-name match, list-item tap,
            // barcode confirm-on-scan's "Sí, es este") in one place.
            resetSaveAttempt();
            setDraft(buildExistingLine(state, product));
            setPickerOpen(false);
          }}
          onCreateNew={(name, price, photo, barcode) => {
            // Not written to the store yet (inventory.md §3.8a) — held as a
            // pending `new` identity in local draft state until "Guardar
            // mercancía" atomically resolves it via commitLot. Any selected
            // Foto (`product-decisions.md` Q23) or scanned barcode
            // (`decision-log.md` D65) is carried the same way.
            resetSaveAttempt();
            setDraft({
              key: makeId('draft'),
              product: { kind: 'new', name, price, photo, barcode },
              productName: name,
              quantity: 1,
              touched: false,
              correctionOpen: false,
              receiptOpen: true,
            });
            setPickerOpen(false);
          }}
        />
      )}

      {discardOpen && (
        <Sheet onDismiss={() => setDiscardOpen(false)}>
          <p className={styles.heading} style={{ padding: 0, marginBottom: 16 }}>
            ¿Descartar los {committed.length + (draft && hasRealEffect(draft) ? 1 : 0)} productos que ya agregaste?
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" onClick={() => setDiscardOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetSaveAttempt();
                setCommitted([]);
                setDraft(null);
                setDiscardOpen(false);
              }}
            >
              Sí, descartar
            </Button>
          </div>
        </Sheet>
      )}
    </>
  );
}
