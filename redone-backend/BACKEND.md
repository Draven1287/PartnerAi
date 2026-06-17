# Learning AI — Backend Spec & Deploy Guide

**For:** Codex 5.5 / Opus (implement the server) and Shaleen (Coolify + Cloudflare config).
**Goal:** persist the data Aarav wants to see — learners, diagnostic results, lesson progress, and visit/engagement — and feed the **Backend Console** (`Backend Console.dc.html`).
**Companion files:** `backend-client-v2.js` (frontend bridge), `server/` (reference Node/Express server + schema).

---

## ▶ Who does what

| Task | Who |
|---|---|
| Provision Postgres + the API container on Coolify | **Shaleen** (owns Coolify) |
| Set Cloudflare DNS + rules for `api.learningai4you.com` | **Shaleen** (owns Cloudflare) |
| Implement / deploy the server code | **Codex 5.5 / Opus**, from `server/` |
| Wire the frontend to the API | **Codex** (swap in `backend-client-v2.js`) |

Aarav does not have Coolify/Cloudflare access — anything in **§5 (Cloudflare)** and **§6 (Coolify)** must go through Shaleen.

---

## 1. The stack (recommended)

**Node.js + Express + Postgres**, containerized on Coolify, behind Cloudflare.

- **Express (Node)** — the request handler. Matches the site's existing `fetch()` + cookie pattern and is what Codex/Opus write fluently.
- **Postgres** — the database. Coolify has one-click managed Postgres with a **persistent volume** (a file DB like SQLite can be wiped on container redeploys; Postgres won't). Scales as more learners arrive.
- **Sessions** — signed, http-only cookie (`connect-pg-simple` or a signed JWT in a cookie). The frontend already sends `credentials: 'include'`, so the whole model is cookie-based.

> If you'd rather avoid a second service, SQLite + a mounted volume works for low traffic — but Postgres-on-Coolify is the safer default and barely more setup.

---

## 2. What we collect (data model)

Exactly what Aarav asked to see, plus two low-cost signals (lessons completed, last-seen) that make the Console useful.

### `users`
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `email` | text unique | sign-in identity |
| `password_hash` | text | bcrypt/argon2 — never store raw |
| `display_name` | text | shown in Console |
| `age_range` | text | from Q1 of the diagnostic (`under-13`…`prefer-not`) |
| `created_at` | timestamptz | |

### `diagnostics`  (one row per completed diagnostic)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK → users | |
| `answers` | jsonb | `{ definition:3, capability:2, … }` — the option **rank** chosen (0–3), not the on-screen slot |
| `score` | int | 0–100 |
| `level` | text | `Foundation` / `Explorer` / `Builder` |
| `taken_at` | timestamptz | keep history if retaken |

### `progress`  (one row per user)
| column | type | notes |
|---|---|---|
| `user_id` | uuid PK FK | |
| `current_lesson` | int | 1–30 |
| `completed` | jsonb | array of completed lesson numbers → mosaic fill = `completed.length` |
| `updated_at` | timestamptz | |

### `visits`  (one row per session/open → powers visit count + intervals)
| column | type | notes |
|---|---|---|
| `id` | bigserial PK | |
| `user_id` | uuid FK | |
| `started_at` | timestamptz | one insert per app open (debounced ~30 min) |

> Visit **count** = `count(*)`; **intervals/active days** = `count(distinct date(started_at))`; **last-seen** = `max(started_at)`.

### `notes`  (optional — the toolkit "Save it" cards)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `lesson` | int | |
| `card_type` | text | e.g. "Agency rule" |
| `fields` | jsonb | `[{label,value}]` |
| `created_at` | timestamptz | |

DDL is in `server/schema.sql`.

---

## 3. API endpoints

All JSON. All under `https://api.learningai4you.com`. Auth via the session cookie (set on signup/login). `4xx` returns `{ ok:false, error:"code" }`.

| Method | Path | Body / returns | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | → `{status:"ok", db:"connected"}` | Console diagnostics ping; **must not be cached** |
| `POST` | `/api/auth/signup` | `{email,password,displayName}` → sets cookie, `{ok,user}` | Create account |
| `POST` | `/api/auth/login` | `{email,password}` → sets cookie, `{ok,user}` | Sign in |
| `POST` | `/api/auth/logout` | → clears cookie | Sign out |
| `GET` | `/api/me` | → `{user, progress, level}` | Hydrate app on load |
| `POST` | `/api/diagnostic` | `{answers,score,level,ageRange}` → `{ok}` | Save diagnostic result |
| `GET` | `/api/progress` | → `{currentLesson, completed[]}` | Read progress |
| `POST` | `/api/progress` | `{currentLesson, completed[]}` → `{ok}` | Write progress (call on lesson complete) |
| `POST` | `/api/visit` | → `{ok}` | Log an app-open (debounce client-side) |
| `GET` | `/api/notes` / `POST` `/api/notes` | list / save toolkit cards | My Notes |
| `POST` | `/api/minutes` | `{name,minutes,consent}` | **existing** — keep as-is |
| `POST` | `/api/admin/login` | `{email,password}` → sets **admin** session cookie, `{ok}` | Sign in to the Backend Console |
| `POST` | `/api/admin/logout` | → clears the admin cookie | Sign out of the Console |
| `GET` | `/api/admin/overview` | → KPIs + learner list (auth: admin only) | Feeds the Backend Console |

`/api/admin/*` must be gated to an admin account (Aarav). Simplest: an `is_admin` boolean on `users`, checked in middleware.

**Admin sign-in (the Console login gate).** The Backend Console opens to an **Admin sign-in** screen and shows nothing until you authenticate:
- `POST /api/admin/login` takes `{email,password}`, verifies the account exists **and** `is_admin = true` (bcrypt-checked), and on success sets the same kind of http-only, `SameSite=None; Secure` session cookie as a normal login — just flagged admin. Wrong credentials or a non-admin account → `401`.
- **No admin token is stored in the browser.** The session lives in the http-only cookie; JS can't read it, so there's nothing to leak from `localStorage`. (This replaces any earlier "paste your admin token" approach.)
- The Console calls `GET /api/me` (or `/api/admin/overview`) on load; if the cookie is missing or not admin, it stays on the sign-in screen.
- Create the admin account once (seed script or a one-off `is_admin = true` update on Aarav's user). Optionally support more than one admin later by flipping the flag.
- `POST /api/admin/logout` clears the cookie and returns the Console to the gate.

---

## 3b. Auth & "remember me" lifecycle  (answers: *will this work?*)

**Yes — and this is the standard pattern.** Two concepts, kept separate:

- **Authentication (who you are):** signup stores email + a **bcrypt-hashed** password. Login compares what's typed. On success the server sets a **30-day session cookie** (signed JWT). That cookie is the "stay logged in."
- **Persistence (your data):** diagnostic, progress, mosaic, and notes are rows keyed to `user_id`. They are re-read on load.

**The exact sequence the frontend follows:**

1. **App loads** → call `GET /api/me`.
   - Cookie valid → server returns `{ user, progress, level, onboarded }`. Frontend restores state and, if `onboarded` is true, **skips the questionnaire** and lands on the dashboard. *(This is the "it remembered me" behavior.)*
   - No/expired cookie → show the account screen.
2. **Create account** → `POST /api/auth/signup` (validates: email format, password ≥ 8, name required; `409 email_taken` if the email exists). Sets cookie → go to questionnaire.
3. **Sign in** → `POST /api/auth/login` (`401 bad_credentials` on wrong email/password — **never let an empty/invalid sign-in through**). Sets cookie → then `GET /api/me` to hydrate; skip the questionnaire if `onboarded`.
4. **Finish diagnostic** → `POST /api/diagnostic` (sets `onboarded` true for next time).
5. **Finish a lesson** → `POST /api/progress`. **Open the app** → `POST /api/visit` (debounced).
6. **Sign out** → `POST /api/auth/logout` clears the cookie.

**Why empty sign-in must fail:** the button should call `/api/auth/login`; the server returns `401` for blank/wrong credentials, so the frontend shows "Check your email and password" instead of proceeding. Client-side, also disable the buttons until the required fields are filled (email + password for sign-in; + name for signup).

> **Validation rules (enforce on BOTH client and server):** email looks like an email; password ≥ 8 chars; display name required only for *create*. Client checks are for UX; the server checks are the real gate.

---

## 4. CORS + cookies (the part that breaks behind Cloudflare)

The site (`learningai4you.com`) and the API (`api.learningai4you.com`) are **different origins**, and the app sends `credentials:'include'`. That triggers strict rules. Get these exactly right or signup will silently fail in the browser console with a CORS error.

**On the Express server:**
```js
app.use(cors({
  origin: ['https://learningai4you.com', 'https://www.learningai4you.com',
           'http://127.0.0.1:8123', 'http://localhost:8123'], // dev origins
  credentials: true,                       // REQUIRED with credentials:'include'
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.options('*', cors());                  // answer preflight OPTIONS
```
- `Access-Control-Allow-Origin` must be the **exact origin** echoed back — **never `*`** when credentials are included (the browser rejects `*` + credentials).
- `Access-Control-Allow-Credentials: true` must be present.

**The session cookie must be cross-site-capable:**
```js
res.cookie('session', token, {
  httpOnly: true,
  secure: true,          // HTTPS only (Cloudflare provides it)
  sameSite: 'none',      // REQUIRED for cross-site (site → api) cookies
  domain: '.learningai4you.com',
  maxAge: 1000*60*60*24*30,
});
```
- `SameSite=None` **requires** `Secure`. Without this pair, the browser drops the cookie and the user appears logged-out on every request.

---

## 5. Cloudflare config (Shaleen)

`api.learningai4you.com` sits behind Cloudflare in front of the Coolify container.

1. **DNS:** `api` → the Coolify host. **Proxied (orange cloud)** is fine; SSL/TLS mode **Full (strict)**.
2. **Do NOT cache the API.** Add a config/page rule for `api.learningai4you.com/*` (or a cache rule): **Cache Level: Bypass** (equivalently, responses should show `cf-cache-status: DYNAMIC`). If Cloudflare caches `/api/*`, learners see stale data and POSTs behave unpredictably. *(This is the amber row in the Console diagnostics.)*
3. **Don't strip cookies.** Ensure no Cloudflare rule removes `Set-Cookie` / `Cookie` headers on `/api/*`.
4. **Preflight:** let `OPTIONS` pass through to origin (don't let a WAF/redirect rule swallow it).
5. **TLS:** the cert must cover `api.learningai4you.com` so `Secure` cookies work.

---

## 6. Coolify config (Shaleen)

1. **Postgres:** add a managed Postgres resource. Note its internal connection string.
2. **API service:** deploy the `server/` app as a container. Env vars:
   ```
   DATABASE_URL=postgres://…           (from the Coolify Postgres)
   SESSION_SECRET=<long random string>
   ALLOWED_ORIGINS=https://learningai4you.com,https://www.learningai4you.com
   NODE_ENV=production
   PORT=8787
   ```
3. **Domain:** map the service to `api.learningai4you.com` (Coolify handles the reverse proxy; Cloudflare sits in front).
4. **Migrate:** run `server/schema.sql` once against the Postgres (psql or a one-off job).
5. **Persistence:** the data lives in Postgres' volume — verify the volume is persistent across redeploys.

---

## 7. Frontend wiring (Codex)

1. Drop in **`backend-client-v2.js`** (replaces the one-function `backend-client.js`). It exposes `window.LearningAIBackend` with `signup/login/logout/me/saveDiagnostic/getProgress/saveProgress/logVisit/getNotes/saveNote` — all using `credentials:'include'`.
2. Keep **`backend-config.js`** as-is (it already points local→`127.0.0.1:8787`, prod→`api.learningai4you.com`).
3. In `v2/app.js`, replace the in-browser storage writes with API calls at these points:
   - account create/sign-in → `signup` / `login`
   - diagnostic finish → `saveDiagnostic`
   - lesson complete → `saveProgress` (and the mosaic reads `completed.length`)
   - app load → `me` (hydrate) + `logVisit` (debounced)
   - toolkit save → `saveNote`
4. **Graceful fallback:** if `LEARNING_AI_BACKEND_URL` is unset or the call fails, fall back to `localStorage` so the site still works offline (the existing keys `learningai-progress`, `learningai-toolkit`, `learningai-settings`). The client returns `{ok:false, skipped:true}` when unconfigured — mirror today's behavior.

---

## 8. Verify the connection

Open **`Backend Console.dc.html`** → click **Run tests** (top-right chip or the Connection diagnostics panel). It checks, in order:
1. DNS + TLS reachable (Cloudflare)
2. CORS preflight (OPTIONS) echoes the origin
3. `Access-Control-Allow-Credentials: true`
4. Session cookie accepted (`SameSite=None; Secure`)
5. `GET /api/health` → 200
6. Cloudflare not caching `/api/*` (`cf-cache-status: DYNAMIC`)

A red row points to the exact section above. In production, point those checks at the real fetch calls (the panel currently simulates the sequence for design review).

> **Privacy note (matches the site's promise):** collect only email, display name, age range, diagnostic answers, progress, and visit timestamps. No third-party trackers, no selling data. Hash passwords. Gate `/api/admin/*`. Consider a documented data-deletion path since the audience includes minors.

---

## 9. Build order (suggested)

1. Postgres + `schema.sql` (Shaleen + Codex).
2. `/api/health` + CORS/cookie config → **make the Console go green** (proves the Cloudflare path).
3. `auth/signup` `auth/login` `me` → real accounts.
4. `diagnostic` + `progress` + `visit` → the data Aarav wants.
5. `/api/admin/overview` → live Backend Console.
6. `notes` (optional), then port the frontend writes (§7).
