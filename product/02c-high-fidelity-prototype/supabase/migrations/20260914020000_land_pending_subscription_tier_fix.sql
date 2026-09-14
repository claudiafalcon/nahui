-- Stage 7 Backend Integration — hydration-layer fix round, second pass.
-- `reviewer` flagged `land_pending_subscription_tier`
-- (20260914010000_land_pending_subscription_tier.sql) as a Blocker: it
-- returns `void`, so the client (`reconcilePendingSubscriptionTier`,
-- store.tsx) can't distinguish "my call actually landed the change" from
-- "my call was a harmless no-op because a concurrent
-- `cancel_pending_subscription_tier_change` call already won the race" — on
-- any non-error response the client unconditionally applied its own
-- pre-captured tier/effectiveDate to the local mirror, a real false-positive
-- about the merchant's own subscription if the cancel actually won.
--
-- The fix: return `boolean` — `true` only when the conditional UPDATE below
-- actually matched a row (the landing condition genuinely held and the flip
-- actually happened), `false` on the no-op branch. Auth, authorization, and
-- idempotency-key logic are unchanged from 20260914010000 — only the return
-- type and the addition of a row-count check change. Postgres won't let
-- `create or replace function` change an existing function's return type
-- (`cannot change return type of existing function`), so the old `void`
-- signature is dropped first.
-- ---------------------------------------------------------------------------
drop function if exists public.land_pending_subscription_tier(uuid, uuid);

create or replace function public.land_pending_subscription_tier(
  p_business_id uuid,
  p_idempotency_key uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_row_count integer;
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

  get diagnostics v_row_count = row_count;

  -- No `if not found then raise` here, unlike this file's siblings — a
  -- no-op (nothing landed yet, or already landed) is the expected, harmless
  -- outcome for this specific RPC, not an error condition. The caller
  -- distinguishes the two outcomes via this boolean instead.
  return v_row_count > 0;
end;
$$;

revoke execute on function public.land_pending_subscription_tier(uuid, uuid) from public;
grant execute on function public.land_pending_subscription_tier(uuid, uuid) to authenticated;
