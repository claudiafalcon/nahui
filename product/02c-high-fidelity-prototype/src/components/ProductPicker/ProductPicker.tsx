import { useMemo, useState } from 'react';
import { Sheet } from '../Sheet/Sheet';
import { Button } from '../Button/Button';
import { TagStub } from '../TagStub/TagStub';
import type { Product } from '../../domain/types';
import styles from './ProductPicker.module.css';

/**
 * inventory.md §3.8 / §3.8a — Elegir producto. One field resolves both
 * "restock an existing Product" and "this is new" — matching rule:
 * case-insensitive, whitespace-trimmed (never fuzzy). Price is required,
 * with no honest default, only for a genuinely new Product identity (D33) —
 * never re-asked for an existing one.
 */
export function ProductPicker({
  products,
  onDismiss,
  onSelectExisting,
  onCreateNew,
}: {
  products: Product[];
  onDismiss: () => void;
  onSelectExisting: (product: Product) => void;
  onCreateNew: (name: string, price: number) => void;
}) {
  const [query, setQuery] = useState('');
  const [creatingName, setCreatingName] = useState<string | null>(null);
  const [price, setPrice] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const exactMatch = products.find((p) => p.name.trim().toLowerCase() === normalizedQuery);
  const visible = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(normalizedQuery))
    : products;

  const showAddNew = normalizedQuery.length > 0 && !exactMatch;

  const priceValue = useMemo(() => parseFloat(price), [price]);
  const priceValid = price.trim().length > 0 && !Number.isNaN(priceValue) && priceValue > 0;

  if (creatingName !== null) {
    return (
      <Sheet onDismiss={onDismiss}>
        <p className={styles.sheetTitle}>¿Qué llegó?</p>
        <p className={styles.newProductLabel}>Nuevo producto: {creatingName}</p>
        <div className={styles.priceField}>
          <span className={styles.pesoSign}>$</span>
          <input
            className={styles.priceInput}
            type="number"
            inputMode="decimal"
            placeholder="Precio"
            autoFocus
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <Button disabled={!priceValid} onClick={() => onCreateNew(creatingName, priceValue)}>
          Agregar "{creatingName}"
        </Button>
      </Sheet>
    );
  }

  return (
    <Sheet onDismiss={onDismiss}>
      <p className={styles.sheetTitle}>¿Qué llegó?</p>
      <input
        className={styles.search}
        placeholder="Buscar o escribir…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {showAddNew && (
        <button className={`${styles.addNew} stitchBottom`} onClick={() => setCreatingName(query.trim())}>
          + Agregar "{query.trim()}" como producto nuevo
        </button>
      )}
      <div className={styles.list}>
        {visible.length === 0 && !showAddNew && (
          <p className={styles.empty}>
            {products.length === 0 ? 'Escribe el nombre de lo que llegó.' : 'Sin resultados.'}
          </p>
        )}
        {visible.map((p) => (
          <button key={p.id} className={`${styles.option} stitchBottom`} onClick={() => onSelectExisting(p)}>
            <TagStub name={p.name} size={30} />
            {p.name}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
