# ShuttleCoach Pause/Resume Database Audit

## Scope and methodology

This audit was prepared from live Supabase PostgreSQL metadata only, using read-only inspection of the public schema. No database changes were executed, no DDL was run, and no existing migration files or Java code were modified.

The inspection focused on:
- public.practice_sessions
- public.session_sequence_steps
- public.session_position_selections
- public.session_shot_selections
- public.profiles

The following were verified from PostgreSQL catalog metadata and information_schema:
- columns and data types
- nullability and defaults
- primary keys
- foreign keys and referential actions
- unique indexes and check constraints
- current status values in practice_sessions
- existing RLS policies
- existing triggers and constraint triggers
- whether any pause/resume fields already exist

## 0. Comparison with DATABASE_REFERENCE.md

The live Supabase database was used as the source of truth. The reference file [DATABASE_REFERENCE.md](DATABASE_REFERENCE.md) is broadly consistent with the live metadata for the core table set and naming, but there are several material differences that must be treated as documentation drift rather than facts the application should assume.

### Verified alignment with the reference
- The table names and schema match the documented set for the inspected tables: profiles, practice_sessions, session_position_selections, session_shot_selections, session_sequence_steps, and the related supporting tables.
- The primary keys and core columns for the session tables match the documented schema in substance.
- The user ownership and session-related foreign-key relationships were verified as documented: practice_sessions.user_id -> profiles.id; session_sequence_steps.session_id -> practice_sessions.id; session_position_selections.session_id -> practice_sessions.id; session_shot_selections.session_id -> practice_sessions.id.
- The JPA entity naming conventions in the Java backend align with the table names and column semantics already observed in the live database.

### Documented-but-unverified items in the reference file
The reference file explicitly marks several aspects as not inspected or unverified. The live database confirms that some of those assumptions remain unverified or are not safe to assume:
- status CHECK values are not just a generic lifecycle list; the live database specifically restricts them to CREATED, IN_PROGRESS, COMPLETED, and ABANDONED.
- ON DELETE / ON UPDATE referential behavior is materially important: practice_sessions.user_id cascades on delete, while the session child tables cascade on delete from their parent practice session.
- unique constraints and indexes were verified live and matter for the pause/resume design, particularly the unique index on session_sequence_steps(session_id, sequence_number).
- RLS policies are not documented in the reference file, but they are operationally relevant because they restrict access to the current user's own session rows.

### Actual discrepancies between the documentation and the live database
1. The reference file does not document the live status CHECK constraint and therefore understates the fact that PAUSED is currently invalid.
2. The reference file describes the 13-table architecture generally, but it does not call out the specific lifecycle CHECK or the current status values as a hard database rule.
3. The reference file does not identify the generated constraint names or the actual index definitions, even though those are relevant to the pause/resume path when fetching active or paused sessions.
4. The reference file notes that profiles.id may target auth.users.id, but the live metadata confirms the FK is to profiles(id) from practice_sessions.user_id, and the active RLS policy checks auth.uid() = user_id. The actual auth.users relationship is not directly required for the pause/resume design, but it is a documentation gap.
5. The reference file lists only columns, types, and basic keys; it does not describe the modern PostgreSQL catalog evidence that the session status is restricted and that `session_sequence_steps` has a unique sequence ordering rule.

### Conclusion on reference-vs-live consistency
The live database is the authoritative source for the pause/resume proposal. The documentation is useful as an architectural map but it is incomplete for lifecycle and constraint details. For this feature, only the live metadata should be treated as binding.

## 1. Existing database schema findings

### 1.1 public.practice_sessions

Verified columns:

| Column | Type | Nullable | Default | Notes |
|---|---|---:|---|---|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | — | FK to profiles(id), ON DELETE CASCADE |
| status | varchar(20) | NO | 'CREATED' | Lifecycle state |
| recovery_time_seconds | integer | NO | — | Must be >= 0 |
| planned_repetitions | integer | YES | — | Must be > 0 when set |
| completed_repetitions | integer | NO | 0 | Must be >= 0 |
| actual_duration_seconds | integer | YES | — | Must be >= 0 |
| started_at | timestamptz | YES | — | Session start time |
| completed_at | timestamptz | YES | — | Completion timestamp |
| created_at | timestamptz | NO | now() | Record creation time |

