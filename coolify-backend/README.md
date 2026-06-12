# Learning AI Backend

This folder is the Coolify-deployed backend for Learning AI V2. It serves:

- V1 minute tracking compatibility while V1 remains public.
- V2 learner accounts, sessions, progress, assessment state, toolkit cards, minutes, visits, quiz answers, and activity completion.
- Admin login, learner review, lesson analytics, CSV export, and the first content editor.
- Postgres-backed curriculum data seeded from `curriculum-seed.json` on first boot.

## Coolify App Settings

Use these production settings:

- Repository: `Draven1287/PartnerAi`
- Branch: `main`
- Base directory: `/coolify-backend`
- Compose file: `/docker-compose.yml`
- Domain: `https://api.learningai4you.com`
- Public app/service port: `8787`

The compose file defines two services:

- `learning-ai-postgres`: Postgres 16 with persistent volume `learning-ai-postgres-data`.
- `learning-ai-minutes`: Node backend, exposed internally on port `8787`.

Coolify or its proxy must route `https://api.learningai4you.com` to the backend service on port `8787`.

## Required Runtime Env

Set these in Coolify production runtime env. Do not commit real values.

```text
POSTGRES_DB=learningai
POSTGRES_USER=learningai
POSTGRES_PASSWORD=replace-with-a-long-random-database-password
POSTGRES_HOST=learning-ai-postgres
POSTGRES_PORT=5432
DATABASE_URL=

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-long-random-admin-password
ADMIN_PASSWORD_HASH=
ADMIN_BOOTSTRAP_UPDATE=false

SESSION_SECRET=replace-with-a-long-random-session-secret
CORS_ORIGINS=https://learningai4you.com,https://www.learningai4you.com,https://api.learningai4you.com
BUILD_SHA=local
BUILD_TIME=unknown

INCLUDE_LEGACY_MINUTES_JSON=false
IMPORT_LEGACY_JSON_STORE=true
LEGACY_STORE_FILE=/app/data/learning-ai-store.json

CURRICULUM_SEED_FILE=
```

Notes:

- Prefer `ADMIN_PASSWORD_HASH` after first setup. `ADMIN_PASSWORD` is acceptable for initial bootstrap only.
- Keep `SESSION_SECRET` long and random.
- Do not use the old `ADMIN_TOKEN` flow. Admin auth is email/password with HTTP-only session cookies.
- Keep production and staging secrets separate.

## Redeploy Checklist

1. Confirm GitHub `main` has the expected commit.
2. In Coolify, redeploy `partnerai-api-prod` from `main`.
3. Confirm both compose services are running and healthy.
4. Confirm the backend service logs show migrations completed.
5. Confirm Coolify routes the domain to service port `8787`.
6. Run the live verifier from the repo:

```bash
node tools/verify-live-backend.mjs
```

Expected passing checks:

```text
PASS dns
PASS tcp:443
PASS health
PASS admin login page
PASS learner auth guard
PASS admin api guard
Live backend verification passed.
```

## If `api.learningai4you.com` Times Out

If DNS passes but `tcp:443` times out, the browser cannot reach the backend at all. Check these before debugging V2 JavaScript:

- The Coolify server is powered on and reachable from the internet.
- Server firewall allows inbound ports `80` and `443`.
- Cloudflare DNS for `api.learningai4you.com` points to the correct Coolify server IP.
- Cloudflare proxy/SSL mode is compatible with the Coolify certificate/proxy setup.
- Coolify proxy is running and has generated a route for `api.learningai4you.com`.
- The Coolify app domain is attached to `partnerai-api-prod`, not an old placeholder app.
- The backend service maps through Coolify to internal port `8787`.

Useful checks:

```bash
dig +short api.learningai4you.com
curl -I --max-time 12 https://api.learningai4you.com/health
node tools/verify-live-backend.mjs
```

## Local Checks

From the repo root:

```bash
node tools/check-backend-ready.mjs
node coolify-backend/test-server.mjs
node tools/check-v2-launch-ready.mjs
```

The route test always runs with its fake database. Real Postgres route testing is opt-in because it writes test learners, progress, quiz answers, activity completions, admin audit rows, and a draft lesson.

Use a dedicated test database whose name includes `test`:

```bash
cd coolify-backend
LEARNING_AI_TEST_DATABASE_URL='postgres://learningai:password@127.0.0.1:5432/learningai_test' npm run test:postgres
```

Do not point route tests at the production database. `DATABASE_URL` is intentionally ignored by `test-server.mjs` for Postgres tests; use `LEARNING_AI_TEST_DATABASE_URL` only.

`check-v2-launch-ready.mjs` is stricter than backend readiness. It should fail until V2 has no stub lessons and every authored lesson meets the interaction gates. Use it as the pre-launch blocker list, not as the day-to-day backend syntax check.

When `v2/lessons.js` changes, refresh the bootstrap curriculum seed before deployment:

```bash
node tools/sync-curriculum-seed.mjs
```

The seed is bootstrap-only. It creates missing curriculum rows on first boot but does not overwrite saved admin edits in Postgres.

## Local V2 Signup Testing

While the production Coolify API is unreachable, run the local in-memory V2 backend:

```bash
node tools/dev-v2-backend.mjs
```

Then open:

```text
http://127.0.0.1:8127/v2/index.html
```

On localhost, `backend-config.js` points V2 to `http://127.0.0.1:8787`. On the real website it still points to `https://api.learningai4you.com`.

This local backend is development-only. It uses the same HTTP server, auth routes, cookies, CSRF checks, and curriculum shape, but stores data in memory so it can test signup, questionnaire save, dashboard unlock, and lesson progress without Postgres or Coolify.
