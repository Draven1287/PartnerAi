# Persona panel review — 24 July 2026

Ten independent persona reviewers walked the production root (`learning-ai-design-assets/`) and the 50-lesson curriculum. Personas 01–07 were re-runs against the current build; 08–10 are new and reviewed for the first time.

The backend was not running during this panel, so every `/api/*` call returned `503 api_proxy_not_configured`. That is an ops state, not a design choice — but it exposed how the product behaves during an outage, which turned out to be the panel's dominant finding.

## Convergence

Ranked by how many of the ten reviewers raised it independently.

| Finding | Raised by | Status |
|---|---:|---|
| A service outage dead-ends the whole journey; the generic error gives no next step | 9 | **Fixed** — real outage codes now mapped in `learning-api.js` |
| A failed sync discarded the completed lesson entirely | 6 | **Fixed** — completion now records locally first, then syncs |
| Signing out silently erases Saved Notes and drafts while the page promised the account kept them | 3 | **Fixed** — copy corrected, warning added before the wipe |
| "I already have an account" threw away the anonymous Lesson 1 | 2 | **Fixed** — pending lesson now claimed on the sign-in branch too |
| The six questions compute a level that nothing reads, while the copy claims it changes guidance | 4 | Open — decision needed |
| Focus rings fail contrast site-wide (2.31:1 default, 1.4–1.9:1 in places) | 2 | Open — mechanical fix |
| Badge/background images ship at 5–40× their rendered size; `/focus.html` is 33 MB | 2 | Open — decision needed |
| Quick Start is the default and skips the system map and prediction arena | 4 | Open — product decision |
| Strict sequential unlock with no test-out | 3 | Open — product decision |
| Gates say "nothing is graded" but block on correct answers | 3 | Open — product decision |

## What each reviewer would build first

- **Maya (13, cautious):** make an outage non-destructive; put the system map back in Quick Start.
- **Eli (14, impatient):** let the group-chat decision be screen one, before the intro.
- **Rowan (mature achiever):** populate `resources` for all 50 lessons — currently `"resources": []` fifty times, and the lesson player has no code path that reads it.
- **Jax (skeptical gamer):** make the Prediction Arena real (it is three hardcoded strings) and make stored evidence, not click-count, drive completion.
- **Nia (practical):** ship an export from Notes — 50 lessons currently produce nothing a learner can show anyone.
- **Kai (defensive):** fix the sign-out data destruction; stop gating Settings behind the full funnel.
- **Sam (overloaded):** make completion survive a bad connection.
- **Dara (dyslexic):** one dark focus ring everywhere; fix the `zoom` vs `100vw` overflow.
- **Tomás (low-end phone):** resize the images; a 384 KB JPG of the page background already sits unused beside the 1.9 MB PNG.
- **Priya (AI-fluent):** make the questionnaire's promise true, or delete the sentence that makes it.

## What every reviewer said to postpone

Ten out of ten: **the 3D medal vault.** Drag-to-turn medals, a rotation console, engraved backs, thirteen depth layers per badge — the most engineered surface on the site, decorating a lesson counter, at ~2.5 MB per medal, none of them yet earnable by anyone.

## Notable contradictions found in shipped copy

These are places where the product tells the learner something the code does not do:

- `theme.js` — "The band only changes how much guidance you see" · the band changes nothing; `level` and `scorePercent` are written and never read.
- `focus.html` — arc medals "mark a practical human capability … time alone never earns one" · the metric behind every capability medal is a lesson count.
- `settings.html` — (corrected in this pass) claimed the account kept Saved Notes; notes are browser-only.
- `notes.html` — "when the full lesson player is connected" and "attached to the learner account in PostgreSQL" — build notes leaking into learner-facing copy.
- Lesson 1 completion summary asserts the learner "protected private information" regardless of which options they chose.
- `achievement-vault.js` — the "First Project" pin reads three storage keys nothing on the site ever writes. It cannot be earned.

## Not confirmed in a real browser

Two findings rest on static analysis and need a browser at 1024/1440 px to settle:

1. `body { zoom }` at Large/Extra-large text against ~35 `calc(100vw - N)` widths — the arithmetic says horizontal overflow; which controls become unreachable needs eyes.
2. `html, body { overflow-x: hidden }` at ≤820 px making `<body>` its own scroll container, which would break the sticky lesson nav.
