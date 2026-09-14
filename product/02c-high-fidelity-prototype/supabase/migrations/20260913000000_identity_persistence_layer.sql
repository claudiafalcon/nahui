-- Stage 7 Backend Integration, Phase 0 — Identity persistence layer.
--
-- Everything else this Foundation describes (Inventory, Selling, Events,
-- Results) is scoped by `business_id` and authorized against `auth.uid()`
-- holding an active `BusinessMembership` — neither of those things has a
-- real row anywhere until this migration exists. This is the dependency
-- every later phase (Phase 1-3, separate dispatches) is blocked on.
--
-- Implements `product/00-foundation/domain-model.md`'s Identity context —
-- `Business`, `BusinessMembership`, `AuthIdentity`, `Invitation` — per the
-- invariants `product/99-rfc/0012-auth-identity-multi-method.md` (Accepted,
-- D62/D63) and `product/99-rfc/0013-invitation-token-based.md` (Accepted,
-- D64) establish. `User` itself has no table here — Supabase's own
-- `auth.users` already *is* the global, bare person-identity anchor this
-- Foundation's `User` aggregate describes (id + createdAt, nothing else);
-- every table below that needs a `User` reference points at `auth.users(id)`
-- directly rather than duplicating it.
--
-- Explicitly NOT this migration's scope (see the Phase 0 dispatch this
-- implements): Inventory/Selling/Events/Results tables (Phase 1-3), the
-- phone-OTP-to-real-session bridging (a separate, non-blocking gap being
-- resolved in parallel — `otp_attempts`/`send-otp`/`verify-otp` stay exactly
-- as they are), Loyalty-claim's `customers`/`claims` tables.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- businesses — `domain-model.md`'s `Business` aggregate root.
-- ---------------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  -- Required with no honest default at the *product* level (D36) — but the
  -- column itself defaults '' the same way `types.ts`'s own `Business.name`
  -- does, for the identical reason: genuinely absent for the brief window
  -- between the atomic Owner-creation write and the later identity-capture
  -- write (`onboarding.md` §3.10) that sets it.
  name text not null default '',
  logo text,
  description text,
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'paid')),
  default_selling_mode text not null default 'buttons'
    check (default_selling_mode in ('buttons', 'nfc')),
  onboarding_acknowledged boolean not null default false,
  -- `settings.md` §2.2/§2.4, D25/D29's pending-change triple for a
  -- `subscription_tier` downgrade. `pending_subscription_tier_acknowledged`
  -- is intentionally outside the check constraint below — it's reset to
  -- `false` whenever a *new* pending change is set, but its own value never
  -- determines whether the pending pair itself is legitimately set/cleared.
  pending_subscription_tier text
    check (pending_subscription_tier in ('free', 'paid')),
  pending_subscription_tier_effective_date date,
  pending_subscription_tier_acknowledged boolean not null default false,
  constraint businesses_pending_tier_pair_together check (
    (pending_subscription_tier is null and pending_subscription_tier_effective_date is null)
    or
    (pending_subscription_tier is not null and pending_subscription_tier_effective_date is not null)
  ),
  -- `home.md` §3.6a's fourth Session-start variant, shown-once-ever marker.
  nfc_availability_nudge_shown boolean not null default false,
  -- Optional — a Business that hasn't configured a reward cycle yet has no
  -- honest default other than "unset" (`decision-log.md` D37).
  loyalty_reward_threshold integer,
  created_at timestamptz not null default now()
);

comment on table public.businesses is
  'Identity context aggregate root (domain-model.md). No direct INSERT '
  'policy exists for anon/authenticated — the Owner-creation invariant '
  '(D44, amended RFC 0012/D62) means the only path that may ever create a '
  'row here is create_business_with_owner() below.';

-- ---------------------------------------------------------------------------
-- business_memberships — `domain-model.md`'s `BusinessMembership` root.
-- ---------------------------------------------------------------------------
create table if not exists public.business_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  business_id uuid not null references public.businesses (id),
  role text not null check (role in ('OWNER', 'SELLER')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, business_id),
  constraint business_memberships_status_revoked_at_consistent check (
    (status = 'active' and revoked_at is null)
    or
    (status = 'revoked' and revoked_at is not null)
  )
);

