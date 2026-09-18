import { useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, availableCount } from '../../domain/selectors';
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
  quantity: number; // Cantidad — purely additive, never merged with currentQuantity below
  touched: boolean; // Cantidad's own "revisa antes de guardar" state, unchanged by D77
  /**
   * `decision-log.md` D77, `inventory.md` §3.6/§3.7/§3.8 — Cantidad actual.
   * Present only when this line's Producto resolved to an *existing*
   * Product whose live `disponibles` was > 0 at that exact moment
   * (§3.6's gating condition) — `undefined` for a brand-new Product
   * (§3.8a, either path) or an existing Product currently at 0
   * disponibles. `ceiling` is that snapshot, loaded once and never
   * re-fetched while she stays on this screen (§3.6's own
   * "snapshot-until-Guardar" convention — Guardar itself converges against
   * the real, live count server-side, never a stale client-side
   * subtraction). `value` is her current edit, defaulting to `ceiling`
   * untouched (a known fact, not a guess — never carries a "revisa" marker,
   * unlike Cantidad's own default-to-1).
   */
  currentQuantity?: { ceiling: number; value: number };
}

/**
 * `decision-log.md` D77 — builds a fresh line for an *existing* Product,
 * carrying forward its live `disponibles` as Cantidad actual's initial
 * value in the same motion (§3.8's own new carry-forward rule), exactly
 * the same "capture business truth once, reuse it forever" discipline this
 * screen's price/photo carry-forward already follows. Shared by every path
 * that resolves Producto to an existing Product: the Catalog-row shortcut
 * (`initialProductId`, below), a typed exact-name match, and a barcode
 * confirm-on-scan (§3.8c) — `ProductPicker`'s own `onSelectExisting` is the
 * single callback all three already funnel through.
 */
function buildExistingLine(state: AppState, product: Product): Line {
  const ceiling = availableCount(state, product.id);
  return {
    key: product.id,
    product: { kind: 'existing', productId: product.id },
    productName: product.name,
    quantity: 1,
    touched: false,
    currentQuantity: ceiling > 0 ? { ceiling, value: ceiling } : undefined,
  };
}

