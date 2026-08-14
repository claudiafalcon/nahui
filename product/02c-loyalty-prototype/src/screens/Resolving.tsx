import { Card } from '../components/Card/Card';
import { WaitState } from '../components/SkeletonBlock/SkeletonBlock';

/** §3.1/§3.2 — covers the token validity + already-claimed checks
 * together, silently ("technology should disappear," global-principles.md).
 * No business identity shown yet — nothing has resolved far enough to
 * know whose it is. */
export function Resolving() {
  return (
    <Card>
      <WaitState slowLabel="Un momento…" />
    </Card>
  );
}
