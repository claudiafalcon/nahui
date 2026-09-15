import type { SalesExportRow } from '../../domain/selectors';
import { EVENT_TYPE_LABELS } from '../Events/eventTypeLabels';

/**
 * `reports.md` §3.19's own file-content column table — nine columns, in
 * this exact order, "authoritative and final — not illustrative example
 * text." Presentation-layer formatting step, one below `SalesExportRow`
 * (`selectors.ts`): Spanish Event-type labels (`EVENT_TYPE_LABELS`, the
 * same map `ResultadosMain.tsx`/`VenueDetail.tsx` already import for the
 * identical purpose), the role→copy mapping §3.4a already established
 * ("Tú"/"Alguien de tu equipo"), and this build's own already-disclosed
 * "Venta rápida" rename (not the Approved spec's literal "Sesión rápida"
 * — `SessionDetail.tsx`/`ResultadosMain.tsx`/`VendiendoAhorita.tsx` all
 * already apply this same rename to this exact header slot; reused here
 * rather than reintroducing the retired term in one lone place a
 * merchant would read right after the screen that renamed it for her).
 *
 * **Real .xlsx, not CSV (corrected 2026-09-15, Product Owner-reported
 * live-testing defect):** a real merchant device (Chrome → downloaded
 * file → opened in the Google Sheets Android app) rendered every
 * accented character as mojibake ("Sesión" → "SesiÃ³n," "Tú" → "TÃº,"
 * "Día 1" → "DÃa 1," "Venta rápida" → "Venta rÃ¡pida") — the exact,
 * single-layer signature of correct UTF-8 bytes being read back as
 * Latin-1/Windows-1252. Verified directly (hex-dumped the built CSV
 * string and the UTF-8 BOM bytes prepended before it) that the file this
 * app generated was itself correctly UTF-8-encoded, BOM included — the
 * defect was the receiving mobile app's own CSV encoding auto-detection,
 * not this codebase's output. A plain-text CSV has no in-file way to
 * *declare* its own encoding beyond that BOM convention, which isn't
 * universally honored by every mobile spreadsheet app's "open a local
 * file" path. `.xlsx` (OOXML) has no equivalent ambiguity — string
 * content is XML, unambiguously UTF-8 per the format's own spec, so
 * there's no encoding step left for any receiving app to get wrong.
 * Generated via `xlsx` (SheetJS community build, MIT) — write-only usage
 * here (never parses an untrusted file), so the package's known
 * npm-audit findings (all in its own file-*parsing* path) don't apply to
 * how this codebase calls it.
 */
const COLUMNS = ['Fecha', 'Lugar', 'Evento', 'Sesión', 'Vendedor', 'Producto', 'Cantidad', 'Precio', 'ID de venta'];

/** `decision-log.md` D69, `product-decisions.md` Q29 — `vendedorDisplayName`
 * first, then the pre-existing role-derivation ("Tú"/"Alguien de tu
 * equipo") — the identical two-tier rule `membershipDisplayName`/§3.4a
 * already establish, reused rather than reimplemented for this export's own
 * "Vendedor" column. `role === undefined` (an orphaned Membership
 * reference, unreachable through any real write path in this codebase)
 * still falls back to "Alguien de tu equipo," the same defensive-but-honest
 * posture `membershipById`'s own callers already take elsewhere in this
 * tab. */
function vendedorLabel(row: Pick<SalesExportRow, 'vendedorRole' | 'vendedorDisplayName'>): string {
  if (row.vendedorDisplayName) return row.vendedorDisplayName;
  return row.vendedorRole === 'OWNER' ? 'Tú' : 'Alguien de tu equipo';
}

function sesionLabel(row: SalesExportRow): string {
  return row.event && row.dayNumber != null ? `Día ${row.dayNumber}` : 'Venta rápida';
}

/** Builds the actual workbook — one header row plus one row per
 * `SalesExportRow`, a single "Ventas" sheet. Returns the raw `.xlsx`
 * bytes as an `ArrayBuffer`, ready to hand straight to a `Blob`.
 *
 * **`xlsx` is dynamically imported, not a static top-level import.** The
 * SheetJS package adds ~450KB (gzipped) to whichever chunk statically
 * imports it — real weight for a capability only the OWNER-only Resultados
 * export flow ever needs, not something every merchant's initial app load
 * should pay for. `await import('xlsx')` here means Vite code-splits it
 * into its own chunk, fetched only the first time she actually taps
 * "Descargar Excel" — Home's <3s bar (`company/backlog.md` #1) never sees
 * this weight. */
export async function buildSalesExportWorkbook(rows: SalesExportRow[]): Promise<ArrayBuffer> {
  const XLSX = await import('xlsx');
  const aoa: (string | number)[][] = [COLUMNS];
  for (const row of rows) {
    aoa.push([
      row.fecha,
      row.venue?.displayName ?? '',
      row.event ? EVENT_TYPE_LABELS[row.event.type] : '',
      sesionLabel(row),
      vendedorLabel(row),
      row.product.name,
      row.cantidad,
      row.precio,
      row.saleId,
    ]);
  }
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
}

/**
 * §3.20 — "Purely client-side... generation and the download trigger
 * both run over already-loaded `AppState`, not a network fetch." Standard
 * Blob + `<a download>` browser mechanism, no backend involved at any
 * step — unchanged by the CSV→xlsx correction above, still a local file
 * write, never a write to `AppState` or any backend table.
 */
export function triggerXlsxDownload(workbook: ArrayBuffer, filename: string): void {
  const blob = new Blob([workbook], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
