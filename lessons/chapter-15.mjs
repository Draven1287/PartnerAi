// Lesson 15 — Who Is in Charge
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-15",
  "num": 15,
  "arc": "Talking to AI",
  "title": "Who Is in Charge",
  "coreQuestion": "If the AI writes it, who is actually in charge, and which part is still my job?",
  "blurb": "AI can do the middle of a job. You keep the goal, the way you want it, and the last look.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It wrote the whole thing. So who decided?",
      "scenario": "Your gran sent you money for your birthday. You ask an AI app to write the thank-you message.\n\nFive seconds later it is there. Neat, polite, finished. You nearly send it.\n\nThen you read the first line. 'Dear valued family member.' You have never said that in your life.",
      "prompt": "The AI typed every word. Does that mean it was in charge? Which part of that job was never its to decide?"
    },
    {
      "kind": "reveal",
      "title": "It does the middle. You hold both ends.",
      "body": "The AI wrote every word and still decided nothing. Here is what it actually does.\n\nIt has read an enormous amount of human writing. When you type something, it guesses which words usually come next. Then the next. Then the next. That is the whole trick.\n\nSome apps can also search the web, or keep bits of your older chats. They are still guessing.\n\nSo it can fill in the middle of a job. It cannot want anything. It has no idea what counts as good to you.\n\nThree jobs stay yours.\n\nThe goal. What you actually want.\n\nThe way. How you want it done.\n\nThe last look. You reading it and saying yes before you use it.\n\nLetting it type for you is not the same as letting it decide for you.",
      "mistake": "Handing over the whole thing — 'write my thank-you message' — and sending back whatever turns up.",
      "good": "Handing over only the middle. You say the goal and the way. It drafts. You check it before it goes anywhere."
    },
    {
      "kind": "classify",
      "title": "Whose job is it?",
      "prompt": "Sort each piece of the job. AI can handle the busy middle. Three things stay with you.",
      "buckets": [
        "AI can do this",
        "Stays my job"
      ],
      "items": [
        {
          "text": "Deciding it should sound warm and like me, not stiff",
          "answer": 1
        },
        {
          "text": "Writing a first draft in five seconds",
          "answer": 0
        },
        {
          "text": "Choosing that it stays under four sentences and mentions the money",
          "answer": 1
        },
        {
          "text": "Looking up a nicer way to word one awkward line",
          "answer": 0
        },
        {
          "text": "Reading it against what I wanted and saying yes before I send it",
          "answer": 1
        }
      ],
      "reveal": "The drafting and the looking-up are the middle. AI is happy to do those. The goal (warm, like me), the way (short, mention the money), and the last look never left you. Those are the two ends you hold."
    },
    {
      "kind": "workflowChain",
      "title": "Mark where the job changes hands",
      "goal": "Use AI to help make a poster for the school charity match, without letting it make the calls that matter.",
      "correct": [
        "You decide who the poster is for and what it has to do",
        "You take out phone numbers and anything private a poster does not need",
        "AI writes a few different layouts to choose from",
        "You check the date, the rules, and how people get in",
        "You pick one, fix what is off, and say yes before it goes up"
      ],
      "choices": [
        "You check the date, the rules, and how people get in",
        "AI writes a few different layouts to choose from",
        "You pick one, fix what is off, and say yes before it goes up",
        "You take out phone numbers and anything private a poster does not need",
        "You decide who the poster is for and what it has to do"
      ],
      "note": "If an outside app writes the draft, your words leave LearningAI. Stick to facts a poster on a wall would show anyway. Do not paste lists of names, phone numbers, or private messages."
    },
    {
      "kind": "tryLive",
      "title": "Run one real job and keep the three parts",
      "prompt": "Pick one small real thing you have to do today. Write three lines first: 'My goal is ___.' 'The way I want it is ___.' 'I will check it by ___.' THEN send this:\n\n\"Help me with the middle of this. Do not decide it for me: [the job]. My goal is [goal]. I want it done this way: [the way]. Give me a draft I can read, then list 2 or 3 things I should double-check before I trust it.\"",
      "note": "Example fill-ins — job: 'write a short thank-you message to my gran for the birthday money.' goal: 'it sounds warm and like me, not stiff.' way: 'under four sentences, and mention what I am saving up for.' When the draft lands, read it out loud against your goal. Ask: is this what I actually wanted? The moment you feel like just sending it is the moment your check matters most. If the job is homework, ask it to walk you through the bit you are stuck on. Asking it to hand you the finished answer gives away the part that was meant to teach you."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your three-jobs card",
      "cardType": "Staying in charge",
      "fields": [
        {
          "key": "goal",
          "label": "My goal",
          "placeholder": "What done well means to me, in my own words"
        },
        {
          "key": "method",
          "label": "The way I want it",
          "placeholder": "How it should be done — under four sentences, mention the money"
        },
        {
          "key": "check",
          "label": "I will check it by",
          "placeholder": "How I test it before I trust it — read it against my goal, check each fact"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Show that you held the wheel",
      "question": "Take a brand-new job of your own, not the thank-you message. Say all three lines before you type anything. Run it, then do your check. What proves you were in charge?",
      "options": [
        {
          "text": "I can point at the spot where I caught something — a place the draft missed my goal or my way, and I changed it.",
          "ok": true,
          "feedback": "Yes. That caught-it moment is the proof. You held the goal, the way, and the last look, and let AI do only the middle."
        },
        {
          "text": "The draft was so good I sent it without changing anything.",
          "ok": false,
          "feedback": "Sending it untouched means you skipped your check. It can sound sure of itself and still be wrong, or just not what you wanted."
        },
        {
          "text": "I handed over the whole job and let the AI work out what good meant.",
          "ok": false,
          "feedback": "That gives away the goal, which is the one thing it must not decide. It has no idea what good means to you."
        },
        {
          "text": "It finished so fast that there was nothing left to check.",
          "ok": false,
          "feedback": "Speed is not a check. Fast and confident is exactly when a made-up detail slips past you. Read it anyway."
        }
      ]
    }
  ]
};
