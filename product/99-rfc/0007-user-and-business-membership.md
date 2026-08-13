# 0007 — User and BusinessMembership: authenticated Owner identity, atomic Business-creation invariant, domain shape ready for multiple Users per Business

Status: Proposed

## The idea

Formalizes the Product Owner's explicit decision (verbatim):

> "The first verified user creates the Business during onboarding and becomes its OWNER. Additional users do not create another Business. They join the existing Business later through an invitation flow and receive a BusinessMembership, initially with a SELLER role. For the current first-run/demo slice: Implement Owner registration with phone + OTP. After verification, the Owner completes the approved Business onboarding. Create the Business and the Owner membership atomically at the onboarding completion boundary. Do not implement invitations or additional-user onboarding in this slice. Keep the domain model ready for multiple users per Business from the beginning. The invitation/acceptance flow is a separate future slice and should not block the first demo."

This is the concern D17 already named and deliberately deferred — *"a future multi-employee capability (multiple sellers under one Business account)... a genuinely different kind of 'multi-user' problem than backlog #3's cross-tenant feature, since it needs no cross-tenant data and could be built whenever prioritized, not blocked on a data source"* — now being activated.

Two things follow, developed in full below:

1. **`User` and `BusinessMembership` are schematized as new aggregate roots** — the first authenticated-identity concept anywhere in this Foundation (`Customer`, by contrast, is explicitly defined as *not* one).
2. **Business creation gains a structural invariant**: no `Business` row can exist without a corresponding `OWNER` `BusinessMembership`, enforced by construction (one atomic write produces both), not by convention or a downstream check.

## What it touches

- `domain-model.md`:
  - **Aggregate roots** — two new entries, `User` and `BusinessMembership` (schemas below), inserted immediately after `Business`. Owned by the Identity context.
  - **Entity relationships diagram** — gains a minimal addition (below), since unlike Loyalty-claim ("future, not built"), this is the very next slice on `product/02c-high-fidelity-prototype/BACKLOG.md`.
  - **Bounded contexts table** — Identity's "Owns" cell gains `User, BusinessMembership`, alongside the existing `Business, Capabilities`. No "Depends on" cell changes, for Identity or any other context — no new dependency edge is created (see "Why," §3).
  - **Key mechanisms** — gains a new subsection, "Owner-creation invariant" (below), extending D19's onboarding-consequence pattern one level up to Business creation itself.
- `ubiquitous-language.md`, new "Identity context" entries (that section currently only has `Business`/Capability terms — this is additive within it, not a new section):
  - **User** — new term, defined below.
  - **BusinessMembership** — new term, defined below, `role` enumerated inline.
