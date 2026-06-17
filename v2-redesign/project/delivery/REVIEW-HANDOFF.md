# Learning AI V2 — Review Handoff (round 2)

**For:** Opus & Claude to review **before** Claude pushes to GitHub (`Draven1287/PartnerAi`).
**Owner:** Aarav Shah. **Author of this pass:** Claude (design + prototype).
**Status:** prototype + spec + reference code. **Nothing is on GitHub yet — that's the next step after this review.**

---

## ▶ Reviewer routing

- **Opus (audit):** read §1–§3 and the checklist in §7. Flag anything that breaks the product rules or the voice. Don't edit — report findings.
- **Claude / Codex (implement + push):** read §1–§6. Port patterns into the real `v2/` app, keep storage keys + `chapter-N` ids, then commit. See §6 for the push checklist.

**How to view:** open these in a browser —
- `Learning AI V2 - Redesign.dc.html` — the full app (guest path → lesson → gate → account → questionnaire → dashboard).
- `Explainer Library.dc.html` — the reusable lesson-video engine (3 sample videos).
- `Backend Console.dc.html` — the admin analytics dashboard.

---

## 1. What changed since round 1

| Area | Change |
|---|---|
| **Guest-first onboarding** | Lands straight in **Lesson 1 — no signup**. After finishing it, a **save wall** ("you painted your first square") invites a free account. Diagnostic comes *after* the account, at peak motivation. Guests are locked to Lesson 1 only. |
| **Real auth** | Two modes (Sign in / Create account) with validation (email format, password ≥ 8, name on signup). Empty/invalid sign-in is **rejected**. "Remember me" demonstrated via a localStorage stand-in that maps 1:1 to the API. |
| **Diagnostic shuffle** | Answer order is randomized **once per attempt** (stable per sitting, different per learner). Scoring uses the answer's true rank, not its slot — so it can't be gamed by "always pick D." |
| **Lesson videos** | The `watch` step is now a **real auto-playing motion graphic**, not a placeholder. A reusable, data-driven engine (`Explainer Library.dc.html`) renders a video from a short script (silent motion graphic — no audio). |
| **Backend** | Full spec (`BACKEND.md`) + deployable reference server (`server/`) + client (`backend-client-v2.js`) + an admin **Backend Console** with live connection diagnostics. |
| **4 themes** | Light / Dark / Sepia / High-contrast across every view (live V2 only shipped light+dark). Dark retuned to a cleaner charcoal. |

---

## 2. The lesson-video system (new — review this)

`Explainer Library.dc.html` is a **data-driven** engine: each video is a script —
```js
{ id, lesson, title, dur, accent, grad,
  stations: [[icon,label,sub], …],   // the steps shown on the track
  beats:    [[atSeconds, caption], …],
  takeaway }
```
The engine animates a dot across the steps, syncs captions, fills a progress bar, and (optionally) **speaks** each caption via `speechSynthesis`. It has play/pause, a scrubber, and per-video theming.

**Which lessons get a video (recommendation):** only the **explaining/abstract** ones — the concepts that are clearer animated than read. Sample scripts included: *Agency loop* (L1), *What is an agent?* (L9), *Why AI is confidently wrong* (L8). The hands-on lessons (sort, prompt-repair) stay interaction-first, no video.

**Abstract systems concepts** (agent, sub-agent, how-to-build) warrant the **longer cinematic treatment** (timeline animation via `animations.jsx`) — story arc drafted, not yet built. Decide scope before building all of them.

**Open question for review:** voice — removed (browser TTS was too robotic/annoying). Videos are now silent **interactive walk-throughs** (see below). Recorded VO is a possible later upgrade.

**Videos are now tap-through walk-throughs, not passive video.** The learner advances each step themselves (set the goal → AI helps → verify & finish), each step checks off. Both `Explainer Library.dc.html` and the V2 `watch` step use this.

**Where to use a walk-through (guidance for Codex):** the rule of thumb is **tap-through = mechanisms; classify / exitCheck / promptRepair = judgment & recall.**
- *Good fits* (replace a passive `reveal`): how AI works (L3/L6, the prediction pipeline), prompt anatomy (L2/L5: context→role→examples→constraints), the verify loop (Arc 4 safety), the agent loop (L9 / Building).
- *Don't* convert single-fact checks, sorting, or prompt-repair — those are already hands-on. Overusing the walk-through makes 30 lessons feel formulaic (a reviewer concern), so keep the mix.

