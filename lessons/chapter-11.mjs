// Lesson 11 — Your First Real Question
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-11",
  "num": 11,
  "arc": "Talking to AI",
  "title": "Your First Real Question",
  "coreQuestion": "What should I actually bring to AI first — a clever test, or one small real thing from my own day?",
  "blurb": "Hand AI one small, real task from your life — then actually use the answer to get it done.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The thing you've been putting off",
      "scenario": "There's a small task sitting on your list: a text you owe someone, a grocery list, a polite reply, a 'how do I set this up' question, a plan for one chore. Nothing dramatic — just a little thing you keep meaning to do and haven't.",
      "prompt": "Before you read on: what's ONE small, real thing from today or this week that you've been meaning to do? Not a made-up test — a real one. Hold it in mind."
    },
    {
      "kind": "classify",
      "title": "Real task or quiz question?",
      "prompt": "AI shines first on small, real, everyday tasks — not clever demos or trick questions. Sort each one into where it belongs.",
      "buckets": [
        "A real task from my life",
        "A quiz / test question"
      ],
      "items": [
        {
          "text": "Text my neighbor to ask if I can borrow their ladder this weekend",
          "answer": 0
        },
        {
          "text": "What year did the French Revolution start?",
          "answer": 1
        },
        {
          "text": "Make a grocery list for two busy weeknight dinners",
          "answer": 0
        },
        {
          "text": "Prove that the square root of 2 is irrational",
          "answer": 1
        },
        {
          "text": "Write a polite reply to my landlord about the leak",
          "answer": 0
        }
      ],
      "reveal": "The real-life ones are where AI helps you first. The misconception is that AI is only for clever demos, school answers, or things smarter or younger people do. The opposite is true: your ordinary little problems are exactly where it earns its keep."
    },
    {
      "kind": "reveal",
      "title": "It predicts — it doesn't know you",
      "body": "When you describe your situation, the AI isn't reading your mind or 'knowing' you. (That's a comparison — here's what's really happening.) It learned patterns from enormous amounts of human writing, so it predicts the words that usually help in a situation like the one you typed. The more real, everyday detail you give, the closer its guess fits YOUR life. In 2026 assistants can also browse the web, use tools, and remember things across chats — but they still guess, and a smooth answer can still be wrong. Keep details everyday and non-sensitive: no passwords, account numbers, or private health or money details. And before you act on anything that matters — a price, a date, a fact, a medical or money tip — read it with your own judgment first.",
      "mistake": "Typing a vague test question ('write a good text') and expecting the AI to somehow know who it's for and what you need.",
      "good": "Handing it a real task with a detail or two ('text my neighbor — we're friendly but not close, so warm and not pushy') so its prediction actually fits your situation."
    },
    {
      "kind": "tryLive",
      "title": "Write your real ask",
      "prompt": "I need help with one small real task: [the task — the actual small thing, in your own words]. Here's my situation: [a detail or two about me — tone, who it's for, what I have]. Please [what you want — write it / list it / explain it / give me 3 short options], kept short and in plain language. If you need one thing from me to do it well, ask me first.",
      "note": "Worked example you can paste as-is: 'I need help with one small real task: texting my neighbor to ask if I can borrow their ladder this weekend. Here's my situation: we're friendly but not close, so I want it warm and not pushy. Please write me 2 short versions I can choose from, kept short and in plain language. If you need one thing from me to do it well, ask me first.' Fill the blanks with TRUE details — no passwords or private money/health info — then read the answer and fix anything that's off."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your real-task prompt",
      "cardType": "Real Task Prompt",
      "fields": [
        {
          "key": "task",
          "label": "The task",
          "placeholder": "texting my neighbor to ask to borrow their ladder this weekend"
        },
        {
          "key": "situation",
          "label": "A detail or two about me",
          "placeholder": "we're friendly but not close — warm, not pushy"
        },
        {
          "key": "want",
          "label": "What I want",
          "placeholder": "write me 2 short versions I can choose from"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually DO the thing?",
      "question": "You've run the prompt on a brand-new real task, read the answer, and fixed what was off. What makes this a win?",
      "options": [
        {
          "text": "I finished with one real thing in my life actually done — I sent it, saved it, or took the step.",
          "ok": true,
          "feedback": "That's the whole skill. Using the answer for the real thing is the lesson — not a nice answer sitting on the screen."
        },
        {
          "text": "The AI gave me a smooth, well-written answer, so I'm done.",
          "ok": false,
          "feedback": "Not yet. A smooth answer can still be wrong, and it isn't the goal. The win is doing the real thing — send it, save it, or take the step."
        },
        {
          "text": "I asked it a hard quiz question and it got the answer right.",
          "ok": false,
          "feedback": "That's a demo, not your life. The point is bringing a real, everyday task and actually using the result."
        },
        {
          "text": "I acted on a price, date, or medical tip immediately without checking it.",
          "ok": false,
          "feedback": "Careful — the AI predicts, it doesn't know. Before you act on anything that matters, read it with your own judgment and verify first."
        }
      ]
    }
  ]
};
