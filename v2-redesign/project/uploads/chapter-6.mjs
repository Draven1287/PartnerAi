// Lesson 6 — Data, training & patterns
// Arc: Understanding
export default {
  "id": "chapter-6",
  "num": 6,
  "arc": "Understanding",
  "title": "Data, training & patterns",
  "coreQuestion": "Where does an AI’s “knowledge” come from?",
  "blurb": "Training turns examples into patterns. Useful, but not the same as knowing.",
  "minutes": 9,
  "resources": [
    {
      "label": "Elements of AI — machine learning basics",
      "url": "https://www.elementsofai.com/"
    }
  ],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "It feels like it just knows",
      "scenario": "You ask an AI for a study plan, a poem, and a history summary. It answers all three like it has seen the inside of every classroom.",
      "prompt": "Where do you think that ability came from?"
    },
    {
      "kind": "classify",
      "title": "Training source or live fact?",
      "prompt": "Sort what comes from training patterns versus what would need a current source or tool.",
      "buckets": [
        "Training pattern",
        "Needs current source/tool"
      ],
      "items": [
        {
          "text": "Writing a sentence that sounds like a lab report",
          "answer": 0
        },
        {
          "text": "Knowing whether your school canceled practice today",
          "answer": 1
        },
        {
          "text": "Recognizing that \"photosynthesis\" belongs with plants and light",
          "answer": 0
        },
        {
          "text": "Checking the exact deadline on your teacher’s website",
          "answer": 1
        }
      ],
      "reveal": "Training gives the model patterns. Current facts need a current source, a tool, or your own check."
    },
    {
      "kind": "nextWord",
      "title": "Patterns become predictions",
      "stem": "In a recipe, after \"preheat the oven to\" you often see",
      "options": [
        {
          "word": "350°F",
          "p": 0.62
        },
        {
          "word": "medium",
          "p": 0.17
        },
        {
          "word": "tomorrow",
          "p": 0.04
        },
        {
          "word": "theory",
          "p": 0.02
        }
      ],
      "note": "The model is not opening a cookbook. It has learned which kinds of text usually follow other text."
    },
    {
      "kind": "reveal",
      "title": "Training is pattern learning",
      "body": "AI systems are trained on lots of examples so they can predict, classify, or generate new outputs that match patterns in those examples.",
      "mistake": "Treating training data like a perfect memory bank or a live database.",
      "good": "Use AI for pattern-heavy work, then verify any fact, quote, date, rule, or local detail."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Explain training data to me using one school analogy and one sports or arts analogy. Then list 5 things a trained model can do well and 5 things I should verify somewhere else.",
      "note": "Keep the verify list. It is the practical part."
    },
    {
      "kind": "toolkitSave",
      "title": "Save your pattern-vs-fact rule",
      "cardType": "Pattern vs fact",
      "fields": [
        {
          "key": "pattern",
          "label": "I can use AI for patterns like...",
          "placeholder": "examples, drafts, explanations"
        },
        {
          "key": "fact",
          "label": "I will verify facts like...",
          "placeholder": "dates, quotes, current rules"
        },
        {
          "key": "source",
          "label": "My first source check will be...",
          "placeholder": "teacher page / official site / textbook"
        }
      ]
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "What is the safest way to describe training?",
      "options": [
        {
          "text": "The model memorizes a perfect copy of every fact",
          "ok": false,
          "feedback": "No. Training learns patterns, and outputs can still be wrong."
        },
        {
          "text": "The model learns patterns from examples, then generates from those patterns",
          "ok": true,
          "feedback": "Exactly. That is useful, but it still needs verification."
        },
        {
          "text": "The model searches the web every time it answers",
          "ok": false,
          "feedback": "Not by default. Some AI tools can use search, but the model itself generates."
        }
      ]
    }
  ]
};
