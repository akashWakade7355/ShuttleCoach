# Final ShuttleCoach Database Readiness Report

Generated: 2026-11-07
Status: Read-only verification complete. Runtime auth tests remain BLOCKED until a safe staging environment and explicit approval are available.

## 1) Scope and evidence base

This report is based only on live metadata inspection and review of the project documentation, not on any live database change.

Evidence reviewed:
- [DATABASE_TEST_REPORT.md](DATABASE_TEST_REPORT.md)
- [DATABASE_BEHAVIOR_TEST_PLAN.md](DATABASE_BEHAVIOR_TEST_PLAN.md)
- [TEMP_USER_CLEANUP_REVIEW.md](TEMP_USER_CLEANUP_REVIEW.md)
- [FINAL_MANDATORY_MIGRATION.sql](FINAL_MANDATORY_MIGRATION.sql)
- [ROLLBACK_MIGRATION.sql](ROLLBACK_MIGRATION.sql)
- [DATABASE_CHANGELOG.md](DATABASE_CHANGELOG.md)
- [DATABASE_BEFORE.md](DATABASE_BEFORE.md)
- live SQL metadata queries against `pg_class`, `pg_policies`, `pg_indexes`, `pg_constraint`, `pg_proc`, `pg_trigger`, `information_schema.role_table_grants`, `information_schema.column_privileges`, and `information_schema.referential_constraints`

No migration was executed.
No user accounts were created.
No rows were inserted or modified.
No permissions or policies were changed.

## 2) Completed read-only checks

### 2.1 Public table RLS state

Observed result: all 13 public tables had `rls_enabled = true` and `force_rls = false`.

This is evidence-backed from the live metadata query and is consistent across the supporting documents.

### 2.2 Policy inventory and expressions

Observed result:
- user-owned tables had explicit policies for `practice_sessions`, `saved_presets`, session selection tables, and the training lookup tables
- target tables had no policy rows:
  - `public.profiles`
  - `public.court_positions`
  - `public.shot_types`
  - `public.position_pair_shot_rules`

Key policy expressions confirmed from live metadata include:
- `auth.uid() = user_id` for user-owned session/preset access
- `EXISTS (...)` checks on parent `practice_sessions` or `saved_presets` rows for nested selection tables
- `is_active = true` for `training_categories`
- `(is_published = true) AND (category is active)` for `training_videos`

### 2.3 Table-level and column-level grants

