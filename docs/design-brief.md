# Design brief — LearningAI

Give this to a designer, or paste it into a design tool. It is written to be
used cold: everything needed to start is here, including the parts that usually
get discovered three rounds in.

---

## The product in one paragraph

**LearningAI** teaches ordinary people how to use AI without handing over their
judgment. Fifty lessons, in three parts, roughly fifteen minutes each. It is
free, it is live at **learningai4you.com**, and it was built by a fifteen-year-old
— Aarav — who is also its only maintainer. There is no team, no design system
team, no one to hand a spec to. Whatever you design, someone has to build alone.

---

## Who it is for — and the thing most briefs get wrong here

Written for **teenagers**. The examples are a biology test, a skateboard listing,
a message to a coach, a gran's birthday money.

But the reader who has taught us most is **Aarav's grandfather, in his seventies,
on a phone, at the largest text size.** He is not the target audience. He is the
person who finds everything: he said fifty lessons "made no sense", that the
dropdowns were incomprehensible, and he got stuck in a loop that three rounds of
automated checks had passed as fine.

Design for the teenager. **Test on the grandfather.** If it works for him it
works for everyone, and he is the reason several of the decisions below are not
negotiable.

---

## What already exists, and how good it is

The site works. It is not a prototype. Do not redesign what is not broken —
diagnose first, and say what you are leaving alone.

- 19 pages, 50 lessons, a real account system on Postgres, an admin console.
- A visual language that is genuinely distinctive: **warm paper photograph,
  frosted white glass, near-black ink, one gold accent, and huge light display
  type.** It is documented, accurately, in `docs/v3-design-spec.md`. **Read that
  before you draw anything.**
- An automated harness of ~1,800 checks runs on every change: target size,
  contrast, horizontal overflow at three widths and three text sizes, dead CSS
  rules, `[hidden]` being beaten by a display rule, routing truth tables.

That last point matters to you: **a design that breaks those cannot ship**, and
you will find out in about eight minutes rather than in review.

---

## The constraints. These are real, and two of them will surprise you.

**1. Content-Security-Policy is `'self'`. Nothing loads from another origin. Ever.**
No Google Fonts. No CDN. No icon library. No analytics pixel. No remote image.
Type is the system stack; icons are inline SVG; the only image is one local
photograph. A design that needs a webfont is not a design that can ship here.

**2. Every interactive target is at least 44×44px** — and where that would look
wrong, the hit area grows while a negative margin gives back the space, so the
text does not move. This is enforced.

**3. Text scales 14px→24px** and the page is *zoomed*, not reflowed. Your layout
must hold at 1.5×. Viewport units are not zoom-aware; this has broken the site
before.

**4. Three motion modes** — standard, reduced, **none**. Under "none" nothing
moves at all. Any animation you propose must have a still version that still
communicates.

**5. Backgrounds are a user setting.** Landscape photograph, plain paper, or
high-contrast solid. **No design may depend on the photograph being there.**

**6. Focus is always `outline: 3px solid #17231f`** with a 2–3px offset. Used in
32 places. Never removed.

**7. It must work offline-ish.** Lessons save locally and sync later. Anything you
design that reports success must be able to tell the truth when the network is
down. We have shipped a button that said "Saving to your account…" for ever;
never again.

---

## What we know is wrong

Diagnosed, evidenced, not yet solved. This is your brief, not a wish list.

1. **The lesson is the product, and it looks like a form.** Ten step types, each
   rendering as heading + prose + control. It is honest and it is dull. A learner
   spends ~95% of their time here.
2. **Fifty lessons still feels like fifty.** Three named parts helped. It has not
   made the course feel finishable.
3. **Progress is a number, not a feeling.** "4 of 50" is accurate and cold.
4. **The front door is four words.** *"Ready to learn the first lesson of this
   website?"* Yes / No. Brave, and possibly too little for a stranger to consent
   to.
5. **The finish of a lesson is flat.** A score, a one-line "arc law", a link on.
   Nothing marks that you did a thing.
6. **The glass is beautiful and it is everywhere.** When every surface is the
   signature material, nothing is emphasised. Ask what should *not* be glass.
7. **Densest screen in the course:** chapter 19 — six items, five categories,
   3,266px tall on a phone. Look at it before you propose anything.

---

## What to produce

In this order. Do not skip to the third.

**1. A diagnosis (1 page).** What is actually wrong, ranked, with evidence from
the live site. Name what is already good and should not be touched. If you think
this brief has misdiagnosed something, say so — that is more valuable than
agreement.

**2. Two or three directions (a screen each).** Not variations on a theme —
genuinely different bets, with the trade-off of each stated plainly. One should
be conservative: what is the smallest change that fixes the most?

**3. The chosen direction, in enough depth to build.**
- The lesson screen, in every state: unanswered, answered, right, wrong,
  part-answered, and the end of a lesson.
- The catalogue at all three parts.
- The dashboard.
- **Every one of those at 375px and at the largest text size.** Not an afterthought
  — the phone is where this is read.
- Empty, loading, error and offline states for anything you touch.
- Exact values: type scale, spacing scale, colours as hex, radii, motion timings
  with their "none" fallback.

Hand it over as something buildable by one person: real values, not vibes, and a
note on what to build first if only half gets done.

---

## How it will be judged

- **Would the grandfather get further than last time?** Above everything.
- **Does it survive the harness?** Targets, contrast, overflow at three widths ×
  three text sizes, motion modes.
- **Can one person build it?** A beautiful thing that takes three months is worse
  than a good thing that ships this month.
- **Does it still look like LearningAI?** The paper and glass are the identity.
  Change them if you can argue for it — but argue.
- **Is it honest?** This is a course about not surrendering your judgment to a
  machine. A design that manipulates, dark-patterns, gamifies attention, or
  overstates what was saved contradicts the thing being taught.

---

## Where to look

| | |
|---|---|
| Live | **learningai4you.com** |
| Design system, extracted from shipped CSS | `docs/v3-design-spec.md` |
| Pages | `learning-ai-design-assets/*.html` |
| The lesson engine | `learning-ai-design-assets/lesson.html` |
| The free first lesson (bespoke) | `learning-ai-design-assets/lesson-one.html` |
| Lesson content, 50 files | `lessons/chapter-N.mjs` |
| What must not break | `tools/check-invariants.mjs` |

Start on a phone, at the largest text size, as a stranger. Press **Yes**.