Verified constraints:
- PRIMARY KEY: id
- FOREIGN KEY: user_id -> profiles(id), ON DELETE CASCADE, ON UPDATE NO ACTION
- CHECK: actual_duration_seconds >= 0
- CHECK: completed_repetitions >= 0
- CHECK: planned_repetitions > 0
- CHECK: recovery_time_seconds >= 0
- CHECK: status IN ('CREATED','IN_PROGRESS','COMPLETED','ABANDONED')

Verified indexes:
- practice_sessions_pkey on id (unique, primary key)

Verified triggers:
- Referential integrity constraint triggers only, generated by FK enforcement.
- No application-specific trigger for session lifecycle transitions.

Verified current status values in data metadata:
- CREATED
- IN_PROGRESS
- COMPLETED
- ABANDONED

Important finding: PAUSED is not currently a valid status value in the checked constraint.

### 1.2 public.session_sequence_steps

Verified columns:

| Column | Type | Nullable | Default | Notes |
|---|---|---:|---|---|
| id | uuid | NO | gen_random_uuid() | Primary key |
| session_id | uuid | NO | — | FK to practice_sessions(id), ON DELETE CASCADE |
| sequence_number | integer | NO | — | Must be > 0 |
| completed | boolean | NO | false | Step completion flag |
| returned_to_center | boolean | NO | false | Step return flag |
| completed_at | timestamptz | YES | — | Completion timestamp |
| player_position_id | smallint | YES | — | FK to court_positions(id) |
| opponent_position_id | smallint | YES | — | FK to court_positions(id) |
| shot_type_id | smallint | YES | — | FK to shot_types(id) |

Verified constraints:
- PRIMARY KEY: id
- UNIQUE: (session_id, sequence_number)
- FOREIGN KEY: session_id -> practice_sessions(id), ON DELETE CASCADE, ON UPDATE NO ACTION
- FOREIGN KEY: player_position_id -> court_positions(id), ON UPDATE NO ACTION
- FOREIGN KEY: opponent_position_id -> court_positions(id), ON UPDATE NO ACTION
- FOREIGN KEY: shot_type_id -> shot_types(id), ON UPDATE NO ACTION
- CHECK: sequence_number > 0

Verified indexes:
- session_sequence_steps_pkey on id
- unique_session_sequence on (session_id, sequence_number)

This table already contains sequence progress state via:
- sequence_number
- completed
- returned_to_center
- completed_at

It is therefore already suitable for preserving sequence progress across pause/resume operations without requiring a new table.

### 1.3 public.session_position_selections

Verified columns:

| Column | Type | Nullable | Default | Notes |
|---|---|---:|---|---|
| session_id | uuid | NO | — | Part of PK; FK to practice_sessions(id) |
| court_side | varchar | NO | — | Part of PK; must be PLAYER or OPPONENT |
| position_id | smallint | NO | — | Part of PK; FK to court_positions(id) |

Verified constraints:
- PRIMARY KEY: (session_id, court_side, position_id)
- FOREIGN KEY: session_id -> practice_sessions(id), ON DELETE CASCADE, ON UPDATE NO ACTION
- FOREIGN KEY: position_id -> court_positions(id), ON UPDATE NO ACTION
- CHECK: court_side IN ('PLAYER','OPPONENT')

Verified indexes:
- session_position_selections_pkey on (session_id, court_side, position_id)

This table records which positions are selected for a session; it is not itself a lifecycle tracker.

### 1.4 public.session_shot_selections

Verified columns:

| Column | Type | Nullable | Default | Notes |
|---|---|---:|---|---|
| session_id | uuid | NO | — | Part of PK; FK to practice_sessions(id) |
| shot_type_id | smallint | NO | — | Part of PK; FK to shot_types(id) |

Verified constraints:
- PRIMARY KEY: (session_id, shot_type_id)
- FOREIGN KEY: session_id -> practice_sessions(id), ON DELETE CASCADE, ON UPDATE NO ACTION
- FOREIGN KEY: shot_type_id -> shot_types(id), ON UPDATE NO ACTION

Verified indexes:
- session_shot_selections_pkey on (session_id, shot_type_id)

### 1.5 public.profiles

Verified columns:

| Column | Type | Nullable | Default | Notes |
|---|---|---:|---|---|
| id | uuid | NO | — | Primary key |
| full_name | varchar | YES | — | Profile display name |
| avatar_url | text | YES | — | Avatar path/url |
| created_at | timestamptz | YES | now() | Creation timestamp |
| updated_at | timestamptz | YES | now() | Update timestamp |

Verified constraints:
- PRIMARY KEY: id
- Foreign key from practice_sessions.user_id -> profiles(id) with ON DELETE CASCADE
- No status or progress fields in profiles

