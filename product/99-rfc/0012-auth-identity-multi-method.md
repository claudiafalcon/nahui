# 0012 — AuthIdentity: multi-method identity for User, decoupling business identity from any single authentication credential

Status: Proposed

## The idea

`User.phone` is currently this Foundation's global identity/uniqueness key for the Identity context's first authenticated-identity concept (`product/99-rfc/0007-user-and-business-membership.md`, D44) — not merely a display field. Two structural invariants are built directly on it: the Owner-creation invariant (D44 — "the acting `User.phoneVerifiedAt` must be non-null") and the Invitation-acceptance invariant (D56 — "a verified `User`... accepting a still-`pending` `Invitation` addressed to her verified phone").

Per the Product Owner's explicit direction, this RFC introduces `AuthIdentity` — a new aggregate root, Identity context — as the place where every authentication credential (phone today; email, Google, Apple later) lives, and rewires `User` to be a bare person-identity anchor with zero or more linked `AuthIdentity` rows, rather than a phone-keyed record. This mirrors Supabase Auth's own native `identities` table shape (confirmed by `knowledge-mentor` consultation, see §7) — the backend-integration side is largely already-supported platform capability; the genuinely new work is Nahui's own domain-model rewiring, which is this RFC's actual content.

**Why now (`reviewer` Important finding, closed):** the trigger is a specific, current piece of field feedback, not a speculative architecture improvement — the Product Owner has heard directly from prospective merchants that a new Mexican government mobile-line-registration policy is making some of them reluctant to register a phone number at all, a distinct and more structural problem than ordinary OTP-delivery friction (no channel change fixes a merchant who won't provide a phone number in the first place, see §1). This is related to, but a different question from, `company/merchant-validation-concierge-pilot.md`'s **PF5 — Phone-entry experience** signal, which tracks whether an *already-engaged* respondent finds the OTP step itself uncomfortable or confusing (Track 2 only, §6.4.3 of that document) — PF5 is explicitly logged-but-not-actionable-alone in that pilot's own framework, since it doesn't represent the anonymous-bounce population its findings would need to generalize to. The government-policy signal driving this RFC is a different, Product-Owner-sourced observation, not a PF5 finding itself — cross-referenced here only so a future reader doesn't conflate the two or assume this RFC's timing was set by that pilot's own evidence bar.

Five things follow, developed in full below:

1. **`AuthIdentity` is schematized as a new aggregate root**, Identity context, holding one linked credential (type + identifier + verification state) per row, globally unique on `(type, identifier)`.
2. **`User`'s own schema is corrected**: `phone`/`phoneVerifiedAt` are removed from `User` and become one `AuthIdentity` row's fields instead. `User` becomes exactly what `BusinessMembership`/`Sale`/`EventAssignment` already needed it to be — a stable `userId` anchor, nothing more.
3. **Every existing domain relationship that touches identity is checked against this change individually** — `BusinessMembership`, the Owner-creation invariant, `Invitation.phone`, `Sale.performedByMembershipId`, `EventAssignment.membershipId` — three already correct as-is, two needing a resolution-mechanics correction (not a schema change).
4. **A new invariant, "AuthIdentity resolution," makes "adding a method never creates a new business identity" structural**, not a UX convention: `AuthIdentity` creation has exactly two shapes, and only two.
5. **Account-linking and duplicate-prevention invariants are stated explicitly**, including one genuine gap named and deliberately deferred rather than silently solved.

The current WhatsApp/phone flow is confirmed, not merely asserted, to need zero UX changes to ship this RFC — see §6.

## What it touches

- `domain-model.md`:
  - **Aggregate roots** — one new entry, `AuthIdentity` (schema below), inserted immediately after `User`. Owned by the Identity context. `User`'s existing entry is corrected: `phone`/`phoneVerifiedAt` removed from its schema, replaced with a pointer to `AuthIdentity`.
  - **Entity relationships diagram** — `User`'s block gains an `AuthIdentity` child; the `BusinessMembership`/`Invitation` blocks are otherwise unchanged (see below).
  - **Bounded contexts table** — Identity's "Owns" cell gains `AuthIdentity`, alongside the existing `Business, Capabilities, User, BusinessMembership, Invitation`. No "Depends on" cell changes, for Identity or any other context — no new dependency edge is created (§3, below — `AuthIdentity` is exactly as invisible outside Identity as `User`/`BusinessMembership` already are).
  - **Key mechanisms** — the Owner-creation invariant (D44) and the Invitation-acceptance invariant (D56) are both **amended** (not replaced in substance — the guarantee each provides is unchanged; only the field-level resolution path each depends on is corrected). Two new subsections: "AuthIdentity resolution invariant" and "AuthIdentity linking and duplicate-prevention invariants."
- `ubiquitous-language.md`, Identity context: `User`'s entry corrected (phone-identity language removed); new `AuthIdentity` entry added.
- **Not touched**: `architecture-principles.md` (existing #4's internal-only-entity test, #6's dependency-direction rule, and #7's idempotency discipline are the lens applied, not extended — same restraint RFC 0007/0008/0011 all showed). `information-architecture.md` (no nav change — nothing merchant-visible changes, see §6). `BusinessMembership`, `Invitation`, `Sale`, `EventAssignment` **schemas** — all confirmed unchanged (§3, below); only the Owner-creation/Invitation-acceptance invariants' internal resolution mechanics are corrected, which is `domain-model.md` Key Mechanisms prose, not a schema edit to any of those four aggregates. Every other bounded context (Selling, Inventory, Intelligence, Loyalty-claim) — no new dependency edge into Identity's new content, for the identical reason RFC 0007 §3 established for `User`/`BusinessMembership` itself: `AuthIdentity` has no consumer anywhere outside Identity's own authentication-gateway resolution.

## Why

### 1. `AuthIdentity` is a new aggregate root, Identity context — the same test that already promoted `Venue`, `BusinessMembership`, `Invitation`, `EventAssignment`

**Schema:**

```
AuthIdentity (Identity context, aggregate root, global — not businessId-scoped)
  - id
  - userId       (required, references User)
  - type         (phone | email | google | apple — closed set, extensible
                   only via a future product update, not self-service,
                   same not-merchant-extensible treatment as
                   BusinessMembership.role/Event.type, D16/D44)
  - identifier    (required — the credential value: E.164 phone for
                    `phone`, email address for `email`, the provider's
                    stable subject/user ID for `google`/`apple` —
                    deliberately not the OAuth-provider email, since a
                    Google/Apple account's associated email can be
                    hidden/relayed or changed without the underlying
                    identity changing; a documentation note for whenever
                    those types are actually built, not a build decision
                    made here)
  - verifiedAt    (nullable timestamp — non-null once that method's own
                    verification completes: OTP success for `phone`,
                    an email verification step for `email`, a successful
                    OAuth callback for `google`/`apple`, since the
                    provider itself already attests ownership there)
  - createdAt
```

**Unique on `(type, identifier)`, globally** — the direct generalization of `User.phone`'s own current global uniqueness (D44). Resolvable by `(type, identifier)` alone, before any single `User` is in context — the exact moment any verification flow (today: OTP-confirm; later: an email-verify or OAuth callback) resolves at. This is the identical structural test that already promoted `BusinessMembership` ("which Businesses can this User reach, independent of any one Business"), `Invitation` ("does this phone hold a pending Invitation, independent of any Business"), and `EventAssignment` ("which Memberships/Events, independent of either side") — here applied one level earlier: "which User does this credential belong to, independent of any User already being resolved."

**Global scope is inherited, not a second independent exception.** `User` is already this Foundation's one deliberate exception to `businessId`-scoping (RFC 0007 §1, justified narrowly by a real, shared authentication credential meaning the same login across Businesses). `AuthIdentity` doesn't need its own separate justification for being global — it's structurally downstream of `User`'s own already-justified exception: a credential belongs to a global `User`, so the credential itself can't be Business-scoped either without breaking the very thing it's identifying.

**Why a root, not an entity nested inside `User`.** `architecture-principles.md` #4's internal-only-entity test asks whether a concept "has no identity or lookup outside its parent." `AuthIdentity` fails this the same way every other promoted-to-root concept in this Foundation has: resolving "which `User` does this presented credential belong to" must run by `(type, identifier)` alone, at the exact moment authentication is attempted, before any `User` row is loaded into context at all — the identical shape D44 already used to justify `BusinessMembership`, applied one hop earlier in the chain.

**Idempotency.** Every write that creates or links an `AuthIdentity` row — OTP-confirm today, an email-verify or OAuth-callback write later — is retry-exposed the same way `authentication.md` §3.7/§3.7d already is, and therefore already falls under `architecture-principles.md` #7/D30's discipline: a stable idempotency key, generated once per attempt and reused on retry, must cover the atomic write (whichever shape it takes — see §4) as a single unit, so a retried attempt can never produce a duplicate `AuthIdentity`, a duplicate `User`, or an `AuthIdentity` with no owning `User`. Same standard RFC 0007 §4/RFC 0008 §2 already held the Owner-creation and Invitation-acceptance writes to, extended one level over.

### 2. `User`'s schema is corrected — phone stops being the User's own field

**Corrected schema:**

```
User (Identity context, aggregate root, global)
  - id
  - createdAt
```

`phone` and `phoneVerifiedAt` are removed entirely — not kept as a denormalized convenience copy alongside `AuthIdentity`. This is a deliberate choice, checked against this Foundation's own restraint discipline rather than defaulted to: a cached/denormalized `User.phone` would need its own sync-never-drifts guarantee (the same category of risk `architecture-principles.md` #5 exists to name explicitly whenever accepted, not smuggle in silently), and nothing in the current product requires it — every existing consumer of "this User's verified phone" (Owner-creation, Invitation-acceptance, `authentication.md`'s own device/session resolution) is a one-hop join to `AuthIdentity`, not a hot read-path requiring pre-computation at Nahui's current scale. If read-performance ever demands one, that's a small, explicitly named future addition — the same restraint D26/RFC 0008 §4 already applied to not pre-building `Sale.performedByMembershipId` before it was needed.

`User`'s existing named gap (no personal display-name field, RFC 0007 §5 item 2) is unaffected and restated, not resolved, here.

### 3. Every existing domain relationship touching identity, checked individually against this change

**`BusinessMembership` (D44).** Already correct as-is — no change. Its schema references `userId`, never `phone` or any credential value directly. `BusinessMembership`'s own uniqueness (`userId, businessId`) and its consumer-facing behavior (which Businesses a login can reach) are entirely unaffected by how that `userId` got authenticated.

**The Owner-creation invariant (D44) — amended.** Current text: *"the only path that creates a `Business` row is a verified `User` (`phoneVerifiedAt` non-null) completing the approved Business onboarding flow."* **Corrected:** the acting `User` must hold **at least one verified `AuthIdentity`** (`verifiedAt` non-null, of any `type`) — generalized from a phone-specific check to a method-agnostic one, since Business creation should only ever care that the acting person is a real, verified human, never which credential she verified through. At Nahui's current phone-only exposure this is exactly equivalent to today's check (there is only ever one `AuthIdentity` row to check), so this correction changes no observable behavior today — it only removes a false assumption ("verified" specifically means "phone verified") that would otherwise become wrong the moment a second method ships.

**`Invitation.phone` (D56) — designed, not assumed, kept phone-specific.** This is the one place the Product Owner asked for an explicit design choice rather than a default. Two options exist: (a) generalize `Invitation` to carry `(identifierType, identifier)` mirroring `AuthIdentity`'s own shape, letting a future OWNER invite by email or another method; (b) keep `Invitation.phone` exactly as it is.

**Ruling: (b), keep it phone-specific, for reasons independent of the AuthIdentity change itself, not merely deferred by default.** `Invitation`'s phone-specificity was never a side effect of `User` being phone-keyed — it's the lowest-friction merchant default for a real, standing UX pattern: an OWNER inviting a SELLER by the number she'd hand her directly (the same number she already uses for WhatsApp with that person). Generalizing it now to a type-picker or multi-format identifier field would introduce a real UI decision (which method to invite by) with zero product evidence anyone needs it — exactly the kind of unjustified complexity `global-principles.md`'s "the fastest interaction is the one that never happens" / "never ask twice" principles and `architecture-principles.md` #1's "resolved once, upstream, never asked mid-flow" argue against, and exactly the schema-stability-exception discipline `architecture-principles.md` #5 requires be named explicitly rather than smuggled in, if it were ever done. **What does change, mechanically:** `Invitation`'s own schema stays untouched, but the Invitation-acceptance invariant's resolution mechanics (below) now resolve "her verified phone" via her `AuthIdentity(type=phone)` row instead of a `User.phone` field that no longer exists. Generalizing `Invitation` beyond phone is explicitly named as a candidate future RFC, gated on the same product-evidence bar the Product Owner has already set for exposing a second auth method at all — not designed here, not silently ruled out either.

**The Invitation-acceptance invariant (D56) — amended.** Current text: *"a verified `User` (`phoneVerifiedAt` non-null) accepting a still-`pending` `Invitation` addressed to her verified phone."* **Corrected:** the accepting `User` must hold an `AuthIdentity(type=phone, identifier=Invitation.phone, verifiedAt non-null)` — the same guarantee, resolved through one additional join. The invariant's actual promise (no `SELLER` Membership without a consumed Invitation matched to a verified phone) is unchanged; only the field path is corrected.

**`Sale.performedByMembershipId` (D58).** Already correct as-is — no change. Already references `BusinessMembership`, not `User`/phone directly, per D58's own explicit finding ("populated from already-resolved authorization context, the same pattern every Selling aggregate already uses to carry `businessId`"). Nothing about `AuthIdentity` existing changes this — Selling stays exactly as ignorant of `User`/`AuthIdentity` as it already is of `BusinessMembership`'s own internals (RFC 0007 §3).

**`EventAssignment.membershipId` (D60).** Already correct as-is — no change, for the identical reason as `Sale.performedByMembershipId`: it references `BusinessMembership` by ID only, "same pattern as `Sale.performedByMembershipId`, D58" (D60's own text). No path from `EventAssignment` to `User`/`AuthIdentity` exists or is needed.

### 4. The AuthIdentity resolution invariant — making "adding a method never creates a new business identity" structural

**The requirement, restated precisely:** (a) a returning person authenticating via a method she's already linked resolves to her existing `User`/`BusinessMembership`/`Business` set, never a new `User`; (b) an already-authenticated person adding a second method links it to her existing `User`, never creates a second one.

**Ruling — `AuthIdentity` creation has exactly two shapes, and only two:**

1. **First-ever-credential creation.** No currently-authenticated `User` exists in context, and lookup by `(type, identifier)` finds no existing `AuthIdentity` row. A single atomic write creates a new `User` row and a new `AuthIdentity` row (`userId` = the new `User`'s id, `verifiedAt` set by that method's own verification) together, in the same transaction. This is the direct generalization of RFC 0007's own already-stated (if informally named) "look up an existing `User` row by `phone`; if found, same identity; if not, create one" logic — now keyed on `(type, identifier)` instead of `phone` alone, and formally named here as a Key Mechanism for the first time.
2. **Additive linking.** An already-authenticated `User` (a real session already resolved to a `userId`) verifies a second method — one new `AuthIdentity` row is created, `userId` = the already-authenticated `User`'s existing id. **This write never creates, modifies, or references a second `User` row, ever, by construction** — there is no write path in this shape that touches `User` at all beyond the existing row's `userId` being copied onto the new `AuthIdentity` row. This is the structural mechanism that satisfies requirement 3: adding a method is additive-only because the only write this shape can perform is inserting one `AuthIdentity` row.

**Resolution-by-credential is always shape 1 or shape 2 — no third shape exists.** A returning person authenticating via an already-linked method (lookup by `(type, identifier)` finds an existing `AuthIdentity` row, and no *new* row needs writing at all) is not a creation case — it's a plain login, resolving directly to that row's `userId` and, through it, her existing `BusinessMembership`/`Business` set unchanged. Naming this explicitly closes the gap: nothing about this design ever re-derives or re-decides which `User`/`Business` a returning credential belongs to — it's read once, from the unique `(type, identifier)` row, exactly the same "resolved once, never re-asked" discipline every other capability in this Foundation already holds itself to (`architecture-principles.md` #1).

### 5. Account-linking and duplicate-user prevention invariants — stated explicitly, one gap named and deferred

**Invariant A — an `AuthIdentity.userId` is immutable after creation; no reassignment write path exists.** Once an `AuthIdentity` row is created (either shape above), its `userId` never changes. There is no "transfer this credential to a different User" mechanism anywhere in this design. This is what makes shape 2 (additive linking) safe by construction: linking can only ever add a new row pointing at the *current* session's `User`, never repoint an existing row.

**Invariant B — attempting to link a credential already claimed by a different `User` is a hard refusal, never a silent merge or reassignment.** If an already-authenticated `User` X attempts to add `(type, identifier)`, and lookup finds that pair already owns an `AuthIdentity` row with `userId = Y ≠ X`, the write must be rejected — `AuthIdentity`'s own `(type, identifier)` global uniqueness constraint is the structural enforcement mechanism (the write simply cannot succeed, the same class of database-level guarantee `BusinessMembership`'s `(userId, businessId)` uniqueness and `Invitation`'s `(businessId, phone)` partial uniqueness already provide elsewhere in this Foundation). The UX for surfacing that refusal to the merchant (an error state, a "this phone/email is already linked to another account" message) is a `ux-designer` task at whatever future point a second method actually ships — not designed here, but the domain-level refusal itself is structural, not a UX-layer courtesy.

**Invariant C — merging two pre-existing, separately-created `User` records that represent the same real person is explicitly out of scope for this RFC, deferred, not prevented.** Here is the real gap, stated plainly rather than left implicit: if a person is ever able to complete shape 1 (first-ever-credential creation) *twice*, once per method — e.g., she signs up via phone once, and later, on a different occasion, completes a *fresh* method-B verification without ever being an already-authenticated session (so shape 2 never triggers) — this design produces two independent `User` rows, each with its own `BusinessMembership`/`Business` history, with no structural link between them. Nothing in `AuthIdentity`'s schema detects or prevents this, because phone and email/OAuth identifiers carry no inherent correlation Nahui can check.

**This is not a defect in the current build — it's structurally unreachable today**, since only `phone` is exposed to end users; shape 1 can only ever fire once per phone number, and `AuthIdentity(type=phone)`'s own global uniqueness already prevents a second `User` for the same phone. **It becomes a real, live risk only the moment a second method is actually exposed to end users** — at that point, whatever UX ships the second method (a "Sign in with Google" button, say) must decide whether it always requires an already-authenticated session (forcing shape 2, never shape 1, for a second method — structurally preventing this gap entirely) or allows a cold, fresh sign-up via the new method too (permitting the gap). **Recommendation, not a resolution:** requiring shape 2 for every method after the first (i.e., a second method is only ever addable from within an already-authenticated session, never as its own independent fresh sign-up) closes this gap structurally, at zero cost, and should be the default unless a specific product reason argues otherwise at that time — flagged as a launch-gating design decision for whichever future RFC activates a second method, not resolved here since it depends on a UX shape (how the second method's sign-up entry point works) that doesn't exist yet. Building active merge machinery (detecting and reconciling two pre-existing separate `User`s) now, with zero live instances and zero exposed second method, would be exactly the kind of pre-building `architecture-principles.md` #5/D26 already argues against — named as a real gap so it isn't rediscovered as a surprise later, not solved prematurely.

### 6. Zero-UX-change confirmation — checked directly against `authentication.md`'s actual resolution logic, not asserted

Every step of `authentication.md`'s current phone-OTP flow that reads `User.phone`/`User.phoneVerifiedAt` (§2.1's device-session resolution, §2.2's four-way branch, §3.7e's "this device previously held a different phone" defensive check, §2.2a's Invitation-acceptance matching) is a lookup that, under this RFC, resolves through exactly one additional join — `AuthIdentity(type=phone, identifier=<the number>)` — landing on the identical `userId` it would have found by reading `User.phone` directly today. Since only `phone` is exposed, every `User` in the current build has exactly one `AuthIdentity` row, and "resolve by phone" and "resolve by this User's one `AuthIdentity`" are the same operation under a different name. **No screen, step, copy, or interaction in `authentication.md` requires any change for this RFC to land** — this is a data-layer rewire underneath an already-Approved, unmodified spec, the same posture RFC 0007/0008 both took relative to `onboarding.md`/`authentication.md`'s already-designed UX. Email/Google/Apple are modeled in the schema (so activating them later is a schema-stable addition, not a breaking migration) but expose no UI, no method-choice screen, no picker — nothing merchant-visible changes until a future, separately-decided product-evidence gate, per the Product Owner's own explicit instruction.

**Checked for the failure case explicitly, not just asserted clean:** the one place a design *could* have forced a UX change is if resolving "is this User verified" had needed to become ambiguous or multi-valued (e.g., "verified via which method?" surfacing somewhere). It doesn't — the Owner-creation invariant's correction (§3, above) collapses to an identical single-`AuthIdentity` check at phone-only scale, and no other consumer anywhere in this Foundation reads verification state directly. Confirmed clean.

**Second Approved consumer checked (`reviewer` Important finding, closed):** `product/02-ux/settings.md` §2.5/§3.3a ("Tu cuenta") also reads `User.phone` directly and literally — its own §10 states "her own verified phone number is now shown, read-only, in 'Tu cuenta'... `User.phone` — never editable here." Checked directly against that section's actual current text, not just named: the display resolves through the identical one-hop `AuthIdentity(type=phone, identifier=<the number>)` join as every other consumer above, landing on the same value. No copy, layout, or interaction in `settings.md` requires any change — only the underlying field path (`User.phone` → `AuthIdentity(type=phone).identifier`) is corrected, same as everywhere else in this section.

### 7. `knowledge-mentor` consultation

Consulted on whether this shape (a `User`/`AuthIdentity` split, one-to-many, closed-set method types, global credential uniqueness) is well-founded against established practice, not just internally consistent with this Foundation's own precedent (per this role's own consultation trigger — a new aggregate boundary in the Identity context).

**Findings, incorporated above:**
- **Supabase Auth already natively implements this exact shape** — an `identities` table keyed to `user_id`, with phone/email/OAuth providers all modeled as first-class linked identity rows, closed-set `provider` values. The backend-integration side of this RFC is largely already-supported platform capability; the real net-new work is Nahui's own domain-model rewiring (this document), not building linking infrastructure from scratch. Worth noting explicitly (`reviewer` Suggestion): this isn't a coincidental fit — `company/business-decisions.md` Q15 already chose Supabase as Nahui's infrastructure vendor for unrelated reasons (operational simplicity/cost at pilot scale), and this consultation independently confirms that same platform also happens to natively model the exact identity shape this RFC needs, rather than the RFC's design being shaped around Supabase's capabilities after the fact.
- **One caveat, named as a future risk, not solved now:** native (non-web) OAuth-to-already-phone-verified-user linking has a documented rough edge in Supabase's current implementation (GitHub `supabase/discussions/36463`) — relevant only if Nahui ever ships a native app shell and only once Google/Apple sign-in is actually activated. Named here so it isn't rediscovered as a surprise at that point; not a blocker to this RFC, which activates no OAuth method.

## Key mechanisms (for `domain-model.md`, additions and amendments)

> **AuthIdentity resolution invariant (new).** `AuthIdentity` creation has exactly two shapes: (1) **first-ever-credential creation** — no currently-authenticated `User` exists and lookup by `(type, identifier)` finds none; a single atomic write creates a new `User` and its first `AuthIdentity` row together. (2) **Additive linking** — an already-authenticated `User` verifies a second method; one new `AuthIdentity` row is created, `userId` set to the existing `User`'s id; this shape never creates, modifies, or references a second `User` row. Resolution of an already-linked credential (lookup finds an existing row) is neither shape — it's a plain read, resolving directly to that row's `userId` and her unchanged `BusinessMembership`/`Business` set. This generalizes RFC 0007's own informally-stated "look up by phone; if found, same identity; if not, create one" logic to `(type, identifier)`, and is what makes "adding an authentication method never creates a new business identity" a structural guarantee, not a UX convention. See `decision-log.md` (this RFC's promotion entry).

> **AuthIdentity linking and duplicate-prevention invariants (new).** (A) `AuthIdentity.userId` is immutable after creation — no write path reassigns an existing row to a different `User`. (B) Attempting to link a credential already claimed by a different `User` is a hard refusal, enforced structurally by `AuthIdentity`'s own global `(type, identifier)` uniqueness constraint, never a silent merge. (C) Two pre-existing, separately-created `User` records that happen to represent the same real person — reachable only once a second authentication method is exposed to end users, and only if that method's sign-up entry point permits a cold, fresh first-ever-credential creation rather than requiring an already-authenticated session — are not detected or merged by this design. Structurally unreachable at Nahui's current phone-only exposure; a launch-gating design decision for whichever future work activates a second method, not resolved here.

> **Owner-creation invariant (amended, RFC 0012 — supersedes D44's phone-specific wording, guarantee unchanged).** The only path that creates a `Business` row is a `User` holding at least one verified `AuthIdentity` (`verifiedAt` non-null, of any `type`) completing the approved Business onboarding flow; that single, idempotency-keyed write atomically produces the new `Business` and a `BusinessMembership(userId, businessId, role=OWNER)` in the same transaction. Generalized from D44's original "`phoneVerifiedAt` non-null" check, which is now a `User`-level field that no longer exists — at Nahui's current phone-only exposure this collapses to an identical check, since every `User` has exactly one `AuthIdentity`.

> **Invitation-acceptance invariant (amended, RFC 0012 — supersedes D56's phone-specific field reference, guarantee unchanged).** The only write path that can create a `SELLER` `BusinessMembership` is a `User` holding a verified `AuthIdentity(type=phone, identifier=Invitation.phone)` accepting a still-`pending` `Invitation` addressed to that phone. That single, idempotency-keyed write atomically produces `BusinessMembership(userId, businessId, role=SELLER, status=active)` and flips `Invitation.status: pending → accepted`, in the same transaction. `Invitation` itself stays phone-specific (§3, above, "designed, not assumed") — this is a resolution-path correction only.

## Ubiquitous-language additions/amendments (for `ubiquitous-language.md`'s Identity context section)

> **User** — an authenticated platform person (Identity context), the concept `Customer` is explicitly *not* ("no login, no roles, no global account"). Global, not Business-scoped (the one deliberate exception to this Foundation's Business-scoping pattern, RFC 0007). Carries no credential of its own — every authentication method a User has verified lives on a separate `AuthIdentity` row (below); `User` is a bare identity anchor. No personal display-name field exists yet — a named gap, not an oversight. `decision-log.md` D44, amended by this RFC.

> **AuthIdentity** — one linked authentication credential belonging to a `User` (Identity context), own aggregate root, global (inherits `User`'s own already-justified exception to Business-scoping, not a second independent one). Carries `userId`, `type` (`phone` | `email` | `google` | `apple` — closed set, not self-service-extensible, same treatment as `BusinessMembership.role`/`Event.type`), `identifier` (the credential value — E.164 phone, email address, or OAuth provider subject ID, never the provider's associated email for `google`/`apple`), `verifiedAt` (nullable; non-null once that method's own verification completes). Unique on `(type, identifier)`, globally — resolvable by credential alone, before any single `User` is in context, the same structural test that already promoted `BusinessMembership`/`Invitation`/`EventAssignment`. A `User` may hold multiple `AuthIdentity` rows; adding one is always additive, never creates a second `User` (see "AuthIdentity resolution invariant," `domain-model.md#key-mechanisms`). At Nahui's current phone-only exposure, every `User` has exactly one row (`type=phone`) and this design is behaviorally identical to the pre-RFC-0012 model. `decision-log.md` (this RFC's promotion entry).

## Domain-model additions (for `domain-model.md`, once promoted)

**Aggregate roots** — `User`'s existing entry corrected (schema above, §2); one new entry, `AuthIdentity`, inserted immediately after `User` (schema above, §1).

**Entity relationships diagram amendment:**

```
User (id, createdAt)
  ├─ AuthIdentity (userId, type: phone | email | google | apple,
  │    identifier, verifiedAt) — unique on (type, identifier), globally;
  │    a User holds 1+ rows; adding one is additive-only, never creates
  │    a second User (AuthIdentity resolution invariant, RFC 0012)
  └─ BusinessMembership (role: OWNER | SELLER, status: active | revoked)
       ──→ references Business
       (the OWNER Membership is created atomically with its Business, D44;
        a SELLER Membership is created atomically with its consumed
        Invitation accepting, matched against the accepting User's
        AuthIdentity(type=phone) — see Invitation-acceptance invariant,
        D56, amended RFC 0012)

Invitation (businessId, phone, role: SELLER,
            status: pending | accepted | revoked | expired)
  ──→ references Business
  (unchanged — kept phone-specific by deliberate design choice, RFC 0012 §3;
   consumed, not referenced, by the SELLER Membership its acceptance
   produces — no ongoing structural link after acceptance beyond the
   historical status flip)
```

**Bounded contexts table:** Identity's "Owns" cell becomes `Business, Capabilities, User, AuthIdentity, BusinessMembership, Invitation`. No "Depends on" cell changes anywhere.

## Sequencing

Same posture RFC 0007/0008 already took: this is target schema/invariant design underneath already-Approved, unmodified UX (`authentication.md`, confirmed zero-change, §6), not new UX design. Once Accepted, `architect`'s next step per the Migration Workflow (D43) is an Architecture Gap Analysis checking implementation-readiness for `AuthIdentity`'s schema, the two amended invariants' corrected resolution paths, and the idempotency extension (§1) — not redesigning `authentication.md`'s already-Approved spec, which needs no redesign. Sequencing/prioritization (when this actually gets built relative to other backlog items) is Main's own standing work, not resolved here.

## Business/Product Decisions flagged, not resolved here

1. **When to actually expose email/Google/Apple in the UI** — the Product Owner's own explicit direction already gates this on future product evidence; this RFC deliberately makes zero product-scope decision about timing, only ensures the schema is ready when that decision is made.
2. **Whether a future second-method sign-up entry point requires an already-authenticated session (closing §5 Invariant C's gap structurally) or permits a cold fresh sign-up (leaving the gap open)** — recommended default stated in §5, but the actual UX shape of "how does a merchant add/use a second method" doesn't exist yet, so this is a launch-gating decision for whichever future RFC activates a second method, not this one.
3. **Whether `Invitation` should ever generalize beyond phone** (§3) — ruled out for now on scope-discipline grounds, but a future business case (e.g., inviting a remote bookkeeper by email who'll never physically receive a phone number handoff) could justify revisiting; named as a candidate future RFC, not decided either way beyond "not now."
4. **Whether `User` ever needs a personal display-name field** — pre-existing open item (RFC 0007 §5 item 2), restated, not resolved by this RFC.

## Open items, named for the Product Owner, not resolved here

1. **§5 Invariant C's duplicate-User gap** — structurally unreachable today, becomes live the moment a second method ships; needs its own resolution (most likely: require an already-authenticated session for every method after the first) before that method's own RFC/build, not before.
2. **`AuthIdentity.identifier`'s exact semantics for `google`/`apple`** (provider subject ID vs. associated email) — documented as a note in this RFC's schema (§1) for whenever those types are actually implemented; no build decision made here since nothing consumes it yet.
3. **The native-app OAuth-to-phone-linking rough edge** (`knowledge-mentor`, §7) — named as a future risk only, relevant solely if/when Nahui ships a native app shell and activates Google/Apple sign-in; not a blocker to this RFC.
4. **Whether `Invitation`'s acceptance-matching resolution (now a join through `AuthIdentity`) needs any code-level index/performance consideration at scale** — a build-time concern for the eventual Architecture Gap Analysis, not a domain-model question this RFC resolves.
