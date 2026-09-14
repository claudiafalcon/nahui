# Supabase — real WhatsApp OTP delivery + Identity persistence layer

Stage 7 Backend Integration. Two independent passes so far:
- **Phone/OTP authentication** (see `company/business-decisions.md` Q14/Q15,
  `product/00-foundation/decision-log.md` D44) — replaces the client-side
  "any 6-digit code works" mock previously in `src/domain/store.tsx`'s
  `verifyOtp`.
- **Identity persistence layer, Phase 0** (`decision-log.md` D44/D55/D56/D62/
  D63/D64, `product/99-rfc/0012-auth-identity-multi-method.md`,
  `product/99-rfc/0013-invitation-token-based.md`) — real `businesses`/
  `business_memberships`/`auth_identities`/`invitations` tables + RLS + the
  `create_business_with_owner`/`accept_invitation` SECURITY DEFINER RPCs.
  The `business_id`/`auth.uid()` scoping every later phase (Inventory,
  Selling, Events, Results — Phase 1-3) depends on. `store.tsx`'s
  `completeOnboarding` now calls `create_business_with_owner` for real;
  `createInvitation`/`acceptInvitation`/`declineInvitation` are **not** wired
  yet — see that migration's own header comment and this pass's build report
  for why (the prototype's current Invitation UI/domain type is still
  phone-keyed, RFC 0013's own token-keyed redesign hasn't had its UI
  Migration-Workflow pass yet).

**Status as of 2026-09-13 (corrected — this paragraph was stale/self-
contradictory against the checklist below, `reviewer`-caught):** phone/OTP
path — real Supabase project created, linked, migration pushed, and both
Edge Functions deployed and ACTIVE (see checklist below). Not yet
live-tested end to end — still blocked on Twilio/WhatsApp sender setup
(steps 2-3); WhatsApp production verification is separately non-blocking
for the pilot as a whole now (`company/business-decisions.md` Q19), since
Google/Email cover the working sign-up paths in the meantime. Google and
Email sign-in — **live and confirmed working in production** on
`nahui.app` (Vercel env vars set, Resend SMTP configured, Google OAuth
Client configured). Identity persistence layer — migration SQL applied to
the real hosted project via `supabase db push` (checklist items 8-10),
`reviewer`-verified across two rounds of fixes; not yet committed to git
pending this same review pass closing.

## What's here

```
supabase/
  config.toml                        — Supabase CLI project config (placeholder project_id)
  migrations/
    20260910000000_create_otp_attempts.sql              — the otp_attempts table
    20260913000000_identity_persistence_layer.sql       — businesses/business_memberships/
                                                            auth_identities/invitations + RLS +
                                                            create_business_with_owner/accept_invitation
  functions/
    send-otp/index.ts                — generates + WhatsApp-sends a code
    verify-otp/index.ts              — checks a submitted code, single-use
    _shared/cors.ts, _shared/otp.ts  — shared helpers (both functions)
```

## Manual checklist (Product Owner — cannot be done on her behalf)

1. ~~**Create a Supabase project**~~ **DONE.** Project ref `exvzsfnwogmyxfmaffxn`.
2. **Create a Twilio account** (twilio.com) and, inside it, **register a
   WhatsApp Business Sender through Meta Business Manager** — this is
   Twilio's standard WhatsApp onboarding flow (business verification
   through Meta, not a Twilio-side approval). Note the resulting Account
   SID, Auth Token, and the approved WhatsApp sender number. **NOT YET STARTED.**
3. **Create and get approved one WhatsApp message template** via Twilio's
   Content Template Builder (or directly in Meta Business Manager) for the
   OTP message itself — e.g. "Tu código de verificación de Nahui es
   {{1}}." WhatsApp Business Platform requires an approved template for
   any business-initiated message (which every OTP send is, by
   definition — there's no prior customer message opening a session
   window). Note the resulting Content SID (`HXxxxxxxxx…`). **NOT YET STARTED.**
