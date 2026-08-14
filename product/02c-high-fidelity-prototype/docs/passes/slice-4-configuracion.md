# Slice 4 — Configuración

Archived pass history, extracted from `README.md` as part of the
knowledge-architecture refactor (Stage 4, 2026-08-13). This is a pure,
content-preserving move — nothing below is summarized, reworded, or
deleted, only relocated out of the file every dispatch reads by default.
See `README.md`'s own "Pass history index" for the current, durable
reference this archive was split from.

---

## Configuración pass (2026-08-13) — Migration Workflow (D43): the four
Business Capability actions (`subscriptionTier` × 2 directions,
`defaultSellingMode` × 2 directions) plus the new account-level "Cerrar
sesión"

Builds `product/02-ux/settings.md` (Approved, amended the same day with the
new §2.5/§2.5a account-level sign-out action) as its implementation
contract, with `product/02-ux/authentication.md` §2.2 case 2 and
`product/99-rfc/0007-user-and-business-membership.md` as the domain
contracts for sign-out specifically. An Architecture Gap Analysis
(`architect`) ran ahead of this pass and found no blockers and nothing
requiring Product Owner input; its recommended approach (the pending-change
triple shape, the `signOut` correctness requirement, the ColdStart
entry-point gap) is what was actually built, verified below via five
scripted Puppeteer walkthroughs against a live Chrome instance (not mocks),
screenshots reviewed at each step.

**Domain layer (`src/domain/types.ts`, `src/domain/dates.ts`,
`src/domain/store.tsx`).** `Business` gains the pending-change triple
`decision-log.md` D25/D29 already specify: `pendingSubscriptionTier: 'free'
| 'paid' | null`, `pendingSubscriptionTierEffectiveDate: string | null`
('YYYY-MM-DD'), `pendingSubscriptionTierAcknowledged: boolean`. New store
actions: `activatePaidPlan` (immediate — settings.md §2.2's today-
illustrative Q11 assignment), `requestDowngradeToFree` (deferred — writes
the pending triple only, never touches `subscriptionTier` until it lands),
`cancelPendingSubscriptionTierChange` (clears the triple, `subscriptionTier`
untouched), `changeDefaultSellingMode` (immediate, no pending pair at all,
§2.3 — and, per that section's explicit "never written by any other action"
invariant, the *only* write path allowed to touch `defaultSellingMode`;
verified directly — see walkthrough 2 below), `reconcilePendingSubscriptionTier`
(the §2.4 landing simulation — see "Disclosed simplifications" below),
`signOut` (§2.5/§2.5a).

