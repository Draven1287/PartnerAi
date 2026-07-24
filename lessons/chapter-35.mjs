// Lesson 35 — Writing and Research: Voice + Verify
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-35",
  "num": 35,
  "arc": "AI & Being Human",
  "title": "Writing and Research: Voice + Verify",
  "coreQuestion": "When AI helps me write or research, what work is still mine?",
  "blurb": "AI can draft and cite in seconds — but the voice and the facts are still your job.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A perfect paragraph with a perfect source",
      "scenario": "You ask AI for a short post about starting tomatoes. Back comes a smooth paragraph ending with: 'Research from the Cornell Home Gardening Institute (Whitfield, 2019) shows tomatoes germinate best at 21–27°C soil temperature.' It looks polished. It even has an author, a year, and an institution.",
      "prompt": "Before you read on: which parts of this are actually done, and which parts are still your job — the words, the fact, both, or neither?"
    },
    {
      "kind": "reveal",
      "title": "You are still the author",
      "body": "AI predicts believable language, so it can produce a fact or citation that looks right without being real. Browsing tools can retrieve real pages, but a real link still does not prove the claim. The page must actually support the sentence you plan to use.\n\nTwo jobs remain yours:\n\nVOICE — treat the generated draft as material. Rewrite until the choices, emphasis, and phrasing are genuinely yours.\nVERIFY — open the source, find the supporting passage, and record whether the claim is confirmed, contradicted, or still uncertain.\n\nBefore an outside assistant sees a writing sample, remove real names, addresses, private messages, account details, and another person's information. Data pasted there leaves LearningAI; two invented sentences can demonstrate the skill. Verification answers “Does this source support the claim?” It does not automatically answer “Is this safe advice?” For health, money, legal, or safety decisions, use an appropriate professional or official source before acting.",
      "mistake": "Reading the smooth draft and citation, thinking 'the writing's done and the fact is backed up,' and posting it.",
      "good": "Treating the draft as a first pass: rewrite the words that aren't yours, then open the source and confirm it says the exact thing before you trust it."
    },
    {
      "kind": "classify",
      "title": "Is this fact proven yet?",
      "prompt": "The AI hands you each of these. Sort them into whether the fact is PROVEN or still UNCHECKED.",
      "buckets": [
        "Proven",
        "Still unchecked"
      ],
      "items": [
        {
          "text": "A citation with a real-sounding author and year that you have not opened.",
          "answer": 1
        },
        {
          "text": "A link you clicked that loads a real article whose exact sentence backs the claim.",
          "answer": 0
        },
        {
          "text": "'This is well documented' with no source named.",
          "answer": 1
        },
        {
          "text": "A source that exists and is by the right author — but nowhere actually states the claim.",
          "answer": 1
        },
        {
          "text": "A page you opened yourself where the publication and the exact line both check out.",
          "answer": 0
        }
      ],
      "reveal": "A fact is proven only after YOU open the source and see it exists, is by who it claims, and says the exact thing. Anything short of all three is still unchecked — no matter how real the citation looks."
    },
    {
      "kind": "tryLive",
      "title": "Draft in your voice, then ask for one real source",
      "prompt": "Here's how I naturally write — study my voice: [paste 2–4 real sentences you wrote]. Now help me write [the piece], and it needs to include this fact: [the fact you want to state]. Keep my voice — same formality, my kind of words. After the draft, give me the single best source for that fact: the publication or author, the exact sentence from it that backs the claim, and a link. List anything you are not certain is real so I can check it myself.",
      "note": "The voice sample is load-bearing, but it can be invented. Remove names, contact details, locations, and private context before pasting anything into an outside assistant. Example sample: 'Hey — quick one. I keep meaning to ask about Saturday but life has been wild. Let me know what works and I'll make it happen.' Then pick a low-stakes piece, such as a four-sentence garden-group post, and verify its fact on an authoritative source you open yourself."
    },
    {
      "kind": "workflowChain",
      "title": "The two author jobs, in order",
      "goal": "Turn the AI draft into a finished piece that sounds like you and rests on a fact you confirmed.",
      "correct": [
        "Read the draft and circle every word or phrase you'd never say.",
        "Rewrite each circled phrase in your own words so the voice is yours.",
        "Actually open the source the AI gave you.",
        "Run the three checks: Does it exist? Is it really by who it claims? Does it say the exact thing?",
        "If any check fails, cut the fact or replace it with one you confirmed yourself.",
        "If the fact touches health, money, or law, confirm it with a professional or official source before acting."
      ],
      "note": "Voice first, then verify. Skipping either job leaves you with a fake-sounding you, or a real-sounding lie."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your Voice + Verify card",
      "cardType": "Writing & source-check checklist",
      "fields": [
        {
          "key": "voiceSample",
          "label": "My voice sample",
          "placeholder": "2–4 real sentences you actually wrote"
        },
        {
          "key": "rewrites",
          "label": "Phrases I rewrote",
          "placeholder": "at least 2 phrases I changed into my own words"
        },
        {
          "key": "verdict",
          "label": "Source verdict",
          "placeholder": "verified / doesn't match / not found"
        },
        {
          "key": "line",
          "label": "The exact line (or its absence)",
          "placeholder": "the sentence in the source that justifies my verdict"
        },
        {
          "key": "proCheck",
          "label": "Pro to check (health/money/law)",
          "placeholder": "doctor, pharmacist, lawyer, or official source — or 'n/a'"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do both jobs on a new example",
      "question": "Take a brand-new writing task of your own that needs a fact. You draft it with AI, then finish it yourself. Which of these means you actually did both author jobs?",
      "options": [
        {
          "text": "I can point to at least two phrases I rewrote into my own voice, and I give a one-word verdict on the source (verified / doesn't match / not found) naming the exact line that justifies it — plus, if it's health/money/law, the professional I'd check.",
          "ok": true,
          "feedback": "That's both jobs done on a new example: voice made yours, and the fact confirmed at the source (with a pro named for sensitive facts). That's the whole skill."
        },
        {
          "text": "The AI gave me a clean draft and a citation with an author and a link, so the writing's done and the fact is backed up.",
          "ok": false,
          "feedback": "That's the exact misconception. A citation you didn't open isn't proof, and a generic draft isn't your voice — both jobs are still yours."
        },
        {
          "text": "I rewrote a few phrases so it sounds like me. The fact came from AI, so it's probably fine.",
          "ok": false,
          "feedback": "You did the voice job but skipped verify. AI predicts believable text — open the source and confirm the exact line before you trust the fact."
        },
        {
          "text": "I opened the source and it's real and by the right author — I didn't check whether it actually states my claim.",
          "ok": false,
          "feedback": "Existing and being by the right author isn't enough. A real source can still fail to say the exact thing you're claiming — that third check is the one that catches fake citations."
        }
      ]
    }
  ]
};
