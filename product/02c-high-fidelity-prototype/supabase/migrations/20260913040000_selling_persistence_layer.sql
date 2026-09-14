-- Stage 7 Backend Integration, Phase 2 — Selling persistence layer.
--
-- Implements `product/00-foundation/domain-model.md`'s Selling context —
-- Venue, Event, PriceOverride, Session, Sale, SaleItem. Design authority:
-- `context/stage-7-backend-integration.md`'s "Phase 2 design summary"
-- (`architect`, 2026-09-13) — six tables, all Business-scoped with
-- `business_id` denormalized directly onto every row, ten SECURITY DEFINER
-- RPCs, the same idempotency-key/FOR UPDATE SKIP LOCKED patterns Phase 0/1
-- (20260913000000/20260913030000 and their own fix migrations) already
-- established. `decision-log.md` D66 — `Session.openedByMembershipId` and
-- the "one active Session per Membership" invariant — is applied here as a
-- real, indexed constraint (`sessions_one_active_per_membership_idx`).
--
-- Confirmed out of scope for this phase, three independent ways
-- (`architect`, `context/stage-7-backend-integration.md`'s own Phase 2
-- design summary): EventAllocation/AllocationMovement (Phase 2b) and
-- EventAssignment (Phase 2c). `add_item_to_sale`/`add_item_to_sale_by_tag`
-- below perform plain Business-wide FIFO/tag-lookup only, each with one
-- explicit comment marking exactly where Phase 2b's own compare-and-swap
-- will extend it later — not built here.

-- ---------------------------------------------------------------------------
-- venues — `domain-model.md`'s `Venue` root ("a place Ana sells," D20).
-- Minimal — no address/notes/active toggle, since `events.md` §11 designs no
-- UI surface for capturing or editing them (the same structurally-present-
-- but-UI-absent restraint D9/D26 already established elsewhere).
-- ---------------------------------------------------------------------------
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  display_name text not null,
  created_at timestamptz not null default now()
);

comment on table public.venues is
  'Selling context aggregate root (domain-model.md). No direct INSERT '
  'policy for anon/authenticated — a Venue is only ever minted (or reused, '
  'mint-or-find by case-insensitive name) inside create_event()''s own '
  'atomic transaction.';

create index if not exists venues_business_id_idx on public.venues (business_id);

-- ---------------------------------------------------------------------------
-- events — `domain-model.md`'s `Event` root ("light root... does NOT own
-- Session as a strict aggregate"). **`status` is never a stored column** —
-- computed live from `start_date`/`end_date` vs. today plus `cancelled_at`
-- (`events.md` §2, matching the already-built prototype's own `eventStatus`
-- selector exactly) — every RPC below that needs to know an Event's status
-- re-derives it the same way, inline, rather than trusting a stored value.
-- No overlap/uniqueness constraint across Events — simultaneous multi-Event
-- operation is the confirmed invariant (`decision-log.md` D53).
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  venue_id uuid not null references public.venues (id),
  -- The closed, 6-value Event type enum (`decision-log.md` D16) — internal
  -- English keys per `ubiquitous-language.md`; Spanish labels are a
  -- UI-layer-only concern (`eventTypeLabels.ts`), never stored.
  type text not null check (type in ('Bazaar', 'Expo', 'Pop-up', 'Festival', 'Market', 'Office Sale')),
  start_date date not null,
  end_date date not null,
  -- Optional at entry, always stored as a number, 0 default (D33).
  bazaar_cost numeric not null default 0 check (bazaar_cost >= 0),
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  constraint events_end_after_start check (end_date >= start_date)
);

comment on table public.events is
  'Selling context aggregate root (domain-model.md, events.md §2). Status '
  'is never a stored column — computed live from start_date/end_date vs. '
  'today plus cancelled_at, the identical rule the client''s own eventStatus '
  'selector already applies. No direct INSERT policy for anon/authenticated '
  '— only create_event(). UPDATE is narrowly scoped to cancel_event() '
  '(cancelled_at only) and set_price_override()''s own defensive read — no '
  'general Event-edit RPC exists (no approved spec or built code calls for '
  'one, per this phase''s own design summary).';

create index if not exists events_business_id_idx on public.events (business_id);
create index if not exists events_venue_id_idx on public.events (venue_id);

-- ---------------------------------------------------------------------------
-- price_overrides — internal-only entity owned by Event (no identity or
-- lookup outside its parent Event, the same shape InventoryEntry has under
-- Lot, D33) — a real table, not a jsonb column, following Phase 1's own
-- resolved precedent for internal-only entities of this class. Absence of a
-- row means "use Product.defaultPrice," never a stored copy of the default.
-- ---------------------------------------------------------------------------
create table if not exists public.price_overrides (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  event_id uuid not null references public.events (id),
  product_id uuid not null references public.products (id),
  override_price numeric not null check (override_price >= 0),
  created_at timestamptz not null default now(),
  unique (event_id, product_id)
);

