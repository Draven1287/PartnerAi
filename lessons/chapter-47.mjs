// Lesson 47 — Build a Capstone
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-47",
  "num": 47,
  "arc": "Becoming a Builder",
  "title": "Build a Capstone",
  "coreQuestion": "How do I turn everything I've learned into one small, reusable tool without exposing real data or needing to code?",
  "blurb": "Build in three saveable stages: design the workflow, test it safely, then keep evidence of what changed.",
  "minutes": 35,
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
      "body": "A capstone is not a bigger prompt. It is one small tool that survives a second use. Build it in three saveable stages; stopping after any stage is fine.\n\nSTAGE 1 — DESIGN (about 5–10 minutes): write the numbered workflow, one marked input slot, a good-enough bar, and the permission boundary.\nSTAGE 2 — TEST (about 10–15 minutes): use a representative invented or carefully redacted input, then one deliberately tricky invented input.\nSTAGE 3 — EVIDENCE (about 10 minutes): save a before/after sample, one failure-and-revision note, and one independently checked claim.\n\nA paper workflow, checklist, reusable text template, blank spreadsheet, or no-code mockup is a complete capstone; coding and an outside assistant are optional. Do not paste real names, addresses, messages, accounts, confidential material, or another person's data. If the tool affects other people, disclose AI's role when they reasonably need to know. Keep high-stakes decisions with an accountable person.",
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
        "Write what it may see or change and add human approval before any external or irreversible action",
        "Run the workflow on a representative invented or carefully redacted input and keep a before/after record",
        "Run it again on one deliberately tricky input and fix the worst break",
        "Fact-check the output against what you actually know, then name and save the tool"
      ],
      "note": "Both tests use safe representative material: first a normal invented or redacted input, then an awkward invented input. You never need a real person's data to prove reuse. Save after each stage so the 35-minute build can be split across sessions."
    },
    {
      "kind": "tryLive",
      "title": "Build yours now",
      "prompt": "I'm building a small capstone in three saveable stages. I may complete it as a paper workflow, checklist, reusable text template, blank spreadsheet, no-code mockup, or optional safely contained digital prototype.\nThe recurring need, described without private data: [your need].\nThe representative invented or redacted input: [safe sample].\nWhat I want back: [the output].\n'Good enough' means: [one observable bar].\nStage 1 — write the numbered workflow with ONE input slot, its permission boundary, and the human-approval stop. Pause so I can save or copy it.\nStage 2 — apply the same workflow to my safe sample, then to this awkward invented input: [tricky sample]. Identify the worst break and propose one revision. Pause again.\nStage 3 — help me make a small evidence record: before/after, failure, revision, result, and one claim I must independently check. Do not request an account connection, code installation, real message, original file, or another person's data.",
      "note": "No outside assistant is required: you can write each stage directly in the lesson or on paper and compare it with the examples. If you choose an outside tool, use only invented or carefully redacted text in a disposable copy. Save the three stage outputs so your evidence does not depend on memory or one uninterrupted session."
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
        },
        {
          "key": "evidence",
          "label": "Failure, revision, and checked result",
          "placeholder": "What broke on the awkward input, what I changed, and what claim I checked"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you built a tool",
      "question": "You built a capstone. What proves it's a real reusable tool and not a one-off answer?",
      "options": [
        {
          "text": "A fresh representative invented or redacted input works without rebuilding; the boundary and approval stop hold; I saved a before/after record plus one failure and revision; and I independently checked one claim.",
          "ok": true,
          "feedback": "That's your graduation. The capstone can be paper, text, spreadsheet, no-code, or safely contained code; reuse, test evidence, a repaired failure, and independent checking are what make it real."
        },
        {
          "text": "It produced polished results on two examples, but I did not record what it could access or where human approval happens.",
          "ok": false,
          "feedback": "Two outputs show some reuse, but the tool still lacks a safety contract. Define least access and a human-approval stop before calling it ready."
        },
        {
          "text": "The output matched my expected format, so I treated the format match as evidence that its facts were correct.",
          "ok": false,
          "feedback": "Format consistency is not truth. Independently check a load-bearing claim and keep the evidence alongside the result."
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
