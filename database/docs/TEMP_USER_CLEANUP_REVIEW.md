# TEMP_USER_CLEANUP_REVIEW

Generated: 2026-11-07
Status: Read-only review only. No database changes, no user creation, no record creation, no migration execution.

## 1) Scope and constraints

This review is strictly limited to live metadata inspection for the ShuttleCoach Supabase project. It does not create any temporary users, does not modify any rows, and does not change permissions or trigger behavior.

The review specifically answers:
- all foreign keys referencing `public.profiles(id)`
- any foreign keys referencing `auth.users(id)`
- ON DELETE behavior
- risk of cascade from deleting a temporary auth user
- whether `handle_new_user()` creates a profile automatically
- whether email confirmation is enabled
- whether the current auth configuration permits more than one temporary test account

## 2) Verified read-only findings

### 2.1 Current user/profile state

Live metadata confirms:
- `auth.users` row count: 0
- `public.profiles` row count: 0

This means there are no real app users or app profiles in the current project at this moment.

### 2.2 `handle_new_user()` and profile creation

The trigger and function are present and active in the live database:
- Trigger: `on_auth_user_created` on `auth.users`
- Function: `public.handle_new_user()`
- Function body:

```sql
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name'
    );

    RETURN NEW;
END;
```

Important findings:
- it is a `SECURITY DEFINER` function
- it is attached to `AFTER INSERT ON auth.users`
- it inserts a row into `public.profiles` using the same UUID as the new `auth.users.id`

Conclusion: yes, the live schema does create a matching profile automatically after an auth user is created, assuming the trigger fires normally and the insert succeeds.

### 2.3 Foreign keys referencing `public.profiles(id)`

Only the following foreign keys reference `public.profiles(id)`:

| Child table | Child column | Parent table | Parent column | ON DELETE | ON UPDATE |
|---|---|---|---|---|---|
| `public.practice_sessions` | `user_id` | `public.profiles` | `id` | `CASCADE` | `NO ACTION` |
| `public.saved_presets` | `user_id` | `public.profiles` | `id` | `CASCADE` | `NO ACTION` |

This means deleting a profile row will cascade into any practice session or saved preset rows owned by that user.

### 2.4 Foreign keys referencing `auth.users(id)`

No foreign keys from `public` tables to `auth.users(id)` were returned by the live metadata query.

The direct auth-related relationship is not a foreign key in the app schema; it is an application trigger:
- `auth.users` fires `on_auth_user_created`
- that trigger calls `public.handle_new_user()`
- the function inserts into `public.profiles` using `NEW.id`

The auth schema itself has internal FKs such as `auth.sessions`, `auth.identities`, `auth.mfa_*`, and other auth tables, but no app table in the `public` schema is directly wired to `auth.users(id)` via a foreign key reference visible in `information_schema`.

### 2.5 Cascade chain from a profile/user deletion

If a test user is deleted from `auth.users`, the app does not directly cascade through a `public` foreign key from `auth.users` into application tables. The app-level cascade path is:

`auth.users.id` -> inserted by trigger into `public.profiles.id` -> then `public.profiles.id` cascades to:
- `public.practice_sessions.user_id` via `CASCADE`
- `public.saved_presets.user_id` via `CASCADE`

From there, additional cascades occur:
- `public.practice_sessions.id` -> `public.session_position_selections.session_id` via `CASCADE`
- `public.practice_sessions.id` -> `public.session_shot_selections.session_id` via `CASCADE`
- `public.practice_sessions.id` -> `public.session_sequence_steps.session_id` via `CASCADE`
- `public.saved_presets.id` -> `public.preset_position_selections.preset_id` via `CASCADE`
- `public.saved_presets.id` -> `public.preset_shot_selections.preset_id` via `CASCADE`

Relevant child-table foreign keys:

