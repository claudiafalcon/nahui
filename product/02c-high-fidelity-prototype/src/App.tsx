import { useState } from 'react';
import { useStore } from './domain/store';
import { currentUser, findMembership } from './domain/selectors';
import { useNfcAssignTagSession } from './domain/useNfcAssignTagSession';
import type { AppState } from './domain/types';
import { NavBar, type TabKey } from './components/NavBar/NavBar';
import { HomeScreen } from './screens/Home/HomeScreen';
import { InventoryScreen, type InventoryView } from './screens/Inventory/InventoryScreen';
import { EventsScreen, type EventsView } from './screens/Events/EventsScreen';
import { ResultadosScreen, type ResultadosView } from './screens/Resultados/ResultadosScreen';
import { AccesoRevocado } from './screens/Settings/AccesoRevocado';
import { AccesoNoDisponible } from './screens/Home/AccesoNoDisponible';
import { ScreenTransition } from './components/ScreenTransition/ScreenTransition';
import styles from './App.module.css';

/** Spanish "y"-joined list, the identical join rule
 * `PersonalParaEsteEvento.tsx`'s own `buildConflictLine` already establishes
 * for a structurally similar "name several things in one sentence" need. */
function joinNombres(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} y ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

/** inventory.md §3.13's mixed-Lot completion-copy variant (`decision-log.md`
 * D71) — the verbatim worked example is "Camisas ya está etiquetada. Plumas
 * no necesita tag — se vende con botones, y ya está lista." (one eligible,
 * one non-eligible Product); generalized here to name every Product on each
 * side of a Lot that mixed more than one of either, with the matching
 * singular/plural conjugation. Built once, at the moment tagging completes
 * (`onReturnToOrigin` below, on §3.13's own `tagsComplete` branch), from
 * the exact eligible/non-eligible lines
 * `commitLot` wrote for this specific Lot — never guessed or re-derived from
 * the live Catalog. */
function buildMixedLotDetail(
  state: AppState,
  eligibleLines: { productId: string; quantity: number }[],
  nonEligibleLines: { productId: string; quantity: number }[],
): string {
  const nameFor = (productId: string) => state.products.find((p) => p.id === productId)?.name ?? '';
  const eligibleNames = eligibleLines.map((l) => nameFor(l.productId)).filter(Boolean);
  const nonEligibleNames = nonEligibleLines.map((l) => nameFor(l.productId)).filter(Boolean);
  const eligiblePlural = eligibleNames.length > 1;
  const nonEligiblePlural = nonEligibleNames.length > 1;
  const yaEstaEligible = eligiblePlural ? 'ya están' : 'ya está';
  const etiquetada = eligiblePlural ? 'etiquetadas' : 'etiquetada';
  const necesita = nonEligiblePlural ? 'necesitan' : 'necesita';
  const seVende = nonEligiblePlural ? 'se venden' : 'se vende';
  const yaEstaNonEligible = nonEligiblePlural ? 'ya están' : 'ya está';
  const lista = nonEligiblePlural ? 'listas' : 'lista';
  return `${joinNombres(eligibleNames)} ${yaEstaEligible} ${etiquetada}. ${joinNombres(nonEligibleNames)} no ${necesita} tag — ${seVende} con botones, y ${yaEstaNonEligible} ${lista}.`;
}

/**
 * information-architecture.md — frozen four-tab nav (Hoy · Inventario ·
 * Eventos · Resultados). All four tabs are real as of the Resultados pass
 * (Migration Workflow, D43) — Hoy/Inventario/Eventos already were; this pass
 * closes the last one.
 *
 * **Slice 12 additions (`product-decisions.md` Q24/Q25) — role-scoped
 * rendering at the tab-shell level.** `home.md` §2 step 0 (a revoked acting
 * Membership) is resolved here, one level above the nav bar/tab content —
 * `settings.md` §3.14's own wireframe shows no header, no bottom nav at
 * all for that state, a stronger omission than any state `HomeScreen.tsx`
 * itself renders. `home.md` §3.16 (role-scoped nav) is applied here too:
 * a SELLER's `NavBar` renders only "Hoy," and — as a defensive backstop
 * matching §3.17's own reachability note ("a stale link, a browser-back
 * artifact, or any other path...never reachable by tapping anything this
 * document or its siblings actually offer her") — this component never
 * renders the real Inventario/Eventos/Resultados content for her even if
 * `activeTab` somehow ends up pointed at one, since nothing in this
 * codebase's own SELLER-facing screens ever fires a callback that would.
 */
