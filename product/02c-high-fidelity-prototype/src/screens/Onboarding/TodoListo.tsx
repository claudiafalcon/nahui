import { useEffect } from 'react';
import type { OnboardingPath } from '../../domain/store';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from './TodoListo.module.css';

const AUTO_CONTINUE_MS = 2600;

const COPY: Record<OnboardingPath, string> = {
  free: 'Ya puedes registrar lo que traes y empezar a vender.',
  paid: 'Ya puedes vender con botones. Si quieres vender con tags, cámbialo en Configuración: de ahí te llevamos a etiquetar tu mercancía, o a registrarla primero si aún no tienes.',
  demo: 'Esto es un ejemplo de cómo se ve tu negocio en Nahui. Explora lo que quieras — no es información real.',
};

/**
 * onboarding.md §3.6 — Todo listo. The one deliberate moment of ceremony in
 * an otherwise frictionless flow (§3.6's own reasoning) — auto-continues
 * after a couple of seconds if left untouched, but tappable immediately.
 * No back arrow (capabilities already exist by this point, nothing to
 * undo).
 */
export function TodoListo({ path, onEnter }: { path: OnboardingPath; onEnter: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onEnter, AUTO_CONTINUE_MS);
    return () => window.clearTimeout(t);
  }, [onEnter]);

  return (
    <div className={styles.wrap}>
      <div className={styles.mark}>
        <BrandMark />
      </div>
      <div className={styles.copy}>
        <h1 className={styles.eyebrow}>Todo listo</h1>
        <p className={styles.body}>{COPY[path]}</p>
      </div>
      <Button className={styles.cta} onClick={onEnter}>
        Entrar
      </Button>
    </div>
  );
}
