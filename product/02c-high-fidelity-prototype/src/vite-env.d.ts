/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Stage 7 Backend Integration (real WhatsApp OTP delivery) — see
  // supabase/README.md. Unset in local dev until a real Supabase project
  // exists; `otpClient.ts` treats that as a configuration error, not a
  // silent success.
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  // `'true'` opts a *build* into the simulated NFC path (demo builds only)
  // — see `src/domain/nfcSupport.ts`. Unset in production; `vite` dev
  // simulates regardless via `import.meta.env.DEV`.
  readonly VITE_NFC_SIMULATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
