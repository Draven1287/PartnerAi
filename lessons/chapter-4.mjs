// Lesson 4 — You Cannot Break It, but You Can Lose Control
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-4",
  "num": 4,
  "arc": "First Contact",
  "title": "You Cannot Break It, but You Can Lose Control",
  "coreQuestion": "If a messy prompt cannot hurt the machine, what can careless use cost a person?",
  "blurb": "Send imperfect words without fear while protecting privacy, attention, voice, and the final decision.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The typo is harmless. The private screenshot is not.",
      "scenario": "You need help replying to a confusing message. You worry the prompt is badly written, so you consider pasting the whole private conversation to give the AI 'perfect context.' The typos cannot damage the model. Sharing another person's messages can damage trust.",
      "prompt": "Which risk deserves your attention: imperfect wording, unnecessary private data, or both equally? Why?"
    },
    {
      "kind": "classify",
      "title": "Messy, or loss of control?",
      "prompt": "Sort what is safe to retry from what needs a boundary before you continue.",
      "buckets": ["Safe to retry", "Pause and protect control"],
      "items": [
        { "text": "A half-finished sentence with spelling mistakes", "answer": 0 },
        { "text": "A private screenshot containing names and phone numbers", "answer": 1 },
        { "text": "Changing your goal after seeing the first draft", "answer": 0 },
        { "text": "Letting the AI send a message that affects someone without your review", "answer": 1 },
        { "text": "Asking the same question in simpler words", "answer": 0 },
        { "text": "Spending an hour chasing the perfect answer instead of making the small decision", "answer": 1 }
      ],
      "reveal": "You cannot bruise the model's feelings or ruin it with a typo. You can expose data, lose time, surrender your voice, or act on a bad output. Fear the consequence, not the imperfect sentence."
    },
    {
      "kind": "promptRepair",
      "title": "Keep the mess; remove the exposure",
      "weak": "help me answer this im confused [full private screenshot with names, phone numbers, and exact location]",
      "fields": ["someone I know", "the situation in one sentence", "the tone I want"],
      "strong": "help me draft 3 replies to [someone I know]. [the situation in one sentence]. Keep it [the tone I want]. Do not invent motives; I will choose and rewrite the final reply."
    },
    {
      "kind": "reveal",
      "title": "A redo is free; a consequence is not",
      "body": "A model predicts a response to whatever text you provide. A clumsy prompt may produce a clumsy answer, and you can correct it in the next message. That is reversible. Privacy loss, a message sent in the wrong voice, money spent, or a decision made from a false claim may not be.\n\nBefore any optional outside use, replace real names, messages, schools, workplaces, locations, account details, and health information with made-up placeholders. Never use an external assistant as the only way to practice this lesson.",
      "mistake": "Polishing the sentence while ignoring the data and consequence attached to it.",
      "good": "Send a rough but safely redacted request, inspect the result, and keep the consequential action behind a human check."
    },
    {
      "kind": "workflowChain",
      "title": "Recover control after a bad first answer",
      "goal": "Fix a reply that missed your meaning without starting over or revealing more private information.",
      "correct": [
        "Name what the answer misunderstood",
        "Restate the goal in one line",
        "Add only the missing non-private constraint",
        "Ask for a few revised options",
        "Choose, rewrite, and decide whether to use one"
      ],
      "choices": [
        "Ask for a few revised options",
        "Add only the missing non-private constraint",
        "Choose, rewrite, and decide whether to use one",
        "Restate the goal in one line",
        "Name what the answer misunderstood"
      ],
      "note": "Correction is normal. More personal data is not the price of getting a better answer."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your control rule",
      "cardType": "Reversible-use rule",
      "fields": [
        { "key": "retry", "label": "What I can safely retry", "placeholder": "A rough prompt, a typo, or a weak first draft" },
        { "key": "protect", "label": "What I protect first", "placeholder": "Private data, my voice, time, and the final decision" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Choose the reversible move",
      "question": "A rushed AI draft for a marketplace listing has typos, invents the item's condition, and includes your pickup address. What is the best recovery?",
      "options": [
        { "text": "Remove the address, correct the invented condition, ask for a revised draft using only necessary facts, and inspect it before posting.", "ok": true, "feedback": "Yes. You treated wording as retryable while protecting location, truth, and the final action." },
        { "text": "Fix only the typos because messy writing is the part most likely to reduce buyer trust.", "ok": false, "feedback": "Typos matter less than a false condition claim and an exposed address. Control follows the consequence." },
        { "text": "Paste more personal context so the AI can understand the listing perfectly on its next try.", "ok": false, "feedback": "Better fit does not justify unnecessary private data. Give only the product facts the task needs." },
        { "text": "Delete everything and stop using AI because one poor draft proves the tool cannot help.", "ok": false, "feedback": "The poor draft is reversible. Repairing it while keeping boundaries is the stronger skill." }
      ]
    }
  ]
};
