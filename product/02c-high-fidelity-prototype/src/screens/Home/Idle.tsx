import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { daysFromToday } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import type { MembershipRole } from '../../domain/types';
import { useNfcSessionStart } from './useNfcSessionStart';
import { NfcSessionStartNote } from './NfcSessionStartNote';
import styles from './Idle.module.css';

/** home.md §3.4/§3.5 — idle, ready to sell, no Session open yet. Same
 * elements the approved spec calls for (greeting question, the primary CTA,
 * §3.5's optional upcoming-Event card) — composition below is a
 * High-Fidelity revision: an asymmetric layout anchored by an oversized,
 * softly-tinted BrandMark watermark instead of a perfectly centered stack
 * floating in empty space. Reuses Nahui's own mark at a different scale
 * (already established in ColdStart) rather than inventing a new decorative
 * device for this screen alone.
 *
 * CTA copy: "Iniciar Venta Rápida," not the approved spec's own "Iniciar
 * Sesión Rápida" — a Demo Polish-pass naming decision, see README "Naming —
 * Venta rápida (2026-08-13)."
 *
 * **Upcoming-Event card (§3.5, Eventos pass D43).** Visually secondary and
 * tappable only into Eventos' own detail screen — never into starting a
 * Session — so scheduling awareness stays read-only and can never add a
 * step to Quick Session ("Quick Session works regardless," domain-model.md).
 * "Iniciar Venta Rápida" keeps full prominence with or without the card.
 *
 * **§3.6a (NFC Selling pass, D43) — all four Session-start variants are now
 * real**, via the shared `useNfcSessionStart`/`NfcSessionStartNote` pair
 * (see those files' own doc comments): Limited Ready (inline override),
 * Not Ready, capability revoked, and the one-time Ready-but-`buttons`
 * discoverability nudge. `overrideToNfc` — Limited Ready's own local
 * override choice — is threaded through `onStartSession` at the moment of
 * *this* tap (§6's footnote: "before the existing Session-start tap"),
 * never gating or delaying it. "Asignar tags" routes into Inventario's real
 * Asignar Tags queue (`inventory.md` §3.14, via
 * `onOpenAssignTagsPlaceholder`, unrenamed from the Asignar Tags pass to
 * keep that diff scoped) instead of a Home-local Placeholder stub.
 *
 * **Same-day resume line (§3.4/§3.5, closes `architect-questions.md` Q19).**
 * `todaySales` is `todaySalesSummary(state, null)` — the Quick Session scope
 * (`Session.eventId === null`) — resolved once in `HomeScreen.tsx` and
 * passed down, never recomputed here. Renders only when non-null (1+
 * finalized Sales already exist today under a Quick Session), between the
 * greeting and the primary CTA, exactly the position both wireframes show —
 * pixel-identical to the base state otherwise.
 *
 * **Direct gear (⚙) entry point (settings.md §2.1; amended 2026-08-15 — see
 * home.md's own status header/§2/§3.6c).** Previously a "⋯" icon opening a
 * one-row Sheet ("⚙ Configuración" only) — that intermediate sheet is now
 * retired here too (already retired for the active-Session header a day
 * earlier, SessionHeader.tsx): the gear icon calls `onOpenSettings` directly,
 * no `Sheet`, no `menuOpen` state. Same shape as §3.6a's own gear icon below
 * (`NfcSessionStartNote`'s "Ir a Configuración" link is a separate,
 * secondary affordance, unaffected by this change).
 *
 * **SELLER passive-awareness line (§3.4/§3.5, further amended 2026-09-09,
 * `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60).** When
 * `sellerEventsElsewhere` is true, a two-line note renders beneath the
 * primary CTA, above `NfcSessionStartNote` (the stacking order §3.4/§3.5
 * both specify: same-day-resume line → CTA → this line → §3.6a's own
 * readiness line, if any) — "Hay eventos activos hoy y no estás asignada a
 * ninguno." / "Pídele a quien te invitó que te asigne a uno." Reuses the
 * existing `.readinessNote`/`.readinessLine` styling `NfcSessionStartNote`
 * already established for its own plain-text, no-link SELLER variants
 * (Not Ready / capability-revoked), rather than introducing new styling for
 * what's visually the identical shape. Plain text, no link — only an OWNER
 * can create an `EventAssignment`, so there is genuinely nothing to route
 * to from here. Shown every time the condition holds, not once ever;
 * disappears the instant it no longer does.
 *
 * **Upcoming-Event card, role-scoped (§3.5, further amended 2026-09-10,
 * completing `product/99-rfc/0011-event-assignment.md`'s own
 * SELLER-narrowing pattern for the `scheduled` case).** `HomeScreen.tsx`
 * now resolves `upcomingEventVenueName`/`upcomingEventStartDate` for a
 * SELLER too (sourced from her own `upcomingQualifyingEventForMembership`,
 * never the Business-wide set) — but only ever passes `onTapUpcomingEvent`
 * for an OWNER. When the card data is present without a tap handler, it
 * renders as plain, non-interactive display (`.upcomingCardStatic`) instead
 * of a `<button>` — she has no Eventos tab for it to route into (§3.16),
 * and this document's own "an unreachable destination is never shown as a
 * live link" discipline (§3.6a) applies to the card exactly as it already
 * does to every next-step link.
 *
 * **"Asignada" ownership label on the SELLER's own card (§3.5, further
 * amended 2026-09-10 — `ux-critic` Major, closed same pass).** Without it
 * this card was pixel-identical to the OWNER's Business-wide card, with
 * nothing on screen telling her the Event named is specifically hers.
 * Rendered only in the static (non-tappable) branch below, gated on
 * `role === 'SELLER'` — the OWNER's own card never gets it; a Business-wide
 * card has no single "assigned" status to claim. Reuses `SessionHeader.tsx`'s
 * own `.title` eyebrow treatment (small uppercase, letter-spaced label above
 * a bold value line) — the pattern `DESIGN-SYSTEM.md` §7 already names as
 * this app's established eyebrow/body convention — rather than inventing new
 * label typography for this one card.
 *
 * **SELLER "scheduled elsewhere, not assigned" line (§3.4, same 2026-09-10
 * amendment).** Mutually exclusive with the upcoming-Event card — the same
 * top-position slot, resolved upstream in `HomeScreen.tsx` so at most one of
 * `showUpcomingCard`/`sellerEventsScheduledElsewhere` is ever true at once.
 * When it renders, it takes the card's own slot and the "¿Vas a vender
 * hoy?" greeting is suppressed for that render (§3.4's own wireframe: this
 * line's closing clause already orients her to what's happening — asking
 * the greeting question immediately after would read as a non sequitur,
 * per §3.4's own reasoning). This is *not* extended to the card case itself
 * (which keeps coexisting with the greeting, an already-built, already-
 * reviewed High-Fidelity composition this amendment doesn't revisit). */
