# Outstanding work — 25 July 2026

## ⚠️ Deploying: the two services build from different directories

**`railway up` from the repo root deploys the FRONTEND.** The root
`railway.toml` builds `Dockerfile.frontend`. Running
`railway up --service learning-ai-api` **from the repo root** therefore pushes
the frontend onto the API service and takes the backend down — the logs then
read "Learning AI frontend listening on 0.0.0.0:8080" and every `/api/*` call
returns 503. This happened on 26 Jul and took a few minutes to spot and undo.

```bash
# frontend
railway up --service learning-ai-web --ci            # from the repo root

# backend — note the directory
cd coolify-backend && railway up --service learning-ai-api --ci
```

`coolify-backend/railway.toml` builds `coolify-backend/Dockerfile`. Always
confirm afterwards with `curl -s https://learningai4you.com/api/health`, which
should return `"dbStatus":"ok"`.

Related: `api.learningai4you.com` returns 503 ("no available server") and has
for some time. The site does not use it — it proxies through
`learningai4you.com/api` via `API_INTERNAL_URL` on the web service — so this is
cosmetic unless something starts calling that host directly.


Everything raised in the 25 July session that is **not yet done**. Written before
a context compaction so nothing is lost. Ordered by who is blocked.

---

## 1. Needs Aarav

| Item | Why it matters |
|---|---|
| `RESEND_API_KEY` + `PASSWORD_RESET_FROM` on `learning-ai-api` | "Forgot password?" honestly reports it is unavailable. A learner who forgets a password has **no self-service recovery**. This is the remaining launch blocker. |
| Decide the legal layer | See §5. Needed before collecting more learner data. |

## 2. Needs Aarav's dad (Namecheap)

**One edit, and it is a quiet time bomb.**

> Namecheap → learningai4you.com → Manage → Advanced DNS
> Find the `ALIAS Record` for Host `@`.
> Change Value from `k7mvqf04.up.railway.app` to **`o565olmt.up.railway.app`**
> Change nothing else.

The apex works today only because the old, deleted Railway hostname still
resolves to an edge IP that happens to serve the domain. When Railway retires
it, `learningai4you.com` breaks with no warning.

**After that is done:** raise HSTS in `frontend-server.mjs` from
`max-age=2592000` to `max-age=31536000`. It is deliberately short until the DNS
is correct, because HSTS cannot be revoked quickly.

## 3. UI / UX raised but not fixed

- ~~Badges (Focus page)~~ **DONE** — dark inner vignette removed from both
  faces; a tap now settles on an absolute face (0 or 180) instead of adding a
  turn onto whatever the drag left; medals settle level rather than at 4°.
- ~~About page empty grid cell~~ **DONE** — a trailing odd card spans the width.
- **Glass ↔ non-glass scroll transition** — not smooth enough on scroll. STILL OPEN.
- ~~Progress page~~ **DONE** — arc names now sit in a full-bleed coloured band at
  the top of each card. The empty "Start" control was a real bug: it resolved to
  the first *unlocked* lesson, which for anyone past lesson one is lesson one, so
  it sent learners backwards. It now goes to the first unlocked lesson not yet
  done, with a 44px hit target.
- ~~Start / landing page~~ **DONE** — index.html is now a single glass panel:
  one line of what this is, one of what happens after the first lesson, one
  primary action, one quiet sign-in link. Returning learners bypass it. The
  two-option lesson-length picker was also removed; there is one 7-step path.
- ~~Age range control~~ **DONE** — now a row of choice buttons matching Motion
  and Text size, from the same eight values.
- **The questionnaire gives the learner nothing.** Aarav asked whether it could
  award something. Currently it records a level that nothing reads.
- ~~Backend console UI/UX~~ **DONE (26 Jul)** — now the **V3 glass** look, not
  V2: paper photograph, translucent panels, `blur(25px) saturate(1.6)`, the
  site's own `theme.css` for tokens and the focus ring. Reference pages are
  `progress.html` / `index.html` / `settings.html`. **Do not load `theme.js`** —
  it rewrites the site nav and corrupts an admin page. Three console classes
  are renamed (`.dcheck`, `.tcount`, `.cbrand`) because `theme.css` styles
  `.check` / `.badge` / `.brand` site-wide with `!important`.
  **No external resources: the CSP forbids external stylesheets and fonts, so
  Google Fonts tags fail silently. System stacks only.**
  Ignore `v2-redesign/` — that was the wrong reference.
  Verified in-browser against the real `/api/admin/overview` shape, which is
  **flat** (`{ok, total, learners, visitsByDay, …}`) — `visitsByDay` is an array
  of `{label, count}`, and levels join to learners on `attempt.userId`.
  Bugs fixed on the way: the assessment endpoint returns `analytics.attempts`
  but the code read `assessment.attempts`, so the questionnaire section always
  claimed nobody had finished it; an all-digit build SHA rendered as
  "2,799,946"; long emails broke apart mid-word; the overview grid starved the
  table into a scrollbar.
  **Sign-out was silently failing.** `handleAdminLogout` requires `csrf:true`,
  but the console never sent `x-csrf-token`, so every sign-out returned 403
  while the page said "Signed out." and the server session stayed alive. Fixed
  and verified; if you touch `api()`, keep the header on non-GET requests.
  **`consoleLevel()` coerces a missing assessment result to "Foundation"**
  (`server.mjs`), so `overview.levels` reports learners who never took the
  questionnaire as Foundation. The console deliberately ignores that field and
  tallies real attempts instead — do not "simplify" it back.
  **Not verified: a real sign-in against production** — that needs the admin
  password. If a field is mis-modelled, the raw-JSON disclosure will show it.
