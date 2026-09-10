// supabase/functions/verify-otp — Stage 7 Backend Integration.
//
// Checks a submitted phone+code pair against the most recently issued
// (send-otp) code for that phone: correct value, not expired, not
// already exhausted on attempts. Consumes the code on success — single
// use, per architecture-principles.md #7's idempotency discipline.
//
// Deno runtime (Supabase Edge Functions) — see send-otp/index.ts's own
// header for the same disclosures (not covered by `tsc -b`, not
// live-tested against real infrastructure).
//
// Request: POST { phone: string, code: string }
// Response: 200 { ok: true }
//           200 { ok: false, reason: 'incorrect' | 'expired' | 'too-many' }
//           400 { ok: false, reason: 'invalid-phone' | 'invalid-code' }
//           500 { ok: false, reason: 'platform-error' }
//
// Note on status codes: an incorrect/expired/too-many code is an expected,
// normal application outcome (not an infrastructure failure), so it's
// returned as 200 with a structured body rather than a 4xx — the client
// (`otpClient.ts`) reads `body.ok`/`body.reason`, not the HTTP status, to
// decide which of `CodeStep.tsx`'s existing error states to show.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { VERIFY_MAX_ATTEMPTS, hashOtp, normalizeCode, normalizePhone } from '../_shared/otp.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface OtpRow {
  id: string;
  code_hash: string;
  expires_at: string;
  attempt_count: number;
  consumed: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ ok: false, reason: 'platform-error' }, 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, reason: 'invalid-phone' }, 400);
  }

  const phone = normalizePhone((body as { phone?: unknown })?.phone);
  if (!phone) return jsonResponse({ ok: false, reason: 'invalid-phone' }, 400);
  const code = normalizeCode((body as { code?: unknown })?.code);
  if (!code) return jsonResponse({ ok: false, reason: 'invalid-code' }, 400);

  // The single most recently issued row for this phone, regardless of its
  // consumed/expired state — that's the one row a submitted code could
  // ever legitimately match (send-otp always inserts, never updates).
  const { data: row, error: selectError } = await supabase
    .from('otp_attempts')
    .select('id, code_hash, expires_at, attempt_count, consumed')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<OtpRow>();

  if (selectError) {
    console.error('verify-otp: lookup failed', selectError);
    return jsonResponse({ ok: false, reason: 'platform-error' }, 500);
  }
  if (!row) return jsonResponse({ ok: false, reason: 'expired' });

  const submittedHash = await hashOtp(code);

  if (row.consumed) {
    // Idempotency case (architecture-principles.md #7): a retry of the
    // exact same already-successful phone+code pair (e.g. the client's
    // confirmation got lost, or a merchant double-taps "Confirmar")
    // returns the original success outcome instead of an error — no
    // second side effect happens because nothing is written below.
    // Anything else submitted against an already-consumed row (a
    // mismatched code) has no live code left to compare against, so it
    // reads as 'expired', prompting a fresh "Reenviar código" rather than
    // a misleading "that's wrong" for a slot that's simply used up.
    return jsonResponse(submittedHash === row.code_hash ? { ok: true } : { ok: false, reason: 'expired' });
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return jsonResponse({ ok: false, reason: 'expired' });
  }

  if (row.attempt_count >= VERIFY_MAX_ATTEMPTS) {
    return jsonResponse({ ok: false, reason: 'too-many' });
  }

  if (submittedHash !== row.code_hash) {
    const { error: incrementError } = await supabase
      .from('otp_attempts')
      .update({ attempt_count: row.attempt_count + 1 })
      .eq('id', row.id);
    if (incrementError) console.error('verify-otp: attempt-count update failed', incrementError);
    return jsonResponse({ ok: false, reason: 'incorrect' });
  }

  const { error: consumeError } = await supabase.from('otp_attempts').update({ consumed: true }).eq('id', row.id);
  if (consumeError) {
    console.error('verify-otp: consume update failed', consumeError);
    return jsonResponse({ ok: false, reason: 'platform-error' }, 500);
  }

  return jsonResponse({ ok: true });
});
