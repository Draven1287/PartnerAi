# Learning AI — Design System (`design.md`)

**Status:** canonical source of truth for the Learning AI visual system.
**Origin:** extracted verbatim from the Claude Design redesign prototype
(`Learning AI V2 - Redesign.dc.html` / standalone) and `Brand Identity.dc.html`.
If a value here and a value in code disagree, **this file wins.**

> **Governance:** no raw color / font / radius / shadow literals in components —
> everything references a token or pattern defined here. New value → add it here first.
> Migration status & steps live in [`DESIGN-MIGRATION-PLAN.md`](./DESIGN-MIGRATION-PLAN.md).

---

## 0. Brand foundation

**Essence:** *warm, human, a little academic, and quietly premium.* "Warm and grounded,
never neon — everything else is paper and ink." Editorial serif + clean sans.

**Tagline:** *Learn to use AI without letting it think for you.*

**Voice & tone:**
- **Clear over clever** — short words, real examples. If a sentence needs re-reading, cut it.
- **Honest about AI, no hype** — "a confident answer can still be wrong."
- **Warm, not corporate** — talk like a sharp friend, not a brand.
- **You stay in charge** — every lesson points back to the learner's judgment, never the tool's.
- **Lesson voice is student-first** (concrete, second-person, scene-based). Breadth for
  adults/educators lives in framing pages (About/Teaching), not in lesson copy. Do not flatten.

---

## 1. Typography

| Role | Family | Weight |
|---|---|---|
| **Display / editorial** | `"Newsreader", Georgia, serif` | 500 |
| **UI / body** | `"Plus Jakarta Sans", system-ui, sans-serif` | 400 / 500 / 600 / 700 |
| **Mono** | `ui-monospace, "SF Mono", Menlo, monospace` | — |

**Load in every `<head>`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap">
```

### Type scale (observed values → named roles)
| Role | Size | Family / weight | Use |
|---|---|---|---|
| Display | `clamp(30px, 5vw, 50px)` | Newsreader 500, `letter-spacing:-.02em` | Hero |
| Page title (h1) | `26px` (up to 40px on marketing) | Newsreader 500 | Screen titles |
| Section (h2) | `24px` | Newsreader 500 | Section heads |
| Subsection (h3) | `20–22px` | Newsreader 500 | Card titles |
| Lead | `17–18px` | Plus Jakarta 400 | Intros |
| **Body (base)** | `15px` | Plus Jakarta 400, line-height ~1.55 | Default UI/body |
| Body small | `13.5–14px` | Plus Jakarta 400/600 | Dense UI, chips |
| Caption / meta | `12–13px` | Plus Jakarta 600 | Labels, hints |
| Overline / micro | `10.5–11px` | Plus Jakarta 700, `text-transform:uppercase`, `letter-spacing:.1–.14em` | Kickers, tags |

Headings use weight **500** (the serif carries personality, so it stays light).
Buttons/labels **600**; overlines/brand **700**.

---

## 2. Semantic color tokens (15)

The only color tokens components may use. Always semantic, never a raw value.

| Token | Purpose |
|---|---|
| `--bw` | Base border width (`1px`; `2px` in high-contrast). |
| `--bg` | Page background. |
| `--surface` | Card / panel background. |
| `--surface-2` | Inset/secondary surface (inputs, wells, chips). |
| `--border` | Hairlines, dividers. |
| `--text` | Primary text. |
| `--text-dim` | Secondary text. |
| `--text-faint` | Tertiary text, placeholders, overlines. |
| `--accent` | Primary brand accent (links, primary buttons, active). |
| `--accent-dim` | Hover/active accent. |
| `--accent-soft` | Accent tint (selected bg, focus ring). |
| `--good` | Success / correct. |
| `--bad` | Error / incorrect. |
| `--on-accent` | Text/icons on an `--accent` fill. |
| `--shadow` | Shadow color. |

---

## 3. Themes (4)

Applied via `data-theme="light|dark|sepia|contrast"` on the root element. **Light is default.**

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

For arc chips, the progress mosaic, and progress bars — **as accents only, never full surfaces.**
Suggested tokens `--arc-1 … --arc-6` (theme-independent).

| # | Arc | Color |
|---|---|---|
| 1 | Orientation | `#4257c9` |
| 2 | Understanding | `#0e8fa0` |
| 3 | Conversation | `#7c52cf` |
| 4 | Judgment & Safety | `#cf5340` |
| 5 | Applying | `#d57e22` |
| 6 | Building | `#2f9c6a` |

---

## 5. Spacing scale

