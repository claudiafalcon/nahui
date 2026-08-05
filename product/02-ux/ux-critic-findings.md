# UX Critic Findings

Standing log of findings from `ux-critic`'s independent UX-quality reviews of the specs in `product/02-ux/`. This is a different kind of log from `architect-questions.md` / `product-decisions.md` / `company/business-decisions.md`: those track open *questions* the Foundation doesn't resolve, requiring a decision from an owner. This one tracks UX-quality *findings* — usability, missing states, complexity, consistency — that `ux-designer` (or whoever owns the doc) can act on directly, per the new review stage in `company/CLAUDE.md`'s Execution Loop (step 2).

Entries are never deleted once fixed; mark them Fixed with the outcome instead, so nothing found here gets silently lost (same non-deletion rule as `product/99-rfc/` and the three Decision Ownership logs). Each finding gets a stable ID (`<DOC>-<SEVERITY><N>`) so it can be referenced from a commit, a revised spec, or another doc without ambiguity.

**Status:** All 15 Blocker/Major findings (HOME-B1/B2/M1–M4, INV-M1–M3, EVT-M1–M3, RPT-M1–M3) are Fixed and verified — see each finding's own status line below for its specific remediation and cross-reference. Severity order within each document is preserved exactly as `ux-critic` reported it: Blocker → Major → Minor → Suggestion. Minor findings and Suggestions were explicitly out of scope for this remediation round (per `company/CLAUDE.md`: they don't gate the cycle) and remain Open, untouched.

