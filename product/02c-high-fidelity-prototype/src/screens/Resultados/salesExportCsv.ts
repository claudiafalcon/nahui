import type { SalesExportRow } from '../../domain/selectors';
import { EVENT_TYPE_LABELS } from '../Events/eventTypeLabels';

/**
 * `reports.md` §3.19's own file-content column table — nine columns, in
 * this exact order, "authoritative and final — not illustrative example
 * text." Kept here, one step downstream of `SalesExportRow` (`selectors.ts`),
 * as the presentation-layer formatting step: Spanish Event-type labels
 * (`EVENT_TYPE_LABELS`, the same map `ResultadosMain.tsx`/`VenueDetail.tsx`
 * already import for the identical purpose), the role→copy mapping §3.4a
 * already established ("Tú"/"Alguien de tu equipo"), and this build's own
 * already-disclosed "Venta rápida" rename (not the Approved spec's literal
 * "Sesión rápida" — `SessionDetail.tsx`/`ResultadosMain.tsx`/
 * `VendiendoAhorita.tsx` all already apply this same rename to this exact
 * header slot; reused here rather than reintroducing the retired term in
 * one lone place a merchant would read right after the screen that renamed
 * it for her).
 */
const COLUMNS = ['Fecha', 'Lugar', 'Evento', 'Sesión', 'Vendedor', 'Producto', 'Cantidad', 'Precio', 'ID de venta'];

function csvCell(value: string | number): string {
  const s = String(value);
  // RFC 4180 minimal escaping — quote a cell only when it actually contains
  // a comma, quote, or newline (a Product name is the one field genuinely
  // free-text enough to need this; every other column is either a fixed
  // vocabulary or a plain number/id).
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function vendedorLabel(role: SalesExportRow['vendedorRole']): string {
  // §2's own role-derivation, reused as-is ("Tú"/"Alguien de tu equipo") —
  // `role === undefined` (an orphaned Membership reference, unreachable
  // through any real write path in this codebase) falls back to the same
  // "Alguien de tu equipo" copy rather than a blank cell or a crash, the
  // same defensive-but-honest posture `membershipById`'s own callers
  // already take elsewhere in this tab.
  return role === 'OWNER' ? 'Tú' : 'Alguien de tu equipo';
}

function sesionLabel(row: SalesExportRow): string {
  return row.event && row.dayNumber != null ? `Día ${row.dayNumber}` : 'Venta rápida';
}

/** Builds the actual CSV text — one header row plus one row per
 * `SalesExportRow`, CRLF-joined (the conventional CSV line ending, what
 * Excel itself writes). A leading UTF-8 BOM is prepended by the caller
 * (`triggerCsvDownload` below), not here, so this function's own return
 * value stays a plain, testable string. */
export function buildSalesExportCsv(rows: SalesExportRow[]): string {
  const lines = [COLUMNS.map(csvCell).join(',')];
  for (const row of rows) {
    lines.push(
      [
        row.fecha,
        row.venue?.displayName ?? '',
        row.event ? EVENT_TYPE_LABELS[row.event.type] : '',
        sesionLabel(row),
        vendedorLabel(row.vendedorRole),
        row.product.name,
        row.cantidad,
        row.precio,
        row.saleId,
      ]
        .map(csvCell)
        .join(','),
    );
  }
  return lines.join('\r\n');
}

/**
 * §3.20 — "Purely client-side... CSV generation and the download trigger
 * both run over already-loaded `AppState`, not a network fetch." Standard
 * Blob + `<a download>` browser mechanism, no backend involved at any step.
 * A UTF-8 BOM is prepended so Excel (which, unlike Sheets, doesn't sniff
 * encoding) renders accented column headers/Product names correctly instead
 * of mojibake — a small, disclosed implementation choice, not specified
 * either way by the Approved spec.
 */
export function triggerCsvDownload(csv: string, filename: string): void {
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
