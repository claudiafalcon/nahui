import { Card } from '../components/Card/Card';
import { WaitState } from '../components/SkeletonBlock/SkeletonBlock';

/**
 * §3.7/§3.8 — Guardando…, one shared write state reached from either of
 * two trigger points: §2 step 3's combined lookup+write (existing
 * Customer found), or §2 step 5's write after "Listo" (new Customer).
 * Visually and textually identical either way, per the spec's own note
 * — "from her side it's the same wait."
 */
export function Saving() {
  return (
    <Card>
      <WaitState slowLabel="Guardando…" />
    </Card>
  );
}
