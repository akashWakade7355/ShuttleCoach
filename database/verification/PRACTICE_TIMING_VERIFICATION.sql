-- PRACTICE_TIMING_VERIFICATION.sql
-- Proposal-only verification script for the practice timing migration.
-- This file is for review and manual validation only; it does not execute.
--
-- Purpose:
-- 1) Verify the new columns exist with the expected PostgreSQL metadata.
-- 2) Verify the correct CHECK constraints exist.
-- 3) Review relevant column metadata for public.practice_sessions.
--
-- This script is read-only and must not alter database state.

-- -----------------------------------------------------------------------------
-- Verify the existing relevant metadata for public.practice_sessions.
-- -----------------------------------------------------------------------------
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'practice_sessions'
  AND column_name IN (
    'id',
    'user_id',
    'status',
    'recovery_time_seconds',
    'planned_repetitions',
    'completed_repetitions',
    'actual_duration_seconds',
    'started_at',
    'completed_at',
    'created_at',
    'repetition_duration_seconds',
    'preparation_time_seconds'
  )
ORDER BY ordinal_position;

-- -----------------------------------------------------------------------------
-- Verify the new timing constraints exist.
-- -----------------------------------------------------------------------------
SELECT
  conname,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.practice_sessions'::regclass
  AND conname IN (
    'practice_sessions_repetition_duration_seconds_check',
    'practice_sessions_preparation_time_seconds_check'
  )
ORDER BY conname;

-- -----------------------------------------------------------------------------
-- Optional sanity check: show any rows that violate the new validation rules.
-- These queries are informational and read-only.
-- -----------------------------------------------------------------------------
SELECT COUNT(*) AS invalid_repetition_duration_rows
FROM public.practice_sessions
WHERE repetition_duration_seconds IS NOT NULL
  AND repetition_duration_seconds <= 0;

SELECT COUNT(*) AS invalid_preparation_time_rows
FROM public.practice_sessions
WHERE preparation_time_seconds IS NOT NULL
  AND preparation_time_seconds < 0;

-- -----------------------------------------------------------------------------
-- Operational notes
-- -----------------------------------------------------------------------------
-- - No schema changes are performed by this file.
-- - This file is intended for manual validation in Supabase SQL Editor only.
-- - The forward migration and rollback remain proposal-only until separately approved.
