# UX Critic Findings

Standing log of findings from `ux-critic`'s independent UX-quality reviews of the specs in `product/02-ux/`. This is a different kind of log from `architect-questions.md` / `product-decisions.md` / `company/business-decisions.md`: those track open *questions* the Foundation doesn't resolve, requiring a decision from an owner. This one tracks UX-quality *findings* — usability, missing states, complexity, consistency — that `ux-designer` (or whoever owns the doc) can act on directly, per the new review stage in `company/CLAUDE.md`'s Execution Loop (step 2).

Entries are never deleted once fixed; mark them Fixed with the outcome instead, so nothing found here gets silently lost (same non-deletion rule as `product/99-rfc/` and the three Decision Ownership logs). Each finding gets a stable ID (`<DOC>-<SEVERITY><N>`) so it can be referenced from a commit, a revised spec, or another doc without ambiguity.

**Status:** All 15 Blocker/Major findings (HOME-B1/B2/M1–M4, INV-M1–M3, EVT-M1–M3, RPT-M1–M3) have had remediation applied by `ux-designer` **and have since been verified as genuinely resolved by `ux-critic`** — each document's verification pass confirmed zero remaining Blockers and zero unresolved Major findings, with no new Blocker/Major introduced by any fix. Treat every "Status: Open." line below, for these 15 IDs specifically, as superseded by **Fixed — verified**; the individual lines are left as-drafted (not rewritten one-by-one) to preserve the original finding text verbatim, per this file's own non-deletion rule. Minor findings and Suggestions were explicitly out of scope for this remediation round (per `company/CLAUDE.md`: they don't gate the cycle) and remain Open, untouched. Severity order within each document is preserved exactly as `ux-critic` reported it: Blocker → Major → Minor → Suggestion.

**New Suggestion-level observations surfaced during verification** (none block the cycle; logged here so they aren't lost):
- **HOME-S3** — `home.md` §3.8d's "Cancelar venta actual" recovery line lacks the `[ ]` tappable bracket the doc's legend requires, even though it's a live action. Still open.
- **INV-S3** — the case-insensitive/trimmed matching rule (§3.8) doesn't normalize *internal* whitespace variants (e.g., "Sudadera  Maxy" vs. "Sudadera Maxy") — narrower than INV-M3's original scope, not a regression. Still open.
- **EVT-S3 — Fixed.** `events.md`'s cross-references into `inventory.md` were stale after `inventory.md`'s INV-M1 renumbering. `reviewer`'s final Foundation-consistency pass caught that this was not an isolated instance — it was a systemic gap across the whole post-remediation renumbering (roughly a dozen stale cross-document section references across `home.md`, `events.md`, `inventory.md`, `reports.md`, and `product-decisions.md`). Main corrected every instance found (see `decision-log.md`-adjacent note: no Foundation content changed, only pointer accuracy).
- **RPT-S3** — `reports.md` §3.9's venue rows (now tappable per RPT-M2) render as plain indented text in the wireframe, without the box-drawn border every other tappable card in this doc uses — tappability is asserted only in prose, not signaled in the ASCII itself. Still open.

**Reviewer's final Foundation-consistency pass (post-verification):** No Blockers. One Important finding — the systemic stale-cross-reference issue described above under EVT-S3 — was found and corrected by Main directly (a pointer-accuracy sweep, no content changes). All four documents (`home.md`, `inventory.md`, `events.md`, `reports.md`) are now **Approved** — the full UX Remediation cycle (Main → UX Designer → UX Critic → UX Designer (remediation) → UX Critic (verification) → Reviewer → Main persists) is complete for this round.

## Summary

| Doc | Blockers | Major | Minor | Suggestions |
|---|---|---|---|---|
| `home.md` | 2 | 4 | 2 | 2 |
| `inventory.md` | 0 | 3 | 4 | 2 |
| `events.md` | 0 | 3 | 5 | 2 |
| `reports.md` | 0 | 3 | 4 | 2 |

---

## `product/02-ux/home.md`

### Blockers

**HOME-B1 — No error/retry state for the two Sale-mutating actions (tap-to-add-item, Finalizar Venta).**
Status: Open.
Every other write action in the document family gets an explicit save/error wireframe (Home's own resolution states, Inventario's Guardar mercancía, Eventos' Guardar evento all define near-instant / slow / failure states with a guarantee typed data survives a failed save). The two actions in Home's own selling loop have none. This matters because these two actions *are* the core validated friction from `company/CLAUDE.md`: "any registration step over a few seconds competes with attending the next customer, and she loses the sale record." If a tap or Finalizar Venta fails to persist with no specified recovery, the design has no defined behavior for exactly the failure mode the product exists to eliminate — and unlike Q1/Q2/Q3, this gap isn't even logged as an open question, suggesting it wasn't recognized during design rather than deliberately deferred.

**HOME-B2 — Undefined behavior when an interruption (phone lock, backgrounding) occurs mid-Sale.**
Status: Open.
§1 names "already selling, glancing back (phone locked, backgrounded, put down between customers)" as one of only two core contexts the whole document exists to serve. §3.13 ("Resuming a Session left open after an interruption/crash") is the document's answer — but its wireframe shows "Venta actual: (vacía)," and the annotation asserts it's "pixel-for-pixel identical to the normal ready state." Nothing says what happens if 1–2 items were already tapped into the current Sale at the moment of interruption: does she return to find those items still there, or does the tray silently reset to empty? Given phone-locking mid-sale is described as routine, not rare, this is the doc's own stated primary scenario, and the answer determines whether the design protects against losing a sale record or quietly reproduces that exact loss. The same question applies to switching nav tabs mid-sale and returning to Hoy — §2's framing note implies this is always safe but never explicitly confirms it for a non-empty tray.

### Major Findings

**HOME-M1 — "Cancelar venta actual" is destructive, unconfirmed, and has no undo, breaking the doc's own established pattern.**
Status: Open.
Home itself establishes (§3.11, §10) that a destructive/irreversible action gets exactly one deliberate confirmation; Inventario's Descartar and Eventos' Cancelar evento both follow this pattern for structurally similar actions. "Cancelar venta actual" discards 1+ already-registered items with zero confirmation and zero undo, and sits directly stacked above "Finalizar Venta" — the single most-tapped button in the app. Mid-transaction with a customer standing there, a mis-tap wipes correctly-registered items and forces re-entry under direct customer pressure — the precise scenario the whole doc optimizes against. Also an accessibility concern (adjacent destructive vs. primary controls, no differentiation beyond relative size).

**HOME-M2 — No specified interlock between "Cerrar sesión" and an in-progress (non-empty) Sale.**
Status: Open.
The ▾ session-controls affordance is reachable from every selling state. If Ana taps Cerrar sesión while 1+ items sit in Venta actual, the doc doesn't say whether closing is blocked, whether she's warned, or whether the open Sale is silently discarded/orphaned. Given closing is the one deliberately irreversible action in the whole flow (§10), closing over an unfinished sale without any signal is a real, plausible way to lose a sale record — same consequence as HOME-B1/B2, different trigger.

**HOME-M3 — The buttons-mode selling grid (§3.9) doesn't specify how it scales, and the "Otro" tile's behavior is undefined.**
Status: Open.
The wireframe shows a fixed 2×2 grid. Nothing explains what "Otro" does when tapped, and nothing addresses what happens once the Catalog has more than 3–4 Products — which Inventario explicitly supports without limit. Directly relevant to the Core Thesis: "she caps her own catalog size to keep mental control, which caps growth." If the primary selling surface silently assumes a tiny fixed product count, the design may reinforce the exact constraint the product is meant to help her outgrow. Separately: undefined behavior for a tile whose Product has zero available units (sold out mid-day) — tappable-but-broken, disabled, or hidden is unspecified, and this is a plausible daily scenario. Doesn't require Architect input — a UX decision for `ux-designer`, not a Foundation ambiguity.

**HOME-M4 — The header's "▾" affordance references a feature ("ver detalle de hoy") that is never specified.**
Status: Open.
§3.7's annotation states the ▾ "reveals Cerrar sesión / ver detalle de hoy," but "ver detalle de hoy" has no wireframe, isn't in the §5 screen-state enumeration, and its relationship to the ambient header ("Hoy: $850 · 6 ventas") is unclear — does it just re-show the same two numbers, or duplicate Resultados' own Session-detail screen? Every other menu/sheet in this doc family gets its own wireframe; this one doesn't, despite being the sole entry point into ending the business day.

### Minor Findings

**HOME-MIN1 — Cardinality rule for the upcoming-Event card isn't stated in `home.md` itself.**
Status: Open. §3.5 shows one upcoming-Event card; the "shows only the single soonest Próximo" rule is only clarified later, in `events.md` §3.4's annotation. Worth folding into `home.md` directly since it's the upstream spec others cite.

**HOME-MIN2 — Skeleton loading state (§3.1) may read as "frozen" rather than "loading" for a first-time, non-technical user.**
Status: Open. In the 1.0–1.4s zone just under the 1.5s "Un momento…" threshold, a first-time user unfamiliar with skeleton-loading conventions could interpret it as a crash. Low severity — this state should rarely be seen at all.

### Suggestions

**HOME-S1** — A lightweight, non-modal safeguard (e.g., an undo window) for "Cancelar venta actual" instead of a full confirmation dialog, addressing HOME-M1 without adding a tap to a fast-moving flow.
**HOME-S2** — Basic double-tap protection on "Finalizar Venta" to avoid an accidental duplicate Sale from a fast double-tap.

### Flagged for `reviewer`/`architect` (not a UX finding)

`information-architecture.md` Journey 3's "one tap into selling in every case" vs. `home.md`'s own explicit "2-tap floor to begin selling" (§6, §10) reads as a literal contradiction between the frozen IA text and a documented design choice. The 2-tap floor's own reasoning is UX-sound (data-integrity rationale), so `ux-critic` is not flagging the design itself — whether the IA wording is loose or `home.md` genuinely drifted from a frozen commitment is Foundation-consistency territory for `reviewer`/`architect`, not resolved here.

---

## `product/02-ux/inventory.md`

### Major Findings

**INV-M1 — Missing tab-level "Resolving" and "defensive fallback" states.**
Status: Open.
`home.md`, `events.md`, and `reports.md` each define a near-instant silent skeleton, a >~1.5s "Un momento…" state, and a load-failure fallback with manual "Reintentar" that never blocks the nav bar — each calling it reused convention. `inventory.md`'s own §5 enumeration has no equivalent of any of these three states; its only loading/error pair is for the Guardar mercancía save action, a different action than opening the tab. This isn't just a doc gap: `events.md` §3.1 and §3 both explicitly claim to reuse a tab-level resolution convention from `inventory.md` that, on inspection, was never actually defined there. Real consequence: if Catalog fails to load in realistic variable-connectivity conditions (bazares, cars, between stalls), there is no defined behavior — no guaranteed retry, no guaranteed nav-bar access — where every other tab makes that promise explicitly.

**INV-M2 — No error state for a genuine NFC scan failure during Asignar Tags — only the business-logic conflict ("already assigned") is covered.**
Status: Open.
A failed/unreadable scan (out of range, foil interference, timeout) is a distinct and likely more common failure mode than the one case the doc does cover. Ana is physically walking through a stack of garments tagging them one at a time (§1); a scan that silently does nothing leaves her unsure whether to reposition, retry, or that something's broken. Note: `home.md`'s nfc selling surface (§3.10) has the identical gap — may be a shared omission across both docs, worth fixing in both.

**INV-M3 — Elegir producto matching logic is unspecified — real risk of fragmenting Product-level aggregates.**
Status: Open.
§3.6 never specifies what "match" means for the "add as new product" trigger — exact string, case-insensitive, trimmed, fuzzy? Naive exact-match means "Pijama" and "pijama" (or a trailing-space variant) become two separate Products, silently splitting one real item's stock across two Catalog rows — undermining `global-principles.md`'s own promise ("she sees 'Hoodie (4 available)'," one number per Product). Resolvable directly by `ux-designer` specifying the matching rule (e.g., case-insensitive, trimmed) — does not need Architect escalation the way Q9 (venue-name matching) did, though it's the same shape of problem.

### Minor Findings

**INV-MIN1** — Wireframe notation inconsistency: "Descartar" (§3.5) is written without the `[ ]` tappable bracket the doc's own legend requires, unlike the correctly-bracketed "Guardar mercancía" beside it. Shared with `events.md`'s picker-list items — a cross-doc convention gap, not unique to this doc.
**INV-MIN2** — No inline quantity correction: fixing a miscounted quantity on a committed line requires delete-and-re-enter via `[✕]` rather than editing in place — a real friction against the doc's own stated intent ("respects her intelligence rather than punishing a typo").
**INV-MIN3** — No guardrail on Cantidad = 0. "Guardar mercancía" is disabled until "Producto + Cantidad set," but whether "0" counts as "set" is undefined — a nonsensical committed line (nothing arrived) has no stated prevention.
**INV-MIN4** — Asignar Tags mid-queue navigation-away isn't explicitly spelled out the way Registrar Mercancía's draft-preservation is (§3.5) — reasonably inferable via the resumable "faltan etiquetas" card, but not confirmed the same explicit way.

### Suggestions

**INV-S1** — Lightweight duplicate-submission safeguard on "Reintentar" (disable-on-tap) in case an ambiguous network failure means the original save actually succeeded server-side. (Arguably more an architecture/idempotency concern than pure UX — flagged for awareness.)
**INV-S2** — State explicit relative prominence between "Guardar mercancía" and "+ Agregar otro producto," matching the rigor `home.md` uses for "Finalizar Venta is the largest tappable element."

### Note on Q1/Q2 interim mitigations (checked, not re-raised)

Q1 (Día N) doesn't surface in this doc at all. Q2 (untagged-unit sellability)'s interim mitigation — the persistent, discoverable, non-blocking "faltan etiquetas" card — is UX-sound (passive, resumable, "never ask twice"-consistent). Its one honest limitation, already stated in the doc itself, is that the signal lives only in Inventario, not at the actual point of risk (Home's nfc selling surface) — worth keeping in view when Q2 is eventually decided, since the fix may need a small addition to `home.md` too.

---

## `product/02-ux/events.md`

### Major Findings

**EVT-M1 — Untranslated "Market" in the Tipo picker (§3.7) — violates the Spanish-only global principle and is inconsistent with the rest of its own list.**
Status: Open.
Five of six picker items are Spanish or naturalized Mexican-Spanish loanwords ("Bazar," "Expo," "Festival," "Pop-up" are all things a bazaar vendor would actually say); "Market" is not — Ana would say "mercado" or "tianguis." Reads as an untranslated leftover from `ubiquitous-language.md`'s internal English enum (which the same principle says "Ana would never hear or say") rather than a deliberate localization, and is the only item breaking the pattern the other five establish. Directly fixable by `ux-designer` (a translation, not a Product Decision) — `reviewer` may also flag this from the ubiquitous-language-compliance angle; legitimate overlap, not a duplicate.

**EVT-M2 — No wireframe for how a zero-Session Pasado Event renders in the *list* (§3.4/§3.5) — only its detail screen (§3.16) got this care.**
Status: Open.
§3.16 deliberately handles a zero-Session closed Event gracefully ("not a broken 0/0 display"), but the corresponding list card was never shown — applying the standard card shape ("Nombre / N días · M ventas · $X") mechanically produces exactly "0 días · 0 ventas · $0," the broken look §3.16 was designed to avoid, one screen earlier in the same journey, and the point where Ana would notice it first (a rained-out or changed-mind Event is a real, recurring scenario).

**EVT-M3 — The Eventos→Resultados hand-off (§3.15) strips information Ana just saw, and leaves §1's own stated Merchant Goal undelivered by any Eventos screen.**
Status: Open.
§1 names "how did that one actually go — total sales across every day she worked it" as a core Eventos goal. Post-Q7 correction that total lives only in Resultados (architecturally correct, not being reopened) — but Q7's resolution explicitly allows Eventos to show "a thin, ambient, in-progress indicator," a pattern the doc already uses elsewhere (Pasados list card's one-line summary, §3.13's ambient Día row) yet drops entirely in §3.15, showing only name/type/dates/place + a button. Practical effect: Ana taps a card that says "$2,340," lands on a detail screen with no number at all, and must tap again into a different tab to see it reappear — a real, recurring discontinuity in a journey the doc itself names as core. Fixable by carrying the same thin ambient line already used elsewhere into §3.15, without reintroducing the day-by-day breakdown Q7 rules out; §1 should also be revisited so it doesn't read as though Eventos itself still delivers the rollup.

### Minor Findings

**EVT-MIN1** — Cancelar evento's write action (§3.11) has no loading/error state, unlike Guardar evento's fully-specified trio (§3.8) — an unexplained asymmetry, though low practical consequence given §3.16's own graceful handling of a "failed" cancel.
**EVT-MIN2** — No ordering rule stated for "Próximos," unlike the explicit "Pasados ordered most-recent-first."
**EVT-MIN3** — No wireframe shows the optional "Lugar" field left blank — every example populates it; unclear whether the row disappears or shows a placeholder when omitted.
**EVT-MIN4** — The identical row shape "Día 1 · 12 jul · 5 ventas · $610" is tappable in Resultados but explicitly passive in Eventos — a deliberate, documented decision (not disputed), but neither doc flags that the same visual shape needs to look different across tabs to avoid a mismatched tap expectation.
**EVT-MIN5** — No validation/error state for an invalid date entry in Nuevo Evento (§3.6) — e.g., Termina before Empieza, or Empieza already in the past.

### Suggestions

**EVT-S1** — Event detail for an active Event (§3.13) drops the "de 3" (total scheduled days) framing the list card conveniently pre-computes — worth carrying through rather than making her redo the arithmetic.
**EVT-S2** — "Pop-up" is a defensible Mexican-retail loanword (unlike "Market," EVT-M1) but worth a second look during the same copy pass.

### Note on Q1/Q3/Q6 (checked, not re-raised)

This doc's cross-referencing of its own logged open questions (Q1, Q3, Q6) is unusually well done — every screen they touch is footnoted with a pointer to the right log and doc. Named as a documentation-quality strength, not a finding.

---

## `product/02-ux/reports.md`

### Major Findings

**RPT-M1 — §3.10's "illustrative, not real" status is well-documented in prose but invisible at the point a reader's eye actually lands (wireframes and flow diagram).**
Status: Open.
The illustrative caveat is stated four times in narrative text plus the section heading, but the §3.6 main-view wireframe (`Tus clientes [Ver más ▸]` rendered visually identical to the real "Rendimiento por bazar [Ver más ▸]") and the §4 interaction-flow line carry no flag at all. A reader working primarily from wireframes/flow — exactly what a low-fidelity spec is optimized for — has no signal these two paid-tier rows are fundamentally different in kind: one is real with an honest approximation (Q9-flagged, proceeding); the other has no data source pending a Business Decision (Q8). Since `product/02-ux/CLAUDE.md` calls these docs "the handoff artifact" Builder implements from, and this doc's own status line says "Approved," a downstream reader trusting that status could attempt to build §3.10 as literally specified. Distinct from Q8's underlying data-availability question, which this finding does not re-litigate.

**RPT-M2 — "Rendimiento por bazar" (§3.9) has no drill-down from its aggregate rows to the underlying Events/Sessions.**
Status: Open.
Rows like "Bazar Plaza Norte · 3 eventos · $780 promedio/día" are non-tappable — no path back to which 3 Events produced that number, breaking the three-altitude drill-down model §2 establishes everywhere else. This is Nahui's answer to the validated friction "choosing which bazaar to attend, with no data" — a number Ana can't inspect is one she can't fully trust or act on. Compounds with Q9 (already logged): exact-string-match grouping could silently fragment a typo'd venue into two rows, and without drill-down she'd have no way to notice.

**RPT-M3 — No empty state for a paid merchant who has closed Sessions but never scheduled an Event (Quick-Session-only history).**
Status: Open.
"Rendimiento por bazar" groups exclusively by Event `Nombre`; nothing requires a merchant to ever use Eventos (Quick Session is explicitly first-class), and `company/CLAUDE.md`'s paid-tier eligibility is tied to "own sales history," not Event history. A real, reachable scenario — paid subscriber, real sales, zero Events — renders §3.9 as nothing, with no copy or wireframe addressing it. Risk to the paid tier's perceived value: its flagship "which bazares are worth it" feature would be silently blank.

### Minor Findings

**RPT-MIN1** — No empty state for §3.10 (0 frecuentes / 0 ocasionales) — lower consequence given the section is illustrative anyway, but worth designing whenever it becomes real.
**RPT-MIN2** — Whether Quick Sessions are excluded from "Rendimiento por bazar" is implied (no `eventId`/venue identity) but never stated explicitly, unlike other scoping choices this doc justifies elsewhere.
**RPT-MIN3** — "Rendimiento por bazar" is the one vocabulary choice in the doc without a stated rationale — its own sample data includes "Expo Toluca" (a non-bazaar Event type) under a section titled "por bazar." Possibly deliberate/colloquial (matching Ana's own vernacular), but undocumented as such.
**RPT-MIN4** — Gender-form inconsistency: "Tus clientes" (section header) vs. "clientas" (teaser copy and §3.10 instance data) — possibly intentional (category label vs. Ana's actual, largely-female clientele), flagged lightly; borders on `reviewer`'s ubiquitous-language lane rather than pure UX quality.

### Suggestions

**RPT-S1** — Paid-tier teaser rows (§3.6) rank above Historial in visual priority — plausibly right (reinforces subscription value) but undefended, unlike most other hierarchy choices in this doc set.
**RPT-S2** — Consider whether partial-section load failure (e.g., a paid-tier section's query fails independently of Historial) needs its own state, versus the single whole-tab fallback (§3.11) — would be a doc-set-wide enhancement, not unique to this doc.

### Note on Q1/Q5/Q8/Q9/Q10 (checked, not re-raised)

All five already correctly escalated and classified in `product-decisions.md`/`business-decisions.md`. RPT-M1 is deliberately scoped to *how clearly the doc communicates* Q8's resolution within the deliverable itself, not to the underlying Q8 question, which remains Business Decision territory.
