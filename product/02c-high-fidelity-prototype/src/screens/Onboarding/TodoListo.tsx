import { useEffect, useState } from 'react';
import type { OnboardingPath } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { WritingState } from './WritingState';
import styles from './TodoListo.module.css';

const AUTO_CONTINUE_MS = 2600;

// Variant A's copy corrected `product-decisions.md` Q20 (2026-09-04): the
// earlier copy ("Ya puedes registrar lo que traes y empezar a vender") told
// her to go register merchandise she'd already just registered, moments
// earlier, in this same flow — accurate before Q20 (when the Selling-Group
// step wrote a Product only, with nothing yet in stock), false once
// Cantidad is captured in the same step. Variant B and Variant C are
// unaffected (onboarding.md §3.6).
const COPY: Record<OnboardingPath, string> = {
  free: 'Ya puedes empezar a vender. Lo que agregaste ya está listo en tu Inventario.',
  paid: 'Ya puedes vender con botones. Si quieres vender con tags, cámbialo en Configuración: de ahí te llevamos a etiquetar tu mercancía, o a registrarla primero si aún no tienes.',
  demo: 'Esto es un ejemplo de cómo se ve tu negocio en Nahui. Explora lo que quieras — no es información real.',
};

/**
 * onboarding.md §3.6 — Todo listo. The one deliberate moment of ceremony in
 * an otherwise frictionless flow (§3.6's own reasoning) — auto-continues
 * after a couple of seconds if left untouched, but tappable immediately.
 * No back arrow (capabilities already exist by this point, nothing to
 * undo).
 *
 * `onEnter` fires the real `acknowledgeOnboarding` RPC (Stage 7 Backend
 * Integration) — a genuine network failure is now possible, unlike the
 * synchronous local mock this screen was originally built against. Same
 * `saving`/error-with-retry shape `BusinessIdentity.tsx`'s own §3.10a
 * treatment already establishes (`WritingState`'s `error`/`errorLabel`/
 * `onRetry`), applied here to both trigger paths (auto-continue and the
 * manual tap) through one shared `handleEnter` — a failed auto-continue
 * attempt surfaces the same retry affordance a failed tap would, rather than
 * leaving her stuck with no visible feedback. §3.7's interruption-resume
 * guarantee is unaffected: this component's own `saveState` is local and
 * transient, but `onboarding.md §2.1`/`OnboardingFlow.tsx` already resume
 * this exact screen from persisted state (`business.onboardingAcknowledged`
 * still `false`) regardless of what this local state was doing when she left.
 */
export function TodoListo({ path, onEnter }: { path: OnboardingPath; onEnter: () => Promise<boolean> }) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');

  async function handleEnter() {
    if (saveState === 'saving') return; // defensive — auto-continue vs. a stray tap racing
    setSaveState('saving');
    const ok = await onEnter();
    if (!ok) setSaveState('error');
    // No reset to 'idle' on success — `OnboardingFlow.tsx` unmounts this
    // screen itself the moment `business.onboardingAcknowledged` flips true.
  }

  useEffect(() => {
    const t = window.setTimeout(() => {
      void handleEnter();
    }, AUTO_CONTINUE_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per
    // mount, matching this screen's own established auto-continue behavior;
    // `handleEnter`'s own guard covers a stray tap racing the timer.
  }, []);

  if (saveState === 'saving') {
    return <WritingState label="Entrando…" />;
  }

  if (saveState === 'error') {
    return (
      <WritingState error errorLabel="No pudimos entrar. Intenta de nuevo." onRetry={handleEnter} />
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Todo listo</h1>
        <p className={styles.body}>{COPY[path]}</p>
      </div>
      <Button className={styles.cta} onClick={handleEnter}>
        Entrar
      </Button>
    </div>
  );
}
