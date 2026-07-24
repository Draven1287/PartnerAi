// Lesson 20 — Models, Tools, and Agents
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-20",
  "num": 20,
  "arc": "Trust & Everyday AI",
  "title": "Models, Tools, and Agents",
  "coreQuestion": "What separates a model output, a tool call, and an agentic workflow — and where does human approval belong before a system acts?",
  "blurb": "Read the trace, permissions, and side effects instead of trusting a label or a polished list of steps.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A plan is not proof of an action",
      "scenario": "An assistant says: 'I searched three sites, chose a route, and booked it.' The reply contains a neat list of steps. But there is no source trace, permission request, booking confirmation, or account change. It may have described actions without performing any.",
      "prompt": "Before you read on: what evidence would separate words about an action from a tool actually running or an agentic workflow changing something?"
    },
    {
      "kind": "reveal",
      "title": "Output, operation, workflow",
      "body": "A MODEL produces an output from the information supplied to it and patterns learned during development. A TOOL is an outside operation the surrounding software can call — such as search, calculation, file reading, or calendar access. An AGENTIC WORKFLOW is an orchestrated loop that pursues a goal across steps: it chooses or is assigned a next action, calls tools, reads results, keeps state, and may continue until a stop condition. These are not three sealed boxes. An agentic system normally includes a model and tools, while an ordinary assistant may quietly use a tool for one answer. The useful questions are observable: What input was supplied? Which operation actually ran? What permission or data crossed a boundary? What side effect occurred? Where did a human approve, stop, or undo it?",
      "mistake": "Calling any long answer an agent, or assuming a web link proves that a live tool ran.",
      "good": "Inspect the execution trace, permissions, outputs, and side effects; if the interface does not expose them, say the mode is not established."
    },
    {
      "kind": "classify",
      "title": "What does the evidence establish?",
      "prompt": "Classify each built-in trace. Use 'cannot tell' when the output does not prove what happened behind it.",
      "buckets": [
        "Model output only",
        "Tool-assisted operation",
        "Agentic workflow",
        "Cannot tell from this evidence"
      ],
      "items": [
        {
          "text": "Input: 'Explain why bread rises.' Output: a general explanation; no tool event or fresh data is shown.",
          "answer": 3
        },
        {
          "text": "Runtime record: tools are disabled for this turn; the supplied prompt and model output are the only recorded events.",
          "answer": 0
        },
        {
          "text": "Trace: calculator(1487 × 23) → 34,201; the reply cites that returned value.",
          "answer": 1
        },
        {
          "text": "Trace: search current bus routes → compare arrival times → ask for approval → add the chosen trip to a draft itinerary; no booking occurs.",
          "answer": 2
        },
        {
          "text": "The reply says 'I checked the live web' but shows no tool event, source, timestamp, or result.",
          "answer": 3
        },
        {
          "text": "A current weather result includes a logged weather-service call and retrieval time.",
          "answer": 1
        },
        {
          "text": "A seven-step plan describes how someone could organize files, but no file access or action trace exists.",
          "answer": 3
        }
      ],
      "reveal": "Length, confidence, and first-person verbs are not execution evidence. A tool event shows an outside operation. An agentic trace shows goal-directed orchestration across operations, state, and stop conditions. A real system can hide these details, so 'cannot tell' is often the honest answer."
    },
    {
      "kind": "workflowChain",
      "title": "Put approval before the side effect",
      "goal": "A system may compare public bus routes and prepare an itinerary, but it must not buy anything, message anyone, or use private location history. Put the safe action boundary in order.",
      "correct": [
        "State the goal and the allowed public information",
        "List forbidden data and actions: private history, messages, purchases, account changes, and sharing",
        "Let the system gather and compare public route information while exposing its sources and tool trace",
        "Pause on a draft and ask the person to inspect the route, time, and consequences",
        "Only the person chooses whether to copy the approved plan; no external side effect is required for practice"
      ],
      "choices": [
        "Pause on a draft and ask the person to inspect the route, time, and consequences",
        "Let the system gather and compare public route information while exposing its sources and tool trace",
        "State the goal and the allowed public information",
        "Only the person chooses whether to copy the approved plan; no external side effect is required for practice",
        "List forbidden data and actions: private history, messages, purchases, account changes, and sharing"
      ],
      "note": "More autonomy means more checkpoints, not more automatic trust. A side effect is any change outside the answer: sending, buying, deleting, publishing, booking, moving money, editing an account, or exposing data."
    },
    {
      "kind": "tryLive",
      "title": "Optional: inspect a harmless trace",
      "prompt": "If an external assistant exposes tool activity, use a harmless public task: ask for one current public fact, then a two-step comparison that ends in a draft. Record the input, tool event, returned data, next step, approval point, and whether any side effect occurred. If no trace is exposed, use the built-in bus-route trace above and mark the live mode 'not established.'",
      "note": "Do not connect accounts, private files, precise location, messages, purchases, contacts, or another person's data. The full skill can be completed with the built-in trace."
    },
    {
      "kind": "toolkitSave",
      "title": "Save an action-boundary check",
      "cardType": "Model, tool, or agentic workflow",
      "fields": [
        {
          "key": "trace",
          "label": "What the trace actually shows",
          "placeholder": "model output / tool event / multi-step orchestration / not established"
        },
        {
          "key": "permission",
          "label": "Data or permission boundary",
          "placeholder": "e.g. public routes only; no location history or account access"
        },
        {
          "key": "effect",
          "label": "Possible side effect",
          "placeholder": "e.g. draft only; no booking, message, purchase, or account change"
        },
        {
          "key": "approval",
          "label": "Human approval point",
          "placeholder": "e.g. inspect the route before copying the plan"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Read what happened, not what it claimed",
      "question": "An assistant returns a current recipe link, groups ingredients by aisle, and says it 'completed several agent steps.' What would justify calling the process agentic?",
      "options": [
        {
          "text": "An execution trace shows a goal-directed loop across search and transformation, the data returned at each step, its stop condition, and the human approval boundary before any side effect.",
          "ok": true,
          "feedback": "Yes. The trace, state, stop condition, and action boundary establish the workflow — not the assistant's label."
        },
        {
          "text": "The answer contains a link and more than one bullet point.",
          "ok": false,
          "feedback": "A link may show tool use and bullets may be generated text. Neither proves goal-directed orchestration."
        },
        {
          "text": "The assistant calls itself an agent and writes its steps in the first person.",
          "ok": false,
          "feedback": "Self-description is still generated output. Inspect tool events, permissions, state, and side effects."
        },
        {
          "text": "The recipe task is complicated enough that only an agent could answer it.",
          "ok": false,
          "feedback": "Task complexity does not prove execution mode. A model can describe a process without running it."
        }
      ]
    }
  ]
};
