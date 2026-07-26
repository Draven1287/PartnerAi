// Lesson 33 — Attention and Habits
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-33",
  "num": 33,
  "arc": "AI & Being Human",
  "title": "Attention and Habits",
  "coreQuestion": "How do I catch myself reaching for AI without deciding to, and set a limit that protects my focus?",
  "blurb": "You choose when the chat opens and when it closes. Catching the reach is what puts you back in charge.",
  "minutes": 13,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Did you decide, or did your hand just go?",
      "scenario": "You are revising. A question pops into your head.\n\nBefore you have even tried to answer it, the chat is open and you are typing.\n\nYou did not choose that. Your hand just went.",
      "prompt": "Think about the last time you opened an AI app. Did you decide to, or did it just happen? That gap is what this lesson is about."
    },
    {
      "kind": "reveal",
      "title": "The reach is trained, and you can retrain it",
      "body": "An AI chat answers a half-finished thought in a second. That makes asking the easiest move in the room.\n\nThe thing writing the answer does not want your attention. It wants nothing. But the app around it can still be built for you to come back a lot.\n\nEither way, a fast reward trains a habit. Get an answer quickly, feel better quickly, do it again tomorrow.\n\nThis is not a flaw in you. You can rebuild the moment. Name what sets it off. Do one thing yourself first. Then decide exactly when the chat is allowed in.\n\nThis lesson is about focus, not about your mental health. If the reaching is tied to feeling unsafe or hopeless, close the app and talk to a person.",
      "mistake": "Believing that more AI use means more done, and letting every reach happen without noticing it.",
      "good": "Noticing the reach as it happens, and choosing whether this is a moment you actually want the chat open."
    },
    {
      "kind": "classify",
      "title": "Automatic reach, or a real decision?",
      "prompt": "Sort each moment. Did the hand move before the brain decided, or did the person actually choose to open it?",
      "buckets": [
        "Automatic reach",
        "A real decision"
      ],
      "items": [
        {
          "text": "A question pops up while revising. The chat is open before you try to answer it.",
          "answer": 0
        },
        {
          "text": "You finish your own plan first, then open the chat to poke holes in it.",
          "answer": 1
        },
        {
          "text": "You open the chat the second you sit down, with no task in mind.",
          "answer": 0
        },
        {
          "text": "You decide to write the message yourself, then ask for one edit. You do exactly that.",
          "answer": 1
        },
        {
          "text": "You reach for the chat every time a reply feels slightly awkward to write.",
          "answer": 0
        }
      ],
      "reveal": "The automatic ones share one tell. The hand moved before you decided. The real decisions all have a moment of choosing in front of them. Catching that moment is the whole skill."
    },
    {
      "kind": "workflowChain",
      "title": "Build a pause you control",
      "goal": "You keep opening the chat while fixing a bike, before checking the manual or trying the next step. Put a small, realistic pause in order.",
      "correct": [
        "Name exactly what sets it off: a step feels uncertain and the chat opens by itself",
        "Pick one first move you can do alone: look at the part, reread the manual, write your best guess",
        "Set the rule for opening the chat: only after that first move, and only for one clear question",
        "Close it once you have the answer, and make the repair decision yourself",
        "Watch one sign for a week: more first tries happen before the chat opens"
      ],
      "note": "This is a design exercise, not a diagnosis and not a punishment. Pick a limit that protects your attention and still lets you use the app on purpose. No outside AI and no private details are needed."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your reach, limit and sign",
      "cardType": "Focus limit",
      "fields": [
        {
          "key": "reach",
          "label": "The automatic reach",
          "placeholder": "I open the chat the second a question appears, before trying it myself."
        },
        {
          "key": "when",
          "label": "When and where it happens",
          "placeholder": "Revising in the evening. The first 20 minutes at my desk."
        },
        {
          "key": "limit",
          "label": "One small limit I will set",
          "placeholder": "I try the question myself first, then ask."
        },
        {
          "key": "sign",
          "label": "One sign it is working",
          "placeholder": "I answer more questions on my own before the chat is even open."
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do the skill on something new",
      "question": "While planning meals for the week, you open the chat before checking what food is already in the house. Which response sets a limit you could actually test?",
      "options": [
        {
          "text": "Check what is already there, write a rough plan, then open the chat for one clear gap. Watch whether first tries start happening before the chat opens.",
          "ok": true,
          "feedback": "That is the full loop. What sets it off, a first move, a bounded use, and a sign you can see."
        },
        {
          "text": "Set a 25-minute timer for the task, then use the chat whenever it feels useful inside that time.",
          "ok": false,
          "feedback": "A timer helps you focus. It does not say when the chat is allowed in, or which thinking stays yours. Add a trigger and a first move."
        },
        {
          "text": "Delete the app so the automatic reach cannot happen at all.",
          "ok": false,
          "feedback": "Deleting it is a fair personal choice. It just does not practise using the thing on purpose, which is this lesson's skill."
        }
      ]
    }
  ]
};
