// Lesson 3 — What AI actually is
// Arc: Orientation
export default {
  "id": "chapter-3",
  "num": 3,
  "arc": "Orientation",
  "title": "What AI actually is",
  "coreQuestion": "What is AI really doing, under the confident tone?",
  "blurb": "A pattern system, not a human mind. That frame keeps your options open.",
  "minutes": 8,
  "resources": [
    {
      "label": "Common Sense Media — AI basics",
      "url": "https://www.commonsensemedia.org/ai"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "\"It understands everything\"",
      "scenario": "A classmate insists the AI \"just knows\" the answer because it sounds so sure.",
      "prompt": "Do you buy it? Why or why not?"
    },
    {
      "kind": "classify",
      "title": "Which frame holds up?",
      "prompt": "Tag each statement as a useful frame or a misconception.",
      "buckets": [
        "Useful frame",
        "Misconception"
      ],
      "items": [
        {
          "text": "AI is trained software that generates patterns from data",
          "answer": 0
        },
        {
          "text": "AI thinks like a human and is almost always right",
          "answer": 1
        },
        {
          "text": "AI is a perfect, live library lookup",
          "answer": 1
        },
        {
          "text": "AI is great for fast drafts I then verify",
          "answer": 0
        }
      ],
      "reveal": "Patterns are powerful but not infallible. A polished paragraph can still be invented."
    },
    {
      "kind": "reveal",
      "title": "Generate first, verify always",
      "body": "AI is strong at generating language patterns fast. That gives you drafts and ideas quickly.",
      "mistake": "Confusing fluency with truth.",
      "good": "Use AI for options, then test each against your own understanding and a source."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Explain what AI is to a 14-year-old in 3 plain lines, without saying it is \"smart like a person.\" Then give me 2 trap questions I can use to check whether a definition is too naive.",
      "note": "Use the trap questions on a friend — or on yourself."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a myth-vs-reality card",
      "cardType": "Myth vs reality",
      "fields": [
        {
          "key": "myth",
          "label": "Myth",
          "placeholder": "AI just knows the answer"
        },
        {
          "key": "reality",
          "label": "Reality",
          "placeholder": "AI generates likely patterns"
        },
        {
          "key": "verify",
          "label": "So I will verify…",
          "placeholder": "any fact I would repeat out loud"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Best one-line definition?",
      "options": [
        {
          "text": "Software that recognizes and generates patterns from data",
          "ok": true,
          "feedback": "Practical and honest."
        },
        {
          "text": "A mind that understands like a person",
          "ok": false,
          "feedback": "Overstated — leads to trust mistakes."
        },
        {
          "text": "A search engine that is always right",
          "ok": false,
          "feedback": "No — it generates, and can invent."
        }
      ]
    }
  ]
};
