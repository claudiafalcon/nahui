# Customer Loyalty Registration — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux-loyalty/customer-loyalty-registration.md`, Approved. Medium-Fidelity work reflects the current, fully-reviewed state (`decision-log.md` D34/D35/D37/D38/D39; `product/99-rfc/0004`, Accepted; `product/99-rfc/0005`, Accepted).

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4`, new page **"Loyalty — Customer-Facing"** (`753:918`) — additive only, structurally and visually isolated from the six existing merchant-app pages (confirmed via `get_metadata`: zero `NavBar` instances, zero `BrandMark` instances, zero merchant-app chrome anywhere on the page). This is the correct realization of the spec's own §0 scope boundary — not part of the Nahui Merchant Application.

| Frame | customer-loyalty-registration.md state |
|---|---|
| `753:919` | §3.1 Resolving — near-instant |
| `753:923` | §3.2 Resolving — slow |
| `753:5597` | §3.3 Enlace no disponible |
| `753:5600` | §3.4 Esta compra ya fue registrada |
| `755:15` | §3.5 Correo — entrada |
| `755:5620` | §3.5a Correo — formato inválido (variant of §3.5) |
| `757:19` | §3.6 Cuéntanos un poco más — opcional |
| `757:5682` | §3.6b No, gracias — confirmación |
| `753:5603` | §3.7 Guardando… — near-instant |
| `753:5607` | §3.8 Guardando… — slow |
| `753:5609` | §3.9 No pudimos guardar — error |
| `757:5684` | §3.10 Registro exitoso — primera vez |
| `757:5689` | §3.11 Compra confirmada — cliente que regresa |
| `753:5613` | §3.12 No pudimos cargar — error |

All 14 states from the spec's §5 enumeration covered. **Deviations from the upstream spec: none** — every screen is a direct realization of already-approved wireframes/copy, no invented states or copy.

Shared Design System page: `0:1`. No new components required beyond one new pattern flagged below (`OptionChip`).

## 3. Key build decisions

**Button-treatment resolution** (the Low-Fidelity spec deliberately left this open, per its own `reviewer`-driven correction away from naming component classes). Mapped "Continuar"/"Listo" → `Button` **Primary** (`2:15`, solid Coral AA+); "No, gracias" → `Button` **Secondary** (`2:17`, white fill + 1.5px Tezontle Dark border, same 48px height/pill shape/full-width footprint as Primary), on both §3.5 and §3.6. Rejected Tertiary (reads exactly like the de-emphasized link the spec rules out) and Destructive (reserved for rare/irreversible actions — declining is routine and reversible). Satisfies the spec's literal requirement (same size/tap-weight/hierarchy position) while staying visually distinguishable via outline vs. solid fill.

**Business identity rendering** — no existing Figma precedent to reuse (`home.md` §3.8f's own Digital Receipt build still uses the old `BrandMark` treatment; `onboarding.md`'s identity-capture step isn't built in Figma at all — both gaps independently disclosed in their own tracking files). Built directly from this spec's own text: `Business.name` ("Ropa Ana") as centered Fredoka SemiBold heading, primary on-screen identity, never Nahui's mark, on §3.5/§3.5a/§3.6/§3.10/§3.11. Every occurrence layer-named `"Business.name (or Business.logo — never both together)"` so a future logo-swap is a one-line substitution, not a redesign.

**Error-color treatment**, per `brand-guide.md`'s documented distinction: §3.9 (write failure, data at risk) and §3.5a (inline validation, Form-inputs rule) = Error red; §3.3/§3.4 (passive, terminal, nothing at risk) and §3.12 (passive load failure) = plain text, matching every sibling document's defensive-fallback convention.

**Bug caught and fixed during build.** The age/gender chip row's auto-layout initially clipped the 5th "55+" chip — `resize()` called before `counterAxisSizingMode`, silently resetting it to `FIXED` (a documented `figma-use` gotcha). Caught via screenshot review, fixed by call-order correction, re-verified via structural readback + a second screenshot.

**§3.5/§3.5a — missing disabled "Continuar" state, fixed 2026-08-09.** `ux-critic`'s Medium-Fidelity review found "Continuar" rendered fully-enabled even with an empty/implausible email field, contradicting the spec's own explicit gating rule ("enabled only once the field holds a plausible-shaped value"). Fixed using the pre-existing `Button` component's own `Disabled` variant (`2:21`, muted gray, no interaction) — no new design decision needed. Applied to `755:15` and `755:5620`; "No, gracias" left untouched (never gated on the field). Verified: downstream success states (`757:5684`, `757:5689`) carry no button at all, so no risk of confusion with the new disabled treatment.

## 4. Known gaps (tracked, not blocking)

- **`OptionChip` (age-range/gender tap-once single-select chips) — resolved, now canonical Design System vocabulary.** `knowledge-mentor` consultation confirmed the pattern itself is well-grounded (Material Design 3's own "Choice Chip"). Checked the built component against the consultation's two concrete points: tap-target height was 33px (below `brand-guide.md`'s ~46-48px List-rows precedent and WCAG's 44px/AAA recommendation) — fixed to 47px. No selected-state treatment had been built at all — added, using two independent signals (fill white→Coral AA+ **and** font-weight Regular→Semi Bold), never color alone (WCAG 1.4.1). Formalized as a real component/variant set on the Design System page (`0:1`, `OptionChip` `763:14`, variants `state=Unselected`/`state=Selected`), matching the existing `Button`/`NavBar`/`EventCard`/`CapabilityCard` convention; `757:19`'s 8 chips now instantiate it directly rather than using raw ad hoc frames. **One flag carried forward, not resolvable at this layer:** single-select chip groups have a documented pitfall of screen readers announcing individual chips as "Checkbox" instead of "Radio button," misrepresenting the mutual-exclusivity relationship — a semantic/ARIA concern for whoever implements this in `product/03-build`, named in the component's own Figma description so it isn't silently lost between now and then.
- **Cross-document dependency**: this page's `Business.name`-as-heading treatment has no sibling precedent yet in either `home.md` §3.8f's Digital Receipt (still old `BrandMark`) or `onboarding.md`'s own not-yet-built identity-capture step — worth reconciling once those two catch up, so all three surfaces render identity consistently.

## 5. Review status
`ui-designer` build complete, self-verified via live `get_metadata`/screenshot readback. `knowledge-mentor` consultation on `OptionChip` returned — pattern well-grounded (Material Design 3's Choice Chip), two concrete gaps found (undersized tap target, no selected-state signal) and closed, see §3/§4 above. `ux-critic` round 1: 2 Major (no `OptionChip` selected state; no disabled "Continuar" state, contradicting the spec's explicit gating rule) — both fixed. `ux-critic` verification pass: **clean, 0 Blockers/Major/Minor.** `reviewer` Foundation-consistency pass: 1 Important finding (`OptionChip` missing from `company/brand/brand-guide.md`, breaking this project's own established precedent for documenting new canonicalized components) — fixed (new "OptionChip — single-select choice chip" section added). Two checks initially blocked by a transient Figma-connectivity gap (`infrastructure-decisions.md` ID001) — retried successfully, both clean (structural isolation from merchant-app chrome confirmed; all on-screen copy verified verbatim against the Approved spec, no leaked domain terms). **0 Blockers, 0 remaining Important findings — done. First document to complete the Medium-Fidelity tier for `product/02-ux-loyalty/`.**
