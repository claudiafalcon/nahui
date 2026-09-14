-- Stage 7 Backend Integration — Team Invitations real write path (RFC 0013,
-- `decision-log.md` D64; design per `architect`'s report, summarized in
-- `product/02c-high-fidelity-prototype/context/team-invitations-real-wiring.md`).
--
-- `20260913000000_identity_persistence_layer.sql` already created the
-- `invitations` table and `accept_invitation()` (token-keyed CAS,
-- unaffected by this migration). What was missing: the *write* path that
-- actually mints an Invitation, plus a way to resolve one by token before
-- authentication runs at all (RFC 0013 §2's own sequencing —
-- `accept_invitation()` requires `auth.uid()` as its first check, which
-- can't happen before the invited person has authenticated). Four
-- functions, in dependency order:
--   1. `_generate_invitation_token()` — private helper, shared by (2)/(3).
--   2. `create_invitation()` — OWNER-only, Paid-tier-gated, mints a new
--      Invitation.
--   3. `regenerate_invitation()` — OWNER-only, in-place token/expiry
--      mutation on a genuinely expired row.
--   4. `peek_invitation()` — read-only, `anon`+`authenticated`, the
--      pre-auth token resolution RFC 0013 §2 needs.

-- ---------------------------------------------------------------------------
-- _generate_invitation_token — private helper (RFC 0013 §4/§7,
-- `knowledge-mentor`-confirmed against OWASP's Forgot Password Cheat Sheet):
-- 256-bit CSPRNG token, base64url-encoded (URL-safe, no padding), stored
-- hashed (sha256/hex) — the raw value is never persisted by this function
-- itself, only handed back to its caller. 24h expiry window
-- (`settings.md` §2.7a).
--
-- No grant to anon/authenticated below (deliberately) — this is only ever
-- called from inside the SECURITY DEFINER functions below, which execute
-- as this migration's owner and therefore already hold implicit EXECUTE on
-- every function that owner owns. `revoke ... from public` is what actually
-- keeps this un-callable by a client directly.
-- ---------------------------------------------------------------------------
create or replace function public._generate_invitation_token()
returns table (token text, token_hash text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_token text;
begin
  v_token := encode(extensions.gen_random_bytes(32), 'base64');
  v_token := replace(replace(v_token, '+', '-'), '/', '_');
  v_token := regexp_replace(v_token, '=+$', '');

  return query
    select
      v_token,
      encode(digest(v_token, 'sha256'), 'hex'),
      now() + interval '24 hours';
end;
$$;

revoke execute on function public._generate_invitation_token() from public;

-- ---------------------------------------------------------------------------
-- create_invitation — mints a new Invitation for a Business. OWNER-only,
-- Paid-tier-gated (re-checked server-side, not trusted from the client),
-- idempotency-keyed per architecture-principles.md #7/D30.
--
-- Unlike every other idempotency-keyed write in this codebase, the replayed
-- result on retry includes the raw token itself, not just non-secret IDs:
-- the raw token is never persisted anywhere except this row's own
-- `idempotency_keys.result` (the `invitations` table only ever gets the
-- hash). Without replaying it, a client retry after a dropped response
-- would strand an Invitation the caller can never actually share — the
-- token would exist nowhere retrievable. `idempotency_keys` carries zero
-- RLS policies (deny-by-default, see its own table comment in
-- `20260913000000_identity_persistence_layer.sql`) and is only ever
-- touched by SECURITY DEFINER functions, the same trust boundary that
-- already holds the raw token for the brief window before this function's
-- own caller displays/shares it — a deliberate, narrow exception to
-- "never store the raw token," not an oversight.
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
        v_existing_result ->> 'token',
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
        'token', v_generated.token,
        'expires_at', v_generated.expires_at
      )
  where id = p_idempotency_key;

  return query select v_invitation_id, v_generated.token, v_generated.expires_at;
end;
$$;

revoke execute on function public.create_invitation(uuid, uuid, jsonb) from public;
grant execute on function public.create_invitation(uuid, uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- regenerate_invitation — in-place token/expiry mutation on an already-
-- expired Invitation (`settings.md` §4's "Generar otra mutates in place"
-- resolution). OWNER-only, idempotency-keyed. Re-checks server-side that
-- the row is genuinely `pending` and past `expires_at` — never trusts a
-- stale client read, the same discipline every other CAS-guarded write in
-- this codebase already holds (`accept_invitation`'s own token CAS).
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
      raise exception 'invitation_not_expired' using errcode = 'P0001';
    end if;

    return query
      select
        v_existing_result ->> 'token',
        (v_existing_result ->> 'expires_at')::timestamptz;
    return;
  end if;

  -- Re-read the current row (not the pre-idempotency-insert snapshot above)
  -- — the precondition must hold at write time, same principle as the CAS
  -- in accept_invitation.
  select * into v_invitation
  from public.invitations
  where id = p_invitation_id;

  if v_invitation.status <> 'pending' or now() < v_invitation.expires_at then
    update public.idempotency_keys
    set result = jsonb_build_object('error', 'invitation_not_expired')
    where id = p_idempotency_key;
    raise exception 'invitation_not_expired' using errcode = 'P0001';
  end if;

  select * into v_generated from public._generate_invitation_token();

  update public.invitations
  set token_hash = v_generated.token_hash,
      expires_at = v_generated.expires_at
  where id = p_invitation_id;

  update public.idempotency_keys
  set result = jsonb_build_object('token', v_generated.token, 'expires_at', v_generated.expires_at)
  where id = p_idempotency_key;

  return query select v_generated.token, v_generated.expires_at;
end;
$$;

revoke execute on function public.regenerate_invitation(uuid, uuid) from public;
grant execute on function public.regenerate_invitation(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- peek_invitation — the RFC 0013 §2 pre-auth resolution gap: read-only,
-- never mutates, resolves an Invitation by token alone before either a
-- Business or a User is in context (the same "resolvable before any other
-- aggregate is in context" test that already justifies `Invitation` as a
-- root — RFC 0013 §2 step 2). Granted to `anon` deliberately — the invited
-- person hasn't authenticated yet when this is called. `status` is
-- computed at read time (`pending` + past `expires_at` → `expired`), never
-- stored — `Invitation.status`'s own closed set stays
-- `pending | accepted | revoked` (RFC 0013, `decision-log.md` D64).
-- ---------------------------------------------------------------------------
create or replace function public.peek_invitation(p_token text)
returns table (business_name text, status text, expires_at timestamptz)
language plpgsql
security definer
stable
set search_path = public, extensions
as $$
declare
  v_token_hash text;
begin
  v_token_hash := encode(digest(p_token, 'sha256'), 'hex');

  return query
    select
      b.name,
      case
        when i.status = 'pending' and now() > i.expires_at then 'expired'
        else i.status
      end,
      i.expires_at
    from public.invitations i
    join public.businesses b on b.id = i.business_id
    where i.token_hash = v_token_hash;
end;
$$;

revoke execute on function public.peek_invitation(text) from public;
grant execute on function public.peek_invitation(text) to anon, authenticated;
