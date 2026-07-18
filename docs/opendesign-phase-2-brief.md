# OpenDesign Phase 2 commission

Create the production product design, not another strategy report.

Use `/Users/Aaravshah/Documents/public/learning-ai-50-lesson-production-plan.html` and `/Users/Aaravshah/Documents/public/PartnerAi/docs/learning-ai-product-brief.md` as approved strategy. Inspect the corrected runtime at:

- `/Users/Aaravshah/Documents/public/PartnerAi/v2/index.html`
- `/Users/Aaravshah/Documents/public/PartnerAi/v2/app.js`
- `/Users/Aaravshah/Documents/public/PartnerAi/v2/v2.css`
- `/Users/Aaravshah/Documents/public/PartnerAi/v2/lessons.js`

The runtime now contains the authoritative 10 arcs and 50 authored lessons. Treat its current appearance as a functional negative reference. Do not inherit it.

## Deliverable

Create a new, separate artifact named `learning-ai-phase-2-product.html`. Do not overwrite the production plan. Build a high-fidelity responsive interactive product prototype for age 13+ that can guide implementation.

The learner, not AI, is the protagonist. Premium means editorial confidence, rare restraint, precise composition, excellent typography, cinematic pacing, and crafted interaction. It does not mean gold on black, yacht imagery, celestial planets, glassmorphism, gradient wallpaper, giant rounded dashboard shells, repetitive card grids, or any earlier Learning AI mockup.

Use the approved product system: cool paper and deep ink, restrained signal red, Avenir/Helvetica-led editorial type, a distinctive display voice only where earned, monospaced evidence labels, fine rules, asymmetric layouts, sparse dark proof moments, controlled arc colours, and generous quiet space. Aim for the craft level of contemporary architecture publications, cultural institutions, and premium yacht/fashion sites without copying their visual identity.

## Motion and interaction

Create purposeful premium motion:

- scroll-led narrative reveals that explain learner state;
- restrained parallax or masked texture movement;
- a 10 by 5 progress artwork that resolves as lessons are completed;
- choreographed typography and rule entrances;
- continuous lesson transitions rather than unrelated page swaps;
- material hover and focus responses;
- one signature chapter-opening transition;
- one signature progress-artwork interaction.

Motion must communicate state or causality. Do not use decorative perpetual movement or scroll-jacking. Provide reduced-motion parity, keyboard control, and performant fallbacks.

## Required real states

1. New learner dashboard at 0 of 50; questionnaire is optional.
2. Returning dashboard at 18 of 50 showing the 10 by 5 artwork, current arc, next lesson, and learner-owned evidence.
3. Complete 10-arc, 50-lesson catalogue with editorial hierarchy rather than identical cards.
4. Chapter 1, The Machine That Predicts: cold open, prediction demonstration, classify gate, Try it for real evidence gate, optional Saved Notes, exit check, and completion.
5. Chapter 7, Confidently Wrong: classify, Try it, Verify evidence, optional Saved Notes, exit check, and completion.
6. Focused lesson workspace with calm primary content, progression, and optional notebook.
7. Completion moment that reveals one more part of the artwork without points or confetti.
8. Settings/accessibility with text sizing, theme/contrast, reduced motion, and visible previews.
9. Commercial/access: ten complete cross-arc lessons always free; Core 50 as one fair permanent purchase; Continuum only as optional new recurring value. Never sell inside a lesson or gate.
10. Mobile at 390px, tablet at 768px, and desktop at 1440px.

Use actual titles and copy from `v2/lessons.js`. Keep `chapter-N` identities. Every lesson has two meaningful learner actions before `exitCheck`. `tryLive` and `verify` require short evidence before Next unlocks. Saved Notes is optional and never controls Next. Deep URLs cannot skip unreached gates.

## Accessibility and verification

Meet WCAG-minded contrast, 44px targets, visible focus, semantic landmarks, explicit labels, non-colour state cues, useful locked explanations, 200% zoom, no horizontal overflow at 390/768/1024/1440, forced-colour resilience, reduced-motion parity, and privacy-conscious language suitable for teens.

Deliver:

- the runnable single-file HTML prototype with real interactions and persistence where practical;
- an embedded compact design system covering tokens, typography, grids, components, motion, and responsive rules;
- implementation mapping to the current V2 DOM/classes and state contracts;
- a critique JSON and verification Markdown;
- browser verification of dashboard, catalogue, both proof lessons, locked/unlocked Next, completion, themes, reduced motion, responsive widths, keyboard focus, and console errors;
- visual evidence that this is a premium product experience, not a polished strategy document.

Do not stop at explaining. Build the artifact.
