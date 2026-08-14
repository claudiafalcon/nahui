import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { Sheet } from '../../components/Sheet/Sheet';
import styles from './ColdStart.module.css';
import sheetStyles from '../../components/SessionHeader/SessionHeader.module.css';

/**
 * home.md §3.3 — reached whenever zero `available` InventoryUnits exist.
 *
 * **"⋯" entry point (settings.md §2.1/§3.3, Gap Analysis finding — this
 * state had no entry point at all before this pass).** §2.1 is explicit
 * that Configuración's trigger is deliberately absent from exactly four
 * Home states (§3.1/§3.2/§3.12/§3.14) — cold start is not one of them, so
 * it gets the identical "⋯" + one-row Sheet pattern `Idle.tsx`/
 * `EventResume.tsx` already established, reusing `SessionHeader.module.css`'s
 * own `.sheetRow` styling rather than a fourth hand-rolled copy. No "Cerrar
 * jornada de venta" row — there is no open Session to close, same as those
 * two screens' own idle-state sheets.
 */
export function ColdStart({ onRegister, onOpenSettings }: { onRegister: () => void; onOpenSettings: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button className={styles.menuBtn} onClick={() => setMenuOpen((open) => !open)} aria-label="Controles">
          ⋯
        </button>
      </div>
      <div className={styles.wrap}>
        <div className={styles.mark}>
          <BrandMark />
        </div>
        <div className={styles.copy}>
          <h1 className={styles.eyebrow}>Nahui</h1>
          <p className={styles.body}>
            Aquí vas a ver tu día de venta en cuanto registres lo que traes.
          </p>
        </div>
        <Button className={styles.cta} onClick={onRegister}>
          Registrar mercancía
        </Button>
      </div>

      {menuOpen && (
        <Sheet onDismiss={() => setMenuOpen(false)}>
          <button
            className={`${sheetStyles.sheetRow} stitchBottom`}
            onClick={() => {
              setMenuOpen(false);
              onOpenSettings();
            }}
          >
            ⚙ Configuración
          </button>
        </Sheet>
      )}
    </>
  );
}
