// Lesson 15 — Who Is in Charge
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-15",
  "num": 15,
  "arc": "Talking to AI",
  "title": "Who Is in Charge",
  "coreQuestion": "If the AI does the work, who is actually in charge — and what stays my job?",
  "blurb": "The AI can do the busy middle. You hold the goal, the method, and the final check.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It did the work. So who decided?",
      "scenario": "You ask an assistant to write a thank-you note for a neighbor who watched your dog. It comes back in five seconds — polished, polite, done. You almost paste it as-is. But it opened with 'Dear valued neighbor,' which is not how you talk at all.",
      "prompt": "Before you read on: the AI typed the note. Does that mean the AI was in charge of it? What part of that task was never actually the AI's to decide?"
    },
    {
      "kind": "reveal",
      "title": "The AI does the middle. You hold the ends.",
      "body": "Here is what is really happening: an AI assistant learned patterns from huge amounts of human writing, and it works by predicting the likely next words — one after another — to fill in the middle of a task. In 2026 it can do real work: search the live web, take steps, and remember things across chats. But it still has no goal of its own, no idea what 'good enough' means for YOU, and it can still confidently make things up. (When we say the AI 'decides' or 'knows,' that is a comparison, not the real thing — underneath it is predicting words, it does not want or understand anything. That is exactly why the next part stays with you.) Three jobs are always yours: the GOAL (what you actually want), the METHOD (how you want it done), and the FINAL CHECK (you deciding it's right before you use it). Letting the AI type for you is not the same as letting it decide for you.",
      "mistake": "Handing over the whole task — 'write my thank-you note' — and pasting whatever comes back, treating the AI as if it knows what a good note means to you.",
      "good": "Handing over only the middle: you state the goal and method up front, let it draft, then run your own check before you trust a word of it."
    },
    {
      "kind": "classify",
      "title": "Whose job is it?",
      "prompt": "Sort each piece of a task into who it belongs to. The AI can do the busy middle; three things stay yours.",
      "buckets": [
        "The AI can do this",
        "Stays my job"
      ],
      "items": [
        {
          "text": "Deciding the note should sound warm and like me, not formal",
          "answer": 1
        },
        {
          "text": "Producing a first draft in a few seconds",
          "answer": 0
        },
        {
          "text": "Choosing that it stays under four sentences and mentions the cookies",
          "answer": 1
        },
        {
          "text": "Searching the web for how to phrase a tricky sentence",
          "answer": 0
        },
        {
          "text": "Reading the result against what I wanted and deciding it's right before I send it",
          "answer": 1
        }
      ],
      "reveal": "The AI happily does the drafting and the looking-up — the middle. But the goal (warm, like me), the method (short, mention the cookies), and the final check (is this actually what I wanted?) never left your hands. Those are the three ends you hold."
    },
    {
      "kind": "tryLive",
      "title": "Run one real task — keep the three jobs",
      "prompt": "Pick a small real thing you're doing right now. First write three lines: 'My goal is ___,' 'My method is ___,' 'I'll check it by ___.' THEN send this:\n\n\"Help me in the middle of this — do not decide it for me: [task]. My goal is [goal]. I'd like it done this way: [method]. Give me a draft I can review, then list 2–3 things I should double-check before I trust it.\"",
      "note": "Example fill-ins — task: 'write a short thank-you note to a neighbor who watched my dog.' goal: 'it sounds warm and like me, not formal or fake.' method: 'keep it under four sentences and mention the homemade cookies they sent over.' When the draft comes back, read it out loud against your goal and ask 'is this actually what I wanted?' The moment you're tempted to just accept it is the wheel — your check keeps your hands on it."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your 'three jobs' card",
      "cardType": "Staying in charge",
      "fields": [
        {
          "key": "goal",
          "label": "My goal",
          "placeholder": "What 'done well' means to me, in my words — the line the AI must not redraw"
        },
        {
          "key": "method",
          "label": "My method",
          "placeholder": "How I want it done, so the AI works my way (e.g. under four sentences, mention the cookies)"
        },
        {
          "key": "check",
          "label": "I'll check it by",
          "placeholder": "Exactly how I'll test the result before I trust it (e.g. read against my goal, verify each claim)"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you held the wheel",
      "question": "Take a brand-new task of your own — different from the thank-you note. Before typing a single prompt, you say all three lines, run it, and do your check. What proves you were actually in charge?",
      "options": [
        {
          "text": "You can point to the spot where you caught or corrected the AI — a place its draft missed your goal or method and you changed it.",
          "ok": true,
          "feedback": "Yes. That caught-and-corrected moment is the proof: you held the goal, the method, and the final check, and let the AI do only the middle."
        },
        {
          "text": "The AI's draft was so good you pasted it with no changes.",
          "ok": false,
          "feedback": "Pasting it untouched means you skipped your check. The AI can sound confident and still be wrong or off from what you wanted — the final call has to be yours, out loud, every time."
        },
        {
          "text": "You gave the AI the whole task and let it decide what 'done well' meant.",
          "ok": false,
          "feedback": "That hands over the goal, which is the one line the AI must not redraw. It has no idea what 'good enough' means for you — that stays your job."
        },
        {
          "text": "The task finished fast, so you didn't need to check anything.",
          "ok": false,
          "feedback": "Speed isn't a check. Fast and confident is exactly when it's easiest to skip your review — and when a made-up detail slips through. Run the check anyway."
        }
      ]
    }
  ]
};
