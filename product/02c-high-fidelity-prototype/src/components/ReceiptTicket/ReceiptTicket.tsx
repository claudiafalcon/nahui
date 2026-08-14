import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { pesos } from '../../domain/format';
import styles from './ReceiptTicket.module.css';

const AUTO_RETURN_MS = 25_000; // "generous, fixed... tens of seconds" — home.md §3.8f
const COUNT_UP_MS = 620;

/**
 * home.md §3.8f — Finalizar Venta success, receipt moment. Renders the
 * Free-tier variant (three elements: confirmation, total, business
 * identity) for every Business, and, as of the Paid Receipt Claim Token/QR
 * pass (`BACKLOG.md` D.3), a fourth element — a real, scannable Claim Token
 * QR + caption — whenever this specific `Receipt` was captured at
 * finalization time with `subscriptionTier === 'paid'` (D40; never a live
 * re-read of `Business.subscriptionTier`, per D33's write-time-capture
 * precedent — see `store.tsx`'s `finalizeSale`). A Free-tier receipt (or a
 * Paid-tier one somehow missing its token) renders exactly the original
 * three-element variant, unchanged.
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
  subscriptionTier,
  claimToken,
  onExit,
}: {
  total: number;
  businessName: string;
  businessLogo?: string;
  /** §3.8f's own tier gate — captured on the `Receipt` at finalization time,
   * never re-derived live. */
  subscriptionTier: 'free' | 'paid';
  /** Present only when `subscriptionTier === 'paid'` (`store.tsx`'s
   * `finalizeSale`) — structurally absent for Free tier, not merely hidden. */
  claimToken?: string;
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

        {/* Paid tier only (`decision-log.md` D22/D40, `home.md` §3.8f) — a
            real, scannable Claim Token QR, not a decorative placeholder. It
            encodes `https://loyalty.nahui.app/c/<claimToken>` — the
            destination, `product/02-ux-loyalty/customer-loyalty-registration.md`,
            is a separate deploy target (D38), now live at
            `product/02c-loyalty-prototype/`. `claimToken` is currently a
            fixed, disclosed demo value (`store.tsx`'s `Receipt.claimToken`
            assignment, see its own comment) standing in for the real
            cross-app resolution mechanism (D.5, not yet built) — so this
            QR *does* resolve to a real, working registration flow when
            actually scanned, not a mock/dead link. No `onClick`/navigation
            on this element: §3.8f's own `[ ]`
            notation marks it live for the *customer's* separate device, not
            a tap target on Ana's own screen ("Ana's own screen is never
            touched by this interaction"). Building a stub destination
            screen here would mean fabricating part of that separate,
            already-Approved-elsewhere flow — out of this slice's scope. */}
        {subscriptionTier === 'paid' && claimToken && (
          <div className={styles.claimBlock}>
            {/* Fix round, docs/passes/slice-8-paid-receipt-qr.md
                (knowledge-mentor consultation) — was `aria-hidden="true"`.
                The caption right below ("Escanéala...") grammatically
                depends on this QR as its antecedent ("-la"); hiding the QR
                from the accessibility tree left a screen-reader user
                hearing an orphaned pronoun with nothing to refer to. The
                QR is also information-bearing (a real, resolvable URL), not
                pure decoration, so the "decorative, described by nearby
                text" aria-hidden exception doesn't cleanly apply (WCAG SC
                1.1.1). Remedy chosen: give the wrapper its own accessible
                name (`role="img"` + `aria-label`) rather than rewriting the
                caption to drop the pronoun — the caption is copied verbatim
                from `home.md`'s own approved copy, and this layer's own
                mandate is to lay out existing spec copy, not rewrite it. */}
            <div className={styles.claimQr} role="img" aria-label="Código QR para que te recuerden la próxima vez que compres aquí">
              <QRCodeSVG
                value={`https://loyalty.nahui.app/c/${claimToken}`}
                size={132}
                // qrcode.react's fgColor/bgColor render as literal SVG fill
                // attributes, not CSS — can't reference a `var(...)` custom
                // property. Hardcoded to mirror --color-paper/--color-obsidian
                // (tokens.css) exactly, kept in sync by eye, not by reference.
                bgColor="#FFFCF8"
                fgColor="#2D2D2D"
                level="M"
                marginSize={0}
                // The SVG itself is now reachable via the wrapper's own
                // `role="img"`/`aria-label` above — hide the inner SVG
                // itself from the accessibility tree so AT doesn't
                // announce it a second time as an unlabeled nested image.
                aria-hidden="true"
              />
            </div>
            <p className={styles.claimCaption}>
              Escanéala si quieres que te recuerden la próxima vez que compres aquí
            </p>
          </div>
        )}
      </div>

      <button className={styles.exitZone} onClick={onExit} aria-label="Continuar vendiendo" />
    </div>
  );
}
