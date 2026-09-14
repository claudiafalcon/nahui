import { BrandMark } from '../../components/BrandMark/BrandMark';
import { Button } from '../../components/Button/Button';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import { InvitationContextLine, type InvitationContext } from './InvitationContextLine';
import styles from './PhoneMismatchConfirm.module.css';

/**
 * authentication.md §3.7e "Verificando código / Google — éxito, pero este
 * dispositivo guarda otra identidad" (Slice 12 `merchant-user-tester` defect
 * fix, 2026-09-07; **generalized 2026-09-13, `decision-log.md` D62/D63** —
 * originally phone-only, "éxito, pero este teléfono guarda otro número").
 * Reached only from `AppRouter.tsx`'s own `needsPhoneMismatchConfirmation`
 * derivation: a genuinely first-ever-anywhere credential — phone, email, or
 * Google alike — just verified successfully on this shared instance while it
 * already held at least one other `User` row (i.e., a different identity
 * previously held a verified session here, however long ago, sign-out or
 * not). Never reached by an ordinary first-ever verification on a genuinely
 * virgin instance — the common case stays exactly as fast as it already was
 * (§6's own "+1, not part of the floor" accounting).
 *
 * No loading state of its own (§3.7e's own text) — the underlying
 * verification write already completed before this screen ever renders;
 * this is a pure local read-and-confirm gate before `onboarding.md §3.5`'s
 * own Business-creation write ever runs.
 */
export function PhoneMismatchConfirm({
  channel,
  displayValue,
  onConfirm,
  onCorrect,
  invitationContext,
}: {
  /** Which credential type just verified — resolves the one noun that
   * varies in this screen's copy (§3.7e's own bracketed "[número / correo /
   * cuenta de Google]"). `'apple'` is schema-modeled but not activated by
   * D62/D63 (`authentication.md` §11) — defensively unreachable through any
   * built UI this slice, folded into the generic "cuenta" noun rather than
   * crashing if it ever somehow arrives. */
  channel: 'phone' | 'email' | 'google' | 'apple';
  /** The identifier reflected back to her, already resolved for display —
   * a formatted phone number, a lowercased email, or (Google) whatever
   * human-readable label the OAuth session itself returned, read live and
   * never persisted (`authentication.md` §3.7e's own explicit rule, RFC
   * 0012 §1). `AppRouter.tsx` resolves this per channel — this component
   * never re-derives it. */
  displayValue: string;
  /** "Sí, es mío/mía" — clears the device-history gate permanently for this
   * User (`confirmPhoneMismatch`, store.tsx) and lets the render below fall
   * through to `onboarding.md §3.3`, identical to an ordinary first-ever
   * verification on a virgin device. */
  onConfirm: () => void;
  /** "No, elegir otro" (renamed from "No, corregir número," since Google has
   * nothing to "correct" — §3.7e's own text) — reverts this just-completed
   * verification (`retractMistypedVerification`, store.tsx) and returns to
   * whichever entry point she used: §3.3 (phone) or §3.2e (email), value
   * preserved for editing; §3.2a for Google — the identical destination and
   * pre-fill behavior "← Cambiar [número / correo]" (§3.6) already
   * establishes, resolved by `AppRouter.tsx`, not this component. */
  onCorrect: () => void;
  /** RFC 0013, added 2026-09-14 (`reviewer` Blocker B1 fix) — set only by
   * `InvitationFlow.tsx`'s own inline mounting of this screen (a device
   * sitting on an unconfirmed §3.7e gate that opened an `/invite/<token>`
   * link), so the Invitation-context line (`InvitationContextLine.tsx`'s
   * own doc comment, `authentication.md` §2.0 step 4/M1) stays visible
   * through this gate too, exactly as every other §3.2a-§3.2f/§3.3-§3.7d
   * screen this flow carries the token through already does. `undefined` for
   * `AppRouter.tsx`'s own ordinary mounting of this screen — an ordinary
   * device-history mismatch, with no Invitation in play. */
  invitationContext?: InvitationContext;
}) {
  // Demonstrative baked in per-option ("Este número" / "Este correo" /
  // "Esta cuenta de Google" / "Esta cuenta"), not a single shared "Este "
  // prefix — "cuenta" is feminine, so a shared masculine prefix produced
  // "Este cuenta de Google" (`ux-critic` fix, 2026-09-13; corrected upstream
  // in `authentication.md` §3.7e's own wireframe to
  // "[Este número / Este correo / Esta cuenta de Google]"). `'apple'` is
  // schema-modeled but unreachable through any built UI this slice (see this
  // component's own `channel` doc comment above) — folded into the generic,
  // still-feminine "Esta cuenta," matching that comment's own claim rather
  // than silently reusing the Google branch.
  const demonstrativeNoun =
    channel === 'phone'
      ? 'Este número'
      : channel === 'email'
        ? 'Este correo'
        : channel === 'google'
          ? 'Esta cuenta de Google'
          : 'Esta cuenta';
  return (
    <ScreenTransition transitionKey="phone-mismatch-confirm">
      <div className={styles.wrap}>
        <div className={styles.mark}>
          <BrandMark />
        </div>
        <div className={styles.copy}>
          {invitationContext && <InvitationContextLine businessName={invitationContext.businessName} />}
          <p className={styles.eyebrow}>Nahui</p>
          <h1 className={styles.heading}>Confirma tu identidad</h1>
          <p className={styles.body}>{demonstrativeNoun} todavía no tiene un negocio en Nahui:</p>
          <p className={styles.phone}>{displayValue}</p>
          <p className={styles.body}>Si es tuyo, seguimos y empezamos tu negocio aquí.</p>
        </div>
        <div className={styles.ctaStack}>
          <Button className={styles.cta} onClick={onConfirm}>
            Sí, es mío/mía
          </Button>
          <Button className={styles.cta} variant="secondary" onClick={onCorrect}>
            No, elegir otro
          </Button>
        </div>
      </div>
    </ScreenTransition>
  );
}
