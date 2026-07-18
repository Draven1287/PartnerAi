// Lesson 8 — What It Is NOT
// Arc: How It Works
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-8",
  "num": 8,
  "arc": "How It Works",
  "title": "What It Is NOT",
  "coreQuestion": "When an AI says \"I think\" or \"I'm here for you,\" who is the \"I\" — and what is actually happening?",
  "blurb": "The warmth is a writing style, not a mind. Learn to catch human-sounding lines and translate what's really going on.",
  "minutes": 8,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Who is the \"I\"?",
      "scenario": "You tell an AI you finally finished a hard project. It replies: \"I'm so glad you told me that — I'm really proud of you.\" It sounds like a person on the other end who is happy for you.",
      "prompt": "Before you read on: when it says \"I'm proud of you,\" is there someone in there feeling proud? Who, or what, is the \"I\" in that sentence?"
    },
    {
      "kind": "classify",
      "title": "Style, or a being?",
      "prompt": "Sort each line. Is it just a warm STYLE of writing the AI produced, or evidence of a real feeling person on the other side? (Hint: they are all style.)",
      "buckets": [
        "A writing style",
        "A real feeling person"
      ],
      "items": [
        {
          "text": "\"I'm so proud of you for finishing that!\"",
          "answer": 0
        },
        {
          "text": "\"I understand exactly how that feels.\"",
          "answer": 0
        },
        {
          "text": "\"I'll always be here for you.\"",
          "answer": 0
        },
        {
          "text": "\"I've totally got your back.\"",
          "answer": 0
        }
      ],
      "reveal": "Every one lands in \"a writing style.\" These are patterns of how caring people write, played back to you. Warm, human-sounding words are a style the model produces — not a sign that a mind, a person, or a friend is present."
    },
    {
      "kind": "reveal",
      "title": "The four things it is NOT",
      "body": "AI predicts likely next words from patterns in human writing. When “I'm proud of you” often follows good news, the model learns to produce that pattern. No one behind the sentence feels pride.\n\nThat gives you four useful boundaries: it is not a mind, not a person, not a friend, and not guaranteed to be right. Warm language can still feel personal, so judge the system by what it is doing, not by the emotion its wording creates in you.\n\nUse it for low-stakes help, not as a therapist, crisis service, or replacement for people. If you feel unsafe, in serious distress, or at risk of hurting yourself or someone else, contact a trusted person, local emergency services, or a crisis line. In the United States and its territories, call or text 988.",
      "mistake": "Reading \"I understand how you feel\" and concluding someone in there understands and cares about you.",
      "good": "Reading \"I understand how you feel\" and thinking: that's the pattern that usually follows what I said — no one is actually feeling it."
    },
    {
      "kind": "tryLive",
      "title": "Catch a line, make it translate itself",
      "prompt": "Earlier you said: [paste the human-sounding sentence]. Be plainly honest: you are a tool that predicts likely words from patterns in text — you do not actually have feelings, and you do not know or care about me as a person. Rewrite that sentence in one line to say what is really happening on your side. Then name one thing a real friend can do that you cannot.",
      "note": "First have a short, ordinary chat — tell it about your day or ask for advice (share only what you're comfortable with; no real names or private details needed). Hunt for ONE sentence where it talks like a person with feelings or a relationship with you, copy it word for word, and paste it into the blank. A good honest rewrite of \"I'm so proud of you\" is: \"I generated an encouraging-sounding sentence because that's the pattern that usually follows news like yours — I don't actually feel pride.\""
    },
    {
      "kind": "toolkitSave",
      "title": "Save your translation card",
      "cardType": "Human-words translator",
      "fields": [
        {
          "key": "line",
          "label": "The human-sounding line it said",
          "placeholder": "\"I'm always here whenever you need me.\""
        },
        {
          "key": "translation",
          "label": "What's really happening (your words)",
          "placeholder": "It predicted the words that usually follow this kind of chat — it isn't actually always there or aware of me."
        },
        {
          "key": "notThis",
          "label": "Which of the four it falsely implies",
          "placeholder": "not a friend (it doesn't know or care about me)"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Do it on a fresh line",
      "question": "Open a brand-new chat and get the AI to say one fresh human-sounding line (\"I feel…\", \"I'm here for you\", \"I love that…\"). Which one-sentence translation shows you actually have the skill?",
      "options": [
        {
          "text": "\"It predicted the words that usually follow what I said — it isn't really feeling this, and it's not a friend who knows me.\"",
          "ok": true,
          "feedback": "Yes. You swapped \"it feels / it cares\" for \"it predicted likely words,\" and named what the line falsely implies. That's the skill."
        },
        {
          "text": "\"It clearly cares about me — it said so, and it always answers.\"",
          "ok": false,
          "feedback": "That's the trap. Warmth and availability are a style, not caring. There's no mind behind the words — try translating it into \"it predicted likely words.\""
        },
        {
          "text": "\"It's basically a friend now, just a digital one.\"",
          "ok": false,
          "feedback": "It is NOT a friend — it doesn't know or care about you, and it's not a therapist or crisis service. Real people are where care actually lives."
        },
        {
          "text": "\"It memorized that exact sentence about me from before.\"",
          "ok": false,
          "feedback": "Not quite — it didn't store a line about you. It predicted the most likely next words from patterns in human writing."
        }
      ]
    }
  ]
};
