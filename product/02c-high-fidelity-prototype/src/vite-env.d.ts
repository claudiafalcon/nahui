/// <reference types="vite/client" />

// demo-mode.md, Architecture Review §8 item 1 — the compile-time build-mode
// flag `DemoModeGate.tsx` reads. Not set in a real production build (`npm
// run build`); only `.env.demo-campaign` (consumed by `npm run
// build:demo-campaign` / `vite --mode demo-campaign`) defines it.
interface ImportMetaEnv {
  readonly VITE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
