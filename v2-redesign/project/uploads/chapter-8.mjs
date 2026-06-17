// Lesson 8 — Why AI hallucinates
// Arc: Understanding
export default {
  "id": "chapter-8",
  "num": 8,
  "arc": "Understanding",
  "title": "Why AI hallucinates",
  "coreQuestion": "Why does it invent things — and how do I catch it?",
  "blurb": "A confident answer can be a guess wearing a suit. Learn the catch routine.",
  "minutes": 10,
  "resources": [
    {
      "label": "Common Sense Media — AI and misinformation",
      "url": "https://www.commonsensemedia.org/ai"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The fake quote problem",
      "scenario": "An AI gives you a perfect-looking quote for an essay. The wording is strong, the author sounds right, and the citation looks real.",
      "prompt": "What would you check before using it?"
    },
    {
      "kind": "classify",
      "title": "Safe to use or verify first?",
      "prompt": "Sort each AI output by what you should do next.",
      "buckets": [
        "Use as draft/idea",
        "Verify before trusting"
      ],
      "items": [
        {
          "text": "Three possible titles for your presentation",
          "answer": 0
        },
        {
          "text": "A quote supposedly from a scientist",
          "answer": 1
        },
        {
          "text": "A made-up practice problem for algebra",
          "answer": 0
        },
        {
          "text": "A statistic about teen phone use in 2026",
          "answer": 1
        }
      ],
      "reveal": "Ideas can be useful without being true. Claims need proof."
    },
    {
      "kind": "verify",
      "title": "Run a hallucination check",
      "claim": "A famous researcher said, \"AI literacy is the new oxygen of education.\"",
      "steps": [
        "Copy the exact quote into a search engine with quotation marks.",
        "Search the person’s official page or a reliable publication, not only random quote sites.",
        "If you cannot find the quote in a trustworthy place, do not use it as real.",
        "Ask the AI for a safer replacement: \"Give me a paraphrase I can verify, not a quote.\""
      ],
      "note": "The goal is not to prove the AI wrong. The goal is to avoid repeating something you cannot stand behind."
    },
    {
      "kind": "reveal",
      "title": "Hallucination is not drama",
      "body": "A hallucination is when an AI generates something false or unsupported as if it were true. It happens because the system is generating likely text, not proving each claim.",
      "mistake": "Thinking a citation, title, or quote is real because it is formatted correctly.",
      "good": "Ask for uncertainty, sources you can open, and a verification plan before using claims."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Here is a claim I might use: \"[paste claim]\". Treat it as unverified. Give me a 4-step plan to check it, tell me what source type would count as strong evidence, and rewrite it in safer language if I cannot verify it.",
      "note": "Use this on one claim from homework, a video, or a post."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a hallucination catch",
      "cardType": "Hallucination check",
      "fields": [
        {
          "key": "claim",
          "label": "Claim I will check",
          "placeholder": "quote / stat / date / source"
        },
        {
          "key": "evidence",
          "label": "Strong evidence would be...",
          "placeholder": "official page, original article, textbook"
        },
        {
          "key": "backup",
          "label": "If I cannot verify it, I will...",
          "placeholder": "remove it or phrase it as uncertain"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which output is most dangerous to trust without checking?",
      "options": [
        {
          "text": "A list of brainstormed club names",
          "ok": false,
          "feedback": "Low risk. You still choose, but truth is not the main issue."
        },
        {
          "text": "A specific quote with a polished citation",
          "ok": true,
          "feedback": "Yes. Formatting can look real even when the source is invented."
        },
        {
          "text": "A silly analogy for photosynthesis",
          "ok": false,
          "feedback": "It might be imperfect, but it is easier to treat as a teaching draft."
        }
      ]
    }
  ]
};