comment on table public.price_overrides is
  'Internal-only entity owned by Event (domain-model.md, D33). Only ever '
  'written inside set_price_override()''s own upsert — no direct client '
  'INSERT/UPDATE/DELETE grant.';

create index if not exists price_overrides_business_id_idx on public.price_overrides (business_id);

-- ---------------------------------------------------------------------------
-- sessions — `domain-model.md`'s `Session` root, gains `opened_by_membership_id`
-- (`decision-log.md` D66, correcting RFC 0008 §7's "zero schema change" claim
-- on attribution specifically). The partial unique index below makes "one
-- active Session per Membership" a real, enforced constraint, promoted by
-- D66 from an enforced-but-undocumented client-side invariant
-- (`store.tsx`'s own `startSession` guard) to a named one.
-- ---------------------------------------------------------------------------
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  -- null for a Quick Session, or the Event this Session's Día belongs to.
  -- Never set after the Session opens (`Session.operatingMode`'s own
  -- immutability precedent, D23).
  event_id uuid references public.events (id),
  operating_mode text not null check (operating_mode in ('buttons', 'nfc')),
  status text not null default 'active' check (status in ('active', 'closed')),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  opened_by_membership_id uuid not null references public.business_memberships (id)
);

comment on table public.sessions is
  'Selling context aggregate root (domain-model.md, decision-log.md D66). '
  'No direct INSERT/UPDATE policy for anon/authenticated — only via '
  'start_session()/close_session(). opened_by_membership_id is the real, '
  'permanent attribution field D66 promoted from a disclosed prototype-only '
  'crutch (see product/02c-high-fidelity-prototype/src/domain/types.ts''s '
  'own, now-superseded doc comment on this field) — every Sale-mutating '
  'write and RLS''s own "own current-session activity only" clause resolve '
  '"my own active Session" through it.';

create index if not exists sessions_business_id_idx on public.sessions (business_id);
create index if not exists sessions_event_id_idx on public.sessions (event_id);
-- "Never ask twice" (D66) — at most one *active* Session per Membership,
-- ever. Partial (status='active' only) so a Membership may accumulate any
-- number of *closed* Sessions across days without ever colliding with this
-- constraint.
create unique index if not exists sessions_one_active_per_membership_idx
  on public.sessions (opened_by_membership_id)
  where status = 'active';

-- ---------------------------------------------------------------------------
-- sales — `domain-model.md`'s `Sale` root. Its own aggregate root, never
-- nested inside Session, specifically so a Sale write never contends on a
-- shared Session-row lock — the <3s bar (`company/backlog.md` #1). `status`
-- is a closed two-value set (`'open' | 'finalized'`) matching the already-
-- built prototype's own `Sale` type exactly — cancelling an open Sale is a
-- plain delete (see `cancel_sale` below), never a third stored status, the
-- identical "no cancelled state exists" shape `store.tsx`'s own
-- `cancelSale()` already holds today.
-- ---------------------------------------------------------------------------
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  session_id uuid not null references public.sessions (id),
  status text not null default 'open' check (status in ('open', 'finalized')),
  finalized_at timestamptz,
  -- `decision-log.md` D58 — the acting Membership that performed this Sale,
  -- stamped once at Sale creation (its own first item), immutable thereafter.
  performed_by_membership_id uuid not null references public.business_memberships (id),
  created_at timestamptz not null default now()
);

comment on table public.sales is
  'Selling context aggregate root (domain-model.md, decision-log.md D58). '
  'No direct INSERT/UPDATE/DELETE policy for anon/authenticated — only via '
  'add_item_to_sale()/add_item_to_sale_by_tag() (mint-or-find), '
  'finalize_sale() (status flip), cancel_sale() (plain delete, cascades to '
  'sale_items).';

