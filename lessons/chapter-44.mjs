// Lesson 44 — From Prompt to Workflow
// Arc: Building with AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-44",
  "num": 44,
  "arc": "Building with AI",
  "title": "From Prompt to Workflow",
  "coreQuestion": "How do I turn a request I make over and over into a saved workflow where only one thing changes each run?",
  "blurb": "Stop retyping the same request. Save the steps once, swap one input each time.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The third time this week",
      "scenario": "For the third time this week you type the same request: turn a grocery plan, game-night log, repair checklist, shift handoff, or meeting notes into the same useful format. Same instructions, new material, every time.",
      "prompt": "Before you read on: what part of that request actually changes each time you send it? And what part stays exactly the same?"
    },
    {
      "kind": "classify",
      "title": "Fixed step or changing input?",
      "prompt": "You re-ask AI to turn meeting notes into an action-item checklist. Sort each piece into what it belongs to: the STEPS that never change, or the INPUT that changes every run.",
      "buckets": [
        "Fixed step (never changes)",
        "Input (changes each run)"
      ],
      "items": [
        {
          "text": "\"Pull out every to-do as a separate line.\"",
          "answer": 0
        },
        {
          "text": "This week's raw meeting notes, pasted in.",
          "answer": 1
        },
        {
          "text": "\"For each to-do, add who owns it and a deadline if one is mentioned.\"",
          "answer": 0
        },
        {
          "text": "\"Format the answer as a checklist with empty [ ] boxes.\"",
          "answer": 0
        },
        {
          "text": "The specific names and dates from today's meeting.",
          "answer": 1
        }
      ],
      "reveal": "The instructions stay the same on every run; only the pasted notes change. That gap is the whole trick: write the fixed part once, mark the changing part as one clear slot."
    },
    {
      "kind": "reveal",
      "title": "A workflow is a prompt you only write once",
      "body": "A workflow is a recurring task written once as numbered steps with a clear input slot. Reuse saves effort, but repetition can also repeat a bad assumption or privacy mistake. Before an outside assistant sees an input, remove real names, addresses, schedules, contact details, account information, private messages, confidential documents, and another person's data. Data entered there leaves LearningAI; invented inputs work. Add an approval step before anything is sent, posted, booked, deleted, purchased, or used to judge a person. The assistant produces a draft result; you inspect and approve each run.",
      "mistake": "Retyping the full request from scratch every time, re-explaining the same instructions you've already explained ten times.",
      "good": "Write the fixed instructions once as numbered steps, mark the one changing detail as [INPUT], and reuse it — filling only that blank."
    },
    {
      "kind": "workflowChain",
      "title": "Build the reusable version",
      "goal": "Turn a request you re-ask into a saved workflow with one input slot.",
      "correct": [
        "Spot a task you ask AI for more than once (same job, different details).",
        "Separate the part that NEVER changes (the steps) from the part that ALWAYS changes (the one input).",
        "Write the fixed part as numbered steps that would make sense for ANY input, not just today's.",
        "Mark the single changing detail clearly as [INPUT].",
        "Run it once on a redacted or invented input and inspect the output against your good-enough rule.",
        "Run it again on a different input, then add human approval before any external or irreversible action."
      ],
      "note": "The proof is the second run. If you only had to change the INPUT slot and both answers came back the same shape, you built a workflow, not just a prompt. If you found yourself rewriting a step, that step was secretly part of the input — move it into the slot."
    },
    {
      "kind": "tryLive",
      "title": "Run your own workflow twice",
      "prompt": "This is a saved workflow I'll reuse. Follow these numbered steps every time, in order. Only the INPUT changes each run.\nSteps:\n1. [step 1 — what to do first]\n2. [step 2 — what to do next]\n3. [step 3 — how to format or finish]\nOutput format: [what the answer should look like]\nINPUT: [paste the one thing that changes this run]",
      "note": "Use redacted or invented inputs first. Replace names with roles and remove private or confidential details. Run it twice, compare both outputs with the same success rule, and add 'STOP FOR MY APPROVAL' before any send, post, booking, deletion, purchase, or decision about a person. For medical, money, legal, or safety material, use AI only to prepare questions and confirm decisions with an accountable professional."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your workflow",
      "cardType": "Reusable workflow",
      "fields": [
        {
          "key": "name",
          "label": "Workflow name",
          "placeholder": "e.g. Meeting notes to action items"
        },
        {
          "key": "steps",
          "label": "Fixed numbered steps",
          "placeholder": "1. Read the input. 2. Pull out every to-do as its own line. 3. Add owner + deadline."
        },
        {
          "key": "format",
          "label": "Output format",
          "placeholder": "Checklist with [ ] boxes, owner in parentheses, nearest deadline first"
        },
        {
          "key": "input",
          "label": "The one input slot",
          "placeholder": "What you'll paste fresh each run, e.g. this week's raw notes"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you actually build a workflow?",
      "question": "You wrote your steps and ran them on Monday's notes. To prove it's a reusable workflow and not just a one-off prompt, what do you do next?",
      "options": [
        {
          "text": "Run the exact same steps unchanged on a totally different input of the same kind, changing only the INPUT slot.",
          "ok": true,
          "feedback": "Yes. The second run on a fresh input is the proof. If you only swapped the INPUT and both answers came back the same shape, you built a workflow."
        },
        {
          "text": "Save the workflow in an assistant's memory and assume future inputs will stay inside the same privacy boundary.",
          "ok": false,
          "feedback": "Memory is not a privacy boundary. Save the workflow where you control it, review what the product retains, and redact each new input before reuse."
        },
        {
          "text": "Rewrite several fixed steps for the second input but keep the same workflow name.",
          "ok": false,
          "feedback": "That makes it a one-off prompt again. Steps should work for ANY input of that kind. If a step only fits today, it was secretly part of the input — move it into the slot."
        },
        {
          "text": "Assume it works because the first run looked good.",
          "ok": false,
          "feedback": "One good run doesn't prove reusability. Run it on a second, different input without touching the steps — that's the real test."
        }
      ]
    }
  ]
};