### 1.6 RLS policy summary

Verified RLS is enabled on the target tables.

Relevant practice_sessions RLS:
- Users can create their own sessions: INSERT with auth.uid() = user_id
- Users can view their own sessions: SELECT with auth.uid() = user_id
- Users can update their own sessions: UPDATE with auth.uid() = user_id
- Users can delete their own sessions: DELETE with auth.uid() = user_id

Related tables also have user-scoped RLS based on the owning practice session relationship:
- Users can view/insert/delete/update their own session sequence steps
- Users can view/insert/delete/update their own session position selections
- Users can view/insert/delete/update their own selected shots

This means the app can retrieve paused sessions for the current user without additional DBA permission changes, provided the backend queries by user_id and status.

### 1.7 Existing triggers and functions

The inspected triggers are all generated referential integrity triggers for foreign keys and not custom lifecycle logic.

Examples:
- RI_FKey_cascade_del on session deletion
- RI_FKey_noaction_upd on updates to referenced keys
- RI_FKey_check_ins / RI_FKey_check_upd for insert/update validation

There are no triggers or custom functions that currently enforce pause/resume state transitions.

## 2. Verified current session lifecycle and progress fields

The current lifecycle is constrained only by the CHECK on practice_sessions.status.

Verified status values from metadata:
- CREATED
- IN_PROGRESS
- COMPLETED
- ABANDONED

There is no PAUSED status in the current database.

Verified progress-related state already present:
- practice_sessions.started_at
- practice_sessions.completed_at
- practice_sessions.completed_repetitions
- session_sequence_steps.completed
- session_sequence_steps.returned_to_center
- session_sequence_steps.completed_at
- session_sequence_steps.sequence_number

This means the schema already records basic session and sequence progress, but not the pause state or cumulative paused duration.

## 3. Identified schema gaps

The current schema is missing the minimum state needed for a real pause/resume lifecycle:

1. No PAUSED status value in the status CHECK constraint.
2. No paused_at column to indicate that the session is currently paused and when the pause began.
3. No total_paused_seconds column to accumulate cumulative pause time across multiple pause/resume cycles.
4. No lifecycle enforcement that prevents invalid transitions like:
   - pause while already paused
   - resume a completed session
   - resume a session that was never started
   - complete while in progress without checking timestamps
5. No explicit index for user + status retrieval of active/paused sessions.

The schema does not need a separate pause-history table for the basic requirement. The existing practice_sessions row is sufficient to represent the current paused state, and the current sequence tables already preserve sequence progress.

## 4. Recommended database design

### 4.1 Minimum required schema change

Add the following to public.practice_sessions:
- paused_at TIMESTAMPTZ NULL
- total_paused_seconds INTEGER NOT NULL DEFAULT 0 CHECK (total_paused_seconds >= 0)

And extend the status CHECK to include PAUSED.

Recommended status set:
- CREATED
- IN_PROGRESS
- PAUSED
- COMPLETED
- ABANDONED

### 4.2 Why paused_at is needed

paused_at is needed to represent the current pause start time and to distinguish:
- active session: status IN ('CREATED','IN_PROGRESS') and paused_at IS NULL
- paused session: status = 'PAUSED' and paused_at IS NOT NULL

Without paused_at, the backend cannot reliably tell when the most recent pause began, whether the user is currently paused, or how much time has elapsed while paused.

### 4.3 Why total_paused_seconds is needed

The database needs to accumulate paused time across multiple pause/resume cycles so the backend can compute active duration correctly:
- actual_duration_seconds = completion_time - started_at - total_paused_seconds

This is necessary because the requirements state that completed session duration must exclude all paused time. A single `paused_at` column is not enough to calculate historical accumulated pause duration across repeated pauses unless the backend recomputes a full delta from a pause log. A cumulative counter is the straightforward fit for the current schema.

When a session is currently paused and is then completed, the backend must include the current open pause interval in the cumulative paused duration before calculating actual_duration_seconds. In practice, that means: add the elapsed interval from `paused_at` to the completion timestamp to `total_paused_seconds`, set `paused_at` to NULL, then compute `actual_duration_seconds` using the formula above.

### 4.4 Why a separate pause-history table is not recommended here

A dedicated pause-history table would be valuable only if the business wanted full timestamped audit trails for every pause/resume interval. The current requirement is simpler: persist the current pause state on the session row and keep sequence state in the existing child tables. That matches the current application model and avoids broad schema proliferation.

