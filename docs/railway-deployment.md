# Railway deployment layout

One Railway project contains three services:

1. `learning-ai-web` — repository root, config path `/railway.toml`.
2. `learning-ai-api` — root directory `/coolify-backend`, config path `/railway.toml`.
3. Railway PostgreSQL — managed database in the same project.

## Workspace access

The workspace owner should invite `aarav@shah.so` with permission to edit
services, variables, deployments, and domains. Use separate member accounts;
do not share the owner's password, browser session, or a long-lived Railway
token. Revoke any token previously pasted into chat. Confirm access before
changing service configuration or DNS.

## Backend variables

Set references instead of copying database credentials manually:

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
SESSION_SECRET=<long random secret>
ADMIN_EMAIL=<owner email>
ADMIN_PASSWORD_HASH=<bcrypt hash>
CORS_ORIGINS=https://<frontend-generated-domain>,https://learningai4you.com,https://www.learningai4you.com
ADMIN_CORS_ORIGINS=https://<frontend-generated-domain>,https://learningai4you.com,https://www.learningai4you.com
BUILD_SHA=${{RAILWAY_GIT_COMMIT_SHA}}
ENFORCE_COURSE_ACCESS=false
```

Keep `ENFORCE_COURSE_ACCESS=false` until signed checkout, webhook, duplicate-event, refund, and entitlement-restoration tests pass.

Do not store secrets in Git or the frontend service. Keep the generated Railway domains until both services pass health and end-to-end checks. DNS changes happen only after verification.

## Frontend variables and API routing

```text
API_INTERNAL_URL=http://learning-ai-api.railway.internal:8080
CANONICAL_HOST=learningai4you.com
```

The browser calls `/api/*` on the web domain. `frontend-server.mjs` proxies
those requests to the backend over Railway's private network, preserving
first-party cookies. The optional public API subdomain is not a launch
dependency.

`learningai4you.com` is the canonical public hostname. Keep the `www` domain
attached only so the frontend can issue a permanent 308 redirect from
`www.learningai4you.com` to the same path on the bare domain. Do not set
`CANONICAL_HOST` until Railway has issued a valid certificate for the bare
domain, or the redirect could send visitors to a TLS error.

## Release order

1. Deploy PostgreSQL.
2. Deploy API and verify `/health` reports `ok: true` and healthy database state.
3. Set the frontend's `API_INTERNAL_URL` to the backend's private Railway URL.
4. Deploy frontend and verify `/health`, `/v2/`, signup, sign-in, curriculum, progress, and evidence writes.
5. Verify `/api/health` through the frontend's generated domain.
6. Run the launch audit at 390, 768, 1024, and 1440 widths.
7. Attach both custom domains and update DNS. Repair bare-domain TLS first,
   then set `CANONICAL_HOST=learningai4you.com` so `www` permanently redirects
   to the bare domain.
8. Verify TLS, CORS, sessions, account separation, and rollback.
9. Remove V2 `noindex` only after the custom domains pass.