| Child table | FK to parent | ON DELETE | Effect |
|---|---|---|---|
| `public.session_position_selections` | `practice_sessions.id` | `CASCADE` | deletes session selections when a session is removed |
| `public.session_shot_selections` | `practice_sessions.id` | `CASCADE` | deletes shot selections when a session is removed |
| `public.session_sequence_steps` | `practice_sessions.id` | `CASCADE` | deletes sequence steps when a session is removed |
| `public.preset_position_selections` | `saved_presets.id` | `CASCADE` | deletes preset position selections when a preset is removed |
| `public.preset_shot_selections` | `saved_presets.id` | `CASCADE` | deletes preset shot selections when a preset is removed |

The following are not user-owned and are not connected to a profile deletion path:
- `public.training_categories`
- `public.training_videos`
- `public.court_positions`
- `public.shot_types`
- `public.position_pair_shot_rules`

These tables have no FK path from `profiles.id` and therefore are not directly affected by deleting a user profile.

## 3) Exact tables potentially affected by deleting a test user

The application tables that can be affected by deleting a temporary user are:

1. `public.profiles`
   - profile row owned by the user
   - created by `handle_new_user()`
   - if removed, it can trigger downstream cascades

2. `public.practice_sessions`
   - references `public.profiles.id` via `user_id`
   - `ON DELETE CASCADE`

3. `public.saved_presets`
   - references `public.profiles.id` via `user_id`
   - `ON DELETE CASCADE`

4. `public.session_position_selections`
   - references `public.practice_sessions.id`
   - `ON DELETE CASCADE`

5. `public.session_shot_selections`
   - references `public.practice_sessions.id`
   - `ON DELETE CASCADE`

6. `public.session_sequence_steps`
   - references `public.practice_sessions.id`
   - `ON DELETE CASCADE`

7. `public.preset_position_selections`
   - references `public.saved_presets.id`
   - `ON DELETE CASCADE`

8. `public.preset_shot_selections`
   - references `public.saved_presets.id`
   - `ON DELETE CASCADE`

This is the exact user-data cascade chain the current schema supports.

## 4) Exact cascade/restrict behavior

### 4.1 User/profile deletion path

For the live app design:
- `profiles.id` is the identity anchor for a user
- `practice_sessions.user_id` and `saved_presets.user_id` both cascade on profile deletion
- all session/preset child-selection tables cascade on session/preset removal

### 4.2 No direct `auth.users` delete cascade to app tables via FK

There is no `public` foreign key pointing at `auth.users(id)`, so deleting an auth user will not directly trigger an application-level cascade through a foreign key in the app schema.

However, because the trigger creates a matching profile row, deleting the auth user may still leave an orphaned or unmanaged profile lifecycle depending on whether the profile row is also removed or whether the application handles it separately. The schema as observed does not show any explicit `ON DELETE CASCADE` from `auth.users` to `public.profiles` because the join is implemented by trigger logic, not a SQL FK.

### 4.3 Non-user relations are not part of the cascade chain

`training_videos.category_id` is a foreign key to `training_categories.id` with `ON DELETE RESTRICT`, which is unrelated to user deletion.

No other public application tables were found to have an FK chain from a user profile.

## 5) Safe creation procedure for temporary auth testing

This section is for a staging/sandbox project only. It is not to be performed in the current live project without explicit approval.

### Recommended procedure in a dedicated sandbox

1. Use a non-production Supabase project that matches the current schema.
2. Confirm the project supports email/password or another supported auth provider.
3. Create two temporary test users with unique emails.
4. Sign in as each user to obtain real JWTs.
5. Verify the `public.profiles` row for each user was created automatically.
6. Run the app or REST calls using the JWTs only.
7. Remove all temporary test data after the tests finish.

Validation to confirm profile creation:
- check `auth.users` has both rows
- check `public.profiles` has matching `id` values
- confirm `full_name` values match the signup metadata if supplied

## 6) Safe cleanup procedure

This must be done only in a sandbox or approved test environment after explicit approval.

Recommended sequence:

