// Lesson 46 — Agents and Permissions
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-46",
  "num": 46,
  "arc": "Becoming a Builder",
  "title": "Agents and Permissions",
  "coreQuestion": "When AI can act for you, how do you stay in charge of what it's allowed to see and do?",
  "blurb": "Give an agent the smallest access it needs, a stop-sign before anything it can't undo — and keep watching.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "\"I can clean up your files for you\"",
      "scenario": "An agent offers to tidy your computer. An agent isn't just a chatbot that answers — it takes several steps toward a goal on its own: it can plan, browse the live web, use tools, and act, checking itself as it goes. In 2026, real assistants genuinely do this. So this offer is helpful — or one wrong move from deleting a folder you wanted to keep.",
      "prompt": "Before you read on: the real question isn't \"is this agent smart?\" It's \"what can it actually reach?\" What would you want to know it CAN'T touch before you let it start?"
    },
    {
      "kind": "agentDesign",
      "title": "Which powers does this agent actually need?",
      "goal": "You want an agent to tidy and rename the photos in one folder called 'Trip 2026' so you can find them later. Give it the smallest access that still gets the job done — pick the tools it needs and reject the ones that reach too far.",
      "tools": [
        {
          "name": "Read the file names inside the 'Trip 2026' folder",
          "useful": true
        },
        {
          "name": "Rename files and make new subfolders inside that folder",
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
          "name": "Move files out of 'Trip 2026' to somewhere else",
          "useful": false
        }
      ],
      "note": "Least access: grant only what the task needs. Deleting and moving are irreversible — those belong on the ask-first list, not handed over up front. Reading your whole computer is scope it never needed."
    },
    {
      "kind": "reveal",
      "title": "Least access + a stop-sign you can see",
      "body": "Before handing an agent any task, ask three questions: What can it SEE? What can it CHANGE? What must it NEVER do without asking me first? Write those as three lines and paste them at the top of the task. That's the rule: least access, plus review before anything irreversible. People picture this like a leash on a strong, eager dog — but that's a comparison, and here's what's really happening: there's no dog and no obedience. The \"leash\" is just words you wrote at the top of the prompt. The agent follows them because they're instructions, not because it's locked in — and the wording isn't guaranteed to hold every time. Your real safety is that you stay watching the steps as they happen, and you can stop it. And note: even in 2026, agents that browse and use tools still make mistakes and still make things up — watching is not optional.",
      "mistake": "Giving the agent full access and hoping it behaves, then walking away while it runs.",
      "good": "Writing three lines — SEE, CHANGE, ASK-FIRST — pasting them at the top of the task, and staying at the screen to watch each step."
    },
    {
      "kind": "tryLive",
      "title": "Hand over a real task with written limits",
      "prompt": "Act as an agent for this task: [the task, e.g. tidy and rename the photos in one folder so I can find them later]. Follow these limits exactly.\nYou may SEE: [the smallest scope that still works, e.g. only the folder named 'Trip 2026' — nothing else on my computer].\nYou may CHANGE: [what it can edit or create, e.g. rename files and make new subfolders; don't change what's inside any photo].\nYou must ASK ME FIRST before: [the irreversible or sensitive actions, e.g. deleting any file, or moving files out of that folder].\nWork in steps. Before each step, tell me what you're about to do. If a step needs anything outside these limits, stop and ask me instead of doing it. If I type 'Pause,' stop immediately and wait for new instructions.",
      "note": "Fill the brackets for a task you'd really hand over. Then, partway through, type \"Pause — change of plan\" and redirect it. Watch two things: does it stop at your ask-first line, and does it obey the Pause?"
    },
    {
      "kind": "workflowChain",
      "title": "The order that keeps you in charge",
      "goal": "Safely hand a folder-tidying task to an agent and stay in control the whole way through.",
      "correct": [
        "Ask the three questions: what can it SEE, CHANGE, and never do without asking?",
        "Write those as three lines and paste them at the top of the task",
        "Run the task and watch each step it announces",
        "When it hits an ask-first action, confirm it stops and waits for you",
        "Partway through, type 'Pause' and redirect it to test that you can steer",
        "If it slipped past either check, tighten the wording and rerun"
      ],
      "note": "The limits come BEFORE you run, not after something goes wrong. These written rules are best-effort, not a locked gate — an agent can occasionally slip past one, which is exactly why watching and the Pause come last and never leave."
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a fresh task",
      "question": "Take a task you haven't used yet — \"draft replies to three emails in my drafts folder\" — and hand it to an agent. What makes you PASS?",
      "options": [
        {
          "text": "You write fresh SEE / CHANGE / ASK-FIRST limits (SEE: only those three drafts; CHANGE: write reply text; ASK FIRST: sending any email or opening any other message), the agent stops at your ask-first line, AND it halts and changes course when you type 'Pause.'",
          "ok": true,
          "feedback": "That's it — you set the limits in writing before it ran, and you proved you can stop and steer it mid-run. If it sailed past either check, tighten the wording and rerun until both hold, and keep watching the steps."
        },
        {
          "text": "The agent finished all three replies quickly and didn't bother you with any questions.",
          "ok": false,
          "feedback": "Speed with no stops is the warning sign, not the win. If it never paused at an ask-first line, your limits weren't holding — tighten them and check that it stops before anything you can't undo."
        },
        {
          "text": "You gave it full access to your whole inbox so it wouldn't get stuck, and trusted it to behave.",
          "ok": false,
          "feedback": "That's the exact misconception to drop. You never have to hand over the keys to everything — set the smallest scope in writing first, and stay watching."
        }
      ]
    }
  ]
};
