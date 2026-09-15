# Slice 18 — `User.displayName` (Q29) and `Invitation.targetHint` enforced (Q30)

Two related, fully-Approved spec amendments, both dated 2026-09-15:

- **`decision-log.md` D69, `product-decisions.md` Q29** — `User` gains an
  optional, self-service-editable `displayName`, closing a real
  identification gap ("Tú"/"Alguien de tu equipo" role-only copy everywhere
  a SELLER's or the OWNER's own name should show). Spec: `onboarding.md`
  §2.2b/§3.9/§3.9a/§3.10/§3.10a, `settings.md` §2.5/§3.3a/§3.3b,
  `reports.md` §3.4a/§3.19.
- **`decision-log.md` D70, `product/99-rfc/0014-invitation-target-hint-
  enforced.md` (Accepted), `product-decisions.md` Q30** —
  `Invitation.targetHint` becomes required at creation and enforced at
  acceptance: the invited person authenticates specifically through a
  pre-filled, locked Email sub-flow, and `accept_invitation` rejects a
  mismatch before its status CAS. Spec: `settings.md` §2.7/§3.11/§3.12/
  §3.12e, `authentication.md` §2.0/§2.2/§2.2a/§3.2g/§3.10f.

## What's built

### Domain layer (`src/domain/`)

