# Onboarding — UX Specification

Status: Approved. Full UX Remediation cycle complete — `ux-critic`'s first-draft review found one Blocker (ONB-B1: the demo path's framing implied a reversible preview when the write is actually permanent and non-convertible) and one Major (ONB-M1: the milestone screen was silently excluded from the interruption-resume contract), both fixed by `ux-designer` and verified clean, plus three Minor findings also addressed. `reviewer`'s Foundation-consistency pass found no Blockers; three Important findings (an overbroad "never writes into Selling" claim, an unstated seed-content minimum for the demo path's own stated purpose, and a stale `events.md` §3.8 cross-reference — the last one a pre-existing drift also present in `home.md`, fixed in both) — all corrected directly by Main. See `product/02-ux/ux-critic-findings.md` for the full record.
Scope: the first-run flow that precedes all four top-level nav items (`Hoy`, `Inventario`, `Eventos`, `Resultados`) per `product/00-foundation/information-architecture.md`'s "Onboarding and Settings" section and `decision-log.md` D13. Not a nav tab, not reachable again once complete. Implementation-independent — low-fidelity only, no visual design.
**Amended for `decision-log.md` D27** (NFC capability corrected to derive from `subscriptionTier`, not kit/code activation): the "Activar kit NFC" path — its entire activation-code entry/validating/invalid-code mechanism (former §3.4/§3.4a/§3.4b) — is retired. Replaced by "Activar plan de pago," a bare payment-confirmation path (no code, no kit dependency) that grants `subscriptionTier=paid` (and therefore `nfc` capability, derived per D27). `defaultSellingMode` is now written as `buttons` unconditionally for both real paths, never inferred from path choice — a reversal of this document's earlier §2.3 resolution. Went through a coordinated three-document cycle (with `home.md`/`settings.md`) — `ux-critic` found one Blocker (§3.6 Variant B's milestone copy falsely implying automatic tag-selling once tagged) plus two Major and three Minor findings, all fixed and verified. `reviewer`'s Foundation-consistency pass found zero Blockers, one Important finding (stale "two real paths" language in §9/§10 contradicting this document's own §2.2, which correctly states three paths and a genuine two-way `subscriptionTier` choice) — fixed directly by Main. Folded back into Approved.
**Amended 2026-08-08 (`decision-log.md` D33, Product Owner decision — "Define lo que vendes" moved into Onboarding):** a new required step (§2.2a, §3.5b–§3.5e) captures the merchant's initial Selling Groups (name + `Product.defaultPrice`) on both real paths, reusing Inventory's own existing Product-creation write path rather than a second mechanism. `architect` cleared this as architecturally clean (no RFC, no Foundation edit) and flagged one required accompanying fix, applied in the same pass: `home.md`'s cold-start test corrected from "Product ever registered" to "`available` InventoryUnit exists," since this step breaks the equivalence those two facts used to share. Two remediation rounds — round 1 found 2 Major (a stale branch label in `home.md` §4's canonical wiring section; a new "never registered" vs. "sold out" ambiguity on Inventario's Catalog view) + 1 Suggestion, all closed in round 2. `ux-critic` verified clean across both rounds (zero Blockers, zero unresolved Majors). `reviewer` clean (no Blockers; two Important documentation-consistency findings, both fixed by Main — a missing `ux-critic-findings.md` entry, and two stale `inventory.md` passages claiming `defaultPrice` capture was unique to that document) — folded back into Approved.
**Amended 2026-08-08 (Product Owner decision, Business Identity captured at Onboarding):** a new required step (§2.2b, §3.9–§3.10a) captures the merchant's own business identity — `Business.name` (required), and optional `Business.logo`/`Business.description` — on both real paths, positioned after §3.5's Business/capabilities write succeeds and before the existing "Define lo que vendes" step (§2.2a, §3.5b–§3.5e), never on the demo path. `architect` cleared this as additive fields on the already-existing `Business` aggregate — no RFC, no new bounded-context edge; `home.md` §3.8f's Digital Receipt is the real consumer, now showing the merchant's own identity instead of "(marca Nahui)" (see that document's own 2026-08-08 amendment). This pass also corrects a rationale in §1 that became false the moment §3.8f became a real downstream consumer of a Business-level field, and adds a new resume case to §2.1 parallel to the existing "Define lo que vendes" one. Pending `ux-critic`/`reviewer` review before folding back into Approved.

Resolves, within this document's own design scope per D19: the exact number of Onboarding paths, their precise copy, and the flow's exact screen sequence — none of that was decided upstream; it's the actual design task here.

**Out of scope, by explicit instruction — flagged rather than designed around:**
- **Settings / capability change after first run.** Whether a Business that chose "Empezar gratis" can later upgrade to the paid plan and its `nfc` capability, or change any other capability, is designed entirely in `settings.md` (Approved) — `company/business-decisions.md` Q5, once open and blocking that document, resolved via `decision-log.md` D25. This is very likely the *most common* real-world path (start free, subscribe later) — it is still not designed *here*, deliberately: Onboarding's job stops at initial values (§1); post-onboarding capability change is `settings.md`'s own, separate scope.
- **Payments/checkout.** "Activar plan de pago" confirms an already-arranged payment (`decision-log.md` D19, D27) — zero in-app payment processing (`company/CLAUDE.md` non-goals). No purchase flow, no price, no card field anywhere in this document.
- **Bazaar recommendations** (`company/backlog.md` #3) — not part of any path's content.
- **Authentication / account provisioning.** How the platform determines which device/account maps to which Business (login, phone verification, etc.) is not modeled anywhere in the frozen `domain-model.md` and is treated the same way every other `02-ux` document treats it: an implementation-level concern below this spec's abstraction level. This document assumes only that, by the time §2's resolution logic runs, the platform can answer "does a Business already exist for this install, and has it completed Onboarding?" — it does not design how that lookup itself is authenticated.
- **A demo-to-real conversion mechanic.** Per `decision-log.md` D19's own stated contingency, a demo Business is an ordinary Business with seeded data, "no conversion migration" — not designed here. See §11.

## 1. Merchant goal

Every other document in this family describes a recurring merchant context — Ana opens Home a dozen times a day, Inventario every few days, Eventos before a bazaar, Resultados after one. Onboarding is different in kind: it happens **exactly once**, ever, in her entire relationship with the app, before she has any reason yet to trust it.

Two things are true at once here, and the design has to hold both:

- **Nothing is time-critical the way Home's <3s bar is** (`company/backlog.md` #1) — there's no customer standing in front of her while she sets this up. The pressure that matters here isn't speed under live customer flow; it's the much more fragile risk of a **first impression that reads as intimidating, bureaucratic, or condescending about how she already runs her business** — exactly what `company/brand/brand-guide.md`'s tone explicitly warns against. Lose her here and there's no second Session to design for.
- **The functional job is narrow and mechanical**: establish a Business and its initial capabilities — Selling Mode Capability (`registrationMode`), Default Selling Mode (`defaultSellingMode`), `subscriptionTier` — before Home's resolution logic (`home.md` §2) has anything at all to resolve into (`decision-log.md` D13). **Two precisely-scoped exceptions, both added 2026-08-08:** for the two real paths, Onboarding also establishes the Business's initial Catalog (§2.2a) — one or more named Products and their `Product.defaultPrice` (`decision-log.md` D33), since a Business can't be said to be set up at all if it's set up to sell nothing — and the Business's own identity (§2.2b) — a required `Business.name`, plus an optional logo and description — since `home.md` §3.8f's Digital Receipt needs something honest of hers to show a real customer instead of falling back to Nahui's own mark for a field this product simply hadn't captured yet. Beyond capabilities and these two exceptions, nothing else. No category, no legal terms screen, no address/contact fields, no color/branding tooling invented here — the Domain Model doesn't call for them, and inventing them would be scope creep this document isn't asked to carry. **This document's earlier reasoning for excluding profile-style fields — "none of those fields is ever read by any downstream resolution logic" — is corrected here, not merely repeated: it's exactly what used to separate every excluded field from Producto/Precio, but it stopped being true of business name and logo the moment `home.md` §3.8f became a real downstream consumer of them.** What still separates the fields this document correctly continues to exclude (category, legal terms, address) from the two it now carries isn't "nothing reads them" anymore — it's that no downstream resolution logic reads *them specifically*, while `Business.name`/`Business.logo` now demonstrably are, by an already-Approved sibling document.

The tension resolves the same way `inventory.md` §1 resolves its own non-urgent context: the absence of a hard speed number doesn't mean padding is acceptable. It means the standard here is "don't waste a single one of her taps" — with one deliberate exception, spelled out in §3.4c/§6, where a fact worth an extra tap outweighs that default.

## 2. Resolution / decision logic

### 2.1 Whether Onboarding shows at all

Evaluated automatically, on every app open, before anything else:

```
1. Does a Business already exist for this install, with Onboarding fully
   complete — meaning all of: (a) a path has resolved into stored
   capabilities (§3.5's write succeeded); (b) for "Empezar gratis" or
   "Activar plan de pago" specifically, its identity has been captured
   (§3.10's write succeeded — Business.name is required, §2.2b) and at
   least one Selling Group has been written (§3.5b–§3.5e's write
   succeeded, §2.2a) — "Ver un ejemplo" is exempt from both, its seeded
   Business (identity included, §11) and seeded Catalog already satisfy
   this by construction; and (c) the "Todo listo" milestone (§3.6) has
   actually been dismissed, whether by her own tap or by its auto-continue?
     → YES: Onboarding is never shown. Control passes directly and silently
       to Home's own resolution logic (home.md §2) — not even a flash of
       any Onboarding screen. This is the literal meaning of decision-log.md
       D13's "never revisited once complete."

2. Does a Business exist with capabilities (and, for a real path, identity
   and at least one Selling Group) already written, but §3.6 was still on
   screen when the app was last closed, backgrounded, or killed — before
   she tapped or auto-continued past it?
     → YES: resume directly at §3.6, showing the same variant her stored
       path already determines. Never re-run §3.5's write, never re-run
       §3.10's identity write, and never re-run §3.5b–§3.5e's write either
       (capabilities, identity, Selling Groups, and for the demo path the
       seed data, already exist and are left untouched). Never restart
       from §3.3. This is the one deliberate narrowing of D13's
       "complete," scoped only to this resume check. Full guarantee in
       §3.7.

3. Does a Business exist with capabilities and identity already written
   (§3.5 and §3.10 both succeeded), but — for "Empezar gratis" or
   "Activar plan de pago" only — the "Define lo que vendes" step
   (§3.5b–§3.5e) hasn't yet succeeded (she was still adding Selling
   Groups, had committed some but hadn't tapped "Continuar," or a
   "Continuar" attempt failed, §3.5e)?
     → YES: resume exactly at that step, with whatever Selling Groups she'd
       already committed (and whatever she'd typed into the still-active
       row) intact — never re-run §3.5's or §3.10's writes, and never ask
       her to redo a Selling Group she already committed. Same discipline
       `inventory.md` §3.7 already applies to its own in-progress
       Registrar Mercancía draft. Does not apply to "Ver un ejemplo,"
       which never reaches this step at all (§2.2a).

4. Does a Business exist with capabilities already written (§3.5
   succeeded), but — for "Empezar gratis" or "Activar plan de pago"
   only — its identity (§2.2b) hasn't yet succeeded (she was still on the
   "Tu negocio" screen, had typed a name or selected a logo but hadn't
   tapped "Continuar," or a "Continuar" attempt failed, §3.10a)?
     → YES: resume exactly at that step, with whatever she'd already
       typed (Nombre, Descripción) and whatever logo she'd already
       selected intact — never re-run §3.5's write, and never advance her
       into "Define lo que vendes" with an unresolved identity. Does not
       apply to "Ver un ejemplo," which never reaches this step at all
       (§2.2b).

5. Does a Business exist, but Onboarding was left incomplete before §3.5's
   write ever succeeded (interrupted mid-flow — a path chosen but not yet
   resolved, e.g. she closed the app before tapping "Confirmar y activar" on
   the Activar plan de pago screen, §3.4 — there's no typed data to preserve
   there, just a bare confirm tap not yet taken — or while the demo path's
   confirmation screen, §3.4c, was on screen before she chose either
   option)?
     → YES: resume at the exact step she left, never restart from the
       welcome screen (§3.7). Same discipline home.md §3.13 and
       inventory.md §3.7 already apply to their own in-progress work.

6. Neither exists yet (true first launch)?
     → Show §3.3 (Bienvenida + Elegir cómo empezar), fresh.
```

### 2.2 What each path resolves, concretely

This is the part D19 explicitly left to this document: exact paths, and exactly what each one sets.

| Path | `registrationMode` (Selling Mode Capability) | `defaultSellingMode` | `subscriptionTier` |
|---|---|---|---|
| **Empezar gratis** | `{buttons}` | `buttons` (only value in the set) | `free` |
| **Activar plan de pago** | `{buttons, nfc}` — `nfc` follows automatically from `subscriptionTier=paid`, never set independently (`decision-log.md` D27) | `buttons` — always, for either real path (see §2.3) | `paid` |
| **Ver un ejemplo** (demo) | `{buttons, nfc}` | `nfc` | `paid` |

**`loyaltyEnabled` is retired and no longer has a column here** (`decision-log.md` D40) — Frequent Customers is a pure, automatic consequence of `subscriptionTier`, the same derivation `nfc` already gets from D27. "Empezar gratis" leaves it entirely unavailable (Free tier, structurally); "Activar plan de pago" and "Ver un ejemplo" both make it available immediately and automatically the moment `subscriptionTier=paid` is written.

`eventScheduling` is "always on" regardless of path (`domain-model.md` Business Capabilities table) — never presented as a choice on any screen, for any path.

**Business identity is captured alongside capabilities on both real paths, but is not itself a capability and deliberately doesn't appear as a column above.** `Business.name` (required), `Business.logo` (optional), and `Business.description` (optional) are additive data fields on the same `Business` aggregate this table's four columns already live on — see §2.2b for what this step captures and why it's required-for-name, optional-for-the-rest. The demo path's seeded Business also carries a seeded identity (§11) — since `Business.name` is required on every Business, this is true even though "Ver un ejemplo" never runs the interactive capture step (§2.2b) that produces it for a real merchant.

**Why `subscriptionTier` is now a genuine, honest two-way choice at Onboarding — a correction from this document's earlier reasoning:** An earlier version argued no honest paid option could ever be offered at first run, because Segmentation's value requires sales history that can't exist yet. That's still true — nothing here promises real segmentation data on Day 1, for either path (Frequent Customers has no sales history to show yet regardless of `subscriptionTier`, per `decision-log.md` D40 — it's available automatically for "Activar plan de pago," simply empty until real Claims accumulate). But it no longer implies there's nothing honest to offer: the corrected business model (`decision-log.md` D27) gives Paid tier an immediate, history-independent benefit — NFC selling capability. Forcing every merchant who's already decided she wants this through a Free-tier detour, then into Settings right after finishing Onboarding, would itself violate *global-principles.md*'s "the fastest interaction is the one that never happens." "Empezar gratis" stays the largest, most prominent default for anyone who hasn't already decided; "Activar plan de pago" exists for the merchant who has.

**Why the demo path is seeded at the fullest capability set (`nfc`, `paid`), unlike either real path:** the seeded sales history stands in for the real history a genuine merchant hasn't built yet — it's precisely what lets a demo profile show her `reports.md`'s "Tus clientes" segmentation and the `nfc` selling surface without her needing to actually own a kit or earn paid-tier eligibility first. Frequent Customers itself needs no separate seeding decision anymore (`decision-log.md` D40) — it's simply present the instant `subscriptionTier=paid` is seeded; the seed's own Claim history (§11's minimums) is what makes it show real, populated data. This is squarely within `decision-log.md` D19's "ordinary Business with seeded data" — no new domain modeling, just a normal Business whose capability values happen to be set to their richest combination so the example is worth looking at. It previews the brand's own "path to what's next" honestly, through real (if seeded) product behavior, rather than through marketing copy forced onto a screen.

**Why "Ver un ejemplo" is the one path gated behind an explicit confirmation screen (§3.4c) before its write happens, unlike either real path:** unlike "Empezar gratis" or "Activar plan de pago," tapping this path writes a permanent Business that she can never later turn into her real one (`decision-log.md` D19 — no conversion mechanic) — and, per §2.1, that write starts counting toward Onboarding being permanently "done." The other two paths don't need an equivalent gate because there's nothing to warn her away from: a real Business existing afterward is the whole point of tapping either of them, not a risk to flag. The demo path is different in kind — its entire value is that it *isn't* her real business, and it's the one path where that fact has to land *before* the irreversible write, not only after it. §3.6 Variant C's own honesty line ("no es información real") is real and worth keeping, but it arrives after the write already happened — too late to be the first time she learns this. §3.4c exists to say it once, plainly, at the one point where choosing differently still costs her nothing.

### 2.2a What the new "Define lo que vendes" step adds — required for both real paths, not the demo path

Resolves the Product Owner's decision (2026-08-08): "Define what she sells" moves from being captured only inline during Inventario's Registrar Mercancía flow (`inventory.md` §3.8/§3.8a, which remains the secondary path for adding *additional* Selling Groups later) to being its own step inside Onboarding, reached after §2.2b's identity capture succeeds (§3.10's write), before §3.6's Todo listo milestone — itself reached only after §3.5's Business/capabilities write succeeds, per the Product Owner's own decided ordering: identity first (§2.2b), then what she sells (this section). Lightweight, exactly two fields per entry — Selling Group (`Product.name`) and Default Price (`Product.defaultPrice`, `decision-log.md` D33) — nothing more: no category, no photo, no description, the same minimal shape D33 already established for this field.

**Required, not skippable — at least one Selling Group before "Todo listo," for both real paths.** Reasoned explicitly:
- A Business genuinely cannot be said to be "set up" if it's set up to sell nothing — a capability set (§2.2's table) with an empty Catalog behind it isn't a working Business, it's a shell. Letting her finish with zero Selling Groups would hand off into exactly the cold Catalog state this step exists, in part, to move past.
- `decision-log.md` D19's principle — capabilities are set "as a consequence of an Onboarding path, never surfaced as a raw technical setting" — doesn't argue against this — Producto/Precio are the most business-native, least technical questions this document could ask; `inventory.md` already asks the identical two facts, in the identical vocabulary, with zero controversy. D19 rules out raw capability/technical toggles, not asking her what she sells.
- Against §6's own step-count discipline: every existing tap-floor in this document is dominated by genuinely required information, with padding actively designed out. A required Selling-Group entry is the same class of unavoidable floor as "Activar plan de pago"'s confirm tap or Precio's own required-no-default treatment in `inventory.md` §3.8a — the same kind of floor, applied at the one moment it's structurally necessary: Onboarding is the only point in her relationship with the app where a Catalog is guaranteed not to exist yet.
- Skippable-with-zero would reopen the exact handoff ambiguity closed by requiring it: Home/Inventario would need to keep handling a three-way state instead of the clean two-way state §2.4 now describes.

