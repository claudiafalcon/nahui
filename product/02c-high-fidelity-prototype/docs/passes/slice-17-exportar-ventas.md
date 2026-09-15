# Slice 17 — Exportar tus ventas (Q27 sales export)

`reports.md` §3.19/§3.20 (Approved 2026-09-15, `product-decisions.md`
Q27, Product Owner-requested), plus the new "[ Exportar tus ventas ▸ ]"
row wired into §3.4/§3.5/§3.6's existing main-view screens. Full amendment
history and the closed `ux-critic`/`reviewer` rounds on the spec itself
are in `product/02-ux/reports.changelog.md#status-2026-09-15-q27-sales-export`
and `ux-critic-findings.md`'s "Exportar tus ventas — sales export" entry —
not repeated here.

A single combined CSV export: one row per `(Sale, Product)` pair within a
merchant-picked date range, "ID de venta" repeated across a multi-item
Sale's own lines. Purely client-side — `architect`-confirmed additive, no
new backend read (`hydrateFromBackend` already loads every historical
Sale/SaleItem for the Business unconditionally). Available at any
`subscriptionTier`, unlike "Vendiendo ahorita"/"Rendimiento por
bazar"/"Tus clientes" — a placement inference the spec's own §8 item 12
names explicitly, not an explicit Product Owner instruction. OWNER-only,
inheriting the whole tab's existing role gate — no new gating logic.

## What's built

**New selectors** (`src/domain/selectors.ts`):

- `closedSessionsInRange(state, desde, hasta)` — every `status === 'closed'`
  Session whose own closed date (`dateKey(closedAt ?? openedAt)`, the same
  date every Historial/En curso card already shows) falls inside
  `[desde, hasta]`, inclusive on both ends. A still-`active` Session can
  never appear — `status === 'closed'` alone already enforces the
  exclusion §2 asks for, since an open Session has no closed date to fall
  inside any range in the first place.
- `defaultExportRange(state)` — this Business's first and most recent
  closed-Session dates, §3.19's own "start from what's actually useful,
  not blank" default. `null` only defensively (unreachable through real
  navigation, since the row that opens this screen only ever renders once
  `hasAnyClosedSession` is already true).
- `SalesExportRow` (type) / `salesExportRows(state, desde, hasta)` — one
  row per `(Sale, Product)` pair for every finalized Sale whose Session
  closed in range. Reuses `dayNumberForDate` (Día N) and `membershipById`
  (the identical role-derivation "Vendiendo ahorita" already established,
  Slice 16) verbatim — no reimplementation of either. Returns structured
  entities (`Venue`, `Event`, a raw `MembershipRole`), not pre-formatted
  Spanish strings — matching every other selector in this file's own
  "hand back the entity, let the screen format the copy" discipline.

