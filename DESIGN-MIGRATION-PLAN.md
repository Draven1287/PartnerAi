# Design Migration Plan — port the live app to the new design system

**Goal:** make the production app render the system in [`design.md`](./design.md) — warm
editorial palette, Newsreader + Plus Jakarta Sans, all four themes — everywhere.
**Scope of truth:** every file path / line number below is from the current `main`.

---

## 0. The core problem (read this first)

Colors are **not** driven by CSS today. They're injected at runtime by JavaScript
`setProperty(...)` with **hardcoded hex**, in two places that *override* `styles.css`:

| Where | What it does |
|---|---|
| `script.js` → `applyAppearance()` (lines **57–101**) | Sets `--bg/--surface/--surface-2/--border/--text/--text-dim/--text-faint` to hardcoded **cool** hex for `dark` (`#0f1726…`) and `light` (`#f7f9fc…`); runs on load + `DOMContentLoaded`. |
| `v2/app.js` → `applyAppearance()` (**350**), `applyV2Palette()` (**380**), `V2_PALETTES` (**56–61**) | Same pattern for the lesson app; default palette `green-amber`; also hardcoded dark/light overrides (**357–363**). |

`styles.css :root` (lines **6–22**) defines the light tokens, but the JS above overwrites
them at runtime. **Therefore editing `styles.css` values alone changes nothing** — the JS wins.

**Strategy:** move theming into **CSS `[data-theme]` token blocks** (per `design.md §2`) and
**strip the JS down to attribute toggles** (`data-theme`, `data-fs`, `data-reduce`). After that,
a palette or theme change is pure CSS, and the system can't drift between two JS copies.

---

## 1. Current-state audit (what exists today)

| File | Design-relevant content | Lines | Issue |
|---|---|---|---|
| `styles.css` | `:root` 16 tokens, **cool** palette, **light only** | 6–22 | wrong values; no dark/sepia/contrast token blocks |
| `styles.css` | body font `…"Inter"…`; serif = Georgia | 33, 41 | not Plus Jakarta / Newsreader |
| `styles.css` | `body[data-theme="dark"] .x{}` component overrides | 734+, 1047+ | per-component dark hacks instead of token theming |
| `script.js` | `applyAppearance()` JS color injection | 57–101 | hardcoded cool hex overrides CSS |
| `v2/app.js` | `ARC_COLORS` (6 cool) | 44 | wrong arc colors |
| `v2/app.js` | `V2_PALETTES` (5 cool palettes) + `applyV2Palette()` + dark/light overrides | 56–61, 350–392 | JS-injected cool palette |
| `v2/v2.css` | `--v2-blue/teal/violet/green/amber` (5 arc vars), `--painting-image` | 28–32, 300 | wrong arc colors; only 5 |
| `index.html`, `backend-console.html` | **already load** Newsreader + Plus Jakarta + JetBrains Mono | — | ✅ reuse this link |
| 15 other pages | load **no** web fonts | — | need the font `<link>` |
| `settings.html` | theme control offers **light/dark only** | 58–59 | add sepia + contrast |
| everywhere | reduce-motion **not wired** | — | add `data-reduce` + CSS |
| raw hex | `styles.css` 17, `v2/v2.css` 33, + HTML | — | replace with `var(--token)` |

---

## 2. Decision gate (before Phase 3)
- [ ] **Pick the 7th arc color** ("Staying in Charge"). The system defines 6 arc colors but the
      content has 7 arcs (`design.md §7`). Nothing in Phase 3 is final until this is chosen.
- [ ] **Palette picker:** decide whether to keep the 5-option `V2_PALETTES` picker (lines 56–61)
      or drop it in favor of the four canonical themes. (Recommended: drop it; it's the main source
      of cool-color injection.)

---

## Phase 1 — Typography

**1.1 Load the fonts on every page.** Add this to the `<head>` of the **15 pages missing it**
(`about, assessment, chapter-1..5, course, for-educators, my-path, playground, privacy, projects,
settings, v2/index`). `index.html` + `backend-console.html` already have it:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

