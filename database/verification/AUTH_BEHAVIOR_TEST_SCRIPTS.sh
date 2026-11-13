#!/usr/bin/env bash
set -euo pipefail

# Safe staging-only wrapper for ShuttleCoach Auth/RLS verification.
# This script does NOT run in the current live project by default.
# It requires a dedicated non-production Supabase project and explicit approval.
# No credentials or JWTs are hardcoded here.

if [[ "${ALLOW_TESTING:-}" != "true" ]]; then
  echo "Behavioral auth testing is BLOCKED in this project until a safe staging/sandbox environment is approved."
  echo "Set ALLOW_TESTING=true only in an approved non-production project."
  exit 2
fi

: "${SUPABASE_URL:?Set SUPABASE_URL to your staging project URL.}"
: "${ANON_KEY:?Set ANON_KEY to the staging anon key.}"

AUTH_URL="${SUPABASE_URL%/}/auth/v1"

sign_in() {
  local email="$1"
  local password="$2"
  curl -sS -X POST "${AUTH_URL}/token?grant_type=password" \
    -H "apikey: ${ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${email}\",\"password\":\"${password}\"}"
}

fetch_json() {
  local url="$1"
  local jwt="$2"
  curl -sS -H "apikey: ${ANON_KEY}" \
    -H "Authorization: Bearer ${jwt}" \
    "${url}"
}

# 1) Two-user profile isolation
# Requires USER_A_EMAIL / USER_A_PASSWORD / USER_B_EMAIL / USER_B_PASSWORD.
# Run after sign-in to obtain JWT_A and JWT_B.
profile_isolation() {
  local jwt_a="${JWT_A:?Set JWT_A to the signed-in JWT for user A.}"
  local jwt_b="${JWT_B:?Set JWT_B to the signed-in JWT for user B.}"
  echo "# User A profile query"
  fetch_json "${SUPABASE_URL}/rest/v1/profiles?select=*" "$jwt_a"
  echo
  echo "# User A attempts to fetch User B profile by id"
  fetch_json "${SUPABASE_URL}/rest/v1/profiles?id=eq.${USER_B_ID}?select=*" "$jwt_a"
  echo
  echo "# User B profile query"
  fetch_json "${SUPABASE_URL}/rest/v1/profiles?select=*" "$jwt_b"
}

# 2) Unauthorized profile updates
unauthorized_profile_update() {
  local jwt_a="${JWT_A:?Set JWT_A to the signed-in JWT for user A.}"
  local user_b_id="${USER_B_ID:?Set USER_B_ID to the target profile id for user B.}"
  curl -sS -X PATCH "${SUPABASE_URL}/rest/v1/profiles?id=eq.${user_b_id}" \
    -H "apikey: ${ANON_KEY}" \
    -H "Authorization: Bearer ${jwt_a}" \
    -H "Content-Type: application/json" \
    -d '{"full_name":"Hacked User"}'
}

# 3) Authenticated lookup reads
lookup_reads() {
  local jwt="${JWT_A:?Set JWT_A to a signed-in JWT.}"
  fetch_json "${SUPABASE_URL}/rest/v1/court_positions?select=*" "$jwt"
  fetch_json "${SUPABASE_URL}/rest/v1/shot_types?select=*" "$jwt"
  fetch_json "${SUPABASE_URL}/rest/v1/position_pair_shot_rules?select=*" "$jwt"
}

# 4) Anonymous profile access should be blocked or empty
anonymous_profile_access() {
  curl -sS "${SUPABASE_URL}/rest/v1/profiles?select=*" \
    -H "apikey: ${ANON_KEY}"
}

# 5) Allowed and forbidden profile column updates
allowed_and_forbidden_updates() {
  local jwt_a="${JWT_A:?Set JWT_A to the signed-in JWT for user A.}"
  local user_a_id="${USER_A_ID:?Set USER_A_ID to the target profile id for user A.}"
  curl -sS -X PATCH "${SUPABASE_URL}/rest/v1/profiles?id=eq.${user_a_id}" \
    -H "apikey: ${ANON_KEY}" \
    -H "Authorization: Bearer ${jwt_a}" \
    -H "Content-Type: application/json" \
    -d '{"full_name":"New Display Name","avatar_url":"https://example.com/avatar.png"}'

  curl -sS -X PATCH "${SUPABASE_URL}/rest/v1/profiles?id=eq.${user_a_id}" \
    -H "apikey: ${ANON_KEY}" \
    -H "Authorization: Bearer ${jwt_a}" \
    -H "Content-Type: application/json" \
    -d '{"id":"different-id"}'
}

# 6) Signup trigger verification
signup_trigger_verification() {
  local signup_email="${SIGNUP_EMAIL:?Set SIGNUP_EMAIL to a unique staging email.}"
  local signup_password="${SIGNUP_PASSWORD:?Set SIGNUP_PASSWORD to a valid staging password.}"
  local signup_display_name="${SIGNUP_DISPLAY_NAME:-Test User}"

  local signup_response
  signup_response=$(curl -sS -X POST "${AUTH_URL}/signup" \
    -H "apikey: ${ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${signup_email}\",\"password\":\"${signup_password}\",\"data\":{\"full_name\":\"${signup_display_name}\"}}")

  echo "${signup_response}"
  echo "After signup, fetch the user JWT and confirm a matching row exists in public.profiles."
}

# Run the stage-gated checks only in an approved sandbox.
# Comment out or skip any test you do not want in a given environment.
profile_isolation
unauthorized_profile_update
lookup_reads
anonymous_profile_access
allowed_and_forbidden_updates
signup_trigger_verification
