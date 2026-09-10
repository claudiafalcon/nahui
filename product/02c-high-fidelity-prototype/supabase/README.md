# Supabase — real WhatsApp OTP delivery

Stage 7 Backend Integration, scoped narrowly to phone/OTP authentication
(see `company/business-decisions.md` Q14/Q15, `product/00-foundation/decision-log.md`
D44). Replaces the client-side "any 6-digit code works" mock previously in
`src/domain/store.tsx`'s `verifyOtp`.

**Nothing here has been deployed or live-tested.** No real Supabase or
Twilio account exists yet — everything below is complete, structurally
verified code, not a running system. The prototype's phone/OTP screens
will not work against a real backend until the checklist below is done.

## What's here

```
supabase/
  config.toml                        — Supabase CLI project config (placeholder project_id)
  migrations/
    20260910000000_create_otp_attempts.sql   — the otp_attempts table
  functions/
    send-otp/index.ts                — generates + WhatsApp-sends a code
    verify-otp/index.ts              — checks a submitted code, single-use
    _shared/cors.ts, _shared/otp.ts  — shared helpers (both functions)
```

## Manual checklist (Product Owner — cannot be done on her behalf)

1. **Create a Supabase project** (supabase.com) — this is the project this
   folder will link to. Note its project ref, API URL, and anon key.
2. **Create a Twilio account** (twilio.com) and, inside it, **register a
   WhatsApp Business Sender through Meta Business Manager** — this is
   Twilio's standard WhatsApp onboarding flow (business verification
   through Meta, not a Twilio-side approval). Note the resulting Account
   SID, Auth Token, and the approved WhatsApp sender number.
3. **Create and get approved one WhatsApp message template** via Twilio's
   Content Template Builder (or directly in Meta Business Manager) for the
   OTP message itself — e.g. "Tu código de verificación de Nahui es
   {{1}}." WhatsApp Business Platform requires an approved template for
   any business-initiated message (which every OTP send is, by
   definition — there's no prior customer message opening a session
   window). Note the resulting Content SID (`HXxxxxxxxx…`).
4. **Set the following as Supabase secrets** (`supabase secrets set
   KEY=value`, run from this folder once linked — see step 6):
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM` — the approved sender number, E.164 (e.g. `+14155238886`)
   - `TWILIO_WHATSAPP_CONTENT_SID` — the approved template's Content SID
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are injected automatically
     by the Supabase platform into every deployed Edge Function — nothing
     to set manually for those two.
5. **Set these as build-time env vars for the prototype itself**
   (`.env.local` locally, or the hosting platform's env-var settings on
   Vercel — never committed, `*.local` is already gitignored):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (see `.env.example` in this prototype's root for the exact names.)
6. **Link and deploy:**
   ```
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push          # applies migrations/20260910000000_create_otp_attempts.sql
   supabase functions deploy send-otp
   supabase functions deploy verify-otp
   ```
7. **Smoke-test** `send-otp`/`verify-otp` directly (e.g. `curl` or Supabase
   Studio's function invoker) with a real phone number before trusting the
   prototype's own UI end to end.

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
