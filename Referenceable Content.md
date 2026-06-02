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
- Current V2 lesson data has 30 lessons and 20 stubs (`node -e "global.window={}; require('./v2/lessons.js'); console.log(window.LESSONS.length, window.LESSONS.filter(l=>l.stub).length)"` prints `30 20`).

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
- `GET /api/v2/dashboard`
- `POST /api/v2/import-local`
- `PUT /api/v2/assessment`
- `POST /api/v2/progress`
- `POST /api/v2/interaction`
- `POST /api/v2/quiz-answer`
- `POST /api/v2/activity-complete`
- `POST /api/v2/feedback-request`
- `POST /api/v2/project-review`
- `POST /api/v2/tutor-sessions`
- `POST /api/v2/tutor-sessions/:id/messages`
- `GET /api/v2/insights`
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
- `GET /api/admin/ai-requests`
- `GET /api/admin/curriculum`
- `PUT /api/admin/curriculum/lessons/:id`
- `PUT /api/admin/curriculum/lessons/:id/steps`
- `POST /api/admin/curriculum/publish`
- `POST /api/admin/account-action`
- `POST /api/admin/export.csv`

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
- Added the first database-backed curriculum pass:
  - Migration version `2` adds `curriculum_modules`, curriculum fields on `lessons`, and authored step payload fields on `lesson_steps`.
  - Backend seeding now reads `coolify-backend/curriculum-seed.json`, generated from the current `v2/lessons.js` data, into Postgres. Local development can also override this with `CURRICULUM_SEED_FILE`.
  - The seed preserves stable `chapter-N` lesson IDs and step indexes.
  - Added authenticated `GET /api/v2/curriculum` for V2 to fetch modules, lessons, resources, and step payloads from the backend.
  - Added authenticated `GET /api/v2/lessons/:id` for focused lesson loading.
  - Added the first admin content APIs: `GET /api/admin/curriculum`, `PUT /api/admin/curriculum/lessons/:id`, `PUT /api/admin/curriculum/lessons/:id/steps`, and `POST /api/admin/curriculum/publish`.
  - Admin curriculum writes require admin session + CSRF and write `audit_events`.
  - Added `LearningAIV2Api.curriculum()` and `LearningAIV2Api.lesson(lessonId)` as frontend bridges.
  - Hidden V2 now attempts to load signed-in curriculum from the backend and falls back to static `v2/lessons.js` if the backend is unavailable.
  - Added local default CORS support for `127.0.0.1:8127` and `localhost:8127`.
- Added explicit learner backend endpoints for dashboard, quiz answers, and completed activities:
  - Migration version `3` adds `quiz_submissions` and `activity_completions`.
  - Added `GET /api/v2/dashboard`, `POST /api/v2/quiz-answer`, and `POST /api/v2/activity-complete`.
  - Quiz answers are also written into existing interaction analytics; completed activities mark lesson step progress complete.
  - Added `LearningAIV2Api.dashboard()`, `LearningAIV2Api.submitQuizAnswer()`, and `LearningAIV2Api.completeActivity()`.
- Added future-AI storage hooks without adding a chatbot or model calls:
  - Migration version `4` adds `ai_feedback_requests`, `project_reviews`, `tutor_sessions`, `tutor_messages`, and `progress_insights`.
  - Added learner endpoints for feedback requests, project review requests, tutor-session logs, tutor messages, and progress insights.
  - Added admin `GET /api/admin/ai-requests` for reviewing queued future-AI work.
  - Added frontend API bridge methods: `requestFeedback`, `requestProjectReview`, `createTutorSession`, `addTutorMessage`, and `insights`.
- Hardened admin access:
  - Removed the legacy shared `ADMIN_TOKEN` / `ALLOW_ADMIN_TOKEN` path from backend code, Docker Compose, and backend docs.
  - Admin access is now expected to use admin email/password login, HTTP-only admin session cookies, and CSRF tokens for mutations.
  - CSV export changed from a direct `GET` download to CSRF-protected `POST /api/admin/export.csv`.
  - Admin CSV downloads still create an `audit_events` row.
- Fixed curriculum seed ownership:
  - The packaged `coolify-backend/curriculum-seed.json` is now bootstrap-only.
  - Startup seeding creates missing modules, lessons, and lesson steps, but it does not overwrite existing Postgres curriculum rows.
  - Existing lesson steps are preserved on restart/redeploy so admin-edited lesson content remains durable.
  - Static readiness checks now guard against reintroducing seed-time deletion of lesson steps.
