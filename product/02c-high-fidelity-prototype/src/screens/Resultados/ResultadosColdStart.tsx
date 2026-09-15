import { useStore } from '../../domain/store';
import { activeSessionsForBusiness } from '../../domain/selectors';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import type { ID } from '../../domain/types';
import { VendiendoAhorita } from './VendiendoAhorita';
import styles from '../Home/ColdStart.module.css';
import resultadosStyles from './Resultados.module.css';

/**
 * reports.md §3.3 — cold start, reached whenever `hasAnyClosedSession` is
 * false. Two variants, selected by §2's own live-session check
 * (`decision-log.md` D68) — independent of the closed-Session gate that
 * routes here at all, not sequential to it.
 *
 * **Variant A — no Session active right now (the ordinary case).** Same
 * centered-copy shape as Home's/Inventario's/Eventos' own cold starts
 * (`ColdStart.module.css`, reused verbatim rather than a fifth hand-rolled
 * copy) — routes to Hoy, an existing tab, never a second selling mechanism
 * inside this tab (§1's own explicit rule).
 *
 * **Variant B — a Session is active right now, including her very first
 * one, not yet closed.** Composed to fix a direct, in-the-moment
 * contradiction Variant A would otherwise create: asserting "en cuanto
 * cierres tu primera sesión de venta" / "[ Empezar a vender ]" is false the
 * moment "Vendiendo ahorita" is rendering directly above, showing her
 * actively selling right now. Body copy drops the "tu primera sesión de
 * venta" framing ("en cuanto cierres" instead) and the CTA is dropped
 * entirely, not reworded — nothing to route her to that she isn't already
 * doing. Rendered inside the same topbar+scroll shape `ResultadosMain.tsx`
 * uses (not the centered `.wrap` empty-state shape Variant A keeps) — this
 * variant has real, dynamic content (one or more live cards) that needs a
 * scrollable list container, not a single centered block.
 */
export function ResultadosColdStart({
  onNavigateToHoy,
  onTapLiveSession,
}: {
  onNavigateToHoy: () => void;
  onTapLiveSession: (sessionId: ID) => void;
}) {
  const { state } = useStore();
  const liveNow = activeSessionsForBusiness(state).length > 0;

  if (liveNow) {
    return (
      <>
        <div className={resultadosStyles.topbar}>
          <span className={resultadosStyles.wordmark}>Resultados</span>
        </div>
        <div className={resultadosStyles.scroll}>
          <VendiendoAhorita onTapSession={onTapLiveSession} />
          {/* Both variants still express "nothing to review yet" — seeing a
              live Session in progress and having no closed history to look
              back on aren't contradictory; one is about right now, the
              other about history that hasn't been written yet (§3.3's own
              annotation). */}
          <p className={resultadosStyles.emptyNote}>En cuanto cierres, aquí vas a ver cómo te fue.</p>
        </div>
      </>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Resultados</h1>
        <p className={styles.body}>
          Aquí vas a ver cómo te fue, en cuanto cierres tu primera sesión de venta.
        </p>
      </div>
      <Button className={styles.cta} onClick={onNavigateToHoy}>
        Empezar a vender
      </Button>
    </div>
  );
}
