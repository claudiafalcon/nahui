/**
 * Stage 7 Backend Integration (`decision-log.md` D62/D63,
 * `product/99-rfc/0012-auth-identity-multi-method.md` Accepted) — the thin
 * Nahui-domain wrapper around Supabase Auth's own native email/OAuth
 * mechanisms, the same seam `otpClient.ts` already establishes for the phone
 * channel (`send-otp`/`verify-otp` custom Edge Functions).
 *
 * **Why a separate client from `otpClient.ts`, not a shared one:** phone
 * identities are minted entirely *outside* Supabase's own native auth
 * tables, via this codebase's existing custom Edge Functions
 * (`supabase/functions/send-otp`/`verify-otp`) — a plain `fetch`, no
 * `@supabase/supabase-js` client involved at all. Google (`signInWithOAuth`)
 * and Email (`signInWithOtp`/`verifyOtp`) mint natively inside Supabase's own
 * `auth.users` instead, which genuinely needs the real client library. Same
 * Supabase *project* either way (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`,
 * already configured for the phone path) — this file is the seam that keeps
 * that difference contained to one place, rather than scattering raw
 * `supabase-js` calls into screen components, so a future Stage-7 backend
 * pass that unifies the two mechanisms doesn't need a costly re-wire.
 *
 * NOT LIVE-TESTED, same disclosed posture as `otpClient.ts`: email requires
 * no extra provisioning beyond the existing Supabase project (Supabase's own
 * default email-OTP behavior), but Google requires a real Google Cloud OAuth
 * Client configured as a provider in the Supabase Auth dashboard — a
 * Product-Owner-only manual step, not yet done (`supabase/README.md`'s own
 * checklist doesn't yet cover it — a follow-up item, not silently assumed
 * complete). Every call in this file fails closed until that's provisioned,
 * the identical posture `otpClient.ts` already holds for Twilio/WhatsApp.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null | undefined;

/** `undefined` on the very first call, cached thereafter — `undefined`
 * distinguishes "not yet attempted" from `null` ("attempted, but no
 * VITE_SUPABASE_URL/ANON_KEY configured"), so a later call doesn't keep
 * silently retrying a `createClient` that will only ever fail for the same
 * reason. */
function getClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    console.error('[authProviders] Supabase not configured — cannot use Google/Email sign-in. See supabase/README.md.');
    cachedClient = null;
    return cachedClient;
  }
  cachedClient = createClient(supabaseUrl, anonKey);
  return cachedClient;
}

/**
 * Stage 7 Backend Integration, Phase 0 (Identity persistence layer,
 * `supabase/migrations/20260913000000_identity_persistence_layer.sql`) —
 * exported so `store.tsx`'s own real-backend write paths
 * (`create_business_with_owner`/`accept_invitation` RPC calls) reuse this
 * one cached client instance rather than constructing a second
 * `createClient()` against the same Supabase project. Two independent
 * clients against the same project would each maintain their own GoTrue
 * auth-state/localStorage handling and risk drifting out of sync with each
 * other — there is exactly one authenticated session this app ever needs to
 * track, so there must be exactly one client instance tracking it.
 */
export function getSupabaseClient(): SupabaseClient | null {
  return getClient();
}

export type ProviderOtpResult = { ok: true } | { ok: false; reason: 'rate-limited' | 'platform-error' };

export type ProviderVerifyResult =
  | { ok: true; identifier: string }
  | { ok: false; reason: 'incorrect' | 'expired' | 'too-many' | 'platform-error' };

/** authentication.md §3.2e "Enviar código" — Supabase Auth's own
 * `signInWithOtp({ email })`. `shouldCreateUser: true` (Supabase's own
 * default) is stated explicitly rather than left implicit — a first-ever
 * email address must be able to receive a code at all, the identical
 * "no separate create-account step" posture the phone channel already has
 * (`authentication.md` §1's own acceptance criteria). */
export async function sendEmailCode(email: string): Promise<ProviderOtpResult> {
  const supabase = getClient();
  if (!supabase) return { ok: false, reason: 'platform-error' };
  try {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) {
      // Supabase surfaces rate-limiting as a 429 — the one distinguishable
      // reason this file maps explicitly; everything else folds into
      // `platform-error`, the same "one branch that doesn't assume a
      // specific correctable user mistake" posture `otpClient.ts` already
      // holds for its own send path.
      return { ok: false, reason: error.status === 429 ? 'rate-limited' : 'platform-error' };
    }
    return { ok: true };
  } catch (err) {
    console.error('[authProviders] sendEmailCode failed', err);
    return { ok: false, reason: 'platform-error' };
  }
}

/** authentication.md §3.7 (shared with the email channel) — Supabase Auth's
 * own `verifyOtp({ email, token, type: 'email' })`, per §10's own decision
 * (a numeric code, not a magic link — the merge-tag choice that determines
 * which one the merchant actually receives is a server-side email-template
 * setting, not something this client controls). `identifier` on success is
 * the lowercased, trimmed email address `resolveAuthIdentity` keys on —
 * read from the resolved session's own `user.email`, falling back to the
 * typed value if Supabase's own response ever omits it (defensive; not
 * expected in practice). */
