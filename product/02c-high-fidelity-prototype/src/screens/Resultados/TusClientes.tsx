import styles from './Resultados.module.css';

/**
 * reports.md §3.13 — "Tus clientes," zero-Claims empty state, rendered
 * unconditionally (per the dispatching task's own explicit scope
 * boundary — Gap Analysis finding): `Customer`/`Claim` don't exist anywhere
 * in this build's domain layer, so a paid Business is *always* the
 * zero-Claims case, never the populated one (`decision-log.md` D40's own
 * "any paid merchant with zero Claims recorded yet... sees the same
 * naturally-empty, tappable state, with no special-casing by reason").
 * §3.12's populated segmentation view, and Recompensas' whole populated
 * flow (§3.15-§3.18) that hangs off it, are structurally unreachable here —
 * explicitly out of scope for this slice per the dispatching task, honestly
 * disclosed here and in README.md rather than stubbed silently.
 */
export function TusClientes({ onBack }: { onBack: () => void }) {
  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Resultados
        </button>
      </div>

      <div className={styles.scroll}>
        <h1 className={styles.title}>Tus clientes</h1>

        <p className={styles.emptyBody}>
          Todavía no tienes compras registradas con seguimiento de clientas. En cuanto tus clientas empiecen a reclamar
          sus compras, vas a ver aquí cuántas son tus clientas frecuentes y cuántas ocasionales.
        </p>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Recompensas</p>
          <p className={styles.emptyBody}>Todavía no tienes clientas con seguimiento para mostrar aquí.</p>
        </div>
      </div>
    </>
  );
}
