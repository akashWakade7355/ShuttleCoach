# ShuttleCoach Database Test Report

Generated: 2026-11-07
Status: Read-only validation only; no migration, no data changes, no live privilege changes.

This report captures only read-only inspection of the live Supabase database. No `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `GRANT`, or `REVOKE` statements were executed against the live database.

## 1) Test summary

| Test name | SQL / method | Actual result | Status | Explanation |
|---|---|---|---|---|
| Test 1: Compare auth users and profiles | `SELECT (SELECT COUNT(*) FROM auth.users) AS total_auth_users, (SELECT COUNT(*) FROM public.profiles) AS total_profiles;` | `total_auth_users = 0`, `total_profiles = 0` | PASS | Both counts were read successfully and are equal to zero; no auth users or profiles exist in the current database. |
| Test 2: Verify RLS status | Query `pg_class` + `pg_namespace` for all 13 public tables | All 13 public tables returned `rls_enabled = true`, `force_rls = false` | PASS | RLS is enabled on every public table inspected. |
| Test 3: Verify policies | Query `pg_policies` for all listed tables | Only user-owned tables had policies; target tables had no policy rows | FAIL | `profiles`, `court_positions`, `shot_types`, and `position_pair_shot_rules` had no explicit policies. |
| Test 4: Verify effective privileges | `information_schema.role_table_grants` and `information_schema.column_privileges` | `anon` and `authenticated` both had broad table grants and column grants on target tables | FAIL | Table privileges and column privileges were both broad and included `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `REFERENCES`, `TRIGGER`, `TRUNCATE`. |
| Test 5: Verify foreign keys and indexes | `information_schema` foreign key query + `pg_indexes` | Valid FKs confirmed; `practice_sessions(user_id)`, `saved_presets(user_id)`, and `training_videos(category_id)` indexes do not exist | FAIL | These named indexes are not present; the database only has primary-key indexes. |
| Test 6: Verify signup trigger | Metadata queries against `pg_proc` and `pg_trigger` | `handle_new_user()` is `SECURITY DEFINER`, owner is `postgres`, `search_path` is set to empty string, trigger is `AFTER INSERT ON auth.users` | PASS | Signup logic is present and consistent with the app’s profile creation flow. |
| Test 7: Authentication and RLS behavioral testing | Manual procedure only; no live auth session was used | Not executed in live DB | NOT TESTED | Safe behavioral verification requires an isolated, authenticated testing environment; no live session was created. |

## 2) Test 1: Compare Supabase Auth users and profiles

### SQL used
```sql
SELECT
    (SELECT COUNT(*) FROM auth.users) AS total_auth_users,
    (SELECT COUNT(*) FROM public.profiles) AS total_profiles;
```

### Actual result
```text
total_auth_users = 0
total_profiles = 0
```

### Status
PASS

### Explanation
The live database currently has no rows in `auth.users` and no rows in `public.profiles`. This means there is no evidence of an active signup flow being exercised at the moment, and no user records exist to test cross-user access behavior safely.

### Security concerns
None from this specific check. The important point is that there are no existing users to validate against.

### Recommended next action
If the application expects users, verify that the auth provider is configured and that profile creation is triggered only when a user signs in or is created through Supabase Auth.

## 3) Test 2: Verify RLS status

### SQL used
```sql
SELECT n.nspname AS schema_name,
       c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS force_rls
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
ORDER BY c.relname;
```

### Actual result
```text
public.court_positions   rls_enabled=true  force_rls=false
public.position_pair_shot_rules  rls_enabled=true  force_rls=false
public.practice_sessions  rls_enabled=true  force_rls=false
public.preset_position_selections  rls_enabled=true  force_rls=false
public.preset_shot_selections  rls_enabled=true  force_rls=false
public.profiles  rls_enabled=true  force_rls=false
public.saved_presets  rls_enabled=true  force_rls=false
public.session_position_selections  rls_enabled=true  force_rls=false
public.session_sequence_steps  rls_enabled=true  force_rls=false
public.session_shot_selections  rls_enabled=true  force_rls=false
public.shot_types  rls_enabled=true  force_rls=false
public.training_categories  rls_enabled=true  force_rls=false
public.training_videos  rls_enabled=true  force_rls=false
```

### Status
PASS

### Explanation
All 13 public tables have RLS enabled; `force_rls` is false on each, which indicates normal row-level enforcement without forced row security override. This is expected for a database with table-level row protection enabled.