- Added first admin curriculum editor UI:
  - Admin has a `Content` view in `/admin`.
  - Admin can select a lesson, edit title, arc, status, minutes, core question, and blurb.
  - Admin can edit the lesson steps JSON and save it through the existing CSRF-protected curriculum steps API.
  - Admin can publish a selected lesson from the UI.
  - This is intentionally a simple MVP editor over PostgreSQL-backed content, not a full CMS.
- Added simple tracks and levels to the curriculum model:
  - Migration version `5` adds `curriculum_tracks` and `curriculum_levels`.
  - The MVP uses one default track: `core-ai-literacy`.
  - The MVP uses three levels: `foundation`, `explorer`, and `builder`.
  - Modules now belong to a track, and lessons can belong to a level.
  - `GET /api/v2/curriculum` and `GET /api/admin/curriculum` now include `tracks`, `levels`, module `trackId`, and lesson `levelId`.
  - Admin content editing can set the lesson level.
- Added a no-Postgres backend route test path:
  - `server.mjs` no longer imports `db.mjs` or `bcryptjs` at top level, so an injected fake database can test routes without installed production dependencies.
  - New learner signup hashes passwords with the built-in `scrypt` path; login still lazily supports old bcrypt hashes when `bcryptjs` is installed.
  - `coolify-backend/test-server.mjs` now always runs fake-DB route checks for health, signup, CSRF blocking, progress save, state load, curriculum load, admin login, learners, admin curriculum, and admin lesson edit.
  - If `DATABASE_URL` is set, the same test file can also run the real Postgres integration path.
  - In the Codex sandbox, this test needs permission to open a temporary local `127.0.0.1` server port.
- Added first admin learner account management UI:
  - Learners table now has a detail action.
  - Learner detail shows account identity, minutes, completed lessons, toolkit count, recent visits, recent interactions, and progress rows.
  - Admin can rename, disable/enable, reset password, and delete a learner account from the UI.
  - These actions use the existing CSRF-protected `POST /api/admin/account-action` endpoint and create audit events in the real database path.
- Implemented the password reset endpoint flow:
  - `POST /api/auth/password-reset/request` creates a one-hour one-time reset token when the submitted email belongs to an active account.
  - The request response remains generic by default to avoid account enumeration.
  - Local testing can set `ALLOW_DEV_RESET_TOKEN_RETURN=true` outside production to receive the token directly.
  - `POST /api/auth/password-reset/confirm` validates the token, stores a new scrypt password hash, marks the token used, and invalidates learner sessions.
  - No email provider is wired yet; production self-service reset still needs email delivery before public launch.
- Wired V2 lesson interactions to dedicated backend tables:
  - V2 still writes all learner actions to `POST /api/v2/interaction` for broad analytics.
  - Exit checks now also write to `POST /api/v2/quiz-answer`, including selected answer, correctness, and feedback.
  - Completed gated lesson activities now also write to `POST /api/v2/activity-complete`.
  - This gives the admin/backend separate quiz and activity data without changing the learner-facing lesson flow.
- Expanded fake-DB route test coverage:
  - The local route test now verifies `POST /api/v2/quiz-answer`, CSRF blocking for quiz writes, `POST /api/v2/activity-complete`, and `GET /api/v2/dashboard`.
  - Fake dashboard assertions prove quiz submission count and completed activity count are surfaced through the dashboard contract.
- Improved admin lesson analytics:
  - `GET /api/admin/lesson-analytics` now includes `difficultSteps` for each lesson.
  - Difficult steps are derived from saved interaction answers with incorrect responses.
  - Admin Lessons view shows the top difficult steps with step number, interaction kind, and incorrect rate.
  - Fake route tests now assert this analytics field is present after an incorrect quiz answer.