create index if not exists sales_business_id_idx on public.sales (business_id);
create index if not exists sales_session_id_idx on public.sales (session_id);
-- At most one *open* Sale per Session, ever — the real, enforced form of
-- the invariant `store.tsx`'s own `sales.find((sa) => sa.sessionId ===
-- sessionId && sa.status === 'open')` already assumed client-side.
create unique index if not exists sales_one_open_per_session_idx
  on public.sales (session_id)
  where status = 'open';

-- ---------------------------------------------------------------------------
-- sale_items — internal-only entity owned by Sale. `unit_id` uniqueness
-- structurally enforces "a unit sells at most once, ever" — the same
-- physical-location-exclusivity invariant Phase 1's own `nfc_tags.unit_id`
-- uniqueness already enforces for tag assignment.
-- ---------------------------------------------------------------------------
create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  sale_id uuid not null references public.sales (id) on delete cascade,
  product_id uuid not null references public.products (id),
  unit_id uuid not null unique references public.inventory_units (id),
  price_paid numeric not null check (price_paid >= 0),
  created_at timestamptz not null default now()
);

comment on table public.sale_items is
  'Internal-only entity owned by Sale (domain-model.md). Only ever written '
  'inside add_item_to_sale()/add_item_to_sale_by_tag() (insert) or '
  'remove_sale_item()/cancel_sale() (delete) — no direct client '
  'INSERT/UPDATE/DELETE grant. unit_id is unique: a physical unit sells at '
  'most once, ever.';

create index if not exists sale_items_business_id_idx on public.sale_items (business_id);
create index if not exists sale_items_sale_id_idx on public.sale_items (sale_id);

-- ---------------------------------------------------------------------------
-- caller_membership_id — new RLS helper (this phase), same SECURITY DEFINER/
-- STABLE shape as Phase 0's `is_active_member_of`/`is_active_owner_of`
-- (bypasses RLS internally, so the membership read it performs is a single,
-- non-recursive lookup). Resolves the caller's own active Membership for a
-- Business — every RPC below that needs "this device's own acting
-- Membership" resolves it through this, from `auth.uid()` alone, rather than
-- trusting a client-supplied membership id (the same "never trust the
-- client for an authorization-relevant identity" posture every other
-- SECURITY DEFINER function in this file family already holds). Also used
-- directly inside `sessions_select`/`sales_select`/`sale_items_select`
-- below, for the confirmed Q24/Q25 permission table's "SELLER: ... own
-- current-session activity only" clause.
-- ---------------------------------------------------------------------------
create or replace function public.caller_membership_id(p_business_id uuid)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select id from public.business_memberships
  where business_id = p_business_id
    and user_id = auth.uid()
    and status = 'active'
  limit 1;
$$;

revoke execute on function public.caller_membership_id(uuid) from public;
grant execute on function public.caller_membership_id(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------------------
alter table public.venues enable row level security;
alter table public.events enable row level security;
alter table public.price_overrides enable row level security;
alter table public.sessions enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

-- venues/events/price_overrides — any active member reads (OWNER + SELLER,
-- matching Phase 1's own products/inventory_units precedent: a SELLER
-- resolves Event/Venue display facts and qualifying-Event checks on Home,
-- `home.md` §2). No INSERT/UPDATE/DELETE policy for any role — every write
-- goes through the SECURITY DEFINER RPCs below (OWNER-only, re-checked
-- inside each function body).
create policy venues_select on public.venues
  for select
  using (public.is_active_member_of(business_id));

create policy events_select on public.events
  for select
  using (public.is_active_member_of(business_id));

create policy price_overrides_select on public.price_overrides
  for select
  using (public.is_active_member_of(business_id));

grant select on public.venues to authenticated;
grant select on public.events to authenticated;
grant select on public.price_overrides to authenticated;

-- sessions — an OWNER reads every Session for her Business (business-level
-- Resultados, staffing oversight); a SELLER reads only her own (Q24/Q25's
-- "own current-session activity only"). No direct INSERT/UPDATE policy —
-- only start_session()/close_session().
create policy sessions_select on public.sessions
  for select
  using (
    public.is_active_owner_of(business_id)
    or opened_by_membership_id = public.caller_membership_id(business_id)
  );

grant select on public.sessions to authenticated;

-- sales/sale_items — same OWNER-reads-all / SELLER-reads-own-Sales shape,
-- resolved through performed_by_membership_id (Sale) or the owning Sale's
-- own performed_by_membership_id (SaleItem, via a join — sale_items has no
-- membership column of its own).
create policy sales_select on public.sales
  for select
  using (
    public.is_active_owner_of(business_id)
    or performed_by_membership_id = public.caller_membership_id(business_id)
  );

grant select on public.sales to authenticated;

create policy sale_items_select on public.sale_items
  for select
  using (
    public.is_active_owner_of(business_id)
    or exists (
      select 1 from public.sales s
      where s.id = sale_items.sale_id
        and s.performed_by_membership_id = public.caller_membership_id(sale_items.business_id)
    )
  );

grant select on public.sale_items to authenticated;

-- ---------------------------------------------------------------------------
-- create_event — events.md §3.6 "Guardar evento." Atomic venue create-or-
-- reuse (mint-or-find by case-insensitive, trimmed display_name, matching
-- `store.tsx`'s own `resolveVenue`) + Event insert, full idempotency
-- treatment. OWNER-only ("Event create/edit/pricing").
-- ---------------------------------------------------------------------------
create or replace function public.create_event(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_venue_id uuid, -- an already-real Venue, or NULL to mint one from p_venue_display_name
  p_venue_display_name text,
  p_type text,
  p_start_date date,
  p_end_date date,
  p_bazaar_cost numeric
)
returns table (event_id uuid, venue_id uuid)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_venue_id uuid;
  v_event_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_venue_id is null and (p_venue_display_name is null or trim(p_venue_display_name) = '') then
    raise exception 'venue_required' using errcode = 'P0002';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'create_event')
  on conflict (id) do nothing
  returning id into v_key_id;

  if v_key_id is null then
    select result into v_existing_result
    from public.idempotency_keys
    where id = p_idempotency_key;

    if v_existing_result is null then
      raise exception 'idempotent_operation_in_progress' using errcode = '55000';
    end if;

    return query
      select (v_existing_result ->> 'event_id')::uuid, (v_existing_result ->> 'venue_id')::uuid;
    return;
  end if;

  if p_venue_id is not null then
    if not exists (select 1 from public.venues where id = p_venue_id and business_id = p_business_id) then
      raise exception 'venue_not_found' using errcode = 'P0002';
    end if;
    v_venue_id := p_venue_id;
  else
    -- events.md §3.6/§3.7's own "mint-or-find" resolution (`resolveVenue`,
    -- store.tsx) — a typed name matches an existing Venue case-
    -- insensitively (trimmed) before minting a new one, so two near-
    -- identical taps of "Guardar evento" don't silently fork the same
    -- physical place into two Venue rows.
    select id into v_venue_id
    from public.venues
    where business_id = p_business_id
      and lower(trim(display_name)) = lower(trim(p_venue_display_name));

    if v_venue_id is null then
      insert into public.venues (business_id, display_name)
      values (p_business_id, trim(p_venue_display_name))
      returning id into v_venue_id;
    end if;
  end if;

  insert into public.events (business_id, venue_id, type, start_date, end_date, bazaar_cost)
  values (p_business_id, v_venue_id, p_type, p_start_date, p_end_date, p_bazaar_cost)
  returning id into v_event_id;

  update public.idempotency_keys
  set result = jsonb_build_object('event_id', v_event_id, 'venue_id', v_venue_id)
  where id = p_idempotency_key;

  return query select v_event_id, v_venue_id;
end;
$$;

revoke execute on function public.create_event(uuid, uuid, uuid, text, text, date, date, numeric) from public;
grant execute on function public.create_event(uuid, uuid, uuid, text, text, date, date, numeric) to authenticated;

-- ---------------------------------------------------------------------------
-- cancel_event — events.md §3.12/§2, naturally-idempotent status flip, no
-- client-supplied key needed (matches `revoke_membership`'s own precedent,
-- Phase 0). Meaningful only while the Event's *computed* status is still
-- 'scheduled' — a no-op otherwise (already cancelled, or active/closed by
-- date), matching `store.tsx`'s own existing defensive-guard style rather
-- than a thrown error. OWNER-only.
-- ---------------------------------------------------------------------------
create or replace function public.cancel_event(
  p_business_id uuid,
  p_event_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- "Today" resolved server-side (`current_date`, the database's own
  -- session time zone) rather than trusting a client-supplied date — a
  -- defensive re-check only (the real UI only ever offers "Cancelar evento"
  -- from the scheduled detail screen, §3.11), so the small day-boundary
  -- imprecision a UTC-vs-device-local mismatch could introduce at the exact
  -- start-date edge is the same order of tolerance this guard already
  -- accepted client-side.
  update public.events
  set cancelled_at = now()
  where id = p_event_id
    and business_id = p_business_id
    and cancelled_at is null
    and current_date < start_date;
end;
$$;

revoke execute on function public.cancel_event(uuid, uuid) from public;
grant execute on function public.cancel_event(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- set_price_override — events.md §3.20 (D33). Upsert, light idempotency (an
-- audit-trail row only, same shape `update_product_price` already
-- established in Phase 1 — no cached-result replay branch, since an upsert
-- has no duplicate-creation side effect to guard against). Defensively
-- re-checks the Event's computed status is still 'scheduled' at write time
-- — "unreachable at all once active, not just hidden," per §3.20 — a no-op,
-- never a thrown error, when it isn't. OWNER-only.
-- ---------------------------------------------------------------------------
create or replace function public.set_price_override(
  p_business_id uuid,
  p_event_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid,
  p_override_price numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'set_price_override')
  on conflict (id) do nothing;

  if not exists (
    select 1 from public.events
    where id = p_event_id
      and business_id = p_business_id
      and cancelled_at is null
      and current_date < start_date
  ) then
    return;
  end if;

  insert into public.price_overrides (business_id, event_id, product_id, override_price)
  values (p_business_id, p_event_id, p_product_id, p_override_price)
  on conflict (event_id, product_id)
  do update set override_price = excluded.override_price;
end;
$$;

revoke execute on function public.set_price_override(uuid, uuid, uuid, uuid, numeric) from public;
grant execute on function public.set_price_override(uuid, uuid, uuid, uuid, numeric) to authenticated;

-- ---------------------------------------------------------------------------
-- start_session — home.md §2/events.md §2. Naturally safe under concurrent
-- double-submission via `ON CONFLICT` against `sessions_one_active_per_
-- membership_idx` — no client-supplied idempotency key needed, the same
-- mint-or-find shape `accept_invitation` (Phase 0) already established for
-- its own uniqueness constraint. Any active member (OWNER or SELLER) may
-- open her own Session.
--
-- `p_operating_mode` is resolved client-side (`nfcCapable`/`nfcReadiness`
-- plus Ana's own per-tap override choice, `store.tsx`'s own `startSession`
-- doc comment — a one-off, per-tap choice with no other honest server-side
-- source) and passed in as already-resolved. The one boundary this function
-- does re-check, defensively, server-side: `'nfc'` is only ever a
-- legitimate resolution for a Paid-tier Business (`decision-log.md` D27) —
-- never trusted from the client for this specific entitlement-relevant
-- fact, unlike the readiness *threshold* itself (a disclosed, non-security-
-- sensitive heuristic, `NFC_READINESS_THRESHOLD`).
-- ---------------------------------------------------------------------------
create or replace function public.start_session(
  p_business_id uuid,
  p_event_id uuid,
  p_operating_mode text
)
returns table (session_id uuid, event_id uuid, operating_mode text, opened_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
  v_resolved_mode text := p_operating_mode;
  v_session_id uuid;
  v_session_event_id uuid;
  v_session_mode text;
  v_session_opened_at timestamptz;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if v_resolved_mode not in ('buttons', 'nfc') then
    raise exception 'invalid_operating_mode' using errcode = 'P0002';
  end if;

  if v_resolved_mode = 'nfc' and not exists (
    select 1 from public.businesses where id = p_business_id and subscription_tier = 'paid'
  ) then
    v_resolved_mode := 'buttons';
  end if;

  -- "Never ask twice" — a concurrent double-submission (two rapid taps, a
  -- retried request) resolves to the already-open Session rather than
  -- racing to open a second one.
  insert into public.sessions (business_id, event_id, operating_mode, opened_by_membership_id)
  values (p_business_id, p_event_id, v_resolved_mode, v_membership_id)
  on conflict (opened_by_membership_id) where status = 'active' do nothing
  returning id, event_id, operating_mode, opened_at
  into v_session_id, v_session_event_id, v_session_mode, v_session_opened_at;

  if v_session_id is null then
    select id, event_id, operating_mode, opened_at
    into v_session_id, v_session_event_id, v_session_mode, v_session_opened_at
    from public.sessions
    where opened_by_membership_id = v_membership_id and status = 'active';
  end if;

  return query select v_session_id, v_session_event_id, v_session_mode, v_session_opened_at;
end;
$$;

revoke execute on function public.start_session(uuid, uuid, text) from public;
grant execute on function public.start_session(uuid, uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- add_item_to_sale — the <3s-critical write (`company/backlog.md` #1).
-- `FOR UPDATE SKIP LOCKED` FIFO pick (D5) + atomic available->reserved flip
-- + Sale mint-or-find + SaleItem insert, all in one transaction — the
-- identical concurrency-safety mechanism `assign_tag_to_next_pending_unit`
-- (Phase 1) already established, over the exact index
-- (`inventory_units_fifo_idx`) that migration's own fix round reserved for
-- this real, different future use. Idempotency-keyed per logical "add this
-- item" tap — a lost-response retry replays the cached result rather than
-- risking a second physical unit sold for one tap (see `store.tsx`'s own
-- `addItemToSale`/`Selling.tsx`'s per-product idempotency-key ref, mirroring
-- `commitLot`'s own fix). Any active member (OWNER or SELLER) may sell
-- against her own Session.
--
-- **Plain Business-wide FIFO only — Phase 2b's own EventAllocation-aware
-- compare-and-swap (an open EventAllocation's own committed pool taking
-- priority over this plain pool) extends this exact FIFO-pick statement
-- later. Not built here — EventAllocation/AllocationMovement are confirmed
-- out of this phase's scope, three independent ways.**
-- ---------------------------------------------------------------------------
create or replace function public.add_item_to_sale(
  p_business_id uuid,
  p_product_id uuid,
  p_idempotency_key uuid
)
returns table (sale_id uuid, sale_item_id uuid, unit_id uuid, price_paid numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_membership_id uuid;
  v_session_id uuid;
  v_event_id uuid;
  v_operating_mode text;
  v_unit_id uuid;
  v_default_price numeric;
  v_override_price numeric;
  v_price_paid numeric;
  v_sale_id uuid;
  v_sale_item_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- Idempotency (architecture-principles.md #7/D30) — one key per logical
  -- tap, reused unchanged across a retry of that same tap. A conflict
  -- replays the cached result rather than re-running the write.
  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'add_item_to_sale')
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
      raise exception using message = v_existing_result ->> 'error', errcode = 'P0001';
    end if;

    return query
      select
        (v_existing_result ->> 'sale_id')::uuid,
        (v_existing_result ->> 'sale_item_id')::uuid,
        (v_existing_result ->> 'unit_id')::uuid,
        (v_existing_result ->> 'price_paid')::numeric;
    return;
  end if;

  -- home.md §2 step 1 — this device's own acting Membership's active
  -- Session, resolved server-side (`sessions_one_active_per_membership_idx`
  -- guarantees at most one), never trusted from the client.
  select id, event_id, operating_mode into v_session_id, v_event_id, v_operating_mode
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    -- Best-effort cache write only — does not survive this transaction's own
    -- abort below (same PL/pgSQL transaction-abort semantics Phase 0's own
    -- fix round already documented in full for `accept_invitation`; a retry
    -- simply re-derives the identical outcome by re-running this same check,
    -- which stays correct either way).
    update public.idempotency_keys set result = jsonb_build_object('error', 'no_active_session')
    where id = p_idempotency_key;
    raise exception 'no_active_session' using errcode = 'P0001';
  end if;

  if v_operating_mode <> 'buttons' then
    update public.idempotency_keys set result = jsonb_build_object('error', 'wrong_operating_mode')
    where id = p_idempotency_key;
    raise exception 'wrong_operating_mode' using errcode = 'P0001';
  end if;

  select iu.id into v_unit_id
  from public.inventory_units iu
  where iu.business_id = p_business_id and iu.product_id = p_product_id and iu.status = 'available'
  order by iu.received_at asc
  for update of iu skip locked
  limit 1;

  if v_unit_id is null then
    update public.idempotency_keys set result = jsonb_build_object('error', 'out_of_stock')
    where id = p_idempotency_key;
    raise exception 'out_of_stock' using errcode = 'P0001';
  end if;

  -- Price resolution (decision-log.md D33) — this Session's own Event Price
  -- Override for this Product, if any, else the Product's own default_price.
  select default_price into v_default_price from public.products where id = p_product_id;
  if v_event_id is not null then
    select override_price into v_override_price
    from public.price_overrides
    where event_id = v_event_id and product_id = p_product_id;
  end if;
  v_price_paid := coalesce(v_override_price, v_default_price);

  update public.inventory_units set status = 'reserved' where id = v_unit_id;

  -- Find-or-create this Session's own open Sale (`sales_one_open_per_
  -- session_idx` mint-or-find, same ON CONFLICT shape `start_session` above
  -- already uses).
  insert into public.sales (business_id, session_id, status, performed_by_membership_id)
  values (p_business_id, v_session_id, 'open', v_membership_id)
  on conflict (session_id) where status = 'open' do nothing
  returning id into v_sale_id;

  if v_sale_id is null then
    select id into v_sale_id from public.sales where session_id = v_session_id and status = 'open';
  end if;

  insert into public.sale_items (business_id, sale_id, product_id, unit_id, price_paid)
  values (p_business_id, v_sale_id, p_product_id, v_unit_id, v_price_paid)
  returning id into v_sale_item_id;

  update public.idempotency_keys
  set result = jsonb_build_object(
    'sale_id', v_sale_id, 'sale_item_id', v_sale_item_id,
    'unit_id', v_unit_id, 'price_paid', v_price_paid
  )
  where id = p_idempotency_key;

  return query select v_sale_id, v_sale_item_id, v_unit_id, v_price_paid;
end;
$$;

revoke execute on function public.add_item_to_sale(uuid, uuid, uuid) from public;
grant execute on function public.add_item_to_sale(uuid, uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- add_item_to_sale_by_tag — home.md §3.10, the nfc-mode counterpart to
-- add_item_to_sale above: resolves the *specific* scanned unit (one-unit
-- lookup via `nfc_tags`) rather than a FIFO scan, sharing every other piece
-- of its logic (Session resolution, price resolution, Sale mint-or-find,
-- SaleItem insert). A fresh idempotency key per scan (not reused across
-- separate scans — a distinct physical scan is a genuinely new logical
-- attempt, the same posture `assign_tag_to_next_pending_unit` (Phase 1)
-- already established for its own per-scan key).
-- ---------------------------------------------------------------------------
create or replace function public.add_item_to_sale_by_tag(
  p_business_id uuid,
  p_tag_identifier text,
  p_idempotency_key uuid
)
returns table (sale_id uuid, sale_item_id uuid, unit_id uuid, product_id uuid, price_paid numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_membership_id uuid;
  v_session_id uuid;
  v_event_id uuid;
  v_operating_mode text;
  v_unit_id uuid;
  v_product_id uuid;
  v_default_price numeric;
  v_override_price numeric;
  v_price_paid numeric;
  v_sale_id uuid;
  v_sale_item_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'add_item_to_sale_by_tag')
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
      raise exception using message = v_existing_result ->> 'error', errcode = 'P0001';
    end if;

    return query
      select
        (v_existing_result ->> 'sale_id')::uuid,
        (v_existing_result ->> 'sale_item_id')::uuid,
        (v_existing_result ->> 'unit_id')::uuid,
        (v_existing_result ->> 'product_id')::uuid,
        (v_existing_result ->> 'price_paid')::numeric;
    return;
  end if;

  select id, event_id, operating_mode into v_session_id, v_event_id, v_operating_mode
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    update public.idempotency_keys set result = jsonb_build_object('error', 'no_active_session')
    where id = p_idempotency_key;
    raise exception 'no_active_session' using errcode = 'P0001';
  end if;

  -- No dedicated reason code for "wrong mode" — 'no_match' already reads
  -- correctly client-side here (`store.tsx`'s own `addItemToSaleByTag`
  -- comment: "this scan can't resolve to a sellable item right now"), so
  -- it's reused rather than adding a branch nothing in the UI would ever
  -- treat differently.
  if v_operating_mode <> 'nfc' then
    update public.idempotency_keys set result = jsonb_build_object('error', 'no_match')
    where id = p_idempotency_key;
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  select iu.id, iu.product_id into v_unit_id, v_product_id
  from public.inventory_units iu
  join public.nfc_tags nt on nt.unit_id = iu.id
  where nt.business_id = p_business_id and nt.tag_identifier = p_tag_identifier and iu.status = 'available'
  for update of iu skip locked;

  if v_unit_id is null then
    update public.idempotency_keys set result = jsonb_build_object('error', 'no_match')
    where id = p_idempotency_key;
    raise exception 'no_match' using errcode = 'P0001';
  end if;

  select default_price into v_default_price from public.products where id = v_product_id;
  if v_event_id is not null then
    select override_price into v_override_price
    from public.price_overrides
    where event_id = v_event_id and product_id = v_product_id;
  end if;
  v_price_paid := coalesce(v_override_price, v_default_price);

  update public.inventory_units set status = 'reserved' where id = v_unit_id;

  -- NFC-mode allocation (`EventAllocation.allocatedUnitIds`) is out of this
  -- slice's scope (Phase 2b), same as `add_item_to_sale` above — no
  -- compare-and-swap performed here.
  insert into public.sales (business_id, session_id, status, performed_by_membership_id)
  values (p_business_id, v_session_id, 'open', v_membership_id)
  on conflict (session_id) where status = 'open' do nothing
  returning id into v_sale_id;

  if v_sale_id is null then
    select id into v_sale_id from public.sales where session_id = v_session_id and status = 'open';
  end if;

  insert into public.sale_items (business_id, sale_id, product_id, unit_id, price_paid)
  values (p_business_id, v_sale_id, v_product_id, v_unit_id, v_price_paid)
  returning id into v_sale_item_id;

  update public.idempotency_keys
  set result = jsonb_build_object(
    'sale_id', v_sale_id, 'sale_item_id', v_sale_item_id,
    'unit_id', v_unit_id, 'product_id', v_product_id, 'price_paid', v_price_paid
  )
  where id = p_idempotency_key;

  return query select v_sale_id, v_sale_item_id, v_unit_id, v_product_id, v_price_paid;
end;
$$;

revoke execute on function public.add_item_to_sale_by_tag(uuid, text, uuid) from public;
grant execute on function public.add_item_to_sale_by_tag(uuid, text, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- remove_sale_item — home.md §3.8a "Quitar de la venta." Naturally
-- idempotent by id (an already-removed SaleItem is a no-op) — no client
-- key needed. Plain reserved->available revert — see `add_item_to_sale`'s
-- own comment on the EventAllocation/Phase 2b boundary: this phase's units
-- carry no server-side EventAllocation concept to revert *to* instead.
-- ---------------------------------------------------------------------------
create or replace function public.remove_sale_item(
  p_business_id uuid,
  p_sale_item_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
  v_unit_id uuid;
  v_sale_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select unit_id, sale_id into v_unit_id, v_sale_id
  from public.sale_items
  where id = p_sale_item_id and business_id = p_business_id;

  if v_unit_id is null then
    return; -- already removed, or never existed — no-op
  end if;

  -- Defensive scope check — "Quitar de la venta" is only ever offered from
  -- within one's own in-progress (open) Sale on one's own active Session.
  if not exists (
    select 1
    from public.sales s
    join public.sessions se on se.id = s.session_id
    where s.id = v_sale_id
      and s.status = 'open'
      and se.opened_by_membership_id = v_membership_id
  ) then
    return; -- defensive no-op, matching store.tsx's existing guard style
  end if;

  delete from public.sale_items where id = p_sale_item_id;
  update public.inventory_units set status = 'available' where id = v_unit_id;
end;
$$;

revoke execute on function public.remove_sale_item(uuid, uuid) from public;
grant execute on function public.remove_sale_item(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- cancel_sale — home.md §3.8a's "Cancelar" (the whole open Sale, all at
-- once). Naturally idempotent (no open Sale on this Session -> no-op) — no
-- client key needed. Plain delete, cascading to sale_items — matches
-- `Sale.status`'s own closed two-value set (no 'cancelled' status exists,
-- `store.tsx`'s own `cancelSale()` already removes the row outright).
-- ---------------------------------------------------------------------------
create or replace function public.cancel_sale(
  p_business_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
  v_session_id uuid;
  v_sale_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select id into v_session_id
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is null then
    return;
  end if;

  select id into v_sale_id from public.sales where session_id = v_session_id and status = 'open';

  if v_sale_id is null then
    return;
  end if;

  update public.inventory_units
  set status = 'available'
  where id in (select unit_id from public.sale_items where sale_id = v_sale_id);

  delete from public.sales where id = v_sale_id; -- cascades to sale_items
end;
$$;

revoke execute on function public.cancel_sale(uuid) from public;
grant execute on function public.cancel_sale(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- finalize_sale — home.md §3.8c/§3.8f "Finalizar Venta." The one real,
-- consequential per-Sale write (marks every sold unit `status='sold'`,
-- flips the Sale to 'finalized') — idempotency-keyed like `add_item_to_sale`
-- above, so a lost-response retry replays the same outcome rather than
-- risking any double-processing. `total`/`itemCount` stay a client-side
-- computation over the already-mirrored `Sale.items` (unchanged from
-- today) — this function only confirms the write and returns
-- `finalized_at`.
-- ---------------------------------------------------------------------------
create or replace function public.finalize_sale(
  p_business_id uuid,
  p_idempotency_key uuid
)
returns table (sale_id uuid, finalized_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_membership_id uuid;
  v_session_id uuid;
  v_sale_id uuid;
  v_finalized_at timestamptz := now();
  v_item_count int;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'finalize_sale')
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
      raise exception using message = v_existing_result ->> 'error', errcode = 'P0001';
    end if;

    return query
      select
        (v_existing_result ->> 'sale_id')::uuid,
        (v_existing_result ->> 'finalized_at')::timestamptz;
    return;
  end if;

  select id into v_session_id
  from public.sessions
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';

  if v_session_id is not null then
    select id into v_sale_id from public.sales where session_id = v_session_id and status = 'open';
  end if;

  if v_sale_id is not null then
    select count(*) into v_item_count from public.sale_items where sale_id = v_sale_id;
  end if;

  if v_sale_id is null or v_item_count = 0 then
    update public.idempotency_keys set result = jsonb_build_object('error', 'no_open_sale')
    where id = p_idempotency_key;
    raise exception 'no_open_sale' using errcode = 'P0001';
  end if;

  update public.inventory_units
  set status = 'sold'
  where id in (select unit_id from public.sale_items where sale_id = v_sale_id);

  update public.sales
  set status = 'finalized', finalized_at = v_finalized_at
  where id = v_sale_id;

  update public.idempotency_keys
  set result = jsonb_build_object('sale_id', v_sale_id, 'finalized_at', v_finalized_at)
  where id = p_idempotency_key;

  return query select v_sale_id, v_finalized_at;
end;
$$;

revoke execute on function public.finalize_sale(uuid, uuid) from public;
grant execute on function public.finalize_sale(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- close_session — home.md §3.7 "Cerrar jornada de venta." Naturally-
-- idempotent status flip, no client key needed (matches `cancel_event`'s
-- own precedent above). **Deliberately does not independently block on an
-- open Sale** — matches `store.tsx`'s own existing behavior; that guarantee
-- lives in the UI flow (`Selling.tsx`'s own "tienes una venta sin
-- terminar" blocked-close sheet), not a new server-side check an approved
-- spec never called for.
-- ---------------------------------------------------------------------------
create or replace function public.close_session(
  p_business_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_membership_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  v_membership_id := public.caller_membership_id(p_business_id);
  if v_membership_id is null then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  update public.sessions
  set status = 'closed', closed_at = now()
  where business_id = p_business_id and opened_by_membership_id = v_membership_id and status = 'active';
end;
$$;

revoke execute on function public.close_session(uuid) from public;
grant execute on function public.close_session(uuid) to authenticated;
