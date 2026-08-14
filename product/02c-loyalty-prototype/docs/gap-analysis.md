# Architecture Gap Analysis — Customer Loyalty Registration, First React Implementation

Run by `architect` ahead of this folder's first build, against
`product/02-ux-loyalty/customer-loyalty-registration.md` (Approved). Every
question below is classified as an Architecture Decision — how to
implement an already-Approved UX spec — not a Product or Business
question; nothing here redesigns the approved spec itself.

---

## 1. Core question — mock resolution strategy

**Ruling: build this as a fully self-contained mock.** Its own local
`Customer`/`Claim`/resolved-Sale-existence state, its own small set of
seeded demo Claim Token values — **zero runtime coupling** to
`product/02c-high-fidelity-prototype/`. This isn't a stopgap; it's the
option the Foundation itself already commits to at this stage:

- `product/02c-high-fidelity-prototype/BACKLOG.md` item 10 (D.5, Cross-app
  Loyalty data bridge) states plainly this prototype has no backend and no
  cross-app integration mechanism of any kind yet, and that a real bridge
  is "likely Stage 7-adjacent" — not this stage.
- The two apps are different deploy targets on different origins in the
  real system (D38, spec §0) — browser storage isn't shareable between them
  even incidentally. Building on any accidental same-origin dev-server
  co-location would quietly reintroduce the exact coupling D38 exists to
  prevent.
- `mintClaimToken` in the Merchant prototype's `store.tsx` already takes
  the mirror-image posture: deliberately non-cryptographic, since "nothing
  downstream in this prototype validates or looks the token up." This
  build is the symmetric posture on the other side of that same
  intentionally-unbuilt seam.

**Foundation-consistency check — does local mock `Customer`/`Claim` writes
contradict D35's aggregate ownership rules?** No. D35's ownership rule
governs the target, real system's write-authority graph
(`architecture-principles.md` #6) once these are real, separately-deployed
services — it isn't a statement that no other codebase may hold local,
disclosed mock data during pre-integration prototyping. The Merchant
prototype already does exactly this for `Sale`/`SaleItem`/`InventoryUnit`.
A zero-import, zero-network-call prototype has *less* of a dependency edge
than the target design's own read-only Loyalty-claim→Selling grant (D22) —
there's nothing to violate.

**Refinement, not a deviation:** don't reuse the Merchant prototype's
actual TypeScript types or `mintClaimToken` algorithm by import. Define
this prototype's own minimal local types, shaped to match
`domain-model.md`'s documented fields, populated with seed fixtures
covering: a malformed/expired token (→3.3), a fully-already-claimed token
(→3.4), a valid multi-item token for a brand-new email (→3.6→3.10), and a
valid token for an email that already matches a seeded Customer at that
Business (→3.11). A network-failure toggle for 3.9/3.12 doesn't need its
own token.

---

## 2. Domain-model field completeness

**`Customer` — complete as specified.** `id`, `businessId`, `email`
(required), `ageRange`/`gender` (optional), `purchaseCount`,
`lifetimeSpend`, `currentCycleProgress`, `completedCyclesCount`, plus the
`(businessId, email)` dedup invariant (D37). `maskedEmail` and
`lastRewardConfirmedAt` play no role in this customer-facing surface.

**`Claim` — conceptually complete in prose, never given an explicit field
table before this build.** Formalized: **`Claim { id, businessId,
customerId, saleItemId, claimedAt }`.** `businessId` denormalized for query
convenience, matching every other aggregate root's own Business-scoping
discipline. Recorded in `decision-log.md` (plain entry, non-RFC — same
class as D37's own dedup-rule addition).

**Internal-only fixture need:** each mock `SaleItem` needs a `pricePaid`
value (never rendered to the customer) purely so `Customer.lifetimeSpend`
can be incremented correctly when a Claim resolves.

---

## 3. Write-path strategy

**Customer create-or-update** — the write function performs the
`(businessId, email)` lookup itself, every time, never trusting a
UI-computed "already know she's new/returning" flag from an earlier read.

**Claim, one per still-unclaimed SaleItem** — both write triggers (§2 step
3's combined lookup+write, §2 step 5's post-"Listo" write) resolve to the
same shape: create one Claim per not-yet-claimed SaleItem in the resolved
Sale, link to the found-or-created Customer, increment counters by exactly
*that submission's* new Claims, never the Sale's full original count.

**Idempotent retry — reuse the *pattern*, not a separate utility.** No
standalone idempotency-key utility exists anywhere in the Merchant
prototype to import. What exists, and what to reuse, is the pattern
`completeOnboarding` already establishes: idempotency via
existing-state-lookup at write time, not a client-key-vs-server-ledger
mechanism (there's no real server). The write function re-runs the dedup
lookup on every attempt, including retries; because a Claim removes its
SaleItem from the "still-unclaimed" set the moment it's created, a retry
naturally finds zero remaining unclaimed items if the original attempt
already landed — the same mechanism that resolves §2 step 2's
"already-claimed" check handles same-device retry-duplication for free.
Don't build a separate client-held random idempotency-key/ledger.
Separately, disable "Continuar"/"Listo" while a write is in flight — an
ordinary UI-debounce concern, not a domain-idempotency one.

---

## 4. Project setup

**New sibling root, `product/02c-loyalty-prototype/` — confirmed.**
Mirrors D38's own reasoning exactly (format axis `02c` = pipeline
stage/fidelity tier, vs. surface axis `-loyalty-prototype` = different,
separately-deployed surface, same pipeline stage as
`02c-high-fidelity-prototype`). A letter-suffix name (e.g. `02d-...`) would
incorrectly imply a new fidelity tier of the Merchant-app pipeline instead.

**Scope boundaries, stated explicitly:**
1. Never import from `product/02c-high-fidelity-prototype/src/` — no
   shared types, components, or domain-layer code.
2. Shared tooling choices (Vite/TypeScript/React) are fine; a shared
   workspace/monorepo package that runtime-links the two is not.
3. Don't reflexively import `DESIGN-SYSTEM.md`'s tokens/components
   wholesale — this surface's entire trust posture depends on not reading
   as merchant-app chrome (`ui-designer`'s/`brand-guardian`'s call to make
   deliberately, not a ruling here).
4. URL-shape continuity (e.g. a `/c/:token` route, mirroring the Merchant
   prototype's `https://loyalty.nahui.mx/c/<claimToken>` QR content) is a
   nice-to-have for legibility, not a requirement — nothing validates the
   token's actual derivation across origins in this phase.

---

## 5. Two spec-named open items — neither blocks this build

- **§8 item 1 (Claim Token validity window)** — irrelevant to a
  client-only mock; "expired" is simply one hardcoded seed scenario
  resolving to 3.3, identically to malformed. Stays open for real token
  signing (Stage 7-adjacent).
- **§8 item 6 (concurrent-claim race)** — structurally unreachable in a
  single-browser, client-only mock with no shared backend across
  sessions/devices. No new screen state or write-path branch needed. Stays
  open, deferred to a real backend.

Everything else in the spec — the two-step form shape, "No, gracias," the
shared Guardando… state, the terminal states — is implementation-ready as
written. No RFC triggered anywhere in this analysis.
