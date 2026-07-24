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
      "mistake": "Leaning on a chatbot as a friend or counselor and treating calm language as care, professional judgment, or a safety plan.",
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
      "kind": "workflowChain",
      "title": "Build the safe support handoff",
      "goal": "An invented person says a chatbot's supportive words are not enough and they need actual help. Put the response in order without diagnosing or grading their feelings.",
      "correct": [
        "Do not ask for more personal details or try to score how serious the feeling is",
        "State the boundary: AI cannot provide care, professional responsibility, or physical safety",
        "Move toward a trusted person, qualified professional, local crisis service, or emergency service as the situation requires",
        "Use direct, simple words to ask for help; do not make the person prove they deserve support",
        "Stay with the human support route instead of returning to the chatbot for reassurance"
      ],
      "note": "This is a built-in safety exercise. It asks for no disclosure and gives no counseling. If this resembles a real immediate danger, contact local emergency services or crisis support now (US and territories: call or text 988)."
    },
    {
      "kind": "toolkitSave",
      "title": "Name your real person",
      "cardType": "My Real-Person Card",
      "fields": [
        {
          "key": "supportType",
          "label": "One kind of real support available to me",
          "placeholder": "e.g. trusted adult, friend, counselor, doctor, local support service"
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
      "question": "Fresh scenario: a classmate says an AI chat has become their main support and tonight they feel unsafe. Which response respects their agency and moves toward real help?",
      "options": [
        {
          "text": "Take them seriously without demanding details, say the AI cannot keep them safe, and help them contact a trusted adult, crisis service, or emergency service now.",
          "ok": true,
          "feedback": "Yes. You did not diagnose or interrogate them; you moved from generated words to accountable human support."
        },
        {
          "text": "Ask the AI for a list of coping ideas first, then contact someone if none of them work.",
          "ok": false,
          "feedback": "Feeling unsafe is already the point to involve human support. Do not make safety depend on whether generated ideas work first."
        },
        {
          "text": "Ask how serious the situation is, collect the full story, and decide whether they really need outside help.",
          "ok": false,
          "feedback": "Do not grade or investigate a disclosure before helping. Treat the safety signal seriously and connect them to accountable support."
        }
      ]
    }
  ]
};
