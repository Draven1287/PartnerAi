# Learning AI — Frontend Design System (`design.md`)

**Product:** Learning AI — a free, interactive course that teaches people to use AI *without
letting it think for them*.
**Audience:** teens (13+), adults learning for themselves, and adults guiding a young person.
**This doc:** the complete frontend spec — tokens, type, components, screens, interaction,
state, content model, accessibility, voice. It describes the app **as built** in
`Learning AI V2 - Redesign.dc.html`, and flags where the **proposed brand**
(`Brand Identity.dc.html`) intends to evolve it.

> **Governance:** no raw color / font / radius / shadow literals in components — read a token
> or pattern defined here. New value → add it here first. Migration steps live in
> [`DESIGN-MIGRATION-PLAN.md`](./DESIGN-MIGRATION-PLAN.md).
>
> **Source-of-truth note:** values below are extracted **verbatim from the `.dc.html` app**
> (the authoritative build). The exported `…(standalone).html` is a slightly older snapshot
> with a few different values (e.g. light `--bg:#f6f3ea` vs the app's `#faf9f5`) — when they
> disagree, **the `.dc.html` app wins**, as recorded here.

---

## 1. Design principles
1. **You stay in charge.** Every screen reinforces that the learner — not the AI — keeps the goal, method, and verification. The UI never automates away the thinking.
2. **Editorial, not "tech."** Serif display + warm paper tones — a well-made book, not a dashboard. No neon, no gratuitous gradients.
3. **Warm & human, quietly premium.** Friendly copy, generous spacing, soft shadows, restrained color.
4. **Honest about AI.** Name limits plainly. Confidence is not proof.
5. **Calm density.** One clear action per screen; progressive disclosure over option walls.
6. **Accessible by default.** Four themes (incl. high-contrast), three font scales, reduced-motion, ≥44px targets.

---

## 2. Color

CSS custom properties on the root, switched by `[data-theme="light|dark|sepia|contrast"]`.
**Never hard-code hex** — read the token. All tokens exist in every theme.

### Token roles (15)
| Token | Role |
|---|---|
| `--bg` | Page background |
| `--surface` | Cards, raised panels |
| `--surface-2` | Insets, inputs, secondary fills, chips |
| `--border` | Hairlines, dividers (`--bw` wide) |
| `--text` | Primary text |
| `--text-dim` | Secondary text, body copy |
| `--text-faint` | Tertiary — labels, captions, placeholders, overlines |
| `--accent` | Primary action, active state, links |
| `--accent-dim` | Accent hover/active |
| `--accent-soft` | Accent tint backgrounds (selected, active tab, focus ring) |
| `--good` | Success, correct, "safe" |
| `--bad` | Error, warning, "verify first" |
| `--on-accent` | Text/icon on an accent fill |
| `--shadow` | Shadow color (theme-aware) |
| `--bw` | Border width (`1px`; **`2px`** in contrast theme) |

### As-built palette (authoritative — accent = indigo)

**Light (default)**
```css
--bw:1px;
--bg:#faf9f5; --surface:#ffffff; --surface-2:#f0eee6; --border:#e7e3d8;
--text:#211f1a; --text-dim:#5d5749; --text-faint:#8c8573;
--accent:#3a3aa3; --accent-dim:#2c2c84; --accent-soft:rgba(58,58,163,.09);
--good:#1f8a5b; --bad:#c2414b; --on-accent:#fff; --shadow:rgba(40,33,20,.07);
```
**Dark**
```css
--bw:1px;
--bg:#16140f; --surface:#211e18; --surface-2:#2b271f; --border:#3a352b;
--text:#f3efe6; --text-dim:#b3ab9a; --text-faint:#857e6e;
--accent:#a6a4f2; --accent-dim:#bcbaf6; --accent-soft:rgba(166,164,242,.16);
--good:#4cc38a; --bad:#f0808a; --on-accent:#16140f; --shadow:rgba(0,0,0,.45);
```
**Sepia**
```css
--bw:1px;
--bg:#e7d4ab; --surface:#f4e6c2; --surface-2:#dcc798; --border:#c9b07f;
--text:#443318; --text-dim:#6c552c; --text-faint:#9a7f4f;
--accent:#a85d16; --accent-dim:#864a10; --accent-soft:rgba(168,93,22,.15);
--good:#5f7a2c; --bad:#b23f28; --on-accent:#fff; --shadow:rgba(95,62,18,.17);
```
**High-contrast**
```css
--bw:2px;
--bg:#000; --surface:#0c0c0c; --surface-2:#1a1a1a; --border:#ffffff;
--text:#ffffff; --text-dim:#ededed; --text-faint:#c4c4c4;
--accent:#8fb0ff; --accent-dim:#b3c8ff; --accent-soft:rgba(143,176,255,.22);
--good:#3ff08f; --bad:#ff7b85; --on-accent:#000; --shadow:rgba(0,0,0,.6);
```

### Proposed brand direction — "Ink, Paper & a warm accent" *(not yet built)*
The brand board moves the lead accent **indigo → warm amber/terracotta** to match the editorial identity. Proposed roles:
- **Ink Black** `#14110D` (logo) · **Ink** `#1C1822` (text/dark UI)
- **Amber** `#D79438` (accent) · **Terracotta** `#C25A3C` (warm secondary)
- **Paper** `#F4ECDB` (bg) · **Card** `#FFFAF0` · **Sand** `#E3D8C2` (borders) · **Stone** `#5D5749` (dim text)
- **Green** `#1F8A5B` (success) · **Clay** `#C2414B` (warning)

> **Migration:** adopting this = change only the `--accent*` tokens (and optionally `--bg/--surface`
> to the warmer paper values). Because everything reads tokens, the whole app re-skins. **Don't touch
> component CSS.** Until then, indigo above is the live target.

---

## 3. Typography

| Family | Use | Weights |
|---|---|---|
| **Newsreader** (serif) | Display: H1s, lesson titles, core questions, pull quotes. `letter-spacing:-.015em`; italics for editorial asides. | 400 / 500 / 600 |
| **Plus Jakarta Sans** (sans) | All UI: body, buttons, labels, nav, inputs. | 400 / 500 / 600 / 700 |
| **Mono** | `ui-monospace, "SF Mono", Menlo, monospace` — code, prompts. | — |

> The brand board references **Inter** as the sans; the app ships **Plus Jakarta Sans**. The
> constant is the *role split* (editorial serif + clean sans); the exact sans is interchangeable.

**Load in every `<head>`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap">
```

### Scale & rules
| Role | Size | Family / weight |
|---|---|---|
| H1 (page/onboarding) | `clamp(28px, 4.6vw, 40px)`, line-height ~1.05 | Newsreader 500 |
| Lesson / section title | `24–26px` | Newsreader 500 |
| Core question (lesson) | `16–18px`, italic, `--text-dim` | Newsreader italic |
| Lead | `17–18px` | Plus Jakarta 400 |
| **Body (base)** | `15–16px`, line-height 1.55–1.6, `--text-dim` | Plus Jakarta 400 |
| Body small | `13.5–14px` | Plus Jakarta 400/600 |
| Labels / captions | `12.5–13px`, weight 600 | Plus Jakarta |
| Kicker / eyebrow / tag | `11px`, `letter-spacing:.14em`, uppercase, weight 700, `--text-faint` (tag = `--accent`) | Plus Jakarta |

- Use `text-wrap: pretty` / `balance` on headings.
- Font-scale via `data-fs="normal|large|xl"` on root scales the whole UI.

---

## 4. Spacing, radius, elevation

- **Container:** outer canvas `max-width ~1140px`, side padding 24px, bottom padding 80px.
  Content columns cap at **560 / 600 / 680 / 880px** depending on screen.
- **Spacing rhythm (px):** 2 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 30 · 32 · 34.
  Common gaps: 6 (tight), 8 (chips/buttons/grid), 12 (lists/bars), 24–34 (sections). Always
  flex/grid + `gap:`, never margin-based inline spacing.
- **Radius:** inputs/buttons `11–12px` · compact cards `16px` · cards/mosaic `20–22px` ·
  pills/tags `999px` · small tiles `8–9px` · circles `50%`.
- **Elevation** (color always `var(--shadow)` unless an accent glow):
  | Use | Value |
  |---|---|
  | subtle lift | `0 1px 4px var(--shadow)` |
  | raised / popover | `0 8px 22px var(--shadow)` |
  | card | `0 16px 44px var(--shadow)` (doc baseline `0 10px 30px`) |
  | hero card / mosaic | `0 18px 50px var(--shadow)` |
  | modal / onboarding | `0 22px 60px var(--shadow)` |
  | focus ring | `0 0 0 3px var(--accent-soft)` (6px for large) |
  | primary-button hover lift | `0 4px 14px var(--accent-soft)` |
  No hard or multi-layer drop shadows.
- **Borders:** always `var(--bw) solid var(--border)` so the contrast theme thickens them automatically.

---

## 5. Motion
- Subtle, purposeful, **always disable-able** via reduce-motion (`data-reduce="1"` on root).
- **Durations:** micro (hover/press) `.15s` · color/shadow `.2s` · toggle knob `.18s` · progress fill `.35–.5s ease`.
- **Easing vocabulary** (`animations.jsx`): `easeOutCubic` (default out), `easeInOutCubic`,
  `easeOutBack` (playful overshoot), `easeOutExpo`, `easeOutElastic` (special), `easeInQuad` (exits).
- **Named keyframes:** `pop`/`unlockpop` (button unlock spring), `tilein` (mosaic tile completes),
  `agepulse` (age card until answered), `pulse` (arc attention ring), `shake` (invalid input).
- No autoplaying, looping, or attention-grabbing motion.

---

## 6. Responsive breakpoints
Max-width stops in use: **560 · 600 · 680 · 800 · 880 px**. Recommend consolidating to two
canonical stops during migration — **`≤560px` (mobile)** and **`≤880px` (tablet/narrow)**.

---

## 7. Arc system (content spine)

**7 arcs**, sizes `[5,4,3,5,7,6,3]` → **33 lessons**. Arc color is used for chips, the mosaic,
and progress bars **as an accent only — never a full surface**. Suggested tokens `--arc-1…--arc-7`.

| # | Arc | Lessons | Color |
|---|---|---|---|
| 1 | Orientation | 5 | `#4257c9` |
| 2 | Understanding | 4 | `#0e8fa0` |
| 3 | Conversation & Prompting | 3 | `#7c52cf` |
| 4 | Judgment & Safety | 5 | `#cf5340` |
| 5 | Applying | 7 | `#d57e22` |
| 6 | Building | 6 | `#2f9c6a` |
| 7 | Staying in Charge | 3 | `#b0467e` |

> **Arc 7 (`#b0467e`)** was chosen to complete the set: a grounded berry/rose, distinct from the
> other six, in the warm editorial family — fitting for the capstone arc. Standardize all seven in
> code as `--arc-1…--arc-7`. Note the code is currently behind: `v2/v2.css` ships only 5 `--v2-*`
> vars and `v2/app.js` `ARC_COLORS` only 6 — both must carry all seven.

---

## 8. Component primitives

All values from the app; everything composes from the tokens above.

### Buttons (`.btn`)
```css
.btn         { display:inline-flex; align-items:center; gap:8px; padding:13px 22px;
               border-radius:12px; font-size:15px; font-weight:600;
               border:var(--bw) solid transparent; transition:all .15s; cursor:pointer; }
.btn-primary { background:var(--accent); color:var(--on-accent); }       /* one per view */
.btn-primary:hover { background:var(--accent-dim); }                      /* + accent lift */
.btn-ghost   { background:transparent; color:var(--text); border-color:var(--border); }
.btn-ghost:hover { border-color:var(--text-dim); background:var(--surface); }
.btn-locked  { background:var(--surface-2); color:var(--text-faint);
               border:var(--bw) dashed var(--border); cursor:not-allowed; }  /* gated; .pop on unlock */
```

### Top nav (`.topnav`)
Sticky, blurred, hairline-bottom. Left: **brand** (mark + "Learning **AI**"). Right: **tabs** +
theme/scale controls + **Sign out**.
- **Tab order:** Dashboard · Lessons · My Notes · About · Projects · Gallery · *For Adults*¹ · Teaching AI · **Settings** (Settings last).
- ¹ *For Adults* appears only when the user's age range is **18+**.
```css
.tabs { display:flex; gap:2px; flex-wrap:wrap; }
.tab  { border:0; background:transparent; color:var(--text-dim); font-size:14px; font-weight:600;
        padding:8px 13px; border-radius:9px; transition:all .15s; }
.tab:hover { color:var(--text); background:var(--surface-2); }
.tab.on    { color:var(--accent); background:var(--accent-soft); }
```

### Cards
```css
.card          { background:var(--surface); border:var(--bw) solid var(--border);
                 border-radius:20px; padding:30px 32px; box-shadow:0 18px 50px var(--shadow); }
.card.compact  { padding:22px; border-radius:16px; }
.onb-card      { border-radius:22px; box-shadow:0 22px 60px var(--shadow); max-width:600–720px; margin:auto; }
```
Lesson step card carries `--arc` (the lesson's arc color) as a CSS var for accenting.
Editorial content cards: `.bi-card`, `.toolcard`, `.proj`, `.infocard`. Tinted aside: `.callout-box(.good)`.

### Inputs / select / textarea
```css
input, .field select, select, textarea {
  padding:12px 14px; border:var(--bw) solid var(--border); border-radius:11px;
  background:var(--surface-2); color:var(--text); font-size:15px; width:100%; }
/* forced-visible affordance so controls read on every theme: */
textarea, select { border-color:color-mix(in srgb,var(--text-faint) 58%,var(--border));
  box-shadow:inset 0 1px 2px color-mix(in srgb,var(--text) 8%,transparent); }
.field      { display:grid; gap:6px; }
.field span { font-size:13px; font-weight:600; color:var(--text-dim); }
/* focus: accent border + 3px accent-soft glow. */
.age-card   { the prominent age selector on Q1; pulses (agepulse) until answered; drives the adult gate. }
```

### Chips · segmented control · toggle
```css
.chip { border:var(--bw) solid var(--border); background:var(--surface-2); color:var(--text);
        padding:9px 16px; border-radius:999px; font-size:13.5px; font-weight:600;
        min-height:40px; transition:all .15s; cursor:pointer; }
.chip.selected { border-color:var(--accent); background:var(--accent-soft); color:var(--accent); }
.seg  { display:inline-flex; background:var(--surface-2); border:var(--bw) solid var(--border);
        border-radius:999px; padding:3px; gap:2px; }              /* active = raised --surface chip */
.switch .knob { width:21px; height:21px; border-radius:50%; background:#fff;
        box-shadow:0 1px 3px rgba(0,0,0,.3); transition:transform .18s; }  /* on: translateX(19px) */
```

### Callout · labels · progress · dot
```css
.callout { border:var(--bw) solid var(--border); border-left:3px solid var(--accent);
           background:var(--surface-2); border-radius:10px; padding:13px 16px;
           font-size:15px; line-height:1.55; }
.kicker  { font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--text-faint); font-weight:700; }
.tag     { font-size:11px; letter-spacing:.1em;  text-transform:uppercase; color:var(--accent);     font-weight:700; }
.fill    { height:100%; background:var(--accent); transition:width .35s ease; }   /* use --arc-N per arc */
.dot     { width:20px; height:20px; border-radius:50%; border:2px solid var(--border);
           display:grid; place-items:center; }                    /* selected → var(--accent) */
```

### Progress mosaic (`.mos` / `.mtile`)
6-column grid, one square tile per lesson. Completed tiles fill (arc color / reveal image /
hybrid per the **mosaic style** setting); incomplete = neutral with a faint arc-tinted border.
Hover scales; a newly-completed tile plays `tilein`.
```css
.mos-hero { background:var(--surface); border:var(--bw) solid var(--border);
            border-radius:22px; padding:28px 30px; box-shadow:0 18px 50px var(--shadow); }
.mos      { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }
```
> A seamless **"sunrise wash"** alternative (one continuous gradient, no gaps) was prototyped and reverted — parked as a future direction.

### Brand mark
```css
.brand        { display:flex; align-items:center; gap:10px; font-weight:700; letter-spacing:-.01em; font-size:16px; }
.brand .spark { width:28px; height:28px; border-radius:9px; display:grid; place-items:center;
                background:linear-gradient(150deg,#f4b66a,#d98a6a); color:#2b2350; }
```
Logomark concept = a small **mosaic grid coming into focus** (progress metaphor). **Final logo is TBD** (see §13).

### Scroll rail (`.scrollrail` / `-thumb`)
Custom vertical position indicator pinned right. Thumb height = viewport/page ratio; top = scroll %.
Shows only when scrollable. Driven by a passive scroll listener writing styles directly (no re-render).

### Icons
One inline-SVG set via `this.icon(name)` — stroke/fill `currentColor`, sized by caller (13–18px).
Names: `arrow, back, check, lock, msg, copy, server, shield, spark`, … **No emoji.**

---

## 9. Screens & flows

- **Onboarding:** `welcome → gate → account → questionnaire → dashboard`. Editorial hero
  ("Start Lesson 1 — free", "No account needed to try it… we never sell your data"). Guest mode
  lets people try Lesson 1 before committing; device storage preserves their work.
  Questionnaire = one question/screen + progress bar; **Q1 = age range** in a prominent `.age-card`
  (pulses until answered) → produces a `level` (Foundation / Explorer / …) and drives the adult gate.
- **Dashboard:** editorial header + **progress mosaic** + "continue where you left off" + arc overview.
- **Lessons catalog:** grouped by arc; each lesson `.ltile` with number/✓/lock, title, core
  question, action (Start / Open / Review / **Locked**). **Sequential gating** — a lesson opens only
  after the previous completes; completed lessons stay open (`lessonUnlocked(n)`).
- **Lesson player:** one step card at a time + progress crumb + Back/Next + persistent **notebook**
  (`.nb` textarea, autosaved per lesson). Completing the exit check fills the mosaic tile + unlocks next.
- **My Notes:** every saved **toolkit card** across lessons + freeform notebook text.
- **Projects:** (1) creator info/proof project; (2) curated buildable projects + a 3-step submit
  (finish lesson → build with your AI → ask for a reproducible summary → email it). Submissions →
  privacy alias via **Open in Gmail** + mailto fallback, pre-filled.
- **Gallery:** creator's project + (eventually) submitted learner projects.
- **For Adults** (18+ only): *use it yourself* / *guide a young person* + grid of free AI tools (each links to sign-up; "not affiliated / free plans change" disclaimer).
- **About / Teaching AI:** editorial long-form pages.
- **Settings:** Account (+ account switcher when multiple on device), **Appearance** (theme),
  **Text size**, **Motion** (reduce-motion, described in plain language).

---

## 10. Content model (lessons)

Lessons load at runtime from `v2/lessons.js`, which sets `window.V2_LESSONS` (array) and
`window.V2_ARCS`. The app polls for this on mount and re-renders when it lands.
- **Lesson shape:** `{ id, num, arc, title, coreQuestion, blurb, steps:[…] }`.
- **Step kinds** (each via `renderStep`; the prototype demonstrates a representative subset):
  `coldOpen`, `reveal`, `compare`, `nextWord`, `classify`, `promptRepair`, `tryLive`, `verify`,
  `workflowChain`, `evalTest`, `biasSpot`, `agentDesign`, `toolkitSave`, `exitCheck`.
  Gated kinds (`classify`, `workflowChain`, `exitCheck`) must be passed before "Next" unlocks.

> **Editing lessons:** change the per-lesson source and rebuild `v2/lessons.js` — don't hard-code
> lesson content in the component. New step kind → add a matching branch in `renderStep`.

---

## 11. State & persistence
Single DC logic class; one flat state object; navigation is `state.view`.
- **Views:** `welcome | gate | account | questionnaire | dashboard | lessons | lesson | done | settings | about | projects | gallery | adults | teaching | notes`.
- **Progress:** `completed{num→true}`, `curNum`, `nextLessonNum()`, `lessonUnlocked(n)`.
- **Notes:** `lessonNotes{num→text}` (notebook) + `savedNotes[]` (toolkit cards).
- **Prefs:** `theme`, `fontScale`, `reduceMotion`, mosaic `variant`.
- **Auth:** `email/name`, `authMode`, `guest`, `qAge` (drives adult gate).
- **Persistence:** device storage rehydrates on mount (notes, savedNotes, completed, draft) so
  guest work survives reloads; signed-in accounts also persist progress. **Never clear storage you
  didn't write.** Storage keys to preserve: `learningai-progress`, `learningai-toolkit`,
  `learningai-settings`, `learningai-v2-assessment`, `learningai-v2-diagnostic-draft`.

> **Backend:** syncs to the API in `BACKEND.md` (http-only cookie auth, `/api/progress`, `/api/notes`,
> `/api/diagnostic`, admin console behind `/api/admin/login`). Until wired, runs fully client-side.

---

## 12. Accessibility
- **Four themes** incl. true high-contrast (`#000/#fff`, `--bw:2px`).
- **Three font scales** (`data-fs`) that resize the whole UI.
- **Reduce-motion** (`data-reduce`), described in plain language in Settings.
- Inputs have forced-visible borders + focus rings on every theme.
- Targets ≥44px; switches use `role="switch"` + `aria-checked`.
- Color is never the only signal (icon + text on locked/done/correct).
- `data-screen-label` on major screens.

---

## 13. Voice & copy
**warm · human · premium · academic · honest · clear.**
- Clear over clever — short words, real examples; if a sentence needs rereading, cut it.
- Honest about AI — name limits; a confident answer can still be wrong.
- Warm, not corporate — say "you," contractions, sound like a sharp friend.
- You stay in charge — every lesson points back to the learner's judgment.
- Lesson voice is **student-first** (concrete, second-person, scene-based); breadth for adults lives in framing pages, not lesson copy.

---

## 14. Do / Don't
**Do** — read color/spacing from tokens; support all four themes; Newsreader for display, the sans
for UI; flex/grid + `gap`; soft single-token shadows; `var(--bw)` borders; one primary action per
screen; gate lessons sequentially; keep content in `v2/lessons.js`.
**Don't** — hard-code hex; add neon or stacked gradients; use emoji/decorative SVG as content; add
filler sections/stats; break reduce-motion or shrink text below the scale floor; clear storage you didn't write.

---

## 15. Open / proposed
- **Logo:** intentionally **TBD** — designed once palette/type/voice lock. The gold-"LA"-on-black mark is parked.
- **Accent migration:** indigo → amber/terracotta brand (token-only change — see §2).
- **7th arc color:** ✅ resolved — "Staying in Charge" = `#b0467e`. Standardize `--arc-1…--arc-7` in code (see §7).
- **Two snapshots:** `.dc.html` (authoritative, used here) vs `…(standalone).html` (older; e.g. light `--bg:#f6f3ea`). Keep building from the `.dc.html`.
- **Seamless mosaic:** the sunrise-wash variant is a candidate to revisit; the Arc/Reveal/Hybrid setting may be retired for one unified look.

*Files: `Learning AI V2 - Redesign.dc.html` (app) · `v2/lessons.js` (content) · `Brand Identity.dc.html` (brand draft) · `Backend Console.dc.html` + `BACKEND.md` (admin/backend).*
