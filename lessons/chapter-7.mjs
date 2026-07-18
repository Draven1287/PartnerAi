// Lesson 7 — Confidently Wrong
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-7",
  "num": 7,
  "arc": "How It Works",
  "title": "Confidently Wrong",
  "coreQuestion": "Why can AI sound completely certain and still be wrong — and what should I do about it?",
  "blurb": "A made-up detail sounds just as sure as a true one. You can't feel the difference — you have to check.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The smooth wrong answer",
      "scenario": "You ask an AI about your own hometown. It replies with dates, names, and numbers — fluent, specific, and totally sure of itself. One of those \"facts\" is invented. Nothing in the wording gives it away. It reads exactly like the true parts.",
      "prompt": "Before you read on: if the AI were making something up, would it sound less sure? Jot down your honest guess."
    },
    {
      "kind": "reveal",
      "title": "Meet the word: hallucination",
      "body": "When an AI states something false as if it were fact, that's called a hallucination. It isn't lying — lying needs intent, and there's no little \"it\" inside deciding to deceive you. Here's the real mechanism, not a put-down: an AI works by predicting the most likely next words, one after another, from patterns it learned in huge amounts of human writing. Its target is to sound plausible. Whether something is true is a separate question it has no built-in way to check. It also has no internal \"I don't know\" light, so when it hits a gap in what it knows, it confidently fills that gap with whatever fits the pattern. That smooth gap-filling is the hallucination. And in 2026, modern assistants can browse the live web, use tools, and remember across chats — which helps — but it does NOT cure this. They still hallucinate. So you still check.",
      "mistake": "Trusting an answer because it sounded confident and specific — treating \"it sounded sure\" as a reason to believe it.",
      "good": "Treating confidence as worthless evidence of truth. A made-up detail comes out just as smooth and specific as a real one, so you verify instead of feeling it out."
    },
    {
      "kind": "classify",
      "title": "Where is it most tempted to invent?",
      "prompt": "You want to catch a hallucination on purpose. Sort each topic by how likely the AI is to slip when you can immediately check its answer.",
      "buckets": [
        "Easy to catch a slip",
        "Hard to catch a slip"
      ],
      "items": [
        {
          "text": "The history of the small town where you grew up",
          "answer": 0
        },
        {
          "text": "A recipe you've cooked dozens of times",
          "answer": 0
        },
        {
          "text": "A band you love — its exact album release dates",
          "answer": 0
        },
        {
          "text": "A broad topic you barely know, like \"the history of France\"",
          "answer": 1
        },
        {
          "text": "Your own field of work and its specific figures",
          "answer": 0
        },
        {
          "text": "A general definition anyone could look up in a second",
          "answer": 1
        }
      ],
      "reveal": "Narrow, personal topics — your town, your hobby, your job — are exactly where the AI is most tempted to invent, and where YOU can spot the slip instantly because you already know the truth. Broad or generic topics are harder to catch: either you can't tell, or it's easy to get right."
    },
    {
      "kind": "tryLive",
      "title": "Catch one yourself",
      "prompt": "Tell me everything you know about [a topic you personally know very well], including any specific dates, names, or numbers. Be detailed.",
      "note": "Fill the blank with something small and specific where YOU are the expert — \"the small town of Marshall where I grew up, its history and any famous people from there,\" not \"small towns.\" Keep it to public facts or info about yourself — no other people's private details. Read the answer slowly and hunt for the one detail that's off: a wrong date, a name it muddled, a fact that's close but not quite. When you find it, notice how confident that wrong sentence sounded. That confidence was worth nothing. That's the whole lesson, proven by you."
    },
    {
      "kind": "verify",
      "title": "The real move: check the one detail",
      "claim": "An AI answer about a topic you know well contains a suspiciously exact fact — say, \"the town was founded in 1847\" or \"their debut album dropped in March 2009.\"",
      "steps": [
        "Point to the ONE detail most likely to be wrong and say out loud why you doubt it — \"that date feels too exact,\" \"I've never heard that name.\"",
        "Check that single detail somewhere independent: your own memory, a quick search, or a person who'd know.",
        "Report whether it held up. It's fine if the AI turns out right — the skill is checking, not catching."
      ],
      "note": "This is not about trapping the AI. It's about building the reflex to verify before you repeat, quote, or hand something in."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your confidently-wrong card",
      "cardType": "Trust check",
      "fields": [
        {
          "key": "topic",
          "label": "A topic I know cold",
          "placeholder": "e.g. the small town where I grew up"
        },
        {
          "key": "suspect",
          "label": "The detail I'd doubt first",
          "placeholder": "e.g. an exact founding date or a name I've never heard"
        },
        {
          "key": "checkWith",
          "label": "Where I'll verify it independently",
          "placeholder": "e.g. my own memory, a quick search, someone who'd know"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove the skill",
      "question": "On a brand-new topic you know well — a recipe you've made for years, a place you've lived, a movie you've seen ten times — you ask the AI the same way and it gives a confident, detailed answer. What's the move that means you've got this?",
      "options": [
        {
          "text": "Point to the single detail I doubt most, say why, then check it independently and report whether it held up.",
          "ok": true,
          "feedback": "That's it. Naming a suspect detail AND actually verifying it is the whole skill — even if the AI turns out right. Checking, not catching."
        },
        {
          "text": "Skim it, and since it sounded sure and specific, take it as correct.",
          "ok": false,
          "feedback": "That's the exact trap. A made-up detail sounds just as sure as a true one — confidence proves nothing. You have to check."
        },
        {
          "text": "Assume everything the AI said is a hallucination and throw the whole answer out.",
          "ok": false,
          "feedback": "Too far the other way. The skill isn't distrusting everything — it's isolating a suspect detail and verifying that one thing."
        },
        {
          "text": "Ask the AI \"are you sure?\" and trust it if it says yes.",
          "ok": false,
          "feedback": "It has no internal \"I don't know\" light — it'll often re-confirm a made-up fact just as smoothly. Check independently instead."
        }
      ]
    }
  ]
};
