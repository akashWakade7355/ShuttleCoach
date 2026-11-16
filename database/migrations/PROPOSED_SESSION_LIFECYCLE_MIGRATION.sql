-- PROPOSED_SESSION_LIFECYCLE_MIGRATION.sql
-- Proposal-only, additive schema change for the ShuttleCoach practice-session lifecycle.
-- This file is intended for review before any execution in Supabase.
-- It does not modify the live database and does not change Java entities.
--
-- Scope:
--   - public.practice_sessions
--   - public.session_sequence_steps (only via a foreign-key pointer from the session row)
--
-- Important: this migration assumes the already-applied pause/resume schema is present:
--   - public.practice_sessions.paused_at TIMESTAMPTZ
--   - public.practice_sessions.total_paused_seconds INTEGER NOT NULL DEFAULT 0
--   - status already allows CREATED, IN_PROGRESS, PAUSED, COMPLETED, ABANDONED
--
-- Design intent:
--   - Timer state lives on the session row because only one repetition and one recovery
--     countdown are active at any moment for a given session.
--   - The active repetition is identified by an FK to a specific session_sequence_steps row,
--     which preserves idempotency when the same step is retried.
--   - No preparation-specific column is added because the existing started_at and pause
--     accounting fields are sufficient to compute active preparation time without inventing
--     redundant state.

BEGIN;

-- -----------------------------------------------------------------------------
-- 1) Add session-scoped lifecycle state for the active repetition and recovery.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD COLUMN IF NOT EXISTS active_sequence_step_id UUID,
  ADD COLUMN IF NOT EXISTS repetition_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS repetition_remaining_ms BIGINT,
  ADD COLUMN IF NOT EXISTS recovery_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS recovery_remaining_ms BIGINT,
  ADD COLUMN IF NOT EXISTS completion_type VARCHAR(20);

-- -----------------------------------------------------------------------------
-- 2) Add the reference from the active repetition to the exact sequence row.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_active_sequence_step_fk
  FOREIGN KEY (active_sequence_step_id)
  REFERENCES public.session_sequence_steps(id)
  ON DELETE SET NULL
  NOT VALID;

-- -----------------------------------------------------------------------------
-- 3) Guard duration values against negative or stale timer state.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_repetition_remaining_ms_check
  CHECK (repetition_remaining_ms IS NULL OR repetition_remaining_ms >= 0)
  NOT VALID;

ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_recovery_remaining_ms_check
  CHECK (recovery_remaining_ms IS NULL OR recovery_remaining_ms >= 0)
  NOT VALID;

ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_completion_type_check
  CHECK (completion_type IS NULL OR completion_type IN ('MANUAL', 'AUTOMATIC'))
  NOT VALID;

-- -----------------------------------------------------------------------------
-- 4) Keep timer state internally consistent.
--    Rule: if a repetition timer is started, it must have a remaining value.
--    Rule: if a recovery timer is started, it must have a remaining value.
--    This allows legacy rows to remain valid while enforcing the intended active state.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_repetition_timer_consistency_check
  CHECK (
    repetition_started_at IS NULL
    OR (repetition_started_at IS NOT NULL AND repetition_remaining_ms IS NOT NULL)
  )
  NOT VALID;

ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_recovery_timer_consistency_check
  CHECK (
    recovery_started_at IS NULL
    OR (recovery_started_at IS NOT NULL AND recovery_remaining_ms IS NOT NULL)
  )
  NOT VALID;

-- -----------------------------------------------------------------------------
-- 5) Recommended indexes for active-state lookups.
--    These are additive and do not assume a live index already exists.
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_practice_sessions_active_sequence_step_id
  ON public.practice_sessions (active_sequence_step_id)
  WHERE active_sequence_step_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_status
  ON public.practice_sessions (user_id, status);

COMMIT;

-- -----------------------------------------------------------------------------
-- Operational notes:
-- - This proposal intentionally does not add a preparation-specific duration column.
-- - This proposal intentionally leaves completion_type nullable to preserve legacy
--   rows in public.practice_sessions that are already completed without a marked
--   completion class.
-- - This proposal intentionally uses NOT VALID constraints to keep the migration
--   review-friendly and low-risk before execution in a controlled environment.
-- - This proposal does not modify pause or duration semantics already present in the
--   live schema; it only adds the additional state needed for repetition and recovery.
