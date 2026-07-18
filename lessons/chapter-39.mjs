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
      "prompt": "Before you read on: think of one real question you'd normally just hand over for the answer. What would you actually understand afterward — the topic, or just the AI's conclusion?"
    },
    {
      "kind": "reveal",
      "title": "The mechanism, and why 'partner' is only a way of using it",
      "body": "An AI assistant learned patterns from huge amounts of human writing and predicts the most likely next words. Because that's the mechanism — not truth-checking — a good answer and a confident wrong one can look identical. In 2026 these tools also browse the web, use other tools, and remember across chats, but they still hallucinate. 'Thinking partner' is a way of USING the AI, a comparison — not a claim about the tool. The AI has no goals and doesn't care whether you learn. You only get the thinking-partner effect because you wrote a prompt that forces YOU to do a reasoning step before it hands anything over. The win isn't the answer; it's that you stayed in the driver's seat and can now explain the thing in your own words.",
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
      "note": "Fully worked example: \"I want to think through whether I should take the harder class next term instead of the easy one, not just be handed the answer. Don't answer yet. First ask me 2 questions about how I'm currently thinking about it. After I reply, point out one assumption I'm making that might not be true — then let me take another go before you give your own view.\" Pick something real, not a trivia question. Actually answer its questions yourself before it gives any view."
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
          "text": "Get a clean final answer from the AI faster than before.",
          "ok": false,
          "feedback": "Speed to an answer isn't the win here. If you let it just answer, run the prompt again and do the reasoning steps yourself."
        },
        {
          "text": "Have the AI write the conclusion so you can hand it in.",
          "ok": false,
          "feedback": "Then you have a conclusion but you're no smarter. The point is that YOU can explain it afterward."
        },
        {
          "text": "Trust the AI's view because it browsed the web and sounded confident.",
          "ok": false,
          "feedback": "Confident and web-connected still doesn't mean checked — these tools predict likely words and can be confidently wrong. Reason it through yourself and verify anything load-bearing."
        }
      ]
    }
  ]
};
