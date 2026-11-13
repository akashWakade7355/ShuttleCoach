-- PAUSE_RESUME_VERIFICATION.sql
-- Proposal-only verification script for the ShuttleCoach pause/resume feature.
-- This file is for review and validation planning only. It does not execute.
--
-- Purpose:
--   1) Pre-migration checks to confirm the original schema state before any feature
--      migration is applied.
--   2) Post-migration checks to confirm the new pause/resume schema is present and
--      valid.
--
-- Notes:
-- - This script is intentionally documentation-first and does not run against the
--   live database.
-- - It preserves the read-only audit approach and does not change schema state.
-- - It targets only public.practice_sessions.

-- -----------------------------------------------------------------------------
-- PRE-MIGRATION CHECKS
-- -----------------------------------------------------------------------------
-- 1) Confirm the current status values before migration.
--    Expected from the audit: CREATED, IN_PROGRESS, COMPLETED, ABANDONED.
SELECT
  status,
  COUNT(*) AS row_count
FROM public.practice_sessions
GROUP BY status
ORDER BY status;

-- 2) Confirm the existing constraint definition before migration.
--    This should be the original status constraint without PAUSED.
SELECT
  conname,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.practice_sessions'::regclass
  AND conname = 'practice_sessions_status_check';

-- 3) Confirm whether pause-specific schema elements exist before migration.
--    Expected: no paused_at column and no total_paused_seconds column.
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'practice_sessions'
  AND column_name IN ('paused_at', 'total_paused_seconds')
ORDER BY column_name;

-- -----------------------------------------------------------------------------
-- POST-MIGRATION CHECKS
-- -----------------------------------------------------------------------------
-- 4) Verify that the new columns now exist.
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'practice_sessions'
  AND column_name IN ('paused_at', 'total_paused_seconds')
ORDER BY column_name;

-- 5) Verify the updated status constraint includes PAUSED.
SELECT
  conname,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.practice_sessions'::regclass
  AND conname = 'practice_sessions_status_check';

-- 6) Verify the non-negative duration constraint.
SELECT
  conname,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.practice_sessions'::regclass
  AND conname = 'practice_sessions_total_paused_seconds_check';

-- 7) Verify the pause-state consistency constraint.
SELECT
  conname,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.practice_sessions'::regclass
  AND conname = 'practice_sessions_paused_at_consistency_check';

-- 8) Verify that existing session records still exist and are structurally valid.
SELECT
  id,
  user_id,
  status,
  started_at,
  completed_at,
  paused_at,
  total_paused_seconds,
  actual_duration_seconds
FROM public.practice_sessions
ORDER BY created_at;

-- 9) Verify that paused rows satisfy the new lifecycle rules.
SELECT
  COUNT(*) AS paused_rows_without_pause_timestamp
FROM public.practice_sessions
WHERE status = 'PAUSED' AND paused_at IS NULL;

SELECT
  COUNT(*) AS non_paused_rows_with_pause_timestamp
FROM public.practice_sessions
WHERE status <> 'PAUSED' AND paused_at IS NOT NULL;

-- 10) Verify there are no negative total paused seconds.
SELECT
  COUNT(*) AS invalid_total_paused_seconds_rows
FROM public.practice_sessions
WHERE total_paused_seconds < 0;

-- -----------------------------------------------------------------------------
-- Operational notes
-- -----------------------------------------------------------------------------
-- - The schema should remain unchanged for foreign keys, indexes, signup logic,
--   permissions, and authentication.
-- - This script is meant to document the validation plan, not to execute.
-- - The audit does not verify whether there are additional app-specific business
--   invariants beyond the database-layer constraints shown here.
-- - The final application logic for pause/resume transitions, completion while
--   paused, and duration calculation remains outside the scope of this database
--   script and must be implemented in the application layer if required.
