# ShuttleCoach Supabase Database Baseline Report

Generated: 2026-11-06
Status: Read-only audit before any migration or modification.

This document is a live database snapshot of the current Supabase project state. It does not alter data or schema.

## 1) Summary

- Public schema tables inspected: 13
- Current row counts: see table summary below
- RLS enabled: yes, on all 13 public tables
- FORCE_RLS: false on all 13 public tables
- Policy coverage: partial; lookup and profile tables are missing explicit RLS policies
- Security review: `public.handle_new_user()` exists as a `SECURITY DEFINER` trigger-driven function on `auth.users`
- Key design strengths: user ownership model, lookup tables, composite uniqueness, child tables for practice data
- Key risks: missing RLS coverage, lack of domain validation for position values, missing indexes on common foreign key lookups
- Verified court position mapping: id 0 = CENTRE, id 1 = FRONT_LEFT, id 2 = FRONT_RIGHT, id 3 = CENTRE_LEFT, id 4 = CENTRE_RIGHT, id 5 = BACK_LEFT, id 6 = BACK_RIGHT
- Foreign key audit verification note: the correct relationship query must join on `(constraint_name, table_schema)` with schema-qualified `key_column_usage` and `constraint_column_usage` to avoid duplicate or incorrect matches across constraints.
- No schema or data migration has been executed in the live database.

## 2) Verified court position table

The following rows were queried directly from public.court_positions and verified in the live database.

| id | position_code | position_name | display_order |
|---:|---|---|---:|
| 0 | CENTRE | Centre | 0 |
| 1 | FRONT_LEFT | Front Left | 1 |
| 2 | FRONT_RIGHT | Front Right | 2 |
| 3 | CENTRE_LEFT | Centre Left | 3 |
| 4 | CENTRE_RIGHT | Centre Right | 4 |
| 5 | BACK_LEFT | Back Left | 5 |
| 6 | BACK_RIGHT | Back Right | 6 |

This verifies the exact mapping required by the application:
- Centre = 0
- Front Left = 1
- Front Right = 2
- Centre Left = 3
- Centre Right = 4
- Back Left = 5
- Back Right = 6

Important: `position_code` is not numeric; it is a fixed text value such as `CENTRE`, `FRONT_LEFT`, `BACK_RIGHT`, etc.

## 3) Table inventory and row counts

| Table | Row count |
|---|---:|
| public.profiles | 0 |
| public.court_positions | 7 |
| public.shot_types | 7 |
| public.position_pair_shot_rules | 58 |
| public.practice_sessions | 0 |
| public.session_position_selections | 0 |
| public.session_shot_selections | 0 |
| public.session_sequence_steps | 0 |
| public.saved_presets | 0 |
| public.preset_position_selections | 0 |
| public.preset_shot_selections | 0 |
| public.training_categories | 5 |
| public.training_videos | 0 |

## 4) Exact RLS policy expressions

The following RLS policies were read from the live database and their current USING / WITH CHECK expressions are recorded below.

### public.practice_sessions
- Users can create their own sessions
  - cmd: INSERT
  - USING: NULL
  - WITH CHECK: `(auth.uid() = user_id)`
- Users can delete their own sessions
  - cmd: DELETE
  - USING: `(auth.uid() = user_id)`
  - WITH CHECK: NULL
- Users can update their own sessions
  - cmd: UPDATE
  - USING: `(auth.uid() = user_id)`
  - WITH CHECK: `(auth.uid() = user_id)`
- Users can view their own sessions
  - cmd: SELECT
  - USING: `(auth.uid() = user_id)`
  - WITH CHECK: NULL

### public.saved_presets
- Users can create their own presets
  - cmd: INSERT
  - USING: NULL
  - WITH CHECK: `(auth.uid() = user_id)`
- Users can delete their own presets
  - cmd: DELETE
  - USING: `(auth.uid() = user_id)`
  - WITH CHECK: NULL
- Users can update their own presets
  - cmd: UPDATE
  - USING: `(auth.uid() = user_id)`
  - WITH CHECK: `(auth.uid() = user_id)`
- Users can view their own presets
  - cmd: SELECT
  - USING: `(auth.uid() = user_id)`
  - WITH CHECK: NULL

