// Lesson 18 — Studying & school
// Arc: Applying   (authored)
export default {
  "id": "chapter-18",
  "num": 18,
  "arc": "Applying",
  "title": "Studying & school",
  "coreQuestion": "How do I use AI on schoolwork without cheating myself?",
  "blurb": "A study workflow that quizzes, hints, and checks — before it ever gives an answer.",
  "minutes": 10,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Help that helps vs. help that hurts",
      "scenario": "Two students use AI for the same biology unit. One ends up understanding cell division. The other ends up with a perfect worksheet and a blank mind on test day. They used the exact same tool.",
      "prompt": "What did the first student do differently?"
    },
    {
      "kind": "workflowChain",
      "title": "Build the study workflow",
      "goal": "Use AI to actually learn a hard topic before a test — not just finish the worksheet.",
      "correct": [
        "Try the problem yourself first, even badly",
        "Ask AI to explain only the part you’re stuck on",
        "Re-explain the idea back in your own words",
        "Have AI quiz you without showing answers",
        "Check your answers against your notes or textbook"
      ],
      "note": "You start and you finish. AI only fills the gap in the middle — and it never replaces your own attempt."
    },
    {
      "kind": "reveal",
      "title": "AI as tutor, not ghostwriter",
      "body": "The learning-protecting workflow uses AI to quiz, hint, explain, and check — always after you’ve tried. The moment AI produces the finished answer you submit without understanding, it stopped teaching and started replacing you.",
      "mistake": "Copying AI’s solution “to save time” and never doing a problem yourself.",
      "good": "Do it first, get a hint, then prove you can do the next one alone."
    },
    {
      "kind": "tryLive",
      "title": "Run it on a real topic",
      "prompt": "I’m studying [topic] for a test. First quiz me with 3 questions, hardest last. Don’t show answers until I’ve tried. Then tell me what to review based on what I got wrong.",
      "react": "Do the quiz honestly. Paste what AI said you should review — was it the part you secretly knew was weak?"
    },
    {
      "kind": "compare",
      "title": "Catch disguised cheating",
      "weak": "“Write my lab report on photosynthesis so I can hand it in.”",
      "strong": "“Quiz me on photosynthesis, then check the explanation I wrote in my own words and tell me what’s missing.”",
      "why": "The weak one produces work that isn’t yours and teaches you nothing. The strong one makes you produce the understanding and uses AI to check it."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your study workflow",
      "cardType": "Study workflow",
      "fields": [
        {
          "key": "before",
          "label": "Before AI, I will…",
          "placeholder": "try it myself first"
        },
        {
          "key": "during",
          "label": "I’ll ask AI to…",
          "placeholder": "hint, quiz, explain the stuck part"
        },
        {
          "key": "after",
          "label": "To prove I learned it, I’ll…",
          "placeholder": "re-explain it / do one alone"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Which use of AI actually builds knowledge you’ll keep?",
      "options": [
        {
          "text": "AI writes the essay; you read it once",
          "ok": false,
          "feedback": "Reading isn’t the same as being able to do it yourself."
        },
        {
          "text": "You attempt it, AI quizzes you, you re-explain in your words",
          "ok": true,
          "feedback": "Right — you did the thinking; AI just stress-tested it."
        },
        {
          "text": "AI gives every answer so you can “check”",
          "ok": false,
          "feedback": "You’ll “check” your way into never learning it."
        }
      ]
    }
  ]
};
