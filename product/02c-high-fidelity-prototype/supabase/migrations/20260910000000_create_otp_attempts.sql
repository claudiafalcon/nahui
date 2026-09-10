-- Stage 7 Backend Integration — real WhatsApp OTP delivery.
--
-- Minimal schema for phone-OTP verification only (send-otp / verify-otp
-- Edge Functions). Not a general auth/session table — `User`/
-- `phoneVerifiedAt` (domain-model.md, RFC 0007/D44) stay the merchant
-- identity record; this table only ever holds short-lived, single-use
-- verification codes on the way to that record.
--
-- One row per OTP *issuance* (every send-otp call inserts a new row,
-- never updates an old one) — this is what makes the per-phone send-rate
-- check in send-otp a plain COUNT() over recent rows, and what makes
-- "the latest row for this phone" the unambiguous, single active code at
-- verify-otp time.

create table if not exists public.otp_attempts (
  id uuid primary key default gen_random_uuid(),
  -- E.164-ish local format, digits only, no "+52" prefix — matches what
  -- the client already collects (PhoneStep.tsx's 10-digit Mexican mobile
  -- field) and normalizes before calling here. Not declared unique: many
  -- historical rows per phone are expected (one per send).
  phone text not null,
  -- SHA-256 hex digest of the plaintext code — the plaintext itself is
  -- never persisted anywhere, even though the code is short-lived
  -- (Product Owner-directed security hygiene, same posture as any other
  -- credential-adjacent value).
  code_hash text not null,
  expires_at timestamptz not null,
  -- Verification attempts made against this specific issued code.
  -- Capped by verify-otp (VERIFY_MAX_ATTEMPTS) to stop a brute-force
  -- guess loop against one still-valid code.
  attempt_count integer not null default 0,
  -- Single-use flag — set once verify-otp accepts the correct code.
  -- A later verify-otp call replaying the *same* phone+code pair reads
  -- this as an idempotent replay (architecture-principles.md #7) rather
  -- than as a fresh, already-used, therefore-wrong attempt.
  consumed boolean not null default false,
  created_at timestamptz not null default now()
);

-- send-otp's per-phone rate limit: COUNT(*) where phone = X and
-- created_at > now() - interval '1 hour'. This index makes that a
-- straightforward index range scan instead of a full-table scan as the
-- table grows.
create index if not exists otp_attempts_phone_created_at_idx
  on public.otp_attempts (phone, created_at desc);

-- Row Level Security enabled with zero policies defined — a deliberate
-- deny-by-default posture. Both Edge Functions authenticate to Postgres
-- with the Supabase service-role key (which bypasses RLS entirely by
-- design), so this table is never meant to be reachable through the
-- public anon/authenticated Postgres roles at all, even by accident.
alter table public.otp_attempts enable row level security;

comment on table public.otp_attempts is
  'Short-lived phone-OTP verification codes (WhatsApp delivery via Twilio). '
  'Written and read only by the send-otp / verify-otp Edge Functions using '
  'the service-role key — never exposed through PostgREST/RLS to a client.';
