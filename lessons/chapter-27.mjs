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
      "prompt": "Give me a balanced view on [topic where people differ]. Then tell me: whose perspectives or groups are underrepresented in that answer, and rewrite it to include at least 2 viewpoints you left out the first time. For each added voice, say in one line what it changes.",
      "note": "Pick a real question with more than one honest side — a debate, a 'best way to...', or advice aimed at a group (curfews, phones in school, best way to save money, health advice for someone living alone). The gap between version one and version two IS the bias. Remember: the AI is grading its own blind spot, so check its list — you may spot a left-out group it missed."
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
          "text": "The rewrite sounded balanced and used calm, neutral language throughout.",
          "ok": false,
          "feedback": "That's the trap from the start of the lesson: a smooth tone is not proof of a fair picture. Name who was actually missing."
        },
        {
          "text": "The AI gave a confident answer, so you trusted its 'who's missing' list as complete.",
          "ok": false,
          "feedback": "The AI is critiquing its own blind spot — treat its list as a strong start you check. You may spot a group it didn't."
        },
        {
          "text": "You read version one, agreed it seemed fair, and skipped asking who was left out.",
          "ok": false,
          "feedback": "That skips the whole skill. The point is to surface the voice the tidy answer quietly dropped."
        }
      ]
    }
  ]
};
