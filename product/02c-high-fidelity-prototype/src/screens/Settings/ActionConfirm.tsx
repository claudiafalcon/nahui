import { Button } from '../../components/Button/Button';
import styles from './ConfirmScreen.module.css';

/**
 * settings.md §3.4 (Confirmación de efecto inmediato) / §3.5 (Confirmación
 * de efecto diferido) — one generic component for both templates, since the
 * two differ only in body copy and CTA label, never in shape (§3.5's own
 * text: "generic template — one action"). Shared by all four real actions
 * (Activar plan de pago, Cambiar a vender con tags, Cambiar a vender con
 * botones, Volver al plan gratis) — `SettingsScreen.tsx` supplies each
 * variant's exact copy, this component never invents its own.
 */
export function ActionConfirm({
  title,
  body,
  ctaLabel,
  onConfirm,
  onBack,
}: {
  title: string;
  body: string[];
  ctaLabel: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className={styles.wrap}>
      <button className={styles.back} onClick={onBack}>
        ← Configuración
      </button>
      <h1 className={styles.heading}>{title}</h1>
      {body.map((paragraph, i) => (
        <p key={i} className={styles.body}>
          {paragraph}
        </p>
      ))}
      <div className={styles.spacer} />
      <Button className={styles.cta} onClick={onConfirm}>
        {ctaLabel}
      </Button>
    </div>
  );
}
