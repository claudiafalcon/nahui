import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import styles from './AccesoRevocado.module.css';

/**
 * settings.md §3.14 — "Acceso revocado," reached only from `home.md` §2's
 * own step 0 (`App.tsx`'s top-level resolution, before the tab shell/nav
 * bar ever mount) — never navigated into from within Configuración, and
 * nothing in this document or its siblings links here. No header gear icon,
 * no bottom nav, no back arrow — the one state in the whole product where
 * offering navigation elsewhere is correctly withheld, per the spec's own
 * reasoning (every other destination reads Business-scoped data this
 * Membership has no standing reason to browse).
 *
 * "Entendido" (`brand-guardian` finding, remediated in the approved spec —
 * the original draft had zero tappable affordance, a true dead end).
 *
 * **Fixed 2026-09-07 (Slice 12 `merchant-user-tester` defect + Main's own
 * direct browser confirmation):** the previous build's tap handler called
 * only a best-effort `window.close()` and nothing else. On a real merchant's
 * own tab (one she opened herself, not one this script opened), browsers
 * silently no-op that call — the doc comment this replaced was honest about
 * *why*, but the actual felt result was zero visible change on tap, which a
 * real merchant experiences identically to a broken, unresponsive button —
 * exactly the "zero tappable affordance" dead-end this Button was already
 * built to fix. `settings.md` §3.14 itself needs a small amendment (flagged
 * back to Main, not performed here — this file holds no Write access to
 * `product/02-ux/`) correcting its "closes/exits the app" framing, which
 * read as a literal guarantee; the felt requirement underneath it — an
 * honest way to end the moment, never a mid-air non-response — still holds
 * and is what this fix actually delivers.
 *
 * The tap still best-effort attempts `window.close()` (harmless, and the
 * rare case where it *does* succeed — e.g. a tab this install itself
 * opened — is still the cleanest outcome). But the visible feedback never
 * depends on that succeeding: on every tap, unconditionally, the button
 * disables and relabels to confirm the tap registered, and an honest
 * acknowledgment line appears telling her plainly what to do next. This is
 * deliberately *not* the same mechanic as
 * `src/screens/Inventory/CatalogView.tsx`'s `.confirmation` toast — that one
 * is a self-dismissing (~2.4s) ambient banner, unrelated to any button-
 * disable state. This screen is a true terminal, one-time state with no
 * navigation elsewhere to return to, so a permanent, non-dismissing
 * acknowledgment is the right call here — an auto-dismiss would remove the
 * message before she can act on it. If `window.close()` does succeed, this
 * state is simply never seen.
 */
export function AccesoRevocado() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className={styles.wrap}>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Nahui</h1>
        <p className={styles.body}>Ya no tienes acceso para vender en este negocio.</p>
        <p className={styles.body}>Si crees que esto es un error, habla con quien te invitó.</p>
      </div>
      <Button
        className={styles.cta}
        aria-disabled={acknowledged}
        onClick={() => {
          // Guarded no-op once acknowledged, in place of the native
          // `disabled` attribute — `ux-critic` MIN-1 (2026-09-07): setting
          // `disabled` on the just-tapped button blurs it the instant state
          // updates (focus falls back to `document.body`) in most browsers,
          // a real regression on a screen with exactly one interactive
          // element and no other navigation to receive focus instead.
          // `aria-disabled` plus this guard keeps the button focusable and
          // announced as disabled, without ever dropping focus off it.
          if (acknowledged) return;
          try {
            window.close();
          } catch {
            // best-effort — see this component's own doc comment
          }
          setAcknowledged(true);
        }}
      >
        {acknowledged ? 'Entendido ✓' : 'Entendido'}
      </Button>
      {acknowledged && (
        <p className={styles.note} role="status">
          Ya puedes cerrar esta pestaña.
        </p>
      )}
    </div>
  );
}