- **`types.ts`** — `User.displayName: string | null`, new field, doc
  comment explains the real backend column (`public.users.display_name`)
  and its one disclosed limitation (a phone-verified merchant's `User.id`
  has no real `auth.users` row, so the real write already fails closed for
  her — a pre-existing gap this field doesn't introduce). `Invitation.
  targetHint`'s own doc comment corrected to record RFC 0014's supersession
  of RFC 0013 §1's original "never required, never matched" ruling, per
  this project's own non-deletion/correction discipline.
- **`store.tsx`**:
  - Every `User`-minting site (`resolveAuthIdentity`, the two
    `runSessionRestoreCheck`/legacy-migration call sites) now sets
    `displayName: null`. `loadState`'s legacy migration defaults an
    older saved row's missing key to `null`.
  - New `setUserDisplayName(displayName: string | null): Promise<boolean>`
    — real call to `update_user_display_name`, mirrors into the current
    User's own row only. Two callers, two different failure postures (both
    the caller's own decision, not this function's): `onboarding.md`
    §2.2b/§3.10's OWNER capture is best-effort/non-blocking; `settings.md`
    §3.3b's self-service sheet is an ordinary blocking write with a visible
    error.
  - New `updateInvitationTargetHint(invitationId, targetHint,
    idempotencyKey)` — real call to `update_invitation_target_hint`
    (`settings.md` §3.12e).
  - `peekInvitation`'s return type widened to include `targetHint: {
    type: 'email'; value: string } | null` (RFC 0014's own pre-auth
    disclosure — not new exposure, §3.2g already shows this value,
    unlocked, before authentication).
  - `acceptInvitation`'s error union widened to include
    `invitation_identity_mismatch`.
  - `hydrateFromBackend` now also queries `public.users` (no `business_id`
    filter — RLS alone scopes what actually comes back: her own row
    always, plus every row for a User holding a `business_memberships` row
    in a Business she actively owns) and folds real `display_name` values
    into the local `users` mirror — existing rows keep their own
    local-only `declinedInvitationIds`/`phoneMismatchConfirmationPending`
    markers, a hydrated row for a userId this device has never locally
    minted gets an honest stub. **This is the one place this build learns
    about *other* people's names** — `state.users` otherwise only ever
    holds this device's own verified row(s).
- **`selectors.ts`**:
  - New `membershipDisplayName(state, membershipId): string` — the shared
    two-tier resolution (`User.displayName` → role-only "Tú"/"Alguien de
    tu equipo") `reports.md` §3.4a and §3.19 both need, reused rather than
    reimplemented at each call site.
  - `TeamRow`'s `active`/`revoked` variants gain `displayName: string |
    null`; `teamRows` resolves it via the same `User` lookup — the
    three-tier order (`displayName` → phone → "Alguien de tu equipo")
    itself is resolved by the caller (`TeamScreen.tsx`), matching this
    file's own "hand back the fields, let the screen format the copy"
    discipline.
  - `SalesExportRow` gains `vendedorDisplayName: string | null`;
    `salesExportRows` resolves it inline (same Membership row already in
    hand for `vendedorRole`).

### Screens

- **`Onboarding/BusinessIdentity.tsx`** — new "¿Cómo te llamas? (opcional)"
  field between "Nombre de tu negocio" and "Logo," carried unchanged into
  the §3.9a with-logo rendering (same component, same state). Never gates
  "Continuar." New `onDisplayNameSaved` prop, fired only after the
  Business-identity write (`onSaved`) already succeeds — a genuinely
  independent, best-effort second write, never awaited, never blocking.
- **`Onboarding/OnboardingFlow.tsx`** — wires `onDisplayNameSaved` to
  `setUserDisplayName`, fire-and-forget, failure logged only (never shown).
- **`Authentication/InvitationFlow.tsx`** — added the passive "Cuando
  quieras, puedes agregar tu nombre en Tu cuenta" line to the `'welcome'`
  step (§3.10c, exact brand-reviewed copy).
- **`Settings/SettingsScreen.tsx`** — new "Tu nombre" row in "Tu cuenta"
  (above the phone line), plus a new `Sheet`-based edit dialog (§3.3b) —
  pre-filled if set, blank otherwise, "Guardar"/"Cancelar," a failed save
  leaves the sheet open with the typed value intact (same convention
  `CatalogView.tsx`'s price-edit sheet already establishes). New CSS
  classes (`nameRow`, `field`, `input`, `hint`, `error`) added to
  `SettingsScreen.module.css`, matching `TeamScreen.module.css`'s own
  equivalents.
- **`Home/SellerAccountScreen.tsx`** — **the load-bearing half of this
  pass's own scope-completeness check.** `HomeScreen.tsx` routes a SELLER
  to this screen, never to `SettingsScreen.tsx`'s Configuración — a
  pre-existing, already-disclosed build-time stand-in (this screen's own
  doc comment: "hosted here rather than in `settings.md`, exactly as the
  approved spec itself names it"). Without adding "Tu nombre" here too,
  D69's own SELLER capture surface, and `authentication.md` §3.10c's new
  pointer line naming "Tu cuenta" as the destination, would both point at
  a screen a SELLER can never actually reach in this build. Added the
  identical row/sheet shape `SettingsScreen.tsx` gets, new matching CSS
  classes in `SellerAccountScreen.module.css`.
- **`Settings/TeamScreen.tsx`** — the larger rewrite:
  - Active/revoked rows now resolve identity via a new
    `memberIdentityLabel(displayName, phone)` helper — `User.displayName`
    → formatted phone → "Alguien de tu equipo" (§2.7's own corrected
    three-tier order).
  - "Nueva invitación" (§3.12): the email field is now required — label
    drops "(opcional)," "Generar invitación" is `disabled` until
    `looksValidEmail`, copy corrected to "Para que solo esa persona pueda
    aceptarla, aunque alguien más llegue a tener el enlace."
  - Pending rows now distinguish a legacy, hint-less row (`targetHint ===
    null`, exempt from the new acceptance-time check per RFC 0014's own
    backward-compatibility rule) from an ordinary one — separate copy,
    "Agregar correo" vs. "Editar correo."
  - New §3.12e "Editar correo"/"Agregar correo" sheet — reuses `settings.md`
    §3.3b's exact dimmed-backdrop/pre-filled-field/Cancelar-Guardar shape.
    Calls `updateInvitationTargetHint`; a failed save leaves the sheet
    open with the typed value intact. **Idempotency-key correctness fix
    applied during this build, not merely inherited**: `hintKeyRef` is
    shared across every row this screen can open "Editar correo" on, not
    scoped to one Invitation — reset on every fresh `openEditHint` call so
    a stale key from an earlier, abandoned (failed-then-cancelled, never
    retried) attempt on a *different* row can never be replayed against a
    genuinely new one (`architecture-principles.md` #7).
  - "Invitación lista" (§3.12c) copy corrected to state the new guarantee
    ("Solo {targetHint} va a poder aceptarlo...") when a `targetHint` is
    known; falls back to the original RFC 0013-era disclosure only for the
    narrow legacy-row-regenerated-without-opting-in case, where there's
    genuinely no email to state the guarantee against.
- **`Authentication/LockedEmailStep.tsx`** (new) — §3.2g "Invitación —
  correo confirmado." The email is read-only (`targetHint`'s own stored
  value), "Enviar código" reuses the existing `requestEmailOtp`/§3.5 send
  action verbatim, "Ahora no" declines with zero cost, plus the honest
  "¿No es tu correo? Dile a quien te invitó que lo corrija." line. New
  `LockedEmailStep.module.css`.
- **`Authentication/AuthenticationFlow.tsx`** — new `lockedInvitationEmail`/
  `onDeclineInvitation` props. When set, `computeInitialStep` skips §3.2a's
  three-way choice entirely and mounts `LockedEmailStep` → the shared
  `CodeStep`/§3.6 convergence (`requestEmailOtp`/`verifyEmailOtp`, already
  channel-neutral, needed no change). Google and phone are structurally
  unreachable through this component while this prop is set — matches
  RFC 0014's own "the method must be fixed to Email" ruling.
- **`Authentication/CodeStep.tsx`** — new `backLabelOverride` prop; when
  reached via the locked-email flow, "← Cambiar correo" (which would be
  wrong — nothing to change) becomes "← Atrás," returning to §3.2g.
- **`Authentication/InvitationFlow.tsx`** — the other major rewrite:
  - `resolveToken` now also captures `targetHint` from `peekInvitation`'s
    response into new `targetHintEmail` state, threaded into
    `AuthenticationFlow`'s `lockedInvitationEmail` prop for the
    session-less "no session" branch.
  - **Disclosed, reasoned interpretation of an edge case the spec text
    doesn't fully walk through**: a legacy, hint-less pending Invitation
    (`targetHintEmail === null`) falls back to the *ordinary* three-way
    method choice rather than §3.2g, since there's nothing to lock the
    flow to. RFC 0014's backward-compatibility rule explicitly exempts the
    *mismatch check itself* for such a row — it says nothing about which
    UI this build's own authentication *routing* should use for it, so
    this is this pass's own reasoned fill of a real gap, not something the
    spec directly answers, flagged here rather than silently assumed.
  - New `'mismatch-account'` step (§3.10f) — reached when `runAccept`'s
    result carries `invitation_identity_mismatch`. "Cerrar sesión e
    intentar de nuevo" calls `signOut()` inline (no second confirm dialog,
    per `onboarding.md` §6's "never zero, never two" standard — she's
    already read the explanation on this exact screen) then re-mounts
    §3.2g fresh; "Entendido" calls `onDone`, falling through to
    `AppRouter.tsx`'s own ordinary resolution (a valid session still exists
    by construction in both entry paths).
  - `'mismatch-confirm'`'s own "No, elegir otro" corrected — no longer
    threads a phone/email prefill (there was never anything to type on
    §3.2g in the first place); now routes unconditionally back to
    `'authenticating'`, which itself always re-mounts §3.2g.
  - The `hasGoogleRedirectSignal`/`resumedGoogleRedirect` mechanism is
    retired outright, not merely left unused — it existed solely to resume
    a mid-Google-redirect detour from the old three-way "no session" path,
    and Google is no longer reachable from that path at all under this
    amendment.
- **`Resultados/VendiendoAhorita.tsx`** — identity now resolved via
  `membershipDisplayName` instead of an inline role-only ternary.
- **`Resultados/salesExportFile.ts`** / **`ExportarVentas.tsx`** —
  `vendedorLabel` now resolves `vendedorDisplayName` first; the on-screen
  disclosure line corrected from the pre-D69 absolute claim ("no muestra
  el nombre de la persona") to the real, current two-tier behavior, per
  `reports.md` §3.19's own already-corrected wireframe text.

## Backend — written, NOT YET PUSHED (see `supabase/README.md`'s own new "Slice 18" entry for the full disclosure and push checklist)

Two new migrations (`20260915120000_user_display_name.sql`,
`20260915130000_invitation_target_hint_enforced.sql`) plus a change to the
already-deployed `peek-invitation` Edge Function — all written against this
project's own proven patterns, but **not applied to the real hosted
project**: this environment has no working `SUPABASE_ACCESS_TOKEN`
(`supabase projects list` returns `LegacyPlatformAuthRequiredError`). This
also means neither migration's own SQL was executed against the real
database — `supabase/README.md`'s own most recent entry establishes that
any dispatch touching `supabase/migrations/*.sql` must do so before being
reported done, and this pass could not comply, for the stated credential
reason, not by choice. Flagged prominently, not silently skipped — see
`supabase/README.md`'s own new section for exactly what still needs
running (`supabase db push`, a real execution-verification pass on every
new/modified RPC, `supabase functions deploy peek-invitation`, and a live
cross-device round-trip check) once a working token exists.

## Real limitations disclosed, not fixed here

- **Phone-verified merchants can't actually save a display name yet** — the
  same pre-existing, already-disclosed gap every other real write in this
  schema has for the phone channel (`otpClient.ts`/`store.tsx`'s own
  `realUserId` doc comment): phone auth mints no real `auth.users` row, so
  `auth.uid()` is `null` for that session regardless. Not this pass's gap
  to close.
- **Cross-device `displayName` propagation is untestable in this
  environment** — verifying that an OWNER's device actually sees a
  SELLER's freshly-set name (or vice versa) needs two real, separately-
  authenticated sessions against a live backend; this environment has
  neither a live backend connection nor a second device/session to test
  with.
- **The legacy-hint-less-row routing interpretation** (see above,
  `InvitationFlow.tsx`'s own doc comment) is this pass's own reasoned fill
  of a gap the Approved spec text doesn't directly walk through — flagged
  for `ux-designer`/Main to confirm or correct, not asserted as
  unambiguously settled.

## Build verification

`npm run build` (`tsc -b && vite build`) — clean, zero errors, after every
stage of this pass (domain layer, migrations/store wiring, each screen).
No live browser/device verification was possible in this environment (no
live backend connection — see above).