**Lifecycle audit (2026-08-02):** `reviewer` independently verified all 15 IDs below against the actual content of `home.md`/`inventory.md`/`events.md`/`reports.md` on disk (not just this log's own narrative) — each has concrete, specific remediation evidence and an explicit "verified clean by `ux-critic`" statement at the owning document's status header. The per-finding `Status: Open.` lines were simply never updated after the fact — a documentation-hygiene gap, not an unresolved-work gap. Corrected below.

**New Suggestion-level observations surfaced during verification** (none block the cycle; logged here so they aren't lost):
- **HOME-S3** — `home.md` §3.8d's "Cancelar venta actual" recovery line lacks the `[ ]` tappable bracket the doc's legend requires, even though it's a live action. Still open.
- **INV-S3** — the case-insensitive/trimmed matching rule (§3.8) doesn't normalize *internal* whitespace variants (e.g., "Sudadera  Maxy" vs. "Sudadera Maxy") — narrower than INV-M3's original scope, not a regression. Still open.
- **EVT-S3 — Fixed.** `events.md`'s cross-references into `inventory.md` were stale after `inventory.md`'s INV-M1 renumbering. `reviewer`'s final Foundation-consistency pass caught that this was not an isolated instance — it was a systemic gap across the whole post-remediation renumbering (roughly a dozen stale cross-document section references across `home.md`, `events.md`, `inventory.md`, `reports.md`, and `product-decisions.md`). Main corrected every instance found (see `decision-log.md`-adjacent note: no Foundation content changed, only pointer accuracy).
- **RPT-S3** — `reports.md` §3.9's venue rows (now tappable per RPT-M2) render as plain indented text in the wireframe, without the box-drawn border every other tappable card in this doc uses — tappability is asserted only in prose, not signaled in the ASCII itself. Still open.

**Reviewer's final Foundation-consistency pass (post-verification):** No Blockers. One Important finding — the systemic stale-cross-reference issue described above under EVT-S3 — was found and corrected by Main directly (a pointer-accuracy sweep, no content changes). All four documents (`home.md`, `inventory.md`, `events.md`, `reports.md`) are now **Approved** — the full UX Remediation cycle (Main → UX Designer → UX Critic → UX Designer (remediation) → UX Critic (verification) → Reviewer → Main persists) is complete for this round.

**Session-scoped selling mode (D23/RFC 0003) amendment cycle — `home.md` and `inventory.md`:** Both docs were amended to apply D23 (Selling Mode Capability / Default Selling Mode / Session Operating Mode / NFC Readiness). `inventory.md` (cross-reference/terminology only) had zero findings. `home.md` (moderate amendment: §2 resolution logic, new §3.6a) took four remediation rounds:
- **HOME2-MAJ1 — Fixed, verified.** §2's "Ready" bullet dropped the `nfc ∈ registrationMode` capability-gate check D23 itself requires — a real gap: a Business with a revoked NFC capability but a stale `defaultSellingMode = nfc` and leftover tagged inventory above threshold could have silently opened a Session in an unavailable mode, per the doc's original wording. Fixed by adding the capability check to the Ready branch, falling through to `buttons` when it fails.
- **HOME2-MAJ2 — Fixed, verified.** §2's prose conflated "NFC Readiness evaluated" with "Session.operatingMode committed," contradicting §3.6a's own wireframes (recommendation visible pre-tap) and §6's footnote (override happens before the Session-start tap). Fixed by explicitly separating "evaluated ambiently, every Home open" from "committed only at the Session-start tap."
- **HOME2-MAJ3 — Fixed, verified.** The MAJ1 fix itself introduced a new gap: the capability-revoked case fell through to `buttons` *silently*, contradicting the doc's own stated reasoning for why the near-identical Not Ready case needs a one-time mention (arguably more so — a revoked capability is invisible to Ana, unlike untagged inventory she can see for herself). Fixed by adding a third §3.6a variant, mention-only, deliberately without a next-step link since no Settings/subscription-management screen exists yet (blocked on Q5).
- **HOME2-MAJ4 — Fixed, verified.** The MAJ3 fix left one stale sentence in §10 ("Limited Ready and Not Ready are the only two cases...") contradicting the rest of the same bullet, which went on to describe the new third case. One-clause fix.
- **HOME2-MIN2 — Fixed.** Limited Ready lacked the explicit "silent when matching default" symmetry statement Not Ready already had. Added.
- **HOME2-MIN4 — Fixed.** New tappable lines in §3.6a ("Usar tags de todos modos," "Cambiar," "Asignar tags") weren't wrapped in the doc's own `[ ]` tappable-bracket convention. Added.
`reviewer`'s final Foundation-consistency pass on both docs: zero Blockers, zero Important findings — confirmed the capability-level (`inventory.md`) vs. Session-level (`home.md`) split is correct against the bounded-context table, not just internally consistent, and confirmed the Q5 framing in the new capability-revoked case is accurate. Both `home.md` and `inventory.md` folded back to plain Approved.

**`onboarding.md` — first document written and reviewed from a blank slate.** First-draft review found one Blocker and one Major, plus three Minors:
- **ONB-B1 — Fixed, verified.** "Ver un ejemplo primero" was styled as the lightest-weight, least-committal of three Onboarding paths, but tapping it wrote a permanent, non-convertible Business (per D19/D13) — the flow disclosed this only *after* the irreversible write, on a screen designed to auto-continue. The path's own name ("see an example *first*") implied a two-step "preview, then still choose for real" sequence that never existed. Fixed by renaming the path to "Ver un ejemplo" and adding a new confirmation screen (§3.4c, mirroring the existing NFC path's pause-point shape) that states the permanence fact plainly, with a real escape hatch, before any write happens.
- **ONB-M1 — Fixed, verified.** The "Todo listo" milestone screen (§3.6) was silently excluded from the doc's own interruption/resume contract — by the doc's original definition, Onboarding counted as "complete" the instant capabilities were written, before the milestone was ever shown, so an interruption exactly there would silently skip it forever with no acknowledgment this was possible. Fixed by narrowing what "complete" means for resume-check purposes specifically: capabilities written is necessary but not sufficient; the milestone must also have been dismissed.
- **ONB-MIN1 — Fixed.** No kit-prerequisite cue on the first screen before tapping "Activar kit NFC." Added subtext.
- **ONB-MIN2 — Fixed.** Several tappable text-only links weren't bracketed. Added.
- **ONB-MIN3 — Fixed.** No atomicity guarantee stated for the shared Business-creation write (relevant to the demo path's bundled seed generation). Added.
- **ONB-MIN4 (new, surfaced during verification) — Fixed.** The ONB-B1 remediation's own rationale text overclaimed that the new kit-prerequisite subtext also carried the no-charge reassurance forward — it didn't; these are two distinct facts. Corrected the prose to avoid a future editor concluding the §3.4 cost line was now redundant.
`reviewer`'s Foundation-consistency pass: no Blockers, three Important findings, all corrected by Main directly — an overbroad "Onboarding never writes into Selling" claim (narrowed to "never fabricates a live, already-open Session"; the demo path's seed generation does write historical Inventory/Selling data, a distinct concern), an unstated minimum for the demo seed's content (the richest-capability justification only holds if the seed actually clears NFC Readiness's threshold and includes ≥1 recorded Claim — now stated explicitly in §11), and a stale `events.md` §3.8 cross-reference (should be §3.9, post-Venue-picker renumbering — a pre-existing drift inherited from `home.md`, which carried the same stale reference in two places; fixed in both files). `onboarding.md` is now Approved.

