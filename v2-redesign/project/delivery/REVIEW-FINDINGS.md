# Review Findings — round 2 (Opus + Codex)

Two reviews of this delivery, with status. **Read with `REVIEW-HANDOFF.md`.**

## ⭐ The headline — UPDATED
Earlier rounds led with "20 of 30 lessons are stubs" as THE blocker. **That is now resolved in the live repo** — `tools/check-v2-launch-ready.mjs` passes with **30 lessons and no stubs** (backend/frontend seed drift fixed). The mosaic can be completed. So the priority is no longer "write content" — it's **finish the push**: stage untracked files, land the two P2 fixes, decide guest-first, and do a real mobile QA pass.

## Still open (current)
1. **Backend lockfile** — `coolify-backend/` has no `package-lock.json`; Docker uses `npm install --omit=dev`. Needs `npm` run locally + switch to `npm ci --omit=dev` to be deploy-ready. Until then, label backend "source included, not locked."
2. **Guest-first onboarding is a product decision (Aarav).** The prototype implements it (free L1 → save wall → account → diagnostic). The live V2 still requires account + questionnaire *before* lessons. Reviewers like guest-first, but it changes the public funnel — **explicit yes/no needed before Codex ports it.**
3. **Responsive `<640px` QA** — nav, mosaic, lesson card, walk-through. Not yet truly device-tested.

---

## Opus (product/UX audit) — verdict: strong round 2

**Resolved from round 1:** 🟢 signup wall killed (guest-first) · 🟢 `watch` step is now an active **tap-through walk-through** · 🟢 judgment-vs-recall rule adopted · 🟢 4 themes · 🟢 diagnostic shuffled + scored by rank, moved after account · 🟢 empty sign-in blocked (with the auth-message caveat below).

**Open items:**
| # | Item | Status |
|---|---|---|
| 🟡 | Auth error must be visible, not a silent no-op | **Prototype: shows a custom red inline error** ("Enter your email and password to sign in.") — verified by Claude via screenshot. **Live `v2/app.js`:** inputs use native `required` / `minlength:8`, so the empty case likely shows the *browser's own* validation bubble before the custom `invalid_credentials` message fires. **Not a silent no-op, not a blocker** — confirm on the live build whether the styled message or the native bubble shows. |
| 🟡 | `tryLive` "copy prompt → run elsewhere → come back" breaks flow, not verifiable | **OPEN** — recommend a "paste your result back, now react to it" step (stays within no-chatbot rule). Not yet built. |
| 🟡 | Verify a guest **cannot** reach beyond Lesson 1 | Guest nav shows no tabs; back-from-L1 goes to welcome. **Re-confirm on port.** |
| 🟡 | Responsive < 640px (lesson card, mosaic, video player, nav) | **NOT re-tested this round** — verify on port. |
| 🟡 | Backend security before real accounts: bcrypt, httpOnly cookies, CORS lockdown | Spec'd in `server/server.js` (bcrypt, httpOnly, sameSite, CORS allowlist) + BACKEND.md §3b/§4. **Shaleen must confirm on Coolify/Cloudflare.** |
| 🟡 | Porting: merge improved L1 copy **without losing** the ~9–10 lessons already in `lessons.js` | Note for Codex. |
| 🔴 | **Content gap** | **RESOLVED in repo** — 30 lessons, no stubs (`check-v2-launch-ready.mjs` passes). No longer the blocker. |

---

## Codex (technical readiness) — fix before push

| # | Finding | Action |
|---|---|---|
| P2 | `v2/index.html` loads `lessons.js?v=20260611v2launch` but `lessons.js` changed — caches may serve the old Lesson 1 | **Bump the `lessons.js` cache-busting query string** to the new release key (match `app.js`/`v2.css`). |
| P2 | Theme switching leaves stale vars: `applyV2Palette()` sets `--on-accent` only for contrast, and never updates `--accent-dim` (button hover) | **Reset `--on-accent` AND `--accent-dim` in every theme branch.** *(Note: this prototype already avoids the bug — each `data-theme` block sets the full var set. The fix is for the live `v2/app.js` JS path.)* |
| P2 | `coolify-backend/` Docker build non-reproducible: `npm install --omit=dev`, no lockfile, ranged deps | **Commit a `package-lock.json` and switch to `npm ci --omit=dev`.** Same applies to the `server/` reference here — add a lockfile before treating deploys as stable. Blocking only for *backend-deploy-ready*, not the visual frontend. |

**Push notes (Codex):** `coolify-backend/`, `tools/`, and `v2/sunrise-progress.png` are untracked — `git add -u` will miss them; use explicit `git add` for those paths.

**Verified by Codex:** `node --check v2/app.js` ✓ · `check-v2-launch-ready.mjs` ✓ · `check-backend-ready.mjs` ✓.

---

## Recommended order (updated)
1. **Stage the untracked files** (`coolify-backend/`, `tools/`, `v2/sunrise-progress.png`) with explicit `git add`.
2. **Land the two P2 fixes** (cache-bust + theme-var reset) and **push the frontend** — both reviewers approve.
3. **Decide guest-first** (yes/no) so Codex can port the funnel change.
4. **Backend:** add lockfile + `npm ci`, confirm bcrypt/httpOnly/CORS on Coolify — *before* real accounts. Or ship labeled "source included, not locked."
5. **Mobile QA** `<640px`.
