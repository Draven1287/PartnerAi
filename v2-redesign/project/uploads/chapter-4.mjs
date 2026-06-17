// Lesson 4 — What an LLM is, without the magic
// Arc: Orientation
export default {
  "id": "chapter-4",
  "num": 4,
  "arc": "Orientation",
  "title": "What an LLM is, without the magic",
  "coreQuestion": "Why is it so fluent, and why can it still be confidently wrong?",
  "blurb": "Tokens, context, and likely next words become your control points.",
  "minutes": 9,
  "resources": [],
  "steps": [
    {
      "kind": "coldOpen",
      "title": "Fluent, and still wrong",
      "scenario": "Your model writes a smooth paragraph but skips one requirement you clearly stated.",
      "prompt": "What do you think happened inside?"
    },
    {
      "kind": "nextWord",
      "title": "Predict the next word",
      "stem": "The capital of France is",
      "options": [
        {
          "word": "Paris",
          "p": 0.94
        },
        {
          "word": "a",
          "p": 0.03
        },
        {
          "word": "beautiful",
          "p": 0.02
        },
        {
          "word": "banana",
          "p": 0.01
        }
      ],
      "note": "An LLM picks likely next tokens from context. Fluency comes from \"what usually follows,\" not from looking anything up."
    },
    {
      "kind": "reveal",
      "title": "Context is the steering wheel",
      "body": "An LLM predicts likely next tokens given your context and its training. If a key constraint is missing or buried, output drifts — confidently.",
      "mistake": "Assuming it \"remembers\" everything like a person.",
      "good": "State constraints explicitly, set an output format, and ask for a self-check."
    },
    {
      "kind": "compare",
      "title": "Where it goes wrong",
      "weak": "Write about the French Revolution. (then later) Also keep it under 100 words.",
      "strong": "In under 100 words, write about the French Revolution for a 9th grader. End by listing the 2 facts I should double-check.",
      "why": "Front-loading the constraint and asking for a verification list fights the \"drift\" you just saw."
    },
    {
      "kind": "tryLive",
      "title": "Try it for real",
      "prompt": "Give me one 2-minute exercise that teaches a friend the difference between fluency and truth, using a single AI answer as the example.",
      "note": "Bonus: run the exercise and see if they get fooled."
    },
    {
      "kind": "exitCheck",
      "title": "Quick check",
      "question": "Why can an LLM be fluent but wrong?",
      "options": [
        {
          "text": "It predicts likely text, which is not the same as verified fact",
          "ok": true,
          "feedback": "Right — likelihood ≠ truth."
        },
        {
          "text": "It is broken",
          "ok": false,
          "feedback": "No — this is normal behavior to design around."
        },
        {
          "text": "It is lying on purpose",
          "ok": false,
          "feedback": "No intent — it has no notion of truth unless you add tools/checks."
        }
      ]
    }
  ]
};
