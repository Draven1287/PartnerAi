# Learning AI — product, curriculum, and access brief

Status: implementation baseline, 17 July 2026

## The outcome

Learning AI helps people aged 13+ become capable of using AI without giving up judgment, authorship, privacy, or responsibility. The course is successful when a learner can decide what to delegate, describe the work clearly, question a polished output, verify consequential claims, revise the collaboration, and still explain what they decided themselves.

The product is not a catalogue of model features. It is a practice environment for human control.

## Evidence behind the learning model

- [OpenAI Academy](https://academy.openai.com/pages/courses) moves learners from foundations to applied workflows and agents. Its course descriptions emphasize clear instructions, useful context, output review, boundaries, and repeatable work.
- [Anthropic's AI Fluency Index](https://www.anthropic.com/research/AI-fluency-index) reports that iterative conversations contain substantially more fluency behaviours, while artifact-producing conversations show less questioning of reasoning and missing context. Learning AI therefore requires observable critique and verification, especially when an output looks finished.
- [Claude for Education](https://www.anthropic.com/news/introducing-claude-for-education) frames AI as a learning partner that should guide reasoning rather than simply produce answers.
- [Microsoft's AI Fluency pathway](https://learn.microsoft.com/en-us/training/paths/ai-fluency/) provides an accessible beginner route from basic concepts into generative AI.

These products establish useful foundations. Learning AI differentiates through a continuous 50-lesson control curriculum, explicit learner evidence, a premium practice experience, and a commercial model that never uses incomplete learning as pressure.

## Curriculum architecture

The source of truth is the repository's `lessons/_arcs.mjs` plus `lessons/chapter-1.mjs` through `lessons/chapter-50.mjs`. `tools/build-lessons.mjs` publishes the same objects to the browser bundle and backend seed, so a clean clone can reproduce the deployed curriculum.

| Arc | Lessons | Learner capability |
| --- | ---: | --- |
| First Contact | 1–5 | Replace hype with a usable mental model and first control rules |
| How It Works | 6–10 | Understand prediction, context, error, tools, and model differences |
| Talking to AI | 11–15 | Describe goals, context, constraints, formats, and follow-ups |
| Trust & Everyday AI | 16–20 | Verify claims, recognize uncertainty, and choose appropriate reliance |
| Prompting Craft | 21–25 | Repair prompts, compare approaches, and build reusable patterns |
| Judgment & Safety | 26–30 | Protect privacy, notice bias, set boundaries, and retain approval |
| AI & Being Human | 31–35 | Preserve voice, skill, honesty, relationships, and responsibility |
| AI for Real Life | 36–40 | Apply control to study, work, health, money, travel, and decisions |
| Building with AI | 41–45 | Turn prompts into reviewed workflows, projects, and useful tools |
| Becoming a Builder | 46–50 | Design permissions, evaluate systems, complete a capstone, and teach others |

Every lesson keeps its stable `chapter-N` identity and contains:

1. A concrete cold open.
2. A plain-language mental model or contrast.
3. At least two meaningful learner actions before completion.
4. Feedback that explains consequences rather than merely marking correctness.
5. An `exitCheck` that transfers the idea to a fresh case.
6. Optional Saved Notes where useful; saving never controls Next.

`tryLive` and `verify` require a short evidence record before Next unlocks. Direct URLs cannot bypass an unreached gate. Completion is evidence of practice, not evidence that a learner clicked through.

## Proof sequence

Build and validate two lessons before broad visual rollout:

- Chapter 1, **The Machine That Predicts**, proves onboarding, prediction, retry-safe classification, live practice evidence, optional notes, and a fresh exit check.
- Chapter 7, **Confidently Wrong**, proves uncertainty, independent verification, a high-stakes trust boundary, and learner-owned evidence.

Both must pass keyboard, mobile, reduced-motion, persistence, API, and deep-link tests before the shared lesson shell is expanded.

## Product architecture

```text
Authoritative chapter modules
        ↓ build
Browser lesson bundle ─── Backend curriculum seed
        ↓                         ↓
Learner shell ← authenticated curriculum/progress API → PostgreSQL
        ↓                         ↓
Visible gates, feedback, notes    progress, evidence, audit records
```

The browser remains usable and understandable at every state. The server owns accounts, published curriculum, progress, evidence, and audit history. The frontend owns presentation and short-lived interaction state. Local persistence is a recovery layer, not a second source of truth.

## Premium experience principles

Premium is a behaviour standard:

- Editorial confidence: strong hierarchy, disciplined type, quiet space, and purposeful asymmetry.
- Learner as protagonist: AI appears as material to inspect, never as a magical character.
- Motion explains causality: a transition shows what changed, what was earned, or where the learner is going.
- Progress becomes an authored image: fifty lesson states resolve one coherent artwork without points, streak pressure, or confetti.
- Dark proof moments are rare and meaningful; the default system remains calm, readable, and adaptable.
- No black-and-gold luxury shorthand, celestial spectacle, glassmorphism, card grids everywhere, or decorative perpetual motion.

The approved product direction uses cool paper, deep ink, a restrained signal red, fine rules, Avenir/Helvetica-led reading typography, monospaced evidence labels, and controlled arc colours. It should feel closer to a contemporary architecture publication or museum experience than a generic learning dashboard.

## Motion grammar

- Chapter opening: one masked editorial reveal establishes question, lesson number, and learner state.
- Step transition: outgoing evidence compresses into the progress rail; the next step enters from the same spatial origin.
- Gate completion: the locked control changes weight and wording before it becomes actionable.
- Progress artwork: only the newly earned tile resolves; the whole work does not flash or celebrate noisily.
- Scroll: narrative reveals may use position and opacity, never scroll-jacking.
- Reduced motion: remove translation, parallax, and easing sequences while preserving order, state, and feedback.

## Access and commercial model

### Core 50 — free at launch

All 50 lessons, their interactions, feedback, exit checks, accessibility alternatives, and learner-owned records are free. There is no trial boundary, lesson paywall, subscription interruption, or purchase required to finish the course.

Accounts exist only to carry progress between devices. A learner's ability to continue is never tied to a payment state.

### Optional future support — deferred

Do not design or promise a paid offer for launch. A later voluntary donation, sponsor-supported program, or genuinely separate service may be considered only after the free course is stable and the team can explain the added value without restricting the Core 50.

Any later commercial invitation must remain outside lesson gates, feedback, exit checks, locked-next states, and completion records. Ending payment must never remove completed work or free course access.

## Age, trust, and safety

- Minimum intended age is 13; avoid collecting more personal data than account and learning continuity require.
- The questionnaire must not invite under-13 participation. Ages 13–17 should receive plain-language guidance to involve a trusted adult when an activity opens an outside AI service, especially for school rules, privacy, health, money, or safety.
- Before public promotion to minors, obtain an owner-approved privacy/terms review covering accounts, analytics, open-ended evidence, Saved Notes, deletion, and the external-AI practice model. This product requirement is not a substitute for legal advice.
- Use non-private examples by default and label high-stakes topics clearly.
- Never imply that model fluency proves truth, consciousness, or authority.
- Health, legal, financial, and safety decisions require outside verification and appropriate qualified help.
- Privacy, attribution, and human approval are practiced behaviours throughout the course, not a single compliance lesson.

## Release gates

- Exactly 50 published lessons across 10 arcs; no stubs or duplicate IDs.
- At least two pre-exit learner actions and one `exitCheck` in every lesson.
- Saved Notes remains optional.
- Deep links cannot skip unreached gates.
- Visible focus, semantic labels, 44px targets, non-colour state cues, reduced-motion parity, forced-colour resilience, and usable 200% zoom.
- No horizontal overflow at 390, 768, 1024, or 1440 CSS pixels.
- Chapter 1 and Chapter 7 complete end-to-end against the live backend.
- PostgreSQL persistence, account separation, CSRF, CORS, session security, and curriculum versioning verified.
- Railway frontend, backend, database, health checks, domains, and rollback verified before removing `noindex`.

## Immediate sequence

1. **Complete:** lock the 50-lesson source snapshot and reproducible browser/backend build.
2. **Complete:** produce the separate OpenDesign Phase 2 product proof and implementation mapping.
3. **Complete:** implement the premium shared shell plus Chapter 1 and Chapter 7.
4. **Complete locally:** browser-test locked gates, evidence persistence across refresh, optional notes, deep-link clamping, completion, mobile layout, and the permanent-access page.
5. **Complete:** expand to all 10 arcs and run structural plus content-quality audits across all 50 lessons with no failures or warnings.
6. **Complete for launch:** the Core 50 is fully free; dormant provider-neutral entitlement tables remain internal and no payment-provider handoff is exposed or required.
7. **Next:** deploy the frontend, backend, and PostgreSQL in one Railway project and verify generated domains before DNS changes.
8. **Final:** run production accessibility/security/rollback checks, then remove `noindex` only after the public product and API pass.
