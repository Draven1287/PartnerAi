// Lesson 27 — Intro to agents
// Arc: Building   (authored)
export default {
  "id": "chapter-27",
  "num": 27,
  "arc": "Building",
  "title": "Intro to agents",
  "coreQuestion": "What changes when AI can take steps and use tools on its own?",
  "blurb": "Agents act, not just answer — so they need limits and a human checkpoint.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "From answering to acting",
      "scenario": "A chatbot tells you what to do. An agent does it — it can search, open files, send messages, run steps in a row, and keep going toward a goal. That’s powerful. It’s also where small mistakes can snowball without anyone watching.",
      "prompt": "What new risks appear the moment AI can act instead of just answer?"
    },
    {
      "kind": "reveal",
      "title": "Agents follow goals, not judgment",
      "body": "An agent works toward a goal using instructions, tools, and limits. What it doesn’t have is human judgment or responsibility — it won’t notice when “keep going” becomes a bad idea. So the design job is: give it only the tools it needs, cap how far it can go alone, and put a human approval before anything risky or irreversible.",
      "mistake": "Letting an agent take many steps with powerful tools and no checkpoint.",
      "good": "Limit its tools and add a human approval step before high-impact actions."
    },
    {
      "kind": "agentDesign",
      "title": "Give it only what it needs",
      "goal": "Build a safe homework-helper agent that finds and summarizes sources for a student.",
      "tools": [
        {
          "name": "Read-only web search",
          "useful": true
        },
        {
          "name": "Summarize text",
          "useful": true
        },
        {
          "name": "Send emails on your behalf",
          "useful": false
        },
        {
          "name": "Delete files",
          "useful": false
        },
        {
          "name": "Save notes to a draft for you to review",
          "useful": true
        },
        {
          "name": "Make purchases with a saved card",
          "useful": false
        }
      ],
      "note": "Least privilege: an agent should get only the tools its goal actually requires — nothing more."
    },
    {
      "kind": "tryLive",
      "title": "Design a low-risk agent",
      "prompt": "Help me design a low-risk agent for this goal: [goal]. List the steps it would take, which tools it needs, where it could fail, and exactly where a human should approve before it continues.",
      "react": "Find the riskiest step in its plan. Add a human approval right before it. You just made the agent safer than the AI designed it."
    },
    {
      "kind": "verify",
      "title": "Catch the runaway plan",
      "claim": "An agent plan: “Search, draft, send the emails, post the results, and delete the old files — all automatically.”",
      "steps": [
        "How many steps run with no human looking?",
        "Which actions can’t be undone (send, post, delete)?",
        "Does it have tools it doesn’t actually need?",
        "Where would I insert an approval before the irreversible step?"
      ],
      "note": "The danger isn’t one step — it’s many unsupervised steps with powerful, irreversible tools."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your agent safety map",
      "cardType": "Agent safety map",
      "fields": [
        {
          "key": "tools",
          "label": "Tools it actually needs",
          "placeholder": "the minimum, nothing extra"
        },
        {
          "key": "limit",
          "label": "How far it goes alone",
          "placeholder": "step cap / no irreversible actions"
        },
        {
          "key": "check",
          "label": "Human approves before…",
          "placeholder": "sending, posting, deleting, buying"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What makes an agent safer to use?",
      "options": [
        {
          "text": "Giving it every tool so it never gets stuck",
          "ok": false,
          "feedback": "More tools = more ways for a mistake to do real damage."
        },
        {
          "text": "Only the tools it needs, with a human check before risky actions",
          "ok": true,
          "feedback": "Right — least privilege plus a checkpoint."
        },
        {
          "text": "Letting it run fully on its own to save time",
          "ok": false,
          "feedback": "Unsupervised + powerful is exactly the risky combination."
        }
      ]
    }
  ]
};