4. **Set the following as Supabase secrets** (`supabase secrets set
   KEY=value`, run from this folder once linked — see step 6):
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM` — the approved sender number, E.164 (e.g. `+14155238886`)
   - `TWILIO_WHATSAPP_CONTENT_SID` — the approved template's Content SID
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are injected automatically
     by the Supabase platform into every deployed Edge Function — nothing
     to set manually for those two.
   **BLOCKED on step 2/3** (no Twilio credentials or approved template yet).
5. **Set these as build-time env vars for the prototype itself**
   (`.env.local` locally, or the hosting platform's env-var settings on
   Vercel — never committed, `*.local` is already gitignored):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (see `.env.example` in this prototype's root for the exact names.)
   ~~**DONE locally (`.env.local`)**~~ **DONE** 2026-09-13 — also set on
   the real `nahui.app` Vercel project's own env-var settings; Google/Email
   sign-in confirmed working live against the real backend as a result.
6. ~~**Link and deploy**~~ **DONE** 2026-09-12 — linked to `exvzsfnwogmyxfmaffxn`,
   `db push` applied `20260910000000_create_otp_attempts.sql`, both
   `send-otp` and `verify-otp` deployed and confirmed ACTIVE. (See
   `company/infrastructure-decisions.md` ID018 for the CLI-auth workaround
   this required — Supabase's fine-grained Personal Access Tokens 401 on
   these operations; a "legacy" full-access token, generated via the
   de-emphasized "Create legacy token" link on the same screen, is the
   working credential.)
7. **Smoke-test** `send-otp`/`verify-otp` directly (e.g. `curl` or Supabase
   Studio's function invoker) with a real phone number before trusting the
   prototype's own UI end to end. **BLOCKED on step 4** (functions are
   deployed but have no Twilio credentials to actually send through yet).
8. ~~**Push the Identity persistence layer migration**~~ **DONE** 2026-09-13 —
   `20260913000000_identity_persistence_layer.sql` applied to the real
   hosted project via `supabase db push` (same CLI-auth workaround as step
   6).
9. ~~**`reviewer`'s security pass, two rounds**~~ **DONE** 2026-09-13.
   Round 1 found 3 Important + 1 minor on the base migration (an
   over-broad `business_memberships` UPDATE policy; an inaccurate comment
   on `accept_invitation()`'s best-effort idempotency-cache write;
   `token_hash`'s hash algorithm undocumented outside one function; a
   revoked member's re-accept silently reporting success) — closed by
   `20260913010000_identity_persistence_layer_fixes.sql`. Round 2,
   re-verifying that fix, found 2 further Important findings **in the fix
   itself** (a reintroduced race condition on `accept_invitation()`'s
   membership insert; an unproven "must be revoked" claim that's actually
   false when an already-active member reopens a stale invite link) —
   closed by `20260913020000_identity_persistence_layer_fixes2.sql`. All
   three migrations applied to the real hosted project.

## Judgment calls made building this (tune freely, not escalated)

- **OTP expiry: 10 minutes.** `supabase/functions/_shared/otp.ts`'s
  `OTP_EXPIRY_MINUTES`.
- **Send rate limit: 5 codes/phone/hour.** `SEND_RATE_LIMIT_PER_HOUR`,
  enforced server-side in `send-otp` (the existing 30-second client-side
  "Reenviar en 0:30" cooldown in `CodeStep.tsx` is a UX pacing detail only,
  not a security control).
- **Verify lockout: 5 wrong guesses per issued code.**
  `VERIFY_MAX_ATTEMPTS`, enforced in `verify-otp` — a fresh code (a new
  "Reenviar código") resets the count, since it's a new row.
- **Idempotency key for `verify-otp`** is the phone+code pair itself
  rather than a separately generated key: a retry of the same already-
  consumed pair replays the original success outcome instead of
  re-running the consume write, satisfying `architecture-principles.md`
  #7 without a synthetic key field — see the doc comment in
  `functions/verify-otp/index.ts`.
- **WhatsApp delivery uses Twilio's Content API template send**
  (`ContentSid`/`ContentVariables`), not a plain-text `Body` — required
  because an OTP is always a business-initiated message, which WhatsApp
  Business Platform only allows through an approved template. This is why
  step 3 above (template creation/approval) exists as its own checklist
  item rather than being skippable.
- **`auth_identities` (email/google/apple) is populated by a trigger on
  `auth.identities`, not a client-side upsert.** A trigger can't be silently
  skipped by a missed call site the way a client upsert could — one
  mechanism handles every native-auth provider identically. `phone` stays
  populated by the `verify-otp` Edge Function (service-role key), unchanged.
- **`auth_identities` has no client-writable INSERT/UPDATE/DELETE policy at
  all**, despite the dispatch's own "a user can only read/write their own
  rows" framing — a genuine, deliberate deviation. Allowing an authenticated
  client to insert her own `type='phone'` row would let her claim someone
  else's number as a "verified" identity without ever proving it via OTP.
  Writes happen exclusively through the trigger above or the service-role
  Edge Function, both of which bypass RLS by construction; read access
  (`user_id = auth.uid()`) is all any client role needs or gets.
- **`is_active_member_of`/`is_active_owner_of` — two small SECURITY DEFINER
  helper functions**, used inside the `businesses`/`business_memberships`/
  `invitations` RLS policies. Without them, `business_memberships`' own
  SELECT policy would need to query `business_memberships` from inside its
  own USING clause, which re-triggers that table's RLS recursively for every
  authenticated caller who isn't just reading her own row — the standard,
  documented Supabase pattern for avoiding this is a SECURITY DEFINER helper
  (bypasses RLS internally, since it executes as the function owner).
- **`createInvitation`/`acceptInvitation`/`declineInvitation` are NOT wired
  to `invitations`/`accept_invitation` in this pass**, despite being named in
  the dispatch. The running prototype's `Invitation` domain type/UI
  (`types.ts`, `TeamScreen.tsx`, `InvitationFlow.tsx`) is still built against
  the phone-keyed design RFC 0013/D64 superseded — it collects a phone
  number, has no screen to show a generated link/token, and has no field to
  display a phone-addressed pending row once phone is no longer a column on
  `invitations` at all. Wiring these functions to the real, token-keyed
  schema without that UI rework would mean either silently building a
  feature the invited person could never actually reach (no link is ever
  shown to share), or inventing UI/UX decisions that aren't this dispatch's
  to make. RFC 0013 §"What it touches" already names this exact gap
  explicitly ("this code gets its own Migration-Workflow pass... not
  designed here") — flagged here as the same still-open gap, not a new one.
  The migration SQL/RLS/RPC for `invitations` are built and correct
  regardless; only the client wiring for these three functions is deferred.
