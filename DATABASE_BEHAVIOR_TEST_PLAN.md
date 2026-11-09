# ShuttleCoach Database Behavioral Test Plan

Generated: 2026-11-07
Status: Safe manual testing plan only; no live database changes or user creation performed.

## 1) Scope and safety rules

This document defines the safe behavioral testing plan for the ShuttleCoach Supabase database.

The following rules are mandatory:
- Do not execute any migration.
- Do not run any `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `GRANT`, or `REVOKE` on the live database.
- Do not create test users or test records without explicit approval.
- Do not use the SQL Editor `postgres` role as proof of RLS behavior. The `postgres` role bypasses row rules and does not represent the real authenticated user experience.
- Use only actual Supabase Auth JWTs from real authenticated sessions when testing security behavior.
- Keep all existing production data unchanged.

## 2) Current state and testing limitation

The live database currently contains:
- `auth.users = 0`
- `public.profiles = 0`

This means the real behavioral checks below cannot be executed against the current production database until a controlled staging environment or approved test setup is prepared.

The tests in this plan are therefore split into two categories:
- Executable in a safe staging/test project with real auth sessions
- Not currently executable in this database as it exists today

## 3) Required test environment for real behavioral validation

Use a dedicated staging or sandbox Supabase project, not production.

### Required setup
1. Create or use a non-production Supabase project.
2. Ensure the same schema and policies are in that environment.
3. Enable email/password auth or another supported auth provider.
4. Verify that the app can sign in and obtain a JWT.
5. Use a real auth JWT from a signed-in user for access tests.

### How to get a real JWT

#### Option A: From the app frontend
Use the Supabase JS client:
```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usera@example.com',
  password: 'your-password'
});

const jwt = data.session?.access_token;
console.log(jwt);
```

#### Option B: From the Supabase Auth endpoint
Use the password grant flow:
```bash
curl -X POST "https://<project-ref>.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: <anon-or-service-role-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"usera@example.com",
    "password":"your-password"
  }'
```

Then read the returned `access_token`.

### How to call the REST API with the JWT
```bash
curl "https://<project-ref>.supabase.co/rest/v1/profiles?select=*" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt>"
```

Important:
- `postgres` role queries are not valid proof of RLS behavior.
- A JWT from an authenticated user is required.
- The same test should be repeated with two different users to confirm cross-user isolation.

## 4) Executable tests in a safe staging/test environment

These are valid only after approval and in a non-production project with real test users.

## 5) Tests that cannot currently be performed in this database

The following tests are not executable in the current live database because there are zero `auth.users` and zero `public.profiles` rows, and the rules prohibit creating them without explicit approval.

### 5.1 Test 1: User A cannot read User B's profile
Status: Not currently executable in this live database.

Reason:
- There are no real users to represent User A and User B.
- Creating temporary accounts would violate the current safety rules unless explicit approval is given.

Manual procedure after approval:
1. Create two temporary users in a staging project.
2. Sign in as User A and obtain JWT A.
3. Sign in as User B and obtain JWT B.
4. With JWT A, call:
```bash
curl "https://<project-ref>.supabase.co/rest/v1/profiles?select=*" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-a>"
```
5. Confirm that only User A's own profile row is visible.
6. Attempt to fetch User B's row by id explicitly:
```bash
curl "https://<project-ref>.supabase.co/rest/v1/profiles?id=eq.<user-b-id>&select=*" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-a>"
```
Expected result:
- User A should not see any row that does not belong to User A.
- If RLS is correctly configured, the response is empty or forbidden.

## 6) Safe behavioral test cases

### Test 2: User A cannot update User B's profile
Status: Not currently executable in this live database.

Manual procedure after approval:
1. Sign in as User A and User B.
2. Get JWT A and JWT B.
3. Using JWT A, attempt to update User B's profile:
```bash
curl -X PATCH "https://<project-ref>.supabase.co/rest/v1/profiles?id=eq.<user-b-id>" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-a>" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Hacked User"}'
```
Expected result:
- No row should be updated.
- RLS should reject the request.

### Test 3: Authenticated users can read `court_positions`, `shot_types`, and `position_pair_shot_rules`
Status: Not currently executable in this live database.

Manual procedure after approval:
1. Sign in as a temporary authenticated user.
2. Obtain JWT A.
3. Query the lookup tables:
```bash
curl "https://<project-ref>.supabase.co/rest/v1/court_positions?select=*" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-a>"

curl "https://<project-ref>.supabase.co/rest/v1/shot_types?select=*" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-a>"

