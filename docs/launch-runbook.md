# LearningAI launch runbook

This runbook covers the teen-first LearningAI release at
`https://learningai4you.com`. The approved redesign is served at `/`; V2 stays
available at `/v2/` as the first rollback route.

## Automated release gates

Run with the bundled Node runtime or Node 22+:

```bash
node tools/audit-teen-course.mjs
node tools/check-v2-launch-ready.mjs
node coolify-backend/test-server.mjs
node tools/check-railway-package.mjs
RELEASE_REQUIRE_COMMITTED=1 node tools/check-railway-package.mjs
```

All commands must exit zero. The Postgres integration line may only be skipped
locally. Before launch, rerun the backend test with
`LEARNING_AI_TEST_DATABASE_URL` pointed at a dedicated disposable Postgres
database and `ALLOW_POSTGRES_TEST_WRITES=true`.

## Railway services

The `Learn AI` project must contain:

1. `learning-ai-web` using `/railway.toml`.
2. `learning-ai-api` rooted at `/coolify-backend` using its `/railway.toml`.
3. Railway Postgres connected to the API through
   `DATABASE_URL=${{Postgres.DATABASE_URL}}`.

Use the exact variables in [railway-deployment.md](./railway-deployment.md).
Never place database, admin, session, or email-provider secrets in the web
service.

## Database and account proof

Using the generated Railway web domain, create two disposable learner
accounts. For each account:

1. Complete Lesson 1 before account creation.
2. Create the account and confirm Lesson 1 becomes `1/50`.
3. Complete all six starting questions.
4. Confirm the dashboard unlocks.
5. Save a note, one lesson interaction, and a focus session.
6. Reload in a new browser session and confirm the state restores.
7. Confirm neither learner can see the other learner's state.
8. Request a password reset, use the emailed link, and sign in with the new
   password.
9. Delete one disposable account and confirm its session no longer works.

The API `/health` response must show a healthy database and
`passwordResetEmailConfigured: true`.

## Backups and recovery

Before public traffic:

1. Enable Railway Postgres backups or snapshots and record their retention.
2. Create a manual pre-launch snapshot.
3. Restore that snapshot into a separate disposable database.
4. Run `/health`, sign-in, progress, and note reads against the restore.
5. Record the restore time and the person responsible for recovery.

For the initial beta, the proposed targets are an RPO of 24 hours and an RTO
of 4 hours. The project owner must accept or replace these targets; a backup
that has never been restored does not count as verified.

## Browser and accessibility proof

Check 390, 768, 1024, and 1440 pixel widths:

- no horizontal page overflow;
- navigation, More menu, Settings, and focus controls work with keyboard and
  touch;
- focus is visible and logical;
- lesson Next stays in the first viewport when appropriate;
- lesson gates cannot be bypassed by repeatedly pressing Next;
- reduced motion removes nonessential movement;
- badge fronts and backs stay visible through a complete drag rotation;
- text remains readable at 200% zoom;
- every required page is reachable without knowing a hidden URL.

## Domain cutover

1. Keep both Railway generated domains until all tests above pass.
2. Attach `learningai4you.com` and `www.learningai4you.com` to the web service.
3. Wait for a valid certificate covering both names.
4. Point DNS exactly as Railway instructs and remove stale records.
5. Set `CANONICAL_HOST=learningai4you.com`.
6. Confirm `www` permanently redirects to the same path on the bare domain.
7. Confirm `/api/health` works through the bare domain.

Do not advertise the bare domain while it has a certificate mismatch or
Railway 404.

## Rollback

If the redesign fails but the API is healthy, temporarily route `/` to the V2
entry point or restore the previous web deployment. If the API or migration
fails, roll back both API and web to the last verified commit and restore the
pre-launch database snapshot only when data recovery is actually required.
Never overwrite a live database merely to repair a frontend problem.

## Go / no-go

Launch only when all are true:

- committed-release audit passes;
- dedicated Postgres integration test passes;
- account isolation and password recovery pass on Railway;
- backups have been restored successfully;
- both custom domains have valid TLS;
- responsive and keyboard checks pass;
- a rollback owner and the last verified commit are recorded.
