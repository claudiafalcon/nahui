# Supabase — real WhatsApp OTP delivery + Identity/Inventory persistence layers

Stage 7 Backend Integration. Three passes so far:
- **Phone/OTP authentication** (see `company/business-decisions.md` Q14/Q15,
  `product/00-foundation/decision-log.md` D44) — replaces the client-side
  "any 6-digit code works" mock previously in `src/domain/store.tsx`'s
  `verifyOtp`.
- **Identity persistence layer, Phase 0** (`decision-log.md` D44/D55/D56/D62/
  D63/D64, `product/99-rfc/0012-auth-identity-multi-method.md`,
  `product/99-rfc/0013-invitation-token-based.md`) — real `businesses`/
  `business_memberships`/`auth_identities`/`invitations` tables + RLS + the
  `create_business_with_owner`/`accept_invitation` SECURITY DEFINER RPCs.
  The `business_id`/`auth.uid()` scoping every later phase (Inventory,
  Selling, Events, Results — Phase 1-3) depends on. `store.tsx`'s
  `completeOnboarding` now calls `create_business_with_owner` for real;
  `createInvitation`/`acceptInvitation`/`declineInvitation` are **not** wired
  yet — see that migration's own header comment and this pass's build report
  for why (the prototype's current Invitation UI/domain type is still
  phone-keyed, RFC 0013's own token-keyed redesign hasn't had its UI
  Migration-Workflow pass yet).
- **Inventory persistence layer, Phase 1** (`context/stage-7-backend-
  integration.md`'s "Phase 1 design summary," `architect`, 2026-09-13) —
  real `suppliers`/`products`/`lots`/`inventory_entries`/`inventory_units`/
  `nfc_tags` tables + RLS + the `commit_lot`/`update_product_price`/
  `update_product_photo`/`assign_tag_to_next_pending_unit` SECURITY DEFINER
  RPCs. `store.tsx`'s `commitLot`/`editPrice`/`setProductPhoto`/
  `assignTagToNextPendingUnit` now call these for real, closing the
  idempotency-key gap `BACKLOG.md` §F previously named for all four.
  Selling/Session/Sale/EventAllocation (Phase 2/2b/2c) are untouched —
  `inventory_units` deliberately gets no UPDATE policy at all in this phase.
- **Inventory persistence layer, Phase 1 follow-up — barcode write**
  (`decision-log.md` D65, `ui-designer`, 2026-09-13) — closes Phase 1's own
  open item 4. `20260913030000`/`20260913031000` added the `barcode` column
  and its partial unique index but never actually wrote it on `commit_lot`'s
  `new`-line insert; `20260913032000_inventory_barcode_write.sql` fixes
  that (writes `barcode` when present, catches a genuine collision and
  re-raises it as `barcode_already_registered`). Found and fixed while
  building `inventory.md` §3.8b-§3.8e / `home.md` §3.9-§3.9c's UI —
  disclosed here rather than silently assumed working, per this project's
  own "check directly, don't assume" discipline. **Pushed to the real
  hosted project** — see the checklist's item 12 below (discovered already
  applied during the Phase 2 session, correcting this file's own earlier
  "not yet pushed" claim, which was accurate only for the specific
  credential-less session that first wrote it).