### public.session_position_selections
- Users can insert their session positions
  - cmd: INSERT
  - USING: NULL
  - WITH CHECK: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_position_selections.session_id) AND (ps.user_id = auth.uid()))))`
- Users can view their session positions
  - cmd: SELECT
  - USING: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_position_selections.session_id) AND (ps.user_id = auth.uid()))))`
  - WITH CHECK: NULL
- Users can delete their session positions
  - cmd: DELETE
  - USING: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_position_selections.session_id) AND (ps.user_id = auth.uid()))))`
  - WITH CHECK: NULL

### public.session_shot_selections
- Users can insert their selected shots
  - cmd: INSERT
  - USING: NULL
  - WITH CHECK: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_shot_selections.session_id) AND (ps.user_id = auth.uid()))))`
- Users can view their selected shots
  - cmd: SELECT
  - USING: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_shot_selections.session_id) AND (ps.user_id = auth.uid()))))`
  - WITH CHECK: NULL
- Users can delete their selected shots
  - cmd: DELETE
  - USING: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_shot_selections.session_id) AND (ps.user_id = auth.uid()))))`
  - WITH CHECK: NULL

### public.session_sequence_steps
- Users can insert their sequence steps
  - cmd: INSERT
  - USING: NULL
  - WITH CHECK: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_sequence_steps.session_id) AND (ps.user_id = auth.uid()))))`
- Users can update their sequence steps
  - cmd: UPDATE
  - USING: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_sequence_steps.session_id) AND (ps.user_id = auth.uid()))))`
  - WITH CHECK: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_sequence_steps.session_id) AND (ps.user_id = auth.uid()))))`
- Users can view their sequence steps
  - cmd: SELECT
  - USING: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_sequence_steps.session_id) AND (ps.user_id = auth.uid()))))`
  - WITH CHECK: NULL
- Users can delete their sequence steps
  - cmd: DELETE
  - USING: `(EXISTS ( SELECT 1 FROM practice_sessions ps WHERE ((ps.id = session_sequence_steps.session_id) AND (ps.user_id = auth.uid()))))`
  - WITH CHECK: NULL

### public.preset_position_selections
- Users can insert their preset positions
  - cmd: INSERT
  - USING: NULL
  - WITH CHECK: `(EXISTS ( SELECT 1 FROM saved_presets p WHERE ((p.id = preset_position_selections.preset_id) AND (p.user_id = auth.uid()))))`
- Users can view their preset positions
  - cmd: SELECT
  - USING: `(EXISTS ( SELECT 1 FROM saved_presets p WHERE ((p.id = preset_position_selections.preset_id) AND (p.user_id = auth.uid()))))`
  - WITH CHECK: NULL
- Users can delete their preset positions
  - cmd: DELETE
  - USING: `(EXISTS ( SELECT 1 FROM saved_presets p WHERE ((p.id = preset_position_selections.preset_id) AND (p.user_id = auth.uid()))))`
  - WITH CHECK: NULL

### public.preset_shot_selections
- Users can insert their preset shots
  - cmd: INSERT
  - USING: NULL
  - WITH CHECK: `(EXISTS ( SELECT 1 FROM saved_presets p WHERE ((p.id = preset_shot_selections.preset_id) AND (p.user_id = auth.uid()))))`
- Users can view their preset shots
  - cmd: SELECT
  - USING: `(EXISTS ( SELECT 1 FROM saved_presets p WHERE ((p.id = preset_shot_selections.preset_id) AND (p.user_id = auth.uid()))))`
  - WITH CHECK: NULL
- Users can delete their preset shots
  - cmd: DELETE
  - USING: `(EXISTS ( SELECT 1 FROM saved_presets p WHERE ((p.id = preset_shot_selections.preset_id) AND (p.user_id = auth.uid()))))`
  - WITH CHECK: NULL

### public.training_categories
- Authenticated users can view active categories
  - cmd: SELECT
  - USING: `(is_active = true)`
  - WITH CHECK: NULL

### public.training_videos
- Authenticated users can view published videos
  - cmd: SELECT
  - USING: `((is_published = true) AND (EXISTS ( SELECT 1 FROM training_categories c WHERE ((c.id = training_videos.category_id) AND (c.is_active = true)))))`
  - WITH CHECK: NULL

### Tables with RLS enabled but no policy
- public.profiles
- public.court_positions
- public.shot_types
- public.position_pair_shot_rules

