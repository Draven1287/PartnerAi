// Lesson 2 — What You Are Actually Using
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-2",
  "num": 2,
  "arc": "First Contact",
  "title": "What Is Actually Happening",
  "coreQuestion": "When AI gives you an answer, what are the pieces behind it, and which part is still your job?",
  "blurb": "See the few simple parts behind any AI answer, so you always know which part you still decide.",
  "minutes": 13,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer came fast. The choice is still yours.",
      "scenario": "You ask an app when the last bus leaves. It says 10:40 p.m.\n\nYou need that bus to get home. The screen looks confident. But you cannot tell if it read today's timetable, or if it is repeating something it saw months ago.",
      "prompt": "What would you want to know before you plan your night around 10:40?"
    },
    {
      "kind": "classify",
      "title": "Which part is doing each job?",
      "prompt": "Sort each job. Get it wrong as often as you like — the point is to see the parts, not one magic box.",
      "buckets": [
        "You",
        "The app",
        "The guesser",
        "A helper"
      ],
      "items": [
        {
          "text": "Decides the goal: get home safely",
          "answer": 0
        },
        {
          "text": "Shows you the screen you type into",
          "answer": 1
        },
        {
          "text": "Writes the answer by guessing which words come next",
          "answer": 2
        },
        {
          "text": "Looks up today's real bus times",
          "answer": 3
        },
        {
          "text": "Checks the real timetable and decides what to do",
          "answer": 0
        }
      ],
      "reveal": "The app is the screen. The guesser writes. A helper can fetch something real. None of those three pays for it if the bus time is wrong. You check, and you decide."
    },
    {
      "kind": "reveal",
      "title": "Four parts, and you are the last one",
      "body": "An AI answer is not one magic box. It is a few parts working together.\n\nThe app is the thing you type into. A website, a keyboard, a chat box, a game.\n\nThe guesser is the part that writes the answer. People call it a model. It has read an enormous amount of writing, and it guesses which words should come next. It is guessing, not looking things up.\n\nHelpers are extras the app can plug in: live search, a calculator, your files. Helpers can fetch real, current facts. The guesser on its own cannot.\n\nYou are the last part. You read it, check it if it matters, and decide what to do.\n\nHere is why this matters. The guesser sounds exactly the same whether it checked something or not.",
      "mistake": "Calling the whole thing 'the AI' and assuming a polished answer means every hidden part worked correctly.",
      "good": "Ask which product, model, data, and tools are involved, then keep the final decision with the person affected."
    },
    {
      "kind": "workflowChain",
      "title": "Put it in the safest order",
      "goal": "You want AI to help you choose between two phone plans, without handing over anyone's private details.",
      "correct": [
        "Remove the customer's name, phone number, and address",
        "State the comparison goal and what matters",
        "Let the model organize the supplied details",
        "Use a current source or calculator for facts the decision depends on",
        "Have the person responsible inspect the output and choose"
      ],
      "choices": [
        "Have the person responsible inspect the output and choose",
        "Let the model organize the supplied details",
        "Remove the customer's name, phone number, and address",
        "Use a current source or calculator for facts the decision depends on",
        "State the comparison goal and what matters"
      ],
      "note": "Take private details out before you type. The guesser can lay out the choices. Helpers can add today's real prices. You still make the call."
    },
    {
      "kind": "toolkitSave",
      "title": "Keep a system map",
      "cardType": "AI system map",
      "fields": [
        {
          "key": "goal",
          "label": "The human goal",
          "placeholder": "What needs to happen?"
        },
        {
          "key": "product",
          "label": "The product and model job",
          "placeholder": "What screen and prediction are helping?"
        },
        {
          "key": "tool",
          "label": "Any tool or current data needed",
          "placeholder": "Search, calculator, file, map—or none"
        },
        {
          "key": "decision",
          "label": "The human decision",
          "placeholder": "Who checks and owns the consequence?"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Try it on something new",
      "question": "A plant app photographs a leaf and says the plant is safe to eat. Which answer describes what actually happened?",
      "options": [
        {
          "text": "The app shows the screen, a vision model predicts a match, plant references may supply information, and a qualified person must verify before anyone eats it.",
          "ok": true,
          "feedback": "Yes. You separated interface, prediction, possible data, and the human decision at the point where the consequence matters."
        },
        {
          "text": "The app recognized the plant, so the model and a trained botanist have effectively made the same decision.",
          "ok": false,
          "feedback": "Recognition is a prediction, not professional verification. The consequence is too high to collapse those roles."
        },
        {
          "text": "If the product used live search, the answer is current and the human check becomes optional.",
          "ok": false,
          "feedback": "Current data can improve an answer without proving the match or removing the need for expert judgment."
        },
        {
          "text": "Avoid every photo-identification tool because prediction and search are never useful together.",
          "ok": false,
          "feedback": "The tool can help narrow possibilities. The control is matching trust to the consequence, not rejecting useful support."
        }
      ]
    }
  ]
};
