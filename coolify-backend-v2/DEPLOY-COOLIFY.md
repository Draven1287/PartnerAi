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
The Backend Console requires an `is_admin` user.
1. Sign up once (in the app, or `POST https://api.learningai4you.com/api/auth/signup`
   with `{email, password, displayName}`).
2. Promote that user — from a shell with `psql` access to the new DB:
   ```bash
   psql "$DATABASE_URL" -v email="you@example.com" -f make-admin.sql
   ```
   (or run the contents of `make-admin.sql` in Coolify's Postgres console.)

## 7. Verify it's live
- API health: open `https://api.learningai4you.com/api/health`
  → should return `{"status":"ok","db":"connected"}`
- Console UI: `https://learningai4you.com/backend-console.html`
  → log in with the admin account → it should load via the new API.

## Rollback
Re-attach `api.learningai4you.com` to the old `partnerai-api-prod` service. The old
backend and its database are untouched by any of this.
