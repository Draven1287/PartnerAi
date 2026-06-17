// Lesson 17 — When not to use AI
// Arc: Judgment & Safety   (authored)
export default {
  "id": "chapter-17",
  "num": 17,
  "arc": "Judgment & Safety",
  "title": "When not to use AI",
  "coreQuestion": "When is the smartest move to NOT use AI?",
  "blurb": "Some calls need values, consent, or accountability — not a generated answer.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The move is to not use it",
      "scenario": "AI can draft your apology to a friend, decide whether you should quit the team, or tell you what to believe about something that matters to you. It’ll happily do all three. That doesn’t mean it should.",
      "prompt": "What kinds of decisions should stay fully yours, even when AI could “help”?"
    },
    {
      "kind": "classify",
      "title": "AI helps, assists, or stays out?",
      "prompt": "For each task, decide whether AI can lead, can assist with review, or should stay out of the final call.",
      "buckets": [
        "Fine for AI to help",
        "AI should stay out of the decision"
      ],
      "items": [
        {
          "text": "Brainstorm topics for a science project",
          "answer": 0
        },
        {
          "text": "Decide whether to forgive a friend",
          "answer": 1
        },
        {
          "text": "Summarize an article you’ll still read yourself",
          "answer": 0
        },
        {
          "text": "Choose what you personally believe is right",
          "answer": 1
        }
      ],
      "reveal": "Tasks needing values, consent, accountability, or lived experience stay human. AI can inform, not decide."
    },
    {
      "kind": "reveal",
      "title": "The four “stay human” signals",
      "body": "Keep the decision yours when it involves your values, when it affects other people who didn’t consent, when someone has to be accountable for the outcome, or when it needs real human experience AI doesn’t have. AI can still help you think — it just shouldn’t be the one who decides.",
      "mistake": "Outsourcing a values or relationship decision because AI gives a clean, confident answer.",
      "good": "Use AI to lay out options and tradeoffs, then make the call yourself."
    },
    {
      "kind": "tryLive",
      "title": "Ask AI to map the risks",
      "prompt": "I’m considering using AI to help with this high-stakes decision: [describe it]. List the risks of letting AI influence it, and what parts must stay a human judgment.",
      "react": "Read its list. Do you agree with where it drew the line? Write where YOU’d draw it — that’s the actual exercise."
    },
    {
      "kind": "verify",
      "title": "Catch the bad handoff",
      "claim": "“I’ll just let AI decide whether to tell my parents about a problem at school.”",
      "steps": [
        "Does this involve my values or relationships?",
        "Are other people affected who never agreed to AI deciding?",
        "Who has to live with the outcome — me, or the AI?",
        "Would I be comfortable saying “the AI decided” afterward?"
      ],
      "note": "If you wouldn’t want to say “the AI decided,” the decision was yours to make."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your AI boundary rules",
      "cardType": "AI boundary rules",
      "fields": [
        {
          "key": "never",
          "label": "I’ll never let AI decide…",
          "placeholder": "a values / relationship call"
        },
        {
          "key": "assist",
          "label": "AI can assist me with…",
          "placeholder": "options and tradeoffs"
        },
        {
          "key": "why",
          "label": "Because the outcome is…",
          "placeholder": "mine to own"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which is the strongest reason to keep a decision fully human?",
      "options": [
        {
          "text": "AI might give a slightly slower answer",
          "ok": false,
          "feedback": "Speed isn’t the issue — ownership is."
        },
        {
          "text": "It involves your values and people who must live with the result",
          "ok": true,
          "feedback": "Right — values, consent, and accountability stay human."
        },
        {
          "text": "AI isn’t good at writing",
          "ok": false,
          "feedback": "It often writes fine — that’s not why it should stay out."
        }
      ]
    }
  ]
};