---

## 3. Product rules (unchanged — must still hold)

6 arcs · 30 lessons · gated Next · progress mosaic · reuse V1 design language · keep `chapter-N` ids · no embedded chatbot. Storage keys that must keep working: `learningai-progress`, `learningai-toolkit`, `learningai-settings`, `learningai-v2-assessment`, `learningai-v2-diagnostic-draft`.

> **Known content gap (flagged by reviewers, still true):** `v2/lessons.js` has ~9–10 authored lessons (chapters 1–9 + a ch-25 sample). **20 are stubs.** The mosaic's whole payoff is undermined while 2/3 is locked. The blueprint (`reviews/master-syllabus/LearningAI-v2-lesson-experience-blueprint.md`) specs all 30 — **authoring them is the real remaining work**, and should be Aarav-voiced, not mass-generated.

---

## 4. Files in this delivery

```
Learning AI V2 - Redesign.dc.html   ← the app (guest path, auth, lessons, videos, themes)
Explainer Library.dc.html           ← reusable lesson-video engine + 3 sample videos
Backend Console.dc.html             ← admin analytics + connection diagnostics
BACKEND.md                          ← stack, data model, endpoints, CORS/cookie/Cloudflare, auth lifecycle
server/  (server.js, schema.sql, package.json)  ← deployable Node/Express/Postgres API
backend-client-v2.js                ← frontend bridge for all endpoints
animations.jsx                      ← timeline engine (for the cinematic explainers)
v2/sunrise-progress.png             ← mosaic reveal image
HANDOFF.md                          ← round-1 handoff (porting plan, theme tokens)
REVIEW-HANDOFF.md                   ← this file
```

---

## 5. Stack (plain)

**Node + Express + Postgres on Coolify, behind Cloudflare.** Express handles requests (matches the existing `fetch`/cookie pattern), Postgres persists (Coolify one-click, survives restarts). Cookie-based sessions. **Shaleen** owns Coolify + Cloudflare config (BACKEND.md §5–6); **Codex** deploys `server/` and wires the frontend.

---

## 6. Push checklist (before Claude commits to GitHub)

- [ ] Confirm the **guest path** is the agreed onboarding (free L1 → save wall → account → diagnostic).
- [ ] Decide **which lessons get videos** and whether browser TTS ships in v1.
- [ ] Port the redesign **CSS + screens** into real `v2/index.html` / `app.js` / `v2.css` (don't rewrite the engine or `lessons.js`).
- [ ] Add the missing **sepia + high-contrast** theme tokens to `applyAppearance()`.
- [ ] Wire **auth + persistence** to `backend-client-v2.js` (signup/login/me/diagnostic/progress/visit/notes).
- [ ] Copy `v2/sunrise-progress.png`; keep `chapter-N` ids and `learningai-*` storage keys.
- [ ] Backend (Shaleen + Codex): Postgres + `schema.sql`, CORS/cookie/Cloudflare config, `/api/health` green in the Console.
- [ ] **Then** author lessons 11–30 from the blueprint (separate, Aarav-led).

---

## 7. Review checklist (Opus)

- [ ] Guest path: can a guest reach anything beyond Lesson 1? Is the save-wall moment well-timed?
- [ ] Auth: is empty/invalid sign-in actually blocked? Does a returning sign-in restore progress?
- [ ] Diagnostic: ungameable (per-attempt shuffle) and scored by true rank?
- [ ] Videos: do they teach, not just decorate? Is the voice tolerable? Which lessons genuinely need one?
- [ ] Accessibility: focus states, keyboard nav on gated controls + scrubber, contrast in all 4 themes, hit targets ≥ 44px.
- [ ] Responsive at < 640px: nav, lesson card, mosaic, video player, settings.
- [ ] Copy: student-first voice held? No invented content? (Lesson voice is intentionally student-grounded — see HANDOFF §12.)
- [ ] Porting risk: anything that would break `learningai-*` keys or `lessons.js`.
