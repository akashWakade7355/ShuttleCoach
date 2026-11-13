-- PRACTICE_TIMING_ROLLBACK.sql
-- Proposal-only rollback for ShuttleCoach practice timing configuration.
-- This script removes only the new timing columns and constraints added by the
-- forward migration. It does not modify any existing columns, permissions, RLS,
-- foreign keys, auth logic, or unrelated tables.
--
-- Safety requirement:
-- The rollback should be used only when the feature is intentionally being
-- removed and the new columns are no longer needed.

BEGIN;

-- -----------------------------------------------------------------------------
-- Remove only the two constraints added by the forward migration.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  DROP CONSTRAINT IF EXISTS practice_sessions_preparation_time_seconds_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_repetition_duration_seconds_check;

-- -----------------------------------------------------------------------------
-- Remove only the two new columns introduced by this feature.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  DROP COLUMN IF EXISTS preparation_time_seconds,
  DROP COLUMN IF EXISTS repetition_duration_seconds;

COMMIT;

-- -----------------------------------------------------------------------------
-- Operational notes
-- -----------------------------------------------------------------------------
-- - This rollback does not alter existing table data beyond removing the two
--   added columns.
-- - It does not change other constraints, indexes, permissions, or auth logic.
-- - It remains proposal-only and must be reviewed manually before any execution.
