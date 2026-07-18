# lessons/ — the lesson source (one file per lesson)

**This folder is the source of truth for all 50 lessons.** Each lesson is its own file so the curriculum can be edited, reviewed, rebuilt, and deployed from a clean clone of this repository.

```
_arcs.mjs        the ten arc names (five lessons each)
chapter-1.mjs    Lesson 1   (First Contact)
chapter-2.mjs    Lesson 2
...
chapter-50.mjs   Lesson 50  (Becoming a Builder)
```

## How to edit
1. Open the lesson file you want, e.g. `chapter-12.mjs`. It's `export default { …lesson object… };`.
2. Edit/author it (schema below). Stubs are marked `"stub": true` in their header comment — remove `stub` and add real `steps` to author one.
3. Rebuild the file the app actually loads:
   ```
   node tools/build-lessons.mjs
   ```
   That regenerates `v2/lessons.js` (AUTO-GENERATED — never hand-edit it).
4. Run `node tools/audit-lesson-quality.mjs` and `node tools/check-v2-launch-ready.mjs`.
5. Reload the app to see the change. Bump the `lessons.js?v=…` query in the relevant preview entry point so caches do not serve the old build.

In CI or before deployment, run `node tools/build-lessons.mjs --check` to prove that the browser bundle and backend seed still match these source files exactly.

## Lesson schema
```js
export default {
  id: 'chapter-N',          // MUST equal the V1 chapter id; lesson N -> 'chapter-N'
  num: N,                   // 1..50
  arc: 'First Contact',     // one of the ten arc names in _arcs.mjs (string value)
  title: '…',
  coreQuestion: '…',        // the one question the lesson answers
  blurb: '…',               // one line, shown on cards
  minutes: 9,
  resources: [ { label: '…', url: 'https://…' } ],  // optional; only real free links
  steps: [ /* ordered parts — see step kinds */ ]
}
```

## Step kinds
Read-through (Next not gated): `coldOpen, reveal, compare, nextWord, toolkitSave, evalTest`.
Gated (must produce an answer or evidence before Next unlocks): `classify, exitCheck, promptRepair, biasSpot, agentDesign, workflowChain, tryLive, verify`.
`toolkitSave` is optional and never controls Next. Full field shapes can be inferred from the authored lesson files and are validated by the build and audit scripts.

**Rule of thumb:** every lesson has at least two meaningful learner actions and ends with an `exitCheck`; keep the voice concrete, calm, and appropriate for anxious learners aged 13+, and vary the interaction rhythm across the course.

## Status
50 authored lessons · 10 arcs · 19 interaction rhythms · 0 quality-audit failures or warnings as of 17 July 2026. Human editorial, accessibility, and representative 13+ learner review still remain before launch.
