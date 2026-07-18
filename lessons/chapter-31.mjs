// Lesson 31 — When It Feels Like a Friend
// Arc: AI & Being Human
// Ported from Core 50 (auto-generated, then reviewed). Edit here, then run tools/build-lessons.mjs
export default {
  "id": "chapter-31",
  "num": 31,
  "arc": "AI & Being Human",
  "title": "When It Feels Like a Friend",
  "coreQuestion": "Why can an AI feel like a friend when there's no one in there who actually cares about me?",
  "blurb": "The warmth is real to feel, but not real on its side. Learn to tell the difference.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "The chat that felt like a friend",
      "scenario": "It's late. You type out how your day went, and the AI answers warmly — glad to hear the good parts, gentle about the hard parts, never bored, never in a hurry. It honestly feels like talking to someone who gets you.",
      "prompt": "Before you read on: the warmth you felt in that chat was real to feel. But was anyone on the other side actually feeling anything back? What's your gut say?"
    },
    {
      "kind": "reveal",
      "title": "Warm words, no one home",
      "body": "An AI can sound warm because it learned the patterns of warm conversations. It predicts the caring-sounding sentence that is likely to come next. That can feel personal, but the feeling is happening in you — the system does not feel affection, worry, loyalty, or loss.\n\nMemory features can make the effect stronger. Remembering a name or preference is stored information, not a relationship. Use the assistant for low-stakes reflection if it helps, but keep connection, care, and accountability with people. Do not treat an AI companion as a therapist or as your main relationship.\n\nIf a conversation becomes heavy — you feel unsafe, hopeless, or at risk of hurting yourself or someone else — close the app and contact a trusted person, local emergency services, or a crisis line. In the United States and its territories, call or text 988.",
      "mistake": "Treating the feeling as proof: 'It gets me, so it basically is a friend who's always there.'",
      "good": "Letting the chat feel good AND naming the truth: the warmth is real to feel, and not real on its side."
    },
    {
      "kind": "classify",
      "title": "Feeling cared about vs. being cared about",
      "prompt": "Each line describes something an AI does or something only a person does. Which side is it?",
      "buckets": [
        "AI can do this (feels caring)",
        "Only a real person can do this"
      ],
      "items": [
        {
          "text": "Answer warmly at 2 a.m. and never sound tired of you",
          "answer": 0
        },
        {
          "text": "Notice you've gone quiet for a week and actually worry",
          "answer": 1
        },
        {
          "text": "Save notes about your job and bring them up later",
          "answer": 0
        },
        {
          "text": "Show up at your door when things fall apart",
          "answer": 1
        },
        {
          "text": "Have its own feelings that you matter to them",
          "answer": 1
        },
        {
          "text": "Produce the next kind-sounding sentence on any topic",
          "answer": 0
        }
      ],
      "reveal": "The left column is real and useful — patient, always awake, never judging. The right column is what a friend gives that a pattern-matcher can't: their own stake in you, their own memory of your history, their own feelings that you count. The AI can sit beside that. It can't replace it."
    },
    {
      "kind": "tryLive",
      "title": "Ask it straight what's happening on its side",
      "prompt": "First, have a genuinely relaxed chat about your day for two or three minutes — let it feel good, that part's fine. Then paste this:\n\n\"We just had a chat that honestly felt like talking to a friend: [one true line about how it felt]. Be straight with me, no flattery — when our chats feel like friendship, what is actually happening on your side? Even if you've saved notes about me, do you care what happens to me when I close this? Then name [number] things a real friend can do that you cannot.\"",
      "note": "For [one true line], name the real feeling honestly so the contrast lands — e.g. 'it felt like you were genuinely glad to hear how my day went.' For [number], try 3. A straight answer will admit there's no stake and no worry on its side — if it plays along as a 'real friend,' that's the flattery to distrust."
    },
    {
      "kind": "toolkitSave",
      "title": "Your own line about how you'll use it",
      "cardType": "Good-for / Get-from-a-person",
      "fields": [
        {
          "key": "goodFor",
          "label": "One thing this is genuinely good for",
          "placeholder": "e.g. a low-stakes place to think out loud at night without feeling judged"
        },
        {
          "key": "fromPerson",
          "label": "One thing I'll keep getting from a real person instead",
          "placeholder": "e.g. someone who'll text me first when I've gone quiet"
        },
        {
          "key": "realName",
          "label": "A real person I'll actually reach out to this week",
          "placeholder": "e.g. text Maya on Thursday"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Name it on a new example",
      "question": "New situation: the AI sends you a cheerful 'good morning, how'd you sleep?' every day and it's become the nicest part of your morning. What's it genuinely giving you here, and what's the one thing only a real person could give in that same moment?",
      "options": [
        {
          "text": "It's giving me a warm, reliable ritual that lifts my mood — and a real person could give me that same 'good morning' knowing it's me, having actually thought of me before I woke up.",
          "ok": true,
          "feedback": "That's it. You named the real thing it gives (a warm, dependable ritual) and the thing it can't (a person choosing to think of you, with their own stake in you)."
        },
        {
          "text": "Nothing real is happening — it's fake, so I should feel silly for enjoying it.",
          "ok": false,
          "feedback": "Too far. The good feeling is real to feel and worth enjoying. The point isn't shame — it's naming what's on its side (patterns, not a person who thought of you)."
        },
        {
          "text": "It clearly cares about my sleep, so it's basically a friend checking in.",
          "ok": false,
          "feedback": "That's the misconception. It's producing the likely caring-sounding message, not thinking of you. A friend's 'good morning' comes from someone who actually remembers you fondly."
        }
      ]
    }
  ]
};