## Impact on existing entities and JPA mappings

This proposal is intentionally conservative and preserves the existing entity model and table relationships.

### Affected entity
- [backend/src/main/java/com/badminton/backend/entity/PracticeSession.java](backend/src/main/java/com/badminton/backend/entity/PracticeSession.java)

The existing entity already maps the columns of public.practice_sessions directly, including id, userId, status, recoveryTimeSeconds, plannedRepetitions, completedRepetitions, actualDurationSeconds, startedAt, completedAt, and createdAt.

A pause/resume migration would require adding two new mapped fields to the Java entity:
- pausedAt: OffsetDateTime or LocalDateTime depending on the project’s time handling convention
- totalPausedSeconds: Integer

The simplest and least disruptive mapping is:

```java
@Column(name = "paused_at", nullable = true)
private OffsetDateTime pausedAt;

@Column(name = "total_paused_seconds", nullable = false)
private Integer totalPausedSeconds = 0;
```

This preserves the existing table naming and relationship conventions and keeps the mapping consistent with the current JPA entity style.

### No mapping changes required elsewhere
The related entities do not need schema changes for pause/resume itself:
- [backend/src/main/java/com/badminton/backend/entity/SessionSequenceStep.java](backend/src/main/java/com/badminton/backend/entity/SessionSequenceStep.java) already exposes the sequence progress fields needed to preserve step state across pauses.
- [backend/src/main/java/com/badminton/backend/entity/SessionPositionSelection.java](backend/src/main/java/com/badminton/backend/entity/SessionPositionSelection.java) and [backend/src/main/java/com/badminton/backend/entity/SessionShotSelection.java](backend/src/main/java/com/badminton/backend/entity/SessionShotSelection.java) already represent the user-selected court positions and shot types and do not require pause-specific changes.

### Why this stays compatible with the current design
- The parent-child relationship between practice_sessions and the session detail tables remains unchanged.
- No new table is required for the basic lifecycle model.
- Existing entity naming conventions remain stable.
- Existing PostgreSQL data types are preserved: uuid for IDs, timestamptz for time values, integer for durations, and varchar for status.
- No undocumented domain or relationship assumptions are introduced.

### Risk if the migration is implemented without updating JPA
If the application continues to use the old entity mapping without adding the new fields, then the backend cannot read or write the pause state. That is a clear contract mismatch between the DB schema and the Java model. The migration should therefore be shipped with the corresponding JPA field additions and validation rules in the entity layer.


A separate pause-history table would be useful only for detailed audit or analytics, not for the minimum functioning of pause/resume. The requirement explicitly says not to choose a separate pause-history table unless there is a clear requirement for it.

For the current application, a single `paused_at` + `total_paused_seconds` on the session row is sufficient and less invasive.

### 4.5 Sequence preservation and progress

No schema change is required for preserving sequence progress because the existing design already stores:
- sequence_number
- completed
- returned_to_center
- completed_at
- session_id

The backend can update those rows while the session is paused and then resume without losing step position.

### 4.6 Recommendation for indexes

Recommended index:
- idx_practice_sessions_user_status_started_at on (user_id, status, started_at DESC)

This supports the common app query: retrieve the current user’s active or paused sessions, especially after restart.

This is a performance recommendation rather than a strict correctness requirement.

## 5. Proposed migration SQL (proposal only, not executed)

This section is strictly a proposal and has not been executed against the database.

The live PostgreSQL metadata confirms the existing status constraint name is `practice_sessions_status_check`. The migration must replace that exact constraint, not assume a different name.

```sql
BEGIN;

-- 1) Replace the existing session status check so PAUSED is accepted while preserving
--    CREATED, IN_PROGRESS, COMPLETED, and ABANDONED.
ALTER TABLE public.practice_sessions
  DROP CONSTRAINT IF EXISTS practice_sessions_status_check;

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

-- 2) Add pause state columns.
ALTER TABLE public.practice_sessions
  ADD COLUMN IF NOT EXISTS paused_at timestamptz,
  ADD COLUMN IF NOT EXISTS total_paused_seconds integer NOT NULL DEFAULT 0;

-- 3) Enforce pause semantics.
ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_total_paused_seconds_check
  CHECK (total_paused_seconds >= 0),
  ADD CONSTRAINT practice_sessions_paused_at_consistency_check
  CHECK (
    (status = 'PAUSED' AND paused_at IS NOT NULL)
    OR (status <> 'PAUSED' AND paused_at IS NULL)
  );

-- 4) Optional performance index for retrieving active/paused sessions by user.
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_status_started_at
  ON public.practice_sessions (user_id, status, started_at DESC);

COMMIT;
```

