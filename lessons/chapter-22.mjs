// Lesson 22 — Constraints That Actually Work
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-22",
  "num": 22,
  "arc": "Prompting Craft",
  "title": "Constraints That Actually Work",
  "coreQuestion": "Why do some limits I set get ignored while others hold — and how do I make one stick?",
  "blurb": "\"Keep it short\" gets ignored. \"Exactly 3 bullets\" holds — because you can check it.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You asked for short. You got an essay.",
      "scenario": "You typed \"keep it short\" and hit send. Back came five dense paragraphs. You did ask for a limit — so why did it steamroll right past it?",
      "prompt": "Before you read on: what's the difference between \"keep it short\" and \"exactly 3 bullet points\" — and which one do you think the AI actually obeys?"
    },
    {
      "kind": "reveal",
      "title": "A checkable constraint is one you can grade",
      "body": "A constraint is a rule you put on the answer: how long, what to leave out, what not to say. A CHECKABLE constraint is one you can verify by counting or looking — like \"exactly 3 bullets\" or \"don't use the word 'amazing'.\" Here's the mechanism: AI predicts the most likely next words from patterns in human writing. It isn't tallying items or measuring length as it goes. So a vague limit like \"keep it short\" has nothing to match against and slides off, while a countable one gives it a clear target to hit. One nuance: item counts (\"3 bullets\") tend to hold up more reliably than exact word counts, because the AI still isn't literally counting — which is exactly why the real skill isn't asking, it's CHECKING. Never assume it obeyed; count and scan every time.",
      "mistake": "Writing \"keep it short\" or \"be concise\" and hoping — a vibe the AI has nothing to grade itself against.",
      "good": "Writing \"exactly 3 bullet points\" and \"don't use the word 'synergy'\" — then counting the bullets and scanning for the word yourself."
    },
    {
      "kind": "classify",
      "title": "Checkable, or just a vibe?",
      "prompt": "Sort each limit: can you verify it afterward by counting or looking, or is it too vague to grade?",
      "buckets": [
        "Checkable",
        "Vague"
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
          "text": "Don't use the word 'utilize'",
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
          "text": "Don't be too technical",
          "answer": 1
        }
      ],
      "reveal": "Checkable limits give you something to count or scan for after the fact. Vague ones ('brief', 'professional', 'too technical') leave you nothing to grade — so they're the ones that quietly get ignored."
    },
    {
      "kind": "promptRepair",
      "title": "Swap the vibe for something countable",
      "weak": "Give me a short, quick rundown on what to check when buying a used bike. Keep it brief and don't make it too salesy.",
      "fields": [
        "Countable limit",
        "Banned word",
        "Question"
      ],
      "strong": "Answer this in exactly 3 bullet points. Do not use the word 'amazing'. Question: What should I look for when buying a used bike?"
    },
    {
      "kind": "tryLive",
      "title": "Run it, then grade it yourself",
      "prompt": "Answer this in [a countable limit]. Do not use the word [banned word]. Question: [your real question]",
      "note": "Fill the blanks with YOUR own request — not the bike one. A countable limit is something you can literally count afterward ('exactly 3 bullet points', 'one short paragraph'), not a vibe ('keep it brief'). Pick one specific banned word ('amazing', 'utilize', 'synergy'). Then do the verify step: count the bullets — is it really the number you asked for? — and Ctrl-F or eyeball the reply for the banned word. If it slipped, send one fix reply ('That was 4 bullets and used \"amazing\" — redo it in exactly 3 and drop that word') and watch it tighten."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your checkable-constraint recipe",
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
          "label": "How I'll check it",
          "placeholder": "count the bullets, then Ctrl-F the banned word"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it, don't hope it",
      "question": "You just ran a brand-new request with 'exactly 4 steps' and 'don't use the word simply'. The reply has 5 steps and uses 'simply' once. What's the move that shows you've got the skill?",
      "options": [
        {
          "text": "Report the check out loud — 'I counted 5 steps, it broke the limit, and \"simply\" was there' — then send one fix reply and re-verify.",
          "ok": true,
          "feedback": "Exactly. The skill is proving the result: you counted, you scanned, you caught the break, and you correct in one reply and check again."
        },
        {
          "text": "Accept it — the AI ignores limits anyway, so setting them was pointless.",
          "ok": false,
          "feedback": "That's the misconception this lesson fixes. Countable limits usually hold, and when one breaks you can catch it in five seconds and fix it in one reply."
        },
        {
          "text": "Assume it obeyed since you asked clearly, and move on without reading the reply.",
          "ok": false,
          "feedback": "Never assume it obeyed — the AI doesn't tally as it writes. The whole point is the verify step: count and scan every time."
        },
        {
          "text": "Rewrite the request as 'please keep it shorter and simpler' and resend.",
          "ok": false,
          "feedback": "That swaps your checkable limits back for vibes, which are exactly what gets ignored. Keep the countable limit and banned word, then verify."
        }
      ]
    }
  ]
};
