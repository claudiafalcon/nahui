-- Stage 7 Backend Integration — `decision-log.md` D69, `product-decisions.md`
-- Q29: `User.displayName`, a new optional, self-service-editable, person-
-- level field.
--
-- `20260913000000_identity_persistence_layer.sql`'s own header explains why
-- `User` itself has no table so far: "Supabase's own `auth.users` already
-- *is* the global, bare person-identity anchor this Foundation's `User`
-- aggregate describes (id + createdAt, nothing else)." `displayName` is the
-- first field this Foundation's `User` aggregate has ever needed beyond
-- that bare anchor — `auth.users` isn't a table this project's own
-- migrations should extend directly (a Supabase-managed system table), so
-- this migration adds the minimal, additive `public.users` table this one
-- new fact actually needs, following the exact "point at `auth.users(id)`
-- directly rather than duplicating it" precedent every other Identity
-- table already sets for `user_id` columns — here inverted into the
-- primary key itself, since this table *is* the per-User row, not a
-- reference to one.
--
-- **Disclosed limitation, not fixed here — the same pre-existing gap every
-- other real write in this schema already has for the phone channel**
-- (`store.tsx`'s own `resolveAuthIdentity` doc comment, `realUserId`):
-- Nahui's custom WhatsApp-OTP flow never creates a real `auth.users` row at
-- all (`config.toml`'s own note) — a phone-verified merchant's `User.id` is
-- a client-minted mock. `id references auth.users(id)` below would reject
-- a write for such a merchant outright (no matching `auth.users` row to
-- reference), and `auth.uid()` is `null` for her regardless (no real
-- Supabase Auth session exists for phone today), so `update_user_display_
-- name` below already fails closed for her before the FK would ever even
-- matter — consistent with, not worse than, every other real write this
-- schema already has (`create_business_with_owner`, `commit_lot`, etc.),
-- none of which work for a phone-only session yet either. Not this
-- migration's gap to close.
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

comment on table public.users is
  'Identity context (domain-model.md `User`, decision-log.md D69). No row '
  'exists here until a User''s first `update_user_display_name` call — this '
  'table stores only the one fact beyond auth.users'' own bare anchor '
  '(id + createdAt) this Foundation''s User aggregate has needed so far. A '
  'missing row means "no displayName set," the same honest default as an '
  'explicit null.';

-- RLS: a user reads her own row; an OWNER also reads every row belonging
-- to a User who holds a `business_memberships` row (active or revoked —
-- "Tu equipo" shows a revoked row's identity too, settings.md §3.11) in a
-- Business she actively owns. Update is strictly own-row-only — no action
-- in this product ever writes another User's displayName.
alter table public.users enable row level security;

create policy users_select_own on public.users
  for select
  using (id = auth.uid());

create policy users_select_as_owner on public.users
  for select
  using (
    exists (
      select 1
      from public.business_memberships bm
      where bm.user_id = public.users.id
        and public.is_active_owner_of(bm.business_id)
    )
  );

create policy users_update_own on public.users
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

grant select, update on public.users to authenticated;

-- ---------------------------------------------------------------------------
-- update_user_display_name — the one write path for this field
-- (`settings.md` §3.3b, `onboarding.md` §3.10). SECURITY DEFINER, matching
-- every other write in this schema's own convention (`update_business_
-- identity`, `update_product_price`) — an upsert, not a bare `UPDATE`,
-- since a row may not exist yet for a User who has never set a name
-- before; the plain RLS `users_update_own` policy above stays real,
-- defense-in-depth documentation of the intended access rule, matching how
-- `businesses_update`'s own RLS policy already coexists with `update_
-- business_identity`'s RPC.
--
-- No idempotency-key replay branch — overwriting a field has no duplicate-
-- creation side effect to guard against, the identical reasoning `update_
-- product_price`/`update_product_photo` already state for skipping one.
-- ---------------------------------------------------------------------------
create or replace function public.update_user_display_name(
  p_display_name text
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

  insert into public.users (id, display_name)
  values (v_uid, nullif(btrim(p_display_name), ''))
  on conflict (id) do update set display_name = excluded.display_name;
end;
$$;

revoke execute on function public.update_user_display_name(text) from public;
grant execute on function public.update_user_display_name(text) to authenticated;
