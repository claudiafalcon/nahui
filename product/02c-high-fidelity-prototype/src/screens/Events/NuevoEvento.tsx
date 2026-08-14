import { useMemo, useState } from 'react';
import { useStore } from '../../domain/store';
import type { VenueRef } from '../../domain/store';
import { eventStatus } from '../../domain/selectors';
import { formatDateRange, rangesOverlap, todayKey } from '../../domain/dates';
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
 */
export function NuevoEvento({ onSaved, onBack }: { onSaved: (eventId: string) => void; onBack: () => void }) {
  const { state, createEvent } = useStore();
  const today = todayKey();

  const [venueRef, setVenueRef] = useState<VenueRef | null>(null);
  const [venueLabel, setVenueLabel] = useState<string | null>(null);
  const [type, setType] = useState<EventType | null>(null);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [startDateEdited, setStartDateEdited] = useState(false);
  const [endDateEdited, setEndDateEdited] = useState(false);
  const [bazaarCost, setBazaarCost] = useState('');
  const [touched, setTouched] = useState(false); // EVT-Q1 — has she engaged with the form at all yet
  const [picker, setPicker] = useState<'venue' | 'type' | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');

  // D17 overlap check — computed the instant the form opens (Empieza already
  // resolves to hoy by default), re-run on every date edit, against the same
  // already-loaded Events list this tab already resolved (no new fetch).
  const conflict = useMemo(() => {
    const now = Date.now();
    return state.events.find(
      (e) =>
        (eventStatus(e, now) === 'scheduled' || eventStatus(e, now) === 'active') &&
        rangesOverlap(startDate, endDate, e.startDate, e.endDate),
    );
  }, [state.events, startDate, endDate]);
  const conflictVenueName = conflict ? state.venues.find((v) => v.id === conflict.venueId)?.displayName ?? '' : '';

  const showConflict = touched && Boolean(conflict);
  // EVT-Q1's copy half — "si agendas para hoy" only while Empieza still
  // holds its untouched hoy default; once she edits it herself, the message
  // drops that framing.
  const stillDefaultStart = !startDateEdited && startDate === today;
  const conflictMessage = conflict
    ? `${stillDefaultStart ? 'Si agendas para hoy, esas' : 'Esas'} fechas se cruzan con ${conflictVenueName} (${formatDateRange(
        conflict.startDate,
        conflict.endDate,
      )}). Ajusta las fechas para continuar.`
    : null;

  const canSave =
    venueRef !== null && type !== null && !conflict && endDate >= startDate && saveState !== 'saving';

  function markTouched() {
    if (!touched) setTouched(true);
  }

  function handleStartDateChange(next: string) {
    setStartDate(next);
    setStartDateEdited(true);
    if (!endDateEdited) setEndDate(next);
    markTouched();
  }

  function handleEndDateChange(next: string) {
    setEndDate(next);
    setEndDateEdited(true);
    markTouched();
  }

  function handleSave() {
    if (!canSave || !venueRef || !type) return;
    setSaveState('saving');
    // Near-instant save convention (events.md §3.9) — the same deliberate
    // beat every other write in this codebase uses.
    window.setTimeout(() => {
      const result = createEvent({
        venue: venueRef,
        type,
        startDate,
        endDate,
        bazaarCost: parseFloat(bazaarCost) || 0,
      });
      if (result.ok) {
        setSaveState('idle');
        onSaved(result.eventId);
      } else {
        // §3.9's write-failure branch — unreachable through real interaction
        // in this build for the same disclosed reason every other write
        // here is (the local mock data layer never actually fails a write);
        // `canSave` already excludes an overlap by the time this tap is
        // reachable, so `createEvent` never actually returns `ok:false`
        // here in practice. Kept as a real, correctly-rendering branch —
        // see README.md's disclosure section.
        setSaveState('error');
      }
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

        {showConflict && <p className={styles.conflict}>{conflictMessage}</p>}
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
            markTouched();
          }}
          onCreateNew={(displayName) => {
            setVenueRef({ kind: 'new', displayName });
            setVenueLabel(displayName);
            setPicker(null);
            markTouched();
          }}
        />
      )}

      {picker === 'type' && (
        <EventTypeSheet
          onDismiss={() => setPicker(null)}
          onSelect={(t) => {
            setType(t);
            setPicker(null);
            markTouched();
          }}
        />
      )}
    </>
  );
}
