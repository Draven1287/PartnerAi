// Lesson 27 — Bias: Whose Voice Is Missing?
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-27",
  "num": 27,
  "arc": "Judgment & Safety",
  "title": "Bias: Whose Voice Is Missing?",
  "coreQuestion": "If an AI answer sounds calm and balanced, does that mean it's actually fair and complete?",
  "blurb": "A smooth, neutral tone isn't the same as a full picture — learn to ask who got left out.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer that sounds fair",
      "scenario": "You ask an AI for the best way to learn a new language as an adult. It gives a calm, tidy answer: use a daily app, practice 20 minutes each night, pay for a tutor once a week. It reads like solid, neutral advice. Nothing sounds pushy or one-sided.",
      "prompt": "Before you read on: this answer quietly assumes some things about your life — a smartphone, spare cash, and free evenings. Who does that advice NOT fit? Name one person it forgot."
    },
    {
      "kind": "reveal",
      "title": "Neutral tone, lopsided picture",
      "body": "Here's the core idea: a smooth, neutral tone is not the same as a complete or fair picture — so part of your job is to ask who got left out. Quick term: 'bias' here means a consistent lean toward some views and away from others. The AI has no opinions of its own, but it does have leanings. It works by predicting the most likely next words from patterns in huge amounts of human-written text — and that text over-represents some voices (loud, online, English-speaking, well-off) and under-represents others. So a calm tone can sit on top of a lopsided answer. One honest catch: when you ask the AI who it left out, it's critiquing its own blind spot. Treat its 'who's missing' list as a strong starting point you check — not the final word. You may spot a group it doesn't.",
      "mistake": "\"It has no feelings, so it must be objective.\" Reading the confident, even tone as proof the answer is fair and complete.",
      "good": "Notice the tone and the picture are two different things. Ask outright: whose perspective is underrepresented here — then pull that voice back into the answer yourself."
    },
    {
      "kind": "classify",
      "title": "Spot the hidden assumption",
      "prompt": "That 'learn a language' answer assumed a smartphone, spare cash, and free evenings. Sort each person by whether the tidy answer fits them or quietly forgets them.",
      "buckets": [
        "Answer fits them",
        "Answer forgot them"
      ],
      "items": [
        {
          "text": "A salaried worker with a phone and a free hour every night",
          "answer": 0
        },
        {
          "text": "Someone with no spare money who relies on the free library",
          "answer": 1
        },
        {
          "text": "A shift worker whose schedule changes weekly, so 'same time daily' fails",
          "answer": 1
        },
        {
          "text": "A college student with a subscription app and predictable evenings",
          "answer": 0
        },
        {
          "text": "A parent with no uninterrupted evening block at all",
          "answer": 1
        }
      ],
      "reveal": "The 'forgot them' people are the bias you couldn't see in version one. The advice wasn't wrong — it was narrow. The gap between who it fit and who it forgot is exactly what you're learning to surface."
    },
    {
      "kind": "tryLive",
      "title": "Ask who's missing — then fix it",
      "prompt": "This optional step uses an external assistant, so anything entered leaves LearningAI. Use a public or invented scenario; do not include names, private stories, health details, or claims about a real person. Give me a practical view on [topic where people differ]. List the resources and life conditions your answer assumes. Add at least two perspectives those assumptions leave out, and say what each changes.",
      "note": "Try public transport, phone rules, saving money with irregular income, or learning a skill without paid tools. Do not ask the AI to speak as a real community member. Treat its missing-voices list as a starting hypothesis and check it against real people or authoritative research when the decision matters."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your 'whose voice?' card",
      "cardType": "Bias-check prompt",
      "fields": [
        {
          "key": "topic",
          "label": "A topic where people genuinely differ",
          "placeholder": "e.g. the best way to save money on a tight budget"
        },
        {
          "key": "hidden",
          "label": "What the tidy answer might quietly assume",
          "placeholder": "e.g. steady income, spare cash, reliable internet"
        },
        {
          "key": "count",
          "label": "How many left-out voices to add",
          "placeholder": "e.g. 2 — enough to shift the picture, not bury you"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do the skill on a new topic",
      "question": "Pick a brand-new topic, run the prompt, and read both versions. What proves you actually did the skill — not just read about it?",
      "options": [
        {
          "text": "You can name one specific group the first answer left out, say in one sentence what that viewpoint adds, and confirm the rewrite included it (pushing back if it didn't).",
          "ok": true,
          "feedback": "Yes. You've done the skill when you can point to the specific person the tidy answer forgot — and get them back into the conversation."
        },
        {
          "text": "The rewrite added two groups, but their needs were described only by the AI and I did not check whether the assumptions were accurate.",
          "ok": false,
          "feedback": "Adding groups improves coverage, but it can also invent stereotypes. For a consequential decision, check the assumptions with people affected or reliable evidence."
        },
        {
          "text": "I named one missing group and added a generic sentence saying the choice may be harder for them.",
          "ok": false,
          "feedback": "Naming a group is only the start. Identify the concrete barrier or changed requirement without reducing people to a stereotype."
        },
        {
          "text": "I made every option identical so no group could be disadvantaged.",
          "ok": false,
          "feedback": "Identical options can ignore unequal constraints. Fairness may require different ways to reach the same goal."
        }
      ]
    }
  ]
};
