import { useState } from 'react';
import { Sheet } from '../Sheet/Sheet';
import { pesos, pluralize } from '../../domain/format';
import styles from './SessionHeader.module.css';

/**
 * home.md §3.7 / §3.7b: active-Session header. The approved spec's own copy
 * for this title is "Sesión rápida" — this build renders "Venta rápida"
 * instead, a Demo Polish-pass naming decision (not a spec authoring change;
 * `product/02-ux/home.md` itself is untouched and still reads "Sesión
 * rápida," since only `ui-designer` owns this prototype's files). Reasoning:
 * Ana is starting a selling workflow, not a login session — "sesión" reads
 * as a technical/account term where "venta" is her own working vocabulary.
 * Kept identical to Idle's "Iniciar Venta Rápida" on purpose — the approved
 * spec's own §3.7b amendment explicitly reuses one term across the CTA and
 * this header ("the same term §3.4's 'Iniciar Sesión Rápida' already
 * established"); diverging the header's wording from the CTA's would
 * reintroduce exactly the cross-screen inconsistency that amendment closed.
 * See README "Naming — Venta rápida (2026-08-13)" for the full rationale,
 * including the flagged terminology-density note (this label now sits
 * directly above "Venta actual" and "N ventas" in the same header).
 *
 * "Cerrar sesión" → "Cerrar jornada de venta" (Terminology Review pass,
 * 2026-08-13). The approved spec's own copy for this menu item is "Cerrar
 * sesión" (home.md §3.7a/§3.11a/§3.12) — this build renders "Cerrar jornada
 * de venta" instead. Same disclosure discipline as the header title above:
 * a prototype-only naming decision, not a spec authoring change. See README
 * "Naming — Cerrar jornada de venta (2026-08-13)" for the full rationale.
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
          <span className={styles.title}>Venta rápida</span>
          <span className={styles.stat}>
            Hoy: <strong>{pesos(revenue)}</strong> · {count} {pluralize(count, 'venta', 'ventas')}
          </span>
        </div>
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Controles de venta"
        >
          ⋯
        </button>
      </header>

      {menuOpen && (
        <Sheet onDismiss={() => setMenuOpen(false)}>
          <button
            className={`${styles.sheetRow} ${styles.destructive} stitchBottom`}
            onClick={() => {
              setMenuOpen(false);
              onCloseSession();
            }}
          >
            Cerrar jornada de venta
          </button>
          <button
            className={`${styles.sheetRow} stitchBottom`}
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
