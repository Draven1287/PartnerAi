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
      "body": "Everything you built is a personal operating system, not a pile of tricks. Keep six pieces on one page: your rule, reusable prompts, workflow, privacy and permission boundaries, human-approval stops, and evidence or disclosure record. Before an outside assistant sees the page, remove names, private examples, account details, confidential material, and another person's information; data entered there leaves LearningAI. Test on invented material first. AI may prepare or draft, but you approve anything sent, posted, spent, deleted, or used to affect a person. Verify claims with independent sources and disclose AI help when a reader, collaborator, customer, teacher, or policy reasonably needs to know. Health, money, legal, and safety decisions stay with an accountable professional. In a crisis, reach a person or local emergency support, not a chatbot.",
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
      "prompt": "Help me organize this redacted personal AI operating system: rule [rule]; reusable prompts [prompts]; workflow [steps]; privacy and permission limits [limits]; human-approval stops [stops]; evidence and disclosure record [record]. Do not add permissions or private examples. Then give me one invented task in [a broad area] that uses at least three pieces. Do not solve it. Ask me to name the consequence, permission boundary, approver, evidence, and disclosure before I begin.",
      "note": "Use your own words but remove all identifying or confidential details. Broad areas include a community event, repair, game, creative project, household plan, shift task, or study task. Test with invented data. The assistant can organize the page and pose a challenge; your decisions and recorded evidence are the proof."
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
          "text": "I completed a fresh invented task using at least three pieces, and can show the permission boundary, human approval point, independently checked evidence, and any disclosure the real version would need.",
          "ok": true,
          "feedback": "That's graduation. You didn't recall a fact — you did the skill on a task you'd never seen, with your own kit. Now pick your next track: Business & Work, School & Study, Creative, Everyday Life, or Builder / Maker. Take one first step in it."
        },
        {
          "text": "I tested three prompts and the outputs were consistent, but did not define what the tool may access or who approves an external action.",
          "ok": false,
          "feedback": "Consistent output does not show safe operation. Add least access, a named human approver, and a record of what happened on a fresh test."
        },
        {
          "text": "I asked the AI to audit the toolkit and accepted its report because it included citations and a high confidence score.",
          "ok": false,
          "feedback": "An AI-generated audit can suggest checks, but its confidence and citations are not the evidence. Open sources and test the operating controls yourself."
        },
        {
          "text": "I solved the task and verified one claim, but would let the workflow post or send the result automatically next time.",
          "ok": false,
          "feedback": "Verification is strong, but automatic posting removes the approval boundary. Keep a human stop before any external action."
        }
      ]
    }
  ]
};
