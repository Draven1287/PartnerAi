// Lesson 50 — Your Toolkit and Where to Go Next
// Arc: Becoming a Builder
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-50",
  "num": 50,
  "arc": "Becoming a Builder",
  "title": "Your Toolkit and Where to Go Next",
  "coreQuestion": "How do I gather everything I learned into one reusable toolkit and prove it works on a brand-new task?",
  "blurb": "Turn the whole course into one page you can open and use — then graduate.",
  "minutes": 11,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The day after the last lesson",
      "scenario": "It's a week from now. You open a fresh chat to write something real. But all the moves you practiced — your rule for staying in charge, the prompts that worked, your way of working, your boundaries — are scattered across fifty lessons and half-remembered. So you type blind, like before.",
      "prompt": "Before you read on: if everything you learned lived on ONE page you could open right now, what four things would be on it?"
    },
    {
      "kind": "reveal",
      "title": "A kit, not a pile of tricks",
      "body": "Everything you built across this course isn't a pile of separate tricks — it's a kit. And a kit is only real when it lives on one page you can open and use on a task you've never seen before. Your four pieces: (1) your one-sentence RULE for staying in charge, (2) your PROMPT LIBRARY, the patterns you kept, (3) your WORKFLOW, your saved way of working, and (4) your BOUNDARIES, the lines you won't cross. One thing hasn't changed since lesson one: today's assistants browse the web, use tools, and remember across chats — but they still predict the most likely next words from patterns in human writing, and they still invent confident-sounding things. That's exactly why your boundaries stay in the kit: AI helps you prepare, but for health, money, or safety decisions a real professional decides — and AI is not a friend or a therapist. If you're ever in crisis, reach a person, not a chatbot (in the US, call or text 988).",
      "mistake": "Closing the course and trusting your memory to hold fifty lessons' worth of moves.",
      "good": "Gathering your four pieces onto one saved page, then running it on a real task the same day."
    },
    {
      "kind": "classify",
      "title": "Which piece is this?",
      "prompt": "Sort each line into the part of your toolkit it belongs to. This is you taking inventory before you assemble the page.",
      "buckets": [
        "Rule or Boundary",
        "Prompt or Workflow"
      ],
      "items": [
        {
          "text": "I read and decide on anything before it goes out with my name on it.",
          "answer": 0
        },
        {
          "text": "Goal / Context / Constraints / Format for any draft.",
          "answer": 1
        },
        {
          "text": "Never paste anyone's private info into a chat.",
          "answer": 0
        },
        {
          "text": "Draft rough, ask AI to critique it hard, rewrite in my own voice, fact-check, final read.",
          "answer": 1
        },
        {
          "text": "For health or money, AI helps me prepare but a real professional decides.",
          "answer": 0
        },
        {
          "text": "'Explain it back to me, then quiz me' when I'm learning something.",
          "answer": 1
        }
      ],
      "reveal": "Rules and boundaries are the lines that keep you in charge. Prompts and workflows are the moves that get the work done. A real toolkit page has all four — the lines AND the moves."
    },
    {
      "kind": "tryLive",
      "title": "Assemble it, then get tested",
      "prompt": "Help me assemble my personal AI toolkit, then test it. Here are my four pieces. My one-sentence rule: [your rule]. My prompt library: [your saved prompts]. My personal workflow: [your workflow steps]. My boundaries: [your lines]. First, organize these into one clean, labeled page I can keep and reuse. Then give me ONE realistic task I have not done before — about [an area of my life] — that forces me to use at least three of these tools together. Don't solve it for me; hand me the task and tell me which three tools it should exercise.",
      "note": "Fill every bracket with your own words — if a piece feels thin, jot a quick version now instead of skipping it. Example area: 'my schoolwork,' 'my job,' 'planning a family trip,' 'sorting my mail and bills.'"
    },
    {
      "kind": "toolkitSave",
      "title": "Save it where you'll actually find it",
      "cardType": "AI Toolkit Page",
      "fields": [
        {
          "key": "rule",
          "label": "My one-sentence rule",
          "placeholder": "I read and decide on anything before it goes out with my name on it."
        },
        {
          "key": "prompts",
          "label": "My prompt library",
          "placeholder": "Goal/Context/Constraints/Format for drafts; 'explain it back, then quiz me' for learning; 'list assumptions, evidence, uncertainty, and one check' for decisions."
        },
        {
          "key": "workflow",
          "label": "My workflow",
          "placeholder": "1) draft rough 2) AI critiques hard 3) I rewrite in my voice 4) fact-check 5) final read."
        },
        {
          "key": "boundaries",
          "label": "My boundaries",
          "placeholder": "Never paste private info; never send text I haven't read; health/money — a real professional decides."
        },
        {
          "key": "home",
          "label": "Where I saved it",
          "placeholder": "Pinned note / a doc titled 'My AI Toolkit' / starred chat."
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Graduation check",
      "question": "You ran the AI-handed task using your tools. Which result means you've actually passed — not just answered a quiz?",
      "options": [
        {
          "text": "I completed the new task using at least three of my own tools at once, and I can name them — 'I used my rule, my draft-and-critique workflow, and my no-private-info boundary.'",
          "ok": true,
          "feedback": "That's graduation. You didn't recall a fact — you did the skill on a task you'd never seen, with your own kit. Now pick your next track: Business & Work, School & Study, Creative, Everyday Life, or Builder / Maker. Take one first step in it."
        },
        {
          "text": "I read my toolkit page over carefully and it looks complete.",
          "ok": false,
          "feedback": "A tidy page isn't the finish line. The kit is only real once you run it on a genuinely new task and can point to the three tools you used."
        },
        {
          "text": "I asked the AI to grade my toolkit and it said it looked great.",
          "ok": false,
          "feedback": "The AI's praise is just predicted next words — it can't verify you used the tools. The proof is you doing the task and naming the three tools yourself."
        },
        {
          "text": "I memorized the names of my four pieces so I can list them.",
          "ok": false,
          "feedback": "Naming the parts is trivia. Passing is performance: solve a new task using three tools together, then say which three."
        }
      ]
    }
  ]
};