Observed result:
- the live project had broad `anon` and `authenticated` grants on the target tables
- the same broad privileges were present at the column level for the relevant columns in the target tables
- the privileges included `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `REFERENCES`, `TRIGGER`, and `TRUNCATE`

This is a material finding and was captured in the security audit documents. The `FINAL_MANDATORY_MIGRATION.sql` file was reviewed and cleaned to reflect the exact live state and the least-privilege intention.

### 2.4 Foreign keys and ON DELETE behavior

Observed result:

| Parent | Child | Behavior |
|---|---|---|
| `public.profiles.id` | `public.practice_sessions.user_id` | `ON DELETE CASCADE` |
| `public.profiles.id` | `public.saved_presets.user_id` | `ON DELETE CASCADE` |
| `public.practice_sessions.id` | `public.session_position_selections.session_id` | `ON DELETE CASCADE` |
| `public.practice_sessions.id` | `public.session_shot_selections.session_id` | `ON DELETE CASCADE` |
| `public.practice_sessions.id` | `public.session_sequence_steps.session_id` | `ON DELETE CASCADE` |
| `public.saved_presets.id` | `public.preset_position_selections.preset_id` | `ON DELETE CASCADE` |
| `public.saved_presets.id` | `public.preset_shot_selections.preset_id` | `ON DELETE CASCADE` |
| `public.training_categories.id` | `public.training_videos.category_id` | `ON DELETE RESTRICT` |

Additional live evidence:
- `public.profiles.id` is a foreign key to `auth.users(id)` with `ON DELETE CASCADE` via `profiles_id_fkey`
- this cascade is not a `public` table-to-`auth.users` foreign key from child tables; it is a direct profile FK from `public.profiles` to `auth.users`

### 2.5 Required indexes

Observed result:
- the named user lookup indexes were not present: `idx_practice_sessions_user_id`, `idx_saved_presets_user_id`, and `idx_training_videos_category_id`
- the database only had primary-key indexes for those tables

This is consistent with the earlier report and the live `pg_indexes` query.

### 2.6 Signup function and trigger

Observed result:
- function `public.handle_new_user()` exists
- it is `SECURITY DEFINER`
- it inserts into `public.profiles (id, full_name)` with `NEW.id` and `NEW.raw_user_meta_data ->> 'full_name'`
- trigger `on_auth_user_created` is attached to `auth.users` and fires `AFTER INSERT`

This confirms the application design expectation that a user signup creates a profile row automatically.

### 2.7 Schema usage privileges

Observed result:
- the live schema has the expected public tables and auth tables, but no explicit least-privilege pattern for target lookup/profile tables
- user-owned tables are protected by row policies, while the target tables lacked explicit policy coverage

### 2.8 Migration handling of column-level grants

Observed result:
- the migration files were reviewed and corrected to explicitly reflect that column-level privileges must be revoked, not just table-level grants
- the final migration and rollback files carry explicit column-level revocation logic for the live target tables

### 2.9 Rollback fidelity

Observed result:
- the rollback file restores the observed original grants captured from the live metadata
- it drops the migration-created RLS policies
- it is not intended to be executed against the live database without approved staging review

## 3) Issues found

1. Missing explicit RLS policies on the profile and lookup tables.
2. Broad `anon` and `authenticated` privileges at both table and column levels.
3. The live database had no active `auth.users` or `public.profiles` rows at the time of verification.
4. `handle_new_user()` is present and creates a profile row automatically, which means the cascade path matters if a user is deleted.
5. The live project may not be confirmed to be a sandbox or staging environment.
6. Email confirmation settings could not be confirmed from read-only metadata alone.
7. The project setup is not proven safe for temporary user creation in the existing environment.

## 4) Corrections made to migration files

The following corrections were made to the migration documents based on live evidence:

- [FINAL_MANDATORY_MIGRATION.sql](FINAL_MANDATORY_MIGRATION.sql): added a live-schema note clarifying the `auth.users -> public.profiles` `ON DELETE CASCADE` behavior and the production-sensitive nature of the migration.
- [ROLLBACK_MIGRATION.sql](ROLLBACK_MIGRATION.sql): added the same explicit note so rollback documentation matches the actual live data flow and does not suggest that the database is safe to mutate without staging approval.

No SQL was executed in either file.

## 5) Behavioral tests that remain blocked

The following tests are documented as blocked until a safe, non-production Supabase project is available and explicit approval is granted:

- two-user profile isolation
- unauthorized profile updates
- authenticated lookup-table reads
- anonymous profile access
- allowed and forbidden profile column updates
- signup trigger verification

The script prepared for them is [AUTH_BEHAVIOR_TEST_SCRIPTS.sh](AUTH_BEHAVIOR_TEST_SCRIPTS.sh). It does not contain hardcoded credentials or secret values and is intentionally gated behind `ALLOW_TESTING=true`.

## 6) Production risks

The key production risks are:

- creating temporary users in the live project could produce real, user-owned data and trigger actual cascades
- deleting an auth user would cascade from `public.profiles.id` to `public.practice_sessions` and `public.saved_presets`
- downstream child tables would then cascade from sessions/presets to selection rows
- the live project is not confirmed to be a sandbox or staging environment
- live auth settings such as email confirmation and signup enablement cannot be proven from read-only schema metadata alone
- a live production mutation without an approved test environment would risk data loss or policy drift

## 7) Backup status and limitations

The project documents show the database was reviewed read-only and a backup verification path was considered, but no live mutation or backup restoration process was executed.

Limitation:
- backup validation is not proof of runtime auth safety
- a backup alone does not confirm the database is safe for temporary auth testing
- the current live database has zero users, which means any runtime verification must happen in an approved testing environment

## 8) Migration execution prerequisites

A migration like the proposal in [FINAL_MANDATORY_MIGRATION.sql](FINAL_MANDATORY_MIGRATION.sql) should only be run when all of the following are true:

1. a dedicated non-production staging/sandbox project is available
2. the schema and data are confirmed to match the live app model
3. the project is explicitly approved for auth testing
4. a rollback plan is reviewed and approved
5. all temporary users and records are cleaned up after testing
6. the app team confirms the least-privilege policy matches the application expectations
7. behavioral validation is performed with real JWTs in the approved staging environment

## 9) Rollback procedure

The rollback script is [ROLLBACK_MIGRATION.sql](ROLLBACK_MIGRATION.sql).

The rollback restores:
- original table-level grants captured from the live metadata
- original column-level grants captured from the live metadata
- policy drops for the migration-created RLS rules

This is a documentation-backed rollback path, not a live execution step.

## 10) Final database readiness decision

### Decision: NOT READY for live auth testing in the current project

Reason:
- the project is not confirmed to be a sandbox or staging environment
- the database has no active user rows at the moment, so runtime auth behavior cannot be validated safely in the current live environment
- the current project has a real cross-user cascade path via `public.profiles` and downstream session/preset tables
- missing policy coverage and broad grants remain a security issue in need of explicit least-privilege design
- behavioral auth tests require real user creation and JWT-based validation, which is blocked outside a safe test environment

### Safe conclusion

The database is read-only verified and documented, but it is not ready for live temporary-user validation in the current project. Runtime auth testing must be moved to an approved non-production environment before any user creation or write requests are allowed.

## 11) Files created or modified

- [AUTH_BEHAVIOR_TEST_SCRIPTS.sh](AUTH_BEHAVIOR_TEST_SCRIPTS.sh)
- [FINAL_DATABASE_READINESS_REPORT.md](FINAL_DATABASE_READINESS_REPORT.md)
- [FINAL_MANDATORY_MIGRATION.sql](FINAL_MANDATORY_MIGRATION.sql)
- [ROLLBACK_MIGRATION.sql](ROLLBACK_MIGRATION.sql)

## 12) Remaining blockers

- no approved sandbox project for temporary auth testing
- no explicit sign-up/email-confirmation configuration validation from the live dashboard
- no production authorization approval to create temporary users or run write requests
- no runtime behavior proof from real JWT-based access checks yet

This is the final read-only status: evidence-rich, non-mutating, and blocked from live auth validation until a separate safe environment is approved.
