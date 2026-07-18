# Production launch verification — 2026-07-17

> Historical V2 production snapshot. The selected V3 canonical origin is
> `https://learningai4you.com` without `www`. The `www` hostname below records
> what was live when this snapshot was taken; after the bare-domain certificate
> is valid, it must only issue a permanent path-preserving redirect to the bare
> domain.

## Live surface

- Product: <https://www.learningai4you.com/v2/>
- Frontend health: <https://www.learningai4you.com/health>
- Same-origin API health: <https://www.learningai4you.com/api/health>
- Railway project: `Learn AI`, production environment
- Services: `learning-ai-web`, `learning-ai-api`, `Postgres`

The browser uses `/api/*` on the web origin. Railway proxies those requests over
its private network to `learning-ai-api.railway.internal:8080`; learner cookies
remain first-party and the public `api.learningai4you.com` hostname is not a
runtime dependency.

## Verified production behavior

- Frontend and API Railway health checks pass.
- PostgreSQL reports schema migration version 6.
- Curriculum returns 50 lessons across 10 arcs.
- Production signup creates an isolated learner and first-party session.
- A progress write without CSRF returns 403; the same write with CSRF returns 200.
- Access reports `learn-first-permanent-core` in preview mode with enforcement off.
- No purchase or subscription control is active.
- Desktop at 1280x720: 50 tiles, no horizontal overflow, no console warnings/errors.
- Mobile at 390x844: 50 tiles in the 10-column artwork, no horizontal overflow.
- Dashboard, lesson, Saved Notes, Access, and account controls render on the live domain.
- Public indexing was enabled on the then-live `www` V2 domain. This is not the
  canonical policy for V3.

## Automated checks

- `tools/build-lessons.mjs`: 50 lessons, 10 arcs.
- `tools/audit-lesson-quality.mjs`: 0 failures, 0 warnings.
- `tools/check-v2-launch-ready.mjs`: 0 failures; the remaining toolkit warnings
  identify lessons where an optional note is intentionally absent, not a gate.
- `coolify-backend/test-server.mjs`: fake-database route suite passes.
- PostgreSQL integration tests remain intentionally isolated from production and
  require `LEARNING_AI_TEST_DATABASE_URL` for a dedicated disposable database.

## Operations notes

- The generated production admin credential is stored in macOS Keychain under
  the service name `Learning AI Railway Admin`; it is not stored in Git.
- `ENFORCE_COURSE_ACCESS=false` remains set until signed checkout, webhook,
  duplicate-event, refund, and entitlement-restoration tests exist.
- The apex `learningai4you.com` and optional `api.learningai4you.com` hostname
  still await their Namecheap Railway-verification TXT records and certificates.
  Until that DNS work is done, the old V2 deployment remains reachable at
  `www`; do not promote it as the new canonical address. Browser API traffic
  currently uses that same verified host only as a temporary production fact.
