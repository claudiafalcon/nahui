import { useState } from 'react';
import { Sheet } from '../Sheet/Sheet';
import { pesos, pluralize } from '../../domain/format';
import styles from './SessionHeader.module.css';

/**
 * home.md §3.7 / §3.7b: active-Session header. Title always reads "Sesión
 * rápida" in this slice — every Session here is a Quick Session (eventId
 * null), since Eventos is out of this slice's scope. The "⋯" opens the
 * session-controls sheet (§3.7a): "Cerrar sesión" (built) and
 * "Configuración" (not built in this slice — routes to an honest
 * placeholder rather than being silently removed from the shell, since the
 * affordance itself is frozen IA, D13).
 */
export function SessionHeader({
  revenue,
  count,
  onCloseSession,
  onOpenSettingsPlaceholder,
}: {
  revenue: number;
  count: number;
  onCloseSession: () => void;
  onOpenSettingsPlaceholder: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.text}>
          <span className={styles.title}>Sesión rápida</span>
          <span className={styles.stat}>
            Hoy: <strong>{pesos(revenue)}</strong> · {count} {pluralize(count, 'venta', 'ventas')}
          </span>
        </div>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(true)} aria-label="Controles de sesión">
          ⋯
        </button>
      </header>

      {menuOpen && (
        <Sheet onDismiss={() => setMenuOpen(false)}>
          <button
            className={`${styles.sheetRow} ${styles.destructive}`}
            onClick={() => {
              setMenuOpen(false);
              onCloseSession();
            }}
          >
            Cerrar sesión
          </button>
          <button
            className={styles.sheetRow}
            onClick={() => {
              setMenuOpen(false);
              onOpenSettingsPlaceholder();
            }}
          >
            ⚙ Configuración
          </button>
        </Sheet>
      )}
    </>
  );
}
