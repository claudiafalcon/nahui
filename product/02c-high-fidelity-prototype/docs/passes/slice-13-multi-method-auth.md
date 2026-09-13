# Slice 13 — Multi-method authentication (Google, Email, phone)

`authentication.md`'s 2026-09-13 amendment (`product/99-rfc/0012-auth-identity-multi-method.md`,
Accepted, `decision-log.md` D62/D63) activates Google Sign-In and Email as
fully independent, phone-free first-time sign-up methods, per `architect`'s
completed Migration-Workflow Architecture Gap Analysis. Built in the gap
analysis's own stated order: (1) domain-layer `AuthIdentity` refactor, (2)
`ChooseMethodStep` + state-machine expansion, (3) Email path, (4) Google
path. `tsc -b`/`npm run build` verified clean after each stage, not only at
the end.

## 1. Domain layer

`src/domain/types.ts` — a new `AuthIdentity` interface (`id`, `userId`,
`type: 'phone' | 'email' | 'google' | 'apple'`, `identifier`, `verifiedAt`,
`createdAt`), unique on `(type, identifier)`. `AppState.authIdentities: AuthIdentity[]`
added, the same array-on-`AppState` convention `memberships`/`invitations`/
`sessions` already use. `User` corrected to a bare anchor — `id`,
`createdAt`, `declinedInvitationIds`, `phoneMismatchConfirmationPending` —
dropping `phone`/`phoneVerifiedAt` entirely (both now live on `AuthIdentity`
rows instead).

`src/domain/store.tsx`:

- `resolveAuthIdentity(state, type, identifier, now)` — the one shared
  resolution every credential-verification path goes through (mirroring the
  existing `mintProduct`/`resolveVenue` extraction pattern), implementing
  RFC 0012 §4's three outcomes: `'existing'` (a plain read), `'new-user'`
  (first-ever-credential creation — mints a `User` + its first `AuthIdentity`
  row together), `'linked'` (additive linking against an already-
  authenticated device — modeled correctly for RFC 0012 §5's future "link a
  second method" surface, but **not reachable through any built UI this
  slice**, since `AuthenticationFlow` only ever mounts when the device holds
  no live session at all).
- `verifyOtp` rewritten to resolve through `resolveAuthIdentity('phone', ...)`
  instead of the old `state.users.find(u => u.phone === phone)` lookup.
  Behaviorally identical for the phone channel.
- `requestEmailOtp`/`verifyEmailOtp` — new, through `authProviders.ts`.
- `startGoogleSignIn`/`resolveGoogleSignIn` — new, through `authProviders.ts`.
- `completeOnboarding`'s gate corrected from `user.phoneVerifiedAt == null`
  to "does this User hold at least one `AuthIdentity` row, of any type."
- `signOut` corrected — previously flipped `User.phoneVerifiedAt: null` in
  place while deliberately leaving `currentUserId` still pointed at that
  row; that mechanism relied on a nullable/re-settable verification field
  that no longer exists (`AuthIdentity.verifiedAt` is permanent once set —
  a credential, once verified, stays verified forever). "Is this device's
  session currently live" is now `AppState.currentUserId` itself
  (`null` = no live session) — `signOut` simply nulls it.
- `retractMistypedVerification` ("No, elegir otro," §3.7e) corrected — the
  old null-out-a-field mechanism no longer applies; the honest equivalent is
  now a real removal of the just-minted, still-empty `User` + its one
  `AuthIdentity` row (safe by construction: §3.7e only ever fires for a
  genuinely first-ever-anywhere credential holding no Business/Membership/
  Session/Sale of its own yet).
- `acceptInvitation`'s `user.phoneVerifiedAt == null` gate simplified to
  `!user` — `currentUser` only ever resolves a row once `currentUserId` is
  set, which itself only happens via a successful credential resolution, so
  the two checks were already equivalent.

`src/domain/selectors.ts` — new `phoneIdentifierFor(state, userId)`, the one
place every pre-amendment `User.phone` read now resolves through (`''` when
the User holds no phone-type `AuthIdentity` — a real, expected state for a
Google/Email-only merchant). Used by `teamRows`, `TeamScreen.tsx`,
`PersonalParaEsteEvento.tsx`, and `SettingsScreen.tsx`'s "Tu cuenta" phone
display — none of those screens' own behavior was redesigned, only the read
mechanism corrected to compile against the new `User` shape.

**`loadState()` migration** — an older localStorage save has legacy `User`
rows carrying `phone`/`phoneVerifiedAt` directly and no `authIdentities` key
at all. Migrated: one synthesized `type='phone'` `AuthIdentity` row per
already-verified legacy User (never for one whose `phoneVerifiedAt` was
already `null`, i.e. previously signed out); `currentUserId` corrected to
`null` whenever its pointed-to legacy User had already been signed out under
the old model — the honest equivalent under the corrected "currentUserId
itself is the live-session signal" model, not a regression (that device was
already showing `AuthenticationFlow` before this migration ever runs).