**Customer Segmentation (Q8) resolution cycle — "Tus clientes" real spec:** `reports.md`'s illustrative "Tus clientes" section was replaced with a real spec against the resolved Q8 architecture (`product/99-rfc/0002-loyalty-claim-complete-capability.md`, `decision-log.md` D22). Findings from this round:
- **RPT2-MAJ1 — Fixed, verified.** Four instances of "quiénes son tus clientas frecuentes..." copy (§3.4, §3.5, §3.6, §3.13) over-promised identity-level information — the architecture only ever exposes anonymized aggregate counts (Derived Customer Intelligence), never a way to tell which specific customer is which. Given Ana's own validated friction is literally "I can't tell who my repeat customers are" (`company/CLAUDE.md`), this was a real, foreseeable expectation break, not a stylistic nitpick. `ux-designer` reworded all four to a count/category framing ("cuántas son... y cuántas..."); `ux-critic`'s verification pass confirmed all four fixed, no new instance introduced, natural Spanish preserved, and no unrelated drift elsewhere in the file.
- **RPT2-MIN1 — Fixed.** `inventory.md` §3.18 cited `reports.md` §3.13 (stale — that section is now "Tus clientes — sin datos aún" after this update's renumbering; the load-failure fallback moved to §3.14). Corrected directly by Main, two one-line pointer fixes.

**Venue aggregate root cycle (`decision-log.md` D20, `product/99-rfc/0001-venue-entity.md`):** `events.md` (new Elegir lugar picker, §3.7) and `reports.md` (Rendimiento por bazar regrouped by `venueId`) were updated to apply Venue, then run back through `ux-critic` for a targeted review of the Venue-specific changes only. Result: **zero Blockers, zero Major findings** — this cycle proceeded straight to `reviewer` without a remediation pass. Findings from this review:
- **VEN-MIN1 — Fixed.** `events.md` §10's own enumeration of screens now showing `Venue.displayName` omitted §3.17 (`Event detail — closed/past, zero Sessions`), which also renders the Venue headline. Corrected directly (one-line addition), no remediation cycle needed for a documentation-completeness gap this small.
- **EVT-MIN3 — Superseded, moot.** Described a scenario ("no wireframe shows the optional 'Lugar' field left blank") that referred to the old freeform address field, since fully retired — Lugar is now a required Venue reference, so this finding no longer maps to anything in the current spec. Left in place below per this file's non-deletion rule, marked superseded rather than rewritten.
- **VEN-S1 (Suggestion)** — Neither the new Elegir lugar picker (`events.md` §3.7) nor Inventario's Elegir producto (`inventory.md` §3.8) specifies its zero-existing-entries state (a brand-new Business's first-ever Event/Lot). Pre-existing, symmetric gap in both pickers — not new, not Venue-specific; if ever addressed, address both together.
- **Flagged for Main, not a finding against `events.md`/`reports.md`** (at the time): `home.md` was outside this update's scope and still rendered the compound string "Bazar Plaza Norte" in its session-header wireframes — the same Type+Place-in-one-field composition `events.md` §10 names as the anti-pattern Venue exists to retire. **Fixed.** The follow-up this note deferred happened during `home.md`'s Medium-Fidelity Figma review: `reviewer` caught it as an Important finding (the drift had propagated into 13 Figma frames), `ux-designer` found and corrected all 14 instances in `product/02-ux/home.md` itself, Main applied them. See `home.md`'s own status header and `product/02b-medium-fidelity/home.md` for the record.

**`reviewer`'s Foundation-consistency pass:** No Blockers. Venue's application itself — aggregate ownership, the required (non-nullable) `venueId` reference, retirement of Nombre/Lugar, the picker's fidelity to `inventory.md`'s Product-picker pattern, `reports.md`'s `venueId`-based grouping, and the explicit non-scope of Venue management — is a clean, faithful application of D20/RFC 0001; no ubiquitous-language violations, aggregate-boundary violations, or duplicated responsibility found. Two Important findings, both stale cross-document section references left behind by this cycle's renumbering of `events.md` (a gap in the *other* direction from the one the targeted `ux-critic` pass already checked — other docs' pointers *into* `events.md`, not `events.md`'s own pointers out): `inventory.md` §3.18 citing `events.md §3.17` (should be §3.18, corrected by Main), and `home.md` line 221 citing `events.md §3.15/§10` (should be §3.16/§10, corrected by Main). Both were one-line pointer fixes, no content changes. **This closes the Venue remediation cycle — `events.md` and `reports.md` remain Approved, now reflecting the Venue aggregate root.**

**`settings.md` — sixth and final Low-Fidelity document, three remediation rounds.** First full draft found zero Blockers but three Major findings:
- **SET-M1 — Fixed, verified.** Two instances of "cuáles"/identity-implying client-tracking copy — the same over-promise `reports.md` already corrected once (RPT2-MAJ1). Fixed to count/category framing ("cuántas... y cuántas"), reusing `reports.md`'s exact phrasing.
- **SET-M2 — Fixed, verified (round 1).** §2.1's "every Home header state" entry-point claim silently omitted four real `home.md` states (§3.1/§3.2 resolving, §3.12 close-summary, §3.14 defensive fallback) rather than naming them as deliberately excluded. Fixed by naming all four with a one-line reason each.
- **SET-M3 — Fixed, verified.** No acknowledgment anywhere that a pending capability change landing was ever surfaced to Ana beyond a pull-based main-view banner. Fixed by naming the gap explicitly and, in a later round, adding a concrete one-time in-surface acknowledgment mechanism.

Round 1's restructuring (consolidating from ~23 states into a leaner two-generic-template shape) itself introduced two regressions, caught by `ux-critic`'s verification pass:
- **SET-B1 — Fixed, verified.** "Activar venta con tags" had been folded into the generic immediate-effect template, silently dropping the required NFC-kit activation-code confirmation step `decision-log.md` D19 actually specifies — a real, Foundation-mandated mechanism, not a nicety. Fixed by giving it its own dedicated path, reusing `onboarding.md` §3.4–§3.4b verbatim.
- **SET-M4 — Fixed, verified.** "Activar plan de pago" lost all reference to the external payment it depends on. Fixed by restoring an explicit (channel-unnamed) payment-confirmation statement.

