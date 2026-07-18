// Lesson 32 — Feelings, Support, and Its Limits
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-32",
  "num": 32,
  "arc": "AI & Being Human",
  "title": "Feelings, Support, and Its Limits",
  "coreQuestion": "Can AI help me with my feelings — and where does it stop and a real person begin?",
  "blurb": "AI can help you name a feeling, but it doesn't care about you and can't keep you safe — for anything serious, a human does.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It's 11pm and you're typing to a chatbot",
      "scenario": "You've had a flat, heavy day. You open an AI assistant and type how you feel. It writes back something calm and kind: 'That sounds really hard. I'm here for you.' It even remembers you mentioned a rough week last month. For a second it feels like someone gets you.",
      "prompt": "Before you read on: is the AI actually feeling anything toward you when it writes 'I'm here for you'? If not, what is really happening?"
    },
    {
      "kind": "reveal",
      "title": "What's really happening when AI sounds warm",
      "body": "Supportive language is a pattern the AI learned from human writing. It can help you name an everyday feeling, turn a tangle of thoughts into words, or prepare what you want to tell someone. The response may feel warm, but the system does not feel warmth toward you.\n\nKeep the boundary visible: stored facts are not care, availability is not friendship, and a fluent reply is not professional responsibility. Use AI to prepare for human connection, not replace it. A useful session should end with a clearer next step toward a real person when one is needed.\n\nThis lesson is only for ordinary, low-stakes feelings. If you feel unsafe, hopeless, or at risk of hurting yourself or someone else, stop using the AI and contact a trusted person, local emergency services, or a crisis line. In the United States and its territories, call or text 988.",
      "mistake": "Leaning on a chatbot as your friend or counselor — treating its calm words as care. Child-safety researchers (Common Sense Media with Stanford Medicine, 2025) rate using a chatbot as a friend or therapist an UNACCEPTABLE risk for anyone under 18, and it's a thin substitute for real people at any age.",
      "good": "Use AI as a warm-up to find words for a small feeling — then take those words to a real person who actually cares about you."
    },
    {
      "kind": "classify",
      "title": "When is AI okay for feelings — and when is it not?",
      "prompt": "Sort each situation. Which are fine to bring to an AI as a light word-finding warm-up, and which need a real human right now?",
      "buckets": [
        "Okay for an AI warm-up",
        "Go to a human / crisis line now"
      ],
      "items": [
        {
          "text": "Flat and tired after a long week, want words for it",
          "answer": 0
        },
        {
          "text": "Nervous about a conversation tomorrow and can't name why",
          "answer": 0
        },
        {
          "text": "Feeling hopeless or like you might hurt yourself",
          "answer": 1
        },
        {
          "text": "Mildly annoyed at a friend and unsure what the feeling is",
          "answer": 0
        },
        {
          "text": "Feeling unsafe or scared someone might hurt you",
          "answer": 1
        }
      ],
      "reveal": "Small, everyday feelings are fine as a light warm-up. Anything that feels unsafe, hopeless, or dangerous is a STOP-using-AI moment: go to a trusted person or a crisis line right now (US: call or text 988). AI cannot keep you safe — a person can."
    },
    {
      "kind": "tryLive",
      "title": "Ask AI to help you find words — nothing more",
      "prompt": "I'm feeling [rough description of the feeling], and I can't quite put it into words. Please offer me 3 or 4 plain words or short phrases that might describe what I'm feeling, and ask me one gentle question to help me think. Do NOT give advice or pretend to be my friend or counselor — just help me find words. [one line about the situation, optional]",
      "note": "Pick a small, everyday feeling from this week — flat after a long day, nervous about a talk, annoyed at someone. Keep it light; nothing raw. Worked example: 'I'm feeling kind of heavy and tired but not exactly sad, and I can't quite put it into words. Please offer me 3 or 4 plain words or short phrases that might describe what I'm feeling, and ask me one gentle question to help me think. Do not give advice or pretend to be my friend or counselor — just help me find words. It started after a long week with no real breaks.' Then do the real work: cross out words that don't fit, circle the one or two that do."
    },
    {
      "kind": "toolkitSave",
      "title": "Name your real person",
      "cardType": "My Real-Person Card",
      "fields": [
        {
          "key": "person",
          "label": "One real person I'd turn to",
          "placeholder": "e.g. my sister, a friend, my counselor, my GP"
        },
        {
          "key": "how",
          "label": "How I'd reach them",
          "placeholder": "e.g. text, call, tell them in person this week"
        },
        {
          "key": "crisisline",
          "label": "Crisis number, written where I can see it",
          "placeholder": "US: call or text 988 · elsewhere: your local crisis line / emergency number"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you do the skill?",
      "question": "On a NEW feeling you didn't use in the example, you ran the prompt. To have really got this, what do you do next?",
      "options": [
        {
          "text": "Say which word it offered actually fits and which missed, write the name of one real person you'd turn to if this got bigger, and finish: 'The AI helped me by ___, but it cannot ___ for me.'",
          "ok": true,
          "feedback": "That's it. You used AI to find words, judged them yourself, and named the human who actually matters. The AI was the warm-up; the person is the point."
        },
        {
          "text": "Keep chatting with the AI about the feeling until you feel better, treating it like a friend who gets you.",
          "ok": false,
          "feedback": "That's the misconception this lesson fixes. The AI predicts supportive words from patterns — it doesn't care about you and can't keep you safe. Take your words to a real person."
        },
        {
          "text": "Ask the AI to be your ongoing counselor so you always have someone to talk to.",
          "ok": false,
          "feedback": "No — a chatbot is not a counselor, and for under-18s that's rated an unacceptable risk (Common Sense Media + Stanford, 2025). For anything serious, defer to a real professional or trusted person; in crisis, call or text 988 (US)."
        }
      ]
    }
  ]
};
