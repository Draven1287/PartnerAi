# LearningAI production curriculum

This folder is the sole editable source of truth for the 10-arc, 50-lesson LearningAI curriculum.

## Edit and build

1. Edit `chapter-1.mjs` through `chapter-50.mjs` here.
2. Preserve at least two meaningful gated activities and an `exitCheck` in every lesson.
3. Keep notebook/toolkit saves optional; an optional save must never block Next.
4. Keep external tools optional and provide a built-in, low-risk alternative.
5. Rebuild the browser bundle from the `PartnerAi` directory:

```sh
node tools/build-lessons.mjs
```

6. Verify that `v2/lessons.js` exactly matches all 50 modules before publishing.

The root-level `/Users/Aaravshah/Documents/public/lessons` directory is an archived duplicate and is not production curriculum.
