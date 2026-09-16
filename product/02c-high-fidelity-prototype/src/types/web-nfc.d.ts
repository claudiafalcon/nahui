/**
 * Minimal ambient shape for the real Web NFC API (`NDEFReader`) — not yet
 * part of TypeScript's own DOM lib as of this build's TypeScript version, so
 * declared locally rather than pulling in a whole extra `@types` package for
 * the small surface this build actually uses. Same "minimal interface
 * covering exactly what's used, not the full spec surface" discipline
 * `BarcodeScanner.tsx` already established for its own `BarcodeDetector`
 * ambient declaration — shared here (rather than duplicated per file) since
 * both `AssignTags.tsx` (write) and `Selling.tsx` (read) need it. A plain
 * ambient global script (no top-level import/export), same shape as this
 * project's own `vite-env.d.ts` — picked up automatically via `tsconfig`'s
 * `"include": ["src"]`, no explicit import needed in either consumer.
 *
 * Chrome/Android is the only browser that implements Web NFC as of this
 * build — everywhere else (iPhone Safari, desktop, any browser without it)
 * falls back to this codebase's existing simulated NFC behavior, gated on
 * the `'NDEFReader' in window` feature-detection check each consuming file
 * performs itself.
 */
interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  data?: DataView;
  encoding?: string;
  lang?: string;
}
interface NDEFMessage {
  records: NDEFRecord[];
}
interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}
interface NDEFReader extends EventTarget {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  write(
    message: string | { records: { recordType: string; data: string }[] },
    options?: { signal?: AbortSignal },
  ): Promise<void>;
  onreading: ((event: NDEFReadingEvent) => void) | null;
  onreadingerror: ((event: Event) => void) | null;
}
interface Window {
  NDEFReader?: { new (): NDEFReader };
}
