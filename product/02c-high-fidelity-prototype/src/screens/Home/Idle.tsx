import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import styles from './Idle.module.css';
import sheetStyles from '../../components/SessionHeader/SessionHeader.module.css';

/** home.md §3.4 — idle, ready to sell, no Session open yet. Same two
 * elements the approved spec calls for (greeting question, the primary CTA)
 * — composition below is a High-Fidelity revision: an asymmetric layout
 * anchored by an oversized, softly-tinted BrandMark watermark instead of a
 * perfectly centered stack floating in empty space. Reuses Nahui's own mark
 * at a different scale (already established in ColdStart) rather than
 * inventing a new decorative device for this screen alone.
 *
 * CTA copy: "Iniciar Venta Rápida," not the approved spec's own "Iniciar
 * Sesión Rápida" — a Demo Polish-pass naming decision, see README "Naming —
 * Venta rápida (2026-08-13)."
 *
 * §3.6a Not Ready — the demo Onboarding path is the only path in this build
 * that can ever set `defaultSellingMode = 'nfc'` (onboarding.md §2.2), and
 * NFCTag assignment ("Asignar Tags," inventory.md §3.14) isn't modeled at
 * all in this build (disclosed in README.md) — so NFC Readiness always
 * evaluates Not Ready whenever that's true, never Ready or Limited Ready.
 * "Asignar tags" is a visible but stubbed/no-op link (routes to an honest
 * Placeholder, the same "never hidden" treatment already given to
 * Eventos/Resultados/Configuración) rather than a broken tap. */
export function Idle({
  defaultSellingMode,
  onStartSession,
  onOpenSettingsPlaceholder,
  onOpenAssignTagsPlaceholder,
}: {
  defaultSellingMode: 'buttons' | 'nfc';
  onStartSession: () => void;
  onOpenSettingsPlaceholder: () => void;
  onOpenAssignTagsPlaceholder: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const notReady = defaultSellingMode === 'nfc';

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button className={styles.menuBtn} onClick={() => setMenuOpen((open) => !open)} aria-label="Controles">
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
            Iniciar Venta Rápida
          </Button>
          {notReady && (
            <div className={styles.readinessNote}>
              <p className={styles.readinessLine}>
                Todavía no tienes prendas con tag para hoy — vas a vender con botones.
              </p>
              <button className={styles.readinessLink} onClick={onOpenAssignTagsPlaceholder}>
                Asignar tags
              </button>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <Sheet onDismiss={() => setMenuOpen(false)}>
          <button
            className={`${sheetStyles.sheetRow} stitchBottom`}
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
