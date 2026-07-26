// Lesson 12 — Asking well
// Arc: Talking to AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-12",
  "num": 12,
  "arc": "Talking to AI",
  "title": "How to Ask So It Actually Helps",
  "coreQuestion": "How do I turn a vague ask into one that gets a genuinely useful answer?",
  "blurb": "An ask is an instruction, not a wish. Add four things and watch the answer sharpen.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The lazy one-liner",
      "scenario": "You open an AI app and type the first thing in your head: 'give me a study plan.'\n\nIt answers instantly. Seven days, no subject, nobody in particular.\n\nIt is fine. It is also useless to you.",
      "prompt": "Before you read on: the AI did not fail. Given only 'give me a study plan', what did it have to work with? What could you have told it?"
    },
    {
      "kind": "reveal",
      "title": "An ask is an instruction, not a wish",
      "body": "Remember how it works. The AI guesses the words that fit next, from patterns in a huge amount of human writing.\n\nWhat you type is called a prompt. It just means the words you give it to work from.\n\nSo the more you say about what you want, the fewer answers fit, and the closer it lands on you.\n\nThe fix is not a longer sentence. A long vague ask still gets a vague answer. Being specific is what helps, not being wordy.\n\nExtra words earn their place only when they tell it something real. That means your goal, who you are, your limits, and the shape you want back.",
      "mistake": "Padding a vague ask with more words: 'Please kindly provide a comprehensive and detailed study plan.' Still vague, just longer.",
      "good": "Telling it something real: what you want to do, who you are, your limits, and how the answer should look."
    },
    {
      "kind": "classify",
      "title": "Which part is missing?",
      "prompt": "Each line adds ONE real thing. Is it your Goal and Context — what you want to do, and who you are? Or your Constraints and Format — your limits, and the shape you want back?",
      "buckets": [
        "Goal / Context",
        "Constraints / Format"
      ],
      "items": [
        {
          "text": "'Help me make a 5-day plan for my biology test.'",
          "answer": 0
        },
        {
          "text": "'I am 15, the test is Friday, and cell diagrams confuse me.'",
          "answer": 0
        },
        {
          "text": "'I get 45 minutes a night and no weekends.'",
          "answer": 1
        },
        {
          "text": "'Give it to me as a short table, one row per day.'",
          "answer": 1
        },
        {
          "text": "'Put one practice question in each day.'",
          "answer": 1
        }
      ],
      "reveal": "Goal is what you want to DO. Not 'tell me about X' but 'help me do Y'. Context is who you are, so the answer fits you and not a stranger. Constraints are your limits and must-haves: time, money, reading level, things to leave out. Format is the shape you want back: a list, a table, three sentences, steps."
    },
    {
      "kind": "compare",
      "title": "Watch the gap open up",
      "weak": "'give me a study plan' -> a bland week-long plan, no subject, nobody in particular.",
      "strong": "'Goal: help me make a 5-day plan for my biology test. Context: I am 15, the test is Friday, cell diagrams confuse me. Constraints: 45 minutes a night, no weekends, one practice question a day. Format: a short table, one row per day.' -> a plan built around cell diagrams, cut to 45 minutes, with a question every day.",
      "why": "Same AI. The strong one just narrowed what could fit. Every part you added threw away a cloud of answers meant for somebody else."
    },
    {
      "kind": "promptRepair",
      "title": "Repair a vague ask without oversharing",
      "weak": "Make this better. Here is the whole private chat and everyone's names.",
      "fields": ["what I want to do", "the background it needs", "my limits", "the shape I want back"],
      "strong": "Help me [what I want to do]. The background you need is [the background it needs]. Stick to these limits: [my limits]. Give it back as [the shape I want back]. Do not invent facts you do not have. Ask me one question if you need to."
    },
    {
      "kind": "reveal",
      "title": "If you test it outside, send only what the job needs",
      "body": "If you take your repaired ask into an outside app, those words leave LearningAI. Swap real names, your school, account details, health information, exact addresses, and private messages for made-up stand-ins.\n\nThe repair above is what counts. Going outside is optional.\n\nOne more thing, about homework. Asking it to write your essay hands over the part that was supposed to teach you. Asking it to explain the step you are stuck on does not. You decide which of those you are asking for, and your Goal is where you say it.",
      "mistake": "Adding sensitive detail because more background sounds automatically better.",
      "good": "Add background that matters. Do not add yourself."
    },
    {
      "kind": "tryLive",
      "title": "Rebuild your own, one part at a time",
      "prompt": "Goal: [what you want to do]. Context: [who you are and your situation]. Constraints: [your limits and must-haves]. Format: [the shape you want back]. Write the answer, then tell me in one line which part of my ask shaped it most.",
      "note": "Add the parts one at a time and run it again after each. Goal, run. Add Context, run. Add Constraints, run. Add Format, run. Running again is cheap, because the chat still holds everything you said. Put your first answer and your last one side by side. That gap is the whole lesson. Only share background that matters, and no private details you do not need to hand over."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your four-part frame",
      "cardType": "Prompt frame",
      "fields": [
        {
          "key": "goal",
          "label": "Goal — what I want to do",
          "placeholder": "help me make a 5-day plan for my biology test"
        },
        {
          "key": "context",
          "label": "Context — who I am",
          "placeholder": "I am 15, the test is Friday, cell diagrams confuse me"
        },
        {
          "key": "constraints",
          "label": "Constraints — my limits",
          "placeholder": "45 min a night, no weekends, one question a day"
        },
        {
          "key": "format",
          "label": "Format — the shape I want back",
          "placeholder": "a short table, one row per day: topic, what to do, question"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "You have got it when...",
      "question": "Take a fresh weak ask you have not touched today: 'help me plan a birthday party', or 'write a message to my form tutor'. Add the four parts one at a time, running it again each time. What shows you actually get it?",
      "options": [
        {
          "text": "You can point at the single part that made the biggest difference for THAT ask, and say why.",
          "ok": true,
          "feedback": "Yes. The win is not memorising four words. It is knowing what each one is for, and seeing which did the heavy lifting here."
        },
        {
          "text": "You wrote the longest, most detailed ask you could.",
          "ok": false,
          "feedback": "Length is not the point. A long vague ask still gets a vague answer. Specific beats wordy every time."
        },
        {
          "text": "You got a good answer first try without changing anything.",
          "ok": false,
          "feedback": "Maybe you got lucky. The skill is steering. If you cannot name what shaped the answer, you cannot repeat it."
        },
        {
          "text": "You used the four words Goal, Context, Constraints, Format as headings.",
          "ok": false,
          "feedback": "The labels are only scaffolding. What matters is that you put something real under each one."
        }
      ]
    }
  ]
};
