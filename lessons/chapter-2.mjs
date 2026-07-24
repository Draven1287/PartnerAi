// Lesson 2 — What You Are Actually Using
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-2",
  "num": 2,
  "arc": "First Contact",
  "title": "What You Are Actually Using",
  "coreQuestion": "When an AI answer appears, which part is the app, the model, the tool, the output, and the human decision?",
  "blurb": "Take apart one ordinary AI result so you know which part can help and which part never gets the final say.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The answer arrived. The decision did not.",
      "scenario": "A search app says the last bus leaves at 10:40 p.m. Your ride home depends on it. The screen looks polished, but you cannot tell whether the app predicted the answer from old text, searched a current timetable, or mixed both.",
      "prompt": "What would you need to know before treating 10:40 as a plan rather than a suggestion?"
    },
    {
      "kind": "classify",
      "title": "Name the part doing each job",
      "prompt": "Sort each job. Retry freely: the point is to see a system, not one magical box.",
      "buckets": ["Person", "Product or model", "Optional tool"],
      "items": [
        { "text": "Sets the goal: get home safely", "answer": 0 },
        { "text": "Provides the chat or search screen", "answer": 1 },
        { "text": "Predicts a useful-looking response from the context", "answer": 1 },
        { "text": "Looks up a live transport timetable when available", "answer": 2 },
        { "text": "Checks the official schedule and chooses what to do", "answer": 0 }
      ],
      "reveal": "The app is the surface, the model predicts the response, and a tool may fetch current information. None of those parts receives the consequence if the bus time is wrong. The person checks and decides."
    },
    {
      "kind": "reveal",
      "title": "One screen can hide several systems",
      "body": "AI is not a single brain. You use a product: a website, app, search box, keyboard, camera, or game feature. Inside it, a model predicts an output from patterns and the context it receives. The product may also connect the model to tools such as live search, files, memory, maps, or a calculator. Then a person edits, verifies, rejects, or acts.\n\nBefore any information leaves LearningAI for an outside tool, remove names, account details, private messages, exact locations, and anything the task does not need. A tool can be useful without deserving every detail.",
      "mistake": "Calling the whole thing 'the AI' and assuming a polished answer means every hidden part worked correctly.",
      "good": "Ask which product, model, data, and tools are involved, then keep the final decision with the person affected."
    },
    {
      "kind": "workflowChain",
      "title": "Build the system in consequence order",
      "goal": "Use an AI product to compare two repair quotes without exposing a customer's information.",
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
      "note": "Privacy comes before typing. Prediction can organize; tools can add current facts; responsibility remains human."
    },
    {
      "kind": "toolkitSave",
      "title": "Keep a system map",
      "cardType": "AI system map",
      "fields": [
        { "key": "goal", "label": "The human goal", "placeholder": "What needs to happen?" },
        { "key": "product", "label": "The product and model job", "placeholder": "What screen and prediction are helping?" },
        { "key": "tool", "label": "Any tool or current data needed", "placeholder": "Search, calculator, file, map—or none" },
        { "key": "decision", "label": "The human decision", "placeholder": "Who checks and owns the consequence?" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Map a fresh system",
      "question": "A photo app identifies a wild plant and suggests it may be edible. Which description correctly separates the system before anyone acts?",
      "options": [
        { "text": "The app shows the screen, a vision model predicts a match, plant references may supply information, and a qualified person must verify before anyone eats it.", "ok": true, "feedback": "Yes. You separated interface, prediction, possible data, and the human decision at the point where the consequence matters." },
        { "text": "The app recognized the plant, so the model and a trained botanist have effectively made the same decision.", "ok": false, "feedback": "Recognition is a prediction, not professional verification. The consequence is too high to collapse those roles." },
        { "text": "If the product used live search, the answer is current and the human check becomes optional.", "ok": false, "feedback": "Current data can improve an answer without proving the match or removing the need for expert judgment." },
        { "text": "Avoid every photo-identification tool because prediction and search are never useful together.", "ok": false, "feedback": "The tool can help narrow possibilities. The control is matching trust to the consequence, not rejecting useful support." }
      ]
    }
  ]
};
