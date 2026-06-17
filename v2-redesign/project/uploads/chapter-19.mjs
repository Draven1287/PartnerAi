// Lesson 19 — Writing & research
// Arc: Applying   (authored)
export default {
  "id": "chapter-19",
  "num": 19,
  "arc": "Applying",
  "title": "Writing & research",
  "coreQuestion": "How do I use AI without losing my voice or trusting fake sources?",
  "blurb": "Brainstorm, outline, critique — but the claims, sources, and voice stay yours.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Whose words are these?",
      "scenario": "AI can write a whole essay in seconds. It’s grammatically perfect, completely generic, possibly cites a study that doesn’t exist, and sounds nothing like you. A teacher can usually tell. So can a reader.",
      "prompt": "What parts of writing should stay yours, even when AI helps?"
    },
    {
      "kind": "classify",
      "title": "Yours or the AI’s job?",
      "prompt": "Sort each writing task by who should own it.",
      "buckets": [
        "AI can help here",
        "Stays mine"
      ],
      "items": [
        {
          "text": "Brainstorming angles and outlines",
          "answer": 0
        },
        {
          "text": "Deciding what I actually argue",
          "answer": 1
        },
        {
          "text": "Critiquing a draft I wrote",
          "answer": 0
        },
        {
          "text": "My voice, my real examples, my claims",
          "answer": 1
        }
      ],
      "reveal": "AI is great for brainstorming, outlining, and critique. The argument, the voice, and the verified facts are yours."
    },
    {
      "kind": "reveal",
      "title": "AI drafts, you own",
      "body": "Use AI to get unstuck — generate angles, outline structure, react to a draft, suggest tighter phrasing. But the claim you’re making, the sources behind it, and the voice it’s written in have to be yours, or it isn’t your work and it isn’t trustworthy.",
      "mistake": "Pasting AI’s paragraphs in as-is, fake citations and generic voice included.",
      "good": "Ask AI to critique YOUR paragraph, then revise it yourself."
    },
    {
      "kind": "tryLive",
      "title": "Get feedback, not a ghostwriter",
      "prompt": "Here’s a paragraph I wrote: [paste it]. Don’t rewrite it. Give me 3 specific critiques — where it’s vague, where the logic is weak, where my voice is strong — and one question to make it sharper.",
      "react": "Revise it yourself using the feedback. Paste your new version — it should sound more like you, not less."
    },
    {
      "kind": "verify",
      "title": "Catch the fake citation",
      "claim": "AI added: “According to a 2023 Stanford study, 73% of students improved.”",
      "steps": [
        "Does this exact study show up when I search for it?",
        "Does the real source actually report that number?",
        "Is the source about my topic, or just nearby?",
        "Can I replace it with something I’ve actually verified?"
      ],
      "note": "A fake citation in your essay is your problem once you submit it — not the AI’s."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your writing workflow",
      "cardType": "Writing workflow",
      "fields": [
        {
          "key": "airole",
          "label": "AI helps me…",
          "placeholder": "brainstorm, outline, critique"
        },
        {
          "key": "mine",
          "label": "I keep ownership of…",
          "placeholder": "argument, voice, sources"
        },
        {
          "key": "verify",
          "label": "Before submitting, I verify…",
          "placeholder": "every claim and citation"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What’s the safest, most honest way to use AI on an essay?",
      "options": [
        {
          "text": "Let AI write it, then change a few words",
          "ok": false,
          "feedback": "Still not your work — and the fake facts come along for the ride."
        },
        {
          "text": "Write it yourself; use AI to critique and verify, you revise",
          "ok": true,
          "feedback": "Right — your argument and voice, AI as editor."
        },
        {
          "text": "Trust AI’s citations since it sounds well-researched",
          "ok": false,
          "feedback": "“Sounds researched” is exactly how fake citations slip in."
        }
      ]
    }
  ]
};
