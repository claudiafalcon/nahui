-- Real, live-found gap: `on_auth_identity_created` (`20260913000000_identity
-- _persistence_layer.sql`) only fires on a NEW `auth.identities` insert.
-- Any identity already linked before that trigger was deployed — genuinely
-- reachable, since earlier live testing sessions signed in for real before
-- this migration ever ran — has no corresponding `public.auth_identities`
-- row, which fails `create_business_with_owner`'s own "acting user must
-- hold at least one verified AuthIdentity" check (D44/RFC 0012 §4) with a
-- `not_verified` error. A one-time backfill, not a trigger fix — the
-- trigger itself is correct for every identity linked from this point
-- forward; this closes the gap for what already existed before it did.
--
-- Reuses the trigger function's own exact mapping logic (email/google/apple
-- only, phone excluded — populated separately by verify-otp's own
-- service-role write) rather than duplicating it, and the same
-- `on conflict (type, identifier) do nothing` idempotency the trigger
-- itself already uses, so this is safe to re-run.
insert into public.auth_identities (user_id, type, identifier, verified_at)
select
  ai.user_id,
  case
    when ai.provider = 'email' then 'email'
    when ai.provider in ('google', 'apple') then ai.provider
  end as type,
  case
    when ai.provider = 'email' then lower(trim(ai.identity_data->>'email'))
    when ai.provider in ('google', 'apple') then coalesce(ai.identity_data->>'sub', ai.provider_id)
  end as identifier,
  coalesce(ai.last_sign_in_at, now()) as verified_at
from auth.identities ai
where ai.provider in ('email', 'google', 'apple')
  and case
        when ai.provider = 'email' then lower(trim(ai.identity_data->>'email'))
        when ai.provider in ('google', 'apple') then coalesce(ai.identity_data->>'sub', ai.provider_id)
      end is not null
on conflict (type, identifier) do nothing;
