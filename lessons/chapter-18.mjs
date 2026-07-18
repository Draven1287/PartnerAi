// Lesson 18 — A Daily Habit, Not a Crutch
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-18",
  "num": 18,
  "arc": "Trust & Everyday AI",
  "title": "A Daily Habit, Not a Crutch",
  "coreQuestion": "How do I use AI every day in a way that makes my own thinking sharper instead of switching my brain off?",
  "blurb": "The same AI can leave your brain off or on — the difference is entirely in how you ask.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Two ways to use the same tool",
      "scenario": "You need to text your neighbor a thank-you for watering your plants. You could type 'write a thank-you text to my neighbor' and paste whatever comes back. Or you could write a rough draft yourself, then ask AI to tighten it. Same task, same tool, same five minutes.",
      "prompt": "Before you read on: after each of those two ways, which one leaves something behind in YOUR head — a sentence you shaped, a choice you made? Say it in one line."
    },
    {
      "kind": "classify",
      "title": "Crutch use or coach use?",
      "prompt": "Underneath, the AI is just predicting likely next words either way. What changes is your instruction. Sort each way of asking: does the AI do the thinking for you (crutch), or does it make YOU do the thinking and only then help (coach)?",
      "buckets": [
        "Crutch (it thinks, you copy)",
        "Coach (you think, it helps)"
      ],
      "items": [
        {
          "text": "\"Write my whole essay on this book.\"",
          "answer": 0
        },
        {
          "text": "\"I'll draft the reply first — then point out two lines I could cut.\"",
          "answer": 1
        },
        {
          "text": "\"Just give me the answer to this math problem.\"",
          "answer": 0
        },
        {
          "text": "\"Ask me a question that checks if I actually understood the chapter.\"",
          "answer": 1
        },
        {
          "text": "\"Rewrite this so it sounds smart, I don't want to touch it.\"",
          "answer": 0
        },
        {
          "text": "\"Wait for my try, then tell me one thing to fix next time.\"",
          "answer": 1
        }
      ],
      "reveal": "Same machine, different instructions. 'Crutch' and 'coach' are a comparison to help you feel the difference — not a claim about what the AI is doing inside. The AI is genuinely capable in 2026: it can search the live web, take steps, use tools, and remember across chats. But it still has no idea what YOU are trying to get better at, and it can still hallucinate. So you have to build that into how you ask."
    },
    {
      "kind": "reveal",
      "title": "A good habit ends with your brain working",
      "body": "Using AI every day does not make you lazy by itself. It depends entirely on HOW you use it. The tool learned patterns from huge amounts of human writing and works by predicting the likely next words to fill in whatever you ask. Ask it to do the task, and it does the task — your brain stays off. Ask it to make you try first and only then coach you, and it waits — your brain stays on. A good AI habit is one that ends with YOUR thinking sharper, not switched off. Note: AI is not a friend, therapist, or a stand-in for a professional — for anything about your health, safety, or a hard personal decision, keep a real human in the loop and defer to professionals.",
      "mistake": "\"Write this for me\" — you paste the result, learn nothing, and the skill never becomes yours.",
      "good": "\"I'll do my part first, THEN you coach me\" — you keep one step for yourself, so the skill stays yours."
    },
    {
      "kind": "tryLive",
      "title": "Run your coach habit once, right now",
      "prompt": "I want a 5-minute daily habit, using you, that makes me sharper at [an area, e.g. writing clear messages] instead of dependent. Don't do the work for me — make me try first, then coach me. My guardrail is: [the one step I'll always do myself, e.g. I always write the first draft before I show it to you]. Start now: give me one small thing to attempt for [today's real example, e.g. a thank-you text to my neighbor who watered my plants], wait for my try, then improve it and tell me one thing to fix next time.",
      "note": "Use a REAL thing from today, not a hypothetical — that's what makes the habit live. Do your try before you let it help. If it jumps in and does the whole thing anyway, remind it: 'wait for my attempt first.'"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your daily habit card",
      "cardType": "AI habit + guardrail",
      "fields": [
        {
          "key": "area",
          "label": "Area I want to get genuinely better at",
          "placeholder": "writing clear messages"
        },
        {
          "key": "habit",
          "label": "My one tiny coach-style habit (do it daily)",
          "placeholder": "draft it myself first, then ask AI to tighten it"
        },
        {
          "key": "guardrail",
          "label": "My guardrail — the one step I refuse to hand over",
          "placeholder": "I always write the first draft before I show it to AI"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did YOU do a part the AI didn't?",
      "question": "Tomorrow, on a NEW real task (not the one you just practiced), you run your habit with the guardrail held. Afterward, which sentence means you did it right?",
      "options": [
        {
          "text": "\"I wrote the whole message myself; AI only trimmed two wordy lines, and I kept my own greeting.\"",
          "ok": true,
          "feedback": "That's the win. You can name a specific thing YOU did that the AI didn't — the skill stayed yours."
        },
        {
          "text": "\"The AI wrote all of it and I sent it.\"",
          "ok": false,
          "feedback": "The guardrail slipped. If the only honest answer is 'the AI did all of it,' redo it and keep your one step for yourself."
        },
        {
          "text": "\"I didn't run it on a new task — I just reread yesterday's.\"",
          "ok": false,
          "feedback": "The check is about DOING the habit on a fresh, real task — that's the only way you find out if the guardrail holds."
        }
      ]
    }
  ]
};