- **Safari "not secure"** — RESOLVED, not a real issue. Aarav confirmed Safari
  says nothing. The red icon was Arc's tracker-blocker shield. Certificate is
  valid, no mixed content, http redirects, HSTS now set. Do not re-investigate.

## 4. Content

- **`lesson-one.html` has never been rewritten. HIGHEST-VALUE REMAINING FIX.** All 50 curriculum lessons are
  now plain-language, but the bespoke free first lesson — the first thing a
  stranger ever sees — still uses roughly **nine undefined technical terms**
  (context, evidence, permission, prediction, prompt …). This is the single
  highest-value remaining content fix.
- ~~Projects page label~~ **DONE** — now "Open project brief", matching its
  sibling control and what the dialog actually contains.
- ~~`submission-policy.html` dead end~~ **DONE** — breadcrumbs above the title.
  It did have a back link, but below five sections of policy.

## 5. Legal / privacy (decision, then build)

Recommended sequence, cheapest first:

1. **Split the `16–18` age band into `16–17` and `18–24`.** Cheap, and today the
   product cannot tell a minor from an adult in its own data.
2. **Move the age question before account creation.** Age is currently question
   one of a questionnaire that runs *after* signup, so if under-13s must not
   have accounts, the gate is in the wrong place.
3. Terms and Conditions document (none exists; a Privacy page does).
4. Analytics off until consent; versioned consent records (`consent_json`
   exists but is unused).
5. Guardian email verification for 13–17. Real build: token issuance, expiry,
   pending-account state, 7-day deletion. **Requires the email provider from §1.**

A qualified privacy lawyer should review before launch. Drafting the documents
for them to review is a sensible way to save billable time.

## 6. Technical debt found and left alone

- `learning_minutes` and `page_visits` record nothing. Both are consent-gated
  and off by default, so this may be correct — unverified.
- Interaction answers are now wired up (`saveInteraction` / `submitQuizAnswer` /
  `completeActivity`) but **have not been confirmed with real traffic**. Check
  `interaction_answers` in the console after the next lesson anyone completes.
- Dead code: `draggable-glass.js` and `dashboard-panels.js` are loaded by no
  page; `focus-refinement.css` carries ~400 lines styling a `.medal` component
  that no longer exists.
- `theme.js` rewrites the nav to four links on load while the HTML ships seven,
  so a JS-disabled visitor sees a different information architecture and cannot
  reach Notes/Projects/Gallery/About.
- Two commits carry misleading messages: `git add -A` twice swept an agent's
  in-progress work into an unrelated commit. Content is correct, history is
  untidy. Cosmetic.

## 7. Verified working — do not re-investigate

- Apex `learningai4you.com` serves with a valid certificate; `www` 308-redirects
  to it. No mixed content. HSTS now set.
- Postgres connected; accounts, sign-in, questionnaire and lesson completion all
  reach the database.
- Admin console at `/console.html` (email `aarav@shah.so`, password is
  `ADMIN_PASSWORD` on `learning-ai-api`). The old `backend-console.html` and
  `admin/index.html` are **unrendered templates** and are deliberately 404.
- All 50 lessons rewritten: course-wide abstract terms down to 62, homework now
  taught in 8 lessons where it appeared in none.
- Six release gates all pass: `build-lessons --check`, `check-v2-launch-ready`,
  `audit-teen-course`, `audit-curriculum-principles`, `check-v3-preview`,
  `check-railway-package`.

## 8. Strategic note

The product is far ahead of its distribution. Ten weeks of engineering, one real
user. Before more building: **get five teenagers through Lesson 1 and watch
where they stop.** That answers "is this worth it" with evidence. The course is
the portfolio, not the business — the faster money is the small-model work Aarav
has already proved he can do.