### Security concerns
RLS being enabled is necessary but not sufficient. The main issue is that the target tables have no explicit policy rows, which creates a policy gap.

### Recommended next action
Review explicit policies for the target tables and define least-privilege row access rules before enabling or relying on end-user data flows.

## 4) Test 3: Verify policies

### SQL used
```sql
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles','court_positions','shot_types','position_pair_shot_rules',
    'practice_sessions','saved_presets','session_sequence_steps',
    'preset_position_selections','preset_shot_selections',
    'session_position_selections','session_shot_selections',
    'training_categories','training_videos'
  )
ORDER BY tablename, policyname;
```

### Actual result
For the target tables, the result set was empty:
- `profiles`
- `court_positions`
- `shot_types`
- `position_pair_shot_rules`

For the remaining user-owned tables, the following policy names were present:

| Table | Policy names | Command | Roles | USING expression | WITH CHECK |
|---|---|---|---|---|---|
| `practice_sessions` | `Users can create their own sessions`, `Users can delete their own sessions`, `Users can update their own sessions`, `Users can view their own sessions` | `INSERT`, `DELETE`, `UPDATE`, `SELECT` | `{authenticated}` | `auth.uid() = user_id` or child-table ownership checks | `auth.uid() = user_id` |
| `saved_presets` | `Users can create their own presets`, `Users can delete their own presets`, `Users can update their own presets`, `Users can view their own presets` | `INSERT`, `DELETE`, `UPDATE`, `SELECT` | `{authenticated}` | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `session_position_selections` | `Users can delete their session positions`, `Users can insert their session positions`, `Users can view their session positions` | `DELETE`, `INSERT`, `SELECT` | `{authenticated}` | EXISTS check on parent `practice_sessions` row | `EXISTS (...)` |
| `session_sequence_steps` | `Users can delete their sequence steps`, `Users can insert their sequence steps`, `Users can update their sequence steps`, `Users can view their sequence steps` | `DELETE`, `INSERT`, `UPDATE`, `SELECT` | `{authenticated}` | EXISTS check on parent `practice_sessions` row | EXISTS check on parent session |
| `session_shot_selections` | `Users can delete their selected shots`, `Users can insert their selected shots`, `Users can view their selected shots` | `DELETE`, `INSERT`, `SELECT` | `{authenticated}` | EXISTS check on parent `practice_sessions` row | N/A |
| `preset_position_selections` | `Users can delete their preset positions`, `Users can insert their preset positions`, `Users can view their preset positions` | `DELETE`, `INSERT`, `SELECT` | `{authenticated}` | EXISTS check on parent `saved_presets` row | EXISTS check on parent preset |
| `preset_shot_selections` | `Users can delete their preset shots`, `Users can insert their preset shots`, `Users can view their preset shots` | `DELETE`, `INSERT`, `SELECT` | `{authenticated}` | EXISTS check on parent `saved_presets` row | EXISTS check on parent preset |
| `training_categories` | `Authenticated users can view active categories` | `SELECT` | `{authenticated}` | `(is_active = true)` | N/A |
| `training_videos` | `Authenticated users can view published videos` | `SELECT` | `{authenticated}` | `((is_published = true) AND (EXISTS...category active...))` | N/A |

### Status
FAIL

### Explanation
The target tables all have RLS enabled but no policies. This means they are effectively inaccessible unless another mechanism grants access, and it is not safe to assume the app can rely on the default public permissions.

### Security concerns
- End-user access may be blocked unexpectedly.
- The permission model is not explicit for lookup and profile tables.
- This is a likely source of runtime authorization issues in the app.

### Recommended next action
Create explicit, least-privilege policies for the target tables before any production migration or release.

## 5) Test 4: Verify effective privileges

### SQL used
```sql
SELECT table_schema, table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name IN ('profiles','court_positions','shot_types','position_pair_shot_rules')
  AND grantee IN ('anon','authenticated','PUBLIC')
ORDER BY table_name, grantee, privilege_type;

SELECT table_schema, table_name, column_name, grantee, privilege_type
FROM information_schema.column_privileges
WHERE table_schema = 'public'
  AND table_name IN ('profiles','court_positions','shot_types','position_pair_shot_rules')
  AND grantee IN ('anon','authenticated','PUBLIC')
ORDER BY table_name, column_name, grantee, privilege_type;
```

