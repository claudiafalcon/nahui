# Stage 7 — Backend Integration: Inventory, Selling, Events, Results

**Status: In progress, started 2026-09-13.** Working file per this folder's own knowledge-architecture discipline — holds what every dispatch touching this initiative actually needs, reduced to a pointer once complete (see `context/q24-q25-first-slice.md` for the precedent).

## What this is

Product Owner-directed: move the actual core product (Inventory, Selling/Sessions/Sales, Events, Results) off client-side/localStorage mock state onto the real Supabase Postgres backend, so two real pilot merchants' data survives browser clears/device switches and is visible to the business owner regardless of device. Authentication (WhatsApp OTP, Email, Google) already completed this migration earlier the same day — this is the much larger second half.

`architect`'s full Gap Analysis (2026-09-13) is the authoritative design reference — real Postgres schema for every aggregate, RLS policy design, sequencing, migration strategy, client-architecture changes. Not restated here in full; this file tracks status, decisions, and what changed as work actually lands.

## Phase plan (architect's sequencing, by real technical dependency)

- **Phase 0 — Identity persistence** (`businesses`, `business_memberships`, `auth_identities`, `invitations`, `create_business_with_owner`/`accept_invitation` RPCs, RLS). Not originally named in the Product Owner's stated scope but structurally required — nothing else has a real `business_id`/`auth.uid()` to scope against without it. **Dispatched to `builder`, 2026-09-13.**
- **Phase 1 — Inventory** (`products`, `lots`, `inventory_entries`, `inventory_units`, `commit_lot`, the `available→reserved` CAS pattern). Not started.
- **Phase 2 — Selling core** (`venues`, `events`, `price_overrides`, `sessions`, `sales`, `sale_items`). The highest-risk, highest-frequency phase — the actual `<3s` registration bar, `company/backlog.md` #1. Not started.
- **Phase 2b — EventAllocation/AllocationMovement** (depends on Phase 1 + Phase 2's `Event`). Not started.
- **Phase 2c — EventAssignment** (depends on Phase 0 + Phase 2's `Event`, can run parallel to 2b). Not started.
- **Phase 3 — Results/Resultados** (read-side only, once Phases 1-2 are real). Not started.
- **Customers/Claims (Loyalty-claim)** — included in this same Supabase project per Product Owner decision (2026-09-13), with strict deny-by-default RLS (Merchant App never reads raw Customer/Claim data, per `domain-model.md`'s existing rule). Not sequenced yet — lower priority, not blocking Phases 0-3.

## Decisions made, 2026-09-13 (Product Owner)

- **Existing local pilot data: clean cutover, no migration tool.** Confirmed by the Product Owner directly — the data only ever lived client-side, Nahui never had it centrally, so there's nothing to migrate from Nahui's own side even in principle.
- **Loyalty-claim's `customers`/`claims` tables: included now, same Supabase project** (not deferred, not a separate backend) — simplest choice at this scale, with the Merchant-App-never-reads-raw-Customer-data rule enforced via RLS, not just app-level convention.
- **Phone-OTP → real Supabase Auth session bridging: deferred, explicitly non-blocking.** `knowledge-mentor` confirmed there's no direct Admin API "mint a session" call — the documented pattern (`generateLink`+`verifyOtp` server-side) is unverified for phone-only/no-email users, and a possibly-simpler alternative (Supabase's "Send SMS Hook," letting the native phone-auth flow issue sessions automatically while still routing delivery through Twilio/WhatsApp) surfaced but needs real evaluation against why the current custom-Edge-Function approach was built instead. **Not resolved.** Deliberately not blocking Phase 0+, since phone/WhatsApp itself is separately blocked on Meta Business Verification (`company/business-decisions.md` Q19) and isn't going live for real users regardless — Phase 0 onward is being built to work correctly for Email/Google-authenticated merchants first, which is what real pilot users will actually use meanwhile.
- **RLS permission model confirmed against `product/02-ux/product-decisions.md`'s Q24/Q25 table** (not just the 3 OWNER-only actions `architect`'s own gap analysis initially named from the documents it read): OWNER — Business identity/Configuración, Catalog/Product management, Lot receiving/tagging, Event create/edit/pricing, allocate/replenish/reallocate/reconcile, invite/manage staff, business-level Resultados. SELLER — open/close own Session, register Sales, read sellable Products/prices (ungated), own current-session activity only. This is the authoritative permission table for every RLS policy across all phases, not just Phase 0's.

## Review-cadence policy for this initiative (Product Owner decision, 2026-09-13 — persisted here specifically so it isn't lost across a long session)

**`reviewer` runs after every phase, no exception** — cheap (reads code/schema/RLS directly, no live interaction needed) and the security stakes (RLS mistakes mean one Business's data leaking into another's) make skipping it never worth the time saved.

**`merchant-user-tester` does NOT run after every phase** — unlike `reviewer`, its value depends on there being a real, walkable journey; running it against a partially-backend-integrated app mostly just hits intentional "not built yet" walls, not real defects. Scoped to exactly two checkpoints instead of one-per-phase:

1. **After Phase 1 (Inventory) + Phase 2 (Selling) are both done** — the moment a merchant can do the actual core journey (register a Sale against real inventory) for real, which is `company/CLAUDE.md`'s own Core Thesis, priority #1. First real checkpoint.
2. **After Phase 2b/2c (Events) + Phase 3 (Results) are also done** — the complete, full journey, once, at the end.

Not run after Phase 0 alone (too narrow — nothing to meaningfully walk beyond sign-up, which was already covered by today's own real Google/Email sign-in build). Not deferred to "only once everything is 100% done" either — waiting the full five phases risks stacking bugs on an unvalidated foundation, the same lesson `company/CLAUDE.md`'s own Experience Validation section ("Coverage is a gate, not a queue") already encodes for UX work generally, applied here to backend-integration risk specifically.

## Open items, not resolved

- Phone-OTP session bridging (above) — needs either the `generateLink`/`verifyOtp` pattern verified for phone-only users, or the Send SMS Hook alternative evaluated, before phone/WhatsApp can serve real backend-integrated data. Not blocking current phases.
- `auth_identities` population mechanism for email/google (a DB trigger off `auth.identities`, vs. a client-side upsert after sign-in) — left to `builder`'s judgment in the Phase 0 dispatch, not fixed by `architect`'s own analysis.
- "One active Session per Membership" as a hard DB constraint — `architect` flagged this as inferred from `store.tsx`'s own `myActiveSession` selector, never stated as a named invariant in `domain-model.md`. Needs confirmation before Phase 2 makes it a real unique index.
- `Product.active` field — `decision-log.md` D55 cites it as precedent but it doesn't exist in the current `types.ts` `Product` interface. Minor, needs a quick check before Phase 1 schema is finalized.
