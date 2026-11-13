-- PAUSE_RESUME_MIGRATION.sql
-- Proposal-only migration for the ShuttleCoach pause/resume feature.
-- This file was created from the live-schema audit and entity review only.
-- It is not executed against Supabase and must not be run against the live database.
--
-- Scope: public.practice_sessions only.
-- This script intentionally does not modify permissions, policies, auth logic,
-- or any other table. It preserves existing records, indexes, RLS policy behavior,
-- and signup/profile creation flows.
--
-- Assumptions that cannot be verified from the audit alone:
-- 1) There are no additional application-level checks outside the database that
--    enforce the same lifecycle rules.
-- 2) The app will not require a separate pause-history table for analytics or
--    audit trails beyond the minimum session lifecycle requirement.
-- 3) Existing application code is already designed to map the new columns at the
--    ORM layer; this script does not modify Java code and remains a database-only
--    proposal.

BEGIN;

-- -----------------------------------------------------------------------------
-- Explanation of each operation
-- -----------------------------------------------------------------------------
-- 1) Drop the existing status check constraint.
--    Reason: the live metadata confirms the current constraint does not allow
--    PAUSED. We replace it with a broader status set that includes the new state.
--    This operation only touches public.practice_sessions and preserves the table's
--    existing relationship and data model.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  DROP CONSTRAINT IF EXISTS practice_sessions_status_check;

-- -----------------------------------------------------------------------------
-- 2) Replace the status constraint with the updated allowed values.
--    Reason: the pause/resume workflow requires the database to accept:
--    CREATED, IN_PROGRESS, PAUSED, COMPLETED, ABANDONED.
--    This preserves all existing states and adds the new PAUSED state only.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_status_check
  CHECK (
    status IN (
      'CREATED',
      'IN_PROGRESS',
      'PAUSED',
      'COMPLETED',
      'ABANDONED'
    )
  );

-- -----------------------------------------------------------------------------
-- 3) Add paused_at.
--    Reason: a paused session needs to know when the current pause started.
--    This is nullable so existing rows remain valid. It is only required when the
--    status is PAUSED.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ;

-- -----------------------------------------------------------------------------
-- 4) Add total_paused_seconds with a default of 0.
--    Reason: the audit recommends accumulating pause duration across multiple
--    pause/resume cycles so the backend can compute active practice time as:
--    actual_duration_seconds = completion_time - started_at - total_paused_seconds.
--    The default preserves existing rows without manual data migration.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD COLUMN IF NOT EXISTS total_paused_seconds INTEGER NOT NULL DEFAULT 0;

-- -----------------------------------------------------------------------------
-- 5) Enforce total_paused_seconds >= 0.
--    Reason: paused time should never be negative. This is a minimal data-quality
--    constraint that does not alter unrelated tables or permissions.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_total_paused_seconds_check
  CHECK (total_paused_seconds >= 0);

-- -----------------------------------------------------------------------------
-- 6) Add a consistency check for paused_at across lifecycle states.
--    Rule:
--      - PAUSED requires paused_at IS NOT NULL
--      - Every other status requires paused_at IS NULL
--    Reason: this ensures the DB cannot keep a paused session without a pause
--    start timestamp, and it prevents stale pause timestamps on non-paused rows.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_paused_at_consistency_check
  CHECK (
    (status = 'PAUSED' AND paused_at IS NOT NULL)
    OR (status <> 'PAUSED' AND paused_at IS NULL)
  );

-- -----------------------------------------------------------------------------
-- 7) No permission changes, policy changes, or auth-object changes.
--    Reason: the audit explicitly states that signup and profile creation should
--    remain untouched. This script only modifies public.practice_sessions.
-- -----------------------------------------------------------------------------

COMMIT;

-- -----------------------------------------------------------------------------
-- Operational notes
-- -----------------------------------------------------------------------------
-- - This migration does not create a new pause-history table.
-- - This migration does not alter table-level permissions, RLS, or auth triggers.
-- - This migration does not add or drop foreign keys, indexes, or signup logic.
-- - It preserves existing records by adding nullable and defaulted columns only.
-- - It changes only the status domain and the pause-related state on
--   public.practice_sessions.
-- - It remains proposal-only and must not be executed until reviewed against the
--   live database metadata and application workflow.