- 2026-06-01 13:55 PDT verification update:
  - Current local V2/backend work is still uncommitted in the PartnerAi repo.
  - `git diff --check` passed.
  - `node tools/check-backend-ready.mjs` passed static readiness checks.
  - `node coolify-backend/test-server.mjs` passed the fake-DB backend route checks when allowed to bind a temporary local server port.
  - Real Postgres integration is still unverified because no `DATABASE_URL` is available locally.
  - Live frontend `https://learningai4you.com` responds with HTTP 200 from GitHub Pages.
  - Live API `https://api.learningai4you.com/health` times out after 12 seconds.
  - DNS for `api.learningai4you.com` resolves to `157.245.240.153`.
  - Direct TCP checks to `157.245.240.153` on ports `80` and `443` timed out, so the current V2 `request_timeout` symptom is a Coolify/server/proxy/network availability problem, not just a frontend form bug.
  - Next deploy step: commit/push the backend/V2 changes, then manually redeploy `partnerai-api-prod` in Coolify and verify `/health` returns the new build marker. If the API host still times out, fix Coolify server reachability, Cloudflare DNS/proxy mode, firewall, or the Coolify proxy before debugging V2 signup.
- 2026-06-01 push update:
  - Backend foundation commit pushed to GitHub: `ebcdd3e Build V2 backend foundation`.
  - Working tree was clean immediately after the push.
  - `https://api.learningai4you.com/health` still timed out after the GitHub push, so the next required step is still Coolify/manual redeploy or server/proxy/network repair.
- 2026-06-01 live verification tool:
  - Added `tools/verify-live-backend.mjs`.
  - Run it with `node tools/verify-live-backend.mjs`.
  - It checks DNS, TCP 443 reachability, `/health`, `/admin`, learner auth guard, and admin API guard.
  - It can check another backend URL with `LEARNING_AI_API_URL=https://example.com node tools/verify-live-backend.mjs`.
  - Current result: DNS passes for `api.learningai4you.com -> 157.245.240.153`, but TCP 443, `/health`, `/admin`, `/api/auth/me`, and `/api/admin/learners` all time out. That means the immediate production issue is still server/proxy/network reachability.
- 2026-06-01 Coolify runbook update:
  - Replaced `coolify-backend/README.md` with a backend deployment runbook.
  - It documents the Coolify app settings, required runtime env, redeploy checklist, expected verifier output, timeout troubleshooting, and local check commands.
  - The main production blocker remains external reachability for `api.learningai4you.com`; V2 signup/login cannot be tested live until that verifier passes.
- 2026-06-01 V2 onboarding flow plan and first implementation:
  - Required learner flow is now: hidden account screen -> six-category questionnaire -> saved assessment -> dashboard with shell navigation.
  - The shell navigation must stay hidden during account creation, sign in, backend account check, and questionnaire categories 1-6.
  - The shell navigation appears only after category 6 is completed and the assessment is saved. Post-onboarding links are Dashboard, Lessons, Settings, About, Projects, and Educators.
  - The V2 questionnaire now uses six V1-aligned categories: definition, capability, limits, learning control, impact, and systems beyond chatbots.
  - The questionnaire is a stepper, not one long form. It keeps a local draft while moving between categories and only writes the final assessment object at the end.
  - If a backend session exists, finishing the questionnaire must save through `PUT /api/v2/assessment`; if that save fails, the learner stays on the questionnaire instead of unlocking the dashboard.
  - Palette direction: keep the calm V1 paper/ink/white surface base; use blue for primary actions; reserve teal, violet, green, and amber for arcs, progress states, and feedback; avoid a one-color blue/purple gradient UI.
  - Local browser verification on the served deploy repo confirmed the onboarding nav is hidden on account check and on the auth screen, with no browser console errors. Full signup-to-questionnaire verification still depends on the live API becoming reachable.
- 2026-06-01 next-step decision and local backend:
  - Because `api.learningai4you.com` is still unreachable, the next unblocked task was to make V2 testable locally instead of waiting on Coolify.
  - Added a development-only in-memory backend runner: `node tools/dev-v2-backend.mjs`.
  - Added reusable fake DB support in `coolify-backend/fake-db.mjs`.
  - Localhost `backend-config.js` now points to `http://127.0.0.1:8787`; production still points to `https://api.learningai4you.com`.
  - Verified locally on `http://127.0.0.1:8127/v2/index.html`: create account -> Category 1-6 questionnaire -> assessment save -> dashboard unlock -> shell nav visible.
  - Verified post-questionnaire nav text: Dashboard, Lessons, Settings, About, Projects, Educators.
  - No browser console errors during the local onboarding test.
  - Next V2 product work should start from this local backend loop: backend-driven lesson content/interaction loading, then lesson UI interaction polish, then full arc authoring.
