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
 * "Cerrar sesión" → "Cerrar jornada de venta": this was a real prototype/
 * spec divergence through 2026-08-12, but it closed 2026-08-13 — the
 * Product Owner's own naming decision that day (`home.md`'s "Selling-
 * Session-close action renamed from 'Cerrar sesión' to 'Cerrar jornada de
 * venta'") formalized this build's already-live copy into the approved
 * spec itself. `home.md` §3.11/§3.11a/§3.12 now read "Cerrar jornada de
 * venta" too — this build needed no code change for that pass, only the
 * spec catching up to what was already running here. See
 * `docs/passes/slice-1-home-inventario.md` for the full account (its
 * 2026-08-14 fix-round entry, specifically — the pointer this comment used
 * to carry, "See README 'Naming — Cerrar jornada de venta (2026-08-13)'",
 * no longer resolves to anything since the pass history moved into
 * `docs/passes/`; corrected here since this comment block was already being
 * touched for the naming-status fix above).
 *
 * `eventId`-aware title (Eventos pass, D43, `home.md` §3.7b): a Quick
 * Session (no `title` prop) keeps "Venta rápida"; an Event-linked Session
 * passes `title="{Venue.displayName} · Día N"` (`events.md` §3.14's own
 * header convention, e.g. "Plaza Norte · Día 2") — same slot, same
 * treatment, only the content differs.
 *
 * **§3.7 amendment, 2026-08-14 (Product Owner-raised — "Cerrar jornada de
 * venta" discoverability; `home.md` §2/§3.7/§10, `settings.md` §2.1):** for
 * this active-Session state only, the shared "⋯" overflow icon and its
 * two-row sheet (formerly §3.7a, now retired for this state) are replaced by
 * two independent, always-visible, directly-tappable affordances — a gear
 * icon ("⚙", title row) that calls `onOpenSettings` straight into
 * Configuración with no intermediate sheet, and a labeled
 * `Cerrar jornada de venta` button (stat row) that calls `onCloseSession`
 * straight into the existing close-session confirmation/interlock
 * (`home.md` §3.11/§3.11a — that interlock logic is completely unchanged,
 * only its trigger moved). No `Sheet`/menu-open state is needed here
 * anymore — this is the one Home-header shape that no longer represents a
 * choice between two destinations, so the "⋯"/sheet affordance doesn't
 * describe it. The non-Session Home states (`home.md` §3.3–§3.6/§3.6a/§3.6c)
 * keep the "⋯" → sheet shape unchanged (now holding only "Configuración")
 * — that's a different component (`ColdStart.tsx`/`Idle.tsx`/
 * `EventResume.tsx`, all still importing `Sheet` directly), not this one;
 * see `home.md` §2's "deliberate divergence" reasoning for why the two
 * states diverge.
 */
export function SessionHeader({
  revenue,
  count,
  title,
  onCloseSession,
  onOpenSettings,
}: {
  revenue: number;
  count: number;
  title?: string;
  onCloseSession: () => void;
  onOpenSettings: () => void;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <span className={styles.title}>{title ?? 'Venta rápida'}</span>
        <button className={styles.gearBtn} onClick={onOpenSettings} aria-label="Configuración">
          ⚙
        </button>
      </div>
      <div className={styles.statRow}>
        <span className={styles.stat}>
          Hoy: <strong>{pesos(revenue)}</strong> · {count} {pluralize(count, 'venta', 'ventas')}
        </span>
        <button className={styles.closeSessionBtn} onClick={onCloseSession}>
          Cerrar jornada de venta
        </button>
      </div>
    </header>
  );
}