export function Idle({
  role,
  headerIcon,
  upcomingEventVenueName,
  upcomingEventStartDate,
  onTapUpcomingEvent,
  todaySales,
  onStartSession,
  onOpenAccountSurface,
  onOpenAssignTagsPlaceholder,
  sellerEventsElsewhere,
  sellerEventsScheduledElsewhere,
}: {
  role: MembershipRole;
  headerIcon: '⚙' | '⊚';
  /** home.md §3.5 — role-scoped as of the 2026-09-10 amendment.
   * `HomeScreen.tsx` resolves this from the Business-wide set for an OWNER
   * (`upcomingEventForBusiness`) and from this SELLER's own
   * `EventAssignment`-scoped `upcomingQualifyingEventForMembership` for a
   * SELLER — never the Business-wide set for her. */
  upcomingEventVenueName?: string;
  upcomingEventStartDate?: string;
  /** Only ever passed for an OWNER (`HomeScreen.tsx`) — she has an Eventos
   * tab for the card to route into (§3.16); a SELLER's own card is present
   * but non-tappable (this section's own "unreachable destination is never
   * shown as a live link" discipline, extended from links to the card
   * itself, 2026-09-10). `undefined` here is exactly what renders the card
   * as static display instead of a `<button>`. */
  onTapUpcomingEvent?: () => void;
  todaySales?: { total: number; count: number } | null;
  /** NFC Selling pass (D43) — `overrideToNfc` is whatever
   * `useNfcSessionStart`'s own local override state currently reads at the
   * moment of this tap (always `false` outside the Limited Ready variant). */
  onStartSession: (overrideToNfc: boolean) => void;
  onOpenAccountSurface: () => void;
  onOpenAssignTagsPlaceholder: () => void;
  /** `home.md` §3.4/§3.5's SELLER-only passive-awareness line
   * (`product/99-rfc/0011-event-assignment.md`, `decision-log.md` D60) —
   * true only when this SELLER's role-scoped qualifying-Event check (§2)
   * found zero qualifying Events *and* the Business has 1+ Event `active`,
   * Business-wide, right now (resolved once in `HomeScreen.tsx`, passed
   * down rather than recomputed here). Always `false` for `role ===
   * 'OWNER'`, who never sees this line. */
  sellerEventsElsewhere: boolean;
  /** `home.md` §3.4/§3.5's SELLER-only "scheduled elsewhere, not assigned"
   * line (2026-09-10 amendment) — true only when this SELLER's own
   * `upcomingQualifyingEventForMembership` (§2 step 3) resolves to nothing
   * *and* the Business has 1+ Event `scheduled`, Business-wide, right now.
   * Mutually exclusive with `upcomingEventVenueName` being set, by
   * construction in `HomeScreen.tsx` — never both, never neither unless
   * genuinely neither condition holds. Always `false` for `role ===
   * 'OWNER'`. */
  sellerEventsScheduledElsewhere: boolean;
}) {
  const { variant, overrideToNfc, toggleOverride } = useNfcSessionStart();
  // 2026-09-10 amendment — no longer conditioned on `onTapUpcomingEvent`:
  // the card now also renders for a SELLER, who never receives a tap
  // handler (see `onTapUpcomingEvent`'s own doc comment above). Whether it
  // renders as a `<button>` or static display is decided at the render site
  // below, purely on whether `onTapUpcomingEvent` was passed.
  const showUpcomingCard = Boolean(upcomingEventVenueName && upcomingEventStartDate);
  const upcomingCountdownText = showUpcomingCard
    ? daysFromToday(upcomingEventStartDate!) <= 0
      ? 'empieza hoy'
      : `empieza en ${daysFromToday(upcomingEventStartDate!)} ${daysFromToday(upcomingEventStartDate!) === 1 ? 'día' : 'días'}`
    : '';

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button
          className={styles.gearBtn}
          onClick={onOpenAccountSurface}
          aria-label={role === 'OWNER' ? 'Configuración' : 'Tu cuenta'}
        >
          {headerIcon}
        </button>
      </div>
      <div className={styles.wrap}>
        <div className={styles.watermark} aria-hidden="true">
          <BrandMark size={340} color="var(--color-blush)" />
        </div>
        <div className={styles.content}>
          {showUpcomingCard &&
            (onTapUpcomingEvent ? (
              <button className={styles.upcomingCard} onClick={onTapUpcomingEvent}>
                <span className={styles.upcomingVenue}>{upcomingEventVenueName}</span>
                <span className={styles.upcomingCountdown}>{upcomingCountdownText}</span>
              </button>
            ) : (
              <div className={`${styles.upcomingCard} ${styles.upcomingCardStatic}`}>
                {role === 'SELLER' && <span className={styles.upcomingCardLabel}>Asignada</span>}
                <span className={styles.upcomingVenue}>{upcomingEventVenueName}</span>
                <span className={styles.upcomingCountdown}>{upcomingCountdownText}</span>
              </div>
            ))}
          {sellerEventsScheduledElsewhere ? (
            <div className={styles.readinessNote}>
              <p className={styles.readinessLine}>Hay eventos programados y no estás asignada a ninguno.</p>
              <p className={styles.readinessLine}>Pídele a quien te invitó que te asigne a uno.</p>
            </div>
          ) : (
            <h1 className={styles.question}>¿Vas a vender hoy?</h1>
          )}
          {todaySales && (
            <p className={styles.todaySalesLine}>
              Ya vendiste {pesos(todaySales.total)} · {todaySales.count} {pluralize(todaySales.count, 'venta', 'ventas')} hoy
            </p>
          )}
          <Button className={styles.cta} onClick={() => onStartSession(overrideToNfc)}>
            Iniciar Venta Rápida
          </Button>
          {sellerEventsElsewhere && (
            <div className={styles.readinessNote}>
              <p className={styles.readinessLine}>Hay eventos activos hoy y no estás asignada a ninguno.</p>
              <p className={styles.readinessLine}>Pídele a quien te invitó que te asigne a uno.</p>
            </div>
          )}
          <NfcSessionStartNote
            variant={variant}
            role={role}
            overrideToNfc={overrideToNfc}
            onToggleOverride={toggleOverride}
            onOpenAssignTags={onOpenAssignTagsPlaceholder}
            onOpenSettings={onOpenAccountSurface}
          />
        </div>
      </div>
    </>
  );
}
