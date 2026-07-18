// Lesson 40 — The Draft-and-Critique Loop
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-40",
  "num": 40,
  "arc": "AI for Real Life",
  "title": "The Draft-and-Critique Loop",
  "coreQuestion": "How do I get genuinely better work out of AI — not from one prompt, but from looping draft, critique, and revise against my own standards?",
  "blurb": "Good work comes from loops, not first tries. Learn the draft-critique-revise cycle.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The rough first draft",
      "scenario": "You ask AI to write a 3-sentence intro for your school robotics club. It comes back flat: \"Robotics club is cool. We build robots and go to competitions sometimes. Come join if you want, meetings are Tuesdays.\" It's fine. It's also boring.",
      "prompt": "Before you read on: is a so-so first draft a sign the AI is bad at this (or that you are)? Or is it just the normal starting point for something better?"
    },
    {
      "kind": "reveal",
      "title": "Quality lives in the loop, not the draft",
      "body": "Good work comes from loops, not first tries: draft, critique it against your own standards, revise, then do it again. A rough first version is normal and expected — the quality doesn't live in the draft, it lives in the loop you run on it. Here's the mechanism to be honest about: when AI \"critiques\" your draft, it isn't judging you or deciding what's truly good. That word 'critique' is a handy comparison, not what's really happening. What it actually does is predict, from patterns in human writing, where your text falls short of the criteria you gave it. That's why vague criteria ('make it better') buy you vague critique, and sharp, testable criteria buy you sharp critique. You set the standard; the AI just predicts how your text measures up. One privacy note: keep your draft to something you'd be fine pasting — skip real names, addresses, or anything private.",
      "mistake": "Throw out the first draft (or blame the AI) the moment it isn't great, and ask for a total rewrite.",
      "good": "Keep the draft, write down what 'good' actually means here, and run a critique-and-revise loop on it — twice."
    },
    {
      "kind": "workflowChain",
      "title": "Run two full loops",
      "goal": "Turn a rough draft into a version that's clearly better by your own named criteria.",
      "correct": [
        "Make something short and imperfect yourself — don't polish it",
        "Write down 3 testable criteria for what 'good' means here",
        "Ask AI to critique it against those criteria — not rewrite it",
        "You revise it yourself and paste the new version back",
        "Ask for a critique a second time (loop two)",
        "Put draft one next to your final and watch the climb"
      ],
      "note": "You do the revising, not the AI. The AI predicts where your text misses your criteria; the judgment and the rewriting stay yours."
    },
    {
      "kind": "tryLive",
      "title": "Run the critique prompt",
      "prompt": "Here is my draft of [what it is]: [paste your draft]. Do NOT rewrite it. Critique it against these criteria I'm setting: 1) [criterion 1], 2) [criterion 2], 3) [criterion 3]. For each criterion, tell me one thing that's working and the single most important fix. Keep it short. I'll revise it myself and paste the new version back for a second round.",
      "note": "Make each criterion testable. Example for a robotics-club intro: 1) 'clear in a single read,' 2) 'sounds like a real teenager, not a brochure,' 3) 'makes someone actually want to show up.' Swap in your own thing: a club bio, a cover-letter paragraph, an email, a proposal, or a note to family."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your criteria card",
      "cardType": "Draft-and-critique loop",
      "fields": [
        {
          "key": "thing",
          "label": "What you're drafting",
          "placeholder": "a 3-sentence intro for my robotics club"
        },
        {
          "key": "c1",
          "label": "Criterion 1 (testable)",
          "placeholder": "clear in a single read"
        },
        {
          "key": "c2",
          "label": "Criterion 2 (testable)",
          "placeholder": "sounds like a real teenager, not a brochure"
        },
        {
          "key": "c3",
          "label": "Criterion 3 (testable)",
          "placeholder": "makes someone actually want to show up"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove you've got the loop",
      "question": "Pick a brand-new piece you didn't use above. Write 3 testable criteria, run two full loops, then name which specific criterion drove each change between your draft and your final. Which of these means you've actually got the loop?",
      "options": [
        {
          "text": "For each edit between draft and final, I can point to the exact criterion it was serving.",
          "ok": true,
          "feedback": "That's it. If you can name the criterion behind each edit on a fresh piece, you own the loop — not just one lucky answer."
        },
        {
          "text": "The AI's second version read more smoothly than its first, so it must be better.",
          "ok": false,
          "feedback": "Smoother isn't the test, and the AI shouldn't be doing the rewriting. Better means better against criteria you wrote — and named for each change."
        },
        {
          "text": "I used one criterion, 'make it stronger,' and looped until I was happy.",
          "ok": false,
          "feedback": "Vague criteria buy vague critique. The loop is only as sharp as your standards — you need testable criteria you can point to."
        }
      ]
    }
  ]
};
