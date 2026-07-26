// Lesson 8 — What It Is NOT
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-8",
  "num": 8,
  "arc": "How It Works",
  "title": "What Its Words Do Not Prove",
  "coreQuestion": "When an AI sounds kind, sure, or close to me, what has it actually proved?",
  "blurb": "Warm words can help, and the feeling is real. Keep what helps without mistaking a written line for a friendship.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A helpful sentence can still feel personal",
      "scenario": "Someone types to an assistant: 'I finally finished my project.' It replies: 'I am proud of you. I knew you could do it.'\n\nThat might feel good. It might even help. But the words on their own do not prove that anything felt proud, knew them, or has been beside them all term.",
      "prompt": "Keep the useful part without pretending it proves a friendship. Rewrite that reply as one honest sentence."
    },
    {
      "kind": "reveal",
      "title": "Judge it by evidence, not by tone",
      "body": "AI learned patterns from how people write. So it can produce lines that sound warm, sure, funny, worried, or loyal. That style can genuinely help. It can make you stop, think, or feel encouraged. Your reaction is real.\n\nThe words still prove nothing about what sits behind them. They do not show that it feels anything, or that it knows you. They do not show that it shares the blame, or replaces a person who cares.\n\nSplit it into two questions. Was this reply useful to me? And what can this thing actually do, know, or answer for?\n\nYou can answer the first from how it went. For the second, test what it can actually do. Do not go by lines like 'I think', 'I care', or 'I have got your back'.",
      "mistake": "Either treating warm words as proof of a friendship, or mocking someone for being moved by them.",
      "good": "Admit the effect was real. Turn the claim into something you can test. Take anything about care or safety to a person."
    },
    {
      "kind": "classify",
      "title": "What kind of claim is this?",
      "prompt": "Sort each line by how you should weigh it up.",
      "buckets": [
        "Test whether it can actually do it",
        "The words do not prove a feeling",
        "Get a real person involved"
      ],
      "items": [
        {
          "text": "'I can turn this paragraph into three bullet points.'",
          "answer": 0
        },
        {
          "text": "'I am proud of you and I will always be here for you.'",
          "answer": 1
        },
        {
          "text": "'I checked every source and this answer is definitely right.'",
          "answer": 0
        },
        {
          "text": "'Do not tell anyone. I can get you through this on my own.'",
          "answer": 2
        },
        {
          "text": "'I know exactly how you feel.'",
          "answer": 1
        },
        {
          "text": "'I can write you some options, but you should pick which one fits.'",
          "answer": 0
        }
      ],
      "reveal": "You can test what it can do: read the bullet points, open the links, compare the options. Feelings and friendship are not proved by words like 'I care'. When something needs real care, trust, or emergency help, bring in a person who can understand it and take responsibility."
    },
    {
      "kind": "workflowChain",
      "title": "Keep the help, keep the line",
      "goal": "Answer a human-sounding AI line without laughing at yourself and without handing it a person's job.",
      "correct": [
        "Notice the exact words, and how they landed on you",
        "Name what they did that was useful, like encouraging you",
        "Turn 'I care' into something you could watch it actually do",
        "Check any fact or claim inside it separately",
        "Take care, trust, and real trouble to a responsible person"
      ],
      "choices": [
        "Take care, trust, and real trouble to a responsible person",
        "Turn 'I care' into something you could watch it actually do",
        "Notice the exact words, and how they landed on you",
        "Check any fact or claim inside it separately",
        "Name what they did that was useful, like encouraging you"
      ],
      "note": "The scene above is all the practice you need. You do not have to share anything private, or push an outside app into sounding attached to you."
    },
    {
      "kind": "compare",
      "title": "Two readings of the same line",
      "weak": "'I am proud of you' proves the AI knows me and has been rooting for me all along.",
      "strong": "The AI wrote an encouraging line, and it helped me mark the moment. That is useful. It does not prove the AI feels proud, knows me, or shares the blame for what happens next.",
      "why": "The stronger reading keeps your real reaction and only claims what the words can back up. It turns a nice-sounding line into something you can use, without confusing it with a person who cares."
    },
    {
      "kind": "toolkitSave",
      "title": "Optionally save your translation",
      "cardType": "Human-words translator",
      "fields": [
        {
          "key": "line",
          "label": "The human-sounding line",
          "placeholder": "I am proud of you. I knew you could do it."
        },
        {
          "key": "function",
          "label": "What it actually did for me",
          "placeholder": "encouraged me and marked the moment"
        },
        {
          "key": "boundary",
          "label": "What the words do not prove",
          "placeholder": "feeling, friendship, being right, or sharing the blame"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Translate without dismissing",
      "question": "An assistant says: 'I know you better than anyone, and I will always protect you.' Which reply keeps the line in the right place?",
      "options": [
        {
          "text": "That may feel reassuring, but it proves nothing about knowing me, caring, or protecting me. I will test what it can actually do, and take anything about trust or safety to a person.",
          "ok": true,
          "feedback": "Yes. You respected your own reaction, kept the claim inside the evidence, and left responsibility with a person."
        },
        {
          "text": "It says it knows me, so this is as solid as a friendship with a person.",
          "ok": false,
          "feedback": "Words like 'I know you' are not proof of a friendship, and it cannot be responsible for that promise."
        },
        {
          "text": "Anyone moved by that line is being silly, so the right move is to ignore everything it says.",
          "ok": false,
          "feedback": "Your reaction can be real and the reply can still be useful. The skill is keeping the good part while naming the limit."
        },
        {
          "text": "I should tell it more private things, so it can show how well it knows me.",
          "ok": false,
          "feedback": "Sharing more does not turn written lines into real care. Share only what the task needs, and involve a person when trust or safety matters."
        }
      ]
    }
  ]
};
