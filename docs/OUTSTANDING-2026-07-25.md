# Outstanding work — 25 July 2026

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

- **Badges (Focus page)** — click-to-flip does not work alongside drag; shadows
  on the front face look wrong; a medal does not return to the front.
- **About page** — empty grid cell in the middle ("For adults" sits alone in the
  left column with nothing beside it).
- **Glass ↔ non-glass scroll transition** — not smooth enough on scroll.
- **Progress page** — arc names should sit *inside* the coloured boxes; there is
  a "Start" control with nothing in it that just navigates back.
- **Start / landing page** — Aarav wants an explicit "you get one lesson free,
  then you sign in" framing before Lesson 1, rather than dropping straight in.
- **Age range control** — should not be a plain dropdown; wants something nicer.
- **The questionnaire gives the learner nothing.** Aarav asked whether it could
  award something. Currently it records a level that nothing reads.
- **Backend console UI/UX** — now restyled to V2 tokens, but not reviewed.

## 4. Content

- **`lesson-one.html` has never been rewritten.** All 50 curriculum lessons are
  now plain-language, but the bespoke free first lesson — the first thing a
  stranger ever sees — still uses roughly **nine undefined technical terms**
  (context, evidence, permission, prediction, prompt …). This is the single
  highest-value remaining content fix.
- **Projects page** — "Open case study" opens a how-to-run-it-yourself brief,
  not a case study. The label does not match the behaviour.
- **`submission-policy.html`** is a navigational dead end: no nav, no back link.

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
