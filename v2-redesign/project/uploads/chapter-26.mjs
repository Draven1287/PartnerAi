// Lesson 26 — Designing AI tools
// Arc: Building   (authored)
export default {
  "id": "chapter-26",
  "num": 26,
  "arc": "Building",
  "title": "Designing AI tools",
  "coreQuestion": "What makes an AI tool genuinely useful instead of just impressive?",
  "blurb": "A real user, a real job, clear success criteria — and a plan for when it fails.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Cool demo, useless tool",
      "scenario": "Someone builds an “AI everything assistant.” It demos great and solves nothing, because it has no specific user, no clear job, and no way to tell if it worked. Meanwhile a tiny “turn my notes into flashcards” tool gets used every day.",
      "prompt": "What does the useful tool have that the impressive one doesn’t?"
    },
    {
      "kind": "classify",
      "title": "Useful, or just impressive?",
      "prompt": "Sort these tool ideas by whether they’re actually buildable and useful.",
      "buckets": [
        "Clear & useful",
        "Vague & impressive-sounding"
      ],
      "items": [
        {
          "text": "“Turns my biology notes into 10 quiz questions.”",
          "answer": 0
        },
        {
          "text": "“An AI that does everything for everyone.”",
          "answer": 1
        },
        {
          "text": "“Checks my essay for unsupported claims before I submit.”",
          "answer": 0
        },
        {
          "text": "“The smartest assistant ever, for all your needs.”",
          "answer": 1
        }
      ],
      "reveal": "A good tool names a specific user, a specific job, the input/output, and how you’d know it worked."
    },
    {
      "kind": "reveal",
      "title": "The tool canvas",
      "body": "A useful AI tool answers: who is the user, what job does it do, what goes in, what comes out, and how do we know it succeeded? Then — the part beginners skip — what happens when it fails or gets bad input? Failure handling is what separates a toy from a tool.",
      "mistake": "Designing for “everyone” and “everything,” which means no one and nothing.",
      "good": "Pick one user and one job; define success and failure before building."
    },
    {
      "kind": "tryLive",
      "title": "Pressure-test a tool idea",
      "prompt": "Critique this AI tool idea using a product checklist: [your idea]. Tell me the user, the exact job, the input and output, how we’d measure success, and what happens when it fails or gets bad input.",
      "react": "Where did your idea fall apart — no clear user, fuzzy success, or no failure plan? Write the fix."
    },
    {
      "kind": "compare",
      "title": "Catch the vague idea",
      "weak": "“An AI study buddy that helps students.”",
      "strong": "“For a 9th grader: paste your notes, get 10 quiz questions; success = you score better on the real test; if notes are blank, it asks for the topic.”",
      "why": "The weak one can’t be built or tested. The strong one has a user, a job, a success measure, and a failure case."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your AI tool canvas",
      "cardType": "AI tool canvas",
      "fields": [
        {
          "key": "user",
          "label": "User & job",
          "placeholder": "who it’s for, what it does"
        },
        {
          "key": "io",
          "label": "Input → output",
          "placeholder": "what goes in, what comes out"
        },
        {
          "key": "success",
          "label": "Success & failure",
          "placeholder": "how I know it worked / what if it fails"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What most separates a real tool from an impressive demo?",
      "options": [
        {
          "text": "It can handle any task you throw at it",
          "ok": false,
          "feedback": "“Anything” is the red flag — no clear job means no real tool."
        },
        {
          "text": "A specific user, a defined job, and a plan for failure",
          "ok": true,
          "feedback": "Right — specificity and failure handling make it usable."
        },
        {
          "text": "It uses the newest, most powerful model",
          "ok": false,
          "feedback": "A powerful model on a vague job is still a vague tool."
        }
      ]
    }
  ]
};
