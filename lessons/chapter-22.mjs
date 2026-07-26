// Lesson 22 — Constraints That Actually Work
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-22",
  "num": 22,
  "arc": "Prompting Craft",
  "title": "Limits That Actually Stick",
  "coreQuestion": "Why do some limits I set get ignored while others hold, and how do I make one stick?",
  "blurb": "\"Keep it short\" slides straight off. \"Exactly 3 bullet points\" holds, because you can count them.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You asked for short. You got an essay.",
      "scenario": "You typed \"keep it short\" and pressed send.\n\nBack came five thick paragraphs.\n\nYou did set a limit. It rolled straight over it.",
      "prompt": "What is the difference between \"keep it short\" and \"exactly 3 bullet points\"? Which one do you think it will actually stick to?"
    },
    {
      "kind": "reveal",
      "title": "A limit you can count is a limit that holds",
      "body": "A limit is a rule you put on the answer. How long it is. What to leave out. What word not to use.\n\nA countable limit is one you can check afterwards by counting or looking. 'Exactly 3 bullet points.' 'Do not use the word amazing.'\n\nHere is why that matters. The AI guesses the words that usually come next. It is not keeping a tally as it goes, and it is not measuring length.\n\nSo 'keep it short' has nothing solid in it. There is nothing to aim at, and it slides off. 'Exactly 3 bullet points' gives it a clear target.\n\nOne catch. A number of items holds up better than an exact word count, because it still is not really counting.\n\nWhich is the whole point. The skill is not the asking. The skill is the checking. Count them yourself, every time.",
      "mistake": "Writing 'keep it short' or 'be brief' and hoping. There is nothing there to check against.",
      "good": "Writing 'exactly 3 bullet points' and 'do not use the word amazing', then counting the bullets and searching for the word yourself."
    },
    {
      "kind": "classify",
      "title": "Countable, or just a feeling?",
      "prompt": "Sort each limit. Could you check it afterwards by counting or looking? Or is it too vague to grade?",
      "buckets": [
        "I can check this",
        "Too vague to check"
      ],
      "items": [
        {
          "text": "Exactly 3 bullet points",
          "answer": 0
        },
        {
          "text": "Keep it brief",
          "answer": 1
        },
        {
          "text": "Do not use the word 'utilise'",
          "answer": 0
        },
        {
          "text": "Make it sound professional",
          "answer": 1
        },
        {
          "text": "Answer in one short paragraph",
          "answer": 0
        },
        {
          "text": "Do not get too technical",
          "answer": 1
        }
      ],
      "reveal": "Countable limits leave you something to count or search for afterwards. Vague ones — brief, professional, too technical — leave you nothing to grade. Those are the ones that quietly get ignored."
    },
    {
      "kind": "promptRepair",
      "title": "Swap the feeling for something you can count",
      "weak": "Give me a quick rundown on what to check when buying a second-hand bike. Keep it brief and do not make it too salesy.",
      "fields": [
        "A limit I can count",
        "A word to avoid",
        "The question"
      ],
      "strong": "Answer this in exactly 3 bullet points. Do not use the word 'amazing'. Question: What should I look for when buying a second-hand bike?"
    },
    {
      "kind": "tryLive",
      "title": "Run it, then grade it yourself",
      "prompt": "This optional step uses an outside app, so anything you type leaves LearningAI. Use a made-up or public question. Do not paste private messages, names, account details, or anything about another person. Answer this in [a limit I can count]. Do not use the word [word to avoid]. Question: [your low-stakes question]",
      "note": "Pick something ordinary: a second-hand bike checklist, a plan for making lunches for the week, a reminder for games night. Then count the result and search for the banned word. If it missed, say exactly what it broke, ask for one fix, and check again."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your countable-limit recipe",
      "cardType": "Prompt recipe",
      "fields": [
        {
          "key": "limit",
          "label": "My countable limit",
          "placeholder": "exactly 3 bullet points"
        },
        {
          "key": "banned",
          "label": "My banned word",
          "placeholder": "amazing"
        },
        {
          "key": "verify",
          "label": "How I will check it",
          "placeholder": "count the bullets, then search for the word"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it, do not hope it",
      "question": "You asked for exactly 4 steps and no use of the word 'simply'. The reply has 5 steps and says 'simply' once. What shows you have the skill?",
      "options": [
        {
          "text": "Say the check out loud — I counted 5 steps, that breaks my limit, and 'simply' is in there — then send one fix and count again.",
          "ok": true,
          "feedback": "Exactly. You counted, you looked, you caught the break, and you fixed it in one reply and checked again."
        },
        {
          "text": "Keep the five steps because the extra one is handy, take out the banned word, and call it close enough.",
          "ok": false,
          "feedback": "Keeping the extra step might be a fine choice. Just do not tell yourself both limits were met. Change the rule on purpose, or fix the answer."
        },
        {
          "text": "Ask the AI whether it followed both limits, and take its word for it.",
          "ok": false,
          "feedback": "It checking its own homework is a clue, not proof. Count the steps and search the text yourself."
        },
        {
          "text": "Rewrite it as 'please keep it shorter and simpler' and send again.",
          "ok": false,
          "feedback": "That trades your countable limits back for feelings, which are exactly what gets ignored. Keep the number and the banned word, then check."
        }
      ]
    }
  ]
};
