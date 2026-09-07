import { useMemo, useRef, useState } from 'react';
import { Sheet } from '../Sheet/Sheet';
import { Button } from '../Button/Button';
import { TagStub } from '../TagStub/TagStub';
import type { Product } from '../../domain/types';
import styles from './ProductPicker.module.css';

/** `product-decisions.md` Q23 — verbatim inline failure copy, reused
 * everywhere a selected photo can't be shown. */
const PHOTO_UNREADABLE_MESSAGE = 'No pudimos mostrar ese archivo.';

/**
 * inventory.md §3.8 / §3.8a — Elegir producto. One field resolves both
 * "restock an existing Product" and "this is new" — matching rule:
 * case-insensitive, whitespace-trimmed (never fuzzy). Price is required,
 * with no honest default, only for a genuinely new Product identity (D33) —
 * never re-asked for an existing one. **Foto (opcional), added
 * `product-decisions.md` Q23** — captured optionally alongside Precio for a
 * genuinely new Product only, reusing §3.4b's device-upload mechanism
 * (adapted to this compact sheet field). Never gates "Agregar" — only
 * Precio does.
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
  onCreateNew: (name: string, price: number, photo?: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [creatingName, setCreatingName] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const exactMatch = products.find((p) => p.name.trim().toLowerCase() === normalizedQuery);
  const visible = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(normalizedQuery))
    : products;

  const showAddNew = normalizedQuery.length > 0 && !exactMatch;

  const priceValue = useMemo(() => parseFloat(price), [price]);
  const priceValid = price.trim().length > 0 && !Number.isNaN(priceValue) && priceValue > 0;

  function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError(PHOTO_UNREADABLE_MESSAGE);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(typeof reader.result === 'string' ? reader.result : undefined);
      setPhotoError(null);
    };
    reader.onerror = () => setPhotoError(PHOTO_UNREADABLE_MESSAGE);
    reader.readAsDataURL(file);
  }

  if (creatingName !== null) {
    return (
      <Sheet onDismiss={onDismiss}>
        <p className={styles.sheetTitle}>¿Qué llegó?</p>
        <p className={styles.newProductLabel}>Nuevo producto: {creatingName}</p>
        <p className={styles.newProductLabel}>Precio</p>
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
        <p className={styles.newProductLabel}>Foto (opcional)</p>
        {photo ? (
          <div className={styles.photoRow}>
            <img className={styles.photoThumb} src={photo} alt="" />
            <button className={styles.linkBtn} onClick={() => photoFileInputRef.current?.click()}>
              Cambiar
            </button>
            <button
              className={styles.linkBtn}
              onClick={() => {
                setPhoto(undefined);
                setPhotoError(null);
              }}
            >
              Quitar
            </button>
          </div>
        ) : (
          <button className={styles.uploadBtn} onClick={() => photoFileInputRef.current?.click()}>
            Agregar foto
          </button>
        )}
        {photoError && (
          <p className={styles.photoErrorText}>
            {photoError}
            <br />
            Intenta con otra foto, si quieres.
          </p>
        )}
        <input
          ref={photoFileInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenFileInput}
          onChange={handlePhotoFileChange}
        />
        <Button disabled={!priceValid} onClick={() => onCreateNew(creatingName, priceValue, photo)}>
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
            <TagStub name={p.name} photo={p.photo} size={30} />
            {p.name}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
