# 0011 — EventAssignment: staff-to-Event scheduling as a new Selling-context aggregate root

Status: Accepted. Promoted to `product/00-foundation/decision-log.md` D60.

## The idea

Lets an OWNER pre-assign a specific SELLER (`BusinessMembership`) to a specific `Event`, ahead of Session-open — a standing roster/schedule, not a selling-time mechanism. Two things follow:

1. **`EventAssignment` — a new aggregate root, Selling context.** The join between `Event` and `BusinessMembership` that records "this Membership is expected to sell at this Event."
2. **A scheduling-conflict handling rule** for the case where the same Membership is assigned to two Events whose date ranges overlap: **warn, don't block**, with reasoning below that distinguishes this from a universal Nahui stance rather than resting on one.

This directly reopens a settled item inside `product/02-ux/product-decisions.md` Q24/Q25 — flagged explicitly in "Why," §0, below, rather than silently superseded.

## What it touches

- `domain-model.md`:
  - **Aggregate roots** — one new entry, `EventAssignment` (schema below), inserted after `Invitation`, before `Venue`, or alongside `EventAllocation` under Selling (either position is fine; it has no ordering dependency on either).
  - **Entity relationships diagram** — gains the addition below (Event ←→ EventAssignment ←→ BusinessMembership).
  - **Bounded contexts table** — Selling's "Owns" cell gains `EventAssignment`, alongside `Event, Session, Sale, SaleItem, Venue, EventAllocation`. No "Depends on" cell change — Selling already depends read-only on Identity (established by `Sale.performedByMembershipId`, D58); this is the same edge, reused, not a new one.
  - **Key mechanisms** — one new subsection, "Event-assignment scheduling-conflict handling" (below).
