// Lesson 4 — You Cannot Break It, but You Can Lose Control
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-4",
  "num": 4,
  "arc": "First Contact",
  "title": "A Typo Costs Nothing. This Costs a Lot.",
  "coreQuestion": "If a messy message cannot hurt the machine, what can careless use cost me?",
  "blurb": "Type badly without fear. Guard your private details, your time, your voice, and the final call.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The typo is harmless. The screenshot is not.",
      "scenario": "A friend sent you a message and you cannot work out what they meant. You want help writing back.\n\nYou worry your question is badly written. So you think about pasting in the whole chat, screenshots and all, to give the AI everything.\n\nThe typos cannot hurt the AI. Sharing your friend's messages can hurt your friend.",
      "prompt": "Which one actually deserves your worry: the messy wording, the private chat, or both? Say why."
    },
    {
      "kind": "classify",
      "title": "Just try again, or stop first?",
      "prompt": "Sort what you can safely redo from what needs you to stop and think.",
      "buckets": ["Just try again", "Stop and think first"],
      "items": [
        { "text": "A half-finished sentence full of spelling mistakes", "answer": 0 },
        { "text": "A screenshot of a friend's chat with names and numbers in it", "answer": 1 },
        { "text": "Changing your mind about what you want after seeing the first draft", "answer": 0 },
        { "text": "Letting AI send a message to someone before you have read it", "answer": 1 },
        { "text": "Asking the same question again in simpler words", "answer": 0 },
        { "text": "Spending an hour hunting the perfect answer instead of just deciding", "answer": 1 }
      ],
      "reveal": "You cannot hurt the AI's feelings, and a typo breaks nothing. You can leak someone's private messages, lose an hour, lose your own voice, or act on a wrong answer. Worry about the cost, not the sentence."
    },
    {
      "kind": "promptRepair",
      "title": "Keep the mess, remove the exposure",
      "weak": "help me answer this im confused [whole screenshot of the chat, with names, numbers and where they live]",
      "fields": ["a friend", "what happened in one line", "how I want to sound"],
      "strong": "help me write 3 replies to [a friend]. [what happened in one line]. Keep it [how I want to sound]. Do not invent reasons for what they did. I will pick one and rewrite it."
    },
    {
      "kind": "reveal",
      "title": "A redo is free. A consequence is not.",
      "body": "The AI writes an answer from whatever words you give it. A messy question may get a messy answer. You can fix that in your next message. Nothing is lost.\n\nSome things do not undo. Your friend's private chat, once pasted, is out. So is money spent, a message sent in the wrong voice, or a decision made from an invented fact.\n\nSo before you paste anything into an outside app, swap things out. Real names, real messages, your school, your address, anything about money or health. Use made-up stand-ins instead.\n\nEverything you need for this lesson is right here. You never have to send a real message anywhere to finish it.",
      "mistake": "Polishing your sentence while ignoring whose private details are sitting inside it.",
      "good": "Send a rough question with the private parts taken out, then check the answer before you act on it."
    },
    {
      "kind": "workflowChain",
      "title": "Get control back after a bad first answer",
      "goal": "Fix an answer that missed your point, without starting again and without giving away more private detail.",
      "correct": [
        "Say what the answer got wrong",
        "Say what you actually want, in one line",
        "Add the one missing detail that is not private",
        "Ask for a few new versions",
        "Pick one, rewrite it, and decide whether to use it"
      ],
      "choices": [
        "Ask for a few new versions",
        "Add the one missing detail that is not private",
        "Pick one, rewrite it, and decide whether to use it",
        "Say what you actually want, in one line",
        "Say what the answer got wrong"
      ],
      "note": "Fixing things is normal. Handing over more private detail is not the price of a better answer."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your redo rule",
      "cardType": "Redo rule",
      "fields": [
        { "key": "retry", "label": "What I can just try again", "placeholder": "A rough question, a typo, or a weak first draft" },
        { "key": "protect", "label": "What I guard first", "placeholder": "Private details, my voice, my time, and the final call" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Pick the move you can undo",
      "question": "You ask AI to write a listing to sell your old bike. The draft has typos, invents that the brakes are new, and includes your home address. What is the best fix?",
      "options": [
        { "text": "Take out the address, correct the brake claim, ask for a new draft using only true facts, and read it before posting.", "ok": true, "feedback": "Yes. Wording is cheap to redo. Your address, the truth, and the posting are what you guard." },
        { "text": "Fix the typos only, because bad spelling is what puts buyers off most.", "ok": false, "feedback": "A false claim about the brakes and your home address cost far more than a typo does." },
        { "text": "Paste in more personal detail so the AI can get the listing perfect next time.", "ok": false, "feedback": "A better fit does not earn it your private details. Give only the facts about the bike." },
        { "text": "Delete it all and stop using AI, because one bad draft proves it cannot help.", "ok": false, "feedback": "The bad draft costs nothing to redo. Fixing it while holding your boundaries is the real skill." }
      ]
    }
  ]
};