## 5) Current schema details

### public.profiles
Columns:
- id: uuid, PK, FK to auth.users.id
- full_name: varchar, nullable
- avatar_url: text, nullable
- created_at: timestamptz, default now()
- updated_at: timestamptz, default now()

Foreign keys:
- `profiles_id_fkey` from `public.profiles.id` to `auth.users.id`
- `saved_presets_user_id_fkey` from `public.saved_presets.user_id` to `public.profiles.id`
- `practice_sessions_user_id_fkey` from `public.practice_sessions.user_id` to `public.profiles.id`

Notes:
- RLS enabled: yes
- Policies: none

### public.court_positions
Columns:
- id: smallint, PK
- position_code: varchar, unique
- position_name: varchar
- display_order: smallint, unique

Foreign keys referencing this table:
- `position_pair_shot_rules.player_position_id`
- `position_pair_shot_rules.opponent_position_id`
- `session_position_selections.position_id`
- `session_sequence_steps.player_position_id`
- `session_sequence_steps.opponent_position_id`
- `preset_position_selections.position_id`

Notes:
- 7 rows exist, matching the 7 court positions requirement
- RLS enabled: yes
- Policies: none

### public.shot_types
Columns:
- id: smallint, PK
- shot_name: varchar, unique
- description: text, nullable
- is_active: boolean, nullable, default true

Foreign keys referencing this table:
- `position_pair_shot_rules.shot_type_id`
- `session_shot_selections.shot_type_id`
- `session_sequence_steps.shot_type_id`
- `preset_shot_selections.shot_type_id`

Notes:
- 7 rows exist
- RLS enabled: yes
- Policies: none

### public.position_pair_shot_rules
Columns:
- id: bigint, PK
- player_position_id: smallint
- opponent_position_id: smallint
- shot_type_id: smallint

Foreign keys:
- `player_position_id` -> `court_positions.id`, no action
- `opponent_position_id` -> `court_positions.id`, no action
- `shot_type_id` -> `shot_types.id`, no action

Unique index:
- `unique_position_pair_shot` on `(player_position_id, opponent_position_id, shot_type_id)`

Notes:
- 58 rows
- RLS enabled: yes
- Policies: none

### public.practice_sessions
Columns:
- id: uuid, PK, default gen_random_uuid()
- user_id: uuid, FK to profiles.id, cascade delete
- status: varchar, check values = CREATED / IN_PROGRESS / COMPLETED / ABANDONED
- recovery_time_seconds: integer, >= 0
- planned_repetitions: integer, nullable, > 0 when set
- completed_repetitions: integer, default 0, >= 0
- actual_duration_seconds: integer, nullable, >= 0
- started_at: timestamptz, nullable
- completed_at: timestamptz, nullable
- created_at: timestamptz, default now()

Foreign keys:
- `practice_sessions_user_id_fkey` -> `profiles.id`, `ON DELETE CASCADE`

Child tables:
- `session_position_selections.session_id`
- `session_shot_selections.session_id`
- `session_sequence_steps.session_id`

Notes:
- RLS enabled: yes
- Policies: yes

### public.session_position_selections
Columns:
- session_id: uuid
- court_side: varchar, check values = PLAYER / OPPONENT
- position_id: smallint

Primary key:
- `(session_id, court_side, position_id)`

Foreign keys:
- `session_id` -> `practice_sessions.id`, cascade delete
- `position_id` -> `court_positions.id`, no action

Notes:
- RLS enabled: yes
- Policies: present

### public.session_shot_selections
Columns:
- session_id: uuid
- shot_type_id: smallint

Primary key:
- `(session_id, shot_type_id)`

Foreign keys:
- `session_id` -> `practice_sessions.id`, cascade delete
- `shot_type_id` -> `shot_types.id`, no action

Notes:
- RLS enabled: yes
- Policies: present

### public.session_sequence_steps
Columns:
- id: uuid, PK, default gen_random_uuid()
- session_id: uuid
- sequence_number: integer, check > 0
- completed: boolean, default false
- returned_to_center: boolean, default false
- completed_at: timestamptz, nullable
- player_position_id: smallint, nullable
- opponent_position_id: smallint, nullable
- shot_type_id: smallint, nullable