**Not required for "Ver un ejemplo."** The demo path's seeded Catalog already satisfies this by construction (§2.2's richest-capability-combination reasoning, §11's seed minimums) — this step never appears on that path.

**Reuses Inventory's own Product-creation write path — not a second, parallel mechanism.** Each Selling Group entered here is written through the identical `Product` aggregate write `inventory.md` §3.8a already exercises inline during Registrar Mercancía — same case-insensitive/trimmed matching rule (`inventory.md` §3.8, applied here against this step's own in-progress list, since no pre-existing Catalog exists yet at first run), same required-no-default `defaultPrice` (`decision-log.md` D33). No InventoryEntry, InventoryUnit, or Lot is created here — Product records only. This is not a new kind of write for Onboarding to perform: §2.4 already establishes that the demo path's seed generation "does populate Inventory-owned (Catalog/Products/Lots/tagged units)... through those contexts' own write paths, at the point the seed is created." This step exercises the identical mechanism for real (not seeded) data, on the two real paths — only the seeded/real distinction is new. `builder`/`ui-designer` must implement this as one Product-creation mechanism reused from two entry points (Onboarding, Inventario), never as two independently-built creation paths.

### 2.2b What the new "Tu negocio" identity-capture step adds — required (for `Business.name` only) for both real paths, not the demo path

Resolves the Product Owner's decision (2026-08-08): capture an existing business identity — a name, and optionally a logo and a short description or slogan — as part of Onboarding, reached after §3.5's Business/capabilities write succeeds, **before** §2.2a's "Define lo que vendes" step. `architect` cleared this directly: `Business.name`, `Business.logo`, and `Business.description` are additive fields on the same `Business` aggregate §3.5 already writes — no new aggregate, no new bounded-context dependency edge, no ubiquitous-language redefinition.

**Explicitly "bring an existing identity in," not "create one."** The Product Owner's own framing, carried through directly into this step's design: no logo generation, no design/branding tooling, no color picker, no cropping/editing — a bare device-upload-or-skip affordance for a logo she may already have, nothing invented beyond that. A merchant with no digital logo ready is not a lesser or incomplete case this step tries to fix; see below.

**`Business.name` is required, `Business.logo` and `Business.description` are both fully optional — three fields, three different treatments, reasoned individually:**
- **`Business.name` — required, no honest default, same shape as `Product.defaultPrice`'s own required-no-default treatment (`decision-log.md` D33).** A Business's identity can't be said to be captured at all if the one field that actually identifies it to a customer is blank — and unlike a logo or a slogan, there is no honest fallback for a name (a blank name isn't a lesser but valid state, it's an unset required field). "Continuar" is gated on it, exactly as Producto/Precio gate §3.5b's own "Continuar."
- **`Business.logo` — optional, and deliberately designed as a fully first-class path, not a lesser one.** Most merchants likely don't have a digital logo ready — this is the expected common case, not an edge case to route around. No separate "skip" tap is required to bypass it: leaving it untouched and tapping "Continuar" is the entire mechanism, identical in kind to how any other optional field in this product works. There is no visual or copy treatment anywhere on this screen that marks the no-logo path as incomplete, discouraged, or provisional.
- **`Business.description` — optional, same "no skip tap needed" treatment as the logo,** captured because the Product Owner's decision named it explicitly, but not consumed by any downstream resolution logic this document or its siblings define today — stored only, the same "structurally present, not yet read" posture `decision-log.md` D9 established for Supplier, minus that entry's stricter "completely invisible" requirement, since this field does have a real, merchant-facing capture point right here.

**Not required for "Ver un ejemplo."** The demo path's seeded Business already carries a seeded identity by construction (§2.2, §11) — this step never appears on that path, the same treatment §2.2a's Catalog step already gets.

