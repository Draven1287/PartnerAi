// Lesson 17 — AI Is Already in Your Apps
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-17",
  "num": 17,
  "arc": "Trust & Everyday AI",
  "title": "AI Is Already in Your Apps",
  "coreQuestion": "Where is AI already working quietly inside the apps I use every day, and how much should I trust each one?",
  "blurb": "You already use AI many times a day without noticing. Learn to spot it and decide how far to trust it.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You already used AI today",
      "scenario": "Before breakfast you typed a text and the keyboard guessed your next word. You searched your photos for 'dog' and it found them. A search gave you a little summary at the top. That's three times you used AI before you ever opened a chatbot on purpose.",
      "prompt": "Before you read on: name one app on your phone that you'd swear has 'no AI in it.' Hold that guess. By the end you may change your mind."
    },
    {
      "kind": "classify",
      "title": "Which of these is AI?",
      "prompt": "Sort each phone feature: is it AI (a model that learned patterns from examples and predicts what fits), or not?",
      "buckets": [
        "That's AI",
        "Not AI"
      ],
      "items": [
        {
          "text": "Your keyboard suggesting the next word as you type",
          "answer": 0
        },
        {
          "text": "Photo search finding pictures when you type 'beach'",
          "answer": 0
        },
        {
          "text": "The calculator app adding 7 + 5",
          "answer": 1
        },
        {
          "text": "'Suggested replies' offered under an email",
          "answer": 0
        },
        {
          "text": "The flashlight toggle turning the light on",
          "answer": 1
        },
        {
          "text": "The AI summary at the top of a web search",
          "answer": 0
        }
      ],
      "reveal": "The AI features all share one move: a model learned patterns from huge amounts of examples, then predicts what fits next — a word, a matching photo, a reply, a summary. The calculator and flashlight just follow fixed rules a person wrote; nothing was learned or predicted."
    },
    {
      "kind": "reveal",
      "title": "Same core move, different jobs",
      "body": "AI isn't only the chatbot you open on purpose. It's woven into apps you already had before you heard the word — doing small jobs in the background. Here's an honest note so your mental model stays accurate: when people say these features run on 'the same recipe,' that's a family resemblance, not one shared brain (flag it as an analogy). What's really happening: a vision model reads your photos, a speech model hears your voice, a language model writes the reply — each its own learned model. But they all share the same core move: learn patterns from examples, then predict what fits. And in 2026 these assistants can browse the web, use tools, and remember across chats — yet they can still sound confident and be wrong (a 'hallucination'). So the skill isn't starting to use AI; it's recognizing it and deciding how far to trust each one.",
      "mistake": "Assuming 'AI = the chatbot,' so you never question the summary, reply, or result an app quietly hands you.",
      "good": "Notice the AI, then match your trust to the task: a typo fix — trust it; a reply to your boss — read it first; a fact that matters — verify it, because it can be confidently wrong."
    },
    {
      "kind": "tryLive",
      "title": "Map the AI hiding in YOUR apps",
      "prompt": "I'm a beginner learning to notice AI in apps I already use. The apps and devices I use most are [list your real apps/devices]. For each one, tell me where AI is probably already working in the background, what small job it's doing, and — in one line each — whether I should trust that feature as-is or always double-check it before relying on it. Keep it plain, no jargon.",
      "note": "Fill the blank with your actual apps, e.g. 'an iPhone, Gmail, Google Search, WhatsApp, and the Photos app.' You only need app names — no account names, passwords, or personal details."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a Trust-Level card",
      "cardType": "Everyday-AI trust check",
      "fields": [
        {
          "key": "feature",
          "label": "The AI feature",
          "placeholder": "e.g. Photos search that finds 'dog'"
        },
        {
          "key": "job",
          "label": "The small job it's doing",
          "placeholder": "e.g. matching my typed word to what's in the picture"
        },
        {
          "key": "trust",
          "label": "Trust as-is or check first?",
          "placeholder": "e.g. Trust it — worst case I just re-search"
        },
        {
          "key": "reason",
          "label": "Why (the real reason)",
          "placeholder": "e.g. Low stakes; a wrong match costs me nothing"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do it on a fresh app",
      "question": "Open ONE app you did NOT use during this lesson, point to one AI feature, use it once on something new, and finish: 'This feature does ___, and for this task I'd ___ because ___.' Which answer shows you've actually done the skill?",
      "options": [
        {
          "text": "'Photos search finds pictures by what's in them; for finding my niece's birthday photos I'd trust it because a wrong match costs me nothing and I can just look.'",
          "ok": true,
          "feedback": "Yes — you named the feature, the job it does, and a real reason for your trust level, on a fresh example. That's the whole skill."
        },
        {
          "text": "'I think most apps probably have some AI in them somewhere these days.'",
          "ok": false,
          "feedback": "Too vague. Point to ONE feature, use it once, and give the job plus a real reason for your trust level."
        },
        {
          "text": "'AI is the chatbot, so this app doesn't really have any.'",
          "ok": false,
          "feedback": "That's the misconception this lesson fixes. Keyboards, photo search, suggested replies, and search summaries are all AI doing quiet background jobs."
        },
        {
          "text": "'The summary sounded confident, so I forwarded it to a friend as fact without checking.'",
          "ok": false,
          "feedback": "Confident isn't the same as correct — these can hallucinate. For a fact that matters, verify before you rely on it."
        }
      ]
    }
  ]
};