/**
 * inventory.md §3.6/§3.7 — Registro de mercancía. Producto + Cantidad only
 * (D9/architecture-principles.md #5 — no Supplier, no cost field). Cantidad
 * defaults to 1 the instant Producto resolves; Guardar mercancía enables the
 * moment a Producto exists on the active row or the committed list.
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
  // D77 — the Catalog-row shortcut is one of §3.8's three carry-forward
  // entry points; `buildExistingLine` loads Cantidad actual's ceiling from
  // this Product's live `disponibles` in the same motion.
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
   * `handleAddAnother`/the picker callbacks/the Cantidad stepper/discard) —
   * never on a mere failed-save retry, which is the one case this key must
   * survive unchanged. */
  const commitIdempotencyKeyRef = useRef<string | null>(null);

  /** D77 — one idempotency key per corrected line's own
   * `correctProductAvailableCount` call (a single-product write, not a
   * batch one like `commit_lot`), same generate-once-per-attempt/
   * reused-across-retry discipline as `commitIdempotencyKeyRef` above,
   * keyed by `Line.key` since more than one line can be corrected in the
   * same "Guardar mercancía" tap. */
  const correctionIdempotencyKeysRef = useRef<Map<string, string>>(new Map());
  /** D77 — which lines' correction write has already succeeded *within
   * this attempt*. Required for a correct retry after a partial failure
   * (a correction succeeds, then `commitLot` fails): without this, a
   * retry would re-run the already-applied line's local FIFO mirror a
   * second time over units the first pass already marked `removed`,
   * silently over-removing. The server call itself is naturally safe to
   * repeat (idempotency-keyed, D77/RFC 0015's own "converges toward her
   * target" design) — this guard exists only to protect the *local
   * mirror*, which the server has no way to make idempotent on its own. */
  const appliedCorrectionsRef = useRef<Set<string>>(new Set());

  function resetSaveAttempt() {
    commitIdempotencyKeyRef.current = null;
    correctionIdempotencyKeysRef.current.clear();
    appliedCorrectionsRef.current.clear();
  }

  const canSave = committed.length > 0 || draft !== null;

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

  function commitDraftIfAny(next: Line[]): Line[] {
    if (draft) return [...next, draft];
    return next;
  }

  function handleAddAnother() {
    if (!draft) return;
    resetSaveAttempt();
    setCommitted((c) => [...c, draft]);
    setDraft(null);
    setPickerOpen(true);
  }

  async function handleSave() {
    const lines = commitDraftIfAny(committed);
    if (lines.length === 0) return;
    setSaving(true);

    // D77 — up to two independent writes per line, composed behind this one
    // tap (§3.6/§3.7): a decrease via Cantidad actual, an increase via
    // Cantidad, or both. Corrections run first; each already-applied line
    // (from a prior, partially-failed attempt) is skipped outright, not
    // just re-sent — see `appliedCorrectionsRef`'s own doc comment above
    // for why re-sending would be locally unsafe even though the RPC
    // itself is idempotent.
    const correctionLines = lines.filter(
      (l) =>
        l.currentQuantity !== undefined &&
        l.currentQuantity.value < l.currentQuantity.ceiling &&
        !appliedCorrectionsRef.current.has(l.key),
    );
    for (const line of correctionLines) {
      // Cantidad actual only ever exists on an `existing` line (§3.8a:
      // Cantidad actual never applies to a fresh Product) — this cast is
      // always safe by construction, same posture as this file's other
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

    // Cantidad's own write — purely additive, unchanged from before D77,
    // except it now only fires for a line whose Cantidad is actually > 0
    // (a pure-correction line, Cantidad left at its own new floor of 0,
    // contributes nothing here — §3.6's own "Cantidad's own floor changes
    // from 1 to 0" reasoning). `commitLot` is skipped entirely, not called
    // with an empty array, whenever every line in this save is a pure
    // correction — no Lot/InventoryEntry is created for zero new stock.
    const additiveLines = lines.filter((l) => l.quantity > 0);
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
      //
      // Stage 7 Backend Integration, Phase 1 — commitLot is now a real,
      // awaitable Supabase RPC call; `saving`'s own "Guardando…" state covers
      // the real network latency (the previous artificial 260ms delay is
      // retired, no longer needed to simulate one). A rejected/failed
      // outcome (`null`) leaves `committed`/`draft` untouched — nothing is
      // lost (any correction already applied above stays applied, and
      // `appliedCorrectionsRef` makes sure it isn't re-run), she can just
      // tap "Guardar mercancía" again, and the retry replays the exact same
      // idempotency key above.
      const resolvedOrNull = await commitLot(
        additiveLines.map((l) => ({
          quantity: l.quantity,
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
      entryTotals.set(productId, (entryTotals.get(productId) ?? 0) + l.quantity);
    });
    entryTotals.forEach((quantity, productId) => entryBreakdown.push({ productId, quantity }));
    setSaving(false);
    // D77 — a save can now be pure correction, with `commitLot` never
    // called and `resolved` empty. The confirmation this hands off to
    // (§3.12/§3.13) still needs *a* productId to scope its ambient
    // "registrada" line to — falls back to the last line's own productId,
    // always an `existing` line's real id whenever `resolved` is empty
    // (a brand-new Product's own line always has Cantidad ≥ 1, so it can
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
   * `decision-log.md` D77, `inventory.md` §3.7 — the "Ya agregaste"
   * committed-line rendering, extended for a Cantidad actual correction.
   * When Cantidad actual is untouched (still equals the loaded ceiling —
   * the common, unchanged case), this renders exactly as it always has,
   * zero visual cost. When it was moved down, the correction is stated
   * plainly ("corregido a N (antes M)"), never a status/entity name
   * (*global-principles.md*, "business language before technical
   * language" — *architecture-principles.md* #4). When both a correction
   * and a real addition happened on the same line, both facts render
   * together, never merged into one number (§3.6's own "never fold into
   * the same editable number" rule) — the addition gets its own "N nueva/s"
   * word here specifically to disambiguate which number means what, since
   * a bare number reads unambiguously only when there's no competing
   * "corrected to X" fact sharing the line. The existing INV-Q1
   * marker-carry-through rule composes directly on top, unchanged.
   */
  function committedLineText(line: Line): { text: string; showReviewMarker: boolean } {
    const cq = line.currentQuantity;
    const corrected = cq !== undefined && cq.value < cq.ceiling;
    if (!corrected) {
      return { text: `${line.productName} — ${line.quantity}`, showReviewMarker: !line.touched };
    }
    const correctionText = `corregido a ${cq.value} (antes ${cq.ceiling})`;
    const addition = line.quantity > 0 ? ` + ${line.quantity} nueva${line.quantity === 1 ? '' : 's'}` : '';
    return { text: `${line.productName} — ${correctionText}${addition}`, showReviewMarker: !line.touched };
  }

  if (saving) {
    return <p className={styles.savingLine}>Guardando…</p>;
  }

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
          <button
            className={`${styles.pickerBtn} ${!draft ? styles.placeholder : ''}`}
            onClick={() => setPickerOpen(true)}
          >
            {draft ? draft.productName : 'Elegir producto ▾'}
          </button>
        </div>

        {draft && draft.currentQuantity && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad actual</span>
            <QuantityStepper
              value={draft.currentQuantity.value}
              touched
              showMarker={false}
              ariaLabel="Cantidad actual"
              min={0}
              max={draft.currentQuantity.ceiling}
              onChange={(next) => {
                resetSaveAttempt();
                setDraft((d) => (d && d.currentQuantity ? { ...d, currentQuantity: { ...d.currentQuantity, value: next } } : d));
              }}
            />
            <span className={styles.hint}>
              Corrígela si algo no cuadra (por ejemplo, piezas defectuosas que regresaste)
            </span>
          </div>
        )}

        {draft && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad</span>
            <QuantityStepper
              value={draft.quantity}
              touched={draft.touched}
              min={draft.currentQuantity ? 0 : 1}
              onChange={(next, touched) => {
                resetSaveAttempt();
                setDraft((d) => (d ? { ...d, quantity: next, touched } : d));
              }}
            />
            {draft.currentQuantity && <span className={styles.hint}>Lo que te llegó nuevo</span>}
          </div>
        )}

        {draft && (
          <button className={styles.addAnother} onClick={handleAddAnother}>
            + Agregar otro producto
          </button>
        )}
      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button disabled={!canSave} onClick={handleSave}>
          Guardar mercancía
        </Button>
        {committed.length > 0 && (
          <button className={styles.discard} onClick={() => setDiscardOpen(true)}>
            Descartar
          </button>
        )}
      </div>

      {pickerOpen && (
        <ProductPicker
          rows={catalogRows(state)}
          onDismiss={() => setPickerOpen(false)}
          onSelectExisting={(product) => {
            // D77/§3.8 — covers all three carry-forward entry points this
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
            });
            setPickerOpen(false);
          }}
        />
      )}

      {discardOpen && (
        <Sheet onDismiss={() => setDiscardOpen(false)}>
          <p className={styles.heading} style={{ padding: 0, marginBottom: 16 }}>
            ¿Descartar los {committed.length + (draft ? 1 : 0)} productos que ya agregaste?
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
