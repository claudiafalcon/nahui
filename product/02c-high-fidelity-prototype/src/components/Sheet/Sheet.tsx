import type { ReactNode } from 'react';
import styles from './Sheet.module.css';

/**
 * Reused across every dimmed-backdrop confirm/action sheet in the approved
 * specs (Cancelar venta actual, Cerrar sesión, Descartar, session controls) —
 * one component, per home.md/inventory.md's own "no new sheet/modal pattern
 * invented for this" discipline.
 */
export function Sheet({ onDismiss, children }: { onDismiss?: () => void; children: ReactNode }) {
  return (
    <div className={styles.backdrop} onClick={onDismiss}>
      <div
        className={`${styles.panel} grain tearTop`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <span className={styles.handle} aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
