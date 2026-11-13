BEGIN;

-- -----------------------------------------------------------------------------
-- IMPORTANT LIVE-SCHEMA NOTE
-- -----------------------------------------------------------------------------
-- public.profiles.id is a foreign key to auth.users(id) with ON DELETE CASCADE.
-- The live project therefore has a user-profile cascade path that must be treated
-- as production-sensitive. This rollback is a documentation-only restoration of
-- observed privileges and must not be executed against the current live database
-- without approved staging review.
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- Exact rollback for the live permission state captured during read-only review.
-- This does not change table structures, data, FK design, or signup logic.
-- -----------------------------------------------------------------------------

-- Restore the exact original table-level grants captured from live metadata.
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

-- Restore exact original column-level grants captured from live metadata.
-- profiles
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

-- court_positions
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_code TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_name TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.display_order TO anon;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_code TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.position_name TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.court_positions.display_order TO authenticated;

-- shot_types
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.shot_name TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.description TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.is_active TO anon;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.shot_name TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.description TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.shot_types.is_active TO authenticated;

-- position_pair_shot_rules
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.player_position_id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.opponent_position_id TO anon;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.shot_type_id TO anon;

GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.player_position_id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.opponent_position_id TO authenticated;
GRANT INSERT, REFERENCES, SELECT, UPDATE ON COLUMN public.position_pair_shot_rules.shot_type_id TO authenticated;

-- Drop the migration-created policies.
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "court_positions_select_authenticated" ON public.court_positions;
DROP POLICY IF EXISTS "shot_types_select_authenticated" ON public.shot_types;
DROP POLICY IF EXISTS "position_pair_shot_rules_select_authenticated" ON public.position_pair_shot_rules;

COMMIT;
