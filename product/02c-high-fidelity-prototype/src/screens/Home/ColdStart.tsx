import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import type { MembershipRole } from '../../domain/types';
import styles from './ColdStart.module.css';

/**
 * home.md §3.3 — reached whenever zero `available` InventoryUnits exist.
 *
 * **Direct gear (⚙) entry point (settings.md §2.1/§3.3; amended 2026-08-15 —
 * see home.md's own status header/§2/§3.6c).** §2.1 is explicit that
 * Configuración's trigger is deliberately absent from exactly four Home
 * states (§3.1/§3.2/§3.12/§3.14) — cold start is not one of them. This
 * state previously used a "⋯" icon opening a one-row Sheet
 * ("⚙ Configuración" only); as of 2026-08-15 that intermediate sheet is
 * retired everywhere it held only a single item, the same reasoning that
 * already retired the active-Session sheet a day earlier (SessionHeader.tsx).
 * The gear icon now calls `onOpenAccountSurface` directly — no `Sheet`, no
 * `menuOpen` state — the identical shape SessionHeader.tsx already
 * established for the active-Session header. No "Cerrar jornada de venta"
 * affordance here — there is no open Session to close.
 *
 * **SELLER variant (Slice 12, `home.md` §3.3, `product-decisions.md`
 * Q24/Q25).** No "[ Registrar mercancía ]" CTA — she cannot reach
 * Inventario (§3.16) — the honest next step is stated in the copy itself
 * ("pídele a quien te invitó"), never a button leading nowhere. Header icon
 * is role-scoped (§3.15) — `headerIcon`/`onOpenAccountSurface` route to
 * "Tu cuenta" (§3.15a) for a SELLER, unchanged full Configuración for an
 * OWNER.
 */
export function ColdStart({
  role,
  headerIcon,
  onRegister,
  onOpenAccountSurface,
}: {
  role: MembershipRole;
  headerIcon: '⚙' | '⊚';
  onRegister: () => void;
  onOpenAccountSurface: () => void;
}) {
  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button
          className={styles.gearBtn}
          onClick={onOpenAccountSurface}
          aria-label={role === 'OWNER' ? 'Configuración' : 'Tu cuenta'}
        >
          {headerIcon}
        </button>
      </div>
      <div className={styles.wrap}>
        <div className={styles.mark}>
          <BrandMark />
        </div>
        {role === 'OWNER' ? (
          <>
            <div className={styles.copy}>
              <h1 className={styles.eyebrow}>Nahui</h1>
              <p className={styles.body}>Aquí vas a ver tu día de venta en cuanto registres lo que traes.</p>
            </div>
            <Button className={styles.cta} onClick={onRegister}>
              Registrar mercancía
            </Button>
          </>
        ) : (
          <div className={styles.copy}>
            <h1 className={styles.eyebrow}>Nahui</h1>
            <p className={styles.body}>Todavía no hay nada para vender. Pídele a quien te invitó que registre mercancía.</p>
          </div>
        )}
      </div>
    </>
  );
}
