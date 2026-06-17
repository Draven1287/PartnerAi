// Lesson 2 — Your first useful AI conversation
// Arc: Orientation
export default {
  "id": "chapter-2",
  "num": 2,
  "arc": "Orientation",
  "title": "Your first useful AI conversation",
  "coreQuestion": "How do I frame a request so the answer is useful and checkable?",
  "blurb": "A good conversation is a loop, not one-shot magic.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Ten minutes, something hard",
      "scenario": "You are stuck on photosynthesis with a quiz tomorrow. You want help, but you do not want to just copy and understand nothing.",
      "prompt": "What is the first thing you would type?"
    },
    {
      "kind": "compare",
      "title": "Two ways to ask",
      "weak": "Help me study for biology.",
      "strong": "You are my tutor. I am studying photosynthesis for a quiz. Ask me one question first, give one hint, then explain simply. Make me try one example before you give the full answer.",
      "why": "The strong version sets a role, context, structure, and a required learner check — so the AI coaches instead of dumping an answer."
    },
    {
      "kind": "promptRepair",
      "title": "Repair a weak prompt",
      "weak": "explain the water cycle",
      "fields": [
        "Goal",
        "Context",
        "Constraints",
        "Format"
      ],
      "strong": "Goal: understand the water cycle well enough to teach it. Context: I am in 9th grade and confused about condensation vs. evaporation. Constraints: simple words, no jargon without a definition. Format: 4 short steps, then 2 quiz questions for me."
    },
    {
      "kind": "reveal",
      "title": "Make a loop, not a dump",
      "body": "A useful request includes role, context, what help you want, and what the AI should NOT do for you.",
      "mistake": "Accepting a full answer immediately, without your own attempt.",
      "good": "Ask for a short output first, then a follow-up after you try."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Act like a peer tutor for [your topic]. Ask what I already understand, give one hint, then wait for my attempt. Only after I try, give your fuller explanation.",
      "note": "Swap in a topic you actually have due this week."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a tutor prompt",
      "cardType": "Tutor prompt",
      "fields": [
        {
          "key": "subject",
          "label": "Subject",
          "placeholder": "Biology — photosynthesis"
        },
        {
          "key": "level",
          "label": "My current level",
          "placeholder": "shaky on the basics"
        },
        {
          "key": "check",
          "label": "A check I will do first",
          "placeholder": "try one example before the answer"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What made the strong prompt better?",
      "options": [
        {
          "text": "It was longer",
          "ok": false,
          "feedback": "Length alone is not it — vague long prompts still fail."
        },
        {
          "text": "It gave role, context, and a required check",
          "ok": true,
          "feedback": "Yes — structure creates a coaching loop."
        },
        {
          "text": "It used bigger words",
          "ok": false,
          "feedback": "No — it asked for simpler words, in fact."
        }
      ]
    }
  ]
};
