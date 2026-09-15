-- Real Blocker, found via the Product Owner's own live production testing
-- (2026-09-15): `start_session` has failed on every real call since it was
-- first deployed — never caught because nothing had ever actually invoked
-- this RPC against the real database until today. Confirmed directly via
-- a live call from her own authenticated browser session:
--   {"code":"42702","message":"column reference \"event_id\" is ambiguous"}
--
-- Root cause: `RETURNS TABLE (session_id uuid, event_id uuid, ...)`
-- implicitly declares `event_id`/`operating_mode`/`opened_at` as PL/pgSQL
-- variables in the function body's own scope. The `RETURNING id, event_id,
-- operating_mode, opened_at INTO ...` clause (and the fallback `SELECT id,
-- event_id, operating_mode, opened_at FROM public.sessions ...` right
-- after it) then can't tell whether `event_id`/`operating_mode` refer to
-- those implicit OUT-parameter variables or to `public.sessions`' own
-- same-named columns — a well-known PL/pgSQL gotcha, not a logic bug.
--
-- Fix: qualify every ambiguous column reference in both the RETURNING
-- clause and the fallback SELECT with the table name, exactly as
-- PostgreSQL's own RETURNING/SELECT syntax already supports. No other
-- logic in this function changes.
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

  if p_event_id is not null and not exists (
    select 1 from public.events where id = p_event_id and business_id = p_business_id
  ) then
    raise exception 'event_not_found' using errcode = 'P0002';
  end if;

  if v_resolved_mode = 'nfc' and not exists (
    select 1 from public.businesses where id = p_business_id and subscription_tier = 'paid'
  ) then
    v_resolved_mode := 'buttons';
  end if;

  insert into public.sessions (business_id, event_id, operating_mode, opened_by_membership_id)
  values (p_business_id, p_event_id, v_resolved_mode, v_membership_id)
  on conflict (opened_by_membership_id) where status = 'active' do nothing
  returning sessions.id, sessions.event_id, sessions.operating_mode, sessions.opened_at
  into v_session_id, v_session_event_id, v_session_mode, v_session_opened_at;

  if v_session_id is null then
    select sessions.id, sessions.event_id, sessions.operating_mode, sessions.opened_at
    into v_session_id, v_session_event_id, v_session_mode, v_session_opened_at
    from public.sessions
    where opened_by_membership_id = v_membership_id and status = 'active';
  end if;

  return query select v_session_id, v_session_event_id, v_session_mode, v_session_opened_at;
end;
$$;

revoke execute on function public.start_session(uuid, uuid, text) from public;
grant execute on function public.start_session(uuid, uuid, text) to authenticated;
