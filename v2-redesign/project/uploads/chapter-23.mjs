// Lesson 23 — Business & workflows
// Arc: Applying   (authored)
export default {
  "id": "chapter-23",
  "num": 23,
  "arc": "Applying",
  "title": "Business & workflows",
  "coreQuestion": "Which repeated tasks can AI take — and where must a human still check?",
  "blurb": "Automate the repeatable parts, but keep a human checkpoint before anything ships.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The task you do every single week",
      "scenario": "Every week you (or a small business) redo the same thing: drafting the same kind of email, summarizing the same kind of report, sorting the same kind of request. It’s repetitive, rule-based, and a perfect candidate for an AI workflow — if it’s set up safely.",
      "prompt": "What makes a task a good fit for AI — and what would make it dangerous to automate?"
    },
    {
      "kind": "classify",
      "title": "Good fit, or risky?",
      "prompt": "Sort each task by whether it’s a safe candidate for an AI workflow.",
      "buckets": [
        "Good fit for AI",
        "Risky to automate"
      ],
      "items": [
        {
          "text": "Draft a first-pass reply that a person reviews before sending",
          "answer": 0
        },
        {
          "text": "Auto-send replies to customers with no human check",
          "answer": 1
        },
        {
          "text": "Summarize incoming reports for a human to scan",
          "answer": 0
        },
        {
          "text": "Approve refunds automatically based on AI judgment",
          "answer": 1
        }
      ],
      "reveal": "AI fits tasks with clear inputs, repeatable steps, and a human checkpoint before anything important goes out."
    },
    {
      "kind": "reveal",
      "title": "Inputs, steps, outputs — and a checkpoint",
      "body": "A task is a good workflow candidate when it has clear inputs, repeatable steps, and a defined output. The non-negotiable part is the review checkpoint: a human approves before the result reaches a customer, a decision, or anything hard to undo.",
      "mistake": "Automating end-to-end with no one checking, because it ran fine in testing.",
      "good": "Let AI draft and sort; require a human “approve” step before it ships."
    },
    {
      "kind": "workflowChain",
      "title": "Map a safe workflow",
      "goal": "Turn a weekly repeated task into a safe AI-assisted workflow.",
      "correct": [
        "Define the input the task always starts with",
        "Have AI do the repeatable step (draft / sort / summarize)",
        "Produce the output in a consistent format",
        "A human reviews and approves it",
        "Note what to improve for next time"
      ],
      "note": "The human checkpoint is what makes it a workflow you can trust, not just automation you hope works."
    },
    {
      "kind": "tryLive",
      "title": "Draft a workflow",
      "prompt": "I do this repeated task: [describe it]. Help me design a simple workflow: what’s the input, what AI does, what the output looks like, and exactly where a human should review before it goes out.",
      "react": "Look at where AI put the human checkpoint. Is it before the risky step? Move it if not — you own that call."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your workflow review map",
      "cardType": "Workflow map",
      "fields": [
        {
          "key": "input",
          "label": "Input",
          "placeholder": "what the task starts with"
        },
        {
          "key": "aistep",
          "label": "AI step",
          "placeholder": "draft / sort / summarize"
        },
        {
          "key": "check",
          "label": "Human checkpoint",
          "placeholder": "what a person approves, and when"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What’s the one thing a trustworthy AI workflow must include?",
      "options": [
        {
          "text": "Full automation so no human is needed",
          "ok": false,
          "feedback": "No-human automation is exactly where it goes wrong unseen."
        },
        {
          "text": "A human review point before anything important ships",
          "ok": true,
          "feedback": "Right — inputs and outputs matter, but the checkpoint is essential."
        },
        {
          "text": "The fastest possible turnaround",
          "ok": false,
          "feedback": "Speed without a check just lets mistakes out faster."
        }
      ]
    }
  ]
};
