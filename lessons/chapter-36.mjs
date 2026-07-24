// Lesson 36 — Everyday Wins: Finish the Small Stuff
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-36",
  "num": 36,
  "arc": "AI for Real Life",
  "title": "Everyday Wins: Finish the Small Stuff",
  "coreQuestion": "How do I use AI to finish the small everyday messages and plans I keep putting off?",
  "blurb": "Turn an AI draft into something that sounds like you, then actually send it.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The message you keep avoiding",
      "scenario": "You told your friend Sam you'd hang out Saturday, but work blew up and now you need to cancel. The text has sat unwritten for three days. It's not hard. You just keep not doing it.",
      "prompt": "Choose what matters most here: sending quickly, protecting the friendship, keeping private details out, or finding a new date. More than one matters; which one sets your first constraint?"
    },
    {
      "kind": "reveal",
      "title": "A draft is a starting point, not the final word",
      "body": "When an AI writes a message, it is not deciding what the relationship needs. It predicts wording that fits the facts and tone you supplied. That is why a draft arrives fast and smooth, and why it may sound generic or make the wrong promise. You choose the goal, the truth, the boundary, and whether sending it could affect another person. Keep inputs light: use roles instead of names, general timing instead of a full schedule, and no addresses, private messages, health details, or another person's information. Data entered into an outside assistant leaves LearningAI.",
      "mistake": "Saving AI only for big, impressive tasks and copy-pasting whatever draft it gives you, generic voice and all.",
      "good": "Aiming it at the tiny thing you've been dreading — the awkward cancellation, the reply you owe — then changing at least one line so it sounds like you before you send it."
    },
    {
      "kind": "classify",
      "title": "What actually belongs in the box?",
      "prompt": "Sort each thing by whether it's the kind of small, real task AI is great for helping you finish — or something to keep out of the chat.",
      "buckets": [
        "Good everyday task to draft",
        "Keep it out"
      ],
      "items": [
        {
          "text": "A text canceling Saturday's plans with a friend",
          "answer": 0
        },
        {
          "text": "A short message to a coach, shift lead, or instructor about being late",
          "answer": 0
        },
        {
          "text": "Your friend's home address and full schedule, typed in 'so it's accurate'",
          "answer": 1
        },
        {
          "text": "A friendly note to a neighbor about a fence-repair date",
          "answer": 0
        },
        {
          "text": "A private medical detail you'd rather not share, pasted in for context",
          "answer": 1
        }
      ],
      "reveal": "The everyday messages are exactly the sweet spot. But keep the facts light: who it's to and the scheduling details are enough. Sensitive personal info doesn't need to go in the chat to get a good draft."
    },
    {
      "kind": "tryLive",
      "title": "Draft one real thing now",
      "prompt": "Help me write [a real message I need to send]. Here's the situation: [the facts — who it's to and what's true]. Make it sound [the tone] and keep it short. Then I'll tweak it to sound like me.",
      "note": "A made-up situation works; do not reveal something private just to finish the lesson. Worked example: 'Help me write a text canceling Saturday's plans. Something came up; I still want to reschedule next week. Make it warm and direct, do not invent an excuse or promise a date, and keep it short.' Read it for truth, rewrite one line in your voice, and decide yourself whether it should be sent."
    },
    {
      "kind": "workflowChain",
      "title": "The five-step move",
      "goal": "Get a small real message drafted, make it sound like you, and actually send it.",
      "correct": [
        "Name the one small thing that's been nagging you",
        "Tell the AI the facts and the tone you want",
        "Read the draft it writes",
        "Rewrite at least one line in words you'd really say out loud",
        "Actually send the message or set the plan in motion"
      ],
      "note": "The last two steps keep the decision yours. A useful outcome may be sending, saving a draft, speaking directly, or deciding not to send yet because the relationship needs more care. AI can draft wording; it cannot approve the consequence for you."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your relationship boundary",
      "cardType": "Human decision check",
      "fields": [
        { "key": "draft", "label": "What AI may help draft", "placeholder": "A low-stakes message with private details removed" },
        { "key": "human", "label": "What stays my decision", "placeholder": "Whether, when, and how I contact the person" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually do it?",
      "question": "On a fresh low-stakes situation, you get a redacted draft and rewrite it. Which outcome shows that the tool helped without taking over the relationship decision?",
      "options": [
        {
          "text": "I checked every fact and promise, rewrote the key line in my voice, and chose to send, save, or speak directly based on the likely effect on the person.",
          "ok": true,
          "feedback": "Yes. Completion is a human decision with reasons, not automatic sending. The wording is yours and the likely consequence was considered."
        },
        {
          "text": "The draft is accurate and warm, so I sent it after changing punctuation but did not consider whether a call would be kinder.",
          "ok": false,
          "feedback": "Accuracy and warmth help, but the medium is part of the decision. Pause and choose whether text, a call, or waiting best protects the relationship."
        },
        {
          "text": "I rewrote the message in my voice and saved it, but left in a promise I am not sure I can keep.",
          "ok": false,
          "feedback": "Voice is not enough if the message makes an uncertain promise. Remove or qualify it before you decide what to do."
        },
        {
          "text": "I removed private details and sent the short draft unchanged because speed mattered most.",
          "ok": false,
          "feedback": "Sending counts, but pasting it verbatim skips the point: change at least one line so it sounds like you, not anyone."
        }
      ]
    }
  ]
};
