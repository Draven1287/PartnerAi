// Lesson 46 — Agents and Permissions
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-46",
  "num": 46,
  "arc": "Becoming a Builder",
  "title": "Agents and Permissions",
  "coreQuestion": "When AI can act for you, how do you stay in charge of what it's allowed to see and do?",
  "blurb": "Practice least privilege in a fixed capability-matrix exercise: technical controls first, prompt promises second, and no real accounts required.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "\"I can clean up your files for you\"",
      "scenario": "A fictional agent offers to tidy a practice folder. Unlike a chatbot that only answers, an agent can take several steps and use tools. This exercise shows five possible powers. Your job is not to trust its promise; it is to decide which powers a real system should technically allow.",
      "prompt": "Before you read on: the real question isn't \"is this agent smart?\" It's \"what can it actually reach?\" What would you want to know it CAN'T touch before you let it start?"
    },
    {
      "kind": "agentDesign",
      "title": "Set the capability matrix",
      "goal": "In a fixed simulation, an agent may organize six invented files inside a practice folder called 'Demo Trip.' Select the smallest technical capabilities that allow reversible renaming and grouping. No real folder is connected.",
      "tools": [
        {
          "name": "Read the six invented filenames inside 'Demo Trip'",
          "useful": true
        },
        {
          "name": "Preview reversible renames and proposed subfolders inside 'Demo Trip'",
          "useful": true
        },
        {
          "name": "Delete any file it decides is a duplicate",
          "useful": false
        },
        {
          "name": "Read every other folder on your computer",
          "useful": false
        },
        {
          "name": "Move files out of 'Demo Trip' to somewhere else",
          "useful": false
        }
      ],
      "note": "This is a capability matrix, not a prompt. Least privilege means the system cannot perform powers you did not select. The practice agent never receives real folder, photo, email, or account access."
    },
    {
      "kind": "reveal",
      "title": "Least access + a stop-sign you can see",
      "body": "Before handing an agent a task, decide what it may SEE, what it may CHANGE, and what requires ASK-FIRST approval. Written instructions help, but they are not a permission lock. Use actual app or operating-system permissions when available, start with a dry run on invented files, keep a visible action log, and require human approval before sending, posting, spending, deleting, overwriting, moving, or sharing. Privacy rule: do not connect an outside agent to real accounts, messages, contacts, photos, or files just to complete this lesson; data and access can leave LearningAI. If you cannot see or revoke a permission, do not grant it.",
      "mistake": "Giving the agent full access and hoping it behaves, then walking away while it runs.",
      "good": "Limiting the real capability scope, previewing changes in a sandbox, requiring approval, keeping a log, and refusing the run when those controls are unavailable."
    },
    {
      "kind": "classify",
      "title": "Control or promise?",
      "prompt": "Sort each protection. A technical control prevents or blocks an action. A prompt promise only asks the model to behave and cannot prove the action is impossible.",
      "buckets": [
        "Technical control or observable evidence",
        "Prompt promise only"
      ],
      "items": [
        { "text": "A real sandbox exposes only six invented filenames and has no connection to the rest of the device", "answer": 0 },
        { "text": "The instruction says, 'Please do not look anywhere else'", "answer": 1 },
        { "text": "Rename actions appear in a preview log and cannot apply until a person approves", "answer": 0 },
        { "text": "The agent says, 'I promise I will pause before deleting'", "answer": 1 },
        { "text": "Delete is absent from a product's enforced capability matrix and its sandbox has a tested reset", "answer": 0 }
      ],
      "reveal": "Prompts can communicate intent, but they are not technical permissions. Strong evidence comes from scoped capabilities, a visible preview or log, a human approval gate, revocation, and rollback. If a product cannot show those controls, use the simulation and do not give it real access."
    },
    {
      "kind": "workflowChain",
      "title": "Design the order that keeps you in charge",
      "goal": "Plan a contained 'Demo Trip' run without pretending this lesson has access to a real agent, log, pause button, or filesystem.",
      "correct": [
        "Inspect the capability matrix and select only read-in-sandbox and preview-rename powers",
        "Reject delete, whole-device reading, and moving anything outside the invented folder",
        "Write the controls a real product would need before use: dry-run preview, action log, approval gate, Pause, revocation, and rollback",
        "Check the real product interface and documentation for those controls instead of assuming the prompt creates them",
        "If any required control or evidence is missing, keep the task as a paper design and do not connect a real account or folder"
      ],
      "note": "The capability-matrix and planning exercise are the complete required practice. They teach what to demand from a real product; they do not claim that LearningAI executed or verified those controls."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your permission boundary",
      "cardType": "Agent permission plan",
      "fields": [
        { "key": "see", "label": "The smallest thing it may see", "placeholder": "Only the practice folder or invented drafts" },
        { "key": "change", "label": "The smallest thing it may change", "placeholder": "Only reversible edits inside the sandbox" },
        { "key": "ask", "label": "Actions that always require approval", "placeholder": "Send, post, buy, delete, move, or share" }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a fresh task",
      "question": "For a different proposed task — drafting replies to three made-up messages without sending — which setup is safe enough to test in a real sandbox?",
      "options": [
        {
          "text": "The product can enforce access to only three invented drafts, preview draft-only changes in a visible log, technically block sending pending approval, pause the run, revoke access, and reset the sandbox.",
          "ok": true,
          "feedback": "That setup has the enforceable scope, observable record, human stop, revocation, and rollback the task needs. Prompt wording alone would not create those controls."
        },
        {
          "text": "The replies are accurate and the agent says it followed the prompt, but there is no visible permission scope or action log.",
          "ok": false,
          "feedback": "Accurate output is not permission evidence. Without visible scope and a log, you cannot confirm what it reached or changed. Keep it in the sandbox and tighten real permissions."
        },
        {
          "text": "You gave temporary full inbox access because the prompt clearly said not to send anything.",
          "ok": false,
          "feedback": "A prompt promise does not reduce technical access. Keep the task in the fixed simulation unless the product can enforce least privilege, approval, logging, revocation, and rollback."
        }
      ]
    }
  ]
};
