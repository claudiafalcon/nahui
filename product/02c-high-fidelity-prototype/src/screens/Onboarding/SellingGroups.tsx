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
 *
 * §3.5e's save error/retry is wired (`WritingState`'s `error`/`errorLabel`/
 * `onRetry`, identical shape to §3.5a in `OnboardingFlow.tsx`) — a real,
 * correctly-rendering branch, never triggered in this build since the local
 * mock write never fails, the same disclosed-not-wired convention
 * `BACKLOG.md`'s migration inventory already documents for §3.5a. Retrying
 * replays `handleContinue`, which recomputes the identical committed lines
 * plus active-row draft from unchanged component state — nothing typed is
 * ever lost or re-asked-for. Previously a genuine regression (`BACKLOG.md`
 * migration inventory §B) — closed. The error preview itself (`previewLines`)
 * is a separate, purpose-built passive rendering — plain "Nombre — $Precio"
 * lines per §3.5e's own wireframe, never the normal state's interactive
 * `committedList` — and always includes the still-uncommitted active row
 * when it's save-ready, not only already-committed lines, so the preview is
 * never blank for a merchant who typed one product and tapped "Continuar"
 * directly (`ux-critic` Findings A/B — both closed).
 */
export function SellingGroups({ onSaved }: { onSaved: (lines: { name: string; defaultPrice: number }[]) => void }) {
  const [committed, setCommitted] = useState<CommittedLine[]>([]);
  const [draftName, setDraftName] = useState('');
  const [draftPrice, setDraftPrice] = useState('');
  const [dupError, setDupError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');

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

  // Committed lines plus, when it's ready to save, the still-uncommitted
  // active/draft row — the exact set `handleContinue` writes. Read from one
  // place so the write path and §3.5e's error preview can never disagree
  // about what's actually about to be (or was just attempted to be) saved.
  // Previously `handleContinue` folded the draft row into a local variable
  // only at save time, so a merchant who typed one product and tapped
  // "Continuar" without ever using "+ Agregar otro producto" — a real path
  // §3.5c's own gating rule allows — saw a blank error preview on a failed
  // save even though her row was never lost (`ux-critic` Finding A).
  const previewLines = useMemo(() => {
    const lines = committed.map((c) => ({ name: c.name, price: c.price }));
    if (draftValid && !isDuplicate(draftName)) {
      lines.push({ name: draftName.trim(), price: draftPriceValue });
    }
    return lines;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed, draftValid, draftName, draftPriceValue]);

  function handleContinue() {
    if (draftValid && isDuplicate(draftName)) {
      setDupError(`Ya agregaste "${draftName.trim()}" — bórrala con [✕] si quieres cambiar el precio`);
      return;
    }
    if (!draftValid && !draftEmpty) {
      return; // guard — Continuar is disabled in this state, see canContinue
    }
    const lines = previewLines.map((l) => ({ name: l.name, defaultPrice: l.price }));
    if (lines.length === 0) return;
    setSaveState('saving');
    window.setTimeout(() => onSaved(lines), 260);
  }

  function removeCommitted(key: string) {
    setCommitted((c) => c.filter((l) => l.key !== key));
  }

  // The normal editable state's own committed list — "Ya agregaste:" title,
  // TagStub, live "✕" remove button. §3.5e's error preview deliberately does
  // NOT reuse this: its wireframe draws committed lines as plain text with
  // no `[✕]`, this doc family's own bracket-notation convention marking a
  // passive reminder rather than an editable list. Reusing this interactive
  // markup there would also let a merchant remove a line from `committed`
  // before retrying, breaking §3.5e's own "nothing is lost, retry replays
  // the same state" guarantee (`ux-critic` Finding B) — see `errorPreview`
  // below for the separate, purpose-built passive rendering.
  const committedList = committed.length > 0 && (
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
  );

  if (saveState === 'saving') {
    return <WritingState label="Guardando lo que vendes…" />;
  }

  if (saveState === 'error') {
    // §3.5e — never actually reached in this build (this prototype's local
    // write never fails), the same disclosed-not-wired convention already
    // established for §3.5a. `previewLines` is the exact set `handleContinue`
    // is about to retry-write — every already-committed Selling Group plus
    // the still-uncommitted active row, when it holds a valid Producto +
    // Precio (§3.5b's own "Continuar" gate) — so this preview is never blank
    // when real unsaved data exists on screen, even for a merchant who typed
    // one product and tapped "Continuar" directly. Rendered as a separate,
    // purpose-built passive block (§3.5e's own wireframe: plain "Nombre —
    // $Precio" lines, no title, no `[✕]`) rather than reusing `committedList`
    // — that markup is live/editable and tapping its remove button here
    // would let a merchant shrink `committed` before retrying, breaking this
    // guarantee that retrying replays the exact same state.
    return (
      <WritingState
        error
        errorLabel="No pudimos guardar lo que vendes. Sigue aquí, intenta de nuevo."
        onRetry={handleContinue}
      >
        {previewLines.length > 0 && (
          <div className={styles.errorPreview}>
            {previewLines.map((line, i) => (
              <p key={`${line.name}-${i}`} className={styles.errorPreviewLine}>
                {line.name} — {pesos(line.price)}
              </p>
            ))}
          </div>
        )}
      </WritingState>
    );
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
        {committedList}

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
