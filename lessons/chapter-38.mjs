// Lesson 38 — Health and High-Stakes Questions
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-38",
  "num": 38,
  "arc": "AI for Real Life",
  "title": "Health and High-Stakes Questions",
  "coreQuestion": "How do I use AI to understand a high-stakes question without letting it decide anything for me?",
  "blurb": "Use AI to prep for a real professional — understanding, never deciding.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The confident answer",
      "scenario": "You've had a headache for three days. You type 'what's wrong with me and what should I do?' into an AI. It writes back three calm, complete paragraphs naming a likely cause and suggesting a medication. It sounds sure of itself.",
      "prompt": "Before you read on: the AI never examined you, doesn't know your history, and can't run a test. So what is it actually giving you — a medical judgment, or a smooth guess dressed up as one?"
    },
    {
      "kind": "reveal",
      "title": "Understand, don't decide",
      "body": "For high-stakes questions, use AI to understand and prepare — not to diagnose or decide. It can translate unfamiliar language, organize your symptoms or questions, and help you prepare for a conversation with a qualified professional.\n\nThe boundary is simple: the AI has not examined you, does not know your complete history, and cannot run a test. A smooth answer can still be wrong. Never start, stop, or change medication or treatment because an AI suggested it. Ask the clinician or pharmacist who is accountable for your care.\n\nDo not use AI for emergencies. For urgent symptoms such as chest pain, trouble breathing, or a serious reaction to medicine, contact local emergency services. If you feel unsafe or at risk of hurting yourself or someone else, contact a trusted person, emergency services, or a crisis line. In the United States and its territories, call or text 988.",
      "mistake": "Self-diagnosing: asking the AI what's wrong with you and what to take, then acting on its word because it sounded certain.",
      "good": "Ask the AI to explain the basics in plain words and build you a list of questions to bring to a real professional — then decide nothing on the AI alone."
    },
    {
      "kind": "classify",
      "title": "Understand vs. decide",
      "prompt": "The rule: AI can help you UNDERSTAND, but a qualified human makes the DECISION. Sort each move into the right bucket.",
      "buckets": [
        "OK to ask AI (understand)",
        "Only a professional decides"
      ],
      "items": [
        {
          "text": "Explain in plain words why my doctor wants to recheck my blood pressure in a month",
          "answer": 0
        },
        {
          "text": "Tell me which medication to take and at what dose for my symptoms",
          "answer": 1
        },
        {
          "text": "Help me write a list of questions to ask my pharmacist",
          "answer": 0
        },
        {
          "text": "Diagnose what condition I have based on how I feel today",
          "answer": 1
        },
        {
          "text": "Explain what a benefits letter generally means so I can follow the appointment",
          "answer": 0
        },
        {
          "text": "Confirm it's safe to stop a prescribed medicine early",
          "answer": 1
        }
      ],
      "reveal": "Everything in the first bucket keeps you understanding and preparing. Everything in the second is a decision that belongs to a qualified human — even when the AI sounds sure."
    },
    {
      "kind": "tryLive",
      "title": "Turn AI into a prep sheet",
      "prompt": "I want to understand, not get a diagnosis or a decision. Explain [my health or important question] in plain words a beginner can follow. Clearly mark which parts only a qualified [professional] should decide, and tell me if any of this depends on recent information you should double-check on the live web. Then write me a short, specific list of questions I should ask my [professional] at my next appointment.",
      "note": "Fill the blanks with one real question you actually have. Example: 'why my doctor wants to recheck my blood pressure in a month' and 'doctor'. [professional] could also be pharmacist, nurse, dentist — or for non-health questions, lawyer or financial advisor. Read the plain-words explanation out loud to check you understood it. You're leaving with a prep sheet, not a verdict."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your prep sheet",
      "cardType": "High-Stakes Prep Sheet",
      "fields": [
        {
          "key": "question",
          "label": "My real question (about understanding)",
          "placeholder": "why my doctor wants to recheck my blood pressure in a month"
        },
        {
          "key": "professional",
          "label": "Who actually decides this",
          "placeholder": "doctor, pharmacist, nurse, lawyer, advisor"
        },
        {
          "key": "toAsk",
          "label": "One question I'll circle to ask a real person",
          "placeholder": "Is a one-month recheck standard, or is something specific worrying you?"
        },
        {
          "key": "wontActOn",
          "label": "One thing I will NOT act on until a human confirms it",
          "placeholder": "any dosage or 'you should stop taking X' the AI suggested"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do it on a NEW question",
      "question": "Pick a DIFFERENT important question than the one you just used (what a new prescription is for, what a benefits letter means). Run the prompt on it. You pass when you can do all three of these. Which choice shows you actually did the skill?",
      "options": [
        {
          "text": "I can say the basics back in my own words without reading the screen, point to one list-item I'll ask a real professional, and name one thing I won't act on until a human confirms it.",
          "ok": true,
          "feedback": "That's the Explorer level closed. You used AI to get smarter and stay in charge — understanding, preparing, and leaving the decision to a qualified human."
        },
        {
          "text": "The AI gave a clear diagnosis and a treatment, so I'll just follow it — it sounded confident and complete.",
          "ok": false,
          "feedback": "Confident and complete is exactly how a hallucination reads. The AI can't examine you and may be smoothly wrong. Use its answer to prepare questions, and let a professional decide."
        },
        {
          "text": "I read the answer back word-for-word off the screen and copied its advice into a text to a friend.",
          "ok": false,
          "feedback": "Reading it back verbatim isn't understanding, and passing on unverified AI advice spreads the risk. Say it in your own words, circle what to ask a real person, and flag what you won't act on yet."
        }
      ]
    }
  ]
};
