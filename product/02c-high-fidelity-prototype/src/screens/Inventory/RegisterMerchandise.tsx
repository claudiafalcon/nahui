import { useState } from 'react';
import { useStore } from '../../domain/store';
import { ProductPicker } from '../../components/ProductPicker/ProductPicker';
import { QuantityStepper } from '../../components/QuantityStepper/QuantityStepper';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { TagStub } from '../../components/TagStub/TagStub';
import styles from './RegisterMerchandise.module.css';

interface Line {
  productId: string;
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
  onSaved: (lastProductId: string) => void;
  onBack: () => void;
}) {
  const { state, addProduct, commitLot } = useStore();
  const initialProduct = state.products.find((p) => p.id === initialProductId);

  const [committed, setCommitted] = useState<Line[]>([]);
  const [draft, setDraft] = useState<Line | null>(
    initialProduct
      ? { productId: initialProduct.id, productName: initialProduct.name, quantity: 1, touched: false }
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
      commitLot(lines.map((l) => ({ productId: l.productId, quantity: l.quantity })));
      setSaving(false);
      onSaved(lines[lines.length - 1].productId);
    }, 260);
  }

  function removeCommitted(productId: string) {
    setCommitted((c) => c.filter((l) => l.productId !== productId));
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
              <div key={line.productId} className={`${styles.committedRow} stitchBottom`}>
                <TagStub name={line.productName} size={28} />
                <span className={styles.committedName}>
                  {line.productName} — {line.quantity}
                  {!line.touched && <span className={styles.reviewFlag}> · revisa</span>}
                </span>
                <button className={styles.removeBtn} onClick={() => removeCommitted(line.productId)} aria-label={`Quitar ${line.productName}`}>
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
            setDraft({ productId: product.id, productName: product.name, quantity: 1, touched: false });
            setPickerOpen(false);
          }}
          onCreateNew={(name, price) => {
            const product = addProduct(name, price);
            setDraft({ productId: product.id, productName: product.name, quantity: 1, touched: false });
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