**1.2 Apply the fonts in `styles.css`:**
- [ ] Line **33** `body { font-family: … "Inter" … }` → `font-family: "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;`
- [ ] Add: `h1,h2,h3,.serif { font-family: "Newsreader", Georgia, serif; font-weight: 500; letter-spacing: -.015em; }`
- [ ] Line **41** `body[data-font-family="serif"]` → keep, but base serif is now Newsreader.
- [ ] Code/mono (line 62 etc.) → `"JetBrains Mono", ui-monospace, monospace` (kept as-is is fine).

**1.3 v2 headings:** confirm `v2/v2.css` / `v2/app.js` titles use the serif rule above (lesson
titles, core questions = Newsreader).

---

## Phase 2 — Move theming to CSS tokens (the refactor)

**2.1 `styles.css :root` (lines 7–22) — replace light values** with `design.md §3 Light`:
| Token | Old | New |
|---|---|---|
| `--bg` | `#f7f9fc` | `#faf9f5` |
| `--surface` | `#ffffff` | `#ffffff` |
| `--surface-2` | `#eef4f8` | `#f0eee6` |
| `--border` | `#dbe3ea` | `#e7e3d8` |
| `--text` | `#121826` | `#211f1a` |
| `--text-dim` | `#4b5870` | `#5d5749` |
| `--text-faint` | `#7a869a` | `#8c8573` |
| `--accent` | `#2563eb` | `#3a3aa3` |
| `--accent-dim` | `#1d4ed8` | `#2c2c84` |
| `--accent-soft` | `rgba(37,99,235,.09)` | `rgba(58,58,163,.09)` |
| `--good` | `#0f8a66` | `#1f8a5b` |
| `--bad` | `#c2414b` | `#c2414b` |
| `--on-accent` | `#ffffff` | `#ffffff` |
- [ ] **Add** `--bw: 1px;` to `:root`.
- [ ] `--blue:#182235` → no equivalent; find usages (`grep var(--blue)`) and map to `--text`/`--accent`; then remove.
- [ ] Keep `--max-w`, `--wide-w` (layout).

**2.2 `styles.css` — ADD per-theme token blocks** (currently absent). Use the `body[data-theme]`
selector to match existing usage:
```css
body[data-theme="dark"]     { /* design.md §3 Dark  */ }
body[data-theme="sepia"]    { /* design.md §3 Sepia */ }
body[data-theme="contrast"] { /* design.md §3 High-contrast — note --bw:2px */ }
```
(Copy all 15 token values per theme verbatim from `design.md §3`.)

**2.3 `script.js applyAppearance()` (57–101) — strip the JS color injection:**
- [ ] **Delete** the hardcoded `setProperty('--bg'…)` blocks for `dark` (≈ lines 69–77) and
      `light` (≈ 77–85). Themes now come from the CSS blocks in 2.2.
- [ ] **Keep** `body.dataset.theme/fontScale/fontFamily` (lines 60–63).
- [ ] Keep the optional user `accentColor` / `backgroundColor` overrides (86–99) **only if** the
      custom-color feature is staying; otherwise remove for a clean token system.

**2.4 `v2/app.js` — same strip:**
- [ ] **Delete** the dark/light `setProperty` overrides in `applyAppearance()` (lines **357–363**).
- [ ] **Delete** `applyV2Palette()` (380–392) and its call (line 353), **or** repoint `V2_PALETTES`
      to the four themes. Keep only `b.dataset.theme/fontScale/fontFamily` (354–356).
- [ ] If dropping the picker, remove `V2_PALETTES` (56–61) and `activePalette()` (375–378).

**2.5 Reconcile V1 component dark overrides:** the `body[data-theme="dark"] .nav/.level-card/…`
rules (lines **734+, 1047+**) were compensating for the missing dark tokens. After 2.2, audit each
— most become redundant (the token block handles them). Remove the redundant ones; keep only
genuinely component-specific tweaks.