Unique index:
- `unique_session_sequence` on `(session_id, sequence_number)`

Foreign keys:
- `session_id` -> `practice_sessions.id`, cascade delete
- `player_position_id` -> `court_positions.id`, no action
- `opponent_position_id` -> `court_positions.id`, no action
- `shot_type_id` -> `shot_types.id`, no action

Notes:
- RLS enabled: yes
- Policies: present
- Missing explicit range checks for player/opponent positions (0..6) and completion semantics

### public.saved_presets
Columns:
- id: uuid, PK, default gen_random_uuid()
- user_id: uuid
- preset_name: varchar
- planned_repetitions: integer, > 0
- recovery_time_seconds: integer, >= 0
- created_at: timestamptz, default now()
- updated_at: timestamptz, default now()

Foreign keys:
- `user_id` -> `profiles.id`, cascade delete

Child tables:
- `preset_position_selections.preset_id`
- `preset_shot_selections.preset_id`

Notes:
- RLS enabled: yes
- Policies: present

### public.preset_position_selections
Columns:
- preset_id: uuid
- court_side: varchar, check values = PLAYER / OPPONENT
- position_id: smallint

Primary key:
- `(preset_id, court_side, position_id)`

Foreign keys:
- `preset_id` -> `saved_presets.id`, cascade delete
- `position_id` -> `court_positions.id`, no action

Notes:
- RLS enabled: yes
- Policies: present

### public.preset_shot_selections
Columns:
- preset_id: uuid
- shot_type_id: smallint

Primary key:
- `(preset_id, shot_type_id)`

Foreign keys:
- `preset_id` -> `saved_presets.id`, cascade delete
- `shot_type_id` -> `shot_types.id`, no action

Notes:
- RLS enabled: yes
- Policies: present

### public.training_categories
Columns:
- id: bigint, PK
- category_name: varchar, unique
- description: text, nullable
- display_order: integer, default 0
- is_active: boolean, default true
- created_at: timestamptz, default now()

Foreign keys referencing this table:
- `training_videos.category_id`

Notes:
- 5 rows exist
- RLS enabled: yes
- Policy: SELECT for authenticated users only when `is_active = true`

### public.training_videos
Columns:
- id: uuid, PK, default gen_random_uuid()
- category_id: bigint, FK to training_categories.id, restrict delete
- title: varchar
- description: text, nullable
- video_url: text
- thumbnail_url: text, nullable
- duration_seconds: integer, nullable, >= 0
- difficulty_level: varchar, check in BEGINNER / INTERMEDIATE / ADVANCED
- display_order: integer, default 0
- is_published: boolean, default false
- created_at: timestamptz, default now()
- updated_at: timestamptz, default now()

Foreign keys:
- `category_id` -> `training_categories.id`, `ON DELETE RESTRICT`

Notes:
- RLS enabled: yes
- Policy: SELECT for authenticated users only when video is published and category is active

## 6) Security: function permissions and ownership

### `public.handle_new_user()`
Current definition:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name'
    );

    RETURN NEW;