### Actual result
Table-level grants for the target tables were broad for both `anon` and `authenticated`:
- `DELETE`
- `INSERT`
- `REFERENCES`
- `SELECT`
- `TRIGGER`
- `TRUNCATE`
- `UPDATE`

Column-level privileges also existed for the same roles and included the same action set on every column within:
- `public.profiles`
- `public.court_positions`
- `public.shot_types`
- `public.position_pair_shot_rules`

This applied to the relevant columns such as `id`, `full_name`, `avatar_url`, `position_code`, `position_name`, `shot_name`, `description`, `player_position_id`, `opponent_position_id`, `shot_type_id`, and related lookup columns.

### Status
FAIL

### Explanation
The live database is not using least privilege. `anon` and `authenticated` both have broad object-level and column-level permissions on the target tables. The original `REVOKE ALL` assumption is not enough because column-level privileges can persist separately.

### Security concerns
This is a material authorization risk. Broad access on the profile and lookup tables exposes user-owned data and lookup metadata to roles that should have narrower access.

### Recommended next action
Define a least-privilege model, then revoke table-level and column-level grants explicitly before enabling a production migration.

## 6) Test 5: Verify foreign keys and indexes

### SQL used
```sql
SELECT tc.table_schema,
       tc.table_name,
       kcu.column_name,
       ccu.table_name AS foreign_table_name,
       ccu.column_name AS foreign_column_name,
       rc.delete_rule,
       rc.update_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
 AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
 AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
 AND rc.constraint_schema = tc.table_schema
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;

SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND (
    indexname IN ('idx_practice_sessions_user_id','idx_saved_presets_user_id','idx_training_videos_category_id')
    OR tablename IN ('practice_sessions','saved_presets','training_videos')
  )
ORDER BY tablename, indexname;
```

### Actual result
The foreign key set was valid and included:
- `practice_sessions.user_id` → `profiles.id` with `ON DELETE CASCADE`
- `saved_presets.user_id` → `profiles.id` with `ON DELETE CASCADE`
- `session_position_selections.session_id` → `practice_sessions.id` with `ON DELETE CASCADE`
- `session_sequence_steps.session_id` → `practice_sessions.id` with `ON DELETE CASCADE`
- `session_shot_selections.session_id` → `practice_sessions.id` with `ON DELETE CASCADE`
- `preset_position_selections.preset_id` → `saved_presets.id` with `ON DELETE CASCADE`
- `preset_shot_selections.preset_id` → `saved_presets.id` with `ON DELETE CASCADE`
- `training_videos.category_id` → `training_categories.id` with `ON DELETE RESTRICT`

The query for the three named indexes returned only primary-key indexes:
- `practice_sessions_pkey`
- `saved_presets_pkey`
- `training_videos_pkey`

No `idx_practice_sessions_user_id`, `idx_saved_presets_user_id`, or `idx_training_videos_category_id` indexes were present.

### Status
FAIL

### Explanation
Foreign keys are coherent and the delete behavior is consistent with the user-owned records model. However, the specific named indexes requested in the audit do not exist currently.

### Security concerns
This is a performance and query-plan concern rather than a direct security issue, but ensuring user lookup indexes exist can reduce the risk of expensive scans on user-owned tables.

### Recommended next action
If desired, review the query patterns in the app and add only the justified missing indexes in a controlled migration after securing the privilege model.

## 7) Test 6: Verify signup trigger

### SQL used
```sql
SELECT n.nspname AS schema_name,
       p.proname AS function_name,
       p.prosecdef AS security_definer,
       p.proowner::regrole AS owner,
       p.proconfig AS config,
       pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = 'handle_new_user';

SELECT tgname AS trigger_name,
       tgrelid::regclass AS table_name,
       tgenabled AS enabled,
       pg_get_triggerdef(oid) AS trigger_definition
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

### Actual result
```text
public.handle_new_user
security_definer = true
owner = postgres
config = ["search_path=\"\""]
function_definition =
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

Trigger result:
```text
on_auth_user_created
table_name = auth.users
enabled = O
trigger_definition =
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()
```

### Status
PASS

### Explanation
The trigger is correctly attached to `auth.users` and fires `AFTER INSERT` with `handle_new_user()`. The function is trusted as `SECURITY DEFINER`, and it inserts into `public.profiles` using `NEW.id` and `NEW.raw_user_meta_data ->> 'full_name'`.

