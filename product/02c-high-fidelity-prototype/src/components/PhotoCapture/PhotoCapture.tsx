import { useEffect, useRef, useState } from 'react';
import styles from './PhotoCapture.module.css';

/**
 * Live-found (2026-09-15, Product Owner testing on a real Android 14/15
 * device): a plain `<input type="file" capture="environment">` no longer
 * reliably launches the camera on current Chrome for Android — Chrome opens
 * the system photo picker instead, with no camera option offered at all,
 * a documented platform regression, not something an `accept`/`capture`
 * hint can force around (two attribute-only attempts confirmed this live).
 * This component sidesteps the OS picker entirely by holding the camera
 * stream directly, the same `getUserMedia` mechanism `BarcodeScanner.tsx`
 * already established as this codebase's one real camera-access surface —
 * this is a still-capture sibling of that component, not a variant of it
 * (continuous decode vs. a single shutter tap are different enough
 * lifecycles to stay separate rather than share one component with modes).
 *
 * `position: fixed` (not `BarcodeScanner`'s `absolute` + `.main`-ancestor
 * trick) — deliberately, since this is opened from genuinely different
 * contexts (a `Sheet` in `CatalogView.tsx`, plain onboarding screens in
 * `BusinessIdentity.tsx`/`SellingGroups.tsx`), none of which share a common
 * positioned ancestor the way `BarcodeScanner`'s two call sites do.
 */
export function PhotoCapture({
  onCapture,
  onCancel,
  onUnavailable,
}: {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
  /** No camera API, permission denied, no camera present, or a non-secure
   * context — folded into one outcome, same posture `BarcodeScanner`'s own
   * `onPermissionDenied` already takes, since this build defines no
   * separate "camera unsupported" state either. The caller falls back to
   * its existing file-picker flow. */
  onUnavailable: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!navigator.mediaDevices?.getUserMedia) {
      onUnavailable();
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) onUnavailable();
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one camera
    // session for this mount's lifetime, same convention as BarcodeScanner.
  }, []);

  function handleShutter() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL('image/jpeg', 0.85));
  }

  return (
    <div className={`${styles.screen} ${ready ? styles.screenReady : ''}`}>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onCancel}>
          ← Cancelar
        </button>
      </div>
      <div className={styles.viewfinderWrap}>
        <video ref={videoRef} className={styles.video} muted playsInline autoPlay />
      </div>
      <div className={styles.controls}>
        <button className={styles.shutter} onClick={handleShutter} aria-label="Tomar foto" />
      </div>
    </div>
  );
}
