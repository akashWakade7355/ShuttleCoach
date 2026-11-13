PROJECT: ShuttleCoach / Badminton Shadow Practice App
DATABASE: Supabase PostgreSQL 17.11
SCHEMA: public
BACKEND: Java 25 + Spring Boot
ORM: Hibernate / Spring Data JPA

This reference is reconciled with DATABASE_SCHEMAINSPECTION.txt. Column metadata, primary keys, and the listed foreign keys below are verified as recorded in that inspection. PostgreSQL type names use canonical spellings; varchar lengths are included. `NOT NULL`/`NULL` reflects the inspection's NULLABLE 0/1. Defaults are reproduced as reported. Constraint names, unique constraints, check constraints, and FK ON DELETE/ON UPDATE rules were not included in the inspection and remain **Not inspected / Unverified**. Identity/generated-column metadata was not reported separately.

========================================================
1. public.profiles
========================================================
Columns:
- id UUID NOT NULL PRIMARY KEY; default: none
- full_name VARCHAR(100) NULL; default: none
- avatar_url TEXT NULL; default: none
- created_at TIMESTAMPTZ NULL; default: now()
- updated_at TIMESTAMPTZ NULL; default: now()

Foreign keys (verified as listed):
- id -> users.id (target schema not identified in inspection; association with Supabase auth.users is not established by this output)
Other constraints / FK actions: Not inspected / Unverified.

========================================================
2. public.court_positions
========================================================
Columns:
- id SMALLINT NOT NULL PRIMARY KEY; default: none
- position_code VARCHAR(30) NOT NULL; default: none
- position_name VARCHAR(50) NOT NULL; default: none
- display_order SMALLINT NOT NULL; default: none
Foreign keys: none listed in inspection.
Other constraints: Not inspected / Unverified.

Known position mapping (documentation, not verified by this metadata dump):
0 Centre; 1 Front Left; 2 Front Right; 3 Centre Left; 4 Centre Right; 5 Back Left; 6 Back Right.

========================================================
3. public.shot_types
========================================================
Columns:
- id SMALLINT NOT NULL PRIMARY KEY; default: none
- shot_name VARCHAR(50) NOT NULL; default: none
- description TEXT NULL; default: none
- is_active BOOLEAN NULL; default: true
Foreign keys: none listed in inspection.
Other constraints: Not inspected / Unverified.
Known shot mapping (documentation, not verified by this metadata dump): 1 Clear; 2 Drop Shot; 3 Smash; 4 Net Shot; 5 Lift; 6 Drive; 7 Block.

========================================================
4. public.position_pair_shot_rules
========================================================
Columns:
- id BIGINT NOT NULL PRIMARY KEY; default: none
- player_position_id SMALLINT NOT NULL; default: none
- opponent_position_id SMALLINT NOT NULL; default: none
- shot_type_id SMALLINT NOT NULL; default: none
Foreign keys (verified):
- player_position_id -> public.court_positions.id
- opponent_position_id -> public.court_positions.id
- shot_type_id -> public.shot_types.id
Purpose: records valid player-position/opponent-position/shot combinations (business description; not constraint metadata).
Other constraints / FK actions: Not inspected / Unverified.

========================================================
5. public.practice_sessions
========================================================
Columns:
- id UUID NOT NULL PRIMARY KEY; default: gen_random_uuid()
- user_id UUID NOT NULL; default: none
- status VARCHAR(20) NOT NULL; default: 'CREATED'::character varying
- recovery_time_seconds INTEGER NOT NULL; default: none
- planned_repetitions INTEGER NULL; default: none
- completed_repetitions INTEGER NOT NULL; default: 0
- actual_duration_seconds INTEGER NULL; default: none
- started_at TIMESTAMPTZ NULL; default: none
- completed_at TIMESTAMPTZ NULL; default: none
- created_at TIMESTAMPTZ NOT NULL; default: now()
- repetition_duration_seconds INTEGER NULL; default: none
  - Proposed practice timing configuration for the maximum allowed duration of a complete repetition (move → shot → return to centre).
  - Validation rule: NULL or value > 0.
- preparation_time_seconds INTEGER NULL; default: none
  - Proposed one-time countdown before the first repetition begins.
  - Validation rule: NULL or value >= 0; 0 means practice starts immediately with no countdown.
Foreign keys (verified): user_id -> public.profiles.id.
Other constraints / FK actions: Not inspected / Unverified.

Additional proposal note:
- These two timing columns are not part of the original baseline schema inspection and are intentionally added as nullable fields so that historical practice sessions are not given invented timing defaults.
- The forward migration adds the columns and the relevant CHECK constraints without modifying existing permissions, auth logic, or unrelated tables.

========================================================
6. public.session_position_selections
========================================================
Columns:
- session_id UUID NOT NULL; default: none
- court_side VARCHAR(10) NOT NULL; default: none
- position_id SMALLINT NOT NULL; default: none
Primary key (verified composite): (session_id, court_side, position_id)
Foreign keys (verified):
- session_id -> public.practice_sessions.id
- position_id -> public.court_positions.id
Other constraints / FK actions: Not inspected / Unverified.

