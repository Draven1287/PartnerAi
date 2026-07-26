// Lesson 39 — Thinking Partner, Not Answer Machine
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-39",
  "num": 39,
  "arc": "AI for Real Life",
  "title": "Thinking Partner, Not Answer Machine",
  "coreQuestion": "How do I finish smarter, instead of just holding an answer I cannot explain?",
  "blurb": "The best thing you get from AI is not the answer. It is your own thinking pushed further than you would push it alone.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You have the answer. Are you any smarter?",
      "scenario": "You are stuck on a real choice. Say, whether to take the harder class next year.\n\nYou type it in, read the tidy answer, and go with it.\n\nA week later a friend asks why you chose it. You can repeat its reasons. You cannot actually explain them.",
      "prompt": "What do you need from help here? More choices. A challenge to something you assumed. A missing fact. Or the decision itself. Which of those should stay yours?"
    },
    {
      "kind": "reveal",
      "title": "Why 'partner' is a way of using it, not a claim about it",
      "body": "The thing answering you has read an enormous amount of writing. It guesses which words come next.\n\nNothing in that checks whether the words are true. So a genuinely good idea and a confident mistake come out looking exactly the same.\n\nCalling it a thinking partner is about how you use it. It does not think, and it does not care what you decide.\n\nYou create the value, in three ways. You write down your own view first. You choose which facts actually matter. You keep the decision.\n\nThis is the same split as 'do my homework for me' versus 'I am stuck on question 4, walk me through it'. The first hands over the part that was supposed to teach you. The second keeps it.\n\nIf you use an outside app, pick a small or made-up decision. Take out names, your school or job, amounts of money, private messages, health details, and anything about somebody else. What you type there leaves LearningAI.",
      "mistake": "Asking the lazy way, reading the answer, and deciding that because it could answer, there was no point thinking about it yourself.",
      "good": "Asking in a way that makes you reason first. Then you leave understanding it, not just holding it."
    },
    {
      "kind": "classify",
      "title": "Handing it over, or keeping it?",
      "prompt": "Each line is something you might type. Does it hand the thinking over, or keep you in it?",
      "buckets": [
        "Hands it over",
        "Keeps you thinking"
      ],
      "items": [
        {
          "text": "Just tell me. Harder class or easier class?",
          "answer": 0
        },
        {
          "text": "Do not answer yet. First ask me two questions about how I am thinking about this.",
          "answer": 1
        },
        {
          "text": "Write my whole conclusion so I can paste it in.",
          "answer": 0
        },
        {
          "text": "After I reply, name one thing I am assuming that might not be true.",
          "answer": 1
        },
        {
          "text": "Give me the final answer in one sentence.",
          "answer": 0
        }
      ],
      "reveal": "The lines that keep you thinking all make you produce something before it gives its view. That is the whole move. Not cleverer software. A request that will not let you skip the thinking."
    },
    {
      "kind": "tryLive",
      "title": "Run it on something you are actually chewing on",
      "prompt": "I want to think through [a real question or choice], not just be handed the answer. Do not answer yet. First ask me [2 or 3] questions about how I am currently thinking about it. After I reply, name [one thing I seem to be missing: a blind spot, a shaky assumption, an angle I skipped]. Then let me have another go before you give your own view.",
      "note": "Worked example: 'I want to think through whether to join a weekend repair project or keep that time free. Do not decide for me. Ask two questions, name one thing I am assuming, and name one fact I should check.' Use a small or made-up situation with nothing identifying in it. Answer the questions yourself. Check any fact the decision leans on. Write your reason down before you read its view."
    },
    {
      "kind": "toolkitSave",
      "title": "Save it as a line you can reuse",
      "cardType": "A way of asking",
      "fields": [
        {
          "key": "question",
          "label": "The question or the choice",
          "placeholder": "whether to take the harder class next year"
        },
        {
          "key": "howMany",
          "label": "How many questions it asks me first",
          "placeholder": "2"
        },
        {
          "key": "gap",
          "label": "The gap I want it to find",
          "placeholder": "one thing I am assuming that might not be true"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a brand-new question",
      "question": "Pick a completely different question from the one you just ran. When can you say you did the skill?",
      "options": [
        {
          "text": "I answered its questions myself before it gave any view. And I can name one specific thing I now understand because I worked it out.",
          "ok": true,
          "feedback": "That is it. You stayed in the loop. You can explain it in your own words instead of repeating its words."
        },
        {
          "text": "It showed me two choices and one hidden assumption. I picked the quickest choice without checking whether the assumption was true.",
          "ok": false,
          "feedback": "It widened the view. Your decision still rests on something unchecked. Check the fact it leans on, then write your own reason."
        },
        {
          "text": "I wrote my own conclusion, but it mostly repeats its reasons, and I cannot say which fact changed my mind.",
          "ok": false,
          "feedback": "Then you have a conclusion and you are no smarter. The point is that you can explain it afterwards."
        },
        {
          "text": "I compared its view with my first view, but I treated the links it gave as checked without opening them.",
          "ok": false,
          "feedback": "Sounding sure and having links is not the same as being right. It guesses words that fit. Open anything the decision depends on."
        }
      ]
    }
  ]
};