comment on table public.business_memberships is
  'Identity context aggregate root (domain-model.md). No direct INSERT '
  'policy for anon/authenticated — an OWNER row is only ever created '
  'atomically with its Business (create_business_with_owner), a SELLER row '
  'only ever created atomically with a consumed Invitation '
  '(accept_invitation). UPDATE (revoke) is OWNER-only.';

create index if not exists business_memberships_user_id_idx
  on public.business_memberships (user_id);
create index if not exists business_memberships_business_id_idx
  on public.business_memberships (business_id);

-- ---------------------------------------------------------------------------
-- auth_identities — `domain-model.md`'s `AuthIdentity` root (RFC 0012/D62).
-- A queryable mirror, not a replacement for Supabase's own native
-- `auth.identities` — see the trigger below for why `phone` specifically
-- needs one at all (Nahui's custom WhatsApp-OTP flow never touches
-- `auth.identities`, since it doesn't go through Supabase's built-in phone
-- provider — `supabase/config.toml`'s own `[auth]` comment).
-- ---------------------------------------------------------------------------
create table if not exists public.auth_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  type text not null check (type in ('phone', 'email', 'google', 'apple')),
  identifier text not null,
  verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (type, identifier)
);

comment on table public.auth_identities is
  'Identity context aggregate root (domain-model.md, RFC 0012/D62). A '
  'queryable mirror for `phone` (which never gets a row in Supabase''s own '
  'auth.identities), auto-populated for email/google/apple by the trigger '
  'below. Deliberately no client-writable INSERT policy — see this '
  'migration''s own header comment for why.';

create index if not exists auth_identities_user_id_idx
  on public.auth_identities (user_id);

-- ---------------------------------------------------------------------------
-- invitations — `domain-model.md`'s `Invitation` root, token-keyed
-- (RFC 0013/D64 — supersedes the earlier phone-keyed design).
-- ---------------------------------------------------------------------------
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  -- Never the raw token — RFC 0013 §4's explicit requirement, confirmed
  -- against OWASP's Password Storage Cheat Sheet (a leaked database must
  -- never yield a usable token). The raw token exists only transiently,
  -- client-side, long enough to build the shareable link and hash it before
  -- this row is ever written.
  token_hash text not null unique,
  role text not null default 'SELLER' check (role = 'SELLER'),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  expires_at timestamptz not null,
  -- { type: 'email', value: <address> } today — a delivery/addressing aid
  -- only, never matched against the accepting user's identity (RFC 0013 §1).
  target_hint jsonb,
  accepted_by_user_id uuid references auth.users (id),
  created_at timestamptz not null default now()
);

comment on table public.invitations is
  'Identity context aggregate root (domain-model.md, RFC 0013/D64). RLS is '
  'scoped to "OWNER of the Business can read/manage/create/revoke '
  'Invitations for that Business" only — resolving an Invitation by token '
  'before authentication (RFC 0013 §2''s own sequencing) is a structurally '
  'different access pattern, handled entirely inside accept_invitation() '
  '(SECURITY DEFINER), never by a direct-table RLS policy.';

create index if not exists invitations_business_id_idx
  on public.invitations (business_id);

-- ---------------------------------------------------------------------------
-- idempotency_keys — shared by every SECURITY DEFINER write below
-- (`architecture-principles.md` #7/D30: a write exposed to a client-initiated
-- retry must be idempotent or keyed, never blindly re-executed). One row per
-- client-generated attempt; `result` is populated once the attempt resolves,
-- so a retry with the same `id` can be answered by replaying `result`
-- instead of re-running the write. `business_id` is nullable — for
-- `create_business_with_owner` specifically, no Business exists yet at the
-- moment the key is first inserted; it's backfilled once the write completes,
-- purely for debugging/audit legibility, never read by the replay logic
-- itself (which keys on `id` alone). Created after `businesses` because of
-- this FK.
-- ---------------------------------------------------------------------------
create table if not exists public.idempotency_keys (
  id uuid primary key, -- client-generated, not server-defaulted
  business_id uuid references public.businesses (id),
  operation text not null,
  result jsonb,
  created_at timestamptz not null default now()
);

