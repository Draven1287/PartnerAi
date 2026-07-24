// Lesson 3 — The Machine That Predicts
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-3",
  "num": 3,
  "arc": "First Contact",
  "title": "The Machine That Predicts",
  "coreQuestion": "How does context change what an AI is likely to produce, and why does likely not mean true?",
  "blurb": "Change the context, watch the likely answer move, and learn why fluency is not evidence.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "One unfinished message, three possible consequences",
      "scenario": "Your phone suggests how to finish: 'I cannot make it tonight because…' In a work chat it may predict 'my shift changed.' In a family chat it may predict 'I am not feeling well.' In a game chat it may predict 'the update is still downloading.' The beginning stayed the same; the context changed the likely ending.",
      "prompt": "Which ending would be most likely in a chat about a canceled community event—and what clue changed your guess?"
    },
    {
      "kind": "classify",
      "title": "Match the context to the likely continuation",
      "prompt": "Sort each continuation by the context that makes it more likely. Several endings could be possible; choose the strongest clue.",
      "buckets": ["Cooking", "Repair job", "Friend message"],
      "items": [
        { "text": "…the pan is already smoking.", "answer": 0 },
        { "text": "…the replacement part arrives Friday.", "answer": 1 },
        { "text": "…I need a little time before we talk.", "answer": 2 },
        { "text": "…the sauce needs ten more minutes.", "answer": 0 },
        { "text": "…the customer approved the estimate.", "answer": 1 },
        { "text": "…I do not want this to turn into another argument.", "answer": 2 }
      ],
      "reveal": "Prediction uses surrounding context to weight what fits next. More relevant context changes the likely continuation; it does not turn that continuation into a verified fact."
    },
    {
      "kind": "reveal",
      "title": "Prediction happens one piece at a time",
      "body": "A language model learned patterns across enormous amounts of text. Given your words and the conversation so far, it estimates which next piece is likely, adds one, and repeats. That can create an explanation, plan, joke, code, or confident error. It does not first discover a complete true answer hidden inside itself.\n\nContext improves fit. It cannot guarantee truth. Before using an outside assistant, use an invented scenario and remove private details; this built-in activity is enough to learn the mechanism without sending anything elsewhere.",
      "mistake": "Assuming a smooth paragraph must come from understanding the world the way a person does.",
      "good": "Use context to shape the prediction, then use evidence and human judgment to decide whether the output is usable."
    },
    {
      "kind": "workflowChain",
      "title": "Run a prediction experiment",
      "goal": "Test how one changed clue shifts a likely response without using personal information.",
      "correct": [
        "Choose an invented unfinished message",
        "Write one context that makes ending A likely",
        "Change one important clue",
        "Predict how the ending should shift",
        "Compare the two outputs without treating either as fact"
      ],
      "choices": [
        "Predict how the ending should shift",
        "Compare the two outputs without treating either as fact",
        "Choose an invented unfinished message",
        "Change one important clue",
        "Write one context that makes ending A likely"
      ],
      "note": "A fair experiment changes one clue, not five. The evidence is the shift in the likely continuation."
    },
    {
      "kind": "toolkitSave",
      "title": "Keep your context experiment",
      "cardType": "Prediction evidence",
      "fields": [
        { "key": "start", "label": "Unfinished message", "placeholder": "Use an invented, non-private example" },
        { "key": "contextA", "label": "Context A and likely ending", "placeholder": "What clue made it fit?" },
        { "key": "contextB", "label": "Context B and changed ending", "placeholder": "What one clue moved the prediction?" },
        { "key": "limit", "label": "What this does not prove", "placeholder": "Likely does not mean…" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Transfer the mechanism",
      "question": "A chatbot completes 'The shop is closed because…' differently after you add 'holiday notice' instead of 'broken freezer.' What is the strongest conclusion?",
      "options": [
        { "text": "The changed clue shifted which continuation fit the context; either completion still needs checking before someone acts.", "ok": true, "feedback": "Exactly. Context changes probability, while evidence decides whether a claim is true." },
        { "text": "The second answer is probably true because it used the newer clue and sounded more specific.", "ok": false, "feedback": "Specificity can come from prediction. The clue shaped the sentence; it did not verify the shop's situation." },
        { "text": "The model remembered what actually happened at that shop and selected the matching ending.", "ok": false, "feedback": "Nothing here shows access to that real event. It generated what fit the supplied context." },
        { "text": "Both answers are equally useless because predicted language cannot help with any real task.", "ok": false, "feedback": "Predicted language can generate useful possibilities. The human control is knowing when possibilities need verification." }
      ]
    }
  ]
};
