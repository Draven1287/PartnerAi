// Lesson 21 — Creative work
// Arc: Applying   (authored)
export default {
  "id": "chapter-21",
  "num": 21,
  "arc": "Applying",
  "title": "Creative work",
  "coreQuestion": "If AI gives the idea, is it still mine?",
  "blurb": "AI generates options; your taste and direction decide what’s actually good.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "A hundred ideas, none of them yours",
      "scenario": "AI can spit out 50 song titles, 20 plot twists, or 10 logo directions in seconds. Most are generic. A few are interesting. But it can’t tell which one is right for what YOU’re making — only you can.",
      "prompt": "What part of creative work can AI never do for you?"
    },
    {
      "kind": "classify",
      "title": "Generated vs. directed",
      "prompt": "Sort each move by whether AI is generating raw material or YOU are providing the taste.",
      "buckets": [
        "AI generates options",
        "You provide taste & direction"
      ],
      "items": [
        {
          "text": "“Give me 15 directions for this poster.”",
          "answer": 0
        },
        {
          "text": "Choosing which direction fits your message",
          "answer": 1
        },
        {
          "text": "“List 10 plot twists.”",
          "answer": 0
        },
        {
          "text": "Deciding which twist your story has earned",
          "answer": 1
        }
      ],
      "reveal": "AI is a generator. Taste, judgment, and direction — knowing which option is actually right — stay human."
    },
    {
      "kind": "reveal",
      "title": "Taste is the human part",
      "body": "AI can brainstorm, prototype, and critique creative options at speed. But the goal, the taste, and the choice of which direction to commit to come from you. A pile of AI options is raw material; the creative act is selecting and refining.",
      "mistake": "Accepting the first generated idea because it’s there, not because it’s good for your goal.",
      "good": "Generate widely, then choose with intent and make it your own."
    },
    {
      "kind": "tryLive",
      "title": "Generate, then choose",
      "prompt": "Give me 5 different creative directions for [your project]. Make them genuinely different from each other — different mood, different angle. Don’t pick a favorite; that’s my job.",
      "react": "Choose ONE and write why it fits your goal better than the others. Then describe how you’d change it to make it yours."
    },
    {
      "kind": "compare",
      "title": "Catch the generic idea",
      "weak": "“Make my story better” → AI returns a polished but generic version that fits no particular vision.",
      "strong": "“My story is about quiet grief; give me 5 endings that stay understated” → options shaped by YOUR direction.",
      "why": "Without your direction, AI defaults to the average. With it, AI becomes a tool for your specific taste."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your creative brief",
      "cardType": "Creative brief",
      "fields": [
        {
          "key": "goal",
          "label": "What I’m making & the feeling",
          "placeholder": "mood, message, audience"
        },
        {
          "key": "use",
          "label": "I’ll use AI to…",
          "placeholder": "generate options / critique"
        },
        {
          "key": "mine",
          "label": "I decide…",
          "placeholder": "which direction, and how to make it mine"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What makes an AI-assisted creative work feel like yours?",
      "options": [
        {
          "text": "You used the very first idea it generated",
          "ok": false,
          "feedback": "That’s the average idea — no taste applied yet."
        },
        {
          "text": "You set the direction, chose with intent, and refined it",
          "ok": true,
          "feedback": "Right — generation is cheap; judgment is the creative act."
        },
        {
          "text": "It looks polished and professional",
          "ok": false,
          "feedback": "Polish isn’t point of view — generic can be polished too."
        }
      ]
    }
  ]
};
