// Lesson 28 — Voice agents & interfaces
// Arc: Building   (authored)
export default {
  "id": "chapter-28",
  "num": 28,
  "arc": "Building",
  "title": "Voice agents & interfaces",
  "coreQuestion": "How does AI change when you talk to it instead of type?",
  "blurb": "Voice and new interfaces remove friction — and remove the pause where you’d normally check.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "“Hey — just do it.”",
      "scenario": "Typing makes you slow down and read. Talking to an AI — or tapping one button — feels instant and effortless. “Add it to my calendar.” “Text them I’m running late.” Done, before you’ve really checked what it did.",
      "prompt": "What do you gain with voice and one-tap interfaces — and what quietly disappears?"
    },
    {
      "kind": "classify",
      "title": "Friction: helpful or risky?",
      "prompt": "Removing friction is great for some things and dangerous for others. Sort them.",
      "buckets": [
        "Fine to make frictionless",
        "Keep a check here"
      ],
      "items": [
        {
          "text": "“Set a 10-minute timer.”",
          "answer": 0
        },
        {
          "text": "“Send this message to the whole group.”",
          "answer": 1
        },
        {
          "text": "“What’s the weather?”",
          "answer": 0
        },
        {
          "text": "“Buy it now with my saved card.”",
          "answer": 1
        }
      ],
      "reveal": "Low-stakes, easy-to-undo actions can be frictionless. Anything sent, shared, or paid for deserves a confirm."
    },
    {
      "kind": "reveal",
      "title": "Convenience removes the pause",
      "body": "Voice and simple interfaces are powerful because they remove friction — fewer steps between wanting something and getting it. But that same friction is where you’d normally catch a mistake: a misheard word, the wrong contact, an action you didn’t mean. Good voice design adds confirmation back for anything that matters.",
      "mistake": "Letting a voice assistant send, buy, or share without reading back what it understood.",
      "good": "For anything with consequences, make the interface confirm before it acts."
    },
    {
      "kind": "tryLive",
      "title": "Test the misunderstanding",
      "prompt": "Pretend you’re a voice assistant. I’ll give a spoken-style command and you’ll show me exactly what you understood and what you’d do BEFORE doing it. Command: [your command].",
      "react": "Did its “what I understood” match what you meant? Note where a misheard command could have caused a real problem."
    },
    {
      "kind": "verify",
      "title": "Catch the frictionless mistake",
      "claim": "A voice assistant: “Okay, I’ve texted your whole contact list that you’re quitting.” (you said “text Sam I’m quitting the group”)",
      "steps": [
        "Did it read back who and what before acting?",
        "Was this action easy to undo — or already sent?",
        "Where should a confirmation step have been?",
        "Which commands should always require a confirm?"
      ],
      "note": "The faster the interface, the more important the read-back before irreversible actions."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your voice-interface rule",
      "cardType": "Voice interface rule",
      "fields": [
        {
          "key": "frictionless",
          "label": "Frictionless is fine for…",
          "placeholder": "timers, info, easy undos"
        },
        {
          "key": "confirm",
          "label": "Always confirm before…",
          "placeholder": "send / buy / share / delete"
        },
        {
          "key": "readback",
          "label": "I want it to read back…",
          "placeholder": "who and what, before acting"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What should a well-designed voice assistant do before a high-impact action?",
      "options": [
        {
          "text": "Act instantly — that’s the whole point of voice",
          "ok": false,
          "feedback": "Instant is great until it sends the wrong thing to everyone."
        },
        {
          "text": "Read back what it understood and confirm before doing it",
          "ok": true,
          "feedback": "Right — add the pause back where consequences are real."
        },
        {
          "text": "Assume it heard correctly to keep things fast",
          "ok": false,
          "feedback": "Assuming is how a misheard word becomes a real mistake."
        }
      ]
    }
  ]
};