curl "https://<project-ref>.supabase.co/rest/v1/position_pair_shot_rules?select=*" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-a>"
```
Expected result:
- Authenticated users can read all allowed lookup rows.

### Test 4: Anonymous users cannot access restricted profile data
Status: Not currently executable in this live database.

Manual procedure after approval:
1. Use a valid anonymous request without a JWT.
2. Attempt:
```bash
curl "https://<project-ref>.supabase.co/rest/v1/profiles?select=*" \
  -H "apikey: <anon-key>"
```
Expected result:
- Anonymous access should be blocked or return no rows, depending on the final policy model.

### Test 5: Authenticated users can update only `full_name` and `avatar_url`
Status: Not currently executable in this live database.

Manual procedure after approval:
1. Sign in as User A and obtain JWT A.
2. Attempt allowed update:
```bash
curl -X PATCH "https://<project-ref>.supabase.co/rest/v1/profiles?id=eq.<user-a-id>" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-a>" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"New Display Name","avatar_url":"https://example.com/avatar.png"}'
```
3. Attempt forbidden field update:
```bash
curl -X PATCH "https://<project-ref>.supabase.co/rest/v1/profiles?id=eq.<user-a-id>" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <jwt-a>" \
  -H "Content-Type: application/json" \
  -d '{"id":"different-id"}'
```
Expected result:
- Allowed columns update successfully.
- Forbid attempts to change `id` or other non-permitted columns.

### Test 6: Signup creates a corresponding profile through `handle_new_user()`
Status: Not currently executable in this live database.

Manual procedure after approval:
1. Use Supabase Auth sign-up API with a new email/password and a `full_name` metadata value:
```bash
curl -X POST "https://<project-ref>.supabase.co/auth/v1/signup" \
  -H "apikey: <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new-user@example.com",
    "password": "StrongPassword123!",
    "data": { "full_name": "New Test User" }
  }'
```
2. Confirm a new row appears in `auth.users`.
3. Confirm a corresponding row appears in `public.profiles` with matching `id` and `full_name`:
```bash
curl "https://<project-ref>.supabase.co/rest/v1/profiles?id=eq.<new-user-id>&select=*" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <new-user-jwt>"
```
Expected result:
- The `profiles.id` matches the auth user id.
- `profiles.full_name` matches the signup metadata value or null if not supplied.

## 7) Tests requiring temporary accounts and records

These tests require temporary test accounts and therefore cannot be executed in the current database state:
- Test 1: User A cannot read User B's profile
- Test 2: User A cannot update User B's profile
- Test 3: Authenticated users can read lookup tables
- Test 4: Anonymous users cannot access restricted profile data
- Test 5: Authenticated users can update only full_name and avatar_url
- Test 6: Signup creates a corresponding profile through `handle_new_user()`

## 8) Cleanup instructions for temporary accounts and records

Only perform this in a staging or sandbox environment after explicit approval.

### Recommended cleanup process
1. Delete temporary auth users using the Supabase Admin API or Auth admin endpoint with a service role key in the sandbox project.
2. If profile rows remain after user deletion, delete the matching rows from `public.profiles` using a trusted admin context in the test project.
3. Verify no leftover temporary users remain in `auth.users`.
4. Verify no leftover profile rows remain in `public.profiles`.
5. Confirm no user-specific session or preset data remains.

Example admin cleanup approach:
```bash
curl -X DELETE "https://<project-ref>.supabase.co/auth/v1/admin/users/<user-id>" \
  -H "apikey: <service-role-key>" \
  -H "Authorization: Bearer <service-role-jwt>"
```

Do not do this against the live production database unless explicitly approved and isolated.

## 9) Executable verification steps that are safe now

The following checks are safe because they do not create or modify data:
- Inspect `pg_proc` for `handle_new_user()`
- Inspect `pg_trigger` for `on_auth_user_created`
- Inspect `pg_policies` for table policy definitions
- Inspect `information_schema.role_table_grants` and `information_schema.column_privileges`
- Inspect `pg_class` and `pg_namespace` for RLS state
- Confirm the current database contains zero auth users and zero profiles

These are metadata checks only, not behavioral proof of RLS or auth access control.

## 10) Final status

The current database cannot support runtime auth-based behavior tests until:
- a staging environment is available,
- real temporary users are created with approval,
- a test JWT flow is verified,
- and cleanup steps are defined and approved.

This document intentionally distinguishes between:
- metadata checks that are safe and executable now, and
- behavior tests that require real auth sessions and temporary accounts and therefore cannot be executed in the current live database without approval.

No behavioral test is claimed as passed in this document because no live authenticated session-based verification has been executed.
