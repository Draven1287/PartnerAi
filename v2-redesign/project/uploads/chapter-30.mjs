// Lesson 30 — Build a capstone
// Arc: Building   (authored)
export default {
  "id": "chapter-30",
  "num": 30,
  "arc": "Building",
  "title": "Build a capstone",
  "coreQuestion": "What can I actually build now that I understand AI?",
  "blurb": "Put it all together: a real project where AI helps and you stay in charge.",
  "minutes": 14,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Now build something real",
      "scenario": "You’ve learned how AI works, how to prompt it, how to verify it, where its limits are, and how to design safe workflows and tools. This is where it becomes yours: pick one real thing to build and make it work.",
      "prompt": "What useful thing would you build — a study coach, a workflow assistant, a creative partner, a debug helper, a planner, or a classroom activity?"
    },
    {
      "kind": "classify",
      "title": "Strong project, or not yet?",
      "prompt": "A capstone needs all the pieces. Sort what belongs in a strong project plan.",
      "buckets": [
        "Belongs in the plan",
        "Missing / not enough"
      ],
      "items": [
        {
          "text": "A clear user and the problem it solves",
          "answer": 0
        },
        {
          "text": "“It uses AI and is really cool.”",
          "answer": 1
        },
        {
          "text": "Defined input, output, and a success measure",
          "answer": 0
        },
        {
          "text": "No plan for failure, privacy, or human review",
          "answer": 1
        }
      ],
      "reveal": "A strong capstone names the user, problem, input, output, prompt/workflow, risks, how it’s tested, and what stays human."
    },
    {
      "kind": "reveal",
      "title": "The eight pieces of a real project",
      "body": "A complete AI project has: a user, a problem, an input, an output, the prompt or workflow that does the work, the risks (privacy, errors, misuse), an evaluation plan (how you tested it), and a reflection on what AI did vs. what you decided. Miss the last three and it’s a demo, not a project.",
      "mistake": "Building something impressive with no success measure, no failure plan, and no human checkpoint.",
      "good": "Define success, test the hard cases, and keep the human in charge of the important calls."
    },
    {
      "kind": "tryLive",
      "title": "Have AI critique your plan",
      "prompt": "Here’s my capstone plan: [user, problem, input, output, workflow]. Critique it. What’s unclear, what could fail, what privacy or accuracy risks exist, and where must a human stay in charge? Don’t rewrite my plan — pressure-test it.",
      "react": "Read the critique and fix the weakest part yourself. The plan is yours; AI just stress-tested it."
    },
    {
      "kind": "workflowChain",
      "title": "Order your build",
      "goal": "Take your capstone from idea to a tested, trustworthy project.",
      "correct": [
        "Define the user and the problem",
        "Define the input and the output",
        "Build the prompt or workflow that does the work",
        "List the risks (privacy, errors, misuse)",
        "Test it on easy AND hard cases",
        "Decide what AI did and what stays a human call"
      ],
      "note": "This is every arc of the course in one sequence: understand, prompt, verify, judge, apply, build."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your capstone project card",
      "cardType": "Capstone project",
      "fields": [
        {
          "key": "user",
          "label": "User & problem",
          "placeholder": "who it helps, what problem"
        },
        {
          "key": "io",
          "label": "Input → output & workflow",
          "placeholder": "what it takes in and produces"
        },
        {
          "key": "human",
          "label": "What AI did vs. what I decided",
          "placeholder": "and how I tested it"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Final check",
      "question": "What turns an AI capstone from a demo into a real project?",
      "options": [
        {
          "text": "It looks impressive and uses a powerful model",
          "ok": false,
          "feedback": "Impressive isn’t the bar — tested and trustworthy is."
        },
        {
          "text": "It defines success, tests hard cases, and keeps a human in charge",
          "ok": true,
          "feedback": "Right — that’s the whole course in one project. You built it."
        },
        {
          "text": "AI did all the work end to end",
          "ok": false,
          "feedback": "Then it’s the AI’s project, not yours — you stayed out of charge."
        }
      ]
    }
  ]
};
