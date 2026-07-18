// Lesson 24 — Get It to Teach You
// Arc: Prompting Craft
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-24",
  "num": 24,
  "arc": "Prompting Craft",
  "title": "Get It to Teach You",
  "coreQuestion": "How do I use AI to actually learn a topic instead of just getting an answer I forget by tomorrow?",
  "blurb": "Turn an answer-dump into a step-by-step lesson, then prove you learned it by explaining it back.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You had the answer an hour ago",
      "scenario": "You asked an AI to explain how credit-card interest builds up. It gave you a clean, correct paragraph. You nodded, closed the tab, felt sorted. An hour later a friend asks you the same thing — and you can't actually say it. You had the answer. It just never made it into your head.",
      "prompt": "Before you read on: if you can't re-explain something an hour later, did you really learn it — or did you just watch it go by?"
    },
    {
      "kind": "classify",
      "title": "Answer-dump or learning?",
      "prompt": "Two things look the same on screen but land very differently. An ANSWER-DUMP is the full correct result handed to you in one block — nothing sticks. LEARNING is when the idea ends up in your head so you can say it back later. Sort each moment.",
      "buckets": [
        "Answer-dump",
        "Learning"
      ],
      "items": [
        {
          "text": "AI writes three tidy paragraphs; you copy them and move on.",
          "answer": 0
        },
        {
          "text": "AI teaches one small step, then pauses to check you followed.",
          "answer": 1
        },
        {
          "text": "You read a perfect explanation but can't repeat it an hour later.",
          "answer": 0
        },
        {
          "text": "You say the whole idea back in your own words from memory.",
          "answer": 1
        },
        {
          "text": "You get the right result fast and assume that means you learned it.",
          "answer": 0
        }
      ],
      "reveal": "Speed and correctness are not the same as understanding. Having the answer and understanding the answer are two different things — and only one of them is still there tomorrow."
    },
    {
      "kind": "reveal",
      "title": "Make it teach you, then check you",
      "body": "Remember the core idea: AI predicts the most likely next words from patterns in huge amounts of human writing. Because it has seen countless explanations, it can walk you through an idea one small step at a time and check your wording against those patterns. It's natural to call this 'having a tutor,' and that comparison is useful — but here's what's really happening: the AI isn't a person who knows you or cares whether you pass. It predicts helpful-sounding next words, which means it can also state something wrong with total confidence. That is exactly why the explain-back step matters. You're not trusting it to pour knowledge in — you're using it to surface what's still fuzzy in your own head, and YOU stay the judge of whether the explanation is right.",
      "mistake": "Ask for the answer, read it, feel done — and confuse 'I saw a good explanation' with 'I understand this.'",
      "good": "Ask it to teach in small steps, pause and check you after each one, then explain the whole idea back in your own words and let it flag the one part you got wrong."
    },
    {
      "kind": "tryLive",
      "title": "Run the teaching loop",
      "prompt": "I want to actually understand [the topic], not just get the answer. Teach it to me in small steps. After each step, pause and ask me one quick question to check I followed — wait for my reply before going on. When we're done, ask me to explain the whole idea back in my own words, then tell me the one part I got wrong or left out and help me fix it. Assume I'm a [your starting level].",
      "note": "Pick one topic you recently got an answer to but couldn't re-explain. Fill [the topic] with a single idea (e.g. 'how credit-card interest adds up month to month') and [your starting level] with where to pitch it (e.g. 'complete beginner — I know what a credit card is but nothing about interest'). Read one step, answer its check honestly, and at the end type the idea back WITHOUT scrolling up. The moment it corrects your version is the moment you actually learn it. It can still state something wrong confidently, so stay the judge."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your tutor prompt",
      "cardType": "Teach-Me Loop",
      "fields": [
        {
          "key": "topic",
          "label": "Topic to actually understand",
          "placeholder": "how credit-card interest adds up month to month"
        },
        {
          "key": "level",
          "label": "Your starting level",
          "placeholder": "complete beginner — know what a credit card is but nothing about interest"
        },
        {
          "key": "checkStep",
          "label": "The check that makes it stick",
          "placeholder": "pause after each step; explain the whole idea back from memory at the end"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a brand-new topic",
      "question": "Pick a topic you haven't touched today — a setting on your phone, a rule in a card game, why bread rises. Run the teaching loop, then close your eyes and explain the finished idea back in your own words from memory. What tells you it worked?",
      "options": [
        {
          "text": "I explained it back correctly from memory — either first try or after fixing the one part it flagged.",
          "ok": true,
          "feedback": "That's the win. The correction, or a clean first-try recall, means the idea is in your head — not just on your screen."
        },
        {
          "text": "The AI's written explanation looked complete and correct, so I'm done.",
          "ok": false,
          "feedback": "A perfect explanation on screen is still an answer-dump. You only pass when YOU can say it back without peeking."
        },
        {
          "text": "I couldn't say it back without scrolling up to reread.",
          "ok": false,
          "feedback": "That means you got an answer-dump, not learning. Run the loop again — the explain-back step is where it sticks."
        },
        {
          "text": "I got the answer really fast, so I definitely learned it.",
          "ok": false,
          "feedback": "Fast and correct isn't the same as understood. Test it by explaining it back from memory tomorrow."
        }
      ]
    }
  ]
};
