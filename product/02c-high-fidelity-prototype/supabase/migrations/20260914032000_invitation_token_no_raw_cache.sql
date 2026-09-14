-- Stage 7 Backend Integration — `architect` Blocker fix on
-- `20260914030000_invitation_token_write_path.sql` (and its own fix round,
-- `20260914031000_invitation_token_write_path_fix.sql`, whose Paid-tier
-- re-check on `regenerate_invitation` is preserved below, not regressed).
--
-- `reviewer` flagged that both `create_invitation` and `regenerate_invitation`
-- cached the raw token in `idempotency_keys.result`, framed at the time as a
-- "deliberate, narrow exception" to "never store the raw token." `architect`
-- found that framing wrong against RFC 0013/`decision-log.md` D64's actual
-- threat model: D64 is about a full database dump/leak, not an
-- application-layer RLS bypass — `idempotency_keys` holding zero RLS
-- policies never made the raw token safe to persist there, it only meant no
-- *client* could read it back through PostgREST. A DB dump doesn't care
-- about RLS at all.
--
-- Fix: stop caching the raw token in `idempotency_keys.result`, full stop —
-- both functions now match every other idempotency-keyed write in this
-- codebase (never persist a secret in the replay cache, only confirmation
-- data). A replay of either function after a dropped response returns
-- `token: null` — proof the operation already completed, but not a way to
-- recover the secret. Recovery path: `regenerate_invitation`'s precondition
-- loosens from "genuinely expired" to "still `pending`" (any pending row,
-- not just an expired one), so it becomes the legitimate way to get a fresh,
-- displayable token after a lost `create_invitation` response — matching
-- `settings.md` §3.11's already-Approved UI, which is untouched by this
-- migration: the `[ Generar otra ]` button stays gated to expired rows only
-- in the UI. Only the backend function's precondition loosens.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- create_invitation — mints a new Invitation for a Business. OWNER-only,
-- Paid-tier-gated (re-checked server-side, not trusted from the client),
-- idempotency-keyed per architecture-principles.md #7/D30.
--
-- `idempotency_keys.result` never carries the raw token here, same as every
-- other idempotency-keyed write in this codebase — the `invitations` table
-- only ever gets the hash, and now neither does the replay cache. A genuine
-- dropped-response retry (the `v_key_id is null` branch below) returns
-- confirmation (`invitation_id`, `expires_at`) but not the secret; if the
-- caller actually lost the one-time token display, the recovery path is
-- `regenerate_invitation`, not a replay of this function.
-- ---------------------------------------------------------------------------
create or replace function public.create_invitation(
  p_business_id uuid,
  p_idempotency_key uuid,
  p_target_hint jsonb default null
)
returns table (invitation_id uuid, token text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_tier text;
  v_generated record;
  v_invitation_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if not public.is_active_owner_of(p_business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select subscription_tier into v_tier
  from public.businesses
  where id = p_business_id;

  if not found then
    raise exception 'business_not_found' using errcode = 'P0002';
  end if;

  if v_tier <> 'paid' then
    raise exception 'paid_tier_required' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, p_business_id, 'create_invitation')
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
      select
        (v_existing_result ->> 'invitation_id')::uuid,
        null::text,
        (v_existing_result ->> 'expires_at')::timestamptz;
    return;
  end if;

  select * into v_generated from public._generate_invitation_token();

  insert into public.invitations (business_id, token_hash, expires_at, target_hint)
  values (p_business_id, v_generated.token_hash, v_generated.expires_at, p_target_hint)
  returning id into v_invitation_id;

  update public.idempotency_keys
  set business_id = p_business_id,
      result = jsonb_build_object(
        'invitation_id', v_invitation_id,
        'expires_at', v_generated.expires_at
      )
  where id = p_idempotency_key;

  return query select v_invitation_id, v_generated.token, v_generated.expires_at;
end;
$$;

revoke execute on function public.create_invitation(uuid, uuid, jsonb) from public;
grant execute on function public.create_invitation(uuid, uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- regenerate_invitation — in-place token/expiry mutation on any still-
-- `pending` Invitation (loosened from "genuinely expired"). OWNER-only,
-- Paid-tier-gated (re-check preserved from
-- `20260914031000_invitation_token_write_path_fix.sql`, not regressed by
-- this `create or replace`), idempotency-keyed.
--
-- Now runs on any still-`pending` Invitation, expired or not: an OWNER may
-- regenerate a still-valid link at will (e.g. self-invalidate a leaked or
-- misdirected link), and this is also the legitimate recovery path for a
-- dropped `create_invitation` response, since neither function persists the
-- raw token anywhere beyond its own single response. `settings.md` §3.11's
-- Approved UI is unaffected — the `[ Generar otra ]` button stays gated to
-- expired rows only there; only this function's own precondition loosens.
-- Re-checks server-side that the row is genuinely still `pending` — never
-- trusts a stale client read, the same discipline every other CAS-guarded
-- write in this codebase already holds (`accept_invitation`'s own token
-- CAS). `idempotency_keys.result` never carries the raw token here either,
-- same reasoning as `create_invitation` above.
-- ---------------------------------------------------------------------------
create or replace function public.regenerate_invitation(
  p_invitation_id uuid,
  p_idempotency_key uuid
)
returns table (token text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_uid uuid := auth.uid();
  v_key_id uuid;
  v_existing_result jsonb;
  v_invitation record;
  v_tier text;
  v_generated record;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into v_invitation
  from public.invitations
  where id = p_invitation_id;

  if not found then
    raise exception 'invitation_not_found' using errcode = 'P0002';
  end if;

  if not public.is_active_owner_of(v_invitation.business_id) then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  -- Paid-tier re-check, keyed off the Invitation's own `business_id` rather
  -- than a client-supplied one — preserved from
  -- `20260914031000_invitation_token_write_path_fix.sql`.
  select subscription_tier into v_tier
  from public.businesses
  where id = v_invitation.business_id;

  if v_tier <> 'paid' then
    raise exception 'paid_tier_required' using errcode = '42501';
  end if;

  insert into public.idempotency_keys (id, business_id, operation)
  values (p_idempotency_key, v_invitation.business_id, 'regenerate_invitation')
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
      raise exception 'invitation_not_pending' using errcode = 'P0001';
    end if;

    return query
      select
        null::text,
        (v_existing_result ->> 'expires_at')::timestamptz;
    return;
  end if;

  -- Re-read the current row (not the pre-idempotency-insert snapshot above)
  -- — the precondition must hold at write time, same principle as the CAS
  -- in accept_invitation.
  select * into v_invitation
  from public.invitations
  where id = p_invitation_id;

  if v_invitation.status <> 'pending' then
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_pending')
    where id = p_idempotency_key;
    raise exception 'invitation_not_pending' using errcode = 'P0001';
  end if;

  select * into v_generated from public._generate_invitation_token();

  update public.invitations
  set token_hash = v_generated.token_hash,
      expires_at = v_generated.expires_at
  where id = p_invitation_id;

  update public.idempotency_keys
  set result = jsonb_build_object('expires_at', v_generated.expires_at)
  where id = p_idempotency_key;

  return query select v_generated.token, v_generated.expires_at;
end;
$$;

revoke execute on function public.regenerate_invitation(uuid, uuid) from public;
grant execute on function public.regenerate_invitation(uuid, uuid) to authenticated;
