/**
 * Browser NFC capability + the one build-time simulation switch — resolved
 * once, shared by every NFC surface (`AssignTags.tsx`, `Selling.tsx`'s two
 * surfaces, `MercanciaParaEsteEvento.tsx`, and `NFCScanPrompt` itself).
 *
 * **Why this module exists (Stage 7 correctness fix, 2026-09-17).** Before
 * it, each NFC screen held its own copy of the `'NDEFReader' in window`
 * check and, whenever that check was false, fell straight into its
 * prototype-era *simulated* scan path — a fabricated `makeId('tag')` (or a
 * random already-tagged unit) committed through the real Supabase RPC. That
 * was the right mock while there was no backend; once the writes became
 * real it silently corrupted production data on any browser without Web
 * NFC (Samsung Internet, Firefox, every WebView/in-app browser, iOS
 * Safari): the database recorded a unit as tagged while the physical tag
 * stayed blank, and the pulsing "listening" ring gave the merchant no way
 * to tell nothing real had happened. Root-caused against Android/Chromium
 * source and caniuse via a `knowledge-mentor` consultation.
 *
 * Not domain vocabulary (`domain-model.md` has no "browser" concept) — a
 * platform-capability module living beside the other environment-reading
 * modules here (`otpClient.ts`, `authProviders.ts`) rather than duplicated
 * per screen a fourth time.
 */

/** Real Web NFC (`NDEFReader`) is Chrome/Android-only as of this build —
 * same shape as `BarcodeScanner.tsx`'s own `'BarcodeDetector' in window`
 * check. Samsung Internet, Firefox, WebViews and iOS Safari all report
 * `false` here. */
export const nfcSupported = typeof window !== 'undefined' && 'NDEFReader' in window;

/**
 * The one explicit switch for the simulated NFC path. `true` under `vite`
 * dev (`import.meta.env.DEV`) or when a build is made with
 * `VITE_NFC_SIMULATE=true` (a deliberate demo build), so desktop/iPhone
 * demos keep the pre-existing simulated behavior unchanged. A plain
 * production build (`vite build` with no `VITE_NFC_SIMULATE`) resolves this
 * to `false` at build time, and every simulated branch behind it becomes
 * unreachable — no fabricated tag ids, no fake sale-by-tag, no fake
 * scan-into-Event, ever, against real data.
 */
export const NFC_SIMULATION_ENABLED: boolean =
  import.meta.env.DEV || import.meta.env.VITE_NFC_SIMULATE === 'true';

/** No real Web NFC *and* simulation disabled — the honest, blocking
 * `'unsupported'` state on every `NFCScanPrompt`. Every call site routes
 * this case to that state before it can ever reach its simulated branch. */
export const nfcUnavailable = !nfcSupported && !NFC_SIMULATION_ENABLED;

/** Samsung Internet identifies itself with the documented `SamsungBrowser`
 * UA token — the Product Owner's own phone, and the one browser worth
 * naming in the unsupported copy since it ships as the default on the very
 * Android phones that *do* have the NFC radio Chrome could use. */
export const isSamsungInternet =
  typeof navigator !== 'undefined' && /SamsungBrowser/.test(navigator.userAgent);