Observed rhythm (px): **2 · 6 · 8 · 10 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 28 · 30 · 32 · 34**.
Common gaps: `6` (tight stacks), `8` (chips/buttons/grid), `12` (lists/bars), `24–34` (sections).
Recommend tokenizing as `--sp-1:4 … --sp-8:32`.

---

## 6. Radius scale

| Token (suggested) | Value | Use |
|---|---|---|
| `--r-sm` | `8px` | small controls, tags |
| `--r-md` | `11–12px` | inputs, buttons |
| `--r-lg` | `16px` | compact cards |
| `--r-xl` | `20–22px` | cards, mosaic hero |
| `--r-pill` | `999px` | chips, segmented control |
| circle | `50%` | dots, toggle knob, avatars |

---

## 7. Elevation (shadow scale)

All shadows use `var(--shadow)` for color (except accent glows).

| Token (suggested) | Value | Use |
|---|---|---|
| `--sh-xs` | `0 1px 4px var(--shadow)` | subtle lift |
| `--sh-sm` | `0 8px 22px var(--shadow)` | popovers, raised |
| `--sh-md` | `0 16px 44px var(--shadow)` | cards |
| `--sh-lg` | `0 18px 50px var(--shadow)` | hero cards, mosaic |
| `--sh-xl` | `0 22px 60px var(--shadow)` | modals |
| focus ring | `0 0 0 3px var(--accent-soft)` (6px for large) | keyboard focus, selected |
| accent lift | `0 4px 14px var(--accent-soft)` | primary button hover |

---

## 8. Motion

| Kind | Duration | Notes |
|---|---|---|
| Micro (hover/press) | `.15s` | `transition: all .15s` on buttons/tabs/chips |
| Standard (color/shadow) | `.2s` | `border-color .2s, background .2s` |
| Toggle knob | `.18s` | `transform .18s` |
| Progress fill | `.35–.5s ease` | `transition: width .35s ease` |

**Easing vocabulary** (from `animations.jsx`): `easeOutCubic` (default out), `easeInOutCubic`
(default in-out), `easeOutBack` (playful overshoot — unlock/tile pops), `easeOutExpo`,
`easeOutElastic` (special moments), `easeInQuad` (exits).

**Named keyframes:**
- `tilein` — a mosaic tile completing (`scale(.7)→1.12→1`, saturate up). 
- `unlockpop` — the "Next" button unlocking (`scale(.92)→1.07→1`).
- `pulse` — attention ring using `var(--arc)` (`box-shadow 0→9px transparent`).
- `shake` — invalid input.
- `agepulse` — age-range field prompt.

**Reduce motion:** `data-reduce="1"` on root disables animations/transitions.

---

## 9. Responsive breakpoints
Max-width breakpoints used: **560 · 600 · 680 · 800 · 880 px**. Recommend consolidating to two
canonical stops — **`≤560px` (mobile)** and **`≤880px` (tablet/narrow)** — during the migration.

---

## 10. Component primitives

All values below are from the prototype; they compose entirely from the tokens above.

### Buttons
```css
.btn         { display:inline-flex; align-items:center; gap:8px; padding:13px 22px;
               border-radius:12px; font-size:15px; font-weight:600;
               border:var(--bw) solid transparent; transition:all .15s; cursor:pointer; }
.btn-primary { background:var(--accent); color:var(--on-accent); }
.btn-primary:hover { background:var(--accent-dim); }            /* + accent lift shadow */
.btn-ghost   { background:transparent; color:var(--text); border-color:var(--border); }
.btn-ghost:hover { border-color:var(--text-dim); background:var(--surface); }
.btn-locked  { background:var(--surface-2); color:var(--text-faint);
               border:var(--bw) dashed var(--border); cursor:not-allowed; }  /* gated "Next" */
```

### Cards
```css
.card          { background:var(--surface); border:var(--bw) solid var(--border);
                 border-radius:20px; padding:30px 32px; box-shadow:0 18px 50px var(--shadow); }
.card.compact  { padding:22px; border-radius:16px; }
```

### Inputs / select / textarea
```css
input, .field select, select, textarea {
  padding:12px 14px; border:var(--bw) solid var(--border); border-radius:11px;
  background:var(--surface-2); color:var(--text); font-size:15px; width:100%; }
/* visible-affordance variant gets a stronger border + inset shadow: */
textarea, select { border-color:color-mix(in srgb,var(--text-faint) 58%,var(--border));
  box-shadow:inset 0 1px 2px color-mix(in srgb,var(--text) 8%,transparent); }
.field      { display:grid; gap:6px; }
.field span { font-size:13px; font-weight:600; color:var(--text-dim); }   /* field label */
```

