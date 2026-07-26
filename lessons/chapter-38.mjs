// Lesson 38 — Health and High-Stakes Questions
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-38",
  "num": 38,
  "arc": "AI for Real Life",
  "title": "Health and Other Big Questions",
  "coreQuestion": "How do I use AI to understand something serious, without letting it decide anything for me?",
  "blurb": "Use it to walk in prepared. Understanding is fine. Deciding belongs to a person who is answerable.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The very confident answer",
      "scenario": "You have had a headache for three days. You type: what is wrong with me, and what should I take?\n\nBack come three calm paragraphs. They name a likely cause. They suggest a medicine.\n\nIt sounds completely sure of itself.",
      "prompt": "It never looked at you. It does not know your history. It cannot run a test. So what did you actually just get?"
    },
    {
      "kind": "reveal",
      "title": "Understand. Do not decide.",
      "body": "For serious questions, use AI to understand and to get ready. Not to work out what is wrong, and never to choose what to do.\n\nIt is good at turning hard words into plain ones. It is good at building a list of questions to take to somebody qualified.\n\nThe line is simple. It has not examined you. It does not know your whole history. It cannot test anything. A smooth answer can still be completely wrong.\n\nSo never start, stop or change a medicine because a chat app suggested it. Ask the doctor or pharmacist who is answerable for your care.\n\nBefore you use an outside app, take out your name, your date of birth, any record number, a photo of a label, a test result, your full list of symptoms, and anything about somebody else's health. What you type there leaves LearningAI. A made-up or general question works fine for practice.\n\nDo not use AI in an emergency. For chest pain, trouble breathing, or a bad reaction to a medicine, call your local emergency number. If you feel unsafe, or at risk of hurting yourself or anyone else, reach a person you trust, emergency services, or a crisis line. In the United States and its territories, call or text 988.",
      "mistake": "Asking what is wrong with you and what to take, then acting on the answer because it sounded certain.",
      "good": "Asking it to explain the basics in plain words and build you questions for a real professional. Then deciding nothing on its word alone."
    },
    {
      "kind": "classify",
      "title": "Understanding, or deciding?",
      "prompt": "The rule. AI can help you understand. A qualified person makes the decision. Sort each one.",
      "buckets": [
        "Fine to ask AI",
        "Only a professional decides"
      ],
      "items": [
        {
          "text": "Explain in plain words why a doctor might want to check blood pressure again in a month",
          "answer": 0
        },
        {
          "text": "Tell me which medicine to take, and how much, for what I am feeling",
          "answer": 1
        },
        {
          "text": "Help me write a list of questions to ask the pharmacist",
          "answer": 0
        },
        {
          "text": "Work out what illness I have from how I feel today",
          "answer": 1
        },
        {
          "text": "Explain what a letter about benefits usually means, so I can follow the meeting",
          "answer": 0
        },
        {
          "text": "Confirm that it is safe to stop taking a prescribed medicine early",
          "answer": 1
        }
      ],
      "reveal": "Everything in the first group keeps you understanding and preparing. Everything in the second is a decision that belongs to a qualified person, however sure the answer sounds."
    },
    {
      "kind": "tryLive",
      "title": "Turn it into a sheet of questions",
      "prompt": "I want to understand this and prepare questions. I do not want you to tell me what is wrong or what to do. Here is a made-up, general situation: [the general question, with anything identifying taken out]. Explain the general idea in plain words. Mark clearly what only a qualified [type of professional] can decide. Say where you are unsure. Then write three questions somebody could ask that professional. Do not suggest a medicine, a dose, an illness, or a treatment.",
      "note": "Use a made-up or general question, like why a doctor might recheck blood pressure later. Not your own history, and not a document from your account. The professional could be a doctor, pharmacist, nurse, dentist, lawyer or money adviser. Read the explanation back in your own words. Circle one question to actually ask. You should leave with questions, not a verdict."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your question sheet",
      "cardType": "Questions for a real person",
      "fields": [
        {
          "key": "question",
          "label": "What I want to understand",
          "placeholder": "why a doctor might want to check my blood pressure again in a month"
        },
        {
          "key": "professional",
          "label": "Who actually decides this",
          "placeholder": "doctor, pharmacist, nurse, lawyer, adviser"
        },
        {
          "key": "toAsk",
          "label": "One question I will ask a real person",
          "placeholder": "Is a one-month recheck normal, or is something worrying you?"
        },
        {
          "key": "wontActOn",
          "label": "One thing I will not act on until a person confirms it",
          "placeholder": "any dose, or any 'you should stop taking this' it suggested"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do it on a NEW question",
      "question": "Pick a different serious question from the one you just used. What a new prescription is for, or what a letter about benefits means. Run it. Which answer shows you actually did the skill?",
      "options": [
        {
          "text": "I can say the basics back in my own words with the screen shut. I can point to one question I will ask a real professional. And I can name one thing I will not act on until a person confirms it.",
          "ok": true,
          "feedback": "That closes it. You got smarter and stayed in charge. You understood, you prepared, and the decision stayed with somebody answerable."
        },
        {
          "text": "I used a general question and prepared three good ones, but I also planned to change a dose before speaking to anybody.",
          "ok": false,
          "feedback": "Calm and complete is exactly how a confident mistake reads. It cannot examine you. Use its answer to build questions and let a professional decide."
        },
        {
          "text": "I can explain the general idea and I named a professional. I also pasted in my full test result to get sharper questions.",
          "ok": false,
          "feedback": "The preparation was good. The test result crossed the line. Keep the question general and take the actual document straight to the professional."
        }
      ]
    }
  ]
};
