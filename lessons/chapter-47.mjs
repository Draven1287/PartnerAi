// Lesson 47 — Build a Capstone
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-47",
  "num": 47,
  "arc": "Becoming a Builder",
  "title": "Build a Capstone",
  "coreQuestion": "How do I turn everything I've learned into one small, real tool I'll actually reuse?",
  "blurb": "Assemble one boring, useful tool you'd open again next Tuesday — need, steps, safety limit, and a test.",
  "minutes": 15,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The Tuesday test",
      "scenario": "You've spent this whole course doing things with AI, not just reading about it. Now think of one annoying task that comes back every single week — turning messy notes into a study sheet, sorting a cluttered inbox, planning meals around what's already in your kitchen.",
      "prompt": "Before you read on: what's ONE recurring annoyance you'd genuinely want to hand off — the kind of thing you'd open a tool for again next Tuesday?"
    },
    {
      "kind": "reveal",
      "title": "A capstone is small on purpose",
      "body": "A capstone is not a bigger prompt. It is one small tool that survives a second use. Build it from four parts:\n\nWORKFLOW — the numbered steps you want repeated.\nINPUT SLOT — the one marked place where new material goes.\nSAFETY LIMIT — the point where the system must stop and ask before sending, deleting, posting, sharing, or spending.\nTEST — a deliberately awkward example that exposes where the workflow breaks.\n\nStart with one boring recurring need. Run the workflow on a real example, then on the awkward one. Repair the worst failure and verify any facts in the result. If you must rewrite everything for the second example, you made a one-off answer, not a reusable tool.\n\nKeep high-stakes health, money, legal, safety, and relationship decisions with an accountable person. This capstone is a task tool, not a substitute for one.",
      "mistake": "Deciding a real AI tool has to be huge and impressive, so you never build one — or you build it and just trust whatever it outputs.",
      "good": "Pick one boring recurring need, write it as a reusable workflow with one input slot, add a safety limit if it acts in the world, then test it and fact-check the result yourself."
    },
    {
      "kind": "workflowChain",
      "title": "Order the build",
      "goal": "Build a reusable capstone tool the right way, one stage at a time.",
      "correct": [
        "Name the recurring need, the input you'll feed it, the output you want, and your 'good enough' bar",
        "Have the AI write it as a numbered workflow with ONE clearly marked input slot",
        "Add a safety limit if it ever sends, deletes, posts, or shares — otherwise mark it text-only",
        "Run the workflow on your real input",
        "Run it again on one deliberately tricky input and fix the worst break",
        "Fact-check the output against what you actually know, then name and save the tool"
      ],
      "note": "The tricky-input test comes AFTER the tool runs cleanly on real input — you test the working thing, not a half-built one. Verification is the last step, never skipped."
    },
    {
      "kind": "tryLive",
      "title": "Build yours now",
      "prompt": "I'm building my capstone tool. Work with me one stage at a time and pause after each stage so I can steer.\nThe real, recurring need: [your need].\nWhat I will put in each time: [the input].\nWhat I want back: [the output].\n'Good enough' means: [your bar].\nStage 1 — write this as a clean, reusable workflow with numbered steps and ONE clearly marked input slot.\nStage 2 — if this tool ever sends, deletes, posts, or shares anything, add this safety limit: [your stop-sign]. If it only produces text for me to read, say so and skip.\nStage 3 — run the workflow on my real input: [your real input].\nStage 4 — now run it on this deliberately tricky input: [your tricky input]. Tell me where it broke, then give me one fix and the improved version.\nFinally, flag anything in your output I should fact-check myself before I rely on it.",
      "note": "Fill each bracket in your own words. Example need: 'Every Sunday I waste 30 minutes turning messy week notes into something I can study from.' Tricky input example: half-sentences with no headings, or a grocery list pasted in by mistake. If your tool only makes text to read, write 'Not needed — text only' for the stop-sign. Steer after every stage; stop only when it runs cleanly on something real."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your tool as a card",
      "cardType": "Capstone tool",
      "fields": [
        {
          "key": "name",
          "label": "Tool name",
          "placeholder": "e.g. Sunday Study-Sheet Maker"
        },
        {
          "key": "need",
          "label": "Recurring need it solves",
          "placeholder": "The genuine weekly problem, in your words"
        },
        {
          "key": "inputSlot",
          "label": "Input slot (what you swap in each time)",
          "placeholder": "e.g. This week's raw, typo-filled notes, pasted in"
        },
        {
          "key": "output",
          "label": "Output (good-enough bar)",
          "placeholder": "e.g. One-page sheet by topic + 5-question quiz, nothing invented"
        },
        {
          "key": "safetyLimit",
          "label": "Safety limit",
          "placeholder": "e.g. Ask before saving over a file or emailing anything — or 'text only'"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you built a tool",
      "question": "You built a capstone. What proves it's a real reusable tool and not a one-off answer?",
      "options": [
        {
          "text": "You hand it a brand-new real input you've never run before and get a usable result WITHOUT rebuilding the workflow, you've verified one fact in the output yourself, and you can name in one sentence what YOU brought — the need, the judgment, the test case — that the AI couldn't supply.",
          "ok": true,
          "feedback": "That's your graduation. It clears a fresh example, you checked one fact against what you know is true, and you named your own contribution."
        },
        {
          "text": "It produced an impressive, polished answer for the one example you gave it.",
          "ok": false,
          "feedback": "A great answer to one easy case is a one-off, not a tool. The test is a NEW input running through the saved workflow — plus your own verification."
        },
        {
          "text": "The output sounded confident and detailed, so you trusted it and moved on.",
          "ok": false,
          "feedback": "Confident tone isn't evidence of truth — AI predicts likely-sounding words and can still hallucinate. You have to point to one fact you checked yourself."
        },
        {
          "text": "You rewrote the whole prompt from scratch to handle the new input.",
          "ok": false,
          "feedback": "If you rebuild it every time, it isn't a saved workflow. A real tool swaps the input slot and reuses the same steps."
        }
      ]
    }
  ]
};
