// Lesson 18 — A Daily Habit, Not a Crutch
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-18",
  "num": 18,
  "arc": "Trust & Everyday AI",
  "title": "A Daily Habit, Not a Crutch",
  "coreQuestion": "How do I use AI every day so my own thinking gets sharper instead of switching off?",
  "blurb": "Use AI often, without handing over the part you wanted your own brain to learn.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Two ways to use the same app",
      "scenario": "Your friend's mum has driven you to football three weekends running. You owe her a thank-you text.\n\nYou could type 'write a thank-you text' and send back whatever appears. Or you could write a rough one yourself, then ask AI to tighten it.\n\nSame job. Same app. Same five minutes.",
      "prompt": "After each of those, which one leaves something behind in your head? A sentence you shaped, a choice you made. Say it in one line."
    },
    {
      "kind": "classify",
      "title": "Crutch, or coach?",
      "prompt": "Underneath, the AI is guessing likely next words either way. What changes is what you ask for. Sort each one: does it think for you, or does it make you think and then help?",
      "buckets": [
        "Crutch — it thinks, I copy",
        "Coach — I think, it helps"
      ],
      "items": [
        {
          "text": "\"Write my whole essay on this book.\"",
          "answer": 0
        },
        {
          "text": "\"I will write the reply first. Then show me two lines I could cut.\"",
          "answer": 1
        },
        {
          "text": "\"Just give me the answer to this maths question.\"",
          "answer": 0
        },
        {
          "text": "\"Ask me a question that shows whether I actually understood the chapter.\"",
          "answer": 1
        },
        {
          "text": "\"Rewrite this so it sounds clever. I do not want to touch it.\"",
          "answer": 0
        },
        {
          "text": "\"Wait for my attempt, then tell me one thing to fix next time.\"",
          "answer": 1
        }
      ],
      "reveal": "Same machine, different instructions. Crutch and coach are a comparison to help you feel the difference. They are not a claim about what is going on inside. These apps can search, take several steps, and sometimes keep bits of old chats. None of that lets them choose which of your own skills you want to protect. You draw that line."
    },
    {
      "kind": "reveal",
      "title": "A good habit ends with your brain switched on",
      "body": "Using AI every day does not make you lazy on its own. It depends entirely on how you use it.\n\nHere is what it does. It has read an enormous amount of human writing, and it guesses the words that usually come next. Ask it to do the job, and it does the job. Your brain stays off.\n\nAsk it to make you try first and only then help, and it waits. Your brain stays on.\n\nA good habit is one that leaves your thinking sharper afterwards, not switched off.\n\nOne more thing. AI is not a friend, and it is not a doctor or a counsellor. For anything about your health, your safety, or a hard personal decision, bring in a real person you trust.",
      "mistake": "\"Write this for me.\" You paste the result, learn nothing, and the skill never becomes yours.",
      "good": "\"I will do my part first, then you help.\" You keep one step for yourself, so the skill stays yours."
    },
    {
      "kind": "tryLive",
      "title": "Run your coach habit once, now",
      "prompt": "This step uses an outside app, so anything you type leaves LearningAI. Use a made-up example. Do not paste names, private messages, school details, or anyone else's information. I want a 5-minute habit that makes me sharper at [an area, for example writing clear messages] instead of dependent on you. Don't do the work for me — make me try first, then coach me. The one step I will always do myself is: [your step]. Give me one small practice task, wait for my try, then point out one thing worth improving.",
      "note": "Pick an ordinary practice task: a pretend reply to a customer, a made-up thank-you, a plan for a game, a short explanation of something you learned. Do your attempt before it helps. If it jumps in early, say: 'Stop. Wait for my attempt first.'"
    },
    {
      "kind": "toolkitSave",
      "title": "Save your daily habit card",
      "cardType": "AI habit + guardrail",
      "fields": [
        {
          "key": "area",
          "label": "What I want to get genuinely better at",
          "placeholder": "writing clear messages"
        },
        {
          "key": "habit",
          "label": "My one small coach-style habit, done daily",
          "placeholder": "write it myself first, then ask AI to tighten it"
        },
        {
          "key": "guardrail",
          "label": "The one step I refuse to hand over",
          "placeholder": "I always write the first version before I show it to AI"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you do a part it did not?",
      "question": "Tomorrow, on a new real job, you run your habit and hold that one step for yourself. Afterwards, which sentence means you got it right?",
      "options": [
        {
          "text": "\"I wrote the whole message myself. AI trimmed two wordy lines, and I kept my own opening.\"",
          "ok": true,
          "feedback": "That is the win. You can name a specific thing you did that it did not. The skill stayed yours."
        },
        {
          "text": "\"I gave it my main points, let it write the message, then changed the opening and sent it.\"",
          "ok": false,
          "feedback": "You made a small edit, but it still did the very thing you meant to practise. Keep either the first real attempt or the final decision."
        },
        {
          "text": "\"I asked for three versions, picked the one I liked, and rewrote one sentence.\"",
          "ok": false,
          "feedback": "Picking is a real decision, but it is not practice at writing. If writing is the skill you want, make your own rough version first."
        }
      ]
    }
  ]
};
