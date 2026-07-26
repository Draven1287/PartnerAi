// Lesson 44 — From Prompt to Workflow
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-44",
  "num": 44,
  "arc": "Building with AI",
  "title": "Write It Once, Reuse It Forever",
  "coreQuestion": "How do I turn a request I type over and over into a saved recipe where only one thing changes?",
  "blurb": "Stop retyping the same request. Write the steps once, and swap in the new bit each time.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The third time this week",
      "scenario": "For the third time this week you type almost the same request.\n\nTurn this shopping list, or this repair checklist, or these meeting notes, into the same tidy format.\n\nSame instructions. New stuff. Every single time.",
      "prompt": "What part of that request actually changes each time you send it? What part is word for word the same?"
    },
    {
      "kind": "classify",
      "title": "A fixed step, or the new bit?",
      "prompt": "You keep asking it to turn meeting notes into a to-do list. Sort each piece. Is it one of the steps that never change, or the new stuff you paste in each time?",
      "buckets": [
        "A step that never changes",
        "The new bit each time"
      ],
      "items": [
        {
          "text": "\"Pull out every job as its own line.\"",
          "answer": 0
        },
        {
          "text": "This week's messy notes, pasted in.",
          "answer": 1
        },
        {
          "text": "\"For each job, add who is doing it and any deadline mentioned.\"",
          "answer": 0
        },
        {
          "text": "\"Lay the answer out as a checklist with empty [ ] boxes.\"",
          "answer": 0
        },
        {
          "text": "The names and dates from today's meeting.",
          "answer": 1
        }
      ],
      "reveal": "The instructions are identical every time. Only the notes change. That gap is the whole trick. Write the fixed part once, and mark the changing part as one clear slot."
    },
    {
      "kind": "reveal",
      "title": "A recipe you only write once",
      "body": "Here is the idea. Take a job you do again and again. Write it as numbered steps, with one blank slot for the thing that changes. Then you only ever fill the blank.\n\nPeople call that a workflow. It is just a recipe with one changing ingredient.\n\nReusing it saves real time. It also repeats your mistakes. A bad step, or a careless habit with private stuff, now happens every single run.\n\nSo before an outside app sees anything, take out real names, addresses, timetables, contact details, account details, private messages, confidential documents, and anything about another person. What you type there leaves LearningAI. Made-up material works fine for practice.\n\nAnd put a stop in it. Before anything gets sent, posted, booked, deleted, bought, or used to judge a person, you read it and say yes.",
      "mistake": "Retyping the whole request from scratch every time, explaining the same instructions you have already explained ten times.",
      "good": "Writing the fixed instructions once as numbered steps. Marking the one changing part [INPUT], which just means the bit you paste in fresh."
    },
    {
      "kind": "workflowChain",
      "title": "Build the reusable version",
      "goal": "Turn a request you keep retyping into a saved recipe with one blank slot.",
      "correct": [
        "Find a job you ask for more than once. Same job, different details.",
        "Split the part that NEVER changes, the steps, from the part that ALWAYS changes, the new bit.",
        "Write the fixed part as numbered steps that would work for ANY version of this job, not just today's.",
        "Mark the one changing part clearly as [INPUT].",
        "Run it once on made-up material, and check the answer against your own rule for good enough.",
        "Run it again on something different, then add a stop where a person says yes before anything real happens."
      ],
      "note": "The proof is the second run. If you only had to change the [INPUT] and both answers came out the same shape, you built something reusable. If you found yourself rewriting a step, that step was secretly part of the changing bit. Move it into the slot."
    },
    {
      "kind": "tryLive",
      "title": "Run yours twice",
      "prompt": "This is a saved recipe I will reuse. Follow these numbered steps every time, in order. Only the INPUT changes each run.\nSteps:\n1. [step one, what to do first]\n2. [step two, what to do next]\n3. [step three, how to lay it out or finish]\nHow the answer should look: [describe it]\nINPUT: [paste the one thing that changes this run]",
      "note": "Use made-up material first, or take the details out. Swap names for roles and drop anything private or confidential. Run it twice. Compare both answers against the same rule for good enough. Add 'STOP AND ASK ME' before anything is sent, posted, booked, deleted, bought, or used to judge somebody. For health, money, law or safety, only use it to prepare questions, and take the decision to a qualified person."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your recipe",
      "cardType": "A recipe I can reuse",
      "fields": [
        {
          "key": "name",
          "label": "What I call it",
          "placeholder": "e.g. meeting notes into a to-do list"
        },
        {
          "key": "steps",
          "label": "The steps that never change",
          "placeholder": "1. Read it. 2. Pull out every job as its own line. 3. Add who is doing it and the deadline."
        },
        {
          "key": "format",
          "label": "How the answer should look",
          "placeholder": "A checklist with [ ] boxes, the name in brackets, soonest deadline first"
        },
        {
          "key": "input",
          "label": "The one blank slot",
          "placeholder": "What I paste in fresh each time, e.g. this week's messy notes"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually build one?",
      "question": "You wrote your steps and ran them on Monday's notes. To prove it is reusable and not just a one-off request, what do you do next?",
      "options": [
        {
          "text": "Run the exact same steps, untouched, on completely different material of the same kind. Change only the [INPUT].",
          "ok": true,
          "feedback": "Yes. The second run on fresh material is the proof. Same steps, new bit, same shape of answer."
        },
        {
          "text": "Save it in the app's memory and assume future material will be as safe as the first lot.",
          "ok": false,
          "feedback": "Memory is not a safety net. Save it somewhere you control, check what the app keeps, and clean each new piece of material before you paste it."
        },
        {
          "text": "Rewrite a few of the fixed steps for the second run, but keep calling it the same recipe.",
          "ok": false,
          "feedback": "Then it is a one-off request again. The steps should fit any version of this job. If a step only fits today, it belongs in the slot."
        },
        {
          "text": "Assume it works, because the first run looked good.",
          "ok": false,
          "feedback": "One good run proves nothing about the next one. Run it on a second, different piece without touching the steps. That is the real test."
        }
      ]
    }
  ]
};