END;
$function$
```

Verified properties:
- owner: postgres
- is_security_definer: true
- trigger: `on_auth_user_created` on auth.users
- trigger definition: `CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()`

Function execute permissions:
- postgres: EXECUTE
- anon: EXECUTE
- authenticated: EXECUTE
- service_role: EXECUTE

Important:
- This is intentionally not changed in the read-only audit.
- The current signup flow depends on the trigger and function. Converting to `SECURITY INVOKER` must be tested before replacement because the function inserts into `public.profiles` on new auth record creation.

## 7) Constraints and foreign keys

### Primary keys
- `profiles.id`
- `court_positions.id`
- `shot_types.id`
- `position_pair_shot_rules.id`
- `practice_sessions.id`
- `session_position_selections(session_id, court_side, position_id)`
- `session_shot_selections(session_id, shot_type_id)`
- `session_sequence_steps.id`
- `saved_presets.id`
- `preset_position_selections(preset_id, court_side, position_id)`
- `preset_shot_selections(preset_id, shot_type_id)`
- `training_categories.id`
- `training_videos.id`

### Unique constraints / unique indexes
- `court_positions.position_code`
- `court_positions.display_order`
- `shot_types.shot_name`
- `position_pair_shot_rules` composite unique on `(player_position_id, opponent_position_id, shot_type_id)`
- `session_sequence_steps` unique on `(session_id, sequence_number)`
- `session_position_selections` composite unique on `(session_id, court_side, position_id)`
- `session_shot_selections` composite unique on `(session_id, shot_type_id)`
- `preset_position_selections` composite unique on `(preset_id, court_side, position_id)`
- `preset_shot_selections` composite unique on `(preset_id, shot_type_id)`
- `training_categories.category_name`

### Check constraints observed
- `practice_sessions.status` values limited to CREATED / IN_PROGRESS / COMPLETED / ABANDONED
- `recovery_time_seconds >= 0`
- `planned_repetitions > 0`
- `completed_repetitions >= 0`
- `actual_duration_seconds >= 0`
- `session_position_selections.court_side` values limited to PLAYER / OPPONENT
- `preset_position_selections.court_side` values limited to PLAYER / OPPONENT
- `training_videos.difficulty_level` values limited to BEGINNER / INTERMEDIATE / ADVANCED
- `duration_seconds >= 0`
- `sequence_number > 0`

### Foreign key delete behaviors
- `ON DELETE CASCADE`: `practice_sessions.user_id`, `saved_presets.user_id`, `session_position_selections.session_id`, `session_shot_selections.session_id`, `session_sequence_steps.session_id`, `preset_position_selections.preset_id`, `preset_shot_selections.preset_id`
- `ON DELETE NO ACTION`: all lookup-reference FKs to `court_positions` and `shot_types`, and rule table references
- `ON DELETE RESTRICT`: `training_videos.category_id`

## 8) Indexes present and purpose

Current indexes in the public schema:
- `court_positions_pkey` — primary index on `court_positions(id)`
- `court_positions_display_order_key` — unique ordering index for display order
- `court_positions_position_code_key` — unique index on position label text
- `shot_types_pkey` — primary index on `shot_types(id)`
- `shot_types_shot_name_key` — unique index on `shot_types.shot_name`
- `position_pair_shot_rules_pkey` — primary index on `position_pair_shot_rules(id)`
- `unique_position_pair_shot` — unique index on `(player_position_id, opponent_position_id, shot_type_id)`
- `practice_sessions_pkey` — primary index on `practice_sessions(id)`
- `saved_presets_pkey` — primary index on `saved_presets(id)`
- `session_position_selections_pkey` — primary index on `(session_id, court_side, position_id)`
- `session_sequence_steps_pkey` — primary index on `session_sequence_steps(id)`
- `unique_session_sequence` — unique index on `(session_id, sequence_number)`
- `session_shot_selections_pkey` — primary index on `(session_id, shot_type_id)`
- `preset_position_selections_pkey` — primary index on `(preset_id, court_side, position_id)`
- `preset_shot_selections_pkey` — primary index on `(preset_id, shot_type_id)`
- `training_categories_pkey` — primary index on `training_categories(id)`
- `training_categories_category_name_key` — unique index on category label
- `training_videos_pkey` — primary index on `training_videos(id)`

Validated index assessment:
- The existing composite primary-key and unique indexes already begin with `session_id` / `preset_id`, so additional indexes on those leading columns would be redundant.
- Candidate indexes to keep for the app are:
  - `practice_sessions.user_id` — fetch all sessions for a user
  - `saved_presets.user_id` — fetch all presets for a user
  - `training_videos.category_id` — fetch videos in a category

## 9) Sequence logic: move, shot and return-to-centre

The database design currently represents the practice flow as rows in `session_sequence_steps` with these fields:
- `session_id` — parent session
- `sequence_number` — order of the step in the session
- `player_position_id` — current or starting position for the player
- `opponent_position_id` — current or starting position for the opponent
- `shot_type_id` — the shot selected in the step
- `returned_to_center` — true if the step includes returning to centre
- `completed` — track whether the step is marked complete
- `completed_at` — timestamp when the step was completed

This means the database does not treat one row as a complete movement cycle. Instead:
- a step may represent one move, one shot, or a return-to-centre action
- several rows together can describe a complete sequence in order
- `returned_to_center` is a boolean signal for the step, not a separate table or dedicated row type

This design is compatible with the app requirement as long as the app inserts sequential rows in order and does not assume each row is a full cycle. The schema must not reject valid return-to-centre rows by enforcing a single row = complete cycle rule. Therefore, the proposed `session_sequence_steps_step_has_content` check is deferred until the application semantics are validated against actual usage.

## 10) Baseline conclusion

The live database is generally aligned with the app requirements, and the court position mapping is verified correctly as 0..6 with text codes. The main risks remain:
- missing RLS policies for profile and lookup tables,
- broad execute permissions on `handle_new_user()`,
- missing non-primary indexes on user-scoped lookup patterns,
- and deferred validation for `session_sequence_steps` semantics until the app logic is confirmed.

No migration has been executed.

Current indexes in public schema:
- `court_positions_pkey`
- `court_positions_display_order_key`
- `court_positions_position_code_key`
- `shot_types_pkey`
- `shot_types_shot_name_key`
- `position_pair_shot_rules_pkey`
- `unique_position_pair_shot`
- `practice_sessions_pkey`
- `saved_presets_pkey`
- `session_position_selections_pkey`
- `session_sequence_steps_pkey`
- `unique_session_sequence`
- `session_shot_selections_pkey`
- `preset_position_selections_pkey`
- `preset_shot_selections_pkey`
- `training_categories_pkey`
- `training_categories_category_name_key`
- `training_videos_pkey`

Current assessment:
- PK and uniqueness indexes are appropriate
- Missing non-PK indexes on user ownership and parent-child relationships remain the main performance gap

## 6) RLS policies present

### Tables with policies
- public.practice_sessions
  - Users can create their own sessions
  - Users can delete their own sessions
  - Users can update their own sessions
  - Users can view their own sessions

- public.saved_presets
  - Users can create their own presets
  - Users can delete their own presets
  - Users can update their own presets
  - Users can view their own presets

- public.session_position_selections
  - Users can insert their session positions
  - Users can view their session positions
  - Users can delete their session positions

- public.session_shot_selections
  - Users can insert their selected shots
  - Users can view their selected shots
  - Users can delete their selected shots

- public.session_sequence_steps
  - Users can insert their sequence steps
  - Users can update their sequence steps
  - Users can view their sequence steps
  - Users can delete their sequence steps

- public.preset_position_selections
  - Users can insert their preset positions
  - Users can view their preset positions
  - Users can delete their preset positions

- public.preset_shot_selections
  - Users can insert their preset shots
  - Users can view their preset shots
  - Users can delete their preset shots

- public.training_categories
  - Authenticated users can view active categories

- public.training_videos
  - Authenticated users can view published videos

### Tables with RLS enabled but no policies
- public.profiles
- public.court_positions
- public.shot_types
- public.position_pair_shot_rules

### Security finding from database linter
- RLS enabled without policy: 4 tables
- `public.handle_new_user()` executes as `SECURITY DEFINER` and is callable by anon/authenticated

## 7) Functions and triggers

### public.handle_new_user()
Definition:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name'
    );

    RETURN NEW;
END;
$function$
```

