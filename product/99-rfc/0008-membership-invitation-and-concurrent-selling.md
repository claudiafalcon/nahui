# 0008 — Membership invitation and concurrent selling: `Invitation` as a new aggregate root, the accept-creation invariant, and the authorization/attribution consequences of D55

Status: Proposed

## The idea

Extends RFC 0007 (Accepted, `decision-log.md` D44) one level further. RFC 0007 deliberately built `User`/`BusinessMembership` "1:N-ready" but left the invitation/acceptance mechanism itself unmodeled — no `Invitation` concept, no reachable `SELLER` Membership, both named explicitly as out of scope (RFC 0007 §5). `product/02-ux/product-decisions.md` Q24/Q25 (2026-09-06/07) designed the full mechanism end to end — driven by real, unsolicited merchant feedback (`company/backlog.md`'s "Event-scoped inventory allocation" discovery entry, 2026-09-03) asking for concurrent, multi-seller selling — and the resulting UX (`authentication.md` §2.2/§2.2a/§3.10–§3.13a, `settings.md` §2.7/§3.11–§3.14, `home.md`'s SELLER-role amendments) is already fully specified, `ux-critic`/`reviewer`-clean, and Approved. This RFC formalizes the domain-model consequences that design already settled, promoting exactly what's genuinely RFC-worthy and correcting one place where the settled-design summary reaches further than the actual RFC-trigger test supports.

Four things follow, developed in full below:

1. **`Invitation` is schematized as a new aggregate root**, Identity context — the mechanism that lets an `OWNER` offer a specific phone number a `SELLER` `BusinessMembership`, consumed atomically on acceptance.
2. **A second structural invariant, one level over D44's Owner-creation invariant**: no `SELLER` `BusinessMembership` exists without a consumed `Invitation` committing in the same atomic write.
3. **D55's write-time authorization consequence** (`BusinessMembership.status=active` required wherever a Membership acts) is resolved as an extension of RFC 0007 §3's already-established authorization-gateway concern — not a new bounded-context dependency, and not left unresolved.
4. **A correction to `product-decisions.md` Q24/Q25's own framing**: `Sale.performedByMembershipId` is reasoned through against the exact test RFC 0007 §3 set up for it, and found to be a plain additive field — same class as D33/D36/D54/D55 — not RFC-triggering content of this document. Recommended for its own standalone `decision-log.md` entry instead.

Concurrent selling itself (multiple simultaneously-open Sessions under one Event) requires no new domain-model change at all — see §7 below; it is confirmed, not designed here.

## What it touches

- `domain-model.md`:
  - **Aggregate roots** — one new entry, `Invitation` (schema below), inserted immediately after `BusinessMembership`. Owned by the Identity context.
  - **Entity relationships diagram** — gains the `Invitation` addition below.
  - **Bounded contexts table** — Identity's "Owns" cell gains `Invitation`, alongside the existing `Business, Capabilities, User, BusinessMembership`. No "Depends on" cell changes, for Identity or any other context — no new dependency edge is created (§1, §3 below).
  - **Key mechanisms** — gains a new subsection, "Invitation-acceptance invariant" (below), extending D44's Owner-creation-invariant pattern one level over. Also gains a new subsection, "Membership authorization gate," promoting and extending RFC 0007 §3's own authorization-gateway reasoning to explicitly cover D55's `status=active` check (§3 below) — this closes a gap D55 itself named as out of its own scope.
