import { useEffect, useRef, useState } from 'react';
import { pesos } from '../../domain/format';
import styles from './ReceiptTicket.module.css';

const AUTO_RETURN_MS = 25_000; // "generous, fixed... tens of seconds" — home.md §3.8f
const COUNT_UP_MS = 620;

/**
 * home.md §3.8f — Finalizar Venta success, receipt moment. Free-tier variant
 * only in this slice (three elements: confirmation, total, business
 * identity) — see README.md "Scope decisions" for why subscriptionTier is
 * fixed at 'free' here, which correctly keeps the Claim Token/QR bridge
 * (Paid tier only) out of this slice without contradicting the spec.
 *
 * Pushed further in this revision (self-critique from v1 explicitly named
 * the scallop as "the one place a second design pass would look first"):
 * larger, more legible notches; a matching torn edge at the *bottom* too,
 * so the whole ticket reads as a stub floating between two tears rather
 * than a card with one decorated edge; a slight swing-settle on drop-in
 * instead of a straight vertical slide; and the total counts up rather
 * than appearing instantly — the one moment in the whole product that
 * should feel like something consequential just happened.
 */
export function ReceiptTicket({
  total,
  businessName,
  businessLogo,
  onExit,
}: {
  total: number;
  businessName: string;
  businessLogo?: string;
  onExit: () => void;
}) {
  const [displayTotal, setDisplayTotal] = useState(0);
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const timer = window.setTimeout(onExit, AUTO_RETURN_MS);
    return () => window.clearTimeout(timer);
  }, [onExit]);

  useEffect(() => {
    if (reduceMotion.current) {
      setDisplayTotal(total);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplayTotal(Math.round(total * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Guaranteed settle: requestAnimationFrame can legitimately stop firing
    // (a backgrounded tab, an inactive window, aggressive power-saving on a
    // real device) — this is the exact moment a merchant turns her phone
    // toward a customer, so the total must never be able to get stuck
    // mid-count. A plain timer, independent of rAF scheduling, forces the
    // true value the moment the animation's own duration has elapsed,
    // regardless of how many (or how few) animation frames actually ran.
    const settle = window.setTimeout(() => setDisplayTotal(total), COUNT_UP_MS + 80);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
    };
  }, [total]);

  return (
    <div className={`${styles.screen} grain`}>
      {/* the punched hole + string loop — the explicit "reveal" this pass
          adds: the receipt is not just torn-ticket-*styled*, it's the same
          TagStub shape (hole, string, tilt) the whole system already uses
          at small scale, now at its biggest. Ties the Catalog marker, the
          selling tile's pinned tag, and this full-screen moment into one
          legible, fractal vocabulary. */}
      <div className={styles.loop} aria-hidden="true">
        <span className={styles.hole} />
      </div>

      <div className={styles.body}>
        <div className={styles.confirmation}>Venta finalizada ✓</div>

        <div className={styles.totalBlock}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.total}>{pesos(displayTotal)}</span>
        </div>

        <div className={styles.business}>
          {businessLogo && <img className={styles.businessLogo} src={businessLogo} alt="" />}
          <span className={styles.businessName}>{businessName}</span>
        </div>
      </div>

      <button className={styles.exitZone} onClick={onExit} aria-label="Continuar vendiendo" />
    </div>
  );
}
