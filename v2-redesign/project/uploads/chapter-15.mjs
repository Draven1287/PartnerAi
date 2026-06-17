// Lesson 15 — Bias, fairness & perspective
// Arc: Judgment & Safety   (authored)
export default {
  "id": "chapter-15",
  "num": 15,
  "arc": "Judgment & Safety",
  "title": "Bias, fairness & perspective",
  "coreQuestion": "The answer sounds neutral — who’s missing from it?",
  "blurb": "Bias hides in what’s left out, not just what’s said.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Sounds neutral. Isn’t.",
      "scenario": "You ask AI to describe “a successful person’s morning routine” or “what makes a good leader.” The answer is smooth, reasonable, and quietly assumes one kind of life, one culture, one set of resources.",
      "prompt": "How do you notice the perspective an answer is missing — when it never tells you it picked one?"
    },
    {
      "kind": "reveal",
      "title": "Where bias comes from",
      "body": "AI learns from human data, so it inherits human patterns: what’s common in the training data sounds “normal,” and what’s rare gets left out or stereotyped. Bias also comes from how the question is framed and what context you forgot to give.",
      "mistake": "Assuming a fluent, calm answer is automatically a fair or complete one.",
      "good": "Ask who’s missing, then ask for the perspectives the first answer skipped."
    },
    {
      "kind": "tryLive",
      "title": "Surface the missing voices",
      "prompt": "Answer this: [your question]. Then list who or what your answer assumed or left out — different cultures, income levels, abilities, or viewpoints — and give one perspective you skipped.",
      "react": "Compare the first answer to the “who’s missing” list. What did the “neutral” version quietly assume?"
    },
    {
      "kind": "classify",
      "title": "Spot the slant",
      "prompt": "Which of these answers carries a hidden assumption?",
      "buckets": [
        "Hidden assumption",
        "Genuinely balanced"
      ],
      "items": [
        {
          "text": "“The best breakfast is eggs and toast.” (best for whom? where?)",
          "answer": 0
        },
        {
          "text": "“Budgets vary, so here are options for low, medium, and high cost.”",
          "answer": 1
        },
        {
          "text": "“Everyone should just invest in stocks.”",
          "answer": 0
        },
        {
          "text": "“Different cultures define success differently; here are three views.”",
          "answer": 1
        }
      ],
      "reveal": "A balanced answer names its assumptions and includes more than one perspective."
    },
    {
      "kind": "verify",
      "title": "Catch the stereotype",
      "claim": "“Describe a typical nurse and a typical engineer.” — and the answer leans on gender and personality stereotypes.",
      "steps": [
        "Did it assume a gender, age, or background it was never told?",
        "Would a real group of nurses / engineers actually fit this?",
        "Whose experience is treated as the default “typical” one?",
        "What would change if I asked for the full range instead?"
      ],
      "note": "“Typical” is where stereotypes hide. Ask for the range, not the average."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your missing-perspective check",
      "cardType": "Perspective check",
      "fields": [
        {
          "key": "assumed",
          "label": "What did the answer assume?",
          "placeholder": "culture / money / ability…"
        },
        {
          "key": "missing",
          "label": "Who’s missing?",
          "placeholder": "a viewpoint it skipped"
        },
        {
          "key": "add",
          "label": "One perspective I’d add",
          "placeholder": "…"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What’s the most reliable way to catch bias in an answer?",
      "options": [
        {
          "text": "Check if it sounds calm and professional",
          "ok": false,
          "feedback": "Tone hides bias — a smooth answer can still be one-sided."
        },
        {
          "text": "Ask who or what the answer left out, then add it back",
          "ok": true,
          "feedback": "Right — bias lives in the omissions as much as the claims."
        },
        {
          "text": "Trust it if it doesn’t use any obviously offensive words",
          "ok": false,
          "feedback": "Most bias is quiet, not offensive on the surface."
        }
      ]
    }
  ]
};
