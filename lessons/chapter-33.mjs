// Lesson 33 — Attention and Habits
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-33",
  "num": 33,
  "arc": "AI & Being Human",
  "title": "Attention and Habits",
  "coreQuestion": "How do I catch the autopilot reach for AI and set a limit that protects my focus?",
  "blurb": "You decide when to open AI and when to close it — noticing the reach puts you back in charge.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Did you decide, or did your hand just go there?",
      "scenario": "You're studying. A question pops into your head. Before you've even tried to answer it yourself, the chat is already open and you're typing. You didn't choose that — your hand just went.",
      "prompt": "Think about the last time you opened an AI tool. Did you actually decide to, or did it just happen? That gap between deciding and reaching is what this lesson is about."
    },
    {
      "kind": "reveal",
      "title": "The reach is built in — and you can re-train it",
      "body": "AI assistants respond quickly to half-formed thoughts, which can make asking the easiest next move. The model itself does not want your attention, but a product may still be designed for repeated use. Either way, a fast reward can train a habit. This is not a character flaw: you can redesign the moment by naming the trigger, doing one first move yourself, and setting a clear boundary for when the tool enters. This lesson is about focus, not mental-health diagnosis. If the reaching is tied to feeling unsafe, hopeless, or at risk of harm, stop using the app and contact human support.",
      "mistake": "Believing 'more AI use means I'm getting more done' — and letting every reach happen on autopilot.",
      "good": "Noticing the reach as it happens, and choosing whether this is a moment you actually want to open the tool."
    },
    {
      "kind": "classify",
      "title": "Reach on autopilot, or a real decision?",
      "prompt": "Sort each moment: was the person on autopilot (hand went before brain decided), or did they actually decide to open AI?",
      "buckets": [
        "Autopilot reach",
        "A real decision"
      ],
      "items": [
        {
          "text": "A question pops up while studying and the chat is open before you try answering it yourself.",
          "answer": 0
        },
        {
          "text": "You finish your own outline first, then open the chat to pressure-test it.",
          "answer": 1
        },
        {
          "text": "You open AI the second you sit at your desk, without a task in mind.",
          "answer": 0
        },
        {
          "text": "You decide 'I'll draft this email myself, then ask for one edit,' and do exactly that.",
          "answer": 1
        },
        {
          "text": "You reach for the chat every time a message feels slightly hard to reply to.",
          "answer": 0
        }
      ],
      "reveal": "The autopilot reaches share one tell: your hand moved before you decided. The real decisions all have a moment of choosing in front of them. Catching that moment is the whole skill."
    },
    {
      "kind": "workflowChain",
      "title": "Build a pause you control",
      "goal": "You keep opening AI while repairing a bike, before checking the manual or trying the next step. Put a small, realistic pause plan in order.",
      "correct": [
        "Name the exact trigger: a step feels uncertain and the chat opens automatically",
        "Choose a short first move you can do without AI: inspect the part, reread the manual, or write your best next step",
        "Set the boundary for opening AI: only after the first move, and only for one defined question",
        "Close the tool after the answer and make the final repair decision yourself",
        "Watch one sign for a week: more first attempts happen before the chat opens"
      ],
      "note": "This is a design exercise, not a diagnosis or a punishment. Pick a boundary that protects attention and still lets you use the tool deliberately. No external AI or personal disclosure is required."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your reach, limit, and sign",
      "cardType": "Focus limit",
      "fields": [
        {
          "key": "reach",
          "label": "The autopilot reach",
          "placeholder": "I open the chat the second a question pops into my head, before I've even tried to answer it myself."
        },
        {
          "key": "when",
          "label": "When / where it happens",
          "placeholder": "Studying in the evening; the first 20 minutes at my desk."
        },
        {
          "key": "limit",
          "label": "One small limit I'll set",
          "placeholder": "I try the question myself first, then ask."
        },
        {
          "key": "sign",
          "label": "One sign it's working",
          "placeholder": "I answer more questions on my own before the chat is even open."
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do the skill on a fresh example",
      "question": "Fresh scenario: while planning meals, you open AI before checking what food is already at home. Which response shows a deliberate, testable boundary?",
      "options": [
        {
          "text": "Check what is already available, write a rough meal idea, then open AI for one defined gap; track whether first attempts happen before the chat opens.",
          "ok": true,
          "feedback": "That's the complete loop: trigger, first move, bounded use, and a visible sign of change."
        },
        {
          "text": "Set a 25-minute timer for the whole task, then use AI whenever it feels useful inside that time.",
          "ok": false,
          "feedback": "A timer can help focus, but it does not define when AI should enter or what thinking remains yours. Add a trigger and first move."
        },
        {
          "text": "Remove the AI app completely so the automatic reach cannot happen.",
          "ok": false,
          "feedback": "Removal may be a valid personal choice, but it does not practice deliberate use. This lesson's skill is choosing a boundary you can explain and test."
        }
      ]
    }
  ]
};
