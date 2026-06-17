// Lesson 5 — Prompt repair: goal, context, constraints, format
// Arc: Orientation
export default {
  "id": "chapter-5",
  "num": 5,
  "arc": "Orientation",
  "title": "Prompt repair: goal, context, constraints, format",
  "coreQuestion": "How do I turn a weak ask into a useful instruction?",
  "blurb": "The difference between asking and prompting — a repeatable repair.",
  "minutes": 10,
  "resources": [
    {
      "label": "Stanford CRAFT — AI literacy resources",
      "url": "https://craft.stanford.edu/"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Boring answer again",
      "scenario": "Same question, but the answer comes back generic and useless. The question was not the problem — the prompt was.",
      "prompt": "What is one thing you would add to fix it?"
    },
    {
      "kind": "promptRepair",
      "title": "Repair it live",
      "weak": "give me a study summary",
      "fields": [
        "Goal",
        "Context",
        "Constraints",
        "Format"
      ],
      "strong": "Goal: a study summary I can revise from tonight. Context: 10th-grade biology, cell division, quiz Friday. Constraints: no homework answers given away; define any term you use. Format: 3 key ideas, 1 common mistake, and a 2-question self-quiz."
    },
    {
      "kind": "reveal",
      "title": "Prompts are instructions",
      "body": "A prompt is executable instruction, not a wish. Better structure → more control.",
      "mistake": "A polished sentence with an unclear goal still fails.",
      "good": "Keep the goal concrete, constraints explicit, and ask for a quick self-check from the AI."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Here is my prompt: \"[paste your weak prompt]\". Rewrite it using Goal, Context, Constraints, Format. Then show me the improved answer and tell me which change mattered most.",
      "note": "Compare the before/after — keep the diff in your toolkit."
    },
    {
      "kind": "toolkitSave",
      "title": "Save the repair template",
      "cardType": "Prompt repair",
      "fields": [
        {
          "key": "goal",
          "label": "Goal",
          "placeholder": "what good output looks like"
        },
        {
          "key": "context",
          "label": "Context",
          "placeholder": "who/what/level"
        },
        {
          "key": "constraints",
          "label": "Constraints",
          "placeholder": "do / do not"
        },
        {
          "key": "format",
          "label": "Format",
          "placeholder": "shape of the answer"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which piece most often fixes a vague prompt first?",
      "options": [
        {
          "text": "A concrete goal",
          "ok": true,
          "feedback": "Usually yes — without it, everything else floats."
        },
        {
          "text": "More polite wording",
          "ok": false,
          "feedback": "Politeness does not add control."
        },
        {
          "text": "Making it longer",
          "ok": false,
          "feedback": "Length without structure does not help."
        }
      ]
    }
  ]
};