export default function App() {
  const { state } = useStore();
  const [activeTab, setActiveTab] = useState<TabKey>('hoy');

  const user = currentUser(state);
  const membership = user && state.business ? findMembership(state, user.id, state.business.id) : undefined;

  if (membership?.status === 'revoked') {
    return <AccesoRevocado />;
  }
  const role = membership?.role ?? 'OWNER';
  const [inventoryView, setInventoryView] = useState<InventoryView>({ mode: 'catalog' });
  const [eventsView, setEventsView] = useState<EventsView>({ mode: 'list' });
  const [resultadosView, setResultadosView] = useState<ResultadosView>({ mode: 'main' });
  // AT-M1/AT-M2 fix round (`AssignTags.tsx`) — both owned here, alongside
  // `inventoryView`, rather than inside `AssignTags` itself, so a plain
  // "Terminar después" → resume defer/resume cycle — which unmounts/
  // remounts `<AssignTags>` (`InventoryScreen.tsx` swaps it out whenever
  // `inventoryView.mode` leaves `'assign-tags'`) — never loses either.
  // (Resuming is now always Product-scoped, via one of the two `[ Etiquetar ]`
  // controls — §3.4's card shortcut or §3.19's Level-1 action, 2026-09-19.
  // §3.5/§3.17's whole-Catalog "Continuar etiquetando" button was retired
  // 2026-09-17; §3.4's own `[ N sin etiquetar ]` tap zone was retired
  // 2026-09-19, its count surviving as passive caption text.)
  // `assignTagsEntry` is replaced only when a fresh `commitLot` actually
  // triggers a new entry (AT-M1); `assignTagsSegmentTotals` is updated by
  // `AssignTags` itself, per-Product, as its own doc comment describes
  // (AT-M2).
  const [assignTagsEntry, setAssignTagsEntry] = useState<{ productId: string; quantity: number }[] | null>(null);
  const [assignTagsSegmentTotals, setAssignTagsSegmentTotals] = useState<Record<string, number>>({});
  // inventory.md §3.13's mixed-Lot completion-copy variant (`decision-log.md`
  // D71) — this specific Lot's remaining, non-eligible lines (e.g. Plumas,
  // alongside an eligible Camisas line seeded into `assignTagsEntry`),
  // replaced only alongside `assignTagsEntry` (a fresh commit), so it
  // survives a defer/resume cycle exactly the same way AT-M1 already
  // guarantees for `assignTagsEntry` itself. `null` whenever this Lot didn't
  // mix (or this entry came from step 0's whole-Catalog seed, which can't
  // mix by construction) — the ordinary, undifferentiated §3.13 copy.
  const [assignTagsMixedNonEligible, setAssignTagsMixedNonEligible] = useState<
    { productId: string; quantity: number }[] | null
  >(null);
  // 2026-09-18 architecture fix (`decision-log.md` D74/D75 follow-up) — the
  // live Web NFC listening session behind Asignar Tags, lifted here for the
  // identical reason `assignTagsEntry`/`assignTagsSegmentTotals` already are:
  // it must be started from a tap in `CatalogView.tsx` and survive the
  // navigation into `AssignTags.tsx`, a different component instance. See
  // `useNfcAssignTagSession.ts`'s own top-of-file doc comment for the full
  // "why this moved out of `AssignTags.tsx`'s own state" reasoning.
  const nfcAssignSession = useNfcAssignTagSession();

  return (
    <>
      <main className={styles.main}>
        {activeTab === 'hoy' && (
          <ScreenTransition transitionKey="hoy">
            <HomeScreen
              onNavigateToRegister={() => {
                // inventory.md §10: Home's cold-start CTA routes directly into
                // Registrar Mercancía, not Inventario's own cold-start screen.
                // **Origin: Home** (`inventory.md` §3.6's "return to origin,"
                // 2026-09-19) — the one origin that lives on another tab, and
                // the one the save's own named exception applies to: its
                // precondition ("no Product ever registered") is false the
                // instant the save succeeds, so a successful save returns to
                // Catalog view instead. A back arrow with nothing written
                // still returns here, because the origin is still true.
                setInventoryView({ mode: 'register', origin: { screen: 'home' } });
                setActiveTab('inventario');
              }}
              onNavigateToEvent={(eventId) => {
                // home.md §3.5: the upcoming-Event card routes into Eventos'
                // own scheduled-detail screen for that specific Event
                // (events.md §3.11) — not a new destination invented for this
                // entry point.
                setEventsView({ mode: 'detail', eventId });
                setActiveTab('eventos');
              }}
              onNavigateToResultadosSession={(sessionId) => {
                // home.md §3.12 "Ver detalle" (reports.md §2 step 3) — lands
                // directly on Resultados' Session detail, skipping the main
                // list entirely, regardless of Resultados' own tab state.
                setResultadosView({ mode: 'session-detail', sessionId, returnTo: { mode: 'main' } });
                setActiveTab('resultados');
              }}
              onNavigateToAssignTags={() => {
                // Selling.tsx's own mid-Session "Asignar tags" hand-off (a
                // scan that doesn't resolve to any tagged unit) — routes into
                // Inventario's own Asignar Tags queue (inventory.md §3.14),
                // the same whole-Catalog/Lot-scoped shape entry point 1 and
                // the (dormant since D72) entry point 2 both use — not a
                // Home-local stub. **The former §3.6a Session-start "Asignar
                // tags" mention this callback also used to feed is retired
                // outright, `decision-log.md` D79** — this is now its only
                // caller. Unaffected by the 2026-09-17 live pass:
                // that amendment only retired §3.5/§3.17's own Catalog-view
                // "Continuar etiquetando" button and added the new
                // Product-scoped entry point 3 (`onOpenAssignTagsForProduct`
                // below), neither of which this Home-originated link uses.
                // Origin: Catalog view. This Selling-originated handoff is
                // **not** one of the four origins `inventory.md` §3.6/§3.14
                // enumerate (§3.19, §3.4, §3.3/§3.3a, Home) — it comes from a
                // different document's flow, `home.md`'s own mid-Session
                // handoff — so returning to Catalog view keeps its existing,
                // already-approved behaviour exactly as it was rather than
                // inventing a fifth origin for it. Named here so the omission
                // reads as a decision, not a miss.
                setInventoryView({ mode: 'assign-tags', origin: { screen: 'catalog' } });
                setActiveTab('inventario');
              }}
              onNavigateToInventarioViaSettingsTagsOn={() => {
                // settings.md §2.6 (`decision-log.md` D46 Addendum) — the
                // instant "Cambiar a vender con tags" writes
                // `defaultSellingMode`, hand off into Inventario carrying only
                // a bare entry marker; `InventoryScreen`'s own step 0 (D46
                // Addendum) decides what she actually sees from there — this
                // callback never reads any Inventory-owned fact itself.
                setInventoryView({ mode: 'catalog', enteredViaSettingsTagsOn: true });
                setActiveTab('inventario');
              }}
            />
          </ScreenTransition>
        )}

        {activeTab === 'inventario' && role === 'OWNER' && (
          <ScreenTransition transitionKey="inventario">
            <InventoryScreen
              view={inventoryView}
              onOpenRegister={({ origin, prefillProductId, entryMode }) =>
                // `origin` comes from whichever screen the merchant actually
                // tapped from — captured at open and held for the whole
                // operation (`inventory.md` §3.6), never inferred here.
                setInventoryView({ mode: 'register', prefillProductId, entryMode, origin })
              }
              onOpenProduct={(productId) =>
                // §3.4's one card tap → §3.19. The Product Page's own back
                // arrow returns to Catalog view, always — it is reached from
                // exactly one place today, so its back destination needs no
                // origin logic of its own (§3.19).
                setInventoryView({ mode: 'product', productId })
              }
              onReturnToOrigin={({ origin, afterWrite, confirmation }) => {
                // **"Return to origin," applied at every exit** — §3.6's back
                // arrow, §3.6's save, and §3.14's completion and deferral
                // alike (§3.6/§3.14, 2026-09-19, closing `ux-critic` M3). One
                // rule, one exception, resolved in exactly one place.
                let resolved = confirmation;
                if (confirmation?.tagsComplete) {
                  // §3.13's mixed-Lot completion-copy variant
                  // (`decision-log.md` D71) — built here, once, from exactly
                  // what this specific Lot's own commit wrote (both still
                  // held in state at this moment, right before they're
                  // cleared below), never re-derived from the live Catalog.
                  const mixedLotDetail =
                    assignTagsEntry && assignTagsEntry.length > 0 && assignTagsMixedNonEligible
                      ? buildMixedLotDetail(state, assignTagsEntry, assignTagsMixedNonEligible)
                      : null;
                  resolved = { ...confirmation, mixedLotDetail };
                  // Tagging queue reached zero — nothing left to freeze a
                  // receipt or a denominator against until a future commitLot
                  // starts a genuinely new session.
                  setAssignTagsEntry(null);
                  setAssignTagsMixedNonEligible(null);
                  setAssignTagsSegmentTotals({});
                } else if (confirmation?.productTagsCompleteId) {
                  // §3.13a — a Product-scoped queue reaching 0 pending. Clears
                  // the frozen segment-total map the same way the Lot-scoped
                  // completion does; never touches `assignTagsEntry`/
                  // `assignTagsMixedNonEligible`, which that entry point never
                  // set in the first place (it carries no "Lo que registraste"
                  // line and no mixed-Lot copy).
                  setAssignTagsSegmentTotals({});
                }

                // **The one exception, stated as a rule rather than a special
                // case: if the save itself makes the origin untrue, return to
                // the nearest still-true state instead.** Exactly one case
                // exists today — an operation opened from Home's cold-start
                // CTA, whose origin is a cold-start state whose precondition
                // ("no Product ever registered") is false the instant the save
                // succeeds. §3.3/§3.3a's own CTA needs no branch here: its
                // origin is `'catalog'`, and Inventario's own resolution
                // renders the cold start for exactly as long as it is still
                // true.
                if (origin.screen === 'home' && !afterWrite) {
                  setInventoryView({ mode: 'catalog' });
                  setActiveTab('hoy');
                  return;
                }
                if (origin.screen === 'product' && !afterWrite) {
                  setInventoryView({ mode: 'product', productId: origin.productId });
                  return;
                }
                if (origin.screen === 'product') {
                  setInventoryView({ mode: 'product', productId: origin.productId, confirmation: resolved });
                  return;
                }
                setInventoryView({ mode: 'catalog', confirmation: resolved });
              }}
              onOpenAssignTags={({ origin, entryBreakdown, nonEligibleBreakdown }) => {
                // AT-M1 — only a fresh `commitLot` (RegisterMerchandise's own
                // save, threading its breakdown through) replaces the frozen
                // receipt; step 0's own dormant whole-Catalog seed (D72 —
                // no longer reachable via any live merchant action) calls
                // this with a breakdown too, so the receipt from whichever
                // commit is still the live session's own stays exactly as it
                // was. `nonEligibleBreakdown` (`decision-log.md` D71) is
                // replaced in lockstep, alongside `entryBreakdown` — this
                // Lot's own remaining, non-eligible lines when it genuinely
                // mixed, `null` otherwise (a plain eligible-only Lot, or step
                // 0's whole-Catalog seed, neither of which ever passes a
                // second argument at all). **Untouched by the 2026-09-17 live
                // pass** — Product-scoped entry never calls this; see
                // `onOpenAssignTagsForProduct` below.
                if (entryBreakdown) {
                  setAssignTagsEntry(entryBreakdown);
                  setAssignTagsMixedNonEligible(nonEligibleBreakdown ?? null);
                }
                // The originating operation's own origin propagates through
                // the queue (§3.6 exit 3 / §3.14) — its completion and its
                // "Terminar después" both return to it, not to Catalog view
                // unconditionally.
                setInventoryView({ mode: 'assign-tags', origin });
              }}
              onOpenAssignTagsForProduct={({ productId, origin }) => {
                // inventory.md §3.14's entry point 3 — reached from **two live
                // places as of 2026-09-19, neither of which is a settings
                // toggle**: §3.4's card-level `[ Etiquetar ]` shortcut and
                // §3.19's Level-1 `[ Etiquetar ]` action. Both carry the
                // identical label and reach the identical destination. The
                // former toggle-ON auto-open is **retired outright** (Product
                // Owner decision, reversing the 2026-09-17 behaviour): the
                // switch, now §3.19's NFC row, only ever writes the setting
                // and never navigates. Scoped strictly to this one Product —
                // never touches `assignTagsEntry`/`assignTagsMixedNonEligible`
                // (the Lot-scoped receipt, AT-M1/D71's own frozen state),
                // since this entry point shows no "Lo que registraste" line at
                // all.
                setInventoryView({ mode: 'assign-tags', scopeProductId: productId, origin });
              }}
              onSettingsTagsOnMarkerHandled={() =>
                setInventoryView((v) => (v.mode === 'catalog' ? { ...v, enteredViaSettingsTagsOn: false } : v))
              }
              assignTagsEntry={assignTagsEntry}
              assignTagsSegmentTotals={assignTagsSegmentTotals}
              onAssignTagsSegmentTotalsChange={setAssignTagsSegmentTotals}
              nfcAssignSession={nfcAssignSession}
            />
          </ScreenTransition>
        )}

        {activeTab === 'eventos' && role === 'OWNER' && (
          <ScreenTransition transitionKey="eventos">
            <EventsScreen
              view={eventsView}
              onChangeView={setEventsView}
              onNavigateToHoy={() => {
                // events.md §4: "Continuar Día N" / "Vendiendo ahora" → Hoy,
                // resumes/starts selling — identical mechanism to home.md
                // §2/§3.6, not a second selling surface.
                setActiveTab('hoy');
              }}
              onNavigateToResultados={(eventId) => {
                // events.md §3.16 "Ver resumen en Resultados" (reports.md §2
                // step 3) — lands directly on Resultados' Event detail for
                // that specific Event, skipping the main list entirely.
                setResultadosView({ mode: 'event-detail', eventId, returnTo: { mode: 'main' } });
                setActiveTab('resultados');
              }}
            />
          </ScreenTransition>
        )}

        {activeTab === 'resultados' && role === 'OWNER' && (
          <ScreenTransition transitionKey="resultados">
            <ResultadosScreen
              view={resultadosView}
              onChangeView={setResultadosView}
              onNavigateToHoy={() => setActiveTab('hoy')}
              onNavigateToEventos={() => setActiveTab('eventos')}
            />
          </ScreenTransition>
        )}

        {/* home.md §3.17 — defensive backstop only (see this component's
            own top-of-file doc comment); never reached by tapping anything
            this codebase's SELLER-facing screens actually offer. */}
        {activeTab !== 'hoy' && role !== 'OWNER' && (
          <ScreenTransition transitionKey="acceso-no-disponible">
            <AccesoNoDisponible onBack={() => setActiveTab('hoy')} onOpenAccount={() => setActiveTab('hoy')} />
          </ScreenTransition>
        )}
      </main>

      <NavBar active={activeTab} onChange={setActiveTab} visibleTabs={role === 'OWNER' ? undefined : ['hoy']} />
    </>
  );
}