- `ubiquitous-language.md`, new "Identity context" entry (additive, same section RFC 0007's `User`/`BusinessMembership` entries already live in): **Invitation** — new term, defined below.
- **Not touched**: `architecture-principles.md` (no new numbered principle — existing #6, #7 are the lens applied, not extended, the same restraint RFC 0007 showed). `information-architecture.md` (no new nav tab or nav change — "Tu equipo" is a new section inside the existing Configuración surface, `settings.md` §2.7, not a structural navigation change). `Session`, `Event`, `Business`, `Product`, `InventoryUnit`, `Lot` — no schema, boundary, or lifecycle change; concurrent selling needs none (§7). **`Sale`'s schema — deliberately not touched here.** `Sale.performedByMembershipId` is recommended for its own standalone `decision-log.md` entry, same class as D33/D36/D54/D55, not this RFC's content — see §4. **The OWNER/SELLER permission table** — not domain-model content; an application/authorization-layer policy built on the already-modeled `role` field, referenced but not schematized here — see §6. **`EventAllocation`, `AllocationMovement`, the physical-location-exclusivity invariant, the reallocation mechanism, `Session.eventId`→`EventAllocation` resolution** — explicitly out of scope, belongs entirely to the sibling RFC, "Event-scoped inventory allocation" (`product-decisions.md` Q24/Q25's own RFC determination names both as sequenced together but independently reviewable).

## Why

### 1. `Invitation` is a new aggregate root, Identity context — the same test that promoted `Venue` and `BusinessMembership`

**Schema:**

```
Invitation (Identity context, aggregate root)
  - id
  - businessId   (required, references Business — the inviting OWNER's own Business)
  - phone        (required — same E.164 identity-credential shape as User.phone)
  - role         (SELLER — closed set of one value; no second value exists
                   to choose between, same not-merchant-extensible treatment
                   as BusinessMembership.role/Event.type, D16/D44)
  - status       (pending | accepted | revoked | expired — closed set)
  - createdAt    (required — resolves "most-recently-created pending
                   Invitation" when more than one exists for the same phone
                   across different Businesses, authentication.md §2.2a
                   step 2, and settings.md §3.11's own row-ordering rule;
                   not named explicitly in product-decisions.md's schema
                   summary, but required by two already-designed UX
                   behaviors that depend on it — filled in here rather
                   than left silently assumed, the same class of small
                   inferred-but-necessary field RFC 0007 itself supplied
                   for User/BusinessMembership's own createdAt fields)
```

**Uniquely identified by `(businessId, phone)` while `status = pending`** — a partial/conditional uniqueness constraint, not an absolute one: a resolved Invitation (`accepted`, `revoked`, or `expired`) never blocks a fresh reinvite to the same number, matching `settings.md` §3.12's own inline-validation behavior (the "ya invitaste a este número" message triggers only against a still-`pending` row) and D55's own stated expectation ("re-inviting the same phone number produces a new `Invitation`/Membership pair once this mechanism exists").

**Why a root, not an internal-only entity nested in Business.** `architecture-principles.md` #4's internal-only-entity test asks whether a concept "has no identity or lookup outside its parent." `Invitation` fails this the same way `Venue` (D20) and `BusinessMembership` (D44) did: resolving "does this verified phone hold a pending Invitation, from any Business" must run by `phone` alone, before any single Business is in context — the exact moment `authentication.md` §2.2 case 0 evaluates, at OTP-confirmation time, prior to any Business ever being resolved. This is the identical structural argument D44 used for `BusinessMembership` (resolving "which Businesses can this User reach" independent of any one Business) — `Invitation` needs the same phone-first query axis, one step earlier in the flow. Nesting it inside `Business` would make that query impossible without first knowing which Business to look inside, which is precisely the information this check doesn't have yet.

**Why Identity, not Selling.** `Invitation` carries no Selling-context data (no Session, no Sale, no Event reference) — it is entirely a join-offer between a `phone` and a `Business`, the same shape `BusinessMembership` itself has. Placed in Identity's existing "Owns" cell alongside `Business, Capabilities, User, BusinessMembership`; no new bounded context introduced.

**Idempotency on the send side, not just the accept side.** `settings.md` §3.12's "Enviar invitación" reuses the same guardando/error/retry template every other write-with-real-consequence in that document uses (§3.9/§3.10) — it is a retry-exposed write and therefore already falls under `architecture-principles.md` #7/D30's discipline: a retried send must never create two `Invitation` rows for the same `(businessId, phone)` pending pair. Named here explicitly, not left implicit — the same standard RFC 0007 §4 held the Owner-onboarding write to.

### 2. The Invitation-acceptance invariant, one level over D44's Owner-creation invariant

**Ruling, matching the exact mechanics `authentication.md` §2.2a step 3 already specifies:** the only write path that can create a `SELLER` `BusinessMembership` is a verified `User` (`phoneVerifiedAt` non-null) accepting a still-`pending` `Invitation` addressed to her verified phone. That single write atomically produces `BusinessMembership(userId, businessId, role=SELLER, status=active)` **and** flips `Invitation.status: pending → accepted`, in the same transaction — no `SELLER` `BusinessMembership` row exists without a corresponding `Invitation` transitioning out of `pending` in that same atomic write, the direct structural mirror of D44's "no `Business` row exists without a corresponding `OWNER` Membership."

**Idempotency.** `authentication.md` §2.2a explicitly carries "the same idempotency guarantee §3.7d already carries for its own genuine first-time-provisioning write" — a stable key, generated once when the accept action is first attempted and reused on every retry, so a retried "Aceptar y empezar a vender" tap can never produce a duplicate Membership or leave `Invitation.status` ambiguous between `pending` and `accepted`. Same discipline, `architecture-principles.md` #7/D30, applied one level over exactly as D44 itself was.

**Declining touches nothing** (`authentication.md` §2.2a step 4) — the Invitation stays `pending`, unaffected; only the inviting OWNER's own future "cancel pending" action (`settings.md` §8 item 11, not yet designed) can change it from there. This is a deliberate asymmetry, not an oversight: declining costs nothing to reverse because nothing was written.

### 3. D55's write-time authorization consequence: an extension of RFC 0007 §3's authorization-gateway concern, not a new bounded-context edge

**The question, precisely.** D55 added `BusinessMembership.status` (`active`/`revoked`) and named, but explicitly deferred, "authorization checks extending to require `status=active` wherever a Membership acts (opening a Session, etc.)." The task is to determine what kind of concern that is: an Identity-context data dependency (a new edge into the bounded-context table), a cross-cutting authorization-gateway concern (RFC 0007 §3's own precedent), or something else.

**RFC 0007 §3's test, restated:** enforcing "is the acting User a valid Member of the acting Business" on an incoming request "sits above the read/write graph this table describes," the same way no context models "is this HTTP request authenticated" as a dependency edge. The distinguishing question is whether a context's *own domain write logic* needs to functionally read another context's data as an input to compute something (a real edge — the way Selling's Price resolution genuinely reads Event's Price Override and Product's `defaultPrice` to compute `pricePaid`), or whether a check is resolved *before* that context's write logic ever runs, supplying it with already-validated context (the way every write already receives an already-validated `businessId` without Selling "reading" `Business` as a functional input).

**Applying it to D55's extension.** Checking `status=active` at Session-open (or any other Membership-gated action) is the identical shape of check RFC 0007 §3 already classified as gateway-level, just checking one more condition than mere existence. Nothing about Selling's own Session-open write logic needs to query `BusinessMembership`'s fields to compute anything — the gateway resolves "is this acting Membership valid and active" once, upstream, the same way it already resolves "is this acting Membership real at all," and supplies the write with an already-validated acting Membership. **Conclusion: this is the same authorization-gateway concern D44 already established, extended in scope (existence *and* `status=active`, not existence alone), not a new kind of concern and not a new bounded-context edge.** Selling, Inventory, and every other context stay exactly as ignorant of `BusinessMembership`'s existence as D44 already confirmed they'd remain.

**What actually needs to change, then, is documentation, not the domain model's edges** — RFC 0007 §3's authorization-gateway paragraph was reasoning stated *in that RFC*, never promoted into `domain-model.md`'s own Key Mechanisms as a standing note. D55 flagging this consequence "out of scope" is exactly the gap that leaves it undocumented at the authoritative layer. This RFC closes that gap by promoting and extending the note — see "Membership authorization gate" under Key Mechanisms, below.

### 4. `Sale.performedByMembershipId` — a correction to `product-decisions.md` Q24/Q25's framing

**What Q24/Q25 currently says.** It lists `Sale.performedByMembershipId` alongside `Invitation` under "two new aggregate roots + a new invariant on an existing write path, same class as RFC 0001/0004/0007," and folds it into this RFC's scope on that basis.

**Why that doesn't hold up under the actual RFC-trigger test.** `domain-model.md`'s own governing rule is explicit: plain entries for additive change, RFC for anything crossing an aggregate-boundary/bounded-context-edge/ubiquitous-language trigger. Checked against each:
- **No new aggregate.** `Sale` already exists as a root; this is one scalar field on it.
- **No ubiquitous-language redefinition.** `Sale`'s existing definition doesn't change meaning — a field is added to its description, the same way D33 added `pricePaid` resolution logic to `SaleItem`'s definition without redefining the term.
- **No new bounded-context edge — the substantive question.** `domain-model.md`'s bounded-context table already lists Selling as depending on `Identity (read-only)` — this edge predates D44, established for reading Business Capabilities (`registrationMode`, `defaultSellingMode`, `subscriptionTier`) at Session-open. The question is whether storing `performedByMembershipId` requires Selling to gain a *new, functional* read of `BusinessMembership` data, the way Price resolution requires a functional read of Event/Product data. It doesn't: `performedByMembershipId` is populated from already-resolved authorization context — the same acting Membership the gateway (§3, above) already validated before the Sale write ever runs — exactly the same pattern every Selling aggregate already uses to carry `businessId` (a scalar reference to an Identity-owned entity, populated from context, never requiring Selling to "read" `Business` as a functional input). `settings.md` §2.7's own reasoning makes the same point independently: "`Sale.performedByMembershipId` continuing to resolve after a revoke is Selling's own read, not something this document touches" — it's described as Selling's own already-scoped read, not a new cross-context query.

**RFC 0007 §3's own test, applied at the moment it said it would be.** RFC 0007 §3 named this exact field and deferred it explicitly: *"if it's ever wanted, it gets its own explicit Product Decision at that time... the same restraint D26 already applied to `Sale.claimToken`."* Note precisely what was deferred to — "its own explicit **Product Decision**," not "its own RFC." **Correcting a citation error found by `reviewer`:** D26 is not itself an instance of "a field logged as a plain decision-log entry" — D26's own text explicitly makes *no* change to `domain-model.md`'s Sale schema, deferring `claimToken` to Stage 2 build time; D26 is restraint against pre-building a dormant field (`architecture-principles.md` #5), a different axis than the RFC-trigger test being applied here. `Sale.claimToken`'s actual Foundation promotion happened via `product/99-rfc/0002-loyalty-claim-complete-capability.md` (D22) — an RFC, because that promotion generalized a ubiquitous-language term and changed a bounded-context dependency edge, neither of which applies to `performedByMembershipId`. The conclusion below doesn't depend on this citation — it's reached independently from the RFC-trigger test above.

**Correction.** `Sale.performedByMembershipId` should **not** be part of this RFC's normative domain-model content. It should be logged as its own standalone `decision-log.md` entry — same additive-field class and same standalone-logging precedent D55 itself just set for `BusinessMembership.status`/`revokedAt` — applying directly to `domain-model.md`'s `Sale` aggregate bullet and `ubiquitous-language.md`'s `Sale` entry, with no RFC gate. This RFC references the field's existence (it is already assumed live in `settings.md` §2.7's own reasoning) but does not schematize or promote it.

### 5. Multi-Business membership — confirmed, no schema change, closes RFC 0007 §5's open item 1

RFC 0007 §5 left open "whether a single `User` may later found/own more than one Business." `product-decisions.md` Q24/Q25 confirms: **yes**, no invariant restricts it. `BusinessMembership`'s own uniqueness constraint is `(userId, businessId)`, not `userId` alone — by construction, this already permits N Memberships per User; nothing about `User` being a global (not Business-scoped) root prevents a second onboarding or a second accepted `Invitation`. Every transactional aggregate (`Session`, `Sale`) is independently `businessId`-scoped regardless of Membership cardinality — no domain-model change is needed to support this, and none is made here. **The one open surface is resolving "current Business context" when a User holds more than one Membership** — a UX-only question (a Business-switching affordance), explicitly deferred to `ux-designer`, not designed in `authentication.md`/`home.md`'s current amendments and not addressed by this RFC either — named as a real gap, not silently assumed solved (see Open items).

### 6. The OWNER/SELLER permission table — application/authorization-layer policy, not domain-model content

`product-decisions.md` Q24/Q25 records a settled permission table (OWNER: Business identity, Catalog/Product management, Lot receiving/tagging, Event create/edit/pricing, allocation management, invite/manage staff, business-level Resultados; SELLER: open/close own Session, register Sales, read sellable Products/prices — ungated, own current-session activity).

**Checked against `architecture-principles.md` and the domain model's own conventions: nothing in this Foundation models authorization policy as domain data.** No `Permission`/`Role`-grant aggregate exists anywhere; `role` itself is already fully schematized on `BusinessMembership` (`OWNER | SELLER`, D44) and is the only domain-level fact the table is built on. Every existing precondition of this shape (e.g., "Quitar" is OWNER-only, `settings.md` §3.13; a given Business Capability write requires the acting party to be the OWNER) is enforced as a write-path precondition, evaluated by the same authorization-gateway layer §3 already establishes — never as new stored domain state, and never previously RFC-triggering when a new precondition of this kind was added.

**Conclusion:** the permission table is an application/authorization-layer policy, correctly recorded in `product-decisions.md` as the settled design and referenced by the UX specs that implement it — it needs no domain-model representation and is not part of this RFC's schema content. `role`'s existing values (already promoted, D44) are sufficient domain-model grounding for it.

### 7. Concurrent selling needs no further domain-model change — already true by construction

`domain-model.md`'s own `Event` bullet already states Event "does NOT own Session as a strict aggregate... Sessions reference `eventId` optionally; 'Event as a whole' summaries are read-side queries across Sessions sharing that ID, not a write-consistency boundary." This was never a single-Session assumption — it structurally permits multiple concurrently-open Sessions sharing one `eventId` without any change. D53 already lifted the one restriction that stood in the way at the *Event* level (simultaneous multi-Event operation, D17 superseded); nothing ever restricted Session-to-Session concurrency *within* one Event. `product-decisions.md` Q24/Q25 confirms this explicitly ("Concurrency itself needs almost no new mechanism") and the actual concurrency-safety mechanism (a compare-and-swap/atomic-decrement guarantee against `EventAllocation`) belongs entirely to the sibling "Event-scoped inventory allocation" RFC — not repeated here. This RFC's only role regarding concurrent selling is to confirm, on the record, that `Session`/`Event`/`Business` require zero schema change to support it.

## Ubiquitous-language addition (for `ubiquitous-language.md`'s Identity context section, once promoted)

> **Invitation** — an OWNER's standing offer for a specific phone number to join her Business as a SELLER (Identity context). Carries `businessId`, `phone`, `role` (always `SELLER` — closed set of one value, no picker exists since nothing distinguishes among options, `settings.md` §2.7's own "never ask twice" framing), `status` (`pending` | `accepted` | `revoked` | `expired` — closed set), `createdAt`. Unique on `(businessId, phone)` while `pending` — a resolved Invitation never blocks a fresh reinvite to the same number. Its own aggregate root, not nested inside Business — the same test that promoted `Venue` (D20) and `BusinessMembership` (D44): resolving "does this verified phone hold a pending Invitation, anywhere" must run before any single Business is in context, at OTP-verification time. Consumed, not merely referenced, on acceptance — see the Invitation-acceptance invariant, `domain-model.md#key-mechanisms`.

## Domain-model additions (for `domain-model.md`, once promoted)

**Aggregate roots, new entry (inserted after `BusinessMembership`):**

> **Invitation** — root, Identity context, not an entity nested inside Business — fails the internal-only-entity test the same way `Venue` (D20) and `BusinessMembership` (D44) did: resolving "does this verified phone hold a pending Invitation" must be queryable by `phone` alone, before any single Business is in context, at OTP-verification time. Schema: `id`, `businessId`, `phone`, `role` (`SELLER` — closed set of one value), `status` (`pending` | `accepted` | `revoked` | `expired` — closed set), `createdAt`. Unique on `(businessId, phone)` while `pending` — a resolved Invitation never blocks a fresh reinvite to the same number. Consumed, not merely referenced, by the `SELLER` `BusinessMembership` its acceptance produces — see "Invitation-acceptance invariant" under Key Mechanisms. See `decision-log.md` (this RFC's promotion entry).

**Key Mechanisms, new subsections:**

> **Invitation-acceptance invariant.** The only write path that can create a `SELLER` `BusinessMembership` is a verified `User` (`phoneVerifiedAt` non-null) accepting a still-`pending` `Invitation` addressed to her verified phone (`authentication.md` §2.2a). That single, idempotency-keyed write (`architecture-principles.md` #7, D30) atomically produces `BusinessMembership(userId, businessId, role=SELLER, status=active)` and flips `Invitation.status: pending → accepted` in the same transaction. No `SELLER` `BusinessMembership` row exists without a corresponding `Invitation` transitioning out of `pending` — direct one-level-over extension of D44's Owner-creation invariant.

> **Membership authorization gate.** Checking that the acting User holds a valid, currently-`active` `BusinessMembership` for the targeted Business — at Session-open, at Sale-write, at any Membership-gated action — is an authentication/authorization-gateway concern, not a bounded-context data dependency: it sits above the read/write graph this table describes, the same way no context models "is this request authenticated" as a dependency edge (RFC 0007 §3, D44). D55's `status` field extends what this gate checks (existence *and* `status=active`, not existence alone) without changing what kind of concern it is or creating any context dependency — Selling and every other context stay exactly as ignorant of `BusinessMembership` as before; the gate supplies each write with an already-validated acting Membership, the same way it already supplies an already-validated `businessId`. See `decision-log.md` D55.

**Bounded contexts table:** Identity's "Owns" cell becomes `Business, Capabilities, User, BusinessMembership, Invitation`. No "Depends on" cell changes anywhere.

## Entity relationships diagram addition

```
User (phone, phoneVerifiedAt)
  └─ BusinessMembership (role: OWNER | SELLER, status: active | revoked)
       ──→ references Business
       (the OWNER Membership is created atomically with its Business, D44;
        a SELLER Membership is created atomically with its consumed
        Invitation accepting — see Invitation-acceptance invariant)

Invitation (businessId, phone, role: SELLER,
            status: pending | accepted | revoked | expired)
  ──→ references Business
  (consumed, not referenced, by the SELLER Membership its acceptance
   produces — no ongoing structural link after acceptance beyond the
   historical status flip)
```

## Sequencing

Same posture RFC 0007 and RFC 0001/0004 already took: this is target schema/invariant design, not new UX design — the UX it makes implementable (`authentication.md` §2.2/§2.2a/§3.10–§3.13a, `settings.md` §2.7/§3.11–§3.14, `home.md`'s SELLER-role amendments) is already fully specified, `ux-critic`/`reviewer`-clean, and Approved (`product-decisions.md` Q24/Q25's own Status paragraph). Once Accepted, `architect`'s next step per the Migration Workflow (D43) is an Architecture Gap Analysis against those already-Approved specs, checking implementation-readiness for `Invitation`'s schema and the accept-invariant's atomic write — not redesigning the approved UX. Sequenced alongside, but independently reviewable from, the sibling "Event-scoped inventory allocation" RFC (`EventAllocation`/`AllocationMovement`/the exclusivity invariant/the reallocation mechanism/`Session.eventId`→`EventAllocation` resolution) — neither RFC's Acceptance blocks the other's.

**Recommended companion action, not part of this RFC's own content:** a standalone `decision-log.md` entry for `Sale.performedByMembershipId` (§4, above), applied directly to `domain-model.md`'s `Sale` bullet and `ubiquitous-language.md`'s `Sale` entry — same class and same standalone-logging precedent as D55.

## Open items, named for the Product Owner, not resolved here

1. **Business-switching UX for multi-Business membership** (§5) — a User holding Memberships in more than one Business has no designed "current Business context" surface anywhere yet. Deferred to `ux-designer`, not addressed here.
2. **Cancelling a still-pending `Invitation`** before it's accepted — no mechanism named anywhere in the settled architecture (`settings.md` §8 item 11).
3. **`Invitation.status = expired`'s trigger/timing** — not specified anywhere in the settled architecture (`settings.md` §8 item 12); this RFC's schema includes the value but does not define what sets it.
4. **Whether an already-active `SELLER` `BusinessMembership` is affected by a Paid→Free downgrade** — the settled architecture only confirms *issuing new* Invitations requires Paid; it takes no position on existing ones (`settings.md` §8 item 13).
5. **Configuración/nav carries no full role-based access gate today** — `settings.md` §2.7/§3.14 design the OWNER-only invite/revoke surface and the revoked-SELLER defensive state, but a full SELLER-specific stripped Home/nav experience isn't designed (`settings.md` §8 item 14).
6. **Whether reactivation of a `revoked` `BusinessMembership` should ever be offered** — D55 flagged this as a small, non-urgent open product-scope question, not resolved here or there.
7. **A merchant-visible display name for a team member** — the same gap RFC 0007 §5 already named for `User` (no personal display-name field); `settings.md`/`authentication.md` both inherit the identical limitation, restated here rather than silently dropped.