---

## Phase 3 — Arc colors (after the 7th color is chosen)

- [ ] `v2/app.js` line **44** `ARC_COLORS`:
      `['#2563eb','#0891b2','#7c3aed','#dc2626','#ea580c','#16a34a']`
      → `['#4257c9','#0e8fa0','#7c52cf','#cf5340','#d57e22','#2f9c6a', '<arc7>']`
- [ ] `v2/v2.css` lines **28–32**: replace `--v2-blue/teal/violet/green/amber` with
      `--arc-1 … --arc-7` (`design.md §7` values). Update consumers (`grep -n 'var(--v2-'`).
- [ ] Mosaic consumer at `v2/app.js` line **1126** picks up the new `ARC_COLORS` automatically.

---

## Phase 4 — Theme switcher + accessibility hooks

- [ ] `settings.html` lines **58–59**: extend the `name="theme"` control from `light/dark` to
      **light / dark / sepia / contrast** (4 radio/option values).
- [ ] **Reduce-motion (currently unwired):**
  - In both `applyAppearance()`s set `body.dataset.reduce = settings.reduceMotion ? '1' : ''`.
  - Add to `styles.css`: `body[data-reduce="1"] *,body[data-reduce="1"] *::before,body[data-reduce="1"] *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}`
  - Add a Motion toggle to `settings.html` with plain-language copy (`design.md §12`).
- [ ] **Text size:** confirm `data-fs="normal|large|xl"` (already set, line 62/355) has matching
      CSS scale rules; add if missing.

---

## Phase 5 — Purge hardcoded hex
Replace raw hex with `var(--token)`, file by file (after Phase 2 the tokens exist):
- [ ] `v2/v2.css` — 33 literals (highest count).
- [ ] `styles.css` — 17 literals outside `:root`/theme blocks.
- [ ] HTML with inline color: `index.html, chapter-1.html, settings.html, projects.html, for-educators.html, backend-console.html`.
- [ ] Any color with no token → add the token to `design.md` first, then use it.

---

## Phase 6 — QA matrix
- [ ] Every page **× 4 themes × 3 text sizes × reduce-motion on/off**. Pages: home, course,
      chapter-1..5, v2 app (dashboard/lessons/lesson/done/settings/notes/projects/gallery/adults),
      about, for-educators, assessment, my-path, playground, backend-console.
- [ ] Contrast: WCAG AA everywhere; high-contrast theme = AAA fallback; verify `--bw:2px` borders.
- [ ] Side-by-side vs the prototype screenshots in `…/screenshots/`.
- [ ] Confirm no flash of cool colors on load (JS injection fully removed).

## Phase 7 — Governance (stop drift)
- [ ] CI/lint gate: fail a build on raw hex in `*.css`/`*.html` outside `styles.css :root`, the
      theme blocks, and `design.md` (simple `grep -E '#[0-9a-fA-F]{6}'` allow-list, or stylelint
      `color-no-hex` with the token file allow-listed).
- [ ] PR rule: any styling change references `design.md`; no new color/font/radius without adding
      it to `design.md` in the same PR.

---

## Suggested PR sequence
| PR | Phases | Why first |
|---|---|---|
| **1** | 1 + 2 | Fonts + token refactor = the whole re-skin; highest impact. Ship behind a quick visual QA. |
| 2 | 3 | Arc colors (needs the 7th-color decision). |
| 3 | 4 | Sepia/contrast switcher + reduce-motion. |
| 4 | 5 | Hardcoded-hex cleanup. |
| 5 | 6 + 7 | QA pass + drift guard. |

**Biggest risk** is Phase 2.3/2.4 (removing JS color injection): if a theme block is missing a
token the page falls back to `:root` (light) for that token — so copy all 15 tokens into each
theme block. Lowest risk: Phase 1 (fonts) and Phase 3 (arc values).
