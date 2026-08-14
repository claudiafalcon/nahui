import { useState } from 'react';
import { useStore } from '../../domain/store';
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
type ProductRef = { kind: 'existing'; productId: string } | { kind: 'new'; name: string; price: number };

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

  const canSave = committed.length > 0 || draft !== null;

  function commitDraftIfAny(next: Line[]): Line[] {
    if (draft) return [...next, draft];
    return next;
  }

  function handleAddAnother() {
    if (!draft) return;
    setCommitted((c) => [...c, draft]);
    setDraft(null);
    setPickerOpen(true);
  }

  function handleSave() {
    const lines = commitDraftIfAny(committed);
    if (lines.length === 0) return;
    setSaving(true);
    window.setTimeout(() => {
      // The atomic write, per inventory.md §3.8a: any `new` line's Product
      // identity is minted here, inside commitLot's own transaction — never
      // before. `resolved` mirrors `lines`' order, so its last entry is the
      // productId (real or freshly-minted) of the line just saved.
      const resolved = commitLot(
        lines.map((l) => ({
          quantity: l.quantity,
          product:
            l.product.kind === 'existing'
              ? { kind: 'existing' as const, productId: l.product.productId }
              : { kind: 'new' as const, name: l.product.name, defaultPrice: l.product.price },
        })),
      );
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
    }, 260);
  }

  function removeCommitted(key: string) {
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
                <TagStub name={line.productName} size={28} />
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
              onChange={(next, touched) => setDraft((d) => (d ? { ...d, quantity: next, touched } : d))}
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
          products={state.products}
          onDismiss={() => setPickerOpen(false)}
          onSelectExisting={(product) => {
            setDraft({
              key: product.id,
              product: { kind: 'existing', productId: product.id },
              productName: product.name,
              quantity: 1,
              touched: false,
            });
            setPickerOpen(false);
          }}
          onCreateNew={(name, price) => {
            // Not written to the store yet (inventory.md §3.8a) — held as a
            // pending `new` identity in local draft state until "Guardar
            // mercancía" atomically resolves it via commitLot.
            setDraft({
              key: makeId('draft'),
              product: { kind: 'new', name, price },
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
