# Referenceable Content

This document is the durable source of truth for the Learning AI / PartnerAi backend-first V2 plan. Update it whenever the plan, backend, V2 UI, deployment process, or agent review feedback changes.

## Current Project Goal

Build Learning AI V2 as a hidden, account-based course upgrade while keeping V1 live and stable. V2 must use real accounts, server-saved progress, richer lesson interactions, and an admin dashboard backed by a real database.

## Current Repo And Deploy Facts

- Live repo: `Draven1287/PartnerAi`
- Local deploy repo: `/Users/Aaravshah/Documents/auto changing website for realtime/PartnerAi-deploy`
- Branch: `main`
- Live site: `https://learningai4you.com`
- API domain: `https://api.learningai4you.com`
- Coolify app: `partnerai-api-prod`
- V1 remains the public site until V2 launch.
- V2 remains hidden from public navigation and noindexed until launch.
- Coolify may still require manual redeploys until the GitHub webhook is fixed.
- Current V2 lesson data has 30 lessons and 21 stubs (`node -e "global.window={}; require('./v2/lessons.js'); console.log(window.LESSONS.length, window.LESSONS.filter(l=>l.stub).length)"` prints `30 21`).

## What We Are Building

### Backend First

The current JSON-store backend is temporary scaffolding. The real V2 backend must be PostgreSQL-backed, account-based, secure, testable, and deploy-verifiable before heavy V2 UI work continues.

### V2 Learner Experience

V2 should blend:

- calm V1 visual language
- dashboard clarity
- game-like progress through a Mona Lisa-style mosaic
- lesson interactions that are actually gated and useful

### Admin Dashboard

Admin must support real learner management and analytics, not just a time leaderboard.

## Backend Decisions

- Use Coolify PostgreSQL as the real persistence layer.
- Keep Node as the backend runtime.
- Use stable lesson IDs: `chapter-1` through `chapter-30`.
- Store account state on the server.
- Keep V1 minute tracking working while V1 remains public.
- Add a health endpoint with build and database/migration status.
- Admin should use real admin login and server sessions, not browser-stored admin tokens.
- Public frontend must never receive admin secrets, database URLs, reset secrets, or privileged tokens.

## Security And Privacy Decisions

- Use bcrypt password hashes.
- Use HTTP-only session cookies.
- Use CSRF tokens for cookie-authenticated writes.
- Use strict credentialed CORS with exact allowed origins.
- Use admin audit events for sensitive admin actions.
- Rate-limit auth, reset, learner write, and admin routes.
- Do not rely on hidden URLs as access control.
- Required signup copy: “We use your email only to sign you in and save your progress. We will not send ads. We will not ask you for money. We will not sell your information.”
- Privacy policy must cover email, progress, assessment answers, toolkit cards, minutes, timestamps, cookies, analytics, retention, deletion, and the no-selling promise.
- Decide the minors policy before public open signup.

## Database Model

Core tables:

- `users`
- `user_profiles`
- `sessions`
- `admin_users`
- `lessons`
- `lesson_steps`
- `learner_state`
- `assessment_attempts`
- `assessment_responses`
- `assessment_results`
- `lesson_progress`
- `lesson_step_progress`
- `interaction_answers`
- `toolkit_cards`
- `learning_minutes`
- `page_visits`
- `audit_events`
- `password_reset_tokens`
- `schema_migrations`

Use `jsonb` only for flexible interaction/toolkit payloads. Keep query-critical fields normalized.

