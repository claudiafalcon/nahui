import { useEffect, useState } from 'react';
import styles from './AmbientConfirmation.module.css';

/** The one lifetime every ambient confirmation in this codebase shares. */
export const AMBIENT_CONFIRMATION_MS = 2400;

/**
 * **`inventory.md`'s ambient confirmation line — one implementation, because
 * the spec binds every instance of it to be identical.**
 *
 * §3.12 ("Mercancía registrada ✓"), §3.13 ("Mercancía lista para vender ✓"),
 * §3.13a ("Terminaste de etiquetar Camisas ✓"), §3.4c's ordinary one-line
 * case ("Código de barras actualizado ✓"), §3.19c ("Código de barras quitado
 * ✓") and §3.4b's "Foto guardada ✓" are all the same shape: **ambient,
 * fading, no tap to dismiss, never a separate screen requiring a tap.**
 *
 * They are also a property of the **destination**, not of Catalog view
 * specifically (§3.12/§3.13/§3.13a's own 2026-09-19 "return to origin"
 * correction): a confirmation renders on whichever screen the operation
 * actually returned to, §3.4 or §3.19, **"with identical copy and identical
 * shape on both."** Two components each holding their own copy of a
 * prop→state→timeout pair is exactly how "identical forever" drifts — the
 * first build already drifted, with Catalog view fading at 2400ms and the
 * Product Page never fading at all — so the pair lives here, once, and both
 * screens render this.
 *
 * **`token` is what makes a second, identical confirmation visible.** The
 * screen it lands on is not remounted between two saves of the same Product
 * (`ScreenTransition`'s key is stable per Product), and the copy of a second
 * save is byte-identical to the first, so a message-only effect would never
 * re-fire and the write would land with **no visible confirmation at all** —
 * on a screen whose confirmation is the only evidence it landed. The caller
 * mints a fresh token per delivered confirmation; an identical string with a
 * new token restarts the line and its timer.
 *
 * The message arrives **complete, including its own "✓"** — composed at the
 * single site that owns that copy (`InventoryScreen`'s `confirmationCopy`,
 * or the screen's own local write handler), never half here and half there.
 */
export function AmbientConfirmation({
  message,
  detail,
  token,
}: {
  message?: string | null;
  /** §3.13's mixed-Lot second line (`decision-log.md` D71) — an optional
   * quieter line beneath the message, on the same fade lifecycle, never
   * rendered without one. */
  detail?: string | null;
  token?: string | number | null;
}) {
  // Initialized from props rather than left empty until the effect runs, so a
  // confirmation that is already present on first paint never flickers in.
  const [shown, setShown] = useState<{ message: string; detail: string | null } | null>(() =>
    message ? { message, detail: detail ?? null } : null,
  );

  useEffect(() => {
    if (!message) {
      setShown(null);
      return;
    }
    setShown({ message, detail: detail ?? null });
    const t = window.setTimeout(() => setShown(null), AMBIENT_CONFIRMATION_MS);
    return () => window.clearTimeout(t);
  }, [message, detail, token]);

  if (!shown) return null;
  return (
    <>
      <p className={styles.line}>{shown.message}</p>
      {shown.detail && <p className={styles.detail}>{shown.detail}</p>}
    </>
  );
}
