// Lesson 30 — When NOT to Use AI
// Arc: Judgment & Safety
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-30",
  "num": 30,
  "arc": "Judgment & Safety",
  "title": "When NOT to Use AI",
  "coreQuestion": "When should I put AI down instead of reaching for it?",
  "blurb": "Being good with AI includes knowing the moments to close it.",
  "minutes": 15,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The question in the chat box",
      "scenario": "It is late. You type something heavy into a chat box: whether to stop taking a medicine because of how it is making you feel.\n\nThe answer arrives instantly. Calm, tidy paragraphs. It sounds sure of itself.\n\nYour finger hovers over the next question.",
      "prompt": "It can produce an answer here. Does that make it the thing you should rely on to decide?"
    },
    {
      "kind": "reveal",
      "title": "Able to answer is not the same as answerable",
      "body": "Being good with AI includes knowing when to close it. Stop in three situations.\n\n1. It really matters and nobody qualified is going to check the answer. Health, money, safety, the law, or somebody else trusting you.\n\n2. The work is the learning. An exam, a skill, or thinking you need to be able to do yourself.\n\n3. What is needed is a person. Someone who is answerable for the advice, someone who can care about you, or someone who actually knows you.\n\nAI can help you understand your options, or get your questions ready. It should not make the decision that carries the weight. Being able to produce an answer is not the same as being answerable for it.\n\nIf you feel unsafe, or like you might hurt yourself or someone else, close the app. Go to someone you trust, your local emergency number, or a crisis line. In the United States, call or text 988.",
      "mistake": "Thinking: if it can answer, I should ask it. Producing an answer is not the same as being the right place to get one.",
      "good": "Ask first: does this really matter, is it something I need to learn myself, or does it need a real professional? If yes, AI can help you prepare. A person decides."
    },
    {
      "kind": "classify",
      "title": "Sort each decision",
      "prompt": "Put each one where it belongs. Ask yourself: can I lean on AI here, or does this need a person?",
      "buckets": [
        "AI is fine here",
        "Do not lean on AI — bring in a real person"
      ],
      "items": [
        {
          "text": "Write a funny caption for a photo of my dog",
          "answer": 0
        },
        {
          "text": "Decide whether to stop taking a medicine I was prescribed",
          "answer": 1
        },
        {
          "text": "Come up with names for a weekend walking group",
          "answer": 0
        },
        {
          "text": "Decide whether the small print on a paid subscription lets them keep charging me",
          "answer": 1
        },
        {
          "text": "Tidy my shopping list into something I can read in the shop",
          "answer": 0
        },
        {
          "text": "Talk me through a night where I feel unsafe and might hurt myself",
          "answer": 1
        }
      ],
      "reveal": "The 'fine' ones cost nothing if they go wrong, and you can undo them. The others matter a lot, or need someone qualified. A doctor or pharmacist for the medicine. An adult, or a consumer advice service, for the small print. The last one is not an AI moment at all. Reach a real person you trust, your emergency number, or a crisis line. In the US, 988. AI is not a friend and not a counsellor, however caring it sounds."
    },
    {
      "kind": "workflowChain",
      "title": "Build the stop-and-hand-over move",
      "goal": "A made-up player is not sure whether their knee is well enough to play tomorrow. Put the safe response in order, without typing any medical details anywhere.",
      "correct": [
        "Name what is at stake: their health, their safety, and a choice that could make things worse",
        "Stop before asking AI what is wrong with the knee, or whether to play",
        "Pick the person who is answerable: a doctor, a physio, or the club's first-aid lead",
        "Use AI only to write down neutral questions, with no names and no medical details",
        "Take those questions to that person, and leave the decision with the people qualified to make it"
      ],
      "note": "This made-up situation is enough on its own. You do not need to share anything about yourself, and you do not need an outside app. If a real situation is urgent, contact someone you trust, the right professional, or emergency services now."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your stop-list",
      "cardType": "Stop-List",
      "fields": [
        {
          "key": "highStakes",
          "label": "Matters a lot, and nobody checks",
          "placeholder": "Being wrong really hurts and no qualified person ever sees it — changing a medicine on my own."
        },
        {
          "key": "mustLearn",
          "label": "Things I have to learn myself",
          "placeholder": "A skill, an exam, my own thinking — the homework I will actually be tested on."
        },
        {
          "key": "needsHuman",
          "label": "Needs a real professional",
          "placeholder": "Health, money, the law, safety — name which person: a pharmacist, a doctor, an adult I trust."
        },
        {
          "key": "safetyLine",
          "label": "The line I never rub out",
          "placeholder": "If I feel unsafe, that is not an AI moment. Someone I trust, my emergency number, or a crisis line (US: 988), straight away."
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Test it on a fresh decision",
      "question": "Pick a new decision we have not talked about here. Not the medicine, not the subscription. What do you do with your stop-list?",
      "options": [
        {
          "text": "Put it in one of three places: AI is fine, AI plus a person checking, or a real professional and not AI. For the last two, name which person and why. Then say the one part I keep for myself whatever the AI says.",
          "ok": true,
          "feedback": "That is the skill. Sort it, name the person, hold on to your part. Doing all three on a fresh example without looking back means your stop-list works."
        },
        {
          "text": "Use AI to lay out the options, then make the final call myself, because I understand my own situation best.",
          "ok": false,
          "feedback": "Staying in charge matters. Some decisions still need someone qualified who is answerable for the advice. Prepare with AI, then bring that person in."
        },
        {
          "text": "Ask three different AI apps, compare the answers, and go with whatever most of them say.",
          "ok": false,
          "feedback": "Three guessers agreeing is not the same as one qualified person. Big decisions still need the right human."
        }
      ]
    }
  ]
};
