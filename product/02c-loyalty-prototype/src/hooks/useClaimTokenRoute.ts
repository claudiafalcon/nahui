import { useEffect, useState } from 'react';

/**
 * Reads the Claim Token straight out of `window.location.pathname`,
 * matching the shape of the QR URL the Merchant prototype already
 * generates (`https://loyalty.nahui.mx/c/<claimToken>`, Gap Analysis §4
 * item 4 — "nice-to-have for legibility, not a requirement"). No router
 * library: this surface has no navigation to speak of
 * (`customer-loyalty-registration.md` §3's own convention note — "no nav
 * bar anywhere in this document"), so a tiny custom hook is simpler than a
 * dependency.
 *
 * Returns `null` when the path doesn't match `/c/:token` at all — the
 * root path (`/`) renders this build's own dev-only `DemoIndex` instead
 * of a spec-defined state (see this folder's build report).
 */
export function useClaimTokenRoute(): string | null {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    function onPopState() {
      setPath(window.location.pathname);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const match = path.match(/^\/c\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}
