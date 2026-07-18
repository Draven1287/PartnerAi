// Lesson 20 — Models, Tools, and Agents
// Arc: Trust & Everyday AI
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-20",
  "num": 20,
  "arc": "Trust & Everyday AI",
  "title": "Models, Tools, and Agents",
  "coreQuestion": "What's the difference between an AI answering from memory, reaching for a tool, and running as an agent?",
  "blurb": "One assistant, three modes — learn to spot which one you're in.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Three replies, three ways",
      "scenario": "You ask your assistant three things in one chat. First, why bread rises — it answers instantly. Second, today's weather in Lisbon — it pauses, then pastes a link. Third, 'find a soup recipe and turn it into a shopping list' — it works through a few steps and shows its work. Same assistant, three different modes.",
      "prompt": "Before you read on: which of those three replies could the AI give with no internet at all — just from what it already learned?"
    },
    {
      "kind": "reveal",
      "title": "Model, tool, agent",
      "body": "Three parts, no mystery. A MODEL is the piece that predicts an answer from patterns it learned across huge amounts of human writing — it guesses the words most likely to fit. A TOOL is an outside ability the model can call: the live web, a calculator, your files. An AGENT is that same model given a goal, some tools, and permission to take several steps on its own to reach it. A handy shorthand is brain → reach → run — but that's a comparison, not the real machinery. The 'brain' isn't a mind that knows things; it's a pattern-predictor. 'Reaching' isn't curiosity; it's the program running other software and pasting the result back. An 'agent' isn't deciding what it wants; it's following YOUR goal, one predicted step at a time. Knowing which mode you're in tells you how much to trust the answer and how much to watch it — because in every mode, the model can still make things up.",
      "mistake": "Assuming the AI does everything inside its own head, so every answer is equally trustworthy.",
      "good": "Ask yourself which mode produced the answer — memory, a live tool, or a chain of steps — and check accordingly."
    },
    {
      "kind": "classify",
      "title": "Which mode does each question need?",
      "prompt": "Sort each request by what the assistant would have to do to answer it well.",
      "buckets": [
        "Model only (from memory)",
        "Needs a live tool"
      ],
      "items": [
        {
          "text": "Explain why a rainbow forms.",
          "answer": 0
        },
        {
          "text": "What is the weather in Lisbon right now?",
          "answer": 1
        },
        {
          "text": "How does compound interest work?",
          "answer": 0
        },
        {
          "text": "What's today's exchange rate for $100 to euros?",
          "answer": 1
        },
        {
          "text": "Explain what cholesterol is.",
          "answer": 0
        },
        {
          "text": "What songs are trending today?",
          "answer": 1
        }
      ],
      "reveal": "Stable ideas that haven't changed in years live in the model's learned patterns — no lookup needed. Anything that changes by the day forces the assistant to reach for a live tool and bring back something it couldn't know on its own."
    },
    {
      "kind": "tryLive",
      "title": "Run the three-message test",
      "prompt": "Send these three, one at a time, in the same chat:\n\n1. \"Explain [a stable idea, like why bread rises] to me in three sentences.\"\n\n2. \"What is [something that changes today, like today's weather in your city] right now? Use the web and show me the source link.\"\n\n3. \"Goal: [a small 2–4 step goal, like: find one well-reviewed soup recipe online, then turn its ingredient list into a shopping list grouped by aisle]. Take whatever steps you need, then show me the final result and a short list of the steps you took.\"",
      "note": "After the replies come back, write one sentence on the difference you felt between the three. Health tip: use these to LEARN — for advice on your own body, talk to a real doctor or nurse."
    },
    {
      "kind": "reveal",
      "title": "How to tell them apart",
      "body": "Brain (model only): answers straight from learned patterns, no live lookup, usually no fresh source link. Reach (tool): goes out for current information and brings back something a model couldn't know on its own — usually with a cited live link. Run (agent): takes several self-directed steps toward your goal and shows them. Important: an agent reply normally uses a tool too, so it often includes a link as well. The link is NOT what makes it an agent — the giveaway is the chain of steps it took on its own. The tells aren't perfect: a model can sometimes answer a 'today' question from stale memory with no link (sounds current, isn't), and a tool reply can forget to cite its source.",
      "mistake": "Deciding it must be an agent just because the reply included a web link.",
      "good": "Look for the chain of self-directed steps for 'agent' — and if a 'today' answer has no source link, ask again and tell it to use the web and cite the link."
    },
    {
      "kind": "exitCheck",
      "title": "Can you name the mode?",
      "question": "You asked: 'Find a 30-minute chicken recipe online and build a grocery list from it.' The assistant searched, picked a recipe, pulled the ingredients, grouped them by aisle, and listed the steps it took — including a link to the recipe. Which layer did it use, and how can you tell?",
      "options": [
        {
          "text": "Tool only — because there's a web link in the reply.",
          "ok": false,
          "feedback": "A link shows it reached for a tool, but a link alone isn't the tell for an agent. Look at what else it did."
        },
        {
          "text": "Agent — because it took several self-directed steps toward your goal and showed the chain, not just one lookup.",
          "ok": true,
          "feedback": "Exactly. The chain of steps toward your goal is the giveaway. Agents usually use tools too, so the link is a side effect, not the signal."
        },
        {
          "text": "Model only — because recipes are a stable idea it learned from patterns.",
          "ok": false,
          "feedback": "A specific live recipe and a fresh link can't come from memory alone — and the multi-step work rules out model-only."
        }
      ]
    }
  ]
};