Round 2's fix for SET-B1/SET-M4 then itself reverted SET-M2 back to a worse-than-original claim (entry point reachable only during active Sessions — the exact problem the first review's own lead finding had caught) and reintroduced SET-M1's identity-implying copy in a new spot ("quiénes son tus clientas frecuentes"). Both caught by `ux-critic`'s next verification pass and corrected in round 3, restoring the round-1-verified text for SET-M2 exactly and applying the SET-M1 fix pattern to the new location. One residual Minor from round 3 (a stale `§3.3`→`§3.3a` cross-reference left by the round's own renumbering) — fixed directly, did not block progression to `reviewer`.

`reviewer`'s Foundation-consistency pass caught one further Blocker: the "Activar plan de pago" and "Activar clientes frecuentes" copy both promised Customer Segmentation as an unconditional consequence of activating only one of the two capabilities, contradicting `decision-log.md` D22's joint-gating rule (`subscriptionTier=paid` **and** `loyaltyEnabled=true` together) — a rule `reports.md` itself already states correctly. Fixed by reusing `reports.md` §3.4/§3.5's own conditional phrasing verbatim in both copy blocks. One Suggestion-level citation-precision note (a quote attributed to the wrong `onboarding.md` section) also fixed. Re-verified clean — zero Blockers, zero Important findings. **`settings.md` is now Approved**, closing the Low-Fidelity UX phase (all six merchant-facing documents complete).

## Summary

| Doc | Blockers | Major | Minor | Suggestions |
|---|---|---|---|---|
| `home.md` | 2 | 4 | 2 | 2 |
| `inventory.md` | 0 | 3 | 4 | 2 |
| `events.md` | 0 | 3 | 5 | 2 |
| `reports.md` | 0 | 3 | 4 | 2 |
| `onboarding.md` | 1 | 1 | 4 | 1 |
| `settings.md` | 2 | 5 | 6 | 4 |

---

## `product/02-ux/home.md`

### Blockers

**HOME-B1 — No error/retry state for the two Sale-mutating actions (tap-to-add-item, Finalizar Venta).**
Status: Fixed — verified. `home.md` §3.8a (tap-to-add sync states) and §3.8c/§3.8d (Finalizar Venta saving/error states) give both Sale-mutating actions an explicit near-instant/slow/error sequence, matching Guardar mercancía/Guardar evento — see `home.md`'s status header and its inline "resolves HOME-B1" annotations.
Every other write action in the document family gets an explicit save/error wireframe (Home's own resolution states, Inventario's Guardar mercancía, Eventos' Guardar evento all define near-instant / slow / failure states with a guarantee typed data survives a failed save). The two actions in Home's own selling loop have none. This matters because these two actions *are* the core validated friction from `company/CLAUDE.md`: "any registration step over a few seconds competes with attending the next customer, and she loses the sale record." If a tap or Finalizar Venta fails to persist with no specified recovery, the design has no defined behavior for exactly the failure mode the product exists to eliminate — and unlike Q1/Q2/Q3, this gap isn't even logged as an open question, suggesting it wasn't recognized during design rather than deliberately deferred.

**HOME-B2 — Undefined behavior when an interruption (phone lock, backgrounding) occurs mid-Sale.**
Status: Fixed — verified. `home.md` §3.13 now explicitly specifies both the empty-tray and non-empty-tray interruption/resume cases — Venta actual is always a read of the Sale's true server-confirmed state — see `home.md`'s inline "resolves HOME-B2" annotations.
§1 names "already selling, glancing back (phone locked, backgrounded, put down between customers)" as one of only two core contexts the whole document exists to serve. §3.13 ("Resuming a Session left open after an interruption/crash") is the document's answer — but its wireframe shows "Venta actual: (vacía)," and the annotation asserts it's "pixel-for-pixel identical to the normal ready state." Nothing says what happens if 1–2 items were already tapped into the current Sale at the moment of interruption: does she return to find those items still there, or does the tray silently reset to empty? Given phone-locking mid-sale is described as routine, not rare, this is the doc's own stated primary scenario, and the answer determines whether the design protects against losing a sale record or quietly reproduces that exact loss. The same question applies to switching nav tabs mid-sale and returning to Hoy — §2's framing note implies this is always safe but never explicitly confirms it for a non-empty tray.

### Major Findings

**HOME-M1 — "Cancelar venta actual" is destructive, unconfirmed, and has no undo, breaking the doc's own established pattern.**
Status: Fixed — verified. `home.md` §3.8b adds a dedicated inline confirm step for "Cancelar venta actual," matching the doc's own one-confirmation pattern for destructive actions — see `home.md`'s inline "resolves HOME-M1" annotations.
Home itself establishes (§3.11, §10) that a destructive/irreversible action gets exactly one deliberate confirmation; Inventario's Descartar and Eventos' Cancelar evento both follow this pattern for structurally similar actions. "Cancelar venta actual" discards 1+ already-registered items with zero confirmation and zero undo, and sits directly stacked above "Finalizar Venta" — the single most-tapped button in the app. Mid-transaction with a customer standing there, a mis-tap wipes correctly-registered items and forces re-entry under direct customer pressure — the precise scenario the whole doc optimizes against. Also an accessibility concern (adjacent destructive vs. primary controls, no differentiation beyond relative size).

**HOME-M2 — No specified interlock between "Cerrar sesión" and an in-progress (non-empty) Sale.**
Status: Fixed — verified. `home.md` §3.11a adds a hard interlock blocking "Cerrar sesión" whenever Venta actual holds 1+ items — see `home.md`'s inline "resolves HOME-M2" annotations.
The ▾ session-controls affordance is reachable from every selling state. If Ana taps Cerrar sesión while 1+ items sit in Venta actual, the doc doesn't say whether closing is blocked, whether she's warned, or whether the open Sale is silently discarded/orphaned. Given closing is the one deliberately irreversible action in the whole flow (§10), closing over an unfinished sale without any signal is a real, plausible way to lose a sale record — same consequence as HOME-B1/B2, different trigger.

**HOME-M3 — The buttons-mode selling grid (§3.9) doesn't specify how it scales, and the "Otro" tile's behavior is undefined.**
Status: Fixed — verified. `home.md` §3.9's grid is now explicitly unbounded and scrollable, the undefined "Otro" tile was removed, and sold-out tiles get a defined dimmed state — see `home.md`'s inline "resolves HOME-M3" annotations.
The wireframe shows a fixed 2×2 grid. Nothing explains what "Otro" does when tapped, and nothing addresses what happens once the Catalog has more than 3–4 Products — which Inventario explicitly supports without limit. Directly relevant to the Core Thesis: "she caps her own catalog size to keep mental control, which caps growth." If the primary selling surface silently assumes a tiny fixed product count, the design may reinforce the exact constraint the product is meant to help her outgrow. Separately: undefined behavior for a tile whose Product has zero available units (sold out mid-day) — tappable-but-broken, disabled, or hidden is unspecified, and this is a plausible daily scenario. Doesn't require Architect input — a UX decision for `ux-designer`, not a Foundation ambiguity.

**HOME-M4 — The header's "▾" affordance references a feature ("ver detalle de hoy") that is never specified.**
Status: Fixed — verified. `home.md` §3.7a gives the ▾ session-controls sheet its own wireframe; the undesigned "ver detalle de hoy" reference was removed — see `home.md`'s inline "resolves HOME-M4" annotations.
§3.7's annotation states the ▾ "reveals Cerrar sesión / ver detalle de hoy," but "ver detalle de hoy" has no wireframe, isn't in the §5 screen-state enumeration, and its relationship to the ambient header ("Hoy: $850 · 6 ventas") is unclear — does it just re-show the same two numbers, or duplicate Resultados' own Session-detail screen? Every other menu/sheet in this doc family gets its own wireframe; this one doesn't, despite being the sole entry point into ending the business day.

**HOME-Q1 — No success confirmation after Finalizar Venta, distinguishable from "cancelled" or "nothing happened yet."** (Product Owner-raised, 2026-08-04)
Status: Fixed — verified. `home.md` §3.8e adds an ambient "Venta finalizada ✓" confirmation, distinct from both fresh-Session-start and post-cancellation states, matching the sibling-doc confirmation pattern — see `home.md`'s §4/§5/§10 updates.
Per §3.7/§3.8/§3.8c/§4, a successful Finalizar Venta produces exactly one visible effect: the tray clears back to the plain "Venta actual: (vacía)" resting state — the identical screen shown (a) at fresh Session-start before anything is sold, and (b) immediately after cancelling a sale via §3.8b. No transient text, icon, or ambient acknowledgment marks the moment of success anywhere in the spec; the only differentiating signal is the passive, low-salience header total ("Hoy: $850 · 6 ventas"), which requires already remembering the prior number to notice a change. This breaks pattern with every other successful write action in the document family, each of which gets an explicit ambient confirmation at zero tap cost: Inventario's "Mercancía registrada ✓" (§3.12), "Mercancía lista para vender ✓" (§3.13), Eventos' "Evento agendado ✓" (§3.10). Finalizar Venta — the single highest-frequency, most consequential write action in the product, directly tied to `company/CLAUDE.md`'s Core Thesis friction #1 ("she loses the sale record") — is the only one of these four that gets none of that treatment, despite §3.8 itself calling it "the one deliberate boundary marker... the only thing worth ceremony." Not a request to reopen §11's already-deferred "undo toast" (a different, reversal-oriented mechanism, correctly scoped out separately) — this is the narrower, more basic absence of any positive acknowledgment of success at all. Fixable by `ux-designer` directly; no Foundation ambiguity.

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
**Resolved — `decision-log.md` D28.** Architect confirmed no real contradiction: IA's line describes reaching the selling screen (a navigation fact), not the total taps to register a first item once there. `information-architecture.md` wording corrected; `home.md`'s 2-tap floor stands unchanged as the actual step-count commitment of record.

### Settings-entry-point amendment (`settings.md` §2.1) — findings

Raised while closing a gap Architect's build-readiness review found: `settings.md` §2.1 specified that Home's header should gain a "▾"-driven route to Configuración from all four non-Session states, but the amendment was never applied to `home.md` until this cycle.

**HOME2-MAJ1 — §3.6a's three Session-start-moment variants never got the "▾" affordance, contradicting their own "pixel-identical to §3.4/§3.5/§3.6" claim.**
Status: Fixed — verified. All three §3.6a wireframes now show "▾" in the header, and every cross-reference this amendment added explicitly includes §3.6a rather than silently excluding it.

**HOME2-MAJ2 — §3.6a's "Capability revoked" design note was factually stale, justifying withholding a next-step link on grounds (Settings undesigned, Q5 Open) that no longer held once `settings.md` was Approved and Q5 Resolved (D25).**
Status: Fixed — verified. The variant now includes an "Ir a Configuración" link and an updated design note. **Superseded almost immediately** — see the note in `home.md`'s own status header: the Product Owner has since corrected the underlying capability model this fix assumed (no activation-code mechanism exists), so this variant is expected to need a further revision; tracked under the in-progress Architect assessment, not reopened as a UX finding here.

**HOME2-MAJ3 — §10's HOME-M4 bullet self-contradicted, claiming "exactly one live entry" while forward-referencing the very next bullet describing a second.**
Status: Fixed — verified.

**HOME2-MIN1 — §3.6b's section placement (between §3.6 and §3.6a) was an awkward read order, likely contributing to §3.6a being missed in the initial pass.**
Status: Fixed — verified. Renamed §3.6b → §3.6c and relocated to follow §3.6a; §5's enumeration reordered to match.

**HOME2-MIN2 — A stale Q5 citation survived in §3.6a's "Copy stays deliberately plain" bullet, caught during the verification pass (misattributed a disclosure-content question to Q5, which never covered it).**
Status: Fixed — verified.

`reviewer`'s Foundation-consistency pass on the completed cycle found zero Blockers and two Important documentation-hygiene findings (a stale `information-architecture.md` citation, and this status log itself not yet reflecting the cycle) — both addressed alongside this entry.

---

## `product/02-ux/inventory.md`

### Major Findings

**INV-M1 — Missing tab-level "Resolving" and "defensive fallback" states.**
Status: Fixed — verified. `inventory.md` §3.1/§3.2/§3.18 now define the tab-level near-instant/slow/defensive-fallback states, matching `home.md`/`events.md`/`reports.md`'s convention — see `inventory.md`'s status header and its "resolving INV-M1" annotation.
`home.md`, `events.md`, and `reports.md` each define a near-instant silent skeleton, a >~1.5s "Un momento…" state, and a load-failure fallback with manual "Reintentar" that never blocks the nav bar — each calling it reused convention. `inventory.md`'s own §5 enumeration has no equivalent of any of these three states; its only loading/error pair is for the Guardar mercancía save action, a different action than opening the tab. This isn't just a doc gap: `events.md` §3.1 and §3 both explicitly claim to reuse a tab-level resolution convention from `inventory.md` that, on inspection, was never actually defined there. Real consequence: if Catalog fails to load in realistic variable-connectivity conditions (bazares, cars, between stalls), there is no defined behavior — no guaranteed retry, no guaranteed nav-bar access — where every other tab makes that promise explicitly.

**INV-M2 — No error state for a genuine NFC scan failure during Asignar Tags — only the business-logic conflict ("already assigned") is covered.**
Status: Fixed — verified. `inventory.md` §3.16 adds a distinct scan-failure error state for Asignar Tags, alongside the existing "already assigned" conflict — see `inventory.md`'s "resolving INV-M2" annotation.
A failed/unreadable scan (out of range, foil interference, timeout) is a distinct and likely more common failure mode than the one case the doc does cover. Ana is physically walking through a stack of garments tagging them one at a time (§1); a scan that silently does nothing leaves her unsure whether to reposition, retry, or that something's broken. Note: `home.md`'s nfc selling surface (§3.10) has the identical gap — may be a shared omission across both docs, worth fixing in both.

**INV-M3 — Elegir producto matching logic is unspecified — real risk of fragmenting Product-level aggregates.**
Status: Fixed — verified. `inventory.md` §3.8 now specifies a case-insensitive, trimmed matching rule for Elegir producto — see `inventory.md`'s "resolving INV-M3" annotation. (A narrower residual gap — internal-whitespace normalization — is tracked separately as INV-S3, Suggestion, still open.)
§3.6 never specifies what "match" means for the "add as new product" trigger — exact string, case-insensitive, trimmed, fuzzy? Naive exact-match means "Pijama" and "pijama" (or a trailing-space variant) become two separate Products, silently splitting one real item's stock across two Catalog rows — undermining `global-principles.md`'s own promise ("she sees 'Hoodie (4 available)'," one number per Product). Resolvable directly by `ux-designer` specifying the matching rule (e.g., case-insensitive, trimmed) — does not need Architect escalation the way Q9 (venue-name matching) did, though it's the same shape of problem.

**INV-Q1 — Cantidad's new default-to-1 + immediately-reachable Guardar, with no post-save edit path, risks silently under-registering a multi-unit receiving event.** (Amendment-verification finding, 2026-08-04)
Status: Fixed — verified. `inventory.md` §3.6/§3.7 now marks the untouched default "1 · revisa antes de guardar," removed on any interaction, and the marker carries into the §3.7 committed-lines list for any line saved without ever touching Cantidad.
Before the Cantidad-default amendment, the field opened blank, so reaching Guardar mercancía required consciously typing a number — a small forcing function. After the amendment, Cantidad always pre-fills to 1 the instant Producto is chosen, and Guardar is immediately reachable with zero engagement with the quantity field — most acutely via the Catalog-row shortcut (§3.4→§3.6), which the spec itself describes as reaching a fully-valid, savable state "with zero further taps." Concretely: Ana receives 20 sudaderas, opens Registrar Mercancía (or taps the Sudadera row from Catalog), selects/confirms Producto — if attention lapses even briefly (a phone call, a customer question, moving fast through a batch), she may tap Guardar before adjusting the stepper, silently recording "1 sudadera arrived" instead of 20. This corrupts the Catalog's "disponibles" count that both this doc and `home.md`'s selling grid treat as ground truth, and per §11, there is no way to correct it afterward: "Editing an already-saved Lot (correcting a quantity typo after Guardar) — not designed." The doc's own mitigation ("the quantity is always visible in the row before saving," §10) is real but passive — a pre-filled number is easier to tap past than an empty field that visibly demands input. Not a request to revert the default (the single-unit case it optimizes for is genuinely common) — the gap is the combination of a plausible wrong-value path with zero correction path once saved. Fixable by `ux-designer` directly; no Foundation ambiguity.

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
Status: Fixed — verified. `events.md` §3.8's Tipo picker now reads "Tianguis" in place of the untranslated "Market" — see `events.md`'s "resolves EVT-M1" annotation.
Five of six picker items are Spanish or naturalized Mexican-Spanish loanwords ("Bazar," "Expo," "Festival," "Pop-up" are all things a bazaar vendor would actually say); "Market" is not — Ana would say "mercado" or "tianguis." Reads as an untranslated leftover from `ubiquitous-language.md`'s internal English enum (which the same principle says "Ana would never hear or say") rather than a deliberate localization, and is the only item breaking the pattern the other five establish. Directly fixable by `ux-designer` (a translation, not a Product Decision) — `reviewer` may also flag this from the ubiquitous-language-compliance angle; legitimate overlap, not a duplicate.

**EVT-M2 — No wireframe for how a zero-Session Pasado Event renders in the *list* (§3.4/§3.5) — only its detail screen (§3.16) got this care.**
Status: Fixed — verified. `events.md` §3.4/§3.5's Pasados list cards now render a "Sin ventas registradas" shape for a zero-Session Event instead of a mechanical "0 días · 0 ventas · $0" — see `events.md`'s "EVT-M2 remediation" annotations.
§3.16 deliberately handles a zero-Session closed Event gracefully ("not a broken 0/0 display"), but the corresponding list card was never shown — applying the standard card shape ("Nombre / N días · M ventas · $X") mechanically produces exactly "0 días · 0 ventas · $0," the broken look §3.16 was designed to avoid, one screen earlier in the same journey, and the point where Ana would notice it first (a rained-out or changed-mind Event is a real, recurring scenario).

**EVT-M3 — The Eventos→Resultados hand-off (§3.15) strips information Ana just saw, and leaves §1's own stated Merchant Goal undelivered by any Eventos screen.**
Status: Fixed — verified. `events.md` §3.16 now carries the same thin, ambient one-line summary already shown on the Pasados list card into the Eventos→Resultados hand-off — see `events.md`'s "EVT-M3 remediation" annotations.
§1 names "how did that one actually go — total sales across every day she worked it" as a core Eventos goal. Post-Q7 correction that total lives only in Resultados (architecturally correct, not being reopened) — but Q7's resolution explicitly allows Eventos to show "a thin, ambient, in-progress indicator," a pattern the doc already uses elsewhere (Pasados list card's one-line summary, §3.13's ambient Día row) yet drops entirely in §3.15, showing only name/type/dates/place + a button. Practical effect: Ana taps a card that says "$2,340," lands on a detail screen with no number at all, and must tap again into a different tab to see it reappear — a real, recurring discontinuity in a journey the doc itself names as core. Fixable by carrying the same thin ambient line already used elsewhere into §3.15, without reintroducing the day-by-day breakdown Q7 rules out; §1 should also be revisited so it doesn't read as though Eventos itself still delivers the rollup.

**EVT-Q1 — An overlap warning firing the instant the form opens, tied to a date Ana never chose, risks reading as an unprompted error rather than validation feedback.** (Amendment-verification finding, 2026-08-04)
Status: Fixed — verified. `events.md` §3.6 now decouples check-computation (still instant, on open) from warning-visibility (only after her first engagement — picking Lugar/Tipo or editing a date), with copy naming the untouched-default case explicitly ("si agendas para hoy…").
Scenario: Ana is mid-Session at Plaza Norte today (an active Event) and opens "Agendar evento" to pre-schedule a *different*, future bazaar. Before touching Lugar, Tipo, or any date field, the form immediately shows "Esas fechas se cruzan con Plaza Norte (04-06 ago). Ajusta las fechas para continuar," Guardar evento disabled — about a value (Empieza = hoy) she never set, naming the very Venue she's currently selling at. The message is technically correct and its remedy is actionable, but it inverts the pattern established everywhere else in this doc family, where validation follows an action she took. The amendment's own justification for open-time checking is framed entirely around tap-efficiency ("she finds out before spending taps on Lugar/Tipo") and never addresses first-time-user comprehension of an unprompted warning. Fixable by `ux-designer` (e.g., message copy, or how/when the check first becomes visible) — no Foundation ambiguity (D17 itself untouched).

**EVT-Q2 — The Empieza-default amendment was not threaded consistently through the document; three passages still describe the pre-amendment four-gate/Empieza-required behavior.** (Amendment-verification finding, 2026-08-04)
Status: Fixed — verified. All three named passages (§3.6 overlap-variant prose, §4 interaction flow, §6 step-count table) corrected to "Lugar + Tipo" gating and "third" gate; a fourth, missed stale bullet in §10 (found during verification) was also merged/corrected. Full-document sweep confirmed clean.
Three passages contradict the amendment's own corrected wireframes/§10 entry: (1) §3.6's overlap-validation-variant prose still reads "disables Guardar until Lugar + Tipo + Empieza are filled; overlap detection is a fourth, equally silent gate" — contradicting the two wireframe captions immediately above it (correctly "third," "Lugar + Tipo still unset") and §10; (2) §4's interaction-flow summary still lists Guardar evento as "only reachable once Lugar + Tipo + Empieza are filled"; (3) §6's minimum-step-count table still counts "+1 (Empieza)" as a required tap in both example rows for the common same-day case, contradicting the amendment's stated purpose that she never has to touch Empieza for that case. The document currently gives self-contradictory answers to "how many gates block Guardar evento" and "does the common flow require touching Empieza." Fixable by `ux-designer` directly — a pure internal-consistency correction, not a Foundation question.

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
Status: Fixed — verified, superseded. The illustrative "Tus clientes" section this finding described no longer exists in illustrative form: the Q8/RPT2-MAJ1 remediation cycle (below) replaced it with a real, fully-specified spec — `reports.md` now states directly that it is "a real, fully-specified feature, not an illustrative placeholder," so there is no remaining illustrative/real distinction for a wireframe to fail to flag.
The illustrative caveat is stated four times in narrative text plus the section heading, but the §3.6 main-view wireframe (`Tus clientes [Ver más ▸]` rendered visually identical to the real "Rendimiento por bazar [Ver más ▸]") and the §4 interaction-flow line carry no flag at all. A reader working primarily from wireframes/flow — exactly what a low-fidelity spec is optimized for — has no signal these two paid-tier rows are fundamentally different in kind: one is real with an honest approximation (Q9-flagged, proceeding); the other has no data source pending a Business Decision (Q8). Since `product/02-ux/CLAUDE.md` calls these docs "the handoff artifact" Builder implements from, and this doc's own status line says "Approved," a downstream reader trusting that status could attempt to build §3.10 as literally specified. Distinct from Q8's underlying data-availability question, which this finding does not re-litigate.

**RPT-M2 — "Rendimiento por bazar" (§3.9) has no drill-down from its aggregate rows to the underlying Events/Sessions.**
Status: Fixed — verified. `reports.md` §3.9's venue rows are now individually tappable, drilling down to a filtered Historial view scoped to that Venue (§3.11), restoring the three-altitude drill-down model — cross-confirmed by RPT-S3's "now tappable per RPT-M2."
Rows like "Bazar Plaza Norte · 3 eventos · $780 promedio/día" are non-tappable — no path back to which 3 Events produced that number, breaking the three-altitude drill-down model §2 establishes everywhere else. This is Nahui's answer to the validated friction "choosing which bazaar to attend, with no data" — a number Ana can't inspect is one she can't fully trust or act on. Compounds with Q9 (already logged): exact-string-match grouping could silently fragment a typo'd venue into two rows, and without drill-down she'd have no way to notice.

**RPT-M3 — No empty state for a paid merchant who has closed Sessions but never scheduled an Event (Quick-Session-only history).**
Status: Fixed — verified. `reports.md` §3.10 adds a dedicated "sin eventos registrados" empty state for a paid merchant with closed Sessions but zero Event-grouped history, so Quick-Session-only paid subscribers no longer see a silently blank "Rendimiento por bazar" section.
"Rendimiento por bazar" groups exclusively by Event `Nombre`; nothing requires a merchant to ever use Eventos (Quick Session is explicitly first-class), and `company/CLAUDE.md`'s paid-tier eligibility is tied to "own sales history," not Event history. A real, reachable scenario — paid subscriber, real sales, zero Events — renders §3.9 as nothing, with no copy or wireframe addressing it. Risk to the paid tier's perceived value: its flagship "which bazares are worth it" feature would be silently blank.

**RPT-Q1 — Resultados shows computed numbers with no interpretive/comparative framing anywhere in the tab.** (Icon/comprehension audit finding, 2026-08-04)
Status: Fixed — verified. `reports.md` §3.4/§3.5/§3.6 now add ticket promedio, a "Top productos" all-time section, and (the actual fix) a headline sales-trend statement pairing two values not otherwise shown together — closing the synthesis gap. §3.9's rows now carry a plain rank number.
Every screen in Resultados displayed computed numbers, never computed meaning — Ana did 100% of the interpretation work herself. Nothing established visual primacy for the headline total, and nothing visually surfaced the ranking §3.9 already legitimately computes.
**RPT-Q2 — Even combined, the proposed legibility fixes for RPT-Q1 didn't add up to insight, only easier-to-find facts.** (Follow-up evaluation, 2026-08-04)
Status: Fixed — verified. A headline sales-trend statement was added, explicitly the one element that closes this gap — it pairs two values ("esta semana," "semana pasada") not otherwise shown together anywhere in the view. A second statement ("Producto estrella") was also added but, on review, restates rather than combines data — `reports.md` §3.4 now says so explicitly rather than overclaiming it as synthesis (caught during batch verification, corrected in place).
The five original legibility fixes (hero-card hierarchy, ticket average, top products, rank numbers) made existing facts easier to find but didn't create a new, synthesized fact — none of them referenced another. "Communicates business value" requires a relationship between two computed values to be visible as a single statement.

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