Properties:
- owner: postgres
- security definer: true
- trigger: `on_auth_user_created` on `auth.users`

Trigger definition:

```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
```

Permissions:
- `anon` has execute
- `authenticated` has execute
- `service_role` has execute
- `postgres` has execute

This is functionally appropriate for user registration, but it should be reviewed for privilege-escalation risk and execute scope.

## 8) Current risk assessment

### Strengths
- User-owned tables are protected by RLS with owner-based conditions
- Lookup tables are managed centrally and referenced by child tables
- Natural-key uniqueness is strong
- Session and preset flows are well-modeled relationally

### Risks
- Missing RLS policies on lookup and profile tables
- `SECURITY DEFINER` function with broad execute permissions
- No explicit range validation for court positions 0..6 on session steps
- Missing index coverage on user_id and parent-child relations
- `training_videos.category_id` restrict delete is safe but should be documented

## 9) Baseline conclusion

The schema already supports the main app workflows for:
- user registration and profile creation
- practice sessions and presets
- selection tables for positions and shots
- ordered sequence tracking
- training categories and videos

However, the design is not fully hardened yet because the metadata tables are missing policies, the trigger function needs a privilege review, and additional constraints/indexes are required to enforce the badminton domain logic correctly.

This report is intended as the pre-migration baseline only. No schema or data changes have been executed.
