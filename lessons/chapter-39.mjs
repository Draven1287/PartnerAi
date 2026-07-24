// Lesson 39 — Thinking Partner, Not Answer Machine
// Arc: AI for Real Life
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-39",
  "num": 39,
  "arc": "AI for Real Life",
  "title": "Thinking Partner, Not Answer Machine",
  "coreQuestion": "How do I use AI so I walk away smarter, instead of just holding an answer I don't understand?",
  "blurb": "The biggest win from AI isn't the answer handed to you — it's your own thinking pushed further than you'd push it alone.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You have the answer. Are you any smarter?",
      "scenario": "You're stuck on a real decision — say, whether to take the harder class next term. You paste it into an AI, read the tidy answer, and go with it. A week later a friend asks why you chose it, and you realize you can repeat the AI's reasons but you can't actually explain them.",
      "prompt": "Before you read on, choose what you need from help: more options, a challenged assumption, missing evidence, or a final decision. Which of those should stay yours, and what could the AI safely help expose?"
    },
    {
      "kind": "reveal",
      "title": "The mechanism, and why 'partner' is only a way of using it",
      "body": "An AI assistant learned patterns from huge amounts of human writing and predicts likely language. Because that mechanism is not truth-checking, a useful suggestion and a confident error can look alike. 'Thinking partner' is a way of USING the tool, not a claim that it thinks or cares. You create the benefit by writing your own first view, choosing what evidence matters, and keeping the final decision. Before using an outside assistant, choose a low-stakes or invented decision and remove names, school or workplace details, money amounts, private messages, health information, and another person's data. What you enter leaves LearningAI.",
      "mistake": "Ask the lazy way, read the answer, and assume that because the AI could answer it, there was no point thinking about it yourself.",
      "good": "Ask in a way that makes you reason first — so you walk away understanding it, not just holding a conclusion."
    },
    {
      "kind": "classify",
      "title": "Lazy question or thinking-partner move?",
      "prompt": "Each line is something you might type. Sort whether it hands the thinking to the AI, or keeps you in the loop.",
      "buckets": [
        "Hands it over",
        "Keeps you thinking"
      ],
      "items": [
        {
          "text": "Just tell me: should I take the harder class or the easy one?",
          "answer": 0
        },
        {
          "text": "Don't answer yet — first ask me 2 questions about how I'm thinking about this.",
          "answer": 1
        },
        {
          "text": "Write my whole conclusion for me so I can paste it.",
          "answer": 0
        },
        {
          "text": "After I reply, point out one assumption I'm making that might not be true.",
          "answer": 1
        },
        {
          "text": "Give me the final answer in one sentence.",
          "answer": 0
        }
      ],
      "reveal": "The 'keeps you thinking' lines all make YOU produce a step before the AI gives its view. That's the whole move — not smarter software, a prompt that refuses to let you skip the reasoning."
    },
    {
      "kind": "tryLive",
      "title": "Run the thinking-partner prompt for real",
      "prompt": "I want to think through [a real question or decision you're actually chewing on], not just be handed the answer. Don't answer yet. First ask me [2 or 3] questions about how I'm currently thinking about it. After I reply, point out [one thing I seem to be missing — a blind spot, a weak assumption, an angle I skipped] — then let me take another go before you give your own view.",
      "note": "Worked example: 'I want to think through whether to join a weekend repair project or keep that time free. Do not decide for me. Ask two questions, identify one assumption, and name one fact I should check.' Use a low-stakes or invented situation with no identifying details. Answer the questions yourself, check any load-bearing claim independently, and record your reason before reading the assistant's view."
    },
    {
      "kind": "toolkitSave",
      "title": "Save the move as a reusable line",
      "cardType": "Prompt pattern",
      "fields": [
        {
          "key": "question",
          "label": "The question or decision",
          "placeholder": "whether to take the harder class next term"
        },
        {
          "key": "howMany",
          "label": "How many questions it asks first",
          "placeholder": "2"
        },
        {
          "key": "gap",
          "label": "The gap you want it to catch",
          "placeholder": "one assumption I'm making that might not be true"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Prove it on a brand-new question",
      "question": "Pick a completely new question — different from the one you just ran. You pass the skill when you can do which of these?",
      "options": [
        {
          "text": "Answer the AI's questions yourself before it gives any view, AND say one specific thing you now understand because you reasoned it through.",
          "ok": true,
          "feedback": "That's it. The skill is keeping yourself in the loop — you can explain it in your own words, not just repeat the AI."
        },
        {
          "text": "I used the AI to surface two options and a hidden assumption, then chose the fastest option without checking whether the assumption was true.",
          "ok": false,
          "feedback": "The tool widened the view, but the decision still rests on an unchecked assumption. Verify the load-bearing fact, then write your own reason."
        },
        {
          "text": "I wrote my own conclusion, but it mostly repeats the AI's reasons and I cannot explain which evidence changed my view.",
          "ok": false,
          "feedback": "Then you have a conclusion but you're no smarter. The point is that YOU can explain it afterward."
        },
        {
          "text": "I compared the AI's view with my first view, but treated its linked sources as verified without opening them.",
          "ok": false,
          "feedback": "Confident and web-connected still doesn't mean checked — these tools predict likely words and can be confidently wrong. Reason it through yourself and verify anything load-bearing."
        }
      ]
    }
  ]
};
