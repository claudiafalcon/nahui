/**
 * Minimal ambient shape for the real Web NFC API (`NDEFReader`) — not yet
 * part of TypeScript's own DOM lib as of this build's TypeScript version, so
 * declared locally rather than pulling in a whole extra `@types` package for
 * the small surface this build actually uses. Same "minimal interface
 * covering exactly what's used, not the full spec surface" discipline
 * `BarcodeScanner.tsx` already established for its own `BarcodeDetector`
 * ambient declaration — shared here (rather than duplicated per file) since
 * `AssignTags.tsx`, `Selling.tsx`, and `MercanciaParaEsteEvento.tsx` all read
 * through it. A plain ambient global script (no top-level import/export),
 * same shape as this project's own `vite-env.d.ts` — picked up automatically
 * via `tsconfig`'s `"include": ["src"]`, no explicit import needed in any
 * consumer.
 *
 * **Read-only, deliberately (`decision-log.md` D74).** No `write()` method
 * exists here at all — deleted outright, not merely stopped-calling, so a
 * future regression back toward writing to a tag fails to typecheck rather
 * than silently reintroducing D74's own incident (a client-minted id written
 * as a `text/plain` NDEF record, hijacked by an unrelated app's intent
 * filter outside Nahui, and silently un-persisted on any browser that took
 * the simulated fallback). `tag_identifier` is the tag's own factory-set
 * hardware UID (`NDEFReadingEvent.serialNumber`) — Nahui never writes
 * anything onto a physical tag; every real-hardware surface only ever calls
 * `scan()` and reads `serialNumber` off the resulting `NDEFReadingEvent`.
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
  /** The physical tag's own factory-set hardware UID, colon-separated
   * lowercase hex (e.g. `04:a3:2b:1a:6c:5d:80`) — may be the empty string if
   * unavailable (`decision-log.md` D74). Every real-hardware read path in
   * this codebase keys on this field, never on `message.records`, since a
   * factory-blank tag legitimately carries an empty `message` and is still
   * fully usable as-is. */
  serialNumber: string;
  message: NDEFMessage;
}
interface NDEFReader extends EventTarget {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  onreading: ((event: NDEFReadingEvent) => void) | null;
  onreadingerror: ((event: Event) => void) | null;
}
interface Window {
  NDEFReader?: { new (): NDEFReader };
}
