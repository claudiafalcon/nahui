import { useState } from 'react';
import { useStore } from '../../domain/store';
import { closedSessionsInRange, defaultExportRange, salesExportRows } from '../../domain/selectors';
import { todayKey } from '../../domain/dates';
import { Button } from '../../components/Button/Button';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import { buildSalesExportCsv, triggerCsvDownload } from './salesExportCsv';
import styles from './Resultados.module.css';

/** `reports.md` §3.2's own "slow (>~1.5s)" boundary, reused verbatim per
 * §3.20's own explicit instruction ("Same near-instant/slow split as
 * §3.1/§3.2, not skipped") — the same literal threshold
 * `ResolvingState.tsx`/`PersonalParaEsteEvento.tsx` already use for this
 * identical convention, replicated locally here rather than imported, the
 * same per-screen-copy precedent `PersonalParaEsteEvento.tsx` already set
 * (this screen's own text, "Preparando tu archivo…," differs from both of
 * those, so the shared `ResolvingState` component — hardcoded to "Un
 * momento…" — isn't reusable as-is). */
const SLOW_THRESHOLD_MS = 1500;

type SubView = { kind: 'range' } | { kind: 'generating' } | { kind: 'ready'; filename: string };

/**
 * `reports.md` §3.19/§3.20 (`product-decisions.md` Q27) — "Exportar tus
 * ventas": a date-range picker (§3.19) followed by a client-side CSV
 * generate-and-download (§3.20), combined in one component the same way
 * `TeamScreen.tsx` combines its own multi-step "Nueva invitación" flow —
 * one screen, an internal `SubView` state machine, no separate mount per
 * step in `ResultadosScreen.tsx`.
 *
 * Reached only from the main view's own "[ Exportar tus ventas ▸ ]" row
 * (§3.4/§3.5/§3.6, `ResultadosMain.tsx`), itself only ever rendered once
 * `hasAnyClosedSession` is true (§2's sales-export availability check reuses
 * that identical, already-enforced condition) — so `defaultExportRange`
 * below is never actually reached as `null` through real navigation.
 *
 * OWNER-only, inheriting the whole tab's existing scope (`App.tsx`'s
 * `role === 'OWNER'` gate) — not independently re-gated here, same posture
 * every other Resultados sub-screen already holds. **Available at any
 * `subscriptionTier`** — this component never reads `subscriptionTier` at
 * all, unlike `RendimientoPorBazar`/`TusClientes`.
 */
export function ExportarVentas({ onBack }: { onBack: () => void }) {
  const { state } = useStore();
  const today = todayKey();
  const bounds = defaultExportRange(state);

  const [desde, setDesde] = useState(bounds?.desde ?? today);
  const [hasta, setHasta] = useState(bounds?.hasta ?? today);
  const [subView, setSubView] = useState<SubView>({ kind: 'range' });
  const [slow, setSlow] = useState(false);

  // §3.19's own disabled-not-error rule — re-evaluated on every render as
  // she edits either date, re-enabling the instant the picked range
  // contains ≥1 closed Session.
  const matchingSessions = closedSessionsInRange(state, desde, hasta);
  const canDownload = matchingSessions.length > 0;

  function handleDesdeChange(next: string) {
    setDesde(next);
    if (next > hasta) setHasta(next); // keeps Hasta ≥ Desde, same auto-adjust NuevoEvento.tsx already applies to its own Empieza/Termina pair
  }

  function handleHastaChange(next: string) {
    setHasta(next);
    if (next < desde) setDesde(next);
  }

  async function handleDownload() {
    if (!canDownload) return;
    setSlow(false);
    setSubView({ kind: 'generating' });
    const slowTimer = window.setTimeout(() => setSlow(true), SLOW_THRESHOLD_MS);
    // Yields one tick before the synchronous CSV build below so the
    // "generating" state actually paints first, matching §3.20's own
    // reasoning ("Generation time scales with this Business's total
    // closed-Session/Sale volume... so an always-instant assumption isn't
    // safe to assert") structurally — even though this prototype's own
    // local, already-loaded `AppState` makes the real computation itself
    // effectively instant in practice.
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    const rows = salesExportRows(state, desde, hasta);
    const csv = buildSalesExportCsv(rows);
    const filename = `ventas-${desde}-a-${hasta}.csv`;
    triggerCsvDownload(csv, filename);
    window.clearTimeout(slowTimer);
    setSubView({ kind: 'ready', filename });
  }

  if (subView.kind === 'generating') {
    return (
      <ScreenTransition transitionKey="exportar-generating">
        {slow ? (
          <div className={styles.exportGeneratingWrap}>
            <p className={styles.exportSlowText}>Preparando tu archivo…</p>
          </div>
        ) : (
          <div className={styles.exportGeneratingWrap} aria-hidden="true">
            <div className={styles.exportBlockLg} />
            <div className={styles.exportBlockSm} />
          </div>
        )}
      </ScreenTransition>
    );
  }

  if (subView.kind === 'ready') {
    return (
      <ScreenTransition transitionKey="exportar-ready">
        <div className={styles.exportReadyWrap}>
          <p className={styles.exportReadyCheck}>✓ Descarga lista</p>
          <p className={styles.exportReadyFilename}>{subView.filename}</p>
          {/* §3.20: "'[ Listo ]' → returns to §3.19, date pickers
              unchanged, so she can immediately export a second, different
              range without re-navigating from the main view." Desde/Hasta
              state above is untouched by this transition. */}
          <Button className={styles.exportReadyCta} onClick={() => setSubView({ kind: 'range' })}>
            Listo
          </Button>
        </div>
      </ScreenTransition>
    );
  }

  // §3.19 — "Elige el rango a exportar" (vista principal de este flujo).
  return (
    <ScreenTransition transitionKey="exportar-range">
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Resultados
        </button>
      </div>
      <h1 className={styles.exportHeading}>Elige el rango a exportar</h1>

      <div className={styles.scroll}>
        <div className={styles.exportField}>
          <span className={styles.exportLabel}>Desde</span>
          <input
            className={styles.exportDateInput}
            type="date"
            value={desde}
            max={hasta}
            onChange={(e) => handleDesdeChange(e.target.value)}
          />
        </div>
        <div className={styles.exportField}>
          <span className={styles.exportLabel}>Hasta</span>
          <input
            className={styles.exportDateInput}
            type="date"
            value={hasta}
            min={desde}
            max={today}
            onChange={(e) => handleHastaChange(e.target.value)}
          />
        </div>

        <p className={styles.exportBody}>
          Vas a descargar un archivo de Excel (CSV) con una fila por producto vendido — se puede abrir en Excel,
          Google Sheets, o cualquier otra hoja de cálculo.
        </p>

        <p className={styles.exportColumns}>
          Columnas: Fecha, Lugar, Evento, Sesión, Vendedor, Producto, Cantidad, Precio, ID de venta
        </p>

        <p className={styles.exportDisclosure}>
          "Vendedor" solo distingue Tú de tu equipo — no muestra el nombre de la persona.
        </p>

        {!canDownload && <p className={styles.exportEmptyNote}>No hay ventas en este rango.</p>}
      </div>

      <div className={`${styles.exportFooter} stitchTop`}>
        <Button disabled={!canDownload} onClick={handleDownload}>
          Descargar CSV
        </Button>
      </div>
    </ScreenTransition>
  );
}
