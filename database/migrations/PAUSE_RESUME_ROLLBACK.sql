-- PAUSE_RESUME_ROLLBACK.sql
-- Proposal-only rollback for the ShuttleCoach pause/resume feature.
-- This file was created from the audit and is not executed against Supabase.
--
-- Scope: public.practice_sessions only.
-- This rollback removes only the columns and constraints introduced by the pause/
-- resume migration. It does not modify permissions, policies, signup functions,
-- handle_new_user(), or any unrelated objects.
--
-- Safety guard:
-- If any row still has status = 'PAUSED', this rollback aborts. That prevents
-- silent data loss or inconsistent state during removal of the pause metadata.
--
-- Assumptions that cannot be verified from the audit alone:
-- 1) No production session uses PAUSED in a way that would need a data migration
--    before rollback.
-- 2) No application logic depends on the pause metadata being dropped while
--    existing PAUSED rows remain.
-- 3) There are no other database-layer business rules outside the schema that
--    would require a different rollback flow.

BEGIN;

-- -----------------------------------------------------------------------------
-- Safety guard: abort rollback if a paused session still exists.
-- Reason: removing the pause columns and constraint while PAUSED rows remain
-- would silently lose the current pause state and cause inconsistent lifecycle
-- records. This is intentionally conservative.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.practice_sessions
    WHERE status = 'PAUSED'
  ) THEN
    RAISE EXCEPTION 'Rollback aborted: one or more practice_sessions rows still have status = PAUSED. Finalize or resolve those rows before removing pause metadata.';
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Remove the pause-specific constraints introduced by the feature migration.
-- Reason: these constraints are specific to the new pause lifecycle and should be
-- removed only if the feature is being rolled back without any PAUSED rows left.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  DROP CONSTRAINT IF EXISTS practice_sessions_paused_at_consistency_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_total_paused_seconds_check;

-- -----------------------------------------------------------------------------
-- Restore the original status constraint.
-- Reason: the pre-migration status domain in the audit was:
--   CREATED, IN_PROGRESS, COMPLETED, ABANDONED.
-- This restores the original constraint exactly and leaves the table in its prior
-- state for the pre-feature lifecycle.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  DROP CONSTRAINT IF EXISTS practice_sessions_status_check;

ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_status_check
  CHECK (
    status IN (
      'CREATED',
      'IN_PROGRESS',
      'COMPLETED',
      'ABANDONED'
    )
  );

-- -----------------------------------------------------------------------------
-- Remove the pause-specific columns introduced by the migration.
-- Reason: the audit identifies paused_at and total_paused_seconds as the new
-- pause-related schema additions. Removing them only restores the original schema.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  DROP COLUMN IF EXISTS total_paused_seconds,
  DROP COLUMN IF EXISTS paused_at;

COMMIT;

-- -----------------------------------------------------------------------------
-- Operational notes
-- -----------------------------------------------------------------------------
-- - This rollback does not alter any permissions, grants, RLS policies, indexes,
--   auth functions, or signup behaviour.
-- - It targets only public.practice_sessions.
-- - It does not touch related tables such as session_sequence_steps,
--   session_position_selections, or session_shot_selections.
-- - It does not modify foreign keys or user ownership logic.
-- - It remains proposal-only and must not be executed against a live database.