### Security concerns
The function is `SECURITY DEFINER`, so it should be reviewed carefully, but the current definition is consistent with the intended signup behavior and the live metadata shows no evidence of tampering.

### Recommended next action
Keep this trigger unchanged unless you deliberately redesign the signup flow, and verify any future app changes against the same function definition.

## 8) Test 7: Authentication and RLS behavioral testing

### Limitation
No authenticated session was created and no actual user was used for runtime verification. This is intentional: the database contains zero auth users and zero profiles, and the testing policy prohibits creating or altering live records.

### Manual test procedures to run in a safe test environment

1. User A cannot read User B's profile.
   ```sql
   -- Execute as User A JWT
   SELECT *
   FROM public.profiles
   WHERE id <> auth.uid();
   ```
   Expected: zero rows returned because the policy should restrict access to `auth.uid() = id`.

2. User A cannot update User B's profile.
   ```sql
   -- Execute as User A JWT
   UPDATE public.profiles
   SET full_name = 'malicious'
   WHERE id <> auth.uid();
   ```
   Expected: zero rows updated; if the policy is correct, the statement should fail or affect zero rows.

3. Authenticated users can read lookup tables.
   ```sql
   SELECT * FROM public.court_positions LIMIT 10;
   SELECT * FROM public.shot_types LIMIT 10;
   SELECT * FROM public.position_pair_shot_rules LIMIT 10;
   ```
   Expected: rows visible to authenticated users only.

4. Anonymous users cannot access restricted tables.
   ```sql
   SELECT * FROM public.profiles;
   SELECT * FROM public.court_positions;
   ```
   Expected: anonymous access should be blocked by policy or by explicit privilege removal.

5. Authenticated users can update only permitted profile columns.
   ```sql
   -- Execute as a signed-in user
   UPDATE public.profiles
   SET full_name = 'Updated Name', avatar_url = 'https://example.com/a.png'
   WHERE id = auth.uid();
   ```
   Expected: allowed.

   ```sql
   UPDATE public.profiles
   SET id = gen_random_uuid()
   WHERE id = auth.uid();
   ```
   Expected: blocked by policy or not permitted by privilege model.

6. New user signup correctly creates a profile.
   - Create a user in Supabase Auth.
   - Confirm `auth.users` has a new row.
   - Confirm `public.profiles` has a corresponding row with matching `id` and `full_name` from `raw_user_meta_data`.
   - Expected: one new row in `profiles` for each new auth user.

### Status
NOT TESTED

### Explanation
These checks require authenticated sessions, valid user IDs, and a controlled testing dataset. They cannot be performed safely against the current database without creating test users or modifying live data.

### Security concerns
This is the most important runtime validation step once a safe test environment is available. It ensures the auth + RLS + trigger model behaves as expected.

### Recommended next action
Use a dedicated staging or local Supabase project with at least one seeded test user and verified auth session flow before running the behavioral checks.

## 9) Final assessment

### 1. Tests passed
- Test 1: auth user/profile count comparison
- Test 2: all 13 public tables have RLS enabled
- Test 6: `handle_new_user()` and trigger metadata are consistent with the signup flow

### 2. Tests failed
- Test 3: target tables lack explicit policies
- Test 4: broad table-level and column-level privileges remain on `anon` and `authenticated`
- Test 5: the requested named indexes do not exist

### 3. Tests not yet performed
- Test 7: authenticated access and behavior validation
- Any live permission or access test requiring real user sessions

### 4. Issues requiring investigation
- Missing RLS policies for `profiles`, `court_positions`, `shot_types`, `position_pair_shot_rules`
- Over-broad privileges for `anon` and `authenticated`
- Missing user lookup indexes for `practice_sessions(user_id)`, `saved_presets(user_id)`, and `training_videos(category_id)`
- Current database has zero auth users and zero profiles, so the full signup/runtime path is not yet exercised

### 5. Is the database ready for migration?
No.

### Explanation
The live database is not yet in a hardened state. The privilege model is over-broad, target tables have no explicit policies, and the required security review is incomplete. The database is therefore not ready for migration as-is. The migration should be reviewed and approved only after the security issues are addressed and tested in an isolated environment.

## 10) Final safety note

No migration has been executed. No test users were created. No records were modified. This report reflects a strict read-only audit and is intended only for review, remediation planning, and manual approval before any future live change.
