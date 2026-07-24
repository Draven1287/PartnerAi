// Lesson 45 — Designing and Making
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-45",
  "num": 45,
  "arc": "Building with AI",
  "title": "Designing and Making",
  "coreQuestion": "How do I safely design a tiny tool with AI, test it, and still understand what I made?",
  "blurb": "You decide what the prototype may touch: start with a small annoyance, test the failure case, and keep a way back.",
  "minutes": 15,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The impressive thing you cannot undo",
      "scenario": "You ask AI to build a shortcut, and it hands back something that looks finished. It may be code, a spreadsheet formula, or an automation. You cannot explain it, you have not tested a bad input, and you do not know how to return to the version that worked. Running it on your real files would turn a learning exercise into a gamble.",
      "prompt": "Before you read on: what would you need to understand, test, and be able to undo before this prototype earned access to anything real?"
    },
    {
      "kind": "reveal",
      "title": "\"It runs\" is the start, not the finish",
      "body": "AI can help you design without asking you to run generated code. Choose the lowest-risk route that works on the device you already have: sketch the screens on paper, write a checklist, lay out a blank spreadsheet, or describe a one-page no-code prototype. Those routes are complete work, not lesser substitutes. If you voluntarily use code, use only a supported browser sandbox or other disposable environment with no installs, secrets, accounts, or real files. Save a known-good copy before every change. Test one normal invented input and one deliberately awkward input. Define a reset or rollback step before running anything. Never grant folder, contact, payment, publishing, message, or deletion access for this lesson.",
      "mistake": "Paste generated code or formulas into a real system first and plan to understand the risks later.",
      "good": "Make the smallest contained prototype, predict its limits, test it with invented inputs, and prove you can reset it before using anything real."
    },
    {
      "kind": "classify",
      "title": "Which annoyance fits a tiny tool?",
      "prompt": "A tiny tool works best for a small, repeating, concrete task. Sort each real annoyance: is it a good fit for a tiny tool, or too big/vague for one?",
      "buckets": [
        "Good fit for a tiny tool",
        "Too big or vague"
      ],
      "items": [
        {
          "text": "Every week I add up my spending by hand and it takes ages",
          "answer": 0
        },
        {
          "text": "I want a proposed naming plan for six invented assignment filenames, without touching a real folder",
          "answer": 0
        },
        {
          "text": "I want a paper or no-code preview of one page with a made-up name, a placeholder image, and a button",
          "answer": 0
        },
        {
          "text": "I want to fix my whole life and be more productive",
          "answer": 1
        },
        {
          "text": "Build me an app that does everything my company needs",
          "answer": 1
        },
        {
          "text": "A little scorekeeper that counts points for a game night",
          "answer": 0
        }
      ],
      "reveal": "The good fits are small, repeating, and concrete — you can picture exactly what 'done' looks like. Vague or huge goals have no smallest version, so shrink them first: name one specific, recurring annoyance you could describe in a single sentence."
    },
    {
      "kind": "tryLive",
      "title": "Design the smallest safe prototype",
      "prompt": "My small recurring annoyance is: [describe the pattern without pasting real data]. Help me make the smallest useful prototype. First offer three routes: (A) a phone-friendly checklist or paper sketch, (B) a blank spreadsheet or no-code layout, and (C) optional code only if I already have a supported browser sandbox. I choose route [A, B, or C]. For my route, give me: the input, the output, three or fewer steps, one normal invented test, one awkward invented test, a clear pass condition, and the exact reset or rollback step. Do not ask for installs, accounts, permissions, secrets, or real files. Pause after the plan so I can explain what each part does before making anything.",
      "note": "Routes A and B fully complete this activity on a phone or with paper. Route C is optional and must stay inside a disposable browser sandbox with no downloads or external access. If no safe environment is available, do not run code; submit the tested design and rollback plan instead."
    },
    {
      "kind": "workflowChain",
      "title": "The make-and-understand loop",
      "goal": "Turn a recurring annoyance into a contained prototype you understand, can test, and can reset.",
      "correct": [
        "Name one small, recurring annoyance without entering real or private data",
        "Choose the lowest-risk route: paper or checklist, blank spreadsheet or no-code layout, or optional browser sandbox",
        "Define the input, output, pass condition, permission boundary, and reset or rollback before building",
        "Save a known-good version, then test one normal and one awkward invented input",
        "Explain each part and compare the observed result with your prediction",
        "Change one reversible setting, test again, and roll back if the pass condition fails"
      ],
      "note": "A prototype is ready for learning when you can explain it, test it, and restore it. Running generated code on a real system is not required and does not prove ownership."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your tiny-tool test",
      "cardType": "Build-understand loop",
      "fields": [
        { "key": "purpose", "label": "The one small job", "placeholder": "A repeating task with a clear finish" },
        { "key": "proof", "label": "How I know I understand it", "placeholder": "I can explain it, test an awkward input, and predict one safe change" },
        { "key": "rollback", "label": "How I return to the safe version", "placeholder": "The saved copy, reset step, or paper revision I can restore" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you understand it",
      "question": "For a NEW annoyance, what is the safest evidence that you understand the prototype you designed?",
      "options": [
        {
          "text": "It ran with no errors, so I understand it",
          "ok": false,
          "feedback": "'It runs' is the start, not the finish. Running proves the code works, not that you know what it does — a mysterious block you can't read will break in ways you can't repair."
        },
        {
          "text": "I can explain the parts, show normal and awkward invented tests, predict one reversible change, and restore the known-good version if it fails",
          "ok": true,
          "feedback": "Exactly. Explanation, test evidence, a reversible change, and a working rollback show control. A paper, no-code, spreadsheet, or safely sandboxed prototype can all meet that standard."
        },
        {
          "text": "AI called it beginner-friendly, so I ran it on my real files without a rollback",
          "ok": false,
          "feedback": "AI's reassurance isn't understanding — yours is. The test is whether YOU can explain the parts and predict a change, not whether AI says it's simple."
        },
        {
          "text": "I added more features before defining a pass condition or testing the smallest version",
          "ok": false,
          "feedback": "More features make it bigger and harder to understand, not better. The goal is the smallest thing you fully grasp — flashy-but-mysterious is fragile."
        }
      ]
    }
  ]
};
