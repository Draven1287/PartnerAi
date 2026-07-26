// Lesson 36 — Everyday Wins: Finish the Small Stuff
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-36",
  "num": 36,
  "arc": "AI for Real Life",
  "title": "Everyday Wins: Finish the Small Stuff",
  "coreQuestion": "How do I use AI to finish the small messages and plans I keep putting off?",
  "blurb": "Get a draft in ten seconds. Make it sound like you. Then actually send it.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The message you keep avoiding",
      "scenario": "You told your friend Sam you would meet on Saturday. Now you have to cancel.\n\nThe text has sat unwritten for three days.\n\nIt is not hard. You just keep not doing it.",
      "prompt": "What matters most here? Sending it fast. Not hurting Sam. Keeping private details out. Finding a new day. Several matter. Which one comes first?"
    },
    {
      "kind": "reveal",
      "title": "A draft is a starting point, not the final word",
      "body": "When AI writes your message, it is not working out what your friendship needs. It has read a huge amount of writing, and it guesses words that fit the facts and tone you gave it.\n\nThat is why the draft arrives fast and smooth. It is also why it can sound like nobody, or promise something you cannot do.\n\nYou pick the goal. You decide what is true. You decide what stays private. You decide whether sending this could land badly on someone else.\n\nKeep what you type light. Say 'my friend' instead of a name. Say 'Saturday afternoon' instead of your whole week. No addresses, private messages, health details, or other people's business. What you type into an outside app leaves LearningAI.",
      "mistake": "Saving AI for big impressive jobs, then pasting whatever it writes straight into the chat, blank voice and all.",
      "good": "Pointing it at the tiny thing you have been dreading. Then changing at least one line so it sounds like you before it goes."
    },
    {
      "kind": "classify",
      "title": "What actually belongs in the box?",
      "prompt": "Sort each one. Is this a small real job it can help you finish, or something to keep out of the chat?",
      "buckets": [
        "Fine to draft",
        "Keep it out"
      ],
      "items": [
        {
          "text": "A text cancelling Saturday with a friend",
          "answer": 0
        },
        {
          "text": "A short message to a coach or a shift manager saying you will be late",
          "answer": 0
        },
        {
          "text": "Your friend's home address and full timetable, typed in 'so it is accurate'",
          "answer": 1
        },
        {
          "text": "A friendly note to a neighbour about when the fence gets fixed",
          "answer": 0
        },
        {
          "text": "A private health detail you would rather nobody knew, pasted in as background",
          "answer": 1
        }
      ],
      "reveal": "Everyday messages are exactly the right size for this. Just keep the facts thin. Who it is to and the timing is plenty. Private details never had to go in to get a good draft."
    },
    {
      "kind": "tryLive",
      "title": "Draft one real thing now",
      "prompt": "Help me write [a message I actually need to send]. Here is the situation: [who it is to, and what is true]. Make it sound [the tone] and keep it short. I will change it so it sounds like me.",
      "note": "A made-up situation works fine. Never hand over something private just to finish a lesson. Worked example: 'Help me write a text cancelling Saturday. Something came up. I still want to meet next week. Warm and direct. Do not invent an excuse or promise a date. Keep it short.' Read it for anything untrue, rewrite one line in your own words, then decide yourself whether to send it."
    },
    {
      "kind": "workflowChain",
      "title": "The five-step move",
      "goal": "Get one small real message drafted, make it sound like you, and actually send it.",
      "correct": [
        "Name the one small thing that has been nagging you",
        "Give it the facts and the tone you want",
        "Read the draft it writes",
        "Rewrite at least one line in words you would really say out loud",
        "Send the message, or start the plan for real"
      ],
      "note": "The last two steps keep the decision yours. A good ending might be sending it, saving it, ringing instead, or deciding it needs more care first. It can write words. It cannot carry what happens next."
    },
    {
      "kind": "toolkitSave",
      "title": "Save where the line sits",
      "cardType": "What stays my call",
      "fields": [
        { "key": "draft", "label": "What it may help draft", "placeholder": "A low-stakes message with private details left out" },
        { "key": "human", "label": "What stays my decision", "placeholder": "Whether, when, and how I contact the person" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually do it?",
      "question": "On a new low-stakes situation, you get a draft with private details left out, and you rewrite it. Which ending shows it helped without taking over the friendship?",
      "options": [
        {
          "text": "I checked every fact and promise, rewrote the main line in my own words, and then chose to send it, save it, or ring instead, based on how it would land.",
          "ok": true,
          "feedback": "Yes. Finishing is a decision with a reason behind it, not a reflex. The words are yours and you thought about the effect."
        },
        {
          "text": "The draft was true and warm, so I sent it after fixing the punctuation. I never thought about ringing instead.",
          "ok": false,
          "feedback": "True and warm is a good start. How you send it is part of the decision. A text, a call, or waiting can land very differently."
        },
        {
          "text": "I rewrote it in my own words and saved it, but left in a promise I am not sure I can keep.",
          "ok": false,
          "feedback": "Sounding like you does not fix a promise you might break. Cut it or soften it before you decide anything."
        },
        {
          "text": "I took the private details out and sent the short draft exactly as written, because speed mattered most.",
          "ok": false,
          "feedback": "Sending counts for something. Pasting it untouched skips the point: change one line so it sounds like you, not like anybody."
        }
      ]
    }
  ]
};