- `ubiquitous-language.md`, Selling context: new **EventAssignment** entry (below).
- **Not touched:** `architecture-principles.md` (existing #4 is the lens applied, not extended). `information-architecture.md` (no new nav tab — reached entirely through existing Eventos/team-management entry points, not yet designed at this stage — see Sequencing). `Session`, `Event`, `BusinessMembership` schemas — unchanged. `EventAllocation`/`AllocationMovement` — untouched, a different join with a different physical-exclusivity concern; not conflated with this one.

## Why

### 0. This reopens a settled Product Decision — named explicitly, not silently overridden

`product/02-ux/product-decisions.md` Q24/Q25 item 3 (resolved 2026-09-06, Product Owner) explicitly considered and rejected this exact concept: *"SELLER → Event context: session-based selection confirmed sufficient, no OWNER pre-assignment concept added... Residual risk is human mis-selection... judged disproportionate to add OWNER pre-assignment for at Nahui's actual scale."* That resolution is a Product Decision, not an architectural one — it weighed merchant value against complexity at pilot scale, which is the Product Owner's call, not mine to relitigate. This RFC's premise (an OWNER assigning staff to Events) is precisely the concept that resolution declined to build.

This RFC is authored in direct response to the Product Owner's own explicit direction to revisit this, logged verbatim in `product/02-ux/product-decisions.md`'s Q24/Q25 entry ("Amendment, 2026-09-09") before this RFC was drafted — the reversal is knowingly made and independently recorded, not implicit or asserted only by this document. It's named here so the record is honest about what changed and why, not to relitigate it.

**One important scoping fact, confirmed regardless of how that question resolves:** `EventAssignment` does not change how the SELLER's Session actually gets pinned to an Event. Q24/Q25 item 3's own mechanism — `Session.eventId` resolved once at Session-open, immutable thereafter, reusing the Price Override linkage — is untouched by this RFC. `EventAssignment` is roster/scheduling data consulted (at most) to *filter or default* the SELLER's own Session-open picker; it never becomes a new write path for `Session.eventId`, and it creates no new selling-time mechanism. This is also why **the OWNER's own Event-picking at Session-open stays completely unscoped and unaffected** — an OWNER acting in her own Business has never needed to be "assigned" to her own Events, and nothing in this RFC introduces such a gate. `EventAssignment` has a filtering role on the SELLER side, confirmed and scoped by the Product Owner's 2026-09-09 direction (Open Item 1, now Resolved — see below): a SELLER's Session-open Event-resolution narrows from the Business's full active-Event set to only the Events she holds an `EventAssignment` for, with zero assignments resolving to zero Events offered through this path — never a fallback to the Business-wide set.

### 1. `EventAssignment` is a new aggregate root, Selling context — confirmed by `knowledge-mentor` consultation, with one addition

**Schema:**

```
EventAssignment (Selling context, aggregate root)
  - id
  - businessId    (required — same tenant-scoping discipline every
                    other aggregate root carries)
  - eventId       (required, references Event)
  - membershipId  (required, references BusinessMembership — Identity-
                    owned, referenced by ID only, same pattern
                    Sale.performedByMembershipId already established, D58)
  - createdAt
```

**Unique on `(eventId, membershipId)`** — at most one assignment row per Event/Membership pair; assigning the same Membership to the same Event twice is a no-op against the existing row, not a duplicate.

**Why a root, not an internal-only entity nested on either side — the `knowledge-mentor` consultation confirms this against both Project Foundation precedent and general DDD practice.** `architecture-principles.md` #4's internal-only test asks whether a concept has "no identity or lookup outside its parent." `EventAssignment` fails this on two independent query axes, both load-bearing to this feature's own stated intent, not hypothetical:

- **The Event-roster side** — "which Memberships are assigned to this Event" (an OWNER's own staffing view for a given Event), needed independent of any single Membership.
- **The SELLER-resolution side** — "which Events is this Membership assigned to" (the input to any Session-open filtering/defaulting behavior, per Open items #1), needed independent of any single Event.

This is the identical structural signature that promoted `Venue` (D20, grouping by `venueId` independent of any Event), `BusinessMembership` (D44, resolving Businesses independent of any single Business), and `Invitation`/`EventAllocation` (D56/D57, the same "both sides need independent queryability" shape) — the general DDD practice `knowledge-mentor` cites agrees: promote to a root when both sides need independent queryability or the join carries its own state/lifecycle; embedding is reserved for low-cardinality, one-side-only-queried, no-own-state joins.

**Addressing the over-engineering risk directly, not resting solely on precedent.** General practice also correctly warns against promoting a genuinely thin, rarely-queried join into a full root when an array would do — a real failure mode, and worth ruling out explicitly rather than assuming this RFC is exempt because four prior RFCs made a similar call. `EventAssignment` doesn't fall into that trap because it is, by this feature's own design intent, queried independently from both sides at once: the Event-roster view and the SELLER-resolution view are two different consumers with two different access patterns, not one primary consumer with an occasional secondary lookup. An array on either side (`Event.assignedMembershipIds` or `BusinessMembership.assignedEventIds`) would make the *other* side's query require a full scan — the same mirror-image argument RFC 0009 used to reject nesting `EventAllocation` under either `Event` or `Product` alone.

**No status field, plain-delete semantics — a deliberate departure from this Foundation's usual soft-state discipline, justified, not assumed.** Every other Identity/Selling join this Foundation has modeled recently (`BusinessMembership.status`, `Invitation.status`, `EventAllocation.status`) is soft-stated because something downstream depends on the historical row surviving — `Sale.performedByMembershipId` must keep resolving after a revoke (D58); re-invite logic depends on a resolved `Invitation` row persisting (D56). `EventAssignment` has no such downstream dependent: no Sale, SaleItem, or any other write ever references an `EventAssignment` row directly — the actual selling mechanism (`Session.eventId`, `Sale.performedByMembershipId`) is resolved through entirely separate, already-established linkages untouched by this RFC (§0, above). Removing an assignment before the Event happens has no historical-integrity requirement the way revoking a Membership or resolving an Invitation does. Plain delete is therefore the correct, minimal shape here — not an inconsistency with the rest of the Foundation, but a case where the soft-state justification genuinely doesn't apply.

### 2. Scheduling-conflict handling: warn-with-override, distinguishing "correct for this shape" from "a universal Nahui stance" — per `knowledge-mentor` consultation and a direct re-read of D17/D53

**The question:** if an OWNER assigns the same Membership to two Events whose date ranges overlap, should the write hard-block or warn-with-override?

**General practice supports warn-with-override here, but only for reasons specific to this conflict's shape.** Staffing/resource-booking systems default to warn-with-override, reserving hard blocks for cases with a genuine safety/compliance constraint, a strict physical-exclusivity invariant, or an explicit zero-tolerance policy. None of those apply to `EventAssignment`: it carries no safety concern, and — critically — the one constraint that *does* need hard, non-negotiable enforcement in this domain (a physical unit of stock can't be in two places at once) is already handled by a completely different mechanism, `EventAllocation`'s physical-location-exclusivity invariant (D57), which is untouched by and unrelated to this RFC. `EventAssignment` conflicts are a people-scheduling question, not a resource-exclusivity one.

**The real counter-precedent, read directly rather than assumed away: D17 was a hard block, later reversed by D53.** `decision-log.md` D17 (*"a Business may not create or activate an Event whose date range overlaps an already-scheduled-or-active Event"*) shows Nahui has hard-blocked an overlap before, so "warn-not-block" cannot be asserted as this project's universal stance without contradiction. Reading D17's and D53's own text directly (not by summary):

- **D53's own reading of D17's intent** (not D17's own wording — D17 itself never uses "single-actor" framing): *"D17's restriction was never a business-capacity rule... it existed solely to keep Home's single-actor resolution logic unambiguous."* **D17's own text, verbatim**, names its own removal condition: *"supporting concurrent Events belongs to a future multi-employee capability... could be built whenever prioritized."*
- **D53's own rationale, verbatim:** *"D17's restriction was never a business-capacity rule... it existed solely to keep Home's single-actor resolution logic unambiguous."* Once `User`/`BusinessMembership` (D44) and the Q24/Q25 multi-seller design existed, "which Event does an idle Seller's Home screen resolve to" became resolvable another way (per-Session, per-Membership, per Q24/Q25 item 3) — so D17's block was lifted, not because overlap itself stopped mattering, but because the *system-side ambiguity* it existed to prevent was resolved by a different mechanism entirely.

**Applying that distinction to `EventAssignment`'s own conflict shape, not inheriting either precedent by default.** D17/D53 together show the deciding question was never "is overlap tolerable," but "does overlap create an unresolvable system-side ambiguity, or is it a business judgment call the acting party is positioned to make." `EventAssignment`'s conflict — the same Membership double-assigned to two overlapping Events — creates no comparable system-side ambiguity: `Session.eventId` is still resolved explicitly, once, per Session (§0, above), so nothing downstream needs to guess which Event a double-assigned Membership "really" belongs to at any given moment. What's left is a legitimate business judgment call the assigning OWNER is positioned to make directly — a real, unremarkable case exists (a family member or trusted helper working two nearby back-to-back Events the same weekend) alongside a genuine mistake case (a double-booking she'd want to catch). That's exactly the shape general staffing practice defaults to warning on, not blocking.

**Conclusion, stated as a claim about this conflict shape, not a house style:** warn-with-override is correct for `EventAssignment` specifically because its conflict has no safety/compliance/physical-exclusivity constraint and no system-resolution ambiguity for a hard block to protect — not because Nahui "prefers" warn-over-block as a rule. D17 remains the correct precedent for a case that *does* have that ambiguity; this one doesn't.

**Mechanism (schema-level only — the actual warning UI is out of scope for this RFC, see Open items #3):** at `EventAssignment` write time, check for any existing `EventAssignment` row for the same `membershipId` whose `Event.startDate`/`endDate` overlaps the new assignment's `Event` date range (the same date-range comparison D17/D53's own mechanism already used, reused, not reinvented). A hit surfaces a warning; the write is never rejected on that basis alone.

## Key mechanisms (for `domain-model.md`, once promoted)

> **Event-assignment scheduling-conflict handling.** Assigning a Membership to an Event whose date range overlaps an Event she's already assigned to never blocks the write — a detected overlap surfaces as a warning the assigning OWNER may override, never a hard rejection. This is a business-judgment case, not a system-resolution-ambiguity case (contrast `decision-log.md` D17, reversed by D53) and not a physical-resource-exclusivity case (contrast `EventAllocation`'s physical-location-exclusivity invariant, D57) — neither of the two conditions that justify a hard block elsewhere in this Foundation applies here.

## Ubiquitous-language addition (for `ubiquitous-language.md`'s Selling context section, once promoted)

> **EventAssignment** — a standing record that a specific `BusinessMembership` is expected to sell at a specific `Event` (Selling context), own aggregate root. Unique on `(eventId, membershipId)`. Not nested inside Event or BusinessMembership — needed independently of either to resolve "who's assigned to this Event" and "which Events is this Membership assigned to." Plain-delete: unassigning removes the row outright, since no downstream write depends on a removed assignment surviving (contrast `BusinessMembership`/`Invitation`/`EventAllocation`'s soft-state discipline, each justified by a real historical dependent this concept has none of). Assigning a Membership to two date-overlapping Events is a warn-with-override case, never a hard block.

## Entity relationships diagram addition

```
Event
  ├─ EventAssignment (root; businessId, eventId, membershipId, createdAt)
  │    unique on (eventId, membershipId), referenced independently by
  │    eventId (Event-roster view) and by membershipId (SELLER-resolution
  │    view) ──→ references BusinessMembership (Identity-owned, by ID
  │    only — same pattern as Sale.performedByMembershipId, D58)
  └─ ... (Price Override, EventAllocation, Session — unchanged)
```

## Sequencing

Target schema/invariant design ahead of UX design, not formalizing an already-Approved spec — unlike RFC 0008/0009, no `product/02-ux/` document has designed a staff-assignment surface yet (confirmed: no reference to it in `events.md` or `settings.md`'s "Tu equipo" section). If Accepted, next step is `ux-designer`, not an Architecture Gap Analysis against existing Approved UX — this RFC only clears the way for that design to start, it doesn't presuppose one.

## Open items, named for the Product Owner / Architect, not resolved here

0. **Confirmation that reopening Q24/Q25 item 3 is genuinely wanted, not merely disclosed.** Recorded in `product/02-ux/product-decisions.md`'s Q24/Q25 entry ("Amendment, 2026-09-09") before this RFC's persistence, per `reviewer`'s finding that this authorization must be independently checkable, not asserted only by this document's own §0.
1. **Product Decision — the zero-assignment SELLER fallback.** Once `EventAssignment` exists, what does a SELLER's Session-open Event picker show when she has *no* `EventAssignment` rows at all (never assigned to anything, or every assignment already used/expired)? Two real options: (a) fall back to today's Q24/Q25 item 3 behavior — she sees every currently active/scheduled Event, same as an OWNER would; or (b) she sees nothing until an OWNER assigns her something. This changes what a real merchant experiences and isn't derivable from the domain model alone — it's the Product Owner's call, not architecture's.

   **Resolved, 2026-09-09 (Product Owner) — option (b), refined.** Her exact direction: *"For decision #2, a SELLER with no active EventAssignment should not see or choose from all active Events. Preserve Quick Sale if permitted by the existing SELLER role, but Event access should come only from explicit OWNER assignment."* This rejects option (a) outright — no fallback to the Business's full active-Event set — and confirms option (b), refined to a specific zero-state: **zero `EventAssignment` rows (or every assigned Event no longer active) resolves to zero Events offered through this path — never a fallback, and never a dead end either.** "Preserve Quick Sale if permitted by the existing SELLER role" is satisfied as a finding, not a new mechanism: `product-decisions.md` Q24/Q25's Permission table already lists "open/close own Session" as an ungated SELLER capability, and `home.md` §2's Quick Session idle-state branch (§3.3/§3.4) is already role-agnostic and unconditional whenever no qualifying Event exists for the acting Membership — reached today by any merchant, either role, whenever the Business has zero active Events. This RFC adds no new permission check to that branch; it only narrows what feeds *into* the check ahead of it (below).

   **SELLER Session-open Event-resolution logic (rewrite of `home.md` §2 step 2, scoped to SELLER only — the OWNER's Business-wide test is unchanged, per Open Item 2):**

   ```
   2. Role-scoped qualifying-Event check, and no Session currently active
      for this device's own acting Membership:

      - OWNER: at least one Event with status = active, Business-wide
        (unchanged from today — `product-decisions.md` Q24/Q25 item 3; no
        `EventAssignment` gate applies to an OWNER's own Event-picking,
        per this RFC's Open Item 2).

      - SELLER: at least one Event with status = active for which an
        `EventAssignment` row exists with `membershipId` = this device's
        own acting Membership. The Business's full active-Event set is
        never consulted for a SELLER through this path. Zero qualifying
        rows (no assignment ever made, or every assigned Event no longer
        active) means this check fails outright — falls through to step 3
        exactly as the zero-active-Event case already does today; no
        separate zero-state branch, no fallback to the Business-wide set.

      2a. Exactly one qualifying Event (role-scoped as above) → unchanged:
          auto-resolve to that Event's "Continuar Día N" (`home.md` §3.6).

      2b. 2+ qualifying Events (role-scoped as above) → unchanged
          mechanism, narrowed input: `home.md` §3.6b's "Elegir evento"
          picker, populated from the role-scoped set defined above rather
          than the Business's full active-Event list. For a SELLER this
          is now a list of Events she's been assigned to, not every Event
          currently active in the Business.
   ```

   This is a strict narrowing of what this Open Item originally framed as option (a) — "she sees every currently active/scheduled Event, same as an OWNER would" — which is rejected outright, not adopted with modification. Option (b) is confirmed, refined specifically to mean **zero Events offered through the Event-picker path**, not "no way to sell": she still reaches Quick Session, unaffected, through the pre-existing, already-Approved step-3 idle-state branch. This reuses the identical `home.md` §3.6/§3.6a/§3.6b machinery Q24/Q25 already established, with a narrowed input source for one role only — no new picker, mechanism, or screen.

   **Routed to `ux-designer`:** (a) `home.md` §2/§3.6b amendment implementing the role-scoped step 2 above — §3.6b's own wireframe/copy needs no change beyond its data source (same screen, same interaction, per-row `Venue.displayName` + Día N as already specified); (b) confirm the zero-assignment SELLER experience is `home.md`'s existing Quick Session idle state (§3.3/§3.4, "Iniciar Sesión Rápida," already Approved, already role-agnostic) with no new screen or copy variant required — but this is now a newly-*reachable* state combination that didn't previously exist (the Business has 1+ Event active elsewhere while this SELLER's own idle screen shows none of them), and whether that idle state needs any passive awareness line, or is correctly silent (matching "preserve current Quick Sale behavior" literally), is a UX call, not an architecture one.
2. **Scoping confirmation — the OWNER's own Event-picking is unaffected.** Stated in §0 above, restated here so it isn't missed: an OWNER opening her own Session continues to pick from any currently active/scheduled Event exactly as Q24/Q25 item 3 already established, with no `EventAssignment` gate of any kind. This RFC introduces no change to OWNER-side selection.
3. **The scheduling-conflict warning's actual UX** (copy, timing — at assignment-creation time vs. surfaced later on a roster view) is not designed here — routed to `ux-designer` once/if this RFC and item 1 above are resolved.
4. **Whether `EventAssignment` creation should be gated by `BusinessMembership.status=active`** (an OWNER shouldn't be able to assign a revoked Membership) is assumed to reuse the existing Membership authorization gate (D55/D56) rather than needing a new mechanism, but isn't spelled out as its own write-time rule anywhere yet — flagged so it isn't silently assumed.
