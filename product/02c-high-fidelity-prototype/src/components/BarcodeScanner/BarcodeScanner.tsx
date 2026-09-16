import { useEffect, useRef, useState } from 'react';
import type { IScannerControls } from '@zxing/browser';
import styles from './BarcodeScanner.module.css';

/**
 * `inventory.md` §3.8b/§3.8d/§3.8e, `home.md` §3.9/§3.9c (`decision-log.md`
 * D65) — the one real camera-access surface in this codebase (every other
 * "scan" in this build — NFC — is a simulated tap, since a browser can't
 * reproduce real NFC hardware; a barcode read is a genuinely reachable
 * `getUserMedia` capability, so this component is not a mock). Shared,
 * verbatim, by both consumers that reach it: `inventory.md`'s Elegir
 * producto picker (`ProductPicker.tsx`) and `home.md`'s buttons-mode
 * selling surface (`Selling.tsx`) — "reuses the same camera-viewfinder
 * shape... except the header" (`home.md` §3.9's own cross-reference) is
 * implemented here as one component with two label props, not two
 * near-duplicate builds.
 *
 * **Implementation-independent by design, per the approved spec's own
 * instruction (`inventory.md` §3.8b) — no camera-API/permission-mechanics/
 * symbology claim is made in `product/02-ux/*.md`; every choice below is
 * this build's own, disclosed here rather than silently assumed:**
 * - **Three-tier decode strategy, resolved once on mount, in priority
 *   order** (real-device scan reliability/speed complaint from the Product
 *   Owner's own live testing on a flagship Android device; a real
 *   prospective customer explicitly wants to scan existing product
 *   barcodes, making this a must-work path, not a nice-to-have):
 *   1. **Native `BarcodeDetector` Web API** (`'BarcodeDetector' in window`)
 *      — hardware-accelerated via ML Kit on Chrome/Android, the fastest
 *      option where it exists. Drives its own `getUserMedia` call directly.
 *   2. **`zxing-wasm`** (native unavailable) — a WebAssembly build of
 *      ZXing-C++, meaningfully more accurate than the pure-JS ZXing port
 *      below for browsers/devices without native detection. Dynamically
 *      imported from its `zxing-wasm/reader` subpath specifically (the
 *      smallest bundle of the package's several export surfaces); its
 *      `.wasm` binary is itself fetched at runtime from a CDN by the
 *      library, so both the dynamic import and this tier's first decode
 *      call are wrapped in their own try/catch and fall through to tier 3
 *      rather than surfacing as a hard failure — a merchant on flaky bazaar
 *      wifi is a real, expected case, not an edge case.
 *   3. **`@zxing/browser`** (`BrowserMultiFormatReader`, both above
 *      unavailable or failed to initialize) — kept as-is, unchanged, as the
 *      final safety net: a well-established, actively-maintained
 *      TypeScript ZXing port with the broadest browser coverage of the
 *      three, for the case where even the WASM module fails to load (e.g.
 *      that CDN fetch failing outright, or a genuinely old browser with
 *      neither native detection nor WebAssembly support worth relying on).
 *      **Dynamically imported** (`await import('@zxing/browser')`), not a
 *      top-level import — this library is sizeable, and Home/Selling is the
 *      everyday, <3-second screen (`company/backlog.md` #1); a merchant who
 *      never taps "Escanear código de barras" this session should never pay
 *      its download cost as part of the app's main bundle. (`zxing-wasm` is
 *      dynamically imported for the same reason.)
 *   This is still a pure implementation choice, not a spec claim — nothing
 *   about which tier is active, or that there are three at all, is
 *   surfaced to the merchant; the external contract (props, states, copy,
 *   timing) is identical no matter which tier ends up decoding the frame.
 * - Whichever tier is driving the camera, a rejected/failed `getUserMedia`
 *   promise (denied permission, no camera present, a non-secure `http://`
 *   context, or a browser with no `mediaDevices` API at all — checked
 *   explicitly before any tier is attempted) — or all three tiers being
 *   unavailable/failing to initialize — fold into the identical
 *   `onPermissionDenied` outcome: `inventory.md`/`home.md` define no
 *   separate "camera unsupported" state distinct from "permiso de cámara
 *   denegado" (§3.9c's own heading literally reads "cámara no disponible /
 *   no se pudo leer"), so this build doesn't invent a third one. A
 *   `getUserMedia` rejection on tier 1 or 2 specifically is *not* treated as
 *   an immediate `onPermissionDenied()` — it's likely a genuine permission/
 *   hardware problem that will also affect the remaining tiers, so it falls
 *   through and lets the next tier's own `getUserMedia` call make the same
 *   determination; only exhausting all three tiers reaches the terminal
 *   outcome.
 * - A genuine "no pudimos leer el código" outcome (§3.8e/§3.9c's second
 *   variant) has no natural discrete trigger with a *continuous* decoder —
 *   unlike a manual shutter-tap capture, every video frame (or detection
 *   tick) is its own silent pass/fail, and failing to find a barcode in one
 *   frame is the normal, expected state of "nothing in view yet," not a
 *   merchant-facing failure, in every one of the three tiers alike. This
 *   build treats sustained failure (`NO_READ_TIMEOUT_MS` of continuous
 *   scanning with no successful decode, armed once whichever tier actually
 *   ends up active is ready) as the "missed attempt" the approved copy
 *   describes — scanning never stops underneath, and the message clears the
 *   instant a decode actually succeeds, matching §3.8e's "a single missed
 *   attempt, not a terminal state... clears automatically on the next
 *   attempt."
 */
