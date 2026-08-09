# 0004 — Customer as a Business-scoped aggregate root; Loyalty Participation Record, a new allowlisted identification edge alongside Derived Customer Intelligence

Status: **Accepted — promoted to `decision-log.md` D35.** Open Item 1 (Selling excluded from the new edge) confirmed as drafted by the Product Owner directly. Open Item 2 (gating) resolved by a related, separate correction — `decision-log.md` D34 — which narrows `loyaltyEnabled`'s scope and gates this edge's visibility on `subscriptionTier=paid` alone, not a joint toggle. See D34/D35 for the final text; this document is retained as the historical record of the proposal, per this project's RFC convention.

## The idea

Formalizes the Product Owner's explicit, narrower resolution of the "Frequent Customers MVP" identity question (verbatim):

> "Merchant-visible customer identity is limited to loyalty participation. The merchant may see: email or masked email, age range, gender, purchase count, lifetime spend, reward-cycle progress. The merchant may not see: phone, address, payment credentials, unrelated personal data, cross-business customer identity, or customer activity outside that merchant's own Business."

This is the previously-open Option 1 from the Frequent Customers MVP evaluation, precisely scoped rather than unbounded. Four things follow from it, developed in full below:

1. **`Customer` is schematized for the first time**, as a real aggregate root — not merely a conceptual placeholder (`ubiquitous-language.md`'s current one-line definition).
2. **A new bounded-context read edge**: Intelligence gains a second, narrower grant into Loyalty-claim — an explicit allowlisted field projection — alongside its existing Derived Customer Intelligence grant (D22), which is untouched.
3. **A new ubiquitous-language term, "Loyalty Participation Record,"** distinct from Derived Customer Intelligence, naming this identified-but-narrow view.
4. **Structural (not conventional) enforcement** of the denylist — phone, address, payment credentials, unrelated personal data, and cross-Business identity are never reachable through this edge, by construction.

**Confirmed against a later, more precise Product Owner clarification, given after `architect`'s own reasoning below was already complete — the two independently converge, not by coincidence, but because the same "every aggregate is Business-scoped" precedent drives both:** the customer is *not* an authenticated platform user in this MVP — no login, no permissions, no roles, no global Nahui customer account. The identity key is scoped to the merchant: **Business + customer identifier** (email, for the MVP). The same email may therefore hold independent, unlinked relationships with multiple Businesses. The customer-facing QR/Claim flow is identification, not authorization — Ana's own merchant access is a separate authentication concern, out of this RFC's scope entirely. This is exactly Option (B) below, arrived at independently.

## What it touches

- `domain-model.md`:
  - **Aggregate roots** — new `Customer` entry (schema below), owned by Loyalty-claim.
  - **Bounded contexts table** — Loyalty-claim's "Owns" gains `Customer` (schematized) alongside `Claim` (unchanged). Intelligence's "Depends on" cell gains a second, distinct grant into Loyalty-claim (Loyalty Participation Record), stated separately from the existing Derived Customer Intelligence grant, which keeps its exact current wording.
  - **Not touched**: the Entity relationships ASCII diagram. It currently covers only built contexts (Inventory/Selling); Loyalty-claim entities were never added to it, and this RFC doesn't change that — Loyalty-claim remains "future, not built."
- `ubiquitous-language.md`, "Future: Loyalty-claim context" section:
  - **Customer** — definition expanded from a one-line placeholder into the real schema.
  - **Loyalty Participation Record** — new term, defined below, placed immediately after Derived Customer Intelligence.
  - **Derived Customer Intelligence** — explicitly **unchanged**, not one word edited. See "Why," §3.
- **Not touched by this RFC**: `information-architecture.md` (Resultados already exists as a tab; this adds content within it, not a new nav destination — see "Why," §5), `architecture-principles.md` (no new technical principle; existing #4/#6 are the lens used, not extended), `reports.md` or any other `product/02-ux/` doc (the actual screen this data would populate is a future `ux-designer` task, gated behind the sequencing note below, and explicitly out of this RFC's scope), and Claim Token mechanics (D22, untouched — see "Why," §5). **Also not touched**: any authentication/login/account concept for either Ana or the customer — the customer's QR-scan flow is identification only, never authorization, and Ana's own merchant authentication is a separate, unopened concern this RFC deliberately doesn't reach into.

## Why

### 1. Customer's schema, and the global-vs-per-Business question

**Resolution: `Customer` is a Business-scoped aggregate root, not a global one.**

```
Customer (Loyalty-claim, aggregate root)
  - id
  - businessId          (required, not nullable)
  - email                (required — captured at first Claim for this Business)
  - ageRange              (optional)
  - gender                (optional)
  - purchaseCount          (lifetime, this Business only)
  - lifetimeSpend           (lifetime, this Business only)
  - currentCycleProgress     (count toward this Business's reward cycle)
  - completedCyclesCount      (count)
```

`maskedEmail` is **not** a stored field — it's a read-time derivation of `email` (e.g. `an***@gmail.com`), following the exact precedent D27 already established for exactly this shape of value: *"Derivation, not storage, is the pattern already established elsewhere in this Foundation... there is no independent history/audit requirement here that would justify paying [the dual-write consistency] cost."* Whether the merchant-facing UI ever renders the raw or masked form is a UX decision for `ux-designer` when the screen is designed — not decided here; the domain model just needs to make both representable without adding a second stored field.

**Why per-Business, not global — the deciding argument, made explicit rather than assumed:**

Two shapes were considered:
- **(A) Customer as a global root** (one record per real person, spanning Businesses), with a separate per-Business internal entity (`CustomerBusinessParticipation`, owned by Customer, no identity/lookup outside its parent — the same internal-entity pattern already established for `InventoryEntry`/Lot and Price Override/Event) holding the per-Business counters.
- **(B) Customer itself carries `businessId`** — the same physical person shopping at two different Nahui-powered Businesses produces two independent Customer records, with no structural link between them.

(B) is the correct shape, for three reasons grounded entirely in Nahui's own already-established precedent (not external grounding — see the note on `knowledge-mentor` below):

- **Every other aggregate root in this model is already Business-scoped.** `domain-model.md`'s own opening line: *"Business — tenant/config anchor... everything else hangs `businessId` off of."* Product, Lot, Event, Session, Sale, Venue (D20) are all reached only via their owning Business. A global Customer root would be the one exception to a pattern this Foundation applies everywhere else, for no stated product reason.
- **(A)'s internal-entity indirection has no work to do here.** The internal-entity pattern (`InventoryEntry` under Lot, Price Override under Event) exists specifically for genuine 1:N relationships — many entries per Lot, many overrides per Event. Once Customer itself is Business-scoped, "this Customer's participation in this Business" is a 1:1 relationship by construction (a Customer *is* already scoped to exactly one Business) — nesting a second entity to represent a 1:1 relationship adds indirection with nothing to model, the same over-engineering discipline this Foundation already rejects elsewhere (D26: *"the one sanctioned dormant-field exception... not a general license"*).
- **It makes the Product Owner's denylist structural, not access-controlled.** With (B), "no cross-Business customer identity" isn't a rule some query has to correctly enforce — there is no data structure anywhere that connects two Businesses' view of the same person. With (A), the guarantee would depend on every future reader correctly scoping its query to one Business's participation sub-entity and never touching the parent. (B) reuses the exact tenant-isolation discipline this system already needs for every other read (a query is always parameterized by the caller's own `businessId`) instead of inventing a bespoke one just for this feature.

**The registration flow reads better under (B), too.** The original "first visit: required email, optional age range/gender" description now reads literally as "first visit *to this Business's* loyalty program" — not a platform-wide first-ever-visit, which (A) would have implied.

**The named cost, stated rather than hidden.** If the same physical person shops at two different Nahui-powered Businesses, the system holds two independent Customer records for her — duplicate email/age/gender, no shared identity even for Loyalty-claim's own internal purposes. There is currently no product requirement for a cross-Business identity: `company/CLAUDE.md`'s non-goals explicitly name "anything requiring multiple users (bazaar recommendation engine) — no data to support it yet," and `backlog.md` #3 is the only place cross-tenant data is even discussed, explicitly not started. If a future cross-Business identity-resolution feature is ever pursued, it needs its own new mechanism (e.g., a separate, later-designed identity-linking concept with its own privacy/consent shape) — deliberately not modeled now, named here so it isn't silently precluded or silently assumed.

**Reward threshold — deliberately excluded from Customer's schema.** Of the five fields the task named as candidates (`current-cycle progress count`, `lifetime purchase count`, `lifetime spend`, `completed-cycles count`, `reward threshold`), the first four are genuinely Customer-specific state. The fifth is not: a reward threshold ("10 purchases = 1 free item") is a property of *the Business's loyalty program*, shared across all of that Business's customers — putting it on Customer would duplicate one shared value N times. It belongs on Business (Identity context), alongside `loyaltyEnabled` — but Business's current `loyaltyEnabled` is a bare boolean with no reward-cycle-shape configuration structure yet. This is a **named gap**, not resolved here, per the same discipline D33 used for its own open items: *"left as an explicit unresolved question... not resolved by inventing false precision."* `currentCycleProgress`/`completedCyclesCount` are real, storable, Customer-specific counts regardless; rendering them meaningfully against a threshold (e.g., "6 of 10") depends on that not-yet-modeled Business-level config. Cycle-rollover mechanics (what happens to `currentCycleProgress` when a cycle completes) are similarly internal to Loyalty-claim and not detailed here, for the same reason.

**Storage shape for the counters — a second precedent distinction, not a blind default.** `purchaseCount`/`lifetimeSpend`/`currentCycleProgress`/`completedCyclesCount` are modeled as **stored, incrementally-updated scalars, written at the moment each Claim resolves** — not recomputed live by summing over Claim history on every read. This is deliberately *not* D27's derive-don't-store pattern (that pattern fits a cheap, non-historical, single-flag lookup like `nfc ∈ registrationMode`); it's D33's pattern instead — the same reasoning that put `SaleItem.pricePaid` on the write path rather than recomputing it live from `Product.defaultPrice`/Price Override at read time, both for consistency and to avoid recomputing a growing history on every read. Writing these fields is Loyalty-claim mutating its own owned aggregate (Customer) in response to its own domain event (a Claim resolving) — no new dependency edge, the same self-mutation shape D29 already established for Identity writing its own Business fields.

**On whether this needed a `knowledge-mentor` consultation.** My own remit calls for one when a proposal "introduces a new aggregate boundary... where established software-architecture or design principles, not just internal Foundation consistency, can inform whether the proposal is well-founded." I considered this explicitly. The deciding argument above is fully grounded in Nahui's own precedent (Business-as-tenant-anchor, D2, D20's Venue-as-independent-root precedent, the InventoryEntry/Price-Override internal-entity pattern) rather than requiring external multi-tenant-SaaS grounding — so I did not request one. Flagging this reasoning explicitly, per that same remit, rather than silently skipping the check.

### 2. The new bounded-context dependency edge

**Grant**: Intelligence gains a second, narrower read-only grant into Loyalty-claim, alongside its existing Derived Customer Intelligence grant (D22) — the two are additive, not a replacement of either.

- **What it reads**: a fixed, explicit field projection — `email` (or the `maskedEmail` derivation), `ageRange`, `gender`, `purchaseCount`, `lifetimeSpend`, `currentCycleProgress`, `completedCyclesCount` — for Customer records whose `businessId` matches the reading Business's own id.
- **What it structurally cannot read**: anything not named above. See §4.
- **Gating** (assumption, not a new Foundation decision — flagged for confirmation when the actual screen is designed): reuses the existing `subscriptionTier=paid` **and** `loyaltyEnabled=true` gate `reports.md`/D22 already established for "Tus clientes." Nothing in the Product Owner's decision text suggests a separate tier or toggle for this narrower view.
- **Selling is explicitly not granted this edge.** `domain-model.md`'s bounded-context table states, as a load-bearing guarantee: *"Selling itself never gains a dependency on Loyalty-claim or Intelligence... This is what lets backlog #2 (segmentation) and the loyalty module get built later without touching the selling-speed-critical path."* The task's framing ("Merchant Application (Selling/Reports)") could be read as wanting a live, Sale-time customer lookup (e.g., Ana seeing a customer's status mid-Sale) — that would require exactly the edge this guarantee forbids. **Not resolved by this RFC.** If that live lookup is genuinely intended, it needs its own explicit decision that reckons with reversing a named guarantee — not an implicit extension of this one. As drafted, the new edge serves Resultados/Intelligence only.

**`domain-model.md` table update (Intelligence row, "Depends on" cell):**

> Inventory, Selling (read-only), Loyalty-claim (read-only — two distinct grants: (1) Derived Customer Intelligence, anonymized/aggregate, no per-Claim drill-down, unchanged, D22; (2) Loyalty Participation Record, an explicit allowlisted per-Customer field projection — email/masked email, age range, gender, purchase count, lifetime spend, reward-cycle progress — scoped to Customers belonging to the reading Business, never phone/address/payment/other Customer fields, never another Business's Customer record, never raw Claim data; see this RFC / D34)

### 3. The ubiquitous-language consequence — a new term, Derived Customer Intelligence stays exactly as-is

**A new term is correct; redefining Derived Customer Intelligence is not.** Derived Customer Intelligence's existing definition is emphatic and absolute: *"Contains no name, no contact information, and no per-Claim drill-down — ever."* That "ever" is load-bearing — it's cited verbatim across `reports.md` §3.12 ("no name, no per-customer drill-down... ever"), D22, and RFC 0002. Redefining it to sometimes mean an identified view would silently contradict a term this project has repeatedly, deliberately reinforced as absolute — exactly the kind of drift this role exists to prevent. A new, separate term costs nothing and disturbs nothing already Approved.

**New term:**

> **Loyalty Participation Record** — the one allowlisted, *identified* (non-anonymized) view of a Customer the Merchant Application may read, alongside Derived Customer Intelligence — never a replacement for it, and not itself a stored entity: a fixed field projection of an existing Customer record, exposed read-only from Loyalty-claim to Intelligence. Consists of exactly: email or a derived masked-email display, age range, gender, purchase count, lifetime spend, and reward-cycle progress (current-cycle progress count, completed-cycles count), for a Customer belonging to the reading Business. Never phone, address, payment credentials, other unrelated personal data, or any Customer record belonging to another Business. See decision-log D34.

Placed immediately after Derived Customer Intelligence in `ubiquitous-language.md`'s "Future: Loyalty-claim context" section, so the two sit side by side without merging.

### 4. Denylist enforcement, structurally

- **Phone, address, payment credentials, other unrelated personal data**: not modeled on Customer's schema at all — structurally absent, not merely filtered out. The edge's contract is an **explicit allowlist projection**, not "Customer minus a denylist" — this is the deliberate direction: default-deny, explicitly-allow. Confirms the specific hypothetical this RFC was checked against: if a future payments feature is ever built (currently an explicit non-goal, `company/CLAUDE.md`), payment credentials would need their own separate bounded context/aggregate (the same placement discipline Venue/Supplier already get — never bolted onto Customer), and even if they were mistakenly added to Customer's schema, this edge's fixed projection would not automatically expose them — someone would have to deliberately widen the read contract, itself a new, reviewable Foundation change.
- **Cross-Business customer identity**: structurally impossible, not merely hidden, as a direct consequence of §1 — Customer carries `businessId` and is scoped to exactly one Business; there is no Customer record and no Claim that spans two Businesses (a Claim links Customer↔SaleItem, and SaleItem is already fixed to one Business via its Session/Sale chain, so a Claim can only ever connect entities already anchored to the same Business). This reuses the tenant-isolation discipline every other read in this system already depends on (queries parameterized by the caller's own `businessId`) rather than inventing a bespoke guarantee for this feature alone — stated honestly: the *domain model* makes the data non-spanning; correct query-level `businessId` scoping at implementation time is the same standing discipline every other aggregate in this system already requires, not a new risk specific to this edge.
- **Customer activity outside that merchant's own Business**: same mechanism — there is nothing to read, since a Business-scoped Customer has no fields describing activity elsewhere.
- **Raw Claim data / per-Claim drill-down**: unaffected, still governed entirely by D22. This edge's contract never includes Claim itself or the Sale/SaleItem linkage a Claim represents — it reads Customer fields only.
- **Customer authentication/login/authorization of any kind**: out of scope by construction, not merely undesigned. The QR/Claim flow (D22) is an *identification* mechanism only — it resolves which Customer record a scan belongs to, never grants that person any access, session, or credential. Nothing in this RFC introduces a customer-facing login, password, or account concept. Ana's own merchant-side authentication is likewise untouched — a separate, already-out-of-scope concern this RFC doesn't reach into.

### 5. What stays unaffected

- **`reports.md` §3.12/§3.13 ("Tus clientes")** — continues exactly as already Approved, consuming only Derived Customer Intelligence, unchanged wording, unchanged gating. This RFC adds a new, separate, narrower capability alongside it; it does not touch, redesign, or replace this screen. Designing whatever new screen(s) actually surface Loyalty Participation Record is future `ux-designer` work, out of this RFC's scope.
- **Claim Token mechanism (D22)** — completely unaffected. Claim Token generation at Sale finalization, its opaque/signed requirement, and multi-mechanism Claim resolution (NFC scan, Sale-level Claim Token, future mechanisms) are untouched. This RFC only formalizes the schema of what Loyalty-claim already privately holds (Customer, linked via Claim) and adds one new, narrow, read-only exposure of an allowlisted slice of it.
- **`information-architecture.md`** — unaffected. Resultados already exists as a nav destination; this adds content within it, not a new tab or navigation structure. The IA's existing "loyalty-claim has zero merchant-app presence for identification" boundary (D10/D21) is also unaffected — this RFC doesn't change who performs identification (still exclusively the Loyalty platform, on the customer's own device); it only defines what a narrow, already-resolved slice of the *result* of that identification the merchant app may subsequently read.

## Sequencing and dependencies (restated, not silently dropped)

This RFC describes target schema and edge design only — same posture RFC 0002 already took for the complete Customer Segmentation capability. It does **not** unblock implementation. The mechanism this specific "Frequent Customers" feature depends on — the Sale-level Claim Token / Digital Receipt QR (`backlog.md` #2, Stage 2) — remains blocked exactly where it already was: *"Neither stage starts before backlog #1 clears its stated success bar"* (`backlog.md` #1: ≥90% of sales registered, <3 sec per registration — currently **IN PROGRESS, unmet**). This RFC changes nothing about that gate. Once Accepted, it makes the target schema/edge design available for `ux-designer`/`builder` to work against whenever Stage 2 is actually cleared to start — it does not itself start any implementation.

## Open items, named for the Product Owner, not resolved here

1. **Selling was deliberately excluded from the new edge** (kept to Intelligence only), to avoid reversing `domain-model.md`'s named "Selling never gains a dependency on Loyalty-claim/Intelligence" guarantee. If a live, Sale-time customer lookup is actually wanted, that's a separate decision this RFC doesn't make.
2. **Gating assumed, not decided**: this RFC assumes the new edge is gated by the same `subscriptionTier=paid` + `loyaltyEnabled=true` condition as existing "Tus clientes" — confirm or correct when the actual screen is designed.
3. **Reward threshold configuration** (a Business-level loyalty-program setting) is named as a real, currently-unmodeled gap — not resolved here.
