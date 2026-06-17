// Lesson 10 — Better follow-ups
// Arc: Conversation & Prompting   (authored)
export default {
  "id": "chapter-10",
  "num": 10,
  "arc": "Conversation & Prompting",
  "title": "Better follow-ups",
  "coreQuestion": "How do I steer a conversation instead of restarting it?",
  "blurb": "Keep the 80% that worked and fix the 20% that didn’t — with one good follow-up.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer is fine. Not great.",
      "scenario": "You asked AI for help and the first answer is... okay. It’s 80% there. Most people do one of two things: accept the mediocre version, or delete everything and retype the whole question hoping for magic.",
      "prompt": "There’s a third move that beats both — and it’s one sentence. What would you say next?"
    },
    {
      "kind": "classify",
      "title": "Steer it, or start over?",
      "prompt": "Which of these keep the good answer and improve it — and which throw it all away?",
      "buckets": [
        "Steers what you have",
        "Restarts from scratch"
      ],
      "items": [
        {
          "text": "“Give me a concrete example a 9th grader would get.”",
          "answer": 0
        },
        {
          "text": "Delete the chat and retype the whole question a different way.",
          "answer": 1
        },
        {
          "text": "“Which part of that are you least sure about?”",
          "answer": 0
        },
        {
          "text": "Open a brand-new prompt because the answer was only 80% right.",
          "answer": 1
        }
      ],
      "reveal": "A good follow-up keeps the 80% that worked and fixes only the 20% that didn’t."
    },
    {
      "kind": "reveal",
      "title": "Follow-ups are steering, not restarting",
      "body": "The strongest follow-ups do one specific thing: ask for an example, request a critique, change the format, narrow the scope, or surface what’s uncertain. You’re editing a draft, not rolling the dice again.",
      "mistake": "Saying “make it better” — the AI has to guess what “better” means to you.",
      "good": "Name exactly what’s missing, then ask for just that one thing."
    },
    {
      "kind": "tryLive",
      "title": "Run a two-follow-up loop",
      "prompt": "Explain how a bill becomes a law in the US in one paragraph. Keep it simple but accurate.",
      "react": "Now don’t restart — send ONE follow-up that improves it (an example, a shorter format, or “which part are you least sure about?”). Paste the better answer and name what your follow-up changed.",
      "note": "The skill isn’t the first prompt. It’s the second one."
    },
    {
      "kind": "compare",
      "title": "Catch the lazy follow-up",
      "weak": "“Make it better.”",
      "strong": "“Shorten it to 3 bullets, keep the point about committees, and add one real-world example.”",
      "why": "The weak version makes the AI guess. The strong one names the format, what to keep, and what to add — so the next answer is steerable, not random."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your follow-up menu",
      "cardType": "Follow-up menu",
      "fields": [
        {
          "key": "clarify",
          "label": "When it’s vague, I ask…",
          "placeholder": "“Which part are you least sure about?”"
        },
        {
          "key": "example",
          "label": "When it’s abstract, I ask…",
          "placeholder": "“Give me one concrete example.”"
        },
        {
          "key": "format",
          "label": "When it’s messy, I ask…",
          "placeholder": "“Rewrite as 3 bullets.”"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "The AI’s answer is good but too long. What’s the best next move?",
      "options": [
        {
          "text": "Start a new chat and ask the question more carefully",
          "ok": false,
          "feedback": "You’d throw away an answer that was already mostly right."
        },
        {
          "text": "Reply “tighten this to 3 bullets, keep the second point”",
          "ok": true,
          "feedback": "Exactly — you steered the draft instead of gambling on a new one."
        },
        {
          "text": "Tell it “make it better”",
          "ok": false,
          "feedback": "“Better” is undefined — the AI just guesses what you meant."
        }
      ]
    }
  ]
};
