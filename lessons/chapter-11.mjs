// Lesson 11 — Your First Real Question
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-11",
  "num": 11,
  "arc": "Talking to AI",
  "title": "Your First Real Question",
  "coreQuestion": "What should I bring to AI first: a clever test, or one small real thing from my own week?",
  "blurb": "Hand AI one small real job from your own week. Then actually use the answer and finish it.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The thing you keep putting off",
      "scenario": "There is a small thing sitting on your list. A message you owe someone. A shopping list for the week. A reply you keep not writing. A homework question you have been stuck on since Tuesday.\n\nNothing dramatic. Just a little thing you keep meaning to do and have not.",
      "prompt": "Before you read on: what is ONE small real thing from this week you have been meaning to do? Not a made-up test. A real one. Hold it in your head."
    },
    {
      "kind": "classify",
      "title": "Real job, or quiz question?",
      "prompt": "AI helps you first on small, real, everyday jobs. Not clever demos or trick questions. Sort each one.",
      "buckets": [
        "A real job from my week",
        "A quiz question"
      ],
      "items": [
        {
          "text": "Message my coach to say I will miss Thursday training",
          "answer": 0
        },
        {
          "text": "What year did the French Revolution start?",
          "answer": 1
        },
        {
          "text": "Make a shopping list for two quick weeknight dinners",
          "answer": 0
        },
        {
          "text": "Prove that the square root of 2 is irrational",
          "answer": 1
        },
        {
          "text": "Write a polite message asking my teacher for one more day on an essay",
          "answer": 0
        }
      ],
      "reveal": "The real ones are where AI helps you first. Plenty of people think it is only for clever demos or school answers. The opposite is true. Your ordinary little jobs are where it earns its keep."
    },
    {
      "kind": "reveal",
      "title": "It guesses. It does not know you.",
      "body": "When you describe your situation, the AI is not reading your mind. Here is what really happens. It learned patterns from an enormous amount of human writing. So it guesses the words that usually help someone in a spot like the one you typed.\n\nThe more real, ordinary detail you give, the closer that guess lands on YOUR life.\n\nSome apps can also search the web and keep bits of your earlier chats. They still guess. A smooth answer can still be wrong.\n\nKeep the details ordinary. No passwords, no account numbers, nothing private about money or health.\n\nAnd here is one line worth drawing now. 'Do my homework for me' hands over the exact part that was meant to teach you something. 'I am stuck on question 4, walk me through it' keeps the learning and still gets you moving. Same app. Completely different result for you.",
      "mistake": "Typing a vague test ('write a good message') and expecting it to know who it is for.",
      "good": "Handing it a real job with a detail or two ('message my coach — I am friendly with him, so warm but short')."
    },
    {
      "kind": "workflowChain",
      "title": "Turn a real need into a job it can help with",
      "goal": "Use AI on one ordinary job without letting it own the result.",
      "correct": [
        "Say what a good result looks like, in one sentence",
        "Take out private details the job does not need",
        "Pick the one small part AI can help with",
        "Decide how you will judge whether it is any good",
        "Do the real-world bit yourself"
      ],
      "choices": [
        "Do the real-world bit yourself",
        "Pick the one small part AI can help with",
        "Say what a good result looks like, in one sentence",
        "Decide how you will judge whether it is any good",
        "Take out private details the job does not need"
      ],
      "note": "If you try an outside app, pick something low-stakes. Take out names, timetables, addresses, account details, and private messages first."
    },
    {
      "kind": "tryLive",
      "title": "Write your real ask",
      "prompt": "I need help with one small real job: [the actual thing, in your own words]. My situation: [a detail or two — who it is for, how I want to sound, what I already have]. Please [write it / list it / explain it / give me 3 short options], short and in plain language. If you need one thing from me to do it well, ask me first.",
      "note": "Example you can paste straight in: 'I need help with one small real job: messaging my coach to say I will miss Thursday training. My situation: I am friendly with him, so warm but short, and I want to offer to make it up. Please give me 2 short versions I can choose from, in plain language. If you need one thing from me to do it well, ask me first.' If your real job is homework, ask it to walk you through the part you are stuck on, not to hand you the finished answer. Fill the blanks with true details, nothing private about money or health, then read the answer and fix what is off."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your real-job ask",
      "cardType": "Real Task Prompt",
      "fields": [
        {
          "key": "task",
          "label": "The job",
          "placeholder": "messaging my coach about missing Thursday training"
        },
        {
          "key": "situation",
          "label": "A detail or two about me",
          "placeholder": "friendly with him — warm but short"
        },
        {
          "key": "want",
          "label": "What I want back",
          "placeholder": "2 short versions I can choose from"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually do the thing?",
      "question": "You ran your ask on a brand-new real job, read the answer, and fixed what was off. What makes it a win?",
      "options": [
        {
          "text": "One real thing in my week is actually done. I sent it, saved it, or took the step.",
          "ok": true,
          "feedback": "That is the whole skill. Using the answer for the real thing is the lesson, not a tidy answer sitting on a screen."
        },
        {
          "text": "The AI wrote me a smooth, tidy answer, so I am finished.",
          "ok": false,
          "feedback": "Not yet. A smooth answer can still be wrong, and it was never the goal. The win is the thing getting done."
        },
        {
          "text": "I asked it a hard quiz question and it got the answer right.",
          "ok": false,
          "feedback": "That is a demo, not your week. Bring a real job and actually use what comes back."
        },
        {
          "text": "I copied its answer straight onto my homework without reading it.",
          "ok": false,
          "feedback": "That hands over the part that was meant to teach you. Ask it to walk you through where you are stuck instead."
        }
      ]
    }
  ]
};