- **Selling persistence layer, Phase 2** (`context/stage-7-backend-
  integration.md`'s "Phase 2 design summary," `architect`, 2026-09-13,
  `decision-log.md` D66) — real `venues`/`events`/`price_overrides`/
  `sessions`/`sales`/`sale_items` tables + RLS + the new `caller_membership_id`
  RLS helper + ten SECURITY DEFINER RPCs: `create_event`/`cancel_event`/
  `set_price_override`/`start_session`/`add_item_to_sale`/
  `add_item_to_sale_by_tag`/`remove_sale_item`/`cancel_sale`/`finalize_sale`/
  `close_session`. `store.tsx`'s `createEvent`/`cancelEvent`/
  `setPriceOverride`/`startSession`/`addItemToSale`/`addItemToSaleByTag`/
  `removeSaleItem`/`cancelSale`/`finalizeSale`/`closeSession` now call these
  for real, replacing the previous client-side-only writes. `add_item_to_sale`
  is the `<3s`-critical write (`company/backlog.md` #1) — plain Business-wide
  FIFO only (`FOR UPDATE SKIP LOCKED`, reusing `inventory_units_fifo_idx`),
  with `EventAllocation`-aware selection deliberately not consulted here
  (Phase 2b, confirmed out of scope three independent ways). `EventAllocation`/
  `AllocationMovement`/`EventAssignment` code is untouched.
- **EventAssignment persistence layer, Phase 2c** (`context/stage-7-backend-
  integration.md`'s "Phase 2c design summary," `architect`, 2026-09-13,
  `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60) — real
  `event_assignments` table + RLS + the `assign_to_event`/
  `unassign_from_event` SECURITY DEFINER RPCs. `store.tsx`'s
  `createEventAssignment`/`removeEventAssignment` now call these for real,
  replacing the previous client-side-only writes — staff-to-Event
  scheduling, letting an OWNER assign/unassign a SELLER to a specific
  Event. The scheduling-conflict warning (`hasSchedulingConflict`,
  `selectors.ts`) needed no new RPC at all — a pure client-side computation
  over data the RLS design already grants. Does not touch
  `EventAllocation`/`AllocationMovement` (Phase 2b, separate, not-yet-
  designed phase).

**Status as of 2026-09-13:** phone/OTP path — real Supabase project
created, linked, migration pushed, and both Edge Functions deployed and
ACTIVE (see checklist below). Not yet live-tested end to end — still
blocked on Twilio/WhatsApp sender setup (steps 2-3); WhatsApp production
verification is separately non-blocking for the pilot as a whole now
(`company/business-decisions.md` Q19), since Google/Email cover the working
sign-up paths in the meantime. Google and Email sign-in — **live and
confirmed working in production** on `nahui.app` (Vercel env vars set,
Resend SMTP configured, Google OAuth Client configured). Identity
persistence layer (Phase 0) — migration SQL applied to the real hosted
project via `supabase db push` (checklist items 8-10), `reviewer`-verified
across two rounds of fixes. Inventory persistence layer (Phase 1) —
migration SQL applied to the real hosted project via `supabase db push`
(checklist item 10), client wiring complete (`store.tsx`), `tsc -b`/
`vite build` both clean; `reviewer`-verified (checklist item 11) — 1 Blocker
closed client-side, 2 Important findings closed by
`20260913033000_inventory_persistence_layer_fixes.sql`, **pushed**
(checklist item 13, discovered already applied during the Phase 2 session).
Inventory persistence layer, Phase 1 barcode-write follow-up —
migration SQL written (`20260913032000_inventory_barcode_write.sql`),
client wiring complete, `tsc -b`/`vite build` both clean; **pushed** to the
real hosted project (checklist item 12, discovered already applied during
the Phase 2 session) — not independently `reviewer`-verified.
Selling persistence layer (Phase 2) — migration SQL applied to the real
hosted project via `supabase db push` (checklist item 14), client wiring
complete (`store.tsx`, ten call sites across `Selling.tsx`/`NuevoEvento.tsx`/
`AdjustPrices.tsx`/`EventDetail.tsx`/`HomeScreen.tsx`), `tsc -b` clean;
**`reviewer`-verified** (checklist item 15) — 1 Blocker + 3 Important
findings, all closed by `20260913041000_selling_persistence_layer_fixes.sql`
(SQL) and `Selling.tsx`/`store.tsx` (client). `tsc -b`/`npm run build` both
clean after the fix round; migration pushed (checklist item 16).
EventAssignment persistence layer (Phase 2c) — migration SQL applied to the
real hosted project via `supabase db push` (checklist item 17), client
wiring complete (`store.tsx`, one call site,
`PersonalParaEsteEvento.tsx`), `tsc -b`/`npm run build` both clean. Not yet
`reviewer`-verified.

## What's here

```
supabase/
  config.toml                        — Supabase CLI project config (placeholder project_id)
  migrations/
    20260910000000_create_otp_attempts.sql              — the otp_attempts table
    20260913000000_identity_persistence_layer.sql       — businesses/business_memberships/
                                                            auth_identities/invitations + RLS +
                                                            create_business_with_owner/accept_invitation
    20260913010000_identity_persistence_layer_fixes.sql — reviewer round-1 fixes (Phase 0)
    20260913020000_identity_persistence_layer_fixes2.sql — reviewer round-2 fixes (Phase 0)
    20260913030000_inventory_persistence_layer.sql      — suppliers/products/lots/inventory_entries/
                                                            inventory_units/nfc_tags + RLS +
                                                            commit_lot/update_product_price/
                                                            update_product_photo/
                                                            assign_tag_to_next_pending_unit
    20260913031000_inventory_persistence_layer_fixes.sql — commit_lot return-shape fix (Phase 1,
                                                             own-pass correction, not a reviewer
                                                             finding — see its own header)
    20260913032000_inventory_barcode_write.sql            — commit_lot now actually writes
                                                             products.barcode + collision
                                                             handling (D65, ui-designer,
                                                             own-pass correction — see its
                                                             own header). PUSHED (discovered
                                                             already applied, item 12).
    20260913033000_inventory_persistence_layer_fixes.sql — reviewer fix round 1 (Phase 1):
                                                             Important findings 1-2 — a
                                                             partial index matching
                                                             assign_tag_to_next_pending_unit's
                                                             actual query shape (business_id +
                                                             status='available' + received_at),
                                                             and correcting the products.photo
                                                             column comment to "provisionally
                                                             deferred, pending architect
                                                             reconfirmation" (the accompanying
                                                             Blocker finding — commitLot()'s
                                                             client wiring never preserving a
                                                             stable idempotency key across a
                                                             retry — was a client-only fix, see
                                                             store.tsx/RegisterMerchandise.tsx/
                                                             OnboardingFlow.tsx). PUSHED
                                                             (discovered already applied,
                                                             item 13).
    20260913040000_selling_persistence_layer.sql          — venues/events/price_overrides/
                                                             sessions/sales/sale_items + RLS +
                                                             caller_membership_id +
                                                             create_event/cancel_event/
                                                             set_price_override/start_session/
                                                             add_item_to_sale/
                                                             add_item_to_sale_by_tag/
                                                             remove_sale_item/cancel_sale/
                                                             finalize_sale/close_session.
                                                             PUSHED 2026-09-13.
    20260913041000_selling_persistence_layer_fixes.sql     — reviewer fix round 1 (Phase 2):
                                                             Important findings 1-3 —
                                                             start_session/set_price_override
                                                             now check p_event_id/p_product_id
                                                             belong to p_business_id; seven
                                                             dead idempotency-cache writes
                                                             (add_item_to_sale x3,
                                                             add_item_to_sale_by_tag x3,
                                                             finalize_sale x1) removed, matching
                                                             assign_tag_to_next_pending_unit's
                                                             precedent; cancel_sale/close_session
                                                             now take an explicit p_sale_id/
                                                             p_session_id target instead of
                                                             resolving "whatever is open/active"
                                                             implicitly (the accompanying Blocker
                                                             finding — Selling.tsx's per-Product
                                                             idempotency key silently conflating
                                                             a retry with a genuine second tap
                                                             still in flight — was a client-only
                                                             fix, see Selling.tsx's
                                                             addItemPendingRef). PUSHED
                                                             2026-09-13.
    20260913050000_event_assignment_persistence_layer.sql  — event_assignments + RLS +
                                                             assign_to_event/
                                                             unassign_from_event.
                                                             PUSHED 2026-09-13.
  functions/
    send-otp/index.ts                — generates + WhatsApp-sends a code
    verify-otp/index.ts              — checks a submitted code, single-use
    _shared/cors.ts, _shared/otp.ts  — shared helpers (both functions)
```

## Manual checklist (Product Owner — cannot be done on her behalf)

1. ~~**Create a Supabase project**~~ **DONE.** Project ref `exvzsfnwogmyxfmaffxn`.
2. **Create a Twilio account** (twilio.com) and, inside it, **register a
   WhatsApp Business Sender through Meta Business Manager** — this is
   Twilio's standard WhatsApp onboarding flow (business verification
   through Meta, not a Twilio-side approval). Note the resulting Account
   SID, Auth Token, and the approved WhatsApp sender number. **NOT YET STARTED.**
3. **Create and get approved one WhatsApp message template** via Twilio's
   Content Template Builder (or directly in Meta Business Manager) for the
   OTP message itself — e.g. "Tu código de verificación de Nahui es
   {{1}}." WhatsApp Business Platform requires an approved template for
   any business-initiated message (which every OTP send is, by
   definition — there's no prior customer message opening a session
   window). Note the resulting Content SID (`HXxxxxxxxx…`). **NOT YET STARTED.**
4. **Set the following as Supabase secrets** (`supabase secrets set
   KEY=value`, run from this folder once linked — see step 6):
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM` — the approved sender number, E.164 (e.g. `+14155238886`)
   - `TWILIO_WHATSAPP_CONTENT_SID` — the approved template's Content SID
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are injected automatically
     by the Supabase platform into every deployed Edge Function — nothing
     to set manually for those two.
   **BLOCKED on step 2/3** (no Twilio credentials or approved template yet).
5. **Set these as build-time env vars for the prototype itself**
   (`.env.local` locally, or the hosting platform's env-var settings on
   Vercel — never committed, `*.local` is already gitignored):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (see `.env.example` in this prototype's root for the exact names.)
   ~~**DONE locally (`.env.local`)**~~ **DONE** 2026-09-13 — also set on
   the real `nahui.app` Vercel project's own env-var settings; Google/Email
   sign-in confirmed working live against the real backend as a result.
6. ~~**Link and deploy**~~ **DONE** 2026-09-12 — linked to `exvzsfnwogmyxfmaffxn`,
   `db push` applied `20260910000000_create_otp_attempts.sql`, both
   `send-otp` and `verify-otp` deployed and confirmed ACTIVE. (See
   `company/infrastructure-decisions.md` ID018 for the CLI-auth workaround
   this required — Supabase's fine-grained Personal Access Tokens 401 on
   these operations; a "legacy" full-access token, generated via the
   de-emphasized "Create legacy token" link on the same screen, is the
   working credential.)
7. **Smoke-test** `send-otp`/`verify-otp` directly (e.g. `curl` or Supabase
   Studio's function invoker) with a real phone number before trusting the
   prototype's own UI end to end. **BLOCKED on step 4** (functions are
   deployed but have no Twilio credentials to actually send through yet).
8. ~~**Push the Identity persistence layer migration**~~ **DONE** 2026-09-13 —
   `20260913000000_identity_persistence_layer.sql` applied to the real
   hosted project via `supabase db push` (same CLI-auth workaround as step
   6).
9. ~~**`reviewer`'s security pass, two rounds**~~ **DONE** 2026-09-13.
   Round 1 found 3 Important + 1 minor on the base migration (an
   over-broad `business_memberships` UPDATE policy; an inaccurate comment
   on `accept_invitation()`'s best-effort idempotency-cache write;
   `token_hash`'s hash algorithm undocumented outside one function; a
   revoked member's re-accept silently reporting success) — closed by
   `20260913010000_identity_persistence_layer_fixes.sql`. Round 2,
   re-verifying that fix, found 2 further Important findings **in the fix
   itself** (a reintroduced race condition on `accept_invitation()`'s
   membership insert; an unproven "must be revoked" claim that's actually
   false when an already-active member reopens a stale invite link) —
   closed by `20260913020000_identity_persistence_layer_fixes2.sql`. All
   three migrations applied to the real hosted project.
10. ~~**Push the Inventory persistence layer migration**~~ **DONE**
    2026-09-13 — `20260913030000_inventory_persistence_layer.sql` and its
    own-pass follow-up `20260913031000_inventory_persistence_layer_fixes.sql`
    (a `commit_lot` return-shape correction found and fixed before this
    migration was ever reviewed — see that file's own header, not a
    `reviewer` finding) applied to the real hosted project via
    `supabase db push` (same CLI-auth workaround as step 6).
11. ~~**`reviewer`'s security pass**~~ **DONE** 2026-09-13 — found 1 Blocker
    (`commitLot()`'s client wiring never preserved a stable idempotency key
    across a retry, defeating `commit_lot`'s own replay-on-conflict
    guarantee — a lost-response retry could mint a duplicate Lot/Products/
    InventoryUnits) + 2 Important findings (the FIFO index not matching
    `assign_tag_to_next_pending_unit`'s actual query shape; `products.photo`
    staying a data-URL column presented as a settled deferral rather than
    routed back through Decision Ownership against `architect`'s explicit
    Supabase Storage recommendation). Blocker closed client-side
    (`src/domain/store.tsx`/`RegisterMerchandise.tsx`/`OnboardingFlow.tsx`).
    Important findings closed by `20260913033000_inventory_persistence_layer_fixes.sql`
    (index fix + corrected column comment) — see item 13 below for its push
    status, and `context/stage-7-backend-integration.md`'s open items for
    `products.photo`'s still-open go/no-go.
12. ~~**Push the barcode-write follow-up migration**~~
    (`20260913032000_inventory_barcode_write.sql`, `decision-log.md` D65) —
    **DONE**, discovered already applied 2026-09-13 during this session's own
    Phase 2 work: `supabase migration list` shows `local`/`remote` already
    matched for this migration before this session ever ran `db push` —
    contradicting this checklist's own prior "NOT YET DONE"/sandboxed-
    credential-gap claim, which was accurate for whichever earlier, actually-
    credential-less session last edited this file, but is stale now. Not
    independently re-verified beyond the CLI's own applied-migration record
    (no live scan-a-new-barcode walkthrough run this session — that's
    `merchant-user-tester`'s/`reviewer`'s job, not this note's).
13. ~~**Push the reviewer-fix-round migration**~~
    (`20260913033000_inventory_persistence_layer_fixes.sql`, item 11's
    findings) — **DONE**, same discovery as item 12 above (`supabase
    migration list` shows this migration already applied too, before this
    session's own `db push`).
14. ~~**Push the Selling persistence layer migration**~~ **DONE** 2026-09-13
    — `20260913040000_selling_persistence_layer.sql` applied to the real
    hosted project via `supabase db push` (a working `SUPABASE_ACCESS_TOKEN`
    was available in this session — see items 12-13's own correction above:
    the "no credential in this sandboxed environment" framing was never a
    standing property of this project, only of whichever specific earlier
    session lacked one at the time).
15. ~~**`reviewer`'s security pass**~~ **DONE** 2026-09-13 — found 1 Blocker
    (`Selling.tsx`'s per-Product idempotency-key `Map` conflated "retry a
    failed tap" with "a second tap while the first is still in flight,"
    silently under-recording a Sale) + 3 Important findings (`start_session`/
    `set_price_override` never checked their `p_event_id`/`p_product_id`
    belonged to the caller's own Business; seven dead idempotency-cache
    writes reintroduced the pattern Phase 1's `assign_tag_to_next_pending_unit`
    deliberately eliminated one migration earlier; `cancel_sale`/
    `close_session` resolved their target implicitly instead of against a
    client-captured id, unlike `cancel_event`/`revoke_membership`'s own
    explicit-target precedent). Blocker closed client-side (`Selling.tsx`'s
    own `addItemPendingRef`, alongside the existing per-Product key `Map`).
    Important findings closed by
    `20260913041000_selling_persistence_layer_fixes.sql` (SQL) and
    `Selling.tsx`/`store.tsx` (client-captured `saleId`/`sessionId`
    parameters for `cancelSale`/`closeSession`).
16. ~~**Push the reviewer-fix-round migration**~~ **DONE** 2026-09-13 —
    `20260913041000_selling_persistence_layer_fixes.sql` applied to the real
    hosted project via `supabase db push` (same credential as every prior
    push this session).
17. ~~**Push the EventAssignment persistence layer migration**~~ **DONE**
    2026-09-13 — `20260913050000_event_assignment_persistence_layer.sql`
    applied to the real hosted project via `supabase db push` (same
    credential as every prior push this session).
18. **`reviewer`'s security pass** — **NOT YET DONE** for Phase 2c.

## Judgment calls made building this (tune freely, not escalated)

- **OTP expiry: 10 minutes.** `supabase/functions/_shared/otp.ts`'s
  `OTP_EXPIRY_MINUTES`.
- **Send rate limit: 5 codes/phone/hour.** `SEND_RATE_LIMIT_PER_HOUR`,
  enforced server-side in `send-otp` (the existing 30-second client-side
  "Reenviar en 0:30" cooldown in `CodeStep.tsx` is a UX pacing detail only,
  not a security control).
- **Verify lockout: 5 wrong guesses per issued code.**
  `VERIFY_MAX_ATTEMPTS`, enforced in `verify-otp` — a fresh code (a new
  "Reenviar código") resets the count, since it's a new row.
- **Idempotency key for `verify-otp`** is the phone+code pair itself
  rather than a separately generated key: a retry of the same already-
  consumed pair replays the original success outcome instead of
  re-running the consume write, satisfying `architecture-principles.md`
  #7 without a synthetic key field — see the doc comment in
  `functions/verify-otp/index.ts`.
- **WhatsApp delivery uses Twilio's Content API template send**
  (`ContentSid`/`ContentVariables`), not a plain-text `Body` — required
  because an OTP is always a business-initiated message, which WhatsApp
  Business Platform only allows through an approved template. This is why
  step 3 above (template creation/approval) exists as its own checklist
  item rather than being skippable.
- **`auth_identities` (email/google/apple) is populated by a trigger on
  `auth.identities`, not a client-side upsert.** A trigger can't be silently
  skipped by a missed call site the way a client upsert could — one
  mechanism handles every native-auth provider identically. `phone` stays
  populated by the `verify-otp` Edge Function (service-role key), unchanged.
- **`auth_identities` has no client-writable INSERT/UPDATE/DELETE policy at
  all**, despite the dispatch's own "a user can only read/write their own
  rows" framing — a genuine, deliberate deviation. Allowing an authenticated
  client to insert her own `type='phone'` row would let her claim someone
  else's number as a "verified" identity without ever proving it via OTP.
  Writes happen exclusively through the trigger above or the service-role
  Edge Function, both of which bypass RLS by construction; read access
  (`user_id = auth.uid()`) is all any client role needs or gets.
- **`is_active_member_of`/`is_active_owner_of` — two small SECURITY DEFINER
  helper functions**, used inside the `businesses`/`business_memberships`/
  `invitations` RLS policies. Without them, `business_memberships`' own
  SELECT policy would need to query `business_memberships` from inside its
  own USING clause, which re-triggers that table's RLS recursively for every
  authenticated caller who isn't just reading her own row — the standard,
  documented Supabase pattern for avoiding this is a SECURITY DEFINER helper
  (bypasses RLS internally, since it executes as the function owner).
- **`createInvitation`/`acceptInvitation`/`declineInvitation` are NOT wired
  to `invitations`/`accept_invitation` in this pass**, despite being named in
  the dispatch. The running prototype's `Invitation` domain type/UI
  (`types.ts`, `TeamScreen.tsx`, `InvitationFlow.tsx`) is still built against
  the phone-keyed design RFC 0013/D64 superseded — it collects a phone
  number, has no screen to show a generated link/token, and has no field to
  display a phone-addressed pending row once phone is no longer a column on
  `invitations` at all. Wiring these functions to the real, token-keyed
  schema without that UI rework would mean either silently building a
  feature the invited person could never actually reach (no link is ever
  shown to share), or inventing UI/UX decisions that aren't this dispatch's
  to make. RFC 0013 §"What it touches" already names this exact gap
  explicitly ("this code gets its own Migration-Workflow pass... not
  designed here") — flagged here as the same still-open gap, not a new one.
  The migration SQL/RLS/RPC for `invitations` are built and correct
  regardless; only the client wiring for these three functions is deferred.

## Judgment calls made building the Inventory persistence layer (Phase 1)

- **`suppliers`/`lots`/`inventory_entries` get OWNER-only SELECT; `products`/
  `inventory_units`/`nfc_tags` get any-active-member SELECT.** `architect`'s
  own design summary named the second group explicitly (matching the
  confirmed Q24/Q25 permission table's "SELLER: read sellable Products/
  prices, ungated" plus Selling's own read-only tag→unit resolution
  dependency on `nfc_tags`); the first group wasn't explicitly named, but
  follows the same permission table's "OWNER: ... Lot receiving/tagging" by
  direct inference — a SELLER never needs to read receiving-workflow
  bookkeeping to do her own job (open her Session, register a Sale).
- **No client INSERT/UPDATE/DELETE grant on any of the six tables, at all.**
  Every write goes through one of the four SECURITY DEFINER RPCs — matches
  `products`/`inventory_units`/`nfc_tags`'s own comment on the base
  migration ("no direct client... grant... every write goes through the
  SECURITY DEFINER RPCs below") and Phase 0's own `businesses`/
  `business_memberships` precedent.
- **`update_product_price`/`update_product_photo` are idempotency-keyed but
  have no cached-result replay branch**, unlike `commit_lot`/
  `accept_invitation`. A plain single-column `UPDATE` has no duplicate-
  creation side effect to guard against — re-applying the identical value on
  a retry is harmless — so the idempotency_keys row is written for audit-
  trail consistency, but the actual retry-safety comes from the write's own
  natural idempotence, not a stored/replayed result. See each function's own
  header comment.
- **`assign_tag_to_next_pending_unit` raises named exceptions
  (`tag_already_assigned`/`tag_queue_empty`) rather than returning a
  discriminated result row** — matches `accept_invitation`'s own established
  convention (Phase 0) over a table-returning discriminated union; the
  client matches on `error.message`. Neither failure branch attempts an
  idempotency-key cache write before raising, applying Phase 0's own fix-
  round-1 lesson (`20260913010000_identity_persistence_layer_fixes.sql`)
  from the start rather than repeating and later re-fixing the same mistake:
  such a write never survives the `RAISE EXCEPTION` that follows it in the
  same transaction, so a retry simply re-derives the identical outcome by
  re-running the same checks.
- **`commit_lot`'s return shape was corrected before this migration was ever
  reviewed** (`20260913031000_inventory_persistence_layer_fixes.sql`, applied
  as a new migration rather than editing the already-live base file — same
  "never edit an applied migration" discipline Phase 0's own fix migrations
  established) — from `product_id` alone to `(product_id, lot_id,
  unit_ids)` per input line. The client's local `AppState` mirror needs the
  real, server-assigned `InventoryUnit` ids, not locally-fabricated ones, so
  a later `assign_tag_to_next_pending_unit` result can be recognized back
  against `state.units` — see that migration file's own header for the full
  reasoning.
- **`products.photo` stays a plain nullable `text` column**, storage-
  mechanism-agnostic — the client still writes a data-URL string into it
  directly, unchanged from the mock's own shape. **Corrected 2026-09-13
  (`reviewer` finding, closed by `20260913033000_inventory_persistence_layer_fixes.sql`):**
  this was presented above as if it were a settled, disclosed-and-done
  deferral per `architect`'s own open item 2 — it isn't. `architect`
  explicitly recommended real Supabase Storage (a bucket + this column
  holding a path/URL) instead, citing real costs (row bloat, no CDN,
  Postgres text-column limits under load) given `Product.photo`/D54 is
  already live and merchant-facing for 2 real pilot merchants; keeping the
  data-URL shape was a real deviation from that recommendation, made
  unilaterally rather than routed back for reconfirmation. Now tracked
  honestly as **provisionally deferred, pending architect reconfirmation** —
  see `context/stage-7-backend-integration.md`'s open items list. Building
  real Supabase Storage wiring itself remains separate, unscoped work either
  way.
- **`Product.active` (`product-decisions.md` Q21) is not in this schema at
  all** — `architect`'s own Architecture Decision (not this pass's call):
  Q21 was never promoted into the Foundation (no decision-log entry, no
  `domain-model.md` update, no UX spec), so it doesn't belong in a permanent
  table yet.

## Judgment calls made building the Selling persistence layer (Phase 2)

- **`caller_membership_id(business_id)` — a new SECURITY DEFINER RLS helper**,
  same STABLE/bypasses-RLS-internally shape as Phase 0's
  `is_active_member_of`/`is_active_owner_of`. Every RPC that needs "this
  device's own acting Membership" resolves it through this, from `auth.uid()`
  alone, rather than accepting a client-supplied membership id parameter —
  the same "never trust the client for an authorization-relevant identity"
  posture every other SECURITY DEFINER function in this file family already
  holds. This also simplified every Phase 2 RPC's own signature: none of them
  takes a membership or session id as a parameter at all — `add_item_to_sale`,
  for instance, only needs `(business_id, product_id, idempotency_key)`.
- **`add_item_to_sale`/`add_item_to_sale_by_tag` perform plain Business-wide
  FIFO/tag-lookup only — `EventAllocation`-aware selection is not built
  here**, per this phase's own explicit scope boundary (confirmed out of
  scope three independent ways, `context/stage-7-backend-
  integration.md`'s Phase 2 design summary). `store.tsx`'s own client-side
  `addItemToSale`/`addItemToSaleByTag` previously drew their sellable
  candidate from an open `EventAllocation`'s own committed pool when one
  existed (RFC 0010/D59, a purely local-only mechanism — Phase 1 never gave
  `inventory_units` a real write path for that reservation either). That
  branch is removed from the write path entirely in this pass, not merely
  left unwired: the real RPC has no way to accept or honor a client-chosen
  unit id (the FIFO/tag pick is resolved entirely server-side, atomically),
  so keeping the old branch would either require building Phase 2b's own
  compare-and-swap now (explicitly out of scope) or silently diverge from
  what the server actually sells. `EventAllocation`'s own "Para este evento"
  bookkeeping (`commitAllocation`/`releaseAllocation`/`saveEventAllocations`,
  the Events screens that read it) is untouched and still fully local — a
  display/planning-only concept until Phase 2b actually builds the real
  reservation it's meant to describe.
- **`start_session`'s `operating_mode` is resolved client-side, not
  re-derived server-side from `NFC_READINESS_THRESHOLD`.** The threshold
  itself is a disclosed, non-security-sensitive heuristic
  (`selectors.ts`'s own comment: "a configurable product/business rule, not
  hard-coded into the Foundation"), and duplicating it across two
  independently-maintained layers risks drift for no real security benefit.
  The one boundary the RPC does re-check, defensively, server-side: `'nfc'`
  is only ever a legitimate resolution for a Paid-tier Business
  (`decision-log.md` D27) — a client that somehow sent `'nfc'` for a
  Free-tier Business is silently corrected to `'buttons'`, never trusted.
- **`Sale.status`'s closed set stays two values (`'open' | 'finalized'`), not
  three.** `cancel_sale` is a plain `DELETE` (cascading to `sale_items`), not
  a third `'cancelled'` status — matches `types.ts`'s own `Sale` interface
  and `store.tsx`'s pre-Phase-2 `cancelSale()`, which already removed the row
  outright rather than soft-cancelling it.
- **`removeSaleItem`/`cancelSale`'s server-side unit revert is plain
  `reserved -> available`**, same scope boundary as `add_item_to_sale`
  above — RFC 0010/D59's own "still genuinely committed to an open
  EventAllocation, revert to `reserved` instead" distinction
  (`saleCancelRevertStatus`, `selectors.ts`) is no longer consulted by
  either write path. That selector itself is untouched (still used
  elsewhere) — simply no longer called from these two now-real writes.
- **`add_item_to_sale`'s idempotency key is a per-Product ref in
  `Selling.tsx` (a `Map<productId, key>`), not a single shared ref** — unlike
  `RegisterMerchandise.tsx`'s single `commitIdempotencyKeyRef` (one draft,
  one Save button, one attempt in flight at a time), Selling's grid can have
  a distinct, independent "add this Product" attempt in flight or
  failed-and-awaiting-retry for more than one tile at once; a single shared
  ref would incorrectly let a different Product's retry replay a stale key
  minted for an unrelated Product's own failed attempt.
- **`add_item_to_sale_by_tag` and `assign_tag_to_next_pending_unit` (Phase 1)
  share the same "fresh key per scan, not reused across separate scans"
  idempotency shape** — a distinct physical scan is a genuinely new logical
  attempt, never a retry of a prior one, unlike a tile tap's own
  same-Product-retry semantics above.
- **`NuevoEvento.tsx`'s "Reintentar" retry state, previously disclosed as
  not-organically-reachable ("`createEvent` always succeeds now"), is
  genuinely wired now** — `createEvent` is a real, awaitable RPC call that
  can actually fail (a network drop, a platform error), so that branch's own
  retry affordance is no longer a disclosed-but-dead UI state.
- **`EventDetail.tsx`'s `handleContinue` awaits `startSession` before
  navigating to Home**, unlike `HomeScreen.tsx`'s own two `startSession`
  call sites (fire-and-forget, since neither explicitly navigates on the
  strength of the call's own local return) — without awaiting here, Home
  would briefly re-render with no active Session before the RPC's response
  lands, since the previous client-side-only write updated `AppState`
  synchronously and this one no longer can.

## Judgment calls made in the Phase 2 `reviewer` fix round

- **The Blocker fix (`Selling.tsx`'s `addItemPendingRef`) stays handler-side
  only, not a new `ProductTile` visual pending state.** The finding's own
  text names both "disable/ignore taps on that specific tile" and "a brief
  tile-level pending state" as valid shapes, defaulting to the former as
  simplest. A second tap on a Product with an outstanding add is now
  ignored outright by `handleAddItem` itself (shared by both the grid-tap
  and barcode-scan call sites) — no `ProductTile.tsx` change was needed,
  the same "ignore, no new UI state" posture `saving` already holds for
  `close_session` elsewhere in this file.
- **`cancel_sale`/`close_session` gained a new required parameter
  (`p_sale_id`/`p_session_id`) rather than keeping the old signature and
  adding an optional one.** Both RPCs are re-derivable from `auth.uid()`
  alone today (exactly one open Sale/active Session can ever exist per
  Membership), so an optional parameter would have left the implicit-
  resolution bug reachable by omission. Both old single-parameter functions
  are dropped outright in the fix migration, forcing every call site
  (`Selling.tsx`'s only two) to supply the explicit target.

## Judgment calls made building the EventAssignment persistence layer (Phase 2c)

- **`removeEventAssignment` (`store.tsx`) changed signature from a single
  local `EventAssignment.id` to the same `(businessId, eventId,
  membershipId)` triple `createEventAssignment` already takes** — a real
  shape change, not cosmetic. `unassign_from_event` resolves its target row
  by the table's own `(event_id, membership_id)` uniqueness, the same way
  the RPC itself never needed a server-generated id handed back to the
  client for `assign_to_event` to remain idempotent — there was no honest
  reason to keep threading a client-remembered local id through the RPC
  boundary once the server stopped needing it. `PersonalParaEsteEvento.tsx`'s
  `handleUnassign` simplified accordingly — it no longer needs to look up
  the `EventAssignment` row first just to extract its `id`.
- **Both RPCs raise a named exception (`event_not_found`/
  `membership_not_found`) rather than silently no-op on a failed ownership
  check**, matching `start_session`/`set_price_override`'s established
  precedent for a write that mints/targets a row by a client-supplied
  foreign id, not `revoke_membership`/`cancel_event`'s own "no-op via
  WHERE-scoping" shape (which applies to a write with no separate foreign-id
  validity question — the row it targets is already fully identified by the
  primary key/caller-identity it resolves against). `revoke_membership` is
  cited by this migration's own header only for its "no idempotency key
  needed" precedent, not for its error-reporting shape.
- **`unassign_from_event` re-checks `membership_id` is still `active`
  before deleting, per the design summary's own instruction, even though
  this makes it impossible to unassign a Membership after it's been
  revoked.** Consistent with the design's own explicitly-named open item
  (orphaned `event_assignments` rows after a revocation) staying
  unresolved rather than silently half-addressed here — the live UI can
  never actually trigger this case anyway (the roster only ever lists
  active SELLER Memberships, so a row shown as assigned already implies
  `active` at render time).
- **`PersonalParaEsteEvento.tsx`'s per-row `runWrite` error state is now
  genuinely reachable, matching `NuevoEvento.tsx`'s own "no longer
  disclosed-not-wired" correction above** — the artificial `SAVE_DELAY_MS`
  timeout this screen used before backend integration is removed outright;
  the real network round trip now provides whatever perceived latency the
  `saving`/`slow` states exist to communicate.
