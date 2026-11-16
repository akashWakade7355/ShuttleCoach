-- ROLLBACK_SESSION_LIFECYCLE_MIGRATION.sql
-- Rollback for the additive lifecycle proposal.
-- WARNING: executing this script would remove the additional lifecycle state and all
-- active timer metadata currently persisted for in-flight or completed sessions.
--
-- Scope:
--   public.practice_sessions only
--
-- Data loss warning:
--   - all values in active_sequence_step_id, repetition_started_at,
--     repetition_remaining_ms, recovery_started_at, recovery_remaining_ms,
--     completion_type will be deleted;
--   - any active repetition/recovery timer state will be lost;
--   - the exact step that was in progress at the time of rollback will no longer be
--     identifiable from database state;
--   - any MANUAL/AUTOMATIC completion classification will be erased.

BEGIN;

DROP INDEX IF EXISTS public.idx_practice_sessions_user_status;
DROP INDEX IF EXISTS public.idx_practice_sessions_active_sequence_step_id;

ALTER TABLE public.practice_sessions
  DROP CONSTRAINT IF EXISTS practice_sessions_repetition_timer_consistency_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_recovery_timer_consistency_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_completion_type_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_recovery_remaining_ms_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_repetition_remaining_ms_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_active_sequence_step_fk;

ALTER TABLE public.practice_sessions
  DROP COLUMN IF EXISTS completion_type,
  DROP COLUMN IF EXISTS recovery_remaining_ms,
  DROP COLUMN IF EXISTS recovery_started_at,
  DROP COLUMN IF EXISTS repetition_remaining_ms,
  DROP COLUMN IF EXISTS repetition_started_at,
  DROP COLUMN IF EXISTS active_sequence_step_id;

COMMIT;

-- Notes:
-- - This rollback is intentionally destructive to the lifecycle metadata and should only
--   be used after a deliberate review or if the change is being fully reverted.
-- - Existing pause-resume fields already in the schema (paused_at and total_paused_seconds)
--   are intentionally preserved and are not removed here.
