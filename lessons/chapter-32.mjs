// Lesson 32 — Feelings, Support, and Its Limits
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-32",
  "num": 32,
  "arc": "AI & Being Human",
  "title": "Feelings, Support, and Its Limits",
  "coreQuestion": "Can AI help me with how I feel, and where does it stop and a real person start?",
  "blurb": "AI can help you find words for a feeling. It cannot care about you, and it cannot keep you safe.",
  "minutes": 13,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It is 11pm and you are typing to a chat app",
      "scenario": "The day was flat and heavy. You open a chat app and type how you feel.\n\nIt writes back something calm and kind. 'That sounds really hard. I am here for you.'\n\nIt even remembers you mentioned a rough week last month. For a second it feels like somebody gets you.",
      "prompt": "Is anything on the other side actually feeling something towards you? If not, what is really happening?"
    },
    {
      "kind": "reveal",
      "title": "What is really happening when it sounds warm",
      "body": "Kind words are a pattern it copied from human writing. It has read a huge amount of it. When you sound sad, sad-and-kind words are what fit next.\n\nThat can still help. It can help you name a feeling. It can turn a tangle in your head into a sentence. It can help you work out what to say to somebody.\n\nBut hold the line clearly. Remembering your details is not caring. Being awake at 3am is not friendship. Sounding calm is not being responsible for you.\n\nSo use it as a warm-up before a person. A good session ends with you knowing what to say, and who to say it to.\n\nThis lesson covers ordinary, everyday feelings only. If you feel unsafe, hopeless, or close to hurting yourself or anyone else, stop using the app. Reach a person you trust, your local emergency number, or a crisis line. In the United States and its territories, call or text 988.",
      "mistake": "Leaning on a chat app as your friend or counsellor, and reading calm words as care, judgement, or a safety plan.",
      "good": "Use it to find words for a small feeling. Then take those words to a real person who actually cares about you."
    },
    {
      "kind": "classify",
      "title": "When is a chat app fine, and when is it not?",
      "prompt": "Sort each one. Which are fine as a light warm-up for finding words? Which need a real human right now?",
      "buckets": [
        "Fine as a warm-up",
        "Go to a human or crisis line now"
      ],
      "items": [
        {
          "text": "Flat and tired after a long week, and you want words for it",
          "answer": 0
        },
        {
          "text": "Nervous about a conversation tomorrow and you cannot say why",
          "answer": 0
        },
        {
          "text": "Feeling hopeless, or like you might hurt yourself",
          "answer": 1
        },
        {
          "text": "A bit annoyed at a friend and unsure what the feeling even is",
          "answer": 0
        },
        {
          "text": "Feeling unsafe, or scared that somebody might hurt you",
          "answer": 1
        }
      ],
      "reveal": "Small everyday feelings are fine as a warm-up. Unsafe, hopeless or dangerous is a stop sign. Close the app and reach a person you trust or a crisis line right now. In the US, call or text 988. The app cannot keep you safe. A person can."
    },
    {
      "kind": "workflowChain",
      "title": "Build the handoff to a person",
      "goal": "A made-up person says the kind words from a chat app are not enough, and they need actual help. Put the response in order. You are not judging their feelings or working out how bad it is.",
      "correct": [
        "Do not ask for more private details, and do not score how serious it sounds",
        "Say the plain limit: an app cannot care, cannot be responsible, and cannot keep anyone safe",
        "Move towards a person they trust, a trained professional, a crisis line, or emergency services",
        "Use short, direct words to ask for help; nobody has to prove they deserve it",
        "Stay with the human route instead of going back to the app to feel better"
      ],
      "note": "This is a built-in safety exercise. It asks you to share nothing, and it gives no counselling. If this feels close to real danger, contact emergency services or crisis support now. In the US and its territories, call or text 988."
    },
    {
      "kind": "toolkitSave",
      "title": "Name your real person",
      "cardType": "My real-person card",
      "fields": [
        {
          "key": "supportType",
          "label": "One real person or service I could reach",
          "placeholder": "e.g. an adult I trust, a friend, a counsellor, a doctor, a local service"
        },
        {
          "key": "how",
          "label": "How I would reach them",
          "placeholder": "e.g. text, ring, or tell them in person this week"
        },
        {
          "key": "crisisline",
          "label": "A crisis number, written where I can see it",
          "placeholder": "US: call or text 988 · elsewhere: your local crisis or emergency number"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Did you do the skill?",
      "question": "A classmate says a chat app has become their main support, and tonight they feel unsafe. Which response treats them as capable and still moves towards real help?",
      "options": [
        {
          "text": "Take them seriously without demanding the whole story. Say plainly that an app cannot keep them safe. Help them reach an adult they trust, a crisis line, or emergency services now.",
          "ok": true,
          "feedback": "Yes. You did not question them or rank how bad it is. You moved from typed words to a person who can actually act."
        },
        {
          "text": "Ask the app for coping ideas first, then contact someone if none of them help.",
          "ok": false,
          "feedback": "Feeling unsafe is already the moment to bring a person in. Safety should not wait on whether some typed ideas work."
        },
        {
          "text": "Ask how bad it really is, get the full story, then decide if they need outside help.",
          "ok": false,
          "feedback": "Do not investigate someone before helping them. Take the signal seriously and connect them to someone who is answerable."
        }
      ]
    }
  ]
};
