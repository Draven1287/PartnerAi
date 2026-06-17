// Lesson 7 — Context windows & memory
// Arc: Understanding
export default {
  "id": "chapter-7",
  "num": 7,
  "arc": "Understanding",
  "title": "Context windows & memory",
  "coreQuestion": "What does the AI actually remember, and for how long?",
  "blurb": "The model responds to what is in the current context. Memory is not magic.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "\"But I already told it\"",
      "scenario": "You told an AI your project rules at the start. Ten messages later, it ignores one and gives advice that breaks the assignment.",
      "prompt": "Did it forget, miss the rule, or never really remember like a person?"
    },
    {
      "kind": "classify",
      "title": "In context or out of reach?",
      "prompt": "Sort what the AI can use right now versus what you need to restate or provide again.",
      "buckets": [
        "In current context",
        "Needs restating/checking"
      ],
      "items": [
        {
          "text": "A rubric you pasted two messages ago",
          "answer": 0
        },
        {
          "text": "A file you never uploaded or pasted",
          "answer": 1
        },
        {
          "text": "A constraint buried 40 messages back in a long chat",
          "answer": 1
        },
        {
          "text": "The format you put in the prompt it is answering now",
          "answer": 0
        }
      ],
      "reveal": "If it matters, keep it visible. Important instructions belong near the task, not buried."
    },
    {
      "kind": "promptRepair",
      "title": "Move the rule into view",
      "weak": "Make this better but remember my teacher’s rules from before.",
      "fields": [
        "Goal",
        "Context",
        "Constraints",
        "Format"
      ],
      "strong": "Goal: improve my paragraph without changing my argument. Context: 10th-grade English, persuasive paragraph. Constraints: keep my voice, do not add outside facts, and follow this rubric: [paste rubric]. Format: return a revised paragraph plus 3 notes explaining what changed."
    },
    {
      "kind": "reveal",
      "title": "Context is working memory",
      "body": "A context window is the information the model can use for the current response. Some products add saved memory, but you should not assume it has the exact thing you meant.",
      "mistake": "Saying \"you know what I mean\" when the instruction is not visible.",
      "good": "Restate the goal, paste key constraints, and ask the AI to repeat the rules before it works."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Before helping me, summarize the constraints I gave you in 3 bullets. If any constraint is missing or unclear, ask me a question instead of guessing. Then complete the task.",
      "note": "This works especially well when a rubric or teacher rule matters."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a context reset",
      "cardType": "Context reset",
      "fields": [
        {
          "key": "goal",
          "label": "Current goal",
          "placeholder": "what I need now"
        },
        {
          "key": "mustKeep",
          "label": "Rules to keep visible",
          "placeholder": "rubric, length, source limits"
        },
        {
          "key": "check",
          "label": "AI should confirm...",
          "placeholder": "the constraints before answering"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What should you do when a rule really matters?",
      "options": [
        {
          "text": "Assume the AI remembers it from earlier",
          "ok": false,
          "feedback": "Risky. Earlier context can be missed, compressed, or absent."
        },
        {
          "text": "Put the rule close to the task and ask the AI to confirm it",
          "ok": true,
          "feedback": "Right. Keep important context visible."
        },
        {
          "text": "Start a brand-new chat for every sentence",
          "ok": false,
          "feedback": "Not necessary. The point is to manage context, not avoid conversation."
        }
      ]
    }
  ]
};
