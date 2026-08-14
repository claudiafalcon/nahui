import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import shared from './shared.module.css';

/**
 * §3.12 — No pudimos cargar. Step 1-2's own resolution failing outright
 * (connectivity/server unreachable) before the token's validity is even
 * known — a passive, retry-only load state with nothing entered and
 * nothing at risk, so it stays plain-toned rather than Error red
 * (brand-guide.md's Error-usage distinction — reserved for a write/save
 * failure with real data at risk, which this isn't). No business identity
 * shown — nothing resolved far enough to know whose it is.
 */
export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <div className={shared.stack}>
        <p className={shared.body}>No pudimos cargar esto.</p>
      </div>
      <Button variant="primary" onClick={onRetry}>
        Reintentar
      </Button>
    </Card>
  );
}
