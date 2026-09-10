// Shared constants and small crypto helpers for send-otp / verify-otp.
// Kept minimal and specific to this one flow — not a general "auth utils"
// module, per this pass's own "don't over-abstract" instruction.

/** Judgment call (implementation detail, not escalated): 6 digits, matching
 * the code length the UI already collects (`CodeStep.tsx`'s existing
 * 6-digit field). */
export const OTP_LENGTH = 6;

/** Judgment call: 10 minutes — within the 5-10 minute range the task
 * itself suggested. Long enough that a merchant switching from WhatsApp
 * back to Nahui mid-bazaar isn't punished, short enough that a leaked/
 * intercepted code has a small usable window. */
export const OTP_EXPIRY_MINUTES = 10;

/** Judgment call: how many *codes* (send-otp calls) one phone number may
 * request per hour. Generous enough to cover a merchant who fat-fingers
 * her number once or two legitimate resends, tight enough to make
 * spamming a WhatsApp inbox (or running up the Twilio bill) impractical. */
export const SEND_RATE_LIMIT_PER_HOUR = 5;

/** Judgment call: how many wrong guesses a single issued code tolerates
 * before it's locked out (the merchant must request a fresh one via
 * "Reenviar código," which mints a brand-new row and resets the count).
 * Standard OTP lockout threshold — low enough to make brute-forcing a
 * 6-digit code (1,000,000 combinations) infeasible within the attempt
 * budget, high enough to absorb a couple of genuine typos. */
export const VERIFY_MAX_ATTEMPTS = 5;

/** Generates a cryptographically random numeric OTP — `crypto.getRandomValues`,
 * never `Math.random()` (not a real hygiene concern for the code's own
 * guessability at 6 digits/limited-attempts either way, but this project's
 * own stated bar is "treat this as a real auth surface"). */
export function generateOtp(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  // Modulo bias is negligible at this range (10^6 buckets over 2^32) and
  // irrelevant to guessability given VERIFY_MAX_ATTEMPTS above — not worth
  // a rejection-sampling loop for a 6-digit OTP.
  const code = buf[0] % 10 ** OTP_LENGTH;
  return code.toString().padStart(OTP_LENGTH, '0');
}

/** SHA-256 hex digest — Deno's Web Crypto `crypto.subtle`, no external
 * dependency. The plaintext code is never stored, only this hash. */
export async function hashOtp(code: string): Promise<string> {
  const data = new TextEncoder().encode(code);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Normalizes the client's 10-digit Mexican mobile number (already
 * validated client-side, `PhoneStep.tsx`'s `/^\d{10}$/`) into the shape
 * both Twilio's WhatsApp API and this table's `phone` column use — E.164
 * digits, no "+52" prefix stored, "+52" added only at send time. Re-checked
 * here rather than trusted, since these functions are reachable directly
 * (any caller holding the anon key, not only this app's own UI). */
export function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  return /^\d{10}$/.test(raw) ? raw : null;
}

export function normalizeCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  return new RegExp(`^\\d{${OTP_LENGTH}}$`).test(raw) ? raw : null;
}
