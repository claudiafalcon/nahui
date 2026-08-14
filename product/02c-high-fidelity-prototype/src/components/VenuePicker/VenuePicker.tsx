import { useState } from 'react';
import { Sheet } from '../Sheet/Sheet';
import type { Venue } from '../../domain/types';
import styles from '../ProductPicker/ProductPicker.module.css';

/**
 * events.md §3.7 — Elegir lugar. Mirrors `ProductPicker` (`inventory.md`
 * §3.8) field-for-field, per the Architect's own ruling that this is the
 * same interaction pattern, not a new one — reuses its module CSS directly
 * rather than duplicating styles. One field resolves both "sell at a place
 * she's used before" (select an existing Venue) and "this is somewhere new"
 * (create it inline) — matching rule: case-insensitive, whitespace-trimmed
 * (never fuzzy), the identical rule `inventory.md` §3.8 already established.
 *
 * Unlike `ProductPicker`, a new Venue carries no second required field
 * (Product needs a price; Venue needs only its own name) — "Agregar... como
 * lugar nuevo" resolves in one tap, not two. Nothing is written to the store
 * from this component: it only ever returns a `VenueRef`-shaped selection to
 * its caller (`NuevoEvento`), which holds it as a local pending value until
 * "Guardar evento" resolves it atomically (`store.tsx`'s `resolveVenue`,
 * mirroring the discipline the `ProductPicker` premature-write Blocker fix
 * established for Product).
 */
export function VenuePicker({
  venues,
  onDismiss,
  onSelectExisting,
  onCreateNew,
}: {
  venues: Venue[];
  onDismiss: () => void;
  onSelectExisting: (venue: Venue) => void;
  onCreateNew: (displayName: string) => void;
}) {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const exactMatch = venues.find((v) => v.displayName.trim().toLowerCase() === normalizedQuery);
  const visible = query.trim()
    ? venues.filter((v) => v.displayName.toLowerCase().includes(normalizedQuery))
    : venues;

  const showAddNew = normalizedQuery.length > 0 && !exactMatch;

  return (
    <Sheet onDismiss={onDismiss}>
      <p className={styles.sheetTitle}>¿Dónde vas a vender?</p>
      <input
        className={styles.search}
        placeholder="Buscar o escribir…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      {showAddNew && (
        <button className={`${styles.addNew} stitchBottom`} onClick={() => onCreateNew(query.trim())}>
          + Agregar "{query.trim()}" como lugar nuevo
        </button>
      )}
      <div className={styles.list}>
        {visible.length === 0 && !showAddNew && (
          <p className={styles.empty}>
            {venues.length === 0 ? 'Escribe el nombre del lugar.' : 'Sin resultados.'}
          </p>
        )}
        {visible.map((v) => (
          <button key={v.id} className={`${styles.option} stitchBottom`} onClick={() => onSelectExisting(v)}>
            {v.displayName}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
