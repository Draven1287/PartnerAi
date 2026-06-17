# Learning AI — Design System (`design.md`)

**Status:** canonical source of truth for the Learning AI visual system.
**Origin:** extracted verbatim from the Claude Design redesign prototype
(`Learning AI V2 - Redesign.dc.html`). If a value here and a value in code ever
disagree, **this file wins** — fix the code, then keep this file updated.

> Governance rule: **no raw color, font, or radius literals in components.**
> Everything references a token defined here. New value → add it here first.

---

## 1. Typography

| Role | Family stack | Weights | Notes |
|---|---|---|---|
| **Display / editorial** | `"Newsreader", Georgia, serif` | 500 (default), 400, 600 | Headings, hero copy. `letter-spacing: -0.02em` on large sizes. |
| **UI / body** | `"Plus Jakarta Sans", system-ui, sans-serif` | 400, 500, 600, 700 | All UI text, buttons, labels, body. |
| **Mono** | `ui-monospace, "SF Mono", Menlo, monospace` | — | Code, prompts, token chips. |

**Font loading** (put in every page `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap">
```

**Reference sizes** (from prototype): h1 = `40px` Newsreader 500, `letter-spacing:-.02em`.
**Text-size scaling:** controlled by `data-fs="normal|large|xl"` on the root element.

---

## 2. Semantic color tokens (15)

These are the only color tokens components may use. Meaning is **semantic**, not literal —
e.g. always `var(--text-dim)` for secondary text, never a raw grey.

| Token | Purpose |
|---|---|
| `--bw` | Base border width (`1px`; `2px` in high-contrast). |
| `--bg` | Page background. |
| `--surface` | Card / panel background. |
| `--surface-2` | Secondary/inset surface (wells, unfilled tiles). |
| `--border` | Hairline borders, dividers. |
| `--text` | Primary text. |
| `--text-dim` | Secondary text. |
| `--text-faint` | Tertiary text, hints, placeholders. |
| `--accent` | Primary brand accent (links, primary buttons). |
| `--accent-dim` | Hover/active accent. |
| `--accent-soft` | Accent tint backgrounds (selected states). |
| `--good` | Success / correct. |
| `--bad` | Error / incorrect. |
| `--on-accent` | Text/icons placed on an `--accent` fill. |
| `--shadow` | Shadow color (used in `box-shadow`). |

---

## 3. Themes (4)

Applied via `data-theme="light|dark|sepia|contrast"` on the root element.
**Light is the default.** Full values:

### Light (default)
```css
--bw:1px;
--bg:#f6f3ea; --surface:#fffdf8; --surface-2:#efe8d8; --border:#e4dcc9;
--text:#211f1a; --text-dim:#5d5749; --text-faint:#8c8573;
--accent:#3a3aa3; --accent-dim:#2c2c84; --accent-soft:rgba(58,58,163,.10);
--good:#1f8a5b; --bad:#c2414b; --on-accent:#fff; --shadow:rgba(40,33,20,.08);
```

### Dark
```css
--bw:1px;
--bg:#16140f; --surface:#211e18; --surface-2:#2b271f; --border:#3a352b;
--text:#f3efe6; --text-dim:#b3ab9a; --text-faint:#857e6e;
--accent:#a6a4f2; --accent-dim:#bcbaf6; --accent-soft:rgba(166,164,242,.16);
--good:#4cc38a; --bad:#f0808a; --on-accent:#16140f; --shadow:rgba(0,0,0,.45);
```

### Sepia
```css
--bw:1px;
--bg:#efe2c8; --surface:#f8efd8; --surface-2:#e6d6b6; --border:#d3c09a;
--text:#3f3320; --text-dim:#6e5d3e; --text-faint:#9a8861;
--accent:#8a5a23; --accent-dim:#6f4719; --accent-soft:rgba(138,90,35,.13);
--good:#5a7d3a; --bad:#b5462f; --on-accent:#fff; --shadow:rgba(80,55,20,.13);
```

### High-contrast
```css
--bw:2px;
--bg:#000; --surface:#0c0c0c; --surface-2:#1a1a1a; --border:#ffffff;
--text:#ffffff; --text-dim:#ededed; --text-faint:#c4c4c4;
--accent:#8fb0ff; --accent-dim:#b3c8ff; --accent-soft:rgba(143,176,255,.22);
--good:#3ff08f; --bad:#ff7b85; --on-accent:#000; --shadow:rgba(0,0,0,.6);
```

---

## 4. Arc identity colors (6)

Used for arc chips, the progress mosaic, and progress bars — **as accents only, never as full surfaces.**

| # | Arc | Color |
|---|---|---|
| 1 | Orientation | `#4257c9` |
| 2 | Understanding | `#0e8fa0` |
| 3 | Conversation | `#7c52cf` |
| 4 | Judgment & Safety | `#cf5340` |
| 5 | Applying | `#d57e22` |
| 6 | Building | `#2f9c6a` |

Recommended token names: `--arc-1` … `--arc-6` (theme-independent).

---

## 5. Shape, elevation, spacing

- **Border width:** `var(--bw)` (1px; 2px high-contrast).
- **Radius:** prototype uses small radii (`6–8px`) for controls; cards larger. **To formalize**
  as `--r-sm: 8px`, `--r-md: 12px`, `--r-lg: 16px` during the migration (confirm against prototype).
- **Shadow:** `box-shadow: 0 1px 2px var(--shadow)` style; color always `var(--shadow)`.
- **Layout widths (existing, keep):** `--max-w: 720px`, `--wide-w: 1080px`.

---

## 6. Motion & accessibility

- **Reduce motion:** `data-reduce="1"` on root disables animations/transitions.
- **Contrast:** every token pair must meet WCAG AA in all four themes; the high-contrast
  theme is the AAA fallback (`--bw:2px`, pure black/white).
- **Hit targets:** ≥ 44px. Focus states visible in all themes.

---

## 7. How theming is wired
- A single root attribute `data-theme` selects the theme; `data-fs` selects text size;
  `data-reduce` toggles motion.
- The app's `applyAppearance()` reads/writes `learningai-settings` and sets these attributes.
  It **must** support all four themes (today it ships light + dark only — see migration plan).

---

## 8. Do / Don't
- ✅ `color: var(--text-dim)` ❌ `color: #5d5749`
- ✅ `background: var(--surface)` ❌ `background: #fffdf8`
- ✅ arc color for a chip/bar ❌ arc color as a page/section background
- ✅ add a new value here first, then use the token ❌ introduce a one-off hex in a component
