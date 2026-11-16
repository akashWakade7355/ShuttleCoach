# Session Lifecycle Proposal Report

## Scope

This proposal is based on read-only inspection of the live Supabase schema and the repository migration/audit artifacts. It is intentionally additive and does not execute SQL or modify the live database.

## Actual schema findings

From the inspected metadata and migration audit, the live database currently includes the following relevant contract:

- public.practice_sessions already contains:
  - id, user_id, status, recovery_time_seconds, planned_repetitions, completed_repetitions, actual_duration_seconds, started_at, completed_at, created_at
  - paused_at and total_paused_seconds as previously applied pause/resume state
- The current status CHECK allows only:
  - CREATED
  - IN_PROGRESS
  - COMPLETED
  - ABANDONED
- The previously-applied pause/resume work established the pause state and cumulative paused duration and did not recreate those fields in this proposal.
- public.session_sequence_steps already stores the step state needed for repetition logic:
  - session_id
  - sequence_number
  - completed
  - returned_to_center
  - completed_at
  - unique constraint on (session_id, sequence_number)
- The step row is already the correct place to identify a distinct repetition by its specific sequence row.
- There is no current database-level representation of:
  - a timer running for the active repetition,
  - a recovery countdown in progress,
  - manual versus automatic completion classification,
  - a pointer to the currently active repetition step.

## Recommended column design

The safest design is to keep the active timer state at the session level, with `session_sequence_steps` used only to identify which repetition step is active. This is the recommended pattern because:

- There is only one active repetition and one active recovery countdown per session at a time.
- The session row already acts as the lifecycle owner for overall status and pause/elapsed time state.
- A step row is better as a reference target, not as the home for the current timer value.
- The existing unique sequence ordering on `session_sequence_steps` already guarantees that a retry cannot silently move to the next repetition if the original row is re-evaluated.

### Recommended fields on public.practice_sessions

- active_sequence_step_id: UUID NULL
  - points to the exact row in public.session_sequence_steps that is currently active.
  - this is the idempotency anchor for repetition completion.

- repetition_started_at: TIMESTAMPTZ NULL
  - records the moment the current repetition timer started or resumed.

- repetition_remaining_ms: BIGINT NULL
  - stores the exact remaining time for the active repetition in milliseconds.
  - may be NULL when no repetition is active.
  - must not be negative.

- recovery_started_at: TIMESTAMPTZ NULL
  - records when the current recovery countdown started or resumed.

- recovery_remaining_ms: BIGINT NULL
  - stores the exact remaining time for the active recovery countdown in milliseconds.
  - may be NULL when recovery is not active.
  - must not be negative.

- completion_type: VARCHAR(20) NULL
  - value is either MANUAL or AUTOMATIC when the session is classified.
  - nullable so legacy completed rows remain compatible.

### Why not put timer fields directly on session_sequence_steps?

The main trade-off is:

- Putting the timer on each step row makes every step look like it can independently own a countdown, which is not true in a session with only one active repetition at a time.
- Putting the timer on practice_sessions keeps a single source of truth for the current repetition and recovery lifecycle.
- The sequence step still retains `completed` and `returned_to_center` state, which is enough to know whether the step is done.

This proposal therefore keeps the timer on practice_sessions and uses the step row as a specific pointer for the active step.

## Explanation of each new column

### active_sequence_step_id

This is the critical idempotency field. The backend should only mark a repetition complete when the current step matches this ID. If the same completion call is retried, the second attempt will not match the active step and the next repetition will not be advanced accidentally.

### repetition_started_at

This stores the wall-clock start or resume time for the active repetition so the backend can calculate elapsed time while the session is paused or resumed.

### repetition_remaining_ms

This records the exact remaining duration for the active repetition. By persisting the remaining value instead of re-deriving it from timestamps only, the app can freeze and resume the timer exactly as required.

### recovery_started_at

This records the wall-clock start or resume time for recovery. It is needed so the app can freeze and resume the countdown exactly without drift.

### recovery_remaining_ms

This stores the exact remaining recovery duration in milliseconds. The backend can persist the value on pause, then resume with the same remaining value instead of recalculating from the wall clock.

### completion_type

This distinguishes MANUAL completion from AUTOMATIC completion while remaining backward-compatible with already-completed rows that do not yet have a classification.

## Constraints and indexes added

The proposed migration adds the following checks:

- repetition_remaining_ms is NULL or >= 0
- recovery_remaining_ms is NULL or >= 0
- completion_type is NULL or one of MANUAL / AUTOMATIC
- if repetition_started_at is set, repetition_remaining_ms must also be set
- if recovery_started_at is set, recovery_remaining_ms must also be set
- FK from active_sequence_step_id to session_sequence_steps(id), ON DELETE SET NULL, NOT VALID

The proposed migration adds the following indexes:

- idx_practice_sessions_active_sequence_step_id
  - useful for locating the in-flight session step quickly
- idx_practice_sessions_user_status
  - useful for fetching active or paused sessions per user without assuming an existing index exists

## Compatibility with existing records

This migration is additive and preserves current data:

- It does not drop or rename existing columns.
- It does not require legacy rows to be backfilled.
- It leaves completion_type nullable so rows already marked COMPLETED remain valid.
- It does not impose a default value on the millisecond fields; they remain NULL until a timer is active.
- The existing pause state and total pause accounting remain intact and continue to be used for pause/resume tracking.

## Migration execution order

1. Add the new lifecycle columns to public.practice_sessions.
2. Add the foreign-key pointer to the active step row.
3. Add duration and enum checks.
4. Add timer-consistency checks.
5. Add active-state indexes.
6. In backend logic, on session start set active_sequence_step_id to the current sequence row, repetition_started_at and repetition_remaining_ms, and recovery_started_at/recovery_remaining_ms only when recovery starts.
7. On pause, persist the remaining values without changing the completed step metadata.
8. On completion, classify MANUAL vs AUTOMATIC and mark the session COMPLETED only after the final recovery finishes.

## Rollback risks

The rollback is intentionally destructive. If it is executed, the following information is lost:

- active repetition step pointer
- active repetition timer start and remaining duration
- active recovery timer start and remaining duration
- completion classification for MANUAL vs AUTOMATIC sessions
- any in-flight session state that depends on these fields for accurate resume or completion

Because this data is stateful and session-specific, rollback should be treated as a full lifecycle-state reset rather than a harmless schema cleanup.

## Unresolved design decisions

The remaining open design decisions are operational rather than structural:

- whether the app will treat `recovery_time_seconds` as the configured default recovery duration or as a business-derived scheduling value
- whether the backend should mark the final recovery completion in the same transaction as the session status flip to COMPLETED
- whether the app should keep completion_type populated for all completed rows over time or only for newly-created sessions
- whether some timer state should be reconstructed from `started_at`, `paused_at`, and `total_paused_seconds` instead of stored redundantly in the session row

For the schema itself, the recommendation remains: keep the timer state on the session row and keep the step row as the specific repetition identity for idempotent completion logic.
