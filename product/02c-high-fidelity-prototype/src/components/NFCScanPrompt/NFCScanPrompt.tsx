import type { ReactNode } from 'react';
import { TagStub } from '../TagStub/TagStub';
import styles from './NFCScanPrompt.module.css';

/**
 * inventory.md §3.14 — "Acerca el tag a la prenda." Real NFC hardware
 * satisfies this passively (holding a tag near the phone), which a browser
 * can't reproduce; this is that physical gesture simulated as a tap target
 * — the same "mock the physical mechanism, keep every screen state honest"
 * disclosure this codebase's phone-OTP mock already established (any
 * 6-digit code accepted, `authentication.md` §3.7). Named after the
 * Medium-Fidelity precedent component (`product/02b-medium-fidelity/inventory.md`'s
 * own `NFCScanPrompt`, reused on `home.md`'s NFC selling surface too) rather
 * than anything "Tag"-adjacent — `src/components/TagStub/` is a distinct,
 * decorative per-Product marker with no relationship to `NFCTag`/`tagId`.
 *
 * **`label`/`ariaLabel` (NFC Selling pass, D43).** Optional overrides so this
 * exact component can be reused, unchanged, on `home.md` §3.10's selling
 * surface — whose own approved copy is "Acerca el tag del producto," not
 * Asignar Tags' "Acerca el tag a la prenda" — per the Architecture Gap
 * Analysis's own instruction ("reusing `NFCScanPrompt` from the Asignar Tags
 * slice"). Only apply while `state === 'listening'` (below) — the two states
 * this override pair was designed for don't exist for `'idle'`/`'error'`,
 * which render fixed, mechanism-level copy regardless of caller (see below).
 *
 * **Glyph (design-audit-2026-08-15 #1).** The pulsing ring used to hold a
 * generic Wi-Fi/broadcast-wave SVG, disconnected from the system's own
 * vocabulary. The NFC tag being scanned here *is*, physically, the same
 * swing tag the whole visual system is built from — it stays with the
 * customer as part of the loyalty journey (`company/CLAUDE.md`). Swapped
 * for a larger `TagStub` silhouette (`showLetter={false}`, an explicit
 * neutral `tone` override — see `TagStub`'s own doc comment for why a bare
 * name-derived tone can't be used here) at the "Small" scale
 * (`DESIGN-SYSTEM.md` §4) rather than inventing a sixth device. Pure glyph
 * swap — no copy/behavior change. The glyph itself stays a constant white
 * silhouette across every `state` below; only the ring's own background/
 * motion changes, so the state signal lives in exactly one place.
 *
 * **`state` (live-hardware reliability fix, 2026-09-17).** Real Web NFC
 * (`NDEFReader.scan()`/`.write()`) can only ever be started inside a user-
 * gesture handler — this component can never auto-start a session the
 * instant it mounts, so there is always a genuine moment, at minimum before
 * the first on-screen tap, where no session is listening yet. Before this
 * fix, this component rendered exactly one visual state always (this
 * pulsing "ready" ring, unconditionally) — every real-hardware call site
 * tracked whether a session was actually active purely via a non-reactive
 * `useRef`, so a session that silently died (`scan()`/`write()` rejecting,
 * or the ref resetting after a genuine platform failure) left the identical
 * "ready, tap a tag now" ring on screen, inviting a physical tap into a dead
 * session — which Android's own OS-level NFC dispatch can intercept instead
 * (its generic "Nueva etiqueta escaneada / Etiqueta vacía" system dialog, or
 * launching an unrelated app for a tag that already carries pre-written
 * content). `state` makes that real, three-way distinction reactive instead
 * of ref-only, so this screen can never visually lie about whether it's
 * actually listening:
 * - `'idle'` — no session genuinely started yet: before the first tap, right
 *   after an explicit close/reset, or (write-flow call sites only) between
 *   one committed tag and the next required tap — see each call site's own
 *   `handleScan`. Static, dimmed ring; distinct "tap to activate" copy —
 *   never the "acerca el tag" invitation, since nothing is listening.
 * - `'listening'` — the underlying `scan()`/`write()` call has genuinely
 *   started (the browser has granted and begun the session, not merely "we
 *   called the function"). The original pulsing-ring "Acerca el tag..."
 *   treatment, unchanged.
 * - `'error'` — the session itself failed to start or died mid-flight
 *   (permission denial, hardware rejection, a genuine platform error) — a
 *   real, blocking failure of the reading mechanism itself, distinct from
 *   `'idle'`. Reuses this codebase's own real-consequence write-failure
 *   color (`--color-error`, `CatalogRow.tsx`'s own `.nfcError`), not a new
 *   color, with a short, purely mechanical retry nudge — the specific
 *   diagnostic reason (a genuine hardware read failure, an already-assigned
 *   tag, a tag already in another Event, etc.) keeps living entirely in each
 *   call site's own pre-existing, appropriately-toned ambient feedback
 *   mechanism beside this component, exactly as before this fix — a
 *   per-*tag-read* failure while a session stays genuinely alive
 *   (`onreadingerror`) never touches `state` at all, only a failure of the
 *   session itself does.
 */
export function NFCScanPrompt({
  onTap,
  disabled,
  label,
  ariaLabel,
  state,
}: {
  onTap: () => void;
  disabled?: boolean;
  label?: ReactNode;
  ariaLabel?: string;
  state: 'idle' | 'listening' | 'error';
}) {
  const ringClass =
    state === 'idle' ? styles.ringIdle : state === 'error' ? styles.ringError : styles.ringListening;

  const idleContent = (
    <>
      Toca para activar
      <br />
      la lectura NFC
    </>
  );
  const idleAria = 'Toca para activar la lectura NFC';
  const errorContent = 'Toca para intentar de nuevo';
  const errorAria = 'No se pudo activar la lectura NFC. Toca para intentar de nuevo.';
  const listeningContent = label ?? (
    <>
      Acerca el tag a la
      <br />
      prenda
    </>
  );
  const listeningAria = ariaLabel ?? 'Acerca el tag a la prenda';

  const content = state === 'idle' ? idleContent : state === 'error' ? errorContent : listeningContent;
  const resolvedAriaLabel = state === 'idle' ? idleAria : state === 'error' ? errorAria : listeningAria;

  return (
    <button
      className={styles.prompt}
      onClick={onTap}
      disabled={disabled}
      aria-label={resolvedAriaLabel}
    >
      <span className={`${styles.ring} ${ringClass}`} aria-hidden="true">
        <TagStub
          name=""
          size={52}
          showLetter={false}
          tone={{ bg: 'var(--color-white)', ink: 'var(--color-white)' }}
        />
      </span>
      <span className={`${styles.label} ${state === 'idle' ? styles.labelIdle : ''} ${state === 'error' ? styles.labelError : ''}`}>
        {content}
      </span>
    </button>
  );
}
