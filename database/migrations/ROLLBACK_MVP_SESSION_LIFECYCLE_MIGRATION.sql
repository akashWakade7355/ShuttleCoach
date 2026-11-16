-- ROLLBACK_MVP_SESSION_LIFECYCLE_MIGRATION.sql
-- Review-only rollback proposal. Do not execute against Supabase as part of this task.
--
-- WARNING: dropping these columns permanently loses active timer state and the
-- MANUAL/AUTOMATIC completion classification. Reconcile or export that information
-- before considering rollback. Existing paused_at and total_paused_seconds are kept.
--
-- This rollback belongs only to PROPOSED_MVP_SESSION_LIFECYCLE_MIGRATION.sql.
-- It refuses to proceed if the older separate-timer proposal's columns exist.

BEGIN;

DO $$
DECLARE
    missing_columns TEXT[];
    conflicting_columns TEXT[];
BEGIN
    IF to_regclass('public.practice_sessions') IS NULL THEN
        RAISE EXCEPTION 'Rollback preflight failed: public.practice_sessions does not exist';
    END IF;

    SELECT array_agg(required.column_name ORDER BY required.column_name)
    INTO missing_columns
    FROM unnest(ARRAY[
        'active_timer_type',
        'active_timer_started_at',
        'active_timer_remaining_ms',
        'active_sequence_step_id',
        'completion_type'
    ]) AS required(column_name)
    WHERE NOT EXISTS (
        SELECT 1
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
          AND c.table_name = 'practice_sessions'
          AND c.column_name = required.column_name
    );

    IF missing_columns IS NOT NULL THEN
        RAISE EXCEPTION 'Rollback preflight failed: expected lifecycle columns are missing: %', missing_columns;
    END IF;

    SELECT array_agg(c.column_name ORDER BY c.column_name)
    INTO conflicting_columns
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.table_name = 'practice_sessions'
      AND c.column_name IN (
          'repetition_started_at',
          'repetition_remaining_ms',
          'recovery_remaining_ms'
      );

    IF conflicting_columns IS NOT NULL THEN
        RAISE EXCEPTION 'Rollback preflight failed: overlapping separate-timer proposal columns exist: %; reconcile before rollback', conflicting_columns;
    END IF;
END $$;

-- Destructive by design: values written to these added fields will be lost.
ALTER TABLE public.practice_sessions
    DROP CONSTRAINT mvp_session_completion_type_check,
    DROP CONSTRAINT mvp_session_active_timer_state_check,
    DROP CONSTRAINT mvp_session_active_timer_remaining_check,
    DROP CONSTRAINT mvp_session_active_timer_type_check,
    DROP COLUMN completion_type,
    DROP COLUMN active_sequence_step_id,
    DROP COLUMN active_timer_remaining_ms,
    DROP COLUMN active_timer_started_at,
    DROP COLUMN active_timer_type;

COMMIT;

-- Existing pause/resume fields paused_at and total_paused_seconds are intentionally
-- preserved. No pre-existing session or sequence records are deleted by this script.
