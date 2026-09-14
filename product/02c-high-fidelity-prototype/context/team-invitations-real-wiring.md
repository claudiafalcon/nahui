# Team Invitations — real backend wiring (RFC 0013 implementation gap)

**Status: In progress, started 2026-09-14.** Working file per this folder's own knowledge-architecture discipline. `createInvitation`/`acceptInvitation` in the built React prototype are still 100% local-mock — RFC 0013 (Accepted, `decision-log.md` D64) specifies the real token-based mechanism in full, but it was never actually wired to the database.

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

1. **Backend + client store wiring** (independent of the UX spec gap) — `create_invitation`/`peek_invitation`/`regenerate_invitation` RPCs, `store.tsx` wiring, minimal path-based routing for `/invite/<token>`. Dispatched to `builder`.
2. **`authentication.md` pre-auth acceptance-flow amendment** (the real blocking gap for the UI rebuild) — dispatched to `ux-designer`, in parallel with #1.
3. Once #2 is Approved: `ui-designer` rebuilds `TeamScreen.tsx`/`InvitationFlow.tsx` against both the reworked `settings.md` §2.7/§3.11-§3.14 and the new `authentication.md` amendment, via the standard Migration Workflow.
4. Full review pipeline (`ux-critic`/`reviewer`) before commit, matching every other Stage 7 workstream's discipline.

## Open items, not resolved

- `cancel_invitation` RPC and real `revokeMembership` wiring — same defect class, named, not started.
- IP rate-limiting on `peek_invitation` — infrastructure-layer, not a Postgres-function concern, not designed here.
