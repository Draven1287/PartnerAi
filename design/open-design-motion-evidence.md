# Learning AI motion product proof — concise evidence

## Result

The deterministic verifier passes all 11 checks against `learning-ai-motion-product-proof.html`: 50 stable `chapter-N` lessons, 10 arcs, Chapter 7's substantive gates, one defensible `exitCheck`, optional Saved Notes, keyboard-focus contracts, mobile reflow rules, reduced-motion parity, learner-triggered motion, and access boundaries.

## Direct evidence

- **Keyboard:** native links, buttons, inputs, and selects; a skip link; a 3px `:focus-visible` outline; route changes move focus to `<main tabindex="-1">` with `preventScroll`.
- **Mobile overflow:** one-column recomposition below 800px and 480px, `min-width: 0` on the lesson reading region, full-width action controls, and intentional horizontal overflow limited to the compact lesson rail.
- **Reduced motion:** both `prefers-reduced-motion: reduce` and the in-product toggle remove animation, translation, masks, and transforms while preserving labels, feedback, completion, and progress state.
- **Representative lesson:** Chapter 7 contains three substantive actions (`classify`, `tryLive`, `verify`) before exactly one `exitCheck`; exactly one exit option is successful. Saved Notes can be saved or skipped and never count as a substantive gate.
- **Motion causality:** feedback reveal, evidence transfer, step continuity, and completion resolve only after learner input. There is no autoplay media or perpetual ambient animation.

## Commands and outputs

- `"$OD_NODE_BIN" tmp/verify-learning-ai-motion-product-proof.mjs` → 14 checks, 0 failures, 50 lessons, 10 arcs.
- `"$OD_NODE_BIN" tmp/verify-learning-ai-motion-product-proof-evidence.mjs` → 11 checks, 0 failures.

## Claim boundary

Chrome control was unavailable during this run, so live Tab traversal, rendered multi-viewport `scrollWidth`, live assistive-technology behavior, and Windows High Contrast remain unproven. The evidence above is source- and deterministic-artifact verification, not participant or production-backend validation.
