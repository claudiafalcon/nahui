/**
 * The shared save-state machine every Product Page sheet goes through —
 * §3.4a "Editar precio," §3.4b "Editar foto," §3.4c "Editar código de
 * barras," §3.19a "Editar nombre," §3.19c "Quitar código de barras."
 *
 * Moved here unchanged from `CatalogView.tsx` (2026-09-19 Catalog-card →
 * Product-Page amendment) along with the sheets themselves. Its own history
 * is worth keeping: before 2026-09-19 none of the three original sheets had
 * one at all — a failed save only reached `console.error`, the sheet just
 * stayed open, and the merchant got no message, no retry, and nothing telling
 * her it hadn't saved. A failed save looked exactly like a successful one,
 * minus the sheet closing.
 *
 * One state machine for all of them (they save the same way and fail the same
 * way — five copies would be five things to drift):
 * - `idle`   — at rest, or back at rest after a success.
 * - `saving` — write in flight, under the slow threshold: **silent**,
 *              §3.10's own "near-instant: silent" half. The only visible
 *              effect is that the sheet's controls go inert, so a second tap
 *              can't start a second attempt.
 * - `slow`   — still in flight past ~1.5s: one plain "Guardando…" line,
 *              §3.10's slow half, same copy/shape every other slow save in
 *              this codebase already uses.
 * - `error`  — the write came back rejected/failed: §3.11's plain-Spanish
 *              line plus "Reintentar," with her staged value still on screen
 *              and untouched.
 */
export type SheetSaveState = 'idle' | 'saving' | 'slow' | 'error';

/** §3.10's own ">~1.5s" slow threshold — the identical value §3.19's NFC row
 * and `PersonalParaEsteEvento.tsx` already use. */
export const SLOW_THRESHOLD_MS = 1500;

/** §3.11's own failure line, adapted for an edit sheet. §3.11's literal
 * wording names the merchandise being registered ("No se pudo guardar. Bolsas
 * sigue aquí, intenta de nuevo."); what's preserved here isn't the Product —
 * it never went anywhere — but her staged edit, so this reuses the exact
 * string this codebase already uses for that same meaning in
 * `MercanciaParaEsteEvento.tsx`/`EventDetail.tsx` rather than inventing a
 * fourth phrasing. Same register, same "your work is still here" promise. */
export const SAVE_FAILED_MESSAGE = 'No se pudo guardar. Tus cambios siguen aquí, intenta de nuevo.';

/** True while a write is genuinely in flight (either half of §3.10). */
export function isInFlight(saveState: SheetSaveState): boolean {
  return saveState === 'saving' || saveState === 'slow';
}

/**
 * The one save runner every Product Page sheet goes through — §3.10's
 * near-instant/slow split and §3.11's error state, in one place.
 * Structurally the same `runWrite` shape `PersonalParaEsteEvento.tsx` already
 * establishes for an identical "independent write, its own save/slow/error
 * surface" case, and the same shape §3.19's own NFC row uses — deliberately
 * not a second pattern.
 *
 * The `commit` callback owns the actual store call, so each sheet keeps its
 * own idempotency key and its own arguments; this function only owns the
 * timing and the visible state. Resolves the write's own boolean so the
 * caller can run its success path (close the sheet, fire the ambient
 * confirmation) only when the write genuinely succeeded.
 */
export async function runSheetSave(
  setSaveState: (next: SheetSaveState) => void,
  label: string,
  commit: () => Promise<boolean>,
): Promise<boolean> {
  setSaveState('saving');
  const slowTimer = window.setTimeout(() => setSaveState('slow'), SLOW_THRESHOLD_MS);
  const ok = await commit();
  window.clearTimeout(slowTimer);
  if (!ok) {
    console.error(`[ProductPage] ${label} failed`);
    setSaveState('error');
    return false;
  }
  setSaveState('idle');
  return true;
}
