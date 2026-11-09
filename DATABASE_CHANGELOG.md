# ShuttleCoach Supabase Migration Proposal and Change Log

Generated: 2026-11-07
Status: Final permission hardening proposal; not executed

This document records the finalized read-only hardening plan for the Supabase database. No SQL was executed and no live database permissions or data were modified.

## 1) Scope

This proposal is intentionally limited to the required permission and RLS hardening for the four target tables:
- `public.profiles`
- `public.court_positions`
- `public.shot_types`
- `public.position_pair_shot_rules`

Excluded by design:
- no table structure changes
- no data migration or record changes
- no foreign-key changes
- no index changes beyond the already-justified non-primary access patterns
- no change to the auth signup trigger or `handle_new_user()` function

## 2) Verified baseline findings

The live metadata review confirmed:
- all 13 public tables have RLS enabled
- the four target tables had no existing RLS policies
- broad table-level and column-level grants existed for `anon` and `authenticated`
- `handle_new_user()` remains a `SECURITY DEFINER` function and remains attached to the `auth.users` signup trigger
- the court-position mapping is exactly:
  - 0 = CENTRE
  - 1 = FRONT_LEFT
  - 2 = FRONT_RIGHT
  - 3 = CENTRE_LEFT
  - 4 = CENTRE_RIGHT
  - 5 = BACK_LEFT
  - 6 = BACK_RIGHT

## 3) Final migration SQL

```sql
BEGIN;

REVOKE ALL ON TABLE public.profiles FROM PUBLIC;
REVOKE ALL ON TABLE public.court_positions FROM PUBLIC;
REVOKE ALL ON TABLE public.shot_types FROM PUBLIC;
REVOKE ALL ON TABLE public.position_pair_shot_rules FROM PUBLIC;

REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.court_positions FROM anon;
REVOKE ALL ON TABLE public.shot_types FROM anon;
REVOKE ALL ON TABLE public.position_pair_shot_rules FROM anon;

REVOKE ALL ON TABLE public.profiles FROM authenticated;
REVOKE ALL ON TABLE public.court_positions FROM authenticated;
REVOKE ALL ON TABLE public.shot_types FROM authenticated;
REVOKE ALL ON TABLE public.position_pair_shot_rules FROM authenticated;

-- profiles
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.id FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.full_name FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.avatar_url FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.created_at FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.updated_at FROM anon;

REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.id FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.full_name FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.avatar_url FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.created_at FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.updated_at FROM authenticated;

REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.id FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.full_name FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.avatar_url FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.created_at FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.updated_at FROM PUBLIC;

-- court_positions
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.id FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_code FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_name FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.display_order FROM anon;

REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.id FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_code FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_name FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.display_order FROM authenticated;

REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.id FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_code FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_name FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.display_order FROM PUBLIC;

-- shot_types
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.id FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.shot_name FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.description FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.is_active FROM anon;

REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.id FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.shot_name FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.description FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.is_active FROM authenticated;

REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.id FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.shot_name FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.description FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.is_active FROM PUBLIC;

-- position_pair_shot_rules
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.id FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.player_position_id FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.opponent_position_id FROM anon;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.shot_type_id FROM anon;

REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.id FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.player_position_id FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.opponent_position_id FROM authenticated;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.shot_type_id FROM authenticated;

REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.id FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.player_position_id FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.opponent_position_id FROM PUBLIC;
REVOKE INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.shot_type_id FROM PUBLIC;

GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url) ON TABLE public.profiles TO authenticated;

GRANT SELECT ON TABLE public.court_positions TO authenticated;
GRANT SELECT ON TABLE public.shot_types TO authenticated;
GRANT SELECT ON TABLE public.position_pair_shot_rules TO authenticated;

CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "court_positions_select_authenticated"
ON public.court_positions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "shot_types_select_authenticated"
ON public.shot_types
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "position_pair_shot_rules_select_authenticated"
ON public.position_pair_shot_rules
FOR SELECT
TO authenticated
USING (true);

COMMIT;
```

## 4) Exact rollback SQL

```sql
BEGIN;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
ON TABLE public.profiles TO anon;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
ON TABLE public.court_positions TO anon;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
ON TABLE public.shot_types TO anon;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
ON TABLE public.position_pair_shot_rules TO anon;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
ON TABLE public.profiles TO authenticated;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
ON TABLE public.court_positions TO authenticated;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
ON TABLE public.shot_types TO authenticated;

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
ON TABLE public.position_pair_shot_rules TO authenticated;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.full_name TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.avatar_url TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.created_at TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.updated_at TO anon;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.full_name TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.avatar_url TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.created_at TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.profiles.updated_at TO authenticated;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_code TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_name TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.display_order TO anon;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_code TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_name TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.display_order TO authenticated;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.shot_name TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.description TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.is_active TO anon;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.shot_name TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.description TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.is_active TO authenticated;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.player_position_id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.opponent_position_id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.shot_type_id TO anon;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.player_position_id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.opponent_position_id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.shot_type_id TO authenticated;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "court_positions_select_authenticated" ON public.court_positions;
DROP POLICY IF EXISTS "shot_types_select_authenticated" ON public.shot_types;
DROP POLICY IF EXISTS "position_pair_shot_rules_select_authenticated" ON public.position_pair_shot_rules;

COMMIT;
```

## 5) Verification queries

```sql
SELECT table_schema, table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('profiles','court_positions','shot_types','position_pair_shot_rules')
ORDER BY table_name, grantee, privilege_type;

SELECT table_schema, table_name, column_name, grantee, privilege_type
FROM information_schema.column_privileges
WHERE table_schema = 'public'
  AND table_name IN ('profiles','court_positions','shot_types','position_pair_shot_rules')
ORDER BY table_name, column_name, grantee, privilege_type;

SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles','court_positions','shot_types','position_pair_shot_rules')
ORDER BY tablename, policyname;

SELECT has_table_privilege('anon', 'public.profiles', 'SELECT') AS anon_profiles_select;
SELECT has_table_privilege('anon', 'public.profiles', 'UPDATE') AS anon_profiles_update;
SELECT has_table_privilege('authenticated', 'public.profiles', 'SELECT') AS auth_profiles_select;
SELECT has_table_privilege('authenticated', 'public.profiles', 'UPDATE') AS auth_profiles_update;
SELECT has_column_privilege('authenticated', 'public.profiles', 'full_name', 'UPDATE') AS auth_profiles_full_name_update;
SELECT has_column_privilege('authenticated', 'public.profiles', 'avatar_url', 'UPDATE') AS auth_profiles_avatar_url_update;
SELECT has_column_privilege('authenticated', 'public.profiles', 'id', 'UPDATE') AS auth_profiles_id_update;
```

## 6) Final status summary

- Policy coverage issue: confirmed and fixed in the proposal
- Column-level grant issue: explicitly handled in migration
- Rollback issue: corrected to restore original grants, not guessed broad grants
- Signup / trigger compatibility: preserved
- Court position mapping: verified
- Foreign keys and delete behavior: reviewed and preserved
- Only justified indexes kept: the migration does not add redundant index changes beyond the user lookup indexes already required

This migration remains proposal-only and ready for manual approval after review; it was not executed.
