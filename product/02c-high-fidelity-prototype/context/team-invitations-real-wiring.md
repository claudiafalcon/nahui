# Team Invitations — real backend wiring (RFC 0013 implementation gap)

**Status: Backend + client-store half complete, 2026-09-14 (`builder`), including a same-day `reviewer` fix round (Important, closed) and a same-day `architect` Blocker fix (closed — see "`architect` Blocker fix round" below). UI half not started.** Working file per this folder's own knowledge-architecture discipline. `createInvitation`/`acceptInvitation` in the built React prototype were 100% local-mock — RFC 0013 (Accepted, `decision-log.md` D64) specifies the real token-based mechanism in full; it's now wired to the database (backend RPCs + `store.tsx`/`types.ts`/`selectors.ts` domain layer + minimal `/invite/<token>` routing plumbing). `TeamScreen.tsx`/`InvitationFlow.tsx` themselves are unchanged — still built against the old phone-based shape, now genuinely broken (`tsc -b` confirms every remaining compile error is confined to those two files) — and stay that way until the separate `ux-designer`/`ui-designer` dispatch (sequencing step 2/3 below) rebuilds them against the reworked `settings.md`/`authentication.md`.

## What `builder` actually built (2026-09-14)

- **Migration `supabase/migrations/20260914030000_invitation_token_write_path.sql`**, deployed via `supabase db push` — `_generate_invitation_token()` (private helper), `create_invitation()`, `regenerate_invitation()`, `peek_invitation()`, exactly as `architect`'s design below specifies. `accept_invitation()` untouched. Verified live against the hosted project: `peek_invitation` reachable by the anon key and returns an empty result for an unknown token; `create_invitation` correctly rejects an anon caller with `permission denied` (no grant).
- **`types.ts`**: `Invitation.phone` removed; `expiresAt`/`targetHint`/`acceptedByUserId` added; `status` narrowed to `pending | accepted | revoked` (`expired` is now purely a read-time derivation). No raw-token field — never stored client-side.
- **`selectors.ts`**: `pendingInvitationsForPhone` removed (structurally retired by RFC 0013 — nothing to match a phone against anymore, and the mechanism itself is gone per RFC 0013 §2: "the new mechanism never auto-surfaces anything"). Added `invitationDisplayStatus(invitation)`, the `expired` derivation every future caller should read through instead of `.status` directly.
- **`store.tsx`**: `createInvitation`/`acceptInvitation` rewritten as real async RPC calls (signatures per `architect`'s design, below). Added `regenerateInvitation`/`peekInvitation`. `declineInvitation`/`revokeMembership` left untouched (out of scope — see Open items).
- **`AppRouter.tsx`**: added minimal path-based routing — a `window.location.pathname` match against `/invite/(.+)`, captured once at mount into a small piece of local state (`inviteToken`), not yet consumed by any screen. Removed the phone-match auto-offer mechanism that used to mount `InvitationFlow` automatically (dead code once `Invitation.phone` no longer exists, and already retired on the merits by RFC 0013 itself, not a UI redesign choice made here).
- `supabase/README.md` and this file updated.

## `reviewer` fix round 1 (2026-09-14, Important — closed)

`create_invitation` re-checks `businesses.subscription_tier = 'paid'` server-side before minting an Invitation; its sibling `regenerate_invitation` never performed that check — only OWNER-ship was re-verified. A Business that downgraded to Free while holding an old, expired pending Invitation could still mint a fresh, working invite link via "Generar otra" even though that UI surface no longer exists for her on Free tier.

**Fix**: `supabase/migrations/20260914031000_invitation_token_write_path_fix.sql`, deployed via `supabase db push` — added the identical tier check to `regenerate_invitation`, keyed off `v_invitation.business_id` (the row already looked up by `invitation_id`), placed right after the existing `is_active_owner_of` check and before the idempotency-key insert, matching `create_invitation`'s own ordering. Raises the identical `paid_tier_required` exception (42501).

**`store.tsx` alignment checked, no change needed**: `createInvitation` itself has no `paid_tier_required`-specific handling — it logs and returns `null` on any RPC error, generically. `regenerateInvitation` already did the same before this fix and still does after — both siblings handle every error path identically, so there was no asymmetry to correct.

`npm run build` confirmed clean except the pre-existing, expected `TeamScreen.tsx`/`InvitationFlow.tsx` errors (those two screens' own rebuild is still a separate, not-yet-started `ui-designer` dispatch, per Sequencing step 3 below).

## `architect` Blocker fix round (2026-09-14, closed)

`architect` reviewed `20260914030000`'s own design note — "the raw token is never persisted anywhere except this row's own `idempotency_keys.result`... a deliberate, narrow exception to 'never store the raw token,' not an oversight" — and found the framing wrong against RFC 0013/D64's actual threat model. D64 is about a full database dump/leak, not an application-layer RLS bypass: `idempotency_keys` holding zero RLS policies only ever meant no *client* could read the cached token back through PostgREST. A DB dump doesn't go through RLS at all, so the cache never was safe against the threat D64 actually names.

**Fix**: `supabase/migrations/20260914032000_invitation_token_no_raw_cache.sql`, deployed via `supabase db push` — both `create_invitation` and `regenerate_invitation` `create or replace`d (written from the tier-check-carrying `20260914031000` version, not the original, so that fix isn't regressed):

- `idempotency_keys.result` no longer carries `'token'` in either function's success path — `create_invitation` stores only `invitation_id`/`expires_at`; `regenerate_invitation` stores only `expires_at`. A replay of either (the `v_key_id is null` branch) now returns `null::text` for `token` instead of reading it back from the cache.
- `regenerate_invitation`'s precondition loosened from "`status = 'pending'` **and** `now() < expires_at`" (genuinely expired) to "`status = 'pending'`" alone (any still-pending row, expired or not) — making it the legitimate recovery path for a dropped `create_invitation` response, since neither function persists the raw token anywhere beyond its own single response. The error code `invitation_not_expired` renamed to `invitation_not_pending` everywhere it appears (fresh-attempt-fails branch and the replay branch's cached-error check).
- `settings.md` §3.11's Approved UI is unaffected by this loosening — the `[ Generar otra ]` button stays gated to expired rows only there; only the backend function's own precondition changed.
- `peek_invitation`/`_generate_invitation_token` untouched, as scoped.

**`store.tsx` alignment**: `createInvitation`/`regenerateInvitation`'s `StoreValue` signatures and implementations corrected from `token: string` to `token: string | null` (a replay now genuinely returns no token — the earlier assumption that a replay always carries a displayable token was invalidated by this fix). Doc comments on both updated to state the `token: null` replay case explicitly and name `regenerateInvitation` as the fallback a caller must use to obtain a fresh, displayable token in that case. `TeamScreen.tsx`/`InvitationFlow.tsx` untouched (separate `ui-designer` dispatch, per Sequencing step 3 below) — their pre-existing compile errors are unrelated to this null-handling change (wrong call arity/a stale `phone` field reference, both predating this fix).

`npm run build` confirmed clean except the same pre-existing, expected `TeamScreen.tsx`/`InvitationFlow.tsx` errors.

## What this is

Stage 7 Backend Integration is otherwise complete. This is the one real, named follow-up: make Team Invitations (`settings.md` §2.7 "Tu equipo") actually work end to end against the real backend, per Product Owner direction, 2026-09-14.

## `architect`'s design (2026-09-14, full detail in the agent's own report, not restated here)

- **A real gap the original scoping missed: `accept_invitation` alone isn't sufficient.** RFC 0013 §2 requires resolving a pending Invitation by token *before* authentication runs — but `accept_invitation` requires `auth.uid()` as its first check and atomically consumes the row in the same call. A new **`peek_invitation(p_token)`** RPC is required — read-only, callable by `anon` and `authenticated`, never mutates status. This is also the real enumeration-attack surface RFC 0013 §4/§7's "rate-limit the token-lookup endpoint" note refers to — IP rate-limiting itself is a Supabase API-gateway/Edge-Function concern, not designed here, same as RFC 0013 already deferred it.
- **`create_invitation(business_id, idempotency_key, target_hint?)`** — OWNER-only, Paid-tier-gated (re-checked server-side), idempotency-keyed. **Server generates the raw token and returns it once** — a deliberate call `architect` made after finding RFC 0013 is genuinely silent on *where* generation happens (only that it's stored hashed): keeps the hashing algorithm defined in exactly one place, matches every other RPC's own "server mints the identifier" precedent, and doesn't newly expose the token any more than the very next hop (handing it to a share sheet) already does under RFC 0013's own accepted risk posture.
- **`regenerate_invitation(invitation_id, idempotency_key)`** — its own RPC (not folded into `create_invitation`, different authorization/precondition shape), in-place mutation matching `settings.md` §4's own "Generar otra mutates in place" resolution.
- **`_generate_invitation_token()`** — shared private helper (256-bit random, `sha256`/hex, 24h expiry per `settings.md` §2.7a) used by both.
- **Client `Invitation` type changes**: `phone` removed; no raw-token field ever stored client-side (matches the server never persisting one — the raw token is an ephemeral return value only, held in component state just long enough for the one-time display); `expiresAt`/`targetHint`/`acceptedByUserId` added; `status` narrows to `pending|accepted|revoked` — `expired` becomes a read-time derivation, never stored.
- **A genuinely blocking gap, not just a UI rewrite**: `authentication.md` §2.2a/§3.10–§3.13a is *still phone-scoped* and was already explicitly flagged stale in `product/02-ux/CLAUDE.md`'s own status line months ago ("confirmed not to compose cleanly... routed as a separate, not-yet-started follow-on"). RFC 0013 §2 gives the acceptance *mechanism* but explicitly defers the exact pre-auth offer screen / token-threading-through-auth UX to `ux-designer` — no Approved spec for this currently exists anywhere. `InvitationFlow.tsx`/`TeamScreen.tsx` cannot be correctly rebuilt until this lands.
- **A governance point**: per `product/02c-high-fidelity-prototype/CLAUDE.md`, `ui-designer` is the sole writer to this folder — `builder`'s own charter is "preserve the approved interaction model, in place," but the currently-*built* interaction model (phone-based) isn't the currently-*Approved* one (`settings.md` was reworked 2026-09-13). The UI half of this fix belongs to `ui-designer` via the standard Migration Workflow, not `builder` alone.
- **No URL/path routing exists anywhere in this prototype today** — `AppRouter.tsx` is entirely state-driven. Supporting `nahui.app/invite/<token>` (RFC 0013 §2's own route shape) needs a minimal `window.location.pathname` read — not a full routing library (`architecture-principles.md` #5 restraint) — Main's own call, made below, not deferred further.
- **Two adjacent, same-shaped gaps found, not in scope for this pass, named so they aren't lost**: `settings.md` §3.12d "Cancelar invitación" has no real RPC either (`cancel_invitation`, same pattern as the three above); `revokeMembership` in `store.tsx` is also still 100% local-mock despite a real, already-working `revoke_membership` RPC existing since Phase 0.

## Sequencing

1. **Backend + client store wiring** (independent of the UX spec gap) — `create_invitation`/`peek_invitation`/`regenerate_invitation` RPCs, `store.tsx` wiring, minimal path-based routing for `/invite/<token>`. Dispatched to `builder`. **Done, 2026-09-14** — see above.
2. **`authentication.md` pre-auth acceptance-flow amendment** (the real blocking gap for the UI rebuild) — dispatched to `ux-designer`, in parallel with #1.
3. Once #2 is Approved: `ui-designer` rebuilds `TeamScreen.tsx`/`InvitationFlow.tsx` against both the reworked `settings.md` §2.7/§3.11-§3.14 and the new `authentication.md` amendment, via the standard Migration Workflow.
4. Full review pipeline (`ux-critic`/`reviewer`) before commit, matching every other Stage 7 workstream's discipline.

## Open items, not resolved

- `cancel_invitation` RPC and real `revokeMembership` wiring — same defect class, named, not started.
- IP rate-limiting on `peek_invitation` — infrastructure-layer, not a Postgres-function concern, not designed here.
