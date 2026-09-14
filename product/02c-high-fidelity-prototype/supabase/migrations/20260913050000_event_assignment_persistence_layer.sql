-- Stage 7 Backend Integration, Phase 2c — EventAssignment persistence layer.
--
-- Implements `product/00-foundation/domain-model.md`'s `EventAssignment`
-- root (`product/99-rfc/0011-event-assignment.md`, `decision-log.md` D60) —
-- staff-to-Event scheduling: an OWNER assigns/unassigns a SELLER to a
-- specific Event ahead of Session-open. Design authority:
-- `context/stage-7-backend-integration.md`'s "Phase 2c design summary"
-- (`architect`, 2026-09-13) — one table, RLS, two RPCs. Not restated here in
-- full.
--
-- The scheduling-conflict warning (`hasSchedulingConflict`, `selectors.ts`)
-- needs no server RPC at all — a pure client-side computation over data the
-- RLS design below already grants in the same round trips the screen needs
-- anyway (every `event_assignments` row + every `events` row for the
-- Business). Does NOT touch EventAllocation/AllocationMovement (Phase 2b —
-- separate, not-yet-designed phase).

-- ---------------------------------------------------------------------------
-- event_assignments — `domain-model.md`'s `EventAssignment` root
-- (RFC 0011/D60). Plain hard-delete, no `status` column — RFC 0011 §1's own
-- explicit justification: no downstream write ever references a row here
-- directly (unlike `business_memberships.status`).
-- ---------------------------------------------------------------------------
create table if not exists public.event_assignments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id),
  event_id uuid not null references public.events (id),
  membership_id uuid not null references public.business_memberships (id),
  created_at timestamptz not null default now(),
  unique (event_id, membership_id)
);

comment on table public.event_assignments is
  'Selling context aggregate root (domain-model.md, RFC 0011/D60). No '
  'direct INSERT/UPDATE/DELETE policy for anon/authenticated — only via '
  'assign_to_event()/unassign_from_event() below, both OWNER-only.';

create index if not exists event_assignments_business_id_idx
  on public.event_assignments (business_id);

