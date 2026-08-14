import { BusinessBadge } from '../components/BusinessBadge/BusinessBadge';
import { Card } from '../components/Card/Card';
import { PoweredByFooter } from '../components/PoweredByFooter/PoweredByFooter';
import shared from './shared.module.css';

/**
 * §3.10 — Registro exitoso, primera vez. No item names, counts, or prices
 * — nothing from the resolved Sale/SaleItem set is rendered (§0's explicit
 * constraint). No numeric progress toward a reward — named as an open
 * Product Decision (§8 item 3), deliberately not designed/built here.
 */
export function SuccessNew({ businessName, businessLogo }: { businessName: string; businessLogo?: string }) {
  return (
    <Card>
      <BusinessBadge name={businessName} logo={businessLogo} />
      <div className={shared.stack}>
        <h1 className={shared.big}>¡Listo!</h1>
        <p className={shared.body}>
          Ya quedaste registrada con {businessName}. La próxima vez que compres aquí, te va a reconocer.
        </p>
      </div>
      <PoweredByFooter />
    </Card>
  );
}