- 2026-06-01 V2 navigation and taste-feedback fixes:
  - V2 nav now stays inside V2 for Settings, About, Projects, and Teaching AI instead of sending learners to V1 pages.
  - `Educators` was renamed to `Teaching AI`.
  - V2 Settings, Projects, Teaching AI, and About are now internal app routes.
  - Dashboard and Lessons were separated more clearly: Dashboard is the next-action view; Lessons gets a course-catalog header and full 30-lesson map.
  - Questionnaire choices now show `1.` through `4.` and support keyboard shortcuts: press `1`-`4` to choose, Enter to continue.
  - Lesson copy changed from “high-school student” to “someone like me” so the course does not sound limited to high school.
  - V1 Settings contrast was improved so dark option chips have readable text.
  - Added a draft Projects card for the multi-agent ethics/simulation project using only user-provided facts; full case study still needs the separate project notes/thread.
  - Fixed local dev backend curriculum grouping so `/api/v2/curriculum` returns all six modules and all 30 lessons instead of only the Orientation arc.
- 2026-06-02 multi-agent project source update:
  - User pasted source context from the “Design multi-agent interaction” work.
  - Project attribution: “Made by Aarav, Felix, and AI.”
  - Project details now include Westmark managed negotiation, trolley problems, prisoner’s dilemma cases, treaty negotiation, war-negotiation scenarios, JSON run files, checkpoint saves, secretary interventions, pressure/deception notes, historian analysis, CSV summaries, and presentation dashboards.
  - The Projects page now treats this as a concrete V2 case-study draft. The Teaching AI page now frames it as a possible classroom/club activity.
- 2026-06-02 ethics experiment handoff attachment:
  - User attached `AI Ethics Dialogue Experiment — Handoff`, dated 2026-06-01.
  - Current experiment priority: Westmark treaty negotiation, Mara vs Darian, repeated batch runs, analyze plus chart outputs.
  - Core research question: whether strategic LLM negotiators can reach and sustain settlements with asymmetric private information, deception/manipulation pressure, secretary deadlock interventions, and no explicit scoring except treaty signed or not.
  - Core scenario: Treaty of Westmark, General Mara Vance from the North, General Darian Voss from the South, items Westmark, POWs, Reparations, Demilitarization, and Trade.
  - Important experiment constraints: exact character names, strict private thoughts/proposed terms/public response format, CJK removal, incremental save each turn, no hidden-judge leakage, stagnation breaker, optional unlimited turns with `MAX_NEGOTIATION_TURNS=0`, and batch runner restart support.
  - Primary scripts live in `/Users/Aaravshah/Documents/auto changing website for realtime`: `westmark_maya_derek.py`, `batch_westmark.py`, `westmark_managed_negotiation.py`, and `westmark_umpire.py`.
  - Analysis scripts: `analyze_ai_training2.py` and `make_presentation_charts.py`, with env overrides for source/output folders and checkpoint inclusion.
  - Data/output folders: `/Users/Aaravshah/Downloads/AI Training 2`, `runs/war`, `analysis_output_ai_training2/`, and `presentation_output/`.
  - Final presentation framing should describe experimental design, controls, reproducible scripts, observed patterns, payoff structures, hidden/private information, endless negotiation loops, agreement rate, turns, deception detection, and human oversight.
- 2026-06-02 V2 review and next-workshop update:
  - User wants the next major focus to be adding all 30 real lessons into V2, while also workshopping UI/color and keeping the backend status clear.
  - Review lane findings: stale local `modelwise-gauge` could unlock V2 without a complete six-category V2 questionnaire, and missing API could make V2 fall open. Fix direction: require all six V2 questionnaire keys and fail closed if `LearningAIV2Api` is unavailable.
  - Account flow decision: learners can create multiple accounts, each email should have its own backend learner record, and signed-in backend state should win over old browser-local assessment data.
  - Added clearer account copy that each email creates its own learner account, added Dashboard and Retake questionnaire controls in the signed-in account bar, and added a questionnaire bottom link back to the saved dashboard.
  - UI/color direction remains calm V1 base with blue primary action. Reduce heavy app-card shadows; use teal, violet, green, amber, and blue as arc/progress accents instead of a one-color theme.
  - Lesson review found 30 lesson records, 20 stubs, and 10 currently authored/playable lessons. Lessons 10-24 and 26-30 still need full authoring. Lesson 4 should be revisited because it has only one gated interaction.
  - Backend review status: local dev backend on `127.0.0.1:8787` supports signup/questionnaire/dashboard/progress testing; production V2 remains blocked until `https://api.learningai4you.com` is reachable and `/health` passes.
