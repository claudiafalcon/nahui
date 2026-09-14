-- Stage 7 Backend Integration — closes the second hydration-layer gap
-- `reviewer` flagged in the same fix round as 20260914000000: the client's
-- `reconcilePendingSubscriptionTier` (store.tsx) detects a deferred
-- `subscriptionTier` change's effective date arriving, but never wrote that
-- landing to the real database — only ever mutated the local mirror. Every
-- hydration cycle then re-asserted the un-landed backend row, so the change
-- never actually took effect in the system of record. Same shape as the
-- seven RPCs in 20260914000000_business_settings_writes.sql: SECURITY
-- DEFINER, auth.uid() check first, is_active_owner_of() authorization,
-- idempotency-keyed per architecture-principles.md #7/D30, no cached-result
-- replay branch (an overwrite has no duplicate-creation side effect to guard
-- against, same reasoning update_product_price/update_product_photo
-- (20260913030000_inventory_persistence_layer.sql) already document).
--
-- The landing condition itself is re-checked here, server-side, never
-- trusted from the client — a client racing to call this before the
-- effective date arrives, or after another call already landed it, gets a
-- harmless no-op rather than an error.
-- ---------------------------------------------------------------------------
create or replace function public.land_pending_subscription_tier(
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
  values (p_idempotency_key, p_business_id, 'land_pending_subscription_tier')
  on conflict (id) do nothing;

  update public.businesses
  set subscription_tier = pending_subscription_tier,
      pending_subscription_tier = null,
      pending_subscription_tier_effective_date = null,
      pending_subscription_tier_acknowledged = false
  where id = p_business_id
    and pending_subscription_tier is not null
    and pending_subscription_tier_effective_date <= current_date;

  -- No `if not found then raise` here, unlike this file's siblings — a
  -- no-op (nothing landed yet, or already landed) is the expected, harmless
  -- outcome for this specific RPC, not an error condition.
end;
$$;

revoke execute on function public.land_pending_subscription_tier(uuid, uuid) from public;
grant execute on function public.land_pending_subscription_tier(uuid, uuid) to authenticated;
