import { Button } from '../../components/Button/Button';
import { ResolvingState } from '../../components/ResolvingState/ResolvingState';
import styles from './AuthResolving.module.css';

/**
 * Stage 7 Backend Integration — the pre-shell counterpart to `home.md`
 * §3.1/§3.2/§3.14's own "Resolving"/error states, reached from
 * `AppRouter.tsx` whenever this device holds a live session but its own
 * Business hasn't resolved from the backend yet — the exact second-device/
 * cleared-browser gap this whole pass exists to close (see
 * `context/stage-7-backend-integration.md`'s "What this is"). Before this
 * fix, a returning OWNER on a second device would have been routed straight
 * into `OnboardingFlow` (nothing local said otherwise) and could have
 * created a second, spurious Business instead of resuming her real one.
 *
 * **Disclosed, deliberate deviation from `home.md` §3.1/§3.2/§3.14's own
 * wireframes, which all show the four-tab nav bar present.** At this exact
 * moment no tab/role context has resolved yet — there is nothing honest to
 * render a nav bar against. This instead follows the "no header, no bottom
 * nav" precedent this same file already establishes for a comparable
 * pre-shell state (`AccesoRevocado.tsx`/`settings.md` §3.14, cited in
 * `AppRouter.tsx`'s own top-of-file doc comment). Flagged here per this
 * codebase's own terminology-drift discipline (`decision-log.md` D42) —
 * genuinely open, not silently absorbed as settled: a future `ux-designer`
 * pass may prefer a dedicated Approved wireframe for this exact moment
 * instead.
 */
export function AuthResolving({ status, onRetry }: { status: 'loading' | 'error'; onRetry: () => void }) {
  if (status === 'error') {
    return (
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <p className={styles.body}>No pudimos cargar tu negocio. Intenta de nuevo.</p>
        </div>
        <Button className={styles.cta} onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }

  return <ResolvingState />;
}
