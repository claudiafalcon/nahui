import { useMemo, useState } from 'react';
import { makeId } from '../../domain/id';
import { pesos } from '../../domain/format';
import { Button } from '../../components/Button/Button';
import { TagStub } from '../../components/TagStub/TagStub';
import { WritingState } from './WritingState';
import styles from './SellingGroups.module.css';

interface CommittedLine {
  key: string;
  name: string;
  price: number;
}

/**
 * onboarding.md §2.2a/§3.5b–§3.5e — Define lo que vendes, real paths only.
 * Flat Producto+Precio row (§3.5b's own reasoning: a first-run Catalog is
 * guaranteed empty, so the existing-vs-new ambiguity `inventory.md`'s own
 * two-step picker exists to resolve can never arise here). No back arrow,
 * no nav bar, no "Descartar" equivalent (§3.5c's own reasoning).
 */
export function SellingGroups({ onSaved }: { onSaved: (lines: { name: string; defaultPrice: number }[]) => void }) {
  const [committed, setCommitted] = useState<CommittedLine[]>([]);
  const [draftName, setDraftName] = useState('');
  const [draftPrice, setDraftPrice] = useState('');
  const [dupError, setDupError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const draftPriceValue = useMemo(() => parseFloat(draftPrice), [draftPrice]);
  const draftValid =
    draftName.trim().length > 0 && draftPrice.trim().length > 0 && !Number.isNaN(draftPriceValue) && draftPriceValue > 0;
  const draftEmpty = draftName.trim() === '' && draftPrice.trim() === '';
  const canContinue = draftValid || (draftEmpty && committed.length > 0);

  function isDuplicate(name: string): boolean {
    const normalized = name.trim().toLowerCase();
    return committed.some((c) => c.name.trim().toLowerCase() === normalized);
  }

  function commitDraft(): boolean {
    if (!draftValid) return false;
    if (isDuplicate(draftName)) {
      setDupError(`Ya agregaste "${draftName.trim()}" — bórrala con [✕] si quieres cambiar el precio`);
      return false;
    }
    setCommitted((c) => [...c, { key: makeId('sg'), name: draftName.trim(), price: draftPriceValue }]);
    setDraftName('');
    setDraftPrice('');
    setDupError(null);
    return true;
  }

  function handleAddAnother() {
    commitDraft();
  }

  function handleContinue() {
    let lines = committed.map((c) => ({ name: c.name, defaultPrice: c.price }));
    if (draftValid) {
      if (isDuplicate(draftName)) {
        setDupError(`Ya agregaste "${draftName.trim()}" — bórrala con [✕] si quieres cambiar el precio`);
        return;
      }
      lines = [...lines, { name: draftName.trim(), defaultPrice: draftPriceValue }];
    } else if (!draftEmpty) {
      return; // guard — Continuar is disabled in this state, see canContinue
    }
    if (lines.length === 0) return;
    setSaving(true);
    window.setTimeout(() => onSaved(lines), 260);
  }

  function removeCommitted(key: string) {
    setCommitted((c) => c.filter((l) => l.key !== key));
  }

  if (saving) {
    return <WritingState label="Guardando lo que vendes…" />;
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>¿Qué vendes?</h1>
      {committed.length === 0 && (
        <p className={styles.body}>
          Agrega lo que vendes y a cuánto — puedes agregar o cambiar esto después, cuando quieras, en
          Inventario.
        </p>
      )}

      <div className={styles.scroll}>
        {committed.length > 0 && (
          <div className={styles.committed}>
            <span className={styles.committedTitle}>Ya agregaste:</span>
            {committed.map((line) => (
              <div key={line.key} className={`${styles.committedRow} stitchBottom`}>
                <TagStub name={line.name} size={28} />
                <span className={styles.committedName}>{line.name}</span>
                <span className={`${styles.priceTag} moneyTag`}>{pesos(line.price)}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeCommitted(line.key)}
                  aria-label={`Quitar ${line.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.field}>
          <span className={styles.label}>Producto</span>
          <input
            className={styles.input}
            type="text"
            placeholder="Escribe el nombre…"
            value={draftName}
            onChange={(e) => {
              setDraftName(e.target.value);
              setDupError(null);
            }}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Precio</span>
          <div className={styles.priceField}>
            <span className={styles.pesoSign}>$</span>
            <input
              className={styles.priceInput}
              type="number"
              inputMode="decimal"
              value={draftPrice}
              onChange={(e) => {
                setDraftPrice(e.target.value);
                setDupError(null);
              }}
            />
          </div>
        </div>
        {dupError && <p className={styles.error}>{dupError}</p>}

        <button className={styles.addAnother} onClick={handleAddAnother} disabled={!draftValid}>
          + Agregar otro producto
        </button>
      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button disabled={!canContinue} onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
