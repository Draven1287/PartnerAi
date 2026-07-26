// Lesson 20 — Models, Tools, and Agents
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-20",
  "num": 20,
  "arc": "Trust & Everyday AI",
  "title": "It Said It Did It",
  "coreQuestion": "Did it guess some words, really use a helper, or take steps on its own? How would I know?",
  "blurb": "Look for proof of what actually ran, what it was allowed to touch, and who had to say yes before anything changed.",
  "minutes": 19,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A plan is not proof",
      "scenario": "You ask an assistant to find you cheap football boots. It replies: 'I checked three shops, found the best price, and ordered them.'\n\nIt even lists the steps in order. Very tidy.\n\nBut there is no order number. No message from the shop. No money gone. It may have written about doing all that without doing any of it.",
      "prompt": "What would show you it really did those things, rather than just writing that it did?"
    },
    {
      "kind": "reveal",
      "title": "Three different things get muddled up",
      "body": "Here they are in plain words.\n\nThe guesser. It reads what you gave it and guesses words that fit. People call it a model. On its own it only produces text. It cannot touch anything in the real world.\n\nA helper. A separate piece of software the app can call on. A web search, a calculator, your calendar, a file. People call it a tool. A helper can fetch real facts, and it can change real things.\n\nWorking through steps on its own. The app picks a next step and calls a helper. It reads what came back, then picks the step after that. It keeps going until it decides to stop. People call this an agent.\n\nThese are not three sealed boxes. Something working through steps uses a guesser and helpers. An ordinary chat app might quietly call one helper for one answer.\n\nSo do not argue about the label. Ask five things you can look at.\n\nWhat did you give it?\n\nWhich helper actually ran?\n\nWhat was it allowed to touch?\n\nWhat changed in the real world?\n\nWhere did a person say yes, stop, or undo it?",
      "mistake": "Calling any long answer an agent, or treating a link as proof that a live search really ran.",
      "good": "Look for a record of what ran, what it could touch, and what changed. If the app shows none of that, say you cannot tell."
    },
    {
      "kind": "classify",
      "title": "What does the proof actually show?",
      "prompt": "Sort each one. Use 'cannot tell' whenever the answer does not show what happened behind it.",
      "buckets": [
        "Guessing only (the model)",
        "It used a helper (a tool)",
        "It worked through steps (an agent)",
        "Cannot tell from this"
      ],
      "items": [
        {
          "text": "You asked why bread rises. You got a general explanation. Nothing shows a helper running.",
          "answer": 3
        },
        {
          "text": "The record says helpers were switched off for this reply. Only your question and its answer were logged.",
          "answer": 0
        },
        {
          "text": "The record shows: calculator, 1487 x 23, answer 34,201. The reply uses that exact number.",
          "answer": 1
        },
        {
          "text": "The record shows: look up today's buses, compare arrival times, ask you to approve, add the chosen trip to a draft plan. Nothing is booked.",
          "answer": 2
        },
        {
          "text": "It says 'I checked the live web' but shows no helper, no source, no time, and no result.",
          "answer": 3
        },
        {
          "text": "A weather answer arrives with a logged call to a weather service and the time it ran.",
          "answer": 1
        },
        {
          "text": "A seven-step plan for tidying your files. No record that any file was ever opened or moved.",
          "answer": 3
        }
      ],
      "reveal": "Length, confidence, and the words 'I did this' are not proof. A logged helper shows something outside really ran. A chain of steps with a stopping point shows it worked on its own. Plenty of real apps hide all of this, so 'cannot tell' is often the honest answer."
    },
    {
      "kind": "workflowChain",
      "title": "Put the yes before the change",
      "goal": "An app may compare public bus times and put a plan together. It must not buy anything, message anyone, or use where you have been. Put the safety line in order.",
      "correct": [
        "Say the goal, and which public information it may use",
        "List what is off limits: where you have been, your messages, buying, changing accounts, sharing",
        "Let it gather and compare public bus times, showing its sources and every helper it used",
        "Make it stop at a draft and ask you to check the route, the time, and what could go wrong",
        "Only you decide whether to use the plan. Nothing real has to change for this practice"
      ],
      "choices": [
        "Make it stop at a draft and ask you to check the route, the time, and what could go wrong",
        "Let it gather and compare public bus times, showing its sources and every helper it used",
        "Say the goal, and which public information it may use",
        "Only you decide whether to use the plan. Nothing real has to change for this practice",
        "List what is off limits: where you have been, your messages, buying, changing accounts, sharing"
      ],
      "note": "The more it does by itself, the more places you should stop and check. A real change is anything outside the answer: sending, buying, deleting, posting, booking, moving money, editing an account, or handing over private information."
    },
    {
      "kind": "tryLive",
      "title": "Optional: read one harmless record",
      "prompt": "If an outside assistant shows you what it ran, give it a harmless public job. Ask for one current public fact. Then ask for a two-step comparison that ends in a draft. Write down what you gave it, which helper ran, what came back, what it did next, where it asked you, and whether anything real changed. If it shows you nothing, use the bus-route example above and mark this one 'cannot tell'.",
      "note": "Do not connect accounts, private files, your exact location, your messages, payment details, your contacts, or anyone else's information. You can finish the whole skill on the built-in example."
    },
    {
      "kind": "toolkitSave",
      "title": "Save a what-actually-ran check",
      "cardType": "Model, tool, or agentic workflow",
      "fields": [
        {
          "key": "trace",
          "label": "What the record actually shows",
          "placeholder": "guessing only / a helper ran / steps on its own / cannot tell"
        },
        {
          "key": "permission",
          "label": "What it was allowed to touch",
          "placeholder": "Public bus times only. Not my location, not my accounts."
        },
        {
          "key": "effect",
          "label": "What could change in the real world",
          "placeholder": "A draft only. No booking, message, purchase, or account change."
        },
        {
          "key": "approval",
          "label": "Where I have to say yes",
          "placeholder": "I check the route before anyone uses the plan"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Read what happened, not what it claimed",
      "question": "An assistant hands you a working recipe link and sorts the ingredients by aisle. It says it 'completed several agent steps.' What would make that claim true?",
      "options": [
        {
          "text": "A record of each step it took and what came back every time. Plus when it decided to stop, and the point where a person had to say yes before anything changed.",
          "ok": true,
          "feedback": "Yes. The record, the steps, the stopping point, and the place a person approves are what settle it. Not the word it used about itself."
        },
        {
          "text": "The answer has a working link and more than one bullet point.",
          "ok": false,
          "feedback": "A link might mean a helper ran, and bullet points are just written text. Neither shows it worked through steps."
        },
        {
          "text": "It calls itself an agent and writes every step as 'I did this'.",
          "ok": false,
          "feedback": "Describing itself is still guessed text. Look for what ran, what it could touch, and what changed."
        },
        {
          "text": "Sorting a whole shop by aisle is too fiddly for anything simpler to manage.",
          "ok": false,
          "feedback": "A hard job does not prove how it was done. A guesser can describe a process it never carried out."
        }
      ]
    }
  ]
};