**Own write, not folded into §3.5's — reasoned explicitly, not defaulted to "new screen, new write."** The Product Owner's own sequencing (this step is reached *after* §3.5's Business/capabilities write has already succeeded) settles this by itself: folding identity fields into §3.5's write would require asking for them *before* that write runs, which isn't the sequencing decided here. Three further reasons converge on the same answer, not just the sequencing constraint:
- `decision-log.md` D30 requires every client-facing write to carry its own stable idempotency key; a genuinely separate user action (she may back out, retry, or get interrupted at this screen independently of whether §3.5's write already succeeded) needs its own key, the same way §2.2a's own Selling-Group write already does.
- This is structurally identical to the precedent this exact document already set for §2.2a: a second, small write immediately following §3.5, before §3.6, is already how this document composes an additional required-capture step onto the shared "Creando tu negocio" write — not a novel shape, a reused one.
- Keeping §3.5's own write untouched (same fields, same atomicity guarantee, no new failure mode threaded through it) is lower-risk than widening an already-Approved, already-reviewed write action to carry three more fields, two of them entirely optional-and-independently-revisable.

**No pattern precedent exists in this document family for a device-upload affordance specifically — reasoned here rather than treated as needing its own fresh consultation.** What's actually being designed at this document's own layer of abstraction is an affordance to trigger a device-level file selection, a display state once something is selected, and change/remove controls once it exists — not the file picker itself, which sits below this spec's abstraction level, the identical treatment already given to Authentication (§0) and to the OS-level mechanics `architecture-principles.md` leaves to implementation. Composed entirely from two primitives this document family has already established and reviewed: a tap-to-trigger affordance (the `[ ]` convention used everywhere), and a committed-item-with-remove control (§3.5c's own `[✕]`). If `ux-critic` or a later reviewer reads this as crossing into genuinely novel interaction-pattern territory rather than a composition of precedented primitives, it should be routed to `knowledge-mentor` before this section is finalized — flagged here explicitly rather than silently asserted as settled, since this document's own tooling has no way to request that consultation directly.

### 2.3 Why `defaultSellingMode` is always written as `buttons` at Onboarding, for both real paths — never a choice, and never derived from which path she picked

This is a reversal of this document's earlier resolution, corrected alongside `decision-log.md` D27, not a restatement of it. Two independent reasons converge:

- Under the old model, tapping "Activar kit NFC" was an unambiguous statement of intent — that path had exactly one possible reason to exist. Under the corrected model, "Activar plan de pago" conflates two independent benefits (NFC capability now, eventual segmentation once real sales history exists) — the tap alone no longer unambiguously signals "I want tags as my normal selling mode." She may be subscribing purely for the future segmentation value, with no intention of using tags yet.
- Regardless of which real path she picks, she has zero tagged inventory at the exact moment either one completes. Writing `defaultSellingMode = nfc` here would guarantee her first real Session evaluates **Not Ready** (`home.md` §2/§3.6a) and silently substitutes `buttons` anyway — for every Paid-tier merchant, unconditionally, with no corresponding benefit. A default that's wrong the instant it's set isn't a default worth setting.

So `defaultSellingMode` is written as `buttons` unconditionally for **both** real Onboarding paths — never inferred from path choice, never asked as a separate question either. Whether and when she wants `nfc` as her normal selling mode is now a genuinely separate decision, made once she has tagged inventory to back it up, via `settings.md`'s self-service "Cambiar a vender con tags" control (`decision-log.md` D27) — not something Onboarding can honestly infer on her behalf.

This still respects *global-principles.md*'s "never ask twice" and "business language before technical language": Onboarding doesn't ask a raw `defaultSellingMode` question either, it just no longer pretends the path choice answers it. And it still matches *architecture-principles.md* #1 ("capabilities resolved once, upstream, never asked mid-flow") — `registrationMode` (via `subscriptionTier`) is still resolved once, at the highest point it could possibly apply, before any tab, Session, or Sale exists; only the *separate* `defaultSellingMode` preference moved to where it can be set honestly.

Symmetrically, `registrationMode ⊇ {nfc}` immediately activates Inventario's existing Assign-Tags gate (`information-architecture.md`, `inventory.md` §2) the moment she registers her first Lot — no new design needed there either; it's a pure consequence of the capability now being in the set.

### 2.4 Handoff — where Onboarding's responsibility actually ends

The last screen this document owns is §3.6 (Todo listo). The screen after it is produced entirely by `home.md`'s own, already-approved resolution logic — not a new screen defined here:

- **Empezar gratis / Activar plan de pago** → Her business identity is already captured (`Business.name` required, optional logo/description, §2.2b/§3.9–§3.10a) and Catalog now holds one or more named Products with a `defaultPrice` each (§2.2a/§3.5b–§3.5e), but zero Lots/InventoryUnits ever received — no stock exists yet. Per `home.md`'s own corrected §2 step 3 test ("at least one `available` InventoryUnit," not "Product ever registered" — see that document's 2026-08-08 correction), this still routes to Home's cold start (`home.md` §3.3), verbatim, same CTA ("Registrar mercancía") that document already specifies — but she now lands inside `inventory.md`'s Registrar Mercancía (§3.6) with her already-named Products immediately selectable from the picker (`inventory.md` §3.8), rather than needing to type a single Product name from scratch. Her captured identity has no equivalent inline consumer inside Inventario's own flow today — its one designed consumer is `home.md` §3.8f's Digital Receipt, reached the first time she finalizes a Sale, not before. *global-principles.md*, "capture business truth once, reuse it forever" — the concrete payoff of moving Selling-Group naming earlier, not merely relocating the same question; the identical payoff applies to identity, one Onboarding screen replacing what would otherwise be a first-receipt-moment prompt this document deliberately doesn't design (§2.2b already captures it earlier, honestly, when she has time to think about it rather than a customer standing in front of her).
- **Ver un ejemplo** → Catalog is seeded and non-empty, with real stock (InventoryUnits) already present (§11's seed minimums) → Home's idle state (`home.md` §3.4, or §3.6 "Continuar Día N" if the seed includes an active Event), same screen, populated with seeded data — unchanged by this amendment. Her seeded Business also carries a seeded identity (§11) — `home.md` §3.8f's receipt renders meaningfully on a demo Sale too, without her ever passing through §2.2b's own capture screen.

No path ever hands off into a pre-opened, *active* Session, for any reason — including the demo. She always taps "Iniciar Sesión Rápida" (or "Continuar Día N") herself, the first time, exactly like every other merchant. This is a narrower claim than "Onboarding never writes Inventory/Selling data at all": the demo path's seed generation does populate Inventory-owned (Catalog/Products/Lots/tagged units) and Selling-owned (past Events/Sessions/Sales) historical data — through those contexts' own write paths, at the point the seed is created — since that's the whole mechanism that makes a demo profile worth looking at (§2.2). **The two real paths now also write Inventory-owned data, narrower in scope:** §2.2a/§3.5b–§3.5e's "Define lo que vendes" step writes one or more real (not seeded) Product records with a `defaultPrice` each, through Inventory's own Product-creation write path — never a Lot, InventoryEntry, InventoryUnit, or any Selling-owned data, and never seeded/fabricated, since this is the merchant's own real, typed information. §2.2b/§3.9–§3.10a's identity capture writes no new context's data at all — `Business.name`/`Business.logo`/`Business.description` are additive fields on the same `Business` aggregate, in the same Identity context, that §3.5's own write already owns; this is narrower still than the Catalog step above, not a second new dependency to name. What never happens, for any path, is Onboarding fabricating a *live*, already-open selling state on her behalf — that would be a genuinely new, unjustified dependency and a direct violation of *architecture-principles.md* #6. Historical/seeded data existing when she arrives (demo path), or a named-but-unstocked real Catalog existing when she arrives (either real path), are both different concerns from an active Session existing before she's tapped anything.

## 3. Low-fidelity wireframes

Conventions inherited from `home.md`/`inventory.md`: `[ ]` = tappable, plain text = passive/informational. **One deviation from every other document in this family: no persistent bottom nav bar appears on any screen in this section.** Before a Business's capabilities exist, there is nothing yet for Hoy/Inventario/Eventos/Resultados to resolve into — showing four tabs that lead nowhere real would be a false affordance, the opposite of *global-principles.md*'s "technology should disappear." The nav bar's first-ever appearance is the instant Home is reached in §3.6's handoff.

### 3.1 Resolving (near-instant) — determining whether Onboarding is needed at all
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
└───────────────────────────────┘
```
- Identical silent-skeleton convention to every tab's own §3.1 (`home.md`, `inventory.md`, `events.md`, `reports.md`). *global-principles.md*, "technology should disappear."
- No nav bar — none exists to show yet (see §3 preamble).

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
└───────────────────────────────┘
```
- One calm, plain-language line, identical convention to every other tab's §3.2. *global-principles.md*, "business language before technical language."

### 3.3 Bienvenida + Elegir cómo empezar (true first-run entry point)
```
┌───────────────────────────────┐
│                                │
│           Nahui                 │
│                                │
│  Aquí vas a registrar tus        │
│  ventas al momento y ver cómo    │
│  va tu negocio, sin perder       │
│  tiempo con la app.               │
│                                │
│   ¿Cómo quieres empezar?         │
│                                │
│   [    Empezar gratis      ]    │  primary, largest
│                                │
│   [  Activar plan de pago  ]    │  secondary
│   (si ya arreglaste tu pago)     │  subtext, small
│                                │
│      [   Ver un ejemplo    ]     │  tertiary, text-only link
│                                │
└───────────────────────────────┘
```
- **Welcome copy and the path choice live on one screen, not two.** An earlier draft of this design split them, with a separate "Comenzar" tap between them purely to hold a warm welcome line. Merged here because that tap added nothing but a step — the same warmth reads perfectly well sitting directly above the three options. Direct application of *global-principles.md*, "the fastest interaction is the one that never happens." See §10.
- No back arrow — this is the one screen in the whole document with nowhere to go back to.
- "Empezar gratis" is the largest, most prominent option: the fastest, zero-friction default, matching the hierarchy principle `home.md` §3.4 already establishes for its own primary action ("Iniciar Sesión Rápida" first-class, not a fallback).
- "Activar plan de pago" is visually secondary — a real, valid path, but a narrower one (only merchants who've already arranged to pay). The subtext directly beneath it ("si ya arreglaste tu pago") states that prerequisite at the point of decision, not one screen later — the only reassurance that this path doesn't process a payment in-app ("no se te cobra nada aquí," §3.4) previously appeared only after she'd already tapped through, one screen too late for a fact this basic.
- "Ver un ejemplo" (renamed from an earlier draft's "Ver un ejemplo primero" — see §10) is the lightest-weight of the three, text-only, but now bracketed like the other two for tappable-affordance consistency (`home.md`/`inventory.md`'s `[ ]` convention). It isn't starting her real business, so it doesn't compete visually with the two paths that are — but unlike an earlier draft, tapping it no longer writes anything directly: it opens a confirmation step (§3.4c) first, precisely because what it commits to is permanent and irreversible in a way visual weight alone shouldn't be trusted to communicate.
- Copy never mentions "cuenta gratuita," "suscripción," "modo de venta," or any capability by its technical name — "gratis," "plan de pago," "ejemplo" are the only technical-adjacent words used, and all three are words Ana already has a mental model for.

### 3.4 Activar plan de pago — confirmar antes de continuar
```
┌───────────────────────────────┐
│ ← Elegir cómo empezar            │
│                                │
│  Activar plan de pago            │
│                                │
│  Vas a poder vender con tags,     │
│  además de botones. Cuando        │
│  tengas historial de ventas,      │
│  también vas a ver resultados     │
│  por bazar.                       │
│                                │
│  Esto se activa confirmando tu    │
│  pago fuera de la app — no se     │
│  te cobra nada aquí. Si ya lo     │
│  arreglaste, confirma abajo.      │
│                                │
│  [  Confirmar y activar   ]      │
│                                │
│  [ Mejor quiero empezar gratis ] │  escape hatch, tappable
└───────────────────────────────┘
```
- Confirms an already-arranged payment — a bare self-attestation, never a purchase step in-app, per `decision-log.md` D19's payments/checkout boundary and D27's corrected capability mechanism. The reassurance line ("no se te cobra nada aquí") makes that non-goal legible directly in the copy, not just in this document's own reasoning. This is the first and only place the no-charge reassurance appears — §3.3's own subtext states a related but distinct fact (that she needs to already have arranged payment), not the cost point; the two shouldn't be conflated when either screen's copy is revised later.
- No code, no kit dependency — unlike the retired activation-code mechanism this path used to require, there is nothing to type and nothing that can come back "invalid." A single confirm tap either succeeds (§3.5) or fails on genuine save error (§3.5a) — the same shape as every other write in this document family.
- "Mejor quiero empezar gratis" routes back to §3.3 with nothing lost and nothing to confirm — she hasn't committed to anything yet at this point, so there's no destructive action to protect against. *global-principles.md*, "never a dead end," same posture every other document's error/recovery states already take.

### 3.4c Ver un ejemplo — antes de continuar

The demo path's one deliberate pause point, mirroring the pause the NFC path already has at §3.4: a real screen, not an instant pass-through, reached the moment she taps "Ver un ejemplo" in §3.3, before anything is written.

```
┌───────────────────────────────┐
│ ← Elegir cómo empezar            │
│                                │
│  Ver un ejemplo                  │
│                                │
│  Esto crea un negocio de         │
│  ejemplo con ventas y clientes    │
│  inventados, para que veas cómo   │
│  se usa Nahui.                    │
│                                │
│  No es tu negocio real, y no      │
│  vas a poder convertirlo en tu    │
│  negocio real después. Para tu    │
│  negocio real, usa "Empezar       │
│  gratis" o "Activar plan de       │
│  pago."                          │
│                                │
│  [      Ver el ejemplo      ]    │  confirm — this is what commits
│                                │
│  [ Mejor quiero registrar mi     │
│    negocio real ]                │  escape hatch, tappable
└───────────────────────────────┘
```
- Nothing is written yet on this screen — the write happens only after "Ver el ejemplo" is tapped, at §3.5. This is the moment the permanence/non-real-data fact has to land, *before* the irreversible write, not only afterward on §3.6's milestone screen — the earlier draft's only equivalent disclosure came one screen too late to be useful to a merchant deciding whether to proceed.
- "Mejor quiero registrar mi negocio real" routes back to §3.3 with nothing lost and nothing to confirm, identical posture to "Mejor quiero empezar gratis" (§3.4) — she hasn't committed to anything at this point, so there's no destructive action to protect against. *global-principles.md*, "never a dead end."
- No auto-continue here, unlike §3.6 — this is the one screen in the document that should not advance on its own, since its entire purpose is to make sure she actually reads it before an irreversible write happens.
- "Ver un ejemplo" (§3.3) and "Ver el ejemplo" (this screen) are deliberately different verb forms in the Spanish copy — the first is choosing to look at the option, the second is the actual act of committing to it — so the two taps don't read as the same decision repeated twice, even though structurally §3.3's tap is navigation and this screen's tap is the real commitment.

### 3.5 Creando tu negocio — near-instant / slow (shared by all three paths)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│                                │        │      Preparando todo…           │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │                                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
- The one write action every path shares — the moment a Business and its capabilities actually get created (§2.2). Same near-instant/slow convention as every write action in this document family (`inventory.md` §3.10, `events.md` §3.9, `home.md` §3.8c).
- For "Ver un ejemplo," this same state also covers generating the seeded data — no separate "building your example" screen invented; from her side, it's the identical wait with the identical plain copy. Deliberately not more elaborate than this: a longer, more "impressive"-looking generation sequence would just be padding a wait she doesn't need to watch. Reached only after §3.4c's confirmation, never before it.
- **Atomicity guarantee:** for every path, this write is all-or-nothing. For the demo path specifically — where Business creation and seed-data generation are bundled into this one step — either both the Business (with its capabilities) and the full seeded Catalog/history are written together, or neither is written at all. A partial failure (e.g. capabilities saved but seed data only partially generated) is treated identically to a total failure: it routes to §3.5a, and retrying re-runs the entire write from scratch — it never resumes into, or leaves behind, a half-seeded Business. This matters specifically here because §2.1's "capabilities already written" check (case 2) depends on this step having genuinely succeeded in full — an inconsistent partial write is exactly the scenario that check has to be able to rule out. Same rigor `home.md`'s Finalizar Venta gives its own write action.

### 3.5a Creando tu negocio — error
```
┌───────────────────────────────┐
│  No pudimos crear tu negocio.    │
│  Intenta de nuevo.                │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
- Nothing about her choice (which path, a confirmed payment, or a confirmed demo) is lost by a failed creation — retrying replays the same, already-confirmed choice, never asks her to redo the path selection, re-confirm an already-confirmed payment, or re-confirm the demo path's §3.4c screen. *global-principles.md*, "the best interface stays out of the merchant's way," same guarantee `inventory.md` §3.11 makes for a failed Guardar mercancía.
- For the demo path specifically, retrying re-attempts the full atomic write described in §3.5 — never a partial resume into a half-seeded Business.

### 3.5b Define lo que vendes — entry (real paths only: Empezar gratis, Activar plan de pago)
```
┌───────────────────────────────┐
│  ¿Qué vendes?                    │
│  Agrega lo que vendes y a         │
│  cuánto — puedes agregar o        │
│  cambiar esto después, cuando      │
│  quieras, en Inventario.           │
│                                │
│ Producto                        │
│  [ Escribe el nombre… ]          │
│ Precio                          │
│  [ $ ___ ]                       │
│                                │
│  [ + Agregar otro producto ]     │
│                                │
│  [        Continuar        ]     │  disabled until Producto + Precio
│                                │  hold values, on this row or ≥1
│                                │  already agregado
└───────────────────────────────┘
```
- Reached the instant §3.10's identity write succeeds, for "Empezar gratis" and "Activar plan de pago" only — never for "Ver un ejemplo" (§2.2a/§2.2b). No nav bar, same §3-preamble reasoning as every other Onboarding screen.
- No back arrow, for the identical reason §3.6 has none: by this point the Business and its capabilities already exist (§3.5's write already succeeded) — nothing upstream to return to or undo.
- **Producto and Precio share one flat entry row, unlike Inventario's own two-step "Elegir producto → nuevo producto, precio inicial" shape** (`inventory.md` §3.8/§3.8a). Deliberate simplification, not an inconsistency: Inventario's two-step shape exists to resolve the ambiguity between "restock something I already sell" and "this is new" — a distinction that cannot arise here, since a first-run Business's Catalog is guaranteed empty (§2.2a). Every entry on this screen is unconditionally new, so there's no picker/search step to route through.
- Same required-no-default treatment `inventory.md` §3.8a already established for Precio: no honest guessable default exists for a price. "Continuar" is enabled once at least one Selling Group is ready to save — either ≥1 already-committed line exists, or the active row itself holds both Producto and Precio. If the active row is partially filled (one field but not the other) while ≥1 line is already committed, "Continuar" stays disabled until that row is either completed or cleared back to empty — the same "never silently drop what she's mid-typing" guarantee `inventory.md` §3.11 makes for a failed save, applied here to avoid an ambiguous partial row silently vanishing on tap.
- Matching rule: case-insensitive, trimmed, identical to `inventory.md` §3.8 — applied here against this step's own already-committed lines (§3.5c), since no pre-existing external Catalog exists yet to match against.

### 3.5c Define lo que vendes — con líneas agregadas
```
┌───────────────────────────────┐
│  ¿Qué vendes?                    │
│                                │
│ Ya agregaste:                    │
│  Pijama — $150                [✕] │
│  Sudadera/Maxy — $220            [✕] │
│                                │
│ Producto                        │
│  [ Escribe el nombre… ]          │
│ Precio                          │
│  [ $ ___ ]                       │
│                                │
│  [ + Agregar otro producto ]     │
│                                │
│  [        Continuar        ]     │
└───────────────────────────────┘
```
- "+ Agregar otro producto" commits the current row (Producto + Precio, both required) and opens a fresh blank one — identical gating shape to `inventory.md` §3.6/§3.7's Producto+Cantidad gate.
- `[✕]` on a committed row removes it before saving — the only correction mechanism this screen offers. There is no separate "edit price" affordance on an already-committed line (unlike `inventory.md` §3.4a's later Catalog-row price edit, which only exists once a Product is real) — removing and re-adding is the only path to fix a typo here, an acceptable cost given this list is typically short.
- **No "Descartar" equivalent, unlike `inventory.md` §3.9 — deliberate, not an oversight.** A Lot's Descartar exists because discarding an entire in-progress receiving batch is a real, sometimes-desired action under the time/count pressure Inventario's own context creates (`inventory.md` §1); this step carries no equivalent pressure (Onboarding, by this document's own §1, is never time-critical), and a single mistaken line is already fully covered by `[✕]` — a bulk-discard shortcut would solve a problem this context doesn't have.
- **Typing a Producto matching (case-insensitive, trimmed) an already-committed line never creates a duplicate — the guarantee covers committing the active row through either of this screen's two commit actions, "+ Agregar otro producto" or "Continuar."** Attempting either with a duplicate Producto typed shows the same small inline message — "Ya agregaste '<Nombre>' — bórrala con [✕] si quieres cambiar el precio" — and the active row is not added as a second line.
- "Continuar" writes every committed line, plus a valid active row, atomically, through Inventory's own Product-creation write path (§2.2a) — see §3.5d/§3.5e. Per `decision-log.md` D30, this write carries the same stable idempotency-key guarantee every other retryable write in this doc family carries.
- The only way off this screen is "Continuar" succeeding, or an app-level interruption (which silently preserves this exact draft per §2.1 case 3/§3.7) — no back arrow, no nav bar to navigate away through.

### 3.5d Guardando lo que vendes — near-instant / slow
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│                                │        │   Guardando lo que vendes…      │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │                                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
- Identical near-instant/slow convention to §3.5 and every other write action in this document family.
- **Atomicity guarantee, identical in kind to §3.5's own:** either every committed Selling Group (and the valid active row) is written, or none is — a partial failure is treated identically to a total failure, routing to §3.5e, and retrying re-runs the entire batch from scratch.

### 3.5e Guardando lo que vendes — error
```
┌───────────────────────────────┐
│  No pudimos guardar lo que        │
│  vendes. Sigue aquí, intenta       │
│  de nuevo.                       │
│  Pijama — $150                   │
│  Sudadera/Maxy — $220              │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
- Nothing typed is lost by a failed save — retrying replays the same already-committed Selling Groups and active row, never asks her to retype anything. Same guarantee `inventory.md` §3.11 makes for a failed Guardar mercancía.

### 3.6 Todo listo — milestone / handoff (three copy variants)

**Variant A — Empezar gratis:**
```
┌───────────────────────────────┐
│                                │
│         Todo listo              │
│                                │
│  Ya puedes registrar lo que      │
│  traes y empezar a vender.        │
│                                │
│      [      Entrar      ]       │
│                                │
└───────────────────────────────┘
```

**Variant B — Activar plan de pago:**
```
┌───────────────────────────────┐
│                                │
│         Todo listo              │
│                                │
│  Ya puedes vender con botones.    │
│  Cuando tengas mercancía           │
│  etiquetada, cambia a vender       │
│  con tags en Configuración.        │
│                                │
│      [      Entrar      ]       │
│                                │
└───────────────────────────────┘
```

**Variant C — Ver un ejemplo:**
```
┌───────────────────────────────┐
│                                │
│         Todo listo              │
│                                │
│  Esto es un ejemplo de cómo se   │
│  ve tu negocio en Nahui.          │
│  Explora lo que quieras — no      │
│  es información real.             │
│                                │
│      [      Entrar      ]       │
│                                │
└───────────────────────────────┘
```
- One genuinely warranted deliberate moment in an otherwise frictionless flow: this is the single first-ever milestone in Ana's whole relationship with the app, and *brand-guide.md*'s tone ("warm, direct... a tool that feels welcoming, not intimidating") justifies exactly one beat of ceremony here, the same way `home.md` §3.12's close-summary earns its own distinct screen for a real, meaningful, once-per-day event. This is a once-*ever* event, an even more conservative bar to clear.
- "Entrar" auto-continues into Home after a couple of seconds if left untouched, but is tappable immediately — she is never made to wait through her own milestone screen against her will. Same reasoning as the ambient, self-dismissing confirmations in `inventory.md` §3.12/§3.13, scaled to a full screen because this moment, unlike a routine Lot save, is unique.
- Variant C's honesty ("no es información real") is deliberate and load-bearing, but by the time she reaches this screen it's a *reinforcement* of a fact she already read and confirmed at §3.4c, before the write — not the first or only place she learns it. See §8's open validation question and §11 for why this line still matters for trust, without inventing any persistent in-app indicator beyond this screen.
- No back arrow on any variant — by this point a Business and its capabilities already exist (§2.2); there's nothing to undo by going back, the same way none of `inventory.md`'s post-save confirmations offer a way back into the form that produced them.
- If she's interrupted while this screen is showing (phone call, backgrounding, OS kill), the next app open resumes at this exact same variant rather than silently skipping to Home — see §2.1 case 2 and §3.7 for the full guarantee.

### 3.7 Retomar onboarding interrumpido

No new wireframe — reaching any screen in §3.3 through §3.10a a second time (after the app was closed, backgrounded, or crashed mid-flow) renders it **pixel-identical** to the state described above, with whatever she'd already entered still present (the "Activar plan de pago" confirmation screen, §3.4, re-shows itself identically if she was interrupted there before tapping "Confirmar y activar" — there's no typed data to preserve, just a bare confirm tap not yet taken; the demo path's confirmation screen, §3.4c, re-shows itself identically if she was interrupted there before choosing either option; a path already tapped but not yet confirmed by a completed write is re-resumed at that exact step); the "Tu negocio" identity-capture step (§3.9/§3.9a, real paths only) re-shows itself identically, with whatever Nombre/Descripción she'd already typed and whatever logo she'd already selected intact; the "Define lo que vendes" step (§3.5b/§3.5c, real paths only) re-shows itself identically, with every already-committed Selling Group and whatever she'd typed into the still-active row intact — the identical draft-preservation guarantee `inventory.md` §3.7 already makes for its own in-progress Registrar Mercancía form. Same guarantee `home.md` §3.13 and `inventory.md` §3.7 already make for their own in-progress work — *global-principles.md*, "never ask twice." She is never asked "were you still setting up?" and never restarted from §3.3 once she's made real progress past it.

**This same guarantee extends past §3.5, through §3.6 — deliberately, not by oversight (see §2.1, case 2).** Onboarding's capabilities being written (§3.5's write succeeding) is necessary but not sufficient for "complete" to mean "never shown again." If she's interrupted while a "Todo listo" variant (§3.6) is on screen — a phone call, backgrounding, an OS kill, all routine events, not edge cases — the next app open resumes at that exact same variant (recomputed from her already-stored path/capabilities, never re-triggering §3.5's write a second time) rather than silently marking Onboarding complete and skipping straight to Home. This is the one narrowing of D13's "complete" in the whole document, and it exists for a specific reason: §3.6 is this document's own argument for why one deliberate beat of ceremony is warranted at all — an interruption shouldn't be allowed to silently cost her the one screen this document treats as worth having.

