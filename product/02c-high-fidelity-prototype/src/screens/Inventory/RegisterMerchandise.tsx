import { useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows } from '../../domain/selectors';
import { makeId } from '../../domain/id';
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
  quantity: number;
  touched: boolean;
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
  const { state, commitLot } = useStore();
  const initialProduct = state.products.find((p) => p.id === initialProductId);

  const [committed, setCommitted] = useState<Line[]>([]);
  const [draft, setDraft] = useState<Line | null>(
    initialProduct
      ? {
          key: initialProduct.id,
          product: { kind: 'existing', productId: initialProduct.id },
          productName: initialProduct.name,
          quantity: 1,
          touched: false,
        }
      : null,
  );
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

  function resetSaveAttempt() {
    commitIdempotencyKeyRef.current = null;
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
    // `reviewer` Blocker fix — generated once per attempt, reused unchanged
    // across a retry (see `commitIdempotencyKeyRef`'s own doc comment above).
    if (!commitIdempotencyKeyRef.current) {
      commitIdempotencyKeyRef.current = crypto.randomUUID();
    }
    const idempotencyKey = commitIdempotencyKeyRef.current;
    // The atomic write, per inventory.md §3.8a: any `new` line's Product
    // identity is minted here, inside commitLot's own transaction — never
    // before. `resolved` mirrors `lines`' order, so its last entry is the
    // productId (real or freshly-minted) of the line just saved.
    //
    // Stage 7 Backend Integration, Phase 1 — commitLot is now a real,
    // awaitable Supabase RPC call; `saving`'s own "Guardando…" state covers
    // the real network latency (the previous artificial 260ms delay is
    // retired, no longer needed to simulate one). A rejected/failed
    // outcome (`null`) leaves `committed`/`draft` untouched — nothing is
    // lost, she can just tap "Guardar mercancía" again, and the retry
    // replays the exact same idempotency key above.
    const resolved = await commitLot(
      lines.map((l) => ({
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
    if (!resolved) {
      console.error('[RegisterMerchandise] commitLot failed');
      setSaving(false);
      return;
    }
    // Success — this logical attempt is over; a future, genuinely new
    // attempt (a fresh Lot registered after this one) must mint its own key.
    commitIdempotencyKeyRef.current = null;
    // AT-M1 — exactly what this commit wrote, merging any repeated
    // Product across lines into a single quantity (defensive: the form
    // itself never produces two lines for the same Product today, but the
    // receipt should stay correct even if that ever changes).
    const entryBreakdown: { productId: string; quantity: number }[] = [];
    const entryTotals = new Map<string, number>();
    lines.forEach((l, i) => {
      const productId = resolved[i];
      entryTotals.set(productId, (entryTotals.get(productId) ?? 0) + l.quantity);
    });
    entryTotals.forEach((quantity, productId) => entryBreakdown.push({ productId, quantity }));
    setSaving(false);
    onSaved(resolved[resolved.length - 1], entryBreakdown);
  }

  function removeCommitted(key: string) {
    resetSaveAttempt();
    setCommitted((c) => c.filter((l) => l.key !== key));
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
            {committed.map((line) => (
              <div key={line.key} className={`${styles.committedRow} stitchBottom`}>
                <TagStub name={line.productName} photo={photoForLine(line)} size={28} />
                <span className={styles.committedName}>
                  {line.productName} — {line.quantity}
                  {!line.touched && <span className={styles.reviewFlag}> · revisa</span>}
                </span>
                <button className={styles.removeBtn} onClick={() => removeCommitted(line.key)} aria-label={`Quitar ${line.productName}`}>
                  ✕
                </button>
              </div>
            ))}
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

        {draft && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad</span>
            <QuantityStepper
              value={draft.quantity}
              touched={draft.touched}
              onChange={(next, touched) => {
                resetSaveAttempt();
                setDraft((d) => (d ? { ...d, quantity: next, touched } : d));
              }}
            />
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
            resetSaveAttempt();
            setDraft({
              key: product.id,
              product: { kind: 'existing', productId: product.id },
              productName: product.name,
              quantity: 1,
              touched: false,
            });
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
