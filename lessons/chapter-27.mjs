// Lesson 27 — Bias: Whose Voice Is Missing?
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-27",
  "num": 27,
  "arc": "Judgment & Safety",
  "title": "Whose Voice Is Missing?",
  "coreQuestion": "If an answer sounds calm and balanced, does that make it fair and complete?",
  "blurb": "A smooth, even tone is not the same as the whole picture. Learn to ask who got left out.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer that sounds fair",
      "scenario": "You ask an AI for the best way to learn a new language. It gives you a calm, tidy answer.\n\nUse an app every day. Practise 20 minutes each evening. Pay for a tutor once a week.\n\nIt reads like sensible, neutral advice. Nothing about it sounds pushy or one-sided.",
      "prompt": "That answer quietly assumes some things about your life. A phone of your own. Spare money. Free evenings. Who does it not fit? Name one person it forgot."
    },
    {
      "kind": "reveal",
      "title": "Even tone, lopsided picture",
      "body": "A calm, even tone is not the same as a full or fair picture. Part of your job is asking who got left out.\n\nOne word first. A lean means a habit of tilting towards some kinds of people and away from others. People call it bias.\n\nThe AI has no opinions of its own. It does have leans. It guesses the words that usually come next, based on an enormous amount of human writing. That writing has far more from some people than others — loud, online, English-speaking, comfortably off.\n\nSo a calm voice can sit on top of a lopsided answer.\n\nOne honest catch. When you ask it who it left out, you are asking it to spot its own blind spot. Treat its list as a good start that you then check. You may well name someone it does not.",
      "mistake": "'It has no feelings, so it must be neutral.' Reading a steady, confident tone as proof the answer is complete.",
      "good": "Noticing that the tone and the picture are two different things. Asking outright who is missing, then putting that person back in yourself."
    },
    {
      "kind": "classify",
      "title": "Spot the hidden assumption",
      "prompt": "That language answer assumed a phone of your own, spare money, and free evenings. Sort each person: does the tidy answer fit them, or quietly forget them?",
      "buckets": [
        "The answer fits them",
        "The answer forgot them"
      ],
      "items": [
        {
          "text": "Someone with their own phone and a free hour every evening",
          "answer": 0
        },
        {
          "text": "Someone with no spare money, who uses the free library",
          "answer": 1
        },
        {
          "text": "Someone who shares one family laptop and gets it twice a week",
          "answer": 1
        },
        {
          "text": "Someone who already pays for an app and has quiet evenings",
          "answer": 0
        },
        {
          "text": "Someone who looks after younger brothers and sisters until bedtime",
          "answer": 1
        }
      ],
      "reveal": "The forgotten ones are the lean you could not see in the first answer. The advice was not wrong. It was narrow. The gap between who it fits and who it forgets is exactly what you are learning to notice."
    },
    {
      "kind": "tryLive",
      "title": "Ask who is missing, then fix it",
      "prompt": "This optional step uses an outside app, so anything you type leaves LearningAI. Use a public or made-up situation. Do not include names, private stories, health details, or claims about a real person. Give me practical advice on [a topic where people's lives really differ]. Then list what your answer assumed people have: money, time, equipment, help. Add at least two people those assumptions leave out, and say what changes for each of them.",
      "note": "Good topics: getting around town without a car, saving money when your income changes week to week, learning a skill with no paid tools, revising with a noisy house. Do not ask it to speak as a real person from a real group. Treat its list of missing people as a first guess, and check it against real people when the decision matters."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your whose-voice card",
      "cardType": "Bias-check prompt",
      "fields": [
        {
          "key": "topic",
          "label": "A topic where people's lives really differ",
          "placeholder": "the best way to save money when you have very little"
        },
        {
          "key": "hidden",
          "label": "What the tidy answer might quietly assume",
          "placeholder": "steady money coming in, spare cash, decent internet"
        },
        {
          "key": "count",
          "label": "How many missing voices to add",
          "placeholder": "2 — enough to change the picture, not enough to bury you"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do it on a new topic",
      "question": "Pick a brand-new topic, run the prompt, and read both versions. What proves you actually did this, rather than just reading about it?",
      "options": [
        {
          "text": "I can name one group the first answer left out, and say in a sentence what changes for them. I checked that the rewrite included them, and pushed back when it did not.",
          "ok": true,
          "feedback": "Yes. You have done it when you can point at the person the tidy answer forgot, and get them back into the conversation."
        },
        {
          "text": "The rewrite added two groups, but everything about them came from the AI and I never checked whether it was right.",
          "ok": false,
          "feedback": "Adding groups widens the picture, and it can also invent lazy stereotypes. When the decision matters, check with people who actually live it."
        },
        {
          "text": "I named one missing group and added a line saying it is probably harder for them.",
          "ok": false,
          "feedback": "Naming them is the start. Say what the actual obstacle is, without flattening people into a stereotype."
        },
        {
          "text": "I made every option identical, so nobody could be worse off.",
          "ok": false,
          "feedback": "Identical options ignore the fact that people start from different places. Being fair sometimes means different routes to the same goal."
        }
      ]
    }
  ]
};
