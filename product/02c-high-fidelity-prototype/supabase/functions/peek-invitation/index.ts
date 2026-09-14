// supabase/functions/peek-invitation — RFC 0013 §4/§7 mitigation.
//
// Fronts the `peek_invitation` RPC with an IP-bucketed rate limit, closing
// the token-enumeration surface RFC 0013 §4/§7 named but never actually
// closed: `peek_invitation` is anon-callable and resolves an Invitation by
// token alone, before authentication runs — so nothing stopped a caller
// from hammering it with guessed tokens directly via PostgREST. This
// function is now the only path to `peek_invitation` at all
// (`20260914060000_peek_invitation_rate_limit.sql` revokes anon/
// authenticated execute on the RPC itself); the function's own service-role
// connection bypasses that revoke by design, same shape `send-otp`/
// `verify-otp` already use for `otp_attempts`.
//
// Deno runtime (Supabase Edge Functions), not covered by the prototype's
// own `tsc -b`/Vite build — see supabase/README.md for how this gets
// deployed and verified.
// NOT LIVE-TESTED against real infrastructure — this environment can't
// actually invoke a deployed Edge Function end to end, so the
// `x-forwarded-for` behavior described below (Supabase's edge network
// populating it before the handler runs) is asserted from Supabase's own
// documented platform behavior, not verified live here. Verified for
// syntax/structure only, same disclosure `send-otp`/`verify-otp` carry.
//
// Request: POST { token: string }
// Response: 200 { ok: true, businessName: string, status: 'pending' | 'expired' | 'accepted' | 'revoked', expiresAt: string }
//           200 { ok: false, reason: 'not-found' }   — token resolves to no Invitation
//           400 { ok: false, reason: 'invalid-token' }
//           429 { ok: false, reason: 'rate-limited' }
//           500 { ok: false, reason: 'platform-error' }

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';

// Judgment call (implementation detail, not escalated): 20 peek attempts per
// IP per 10 minutes. Generous enough that a merchant/customer legitimately
// retrying a slow-loading link never trips it, tight enough that guessing
// through `peek_invitation`'s 256-bit token space stays entirely
// infeasible either way — this bound exists to stop a scripted enumeration
// sweep, not to protect the token itself (the token's own entropy already
// does that).
const PEEK_RATE_LIMIT_PER_10_MIN = 20;

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ ok: false, reason: 'platform-error' }, 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, reason: 'invalid-token' }, 400);
  }

  const token = (body as { token?: unknown })?.token;
  if (typeof token !== 'string' || token.length === 0) {
    return jsonResponse({ ok: false, reason: 'invalid-token' }, 400);
  }

  // Supabase's edge network populates `x-forwarded-for` before this handler
  // runs — distinct from, and not subject to, `inet_client_addr()`'s problem
  // inside Postgres, which would only ever see Supabase's own internal
  // pooler IP, not the real caller. Bucketed under a shared `'unknown'` key
  // when absent — fail closed, never skip the check.
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from('invitation_peek_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', tenMinutesAgo);

  if (countError) {
    console.error('peek-invitation: rate-limit lookup failed', countError);
    return jsonResponse({ ok: false, reason: 'platform-error' }, 500);
  }
  if ((count ?? 0) >= PEEK_RATE_LIMIT_PER_10_MIN) {
    return jsonResponse({ ok: false, reason: 'rate-limited' }, 429);
  }

  const { error: insertError } = await supabase.from('invitation_peek_attempts').insert({ ip });
  if (insertError) {
    console.error('peek-invitation: insert failed', insertError);
    return jsonResponse({ ok: false, reason: 'platform-error' }, 500);
  }

  const { data, error } = await supabase.rpc('peek_invitation', { p_token: token }).single();

  if (error) {
    // `.single()` errors when the RPC returns zero rows (`PGRST116`) — that's
    // the token-doesn't-resolve case, not a platform failure.
    if (error.code === 'PGRST116') return jsonResponse({ ok: false, reason: 'not-found' });
    console.error('peek-invitation: RPC failed', error);
    return jsonResponse({ ok: false, reason: 'platform-error' }, 500);
  }
  if (!data) return jsonResponse({ ok: false, reason: 'not-found' });

  const row = data as { business_name: string; status: string; expires_at: string };
  return jsonResponse({
    ok: true,
    businessName: row.business_name,
    status: row.status,
    expiresAt: row.expires_at,
  });
});