export async function verifyEmailCode(email: string, code: string): Promise<ProviderVerifyResult> {
  const supabase = getClient();
  if (!supabase) return { ok: false, reason: 'platform-error' };
  try {
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error) {
      // Supabase's own verifyOtp error doesn't cleanly distinguish
      // "wrong code" from "expired code" as separate machine-readable
      // reasons the way the custom verify-otp Edge Function does for phone
      // — best-effort message sniffing here, folding anything unrecognized
      // into `incorrect` (never silently `platform-error`, which would make
      // §3.7d — a genuine send/confirm failure — indistinguishable from an
      // ordinary wrong-code retry, the one distinction §3.7's own doc
      // comment calls load-bearing).
      const msg = error.message?.toLowerCase() ?? '';
      if (msg.includes('expired')) return { ok: false, reason: 'expired' };
      if (msg.includes('rate') || msg.includes('too many')) return { ok: false, reason: 'too-many' };
      return { ok: false, reason: 'incorrect' };
    }
    const identifier = (data.user?.email ?? email).trim().toLowerCase();
    return { ok: true, identifier };
  } catch (err) {
    console.error('[authProviders] verifyEmailCode failed', err);
    return { ok: false, reason: 'platform-error' };
  }
}

/** authentication.md §3.2b "Continuando con Google" — Supabase Auth's own
 * `signInWithOAuth({ provider: 'google' })`, which performs a real,
 * synchronous full-page navigation away from this app (`window.location`
 * assignment, internal to `supabase-js`) the moment it resolves without an
 * error. `redirectTo` is the app's own current origin+path, so control
 * returns to this same screen (`AuthenticationFlow.tsx` resolves the
 * returning session via `resolveGoogleSession` below, not a dedicated
 * callback route — this is a single-page app with no server-side routing to
 * add one to). */
export async function signInWithGoogle(redirectTo: string): Promise<{ ok: true } | { ok: false }> {
  const supabase = getClient();
  if (!supabase) return { ok: false };
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    return error ? { ok: false } : { ok: true };
  } catch (err) {
    console.error('[authProviders] signInWithGoogle failed', err);
    return { ok: false };
  }
}

export type GoogleResolution =
  | { status: 'success'; subjectId: string; displayLabel: string | null }
  | { status: 'cancelled' }
  | { status: 'error' };

/** authentication.md §3.2c "Verificando con Google" — resolves whatever
 * happened once control returns to this app from Google's own UI, or on an
 * ordinary app open/resume that might be mid-redirect (§3.8's own extended
 * resumability range). `supabase-js`'s client auto-detects a session from
 * the URL's own auth hash fragment on construction/first call
 * (`detectSessionInUrl`, its own default) — `getSession()` below reads
 * whatever that detection already resolved, and this function clears the
 * hash/query afterward so a later reload never re-processes stale tokens.
 *
 * **Cancellation vs. genuine error — the one distinction §3.2c's own text
 * calls out explicitly, "below this document's abstraction level" to
 * specify further than this:** a denied/dismissed Google consent screen
 * redirects back with `?error=...` in the URL and no established session —
 * treated as `'cancelled'`, silently, the same non-event posture §3.2c
 * itself specifies. A thrown exception from `getSession()` itself (a real
 * network drop, a malformed response) is the one case this treats as a
 * genuine `'error'`. Landing here with neither a session nor any OAuth-
 * looking URL fragment at all (the ordinary case — she never went through
 * Google) also resolves `'cancelled'`, since the merchant-visible outcome is
 * identical either way: silently return to §3.2a with nothing to report.
 */
export async function resolveGoogleSession(): Promise<GoogleResolution> {
  const supabase = getClient();
  if (!supabase) return { status: 'error' };
  try {
    const { data, error } = await supabase.auth.getSession();
    // Clear any auth hash/query Supabase's own redirect appended, regardless
    // of outcome — never leave stale tokens/error params sitting in the URL
    // for a later reload to reprocess.
    if (typeof window !== 'undefined' && (window.location.hash || window.location.search)) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    if (error) return { status: 'error' };
    const session = data.session;
    if (!session) return { status: 'cancelled' };
    const googleIdentity = session.user.identities?.find((i) => i.provider === 'google');
    if (!googleIdentity) return { status: 'cancelled' }; // a session exists but isn't a Google one — not this flow's concern
    // RFC 0012 §1 — the provider's own opaque stable subject ID, never a
    // human-readable label. Supabase's own identity record carries Google's
    // real `sub` claim in `identity_data.sub`; `session.user.id` (Supabase's
    // own stable per-identity UUID) is the defensive fallback should that
    // ever be absent.
    const subjectId = (googleIdentity.identity_data?.sub as string | undefined) ?? session.user.id;
    const displayLabel =
      session.user.email ?? (googleIdentity.identity_data?.full_name as string | undefined) ?? null;
    return { status: 'success', subjectId, displayLabel };
  } catch (err) {
    console.error('[authProviders] resolveGoogleSession failed', err);
    return { status: 'error' };
  }
}
