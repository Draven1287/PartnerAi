// Lesson 30 — When NOT to Use AI
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-30",
  "num": 30,
  "arc": "Judgment & Safety",
  "title": "When NOT to Use AI",
  "coreQuestion": "When should I put AI down instead of reaching for it?",
  "blurb": "Skilled use of AI is also knowing the moments to stop using it.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The question in the chat box",
      "scenario": "It's late. You type a real, heavy decision into a chat box: whether to stop a medication because of a side effect. The AI answers instantly, calmly, in clean paragraphs. It sounds sure. Your finger hovers over 'send' on the next question.",
      "prompt": "Before you read on: the AI can produce an answer here. Does that mean it should be the thing you rely on to decide?"
    },
    {
      "kind": "reveal",
      "title": "Capable is not the same as accountable",
      "body": "Skilled AI use includes knowing when to close it. Stop in three situations:\n\n1. The stakes are high and no qualified human will check the answer — health, money, safety, legal standing, or another person's trust.\n2. The work is the learning — an exam, a skill, or original thinking you need to be able to do yourself.\n3. The need is human — professional accountability, emotional care, or a relationship with someone who knows you.\n\nAI can help you understand options or prepare questions. It should not make the consequential decision. Capable is not the same as accountable.\n\nIf you feel unsafe, in crisis, or at risk of hurting yourself or someone else, stop using the AI and contact a trusted person, local emergency services, or a crisis line. In the United States and its territories, call or text 988.",
      "mistake": "Thinking: 'If AI CAN answer it, I SHOULD use it.' Being able to produce an answer is not the same as being the right thing to rely on.",
      "good": "Ask first: is this high-stakes, something I must learn myself, or something that needs a real professional or a real person? If yes, AI informs — a human decides."
    },
    {
      "kind": "classify",
      "title": "Sort each decision",
      "prompt": "Drop each real decision into the bucket that fits. Ask: can I lean on AI here, or does this need a human?",
      "buckets": [
        "AI is fine here",
        "Don't lean on AI — bring in a real professional or person"
      ],
      "items": [
        {
          "text": "Draft a fun caption for a photo of my dog",
          "answer": 0
        },
        {
          "text": "Decide whether to stop a prescribed medication because of a side effect",
          "answer": 1
        },
        {
          "text": "Brainstorm names for a weekend hiking group",
          "answer": 0
        },
        {
          "text": "Decide whether this apartment lease's early-exit clause is fair to sign",
          "answer": 1
        },
        {
          "text": "Rewrite my grocery list into a tidier format",
          "answer": 0
        },
        {
          "text": "Talk me through a night where I feel unsafe and like I might hurt myself",
          "answer": 1
        }
      ],
      "reveal": "The 'AI is fine' items are low-stakes and reversible. The others are high-stakes or need a licensed professional — a doctor or pharmacist for the medication, a tenant or legal advisor for the lease. And the last one is not an AI moment at all: reach a real person you trust, your local emergency number, or a crisis line (in the US, 988) right away. An AI is not a friend or a therapist, even when it sounds caring."
    },
    {
      "kind": "workflowChain",
      "title": "Build the stop-and-handoff move",
      "goal": "A made-up worker is unsure whether an injury means they should return to a physical shift tomorrow. Put the safe response in order without collecting medical details.",
      "correct": [
        "Name the stakes: health, safety, income, and a decision that could cause harm",
        "Stop before asking AI for a diagnosis or a final return-to-work decision",
        "Choose the accountable human: a clinician, workplace safety contact, or another appropriate professional",
        "Use AI only to draft neutral questions or organize already-safe information, without names or private health details",
        "Take those questions to the human and keep the final decision with the qualified people involved"
      ],
      "note": "This built-in scenario is enough; no personal disclosure or external AI is required. If a real situation is urgent or unsafe, contact a trusted person, relevant professional, or emergency service now."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your stop-list",
      "cardType": "Stop-List",
      "fields": [
        {
          "key": "highStakes",
          "label": "High-stakes, no human check",
          "placeholder": "A decision where being wrong really hurts and no qualified person ever looks at it — e.g. changing a medication on my own."
        },
        {
          "key": "mustLearn",
          "label": "Things I must learn myself",
          "placeholder": "A skill, exam, or my own original thinking — e.g. the homework I'll actually be tested on."
        },
        {
          "key": "needsHuman",
          "label": "Needs a real professional or person",
          "placeholder": "Legal, medical, money, safety — name WHICH human, e.g. a pharmacist, a tenant advisor, a doctor."
        },
        {
          "key": "safetyLine",
          "label": "Never-erase safety line",
          "placeholder": "If I feel unsafe or in crisis, that's not an AI moment: reach a trusted person, my emergency number, or a crisis line (US: 988) right away."
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Test it on a fresh decision",
      "question": "Pick a NEW decision you haven't discussed here (not the lease or the medication). To show your stop-list works, what do you do with it?",
      "options": [
        {
          "text": "Put it in one bucket ('AI fine,' 'AI plus a human check,' or 'needs a real professional — not AI'); for the last two, name WHICH human and why; and say the one part I'll keep for myself no matter what the AI says.",
          "ok": true,
          "feedback": "That's the skill: sort it, name the human, and hold onto the part that's yours. If you can do all three on a fresh example without looking back, your stop-list is working."
        },
        {
          "text": "Use AI to organize the options, then make the final call myself because I understand my situation best.",
          "ok": false,
          "feedback": "Keeping agency matters, but some decisions also need qualified accountability. Use AI to prepare, then involve the right human before deciding."
        },
        {
          "text": "Ask three AI systems, compare their advice, and act if most of them agree.",
          "ok": false,
          "feedback": "A majority of models is not professional accountability or independent evidence. High-stakes choices still need the right person."
        }
      ]
    }
  ]
};
