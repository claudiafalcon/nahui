# Configuración — Amendment & Decision History

Companion file to `product/02-ux/settings.md`. This file holds the
justification, prior-state, and remediation-history prose that used to live
inline in `settings.md`'s status header and `## 10. Decisions made` section.
`settings.md` itself keeps only current-rule text and, for these locations, a
pointer back here.

Anchors are prefixed `status-` (from `settings.md`'s status header) or
`decisions-` (from `settings.md` §10), to keep them unique within this file.

---

## Status-header history (from `settings.md`'s front matter)

### status-full-ux-remediation-cycle
**Applies to:** `settings.md` overall Approval.

Status: Approved. Full UX Remediation cycle complete across three rounds —
SET-M1, SET-M2, SET-M3 (round 1), SET-B1/SET-M4 (round 2), and their round-3
regression fixes — all fixed by `ux-designer` and verified clean by
`ux-critic`. `reviewer`'s Foundation-consistency pass caught one further
Blocker (Customer Segmentation copy not jointly gated on `subscriptionTier=paid`
and `loyaltyEnabled=true`, per `decision-log.md` D22) — fixed, re-verified
clean. See `product/02-ux/ux-critic-findings.md` for the full record.

### status-d27-nfc-capability-derivation
**Applies to:** `decision-log.md` D27 (NFC capability derived from `subscriptionTier`).

**Amended for `decision-log.md` D27** (NFC capability corrected to derive from
`subscriptionTier`, not an independent entitlement): the dedicated "Activar
venta con tags" activation-code path (former §2.3/§3.8/§3.8a/§3.8b, SET-B1) is
retired entirely — `nfc` is no longer independently self-service-toggleable;
it changes only as an automatic consequence of the `subscriptionTier` actions.
A new `defaultSellingMode` control ("Cambiar a vender con tags" / "Cambiar a
vender con botones") is added, previously out of scope (§8 item 5). Went
through a coordinated three-document cycle (with `home.md`/`onboarding.md`) —
`ux-critic` found one Blocker (in `onboarding.md`'s sibling milestone copy,
not here) plus two Major and three Minor findings across the three documents,
all fixed and verified. `reviewer`'s Foundation-consistency pass found zero
Blockers, one Important finding (stale "two real paths" language in
`onboarding.md`, not here) — fixed directly by Main. Folded back into
Approved.

### status-2026-08-08-d34-customer-segmentation-gate-corrected
**Applies to:** `decision-log.md` D34 (Customer Segmentation visibility gate corrected).

**Further amended 2026-08-08 (`decision-log.md` D34 — Customer Segmentation
visibility gate corrected):** D22's joint-gate clause (`subscriptionTier=paid`
**and** `loyaltyEnabled=true` together, required for Resultados to show
Frequent Customers data) is corrected — Resultados' "Tus clientes" section now
gates on `subscriptionTier=paid` alone (`reports.md`, amended in the same
pass). "Activar clientes frecuentes" (§3.4) stays a real, meaningful action —
it still governs whether Loyalty-claim actually collects Claims at all — but
its copy, and "Activar plan de pago"'s and "Desactivar clientes
frecuentes"'s, no longer frame `loyaltyEnabled` as a joint precondition,
alongside `subscriptionTier`, for the Resultados section to show anything at
all. §2.2's capability table, §3.4's three affected copy variants corrected;
§10 updated.

### status-2026-08-09-d40-loyalty-enabled-retired
**Applies to:** `decision-log.md` D40 (`loyaltyEnabled` retired).

**Further amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled`
retired, Frequent Customers unified as a single `subscriptionTier=paid`-gated
capability). `ux-critic`: 1 Major (§2.1 still listed "clientes frecuentes" as
something Configuración manages/checks-or-changes) — fixed; verification
clean, plus one further stale "six actions"/§2.3 citation in §1 caught and
fixed in the same pass. `reviewer` clean (1 Blocker in `ubiquitous-language.md`,
unrelated to this document specifically — fixed, re-verified). Folded into
Approved.** `loyaltyEnabled` is retired outright, not narrowed — there is no
Business-level field, screen, or action anywhere in the product for turning
Frequent Customers on or off. "Activar clientes frecuentes"/"Desactivar
clientes frecuentes" (both directions of §3.4) are removed entirely, not
merely re-copied — Frequent Customers becomes automatically available the
instant `subscriptionTier` reads `paid` (via "Activar plan de pago"), and
becomes automatically unavailable the instant it reads `free` again (via
"Volver al plan gratis"); Ana never takes an action of her own to turn it on
or off directly. Scope narrows from six actions to four (`subscriptionTier` ×
2 directions, `defaultSellingMode` × 2 directions) — §1's "handful of real
business decisions" framing, the Scope paragraph, §2.2's table, §3.3a/§3.6's
wireframes, §3.4's "Activar plan de pago" copy, §3.5's "Volver al plan gratis"
copy, §4, §5, §6, §7, §9, and §10 all corrected. `product/02-ux/reports.md`
receives the matching correction on the read/visibility side in the same pass
— see that document's own status header.

### status-2026-08-09-configuracion-entry-point-relocated
**Applies to:** Product Owner decision (Configuración entry-point relocated from "▾" to "⋯").

**Further amended 2026-08-09 (Product Owner decision — Configuración
entry-point relocated from the header's "▾" to a top-right icon-based menu):**
the trigger `home.md` §3.7a specifies (and this document's §2.1 hangs
Configuración off) is no longer the header's "▾" — it's a top-right "⋯" icon
opening the identical sheet. The sheet's Configuración row now carries a gear
icon ("⚙"), distinguishing it from "Cerrar jornada de venta" and any future
entry, per the Product Owner's explicit request. Purely an entry-point
relocation: which Home states show it, when "Cerrar jornada de venta"
appears, and everything Configuración itself does once reached (§3.3a onward)
are all unaffected — see `home.md`'s own status header and §10 for the full
reasoning, including why "⋯" was chosen over a hamburger icon. §2.1, §3.3,
§4, §6, §8 item 3, and §10 updated for the new glyph and gear marker. Ready
for `ux-critic`/`reviewer`.

### status-2026-08-13-cerrar-sesion-added
**Applies to:** Product Owner decision (account-level sign-out added).

**Further amended 2026-08-13 (Product Owner decision — account-level sign-out
added, simplified to "Cerrar sesión" in the same pass once `home.md`'s own
Selling-Session-close action was renamed):** a new, fifth action — "Cerrar
sesión" (§2.5/§2.5a, a new "Tu cuenta" section appended to §3.3a's and §3.6's
vista principal, new §3.8/§3.8a/§3.8b) — ends this device's verified session
(`authentication.md §2.1`) without touching the Business or any of its data.
Distinct in kind from the four Business Capability actions in §2.2. Initially
named "Cerrar sesión en este teléfono" to avoid colliding with Home's own
Selling-Session close, which was also called "Cerrar sesión" at the time
(`home.md §3.7a`/§3.11) — once that action was renamed to "Cerrar jornada de
venta" in the same pass (see `home.md`'s own status header), the collision no
longer exists, so this action simplifies to plain "Cerrar sesión," the only
account-level action in the product still using that name. Gets an explicit
confirming step, never a bare toggle, per `onboarding.md §6`'s established "a
real commitment from a stray tap" standard. Resolves into `authentication.md
§3.3`, fresh (not that document's §3.8 resume state, reserved for an
interrupted attempt). Activates a branch `authentication.md §2.2` already
named but marked unreachable (case 2) — a corresponding correction to that
document is recommended and applied alongside this amendment. Ready for
`ux-critic`/`reviewer`.

### status-2026-08-14-d46-tag-assignment-auto-entry
**Applies to:** `decision-log.md` D46 (tag-assignment auto-entry gates on merchant intent).

**Further amended 2026-08-14 (`decision-log.md` D46 — tag-assignment
auto-entry gates on merchant intent, not mere capability):** new §2.6
specifies "Cambiar a vender con tags" as a real, three-way transition, not a
bare toggle — the same write now hands off directly into `inventory.md` §3.14
(Asignar Tags) if untagged inventory already exists anywhere in her Catalog,
or into `inventory.md`'s own register-merchandise-first guidance (new
`inventory.md` §3.3a) if zero InventoryUnits have ever been received for this
Business, or returns to Configuración's own vista principal unchanged if
she's already fully tagged. §2.2's table, §3.4's "Cambiar a vender con tags"
copy, and §4's interaction flow are updated to match. Pending
`ux-critic`/`reviewer` review before folding back into Approved.

### status-2026-08-14-d46-addendum-architect-correction
**Applies to:** `decision-log.md` D46 Addendum (architect ruling — dependency-cycle correction).

**Further corrected, same day (architect ruling — see `decision-log.md` D46's
own Addendum):** the mechanism described in the paragraph above had "Cambiar
a vender con tags" read Inventory-owned state (`InventoryUnit.status`/`tagId`)
directly to decide its own routing — `architect` ruled this would close a
dependency cycle, since Inventory already depends on Identity
(`domain-model.md`'s Bounded Contexts table); a return edge (Identity →
Inventory → Identity) would violate `architecture-principles.md` #6.
Corrected: §2.6 now specifies this action as writing `defaultSellingMode` and
handing off an entry marker only — "reached via Cambiar a vender con tags" —
into `inventory.md` §2's own resolution, which gains a new, highest-priority
trigger condition performing the identical check `inventory.md` already
legitimately owns. No new dependency edge, no domain-model change. One real,
small UX-surface delta from the first draft: an already-fully-tagged merchant
now lands on `inventory.md`'s plain Catalog view (§3.4) rather than back on
Configuración's own vista principal. §3.4's copy also now discloses the
zero-inventory outcome, per `ux-critic`'s finding. §2.2's table note, §2.6
(full rewrite), §3.4, §4, §6, §7, and §10 all updated to match. `reviewer`
clean (1 Suggestion, applied — a cross-reference precision gap in §2.6's
third bullet). `ux-critic` found 1 Major (SET-INV-D46-MAJ1 — the
already-fully-tagged outcome silently landed her on a different nav tab with
no acknowledgment, contradicting this document's own claim that the case
"needs no disclosure") — fixed (new one-time banner at `inventory.md` §3.4,
this document's own §3.4/§10 corrected to state the truth) and re-verified
clean. Folded back into Approved.

### status-2026-08-14-active-session-gear-direct-nav
**Applies to:** `home.md`'s "Cerrar jornada de venta" discoverability fix (Product Owner-raised), matching correction.

**Further amended 2026-08-14 (Product Owner-raised — `home.md`'s "Cerrar
jornada de venta" discoverability fix, matching correction):** during an
active Selling Session, the header's session-controls trigger is a gear
icon ("⚙") that routes directly into Configuración's resolve step — no
intermediate sheet; "Cerrar jornada de venta" no longer routes through
this trigger at all (see `home.md` §3.7 for its own new direct header
affordance). Outside an active Session, the entry point and sheet
(§2.1/§3.3) are unchanged. §2.1's heading and first two paragraphs,
Scope's closing clause, §3.3's added sentence, §4's split interaction-flow
block, and §6's split table row all updated to match. Pending
`ux-critic`/`reviewer` review before folding back into Approved.

### status-2026-08-15-non-session-gear-direct-nav
**Applies to:** `settings.md` §2.1 — the non-Session entry point, matching
`home.md`'s own extension of its "Cerrar jornada de venta" discoverability
amendment.

Further amended 2026-08-15 (Product Owner-raised — `home.md`'s "Cerrar
jornada de venta" discoverability fix, extended to every Home header
state): outside an active Session too, the entry point is now a gear icon
("⚙") that routes directly into Configuración's resolve step — no
intermediate sheet. The non-Session sheet (§3.3) is retired — it was
already single-item ("Configuración" only), the same condition that
retired the active-Session sheet a day earlier. Configuración's entry
point now has one uniform shape across every Home state with a persistent
header. `ux-critic` clean (no findings). `reviewer` clean (no Blockers,
no Important findings). Folded back into Approved.

---

## §10 "Decisions made" — full decision history

### decisions-configuracion-hangs-off-session-controls-trigger
**Configuración hangs off Home's session-controls trigger.** Originally the
header's "▾," relocated 2026-08-09 to a top-right "⋯" icon (Product Owner
decision; see below and `home.md`'s own §10) — extended to every Home state
that has a persistent header (cold start, idle, Event-active-no-Session, and
every active-Session state), not only the active-Session one — required
because what it manages matters on days she isn't actively selling too.

### decisions-2026-08-09-trigger-relocated-ellipsis-gear-icon
**2026-08-09 (Product Owner decision): the entry-point trigger relocates from
the header's "▾" to a top-right "⋯" icon; the sheet's "Configuración" row
gains a gear icon ("⚙"), distinguishing it from "Cerrar jornada de venta" and
from any entry the sheet may carry in the future.** Purely an entry-point
relocation — nothing about which Home states show it (§2.1's existing
four-state exclusion list), when "Cerrar jornada de venta" renders, or
Configuración's own downstream behavior (§3.3a onward) changes. Full
reasoning, including why "⋯" was chosen over a hamburger icon, lives in
`home.md`'s own status header and §10, to avoid duplicating it here — this
document's own §2.1, §3.3, §4, §6, §8 item 3, and this section are updated to
match.

### decisions-activar-venta-con-tags-path-removed
**The dedicated "Activar venta con tags" path (activation-code entry, reusing
`onboarding.md` §3.4–§3.4b) is removed entirely, not merely restructured**
(`decision-log.md` D27) — the physical-kit-confirmation mechanism it modeled
never actually granted the capability; `nfc` is a pure derivation from
`subscriptionTier`, so there is nothing left for a dedicated activation path
to do.

### decisions-defaultsellingmode-control-added
**A new `defaultSellingMode` control (Botones ↔ Etiquetas NFC) is added**
(`decision-log.md` D27), constrained to whichever modes `subscriptionTier`
currently makes available — always `buttons`; `nfc` only while
`subscriptionTier = paid`. This is the field's first-ever self-service edit
surface; it was Onboarding-only before D27 (`decision-log.md` D19/D23).

### decisions-defaultsellingmode-immediate-no-pending-structure
**`defaultSellingMode`'s two directions are both immediate, with no
pending-value/effective-date structure at all** — unlike `subscriptionTier`,
it carries no commercial or billing-cycle implication for D25's
deferred-timing rationale to apply to (§2.3, `decision-log.md` D27). It uses
the generic immediate-effect template (§3.4) exactly like a toggle, never the
deferred template (§3.5).

### decisions-activar-plan-de-pago-nfc-disclosure
"Activar plan de pago" stays in the generic immediate-effect template, with
copy stating plainly that it activates by confirming a payment arranged
outside the app, using count/category framing ("cuántas... y cuántas"), never
identity-implying framing ("quiénes son"/"cuáles"). Its consequence now also
includes `nfc` becoming available automatically the moment this confirms
(`decision-log.md` D27) — a fact worth surfacing honestly in this action's own
copy, not left implicit, since it's a real new capability she gains from the
same tap, not only the segmentation/reporting benefits the existing copy
already states.

### decisions-two-confirmation-shapes-no-exception
All actions now share exactly two confirmation shapes (immediate-effect,
deferred-effect), with no exception at all — the one previous exception (NFC
activation's code-entry path) is removed along with the path itself
(`decision-log.md` D27), and `defaultSellingMode`'s two new directions are
ordinary immediate-effect actions, not a third shape.

### decisions-defaultsellingmode-scope-no-longer-excluded
No payment/checkout flow and no bazaar-recommendation logic designed anywhere
in this document. **`defaultSellingMode` is no longer excluded** —
`decision-log.md` D27 brought it into scope; see the
`defaultSellingMode`-control bullet above.

### decisions-volver-al-plan-gratis-nfc-disclosure
**"Volver al plan gratis" now discloses its `nfc` consequence explicitly,
not only its Resultados/segmentation consequence** — downgrading to Free
also withdraws `nfc` availability at the effective date (`decision-log.md`
D27), since `nfc` is derived from `subscriptionTier`. Already-assigned
NFCTags stay inert but intact, per D25's unchanged never-delete-history
invariant; the copy states this plainly rather than leaving her to discover
it only once she can no longer sell with tags.

### decisions-d34-corrects-clientes-frecuentes-framing
**`decision-log.md` D34 corrects the framing of "Activar clientes
frecuentes" (§3.4), "Desactivar clientes frecuentes" (§3.4), and "Activar
plan de pago" (§3.4).** None of these actions changed — same six actions,
same templates, same tap counts — only their copy is corrected to stop
presenting `loyaltyEnabled` as a joint precondition, alongside
`subscriptionTier=paid`, for Resultados' "Tus clientes" section to show
anything at all. That section is now visible to any paid merchant regardless
of `loyaltyEnabled` (`reports.md`, amended in the same pass) —
`loyaltyEnabled` only ever gated real Claim collection, and its copy now
says so plainly instead of implying it gates visibility. "Desactivar clientes
frecuentes" is also corrected to state accurately that already-accumulated
segmentation data isn't hidden or erased when she turns collection off,
consistent with D25's never-delete-historical-data invariant.

### decisions-d40-retires-clientes-frecuentes-actions
**`decision-log.md` D40 retires "Activar clientes frecuentes"/"Desactivar
clientes frecuentes" (§3.4) entirely, superseding the D34 bullet above.**
`loyaltyEnabled` no longer exists as a Business-level field; Frequent
Customers is now a pure, automatic consequence of `subscriptionTier`, the
identical shape D27 already established for `nfc`. Narrows Configuración from
six actions to four (§2.2); "Activar plan de pago"'s and "Volver al plan
gratis"'s copy now state the fuller consequence (Frequent Customers as a
whole, not only Resultados visibility).

### decisions-2026-08-13-cerrar-sesion-account-level-action
**A fifth, account-level action — "Cerrar sesión" — is added 2026-08-13
(Product Owner decision), outside the four-capability count.** Ends this
device's verified session (`authentication.md §2.1`) without touching the
Business or its data (§2.5). Initially named "Cerrar sesión en este
teléfono" to avoid colliding with Home's own Selling-Session close, also
called "Cerrar sesión" at the time — once that action was renamed to "Cerrar
jornada de venta" in the same pass (`home.md`'s own status header/§10), the
collision no longer existed, so this action simplifies to plain "Cerrar
sesión," the only account-level action in the product still using that name.
Placed in its own "Tu cuenta" section, present identically regardless of
`subscriptionTier` or pending-change state. Gets an explicit confirming step
(§3.8), never a bare toggle, per `onboarding.md §6`'s "real commitment from a
stray tap" standard. Resolves into `authentication.md §3.3`, fresh; a
same-device re-verification afterward activates `authentication.md §2.2`'s
previously-unreachable case 2 (§2.5a) — a corresponding correction to that
document was applied in the same pass.

### decisions-2026-08-14-d46-tag-assignment-handoff-corrected
**A sixth consequence added 2026-08-14 (`decision-log.md` D46), corrected the
same day (architect ruling — see D46's own Addendum).** "Cambiar a vender con
tags" is no longer a bare field-flip. The first drafted version had this
action itself read Inventory-owned state (`InventoryUnit.status`/`tagId`) to
decide its own routing — `architect` ruled this would close a dependency
cycle, since Inventory already depends on Identity (`domain-model.md`'s
Bounded Contexts table); a return edge would violate
`architecture-principles.md` #6. Corrected: this action now only writes
`defaultSellingMode` and hands off a lightweight entry marker; `inventory.md`
§2 gains a new, highest-priority trigger condition that performs the
identical check `inventory.md` already legitimately owns (§2.6). One real,
small UX-surface delta from the original draft, not mandated or contradicted
by D46's own text: an already-fully-tagged merchant now lands on
`inventory.md`'s plain Catalog view (§3.4, "Inventory Ready") instead of back
on Configuración's own vista principal — a more honest landing state than
returning to Configuración's vista principal would have been. **Corrected
(`ux-critic` finding SET-INV-D46-MAJ1):** this bullet originally claimed the
destination screen had "nothing further to tell her" — untrue in practice,
since landing on a different nav tab with no explanation is itself a real,
previously-undisclosed consequence. `inventory.md` §3.4 now carries its own
one-time ambient acknowledgment for this exact entry marker, mirroring the
banner treatment its sibling "named Products, zero Lots" case already used.
§3.4's "Cambiar a vender con tags" copy also discloses the zero-inventory
outcome, not only the tagging-handoff one, per `ux-critic`'s earlier finding
— all three real consequences are now honestly disclosed, either before she
confirms or at the actual landing screen.

### decisions-2026-08-14-active-session-gear-direct-nav
**Applies to:** `settings.md` §2.1 — the active-Session entry point, matching `home.md`'s own "Cerrar jornada de venta" discoverability amendment.

2026-08-14 (Product Owner-raised, matching `home.md`'s own amendment):
during an active Session, the entry-point icon becomes a gear ("⚙") that
routes directly into Configuración, with no intermediate sheet. "Cerrar
jornada de venta" no longer shares this trigger at all — it moved to its
own direct header button, specified entirely in `home.md` §3.7. Outside an
active Session, the "⋯" icon and its sheet (§3.3) are unchanged: what's
managed there — her plan and how she sells — stays meaningful to check or
change whether or not she happens to be selling that day, the same
reasoning §2.1's own opening paragraphs already give for extending the
affordance to every non-Session header state in the first place; only the
active-Session case gains a second, faster shape because the sheet there
would otherwise hold a single entry. §2.1's heading and first two
paragraphs, Scope's closing clause, §3.3's added sentence, §4's split
interaction-flow block, and §6's split table row all updated to match.
Folded back into Approved.

### decisions-2026-08-15-non-session-gear-direct-nav
**Applies to:** `settings.md` §2.1 — extending the active-Session gear
icon to every remaining Home header state.

2026-08-15 (Product Owner-raised — extending the 2026-08-14 fix to every
Home header state): outside an active Session too, the entry-point icon
is now a gear ("⚙") that routes directly into Configuración, with no
intermediate sheet. The non-Session sheet (formerly §3.3) is retired — it
was already single-item ("Configuración" only), the same condition that
retired the active-Session sheet a day earlier. §2.1's earlier "kept
deliberately, not an inconsistency" reasoning is corrected: it only ever
addressed whether Configuración should stay reachable from these four
states, never what shape the trigger reaching it should take. `home.md`
receives the matching correction. `ux-critic` clean (no findings).
`reviewer` clean (no Blockers, no Important findings). Folded back into
Approved.

### section-3-3-retired
**From `settings.md` §3.3 ("Entry — session-controls sheet, Home
idle/cold-start/Event-active-no-Session states," retired 2026-08-15 — see
status header.)**

```
### 3.3 Entry — session-controls sheet, Home idle/cold-start/Event-active-no-Session states (new row)
┌───────────────────────────────┐
│ Nahui                        ⋯ │  dimmed, still visible underneath
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│  [     ⚙ Configuración      ] │
├───────────────────────────────┤
│ [Hoy]  Inventario Eventos Resultados │
└───────────────────────────────┘
```
No "Cerrar jornada de venta" row — there is no open Session to close.
Unchanged by `home.md`'s 2026-08-14 active-Session amendment — this is
now the only Home state family still using this sheet shape; see §2.1.

Retired because this sheet was already single-item ("Configuración"
only) — the identical condition that retired the active-Session sheet
(§2.1's own former text) a day earlier. `home.md`'s §3.6c (this sheet's
own Home-side wireframe) is retired in the same pass — see that
document's own changelog entry, `home.changelog.md#section-3-6c-retired`.
