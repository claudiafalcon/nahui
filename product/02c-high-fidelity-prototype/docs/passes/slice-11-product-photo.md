# Slice 11 — `Product.photo`

Migration Workflow (`decision-log.md` D43), against an already-Approved
amendment: `product/02-ux/product-decisions.md` Q23,
`product/00-foundation/decision-log.md` D54, and the corresponding
amendments folded into `onboarding.md` §2.2a/§3.5b/§3.5c/§3.5e,
`inventory.md` §3.4/§3.4b/§3.8a/§3.11, `home.md` §3.9. Optional,
non-blocking everywhere — a Product remains creatable and sellable with
zero taps toward a photo.

## What changed

**Domain layer** (`src/domain/types.ts`, `src/domain/store.tsx`):

- `Product` gains `photo?: string` (D54) — a plain mutable current scalar,
  browser-local (data URL), same shape as `defaultPrice`/`Business.logo`.
- `CommitLotLine`'s `'new'` product kind gains an optional `photo`;
  `mintProduct`/`commitLot` thread it through — the same single write
  mechanism already shared by Onboarding's "Define lo que vendes" and
  Inventario's "Registrar mercancía," extended by one field, not a second
  write path.
- New `setProductPhoto(productId, photo | undefined)` — the Catalog-row
  "Editar foto" sheet's own write (`inventory.md` §3.4b), same shape as the
  existing `editPrice`.

**Shared marker rendering** (`src/components/TagStub/TagStub.tsx` +
`.module.css`) — the one component already used at every scale this system
renders a per-Product marker (Catalog row, selling tile, committed-line
previews, the product picker's option list) gains an optional `photo` prop.
When set, it replaces the initial-letter rendering entirely; the punched
hole/string stay visible on top of the photo (z-index, not DOM order,
so `.tag` itself can stay free of `overflow: hidden` — `.string` pokes
outside the tag's own box by design and must not be clipped by the same
rule that clips the photo). **Fallback is local to this one component:** an
`onError` handler flips a `photoFailed` flag, silently reverting to the
letter marker, no broken-image glyph, no message — reset whenever `photo`
itself changes. Every consumer (`ProductTile`, `CatalogRow`,
`ProductPicker`, `RegisterMerchandise`, `SellingGroups`) gets this fallback
for free by construction, not by re-implementing it per call site.

**Onboarding** (`SellingGroups.tsx`) — a fourth, fully optional field
("Foto") added to each Selling-Group row, reusing `BusinessIdentity.tsx`'s
own file-picker/`FileReader`-as-data-URL/`image/*`-type-check pattern
verbatim (the reusable mechanism the approved spec explicitly calls for
checking first, per Q23's own architect finding). Never gates "Continuar."
A committed row with a photo shows a "· foto" indicator (§3.5c); the
disclosed-not-wired §3.5e error-preview branch carries it too, matching the
Approved wireframe's own "Bolsas · foto — $350 · 10" line.
`OnboardingFlow.tsx` threads each line's `photo` into its `commitLot()`
call.

**Inventory — Catalog view** (`CatalogRow.tsx`, `CatalogView.tsx`):

- `CatalogRow`'s marker is now its own bracketed tap target (a bare button
  wrapping `TagStub`), independent of the row body (→ Registrar mercancía,
  prefilled) and the price figure (→ Editar precio) — the three-zone
  disambiguation `product-decisions.md` Q23 calls for, remediating the
  `ux-critic` Major named in `product/02-ux/CLAUDE.md`'s own status line for
  this amendment. Stays tappable identically on a dimmed
  ("sin registrar"/"0 disponibles") row.
- New "Editar foto" sheet (§3.4b) — add/change/remove, staged locally
  (`Product.photo` untouched until "Guardar foto," "Cancelar" discards),
  same reasoning `editPrice`'s own sheet already established for why no
  extra confirmation dialog is needed on top of that staging. A bare tap on
  the thumbnail opens a simple full-viewport, non-editable inspect view
  (dismissed by tapping again or "← Cerrar"). Both the sheet's own thumbnail
  and the full-viewport view carry an `onError` fallback that silently
  reverts to the sheet's no-photo state — the one place the Approved spec
  calls out explicitly as a *distinct* failure case from selection-time
  failure.

**Inventory — Product creation** (`ProductPicker.tsx`'s "nuevo producto"
sheet, `RegisterMerchandise.tsx`) — Foto added alongside Precio, same
upload mechanism as the Catalog sheet, adapted to the compact sheet layout;
never gates "Agregar." `RegisterMerchandise`'s `ProductRef` `'new'` kind
carries the selection through to its own `commitLot()` call; a new
`photoForLine` helper resolves whichever photo a committed line's marker
should show (a real Product's saved photo for an `existing` line, the
draft's own unsaved selection for a `new` one) so `TagStub` renders
correctly in both cases.

**Home — Venta rápida** (`Selling.tsx`, `ProductTile.tsx`) — the tile's
marker renders `product.photo` in place of the initial letter whenever set,
via the same `TagStub`. Display-only, by construction: no new prop threads
any interaction, only a passive `photo` value. Sold-out dimming applies
identically (already inherited through `TagStub`'s existing `muted` prop).

## Not built / disclosed

- No live browser verification this session (no `puppeteer`/`playwright`
  dependency installed, and none was installed ad hoc this pass, unlike
  Slice 9/10) — verified by `tsc -b` + `vite build` (both clean) and direct
  code trace against every screen state the approved spec enumerates
  (no-photo, with-photo, selection-time failure, render-time failure, the
  full-viewport inspect view, and the three-zone Catalog-row tap
  disambiguation). Flagged as the natural next confirmation step, the same
  disclosure convention `demo-mode-welcome.md` already established for an
  identical gap.
- `commitLot()`'s pre-existing idempotency gap (`BACKLOG.md` §F) is
  unaffected — this pass adds a field to its payload, not a new write path.

## Files touched

`src/domain/types.ts`, `src/domain/store.tsx`,
`src/components/TagStub/TagStub.tsx` (+ `.module.css`),
`src/components/ProductTile/ProductTile.tsx`,
`src/components/CatalogRow/CatalogRow.tsx` (+ `.module.css`),
`src/components/ProductPicker/ProductPicker.tsx` (+ `.module.css`),
`src/screens/Home/Selling.tsx`,
`src/screens/Inventory/CatalogView.tsx` (+ `.module.css`),
`src/screens/Inventory/RegisterMerchandise.tsx`,
`src/screens/Onboarding/SellingGroups.tsx` (+ `.module.css`),
`src/screens/Onboarding/OnboardingFlow.tsx`, this file, `README.md`
(pass-history index entry + "what's currently built" summary).
