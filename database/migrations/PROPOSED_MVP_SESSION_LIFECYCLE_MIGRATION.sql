-- PROPOSED_MVP_SESSION_LIFECYCLE_MIGRATION.sql
-- Review-only additive proposal. Do not execute against Supabase as part of this task.
--
-- Adds a single shared timer state for PREPARATION, REPETITION, and RECOVERY.
-- Existing paused_at, total_paused_seconds, and status configuration are preserved.
-- Existing session rows receive NULL for all new fields; no records are backfilled.
--
-- NOTE: PROPOSED_SESSION_LIFECYCLE_MIGRATION.sql is an older, overlapping proposal
-- with separate timer columns. Do not apply both designs. This preflight stops if
-- any of this migration's proposed columns already exist, requiring manual review.

BEGIN;

-- -----------------------------------------------------------------------------
-- Preflight: verify the expected base schema and reject partial/prior proposals.
-- No existing data is repaired or changed by these checks.
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    existing_columns TEXT[];
BEGIN
    IF to_regclass('public.practice_sessions') IS NULL THEN
        RAISE EXCEPTION 'Preflight failed: public.practice_sessions does not exist';
    END IF;

    IF to_regclass('public.session_sequence_steps') IS NULL THEN
        RAISE EXCEPTION 'Preflight failed: public.session_sequence_steps does not exist';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'practice_sessions'
          AND column_name = 'paused_at'
          AND data_type = 'timestamp with time zone'
    ) THEN
        RAISE EXCEPTION 'Preflight failed: expected practice_sessions.paused_at TIMESTAMPTZ';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'practice_sessions'
          AND column_name = 'total_paused_seconds'
          AND data_type = 'integer'
          AND is_nullable = 'NO'
    ) THEN
        RAISE EXCEPTION 'Preflight failed: expected practice_sessions.total_paused_seconds INTEGER NOT NULL';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint c
        WHERE c.conrelid = 'public.practice_sessions'::regclass
          AND c.contype = 'c'
          AND pg_get_constraintdef(c.oid) ILIKE '%CREATED%'
          AND pg_get_constraintdef(c.oid) ILIKE '%IN_PROGRESS%'
          AND pg_get_constraintdef(c.oid) ILIKE '%PAUSED%'
          AND pg_get_constraintdef(c.oid) ILIKE '%COMPLETED%'
          AND pg_get_constraintdef(c.oid) ILIKE '%ABANDONED%'
    ) THEN
        RAISE EXCEPTION 'Preflight failed: could not verify a status check allowing CREATED, IN_PROGRESS, PAUSED, COMPLETED, and ABANDONED';
    END IF;

    SELECT array_agg(column_name ORDER BY column_name)
    INTO existing_columns
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'practice_sessions'
      AND column_name IN (
          'active_timer_type',
          'active_timer_started_at',
          'active_timer_remaining_ms',
          'active_sequence_step_id',
          'completion_type'
      );

    IF existing_columns IS NOT NULL THEN
        RAISE EXCEPTION 'Preflight failed: proposed lifecycle columns already exist: %; review/reconcile before applying', existing_columns;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pg_constraint c
        WHERE c.conrelid = 'public.practice_sessions'::regclass
          AND c.conname IN (
              'mvp_session_active_timer_type_check',
              'mvp_session_active_timer_remaining_check',
              'mvp_session_active_timer_state_check',
              'mvp_session_completion_type_check'
          )
    ) THEN
        RAISE EXCEPTION 'Preflight failed: one or more MVP lifecycle constraint names already exist';
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Add one shared timer state. NULL active_timer_type means no timer is active.
-- For a running timer, active_timer_started_at is set. When paused, the type,
-- remaining milliseconds, and associated step are retained while the timestamp
-- is cleared. PREPARATION has no sequence step; REPETITION and RECOVERY do.
-- -----------------------------------------------------------------------------
ALTER TABLE public.practice_sessions
    ADD COLUMN active_timer_type VARCHAR(20) NULL,
    ADD COLUMN active_timer_started_at TIMESTAMPTZ NULL,
    ADD COLUMN active_timer_remaining_ms BIGINT NULL,
    ADD COLUMN active_sequence_step_id UUID NULL,
    ADD COLUMN completion_type VARCHAR(20) NULL;

-- Deliberately no FK on active_sequence_step_id in this MVP migration. The
-- service must verify that the referenced step belongs to the same session.

ALTER TABLE public.practice_sessions
    ADD CONSTRAINT mvp_session_active_timer_type_check
        CHECK (
            active_timer_type IS NULL
            OR active_timer_type IN ('PREPARATION', 'REPETITION', 'RECOVERY')
        ) NOT VALID,
    ADD CONSTRAINT mvp_session_active_timer_remaining_check
        CHECK (
            active_timer_remaining_ms IS NULL
            OR active_timer_remaining_ms >= 0
        ) NOT VALID,
    ADD CONSTRAINT mvp_session_active_timer_state_check
        CHECK (
            (
                active_timer_type IS NULL
                AND active_timer_started_at IS NULL
                AND active_timer_remaining_ms IS NULL
                AND active_sequence_step_id IS NULL
                AND status <> 'PAUSED'
            )
            OR
            (
                active_timer_type IS NOT NULL
                AND active_timer_remaining_ms IS NOT NULL
                AND (
                    (status = 'PAUSED' AND active_timer_started_at IS NULL)
                    OR
                    (status = 'IN_PROGRESS' AND active_timer_started_at IS NOT NULL)
                )
                AND (
                    (active_timer_type = 'PREPARATION' AND active_sequence_step_id IS NULL)
                    OR
                    (active_timer_type IN ('REPETITION', 'RECOVERY') AND active_sequence_step_id IS NOT NULL)
                )
            )
        ) NOT VALID,
    ADD CONSTRAINT mvp_session_completion_type_check
        CHECK (
            completion_type IS NULL
            OR (
                status = 'COMPLETED'
                AND completion_type IN ('MANUAL', 'AUTOMATIC')
            )
        ) NOT VALID;

COMMIT;

-- Operational notes:
-- - Existing pause/resume fields and the status constraint are not recreated or altered.
-- - The new fields are nullable so legacy rows remain unchanged and valid.
-- - NOT VALID avoids scanning all legacy rows during constraint creation; PostgreSQL
--   still enforces these checks for new or updated rows. Validate them separately
--   after review if desired.
-- - Millisecond precision is persisted in active_timer_remaining_ms. The frontend
--   may format the value as whole seconds without changing stored state.