- **Not touched**: `architecture-principles.md` (no new numbered principle — existing #1, #6, #7 are the lens applied, not extended, the same restraint RFC 0004 showed with #4/#6). `information-architecture.md` (no new nav tab — Onboarding stays a pre-nav sequencing fact per D13; this RFC only adds a precondition to its existing write, it doesn't restructure navigation). Every other bounded context's "Depends on" cell (Selling, Inventory, Intelligence, Loyalty-claim) — none gains a new edge into Identity's new content (see "Why," §3). `Customer`'s schema and dedup invariant (D35/D37) — entirely unrelated; `Customer` remains explicitly not an authenticated User, and this RFC changes nothing about that boundary. Any real authentication/session/token mechanism (login persistence, request-level auth enforcement) — infrastructure, not domain, named explicitly as out of scope in "Why," §5, not silently assumed.

## Why

### 1. `User` is a global aggregate root, not Business-scoped — the deliberate exception to this Foundation's own pattern

**The naming.** `ubiquitous-language.md`'s own `Customer` entry already sets up the term: *"Not an authenticated platform user — no login, no roles, no global Nahui customer account."* `User` is exactly the concept that sentence is contrasting against — the natural, already-implied term, consistent with how `Customer`/`Venue` are both plain, unadorned nouns naming exactly the thing they are.

**Schema:**

```
User (Identity context, aggregate root)
  - id
  - phone            (required — the identity credential; E.164 format,
                       a build-layer detail, not decided here)
  - phoneVerifiedAt   (timestamp, nullable — set once OTP verification
                        succeeds; null means unverified)
  - createdAt
```

No `displayName` or other personal-identity field. The Product Owner's decision text names phone + OTP only; `Business.name`/`logo`/`description` (D36) already exist for the business's own brought-in identity, and no product requirement names a personal display field for Ana herself. Not fabricated here — if one is ever needed, it's a small additive field on an aggregate that already exists, the same class of change D36 itself was.

**Uniquely identified by `phone`, globally** — not per-Business, unlike every other dedup invariant this Foundation has established so far (D37's `(businessId, email)` for `Customer`). A registration/verification flow first looks up an existing `User` row by `phone`; if found, it's the same identity (relevant once invitations exist and a phone number already has a `User` row from having founded or joined a different Business); if not, a new `User` row is created on successful verification.

**Why global, not Business-scoped — the deciding argument, checked explicitly against the precedent this Foundation already built for exactly this question.** `product/99-rfc/0004-customer-loyalty-participation-record.md` evaluated two shapes for `Customer` and chose Business-scoped (B) over global-plus-participation-entity (A), for reasons stated explicitly:

> "(A)'s internal-entity indirection has no work to do here. The internal-entity pattern... exists specifically for genuine 1:N relationships... Once Customer itself is Business-scoped, 'this Customer's participation in this Business' is a 1:1 relationship by construction... nesting a second entity to represent a 1:1 relationship adds indirection with nothing to model."

`User`/`BusinessMembership` is the case that reasoning was written to distinguish itself *from*, not the case it applies to. The Product Owner's own decision separates `User` and `BusinessMembership` into two distinct things specifically because a User's relationship to a Business is genuinely 1:N — one Business, many Users, via the future invitation flow — and structurally N:M-capable: nothing in the decision rules out the same verified phone number later joining a second Business. If `User` carried `businessId` the way `Customer` does, `BusinessMembership` would have no relationship left to represent — it would collapse into a `role` field directly on `User`, exactly the D35/RFC-0004 "1:1 by construction" collapse this shape is meant to avoid where it doesn't apply. Here it doesn't apply; case (A) does.

**The named cost, stated rather than hidden (the same discipline RFC 0004 held itself to for its own global-vs-scoped call):** this is the one deliberate exception to "every aggregate root hangs off `businessId`" in this Foundation. It's justified narrowly, by the same test used to justify it: a real, shared authentication credential (a phone number that can complete OTP verification) genuinely can, in the model this feature is building toward, mean the same login across multiple Businesses — the thing `Customer` explicitly is not.

### 2. `BusinessMembership` is its own aggregate root, not an entity nested inside Business

**Schema:**

```
BusinessMembership (Identity context, aggregate root)
  - id
  - userId       (required, references User)
  - businessId   (required, references Business)
  - role          (OWNER | SELLER — closed set for now, same
                    not-merchant-extensible treatment as Event.type, D16;
                    extensible later via a product update, not self-service)
  - createdAt
```

**Uniquely identified by `(userId, businessId)`** — a User holds at most one Membership per Business, the same class of dedup invariant D37 established for `Customer`'s `(businessId, email)`.

**Why a root, not an internal-only entity (the NFCTag/InventoryEntry/Price-Override shape).** `architecture-principles.md` #4's internal-only pattern fits when a concept "has no identity or lookup outside its parent" — InventoryEntry only makes sense reached through its one Lot; Price Override only through its one Event; NFCTag is a 1:1 attribute with "no lifecycle worth protecting on its own" (D4). `BusinessMembership` fails this test structurally: resolving "which Businesses can this User act in, and with what role" — the exact question a login has to answer, before any single Business is even in context — requires querying Membership by `userId` alone, independent of any one Business. That's the identical structural argument D20 already used to make `Venue` a root rather than an Event-owned field: independent identity, referenced by ID from multiple places, queried on its own axis (there, grouping "Rendimiento por bazar" by `venueId`; here, resolving a User's accessible Businesses at login).

### 3. Bounded-context placement — Identity, no new dependency edge

`User`/`BusinessMembership` are added to Identity's existing "Owns" cell, alongside `Business, Capabilities` — this is the context that already governs Business-level configuration and identity (`defaultSellingMode`, `subscriptionTier`, and now `Business.name`/`logo`/`description`, D36). No new bounded context is introduced.

**No new dependency edge is created.** The task's own framing raises the sharpest version of this question directly: does Selling need to read User/Membership to know who's running a Session? **Confirmed out of scope, and confirmed as genuinely optional, not an unavoidable consequence of the aggregate existing.** `architecture-principles.md` #6 only creates a dependency edge when a context's actual read or write needs one — the mere existence of `User`/`BusinessMembership` as aggregates doesn't retroactively force Selling to depend on them, any more than `Customer` existing (D35) forced Selling to depend on Loyalty-claim (it explicitly, deliberately, doesn't — `domain-model.md`'s own stated guarantee). This slice has exactly one `User` per `Business` (the Owner); even once `SELLER` Memberships exist, "which User performed this specific Sale" is a genuinely new capability (attribution/audit) nothing in the current Foundation names a need for — if it's ever wanted, it gets its own explicit Product Decision at that time, the same restraint D26 already applied to `Sale.claimToken` ("the one sanctioned dormant-field exception... not a general license to pre-build every eventually-planned field"). Selling stays exactly as ignorant of `User`/`BusinessMembership` as it already is of Loyalty-claim/Intelligence.

**A related but distinct concern, named so it isn't mistaken for an oversight**: enforcing "is the acting User a valid Member of the acting Business" on an incoming request is an authentication/authorization-gateway concern, not a bounded-context data dependency. It sits above the read/write graph this table describes, the same way no existing context models "is this HTTP request authenticated" as an edge. The tenant-isolation discipline every aggregate already relies on (every query parameterized by `businessId`) is untouched and unaffected by this RFC — `BusinessMembership` answers "which Businesses can this login reach," a separate question from "is this query correctly scoped to one Business," which the existing model already handles.

### 4. The Owner-creation invariant, made structural not conventional

**Ruling:** the only write path that creates a `Business` row is `onboarding.md` §3.5's existing "Creando tu negocio" write, gated by a precondition that didn't exist before this RFC: the acting `User.phoneVerifiedAt` must be non-null. That write is extended to atomically produce two rows in the same transactional boundary — the new `Business`, and `BusinessMembership(userId=<the verified User>, businessId=<the new Business>, role=OWNER)`. No Business row is ever written without its Owner Membership committing in the same atomic operation; this is a property of there being exactly one write path that can create a Business at all, not a rule some later query has to remember to check — the same structural-not-conventional standard D35 already held its own denylist to.

This is a direct, one-level-up extension of D19's already-established pattern: *"Initial Business capabilities are set as a consequence of an Onboarding path, never as an isolated toggle."* This RFC applies the identical discipline to Business creation itself — it is never an isolated write either; it's always paired with its Owner's Membership, at the same onboarding-completion boundary D19 already anchors capability-setting to.

**Idempotency.** `onboarding.md` §3.5 is already a retry-exposed write (§3.5a's existing error/retry state) and therefore already falls under `architecture-principles.md` #7 / D30's idempotency-key discipline. Extending that write to produce two rows instead of one doesn't relax that requirement — the same stable key, generated once and reused on every retry of that attempt, must cover the atomic Business+Membership pair as a single unit, so a retried "Creando tu negocio" attempt can never produce a duplicate Business, a duplicate Membership, or (worse) a Business with no Membership from a partially-applied retry.

The exact UX placement of the phone+OTP capture step relative to `onboarding.md`'s existing §3.3 ("Bienvenida + Elegir cómo empezar") is a `ux-designer` task, deliberately not decided here — this RFC fixes only the domain requirement (no §3.5 write may execute without an already-resolved, verified `User`), not the screen sequence that gets there.

### 5. Explicitly out of scope, named per this project's own discipline

- **Invitations, the acceptance flow.** No `Invitation` concept is modeled. `BusinessMembership`'s schema is ready to be the target of a future invitation-acceptance write, but that write doesn't exist yet.
- **Any code path that could create a `SELLER` Membership — unreachable by construction in this slice, not merely deferred.** The only Membership-creating write is the atomic Owner-onboarding write above, which always assigns `OWNER`. The invitation flow — the only other conceivable source of a Membership — is explicitly out of scope. There is no path, today, that can produce a `SELLER` row.
- **SELLER-role permission enforcement beyond existing as a stored value** — moot for the identical reason: there is no `SELLER` Membership yet to enforce anything against. `role` is stored, closed-set, and otherwise inert in this slice.
- **Real SMS/OTP delivery.** Recommend simulating it consistent with how this prototype tier already discloses its other simplifications — `product/02c-high-fidelity-prototype/README.md`'s existing precedent (*"Sync-failure/retry states are not wired to a real failure simulator"*): a mocked send/verify step (e.g., a fixed or any-6-digit-accepted code, a simulated send delay), self-disclosed in that same README's pass-history the moment it's built, never silently presented as exercising a real carrier/SMS-gateway path. The domain model itself is indifferent to how verification happens — it only needs `User.phoneVerifiedAt` to end up non-null through whatever mechanism produces it.
- **Any real authentication/session/token mechanism** (login persistence across app opens, request-level auth enforcement, password/credential storage beyond the phone identity itself) — infrastructure, not domain, per §3's distinction above. Not designed here.

### 6. Ubiquitous-language additions (for `ubiquitous-language.md`'s Identity context section, once promoted)

> **User** — an authenticated platform person (Identity context), the concept `Customer` is explicitly *not* ("no login, no roles, no global account"). Identified globally by `phone` (not Business-scoped, the one deliberate exception to this Foundation's Business-scoping pattern — see `decision-log.md`). Carries `phoneVerifiedAt` (nullable timestamp; non-null once OTP verification succeeds). No personal display-name field exists yet — a named gap, not an oversight.

> **BusinessMembership** — the join between a `User` and a `Business` (Identity context), carrying `role` (`OWNER` | `SELLER` — closed set, not merchant-extensible, same treatment as `Event.type`, D16). A `User` holds at most one Membership per Business, `(userId, businessId)` unique. Its own aggregate root, not nested inside Business — needed independently of any single Business to resolve which Businesses a `User` can reach.

## Owner-creation invariant (for `domain-model.md`'s Key Mechanisms, once promoted)

> **Business creation is never an isolated write.** The only path that creates a `Business` row is a verified `User` (`phoneVerifiedAt` non-null) completing the approved Business onboarding flow; that single, idempotency-keyed write (`architecture-principles.md` #7) atomically produces the new `Business` and a `BusinessMembership(userId, businessId, role=OWNER)` in the same transaction. No `Business` row exists without a corresponding `OWNER` Membership — enforced by there being exactly one write path capable of creating a Business at all, not by a downstream validation query. Directly extends D19's onboarding-consequence pattern one level up, from Business capabilities to Business existence itself.

## Entity relationships diagram addition (minimal — this is buildable-now scope, unlike Loyalty-claim's "future, not built")

```
User (phone, phoneVerifiedAt)
  └─ BusinessMembership (role: OWNER | SELLER) ──→ references Business
```

## Sequencing (restated, not silently dropped)

This is target schema/invariant design, the same posture RFC 0001/0004 already took. Onboarding is confirmed as the very next slice on `product/02c-high-fidelity-prototype/BACKLOG.md` — once Accepted, `architect`'s next step per the Migration Workflow (D43) is an Architecture Gap Analysis against `onboarding.md`'s already-Approved spec, checking implementation-readiness for the phone+OTP precondition and the atomic write, not redesigning the approved UX.

## Open items, named for the Product Owner, not resolved here

1. **Whether a single `User` may later found/own more than one Business** (a second onboarding run by an already-verified phone) is not addressed by the decision text and isn't needed for this slice — the schema doesn't prevent it, but nothing here decides it either way.
2. **Whether Ana ever needs a personal display-name field**, distinct from `Business.name` — not named as a requirement here; deliberately left unmodeled rather than fabricated.
