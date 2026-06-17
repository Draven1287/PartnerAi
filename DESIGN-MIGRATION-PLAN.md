# Design Migration Plan — port the app to the new design system

**Goal:** make the live app actually use the tokens in [`design.md`](./design.md), everywhere.
**Why this is needed:** the new design currently exists only inside the prototype HTML.
Production `styles.css` / `v2/v2.css` still carry the old cool-blue V1 palette.

**The good news (from the audit):** production `styles.css` already uses the **same token
names** as the prototype (`--bg`, `--surface`, `--accent`, `--text-dim`, …) — only the
*values* differ. So most of the visual change is a **value swap**, not a rewrite. Components
already reading `var(--accent)` will adopt the new look automatically.

---

## Scope (files that style the app)
- `styles.css` — V1 design system, 16 tokens, **light + dark only**. *(primary)*
- `v2/v2.css` — 6 tokens incl. 5 arc colors (`--v2-blue/teal/violet/green/amber`). *(primary)*
- `v2/app.js` — `applyAppearance()` theme switching; `settings.html` — theme UI.
- HTML with hardcoded hex to clean up: `index.html`, `v2/index.html`, `chapter-*.html`,
  `settings.html`, `projects.html`, `for-educators.html`, `backend-console.html`.

---

## Phase 0 — Setup
- [ ] Work on branch `design-system`; `design.md` is the source of truth.
- [ ] Snapshot current look (screenshots of each view, light/dark) for before/after.

## Phase 1 — Typography
- [ ] Add the Newsreader + Plus Jakarta Sans `<link>` (see `design.md §1`) to every page `<head>`.
- [ ] Base rules: `body → Plus Jakarta Sans`, `h1–h3 → Newsreader (500)`, `code → mono`.
- [ ] Remove the old `Inter` / `Georgia` font stacks from `styles.css`.

## Phase 2 — Color tokens (the high-impact swap)
- [ ] In `styles.css`, replace the **values** of the light/default tokens with `design.md §3 Light`.
      (Names already match — this alone re-skins most of the app.)
- [ ] Add `--bw` (currently absent).
- [ ] Replace the existing `[data-theme="dark"]` values with `design.md §3 Dark`.
- [ ] **Add** `[data-theme="sepia"]` and `[data-theme="contrast"]` blocks (currently missing).
- [ ] Keep layout tokens `--max-w`, `--wide-w`; drop the stray `--blue:#182235` (map usages to a token).

## Phase 3 — Arc colors (`v2/v2.css`)
- [ ] Replace the 5 `--v2-*` arc values with the 6 arc colors in `design.md §4`
      (rename to `--arc-1…--arc-6`, or keep names but update values **and add the 6th — Building #2f9c6a**).
- [ ] Verify the mosaic / progress bars pick up the new arc colors; keep `--painting-image`.

## Phase 4 — Theme switching
- [ ] Extend `applyAppearance()` (`v2/app.js`, and `script.js` if separate) to handle all four
      themes and persist to `learningai-settings`.
- [ ] Update the theme control in `settings.html` to offer **light / dark / sepia / high-contrast**.
- [ ] Add the `data-fs` (text size) and `data-reduce` (motion) hooks if not already wired.

## Phase 5 — Purge hardcoded colors
- [ ] Grep each HTML/CSS file for raw hex (`#[0-9a-f]{6}`) and replace with the right `var(--token)`.
      Priority: `index.html`, `chapter-1.html`, `settings.html`, `projects.html`,
      `for-educators.html`, `backend-console.html`.
- [ ] Anything that can't map to an existing token → add the token to `design.md` first.

## Phase 6 — QA
- [ ] Every view correct in **all 4 themes × 3 text sizes × reduce-motion on/off**.
- [ ] Contrast check (WCAG AA min; high-contrast = AAA fallback).
- [ ] Side-by-side against the prototype screenshots.

## Phase 7 — Governance (stop future drift)
- [ ] `design.md` is required reading for any styling PR.
- [ ] Add a CI/lint check that **fails on raw hex colors** outside `design.md` and the token
      definitions (simple grep gate, or a stylelint `color-no-hex` rule with the token file allow-listed).
- [ ] Rule: no new color/font/radius without adding it to `design.md` in the same PR.

---

## Suggested order & risk
| Phase | Effort | Visual impact | Risk |
|---|---|---|---|
| 1 Typography | S | High | Low |
| 2 Color tokens | M | **Highest** | Low (names align) |
| 3 Arc colors | S | Medium | Low |
| 4 Theme switching | M | Medium | Medium (JS + settings) |
| 5 Purge hardcoded | M | Cleanup | Low |
| 6 QA | M | — | — |
| 7 Governance | S | — | — |

**Recommended first PR:** Phases 1–3 (fonts + token values + arcs). That's where ~90% of
the "it finally looks like the redesign" comes from, and it's low-risk because the token
names already line up. Phases 4–7 follow as separate PRs.
