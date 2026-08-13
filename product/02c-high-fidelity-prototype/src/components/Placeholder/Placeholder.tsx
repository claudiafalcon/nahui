import { Button } from '../Button/Button';
import styles from './Placeholder.module.css';

/**
 * Honest "not part of this slice" state — used for Eventos, Resultados, and
 * Configuración, none of which this vertical slice builds (see the task's
 * own scope: Home → Inventario → Registrar mercancía → Selling → Digital
 * receipt only). The frozen four-tab nav (information-architecture.md) and
 * the session-controls "⋯" affordance (D13) both still render and stay
 * reachable — nothing here is silently hidden, it's honestly labeled
 * instead, the same discipline the approved specs apply to every other
 * not-yet-built state.
 */
export function Placeholder({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.body}>Esta sección no está incluida en este prototipo — la vista completa cubre Hoy, Inventario, registrar mercancía, vender y el recibo.</p>
      {onBack && (
        <Button className={styles.back} variant="secondary" onClick={onBack} inline>
          ← Volver a Hoy
        </Button>
      )}
    </div>
  );
}
