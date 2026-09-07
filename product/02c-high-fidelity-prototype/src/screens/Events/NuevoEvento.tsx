import { useState } from 'react';
import { useStore } from '../../domain/store';
import type { VenueRef } from '../../domain/store';
import { formatDateRange, todayKey } from '../../domain/dates';
import { Button } from '../../components/Button/Button';
import { VenuePicker } from '../../components/VenuePicker/VenuePicker';
import { EventTypeSheet } from '../../components/EventTypeSheet/EventTypeSheet';
import { EVENT_TYPE_LABELS } from './eventTypeLabels';
import type { EventType } from '../../domain/types';
import styles from './NuevoEvento.module.css';

/**
 * events.md §3.6 — Agendar evento. Lugar + Tipo are the only two fields that
 * gate "Guardar evento"; Empieza defaults to hoy (editable), Termina
 * auto-fills from Empieza (editable) — both already valid the instant the
 * form opens, per the EVT-Q1/EVT-Q2 amendment. Costo del evento is optional
 * and never gates the save.
 *
 * **D17's own overlap-validation variant is removed outright, not merely
 * relaxed (`decision-log.md` D53, Slice 12) — pure code-debt deletion, not
 * new design work.** D53 confirmed the restriction (`domain-model.md`'s "at
 * most one Event per Business may be `scheduled`/`active` with an
 * overlapping date range at a time") was never a business-capacity rule,
 * only a now-obsolete single-actor `home.md` resolution safeguard;
 * simultaneous multi-Event operation is a real, supported case now. The
 * conflict-detection/inline-warning machinery this form once ran on every
 * date edit is gone along with the rule it enforced.
 */
export function NuevoEvento({ onSaved, onBack }: { onSaved: (eventId: string) => void; onBack: () => void }) {
  const { state, createEvent } = useStore();
  const today = todayKey();

  const [venueRef, setVenueRef] = useState<VenueRef | null>(null);
  const [venueLabel, setVenueLabel] = useState<string | null>(null);
  const [type, setType] = useState<EventType | null>(null);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [endDateEdited, setEndDateEdited] = useState(false);
  const [bazaarCost, setBazaarCost] = useState('');
  const [picker, setPicker] = useState<'venue' | 'type' | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');

  const canSave = venueRef !== null && type !== null && endDate >= startDate && saveState !== 'saving';

  function handleStartDateChange(next: string) {
    setStartDate(next);
    if (!endDateEdited) setEndDate(next);
  }

  function handleEndDateChange(next: string) {
    setEndDate(next);
    setEndDateEdited(true);
  }

  function handleSave() {
    if (!canSave || !venueRef || !type) return;
    setSaveState('saving');
    // Near-instant save convention (events.md §3.9) — the same deliberate
    // beat every other write in this codebase uses. `createEvent` always
    // succeeds now (D53 removed the one save-rejection case it ever had) —
    // the `error` branch below is kept as a real, correctly-rendering,
    // disclosed-not-wired state, matching this codebase's own convention
    // for a write that structurally cannot fail in this mock (see
    // docs/passes/slice-3-eventos.md's disclosure section).
    window.setTimeout(() => {
      const eventId = createEvent({
        venue: venueRef,
        type,
        startDate,
        endDate,
        bazaarCost: parseFloat(bazaarCost) || 0,
      });
      setSaveState('idle');
      onSaved(eventId);
    }, 260);
  }

  if (saveState === 'error') {
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorBody}>No se pudo guardar. Tu evento sigue aquí, intenta de nuevo.</p>
        {venueLabel && (
          <p className={styles.errorMeta}>
            {venueLabel} · {formatDateRange(startDate, endDate)}
          </p>
        )}
        <Button onClick={() => setSaveState('idle')}>Reintentar</Button>
      </div>
    );
  }

  if (saveState === 'saving') {
    return <p className={styles.savingLine}>Guardando…</p>;
  }

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Eventos
        </button>
      </div>
      <h1 className={styles.heading}>Nuevo evento</h1>

      <div className={styles.scroll}>
        <div className={styles.field}>
          <span className={styles.label}>Lugar</span>
          <button
            className={`${styles.pickerBtn} ${!venueLabel ? styles.placeholder : ''}`}
            onClick={() => setPicker('venue')}
          >
            {venueLabel ?? 'Elegir lugar ▾'}
          </button>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Tipo</span>
          <button className={`${styles.pickerBtn} ${!type ? styles.placeholder : ''}`} onClick={() => setPicker('type')}>
            {type ? EVENT_TYPE_LABELS[type] : 'Elegir tipo ▾'}
          </button>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Empieza</span>
          <input
            className={styles.dateInput}
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Termina</span>
          <input
            className={styles.dateInput}
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Costo del evento (opcional)</span>
          <div className={styles.priceField}>
            <span className={styles.pesoSign}>$</span>
            <input
              className={styles.priceInput}
              type="number"
              inputMode="decimal"
              value={bazaarCost}
              onChange={(e) => setBazaarCost(e.target.value)}
            />
          </div>
        </div>

      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button disabled={!canSave} onClick={handleSave}>
          Guardar evento
        </Button>
      </div>

      {picker === 'venue' && (
        <VenuePicker
          venues={state.venues}
          onDismiss={() => setPicker(null)}
          onSelectExisting={(venue) => {
            setVenueRef({ kind: 'existing', venueId: venue.id });
            setVenueLabel(venue.displayName);
            setPicker(null);
          }}
          onCreateNew={(displayName) => {
            setVenueRef({ kind: 'new', displayName });
            setVenueLabel(displayName);
            setPicker(null);
          }}
        />
      )}

      {picker === 'type' && (
        <EventTypeSheet
          onDismiss={() => setPicker(null)}
          onSelect={(t) => {
            setType(t);
            setPicker(null);
          }}
        />
      )}
    </>
  );
}
