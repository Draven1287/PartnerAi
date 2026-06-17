// Lesson 29 — Evaluation & testing
// Arc: Building   (authored)
export default {
  "id": "chapter-29",
  "num": 29,
  "arc": "Building",
  "title": "Evaluation & testing",
  "coreQuestion": "How do I know if my AI workflow actually works?",
  "blurb": "Define success, then try to break it — especially on the hard cases.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "“It worked when I tried it.”",
      "scenario": "You built an AI workflow, tested it on one easy example, and it nailed it. Ship it? That one easy test tells you almost nothing about what happens with weird input, edge cases, or the hard examples real users will throw at it.",
      "prompt": "What would actually prove your AI workflow works — not just that it can?"
    },
    {
      "kind": "reveal",
      "title": "Evaluation = success criteria + hard cases",
      "body": "Real evaluation has four parts: clear success criteria (what “good” means), example cases to run, deliberate failure cases (the tricky inputs), and human review of the results. Testing only on easy examples is how broken things ship looking fine.",
      "mistake": "Declaring success after one happy-path test.",
      "good": "Write the hard cases first, then check if the workflow survives them."
    },
    {
      "kind": "classify",
      "title": "Real test, or fake confidence?",
      "prompt": "Sort these by whether they actually test the workflow.",
      "buckets": [
        "Real test",
        "Fake confidence"
      ],
      "items": [
        {
          "text": "Try a deliberately tricky, messy input",
          "answer": 0
        },
        {
          "text": "Run the one example you already know works",
          "answer": 1
        },
        {
          "text": "Check the output against a written rubric",
          "answer": 0
        },
        {
          "text": "“It looked right, so it’s probably fine.”",
          "answer": 1
        }
      ],
      "reveal": "A real test includes hard cases and a rubric — not just the example that already passes."
    },
    {
      "kind": "tryLive",
      "title": "Generate tests, then add a hard one",
      "prompt": "Here’s my AI workflow: [describe it]. Generate 4 test cases including at least one tricky edge case, and a simple rubric for judging if each output is good.",
      "react": "Now add ONE more failure case AI didn’t think of — the nastiest input you can imagine. Run it. Did the workflow survive?"
    },
    {
      "kind": "verify",
      "title": "Catch the easy-only test",
      "claim": "“I tested my essay-checker on one clean paragraph and it worked, so it’s done.”",
      "steps": [
        "Was the test input easy, or actually representative?",
        "Did I try messy, empty, or tricky inputs?",
        "Is there a rubric, or just “looked right”?",
        "What’s the worst input a real user could give it?"
      ],
      "note": "A workflow is only as proven as its hardest passing test — not its easiest."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your evaluation checklist",
      "cardType": "Evaluation checklist",
      "fields": [
        {
          "key": "success",
          "label": "Success means…",
          "placeholder": "what “good” looks like"
        },
        {
          "key": "hard",
          "label": "Hard cases I’ll test",
          "placeholder": "messy / empty / tricky inputs"
        },
        {
          "key": "review",
          "label": "How I’ll judge results",
          "placeholder": "rubric + human review"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What makes a test of an AI workflow trustworthy?",
      "options": [
        {
          "text": "It passes the example you designed it for",
          "ok": false,
          "feedback": "The happy path always passes — it proves the least."
        },
        {
          "text": "It includes hard cases and is judged against a rubric",
          "ok": true,
          "feedback": "Right — edge cases plus clear criteria are what prove it."
        },
        {
          "text": "The output looks polished",
          "ok": false,
          "feedback": "Polish hides failure — it’s not the same as correct."
        }
      ]
    }
  ]
};
