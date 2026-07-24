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
      "scenario": "You need a three-sentence invitation for a game night, community cleanup, repair service, or club. The first draft is clear but flat. Sending it now is fast; revising it could make the right people understand and respond.",
      "prompt": "Choose three standards before changing a word: clarity, honesty, voice, usefulness, or response. Which tradeoff matters most for this audience, and what evidence would show the revision improved it?"
    },
    {
      "kind": "reveal",
      "title": "Quality lives in the loop, not the draft",
      "body": "Good work comes from loops: draft, compare it with your standards, revise, and test again. When AI 'critiques,' it generates plausible observations from your criteria; it does not decide what is truly good or know how your audience will react. Some suggestions will be useful and some will flatten your voice or miss the goal. You set the standard, decide which feedback is valid, and can reject advice with a reason. Before using an outside assistant, remove real names, addresses, private messages, unpublished client or school material, and another person's information. Data entered there leaves LearningAI; a made-up draft works.",
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
      "note": "Make each criterion observable. Example: 1) 'the time and action are clear in one read,' 2) 'uses words I would say,' 3) 'makes no promise I cannot keep.' Use an invented or redacted invitation, listing, instruction card, application paragraph, or family note. After each critique, accept one suggestion, reject one with a reason, and make the revision yourself."
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
          "text": "The second draft is smoother and shorter, but it removed a detail my audience needs.",
          "ok": false,
          "feedback": "Smoother isn't the test, and the AI shouldn't be doing the rewriting. Better means better against criteria you wrote — and named for each change."
        },
        {
          "text": "I met two clear criteria, but changed a third criterion halfway through without recording why.",
          "ok": false,
          "feedback": "Changing a standard can be valid, but record the reason and retest the earlier draft against the new standard. Otherwise the comparison cannot show what improved."
        }
      ]
    }
  ]
};