const NO_READ_TIMEOUT_MS = 7000;

/**
 * Minimal ambient shape for the native `BarcodeDetector` Web API — not yet
 * part of TypeScript's own DOM lib as of this build's TypeScript version, so
 * declared locally rather than pulling in a whole extra `@types` package for
 * a three-member surface this component actually uses.
 */
interface DetectedBarcode {
  rawValue: string;
}
interface BarcodeDetectorInstance {
  detect(image: CanvasImageSource): Promise<DetectedBarcode[]>;
}
interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance;
}
declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

// Type-only references (erased at compile time, no runtime import) into
// `zxing-wasm/reader` — the actual `readBarcodes` function is always
// dynamically imported at runtime, per the doc comment above.
type ZxingReaderOptions = import('zxing-wasm/reader').ReaderOptions;
type ZxingReadResult = import('zxing-wasm/reader').ReadResult;

// Shared by tiers 1 and 2, which each drive their own `getUserMedia` call
// (tier 3's `@zxing/browser` keeps its own untouched constraints object).
// `advanced` constraints are best-effort per the Media Capture spec — never
// throws for an unsupported sub-constraint like `focusMode` — so safe to
// include unconditionally. `focusMode` isn't in TypeScript's own DOM lib
// either, hence the local cast.
const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: 'environment',
    advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet],
  },
};

