# LearningAI V3 — what it actually looks like

Extracted from the shipped CSS in `learning-ai-design-assets/`, not from memory.
Every number below is a value that is really in the code and really on screen at
learningai4you.com. Where a value varies between pages the most common one is
given, with the range.

Hand this to a design tool instead of describing V3 in prose. The one-line
version: **warm paper photograph, frosted white glass floating on it, near-black
ink, one gold accent, and almost no colour anywhere else.**

---

## The hard constraint, first

The Content-Security-Policy is `'self'`. **Nothing loads from another origin —
ever.** No Google Fonts, no CDN, no icon library, no analytics script, no remote
image. A design that needs a webfont or an external asset cannot ship.

- Type is the system stack only: `-apple-system, "SF Pro Text", system-ui, sans-serif`
- Icons are inline SVG, 24×24 viewBox, `stroke="currentColor"`, `stroke-width="2"`
- The only image is one local photograph, below

---

## Background

One warm-grey paper photograph, fixed, behind every page:

```css
background: #efeee9 url("./learning-ai-paper-light-v1.jpg") center top/cover fixed no-repeat;
```

`#efeee9` is the fallback and the average tone: warm off-white, slightly green-grey.
The photograph is a soft mountain/terrace landscape, very low contrast — it reads
as texture, not as a picture. **It never competes with content.**

Settings lets a learner replace it with plain paper, or turn it off entirely for
high contrast, so no layout may depend on the photograph being there.

---

## Glass — the one signature move

Every panel, card and the navigation bar is the same frosted glass. This is the
whole visual identity; get it right and V3 is recognisable.

```css
border: 1px solid rgba(255,255,255,.78);          /* .78–.94 */
border-radius: 28px;                               /* large panels */
background: linear-gradient(145deg,
              rgba(255,255,255,.43),
              rgba(255,255,255,.10) 58%,
              rgba(218,226,226,.21));
box-shadow: inset 0 1px 1px white,                 /* top edge catches light */
            inset 0 -1px 0 rgba(30,34,33,.12),     /* bottom edge sits down */
            0 22px 70px rgba(40,42,39,.11);        /* wide, very soft drop */
backdrop-filter: blur(25px) saturate(1.6);
-webkit-backdrop-filter: blur(25px) saturate(1.6);
```

Four things make it read as glass rather than as a grey box:

1. **The gradient runs at 145°**, light at the top-left, falling to almost nothing
   at 58%, then picking up a cool grey-green tint at the bottom.
2. **The inset white top edge.** One pixel of pure white inside the top border.
   Without it the panel looks flat.
3. **`saturate()` above 1.** The blur alone greys the paper out; saturating pulls
   the warmth back through.
4. **The drop shadow is enormous and nearly invisible** — 70px blur at 11% opacity.
   It separates the panel from the paper without ever reading as a shadow.

Blur varies by how much the element should sit forward:

| element | blur | saturate |
|---|---|---|
| main panels | 25px | 1.6 |
| navigation bar | 26px | 1.16 |
| inner cards | 18px | 1.5 |
| the heaviest surfaces | 34px | 1.34 |

**Nested glass does not work.** A glass card inside a glass panel goes muddy. Inner
surfaces use a flat translucent white instead: `rgba(255,255,255,.27–.42)` with a
thin dark border, no backdrop-filter.

---

## Colour

Deliberately almost monochrome. Colour carries meaning; it is never decoration.

| token | value | use |
|---|---|---|
| ink | `#171816` / `#171a18` | all body text and headings |
| muted | `#62655e` | secondary text, captions |
| gold | `#a8843f` / `#9a7937` | the single accent — eyebrows, the logo mark, one rule |
| line | `rgba(44,44,38,.14)` | hairlines inside glass |

There is no blue, no brand palette, no gradient buttons. **Gold appears perhaps
twice per screen.** Where a chart or status genuinely needs more, the set is deep
green `#134634`, teal `#3d6c7c`, ochre `#7c5514`, brown `#543810`, dark red
`#702428` — all desaturated, all dark enough for white text.

Primary buttons invert: near-black fill `#1f2724`–`#26312d`, white text.

---

## Type

System stack, but pushed a long way from the defaults.

**Display headings** are the strongest signal in the design:

```css
font-size: clamp(48px, 7vw, 84px);
font-weight: 520;          /* NOT bold — barely above regular */
letter-spacing: -.055em;   /* very tight */
line-height: .95;          /* lines nearly touch */
```

That combination — huge, light, tight, cramped leading — is what makes the pages
look considered rather than templated. **A bold display heading breaks V3 instantly.**

| role | size | weight | tracking |
|---|---|---|---|
| display h1 | clamp(48px, 7vw, 84px) | 520 | −.055em |
| section h2 | 25–30px | 560–590 | −.04em |
| card h3 | 17–20px | 700 | −.02em |
| body | 15–17px, line-height 1.55 | 400 | 0 |
| eyebrow | 10–11px, uppercase | 750 | **+.18em** |
| status/meta | 11–12.5px | 620–740 | 0 |

The eyebrow is the counterweight: tiny, wide-tracked, uppercase, gold. Every major
section opens with one above its heading.

---

## Shape and spacing

Radii are large and consistent:

| | |
|---|---|
| pills, badges, scrollbars | `999px` |
| large panels | 28–32px |
| nav bar | 22px |
| cards | 17–18px |
| inputs, small buttons | 13–14px |

Page width is `min(1080–1180px, calc(100vw - 36px))`, dropping to
`calc(100vw - 20px)` below 820px. Panel padding 33–48px on desktop, 21–26px on
phones. Panels are separated by 18px — a tight, deliberate stack.

**820px is the single breakpoint.** Two columns above it, one below.

---

## Motion

Three modes, set on `<html data-motion>`, chosen in Settings and honoured everywhere:

- `standard` — transitions 160–520ms, `cubic-bezier(.2,.8,.2,1)`
- `reduced` — minimal
- `none` — **completely still**

Nothing may animate that does not check this. Movement is small: a 2px lift on
hover, a nav bar that eases away as you scroll. Nothing bounces or spins.

---

## Non-negotiables

These are enforced by an automated harness on every change, so a design that
breaks them cannot ship:

- **Every interactive target is at least 44×44px.** Where that would look wrong,
  the hit area grows and a negative margin gives back the space, so the text does
  not move.
- **Focus is always `outline: 3px solid #17231f`** with a 2–3px offset. Used in 32
  places; never removed.
- **Body text meets 4.5:1**, large text 3:1.
- **No horizontal scrolling** at 375px, 874px or 1280px, at any of the three text
  sizes — text can be set from 14px to 24px and the layout must hold.
- `[hidden]` must actually hide. Any rule that sets a `display` outranks it, which
  has caused real bugs; pages that hide things carry `[hidden]{display:none!important}`.

---

## What V3 is not

- Not flat, and not glassmorphism-as-decoration. The glass is the only effect.
- Not colourful. Ink, paper, one gold.
- Not bold. Display type is *light and huge*.
- Not dense. Long line-height, generous padding, few things per screen.
- Not animated. Motion is a courtesy, never a feature.
