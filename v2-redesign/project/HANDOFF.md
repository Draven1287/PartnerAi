# Learning AI V2 — Redesign Handoff

**Artifact:** `Learning AI V2 - Redesign.dc.html` (interactive prototype)
**For:** porting into the live repo (`Draven1287/PartnerAi`, `v2/`) via Codex, and design/code review.
**Author of this pass:** Claude (design + prototype). **Owner:** Aarav Shah.
**Live product:** learningai4you.com · **Repo:** github.com/Draven1287/PartnerAi

---

## ▶ Read this first — agent routing

This one file serves two different jobs. Read the part meant for you.

- **If you are Codex 5.5 (implementer):** your job is to **port** the look + screens + interactions into the real vanilla-JS app. Read §0 → §9, and treat **§7 (porting plan)** as your task list. Do **not** rewrite the engine or lesson data; re-skin and wire to the real storage keys.
- **If you are Claude Opus (reviewer):** your job is to **audit**, not to build. Read §1, §3, §8, §9, and run the checklist in **§10**. Flag anything that breaks the product rules in §1 or the voice decision in §12. Report findings as a list; don't edit the prototype.

> **How to view the prototype:** open `Learning AI V2 - Redesign.dc.html` in a browser. It's self-contained (in-memory state) — walk Account → Questionnaire → Dashboard → Lessons → Lesson 1 → Done, and toggle the four themes top-right.

---

## 0. TL;DR

This is a **visual + UX redesign** of Learning AI V2, delivered as a single self-contained interactive prototype. It is **not** wired to the real backend and does **not** use the live storage keys yet — it holds everything in in-memory component state so the whole flow can be clicked through.

Codex: **port the look, the screens, and the interaction patterns** into the real `v2/index.html` + `v2/app.js` + `v2/v2.css`, keeping the real engine, lesson data (`v2/lessons.js`), storage keys, and `chapter-N` ids intact.

Opus: **audit** the design decisions, accessibility, and the porting plan in §7 / §9; flag anything that breaks the product rules in §1 or the voice decision in §12.

---

## 1. Product rules (do not break)

