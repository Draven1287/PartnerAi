// Lesson 25 — From prompt to workflow
// Arc: Building
export default {
  "id": "chapter-25",
  "num": 25,
  "arc": "Building",
  "title": "From prompt to workflow",
  "coreQuestion": "How do I chain prompts into a repeatable workflow?",
  "blurb": "Turn a repeated AI task into a small system with inputs, checks, saved output, and a human approval point.",
  "minutes": 12,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The repeated-task problem",
      "scenario": "You keep asking AI to help with the same kind of task: summarize notes, make a study plan, check a draft, or turn ideas into a project outline. Each time, you rewrite the prompt from scratch.",
      "prompt": "A workflow is how you stop starting over. It turns one useful prompt into a repeatable path."
    },
    {
      "kind": "classify",
      "title": "Sort the pieces",
      "prompt": "Decide whether each piece is a one-off prompt, a workflow step, or unsafe automation.",
      "buckets": [
        "One-off prompt",
        "Workflow step",
        "Unsafe automation"
      ],
      "items": [
        {
          "text": "“Explain this paragraph.”",
          "answer": 0
        },
        {
          "text": "Collect the input before asking AI to transform it.",
          "answer": 1
        },
        {
          "text": "Send the AI answer automatically without anyone checking it.",
          "answer": 2
        },
        {
          "text": "Compare the output against a rubric before saving it.",
          "answer": 1
        }
      ],
      "reveal": "A workflow is not more magic. It is a safer sequence of small steps."
    },
    {
      "kind": "workflowChain",
      "title": "Build the safe order",
      "goal": "Create a repeatable workflow for turning messy class notes into a useful study guide.",
      "correct": [
        "Collect the notes and goal",
        "Ask AI for a first draft",
        "Check facts and missing parts",
        "Revise the prompt or output",
        "Save the final study guide",
        "Decide what still needs human review"
      ],
      "note": "The order matters because AI output should be inspected before it becomes something you rely on."
    },
    {
      "kind": "reveal",
      "title": "What changed?",
      "body": "A prompt asks for one answer. A workflow defines the input, the AI job, the check, the saved artifact, and the human approval point. That is how you begin building with AI instead of only chatting with it.",
      "mistake": "Skipping the check step because the AI answer sounds polished.",
      "good": "Make the check part of the workflow so quality is not optional."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your first workflow card",
      "cardType": "Workflow card",
      "fields": [
        {
          "key": "task",
          "label": "Repeated task",
          "placeholder": "Example: turn notes into a study guide"
        },
        {
          "key": "input",
          "label": "Input needed",
          "placeholder": "What you give the AI first"
        },
        {
          "key": "instruction",
          "label": "AI instruction",
          "placeholder": "What the AI should do"
        },
        {
          "key": "check",
          "label": "Verification check",
          "placeholder": "How you catch weak or wrong output"
        },
        {
          "key": "approval",
          "label": "Human approval point",
          "placeholder": "What you decide before using it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Exit check",
      "question": "Which version is a real workflow?",
      "options": [
        {
          "text": "Ask AI to “make it better” until it sounds good",
          "ok": false,
          "feedback": "That is still a loose conversation, not a repeatable path."
        },
        {
          "text": "Input → AI draft → check → revise → save → human approval",
          "ok": true,
          "feedback": "Right. The workflow includes checks and a decision point."
        },
        {
          "text": "Let AI receive, rewrite, and send everything automatically",
          "ok": false,
          "feedback": "That removes the safety and judgment steps."
        }
      ]
    }
  ]
};