### Why this proposal is minimal

- It adds only the fields required to represent the paused session state.
- It preserves existing records because the new columns are either nullable or defaulted.
- It updates the exact verified status constraint name already present in the live metadata.
- It does not modify foreign keys, RLS, triggers, or unrelated constraints.
- It does not add a separate pause-history table.
- It works with the current session and sequence tables without introducing new child tables.

### Execution order and safety notes

1. Replace the existing `practice_sessions_status_check` constraint before writing new paused rows.
2. Add `paused_at` and `total_paused_seconds`.
3. Add the non-negative and consistency check constraints.
4. Optionally create the performance index.

This order preserves the existing table semantics while introducing the new lifecycle state. No trigger, RLS policy, or FK is altered in this proposal.

## 6. Rollback SQL proposal (proposal only, not executed)

This rollback must not run if any session is still in `PAUSED` state because that would silently delete pause metadata or leave the database in an inconsistent state.

```sql
BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.practice_sessions
    WHERE status = 'PAUSED'
  ) THEN
    RAISE EXCEPTION 'Rollback aborted: paused sessions still exist. Remove or finalize those sessions before dropping pause metadata.';
  END IF;
END $$;

DROP INDEX IF EXISTS public.idx_practice_sessions_user_status_started_at;

ALTER TABLE public.practice_sessions
  DROP CONSTRAINT IF EXISTS practice_sessions_paused_at_consistency_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_total_paused_seconds_check,
  DROP CONSTRAINT IF EXISTS practice_sessions_status_check;

ALTER TABLE public.practice_sessions
  ADD CONSTRAINT practice_sessions_status_check
  CHECK (
    status::text = ANY (
      ARRAY[
        'CREATED'::character varying,
        'IN_PROGRESS'::character varying,
        'COMPLETED'::character varying,
        'ABANDONED'::character varying
      ]
    )
  );

ALTER TABLE public.practice_sessions
  DROP COLUMN IF EXISTS total_paused_seconds,
  DROP COLUMN IF EXISTS paused_at;

COMMIT;
```

This rollback is intentionally conservative and fails fast if there are still paused sessions. It does not delete pause data silently and it does not alter unrelated constraints.

## 7. Verification SQL after migration

Run these checks after applying the migration to confirm that the design is in place:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'practice_sessions'
  AND column_name IN (
    'id', 'user_id', 'status', 'recovery_time_seconds',
    'planned_repetitions', 'completed_repetitions',
    'actual_duration_seconds', 'started_at', 'completed_at',
    'created_at', 'paused_at', 'total_paused_seconds'
  )
ORDER BY ordinal_position;

SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
  AND conrelid = 'public.practice_sessions'::regclass
  AND conname IN (
    'practice_sessions_status_check',
    'practice_sessions_total_paused_seconds_check',
    'practice_sessions_paused_at_consistency_check'
  )
ORDER BY conname;

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'practice_sessions'
  AND indexname = 'idx_practice_sessions_user_status_started_at';

