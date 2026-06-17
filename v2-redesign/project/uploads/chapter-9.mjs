// Lesson 9 — Models, tools & agents
// Arc: Understanding
export default {
  "id": "chapter-9",
  "num": 9,
  "arc": "Understanding",
  "title": "Models, tools & agents",
  "coreQuestion": "What is the difference between a model, a tool, and an agent?",
  "blurb": "Separate the brain, the instruments, and the doer before you trust the system.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "One AI, three different jobs",
      "scenario": "An app answers your question, searches the web, and adds a calendar reminder. People call all of it \"AI,\" but those are not the same job.",
      "prompt": "Which part is generating, which part is using a tool, and which part is acting for you?"
    },
    {
      "kind": "classify",
      "title": "Name the part",
      "prompt": "Sort each description into the closest bucket.",
      "buckets": [
        "Model",
        "Tool or agent"
      ],
      "items": [
        {
          "text": "Generates a draft email from your instructions",
          "answer": 0
        },
        {
          "text": "Opens a calculator to solve a precise equation",
          "answer": 1
        },
        {
          "text": "Searches a website for current ticket prices",
          "answer": 1
        },
        {
          "text": "Predicts likely next words in a paragraph",
          "answer": 0
        }
      ],
      "reveal": "The model generates. Tools fetch or do specific things. Agents combine steps toward a goal."
    },
    {
      "kind": "agentDesign",
      "title": "Pick tools for a safe agent",
      "goal": "Help plan a study session by checking a calendar, finding open time, and drafting a study checklist.",
      "tools": [
        {
          "name": "Calendar read access",
          "useful": true
        },
        {
          "name": "Checklist writer",
          "useful": true
        },
        {
          "name": "Bank account access",
          "useful": false
        },
        {
          "name": "Ability to delete files",
          "useful": false
        },
        {
          "name": "Timer or reminder tool",
          "useful": true
        }
      ],
      "note": "Give an agent only the tools it needs for the job. Extra power is extra risk."
    },
    {
      "kind": "reveal",
      "title": "Capability comes in layers",
      "body": "A model can generate text. A tool can retrieve, calculate, send, edit, or store. An agent uses a model plus tools to pursue a goal through multiple steps.",
      "mistake": "Trusting a system more just because it can act in the world.",
      "good": "Check the goal, permissions, tools, and stop conditions before letting anything act for you."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "For this task: \"[paste a task]\", split the AI system into model, tools, and agent behavior. Tell me what permissions are necessary, what permissions would be risky, and where a human should approve before action.",
      "note": "Try it with a real task like planning, email, research, or reminders."
    },
    {
      "kind": "toolkitSave",
      "title": "Save an agent safety checklist",
      "cardType": "Agent safety",
      "fields": [
        {
          "key": "goal",
          "label": "Agent goal",
          "placeholder": "what it should accomplish"
        },
        {
          "key": "tools",
          "label": "Allowed tools",
          "placeholder": "only what it needs"
        },
        {
          "key": "approval",
          "label": "Human approval required before...",
          "placeholder": "sending, buying, deleting, posting"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What makes an agent different from a plain model response?",
      "options": [
        {
          "text": "It is always smarter and always safer",
          "ok": false,
          "feedback": "No. More ability can mean more risk."
        },
        {
          "text": "It can use tools and take steps toward a goal",
          "ok": true,
          "feedback": "Right. That is why permissions and approval matter."
        },
        {
          "text": "It never needs human review",
          "ok": false,
          "feedback": "Opposite. Action usually needs clearer review."
        }
      ]
    }
  ]
};
