// Lesson 5 — Verify and Decide
// Arc: First Contact
// Rebuilt from the seven-persona teen review. Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-5",
  "num": 5,
  "arc": "First Contact",
  "title": "Check It, Then Decide",
  "coreQuestion": "How do I work out what needs checking, find proof somewhere else, and make the call myself?",
  "blurb": "Turn one confident-sounding answer into a checked decision that you actually own.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A confident answer can still send someone the wrong way",
      "scenario": "Your brother has hurt his wrist. Your mum asks you to find out when the walk-in clinic shuts.\n\nAn AI says 8 p.m. You would leave at 7:20.\n\nThat 8 p.m. could come from an old page, from a live search, or from nothing at all. Asking the AI to sound more sure will not keep the doors open.",
      "prompt": "Which exact fact would change what you do, and where could you check it without asking the same AI again?"
    },
    {
      "kind": "classify",
      "title": "Match the checking to the cost",
      "prompt": "Decide how hard each answer needs checking. Not every draft needs an investigation. Not every serious claim can ride on how good it sounds.",
      "buckets": ["Just read it and use it", "Check it somewhere else", "AI does not get to decide this"],
      "items": [
        { "text": "Three name ideas for a made-up comic character", "answer": 0 },
        { "text": "What time the clinic shuts tonight", "answer": 1 },
        { "text": "Whether a text asking you for a payment is real", "answer": 1 },
        { "text": "Whether someone should stop taking medicine a doctor gave them", "answer": 2 },
        { "text": "A rough first draft of a caption for the team photo", "answer": 0 },
        { "text": "Whether a classmate should be punished for something someone accused them of", "answer": 2 }
      ],
      "reveal": "The bigger the cost of being wrong, the harder you check. When health, safety, or someone's name is involved, AI can help you think. It does not get the final say."
    },
    {
      "kind": "verify",
      "title": "Build a trail you can show",
      "claim": "The clinic shuts at 8 p.m. tonight.",
      "steps": [
        "Pick the one fact that changes what you do",
        "Find a source that is actually in charge of that fact",
        "Check the date, the place, and the exact wording",
        "Write down whether it held up, failed, or is still unclear",
        "Decide from the evidence and the cost, not from how sure the AI sounded"
      ],
      "note": "The clinic's own page or phone line is real proof. Asking the same chatbot 'are you sure?' is not."
    },
    {
      "kind": "reveal",
      "title": "A useful answer is not proof",
      "body": "The AI writes what fits. Some apps can also run a live search and pull in what they find. Even then, links and quotes need a look. A link can point somewhere that never says what the answer claims.\n\nChecking means testing the claim against something outside that answer. Deciding means weighing what you found against the cost of being wrong, then choosing.\n\nKeep private things out of outside apps. Use a made-up example, or take out names, addresses, account numbers, and health details first.\n\nThe claim trail above is enough to finish this lesson on its own.",
      "mistake": "Asking the same AI to repeat itself, add links, or sound careful, then calling that proof.",
      "good": "Name the fact that matters, check a source that owns it, say honestly how sure you are, and decide yourself."
    },
    {
      "kind": "workflowChain",
      "title": "Decide after the check",
      "goal": "Deal with a message saying you must pay through a link within one hour or lose your account.",
      "correct": [
        "Do not tap the link or type in any account details",
        "Name the claim: this bill is real and it is urgent",
        "Reach the company a way you already know is real",
        "Compare what they say with what the message said",
        "Decide whether to pay, report it, or ignore it"
      ],
      "choices": [
        "Compare what they say with what the message said",
        "Decide whether to pay, report it, or ignore it",
        "Reach the company a way you already know is real",
        "Do not tap the link or type in any account details",
        "Name the claim: this bill is real and it is urgent"
      ],
      "note": "Being rushed is a reason to check harder. It is never a reason to skip checking."
    },
    {
      "kind": "toolkitSave",
      "title": "Keep one checking trail",
      "cardType": "Check and decide",
      "fields": [
        { "key": "claim", "label": "The exact claim", "placeholder": "Which fact changes what I do?" },
        { "key": "source", "label": "Where I checked", "placeholder": "Who is actually in charge of this fact?" },
        { "key": "verdict", "label": "What the check showed", "placeholder": "Held up, failed, or still unclear — and why" },
        { "key": "decision", "label": "My decision", "placeholder": "What happens next, and who owns it?" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Use the whole habit",
      "question": "An AI says a weekend market lets sellers turn up without booking. Your friend plans to travel two hours with handmade things to sell. Which answer shows the full skill?",
      "options": [
        { "text": "Name booking as the fact that matters. Check the market's own rules, or ask the organiser. Then decide whether the trip is worth it.", "ok": true, "feedback": "Yes. You matched the checking to the cost, and the travel decision stayed with a person." },
        { "text": "Ask the AI for three more versions of the answer and trust the one it repeats most.", "ok": false, "feedback": "The same AI repeating itself is not proof. The organiser owns that rule." },
        { "text": "Go anyway, because the answer gave an exact arrival time, so it probably came from somewhere real.", "ok": false, "feedback": "Exact details are easy to guess. Two hours of travel is worth one check." },
        { "text": "Cancel straight away, because an uncertain answer means the market is a bad idea.", "ok": false, "feedback": "Not knowing is a reason to check. It is not proof that the trip is bad." }
      ]
    }
  ]
};