SELECT status, COUNT(*) AS row_count
FROM public.practice_sessions
GROUP BY status
ORDER BY status;
```

### Rollback limitations

- Rollback is only safe when there are no `PAUSED` rows remaining.
- Rollback cannot restore lost pause timing data if pause rows were already removed or if the app previously computed a final duration without preserving the original paused state.
- Rollback does not touch RLS policies, foreign keys, triggers, or unrelated session tables.
- The optional index is performance-only and may be dropped without affecting correctness.

## 8. Data preservation and backward compatibility analysis

### Existing rows

The existing schema supports created / in-progress / completed / abandoned records. No current rows were present in the inspected environment, but metadata confirms that the table is designed to accept those values.

### Backward compatibility

The proposed migration is backward-compatible with existing data because:
- adding a nullable paused_at column does not affect existing rows
- adding total_paused_seconds with NOT NULL DEFAULT 0 means existing rows are automatically assigned 0
- existing status values remain valid under the new CHECK
- no required migration of historical session rows is necessary

### Compatibility with sequence tables

No change is required for session_sequence_steps, session_position_selections, or session_shot_selections. They safely support continued progress tracking while a session is paused because they do not encode a session state machine; they store progressed sequence and selected options independently.

### Compatibility with RLS

RLS policies remain compatible because they already restrict access by user_id. The pause/resume change does not alter the ownership model.

## 8. Edge-case analysis

### 8.1 User pauses multiple times

This is supported only if the backend enforces the following logic:
- allowed only when current status = 'IN_PROGRESS'
- set status = 'PAUSED', paused_at = now()
- increment total_paused_seconds only when resuming, not when pausing

When the user pauses again after a prior pause, the backend should reject it as invalid because status is already PAUSED.

### 8.2 User closes the application while paused

This is safe from the database perspective because the session remains PAUSED in the row. The app can re-fetch the paused session by user_id + status = 'PAUSED'.

### 8.3 User loses connectivity while already paused

This is safe because the database state is already PAUSED. The user can relaunch and fetch the same record once connectivity is restored.

### 8.4 User loses connectivity while IN_PROGRESS without successfully sending a pause request

This cannot be guaranteed by the backend. The database cannot know the user intended to pause if the pause request never reached the server. The backend can only enforce the persisted state it received.

This is a frontend/offline-sync responsibility: the mobile app should persist a local intent to pause and retry when connectivity returns.

### 8.5 User completes a session while PAUSED

This should be allowed. The backend can set:
- status = 'COMPLETED'
- completed_at = now()
- add the interval from paused_at to completed_at to total_paused_seconds
- paused_at = NULL
- actual_duration_seconds = completion_time - started_at - total_paused_seconds

This is valid because the required lifecycle allows PAUSED -> COMPLETED without resume.

The required duration calculation is therefore:
- actual_duration_seconds = completion_time - started_at - total_paused_seconds

When the session is already PAUSED, the current open pause interval must be counted as paused time before the final duration is calculated.

### 8.6 User attempts to resume a completed session

This should be rejected by the backend. A completed session is terminal.

### 8.7 User attempts to pause an already paused session

This should be rejected. The backend must prevent duplicate pause transitions.

### 8.8 User attempts to start an already started session

This should also be rejected by the backend. A session should not be started twice; the app must only create a new session when the session is not already active or pending.

### 8.9 What is guaranteed vs. what is not

Guaranteed by the database and backend when valid writes happen:
- paused status persists in the row
- sequence progress is kept in session_sequence_steps
- resumed sessions can be reopened by user_id/status query
- completion while paused is valid if explicitly allowed in the application logic

Not guaranteed by the database alone:
- client-side offline pause requests that were never sent
- client app recovery after network loss without local retry logic
- exact client timing if app clocks or network timing are inconsistent

These are frontend synchronization and offline reliability concerns.

## 9. Testing recommendations

1. Database metadata validation
   - Verify the status CHECK includes PAUSED after migration.
   - Verify paused_at, total_paused_seconds, and check constraints are present.

2. Lifecycle tests
   - CREATED -> IN_PROGRESS
   - IN_PROGRESS -> PAUSED -> IN_PROGRESS -> COMPLETED
   - IN_PROGRESS -> PAUSED -> COMPLETED
   - reject PAUSED -> PAUSED
   - reject COMPLETED -> IN_PROGRESS

3. Multi-pause tests
   - pause → resume → pause → resume → complete
   - validate total_paused_seconds accumulates correctly

4. Sequence continuity tests
   - mark step 1 complete, pause, resume, ensure step 1 remains complete and sequence_number is unchanged
   - confirm sequence progress persists across app restart

5. Restart/reconnect tests
   - create session, pause, close app, reconnect, fetch by user_id + status = 'PAUSED'

6. Duration calculation tests
   - verify actual_duration_seconds excludes cumulative paused segments

## 10. Risks and unresolved questions

### Risks

- If the app currently relies on a status enum that is not updated in the same release, the backend may still reject PAUSED until the migration is applied.
- If clients do not retry pause requests while offline, a user may still appear active in the app even though the server never received the pause.
- If actual_duration_seconds semantics include recovery time or exclude it, the business rule must be specified clearly before finalizing the calculation formula.

### Unresolved questions

- Should actual_duration_seconds include recovery time or only active practice time? The current schema does not encode this rule explicitly.
- Is there a business requirement for an audit table of pause intervals? Not required by the current application spec.
- Should PAUSED sessions be automatically resumed on app restart, or should the user explicitly resume from a list of paused sessions? The current schema allows either, but the app workflow should be explicit.

## 11. Final safety statement

No database changes were executed.

This audit is based solely on verified read-only metadata inspection from the live Supabase PostgreSQL database. The migration and rollback SQL above are proposals only and were not executed against the production or development database.
