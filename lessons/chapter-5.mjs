// Lesson 5 — Verify and Decide
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-5",
  "num": 5,
  "arc": "First Contact",
  "title": "Verify and Decide",
  "coreQuestion": "How do I choose what needs checking, find independent evidence, and make the final decision?",
  "blurb": "Turn one plausible AI answer into a checked human decision using stakes, sources, and a clear boundary.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A confident answer can still send someone the wrong way",
      "scenario": "An AI says a walk-in clinic closes at 8 p.m. and your cousin plans to leave at 7:20. The answer may come from old text, live search, or a mistaken summary. Asking the AI to sound more certain will not keep the doors open.",
      "prompt": "What exact claim changes the decision, and where would you check it without asking the same model again?"
    },
    {
      "kind": "classify",
      "title": "Match the check to the consequence",
      "prompt": "Decide how much independent checking each output needs. Not every typo deserves an investigation; not every high-stakes claim can ride on fluency.",
      "buckets": ["Inspect and use", "Check independently", "Do not use AI as the decider"],
      "items": [
        { "text": "Three possible names for an invented comic character", "answer": 0 },
        { "text": "Today's clinic hours", "answer": 1 },
        { "text": "Whether a suspicious payment message is legitimate", "answer": 1 },
        { "text": "Whether to stop prescribed medicine", "answer": 2 },
        { "text": "A first draft of a casual event description", "answer": 0 },
        { "text": "Whether another person deserves punishment based on a private accusation", "answer": 2 }
      ],
      "reveal": "Checking should rise with the cost of being wrong. For decisions involving health, safety, rights, or another person's future, AI can help form questions but should not be the decider."
    },
    {
      "kind": "verify",
      "title": "Build a verification trail",
      "claim": "The clinic closes at 8 p.m. tonight.",
      "steps": [
        "Isolate the exact claim that changes the action",
        "Choose a current independent source responsible for that information",
        "Check the date, location, and exact wording",
        "Record whether the claim is verified, contradicted, or still uncertain",
        "Make the decision from the evidence and the consequence—not the AI's confidence"
      ],
      "note": "The clinic's official page or phone line is independent evidence. Asking the same chatbot 'are you sure?' is not."
    },
    {
      "kind": "reveal",
      "title": "Useful output, separate proof",
      "body": "AI predicts a plausible response. Tools such as search can add current material, but links, quotes, and confident wording still need inspection. Verification means checking the claim against evidence outside the same generated answer. Decision means matching that evidence to the consequence and choosing what happens next.\n\nKeep private details out of outside tools: use a made-up scenario or remove names, account numbers, health details, addresses, and private messages before asking for help. You can complete this lesson with the built-in claim trail alone.",
      "mistake": "Asking the same AI to repeat the answer, add citations, or sound cautious and treating that as independent confirmation.",
      "good": "Identify the consequential claim, check a responsible source, name uncertainty honestly, and keep the decision with a person."
    },
    {
      "kind": "workflowChain",
      "title": "Decide after the check",
      "goal": "Respond to a message claiming an overdue bill must be paid through a link within one hour.",
      "correct": [
        "Do not click the message link or share account details",
        "Name the claim: the bill is real and urgent",
        "Reach the company through a known official route",
        "Compare the account information and deadline",
        "Decide whether to pay, report, or ignore based on that evidence"
      ],
      "choices": [
        "Compare the account information and deadline",
        "Decide whether to pay, report, or ignore based on that evidence",
        "Reach the company through a known official route",
        "Do not click the message link or share account details",
        "Name the claim: the bill is real and urgent"
      ],
      "note": "Urgency increases the need for an independent route. It does not lower it."
    },
    {
      "kind": "toolkitSave",
      "title": "Keep one verification trail",
      "cardType": "Verify and decide",
      "fields": [
        { "key": "claim", "label": "The exact claim", "placeholder": "What changes the action?" },
        { "key": "source", "label": "Independent source", "placeholder": "Who is responsible for this fact?" },
        { "key": "verdict", "label": "Evidence verdict", "placeholder": "Verified, contradicted, or uncertain—and why" },
        { "key": "decision", "label": "My decision", "placeholder": "What will happen next, and who owns it?" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Transfer the whole habit",
      "question": "An AI says a weekend market allows sellers to arrive without registering. Your friend plans to drive two hours with handmade items. Which response shows the full skill?",
      "options": [
        { "text": "Identify registration as the consequential claim, check the market's current official rules or organizer, then decide whether the trip is worth making.", "ok": true, "feedback": "Yes. You matched the check to the consequence and kept the travel decision human." },
        { "text": "Ask the AI for three more versions of the answer and trust the one repeated most often.", "ok": false, "feedback": "Repetition from the same system is not independent evidence. The organizer owns the current rule." },
        { "text": "Go anyway because the answer included a specific arrival time and therefore probably came from a source.", "ok": false, "feedback": "Specificity can be predicted. Two hours of travel makes checking the current rule worthwhile." },
        { "text": "Cancel immediately because an uncertain answer means the market is unsafe.", "ok": false, "feedback": "Uncertainty is a signal to check, not automatic proof that the opportunity is bad." }
      ]
    }
  ]
};
