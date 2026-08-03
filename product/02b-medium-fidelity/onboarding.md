# Onboarding — Medium-Fidelity tracking

## 1. Upstream spec reference
`product/02-ux/onboarding.md`, Approved; amended for `decision-log.md` D27 (NFC capability corrected to derive from `subscriptionTier`, not kit/code activation). Medium-Fidelity work reflects that current, D27-amended state as of this rebuild.

## 2. Figma file/frame links
File `DPRnGD5JWjfoNBSlAFoVG4` ("Nahui — Medium-Fidelity UI"), page **"Onboarding — Medium Fidelity"** (`67:2`). All 12 `onboarding.md` §5 states covered across 12 frames (renumbered/reduced from 14 states/15 frames — the retired "Activar kit NFC" code-entry/validating/invalid sub-states are gone):

| Frame | onboarding.md state |
|---|---|
| `67:3` | §3.1 Resolving — near-instant |
| `67:4` | §3.2 Resolving — slow |
| `68:4` | §3.3 Bienvenida + Elegir cómo empezar |
| `88:1006` | §3.4 Activar plan de pago — confirmar antes de continuar |
| `70:954` | §3.4c Ver un ejemplo — confirmar antes de continuar |
| `71:34` | §3.5 Creando tu negocio — near-instant |
| `71:38` | §3.5 Creando tu negocio — slow |
| `71:40` | §3.5a Creando tu negocio — error |
| `71:955` | §3.6 Todo listo — Variant A (Empezar gratis) |
| `71:960` | §3.6 Todo listo — Variant B (Activar plan de pago) |
| `71:965` | §3.6 Todo listo — Variant C (Ver un ejemplo) |
| `71:970` | §3.8 Falla defensiva |

State 11 (resume-after-interruption) has no separate frame by spec-mandated design — `onboarding.md` itself states it's pixel-identical to states 3-8.

**Amended for D27:** removed `69:924` (§3.4 code-entry), `70:16`/`70:25` (§3.4a validando), `70:938` (§3.4b código inválido) — the retired activation-code mechanism. Added `88:1006` (new §3.4, "Activar plan de pago," a bare payment-confirmation screen, no input field). Updated `71:960`'s copy (no longer promises automatic tag-selling) and `68:4`'s path-choice subtext/button label. Also fixed a stale cross-reference in `70:954` (§3.4c) found during the rebuild's own spec cross-check, not part of the original diff. The `CodeEntry` component (`69:2`, Design System page) is no longer referenced by this page but was left defined, since `settings.md`'s parallel Figma rebuild may still use it — confirm before deleting.

Shared Design System page: `0:1`. No NavBar on any frame in this document — the one explicit, spec-mandated deviation from every other Medium-Fidelity document in this phase (Onboarding precedes all four tabs, per `information-architecture.md`).

## 3. Review status per screen
Full cycle complete for the pre-D27 build: `ui-designer` build → `ux-critic` review (0 Blockers, 0 Major; 2 Minor + 1 Suggestion, non-gating) → `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean.** Fifth document to complete the Medium-Fidelity tier. **D27 rebuild (this amendment)** — `ux-critic` verification: **clean, 0 Blockers, 0 Major** (1 Minor — tracking-file staleness, this file, now corrected). `reviewer` Foundation-consistency pass: **0 Blockers, 0 Important findings — clean** (1 non-blocking wording suggestion — §3.6 Variant B's "activa" → "cambia" word choice — applied to `product/02-ux/onboarding.md`). Folded back into done.

## 4. Deviations from the upstream spec
None.

## Known gaps (tracked, not blocking)
- **Tap-target shortfall, three Tertiary-variant escape hatches + one link.** `88:1012` ("Mejor quiero empezar gratis" — replaces the retired `69:939`/`70:952`, D27 rebuild), `70:962` ("Mejor quiero registrar mi negocio real"), and `68:13` ("Ver un ejemplo") are all 40px tall — below the ~44-48px minimum this design system otherwise aims for. Judged Minor, not Major (unlike `inventory.md`'s/`reports.md`'s prior Major tap-target findings): each instance is full/near-full row width, well-buffered from adjacent elements, and reached at most once ever per `onboarding.md` §1's own framing — not a repeated daily interaction. Root cause is the shared `Tertiary` component's own 40px master height, a Design System property, not something this document introduced independently. Worth tightening for consistency; three instances of the same shortfall in one document is a real pattern.
- **Error-color inconsistency — in remediation.** `onboarding.md`'s and `inventory.md`'s tab-level fallback screens use plain gray text; `home.md`'s and `events.md`'s do too — gray is actually the dominant pattern (4 of 5 completed documents). `reports.md`'s fallback is the actual outlier, using Error red. `reviewer` recommended resolving this as a `brand-guide.md` documentation gap (distinguishing passive read-failure fallbacks from active write-action failures, which correctly use red everywhere) rather than a Business Decision — routed to `ui-designer` as a small, explicit fix.
- **Brand-wide Primary-CTA Coral contrast (Q12) — Resolved.** Product Owner chose Coral AA+ (`#C13F26`, 5.24:1); applied as a component-level rebind on the shared `Button` component, cascading automatically to this document's 7 Primary + 3 Tertiary instances. `ux-critic` verified clean via an independent instance-level sweep (Tertiary count confirmed exact match, 3 of 3).