-- The unique constraint above already provides an index leading with
-- event_id; a Membership-leading lookup ("every EventAssignment row for
-- this Membership" — `eventAssignmentsForMembership`/the qualifying-Event
-- selectors, and this migration's own SELLER RLS policy below) needs its
-- own dedicated index.
create index if not exists event_assignments_membership_id_idx
  on public.event_assignments (membership_id);

-- ---------------------------------------------------------------------------
-- RLS policies — reuses Phase 2's own established shape verbatim: OWNER
-- reads every row for her Business (needed for §3.26's live conflict-
-- warning line, which checks every *other* assignment for every listed
-- Membership, not just this Event's own roster); a SELLER reads only her
-- own rows via `caller_membership_id`.
-- ---------------------------------------------------------------------------
alter table public.event_assignments enable row level security;

create policy event_assignments_select on public.event_assignments
  for select
  using (
    public.is_active_owner_of(business_id)
    or membership_id = public.caller_membership_id(business_id)
  );

grant select on public.event_assignments to authenticated;

-- ---------------------------------------------------------------------------
-- assign_to_event — events.md §3.26 "Personal para este evento," the
-- OWNER-side "assign staff to an Event" write (RFC 0011/D60). Naturally
-- idempotent — `ON CONFLICT DO NOTHING` against the table's own
-- `(event_id, membership_id)` uniqueness — no client-supplied idempotency
-- key needed, matching `revoke_membership`'s own precedent (Phase 0): a
-- plain OWNER-only write with no idempotency key, since the underlying
-- operation is naturally idempotent. Re-verifies `event_id` belongs to
-- `business_id` and the target `membership_id` is `active`, both before
-- writing (the same defensive check Phase 2's own round-1 review found
-- missing on `start_session`/`set_price_override`, applied here from the
-- start).
--
-- No status gate on the Event itself, deliberately — `events.md` §3.26 is
-- reachable from both the `scheduled` and `active` Event-detail screens;
-- adding one would invent a restriction the Approved UX never calls for.
-- ---------------------------------------------------------------------------
create or replace function public.assign_to_event(
  p_business_id uuid,
  p_event_id uuid,
  p_membership_id uuid
)
returns table (assignment_id uuid, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_assignment_id uuid;
  v_created_at timestamptz;
begin
  -- SECURITY DEFINER bypasses RLS by default — re-implementing the
  -- authorization check here, as the first real statement, is not optional.
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Q24/Q25's permission table (product-decisions.md) names "invite/manage
  -- staff" (which this scheduling write is part of) as OWNER-only.
  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.events where id = p_event_id and business_id = p_business_id
  ) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;

  if not exists (
    select 1 from public.business_memberships
    where id = p_membership_id and business_id = p_business_id and status = 'active'
  ) then
    raise exception 'membership_not_found' using errcode = 'P0002';
  end if;

  insert into public.event_assignments (business_id, event_id, membership_id)
  values (p_business_id, p_event_id, p_membership_id)
  on conflict (event_id, membership_id) do nothing
  returning id, event_assignments.created_at into v_assignment_id, v_created_at;

  if v_assignment_id is null then
    -- Already assigned — find-or-no-op (RFC 0011 §1: unique on
    -- `(event_id, membership_id)`, assigning the same pair twice is a no-op
    -- against the existing row, never a duplicate).
    select id, event_assignments.created_at into v_assignment_id, v_created_at
    from public.event_assignments
    where event_id = p_event_id and membership_id = p_membership_id;
  end if;

  return query select v_assignment_id, v_created_at;
end;
$$;

revoke execute on function public.assign_to_event(uuid, uuid, uuid) from public;
grant execute on function public.assign_to_event(uuid, uuid, uuid) to authenticated;

comment on function public.assign_to_event(uuid, uuid, uuid) is
  'OWNER-only. Naturally idempotent (ON CONFLICT DO NOTHING against the '
  '(event_id, membership_id) uniqueness) — no client-supplied idempotency '
  'key, matching revoke_membership''s own precedent. Re-verifies event_id '
  'belongs to business_id and membership_id is active before writing. No '
  'status gate on the Event itself — events.md §3.26 is reachable from '
  'both scheduled and active.';

-- ---------------------------------------------------------------------------
-- unassign_from_event — events.md §3.26 "Quitar," the OWNER-side unassign
-- write. Naturally idempotent — a no-op delete on an already-unassigned
-- pair is already correct — no client-supplied idempotency key needed. Same
-- defensive re-checks and no-status-gate posture as assign_to_event above.
-- ---------------------------------------------------------------------------
create or replace function public.unassign_from_event(
  p_business_id uuid,
  p_event_id uuid,
  p_membership_id uuid
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

  if not exists (
    select 1 from public.events where id = p_event_id and business_id = p_business_id
  ) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;

  if not exists (
    select 1 from public.business_memberships
    where id = p_membership_id and business_id = p_business_id and status = 'active'
  ) then
    raise exception 'membership_not_found' using errcode = 'P0002';
  end if;

  -- A no-op delete on an already-unassigned pair is already correct — no
  -- separate "not found" branch needed.
  delete from public.event_assignments
  where business_id = p_business_id
    and event_id = p_event_id
    and membership_id = p_membership_id;
end;
$$;

revoke execute on function public.unassign_from_event(uuid, uuid, uuid) from public;
grant execute on function public.unassign_from_event(uuid, uuid, uuid) to authenticated;

comment on function public.unassign_from_event(uuid, uuid, uuid) is
  'OWNER-only. Naturally idempotent (a no-op delete on an already-'
  'unassigned pair is already correct) — no client-supplied idempotency '
  'key. Re-verifies event_id belongs to business_id and membership_id is '
  'active before writing, same as assign_to_event.';