### 3.8 Falla defensiva — no se pudo determinar el estado inicial
```
┌───────────────────────────────┐
│  No pudimos cargar Nahui.        │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
- Covers §3.1/§3.2's own resolution failing outright (can't determine whether a Business/completed Onboarding exists at all). Manual `Reintentar`, same convention as `inventory.md` §3.18 / `events.md` §3.18 / `reports.md` §3.14 (not Home's more aggressive silent auto-retry) — there is no live-customer risk at this exact moment to justify that heavier mechanism.
- No nav bar to preserve here (none exists yet) — unlike every other tab's own fallback, this state genuinely has nothing beyond itself to keep functional.

### 3.9 Tu negocio — identity capture, entry (real paths only: Empezar gratis, Activar plan de pago)
```
┌───────────────────────────────┐
│  Tu negocio                     │
│  Tu nombre y tu logo son lo que  │
│  tus clientes van a ver en tu    │
│  recibo digital. Trae tu logo    │
│  si ya tienes uno — no es         │
│  necesario.                       │
│                                │
│ Nombre de tu negocio             │
│  [ Escribe el nombre… ]          │
│                                │
│ Logo (opcional)                  │
│  [ Subir logo ]                  │
│                                │
│ Descripción o frase (opcional)   │
│  [ Escribe algo breve… ]         │
│  La guardamos con tu negocio —   │
│  tu recibo no la muestra          │
│  todavía.                         │
│                                │
│  [        Continuar        ]     │  disabled until Nombre holds a value
└───────────────────────────────┘
```
- Reached the instant §3.5's write succeeds, for "Empezar gratis" and
  "Activar plan de pago" only — never for "Ver un ejemplo" (§2.2b). Precedes
  §3.5b's "Define lo que vendes" step, per the Product Owner's own decided
  ordering (§2.2b) — identity first, then what she sells.
- No back arrow — identical reasoning to §3.5b: by this point the Business
  and its capabilities already exist (§3.5's write already succeeded),
  nothing upstream to return to or undo. No nav bar, same §3-preamble
  reasoning as every other Onboarding screen.
- **Only Nombre gates "Continuar."** Logo and Descripción impose zero
  required taps — leaving either blank and tapping "Continuar" is the
  entire skip mechanism, there is no separate "Ahora no" affordance to
  find or tap, and no visual treatment marking either field as
  provisional or lesser (§2.2b). This is the deliberate design decision
  that makes the no-logo path fully first-class: the majority-case
  merchant who has no digital logo ready sees a screen with nothing
  urging her to go find one.
- **The intro line's claim is scoped to exactly what it's true of — Nombre
  and Logo, not Descripción — corrected 2026-08-08.** An earlier draft's
  intro ("Esto es lo que tus clientes van a ver en tu recibo digital,"
  sitting above all three fields) made that claim about all three, but
  `home.md` §3.8f's Digital Receipt only ever renders `Business.name` and
  `Business.logo` — `Business.description` is stored only, per §2.2b, and
  isn't consumed by any downstream resolution logic this document family
  defines today. Telling the merchant who fills in a description that her
  customers will see it would be false. The fix narrows the intro's claim
  to the two fields it's actually true of, and gives Descripción its own
  honest, separate caption instead — "La guardamos con tu negocio — tu
  recibo no la muestra todavía," directly beneath its input. This states
  plainly what's true right now (captured, not yet shown anywhere)
  without discouraging her from filling it in: it doesn't claim the field
  is pointless, and it doesn't rule out a future surface consuming it —
  it just doesn't promise one that doesn't exist yet. *global-principles.md*,
  "business language before technical language" and "never overpromise
  what the product doesn't yet do."
- **"Subir logo" opens the device's own photo/file picker** — below this
  spec's abstraction level, the identical treatment `Authentication`
  already receives (§0). No cropping, no editing, no color/branding
  tooling of any kind — a bare "bring what you already have" affordance,
  per the Product Owner's explicit framing (§2.2b). Canceling the device
  picker returns to this exact screen, unchanged, nothing written or
  lost. Selecting a file that renders successfully transitions to §3.9a;
  selecting one that can't be shown surfaces the inline failure state
  below instead, and never reaches §3.9a.
- **A file that can't be shown as a logo preview — unsupported format,
  corrupted file, too large to process — gets a lightweight inline
  failure state on this exact screen, not a new full-screen state,
  corrected 2026-08-08.** This is a different case from "nothing is
  written until Continuar" (§3.10/§3.10a remains the only state where an
  actual platform *write* can fail): the *display* step — rendering a
  selected file as a logo preview — is explicitly in this document's own
  scope (§2.2b), and that's exactly where this kind of failure happens,
  independent of any write ever being attempted. A brief message appears
  directly beneath "Subir logo":
  ```
  Logo (opcional)
   [ Subir logo ]
   No pudimos mostrar ese archivo.
   Intenta con otro logo, si quieres.
  ```
  and the screen otherwise returns to exactly this no-logo rendering —
  whatever she's already typed into Nombre or Descripción stays
  untouched, and "Continuar" stays gated on Nombre alone, exactly as
  before. Tapping "Subir logo" again dismisses the message and reopens
  the device picker. Since the field is fully optional, recovery is
  exactly as low-cost as simply abandoning it — she's never required to
  resolve the failure before continuing. *global-principles.md*, "never a
  dead end," same low-severity posture this document already gives
  fully-optional, fully-reversible states like §3.9a's own "Cambiar"/
  "Quitar."

### 3.9a Tu negocio — con logo seleccionado
```
┌───────────────────────────────┐
│  Tu negocio                     │
│  Tu nombre y tu logo son lo que  │
│  tus clientes van a ver en tu    │
│  recibo digital.                  │
│                                │
│ Nombre de tu negocio             │
│  [ Ropa Ana                ]     │
│                                │
│ Logo (opcional)                  │
│  ┌────┐                          │
│  │IMG │   [ Cambiar ]  [ Quitar ]│
│  └────┘                          │
│                                │
│ Descripción o frase (opcional)   │
│  [ Ropa cómoda para toda la      │
│    familia                 ]     │
│  La guardamos con tu negocio —   │
│  tu recibo no la muestra          │
│  todavía.                         │
│                                │
│  [        Continuar        ]     │
└───────────────────────────────┘
```
- Same screen as §3.9, once a logo has been selected — not a distinct
  destination, the identical relationship §3.5b/§3.5c already have to
  each other (one screen, a second rendering once she's added something).
- "Cambiar" reopens the device picker to replace the current selection;
  "Quitar" clears it and returns to §3.9's no-logo rendering. Neither
  needs a confirmation step — low-stakes, fully reversible, nothing has
  been written to the platform yet at this point, the same reasoning
  §3.5c's own `[✕]` removal already rests on. "Cambiar" is subject to the
  same inline failure state as §3.9's own "Subir logo" if the newly
  selected file can't be shown — the current preview stays on screen
  unchanged in that case, since nothing about the already-working
  selection is touched by a failed replacement attempt.
- **Intro subtext drops "Trae tu logo si ya tienes uno — no es
  necesario," corrected 2026-08-08.** §3.9's clause asks her to bring a
  logo she's already brought — repeating it here would be telling her to
  do something she just did. This follows the same pattern this document
  already established at §3.5c, which drops §3.5b's now-irrelevant intro
  line once the Selling-Group list is non-empty. What remains is exactly
  the part of the corrected intro (see §3.9's own reasoning above) that's
  still true and still relevant once a logo exists: that her Nombre and
  Logo are what her customers actually see on the receipt.
- Nombre and Descripción shown filled here purely as a plausible
  illustrative example, matching §3.5c's own convention of showing
  populated example values rather than an abstract placeholder.

### 3.10 Guardando tu negocio — near-instant / slow
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│                                │        │   Guardando tu negocio…         │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │                                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
- Identical near-instant/slow convention to every other write action in
  this document family. Writes `Business.name` (required), and
  `Business.logo`/`Business.description` if she set either — additive
  fields on the same `Business` aggregate §3.5 already wrote, in the same
  Identity context (§2.2b) — never a new aggregate, never a new
  bounded-context edge.
- **Atomicity guarantee, identical in kind to §3.5's own:** all three
  fields (or however many she set) are written together, or none are — a
  partial failure is treated identically to a total failure, routing to
  §3.10a, and retrying re-runs the entire write from scratch.
- Per `decision-log.md` D30, this write carries the same stable
  idempotency-key guarantee every other retryable write in this document
  family carries — generated once when "Continuar" is first tapped,
  reused unchanged on every retry of that same attempt.
- On success, routes directly to §3.5b — "Define lo que vendes" — never
  back to §3.9, never to §3.6.

### 3.10a Guardando tu negocio — error
```
┌───────────────────────────────┐
│  No pudimos guardar tu negocio.  │
│  Sigue aquí, intenta de nuevo.    │
│  Ropa Ana                        │
│  [ logo seleccionado ]           │
│  Ropa cómoda para toda la        │
│  familia                         │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
- Nothing typed or selected is lost by a failed save — retrying replays
  the same already-typed Nombre, already-selected Logo, and already-typed
  Descripción, never asks her to redo any of it. Same guarantee §3.5e
  makes for a failed "Guardar lo que vendes," and `inventory.md` §3.11
  makes for a failed Guardar mercancía.
