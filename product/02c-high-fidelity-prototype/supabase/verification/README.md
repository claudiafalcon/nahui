# supabase/verification

Ad-hoc, self-asserting SQL scripts that prove a specific migration did what
its header claims, run by hand against the hosted project **after** the
migration is applied.

**Deliberately not under `supabase/migrations/`.** These write fixture rows
and (Script B below) do throwaway DDL. They are wrapped in
`BEGIN … ROLLBACK`, so they persist nothing, but they must never be picked up
by `supabase db push`. `supabase db push` reads `supabase/migrations/` only,
and `config.toml` declares no seed/sql path, so nothing here is ever executed
automatically.

Naming: `<migration version>_verify_<letter>_<subject>.sql`, so a script is
always traceable to the one migration it verifies.

Each script raises on the first failed assertion and prints
`ALL ASSERTIONS PASSED` on success — read the exit status and the last
`NOTICE`, not the row output.

Run as the postgres/service role. `auth.uid()` is supplied by setting
`request.jwt.claims` transaction-locally, so each script exercises the RPC's
real authorization path rather than bypassing it.

## Contents

- **`20260921020000_verify_a_allowlist.sql`** — verifies
  `20260921020000_assign_tag_prior_holder_allowlist.sql` (D83, `reviewer`
  finding I-2). Behaviour-preservation: the reuse path, the conflict path,
  the partial unique indexes, the preserved grant, and that the rest of the
  patched function body survived `create or replace`. Safe to run any time;
  no DDL, no lock beyond row locks on its own fixtures.
- **`20260921020000_verify_b_fifth_status.sql`** — the regression proof for
  the same finding: simulates a fifth `inventory_units.status` value and
  shows the guard now denies where the denylist would have permitted. **Does
  DDL** (widens a CHECK constraint, `NOT VALID`, rolled back), so it holds
  ACCESS EXCLUSIVE on `inventory_units` for the life of the transaction —
  sub-second at pilot scale, but do not run it during a live bazaar session.
