// Lesson 1 — Why AI matters — and why you stay in charge
// Arc: Orientation
export default {
  "id": "chapter-1",
  "num": 1,
  "arc": "Orientation",
  "title": "Why AI matters — and why you stay in charge",
  "coreQuestion": "When should I use AI, and what do I keep deciding myself?",
  "blurb": "Start from your choices, not the hype. Set one rule you can keep.",
  "minutes": 8,
  "resources": [
    {
      "label": "Elements of AI — free intro course",
      "url": "https://www.elementsofai.com/"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You see this every week",
      "scenario": "One friend uses AI and their grades go up. Another says AI is dangerous and refuses to touch it. A third uses it for literally everything. They are all talking at once.",
      "prompt": "Before reading on: in one sentence, what would YOUR rule be?"
    },
    {
      "kind": "classify",
      "title": "Sort these uses",
      "prompt": "Which of these keep you learning, and which quietly replace your thinking?",
      "buckets": [
        "Keeps me thinking",
        "Replaces my thinking"
      ],
      "items": [
        {
          "text": "Ask AI to explain a concept, then re-explain it back in your own words",
          "answer": 0
        },
        {
          "text": "Paste the homework question and copy the answer",
          "answer": 1
        },
        {
          "text": "Ask for 3 angles on an essay, then pick and argue one yourself",
          "answer": 0
        },
        {
          "text": "Let AI write the whole essay and submit it",
          "answer": 1
        }
      ],
      "reveal": "The line is not \"AI or no AI.\" It is \"did I still do the thinking that matters?\""
    },
    {
      "kind": "reveal",
      "title": "Agency is the real skill",
      "body": "AI is useful when a human keeps the goal, the method, and the verification. Speed is not the same as understanding.",
      "mistake": "Trusting a fluent answer because it sounds confident.",
      "good": "Use AI to improve your reasoning, and skip it when it tempts you to stop thinking."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "I am deciding when AI helps me without replacing my thinking. Give me 5 useful use cases and 5 risky shortcuts for a high-school student. For each risky shortcut, add one question I should ask myself before using it.",
      "note": "Run this in any free AI tool, then keep the 5 risky ones near your desk."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your agency rule",
      "cardType": "Agency rule",
      "fields": [
        {
          "key": "help",
          "label": "I want AI to help me…",
          "placeholder": "draft, explain, brainstorm…"
        },
        {
          "key": "never",
          "label": "I will not let AI decide…",
          "placeholder": "what I actually believe"
        },
        {
          "key": "check",
          "label": "Before I trust it, I will check…",
          "placeholder": "one source / my own attempt"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which is the strongest reason to keep a human in charge?",
      "options": [
        {
          "text": "AI is always wrong",
          "ok": false,
          "feedback": "Too strong — AI is often useful. The issue is unverified trust."
        },
        {
          "text": "A fluent answer can still be wrong or low-value",
          "ok": true,
          "feedback": "Exactly. Confidence is not proof."
        },
        {
          "text": "Using AI is against the rules",
          "ok": false,
          "feedback": "Not the point — many uses are fine when you stay in charge."
        }
      ]
    }
  ]
};
