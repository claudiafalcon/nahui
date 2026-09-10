/**
 * Stage 7 Backend Integration — the one seam `store.tsx` calls through to
 * reach the real `send-otp`/`verify-otp` Supabase Edge Functions
 * (`supabase/functions/`, see `supabase/README.md`). A single real
 * implementation calling Twilio's WhatsApp API through those functions —
 * not a provider abstraction for hypothetical future channels that don't
 * exist yet, per this pass's own scope.
 *
 * NOT LIVE-TESTED: no real Supabase project exists yet
 * (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are unset in this build),
 * so every call here currently resolves to `platform-error` — see the
 * config-check branch below, and `supabase/README.md`'s checklist.
 */

export type SendOtpResult = { ok: true } | { ok: false; reason: 'invalid-phone' | 'rate-limited' | 'platform-error' };

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; reason: 'invalid-phone' | 'invalid-code' | 'incorrect' | 'expired' | 'too-many' | 'platform-error' };

async function callOtpFunction<TReason extends string>(
  name: 'send-otp' | 'verify-otp',
  payload: unknown,
): Promise<{ ok: true } | { ok: false; reason: TReason | 'platform-error' }> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    // Fails closed rather than pretending to succeed — never silently
    // mistaken for a working send/verify once real credentials exist but
    // are simply missing from this particular environment (e.g. a
    // preview deploy that forgot to set them).
    console.error(`[otpClient] Supabase not configured — cannot call ${name}. See supabase/README.md.`);
    return { ok: false, reason: 'platform-error' };
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify(payload),
    });
    // Both functions always return a structured `{ ok, reason? }` JSON
    // body, on every status code they emit (see each function's own doc
    // comment) — safe to parse and trust `ok`/`reason` directly rather
    // than branching on the HTTP status here.
    return (await res.json()) as { ok: true } | { ok: false; reason: TReason | 'platform-error' };
  } catch (err) {
    console.error(`[otpClient] ${name} request failed`, err);
    return { ok: false, reason: 'platform-error' };
  }
}

/** authentication.md §3.5 "Enviar código" — real call, replacing the
 * previous local-only fake delay in `PhoneStep.tsx`. */
export function sendOtp(phone: string): Promise<SendOtpResult> {
  return callOtpFunction<'invalid-phone' | 'rate-limited'>('send-otp', { phone });
}

/** authentication.md §3.7 "Confirmar" — real call, replacing `store.tsx`'s
 * previous mock `verifyOtp` (RFC 0007 §5's disclosed simplification, now
 * retired). */
export function verifyOtpCode(phone: string, code: string): Promise<VerifyOtpResult> {
  return callOtpFunction<'invalid-code' | 'incorrect' | 'expired' | 'too-many'>('verify-otp', { phone, code });
}
