// supabase/functions/send-otp — Stage 7 Backend Integration.
//
// Generates a fresh OTP for a phone number, stores its hash (never the
// plaintext), and delivers it over WhatsApp via Twilio's Programmable
// Messaging API, using a Meta-approved WhatsApp Business Sender.
//
// Deno runtime (Supabase Edge Functions), not covered by the prototype's
// own `tsc -b`/Vite build — see supabase/README.md for how this gets
// deployed and verified once real Supabase/Twilio credentials exist.
// NOT LIVE-TESTED against real infrastructure — no Supabase/Twilio account
// exists yet (see supabase/README.md). Verified for syntax/structure only.
//
// Request: POST { phone: string }              — 10 digits, e.g. "5512345678"
// Response: 200 { ok: true }
//           400 { ok: false, reason: 'invalid-phone' }
//           429 { ok: false, reason: 'rate-limited' }
//           500 { ok: false, reason: 'platform-error' }

import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import {
  OTP_EXPIRY_MINUTES,
  SEND_RATE_LIMIT_PER_HOUR,
  generateOtp,
  hashOtp,
  normalizePhone,
} from '../_shared/otp.ts';

// Supabase secrets (`supabase secrets set …`, see supabase/README.md) —
// never hardcoded, never committed. SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY
// are auto-injected into every Edge Function's environment by the
// Supabase platform itself; the Twilio ones are set explicitly by the
// Product Owner once a Twilio account exists.
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
// The Meta-verified WhatsApp Business Sender number, E.164, no "whatsapp:"
// prefix (added below) — e.g. "+14155238886" for a Twilio Sandbox number,
// or Nahui's own approved sender once provisioned.
const TWILIO_WHATSAPP_FROM = Deno.env.get('TWILIO_WHATSAPP_FROM');
// A Meta-approved WhatsApp message template's Content SID (Twilio Content
// API, `HXxxxxxxxx…`). Required because this is a business-initiated
// message outside any customer-service session window — WhatsApp Business
// Platform rejects free-form `Body` text in that case, so this can't be a
// plain "send a string" call. See supabase/README.md step 3 for how to
// create and get this template approved. The template is expected to take
// exactly one variable ({{1}}) — the OTP code itself.
const TWILIO_WHATSAPP_CONTENT_SID = Deno.env.get('TWILIO_WHATSAPP_CONTENT_SID');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !TWILIO_WHATSAPP_CONTENT_SID) {
    console.error('send-otp: missing one or more Twilio secrets — see supabase/README.md');
    return jsonResponse({ ok: false, reason: 'platform-error' }, 500);
  }

  // Rate limit — count OTP issuances for this phone in the last hour.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase
    .from('otp_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('phone', phone)
    .gte('created_at', oneHourAgo);

  if (countError) {
    console.error('send-otp: rate-limit lookup failed', countError);
    return jsonResponse({ ok: false, reason: 'platform-error' }, 500);
  }
  if ((count ?? 0) >= SEND_RATE_LIMIT_PER_HOUR) {
    return jsonResponse({ ok: false, reason: 'rate-limited' }, 429);
  }

  const code = generateOtp();
  const codeHash = await hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from('otp_attempts').insert({
    phone,
    code_hash: codeHash,
    expires_at: expiresAt,
  });
  if (insertError) {
    console.error('send-otp: insert failed', insertError);
    return jsonResponse({ ok: false, reason: 'platform-error' }, 500);
  }

  // Twilio Programmable Messaging — WhatsApp channel, Content API template
  // send (required for a business-initiated message). See
  // https://www.twilio.com/docs/content/whatsapp — verify the exact
  // ContentVariables shape against the actual approved template once one
  // exists; `{"1": code}` matches Twilio's own single-variable convention.
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const form = new URLSearchParams({
    From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
    To: `whatsapp:+52${phone}`,
    ContentSid: TWILIO_WHATSAPP_CONTENT_SID,
    ContentVariables: JSON.stringify({ '1': code }),
  });

  try {
    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });
    if (!twilioRes.ok) {
      // Never leak Twilio's raw error body to the client — log it
      // server-side (visible in `supabase functions logs send-otp`) only.
      console.error('send-otp: Twilio send failed', twilioRes.status, await twilioRes.text());
      return jsonResponse({ ok: false, reason: 'platform-error' }, 502);
    }
  } catch (err) {
    console.error('send-otp: Twilio request threw', err);
    return jsonResponse({ ok: false, reason: 'platform-error' }, 502);
  }

  return jsonResponse({ ok: true });
});