### Chips (selectable)
```css
.chip { border:var(--bw) solid var(--border); background:var(--surface-2); color:var(--text);
        padding:9px 16px; border-radius:999px; font-size:13.5px; font-weight:600;
        min-height:40px; display:inline-flex; align-items:center; justify-content:center;
        transition:all .15s; cursor:pointer; }
.chip.selected { border-color:var(--accent); background:var(--accent-soft); color:var(--accent); }
```

### Tabs / nav
```css
.tabs   { display:flex; gap:2px; flex-wrap:wrap; }
.tab    { border:0; background:transparent; color:var(--text-dim); font-size:14px;
          font-weight:600; padding:8px 13px; border-radius:9px; transition:all .15s; }
.tab:hover { color:var(--text); background:var(--surface-2); }
.tab.on    { color:var(--accent); background:var(--accent-soft); }
.nav    { display:flex; justify-content:space-between; gap:12px; margin-top:24px; flex-wrap:wrap; }
```

### Segmented control / toggle
```css
.seg   { display:inline-flex; background:var(--surface-2); border:var(--bw) solid var(--border);
         border-radius:999px; padding:3px; gap:2px; }
.switch .knob { width:21px; height:21px; border-radius:50%; background:#fff;
         box-shadow:0 1px 3px rgba(0,0,0,.3); transition:transform .18s; }  /* on: translateX(19px) */
```

### Callout
```css
.callout { border:var(--bw) solid var(--border); border-left:3px solid var(--accent);
           background:var(--surface-2); border-radius:10px; padding:13px 16px;
           font-size:15px; line-height:1.55; }
```

### Labels — kicker / tag / overline
```css
.kicker { font-size:11px; letter-spacing:.14em; text-transform:uppercase;
          color:var(--text-faint); font-weight:700; }
.tag    { font-size:11px; letter-spacing:.1em;  text-transform:uppercase;
          color:var(--accent); font-weight:700; }
.ctrl > label { font-size:10.5px; letter-spacing:.1em; text-transform:uppercase;
          color:var(--text-faint); font-weight:700; }
```

### Progress bars
```css
.arc-bars { display:grid; gap:12px; }
.arc-bar .top { display:flex; justify-content:space-between; font-size:13.5px; font-weight:600; }
.fill { height:100%; background:var(--accent); transition:width .35s ease; }  /* use --arc-N per arc */
```

### Selection dot (radio/checkbox)
```css
.dot { width:20px; height:20px; border-radius:50%; border:2px solid var(--border);
       display:grid; place-items:center; }            /* selected → border/fill var(--accent) */
```

### Progress mosaic (centerpiece)
```css
.mos-hero { background:var(--surface); border:var(--bw) solid var(--border);
            border-radius:22px; padding:28px 30px; box-shadow:0 18px 50px var(--shadow); }
.mos      { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }   /* 6×5 = 30 tiles */
/* tile completes with @keyframes tilein; fills with its arc color (--arc-N). */
```
Three fill styles (Settings → mosaic style): **Arc** (tile = arc color), **Reveal** (uncovers
`v2/sunrise-progress.png`), **Hybrid**. Unfilled tiles: `--surface-2` with faint arc-tinted border.

### Brand mark
```css
.brand       { display:flex; align-items:center; gap:10px; font-weight:700;
               letter-spacing:-.01em; font-size:16px; }
.brand .spark{ width:28px; height:28px; border-radius:9px; display:grid; place-items:center;
               background:linear-gradient(150deg,#f4b66a,#d98a6a); color:#2b2350; }
```
Logomark concept = a small **mosaic grid coming into focus** (the progress metaphor), not a sun glyph.

---

## 11. Accessibility
- **Themes:** every token pair meets WCAG AA in all four themes; high-contrast (`--bw:2px`,
  pure black/white) is the AAA fallback.
- **Text size:** `data-fs="normal|large|xl"` on root scales type.
- **Reduce motion:** `data-reduce="1"` disables animation.
- **Hit targets** ≥ 44px (chips already set `min-height:40px` + padding); visible focus rings
  (`0 0 0 3px var(--accent-soft)`) in every theme; keyboard operable on gated controls.

---

## 12. Do / Don't
- ✅ `color:var(--text-dim)`  ❌ `color:#5d5749`
- ✅ `background:var(--surface)`  ❌ `background:#fffdf8`
- ✅ `.btn .btn-primary` for actions  ❌ a one-off styled `<button>`
- ✅ arc color on a chip/bar/tile  ❌ arc color as a page/section background
- ✅ add a value to this file first, then use the token  ❌ introduce a stray hex/size in a component