## Backend APIs

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/password-reset/request`
- `POST /api/auth/password-reset/confirm`

Learner:

- `GET /api/v2/state`
- `POST /api/v2/import-local`
- `PUT /api/v2/assessment`
- `POST /api/v2/progress`
- `POST /api/v2/interaction`
- `POST /api/v2/toolkit`
- `POST /api/v2/minutes`
- `POST /api/v2/visit`

Admin:

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `GET /api/admin/learners`
- `GET /api/admin/learner/:id`
- `GET /api/admin/lesson-analytics`
- `POST /api/admin/account-action`
- `GET /api/admin/export.csv`

## V2 UI Decisions

Dashboard hierarchy:

1. Continue next lesson
2. Current learning mode/result
3. Current arc
4. Completion percent and Mona Lisa mosaic
5. Toolkit
6. Diagnostic details

Rules:

- Mosaic supports progress, but never replaces the main next-action button.
- Each tile maps to one completed lesson.
- Tile states: locked, current, completed, just-unlocked.
- Lesson completion triggers tile fill within 500ms.
- Diagnostic result copy should feel like a current learning mode, not a permanent label.
- At 100%, the main CTA becomes project/toolkit review.

## Lesson Interaction Rules

- Lessons 10-30 must stop being completable stubs before V2 launch.
- Every lesson needs at least 5 meaningful steps: hook, gated try-first, reveal, gated improve/catch-mistake, toolkit/reflection, exit check.
- Every lesson needs at least 2 gated learner-action interactions before the exit check.
- `exitCheck` does not count toward the 2 required interactions.
- Every lesson should produce or update one useful toolkit artifact unless explicitly exempted.
- Every lesson needs one plausible trap: fake confidence, vague prompt, privacy leak, missing source, shallow follow-up, weak workflow, or unsafe automation.
- Wrong answers must teach a specific misconception.
- New step kinds count only if genuinely gated: `sequenceBuilder`, `sliderRanking`, `shortReflection`, `scenarioChoice`.

## Admin Decisions

Admin must show:

- learners
- email
- display name
- total minutes
- visit count and timestamps
- current lesson
- completion percent
- last active
- lesson dropoff
- difficult steps
- toolkit card count
- account disable/delete
- admin-assisted password reset
- CSV export

Every admin mutation must create an `audit_events` row.

## Agent Review Feedback

Six review lanes were used: backend architecture, security/privacy, database model, learner UI, lesson design, and admin/deployment.

Key blockers found:

- JSON-file storage is not the real backend.
- Admin token in browser storage or URL is a launch blocker.
- Cookie auth needs CSRF protection.
- Hidden V2 is not enough access control.
- Privacy promises must match actual implementation and policy.
- Current localStorage progress cannot power admin analytics.
- Deployment freshness must be proven with `/health` build markers.
- Lessons 10-30 are currently stubs and cannot be launch-completable.
- Current step kinds need clearer gating rules before content expansion.

## Test And Deploy Checklist

Before real users:

- Fresh Coolify deploy provisions app plus Postgres.
- Migrations run successfully.
- `/health` returns build marker, database status, and migration version.
- Signup, login, logout, expired session, disabled account, and password reset work.
- V2 writes require auth plus CSRF protection.
- Learners cannot access other learners’ data.
- Assessment, progress, interactions, toolkit, minutes, visits, and last active persist across browsers.
- LocalStorage import is idempotent.
- Admin sees learner table, learner detail, lesson analytics, account actions, and CSV export.
- CSV export escapes safely and creates an audit event.
- V1 pages and V1 assessment still work.
- V2 remains hidden and noindexed.
- Backups and restore are tested before real learner data.

## Dated Update Log

### 2026-06-01

- Adopted the agent-reviewed backend-first plan.
- Locked PostgreSQL as the real backend target.
- Locked V1 stability and hidden V2 as non-negotiable constraints.
- Added this durable reference document requirement.
- Implemented first backend-foundation pass: Postgres schema/migrations, one-time legacy JSON scaffold import, admin login, learner auth sessions, CSRF-protected V2 writes, V1 minutes fallback, admin audit events, deploy docs, and V2 API CSRF bridge.
- Local syntax checks pass for `coolify-backend/server.mjs`, `coolify-backend/db.mjs`, and `coolify-backend/test-server.mjs`. Full integration tests require npm dependencies and a Postgres `DATABASE_URL`.
