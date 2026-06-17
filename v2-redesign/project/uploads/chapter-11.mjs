// Lesson 11 — Roles, formats & constraints
// Arc: Conversation & Prompting   (authored)
export default {
  "id": "chapter-11",
  "num": 11,
  "arc": "Conversation & Prompting",
  "title": "Roles, formats & constraints",
  "coreQuestion": "How do role, audience, and format change the answer I get?",
  "blurb": "Same question, different audience, different answer — on purpose.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Same question, three answers",
      "scenario": "“Explain inflation.” Ask it cold and you get a textbook paragraph. But the right answer for a 10-year-old, a debate team, and a quick text to a friend are three completely different things.",
      "prompt": "Before reading on: what would you add to the prompt so the answer fits YOUR situation?"
    },
    {
      "kind": "classify",
      "title": "Which knobs actually help?",
      "prompt": "Some additions sharpen the answer. Some just sound fancy. Sort them.",
      "buckets": [
        "Sharpens the answer",
        "Just sounds fancy"
      ],
      "items": [
        {
          "text": "“Explain it for someone who has never taken economics.”",
          "answer": 0
        },
        {
          "text": "“Act as a world-renowned genius super-expert.”",
          "answer": 1
        },
        {
          "text": "“Answer in exactly 4 bullets, under 15 words each.”",
          "answer": 0
        },
        {
          "text": "“Be amazing and incredible and the best.”",
          "answer": 1
        }
      ],
      "reveal": "Useful constraints are specific: audience, length, format, tone. Flattery (“genius expert”) changes almost nothing."
    },
    {
      "kind": "reveal",
      "title": "Role, audience, format, constraint",
      "body": "Four dials shape almost every answer: the role you ask AI to take, the audience it’s writing for, the format you want back, and the constraints (length, tone, what to avoid). Set them on purpose and the output gets usable.",
      "mistake": "Picking a role that sounds impressive but doesn’t change the task (“act as a Nobel laureate”).",
      "good": "Choose the role and audience that actually match how you’ll use the answer."
    },
    {
      "kind": "tryLive",
      "title": "Force two formats",
      "prompt": "Explain why the sky is blue twice: first as a single tweet, then as a 4-step explanation for a curious 8-year-old.",
      "react": "Paste both. Which format would you actually use, and why? That choice — not the AI — is the skill."
    },
    {
      "kind": "promptRepair",
      "title": "Repair a roleless prompt",
      "weak": "Write something about climate change.",
      "fields": [
        "Role",
        "Audience",
        "Format",
        "Constraint"
      ],
      "strong": "Act as a science teacher. Write for 9th graders who are new to the topic. Give me a 5-sentence explanation of why climate change matters, in plain language, with one everyday example and no scary statistics."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your role-and-format guide",
      "cardType": "Role & format guide",
      "fields": [
        {
          "key": "role",
          "label": "Role that fits my task",
          "placeholder": "tutor / editor / debate coach…"
        },
        {
          "key": "audience",
          "label": "Who the answer is for",
          "placeholder": "me / a beginner / my class…"
        },
        {
          "key": "format",
          "label": "Format I want back",
          "placeholder": "bullets / table / one paragraph…"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which addition will most change the usefulness of the answer?",
      "options": [
        {
          "text": "“Act as the smartest AI in the world.”",
          "ok": false,
          "feedback": "Flattery doesn’t define the task — the answer barely moves."
        },
        {
          "text": "“Write it as a 3-row table for someone new to the topic.”",
          "ok": true,
          "feedback": "Right — audience + format are real, testable constraints."
        },
        {
          "text": "“Please try really hard on this one.”",
          "ok": false,
          "feedback": "Effort isn’t a dial you can set — specifics are."
        }
      ]
    }
  ]
};
