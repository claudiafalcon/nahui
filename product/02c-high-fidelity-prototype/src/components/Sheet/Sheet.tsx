import { useEffect, type ReactNode } from 'react';
import styles from './Sheet.module.css';

/**
 * Reused across every dimmed-backdrop confirm/action sheet in the approved
 * specs (Cancelar venta actual, Cerrar sesión — rendered "Cerrar jornada de
 * venta" in this build, see SessionHeader.tsx — Descartar, session
 * controls) — one component, per home.md/inventory.md's own "no new
 * sheet/modal pattern invented for this" discipline.
 *
 * Escape dismisses (Fix 1, merchant-user-tester finding, 2026-08-13):
 * previously only the backdrop tap called `onDismiss`, so pressing Escape
 * while any Sheet was open did nothing. One shared `keydown` listener here
 * covers every consumer (Cancelar venta actual, Descartar, session
 * controls, Registrar mercancía's product picker, Catalog price-edit) —
 * exactly the point of this being a single shared component.
 */
export function Sheet({ onDismiss, children }: { onDismiss?: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!onDismiss) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss?.();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

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
