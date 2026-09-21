export function pesos(n: number): string {
  return `$${n.toLocaleString('es-MX')}`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function articulos(count: number): string {
  return `${count} ${pluralize(count, 'artículo', 'artículos')}`;
}

/**
 * `inventory.md` §3.4's binding count-caption rule (added 2026-09-21, cited
 * unchanged from §3.19): **count captions render their singular form at
 * exactly N=1** — `1 disponible`, `1 ya etiquetada` — while **zero keeps the
 * plural** (`0 disponibles`), as Spanish requires. `sin etiquetar` is
 * deliberately *not* here: it is an invariant prepositional phrase carrying no
 * agreement, so `1 sin etiquetar` is already correct and must never be
 * "fixed."
 *
 * **One derivation, one rule, applied identically wherever this caption
 * appears** — §3.4's own card (and therefore §3.12/§3.13/§3.13a, which render
 * that same card), §3.19's Level 1, and the passive recognition displays at
 * §3.4e/§3.8c/§3.19b. It lives here, shared, for the reason the spec states it
 * once and cites it from §3.19 rather than writing it twice: **the card and
 * the page can never disagree about one figure.**
 *
 * `sin registrar` (never had a Lot/InventoryEntry received against it — a
 * legacy-data-only case since `product-decisions.md` Q20) is the same
 * plain, factual reading it has always been, carried here so every caller
 * gets the whole caption from one place instead of re-deriving half of it.
 *
 * Deliberately **not** applied to `home.md` §3.9's selling tile or
 * `events.md`'s own stock lines: those are other documents' surfaces, and
 * the Home sibling of this defect is already logged for `ux-designer` as
 * HOME-COPY-1 rather than silently absorbed here.
 */
export function stockCaption(available: number, everReceived: boolean): string {
  if (!everReceived) return 'sin registrar';
  return `${available} ${pluralize(available, 'disponible', 'disponibles')}`;
}
