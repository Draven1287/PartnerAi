# Deploy the re-done Learning AI backend on Coolify

**For:** whoever owns Coolify + Cloudflare (per the backend's own notes, that's **Shaleen**).
**Goal:** make `api.learningai4you.com` serve the new backend in this folder.
**Repo:** `Draven1287/PartnerAi` · **Branch:** `main` · **Base directory:** `/coolify-backend-v2`

> ⚠️ **This starts with a FRESH, empty database.** The new backend uses a different
> table layout (6 tables: users, diagnostics, progress, visits, notes, minutes) than
> the current production backend (~30 tables). It cannot read the old database, so
> existing learner accounts/progress are **not** carried over. If preserving the old
> data matters, stop and ask before cutting over — a data migration is a separate task.

---

## 1. Create the Coolify app
- **Type:** Docker Compose
- **Repository:** `https://github.com/Draven1287/PartnerAi`
- **Branch:** `main`
- **Base directory:** `/coolify-backend-v2`
- **Compose file:** `docker-compose.yml`
- Recommended: create this as a **new** app (e.g. `partnerai-api-v2`) rather than
  editing the existing `partnerai-api-prod`, so the old API stays as instant rollback.

## 2. Set environment variables (Coolify → Environment Variables)
```
POSTGRES_PASSWORD=<long random string>
SESSION_SECRET=<long random string>
# admin allowlist — these emails auto-become Console admins (no SQL needed):
ADMIN_EMAILS=aarav@shah.so
# optional (defaults are fine):
POSTGRES_DB=learningai
POSTGRES_USER=learningai
ALLOWED_ORIGINS=https://learningai4you.com,https://www.learningai4you.com
```
Generate a secret with: `openssl rand -hex 32`

## 3. Deploy
- Click **Deploy**. The compose builds two services:
  - `learning-ai-db-v2` — Postgres 16 (persistent volume).
  - `learning-ai-api-v2` — the Node/Express API on internal port **8787**.
- `schema.sql` runs **automatically** on first DB boot — no manual migrate step.

## 4. Point the domain
- Map **`api.learningai4you.com`** to the `learning-ai-api-v2` service (internal port **8787**).
- If swapping from the old app: remove the domain from `partnerai-api-prod` first, then
  attach it here (a domain can only be on one service at a time).

## 5. Cloudflare (unchanged from the current setup)
- DNS: `api` → the Coolify host, proxied (orange cloud) is fine, SSL/TLS **Full (strict)**.
- **Do not cache the API:** a rule for `api.learningai4you.com/*` → **Cache Level: Bypass**
  (responses should show `cf-cache-status: DYNAMIC`). Caching `/api/*` breaks logins/data.
- **Do not strip cookies** on `/api/*` (the session cookie must pass through).

## 6. Create the admin login
The admin routes (`POST /api/admin/login` + `/api/admin/overview`) are now implemented,
and admin access is controlled by the **`ADMIN_EMAILS`** env var from step 2 — **no SQL needed.**

1. Make sure `ADMIN_EMAILS` lists every admin's email (e.g. `ADMIN_EMAILS=aarav@shah.so`).
2. That person signs up once in the app (or `POST /api/auth/signup`). On signup **or** the
   next login, the server sees the email in `ADMIN_EMAILS` and flips `is_admin=true` automatically.
3. Log into the Console at `https://learningai4you.com/admin` with that account — it loads the
   real learner data via `/api/admin/overview`.

To add/remove admins later: edit `ADMIN_EMAILS` and redeploy. (The old manual path still
works if ever needed: run `make-admin.sql` against the DB.)

## 7. Verify it's live
- API health: open `https://api.learningai4you.com/api/health`
  → should return `{"status":"ok","db":"connected"}`
- Console UI: `https://learningai4you.com/backend-console.html`
  → log in with the admin account → it should load via the new API.

## Rollback
Re-attach `api.learningai4you.com` to the old `partnerai-api-prod` service. The old
backend and its database are untouched by any of this.
