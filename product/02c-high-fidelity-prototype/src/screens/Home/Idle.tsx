import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { daysFromToday } from '../../domain/dates';
import { pesos, pluralize } from '../../domain/format';
import styles from './Idle.module.css';
import sheetStyles from '../../components/SessionHeader/SessionHeader.module.css';

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
 * §3.6a Not Ready — the demo Onboarding path is the only path in this build
 * that can ever set `defaultSellingMode = 'nfc'` (onboarding.md §2.2), and
 * NFCTag assignment ("Asignar Tags," inventory.md §3.14) isn't modeled at
 * all in this build (disclosed in README.md) — so NFC Readiness always
 * evaluates Not Ready whenever that's true, never Ready or Limited Ready.
 * "Asignar tags" is a visible but stubbed/no-op link (routes to an honest
 * Placeholder, the same "never hidden" treatment already given to
 * Eventos/Resultados/Configuración) rather than a broken tap.
 *
 * **Same-day resume line (§3.4/§3.5, closes `architect-questions.md` Q19).**
 * `todaySales` is `todaySalesSummary(state, null)` — the Quick Session scope
 * (`Session.eventId === null`) — resolved once in `HomeScreen.tsx` and
 * passed down, never recomputed here. Renders only when non-null (1+
 * finalized Sales already exist today under a Quick Session), between the
 * greeting and the primary CTA, exactly the position both wireframes show —
 * pixel-identical to the base state otherwise. */
export function Idle({
  defaultSellingMode,
  upcomingEventVenueName,
  upcomingEventStartDate,
  onTapUpcomingEvent,
  todaySales,
  onStartSession,
  onOpenSettings,
  onOpenAssignTagsPlaceholder,
}: {
  defaultSellingMode: 'buttons' | 'nfc';
  upcomingEventVenueName?: string;
  upcomingEventStartDate?: string;
  onTapUpcomingEvent?: () => void;
  todaySales?: { total: number; count: number } | null;
  onStartSession: () => void;
  onOpenSettings: () => void;
  onOpenAssignTagsPlaceholder: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const notReady = defaultSellingMode === 'nfc';
  const showUpcomingCard = Boolean(upcomingEventVenueName && upcomingEventStartDate && onTapUpcomingEvent);

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Nahui</span>
        <button className={styles.menuBtn} onClick={() => setMenuOpen((open) => !open)} aria-label="Controles">
          ⋯
        </button>
      </div>
      <div className={styles.wrap}>
        <div className={styles.watermark} aria-hidden="true">
          <BrandMark size={340} color="var(--color-blush)" />
        </div>
        <div className={styles.content}>
          {showUpcomingCard && (
            <button className={styles.upcomingCard} onClick={onTapUpcomingEvent}>
              <span className={styles.upcomingVenue}>{upcomingEventVenueName}</span>
              <span className={styles.upcomingCountdown}>
                {daysFromToday(upcomingEventStartDate!) <= 0
                  ? 'empieza hoy'
                  : `empieza en ${daysFromToday(upcomingEventStartDate!)} ${
                      daysFromToday(upcomingEventStartDate!) === 1 ? 'día' : 'días'
                    }`}
              </span>
            </button>
          )}
          <h1 className={styles.question}>¿Vas a vender hoy?</h1>
          {todaySales && (
            <p className={styles.todaySalesLine}>
              Ya vendiste {pesos(todaySales.total)} · {todaySales.count} {pluralize(todaySales.count, 'venta', 'ventas')} hoy
            </p>
          )}
          <Button className={styles.cta} onClick={onStartSession}>
            Iniciar Venta Rápida
          </Button>
          {notReady && (
            <div className={styles.readinessNote}>
              <p className={styles.readinessLine}>
                Todavía no tienes prendas con tag para hoy — vas a vender con botones.
              </p>
              <button className={styles.readinessLink} onClick={onOpenAssignTagsPlaceholder}>
                Asignar tags
              </button>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <Sheet onDismiss={() => setMenuOpen(false)}>
          <button
            className={`${sheetStyles.sheetRow} stitchBottom`}
            onClick={() => {
              setMenuOpen(false);
              onOpenSettings();
            }}
          >
            ⚙ Configuración
          </button>
        </Sheet>
      )}
    </>
  );
}