comment on table public.idempotency_keys is
  'One row per client-initiated attempt at a SECURITY DEFINER write in this '
  'file. Populated via insert ... on conflict (id) do nothing; a retry that '
  'hits the conflict branch replays the stored result instead of re-running '
  'the write. Never directly reachable by anon/authenticated — only the '
  'SECURITY DEFINER functions below touch it (they run as this table''s '
  'owner, which bypasses RLS by construction).';

alter table public.idempotency_keys enable row level security;
-- Zero policies defined — deliberate deny-by-default, same posture
-- `otp_attempts` already established. Nothing outside a SECURITY DEFINER
-- function body is ever meant to read or write this table.

-- ---------------------------------------------------------------------------
-- RLS helper functions — SECURITY DEFINER, used inside the policies below
-- to avoid a self-referencing RLS policy on business_memberships evaluating
-- recursively against itself. Both bypass RLS internally (they execute as
-- this migration's owner, which is exempt from RLS on tables it owns), so
-- the membership check they perform is a single, non-recursive read.
-- ---------------------------------------------------------------------------
create or replace function public.is_active_member_of(p_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.business_memberships
    where business_id = p_business_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.is_active_owner_of(p_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.business_memberships
    where business_id = p_business_id
      and user_id = auth.uid()
      and role = 'OWNER'
      and status = 'active'
  );
$$;

revoke execute on function public.is_active_member_of(uuid) from public;
revoke execute on function public.is_active_owner_of(uuid) from public;
grant execute on function public.is_active_member_of(uuid) to authenticated;
grant execute on function public.is_active_owner_of(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Trigger — mirrors a newly-created native Supabase Auth identity
-- (email/google/apple) into public.auth_identities automatically.
--
-- Why a trigger rather than relying on the client to upsert after
-- signInWithOtp/signInWithOAuth succeeds (the dispatch's own "your call"):
-- a trigger is the mechanism that can't be silently skipped by a client bug,
-- a missed call site, or a future caller who doesn't know this table exists
-- — the exact same "never trust the client to remember a write" posture
-- this Foundation already holds itself to everywhere else (e.g. FIFO
-- allocation, price resolution, every "never asked mid-flow" capability in
-- architecture-principles.md #1). It also means one mechanism handles both
-- email and google/apple identically, rather than duplicating the same
-- upsert call at every provider's own call site in authProviders.ts. `phone`
-- is deliberately excluded here — Nahui's custom OTP flow never creates an
-- auth.identities row at all (config.toml's own note), so that type stays
-- populated by the verify-otp Edge Function via the service-role key
-- (bypasses RLS the same way otp_attempts already does), a separate,
-- non-blocking gap this migration doesn't touch (see this file's header).
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_auth_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_type text;
  v_identifier text;
begin
  if new.provider = 'email' then
    v_type := 'email';
    v_identifier := lower(trim(new.identity_data->>'email'));
  elsif new.provider in ('google', 'apple') then
    v_type := new.provider;
    -- RFC 0012 §1 — the provider's own stable subject ID, never the
    -- associated email (which can be hidden/relayed/changed independently
    -- of the underlying identity).
    v_identifier := coalesce(new.identity_data->>'sub', new.provider_id);
  else
    -- Any other native provider Supabase might ever add is out of this
    -- Foundation's closed AuthIdentity.type set — ignored, not an error.
    return new;
  end if;

  if v_identifier is null then
    return new;
  end if;

  insert into public.auth_identities (user_id, type, identifier, verified_at)
  values (new.user_id, v_type, v_identifier, coalesce(new.last_sign_in_at, now()))
  on conflict (type, identifier) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_identity_created on auth.identities;
create trigger on_auth_identity_created
  after insert on auth.identities
  for each row execute function public.handle_new_auth_identity();

-- ---------------------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------------------
alter table public.businesses enable row level security;
alter table public.business_memberships enable row level security;
alter table public.auth_identities enable row level security;
alter table public.invitations enable row level security;

-- businesses — member reads, OWNER writes. No INSERT/DELETE policy for any
-- role: creation goes exclusively through create_business_with_owner().
create policy businesses_select on public.businesses
  for select
  using (public.is_active_member_of(id));

create policy businesses_update on public.businesses
  for update
  using (public.is_active_owner_of(id))
  with check (public.is_active_owner_of(id));

grant select, update on public.businesses to authenticated;

-- business_memberships — a member reads her own row; an OWNER reads every
-- row for a Business she owns (the roster view). Only an OWNER may UPDATE
-- (revoke) a row, and never her own creation — creation itself is exclusive
-- to create_business_with_owner()/accept_invitation(). No INSERT/DELETE
-- policy for any role.
create policy business_memberships_select on public.business_memberships
  for select
  using (
    user_id = auth.uid()
    or public.is_active_owner_of(business_id)
  );

create policy business_memberships_update on public.business_memberships
  for update
  using (public.is_active_owner_of(business_id))
  with check (public.is_active_owner_of(business_id));

grant select, update on public.business_memberships to authenticated;

-- auth_identities — strictly own-rows, read-only for the base client roles.
-- Deliberately NO client-writable INSERT/UPDATE/DELETE policy, even though
-- the dispatch's own "read/write" framing would permit one: email/google/
-- apple identities are populated automatically by the trigger above
-- (SECURITY DEFINER, bypasses RLS), and phone identities are populated only
-- by the verify-otp Edge Function via the service-role key (also bypasses
-- RLS). Allowing an authenticated client to INSERT into this table directly
-- would let her write an arbitrary `type='phone'` row claiming someone
-- else's number as her own *without* ever proving it via OTP — a real
-- security hole this Foundation's own "verified means actually verified"
-- invariant can't tolerate. Flagged explicitly as a deliberate deviation
-- from the dispatch's literal wording, not an oversight — see the build
-- report for the full reasoning.
create policy auth_identities_select on public.auth_identities
  for select
  using (user_id = auth.uid());

grant select on public.auth_identities to authenticated;

-- invitations — OWNER-only, full stop. No unauthenticated/anon token
-- lookup at the table level at all (see this table's own comment above) —
-- accept_invitation() is the only path that resolves an Invitation by token.
create policy invitations_select on public.invitations
  for select
  using (public.is_active_owner_of(business_id));

create policy invitations_insert on public.invitations
  for insert
  with check (public.is_active_owner_of(business_id));

create policy invitations_update on public.invitations
  for update
  using (public.is_active_owner_of(business_id))
  with check (public.is_active_owner_of(business_id));

grant select, insert, update on public.invitations to authenticated;

-- ---------------------------------------------------------------------------
-- create_business_with_owner — the Owner-creation invariant (D44, amended
-- RFC 0012/D62), as one atomic, idempotency-keyed transaction.
-- ---------------------------------------------------------------------------
create or replace function public.create_business_with_owner(
  p_idempotency_key uuid,
  p_subscription_tier text default 'free',
  p_default_selling_mode text default 'buttons'
)
returns table (business_id uuid, membership_id uuid)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_business_id uuid;
  v_membership_id uuid;
begin
  -- SECURITY DEFINER bypasses RLS by default — re-implementing the
  -- authorization check here, as the first statement, is not optional
  -- (this migration's own dispatch instruction, restating
  -- architecture-principles.md's general discipline).
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Idempotency (architecture-principles.md #7/D30): insert-or-fetch on the
  -- client-generated key. A conflict means this exact attempt already ran
  -- (or is running) — replay its stored result rather than re-executing.
  insert into public.idempotency_keys (id, operation)
  values (p_idempotency_key, 'create_business_with_owner')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      -- The original attempt is still in flight (no result written yet) —
      -- fail closed rather than silently race it. Not expected at Nahui's
      -- current pilot scale (single-actor onboarding), named here rather
      -- than silently assumed away.
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    return query
      select
        (v_existing_result ->> 'business_id')::uuid,
        (v_existing_result ->> 'membership_id')::uuid;
    return;
  end if;

  -- Owner-creation invariant's own precondition — the acting user must hold
  -- at least one verified AuthIdentity, of any type (D44, generalized by
  -- RFC 0012/D62 from a phone-specific check). `auth.uid()` being non-null
  -- already implies a verified session for the Email/Google paths this
  -- dispatch assumes are live; this check stays as real, load-bearing
  -- defense against a future auth path that could set `auth.uid()` without
  -- ever writing an AuthIdentity row.
  if not exists (select 1 from public.auth_identities where user_id = v_uid) then
    raise exception 'not_verified' using errcode = '28000';
  end if;

  -- Defensive: a user who already owns a Business never mints a second one
  -- through this path (mirrors the existing client-side guard this RPC
  -- replaces).
  select bm.business_id into v_business_id
  from public.business_memberships bm
  where bm.user_id = v_uid and bm.role = 'OWNER'
  limit 1;

  if v_business_id is null then
    insert into public.businesses (subscription_tier, default_selling_mode)
    values (p_subscription_tier, p_default_selling_mode)
    returning id into v_business_id;

    insert into public.business_memberships (user_id, business_id, role, status)
    values (v_uid, v_business_id, 'OWNER', 'active')
    returning id into v_membership_id;
  else
    select id into v_membership_id
    from public.business_memberships
    where user_id = v_uid and business_id = v_business_id and role = 'OWNER';
  end if;

  update public.idempotency_keys
  set business_id = v_business_id,
      result = jsonb_build_object('business_id', v_business_id, 'membership_id', v_membership_id)
  where id = p_idempotency_key;

  return query select v_business_id, v_membership_id;
end;
$$;

revoke execute on function public.create_business_with_owner(uuid, text, text) from public;
grant execute on function public.create_business_with_owner(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- accept_invitation — the Invitation-acceptance invariant (D56, reworked
-- RFC 0013/D64), as one atomic, idempotency-keyed transaction with an
-- explicit compare-and-swap against a second, different actor racing the
-- same leaked link.
-- ---------------------------------------------------------------------------
create or replace function public.accept_invitation(
  p_token text,
  p_idempotency_key uuid
)
returns table (business_id uuid, membership_id uuid)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_token_hash text;
  v_invitation record;
  v_membership_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Idempotency guards this same caller's own retried attempt — a distinct
  -- guarantee from the CAS below, which guards against a second, different
  -- actor racing the same token (RFC 0013 §2's own explicit distinction).
  insert into public.idempotency_keys (id, operation)
  values (p_idempotency_key, 'accept_invitation')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    if v_existing_result ? 'error' then
      raise exception 'invitation_not_available' using errcode = 'P0001';
    end if;

    return query
      select
        (v_existing_result ->> 'business_id')::uuid,
        (v_existing_result ->> 'membership_id')::uuid;
    return;
  end if;

  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');

  -- The compare-and-swap itself (RFC 0013 §2/§4) — zero rows updated means
  -- "not pending" (already accepted/revoked) or expired, and must return a
  -- distinct, named failure so the client can show "ya no disponible"
  -- (§3.13a) rather than a generic platform error.
  update public.invitations
  set status = 'accepted', accepted_by_user_id = v_uid
  where token_hash = v_token_hash
    and status = 'pending'
    and now() < expires_at
  returning * into v_invitation;

  if v_invitation is null then
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_available')
    where id = p_idempotency_key;
    raise exception 'invitation_not_available' using errcode = 'P0001';
  end if;

  -- Invitation-acceptance invariant — atomically create the SELLER
  -- Membership. Upsert-shaped against `(user_id, business_id)`'s own unique
  -- constraint: if a Membership already exists for this pair (e.g. a
  -- previously-revoked SELLER accepting a fresh Invitation), this never
  -- reactivates it — `BusinessMembership.status` has "no reactivation path
  -- designed" (D55) — it simply resolves to that existing row's id.
  insert into public.business_memberships (user_id, business_id, role, status)
  values (v_uid, v_invitation.business_id, 'SELLER', 'active')
  on conflict (user_id, business_id) do nothing
  returning id into v_membership_id;

  if v_membership_id is null then
    select id into v_membership_id
    from public.business_memberships
    where user_id = v_uid and business_id = v_invitation.business_id;
  end if;

  update public.idempotency_keys
  set business_id = v_invitation.business_id,
      result = jsonb_build_object('business_id', v_invitation.business_id, 'membership_id', v_membership_id)
  where id = p_idempotency_key;

  return query select v_invitation.business_id, v_membership_id;
end;
$$;

revoke execute on function public.accept_invitation(text, uuid) from public;
grant execute on function public.accept_invitation(text, uuid) to authenticated;