export function BarcodeScanner({
  backLabel,
  fallbackLabel,
  guidance = 'Apunta al código de barras',
  onBack,
  onResult,
  onPermissionDenied,
}: {
  /** "Elegir producto" (Inventory) | "Escanear código" (Selling) — the
   * header's own "← {backLabel}" text (`inventory.md` §3.8b vs. `home.md`
   * §3.9's own cross-reference: "except the header"). */
  backLabel: string;
  /** "Escribir en su lugar" (Inventory) | "Usar los botones" (Selling) —
   * the always-visible fallback link beneath the guidance text, same
   * destination as the header's own back arrow in both contexts. */
  fallbackLabel: string;
  guidance?: string;
  onBack: () => void;
  onResult: (code: string) => void;
  onPermissionDenied: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const noReadTimerRef = useRef<number | undefined>(undefined);
  const resolvedRef = useRef(false);
  // Visually invisible (opacity 0, non-interactive) until the camera stream
  // is actually attached — the brief `getUserMedia`/dynamic-import
  // negotiation window shows nothing, by design: a consumer that keeps its
  // own underlying content mounted underneath (`Selling.tsx`'s grid) never
  // has it covered — or its taps swallowed — by a half-initialized camera
  // box, and a denied/unsupported outcome never flashes a dead viewfinder
  // before falling back (`inventory.md` §3.8d: "never a blank camera view
  // with no explanation"). **The `<video>` element itself is always
  // mounted, unconditionally** (not gated behind `ready`) — it has to be,
  // so `videoRef.current` already exists the moment this effect runs and
  // can be handed to whichever decode tier ends up active as the preview
  // target on the very first attempt, rather than racing its own first
  // render.
  const [ready, setReady] = useState(false);
  const [failedRead, setFailedRead] = useState(false);

  useEffect(() => {
    resolvedRef.current = false;
    let cancelled = false;
    let stream: MediaStream | null = null;
    let intervalId: number | undefined;

    if (!navigator.mediaDevices?.getUserMedia) {
      onPermissionDenied();
      return;
    }

    function armNoReadTimer() {
      window.clearTimeout(noReadTimerRef.current);
      noReadTimerRef.current = window.setTimeout(() => {
        if (!cancelled) setFailedRead(true);
      }, NO_READ_TIMEOUT_MS);
    }

    // The one shared "a decode succeeded" path every tier funnels through —
    // dedupe via `resolvedRef`, clear the no-read timer, clear any pending
    // "no pudimos leer el código" message, hand the code up.
    function handleDecodeSuccess(text: string) {
      if (cancelled || resolvedRef.current) return;
      resolvedRef.current = true;
      window.clearTimeout(noReadTimerRef.current);
      setFailedRead(false);
      onResult(text);
    }

    // Stops whatever tier-1/tier-2 owned `MediaStream`/interval is active.
    // Tier 3's `@zxing/browser` controls object is stopped separately (it
    // manages its own stream internally) — see the effect's own cleanup.
    function stopOwnStream() {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
      stream?.getTracks().forEach((track) => track.stop());
      stream = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }

    // Shared by tiers 1 and 2: request the camera, attach it to the
    // `<video>` element, start playback. Returns `null` if the mount was
    // cancelled or the video element vanished mid-negotiation (both treated
    // by the caller as "handled, nothing left to do" rather than a failure
    // to fall through on). Can throw (a `getUserMedia` rejection) — callers
    // decide how to treat that themselves.
    async function startOwnStream(): Promise<HTMLVideoElement | null> {
      stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      if (cancelled) {
        stopOwnStream();
        return null;
      }
      const video = videoRef.current;
      if (!video) {
        stopOwnStream();
        return null;
      }
      video.srcObject = stream;
      await video.play().catch(() => {
        // Some browsers need an explicit play() even with the `autoPlay`
        // attribute present when `srcObject` is assigned after mount — a
        // rejected play() here isn't itself fatal, the stream is still live.
      });
      if (cancelled) {
        stopOwnStream();
        return null;
      }
      return video;
    }

    // Tier 1 — native BarcodeDetector: hardware-accelerated, fastest where
    // available.
    async function tryNativeDetector(): Promise<boolean> {
      const BarcodeDetectorCtor = window.BarcodeDetector;
      if (!BarcodeDetectorCtor) return false;

      let video: HTMLVideoElement | null;
      try {
        video = await startOwnStream();
      } catch {
        // A genuine permission/hardware problem that will also affect
        // tiers 2/3 — let it fall through instead of special-casing it.
        return false;
      }
      if (!video) return true; // cancelled mid-init — nothing left to do

      try {
        const detector = new BarcodeDetectorCtor({
          formats: [
            'ean_13',
            'ean_8',
            'upc_a',
            'upc_e',
            'code_128',
            'code_39',
            'itf',
            'codabar',
            'qr_code',
          ],
        });
        setReady(true);
        armNoReadTimer();

        let inFlight = false;
        intervalId = window.setInterval(() => {
          if (cancelled || resolvedRef.current || inFlight || !videoRef.current) return;
          inFlight = true;
          detector
            .detect(videoRef.current)
            .then((results) => {
              if (results.length > 0) handleDecodeSuccess(results[0].rawValue);
            })
            .catch(() => {
              // A per-frame detect miss — ordinary "nothing in view yet,"
              // never itself surfaced (only the sustained no-read timer is).
            })
            .finally(() => {
              inFlight = false;
            });
        }, 150);

        return true;
      } catch {
        // Constructor/setup failure after a successful stream — treat like
        // any other tier-1 init failure and fall through.
        stopOwnStream();
        return false;
      }
    }

    // Tier 2 — zxing-wasm: meaningfully more accurate than the pure-JS
    // decoder below, for browsers/devices without native detection.
    async function tryZxingWasm(): Promise<boolean> {
      let readBarcodesFn: (typeof import('zxing-wasm/reader'))['readBarcodes'];
      try {
        ({ readBarcodes: readBarcodesFn } = await import('zxing-wasm/reader'));
      } catch {
        // The module itself failed to load — fall through to tier 3.
        return false;
      }

      let video: HTMLVideoElement | null;
      try {
        video = await startOwnStream();
      } catch {
        return false;
      }
      if (!video) return true;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        stopOwnStream();
        return false;
      }

      if (video.readyState < 1) {
        // HAVE_METADATA not yet reached — `videoWidth`/`videoHeight` would
        // still be 0. Wait for real dimensions before the first frame grab.
        await new Promise<void>((resolve) => {
          const onLoadedMetadata = () => {
            video?.removeEventListener('loadedmetadata', onLoadedMetadata);
            resolve();
          };
          video?.addEventListener('loadedmetadata', onLoadedMetadata);
        });
      }
      if (cancelled) {
        stopOwnStream();
        return true;
      }

      function captureFrame(): ImageData {
        const w = video!.videoWidth;
        const h = video!.videoHeight;
        canvas.width = w;
        canvas.height = h;
        ctx!.drawImage(video!, 0, 0, w, h);
        return ctx!.getImageData(0, 0, w, h);
      }

      const readerOptions: ZxingReaderOptions = {
        formats: ['AllRetail', 'QRCode'],
        tryHarder: true,
        maxNumberOfSymbols: 1,
      };

      let firstResults: ZxingReadResult[];
      try {
        // The wasm module's own `.wasm` binary (fetched at runtime from a
        // CDN by the library) is only actually loaded on this first real
        // call — a failure here (e.g. that fetch failing on flaky bazaar
        // wifi) means tier 2 never truly initialized, so it falls through
        // to tier 3 rather than surfacing as a hard failure.
        firstResults = await readBarcodesFn(captureFrame(), readerOptions);
      } catch {
        stopOwnStream();
        return false;
      }
      if (cancelled) {
        stopOwnStream();
        return true;
      }

      setReady(true);
      armNoReadTimer();
      if (firstResults.length > 0) {
        handleDecodeSuccess(firstResults[0].text);
      }

      let inFlight = false;
      intervalId = window.setInterval(() => {
        if (cancelled || resolvedRef.current || inFlight) return;
        if (!video!.videoWidth || !video!.videoHeight) return;
        inFlight = true;
        readBarcodesFn(captureFrame(), readerOptions)
          .then((results) => {
            if (results.length > 0) handleDecodeSuccess(results[0].text);
          })
          .catch(() => {
            // An in-session failure after the module already proved it
            // loads (the first call above) is an ordinary per-frame miss —
            // tier 2 stays active, never retried from scratch mid-session.
          })
          .finally(() => {
            inFlight = false;
          });
      }, 300);

      return true;
    }

    // Tier 3 — @zxing/browser, unchanged from before this rewrite: the
    // final safety net if both tiers above are unavailable or fail to
    // initialize.
    async function tryZxingBrowser(): Promise<boolean> {
      let BrowserMultiFormatReader: (typeof import('@zxing/browser'))['BrowserMultiFormatReader'];
      try {
        ({ BrowserMultiFormatReader } = await import('@zxing/browser'));
      } catch {
        return false;
      }
      if (cancelled) return true;

      const reader = new BrowserMultiFormatReader();
      try {
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: 'environment' } },
          videoRef.current ?? undefined,
          (result) => {
            if (cancelled || resolvedRef.current || !result) {
              // A per-frame miss (`error` instead of `result`) is the
              // ordinary "nothing in view yet" case — never itself
              // surfaced as a failure; only the sustained no-read timer
              // does that.
              return;
            }
            handleDecodeSuccess(result.getText());
          },
        );
        if (cancelled) {
          controls.stop();
          return true;
        }
        controlsRef.current = controls;
        setReady(true);
        armNoReadTimer();
        return true;
      } catch {
        return false;
      }
    }

    (async () => {
      if ('BarcodeDetector' in window && window.BarcodeDetector) {
        if (await tryNativeDetector()) return;
      }
      if (cancelled) return;
      if (await tryZxingWasm()) return;
      if (cancelled) return;
      if (await tryZxingBrowser()) return;
      // All three tiers unavailable or failed to initialize — the single
      // terminal outcome, matching today's existing behavior exactly.
      if (!cancelled) onPermissionDenied();
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(noReadTimerRef.current);
      stopOwnStream();
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
    // Intentionally empty deps — this effect owns exactly one camera
    // session for the lifetime of this mount; a fresh attempt (e.g. "No es
    // este" → back to the camera) always remounts this component instead
    // (see ProductPicker.tsx/Selling.tsx), never reruns this effect in
    // place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${styles.screen} ${ready ? styles.screenReady : ''}`}>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← {backLabel}
        </button>
      </div>
      <div className={styles.viewfinderWrap}>
        <video ref={videoRef} className={styles.video} muted playsInline autoPlay />
        <div className={styles.frame} aria-hidden="true" />
      </div>
      <p className={styles.guidance}>
        {failedRead ? (
          <>
            No pudimos leer el código.
            <br />
            Intenta de nuevo.
          </>
        ) : (
          guidance
        )}
      </p>
      <button className={styles.fallback} onClick={onBack}>
        {fallbackLabel}
      </button>
    </div>
  );
}
