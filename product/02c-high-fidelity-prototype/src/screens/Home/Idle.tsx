import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from './Idle.module.css';
import sheetStyles from '../../components/SessionHeader/SessionHeader.module.css';

/** home.md §3.4 — idle, ready to sell, no Session open yet. Same two
 * elements the approved spec calls for (greeting question, "Iniciar Sesión
 * Rápida") — composition below is a High-Fidelity revision: an asymmetric
 * layout anchored by an oversized, softly-tinted BrandMark watermark
 * instead of a perfectly centered stack floating in empty space. Reuses
 * Nahui's own mark at a different scale (already established in ColdStart)
 * rather than inventing a new decorative device for this screen alone. */
export function Idle({
  onStartSession,
  onOpenSettingsPlaceholder,
}: {
  onStartSession: () => void;
  onOpenSettingsPlaceholder: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(true)} aria-label="Controles">
          ⋯
        </button>
      </div>
      <div className={styles.wrap}>
        <div className={styles.watermark} aria-hidden="true">
          <BrandMark size={340} color="var(--color-blush)" />
        </div>
        <div className={styles.content}>
          <h1 className={styles.question}>¿Vas a vender hoy?</h1>
          <Button className={styles.cta} onClick={onStartSession}>
            Iniciar Sesión Rápida
          </Button>
        </div>
      </div>

      {menuOpen && (
        <Sheet onDismiss={() => setMenuOpen(false)}>
          <button
            className={sheetStyles.sheetRow}
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
