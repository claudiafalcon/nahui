/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Stage 7 Backend Integration (real WhatsApp OTP delivery) — see
  // supabase/README.md. Unset in local dev until a real Supabase project
  // exists; `otpClient.ts` treats that as a configuration error, not a
  // silent success.
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
