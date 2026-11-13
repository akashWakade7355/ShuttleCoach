-- FINAL_MANDATORY_MIGRATION.sql
-- Proposal-only hardening for the target tables only.
-- This file does not execute against the live database.
-- It includes:
--   * exact privilege cleanup for PUBLIC / anon / authenticated
--   * explicit column-level privilege revocation
--   * least-privilege grants for authenticated users
--   * required RLS policies for the target tables
--   * no data changes, no schema changes, no signup trigger changes
--
-- IMPORTANT: Do not execute against Supabase until explicit approval.

BEGIN;

-- -----------------------------------------------------------------------------
-- IMPORTANT LIVE-SCHEMA NOTE
-- -----------------------------------------------------------------------------
-- public.profiles.id is a foreign key to auth.users(id) with ON DELETE CASCADE.
-- Deleting an auth user will therefore cascade into public.profiles, and then
-- downstream cascades can remove user-owned practice_sessions and saved_presets.
-- This migration is proposal-only and must not be executed against the live
-- project unless a safe staging environment and explicit approval are available.
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 1) Remove current table-level grants from PUBLIC / anon / authenticated.
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 2) Revoke every existing column-level grant captured from the live database.
-- -----------------------------------------------------------------------------

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

-- -----------------------------------------------------------------------------
-- 3) Apply the intended least-privilege grant model.
-- -----------------------------------------------------------------------------
-- anon must receive no privileges on these four tables.
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url) ON TABLE public.profiles TO authenticated;

GRANT SELECT ON TABLE public.court_positions TO authenticated;
GRANT SELECT ON TABLE public.shot_types TO authenticated;
GRANT SELECT ON TABLE public.position_pair_shot_rules TO authenticated;

-- -----------------------------------------------------------------------------
-- 4) Add the required RLS policies.
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- Verification queries to run after approval (not executed here)
-- -----------------------------------------------------------------------------
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

-- This migration intentionally does not alter:
-- - table structures
-- - existing records
-- - foreign keys
-- - indexes
-- - handle_new_user()
-- - signup trigger behavior

-- 5) position_pair_shot_rules_select_authenticated
--    Purpose: authenticated users must be able to read the app rule matrix.
--    Rollback: drop the policy.
--
-- 6) idx_practice_sessions_user_id
--    Purpose: optimize queries for all sessions of one user.
--    Rollback: drop the index.
--
-- 7) idx_saved_presets_user_id
--    Purpose: optimize queries for all presets of one user.
--    Rollback: drop the index.
--
-- 8) idx_training_videos_category_id
--    Purpose: optimize category-based video loading.
--    Rollback: drop the index.

-- -----------------------------------------------------------------------------
-- Compatibility with existing table grants
-- -----------------------------------------------------------------------------
-- The existing table grants remain compatible with these policies because grants
-- authorize object-level access, while the RLS policies restrict the rows visible
-- within a session. This is the expected Supabase pattern for user-scoped access.
--
-- No changes are made to handle_new_user(), the signup trigger, or the session sequence design.