- **Illustrative Descripción value added to the wireframe, corrected
  2026-08-08 — a mockup-completeness fix, not a change in guarantee.**
  The prose above already committed to Descripción surviving a failed
  save; this only brings the ASCII mockup in line with that guarantee,
  matching §3.5e's own convention of listing every committed item rather
  than a subset of them.

## 4. Interaction flow (summary)

```
Open app (very first time, or any time before Onboarding completes)
  → resolve (§2.1, automatic)
      → already complete (capabilities + identity + Selling Groups written
        AND §3.6 dismissed) ──────────────────────────────────────────────→
        Home's own resolution (home.md §2)
      → capabilities written, §3.6 still showing when interrupted ────→ resume
        the same Todo listo variant (§3.6, §2.1 case 2)
      → capabilities + identity written, Define lo que vendes not yet
        complete (real paths only) ────────────────────────────────────→
        resume exact step (§3.5b/§3.5c, §2.1 case 3)
      → capabilities written, Tu negocio (identity) not yet complete
        (real paths only) ──────────────────────────────────────────────→
        resume exact step (§3.9/§3.9a, §2.1 case 4)
      → in-progress, interrupted before §3.5's write succeeded ───────→ resume
        exact step (§3.7)
      → fresh ───────────────────────────────────────────────────────→ Bienvenida
        + Elegir cómo empezar (3.3)
      → resolution itself fails ─────────────────────────────────────→ fallback
        (3.8), Reintentar

From §3.3, tap a path:

  Empezar gratis
    → creando tu negocio (3.5) → error (3.5a) → Reintentar
    → success → Tu negocio (3.9/3.9a) → Continuar
        → guardando (3.10) → error (3.10a) → Reintentar
        → success → Define lo que vendes (3.5b/3.5c) → Continuar
            → guardando (3.5d) → error (3.5e) → Reintentar
            → success → Todo listo, Variant A (3.6) → Entrar → Home cold
              start (home.md §3.3), Products already named and selectable
              in the picker (`inventory.md` §3.8), receipt-moment identity
              already captured (home.md §3.8f)

  Activar plan de pago
    → confirmar antes de continuar (3.4)
        → "Mejor quiero empezar gratis" → back to 3.3, nothing written
        → tap "Confirmar y activar" → creando tu negocio (3.5) → error (3.5a) → Reintentar
    → success → Tu negocio (3.9/3.9a) → Continuar
        → guardando (3.10) → error (3.10a) → Reintentar
        → success → Define lo que vendes (3.5b/3.5c) → Continuar
            → guardando (3.5d) → error (3.5e) → Reintentar
            → success → Todo listo, Variant B (3.6) → Entrar → Home cold
              start (home.md §3.3), Products already named and selectable,
              receipt-moment identity already captured (home.md §3.8f)

  Ver un ejemplo
    → confirmar antes de continuar (3.4c)
        → "Mejor quiero registrar mi negocio real" → back to 3.3, nothing written
        → tap "Ver el ejemplo" → creando tu negocio (3.5, generating seeded
          data, including a seeded identity — §11) → error (3.5a) → Reintentar
    → success → Tu negocio never appears (§2.2b — the seeded identity
      already satisfies it) → Define lo que vendes never appears (§2.2a —
      the seeded Catalog already satisfies it) → Todo listo, Variant C (3.6)
      → Entrar → Home idle state, populated (home.md §3.4)

Any interruption up to and including §3.6 still being on screen (phone lock,
backgrounding, force-close):
  → next app open resumes exactly where she left — the same in-progress step
    (§3.3–§3.5a), the same Tu negocio step with typed/selected values intact
    (§3.9/§3.9a, real paths only) if capabilities were written but identity
    wasn't finished, the same Define lo que vendes step with committed lines
    intact (§3.5b/§3.5c, real paths only) if identity was written but this
    step wasn't finished, or the same Todo listo variant if §3.6 itself was
    showing (§3.7, §2.1 cases 2–4) — never restarts from §3.3 once real
    progress has been made.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Bienvenida + Elegir cómo empezar (fresh first run)
4. Activar plan de pago — confirmar antes de continuar
5. Ver un ejemplo — confirmar antes de continuar
6. Creando tu negocio (near-instant / slow) — shared by all three paths
7. Creando tu negocio — error
8. Tu negocio — identity capture, entry (real paths only)
9. Tu negocio — con logo seleccionado
10. Guardando tu negocio (near-instant / slow)
11. Guardando tu negocio — error
12. Define lo que vendes — entry (real paths only)
13. Define lo que vendes — con líneas agregadas
14. Guardando lo que vendes (near-instant / slow)
15. Guardando lo que vendes — error
16. Todo listo — Variant A (Empezar gratis)
17. Todo listo — Variant B (Activar plan de pago)
18. Todo listo — Variant C (Ver un ejemplo)
19. Retomar onboarding interrumpido (resumes any of states 3–15, pixel-identical, in-progress data intact; if interrupted while a Todo listo variant (16–18) was showing, resumes that exact variant instead of re-running any write or restarting from state 3)
20. Falla defensiva — no se pudo determinar el estado inicial

## 6. Minimum step count

| Scenario | Taps to Home | Why it can't be fewer (or, for the demo path, why one more tap is deliberate) |
|---|---|---|
| Empezar gratis | **6** (path + typed Nombre + Continuar + typed Producto + typed Precio + Continuar) (+1 optional milestone tap) | Tapping the path is the only capability decision; Nombre (identity) and Producto/Precio (at least one Selling Group) are genuinely required information — a Business with no name, or set up to sell nothing, isn't set up (§2.2b/§2.2a) — with no honest guessable default for any of the three. Logo and Descripción add zero required taps (§2.2b). |
| Activar plan de pago | **7** (path + Confirmar y activar + typed Nombre + Continuar + typed Producto + typed Precio + Continuar) (+1 optional milestone tap) | Confirming an already-arranged payment is a real, necessary fact — not padding — even though nothing is typed; the extra tap protects a real commitment from a stray tap, the same reasoning `settings.md`'s identical two-tap floor already applies to the same action reused here. Nombre and Producto/Precio are required for the identical reason as the row above. |
| Ver un ejemplo | **2** (path + confirmar en 3.4c) (+1 optional milestone tap) | The confirmation tap (§3.4c) is the one deliberate exception to "don't waste a tap" anywhere in this document — added on purpose because this path's write is permanent and non-convertible (`decision-log.md` D19); the extra tap is what makes that fact land before commitment, not only after it. Everything else about the path remains zero real information to provide — the seed still supplies everything else, including its Catalog and its identity (§2.2a/§2.2b — neither step ever appears on this path). |
| Reopening the app after Onboarding already completed | **0** — never shown again | Direct consequence of `decision-log.md` D13, once §3.6 has also been dismissed (§2.1). |
| Resuming an interrupted Onboarding | **0 extra** — returns to the exact step, nothing re-asked | Same guarantee `home.md` §3.13 / `inventory.md` §3.7 already make for their own in-progress work; extends through Tu negocio, Define lo que vendes, and §3.6 (§3.7). |

Every scenario's floor is dominated entirely by the information that scenario genuinely requires — an explicit confirmation for the one path (Activar plan de pago) with a real commitment behind it, and, for both real paths, her business name (§2.2b) plus at least one named Selling Group with a price (§2.2a), since none of those three facts has an honest default. None of the three paths carries a single tap that exists only for ceremony, except two deliberate exceptions: the milestone screen (§3.6), which is itself skippable via auto-continue, and the demo path's one confirmation tap (§3.4c), which is deliberately *not* skippable — because the fact it discloses has to be seen, not skimmed past, before an irreversible write.

## 7. Automation opportunities

- Whether Onboarding shows at all — resolved silently on every app open (§2.1); never a manual "skip onboarding" she has to find or a setting she has to remember she already changed.
- `subscriptionTier` is a genuine, silently-resolved two-way choice at Onboarding, not a live picker — she expresses it entirely through which path she taps ("Empezar gratis" vs. "Activar plan de pago"), never through a separate "gratis / de paga" toggle (§2.2, `decision-log.md` D27).
- `defaultSellingMode` is written as `buttons` unconditionally for both real paths, never derived from path choice and never asked as a separate question — deferred entirely to `settings.md`'s self-service "Cambiar a vender con tags" control, once she actually has tagged inventory to back it up (§2.3, `decision-log.md` D27).
- `eventScheduling` — always on, never asked, per `domain-model.md`.
- Resuming an interrupted Onboarding at the exact step, including mid-display of the §3.6 milestone — automatic, no restart, no re-prompt (§3.7).
- NFC Readiness / Session-start resolution for a freshly onboarded `nfc`-default Business with zero tagged inventory — already fully automatic per `home.md` §2/§3.6a (`decision-log.md` D23); this document only needed to compose correctly with it, not redesign it (§2.3).
- Handoff into Home's own resolution logic — Onboarding never invents its own version of "what does she see next"; it reuses `home.md` §2/§3.3/§3.4 exactly as already specified (§2.4).
- **Deliberate exception, not an oversight:** the demo path's confirmation step (§3.4c) is added on purpose, going against this document's own automation bias. Every other reducible tap in this document is removed (§6); this one is added, because automating it away would hide, rather than surface, the one fact that has to reach her before an irreversible write.
- **Define lo que vendes (§2.2a/§3.5b–§3.5e) is deliberately not automated away either**, for the identical reason `inventory.md` §3.8a already established: Producto/Precio have no honest guessable default, so the entry itself can't be removed — what *is* automated is the matching rule (case-insensitive, trimmed, never re-asking about a Selling Group already committed) and the reuse of Inventory's own Product-creation write path rather than a second, parallel mechanism.
- **Tu negocio's identity capture (§2.2b/§3.9–§3.10a) is deliberately not automated away for `Business.name` either, for the identical reason** — no honest guessable default exists for a business's own name. What *is* automated, and deliberately not asked as separate questions: `Business.logo` and `Business.description` never gate progress and never require an explicit skip action — leaving them blank costs zero taps, the closest this document gets to actually automating an optional field away entirely.

## 8. Open questions

None of the items below block this document's completion or require inventing a new mechanism to route around — flagged for awareness, same discipline `home.md` §8 and `inventory.md` §8 already use for non-blocking items.

1. **Validation recommendation (not a Foundation ambiguity):** whether §3.4c's confirmation copy is clearly understood by a first-time merchant as a non-convertible practice profile, rather than a preview of paid features she could somehow "keep" for her real business. Putting the permanence/non-real-data fact before the write (§3.4c), not only after it (§3.6 Variant C), substantially reduces this risk relative to an earlier draft that disclosed it only afterward — but it's still worth a quick check with Ana or a simulated first-run test before this is fully locked in, the same evidence-driven caution `home.md` §8 already recommends for its own interaction-model changes from the validated prototype.
2. **Cross-document, not designed here:** whether a persistent "estás viendo un ejemplo" indicator should exist inside Home/Inventario/Eventos/Resultados beyond this document's own milestone screen, for a merchant who picked the demo path and is now browsing the four tabs with seeded data. This would be a `home.md` (and sibling) design question, not an Onboarding one — flagged for whoever next touches those documents, not escalated as newly open here.
3. **Confirmed out of scope, not reopened:** whether a demo Business can ever become a real one. `decision-log.md` D19 already states the answer — no conversion mechanic, contingent on demo profiles never needing behaviorally-distinguishable treatment; if that contingency is ever violated, it needs its own small decision-log entry at that time, not something this document should preemptively design. See §11.
4. **Resolved, kept for continuity — the most likely real-world capability-change scenario is now designed, just not in this document:** a merchant who chooses "Empezar gratis" today and wants `nfc` selling later gets there by upgrading to the Paid plan in Configuración (`settings.md` §2.2, "Activar plan de pago") — `nfc` follows automatically as a derived consequence of `subscriptionTier = paid` (`decision-log.md` D27), never through a separately obtained physical kit or activation code. `company/business-decisions.md` Q5 is Resolved (`decision-log.md` D25), and D27 further corrected the mechanism this item originally anticipated (kit possession): the physical tag package she eventually receives is fulfillment logistics only, mailed automatically once she subscribes, and grants nothing by itself. This document still does not design that upgrade path itself — it lives entirely in `settings.md` — but the gap this item once flagged as open is now closed elsewhere, not silently assumed away.
5. **Validation recommendation (not a Foundation ambiguity), added 2026-08-08 alongside §2.2a:** whether the flat, single-row "Producto + Precio" entry shape (§3.5b) reads clearly to a genuinely first-time merchant, versus `inventory.md`'s own two-step picker-then-price shape — the two are deliberately different for a reasoned cause (§3.5b's own annotation), but that reasoning hasn't been checked against a real merchant's first reaction. Same evidence-driven caution as item 1.
6. **Validation recommendation (not a Foundation ambiguity), added 2026-08-08 alongside §2.2b:** whether "Tu negocio" reads clearly as an invitation to bring in something she already has, rather than as a request to build a brand identity from scratch — the copy and design are reasoned explicitly toward the former (§2.2b), but haven't been checked against a real merchant's first reaction. Same evidence-driven caution as items 1 and 5.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — Bienvenida and the path choice are merged into one screen instead of two (§3.3, §10); "Activar kit NFC" was replaced, not removed, by "Activar plan de pago" (`decision-log.md` D27 — see §2.3), so Onboarding still offers three paths — "Empezar gratis" has a 1-tap floor; `subscriptionTier` is expressed entirely through which of the two real paths she taps, a genuine two-way choice now that Paid tier has an honest, history-independent benefit to offer (§2.2), never a separate technical question of its own; the milestone screen (§3.6) auto-continues rather than requiring a tap. **The one deliberate exception to this principle anywhere in this document is still the demo path's confirmation tap (§3.4c)** — added on purpose, not left over by accident, because the fact it discloses (an irreversible, non-convertible write) has to reach her before she commits; a tap that exists specifically to slow her down for a fact this consequential isn't the kind of waste this principle argues against.
- *"Never ask twice"* — `nfc` is never asked as an Onboarding choice at all, isolated or otherwise: it's a pure read-time derivation from `subscriptionTier = paid` (`decision-log.md` D27), not a value any path sets, so there is no separate question left to avoid asking twice about (§2.3); Onboarding is never shown again once complete, including the §3.6 milestone actually being seen (§2.1, D13); an interrupted flow resumes at the exact step, never re-asking anything already entered (§3.7).
- *"Technology should disappear"* — no nav bar exists before there's anything for it to navigate into (§3 preamble); loading states stay silent unless genuinely slow, identical convention to every other tab (§3.1/§3.2/§3.4a/§3.5).
- *"Selling is a state, not a navigation destination"* — Onboarding hands off into Home's own resolution logic rather than fabricating a fake pre-opened Session for any path, including the demo (§2.4); she always starts selling herself, the same way every merchant does.
- *"Business language before technical language"* — every screen uses "gratis" and "ejemplo," never "registrationMode," "subscriptionTier," "defaultSellingMode," "nfc," or "capability," anywhere, including in the demo path's confirmation state (§3.4c); with "Activar kit NFC" removed, no screen in this document ever mentions a kit, a tag, or an activation code at all (`decision-log.md` D27).
- *"Every repeated decision should become automation"* — every capability this document sets is set exactly once, at this single moment, and never re-asked anywhere downstream (§7).
- *"Capture business truth once, reuse it forever"* — her single first-run choice ("Empezar gratis," "Activar plan de pago," or "Ver un ejemplo") is captured exactly once and never re-asked on a retried creation failure (§3.5a); the demo path's confirmation (§3.4c) is likewise never re-asked on a retry. `nfc`'s own truth — whether it's available at all — is never captured here in the first place, deliberately: it's derived fresh from `subscriptionTier` wherever it's read (`decision-log.md` D27), so there is no second copy of that fact for this document, or any other, to keep in sync.
- *"The best interface stays out of the merchant's way"* — a failed Business-creation write never drops an already-chosen path or an already-confirmed demo screen (§3.5a); "Mejor quiero registrar mi negocio real" is a real, always-available escape hatch, never a dead end (§3.4c).
- *"Capture business truth once, reuse it forever"* — her business identity (`Business.name`, optional logo/description) is captured exactly once, here, at the one point in her relationship with the app where she has time to think about it rather than a customer standing in front of her, and is reused wherever each field is actually needed downstream (`Business.name`/`Business.logo` — `home.md` §3.8f's Digital Receipt; `Business.description` stored only, not yet consumed anywhere) without ever being asked again (§2.2b).

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream, never asked mid-flow)* — Onboarding is the highest possible point this principle can apply to: `registrationMode`, `defaultSellingMode`, and `subscriptionTier` are all set once, before any tab, Session, or Sale exists, and never re-asked anywhere in `home.md`, `inventory.md`, `events.md`, or `reports.md` (§2.2, §2.3).
- *#4 (internal-only entities never leak into user-facing language)* — no domain term (Business, Capability, Selling Mode Capability, Session Operating Mode) ever appears in merchant-facing copy, including error and confirmation states.
- *#6 (one-way dependency direction)* — Onboarding never fabricates a live, already-open Session for any path, including the demo (§2.4) — the demo's seed generation writes historical Inventory/Selling data through those contexts' own paths, a distinct concern from inventing active selling state on Ana's behalf.

**brand-guide.md:**
- *Tone — "warm, direct, respects the vendor's intelligence"* — §3.4c states plainly, before any commitment, that the demo write is permanent and can't become her real business later; treating her as someone who can handle that fact upfront, rather than only letting her discover it after an irreversible tap, is what "respects the vendor's intelligence" means in practice here, not just as a slogan.
- *Tone — "never framing bazaar vendors or informal commerce as lesser or in need of modernizing"* — "Tu negocio" is framed explicitly as bringing an existing identity in, never as building or "upgrading" one (§2.2b): no logo-generation tooling, no suggestion that a merchant without a digital logo is missing something she needs to acquire before she's properly set up. The no-logo path is designed with the identical visual weight and zero required taps as the with-logo path (§3.9), not a lesser fallback for merchants assumed to be behind.

## 10. Decisions made

- **Three paths, named "Empezar gratis," "Activar plan de pago," and "Ver un ejemplo"** — "Activar kit NFC" was replaced, not removed, by "Activar plan de pago" (`decision-log.md` D27: `nfc` is now a pure derivation from `subscriptionTier = paid`, and confirming payment is what sets that field — the same two-real-paths shape as before, just with a corrected mechanism for the second one). "Empezar gratis" reuses D19's own example wording verbatim; the demo path's name and copy are this document's own contribution. **Renamed from an earlier draft's "Ver un ejemplo primero":** "primero" linguistically implied a second step — look first, then still pick a real path afterward — that never existed anywhere in the flow (the write is immediate and irreversible, per D19). Dropping the word removes the false implication instead of inventing a followup step D19 already rules out.
- **"Ver un ejemplo" is gated behind an explicit confirmation screen (§3.4c) before its write happens, unlike either real path.** An earlier draft resolved this path directly from the welcome screen's tap, styled as the lightest-weight of the three options — which made the least-committal-looking option also the one with the single most permanent, irreversible consequence. §3.4c states the permanence/non-convertibility fact plainly before the write and offers a genuine, zero-cost way to choose differently ("Mejor quiero registrar mi negocio real") at the one moment doing so is still free — mirroring the pause-point-with-escape-hatch shape the NFC path (§3.4) already has.
- **Onboarding's "complete," for the specific purpose of §2.1's resume check, is deliberately narrower than "capabilities written."** It also requires the "Todo listo" milestone (§3.6) to have actually been dismissed. An interruption while §3.6 is on screen resumes at that exact screen next time, rather than silently skipping straight to Home and costing her the one screen this document argues is worth deliberate ceremony. This is a one-time narrowing scoped only to this resume check — it doesn't change when a Business's capabilities are considered valid/usable anywhere else in the product.
- **§3.5's write is explicitly atomic, for all three paths** — for the demo path specifically, Business creation and seed-data generation succeed or fail together; there is no state where capabilities are saved but seed data is only partially generated. A failure of any part routes to §3.5a and retries the whole write, never resumes into a half-seeded Business.
- **The prerequisite subtext this document once carried on "Activar kit NFC" ("si ya tienes tu kit en mano") is removed along with the path itself** (`decision-log.md` D27) — there is no longer a kit-possession prerequisite for any Onboarding path to state, since kit possession was never actually what granted `nfc` in the first place. The one no-charge reassurance that used to accompany it ("no se te cobra nada aquí") is likewise removed — with no in-app payment step anywhere in Onboarding, and no path that could be mistaken for one, there is nothing left for that reassurance to be about.
- **All tappable actions, including escape hatches and the demo path's entry point, use the `[ ]` bracket convention consistently** — an earlier draft left "Ver un ejemplo primero" and "No tengo el código a la mano" as unbracketed text despite being tappable, breaking the convention `home.md`/`inventory.md` establish.
- **Bienvenida and the path-choice screen are merged into one screen (§3.3)**, not two — an earlier structure held them apart behind a "Comenzar" tap purely to hold a welcome line; merging removes that tap without losing any warmth, since the same copy reads identically sitting directly above the three options.
- **`defaultSellingMode` resolves automatically to `buttons` for both real paths, with no separate confirmation question ever asked** (§2.3) — a reversal of the earlier draft's "Activar kit NFC" bullet, which used to derive it from path choice. A real Onboarding path can never set `defaultSellingMode = nfc`: `nfc` only exists once `subscriptionTier = paid` (`decision-log.md` D27), and even "Activar plan de pago" writes `buttons` unconditionally, since a merchant confirming payment has zero tagged inventory yet either way (§2.3). The demo path is the sole exception, seeded directly at `nfc` alongside its seeded `paid` tier (§2.2) — never chosen through a question either.
- **`subscriptionTier` is a genuine two-way choice at Onboarding, expressed entirely through which real path she taps** (§2.2) — not a live "gratis / de paga" picker, but not a single forced value either: "Empezar gratis" writes `free`, "Activar plan de pago" writes `paid`. This corrects an earlier draft's reasoning, which held that no honest paid option could ever be offered at first run — true of Segmentation specifically (real data still requires real Claims to accumulate, regardless of path), but not of `nfc`, which `decision-log.md` D27 makes an immediate, history-independent Paid-tier benefit. **Frequent Customers itself is no longer a separate value this table tracks at all** (`decision-log.md` D40) — "Activar plan de pago" makes it available the instant `subscriptionTier=paid` is written, automatically, the same way it makes `nfc` available.
- **No activation-code entry/validation machinery exists anywhere in this document any longer.** The earlier draft's §3.4 (ingresar código), §3.4a (validando), and §3.4b (código inválido) screens existed solely to confirm possession of a physical kit as the mechanism that granted `nfc` — per `decision-log.md` D27, that mechanism never existed at the domain level to begin with: `nfc` is derived purely from `subscriptionTier = paid`, never confirmed by a code, a kit, or any other artifact. Removing this machinery isn't a simplification of an existing flow; it's the removal of a flow this document should never have specified once the underlying capability model is understood correctly. The welcome tag package she may eventually receive is fulfillment logistics only (D27) and has no Onboarding-facing screen of any kind.
- **The demo path is seeded at the richest capability combination** (`nfc`, `paid`) — deliberately different from either real path, so the seeded sales history can stand in for the real history a genuine merchant hasn't built yet, letting her see the full experience honestly rather than a partial one. `loyaltyEnabled` no longer exists as a separate value to seed (`decision-log.md` D40) — Frequent Customers is simply present the instant `paid` is, and the seed's own Claim history (§11) is what makes "Tus clientes" render populated rather than empty.
- **No path ever hands off into a pre-opened Session** — including the demo. Every path ends at Home's own idle or cold-start state; she always taps "Iniciar Sesión Rápida" (or "Continuar Día N") herself, exactly like a real merchant would, preserving *architecture-principles.md* #6.
- **No persistent bottom nav bar during any Onboarding screen** — a deliberate deviation from every other document in this family, since a Business's capabilities don't exist yet for the four tabs to resolve into; showing them would be a false affordance.
- **The "Todo listo" milestone screen (§3.6) is the one deliberate moment of ceremony in an otherwise frictionless flow** — justified specifically because it happens exactly once, ever, in Ana's whole relationship with the app; auto-continuing (rather than requiring a tap) keeps it from becoming genuine friction for a merchant who just wants to get moving.
- **A shared "Creando tu negocio" write state (§3.5) covers all three paths**, including the demo's data-seeding — deliberately not given its own more elaborate "building your example" sequence, since a longer wait than necessary would be padding, not honesty.
- **No demo-to-real conversion mechanic is designed** — a direct, explicit application of `decision-log.md` D19's own stated contingency, not a gap this document overlooked (§11).
- **Todo listo's CTA renamed from "Empezar" to "Entrar," uniformly across all three variants (§3.6) — Horizontal Journey Review remediation.** "Empezar gratis" (§3.3) and the milestone's own CTA shared the same verb two screens apart, reading as "start... start" rather than two distinct actions — caught by the Product Owner's own walkthrough of the free-tier path. §3.3's three path CTAs are unchanged: they're genuinely about *choosing* which path to begin. The milestone CTA is a different moment — her Business and capabilities already exist (§3.5's write already succeeded) by the time she reaches Todo listo; what's left is entering the app, not starting anything a second time. Checked against all three variants for collision; none found.
- **"Define lo que vendes" (§2.2a, §3.5b–§3.5e) added 2026-08-08, Product Owner decision, `decision-log.md` D33.** Moves the merchant's initial Selling Groups (name + `defaultPrice`) from being captured only inline during Inventario's Registrar Mercancía flow to being their own required step inside Onboarding, on both real paths — matching the Product Owner's read of Ana's actual mental model ("this is my business, this is what I sell, these are my prices," established before she ever thinks about the operational act of receiving inventory). `architect` confirmed this needs no Foundation change: no new aggregate, no new bounded-context edge (Onboarding invoking Inventory's own Product-creation write path is the identical shape D29 already established for cross-context UX orchestration, and one this document's own §2.4 already exercises for the demo path's seed data), no ubiquitous-language redefinition.
- **Required, not skippable — at least one Selling Group before "Todo listo," for both real paths, never for the demo path.** Reasoned explicitly in §2.2a, not assumed: a Business set up to sell nothing isn't a working Business; Producto/Precio are the least technical, most business-native facts this document could ask, the identical vocabulary `inventory.md` already uses; making it skippable would reopen the three-way handoff ambiguity §2.4 now closes into a clean two-way state.
- **Deliberately simpler than `inventory.md`'s own two-step "Elegir producto → nuevo producto, precio inicial" shape** — one flat Producto+Precio row, since a first-run Catalog is guaranteed empty (§2.2a), so the existing-vs-new ambiguity Inventario's picker exists to resolve can never arise here. Not an inconsistency between the two documents; each shape is correct for what its own Catalog state can actually contain.
- **§2.1's resume-check guarantee (already narrower than raw "capabilities written," per the existing "Todo listo dismissed" bullet above) is extended one step further, through the new Define lo que vendes step** — an interruption mid-step resumes with every already-committed Selling Group and the still-active row's typed values intact, never re-asked, the same discipline `inventory.md` §3.7 already applies to its own in-progress Registrar Mercancía draft (§3.7).
- **§1's "establish a Business and its initial capabilities... Nothing else" and §2.4's "Catalog is genuinely empty" handoff description were both corrected to stay accurate** once this step existed — the former to name the one precisely-scoped exception this document now carries (Product/`defaultPrice`, not identity/profile fields, which stay correctly excluded for the reason already stated); the latter to describe the real post-Onboarding state (named Products, zero stock) rather than a literally empty Catalog.
- **`home.md`'s §2 step 3 cold-start test was corrected in the same pass** (that document's own 2026-08-08 amendment, not repeated here) — from "at least one Product ever registered" to "at least one `available` InventoryUnit exists," since this step breaks the equivalence between those two facts that held only as long as Product creation was exclusively inline-during-receiving. `inventory.md`'s own equivalent test was checked and found *not* to share the bug — see that document's own §2/§10 for the reasoning.
- **"Tu negocio" identity capture (§2.2b, §3.9–§3.10a) added 2026-08-08, Product Owner decision.** Positioned after §3.5's Business/capabilities write succeeds and before §2.2a's "Define lo que vendes" step, on both real paths, never on the demo path — matching the Product Owner's explicit sequencing: identity first, then what she sells. `architect` confirmed this needs no Foundation change: `Business.name`/`Business.logo`/`Business.description` are additive fields on the already-existing `Business` aggregate, no new aggregate, no new bounded-context edge, no ubiquitous-language redefinition.
- **`Business.name` required, `Business.logo`/`Business.description` fully optional with zero required taps to skip — reasoned individually in §2.2b, not defaulted to a uniform treatment.** Name has no honest default, the same class of required field Producto/Precio already are (§2.2a). Logo and description are captured because the Product Owner named them, but neither gates progress nor requires an explicit skip tap — leaving them blank is simply not filling them in, the same shape every other genuinely optional value in this product already takes.
- **The no-logo path is designed as fully first-class, not a lesser option — deliberate, not incidental.** Most merchants likely don't have a digital logo ready; §3.9's screen carries no visual or copy cue marking that state as provisional, incomplete, or something to come back to. No "Ahora no" escape-hatch-style control exists for the logo specifically, because it was never gating anything an escape hatch would need to release her from.
- **Explicitly "bring an existing identity in," not "create one" — no logo generation, no design/branding tooling, no color picker, no cropping/editing.** A bare device-upload-or-skip affordance only (§3.9), per the Product Owner's own framing, carried through directly into scope rather than softened into a lighter-weight editing surface.
- **Identity capture gets its own write (§3.10/§3.10a), not folded into §3.5's atomic Business/capabilities write — reasoned explicitly against defaulting to "new screen, new write" (§2.2b).** The Product Owner's own sequencing (identity is reached only after §3.5's write has already succeeded) rules out folding by itself; `decision-log.md` D30's per-write idempotency-key requirement, and this exact document's own precedent for §2.2a's identically-shaped second write, both independently point the same direction.
- **No `knowledge-mentor` consultation was requested for the device-upload affordance itself — reasoned explicitly in §2.2b as a composition of two already-precedented primitives (tap-to-trigger, committed-item-with-remove), not a genuinely novel interaction pattern.** Flagged for `ux-critic`/`reviewer` to challenge if that reasoning doesn't hold, since this document's own tooling has no way to request that consultation directly.
- **§1's exclusion rationale for profile-style fields corrected, not merely restated, alongside this amendment.** The prior wording ("none of those fields is ever read by any downstream resolution logic") became false the instant `home.md` §3.8f became a real consumer of `Business.name`/`Business.logo` — corrected to state precisely what still separates the fields this document continues to exclude from the two it now carries: not "nothing reads them," but "no downstream logic reads *them specifically*."
- **§2.1's resume-check state machine gains a new case (case 4), parallel to the existing "Define lo que vendes not yet complete" case (now case 3), and every other case's "complete"/"already written" language is widened to include identity.** Same discipline already applied when §2.2a's own step was added — an interruption mid-capture gets its own defined, exact resume point, never a restart.
- **`home.md` §3.8f's receipt now shows the merchant's own identity instead of Nahui's own mark — designed jointly with this amendment, decided and reasoned in that document's own §10, not repeated here.** Named explicitly in both documents as a real product/brand decision, not an incidental consequence of a new form field existing.

## 11. Future considerations

- Whether a persistent, in-app indicator that a merchant is browsing a demo/seeded Business should exist beyond this document's own milestone screen — a `home.md`-and-siblings design question, not designed here (§8, item 2).
- A demo-to-real conversion path, if real usage ever shows merchants trying the demo and then wanting to keep using the app with their seeded example intact rather than starting fresh — per `decision-log.md` D19, this would need its own small decision-log entry (e.g., a distinguishing flag) only if that behavioral need actually surfaces; not designed preemptively.
- Additional Onboarding paths (e.g., a referral or organizer-distributed path) if the business model direction in `company/CLAUDE.md` evolves — not designed now, no evidence yet that a fourth path is needed.
- Whether the seeded demo content's exact shape (which example Products, how many past Events/Sessions/Sales) should be specified more precisely than "illustrative" — left to Builder's discretion, but not entirely unconstrained: §2.2's own reason for choosing the richest capability combination (`nfc`, `paid`) only holds if the seed actually clears the bar those capabilities' own gating logic requires. Two concrete minimums the seed must meet for the demo to deliver on its stated purpose, not just claim the capability: enough `available` InventoryUnits with assigned NFCTags to resolve NFC Readiness as Ready (`home.md` §2/§3.6a) — otherwise her first demo Session silently opens in `buttons` despite the `nfc` capability, undermining the reason `nfc` was chosen at all — and at least one recorded Claim, so `reports.md`'s "Tus clientes" (§3.12) actually renders populated rather than falling back to its own empty-state teaser (§3.13). Neither doc treats either fallback as broken — both handle it gracefully — but a seed that misses either minimum would make the demo path's whole justification for its capability choice silently moot on first use. **A third minimum, added 2026-08-08 alongside this document's own identity-capture amendment:** the seed must set a `Business.name` (required on every Business, §2.2b, no exception for a demo profile — this isn't discretionary the way the two minimums above are) and, illustratively, a `Business.logo`, so `home.md` §3.8f's receipt renders her captured identity on a demo Sale exactly as it would for a real merchant, rather than silently exercising only the two real paths' own capture step. Unlike the two minimums above, this one isn't a "the demo's stated purpose goes moot without it" risk — `home.md` §3.8f's own honest name-as-text fallback (that document's own 2026-08-08 amendment) means a demo Business without a seeded logo still renders correctly — it's a completeness recommendation for the demo's own illustrative purpose, not a hard requirement.
- **A self-service edit surface for `Business.name`/`Business.logo`/`Business.description` in `settings.md`, mirroring the edit affordance `inventory.md` §3.4a already gives Catalog prices** — explicitly not designed here; this document's scope stops at initial capture, the same boundary already drawn around every other Onboarding-set value (§0's "Settings / capability change after first run" exclusion).
