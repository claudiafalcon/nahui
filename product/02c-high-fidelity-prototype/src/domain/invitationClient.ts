/**
 * Stage 7 Backend Integration — the seam `store.tsx`'s `peekInvitation` calls
 * through to reach the real `peek-invitation` Supabase Edge Function
 * (`supabase/functions/peek-invitation/`, see `supabase/README.md`).
 * `peek_invitation` itself is no longer directly PostgREST-callable
 * (`20260914060000_peek_invitation_rate_limit.sql` revokes anon/
 * authenticated execute on it) — this Edge Function is now the only path to
 * it, closing the token-enumeration surface RFC 0013 §4/§7 named but never
 * actually closed. Mirrors `otpClient.ts`'s `callOtpFunction` shape exactly;
 * kept as its own small file rather than folded into `otpClient.ts` since
 * this isn't an OTP call and doesn't share that module's request/response
 * shape.
 *
 * NOT LIVE-TESTED: no real Supabase project credentials exist in this build
 * (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` unset), so every call here
 * currently resolves to `platform-error` — see the config-check branch
 * below, same posture `otpClient.ts` already discloses.
 */

export type PeekInvitationResult =
  | {
      ok: true;
      businessName: string;
      status: 'pending' | 'expired' | 'accepted' | 'revoked';
      expiresAt: string;
      /** RFC 0014/D70 — `null` for a legacy, hint-less pending Invitation
       * (RFC 0014's own backward-compatibility exemption). See
       * `store.tsx`'s `peekInvitation` doc comment for why exposing this
       * pre-auth is not a new disclosure. */
      targetHint: { type: 'email'; value: string } | null;
    }
  | { ok: false; reason: 'invalid-token' | 'not-found' | 'rate-limited' | 'platform-error' };

/** RFC 0013 §2 / §4 / §7 — real call, replacing the previous direct
 * `supabase.rpc('peek_invitation', …)` call this function used before the
 * rate-limit mitigation existed. */
export async function peekInvitationRemote(token: string): Promise<PeekInvitationResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    // Fails closed rather than pretending to succeed — same posture
    // `otpClient.ts`'s `callOtpFunction` already establishes.
    console.error('[invitationClient] Supabase not configured — cannot call peek-invitation. See supabase/README.md.');
    return { ok: false, reason: 'platform-error' };
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/peek-invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify({ token }),
    });
    // The function always returns a structured `{ ok, reason? }` /
    // `{ ok: true, ... }` JSON body, on every status code it emits — safe
    // to parse and trust directly, same convention `callOtpFunction` uses.
    return (await res.json()) as PeekInvitationResult;
  } catch (err) {
    console.error('[invitationClient] peek-invitation request failed', err);
    return { ok: false, reason: 'platform-error' };
  }
}