## 2. Supabase Auth wiring — `src/domain/authProviders.ts` (new)

`@supabase/supabase-js` added as a dependency (not previously used anywhere
in this codebase — `otpClient.ts`'s phone path is a plain `fetch` against
custom Edge Functions, deliberately not using the client library). A thin
Nahui-domain wrapper, never called directly from screen components (mirrors
`otpClient.ts`'s own seam) — `sendEmailCode`/`verifyEmailCode`/
`signInWithGoogle`/`resolveGoogleSession`, all called only from `store.tsx`.

- **Email** — `supabase.auth.signInWithOtp({ email })` /
  `supabase.auth.verifyOtp({ email, token, type: 'email' })`, per
  `authentication.md` §10's explicit decision (a numeric code, not a magic
  link — the same underlying Supabase mechanism either way; which one ships
  is purely a server-side email-template choice, not something this client
  controls).
- **Google** — `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`,
  a real full-page navigation. Resolution happens via `getSession()` on
  remount (`resolveGoogleSession`), since `supabase-js`'s own
  `detectSessionInUrl` default already processes the redirect's own hash
  fragment by the time that call resolves. The provider's opaque stable
  subject ID is read from `session.user.identities[].identity_data.sub`
  (falling back to Supabase's own per-identity `user.id`) — never the
  human-readable `displayLabel` (email/name), which is returned separately,
  purely for §3.7e's display use, and is never written to `AppState`/
  `AuthIdentity` (RFC 0012 §1).
- **Cancellation vs. genuine error (§3.2c)** — a denied/dismissed consent
  screen resolves to no established session, treated as `'cancelled'`
  (silent, routes back to §3.2a with no message); a thrown exception from
  `getSession()` itself is the one case treated as a genuine `'error'`
  (§3.2d).

**Both new provider calls fail closed** until the Product Owner provisions a
real Google Cloud OAuth Client, configured as a provider in the Supabase
Auth dashboard — a manual step not yet done (`supabase/README.md`'s own
checklist doesn't yet cover it). Email needs no extra provisioning beyond
the existing Supabase project. Neither is live-tested end to end, same
disclosed posture `otpClient.ts` already holds for Twilio/WhatsApp.

## 3. New/generalized screens (`src/screens/Authentication/`)

- **`ChooseMethodStep.tsx`** (new, §3.2a) — the new default first-run entry
  point. Three same-weight `Button variant="secondary"` options (never
  primary/secondary/tertiary, §3.2a's own explicit rule), order Google →
  Correo → Número celular per the spec's own stated (non-validated)
  judgment call.
- **`EmailStep.tsx`** (new, §3.2e entry + §3.2f inline formato-inválido
  combined in one component, mirroring how `PhoneStep.tsx` already folds its
  own inline error in). Loose structural validation (`@` plus something on
  both sides plus a final `.`) — not full email validation, the same
  posture the phone field's 10-digit gate already takes.
- **`GoogleStep.tsx`** (new) — `GoogleProgress` (§3.2b/§3.2c, near-instant
  skeleton/"Un momento…"/"Confirmando…") and `GoogleError` (§3.2d, genuine
  platform error only) in one file, per the dispatch's own build-order
  instruction (thin skeleton states plus one error screen don't need three
  files).
- **`CodeStep.tsx`** generalized — `channel: 'phone' | 'email'` +
  `identifier` props replace the old hardcoded-phone `phone` prop,
  parametrizing the destination line ("Te mandamos un código a tu
  [número/correo], ...") and the back arrow's own label/destination. Not
  forked into a duplicate `EmailCodeStep.tsx`, per the dispatch's own
  instruction.
- **`PhoneMismatchConfirm.tsx`** generalized — `channel: 'phone' | 'email' | 'google' | 'apple'`
  + `displayValue` replace the old `phone` prop. Copy generalized:
  "Este [número/correo/cuenta de Google] todavía no tiene un negocio en
  Nahui," "Sí, es mío/mía" (gender-neutral), "No, elegir otro" (renamed from
  "No, corregir número," since Google has nothing to "correct").
- **`PhoneStep.tsx`** gains a back arrow ("← Elegir cómo entrar" → §3.2a) —
  no longer the first screen in the product.
- **`AuthenticationFlow.tsx`** rewritten — a full state machine (`choose` /
  `phone` / `email` / `code` / `google-redirecting` / `google-verifying` /
  `google-error`) replacing the old two-state phone→code flow.
  `computeInitialStep` inspects the URL's own hash/query for Google's
  redirect markers (`access_token=`/`error=`) on mount to decide whether to
  resume `google-verifying` instead of defaulting to `choose` — the one
  genuine exception to this flow's existing "in-progress typing resets on
  reload" disclosed simplification, since a real OAuth redirect is a full
  page navigation that destroys in-memory state regardless, so resumption
  has to be reconstructed from the URL instead.

## 4. `AppRouter.tsx`

- `authenticated` corrected to `state.currentUserId != null` (was
  `user?.phoneVerifiedAt != null`).
- `retractedPhone: string | undefined` generalized to
  `retractedPrefill: { channel: 'phone' | 'email'; value: string } | undefined`
  — `undefined` for Google (§3.7e's "No, elegir otro" returns to §3.2a
  fresh for that channel, nothing to pre-fill).
- New `googleDisplayLabel` local state, set via a new `onGoogleResolved`
  callback prop threaded into `AuthenticationFlow` — needed because
  `AppRouter` may swap `AuthenticationFlow` out for `PhoneMismatchConfirm`
  the very next render (the instant `currentUserId` is set), which would
  otherwise lose Google's own ephemeral display value along with every other
  piece of that component's local state. If a reload happens in the narrow
  gap between a Google credential resolving and the §3.7e tap, this
  ephemeral value is genuinely lost (same as any in-memory React state) —
  `mismatchDisplayValue` falls back to a generic, still-true "tu cuenta de
  Google" phrase rather than inventing or persisting a label.
- `mismatchIdentity`/`mismatchDisplayValue` resolve which of the three
  credential types just triggered §3.7e (by construction, exactly one
  `AuthIdentity` row exists for a User this branch fires for) and format the
  display value per channel.

## 5. Deliberately out of scope, per this dispatch's own instruction

`Invitation.phone` and everything in `InvitationFlow.tsx`/`createInvitation`/
`acceptInvitation`/`declineInvitation` are untouched in substance — stays
phone-scoped per RFC 0012 §3, a separate, not-yet-started RFC 0013 tracking
item (`authentication.md`'s own amendment banner already names this as
stale-but-not-fixed-here). The three `.phone`/`phoneVerifiedAt` reads inside
`createInvitation`/`acceptInvitation` were corrected only to the extent
needed to compile against the new `User` shape (`phoneIdentifierFor`, `!user`)
— not a redesign of what either function does.

## 6. Verification

`tsc -b` and `npm run build` both clean after every stage and at the end. No
live browser walkthrough this session (disclosed) — Google specifically
cannot be live-verified at all yet regardless (no real Google Cloud OAuth
Client provisioned), and Email/phone would only exercise the Supabase call
surface, not new UI logic beyond what `tsc -b`'s type-level check and a full
production `vite build` already confirm compiles and bundles correctly.

## 7. Open items flagged, not resolved here

- **`settings.md §2.5/§3.3a` ("Tu cuenta") zero-phone display state** — a
  Google/Email-only merchant now genuinely reaches `phoneIdentifierFor`
  returning `''`; the read was corrected to compile and degrade gracefully
  (empty string, same as the pre-amendment defensive fallback), but the
  actual screen design for this case is `authentication.md` §8 item 12's own
  named, not-yet-designed gap — not fixed by this dispatch, which is
  domain-layer/Authentication-screen scope only.
- **Account linking / duplicate-User risk** (RFC 0012 §5, `product-decisions.md`
  Q26) — the same person completing cold sign-up twice via two different
  methods produces two separate `User` rows with no in-app way to notice.
  `resolveAuthIdentity`'s `'linked'` branch models the domain shape a future
  fix would need, but no UI exists to trigger it — named, not solved, per
  the spec's own explicit scope.

## 8. Review findings, closed

`reviewer` (Foundation-compliance pass, 2026-09-13): 0 Blockers. Confirmed
`resolveAuthIdentity`'s three shapes (plain read / first-ever-creation /
additive linking) correctly implement RFC 0012 §4's invariant; confirmed
`signOut`/`retractMistypedVerification`'s mechanism substitution preserves
`settings.md §2.5`'s original guarantees; confirmed Google's opaque
`identifier`/ephemeral `displayLabel` separation holds end to end;
confirmed `Invitation`-related code received only compile-fixing changes,
no behavioral change. **1 Important, fixed:** `AppRouter.tsx`'s branch
order checked `pendingInvitation` before `needsPhoneMismatchConfirmation`,
contradicting `authentication.md` §2.1's own step 0 (an unconfirmed §3.7e
must resume directly, "never falls through to the ordinary valid-session
logic," which includes the Invitation check) — a narrow but real window
where resuming the app mid-§3.7e, with a new Invitation appearing in that
same window, let her accept it without passing the identity-confirmation
gate first. Fixed: the JSX ternary reordered so `needsPhoneMismatchConfirmation`
is checked before `pendingInvitation`; verified this doesn't change behavior
for the fresh-verification path (§2.2's case-0-before-case-1 rule), since
the two conditions are mutually exclusive by construction there. `tsc -b`
clean after the fix. **1 Suggestion, not actionable now:** `resolveAuthIdentity`'s
callers read the outer `state` closure after an `await` rather than the
functional `setState` updater's own fresh snapshot — a pre-existing,
codebase-wide convention, not introduced by this slice; worth a note for
whoever scopes Stage 7 Backend Integration, where the single-tab-single-writer
assumption this relies on no longer holds.

`ux-critic` (UX-quality pass, source-level): 0 Blockers. **3 Majors, fixed:**
(1) `ChooseMethodStep.tsx`, `PhoneStep.tsx`, `EmailStep.tsx`, and
`PhoneMismatchConfirm.tsx` all rendered `<h1 className={styles.eyebrow}>Nahui</h1>`
as the screen's only heading — identical text on every one, with the
actual distinguishing instruction sitting in a plain `<p>` instead,
breaking screen-reader heading navigation (and, post-amendment, producing
two consecutive identical "Nahui" headings on the flow's first two
screens, `ChooseMethodStep` → `PhoneStep`/`EmailStep`). Fixed: "Nahui"
demoted to a non-heading typographic eyebrow (`<p className={styles.eyebrow}>`,
restyled as a true small/uppercase/letter-spaced caption per this design
system's own eyebrow-label convention, §7), paired with a new real `<h1
className={styles.heading}>` per screen — "Elegir cómo entrar"
(`ChooseMethodStep`), "Número celular" (`PhoneStep`), "Correo electrónico"
(`EmailStep`), "Confirma tu identidad" (`PhoneMismatchConfirm`) — matching
`CodeStep.tsx`'s already-correct pattern. (2) `PhoneMismatchConfirm.tsx`
prepended a single masculine "Este " to a per-channel noun, rendering
"Este cuenta de Google" (feminine noun, masculine demonstrative) once the
Google branch made this screen reachable outside the phone-only case.
Fixed to match `authentication.md` §3.7e's own corrected wireframe
bracket ("[Este número / Este correo / Esta cuenta de Google]"): the
demonstrative now varies per channel (`demonstrativeNoun`), baked in per
option rather than shared. (3) `EmailStep.tsx`/`PhoneStep.tsx` rendered a
bare `<span className={styles.label}>` immediately before their `<input>`
with no programmatic association — a screen reader announced only "edit
text, blank." Fixed: `<span>` → `<label htmlFor="...">` paired with a
matching `id` on each input (`phone-step-input`, `email-step-input`).
`CodeStep.tsx`'s identical pre-existing label pattern was left untouched,
per `ux-critic`'s own scoping — a separate, wider sweep, not blocking this
dispatch. **1 Suggestion, fixed:** `PhoneMismatchConfirm.tsx`'s noun
ternary folded `channel === 'apple'` into the same branch as `'google'`,
producing "cuenta de Google" for an Apple credential — contradicting the
component's own doc comment, which claims Apple gets a generic "cuenta"
noun. Apple is unreachable through any built UI this slice (no live
impact), fixed anyway for consistency: `'apple'` now falls through to the
generic, still-feminine "Esta cuenta," matching the doc comment's actual
claim. `tsc -b` and `npm run build` both clean after all four fixes.

`ux-critic` verification pass (2026-09-13): all four findings confirmed
closed against the actual current source — no regressions, correct in
both structure and CSS visual weight (`.heading` dominant, `.eyebrow`
subordinate), no id-collision risk (only one Authentication step is ever
mounted at a time). Clean pass, 0 Blockers, 0 unresolved Major. **One
incidental observation, named but not fixed here, out of this dispatch's
scope:** `CodeStep.tsx`'s own field label (`Código`) has the identical
missing-`htmlFor` pattern as the just-fixed `EmailStep`/`PhoneStep` —
`CodeStep.tsx` was never part of this remediation's file list, so this
is a known, named gap for a future dedicated accessibility sweep (per
`reviewer`'s own note that this pattern is "systemic, not unique to
Authentication"), not something silently missed.

**Full Review Pipeline complete.** `reviewer`: 0 Blockers, 1 Important
(fixed — see §8), 1 Suggestion (pre-existing convention, not actionable
now). `ux-critic`: 0 Blockers, 3 Major + 1 Suggestion (all fixed,
verified clean). Ready to commit.
