-- RFC 0013 §4/§7 — closes the token-enumeration surface `peek_invitation`
-- left open: it's anon-callable and resolves a token before authentication
-- runs at all, so nothing stopped a caller from hammering it with guessed
-- tokens. Mirrors `otp_attempts`'s own IP/phone-bucketed rate-limit shape
-- (`20260910000000_create_otp_attempts.sql`) — same posture, applied to a
-- per-IP bucket instead of per-phone, since there's no phone in context
-- pre-authentication.
--
-- Rate limiting itself lives in the new `peek-invitation` Edge Function
-- (counts rows in this table, same COUNT()-then-insert shape `send-otp`
-- already uses against `otp_attempts`), not in this table or in
-- `peek_invitation` itself — this migration only provides the attempt log
-- and closes the direct-PostgREST bypass around it.

create table if not exists public.invitation_peek_attempts (
  id uuid primary key default gen_random_uuid(),
  -- The caller's IP, as read from `x-forwarded-for` by the Edge Function
  -- (Supabase's edge network populates it before the handler runs — not
  -- `inet_client_addr()`, which inside Postgres would only ever see
  -- Supabase's own internal pooler IP, not the real caller). Bucketed
  -- under the literal string `'unknown'` when the header is absent —
  -- fail closed, never skip the check.
  ip text not null,
  created_at timestamptz not null default now()
);

-- Mirrors `otp_attempts_phone_created_at_idx`: the Edge Function's own
-- rate-limit check is `COUNT(*) where ip = X and created_at > now() -
-- interval '10 minutes'` — this index makes that an index range scan
-- instead of a full-table scan as the table grows.
create index if not exists invitation_peek_attempts_ip_created_at_idx
  on public.invitation_peek_attempts (ip, created_at desc);

-- Row Level Security enabled with zero policies defined — a deliberate
-- deny-by-default posture, identical to `otp_attempts`. Only the
-- peek-invitation Edge Function (via its service-role connection, which
-- bypasses RLS/grants entirely) ever touches this table.
alter table public.invitation_peek_attempts enable row level security;

comment on table public.invitation_peek_attempts is
  'Per-IP attempt log backing peek-invitation Edge Function''s rate limit '
  '(RFC 0013 §4/§7). Written and read only by that function using the '
  'service-role key — never exposed through PostgREST/RLS to a client.';

-- peek_invitation is no longer directly callable via PostgREST at all —
-- only the peek-invitation Edge Function's service-role connection can
-- call it now, closing the bypass an attacker could otherwise use to skip
-- the rate limiter entirely by calling PostgREST directly with the anon
-- key (the function itself stays `security definer`, so the service-role
-- connection's own call still succeeds — service_role already bypasses
-- grants, this revoke only removes the anon/authenticated path).
revoke execute on function public.peek_invitation(text) from anon, authenticated;