**`signOut`'s correctness requirement, verified exactly as specified.**
`{ ...state.currentUser, phoneVerifiedAt: null }`, never `currentUser:
null` — `business`/`memberships`/products/sessions/sales are structurally
untouched by the write itself (spreads `state` unchanged beyond
`currentUser`). Verified end-to-end (walkthrough 2 below): sign out, then
re-verify the same phone — the same `User.id` is preserved (only
`phoneVerifiedAt` changes, from `null` back to a fresh timestamp), and
resolution lands straight through to Home (`authentication.md` §2.2 case 2,
made reachable for the first time by this very action — `onboarding.md
§2.1`'s own silent pass-through), never a second Onboarding run. `AppRouter.tsx`
required zero changes — its device-session check (`phoneVerifiedAt != null`)
was already a pure function of state, so it falls back to `AuthenticationFlow`
automatically the instant `signOut` clears the field, exactly as the Gap
Analysis anticipated.

**§2.4's landing simulation — a real design bug found and fixed during this
pass's own verification, not shipped as originally written.** Since there's
no real scheduled job, `reconcilePendingSubscriptionTier` runs once whenever
Configuración's own vista principal mounts, two-phase, driven by the
persisted `pendingSubscriptionTierAcknowledged` flag (not local component
state) so the "shown exactly once" guarantee survives a reload between the
landing open and the next one: the first open on/after the effective date
flips `subscriptionTier`, marks `acknowledged=true`, and *keeps* the
triple's other two fields for exactly one more render so the caller can
still read the landed value/date for §2.4's one-time acknowledgment line;
the next open (already acknowledged) clears the triple entirely. **The bug:**
the vista principal's own "is a change pending" check originally read only
`pendingSubscriptionTier != null`, which stayed true on that same kept-for-
one-render pass — so the landing render incorrectly kept showing "Cancelar
cambio" and a stale "(cambia a Gratis el ...)" note for a change that had
already landed, instead of an ordinary current-state row with the
acknowledgment line above it. Caught by simulating an already-past effective
date directly in `localStorage` (`Date.now()` can't be rewound in this
build, so a real 30-day wait isn't a practical walkthrough) and screenshotting
the result — fixed by gating the "is a change pending" check on
`!pendingSubscriptionTierAcknowledged` too, so a just-landed-and-acknowledged
change renders as ordinary the instant it lands, exactly as §2.4 specifies.
Re-verified clean after the fix (walkthrough 4 below): first open shows
"Tu plan cambió a Gratis el 1 de enero." above an ordinary "Tu plan: Gratis
/ Activar plan de pago" row; second open shows neither the ack line nor any
trace of the pending triple.

**Illustrative effective date (Q11 still Open, `settings.md` §8 item 1) —
a new, disclosed judgment call.** `requestDowngradeToFree` computes
`addDaysToKey(today, 30)` (`dates.ts`, new) — 30 days from the request date,
standing in for the real billing-cycle rule Q11 hasn't resolved yet. The
same deterministic function is called again (same day, so always the same
result) to preview the date on §3.5's confirm screen before she taps
"Confirmar cambio." Same "provisional prototype default, not a frozen
domain invariant" posture `authentication.md §8` item 3 already takes for
its own numeric judgment calls.

**Screens (`src/screens/Settings/`).** `SettingsScreen.tsx` — the
orchestrator, resolving §3.3a/§3.6 (vista principal, via a top-level
`SettingsMain` component — kept outside `SettingsScreen`'s own render body
rather than nested, the same discipline `EventDetail.tsx`'s own
`ActiveOrClosedBody` split already follows, to avoid a fresh component
identity remounting on every render), §3.4/§3.5 (`ActionConfirm.tsx`, one
generic component for both the immediate and deferred templates — they
differ only in copy/CTA label, never in shape), §3.7/§3.8 (both reuse the
existing `Sheet` component's two-button dimmed-backdrop shape, no new dialog
pattern invented), and §3.9/§3.10/§3.8a/§3.8b (`WritingState.tsx` — a local
copy of `Onboarding/WritingState.tsx`'s own one-component/several-labels
shape, not a cross-feature import, matching this codebase's own per-folder
CSS Module convention). `ConfirmScreen.module.css` mirrors
`Onboarding/ConfirmScreen.module.css`'s shape exactly (same visual template
this build already established for a confirm screen), a local copy for the
same reason.

**Gap Analysis finding #2, closed: `ColdStart.tsx` had no "⋯" menu entry
point at all.** `settings.md §2.1` is explicit that the entry point is
absent from exactly four Home states (§3.1/§3.2/§3.12/§3.14) — cold start
isn't one of them. Added the identical "⋯" + one-row Sheet pattern
`Idle.tsx`/`EventResume.tsx` already use (reusing `SessionHeader.module.css`'s
own `.sheetRow` styling, and `Idle.module.css`'s own topbar/wordmark/menuBtn
shape, copied into `ColdStart.module.css` rather than hand-rolled a second
time). Verified organically in walkthrough 1 below — a real path's Home
correctly shows the new "⋯" menu on a genuine cold start, before any stock
is ever registered.

**Wiring (`HomeScreen.tsx` and every "⋯" caller).** `HomeUiState`'s
`'settings-placeholder'` kind renamed to `'settings'`; the `Placeholder`
branch it drove is replaced with the real `SettingsScreen`. The
`onOpenSettingsPlaceholder` callback threaded through `SessionHeader.tsx`,
`Idle.tsx`, `EventResume.tsx`, and `Selling.tsx` is renamed to
`onOpenSettings` throughout (a pure rename, no behavior change) — `ColdStart.tsx`
gains the same prop, new, per the entry-point fix above.

**Verification.** `tsc -b && vite build` clean, zero errors, throughout.
Five scripted Puppeteer walkthroughs against a live Chrome instance (not
mocks), screenshots reviewed at each step:
1. **Real free path → cold start's new "⋯" menu → Paid+nfc mirror state,
   reached entirely through Configuración.** Phone → OTP → "Empezar gratis"
   → Tu negocio → Define lo que vendes → Todo listo → Entrar → Home cold
   start, correctly showing the new "⋯" menu with a single "⚙ Configuración"
   row (no "Cerrar jornada de venta," no open Session) → vista principal
   (Free) → "Activar plan de pago" → confirm (§3.4) → Confirmar y activar →
   Paid-tier vista principal → "Cambiar a vender con tags" → confirm → Con
   tags/"Cambiar a vender con botones" mirror state, confirmed rendering
   correctly. Then, still in the same walkthrough: back to Hoy (still cold
   start, no stock yet — correctly independent of `subscriptionTier`) →
   register real stock via Inventario → back to Hoy → **Idle, correctly
   showing the NFC-Not-Ready nudge** ("Todavía no tienes prendas con tag
   para hoy — vas a vender con botones." + "Asignar tags") for a Business
   that reached Paid+`nfc` purely through Configuración, not the demo seed —
   the specific cross-check the dispatching task named, confirmed with zero
   code changes needed in `Idle.tsx`.
2. **Demo path (paid+nfc seed) → full capability-action + sign-out/re-verify
   loop.** Phone → OTP → "Ver un ejemplo" → confirm → Todo listo → Entrar →
   Home idle → Configuración (nfc mirror state, confirmed) → "Cambiar a
   vender con botones" → confirm → Botones state, confirmed → "Volver al
   plan gratis" → deferred confirm (§3.5), illustrative date "12 de
   septiembre" rendered correctly (today + 30 days) → Confirmar cambio →
   pending state, "Tu plan: Pago (cambia a Gratis el 12 sep)" + "Cancelar
   cambio," confirmed — **and the `defaultSellingMode` row ("Cambiar a
   vender con tags") stayed available throughout**, confirming §2.2's "no
   capability with a pending change offers a second, stacking action" is
   scoped to the capability that actually has one, not to the whole screen
   → Cancelar cambio → confirm sheet → Sí, cancelar → back to ordinary Paid
   state, `defaultSellingMode` still `'buttons'` (confirmed via the final
   `localStorage` dump — **never reset by the earlier
   downgrade-then-cancel**, §2.3's own explicit invariant, the specific
   correctness point the dispatching task named to test) → "Cerrar sesión"
   → confirm sheet → Sí, cerrar sesión → resolves to Número celular, fresh
   → re-verify the same phone with a *different* 6-digit code (mock
   verification accepts any) → **resolves straight through to Home idle,
   no re-Onboarding** → final `localStorage` dump confirmed the same
   `User.id`/`Business.id`/`BusinessMembership.id` throughout, only
   `phoneVerifiedAt` changed (null → a fresh timestamp) — the exact
   RFC 0007 §1 same-identity guarantee `settings.md §2.5a`/`authentication.md
   §2.2` case 2 depend on.
3. See "Gap Analysis finding #2" above (folded into walkthrough 1's own
   cold-start step, not run as a separate pass).
4. **§2.4's landing simulation, both opens.** A crafted `localStorage` state
   with `pendingSubscriptionTierEffectiveDate` already in the past (2020,
   since this build can't rewind `Date.now()`) → first Configuración open:
   ack line renders, tier correctly flipped to Gratis, **ordinary row**
   underneath (the bug described above, confirmed fixed) → leave and reopen:
   no ack line, pending triple confirmed fully cleared in the final
   `localStorage` dump.
5. **Configuración reached from an active Session** (`SessionHeader`'s own
   "⋯" menu, the remaining untested entry point) — sheet correctly shows
   *two* rows ("Cerrar jornada de venta" + "⚙ Configuración") → Configuración
   opens correctly, same vista principal → "← Hoy" returns cleanly to
   Selling, the active Session and its stock confirmed completely untouched
   in the final `localStorage` dump.

**No genuine blocker the Architecture Gap Analysis didn't anticipate.** The
one real defect this pass found (§2.4's landing-render bug above) was found
and fixed by this pass's own verification walkthrough, the same "found and
fixed, not shipped" discipline every prior pass in this README already
documents for its own self-caught bugs — not a gap in the Gap Analysis
itself, which correctly anticipated the pending-triple shape and the
`signOut` correctness requirement in full.

**Review-pipeline fixes (2026-08-13), both applied directly, no re-walkthrough
needed.** `ux-critic` Minor (SET-HF-MIN1): `.ackLine` (§2.4's one-time landing
acknowledgment, "Tu plan cambió a Gratis el...") used `--color-success`, but
in this build `pendingSubscriptionTier` is only ever set to `'free'`
(`activatePaidPlan` is immediate and never writes the pending triple —
`requestDowngradeToFree` is the only writer), so every time this line
actually renders it's reporting a capability loss, not a gain. Changed to
`#6B6259`, the same body-sm/600 secondary-text tone `.sectionLabel` already
uses in this file — the same "color follows the message's actual semantic
character, not a default Success for every ambient confirmation" precedent
`Selling.module.css`'s own `.stockHint` already documents. `reviewer`
suggestion: `activatePaidPlan` didn't defensively clear a stale, already-
acknowledged pending triple — reachable only if a downgrade lands mid-mount
(`reconcilePendingSubscriptionTier` flips the tier, sets `acknowledged=true`,
and deliberately keeps the other two pending fields for one render per
§2.4's own design) and Ana immediately taps "Activar plan de pago" before the
next Settings mount would otherwise clear them. Confirmed unreachable/no
incorrect UI today, but a one-line defensive fix regardless: `activatePaidPlan`
now also nulls `pendingSubscriptionTier`/`pendingSubscriptionTierEffectiveDate`
and resets `pendingSubscriptionTierAcknowledged` to `false`, the same shape
`cancelPendingSubscriptionTierChange` already writes. `tsc -b && vite build`
clean after both fixes.

