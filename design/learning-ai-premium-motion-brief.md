# Learning AI — premium product and lesson-motion brief

## The job

Design a working, responsive Learning AI product for learners aged 13 and older. It must feel unusually considered, intelligent, and premium without borrowing the surface language of yachts, watches, luxury hotels, or the current Learning AI interface. The product teaches people to work with AI while retaining judgment, agency, evidence, and responsibility.

This is not a moodboard exercise. Produce an interactive product proof that makes the learning model understandable through use.

## Source material

Read these files before designing:

- `design/learning-ai-premium-motion-concept.html` — working motion and lesson-architecture prototype.
- `v2/lessons.js` — authoritative 50-lesson curriculum and lesson IDs.
- `v2/app.js` — current product behaviors and routes; preserve useful requirements, not its appearance.
- `v2/v2.css` — negative visual reference. Audit it, but do not inherit its look.
- `tools/audit-lesson-quality.mjs` — current curriculum quality rules.

Do not invent or rename the 50 lessons unless a proposed change is explicitly listed as an editorial recommendation. Preserve stable `chapter-N` IDs.

## Product thesis

**Keep your judgment. Expand what you can do.**

AI should never be the hero of the interface. The learner's question, decision, evidence, and growing capability are the hero. Every major interaction should make one of those things more visible.

The emotional sequence is:

1. I am curious.
2. I can predict what might happen.
3. I can inspect what actually happened.
4. I can decide what to keep, revise, or reject.
5. I can explain what remains mine.

## Audience

- Primary: curious learners aged 13–18 who already encounter AI in school, creativity, search, and daily life.
- Also usable by adults without changing the visual language.
- Never childish, gamified through points, patronizing, fear-driven, or written as corporate compliance training.
- Use plain, precise language. Prefer one consequential question over a wall of explanatory copy.

## What premium means here

Premium is not black plus gold. It is:

- editorial confidence and disciplined hierarchy;
- generous but intentional space;
- typography with a clear reading rhythm;
- motion that reveals cause and effect;
- materials that feel tactile without becoming skeuomorphic;
- precise states, transitions, focus treatment, and responsive behavior;
- a calm composition that can hold one surprising spatial gesture at a time;
- evidence of craft in the smallest interaction.

Avoid:

- celestial horizons, planets, yacht imagery, gold glows, watch-advertising tropes;
- glassmorphism, excessive gradients, floating generic cards, dashboard bento clutter;
- decorative autoplay, scroll-jacking, constant parallax, or motion without meaning;
- generic SaaS sidebars and a row of identical statistic boxes;
- copying either the existing product or any individual reference site.

## Lesson architecture — use this across all 50 lessons

Every lesson follows a five-stage agency sequence. The stages may use different compositions and interaction types, but the learning contract stays stable.

### 1. Frame

Begin with a situation or decision the learner recognizes. Ask for a prediction, first move, ranking, or choice before explaining the concept. The learner commits to an initial position.

### 2. Understand

Reveal the mechanism in layers. Use an annotated response, comparison, scrubber, controlled reveal, or cause-and-effect diagram. The learner should be able to point to what changed and why.

### 3. Practice

The learner performs the skill. AI may generate options or feedback, but the learner must question, verify, revise, classify, or decide. At least two meaningful learner actions are required before completion.

### 4. Capture

Record a small piece of evidence: a rule, observation, repaired prompt, source check, decision, or reusable workflow. Saving to notes is helpful but must never block Next.

### 5. Prove

Use a short `exitCheck` that demonstrates transfer, not recall. Completion should state the capability earned in plain language: “You can now…” The lesson unlocks only after the required learning actions and exit check.

## Motion grammar

Motion is a teaching material. Use it to show continuity, agency, causality, and progress.

- **Micro response — 160–240 ms:** hover, press, focus, selection, validation.
- **Meaning reveal — 360–480 ms:** annotation, comparison, evidence layer, answer consequence.
- **Scene transition — 560–720 ms:** move between lesson stages or major product spaces.
- Prefer transform and opacity. Keep text readable during transitions.
- A learner action should trigger the important movement. Do not run an endless ambient show.
- Preserve spatial continuity: the chosen object can become the next scene’s evidence or anchor.
- Progress artwork should resolve because a learner demonstrates capability, not because time passed.
- Support `prefers-reduced-motion` and a visible Reduce motion control. Reduced motion must preserve all information and sequence.
- Avoid full-page masks or effects that hurt performance on an ordinary school laptop or phone.

## Signature interactions to design

1. **The next decision:** the dashboard leads with one consequential question and a calm Continue action, not a wall of course metrics.
2. **The working proof:** the learner’s prediction transforms into an inspectable AI response; annotations enter only when requested.
3. **The decision record:** visibly separate “You bring,” “AI helps,” and “You keep.” Let the learner edit the boundary.
4. **The 50-state field:** one state per lesson; states reveal a larger composition over time without turning into collectible-game tiles.
5. **Transfer moment:** lesson completion converts the learner’s evidence into a reusable rule or workflow.
6. **Journey transition:** moving between the 10 arcs should feel like changing scale or perspective, not switching tabs in admin software.

## Required product proof

Create a responsive interactive HTML prototype with real content from the curriculum. It must include:

1. Public landing page with one clear thesis and a free sample lesson.
2. Account welcome/sign-in that feels part of the same product, with humane error copy.
3. Today/dashboard with “next decision,” current proof, and 50-state progress field.
4. Journey/catalog showing all 10 arcs and 50 real lessons without overwhelming a 13-year-old.
5. One representative lesson showing Frame → Understand → Practice → Capture → Prove.
6. Completion/decision-record view.
7. Access/pricing view.
8. Settings/accessibility view, including reduced motion, contrast, and text-size options.

## Access and commercial boundary

- Do not interrupt a lesson with payment.
- Never make a learner repeatedly pay to continue a coherent 50-lesson path.
- The product may begin with a genuinely useful free sample or first arc.
- If the Core 50 is sold, present it as one clear purchase with permanent access to that edition, progress, and completed lesson records.
- A separate optional membership may fund new lessons, live studios, community, or ongoing updates. It must not hold already-purchased Core 50 lessons hostage.
- Keep purchase decisions outside the learning flow.

## Curriculum constraints

- Exactly 10 arcs × 5 lessons = 50 lessons.
- Preserve the existing authored voice and stable `chapter-N` IDs.
- Each lesson needs at least two gated learning actions plus an `exitCheck`.
- `toolkitSave` and Saved Notes are optional reinforcement, never a gate.
- Each lesson must name the learner capability, evidence produced, likely misconception, and transfer context.
- Vary interaction rhythm across the curriculum; do not repeat one card template 50 times.

## Deliverables

Create a new file named `learning-ai-motion-product-proof.html`; do not overwrite the current strategy or product artifacts.

Also provide:

- a compact design-system and motion-spec section inside the proof;
- an interaction map tying every motion to a learning purpose;
- a responsive phone state and reduced-motion state;
- a concise critique identifying what remains generic, decorative, inaccessible, or unproven;
- verification notes for keyboard navigation, focus, mobile overflow, reduced motion, and the representative lesson’s gates.

The result should be original enough that removing the Learning AI name would not make it look like a luxury-template demo or a generic education dashboard.
