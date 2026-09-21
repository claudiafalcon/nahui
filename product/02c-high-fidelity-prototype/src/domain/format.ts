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

/**
 * **The already-tagged-garments sentence — one string, two surfaces**
 * (added 2026-09-21, `ux-critic` m5). `inventory.md` §3.4c's third banner
 * sentence and §3.19c's third sheet sentence state the identical fact on two
 * screens that sit directly over one another, and the spec now says in as
 * many words that **one helper should serve both**: "Two surfaces, one fact,
 * one string — the same 'specified once, reused everywhere' discipline this
 * document applies to states, applied to copy."
 *
 * **It is a full-string pair, not a count-plus-noun template.** The N=1 form
 * carries **no numeral at all** — `La prenda que ya tiene tag`, never
 * "La 1 prenda," which is not Spanish — and its article, noun *and* verb all
 * take the singular, so it cannot be assembled from `pluralize`'s noun pair
 * without implying a template that does not exist. Both spec sections state
 * that requirement independently; this is where it is honoured.
 *
 * **The verb is `se sigue(n) vendiendo`, never `sigue(n) funcionando`**
 * (corrected 2026-09-21). A tag functions; a garment does not — and what she
 * needs to know is that she can still *sell* them (*global-principles.md*,
 * "business language always comes before technical language").
 *
 * **`withCount` is the one thing that legitimately differs between the two
 * callers**, and only in the plural:
 * - §3.4c's banner names the count (`Las 5 prendas…`) — there "the count *is*
 *   the reassurance," per that section's own rejected-alternative note.
 * - §3.19c's sheet does not (`Las prendas…`) — its own wireframes carry no
 *   numeral in either form, and the sheet already shows the barcode as its
 *   subject rather than a count.
 * At N=1 the two are byte-identical, which is exactly why the singular form
 * lives in one place instead of two.
 *
 * N=0 needs no form: both render conditions are ≥1 tagged unit.
 *
 * §3.19's NFC-switch caption ("Si lo apagas, las prendas que ya tienen tag
 * siguen igual") is deliberately **not** routed through here — it is a
 * conditional about a future action, not this present-tense sentence, and the
 * spec leaves it unchanged on purpose.
 */
export function taggedUnitsKeepSelling(count: number, { withCount }: { withCount: boolean }): string {
  if (count === 1) return 'La prenda que ya tiene tag se sigue vendiendo igual.';
  return withCount
    ? `Las ${count} prendas que ya tienen tag se siguen vendiendo igual.`
    : 'Las prendas que ya tienen tag se siguen vendiendo igual.';
}