========================================================
7. public.session_shot_selections
========================================================
Columns:
- session_id UUID NOT NULL; default: none
- shot_type_id SMALLINT NOT NULL; default: none
Primary key (verified composite): (session_id, shot_type_id)
Foreign keys (verified):
- session_id -> public.practice_sessions.id
- shot_type_id -> public.shot_types.id
Other constraints / FK actions: Not inspected / Unverified.

========================================================
8. public.session_sequence_steps
========================================================
Columns:
- id UUID NOT NULL PRIMARY KEY; default: gen_random_uuid()
- session_id UUID NOT NULL; default: none
- sequence_number INTEGER NOT NULL; default: none
- completed BOOLEAN NOT NULL; default: false
- returned_to_center BOOLEAN NOT NULL; default: false
- completed_at TIMESTAMPTZ NULL; default: none
- player_position_id SMALLINT NULL; default: none
- opponent_position_id SMALLINT NULL; default: none
- shot_type_id SMALLINT NULL; default: none
Foreign keys (verified):
- session_id -> public.practice_sessions.id
- player_position_id -> public.court_positions.id
- opponent_position_id -> public.court_positions.id
- shot_type_id -> public.shot_types.id
Purpose: stores generated practice sequence steps (business description).
Other constraints / FK actions: Not inspected / Unverified.

========================================================
9. public.saved_presets
========================================================
Columns:
- id UUID NOT NULL PRIMARY KEY; default: gen_random_uuid()
- user_id UUID NOT NULL; default: none
- preset_name VARCHAR(100) NOT NULL; default: none
- planned_repetitions INTEGER NOT NULL; default: none
- recovery_time_seconds INTEGER NOT NULL; default: none
- created_at TIMESTAMPTZ NOT NULL; default: now()
- updated_at TIMESTAMPTZ NOT NULL; default: now()
Foreign keys (verified): user_id -> public.profiles.id.
Other constraints / FK actions: Not inspected / Unverified.

========================================================
10. public.preset_position_selections
========================================================
Columns:
- preset_id UUID NOT NULL; default: none
- court_side VARCHAR(10) NOT NULL; default: none
- position_id SMALLINT NOT NULL; default: none
Primary key (verified composite): (preset_id, court_side, position_id)
Foreign keys (verified):
- preset_id -> public.saved_presets.id
- position_id -> public.court_positions.id
Other constraints / FK actions: Not inspected / Unverified.

========================================================
11. public.preset_shot_selections
========================================================
Columns:
- preset_id UUID NOT NULL; default: none
- shot_type_id SMALLINT NOT NULL; default: none
Primary key (verified composite): (preset_id, shot_type_id)
Foreign keys (verified):
- preset_id -> public.saved_presets.id
- shot_type_id -> public.shot_types.id
Other constraints / FK actions: Not inspected / Unverified.

========================================================
12. public.training_categories
========================================================
Columns:
- id BIGINT NOT NULL PRIMARY KEY; default: none
- category_name VARCHAR(100) NOT NULL; default: none
- description TEXT NULL; default: none
- display_order INTEGER NOT NULL; default: 0
- is_active BOOLEAN NOT NULL; default: true
- created_at TIMESTAMPTZ NOT NULL; default: now()
Foreign keys: none listed in inspection.
Other constraints: Not inspected / Unverified.

Known categories (documentation, not verified by this metadata dump): Basic Techniques; Footwork; Advanced Shots; Training and Fitness; Rules and Fundamentals.

========================================================
13. public.training_videos
========================================================
Columns:
- id UUID NOT NULL PRIMARY KEY; default: gen_random_uuid()
- category_id BIGINT NOT NULL; default: none
- title VARCHAR(200) NOT NULL; default: none
- description TEXT NULL; default: none
- video_url TEXT NOT NULL; default: none
- thumbnail_url TEXT NULL; default: none
- duration_seconds INTEGER NULL; default: none
- difficulty_level VARCHAR(20) NULL; default: none
- display_order INTEGER NOT NULL; default: 0
- is_published BOOLEAN NOT NULL; default: false
- created_at TIMESTAMPTZ NOT NULL; default: now()
- updated_at TIMESTAMPTZ NOT NULL; default: now()
Foreign keys (verified): category_id -> public.training_categories.id.
Other constraints / FK actions: Not inspected / Unverified.

========================================================
METADATA COVERAGE AND LIMITATIONS
========================================================
The inspection lists all 13 requested public tables and reports columns, PostgreSQL types, varchar lengths, nullability, defaults, primary keys and foreign-key endpoints. It does not report constraint names, unique constraints, check constraints, FK ON DELETE/ON UPDATE behavior, identity/generated-column attributes, or index definitions; each is Not inspected / Unverified. For profiles.id, the inspection reports the target as users.id without a schema qualifier; whether that means auth.users.id must be confirmed from schema-qualified catalog metadata. The court/shot ID mappings and category names above are supplied business/reference information, not verified by this metadata listing.
