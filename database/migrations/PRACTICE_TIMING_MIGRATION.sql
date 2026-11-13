-- PRACTICE_TIMING_MIGRATION.sql
-- Proposal-only migration for ShuttleCoach practice timing configuration.
-- This file is for manual review only and must not be executed against the live
-- Supabase database unless approved separately.
--
-- Scope: public.practice_sessions only.
-- This migration intentionally does not modify permissions, RLS policies,
-- grants, foreign keys, signup logic, authentication, or unrelated tables.
--
-- Required behavior:
-- - Add repetition_duration_seconds as nullable INTEGER.
-- - Add preparation_time_seconds as nullable INTEGER.
-- - Validate only when non-NULL:
--     repetition_duration_seconds > 0
--     preparation_time_seconds >= 0
-- - Preserve all existing records and historical sessions without backfilling
--   any default timing values.

BEGIN;

-- -----------------------------------------------------------------------------
-- Add the new timing columns as nullable to preserve historical session data.
-- No default values are assigned because existing sessions may not have these
-- configuration values and the requirement explicitly says not to invent defaults.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD COLUMN IF NOT EXISTS repetition_duration_seconds INTEGER;

ALTER TABLE public.practice_sessions
  ADD COLUMN IF NOT EXISTS preparation_time_seconds INTEGER;

-- -----------------------------------------------------------------------------
-- Add CHECK constraints to validate meaningful values only when the fields are set.
-- Rule 1: repetition_duration_seconds must be NULL or > 0
-- Rule 2: preparation_time_seconds must be NULL or >= 0
--
-- Guarded via DO blocks so rerunning the migration will not fail with duplicate
-- constraint-name errors.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.practice_sessions'::regclass
      AND conname = 'practice_sessions_repetition_duration_seconds_check'
  ) THEN
    ALTER TABLE public.practice_sessions
      ADD CONSTRAINT practice_sessions_repetition_duration_seconds_check
      CHECK (
        repetition_duration_seconds IS NULL
        OR repetition_duration_seconds > 0
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.practice_sessions'::regclass
      AND conname = 'practice_sessions_preparation_time_seconds_check'
  ) THEN
    ALTER TABLE public.practice_sessions
      ADD CONSTRAINT practice_sessions_preparation_time_seconds_check
      CHECK (
        preparation_time_seconds IS NULL
        OR preparation_time_seconds >= 0
      );
  END IF;
END $$;

COMMIT;

-- -----------------------------------------------------------------------------
-- Operational notes
-- -----------------------------------------------------------------------------
-- - This migration does not modify RLS or permissions.
-- - It does not modify authentication or signup logic.
-- - It does not affect foreign keys or data in other tables.
-- - It preserves existing practice session rows by keeping both new columns NULL
--   unless the application supplies values for new sessions.
-- - It remains proposal-only and must be reviewed manually before execution.
