-- Stage 7 Backend Integration — closes the read-side hydration wholesale-
-- replace gap `reviewer` flagged as a Blocker: `hydrateFromBackend`
-- (store.tsx) replaces `state.business` from the real `businesses` row on
-- every hydration cycle, but seven client-side write functions still only
-- ever mutated the local mirror, never the database — every real Business
-- row stays at its `create_business_with_owner`-time defaults for these
-- fields forever. Same shape as update_product_price/update_product_photo
-- (20260913030000_inventory_persistence_layer.sql): SECURITY DEFINER,
-- auth.uid() check first, is_active_owner_of() authorization, idempotency-
-- keyed per architecture-principles.md #7/D30, no cached-result replay
-- branch (an overwrite has no duplicate-creation side effect to guard
-- against, per that migration's own documented reasoning).

create or replace function public.update_business_identity(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_name text,
  p_logo text default null,
  p_description text default null
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

  if p_name is null or btrim(p_name) = '' then
    raise exception 'name_required' using errcode = '23514';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'update_business_identity')
  on conflict (id) do nothing;

  update public.businesses
  set name = btrim(p_name), logo = p_logo, description = p_description
  where id = p_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.update_business_identity(uuid, uuid, text, text, text) from public;
grant execute on function public.update_business_identity(uuid, uuid, text, text, text) to authenticated;

create or replace function public.acknowledge_onboarding(
  p_business_id uuid,
  p_idempotency_key uuid
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
  values (p_idempotency_key, p_business_id, 'acknowledge_onboarding')
  on conflict (id) do nothing;

  update public.businesses
  set onboarding_acknowledged = true
  where id = p_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.acknowledge_onboarding(uuid, uuid) from public;
grant execute on function public.acknowledge_onboarding(uuid, uuid) to authenticated;

create or replace function public.activate_paid_plan(
  p_business_id uuid,
  p_idempotency_key uuid
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
  values (p_idempotency_key, p_business_id, 'activate_paid_plan')
  on conflict (id) do nothing;

  update public.businesses
  set subscription_tier = 'paid',
      pending_subscription_tier = null,
      pending_subscription_tier_effective_date = null,
      pending_subscription_tier_acknowledged = false
  where id = p_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.activate_paid_plan(uuid, uuid) from public;
grant execute on function public.activate_paid_plan(uuid, uuid) to authenticated;

create or replace function public.request_downgrade_to_free(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_effective_date date
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
  values (p_idempotency_key, p_business_id, 'request_downgrade_to_free')
  on conflict (id) do nothing;

  update public.businesses
  set pending_subscription_tier = 'free',
      pending_subscription_tier_effective_date = p_effective_date,
      pending_subscription_tier_acknowledged = false
  where id = p_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.request_downgrade_to_free(uuid, uuid, date) from public;
grant execute on function public.request_downgrade_to_free(uuid, uuid, date) to authenticated;

create or replace function public.cancel_pending_subscription_tier_change(
  p_business_id uuid,
  p_idempotency_key uuid
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
  values (p_idempotency_key, p_business_id, 'cancel_pending_subscription_tier_change')
  on conflict (id) do nothing;

  update public.businesses
  set pending_subscription_tier = null,
      pending_subscription_tier_effective_date = null,
      pending_subscription_tier_acknowledged = false
  where id = p_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.cancel_pending_subscription_tier_change(uuid, uuid) from public;
grant execute on function public.cancel_pending_subscription_tier_change(uuid, uuid) to authenticated;

create or replace function public.change_default_selling_mode(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_mode text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_tier text;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_mode not in ('buttons', 'nfc') then
    raise exception 'invalid_mode' using errcode = '22023';
  end if;

  select subscription_tier into v_tier from public.businesses where id = p_business_id;
  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;

  if p_mode = 'nfc' and v_tier <> 'paid' then
    raise exception 'nfc_not_available' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'change_default_selling_mode')
  on conflict (id) do nothing;

  update public.businesses
  set default_selling_mode = p_mode
  where id = p_business_id;
end;
$$;

revoke execute on function public.change_default_selling_mode(uuid, uuid, text) from public;
grant execute on function public.change_default_selling_mode(uuid, uuid, text) to authenticated;

create or replace function public.acknowledge_nfc_availability_nudge(
  p_business_id uuid,
  p_idempotency_key uuid
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
  values (p_idempotency_key, p_business_id, 'acknowledge_nfc_availability_nudge')
  on conflict (id) do nothing;

  update public.businesses
  set nfc_availability_nudge_shown = true
  where id = p_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.acknowledge_nfc_availability_nudge(uuid, uuid) from public;
grant execute on function public.acknowledge_nfc_availability_nudge(uuid, uuid) to authenticated;
