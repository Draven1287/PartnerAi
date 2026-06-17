// Lesson 20 — Coding & debugging
// Arc: Applying   (authored)
export default {
  "id": "chapter-20",
  "num": 20,
  "arc": "Applying",
  "title": "Coding & debugging",
  "coreQuestion": "AI gave me code — do I actually understand it?",
  "blurb": "Use AI to explain errors and write tests, not to paste mystery code you can’t defend.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It works. Why?",
      "scenario": "You asked AI to fix your bug. It pasted back 30 lines that work. You have no idea why. Next bug, you’re stuck again — because you didn’t learn anything, you just borrowed an answer.",
      "prompt": "What’s the difference between using AI to code and using it to learn to code?"
    },
    {
      "kind": "reveal",
      "title": "AI is a great explainer, a risky autopilot",
      "body": "AI is genuinely useful for explaining error messages, suggesting tests, reviewing your logic, and unsticking you. The danger is pasting code you can’t read: it works until it doesn’t, and then you can’t fix it because you never understood it.",
      "mistake": "Shipping code you couldn’t explain to another person.",
      "good": "Make AI explain the fix and write a test — so you understand and can prove it works."
    },
    {
      "kind": "workflowChain",
      "title": "Build the debug workflow",
      "goal": "Fix a bug with AI’s help and actually understand the fix.",
      "correct": [
        "Read the error message yourself first",
        "Ask AI to explain what the error means",
        "Ask for a hint about the likely cause, not the full fix",
        "Try the fix and ask AI for one test that proves it",
        "Explain the bug and the fix in plain English"
      ],
      "note": "If you can explain it and a test passes, it’s really fixed — not just temporarily quiet."
    },
    {
      "kind": "tryLive",
      "title": "Make AI teach the bug",
      "prompt": "Here’s an error and my code: [paste]. Explain what the error means in plain English and ask me what I think is causing it BEFORE you suggest a fix. Then suggest one test.",
      "react": "Answer its question first. Paste the exchange — did explaining it out loud help you spot the cause yourself?"
    },
    {
      "kind": "compare",
      "title": "Catch the code you can’t defend",
      "weak": "“Just fix it” → you paste 30 lines you’ve never read into your project.",
      "strong": "“Explain the bug, suggest the smallest fix, and a test” → you understand each change.",
      "why": "Mystery code is a future bug you can’t solve. Understood code is a skill you keep."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your debug coach prompt",
      "cardType": "Debug coach",
      "fields": [
        {
          "key": "explain",
          "label": "Ask AI to explain…",
          "placeholder": "what the error means"
        },
        {
          "key": "hint",
          "label": "Ask for a hint, not…",
          "placeholder": "the whole fix at once"
        },
        {
          "key": "prove",
          "label": "Prove it’s fixed by…",
          "placeholder": "a test + plain-English why"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "When is it safe to use AI-suggested code?",
      "options": [
        {
          "text": "When it runs without errors",
          "ok": false,
          "feedback": "Running ≠ correct ≠ understood. It can break later."
        },
        {
          "text": "When you can explain what it does and a test confirms it",
          "ok": true,
          "feedback": "Right — understanding + a test is what makes it yours."
        },
        {
          "text": "When it’s long enough to look serious",
          "ok": false,
          "feedback": "Length is not correctness — and definitely not understanding."
        }
      ]
    }
  ]
};
