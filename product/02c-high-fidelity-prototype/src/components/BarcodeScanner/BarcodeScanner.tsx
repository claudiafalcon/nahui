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
 * - Decoding via `@zxing/browser` (`BrowserMultiFormatReader`), a
 *   well-established, actively-maintained TypeScript port of ZXing —
 *   chosen over the native `BarcodeDetector` API specifically for broader
 *   browser coverage (Chrome-only today; no Safari/iOS support), since
 *   Ana's own device is unknown ahead of time. **Dynamically imported**
 *   (`await import('@zxing/browser')`), not a top-level `import` — this
 *   library is sizeable, and Home/Selling is the everyday, <3-second
 *   screen (`company/backlog.md` #1); a merchant who never taps "Escanear
 *   código de barras" this session should never pay its download cost as
 *   part of the app's main bundle.
 * - `decodeFromConstraints` performs `getUserMedia` internally, requesting
 *   the rear/environment-facing camera. A rejected/failed promise (denied
 *   permission, no camera present, a non-secure `http://` context, or a
 *   browser with no `mediaDevices` API at all — checked explicitly before
 *   ever calling it) all fold into the identical `onPermissionDenied`
 *   outcome: `inventory.md`/`home.md` define no separate "camera
 *   unsupported" state distinct from "permiso de cámara denegado" (§3.9c's
 *   own heading literally reads "cámara no disponible / no se pudo leer"),
 *   so this build doesn't invent a third one.
 * - A genuine "no pudimos leer el código" outcome (§3.8e/§3.9c's second
 *   variant) has no natural discrete trigger with a *continuous* decoder —
 *   unlike a manual shutter-tap capture, every video frame is its own
 *   silent pass/fail, and failing to find a barcode in one frame is the
 *   normal, expected state of "nothing in view yet," not a merchant-facing
 *   failure. This build treats sustained failure (`NO_READ_TIMEOUT_MS` of
 *   continuous scanning with no successful decode) as the "missed attempt"
 *   the approved copy describes — scanning never stops underneath, and the
 *   message clears the instant a decode actually succeeds, matching
 *   §3.8e's "a single missed attempt, not a terminal state... clears
 *   automatically on the next attempt."
 */
const NO_READ_TIMEOUT_MS = 7000;

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
  // can be handed to `decodeFromConstraints` as the preview target on the
  // very first attempt, rather than racing its own first render.
  const [ready, setReady] = useState(false);
  const [failedRead, setFailedRead] = useState(false);

  useEffect(() => {
    resolvedRef.current = false;
    let cancelled = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      onPermissionDenied();
      return;
    }

    import('@zxing/browser').then(({ BrowserMultiFormatReader }) => {
      if (cancelled) return;
      const reader = new BrowserMultiFormatReader();

      function armNoReadTimer() {
        window.clearTimeout(noReadTimerRef.current);
        noReadTimerRef.current = window.setTimeout(() => {
          if (!cancelled) setFailedRead(true);
        }, NO_READ_TIMEOUT_MS);
      }

      reader
        .decodeFromConstraints({ video: { facingMode: 'environment' } }, videoRef.current ?? undefined, (result) => {
          if (cancelled || resolvedRef.current || !result) {
            // A per-frame miss (`error` instead of `result`) is the
            // ordinary "nothing in view yet" case — never itself surfaced
            // as a failure; only the sustained no-read timer above does
            // that.
            return;
          }
          resolvedRef.current = true;
          window.clearTimeout(noReadTimerRef.current);
          setFailedRead(false);
          onResult(result.getText());
        })
        .then((controls) => {
          if (cancelled) {
            controls.stop();
            return;
          }
          controlsRef.current = controls;
          setReady(true);
          armNoReadTimer();
        })
        .catch(() => {
          if (!cancelled) onPermissionDenied();
        });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(noReadTimerRef.current);
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