**New `salesExportCsv.ts`** (`src/screens/Resultados/`) — the
presentation-layer step one short of `SalesExportRow`: Spanish Event-type
labels (`EVENT_TYPE_LABELS`, the same map `ResultadosMain.tsx`/
`VenueDetail.tsx` already import), the "Tú"/"Alguien de tu equipo" role
copy, and this build's own already-disclosed "Venta rápida" rename (not
the spec's literal "Sesión rápida" — reused here for the same cross-tab
consistency reason `SessionDetail.tsx`/`ResultadosMain.tsx`/
`VendiendoAhorita.tsx` already apply to this identical header slot).
`buildSalesExportCsv` produces the actual CSV text (RFC 4180 minimal
escaping); `triggerCsvDownload` is the standard Blob + `<a download>`
browser mechanism, no backend call anywhere, with a leading UTF-8 BOM so
Excel (which doesn't sniff encoding the way Sheets does) renders accented
headers/Product names correctly rather than as mojibake — a small,
disclosed implementation choice not specified either way by the spec.

**New `ExportarVentas.tsx`** — one component covering both §3.19 (the
Desde/Hasta range picker) and §3.20 (generate/download), the same
single-component-with-an-internal-sub-state-machine shape `TeamScreen.tsx`
already uses for its own multi-step "Nueva invitación" flow:

- **§3.19 "Elige el rango a exportar"** — native `<input type="date">`
  Desde/Hasta fields (the same convention `NuevoEvento.tsx`'s own
  Empieza/Termina pair already establishes), defaulting to
  `defaultExportRange`, each auto-adjusting the other to keep Hasta ≥
  Desde on edit (the identical auto-adjust `NuevoEvento.tsx` already
  applies to Empieza/Termina). The nine-column table and the Vendedor-
  limit disclosure line are rendered as the spec's own literal, "authoritative
  and final" static copy. "[ Descargar CSV ]" is disabled (not an error)
  whenever `closedSessionsInRange` for the picked range is empty, with an
  adjacent "No hay ventas en este rango." line — re-enables the instant a
  valid range is picked, no separate empty-state screen.
- **§3.20 "generando / listo"** — tapping "Descargar CSV" yields one tick
  (so the generating state actually paints, even though this prototype's
  own already-loaded local data makes the real computation itself
  effectively instant), builds the CSV via `salesExportRows` +
  `buildSalesExportCsv`, and triggers the download. Same near-instant/slow
  split §3.1/§3.2 already establish elsewhere in this tab: a silent
  skeleton (replicating `ResolvingState.tsx`'s own visual shape locally,
  since that component's text is hardcoded to "Un momento…" and this
  screen needs its own "Preparando tu archivo…") for the ordinary case,
  the slow text only past the same 1500ms threshold. "✓ Descarga lista"
  plus the generated filename (`ventas-{desde}-a-{hasta}.csv`, ISO dates)
  on success, reusing the same ambient "✓ [outcome]" success register
  `TeamScreen.tsx`'s "Copiado ✓"/`EventsList.tsx`'s "Evento cancelado ✓"
  already establish. "[ Listo ]" returns to the range screen with
  Desde/Hasta state untouched, so a second export can be run immediately.
- No dedicated failure state — §3.20's own text: "a client-side
  Blob/download operation over data already successfully loaded has no
  meaningful 'retry' story distinct from simply tapping '[ Descargar CSV
  ]' again."

**`ResultadosMain.tsx`** — new `onOpenExport` prop; a
`Button variant="secondary"` row ("Exportar tus ventas ▸") rendered below
every other section, above the nav bar, unconditionally within this
component. No separate availability check inside `ResultadosMain` itself
— it only ever mounts once `hasAnyClosedSession` is true
(`ResultadosScreen.tsx`'s own §2 gate), the identical condition §2's
sales-export availability check reuses verbatim, so the row's visibility
is already correct by construction. **Styled as a plain secondary Button,
not the two-part title/"[Ver más ▸]" `.teaserRow` shape** "Rendimiento por
bazar"/"Tus clientes" use — this row summarizes no data section of its
own, matching §3.10's existing "[ Ver Eventos ]" precedent for a single
bracketed CTA in this same tab instead.

**`ResultadosScreen.tsx`** — new `{ mode: 'export' }` `ResultadosView`
variant, no `returnTo` (its only possible parent is the main view). No
tier re-check on this branch, unlike the `rendimiento`/`venue-detail`/
`tus-clientes` guard immediately above it — this view has no
`subscriptionTier` dependency to lose mid-visit.

**Files touched:** `src/domain/selectors.ts`,
`src/screens/Resultados/salesExportCsv.ts` (new),
`src/screens/Resultados/ExportarVentas.tsx` (new),
`src/screens/Resultados/ResultadosMain.tsx`,
`src/screens/Resultados/ResultadosScreen.tsx`,
`src/screens/Resultados/Resultados.module.css`.

## Verification

`npm run build` (`tsc -b && vite build`) — clean, zero errors. No live
browser/device verification was possible in this environment.

## Not yet run

Review Pipeline (`ux-critic` → `reviewer` → `merchant-user-tester`) has
not run against this build yet — this entry documents the initial build
only, per this dispatch's own scope.
