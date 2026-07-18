// Lesson 5 — How It Learns
// Arc: First Contact
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-5",
  "num": 5,
  "arc": "First Contact",
  "title": "How It Learns",
  "coreQuestion": "Where do the AI's answers come from — its training, or the live web?",
  "blurb": "Most answers come from patterns it learned. But it can also go look things up live.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "You ask about something brand new",
      "scenario": "You type: \"What's the newest phone from the brand I follow?\" The AI answers instantly and sounds sure of itself. But wait — this phone came out last week. How could it possibly know? Or does it?",
      "prompt": "Before you read on: where do you think the AI got that answer — from something it read a long time ago, or by checking the internet right now?"
    },
    {
      "kind": "reveal",
      "title": "Three words that explain everything",
      "body": "The AI predicts the most likely next words from patterns in a huge pile of human writing it read during TRAINING — that's where most of its answers come from. Training stopped on a certain date (its TRAINING CUTOFF), so anything after that isn't baked in. But a modern assistant can also BROWSE: fetch fresh pages from the live web during your chat, when you ask. So two opposite beliefs are both wrong. It does NOT know everything, always up to date. And it is NOT frozen forever in the past. It remembers a lot from training, AND it can look things up live.",
      "mistake": "Assuming its instant answer about last week's news is current, because it sounded confident.",
      "good": "Noticing whether the answer came from training (may be stale) or from a live search (fresh), and asking it to search when the question is about something recent."
    },
    {
      "kind": "compare",
      "title": "Remembered vs. looked up",
      "weak": "You: What's the newest phone from [brand]? — AI: \"As of my last update, the latest was…\" (hedges, gives no links). This came from training. It can be stale.",
      "strong": "You: Search the web and show me your links. — AI: \"Searching… here's the current model, with sources\" [link] [link]. This was fetched live, just now.",
      "why": "This is a comparison to help it click. What's really happening: the first answer came from patterns learned during training; the second came from pages the assistant fetched live. \"Remembered\" and \"looked up\" are our shorthand — the AI isn't recalling the way a person does. The tell is real, though: a hedge with no links means training; links and a \"searched\" note mean live web."
    },
    {
      "kind": "classify",
      "title": "Training or web?",
      "prompt": "For each question, decide: can the AI answer it well from training, or does it need to search the live web? Ask yourself — does the answer depend on something recent or always-changing?",
      "buckets": [
        "Training can handle it",
        "Needs a live web search"
      ],
      "items": [
        {
          "text": "Explain how a rainbow forms.",
          "answer": 0
        },
        {
          "text": "What's the weather where I am tomorrow?",
          "answer": 1
        },
        {
          "text": "Who won the game last night?",
          "answer": 1
        },
        {
          "text": "What's the capital of France?",
          "answer": 0
        },
        {
          "text": "What's this year's application deadline for a program I want?",
          "answer": 1
        },
        {
          "text": "Summarize the plot of a classic novel.",
          "answer": 0
        }
      ],
      "reveal": "Recent or always-changing = search the web. Stable facts and general explanations = training is fine. Even in 2026, the assistant can browse, use tools, and remember across chats — but it can still get things wrong, so links matter."
    },
    {
      "kind": "tryLive",
      "title": "Feel the gap yourself",
      "prompt": "Send these as TWO separate messages.\n\nMessage 1: \"Answer this from your own knowledge first, no searching: [a question about something that changes over time]. Tell me roughly how current your answer is and what I should double-check.\"\n\nMessage 2: \"Now search the web, answer it again, and show me your links.\"",
      "note": "For the blank, pick something recent or always-changing so the two answers actually differ — e.g. \"Who is the current men's 100m world record holder?\" or \"What's the weather here tomorrow?\" Watch for the tell: message 1 hedges with no links (remembered); message 2 comes back with a \"searching\" note and sources (looked up). For anything about your health, double-check what it says with a real clinician — the AI is not a doctor."
    },
    {
      "kind": "exitCheck",
      "title": "Call it on your own new question",
      "question": "Invent a brand-new question of your own (not one from this lesson). Before running it, predict: \"training can handle this\" or \"this needs looking up\" — and say why. Then run it both ways. What proves you were right?",
      "options": [
        {
          "text": "I predicted, then pointed to the evidence: links and a \"searched\" note for looked-up, or a hedge like \"as of my training\" with no links for remembered.",
          "ok": true,
          "feedback": "That's the whole skill. Calling it correctly on your own example, with the evidence in hand, is the win."
        },
        {
          "text": "The AI sounded confident, so I trusted it was current.",
          "ok": false,
          "feedback": "Confidence isn't proof. A confident answer with no links may be stale training. Ask it to search and show links."
        },
        {
          "text": "I picked a stable fact like a capital city, so both answers were identical.",
          "ok": false,
          "feedback": "Then you can't see the gap. Pick something recent or always-changing so remembered and looked-up actually differ."
        }
      ]
    }
  ]
};