V2 = V1 with only these differences:
- **6 arcs, 30 lessons** (5 lessons each).
- **More interaction per lesson**; you must **complete each gated interaction before "Next" unlocks**.
- A **progress mosaic** (one square per lesson, fills as you complete — a picture coming into focus, for motivation).
- Must **reuse V1's design language**, keep **`chapter-N` ids**, link out to V1's real pages, and **not** embed a chatbot.
- Storage keys that must keep working: `learningai-progress`, `learningai-toolkit`, `learningai-settings` (+ V2's `learningai-v2-assessment`, `learningai-v2-diagnostic-draft`).

> Note: this redesign intentionally **modernizes the visual style** (new type + warm editorial palette) per Aarav's direction ("V2 UI can be remade, doesn't have to come from V1"). If strict V1 visual parity is required instead, that is a scope decision to confirm before porting §3.

---

## 2. What the prototype contains (screens)

A single-page app with a top nav and these views (all in `Learning AI V2 - Redesign.dc.html`):

| View | Purpose | Notable |
|---|---|---|
| **Account** | Email sign-in / create account | Captures email for Settings; privacy copy from V1 |
| **Questionnaire** | 6-question diagnostic | Age-range required on Q1 (prominent card); answers **shuffled** so the best one isn't always last; scores to Foundation / Explorer / Builder |
| **Dashboard** | Home after onboarding | **Mosaic on top** (fills only on completion), stat row, "Continue learning", per-arc progress bars |
| **Lessons** | Catalog of all 30, grouped by arc | Sequential — only the next lesson is startable; Lesson 1 fully playable |
| **Lesson** | The gated lesson flow | Step rail, card per step, locked "Next" + 🔒 reason, notebook sidebar |
| **Done** | Lesson-complete celebration | Shows the newly-filled mosaic square |
| **My Notes** | Saved toolkit cards | Real — "Save it" steps write here; empty state included |
| **Settings** | Account + appearance | Signed-in email, retake diagnostic, sign out, theme, text size, mosaic style, reduce-motion |
| **About / Projects / Teaching AI** | Editorial content pages | **Full real V1 content inline** (Aarav's story, the MacBook-Air LLM project, the educators guide) |

---

## 3. Design system used in the prototype

All styling is inline / in one `<style>` block. Tokens are CSS custom properties on `.lp[data-theme=…]`.

**Type**
- Display / editorial: **Newsreader** (serif), weight 500.
- UI / body: **Plus Jakarta Sans**.
- (Both Google Fonts. The live app may prefer to keep V1's families — confirm.)

**Four themes** (all implemented — note the live `applyAppearance()` only ships light + dark; **sepia & high-contrast are referenced but missing in production** — port these):

| token | light | dark | sepia | contrast |
|---|---|---|---|---|
| `--bg` | `#f6f3ea` | `#16140f` | `#efe2c8` | `#000` |
| `--surface` | `#fffdf8` | `#211e18` | `#f8efd8` | `#0c0c0c` |
| `--text` | `#211f1a` | `#f3efe6` | `#3f3320` | `#fff` |
| `--accent` | `#3a3aa3` | `#a6a4f2` | `#8a5a23` | `#8fb0ff` |
| `--border` | `#e4dcc9` | `#3a352b` | `#d3c09a` | `#fff` (2px) |

(Full set incl. `--surface-2 --text-dim --text-faint --accent-dim --accent-soft --good --bad --on-accent --shadow` is in the file.)

**Arc identity colors** (used for chips, mosaic, bars — never as full surfaces):
1. Orientation `#4257c9` · 2. Understanding `#0e8fa0` · 3. Conversation `#7c52cf` · 4. Judgment & Safety `#cf5340` · 5. Applying `#d57e22` · 6. Building `#2f9c6a`

**Other**
- Text-size scaling via `data-fs="normal|large|xl"`. Reduce-motion via `data-reduce="1"`.
- Logomark = a small **mosaic grid coming into focus** (replaces the old sun glyph), inline SVG in `brandMark()`.

---

## 4. The mosaic (centerpiece)

- 6×5 = 30 tiles, one per lesson, in lesson order.
- Three fill styles (Settings → "Progress mosaic style"), default **Arc**:
  - **Arc** — each completed tile fills with its arc's color.
  - **Reveal** — completed tiles uncover a sunrise image (`v2/sunrise-progress.png`, a 6:5 gradient generated for this).
  - **Hybrid** — arc-tinted while locked, image revealed when complete.
- Unfilled tiles: neutral `--surface-2` with a faint arc-tinted border (kept deliberately clean — earlier muddy version was rejected).
- Fill animation: `tilein` keyframe on the just-completed tile. Hover shows `Lesson N · Arc ✓` tooltip.

**Image asset:** `v2/sunrise-progress.png` (already in the project). Reveal mode positions it with `background-size:600% 500%` and per-tile `background-position`.

---

## 5. The lesson engine (interaction model)

Step kinds present in the prototype's Lesson 1 (real content from `lessons.js`, chapter-1):

| kind | gated? | interaction |
|---|---|---|
| `coldOpen` | no | scenario + a reflective prompt |
| `classify` | **yes** | sort each statement into one of 2 buckets; all rows correct → unlock |
| `reveal` | no | key idea + common-mistake / better callouts |
| `watch` | no* | **video step** (currently a styled placeholder — see §8) |
| `tryLive` | no | copy-a-prompt to run in any AI tool |
| `workflowChain` | **yes** | place steps in the correct order |
| `toolkitSave` | no (optional) | fill fields → **saves a card to My Notes** |
| `exitCheck` | **yes** | single-correct quiz; right answer → unlock |

**Gating:** `GATED = { classify, workflowChain, exitCheck }`. "Next" is `btn-locked` (dashed, not clickable) until `state.passed[stepIndex]` is true, with a live "Complete X of Y to unlock" hint. On unlock the button plays an `unlockpop` animation.

> The full V2 has 14 step kinds (`coldOpen, reveal, compare, nextWord, tryLive, verify, workflowChain, evalTest, classify, exitCheck, promptRepair, toolkitSave, biasSpot, agentDesign`). This prototype demonstrates the pattern on a representative subset; the visual treatment generalizes to all of them.

---

## 6. State shape (prototype only — replace with real storage on port)

```js
state = {
  theme, fontScale, variant, reduceMotion,     // → learningai-settings
  onboarded, email, name,                       // → account / auth
  qIndex, qAnswers, qAge, qNote,                // → learningai-v2-diagnostic-draft / -assessment
  completed: { [lessonNum]: true }, justFilled, // → learningai-progress
  savedNotes: [ {id, lesson, lessonTitle, arc, arcIndex, cardType, fields:[{label,value}], ts} ], // → learningai-toolkit
  view, idx, sel, passed, note, pop             // ephemeral UI state
}
```

---

## 7. Porting plan (Codex → real repo)

This prototype is a **React-flavored single component**. The live V2 is **vanilla JS** (`v2/app.js` renders views + step kinds). Port **patterns, markup, and CSS — not this file verbatim.**

1. **CSS → `v2/v2.css`** (and the missing theme tokens → wherever `applyAppearance()` sets them, or `../styles.css`):
   - Add the **sepia + high-contrast** token sets (§3) so `applyAppearance()` can switch all four.
   - Bring over the redesigned components: nav tabs, lesson card, step rail, locked-Next, mosaic, dashboard, lessons catalog, settings grid, content-page prose, My Notes cards, the prominent age-range card, the form-control visibility rule.
2. **Markup/behavior → `v2/index.html` + `v2/app.js`:**
   - Keep the existing engine, routing (`#/lesson/chapter-1/0`), and `lessons.js` data. Re-skin the render functions.
   - Wire **gating** to the real `maxStepReached` / completion logic that already exists.
   - Mosaic: drive `fillCount` from `learningai-progress` (count of completed lessons). Keep `chapter-N` ids.
   - **My Notes:** persist to `learningai-toolkit` (the live V1 "saved notes" feature already uses this key — reuse it, don't fork).
   - **Settings:** read/write `learningai-settings` (theme, fontScale, fontFamily) — add `mosaicStyle` + `reduceMotion`.
3. **Onboarding:** account screen → real auth (see §9 backend); diagnostic → existing assessment scoring; **shuffle option order** but score by the option's true rank, not its slot (see `QORDER` in the prototype).
4. **Assets:** copy `v2/sunrise-progress.png`.

---

## 8. Open / unfinished (decide before shipping)

- **Lesson videos = interactive, not passive.** Per Aarav: the `watch` step should *pause to ask the learner something* (predict / spot-the-mistake / choose-next) before continuing — gated like other steps. Currently a styled placeholder. **Recommended next build.**
- **Backend** — nothing persists server-side yet (see §9).
- **Only Lesson 1 is wired** in the prototype; the other 29 reuse `lessons.js` in production.
- **Interaction audit** of all 14 step kinds (clarity of affordance, right/wrong feedback, unlock satisfaction) — not yet done.
- **Per-session vs fixed answer shuffle** — currently a fixed scramble; random-per-session is harder to game across students (decision pending).

---

## 9. Backend (to scope with Aarav)

Repo already has `backend-client.js` + `backend-config.js`. **Unknown to this pass: what the backend actually is** (real API/DB, or to-be-built). Before wiring:
- Confirm the backend contract (endpoints, auth model).
- Decide what persists server-side: **accounts/auth, lesson progress + mosaic, saved notes (toolkit), diagnostic results** — all, or a subset.
- Then design the read/write points per screen (§6 maps state → keys today; those become API calls).

---

## 10. Review checklist (for the reviewing model)

- [ ] Does the redesign respect the product rules in §1 (6 arcs/30 lessons, gated Next, mosaic, no chatbot, `chapter-N` ids)?
- [ ] Accessibility: focus states, keyboard nav on gated controls, contrast in all four themes, hit targets ≥44px, `aria` on the switch/segmented controls.
- [ ] Responsive: nav wrap, mosaic, lesson card, dashboard at <640px.
- [ ] Theme parity: every view correct in light/dark/sepia/contrast and both font scales.
- [ ] Gating logic: can a learner ever skip a gated step? Is the unlock moment clear?
- [ ] Diagnostic integrity: are answers ungameable (shuffle) and scored correctly?
- [ ] Porting risk: anything in §7 that would break `learningai-*` storage or `lessons.js`.
- [ ] Copy: on-brand, honest-over-hype, no invented content.

---

## 11. File map (this project)

```
Learning AI V2 - Redesign.dc.html   ← the prototype (open in a browser)
v2/sunrise-progress.png             ← mosaic reveal image (generated)
v2/index.html, v2/app.js, v2/v2.css ← imported live source (reference)
styles.css                          ← imported V1 design system (reference)
HANDOFF.md                          ← this file
```

---

## 12. Voice & audience decision (do not "correct" this)

The live product is positioned for **everyone** (students + adults), and About/Teaching keep that breadth. But a deliberate decision was made for the **lesson voice specifically**:

- **Lessons speak student-first** — concrete, personal, scene-based ("Look at your group chat…"), second person. This is intentional. The product's one real differentiator vs. Khan / MIT / Google AI Essentials is **peer voice** (a high-schooler teaching high-schoolers — see About). Generic "for-everyone" lesson copy throws that advantage away; adults follow a vivid student scene fine, but students bounce off corporate-neutral copy.
- **Breadth lives in the framing pages**, not in every lesson. About, Teaching AI, and Projects explicitly address adults, parents, and educators.

**Reviewer/implementer:** keep the lesson voice concrete and student-grounded. Do not flatten it toward neutral "professional" tone in the name of inclusivity.

### Content note — Lesson 1 cold open was rewritten
The prototype's chapter-1 `coldOpen` was updated to a more personal, vivid version. When porting, update the matching entry in `v2/lessons.js` (chapter-1) to match:

- **Title:** "You already know all three of these people"
- **Scenario:** "Look at your group chat. One person runs everything through AI — their work is faster and they're getting way more done. Another swears it off: AI is dangerous, so they do every assignment themselves, by hand. A third uses it for literally everything, no exceptions. They're all talking over each other, and every one of them is sure they're right."
- **Prompt:** "Before you read on — in one sentence, where do you actually land?"

This is a **copy** change only; the step kind and gating are unchanged.