1. Delete the auth users in the sandbox project.
2. Confirm the matching `public.profiles` rows are removed or cleaned up.
3. Confirm `practice_sessions` rows for each user are removed as a result of the cascade.
4. Confirm `saved_presets` rows for each user are removed as a result of the cascade.
5. Confirm child-selection rows are removed via the subsequent cascade chain.
6. Verify no remaining user-owned data exists in the four tables above.
7. Confirm there are no leftover rows in `public.profiles`.

If the auth user deletion is done via admin APIs, the cascade path should operate according to the schema, but cleanup should still be verified explicitly after deletion.

## 7) Risks that cannot be eliminated

Even in a staging environment, these risks remain:

1. Trigger timing risk
   - profile creation depends on the `on_auth_user_created` trigger firing correctly
   - if the trigger fails or the profile insert is blocked, the app may leave a user without a profile record

2. Partial cleanup risk
   - if a user is removed outside of a carefully planned cleanup flow, some session/preset selection rows may remain if the cascade chain is interrupted or a row was created outside the expected schema

3. Incorrect assumptions about `auth.users` deletion
   - the project does not expose a direct app-level `auth.users`-to-`public.profiles` FK, so deletion semantics depend on the trigger plus app logic rather than a pure database FK relationship

4. Unconfirmed auth configuration
   - the current database does not expose the project Auth signup/email-confirmation settings directly in the accessible metadata
   - therefore, we cannot state with certainty whether sign-ups are enabled or whether email confirmation is required

5. Production safety risk
   - deleting or creating users in the live project would affect real user data and could trigger real cascades in app data if any live users existed

## 8) Email confirmation status

This cannot be stated definitively from the live read-only database metadata alone.

What is visible:
- the `auth.users` table includes `email_confirmed_at`
- the project has 0 users right now
- no project configuration view or auth config table is exposed here

What is not available from the read-only SQL schema alone:
- actual Supabase Auth email confirmation setting
- project-level signup policy
- sign-up enablement status
- confirmation requirement configuration

Conclusion: the current project metadata does not let us determine with certainty whether email confirmation is enabled, disabled, or required. That requires checking the Supabase project Auth settings in the dashboard or via the Auth admin/config API.

## 9) Whether the current Auth configuration permits two temporary test accounts

From database metadata alone, there is no evidence of a hard-coded user limit and the schema is standard for a Supabase project with multiple users.

However:
- the live project currently has zero users
- we cannot confirm from the DB whether sign-up is enabled
- we cannot confirm from the DB whether email confirmation is required
- we cannot confirm whether the project has rate limits or restrictions in place

Conclusion: the read-only database state does not show any hard restriction forbidding two temporary test accounts, but it also does not prove that the live auth configuration currently allows sign-up or account creation. To make that determination, the Auth dashboard or project settings must be checked directly.

## 10) Recommendation

### Recommendation for this existing project

Temporary testing in the current live project is not recommended as a safe default.

Why:
- there are zero users and zero profiles right now, which means the current project is not a valid live test environment for auth behavior
- app-owned user data is connected to profile lifecycle via trigger plus cascade chain
- deleting an auth user can affect real user-owned data if the project contains actual users
- the current Auth configuration cannot be confirmed from read-only metadata alone
- the live project should not be used for temporary account creation unless the environment is explicitly designated as a safe staging/sandbox instance

### Recommendation if you need real auth testing

Use a dedicated non-production Supabase project that mirrors the schema and then perform the temporary-auth testing there with approval, explicit cleanup, and confirmation that the test accounts are deleted afterwards.

> Best practice: treat the live project as production-only and use a separate sandbox for any temporary auth validation.

## 11) Final status

- `public.profiles` is the critical user row created by `handle_new_user()`
- `public.practice_sessions` and `public.saved_presets` are direct cascades from profile deletion
- session/preset child tables cascade further from each session/preset record
- no direct `public` foreign key to `auth.users(id)` was found
- email confirmation status is not directly confirmable from DB metadata alone
- two temporary test accounts are not blocked by any visible schema limit, but the project config still needs to be checked before testing
- temporary auth testing in the existing live project is not recommended unless the project is explicitly approved as a safe staging environment
