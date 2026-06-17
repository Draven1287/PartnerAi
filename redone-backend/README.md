# Learning AI — Backend

Express + Postgres API for the Learning AI app, plus the spec the frontend follows.

## Files
- **server.js** — reference API server (Node + Express + Postgres). Implements the full contract.
- **schema.sql** — Postgres schema. Run once to create tables.
- **make-admin.sql** — flip a user to admin so they can sign into the Backend Console.
- **package.json** — dependencies + scripts.
- **BACKEND.md** — the full spec & deploy guide (endpoints, cookies, CORS, Coolify + Cloudflare).

## Quick start (local)
```bash
npm install
# point at a Postgres instance
export DATABASE_URL="postgres://user:pass@localhost:5432/learningai"
export JWT_SECRET="a-long-random-string"
export CORS_ORIGIN="http://localhost:3000"     # where the frontend runs
npm run migrate          # creates tables from schema.sql
npm start                # serves the API on :8080
```

## Create the admin (for the Backend Console login)
1. Sign up a normal account in the app (or via `POST /api/auth/signup`) with the email you want to be admin.
2. Promote it:
   ```bash
   psql "$DATABASE_URL" -v email="you@example.com" -f make-admin.sql
   ```
3. Open the **Backend Console** and sign in with that email + password.
   - The Console calls `POST /api/admin/login`, which checks the password **and** `is_admin = true`.
   - On success the server sets an http-only session cookie. **No admin token is stored in the browser.**

## Admin endpoints
- `POST /api/admin/login`  — `{email,password}`; 401 on bad password, 403 if not admin.
- `POST /api/admin/logout` — clears the session cookie.
- `GET  /api/admin/overview` — KPIs + learner list (admin only). Feeds the Console.

See **BACKEND.md** for everything else (auth, progress, notes, diagnostics, CORS, deploy).
